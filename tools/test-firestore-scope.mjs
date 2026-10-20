// Audit evidence only. All data and identities are synthetic, on a loopback demo emulator.
import assert from 'node:assert/strict'
const project = 'demo-codelab-reaudit'
const base = `http://127.0.0.1:8786/v1/projects/${project}/databases/(default)/documents`
assert.equal(new URL(base).hostname, '127.0.0.1')
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8786', 'Start through the demo emulator runner; production is forbidden')
const results = []
function token(uid) {
  const now = Math.floor(Date.now()/1000)
  return [{alg:'none',typ:'JWT'}, {iss:`https://securetoken.google.com/${project}`,aud:project,sub:uid,user_id:uid,iat:now,exp:now+3600,firebase:{sign_in_provider:'custom'}}].map(v=>Buffer.from(JSON.stringify(v)).toString('base64url')).join('.')+'.'
}
function enc(v) {
  if (Array.isArray(v)) return {arrayValue:{values:v.map(enc)}}
  if (typeof v === 'boolean') return {booleanValue:v}
  if (typeof v === 'number') return {integerValue:String(v)}
  if (v && typeof v === 'object') return {mapValue:{fields:fields(v)}}
  return {stringValue:String(v)}
}
const fields = data => Object.fromEntries(Object.entries(data).map(([k,v])=>[k,enc(v)]))
async function req(path, uid, data, method) {
  return fetch(base+'/'+path, {method:method || (data?'PATCH':'GET'), headers:{'Content-Type':'application/json',Authorization:uid==='owner'?'Bearer owner':'Bearer '+token(uid)}, ...(data?{body:JSON.stringify({fields:fields(data)})}:{})})
}
async function check(id, response, expected, group='resolved') {
  const status = response.status
  await response.text()
  assert.equal(status, expected, `${id}: HTTP ${status}, expected ${expected}`)
  results.push({id,group,status})
}
async function query(uid, collection, classIds) {
  return fetch(base+':runQuery', {method:'POST', headers:{'Content-Type':'application/json',Authorization:'Bearer '+token(uid)},body:JSON.stringify({structuredQuery:{from:[{collectionId:collection}],...(classIds?{where:{fieldFilter:{field:{fieldPath:'classIds'},op:'ARRAY_CONTAINS_ANY',value:enc(classIds)}}}:{})}})})
}
async function filteredQuery(uid, collection, clauses) {
  const filters=clauses.map(([fieldPath,op,value])=>({fieldFilter:{field:{fieldPath},op,value:enc(value)}}))
  const structuredQuery={from:[{collectionId:collection}],where:filters.length===1?filters[0]:{compositeFilter:{op:'AND',filters}}}
  return fetch(base+':runQuery',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token(uid)},body:JSON.stringify({structuredQuery})})
}
async function commit(uid, documents) {
  return fetch(base+':commit',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token(uid)},body:JSON.stringify({writes:documents.map(([path,data])=>({update:{name:`projects/${project}/databases/(default)/documents/${path}`,fields:fields(data)}}))})})
}
const profiles = {
  full:{role:'admin',adminScope:'all',classIds:[]},
  teachA:{role:'admin',adminScope:'assigned',classIds:['a']},
  teachB:{role:'admin',adminScope:'assigned',classIds:['b']},
  alice:{role:'student',classIds:['a'],passwordResetRequired:true,updatedAt:'before'},
  bob:{role:'student',classIds:['b']},
  inactive:{role:'student',classIds:['a'],loginDisabled:true},
  unassigned:{role:'student',classIds:[]}
}
for (const [uid,data] of Object.entries(profiles)) assert.equal((await req('users/'+uid,'owner',data)).status,200)
await check('self-admin-create-blocked',await req('users/intruder','intruder',{role:'admin',classIds:[],adminScope:'all'}),403)
for(const [field,value] of Object.entries({classIds:['a'],adminScope:'all',grammarAccessMode:'all',grammarObjectPaths:['synthetic/path'],uid:'bob'})) {
  const uid='forge-'+field
  await check('create-'+field+'-blocked',await req('users/'+uid,uid,{role:'student',classIds:[],[field]:value}),403)
}
await check('safe-first-profile-allowed',await req('users/new','new',{role:'student',classIds:[],uid:'new'}),200)
await check('self-role-update-blocked',await req('users/alice','alice',{...profiles.alice,role:'admin'}),403)
await check('added-field-blocked',await req('users/alice','alice',{...profiles.alice,grammarAccessMode:'all'}),403)
const withoutRole={...profiles.alice}; delete withoutRole.role
await check('removed-field-blocked',await req('users/alice','alice',withoutRole),403)
await check('password-flags-allowed',await req('users/alice','alice',{...profiles.alice,passwordResetRequired:false,updatedAt:'after'}),200)
await check('limited-self-promotion-blocked',await req('users/teachA','teachA',{...profiles.teachA,adminScope:'all'}),403)
await check('limited-profile-write-blocked',await req('users/bob','teachA',{...profiles.bob,name:'synthetic edit'}),403)
await check('assigned-profile-read-allowed',await req('users/alice','teachA'),200)
await check('other-profile-read-blocked',await req('users/bob','teachA'),403)
await check('unscoped-user-query-blocked',await query('teachA','users'),403)
await check('assigned-user-query-allowed',await query('teachA','users',['a']),200)
await check('full-user-query-allowed',await query('full','users'),200)
await check('full-admin-assigned-profile-create-allowed',await req('users/by-admin','full',{role:'student',classIds:['a']}),200)
await req('questionIssues/bobs-issue','owner',{userId:'bob',classIds:['b'],id:'synthetic'})
await check('issue-owner-takeover-blocked',await req('questionIssues/bobs-issue','alice',{userId:'alice',classIds:['a']}),403)
await check('issue-own-update-allowed',await req('questionIssues/bobs-issue','bob',{userId:'bob',classIds:['b'],text:'synthetic'}),200)
for (const suffix of ['Prefs','Students','Sessions','StudentStates','ExamSets','ExamItems','Works']) {
  const col='pdfLabStudentRetry'+suffix
  const own=suffix==='Prefs'?'teachA':'teacha__mine'
  const foreign=suffix==='Prefs'?'teachB':'teachb__foreign'
  await check(suffix+'-own-create',await req(col+'/'+own,'teachA',{ownerUid:'teachA'}),200)
  await check(suffix+'-own-read',await req(col+'/'+own,'teachA'),200)
  await check(suffix+'-other-read-blocked',await req(col+'/'+own,'teachB'),403)
  await check(suffix+'-owner-change-blocked',await req(col+'/'+own,'teachA',{ownerUid:'teachB'}),403)
  await check(suffix+'-foreign-id-blocked',await req(col+'/'+foreign,'teachA',{ownerUid:'teachA'}),403)
}
// Cross-class, disabled and unassigned access must fail closed.
await req('checkResponses/bob__set','owner',{userId:'bob',classIds:['b'],answers:[]})
await req('portalCheckSets/b-set','owner',{classIds:['b'],targetUserIds:['bob']})
await req('counselRequests/bob__req','owner',{userId:'bob',classIds:['b']})
await req('grammarVideoProgress/bob__part','owner',{userId:'bob',classIds:['b']})
await check('limited-teacher-other-check-read',await req('checkResponses/bob__set','teachA'),403,'scope')
await check('limited-teacher-other-check-delete',await req('checkResponses/bob__set','teachA',null,'DELETE'),403,'scope')
await check('limited-teacher-other-counsel-read',await req('counselRequests/bob__req','teachA'),403,'scope')
await check('limited-teacher-other-grammar-progress-read',await req('grammarVideoProgress/bob__part','teachA'),403,'scope')
await check('student-unassigned-content-read',await req('portalCheckSets/b-set','unassigned'),403,'scope')
await check('inactive-content-read',await req('portalCheckSets/b-set','inactive'),403,'scope')
await check('inactive-own-question-write',await req('questionIssues/inactive-issue','inactive',{userId:'inactive'}),403,'scope')
await check('limited-teacher-grammar-grant-denied',await req('users/alice','teachA',{...profiles.alice,grammarAccessMode:'all'}),403,'ui-contract')


