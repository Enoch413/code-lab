import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const source = readFileSync(new URL('../rotation_portal_enhancements.js', import.meta.url), 'utf8')
const portalSource = readFileSync(new URL('../rotation_portal.js', import.meta.url), 'utf8')
const styleSource = readFileSync(new URL('../rotation_prep.css', import.meta.url), 'utf8')
const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

const openCheck = source.slice(
  source.indexOf('async function openCheckPortal(){'),
  source.indexOf('async function refreshCheckDataAndRender(){')
)
assert.ok(openCheck.indexOf("activatePortalScreen('check-screen')") < openCheck.indexOf('await ensureCheckData(false)'))
assert.ok(openCheck.indexOf('renderCheckScreen()') < openCheck.indexOf('await ensureCheckData(false)'))
assert.ok(!openCheck.includes('syncPrepContentAfterLogin'))

const loadSets = source.slice(
  source.indexOf('async function loadCloudSetDocs(kind){'),
  source.indexOf('async function saveCloudSetDoc(kind, docId, record){')
)
assert.ok(loadSets.includes("where('targetUserIds', 'array-contains', userId)"))

const ensureCheck = source.slice(source.lastIndexOf('async function ensureCheckData(forceReload){'))
assert.ok(ensureCheck.includes('if(portalState.checkSyncPromise) return portalState.checkSyncPromise'))

const initFirebase = portalSource.slice(
  portalSource.indexOf('function initFirebasePortal(){'),
  portalSource.indexOf('function initLocalPortal(){')
)
const beforeAuthObserver = initFirebase.slice(0, initFirebase.indexOf('portalState.auth.onAuthStateChanged'))
assert.ok(!beforeAuthObserver.includes('setTimeout'))
assert.ok(!beforeAuthObserver.includes('portalState.currentUser = null'))

assert.ok(source.includes("window.addEventListener('scroll', scheduleCheckJumpButtonVisibility, { passive: true })"))
assert.ok(source.includes('function scheduleCheckJumpButtonVisibility(){'))
assert.ok(source.includes('requestAnimationFrame(function(){'))

const syncJumpButton = source.slice(
  source.indexOf('function syncCheckJumpButtonVisibility(){'),
  source.indexOf('function showAuthScreen(errorMessage){')
)
assert.ok(syncJumpButton.includes('form.childElementCount > 13'))
assert.ok(!syncJumpButton.includes('querySelectorAll'))

assert.ok(styleSource.includes('content-visibility:auto;'))
assert.ok(styleSource.includes('contain-intrinsic-size:auto 86px;'))
assert.ok(indexSource.includes('20260930-check-scroll-stability-01'))
assert.ok(indexSource.includes('20261007-grammar-only-class-01'))

// Run the actual read/entry functions with a stalled SDK and a controllable clock.
function block(start, end, last = false, text = source){
  const offset = last ? text.lastIndexOf(start) : text.indexOf(start)
  assert.ok(offset >= 0 && text.indexOf(end, offset) > offset)
  return text.slice(offset, text.indexOf(end, offset))
}
const runtimeSource = [
  block('function normalizeCheckAssignmentValues(', 'function getCheckSetTargetUserIds(', false, portalSource),
  block('function normalizeCheckData(', 'function showCheckScreen(', false, portalSource),
  block('const CHOICE_TOKEN_MAP', 'function formatChoiceAnswer(', false, portalSource),
  block('function normalizeCheckQuestionType(', 'function renderCheckAnswerField(', false, portalSource),
  block('function withPortalReadTimeout(', 'async function saveCloudContentDoc('),
  block('async function openCheckPortal(){', 'function openLabPlaceholder('),
  block('function clonePlainData(', 'async function saveCloudSetDoc('),
  block('function normalizePortalCheckClassList(', 'async function loadPortalPrepBundleFromSources('),
  block('async function loadPortalCheckDataFromSources(){', 'async function syncPrepContentAfterLogin('),
  block('async function ensureCheckData(forceReload){', 'function getPortalUploadTargetClass(', true)
].join('\n')

function encode(value){
  if(value === null) return { nullValue: null }
  if(Array.isArray(value)) return { arrayValue: { values: value.map(encode) } }
  if(typeof value === 'object') return { mapValue: { fields: Object.fromEntries(Object.entries(value).map(([key, item]) => [key, encode(item)])) } }
  if(typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }
  return { [typeof value === 'boolean' ? 'booleanValue' : 'stringValue']: value }
}

