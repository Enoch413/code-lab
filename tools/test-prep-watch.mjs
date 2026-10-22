import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { collectLatestPublicFiles } from './build-latest-public.mjs'
import { validatePublicFiles } from './build-public.mjs'
const require = createRequire(import.meta.url)
const {advance, validate, authorizedMaterial, videoDescriptor, createWatchService, mergeRanges} = require('../functions/prep-watch.cjs')
let checks = 0
const check = (name, fn) => { fn(); checks++ }
const reject = (fn, code) => assert.throws(fn, error => error.code === code)
const start = {action:'start', materialId:'synthetic-set', passageIndex:0,videoKey:'youtube:abcdefghijk:', requestId:'synthetic-request-0001'}
const sample = (sequence,position,state='playing',rate=1) => ({...start,action:'sample',sessionId:'synthetic-session-001',sequence,position,state,rate,requestId:'synthetic-sample-'+String(sequence).padStart(4,'0')})
const material = {accessSchemaVersion:1,classIds:['a'],assignmentMode:'class',targetUserIds:[],payload:{id:'synthetic-set',passages:[{id:'video-1',videoUrl:'https://www.youtube.com/watch?v=abcdefghijk'}],classAssignments:[{classId:'a',passageIndexes:[0]}]}}
const profile = {role:'student',classIds:['a']}
check('only assigned active students', () => {
  authorizedMaterial(profile,material,'alice',0)
  for(const data of [null,{...profile,loginDisabled:true},{role:'admin',classIds:['a']},{role:'student',classIds:[]},{role:'student',classIds:['b']},{role:'student',classIds:['class-grammar-only','a']}]) reject(()=>authorizedMaterial(data,material,'alice',0),'permission-denied')
  for(const value of [null,{...material,accessSchemaVersion:0},{...material,classIds:['a','b']},{...material,payload:{...material.payload,classAssignments:[]}}, {...material,assignmentMode:'personal',targetUserIds:['bob']}]) reject(()=>authorizedMaterial(profile,value,'alice',0),'permission-denied')
  authorizedMaterial(profile,{...material,assignmentMode:'personal',targetUserIds:['alice']},'alice',0)
})
check('strict request trust boundary', () => {
  validate(start); validate(sample(1,0))
  for(const extra of [{completed:true},{duration:1},{userId:'bob'},{watchedRanges:[[0,100]]},{updatedAt:'forged'}]) reject(()=>validate({...start,...extra}),'invalid-argument')
  for(const value of [{...start,materialId:'../x'},{...start,passageIndex:-1},{...sample(1,0),position:NaN},{...sample(1,0),rate:3},{...sample(1,0),sequence:1.5},{...sample(1,0),state:'attention-verified'}]) reject(()=>validate(value),'invalid-argument')
})
check('video identity changes with video and version, not titles', () => {
  const base=videoDescriptor(material.payload.passages[0])
  assert.equal(base.videoKey, videoDescriptor({...material.payload.passages[0],title:'renamed'}).videoKey)
  assert.notEqual(base.videoKey, videoDescriptor({...material.payload.passages[0],videoUpdatedAt:'v2'}).videoKey)
  assert.notEqual(base.videoKey, videoDescriptor({videoUrl:'https://youtu.be/lmnopqrstuv'}).videoKey)
  reject(()=>videoDescriptor({videoUrl:'https://youtube.com.attacker.invalid/watch?v=abcdefghijk'}),'failed-precondition')
  reject(()=>videoDescriptor({videoStoragePath:'prep-videos/a/../file.mp4'}),'failed-precondition')
})
const initial = duration => ({duration,watchedRanges:[],watchedSeconds:0,playSeconds:0,completed:false})
const session = {sequence:0,lastAt:0,position:0,rate:1,state:'playing'}
check('normal completion uses server time plus coverage and end', () => {
  let p=initial(20),s=session
  for(let n=1;n<=4;n++){ const next=advance(p,s,sample(n,n*5,n===4?'ended':'playing'),n*5000);p=next.progress;s=next.session }
  assert.equal(p.completed,true);assert.equal(p.watchedSeconds,20);assert.equal(p.playSeconds,20)
})
check('2x counts real seconds separately from unique video coverage', () => {
  const next=advance(initial(20),{...session,rate:2},sample(1,20,'ended',2),10000)
  assert.equal(next.progress.completed,true);assert.equal(next.progress.playSeconds,10);assert.equal(next.progress.watchedSeconds,20)
})
check('seeks, pauses, buffering, gaps, instant end cannot create completion', () => {
  for(const [s,data,now] of [[session,sample(1,100,'ended'),100], [session,sample(1,100,'ended'),5000], [session,sample(1,5,'seeking'),5000], [{...session,state:'paused'},sample(1,5),5000], [session,sample(1,20,'ended'),20000], [session,sample(1,5,'ended',2),5000]]){
    const next=advance(initial(100),s,data,now)
    assert.equal(next.progress.completed,false);assert.equal(next.progress.watchedSeconds,0)
  }
})
check('repeat viewing never double counts coverage; server budget caps small jumps', () => {
  const result=advance({...initial(20),watchedRanges:[[0,10]],watchedSeconds:10,playSeconds:10},session,sample(1,5),5000)
  assert.equal(result.progress.watchedSeconds,10);assert.equal(result.progress.playSeconds,15)
  const small=advance(initial(20),session,sample(1,6),5000)
  assert.equal(small.progress.watchedSeconds,5)
})
check('95 percent and end both required; no bridging gaps', () => {
  assert.deepEqual(mergeRanges([[0,2],[2.01,3]],null,10),[{start:0,end:2},{start:2.01,end:3}])
  const p={...initial(100),watchedRanges:[[0,95]],watchedSeconds:95}
  assert.equal(advance(p,{...session,state:'paused'},sample(1,100,'ended'),5000).progress.completed,true)
  assert.equal(advance(p,{...session,state:'paused'},sample(1,95),5000).progress.completed,false)
  assert.equal(advance({...p,watchedRanges:[[0,94]]},{...session,state:'paused'},sample(1,100,'ended'),5000).progress.completed,false)
})
check('lost response is idempotent and sequence/content changes rejected', () => {
  const request=sample(1,5),first=advance(initial(20),session,request,5000)
  assert.equal(advance(first.progress,first.session,request,10000).duplicate,true)
  reject(()=>advance(first.progress,first.session,{...request,position:10},10000),'failed-precondition')
  reject(()=>advance(first.progress,first.session,sample(3,15),15000),'failed-precondition')
})

