import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import vm from 'node:vm'

const root = new URL('../', import.meta.url)
const portal = readFileSync(new URL('rotation_portal.js', root), 'utf8')
const prep = readFileSync(new URL('rotation_prep_ui.js', root), 'utf8')
const source = readFileSync(new URL('rotation_portal_enhancements.js', root), 'utf8')
function definition(text, name){
  const matches = [...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)]
  const match = matches.filter(entry => entry[1] === name).at(-1)
  assert.ok(match, name)
  return match[0]
}
const payloads = [
  'normal-id', 0, '', "O'Reilly", '\\', '\r\n\u2028\u2029', '\0\t\f\b\u007f',
  'audit"><img src="data:,x" onerror="window.auditXss=1">',
  "&#39;);window.auditXss=1;//", '&quot; onmouseover="window.auditXss=1',
  "\\');window.auditXss=1;//", '</script><script>window.auditXss=1</script>'
]
for(const [text, name] of [[portal,'escapeJs'],[prep,'escapePrepInlineJsValue']]){
  const ctx = vm.createContext({})
  vm.runInContext(definition(text, name), ctx)
  for(const payload of payloads){
    const encoded = ctx[name](payload)
    assert.equal(/["'<>&\r\n\u2028\u2029]/.test(encoded), false, `${name} must protect HTML and JS contexts`)
    assert.equal(vm.runInNewContext("'" + encoded + "'"), String(payload))
  }
}

const forged = { id:'real-document-id', data:()=>({id:'forged-data-id',userId:'synthetic-user'}) }
const ctx = vm.createContext({
  portalState:{firebaseEnabled:true,currentUser:{uid:'synthetic-user'},db:{collection:()=>({get:async()=>({docs:[forged]}),where(){return this}})}},
  normalizeCounselRequestRecord:value=>value,
  getCurrentCounselUserId:()=> 'synthetic-user',
  PORTAL_COUNSEL_REQUEST_COLLECTION:'counselRequests'
})
for(const name of ['fetchMyQuestionIssues','fetchAllQuestionIssues','fetchMyCounselRequests','fetchAllCounselRequests']){
  vm.runInContext(definition(source, name), ctx)
  const rows = await ctx[name]({id:'synthetic-set'})
  assert.equal(rows[0].id,'real-document-id',name)
}

const template = readFileSync(new URL('tools/firebase_bulk_users_template.csv',root),'utf8').trim().split(/\r?\n/)
assert.equal(template.length,1,'Publish only an empty import template')
const ignored = execFileSync('git',['check-ignore','--no-index','--stdin'],{
  cwd:root, input:'tools/students_import.csv\nbackups/example.txt\n.local/example.txt\nprivate/example.txt\n',encoding:'utf8'
}).trim().split(/\r?\n/)
assert.equal(ignored.length,4,'Private data must be ignored by the repository')
assert.ok(!source.includes('SUPERADMIN_DEFAULT_PASSWORD'),'No shared initial password')
assert.ok(!portal.includes('테스트 계정:'),'No published preview credentials')
assert.ok(prep.includes('escapePrepInlineJsValue(section.id)'),'Study actions must use the inline JS encoder')
const preview = vm.createContext({readLocalUsers:()=>[]})
vm.runInContext(definition(portal,'ensureLocalPreviewUsers'),preview)
assert.equal(preview.ensureLocalPreviewUsers().users.length,0,'Do not seed shared local accounts')

// Auth credentials must stay out of Firestore profiles and exports.
const temporary = 'synthetic-only-' + 'x'.repeat(16)
let authCalls=0, profileWrites=0, signedOut=0, deleted=0
ctx.window={firebase:true,ROTATION_FIREBASE_CONFIG:{}}
ctx.firebase={initializeApp:()=>({
  auth:()=>({createUserWithEmailAndPassword:async(email,password)=>{
    assert.equal(password,temporary);authCalls++;return {user:{uid:'new-synthetic-user'}}
  },signOut:async()=>{signedOut++}}),
  firestore:()=>{throw new Error('Must use administrator DB')},
  delete:async()=>{deleted++}
})}
ctx.portalState.db={collection:()=>({doc:uid=>({set:async data=>{
  assert.equal(uid,'new-synthetic-user')
  assert.ok(!('password' in data) && !('initialPassword' in data))
  assert.equal(data.passwordResetRequired,true);profileWrites++
}})})}
vm.runInContext(definition(source,'createPortalStudentProfileByAdmin'),ctx)
await assert.rejects(ctx.createPortalStudentProfileByAdmin({email:'synthetic@example.invalid'}))
await assert.rejects(ctx.createPortalStudentProfileByAdmin({},'short'))
assert.equal(authCalls,0)
await ctx.createPortalStudentProfileByAdmin({email:'synthetic@example.invalid',role:'student',classIds:['a'],passwordResetRequired:true},temporary)
assert.deepEqual([authCalls,profileWrites,signedOut,deleted],[1,1,1,1])

const examState={studentRows:[
  {loginId:'existing',name:'Existing synthetic',status:'active',classId:'a'},
  {loginId:'new',name:'New synthetic',status:'active',classId:'a',initialPassword:temporary}
]}
ctx.prepClasses=[{id:'a',name:'Synthetic class'}]
ctx.normalizePortalPrepClassList=value=>value
ctx.derivePortalLoginId=value=>value.loginId || ''
ctx.toPortalLoginEmail=value=>value+'@example.invalid'
ctx.sanitizeId=value=>value
ctx.normalizePortalRosterStatus=value=>value || 'active'
ctx.isPortalSuperAdmin=()=>true
ctx.ensurePortalExamCenterState=()=>examState
ctx.window.confirm=()=>true
ctx.fetchAllPortalUsersForSuperAdmin=async()=>[{uid:'existing-uid',loginId:'existing',email:'existing@example.invalid',role:'student'}]
ctx.buildPortalUserLookup=value=>value
ctx.resolvePortalUserFromLookup=(users,row)=>users.find(user=>user.loginId===row.loginId)
ctx.fetchOrCreateUserProfile=async user=>{
  assert.equal(user.uid,'synthetic-user');return {role:'admin',adminScope:'all'}
}
ctx.updatePortalUserCard=()=>{}
let updates=0
ctx.persistPortalUserProfileUpdate=async(uid,data)=>{
  assert.equal(uid,'existing-uid');assert.ok(!('password' in data) && !('initialPassword' in data));updates++
}
vm.runInContext(definition(source,'normalizeSuperAdminStudentRows'),ctx)
vm.runInContext(definition(source,'applySuperAdminStudentRows'),ctx)
const applied=await ctx.applySuperAdminStudentRows()
assert.deepEqual([applied.createdCount,applied.updatedCount,updates,authCalls],[1,1,1,2])
assert.ok(examState.studentRows.every(row=>!('initialPassword' in row)))
examState.studentRows=[{loginId:'new2',name:'Synthetic',classId:'a',initialPassword:''}]
await assert.rejects(ctx.applySuperAdminStudentRows())
assert.deepEqual([updates,authCalls],[1,2],'Invalid new credentials must stop before all writes')
console.log('Security boundaries: inline values, document IDs and private-file exclusions: OK')
