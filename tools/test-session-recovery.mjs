import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8')
const definitions=text=>new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const enh=definitions(read('rotation_portal_enhancements.js')),portal=definitions(read('rotation_portal.js')),core=definitions(read('rotation_prep_core.js'))
const load=(ctx,names,map=enh)=>names.forEach(name=>{assert.ok(map.has(name),name);vm.runInContext(map.get(name),ctx)})
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject}}
const flush=async()=>{for(let i=0;i<30;i++)await Promise.resolve()}
const groups={
  async authFeedback(){
    const disabled='현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.'
    const failed='로그인 정보를 불러오지 못했습니다.'
    const setup=()=>{
      let callback;const state={userSession:0},error={textContent:''}
      const auth={currentUser:null,onAuthStateChanged:fn=>{callback=fn},signOut:async()=>{}}
      const ctx=vm.createContext({portalState:state,window:{ROTATION_FIREBASE_CONFIG:{}},firebase:{apps:[{}],auth:()=>auth,firestore:()=>({})},
        document:{getElementById:id=>id==='auth-error'?error:null},bundleData:null,syncAuthClassOptions(){},activatePortalScreen(){},setAuthMeta(){},console:{error(){}},
        updatePortalUserCard(){},syncPrepContentAfterLogin:async()=>{},isPasswordResetRequired:()=>false,showPortalScreen(){},
        toPortalLoginEmail:value=>value,fetchOrCreateUserProfile:async user=>({uid:user.uid,role:'student'})})
      // Use the real observer -> router -> auth screen -> error output chain, without reset's unrelated DOM cleanup.
      ctx.resetPortalUserState=()=>{state.userSession++}
      load(ctx,['handleResolvedAuthUser','loginPortalUser','routePortalAfterState','showAuthScreen','signOutDisabledPortalUser'])
      load(ctx,['initFirebasePortal','setAuthError','clearAuthError'],portal)
      ctx.initFirebasePortal()
      return {ctx,state,auth,error,notify:user=>{auth.currentUser=user;callback(user)}}
    }
    {
      const {ctx,state,error,notify}=setup()
      ctx.fetchOrCreateUserProfile=async()=>{throw Error('synthetic read failure')}
      notify({uid:'alice'});await flush()
      assert.equal(state.currentUser,null)
      assert.equal(error.textContent,failed,'The current profile failure must survive auth-screen routing')
      notify(null);await flush();assert.equal(error.textContent,failed,'A following signed-out notification keeps the current explanation')
      ctx.fetchOrCreateUserProfile=async user=>({uid:user.uid,role:'student'})
      notify({uid:'alice'});await flush();assert.equal(error.textContent,'','Successful same-UID retry clears the previous failure')
    }
    for(const entry of ['observer','direct'])for(const order of ['before','after'])for(const rejected of [false,true]){
      const {ctx,state,auth,error,notify}=setup(),task=deferred(),user={uid:'alice'}
      auth.signOut=()=>task.promise;auth.signInWithEmailAndPassword=async()=>({user});auth.currentUser=user
      ctx.fetchOrCreateUserProfile=async()=>({loginDisabled:true})
      const pending=entry==='observer'?ctx.handleResolvedAuthUser(user):ctx.loginPortalUser('synthetic','synthetic')
      await flush()
      if(order==='before'){notify(null);await flush()}
      if(rejected)task.reject(Error('synthetic sign-out failure'));else task.resolve()
      await pending
      if(order==='after'){notify(null);await flush()}
      assert.equal(state.currentUser,null)
      assert.equal(error.textContent,disabled,entry+'/'+order+'/'+rejected+': disabled notice survives sign-out timing and failure')
    }
    // An old disabled sign-out must not overwrite either a newer account or its failure, even if the new state is null.
    for(const entry of ['observer','direct'])for(const next of ['success','same-user','failure','new-attempt'])for(const rejected of [false,true]){
      const {ctx,state,auth,error,notify}=setup(),task=deferred(),user={uid:'alice'}
      auth.signOut=()=>task.promise;auth.signInWithEmailAndPassword=async()=>({user});auth.currentUser=user
      ctx.fetchOrCreateUserProfile=async()=>({loginDisabled:true})
      const pending=entry==='observer'?ctx.handleResolvedAuthUser(user):ctx.loginPortalUser('synthetic','synthetic')
      await flush()
      if(next==='new-attempt'){
        ctx.clearAuthError();ctx.setAuthError('new attempt error')
      }else{
        ctx.fetchOrCreateUserProfile=async()=>{if(next==='failure')throw Error('new read failure');return {role:'student'}}
        notify({uid:next==='same-user'?'alice':'bob'});await flush()
      }
      const before=error.textContent,current=state.currentUser
      if(rejected)task.reject(Error('old sign-out failure'));else task.resolve()
      await pending;await flush()
      assert.equal(state.currentUser,current)
      assert.equal(error.textContent,before,entry+'/'+next+': an old completion must preserve current feedback')
    }
    {
      const {ctx,state,auth,error,notify}=setup()
      ctx.fetchOrCreateUserProfile=async()=>{throw Error('current failure')}
      notify({uid:'alice'});await flush();assert.equal(error.textContent,failed)
      const fields={'auth-email':{id:'auth-email',value:'synthetic'},'auth-password':{id:'auth-password',value:'synthetic-only'}}
      const output=ctx.document.getElementById
      ctx.document.getElementById=id=>fields[id]||output(id)
      for(const field of Object.values(fields))field.removeAttribute=()=>{}
      ctx.setAuthLoading=()=>{};ctx.clearAuthFields=()=>{};ctx.getPortalErrorMessage=e=>e.message;ctx.getAuthErrorField=()=>null
      load(ctx,['submitAuthForm','logoutPortal'],portal)
      const task=deferred();auth.signInWithEmailAndPassword=()=>task.promise
      const retry=ctx.submitAuthForm();assert.equal(error.textContent,'');assert.equal(state.authSessionError,'')
      task.reject(Error('new attempt failed'));await retry;assert.equal(error.textContent,'new attempt failed')
      state.authSessionError=failed;ctx.setAuthError(failed)
      await ctx.logoutPortal();notify(null);await flush()
      assert.equal(error.textContent,'','Explicit logout clears a previous explanation')
    }
  },
  async authFormOrder(){
    for(const rejected of [false,true]){
      const tasks=[deferred(),deferred()],fields={'auth-email':{value:'synthetic'},'auth-password':{value:'synthetic-only'}}
      let count=0,loading=false,cleared=0;const errors=[]
      const ctx=vm.createContext({portalState:{},document:{getElementById:id=>fields[id]},clearAuthError(){},setAuthLoading:value=>{loading=value},
        loginPortalUser:()=>tasks[count++].promise,clearAuthFields:()=>{cleared++},getPortalErrorMessage:error=>error.message,getAuthErrorField:()=>null,setAuthError:text=>errors.push(text)})
      load(ctx,['submitAuthForm'],portal)
      const first=ctx.submitAuthForm(),second=ctx.submitAuthForm()
      if(rejected)tasks[0].reject(Error('old error'));else tasks[0].resolve()
      await first
      assert.equal(loading,true,'An old form must not release a newer login spinner')
      assert.equal(cleared,0);assert.equal(errors.length,0)
      tasks[1].resolve();await second
      assert.equal(loading,false);assert.equal(cleared,1)
    }
  },
  async checkSaveSession(){
    for(const name of ['submitCurrentCheckSet','submitSingleCheckAnswerEditImpl','completeCheckWrongNoteImpl']){
      for(const next of ['set','account','same'])for(const rejected of [false,true]){
        const task=deferred(),old={id:'old'},newSet={id:'new'},answer={questionId:'q',isCorrect:false,userAnswer:'A'}
        const state={userSession:1,currentCheckSet:old,currentCheckSubmission:{answers:[answer]},currentCheckDraftAnswers:{q:'B'}},effects=[]
        const ctx=vm.createContext({portalState:state,collectCheckBatchAnswers:()=>[answer],mergeCheckSubmission:()=>({answers:[answer]}),saveCheckSubmission:()=>task.promise,
          buildInitialCheckDraftAnswers:()=>({}),fetchMyQuestionIssues:async()=>[],isCheckAnswerEditing:()=>true,setCurrentCheckDraftAnswer(){},setCheckAnswerEditing(){},
          isCheckWrongNoteCompleted:()=>false,sortCheckSubmissionAnswers:rows=>rows,getLatestBatchQuestionIds:()=>[],buildCheckSubmissionSummary:()=>({}),
          buildCheckSubmitToastMessage:()=> 'done',renderCheckForm:()=>effects.push('render'),showToast:()=>effects.push('toast'),console:{error(){}}})
        load(ctx,[name,'resetPortalUserState'])
        const pending=ctx[name]('q')
        if(next==='account'){ctx.resetPortalUserState();state.isSubmittingCheck=true}
        const current=next==='same'?state.currentCheckSubmission:{answers:['new']},saved={answers:['old']}
        if(next!=='same'){state.currentCheckSet=newSet;state.currentCheckSubmission=current}
        if(rejected)task.reject(Error('old write failed'));else task.resolve(saved)
        await pending
        if(next==='same'){
          assert.equal(state.currentCheckSubmission,rejected?current:saved)
          assert.deepEqual(effects,rejected?['toast']:['render','toast'],'Current saves retain success/failure feedback')
          continue
        }
        assert.equal(state.currentCheckSubmission,current,name+': old save must not replace the next set or user')
        assert.equal(effects.length,0,name+': stale save must not repaint or notify')
        if(next==='account')assert.equal(state.isSubmittingCheck,true,'An old finally must not release the new account lock')
      }
    }
  },
  async checkEntry(){
    const oldSet={id:'old',isAccessible:true},next={id:'next',isAccessible:true},other={id:'other',isAccessible:true}
    let failure='submission',pending=null,screen='check-screen';const renders=[],toasts=[]
    const state={userSession:1,currentCheckSet:oldSet,currentCheckSubmission:{answers:['old']},currentCheckDraftAnswers:{old:'draft'}}
    const ctx=vm.createContext({portalState:state,ensurePortalScreenAccess:()=>true,getCurrentActiveScreenId:()=>screen,getVisibleCheckSets:()=>[next,other],isPortalAdmin:()=>false,
      loadExistingCheckSubmission:async set=>{if(pending)return pending.promise;if(failure==='submission')throw Error('offline');return {set:set.id,answers:[]}},
      fetchMyQuestionIssues:async()=>{if(failure==='issues')throw Error('offline');return []},buildInitialCheckDraftAnswers:set=>({[set.id]:'new'}),
      countPendingCheckQuestions:()=>1,renderCurrentCheckSet:()=>renders.push(state.currentCheckSet.id),activatePortalScreen(){},syncAppHistoryState(){},showToast:text=>toasts.push(text),console:{error(){}}})
    load(ctx,['openCheckSetPortal','resetPortalUserState'])
    const originalSubmission=state.currentCheckSubmission,originalDrafts=state.currentCheckDraftAnswers
    for(const point of ['submission','issues']){
      failure=point;assert.equal(await ctx.openCheckSetPortal('next'),false)
      assert.equal(state.currentCheckSet,oldSet);assert.equal(state.currentCheckSubmission,originalSubmission);assert.equal(state.currentCheckDraftAnswers,originalDrafts)
      assert.equal(renders.length,0)
    }
    assert.ok(toasts.some(text=>text.includes('다시')),'A failed entry explains how to retry')
    failure=null;assert.equal(await ctx.openCheckSetPortal('next'),true)
    assert.equal(state.currentCheckSet.id,'next');assert.equal(state.currentCheckSubmission.set,'next');assert.equal(state.currentCheckDraftAnswers.next,'new')
    pending=deferred();const first=ctx.openCheckSetPortal('next'),old=pending;pending=deferred()
    const second=ctx.openCheckSetPortal('other');pending.resolve({set:'other',answers:[]});await second
    old.resolve({set:'next',answers:[]});assert.equal(await first,false)
    assert.equal(state.currentCheckSet.id,'other');assert.equal(state.currentCheckSubmission.set,'other')
    pending=deferred();const navigated=ctx.openCheckSetPortal('next');screen='account-screen'
    pending.resolve({set:'next',answers:[]});assert.equal(await navigated,false);assert.equal(state.currentCheckSet.id,'other')
    screen='check-screen'
    pending=deferred();const logout=ctx.openCheckSetPortal('next');ctx.resetPortalUserState()
    pending.resolve({set:'next',answers:[]});assert.equal(await logout,false);assert.equal(state.currentCheckSet,null)
  },
  async specificQueries(){
    for(const role of ['full','teacher','student']){
      const calls=[],state={currentUser:{uid:'alice'},currentProfile:{role:role==='student'?'student':'admin'},firebaseEnabled:true,userSession:1}
      const query=(collection,clauses=[])=>({where:(...clause)=>query(collection,[...clauses,clause]),get:async()=>{calls.push({collection,clauses});return {docs:[]}}})
      state.db={collection:name=>query(name)}
      const ctx=vm.createContext({portalState:state,isPortalSuperAdmin:()=>role==='full',isPortalAdmin:()=>role!=='student',getProfileClassIds:()=>Array.from({length:31},(_,i)=>'class-'+i),
        normalizeGrammarVideoProgressRecord:row=>row,normalizePortalPrepVideoProgressRecord:row=>row,PORTAL_GRAMMAR_VIDEO_PROGRESS_COLLECTION:'grammar',PORTAL_PREP_VIDEO_PROGRESS_COLLECTION:'prep'})
      load(ctx,['fetchScopedPortalRecordDocs','fetchGrammarVideoProgressRows','fetchPortalPrepVideoProgressRows','fetchCheckResponsesForSet'])
      await ctx.fetchGrammarVideoProgressRows({userId:'alice'});await ctx.fetchPortalPrepVideoProgressRows({setId:'prep-set'});await ctx.fetchCheckResponsesForSet('check-set')
      assert.equal(calls.length,role==='teacher'?6:3)
      for(const call of calls){
        const field=call.collection==='grammar'?'userId':call.collection==='prep'?'setId':'checkSetId'
        const value=field==='userId'?'alice':field==='setId'?'prep-set':'check-set'
        assert.ok(call.clauses.some(clause=>clause[0]===field&&clause[1]==='=='&&clause[2]===value),role+': server equality filter missing')
        if(role==='teacher')assert.ok(call.clauses.some(clause=>clause[0]==='classIds'&&clause[2].length<=30))
        if(role==='student')assert.equal(call.clauses.filter(clause=>clause[0]==='userId'&&clause[2]==='alice').length,1)
      }
      const before=calls.length
      if(role==='student'){assert.equal((await ctx.fetchGrammarVideoProgressRows({userId:'bob'})).length,0);assert.equal(calls.length,before)}
      await ctx.fetchScopedPortalRecordDocs('aggregate')
      if(role==='full')assert.equal(calls.at(-1).clauses.length,0,'Full aggregate queries stay unfiltered')
    }
  },
  async serverProgress(){
    for(const metadata of [{fromCache:true},{hasPendingWrites:true}]){
      const state={firebaseEnabled:true,currentUser:{uid:'alice'},userSession:1,currentPrepVideoProgressRows:[]},options=[]
      let snapshot={metadata,docs:[]},failure=null
      state.db={collection:()=>({where:()=>({get:async option=>{options.push(option);if(failure)throw failure;return snapshot}})})}
      const ctx=vm.createContext({portalState:state,PORTAL_PREP_VIDEO_PROGRESS_COLLECTION:'progress',isPortalAdmin:()=>false,
        getPortalPrepVideoProgressUserId:()=> 'alice',normalizePortalPrepVideoProgressRecord:value=>value,
        progressKey:'alice-a',progress:{done:{passage:true}},getCurrentClass:()=>({id:'a'}),
        studySets:[{classAssignments:[{classId:'a',passageIndexes:[0]}],passages:[{id:'p'}]}],
        normalizePortalPrepProgressIndex:Number,getPortalPrepProgressSetId:()=> 'set',getPortalPrepProgressPassageId:()=> 'p',
        findPortalPrepVideoProgressRow:rows=>rows[0]||null,getPassageProgressStorageKey:()=> 'passage',saveProgress(){},refreshVisiblePortalPrepProgressAfterHydration(){}})
      load(ctx,['fetchCurrentPortalPrepVideoProgressRows','refreshPortalPrepVideoProgressForCurrentUser','applyPortalPrepVideoProgressRowsToCurrentPrepClass'])
      await assert.rejects(ctx.refreshPortalPrepVideoProgressForCurrentUser(),/server|confirmed/i)
      assert.equal(ctx.progress.done.passage,true,'Unconfirmed snapshots preserve completion')
      assert.equal(state.currentPrepVideoProgressLoadedUserId,'')
      assert.equal(options[0].source,'server')
      failure=Error('synthetic offline')
      await assert.rejects(ctx.refreshPortalPrepVideoProgressForCurrentUser(),/offline/)
      assert.equal(ctx.progress.done.passage,true)
      failure=null;snapshot={metadata:{fromCache:false,hasPendingWrites:false},docs:[]}
      await ctx.refreshPortalPrepVideoProgressForCurrentUser()
      assert.equal(ctx.progress.done.passage,undefined,'A confirmed server empty result clears stale completion')
      snapshot={metadata:{fromCache:false,hasPendingWrites:false},docs:[{id:'real',data:()=>({userId:'alice',done:true})}]}
      await ctx.refreshPortalPrepVideoProgressForCurrentUser()
      assert.equal(ctx.progress.done.passage,true,'Server completion is restored')
    }
  },
  async credentials(){
    for(const rejected of [false,true]){
      const task=deferred(),auth={currentUser:{uid:'alice'},signInWithEmailAndPassword:async()=>({user:{uid:'alice'}})},state={firebaseEnabled:true,userSession:1,auth}
      let routes=0
      const ctx=vm.createContext({portalState:state,toPortalLoginEmail:value=>value,fetchOrCreateUserProfile:user=>user.uid==='alice'?task.promise:Promise.resolve({uid:user.uid}),routePortalAfterState:()=>{routes++}})
      load(ctx,['loginPortalUser','handleResolvedAuthUser','resetPortalUserState'])
      const pending=ctx.loginPortalUser('alice','synthetic');await flush()
      auth.currentUser={uid:'bob'}
      if(rejected)task.reject(Error('old profile failed'));else task.resolve({uid:'alice'})
      assert.equal(await pending,false,'A profile result must match the SDK user before the next observer notification')
      assert.equal(state.currentProfile,null);assert.equal(routes,0)
      await ctx.handleResolvedAuthUser(auth.currentUser)
      assert.equal(state.currentUser.uid,'bob');assert.equal(state.currentProfile.uid,'bob')
    }
    for(const next of ['bob',null])for(const rejected of [false,true]){
      const task=deferred(),auth={currentUser:null,signInWithEmailAndPassword:()=>task.promise}
      const state={firebaseEnabled:true,userSession:1,auth},routes=[]
      const ctx=vm.createContext({portalState:state,toPortalLoginEmail:value=>value,fetchOrCreateUserProfile:async user=>({uid:user.uid,role:'student'}),routePortalAfterState:()=>routes.push(state.currentUser?.uid||null)})
      load(ctx,['loginPortalUser','handleResolvedAuthUser','resetPortalUserState'])
      const pending=ctx.loginPortalUser('alice','synthetic')
      auth.currentUser=next?{uid:next}:null;await ctx.handleResolvedAuthUser(auth.currentUser)
      state.prepVideoDrafts={synthetic:{title:'new draft'}}
      const session=state.userSession,before=routes.length
      if(rejected)task.reject(Error('old credential failed'));else task.resolve({user:{uid:'alice'}})
      assert.equal(await pending,false,'Stale credentials report no completed form submission')
      assert.equal(state.currentUser?.uid||null,next)
      assert.equal(state.userSession,session);assert.equal(routes.length,before)
      assert.equal(state.prepVideoDrafts.synthetic.title,'new draft')
    }
    // Normal observer-before/after-credential order must still log in, including one UID.
    for(const order of ['before','after','pending','same-uid']){
      const task=deferred(),profile=deferred(),auth={currentUser:null,signInWithEmailAndPassword:()=>task.promise}
      const state={firebaseEnabled:true,userSession:1,auth},routes=[]
      const ctx=vm.createContext({portalState:state,toPortalLoginEmail:value=>value,fetchOrCreateUserProfile:async user=>order==='pending'?profile.promise:{uid:user.uid,role:'student'},routePortalAfterState:()=>routes.push(state.currentUser?.uid||null)})
      load(ctx,['loginPortalUser','handleResolvedAuthUser','resetPortalUserState'])
      const first=ctx.loginPortalUser('alice','synthetic');auth.currentUser={uid:'alice'}
      let observed
      if(order!=='after'){
        observed=ctx.handleResolvedAuthUser(auth.currentUser)
        if(order!=='pending')await observed
      }
      if(order==='same-uid'){
        const current=ctx.loginPortalUser('alice','synthetic')
        state.prepVideoDrafts={synthetic:{title:'new draft'}}
        task.resolve({user:auth.currentUser});await current
        assert.equal(await first,false)
        assert.equal(state.prepVideoDrafts.synthetic.title,'new draft')
      }else{
        task.resolve({user:auth.currentUser});await flush()
        if(order==='pending')profile.resolve({uid:'alice',role:'student'})
        await first
      }
      if(order==='after')await ctx.handleResolvedAuthUser(auth.currentUser)
      if(observed)await observed
      assert.equal(state.currentUser.uid,'alice');assert.equal(state.currentProfile.uid,'alice')
      assert.ok(routes.includes('alice'))
    }
  },
  async prep(){
    const storage=new Map([['base_user_alice_a',JSON.stringify({done:{passage:true}})]]),writes=[]
    const state={currentUser:{uid:'alice'},userSession:1,currentPrepVideoProgressRows:[]}
    let read=deferred()
    const ctx=vm.createContext({portalState:state,baseProgressKey:'base',progressKey:'',progress:{done:{}},window:{},
      localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>{writes.push(value);storage.set(key,value)}},
      getCurrentClass:()=>({id:'a'}),getPortalPrepVideoProgressUserId:()=>state.currentUser?.uid || '',
      studySets:[{classAssignments:[{classId:'a',passageIndexes:[0]}],passages:[{id:'p'}]}],
      normalizePortalPrepProgressIndex:Number,getPortalPrepProgressSetId:()=> 'set',getPortalPrepProgressPassageId:()=> 'p',
      findPortalPrepVideoProgressRow:rows=>rows[0] || null,getPassageProgressStorageKey:()=> 'passage',
      fetchCurrentPortalPrepVideoProgressRows:()=>read.promise,refreshVisiblePortalPrepProgressAfterHydration(){}})
    load(ctx,['sanitizeId','loadProgress','saveProgress','updateSetProgressContext'],core)
    load(ctx,['applyPortalPrepVideoProgressRowsToCurrentPrepClass','refreshPortalPrepVideoProgressForCurrentUser','resetPortalUserState'])
    ctx.window.applyPortalPrepVideoProgressRowsToCurrentPrepClass=ctx.applyPortalPrepVideoProgressRowsToCurrentPrepClass
    ctx.updateSetProgressContext()
    assert.equal(writes.length,0,'Unloaded server rows must not erase local completion')
    const pending=ctx.refreshPortalPrepVideoProgressForCurrentUser()
    ctx.updateSetProgressContext()
    assert.equal(writes.length,0,'A delayed server read must not erase completion')
    read.reject(Error('synthetic offline'))
    await assert.rejects(pending,/offline/)
    ctx.updateSetProgressContext()
    assert.equal(writes.length,0,'A failed read must not erase completion')
    read=deferred()
    const empty=ctx.refreshPortalPrepVideoProgressForCurrentUser();read.resolve([]);await empty
    assert.equal(writes.length,1,'A confirmed empty result clears stale completion once')
    assert.equal(JSON.parse(storage.get('base_user_alice_a')).done.passage,undefined)
    read=deferred()
    const old=ctx.refreshPortalPrepVideoProgressForCurrentUser()
    ctx.resetPortalUserState();state.currentUser={uid:'bob'}
    read.resolve([{userId:'alice',done:true}]);await old
    assert.equal(state.currentPrepVideoProgressLoadedUserId,'')
    assert.equal(state.currentPrepVideoProgressRows.length,0,'An old read must not hydrate the new account')
  },
  async auth(){
    for(const next of ['other-user','same-user','logout']){
      let callback
      const pending=[],state={userSession:0},auth={currentUser:null,onAuthStateChanged:fn=>{callback=fn}}
      let errors=0,routes=0
      const ctx=vm.createContext({portalState:state,window:{ROTATION_FIREBASE_CONFIG:{}},firebase:{apps:[{}],auth:()=>auth,firestore:()=>({})},
        fetchOrCreateUserProfile:()=>{const task=deferred();pending.push(task);return task.promise},
        routePortalAfterState:()=>{routes++},setAuthMeta(){},setAuthError:()=>{errors++},console:{error(){}}})
      load(ctx,['resetPortalUserState','handleResolvedAuthUser'])
      load(ctx,['initFirebasePortal'],portal)
      ctx.initFirebasePortal();callback({uid:'alice'})
      if(next==='logout'){auth.currentUser=null;callback(null)}
      else {auth.currentUser={uid:next==='same-user'?'alice':'bob'};callback(auth.currentUser);pending[1].resolve({role:'student'})}
      await flush()
      const expected=state.currentUser,expectedProfile=state.currentProfile,beforeRoutes=routes
      pending[0].reject(Error('synthetic previous failure'));await flush()
      assert.equal(state.currentUser,expected,next+': stale failure must not clear the current user')
      assert.equal(state.currentProfile,expectedProfile)
      assert.equal(routes,beforeRoutes)
      assert.equal(errors,0,'Stale errors must not overwrite current feedback')
    }
    // A current failure still reaches the existing login error UI.
    let callback
    const state={userSession:0},ctx=vm.createContext({portalState:state,window:{ROTATION_FIREBASE_CONFIG:{}},
      firebase:{apps:[{}],auth:()=>({onAuthStateChanged:fn=>{callback=fn}}),firestore:()=>({})},
      fetchOrCreateUserProfile:async()=>{throw Error('current failure')},routePortalAfterState(){},setAuthMeta(){},setAuthError:()=>{state.errorShown=true},console:{error(){}}})
    load(ctx,['resetPortalUserState','handleResolvedAuthUser']);load(ctx,['initFirebasePortal'],portal)
    ctx.initFirebasePortal();callback({uid:'alice'});await flush()
    assert.equal(state.currentUser,null);assert.equal(state.errorShown,true)
    // Direct login follows the same stale profile error policy as the Auth observer.
    for(const stale of [false,true]){
      const task=deferred(),state={firebaseEnabled:true,userSession:1,auth:{currentUser:{uid:'alice'},signInWithEmailAndPassword:async()=>({user:{uid:'alice'}})}}
      const ctx=vm.createContext({portalState:state,toPortalLoginEmail:value=>value,fetchOrCreateUserProfile:()=>task.promise,routePortalAfterState(){}})
      load(ctx,['loginPortalUser','resetPortalUserState'])
      const pending=ctx.loginPortalUser('synthetic','synthetic');await flush()
      if(stale){ctx.resetPortalUserState();state.currentUser={uid:'bob'};state.currentProfile={role:'student'}}
      task.reject(Error('profile failure'))
      if(stale){await pending;assert.equal(state.currentUser.uid,'bob')}
      else await assert.rejects(pending,/profile failure/)
    }
    // A disabled old account's delayed sign-out cannot clear a newer login.
    for(const name of ['handleResolvedAuthUser','loginPortalUser'])for(const rejected of [false,true]){
      const task=deferred(),state={firebaseEnabled:true,userSession:1,auth:{currentUser:{uid:'alice'},signInWithEmailAndPassword:async()=>({user:{uid:'alice'}}),signOut:()=>task.promise}}
      let routes=0
      const ctx=vm.createContext({portalState:state,toPortalLoginEmail:value=>value,fetchOrCreateUserProfile:async()=>({loginDisabled:true}),routePortalAfterState(){routes++},setAuthError(){throw Error('stale error')}})
      load(ctx,[name,'resetPortalUserState','signOutDisabledPortalUser'])
      const pending=ctx[name](name==='loginPortalUser'?'synthetic':{uid:'alice'},'synthetic');await flush()
      assert.equal(state.currentUser,null,'A disabled account is hidden before waiting for sign-out')
      const before=routes
      ctx.resetPortalUserState();state.currentUser={uid:'bob'};state.currentProfile={role:'student'}
      if(rejected)task.reject(Error('old sign-out failed'));else task.resolve()
      await pending
      assert.equal(state.currentUser.uid,'bob',name+': delayed disabled sign-out must preserve newer user')
      assert.equal(routes,before,'A delayed sign-out must not route the new account')
    }
  },
  async overlay(){
    for(const name of ['openPortalPrepVideoManager','openPortalManagedCheckSetEditor']){
      for(const rejected of [false,true]){
        const task=deferred(),state={userSession:1};let feedback=0
        const ctx=vm.createContext({portalState:state,isPortalAdmin:()=>true,getCloudSetDoc:()=>task.promise,
          clonePlainData:structuredClone,buildPortalManagedCheckSetEditorQuestions:()=>[{id:'q'}],serializePortalManagedCheckSetEditorState:()=>'',
          renderPortalPrepVideoManager:()=>{feedback++},renderPortalManagedCheckSetEditor:()=>{feedback++},showToast:()=>{feedback++},console:{error(){}}})
        load(ctx,[name,'resetPortalUserState'])
        const pending=ctx[name]('old-doc');ctx.resetPortalUserState()
        if(rejected)task.reject(Error('old failure'));else task.resolve({docId:'old-doc',payload:{passages:[{}]}})
        await pending
        assert.equal(feedback,0,name+': old open must not reveal data or errors')
      }
    }
    // A pending progress request cannot reopen or repopulate a closed account's dialog.
    for(const stage of ['document','students','progress'])for(const rejected of [false,true]){
      const task=deferred(),state={userSession:1,prepVideoProgressModal:{open:false}},renders=[]
      let reached=false
      const step=(name,value)=>{if(name!==stage)return Promise.resolve(value);reached=true;return task.promise}
      const ctx=vm.createContext({portalState:state,isPortalAdmin:()=>true,getCloudSetDoc:()=>step('document',{payload:{}}),
        getPortalPrepProgressClassId:()=> 'a',getPortalClassInfoById:()=>({id:'a'}),canManagePortalClass:()=>true,getPortalPrepProgressSetId:()=> 'set',
        normalizePortalPrepProgressStudents:rows=>rows,fetchAdminStudentProfiles:()=>step('students',[]),fetchPortalPrepVideoProgressRows:()=>step('progress',[]),
        renderPortalPrepVideoProgressModal:()=>renders.push(state.prepVideoProgressModal.open),console:{error(){}}})
      load(ctx,['openPortalPrepVideoProgressModal','resetPortalUserState'])
      const pending=ctx.openPortalPrepVideoProgressModal('old-doc')
      await flush();assert.equal(reached,true,'Progress modal must reach '+stage)
      ctx.resetPortalUserState()
      const afterReset=renders.length
      if(rejected)task.reject(Error('old failure'));else task.resolve({payload:{passages:[]}})
      await pending
      assert.equal(state.prepVideoProgressModal.open,false,'A late result must not reopen a dialog')
      assert.equal(renders.length,afterReset,'A stale callback must not render')
    }
    // A late save must not repopulate the manager or start a refresh as another account.
    for(const rejected of [false,true]){
      const task=deferred(),state={userSession:1,prepVideoManager:{open:true,docId:'old-doc',currentDoc:{payload:{passages:[{title:'Synthetic'}]}}}}
      let refreshes=0,toasts=0
      const ctx=vm.createContext({portalState:state,normalizePortalPrepYouTubeUrl:()=>({url:'https://example.invalid',embedUrl:''}),getPortalPrepVideoInputValue:()=> 'synthetic',getPortalPrepVideoTitleInputValue:()=> 'Synthetic',
        buildPassageState:()=>({title:'Synthetic'}),renderPortalPrepVideoManager(){},clonePlainData:value=>structuredClone(value),isPortalDirectPrepVideoPayload:()=>false,
        saveCloudSetDoc:()=>task.promise,syncPrepContentAfterLogin:async()=>{refreshes++},showToast:()=>{toasts++},console:{error(){}}})
      load(ctx,['savePortalPrepPassageVideoUrl','resetPortalUserState'])
      const pending=ctx.savePortalPrepPassageVideoUrl(0);ctx.resetPortalUserState()
      if(rejected)task.reject(Error('old write failure'));else task.resolve({})
      await pending
      assert.equal(state.prepVideoManager.currentDoc,null)
      assert.equal(refreshes,0);assert.equal(toasts,0)
    }
    // Stop each upload/link/delete continuation at every asynchronous boundary.
    for(const name of ['savePortalPrepPassageVideoUrl','removePortalPrepPassageVideo','handlePortalPrepVideoUploadChange']){
      const stages=name==='handlePortalPrepVideoUploadChange'?['upload','download','save','refresh','read']:['save','refresh','read']
      for(const stage of stages)for(const rejected of [false,true]){
        const task=deferred(),calls=[],doc={docId:'old-doc',payload:{passages:[{id:'p',title:'Synthetic'}]}}
        const state={userSession:1,prepVideoManager:{open:true,docId:'old-doc',pendingPassageIndex:0,currentDoc:doc}}
        const step=(name,value)=>{calls.push(name);return name===stage?task.promise:Promise.resolve(value)}
        const ctx=vm.createContext({portalState:state,window:{confirm:()=>true},
          normalizePortalPrepYouTubeUrl:()=>({url:'https://example.invalid',embedUrl:''}),getPortalPrepVideoInputValue:()=> 'synthetic',getPortalPrepVideoTitleInputValue:()=> 'Synthetic',
          buildPassageState:()=>({title:'Synthetic',hasVideo:true}),clonePlainData:structuredClone,isPortalDirectPrepVideoPayload:()=>false,
          canUsePortalCloudStorage:()=>true,sanitizePortalStoragePathPart:value=>value,
          renderPortalPrepVideoManager:()=>calls.push('render'),showToast:()=>calls.push('toast'),
          saveCloudSetDoc:()=>step('save',doc),syncPrepContentAfterLogin:()=>step('refresh',true),getCloudSetDoc:()=>step('read',doc),console:{error(){}}})
        state.storage={ref:()=>({child:()=>({put:()=>step('upload',{ref:{getDownloadURL:()=>step('download','https://example.invalid')}})})})}
        load(ctx,[name,'resetPortalUserState'])
        const pending=ctx[name](name==='handlePortalPrepVideoUploadChange'?{target:{files:[{name:'synthetic.mp4'}]}}:0)
        await flush();assert.ok(calls.includes(stage),name+' must reach '+stage)
        ctx.resetPortalUserState();const before=calls.length
        if(rejected)task.reject(Error('old operation failed'));else task.resolve(doc)
        await pending
        assert.equal(calls.length,before,name+'/'+stage+': no stale continuation or feedback')
        assert.equal(state.prepVideoManager.currentDoc,null)
      }
    }
    // A group save must stop before the next document, including failed writes and refreshes.
    for(const mode of ['single','group'])for(const stage of (mode==='group'?['load','save','refresh','open']:['save','refresh','open']))for(const rejected of [false,true]){
      const task=deferred(),calls=[],doc={docId:'old-doc',payload:{questions:[]}}
      const state={userSession:1,currentCheckSet:{id:'old-doc'},checkSetEditor:{open:true,docId:'old-doc',title:'Synthetic',currentDoc:doc,questions:[]}}
      const step=(name,value)=>{calls.push(name);return name===stage?task.promise:Promise.resolve(value)}
      const ctx=vm.createContext({portalState:state,hasPortalManagedCheckSetEditorChanges:()=>true,canPortalManagedCheckSetSaveSourceGroup:()=>true,
        getPortalManagedCheckSetSourceGroupKey:()=> 'source',canManagePortalCheckSetRecord:()=>true,buildPortalManagedCheckSetEditorSavePayload:()=>({}),
        syncPortalManagedCheckSetEditorControls:()=>calls.push('controls'),loadCloudSetDocs:()=>step('load',[doc,{docId:'other-doc',payload:{}}]),
        saveCloudSetDoc:()=>step('save',doc),ensureCheckData:()=>step('refresh',true),openCheckSetPortal:()=>step('open',true),getCurrentActiveScreenId:()=> 'check-set-screen',
        closePortalManagedCheckSetEditor:()=>calls.push('close'),syncPortalAdminSetPanels:()=>calls.push('panels'),showToast:()=>calls.push('toast'),console:{error(){}}})
      load(ctx,['savePortalManagedCheckSetEditor','resetPortalUserState'])
      const pending=ctx.savePortalManagedCheckSetEditor(mode);await flush()
      assert.ok(calls.includes(stage),mode+' save must reach '+stage)
      ctx.resetPortalUserState();const before=calls.length
      if(rejected)task.reject(Error('old operation failed'));else task.resolve(stage==='load'?[doc]:true)
      await pending
      assert.equal(calls.length,before,mode+'/'+stage+': no further write, refresh, close or feedback')
      assert.equal(state.checkSetEditor.currentDoc,null)
    }
  }
}
const selected=process.argv[2]
assert.ok(!selected || Object.hasOwn(groups,selected),'Unknown regression group')
for(const [name,test] of Object.entries(groups))if(!selected || selected===name){await test();console.log('Session recovery '+name+': OK')}
