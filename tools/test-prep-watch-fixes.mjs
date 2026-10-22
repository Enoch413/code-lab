import assert from 'node:assert/strict'
import vm from 'node:vm'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require=createRequire(import.meta.url)
const {advance,validate,videoDescriptor,hash}=require('../functions/prep-watch.cjs')
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const defs=text=>new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const functions=new Map([...defs(read('rotation_prep_ui.js')),...defs(read('rotation_portal_enhancements.js')),...defs(read('rotation_prep_passages.js'))])
const load=(ctx,names)=>names.forEach(name=>{assert.ok(functions.has(name),name);vm.runInContext(functions.get(name),ctx)})
const groups={
  async titleVersion(){
    for(const [oldVersion,url,changed] of [['2026-01-01','https://youtu.be/abcdefghijk',false],['','https://www.youtube.com/watch?v=abcdefghijk',false],['2026-01-01','https://www.youtube.com/watch?v=lmnopqrstuv',true]]){
      let saved,errors=0
      const passage={id:'video-1',title:'Old title',videoUrl:'https://www.youtube.com/watch?v=abcdefghijk',videoEmbedUrl:'https://www.youtube.com/embed/abcdefghijk',videoUpdatedAt:oldVersion,video:{url:'https://www.youtube.com/watch?v=abcdefghijk',embedUrl:'https://www.youtube.com/embed/abcdefghijk',updatedAt:oldVersion}}
      const original=structuredClone(passage),manual={done:true,completedAt:'2026-01-01'},before=JSON.stringify(manual)
      const ctx=vm.createContext({URL,Date,portalState:{userSession:1,prepVideoManager:{open:true,docId:'set-a',currentDoc:{docId:'set-a',payload:{id:'set-a',passages:[passage]}}}},
        getPortalPrepVideoInputValue:()=>url,getPortalPrepVideoTitleInputValue:()=> 'Renamed title',buildPassageState:()=>({...passage,hasVideo:true}),clonePlainData:structuredClone,
        renderPortalPrepVideoManager(){},saveCloudSetDoc:async(kind,id,value)=>{saved=structuredClone(value)},syncPrepContentAfterLogin:async()=>true,getCloudSetDoc:async()=>saved,isPortalDirectPrepVideoPayload:()=>true,
        getPortalUploadTargetClass:()=>null,syncPortalAdminSetPanels(){},getCurrentActiveScreenId:()=>'',showToast(){},console:{error(){errors++}}})
      load(ctx,['parsePassageVideoUrl','normalizePortalPrepYouTubeUrl','clearPortalPrepVideoSourceAliases','savePortalPrepPassageVideoUrl'])
      await ctx.savePortalPrepPassageVideoUrl(0)
      assert.equal(errors,0);assert.ok(saved)
      const after=saved.payload.passages[0]
      const id=raw=>hash(JSON.stringify(['alice','set-a',0,videoDescriptor(raw).videoKey]))
      assert.equal(id(after)!==id(original),changed,'Only a different video may create a new progress identity')
      assert.equal(after.title,'Renamed title');assert.equal(after.videoUpdatedAt,after.video.updatedAt)
      assert.equal(JSON.stringify(manual),before)
    }
  },
  async rateTransitions(){
    for(const [firstRate,nextRate,boundary,finishAt] of [[1,2,4,12000],[2,1,8,16000],[2,0.25,8,52000]]){
      let progress={duration:20,watchedRanges:[],watchedSeconds:0,playSeconds:0,completed:false},session={sequence:0,lastAt:0,position:0,rate:firstRate,state:'playing'},sequence=0
      const tick=(position,rate,state,now)=>{const request={action:'sample',materialId:'set-a',passageIndex:0,videoKey:'youtube:abcdefghijk:',sessionId:'synthetic-session-001',requestId:'synthetic-request-'+ ++sequence,sequence,position,rate,state};validate(request);const next=advance(progress,session,request,now);progress=next.progress;session=next.session}
      tick(boundary,nextRate,'ratechange',4000)
      tick(boundary,nextRate,'playing',4000)
      const remaining=(20-boundary)/nextRate
      for(let seconds=5;seconds<remaining;seconds+=5)tick(boundary+seconds*nextRate,nextRate,'playing',4000+seconds*1000)
      tick(20,nextRate,'ended',finishAt)
      assert.equal(progress.watchedSeconds,20);assert.equal(progress.playSeconds,finishAt/1000);assert.equal(progress.completed,true)
    }
    const initial={duration:100,watchedRanges:[],watchedSeconds:0,playSeconds:0,completed:false},session={sequence:0,lastAt:0,position:0,rate:1,state:'playing'}
    for(const [position,rate,now] of [[90,2,1000],[5,2,20000]]){
      const next=advance(initial,session,{sequence:1,position,rate,state:'ratechange',requestId:'synthetic-rate-0001'},now)
      assert.equal(next.progress.watchedSeconds,0);assert.equal(next.progress.done,false)
    }
    const paused=advance(initial,{...session,state:'paused'},{sequence:1,position:5,rate:2,state:'ratechange',requestId:'synthetic-rate-0001'},5000)
    assert.equal(paused.progress.watchedSeconds,0)
  },
  async navigationAcknowledgement(){
    for(const target of ['list','other-video','other-class','other-account','new-session']){
      const deferred=Promise.withResolvers(),memory=new Map(),rows=[],calls={hydrate:0,list:0,summary:0,ui:0}
      const tracker={uid:'alice',userSession:1,materialId:'set-a',videoKey:'youtube:abcdefghijk:',setIndex:0,passageIndex:0,sequence:0,sessionId:'synthetic-session-001',pendingKey:'synthetic-pending',read:()=>({position:20,rate:1,state:'ended'})}
      const state={userSession:1,currentUser:{uid:'alice'}},ctx=vm.createContext({crypto:globalThis.crypto,performance:{now:()=>0},prepWatchTracker:tracker,prepWatchPendingRequest:null,portalState:state,progress:{done:{}},
        document:{hidden:false,querySelector:()=>{calls.ui++;return null}},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)},
        callPrepWatchServer:()=>deferred.promise,mergePortalPrepVideoProgressCache:row=>rows.push(row),applyPortalPrepVideoProgressRowsToCurrentPrepClass:()=>{calls.hydrate++;return target!=='other-class'},
        getCurrentActiveScreenId:()=>target==='list'?'passage-screen':'study-screen',renderClassSummary:()=>calls.summary++,renderPassageScreen:()=>calls.list++,
        syncPrepWatchStatus:()=>calls.ui++,getPassageProgressStorageKey:()=> 'old',saveProgress(){}})
      for(const name of ['isCurrentPrepWatch','capturePrepWatchSample','prepWatchSample','sendPrepWatchSample'])load(ctx,[name])
      if(functions.has('applyPrepWatchServerProgress'))load(ctx,['applyPrepWatchServerProgress'])
      const pending=ctx.sendPrepWatchSample(tracker)
      ctx.prepWatchTracker=target==='list'?null:{uid:'alice',userSession:1,materialId:'set-b',progress:{done:false}}
      if(target==='other-account')state.currentUser={uid:'bob'}
      if(target==='new-session')state.userSession++
      const nextTracker=ctx.prepWatchTracker
      deferred.resolve({sessionId:tracker.sessionId,sequence:1,progress:{trackingVersion:1,id:'auto-a',userId:'alice',materialId:'set-a',done:true}})
      await pending
      const sameAccount=!['other-account','new-session'].includes(target)
      assert.equal(rows.length,sameAccount?1:0,'A valid same-account acknowledgement must reach its cache after navigation')
      assert.equal(calls.hydrate,sameAccount?1:0);assert.equal(calls.list,target==='list'?1:0);assert.equal(calls.summary,target==='list'?1:0)
      assert.equal(calls.ui,0,'Never repaint a replacement player or account');assert.equal(ctx.prepWatchTracker,nextTracker)
      assert.equal(memory.size,0,'Acknowledged pending request is removed')
    }
  },
  async archiveContract(){
    const manual={id:'manual',userId:'alice',setId:'set-a',passageId:'video-1',passageIndex:0,classIds:['a'],trackingVersion:0,done:true,completedAt:'2026-01-01',updatedAt:'2026-01-01'}
    const automatic={...manual,id:'automatic',materialId:'set-a',trackingVersion:1,videoKey:'youtube:abcdefghijk:',duration:20,watchedSeconds:20,playSeconds:10,completedAt:'2026-10-22',updatedAt:'2026-10-22'}
    const student={uid:'alice',role:'student',classIds:['a'],name:'Synthetic student'},passage={id:'video-1',index:0,materialId:'set-a'}
    const ctx=vm.createContext({Map,Set,Date,getPortalPrepProgressSetId:()=> 'set-a',getPortalPrepArchiveClassIdsForSet:()=>['a'],normalizePortalPrepProgressStudents:users=>users,
      getPortalPrepProgressPassages:()=>[passage],getPrepWatchVideoKey:()=> 'youtube:abcdefghijk:',normalizePortalPrepProgressMatchValue:value=>String(value||'').toLowerCase(),
      escapeHtml:value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;'),summarizePortalCounts:(rows,predicate)=>rows.filter(predicate).length,formatPortalDateTime:()=>''})
    load(ctx,['doesPortalPrepProgressMatchStudent','getPortalPrepProgressForStudent','buildPortalPrepVideoProgressArchiveRows','buildPortalExamArchiveSnapshot','buildPortalHtmlTable','buildPortalExamArchiveExcelHtml'])
    for(const name of ['getPortalPrepWatchArchiveFields','getPortalPrepWatchArchiveCells'])if(functions.has(name))load(ctx,[name])
    const cases=[{rows:[manual],source:'manual',play:null,done:true,legacy:'2026-01-01'},
      {rows:[manual,automatic],source:'automatic',play:10,done:true,legacy:'2026-01-01'},
      {rows:[manual,{...automatic,done:false,watchedSeconds:5,playSeconds:2.5,completedAt:''}],source:'automatic',play:2.5,done:false,legacy:'2026-01-01'},
      {rows:[],source:'none',play:null,done:false,legacy:''}]
    for(const test of cases){
      const original=JSON.stringify(test.rows)
      Object.assign(ctx,{Date,portalState:{currentUser:{uid:'synthetic-admin'}},PORTAL_CLOUD_DOCS:{prep:'prep',check:'check'},PORTAL_CLASS_CATALOG_DOC:'classes',prepClasses:[],
        clonePlainData:structuredClone,getPortalDisplayIdentity:()=> 'Synthetic admin',normalizePortalPrepClassList:rows=>rows,
        loadPortalExamState:async()=>({examName:'Synthetic archive'}),fetchAllPortalUsersForSuperAdmin:async()=>[student],fetchAllCheckResponses:async()=>[],fetchAllQuestionIssues:async()=>[],fetchAllCounselRequests:async()=>[],
        fetchAllPortalPrepVideoProgress:async()=>test.rows,loadCloudSetDocs:async kind=>kind==='prep'?[{docId:'set-a',title:'Synthetic PREP',payload:{id:'set-a'}}]:[],loadCloudContentDoc:async id=>id==='classes'?{payload:{classes:[{id:'a',name:'Synthetic class'}]}}:null})
      const snapshot=await ctx.buildPortalExamArchiveSnapshot('Synthetic archive'),report=snapshot.prepVideoProgressReport
      assert.equal(report[0].progressSource,test.source);assert.equal(report[0].playSeconds,test.play);assert.equal(report[0].done,test.done);assert.equal(report[0].legacyCompletedAt,test.legacy)
      assert.equal(report[0].automaticCompletedAt,test.source==='automatic'&&test.done?'2026-10-22':'')
      const html=ctx.buildPortalExamArchiveExcelHtml(snapshot)
      assert.ok(html.includes('progressSource')&&html.includes('playSeconds')&&html.includes('completionPercent')&&html.includes('legacyCompletedAt'))
      assert.ok(html.includes(test.source==='automatic'?'서버 자동 검증':test.source==='manual'?'기존 수동 · 미검증':'기록 없음'))
      if(test.source!=='automatic')assert.ok(html.includes('미측정'))
      assert.equal(JSON.stringify(test.rows),original,'Archive derivation must not mutate manual or automatic originals')
      assert.equal(JSON.stringify(snapshot.prepVideoProgress),original,'Raw snapshot must preserve original records')
    }
    const zero=Array.from(ctx.getPortalPrepWatchArchiveCells({...automatic,done:false,watchedSeconds:0,playSeconds:0}))
    assert.deepEqual(zero.slice(1,5),['0','0','20','0.0'],'Measured zero is distinct from unmeasured legacy data')
  }
}
let failures=0
for(const [name,run] of Object.entries(groups)){
  try{await run();console.log('PREP fixes '+name+': OK')}
  catch(error){failures++;console.error('PREP fixes '+name+': '+error.message)}
}
if(failures)process.exitCode=1
else console.log('PREP fixes: 4 regression groups passed; no production connection.')
