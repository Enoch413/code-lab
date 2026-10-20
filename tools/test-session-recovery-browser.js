// Run with Playwright CLI against tools/serve-local.py on loopback port 8000.
async page => {
  const check=(value,message)=>{if(!value)throw Error(message)};
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  await page.addInitScript(()=>{if(navigator.serviceWorker)navigator.serviceWorker.register=async()=>({})});
  let blocked=0;
  await page.context().route('**/*',route=>{
    const url=new URL(route.request().url());
    if(url.hostname==='127.0.0.1'||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname))return route.continue();
    blocked++;return route.abort('blockedbyclient');
  });
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  const cache=await page.evaluate(async()=>{
    const app=firebase.initializeApp({projectId:'demo-codelab-reaudit',apiKey:'synthetic-only',appId:'synthetic-only'},'synthetic-progress-regression');
    const db=app.firestore();db.useEmulator('127.0.0.1',8786,{mockUserToken:{sub:'synthetic-cache-student',user_id:'synthetic-cache-student'}});
    const key='synthetic-cache-progress';
    try{
      await db.disableNetwork();
      const snapshot=await db.collection('prepVideoProgress').where('userId','==','synthetic-cache-student').get();
      portalState.firebaseEnabled=true;portalState.db=db;portalState.currentUser={uid:'synthetic-cache-student'};
      portalState.currentProfile={role:'student',classIds:['a']};portalState.currentPrepVideoProgressRows=[];portalState.currentPrepVideoProgressLoadedUserId='';
      studySets=[{id:'set',classAssignments:[{classId:'a',passageIndexes:[0]}],passages:[{id:'p'}]}];
      getCurrentClass=()=>({id:'a'});getPassageProgressStorageKey=()=> 'passage';
      progressKey=key;progress={done:{passage:true}};localStorage.setItem(key,JSON.stringify(progress));
      let failed=false;try{await refreshPortalPrepVideoProgressForCurrentUser()}catch(error){failed=true}
      return {fromCache:snapshot.metadata.fromCache,rows:snapshot.size,failed,preserved:progress.done.passage===true&&JSON.parse(localStorage.getItem(key)).done.passage===true,loaded:portalState.currentPrepVideoProgressLoadedUserId};
    }finally{localStorage.removeItem(key);await app.delete()}
  });
  check(cache.fromCache&&cache.rows===0&&cache.failed&&cache.preserved&&cache.loaded==='','Real SDK offline result must preserve local completion: '+JSON.stringify(cache));
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  const prefixes=['prep-video-manager','prep-video-progress','check-set-editor'];
  for(const width of [1280,390]){
    await page.setViewportSize({width,height:900});
    for(const prefix of prefixes){
      await page.evaluate(prefix=>{
        portalState.firebaseEnabled=false;portalState.authProvider='local';portalState.authResolved=true;
        portalState.currentUser={uid:'synthetic-admin'};
        portalState.currentProfile={role:'admin',adminScope:'all',classIds:['a']};
        showPortalScreen();
        if(prefix==='prep-video-manager'){
          portalState.prepVideoManager={open:true,isSaving:false,docId:'synthetic-private',title:'Synthetic private title',currentDoc:{docId:'synthetic-private',classIds:['a'],payload:{passages:[{id:'p1',title:'Synthetic private passage',text:'Synthetic text'}]}}};
          renderPortalPrepVideoManager();
          document.getElementById('prep-video-title-input-0').value='Synthetic private draft';
          // Account transitions must close even when ordinary closing is blocked by saving.
          portalState.prepVideoManager.isSaving=true;
        }else if(prefix==='prep-video-progress'){
          portalState.prepVideoProgressModal={open:true,isLoading:true,title:'Synthetic private title',currentDoc:{docId:'synthetic-private'},students:[{uid:'synthetic-student'}],progressRows:[]};
          renderPortalPrepVideoProgressModal();
        }else{
          portalState.checkSetEditor={open:true,isSaving:true,docId:'synthetic-private',title:'Synthetic private title',currentDoc:{docId:'synthetic-private'},questions:[],initialDigest:'old'};
          renderPortalManagedCheckSetEditor();
        }
        const draft=document.createElement('input');draft.value='Synthetic private draft';
        document.getElementById(prefix+'-list').appendChild(draft);
        portalState.prepVideoDrafts={'doc:synthetic-private':{0:{title:'Synthetic private draft'}}};
      },prefix);
      await page.waitForTimeout(50);
      check(await page.evaluate(()=>document.getElementById('app-main').inert),'Open dialog traps focus');
      await page.evaluate(async()=>{await handleResolvedAuthUser(null)});
      await page.waitForTimeout(50);
      const clean=await page.evaluate(prefix=>({
        signedOut:portalState.currentUser===null&&document.getElementById('auth-screen').classList.contains('active'),
        hidden:document.getElementById(prefix+'-modal').classList.contains('hidden')&&document.getElementById(prefix+'-modal').getAttribute('aria-hidden')==='true',
        empty:document.getElementById(prefix+'-list').children.length===0&&document.getElementById(prefix+'-title').textContent==='',
        released:!document.getElementById('app-main').inert&&!document.getElementById('app-chrome').inert,
        cleared:Object.keys(portalState.prepVideoDrafts).length===0&&[portalState.prepVideoManager,portalState.prepVideoProgressModal,portalState.checkSetEditor].every(state=>!state||(!state.open&&!state.currentDoc))
      }),prefix);
      check(Object.values(clean).every(Boolean),prefix+' logout cleanup: '+JSON.stringify(clean));
      await page.locator('#auth-email').focus();
      await page.keyboard.press('Tab');
      check(await page.locator('#auth-password').evaluate(node=>node===document.activeElement),'Login keyboard navigation recovered');
      await page.keyboard.press('Escape');
      check(!await page.locator('#'+prefix+'-modal').isVisible(),'Escape must not revive a closed dialog');
      await page.evaluate(()=>{
        portalState.currentUser={uid:'synthetic-next-student'};portalState.currentProfile={role:'student',classIds:[]};
        showPortalScreen();
      });
      check(!await page.locator('#'+prefix+'-modal').isVisible(),'Next account must not inherit the dialog');
    }
  }
  const checkEntry=await page.evaluate(async()=>{
    portalState.firebaseEnabled=false;portalState.currentUser={uid:'synthetic-check-student'};portalState.currentProfile={role:'student',classIds:['a']};
    const old={id:'old',title:'Synthetic old set',questions:[],isAccessible:true},next={id:'next',title:'Synthetic next set',questions:[],isAccessible:true};
    getVisibleCheckSets=()=>[old,next];
    portalState.currentCheckSet=old;portalState.currentCheckSubmission={answers:[]};portalState.currentCheckDraftAnswers={old:'Synthetic draft'};
    renderCurrentCheckSet();activatePortalScreen('check-set-screen');
    const submission=portalState.currentCheckSubmission,drafts=portalState.currentCheckDraftAnswers;
    loadExistingCheckSubmission=async()=>{throw Error('synthetic offline')};
    const failed=await openCheckSetPortal('next');
    const preserved=failed===false&&portalState.currentCheckSet===old&&portalState.currentCheckSubmission===submission&&portalState.currentCheckDraftAnswers===drafts&&document.getElementById('check-current-set-name').textContent===old.title;
    loadExistingCheckSubmission=async()=>null;
    const retried=await openCheckSetPortal('next');
    return {preserved,retried:retried===true&&portalState.currentCheckSet===next&&portalState.currentCheckSubmission===null&&document.getElementById('check-current-set-name').textContent===next.title};
  });
  check(checkEntry.preserved&&checkEntry.retried,'CHECK entry failure and retry: '+JSON.stringify(checkEntry));
  const credentials=await page.evaluate(async()=>{
    const results=[];
    fetchOrCreateUserProfile=async user=>({uid:user.uid,role:'student'});
    routePortalAfterState=()=>{};
    for(const next of ['synthetic-bob',null])for(const rejected of [false,true]){
      let resolve,reject;
      const pending=new Promise((yes,no)=>{resolve=yes;reject=no});
      portalState.firebaseEnabled=true;portalState.auth={currentUser:null,signInWithEmailAndPassword:()=>pending};
      document.getElementById('auth-email').value='synthetic-alice';document.getElementById('auth-password').value='synthetic-only';
      const submit=submitAuthForm();
      portalState.auth.currentUser=next?{uid:next}:null;await handleResolvedAuthUser(portalState.auth.currentUser);
      portalState.prepVideoDrafts={synthetic:{title:'new draft'}};
      document.getElementById('auth-email').value='new-field';document.getElementById('auth-password').value='new-input';
      setAuthError('Synthetic current status');
      const session=portalState.userSession;
      if(rejected)reject(Error('old request failed'));else resolve({user:{uid:'synthetic-alice'}});
      await submit;
      results.push({next,rejected,valid:(portalState.currentUser?.uid||null)===next&&portalState.userSession===session&&portalState.prepVideoDrafts.synthetic.title==='new draft'&&document.getElementById('auth-password').value==='new-input'&&document.getElementById('auth-error').textContent==='Synthetic current status'});
    }
    return results;
  });
  check(credentials.every(row=>row.valid),'Late credential/form completion must preserve current state: '+JSON.stringify(credentials));
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  const authFeedback=await page.evaluate(async()=>{
    const assert=(value,message)=>{if(!value)throw Error(message)};
    const flush=async()=>{for(let i=0;i<40;i++)await Promise.resolve()};
    const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject}};
    const disabled='현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.',failed='로그인 정보를 불러오지 못했습니다.';
    const error=()=>document.getElementById('auth-error').textContent;
    const originalFirebase=window.firebase;
    let callback;
    const auth={currentUser:null,onAuthStateChanged:fn=>{callback=fn},signOut:async()=>{}};
    window.firebase={apps:[{}],auth:()=>auth,firestore:()=>({})};
    // Keep the real observer, routing, form, screens and error output; replace only external services.
    syncPrepContentAfterLogin=async()=>true;handlePortalHashRoute=()=>{};
    initFirebasePortal();
    const notify=async user=>{auth.currentUser=user;callback(user);await flush()};
    const form=()=>{
      document.getElementById('auth-email').value='synthetic';document.getElementById('auth-password').value='synthetic-only';
      return submitAuthForm();
    };
    const results=[];
    fetchOrCreateUserProfile=async()=>{throw Error('synthetic current profile failure')};
    await notify({uid:'synthetic-profile-failure'});
    assert(!portalState.currentUser&&error()===failed,'Current profile error must survive routing');
    await notify(null);assert(error()===failed,'Null observer must preserve the current explanation');
    const retry=deferred();auth.signInWithEmailAndPassword=()=>retry.promise;
    const submitted=form();assert(error()===''&&portalState.authSessionError==='','Retry clears previous notice');
    retry.reject(Object.assign(Error('synthetic invalid credential'),{code:'auth/invalid-credential'}));await submitted;
    assert(document.getElementById('auth-password').getAttribute('aria-invalid')==='true','Retry retains credential validation');
    fetchOrCreateUserProfile=async user=>({uid:user.uid,role:'student',classIds:[]});
    await notify({uid:'synthetic-success'});assert(error()===''&&portalState.currentUser.uid==='synthetic-success','Successful retry clears status');
    results.push('profile failure / null notification / retry / credential validation / success');
    for(const entry of ['observer','direct','both','route'])for(const order of ['before','after'])for(const rejected of [false,true]){
      await logoutPortal();await notify(null);
      const signOut=deferred(),credential=deferred(),user={uid:'synthetic-disabled'};
      auth.signOut=()=>signOut.promise;auth.currentUser=user;
      auth.signInWithEmailAndPassword=()=>entry==='both'?credential.promise:Promise.resolve({user});
      fetchOrCreateUserProfile=async()=>({uid:user.uid,role:'student',classIds:[],loginDisabled:true});
      const submit=['direct','both'].includes(entry)?form():null;
      if(entry==='route'){
        portalState.currentUser=user;portalState.currentProfile=await fetchOrCreateUserProfile(user);
        routePortalAfterState();await flush();
      }else if(entry!=='direct'){callback(user);await flush()}
      if(entry==='both'){credential.resolve({user});await flush()}
      await flush();
      assert(error()===disabled&&!portalState.currentUser,'Disabled explanation must appear before sign-out settles');
      if(order==='before')await notify(null);
      if(rejected)signOut.reject(Error('synthetic sign-out failure'));else signOut.resolve();
      if(submit)await submit;await flush();
      if(order==='after')await notify(null);
      assert(error()===disabled&&!portalState.currentUser&&document.getElementById('auth-screen').classList.contains('active'),'Disabled notice survives '+entry+'/'+order+'/'+rejected);
      assert(['auth-email','auth-password'].every(id=>document.getElementById(id).getAttribute('aria-invalid')!=='true'),'Disabled account is a status, not an invalid field');
      assert(!document.getElementById('auth-submit-btn').disabled,'Disabled form releases its loading state');
      auth.signOut=async()=>{};
      results.push(entry+'/'+order+'/'+rejected);
    }
    for(const next of ['success','same-user','failure'])for(const rejected of [false,true]){
      clearAuthError();const task=deferred(),user={uid:'synthetic-old-disabled'};
      auth.currentUser=user;auth.signOut=()=>task.promise;
      fetchOrCreateUserProfile=async()=>({uid:user.uid,role:'student',classIds:[],loginDisabled:true});
      callback(user);await flush();
      fetchOrCreateUserProfile=async user=>{if(next==='failure')throw Error('new synthetic profile failure');return {uid:user.uid,role:'student',classIds:[]}};
      await notify({uid:next==='same-user'?user.uid:'synthetic-next'});
      const current=portalState.currentUser,before=error();
      if(rejected)task.reject(Error('old synthetic sign-out failure'));else task.resolve();await flush();
      assert(portalState.currentUser===current&&error()===before,'Old disabled completion must preserve newer '+next);
      auth.signOut=async()=>{};results.push('old completion/'+next+'/'+rejected);
    }
    await logoutPortal();await notify(null);assert(error()===''&&portalState.authSessionError==='','Explicit logout clears previous notice');
    window.firebase=originalFirebase;
    return {scenarios:results,logoutCleared:true,mode:'real DOM/form/observer/router; synthetic Auth and profiles'};
  });
  return {cache,checkEntry,credentials,authFeedback,dialogTransitions:6,viewports:[1280,390],drafts:'cleared',keyboard:'login Tab recovered',blockedRequests:blocked,productionWrites:0};
}
