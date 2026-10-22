// Real callable + Auth + Firestore, synthetic fixtures on loopback demo emulators only.
const assert = require('node:assert/strict');
const {randomBytes} = require('node:crypto');
const {hash,videoDescriptor} = require('../functions/prep-watch.cjs');
assert.equal(process.argv.length,2);
assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8786');
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9098');
const project='demo-codelab-reaudit';
const base=`http://127.0.0.1:8786/v1/projects/${project}/databases/(default)/documents`;
const endpoint=`http://127.0.0.1:5001/${project}/asia-northeast3/recordPrepWatch`;
const enc=v=>Array.isArray(v)?{arrayValue:{values:v.map(enc)}}:v&&typeof v==='object'?{mapValue:{fields:fields(v)}}:typeof v==='boolean'?{booleanValue:v}:typeof v==='number'?{doubleValue:v}:{stringValue:String(v)};
const fields=v=>Object.fromEntries(Object.entries(v).map(([key,value])=>[key,enc(value)]));
async function document(path,data,token='owner'){
  return fetch(base+'/'+path,{method:data?'PATCH':'GET',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},...(data?{body:JSON.stringify({fields:fields(data)})}:{})});
}
const seed=async(path,data)=>assert.equal((await document(path,data)).status,200,'Synthetic fixture seed');
async function account(name,profile){
  const response=await fetch('http://127.0.0.1:9098/identitytoolkit.googleapis.com/v1/accounts:signUp?key=emulator-only',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:name+'@example.invalid',password:randomBytes(32).toString('base64url'),returnSecureToken:true})});
  assert.equal(response.status,200);const {localId:uid,idToken:token}=await response.json();
  await seed('users/'+uid,profile);return {uid,token};
}
const requestId=()=>randomBytes(16).toString('hex');
let currentVideoKey='youtube:abcdefghijk:';
const start=(id='watch-material')=>({action:'start',materialId:id,passageIndex:0,videoKey:currentVideoKey,requestId:requestId()});
let checks=0;
async function call(user,data,expected){
  const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json',...(user?{Authorization:'Bearer '+user.token}:{})},body:JSON.stringify({data})});
  const body=await response.json();
  if(expected){assert.equal(body.error?.status,expected,'Callable must reject unsafe request');checks++;return body;}
  assert.equal(response.status,200,'Callable success');assert.ok(body.result?.progress);checks++;return body.result;
}
async function main(){
  const alice=await account('watch-alice',{role:'student',classIds:['a']});
  const bob=await account('watch-bob',{role:'student',classIds:['b']});
  const admin=await account('watch-teacher',{role:'admin',adminScope:'assigned',classIds:['a']});
  const full=await account('watch-full',{role:'admin',adminScope:'all',classIds:[]});
  const passage={id:'video-1',videoUrl:'https://www.youtube.com/watch?v=abcdefghijk'};
  const material={accessSchemaVersion:1,classIds:['a'],assignmentMode:'class',targetUserIds:[],payload:{id:'watch-material',passages:[passage],classAssignments:[{classId:'a',passageIndexes:[0]}]}};
  const descriptor=videoDescriptor(passage);
  await seed('portalPrepSets/watch-material',material);
  await seed('prepWatchVideoMetadata/'+hash(descriptor.videoKey),{videoKey:descriptor.videoKey,duration:2});
  const legacy={userId:alice.uid,classIds:['a'],setId:'watch-material',passageId:'video-1',passageIndex:0,done:true,completedAt:'2026-01-01T00:00:00.000Z'};
  await seed('prepVideoProgress/'+alice.uid+'__legacy',legacy);
  const legacyBefore=await (await document('prepVideoProgress/'+alice.uid+'__legacy')).text();
  await call(null,start(),'UNAUTHENTICATED');
  await call(bob,start(),'PERMISSION_DENIED');
  await call(admin,start(),'PERMISSION_DENIED');
  await call(alice,{...start(),completed:true},'INVALID_ARGUMENT');
  const opening=start(),first=await call(alice,opening);
  assert.equal(first.progress.done,false,'Manual completion must never become automatic completion');
  assert.equal((await call(alice,opening)).sessionId,first.sessionId,'Lost start acknowledgement is idempotent');
  let sequence=0;
  const sample=(position,state='playing',rate=1)=>({action:'sample',materialId:'watch-material',passageIndex:0,videoKey:currentVideoKey,requestId:requestId(),sessionId:first.sessionId,sequence:++sequence,position,state,rate});
  const baseline=sample(0);await call(alice,baseline);
  await new Promise(resolve=>setTimeout(resolve,1100));
  const one=sample(1);const response=await call(alice,one);
  assert.ok(response.progress.watchedSeconds>=0.95 && response.progress.watchedSeconds<=1);
  assert.equal((await call(alice,one)).progress.watchedSeconds,response.progress.watchedSeconds,'Lost acknowledgement cannot double credit');
  await new Promise(resolve=>setTimeout(resolve,1100));
  const completed=await call(alice,sample(2,'ended'));
  assert.equal(completed.progress.done,true);assert.equal(completed.progress.watchedSeconds,2);
  const path='prepWatchProgress/'+completed.progress.id;
  for(const user of [alice,admin,full]) assert.equal((await document(path,{...completed.progress,done:false,watchedSeconds:999},user.token)).status,403,'Client SDK must never alter verified progress');
  checks+=3;
  assert.equal((await document(path,undefined,alice.token)).status,200);
  assert.equal((await document(path,undefined,admin.token)).status,200);
  assert.equal((await document(path,undefined,bob.token)).status,403);checks+=3;
  for(const collection of ['prepWatchSessions','prepWatchVideoMetadata']){
    const id=collection==='prepWatchSessions'?alice.uid:hash(descriptor.videoKey);
    assert.equal((await document(collection+'/'+id,undefined,alice.token)).status,403);
    assert.equal((await document(collection+'/'+id,{forged:true},full.token)).status,403);checks+=2;
  }
  const beforeSecond=await call(alice,start());
  await call(alice,sample(2,'ended'),'FAILED_PRECONDITION');
  await seed('users/'+alice.uid,{role:'student',classIds:['a'],loginDisabled:true});
  await call(alice,{...sample(0),sequence:1,sessionId:beforeSecond.sessionId},'PERMISSION_DENIED');
  await seed('users/'+alice.uid,{role:'student',classIds:['a']});
  await seed('portalPrepSets/watch-material',{...material,assignmentMode:'personal',targetUserIds:[bob.uid]});
  await call(alice,start(),'PERMISSION_DENIED');
  await seed('portalPrepSets/watch-material',{...material,payload:{...material.payload,passages:[{...passage,videoUpdatedAt:'replacement'}]}});
  currentVideoKey='youtube:abcdefghijk:replacement';
  // Missing metadata must fail locally without any external provider request.
  await call(alice,start(),'FAILED_PRECONDITION');
  const replacement=videoDescriptor({...passage,videoUpdatedAt:'replacement'});
  currentVideoKey=replacement.videoKey;
  await seed('prepWatchVideoMetadata/'+hash(replacement.videoKey),{videoKey:replacement.videoKey,duration:2});
  const newVideo=await call(alice,start());assert.equal(newVideo.progress.done,false);assert.equal(newVideo.progress.watchedSeconds,0);
  assert.notEqual(newVideo.progress.id,completed.progress.id);
  assert.equal(await (await document('prepVideoProgress/'+alice.uid+'__legacy')).text(),legacyBefore,'Manual original must stay byte-for-byte unchanged');checks++;
  const {runBrowserChecks}=require('./test-prep-watch-browser.cjs');
  await seed('portalPrepSets/watch-material',material);
  const browserGroups=await runBrowserChecks({alice,material,seed});
  console.log(JSON.stringify({prepWatchEmulatorChecks:checks,browserGroups,productionAccess:false}));
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
