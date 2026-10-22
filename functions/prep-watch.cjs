const { createHash, randomUUID } = require('node:crypto');

class WatchError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const fail = (code, message) => { throw new WatchError(code, message); };
const hash = value => createHash('sha256').update(value).digest('hex');
const segment = value => String(value || '').replace(/[^a-zA-Z0-9_-]/g, '-');
const durationOK = value => Number.isFinite(value) && value > 0 && value <= 21600;

function videoDescriptor(passage) {
  const video = passage.video || {};
  const raw = video.embedUrl || passage.videoEmbedUrl || video.url || video.src || passage.videoUrl || '';
  let id = '';
  try {
    const url = new URL(raw);
    if (['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com','youtube-nocookie.com'].includes(url.hostname)) {
      id = url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] || '';
    } else if (url.hostname === 'youtu.be') id = url.pathname.slice(1);
  } catch {}
  const version = String(video.updatedAt || passage.videoUpdatedAt || '');
  if (/^[\w-]{11}$/.test(id)) return { provider:'youtube', videoId:id, videoKey:`youtube:${id}:${version}` };
  let storagePath = video.storagePath || passage.videoStoragePath || '';
  if (!storagePath) {
    try { const url = new URL(raw); if (url.hostname === 'firebasestorage.googleapis.com') storagePath = decodeURIComponent(url.pathname.split('/o/')[1] || ''); } catch {}
  }
  if (typeof storagePath === 'string' && storagePath.startsWith('prep-videos/') && !/[\\\x00-\x1f]/.test(storagePath) && storagePath.split('/').every(part => part && part !== '.' && part !== '..')) {
    return { provider:'storage', storagePath, videoKey:`storage:${storagePath}:${version}`, duration:Number(video.durationSeconds || passage.videoDurationSeconds) };
  }
  fail('failed-precondition', '이 영상 형식은 자동 기록을 지원하지 않습니다.');
}

function authorizedMaterial(profile, material, uid, index) {
  if (!profile || profile.loginDisabled || profile.role !== 'student' || !Array.isArray(profile.classIds) || !profile.classIds.length || profile.classIds.includes('class-grammar-only')) fail('permission-denied', '활성 학생 계정이 필요합니다.');
  if (!material || material.accessSchemaVersion !== 1 || !Array.isArray(material.classIds) || material.classIds.length !== 1 || typeof material.classIds[0] !== 'string' || !material.classIds[0] || !Array.isArray(material.targetUserIds)) fail('permission-denied', '검토된 반별 자료가 필요합니다.');
  const classId = material.classIds[0];
  const assigned = material.assignmentMode === 'personal' ? material.targetUserIds?.includes(uid) : material.assignmentMode === 'class' && profile.classIds.includes(classId);
  const passage = material.payload?.passages?.[index];
  if (!assigned || !Array.isArray(material.payload?.passages) || !passage || !Array.isArray(material.payload.classAssignments) || !material.payload.classAssignments.some(entry => entry.classId === classId && Array.isArray(entry.passageIndexes) && entry.passageIndexes.includes(index))) fail('permission-denied', '배정된 영상만 기록할 수 있습니다.');
  return { passage, ...videoDescriptor(passage) };
}

function mergeRanges(ranges, addition, duration) {
  const sorted = [...ranges, ...(addition ? [addition] : [])].map(range => Array.isArray(range) ? range : [range.start,range.end]).map(([a,b]) => [Math.max(0,a), Math.min(duration,b)]).filter(([a,b]) => b > a).sort((a,b) => a[0]-b[0]);
  const merged = [];
  for (const range of sorted) {
    const last = merged.at(-1);
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1],range[1]);
    else merged.push(range.slice());
  }
  if (merged.length > 2000) fail('resource-exhausted', '시청 구간이 너무 많습니다. 관리자에게 문의해 주세요.');
  return merged.map(([start,end]) => ({start,end}));
}

