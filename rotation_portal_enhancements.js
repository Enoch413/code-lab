const PORTAL_CLOUD_DOCS = {
  prep: 'prep-session',
  check: 'check-data'
}

const PORTAL_ENHANCEMENT_KEYS = {
  contentPrefix: 'rotation_portal_content_v1_',
  issues: 'rotation_portal_question_issues_v1'
}

const PREP_SCREEN_IDS = [
  'class-screen',
  'class-auth-screen',
  'home-screen',
  'passage-screen',
  'study-menu-screen',
  'study-screen'
]

const CHROME_SCREEN_TITLES = {
  'portal-screen': { title: 'CODE LAB', sub: '홈' },
  'account-screen': { title: 'CODE LAB', sub: '회원정보' },
  'password-screen': { title: 'CODE LAB', sub: '비밀번호 변경' },
  'admin-portal-screen': { title: 'TOOLS', sub: '허브' },
  'class-screen': { title: 'PREP', sub: '반 선택' },
  'class-auth-screen': { title: 'PREP', sub: '반 비밀번호' },
  'home-screen': { title: 'PREP', sub: '학습 세트' },
  'passage-screen': { title: 'PREP', sub: '지문 선택' },
  'study-menu-screen': { title: 'PREP', sub: '유형 선택' },
  'study-screen': { title: 'PREP', sub: '학습' },
  'check-screen': { title: 'CHECK', sub: '세트 선택' },
  'check-set-screen': { title: 'CHECK', sub: '답안 제출' },
  'admin-screen': { title: 'ADMIN', sub: '관리' }
}

const ADMIN_PORTAL_LABS = {
  'WORD LAB': 'https://enoch413.github.io/word-lab/',
  'PDF LAB': 'https://enoch413.github.io/pdf-lab/',
  'ROTATION LAB': 'https://enoch413.github.io/rotatation-lab/',
  'BUILDER LAB': 'https://enoch413.github.io/builder-lab/',
  'PINPOINT LAB': 'https://enoch413.github.io/pinpoint-lab/'
}

const ADMIN_PORTAL_LAB_COUNT = 5
const ADMIN_PORTAL_CONNECTED_LABS = Object.keys(ADMIN_PORTAL_LABS).length

portalState.forcePasswordReset = false
portalState.contentMeta = portalState.contentMeta || {}
portalState.currentQuestionIssues = portalState.currentQuestionIssues || []
portalState.currentCheckDraftAnswers = portalState.currentCheckDraftAnswers || {}
portalState.currentCheckFilter = portalState.currentCheckFilter || 'all'
portalState.historyInitialized = false
portalState.currentRouteKey = ''
portalState.isRestoringHistory = false
portalState.prepSyncPromise = null

document.addEventListener('DOMContentLoaded', initPortalEnhancements)

function initPortalEnhancements(){
  bindPortalEnhancementEvents()
  window.addEventListener('popstate', handleAppPopState)
  if(!history.state || !history.state.appRoute){
    syncAppHistoryState(getCurrentActiveScreenId(), true)
  }else{
    portalState.historyInitialized = true
  }
  updatePortalUserCard()
  updateAppChrome(getCurrentActiveScreenId())
  setTimeout(function(){
    if(!bundleData && !portalState.currentUser){
      showAuthScreen('')
    }
  }, 0)
}

function bindPortalEnhancementEvents(){
  bindClick('app-menu-btn', openAppDrawer)
  bindClick('app-drawer-close-btn', closeAppDrawer)
  bindClick('app-drawer-backdrop', closeAppDrawer)

  Array.from(document.querySelectorAll('[data-drawer-action]')).forEach(function(button){
    button.addEventListener('click', function(){
      runDrawerAction(button.dataset.drawerAction || '')
    })
  })

  bindClick('account-prep-btn', function(){
    closeAppDrawer()
    openPrepPortal()
  })
  bindClick('account-check-btn', function(){
    closeAppDrawer()
    openCheckPortal()
  })
  bindClick('account-admin-btn', function(){
    closeAppDrawer()
    openAdminPortal()
  })
  bindClick('account-password-btn', function(){
    closeAppDrawer()
    openPasswordScreen(false)
  })
  bindClick('admin-portal-back-btn', openAdminPortal)
  bindClick('admin-portal-refresh-btn', refreshPortalData)
  bindClick('admin-portal-word-btn', function(){ openLabPlaceholder('WORD LAB') })
  bindClick('admin-portal-pdf-btn', function(){ openLabPlaceholder('PDF LAB') })
  bindClick('admin-portal-rotation-btn', function(){ openLabPlaceholder('ROTATION LAB') })
  bindClick('admin-portal-builder-btn', function(){ openLabPlaceholder('BUILDER LAB') })
  bindClick('admin-portal-pinpoint-btn', function(){ openLabPlaceholder('PINPOINT LAB') })
  bindClick('admin-portal-home-btn', openToolsPortal)
  bindClick('admin-tools-entry-btn', openToolsPortal)
  bindClick('admin-upload-prep-btn', function(){
    const input = document.getElementById('admin-prep-upload-input')
    if(input) input.click()
  })
  bindClick('admin-upload-check-btn', function(){
    const input = document.getElementById('admin-check-upload-input')
    if(input) input.click()
  })

  const prepUploadInput = document.getElementById('admin-prep-upload-input')
  if(prepUploadInput){
    prepUploadInput.addEventListener('change', function(event){
      handlePortalContentUpload('prep', event)
    })
  }

  const checkUploadInput = document.getElementById('admin-check-upload-input')
  if(checkUploadInput){
    checkUploadInput.addEventListener('change', function(event){
      handlePortalContentUpload('check', event)
    })
  }
}

function bindClick(id, handler){
  const node = document.getElementById(id)
  if(node) node.addEventListener('click', handler)
}

function openAppDrawer(){
  if(!portalState.currentUser) return
  updatePortalUserCard()
  const drawer = document.getElementById('app-drawer')
  const backdrop = document.getElementById('app-drawer-backdrop')
  if(drawer) drawer.classList.add('open')
  if(drawer) drawer.setAttribute('aria-hidden', 'false')
  if(backdrop) backdrop.classList.remove('hidden')
}

function closeAppDrawer(){
  const drawer = document.getElementById('app-drawer')
  const backdrop = document.getElementById('app-drawer-backdrop')
  if(drawer) drawer.classList.remove('open')
  if(drawer) drawer.setAttribute('aria-hidden', 'true')
  if(backdrop) backdrop.classList.add('hidden')
}

function runDrawerAction(action){
  closeAppDrawer()
  if(action === 'home') return showPortalScreen()
  if(action === 'prep') return openPrepPortal()
  if(action === 'check') return openCheckPortal()
  if(action === 'admin') return openAdminPortal()
  if(action === 'account') return openAccountScreen()
  if(action === 'password') return openPasswordScreen(false)
  if(action === 'refresh') return refreshPortalData()
  if(action === 'logout') return logoutPortal()
}

function getCurrentActiveScreenId(){
  const active = document.querySelector('.screen.active')
  return active ? active.id : 'auth-screen'
}

