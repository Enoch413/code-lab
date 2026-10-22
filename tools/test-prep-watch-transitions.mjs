import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require=createRequire(import.meta.url)
const {advance,validate}=require('../functions/prep-watch.cjs')
const ui=readFileSync(new URL('../rotation_prep_ui.js',import.meta.url),'utf8')
const defs=new Map([...ui.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const settle=async()=>{for(let n=0;n<60;n++)await Promise.resolve()}
async function fixture(){
  let now=0,poll,held,failed=false
  const events=new Map(),memory=new Map(),requests=[]
  const player={currentTime:0,playbackRate:1,paused:true,ended:false,addEventListener:(name,fn)=>events.set(name,fn),removeEventListener(){},pause(){this.paused=true}}
  let progress={trackingVersion:1,userId:'alice',duration:20,watchedRanges:[],watchedSeconds:0,playSeconds:0,completed:false},session
  const ctx=vm.createContext({crypto:globalThis.crypto,portalState:{firebaseEnabled:true,currentUser:{uid:'alice'},userSession:1,currentPrepVideoProgressRows:[]},
    currentSetIndex:0,prepWatchTracker:null,prepWatchPendingRequest:null,parsePassageVideoUrl:()=>null,
    isPortalAdmin:()=>false,getPortalPrepProgressSetId:()=> 'set-a',getPortalPrepProgressPassageId:()=> 'p0',
    localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},
    sessionStorage:{getItem:()=> 'synthetic-tab'},performance:{now:()=>now},
    document:{hidden:false,getElementById:()=>null,querySelector:()=>player,addEventListener(){},removeEventListener(){}},
    setInterval:fn=>{poll=fn;return 1},clearInterval(){},
    mergePortalPrepVideoProgressCache(){},applyPortalPrepVideoProgressRowsToCurrentPrepClass:()=>false,getCurrentActiveScreenId:()=> 'study-screen',
    callPrepWatchServer:async request=>{
      validate(request);requests.push(structuredClone(request))
      if(failed){failed=false;throw Error('synthetic network loss')}
      if(request.action==='start')session={sequence:0,lastAt:now,position:0,rate:1,state:'paused'}
      else {const next=advance(progress,session,request,now);progress=next.progress;session=next.session}
      const response={sessionId:'synthetic-session-001',sequence:session.sequence,progress}
      if(held){const pending=held;held=null;await pending.promise}
      return response
    }})
  for(const name of ['getPrepWatchVideoKey','isCurrentPrepWatch','syncPrepWatchStatus','capturePrepWatchSample','prepWatchSample','applyPrepWatchServerProgress','sendPrepWatchSample','queuePrepWatchSample','beginPrepWatchTracking'])if(defs.has(name))vm.runInContext(defs.get(name),ctx)
  await ctx.beginPrepWatchTracking({materialId:'set-a',id:'set-a'},{id:'p0',videoStoragePath:'prep-videos/a/set-a/file.mp4'},0);await settle()
  return {ctx,player,requests,memory,get progress(){return progress},get session(){return session},
    at(seconds,position){now=seconds*1000;player.currentTime=position},
    async event(name){if(name==='play'||name==='playing')player.paused=false;if(name==='pause')player.paused=true;if(name==='ended'){player.ended=true;player.paused=true}events.get(name)?.();await settle()},
    async tick(){poll();await settle()},hold(){const pending=Promise.withResolvers();held=pending;return async()=>{pending.resolve();await settle()}},fail(){failed=true}}
}
const groups={
  async delayedRate(){
    for(const changes of [[[6,2]],[[2,2],[6,1]],[[6,2],[7,1],[8,2]]]){
      const f=await fixture();await f.event('play')
      let position=0,rate=1,release
      for(let second=1;second<=60;second++){
        const step=Math.min(1,(20-position)/rate)
        position=Math.min(20,position+step*rate);f.at(second-1+step,position)
        if(second===5)release=f.hold()
        const change=changes.find(entry=>entry[0]===second)
        if(change){rate=change[1];f.player.playbackRate=rate;await f.event('ratechange')}
        await f.tick()
        if(second===9)await release()
        if(position===20){await f.event('ended');assert.equal(f.progress.watchedSeconds,20,'Delayed rate changes retain every viewed segment');assert.equal(f.progress.playSeconds,second-1+step);assert.equal(f.progress.done,true);break}
      }
    }
  },
  async buffering(){
    for(const [bufferSeconds,delay] of [[2,false],[2,true],[12,false],[20,false]]){
      const f=await fixture();await f.event('play');let release
      for(let second=1;second<=5;second++){f.at(second,second);if(delay&&second===5)release=f.hold();await f.tick()}
      f.at(6,6);await f.event('waiting');await f.tick()
      const resume=6+bufferSeconds
      for(let second=7;second<=resume;second++){f.at(second,6);await f.tick()}
      f.at(resume,6);await f.event('playing')
      if(release){f.at(9,7);await release()}
      for(let second=resume+1;second<=resume+14;second++){f.at(second,second-bufferSeconds);if(second===resume+14)await f.event('ended');else await f.tick()}
      assert.equal(f.progress.watchedSeconds,20,'Buffer resume must not lose real viewing')
      assert.equal(f.progress.playSeconds,20,'Buffer time must not count as playback');assert.equal(f.progress.done,true)
      assert.ok(f.requests.some(request=>request.state==='playing'&&request.position===6),'playing event must establish the resume boundary')
    }
  },
  async retryAndQueueBound(){
    const f=await fixture();await f.event('play');const release=f.hold()
    f.at(5,5);await f.tick();await f.tick();await f.tick();await f.tick();await f.tick()
    for(let n=0;n<50;n++){f.at(6+n/100,6);f.player.playbackRate=n%2?1:2;await f.event('ratechange')}
    assert.ok(f.ctx.prepWatchTracker.queuedSamples.length<=32,'Event queue is bounded')
    assert.ok(f.ctx.prepWatchTracker.queuedSamples.some(sample=>sample.state==='seeking'),'Overflow drops credit and establishes a new baseline')
    f.at(9,6);await release();assert.equal(f.progress.done,false)
    f.at(10,7);f.fail();f.ctx.queuePrepWatchSample(f.ctx.prepWatchTracker,'playing');await settle()
    const failed=f.requests.at(-1);assert.ok(f.ctx.prepWatchTracker.pending)
    f.at(11,8);f.player.playbackRate=2;await f.event('ratechange')
    const retries=f.requests.filter(request=>request.requestId===failed.requestId)
    assert.equal(retries.length,2);for(const retry of retries)assert.deepEqual(retry,failed)
    assert.ok(f.requests.some(request=>request.state==='ratechange'&&request.position===8&&request.rate===2),'An event that triggers a retry is retained after the pending ACK')
    assert.equal(f.ctx.prepWatchTracker.pending,null);assert.equal(f.memory.size,0)
  },
  async clockBoundary(){
    const initial={duration:100,watchedRanges:[],watchedSeconds:0,playSeconds:0,completed:false}
    let progress=initial,session={sequence:0,lastAt:0,position:0,rate:1,state:'playing'}
    const sample=(sequence,position,elapsedSeconds,state='playing')=>({action:'sample',materialId:'set-a',passageIndex:0,videoKey:'storage:prep-videos/a/set-a/file.mp4:',sessionId:'synthetic-session-001',requestId:'synthetic-request-'+sequence,sequence,position,rate:1,state,elapsedSeconds})
    for(const elapsedSeconds of [NaN,Infinity,-1,16,'5'])assert.throws(()=>validate(sample(1,5,elapsedSeconds)),/재생 상태/)
    for(let sequence=1;sequence<=10;sequence++){const request=sample(sequence,sequence*5,5);validate(request);const next=advance(progress,session,request,5000);progress=next.progress;session=next.session}
    assert.equal(progress.playSeconds,5,'Repeated queued claims cannot exceed elapsed server time')
    assert.equal(progress.watchedSeconds,5);assert.equal(progress.done,false)
    const gap=advance(initial,{sequence:0,lastAt:0,position:0,rate:1,state:'playing',timeBudget:10},sample(1,5,5),20000)
    assert.equal(gap.progress.playSeconds,0,'A long offline gap discards old server time budget')
    assert.equal(gap.session.timeBudget,0)
    const seek=advance(initial,{sequence:0,lastAt:0,position:0,rate:1,state:'playing'},sample(1,90,5,'seeking'),5000)
    assert.equal(seek.progress.watchedSeconds,0)
    assert.equal(advance(initial,{sequence:0,lastAt:0,position:0,rate:1,state:'paused'},sample(1,5,5),5000).progress.watchedSeconds,0)
    const request=sample(1,5,5),next=advance(initial,{sequence:0,lastAt:0,position:0,rate:1,state:'playing'},request,5000)
    assert.equal(advance(next.progress,next.session,request,9000).duplicate,true)
    assert.equal(advance(next.progress,next.session,request,9000).session.timeBudget,next.session.timeBudget,'Duplicate responses cannot earn a new time budget')
  }
}
let failures=0
for(const [name,run] of Object.entries(groups))try{await run();console.log('PREP transition '+name+': OK')}catch(error){failures++;console.error('PREP transition '+name+': '+error.stack)}
if(failures)process.exitCode=1
else console.log('PREP transitions: 4 regression groups passed; no production connection.')
