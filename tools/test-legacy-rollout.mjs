import assert from 'node:assert/strict'
import { digest, prepareLegacyPlan } from './prepare-legacy-rollout.mjs'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
const old={collection:'portalContent',id:'legacy',data:{payload:{mixed:true}}}
const source={documents:[old,{collection:'users',id:'alice',data:{role:'student',classIds:['a']}}]}
const material=(id='new',classId='a')=>({collection:'portalPrepSets',id,data:{accessSchemaVersion:1,classIds:[classId],assignmentMode:'personal',targetUserIds:['alice'],payload:{id,classIds:[classId],assignmentMode:'personal',targetUserIds:['alice'],passages:[{title:'Synthetic'}],classAssignments:[{classId,passageIndexes:[0]}]}}})
const replacement=row=>({source:'portalContent/legacy',sourceHash:digest(old.data),document:row})
const run=(replacements,documents=source.documents)=>prepareLegacyPlan({documents},{replacements})
let checks=0
const rejects=fn=>{assert.throws(fn);checks++}
const plan=run([replacement(material())]);assert.equal(plan.writes.length,1);assert.deepEqual(plan.deletes,[]);assert.equal(plan.rollback[0],old);checks++
assert.equal(run([]).unmapped,1);checks++
rejects(()=>run([{...replacement(material()),sourceHash:'stale'}]))
rejects(()=>run([replacement(material()),replacement(material())]))
rejects(()=>run([replacement(material())],[...source.documents,material()]))
rejects(()=>run([replacement(material('new','b'))]))
for(const mutate of [r=>r.data.classIds.push('b'),r=>r.data.payload.classAssignments[0].classId='b',r=>r.data.payload.targetUserIds=['peer'],r=>r.data.payload.id='forged',r=>r.data.payload.passages=[{videoStoragePath:'prep-videos/a/old/file.mp4'}],r=>r.data.payload.passages=[{videoStoragePath:'prep-videos/a/new/../file.mp4'}],r=>r.data.targetUserIds=['unknown']]) {const row=material();mutate(row);rejects(()=>run([replacement(row)]))}
rejects(()=>run([replacement(material())],[old,{collection:'users',id:'alice',data:{role:'student',classIds:'a'}}]))
for(const indexes of [[99],[-1],['0'],[0.5],[null],[],null,'0',[0,0]]){
  const row=material();row.data.payload.classAssignments[0].passageIndexes=indexes;rejects(()=>run([replacement(row)]))
}
for(const assignments of [undefined,null,[],[null],[{classId:'a',passageIndexes:[0]},{classId:'a',passageIndexes:[0]}]]){
  const row=material();row.data.payload.classAssignments=assignments;rejects(()=>run([replacement(row)]))
}
for(const passages of [[],null]){const row=material();row.data.payload.passages=passages;rejects(()=>run([replacement(row)]))}
const valid=material();valid.data.payload.passages.push({title:'Synthetic second'});valid.data.payload.classAssignments[0].passageIndexes=[0,1]
const before=JSON.stringify(valid);assert.equal(run([replacement(valid)]).writes.length,1);assert.equal(JSON.stringify(valid),before);checks++
const urls=['https://firebasestorage.googleapis.com/v0/b/demo-bucket/o/prep-videos%2Fa%2Fold%2Ffile.mp4?alt=media&token=synthetic','https://storage.googleapis.com/demo-bucket/prep-videos/a/old/file.mp4','gs://demo-bucket/prep-videos/a/old/file.mp4']
for(const url of urls)for(const nested of [false,true]){
  const row=material();row.data.payload.passages[0]=nested?{video:{url}}:{videoUrl:url};rejects(()=>run([replacement(row)]))
}
for(const passage of [{videoRequiresAuth:true},{videoEmbedUrl:urls[0]},{videoIframeUrl:urls[0]},{videoSrc:urls[0]},{videoFileUrl:urls[0]},{videoFile:urls[0]},{videoLink:urls[0]},{video:{src:urls[0]}},{video:{fileUrl:urls[0]}},{video:{embedUrl:urls[0]}},{video:{iframeUrl:urls[0]}}]){
  const row=material();row.data.payload.passages[0]=passage;rejects(()=>run([replacement(row)]))
}
for(const passage of [{videoUrl:'https://www.youtube.com/watch?v=synthetic01'},{videoUrl:'https://example.invalid/video.mp4'},{videoStoragePath:'prep-videos/a/new/file.mp4'},{video:{storagePath:'prep-videos/a/new/file.mp4'}},{videoStoragePath:'prep-videos/a/new/file.mp4',video:{storagePath:'prep-videos/a/new/file.mp4'}},{videoUrl:urls[0],videoStoragePath:'prep-videos/a/new/file.mp4'}]){
  const row=material();row.data.payload.passages[0]=passage;assert.equal(run([replacement(row)]).writes.length,1);checks++
}
const conflicting=material();conflicting.data.payload.passages[0]={videoStoragePath:'prep-videos/a/new/file.mp4',video:{storagePath:'prep-videos/a/old/file.mp4'}};rejects(()=>run([replacement(conflicting)]))
const slot={collection:'counselSlots',id:'slot',data:{userId:'alice',status:'reserved',name:'PRIVATE'}}
assert.equal(prepareLegacyPlan({documents:[slot]},{replacements:[{source:'counselSlots/slot',sourceHash:digest(slot.data),document:{...slot,data:{userId:'alice',status:'reserved'}}}]}).writes.length,1);checks++
rejects(()=>prepareLegacyPlan({documents:[slot]},{replacements:[{source:'counselSlots/slot',sourceHash:digest(slot.data),document:{...slot,data:{userId:'other',status:'reserved'}}}]}))
const response={collection:'checkResponses',id:'old',data:{userId:'alice',checkSetId:'set',answers:[{questionId:'q',isCorrect:false}]}}
assert.equal(prepareLegacyPlan({documents:[response]},{replacements:[{source:'checkResponses/old',sourceHash:digest(response.data),document:{...response,id:'alice__set'}}]}).writes.length,1);checks++
rejects(()=>prepareLegacyPlan({documents:[response]},{replacements:[{source:'checkResponses/old',sourceHash:digest(response.data),document:{...response,id:'peer__set'}}]}))
const temp=mkdtempSync(path.join(tmpdir(),'codelab-legacy-test-'))
try {
  const privateInput=path.join(temp,'source.json'),reviewInput=path.join(temp,'review.json')
  writeFileSync(privateInput,'{"invalid":"PRIVATE_SENTINEL_PASSWORD", broken')
  writeFileSync(reviewInput,'{"replacements":[]}')
  let result=spawnSync(process.execPath,[fileURLToPath(new URL('./prepare-legacy-rollout.mjs',import.meta.url)),privateInput,reviewInput],{encoding:'utf8'})
  assert.equal(result.status,1);assert.ok(!(result.stdout+result.stderr).includes('PRIVATE_SENTINEL_PASSWORD'));checks++
  const invalidSlot={...slot,data:{...slot.data,password:'PRIVATE_SENTINEL_PASSWORD'}}
  writeFileSync(privateInput,JSON.stringify({documents:[invalidSlot]}))
  writeFileSync(reviewInput,JSON.stringify({replacements:[{source:'counselSlots/slot',sourceHash:digest(invalidSlot.data),document:invalidSlot}]}))
  result=spawnSync(process.execPath,[fileURLToPath(new URL('./prepare-legacy-rollout.mjs',import.meta.url)),privateInput,reviewInput],{encoding:'utf8'})
  assert.equal(result.status,1);assert.ok(!(result.stdout+result.stderr).includes('PRIVATE_SENTINEL_PASSWORD'));checks++
} finally {
  assert.ok(path.resolve(temp).startsWith(path.resolve(tmpdir())+path.sep+'codelab-legacy-test-'))
  rmSync(temp,{recursive:true})
}
console.log(JSON.stringify({legacyPlanChecks:checks,productionAccess:false}))