function updateAppChrome(screenId){
  const chrome = document.getElementById('app-chrome')
  const menuButton = document.getElementById('app-menu-btn')
  const titleNode = document.getElementById('app-chrome-title')
  const subNode = document.getElementById('app-chrome-sub')
  if(!chrome || !titleNode || !subNode || !menuButton) return

  const hiddenScreens = ['auth-screen', 'boot-screen', 'pw-screen']
  const shouldShow = hiddenScreens.indexOf(screenId) < 0 && !!portalState.currentUser
  chrome.classList.toggle('hidden', !shouldShow)
  chrome.setAttribute('aria-hidden', shouldShow ? 'false' : 'true')
  menuButton.disabled = !shouldShow

  const meta = CHROME_SCREEN_TITLES[screenId] || { title: 'CODE LAB', sub: '' }
  titleNode.textContent = meta.title
  const classNames = getProfileClassNames().join(', ')
  subNode.textContent = classNames || meta.sub
}

function syncAppHistoryState(screenId, replaceStateOnly){
  if(portalState.isRestoringHistory) return
  const route = captureAppRoute(screenId)
  const nextKey = JSON.stringify(route)
  if(!portalState.historyInitialized || replaceStateOnly){
    history.replaceState({ appRoute: route }, '', window.location.href)
    portalState.historyInitialized = true
    portalState.currentRouteKey = nextKey
    return
  }
  if(portalState.currentRouteKey === nextKey) return
  history.pushState({ appRoute: route }, '', window.location.href)
  portalState.currentRouteKey = nextKey
}

function captureAppRoute(screenId){
  const route = { screenId: screenId }
  if(PREP_SCREEN_IDS.indexOf(screenId) >= 0 && typeof window.capturePrepNavigationState === 'function'){
    return window.capturePrepNavigationState(screenId)
  }
  if(screenId === 'check-set-screen' && portalState.currentCheckSet){
    route.checkSetId = portalState.currentCheckSet.id
  }
  if(screenId === 'password-screen'){
    route.force = !!portalState.forcePasswordReset
  }
  return route
}

function handleAppPopState(event){
  const route = event.state && event.state.appRoute
  portalState.isRestoringHistory = true
  Promise.resolve(restoreAppRoute(route || { screenId: 'portal-screen' })).finally(function(){
    portalState.isRestoringHistory = false
    updateAppChrome(getCurrentActiveScreenId())
  })
}

function restoreAppRoute(route){
  if(!route || !route.screenId){
    restoreFallbackRoute('portal-screen')
    return
  }

  if(route.screenId === 'auth-screen'){
    if(portalState.currentUser){
      showPortalScreen()
    }else{
      showAuthScreen('')
    }
    return
  }

  if(route.screenId === 'portal-screen') return showPortalScreen()
  if(route.screenId === 'account-screen') return openAccountScreen()
  if(route.screenId === 'password-screen') return openPasswordScreen(!!route.force)
  if(route.screenId === 'admin-portal-screen') return openToolsPortal()
  if(route.screenId === 'check-screen') return openCheckPortal()
  if(route.screenId === 'check-set-screen') return openCheckSetPortal(route.checkSetId, { preserveHistory: true })
  if(route.screenId === 'admin-screen') return openAdminPortal()
  if(PREP_SCREEN_IDS.indexOf(route.screenId) >= 0 && typeof window.restorePrepNavigationState === 'function'){
    return window.restorePrepNavigationState(route)
  }

  restoreFallbackRoute('portal-screen')
}

function restoreFallbackRoute(defaultScreenId){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  if(defaultScreenId === 'check-screen') return openCheckPortal()
  if(defaultScreenId === 'admin-portal-screen') return openToolsPortal()
  if(defaultScreenId === 'admin-screen') return openAdminPortal()
  showPortalScreen()
}

window.onAppScreenActivated = function(screenId){
  updateAppChrome(screenId)
  syncAppHistoryState(screenId, false)
}

function activatePortalScreen(screenId){
  document.querySelectorAll('.screen').forEach(function(screen){
    screen.classList.remove('active')
  })
  const target = document.getElementById(screenId)
  if(target) target.classList.add('active')
  closeAppDrawer()
  if(typeof window.onAppScreenActivated === 'function'){
    window.onAppScreenActivated(screenId)
  }
}

function showAuthScreen(errorMessage){
  syncAuthClassOptions()
  if(errorMessage) setAuthError(errorMessage)
  else clearAuthError()
  activatePortalScreen('auth-screen')
}

function showPortalScreen(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  clearAuthError()
  updatePortalUserCard()
  activatePortalScreen('portal-screen')
}

function renderAccountScreen(){
  const profile = portalState.currentProfile || {}
  const classNames = getProfileClassNames()
  const loginId = profile.loginId || profile.studentId || derivePortalLoginId(profile) || ''
  const roleLabel = getPortalRoleLabel()

  setElementTextSafe('account-name', profile.name || '이름 없음')
  setElementTextSafe('account-login-id', loginId || '미설정')
  setElementTextSafe('account-class-names', classNames.join(', ') || '반 정보 없음')
  setElementTextSafe('account-role', roleLabel)

  const adminButton = document.getElementById('account-admin-btn')
  if(adminButton) adminButton.classList.toggle('hidden', !isPortalAdmin())
}

function openAccountScreen(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  renderAccountScreen()
  activatePortalScreen('account-screen')
}

function openPasswordScreen(forceChange){
  portalState.forcePasswordReset = forceChange === true || isPasswordResetRequired(portalState.currentProfile)
  if(typeof clearPasswordFields === 'function') clearPasswordFields()
  if(typeof clearPasswordError === 'function') clearPasswordError()

  const backButton = document.getElementById('password-back-btn')
  const homeButton = document.getElementById('password-home-btn')
  const isForced = !!portalState.forcePasswordReset
  if(backButton) backButton.classList.toggle('hidden', isForced)
  if(homeButton) homeButton.classList.toggle('hidden', isForced)
  activatePortalScreen('password-screen')
}

function routePortalAfterState(){
  syncAuthClassOptions()
  if(bundleData) unlockAllPrepClasses()

  if(!portalState.authResolved){
    showAuthScreen('로그인 상태를 확인하는 중입니다.')
    return
  }

  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }

  clearAuthError()
  updatePortalUserCard()

  Promise.resolve(syncPrepContentAfterLogin(false)).finally(function(){
    updatePortalUserCard()
    if(isPasswordResetRequired(portalState.currentProfile)){
      openPasswordScreen(true)
      return
    }
    showPortalScreen()
    if(typeof handlePortalHashRoute === 'function') handlePortalHashRoute()
  })
}

async function loadCloudContentDoc(docId){
  if(portalState.firebaseEnabled && portalState.db){
    try{
      const snapshot = await portalState.db.collection('portalContent').doc(docId).get()
      if(!snapshot.exists) return null
      return snapshot.data() || null
    }catch(error){
      console.warn('portalContent read fallback:', error && error.message ? error.message : error)
    }
  }

  try{
    const raw = localStorage.getItem(PORTAL_ENHANCEMENT_KEYS.contentPrefix + docId)
    return raw ? JSON.parse(raw) : null
  }catch(error){
    console.error(error)
    return null
  }
}

async function saveCloudContentDoc(docId, payload, fileName){
  const nextDoc = {
    docId: docId,
    fileName: String(fileName || '').trim() || (docId + '.json'),
    payload: payload,
    updatedAt: new Date().toISOString(),
    updatedBy: portalState.currentUser ? portalState.currentUser.uid : '',
    updatedByName: portalState.currentProfile && portalState.currentProfile.name ? portalState.currentProfile.name : ''
  }

  if(portalState.firebaseEnabled && portalState.db){
    try{
      await portalState.db.collection('portalContent').doc(docId).set(nextDoc, { merge: true })
      nextDoc.storage = 'cloud'
      return nextDoc
    }catch(error){
      console.warn('portalContent write fallback:', error && error.message ? error.message : error)
    }
  }

  localStorage.setItem(PORTAL_ENHANCEMENT_KEYS.contentPrefix + docId, JSON.stringify(nextDoc))
  nextDoc.storage = 'local'
  return nextDoc
}

