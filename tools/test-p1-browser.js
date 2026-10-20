// playwright-cli run-code --filename=tools/test-p1-browser.js, safe local server on port 8000.
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
  await page.evaluate(()=>{
    portalState.firebaseEnabled=false;portalState.authProvider='local';portalState.authResolved=true;
    portalState.currentUser={uid:'synthetic-admin'};
    portalState.currentProfile={role:'admin',adminScope:'all',classIds:['a']};
    portalState.prepVideoManager={open:true,isSaving:false,docId:'synthetic-set',title:'Synthetic PREP',currentDoc:{docId:'synthetic-set',classIds:['a'],payload:{id:'synthetic-set',passages:[{id:'p1',title:'First',text:'First passage'},{id:'p2',title:'Second',text:'Second passage'}]}}};
    renderPortalPrepVideoManager();
  });
  await page.locator('#prep-video-title-input-0').fill('Changed first');
  await page.locator('#prep-video-url-input-0').fill('https://youtu.be/dQw4w9WgXcQ');
  await page.locator('#prep-video-title-input-1').fill('Unsaved second');
  await page.locator('#prep-video-url-input-1').fill('https://youtu.be/aqz-KE-bpKQ');
  await page.evaluate(()=>{portalState.prepVideoManager.isSaving=true;renderPortalPrepVideoManager()});
  check(await page.locator('#prep-video-title-input-0').inputValue()==='Changed first','Saving render keeps first title');
  check(await page.locator('#prep-video-title-input-1').inputValue()==='Unsaved second','Saving render keeps other title');
  check(await page.locator('#prep-video-url-input-1').inputValue()==='https://youtu.be/aqz-KE-bpKQ','Saving render keeps other URL');
  check(await page.locator('.prep-video-manager-item-actions button').count()===2,'Save buttons stay next to their passage');
  check(await page.locator('.prep-video-footer-save-btn').count()===0,'No ambiguous footer save copies');
  await page.evaluate(async()=>{
    portalState.prepVideoManager.isSaving=false;
    saveCloudSetDoc=async()=>{throw Error('synthetic offline')};
    await savePortalPrepPassageVideoUrl(0);
  });
  check(await page.locator('#prep-video-title-input-0').inputValue()==='Changed first','Failed save keeps title');
  check(await page.locator('#prep-video-url-input-0').inputValue()==='https://youtu.be/dQw4w9WgXcQ','Failed save keeps URL');
  check(await page.locator('#prep-video-title-input-1').inputValue()==='Unsaved second','Failed save keeps other draft');
  await page.evaluate(async()=>{
    let saved;
    saveCloudSetDoc=async(kind,id,record)=>{saved=record;return record};
    getCloudSetDoc=async()=>saved;
    syncPrepContentAfterLogin=async()=>true;
    getPortalUploadTargetClass=()=>null;
    syncPortalAdminSetPanels=()=>{};
    await savePortalPrepPassageVideoUrl(0);
  });
  check(await page.locator('#prep-video-title-input-0').inputValue()==='Changed first','Confirmed title is rendered');
  check(await page.locator('#prep-video-title-input-1').inputValue()==='Unsaved second','Confirmed save keeps other title');
  check(await page.locator('#prep-video-url-input-1').inputValue()==='https://youtu.be/aqz-KE-bpKQ','Confirmed save keeps other URL');
  await page.evaluate(()=>{
    closePortalPrepVideoManager();
    showPortalScreen();
    window.p1Mutations=0;
    window.p1Observer=new MutationObserver(records=>{window.p1Mutations+=records.length});
    window.p1Observer.observe(document.body,{childList:true,subtree:true});
  });
  await page.waitForTimeout(500);
  await page.evaluate(()=>{window.p1Mutations=0});
  await page.waitForTimeout(500);
  const idle=await page.evaluate(()=>window.p1Mutations);
  check(idle===0,'Idle icon enhancement must produce no DOM mutations: '+idle);
  await page.evaluate(()=>{const button=document.createElement('button');button.id='p1-dynamic-save';button.textContent='저장';document.getElementById('portal-screen').appendChild(button)});
  await page.waitForTimeout(250);
  check(await page.locator('#p1-dynamic-save .ui-action-icon').count()===1,'A dynamic button gets one icon');
  await page.evaluate(()=>{window.p1Mutations=0});
  await page.waitForTimeout(500);
  check(await page.evaluate(()=>window.p1Mutations)===0,'Dynamic decoration settles without a loop');
  check(await page.locator('#superadmin-reset-cycle-btn').isDisabled(),'Destructive reset stays disabled');
  await page.evaluate(()=>{window.p1Observer.disconnect();document.getElementById('p1-dynamic-save').remove()});
  return {prepDrafts:'saving/failure/success/other row preserved',icons:'idle and dynamic settled',reset:'disabled',blockedRequests:blocked,productionWrites:0};
}
