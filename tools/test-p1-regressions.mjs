import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8')
const source = read('rotation_portal_enhancements.js')
const portal = read('rotation_portal.js')
const core = read('rotation_prep_core.js')
const definitions = text => new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(match => [match[1], match[0]]))
const funcs = definitions(source), coreFuncs = definitions(core)
function load(ctx, names, map = funcs){
  for(const name of names){ assert.ok(map.has(name), name); vm.runInContext(map.get(name), ctx) }
}
const plain = value => JSON.parse(JSON.stringify(value))

// The existing allowlist never grants a limited instructor the full-admin profile-write UI.
{
  const state={currentUser:{uid:'synthetic'},currentProfile:{role:'admin',adminScope:'assigned'}}
  const ctx=vm.createContext({portalState:state,PORTAL_GRAMMAR_MANAGER_LOGIN_IDS:['synthetic-manager'],getCurrentGrammarLoginId:()=> 'synthetic-manager',getPortalRole:()=>state.currentProfile.role})
  load(ctx,['normalizeAdminScopeValue','getPortalAdminScope','isPortalAdmin','isPortalSuperAdmin'],definitions(portal))
  load(ctx,['canManageGrammarAccess'])
  assert.equal(ctx.canManageGrammarAccess(),false)
  state.currentProfile.adminScope='all'
  assert.equal(ctx.canManageGrammarAccess(),true)
  state.currentProfile.loginDisabled=true
  assert.equal(ctx.canManageGrammarAccess(),false)
}

// Scope queries are made on the server, chunked at 30 and deduplicated by document ID.
{
  const calls = []
  const profile = { role: 'admin', adminScope: 'assigned', classIds: Array.from({length:31}, (_,i) => 'class-' + i) }
  const ctx = vm.createContext({
    portalState: { currentUser:{uid:'teacher'}, currentProfile:profile, db:{collection:()=>({where:(...args)=>({get:async()=>{calls.push(args);return {docs:[{id:'same'}]}}})})}},
    isPortalSuperAdmin:()=>false, isPortalAdmin:()=>true, getProfileClassIds:()=>profile.classIds
  })
  load(ctx, ['fetchScopedPortalRecordDocs'])
  assert.equal((await ctx.fetchScopedPortalRecordDocs('checkResponses')).length, 1)
  assert.deepEqual(calls.map(call=>call[2].length), [30,1])
  ctx.portalState.currentProfile.loginDisabled = true
  await assert.rejects(ctx.fetchScopedPortalRecordDocs('checkResponses'), /Authentication/)
}

// Both class and UID assignments survive normalization, including duplicates and forged IDs.
{
  const queries = []
  const ctx = vm.createContext({
    portalState:{firebaseEnabled:true,currentUser:{uid:'alice'},currentProfile:{classIds:['a']},db:{collection:()=>{
      const clauses=[]
      return {where(...clause){clauses.push(clause);return this},async get(){queries.push(clauses);return {docs:[{id:'real',data:()=>({docId:'forged',payload:{id:'set',classIds:['a'],assignmentMode:'personal',targetUserIds:['alice','alice']}})}]}}}
    }}},
    isPortalSuperAdmin:()=>false,isPortalAdmin:()=>false,isGrammarOnlyStudent:()=>false,
    getPortalSetCollection:()=> 'portalCheckSets',withPortalReadTimeout:promise=>promise
  })
  load(ctx,['clonePlainData','derivePortalSetClassIds','normalizePortalSetDoc','sortPortalSetDocs','loadCloudSetDocs'])
  const rows = await ctx.loadCloudSetDocs('check')
  assert.equal(rows.length,1)
  assert.equal(rows[0].docId,'real')
  assert.equal(rows[0].assignmentMode,'personal')
  assert.deepEqual(plain(rows[0].targetUserIds),['alice'])
  assert.deepEqual(plain(queries),[[['targetUserIds','array-contains','alice'],['accessSchemaVersion','==',1]],[['classIds','array-contains-any',['a']],['accessSchemaVersion','==',1],['assignmentMode','==','class']]])
  let saved=null
  ctx.readLocalPortalSetDocs=()=>[]
  ctx.portalState.db.collection=()=>({doc:()=>({set:async record=>{saved=plain(record)}})})
  load(ctx,['saveCloudSetDoc'])
  await assert.rejects(ctx.saveCloudSetDoc('check','bad',{classIds:['a','b'],payload:{}}),/반별/)
  await assert.rejects(ctx.saveCloudSetDoc('prep','bad',{classIds:['a'],payload:{classAssignments:[{classId:'b'}]}}),/섞인/)
  await assert.rejects(ctx.saveCloudSetDoc('check','bad',{classIds:['a'],payload:{assignmentMode:'personal',targetStudentNames:['Synthetic only']}}),/Auth UID/)
  assert.equal(saved,null,'Invalid scope never reaches a cloud write')
  await ctx.saveCloudSetDoc('check','good',{classIds:['a'],payload:{id:'good',assignmentMode:'personal',targetUserIds:['alice']}})
  assert.equal(saved.accessSchemaVersion,1)
  assert.deepEqual(saved.targetUserIds,['alice'])
  assert.equal(saved.assignmentMode,'personal')
}

