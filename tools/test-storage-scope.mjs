// Synthetic Firestore profiles and Storage objects only; no real accounts or credentials.
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

const project = 'demo-codelab-reaudit'
assert.equal(process.argv.length, 2, 'No project or command arguments accepted')
assert.equal(process.env.FIRESTORE_EMULATOR_HOST, '127.0.0.1:8786')
assert.equal(process.env.FIREBASE_STORAGE_EMULATOR_HOST, '127.0.0.1:9298')
const documents = `http://127.0.0.1:8786/v1/projects/${project}/databases/(default)/documents`
const objects = `http://127.0.0.1:9298/v0/b/${project}.appspot.com/o`
const results = []

function token(uid, email) {
  const now = Math.floor(Date.now() / 1000)
  return [{ alg: 'none', typ: 'JWT' }, {
    iss: `https://securetoken.google.com/${project}`, aud: project, sub: uid, user_id: uid,
    iat: now, exp: now + 3600, ...(email ? { email } : {}), firebase: { sign_in_provider: 'custom' }
  }].map(value => Buffer.from(JSON.stringify(value)).toString('base64url')).join('.') + '.'
}

function encode(value) {
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encode) } }
  if (typeof value === 'boolean') return { booleanValue: value }
  if (typeof value === 'number') return { integerValue: String(value) }
  return { stringValue: String(value) }
}

async function seedProfile(uid, data) {
  await seedDocument('users/storage-' + uid, data)
}

async function seedDocument(name, data) {
  const response = await fetch(documents + '/' + name, {
    method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: Object.fromEntries(Object.entries(data).map(([key, value]) => [key, encode(value)])) })
  })
  assert.equal(response.status, 200, 'Seed synthetic profile')
  await response.text()
}

const identity = (uid, email) => uid ? { Authorization: uid === 'owner' ? 'Bearer owner' : 'Bearer ' + token('storage-' + uid, email) } : {}
const mediaUrl = name => objects + '/' + encodeURIComponent(name) + '?alt=media'

async function upload(name, uid, contentType, email) {
  return fetch(objects + '?uploadType=media&name=' + encodeURIComponent(name), {
    method: 'POST', headers: { ...identity(uid, email), 'Content-Type': contentType }, body: Buffer.from('synthetic local object')
  })
}

async function check(id, response, expected) {
  const status = response.status
  await response.arrayBuffer()
  results.push({ id, status, expected })
}

const read = (name, uid, email, headers = {}) => fetch(mediaUrl(name), { headers: { ...identity(uid, email), ...headers } })
const remove = (name, uid, email) => fetch(objects + '/' + encodeURIComponent(name), { method: 'DELETE', headers: identity(uid, email) })
const list = (prefix, uid) => fetch(objects + '?prefix=' + encodeURIComponent(prefix), { headers: identity(uid) })
const patchMetadata = (name, uid, metadata) => fetch(objects + '/' + encodeURIComponent(name), {
  method: 'PATCH', headers: { ...identity(uid), 'Content-Type': 'application/json' }, body: JSON.stringify({ metadata })
})
const managerEmail = 'superadmin@prep.local'
const prep = 'prep-videos/a/storage-regression/video.mp4'
const grammar = 'videos/grammar/storage-regression.mp4'
const material = 'materials/grammar/storage-regression.pdf'
const library = 'pdf-lab/shared-library/storage-regression/image.png'
const profiles = {
  full: { role: 'admin', adminScope: 'all', classIds: [] },
  teacher: { role: 'admin', adminScope: 'assigned', classIds: ['a'] },
  otherTeacher: { role: 'admin', adminScope: 'assigned', classIds: ['b'] },
  student: { role: 'student', classIds: ['a'] },
  otherStudent: { role: 'student', classIds: ['b'] },
  peerStudent: { role: 'student', classIds: ['a'] },
  unassigned: { role: 'student', classIds: [] },
  grammarOnly: { role: 'student', classIds: ['class-grammar-only', 'a'], grammarAccessMode: 'all' },
  allGrammar: { role: 'student', classIds: ['a'], grammarAccessMode: 'all' },
  unitGrammar: { role: 'student', classIds: ['a'], grammarAccessMode: 'units', grammarObjectPaths: [grammar, material] },
  otherUnit: { role: 'student', classIds: ['a'], grammarAccessMode: 'units', grammarObjectPaths: ['videos/grammar/other.mp4'] },
  teacherWithGrant: { role: 'admin', adminScope: 'assigned', classIds: ['a'], grammarAccessMode: 'all', grammarObjectPaths: [grammar, material] },
  fullWithGrant: { role: 'admin', adminScope: 'all', classIds: [], grammarAccessMode: 'all' },
  disabledStudent: { role: 'student', classIds: ['a'], loginDisabled: true, grammarAccessMode: 'all' },
  disabledUnit: { role: 'student', classIds: ['a'], loginDisabled: true, grammarAccessMode: 'units', grammarObjectPaths: [grammar, material] },
  disabledAdmin: { role: 'admin', adminScope: 'all', classIds: ['a'], loginDisabled: true },
  malformedDisabled: { role: 'student', classIds: ['a'], loginDisabled: 'false' }
}
for (const [uid, profile] of Object.entries(profiles)) await seedProfile(uid, profile)
const classSet = { accessSchemaVersion: 1, classIds: ['a'], assignmentMode: 'class', targetUserIds: [] }
await seedDocument('portalPrepSets/storage-regression', classSet)
for (const [name, contentType] of [[prep, 'video/mp4'], [grammar, 'video/mp4'], [material, 'application/pdf'], [library, 'image/png']]) {
  await check('seed-' + name.split('/')[0], await upload(name, 'owner', contentType), 200)
}

