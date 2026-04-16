const PORTAL_CLOUD_DOCS = {
  prep: 'prep-session',
  check: 'check-data'
}

const PORTAL_CLOUD_SET_COLLECTIONS = {
  prep: 'portalPrepSets',
  check: 'portalCheckSets'
}

const PORTAL_CLASS_CATALOG_DOC = 'prep-classes'

const PORTAL_ENHANCEMENT_KEYS = {
  contentPrefix: 'rotation_portal_content_v1_',
  issues: 'rotation_portal_question_issues_v1',
  issueHiddenPrefix: 'rotation_portal_hidden_question_issues_v1_'
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

const CHROME_BREADCRUMBS = {
  'portal-screen': ['CODE LAB', 'HOME'],
  'account-screen': ['CODE LAB', '회원정보'],
  'password-screen': ['CODE LAB', '비밀번호 변경'],
  'admin-portal-screen': ['CODE LAB', 'TOOLS'],
  'class-screen': ['CODE LAB', 'PREP', '반 선택'],
  'class-auth-screen': ['CODE LAB', 'PREP', '반 비밀번호'],
  'home-screen': ['CODE LAB', 'PREP', '학습 세트'],
  'passage-screen': ['CODE LAB', 'PREP', '지문 선택'],
  'study-menu-screen': ['CODE LAB', 'PREP', '유형 선택'],
  'study-screen': ['CODE LAB', 'PREP', '학습'],
  'check-screen': ['CODE LAB', 'CHECK', '세트 선택'],
  'check-set-screen': ['CODE LAB', 'CHECK', '답안 제출'],
  'admin-screen': ['CODE LAB', 'ADMIN']
}

const ADMIN_PORTAL_LABS = {
  'WORD LAB': 'https://enoch413.github.io/word-lab/',
  'PDF LAB': 'https://enoch413.github.io/pdf-lab/',
  'ROTATION LAB': 'https://enoch413.github.io/rotatation-lab/',
  'BUILDER LAB': 'https://enoch413.github.io/builder-lab/',
  'PINPOINT LAB': 'https://enoch413.github.io/pinpoint-lab/',
  'MERGER LAB': 'http://127.0.0.1:8781/'
}

const ADMIN_PORTAL_LAB_BUTTON_IDS = {
  'WORD LAB': 'admin-portal-word-btn',
  'PDF LAB': 'admin-portal-pdf-btn',
  'ROTATION LAB': 'admin-portal-rotation-btn',
  'BUILDER LAB': 'admin-portal-builder-btn',
  'PINPOINT LAB': 'admin-portal-pinpoint-btn',
  'MERGER LAB': 'admin-portal-merger-btn'
}

const ADMIN_PORTAL_LAB_OWNER_IDS = {
  'MERGER LAB': ['passion413']
}
const ADMIN_PORTAL_LAB_COUNT = 6
const ADMIN_PORTAL_CONNECTED_LABS = Object.keys(ADMIN_PORTAL_LABS).length

portalState.forcePasswordReset = false
portalState.contentMeta = portalState.contentMeta || {}
portalState.currentQuestionIssues = portalState.currentQuestionIssues || []
portalState.currentCheckDraftAnswers = portalState.currentCheckDraftAnswers || {}
portalState.currentCheckEditTargets = portalState.currentCheckEditTargets || {}
portalState.currentCheckFilter = portalState.currentCheckFilter || 'all'
portalState.adminCheckSetFilter = portalState.adminCheckSetFilter || 'all'
portalState.adminCheckAnalytics = portalState.adminCheckAnalytics || null
portalState.historyInitialized = false
portalState.currentRouteKey = ''
portalState.isRestoringHistory = false
portalState.prepSyncPromise = null
portalState.prepSetInventory = portalState.prepSetInventory || []
portalState.checkSetInventory = portalState.checkSetInventory || []
portalState.checkSetRegradeDocId = portalState.checkSetRegradeDocId || ''
portalState.checkSetEditor = portalState.checkSetEditor || {
  open: false,
  isSaving: false,
  savingScope: '',
  docId: '',
  title: '',
  currentDoc: null,
  questions: [],
  initialDigest: ''
}

document.addEventListener('DOMContentLoaded', initPortalEnhancements)

function initPortalEnhancements(){
  bindPortalEnhancementEvents()
  bindPasswordSubmitOverride()
  overrideSharedClassListRenderer()
  window.addEventListener('popstate', handleAppPopState)
  window.addEventListener('scroll', syncCheckJumpButtonVisibility, { passive: true })
  window.addEventListener('resize', syncCheckJumpButtonVisibility)
  window.addEventListener('resize', syncAppChromeLayout)
  if(!history.state || !history.state.appRoute){
    syncAppHistoryState(getCurrentActiveScreenId(), true)
  }else{
    portalState.historyInitialized = true
  }
  updatePortalUserCard()
  updateAppChrome(getCurrentActiveScreenId())
  syncAppChromeLayout()
  syncCheckJumpButtonVisibility()
  setTimeout(function(){
    if(!bundleData && !portalState.currentUser){
      showAuthScreen('')
    }
  }, 0)
}

function overrideSharedClassListRenderer(){
  if(typeof renderClassList !== 'function') return
  if(renderClassList.__portalSharedOverride === true) return

  renderClassList = function(){
    const container = document.getElementById('class-list')
    if(!container) return

    const visibleEntries = typeof window.getVisiblePortalPrepClassEntries === 'function'
      ? window.getVisiblePortalPrepClassEntries()
      : prepClasses.map(function(classInfo, index){
          return { classInfo: classInfo, index: index }
        })

    if(!visibleEntries.length){
      container.innerHTML = '<div class="empty-box">반 정보가 없습니다.</div>'
      return
    }

    container.innerHTML = visibleEntries.map(function(entry, visibleIndex){
      const classInfo = entry.classInfo
      const index = entry.index
      const studyCount = studySets.filter(function(studySet){
        return studySet.classAssignments.some(function(assignment){
          return assignment.classId === classInfo.id && assignment.passageIndexes.length > 0
        })
      }).length
      const portalCardMeta = getPortalClassSelectionCardMeta(classInfo, index) || {}
      const previewText = portalCardMeta.preview || (studyCount + '개의 학습 세트가 준비되어 있습니다.')
      const primaryTagText = portalCardMeta.primaryTag || ('세트 ' + studyCount)

      return '' +
        '<div class="class-item" onclick="requestClassAccess(' + index + ')">' +
          '<div class="class-num">' + (visibleIndex + 1) + '</div>' +
          '<div class="class-body">' +
            '<div class="class-title">' + escapeHtml(classInfo.name) + '</div>' +
            '<div class="class-preview">' + escapeHtml(previewText) + '</div>' +
            '<div class="class-tags">' +
              '<span class="class-tag">' + escapeHtml(primaryTagText) + '</span>' +
              '<span class="class-tag">' + (classInfo.password ? '비밀번호 있음' : '바로 입장') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="p-arrow">&rsaquo;</div>' +
        '</div>'
    }).join('')
  }

  renderClassList.__portalSharedOverride = true
}

function bindPasswordSubmitOverride(){
  const originalButton = document.getElementById('password-submit-btn')
  if(!originalButton || !originalButton.parentNode) return
  if(originalButton.dataset.overrideBound === 'true') return

  const replacementButton = originalButton.cloneNode(true)
  replacementButton.dataset.overrideBound = 'true'
  originalButton.parentNode.replaceChild(replacementButton, originalButton)
  replacementButton.addEventListener('click', function(event){
    event.preventDefault()
    event.stopPropagation()
    submitPasswordChange()
  })
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
  bindClick('admin-portal-merger-btn', function(){ openLabPlaceholder('MERGER LAB') })
  bindClick('admin-portal-home-btn', openToolsPortal)
  bindClick('admin-tools-entry-btn', openToolsPortal)
  bindClick('check-jump-bottom-btn', scrollCheckScreenToBottom)
  bindClick('prep-admin-upload-btn', function(){
    const input = document.getElementById('prep-set-upload-input')
    if(input) input.click()
  })
  bindClick('check-admin-upload-btn', function(){
    const input = document.getElementById('check-set-upload-input')
    if(input) input.click()
  })
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

  const prepSetUploadInput = document.getElementById('prep-set-upload-input')
  if(prepSetUploadInput){
    prepSetUploadInput.addEventListener('change', function(event){
      handlePortalSetUpload('prep', event)
    })
  }

  const checkSetUploadInput = document.getElementById('check-set-upload-input')
  if(checkSetUploadInput){
    checkSetUploadInput.addEventListener('change', function(event){
      handlePortalSetUpload('check', event)
    })
  }

  bindClick('check-set-editor-backdrop', function(){
    closePortalManagedCheckSetEditor()
  })
  bindClick('check-set-editor-close-btn', function(){
    closePortalManagedCheckSetEditor()
  })
  bindClick('check-set-editor-cancel-btn', function(){
    closePortalManagedCheckSetEditor()
  })
  bindClick('check-set-editor-save-btn', savePortalManagedCheckSetEditor)

  const checkSetEditorList = document.getElementById('check-set-editor-list')
  if(checkSetEditorList && checkSetEditorList.dataset.bound !== 'true'){
    checkSetEditorList.dataset.bound = 'true'
    checkSetEditorList.addEventListener('input', handlePortalManagedCheckSetEditorFieldChange)
    checkSetEditorList.addEventListener('change', handlePortalManagedCheckSetEditorFieldChange)
  }
  ensurePortalManagedCheckSetEditorGroupSaveButton()
  bindClick('check-set-editor-save-group-btn', savePortalManagedCheckSetEditorForSourceGroup)

  if(document.body && document.body.dataset.checkSetEditorHotkeyBound !== 'true'){
    document.body.dataset.checkSetEditorHotkeyBound = 'true'
    document.addEventListener('keydown', handlePortalManagedCheckSetEditorKeydown)
  }
}

function bindClick(id, handler){
  const node = document.getElementById(id)
  if(node) node.addEventListener('click', handler)
}

function ensurePortalManagedCheckSetEditorGroupSaveButton(){
  const saveButton = document.getElementById('check-set-editor-save-btn')
  const saveGroupButton = document.getElementById('check-set-editor-save-group-btn')
  if(!saveButton || document.getElementById('check-set-editor-save-group-btn')) return
  const actions = saveButton.parentElement
  if(!actions) return
  const button = document.createElement('button')
  button.className = 'btn btn-ghost btn-sm'
  button.type = 'button'
  button.id = 'check-set-editor-save-group-btn'
  button.textContent = '같은 원본 전체 저장'
  actions.insertBefore(button, saveButton)
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

function getPendingPrepClass(){
  if(!Array.isArray(prepClasses)) return null
  return typeof pendingClassIndex === 'number' && pendingClassIndex >= 0
    ? (prepClasses[pendingClassIndex] || null)
    : null
}

function getCurrentPrepPassage(){
  const studySet = typeof getCurrentStudySet === 'function' ? getCurrentStudySet() : null
  if(!studySet || !Array.isArray(studySet.passages)) return null
  return typeof currentPassage === 'number' && currentPassage >= 0
    ? (studySet.passages[currentPassage] || null)
    : null
}

function getCurrentPrepSection(){
  const passage = getCurrentPrepPassage()
  if(!passage || typeof groupItems !== 'function') return null
  const sectionId = String(typeof currentStudySectionId === 'string' ? currentStudySectionId : '').trim()
  if(!sectionId) return null
  const sections = groupItems(passage.items)
  return sections.find(function(section){
    return section.id === sectionId
  }) || null
}

function buildPrepBreadcrumb(screenId){
  const parts = ['CODE LAB', 'PREP']
  const currentClass = typeof getCurrentClass === 'function' ? getCurrentClass() : null
  const currentSet = typeof getCurrentStudySet === 'function' ? getCurrentStudySet() : null
  const currentPassageEntry = getCurrentPrepPassage()
  const currentSection = getCurrentPrepSection()
  const pendingClass = getPendingPrepClass()

  if(screenId === 'class-screen'){
    parts.push('반 선택')
    return parts
  }

  if(screenId === 'class-auth-screen'){
    if(pendingClass && pendingClass.name) parts.push(pendingClass.name)
    parts.push('입장 인증')
    return parts
  }

  if(currentClass && currentClass.name) parts.push(currentClass.name)

  if(screenId === 'home-screen'){
    parts.push('세트 선택')
    return parts
  }

  if(currentSet && currentSet.title) parts.push(currentSet.title)

  if(screenId === 'passage-screen'){
    parts.push('지문 선택')
    return parts
  }

  if(currentPassageEntry && currentPassageEntry.title) parts.push(currentPassageEntry.title)

  if(screenId === 'study-menu-screen'){
    parts.push('유형 선택')
    return parts
  }

  if(currentSection && currentSection.title){
    parts.push(currentSection.title)
    return parts
  }

  if(screenId === 'study-screen'){
    parts.push('학습')
    return parts
  }

  return parts
}

function buildCheckBreadcrumb(screenId){
  const parts = ['CODE LAB', 'CHECK']
  const activeClassEntry = typeof getActivePortalCheckClass === 'function'
    ? getActivePortalCheckClass()
    : null
  const activeClassName = activeClassEntry && activeClassEntry.classInfo
    ? classInfoName(activeClassEntry.classInfo)
    : ''

  if(activeClassName) parts.push(activeClassName)

  if(screenId === 'check-screen'){
    parts.push('세트 선택')
    return parts
  }

  if(screenId === 'check-set-screen'){
    if(portalState.currentCheckSet && portalState.currentCheckSet.title){
      parts.push(portalState.currentCheckSet.title)
    }else{
      parts.push('답안 제출')
    }
  }

  return parts
}

function isCheckClassSelectionContext(){
  const returnScreen = String(portalState.classSelectionReturnScreen || '').trim()
  return returnScreen === 'check-screen' || returnScreen === 'check-set-screen'
}

function getPortalClassSelectionCardMeta(classInfo){
  if(!isCheckClassSelectionContext()){
    return null
  }

  const classId = String(classInfo && classInfo.id || '').trim()
  const checkSets = Array.isArray(portalState.checkData && portalState.checkData.checkSets)
    ? portalState.checkData.checkSets
    : []
  const checkCount = checkSets.filter(function(checkSet){
    const classIds = Array.isArray(checkSet && checkSet.classIds) ? checkSet.classIds : []
    return classId && classIds.indexOf(classId) >= 0
  }).length

  return {
    preview: checkCount + '개의 CHECK 세트가 준비되어 있습니다.',
    primaryTag: '세트 ' + checkCount
  }
}

function buildCheckClassSelectionBreadcrumb(screenId){
  const parts = ['CODE LAB', 'CHECK']
  const pendingClass = getPendingPrepClass()

  if(screenId === 'class-screen'){
    parts.push('반 선택')
    return parts
  }

  if(screenId === 'class-auth-screen'){
    if(pendingClass && pendingClass.name) parts.push(pendingClass.name)
    parts.push('입장 인증')
    return parts
  }

  return parts
}

function getAppBreadcrumb(screenId){
  if((screenId === 'class-screen' || screenId === 'class-auth-screen') && isCheckClassSelectionContext()){
    return buildCheckClassSelectionBreadcrumb(screenId)
  }
  if(PREP_SCREEN_IDS.indexOf(screenId) >= 0){
    return buildPrepBreadcrumb(screenId)
  }
  if(screenId === 'check-screen' || screenId === 'check-set-screen'){
    return buildCheckBreadcrumb(screenId)
  }
  if(screenId === 'portal-screen') return ['CODE LAB', 'HOME']
  if(screenId === 'account-screen') return ['CODE LAB', 'HOME', '회원정보']
  if(screenId === 'password-screen') return ['CODE LAB', 'HOME', '비밀번호 변경']
  if(screenId === 'admin-portal-screen') return ['CODE LAB', 'ADMIN', 'TOOLS']
  if(screenId === 'admin-screen') return ['CODE LAB', 'ADMIN', 'CHECK 통계']
  return CHROME_BREADCRUMBS[screenId] || ['CODE LAB']
}

function getAppChromeMeta(screenId){
  if((screenId === 'class-screen' || screenId === 'class-auth-screen') && isCheckClassSelectionContext()){
    return {
      title: 'CHECK',
      sub: screenId === 'class-auth-screen' ? '반 비밀번호' : '반 선택'
    }
  }
  return CHROME_SCREEN_TITLES[screenId] || { title: 'CODE LAB', sub: '' }
}

function getAppChromeSubText(screenId, fallbackText){
  if(screenId === 'check-set-screen' && portalState.currentCheckSet && portalState.currentCheckSet.title){
    return portalState.currentCheckSet.title
  }
  const classNames = getProfileClassNames().join(', ')
  return classNames || fallbackText || ''
}

function syncSharedClassSelectionCopy(screenId){
  const targetScreenId = screenId || getCurrentActiveScreenId()
  const isCheckContext =
    (targetScreenId === 'class-screen' || targetScreenId === 'class-auth-screen') &&
    isCheckClassSelectionContext()
  const classTitle = isCheckContext ? 'CHECK' : 'PREP'
  const authHelp = isCheckContext
    ? '이 반에 열려 있는 CHECK 세트를 보려면 반 비밀번호를 입력해 주세요.'
    : '이 반에 열려 있는 학습 세트를 보려면 반 비밀번호를 입력해 주세요.'
  const classScreenTitle = document.querySelector('#class-screen .hd h1')
  const classAuthScreenTitle = document.querySelector('#class-auth-screen .hd h1')

  if(classScreenTitle) classScreenTitle.textContent = classTitle
  if(classAuthScreenTitle) classAuthScreenTitle.textContent = classTitle
  setElementTextSafe('class-auth-help', authHelp)
}

function updateAppChrome(screenId){
  const chrome = document.getElementById('app-chrome')
  const menuButton = document.getElementById('app-menu-btn')
  const breadcrumbNode = document.getElementById('app-chrome-breadcrumb')
  const titleNode = document.getElementById('app-chrome-title')
  const subNode = document.getElementById('app-chrome-sub')
  if(!chrome || !titleNode || !subNode || !menuButton || !breadcrumbNode) return

  const hiddenScreens = ['auth-screen', 'boot-screen', 'pw-screen']
  const shouldShow = hiddenScreens.indexOf(screenId) < 0 && !!portalState.currentUser
  chrome.classList.toggle('hidden', !shouldShow)
  chrome.setAttribute('aria-hidden', shouldShow ? 'false' : 'true')
  menuButton.disabled = !shouldShow

  const meta = getAppChromeMeta(screenId)
  breadcrumbNode.textContent = getAppBreadcrumb(screenId).join(' > ')
  titleNode.textContent = meta.title
  subNode.textContent = getAppChromeSubText(screenId, meta.sub)
  queueAppChromeLayoutSync()
}

function queueAppChromeLayoutSync(){
  if(typeof window.requestAnimationFrame === 'function'){
    window.requestAnimationFrame(syncAppChromeLayout)
    return
  }
  setTimeout(syncAppChromeLayout, 0)
}

function syncAppChromeLayout(){
  const chrome = document.getElementById('app-chrome')
  const isVisible = !!(chrome && !chrome.classList.contains('hidden'))
  const height = isVisible ? Math.ceil(chrome.getBoundingClientRect().height) : 0
  const offset = isVisible ? Math.max(84, height + 18) : 84
  document.documentElement.style.setProperty('--app-chrome-offset', offset + 'px')
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
    syncCheckJumpButtonVisibility()
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
  syncSharedClassSelectionCopy(screenId)
  if(screenId === 'class-screen' && typeof renderClassList === 'function'){
    renderClassList()
  }
  updateAppChrome(screenId)
  syncAppHistoryState(screenId, false)
  syncCheckJumpButtonVisibility()
  syncPortalAdminSetPanels(screenId)
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

function scrollCheckScreenToBottom(){
  if(getCurrentActiveScreenId() !== 'check-set-screen') return
  const submitArea = document.getElementById('check-submit-actions')
  if(submitArea && typeof submitArea.scrollIntoView === 'function'){
    submitArea.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
  setTimeout(function(){
    const scrollHeight = Math.max(
      document.documentElement ? document.documentElement.scrollHeight : 0,
      document.body ? document.body.scrollHeight : 0
    )
    window.scrollTo({ top: scrollHeight, behavior: 'smooth' })
  }, 120)
}

function syncCheckJumpButtonVisibility(){
  const button = document.getElementById('check-jump-bottom-btn')
  if(!button){
    return
  }

  if(getCurrentActiveScreenId() !== 'check-set-screen'){
    button.classList.add('hidden')
    return
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0
  const scrollHeight = Math.max(
    document.documentElement ? document.documentElement.scrollHeight : 0,
    document.body ? document.body.scrollHeight : 0
  )
  const canScrollMore = scrollHeight - viewportHeight > 280
  const submitArea = document.getElementById('check-submit-actions')
  const nearBottom = submitArea
    ? submitArea.getBoundingClientRect().top <= viewportHeight - 120
    : (window.scrollY + viewportHeight >= scrollHeight - 180)

  button.classList.toggle('hidden', !canScrollMore || nearBottom)
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
      console.warn('portalContent read failed:', error && error.message ? error.message : error)
      return null
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
      console.warn('portalContent write failed:', error && error.message ? error.message : error)
      throw new Error('Firebase save failed. This upload was not shared to other users.')
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
  if(!isAdminPortalLabAllowed(name)){
    showToast('이 LAB은 현재 계정에 허용되지 않았습니다.', 'var(--red)')
    return
  }
  const url = ADMIN_PORTAL_LABS[name]
  if(!url){
    showToast(name + ' 주소가 아직 연결되지 않았습니다.', 'var(--red)')
    return
  }
  const opened = window.open('', '_blank')
  if(!opened){
    showToast('새 창이 차단되었습니다. 팝업 차단을 해제한 뒤 다시 시도해 주세요.', 'var(--red)')
    return
  }
  opened.opener = null
  opened.location.href = url
}

function getAllAdminPortalLabs(){
  return Object.keys(ADMIN_PORTAL_LABS)
}

function getCurrentAdminPortalIdentitySet(){
  const profile = portalState.currentProfile || {}
  const user = portalState.currentUser || {}
  const identities = new Set()

  ;[
    profile.loginId,
    profile.studentId,
    profile.name,
    profile.uid,
    user.uid,
    user.loginId
  ].forEach(function(value){
    const text = String(value || '').trim().toLowerCase()
    if(text) identities.add(text)
  })

  ;[
    profile.email,
    user.email
  ].forEach(function(value){
    const text = String(value || '').trim().toLowerCase()
    if(!text) return
    identities.add(text)
    const localPart = text.split('@', 1)[0]
    if(localPart) identities.add(localPart)
  })

  return identities
}

function isCurrentAdminAllowedPortalLab(name){
  const ownerIds = Array.isArray(ADMIN_PORTAL_LAB_OWNER_IDS[name]) ? ADMIN_PORTAL_LAB_OWNER_IDS[name] : null
  if(!ownerIds || !ownerIds.length) return true
  const identities = getCurrentAdminPortalIdentitySet()
  return ownerIds.some(function(ownerId){
    return identities.has(String(ownerId || '').trim().toLowerCase())
  })
}

function filterAdminPortalLabsForCurrentUser(labs){
  return (Array.isArray(labs) ? labs : []).filter(function(labName){
    return isCurrentAdminAllowedPortalLab(labName)
  })
}

function normalizeAdminPortalLabName(value){
  const raw = String(value || '').trim().toLowerCase()
  if(!raw) return ''
  if(raw === 'all' || raw === '*') return '*'
  if(raw === 'word' || raw === 'wordlab' || raw === 'word-lab' || raw === 'word lab') return 'WORD LAB'
  if(raw === 'pdf' || raw === 'pdflab' || raw === 'pdf-lab' || raw === 'pdf lab') return 'PDF LAB'
  if(raw === 'rotation' || raw === 'rotationlab' || raw === 'rotation-lab' || raw === 'rotation lab') return 'ROTATION LAB'
  if(raw === 'builder' || raw === 'builderlab' || raw === 'builder-lab' || raw === 'builder lab') return 'BUILDER LAB'
  if(raw === 'pinpoint' || raw === 'pinpointlab' || raw === 'pinpoint-lab' || raw === 'pinpoint lab') return 'PINPOINT LAB'
  if(raw === 'merger' || raw === 'mergerlab' || raw === 'merger-lab' || raw === 'merger lab') return 'MERGER LAB'
  return ''
}

function normalizeAdminPortalLabList(values){
  if(!Array.isArray(values)) return null
  const allLabs = filterAdminPortalLabsForCurrentUser(getAllAdminPortalLabs())
  const normalized = []
  values.forEach(function(value){
    const next = normalizeAdminPortalLabName(value)
    if(!next) return
    if(next === '*'){
      allLabs.forEach(function(labName){
        if(normalized.indexOf(labName) < 0) normalized.push(labName)
      })
      return
    }
    if(normalized.indexOf(next) < 0) normalized.push(next)
  })
  return normalized
}

function extractAdminPortalLabList(source){
  if(!source || typeof source !== 'object') return null
  if(Array.isArray(source.allowedLabs)) return normalizeAdminPortalLabList(source.allowedLabs)
  if(Array.isArray(source.toolLabs)) return normalizeAdminPortalLabList(source.toolLabs)
  if(Array.isArray(source.labAccess)) return normalizeAdminPortalLabList(source.labAccess)
  return null
}

async function resolveAdminPortalLabList(){
  if(!isPortalAdmin()) return []

  const profileLabs = extractAdminPortalLabList(portalState.currentProfile)
  if(profileLabs) return filterAdminPortalLabsForCurrentUser(profileLabs)

  if(
    portalState.firebaseEnabled &&
    portalState.db &&
    portalState.currentUser &&
    portalState.currentUser.uid
  ){
    try{
      const snapshot = await portalState.db.collection('users').doc(portalState.currentUser.uid).get()
      if(snapshot.exists){
        const remoteLabs = extractAdminPortalLabList(snapshot.data())
        if(remoteLabs){
          if(portalState.currentProfile && typeof portalState.currentProfile === 'object'){
            portalState.currentProfile.allowedLabs = filterAdminPortalLabsForCurrentUser(remoteLabs)
          }
          return filterAdminPortalLabsForCurrentUser(remoteLabs)
        }
      }
    }catch(error){
      console.error(error)
    }
  }

  return filterAdminPortalLabsForCurrentUser(getAllAdminPortalLabs())
}

function applyAdminPortalLabVisibility(allowedLabs){
  const visibleLabs = Array.isArray(allowedLabs)
    ? filterAdminPortalLabsForCurrentUser(allowedLabs)
    : filterAdminPortalLabsForCurrentUser(getAllAdminPortalLabs())
  const groupCountNode = document.querySelector('#admin-portal-screen .group-count')
  const emptyStateNode = document.getElementById('admin-portal-empty-state')

  getAllAdminPortalLabs().forEach(function(labName){
    const buttonId = ADMIN_PORTAL_LAB_BUTTON_IDS[labName]
    const button = buttonId ? document.getElementById(buttonId) : null
    if(button) button.classList.toggle('hidden', visibleLabs.indexOf(labName) < 0)
  })

  if(groupCountNode){
    groupCountNode.textContent = String(visibleLabs.length) + ' LAB'
  }

  if(emptyStateNode){
    emptyStateNode.classList.toggle('hidden', visibleLabs.length > 0)
  }
}

function isAdminPortalLabAllowed(name){
  const allowedLabs = Array.isArray(portalState.adminPortalAllowedLabs)
    ? portalState.adminPortalAllowedLabs
    : filterAdminPortalLabsForCurrentUser(getAllAdminPortalLabs())
  return allowedLabs.indexOf(name) >= 0 && isCurrentAdminAllowedPortalLab(name)
}

function renderAdminPortalScreen(allowedLabs){
  const profile = portalState.currentProfile || {}
  const name = profile.name || profile.loginId || profile.studentId || '관리자'
  const visibleLabs = Array.isArray(allowedLabs)
    ? filterAdminPortalLabsForCurrentUser(allowedLabs)
    : filterAdminPortalLabsForCurrentUser(getAllAdminPortalLabs())

  setElementTextSafe('admin-portal-subtitle', 'TOOLS HUB')
  setElementTextSafe('admin-portal-user-name', name)
  setElementTextSafe(
    'admin-portal-lab-summary',
    'LAB ' + visibleLabs.length + ' / ' + ADMIN_PORTAL_LAB_COUNT + ' 연결 완료'
  )
  applyAdminPortalLabVisibility(visibleLabs)
}

async function openToolsPortal(){
  if(!isPortalAdmin()){
    showToast('관리자 계정만 TOOLS를 이용할 수 있습니다.', 'var(--red)')
    return
  }
  await syncPrepContentAfterLogin(false)
  await ensureCheckData(false)
  portalState.adminPortalAllowedLabs = await resolveAdminPortalLabList()
  updateAdminUploadStatus()
  renderAdminPortalScreen(portalState.adminPortalAllowedLabs)
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
    showToast(String(error && error.message || 'Upload failed.'), 'var(--red)')
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
  portalState.currentCheckEditTargets = {}
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
  if(getCurrentActiveScreenId() === 'check-set-screen'){
    updateAppChrome('check-set-screen')
  }
  if(typeof requestAnimationFrame === 'function'){
    requestAnimationFrame(syncCheckJumpButtonVisibility)
  }else{
    syncCheckJumpButtonVisibility()
  }
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
        const isMultiSelect = group.dataset.multiSelect === 'true'
        const maxChoices = Math.max(1, Number(group.dataset.maxChoices || 1))
        if(isMultiSelect){
          const currentValue = getCurrentCheckDraftAnswer(questionId) || getChoiceGroupAnswer(group)
          const nextState = toggleChoiceAnswerValue(currentValue, value, maxChoices)
          if(nextState.blocked){
            showToast(maxChoices + '개까지만 선택할 수 있습니다.', 'var(--blue)')
            return
          }
          setCurrentCheckDraftAnswer(questionId, nextState.value)
          applyChoiceGroupSelection(group, nextState.value)
          renderCheckSubmitArea(checkSet, submission)
          return
        }
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

function getCurrentCheckQuestionById(questionId){
  const checkSet = portalState.currentCheckSet
  const targetId = String(questionId || '').trim()
  if(!checkSet || !targetId || !Array.isArray(checkSet.questions)) return null
  return checkSet.questions.find(function(question){
    return String(question && question.id || '').trim() === targetId
  }) || null
}

function setCurrentCheckDraftAnswer(questionId, value){
  if(!portalState.currentCheckDraftAnswers) portalState.currentCheckDraftAnswers = {}
  const targetId = String(questionId || '').trim()
  const question = getCurrentCheckQuestionById(targetId)
  const normalizedValue = question && normalizeCheckQuestionType(question.type) === '객관식'
    ? normalizeChoiceAnswer(value)
    : String(value || '').trim()
  portalState.currentCheckDraftAnswers[targetId] = normalizedValue
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

async function updateQuestionIssueRecord(issueId, updates){
  const targetId = String(issueId || '').trim()
  if(!targetId || !updates || typeof updates !== 'object') return false

  if(portalState.firebaseEnabled){
    try{
      await portalState.db.collection('questionIssues').doc(targetId).set(updates, { merge: true })
      return true
    }catch(error){
      console.warn('questionIssues update fallback:', error && error.message ? error.message : error)
    }
  }

  const rows = readLocalQuestionIssues()
  const nextRows = []
  let found = false
  rows.forEach(function(entry){
    if(String(entry && entry.id || '').trim() !== targetId){
      nextRows.push(entry)
      return
    }
    found = true
    nextRows.push(Object.assign({}, entry, updates, { id: targetId }))
  })
  if(!found) return false
  writeLocalQuestionIssues(nextRows)
  return true
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

function getAdminQuestionIssueHiddenStorageKey(){
  const identity = String(
    portalState.currentUser && portalState.currentUser.uid
      || portalState.currentProfile && (portalState.currentProfile.loginId || portalState.currentProfile.studentId)
      || 'anonymous'
  ).trim() || 'anonymous'
  return PORTAL_ENHANCEMENT_KEYS.issueHiddenPrefix + identity
}

function readAdminHiddenQuestionIssues(){
  try{
    const raw = localStorage.getItem(getAdminQuestionIssueHiddenStorageKey())
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  }catch(error){
    console.error(error)
    return {}
  }
}

function writeAdminHiddenQuestionIssues(map){
  localStorage.setItem(getAdminQuestionIssueHiddenStorageKey(), JSON.stringify(map && typeof map === 'object' ? map : {}))
}

function hideAdminQuestionIssueLocally(issueId, issueCreatedAt){
  const targetId = String(issueId || '').trim()
  if(!targetId) return false
  const hiddenMap = readAdminHiddenQuestionIssues()
  hiddenMap[targetId] = String(issueCreatedAt || '').trim() || new Date().toISOString()
  writeAdminHiddenQuestionIssues(hiddenMap)
  return true
}

function isAdminQuestionIssueHidden(entry){
  const targetId = String(entry && entry.id || '').trim()
  if(!targetId) return false
  const hiddenMap = readAdminHiddenQuestionIssues()
  const hiddenCreatedAt = String(hiddenMap[targetId] || '').trim()
  if(!hiddenCreatedAt) return false
  return hiddenCreatedAt === String(entry && entry.createdAt || '').trim()
}

function normalizeQuestionIssueStatus(entry){
  const raw = String(entry && entry.status || '').trim().toLowerCase()
  if(raw === 'resolved' || raw === 'done' || raw === 'closed') return 'resolved'
  return 'open'
}

window.resolveAdminQuestionIssue = function(issueId, issueCreatedAt){
  resolveAdminQuestionIssueImpl(issueId, issueCreatedAt)
}

async function resolveAdminQuestionIssueImpl(issueId, issueCreatedAt){
  const targetId = String(issueId || '').trim()
  if(!targetId) return

  const processedAt = new Date().toISOString()
  const processedBy = portalState.currentProfile && (portalState.currentProfile.name || portalState.currentProfile.loginId)
    ? (portalState.currentProfile.name || portalState.currentProfile.loginId)
    : (portalState.currentUser && portalState.currentUser.email || '')
  const didSave = await updateQuestionIssueRecord(targetId, {
    status: 'resolved',
    resolvedAt: processedAt,
    resolvedBy: processedBy
  })

  if(!didSave){
    if(hideAdminQuestionIssueLocally(targetId, issueCreatedAt)){
      await renderAdminScreen()
      showToast('질문을 목록에서 숨겼습니다.', 'var(--green)')
      return
    }
    showToast('질문 처리 상태 저장에 실패했습니다.', 'var(--red)')
    return
  }

  await renderAdminScreen()
  showToast('질문을 목록에서 숨겼습니다.', 'var(--green)')
}

function syncAdminCollapsibleSectionState(section){
  if(!section) return
  const body = section.querySelector('.admin-collapsible-body')
  const button = section.querySelector('.group-toggle-btn')
  const isCollapsed = section.classList.contains('is-collapsed')
  if(body) body.hidden = isCollapsed
  if(button){
    button.textContent = isCollapsed ? '펼치기' : '접기'
    button.setAttribute('aria-expanded', isCollapsed ? 'false' : 'true')
  }
}

function ensureAdminCollapsibleSections(){
  ;[
    { groupId: 'admin-type-group', listId: 'admin-type-list', bodyId: 'admin-type-body' },
    { groupId: 'admin-student-group', listId: 'admin-student-list', bodyId: 'admin-student-body' },
    { groupId: 'admin-response-group', listId: 'admin-response-list', bodyId: 'admin-response-body' }
  ].forEach(function(config){
    const listNode = document.getElementById(config.listId)
    if(!listNode) return

    const section = listNode.closest('.group')
    if(!section) return
    section.id = config.groupId
    section.classList.add('admin-collapsible')

    const title = section.querySelector('.group-title')
    if(!title) return

    let body = section.querySelector('.admin-collapsible-body')
    if(!body){
      body = document.createElement('div')
      body.className = 'admin-collapsible-body'
      body.id = config.bodyId
      while(title.nextSibling){
        body.appendChild(title.nextSibling)
      }
      section.appendChild(body)
    }else if(!body.id){
      body.id = config.bodyId
    }

    let actions = title.querySelector('.group-title-actions')
    const countNode = title.querySelector('.group-count')
    if(!actions){
      actions = document.createElement('div')
      actions.className = 'group-title-actions'
      if(countNode) actions.appendChild(countNode)
      title.appendChild(actions)
    }else if(countNode && countNode.parentElement !== actions){
      actions.insertBefore(countNode, actions.firstChild)
    }

    let toggleButton = title.querySelector('.group-toggle-btn')
    if(!toggleButton){
      toggleButton = document.createElement('button')
      toggleButton.className = 'btn btn-ghost btn-sm group-toggle-btn'
      toggleButton.type = 'button'
      toggleButton.addEventListener('click', function(){
        window.toggleAdminSection && window.toggleAdminSection(section.id)
      })
      actions.appendChild(toggleButton)
    }

    toggleButton.setAttribute('aria-controls', body.id)
    if(!section.dataset.collapsibleInitialized){
      section.classList.add('is-collapsed')
      section.dataset.collapsibleInitialized = 'true'
    }
    syncAdminCollapsibleSectionState(section)
  })
}

window.toggleAdminSection = function(sectionId){
  const section = document.getElementById(sectionId)
  if(!section) return
  section.classList.toggle('is-collapsed')
  syncAdminCollapsibleSectionState(section)
}

async function renderAdminScreen(){
  ensureAdminCollapsibleSections()
  const responses = await fetchAllCheckResponses()
  const studentProfiles = await fetchAdminStudentProfiles()
  const studentResponses = responses.filter(function(entry){
    return entry.role !== 'admin'
  })

  syncAdminClassFilterControls(studentResponses)
  const classFilteredResponses = filterAdminResponsesByClass(studentResponses)
  syncAdminCheckSetFilterControls(classFilteredResponses)
  const filteredResponses = filterAdminResponsesByCheckSet(classFilteredResponses)

  const analytics = buildAdminCheckAnalytics(filteredResponses, studentProfiles, classFilteredResponses)
  portalState.adminCheckAnalytics = analytics
  syncAdminStudentFilterControls(analytics.students)

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

async function fetchAdminStudentProfiles(){
  let rows = []
  if(portalState.firebaseEnabled && portalState.db){
    try{
      const snapshot = await portalState.db.collection('users').get()
      rows = snapshot.docs.map(function(doc){
        return normalizeUserProfile(Object.assign({ uid: doc.id }, doc.data() || {}))
      })
    }catch(error){
      console.warn('users admin read fallback:', error && error.message ? error.message : error)
    }
  }

  if(!rows.length && typeof readLocalUsers === 'function'){
    rows = readLocalUsers().map(function(entry){
      return normalizeUserProfile(Object.assign({}, entry, {
        uid: entry && (entry.uid || entry.id)
      }))
    })
  }

  return rows.filter(function(entry){
    return String(entry && entry.role || 'student').trim().toLowerCase() !== 'admin'
  })
}

function getAdminCheckSetKey(entry){
  return String(entry && (entry.id || entry.checkSetId || entry.title || entry.checkSetTitle) || '').trim()
}

function getAdminResponseSetKey(entry){
  return String(entry && (entry.checkSetId || entry.checkSetTitle) || '').trim()
}

function getAdminScopedCheckSets(){
  const allSets = Array.isArray(portalState.checkData && portalState.checkData.checkSets)
    ? portalState.checkData.checkSets
    : []
  const allowedClassIds = getProfileClassIds()

  return allSets.filter(function(checkSet){
    const classIds = Array.isArray(checkSet && checkSet.classIds) ? checkSet.classIds : []
    if(isPortalAdmin() && !isPortalSuperAdmin()){
      if(!classIds.some(function(classId){
        return allowedClassIds.indexOf(classId) >= 0
      })) return false
    }
    if(portalState.adminClassFilter !== 'all'){
      return classIds.indexOf(portalState.adminClassFilter) >= 0
    }
    return true
  })
}

function buildAdminCheckSetOptions(rows){
  const map = new Map()
  getAdminScopedCheckSets().forEach(function(checkSet){
    const id = getAdminCheckSetKey(checkSet)
    if(!id) return
    map.set(id, {
      id: id,
      title: String(checkSet && checkSet.title || id).trim() || id,
      questionCount: Array.isArray(checkSet && checkSet.questions) ? checkSet.questions.length : 0
    })
  })

  ;(Array.isArray(rows) ? rows : []).forEach(function(entry){
    const id = getAdminResponseSetKey(entry)
    if(!id || map.has(id)) return
    map.set(id, {
      id: id,
      title: String(entry && entry.checkSetTitle || id).trim() || id,
      questionCount: Array.isArray(entry && entry.answers) ? entry.answers.length : 0
    })
  })

  return [{ id: 'all', title: '전체 세트', questionCount: 0 }].concat(
    Array.from(map.values()).sort(function(a, b){
      return String(a.title || '').localeCompare(String(b.title || ''), 'ko')
    })
  )
}

function syncAdminCheckSetFilterControls(rows){
  const select = document.getElementById('admin-check-set-filter')
  const nameNode = document.getElementById('admin-set-filter-name')
  const metaNode = document.getElementById('admin-set-filter-meta')
  const exportButton = document.getElementById('admin-check-export-btn')
  const options = buildAdminCheckSetOptions(rows)

  if(!options.some(function(option){ return option.id === portalState.adminCheckSetFilter })){
    portalState.adminCheckSetFilter = 'all'
  }

  if(select){
    select.innerHTML = options.map(function(option){
      const selected = option.id === portalState.adminCheckSetFilter ? ' selected' : ''
      const suffix = option.questionCount ? (' · ' + option.questionCount + '문항') : ''
      return '<option value="' + escapeHtml(option.id) + '"' + selected + '>' + escapeHtml(option.title + suffix) + '</option>'
    }).join('')
  }

  const currentOption = options.find(function(option){
    return option.id === portalState.adminCheckSetFilter
  }) || options[0]

  if(nameNode) nameNode.textContent = currentOption ? currentOption.title : '전체 세트'
  if(metaNode){
    metaNode.textContent = portalState.adminCheckSetFilter === 'all'
      ? '현재 통계 범위의 모든 CHECK 세트를 함께 분석합니다. 세트를 고르면 문항별 미제출까지 더 정확히 볼 수 있습니다.'
      : ((currentOption ? currentOption.title : '선택 세트') + ' 기준으로 문항별 오답/미제출 통계를 계산합니다.')
  }
  if(exportButton) exportButton.disabled = !options.length
}

function filterAdminResponsesByCheckSet(rows){
  const targetId = String(portalState.adminCheckSetFilter || 'all').trim() || 'all'
  if(targetId === 'all') return rows
  return (Array.isArray(rows) ? rows : []).filter(function(entry){
    return getAdminResponseSetKey(entry) === targetId
  })
}

window.handleAdminCheckSetFilterChange = function(value){
  portalState.adminCheckSetFilter = String(value || 'all').trim() || 'all'
  portalState.adminStudentFilter = ''
  renderAdminScreen()
}

window.handleAdminClassFilterChange = function(value){
  portalState.adminClassFilter = String(value || 'all').trim() || 'all'
  portalState.adminStudentFilter = ''
  portalState.adminCheckSetFilter = 'all'
  renderAdminScreen()
}

function buildAdminStudentOptions(rows){
  const map = new Map()

  ;(Array.isArray(rows) ? rows : []).forEach(function(entry){
    const id = String(entry && (entry.id || entry.userId || entry.studentId || entry.email || entry.name) || '').trim()
    if(!id || map.has(id)) return
    const label = String(entry && entry.label || '').trim() || getAdminResponseStudentLabel(entry)
    map.set(id, {
      id: id,
      label: label
    })
  })

  return Array.from(map.values()).sort(function(a, b){
    return String(a.label || '').localeCompare(String(b.label || ''), 'ko')
  })
}

function syncAdminStudentFilterControls(rows){
  const select = document.getElementById('admin-student-filter')
  const students = buildAdminStudentOptions(rows)

  if(!students.length){
    portalState.adminStudentFilter = ''
    if(select) select.innerHTML = '<option value="">전체 학생</option>'
    return
  }

  if(portalState.adminStudentFilter && !students.some(function(student){
    return student.id === portalState.adminStudentFilter
  })){
    portalState.adminStudentFilter = ''
  }

  if(select){
    const options = [{ id: '', label: '전체 학생' }].concat(students)
    select.innerHTML = options.map(function(student){
      const selected = student.id === portalState.adminStudentFilter ? ' selected' : ''
      return '<option value="' + escapeHtml(student.id) + '"' + selected + '>' + escapeHtml(student.label) + '</option>'
    }).join('')
  }
}

function findAdminCheckSetByKey(setKey){
  const key = String(setKey || '').trim()
  if(!key) return null
  return getAdminScopedCheckSets().find(function(checkSet){
    return getAdminCheckSetKey(checkSet) === key || String(checkSet && checkSet.title || '').trim() === key
  }) || null
}

function buildAdminSyntheticCheckSetFromResponse(entry){
  const id = getAdminResponseSetKey(entry)
  if(!id) return null
  const answers = Array.isArray(entry && entry.answers) ? entry.answers : []
  return {
    id: id,
    title: String(entry && entry.checkSetTitle || id).trim() || id,
    classIds: Array.isArray(entry && entry.classIds) ? entry.classIds.slice() : [],
    questions: answers.map(function(answer, index){
      const number = resolveSubmittedQuestionNumber(answer, index + 1)
      return {
        id: String(answer && (answer.questionId || answer.id) || ('q-' + number)).trim(),
        number: number,
        problemType: normalizeCheckProblemType(answer && (answer.problemType || answer.category)),
        prompt: String(answer && answer.prompt || '').trim()
      }
    })
  }
}

function getAdminAnalysisTargetSets(classFilteredRows){
  const selectedSetId = String(portalState.adminCheckSetFilter || 'all').trim() || 'all'
  const map = new Map()

  getAdminScopedCheckSets().forEach(function(checkSet){
    const id = getAdminCheckSetKey(checkSet)
    if(id) map.set(id, checkSet)
  })

  ;(Array.isArray(classFilteredRows) ? classFilteredRows : []).forEach(function(entry){
    const id = getAdminResponseSetKey(entry)
    if(!id || map.has(id)) return
    const syntheticSet = buildAdminSyntheticCheckSetFromResponse(entry)
    if(syntheticSet) map.set(id, syntheticSet)
  })

  if(selectedSetId !== 'all'){
    return map.has(selectedSetId) ? [map.get(selectedSetId)] : []
  }

  return Array.from(map.values()).sort(function(a, b){
    return String(a && a.title || '').localeCompare(String(b && b.title || ''), 'ko')
  })
}

function getAdminQuestionKey(setId, questionId, number){
  const qid = String(questionId || '').trim() || ('number-' + normalizeCheckQuestionNumber(number, 1))
  return String(setId || 'check-set').trim() + '::' + qid
}

function buildAdminQuestionItem(checkSet, question, index){
  const setId = getAdminCheckSetKey(checkSet)
  const number = normalizeCheckQuestionNumber(question && question.number, index + 1)
  const questionId = String(question && (question.id || question.questionId) || ('q-' + number)).trim()
  return {
    key: getAdminQuestionKey(setId, questionId, number),
    setId: setId,
    setTitle: String(checkSet && checkSet.title || setId || 'CHECK 세트').trim() || 'CHECK 세트',
    classIds: Array.isArray(checkSet && checkSet.classIds) ? checkSet.classIds.slice() : [],
    questionId: questionId,
    number: number,
    problemType: normalizeCheckProblemType(question && (question.problemType || question.category)),
    prompt: String(question && question.prompt || '').trim()
  }
}

function buildAdminAnalysisQuestions(targetSets, rows){
  const map = new Map()
  ;(Array.isArray(targetSets) ? targetSets : []).forEach(function(checkSet){
    ;(Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []).forEach(function(question, index){
      const item = buildAdminQuestionItem(checkSet, question, index)
      if(item.setId && !map.has(item.key)) map.set(item.key, item)
    })
  })

  ;(Array.isArray(rows) ? rows : []).forEach(function(entry){
    const setId = getAdminResponseSetKey(entry)
    if(!setId) return
    const setTitle = String(entry && entry.checkSetTitle || setId).trim() || setId
    ;(Array.isArray(entry && entry.answers) ? entry.answers : []).forEach(function(answer, index){
      const number = resolveSubmittedQuestionNumber(answer, index + 1)
      const questionId = String(answer && (answer.questionId || answer.id) || ('q-' + number)).trim()
      const key = getAdminQuestionKey(setId, questionId, number)
      if(map.has(key)) return
      map.set(key, {
        key: key,
        setId: setId,
        setTitle: setTitle,
        classIds: Array.isArray(entry && entry.classIds) ? entry.classIds.slice() : [],
        questionId: questionId,
        number: number,
        problemType: normalizeCheckProblemType(answer && (answer.problemType || answer.category)),
        prompt: String(answer && answer.prompt || '').trim()
      })
    })
  })

  return Array.from(map.values()).sort(function(a, b){
    if(String(a.setTitle || '') !== String(b.setTitle || '')){
      return String(a.setTitle || '').localeCompare(String(b.setTitle || ''), 'ko')
    }
    return Number(a.number || 0) - Number(b.number || 0)
  })
}

function getAdminStudentProfileKey(entry){
  return String(entry && (entry.uid || entry.id || entry.userId || entry.studentId || entry.email || entry.loginId || entry.name) || '').trim()
}

function getAdminStudentProfileLabel(entry){
  const name = String(entry && entry.name || '').trim()
  const studentId = String(entry && entry.studentId || entry.loginId || '').trim()
  const email = String(entry && entry.email || '').trim()
  if(name && studentId && name !== studentId) return name + ' · ' + studentId
  if(name) return name
  if(studentId) return studentId
  if(email) return email
  return '학생'
}

function getAdminAnalysisClassIds(targetSets){
  if(portalState.adminClassFilter !== 'all') return [portalState.adminClassFilter]
  const ids = new Set()
  ;(Array.isArray(targetSets) ? targetSets : []).forEach(function(checkSet){
    ;(Array.isArray(checkSet && checkSet.classIds) ? checkSet.classIds : []).forEach(function(classId){
      const id = String(classId || '').trim()
      if(id) ids.add(id)
    })
  })
  if(ids.size) return Array.from(ids)
  return isPortalAdmin() && !isPortalSuperAdmin() ? getProfileClassIds() : []
}

function hasAnyAdminClass(classIds, targetClassIds){
  const sourceIds = Array.isArray(classIds) ? classIds : []
  const targets = Array.isArray(targetClassIds) ? targetClassIds : []
  if(!targets.length) return true
  return sourceIds.some(function(classId){
    return targets.indexOf(classId) >= 0
  })
}

function buildAdminAnalysisStudents(studentProfiles, classFilteredRows, filteredRows, targetSets){
  const targetClassIds = getAdminAnalysisClassIds(targetSets)
  const map = new Map()

  ;(Array.isArray(studentProfiles) ? studentProfiles : []).forEach(function(profile){
    const id = getAdminStudentProfileKey(profile)
    if(!id || String(profile && profile.role || 'student').trim().toLowerCase() === 'admin') return
    if(!hasAnyAdminClass(profile.classIds, targetClassIds)) return
    map.set(id, {
      id: id,
      label: getAdminStudentProfileLabel(profile),
      studentId: String(profile && (profile.studentId || profile.loginId) || '').trim(),
      classIds: Array.isArray(profile && profile.classIds) ? profile.classIds.slice() : []
    })
  })

  ;(Array.isArray(classFilteredRows) ? classFilteredRows : []).concat(Array.isArray(filteredRows) ? filteredRows : []).forEach(function(entry){
    const id = getAdminResponseStudentKey(entry)
    if(!id || map.has(id)) return
    if(!hasAnyAdminClass(entry && entry.classIds, targetClassIds)) return
    map.set(id, {
      id: id,
      label: getAdminResponseStudentLabel(entry),
      studentId: String(entry && entry.studentId || '').trim(),
      classIds: Array.isArray(entry && entry.classIds) ? entry.classIds.slice() : []
    })
  })

  return Array.from(map.values()).sort(function(a, b){
    return String(a.label || '').localeCompare(String(b.label || ''), 'ko')
  })
}

function buildAdminLatestResponseMap(rows){
  const map = new Map()
  ;(Array.isArray(rows) ? rows : []).forEach(function(entry){
    const studentId = getAdminResponseStudentKey(entry)
    const setId = getAdminResponseSetKey(entry)
    if(!studentId || !setId) return
    const key = studentId + '::' + setId
    const current = map.get(key)
    if(!current || String(entry && entry.submittedAt || '') > String(current && current.submittedAt || '')){
      map.set(key, entry)
    }
  })
  return map
}

function findAdminSubmittedAnswer(response, question){
  const answers = Array.isArray(response && response.answers) ? response.answers : []
  const questionId = String(question && question.questionId || '').trim()
  const direct = answers.find(function(answer){
    return questionId && String(answer && answer.questionId || '').trim() === questionId
  }) || null
  if(direct) return direct
  return answers.find(function(answer, index){
    return resolveSubmittedQuestionNumber(answer, index + 1) === Number(question && question.number || 0)
  }) || null
}

function getAdminQuestionDisplayLabel(question, includeSet){
  const numberText = String(question && question.number || '') + '번'
  if(includeSet) return String(question && question.setTitle || 'CHECK 세트') + ' · ' + numberText
  return numberText
}

function getAdminAnswerStatus(response, question){
  if(!response) return { status: 'missing', text: '미제출', answer: null }
  const answer = findAdminSubmittedAnswer(response, question)
  if(!answer) return { status: 'missing', text: '미제출', answer: null }
  if(answer.isCorrect === false){
    const noteCompleted = isCheckWrongNoteCompleted(answer)
    return {
      status: 'wrong',
      text: noteCompleted ? 'X(오답노트 완료)' : 'X(오답노트 미완료)',
      answer: answer,
      wrongNoteCompleted: noteCompleted
    }
  }
  if(answer.isCorrect === true) return { status: 'correct', text: 'O', answer: answer }
  return { status: 'submitted', text: '제출', answer: answer }
}

function isAdminStudentExpectedForQuestion(student, question){
  return hasAnyAdminClass(student && student.classIds, question && question.classIds)
}

function buildAdminCheckAnalytics(filteredRows, studentProfiles, classFilteredRows){
  const targetSets = getAdminAnalysisTargetSets(classFilteredRows)
  const questionItems = buildAdminAnalysisQuestions(targetSets, filteredRows)
  const students = buildAdminAnalysisStudents(studentProfiles, classFilteredRows, filteredRows, targetSets)
  const responseMap = buildAdminLatestResponseMap(filteredRows)
  const includeSetInLabel = portalState.adminCheckSetFilter === 'all'
  const selectedSet = portalState.adminCheckSetFilter === 'all' ? null : findAdminCheckSetByKey(portalState.adminCheckSetFilter)

  const questionRanks = questionItems.map(function(question){
    const expectedStudents = students.filter(function(student){
      return isAdminStudentExpectedForQuestion(student, question)
    })
    const wrongStudents = []
    const wrongNoteCompletedStudents = []
    const wrongNotePendingStudents = []
    const missingStudents = []
    let correctCount = 0
    let submittedCount = 0

    expectedStudents.forEach(function(student){
      const response = responseMap.get(student.id + '::' + question.setId) || null
      const result = getAdminAnswerStatus(response, question)
      if(result.status === 'missing'){
        missingStudents.push(student.label)
        return
      }
      submittedCount += 1
      if(result.status === 'wrong'){
        wrongStudents.push(student.label)
        if(result.wrongNoteCompleted){
          wrongNoteCompletedStudents.push(student.label)
        }else{
          wrongNotePendingStudents.push(student.label)
        }
      }else{
        correctCount += 1
      }
    })

    return {
      key: question.key,
      setId: question.setId,
      setTitle: question.setTitle,
      number: question.number,
      label: getAdminQuestionDisplayLabel(question, includeSetInLabel),
      problemType: question.problemType || '기타',
      prompt: question.prompt || '',
      wrongCount: wrongStudents.length,
      correctCount: correctCount,
      submittedCount: submittedCount,
      missingCount: missingStudents.length,
      totalStudents: expectedStudents.length,
      wrongRate: submittedCount ? Math.round((wrongStudents.length / submittedCount) * 100) : 0,
      wrongNoteCompletedCount: wrongNoteCompletedStudents.length,
      wrongNotePendingCount: wrongNotePendingStudents.length,
      wrongNoteCompletionRate: wrongStudents.length ? Math.round((wrongNoteCompletedStudents.length / wrongStudents.length) * 100) : 0,
      wrongStudents: wrongStudents,
      wrongNoteCompletedStudents: wrongNoteCompletedStudents,
      wrongNotePendingStudents: wrongNotePendingStudents,
      missingStudents: missingStudents
    }
  }).sort(function(a, b){
    if(b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount
    if(b.wrongRate !== a.wrongRate) return b.wrongRate - a.wrongRate
    if(b.missingCount !== a.missingCount) return b.missingCount - a.missingCount
    return Number(a.number || 0) - Number(b.number || 0)
  })

  const studentRows = students.map(function(student){
    const wrongLabels = []
    const wrongNoteCompletedLabels = []
    const wrongNotePendingLabels = []
    const missingLabels = []
    let correctCount = 0
    let submittedCount = 0
    let targetCount = 0
    const cells = questionItems.map(function(question){
      if(!isAdminStudentExpectedForQuestion(student, question)){
        return {
          questionKey: question.key,
          label: getAdminQuestionDisplayLabel(question, includeSetInLabel),
          status: 'not-assigned',
          text: '-',
          userAnswer: ''
        }
      }
      targetCount += 1
      const response = responseMap.get(student.id + '::' + question.setId) || null
      const result = getAdminAnswerStatus(response, question)
      const label = getAdminQuestionDisplayLabel(question, includeSetInLabel)
      if(result.status === 'wrong'){
        wrongLabels.push(label)
        if(result.wrongNoteCompleted){
          wrongNoteCompletedLabels.push(label)
        }else{
          wrongNotePendingLabels.push(label)
        }
      }
      if(result.status === 'missing') missingLabels.push(label)
      if(result.status !== 'missing') submittedCount += 1
      if(result.status === 'correct') correctCount += 1
      return {
        questionKey: question.key,
        label: label,
        status: result.status,
        text: result.text,
        userAnswer: result.answer ? String(result.answer.userAnswer || '').trim() : ''
      }
    })
    return {
      id: student.id,
      label: student.label,
      studentId: student.studentId,
      correctCount: correctCount,
      submittedCount: submittedCount,
      targetCount: targetCount,
      wrongCount: wrongLabels.length,
      wrongNoteCompletedCount: wrongNoteCompletedLabels.length,
      wrongNotePendingCount: wrongNotePendingLabels.length,
      missingCount: missingLabels.length,
      wrongLabels: wrongLabels,
      wrongNoteCompletedLabels: wrongNoteCompletedLabels,
      wrongNotePendingLabels: wrongNotePendingLabels,
      missingLabels: missingLabels,
      cells: cells
    }
  }).sort(function(a, b){
    if(b.wrongCount !== a.wrongCount) return b.wrongCount - a.wrongCount
    if(b.missingCount !== a.missingCount) return b.missingCount - a.missingCount
    return String(a.label || '').localeCompare(String(b.label || ''), 'ko')
  })

  const typeRanks = buildRankItems(
    questionRanks.flatMap(function(item){
      return Array.from({ length: item.wrongCount }).map(function(){
        return { problemType: item.problemType || '기타' }
      })
    }),
    function(entry){ return entry.problemType || '기타' }
  )

  return {
    generatedAt: new Date().toISOString(),
    selectedSetTitle: selectedSet ? String(selectedSet.title || '').trim() : '전체 세트',
    targetSets: targetSets,
    questions: questionItems,
    students: students,
    questionRanks: questionRanks,
    studentRows: studentRows,
    typeRanks: typeRanks,
    includeSetInLabel: includeSetInLabel,
    hasUserRoster: Array.isArray(studentProfiles) && studentProfiles.length > 0
  }
}

function formatAdminNameList(list, maxCount){
  const values = (Array.isArray(list) ? list : []).filter(Boolean)
  const limit = Number(maxCount || 5)
  if(!values.length) return ''
  const head = values.slice(0, limit).join(', ')
  return values.length > limit ? head + ' 외 ' + (values.length - limit) + '명' : head
}

function renderAdminQuestionRankList(analytics){
  const countNode = document.getElementById('admin-question-rank-count')
  const listNode = document.getElementById('admin-question-rank-list')
  if(!countNode || !listNode) return
  const rows = analytics && Array.isArray(analytics.questionRanks) ? analytics.questionRanks : []
  const visibleRows = rows.filter(function(item){
    return item.wrongCount > 0 || item.missingCount > 0
  }).slice(0, 30)

  countNode.textContent = String(rows.length)
  listNode.innerHTML = visibleRows.length
    ? visibleRows.map(function(item, index){
        return '' +
          '<div class="admin-item">' +
            '<strong class="admin-item-title">' + (index + 1) + '위 · ' + escapeHtml(item.label) + '</strong>' +
            '<span class="admin-item-meta">' + escapeHtml(item.problemType || '기타') + ' · 오답 ' + item.wrongCount + '명 · 제출 ' + item.submittedCount + '명 · 미제출 ' + item.missingCount + '명 · 오답률 ' + item.wrongRate + '%</span>' +
            (item.wrongCount ? '<span class="admin-item-ok">오답노트 완료 ' + item.wrongNoteCompletedCount + '명 · 미완료 ' + item.wrongNotePendingCount + '명 · 완료율 ' + item.wrongNoteCompletionRate + '%</span>' : '') +
            (item.wrongStudents.length ? '<span class="admin-item-warning">틀린 학생: ' + escapeHtml(formatAdminNameList(item.wrongStudents, 8)) + '</span>' : '') +
            (item.wrongNotePendingStudents.length ? '<span class="admin-item-warning">오답노트 미완료: ' + escapeHtml(formatAdminNameList(item.wrongNotePendingStudents, 8)) + '</span>' : '') +
            (item.missingStudents.length ? '<span class="admin-item-muted">미제출: ' + escapeHtml(formatAdminNameList(item.missingStudents, 8)) + '</span>' : '') +
          '</div>'
      }).join('')
    : '<div class="empty-box">선택한 범위에서 오답 또는 미제출 문항이 없습니다.</div>'
}

function renderAdminStudentMatrixList(analytics){
  const countNode = document.getElementById('admin-student-matrix-count')
  const listNode = document.getElementById('admin-student-matrix-list')
  if(!countNode || !listNode) return
  const rows = analytics && Array.isArray(analytics.studentRows) ? analytics.studentRows : []
  const filteredRows = portalState.adminStudentFilter
    ? rows.filter(function(row){ return row.id === portalState.adminStudentFilter })
    : rows
  const visibleRows = filteredRows.slice(0, 40)

  countNode.textContent = String(filteredRows.length)
  listNode.innerHTML = visibleRows.length
    ? visibleRows.map(function(row){
        const wrongText = row.wrongLabels.length ? row.wrongLabels.join(', ') : '없음'
        const noteCompletedText = row.wrongNoteCompletedLabels.length ? row.wrongNoteCompletedLabels.join(', ') : '없음'
        const notePendingText = row.wrongNotePendingLabels.length ? row.wrongNotePendingLabels.join(', ') : '없음'
        const missingText = row.missingLabels.length ? row.missingLabels.join(', ') : '없음'
        return '' +
          '<div class="admin-item">' +
            '<strong class="admin-item-title">' + escapeHtml(row.label) + '</strong>' +
            '<span class="admin-item-ok">정답 ' + row.correctCount + '개 · 제출 ' + row.submittedCount + ' / 대상 ' + row.targetCount + '</span>' +
            '<span class="admin-item-warning">오답: ' + escapeHtml(wrongText) + '</span>' +
            '<span class="admin-item-ok">오답노트 완료: ' + escapeHtml(noteCompletedText) + '</span>' +
            '<span class="admin-item-warning">오답노트 미완료: ' + escapeHtml(notePendingText) + '</span>' +
            '<span class="admin-item-muted">미제출: ' + escapeHtml(missingText) + '</span>' +
          '</div>'
      }).join('')
    : '<div class="empty-box">선택한 범위에 표시할 학생이 없습니다.</div>'
}

function buildAdminExcelCell(value){
  return '<td>' + escapeHtml(value == null ? '' : String(value)) + '</td>'
}

function buildAdminExcelHeader(values){
  return '<tr>' + values.map(function(value){
    return '<th>' + escapeHtml(value) + '</th>'
  }).join('') + '</tr>'
}

function buildAdminAnalyticsExcelHtml(analytics){
  const questionRows = (analytics.questionRanks || []).map(function(item, index){
    return '<tr>' + [
      index + 1,
      item.setTitle,
      item.number,
      item.problemType,
      item.wrongCount,
      item.wrongNoteCompletedCount,
      item.wrongNotePendingCount,
      item.wrongNoteCompletionRate + '%',
      item.submittedCount,
      item.missingCount,
      item.wrongRate + '%',
      item.wrongStudents.join(', '),
      item.wrongNoteCompletedStudents.join(', '),
      item.wrongNotePendingStudents.join(', '),
      item.missingStudents.join(', '),
      item.prompt
    ].map(buildAdminExcelCell).join('') + '</tr>'
  }).join('')

  const typeRows = (analytics.typeRanks || []).map(function(item, index){
    return '<tr>' + [
      index + 1,
      item.label,
      item.count
    ].map(buildAdminExcelCell).join('') + '</tr>'
  }).join('')

  const questionHeaders = (analytics.questions || []).map(function(question){
    return getAdminQuestionDisplayLabel(question, analytics.includeSetInLabel)
  })
  const studentRows = (analytics.studentRows || []).map(function(row){
    return '<tr>' + [
      row.label,
      row.studentId,
      row.targetCount,
      row.wrongCount,
      row.wrongNoteCompletedCount,
      row.wrongNotePendingCount,
      row.missingCount,
      row.submittedCount,
      row.wrongLabels.join(', '),
      row.wrongNoteCompletedLabels.join(', '),
      row.wrongNotePendingLabels.join(', '),
      row.missingLabels.join(', ')
    ].map(buildAdminExcelCell).join('') +
      row.cells.map(function(cell){
        return buildAdminExcelCell(cell.text)
      }).join('') +
    '</tr>'
  }).join('')

  return '' +
    '<!doctype html><html><head><meta charset="utf-8">' +
    '<style>body{font-family:Malgun Gothic,Arial,sans-serif} table{border-collapse:collapse;margin-bottom:24px} th,td{border:1px solid #999;padding:6px 8px;mso-number-format:"\\@";vertical-align:top} th{background:#e9f3f1;font-weight:700}.title{font-size:18px;font-weight:800;margin:0 0 8px}.meta{color:#555;margin:0 0 18px}</style>' +
    '</head><body>' +
      '<div class="title">CHECK 오답 통계</div>' +
      '<div class="meta">세트: ' + escapeHtml(analytics.selectedSetTitle || '전체 세트') + ' / 생성: ' + escapeHtml(formatAdminTime(analytics.generatedAt)) + '</div>' +
      '<h2>문항별 오답 랭킹</h2>' +
      '<table>' +
        buildAdminExcelHeader(['순위', '세트', '문제번호', '유형', '오답 수', '오답노트 완료 수', '오답노트 미완료 수', '오답노트 완료율', '제출 수', '미제출 수', '오답률', '틀린 학생', '오답노트 완료 학생', '오답노트 미완료 학생', '미제출 학생', '문항']) +
        (questionRows || '<tr><td colspan="16">데이터 없음</td></tr>') +
      '</table>' +
      '<h2>유형별 오답</h2>' +
      '<table>' +
        buildAdminExcelHeader(['순위', '유형', '오답 수']) +
        (typeRows || '<tr><td colspan="3">데이터 없음</td></tr>') +
      '</table>' +
      '<h2>학생별 문항 현황</h2>' +
      '<table>' +
        buildAdminExcelHeader(['학생', 'ID', '대상 문항 수', '총 오답', '오답노트 완료 수', '오답노트 미완료 수', '미제출 수', '제출 수', '오답 번호', '오답노트 완료 번호', '오답노트 미완료 번호', '미제출 번호'].concat(questionHeaders)) +
        (studentRows || '<tr><td colspan="' + (12 + questionHeaders.length) + '">데이터 없음</td></tr>') +
      '</table>' +
    '</body></html>'
}

function sanitizeAdminDownloadName(value){
  return String(value || 'CHECK_오답통계')
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 80)
}

function downloadAdminTextFile(fileName, content, mimeType){
  const blob = new Blob(['\ufeff', content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(function(){
    URL.revokeObjectURL(url)
  }, 1000)
}

window.downloadAdminCheckAnalytics = function(){
  const analytics = portalState.adminCheckAnalytics
  if(!analytics || !Array.isArray(analytics.questions) || !analytics.questions.length){
    showToast('다운로드할 CHECK 통계가 없습니다.', 'var(--blue)')
    return
  }
  const stamp = new Date().toISOString().slice(0, 10)
  const baseName = sanitizeAdminDownloadName('CHECK_오답통계_' + (analytics.selectedSetTitle || '전체세트') + '_' + stamp)
  const html = buildAdminAnalyticsExcelHtml(analytics)
  downloadAdminTextFile(baseName + '.xls', html, 'application/vnd.ms-excel;charset=utf-8')
  showToast('엑셀 파일을 다운로드했습니다.', 'var(--green)')
}

function filterAdminIssuesByState(rows){
  return rows.filter(function(entry){
    if(isAdminQuestionIssueHidden(entry)) return false
    if(normalizeQuestionIssueStatus(entry) !== 'open') return false
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
    if(portalState.adminCheckSetFilter !== 'all' && getAdminResponseSetKey(entry) !== portalState.adminCheckSetFilter){
      return false
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
      '<div class="admin-item-actions">' +
        '<button class="btn btn-ghost btn-sm" type="button" onclick="resolveAdminQuestionIssue(\'' + escapeJs(entry.id) + '\', \'' + escapeJs(entry.createdAt || '') + '\')">처리 완료</button>' +
      '</div>' +
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

function getCheckAnswerEditCount(submittedAnswer){
  const count = Number(submittedAnswer && (submittedAnswer.revisionCount || submittedAnswer.editCount) || 0)
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0
}

function canCheckAnswerBeEdited(submittedAnswer){
  return !!submittedAnswer && getCheckAnswerEditCount(submittedAnswer) < 1
}

function isCheckAnswerEditing(questionId){
  const key = String(questionId || '').trim()
  return !!(key && portalState.currentCheckEditTargets && portalState.currentCheckEditTargets[key])
}

function setCheckAnswerEditing(questionId, isEditing){
  const key = String(questionId || '').trim()
  if(!key) return
  if(!portalState.currentCheckEditTargets) portalState.currentCheckEditTargets = {}
  if(isEditing){
    portalState.currentCheckEditTargets[key] = true
  }else{
    delete portalState.currentCheckEditTargets[key]
  }
}

function getActiveCheckEditQuestionIds(){
  return Object.keys(portalState.currentCheckEditTargets || {}).filter(function(questionId){
    return !!portalState.currentCheckEditTargets[questionId]
  })
}

function countOpenCheckEdits(){
  return getActiveCheckEditQuestionIds().length
}

function countReadyCheckEdits(submission){
  const answerMap = getSubmittedCheckAnswerMap(submission)
  return getActiveCheckEditQuestionIds().reduce(function(count, questionId){
    const submittedAnswer = answerMap.get(questionId) || null
    if(!submittedAnswer || !canCheckAnswerBeEdited(submittedAnswer)) return count
    const nextAnswer = getCurrentCheckDraftAnswer(questionId) || String(submittedAnswer.userAnswer || '').trim()
    return nextAnswer && nextAnswer !== String(submittedAnswer.userAnswer || '').trim() ? count + 1 : count
  }, 0)
}

function countWrongCheckQuestions(submission){
  return (submission && Array.isArray(submission.answers) ? submission.answers : []).filter(function(answer){
    return answer && answer.isCorrect === false
  }).length
}

function isCheckWrongNoteCompleted(submittedAnswer){
  return !!(submittedAnswer && submittedAnswer.wrongNoteCompleted)
}

function renderCheckResultTools(question, submittedAnswer, isEditingAnswer){
  const existing = portalState.currentQuestionIssues.find(function(entry){
    return String(entry.questionId || '') === String(question.id || '')
  }) || null
  const submittedText = submittedAnswer && submittedAnswer.userAnswer ? String(submittedAnswer.userAnswer) : ''
  const buttonClass = existing ? 'check-question-issue-btn done' : 'check-question-issue-btn'
  const buttonText = existing ? '질문 접수됨' : '질문 남기기'
  const editTool = isEditingAnswer
    ? '<button class="check-question-edit-btn active" type="button" onclick="cancelCheckAnswerEdit(\'' + escapeJs(question.id) + '\')">수정 취소</button>'
    : (canCheckAnswerBeEdited(submittedAnswer)
        ? '<button class="check-question-edit-btn" type="button" onclick="startCheckAnswerEdit(\'' + escapeJs(question.id) + '\')">답 수정하기 (1회)</button>'
        : '<span class="check-edit-limit-badge">답 수정 1회 사용 완료</span>')
  const wrongNoteDone = isCheckWrongNoteCompleted(submittedAnswer)
  const wrongNoteTool = submittedAnswer && submittedAnswer.isCorrect === false && !isEditingAnswer
    ? '<button class="check-wrong-note-btn' + (wrongNoteDone ? ' done' : '') + '" type="button" onclick="completeCheckWrongNote(\'' + escapeJs(question.id) + '\')" ' + (wrongNoteDone ? 'disabled' : '') + '>' +
        (wrongNoteDone ? '오답노트 완료됨' : '오답노트 완료') +
      '</button>'
    : ''

  return '' +
    '<div class="check-result-tools">' +
      editTool +
      wrongNoteTool +
      '<button class="' + buttonClass + '" type="button" onclick="submitCheckQuestionIssue(\'' + escapeJs(question.id) + '\')" ' + (existing ? 'disabled' : '') + '>' +
        escapeHtml(buttonText) +
      '</button>' +
    '</div>' +
    (submittedText ? '<div class="check-question-prompt" style="margin-top:8px">' + (isEditingAnswer ? '현재 저장된 답: ' : '내 답: ') + escapeHtml(submittedText) + '</div>' : '')
}

window.startCheckAnswerEdit = function(questionId){
  const checkSet = portalState.currentCheckSet
  const submission = portalState.currentCheckSubmission
  if(!checkSet || !submission) return

  const submittedAnswer = submission.answers.find(function(entry){
    return String(entry.questionId || '') === String(questionId || '')
  }) || null
  if(!submittedAnswer) return
  if(!canCheckAnswerBeEdited(submittedAnswer)){
    showToast('이 문항은 답 수정 1회를 이미 사용했습니다.', 'var(--blue)')
    return
  }

  setCurrentCheckDraftAnswer(questionId, String(submittedAnswer.userAnswer || '').trim())
  setCheckAnswerEditing(questionId, true)
  portalState.currentCheckFilter = 'all'
  renderCheckForm(checkSet, submission)
  showToast('답 수정 모드가 열렸습니다. 답을 다시 선택한 뒤 제출해 주세요.', 'var(--blue)')
}

window.cancelCheckAnswerEdit = function(questionId){
  const checkSet = portalState.currentCheckSet
  const submission = portalState.currentCheckSubmission
  if(!checkSet || !submission) return

  const submittedAnswer = submission.answers.find(function(entry){
    return String(entry.questionId || '') === String(questionId || '')
  }) || null
  if(!submittedAnswer) return

  setCurrentCheckDraftAnswer(questionId, String(submittedAnswer.userAnswer || '').trim())
  setCheckAnswerEditing(questionId, false)
  renderCheckForm(checkSet, submission)
}

window.completeCheckWrongNote = function(questionId){
  completeCheckWrongNoteImpl(questionId)
}

async function completeCheckWrongNoteImpl(questionId){
  const checkSet = portalState.currentCheckSet
  const submission = portalState.currentCheckSubmission
  const targetId = String(questionId || '').trim()
  if(!checkSet || !submission || !targetId) return

  const answers = Array.isArray(submission.answers) ? submission.answers : []
  const submittedAnswer = answers.find(function(entry){
    return String(entry && entry.questionId || '') === targetId
  }) || null
  if(!submittedAnswer || submittedAnswer.isCorrect !== false) return
  if(isCheckWrongNoteCompleted(submittedAnswer)){
    showToast('이미 오답노트 완료로 표시된 문항입니다.', 'var(--blue)')
    return
  }

  const completedAt = new Date().toISOString()
  const nextAnswers = sortCheckSubmissionAnswers(answers.map(function(answer){
    if(String(answer && answer.questionId || '') !== targetId) return answer
    return Object.assign({}, answer, {
      wrongNoteCompleted: true,
      wrongNoteCompletedAt: completedAt
    })
  }))
  const latestBatchIds = getLatestBatchQuestionIds(submission)
  const latestBatch = submission.latestBatch
    ? Object.assign({}, submission.latestBatch, {
        summary: buildCheckSubmissionSummary(nextAnswers.filter(function(answer){
          return latestBatchIds.includes(String(answer && answer.questionId || '').trim())
        }))
      })
    : null
  const nextSubmission = Object.assign({}, submission, {
    summary: buildCheckSubmissionSummary(nextAnswers),
    answers: nextAnswers,
    latestBatch: latestBatch
  })

  try{
    await saveCheckSubmission(checkSet, nextSubmission)
    portalState.currentCheckSubmission = nextSubmission
    renderCheckForm(checkSet, nextSubmission)
    showToast('오답노트 완료로 표시했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('오답노트 완료 저장에 실패했습니다.', 'var(--red)')
  }
}

function renderCheckForm(checkSet, submission){
  const form = document.getElementById('check-form')
  if(!form || !checkSet) return

  const answerMap = getSubmittedCheckAnswerMap(submission)
  const submittedCount = getSubmittedCheckCount(submission)
  const pendingCount = countPendingCheckQuestions(checkSet, submission)
  const wrongCount = countWrongCheckQuestions(submission)
  const latestBatchIds = getLatestBatchQuestionIds(submission)
  const openEditCount = countOpenCheckEdits()
  const filterMode = resolveCheckFilterMode(checkSet, submission, portalState.currentCheckFilter)
  portalState.currentCheckFilter = filterMode
  const visibleQuestions = getVisibleCheckQuestions(checkSet, submission, filterMode)
  const isLatestView = filterMode === 'latest'

  const progressHtml =
    '<section class="group check-progress-card">' +
      '<div class="check-progress-top">' +
        '<div class="check-progress-copy">' +
          '<div class="check-progress-title">제출 현황</div>' +
          '<div class="check-progress-meta">제출한 문항은 정답과 해설을 바로 확인할 수 있고, 문항별 답 수정은 1회만 가능합니다.</div>' +
        '</div>' +
        '<div class="check-progress-stats">' +
          '<span class="check-progress-chip">전체 ' + checkSet.questions.length + '</span>' +
          '<span class="check-progress-chip">제출 ' + submittedCount + '</span>' +
          '<span class="check-progress-chip">남음 ' + pendingCount + '</span>' +
          '<span class="check-progress-chip">오답 ' + wrongCount + '</span>' +
          (openEditCount ? '<span class="check-progress-chip">수정 중 ' + openEditCount + '</span>' : '') +
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
          : ''
      ) +
      '<div class="check-filter-bar">' +
        renderCheckFilterButton('all', '전체', checkSet.questions.length, filterMode === 'all') +
        renderCheckFilterButton('pending', '미제출/수정', pendingCount + openEditCount, filterMode === 'pending', !(pendingCount + openEditCount)) +
        renderCheckFilterButton('wrong', '틀린 문제', wrongCount, filterMode === 'wrong', !wrongCount) +
        (latestBatchIds.length ? renderCheckFilterButton('latest', '이번 제출', latestBatchIds.length, filterMode === 'latest') : '') +
      '</div>' +
    '</section>'

  const cardHtml = visibleQuestions.length ? visibleQuestions.map(function(question, index){
    const questionId = String(question && question.id || '').trim()
    const submittedAnswer = answerMap.get(questionId) || null
    const isEditingAnswer = !!submittedAnswer && isCheckAnswerEditing(questionId)
    const selectedAnswer = isEditingAnswer
      ? (getCurrentCheckDraftAnswer(questionId) || String(submittedAnswer.userAnswer || ''))
      : (submittedAnswer ? String(submittedAnswer.userAnswer || '') : getCurrentCheckDraftAnswer(questionId))
    const displayNumber = normalizeCheckQuestionNumber(question && question.number, index + 1)
    const resultClass = submittedAnswer ? ('check-result show ' + (submittedAnswer.isCorrect ? 'correct' : 'wrong')) : 'check-result'
    const resultTitle = isEditingAnswer
      ? '답 수정 중'
      : (submittedAnswer && submittedAnswer.isCorrect ? '정답' : '정답과 해설')
    const editNote = isEditingAnswer
      ? '<div class="check-edit-note">수정 모드입니다. 답을 다시 고른 뒤 아래 제출 버튼을 누르면 이 문항의 저장된 답이 1회에 한해 바뀝니다.</div>'
      : ''

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
          renderCheckAnswerField(question, selectedAnswer, !!submittedAnswer && !isEditingAnswer) +
        '</div>' +
        (submittedAnswer ? (
          '<div class="' + resultClass + '">' +
            '<div class="check-result-title">' + resultTitle + '</div>' +
            '<div class="check-result-body">' + renderCheckResultBody(question, submittedAnswer) + '</div>' +
            editNote +
            renderCheckResultTools(question, submittedAnswer, isEditingAnswer) +
          '</div>'
        ) : '') +
      '</section>'
  }).join('') : '<div class="empty-box">선택한 조건에 맞는 문항이 없습니다.</div>'

  form.innerHTML = progressHtml + cardHtml

  bindCheckFormInteractions(checkSet, submission)
  renderCheckSubmitArea(checkSet, submission)
}

function renderCheckSubmitArea(checkSet, submission){
  const submitArea = document.getElementById('check-submit-actions')
  if(!submitArea || !checkSet) return

  const filterMode = resolveCheckFilterMode(checkSet, submission, portalState.currentCheckFilter)
  const totalCount = checkSet.questions.length
  const submittedCount = getSubmittedCheckCount(submission)
  const pendingCount = countPendingCheckQuestions(checkSet, submission)
  const draftCount = countDraftCheckQuestions(checkSet, submission)
  const openEditCount = countOpenCheckEdits()
  const editReadyCount = countReadyCheckEdits(submission)
  const actionableCount = draftCount + editReadyCount
  const latestBatch = submission && submission.latestBatch ? submission.latestBatch : null

  let html = ''
  if(filterMode === 'latest' && latestBatch && Array.isArray(latestBatch.questionIds) && latestBatch.questionIds.length){
    const latestEditedCount = Number(latestBatch.editedCount || 0)
    const latestNewCount = Number(latestBatch.newCount || Math.max(0, Number(latestBatch.summary && latestBatch.summary.total || 0) - latestEditedCount))
    const latestSummaryText = latestEditedCount && latestNewCount
      ? ('이번에 ' + latestNewCount + '문항 제출, ' + latestEditedCount + '문항 답 수정 완료')
      : (latestEditedCount
          ? ('이번에 ' + latestEditedCount + '문항의 답 수정을 반영했습니다.')
          : ('이번에 ' + Number(latestBatch.summary && latestBatch.summary.total || latestBatch.questionIds.length || 0) + '문항을 제출했고, 그중 ' + Number(latestBatch.summary && latestBatch.summary.correct || 0) + '문항 정답입니다.'))

    html += '' +
      '<div class="status-note" style="margin-top:0">' +
        '<div class="status-top">' +
          '<span class="status-badge ok">최근 제출</span>' +
          '<span class="status-time">' + escapeHtml(formatAdminTime(latestBatch.submittedAt || submission.submittedAt || '')) + '</span>' +
        '</div>' +
        '<div class="status-text">' + latestSummaryText + '</div>' +
      '</div>'
  }

  let statusText = ''
  if(openEditCount){
    statusText = editReadyCount
      ? ('수정 중인 문항 ' + openEditCount + '개 중 ' + editReadyCount + '개가 제출 준비되었습니다. 답 수정은 문항별로 1회만 가능합니다.')
      : '수정 모드가 열려 있습니다. 기존과 다른 답을 선택해야 제출할 수 있습니다. 답 수정은 문항별로 1회만 가능합니다.'
  }else if(pendingCount){
    statusText = '아직 ' + pendingCount + '문항이 남아 있습니다. 먼저 답을 고른 문항만 제출할 수 있고, 제출한 문항도 문항별로 1회까지 답 수정이 가능합니다.'
  }else{
    statusText = '이 세트의 모든 문항을 제출했습니다. 필요하면 문항별로 답 수정 1회를 사용할 수 있습니다.'
  }

  html += '' +
    '<div class="status-note check-submit-status">' +
      '<div class="status-top">' +
        '<span class="status-badge ' + ((pendingCount || openEditCount) ? 'blue' : 'ok') + '">' + ((pendingCount || openEditCount) ? '이어가기 가능' : '전체 제출 완료') + '</span>' +
        '<span class="status-time">제출 ' + submittedCount + ' / 전체 ' + totalCount + (openEditCount ? (' · 수정 중 ' + openEditCount) : '') + '</span>' +
      '</div>' +
      '<div class="status-text">' + statusText + '</div>' +
    '</div>'

  if(filterMode === 'latest'){
    if(pendingCount){
      html += '<button class="btn btn-blue" type="button" id="check-continue-btn">미제출 문항 계속 풀기</button>'
    }else{
      html += '<button class="btn btn-blue" type="button" id="check-all-results-btn">전체 제출 현황 보기</button>'
    }
  }else if(pendingCount || openEditCount){
    const buttonText = editReadyCount && draftCount
      ? ('이번에 ' + actionableCount + '문항 제출')
      : (editReadyCount
          ? ('답 수정 ' + editReadyCount + '문항 제출')
          : (draftCount
              ? ('이번에 ' + draftCount + '문항 제출')
              : '이번 문항 제출'))
    html += '<button class="btn btn-blue" type="button" id="check-submit-btn"' + (actionableCount ? '' : ' disabled') + '>' + buttonText + '</button>'
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
  if(typeof requestAnimationFrame === 'function'){
    requestAnimationFrame(syncCheckJumpButtonVisibility)
  }else{
    syncCheckJumpButtonVisibility()
  }
}

function buildCheckSubmitToastMessage(batchAnswers){
  const list = Array.isArray(batchAnswers) ? batchAnswers : []
  const editedCount = list.filter(function(answer){
    return getCheckAnswerEditCount(answer) > 0
  }).length
  const newCount = Math.max(0, list.length - editedCount)
  if(newCount && editedCount){
    return newCount + '문항 제출, ' + editedCount + '문항 답 수정 완료'
  }
  if(editedCount){
    return editedCount + '문항의 수정 답안을 반영했습니다.'
  }
  return newCount + '문항을 제출하고 정답과 해설을 표시했습니다.'
}

async function submitCurrentCheckSet(){
  if(portalState.isSubmittingCheck) return
  const checkSet = portalState.currentCheckSet
  if(!checkSet) return

  portalState.isSubmittingCheck = true
  try{
    const batchAnswers = collectCheckBatchAnswers(checkSet, portalState.currentCheckSubmission)
    if(!batchAnswers.length){
      showToast(
        countOpenCheckEdits()
          ? '수정 중인 문항이 있습니다. 기존과 다른 답을 선택해야 제출할 수 있습니다.'
          : '아직 제출할 답안이 없습니다. 먼저 미제출 문항의 답을 선택해 주세요.',
        'var(--blue)'
      )
      return
    }

    const submission = mergeCheckSubmission(portalState.currentCheckSubmission, batchAnswers)

    await saveCheckSubmission(checkSet, submission)
    portalState.currentCheckSubmission = submission
    portalState.currentCheckDraftAnswers = buildInitialCheckDraftAnswers(checkSet, submission)
    portalState.currentCheckEditTargets = {}
    portalState.currentCheckFilter = 'latest'
    portalState.currentQuestionIssues = await fetchMyQuestionIssues(checkSet)
    renderCheckForm(checkSet, submission)
    showToast(buildCheckSubmitToastMessage(batchAnswers), 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('답안 제출에 실패했습니다.', 'var(--red)')
  }finally{
    portalState.isSubmittingCheck = false
  }
}

function resolveCheckFilterMode(checkSet, submission, preferredMode){
  const mode = String(preferredMode || 'all').trim() || 'all'
  if(mode === 'pending' && !countPendingCheckQuestions(checkSet, submission) && !countOpenCheckEdits()) return 'all'
  if(mode === 'wrong' && !countWrongCheckQuestions(submission)) return 'all'
  if(mode === 'latest' && !getLatestBatchQuestionIds(submission).length) return 'all'
  return ['all', 'pending', 'wrong', 'latest'].includes(mode) ? mode : 'all'
}

function getVisibleCheckQuestions(checkSet, submission, filterMode){
  const questions = Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []
  const answerMap = getSubmittedCheckAnswerMap(submission)
  const submittedIds = new Set((submission && Array.isArray(submission.answers) ? submission.answers : []).map(function(answer){
    return String(answer && answer.questionId || '').trim()
  }).filter(Boolean))
  const latestIds = new Set(getLatestBatchQuestionIds(submission))
  if(filterMode === 'pending'){
    return questions.filter(function(question){
      const questionId = String(question && question.id || '').trim()
      return !submittedIds.has(questionId) || isCheckAnswerEditing(questionId)
    })
  }
  if(filterMode === 'wrong'){
    return questions.filter(function(question){
      const submittedAnswer = answerMap.get(String(question && question.id || '').trim()) || null
      return submittedAnswer && submittedAnswer.isCorrect === false
    })
  }
  if(filterMode === 'latest'){
    return questions.filter(function(question){
      return latestIds.has(String(question && question.id || '').trim())
    })
  }
  return questions
}

function collectCheckBatchAnswers(checkSet, submission){
  const answerMap = getSubmittedCheckAnswerMap(submission)
  const revisedAt = new Date().toISOString()
  return (Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []).map(function(question, index){
    const questionId = String(question && question.id || '').trim()
    if(!questionId) return null

    const submittedAnswer = answerMap.get(questionId) || null
    const isEditingAnswer = !!submittedAnswer && isCheckAnswerEditing(questionId)
    if(submittedAnswer && !isEditingAnswer) return null

    const currentAnswer = submittedAnswer
      ? (
          normalizeCheckQuestionType(question && question.type) === '객관식'
            ? normalizeChoiceAnswer(submittedAnswer.userAnswer)
            : String(submittedAnswer.userAnswer || '').trim()
        )
      : ''
    const userAnswer = getCurrentCheckDraftAnswer(questionId) || currentAnswer
    if(!userAnswer) return null

    if(submittedAnswer){
      if(!canCheckAnswerBeEdited(submittedAnswer) || userAnswer === currentAnswer) return null
      return {
        questionId: questionId,
        number: normalizeCheckQuestionNumber(question.number, index + 1),
        type: question.type,
        problemType: normalizeCheckProblemType(question.problemType || question.category),
        prompt: question.prompt,
        userAnswer: userAnswer,
        answer: question.answer,
        explanation: question.explanation,
        isCorrect: isAnswerAccepted(userAnswer, question),
        originalUserAnswer: String(submittedAnswer.originalUserAnswer || submittedAnswer.userAnswer || '').trim(),
        previousUserAnswer: currentAnswer,
        revisionCount: getCheckAnswerEditCount(submittedAnswer) + 1,
        revisedAt: revisedAt
      }
    }

    return {
      questionId: questionId,
      number: normalizeCheckQuestionNumber(question.number, index + 1),
      type: question.type,
      problemType: normalizeCheckProblemType(question.problemType || question.category),
      prompt: question.prompt,
      userAnswer: userAnswer,
      answer: question.answer,
      explanation: question.explanation,
      isCorrect: isAnswerAccepted(userAnswer, question),
      revisionCount: 0
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
  const editedCount = batchAnswers.filter(function(answer){
    return getCheckAnswerEditCount(answer) > 0
  }).length
  return {
    submittedAt: submittedAt,
    summary: buildCheckSubmissionSummary(mergedAnswers),
    answers: mergedAnswers,
    latestBatch: {
      submittedAt: submittedAt,
      questionIds: batchAnswers.map(function(answer){ return String(answer && answer.questionId || '').trim() }).filter(Boolean),
      summary: buildCheckSubmissionSummary(batchAnswers),
      editedCount: editedCount,
      newCount: Math.max(0, batchAnswers.length - editedCount)
    }
  }
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
      summary: latestBatchSummary,
      editedCount: Number(row && row.latestBatch && row.latestBatch.editedCount || 0),
      newCount: Number(row && row.latestBatch && row.latestBatch.newCount || Math.max(0, latestBatchIds.length - Number(row && row.latestBatch && row.latestBatch.editedCount || 0)))
    } : null
  }
}

function buildPortalSetStorageKey(kind){
  return PORTAL_ENHANCEMENT_KEYS.contentPrefix + 'set_docs_' + String(kind || '').trim()
}

function readLocalPortalSetDocs(kind){
  try{
    const raw = localStorage.getItem(buildPortalSetStorageKey(kind))
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  }catch(error){
    console.error(error)
    return []
  }
}

function writeLocalPortalSetDocs(kind, rows){
  localStorage.setItem(buildPortalSetStorageKey(kind), JSON.stringify(Array.isArray(rows) ? rows : []))
}

function clonePlainData(value){
  if(value == null) return null
  return JSON.parse(JSON.stringify(value))
}

function getPortalSetCollection(kind){
  return kind === 'check' ? PORTAL_CLOUD_SET_COLLECTIONS.check : PORTAL_CLOUD_SET_COLLECTIONS.prep
}

function derivePortalSetClassIds(kind, payload){
  if(kind === 'prep'){
    return Array.from(new Set(
      (Array.isArray(payload && payload.classAssignments) ? payload.classAssignments : []).map(function(assignment){
        return String(assignment && assignment.classId || '').trim()
      }).filter(Boolean)
    ))
  }
  return Array.from(new Set(
    (Array.isArray(payload && payload.classIds) ? payload.classIds : []).map(function(classId){
      return String(classId || '').trim()
    }).filter(Boolean)
  ))
}

function normalizePortalSetDoc(kind, source){
  const payload = source && source.payload && typeof source.payload === 'object'
    ? clonePlainData(source.payload)
    : null
  if(kind === 'check' && payload){
    if((!Array.isArray(payload.classIds) || !payload.classIds.length) && Array.isArray(source && source.classIds)){
      payload.classIds = source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    }
    ;[
      'assignmentMode',
      'targetUserIds',
      'targetStudentIds',
      'targetLoginIds',
      'targetEmails',
      'targetStudentNames',
      'targetStudentName',
      'targetStudentId',
      'source',
      'sourceBatchId',
      'sourceSetId',
      'sourceRound',
      'createdByLab'
    ].forEach(function(field){
      if(payload[field] != null || !source || source[field] == null) return
      payload[field] = clonePlainData(source[field])
    })
  }
  const classIds = Array.isArray(source && source.classIds)
    ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    : derivePortalSetClassIds(kind, payload)
  return {
    docId: String(source && (source.docId || source.id) || '').trim(),
    title: String(source && source.title || '').trim(),
    fileName: String(source && source.fileName || '').trim(),
    payload: payload,
    classIds: classIds,
    createdAt: String(source && (source.createdAt || source.updatedAt) || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim(),
    sortOrder: Number(source && source.sortOrder || 0),
    updatedBy: String(source && source.updatedBy || '').trim(),
    updatedByName: String(source && source.updatedByName || '').trim()
  }
}

function sortPortalSetDocs(rows){
  return rows.slice().sort(function(a, b){
    const leftOrder = Number(a && a.sortOrder || 0)
    const rightOrder = Number(b && b.sortOrder || 0)
    if(leftOrder !== rightOrder) return leftOrder - rightOrder
    const leftCreated = String(a && a.createdAt || '')
    const rightCreated = String(b && b.createdAt || '')
    if(leftCreated !== rightCreated) return leftCreated.localeCompare(rightCreated)
    return String(a && a.docId || '').localeCompare(String(b && b.docId || ''))
  })
}

async function loadCloudSetDocs(kind){
  if(portalState.firebaseEnabled && portalState.db){
    try{
      const snapshot = await portalState.db.collection(getPortalSetCollection(kind)).get()
      return sortPortalSetDocs(snapshot.docs.map(function(doc){
        return normalizePortalSetDoc(kind, Object.assign({ docId: doc.id }, doc.data() || {}))
      }).filter(function(entry){
        return entry.docId && entry.payload
      }))
    }catch(error){
      console.warn('portal set read failed:', error && error.message ? error.message : error)
      return []
    }
  }

  return sortPortalSetDocs(readLocalPortalSetDocs(kind).map(function(entry){
    return normalizePortalSetDoc(kind, entry)
  }).filter(function(entry){
    return entry.docId && entry.payload
  }))
}

async function saveCloudSetDoc(kind, docId, record){
  const localRows = readLocalPortalSetDocs(kind)
  const existing = localRows.find(function(entry){
    return String(entry && (entry.docId || entry.id) || '').trim() === docId
  }) || null
  const now = new Date().toISOString()
  const nextDoc = normalizePortalSetDoc(kind, Object.assign({}, record, {
    docId: docId,
    createdAt: String(record && record.createdAt || existing && existing.createdAt || now).trim(),
    updatedAt: now,
    sortOrder: Number(record && record.sortOrder || existing && existing.sortOrder || Date.now()),
    updatedBy: portalState.currentUser ? portalState.currentUser.uid : '',
    updatedByName: portalState.currentProfile && portalState.currentProfile.name ? portalState.currentProfile.name : ''
  }))

  if(portalState.firebaseEnabled && portalState.db){
    try{
      await portalState.db.collection(getPortalSetCollection(kind)).doc(docId).set(nextDoc, { merge: true })
      nextDoc.storage = 'cloud'
      return nextDoc
    }catch(error){
      console.warn('portal set write failed:', error && error.message ? error.message : error)
      throw new Error('Firebase set save failed. This set was not shared to other users.')
    }
  }

  const nextRows = localRows.filter(function(entry){
    return String(entry && (entry.docId || entry.id) || '').trim() !== docId
  })
  nextRows.push(nextDoc)
  writeLocalPortalSetDocs(kind, sortPortalSetDocs(nextRows))
  nextDoc.storage = 'local'
  return nextDoc
}

async function deleteCloudSetDoc(kind, docId){
  if(portalState.firebaseEnabled && portalState.db){
    try{
      await portalState.db.collection(getPortalSetCollection(kind)).doc(docId).delete()
    }catch(error){
      console.warn('portal set delete failed:', error && error.message ? error.message : error)
      throw new Error('Firebase set delete failed. Shared data was not changed.')
    }
  }

  const nextRows = readLocalPortalSetDocs(kind).filter(function(entry){
    return String(entry && (entry.docId || entry.id) || '').trim() !== docId
  })
  writeLocalPortalSetDocs(kind, nextRows)
}

async function getCloudSetDoc(kind, docId){
  const targetId = String(docId || '').trim()
  if(!targetId) return null
  const rows = await loadCloudSetDocs(kind)
  return rows.find(function(entry){
    return String(entry && entry.docId || '').trim() === targetId
  }) || null
}

function normalizePortalPrepClassList(source){
  return (Array.isArray(source) ? source : []).map(function(entry, index){
    const id = sanitizeId(String(entry && entry.id || ('class-' + (index + 1))))
    if(!id) return null
    return {
      id: id,
      name: String(entry && entry.name || id).trim() || id,
      password: String(entry && entry.password || '').trim()
    }
  }).filter(Boolean)
}

function mergePortalPrepClasses(){
  const seen = new Set()
  const merged = []
  Array.from(arguments).forEach(function(list){
    normalizePortalPrepClassList(list).forEach(function(entry){
      if(seen.has(entry.id)) return
      seen.add(entry.id)
      merged.push(entry)
    })
  })
  return merged
}

function normalizePortalPrepConfig(){
  const next = {
    pageTitle: APP_CONFIG.defaultTitle,
    globalPassword: '',
    generatedAt: ''
  }
  Array.from(arguments).forEach(function(source){
    if(!source || typeof source !== 'object') return
    if(typeof source.pageTitle === 'string' && source.pageTitle.trim()){
      next.pageTitle = source.pageTitle.trim()
    }
    if(typeof source.globalPassword === 'string'){
      next.globalPassword = source.globalPassword.trim()
    }
    if(typeof source.generatedAt === 'string' && source.generatedAt.trim()){
      next.generatedAt = source.generatedAt.trim()
    }
  })
  return next
}

function normalizeStoredPrepSet(payload, index, classes){
  try{
    const normalized = normalizeStudySet(payload, index, classes)
    if(!normalized || !normalized.passages.length || !normalized.classAssignments.length) return null
    return normalized
  }catch(error){
    console.error(error)
    return null
  }
}

function summarizePortalPrepSet(studySet){
  const classIds = Array.from(new Set(
    (Array.isArray(studySet && studySet.classAssignments) ? studySet.classAssignments : []).map(function(assignment){
      return String(assignment && assignment.classId || '').trim()
    }).filter(Boolean)
  ))
  const passages = Array.isArray(studySet && studySet.passages) ? studySet.passages : []
  return {
    title: String(studySet && studySet.title || 'PREP 세트').trim() || 'PREP 세트',
    classIds: classIds,
    passageCount: passages.length,
    questionCount: passages.reduce(function(sum, passage){
      return sum + Number(Array.isArray(passage && passage.items) ? passage.items.length : 0)
    }, 0),
    startDate: String(studySet && studySet.startDate || '').trim(),
    endDate: String(studySet && studySet.endDate || '').trim()
  }
}

function buildPortalPrepSetInventory(legacySets, setDocs, classes){
  const inventory = []
  ;(Array.isArray(legacySets) ? legacySets : []).forEach(function(studySet){
    inventory.push(Object.assign(summarizePortalPrepSet(studySet), {
      docId: '',
      isManaged: false,
      updatedAt: '',
      fileName: ''
    }))
  })
  ;(Array.isArray(setDocs) ? setDocs : []).forEach(function(doc, index){
    const studySet = normalizeStoredPrepSet(doc.payload, index, classes)
    if(!studySet) return
    inventory.push(Object.assign(summarizePortalPrepSet(studySet), {
      docId: doc.docId,
      isManaged: true,
      updatedAt: doc.updatedAt,
      fileName: doc.fileName
    }))
  })
  return inventory
}

function normalizePortalCheckClassList(source){
  return (Array.isArray(source) ? source : []).map(function(entry, index){
    const id = sanitizeId(String(entry && entry.id || ('class-' + (index + 1))))
    if(!id) return null
    return {
      id: id,
      name: String(entry && entry.name || id).trim() || id
    }
  }).filter(Boolean)
}

function mergePortalCheckClasses(){
  const seen = new Set()
  const merged = []
  Array.from(arguments).forEach(function(list){
    normalizePortalCheckClassList(list).forEach(function(entry){
      if(seen.has(entry.id)) return
      seen.add(entry.id)
      merged.push(entry)
    })
  })
  return merged
}

function normalizeStoredCheckSet(payload){
  try{
    const normalized = normalizeCheckData({ checkSets: [payload] })
    return normalized.checkSets[0] || null
  }catch(error){
    console.error(error)
    return null
  }
}

function summarizePortalCheckSet(checkSet){
  return {
    title: String(checkSet && checkSet.title || 'CHECK 세트').trim() || 'CHECK 세트',
    classIds: Array.isArray(checkSet && checkSet.classIds)
      ? checkSet.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
      : [],
    questionCount: Array.isArray(checkSet && checkSet.questions) ? checkSet.questions.length : 0,
    startDate: String(checkSet && checkSet.availableFrom || '').trim(),
    endDate: String(checkSet && checkSet.availableTo || '').trim(),
    assignmentLabel: typeof buildCheckSetAssignmentMetaText === 'function'
      ? buildCheckSetAssignmentMetaText(checkSet)
      : ''
  }
}

function buildPortalCheckSetInventory(legacySets, setDocs){
  const inventory = []
  ;(Array.isArray(legacySets) ? legacySets : []).forEach(function(checkSet){
    inventory.push(Object.assign(summarizePortalCheckSet(checkSet), {
      docId: '',
      isManaged: false,
      updatedAt: '',
      fileName: ''
    }))
  })
  ;(Array.isArray(setDocs) ? setDocs : []).forEach(function(doc){
    const checkSet = normalizeStoredCheckSet(doc.payload)
    if(!checkSet) return
    inventory.push(Object.assign(summarizePortalCheckSet(checkSet), {
      docId: doc.docId,
      isManaged: true,
      updatedAt: doc.updatedAt,
      fileName: doc.fileName
    }))
  })
  return inventory
}

function getLatestPortalTimestamp(values){
  return (Array.isArray(values) ? values : []).reduce(function(latest, value){
    const text = String(value || '').trim()
    if(!text) return latest
    if(!latest) return text
    const nextTime = new Date(text).getTime()
    const latestTime = new Date(latest).getTime()
    if(Number.isNaN(nextTime)) return latest
    if(Number.isNaN(latestTime) || nextTime > latestTime) return text
    return latest
  }, '')
}

async function loadPortalPrepBundleFromSources(){
  const catalogDoc = await loadCloudContentDoc(PORTAL_CLASS_CATALOG_DOC)
  const legacyDoc = await loadCloudContentDoc(PORTAL_CLOUD_DOCS.prep)
  const setDocs = await loadCloudSetDocs('prep')
  const catalogPayload = catalogDoc && catalogDoc.payload && typeof catalogDoc.payload === 'object'
    ? catalogDoc.payload
    : {}
  const legacyBundle = legacyDoc && legacyDoc.payload ? normalizeBundleData(legacyDoc.payload) : null
  const classes = mergePortalPrepClasses(
    catalogPayload.classes,
    legacyBundle ? legacyBundle.classes : [],
    prepClasses
  )
  const prepConfig = normalizePortalPrepConfig(
    bundleData && bundleData.prepConfig ? bundleData.prepConfig : null,
    legacyBundle ? legacyBundle.prepConfig : null,
    catalogPayload.prepConfig
  )
  const legacySets = legacyBundle ? legacyBundle.studySets.slice() : []
  const uploadedSets = setDocs.map(function(doc, index){
    return normalizeStoredPrepSet(doc.payload, index, classes)
  }).filter(Boolean)

  portalState.prepSetInventory = buildPortalPrepSetInventory(legacySets, setDocs, classes)

  if(!legacyBundle && !setDocs.length && !classes.length){
    portalState.prepSetInventory = []
    return null
  }

  return {
    version: 2,
    prepConfig: prepConfig,
    classes: classes,
    studySets: legacySets.concat(uploadedSets),
    updatedAt: getLatestPortalTimestamp([
      catalogDoc && catalogDoc.updatedAt,
      legacyDoc && legacyDoc.updatedAt
    ].concat(setDocs.map(function(doc){
      return doc.updatedAt
    })))
  }
}

async function loadPortalCheckDataFromSources(){
  const legacyDoc = await loadCloudContentDoc(PORTAL_CLOUD_DOCS.check)
  const setDocs = await loadCloudSetDocs('check')
  const legacyData = legacyDoc && legacyDoc.payload ? normalizeCheckData(legacyDoc.payload) : null
  const prepClassEntries = normalizePortalCheckClassList(prepClasses.map(function(classInfo){
    return { id: classInfo.id, name: classInfo.name }
  }))
  const classes = mergePortalCheckClasses(
    legacyData ? legacyData.classes : [],
    prepClassEntries,
    portalState.checkData && portalState.checkData.classes ? portalState.checkData.classes : []
  )
  const legacySets = legacyData ? legacyData.checkSets.slice() : []
  const uploadedSets = setDocs.map(function(doc){
    return normalizeStoredCheckSet(doc.payload)
  }).filter(Boolean)

  portalState.checkSetInventory = buildPortalCheckSetInventory(legacySets, setDocs)

  if(!legacyDoc && !setDocs.length){
    portalState.checkSetInventory = []
    return null
  }

  return normalizeCheckData({
    updatedAt: getLatestPortalTimestamp([legacyDoc && legacyDoc.updatedAt].concat(setDocs.map(function(doc){
      return doc.updatedAt
    }))),
    classes: classes,
    checkSets: legacySets.concat(uploadedSets)
  })
}

async function syncPrepContentAfterLogin(forceReload){
  if(!portalState.currentUser) return false
  if(portalState.prepSyncPromise && !forceReload) return portalState.prepSyncPromise

  portalState.prepSyncPromise = loadPortalPrepBundleFromSources().then(function(bundle){
    if(!bundle) return false
    portalState.contentMeta.prep = {
      updatedAt: bundle.updatedAt || '',
      fileName: '세트별 PREP 데이터'
    }
    if(typeof window.applyPrepSessionData === 'function'){
      window.applyPrepSessionData(bundle, { source: 'remote', skipRoute: true })
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

async function ensureCheckData(forceReload){
  if(portalState.checkData && !forceReload) return portalState.checkData

  if(portalState.currentUser){
    const combined = await loadPortalCheckDataFromSources()
    if(combined){
      portalState.contentMeta.check = {
        updatedAt: combined.updatedAt || '',
        fileName: '세트별 CHECK 데이터'
      }
      portalState.checkData = combined
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
    portalState.checkSetInventory = buildPortalCheckSetInventory(portalState.checkData.checkSets, [])
    return portalState.checkData
  }catch(error){
    console.error(error)
    portalState.checkData = { updatedAt: '', classes: [], checkSets: [] }
    portalState.checkSetInventory = []
    return portalState.checkData
  }
}

function getPortalUploadTargetClass(kind){
  if(kind === 'prep'){
    return typeof getCurrentClass === 'function' ? getCurrentClass() : null
  }
  const activeEntry = typeof getActivePortalCheckClass === 'function' ? getActivePortalCheckClass() : null
  return activeEntry && activeEntry.classInfo ? activeEntry.classInfo : null
}

function canManagePortalClass(classInfo){
  if(!isPortalAdmin()) return false
  const classId = String(classInfo && classInfo.id || '').trim()
  if(!classId) return false
  if(isPortalSuperAdmin()) return true
  return getProfileClassIds().indexOf(classId) >= 0
}

async function savePrepClassCatalog(classInfo){
  const classList = mergePortalPrepClasses(
    prepClasses,
    classInfo ? [classInfo] : []
  )
  if(!classList.length) return null
  const currentBundle = bundleData && typeof bundleData === 'object' ? normalizeBundleData(bundleData) : null
  const payload = {
    classes: classList,
    prepConfig: normalizePortalPrepConfig(
      currentBundle ? currentBundle.prepConfig : null,
      {
        pageTitle: pageTitle || APP_CONFIG.defaultTitle,
        globalPassword: globalPassword || '',
        generatedAt: new Date().toISOString()
      }
    )
  }
  return saveCloudContentDoc(PORTAL_CLASS_CATALOG_DOC, payload, 'prep-classes.json')
}

function createPortalManagedSetId(kind, index){
  const suffix = Math.random().toString(36).slice(2, 8)
  const stamp = Date.now()
  const order = typeof index === 'number' ? '-' + String(index + 1) : ''
  return sanitizeId(kind + '-set-' + stamp + '-' + suffix + order)
}

function buildPrepUploadRecords(raw, fileName, classInfo){
  const normalized = normalizeBundleData(raw)
  const sourceSets = Array.isArray(normalized && normalized.studySets) ? normalized.studySets : []
  return sourceSets.map(function(studySet, index){
    const docId = createPortalManagedSetId('prep', index)
    const passageIndexes = Array.from({ length: Array.isArray(studySet && studySet.passages) ? studySet.passages.length : 0 }, function(_, passageIndex){
      return passageIndex
    })
    return {
      docId: docId,
      title: String(studySet && studySet.title || ('PREP 세트 ' + (index + 1))).trim(),
      classIds: [classInfo.id],
      fileName: fileName,
      sortOrder: Date.now() + index,
      payload: {
        id: docId,
        title: String(studySet && studySet.title || ('PREP 세트 ' + (index + 1))).trim(),
        sourceName: String(studySet && studySet.sourceName || fileName || '').trim(),
        startDate: String(studySet && studySet.startDate || '').trim(),
        endDate: String(studySet && studySet.endDate || '').trim(),
        savedAt: new Date().toISOString(),
        questionCounts: clonePlainData(studySet && studySet.questionCounts || {}) || {},
        passages: clonePlainData(Array.isArray(studySet && studySet.passages) ? studySet.passages : []) || [],
        classAssignments: passageIndexes.length ? [{
          classId: classInfo.id,
          passageIndexes: passageIndexes
        }] : []
      }
    }
  }).filter(function(record){
    return Array.isArray(record && record.payload && record.payload.passages) && record.payload.passages.length > 0
  })
}

function buildCheckUploadRecords(raw, fileName, classInfo){
  let normalized = null
  if(Array.isArray(raw && raw.checkSets) || Array.isArray(raw && raw.classes)){
    normalized = normalizeCheckData(raw)
  }else if(Array.isArray(raw && raw.questions)){
    normalized = normalizeCheckData({ checkSets: [raw] })
  }else if(Array.isArray(raw)){
    normalized = normalizeCheckData({ checkSets: raw })
  }else{
    normalized = normalizeCheckData({ checkSets: [] })
  }

  return (Array.isArray(normalized && normalized.checkSets) ? normalized.checkSets : []).map(function(checkSet, index){
    const docId = createPortalManagedSetId('check', index)
    return {
      docId: docId,
      title: String(checkSet && checkSet.title || ('CHECK 세트 ' + (index + 1))).trim(),
      classIds: [classInfo.id],
      fileName: fileName,
      sortOrder: Date.now() + index,
      payload: Object.assign({}, clonePlainData(checkSet) || {}, {
        id: docId,
        title: String(checkSet && checkSet.title || ('CHECK 세트 ' + (index + 1))).trim(),
        classIds: [classInfo.id]
      })
    }
  }).filter(function(record){
    return Array.isArray(record && record.payload && record.payload.questions) && record.payload.questions.length > 0
  })
}

function restorePortalPrepClassSelection(classId){
  const targetIndex = prepClasses.findIndex(function(entry){
    return String(entry && entry.id || '').trim() === String(classId || '').trim()
  })
  if(targetIndex < 0) return false
  selectClass(targetIndex, { stayOnCurrent: true })
  return true
}

async function handlePortalSetUpload(kind, event){
  const file = event && event.target && event.target.files ? event.target.files[0] : null
  if(event && event.target) event.target.value = ''
  if(!file) return
  if(!isPortalAdmin()){
    showToast('관리자만 세트를 업로드할 수 있습니다.', 'var(--red)')
    return
  }

  const classInfo = getPortalUploadTargetClass(kind)
  if(!classInfo || !classInfo.id){
    showToast('먼저 반을 선택해 주세요.', 'var(--red)')
    return
  }
  if(!canManagePortalClass(classInfo)){
    showToast('현재 계정으로 관리할 수 없는 반입니다.', 'var(--red)')
    return
  }

  try{
    const payload = await readJsonFileFromBrowser(file)
    const records = kind === 'prep'
      ? buildPrepUploadRecords(payload, file.name, classInfo)
      : buildCheckUploadRecords(payload, file.name, classInfo)
    if(!records.length){
      showToast((kind === 'prep' ? 'PREP' : 'CHECK') + ' 세트 JSON을 찾지 못했습니다.', 'var(--red)')
      return
    }

    await savePrepClassCatalog(classInfo)
    for(let index = 0; index < records.length; index += 1){
      await saveCloudSetDoc(kind, records[index].docId, records[index])
    }

    if(kind === 'prep'){
      await syncPrepContentAfterLogin(true)
      if(!restorePortalPrepClassSelection(classInfo.id) && typeof ensureScopedAdminPrepSelection === 'function'){
        ensureScopedAdminPrepSelection()
      }
      showHome()
    }else{
      await ensureCheckData(true)
      renderCheckScreen()
      syncPortalAdminSetPanels('check-screen')
    }

    showToast((kind === 'prep' ? 'PREP' : 'CHECK') + ' 세트 ' + records.length + '개를 추가했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast(String(error && error.message || 'Set upload failed.'), 'var(--red)')
  }
}

function buildPortalManagedSetMetaText(kind, record){
  const parts = []
  if(kind === 'prep'){
    parts.push(String(record && record.passageCount || 0) + '지문')
  }
  parts.push(String(record && record.questionCount || 0) + '문항')
  if(record && record.startDate && record.endDate){
    parts.push(record.startDate + ' ~ ' + record.endDate)
  }else if(record && record.startDate){
    parts.push(record.startDate + '부터')
  }else if(record && record.endDate){
    parts.push(record.endDate + '까지')
  }else{
    parts.push('상시 노출')
  }
  if(kind === 'check' && record && record.assignmentLabel){
    parts.push(record.assignmentLabel)
  }
  if(record && record.updatedAt){
    parts.push('업데이트 ' + formatAdminTime(record.updatedAt))
  }
  return parts.join(' · ')
}

function getPortalManagedCheckSetSourceGroupInfo(source){
  const payload = source && source.payload && typeof source.payload === 'object'
    ? source.payload
    : source
  return {
    source: String(payload && payload.source || '').trim().toLowerCase(),
    sourceBatchId: String(payload && payload.sourceBatchId || '').trim(),
    sourceSetId: String(payload && payload.sourceSetId || '').trim(),
    sourceRound: String(payload && payload.sourceRound || '').trim()
  }
}

function getPortalManagedCheckSetSourceGroupKey(source){
  const groupInfo = getPortalManagedCheckSetSourceGroupInfo(source)
  if(!groupInfo.sourceBatchId || !groupInfo.sourceSetId || !groupInfo.sourceRound) return ''
  return [
    groupInfo.source || 'pdf-lab',
    groupInfo.sourceBatchId,
    groupInfo.sourceSetId,
    groupInfo.sourceRound
  ].join('::').toLowerCase()
}

function canPortalManagedCheckSetSaveSourceGroup(editor){
  return !!getPortalManagedCheckSetSourceGroupKey(editor && editor.currentDoc)
}

function serializePortalManagedCheckSetEditorQuestion(question){
  const type = normalizeCheckQuestionType(question && question.type)
  return {
    id: String(question && question.id || '').trim(),
    answer: type === '객관식'
      ? normalizeChoiceAnswer(question && question.answer)
      : String(question && question.answer || '').trim(),
    explanation: String(question && question.explanation || '').trim()
  }
}

function buildPortalManagedCheckSetEditorDraftMap(questions){
  return new Map((Array.isArray(questions) ? questions : []).map(function(question){
    const serialized = serializePortalManagedCheckSetEditorQuestion(question)
    return serialized.id ? [serialized.id, serialized] : null
  }).filter(Boolean))
}

function buildPortalManagedCheckSetEditorChangedDraftMap(editor){
  const currentEditor = editor || portalState.checkSetEditor || {}
  const originalQuestions = buildPortalManagedCheckSetEditorQuestions(currentEditor && currentEditor.currentDoc && currentEditor.currentDoc.payload && currentEditor.currentDoc.payload.questions)
  const originalMap = buildPortalManagedCheckSetEditorDraftMap(originalQuestions)
  const changedMap = new Map()
  buildPortalManagedCheckSetEditorDraftMap(currentEditor.questions).forEach(function(serialized, questionId){
    const originalSerialized = originalMap.get(questionId)
    if(!originalSerialized || JSON.stringify(originalSerialized) !== JSON.stringify(serialized)){
      changedMap.set(questionId, serialized)
    }
  })
  return changedMap
}

function applyPortalManagedCheckSetEditorDraftsToPayload(payload, draftMap){
  if(!payload || typeof payload !== 'object') return 0
  const rawQuestions = Array.isArray(payload.questions) ? payload.questions : []
  let updatedCount = 0
  payload.questions = rawQuestions.map(function(question, index){
    const questionId = String(question && question.id || ('q-' + normalizeCheckQuestionNumber(question && question.number, index + 1))).trim()
    const draft = draftMap.get(questionId)
    if(!draft) return question

    updatedCount += 1
    const nextQuestion = Object.assign({}, question)
    nextQuestion.answer = draft.answer
    nextQuestion.explanation = draft.explanation
    return nextQuestion
  })
  return updatedCount
}

function buildPortalManagedCheckSetEditorSavePayload(editor){
  const nextPayload = clonePlainData(editor && editor.currentDoc && editor.currentDoc.payload) || {}
  const draftMap = buildPortalManagedCheckSetEditorDraftMap(editor && editor.questions)
  applyPortalManagedCheckSetEditorDraftsToPayload(nextPayload, draftMap)
  nextPayload.id = String(nextPayload.id || editor && editor.docId || '').trim()
  nextPayload.title = String(nextPayload.title || editor && editor.title || 'CHECK ?명듃').trim()
  if(!Array.isArray(nextPayload.classIds) || !nextPayload.classIds.length){
    nextPayload.classIds = Array.isArray(editor && editor.currentDoc && editor.currentDoc.classIds)
      ? editor.currentDoc.classIds.slice()
      : []
  }
  return nextPayload
}

function canManagePortalCheckSetRecord(record){
  if(!isPortalAdmin()) return false
  if(isPortalSuperAdmin()) return true
  const allowedClassIds = getProfileClassIds()
  const classIds = Array.isArray(record && record.classIds) ? record.classIds : []
  return classIds.some(function(classId){
    return allowedClassIds.indexOf(classId) >= 0
  })
}

async function loadPortalManagedCheckSetSourceGroupDocs(source){
  const currentDoc = normalizePortalSetDoc('check', source)
  const sourceGroupKey = getPortalManagedCheckSetSourceGroupKey(currentDoc)
  if(!sourceGroupKey) return [currentDoc]

  const matchingDocs = (await loadCloudSetDocs('check')).filter(function(doc){
    return canManagePortalCheckSetRecord(doc) && getPortalManagedCheckSetSourceGroupKey(doc) === sourceGroupKey
  })
  if(!matchingDocs.some(function(doc){
    return String(doc && doc.docId || '').trim() === String(currentDoc && currentDoc.docId || '').trim()
  })){
    matchingDocs.unshift(currentDoc)
  }
  return matchingDocs
}

function buildPortalManagedCheckSetEditorQuestions(source){
  return (Array.isArray(source) ? source : []).map(function(question, index){
    const type = normalizeCheckQuestionType(question && question.type)
    const number = normalizeCheckQuestionNumber(question && question.number, index + 1)
    const questionId = String(question && question.id || ('q-' + number)).trim()
    if(!questionId) return null
    return {
      id: questionId,
      number: number,
      type: type,
      problemType: normalizeCheckProblemType(question && (question.problemType || question.category)),
      prompt: String(question && question.prompt || ('문항 ' + number)).trim(),
      answer: String(question && question.answer || '').trim(),
      explanation: String(question && question.explanation || '')
    }
  }).filter(Boolean)
}

function serializePortalManagedCheckSetEditorQuestions(questions){
  return JSON.stringify((Array.isArray(questions) ? questions : []).map(function(question){
    return serializePortalManagedCheckSetEditorQuestion(question)
  }))
}

function hasPortalManagedCheckSetEditorChanges(){
  const editor = portalState.checkSetEditor || {}
  if(!editor.open) return false
  return serializePortalManagedCheckSetEditorQuestions(editor.questions) !== String(editor.initialDigest || '')
}

function getPortalManagedCheckSetEditorQuestionAnswer(question){
  const type = normalizeCheckQuestionType(question && question.type)
  return type === '객관식'
    ? normalizeChoiceAnswer(question && question.answer)
    : String(question && question.answer || '').trim()
}

function buildPortalManagedCheckSetEditorItemHtml(question){
  const questionId = String(question && question.id || '').trim()
  const type = normalizeCheckQuestionType(question && question.type)
  const isChoice = type === '객관식'
  const promptText = String(question && question.prompt || '').trim() || '문항 안내가 없습니다.'
  const answerValue = String(question && question.answer || '').trim()
  const answerField = isChoice
    ? '<input class="check-set-editor-input" type="text" data-editor-field="answer" data-question-id="' + escapeHtml(questionId) + '" value="' + escapeHtml(answerValue) + '" placeholder="예: 2 또는 1,3">'
    : '<select class="check-set-editor-select" data-editor-field="answer" data-question-id="' + escapeHtml(questionId) + '">' +
        ['맞음', '틀림'].map(function(option){
          const selected = answerValue === option ? ' selected' : ''
          return '<option value="' + escapeHtml(option) + '"' + selected + '>' + escapeHtml(option) + '</option>'
        }).join('') +
      '</select>'
  return '' +
    '<section class="check-set-editor-item">' +
      '<div class="check-set-editor-item-head">' +
        '<div>' +
          '<div class="check-set-editor-item-title">문항 ' + escapeHtml(String(question && question.number || '')) + '</div>' +
          '<div class="check-set-editor-item-meta">' +
            '<span class="check-chip">' + escapeHtml(String(question && question.type || '')) + '</span>' +
            '<span class="check-chip">' + escapeHtml(String(question && question.problemType || '기타')) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="check-set-editor-prompt">' + escapeHtml(promptText).replace(/\n/g, '<br>') + '</div>' +
      '<div class="check-set-editor-grid">' +
        '<label class="check-set-editor-field">' +
          '<span class="check-set-editor-label">' + (isChoice ? '정답 번호' : '정답') + '</span>' +
          answerField +
          '<span class="check-set-editor-help">' + (isChoice ? '복수 정답은 1,3처럼 쉼표로 입력해 주세요.' : '맞음 또는 틀림 중 하나를 선택해 주세요.') + '</span>' +
        '</label>' +
        '<label class="check-set-editor-field">' +
          '<span class="check-set-editor-label">해설</span>' +
          '<textarea data-editor-field="explanation" data-question-id="' + escapeHtml(questionId) + '" placeholder="학생에게 보여줄 해설을 입력해 주세요.">' + escapeHtml(String(question && question.explanation || '')) + '</textarea>' +
          '<span class="check-set-editor-help">학생이 제출 후 확인하는 정답과 해설 영역에 그대로 노출됩니다.</span>' +
        '</label>' +
      '</div>' +
    '</section>'
}

function syncPortalManagedCheckSetEditorControls(){
  const editor = portalState.checkSetEditor || {}
  const saveButton = document.getElementById('check-set-editor-save-btn')
  const cancelButton = document.getElementById('check-set-editor-cancel-btn')
  const closeButton = document.getElementById('check-set-editor-close-btn')
  const statusNode = document.getElementById('check-set-editor-status')
  if(!saveButton || !cancelButton || !closeButton || !statusNode) return

  const hasQuestions = Array.isArray(editor.questions) && editor.questions.length > 0
  const hasChanges = hasPortalManagedCheckSetEditorChanges()
  saveButton.disabled = !editor.open || editor.isSaving || !hasQuestions || !hasChanges
  cancelButton.disabled = !!editor.isSaving
  closeButton.disabled = !!editor.isSaving
  saveButton.textContent = editor.isSaving ? '저장 중...' : '저장'
  statusNode.textContent = editor.isSaving
    ? '세트 내용을 저장하고 있습니다.'
    : (!hasQuestions
        ? '수정할 문항이 없습니다.'
        : (hasChanges
            ? '변경 사항이 있습니다. 저장하면 이후 제출부터 반영됩니다.'
            : '변경 없음'))
}

function renderPortalManagedCheckSetEditor(){
  const modal = document.getElementById('check-set-editor-modal')
  const titleNode = document.getElementById('check-set-editor-title')
  const metaNode = document.getElementById('check-set-editor-meta')
  const listNode = document.getElementById('check-set-editor-list')
  if(!modal || !titleNode || !metaNode || !listNode) return

  const editor = portalState.checkSetEditor || {}
  if(!editor.open){
    modal.classList.add('hidden')
    modal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')
    listNode.innerHTML = ''
    return
  }

  titleNode.textContent = editor.title || 'CHECK 세트 문항 수정'
  metaNode.textContent = String((Array.isArray(editor.questions) ? editor.questions.length : 0)) + '문항 · 저장해도 이미 제출된 학생 결과는 자동 수정되지 않습니다.'
  listNode.innerHTML = Array.isArray(editor.questions) && editor.questions.length
    ? editor.questions.map(function(question){
        return buildPortalManagedCheckSetEditorItemHtml(question)
      }).join('')
    : '<div class="admin-content-item-empty">이 세트에는 수정할 문항이 없습니다.</div>'

  modal.classList.remove('hidden')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
  syncPortalManagedCheckSetEditorControls()
}

function closePortalManagedCheckSetEditor(options){
  const settings = options || {}
  const editor = portalState.checkSetEditor || {}
  if(!editor.open) return true
  if(editor.isSaving && !settings.force) return false
  if(!settings.force && hasPortalManagedCheckSetEditorChanges()){
    if(typeof window.confirm === 'function' && !window.confirm('저장하지 않은 변경이 있습니다. 닫을까요?')) return false
  }
  portalState.checkSetEditor = {
    open: false,
    isSaving: false,
    docId: '',
    title: '',
    currentDoc: null,
    questions: [],
    initialDigest: ''
  }
  renderPortalManagedCheckSetEditor()
  return true
}

function handlePortalManagedCheckSetEditorFieldChange(event){
  const target = event && event.target
  if(!target || !target.dataset) return
  const field = String(target.dataset.editorField || '').trim()
  const questionId = String(target.dataset.questionId || '').trim()
  if(!field || !questionId) return

  const editor = portalState.checkSetEditor || {}
  if(!editor.open || editor.isSaving) return
  const targetQuestion = (Array.isArray(editor.questions) ? editor.questions : []).find(function(question){
    return String(question && question.id || '').trim() === questionId
  })
  if(!targetQuestion) return

  if(field === 'answer'){
    targetQuestion.answer = String(target.value || '').trim()
  }else if(field === 'explanation'){
    targetQuestion.explanation = String(target.value || '')
  }else{
    return
  }

  syncPortalManagedCheckSetEditorControls()
}

function handlePortalManagedCheckSetEditorKeydown(event){
  if(!event || event.key !== 'Escape') return
  const editor = portalState.checkSetEditor || {}
  if(!editor.open) return
  event.preventDefault()
  closePortalManagedCheckSetEditor()
}

async function openPortalManagedCheckSetEditor(docId){
  if(!isPortalAdmin()){
    showToast('관리자만 CHECK 세트 문항을 수정할 수 있습니다.', 'var(--red)')
    return
  }

  if(portalState.checkSetEditor && portalState.checkSetEditor.open){
    const currentId = String(portalState.checkSetEditor.docId || '').trim()
    if(currentId === String(docId || '').trim()) return
    if(!closePortalManagedCheckSetEditor()) return
  }

  try{
    const currentDoc = await getCloudSetDoc('check', docId)
    if(!currentDoc || !currentDoc.payload){
      showToast('수정할 CHECK 세트를 찾지 못했습니다.', 'var(--red)')
      return
    }

    const questions = buildPortalManagedCheckSetEditorQuestions(currentDoc.payload.questions)
    if(!questions.length){
      showToast('이 세트에는 수정할 문항이 없습니다.', 'var(--red)')
      return
    }

    portalState.checkSetEditor = {
      open: true,
      isSaving: false,
      docId: String(currentDoc.docId || '').trim(),
      title: String(currentDoc.title || currentDoc.payload.title || 'CHECK 세트').trim(),
      currentDoc: clonePlainData(currentDoc),
      questions: questions,
      initialDigest: serializePortalManagedCheckSetEditorQuestions(questions)
    }
    renderPortalManagedCheckSetEditor()
  }catch(error){
    console.error(error)
    showToast('CHECK 세트 문항을 불러오는 중 오류가 발생했습니다.', 'var(--red)')
  }
}

async function savePortalManagedCheckSetEditor(){
  const editor = portalState.checkSetEditor || {}
  if(!editor.open || editor.isSaving) return
  if(!editor.currentDoc || !editor.docId){
    showToast('저장할 세트 정보를 찾지 못했습니다.', 'var(--red)')
    return
  }

  const invalidQuestion = (Array.isArray(editor.questions) ? editor.questions : []).find(function(question){
    return !getPortalManagedCheckSetEditorQuestionAnswer(question)
  }) || null
  if(invalidQuestion){
    showToast(String(invalidQuestion.number || '') + '번 문항 정답을 확인해 주세요.', 'var(--red)')
    return
  }
  if(!hasPortalManagedCheckSetEditorChanges()){
    showToast('변경된 내용이 없습니다.', 'var(--blue)')
    return
  }

  editor.isSaving = true
  syncPortalManagedCheckSetEditorControls()

  try{
    const nextPayload = clonePlainData(editor.currentDoc.payload) || {}
    const rawQuestions = Array.isArray(nextPayload.questions) ? nextPayload.questions : []
    const draftMap = new Map((Array.isArray(editor.questions) ? editor.questions : []).map(function(question){
      return [String(question && question.id || '').trim(), question]
    }).filter(function(entry){
      return entry[0]
    }))

    nextPayload.questions = rawQuestions.map(function(question, index){
      const questionId = String(question && question.id || ('q-' + normalizeCheckQuestionNumber(question && question.number, index + 1))).trim()
      const draft = draftMap.get(questionId)
      if(!draft) return question

      const nextQuestion = Object.assign({}, question)
      nextQuestion.answer = getPortalManagedCheckSetEditorQuestionAnswer(draft)
      nextQuestion.explanation = String(draft.explanation || '').trim()
      return nextQuestion
    })
    nextPayload.id = String(nextPayload.id || editor.docId).trim()
    nextPayload.title = String(nextPayload.title || editor.title || 'CHECK 세트').trim()
    if(!Array.isArray(nextPayload.classIds) || !nextPayload.classIds.length){
      nextPayload.classIds = Array.isArray(editor.currentDoc.classIds) ? editor.currentDoc.classIds.slice() : []
    }

    await saveCloudSetDoc('check', editor.docId, Object.assign({}, editor.currentDoc, {
      title: editor.title,
      payload: nextPayload
    }))

    await ensureCheckData(true)
    if(getCurrentActiveScreenId() === 'check-set-screen' && portalState.currentCheckSet && portalState.currentCheckSet.id === editor.docId){
      await openCheckSetPortal(editor.docId, { preserveHistory: true })
    }else{
      renderCheckScreen()
    }
    syncPortalAdminSetPanels('check-screen')
    closePortalManagedCheckSetEditor({ force: true })
    showToast('CHECK 세트 정답과 해설을 저장했습니다. 기존 학생 결과는 그대로 유지됩니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    editor.isSaving = false
    syncPortalManagedCheckSetEditorControls()
    showToast('CHECK 세트 저장 중 오류가 발생했습니다.', 'var(--red)')
  }
}

function syncPortalManagedCheckSetEditorControls(){
  ensurePortalManagedCheckSetEditorGroupSaveButton()
  const editor = portalState.checkSetEditor || {}
  const saveButton = document.getElementById('check-set-editor-save-btn')
  const saveGroupButton = document.getElementById('check-set-editor-save-group-btn')
  const cancelButton = document.getElementById('check-set-editor-cancel-btn')
  const closeButton = document.getElementById('check-set-editor-close-btn')
  const statusNode = document.getElementById('check-set-editor-status')
  if(!saveButton || !saveGroupButton || !cancelButton || !closeButton || !statusNode) return

  const hasQuestions = Array.isArray(editor.questions) && editor.questions.length > 0
  const hasChanges = hasPortalManagedCheckSetEditorChanges()
  const canSaveSourceGroup = canPortalManagedCheckSetSaveSourceGroup(editor)
  saveButton.disabled = !editor.open || editor.isSaving || !hasQuestions || !hasChanges
  saveGroupButton.disabled = !editor.open || editor.isSaving || !hasQuestions || !hasChanges || !canSaveSourceGroup
  cancelButton.disabled = !!editor.isSaving
  closeButton.disabled = !!editor.isSaving
  saveButton.textContent = editor.isSaving && editor.savingScope !== 'group' ? '이 세트 저장 중...' : '이 세트만 저장'
  saveGroupButton.textContent = editor.isSaving && editor.savingScope === 'group' ? '같은 원본 저장 중...' : '같은 원본 전체 저장'
  statusNode.textContent = editor.isSaving
    ? '세트 내용을 저장하고 있습니다.'
    : (!hasQuestions
        ? '수정할 문항이 없습니다.'
        : (hasChanges
            ? (canSaveSourceGroup
                ? '변경 사항이 있습니다. 이 세트만 저장하거나 같은 원본 전체에 반영할 수 있습니다.'
                : '변경 사항이 있습니다. 저장하면 이후 제출부터 반영됩니다.')
            : '변경 사항이 없습니다.'))
}

function renderPortalManagedCheckSetEditor(){
  ensurePortalManagedCheckSetEditorGroupSaveButton()
  const modal = document.getElementById('check-set-editor-modal')
  const titleNode = document.getElementById('check-set-editor-title')
  const metaNode = document.getElementById('check-set-editor-meta')
  const listNode = document.getElementById('check-set-editor-list')
  if(!modal || !titleNode || !metaNode || !listNode) return

  const editor = portalState.checkSetEditor || {}
  if(!editor.open){
    modal.classList.add('hidden')
    modal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')
    listNode.innerHTML = ''
    return
  }

  titleNode.textContent = editor.title || 'CHECK 세트 문항 수정'
  metaNode.textContent = String((Array.isArray(editor.questions) ? editor.questions.length : 0)) + '문항 · ' + (
    canPortalManagedCheckSetSaveSourceGroup(editor)
      ? '같은 원본으로 복제된 개인 세트 전체에 일괄 반영할 수 있습니다.'
      : '이 세트만 수정할 수 있습니다.'
  )
  listNode.innerHTML = Array.isArray(editor.questions) && editor.questions.length
    ? editor.questions.map(function(question){
        return buildPortalManagedCheckSetEditorItemHtml(question)
      }).join('')
    : '<div class="admin-content-item-empty">이 세트에는 수정할 문항이 없습니다.</div>'

  modal.classList.remove('hidden')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
  syncPortalManagedCheckSetEditorControls()
}

function closePortalManagedCheckSetEditor(options){
  const settings = options || {}
  const editor = portalState.checkSetEditor || {}
  if(!editor.open) return true
  if(editor.isSaving && !settings.force) return false
  if(!settings.force && hasPortalManagedCheckSetEditorChanges()){
    if(typeof window.confirm === 'function' && !window.confirm('저장하지 않은 변경이 있습니다. 닫을까요?')) return false
  }
  portalState.checkSetEditor = {
    open: false,
    isSaving: false,
    savingScope: '',
    docId: '',
    title: '',
    currentDoc: null,
    questions: [],
    initialDigest: ''
  }
  renderPortalManagedCheckSetEditor()
  return true
}

async function openPortalManagedCheckSetEditor(docId){
  if(!isPortalAdmin()){
    showToast('관리자만 CHECK 세트 문항을 수정할 수 있습니다.', 'var(--red)')
    return
  }

  if(portalState.checkSetEditor && portalState.checkSetEditor.open){
    const currentId = String(portalState.checkSetEditor.docId || '').trim()
    if(currentId === String(docId || '').trim()) return
    if(!closePortalManagedCheckSetEditor()) return
  }

  try{
    const currentDoc = await getCloudSetDoc('check', docId)
    if(!currentDoc || !currentDoc.payload){
      showToast('수정할 CHECK 세트를 찾지 못했습니다.', 'var(--red)')
      return
    }

    const questions = buildPortalManagedCheckSetEditorQuestions(currentDoc.payload.questions)
    if(!questions.length){
      showToast('이 세트에는 수정할 문항이 없습니다.', 'var(--red)')
      return
    }

    portalState.checkSetEditor = {
      open: true,
      isSaving: false,
      savingScope: '',
      docId: String(currentDoc.docId || '').trim(),
      title: String(currentDoc.title || currentDoc.payload.title || 'CHECK 세트').trim(),
      currentDoc: clonePlainData(currentDoc),
      questions: questions,
      initialDigest: serializePortalManagedCheckSetEditorQuestions(questions)
    }
    renderPortalManagedCheckSetEditor()
  }catch(error){
    console.error(error)
    showToast('CHECK 세트 문항을 불러오는 중 오류가 발생했습니다.', 'var(--red)')
  }
}

async function savePortalManagedCheckSetEditorForSourceGroup(){
  return savePortalManagedCheckSetEditor('group')
}

async function savePortalManagedCheckSetEditor(mode){
  const editor = portalState.checkSetEditor || {}
  const saveMode = mode === 'group' ? 'group' : 'single'
  if(!editor.open || editor.isSaving) return
  if(!editor.currentDoc || !editor.docId){
    showToast('저장할 세트 정보를 찾지 못했습니다.', 'var(--red)')
    return
  }

  const invalidQuestion = (Array.isArray(editor.questions) ? editor.questions : []).find(function(question){
    return !getPortalManagedCheckSetEditorQuestionAnswer(question)
  }) || null
  if(invalidQuestion){
    showToast(String(invalidQuestion.number || '') + '번 문항 정답을 확인해 주세요.', 'var(--red)')
    return
  }
  if(!hasPortalManagedCheckSetEditorChanges()){
    showToast('변경된 내용이 없습니다.', 'var(--blue)')
    return
  }
  if(saveMode === 'group' && !canPortalManagedCheckSetSaveSourceGroup(editor)){
    showToast('같은 원본으로 묶을 source 정보가 없어 이 세트만 저장할 수 있습니다.', 'var(--blue)')
    return
  }

  editor.isSaving = true
  editor.savingScope = saveMode
  syncPortalManagedCheckSetEditorControls()

  let savedDocIds = []
  let savedCount = 0

  try{
    if(saveMode === 'group'){
      const sourceGroupKey = getPortalManagedCheckSetSourceGroupKey(editor.currentDoc)
      const changedDraftMap = buildPortalManagedCheckSetEditorChangedDraftMap(editor)
      const allDocs = await loadCloudSetDocs('check')
      const matchingDocs = allDocs.filter(function(doc){
        return canManagePortalCheckSetRecord(doc) && getPortalManagedCheckSetSourceGroupKey(doc) === sourceGroupKey
      })
      if(!matchingDocs.some(function(doc){ return String(doc && doc.docId || '').trim() === editor.docId })){
        matchingDocs.unshift(normalizePortalSetDoc('check', editor.currentDoc))
      }

      const saveTargets = matchingDocs.map(function(doc){
        if(!doc || !doc.payload) return null
        const nextPayload = clonePlainData(doc.payload) || {}
        const updatedCount = applyPortalManagedCheckSetEditorDraftsToPayload(nextPayload, changedDraftMap)
        if(!updatedCount) return null
        if(!Array.isArray(nextPayload.classIds) || !nextPayload.classIds.length){
          nextPayload.classIds = Array.isArray(doc.classIds) ? doc.classIds.slice() : []
        }
        nextPayload.id = String(nextPayload.id || doc.docId || '').trim()
        nextPayload.title = String(nextPayload.title || doc.title || 'CHECK 세트').trim()
        return {
          docId: String(doc.docId || '').trim(),
          title: String(doc.title || nextPayload.title || 'CHECK 세트').trim(),
          record: Object.assign({}, doc, {
            title: String(doc.title || nextPayload.title || 'CHECK 세트').trim(),
            payload: nextPayload
          })
        }
      }).filter(Boolean)

      if(!saveTargets.length){
        throw new Error('같은 원본으로 반영할 세트를 찾지 못했습니다.')
      }

      for(let index = 0; index < saveTargets.length; index += 1){
        const target = saveTargets[index]
        await saveCloudSetDoc('check', target.docId, target.record)
        savedDocIds.push(target.docId)
      }
      savedCount = saveTargets.length
    }else{
      const nextPayload = buildPortalManagedCheckSetEditorSavePayload(editor)
      await saveCloudSetDoc('check', editor.docId, Object.assign({}, editor.currentDoc, {
        title: editor.title,
        payload: nextPayload
      }))
      savedDocIds = [editor.docId]
      savedCount = 1
    }

    await ensureCheckData(true)
    const currentSetId = String(portalState.currentCheckSet && portalState.currentCheckSet.id || '').trim()
    if(getCurrentActiveScreenId() === 'check-set-screen' && currentSetId && savedDocIds.indexOf(currentSetId) >= 0){
      await openCheckSetPortal(currentSetId, { preserveHistory: true })
    }else{
      renderCheckScreen()
    }
    syncPortalAdminSetPanels('check-screen')
    editor.isSaving = false
    editor.savingScope = ''
    closePortalManagedCheckSetEditor({ force: true })
    showToast(
      saveMode === 'group'
        ? ('같은 원본 CHECK 세트 ' + savedCount + '개에 정답과 해설을 반영했습니다.')
        : '이 CHECK 세트의 정답과 해설을 저장했습니다.',
      'var(--green)'
    )
  }catch(error){
    console.error(error)
    editor.isSaving = false
    editor.savingScope = ''
    syncPortalManagedCheckSetEditorControls()
    showToast(String(error && error.message || 'CHECK 세트 저장 중 오류가 발생했습니다.'), 'var(--red)')
  }
}

async function fetchCheckResponsesForSet(checkSetId){
  const targetId = String(checkSetId || '').trim()
  if(!targetId) return []

  if(portalState.firebaseEnabled && portalState.db){
    try{
      const snapshot = await portalState.db.collection('checkResponses')
        .where('checkSetId', '==', targetId)
        .get()
      return snapshot.docs.map(function(doc){
        return Object.assign({ id: doc.id }, doc.data() || {})
      })
    }catch(error){
      console.warn('checkResponses set read fallback:', error && error.message ? error.message : error)
    }
  }

  return (Array.isArray(readLocalResponses()) ? readLocalResponses() : []).filter(function(entry){
    return String(entry && entry.checkSetId || '').trim() === targetId
  })
}

function buildCheckQuestionLookup(checkSet){
  return new Map((Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []).map(function(question){
    const questionId = String(question && question.id || '').trim()
    return questionId ? [questionId, question] : null
  }).filter(Boolean))
}

function buildRegradedCheckSubmission(checkSet, row){
  const submission = mapResponseToSubmission(row)
  const questionLookup = buildCheckQuestionLookup(checkSet)
  const answers = sortCheckSubmissionAnswers((Array.isArray(submission && submission.answers) ? submission.answers : []).map(function(answer, index){
    if(!answer) return null
    const questionId = String(answer.questionId || '').trim()
    const nextQuestion = questionLookup.get(questionId)
    if(!nextQuestion){
      return Object.assign({}, answer)
    }

    return Object.assign({}, answer, {
      number: normalizeCheckQuestionNumber(nextQuestion.number, index + 1),
      type: nextQuestion.type,
      problemType: normalizeCheckProblemType(nextQuestion.problemType || nextQuestion.category),
      prompt: String(nextQuestion.prompt || '').trim(),
      answer: nextQuestion.answer,
      explanation: String(nextQuestion.explanation || '').trim(),
      isCorrect: isAnswerAccepted(String(answer.userAnswer || '').trim(), nextQuestion)
    })
  }).filter(Boolean))

  const latestBatchIds = Array.isArray(submission && submission.latestBatch && submission.latestBatch.questionIds)
    ? submission.latestBatch.questionIds.map(function(value){ return String(value || '').trim() }).filter(Boolean)
    : []
  const latestBatchAnswers = latestBatchIds.length
    ? answers.filter(function(answer){
        return latestBatchIds.includes(String(answer && answer.questionId || '').trim())
      })
    : []
  const editedCount = Number(submission && submission.latestBatch && submission.latestBatch.editedCount || 0)

  return {
    submittedAt: String(submission && submission.submittedAt || row && row.submittedAt || '').trim(),
    summary: buildCheckSubmissionSummary(answers),
    answers: answers,
    latestBatch: latestBatchIds.length ? {
      submittedAt: String(submission && submission.latestBatch && submission.latestBatch.submittedAt || submission && submission.submittedAt || row && row.submittedAt || '').trim(),
      questionIds: latestBatchIds,
      summary: buildCheckSubmissionSummary(latestBatchAnswers),
      editedCount: editedCount,
      newCount: Number(submission && submission.latestBatch && submission.latestBatch.newCount || Math.max(0, latestBatchIds.length - editedCount))
    } : null
  }
}

function serializeCheckResponseForCompare(row){
  return JSON.stringify({
    checkSetTitle: String(row && row.checkSetTitle || '').trim(),
    summary: row && row.summary ? row.summary : null,
    answers: Array.isArray(row && row.answers) ? row.answers : [],
    latestBatch: row && row.latestBatch ? row.latestBatch : null
  })
}

function buildRegradedCheckResponseRow(checkSet, row){
  const submission = buildRegradedCheckSubmission(checkSet, row)
  return Object.assign({}, row, {
    checkSetTitle: String(checkSet && checkSet.title || row && row.checkSetTitle || '').trim(),
    summary: submission.summary,
    answers: submission.answers,
    latestBatch: submission.latestBatch || null
  })
}

async function saveRegradedCheckResponses(rows){
  const nextRows = Array.isArray(rows) ? rows.filter(Boolean) : []
  if(!nextRows.length) return

  if(portalState.firebaseEnabled && portalState.db){
    for(let index = 0; index < nextRows.length; index += 1){
      const row = nextRows[index]
      const docId = String(row && row.id || '').trim()
      if(!docId) continue
      await portalState.db.collection('checkResponses').doc(docId).set(row, { merge: true })
    }
    return
  }

  const targetIds = new Set(nextRows.map(function(row){
    return String(row && row.id || '').trim()
  }).filter(Boolean))
  const preservedRows = readLocalResponses().filter(function(entry){
    return !targetIds.has(String(entry && entry.id || '').trim())
  })
  writeLocalResponses(preservedRows.concat(nextRows))
}

async function regradePortalManagedCheckSet(docId){
  const targetId = String(docId || '').trim()
  if(!targetId) return
  if(!isPortalAdmin()){
    showToast('관리자만 학생 결과를 재채점할 수 있습니다.', 'var(--red)')
    return
  }
  if(portalState.checkSetRegradeDocId === targetId){
    showToast('이미 이 세트를 재채점하고 있습니다.', 'var(--blue)')
    return
  }

  try{
    const currentDoc = await getCloudSetDoc('check', targetId)
    if(!currentDoc || !currentDoc.payload){
      showToast('재채점할 CHECK 세트를 찾지 못했습니다.', 'var(--red)')
      return
    }

    const targetDocs = await loadPortalManagedCheckSetSourceGroupDocs(currentDoc)
    const targetSets = targetDocs.map(function(doc){
      const checkSet = normalizeStoredCheckSet(doc && doc.payload)
      return checkSet && Array.isArray(checkSet.questions) && checkSet.questions.length
        ? { doc: doc, checkSet: checkSet }
        : null
    }).filter(Boolean)
    if(!targetSets.length){
      showToast('재채점할 문항이 없는 세트입니다.', 'var(--red)')
      return
    }

    const isGrouped = targetSets.length > 1
    const confirmMessage = isGrouped
      ? ('같은 원본 CHECK 세트 ' + targetSets.length + '개의 기존 학생 결과와 ADMIN 통계를 현재 정답 기준으로 다시 계산할까요?')
      : '이 세트의 기존 학생 결과와 ADMIN 통계를 현재 정답 기준으로 다시 계산할까요?'
    if(typeof window.confirm === 'function' && !window.confirm(confirmMessage)) return

    portalState.checkSetRegradeDocId = targetId
    syncPortalAdminSetPanels(getCurrentActiveScreenId())

    let totalResponseCount = 0
    let changedCount = 0
    const nextRows = []

    for(let index = 0; index < targetSets.length; index += 1){
      const entry = targetSets[index]
      const responses = await fetchCheckResponsesForSet(entry.checkSet.id)
      totalResponseCount += responses.length
      responses.forEach(function(row){
        const before = serializeCheckResponseForCompare(row)
        const nextRow = buildRegradedCheckResponseRow(entry.checkSet, row)
        const after = serializeCheckResponseForCompare(nextRow)
        if(before !== after) changedCount += 1
        nextRows.push(nextRow)
      })
    }

    if(!nextRows.length){
      showToast(isGrouped ? '같은 원본 세트들에는 아직 제출된 학생 결과가 없습니다.' : '이 세트에는 아직 제출된 학생 결과가 없습니다.', 'var(--blue)')
      return
    }

    await saveRegradedCheckResponses(nextRows)

    const currentSetId = String(portalState.currentCheckSet && portalState.currentCheckSet.id || '').trim()
    const affectedSetIds = targetSets.map(function(entry){ return String(entry.checkSet && entry.checkSet.id || '').trim() }).filter(Boolean)
    if(getCurrentActiveScreenId() === 'check-set-screen' && currentSetId && affectedSetIds.indexOf(currentSetId) >= 0){
      await openCheckSetPortal(currentSetId, { preserveHistory: true })
    }else if(getCurrentActiveScreenId() === 'check-screen'){
      renderCheckScreen()
    }
    if(getCurrentActiveScreenId() === 'admin-screen'){
      await renderAdminScreen()
    }

    showToast(
      isGrouped
        ? ('같은 원본 CHECK 세트 ' + targetSets.length + '개의 결과 ' + totalResponseCount + '건을 재채점했습니다. 변경 반영: ' + changedCount + '건')
        : ('CHECK 세트 ' + totalResponseCount + '건을 재채점했습니다. 변경 반영: ' + changedCount + '건'),
      'var(--green)'
    )
  }catch(error){
    console.error(error)
    showToast('CHECK 세트 재채점 중 오류가 발생했습니다.', 'var(--red)')
  }finally{
    portalState.checkSetRegradeDocId = ''
    syncPortalAdminSetPanels(getCurrentActiveScreenId())
  }
}

function buildPortalManagedSetItemHtml(kind, record){
  const chipClass = record && record.isManaged ? 'live' : 'legacy'
  const chipLabel = record && record.isManaged ? '직접 업로드' : '기존 마스터'
  const editButton = kind === 'check' && record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.openPortalManagedCheckSetEditor(\'' + escapeJs(record.docId) + '\')">문항 수정</button>'
    : ''
  const isRegrading = kind === 'check' && String(portalState.checkSetRegradeDocId || '').trim() === String(record && record.docId || '').trim()
  const regradeButton = kind === 'check' && record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.regradePortalManagedCheckSet(\'' + escapeJs(record.docId) + '\')"' + (isRegrading ? ' disabled' : '') + '>' + (isRegrading ? '재채점 중...' : '결과 재채점') + '</button>'
    : ''
  const renameButton = record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.renamePortalManagedSet(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">이름 변경</button>'
    : ''
  const dateButton = record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.changePortalManagedSetDates(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">기간 변경</button>'
    : ''
  const deleteButton = record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.removePortalManagedSet(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">삭제</button>'
    : ''
  return '' +
    '<div class="admin-content-item">' +
      '<div class="admin-content-item-body">' +
        '<div class="admin-content-item-title">' + escapeHtml(record && record.title || '') + '</div>' +
        '<div class="admin-content-item-meta">' + escapeHtml(buildPortalManagedSetMetaText(kind, record)) + '</div>' +
      '</div>' +
      '<div class="admin-content-item-actions">' +
        '<span class="admin-content-chip ' + chipClass + '">' + escapeHtml(chipLabel) + '</span>' +
        editButton +
        regradeButton +
        renameButton +
        dateButton +
        deleteButton +
      '</div>' +
    '</div>'
}

function getVisiblePortalManagedSetRecords(kind, classId){
  const source = kind === 'prep' ? portalState.prepSetInventory : portalState.checkSetInventory
  const targetClassId = String(classId || '').trim()
  return (Array.isArray(source) ? source : []).filter(function(record){
    if(!targetClassId) return true
    return Array.isArray(record && record.classIds) && record.classIds.indexOf(targetClassId) >= 0
  })
}

function renderPrepAdminSetPanel(activeScreenId){
  const panel = document.getElementById('prep-admin-set-panel')
  const list = document.getElementById('prep-admin-set-list')
  const countNode = document.getElementById('prep-admin-set-count')
  const hintNode = document.getElementById('prep-admin-set-hint')
  if(!panel || !list || !countNode || !hintNode) return

  const shouldShow = isPortalAdmin() && activeScreenId === 'home-screen'
  panel.classList.toggle('hidden', !shouldShow)
  if(!shouldShow) return

  const classInfo = typeof getCurrentClass === 'function' ? getCurrentClass() : null
  const records = getVisiblePortalManagedSetRecords('prep', classInfo && classInfo.id)
  countNode.textContent = String(records.length)
  hintNode.textContent = classInfo
    ? (classInfo.name + ' 반에 배정된 PREP 세트입니다. 직접 업로드한 세트만 이름/기간 변경과 삭제가 가능합니다.')
    : '먼저 반을 선택하면 PREP 세트를 올릴 수 있습니다.'

  list.innerHTML = records.length
    ? records.map(function(record){
        return buildPortalManagedSetItemHtml('prep', record)
      }).join('')
    : '<div class="admin-content-item-empty">이 반에 연결된 PREP 세트가 아직 없습니다.</div>'
}

function renderCheckAdminSetPanel(activeScreenId){
  const panel = document.getElementById('check-admin-set-panel')
  const list = document.getElementById('check-admin-set-list')
  const countNode = document.getElementById('check-admin-set-count')
  const hintNode = document.getElementById('check-admin-set-hint')
  if(!panel || !list || !countNode || !hintNode) return

  const shouldShow = isPortalAdmin() && activeScreenId === 'check-screen'
  panel.classList.toggle('hidden', !shouldShow)
  if(!shouldShow) return

  const activeEntry = typeof getActivePortalCheckClass === 'function' ? getActivePortalCheckClass() : null
  const classInfo = activeEntry && activeEntry.classInfo ? activeEntry.classInfo : null
  const records = getVisiblePortalManagedSetRecords('check', classInfo && classInfo.id)
  countNode.textContent = String(records.length)
  hintNode.textContent = classInfo
    ? (classInfo.name + ' 반에 배정된 CHECK 세트입니다. 직접 업로드한 세트만 문항 수정, 결과 재채점, 이름/기간 변경과 삭제가 가능합니다.')
    : '먼저 반을 선택하면 CHECK 세트를 올릴 수 있습니다.'

  list.innerHTML = records.length
    ? records.map(function(record){
        return buildPortalManagedSetItemHtml('check', record)
      }).join('')
    : '<div class="admin-content-item-empty">이 반에 연결된 CHECK 세트가 아직 없습니다.</div>'
}

function syncPortalAdminSetPanels(screenId){
  renderPrepAdminSetPanel(screenId)
  renderCheckAdminSetPanel(screenId)
}

async function renamePortalManagedSet(kind, docId){
  if(!isPortalAdmin()){
    showToast('관리자만 세트 이름을 바꿀 수 있습니다.', 'var(--red)')
    return
  }

  try{
    const currentDoc = await getCloudSetDoc(kind, docId)
    if(!currentDoc || !currentDoc.payload){
      showToast('이름을 바꿀 세트를 찾지 못했습니다.', 'var(--red)')
      return
    }

    const currentTitle = String(currentDoc.title || currentDoc.payload.title || '').trim()
    const nextTitleRaw = typeof window.prompt === 'function'
      ? window.prompt('새 세트 이름을 입력해 주세요.', currentTitle)
      : currentTitle
    if(nextTitleRaw == null) return

    const nextTitle = String(nextTitleRaw || '').trim()
    if(!nextTitle){
      showToast('세트 이름은 비워둘 수 없습니다.', 'var(--red)')
      return
    }
    if(nextTitle === currentTitle){
      showToast('변경된 이름이 없습니다.', 'var(--blue)')
      return
    }

    const targetClass = getPortalUploadTargetClass(kind)
    const targetDocs = kind === 'check'
      ? await loadPortalManagedCheckSetSourceGroupDocs(currentDoc)
      : [normalizePortalSetDoc(kind, currentDoc)]

    for(let index = 0; index < targetDocs.length; index += 1){
      const targetDoc = targetDocs[index]
      const nextPayload = clonePlainData(targetDoc.payload) || {}
      nextPayload.title = nextTitle
      await saveCloudSetDoc(kind, targetDoc.docId, Object.assign({}, targetDoc, {
        title: nextTitle,
        payload: nextPayload
      }))
    }

    if(kind === 'prep'){
      await syncPrepContentAfterLogin(true)
      if(targetClass && targetClass.id){
        restorePortalPrepClassSelection(targetClass.id)
      }
      showHome()
    }else{
      await ensureCheckData(true)
      const currentSetId = String(portalState.currentCheckSet && portalState.currentCheckSet.id || '').trim()
      const affectedSetIds = targetDocs.map(function(targetDoc){ return String(targetDoc && targetDoc.docId || '').trim() }).filter(Boolean)
      if(getCurrentActiveScreenId() === 'check-set-screen' && currentSetId && affectedSetIds.indexOf(currentSetId) >= 0){
        await openCheckSetPortal(currentSetId, { preserveHistory: true })
      }else{
        renderCheckScreen()
      }
      syncPortalAdminSetPanels('check-screen')
    }

    showToast(
      kind === 'check' && targetDocs.length > 1
        ? ('같은 원본 CHECK 세트 ' + targetDocs.length + '개의 이름을 변경했습니다.')
        : '세트 이름을 변경했습니다.',
      'var(--green)'
    )
  }catch(error){
    console.error(error)
    showToast('세트 이름 변경 중 오류가 발생했습니다.', 'var(--red)')
  }
}

function normalizePortalManagedDateInput(value){
  const text = String(value || '').trim()
  if(!text) return ''
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null
}

function getPortalManagedSetDateValues(kind, payload){
  if(kind === 'prep'){
    return {
      start: String(payload && payload.startDate || '').trim(),
      end: String(payload && payload.endDate || '').trim()
    }
  }
  return {
    start: String(payload && payload.availableFrom || '').trim(),
    end: String(payload && payload.availableTo || '').trim()
  }
}

function applyPortalManagedSetDateValues(kind, payload, startDate, endDate){
  if(kind === 'prep'){
    payload.startDate = startDate
    payload.endDate = endDate
    return
  }
  payload.availableFrom = startDate
  payload.availableTo = endDate
}

async function changePortalManagedSetDates(kind, docId){
  if(!isPortalAdmin()){
    showToast('관리자만 세트 기간을 바꿀 수 있습니다.', 'var(--red)')
    return
  }

  try{
    const currentDoc = await getCloudSetDoc(kind, docId)
    if(!currentDoc || !currentDoc.payload){
      showToast('기간을 바꿀 세트를 찾지 못했습니다.', 'var(--red)')
      return
    }

    const currentDates = getPortalManagedSetDateValues(kind, currentDoc.payload)
    const startRaw = typeof window.prompt === 'function'
      ? window.prompt('시작일을 입력해 주세요. 비우면 시작 제한이 없습니다. (YYYY-MM-DD)', currentDates.start)
      : currentDates.start
    if(startRaw == null) return
    const endRaw = typeof window.prompt === 'function'
      ? window.prompt('종료일을 입력해 주세요. 비우면 종료 제한이 없습니다. (YYYY-MM-DD)', currentDates.end)
      : currentDates.end
    if(endRaw == null) return

    const startDate = normalizePortalManagedDateInput(startRaw)
    const endDate = normalizePortalManagedDateInput(endRaw)
    if(startDate == null || endDate == null){
      showToast('날짜는 YYYY-MM-DD 형식으로 입력해 주세요.', 'var(--red)')
      return
    }
    if(startDate && endDate && startDate > endDate){
      showToast('종료일은 시작일보다 빠를 수 없습니다.', 'var(--red)')
      return
    }
    if(startDate === currentDates.start && endDate === currentDates.end){
      showToast('변경된 기간이 없습니다.', 'var(--blue)')
      return
    }

    const targetClass = getPortalUploadTargetClass(kind)
    const targetDocs = kind === 'check'
      ? await loadPortalManagedCheckSetSourceGroupDocs(currentDoc)
      : [normalizePortalSetDoc(kind, currentDoc)]

    for(let index = 0; index < targetDocs.length; index += 1){
      const targetDoc = targetDocs[index]
      const nextPayload = clonePlainData(targetDoc.payload) || {}
      applyPortalManagedSetDateValues(kind, nextPayload, startDate, endDate)
      await saveCloudSetDoc(kind, targetDoc.docId, Object.assign({}, targetDoc, {
        payload: nextPayload
      }))
    }

    if(kind === 'prep'){
      await syncPrepContentAfterLogin(true)
      if(targetClass && targetClass.id){
        restorePortalPrepClassSelection(targetClass.id)
      }
      showHome()
    }else{
      await ensureCheckData(true)
      const currentSetId = String(portalState.currentCheckSet && portalState.currentCheckSet.id || '').trim()
      const affectedSetIds = targetDocs.map(function(targetDoc){ return String(targetDoc && targetDoc.docId || '').trim() }).filter(Boolean)
      if(getCurrentActiveScreenId() === 'check-set-screen' && currentSetId && affectedSetIds.indexOf(currentSetId) >= 0){
        await openCheckSetPortal(currentSetId, { preserveHistory: true })
      }else{
        renderCheckScreen()
      }
      syncPortalAdminSetPanels('check-screen')
    }

    showToast(
      kind === 'check' && targetDocs.length > 1
        ? ('같은 원본 CHECK 세트 ' + targetDocs.length + '개의 기간을 변경했습니다.')
        : '세트 기간을 변경했습니다.',
      'var(--green)'
    )
  }catch(error){
    console.error(error)
    showToast('세트 기간 변경 중 오류가 발생했습니다.', 'var(--red)')
  }
}

async function removePortalManagedSet(kind, docId){
  if(!isPortalAdmin()){
    showToast('관리자만 세트를 삭제할 수 있습니다.', 'var(--red)')
    return
  }
  const message = (kind === 'prep' ? 'PREP' : 'CHECK') + ' 세트를 삭제할까요?'
  if(typeof window.confirm === 'function' && !window.confirm(message)) return

  try{
    const targetClass = getPortalUploadTargetClass(kind)
    await deleteCloudSetDoc(kind, String(docId || '').trim())
    if(kind === 'prep'){
      await syncPrepContentAfterLogin(true)
      if(targetClass && targetClass.id){
        restorePortalPrepClassSelection(targetClass.id)
      }
      showHome()
    }else{
      await ensureCheckData(true)
      renderCheckScreen()
      syncPortalAdminSetPanels('check-screen')
    }
    showToast((kind === 'prep' ? 'PREP' : 'CHECK') + ' 세트를 삭제했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('세트 삭제 중 오류가 발생했습니다.', 'var(--red)')
  }
}

window.renamePortalManagedSet = renamePortalManagedSet
window.changePortalManagedSetDates = changePortalManagedSetDates
window.removePortalManagedSet = removePortalManagedSet
window.openPortalManagedCheckSetEditor = openPortalManagedCheckSetEditor
window.regradePortalManagedCheckSet = regradePortalManagedCheckSet

async function getFirebaseUserProfileSnapshot(uid){
  const docRef = portalState.db.collection('users').doc(uid)
  try{
    return await docRef.get({ source: 'server' })
  }catch(error){
    console.warn('users profile server read failed:', error && error.message ? error.message : error)
    return await docRef.get()
  }
}

async function fetchOrCreateUserProfile(user){
  const snapshot = await getFirebaseUserProfileSnapshot(user.uid)
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

async function loginPortalUser(loginId, password){
  if(portalState.firebaseEnabled){
    await portalState.auth.signInWithEmailAndPassword(toPortalLoginEmail(loginId), password)
    return
  }

  const user = findLocalPortalUser(loginId, password)
  if(!user) throw new Error('?꾩씠???먮뒗 鍮꾨?踰덊샇媛 ?щ컮瑜댁? ?딆뒿?덈떎.')

  localStorage.setItem(PORTAL_STORAGE_KEYS.currentUserId, user.id)
  portalState.currentUser = buildLocalAuthUser(user)
  portalState.currentProfile = user
  routePortalAfterState()
}

async function submitPasswordChange(){
  const currentPassword = String(document.getElementById('password-current').value || '').trim()
  const nextPassword = String(document.getElementById('password-next').value || '').trim()
  const confirmPassword = String(document.getElementById('password-confirm').value || '').trim()

  if(!currentPassword || !nextPassword || !confirmPassword){
    setPasswordError('紐⑤뱺 移몄쓣 ?낅젰??二쇱꽭??')
    return
  }
  if(nextPassword.length < 6){
    setPasswordError('??鍮꾨?踰덊샇??6???댁긽?쇰줈 ?낅젰??二쇱꽭??')
    return
  }
  if(nextPassword !== confirmPassword){
    setPasswordError('??鍮꾨?踰덊샇 ?뺤씤???쇱튂?섏? ?딆뒿?덈떎.')
    return
  }
  if(currentPassword === nextPassword){
    setPasswordError('?꾩옱 鍮꾨?踰덊샇? ?ㅻⅨ 媛믪쑝濡?諛붽퓭 二쇱꽭??')
    return
  }

  try{
    if(portalState.firebaseEnabled){
      const user = portalState.auth.currentUser
      if(!user || !user.email) throw new Error('Login information is unavailable.')
      const updatedAt = new Date().toISOString()
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword)
      await user.reauthenticateWithCredential(credential)
      await user.updatePassword(nextPassword)
      await saveFirebaseUserProfile(user.uid, {
        passwordResetRequired: false,
        updatedAt: updatedAt
      })

      const refreshedSnapshot = await getFirebaseUserProfileSnapshot(user.uid)
      if(refreshedSnapshot.exists){
        portalState.currentProfile = normalizeUserProfile(Object.assign({ uid: user.uid }, refreshedSnapshot.data()))
      }else{
        portalState.currentProfile = normalizeUserProfile(Object.assign({}, portalState.currentProfile || {}, {
          uid: user.uid,
          passwordResetRequired: false,
          updatedAt: updatedAt
        }))
      }
    }else{
      const currentUserId = portalState.currentUser ? portalState.currentUser.uid : ''
      const users = readLocalUsers()
      const targetIndex = users.findIndex(function(entry){
        return entry.id === currentUserId
      })
      if(targetIndex < 0) throw new Error('Account information was not found.')
      if(users[targetIndex].password !== currentPassword) throw new Error('Current password is incorrect.')

      users[targetIndex].password = nextPassword
      users[targetIndex].passwordResetRequired = false
      users[targetIndex].updatedAt = new Date().toISOString()
      writeLocalUsers(users)
      portalState.currentProfile = users[targetIndex]
      portalState.currentUser = buildLocalAuthUser(users[targetIndex])
    }

    portalState.forcePasswordChange = false
    portalState.forcePasswordReset = false
    clearPasswordError()
    clearPasswordFields()

    const backBtn = document.getElementById('password-back-btn')
    const homeBtn = document.getElementById('password-home-btn')
    if(backBtn) backBtn.style.display = ''
    if(homeBtn) homeBtn.style.display = ''

    showToast('鍮꾨?踰덊샇瑜?蹂寃쏀뻽?듬땲??', 'var(--green)')
    showPortalScreen()
  }catch(error){
    setPasswordError(getPasswordChangeErrorMessage(error))
  }
}