// A previous account's delayed response cannot overwrite the new account's cache or promise.
{
  let resolveOld
  const state = {currentUser:{uid:'alice'},userSession:1,contentMeta:{},checkData:{secret:'old'},checkDataUserId:'alice'}
  const ctx = vm.createContext({portalState:state,console:{error(){}},isGrammarOnlyStudent:()=>false,
    loadPortalCheckDataFromSources:()=>new Promise(resolve=>{resolveOld=resolve})})
  load(ctx,['ensureCheckData','resetPortalUserState'])
  const pending = ctx.ensureCheckData(true)
  ctx.resetPortalUserState()
  state.currentUser = {uid:'bob'}
  const newPromise = Promise.resolve('new')
  state.checkSyncPromise = newPromise
  state.checkSyncUserId = 'bob'
  resolveOld({secret:'alice'})
  await assert.rejects(pending,/user changed/)
  assert.equal(state.checkData,null)
  assert.equal(state.checkSyncPromise,newPromise)
  const keys=[]
  Object.assign(ctx,{getCurrentClass:()=>({id:'a'}),baseProgressKey:'prep',sanitizeId:value=>value,loadProgress(){keys.push(ctx.progressKey)},window:{}})
  load(ctx,['updateSetProgressContext'],coreFuncs)
  state.currentUser={uid:'alice'};ctx.updateSetProgressContext()
  state.currentUser={uid:'bob'};ctx.updateSetProgressContext()
  assert.notEqual(keys[0],keys[1])
}

// Out-of-order Auth profile resolutions cannot restore an old profile or its privileges.
{
  const resolvers=new Map(), state={userSession:0}, routes=[]
  const ctx=vm.createContext({portalState:state,fetchOrCreateUserProfile:user=>new Promise(resolve=>resolvers.set(user.uid,resolve)),routePortalAfterState:()=>routes.push(state.currentUser?.uid)})
  load(ctx,['resetPortalUserState','handleResolvedAuthUser'])
  const first=ctx.handleResolvedAuthUser({uid:'alice'})
  const second=ctx.handleResolvedAuthUser({uid:'bob'})
  resolvers.get('bob')({role:'student',name:'Bob synthetic'})
  await second
  resolvers.get('alice')({role:'admin',name:'Alice synthetic'})
  await first
  assert.equal(state.currentUser.uid,'bob')
  assert.equal(state.currentProfile.role,'student')
  assert.deepEqual(routes,['bob'])
}

// An empty successful server progress result clears local completion for this account.
{
  let saved=0
  const ctx=vm.createContext({portalState:{currentPrepVideoProgressRows:[],currentPrepVideoProgressLoadedUserId:'bob'},getPortalPrepVideoProgressUserId:()=> 'bob',getCurrentClass:()=>({id:'a'}),
    progressKey:'bob-a',progress:{done:{passage:true}},studySets:[{classAssignments:[{classId:'a',passageIndexes:[0]}],passages:[{id:'p'}]}],
    normalizePortalPrepProgressIndex:Number,getPortalPrepProgressSetId:()=> 'set',getPortalPrepProgressPassageId:()=> 'p',findPortalPrepVideoProgressRow:()=>null,
    getPassageProgressStorageKey:()=> 'passage',saveProgress:()=>{saved++}})
  load(ctx,['applyPortalPrepVideoProgressRowsToCurrentPrepClass'])
  assert.equal(ctx.applyPortalPrepVideoProgressRowsToCurrentPrepClass(),true)
  assert.equal(ctx.progress.done.passage,undefined)
  assert.equal(saved,1)
}

