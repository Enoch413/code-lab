// node tools/reset-exam-cycle.mjs --backup | --apply <backup-directory> | --verify <backup-directory> | --self-test
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { createHash, randomUUID } from 'node:crypto'
import { homedir } from 'node:os'
import { dirname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const project = 'code-lab-2584c'
const bucket = project + '.firebasestorage.app'
const workspace = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = 'https://firestore.googleapis.com/v1/projects/' + project + '/databases/(default)/documents'
const resourceRoot = 'projects/' + project + '/databases/(default)/documents/'
const targets = [
  'checkResponses', 'questionIssues', 'counselRequests', 'counselSlots', 'prepVideoProgress',
  'portalPrepSets', 'portalCheckSets', 'pdfLabSharedLibraryImports', 'pdfLabSharedLibraryProblems',
  'pdfLabStudentRetryPrefs', 'pdfLabStudentRetryStudents', 'pdfLabStudentRetrySessions',
  'pdfLabStudentRetryStudentStates', 'pdfLabStudentRetryExamSets', 'pdfLabStudentRetryExamItems', 'pdfLabStudentRetryWorks'
]
const preserved = ['users', 'grammarVideoProgress']
const contentIds = ['prep-session', 'check-data', 'prep-classes', 'exam-state']
const canDeleteObject = name => ['pdf-lab/shared-library/', 'prep-videos/'].some(prefix => name.startsWith(prefix)) && !name.split('/').some(part => part === '.' || part === '..')
const hash = value => createHash('sha256').update(value).digest('hex')
const stable = value => value && typeof value === 'object'
  ? Array.isArray(value) ? value.map(stable) : Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
  : value
const equalData = (a, b, message) => assert.equal(JSON.stringify(stable(a)), JSON.stringify(stable(b)), message)
function decode(value){
  if(value.mapValue) return Object.fromEntries(Object.entries(value.mapValue.fields || {}).map(([k, v]) => [k, decode(v)]))
  if(value.arrayValue) return (value.arrayValue.values || []).map(decode)
  if('integerValue' in value){
    const number = Number(value.integerValue)
    assert.ok(Number.isSafeInteger(number), 'Unsafe integer in portalContent')
    return number
  }
  for(const key of ['stringValue', 'booleanValue', 'integerValue', 'doubleValue', 'timestampValue', 'nullValue']) if(key in value) return value[key]
  throw new Error('Unsupported value in portalContent')
}
function encode(value){
  if(value === null) return { nullValue: null }
  if(Array.isArray(value)) return { arrayValue: { values: value.map(encode) } }
  if(typeof value === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([k, v]) => [k, encode(v)])) } }
  if(typeof value === 'boolean') return { booleanValue: value }
  if(typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }
  return { stringValue: value }
}
function contentPayloads(snapshot, now){
  const previous = Object.fromEntries(Object.entries(snapshot.content).map(([id, doc]) => [id, decode(doc.fields.payload)]))
  const catalog = previous['prep-classes']
  assert.ok(catalog.classes?.length, 'Keep the class catalog')
  const config = { ...catalog.prepConfig, generatedAt: now, examKey: snapshot.nextExamKey }
  return {
    'prep-session': { ...previous['prep-session'], version: 2, savedAt: now, classes: catalog.classes, prepConfig: config, studySets: [] },
    'check-data': { ...previous['check-data'], updatedAt: now, classes: catalog.classes.map(({ id, name }) => ({ id, name })), checkSets: [] },
    'prep-classes': { ...catalog, prepConfig: config },
    'exam-state': {
      ...previous['exam-state'], examName: snapshot.nextExamName, examKey: snapshot.nextExamKey,
      previousExamName: '2026년 2학기 중간고사', previousExamKey: previous['exam-state'].examKey || '',
      lastArchiveAt: snapshot.createdAt, lastArchiveExamName: '2026년 2학기 중간고사',
      lastArchiveBy: 'codex-exam-reset', lastArchiveByName: 'Codex 백업',
      lastResetAt: now, lastResetBy: 'codex-exam-reset', lastResetByName: 'Codex 초기화',
      pdfLabResetToken: snapshot.pdfLabResetToken, updatedAt: now
    }
  }
}

