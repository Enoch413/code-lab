import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8')
const sources=['rotation_portal.js','rotation_portal_enhancements.js'].map(read)
const defs=new Map(sources.flatMap(text=>[...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(match=>[match[1],match[0]])))
const plain=value=>JSON.parse(JSON.stringify(value))
const classes=[{id:'a',name:'A반'},{id:'b',name:'B반'},{id:'x',name:'다른 반'}]
const load=(ctx,names)=>names.forEach(name=>{if(defs.has(name))vm.runInContext(defs.get(name),ctx)})
const base=()=>{
  const screens=new Map(['check-screen','portal-screen','class-screen'].map(id=>[id,{id}]))
  const calls=[],state={currentUser:{uid:'teacher'},currentProfile:{role:'admin',adminScope:'assigned',classIds:['a','b']},firebaseEnabled:true,userSession:1,checkData:{classes,checkSets:[]}}
  const ctx=vm.createContext({portalState:state,prepClasses:[],currentClassIndex:9,window:{},document:{querySelector:()=>screens.get(ctx.screen)},getProfileClassNames:()=>['A반'],
    renderCheckScreen:()=>calls.push('render-check'),activatePortalScreen:id=>{ctx.screen=id;calls.push(id)},getCurrentActiveScreenId:()=>ctx.screen,
    renderClassList:()=>calls.push('render-classes'),ensureCheckData:async()=>state.checkData,showCheckLoadError:()=>calls.push('error'),
    showToast(){},screen:'check-screen',selectClass(){throw Error('CHECK must not select a PREP class')},showClassScreen(){throw Error('CHECK must not require a PREP bundle')}})
  load(ctx,['getProfileClassIds','getPortalRole','normalizeAdminScopeValue','getPortalAdminScope','isPortalAdmin','isPortalSuperAdmin','getVisiblePortalPrepClassEntries','getVisiblePortalCheckClassEntries','getActivePortalCheckClass','getActivePortalCheckClassIds','ensurePortalCheckSelection','openCheckClassPicker','selectPortalCheckClass'])
  return {ctx,state,calls}
}
let checks=0
{
  const {ctx,state,calls}=base()
  assert.equal(ctx.getActivePortalCheckClass()?.classInfo.id,'a','Cold CHECK must select a permitted class without PREP data')
  assert.deepEqual(plain(ctx.getVisiblePortalCheckClassEntries().map(row=>row.classInfo.id)),['a','b'])
  await ctx.openCheckClassPicker();assert.equal(ctx.screen,'class-screen');assert.ok(calls.includes('render-classes'))
  assert.equal(ctx.selectPortalCheckClass(1),true);assert.equal(state.checkClassId,'b');assert.equal(ctx.screen,'check-screen')
  assert.equal(ctx.currentClassIndex,9);assert.deepEqual(plain(ctx.prepClasses),[]);assert.deepEqual(plain(ctx.getActivePortalCheckClassIds()),['b']);checks++
  state.classSelectionReturnScreen='check-screen'
  for(const index of [-1,2,1.5,NaN,'1'])assert.equal(ctx.selectPortalCheckClass(index),false)
  assert.equal(state.checkClassId,'b');state.currentProfile.classIds=['a'];assert.equal(ctx.selectPortalCheckClass(1),false);assert.equal(ctx.getActivePortalCheckClass().classInfo.id,'a');checks++
  state.currentProfile={role:'student',classIds:['a','b']};assert.equal(ctx.selectPortalCheckClass(0),false);assert.equal(await ctx.openCheckClassPicker(),false);checks++
  state.currentProfile={role:'admin',adminScope:'assigned',classIds:[]};assert.equal(ctx.getVisiblePortalCheckClassEntries().length,0)
  state.currentProfile={role:'admin',adminScope:'all',classIds:[]};assert.equal(ctx.getVisiblePortalCheckClassEntries().length,3)
  state.currentProfile.loginDisabled=true;assert.equal(ctx.getVisiblePortalCheckClassEntries().length,0);checks++
  state.currentProfile={role:'admin',adminScope:'assigned',classIds:['a','b']};state.checkClassId='b';state.checkData.classes=[classes[1],classes[0]]
  assert.equal(ctx.getActivePortalCheckClass().classInfo.id,'b','Selection survives reordered metadata by class ID');checks++
}
for(const action of ['logout','account-change','navigation','failure']){
  const {ctx,state,calls}=base();let resolve,reject
  ctx.ensureCheckData=()=>new Promise((yes,no)=>{resolve=yes;reject=no})
  const pending=ctx.openCheckClassPicker()
  if(action==='logout'){state.userSession++;state.currentUser=null}
  if(action==='account-change'){state.userSession++;state.currentUser={uid:'another'}}
  if(action==='navigation')ctx.screen='portal-screen'
  if(action==='failure')reject(Error('offline'));else resolve(state.checkData)
  await pending;assert.ok(!calls.includes('class-screen'));checks++
}
{
  const ctx=vm.createContext({portalState:{currentUser:{uid:'teacher'},userSession:1,currentProfile:{classIds:['b']},checkData:null,checkSetInventory:[],firebaseEnabled:true,contentMeta:{}},
    prepClasses:[],PORTAL_CLASS_CATALOG_DOC:'prep-classes',PORTAL_CLOUD_DOCS:{check:'check'},PORTAL_CLASS_REFERENCE:classes,
    sanitizeId:value=>String(value),getProfileClassIds:()=>ctx.portalState.currentProfile.classIds,isPortalSuperAdmin:()=>false,
    loadCloudContentDoc:async()=>null,loadCloudSetDocs:async()=>[],buildPortalCheckSetInventory:()=>[],getLatestPortalTimestamp:()=>'',
    normalizeCheckData:value=>value,normalizeStoredCheckSet:()=>null})
  load(ctx,['normalizePortalCheckClassList','mergePortalCheckClasses','loadPortalCheckDataFromSources'])
  assert.deepEqual(plain((await ctx.loadPortalCheckDataFromSources()).classes),[classes[1]],'Assigned classes must load even when no CHECK/PREP material exists');checks++
  ctx.isPortalSuperAdmin=()=>true;ctx.loadCloudContentDoc=async id=>id==='prep-classes'?{payload:{classes:[{id:'custom',name:'새 반',password:'synthetic-not-exported'}]}}:null
  assert.deepEqual(plain((await ctx.loadPortalCheckDataFromSources()).classes),[{id:'custom',name:'새 반'},classes[1]],'Full admin catalog and own classes are preserved without class passwords');checks++
  ctx.isPortalSuperAdmin=()=>false;const resolvers=[]
  ctx.loadCloudContentDoc=()=>new Promise(yes=>{resolvers.push(yes)});ctx.loadCloudSetDocs=async()=>[]
  const pending=ctx.loadPortalCheckDataFromSources();ctx.portalState.userSession++
  resolvers.forEach(resolve=>resolve(null))
  await assert.rejects(pending,/CHECK user changed/);checks++
  const cached={classes:[classes[1]],checkSets:[]};ctx.portalState.checkData=cached;ctx.portalState.checkDataUserId='teacher'
  ctx.isGrammarOnlyStudent=()=>false;ctx.loadCloudContentDoc=async()=>{throw Error('catalog offline')}
  load(ctx,['ensureCheckData']);await assert.rejects(ctx.ensureCheckData(true),/catalog offline/)
  assert.equal(ctx.portalState.checkData,cached);assert.equal(ctx.portalState.checkSyncPromise,null)
  ctx.loadCloudContentDoc=async()=>null
  assert.deepEqual(plain((await ctx.ensureCheckData(true)).classes),[classes[1]],'Catalog failure preserves the previous CHECK data and supports retry');checks++
}
{
  const {ctx,state}=base();ctx.PREP_SCREEN_IDS=['class-screen'];ctx.window.capturePrepNavigationState=()=>{throw Error('CHECK history must not capture PREP')}
  ctx.ensurePortalScreenAccess=()=>true;ctx.openPrepPortal=()=>{throw Error('CHECK history must not load PREP')};ctx.bundleData=null
  load(ctx,['isCheckClassSelectionContext','captureAppRoute','restoreAppRoute'])
  state.classSelectionReturnScreen='check-screen';const route=ctx.captureAppRoute('class-screen');assert.equal(route.checkClassPicker,true)
  state.classSelectionReturnScreen='';await ctx.restoreAppRoute(route);assert.equal(ctx.screen,'class-screen');checks++
}
console.log(`CHECK classes: ${checks} scope, picker, PREP isolation, metadata, history and stale-result regressions passed; no production access.`)
