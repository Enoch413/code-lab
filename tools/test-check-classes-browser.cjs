const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const {chromium}=require('./browser-tests/node_modules/playwright');
const sources=['rotation_portal.js','rotation_portal_enhancements.js','rotation_prep_ui.js'].map(read);
const definitions=new Map(sources.flatMap(text=>[...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(match=>[match[1],match[0]])));
const html=read('index.html'),section=id=>html.slice(html.indexOf('<div class="screen" id="'+id+'">'),html.indexOf('<div class="screen"',html.indexOf('<div class="screen" id="'+id+'">')+1));
(async()=>{
  const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});let groups=0;
  try{for(const width of [390,1280])for(const renderer of ['base','enhanced']){
    const page=await browser.newPage({viewport:{width,height:1000}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>route.abort());await page.setContent('<html lang="ko"><meta name="viewport" content="width=device-width,initial-scale=1"><body>'+section('class-screen')+section('check-screen')+'<div class="screen" id="check-set-screen"></div></body></html>');await page.addStyleTag({content:read('rotation_prep.css')});
    await page.evaluate(()=>{
      window.classes=[{id:'a',name:'예시 A반'},{id:'b',name:'예시 B반'},{id:'x',name:'다른 반'}];
      window.portalState={currentUser:{uid:'synthetic-instructor'},currentProfile:{role:'admin',adminScope:'assigned',classIds:['a','b']},firebaseEnabled:true,userSession:1,contentMeta:{},checkData:null};
      window.prepClasses=[];window.bundleData=null;window.currentClassIndex=-1;window.studySets=[];window.prepSelections=0;window.fixtureScreen='portal-screen';window.failLoad=false;
      window.getProfileClassNames=()=>['예시 A반','예시 B반'];window.getTodayStamp=()=> '2026-11-09';window.renderStat=()=>'';
      window.ensurePortalScreenAccess=()=>true;window.getCurrentActiveScreenId=()=>fixtureScreen;window.showAuthScreen=()=>{fixtureScreen='auth-screen'};
      window.activatePortalScreen=id=>{fixtureScreen=id;document.querySelectorAll('.screen').forEach(node=>node.classList.toggle('active',node.id===id));if(id==='class-screen'){document.querySelector('#class-screen h1').textContent=portalState.classSelectionReturnScreen==='check-screen'?'CHECK':'PREP';renderClassList()}};
      window.escapeHtml=value=>{const node=document.createElement('span');node.textContent=String(value);return node.innerHTML};window.showToast=()=>{};
      window.syncPrepContentAfterLogin=async()=>{throw Error('Unexpected PREP load')};window.selectClass=()=>{throw Error('Unexpected PREP selection')};window.showClassScreen=()=>{throw Error('Unexpected PREP bundle requirement')};
      window.ensureCheckData=async()=>{if(failLoad)throw Error('Synthetic read failure');return portalState.checkData=structuredClone(fixtureData)};
      window.fixtureData={classes,checkSets:[{id:'set-a',title:'A반 CHECK',classIds:['a'],questions:[]},{id:'set-b',title:'B반 CHECK',classIds:['b'],questions:[]},{id:'set-x',title:'다른 반 CHECK',classIds:['x'],questions:[]}]};
      window.isPersonalCheckSet=()=>false;window.buildCheckSetAssignmentMetaText=()=>'';window.getCheckSetListDateText=()=>'';
    });
    for(const name of ['escapeJs','getPortalRole','normalizeAdminScopeValue','getPortalAdminScope','isPortalAdmin','isPortalSuperAdmin','getProfileClassIds','classInfoName','getVisiblePortalCheckClassEntries','getActivePortalCheckClass','getActivePortalCheckClassIds','ensurePortalCheckSelection','selectPortalCheckClass','getVisibleCheckSets','renderCheckScreen','renderClassList','isCheckClassSelectionContext','getPortalClassSelectionCardMeta','overrideSharedClassListRenderer','openCheckPortal','showCheckLoadError','refreshCheckDataAndRender','refreshPortalData','openCheckClassPicker'])await page.addScriptTag({content:definitions.get(name)});
    await page.evaluate(renderer=>{window.isPortalStudentLockedClass=()=>!isPortalAdmin();if(renderer==='enhanced')overrideSharedClassListRenderer();document.getElementById('check-admin-class-btn').addEventListener('click',openCheckClassPicker);window.updateAdminUploadStatus=()=>{}},renderer);
    await page.evaluate(()=>openCheckPortal());assert.equal(await page.locator('#check-admin-class-btn').isVisible(),true);
    assert.match(await page.locator('#check-set-list').innerText(),/A반 CHECK/);assert.doesNotMatch(await page.locator('#check-set-list').innerText(),/다른 반 CHECK/);
    await page.locator('#check-admin-class-btn').click();await page.waitForFunction(()=>fixtureScreen==='class-screen');
    assert.equal(await page.locator('#class-list button').count(),2);assert.equal(await page.getByRole('button',{name:/다른 반/}).count(),0);
    await page.getByRole('button',{name:/예시 B반/}).focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>fixtureScreen==='check-screen');
    assert.equal(await page.locator('#check-class-name').innerText(),'예시 B반');assert.match(await page.locator('#check-set-list').innerText(),/B반 CHECK/);assert.doesNotMatch(await page.locator('#check-set-list').innerText(),/A반 CHECK|다른 반 CHECK/);
    assert.deepEqual(await page.evaluate(()=>({prepClasses:prepClasses.length,bundleData,currentClassIndex})),{prepClasses:0,bundleData:null,currentClassIndex:-1});
    await page.evaluate(()=>{fixtureData.checkSets=[]});await page.evaluate(()=>openCheckPortal());assert.equal(await page.locator('#check-admin-class-btn').isVisible(),true);
    await page.locator('#check-admin-class-btn').click();await page.waitForFunction(()=>fixtureScreen==='class-screen');await page.evaluate(()=>refreshPortalData());assert.equal(await page.locator('#class-list button').count(),2);
    await page.getByRole('button',{name:/예시 A반/}).click();await page.waitForFunction(()=>fixtureScreen==='check-screen');assert.match(await page.locator('#check-set-list').innerText(),/열려 있는 CHECK 세트가 없습니다/);
    await page.evaluate(()=>{portalState.currentProfile.classIds=['a'];renderCheckScreen()});assert.equal(await page.locator('#check-admin-class-btn').isVisible(),false);assert.equal(await page.locator('#check-class-name').innerText(),'예시 A반');
    await page.evaluate(()=>{portalState.currentProfile={role:'student',classIds:['a','b']};renderCheckScreen()});assert.equal(await page.locator('#check-admin-actions').isVisible(),false);assert.equal(await page.evaluate(()=>selectPortalCheckClass(1)),false);
    await page.evaluate(()=>{portalState.currentProfile={role:'admin',adminScope:'all',classIds:[]};renderCheckScreen()});await page.locator('#check-admin-class-btn').click();await page.waitForFunction(()=>fixtureScreen==='class-screen');assert.equal(await page.locator('#class-list button').count(),3);
    await page.evaluate(()=>{portalState.classSelectionReturnScreen='check-screen';selectPortalCheckClass(0);failLoad=true;portalState.checkData=null});
    await page.evaluate(()=>openCheckPortal());assert.equal(await page.locator('#check-load-retry-btn').isVisible(),true);await page.evaluate(()=>{failLoad=false});await page.locator('#check-load-retry-btn').click();await page.waitForFunction(()=>portalState.checkData!==null);assert.equal(await page.locator('#check-admin-class-btn').isVisible(),true);
    await page.evaluate(()=>{portalState.classSelectionReturnScreen='check-screen';portalState.currentProfile={role:'admin',adminScope:'assigned',classIds:['a']};renderClassList()});assert.equal(await page.locator('#class-list button').count(),1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await page.close();groups++;
  }}finally{await browser.close()}
  console.log(JSON.stringify({checkClassBrowserGroups:groups,viewports:[390,1280],renderers:['base','enhanced'],keyboardAndClassFiltering:true,loadFailureRetry:true,prepStateUnchanged:true,productionAccess:false}));
})().catch(error=>{console.error(error.stack);process.exitCode=1});