// Use actual transaction merge logic with a deterministic retry against the newest document.
{
  let stored = null, failRead = false, writes = 0, retry = null
  const state = {firebaseEnabled:true,currentUser:{uid:'alice'},currentProfile:{},userSession:1}
  const snapshot = () => ({exists:!!stored,data:()=>structuredClone(stored)})
  state.db = {collection:()=>({doc:()=>({get:async()=>{if(failRead)throw Error('offline');return snapshot()}})}),
    runTransaction:async callback=>{
      let pending
      const tx={get:async()=>{if(failRead)throw Error('offline');return snapshot()},set:(ref,data)=>{pending=plain(data)}}
      let result=await callback(tx)
      if(retry){stored=retry;retry=null;pending=null;result=await callback(tx)}
      stored=pending;writes++;return result
    }}
  const ctx=vm.createContext({portalState:state,getProfileClassIds:()=>['a'],buildCheckResponseId:()=> 'alice__set',
    sortCheckSubmissionAnswers:rows=>rows.sort((a,b)=>a.questionId.localeCompare(b.questionId)),buildCheckSubmissionSummary:rows=>({total:rows.length}),
    Date,Map,Set})
  load(ctx,['saveCheckSubmission','mergeCheckSubmission','mapResponseToSubmission','getCheckAnswerEditCount','canCheckAnswerBeEdited','loadExistingCheckSubmission'])
  const set={id:'set',title:'synthetic'}, q=(id,value)=>({questionId:id,userAnswer:value,revisionCount:0,isCorrect:false})
  const save=(answers,base=null)=>ctx.saveCheckSubmission(set,ctx.mergeCheckSubmission(base,answers),{answers,base})
  await save([q('q1','A')])
  // Another client submits a different answer while this client's snapshot was still empty.
  await save([q('q2','B')])
  assert.deepEqual(stored.answers.map(row=>row.questionId),['q1','q2'])
  const base=plain(stored)
  const edited=q('q1','C');edited.revisionCount=1
  await save([edited],base)
  await assert.rejects(save([q('q1','D')],base),/changed|limit/)
  await assert.rejects(save([q('q1','D')],plain(stored)),/limit/)
  // A retry on a concurrent unrelated write preserves both answers and latest note metadata.
  retry=plain(stored);retry.answers.push(q('q3','E'))
  await ctx.saveCheckSubmission(set,{}, {wrongNote:{questionId:'q2',completed:true,completedAt:'now'}})
  assert.equal(stored.answers.length,3)
  assert.equal(stored.answers.find(row=>row.questionId==='q2').wrongNoteCompleted,true)
  const before=writes
  failRead=true
  await assert.rejects(ctx.loadExistingCheckSubmission(set),/offline/)
  await assert.rejects(save([q('q4','F')]),/offline/)
  assert.equal(writes,before)
}

// A failed cloud write must not produce a local success or discard the caller's form state.
{
  let localWrites=0, successToasts=0
  const ctx=vm.createContext({
    portalState:{firebaseEnabled:true,currentUser:{uid:'alice'},currentProfile:{},currentCheckSet:{id:'set',questions:[{id:'q1'}]},currentCheckSubmission:{answers:[{questionId:'q1',userAnswer:'A'}]},currentQuestionIssues:[],db:{collection:()=>({doc:()=>({set:async()=>{throw Error('offline')}})})}},
    getProfileClassIds:()=>['a'],simpleHash:()=> 'synthetic',normalizeCheckQuestionNumber:()=>1,normalizeCheckProblemType:()=> '',
    writeLocalQuestionIssues:()=>{localWrites++},readLocalQuestionIssues:()=>[],showToast:(text,color)=>{if(color==='var(--green)')successToasts++}
  })
  load(ctx,['submitCheckQuestionIssueImpl','updateQuestionIssueRecord'])
  await assert.rejects(ctx.submitCheckQuestionIssueImpl('q1'),/전송하지/)
  await assert.rejects(ctx.updateQuestionIssueRecord('issue',{status:'canceled'}),/저장하지/)
  assert.equal(localWrites,0)
  assert.equal(successToasts,0)
  assert.equal(ctx.portalState.currentCheckSubmission.answers[0].userAnswer,'A')
}