if(process.argv.includes('--self-test')){
  assert.ok(!targets.includes('users') && !targets.includes('grammarVideoProgress'))
  for(const name of ['pdf-lab/shared-library/a/segment.webp', 'prep-videos/class-a/video.mp4']) assert.ok(canDeleteObject(name))
  for(const name of ['videos/grammar/a.mp4', 'materials/grammar/a.pdf', 'pdf-lab/', 'pdf-lab/shared-library/../a']) assert.ok(!canDeleteObject(name))
  const sample = { classes: [{ id: 'class-a', name: '반', password: 'kept', sortOrder: 2 }], prepConfig: { pageTitle: 'CODE LAB' } }
  const snapshot = { content: Object.fromEntries(contentIds.map(id => [id, { fields: { payload: encode(sample) } }])), nextExamKey: 'new', nextExamName: '기말고사', createdAt: 'now', pdfLabResetToken: 'new-token' }
  const payloads = contentPayloads(snapshot, 'now')
  equalData(payloads['prep-classes'].classes, sample.classes)
  assert.deepEqual(payloads['prep-session'].studySets, [])
  assert.deepEqual(payloads['check-data'].checkSets, [])
  assert.equal(payloads['exam-state'].examKey, 'new')
  equalData(decode(encode(sample)), sample)
  equalData(encode(decode({ integerValue: '2' })), { integerValue: '2' })
  equalData(decode({ arrayValue: {} }), decode({ arrayValue: { values: [] } }))
  console.log('Reset scope, payload, and preservation checks: OK')
  process.exitCode = 0
}else{
  assert.ok(['--backup', '--apply', '--verify'].some(mode => process.argv.includes(mode)), 'Choose --backup, --apply/--verify <directory>, or --self-test')
  const session = JSON.parse(readFileSync(join(homedir(), '.config/configstore/firebase-tools.json'), 'utf8'))
  const headers = { Authorization: 'Bearer ' + session.tokens.access_token, 'Content-Type': 'application/json' }
  async function api(url, body, method = body ? 'POST' : 'GET'){
    const response = await fetch(url, { method, headers, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(45000) })
    if(response.status === 204) return null
    const result = await response.json()
    assert.ok(response.ok, result.error?.message || 'HTTP ' + response.status)
    return result
  }
  async function documents(collection){
    const docs = []
    let token
    do{
      const result = await api(base + '/' + collection + '?pageSize=300' + (token ? '&pageToken=' + encodeURIComponent(token) : ''))
      docs.push(...(result.documents || []))
      token = result.nextPageToken
    }while(token)
    return docs.sort((a, b) => a.name.localeCompare(b.name))
  }
  async function objects(){
    const rows = []
    let token
    do{
      const result = await api('https://storage.googleapis.com/storage/v1/b/' + bucket + '/o?maxResults=1000&fields=nextPageToken,items(name,size,generation,md5Hash,contentType,crc32c)' + (token ? '&pageToken=' + encodeURIComponent(token) : ''))
      rows.push(...(result.items || []))
      token = result.nextPageToken
    }while(token)
    return rows.sort((a, b) => a.name.localeCompare(b.name))
  }
  async function authUsers(){
    const users = []
    let token
    do{
      const result = await api('https://identitytoolkit.googleapis.com/v1/projects/' + project + '/accounts:batchGet?maxResults=1000' + (token ? '&nextPageToken=' + encodeURIComponent(token) : ''))
      users.push(...(result.users || []).map(user => ({ uid: user.localId, email: user.email || '', name: user.displayName || '', disabled: !!user.disabled, passwordUpdatedAt: user.passwordUpdatedAt || 0 })))
      token = result.nextPageToken
    }while(token)
    return users.sort((a, b) => a.uid.localeCompare(b.uid))
  }
  async function parallel(items, action){
    let next = 0, done = 0, failure
    await Promise.all(Array.from({ length: Math.min(12, items.length) }, async () => {
      while(next < items.length && !failure){
        const index = next++
        try{
          await action(items[index], index)
          done++
          if(done % 500 === 0 || done === items.length) console.log('Storage: ' + done + '/' + items.length)
        }catch(error){ failure = error }
      }
    }))
    if(failure) throw failure
  }
  const documentSignature = rows => rows.map(doc => ({ name: doc.name, updateTime: doc.updateTime }))
  const storageSignature = rows => rows.map(({ name, size, generation, md5Hash }) => ({ name, size, generation, md5Hash }))
  function checkedDirectory(directory){
    const absolute = resolve(directory)
    assert.ok(absolute.startsWith(resolve(workspace, 'backups') + sep), 'Backup must be inside this workspace backups directory')
    return absolute
  }
  if(process.argv.includes('--backup')){
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..*/, '').replace('T', '-')
    const directory = checkedDirectory(join(workspace, 'backups', 'exam-reset-20261015-' + stamp + '-' + randomUUID().slice(0, 6)))
    mkdirSync(join(directory, 'storage'), { recursive: true })
    const snapshot = {
      project, bucket, createdAt: new Date().toISOString(),
      nextExamName: '2026년 2학기 기말고사', nextExamKey: 'exam-2026-2-final-20261015-' + Date.now(),
      pdfLabResetToken: 'pdf-lab-reset-' + Date.now() + '-' + randomUUID().slice(0, 6),
      collections: {}, content: {}, preserved: {}, authUsers: await authUsers(), storage: [], preservedStorage: []
    }
    const collectionIds = await api(base + ':listCollectionIds', { pageSize: 1000 })
    assert.ok(!collectionIds.nextPageToken)
    for(const id of collectionIds.collectionIds || []) assert.ok([...targets, ...preserved, 'portalContent'].includes(id), 'Review unknown collection: ' + id)
    for(const collection of targets){
      snapshot.collections[collection] = await documents(collection)
      console.log('Backed up ' + collection + ': ' + snapshot.collections[collection].length)
    }
    for(const collection of preserved) snapshot.preserved[collection] = await documents(collection)
    const content = await documents('portalContent')
    assert.deepEqual(content.map(doc => doc.name.split('/').at(-1)).sort(), [...contentIds].sort())
    for(const doc of content) snapshot.content[doc.name.split('/').at(-1)] = doc
    const allObjects = await objects()
    for(const object of allObjects){
      if(canDeleteObject(object.name)) snapshot.storage.push(object)
      else{
        assert.ok(object.name.startsWith('videos/grammar/') || object.name.startsWith('materials/grammar/'), 'Review unknown object: ' + object.name)
        snapshot.preservedStorage.push(object)
      }
    }
    for(const [index, object] of snapshot.storage.entries()) object.backupFile = 'storage/' + String(index).padStart(6, '0') + '.bin'
    writeFileSync(join(directory, 'snapshot.json'), JSON.stringify(snapshot), { flag: 'wx' })
    console.log('Backing up ' + snapshot.storage.length + ' files / ' + snapshot.storage.reduce((n, o) => n + Number(o.size), 0) + ' bytes')
    await parallel(snapshot.storage, async object => {
      const url = 'https://storage.googleapis.com/download/storage/v1/b/' + bucket + '/o/' + encodeURIComponent(object.name) + '?alt=media&generation=' + object.generation
      const response = await fetch(url, { headers, signal: AbortSignal.timeout(45000) })
      assert.ok(response.ok, 'Download HTTP ' + response.status + ': ' + object.name)
      const data = Buffer.from(await response.arrayBuffer())
      assert.equal(data.length, Number(object.size), object.name)
      assert.equal(createHash('md5').update(data).digest('base64'), object.md5Hash, object.name)
      writeFileSync(join(directory, object.backupFile), data, { flag: 'wx' })
    })
    writeFileSync(join(directory, 'backup-complete.json'), JSON.stringify({ completedAt: new Date().toISOString(), snapshotSha256: hash(readFileSync(join(directory, 'snapshot.json'))), fileCount: snapshot.storage.length }), { flag: 'wx' })
    console.log('BACKUP COMPLETE: ' + directory)
  }else{
    const verifyOnly = process.argv.includes('--verify')
    const directory = checkedDirectory(process.argv[process.argv.indexOf(verifyOnly ? '--verify' : '--apply') + 1] || '')
    assert.ok(verifyOnly || !existsSync(join(directory, 'reset-result.json')), 'This reset already completed; do not rerun')
    const bytes = readFileSync(join(directory, 'snapshot.json'))
    const snapshot = JSON.parse(bytes)
    const complete = JSON.parse(readFileSync(join(directory, 'backup-complete.json'), 'utf8'))
    assert.equal(hash(bytes), complete.snapshotSha256, 'Backup manifest changed')
    assert.equal(snapshot.project, project)
    assert.equal(snapshot.bucket, bucket)
    assert.deepEqual(Object.keys(snapshot.collections).sort(), [...targets].sort())
    const counts = Object.fromEntries(Object.entries(snapshot.collections).map(([name, docs]) => [name, docs.length]))
    for(const object of snapshot.storage){
      assert.ok(canDeleteObject(object.name), object.name)
      assert.match(object.backupFile, /^storage\/\d{6}\.bin$/)
      const data = readFileSync(join(directory, object.backupFile))
      assert.equal(data.length, Number(object.size))
      assert.equal(createHash('md5').update(data).digest('base64'), object.md5Hash, object.name)
    }
    if(!verifyOnly){
    for(const [collection, docs] of Object.entries(snapshot.collections)){
      equalData(documentSignature(await documents(collection)), documentSignature(docs), 'Collection changed since backup: ' + collection)
      counts[collection] = docs.length
      for(const doc of docs){
        assert.ok(doc.name.startsWith(resourceRoot + collection + '/') && doc.name.slice(resourceRoot.length).split('/').length === 2, 'Invalid delete target')
        assert.ok(doc.updateTime)
      }
    }
    for(const collection of preserved) equalData(await documents(collection), snapshot.preserved[collection], 'Preserved data changed since backup: ' + collection)
    equalData(await authUsers(), snapshot.authUsers, 'Auth accounts changed since backup')
    equalData(storageSignature(await objects()), storageSignature([...snapshot.storage, ...snapshot.preservedStorage].sort((a, b) => a.name.localeCompare(b.name))), 'Storage changed since backup')
    equalData(await documents('portalContent'), Object.values(snapshot.content).sort((a, b) => a.name.localeCompare(b.name)), 'Portal configuration changed since backup')
    console.log('Preflight passed: checksummed backups, exact targets, unchanged accounts and source data')
    const deleteDocs = Object.values(snapshot.collections).flat()
    for(let start = 0; start < deleteDocs.length; start += 200){
      const group = deleteDocs.slice(start, start + 200)
      await api(base + ':commit', { writes: group.map(doc => ({ delete: doc.name, currentDocument: { updateTime: doc.updateTime } })) })
      console.log('Deleted Firestore: ' + Math.min(start + 200, deleteDocs.length) + '/' + deleteDocs.length)
    }
    await parallel(snapshot.storage, async object => {
      assert.ok(canDeleteObject(object.name))
      await api('https://storage.googleapis.com/storage/v1/b/' + bucket + '/o/' + encodeURIComponent(object.name) + '?ifGenerationMatch=' + object.generation, undefined, 'DELETE')
    })
    const now = new Date().toISOString()
    const payloads = contentPayloads(snapshot, now)
    equalData(payloads['prep-classes'].classes, decode(snapshot.content['prep-classes'].fields.payload).classes)
    await api(base + ':commit', { writes: contentIds.map(id => ({
      update: { name: snapshot.content[id].name, fields: {
        payload: encode(payloads[id]), updatedAt: encode(now), updatedBy: encode('codex-exam-reset'), updatedByName: encode('Codex 초기화')
      } }, updateMask: { fieldPaths: ['payload', 'updatedAt', 'updatedBy', 'updatedByName'] },
      currentDocument: { updateTime: snapshot.content[id].updateTime }
    })) })
    }
    const examDoc = await api(base + '/portalContent/exam-state')
    const examState = decode(examDoc.fields.payload)
    assert.equal(examState.examKey, snapshot.nextExamKey)
    assert.equal(examState.pdfLabResetToken, snapshot.pdfLabResetToken)
    const payloads = contentPayloads(snapshot, examState.lastResetAt)
    const deleteDocs = Object.values(snapshot.collections).flat()
    for(const collection of targets) assert.equal((await documents(collection)).length, 0, 'Not empty: ' + collection)
    for(const collection of preserved) equalData(await documents(collection), snapshot.preserved[collection], 'Preserved data changed: ' + collection)
    equalData(await authUsers(), snapshot.authUsers, 'Auth accounts must be unchanged')
    const remainingObjects = await objects()
    assert.ok(!remainingObjects.some(object => canDeleteObject(object.name)))
    equalData(storageSignature(remainingObjects), storageSignature(snapshot.preservedStorage), 'GRAMMAR files must be unchanged')
    for(const id of contentIds){
      const doc = await api(base + '/portalContent/' + id)
      equalData(decode(doc.fields.payload), payloads[id], 'New exam content: ' + id)
    }
    const result = { completedAt: new Date().toISOString(), project, nextExamName: snapshot.nextExamName, nextExamKey: snapshot.nextExamKey,
      deletedCollections: counts, deletedDocuments: deleteDocs.length, deletedStorageFiles: snapshot.storage.length,
      preservedUsers: snapshot.preserved.users.length, preservedAuthUsers: snapshot.authUsers.length,
      preservedClasses: payloads['prep-classes'].classes.length, preservedGrammarProgress: snapshot.preserved.grammarVideoProgress.length,
      preservedGrammarFiles: remainingObjects.length, backupDirectory: directory }
    if(!existsSync(join(directory, 'reset-result.json'))) writeFileSync(join(directory, 'reset-result.json'), JSON.stringify(result, null, 2), { flag: 'wx' })
    console.log('RESET VERIFIED: ' + JSON.stringify(result))
  }
}
