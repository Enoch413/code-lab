import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const defs=text=>new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const functions=new Map([...defs(read('rotation_portal.js')),...defs(read('rotation_portal_enhancements.js'))])
const load=(ctx,names)=>names.forEach(name=>{assert.ok(functions.has(name),name);vm.runInContext(functions.get(name),ctx)})
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject}}
const flush=async()=>{for(let i=0;i<35;i++)await Promise.resolve()}
const bundle=id=>({bundle:{id,updatedAt:id,classes:[{id:'a'}],studySets:[]},inventory:[id]})

// Firebase users load authorized material on demand; the legacy bootstrap must not install local JSON later.
for(const configured of [false,true]){
  let reads=0
  const ctx=vm.createContext({history:{},bindEvents(){},applyPageTitle(){},APP_CONFIG:{defaultTitle:'CODE LAB'},setBootState(){},setSessionStatus(){},resetViewportPosition(){},
    isFirebaseConfigured:()=>configured,loadRemoteSession:async()=>{reads++;return true},showNoSessionState(){}})
  vm.runInContext(defs(read('rotation_prep_core.js')).get('initApp'),ctx);await ctx.initApp()
  assert.equal(reads,configured?0:1,'Cloud bootstrap must defer to scoped PREP entry while local preview keeps its startup JSON')
}

// Authentication and password-reset routing cannot depend on any PREP network result.
for(const passwordRequired of [false,true]){
  let home=0,password=0,prepReads=0,hash=0
  const ctx=vm.createContext({portalState:{authResolved:true,currentUser:{uid:'alice'},currentProfile:{}},bundleData:null,
    syncAuthClassOptions(){},clearAuthError(){},updatePortalUserCard(){},isPasswordResetRequired:()=>passwordRequired,
    showPortalScreen:()=>home++,openPasswordScreen:()=>password++,handlePortalHashRoute:()=>hash++,
    syncPrepContentAfterLogin:()=>{prepReads++;return new Promise(()=>{})}})
  load(ctx,['routePortalAfterState']);ctx.routePortalAfterState();await flush()
  assert.equal(home,passwordRequired?0:1,'The home screen must open before PREP resolves')
  assert.equal(password,passwordRequired?1:0);assert.equal(hash,passwordRequired?0:1)
  assert.equal(prepReads,0,'PREP is loaded on entry, not as an authentication dependency')
}

const syncContext=()=>{
  const state={userSession:1,currentUser:{uid:'alice'},currentProfile:{},contentMeta:{},prepSetInventory:['old'],currentPrepVideoProgressRows:['old'],currentPrepVideoProgressLoadedUserId:'old'}
  let content=deferred(),progress=deferred(),expire;const applied=[],repaint=[]
  const ctx=vm.createContext({portalState:state,isGrammarOnlyStudent:()=>false,
    loadPortalPrepBundleFromSources:()=>content.promise,fetchCurrentPortalPrepVideoProgressRows:()=>progress.promise,
    getPortalPrepVideoProgressUserId:()=>state.currentUser?.uid||'',
    applyPortalPrepVideoProgressRowsToCurrentPrepClass:()=>true,refreshVisiblePortalPrepProgressAfterHydration:value=>repaint.push(value),
    window:{applyPrepSessionData:data=>applied.push(data.id)},setTimeout:(fn,ms)=>{assert.equal(ms,20000);expire=fn;return 1},clearTimeout(){},console:{error(){}}})
  load(ctx,['withPortalReadTimeout','syncPrepContentAfterLogin'])
  return {ctx,state,applied,repaint,get content(){return content},get progress(){return progress},next(){content=deferred();progress=deferred()},expire:()=>expire()}
}
{
  const test=syncContext(),pending=test.ctx.syncPrepContentAfterLogin(false)
  test.content.resolve(bundle('first'));await flush()
  assert.equal(test.applied.length,0,'Unconfirmed progress must not partially install a PREP bundle')
  test.expire();assert.equal(await pending,false)
  assert.ok(test.state.prepSyncError,'A timeout must be exposed to PREP entry feedback')
  assert.deepEqual(test.state.prepSetInventory,['old']);assert.deepEqual(test.state.currentPrepVideoProgressRows,['old'])
  test.progress.resolve([]);await flush()
  assert.equal(test.applied.length,0,'A timed-out result must never install later')
  test.next();const retry=test.ctx.syncPrepContentAfterLogin(true)
  test.content.resolve(bundle('retry'));test.progress.resolve(['confirmed']);assert.equal(await retry,true)
  assert.deepEqual(test.applied,['retry']);assert.equal(test.state.prepSyncError,'')
  assert.deepEqual(test.state.prepSetInventory,['retry']);assert.deepEqual(test.state.currentPrepVideoProgressRows,['confirmed'])
}
for(const rejected of [false,true]){
  const test=syncContext(),first=test.ctx.syncPrepContentAfterLogin(false),oldContent=test.content,oldProgress=test.progress
  test.next();const second=test.ctx.syncPrepContentAfterLogin(true),newPromise=test.state.prepSyncPromise
  if(rejected)oldContent.reject(Error('old failure'));else oldContent.resolve(bundle('obsolete'))
  oldProgress.resolve(['old']);assert.equal(await first,false)
  assert.equal(test.state.prepSyncPromise,newPromise,'An old finally must not release the new request')
  test.content.resolve(bundle('new'));test.progress.resolve(['new']);assert.equal(await second,true)
  assert.deepEqual(test.applied,['new']);assert.equal(test.state.prepSyncError,'')
}
for(const next of ['bob',null]){
  const test=syncContext(),pending=test.ctx.syncPrepContentAfterLogin(false)
  test.state.userSession++;test.state.currentUser=next?{uid:next}:null
  test.content.resolve(bundle('old'));test.progress.resolve(['old']);await pending
  assert.equal(test.applied.length,0);assert.equal(test.repaint.length,0)
  assert.deepEqual(test.state.prepSetInventory,['old'],'A stale operation cannot commit inventory to another session')
}