for (const uid of [null, 'missingProfile', 'otherStudent', 'otherTeacher', 'unassigned', 'grammarOnly', 'disabledStudent', 'disabledAdmin', 'malformedDisabled']) {
  await check('prep-read-denied-' + (uid || 'anonymous'), await read(prep, uid), 403)
}
for (const uid of ['student', 'teacher', 'full']) await check('prep-read-allowed-' + uid, await read(prep, uid), 200)
await check('prep-range-assigned', await read(prep, 'student', undefined, { Range: 'bytes=0-3' }), 206)
await check('prep-range-cross-class-denied', await read(prep, 'otherStudent', undefined, { Range: 'bytes=0-3' }), 403)
await check('prep-exact-class-not-prefix', await read('prep-videos/aa/storage-regression/video.mp4', 'student'), 403)
for (const [id, data] of [
  ['storage-personal', { ...classSet, assignmentMode: 'personal', targetUserIds: ['storage-student', 'storage-otherStudent'] }],
  ['storage-legacy', { classIds: ['a'], assignmentMode: 'class', targetUserIds: [] }],
  ['storage-other-class', { ...classSet, classIds: ['b'] }]
]) {
  await seedDocument('portalPrepSets/' + id, data)
  await check('seed-prep-set-' + id, await upload('prep-videos/a/' + id + '/video.mp4', 'owner', 'video/mp4'), 200)
}
for (const uid of ['student', 'otherStudent', 'teacher', 'full']) {
  await check('prep-personal-assigned-' + uid, await read('prep-videos/a/storage-personal/video.mp4', uid), 200)
}
await check('prep-personal-same-class-peer-denied', await read('prep-videos/a/storage-personal/video.mp4', 'peerStudent'), 403)
await check('prep-personal-other-class-teacher-denied', await read('prep-videos/a/storage-personal/video.mp4', 'otherTeacher'), 403)
await check('prep-assigned-set-list', await list('prep-videos/a/storage-regression/', 'student'), 200)
await check('prep-cross-class-list-denied', await list('prep-videos/a/storage-regression/', 'otherStudent'), 403)
await check('prep-personal-peer-list-denied', await list('prep-videos/a/storage-personal/', 'peerStudent'), 403)
await check('prep-unscoped-student-list-denied', await list('prep-videos/', 'student'), 403)
await check('pdf-library-active-admin-list', await list('pdf-lab/shared-library/', 'teacher'), 200)
await check('pdf-library-student-list-denied', await list('pdf-lab/shared-library/', 'student'), 403)
for (const uid of ['student', 'teacher']) {
  await check('prep-legacy-unreviewed-denied-' + uid, await read('prep-videos/a/storage-legacy/video.mp4', uid), 403)
  await check('prep-path-document-class-mismatch-denied-' + uid, await read('prep-videos/a/storage-other-class/video.mp4', uid), 403)
  await check('prep-missing-set-denied-' + uid, await read('prep-videos/a/storage-missing/video.mp4', uid), 403)
}
await check('prep-legacy-full-review-read', await read('prep-videos/a/storage-legacy/video.mp4', 'full'), 200)
await seedDocument('portalPrepSets/storage-multi-class', { ...classSet, classIds: ['a', 'b'] })
// Denied reads must not be bypassed by minting a download link, replacing or deleting the object.
for (const id of ['storage-legacy', 'storage-other-class', 'storage-missing', 'storage-multi-class']) {
  const prefix = 'prep-videos/a/' + id + '/'
  const name = prefix + 'write-boundary.mp4'
  await check('prep-boundary-seed-' + id, await upload(name, 'owner', 'video/mp4'), 200)
  await check('prep-boundary-read-denied-' + id, await read(name, 'teacher'), 403)
  await check('prep-boundary-create-denied-' + id, await upload(prefix + 'new.mp4', 'teacher', 'video/mp4'), 403)
  const forbiddenCapability = randomUUID()
  await check('prep-boundary-token-patch-denied-' + id, await patchMetadata(name, 'teacher', { firebaseStorageDownloadTokens: forbiddenCapability }), 403)
  await check('prep-boundary-token-read-denied-' + id, await fetch(mediaUrl(name) + '&token=' + encodeURIComponent(forbiddenCapability)), 403)
  await check('prep-boundary-replace-denied-' + id, await upload(name, 'teacher', 'video/mp4'), 403)
  await check('prep-boundary-delete-denied-' + id, await remove(name, 'teacher'), 403)
  await check('prep-boundary-full-repair-read-' + id, await read(name, 'full'), 200)
  await check('prep-boundary-full-repair-metadata-' + id, await patchMetadata(name, 'full', { review: 'synthetic-repair' }), 200)
  await check('prep-boundary-full-repair-replace-' + id, await upload(name, 'full', 'video/mp4'), 200)
  await check('prep-boundary-full-repair-delete-' + id, await remove(name, 'full'), 204)
  await check('prep-boundary-full-repair-create-' + id, await upload(name, 'full', 'video/mp4'), 200)
  await check('prep-boundary-full-repair-wrong-mime-' + id, await upload(name, 'full', 'application/pdf'), 403)
  await check('prep-boundary-full-repair-cleanup-' + id, await remove(name, 'full'), 204)
}
for (const uid of ['teacher', 'full']) {
  const name = 'prep-videos/a/storage-regression/' + uid + '.mp4'
  await check('prep-create-' + uid, await upload(name, uid, 'video/mp4'), 200)
  await check('prep-replace-' + uid, await upload(name, uid, 'video/mp4'), 200)
  await check('prep-metadata-' + uid, await patchMetadata(name, uid, { review: 'synthetic-assigned' }), 200)
  await check('prep-delete-' + uid, await remove(name, uid), 204)
}
await check('prep-full-other-class', await upload('prep-videos/b/storage-regression/full.mp4', 'full', 'video/mp4'), 200)
for (const uid of [null, 'missingProfile', 'student', 'otherTeacher', 'disabledAdmin']) {
  await check('prep-create-denied-' + (uid || 'anonymous'), await upload('prep-videos/a/storage-regression/denied.mp4', uid, 'video/mp4'), 403)
  await check('prep-metadata-denied-' + (uid || 'anonymous'), await patchMetadata(prep, uid, { review: 'synthetic-denied' }), 403)
  await check('prep-delete-denied-' + (uid || 'anonymous'), await remove(prep, uid), 403)
}
await check('prep-wrong-mime', await upload('prep-videos/a/storage-regression/wrong.mp4', 'teacher', 'application/pdf'), 403)