function advance(progress, session, sample, now) {
  if (sample.sequence === session.sequence && sample.requestId === session.requestId && JSON.stringify(sample) === session.lastSample) return { progress, session, duplicate:true };
  if (sample.sequence !== session.sequence + 1) fail('failed-precondition', '시청 기록 순서가 달라졌습니다. 다시 연결해 주세요.');
  const elapsed = (now - session.lastAt) / 1000;
  if (elapsed < 0) fail('failed-precondition', '서버 시간 확인이 필요합니다.');
  const position = Math.min(progress.duration, sample.position);
  const delta = position - session.position;
  // shortcut: telemetry cannot prove attention; the server bounds credit by its clock, not the student's claimed totals.
  const changingRate = sample.state === 'ratechange';
  // Queued event intervals consume, but never create, server-measured time. Long gaps discard the budget.
  const budget = elapsed <= 15 ? Math.min(15, (session.timeBudget || 0) + elapsed) : 0;
  const interval = sample.elapsedSeconds === undefined ? elapsed : sample.elapsedSeconds;
  const allowed = Math.min(interval, budget);
  const continuous = session.state === 'playing' && sample.state !== 'seeking' && (sample.rate === session.rate || changingRate) && allowed > 0 && elapsed <= 15 && delta > 0 && Math.abs(delta - interval * session.rate) <= 2;
  const credited = continuous ? Math.min(delta, allowed * session.rate) : 0;
  const ranges = mergeRanges(progress.watchedRanges || [], credited ? [position-credited,position] : null, progress.duration);
  const watchedSeconds = ranges.reduce((sum,range) => sum+range.end-range.start,0);
  const completed = !!progress.completed || (sample.state === 'ended' && position >= progress.duration-1.5 && watchedSeconds / progress.duration >= 0.95);
  const updatedAt = new Date(now).toISOString();
  return { progress:{...progress, watchedRanges:ranges, watchedSeconds, playSeconds:(progress.playSeconds || 0) + credited / session.rate,
    completed, done:completed, completedAt:completed ? (progress.completedAt || updatedAt) : '', updatedAt},
    session:{...session, position, rate:sample.rate, state:changingRate ? (session.state === 'playing' ? 'playing' : 'paused') : sample.state, sequence:sample.sequence, requestId:sample.requestId, lastSample:JSON.stringify(sample), lastAt:now,
      timeBudget:sample.elapsedSeconds === undefined ? 0 : budget - allowed} };
}

function validate(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) fail('invalid-argument', '잘못된 시청 요청입니다.');
  const keys = data.action === 'start' ? ['action','materialId','passageIndex','videoKey','requestId'] : ['action','materialId','passageIndex','videoKey','requestId','sessionId','sequence','position','rate','state','elapsedSeconds'];
  if (Object.keys(data).some(key => !keys.includes(key)) || !['start','sample'].includes(data.action)) fail('invalid-argument', '허용되지 않은 시청 필드입니다.');
  if (typeof data.videoKey !== 'string' || !data.videoKey || data.videoKey.length > 2048) fail('invalid-argument', '영상 식별자를 확인해 주세요.');
  if (typeof data.materialId !== 'string' || !data.materialId || data.materialId.length > 256 || /[\/\\\x00-\x1f]/.test(data.materialId) || ['.','..'].includes(data.materialId) || !Number.isInteger(data.passageIndex) || data.passageIndex < 0 || data.passageIndex > 10000 || typeof data.requestId !== 'string' || !/^[\w-]{16,80}$/.test(data.requestId)) fail('invalid-argument', '자료와 요청 식별자를 확인해 주세요.');
  if (data.action === 'sample' && (typeof data.sessionId !== 'string' || !/^[\w-]{16,80}$/.test(data.sessionId) || !Number.isInteger(data.sequence) || data.sequence < 1 || !Number.isFinite(data.position) || data.position < 0 || data.position > 21600 || !Number.isFinite(data.rate) || data.rate < 0.25 || data.rate > 2 || !['playing','paused','ended','seeking','ratechange'].includes(data.state))) fail('invalid-argument', '잘못된 재생 상태입니다.');
  if (data.elapsedSeconds !== undefined && (!Number.isFinite(data.elapsedSeconds) || data.elapsedSeconds < 0 || data.elapsedSeconds > 15)) fail('invalid-argument', '잘못된 재생 상태 간격입니다.');
}

