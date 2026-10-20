// Real pinned SDK and actual app function; synthetic accounts on loopback demo emulators only.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
assert.equal(process.argv.length,2);
assert.equal(process.env.FIRESTORE_EMULATOR_HOST,'127.0.0.1:8786');
assert.equal(process.env.FIREBASE_AUTH_EMULATOR_HOST,'127.0.0.1:9098');
const root=path.resolve(__dirname,'..'),sdk=process.env.CODELAB_FIREBASE_TEST_SDK||path.join(root,'.local/firebase-sdk');
const resolve=name=>require.resolve(name,{paths:[sdk]});
const firebase=require(resolve('firebase/compat/app'));require(resolve('firebase/compat/auth'));require(resolve('firebase/compat/firestore'));
assert.equal(firebase.SDK_VERSION,'10.12.5');firebase.setLogLevel('silent');
const project='demo-codelab-reaudit',config={projectId:project,apiKey:'emulator-only'},apps=new Set(),databases=new Map();
let stage='setup';const checks=[];
const timer=setTimeout(()=>{console.error('SDK integration deadline at:',stage);process.exit(2)},45000);
function connect(name){
  const app=firebase.initializeApp(config,name);apps.add(app);
  app.auth().useEmulator('http://127.0.0.1:9098',{disableWarnings:true});return app;
}
function database(app){
  if(!databases.has(app)){const db=app.firestore();db.useEmulator('127.0.0.1',8786);databases.set(app,db);}
  return databases.get(app);
}
function secondary(settings,name){
  assert.equal(settings.projectId,project);
  // Match production: the secondary app uses Auth only; unused Firestore can hang SDK deletion.
  const app=connect(name);
  return {auth:()=>app.auth(),delete:async()=>{await app.delete();apps.delete(app);}};
}
function wire(db,{set,get}={}){
  return {collection:name=>({doc:id=>{
    const ref=db.collection(name).doc(id);
    return {set:async(data,options)=>{const plain=structuredClone(data);if(set)return set(ref,plain,options);return ref.set(plain,options);},
      get:options=>get?get(ref,options):ref.get(options)};
  }})};
}
async function check(label,fn){stage=label;await fn();checks.push(label);}
const password=crypto.randomBytes(24).toString('base64url');
const record=email=>({email,loginId:'synthetic',name:'Synthetic',role:'student',classIds:['a'],passwordResetRequired:true,createdAt:'fixture'});
async function seedAdmin(uid){
  const response=await fetch(`http://127.0.0.1:8786/v1/projects/${project}/databases/(default)/documents/users/${uid}`,{method:'PATCH',headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:JSON.stringify({fields:{role:{stringValue:'admin'},adminScope:{stringValue:'all'},classIds:{arrayValue:{values:[]}}}})});
  assert.equal(response.status,200);await response.text();
}
(async()=>{
  const admin=connect('sdk-integration-admin');stage='admin-auth';
  const credential=await admin.auth().createUserWithEmailAndPassword('sdk-admin@example.invalid',password);
  await seedAdmin(credential.user.uid);const db=database(admin);
  const source=fs.readFileSync(path.join(root,'rotation_portal_enhancements.js'),'utf8');
  const fn=source.match(/^async function createPortalStudentProfileByAdmin\([^]*?^}/m);assert.ok(fn);
  const context=vm.createContext({window:{firebase:true,ROTATION_FIREBASE_CONFIG:config},firebase:{initializeApp:secondary},portalState:{firebaseEnabled:true,currentUser:credential.user,db:wire(db)}});
  vm.runInContext(fn[0],context);
  const create=value=>context.createPortalStudentProfileByAdmin(value,password);
  let studentUid;
  await check('Auth creation, administrator profile save and session preservation',async()=>{
    studentUid=(await create(record('sdk-student@example.invalid'))).uid;
    const profile=(await db.collection('users').doc(studentUid).get({source:'server'})).data();
    assert.equal(profile.uid,studentUid);assert.deepEqual(profile.classIds,['a']);assert.ok(!('password' in profile));assert.equal(admin.auth().currentUser.uid,credential.user.uid);
    assert.equal(apps.size,1,'Secondary Auth-only app must finish deletion');
  });
  await check('actual email/password login and student profile read',async()=>{
    const app=connect('sdk-student-login');await app.auth().signInWithEmailAndPassword('sdk-student@example.invalid',password);
    assert.equal(app.auth().currentUser.uid,studentUid);
    assert.equal((await database(app).collection('users').doc(studentUid).get({source:'server'})).data().role,'student');
  });
  await check('failed profile save rolls back only the newly created Auth account',async()=>{
    context.portalState.db=wire(db,{set:async()=>{throw Error('injected-before-write');}});
    await assert.rejects(create(record('sdk-retry@example.invalid')),e=>e.code==='portal/student-profile-create-rolled-back');
    const app=connect('sdk-absence-check');
    await assert.rejects(app.auth().signInWithEmailAndPassword('sdk-retry@example.invalid',password),e=>['auth/user-not-found','auth/invalid-credential','auth/invalid-login-credentials'].includes(e.code));
  });
  await check('same-email retry after compensation saves one complete profile',async()=>{
    context.portalState.db=wire(db);const result=await create(record('sdk-retry@example.invalid'));
    assert.equal((await db.collection('users').doc(result.uid).get({source:'server'})).data().uid,result.uid);
    assert.equal(admin.auth().currentUser.uid,credential.user.uid);
  });
  await check('lost save acknowledgement preserves committed Auth and profile',async()=>{
    context.portalState.db=wire(db,{set:async(ref,data,options)=>{await ref.set(data,options);throw Error('injected-lost-ack');}});
    const result=await create(record('sdk-committed@example.invalid'));
    assert.equal((await db.collection('users').doc(result.uid).get({source:'server'})).exists,true);
  });
  await check('uncertain server read requests recovery without deleting the account',async()=>{
    context.portalState.db=wire(db,{set:async()=>{throw Error('injected-write');},get:async()=>{throw Error('injected-read');}});
    await assert.rejects(create(record('sdk-uncertain@example.invalid')),e=>e.code==='portal/student-profile-recovery-required');
    const app=connect('sdk-uncertain-check');await app.auth().signInWithEmailAndPassword('sdk-uncertain@example.invalid',password);
    assert.ok(app.auth().currentUser.uid);
  });
  await check('SDK writes and transaction round trip',async()=>{
    const ref=db.collection('checkResponses').doc(credential.user.uid+'__sdk');
    await db.runTransaction(async tx=>{await tx.get(ref);tx.set(ref,{userId:credential.user.uid,classIds:['a'],checkSetId:'sdk',answers:[{questionId:'q1',isCorrect:false}]});});
    assert.equal((await ref.get({source:'server'})).data().answers[0].isCorrect,false);
  });
  stage='cleanup';
})().catch(e=>{console.error('SDK integration failed:',stage,e.code||e.name);process.exitCode=1;}).finally(async()=>{
  try{
    for(const db of databases.values())await db.terminate();
    for(const app of apps)await app.delete();
    if(!process.exitCode)console.log(JSON.stringify({authSdkPassed:checks.length,sdk:firebase.SDK_VERSION,secondaryFirestoreInitialized:false,productionAccess:false}));
  }catch(e){console.error('SDK cleanup failed:',e.code||e.name);process.exitCode=1;}
  clearTimeout(timer);
});