for (const [name, kind] of [[grammar, 'video'], [material, 'material']]) {
  for (const uid of [null, 'missingProfile', 'student', 'otherUnit', 'teacherWithGrant', 'fullWithGrant', 'disabledStudent', 'disabledUnit', 'disabledAdmin']) {
    await check('grammar-' + kind + '-read-denied-' + (uid || 'anonymous'), await read(name, uid, uid === 'disabledAdmin' ? managerEmail : undefined), 403)
  }
  for (const uid of ['allGrammar', 'unitGrammar', 'grammarOnly']) await check('grammar-' + kind + '-read-allowed-' + uid, await read(name, uid), 200)
  await check('grammar-' + kind + '-manager-read', await read(name, 'full', managerEmail), 200)
}
for (const email of [managerEmail, 'passion413@prep.local', 'khe2016@prep.local']) {
  await check('grammar-existing-manager-allowlist-' + results.length, await read(grammar, 'full', email), 200)
}
await check('grammar-assigned-range', await read(grammar, 'unitGrammar', undefined, { Range: 'bytes=0-3' }), 206)
await check('grammar-unassigned-range-denied', await read(grammar, 'otherUnit', undefined, { Range: 'bytes=0-3' }), 403)
await check('grammar-object-grant-exact-path', await read('videos/grammar/other.mp4', 'unitGrammar'), 403)
await check('grammar-nested-path-denied', await read('videos/grammar/nested/storage-regression.mp4', 'allGrammar'), 403)
for (const [prefix, contentType, suffix] of [['videos/grammar', 'video/mp4', '.mp4'], ['materials/grammar', 'application/pdf', '.pdf']]) {
  const name = prefix + '/storage-regression-write' + suffix
  await check('grammar-manager-create-' + suffix, await upload(name, 'full', contentType, managerEmail), 200)
  await check('grammar-manager-replace-' + suffix, await upload(name, 'full', contentType, managerEmail), 200)
  for (const [uid, email] of [['full', undefined], ['teacher', managerEmail], ['disabledAdmin', managerEmail], ['allGrammar', undefined], ['missingProfile', managerEmail]]) {
    await check('grammar-create-denied-' + suffix + '-' + uid, await upload(name, uid, contentType, email), 403)
    await check('grammar-delete-denied-' + suffix + '-' + uid, await remove(name, uid, email), 403)
  }
  await check('grammar-wrong-mime-' + suffix, await upload(name, 'full', 'image/png', managerEmail), 403)
  await check('grammar-manager-delete-' + suffix, await remove(name, 'full', managerEmail), 204)
}

