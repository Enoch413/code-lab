// Offline preparation only. No Firebase SDK, credentials, HTTP, writes or delete commands.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync, mkdirSync, mkdtempSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import { isDeepStrictEqual } from 'node:util'
import { execFileSync } from 'node:child_process'

export const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const key = row => row.collection + '/' + row.id
const id = value => typeof value === 'string' && value.trim() === value && value.length > 0 && !/[\/\\\x00-\x1f]/.test(value) && !['.','..'].includes(value)
const publicSlotKeys = new Set(['id','requestId','userId','classId','classIds','requestedAt','startAt','endAt','status','updatedAt','createdAt','releasedAt','releaseReason','canceledAt'])

export function materialProblems(row) {
  const d = row.data || {}, p = d.payload || {}, problems = []
  if(d.accessSchemaVersion !== 1 || !Array.isArray(d.classIds) || d.classIds.length !== 1 || !id(d.classIds[0])) problems.push('single-class-contract')
  if(!['class','personal'].includes(d.assignmentMode) || !Array.isArray(d.targetUserIds) || d.targetUserIds.some(uid=>!id(uid)) || new Set(d.targetUserIds).size !== d.targetUserIds.length || (d.assignmentMode === 'class' ? d.targetUserIds.length !== 0 : d.targetUserIds.length === 0)) problems.push('assignment-contract')
  if(JSON.stringify(p.classIds) !== JSON.stringify(d.classIds) || p.assignmentMode !== d.assignmentMode || JSON.stringify(p.targetUserIds) !== JSON.stringify(d.targetUserIds) || p.id !== row.id) problems.push('root-payload-mismatch')
  if(p.classAssignments !== undefined && (!Array.isArray(p.classAssignments) || p.classAssignments.some(a=>a?.classId !== d.classIds?.[0]))) problems.push('mixed-class-payload')
  if(row.collection === 'portalPrepSets') {
    const passageCount=Array.isArray(p.passages)?p.passages.length:0
    if(!passageCount) problems.push('missing-passages')
    const assignments=p.classAssignments
    if(!Array.isArray(assignments) || assignments.length !== 1 || !Array.isArray(assignments[0]?.passageIndexes) || !assignments[0].passageIndexes.length || assignments[0].passageIndexes.some(index=>!Number.isInteger(index) || index < 0 || index >= passageCount) || new Set(assignments[0].passageIndexes).size !== assignments[0].passageIndexes.length) problems.push('invalid-passage-assignment')
    for(const passage of Array.isArray(p.passages) ? p.passages : []) {
      if(!passage || typeof passage !== 'object') { problems.push('invalid-passage'); continue }
      const video=passage.video && typeof passage.video === 'object'?passage.video:{}
      const paths=[passage.videoStoragePath,video.storagePath].filter(value=>value !== undefined && value !== null && value !== '')
      if(paths.some(storage=>typeof storage !== 'string' || !storage.startsWith('prep-videos/'+d.classIds?.[0]+'/'+row.id+'/') || !storage.split('/').every(id)) || new Set(paths).size > 1) problems.push('storage-path-mapping')
      const urls=[video.url,video.src,video.fileUrl,video.embedUrl,video.iframeUrl,passage.videoUrl,passage.videoSrc,passage.videoFileUrl,passage.videoFile,passage.videoLink,passage.videoEmbedUrl,passage.videoIframeUrl]
      const protectedVideo=passage.videoRequiresAuth === true || urls.some(value=>{
        try {const url=new URL(value);return url.protocol === 'gs:' || ['firebasestorage.googleapis.com','storage.googleapis.com'].includes(url.hostname)} catch {return false}
      })
      if(protectedVideo && !paths.length) problems.push('storage-path-required')
    }
  } else if(!Array.isArray(p.questions)) problems.push('missing-questions')
  return [...new Set(problems)]
}