function harness(){
  const timers = new Map()
  const requests = [], sdkQueries = [], lateReads = [], toasts = []
  let timerId = 0, screen = '', sdkMode = 'hung', restMode = 'ok', admin = false
  const records = [1, 2].map(number => ({
    docId: 'set-' + number, title: '2강서 CHECK ' + number,
    classIds: ['2gangseo-a'], targetUserIds: ['student-2gangseo'], assignmentMode: 'personal',
    sortOrder: number, updatedAt: '2026-10-01T00:00:00Z',
    payload: { id: 'set-' + number, title: '2강서 CHECK ' + number, questions: [{ id: 'q1', number: 1, answer: '1' }] }
  }))
  const sdkRead = (collection, options) => {
    if(collection === 'portalCheckSets') assert.equal(options.source, 'server')
    const result = collection === 'portalContent'
      ? { exists: false }
      : { docs: records.map(record => ({ id: record.docId, data: () => record })) }
    if(sdkMode === 'ok') return Promise.resolve(result)
    if(sdkMode === 'fail') return Promise.reject(new Error('offline'))
    return new Promise(resolve => lateReads.push(() => resolve(result)))
  }
  const nodes = Object.fromEntries(['check-stats', 'check-set-list', 'check-class-name', 'check-load-retry-btn', 'check-screen', 'check-set-screen'].map(id => [id, {
    innerHTML: '', textContent: '', listeners: {},
    addEventListener(event, callback){ this.listeners[event] = callback },
    classList: { contains: () => screen === id }
  }]))
  const portalState = {
    firebaseEnabled: true, checkData: null, checkSyncPromise: null, contentMeta: {}, checkSetInventory: [],
    currentUser: { uid: 'student-2gangseo', getIdToken: async () => 'test-user-token' },
    db: { collection(collection){ return {
      doc: () => ({ get: options => sdkRead(collection, options) }),
      where(field, operator, uid){ sdkQueries.push({ field, operator, uid }); return this },
      get: options => sdkRead(collection, options)
    } } }
  }
  const context = vm.createContext({
    portalState, AbortController,
    window: { ROTATION_FIREBASE_CONFIG: { projectId: 'test-project' } },
    PORTAL_CLOUD_DOCS: { check: 'check-data' }, PORTAL_CONFIG: {},
    PORTAL_CLOUD_SET_COLLECTIONS: { check: 'portalCheckSets', prep: 'portalPrepSets' },
    prepClasses: [{ id: '2gangseo-a', name: '2강서A' }],
    document: { getElementById: id => nodes[id] },
    setTimeout: (callback, milliseconds) => { timers.set(++timerId, { callback, milliseconds }); return timerId },
    clearTimeout: id => timers.delete(id),
    console: { warn(){}, error(){} },
    isPortalAdmin: () => admin, isGrammarOnlyStudent: () => false, ensurePortalScreenAccess: () => true,
    sanitizeId: value => value,
    activatePortalScreen: id => { screen = id }, getCurrentActiveScreenId: () => screen,
    renderCheckScreen(){
      nodes['check-class-name'].textContent = '2강서A'
      nodes['check-set-list'].innerHTML = 'sets: ' + (portalState.checkData?.checkSets.length || 0)
    },
    showToast: message => toasts.push(message), showAuthScreen(){ screen = 'auth-screen' },
    updateAdminUploadStatus(){}, ensureCurrentLocalUserHasClass(){},
    fetch: async (url, options) => {
      requests.push({ url, ...options })
      assert.equal(options.headers.Authorization, 'Bearer test-user-token')
      if(restMode === 'hung') return new Promise(() => {})
      if(restMode === 'fail') return { ok: false, status: 403 }
      if(restMode === 'malformed') return { ok: true, status: 200, json: async () => ({ error: 'invalid' }) }
      if(url.endsWith(':runQuery')){
        const result = restMode === 'empty' ? [{ readTime: '2026-10-01T00:00:00Z' }]
          : records.map(record => ({ document: { name: 'projects/test-project/databases/(default)/documents/portalCheckSets/' + record.docId, fields: encode(record).mapValue.fields } }))
        return { ok: true, status: 200, json: async () => result }
      }
      assert.ok(url.endsWith('/portalContent/check-data'))
      return { ok: false, status: 404 }
    }
  })
  vm.runInContext(runtimeSource, context)
  const flush = async () => { for(let index = 0; index < 20; index++) await Promise.resolve() }
  const expire = async milliseconds => {
    const pending = [...timers.entries()].filter(([, timer]) => timer.milliseconds === milliseconds)
    assert.ok(pending.length, 'Expected timeout: ' + milliseconds)
    pending.forEach(([id, timer]) => { timers.delete(id); timer.callback() })
    await flush()
  }
  return { context, portalState, timers, requests, sdkQueries, lateReads, nodes, toasts, flush, expire,
    set sdk(value){ sdkMode = value }, set rest(value){ restMode = value }, set admin(value){ admin = value }
  }
}

let test = harness()
let entry = test.context.openCheckPortal()
const duplicateEntry = test.context.openCheckPortal()
assert.equal(test.nodes['check-class-name'].textContent, '2강서A')
assert.match(test.nodes['check-set-list'].innerHTML, /불러오는 중/)
assert.equal(test.requests.length, 0)
assert.equal(test.timers.size, 2, 'Legacy and set reads must start in parallel')
await test.expire(8000)
await entry
await duplicateEntry
assert.equal(test.portalState.checkData.checkSets.length, 2)
assert.equal(test.portalState.checkData.checkSets[0].questions[0].answer, '1')
assert.deepEqual(Array.from(test.portalState.checkData.checkSets[0].targetUserIds), ['student-2gangseo'])
const fallbackQuery = JSON.parse(test.requests.find(request => request.url.endsWith(':runQuery')).body).structuredQuery
assert.deepEqual(fallbackQuery.where.fieldFilter, {
  field: { fieldPath: 'targetUserIds' }, op: 'ARRAY_CONTAINS', value: { stringValue: 'student-2gangseo' }
})
assert.equal(test.sdkQueries[0].uid, 'student-2gangseo')
const recoveredData = test.portalState.checkData
test.lateReads.forEach(resolve => resolve())
await test.flush()
assert.equal(test.portalState.checkData, recoveredData, 'Late SDK results cannot overwrite recovered data')
assert.equal(test.timers.size, 0)

