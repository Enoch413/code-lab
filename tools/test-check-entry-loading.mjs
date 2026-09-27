import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../rotation_portal_enhancements.js', import.meta.url), 'utf8')
const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8')

const openCheck = source.slice(
  source.indexOf('async function openCheckPortal(){'),
  source.indexOf('async function refreshCheckDataAndRender(){')
)
assert.ok(openCheck.indexOf("activatePortalScreen('check-screen')") < openCheck.indexOf('await ensureCheckData(false)'))
assert.ok(!openCheck.includes('syncPrepContentAfterLogin'))

const loadSets = source.slice(
  source.indexOf('async function loadCloudSetDocs(kind){'),
  source.indexOf('async function saveCloudSetDoc(kind, docId, record){')
)
assert.ok(loadSets.includes("where('targetUserIds', 'array-contains', userId)"))

const ensureCheck = source.slice(source.lastIndexOf('async function ensureCheckData(forceReload){'))
assert.ok(ensureCheck.includes('if(portalState.checkSyncPromise) return portalState.checkSyncPromise'))
assert.ok(rules.includes('request.auth.uid in resource.data.targetUserIds'))

console.log('CHECK entry loading guard: OK')
