import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const root=new URL('../',import.meta.url)
const html=readFileSync(new URL('index.html',root),'utf8')
const css=readFileSync(new URL('rotation_prep.css',root),'utf8')
const source=readFileSync(new URL('rotation_portal_enhancements.js',root),'utf8')
const portal=readFileSync(new URL('rotation_portal.js',root),'utf8')
const definitions=text=>new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
assert.ok(!/user-scalable=no|maximum-scale=1(?:\.0)?[" ,]/.test(html),'Allow browser zoom')
assert.match(html,/<main id="app-main" tabindex="-1">/)
assert.match(html,/class="skip-link" href="#app-main"/)
assert.match(html,/id="toast" role="status" aria-live="polite"/)
assert.match(html,/id="app-drawer"[^>]*\binert\b/)
for(const match of css.matchAll(/font-size:\s*([\d.]+)(rem|px)/g)){
  assert.ok(Number(match[1])*(match[2]==='rem'?16:1)>=12,'Keep functional text readable at the default root size')
}
let screens=0
for(const screen of html.matchAll(/<div class="screen(?: [^"]*)?" id="([^"]+)">([^]*?)(?=<div class="screen(?: |")|<\/main>)/g)){
  let previous=0
  for(const heading of screen[2].matchAll(/<h([1-6])\b/g)){
    const level=Number(heading[1]);assert.ok(level<=previous+1,`${screen[1]} skipped a heading level`);previous=level
  }
  screens++
}
assert.ok(screens>=18)

const tabs=Array.from({length:4},(_,i)=>({disabled:false,classList:{contains:()=>false},focus(){focused=i},click(){clicked=i}}))
let focused=-1,clicked=-1
const list={querySelectorAll:()=>tabs}
tabs.forEach(tab=>tab.closest=()=>list)
const ctx=vm.createContext({window:{matchMedia:()=>({matches:true})}})
const defs=definitions(source)
vm.runInContext(defs.get('movePortalTabFocus')+'\n'+defs.get('portalScrollBehavior'),ctx)
assert.equal(ctx.movePortalTabFocus(tabs[0],'ArrowRight'),true);assert.equal(clicked,1)
ctx.movePortalTabFocus(tabs[0],'ArrowLeft');assert.equal(clicked,3)
ctx.movePortalTabFocus(tabs[1],'Home');assert.equal(clicked,0)
ctx.movePortalTabFocus(tabs[1],'End');assert.equal(clicked,3);assert.equal(focused,3)
tabs[3].disabled=true;ctx.movePortalTabFocus(tabs[2],'ArrowRight');assert.equal(clicked,0)
assert.equal(ctx.movePortalTabFocus(tabs[0],'a'),false)
assert.equal(ctx.portalScrollBehavior(),'auto')
ctx.window.matchMedia=()=>({matches:false});assert.equal(ctx.portalScrollBehavior(),'smooth')

const buttons=['1','2','3'].map(value=>({dataset:{choice:value},classList:{toggle(name,on){this.active=on}},setAttribute(name,value){this[name]=value}}))
ctx.getChoiceAnswerValues=value=>String(value).split(',')
vm.runInContext(definitions(portal).get('applyChoiceGroupSelection'),ctx)
ctx.applyChoiceGroupSelection({querySelectorAll:()=>buttons},'1,3')
assert.deepEqual(buttons.map(button=>button['aria-pressed']),['true','false','true'])

// Exercise both retained password handlers, including the final runtime override.
const valid=['synthetic-current','synthetic-next','synthetic-next']
const cases=[
  {values:['synthetic-current','synthetic-next','synthetic-other'],target:'password-confirm'},
  {values:['synthetic-current','synthetic-current','synthetic-current'],target:'password-next'},
  {values:['','synthetic-next','synthetic-next'],target:'password-current'},
  {values:['synthetic-current','','synthetic-next'],target:'password-next'},
  {values:['synthetic-current','synthetic-next',''],target:'password-confirm'},
  {values:['  ','synthetic-next','synthetic-next'],target:'password-current'},
  {values:['synthetic-current','short','short'],target:'password-next'},
  {name:'wrong-password message',stage:'reauth',message:'auth/wrong-password',target:'password-current'},
  {name:'local authentication failure',local:true,target:'password-current',translated:true},
  {name:'invalid-credential code',stage:'reauth',code:'auth/invalid-credential',target:'password-current',translated:true},
  {name:'wrong-password code',stage:'reauth',code:'auth/wrong-password',target:'password-current',translated:true},
  {name:'invalid-credential message fallback',stage:'reauth',message:'Firebase: Error (auth/invalid-credential).',target:'password-current',translated:true},
  {name:'weak-password code',stage:'update',code:'auth/weak-password',target:'password-next'},
  {name:'recent-login required',stage:'update',code:'auth/requires-recent-login',target:null,translated:true},
  {name:'reauthentication network failure',stage:'reauth',code:'auth/network-request-failed',target:null},
  {name:'password update network failure',stage:'update',code:'auth/network-request-failed',target:null},
  {name:'profile storage failure',stage:'profile',code:'permission-denied',target:null},
  {name:'local storage read failure',local:true,stage:'read',target:null},
  {name:'local storage write failure',local:true,stage:'write',target:null}
]
for(const text of [source,portal]){
  for(const test of cases){
    let passwordFocus='password-confirm',authAttempts=0,passwordWrites=0,profileWrites=0,localWrites=0
    const values=test.values || valid
    const fields=Object.fromEntries(['password-current','password-next','password-confirm'].map((id,i)=>[id,{
      id,value:values[i],attributes:{'aria-invalid':'true'},
      removeAttribute(name){delete this.attributes[name]},
      setAttribute(name,value){this.attributes[name]=value},
      getClientRects:()=>[{}],focus(){passwordFocus=id}
    }]))
    const error={textContent:''}
    const fail=stage=>{if(test.stage===stage)throw Object.assign(Error(test.message || 'Synthetic service failure'),{code:test.code})}
    const localUsers=[{id:'synthetic-user',password:test.stage==='write'?'synthetic-current':'different-synthetic-current'}]
    const passwordContext=vm.createContext({
      document:{getElementById:id=>fields[id] || error},
      portalState:{firebaseEnabled:!test.local,currentUser:{uid:'synthetic-user'},auth:{currentUser:{uid:'synthetic-user',email:'synthetic@example.invalid',
        async reauthenticateWithCredential(){authAttempts++;fail('reauth')},
        async updatePassword(){passwordWrites++;fail('update')}
      }}},
      firebase:{auth:{EmailAuthProvider:{credential:()=>({})}}},
      readLocalUsers(){fail('read');return localUsers},
      writeLocalUsers(){localWrites++;fail('write')},
      async saveFirebaseUserProfile(){profileWrites++;fail('profile')}
    })
    vm.runInContext([
      definitions(portal).get('setPasswordError'),definitions(portal).get('clearPasswordError'),
      definitions(portal).get('getPasswordChangeErrorField'),definitions(portal).get('getPasswordChangeErrorMessage'),
      definitions(text).get('submitPasswordChange')
    ].filter(Boolean).join('\n'),passwordContext)
    await passwordContext.submitPasswordChange()
    const label=test.name || `validation: ${test.target}`
    assert.equal(passwordFocus,test.target || 'password-confirm',`${label}: focus must identify the input error only`)
    assert.deepEqual(Object.values(fields).filter(field=>field.attributes['aria-invalid']==='true').map(field=>field.id),test.target?[test.target]:[],label)
    assert.ok(error.textContent,label)
    if(test.translated)assert.match(error.textContent,/[가-힣]/,`${label}: readable Korean message`)
    if(test.target==='password-current'&&(!test.values||test.stage==='reauth'))assert.equal(error.textContent,'현재 비밀번호가 올바르지 않습니다.',label)
    assert.equal(authAttempts,!test.local&&test.stage?1:0,label)
    assert.equal(passwordWrites,['update','profile'].includes(test.stage)?1:0,label)
    assert.equal(profileWrites,test.stage==='profile'?1:0,label)
    assert.equal(localWrites,test.stage==='write'?1:0,label)
    if(test.local&&!test.stage)assert.equal(localUsers[0].password,'different-synthetic-current','Failed local authentication must not mutate the password')
    passwordContext.clearPasswordError()
    assert.equal(error.textContent,'')
    assert.ok(Object.values(fields).every(field=>!('aria-invalid' in field.attributes)))
  }
}
console.log(`Accessibility contracts: ${screens} screen outlines, typography, tab keyboard, selections, reduced motion and ${cases.length*2} password error cases: OK`)


const loginCases=[
  {name:'network failure',code:'auth/network-request-failed',target:null},
  {name:'both blank',values:['',''],target:'auth-email'},
  {name:'missing ID',values:['','synthetic-current'],target:'auth-email'},
  {name:'missing password',values:['synthetic',''],target:'auth-password'},
  {name:'whitespace ID',values:['  ','synthetic-current'],target:'auth-email'},
  {name:'whitespace password',values:['synthetic','  '],target:'auth-password'},
  {name:'wrong-password code',code:'auth/wrong-password',target:'auth-password'},
  {name:'invalid-credential code',code:'auth/invalid-credential',target:'auth-password'},
  {name:'invalid-login-credentials code',code:'auth/invalid-login-credentials',target:'auth-password'},
  {name:'user-not-found code',code:'auth/user-not-found',target:'auth-email'},
  {name:'invalid-email code',code:'auth/invalid-email',target:'auth-email'},
  {name:'SDK message fallback',message:'Firebase: Error (auth/wrong-password).',target:'auth-password'},
  {name:'rate limit',code:'auth/too-many-requests',target:null},
  {name:'Auth disabled',code:'auth/user-disabled',target:null},
  {name:'profile disabled',message:'현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.',target:null},
  {name:'profile storage failure',code:'permission-denied',target:null},
  {name:'unknown service failure',target:null},
  {name:'network message fallback',message:'Firebase: Error (auth/network-request-failed).',target:null},
  {name:'structured service code takes precedence',code:'permission-denied',message:'Synthetic service error mentioning auth/wrong-password',target:null}
]
const authHandlers=[...portal.matchAll(/^async function submitAuthForm\([^]*?^}\r?$/gm)].map(match=>match[0])
for(const submit of authHandlers){
  for(const test of loginCases){
    let focused='auth-submit-btn',attempts=0,failure=true
    const fields=Object.fromEntries(['auth-email','auth-password'].map((id,i)=>[id,{
      id,value:(test.values||['synthetic','synthetic-current'])[i],attributes:{'aria-invalid':'true'},
      removeAttribute(name){delete this.attributes[name]},setAttribute(name,value){this.attributes[name]=value},
      getClientRects:()=>[{}],focus(){focused=id}
    }]))
    const error={textContent:''},button={disabled:false,textContent:''}
    const context=vm.createContext({
      document:{getElementById:id=>fields[id]||(id==='auth-submit-btn'?button:error)},
      setAuthPasswordVisibility:()=>{},
      async loginPortalUser(){
        attempts++;assert.equal(button.disabled,true,'Disable the button during login')
        if(failure)throw Object.assign(Error(test.message||'Synthetic service failure'),{code:test.code})
      }
    })
    vm.runInContext([
      definitions(portal).get('setAuthError'),definitions(portal).get('clearAuthError'),
      definitions(portal).get('getAuthErrorField'),definitions(source).get('getPortalErrorMessage'),
      definitions(portal).get('setAuthLoading'),definitions(portal).get('clearAuthFields'),submit
    ].filter(Boolean).join('\n'),context)
    await context.submitAuthForm()
    assert.equal(focused,test.target||'auth-submit-btn',test.name+': focus only an invalid input')
    assert.deepEqual(Object.values(fields).filter(field=>field.attributes['aria-invalid']==='true').map(field=>field.id),test.target?[test.target]:[],test.name)
    assert.ok(error.textContent,test.name)
    if(test.values)assert.equal(error.textContent,'아이디와 비밀번호를 입력해 주세요.',test.name)
    if(test.message==='Firebase: Error (auth/wrong-password).')assert.equal(error.textContent,'아이디 또는 비밀번호가 올바르지 않습니다.')
    assert.equal(attempts,test.values?0:1,test.name+': no service call for incomplete input')
    assert.equal(button.disabled,false,test.name+': release loading on failure')
    // The next attempt must clear stale errors and remain usable.
    failure=false;focused='auth-submit-btn'
    fields['auth-email'].value='synthetic';fields['auth-password'].value='synthetic-current'
    await context.submitAuthForm()
    assert.equal(attempts,test.values?1:2)
    assert.equal(button.disabled,false);assert.equal(error.textContent,'')
    assert.equal(fields['auth-password'].value,'')
    assert.ok(Object.values(fields).every(field=>!('aria-invalid' in field.attributes)))
    assert.equal(focused,'auth-submit-btn')
    context.setAuthError('로그인 상태를 확인하는 중입니다.')
    assert.ok(Object.values(fields).every(field=>!('aria-invalid' in field.attributes)),'Status notices are not input errors')
    assert.equal(focused,'auth-submit-btn')
    context.clearAuthError();assert.equal(error.textContent,'')
  }
}
// Exercise real local credential checks, rather than a mocked login service.
for(const [text,disabled] of [[portal,false],[source,false],[source,true]]){
  let focused='auth-submit-btn',writes=0
  const fields=Object.fromEntries(['auth-email','auth-password'].map(id=>[id,{id,value:'synthetic',attributes:{},removeAttribute(name){delete this.attributes[name]},setAttribute(name,value){this.attributes[name]=value},getClientRects:()=>[{}],focus(){focused=id}}]))
  const error={textContent:''}
  const context=vm.createContext({document:{getElementById:id=>fields[id]||error},portalState:{firebaseEnabled:false},findLocalPortalUser:()=>disabled?{id:'synthetic',loginDisabled:true}:null,localStorage:{setItem(){writes++;throw Error('Unexpected persistence')}},PORTAL_STORAGE_KEYS:{currentUserId:'synthetic'}})
  vm.runInContext([definitions(portal).get('setAuthError'),definitions(portal).get('getAuthErrorField'),definitions(source).get('getPortalErrorMessage'),definitions(text).get('loginPortalUser')].filter(Boolean).join('\n'),context)
  let caught
  try{await context.loginPortalUser('synthetic','synthetic-current')}catch(error){caught=error}
  assert.ok(caught)
  context.setAuthError(context.getPortalErrorMessage(caught),context.getAuthErrorField(caught))
  assert.equal(focused,disabled?'auth-submit-btn':'auth-password')
  assert.deepEqual(Object.values(fields).filter(field=>field.attributes['aria-invalid']==='true').map(field=>field.id),disabled?[]:['auth-password'])
  assert.equal(error.textContent,disabled?'현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.':'아이디 또는 비밀번호가 올바르지 않습니다.')
  assert.equal(writes,0,'A failed/disabled local login must not persist an active session')
}
console.log(`Login error regression: ${loginCases.length*authHandlers.length} validation/service cases with successful retries and status clearing, plus 3 actual local credential cases: OK`)