test = harness()
test.sdk = 'ok'
await test.context.openCheckPortal()
assert.equal(test.requests.length, 0, 'Healthy SDK reads do not use REST')
assert.equal(test.portalState.checkData.checkSets.length, 2)
assert.equal(test.timers.size, 0)

test = harness()
test.sdk = 'fail'
await test.context.openCheckPortal()
assert.equal(test.portalState.checkData.checkSets.length, 2, 'Immediate SDK errors also recover')
assert.equal(test.timers.size, 0)

test = harness()
test.rest = 'fail'
entry = test.context.openCheckPortal()
await test.expire(8000)
await entry
assert.match(test.nodes['check-set-list'].innerHTML, /다시 불러오기/)
assert.equal(test.portalState.checkData, null, 'A network error must not become a cached empty result')
assert.equal(test.portalState.checkSyncPromise, null)
test.rest = 'ok'
entry = test.nodes['check-load-retry-btn'].listeners.click()
await test.expire(8000)
await entry
assert.equal(test.portalState.checkData.checkSets.length, 2)
const lastGoodData = test.portalState.checkData
test.rest = 'fail'
entry = test.context.refreshCheckDataAndRender()
await test.expire(8000)
await entry
assert.equal(test.portalState.checkData, lastGoodData, 'A failed refresh keeps the last good data')
assert.ok(test.toasts.every(message => !message.includes('새로 불러왔습니다')))

test = harness()
test.rest = 'hung'
entry = test.context.openCheckPortal()
await test.expire(8000)
await test.expire(12000)
await entry
assert.match(test.nodes['check-set-list'].innerHTML, /다시 불러오기/)
assert.ok(test.requests.every(request => request.signal.aborted))
assert.equal(test.portalState.checkSyncPromise, null)
assert.equal(test.portalState.checkData, null)

test = harness()
let resolveToken
const tokenPromise = new Promise(resolve => { resolveToken = resolve })
test.portalState.currentUser.getIdToken = () => tokenPromise
entry = test.context.openCheckPortal()
await test.expire(8000)
await test.expire(12000)
await entry
assert.equal(test.requests.length, 0, 'Token retrieval is also bounded')
assert.match(test.nodes['check-set-list'].innerHTML, /다시 불러오기/)
resolveToken('test-user-token')
await test.flush()
assert.equal(test.requests.length, 0, 'A late token must not start a cancelled request')

test = harness()
test.sdk = 'fail'
test.rest = 'malformed'
await test.context.openCheckPortal()
assert.equal(test.portalState.checkData, null, 'Malformed responses must not become an empty result')
assert.match(test.nodes['check-set-list'].innerHTML, /다시 불러오기/)

test = harness()
test.rest = 'empty'
entry = test.context.openCheckPortal()
await test.expire(8000)
await entry
assert.equal(test.portalState.checkData.checkSets.length, 0, 'A successful empty query is not an error')
assert.ok(test.requests.every(request => request.url.includes('firestore.googleapis.com')), 'No stale static fallback for authenticated cloud users')

test = harness()
test.admin = true
entry = test.context.openCheckPortal()
await test.expire(8000)
await entry
assert.equal(test.sdkQueries.length, 0)
assert.equal(JSON.parse(test.requests.find(request => request.body).body).structuredQuery.where, undefined)
assert.equal(test.portalState.checkData.checkSets.length, 2)

test = harness()
entry = test.context.openCheckPortal()
test.portalState.currentUser = null
test.lateReads.forEach(resolve => resolve())
await entry
assert.equal(test.portalState.checkData, null, 'Logout during a read cannot repopulate CHECK data')

test = harness()
test.sdk = 'fail'
assert.equal((await test.context.loadCloudSetDocs('prep')).length, 0)
assert.equal(test.requests.length, 0, 'PREP read behavior is unchanged')

assert.equal(test.context.decodePortalFirestoreValue({ booleanValue: false }), false)
assert.equal(test.context.decodePortalFirestoreValue({ integerValue: '12' }), 12)
assert.equal(test.context.decodePortalFirestoreValue({ nullValue: null }), null)
assert.throws(() => test.context.decodePortalFirestoreValue({ arrayValue: { values: {} } }), /Invalid Firestore array/)
assert.throws(() => test.context.decodePortalFirestoreValue({ unknownValue: 'invalid' }), /Unsupported Firestore value/)

console.log('CHECK entry, scroll stability, stalled-read recovery and retry: OK')
