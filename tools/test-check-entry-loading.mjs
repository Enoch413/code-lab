import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../rotation_portal_enhancements.js', import.meta.url), 'utf8')
const portalSource = readFileSync(new URL('../rotation_portal.js', import.meta.url), 'utf8')
const styleSource = readFileSync(new URL('../rotation_prep.css', import.meta.url), 'utf8')
const indexSource = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

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

console.log('CHECK entry and scroll stability guard: OK')
