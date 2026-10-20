import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const source=readFileSync(new URL('../rotation_portal_enhancements.js',import.meta.url),'utf8')
const definitions=new Map([...source.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(match=>[match[1],match[0]]))
const password='synthetic-only-temporary'
const record={email:'synthetic@example.invalid',loginId:'synthetic',name:'Synthetic',studentId:'synthetic',role:'student',classIds:['a'],passwordResetRequired:true,createdAt:'synthetic-date'}

function fixture(){
  const accounts=new Map(),profiles=new Map(),events=[]
  const options={write:'fail',read:'server',remove:'success',signOut:'success',appDelete:'success',displayName:'success'}
  const admin=Object.freeze({uid:'synthetic-admin'})
  let serial=0
  const db={collection(name){
    assert.equal(name,'users')
    return {doc(uid){return {
      async set(data){
        events.push(['profile-write',uid])
        assert.equal(data.uid,uid);assert.equal(data.role,'student')
        assert.ok(!('password' in data)&&!('initialPassword' in data))
        if(options.write==='success'||options.write==='lost-ack')profiles.set(uid,structuredClone(data))
        if(options.write!=='success')throw Error('synthetic profile failure')
      },
      async get(settings){
        assert.equal(settings.source,'server','Never use cache as proof that a profile is absent')
        events.push(['profile-read',uid])
        if(options.read==='fail')throw Error('synthetic server read failure')
        if(options.read==='conflict')profiles.set(uid,{uid,role:'student',classIds:['other'],name:'Existing synthetic profile'})
        return {exists:profiles.has(uid),data:()=>profiles.get(uid),metadata:{fromCache:options.read==='cache',hasPendingWrites:options.read==='pending'}}
      }
    }}}
  }}
  const context=vm.createContext({
    window:{firebase:true,ROTATION_FIREBASE_CONFIG:{}},
    portalState:{firebaseEnabled:true,db,currentUser:admin,auth:{signOut(){throw Error('Administrator session must stay signed in')}}},
    firebase:{initializeApp(){
      const auth={
        async createUserWithEmailAndPassword(email,initial){
          assert.equal(initial,password)
          if(accounts.has(email))throw Object.assign(Error('synthetic existing Auth account'),{code:'auth/email-already-in-use'})
          const user={uid:'synthetic-student-'+(++serial),
            async updateProfile(){if(options.displayName==='fail')throw Error('synthetic display name failure')},
            async delete(){
              events.push(['account-delete',user.uid])
              assert.equal(accounts.get(email),user,'Delete only the Auth user returned by this creation')
              if(options.remove==='fail')throw Error('synthetic account delete failure')
              accounts.delete(email)
            }
          }
          accounts.set(email,user);events.push(['account-create',user.uid]);return {user}
        },
        async signOut(){events.push(['secondary-signout']);if(options.signOut==='fail')throw Error('synthetic signout failure')}
      }
      return {auth:()=>auth,firestore(){throw Error('Must use administrator DB')},async delete(){events.push(['app-delete']);if(options.appDelete==='fail')throw Error('synthetic app cleanup failure')}}
    }}
  })
  vm.runInContext(definitions.get('createPortalStudentProfileByAdmin'),context)
  return {context,options,accounts,profiles,events,admin,create:(row=record)=>context.createPortalStudentProfileByAdmin(row,password)}
}

// Definite failed write: remove only the newly created Auth account, then retry normally.
const failed=fixture()
await assert.rejects(failed.create(),error=>error.code==='portal/student-profile-create-rolled-back')
assert.equal(failed.accounts.size,0,'A failed profile write must not leave an orphan Auth account')
assert.equal(failed.profiles.size,0)
assert.deepEqual(failed.events.map(event=>event[0]),['account-create','profile-write','profile-read','account-delete','secondary-signout','app-delete'])
failed.options.write='success'
const retried=await failed.create()
assert.equal(failed.accounts.size,1);assert.equal(failed.profiles.size,1)
assert.equal(failed.accounts.get(record.email).uid,retried.uid)
assert.equal(failed.context.portalState.currentUser,failed.admin)

// A committed profile with a lost response is success, not a reason to delete its account.
const committed=fixture();committed.options.write='lost-ack'
const recovered=await committed.create()
assert.equal(committed.profiles.get(recovered.uid).email,record.email)
assert.equal(committed.events.filter(event=>event[0]==='account-delete').length,0)
assert.equal(committed.events.filter(event=>event[0]==='profile-write').length,1)

// Uncertain or conflicting state must stop with a safe recovery message and UID.
for(const mode of ['fail','cache','pending','conflict']){
  const uncertain=fixture();uncertain.options.read=mode
  await assert.rejects(uncertain.create(),error=>{
    assert.equal(error.code,'portal/student-profile-recovery-required')
    assert.equal(error.uid,'synthetic-student-1')
    assert.ok(error.message.includes(error.uid)&&!error.message.includes(password))
    assert.equal(error.cause,undefined,'Do not attach SDK credential data to a displayed recovery error')
    return true
  })
  assert.equal(uncertain.accounts.size,1)
  assert.equal(uncertain.events.filter(event=>event[0]==='account-delete').length,0)
  if(mode==='conflict')assert.equal(uncertain.profiles.get('synthetic-student-1').name,'Existing synthetic profile')
  assert.deepEqual(uncertain.events.slice(-2).map(event=>event[0]),['secondary-signout','app-delete'])
}

const deleteFailed=fixture();deleteFailed.options.remove='fail'
await assert.rejects(deleteFailed.create(),error=>error.code==='portal/student-profile-recovery-required'&&error.uid==='synthetic-student-1')
assert.equal(deleteFailed.accounts.size,1)
await assert.rejects(deleteFailed.create(),error=>error.code==='auth/email-already-in-use')
assert.equal(deleteFailed.events.filter(event=>event[0]==='account-delete').length,1,'Retry must never delete a pre-existing account')

const existing=fixture();const existingUser={uid:'existing-synthetic'};existing.accounts.set(record.email,existingUser)
await assert.rejects(existing.create(),error=>error.code==='auth/email-already-in-use')
assert.equal(existing.accounts.get(record.email),existingUser)
assert.equal(existing.events.filter(event=>event[0]==='profile-write'||event[0]==='account-delete').length,0)

for(const cleanup of ['signOut','appDelete','displayName']){
  const successful=fixture();successful.options.write='success';successful.options[cleanup]='fail'
  const result=await successful.create()
  assert.ok(successful.profiles.has(result.uid),'Cleanup/display-name failures must not turn a completed creation into a failed import')
  assert.deepEqual(successful.events.slice(-2).map(event=>event[0]),['secondary-signout','app-delete'])
  assert.equal(successful.context.portalState.currentUser,successful.admin)
}

const failedCleanup=fixture();failedCleanup.options.signOut='fail';failedCleanup.options.appDelete='fail'
await assert.rejects(failedCleanup.create(),error=>error.code==='portal/student-profile-create-rolled-back')
assert.equal(failedCleanup.accounts.size,0)
assert.deepEqual(failedCleanup.events.slice(-2).map(event=>event[0]),['secondary-signout','app-delete'])

// One batch row succeeds and the next fails; retry updates the first profile without resetting Auth.
const batch=fixture();const state={studentRows:[
  {...record,classId:'a',status:'active',initialPassword:password},
  {...record,email:'second@example.invalid',loginId:'second',classId:'a',status:'active',initialPassword:password}
]}
const ctx=batch.context
Object.assign(ctx,{
  prepClasses:[{id:'a',name:'Synthetic class'}],isPortalSuperAdmin:()=>true,
  ensurePortalExamCenterState:()=>state,normalizePortalPrepClassList:rows=>rows,
  derivePortalLoginId:row=>row.loginId||'',toPortalLoginEmail:id=>id+'@example.invalid',
  sanitizeId:value=>value,normalizePortalRosterStatus:value=>value||'active',
  fetchAllPortalUsersForSuperAdmin:async()=>Array.from(batch.profiles.values()),
  buildPortalUserLookup:rows=>rows,resolvePortalUserFromLookup:(rows,row)=>rows.find(user=>user.loginId===row.loginId),
  persistPortalUserProfileUpdate:async(uid,data)=>{assert.equal(uid,'synthetic-student-1');batch.profiles.set(uid,{...batch.profiles.get(uid),...data})},
  fetchOrCreateUserProfile:async user=>{assert.equal(user,batch.admin);return {role:'admin',adminScope:'all'}},updatePortalUserCard:()=>{}
})
ctx.window.confirm=()=>true
vm.runInContext(definitions.get('normalizeSuperAdminStudentRows')+'\n'+definitions.get('applySuperAdminStudentRows'),ctx)
batch.options.write='success'
const create=ctx.createPortalStudentProfileByAdmin
ctx.createPortalStudentProfileByAdmin=async(row,initial)=>{batch.options.write=row.loginId==='second'?'fail':'success';return create(row,initial)}
await assert.rejects(ctx.applySuperAdminStudentRows())
assert.equal(batch.accounts.size,1);assert.equal(batch.profiles.size,1)
const first=batch.accounts.get(record.email)
batch.options.write='success';ctx.createPortalStudentProfileByAdmin=create
const applied=await ctx.applySuperAdminStudentRows()
assert.deepEqual([applied.createdCount,applied.updatedCount,batch.accounts.size,batch.profiles.size],[1,1,2,2])
assert.equal(batch.accounts.get(record.email),first,'Keep the first successful account and password on retry')
assert.ok(state.studentRows.every(row=>!('initialPassword' in row)))
assert.equal(ctx.portalState.currentUser,batch.admin)
console.log('Student creation recovery: rollback/retry, committed response loss, safe recovery stops, cleanup and partial batch retry: OK')