// Exercise actual transaction orchestration, including re-reading revocations after metadata retrieval.
const store=new Map([['users/alice',profile],['portalPrepSets/synthetic-set',material],['prepVideoProgress/legacy',{done:true,completedAt:'original',userId:'alice'}]])
const legacy=JSON.stringify(store.get('prepVideoProgress/legacy'))
const ref = path => ({path,get:async()=>({data:()=>structuredClone(store.get(path))})})
let time=1000,serial=0
const db={doc:ref,runTransaction:async fn=>fn({getAll:async(...refs)=>Promise.all(refs.map(r=>r.get())),get:r=>r.get(),set:(r,v)=>store.set(r.path,structuredClone(v))})}
const service=createWatchService({db,clock:()=>time,uuid:()=>`synthetic-session-${++serial}`,resolveDuration:async()=>20})
await assert.rejects(service('',start),error=>error.code==='unauthenticated');checks++
const first=await service('alice',start)
assert.equal((await service('alice',start)).sessionId,first.sessionId);checks++
const heartbeat={...sample(1,0),sessionId:first.sessionId}
await service('alice',heartbeat);time+=5000
const playing={...sample(2,5),sessionId:first.sessionId}
const played=await service('alice',playing)
assert.equal(played.progress.watchedSeconds,5)
assert.equal((await service('alice',playing)).progress.watchedSeconds,5);checks++
const second=await service('alice',{...start,requestId:'synthetic-new-tab-0001'})
await assert.rejects(service('alice',{...sample(3,10),sessionId:first.sessionId}),error=>error.code==='failed-precondition');checks++
store.set('users/alice',{...profile,loginDisabled:true})
await assert.rejects(service('alice',{...sample(1,0),sessionId:second.sessionId}),error=>error.code==='permission-denied');checks++
store.set('users/alice',profile)
const before=JSON.stringify([...store])
await assert.rejects(service('alice',{...start,duration:1}),error=>error.code==='invalid-argument')
assert.equal(JSON.stringify([...store]),before);checks++
store.set('portalPrepSets/synthetic-set',{...material,payload:{...material.payload,passages:[{...material.payload.passages[0],videoUpdatedAt:'replacement'}]}})
await assert.rejects(service('alice',start),error=>error.code==='failed-precondition');checks++
const replaced=await service('alice',{...start,videoKey:'youtube:abcdefghijk:replacement',requestId:'synthetic-replacement-001'})
assert.equal(replaced.progress.watchedSeconds,0);assert.notEqual(replaced.progress.id,played.progress.id)
assert.equal(JSON.stringify(store.get('prepVideoProgress/legacy')),legacy);checks++
store.set('portalPrepSets/synthetic-set',material)
const revocation=createWatchService({db,clock:()=>time,resolveDuration:async()=>{store.set('users/alice',{...profile,loginDisabled:true});return 20}})
const beforeRevocation=JSON.stringify([...store].filter(([key])=>key!=='users/alice'))
await assert.rejects(revocation('alice',start),error=>error.code==='permission-denied')
assert.equal(JSON.stringify([...store].filter(([key])=>key!=='users/alice')),beforeRevocation);checks++
store.set('users/alice',profile)

