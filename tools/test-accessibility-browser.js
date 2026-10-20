// Run with playwright-cli run-code --filename=tools/test-accessibility-browser.js against the local server on port 8000.
async page => {
  const check=(value,message)=>{if(!value)throw Error(message)};
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  await page.addInitScript(()=>{if(navigator.serviceWorker)navigator.serviceWorker.register=async()=>({})});
  await page.context().route('**/*',route=>{
    const url=new URL(route.request().url());
    if(url.hostname==='127.0.0.1'||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname))return route.continue();
    return route.abort('blockedbyclient');
  });
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  await page.evaluate(()=>{
    portalState.firebaseEnabled=false;portalState.authProvider='local';portalState.authResolved=true;
    portalState.currentUser={uid:'synthetic-student',email:'synthetic@example.invalid'};
    portalState.currentProfile={uid:'synthetic-student',name:'SYNTHETIC STUDENT',role:'student',classIds:[prepClasses[0]?.id || 'synthetic'],grammarAccessMode:'all',passwordResetRequired:false};
    showPortalScreen();
  });
  const drawer=[];
  for(const width of [320,390,1280]){
    await page.setViewportSize({width,height:900});
    await page.locator('#app-menu-btn').click();
    const initial=await page.evaluate(()=>{
      const node=document.activeElement,s=getComputedStyle(node),r=node.getBoundingClientRect();
      const rgba=text=>(text.match(/[\d.]+/g)||[]).map(Number);
      const luminance=color=>color.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((total,x,i)=>total+x*[.2126,.7152,.0722][i],0);
      const fg=rgba(s.color),bg=rgba(s.backgroundColor);
      const backdrop=getComputedStyle(document.getElementById('app-drawer')).backgroundImage;
      const colors=[...backdrop.matchAll(/rgb\(([^)]+)\)/g)].map(match=>rgba(match[1]).map(x=>x*.95+255*.05));
      const ratios=colors.map(color=>{const surface=bg.slice(0,3).map((x,i)=>x*(bg[3]??1)+color[i]*(1-(bg[3]??1)));const text=luminance(fg.slice(0,3)),base=luminance(surface);return (Math.max(text,base)+.05)/(Math.min(text,base)+.05)});
      return {id:node.id,width:r.width,height:r.height,clip:s.clip,clipPath:s.clipPath,inert:document.getElementById('app-main').inert,textContrast:ratios.length?Math.min(...ratios):0};
    });
    check(initial.id==='app-drawer-close-btn'&&initial.width>=24&&initial.height>=24&&initial.clip==='auto'&&initial.clipPath==='none'&&initial.inert,'Initial menu focus must be visible and usable');
    check(initial.textContrast>=4.5,'Close button icon contrast must meet 4.5:1');
    await page.keyboard.press('Shift+Tab');
    check(await page.evaluate(()=>document.activeElement.id==='drawer-logout-btn'),'Reverse menu trap');
    await page.keyboard.press('Tab');
    check(await page.evaluate(()=>document.activeElement.id==='app-drawer-close-btn'),'Forward menu trap');
    const contrast=[];
    for(let i=0;i<10;i++){
      const focused=await page.evaluate(()=>{
        const node=document.activeElement,s=getComputedStyle(node);
        const rgb=text=>(text.match(/[\d.]+/g)||[]).slice(0,3).map(Number);
        const luminance=color=>color.map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4}).reduce((total,x,i)=>total+x*[.2126,.7152,.0722][i],0);
        const ring=luminance(rgb(s.outlineColor));
        const background=getComputedStyle(document.getElementById('app-drawer')).backgroundImage;
        const colors=[...background.matchAll(/rgb\(([^)]+)\)/g)].map(match=>rgb(match[1]));
        const ratios=colors.flatMap(color=>[color,color.map(x=>x*.95+255*.05)]).map(color=>{const bg=luminance(color);return (Math.max(ring,bg)+.05)/(Math.min(ring,bg)+.05)});
        return {id:node.id,focusVisible:node.matches(':focus-visible'),outlineWidth:parseFloat(s.outlineWidth),outlineStyle:s.outlineStyle,minContrast:ratios.length?Math.min(...ratios):0};
      });
      check(focused.focusVisible&&focused.outlineWidth>=2&&focused.outlineStyle==='solid'&&focused.minContrast>=3,'Menu focus contrast must meet 3:1');
      contrast.push(focused);
      await page.keyboard.press('Tab');
      if(await page.evaluate(()=>document.activeElement.id==='app-drawer-close-btn'))break;
    }
    check(contrast.length>=8,'Cover every visible menu action');
    await page.keyboard.press('Escape');
    check(await page.evaluate(()=>document.activeElement.id==='app-menu-btn'&&!document.getElementById('app-main').inert&&document.getElementById('app-drawer').inert),'Escape must restore the trigger and release the background');
    await page.locator('#app-menu-btn').click();
    await page.locator('#app-drawer-close-btn').click();
    check(await page.evaluate(()=>!document.getElementById('app-drawer').classList.contains('open')),'Focused close button must work');
    drawer.push({width,initial,contrast});
  }
  const password=await page.evaluate(async()=>{
    openPasswordScreen(false);
    const cases=[
      ['synthetic-current','synthetic-next','synthetic-other','password-confirm'],
      ['synthetic-current','synthetic-current','synthetic-current','password-next'],
      ['','synthetic-next','synthetic-next','password-current'],
      ['synthetic-current','','synthetic-next','password-next'],
      ['synthetic-current','synthetic-next','','password-confirm'],
      ['  ','synthetic-next','synthetic-next','password-current'],
      ['synthetic-current','short','short','password-next']
    ];
    const results=[];
    for(const [current,next,confirm,target] of cases){
      for(const [id,value] of [['password-current',current],['password-next',next],['password-confirm',confirm]])document.getElementById(id).value=value;
      await submitPasswordChange();
      const invalid=[...document.querySelectorAll('#password-screen [aria-invalid=true]')].map(node=>node.id);
      if(document.activeElement.id!==target||JSON.stringify(invalid)!==JSON.stringify([target]))throw Error('Password error target mismatch');
      results.push({target,focused:document.activeElement.id,invalid});
    }
    const original={enabled:portalState.firebaseEnabled,auth:portalState.auth,readLocalUsers,writeLocalUsers,saveFirebaseUserProfile};
    try{
      for(const test of [
        {name:'local authentication failure',local:true,target:'password-current'},
        {name:'invalid-credential code',stage:'reauth',code:'auth/invalid-credential',target:'password-current'},
        {name:'wrong-password code',stage:'reauth',code:'auth/wrong-password',target:'password-current'},
        {name:'weak-password code',stage:'update',code:'auth/weak-password',target:'password-next'},
        {name:'reauthentication network failure',stage:'reauth',code:'auth/network-request-failed',target:null},
        {name:'profile storage failure',stage:'profile',code:'permission-denied',target:null}
      ]){
        let authAttempts=0,passwordWrites=0,profileWrites=0,localWrites=0;
        const fail=stage=>{if(test.stage===stage)throw Object.assign(Error('Synthetic service failure'),{code:test.code})};
        portalState.firebaseEnabled=!test.local;
        portalState.auth={currentUser:{uid:'synthetic-student',email:'synthetic@example.invalid',
          async reauthenticateWithCredential(){authAttempts++;fail('reauth')},
          async updatePassword(){passwordWrites++;fail('update')}
        }};
        readLocalUsers=()=>[{id:'synthetic-student',password:'different-synthetic-current'}];
        writeLocalUsers=()=>{localWrites++;throw Error('Unexpected local write')};
        saveFirebaseUserProfile=async()=>{profileWrites++;fail('profile');throw Error('Unexpected profile write')};
        for(const [id,value] of [['password-current','synthetic-current'],['password-next','synthetic-next'],['password-confirm','synthetic-next']])document.getElementById(id).value=value;
        document.getElementById('password-confirm').focus();
        await submitPasswordChange();
        const invalid=[...document.querySelectorAll('#password-screen [aria-invalid=true]')].map(node=>node.id);
        const focused=document.activeElement.id,message=document.getElementById('password-error').textContent;
        if(focused!==(test.target||'password-confirm')||JSON.stringify(invalid)!==JSON.stringify(test.target?[test.target]:[]))throw Error(test.name+': incorrect error association');
        if(!message||(test.target==='password-current'&&message!=='현재 비밀번호가 올바르지 않습니다.'))throw Error(test.name+': unreadable error');
        if(authAttempts!==(test.local?0:1)||localWrites!==0||passwordWrites!==(['update','profile'].includes(test.stage)?1:0)||profileWrites!==(test.stage==='profile'?1:0))throw Error(test.name+': failure crossed the write boundary');
        results.push({name:test.name,target:test.target,focused,invalid,message,authAttempts,passwordWrites,profileWrites,localWrites});
      }
    }finally{
      portalState.firebaseEnabled=original.enabled;portalState.auth=original.auth;
      readLocalUsers=original.readLocalUsers;writeLocalUsers=original.writeLocalUsers;saveFirebaseUserProfile=original.saveFirebaseUserProfile;
    }
    clearPasswordFields();clearPasswordError();
    if(document.querySelector('#password-screen [aria-invalid=true]')||document.getElementById('password-error').textContent)throw Error('Stale password error');
    showPortalScreen();return results;
  });
  const login=[];
  await page.evaluate(()=>{
    window.loginErrorTest={original:{loginPortalUser,findLocalPortalUser,currentUser:portalState.currentUser,currentProfile:portalState.currentProfile,enabled:portalState.firebaseEnabled,setItem:Storage.prototype.setItem},attempts:0,writes:0};
    Storage.prototype.setItem=function(){loginErrorTest.writes++;throw Error('Unexpected storage write')};
    portalState.firebaseEnabled=false;portalState.currentUser=null;portalState.currentProfile=null;showAuthScreen('');
  });
  try{
    for(const values of [['',''],['synthetic','synthetic-current']]){
      await page.evaluate(values=>{
        document.getElementById('auth-email').value=values[0];document.getElementById('auth-password').value=values[1];
        document.getElementById('auth-submit-btn').focus();showAuthScreen('로그인 상태를 확인하는 중입니다.');
        if(document.querySelector('#auth-screen [aria-invalid=true]')||document.activeElement.id!=='auth-submit-btn')throw Error('Status notice marked an input invalid');
      },values);
    }
    for(const test of [
      {name:'both blank',values:['',''],target:'auth-email'},
      {name:'missing ID',values:['','synthetic-current'],target:'auth-email'},
      {name:'missing password',values:['synthetic',''],target:'auth-password'},
      {name:'whitespace ID',values:['  ','synthetic-current'],target:'auth-email'},
      {name:'wrong password',code:'auth/wrong-password',message:'Firebase: Error (auth/wrong-password).',target:'auth-password'},
      {name:'invalid credential',code:'auth/invalid-credential',target:'auth-password'},
      {name:'unknown ID',code:'auth/user-not-found',target:'auth-email'},
      {name:'network failure',code:'auth/network-request-failed',target:null},
      {name:'request limit',code:'auth/too-many-requests',target:null},
      {name:'Auth disabled',code:'auth/user-disabled',target:null},
      {name:'profile disabled',message:'현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.',target:null},
      {name:'profile storage failure',code:'permission-denied',target:null},
      {name:'local wrong password',local:true,target:'auth-password'},
      {name:'local disabled',local:true,disabled:true,target:null}
    ]){
      await page.evaluate(test=>{
        loginErrorTest.attempts=0;
        loginPortalUser=test.local?loginErrorTest.original.loginPortalUser:async()=>{loginErrorTest.attempts++;throw Object.assign(Error(test.message||'Synthetic service failure'),{code:test.code})};
        findLocalPortalUser=()=>test.disabled?{id:'synthetic',loginDisabled:true}:null;
        clearAuthError();
      },test);
      const values=test.values||['synthetic','synthetic-current'];
      await page.locator('#auth-email').fill(values[0]);await page.locator('#auth-password').fill(values[1]);
      await page.locator('#auth-submit-btn').click();
      await page.waitForFunction(()=>document.getElementById('auth-error').textContent!==''&&!document.getElementById('auth-submit-btn').disabled);
      const observed=await page.evaluate(()=>({focused:document.activeElement.id,invalid:[...document.querySelectorAll('#auth-screen [aria-invalid=true]')].map(node=>node.id),message:document.getElementById('auth-error').textContent,attempts:loginErrorTest.attempts,writes:loginErrorTest.writes}));
      check(observed.focused===(test.target||'auth-submit-btn')&&JSON.stringify(observed.invalid)===JSON.stringify(test.target?[test.target]:[]),test.name+': incorrect login error target');
      check(observed.attempts===(test.values||test.local?0:1)&&observed.writes===0,test.name+': crossed login/write boundary');
      if(test.values)check(observed.message==='아이디와 비밀번호를 입력해 주세요.','Preserve required input guidance');
      if(test.name==='wrong password'||test.name==='local wrong password')check(observed.message==='아이디 또는 비밀번호가 올바르지 않습니다.','Preserve wrong credential guidance');
      await page.evaluate(()=>{loginPortalUser=async()=>{loginErrorTest.attempts++}});
      await page.locator('#auth-email').fill('synthetic');await page.locator('#auth-password').fill('synthetic-current');
      await page.locator('#auth-submit-btn').click();
      await page.waitForFunction(()=>document.getElementById('auth-password').value===''&&document.getElementById('auth-error').textContent===''&&!document.getElementById('auth-submit-btn').disabled);
      check(await page.evaluate(()=>!document.querySelector('#auth-screen [aria-invalid=true]')&&document.activeElement.id==='auth-submit-btn'&&loginErrorTest.writes===0),test.name+': stale error or unusable retry');
      login.push({name:test.name,...observed,retryCleared:true});
    }
  }finally{
    await page.evaluate(()=>{
      const original=loginErrorTest.original;Storage.prototype.setItem=original.setItem;loginPortalUser=original.loginPortalUser;findLocalPortalUser=original.findLocalPortalUser;
      portalState.firebaseEnabled=original.enabled;portalState.currentUser=original.currentUser;portalState.currentProfile=original.currentProfile;
      delete window.loginErrorTest;clearAuthFields();clearAuthError();showPortalScreen();
    });
  }
  return {drawer,password,login,mode:'current local app; synthetic state; production API routes blocked; no Auth or data writes'};
}
