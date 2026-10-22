const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { createWatchService, WatchError, hash, durationOK } = require('./prep-watch.cjs');

initializeApp();
const db = getFirestore();
const youtubeKey = defineSecret('YOUTUBE_DATA_API_KEY');
async function resolveDuration(video) {
  if (video.provider === 'storage') return video.duration;
  const ref = db.doc('prepWatchVideoMetadata/' + hash(video.videoKey));
  const cached = (await ref.get()).data();
  if (cached?.videoKey === video.videoKey && durationOK(cached.duration)) return cached.duration;
  if (process.env.FUNCTIONS_EMULATOR === 'true') throw new WatchError('failed-precondition','로컬 테스트용 영상 길이가 필요합니다.');
  const key = youtubeKey.value();
  if (!key) throw new WatchError('failed-precondition','서버 영상 정보 설정이 필요합니다.');
  const url = new URL('https://www.googleapis.com/youtube/v3/videos');
  url.search = new URLSearchParams({part:'contentDetails',id:video.videoId,key}).toString();
  let response;
  try { response = await fetch(url,{signal:AbortSignal.timeout(8000)}); }
  catch { throw new WatchError('unavailable','영상 길이를 확인하지 못했습니다. 다시 시도해 주세요.'); }
  if (!response.ok) throw new WatchError('unavailable','영상 정보 서비스 연결을 확인해 주세요.');
  const body = await response.json();
  const text = body.items?.find(item => item.id === video.videoId)?.contentDetails?.duration || '';
  const match = text.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
  const duration = match ? Number(match[1] || 0)*3600 + Number(match[2] || 0)*60 + Number(match[3] || 0) : 0;
  if (!durationOK(duration)) throw new WatchError('failed-precondition','녹화 영상의 길이를 확인할 수 없습니다.');
  await ref.set({videoKey:video.videoKey,duration});
  return duration;
}
const record = createWatchService({db,resolveDuration});
exports.recordPrepWatch = onCall({region:'asia-northeast3',secrets:[youtubeKey],maxInstances:10,timeoutSeconds:30}, async request => {
  try { return await record(request.auth?.uid,request.data); }
  catch (error) {
    if (error instanceof WatchError) throw new HttpsError(error.code,error.message);
    // Do not log request bodies, credentials, provider URLs or profile data.
    throw new HttpsError('internal','시청 기록 저장에 실패했습니다. 다시 시도해 주세요.');
  }
});