const ui=readFileSync(new URL('../rotation_prep_ui.js',import.meta.url),'utf8')
const enhancements=readFileSync(new URL('../rotation_portal_enhancements.js',import.meta.url),'utf8')
// The application's functions are evaluated as-is; no Firebase SDK or network is used here.
const definitions=text=>new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const all=new Map([...definitions(ui),...definitions(enhancements)])
const load=(ctx,names)=>{for(const name of names)vm.runInContext(all.get(name),ctx)}
// Actual metadata resolver, with synthetic provider responses and a no-network emulator guard.
{
  const resolver=definitions(readFileSync(new URL('../functions/index.js',import.meta.url),'utf8')).get('resolveDuration')
  let cached, fetched=0, saved=0
  const ctx=vm.createContext({URL,URLSearchParams,AbortSignal,WatchError:require('../functions/prep-watch.cjs').WatchError,hash:require('../functions/prep-watch.cjs').hash,durationOK:require('../functions/prep-watch.cjs').durationOK,
    process:{env:{}},youtubeKey:{value:()=> 'synthetic-not-a-key'},db:{doc:()=>({get:async()=>({data:()=>cached}),set:async value=>{cached=value;saved++}})},
    fetch:async url=>{assert.equal(url.hostname,'www.googleapis.com');assert.equal(url.searchParams.get('id'),'abcdefghijk');fetched++;return {ok:true,json:async()=>({items:[{id:'abcdefghijk',contentDetails:{duration:'PT1H2M3S'}}]})}}})
  vm.runInContext(resolver,ctx)
  const video={provider:'youtube',videoId:'abcdefghijk',videoKey:'youtube:abcdefghijk:'}
  assert.equal(await ctx.resolveDuration(video),3723);assert.equal(fetched,1);assert.equal(saved,1)
  assert.equal(await ctx.resolveDuration(video),3723);assert.equal(fetched,1);checks++
  cached=null;ctx.process.env.FUNCTIONS_EMULATOR='true'
  await assert.rejects(ctx.resolveDuration(video),error=>error.code==='failed-precondition');assert.equal(fetched,1);checks++
  assert.equal(await ctx.resolveDuration({provider:'storage',duration:12}),12);checks++
}
// Legacy collection fields cannot impersonate the server-only collection's provenance.
{
  const ctx=vm.createContext({portalState:{firebaseEnabled:true,currentUser:{uid:'alice'},userSession:1,db:{collection:name=>({where:()=>({get:async()=>({metadata:{fromCache:false},docs:[{id:name,data:()=>({userId:'alice',trackingVersion:1,done:true})}]})})})}},
    isPortalAdmin:()=>false,getPortalPrepVideoProgressUserId:()=> 'alice',PORTAL_PREP_VIDEO_PROGRESS_COLLECTION:'legacy',normalizePortalPrepVideoProgressRecord:value=>value})
  load(ctx,['fetchCurrentPortalPrepVideoProgressRows'])
  const rows=await ctx.fetchCurrentPortalPrepVideoProgressRows()
  assert.deepEqual(Array.from(rows,row=>row.trackingVersion),[0,1]);checks++
}
{
  const ctx=vm.createContext({getPrepWatchVideoKey:()=> 'youtube:abcdefghijk:',doesPortalPrepProgressMatchStudent:()=>true})
  load(ctx,['getPortalPrepProgressForStudent'])
  const base={userId:'alice',passageId:'video-1',passageIndex:0,materialId:'synthetic-set',videoKey:'youtube:abcdefghijk:'}
  const legacy={...base,trackingVersion:0,done:true,completedAt:'original',updatedAt:'2099-01-01'}
  const auto={...base,trackingVersion:1,done:false,updatedAt:'2026-01-01'}
  const passage={id:'video-1',index:0,materialId:'synthetic-set'}
  const selected=ctx.getPortalPrepProgressForStudent([legacy,auto],{uid:'alice'},passage)
  assert.equal(selected.done,false);assert.equal(selected.legacyCompletedAt,'original')
  assert.equal(ctx.getPortalPrepProgressForStudent([{...auto,videoKey:'replacement'}],{uid:'alice'},passage),null)
  assert.equal(ctx.getPortalPrepProgressForStudent([auto],{uid:'bob'},passage),null);checks++
}
// Native upload metadata validation releases object URLs on success, error and timeout.
for(const outcome of ['success','error','timeout','invalid']){
  let player,timer,released=0,loaded=0
  const ctx=vm.createContext({URL:{createObjectURL:()=> 'blob:synthetic',revokeObjectURL:()=>released++},setTimeout:fn=>{timer=fn;return 1},clearTimeout(){},
    document:{createElement:()=>{player={duration:outcome==='invalid'?Infinity:12,removeAttribute(){},load(){loaded++}};return player}}})
  load(ctx,['readPortalPrepVideoDuration'])
  const pending=ctx.readPortalPrepVideoDuration({})
  if(outcome==='timeout')timer();else if(outcome==='error')player.onerror();else player.onloadedmetadata()
  if(outcome==='success')assert.equal(await pending,12);else await assert.rejects(pending,/영상 길이/)
  assert.equal(released,1);assert.equal(loaded,1);checks++
}
const memory=new Map(),pendingKey='pending-synthetic'
const tracker={uid:'alice',userSession:1,materialId:'synthetic-set',videoKey:start.videoKey,setIndex:0,passageIndex:0,sequence:0,sessionId:'synthetic-session-001',pendingKey,cleanup:[],read:()=>({position:5,rate:1,state:'playing'})}
let failNetwork=true,calls=[],serverResponse={sessionId:tracker.sessionId,sequence:1,progress:{trackingVersion:1,userId:'alice',done:false}}
const ctx=vm.createContext({prepWatchTracker:tracker,prepWatchPendingRequest:null,portalState:{currentUser:{uid:'alice'},userSession:1},crypto:globalThis.crypto,performance:{now:()=>0},
  localStorage:{setItem:(k,v)=>memory.set(k,v),getItem:k=>memory.get(k)||null,removeItem:k=>memory.delete(k)},document:{hidden:false,querySelector:()=>null},
  callPrepWatchServer:async request=>{calls.push(structuredClone(request));if(failNetwork)throw Error('synthetic offline');return structuredClone(serverResponse)},
  mergePortalPrepVideoProgressCache(record){ctx.latestRecord=record},applyPortalPrepVideoProgressRowsToCurrentPrepClass(){if(ctx.latestRecord.done)ctx.progress.done.p0=true;else delete ctx.progress.done.p0;return true},getCurrentActiveScreenId:()=> 'study-screen',progress:{done:{p0:true}},syncPrepWatchStatus(){}})
