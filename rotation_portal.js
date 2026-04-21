const PORTAL_STORAGE_KEYS = {
  users: 'rotation_portal_users_v1',
  currentUserId: 'rotation_portal_current_user_v1',
  responses: 'rotation_portal_check_responses_v1'
}

const PORTAL_CONFIG = window.ROTATION_PORTAL_CONFIG || {}
const PORTAL_CLASS_REFERENCE = [
  { id: 'class-1-gangseo-b', name: '1강서B' },
  { id: 'class-2-gangseo-a', name: '2강서A' },
  { id: 'class-3-gangseo', name: '3강서' },
  { id: 'class-1-seonbu', name: '1선부' },
  { id: 'class-2-seonbu', name: '2선부' },
  { id: 'class-3-seonbu', name: '3선부' },
  { id: 'class-1-gangseo-a', name: '1강서A' },
  { id: 'class-2-gangseo-b', name: '2강서B' },
  { id: 'class-1-danwon', name: '1단원' },
  { id: 'class-2-danwon', name: '2단원' },
  { id: 'class-3-danwon', name: '3단원' }
]

const portalState = {
  mode: 'login',
  authProvider: 'local',
  authResolved: false,
  firebaseEnabled: false,
  auth: null,
  db: null,
  storage: null,
  currentUser: null,
  currentProfile: null,
  checkData: null,
  currentCheckSet: null,
  currentCheckSubmission: null,
  isSubmittingCheck: false,
  adminClassFilter: 'all',
  adminStudentFilter: ''
}

document.addEventListener('DOMContentLoaded', initPortal)

function initPortal(){
  applyPortalCopy()
  bindPortalEvents()
  initPortalBackend()
}

function applyPortalCopy(){
  const authTagline = document.querySelector('#auth-screen .tagline')
  if(authTagline) authTagline.textContent = '로그인 후 PREP과 CHECK를 이용하세요.'
  const authLogo = document.querySelector('#auth-screen .logo')
  if(authLogo) authLogo.textContent = 'CODE LAB'
  const authOverlayFooter = document.querySelector('#auth-screen .prep-footer.overlay')
  if(authOverlayFooter) authOverlayFooter.style.display = 'none'
  const authTitle = document.querySelector('#auth-screen .auth-card')
  if(authTitle){
    const titleNode = authTitle.querySelector('.auth-help')
    if(titleNode) titleNode.textContent = ''
  }

  setFieldLabel('auth-email', '아이디')
  setFieldLabel('auth-password', '비밀번호')
  setPlaceholder('auth-email', 'student01')
  setPlaceholder('auth-password', '비밀번호')

  setElementText('portal-refresh-btn', '새로고침')
  setElementText('portal-logout-btn', '로그아웃')
  setElementText('portal-password-btn', '비밀번호 변경')
  setElementText('portal-user-name', '학생')
  setElementText('portal-user-meta', '')
  setHeadingText('#portal-screen .hd h1', 'CODE LAB')
  setHeadingText('#counsel-screen .hd h1', 'COUNSEL')
  setHeadingText('#check-screen .hd h1', 'CHECK')
  setHeadingText('#check-set-screen .hd h1', 'CHECK')
  setHeadingText('#admin-screen .hd h1', 'ADMIN')
  setQueryText('#portal-screen .portal-user-label', '현재 로그인')
  setQueryText('#check-screen .class-bar-label', '현재 반')
  setQueryText('#check-set-screen .class-bar-label', '현재 CHECK 세트')
  hydratePortalCard('portal-prep-btn', '학습', 'PREP', '내 반에 배정된 세트를 열고 지문을 미리 공부합니다.')
  hydratePortalCard('portal-check-btn', '제출', 'CHECK', '푼 문제만 제출하고, 제출한 문항의 정답과 해설을 바로 확인합니다.')
  hydratePortalCard('portal-admin-btn', '관리', 'ADMIN', '학생별 오답과 문제 유형별 통계를 확인합니다.')

  setElementText('check-back-btn', '메인')
  setElementText('check-refresh-btn', '새로고침')
  setElementText('check-set-back-btn', '이전 페이지')
  setElementText('check-set-home-btn', '메인')
  setElementText('check-submit-btn', '이번에 푼 문제 제출')
  setElementText('admin-back-btn', '메인')
  setElementText('admin-refresh-btn', '새로고침')
  setElementText('password-back-btn', '이전 페이지')
  setElementText('password-home-btn', '홈')
  setElementText('password-submit-btn', '비밀번호 저장')
}

function setFieldLabel(fieldId, text){
  const field = document.getElementById(fieldId)
  const label = field && field.parentElement ? field.parentElement.querySelector('span') : null
  if(label) label.textContent = text
}

function setPlaceholder(fieldId, text){
  const field = document.getElementById(fieldId)
  if(field) field.placeholder = text
}

function setElementText(id, text){
  const node = document.getElementById(id)
  if(node) node.textContent = text
}

function setQueryText(selector, text){
  const node = document.querySelector(selector)
  if(node) node.textContent = text
}

function setHeadingText(selector, text){
  const node = document.querySelector(selector)
  if(node) node.textContent = text
}

function hydratePortalCard(id, kicker, title, desc){
  const card = document.getElementById(id)
  if(!card) return
  const kickerNode = card.querySelector('.portal-kicker')
  const titleNode = card.querySelector('.portal-title')
  const descNode = card.querySelector('.portal-desc')
  if(kickerNode) kickerNode.textContent = kicker
  if(titleNode) titleNode.textContent = title
  if(descNode) descNode.textContent = ''
}

function bindPortalEvents(){
  const loginTab = document.getElementById('auth-login-tab')
  const submitBtn = document.getElementById('auth-submit-btn')
  const portalPrepBtn = document.getElementById('portal-prep-btn')
  const portalCheckBtn = document.getElementById('portal-check-btn')
  const portalCounselBtn = document.getElementById('portal-counsel-btn')
  const portalAdminBtn = document.getElementById('portal-admin-btn')
  const portalRefreshBtn = document.getElementById('portal-refresh-btn')
  const portalLogoutBtn = document.getElementById('portal-logout-btn')
  const portalPasswordBtn = document.getElementById('portal-password-btn')
  const counselBackBtn = document.getElementById('counsel-back-btn')
  const checkBackBtn = document.getElementById('check-back-btn')
  const checkRefreshBtn = document.getElementById('check-refresh-btn')
  const checkChangeClassBtn = document.getElementById('check-change-class-btn')
  const checkSetBackBtn = document.getElementById('check-set-back-btn')
  const checkSetHomeBtn = document.getElementById('check-set-home-btn')
  const checkSubmitBtn = document.getElementById('check-submit-btn')
  const adminBackBtn = document.getElementById('admin-back-btn')
  const adminRefreshBtn = document.getElementById('admin-refresh-btn')
  const adminClassFilter = document.getElementById('admin-class-filter')
  const passwordBackBtn = document.getElementById('password-back-btn')
  const passwordHomeBtn = document.getElementById('password-home-btn')
  const passwordSubmitBtn = document.getElementById('password-submit-btn')

  if(loginTab) loginTab.addEventListener('click', function(){ activatePortalScreen('auth-screen') })
  if(submitBtn) submitBtn.addEventListener('click', submitAuthForm)
  if(portalPrepBtn) portalPrepBtn.addEventListener('click', openPrepPortal)
  if(portalCheckBtn) portalCheckBtn.addEventListener('click', openCheckPortal)
  if(portalCounselBtn) portalCounselBtn.addEventListener('click', openCounselPortal)
  if(portalAdminBtn) portalAdminBtn.addEventListener('click', openAdminPortal)
  if(portalRefreshBtn) portalRefreshBtn.addEventListener('click', refreshPortalData)
  if(portalLogoutBtn) portalLogoutBtn.addEventListener('click', logoutPortal)
  if(portalPasswordBtn) portalPasswordBtn.addEventListener('click', function(){ openPasswordScreen(false) })
  if(checkBackBtn) checkBackBtn.addEventListener('click', showPortalScreen)
  if(checkRefreshBtn) checkRefreshBtn.addEventListener('click', refreshCheckDataAndRender)
  if(checkSetBackBtn) checkSetBackBtn.addEventListener('click', showCheckScreen)
  if(checkSetHomeBtn) checkSetHomeBtn.addEventListener('click', showPortalScreen)
  if(checkSubmitBtn) checkSubmitBtn.addEventListener('click', submitCurrentCheckSet)
  if(adminBackBtn) adminBackBtn.addEventListener('click', showPortalScreen)
  if(adminRefreshBtn) adminRefreshBtn.addEventListener('click', openAdminPortal)
  if(adminClassFilter) adminClassFilter.addEventListener('change', function(event){
    portalState.adminClassFilter = String(event.target.value || 'all').trim() || 'all'
    renderAdminScreen()
  })
  if(passwordBackBtn) passwordBackBtn.addEventListener('click', showPortalScreen)
  if(passwordHomeBtn) passwordHomeBtn.addEventListener('click', showPortalScreen)
  if(passwordSubmitBtn) passwordSubmitBtn.addEventListener('click', submitPasswordChange)

  const emailField = document.getElementById('auth-email')
  const passwordField = document.getElementById('auth-password')
  if(emailField){
    emailField.addEventListener('keydown', function(event){
      if(event.key === 'Enter') submitAuthForm()
    })
  }
  if(passwordField){
    passwordField.addEventListener('keydown', function(event){
      if(event.key === 'Enter') submitAuthForm()
    })
  }
}

function initPortalBackend(){
  if(isFirebaseConfigured()){
    initFirebasePortal()
    return
  }
  initLocalPortal()
}

function isFirebaseConfigured(){
  const config = window.ROTATION_FIREBASE_CONFIG || {}
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId']
  return !!window.firebase &&
    requiredKeys.every(function(key){
      return typeof config[key] === 'string' && config[key].trim()
    })
}

function initFirebasePortal(){
  const config = window.ROTATION_FIREBASE_CONFIG || {}
  try{
    if(!firebase.apps.length) firebase.initializeApp(config)
    portalState.firebaseEnabled = true
    portalState.authProvider = 'firebase'
    portalState.auth = firebase.auth()
    portalState.db = firebase.firestore()
    portalState.storage = typeof firebase.storage === 'function' ? firebase.storage() : null
    setAuthMeta('Firebase 인증과 Firestore 저장이 연결되었습니다.')
    setTimeout(function(){
      if(portalState.authResolved) return
      portalState.authResolved = true
      portalState.currentUser = null
      portalState.currentProfile = null
      routePortalAfterState()
    }, 2500)
    portalState.auth.onAuthStateChanged(function(user){
      handleResolvedAuthUser(user).catch(function(error){
        console.error(error)
        portalState.authResolved = true
        portalState.currentUser = null
        portalState.currentProfile = null
        setAuthError('로그인 정보를 불러오지 못했습니다.')
        routePortalAfterState()
      })
    })
  }catch(error){
    console.error(error)
    setAuthMeta('Firebase 연결에 실패하여 이 브라우저의 임시 저장 모드로 전환합니다.')
    initLocalPortal()
  }
}

function initLocalPortal(){
  portalState.firebaseEnabled = false
  portalState.authProvider = 'local'
  portalState.authResolved = true
  const currentUserId = localStorage.getItem(PORTAL_STORAGE_KEYS.currentUserId) || ''
  const users = readLocalUsers()
  const localUser = users.find(function(user){ return user.id === currentUserId }) || null
  portalState.currentUser = localUser ? buildLocalAuthUser(localUser) : null
  portalState.currentProfile = localUser ? localUser : null
  setAuthMeta('Firebase 설정 전까지는 이 기기 브라우저에만 저장되는 미리보기 모드로 동작합니다.')
  routePortalAfterState()
}

async function handleResolvedAuthUser(user){
  portalState.authResolved = true
  portalState.currentUser = user
  portalState.currentProfile = user ? await fetchOrCreateUserProfile(user) : null
  routePortalAfterState()
}

function routePortalAfterState(){
  syncAuthClassOptions()
  unlockAllPrepClasses()
  if(!bundleData) return
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
  showPortalScreen()
  handlePortalHashRoute()
}

async function submitAuthForm(){
  clearAuthError()
  const email = String(document.getElementById('auth-email').value || '').trim()
  const password = String(document.getElementById('auth-password').value || '').trim()

  if(!email || !password){
    setAuthError('아이디와 비밀번호를 입력해 주세요.')
    return
  }

  setAuthLoading(true)
  try{
    await loginPortalUser(email, password)
    clearAuthFields()
  }catch(error){
    setAuthError(getPortalErrorMessage(error))
  }finally{
    setAuthLoading(false)
  }
}

async function loginPortalUser(email, password){
  if(portalState.firebaseEnabled){
    await portalState.auth.signInWithEmailAndPassword(email, password)
    return
  }

  const user = readLocalUsers().find(function(entry){
    return entry.email.toLowerCase() === email.toLowerCase() && entry.password === password
  })
  if(!user) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')

  localStorage.setItem(PORTAL_STORAGE_KEYS.currentUserId, user.id)
  portalState.currentUser = buildLocalAuthUser(user)
  portalState.currentProfile = user
  routePortalAfterState()
}

async function logoutPortal(){
  if(portalState.firebaseEnabled){
    await portalState.auth.signOut()
    return
  }
  localStorage.removeItem(PORTAL_STORAGE_KEYS.currentUserId)
  portalState.currentUser = null
  portalState.currentProfile = null
  portalState.currentCheckSet = null
  portalState.currentCheckSubmission = null
  routePortalAfterState()
}

