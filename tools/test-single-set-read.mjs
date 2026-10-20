import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const text=readFileSync(new URL('../rotation_portal_enhancements.js',import.meta.url),'utf8')
const defs=new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const fixture={docId:'forged',classIds:['a'],accessSchemaVersion:1,assignmentMode:'class',payload:{id:'synthetic',classIds:['a'],questions:[]}}
for(const kind of ['prep','check']){
  let calls=0,rest=0,mode='ok',getOptions,requested
  const state={firebaseEnabled:true,userSession:1,currentUser:{uid:'teacher'},currentProfile:{role:'admin',classIds:['a']}}
  state.db={collection:()=>({doc:id=>{requested=id;return {get:async options=>{calls++;getOptions=options
    if(mode==='stale'){state.userSession++;throw Error('old read')}
    if(mode.startsWith('rest'))throw Error('SDK failed')
    return {exists:mode!=='missing',metadata:{fromCache:mode==='cache'},data:()=>fixture}
  }}}})}
  const ctx=vm.createContext({portalState:state,PORTAL_CLOUD_SET_COLLECTIONS:{prep:'portalPrepSets',check:'portalCheckSets'},
    loadCloudSetDocs:async()=>{throw Error('A single document must not read the collection')},isGrammarOnlyStudent:()=>false,
    withPortalReadTimeout:promise=>promise,
    readPortalFirestoreRest:async path=>{rest++;assert.equal(path,'/portal'+(kind==='check'?'Check':'Prep')+'Sets/target')
      if(mode==='rest-error')throw Error('permission-denied')
      if(mode==='rest-missing')return null
      return {name:'projects/demo/databases/(default)/documents/portal'+(kind==='check'?'Check':'Prep')+'Sets/target',fields:fixture}
    },decodePortalFirestoreValue:value=>value.mapValue.fields,readLocalPortalSetDocs:()=>[fixture],console:{warn(){}}})
  for(const name of ['getPortalSetCollection','clonePlainData','derivePortalSetClassIds','normalizePortalSetDoc','getCloudSetDoc'])vm.runInContext(defs.get(name),ctx)
  const record=await ctx.getCloudSetDoc(kind,'target')
  assert.equal(record.docId,'target','The requested Firestore ID overrides payload IDs')
  assert.equal(calls,1);assert.equal(requested,'target');assert.equal(getOptions.source,'server');assert.equal(rest,0)
  mode='missing';assert.equal(await ctx.getCloudSetDoc(kind,'target'),null)
  mode='rest';assert.equal((await ctx.getCloudSetDoc(kind,'target')).docId,'target')
  mode='cache';assert.equal((await ctx.getCloudSetDoc(kind,'target')).docId,'target')
  mode='rest-missing';assert.equal(await ctx.getCloudSetDoc(kind,'target'),null)
  mode='rest-error';await assert.rejects(ctx.getCloudSetDoc(kind,'target'),/permission-denied/)
  const before=calls
  assert.equal(await ctx.getCloudSetDoc(kind,''),null)
  await assert.rejects(ctx.getCloudSetDoc(kind,'../other'),/Invalid/)
  state.currentProfile.loginDisabled=true;await assert.rejects(ctx.getCloudSetDoc(kind,'target'),/disabled/)
  state.currentProfile.loginDisabled=false;state.currentUser=null;await assert.rejects(ctx.getCloudSetDoc(kind,'target'),/Authentication/)
  assert.equal(calls,before)
  state.currentUser={uid:'teacher'};mode='stale';const beforeRest=rest
  await assert.rejects(ctx.getCloudSetDoc(kind,'target'),/changed/);assert.equal(rest,beforeRest,'Stale SDK errors must not retry as the next account')
  state.db=null;await assert.rejects(ctx.getCloudSetDoc(kind,'target'),/unavailable/)
  state.firebaseEnabled=false
  assert.equal((await ctx.getCloudSetDoc(kind,'forged')).payload.id,'synthetic','Local mode retains its existing storage path')
  ctx.readLocalPortalSetDocs=()=>[{docId:'forged',payload:null}]
  assert.equal(await ctx.getCloudSetDoc(kind,'forged'),null,'Malformed local material stays absent')
}
console.log('Single-set reads: one server document, authoritative ID, cache rejection, REST/missing/error, session and local mode: OK')