// Independent reads start together and the source loader itself has no state commit after an expired request.
{
  const tasks=[deferred(),deferred(),deferred()],calls=[],state={userSession:1,prepSetInventory:['preserved']}
  const ctx=vm.createContext({portalState:state,PORTAL_CLASS_CATALOG_DOC:'catalog',PORTAL_CLOUD_DOCS:{prep:'legacy'},PORTAL_CLASS_REFERENCE:[],prepClasses:[],bundleData:null,
    loadCloudContentDoc:id=>{calls.push(id);return tasks[id==='catalog'?0:1].promise},loadCloudSetDocs:()=>{calls.push('sets');return tasks[2].promise},
    normalizeBundleData:value=>value,normalizePortalPrepClassList:value=>value||[],mergePortalPrepClasses:(...rows)=>rows.flat(),
    buildPortalPrepClassMap:()=>new Map(),loadPortalScopedPrepClassEntries:async()=>[{id:'a'}],normalizePortalPrepConfig:()=>({}),
    normalizeStoredPrepSet:value=>value,buildPortalPrepSetInventory:(legacy,docs)=>docs.map(doc=>doc.docId),getLatestPortalTimestamp:()=>''})
  load(ctx,['loadPortalPrepBundleFromSources'])
  const pending=ctx.loadPortalPrepBundleFromSources();assert.deepEqual(calls,['catalog','legacy','sets'])
  tasks[0].resolve(null);tasks[1].resolve(null);tasks[2].resolve([{docId:'new',payload:{}}]);const result=await pending
  assert.deepEqual(state.prepSetInventory,['preserved'])
  assert.equal(result.inventory[0],'new');assert.ok(result.bundle)
  calls.length=0
  let scopedReads=0;ctx.loadPortalScopedPrepClassEntries=async()=>{scopedReads++;return []}
  const old=ctx.loadPortalPrepBundleFromSources();state.userSession++
  await assert.rejects(old,/changed/);assert.equal(scopedReads,0,'A stale source read must stop before querying the next account')
}

for(const next of ['stay','leave','logout','new-entry']){
  const task=deferred(),state={userSession:1,currentUser:{uid:'alice'},prepSyncError:''};let screen='portal-screen'
  const phases=[],effects=[]
  const ctx=vm.createContext({portalState:state,bundleData:{id:'old'},ensurePortalScreenAccess:()=>true,
    activatePortalScreen:id=>{screen=id},getCurrentActiveScreenId:()=>screen,renderPrepEntryState:phase=>phases.push(phase),
    syncPrepContentAfterLogin:()=>task.promise,hideAllScreensBeforePrep:()=>effects.push('hide'),isPortalAdmin:()=>false,
    ensureStudentPrepSelection:()=>effects.push('select'),showPassageScreen:()=>effects.push('show'),showAuthScreen(){},console:{error(){}},window:{}})
  load(ctx,['openPrepPortal'])
  const pending=ctx.openPrepPortal()
  assert.equal(screen,'passage-screen');assert.deepEqual(phases,['loading'],'PREP entry explains loading immediately')
  if(next==='leave')screen='grammar-screen'
  if(next==='logout'){state.userSession++;state.currentUser=null;screen='auth-screen'}
  if(next==='new-entry')state.prepEntryRequest={}
  task.resolve(true);await pending
  assert.deepEqual(effects,next==='stay'?['hide','select','show']:[],'A late entry cannot route a different screen/session/request')
}
{
  const state={userSession:1,currentUser:{uid:'alice'},prepSyncError:''},phases=[];let screen='portal-screen',fail=true
  const ctx=vm.createContext({portalState:state,bundleData:{id:'old'},ensurePortalScreenAccess:()=>true,
    activatePortalScreen:id=>{screen=id},getCurrentActiveScreenId:()=>screen,renderPrepEntryState:phase=>phases.push(phase),
    syncPrepContentAfterLogin:async()=>{state.prepSyncError=fail?'offline':'';return !fail},hideAllScreensBeforePrep(){},isPortalAdmin:()=>false,
    ensureStudentPrepSelection(){},showPassageScreen(){},showAuthScreen(){},window:{}})
  load(ctx,['openPrepPortal'])
  assert.equal(await ctx.openPrepPortal(),false);assert.deepEqual(phases,['loading','error'])
  fail=false;assert.equal(await ctx.openPrepPortal({forceReload:true}),true)
  assert.deepEqual(phases,['loading','error','loading',''])
}
for(const stale of [false,true]){
  const task=deferred(),state={userSession:1,prepSyncError:'failed'},toasts=[];let screen='portal-screen'
  const ctx=vm.createContext({portalState:state,PREP_SCREEN_IDS:['passage-screen'],getCurrentActiveScreenId:()=>screen,
    syncPrepContentAfterLogin:()=>task.promise,showToast:message=>toasts.push(message),showPortalScreen(){throw Error('Unexpected navigation')}})
  load(ctx,['refreshPortalData'])
  const pending=ctx.refreshPortalData();if(stale)screen='grammar-screen'
  task.resolve(false);assert.equal(await pending,false)
  assert.equal(toasts.length,stale?0:1,'Refresh failures are visible only on the requesting screen')
}
console.log('PREP entry: immediate home/reset routing, atomic bounded loading, parallel reads, retry and stale-result isolation: OK')
