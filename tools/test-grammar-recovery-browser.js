// Run against the public-only loopback server. Production API access is blocked.
async page => {
  const check=(value,message)=>{if(!value)throw Error(message)};
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  await page.addInitScript(()=>{if(navigator.serviceWorker)navigator.serviceWorker.register=async()=>({})});
  await page.context().route('**/*',route=>{
    const host=new URL(route.request().url()).hostname;
    return host==='127.0.0.1'||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(host)?route.continue():route.abort('blockedbyclient');
  });
  const results=[];
  for(const width of [390,1280]){
    await page.setViewportSize({width,height:900});
    await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
    const staged=await page.evaluate(()=>{
      const uid='synthetic-grammar-recovery';
      localStorage.removeItem(getPendingGrammarProgressKey(uid));
      portalState.firebaseEnabled=true;portalState.currentUser={uid};portalState.currentProfile={uid,role:'student',classIds:['a'],grammarAccessMode:'all',name:'Synthetic private name'};
      const unit=getGrammarCatalog()[0].chapters[0].units[0],context=getGrammarUnitContext(unit.id);
      portalState.grammarPlayer.unitId=unit.id;portalState.grammarPlayer.partIndex=0;
      renderGrammarPlayer(context);initializeGrammarProgressTracker(context,0);
      const tracker=portalState.grammarProgress.tracker;
      Object.assign(tracker,{duration:100,currentTime:0,startedAt:'2026-10-20T00:00:00.000Z',lastPlaybackTime:0,dirty:true});
      const player=document.getElementById('grammar-video-player');
      for(const [key,value] of Object.entries({currentTime:3,duration:100,paused:false}))Object.defineProperty(player,key,{configurable:true,value});
      handleGrammarVideoTimeUpdate();
      const raw=localStorage.getItem(getPendingGrammarProgressKey(uid));
      return {uid,unitId:unit.id,persisted:!!raw&&JSON.parse(raw)[0].currentTime===3,privateProfileExcluded:!!raw&&!raw.includes('Synthetic private name')};
    });
    check(staged.persisted&&staged.privateProfileExcluded,'Progress must survive before any timer/network write');
    // Reload immediately, while the normal eight-second save timer has not run.
    await page.reload({waitUntil:'networkidle'});
    const restored=await page.evaluate(async ({uid,unitId})=>{
      portalState.firebaseEnabled=true;portalState.currentUser={uid};portalState.currentProfile={uid,role:'student',classIds:['a'],grammarAccessMode:'all'};
      portalState.db={};fetchScopedPortalRecordDocs=async()=>{throw Error('synthetic offline')};
      const rows=await ensureCurrentGrammarProgressLoaded(false);
      portalState.grammarPlayer.unitId=unitId;portalState.grammarPlayer.partIndex=0;
      renderGrammarPlayer(getGrammarUnitContext(unitId));initializeGrammarProgressTracker(getGrammarUnitContext(unitId),0);
      activatePortalScreen('grammar-player-screen');
      const pendingVisible=document.getElementById('grammar-watch-status-detail').textContent.includes('서버 동기화 대기');
      const resumed=rows[0].currentTime===3&&portalState.grammarProgress.tracker.currentTime===3;
      const writes=[];
      portalState.db={collection:()=>({doc:id=>({id})}),runTransaction:async fn=>fn({get:async()=>({exists:false}),set:(ref,data)=>writes.push({id:ref.id,data})})};
      await retryPendingGrammarProgress();
      const synchronized=writes.length===1&&writes[0].data.userId===uid&&readPendingGrammarProgressRows(uid).length===0;
      const clearedNotice=!document.getElementById('grammar-watch-status-detail').textContent.includes('서버 동기화 대기');
      resetPortalUserState();portalState.currentUser={uid:'synthetic-other'};portalState.currentProfile={uid:'synthetic-other',role:'student',classIds:['b']};
      const isolated=readPendingGrammarProgressRows('synthetic-other').length===0&&portalState.grammarProgress.rows.length===0;
      localStorage.removeItem(getPendingGrammarProgressKey(uid));
      return {resumed,pendingVisible,synchronized,clearedNotice,isolated};
    },staged);
    check(Object.values(restored).every(Boolean),'Reload/retry/isolation failed: '+JSON.stringify(restored));
    results.push({width,...restored});
  }
  return {results,productionWrites:0,mode:'real video progress event, reload, DOM and recovery; synthetic Firestore'};
}