function getCloudMetaText(meta){
  if(!meta || !meta.updatedAt) return ''
  return '업데이트: ' + formatAdminTime(meta.updatedAt) + (meta.fileName ? ' · ' + meta.fileName : '')
}

function updateAdminUploadStatus(){
  const prepMeta = portalState.contentMeta.prep
  const checkMeta = portalState.contentMeta.check
  const lines = []
  lines.push('PREP: ' + (prepMeta ? getCloudMetaText(prepMeta) : '아직 업로드 없음'))
  lines.push('CHECK: ' + (checkMeta ? getCloudMetaText(checkMeta) : '아직 업로드 없음'))
  setAdminUploadStatus(lines.join('\n'))
}

function setAdminUploadStatus(message){
  const node = document.getElementById('admin-upload-status')
  if(node) node.textContent = message || ''
}

async function syncPrepContentAfterLogin(forceReload){
  if(!portalState.currentUser || !portalState.db || !portalState.firebaseEnabled){
    return false
  }
  if(portalState.prepSyncPromise && !forceReload) return portalState.prepSyncPromise

  portalState.prepSyncPromise = loadCloudContentDoc(PORTAL_CLOUD_DOCS.prep).then(function(doc){
    if(!doc || !doc.payload) return false
    portalState.contentMeta.prep = {
      updatedAt: doc.updatedAt || '',
      fileName: doc.fileName || 'session.json'
    }
    if(typeof window.applyPrepSessionData === 'function'){
      window.applyPrepSessionData(doc.payload, { source: 'remote', skipRoute: true })
    }
    return true
  }).catch(function(error){
    console.error(error)
    return false
  }).finally(function(){
    portalState.prepSyncPromise = null
  })

  return portalState.prepSyncPromise
}

async function openPrepPortal(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }

  await syncPrepContentAfterLogin(false)

  hideAllScreensBeforePrep()
  if(!bundleData){
    showNoSessionState()
    updateAppChrome(getCurrentActiveScreenId())
    return
  }

  if(isPortalAdmin()){
    if(!prepClasses.length){
      showToast('연결된 PREP 반 정보가 없습니다.', 'var(--red)')
      showPortalScreen()
      return
    }
    if(typeof ensureScopedAdminPrepSelection === 'function' && !ensureScopedAdminPrepSelection()){
      showToast('로그인 계정과 연결된 PREP 반 정보가 없습니다.', 'var(--red)')
      showPortalScreen()
      return
    }
    showHome()
    return
  }

  if(!ensureStudentPrepSelection()){
    showToast('로그인 계정과 연결된 반 정보가 없습니다.', 'var(--red)')
    showPortalScreen()
    return
  }
  showHome()
}

async function ensureCheckData(forceReload){
  if(portalState.checkData && !forceReload) return portalState.checkData

  if(portalState.currentUser){
    const cloudDoc = await loadCloudContentDoc(PORTAL_CLOUD_DOCS.check)
    if(cloudDoc && cloudDoc.payload){
      portalState.contentMeta.check = {
        updatedAt: cloudDoc.updatedAt || '',
        fileName: cloudDoc.fileName || 'check_data.json'
      }
      portalState.checkData = normalizeCheckData(cloudDoc.payload)
      return portalState.checkData
    }
  }

  const url = String(PORTAL_CONFIG.checkDataUrl || 'check_data.json')
  const requestUrl = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'v=' + Date.now()
  try{
    const response = await fetch(requestUrl, { cache: 'no-store' })
    if(!response.ok) throw new Error('HTTP ' + response.status)
    const parsed = await response.json()
    portalState.checkData = normalizeCheckData(parsed)
    return portalState.checkData
  }catch(error){
    console.error(error)
    portalState.checkData = { updatedAt: '', classes: [], checkSets: [] }
    return portalState.checkData
  }
}

async function openCheckPortal(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  await ensureCheckData(false)
  if(!portalState.firebaseEnabled) ensureCurrentLocalUserHasClass()
  renderCheckScreen()
  activatePortalScreen('check-screen')
}

async function refreshCheckDataAndRender(){
  await ensureCheckData(true)
  if(document.getElementById('check-screen').classList.contains('active')){
    renderCheckScreen()
  }else if(document.getElementById('check-set-screen').classList.contains('active') && portalState.currentCheckSet){
    await openCheckSetPortal(portalState.currentCheckSet.id, { preserveHistory: true })
  }
  updateAdminUploadStatus()
  showToast('CHECK 데이터를 새로 불러왔습니다.', 'var(--green)')
}

function openLabPlaceholder(name){
  const url = ADMIN_PORTAL_LABS[name]
  if(!url){
    showToast(name + ' 주소가 아직 연결되지 않았습니다.', 'var(--red)')
    return
  }
  const opened = window.open(url, '_blank', 'noopener,noreferrer')
  if(!opened) window.location.href = url
}

function renderAdminPortalScreen(){
  const profile = portalState.currentProfile || {}
  const name = profile.name || profile.loginId || profile.studentId || '관리자'

  setElementTextSafe('admin-portal-subtitle', 'TOOLS HUB')
  setElementTextSafe('admin-portal-user-name', name)
  setElementTextSafe(
    'admin-portal-lab-summary',
    'LAB ' + ADMIN_PORTAL_CONNECTED_LABS + ' / ' + ADMIN_PORTAL_LAB_COUNT + ' 연결 완료'
  )
}

async function openToolsPortal(){
  if(!isPortalAdmin()){
    showToast('관리자 계정만 TOOLS를 이용할 수 있습니다.', 'var(--red)')
    return
  }
  await syncPrepContentAfterLogin(false)
  await ensureCheckData(false)
  updateAdminUploadStatus()
  renderAdminPortalScreen()
  activatePortalScreen('admin-portal-screen')
}

async function openAdminPortal(){
  if(!isPortalAdmin()){
    showToast('관리자 계정만 통계를 볼 수 있습니다.', 'var(--red)')
    return
  }
  await syncPrepContentAfterLogin(false)
  await ensureCheckData(false)
  updateAdminUploadStatus()
  await renderAdminScreen()
  activatePortalScreen('admin-screen')
}

function refreshPortalData(){
  const screenId = getCurrentActiveScreenId()
  if(screenId === 'check-screen' || screenId === 'check-set-screen'){
    return refreshCheckDataAndRender()
  }
  if(screenId === 'admin-portal-screen'){
    return openToolsPortal()
  }
  if(screenId === 'admin-screen'){
    return openAdminPortal()
  }
  if(PREP_SCREEN_IDS.indexOf(screenId) >= 0){
    const route = captureAppRoute(screenId)
    return Promise.resolve(syncPrepContentAfterLogin(true)).then(function(){
      if(route && typeof window.restorePrepNavigationState === 'function'){
        window.restorePrepNavigationState(route)
      }else{
        openPrepPortal()
      }
      showToast('PREP 데이터를 새로 불러왔습니다.', 'var(--green)')
    })
  }
  return Promise.resolve(syncPrepContentAfterLogin(true)).then(function(){
    if(screenId === 'portal-screen') showPortalScreen()
    if(screenId === 'account-screen') openAccountScreen()
    if(screenId === 'admin-portal-screen') openToolsPortal()
    showToast('최신 데이터를 확인했습니다.', 'var(--green)')
  })
}