for (const uid of [null, 'missingProfile', 'student', 'disabledStudent', 'disabledAdmin']) {
  await check('pdf-library-read-denied-' + (uid || 'anonymous'), await read(library, uid), 403)
  await check('pdf-library-write-denied-' + (uid || 'anonymous'), await upload(library, uid, 'image/png'), 403)
  await check('pdf-library-delete-denied-' + (uid || 'anonymous'), await remove(library, uid), 403)
}
for (const uid of ['teacher', 'full']) {
  const name = 'pdf-lab/shared-library/storage-regression/' + uid + '.png'
  await check('pdf-library-create-' + uid, await upload(name, uid, 'image/png'), 200)
  await check('pdf-library-replace-' + uid, await upload(name, uid, 'image/png'), 200)
  await check('pdf-library-read-' + uid, await read(name, uid), 200)
  await check('pdf-library-delete-' + uid, await remove(name, uid), 204)
}
await check('pdf-library-existing-octet-stream', await upload('pdf-lab/shared-library/storage-regression/raw.bin', 'teacher', 'application/octet-stream'), 200)
await check('pdf-library-wrong-mime', await upload(library, 'teacher', 'text/html'), 403)
await check('unknown-root-read-denied', await read('unrelated/storage-regression.bin', 'full'), 403)
await check('unknown-root-write-denied', await upload('unrelated/storage-regression.bin', 'full', 'image/png'), 403)

// Revocation must use the current profile, even when the caller keeps the same token.
const retainedToken = identity('student')
await seedProfile('student', { ...profiles.student, classIds: ['b'] })
await check('prep-reassignment-with-existing-token-denied', await fetch(mediaUrl(prep), { headers: retainedToken }), 403)
await seedProfile('student', { ...profiles.student, loginDisabled: true })
await check('prep-disabled-with-existing-token-denied', await fetch(mediaUrl(prep), { headers: retainedToken }), 403)
await check('prep-disabled-personal-target-denied', await read('prep-videos/a/storage-personal/video.mp4', 'student'), 403)
await seedDocument('portalPrepSets/storage-personal', { ...classSet, assignmentMode: 'personal', targetUserIds: [] })
await check('prep-revoked-personal-target-denied', await read('prep-videos/a/storage-personal/video.mp4', 'otherStudent'), 403)
await seedProfile('unitGrammar', { ...profiles.unitGrammar, grammarObjectPaths: [] })
await check('grammar-revoked-object-denied', await read(grammar, 'unitGrammar'), 403)
await seedProfile('teacher', { ...profiles.teacher, loginDisabled: true })
await check('pdf-library-disabled-existing-admin-denied', await read(library, 'teacher'), 403)
await check('pdf-library-disabled-admin-list-denied', await list('pdf-lab/shared-library/', 'teacher'), 403)

// Download tokens are bearer capabilities, not authenticated rule checks. Never print them.
const capabilityObject = 'prep-videos/a/storage-regression/capability.mp4'
const capabilityResponse = await upload(capabilityObject, 'owner', 'video/mp4')
assert.equal(capabilityResponse.status, 200)
const capabilityMetadata = await capabilityResponse.json()
const capability = String(capabilityMetadata.downloadTokens || '').split(',')[0]
assert.ok(capability, 'The emulator must supply a synthetic download token for this boundary check')
await check('token-object-anonymous-without-token-denied', await read(capabilityObject), 403)
await check('existing-download-token-remains-separate-revocation-risk', await fetch(mediaUrl(capabilityObject) + '&token=' + encodeURIComponent(capability)), 200)

const failures = results.filter(result => result.status !== result.expected)
if (failures.length) console.error(JSON.stringify({ failures }))
assert.equal(failures.length, 0, `${failures.length} Storage permission checks failed`)
console.log(JSON.stringify({ storagePassed: results.length, productionAccess: false, scope: 'authenticated rules; existing download-token URLs require separate revocation' }))