async function fetchOrCreateUserProfile(user){
  const snapshot = await portalState.db.collection('users').doc(user.uid).get()
  if(snapshot.exists){
    return normalizeUserProfile(Object.assign({ uid: user.uid }, snapshot.data()))
  }

  const fallbackClassId = prepClasses[0] ? prepClasses[0].id : ''
  const profile = {
    uid: user.uid,
    loginId: user.email ? String(user.email).split('@', 1)[0] : '',
    email: user.email || '',
    name: user.displayName || '',
    studentId: '',
    classIds: fallbackClassId ? [fallbackClassId] : [],
    role: 'student',
    adminScope: 'assigned',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  await saveFirebaseUserProfile(user.uid, profile)
  return normalizeUserProfile(profile)
}

async function saveFirebaseUserProfile(uid, profile){
  await portalState.db.collection('users').doc(uid).set(profile, { merge: true })
}

function normalizeUserProfile(source){
  const classIds = Array.isArray(source && source.classIds)
    ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    : []
  return {
    uid: String(source && (source.uid || source.id) || '').trim(),
    loginId: String(source && source.loginId || '').trim(),
    email: String(source && source.email || '').trim(),
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: classIds,
    role: String(source && source.role || 'student').trim() || 'student',
    adminScope: normalizeAdminScopeValue(source && source.adminScope),
    loginDisabled: !!(source && source.loginDisabled),
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function buildLocalAuthUser(user){
  return {
    uid: user.id,
    email: user.email,
    loginId: user.loginId || user.studentId || ''
  }
}

function readLocalUsers(){
  try{
    const raw = localStorage.getItem(PORTAL_STORAGE_KEYS.users)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(normalizeUserProfileLocal) : []
  }catch(error){
    return []
  }
}

function writeLocalUsers(users){
  localStorage.setItem(PORTAL_STORAGE_KEYS.users, JSON.stringify(users))
}

function normalizeUserProfileLocal(source){
  return {
    id: String(source && source.id || '').trim(),
    loginId: String(source && source.loginId || '').trim(),
    email: String(source && source.email || '').trim(),
    password: String(source && source.password || '').trim(),
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: Array.isArray(source && source.classIds) ? source.classIds.slice() : [],
    role: String(source && source.role || 'student').trim() || 'student',
    adminScope: normalizeAdminScopeValue(source && source.adminScope),
    loginDisabled: !!(source && source.loginDisabled),
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function readLocalResponses(){
  try{
    const raw = localStorage.getItem(PORTAL_STORAGE_KEYS.responses)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  }catch(error){
    return []
  }
}

function writeLocalResponses(rows){
  localStorage.setItem(PORTAL_STORAGE_KEYS.responses, JSON.stringify(rows))
}

function syncAuthClassOptions(){
  const select = document.getElementById('auth-class-select')
  if(!select) return
  if(!prepClasses.length){
    select.innerHTML = '<option value="">반 정보 없음</option>'
    return
  }
  select.innerHTML = prepClasses.map(function(classInfo){
    return '<option value="' + escapeHtml(classInfo.id) + '">' + escapeHtml(classInfo.name) + '</option>'
  }).join('')
}

function updatePortalUserCard(){
  const profile = portalState.currentProfile
  const name = profile && profile.name ? profile.name : (portalState.currentUser && portalState.currentUser.email) || '학생'
  const classNames = getProfileClassNames()
  const roleLabel = getPortalRoleLabel()
  document.getElementById('portal-user-name').textContent = name
  document.getElementById('portal-user-meta').textContent =
    [roleLabel, classNames.join(', ') || '반 미지정', profile && profile.studentId ? ('ID ' + profile.studentId) : '']
      .filter(Boolean)
      .join(' · ')
  document.getElementById('portal-admin-btn').classList.toggle('hidden', !isPortalAdmin())
}

function getProfileClassNames(){
  const allowedIds = getProfileClassIds()
  const knownClasses = getPortalKnownClasses()
  return allowedIds.map(function(classId){
    const match = knownClasses.find(function(classInfo){
      return classInfo.id === classId
    })
    return match ? classInfoName(match) : classId
  }).filter(Boolean)
}

function classInfoName(classInfo){
  return String(classInfo && classInfo.name || '').trim() || String(classInfo && classInfo.id || '').trim()
}

function getProfileClassIds(){
  return Array.isArray(portalState.currentProfile && portalState.currentProfile.classIds)
    ? portalState.currentProfile.classIds.filter(Boolean)
    : []
}

function normalizeCheckAssignmentValues(value){
  const values = Array.isArray(value) ? value : (value == null || value === '' ? [] : [value])
  return Array.from(new Set(values.map(function(entry){
    return String(entry || '').trim()
  }).filter(Boolean)))
}

function normalizeCheckAssignmentMode(value){
  return String(value || '').trim().toLowerCase()
}

function normalizeCheckAssignmentEmail(value){
  return String(value || '').trim().toLowerCase()
}

function getCheckSetTargetUserIds(checkSet){
  return normalizeCheckAssignmentValues(checkSet && checkSet.targetUserIds)
}

function getCheckSetTargetStudentIds(checkSet){
  return normalizeCheckAssignmentValues(
    normalizeCheckAssignmentValues(checkSet && checkSet.targetStudentIds).concat(
      normalizeCheckAssignmentValues(checkSet && checkSet.targetStudentId),
      normalizeCheckAssignmentValues(checkSet && checkSet.targetLoginIds)
    )
  )
}

function getCheckSetTargetLoginIds(checkSet){
  return normalizeCheckAssignmentValues(checkSet && checkSet.targetLoginIds)
}

function getCheckSetTargetEmails(checkSet){
  return normalizeCheckAssignmentValues(checkSet && checkSet.targetEmails)
}

function getCheckSetTargetStudentNames(checkSet){
  return normalizeCheckAssignmentValues(
    normalizeCheckAssignmentValues(checkSet && checkSet.targetStudentNames).concat(
      normalizeCheckAssignmentValues(checkSet && checkSet.targetStudentName)
    )
  )
}

function isPersonalCheckSet(checkSet){
  const mode = normalizeCheckAssignmentMode(checkSet && checkSet.assignmentMode)
  return mode === 'student' ||
    mode === 'personal' ||
    getCheckSetTargetUserIds(checkSet).length > 0 ||
    getCheckSetTargetStudentIds(checkSet).length > 0 ||
    getCheckSetTargetEmails(checkSet).length > 0 ||
    getCheckSetTargetStudentNames(checkSet).length > 0
}

function hasStrongCheckSetTargets(checkSet){
  return getCheckSetTargetUserIds(checkSet).length > 0 ||
    getCheckSetTargetStudentIds(checkSet).length > 0 ||
    getCheckSetTargetEmails(checkSet).length > 0
}

function getCurrentCheckAssignmentIdentity(){
  const profile = portalState.currentProfile || {}
  const user = portalState.currentUser || {}
  return {
    userIds: normalizeCheckAssignmentValues([user.uid, profile.uid, profile.id]),
    studentIds: normalizeCheckAssignmentValues([profile.studentId, profile.loginId, user.loginId]),
    emails: normalizeCheckAssignmentValues([profile.email, user.email]).map(normalizeCheckAssignmentEmail).filter(Boolean),
    names: normalizeCheckAssignmentValues([profile.name])
  }
}

function checkAssignmentListContains(values, targets, normalizer){
  const normalize = typeof normalizer === 'function'
    ? normalizer
    : function(value){ return String(value || '').trim().toLowerCase() }
  const valueSet = new Set(normalizeCheckAssignmentValues(values).map(normalize).filter(Boolean))
  return normalizeCheckAssignmentValues(targets).some(function(target){
    return valueSet.has(normalize(target))
  })
}

function isCheckSetAssignedToCurrentStudent(checkSet){
  if(!isPersonalCheckSet(checkSet)) return true
  const identity = getCurrentCheckAssignmentIdentity()
  if(checkAssignmentListContains(identity.userIds, getCheckSetTargetUserIds(checkSet))) return true
  if(checkAssignmentListContains(identity.studentIds, getCheckSetTargetStudentIds(checkSet))) return true
  if(checkAssignmentListContains(identity.emails, getCheckSetTargetEmails(checkSet), normalizeCheckAssignmentEmail)) return true

  if(!hasStrongCheckSetTargets(checkSet)){
    return checkAssignmentListContains(identity.names, getCheckSetTargetStudentNames(checkSet))
  }
  return false
}

function buildCheckSetAssignmentMetaText(checkSet){
  if(!isPersonalCheckSet(checkSet)) return ''
  const labels = getCheckSetTargetStudentNames(checkSet)
    .concat(getCheckSetTargetStudentIds(checkSet))
    .concat(getCheckSetTargetEmails(checkSet))
    .concat(getCheckSetTargetUserIds(checkSet))
  const uniqueLabels = Array.from(new Set(labels.map(function(value){
    return String(value || '').trim()
  }).filter(Boolean)))
  return uniqueLabels.length
    ? ('개인지정 · ' + uniqueLabels.slice(0, 3).join(', ') + (uniqueLabels.length > 3 ? ' 외 ' + (uniqueLabels.length - 3) + '명' : ''))
    : '개인지정'
}

function getPortalRole(){
  return String(portalState.currentProfile && portalState.currentProfile.role || 'student').trim().toLowerCase() || 'student'
}

function normalizeAdminScopeValue(value){
  return String(value || 'assigned').trim().toLowerCase() === 'all' ? 'all' : 'assigned'
}

function getPortalAdminScope(){
  if(getPortalRole() !== 'admin') return 'assigned'
  return normalizeAdminScopeValue(portalState.currentProfile && portalState.currentProfile.adminScope)
}

function isPortalAdmin(){
  return getPortalRole() === 'admin'
}

function isPortalSuperAdmin(){
  return isPortalAdmin() && getPortalAdminScope() === 'all'
}

function getPortalRoleLabel(){
  if(isPortalSuperAdmin()) return '최고 관리자'
  if(isPortalAdmin()) return '관리자'
  return '학생'
}

function unlockAllPrepClasses(){
  isUnlocked = true
  prepClasses.forEach(function(classInfo){
    unlockedClassIds[classInfo.id] = true
  })
}

function activatePortalScreen(screenId){
  if(typeof stopPrepVideoPlaybackBeforeScreenChange === 'function'){
    stopPrepVideoPlaybackBeforeScreenChange(screenId)
  }
  document.querySelectorAll('.screen').forEach(function(screen){
    screen.classList.remove('active')
  })
  const target = document.getElementById(screenId)
  if(target) target.classList.add('active')
  resetViewportPosition()
}

function showAuthScreen(errorMessage){
  syncAuthClassOptions()
  if(errorMessage) setAuthError(errorMessage)
  activatePortalScreen('auth-screen')
}

function showPortalScreen(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  updatePortalUserCard()
  activatePortalScreen('portal-screen')
}

function clearAuthFields(){
  document.getElementById('auth-password').value = ''
}

function clearAuthError(){
  setAuthError('')
}

function setAuthError(message){
  document.getElementById('auth-error').textContent = message || ''
}

function setAuthMeta(message){
  const node = document.getElementById('auth-meta')
  if(!node) return
  node.textContent = message || ''
}

function setAuthLoading(isLoading){
  const button = document.getElementById('auth-submit-btn')
  button.disabled = !!isLoading
  button.textContent = isLoading ? '처리 중...' : '로그인'
}

function openPasswordScreen(){
  document.getElementById('password-current').value = ''
  document.getElementById('password-next').value = ''
  document.getElementById('password-confirm').value = ''
  document.getElementById('password-error').textContent = ''
  activatePortalScreen('password-screen')
}

async function submitPasswordChange(){
  const currentPassword = String(document.getElementById('password-current').value || '').trim()
  const nextPassword = String(document.getElementById('password-next').value || '').trim()
  const confirmPassword = String(document.getElementById('password-confirm').value || '').trim()

  if(!currentPassword || !nextPassword || !confirmPassword){
    document.getElementById('password-error').textContent = '모든 칸을 입력해 주세요.'
    return
  }
  if(nextPassword.length < 6){
    document.getElementById('password-error').textContent = '새 비밀번호는 6자 이상으로 입력해 주세요.'
    return
  }
  if(nextPassword !== confirmPassword){
    document.getElementById('password-error').textContent = '새 비밀번호 확인이 일치하지 않습니다.'
    return
  }

  try{
    if(portalState.firebaseEnabled){
      const user = portalState.auth.currentUser
      if(!user || !user.email) throw new Error('로그인 정보를 확인할 수 없습니다.')
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword)
      await user.reauthenticateWithCredential(credential)
      await user.updatePassword(nextPassword)
    }else{
      const currentUserId = portalState.currentUser ? portalState.currentUser.uid : ''
      const users = readLocalUsers()
      const targetIndex = users.findIndex(function(user){
        return user.id === currentUserId
      })
      if(targetIndex < 0) throw new Error('계정 정보를 찾지 못했습니다.')
      if(users[targetIndex].password !== currentPassword) throw new Error('현재 비밀번호가 올바르지 않습니다.')
      users[targetIndex].password = nextPassword
      users[targetIndex].updatedAt = new Date().toISOString()
      writeLocalUsers(users)
      portalState.currentProfile = users[targetIndex]
      portalState.currentUser = buildLocalAuthUser(users[targetIndex])
    }

    document.getElementById('password-error').textContent = ''
    showToast('비밀번호를 변경했습니다.', 'var(--green)')
    showPortalScreen()
  }catch(error){
    document.getElementById('password-error').textContent = getPasswordChangeErrorMessage(error)
  }
}

function getPasswordChangeErrorMessage(error){
  const message = String(error && error.message || '')
  if(message.indexOf('auth/wrong-password') >= 0) return '현재 비밀번호가 올바르지 않습니다.'
  if(message.indexOf('auth/weak-password') >= 0) return '새 비밀번호가 너무 약합니다.'
  if(message.indexOf('auth/requires-recent-login') >= 0) return '보안을 위해 다시 로그인한 뒤 비밀번호를 바꿔 주세요.'
  return message || '비밀번호를 변경하지 못했습니다.'
}

async function refreshPortalData(){
  if(portalState.firebaseEnabled && portalState.currentUser){
    portalState.currentProfile = await fetchOrCreateUserProfile(portalState.currentUser)
  }else if(portalState.currentProfile && !portalState.firebaseEnabled){
    const localUser = readLocalUsers().find(function(user){
      return user.id === (portalState.currentProfile.uid || portalState.currentUser.uid)
    }) || null
    if(localUser){
      portalState.currentProfile = localUser
      portalState.currentUser = buildLocalAuthUser(localUser)
    }
  }

  const loaded = await loadRemoteSession({ silent: true, silentToast: true })
  if(loaded){
    showToast('최신 session.json을 다시 불러왔습니다.', 'var(--green)')
  }else{
    showToast('session.json을 다시 불러오지 못했습니다.', 'var(--red)')
  }
  await ensureCheckData(true)
  routePortalAfterState()
}

function ensureStudentPrepSelection(){
  const classIds = getProfileClassIds()
  const targetId = classIds[0]
  if(!targetId) return false
  const targetIndex = prepClasses.findIndex(function(classInfo){
    return classInfo.id === targetId
  })
  if(targetIndex < 0) return false
  if(currentClassIndex !== targetIndex){
    selectClass(targetIndex, { stayOnCurrent: true })
  }else{
    ensureCurrentSetSelection()
    updateSetProgressContext()
    renderClassSummary()
    renderDash()
  }
  return true
}

function getVisiblePortalPrepClassEntries(){
  if(!portalState.currentUser) {
    return prepClasses.map(function(classInfo, index){
      return { classInfo: classInfo, index: index }
    })
  }
  if(isPortalSuperAdmin()){
    return prepClasses.map(function(classInfo, index){
      return { classInfo: classInfo, index: index }
    })
  }

  const allowedIds = getProfileClassIds()
  return prepClasses.map(function(classInfo, index){
    return { classInfo: classInfo, index: index }
  }).filter(function(entry){
    return allowedIds.indexOf(entry.classInfo.id) >= 0
  })
}

function ensurePortalCheckSelection(){
  const visibleEntries = getVisiblePortalPrepClassEntries()
  if(!visibleEntries.length) return false
  const currentEntry = visibleEntries.find(function(entry){
    return entry.index === currentClassIndex
  }) || visibleEntries[0]
  if(currentClassIndex !== currentEntry.index){
    selectClass(currentEntry.index, { stayOnCurrent: true })
  }
  return true
}

function getActivePortalCheckClass(){
  const visibleEntries = getVisiblePortalPrepClassEntries()
  if(!visibleEntries.length) return null
  return visibleEntries.find(function(entry){
    return entry.index === currentClassIndex
  }) || visibleEntries[0]
}

function getActivePortalCheckClassIds(){
  const activeEntry = getActivePortalCheckClass()
  if(activeEntry && activeEntry.classInfo && activeEntry.classInfo.id){
    return [activeEntry.classInfo.id]
  }
  return getProfileClassIds()
}

function ensureScopedAdminPrepSelection(){
  const visibleEntries = getVisiblePortalPrepClassEntries()
  if(!visibleEntries.length) return false
  const currentEntry = visibleEntries.find(function(entry){
    return entry.index === currentClassIndex
  }) || visibleEntries[0]
  if(currentClassIndex !== currentEntry.index){
    selectClass(currentEntry.index, { stayOnCurrent: true })
  }else{
    ensureCurrentSetSelection()
    updateSetProgressContext()
    renderClassSummary()
    renderDash()
  }
  return true
}

function hideAllScreensBeforePrep(){
  if(typeof stopPrepVideoPlaybackBeforeScreenChange === 'function'){
    stopPrepVideoPlaybackBeforeScreenChange('prep-route')
  }
  document.querySelectorAll('.screen').forEach(function(screen){
    screen.classList.remove('active')
  })
}

function openPrepPortal(){
  hideAllScreensBeforePrep()
  if(isPortalAdmin()){
    if(!prepClasses.length){
      showToast('연결된 PREP 반 정보가 없습니다.', 'var(--red)')
      showPortalScreen()
      return
    }
    if(!ensureScopedAdminPrepSelection()){
      showToast('로그인 계정에 연결된 PREP 반 정보가 없습니다.', 'var(--red)')
      showPortalScreen()
      return
    }
    showPassageScreen()
    return
  }

  if(!ensureStudentPrepSelection()){
    showToast('로그인 계정에 연결된 반 정보가 없습니다.', 'var(--red)')
    showPortalScreen()
    return
  }
  showPassageScreen()
}

function handlePortalHashRoute(){
  const hash = String(window.location.hash || '').toLowerCase()
  if(hash === '#prep'){
    history.replaceState(null, '', window.location.pathname + window.location.search)
    openPrepPortal()
    return
  }
  if(hash === '#check'){
    history.replaceState(null, '', window.location.pathname + window.location.search)
    openCheckPortal()
    return
  }
  if(hash === '#check-first'){
    history.replaceState(null, '', window.location.pathname + window.location.search)
    openCheckPortal().then(function(){
      const firstSet = getVisibleCheckSets().find(function(entry){ return entry.isAccessible }) || null
      if(firstSet) openCheckSetPortal(firstSet.id)
    })
    return
  }
  if(hash === '#admin' && isPortalAdmin()){
    history.replaceState(null, '', window.location.pathname + window.location.search)
    openAdminPortal()
  }
}

async function openCheckPortal(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  ensurePortalCheckSelection()
  await ensureCheckData(false)
  if(!portalState.firebaseEnabled) ensureCurrentLocalUserHasClass()
  renderCheckScreen()
  activatePortalScreen('check-screen')
}

function openCheckClassPicker(){
  portalState.classSelectionReturnScreen = 'check-screen'
  showClassScreen()
}

async function refreshCheckDataAndRender(){
  await ensureCheckData(true)
  if(!portalState.firebaseEnabled) ensureCurrentLocalUserHasClass()
  if(document.getElementById('check-screen').classList.contains('active')){
    renderCheckScreen()
  }else if(document.getElementById('check-set-screen').classList.contains('active')){
    renderCurrentCheckSet()
  }
  showToast('CHECK 데이터를 새로고침했습니다.', 'var(--green)')
}

async function openAdminPortal(){
  if(!isPortalAdmin()){
    showToast('관리자 계정만 통계를 볼 수 있습니다.', 'var(--red)')
    return
  }
  await ensureCheckData(false)
  await renderAdminScreen()
  activatePortalScreen('admin-screen')
}

async function ensureCheckData(forceReload){
  if(portalState.checkData && !forceReload) return portalState.checkData
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
    portalState.checkData = { updatedAt: '', checkSets: [] }
    return portalState.checkData
  }
}

function normalizeCheckData(source){
  return {
    updatedAt: String(source && source.updatedAt || '').trim(),
    classes: (Array.isArray(source && source.classes) ? source.classes : []).map(function(entry){
      return {
        id: String(entry && entry.id || '').trim(),
        name: String(entry && entry.name || '').trim()
      }
    }).filter(function(entry){
      return entry.id
    }),
    checkSets: (Array.isArray(source && source.checkSets) ? source.checkSets : []).map(function(entry, index){
      const targetStudentIds = normalizeCheckAssignmentValues(
        normalizeCheckAssignmentValues(entry && entry.targetStudentIds).concat(
          normalizeCheckAssignmentValues(entry && entry.targetStudentId)
        )
      )
      const targetLoginIds = normalizeCheckAssignmentValues(entry && entry.targetLoginIds)
      const targetStudentNames = normalizeCheckAssignmentValues(
        normalizeCheckAssignmentValues(entry && entry.targetStudentNames).concat(
          normalizeCheckAssignmentValues(entry && entry.targetStudentName)
        )
      )
      return {
        id: String(entry && entry.id || ('check-set-' + (index + 1))).trim(),
        title: String(entry && entry.title || ('CHECK 세트 ' + (index + 1))).trim(),
        description: String(entry && entry.description || '').trim(),
        classIds: Array.isArray(entry && entry.classIds) ? entry.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean) : [],
        availableFrom: String(entry && entry.availableFrom || '').trim(),
        availableTo: String(entry && entry.availableTo || '').trim(),
        assignmentMode: normalizeCheckAssignmentMode(entry && entry.assignmentMode),
        targetUserIds: normalizeCheckAssignmentValues(entry && entry.targetUserIds),
        targetStudentIds: targetStudentIds,
        targetLoginIds: targetLoginIds,
        targetStudentId: String(entry && entry.targetStudentId || '').trim(),
        targetEmails: normalizeCheckAssignmentValues(entry && entry.targetEmails),
        targetStudentNames: targetStudentNames,
        targetStudentName: String(entry && entry.targetStudentName || '').trim(),
        source: String(entry && entry.source || '').trim(),
        sourceBatchId: String(entry && entry.sourceBatchId || '').trim(),
        sourceSetId: String(entry && entry.sourceSetId || '').trim(),
        sourceRound: String(entry && entry.sourceRound || '').trim(),
        createdByLab: String(entry && entry.createdByLab || '').trim(),
        questions: (Array.isArray(entry && entry.questions) ? entry.questions : []).map(function(question, questionIndex){
          const type = normalizeCheckQuestionType(question && question.type)
          const number = normalizeCheckQuestionNumber(question && question.number, questionIndex + 1)
          return {
            id: String(question && question.id || ('q-' + number)).trim(),
            number: number,
            type: type,
            problemType: normalizeCheckProblemType(question && (question.problemType || question.category || question.questionCategory)),
            prompt: String(question && question.prompt || ('문항 ' + number)).trim(),
            answer: normalizeCheckAnswerByType(type, question && question.answer),
            acceptableAnswers: normalizeCheckAcceptableAnswers(type, question && question.acceptableAnswers),
            explanation: String(question && question.explanation || '').trim()
          }
        }).filter(function(question){
          return question.type === '주관식' || question.answer || question.explanation
        })
      }
    }).filter(function(entry){
      return entry.questions.length > 0
    })
  }
}

function showCheckScreen(){
  renderCheckScreen()
  activatePortalScreen('check-screen')
}

function renderCheckScreen(){
  const checkSets = getVisibleCheckSets()
  const activeClassEntry = getActivePortalCheckClass()
  const activeClassName = activeClassEntry && activeClassEntry.classInfo
    ? classInfoName(activeClassEntry.classInfo)
    : (getProfileClassNames()[0] || '반 미지정')
  const visibleClassEntries = getVisiblePortalPrepClassEntries()
  const checkChangeClassBtn = document.getElementById('check-change-class-btn')
  const activeCount = checkSets.filter(function(entry){
    return entry.status === 'active' || entry.status === 'always'
  }).length
  const upcomingCount = checkSets.filter(function(entry){
    return entry.status === 'upcoming'
  }).length
  const endedCount = checkSets.filter(function(entry){
    return entry.status === 'ended'
  }).length
  document.getElementById('check-class-name').textContent = activeClassName
  document.getElementById('check-class-meta').textContent = ''
  if(checkChangeClassBtn){
    const canChangeClass = visibleClassEntries.length > 1 && !(typeof window.isPortalStudentLockedClass === 'function' && window.isPortalStudentLockedClass())
    checkChangeClassBtn.classList.toggle('hidden', !canChangeClass)
  }
  document.getElementById('check-stats').innerHTML = [
    renderStat(checkSets.length, '세트'),
    renderStat(activeCount, '진행 중'),
    renderStat(upcomingCount, '예정'),
    renderStat(endedCount, '종료')
  ].join('')

  const list = document.getElementById('check-set-list')
  if(!checkSets.length){
    list.innerHTML = '<div class="empty-box">현재 열려 있는 CHECK 세트가 없습니다.</div>'
    return
  }

  list.innerHTML = checkSets.map(function(entry, index){
    const disabledClass = entry.isAccessible ? '' : ' disabled'
    const assignmentText = isPortalAdmin() ? buildCheckSetAssignmentMetaText(entry) : ''
    const metaBits = [entry.questions.length + '문항', getCheckSetDateText(entry)]
    if(assignmentText) metaBits.push(assignmentText)
    return '' +
      '<div class="set-item' + disabledClass + '"' + (entry.isAccessible ? ' onclick="openCheckSetPortal(\'' + escapeJs(entry.id) + '\')"' : '') + '>' +
        '<div class="set-num">' + (index + 1) + '</div>' +
        '<div class="set-body">' +
          '<div class="set-title">' + escapeHtml(entry.title) + '</div>' +
          '<div class="set-preview">' + escapeHtml(entry.description || '모든 답안을 작성한 뒤 한 번에 제출합니다.') + '</div>' +
          '<div class="set-meta">' +
            metaBits.map(function(bit){
              return '<span class="set-badge">' + escapeHtml(bit) + '</span>'
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="p-arrow">' + (entry.isAccessible ? '&rsaquo;' : '예정') + '</div>' +
      '</div>'
  }).join('')
}

function getVisibleCheckSets(){
  const today = getTodayStamp()
  const scopedClassIds = isPortalAdmin() ? getActivePortalCheckClassIds() : getProfileClassIds()
  const allSets = Array.isArray(portalState.checkData && portalState.checkData.checkSets)
    ? portalState.checkData.checkSets
    : []

  return allSets.filter(function(entry){
    const classIds = Array.isArray(entry && entry.classIds) ? entry.classIds : []
    const hasClassScope = classIds.some(function(classId){
      return scopedClassIds.indexOf(classId) >= 0
    })
    if(isPortalAdmin()){
      if(!scopedClassIds.length) return false
      return hasClassScope
    }
    if(isPersonalCheckSet(entry)){
      return isCheckSetAssignedToCurrentStudent(entry) && (!classIds.length || hasClassScope)
    }
    if(!scopedClassIds.length) return false
    return hasClassScope
  }).map(function(entry){
    const isAccessible =
      (!entry.availableFrom || today >= entry.availableFrom) &&
      (!entry.availableTo || today <= entry.availableTo)
    let status = 'always'
    if(entry.availableFrom && today < entry.availableFrom){
      status = 'upcoming'
    }else if(entry.availableTo && today > entry.availableTo){
      status = 'ended'
    }else if(entry.availableFrom || entry.availableTo){
      status = 'active'
    }
    return Object.assign({}, entry, { isAccessible: isAccessible, status: status })
  })
}

function getCheckSetDateText(entry){
  if(entry.availableFrom && entry.availableTo) return entry.availableFrom + ' ~ ' + entry.availableTo
  if(entry.availableFrom) return entry.availableFrom + '부터'
  if(entry.availableTo) return entry.availableTo + '까지'
  return '상시 열림'
}

function openCheckSetPortal(setId){
  const checkSet = getVisibleCheckSets().find(function(entry){
    return entry.id === setId
  }) || null
  if(!checkSet){
    showToast('열 수 없는 CHECK 세트입니다.', 'var(--red)')
    return
  }
  if(!checkSet.isAccessible){
    showToast('아직 열리지 않은 CHECK 세트입니다.', 'var(--red)')
    return
  }
  portalState.currentCheckSet = checkSet
  portalState.currentCheckSubmission = null
  renderCurrentCheckSet()
  activatePortalScreen('check-set-screen')
}

function renderCurrentCheckSet(){
  const checkSet = portalState.currentCheckSet
  if(!checkSet){
    showCheckScreen()
    return
  }
  document.getElementById('check-current-set-name').textContent = checkSet.title
  document.getElementById('check-current-set-meta').textContent = getCheckSetDateText(checkSet)
  renderCheckForm(checkSet, portalState.currentCheckSubmission)
}

function renderCheckForm(checkSet, submission){
  const form = document.getElementById('check-form')
  form.innerHTML = checkSet.questions.map(function(question, index){
    const submittedAnswer = submission ? (submission.answers.find(function(answer){
      return answer.questionId === question.id
    }) || null) : null
    const resultClass = submittedAnswer ? (submittedAnswer.isCorrect ? 'check-result correct show' : 'check-result wrong show') : 'check-result'
    const selectedAnswer = submittedAnswer ? String(submittedAnswer.userAnswer || '') : ''
    const displayNumber = normalizeCheckQuestionNumber(question && question.number, index + 1)
    return '' +
      '<section class="group check-form-card">' +
        '<div class="check-question-meta">' +
          '<span class="check-chip">' + escapeHtml(question.type) + '</span>' +
          '<span class="check-chip">' + displayNumber + '번</span>' +
        '</div>' +
        '<div class="check-question-title">문항 ' + displayNumber + '</div>' +
        '<div class="check-question-prompt">' + escapeHtml(question.type === '주관식' ? '답지를 확인한 뒤 맞았는지 틀렸는지만 체크해 주세요.' : '아래에서 정답 번호를 선택해 주세요.') + '</div>' +
        '<div class="check-answer-box">' +
          renderCheckAnswerField(question, selectedAnswer, !!submission) +
        '</div>' +
        '<div class="' + resultClass + '">' +
          '<div class="check-result-title">' + (submittedAnswer ? (submittedAnswer.isCorrect ? '정답' : '확인 필요') : '정답') + '</div>' +
          '<div class="check-result-body">' + renderCheckResultBody(question, submittedAnswer) + '</div>' +
        '</div>' +
      '</section>'
  }).join('')

  const submitArea = document.getElementById('check-submit-actions')
  const summaryHtml = submission
    ? '<div class="status-note" style="margin-top:0"><div class="status-text">총 ' + submission.summary.total + '문항 중 ' + submission.summary.correct + '문항 정답입니다.</div></div>'
    : ''
  submitArea.innerHTML =
    summaryHtml +
    '<button class="btn btn-blue" type="button" id="check-submit-btn">' + (submission ? '다시 제출하기' : '이번에 푼 문제 제출') + '</button>'
  if(!submission){
    form.querySelectorAll('.check-choice-grid').forEach(function(group){
      group.querySelectorAll('.check-choice-btn').forEach(function(button){
        button.addEventListener('click', function(){
          const isMultiSelect = group.dataset.multiSelect === 'true'
          const maxChoices = Math.max(1, Number(group.dataset.maxChoices || 1))
          if(isMultiSelect){
            const nextState = toggleChoiceAnswerValue(getChoiceGroupAnswer(group), String(button.dataset.choice || '').trim(), maxChoices)
            if(nextState.blocked){
              showToast(maxChoices + '개까지만 선택할 수 있습니다.', 'var(--blue)')
              return
            }
            applyChoiceGroupSelection(group, nextState.value)
            return
          }
          group.querySelectorAll('.check-choice-btn').forEach(function(node){
            node.classList.remove('active')
          })
          button.classList.add('active')
        })
      })
    })
  }
  document.getElementById('check-submit-btn').addEventListener('click', submitCurrentCheckSet)
}

async function submitCurrentCheckSet(){
  if(portalState.isSubmittingCheck) return
  const checkSet = portalState.currentCheckSet
  if(!checkSet) return

  portalState.isSubmittingCheck = true
  try{
    const answers = checkSet.questions.map(function(question){
      const userAnswer = readCheckUserAnswer(question)
      const isCorrect = isAnswerAccepted(userAnswer, question)
      return {
        questionId: question.id,
        number: normalizeCheckQuestionNumber(question.number, 1),
        type: question.type,
        problemType: normalizeCheckProblemType(question.problemType),
        prompt: question.prompt,
        userAnswer: userAnswer,
        answer: question.answer,
        explanation: question.explanation,
        isCorrect: isCorrect
      }
    })

    const summary = {
      total: answers.length,
      correct: answers.filter(function(answer){ return answer.isCorrect }).length,
      wrong: answers.filter(function(answer){ return !answer.isCorrect }).length
    }

    portalState.currentCheckSubmission = {
      submittedAt: new Date().toISOString(),
      answers: answers,
      summary: summary
    }
    renderCheckForm(checkSet, portalState.currentCheckSubmission)
    await saveCheckSubmission(checkSet, portalState.currentCheckSubmission)
    showToast('답안을 제출하고 정답과 해설을 표시했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('답안을 저장하지 못했습니다.', 'var(--red)')
  }finally{
    portalState.isSubmittingCheck = false
  }
}

function isAnswerAccepted(userAnswer, question){
  const type = normalizeCheckQuestionType(question && question.type)
  if(type === '객관식'){
    const normalizedUser = normalizeChoiceAnswer(userAnswer)
    const normalizedAnswer = normalizeChoiceAnswer(question && question.answer)
    if(!normalizedUser || !normalizedAnswer) return false
    return normalizedUser === normalizedAnswer
  }

  return String(userAnswer || '').trim() === '맞음'
}

function getPortalKnownClasses(){
  const map = new Map()

  PORTAL_CLASS_REFERENCE.forEach(function(classInfo){
    const id = String(classInfo && classInfo.id || '').trim()
    if(!id) return
    map.set(id, {
      id: id,
      name: String(classInfo && classInfo.name || '').trim() || id
    })
  })

  prepClasses.forEach(function(classInfo){
    const id = String(classInfo && classInfo.id || '').trim()
    if(!id) return
    map.set(id, {
      id: id,
      name: String(classInfo && classInfo.name || '').trim() || id
    })
  })

  const checkDataClasses = Array.isArray(portalState.checkData && portalState.checkData.classes)
    ? portalState.checkData.classes
    : []

  checkDataClasses.forEach(function(classInfo){
    const id = String(classInfo && classInfo.id || '').trim()
    if(!id || map.has(id)) return
    map.set(id, {
      id: id,
      name: String(classInfo && classInfo.name || '').trim() || id
    })
  })

  const checkSets = Array.isArray(portalState.checkData && portalState.checkData.checkSets)
    ? portalState.checkData.checkSets
    : []

  checkSets.forEach(function(setInfo){
    const classIds = Array.isArray(setInfo && setInfo.classIds) ? setInfo.classIds : []
    classIds.forEach(function(classId){
      const id = String(classId || '').trim()
      if(!id || map.has(id)) return
      map.set(id, { id: id, name: id })
    })
  })

  return Array.from(map.values())
}

function normalizeAnswerForCompare(value){
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.,!?;:'"()[\]{}~`<>_-]/g, '')
    .trim()
}

const CHOICE_TOKEN_MAP = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '\u2460': '1',
  '\u2461': '2',
  '\u2462': '3',
  '\u2463': '4',
  '\u2464': '5',
  '\u2776': '1',
  '\u2777': '2',
  '\u2778': '3',
  '\u2779': '4',
  '\u277A': '5',
  '\u2780': '1',
  '\u2781': '2',
  '\u2782': '3',
  '\u2783': '4',
  '\u2784': '5'
}

function getChoiceAnswerValues(value){
  const matches = String(value || '').match(/[1-5\u2460-\u2464\u2776-\u277A\u2780-\u2784]/g) || []
  const seen = new Set()
  return matches.map(function(token){
    return CHOICE_TOKEN_MAP[token] || ''
  }).filter(function(token){
    if(!token || seen.has(token)) return false
    seen.add(token)
    return true
  }).sort(function(left, right){
    return Number(left) - Number(right)
  })
}

function normalizeChoiceAnswer(value){
  return getChoiceAnswerValues(value).join(',')
}

function formatChoiceAnswer(value){
  const values = getChoiceAnswerValues(value)
  return values.length ? values.join(', ') : String(value || '').trim()
}

function getChoiceSelectionLimit(question){
  const count = getChoiceAnswerValues(question && question.answer).length
  return count > 1 ? count : 1
}

function isChoiceQuestionMultiSelect(question){
  return normalizeCheckQuestionType(question && question.type) === '객관식' && getChoiceSelectionLimit(question) > 1
}

function getChoiceGroupAnswer(group){
  if(!group) return ''
  return normalizeChoiceAnswer(Array.from(group.querySelectorAll('.check-choice-btn.active')).map(function(node){
    return String(node && node.dataset && node.dataset.choice || '').trim()
  }).join(','))
}

function applyChoiceGroupSelection(group, value){
  if(!group) return
  const selected = new Set(getChoiceAnswerValues(value))
  group.querySelectorAll('.check-choice-btn').forEach(function(node){
    const choice = String(node && node.dataset && node.dataset.choice || '').trim()
    node.classList.toggle('active', selected.has(choice))
  })
}

function toggleChoiceAnswerValue(currentValue, nextChoice, maxChoices){
  const normalizedChoice = normalizeChoiceAnswer(nextChoice)
  const choice = getChoiceAnswerValues(normalizedChoice)[0] || ''
  const values = getChoiceAnswerValues(currentValue)
  const limit = Math.max(1, Number(maxChoices) || 1)
  const index = values.indexOf(choice)

  if(!choice){
    return { value: normalizeChoiceAnswer(currentValue), changed: false, blocked: false }
  }
  if(index >= 0){
    values.splice(index, 1)
    return { value: values.join(','), changed: true, blocked: false }
  }
  if(values.length >= limit){
    return { value: values.join(','), changed: false, blocked: true }
  }

  values.push(choice)
  values.sort(function(left, right){
    return Number(left) - Number(right)
  })
  return { value: values.join(','), changed: true, blocked: false }
}

function normalizeCheckQuestionType(value){
  return String(value || '').trim() === '주관식' ? '주관식' : '객관식'
}

function normalizeCheckProblemType(value){
  const normalized = String(value || '').trim()
  return normalized || '기타'
}

function normalizeCheckQuestionNumber(value, fallback){
  const number = Number(value)
  if(!Number.isFinite(number) || number < 1) return Math.max(1, Number(fallback) || 1)
  return Math.floor(number)
}

function normalizeCheckAnswerByType(type, value){
  return type === '객관식'
    ? normalizeChoiceAnswer(value)
    : String(value || '').trim()
}

function normalizeCheckAcceptableAnswers(type, value){
  if(type === '객관식') return []

  const rows = Array.isArray(value)
    ? value
    : String(value || '').split(/\r?\n/)

  return rows.map(function(entry){
    return String(entry || '').trim()
  }).filter(Boolean)
}

function renderCheckAnswerField(question, selectedAnswer, isLocked){
  if(isLocked){
    return renderSubmittedCheckAnswer(question, selectedAnswer)
  }

  if(normalizeCheckQuestionType(question.type) === '주관식'){
    return '<div class="check-choice-grid check-choice-grid-binary" data-check-binary-id="' + escapeHtml(question.id) + '">' +
      ['맞음', '틀림'].map(function(choice){
        const activeClass = selectedAnswer === choice ? ' active' : ''
        return '<button class="check-choice-btn check-choice-btn-binary' + activeClass + '" type="button" data-choice="' + escapeHtml(choice) + '">' + escapeHtml(choice) + '</button>'
      }).join('') +
    '</div>'
  }

  const selectedChoices = new Set(getChoiceAnswerValues(selectedAnswer))
  const selectionLimit = getChoiceSelectionLimit(question)
  const isMultiSelect = isChoiceQuestionMultiSelect(question)

  return '<div class="check-choice-grid" data-check-question-id="' + escapeHtml(question.id) + '" data-multi-select="' + (isMultiSelect ? 'true' : 'false') + '" data-max-choices="' + selectionLimit + '">' +
    [1, 2, 3, 4, 5].map(function(choice){
      const value = String(choice)
      const activeClass = selectedChoices.has(value) ? ' active' : ''
      return '<button class="check-choice-btn' + activeClass + '" type="button" data-choice="' + value + '">' + value + '</button>'
    }).join('') +
  '</div>' + (isMultiSelect ? ('<div class="check-choice-hint">' + selectionLimit + '개 선택</div>') : '')
}

function renderSubmittedCheckAnswer(question, selectedAnswer){
  const type = normalizeCheckQuestionType(question && question.type)
  const label = type === '주관식' ? '내가 체크한 답' : '내가 고른 답'
  const value = String(selectedAnswer || '').trim() || '미선택'
  return '' +
    '<div class="check-submitted-answer">' +
      '<span class="check-submitted-label">' + escapeHtml(label) + '</span>' +
      '<strong class="check-submitted-value">' + escapeHtml(value) + '</strong>' +
    '</div>'
}

function renderCheckResultBody(question, submittedAnswer){
  if(normalizeCheckQuestionType(question.type) === '주관식'){
    const userState = submittedAnswer ? String(submittedAnswer.userAnswer || '').trim() : ''
    return '자기 점검: ' + escapeHtml(userState || '미선택') +
      (question.explanation ? '<br><br>해설: ' + escapeHtml(question.explanation).replace(/\n/g, '<br>') : '')
  }

  return '정답: ' + escapeHtml(question.answer || '등록된 정답 없음') +
    (question.explanation ? '<br><br>해설: ' + escapeHtml(question.explanation).replace(/\n/g, '<br>') : '')
}

function readCheckUserAnswer(question){
  if(normalizeCheckQuestionType(question.type) === '주관식'){
    const field = document.querySelector('[data-check-binary-id="' + question.id + '"] .check-choice-btn.active')
    return String(field && field.dataset.choice || '').trim()
  }

  const group = document.querySelector('[data-check-question-id="' + question.id + '"]')
  return getChoiceGroupAnswer(group)
}

function renderCheckAnswerField(question, selectedAnswer, isLocked){
  if(isLocked){
    return renderSubmittedCheckAnswer(question, selectedAnswer)
  }

  if(normalizeCheckQuestionType(question.type) === '주관식'){
    return '<div class="check-choice-grid check-choice-grid-binary" data-check-binary-id="' + escapeHtml(question.id) + '">' +
      ['맞음', '틀림'].map(function(choice){
        const activeClass = selectedAnswer === choice ? ' active' : ''
        return '<button class="check-choice-btn check-choice-btn-binary' + activeClass + '" type="button" data-choice="' + escapeHtml(choice) + '">' + escapeHtml(choice) + '</button>'
      }).join('') +
    '</div>'
  }

  const selectedChoices = new Set(getChoiceAnswerValues(selectedAnswer))
  const selectionLimit = getChoiceSelectionLimit(question)
  const isMultiSelect = isChoiceQuestionMultiSelect(question)

  return '<div class="check-choice-grid" data-check-question-id="' + escapeHtml(question.id) + '" data-multi-select="' + (isMultiSelect ? 'true' : 'false') + '" data-max-choices="' + selectionLimit + '">' +
    [1, 2, 3, 4, 5].map(function(choice){
      const value = String(choice)
      const activeClass = selectedChoices.has(value) ? ' active' : ''
      return '<button class="check-choice-btn' + activeClass + '" type="button" data-choice="' + value + '">' + value + '</button>'
    }).join('') +
  '</div>' + (isMultiSelect ? ('<div class="check-choice-hint">' + selectionLimit + '개 선택</div>') : '')
}

function renderSubmittedCheckAnswer(question, selectedAnswer){
  const type = normalizeCheckQuestionType(question && question.type)
  const label = type === '주관식' ? '내가 체크한 값' : '내가 고른 답'
  const value = type === '객관식'
    ? (formatChoiceAnswer(selectedAnswer) || '미선택')
    : (String(selectedAnswer || '').trim() || '미선택')
  return '' +
    '<div class="check-submitted-answer">' +
      '<span class="check-submitted-label">' + escapeHtml(label) + '</span>' +
      '<strong class="check-submitted-value">' + escapeHtml(value) + '</strong>' +
    '</div>'
}

function renderCheckResultBody(question, submittedAnswer){
  if(normalizeCheckQuestionType(question.type) === '주관식'){
    const userState = submittedAnswer ? String(submittedAnswer.userAnswer || '').trim() : ''
    return '자기 점검: ' + escapeHtml(userState || '미선택') +
      (question.explanation ? '<br><br>해설: ' + escapeHtml(question.explanation).replace(/\n/g, '<br>') : '')
  }

  return '정답: ' + escapeHtml(formatChoiceAnswer(question.answer) || '등록된 정답 없음') +
    (question.explanation ? '<br><br>해설: ' + escapeHtml(question.explanation).replace(/\n/g, '<br>') : '')
}

function readCheckUserAnswer(question){
  if(normalizeCheckQuestionType(question.type) === '주관식'){
    const field = document.querySelector('[data-check-binary-id="' + question.id + '"] .check-choice-btn.active')
    return String(field && field.dataset.choice || '').trim()
  }

  const group = document.querySelector('[data-check-question-id="' + question.id + '"]')
  return getChoiceGroupAnswer(group)
}

async function saveCheckSubmission(checkSet, submission){
  const profile = portalState.currentProfile || {}
  const payload = {
    id: 'resp-' + simpleHash((portalState.currentUser && portalState.currentUser.uid) + '_' + checkSet.id + '_' + submission.submittedAt),
    checkSetId: checkSet.id,
    checkSetTitle: checkSet.title,
    classIds: getProfileClassIds(),
    userId: portalState.currentUser ? portalState.currentUser.uid : '',
    email: profile.email || '',
    name: profile.name || '',
    studentId: profile.studentId || '',
    role: profile.role || 'student',
    submittedAt: submission.submittedAt,
    summary: submission.summary,
    answers: submission.answers
  }

  if(portalState.firebaseEnabled){
    await portalState.db.collection('checkResponses').doc(payload.id).set(payload, { merge: true })
    return
  }

  const rows = readLocalResponses().filter(function(entry){
    return entry.id !== payload.id
  })
  rows.push(payload)
  writeLocalResponses(rows)
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
}

function syncAdminClassFilterControls(rows){
  const select = document.getElementById('admin-class-filter')
  const nameNode = document.getElementById('admin-filter-name')
  const metaNode = document.getElementById('admin-filter-meta')
  const classMap = new Map()
  const allowedClassIds = getProfileClassIds()

  getPortalKnownClasses().forEach(function(classInfo){
    const id = String(classInfo && classInfo.id || '').trim()
    if(!id) return
    if(isPortalAdmin() && !isPortalSuperAdmin() && allowedClassIds.indexOf(id) < 0) return
    classMap.set(id, String(classInfo && classInfo.name || '').trim() || id)
  })

  rows.forEach(function(entry){
    const classIds = Array.isArray(entry && entry.classIds) ? entry.classIds : []
    classIds.forEach(function(classId){
      const id = String(classId || '').trim()
      if(isPortalAdmin() && !isPortalSuperAdmin() && allowedClassIds.indexOf(id) < 0) return
      if(!id || classMap.has(id)) return
      classMap.set(id, id)
    })
  })

  const options = [{ id: 'all', name: '전체' }].concat(Array.from(classMap.entries()).map(function(entry){
    return { id: entry[0], name: entry[1] }
  }))

  if(!options.some(function(option){ return option.id === portalState.adminClassFilter })){
    portalState.adminClassFilter = 'all'
  }

  if(select){
    select.innerHTML = options.map(function(option){
      const selected = option.id === portalState.adminClassFilter ? ' selected' : ''
      return '<option value="' + escapeHtml(option.id) + '"' + selected + '>' + escapeHtml(option.name) + '</option>'
    }).join('')
  }

  const currentOption = options.find(function(option){
    return option.id === portalState.adminClassFilter
  }) || options[0]

  if(nameNode) nameNode.textContent = currentOption ? currentOption.name : '전체'
  if(metaNode){
    metaNode.textContent = portalState.adminClassFilter === 'all'
      ? '모든 반의 제출 결과를 함께 보고 있습니다.'
      : (currentOption.name + ' 반 학생 결과만 보고 있습니다.')
  }
}

function filterAdminResponsesByClass(rows){
  const scopedRows = rows.filter(function(entry){
    if(!isPortalAdmin() || isPortalSuperAdmin()) return true
    const classIds = Array.isArray(entry && entry.classIds) ? entry.classIds : []
    return classIds.some(function(classId){
      return getProfileClassIds().indexOf(classId) >= 0
    })
  })
  if(portalState.adminClassFilter === 'all') return scopedRows
  return scopedRows.filter(function(entry){
    return (Array.isArray(entry && entry.classIds) ? entry.classIds : []).includes(portalState.adminClassFilter)
  })
}

window.handleAdminClassFilterChange = function(value){
  portalState.adminClassFilter = String(value || 'all').trim() || 'all'
  portalState.adminStudentFilter = ''
  renderAdminScreen()
}

function syncAdminStudentFilterControls(rows){
  const select = document.getElementById('admin-student-filter')
  const students = buildAdminStudentOptions(rows)

  if(!students.length){
    portalState.adminStudentFilter = ''
    if(select){
      select.innerHTML = '<option value="">학생 없음</option>'
    }
    return
  }

  if(!students.some(function(student){ return student.id === portalState.adminStudentFilter })){
    portalState.adminStudentFilter = students[0].id
  }

  if(select){
    select.innerHTML = students.map(function(student){
      const selected = student.id === portalState.adminStudentFilter ? ' selected' : ''
      return '<option value="' + escapeHtml(student.id) + '"' + selected + '>' + escapeHtml(student.label) + '</option>'
    }).join('')
  }
}

function buildAdminStudentOptions(rows){
  const map = new Map()

  rows.forEach(function(entry){
    const id = getAdminResponseStudentKey(entry)
    if(!id || map.has(id)) return
    map.set(id, {
      id: id,
      label: getAdminResponseStudentLabel(entry)
    })
  })

  return Array.from(map.values()).sort(function(a, b){
    return String(a.label || '').localeCompare(String(b.label || ''), 'ko')
  })
}

function getAdminResponseStudentKey(entry){
  return String(
    entry && (
      entry.userId ||
      entry.studentId ||
      entry.email ||
      entry.name
    ) || ''
  ).trim()
}

function getAdminResponseStudentLabel(entry){
  const name = String(entry && entry.name || '').trim()
  const studentId = String(entry && entry.studentId || '').trim()
  const email = String(entry && entry.email || '').trim()

  if(name && studentId && name !== studentId) return name + ' · ' + studentId
  if(name) return name
  if(studentId) return studentId
  if(email) return email
  return '학생'
}

window.handleAdminStudentFilterChange = function(value){
  portalState.adminStudentFilter = String(value || '').trim()
  renderAdminScreen()
}

function extractWrongAnswers(rows){
  return rows.flatMap(function(entry){
    return (Array.isArray(entry.answers) ? entry.answers : []).filter(function(answer){
      return !answer.isCorrect
    }).map(function(answer, answerIndex){
      return {
        submittedAt: entry.submittedAt,
        name: getAdminResponseStudentLabel(entry),
        problemType: normalizeCheckProblemType(answer.problemType || answer.category),
        questionNumber: resolveSubmittedQuestionNumber(answer, answerIndex + 1),
        setTitle: entry.checkSetTitle || 'CHECK 세트'
      }
    })
  })
}

function buildStudentSetWrongItems(rows, selectedStudentKey){
  const latestMap = new Map()

  rows.forEach(function(entry){
    const identity = getAdminResponseStudentKey(entry) || 'student'
    if(selectedStudentKey && identity !== selectedStudentKey) return
    const setId = entry.checkSetId || entry.checkSetTitle || 'check-set'
    const key = identity + '::' + setId
    const current = latestMap.get(key)
    if(!current || String(entry.submittedAt || '') > String(current.submittedAt || '')){
      latestMap.set(key, entry)
    }
  })

  return Array.from(latestMap.values()).map(function(entry){
    const wrongNumbers = (Array.isArray(entry.answers) ? entry.answers : []).filter(function(answer){
      return !answer.isCorrect
    }).map(function(answer, answerIndex){
      return resolveSubmittedQuestionNumber(answer, answerIndex + 1)
    }).filter(function(number, index, list){
      return list.indexOf(number) === index
    }).sort(function(a, b){
      return a - b
    })

    if(!wrongNumbers.length) return null

    return {
      name: getAdminResponseStudentLabel(entry),
      setTitle: entry.checkSetTitle || 'CHECK 세트',
      wrongCount: wrongNumbers.length,
      wrongNumberText: wrongNumbers.join(', '),
      submittedAt: entry.submittedAt
    }
  }).filter(Boolean).sort(function(a, b){
    if(String(b.submittedAt || '') !== String(a.submittedAt || '')){
      return String(b.submittedAt || '').localeCompare(String(a.submittedAt || ''))
    }
    return String(a.setTitle || '').localeCompare(String(b.setTitle || ''), 'ko')
  }).slice(0, 30)
}

function resolveSubmittedQuestionNumber(answer, fallback){
  const direct = Number(answer && answer.number)
  if(Number.isFinite(direct) && direct > 0) return Math.floor(direct)

  const idMatch = String(answer && (answer.questionId || answer.id) || '').match(/(\d+)/)
  if(idMatch) return Number(idMatch[1])

  const promptMatch = String(answer && answer.prompt || '').match(/(\d+)/)
  if(promptMatch) return Number(promptMatch[1])

  return normalizeCheckQuestionNumber(fallback, 1)
}

async function fetchAllCheckResponses(){
  if(portalState.firebaseEnabled){
    const snapshot = await portalState.db.collection('checkResponses').get()
    return snapshot.docs.map(function(doc){
      return doc.data()
    })
  }
  return readLocalResponses()
}

function buildRankItems(rows, selector){
  const map = new Map()
  rows.forEach(function(row){
    const label = selector(row)
    if(!label) return
    map.set(label, (map.get(label) || 0) + 1)
  })
  return Array.from(map.entries()).map(function(entry){
    return { label: entry[0], count: entry[1] }
  }).sort(function(a, b){
    return b.count - a.count
  }).slice(0, 20)
}

function renderAdminRankList(listId, countId, items, renderer){
  document.getElementById(countId).textContent = String(items.length)
  document.getElementById(listId).innerHTML = items.length
    ? items.map(renderer).join('')
    : '<div class="empty-box">표시할 데이터가 없습니다.</div>'
}

function applyPortalCopy(){
  const authTagline = document.querySelector('#auth-screen .tagline')
  if(authTagline) authTagline.textContent = '로그인 후 PREP과 CHECK를 이용하세요.'

  const authLogo = document.querySelector('#auth-screen .logo')
  if(authLogo) authLogo.textContent = 'CODE LAB'

  const authOverlayFooter = document.querySelector('#auth-screen .prep-footer.overlay')
  if(authOverlayFooter) authOverlayFooter.style.display = 'none'

  const authHelp = document.getElementById('auth-help')
  if(authHelp) authHelp.textContent = '선생님이 배부한 아이디와 임시 비밀번호로 로그인합니다.'

  const authIdField = document.getElementById('auth-email')
  if(authIdField){
    authIdField.type = 'text'
    authIdField.inputMode = 'text'
    authIdField.autocapitalize = 'off'
    authIdField.spellcheck = false
  }

  setFieldLabel('auth-email', '아이디')
  setFieldLabel('auth-password', '비밀번호')
  setPlaceholder('auth-email', 'student01')
  setPlaceholder('auth-password', '비밀번호')

  setElementText('auth-login-tab', '로그인')
  setElementText('auth-submit-btn', '로그인')
  setElementText('portal-refresh-btn', '새로고침')
  setElementText('portal-logout-btn', '로그아웃')
  setElementText('portal-password-btn', '비밀번호 변경')
  setElementText('portal-user-name', '학생')
  setElementText('portal-user-meta', '')

  setHeadingText('#portal-screen .hd h1', 'CODE LAB')
  setHeadingText('#check-screen .hd h1', 'CHECK')
  setHeadingText('#check-set-screen .hd h1', 'CHECK')
  setHeadingText('#admin-screen .hd h1', 'ADMIN')

  setQueryText('#portal-screen .portal-user-label', '현재 로그인')
  setQueryText('#check-screen .class-bar-label', '현재 반')
  setQueryText('#check-set-screen .class-bar-label', '현재 CHECK 세트')

  hydratePortalCard('portal-prep-btn', '학습', 'PREP', '내 반에 배정된 세트를 열고 지문을 미리 공부합니다.')
  hydratePortalCard('portal-check-btn', '제출', 'CHECK', '푼 문제만 제출하고, 제출한 문항의 정답과 해설을 바로 확인합니다.')
  hydratePortalCard('portal-counsel-btn', '상담', 'COUNSEL', '진로, 인생, 퇴원 상담 메뉴를 선택합니다.')
  hydratePortalCard('portal-admin-btn', '관리', 'ADMIN', '학생별 오답과 문제 유형 통계를 확인합니다.')

  setElementText('check-back-btn', '메인')
  setElementText('check-refresh-btn', '새로고침')
  setElementText('check-set-back-btn', '이전 페이지')
  setElementText('check-set-home-btn', '메인')
  setElementText('check-submit-btn', '이번에 푼 문제 제출')
  setElementText('admin-back-btn', '메인')
  setElementText('admin-refresh-btn', '새로고침')
  setElementText('counsel-back-btn', '메인')
  setElementText('password-back-btn', '이전 페이지')
  setElementText('password-home-btn', '홈')
  setElementText('password-submit-btn', '비밀번호 저장')

  ;[
    'portal-subtitle',
    'home-subtitle',
    'class-subtitle',
    'class-auth-subtitle',
    'passage-subtitle',
    'check-subtitle',
    'check-set-subtitle',
    'admin-subtitle'
  ].forEach(function(id){
    const node = document.getElementById(id)
    if(node) node.textContent = ''
  })
}

function isPasswordResetRequired(profile){
  return !!(profile && profile.passwordResetRequired)
}

function mountPortalPasswordButton(){
  const nav = document.querySelector('#portal-screen .screen-nav')
  const logoutBtn = document.getElementById('portal-logout-btn')
  const passwordBtn = document.getElementById('portal-password-btn')
  const userActions = passwordBtn && passwordBtn.parentElement && passwordBtn.parentElement.classList.contains('portal-user-actions')
    ? passwordBtn.parentElement
    : null

  if(nav && logoutBtn && passwordBtn && passwordBtn.parentElement !== nav){
    nav.insertBefore(passwordBtn, logoutBtn)
  }
  if(userActions) userActions.style.display = 'none'
}

function applyPortalCopy(){
  const authTagline = document.querySelector('#auth-screen .tagline')
  if(authTagline) authTagline.textContent = '로그인 후 PREP과 CHECK를 이용하세요.'

  const authLogo = document.querySelector('#auth-screen .logo')
  if(authLogo) authLogo.textContent = 'CODE LAB'

  const authOverlayFooter = document.querySelector('#auth-screen .prep-footer.overlay')
  if(authOverlayFooter) authOverlayFooter.style.display = 'none'

  const authHelp = document.getElementById('auth-help')
  if(authHelp) authHelp.textContent = '선생님이 배부한 아이디와 임시 비밀번호로 로그인합니다.'

  const authIdField = document.getElementById('auth-email')
  if(authIdField){
    authIdField.type = 'text'
    authIdField.inputMode = 'text'
    authIdField.autocapitalize = 'off'
    authIdField.spellcheck = false
  }

  setFieldLabel('auth-email', '아이디')
  setFieldLabel('auth-password', '비밀번호')
  setPlaceholder('auth-email', 'student01')
  setPlaceholder('auth-password', '비밀번호')

  setElementText('auth-login-tab', '로그인')
  setElementText('auth-submit-btn', '로그인')
  setElementText('portal-refresh-btn', '새로고침')
  setElementText('portal-logout-btn', '로그아웃')
  setElementText('portal-password-btn', '비밀번호 변경')
  setElementText('portal-user-name', '학생')
  setElementText('portal-user-meta', '')

  setHeadingText('#portal-screen .hd h1', 'CODE LAB')
  setHeadingText('#check-screen .hd h1', 'CHECK')
  setHeadingText('#check-set-screen .hd h1', 'CHECK')
  setHeadingText('#admin-screen .hd h1', 'ADMIN')

  setQueryText('#portal-screen .portal-user-label', '현재 로그인')
  setQueryText('#check-screen .class-bar-label', '현재 반')
  setQueryText('#check-set-screen .class-bar-label', '현재 CHECK 세트')

  hydratePortalCard('portal-prep-btn', '학습', 'PREP', '내 반에 배정된 세트를 열고 지문을 미리 공부합니다.')
  hydratePortalCard('portal-check-btn', '제출', 'CHECK', '푼 문제만 제출하고, 제출한 문항의 정답과 해설을 바로 확인합니다.')
  hydratePortalCard('portal-admin-btn', '관리', 'ADMIN', '학생별 오답과 문제 유형 통계를 확인합니다.')

  setElementText('check-back-btn', '메인')
  setElementText('check-refresh-btn', '새로고침')
  setElementText('check-set-back-btn', '이전 페이지')
  setElementText('check-set-home-btn', '메인')
  setElementText('check-submit-btn', '이번에 푼 문제 제출')
  setElementText('admin-back-btn', '메인')
  setElementText('admin-refresh-btn', '새로고침')
  setElementText('password-back-btn', '이전 페이지')
  setElementText('password-home-btn', '홈')
  setElementText('password-submit-btn', '비밀번호 저장')

  ;[
    'portal-subtitle',
    'home-subtitle',
    'class-subtitle',
    'class-auth-subtitle',
    'passage-subtitle',
    'check-subtitle',
    'check-set-subtitle',
    'admin-subtitle'
  ].forEach(function(id){
    const node = document.getElementById(id)
    if(node) node.textContent = ''
  })

  mountPortalPasswordButton()
}

function normalizeUserProfile(source){
  const classIds = Array.isArray(source && source.classIds)
    ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    : []
  return {
    uid: String(source && (source.uid || source.id) || '').trim(),
    loginId: derivePortalLoginId(source),
    email: String(source && source.email || '').trim().toLowerCase(),
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: classIds,
    role: String(source && source.role || 'student').trim() || 'student',
    passwordResetRequired: !!(source && source.passwordResetRequired),
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function normalizeUserProfileLocal(source){
  const loginId = derivePortalLoginId(source)
  return {
    id: String(source && source.id || '').trim(),
    loginId: loginId,
    email: String(source && source.email || toPortalLoginEmail(loginId) || '').trim().toLowerCase(),
    password: String(source && source.password || '').trim(),
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: Array.isArray(source && source.classIds)
      ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
      : [],
    role: String(source && source.role || 'student').trim() || 'student',
    passwordResetRequired: !!(source && source.passwordResetRequired),
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function ensureLocalPreviewUsers(){
  const existingUsers = readLocalUsers()
  if(existingUsers.length){
    let touched = false
    const normalizedUsers = existingUsers.map(function(user){
      const nextUser = normalizeUserProfileLocal(user)
      if(typeof user.passwordResetRequired !== 'boolean'){
        touched = true
      }
      return nextUser
    })
    if(touched){
      writeLocalUsers(normalizedUsers)
    }
    return { users: normalizedUsers, seeded: false }
  }

  const firstClassId = prepClasses[0] ? String(prepClasses[0].id || '').trim() : 'class-1'
  const now = new Date().toISOString()
  const seededUsers = [
    normalizeUserProfileLocal({
      id: 'student-preview-1',
      loginId: 'student01',
      email: 'student01@prep.local',
      password: 'pass1234',
      name: '테스트 학생',
      studentId: 'student01',
      classIds: firstClassId ? [firstClassId] : [],
      role: 'student',
      passwordResetRequired: true,
      createdAt: now,
      updatedAt: now
    }),
    normalizeUserProfileLocal({
      id: 'admin-preview-1',
      loginId: 'admin01',
      email: 'admin01@prep.local',
      password: 'pass1234',
      name: '테스트 관리자',
      studentId: 'admin01',
      classIds: firstClassId ? [firstClassId] : [],
      role: 'admin',
      passwordResetRequired: true,
      createdAt: now,
      updatedAt: now
    })
  ]

  writeLocalUsers(seededUsers)
  return { users: seededUsers, seeded: true }
}

async function fetchOrCreateUserProfile(user){
  const snapshot = await portalState.db.collection('users').doc(user.uid).get()
  if(snapshot.exists){
    return normalizeUserProfile(Object.assign({ uid: user.uid }, snapshot.data()))
  }

  const fallbackClassId = prepClasses[0] ? prepClasses[0].id : ''
  const loginId = derivePortalLoginId({ email: user.email || '' })
  const profile = {
    uid: user.uid,
    loginId: loginId,
    email: user.email || '',
    name: user.displayName || '',
    studentId: loginId,
    classIds: fallbackClassId ? [fallbackClassId] : [],
    role: 'student',
    passwordResetRequired: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  await saveFirebaseUserProfile(user.uid, profile)
  return normalizeUserProfile(profile)
}

function routePortalAfterState(){
  syncAuthClassOptions()
  unlockAllPrepClasses()
  if(!bundleData) return
  if(!portalState.authResolved){
    showAuthScreen('로그인 상태를 확인하는 중입니다.')
    return
  }
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  if(!portalState.firebaseEnabled) ensureCurrentLocalUserHasClass()
  clearAuthError()
  updatePortalUserCard()

  if(isPasswordResetRequired(portalState.currentProfile)){
    openPasswordScreen(true)
    return
  }

  showPortalScreen()
  handlePortalHashRoute()
}

function openPasswordScreen(forceChange){
  const isForced = !!forceChange || isPasswordResetRequired(portalState.currentProfile)
  document.getElementById('password-current').value = ''
  document.getElementById('password-next').value = ''
  document.getElementById('password-confirm').value = ''
  document.getElementById('password-error').textContent = ''
  document.getElementById('password-back-btn').style.display = isForced ? 'none' : ''
  document.getElementById('password-home-btn').style.display = isForced ? 'none' : ''
  activatePortalScreen('password-screen')
}

async function submitPasswordChange(){
  const currentPassword = String(document.getElementById('password-current').value || '').trim()
  const nextPassword = String(document.getElementById('password-next').value || '').trim()
  const confirmPassword = String(document.getElementById('password-confirm').value || '').trim()

  if(!currentPassword || !nextPassword || !confirmPassword){
    document.getElementById('password-error').textContent = '모든 칸을 입력해 주세요.'
    return
  }
  if(nextPassword.length < 6){
    document.getElementById('password-error').textContent = '새 비밀번호는 6자 이상으로 입력해 주세요.'
    return
  }
  if(nextPassword !== confirmPassword){
    document.getElementById('password-error').textContent = '새 비밀번호 확인이 일치하지 않습니다.'
    return
  }

  try{
    if(portalState.firebaseEnabled){
      const user = portalState.auth.currentUser
      if(!user || !user.email) throw new Error('로그인 정보를 확인할 수 없습니다.')
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword)
      await user.reauthenticateWithCredential(credential)
      await user.updatePassword(nextPassword)
      if(portalState.currentProfile){
        const nextProfile = Object.assign({}, portalState.currentProfile, {
          passwordResetRequired: false,
          updatedAt: new Date().toISOString()
        })
        await saveFirebaseUserProfile(user.uid, nextProfile)
        portalState.currentProfile = normalizeUserProfile(nextProfile)
      }
    }else{
      const currentUserId = portalState.currentUser ? portalState.currentUser.uid : ''
      const users = readLocalUsers()
      const targetIndex = users.findIndex(function(user){
        return user.id === currentUserId
      })
      if(targetIndex < 0) throw new Error('계정 정보를 찾지 못했습니다.')
      if(users[targetIndex].password !== currentPassword) throw new Error('현재 비밀번호가 올바르지 않습니다.')
      users[targetIndex].password = nextPassword
      users[targetIndex].passwordResetRequired = false
      users[targetIndex].updatedAt = new Date().toISOString()
      writeLocalUsers(users)
      portalState.currentProfile = users[targetIndex]
      portalState.currentUser = buildLocalAuthUser(users[targetIndex])
    }

    document.getElementById('password-error').textContent = ''
    document.getElementById('password-back-btn').style.display = ''
    document.getElementById('password-home-btn').style.display = ''
    showToast('비밀번호를 변경했습니다.', 'var(--green)')
    showPortalScreen()
  }catch(error){
    document.getElementById('password-error').textContent = getPasswordChangeErrorMessage(error)
  }
}

function isPasswordResetRequired(profile){
  return !!(profile && profile.passwordResetRequired)
}

function setPasswordError(message){
  const node = document.getElementById('password-error')
  if(node) node.textContent = message || ''
}

function clearPasswordError(){
  setPasswordError('')
}

function clearPasswordFields(){
  const currentField = document.getElementById('password-current')
  const nextField = document.getElementById('password-next')
  const confirmField = document.getElementById('password-confirm')
  if(currentField) currentField.value = ''
  if(nextField) nextField.value = ''
  if(confirmField) confirmField.value = ''
}

function mountPortalPasswordButton(){
  const nav = document.querySelector('#portal-screen .screen-nav')
  const logoutBtn = document.getElementById('portal-logout-btn')
  const passwordBtn = document.getElementById('portal-password-btn')
  const cardActions = document.querySelector('#portal-screen .portal-user-actions')
  if(cardActions) cardActions.style.display = 'none'
  if(!nav || !logoutBtn || !passwordBtn) return
  if(passwordBtn.parentElement !== nav){
    nav.insertBefore(passwordBtn, logoutBtn)
  }
  passwordBtn.classList.add('btn-sm')
}

function applyPortalCopy(){
  const authTagline = document.querySelector('#auth-screen .tagline')
  if(authTagline) authTagline.textContent = '로그인 후 PREP과 CHECK를 이용하세요.'

  const authLogo = document.querySelector('#auth-screen .logo')
  if(authLogo) authLogo.textContent = 'CODE LAB'

  setFieldLabel('auth-email', '아이디')
  setFieldLabel('auth-password', '비밀번호')
  setPlaceholder('auth-email', '아이디')
  setPlaceholder('auth-password', '비밀번호')

  setElementText('auth-submit-btn', '로그인')
  setElementText('portal-refresh-btn', '새로고침')
  setElementText('portal-logout-btn', '로그아웃')
  setElementText('portal-password-btn', '비밀번호 변경')
  setElementText('portal-user-name', '학생')
  setElementText('portal-user-meta', '')
  setHeadingText('#portal-screen .hd h1', 'CODE LAB')
  setHeadingText('#counsel-screen .hd h1', 'COUNSEL')
  setHeadingText('#check-screen .hd h1', 'CHECK')
  setHeadingText('#check-set-screen .hd h1', 'CHECK')
  setHeadingText('#admin-screen .hd h1', 'ADMIN')
  setQueryText('#portal-screen .portal-user-label', '현재 로그인')
  setQueryText('#check-screen .class-bar-label', '현재 반')
  setQueryText('#check-set-screen .class-bar-label', '현재 CHECK 세트')
  hydratePortalCard('portal-prep-btn', '학습', 'PREP', '내 반에 배정된 세트를 열고 지문을 미리 공부합니다.')
  hydratePortalCard('portal-check-btn', '제출', 'CHECK', '푼 문제만 제출하고, 제출한 문항의 정답과 해설을 바로 확인합니다.')
  hydratePortalCard('portal-admin-btn', '관리', 'ADMIN', '학생별 오답과 문제 유형별 통계를 확인합니다.')

  setElementText('check-back-btn', '메인')
  setElementText('check-refresh-btn', '새로고침')
  setElementText('check-set-back-btn', '이전 페이지')
  setElementText('check-set-home-btn', '메인')
  setElementText('check-submit-btn', '이번에 푼 문제 제출')
  setElementText('admin-back-btn', '메인')
  setElementText('admin-refresh-btn', '새로고침')
  setElementText('password-back-btn', '이전 페이지')
  setElementText('password-home-btn', '홈')
  setElementText('password-submit-btn', '비밀번호 저장')

  const passwordHeading = document.querySelector('#password-screen .hd h1')
  if(passwordHeading) passwordHeading.textContent = '비밀번호 변경'
  const passwordGroupTitle = document.querySelector('#password-screen .group-title h3')
  if(passwordGroupTitle) passwordGroupTitle.textContent = '처음 로그인했다면 비밀번호를 먼저 바꿔 주세요.'

  mountPortalPasswordButton()
}

function normalizeUserProfile(source){
  const classIds = Array.isArray(source && source.classIds)
    ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    : []
  return {
    uid: String(source && (source.uid || source.id) || '').trim(),
    loginId: derivePortalLoginId(source),
    email: String(source && source.email || '').trim().toLowerCase(),
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: classIds,
    role: String(source && source.role || 'student').trim() || 'student',
    passwordResetRequired: !!(source && source.passwordResetRequired),
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function normalizeUserProfileLocal(source){
  const loginId = derivePortalLoginId(source)
  const password = String(source && source.password || '').trim()
  const resetRequired = typeof (source && source.passwordResetRequired) === 'boolean'
    ? !!source.passwordResetRequired
    : (password === 'pass1234')
  return {
    id: String(source && source.id || '').trim(),
    loginId: loginId,
    email: String(source && source.email || toPortalLoginEmail(loginId) || '').trim().toLowerCase(),
    password: password,
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: Array.isArray(source && source.classIds)
      ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
      : [],
    role: String(source && source.role || 'student').trim() || 'student',
    passwordResetRequired: resetRequired,
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function ensureLocalPreviewUsers(){
  const existingUsers = readLocalUsers()
  if(existingUsers.length){
    let touched = false
    const normalizedUsers = existingUsers.map(function(user){
      const nextUser = normalizeUserProfileLocal(user)
      if(typeof user.passwordResetRequired !== 'boolean' || !nextUser.loginId || !nextUser.email){
        touched = true
      }
      return nextUser
    })
    if(touched){
      writeLocalUsers(normalizedUsers)
    }
    return { users: normalizedUsers, seeded: false }
  }

  const firstClassId = prepClasses[0] ? String(prepClasses[0].id || '').trim() : 'class-1'
  const now = new Date().toISOString()
  const seededUsers = [
    normalizeUserProfileLocal({
      id: 'student-preview-1',
      loginId: 'student01',
      email: 'student01@prep.local',
      password: 'pass1234',
      name: '테스트 학생',
      studentId: 'student01',
      classIds: firstClassId ? [firstClassId] : [],
      role: 'student',
      passwordResetRequired: true,
      createdAt: now,
      updatedAt: now
    }),
    normalizeUserProfileLocal({
      id: 'admin-preview-1',
      loginId: 'admin01',
      email: 'admin01@prep.local',
      password: 'pass1234',
      name: '테스트 관리자',
      studentId: 'admin01',
      classIds: firstClassId ? [firstClassId] : [],
      role: 'admin',
      passwordResetRequired: true,
      createdAt: now,
      updatedAt: now
    })
  ]

  writeLocalUsers(seededUsers)
  return { users: seededUsers, seeded: true }
}

function initLocalPortal(){
  portalState.firebaseEnabled = false
  portalState.authProvider = 'local'
  portalState.authResolved = true
  portalState.storage = null

  const previewResult = ensureLocalPreviewUsers()
  const currentUserId = localStorage.getItem(PORTAL_STORAGE_KEYS.currentUserId) || ''
  const localUser = previewResult.users.find(function(user){ return user.id === currentUserId }) || null

  portalState.currentUser = localUser ? buildLocalAuthUser(localUser) : null
  portalState.currentProfile = localUser ? localUser : null
  portalState.previewUsersSeeded = previewResult.seeded

  setAuthMeta('테스트 계정: student01 / pass1234 · 관리자: admin01 / pass1234')
  routePortalAfterState()
}

async function fetchOrCreateUserProfile(user){
  const snapshot = await portalState.db.collection('users').doc(user.uid).get()
  if(snapshot.exists){
    return normalizeUserProfile(Object.assign({ uid: user.uid }, snapshot.data()))
  }

  const fallbackClassId = prepClasses[0] ? prepClasses[0].id : ''
  const loginId = derivePortalLoginId({ email: user.email || '' })
  const profile = {
    uid: user.uid,
    loginId: loginId,
    email: user.email || '',
    name: user.displayName || '',
    studentId: loginId,
    classIds: fallbackClassId ? [fallbackClassId] : [],
    role: 'student',
    passwordResetRequired: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  await saveFirebaseUserProfile(user.uid, profile)
  return normalizeUserProfile(profile)
}

function routePortalAfterState(){
  syncAuthClassOptions()
  unlockAllPrepClasses()
  if(!bundleData) return
  if(!portalState.authResolved){
    showAuthScreen('로그인 상태를 확인하는 중입니다.')
    return
  }
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  if(!portalState.firebaseEnabled) ensureCurrentLocalUserHasClass()
  clearAuthError()
  updatePortalUserCard()
  mountPortalPasswordButton()
  if(isPasswordResetRequired(portalState.currentProfile)){
    openPasswordScreen(true)
    return
  }
  showPortalScreen()
  handlePortalHashRoute()
}

function showPortalScreen(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  updatePortalUserCard()
  mountPortalPasswordButton()
  activatePortalScreen('portal-screen')
}

function openCounselPortal(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  updatePortalUserCard()
  if(typeof renderCounselPortal === 'function') renderCounselPortal()
  activatePortalScreen('counsel-screen')
}

function openPasswordScreen(forceChange){
  const isForced = forceChange === true
  clearPasswordFields()
  clearPasswordError()
  portalState.forcePasswordChange = isForced

  const heading = document.querySelector('#password-screen .group-title h3')
  if(heading){
    heading.textContent = isForced
      ? '임시 비밀번호를 바꿔야 계속 이용할 수 있습니다.'
      : '새 비밀번호를 입력하면 바로 변경됩니다.'
  }

  const backBtn = document.getElementById('password-back-btn')
  const homeBtn = document.getElementById('password-home-btn')
  if(backBtn) backBtn.style.display = isForced ? 'none' : ''
  if(homeBtn) homeBtn.style.display = isForced ? 'none' : ''

  activatePortalScreen('password-screen')
}

async function submitPasswordChange(){
  const currentPassword = String(document.getElementById('password-current').value || '').trim()
  const nextPassword = String(document.getElementById('password-next').value || '').trim()
  const confirmPassword = String(document.getElementById('password-confirm').value || '').trim()

  if(!currentPassword || !nextPassword || !confirmPassword){
    setPasswordError('모든 칸을 입력해 주세요.')
    return
  }
  if(nextPassword.length < 6){
    setPasswordError('새 비밀번호는 6자 이상으로 입력해 주세요.')
    return
  }
  if(nextPassword !== confirmPassword){
    setPasswordError('새 비밀번호 확인이 일치하지 않습니다.')
    return
  }
  if(currentPassword === nextPassword){
    setPasswordError('현재 비밀번호와 다른 값으로 바꿔 주세요.')
    return
  }

  try{
    if(portalState.firebaseEnabled){
      const user = portalState.auth.currentUser
      if(!user || !user.email) throw new Error('로그인 정보를 확인할 수 없습니다.')
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword)
      await user.reauthenticateWithCredential(credential)
      await user.updatePassword(nextPassword)
      await saveFirebaseUserProfile(user.uid, {
        passwordResetRequired: false,
        updatedAt: new Date().toISOString()
      })
      portalState.currentProfile = normalizeUserProfile(Object.assign({}, portalState.currentProfile || {}, {
        uid: user.uid,
        passwordResetRequired: false,
        updatedAt: new Date().toISOString()
      }))
    }else{
      const currentUserId = portalState.currentUser ? portalState.currentUser.uid : ''
      const users = readLocalUsers()
      const targetIndex = users.findIndex(function(entry){
        return entry.id === currentUserId
      })
      if(targetIndex < 0) throw new Error('계정 정보를 찾지 못했습니다.')
      if(users[targetIndex].password !== currentPassword) throw new Error('현재 비밀번호가 올바르지 않습니다.')

      users[targetIndex].password = nextPassword
      users[targetIndex].passwordResetRequired = false
      users[targetIndex].updatedAt = new Date().toISOString()
      writeLocalUsers(users)
      portalState.currentProfile = users[targetIndex]
      portalState.currentUser = buildLocalAuthUser(users[targetIndex])
    }

    portalState.forcePasswordChange = false
    clearPasswordError()
    clearPasswordFields()

    const backBtn = document.getElementById('password-back-btn')
    const homeBtn = document.getElementById('password-home-btn')
    if(backBtn) backBtn.style.display = ''
    if(homeBtn) homeBtn.style.display = ''

    showToast('비밀번호를 변경했습니다.', 'var(--green)')
    showPortalScreen()
  }catch(error){
    setPasswordError(getPasswordChangeErrorMessage(error))
  }
}

function getPortalErrorMessage(error){
  const message = String(error && error.message || '')
  if(message.indexOf('auth/email-already-in-use') >= 0) return '이미 등록된 계정입니다.'
  if(message.indexOf('auth/invalid-email') >= 0) return '로그인 정보 형식이 올바르지 않습니다.'
  if(message.indexOf('auth/weak-password') >= 0) return '비밀번호는 더 길게 입력해 주세요.'
  if(message.indexOf('auth/invalid-login-credentials') >= 0 || message.indexOf('auth/wrong-password') >= 0) return '아이디 또는 비밀번호가 올바르지 않습니다.'
  if(message.indexOf('auth/user-not-found') >= 0) return '등록되지 않은 계정입니다.'
  return message || '처리를 완료하지 못했습니다.'
}

function escapeJs(value){
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

window.handlePortalRouteAfterLoad = function(){
  if(!bundleData) return false
  routePortalAfterState()
  return true
}

window.handlePrepBackToPortal = function(){
  if(!portalState.currentUser) return false
  showPortalScreen()
  return true
}

window.handlePortalClassSelectionComplete = function(){
  const targetScreen = portalState.classSelectionReturnScreen || ''
  portalState.classSelectionReturnScreen = ''
  if(targetScreen === 'passage-screen'){
    showPassageScreen()
    if(typeof syncPortalAdminSetPanels === 'function'){
      syncPortalAdminSetPanels('passage-screen')
    }
    return true
  }
  if(targetScreen === 'check-screen'){
    renderCheckScreen()
    activatePortalScreen('check-screen')
    return true
  }
  return false
}

window.isPortalStudentLockedClass = function(){
  return !!portalState.currentUser && !isPortalAdmin()
}

window.getVisiblePortalPrepClassEntries = getVisiblePortalPrepClassEntries

window.openCheckSetPortal = openCheckSetPortal

function applyPortalCopy(){
  const authTagline = document.querySelector('#auth-screen .tagline')
  if(authTagline) authTagline.textContent = '로그인 후 PREP과 CHECK를 이용하세요.'

  const authLogo = document.querySelector('#auth-screen .logo')
  if(authLogo) authLogo.textContent = 'CODE LAB'

  const authOverlayFooter = document.querySelector('#auth-screen .prep-footer.overlay')
  if(authOverlayFooter) authOverlayFooter.style.display = 'none'

  const authHelp = document.getElementById('auth-help')
  if(authHelp) authHelp.textContent = '선생님이 배부한 아이디와 임시 비밀번호로 로그인합니다.'

  const authIdField = document.getElementById('auth-email')
  if(authIdField){
    authIdField.type = 'text'
    authIdField.inputMode = 'text'
    authIdField.autocapitalize = 'off'
    authIdField.spellcheck = false
  }

  setFieldLabel('auth-email', '아이디')
  setFieldLabel('auth-password', '비밀번호')
  setPlaceholder('auth-email', 'student01')
  setPlaceholder('auth-password', '비밀번호')

  setElementText('auth-login-tab', '로그인')
  setElementText('auth-submit-btn', '로그인')
  setElementText('portal-refresh-btn', '새로고침')
  setElementText('portal-logout-btn', '로그아웃')
  setElementText('portal-password-btn', '비밀번호 변경')
  setElementText('portal-user-name', '학생')
  setElementText('portal-user-meta', '')

  setHeadingText('#portal-screen .hd h1', 'CODE LAB')
  setHeadingText('#check-screen .hd h1', 'CHECK')
  setHeadingText('#check-set-screen .hd h1', 'CHECK')
  setHeadingText('#admin-screen .hd h1', 'ADMIN')

  setQueryText('#portal-screen .portal-user-label', '현재 로그인')
  setQueryText('#check-screen .class-bar-label', '현재 반')
  setQueryText('#check-set-screen .class-bar-label', '현재 CHECK 세트')

  hydratePortalCard('portal-prep-btn', '학습', 'PREP', '내 반에 배정된 세트를 열고 지문을 미리 공부합니다.')
  hydratePortalCard('portal-check-btn', '제출', 'CHECK', '푼 문제만 제출하고, 제출한 문항의 정답과 해설을 바로 확인합니다.')
  hydratePortalCard('portal-admin-btn', '관리', 'ADMIN', '학생별 오답과 문제 유형 통계를 확인합니다.')

  setElementText('check-back-btn', '메인')
  setElementText('check-refresh-btn', '새로고침')
  setElementText('check-set-back-btn', '이전 페이지')
  setElementText('check-set-home-btn', '메인')
  setElementText('check-submit-btn', '이번에 푼 문제 제출')
  setElementText('admin-back-btn', '메인')
  setElementText('admin-refresh-btn', '새로고침')
  setElementText('password-back-btn', '이전 페이지')
  setElementText('password-home-btn', '홈')
  setElementText('password-submit-btn', '비밀번호 저장')

  const portalSubtitle = document.getElementById('portal-subtitle')
  const homeSubtitle = document.getElementById('home-subtitle')
  const classSubtitle = document.getElementById('class-subtitle')
  const classAuthSubtitle = document.getElementById('class-auth-subtitle')
  const passageSubtitle = document.getElementById('passage-subtitle')
  const checkSubtitle = document.getElementById('check-subtitle')
  const checkSetSubtitle = document.getElementById('check-set-subtitle')
  const adminSubtitle = document.getElementById('admin-subtitle')

  if(portalSubtitle) portalSubtitle.textContent = ''
  if(homeSubtitle) homeSubtitle.textContent = ''
  if(classSubtitle) classSubtitle.textContent = ''
  if(classAuthSubtitle) classAuthSubtitle.textContent = ''
  if(passageSubtitle) passageSubtitle.textContent = ''
  if(checkSubtitle) checkSubtitle.textContent = ''
  if(checkSetSubtitle) checkSetSubtitle.textContent = ''
  if(adminSubtitle) adminSubtitle.textContent = ''
}

function normalizePortalLoginId(value){
  return String(value || '').trim().toLowerCase()
}

function toPortalLoginEmail(value){
  const normalized = normalizePortalLoginId(value)
  if(!normalized) return ''
  if(normalized.includes('@')) return normalized
  const sanitized = normalized.replace(/[^a-z0-9._-]/g, '')
  return sanitized ? (sanitized + '@prep.local') : ''
}

function derivePortalLoginId(source){
  const direct = normalizePortalLoginId(source && source.loginId)
  if(direct) return direct
  const email = String(source && source.email || '').trim().toLowerCase()
  if(email.includes('@')) return normalizePortalLoginId(email.split('@')[0])
  return normalizePortalLoginId(email)
}

function findLocalPortalUser(loginId, password){
  const normalizedLoginId = normalizePortalLoginId(loginId)
  const normalizedEmail = toPortalLoginEmail(loginId)
  return readLocalUsers().find(function(entry){
    const entryLoginId = normalizePortalLoginId(entry.loginId)
    const entryEmail = String(entry.email || '').trim().toLowerCase()
    const matchesLogin = (entryLoginId && entryLoginId === normalizedLoginId)
      || (entryEmail && entryEmail === normalizedEmail)
      || (normalizedLoginId.includes('@') && entryEmail === normalizedLoginId)
    if(!matchesLogin) return false
    if(typeof password === 'undefined') return true
    return entry.password === password
  }) || null
}

function ensureLocalPreviewUsers(){
  const existingUsers = readLocalUsers()
  if(existingUsers.length){
    return { users: existingUsers, seeded: false }
  }

  const firstClassId = prepClasses[0] ? String(prepClasses[0].id || '').trim() : 'class-1'
  const now = new Date().toISOString()
  const seededUsers = [
    normalizeUserProfileLocal({
      id: 'student-preview-1',
      loginId: 'student01',
      email: 'student01@prep.local',
      password: 'pass1234',
      name: '테스트 학생',
      studentId: 'student01',
      classIds: firstClassId ? [firstClassId] : [],
      role: 'student',
      passwordResetRequired: true,
      createdAt: now,
      updatedAt: now
    }),
    normalizeUserProfileLocal({
      id: 'admin-preview-1',
      loginId: 'admin01',
      email: 'admin01@prep.local',
      password: 'pass1234',
      name: '테스트 관리자',
      studentId: 'admin01',
      classIds: firstClassId ? [firstClassId] : [],
      role: 'admin',
      passwordResetRequired: true,
      createdAt: now,
      updatedAt: now
    })
  ]

  writeLocalUsers(seededUsers)
  return { users: seededUsers, seeded: true }
}

function ensureCurrentLocalUserHasClass(){
  if(portalState.firebaseEnabled || !portalState.currentProfile) return
  const availableClassIds = getPortalKnownClasses()
    .map(function(classInfo){ return String(classInfo && classInfo.id || '').trim() })
    .filter(Boolean)
  if(!availableClassIds.length) return

  const targetId = portalState.currentProfile.id || portalState.currentProfile.uid || (portalState.currentUser && portalState.currentUser.uid) || ''
  if(!targetId) return

  const users = readLocalUsers()
  const targetIndex = users.findIndex(function(user){ return user.id === targetId })
  if(targetIndex < 0) return

  const role = String(users[targetIndex].role || 'student').trim() || 'student'
  const nextClassIds = role === 'admin'
    ? availableClassIds.slice()
    : (Array.isArray(users[targetIndex].classIds) ? users[targetIndex].classIds : []).filter(function(classId){
        return availableClassIds.indexOf(String(classId || '').trim()) >= 0
      })

  if(nextClassIds.length){
    users[targetIndex].classIds = nextClassIds
  }else{
    users[targetIndex].classIds = role === 'admin' ? availableClassIds.slice() : [availableClassIds[0]]
    users[targetIndex].updatedAt = new Date().toISOString()
    writeLocalUsers(users)
  }

  portalState.currentProfile = users[targetIndex]
  portalState.currentUser = buildLocalAuthUser(users[targetIndex])
}

function applyPortalCopy(){
  const authTagline = document.querySelector('#auth-screen .tagline')
  if(authTagline) authTagline.textContent = '로그인 후 PREP과 CHECK를 이용하세요.'

  const authLogo = document.querySelector('#auth-screen .logo')
  if(authLogo) authLogo.textContent = 'CODE LAB'

  const authOverlayFooter = document.querySelector('#auth-screen .prep-footer.overlay')
  if(authOverlayFooter) authOverlayFooter.style.display = 'none'

  const authHelp = document.getElementById('auth-help')
  if(authHelp) authHelp.textContent = '선생님이 배부한 아이디와 임시 비밀번호로 로그인합니다.'

  const authIdField = document.getElementById('auth-email')
  if(authIdField){
    authIdField.type = 'text'
    authIdField.inputMode = 'text'
    authIdField.autocapitalize = 'off'
    authIdField.spellcheck = false
  }

  setFieldLabel('auth-email', '아이디')
  setFieldLabel('auth-password', '비밀번호')
  setPlaceholder('auth-email', 'student01')
  setPlaceholder('auth-password', '비밀번호')

  setElementText('auth-login-tab', '로그인')
  setElementText('auth-submit-btn', '로그인')
  setElementText('portal-refresh-btn', '새로고침')
  setElementText('portal-logout-btn', '로그아웃')
  setElementText('portal-password-btn', '비밀번호 변경')
  setElementText('portal-user-name', '학생')
  setElementText('portal-user-meta', '')
  setHeadingText('#portal-screen .hd h1', 'CODE LAB')
  setHeadingText('#check-screen .hd h1', 'CHECK')
  setHeadingText('#check-set-screen .hd h1', 'CHECK')
  setHeadingText('#admin-screen .hd h1', 'ADMIN')
  setQueryText('#portal-screen .portal-user-label', '현재 로그인')
  setQueryText('#check-screen .class-bar-label', '현재 반')
  setQueryText('#check-set-screen .class-bar-label', '현재 CHECK 세트')
  hydratePortalCard('portal-prep-btn', '학습', 'PREP', '내 반에 배정된 세트를 열고 지문을 미리 공부합니다.')
  hydratePortalCard('portal-check-btn', '제출', 'CHECK', '푼 문제만 제출하고, 제출한 문항의 정답과 해설을 바로 확인합니다.')
  hydratePortalCard('portal-counsel-btn', '상담', 'COUNSEL', '')
  hydratePortalCard('portal-admin-btn', '관리', 'ADMIN', '학생별 오답과 문제 유형 통계를 확인합니다.')

  setElementText('counsel-back-btn', '메인')
  setElementText('check-back-btn', '메인')
  setElementText('check-refresh-btn', '새로고침')
  setElementText('check-set-back-btn', '이전 페이지')
  setElementText('check-set-home-btn', '메인')
  setElementText('check-submit-btn', '이번에 푼 문제 제출')
  setElementText('admin-back-btn', '메인')
  setElementText('admin-refresh-btn', '새로고침')
  setElementText('password-back-btn', '이전 페이지')
  setElementText('password-home-btn', '홈')
  setElementText('password-submit-btn', '비밀번호 저장')
}

function bindPortalEvents(){
  const loginTab = document.getElementById('auth-login-tab')
  const submitBtn = document.getElementById('auth-submit-btn')
  const portalPrepBtn = document.getElementById('portal-prep-btn')
  const portalCheckBtn = document.getElementById('portal-check-btn')
  const portalCounselBtn = document.getElementById('portal-counsel-btn')
  const portalAdminBtn = document.getElementById('portal-admin-btn')
  const portalRefreshBtn = document.getElementById('portal-refresh-btn')
  const portalLogoutBtn = document.getElementById('portal-logout-btn')
  const portalPasswordBtn = document.getElementById('portal-password-btn')
  const counselBackBtn = document.getElementById('counsel-back-btn')
  const checkBackBtn = document.getElementById('check-back-btn')
  const checkRefreshBtn = document.getElementById('check-refresh-btn')
  const checkChangeClassBtn = document.getElementById('check-change-class-btn')
  const checkSetBackBtn = document.getElementById('check-set-back-btn')
  const checkSetHomeBtn = document.getElementById('check-set-home-btn')
  const checkSubmitBtn = document.getElementById('check-submit-btn')
  const adminBackBtn = document.getElementById('admin-back-btn')
  const adminRefreshBtn = document.getElementById('admin-refresh-btn')
  const passwordBackBtn = document.getElementById('password-back-btn')
  const passwordHomeBtn = document.getElementById('password-home-btn')
  const passwordSubmitBtn = document.getElementById('password-submit-btn')

  if(loginTab) loginTab.addEventListener('click', function(){ activatePortalScreen('auth-screen') })
  if(submitBtn) submitBtn.addEventListener('click', submitAuthForm)
  if(portalPrepBtn) portalPrepBtn.addEventListener('click', openPrepPortal)
  if(portalCheckBtn) portalCheckBtn.addEventListener('click', openCheckPortal)
  if(portalCounselBtn) portalCounselBtn.addEventListener('click', openCounselPortal)
  if(portalAdminBtn) portalAdminBtn.addEventListener('click', openAdminPortal)
  if(portalRefreshBtn) portalRefreshBtn.addEventListener('click', refreshPortalData)
  if(portalLogoutBtn) portalLogoutBtn.addEventListener('click', logoutPortal)
  if(portalPasswordBtn) portalPasswordBtn.addEventListener('click', openPasswordScreen)
  if(counselBackBtn) counselBackBtn.addEventListener('click', showPortalScreen)
  if(checkBackBtn) checkBackBtn.addEventListener('click', showPortalScreen)
  if(checkRefreshBtn) checkRefreshBtn.addEventListener('click', refreshCheckDataAndRender)
  if(checkChangeClassBtn) checkChangeClassBtn.addEventListener('click', openCheckClassPicker)
  if(checkSetBackBtn) checkSetBackBtn.addEventListener('click', showCheckScreen)
  if(checkSetHomeBtn) checkSetHomeBtn.addEventListener('click', showPortalScreen)
  if(checkSubmitBtn) checkSubmitBtn.addEventListener('click', submitCurrentCheckSet)
  if(adminBackBtn) adminBackBtn.addEventListener('click', showPortalScreen)
  if(adminRefreshBtn) adminRefreshBtn.addEventListener('click', openAdminPortal)
  if(passwordBackBtn) passwordBackBtn.addEventListener('click', showPortalScreen)
  if(passwordHomeBtn) passwordHomeBtn.addEventListener('click', showPortalScreen)
  if(passwordSubmitBtn) passwordSubmitBtn.addEventListener('click', submitPasswordChange)

  const loginIdField = document.getElementById('auth-email')
  const passwordField = document.getElementById('auth-password')
  if(loginIdField){
    loginIdField.addEventListener('keydown', function(event){
      if(event.key === 'Enter') submitAuthForm()
    })
  }
  if(passwordField){
    passwordField.addEventListener('keydown', function(event){
      if(event.key === 'Enter') submitAuthForm()
    })
  }
}

function normalizeUserProfile(source){
  const classIds = Array.isArray(source && source.classIds)
    ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    : []
  const passwordResetRequired = typeof (source && source.passwordResetRequired) === 'boolean'
    ? !!source.passwordResetRequired
    : false
  return {
    uid: String(source && (source.uid || source.id) || '').trim(),
    loginId: derivePortalLoginId(source),
    email: String(source && source.email || '').trim().toLowerCase(),
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: classIds,
    role: String(source && source.role || 'student').trim() || 'student',
    passwordResetRequired: passwordResetRequired,
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function buildLocalAuthUser(user){
  return {
    uid: user.id,
    loginId: user.loginId,
    email: user.email || toPortalLoginEmail(user.loginId)
  }
}

function normalizeUserProfileLocal(source){
  const loginId = derivePortalLoginId(source)
  const password = String(source && source.password || '').trim()
  const resetRequired = typeof (source && source.passwordResetRequired) === 'boolean'
    ? !!source.passwordResetRequired
    : (password === 'pass1234')
  return {
    id: String(source && source.id || '').trim(),
    loginId: loginId,
    email: String(source && source.email || toPortalLoginEmail(loginId) || '').trim().toLowerCase(),
    password: password,
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: Array.isArray(source && source.classIds)
      ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
      : [],
    role: String(source && source.role || 'student').trim() || 'student',
    passwordResetRequired: resetRequired,
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function initLocalPortal(){
  portalState.firebaseEnabled = false
  portalState.authProvider = 'local'
  portalState.authResolved = true

  const previewResult = ensureLocalPreviewUsers()
  const currentUserId = localStorage.getItem(PORTAL_STORAGE_KEYS.currentUserId) || ''
  const localUser = previewResult.users.find(function(user){ return user.id === currentUserId }) || null

  portalState.currentUser = localUser ? buildLocalAuthUser(localUser) : null
  portalState.currentProfile = localUser ? localUser : null
  portalState.previewUsersSeeded = previewResult.seeded

  if(previewResult.seeded){
    setAuthMeta('테스트 계정: student01 / pass1234 · 관리자: admin01 / pass1234')
  }else{
    setAuthMeta('선생님이 배부한 아이디와 비밀번호로 로그인하세요.')
  }

  routePortalAfterState()
}

async function fetchOrCreateUserProfile(user){
  const snapshot = await portalState.db.collection('users').doc(user.uid).get()
  if(snapshot.exists){
    return normalizeUserProfile(Object.assign({ uid: user.uid }, snapshot.data()))
  }

  const fallbackClassId = prepClasses[0] ? prepClasses[0].id : ''
  const loginId = derivePortalLoginId({ email: user.email || '' })
  const profile = {
    uid: user.uid,
    loginId: loginId,
    email: user.email || '',
    name: user.displayName || '',
    studentId: loginId,
    classIds: fallbackClassId ? [fallbackClassId] : [],
    role: 'student',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  await saveFirebaseUserProfile(user.uid, profile)
  return normalizeUserProfile(profile)
}

function routePortalAfterState(){
  syncAuthClassOptions()
  unlockAllPrepClasses()
  if(!bundleData) return
  if(!portalState.authResolved){
    showAuthScreen('로그인 상태를 확인하는 중입니다.')
    return
  }
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  if(!portalState.firebaseEnabled) ensureCurrentLocalUserHasClass()
  clearAuthError()
  updatePortalUserCard()
  mountPortalPasswordButton()
  if(isPasswordResetRequired(portalState.currentProfile)){
    openPasswordScreen(true)
    return
  }
  showPortalScreen()
  handlePortalHashRoute()
}

async function submitAuthForm(){
  clearAuthError()
  const loginId = String(document.getElementById('auth-email').value || '').trim()
  const password = String(document.getElementById('auth-password').value || '').trim()

  if(!loginId || !password){
    setAuthError('아이디와 비밀번호를 입력해 주세요.')
    return
  }

  setAuthLoading(true)
  try{
    await loginPortalUser(loginId, password)
    clearAuthFields()
  }catch(error){
    setAuthError(getPortalErrorMessage(error))
  }finally{
    setAuthLoading(false)
  }
}

async function loginPortalUser(loginId, password){
  if(portalState.firebaseEnabled){
    const credential = await portalState.auth.signInWithEmailAndPassword(toPortalLoginEmail(loginId), password)
    const user = credential && credential.user ? credential.user : portalState.auth.currentUser
    portalState.authResolved = true
    portalState.currentUser = user || null
    portalState.currentProfile = user ? await fetchOrCreateUserProfile(user) : null
    routePortalAfterState()
    return
  }

  const user = findLocalPortalUser(loginId, password)
  if(!user) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')

  localStorage.setItem(PORTAL_STORAGE_KEYS.currentUserId, user.id)
  portalState.currentUser = buildLocalAuthUser(user)
  portalState.currentProfile = user
  routePortalAfterState()
}

function updatePortalUserCard(){
  const profile = portalState.currentProfile
  const fallbackId = profile && (profile.studentId || profile.loginId)
  const currentLoginId = portalState.currentUser && portalState.currentUser.loginId
  const name = profile && profile.name
    ? profile.name
    : (fallbackId || currentLoginId || (portalState.currentUser && portalState.currentUser.email) || '학생')
  const classNames = getProfileClassNames()
  const roleLabel = isPortalAdmin() ? '관리자' : '학생'
  document.getElementById('portal-user-name').textContent = name
  document.getElementById('portal-user-meta').textContent =
    [
      roleLabel,
      classNames.join(', ') || '반 미지정',
      profile && profile.studentId ? ('ID ' + profile.studentId) : (profile && profile.loginId ? ('계정 ' + profile.loginId) : '')
    ]
      .filter(Boolean)
      .join(' · ')
  document.getElementById('portal-admin-btn').classList.toggle('hidden', !isPortalAdmin())
}

function setAuthLoading(isLoading){
  const button = document.getElementById('auth-submit-btn')
  if(!button) return
  button.disabled = !!isLoading
  button.textContent = isLoading ? '확인 중...' : '로그인'
}

function getPortalErrorMessage(error){
  const message = String(error && error.message || '')
  if(message.indexOf('auth/email-already-in-use') >= 0) return '이미 등록된 계정입니다.'
  if(message.indexOf('auth/invalid-email') >= 0) return '로그인용 계정 주소가 올바르지 않습니다.'
  if(message.indexOf('auth/weak-password') >= 0) return '비밀번호를 더 길게 입력해 주세요.'
  if(message.indexOf('auth/invalid-login-credentials') >= 0 || message.indexOf('auth/wrong-password') >= 0) return '아이디 또는 비밀번호가 올바르지 않습니다.'
  if(message.indexOf('auth/user-not-found') >= 0) return '등록되지 않은 아이디입니다.'
  return message || '처리를 완료하지 못했습니다.'
}