for(const col of ['checkResponses','prepVideoProgress','grammarVideoProgress','counselRequests','questionIssues']) {
  await req(col+'/alice__own','owner',{userId:'alice',classIds:['a']})
  await req(col+'/bob__other','owner',{userId:'bob',classIds:['b']})
  await check(col+'-own-read',await req(col+'/alice__own','alice'),200)
  await check(col+'-other-student-denied',await req(col+'/bob__other','alice'),403)
  await check(col+'-assigned-teacher-read',await req(col+'/alice__own','teachA'),200)
  await check(col+'-teacher-other-read-denied',await req(col+'/bob__other','teachA'),403)
  await check(col+'-unscoped-teacher-query-denied',await query('teachA',col),403)
  await check(col+'-teacher-scoped-query',await query('teachA',col,['a']),200)
  await check(col+'-disabled-create',await req(col+'/inactive__own','inactive',{userId:'inactive',classIds:['a']}),403)
  await check(col+'-ownership-steal-denied',await req(col+'/bob__other','alice',{userId:'alice',classIds:['a']}),403)
  await check(col+'-class-forgery-denied',await req(col+'/alice__own','alice',{userId:'alice',classIds:['b']}),403)
  await check(col+'-owner-query',await filteredQuery('alice',col,[['userId','EQUAL','alice']]),200)
}
for(const col of ['portalPrepSets','portalCheckSets']) {
  await req(col+'/a-class','owner',{accessSchemaVersion:1,classIds:['a'],assignmentMode:'class',targetUserIds:[]})
  await req(col+'/b-class','owner',{accessSchemaVersion:1,classIds:['b'],assignmentMode:'class',targetUserIds:[]})
  await req(col+'/a-personal','owner',{accessSchemaVersion:1,classIds:['a'],assignmentMode:'personal',targetUserIds:['alice']})
  await req(col+'/b-personal','owner',{accessSchemaVersion:1,classIds:['a'],assignmentMode:'personal',targetUserIds:['bob']})
  await check(col+'-own-class',await req(col+'/a-class','alice'),200)
  await check(col+'-other-class',await req(col+'/b-class','alice'),403)
  await check(col+'-own-personal',await req(col+'/a-personal','alice'),200)
  await check(col+'-peer-personal',await req(col+'/b-personal','alice'),403)
  await check(col+'-teacher-assigned',await req(col+'/a-personal','teachA'),200)
  await check(col+'-teacher-other',await req(col+'/b-class','teachA'),403)
  await check(col+'-teacher-cross-write',await req(col+'/b-class','teachA',{classIds:['b']}),403)
  await check(col+'-unscoped-student-query',await query('alice',col),403)
  await check(col+'-teacher-query',await filteredQuery('teachA',col,[['classIds','ARRAY_CONTAINS_ANY',['a']],['accessSchemaVersion','EQUAL',1]]),200)
  await check(col+'-student-class-query',await filteredQuery('alice',col,[['classIds','ARRAY_CONTAINS_ANY',['a']],['assignmentMode','EQUAL','class'],['accessSchemaVersion','EQUAL',1]]),200)
  await check(col+'-student-uid-query',await filteredQuery('alice',col,[['targetUserIds','ARRAY_CONTAINS','alice'],['accessSchemaVersion','EQUAL',1]]),200)
  await check(col+'-student-unrestricted-class-query-denied',await query('alice',col,['a']),403)
}
for(const col of ['portalPrepSets','portalCheckSets']) {
  await req(col+'/legacy-mixed','owner',{classIds:['a','b'],targetUserIds:['alice'],assignmentMode:'personal'})
  await check(col+'-legacy-mixed-student-denied',await req(col+'/legacy-mixed','alice'),403)
  await check(col+'-legacy-mixed-teacher-denied',await req(col+'/legacy-mixed','teachA'),403)
  await check(col+'-legacy-mixed-full-readable',await req(col+'/legacy-mixed','full'),200)
  await check(col+'-mixed-new-material-denied',await req(col+'/new-mixed','full',{accessSchemaVersion:1,classIds:['a','b'],targetUserIds:[],assignmentMode:'class'}),403)
  const legacy={classIds:['a'],targetUserIds:[],assignmentMode:'class'}
  await req(col+'/legacy-one','owner',legacy)
  await check(col+'-unreviewed-single-class-denied',await req(col+'/legacy-one','teachA'),403)
  await check(col+'-limited-promotion-denied',await req(col+'/legacy-one','teachA',{...legacy,accessSchemaVersion:1}),403)
  await check(col+'-limited-legacy-delete-denied',await req(col+'/legacy-one','teachA',null,'DELETE'),403)
  await check(col+'-synthetic-full-review-allowed',await req(col+'/legacy-one','full',{...legacy,accessSchemaVersion:1}),200)
  await check(col+'-reviewed-class-visible',await req(col+'/legacy-one','teachA'),200)
}
await req('portalContent/check-data','owner',{payload:{synthetic:true}})
await check('legacy-full-only',await req('portalContent/check-data','full'),200)
await check('legacy-teacher-denied',await req('portalContent/check-data','teachA'),403)
await check('legacy-student-denied',await req('portalContent/check-data','alice'),403)
await check('disabled-self-profile-readable',await req('users/inactive','inactive'),200)
await req('users/inactiveAdmin','owner',{role:'admin',adminScope:'all',classIds:['a'],loginDisabled:true})
await check('disabled-full-admin-denied',await query('inactiveAdmin','users'),403)
await check('disabled-self-password-write-denied',await req('users/inactive','inactive',{...profiles.inactive,passwordResetRequired:false,updatedAt:'now'}),403)
await check('atomic-request-and-slot',await commit('alice',[
  ['counselRequests/alice__booking',{userId:'alice',classIds:['a'],status:'open',slotId:'slot-first'}],
  ['counselSlots/slot-first',{requestId:'alice__booking',userId:'alice',classIds:['a'],status:'open'}]
]),200)
await check('atomic-move-request-and-slots',await commit('alice',[
  ['counselRequests/alice__booking',{userId:'alice',classIds:['a'],status:'open',slotId:'slot-second'}],
  ['counselSlots/slot-first',{requestId:'alice__booking',userId:'alice',classIds:['a'],status:'canceled'}],
  ['counselSlots/slot-second',{requestId:'alice__booking',userId:'alice',classIds:['a'],status:'open'}]
]),200)
await check('atomic-cross-owner-rejected',await commit('alice',[
  ['counselRequests/alice__must-not-exist',{userId:'alice',classIds:['a'],status:'open'}],
  ['checkResponses/bob__other',{userId:'alice',classIds:['a']}]
]),403)
await check('failed-commit-wrote-nothing',await req('counselRequests/alice__must-not-exist','owner'),404)
// Unsafe legacy occupancy stays private; status changes must not add or expose new fields.
const unsafeSlot={requestId:'bob__legacy',userId:'bob',classIds:['b'],status:'open',completedBy:'Synthetic private author'}
await req('counselSlots/legacy-private','owner',unsafeSlot)
await check('legacy-slot-other-class-fields-denied',await req('counselSlots/legacy-private','alice'),403)
await check('legacy-slot-other-teacher-denied',await req('counselSlots/legacy-private','teachA'),403)
await check('legacy-slot-owner-readable',await req('counselSlots/legacy-private','bob'),200)
await check('legacy-slot-assigned-teacher-readable',await req('counselSlots/legacy-private','teachB'),200)
await check('legacy-slot-full-admin-readable',await req('counselSlots/legacy-private','full'),200)
await check('legacy-slot-status-update-allowed',await req('counselSlots/legacy-private','teachB',{...unsafeSlot,status:'completed',updatedAt:'now'}),200)
await check('legacy-slot-add-field-denied',await req('counselSlots/legacy-private','bob',{...unsafeSlot,email:'synthetic@example.invalid'}),403)
await check('new-slot-private-field-denied',await req('counselSlots/unsafe-new','alice',{requestId:'alice__new',userId:'alice',classIds:['a'],status:'open',name:'Synthetic private name'}),403)
await check('safe-slot-other-class-readable',await req('counselSlots/slot-second','bob'),200)
await check('missing-slot-readable-for-reservation',await req('counselSlots/not-booked','alice'),404)
for(const [col,field,value] of [['grammarVideoProgress','userId','alice'],['prepVideoProgress','setId','synthetic-set'],['checkResponses','checkSetId','synthetic-set']]){
  await req(col+'/specific','owner',{userId:'alice',classIds:['a'],[field]:value})
  await check(col+'-specific-teacher-query',await filteredQuery('teachA',col,[['classIds','ARRAY_CONTAINS_ANY',['a']],[field,'EQUAL',value]]),200)
  await check(col+'-specific-cross-class-query-denied',await filteredQuery('teachB',col,[['classIds','ARRAY_CONTAINS_ANY',['a']],[field,'EQUAL',value]]),403)
}
// Practice scores are self-reported, not server-certified grades; document that boundary explicitly.
await check('practice-client-grading-fields-are-not-server-verified',await req('checkResponses/alice__practice-boundary','alice',{
  userId:'alice',classIds:['a'],checkSetId:'practice-boundary',
  answers:[{questionId:'q1',userAnswer:'1',isCorrect:true}],summary:{total:1,correct:999,wrong:0}
}),200,'practice-trust-boundary')
console.log(JSON.stringify({passed:results.length, productionAccess:false}))
