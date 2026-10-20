// Actual browser/SDK/product functions; only synthetic accounts on guarded demo emulators.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { chromium } = require('./browser-tests/node_modules/playwright');
assert.deepEqual(process.argv.slice(2), []);
for (const [key,value] of Object.entries({FIRESTORE_EMULATOR_HOST:'127.0.0.1:8786',FIREBASE_AUTH_EMULATOR_HOST:'127.0.0.1:9098',FIREBASE_STORAGE_EMULATOR_HOST:'127.0.0.1:9298'})) assert.equal(process.env[key],value);
const root = path.resolve(__dirname,'..'), pdfRoot = path.resolve(root,'../PDF LAB');
assert.ok(fs.existsSync(path.join(pdfRoot,'app/index.html')), 'Reviewed sibling PDF LAB checkout required');
const project = 'demo-codelab-reaudit', bucket = project+'.appspot.com';
const config = {apiKey:'emulator-only',authDomain:'localhost',projectId:project,storageBucket:bucket,appId:'emulator-only'};
const password = crypto.randomBytes(24).toString('base64url');
const fixtures = {}, checks = [];
const base = `http://127.0.0.1:8786/v1/projects/${project}/databases/(default)/documents`;
function encode(value) {
  if(Array.isArray(value)) return {arrayValue:{values:value.map(encode)}};
  if(value && typeof value==='object') return {mapValue:{fields:fields(value)}};
  if(typeof value==='boolean') return {booleanValue:value};
  if(typeof value==='number') return {integerValue:String(value)};
  return {stringValue:String(value)};
}
const fields = value => Object.fromEntries(Object.entries(value).map(([key,item])=>[key,encode(item)]));
async function seed(id, profile) {
  const email = id+'@example.invalid';
  const response = await fetch('http://127.0.0.1:9098/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-only', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});
  assert.equal(response.status,200,'Synthetic signup');
  const {localId:uid} = await response.json();
  const saved = await fetch(base+'/users/'+uid,{method:'PATCH',headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:JSON.stringify({fields:fields({...profile,uid,email,name:'Synthetic '+id,loginId:id,passwordResetRequired:false})})});
  assert.equal(saved.status,200,'Synthetic profile'); await saved.text();
  fixtures[id]={uid,email};
}
const boot = `<script>firebase.initializeApp(${JSON.stringify(config)});firebase.auth().useEmulator('http://127.0.0.1:9098',{disableWarnings:true});firebase.firestore().useEmulator('127.0.0.1',8786);if(firebase.storage)firebase.storage().useEmulator('127.0.0.1',9298);</script>`;
const tracked = directory => new Set(execFileSync('git',['-C',directory,'ls-files','-z'],{encoding:'utf8'}).split('\0'));
const publicCode = tracked(root), publicPdf = tracked(pdfRoot);
const server = http.createServer((request,response)=>{
  const url = new URL(request.url,'http://127.0.0.1');
  const pdf = url.pathname.startsWith('/pdf/');
  const relative = decodeURIComponent(url.pathname.slice(pdf?5:6)) || 'index.html';
  const directory = pdf?pdfRoot:root, file = (pdf?'app/':'')+relative;
  if(!url.pathname.startsWith(pdf?'/pdf/':'/code/') || !(pdf?publicPdf:publicCode).has(file) || relative.includes('..') || (!pdf && relative.includes('/')) || !/\.(html|js|css|svg|png|woff2?)$/i.test(relative)) {response.writeHead(404);return response.end();}
  if(relative==='firebase-config.js') {response.setHeader('Content-Type','text/javascript');return response.end(`window.ROTATION_FIREBASE_CONFIG=window.PDFLAB_FIREBASE_CONFIG=${JSON.stringify(config)};`);}
  let body = fs.readFileSync(path.join(directory,file));
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
  response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  if(relative==='index.html') {
    const service=pdf?'storage':'firestore';
    body=body.toString().replace(new RegExp('(<script[^>]*src="https://www\\.gstatic\\.com/firebasejs/[^" ]+/firebase-'+service+'-compat\\.js"[^>]*><\\/script>)'), '$1'+boot);
    assert.ok(body.includes(boot),'Emulator bootstrap before product startup');
  }
  response.end(body);
});
let browser;
const deadline = setTimeout(()=>{console.error('Cross-app browser deadline');process.exit(2)},180000);
(async()=>{
  await seed('p1-admin',{role:'admin',adminScope:'all',classIds:[]});
  await seed('p1-student',{role:'student',classIds:['a'],grammarAccessMode:'all'});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
  const context=await browser.newContext({serviceWorkers:'block'});
  const guard = route=>{
    const url=new URL(route.request().url());
    if(url.hostname==='firebasestorage.googleapis.com' && url.pathname.startsWith('/v0/b/'+bucket+'/o/')){
      return route.fetch({url:'http://127.0.0.1:9298'+url.pathname+url.search}).then(response=>route.fulfill({response}));
    }
    const allowed=(url.hostname==='127.0.0.1' && [String(server.address().port),'8786','9098','9298'].includes(url.port)) || (url.hostname==='www.gstatic.com' && /^\/firebasejs\/10\.12\.(2|5)\/firebase-(app|auth|firestore|storage)-compat\.js$/.test(url.pathname));
    return allowed?route.continue():route.abort('blockedbyclient');
  };
  await context.route('**/*',guard);
  const pdf=await context.newPage();
  await pdf.goto(origin+'/pdf/',{waitUntil:'domcontentloaded'});
  await pdf.waitForFunction(()=>typeof uploadExamCheckSetRecordsToCodeLab==='function');
  await pdf.evaluate(async({admin,password})=>{
    ensurePdfLabFirebaseServices();
    const credential=await firebase.auth().signInWithEmailAndPassword(admin.email,password);
    await new Promise(resolve=>setTimeout(resolve,50));
    state.firebaseSchoolBridge.currentUser=credential.user;
    state.firebaseSchoolBridge.currentProfile=(await firebase.firestore().collection('users').doc(credential.user.uid).get()).data();
  },{admin:fixtures['p1-admin'],password});
  const uid=fixtures['p1-student'].uid;
  await pdf.evaluate(async uid=>{
    window.syntheticCheckRecord={checkSetId:'p1-browser-check',classIds:['a'],targetFirebaseUid:uid,assignmentMode:'student',source:'pdf-lab',questionMappings:[{questionId:'q1',problemRecordId:'p1'},{questionId:'q2',problemRecordId:'p2'}],exportPayload:{id:'p1-browser-check',title:'Synthetic browser CHECK',classIds:['a'],targetUserIds:[uid],assignmentMode:'student',questions:[{id:'q1',number:1,type:'객관식',answer:'1',prompt:'Synthetic correct'},{id:'q2',number:2,type:'객관식',answer:'2',prompt:'Synthetic wrong'}]}};
    const result=await uploadExamCheckSetRecordsToCodeLab([syntheticCheckRecord]);
    if(result.uploaded!==1)throw Error('Assignment upload: '+result.reason);
  },uid);
  checks.push('PDF LAB actual SDK assignment upload');
  const studentContext=await browser.newContext({serviceWorkers:'block'});
  await studentContext.route('**/*',guard);
  const code=await studentContext.newPage();
  await code.goto(origin+'/code/',{waitUntil:'domcontentloaded'});
  await code.waitForFunction(()=>typeof portalState!=='undefined' && portalState.authResolved);
  await code.evaluate(async({student,password})=>{await firebase.auth().signInWithEmailAndPassword(student.email,password)},{student:fixtures['p1-student'],password});
  await code.waitForFunction(()=>portalState.currentProfile?.role==='student' && portalState.authResolved);
  await code.evaluate(async()=>{await openCheckPortal();await openCheckSetPortal('p1-browser-check')});
  await code.waitForSelector('#check-set-screen.active');
  for(const width of [390,1280]) {
    await code.setViewportSize({width,height:900});
    assert.ok(await code.locator('#check-submit-btn').isVisible());
    assert.equal(await code.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'No CHECK horizontal overflow');
  }
  await code.locator('.check-choice-btn').first().click();
  await code.locator('#check-submit-btn').click();
  await code.waitForFunction(()=>portalState.currentCheckSubmission?.answers.length===1 && !portalState.isSubmittingCheck);
  let results=await pdf.evaluate(async uid=>{
    const response=await fetchLatestCheckResponseForRetryRoundRecord(syntheticCheckRecord,{firebaseUid:uid});
    const round={items:[{problemRecordId:'p1',result:'wrong'},{problemRecordId:'p2',result:'wrong'}]};
    applyCheckResponseToRetryRound(round,syntheticCheckRecord,response);
    return round.items.map(item=>item.result);
  },uid);
  assert.deepEqual(results,['correct','wrong'],'Partial submission preserves unanswered retry candidate');
  checks.push('Actual student renderer/submit, mobile/desktop, PDF result sync with partial answer');
  await code.evaluate(()=>{portalState.currentCheckFilter='pending';renderCurrentCheckSet()});
  await code.locator('.check-choice-btn').first().click();
  // Deny a real SDK write via the emulator profile, then restore the synthetic account.
  const disable = async value => {
    const response=await fetch(base+'/users/'+uid+'?updateMask.fieldPaths=loginDisabled',{method:'PATCH',headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:JSON.stringify({fields:fields({loginDisabled:value})})});
    assert.equal(response.status,200);await response.text();
  };
  await disable(true);
  await code.locator('#check-submit-btn').click();
  await code.waitForFunction(()=>!portalState.isSubmittingCheck,{},{timeout:30000});
  assert.equal(await code.evaluate(()=>Object.keys(portalState.currentCheckDraftAnswers).length>0),true,'Failed write retains draft');
  await disable(false);
  await code.locator('#check-submit-btn').click();
  await code.waitForFunction(()=>portalState.currentCheckSubmission?.answers.length===2 && !portalState.isSubmittingCheck);
  results=await pdf.evaluate(async uid=>{
    const response=await fetchLatestCheckResponseForRetryRoundRecord(syntheticCheckRecord,{firebaseUid:uid});
    window.syntheticRound={roundIndex:1,items:[{problemRecordId:'p1',result:'wrong'},{problemRecordId:'p2',result:'wrong'}]};
    applyCheckResponseToRetryRound(syntheticRound,syntheticCheckRecord,response);
    return syntheticRound.items.map(item=>item.result);
  },uid);
  assert.deepEqual(results,['correct','wrong']);
  checks.push('Rules-denied submission retains draft; restored permission retry preserves both answers');
  const generated=await pdf.evaluate(async uid=>{
    const records=['p1','p2'].flatMap(id=>[1,2,3].map(round=>({kind:'problem',recordId:round===1?id:id+'-round'+round,sourceId:'fixture',passageKey:id,problemType:'내용',retryMode:'rounds',retryGroupId:id,retryRound:round,difficulty:'easy',librarySourceKey:'neoreunteo',answer:'1',text:'Synthetic question',choices:['A','B','C','D','E']})));
    state.libraryCache.problemRecords=records;
    state.schoolWorkflow.selectedSchoolKey='a';
    const student={studentId:'synthetic',name:'Synthetic',schoolKey:'a',firebaseUid:uid,createdAt:1,updatedAt:1};
    const items=records.filter(record=>record.retryRound===1).map((record,index)=>createRetryItemFromRecord(record,index+1));
    const round={roundId:'synthetic-first',roundIndex:1,label:'1차',createdAt:1,updatedAt:1,items};
    const response=await fetchLatestCheckResponseForRetryRoundRecord(syntheticCheckRecord,student);
    applyCheckResponseToRetryRound(round,syntheticCheckRecord,response);
    state.studentRetry.students=[student];
    state.studentRetry.sessions=[{sessionId:'synthetic-session',schoolKey:'a',sourceKey:'neoreunteo',name:'Synthetic session',createdAt:1,updatedAt:1,baseItems:items,studentStates:{synthetic:{rounds:[round]}}}];
    state.studentRetry.selectedStudentId='synthetic';state.studentRetry.selectedSessionId='synthetic-session';
    generateNextStudentRetryRound();
    const saved=await saveStudentRetryStateToFirebase();
    if(!saved.synced)throw Error('Retry remote save not acknowledged');
    const loaded=await loadStudentRetryStateFromFirebase();
    const stored=loaded.state.sessions.find(session=>session.sessionId==='synthetic-session').studentStates.synthetic.rounds;
    return stored[1].items.map(item=>item.problemRecordId);
  },uid);
  assert.deepEqual(generated,['p2-round2']);
  checks.push('Actual PDF second-round generation, owner-scoped emulator save and reload');
  const storagePath='prep-videos/a/p1-browser-prep/fixture.mp4';
  const material={accessSchemaVersion:1,classIds:['a'],assignmentMode:'class',targetUserIds:[],payload:{id:'p1-browser-prep',classIds:['a'],assignmentMode:'class',targetUserIds:[],classAssignments:[{classId:'a',passageIndexes:[0]}],passages:[{id:'p',title:'Synthetic passage',videoStoragePath:storagePath}]}};
  const {prepareLegacyPlan,digest}=await import('./prepare-legacy-rollout.mjs');
  const legacy={collection:'portalContent',id:'synthetic-legacy',data:{payload:{legacy:true}}};
  const prepared=prepareLegacyPlan({documents:[legacy]},{replacements:[{source:'portalContent/synthetic-legacy',sourceHash:digest(legacy.data),document:{collection:'portalPrepSets',id:'p1-browser-prep',data:material}}]});
  await pdf.evaluate(async data=>{await state.firebaseSchoolBridge.db.collection('portalPrepSets').doc('p1-browser-prep').set(data)},prepared.writes[0].data);
  const visiblePrep=await code.evaluate(async()=>{
    const doc=await getCloudSetDoc('prep','p1-browser-prep');
    const bundle=normalizeBundleData({classes:[{id:'a',name:'Synthetic'}],studySets:[doc.payload]});
    return {sets:bundle.studySets.length,passages:bundle.studySets[0]?.passages.length,path:bundle.studySets[0]?.passages[0].videoStoragePath,requiresAuth:bundle.studySets[0]?.passages[0].videoRequiresAuth};
  });
  assert.deepEqual(visiblePrep,{sets:1,passages:1,path:storagePath,requiresAuth:true});
  checks.push('Reviewed legacy candidate accepted by full-admin SDK and retained by actual student read/normalizer');
  const seeded=await fetch('http://127.0.0.1:9298/v0/b/'+bucket+'/o?uploadType=media&name='+encodeURIComponent(storagePath),{method:'POST',headers:{Authorization:'Bearer owner','Content-Type':'video/mp4'},body:Buffer.from('synthetic-video')});
  assert.equal(seeded.status,200);await seeded.text();
  const authVideo=await code.evaluate(async({storagePath,bucket})=>{
    const video=buildPassageState({videoUrl:'https://firebasestorage.googleapis.com/v0/b/'+bucket+'/o/'+encodeURIComponent(storagePath)+'?alt=media&token=synthetic-bearer'},0);
    document.getElementById('stage-content').innerHTML=renderPassageVideoPlayer(video);
    await loadPrepStorageVideo(video);
    const result={path:video.videoStoragePath,noBearer:!document.getElementById('stage-content').innerHTML.includes('synthetic-bearer'),src:document.querySelector('#stage-content video').src.startsWith('blob:'),status:document.getElementById('prep-video-load-status').textContent};
    stopActivePrepVideoPlayback();return result;
  },{storagePath,bucket});
  assert.equal(authVideo.path,storagePath);assert.equal(authVideo.noBearer,true);assert.equal(authVideo.src,true,authVideo.status);
  await disable(true);
  const denied=await code.evaluate(async storagePath=>{
    const video=buildPassageState({videoStoragePath:storagePath},0);
    document.getElementById('stage-content').innerHTML=renderPassageVideoPlayer(video);
    await loadPrepStorageVideo(video);
    return {retry:!document.getElementById('prep-video-retry-btn').hidden,src:document.querySelector('#stage-content video').getAttribute('src')};
  },storagePath);
  assert.equal(denied.retry,true);assert.equal(denied.src,null);
  await code.evaluate(()=>{
    document.querySelectorAll('.screen').forEach(node=>node.classList.remove('active'));
    document.getElementById('study-screen').classList.add('active');
  });
  for(const width of [390,1280]) {
    await code.setViewportSize({width,height:900});
    const button=code.locator('#prep-video-retry-btn');
    await button.focus();
    assert.equal(await button.evaluate(node=>document.activeElement===node),true,'Retry keyboard focus');
    const metrics=await code.locator('#prep-video-load-status').evaluate(node=>{
      const css=getComputedStyle(node),rgb=value=>(value.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
      const lum=values=>values.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
      const a=lum(rgb(css.color)),b=lum(rgb(css.backgroundColor));
      const button=document.getElementById('prep-video-retry-btn').getBoundingClientRect();
      return {ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),font:parseFloat(css.fontSize),width:button.width,height:button.height,wrap:node.scrollWidth<=node.clientWidth+1,live:node.getAttribute('aria-live')};
    });
    assert.ok(metrics.ratio>=4.5 && metrics.font>=11 && metrics.width>=44 && metrics.height>=44 && metrics.wrap && metrics.live==='polite','Readable, keyboard/touch-accessible retry feedback: '+JSON.stringify(metrics));
  }
  const artifacts=path.join(root,'.local/cross-app-browser');fs.mkdirSync(artifacts,{recursive:true});
  await code.screenshot({path:path.join(artifacts,'prep-auth-retry-desktop.png')});
  await disable(false);
  await code.locator('#prep-video-retry-btn').click();
  await code.waitForFunction(()=>document.querySelector('#stage-content video').src.startsWith('blob:'));
  await code.evaluate(()=>resetPortalUserState());
  assert.equal(await code.locator('#stage-content video').getAttribute('src'),null,'Account reset releases current video source');
  checks.push('PREP legacy token URL converted to authenticated blob; current profile revocation denied with retry');
  const grammar=await fetch('http://127.0.0.1:9298/v0/b/'+bucket+'/o?uploadType=media&name='+encodeURIComponent('videos/grammar/synthetic.mp4'),{method:'POST',headers:{Authorization:'Bearer owner','Content-Type':'video/mp4'},body:Buffer.from('synthetic-grammar-video')});
  assert.equal(grammar.status,200);await grammar.text();
  assert.equal(await code.evaluate(async()=>{const blob=await fetchGrammarStorageBlob('videos/grammar/synthetic.mp4','video/mp4');return blob.size}),23);
  checks.push('Existing GRAMMAR wrapper downloads via shared authenticated helper under real Storage rules');
  const adminCode=await context.newPage();
  adminCode.on('dialog',dialog=>dialog.accept());
  await adminCode.goto(origin+'/code/',{waitUntil:'domcontentloaded'});
  await adminCode.waitForFunction(()=>portalState.currentProfile?.role==='admin' && portalState.authResolved);
  const transitions=await adminCode.evaluate(async()=>{
    const raw={classes:[{id:'a',name:'Synthetic'}],studySets:[{id:'old',title:'Synthetic imported video',classAssignments:[{classId:'a',passageIndexes:[0]}],passages:[{id:'p',title:'Synthetic passage',videoStoragePath:'prep-videos/a/old/file.mp4'}]}]};
    const imported=buildPrepUploadRecords(raw,'synthetic.json',{id:'a'})[0];
    imported.payload.passages[0].videoStoragePath='prep-videos/a/'+imported.docId+'/file.mp4';
    if(imported.payload.passages[0].videoRequiresAuth!==true)throw Error('Imported fixture must retain the authentication flag');
    const results=[];
    for(const operation of ['youtube','manager-delete','set-delete']){
      await saveCloudSetDoc('prep',imported.docId,clonePlainData(imported));
      if(operation==='set-delete')await removePortalPrepPassageVideoFromSet(imported.docId,0);
      else {
        await openPortalPrepVideoManager(imported.docId);
        if(operation==='youtube'){
          document.getElementById('prep-video-url-input-0').value='https://www.youtube.com/watch?v=synthetic01';
          document.getElementById('prep-video-title-input-0').value='Synthetic replacement';
          await savePortalPrepPassageVideoUrl(0);
        }else await removePortalPrepPassageVideo(0);
      }
      const stored=await getCloudSetDoc('prep',imported.docId);
      const passage=buildPassageState(stored.payload.passages[0],0),html=renderPassageVideoPlayer(passage);
      results.push({operation,flagStored:Object.hasOwn(stored.payload.passages[0],'videoRequiresAuth'),requiresAuth:passage.videoRequiresAuth,hasVideo:passage.hasVideo,iframe:html.includes('<iframe'),retry:html.includes('prep-video-retry-btn')});
    }
    return results;
  });
  for(const result of transitions)assert.deepEqual(result,{operation:result.operation,flagStored:false,requiresAuth:false,hasVideo:result.operation==='youtube',iframe:result.operation==='youtube',retry:false});
  checks.push('Actual CODE LAB import, administrator video replacement/two deletion paths and SDK reload');
  console.log(JSON.stringify({passed:checks.length,checks,productionAccess:false}));
})().catch(error=>{console.error('Cross-app check failed:',error.name, String(error.message).slice(0,700));process.exitCode=1;}).finally(async()=>{
  clearTimeout(deadline);if(browser)await browser.close();server.close();
});
