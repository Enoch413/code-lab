import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const defs=file=>new Map([...read(file).matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const passages=defs('rotation_prep_passages.js'), enh=defs('rotation_portal_enhancements.js'), ui=defs('rotation_prep_ui.js')
const load=(ctx,map,names)=>names.forEach(name=>{assert.ok(map.has(name),name);vm.runInContext(map.get(name),ctx)})
let checks=0
const ctx=vm.createContext({URL,window:{ROTATION_FIREBASE_CONFIG:{storageBucket:'demo-bucket'}}})
for(const source of passages.values())vm.runInContext(source,ctx)
const normalize=source=>ctx.normalizePassageVideo(source,'Synthetic')
for(const source of [{videoStoragePath:'prep-videos/a/set/file.mp4'}, {video:{storagePath:'prep-videos/a/set/file.mp4'}}, {videoUrl:'https://firebasestorage.googleapis.com/v0/b/demo-bucket/o/prep-videos%2Fa%2Fset%2Ffile.mp4?alt=media&token=synthetic'}, {videoEmbedUrl:'https://firebasestorage.googleapis.com/v0/b/demo-bucket/o/prep-videos%2Fa%2Fset%2Ffile.mp4?alt=media&token=synthetic'}, {videoUrl:'gs://demo-bucket/prep-videos/a/set/file.mp4'}, {videoUrl:'https://storage.googleapis.com/demo-bucket/prep-videos/a/set/file.mp4'}]) {
  const video=normalize(source);assert.equal(video.storagePath,'prep-videos/a/set/file.mp4');assert.equal(video.requiresAuth,true);assert.equal(video.url,'');assert.equal(video.embedUrl,'');assert.equal(video.hasVideo,true);checks++
}
for(const source of [{videoUrl:'https://firebasestorage.googleapis.com/v0/b/foreign/o/path?token=synthetic'}, {videoUrl:'https://example.invalid/video.mp4',videoEmbedUrl:'https://firebasestorage.googleapis.com/v0/b/foreign/o/path?token=synthetic'}, {videoStoragePath:'grammar/private.mp4'}, {videoStoragePath:'prep-videos/a/../file'}, {videoStoragePath:'prep-videos/a\\file'}]) {const video=normalize(source);assert.equal(video.requiresAuth,true);assert.equal(video.storagePath,'');assert.equal(video.url,'');assert.equal(video.embedUrl,'');checks++}
assert.match(normalize({videoUrl:'https://www.youtube.com/watch?v=synthetic01'}).embedUrl,/youtube.com\/embed/);checks++
assert.equal(normalize({videoUrl:'https://example.invalid/file.mp4'}).requiresAuth,false);checks++
assert.equal(normalize({videoUrl:'',videoStoragePath:'',videoRequiresAuth:true}).requiresAuth,true,'Repeated normalization must preserve invalid protected-video failure state');checks++

const state={firebaseEnabled:true,userSession:1,currentUser:{getIdToken:async()=> 'synthetic-fixture-token'}}
const requests=[];let statuses=[200]
const network=vm.createContext({portalState:state,window:{ROTATION_FIREBASE_CONFIG:{storageBucket:'demo-bucket'}},Blob,
  fetch:async(url,options)=>{requests.push({url,options});const status=statuses.shift()||200;return new Response(status===200?'fixture':null,{status,headers:{'Content-Type':'video/mp4'}})},
  canAccessGrammarObjectPath:()=>false})
load(network,enh,['fetchPortalStorageBlob','fetchGrammarStorageBlob'])
assert.equal((await network.fetchPortalStorageBlob('prep-videos/a/set/file.mp4','video/mp4')).type,'video/mp4')
assert.ok(!requests[0].url.includes('token='));assert.equal(requests[0].options.cache,'no-store');assert.equal(requests[0].options.credentials,'omit');assert.ok(requests[0].options.headers.Authorization.startsWith('Bearer '));checks++
statuses=[401,200];let tokens=[];state.currentUser.getIdToken=async refresh=>{tokens.push(refresh);return 'synthetic-fixture-token'}
await network.fetchPortalStorageBlob('prep-videos/a/set/file.mp4');assert.deepEqual(tokens,[false,true]);checks++
statuses=[401,401];await assert.rejects(network.fetchPortalStorageBlob('prep-videos/a/set/file.mp4'),error=>error.status===401);checks++
statuses=[403];await assert.rejects(network.fetchPortalStorageBlob('prep-videos/a/set/file.mp4'),error=>error.status===403);checks++
const before=requests.length;await assert.rejects(network.fetchGrammarStorageBlob('grammar/private.mp4'),error=>error.status===403);assert.equal(requests.length,before);checks++
state.currentUser.getIdToken=async()=>{state.userSession++;return 'synthetic-fixture-token'};await assert.rejects(network.fetchPortalStorageBlob('prep-videos/a/set/file.mp4'),/변경/);assert.equal(requests.length,before);checks++

// A late authenticated response cannot attach after navigation/account reset; retry releases old blobs.
let resolve, revoked=0, created=0, failed=false
const player={src:'',load(){}},status={textContent:''},retry={hidden:true},screen={querySelectorAll:()=>[]}
const playback=vm.createContext({AbortController,URL:{createObjectURL:()=>{created++;return 'blob:fixture'},revokeObjectURL:()=>revoked++},
  document:{querySelector:()=>player,getElementById:id=>id==='study-screen'?screen:id==='prep-video-load-status'?status:retry},
  fetchPortalStorageBlob:()=>failed?Promise.reject(Error('offline')):new Promise(yes=>{resolve=yes}),console:{warn(){}}})
vm.runInContext('let prepStoragePlayback=null',playback)
load(playback,ui,['loadPrepStorageVideo','stopActivePrepVideoPlayback'])
const passage={videoStoragePath:'prep-videos/a/set/file.mp4'}
let pending=playback.loadPrepStorageVideo(passage);playback.stopActivePrepVideoPlayback();resolve(new Blob());await pending;assert.equal(created,0);checks++
pending=playback.loadPrepStorageVideo(passage);resolve(new Blob());await pending;assert.equal(created,1);playback.stopActivePrepVideoPlayback();assert.equal(revoked,1);checks++
failed=true;await playback.loadPrepStorageVideo(passage);assert.equal(retry.hidden,false);checks++
failed=false;pending=retry.onclick();resolve(new Blob());await new Promise(yes=>setTimeout(yes,0));assert.equal(retry.hidden,true);assert.equal(created,2);playback.stopActivePrepVideoPlayback();checks++
assert.ok(!read('rotation_portal_enhancements.js').includes('getDownloadURL()'),'PREP upload must persist paths, never issue bearer URLs');checks++

// Import the real normalized payload before exercising all three video mutation paths.
const transitionDefinitions=new Map([...defs('rotation_prep_core.js'),...defs('rotation_prep_bundle.js'),...passages,...enh])
function transitionFixture(operation,aliases=false){
  const fixture={saved:null,deletes:0,refreshes:0,fail:false,stale:false,confirm:true,errors:0}
  const context=vm.createContext({URL,Date,Set,Map,APP_CONFIG:{defaultTitle:'Synthetic'},window:{ROTATION_FIREBASE_CONFIG:{storageBucket:'demo-bucket'},confirm:()=>fixture.confirm},portalState:{userSession:1},console:{error:()=>fixture.errors++}})
  for(const source of transitionDefinitions.values())vm.runInContext(source,context)
  vm.runInContext(ui.get('renderPassageVideoPlayer'),context)
  const raw={classes:[{id:'a',name:'Synthetic'}],studySets:[{id:'old',title:'Synthetic',classAssignments:[{classId:'a',passageIndexes:[0]}],passages:[{id:'p',title:'Synthetic',videoStoragePath:'prep-videos/a/old/file.mp4'}]}]}
  const imported=context.buildPrepUploadRecords(raw,'synthetic.json',{id:'a'})[0]
  assert.equal(imported.payload.passages[0].videoRequiresAuth,true)
  imported.payload.passages[0].videoStoragePath='prep-videos/a/'+imported.docId+'/file.mp4'
  if(aliases){
    const legacyUrl='https://firebasestorage.googleapis.com/v0/b/demo-bucket/o/'+encodeURIComponent(imported.payload.passages[0].videoStoragePath)+'?alt=media&token=synthetic'
    for(const key of ['videoSrc','videoFileUrl','videoFile','videoLink','videoIframeUrl'])imported.payload.passages[0][key]=legacyUrl
    imported.payload.passages[0].video={src:legacyUrl,fileUrl:legacyUrl,iframeUrl:legacyUrl}
  }
  context.portalState.prepVideoManager={open:true,isSaving:false,docId:imported.docId,currentDoc:structuredClone(imported)}
  Object.assign(context,{
    getPortalPrepVideoInputValue:()=> 'https://www.youtube.com/watch?v=synthetic01',getPortalPrepVideoTitleInputValue:()=> 'Synthetic replacement',
    renderPortalPrepVideoManager(){},showToast(){},syncPortalAdminSetPanels(){},getPortalUploadTargetClass:()=>null,getCurrentActiveScreenId:()=> 'admin-screen',
    isPortalAdmin:()=>true,restorePortalPrepClassSelection(){},showPassageScreen(){},escapeHtml:value=>String(value),
    saveCloudSetDoc:async(kind,id,doc)=>{if(fixture.fail)throw Error('Synthetic save failure');fixture.saved=structuredClone(doc);if(fixture.stale)context.portalState.userSession++;return doc},
    deletePortalStorageFileByPath:()=>{fixture.deletes++},syncPrepContentAfterLogin:async()=>{fixture.refreshes++},getCloudSetDoc:async()=>fixture.saved||structuredClone(imported)
  })
  fixture.run=()=>operation==='removePortalPrepPassageVideoFromSet'?context[operation](imported.docId,0):context[operation](0)
  fixture.assertSaved=()=>{
    assert.ok(fixture.saved)
    const rawPassage=fixture.saved.payload.passages[0],video=context.buildPassageState(rawPassage,0)
    assert.equal(Object.hasOwn(rawPassage,'videoRequiresAuth'),false,operation+': derived authentication flag must be removed')
    for(const key of ['videoSrc','videoFileUrl','videoFile','videoLink','videoIframeUrl'])assert.equal(Object.hasOwn(rawPassage,key),false,operation+': obsolete source alias must be removed')
    for(const key of ['src','fileUrl','iframeUrl'])assert.equal(rawPassage.video && Object.hasOwn(rawPassage.video,key)||false,false)
    assert.equal(video.videoRequiresAuth,false)
    const html=context.renderPassageVideoPlayer(video)
    if(operation==='savePortalPrepPassageVideoUrl'){assert.equal(video.hasVideo,true);assert.match(video.videoEmbedUrl,/youtube.com\/embed/);assert.match(html,/<iframe/)}
    else {assert.equal(video.hasVideo,false);assert.ok(!html.includes('<video')&&!html.includes('<iframe'))}
    assert.ok(!html.includes('prep-video-retry-btn'))
  }
  fixture.assertOriginal=()=>{const video=context.buildPassageState(context.portalState.prepVideoManager.currentDoc.payload.passages[0],0);assert.equal(video.videoRequiresAuth,true);assert.ok(video.videoStoragePath)}
  return fixture
}
for(const operation of ['savePortalPrepPassageVideoUrl','removePortalPrepPassageVideo','removePortalPrepPassageVideoFromSet']){
  let fixture=transitionFixture(operation);await fixture.run();fixture.assertSaved();assert.equal(fixture.deletes,1);assert.equal(fixture.errors,0);checks++
  fixture=transitionFixture(operation);fixture.fail=true;await fixture.run();assert.equal(fixture.saved,null);assert.equal(fixture.deletes,0);fixture.assertOriginal();checks++
  fixture.fail=false;await fixture.run();fixture.assertSaved();assert.equal(fixture.deletes,1);checks++
  fixture=transitionFixture(operation);fixture.stale=true;await fixture.run();fixture.assertSaved();assert.equal(fixture.deletes,0);assert.equal(fixture.refreshes,0);checks++
  if(operation!=='savePortalPrepPassageVideoUrl'){fixture=transitionFixture(operation);fixture.confirm=false;await fixture.run();assert.equal(fixture.saved,null);assert.equal(fixture.deletes,0);fixture.assertOriginal();checks++}
  fixture=transitionFixture(operation,true);await fixture.run();fixture.assertSaved();assert.equal(fixture.deletes,1);checks++
}
console.log(JSON.stringify({authenticatedVideoChecks:checks,productionAccess:false}))
