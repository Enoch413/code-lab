import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const source=readFileSync(new URL('../rotation_portal_enhancements.js',import.meta.url),'utf8')
const defs=new Map([...source.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const flush=async()=>{for(let i=0;i<35;i++)await Promise.resolve()}
const clone=value=>JSON.parse(JSON.stringify(value))
const storage=new Map(),server=new Map()
let offline=true,writes=0,hold=null
const create=(uid='alice')=>{
  const context={level:{id:'lv',level:'Level'},chapter:{number:'1',title:'Chapter'},unit:{id:'unit',number:'1',title:'Unit',videos:['synthetic.mp4']}}
  const state={firebaseEnabled:true,userSession:1,currentUser:{uid},currentProfile:{uid,role:'student',classIds:['a'],name:'PRIVATE NAME',email:'private@example.invalid'},
    grammarProgress:{rows:[],tracker:null,saveTimer:0},grammarPlayer:{unitId:'unit',partIndex:0}}
  const db={collection:()=>({doc:id=>({id})}),runTransaction:async fn=>{
    if(offline)throw Error('offline')
    const snapshot=new Map(server);let pending
    const result=await fn({get:async ref=>({exists:snapshot.has(ref.id),data:()=>clone(snapshot.get(ref.id))}),set:(ref,data)=>{pending={id:ref.id,data:clone(data)}}})
    if(hold)await hold
    if(pending){server.set(pending.id,pending.data);writes++}
    return result
  }}
  state.db=db
  const toasts=[]
  const ctx=vm.createContext({portalState:state,PORTAL_ENHANCEMENT_KEYS:{grammarVideoProgress:'local',grammarProgressPendingPrefix:'pending:'},
    PORTAL_GRAMMAR_VIDEO_PROGRESS_COLLECTION:'grammarVideoProgress',PORTAL_GRAMMAR_PROGRESS_SAVE_DELAY:8000,
    localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
    window:{setTimeout:()=>1,clearTimeout(){}},document:{visibilityState:'hidden'},
    getCurrentGrammarUnitContext:()=>context,getGrammarChapterDisplayTitle:chapter=>chapter.title,getProfileClassIds:()=>state.currentProfile.classIds,
    syncGrammarPlayerWatchStatus(){},renderGrammarCourse(){},getCurrentActiveScreenId:()=>'',showToast:message=>toasts.push(message),
    fetchScopedPortalRecordDocs:async()=>{if(offline)throw Error('offline');return [...server].filter(([,r])=>r.userId===uid).map(([id,r])=>({id,data:()=>clone(r)}))},
    console:{warn(){},error(){}},Date,Map,Set})
  const names=['getGrammarProgressUserId','shouldTrackGrammarProgress','sanitizeGrammarProgressSegment','buildGrammarProgressDocId','normalizeGrammarProgressStatus',
    'normalizeGrammarWatchedRanges','getGrammarWatchedSeconds','getGrammarCompletionRatio','normalizeGrammarVideoProgressRecord','mergeGrammarVideoProgressRecord',
    'readLocalGrammarVideoProgressRows','writeLocalGrammarVideoProgressRows','saveLocalGrammarVideoProgressRecord',
    'fetchGrammarVideoProgressRows','ensureCurrentGrammarProgressLoaded','buildGrammarProgressRecord','persistGrammarProgressRecord','flushGrammarProgress',
    'scheduleGrammarProgressSave','handleGrammarProgressVisibilityChange','handleGrammarProgressBeforeUnload',
    'getPendingGrammarProgressKey','readPendingGrammarProgressRows','stageGrammarProgressRecord','mergeGrammarProgressRecords','retryPendingGrammarProgress']
  for(const name of names)if(defs.has(name))vm.runInContext(defs.get(name),ctx)
  state.grammarProgress.tracker={userId:uid,unitId:'unit',partIndex:0,fileName:'synthetic.mp4',duration:100,currentTime:20,watchedRanges:[{start:0,end:20}],startedAt:'2026-10-20T00:00:00.000Z',dirty:true}
  return {ctx,state,toasts}
}

// Losing the JS process before the delayed network save must still leave a durable, UID-scoped record.
{
  const {ctx}=create()
  ctx.scheduleGrammarProgressSave('timeupdate',false)
  assert.ok(storage.size,'Progress must be persisted before the eight-second save timer or any promise runs')
  const value=[...storage.values()].join('')
  assert.ok(value.includes('alice')&&value.includes('20'))
  assert.ok(!value.includes('PRIVATE NAME')&&!value.includes('private@example.invalid'),'Pending storage excludes personal profile details')
}
{
  const {ctx,state}=create()
  const rows=await ctx.ensureCurrentGrammarProgressLoaded(false)
  assert.equal(rows.length,1,'Offline restart recovers the unsent record')
  assert.equal(rows[0].currentTime,20)
  offline=false
  await ctx.retryPendingGrammarProgress();await flush()
  assert.equal(server.get('alice__unit__0').currentTime,20)
  assert.equal(ctx.readPendingGrammarProgressRows('alice').length,0,'Only acknowledged progress leaves the queue')
  assert.equal(state.grammarProgress.rows[0].currentTime,20)
}
{
  offline=true
  const {ctx,state}=create();state.grammarProgress.tracker.currentTime=35
  state.grammarProgress.tracker.watchedRanges=[{start:0,end:35}]
  await ctx.flushGrammarProgress('pause')
  assert.equal(ctx.readPendingGrammarProgressRows('alice')[0].currentTime,35,'Failed writes remain durable')
  offline=false
  server.set('alice__unit__0',{...server.get('alice__unit__0'),completed:true,status:'completed',currentTime:100,watchedRanges:[{start:0,end:100}],updatedAt:'2026-12-01T00:00:00.000Z'})
  await ctx.retryPendingGrammarProgress()
  assert.equal(server.get('alice__unit__0').completed,true,'Retry merges server completion instead of reverting it')
  assert.equal(server.get('alice__unit__0').currentTime,100)
}
{
  let release;hold=new Promise(resolve=>{release=resolve})
  const {ctx,state}=create();state.grammarProgress.tracker.currentTime=40
  const saving=ctx.flushGrammarProgress('pause');await flush()
  state.grammarProgress.tracker.currentTime=50;state.grammarProgress.tracker.dirty=true
  ctx.scheduleGrammarProgressSave('timeupdate',false)
  release();hold=null;await saving
  assert.equal(ctx.readPendingGrammarProgressRows('alice')[0].currentTime,50,'An old acknowledgement must not remove newer unsent progress')
  await ctx.retryPendingGrammarProgress();assert.equal(ctx.readPendingGrammarProgressRows('alice').length,0)
}
{
  offline=true
  const alice=create();alice.ctx.scheduleGrammarProgressSave('timeupdate',false)
  const bob=create('bob');await assert.rejects(bob.ctx.ensureCurrentGrammarProgressLoaded(false),/offline/)
  assert.equal(bob.state.grammarProgress.rows.length,0,'Another UID must not recover Alice progress')
  offline=false;const before=writes
  await bob.ctx.retryPendingGrammarProgress();assert.equal(writes,before)
  assert.ok(bob.ctx.readPendingGrammarProgressRows('alice').length)
  const queued=alice.ctx.flushGrammarProgress('pause')
  alice.state.userSession++;alice.state.currentUser={uid:'bob'};alice.state.currentProfile={uid:'bob',role:'student',classIds:['b']};alice.state.grammarProgress.rows=[]
  await queued
  assert.equal(writes,before,'An old queued callback cannot write with the new account session')
  assert.equal(alice.state.grammarProgress.rows.length,0)
}
{
  offline=true;storage.clear();server.clear()
  const first=create(),second=create()
  first.ctx.scheduleGrammarProgressSave('timeupdate',false)
  Object.assign(second.state.grammarProgress.tracker,{currentTime:50,watchedRanges:[{start:40,end:50}]})
  second.ctx.scheduleGrammarProgressSave('timeupdate',false)
  const pending=second.ctx.readPendingGrammarProgressRows('alice')[0]
  assert.equal(second.ctx.getGrammarWatchedSeconds(pending.watchedRanges,100),30,'Two tabs must union unsent watched ranges')
  offline=false;await first.ctx.flushGrammarProgress('pause')
  assert.equal(first.ctx.getGrammarWatchedSeconds(server.get('alice__unit__0').watchedRanges,100),30)
  assert.equal(first.ctx.readPendingGrammarProgressRows('alice').length,0)
}
{
  const {ctx,state,toasts}=create()
  ctx.localStorage.setItem=()=>{throw Error('quota exceeded')}
  ctx.scheduleGrammarProgressSave('timeupdate',false);ctx.scheduleGrammarProgressSave('timeupdate',false)
  assert.equal(state.grammarProgress.tracker.dirty,true,'Storage failure must leave the tracker retryable')
  assert.equal(toasts.length,1,'A storage failure needs a visible, nonrepeating warning')
}
{
  const {ctx,state}=create();state.db=null
  assert.equal(await ctx.flushGrammarProgress('pause'),false,'Missing cloud initialization must not become local success')
  assert.ok(ctx.readPendingGrammarProgressRows('alice').length)
  assert.equal(storage.has('local'),false)
}
console.log('GRAMMAR recovery: durable offline/restart, UID isolation, retry, server/tab merge, acknowledgement ordering and quota feedback: OK')