load(ctx,['isCurrentPrepWatch','capturePrepWatchSample','prepWatchSample','applyPrepWatchServerProgress','sendPrepWatchSample'])
await ctx.sendPrepWatchSample(tracker)
assert.equal(tracker.error,true);assert.equal(memory.has(pendingKey),true)
failNetwork=false;await ctx.sendPrepWatchSample(tracker)
assert.deepEqual(calls[0],calls[1]);assert.equal(memory.has(pendingKey),false);assert.equal(ctx.progress.done.p0,undefined);checks++
ctx.document.hidden=true
assert.equal(ctx.prepWatchSample(tracker,'playing').state,'paused');checks++
const delayed=Promise.withResolvers();ctx.callPrepWatchServer=()=>delayed.promise
const previous=tracker.progress;const saving=ctx.sendPrepWatchSample(tracker)
ctx.portalState.userSession++;ctx.portalState.currentUser={uid:'bob'}
delayed.resolve({...serverResponse,progress:{trackingVersion:1,done:true}});await saving
assert.equal(tracker.progress,previous,'An old acknowledgement cannot paint a new account');checks++
const noManual=vm.createContext({portalState:{firebaseEnabled:true}});load(noManual,['markPassageDone']);noManual.markPassageDone();checks++
assert.ok(!/onclick="markPassageDone\(\)"/.test(ui));checks++
const publicFiles=collectLatestPublicFiles()
for(const name of publicFiles.keys())if(!['session.json','check_data.json','.nojekyll'].includes(name))publicFiles.set(name,readFileSync(new URL('../'+name,import.meta.url)))
validatePublicFiles(publicFiles)
assert.equal(publicFiles.size,21)
assert.ok(![...publicFiles.keys()].some(name=>name.startsWith('functions/')))
assert.ok(readFileSync(new URL('./serve-local.py',import.meta.url),'utf8').includes('"functions/"'));checks++
const productionConfig=JSON.parse(readFileSync(new URL('../firebase.prep-watch.json',import.meta.url),'utf8'))
assert.deepEqual(Object.keys(productionConfig),['functions'],'Dedicated rollout config must not deploy hosting, rules or indexes')
assert.deepEqual(productionConfig.functions,[{source:'functions',codebase:'prep-watch',ignore:['node_modules','.git','firebase-debug.log','firebase-debug.*.log','.env*','.secret.local']}]);checks++
assert.equal(publicFiles.has('firebase.prep-watch.json'),false);checks++
console.log(`PREP automatic watch: ${checks} grouped server/client regressions passed; no production connection.`)