export function prepareLegacyPlan(source, review) {
  assert.ok(Array.isArray(source.documents) && Array.isArray(review.replacements), 'documents/replacements arrays required')
  const originals = new Map()
  for(const row of source.documents) {
    assert.ok(id(row.collection) && id(row.id) && row.data && typeof row.data === 'object', 'Invalid source identity')
    assert.ok(!originals.has(key(row)), 'Duplicate source identity')
    originals.set(key(row),row)
  }
  const writes = [], targets = new Set()
  for(const item of review.replacements) {
    const original = originals.get(item.source)
    assert.ok(original && digest(original.data) === item.sourceHash, 'Missing source or stale source hash')
    const row = item.document
    assert.ok(row && id(row.id) && ['portalPrepSets','portalCheckSets','counselSlots','checkResponses'].includes(row.collection), 'Unsupported candidate')
    assert.ok(['portalContent',row.collection].includes(original.collection), 'Cross-collection source forbidden')
    assert.ok(!targets.has(key(row)), 'Duplicate target')
    targets.add(key(row))
    const existing = originals.get(key(row))
    assert.ok(!existing || key(existing) === item.source, 'Target collision; explicit merge review required')
    if(row.collection === 'portalPrepSets' || row.collection === 'portalCheckSets') {
      assert.ok(materialProblems(row).length === 0, 'Candidate must satisfy reviewed contract and Storage mapping')
      for(const uid of row.data.targetUserIds) {
        const profile = originals.get('users/'+uid)?.data
        assert.ok(profile && (!profile.role || profile.role === 'student') && (!Object.hasOwn(profile,'loginDisabled') || profile.loginDisabled === false) && Array.isArray(profile.classIds) && profile.classIds.includes(row.data.classIds[0]), 'Personal target needs a matching active Auth-UID profile snapshot')
      }
    } else if(row.collection === 'counselSlots') {
      const expected = Object.fromEntries(Object.entries(original.data).filter(([name])=>publicSlotKeys.has(name)))
      assert.ok(isDeepStrictEqual(row.data, expected), 'Slot conversion may only remove private fields; never change ownership or reservation')
      assert.ok(row.id === original.id, 'Slot identity cannot change')
    } else {
      assert.ok(isDeepStrictEqual(row.data, original.data), 'Response remap must preserve all answers and ownership')
      assert.ok(id(row.data.userId) && id(row.data.checkSetId))
      assert.ok(row.id === row.data.userId+'__'+row.data.checkSetId, 'Canonical response ID required')
    }
    writes.push({source:item.source,target:key(row),expectedSourceHash:item.sourceHash,expectedTargetHash:existing?digest(existing.data):null,data:row.data})
  }
  const inventory = source.documents.filter(row=>['portalPrepSets','portalCheckSets','counselSlots','checkResponses','portalContent'].includes(row.collection)).map(row=>({key:key(row),hash:digest(row.data),problems:row.collection.startsWith('portal') && row.collection !== 'portalContent' ? materialProblems(row) : row.collection === 'portalContent' ? ['aggregate-requires-manual-split'] : row.collection === 'counselSlots' ? Object.keys(row.data).some(name=>!publicSlotKeys.has(name))?['private-slot-fields']:[] : row.id !== row.data.userId+'__'+row.data.checkSetId?['noncanonical-response-id']:[]}))
  return {offlineOnly:true,productionVerified:false,deletes:[],writes,rollback:source.documents.filter(row=>writes.some(write=>write.source === key(row) || write.target === key(row))),inventory,unmapped:inventory.filter(row=>row.problems.length && !writes.some(write=>write.source === row.key)).length}
}

if(process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    assert.equal(process.argv.length,4,'Usage: node tools/prepare-legacy-rollout.mjs PRIVATE_EXPORT.json REVIEWED_REPLACEMENTS.json')
    const source=JSON.parse(readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,''))
    const review=JSON.parse(readFileSync(process.argv[3],'utf8').replace(/^\uFEFF/,''))
    const plan=prepareLegacyPlan(source,review)
    const local=fileURLToPath(new URL('../.local/',import.meta.url));mkdirSync(local,{recursive:true})
    const output=mkdtempSync(path.join(local,'legacy-plan-'))
    if(process.platform === 'win32') {
      const sid=execFileSync('whoami.exe',['/user','/fo','csv','/nh'],{encoding:'utf8'}).match(/S-1-[\d-]+/)?.[0]
      assert.ok(sid, 'Cannot determine current Windows identity')
      execFileSync('icacls.exe',[output,'/inheritance:r','/grant:r','*'+sid+':(OI)(CI)F','*S-1-5-18:(OI)(CI)F','*S-1-5-32-544:(OI)(CI)F'],{stdio:'pipe'})
    }
    writeFileSync(path.join(output,'source.json'),JSON.stringify(source,null,2),{mode:0o600})
    writeFileSync(path.join(output,'plan.json'),JSON.stringify(plan,null,2),{mode:0o600})
    console.log(JSON.stringify({output,documents:plan.inventory.length,candidateWrites:plan.writes.length,unmapped:plan.unmapped,productionAccess:false,applied:false}))
  } catch(error) {
    console.error(error instanceof assert.AssertionError ? error.message.split('\n')[0] : 'Legacy preparation failed: check private JSON input and filesystem access. No changes applied.')
    process.exitCode=1
  }
}