function validatePortalContentPayload(kind, payload){
  if(kind === 'prep'){
    return !!(payload && Array.isArray(payload.classes) && Array.isArray(payload.studySets))
  }
  if(kind === 'check'){
    return !!(payload && Array.isArray(payload.checkSets))
  }
  return false
}

function collectPortalPayloadClassIds(kind, payload){
  const ids = new Set()
  if(kind === 'prep'){
    ;(Array.isArray(payload && payload.classes) ? payload.classes : []).forEach(function(classInfo){
      const id = String(classInfo && classInfo.id || '').trim()
      if(id) ids.add(id)
    })
    ;(Array.isArray(payload && payload.studySets) ? payload.studySets : []).forEach(function(studySet){
      const assignments = Array.isArray(studySet && studySet.classAssignments) ? studySet.classAssignments : []
      assignments.forEach(function(assignment){
        const id = String(assignment && assignment.classId || '').trim()
        if(id) ids.add(id)
      })
    })
  }
  if(kind === 'check'){
    ;(Array.isArray(payload && payload.classes) ? payload.classes : []).forEach(function(classInfo){
      const id = String(classInfo && classInfo.id || '').trim()
      if(id) ids.add(id)
    })
    ;(Array.isArray(payload && payload.checkSets) ? payload.checkSets : []).forEach(function(checkSet){
      const classIds = Array.isArray(checkSet && checkSet.classIds) ? checkSet.classIds : []
      classIds.forEach(function(classId){
        const id = String(classId || '').trim()
        if(id) ids.add(id)
      })
    })
  }
  return Array.from(ids)
}

function isPortalPayloadWithinAdminScope(kind, payload){
  if(!isPortalAdmin() || isPortalSuperAdmin()) return true
  const allowedClassIds = getProfileClassIds()
  return collectPortalPayloadClassIds(kind, payload).every(function(classId){
    return allowedClassIds.indexOf(classId) >= 0
  })
}