// Request, new slot and old slot move together, including retries, conflicts and failed commits.
{
  const records=new Map(), pendingWrites=[]
  let failCommit=false, localWrites=0
  const db={collection:collection=>({doc:id=>({key:collection+'/'+id})}),runTransaction:async callback=>{
    const writes=[]
    const tx={get:async ref=>{assert.equal(writes.length,0,'All transaction reads must precede writes');const data=records.get(ref.key);return {exists:!!data,data:()=>structuredClone(data)}},set:(ref,data,options)=>writes.push({ref,data:plain(data),merge:options?.merge})}
    const result=await callback(tx)
    if(failCommit)throw Error('offline')
    for(const {ref,data,merge} of writes)records.set(ref.key,merge?{...records.get(ref.key),...data}:data)
    pendingWrites.push(writes.length)
    return result
  }}
  const ctx=vm.createContext({portalState:{firebaseEnabled:true,db,currentUser:{uid:'alice'},userSession:1},PORTAL_COUNSEL_REQUEST_COLLECTION:'requests',PORTAL_COUNSEL_SLOT_COLLECTION:'slots',
    isCounselRequestOpen:row=>row.status==='open',getCounselSlotStartMs:()=>0,getCounselSlotEndMs:()=>60000,
    readLocalCounselRequests:()=>[],writeLocalCounselRequests:()=>{localWrites++},Date})
  load(ctx,['buildCounselSlotRecord','saveCloudCounselRequest','updateCounselRequestRecord'])
  const payload={userId:'alice',classIds:['a'],slotId:'first',requestedAt:'synthetic',createdAt:'initial',updatedAt:'now',status:'open'}
  failCommit=true
  await assert.rejects(ctx.saveCloudCounselRequest('alice__request',payload),/offline/)
  assert.equal(records.size,0,'A failed request must not leave a reserved slot')
  failCommit=false
  await ctx.saveCloudCounselRequest('alice__request',payload)
  await ctx.saveCloudCounselRequest('alice__request',payload)
  assert.equal(records.size,2,'Retry keeps a single request and slot')
  failCommit=true
  await assert.rejects(ctx.saveCloudCounselRequest('alice__request',{...payload,slotId:'second'}),/offline/)
  assert.equal(records.get('slots/first').status,'open')
  assert.equal(records.has('slots/second'),false)
  failCommit=false
  await ctx.saveCloudCounselRequest('alice__request',{...payload,slotId:'second'})
  assert.equal(records.get('slots/first').status,'canceled')
  assert.equal(records.get('requests/alice__request').slotId,'second')
  records.set('slots/occupied',{requestId:'bob__request',userId:'bob',status:'open'})
  await assert.rejects(ctx.saveCloudCounselRequest('alice__request',{...payload,slotId:'occupied'}),/conflict/)
  assert.equal(records.get('slots/second').status,'open')
  failCommit=true
  assert.equal(await ctx.updateCounselRequestRecord('alice__request',{status:'canceled',updatedAt:'later'}),false)
  assert.equal(records.get('requests/alice__request').status,'open')
  failCommit=false
  assert.equal(await ctx.updateCounselRequestRecord('alice__request',{status:'canceled',updatedAt:'later'}),true)
  assert.equal(records.get('slots/second').status,'canceled')
  assert.equal(localWrites,0)
  assert.ok(pendingWrites.includes(3),'Moving a slot commits all three documents')
}

// The old destructive entry point cannot even read a database or prompt for confirmation.
{
  let touched=0
  const ctx=vm.createContext({portalState:new Proxy({}, {get(){touched++;throw Error('Forbidden access')}}),window:{confirm(){touched++;}}})
  load(ctx,['resetSuperAdminExamCycle'])
  await assert.rejects(ctx.resetSuperAdminExamCycle(),/비활성화/)
  assert.equal(touched,0)
  assert.match(read('index.html'),/id="superadmin-reset-cycle-btn" disabled/)
}

console.log('P1 regressions: scopes, assignments, account isolation, CHECK merge, cloud errors, atomic counseling and disabled reset: OK')