function createWatchService({ db, resolveDuration, clock = Date.now, uuid = randomUUID }) {
  return async function record(uid, data) {
    if (!uid) fail('unauthenticated', '로그인이 필요합니다.');
    validate(data);
    const profileRef = db.doc(`users/${uid}`), materialRef = db.doc(`portalPrepSets/${data.materialId}`), sessionRef = db.doc(`prepWatchSessions/${uid}`);
    let expectedVideo, duration;
    if (data.action === 'start') {
      const [profile, material] = await Promise.all([profileRef.get(), materialRef.get()]);
      expectedVideo = authorizedMaterial(profile.data(),material.data(),uid,data.passageIndex);
      if (expectedVideo.videoKey !== data.videoKey) fail('failed-precondition', '영상이 변경되었습니다. 목록에서 다시 열어 주세요.');
      duration = await resolveDuration(expectedVideo);
      if (!durationOK(duration)) fail('failed-precondition', '서버에서 영상 길이를 확인하지 못했습니다.');
    }
    const newSessionId = uuid();
    return db.runTransaction(async transaction => {
      const [profileSnap,materialSnap,sessionSnap] = await transaction.getAll(profileRef,materialRef,sessionRef);
      const material = materialSnap.data();
      const video = authorizedMaterial(profileSnap.data(),material,uid,data.passageIndex);
      if (video.videoKey !== data.videoKey) fail('failed-precondition', '영상이 변경되었습니다. 목록에서 다시 열어 주세요.');
      if (expectedVideo && expectedVideo.videoKey !== video.videoKey) fail('aborted', '영상이 변경되었습니다. 다시 열어 주세요.');
      const progressId = hash(JSON.stringify([uid,data.materialId,data.passageIndex,video.videoKey]));
      const progressRef = db.doc(`prepWatchProgress/${progressId}`);
      const progressSnap = await transaction.get(progressRef);
      const now = clock();
      let progress = progressSnap.data(), session = sessionSnap.data();
      if (data.action === 'start') {
        if (session?.startRequestId === data.requestId && session.progressId === progressId && session.sequence === 0) return {sessionId:session.id,sequence:0,progress};
        progress = {...(progress || {}), trackingVersion:1, id:progressId,userId:uid,materialId:data.materialId,
          classIds:material.classIds, setId:segment(material.payload.id || 'set-1'), passageId:segment(video.passage.id || `passage-${data.passageIndex+1}`), passageIndex:data.passageIndex,
          videoKey:video.videoKey, duration:progress?.duration || duration, watchedRanges:progress?.watchedRanges || [], watchedSeconds:progress?.watchedSeconds || 0,
          playSeconds:progress?.playSeconds || 0, completed:!!progress?.completed, done:!!progress?.completed, completedAt:progress?.completedAt || '', updatedAt:new Date(now).toISOString()};
        session = {id:newSessionId,startRequestId:data.requestId,progressId,materialId:data.materialId,passageIndex:data.passageIndex,sequence:0,lastAt:now,position:0,rate:1,state:'paused'};
      } else {
        if (!session || session.id !== data.sessionId || session.progressId !== progressId || !progress) fail('failed-precondition', '다른 창이나 영상에서 기록이 시작되었습니다. 다시 연결해 주세요.');
        const next = advance(progress,session,data,now);
        if (next.duplicate) return {sessionId:session.id,sequence:session.sequence,progress};
        progress = {...next.progress,classIds:material.classIds}; session = next.session;
      }
      transaction.set(progressRef,progress);
      transaction.set(sessionRef,session);
      return {sessionId:session.id,sequence:session.sequence,progress};
    });
  };
}

module.exports = { WatchError, hash, videoDescriptor, authorizedMaterial, mergeRanges, advance, validate, createWatchService, durationOK };
