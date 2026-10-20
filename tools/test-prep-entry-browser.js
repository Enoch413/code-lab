// Real app/auth route/entry/loader/DOM. External reads and the 20-second expiry use controlled fixtures.
async page => {
  const check=(value,message)=>{if(!value)throw Error(message)};
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  await page.addInitScript(()=>{if(navigator.serviceWorker)navigator.serviceWorker.register=async()=>({})});
  let bootstrapReads=0;
  await page.context().route('**/*',route=>{
    const url=new URL(route.request().url()),host=url.hostname;
    if(url.pathname.endsWith('/session.json'))bootstrapReads++;
    return host==='127.0.0.1'||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(host)?route.continue():route.abort('blockedbyclient');
  });
  const results=[];
  for(const width of [390,1280]){
    await page.setViewportSize({width,height:900});
    const beforeBootstrap=bootstrapReads;
    await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
    const cloudBootstrap=await page.evaluate(()=>isFirebaseConfigured());
    if(cloudBootstrap)check(bootstrapReads===beforeBootstrap,'Cloud startup must not read legacy session.json');
    const home=await page.evaluate(()=>{
      resetPortalUserState();portalState.firebaseEnabled=true;portalState.db={};portalState.authResolved=true;
      portalState.currentUser={uid:'synthetic-prep-entry'};
      portalState.currentProfile={uid:'synthetic-prep-entry',role:'student',classIds:['class-1-gangseo-b'],grammarAccessMode:'all'};
      const deferred=()=>{let resolve;const promise=new Promise(yes=>{resolve=yes});return {promise,resolve}};
      const fixture=window.prepEntryFixture={calls:[],start(){this.tasks={catalog:deferred(),legacy:deferred(),sets:deferred(),progress:deferred()}},settle(title){
        this.tasks.catalog.resolve(null);this.tasks.legacy.resolve(null);
        this.tasks.sets.resolve([{docId:'synthetic-prep-doc',title,accessSchemaVersion:1,classIds:['class-1-gangseo-b'],payload:{id:'synthetic-set',title,
          classAssignments:[{classId:'class-1-gangseo-b',passageIndexes:[0]}],passages:[{title:'Synthetic passage',text:'Synthetic text',items:[],videoUrl:'https://www.youtube.com/watch?v=synthetic01'}]}}]);
        this.tasks.progress.resolve([]);
      }};
      fixture.start();
      loadCloudContentDoc=id=>{if(id===PORTAL_CLOUD_DOCS.check)return Promise.resolve(null);fixture.calls.push(id);return fixture.tasks[id===PORTAL_CLASS_CATALOG_DOC?'catalog':'legacy'].promise};
      loadCloudSetDocs=kind=>{if(kind==='check')return Promise.resolve([]);fixture.calls.push('sets');return fixture.tasks.sets.promise};
      fetchCurrentPortalPrepVideoProgressRows=()=>{fixture.calls.push('progress');return fixture.tasks.progress.promise};
      fetchGrammarVideoProgressRows=async()=>[];
      const originalTimer=window.setTimeout;
      window.setTimeout=function(fn,ms,...args){if(ms===20000){fixture.expire=()=>fn(...args);return originalTimer(()=>{},3600000)}return originalTimer(fn,ms,...args)};
      routePortalAfterState();
      return {visible:document.getElementById('portal-screen').classList.contains('active'),prepReads:fixture.calls.length};
    });
    check(home.visible&&home.prepReads===0,'Authentication must show home without any PREP reads');
    await page.evaluate(()=>{
      document.getElementById('p-list').innerHTML='<button id="synthetic-old-prep-content">Synthetic previous content</button>';
      window.prepEntryPending=openPrepPortal();
    });
    check(await page.locator('#prep-entry-status').isVisible(),'PREP explains the pending read immediately');
    check(!await page.locator('#synthetic-old-prep-content').isVisible(),'Loading hides previous content and controls');
    check(await page.locator('#p-list').getAttribute('aria-busy')==='true','Loading exposes busy state');
    const feedback=await page.locator('#prep-entry-message').evaluate(node=>{
      const rgba=value=>{const a=value.match(/[\d.]+/g)||[];return a.slice(0,3).map(Number).concat(a.length>3?Number(a[3]):1)};
      const blend=(fg,bg)=>fg.slice(0,3).map((v,i)=>v*fg[3]+bg[i]*(1-fg[3])).concat(1);
      const bg=el=>{if(!el)return [255,255,255,1];const c=rgba(getComputedStyle(el).backgroundColor);return c[3]===1?c:blend(c,bg(el.parentElement))};
      const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
      const background=bg(node),a=lum(blend(rgba(getComputedStyle(node).color),background)),b=lum(background);
      return {contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),inset:node.getBoundingClientRect().left-node.closest('section').getBoundingClientRect().left,
        noClipping:node.scrollWidth<=node.clientWidth+1,live:node.getAttribute('role')==='status'&&node.getAttribute('aria-live')==='polite'};
    });
    check(feedback.contrast>=4.5&&feedback.inset>=8&&feedback.noClipping&&feedback.live,'Readable, inset, announced loading feedback: '+JSON.stringify(feedback));
    await page.locator('#prep-entry-home-btn').click();
    await page.evaluate(async()=>{await openCheckPortal()});
    check(await page.locator('#check-screen').isVisible(),'CHECK opens while PREP is stalled');
    await page.evaluate(async()=>{await openGrammarPortal('lv01')});
    check(await page.locator('#grammar-screen').isVisible(),'GRAMMAR opens while PREP is stalled');
    await page.evaluate(async()=>{prepEntryFixture.settle('Synthetic first');await prepEntryPending});
    check(await page.locator('#grammar-screen').isVisible(),'Late PREP success cannot pull navigation back');
    await page.evaluate(()=>{prepEntryFixture.start();window.prepEntryPending=openPrepPortal()});
    await page.evaluate(async()=>{prepEntryFixture.expire();await prepEntryPending});
    check(await page.locator('#prep-entry-retry-btn').isVisible()&&await page.locator('#prep-entry-retry-btn').isEnabled(),'Timed-out entry offers retry');
    check((await page.locator('#prep-entry-message').textContent()).includes('불러오지 못했습니다'),'Failure has a clear explanation');
    const late=await page.evaluate(async()=>{
      const previous=bundleData,inventory=portalState.prepSetInventory;
      prepEntryFixture.settle('Synthetic obsolete');for(let i=0;i<35;i++)await Promise.resolve();
      return bundleData===previous&&portalState.prepSetInventory===inventory&&portalState.prepEntryPhase==='error';
    });
    check(late,'A timed-out underlying read cannot install late content or inventory');
    await page.evaluate(()=>{prepEntryFixture.start()});
    await page.locator('#prep-entry-retry-btn').focus();await page.keyboard.press('Enter');
    check(await page.locator('#prep-entry-status').isVisible()&&!await page.locator('#prep-entry-retry-btn').isVisible(),'Keyboard retry returns to loading');
    await page.evaluate(async()=>{
      const pending=portalState.prepSyncPromise;prepEntryFixture.settle('Synthetic recovered');await pending;
      for(let i=0;i<35;i++)await Promise.resolve();
    });
    check(!await page.locator('#prep-entry-status').isVisible(),'Successful retry removes the loading panel');
    check(await page.locator('#p-list').isVisible()&&(await page.locator('#p-list').textContent()).includes('Synthetic passage'),'Successful retry renders the real PREP view');
    const clean=await page.evaluate(()=>portalState.prepSyncError===''&&portalState.prepSetInventory[0].title==='Synthetic recovered'&&portalState.currentPrepVideoProgressLoadedUserId==='synthetic-prep-entry');
    check(clean,'Successful retry commits bundle, inventory and server-confirmed progress together');
    await page.evaluate(()=>{prepEntryFixture.start();window.prepEntryPending=openPrepPortal()});
    await page.evaluate(async()=>{
      await handleResolvedAuthUser(null);prepEntryFixture.settle('Synthetic old account');await prepEntryPending;
    });
    check(await page.locator('#auth-screen').isVisible(),'A late PREP response cannot revive a logged-out account');
    const isolated=await page.evaluate(()=>bundleData===null&&portalState.prepSetInventory.length===0&&portalState.currentPrepVideoProgressRows.length===0);
    check(isolated,'Logout retains empty user-specific caches');
    results.push({width,cloudBootstrap,feedback,immediateHome:true,checkAndGrammarWhilePrepPending:true,oldContentHidden:true,timeoutRetry:true,keyboardRetry:true,lateResultsDiscarded:true,logoutIsolated:true});
  }
  return {results,productionWrites:0,mode:'actual app routing/entry/loader/DOM; synthetic external reads and controlled 20-second expiry'};
}