function readJsonFileFromBrowser(file){
  return new Promise(function(resolve, reject){
    const reader = new FileReader()
    reader.onload = function(event){
      try{
        resolve(JSON.parse(String(event.target && event.target.result || '')))
      }catch(error){
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

async function handlePortalContentUpload(kind, event){
  const file = event && event.target && event.target.files ? event.target.files[0] : null
  if(event && event.target) event.target.value = ''
  if(!file) return
  await uploadPortalContent(kind, file)
}

async function uploadPortalContent(kind, file){
  if(!isPortalAdmin()){
    showToast('관리자만 업로드할 수 있습니다.', 'var(--red)')
    return
  }
  try{
    const payload = await readJsonFileFromBrowser(file)
    if(!validatePortalContentPayload(kind, payload)){
      showToast('파일 구조가 올바르지 않습니다.', 'var(--red)')
      return
    }
    if(!isPortalPayloadWithinAdminScope(kind, payload)){
      showToast('담당 반 범위를 벗어난 데이터는 업로드할 수 없습니다.', 'var(--red)')
      return
    }

    const docId = kind === 'prep' ? PORTAL_CLOUD_DOCS.prep : PORTAL_CLOUD_DOCS.check
    const saved = await saveCloudContentDoc(docId, payload, file.name)
    portalState.contentMeta[kind] = {
      updatedAt: saved.updatedAt,
      fileName: saved.fileName
    }

    if(kind === 'prep'){
      if(typeof window.applyPrepSessionData === 'function'){
        window.applyPrepSessionData(payload, { source: 'remote', skipRoute: true })
      }
    }else{
      portalState.checkData = normalizeCheckData(payload)
    }

    updateAdminUploadStatus()
    if(getCurrentActiveScreenId() === 'admin-screen') await renderAdminScreen()
    showToast((kind === 'prep' ? 'PREP session' : 'CHECK data') + ' 업로드가 완료되었습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('업로드 중 오류가 발생했습니다.', 'var(--red)')
  }
}

function buildCheckResponseId(checkSetId){
  const userId = portalState.currentUser && portalState.currentUser.uid ? portalState.currentUser.uid : 'guest'
  return userId + '__' + String(checkSetId || 'check-set').trim()
}

async function loadExistingCheckSubmission(checkSet){
  if(!checkSet || !portalState.currentUser) return null
  const responseId = buildCheckResponseId(checkSet.id)
  if(portalState.firebaseEnabled){
    try{
      const snapshot = await portalState.db.collection('checkResponses').doc(responseId).get()
      if(snapshot.exists) return mapResponseToSubmission(snapshot.data())
    }catch(error){
      console.warn('checkResponses direct read fallback:', error && error.message ? error.message : error)
    }

    try{
      const snapshot = await portalState.db.collection('checkResponses')
        .where('userId', '==', portalState.currentUser.uid)
        .where('checkSetId', '==', checkSet.id)
        .limit(1)
        .get()
      if(!snapshot.empty) return mapResponseToSubmission(snapshot.docs[0].data())
    }catch(error){
      console.warn('checkResponses query fallback:', error && error.message ? error.message : error)
    }
    return null
  }

  const rows = readLocalResponses()
  const existing = rows.find(function(entry){
    return entry.id === responseId
  }) || null
  return existing ? mapResponseToSubmission(existing) : null
}

function mapResponseToSubmission(row){
  const answers = sortCheckSubmissionAnswers(Array.isArray(row && row.answers) ? row.answers : [])
  const latestBatchIds = Array.isArray(row && row.latestBatch && row.latestBatch.questionIds)
    ? row.latestBatch.questionIds.map(function(value){ return String(value || '').trim() }).filter(Boolean)
    : answers.map(function(answer){ return String(answer && answer.questionId || '').trim() }).filter(Boolean)
  const latestBatchSummary = row && row.latestBatch && row.latestBatch.summary
    ? row.latestBatch.summary
    : buildCheckSubmissionSummary(answers.filter(function(answer){
        return latestBatchIds.includes(String(answer && answer.questionId || '').trim())
      }))
  return {
    submittedAt: String(row && row.submittedAt || '').trim(),
    summary: row && row.summary ? row.summary : buildCheckSubmissionSummary(answers),
    answers: answers,
    latestBatch: latestBatchIds.length ? {
      submittedAt: String(row && row.latestBatch && row.latestBatch.submittedAt || row && row.submittedAt || '').trim(),
      questionIds: latestBatchIds,
      summary: latestBatchSummary
    } : null
  }
}

async function openCheckSetPortal(setId, options){
  const settings = options || {}
  const checkSet = getVisibleCheckSets().find(function(entry){
    return entry.id === setId
  }) || null
  if(!checkSet){
    showToast('찾을 수 없는 CHECK 세트입니다.', 'var(--red)')
    return
  }
  if(!checkSet.isAccessible && !isPortalAdmin()){
    showToast('아직 열리지 않은 CHECK 세트입니다.', 'var(--red)')
    return
  }

  portalState.currentCheckSet = checkSet
  portalState.currentCheckSubmission = await loadExistingCheckSubmission(checkSet)
  portalState.currentCheckDraftAnswers = buildInitialCheckDraftAnswers(checkSet, portalState.currentCheckSubmission)
  portalState.currentCheckFilter = countPendingCheckQuestions(checkSet, portalState.currentCheckSubmission) ? 'pending' : 'all'
  portalState.currentQuestionIssues = portalState.currentCheckSubmission
    ? await fetchMyQuestionIssues(checkSet)
    : []

  renderCurrentCheckSet()
  activatePortalScreen('check-set-screen')
  if(settings.preserveHistory){
    syncAppHistoryState('check-set-screen', true)
  }
}

function renderCurrentCheckSet(){
  const checkSet = portalState.currentCheckSet
  if(!checkSet){
    showCheckScreen()
    return
  }
  setElementTextSafe('check-current-set-name', checkSet.title)
  setElementTextSafe('check-current-set-meta', getCheckSetDateText(checkSet))
  renderCheckForm(checkSet, portalState.currentCheckSubmission)
}

function renderCheckForm(checkSet, submission){
  const form = document.getElementById('check-form')
  if(!form || !checkSet) return

  const answerMap = getSubmittedCheckAnswerMap(submission)
  const submittedCount = getSubmittedCheckCount(submission)
  const pendingCount = countPendingCheckQuestions(checkSet, submission)
  const latestBatchIds = getLatestBatchQuestionIds(submission)
  const filterMode = resolveCheckFilterMode(checkSet, submission, portalState.currentCheckFilter)
  portalState.currentCheckFilter = filterMode
  const visibleQuestions = getVisibleCheckQuestions(checkSet, submission, filterMode)
  const isLatestView = filterMode === 'latest'

  const progressHtml =
    '<section class="group check-progress-card">' +
      '<div class="check-progress-top">' +
        '<div class="check-progress-copy">' +
          '<div class="check-progress-title">제출 현황</div>' +
          '<div class="check-progress-meta">제출한 문항은 잠기며, 남은 문항만 이어서 풀 수 있습니다.</div>' +
        '</div>' +
        '<div class="check-progress-stats">' +
          '<span class="check-progress-chip">전체 ' + checkSet.questions.length + '</span>' +
          '<span class="check-progress-chip">제출 ' + submittedCount + '</span>' +
          '<span class="check-progress-chip">남음 ' + pendingCount + '</span>' +
        '</div>' +
      '</div>' +
      (
        isLatestView
          ? (
              '<div class="check-latest-banner">' +
                '<span class="status-badge ok">이번 제출 결과</span>' +
                '<div class="check-progress-meta">방금 제출한 문항 ' + latestBatchIds.length + '개만 모아 보여줍니다.</div>' +
              '</div>'
            )
          : (
              '<div class="check-filter-bar">' +
                renderCheckFilterButton('all', '전체', checkSet.questions.length, filterMode === 'all') +
                renderCheckFilterButton('pending', '미제출만', pendingCount, filterMode === 'pending') +
              '</div>'
            )
      ) +
    '</section>'

  const cardHtml = visibleQuestions.length ? visibleQuestions.map(function(question, index){
    const submittedAnswer = answerMap.get(String(question.id || '')) || null
    const selectedAnswer = submittedAnswer
      ? String(submittedAnswer.userAnswer || '')
      : getCurrentCheckDraftAnswer(question.id)
    const displayNumber = normalizeCheckQuestionNumber(question && question.number, index + 1)
    const resultClass = submittedAnswer ? ('check-result show ' + (submittedAnswer.isCorrect ? 'correct' : 'wrong')) : 'check-result'

    return '' +
      '<section class="group check-form-card">' +
        '<div class="check-question-meta">' +
          '<span class="check-chip">' + escapeHtml(question.type) + '</span>' +
          '<span class="check-chip">' + displayNumber + '번</span>' +
          '<span class="check-chip">' + escapeHtml(question.problemType || '기타') + '</span>' +
        '</div>' +
        '<div class="check-question-title">문항 ' + displayNumber + '</div>' +
        '<div class="check-question-prompt">' + escapeHtml(question.prompt || ('문항 ' + displayNumber)) + '</div>' +
        '<div class="check-answer-box">' +
          renderCheckAnswerField(question, selectedAnswer, !!submittedAnswer) +
        '</div>' +
        (submittedAnswer ? (
          '<div class="' + resultClass + '">' +
            '<div class="check-result-title">' + (submittedAnswer && submittedAnswer.isCorrect ? '정답' : '정답과 해설') + '</div>' +
            '<div class="check-result-body">' + renderCheckResultBody(question, submittedAnswer) + '</div>' +
            renderCheckIssueTools(question, submittedAnswer) +
          '</div>'
        ) : '') +
      '</section>'
  }).join('') : '<div class="empty-box">선택한 조건에 맞는 문항이 없습니다.</div>'

  form.innerHTML = progressHtml + cardHtml

  bindCheckFormInteractions(checkSet, submission)
  renderCheckSubmitArea(checkSet, submission)
}

function bindCheckFormInteractions(checkSet, submission){
  const form = document.getElementById('check-form')
  if(!form) return

  form.querySelectorAll('.check-choice-grid').forEach(function(group){
    if(group.dataset.locked === 'true') return
    group.querySelectorAll('.check-choice-btn').forEach(function(button){
      button.addEventListener('click', function(){
        const questionId = group.dataset.checkQuestionId || group.dataset.checkBinaryId || ''
        if(!questionId) return
        const value = String(button.dataset.choice || '').trim()
        setCurrentCheckDraftAnswer(questionId, value)
        group.querySelectorAll('.check-choice-btn').forEach(function(node){
          node.classList.remove('active')
        })
        button.classList.add('active')
        renderCheckSubmitArea(checkSet, submission)
      })
    })
  })

  form.querySelectorAll('[data-check-filter]').forEach(function(button){
    button.addEventListener('click', function(){
      const nextMode = String(button.dataset.checkFilter || '').trim() || 'all'
      portalState.currentCheckFilter = nextMode
      renderCurrentCheckSet()
    })
  })
}

function renderCheckSubmitArea(checkSet, submission){
  const submitArea = document.getElementById('check-submit-actions')
  if(!submitArea || !checkSet) return

  const filterMode = resolveCheckFilterMode(checkSet, submission, portalState.currentCheckFilter)
  const totalCount = checkSet.questions.length
  const submittedCount = getSubmittedCheckCount(submission)
  const pendingCount = countPendingCheckQuestions(checkSet, submission)
  const draftCount = countDraftCheckQuestions(checkSet, submission)
  const latestBatch = submission && submission.latestBatch ? submission.latestBatch : null

  let html = ''
  if(filterMode === 'latest' && latestBatch && Array.isArray(latestBatch.questionIds) && latestBatch.questionIds.length){
    html += '' +
      '<div class="status-note" style="margin-top:0">' +
        '<div class="status-top">' +
          '<span class="status-badge ok">최근 제출</span>' +
          '<span class="status-time">' + escapeHtml(formatAdminTime(latestBatch.submittedAt || submission.submittedAt || '')) + '</span>' +
        '</div>' +
        '<div class="status-text">이번에 ' + Number(latestBatch.summary && latestBatch.summary.total || latestBatch.questionIds.length || 0) + '문항을 제출했고, 그중 ' + Number(latestBatch.summary && latestBatch.summary.correct || 0) + '문항 정답입니다.</div>' +
      '</div>'
  }

  html += '' +
    '<div class="status-note check-submit-status">' +
      '<div class="status-top">' +
        '<span class="status-badge ' + (pendingCount ? 'blue' : 'ok') + '">' + (pendingCount ? '이어풀기 가능' : '전체 제출 완료') + '</span>' +
        '<span class="status-time">제출 ' + submittedCount + ' / 전체 ' + totalCount + '</span>' +
      '</div>' +
      '<div class="status-text">' + (
        pendingCount
          ? '아직 ' + pendingCount + '문항이 남아 있습니다. 이번에 푼 문항만 제출하면 이미 제출한 답은 잠기고 수정할 수 없습니다.'
          : '이 세트의 모든 문항 제출이 끝났습니다. 다시 들어오면 제출한 답과 해설이 바로 표시됩니다.'
      ) + '</div>' +
    '</div>'

  if(filterMode === 'latest'){
    if(pendingCount){
      html += '<button class="btn btn-blue" type="button" id="check-continue-btn">미제출 문제 계속 풀기</button>'
    }else{
      html += '<button class="btn btn-blue" type="button" id="check-all-results-btn">전체 제출 현황 보기</button>'
    }
  }else if(pendingCount){
    html += '<button class="btn btn-blue" type="button" id="check-submit-btn"' + (draftCount ? '' : ' disabled') + '>' + (draftCount ? ('이번에 푼 ' + draftCount + '문항 제출') : '이번에 푼 문제 제출') + '</button>'
  }

  submitArea.innerHTML = html
  const submitButton = document.getElementById('check-submit-btn')
  if(submitButton) submitButton.addEventListener('click', submitCurrentCheckSet)
  const continueButton = document.getElementById('check-continue-btn')
  if(continueButton) continueButton.addEventListener('click', function(){
    portalState.currentCheckFilter = 'pending'
    renderCurrentCheckSet()
  })
  const allResultsButton = document.getElementById('check-all-results-btn')
  if(allResultsButton) allResultsButton.addEventListener('click', function(){
    portalState.currentCheckFilter = 'all'
    renderCurrentCheckSet()
  })
}

function renderCheckIssueTools(question, submittedAnswer){
  const existing = portalState.currentQuestionIssues.find(function(entry){
    return String(entry.questionId || '') === String(question.id || '')
  }) || null
  const submittedText = submittedAnswer && submittedAnswer.userAnswer ? String(submittedAnswer.userAnswer) : ''
  const buttonClass = existing ? 'check-question-issue-btn done' : 'check-question-issue-btn'
  const buttonText = existing ? '질문 접수됨' : '질문 있어요'
  return '' +
    '<div class="check-result-tools">' +
      '<button class="' + buttonClass + '" type="button" onclick="submitCheckQuestionIssue(\'' + escapeJs(question.id) + '\')" ' + (existing ? 'disabled' : '') + '>' +
        escapeHtml(buttonText) +
      '</button>' +
    '</div>' +
    (submittedText ? '<div class="check-question-prompt" style="margin-top:8px">내 답: ' + escapeHtml(submittedText) + '</div>' : '')
}

async function submitCurrentCheckSet(){
  if(portalState.isSubmittingCheck) return
  const checkSet = portalState.currentCheckSet
  if(!checkSet) return

  portalState.isSubmittingCheck = true
  try{
    const batchAnswers = collectCheckBatchAnswers(checkSet, portalState.currentCheckSubmission)
    if(!batchAnswers.length){
      showToast('아직 제출할 답안이 없습니다. 먼저 미제출 문항의 답을 선택해 주세요.', 'var(--blue)')
      return
    }

    const submission = mergeCheckSubmission(portalState.currentCheckSubmission, batchAnswers)

    await saveCheckSubmission(checkSet, submission)
    portalState.currentCheckSubmission = submission
    portalState.currentCheckDraftAnswers = buildInitialCheckDraftAnswers(checkSet, submission)
    portalState.currentCheckFilter = 'latest'
    portalState.currentQuestionIssues = await fetchMyQuestionIssues(checkSet)
    renderCheckForm(checkSet, submission)
    showToast(batchAnswers.length + '문항을 제출하고 정답과 해설을 표시했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('답안 제출에 실패했습니다.', 'var(--red)')
  }finally{
    portalState.isSubmittingCheck = false
  }
}

async function saveCheckSubmission(checkSet, submission){
  const profile = portalState.currentProfile || {}
  const payload = {
    id: buildCheckResponseId(checkSet.id),
    checkSetId: checkSet.id,
    checkSetTitle: checkSet.title,
    classIds: getProfileClassIds(),
    userId: portalState.currentUser ? portalState.currentUser.uid : '',
    email: profile.email || '',
    name: profile.name || '',
    studentId: profile.studentId || profile.loginId || '',
    role: profile.role || 'student',
    submittedAt: submission.submittedAt,
    summary: submission.summary,
    answers: submission.answers,
    latestBatch: submission.latestBatch || null
  }

  if(portalState.firebaseEnabled){
    const docRef = portalState.db.collection('checkResponses').doc(payload.id)
    await docRef.set(payload, { merge: true })
    return
  }

  const rows = readLocalResponses().filter(function(entry){
    return entry.id !== payload.id
  })
  rows.push(payload)
  writeLocalResponses(rows)
}

function buildInitialCheckDraftAnswers(checkSet, submission){
  const submittedIds = new Set((submission && Array.isArray(submission.answers) ? submission.answers : []).map(function(answer){
    return String(answer && answer.questionId || '').trim()
  }).filter(Boolean))
  return (Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []).reduce(function(map, question){
    const questionId = String(question && question.id || '').trim()
    if(questionId && !submittedIds.has(questionId)) map[questionId] = ''
    return map
  }, {})
}

function getSubmittedCheckAnswerMap(submission){
  return new Map((submission && Array.isArray(submission.answers) ? submission.answers : []).map(function(answer){
    return [String(answer && answer.questionId || '').trim(), answer]
  }).filter(function(entry){ return entry[0] }))
}

function sortCheckSubmissionAnswers(answers){
  return (Array.isArray(answers) ? answers.slice() : []).sort(function(left, right){
    const leftNumber = normalizeCheckQuestionNumber(left && left.number, 0)
    const rightNumber = normalizeCheckQuestionNumber(right && right.number, 0)
    if(leftNumber !== rightNumber) return leftNumber - rightNumber
    return String(left && left.questionId || '').localeCompare(String(right && right.questionId || ''), 'ko')
  })
}

function buildCheckSubmissionSummary(answers){
  const list = Array.isArray(answers) ? answers : []
  return {
    total: list.length,
    correct: list.filter(function(answer){ return !!(answer && answer.isCorrect) }).length,
    wrong: list.filter(function(answer){ return answer && answer.isCorrect === false }).length
  }
}

function getSubmittedCheckCount(submission){
  return submission && Array.isArray(submission.answers) ? submission.answers.length : 0
}

function countPendingCheckQuestions(checkSet, submission){
  const total = Array.isArray(checkSet && checkSet.questions) ? checkSet.questions.length : 0
  return Math.max(0, total - getSubmittedCheckCount(submission))
}

function getLatestBatchQuestionIds(submission){
  return submission && submission.latestBatch && Array.isArray(submission.latestBatch.questionIds)
    ? submission.latestBatch.questionIds.map(function(value){ return String(value || '').trim() }).filter(Boolean)
    : []
}

function countDraftCheckQuestions(checkSet, submission){
  const submittedIds = new Set((submission && Array.isArray(submission.answers) ? submission.answers : []).map(function(answer){
    return String(answer && answer.questionId || '').trim()
  }).filter(Boolean))
  return (Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []).reduce(function(count, question){
    const questionId = String(question && question.id || '').trim()
    if(!questionId || submittedIds.has(questionId)) return count
    return getCurrentCheckDraftAnswer(questionId) ? count + 1 : count
  }, 0)
}

function getCurrentCheckDraftAnswer(questionId){
  return String(portalState.currentCheckDraftAnswers && portalState.currentCheckDraftAnswers[questionId] || '').trim()
}

function setCurrentCheckDraftAnswer(questionId, value){
  if(!portalState.currentCheckDraftAnswers) portalState.currentCheckDraftAnswers = {}
  portalState.currentCheckDraftAnswers[String(questionId || '').trim()] = String(value || '').trim()
}

function resolveCheckFilterMode(checkSet, submission, preferredMode){
  const mode = String(preferredMode || 'all').trim() || 'all'
  if(mode === 'pending' && !countPendingCheckQuestions(checkSet, submission)) return 'all'
  if(mode === 'latest' && !getLatestBatchQuestionIds(submission).length) return 'all'
  return ['all', 'pending', 'latest'].includes(mode) ? mode : 'all'
}

function getVisibleCheckQuestions(checkSet, submission, filterMode){
  const questions = Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []
  const submittedIds = new Set((submission && Array.isArray(submission.answers) ? submission.answers : []).map(function(answer){
    return String(answer && answer.questionId || '').trim()
  }).filter(Boolean))
  const latestIds = new Set(getLatestBatchQuestionIds(submission))
  if(filterMode === 'pending'){
    return questions.filter(function(question){
      return !submittedIds.has(String(question && question.id || '').trim())
    })
  }
  if(filterMode === 'latest'){
    return questions.filter(function(question){
      return latestIds.has(String(question && question.id || '').trim())
    })
  }
  return questions
}

function renderCheckFilterButton(mode, label, count, isActive, isDisabled){
  return '<button class="check-filter-btn' + (isActive ? ' active' : '') + '" type="button" data-check-filter="' + escapeHtml(mode) + '"' + (isDisabled ? ' disabled' : '') + '>' + escapeHtml(label) + '<span>' + Number(count || 0) + '</span></button>'
}

function collectCheckBatchAnswers(checkSet, submission){
  const answerMap = getSubmittedCheckAnswerMap(submission)
  return (Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []).map(function(question, index){
    const questionId = String(question && question.id || '').trim()
    if(!questionId || answerMap.has(questionId)) return null
    const userAnswer = getCurrentCheckDraftAnswer(questionId)
    if(!userAnswer) return null
    return {
      questionId: questionId,
      number: normalizeCheckQuestionNumber(question.number, index + 1),
      type: question.type,
      problemType: normalizeCheckProblemType(question.problemType || question.category),
      prompt: question.prompt,
      userAnswer: userAnswer,
      answer: question.answer,
      explanation: question.explanation,
      isCorrect: isAnswerAccepted(userAnswer, question)
    }
  }).filter(Boolean)
}

function mergeCheckSubmission(existingSubmission, batchAnswers){
  const mergedMap = new Map((existingSubmission && Array.isArray(existingSubmission.answers) ? existingSubmission.answers : []).map(function(answer){
    return [String(answer && answer.questionId || '').trim(), answer]
  }).filter(function(entry){ return entry[0] }))
  batchAnswers.forEach(function(answer){
    mergedMap.set(String(answer && answer.questionId || '').trim(), answer)
  })
  const mergedAnswers = sortCheckSubmissionAnswers(Array.from(mergedMap.values()))
  const submittedAt = new Date().toISOString()
  return {
    submittedAt: submittedAt,
    summary: buildCheckSubmissionSummary(mergedAnswers),
    answers: mergedAnswers,
    latestBatch: {
      submittedAt: submittedAt,
      questionIds: batchAnswers.map(function(answer){ return String(answer && answer.questionId || '').trim() }).filter(Boolean),
      summary: buildCheckSubmissionSummary(batchAnswers)
    }
  }
}

async function fetchMyQuestionIssues(checkSet){
  if(!checkSet || !portalState.currentUser) return []

  if(portalState.firebaseEnabled){
    try{
      const snapshot = await portalState.db.collection('questionIssues')
        .where('userId', '==', portalState.currentUser.uid)
        .where('checkSetId', '==', checkSet.id)
        .get()

      return snapshot.docs.map(function(doc){
        return Object.assign({ id: doc.id }, doc.data())
      })
    }catch(error){
      console.warn('questionIssues read fallback:', error && error.message ? error.message : error)
    }
  }

  return readLocalQuestionIssues().filter(function(entry){
    return entry.userId === (portalState.currentUser && portalState.currentUser.uid) && entry.checkSetId === checkSet.id
  })
}

async function fetchAllQuestionIssues(){
  if(portalState.firebaseEnabled){
    try{
      const snapshot = await portalState.db.collection('questionIssues').get()
      return snapshot.docs.map(function(doc){
        return Object.assign({ id: doc.id }, doc.data())
      })
    }catch(error){
      console.warn('questionIssues admin read fallback:', error && error.message ? error.message : error)
    }
  }
  return readLocalQuestionIssues()
}

window.submitCheckQuestionIssue = function(questionId){
  submitCheckQuestionIssueImpl(questionId)
}

async function submitCheckQuestionIssueImpl(questionId){
  const checkSet = portalState.currentCheckSet
  const profile = portalState.currentProfile || {}
  if(!checkSet || !portalState.currentCheckSubmission) return
  const question = checkSet.questions.find(function(entry){ return entry.id === questionId }) || null
  const submittedAnswer = portalState.currentCheckSubmission.answers.find(function(entry){ return entry.questionId === questionId }) || null
  if(!question || !submittedAnswer) return

  const issueId = simpleHash([
    portalState.currentUser ? portalState.currentUser.uid : '',
    checkSet.id,
    questionId
  ].join('::'))

  const payload = {
    id: issueId,
    userId: portalState.currentUser ? portalState.currentUser.uid : '',
    loginId: profile.loginId || profile.studentId || '',
    name: profile.name || '',
    role: profile.role || 'student',
    classIds: getProfileClassIds(),
    checkSetId: checkSet.id,
    checkSetTitle: checkSet.title,
    questionId: question.id,
    questionNumber: normalizeCheckQuestionNumber(question.number, 1),
    problemType: normalizeCheckProblemType(question.problemType),
    prompt: question.prompt,
    userAnswer: submittedAnswer.userAnswer || '',
    createdAt: new Date().toISOString(),
    status: 'open'
  }

  if(portalState.firebaseEnabled){
    try{
      await portalState.db.collection('questionIssues').doc(issueId).set(payload, { merge: true })
    }catch(error){
      console.warn('questionIssues write fallback:', error && error.message ? error.message : error)
      const rows = readLocalQuestionIssues().filter(function(entry){
        return entry.id !== issueId
      })
      rows.push(payload)
      writeLocalQuestionIssues(rows)
    }
  }else{
    const rows = readLocalQuestionIssues().filter(function(entry){
      return entry.id !== issueId
    })
    rows.push(payload)
    writeLocalQuestionIssues(rows)
  }

  portalState.currentQuestionIssues = await fetchMyQuestionIssues(checkSet)
  renderCheckForm(checkSet, portalState.currentCheckSubmission)
  showToast('질문이 관리자에게 전달되었습니다.', 'var(--green)')
}

function readLocalQuestionIssues(){
  try{
    const raw = localStorage.getItem(PORTAL_ENHANCEMENT_KEYS.issues)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  }catch(error){
    console.error(error)
    return []
  }
}

function writeLocalQuestionIssues(rows){
  localStorage.setItem(PORTAL_ENHANCEMENT_KEYS.issues, JSON.stringify(rows))
}

async function renderAdminScreen(){
  const responses = await fetchAllCheckResponses()
  const studentResponses = responses.filter(function(entry){
    return entry.role !== 'admin'
  })

  syncAdminClassFilterControls(studentResponses)
  const filteredResponses = filterAdminResponsesByClass(studentResponses)
  syncAdminStudentFilterControls(filteredResponses)
  const wrongAnswers = extractWrongAnswers(filteredResponses)
  const studentWrongSetItems = buildStudentSetWrongItems(filteredResponses, portalState.adminStudentFilter)

  const totalQuestions = filteredResponses.reduce(function(sum, entry){
    return sum + Number(entry.summary && entry.summary.total || 0)
  }, 0)
  const totalCorrect = filteredResponses.reduce(function(sum, entry){
    return sum + Number(entry.summary && entry.summary.correct || 0)
  }, 0)
  const accuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0

  document.getElementById('admin-stats').innerHTML = [
    renderStat(filteredResponses.length, '제출'),
    renderStat(new Set(filteredResponses.map(function(entry){ return getAdminResponseStudentKey(entry) || entry.name || '학생' })).size, '학생'),
    renderStat(wrongAnswers.length, '오답'),
    renderStat(accuracy + '%', '정답률')
  ].join('')

  renderAdminRankList(
    'admin-type-list',
    'admin-type-count',
    buildRankItems(wrongAnswers, function(entry){ return entry.problemType || '기타' }),
    function(item){
      return '<div class="admin-item"><strong>' + escapeHtml(item.label) + '</strong><span>' + item.count + '회 오답</span></div>'
    }
  )

  renderAdminRankList(
    'admin-student-list',
    'admin-student-count',
    buildRankItems(wrongAnswers, function(entry){ return entry.name || '학생' }),
    function(item){
      return '<div class="admin-item"><strong>' + escapeHtml(item.label) + '</strong><span>' + item.count + '회 오답</span></div>'
    }
  )

  renderAdminRankList(
    'admin-response-list',
    'admin-response-count',
    studentWrongSetItems,
    function(item){
      return '' +
        '<div class="admin-item">' +
          '<strong class="admin-item-title">' + escapeHtml(item.name) + '</strong>' +
          '<span class="admin-item-meta">' + escapeHtml(item.setTitle) + '</span>' +
          '<span class="admin-item-numbers">틀린 번호: ' + escapeHtml(item.wrongNumberText) + '</span>' +
        '</div>'
    }
  )

  const issueRows = filterAdminIssuesByState(await fetchAllQuestionIssues())
  document.getElementById('admin-issue-count').textContent = String(issueRows.length)
  document.getElementById('admin-issue-list').innerHTML = issueRows.length
    ? issueRows.map(buildAdminIssueItems).join('')
    : '<div class="empty-box">아직 접수된 질문이 없습니다.</div>'

  updateAdminUploadStatus()
}

function filterAdminIssuesByState(rows){
  return rows.filter(function(entry){
    if(isPortalAdmin() && !isPortalSuperAdmin()){
      const allowedClassIds = getProfileClassIds()
      const classIds = Array.isArray(entry && entry.classIds) ? entry.classIds : []
      if(!classIds.some(function(classId){
        return allowedClassIds.indexOf(classId) >= 0
      })){
        return false
      }
    }
    if(portalState.adminClassFilter !== 'all'){
      const classIds = Array.isArray(entry && entry.classIds) ? entry.classIds : []
      if(classIds.indexOf(portalState.adminClassFilter) < 0) return false
    }
    if(portalState.adminStudentFilter){
      return getAdminIssueStudentKey(entry) === portalState.adminStudentFilter
    }
    return true
  }).sort(function(a, b){
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
  })
}

function buildAdminIssueItems(entry){
  return '' +
    '<div class="admin-item">' +
      '<span class="admin-item-status">질문 접수</span>' +
      '<strong class="admin-item-title">' + escapeHtml(entry.name || '학생') + '</strong>' +
      '<span class="admin-item-meta">' + escapeHtml(entry.checkSetTitle || 'CHECK 세트') + ' · ' + escapeHtml(String(entry.questionNumber || '')) + '번 · ' + escapeHtml(entry.problemType || '기타') + '</span>' +
      '<span class="admin-item-numbers">내 답: ' + escapeHtml(entry.userAnswer || '미제출') + '</span>' +
      '<span class="admin-item-meta">' + escapeHtml(formatAdminTime(entry.createdAt)) + '</span>' +
    '</div>'
}

function getAdminIssueStudentKey(entry){
  return String(entry && (entry.userId || entry.loginId || entry.name) || '').trim()
}

function updatePortalUserCard(){
  const profile = portalState.currentProfile
  const fallbackId = profile && (profile.studentId || profile.loginId)
  const currentLoginId = portalState.currentUser && portalState.currentUser.loginId
  const name = profile && profile.name
    ? profile.name
    : (fallbackId || currentLoginId || (portalState.currentUser && portalState.currentUser.email) || '학생')
  const classNames = getProfileClassNames()
  const roleLabel = getPortalRoleLabel()
  const metaText = [
    roleLabel,
    classNames.join(', ') || '반 정보 없음',
    profile && profile.studentId ? ('ID ' + profile.studentId) : (profile && profile.loginId ? ('ID ' + profile.loginId) : '')
  ].filter(Boolean).join(' · ')

  setElementTextSafe('portal-user-name', name)
  setElementTextSafe('portal-user-meta', metaText)
  setElementTextSafe('drawer-user-name', name)
  setElementTextSafe('drawer-user-meta', metaText)
  renderAccountScreen()

  const portalAdminButton = document.getElementById('portal-admin-btn')
  const drawerAdminButton = document.getElementById('drawer-admin-btn')
  const accountAdminButton = document.getElementById('account-admin-btn')
  if(portalAdminButton) portalAdminButton.classList.toggle('hidden', !isPortalAdmin())
  if(drawerAdminButton) drawerAdminButton.classList.toggle('hidden', !isPortalAdmin())
  if(accountAdminButton) accountAdminButton.classList.toggle('hidden', !isPortalAdmin())
}

function setElementTextSafe(id, text){
  const node = document.getElementById(id)
  if(node) node.textContent = text || ''
}

function getPortalErrorMessage(error){
  const message = String(error && error.message || '')
  if(message.indexOf('auth/user-disabled') >= 0) return '로그인이 잠긴 계정입니다. 관리자에게 문의해 주세요.'
  if(message.indexOf('auth/invalid-login-credentials') >= 0 || message.indexOf('auth/wrong-password') >= 0) return '아이디 또는 비밀번호가 올바르지 않습니다.'
  if(message.indexOf('auth/user-not-found') >= 0) return '등록되지 않은 아이디입니다.'
  if(message.indexOf('already-submitted') >= 0) return '이미 제출된 세트입니다.'
  return message || '처리를 완료하지 못했습니다.'
}

function formatAdminTime(value){
  if(!value) return ''
  const date = new Date(value)
  if(Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('ko-KR', { hour12: false })
}
