const PORTAL_CLOUD_DOCS = {
  prep: 'prep-session',
  check: 'check-data'
}

const PORTAL_CLOUD_SET_COLLECTIONS = {
  prep: 'portalPrepSets',
  check: 'portalCheckSets'
}

const PORTAL_CLASS_CATALOG_DOC = 'prep-classes'
const PORTAL_PREP_VIDEO_PROGRESS_COLLECTION = 'prepVideoProgress'
const PORTAL_COUNSEL_REQUEST_COLLECTION = 'counselRequests'
const PORTAL_COUNSEL_SLOT_COLLECTION = 'counselSlots'
const PORTAL_COUNSEL_SLOT_MINUTES = 30
const PORTAL_COUNSEL_START_MINUTES = 16 * 60
const PORTAL_COUNSEL_END_MINUTES = (22 * 60) - PORTAL_COUNSEL_SLOT_MINUTES
const PORTAL_STUDY_CAFE_DEFAULT_URL = 'https://study-lab--code-lab-2584c.asia-east1.hosted.app/study-lab'
const PORTAL_STUDY_CAFE_AUTH_REQUEST = 'code-lab-study-auth-request'
const PORTAL_STUDY_CAFE_AUTH_RESPONSE = 'code-lab-study-auth-response'

const PORTAL_ENHANCEMENT_KEYS = {
  contentPrefix: 'rotation_portal_content_v1_',
  issues: 'rotation_portal_question_issues_v1',
  issueHiddenPrefix: 'rotation_portal_hidden_question_issues_v1_',
  prepVideoProgress: 'rotation_portal_prep_video_progress_v1',
  counselRequests: 'rotation_portal_counsel_requests_v1',
  counselSlots: 'rotation_portal_counsel_slots_v1'
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
  'study-cafe-screen': { title: 'STUDY CAFE', sub: 'STUDY LAB 연결' },
  'counsel-screen': { title: 'COUNSEL', sub: '상담 선택' },
  'counsel-history-screen': { title: 'HISTORY', sub: '상담 신청 내역' },
  'counsel-form-screen': { title: 'COUNSEL', sub: '상담 신청' },
  'account-screen': { title: 'CODE LAB', sub: '회원정보' },
  'password-screen': { title: 'CODE LAB', sub: '비밀번호 변경' },
  'admin-portal-screen': { title: 'TOOLS', sub: '허브' },
  'class-screen': { title: 'PREP', sub: '반 변경' },
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
  'study-cafe-screen': ['CODE LAB', 'STUDY CAFE'],
  'counsel-screen': ['CODE LAB', 'COUNSEL'],
  'counsel-history-screen': ['CODE LAB', 'COUNSEL', 'HISTORY'],
  'counsel-form-screen': ['CODE LAB', 'COUNSEL', 'FORM'],
  'account-screen': ['CODE LAB', '회원정보'],
  'password-screen': ['CODE LAB', '비밀번호 변경'],
  'admin-portal-screen': ['CODE LAB', 'TOOLS'],
  'class-screen': ['CODE LAB', 'PREP', '반 변경'],
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

const PORTAL_COUNSEL_OTHER_REASON = '__other__'
const PORTAL_COUNSEL_TYPES = {
  career: {
    key: 'career',
    title: 'CAREER',
    label: '진로상담',
    reasonOptions: [
      '진로를 잘 모르겠어요',
      '내 강점을 알고 싶어요',
      '내가 좋아하는 일을 찾고 싶어요',
      '고등학교 선택이 고민돼요',
      '학과 선택이 고민돼요',
      '과목 선택이 고민돼요',
      '성적에 맞는 진로가 궁금해요',
      '원하는 직업이 있어요',
      '공부 방향이 고민돼요',
      '아직 꿈이 없어요'
    ]
  },
  life: {
    key: 'life',
    title: 'LIFE',
    label: '인생상담',
    reasonOptions: [
      '요즘 마음이 힘들어요',
      '고민이 많아요',
      '스트레스를 많이 받아요',
      '자신감이 없어요',
      '친구 관계가 힘들어요',
      '가족 문제로 힘들어요',
      '공부와 생활의 균형이 어려워요',
      '자꾸 불안해져요',
      '집중이 잘 안 돼요',
      '의욕이 없어요',
      '미래가 걱정돼요',
      '혼자 해결하기 어려워요',
      '누군가와 이야기하고 싶어요',
      '위로가 필요해요'
    ]
  },
  withdrawal: {
    key: 'withdrawal',
    title: 'WITHDRAWAL',
    label: '퇴원상담',
    reasonOptions: [
      '시간이 안 맞아요',
      '공부 방향을 바꿨어요',
      '수업의 난이도가 안 맞아요',
      '수업 방식이 나랑 안 맞아요',
      '성적의 변화가 없어요',
      '학교 공부가 너무 바빠요',
      '집이 멀어요',
      '이사/전학 가요',
      '목표를 이뤄서 그만해요'
    ]
  }
}

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
portalState.currentCounselType = portalState.currentCounselType || ''
portalState.currentCounselEditId = portalState.currentCounselEditId || ''
portalState.currentCounselEditRecord = portalState.currentCounselEditRecord || null
portalState.myCounselRequests = portalState.myCounselRequests || []
portalState.studyCafe = portalState.studyCafe || {
  frameUrl: '',
  frameOrigin: '',
  isLoaded: false,
  isOpen: false,
  windowRef: null,
  lastStatus: '',
  lastError: ''
}
portalState.prepVideoManager = portalState.prepVideoManager || {
  open: false,
  isSaving: false,
  docId: '',
  title: '',
  currentDoc: null,
  status: '업로드할 지문을 선택해 주세요.',
  pendingPassageIndex: -1
}
portalState.prepVideoManager.isSaving = !!portalState.prepVideoManager.isSaving
if(!portalState.prepVideoManager.open){
  portalState.prepVideoManager.status = '유튜브 링크를 입력해 주세요.'
}
portalState.prepVideoProgressModal = portalState.prepVideoProgressModal || {
  open: false,
  isLoading: false,
  docId: '',
  title: '',
  classId: '',
  className: '',
  currentDoc: null,
  students: [],
  progressRows: [],
  status: ''
}
portalState.checkSetEditor = portalState.checkSetEditor || {
  open: false,
  isSaving: false,
  savingScope: '',
  docId: '',
  title: '',
  startDate: '',
  endDate: '',
  currentDoc: null,
  questions: [],
  initialDigest: ''
}
portalState.buttonIconObserver = portalState.buttonIconObserver || null
portalState.buttonIconRefreshHandle = portalState.buttonIconRefreshHandle || 0

const PORTAL_BUTTON_ICON_TEXT = {
  press: '•',
  home: '⌂',
  back: '←',
  refresh: '↻',
  launch: '↗',
  logout: '↘',
  upload: '↑',
  download: '↓',
  edit: '✎',
  delete: '✕',
  confirm: '✓',
  close: '×',
  regrade: '↺',
  class: '▦',
  tools: '◫',
  password: '◇',
  history: '◷',
  issue: '?',
  note: '!',
  expand: '+',
  user: '◎'
}

document.addEventListener('DOMContentLoaded', initPortalEnhancements)

function initPortalEnhancements(){
  bindPortalEnhancementEvents()
  bindPasswordSubmitOverride()
  overrideSharedClassListRenderer()
  setupPortalButtonIconEnhancements()
  window.addEventListener('popstate', handleAppPopState)
  window.addEventListener('message', handleStudyCafeWindowMessage)
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

function setupPortalButtonIconEnhancements(){
  applyPortalButtonIcons(document)
  if(portalState.buttonIconObserver || !document.body || typeof MutationObserver !== 'function') return

  portalState.buttonIconObserver = new MutationObserver(function(mutations){
    for(let index = 0; index < mutations.length; index += 1){
      const mutation = mutations[index]
      if(mutation.type === 'childList' && (mutation.addedNodes.length || mutation.removedNodes.length)){
        schedulePortalButtonIconRefresh()
        return
      }
    }
  })

  portalState.buttonIconObserver.observe(document.body, {
    childList: true,
    subtree: true
  })
}

function schedulePortalButtonIconRefresh(){
  if(portalState.buttonIconRefreshHandle) return
  portalState.buttonIconRefreshHandle = window.requestAnimationFrame(function(){
    portalState.buttonIconRefreshHandle = 0
    applyPortalButtonIcons(document)
  })
}

function applyPortalButtonIcons(root){
  if(!root || typeof root.querySelectorAll !== 'function') return
  const nodes = root.querySelectorAll('button, [role="button"]')
  for(let index = 0; index < nodes.length; index += 1){
    decoratePortalButtonIcon(nodes[index])
  }
}

function decoratePortalButtonIcon(node){
  if(!node || !node.classList) return
  if(node.matches('.app-crumb')){
    removePortalButtonIcon(node)
    return
  }
  if(node.matches('.portal-card')){
    removePortalButtonIcon(node)
    return
  }
  if(node.dataset.uiIconSkip === 'true') return
  if(node.classList.contains('app-chrome-btn')) return
  if(node.classList.contains('load-box')) return

  const iconKey = inferPortalButtonIconKey(node)
  if(!iconKey) return

  const variant = node.matches('.portal-card, .admin-portal-card, .admin-tools-launch') ? 'card' : 'inline'
  const iconText = PORTAL_BUTTON_ICON_TEXT[iconKey] || PORTAL_BUTTON_ICON_TEXT.press
  const host = getPortalButtonIconHost(node, variant)
  if(!host) return

  node.dataset.uiIcon = iconKey
  node.dataset.uiIconVariant = variant
  node.classList.add('ui-button-has-icon')

  let iconNode = null
  for(let index = 0; index < host.children.length; index += 1){
    const child = host.children[index]
    if(child.classList && child.classList.contains('ui-action-icon')){
      iconNode = child
      break
    }
  }

  if(!iconNode){
    iconNode = document.createElement('span')
    iconNode.className = 'ui-action-icon'
    iconNode.setAttribute('aria-hidden', 'true')
    if(variant === 'card'){
      host.appendChild(iconNode)
    }else{
      host.insertBefore(iconNode, host.firstChild)
    }
  }

  iconNode.textContent = iconText
  iconNode.dataset.uiIcon = iconKey
}

function removePortalButtonIcon(node){
  if(!node || !node.classList) return
  const icons = node.querySelectorAll('.ui-action-icon')
  for(let index = 0; index < icons.length; index += 1){
    const icon = icons[index]
    if(icon && icon.parentNode) icon.parentNode.removeChild(icon)
  }
  delete node.dataset.uiIcon
  delete node.dataset.uiIconVariant
  node.classList.remove('ui-button-has-icon')
}

function getPortalButtonIconHost(node, variant){
  if(variant !== 'card' && node.classList.contains('app-drawer-link') && node.firstElementChild){
    return node.firstElementChild
  }
  return node
}

function inferPortalButtonIconKey(node){
  const id = String(node.id || '').toLowerCase()
  const classes = typeof node.className === 'string' ? node.className.toLowerCase() : ''
  const action = String((node.getAttribute && node.getAttribute('data-drawer-action')) || '').toLowerCase()
  const label = getPortalInteractiveButtonLabel(node).toLowerCase()

  if(label.indexOf('tools') >= 0 || id.indexOf('admin-portal-home') >= 0 || (id.indexOf('tools') >= 0 && id.indexOf('entry') >= 0)) return 'tools'
  if(action === 'logout' || label.indexOf('로그아웃') >= 0 || id.indexOf('logout') >= 0) return 'logout'
  if(action === 'home' || label.indexOf('메인') >= 0 || label.indexOf('홈') >= 0 || label === 'home' || id.indexOf('home') >= 0) return 'home'
  if(action === 'account' || label.indexOf('회원정보') >= 0 || id.indexOf('account') >= 0) return 'user'
  if(label.indexOf('이전') >= 0 || label.indexOf('반 목록으로') >= 0 || label.indexOf('상담 선택') >= 0 || id.indexOf('back') >= 0) return 'back'
  if(label.indexOf('새로고침') >= 0 || id.indexOf('refresh') >= 0) return 'refresh'
  if(label.indexOf('비밀번호') >= 0 || id.indexOf('password') >= 0) return 'password'
  if(label.indexOf('반 변경') >= 0 || id.indexOf('change-class') >= 0 || id.indexOf('class-btn') >= 0 || id.indexOf('class-picker') >= 0) return 'class'
  if(label.indexOf('업로드') >= 0 || id.indexOf('upload') >= 0) return 'upload'
  if(label.indexOf('다운로드') >= 0 || label.indexOf('엑셀') >= 0 || label.indexOf('json') >= 0 || id.indexOf('download') >= 0 || id.indexOf('archive') >= 0) return 'download'
  if(label.indexOf('삭제') >= 0 || id.indexOf('delete') >= 0 || id.indexOf('remove') >= 0 || classes.indexOf('danger') >= 0) return 'delete'
  if(label.indexOf('재채점') >= 0 || id.indexOf('regrade') >= 0) return 'regrade'
  if(label.indexOf('수정') >= 0 || label.indexOf('변경') >= 0 || id.indexOf('edit') >= 0 || id.indexOf('rename') >= 0) return 'edit'
  if(label.indexOf('닫기') >= 0 || label.indexOf('취소') >= 0 || id.indexOf('close') >= 0 || id.indexOf('cancel') >= 0) return 'close'
  if(label.indexOf('저장') >= 0 || label.indexOf('제출') >= 0 || label.indexOf('입장') >= 0 || label.indexOf('완료') >= 0 || label.indexOf('반영') >= 0 || label.indexOf('실행') >= 0 || label.indexOf('계속') >= 0 || label.indexOf('보기') >= 0 || id.indexOf('submit') >= 0 || id.indexOf('save') >= 0 || id.indexOf('apply') >= 0 || id.indexOf('continue') >= 0) return 'confirm'
  if(label.indexOf('현황') >= 0 || label.indexOf('history') >= 0 || id.indexOf('history') >= 0 || id.indexOf('progress') >= 0) return 'history'
  if(label.indexOf('질문') >= 0 || label.indexOf('문의') >= 0 || label.indexOf('이슈') >= 0 || classes.indexOf('issue') >= 0) return 'issue'
  if(label.indexOf('오답노트') >= 0) return 'note'
  if(label.indexOf('펼치기') >= 0 || label.indexOf('더 보기') >= 0 || id.indexOf('expand') >= 0 || classes.indexOf('toggle') >= 0) return 'expand'
  if(id.indexOf('tools') >= 0 || action === 'admin') return 'tools'
  if(node.matches('.portal-card, .admin-portal-card, .admin-tools-launch')) return 'launch'
  return 'press'
}

function getPortalInteractiveButtonLabel(node){
  const parts = []
  const ariaLabel = String((node.getAttribute && node.getAttribute('aria-label')) || '').trim()
  if(ariaLabel) parts.push(ariaLabel)

  if(typeof document.createTreeWalker !== 'function' || typeof NodeFilter === 'undefined'){
    const fallback = String(node.textContent || '').replace(/\s+/g, ' ').trim()
    return (parts.join(' ') + ' ' + fallback).replace(/\s+/g, ' ').trim()
  }

  const walker = document.createTreeWalker(
    node,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(candidate){
        if(candidate.nodeType === 1){
          return candidate.classList && candidate.classList.contains('ui-action-icon')
            ? NodeFilter.FILTER_REJECT
            : NodeFilter.FILTER_SKIP
        }
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )

  let current = walker.nextNode()
  while(current){
    const value = String(current.nodeValue || '').replace(/\s+/g, ' ').trim()
    if(value) parts.push(value)
    current = walker.nextNode()
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim()
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

  Array.from(document.querySelectorAll('[data-counsel-type]')).forEach(function(button){
    button.addEventListener('click', function(){
      openCounselFormPortal(button.dataset.counselType || '')
    })
  })
  bindClick('portal-study-cafe-btn', openStudyCafePortal)
  bindClick('study-cafe-back-btn', showPortalScreen)
  const studyCafeFrame = document.getElementById('study-cafe-frame')
  if(studyCafeFrame){
    studyCafeFrame.addEventListener('load', handleStudyCafeFrameLoad)
  }
  bindClick('counsel-history-tab-btn', openCounselHistoryTab)
  bindClick('counsel-history-back-btn', openCounselPortal)
  bindClick('counsel-history-home-btn', showPortalScreen)

  bindClick('counsel-form-back-btn', openCounselPortal)
  bindClick('counsel-form-home-btn', showPortalScreen)
  bindClick('counsel-submit-btn', submitCounselRequest)
  const counselReasonSelect = document.getElementById('counsel-reason-select')
  if(counselReasonSelect){
    counselReasonSelect.addEventListener('change', syncCounselReasonOtherVisibility)
  }
  const counselDateTimeInput = document.getElementById('counsel-datetime-input')
  if(counselDateTimeInput){
    counselDateTimeInput.addEventListener('change', function(){
      validateCounselDateTimeSelection(true)
    })
    counselDateTimeInput.addEventListener('input', function(){
      validateCounselDateTimeSelection(false)
    })
  }
  const counselDateInput = document.getElementById('counsel-date-input')
  if(counselDateInput){
    counselDateInput.addEventListener('change', function(){
      syncCounselDateTimeValue()
      validateCounselDateTimeSelection(true)
    })
    counselDateInput.addEventListener('input', function(){
      syncCounselDateTimeValue()
      validateCounselDateTimeSelection(false)
    })
  }
  const counselTimeSelect = document.getElementById('counsel-time-select')
  if(counselTimeSelect){
    counselTimeSelect.addEventListener('change', function(){
      syncCounselDateTimeValue()
      validateCounselDateTimeSelection(true)
    })
  }

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
  bindClick('prep-admin-upload-btn', createPortalPrepVideoByPrompt)
  bindClick('prep-passage-admin-upload-btn', createPortalPrepVideoByPrompt)
  bindClick('prep-passage-admin-class-btn', openPrepClassPicker)
  bindClick('check-admin-class-btn', openCheckClassPicker)
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

  bindClick('prep-video-manager-backdrop', function(){
    closePortalPrepVideoManager()
  })
  bindClick('prep-video-manager-close-btn', function(){
    closePortalPrepVideoManager()
  })
  bindClick('prep-video-manager-cancel-btn', function(){
    closePortalPrepVideoManager()
  })

  bindClick('prep-video-progress-backdrop', function(){
    closePortalPrepVideoProgressModal()
  })
  bindClick('prep-video-progress-close-btn', function(){
    closePortalPrepVideoProgressModal()
  })
  bindClick('prep-video-progress-cancel-btn', function(){
    closePortalPrepVideoProgressModal()
  })

  const prepVideoManagerList = document.getElementById('prep-video-manager-list')
  if(prepVideoManagerList && prepVideoManagerList.dataset.bound !== 'true'){
    prepVideoManagerList.dataset.bound = 'true'
    prepVideoManagerList.addEventListener('keydown', handlePortalPrepVideoManagerKeydown)
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
  const checkSetList = document.getElementById('check-set-list')
  if(checkSetList && checkSetList.dataset.inlineEditorBound !== 'true'){
    checkSetList.dataset.inlineEditorBound = 'true'
    checkSetList.addEventListener('input', handlePortalManagedCheckSetEditorFieldChange)
    checkSetList.addEventListener('change', handlePortalManagedCheckSetEditorFieldChange)
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

function handlePortalPrepVideoManagerKeydown(event){
  const target = event && event.target
  if(!target || !target.classList || !target.classList.contains('prep-video-manager-input')) return
  if(event.key !== 'Enter') return
  event.preventDefault()

  const passageIndex = Number(target.getAttribute('data-passage-index'))
  if(Number.isInteger(passageIndex) && passageIndex >= 0){
    savePortalPrepPassageVideoUrl(passageIndex)
  }
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

function openPrepClassPicker(){
  if(portalState.currentUser){
    portalState.classSelectionReturnScreen = 'passage-screen'
  }
  showClassScreen()
}

function runDrawerAction(action){
  closeAppDrawer()
  if(action === 'home') return showPortalScreen()
  if(action === 'prep') return openPrepPortal()
  if(action === 'check') return openCheckPortal()
  if(action === 'counsel') return openCounselPortal()
  if(action === 'study-cafe') return openStudyCafePortal()
  if(action === 'admin') return openAdminPortal()
  if(action === 'account') return openAccountScreen()
  if(action === 'password') return openPasswordScreen(false)
  if(action === 'refresh') return refreshPortalData()
  if(action === 'logout') return logoutPortal()
}

function getStudyCafeEmbedConfig(){
  const portalConfig = window.ROTATION_PORTAL_CONFIG || {}
  const rawUrl = String(portalConfig.studyLabUrl || PORTAL_STUDY_CAFE_DEFAULT_URL || '').trim()
  if(!rawUrl) return null
  try{
    const url = new URL(rawUrl, window.location.href)
    url.searchParams.set('embed', 'code-lab')
    url.searchParams.set('parentOrigin', window.location.origin)
    return {
      url: url.toString(),
      origin: url.origin
    }
  }catch(error){
    console.warn('study cafe url parse failed:', error && error.message ? error.message : error)
    return null
  }
}

function getStudyCafeFrame(){
  return document.getElementById('study-cafe-frame')
}

function setStudyCafeStatus(message, isError, state){
  const node = document.getElementById('study-cafe-status')
  const normalizedMessage = String(message || '').trim()
  const normalizedState = String(state || '').trim().toLowerCase()
  const resolvedState = normalizedState || (isError ? 'error' : 'connected')
  const shouldHide = !normalizedMessage || resolvedState === 'connected'
  let label = '연결 대기'

  if(resolvedState === 'loading'){
    label = '연결 중'
  }else if(resolvedState === 'connected'){
    label = '연결됨'
  }else if(resolvedState === 'error'){
    label = '연결 실패'
  }

  if(node){
    node.textContent = normalizedMessage
    node.classList.toggle('hidden', shouldHide)
    node.dataset.state = resolvedState
    node.title = normalizedMessage
    node.setAttribute('aria-label', normalizedMessage)
  }

  portalState.studyCafe.lastStatus = normalizedMessage
  portalState.studyCafe.lastError = isError ? normalizedMessage : ''
}

function setStudyCafeFrameVisibility(shouldShow){
  const frame = getStudyCafeFrame()
  if(frame) frame.classList.toggle('hidden', !shouldShow)
}

function resetStudyCafeEmbed(options){
  const settings = options && typeof options === 'object' ? options : {}
  portalState.studyCafe.frameUrl = ''
  portalState.studyCafe.frameOrigin = ''
  portalState.studyCafe.isLoaded = false
  portalState.studyCafe.isOpen = false
  if(portalState.studyCafe.windowRef && portalState.studyCafe.windowRef.closed){
    portalState.studyCafe.windowRef = null
  }
  portalState.studyCafe.lastStatus = ''
  portalState.studyCafe.lastError = ''
  const frame = getStudyCafeFrame()
  if(frame && settings.clearFrame === true){
    frame.src = 'about:blank'
  }
  setStudyCafeFrameVisibility(false)
  setStudyCafeStatus('STUDY LAB 연결을 준비하는 중입니다.', false, 'idle')
}

function isStudyCafeFirebaseBridgeAvailable(){
  return !!(
    portalState.firebaseEnabled &&
    portalState.currentUser &&
    typeof portalState.currentUser.getIdToken === 'function'
  )
}

function showStudyCafeLaunchFallback(message, isError, state){
  updatePortalUserCard()
  activatePortalScreen('study-cafe-screen')
  if(typeof window.scrollTo === 'function'){
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
  setStudyCafeFrameVisibility(false)
  setStudyCafeStatus(message, !!isError, state || (isError ? 'error' : 'loading'))
}

function openStudyCafePortal(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }

  updatePortalUserCard()
  activatePortalScreen('study-cafe-screen')
  if(typeof window.scrollTo === 'function'){
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const config = getStudyCafeEmbedConfig()
  portalState.studyCafe.isOpen = true

  if(!config){
    portalState.studyCafe.frameUrl = ''
    portalState.studyCafe.frameOrigin = ''
    portalState.studyCafe.isLoaded = false
    showStudyCafeLaunchFallback('STUDY LAB 주소가 설정되지 않았습니다. firebase-config.js의 studyLabUrl을 확인해 주세요.', true, 'error')
    return
  }

  portalState.studyCafe.frameUrl = config.url
  portalState.studyCafe.frameOrigin = config.origin

  if(!isStudyCafeFirebaseBridgeAvailable()){
    portalState.studyCafe.isLoaded = false
    showStudyCafeLaunchFallback('STUDY CAFE는 Firebase 로그인 사용자만 이용할 수 있습니다. 현재는 운영용 Firebase 세션이 확인되지 않습니다.', true, 'error')
    return
  }

  const frame = getStudyCafeFrame()
  if(!frame){
    setStudyCafeStatus('STUDY LAB 프레임을 찾지 못했습니다.', true, 'error')
    return
  }

  setStudyCafeFrameVisibility(true)
  setStudyCafeStatus('STUDY LAB 화면을 불러오는 중입니다.', false, 'loading')
  if(frame.src !== config.url){
    portalState.studyCafe.isLoaded = false
    frame.src = config.url
    return
  }

  if(portalState.studyCafe.isLoaded){
    setStudyCafeStatus('STUDY LAB이 열려 있습니다. 입장 준비 화면에서 메인룸 입장을 진행해 주세요.', false, 'connected')
  }
}

function handleStudyCafeFrameLoad(){
  portalState.studyCafe.isLoaded = true
  setStudyCafeStatus('STUDY LAB 화면이 열렸습니다. Firebase 권한 요청을 기다리는 중입니다.', false, 'loading')
}

async function buildStudyCafeAuthResponsePayload(requestId){
  const profile = portalState.currentProfile || {}
  const authUser = portalState.currentUser || {}
  const payload = {
    type: PORTAL_STUDY_CAFE_AUTH_RESPONSE,
    requestId: String(requestId || '').trim(),
    ok: false,
    token: null,
    name: String(profile.name || authUser.displayName || '').trim() || null,
    email: String(profile.email || authUser.email || '').trim() || null,
    role: String(profile.role || '').trim().toLowerCase() === 'admin' ? 'admin' : 'student',
    adminScope: null,
    error: ''
  }

  const normalizedAdminScope = String(profile.adminScope || '').trim().toLowerCase()
  if(normalizedAdminScope === 'assigned' || normalizedAdminScope === 'all'){
    payload.adminScope = normalizedAdminScope
  }

  if(!isStudyCafeFirebaseBridgeAvailable()){
    payload.error = 'CODE LAB Firebase 로그인 상태를 확인할 수 없습니다.'
    return payload
  }

  try{
    let tokenResult = null
    if(typeof authUser.getIdTokenResult === 'function'){
      tokenResult = await authUser.getIdTokenResult(true)
    }
    const token = tokenResult && tokenResult.token ? tokenResult.token : await authUser.getIdToken()
    if(!token){
      payload.error = 'Firebase ID token을 가져오지 못했습니다.'
      return payload
    }
    const claims = tokenResult && tokenResult.claims ? tokenResult.claims : {}
    const claimRole = claims.role === 'admin' ? 'admin' : 'student'
    const claimAdminScope = claims.adminScope === 'all' || claims.adminScope === 'assigned'
      ? claims.adminScope
      : null
    payload.ok = true
    payload.token = token
    payload.role = claimRole
    payload.adminScope = claimRole === 'admin' ? (claimAdminScope || 'assigned') : null
    payload.error = ''
    return payload
  }catch(error){
    payload.error = String(error && error.message || error || 'Firebase ID token error')
    return payload
  }
}

async function handleStudyCafeWindowMessage(event){
  const data = event && event.data
  if(!data || data.type !== PORTAL_STUDY_CAFE_AUTH_REQUEST){
    return
  }

  const frame = getStudyCafeFrame()
  const frameSourceMatches = !!(frame && frame.contentWindow && event.source === frame.contentWindow)
  const popupWindow = portalState.studyCafe && portalState.studyCafe.windowRef
  const popupSourceMatches = !!(popupWindow && !popupWindow.closed && event.source === popupWindow)
  if(!frameSourceMatches && !popupSourceMatches){
    return
  }

  const requestId = String(data.requestId || '').trim()
  if(!requestId){
    return
  }

  const expectedOrigin = String(portalState.studyCafe.frameOrigin || '').trim()
  if(expectedOrigin && event.origin && event.origin !== expectedOrigin){
    return
  }

  const payload = await buildStudyCafeAuthResponsePayload(requestId)
  if(payload.ok){
    setStudyCafeStatus('Firebase 로그인 정보를 전달했습니다.', false, 'connected')
  }else if(getCurrentActiveScreenId() === 'study-cafe-screen'){
    setStudyCafeStatus(payload.error || 'STUDY LAB 인증 정보 전달에 실패했습니다.', true, 'error')
  }

  event.source.postMessage(payload, event.origin || expectedOrigin || '*')
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

function buildCompactPrepBreadcrumb(screenId){
  const parts = ['HOME', 'PREP']
  if(screenId === 'class-screen'){
    parts.push('반 변경')
    return parts
  }
  if(screenId === 'class-auth-screen'){
    const pendingClass = getPendingPrepClass()
    if(pendingClass && pendingClass.name) parts.push(pendingClass.name)
    parts.push('입장 인증')
    return parts
  }
  if(screenId === 'study-menu-screen' || screenId === 'study-screen'){
    const currentPassageEntry = getCurrentPrepPassage()
    if(currentPassageEntry && currentPassageEntry.title) parts.push(currentPassageEntry.title)
  }
  return parts
}

function buildPrepBreadcrumb(screenId){
  return buildCompactPrepBreadcrumb(screenId)
  const parts = ['CODE LAB', 'PREP']
  const currentClass = typeof getCurrentClass === 'function' ? getCurrentClass() : null
  const currentSet = typeof getCurrentStudySet === 'function' ? getCurrentStudySet() : null
  const currentPassageEntry = getCurrentPrepPassage()
  const currentSection = getCurrentPrepSection()
  const pendingClass = getPendingPrepClass()

  if(screenId === 'class-screen'){
    parts.push('반 변경')
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

function buildCompactCheckBreadcrumb(screenId){
  const parts = ['HOME', 'CHECK']
  if(screenId === 'check-set-screen' && portalState.currentCheckSet && portalState.currentCheckSet.title){
    parts.push(portalState.currentCheckSet.title)
  }
  return parts
}

function buildCheckBreadcrumb(screenId){
  return buildCompactCheckBreadcrumb(screenId)
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
    parts.push('반 변경')
    return parts
  }

  if(screenId === 'class-auth-screen'){
    if(pendingClass && pendingClass.name) parts.push(pendingClass.name)
    parts.push('입장 인증')
    return parts
  }

  return parts
}

function buildCounselBreadcrumb(screenId){
  const parts = ['HOME', 'COUNSEL']
  if(screenId === 'counsel-history-screen'){
    parts.push('HISTORY')
    return parts
  }
  if(screenId === 'counsel-form-screen'){
    const typeInfo = getCounselTypeInfo(portalState.currentCounselType || '')
    parts.push(typeInfo && typeInfo.title ? typeInfo.title : 'COUNSEL')
    return parts
  }
  return parts
}

function getAppBreadcrumb(screenId){
  if((screenId === 'class-screen' || screenId === 'class-auth-screen') && isCheckClassSelectionContext()){
    return buildCheckClassSelectionBreadcrumb(screenId)
  }
  if(screenId === 'counsel-screen' || screenId === 'counsel-history-screen' || screenId === 'counsel-form-screen'){
    return buildCounselBreadcrumb(screenId)
  }
  if(PREP_SCREEN_IDS.indexOf(screenId) >= 0){
    return buildPrepBreadcrumb(screenId)
  }
  if(screenId === 'check-screen' || screenId === 'check-set-screen'){
    return buildCheckBreadcrumb(screenId)
  }
  if(screenId === 'portal-screen') return ['HOME']
  if(screenId === 'study-cafe-screen') return ['HOME', 'STUDY CAFE']
  if(screenId === 'account-screen') return ['HOME', 'MY INFO']
  if(screenId === 'password-screen') return ['HOME', 'MY INFO', 'PASSWORD']
  if(screenId === 'admin-portal-screen') return ['HOME', 'ADMIN', 'TOOLS']
  if(screenId === 'admin-screen') return ['HOME', 'ADMIN']
  if(screenId === 'account-screen') return ['CODE LAB', 'HOME', '회원정보']
  if(screenId === 'password-screen') return ['CODE LAB', 'HOME', '비밀번호 변경']
  if(screenId === 'admin-portal-screen') return ['CODE LAB', 'ADMIN', 'TOOLS']
  if(screenId === 'admin-screen') return ['HOME', 'ADMIN']
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
  document.body.classList.toggle('app-screen-study-cafe', shouldShow && screenId === 'study-cafe-screen')

  breadcrumbNode.textContent = ''
  renderAppChromeBreadcrumb(titleNode, screenId)
  subNode.textContent = ''
  queueAppChromeLayoutSync()
}

function renderAppChromeBreadcrumb(container, screenId){
  const labels = getAppBreadcrumb(screenId).map(function(label){
    return String(label || '').trim()
  }).filter(Boolean)
  const safeLabels = labels.length ? labels : ['HOME']
  container.textContent = ''
  safeLabels.forEach(function(label, index){
    if(index > 0){
      const separator = document.createElement('span')
      separator.className = 'app-crumb-separator'
      separator.textContent = '>'
      container.appendChild(separator)
    }
    const isLast = index === safeLabels.length - 1
    if(isLast){
      const current = document.createElement('span')
      current.className = 'app-crumb app-crumb-current'
      current.dataset.uiIconSkip = 'true'
      appendAppChromeBreadcrumbLabel(current, label)
      container.appendChild(current)
      return
    }
    const button = document.createElement('button')
    button.className = 'app-crumb app-crumb-button'
    button.type = 'button'
    button.dataset.uiIconSkip = 'true'
    appendAppChromeBreadcrumbLabel(button, label)
    button.addEventListener('click', function(){
      navigateAppChromeBreadcrumb(screenId, index, label)
    })
    container.appendChild(button)
  })
}

function appendAppChromeBreadcrumbLabel(node, label){
  const text = String(label || '').trim()
  if(!node || !text) return
  if(text.toUpperCase() === 'HOME'){
    const icon = document.createElement('span')
    icon.className = 'app-crumb-home-icon'
    icon.setAttribute('aria-hidden', 'true')
    icon.textContent = PORTAL_BUTTON_ICON_TEXT.home || '⌂'
    node.appendChild(icon)
  }
  node.appendChild(document.createTextNode(text))
}

function navigateAppChromeBreadcrumb(screenId, index, label){
  const target = String(label || '').trim().toUpperCase()
  if(!target) return
  if(target === 'HOME' || target === 'CODE LAB'){
    showPortalScreen()
    return
  }
  if(target === 'PREP'){
    if(PREP_SCREEN_IDS.indexOf(screenId) >= 0 && typeof showPassageScreen === 'function'){
      showPassageScreen()
      return
    }
    openPrepPortal()
    return
  }
  if(target === 'CHECK'){
    openCheckPortal()
    return
  }
  if(target === 'COUNSEL'){
    openCounselPortal()
    return
  }
  if(target === 'STUDY CAFE'){
    openStudyCafePortal()
    return
  }
  if(target === 'ADMIN'){
    openAdminPortal()
    return
  }
  if(target === 'TOOLS' && typeof openToolsPortal === 'function'){
    openToolsPortal()
    return
  }
  if(label === 'MY INFO'){
    openAccountScreen()
    return
  }
  if(label === 'PASSWORD'){
    openPasswordScreen(false)
    return
  }
  if(label === '회원정보'){
    openAccountScreen()
    return
  }
  if(label === '비밀번호 변경'){
    openPasswordScreen(false)
  }
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
  if(screenId === 'counsel-form-screen'){
    route.counselType = portalState.currentCounselType || ''
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
  if(route.screenId === 'study-cafe-screen') return openStudyCafePortal()
  if(route.screenId === 'counsel-screen') return openCounselPortal()
  if(route.screenId === 'counsel-history-screen') return openCounselHistoryTab()
  if(route.screenId === 'counsel-form-screen') return openCounselFormPortal(route.counselType || 'career')
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
  if(typeof stopPrepVideoPlaybackBeforeScreenChange === 'function'){
    stopPrepVideoPlaybackBeforeScreenChange(screenId)
  }
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
    if(isPortalAdmin()){
      activateScreen('passage-screen')
      renderClassSummary()
      renderPassageScreen()
      syncPortalAdminSetPanels('passage-screen')
    }else{
      showNoSessionState()
    }
    updateAppChrome(getCurrentActiveScreenId())
    return
  }

  if(isPortalAdmin()){
    if(typeof ensureScopedAdminPrepSelection === 'function'){
      ensureScopedAdminPrepSelection()
    }
    showPassageScreen()
    syncPortalAdminSetPanels('passage-screen')
    return
  }

  if(typeof ensureStudentPrepSelection === 'function'){
    ensureStudentPrepSelection()
  }
  showPassageScreen()
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
  await syncPrepContentAfterLogin(false)
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
  setHeadingText('#check-set-screen .hd h1', checkSet.title || 'CHECK')
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
    const questionTitle = '문항 ' + displayNumber
    const promptText = String(question.prompt || '').trim()
    const shouldShowPrompt = !!promptText && promptText !== questionTitle
    const resultClass = submittedAnswer ? ('check-result show ' + (submittedAnswer.isCorrect ? 'correct' : 'wrong')) : 'check-result'

    return '' +
      '<section class="group check-form-card">' +
        '<div class="check-question-row">' +
          '<div class="check-question-copy">' +
            '<div class="check-question-title">' + questionTitle + '</div>' +
            (shouldShowPrompt ? '<div class="check-question-prompt">' + escapeHtml(promptText) + '</div>' : '') +
          '</div>' +
          '<div class="check-answer-box">' +
            renderCheckAnswerField(question, selectedAnswer, !!submittedAnswer) +
          '</div>' +
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
        const currentValue = getCurrentCheckDraftAnswer(questionId) || getChoiceGroupAnswer(group)
        const nextValue = currentValue === value ? '' : value
        setCurrentCheckDraftAnswer(questionId, nextValue)
        group.querySelectorAll('.check-choice-btn').forEach(function(node){
          node.classList.remove('active')
        })
        if(nextValue) button.classList.add('active')
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
    return String(entry.questionId || '') === String(question.id || '') && normalizeQuestionIssueStatus(entry) === 'open'
  }) || null
  const buttonClass = existing ? 'check-question-issue-btn done' : 'check-question-issue-btn'
  const buttonText = existing ? '질문 접수됨' : '질문 남기기'
  return '' +
    '<div class="check-result-tools">' +
      '<button class="' + buttonClass + '" type="button" onclick="submitCheckQuestionIssue(\'' + escapeJs(question.id) + '\')">' +
        escapeHtml(buttonText) +
      '</button>' +
    '</div>'
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
    portalState.currentCheckFilter = 'submitted'
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

  const existing = portalState.currentQuestionIssues.find(function(entry){
    return String(entry && entry.questionId || '') === String(questionId || '') && normalizeQuestionIssueStatus(entry) === 'open'
  }) || null
  if(existing){
    const canceledAt = new Date().toISOString()
    const canceledBy = profile.name || profile.loginId || profile.studentId || (portalState.currentUser && portalState.currentUser.email) || 'student'
    const didSave = await updateQuestionIssueRecord(existing.id, {
      status: 'resolved',
      resolvedAt: canceledAt,
      resolvedBy: canceledBy,
      canceledAt: canceledAt,
      canceledBy: canceledBy
    })
    if(!didSave){
      showToast('질문 접수 취소에 실패했습니다.', 'var(--red)')
      return
    }

    portalState.currentQuestionIssues = await fetchMyQuestionIssues(checkSet)
    renderCheckForm(checkSet, portalState.currentCheckSubmission)
    showToast('질문 접수를 취소했습니다.', 'var(--green)')
    return
  }

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
    status: 'open',
    resolvedAt: '',
    resolvedBy: '',
    canceledAt: '',
    canceledBy: ''
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
  showToast('질문이 접수됐습니다.', 'var(--green)')
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

function normalizeCounselType(value){
  const key = String(value || '').trim().toLowerCase()
  return PORTAL_COUNSEL_TYPES[key] ? key : 'career'
}

function getCounselTypeInfo(value){
  return PORTAL_COUNSEL_TYPES[normalizeCounselType(value)]
}

function normalizeCounselSubjectList(values){
  const allowed = ['영어', '수학', '과학']
  return Array.from(new Set((Array.isArray(values) ? values : []).map(function(value){
    return String(value || '').trim()
  }).filter(function(value){
    return allowed.indexOf(value) >= 0
  })))
}

function buildCounselTimeOptionsHtml(){
  const options = ['<option value="">시간 선택</option>']
  for(let minutes = PORTAL_COUNSEL_START_MINUTES; minutes <= PORTAL_COUNSEL_END_MINUTES; minutes += PORTAL_COUNSEL_SLOT_MINUTES){
    const hourText = String(Math.floor(minutes / 60)).padStart(2, '0')
    const minuteText = String(minutes % 60).padStart(2, '0')
    const value = hourText + ':' + minuteText
    options.push('<option value="' + value + '">' + value + '</option>')
  }
  return options.join('')
}

function buildCounselRequestDocId(userId){
  const safeUserId = sanitizeId(String(userId || '').trim()) || 'user'
  return safeUserId + '__' + Date.now() + '__' + Math.random().toString(36).slice(2, 8)
}

function getCurrentCounselUserId(){
  const profile = portalState.currentProfile || {}
  const authUser = portalState.currentUser || {}
  return String(authUser.uid || profile.uid || profile.id || '').trim()
}

function setCounselFormStatus(message, isError){
  const node = document.getElementById('counsel-form-status')
  if(!node) return
  node.textContent = String(message || '').trim()
  node.style.color = isError ? 'var(--red)' : 'var(--ink2)'
}

function openCounselFormPortal(type){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  const typeInfo = getCounselTypeInfo(type)
  portalState.currentCounselType = typeInfo.key
  portalState.currentCounselEditId = ''
  portalState.currentCounselEditRecord = null
  updatePortalUserCard()
  renderCounselForm(typeInfo)
  activatePortalScreen('counsel-form-screen')
}

function renderCounselForm(typeInfo, existingRecord){
  const info = typeInfo || getCounselTypeInfo(portalState.currentCounselType)
  const record = existingRecord || null
  const isEditMode = !!record
  setElementTextSafe('counsel-form-title', info.title)
  setElementTextSafe('counsel-form-heading', info.label + (isEditMode ? ' 수정서' : ' 신청서'))
  setElementTextSafe('counsel-form-type-badge', info.title)
  const reasonSelect = document.getElementById('counsel-reason-select')
  const reasonOtherInput = document.getElementById('counsel-reason-other-input')
  const dateInput = document.getElementById('counsel-date-input')
  const timeSelect = document.getElementById('counsel-time-select')
  const datetimeInput = document.getElementById('counsel-datetime-input')
  const contentInput = document.getElementById('counsel-content-input')
  const submitButton = document.getElementById('counsel-submit-btn')
  if(reasonSelect){
    const options = Array.isArray(info.reasonOptions) ? info.reasonOptions : []
    reasonSelect.innerHTML = '<option value="">상담사유 선택</option>' +
      options.map(function(option){
        return '<option value="' + escapeHtml(option) + '">' + escapeHtml(option) + '</option>'
      }).join('') +
      '<option value="' + PORTAL_COUNSEL_OTHER_REASON + '">기타(직접입력)</option>'
    reasonSelect.value = ''
  }
  if(reasonOtherInput){
    reasonOtherInput.value = ''
    reasonOtherInput.classList.add('hidden')
  }
  if(dateInput) dateInput.value = ''
  if(timeSelect){
    timeSelect.innerHTML = buildCounselTimeOptionsHtml()
    timeSelect.value = ''
  }
  if(datetimeInput) datetimeInput.value = ''
  if(contentInput) contentInput.value = ''
  resetCounselWithdrawalFields(info.key === 'withdrawal')
  if(submitButton) submitButton.textContent = isEditMode ? '상담 수정 저장' : '상담 신청 제출'
  if(record) applyCounselRequestToForm(record, info)
  validateCounselDateTimeSelection(false)
  setCounselFormStatus('', false)
}

function splitCounselRequestedAt(value){
  const raw = String(value || '').trim()
  if(!raw) return { date: '', time: '' }
  if(raw.indexOf('T') >= 0){
    return {
      date: raw.slice(0, 10),
      time: raw.slice(11, 16)
    }
  }
  const date = new Date(raw)
  if(Number.isNaN(date.getTime())) return { date: '', time: '' }
  return {
    date: [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-'),
    time: [
      String(date.getHours()).padStart(2, '0'),
      String(date.getMinutes()).padStart(2, '0')
    ].join(':')
  }
}

function setCounselSubjectChecks(name, values){
  const selected = normalizeCounselSubjectList(values)
  Array.from(document.querySelectorAll('input[name="' + name + '"]')).forEach(function(input){
    input.checked = selected.indexOf(String(input.value || '').trim()) >= 0
  })
}

function applyCounselRequestToForm(record, typeInfo){
  const info = typeInfo || getCounselTypeInfo(record && record.type)
  const reasonSelect = document.getElementById('counsel-reason-select')
  const reasonOtherInput = document.getElementById('counsel-reason-other-input')
  const dateInput = document.getElementById('counsel-date-input')
  const timeSelect = document.getElementById('counsel-time-select')
  const contentInput = document.getElementById('counsel-content-input')
  const reasonChoice = String(record && record.reasonChoice || '').trim()
  const reason = String(record && record.reason || '').trim()
  const options = Array.isArray(info.reasonOptions) ? info.reasonOptions : []
  if(reasonSelect){
    if(options.indexOf(reasonChoice) >= 0){
      reasonSelect.value = reasonChoice
    }else if(options.indexOf(reason) >= 0){
      reasonSelect.value = reason
    }else{
      reasonSelect.value = PORTAL_COUNSEL_OTHER_REASON
    }
  }
  if(reasonOtherInput){
    const isOther = reasonSelect && reasonSelect.value === PORTAL_COUNSEL_OTHER_REASON
    reasonOtherInput.classList.toggle('hidden', !isOther)
    reasonOtherInput.value = isOther ? reason : ''
  }
  const parts = splitCounselRequestedAt(record && record.requestedAt)
  if(dateInput) dateInput.value = parts.date
  if(timeSelect) timeSelect.value = parts.time
  syncCounselDateTimeValue()
  if(contentInput) contentInput.value = String(record && record.content || '').trim()
  setCounselSubjectChecks('counsel-current-subjects', record && record.currentSubjects)
  setCounselSubjectChecks('counsel-withdrawal-subjects', record && record.withdrawalSubjects)
}

function resetCounselWithdrawalFields(shouldShow){
  const panel = document.getElementById('counsel-withdrawal-fields')
  if(panel) panel.classList.toggle('hidden', !shouldShow)
  const notice = document.getElementById('counsel-withdrawal-notice')
  if(notice) notice.classList.toggle('hidden', !shouldShow)
  Array.from(document.querySelectorAll('input[name="counsel-current-subjects"], input[name="counsel-withdrawal-subjects"]')).forEach(function(input){
    input.checked = false
  })
}

function getCheckedCounselSubjects(name){
  return normalizeCounselSubjectList(Array.from(document.querySelectorAll('input[name="' + name + '"]:checked')).map(function(input){
    return input.value
  }))
}

function syncCounselReasonOtherVisibility(){
  const reasonSelect = document.getElementById('counsel-reason-select')
  const reasonOtherInput = document.getElementById('counsel-reason-other-input')
  if(!reasonSelect || !reasonOtherInput) return
  const shouldShow = String(reasonSelect.value || '') === PORTAL_COUNSEL_OTHER_REASON
  reasonOtherInput.classList.toggle('hidden', !shouldShow)
  if(!shouldShow){
    reasonOtherInput.value = ''
    return
  }
  reasonOtherInput.focus()
}

function syncCounselDateTimeValue(){
  const dateInput = document.getElementById('counsel-date-input')
  const timeSelect = document.getElementById('counsel-time-select')
  const datetimeInput = document.getElementById('counsel-datetime-input')
  if(!datetimeInput) return ''
  const dateValue = String(dateInput && dateInput.value || '').trim()
  const timeValue = String(timeSelect && timeSelect.value || '').trim()
  const combined = dateValue && timeValue ? (dateValue + 'T' + timeValue) : ''
  datetimeInput.value = combined
  return combined
}

function getCounselRequestedAtValue(){
  return syncCounselDateTimeValue()
}

function getCounselDateTimeValidationMessage(value){
  const raw = String(value || '').trim()
  if(!raw) return ''
  const date = new Date(raw)
  if(Number.isNaN(date.getTime())) return '상담날짜시간을 다시 선택해 주세요.'
  const day = date.getDay()
  if(day === 0 || day === 6) return '상담은 평일(월~금)에만 신청할 수 있습니다.'
  const totalMinutes = (date.getHours() * 60) + date.getMinutes()
  const startMinutes = PORTAL_COUNSEL_START_MINUTES
  const endMinutes = PORTAL_COUNSEL_END_MINUTES
  if(totalMinutes < startMinutes || totalMinutes > endMinutes){
    return '상담은 평일 16:00~21:30 시작 시간만 선택할 수 있습니다.'
  }
  if(date.getMinutes() % PORTAL_COUNSEL_SLOT_MINUTES !== 0){
    return '상담은 30분 단위로만 선택할 수 있습니다.'
  }
  return ''
}

function validateCounselDateTimeSelection(showToastMessage){
  const input = document.getElementById('counsel-datetime-input')
  const help = document.getElementById('counsel-datetime-help')
  if(!input) return true
  const message = getCounselDateTimeValidationMessage(getCounselRequestedAtValue())
  input.setCustomValidity(message)
  if(help){
    help.textContent = message || ''
    help.classList.toggle('is-error', !!message)
  }
  if(message && showToastMessage) showToast(message, 'var(--red)')
  return !message
}

function parseCounselRequestedAt(value){
  const raw = String(value || '').trim()
  if(!raw) return null
  const date = new Date(raw)
  return Number.isNaN(date.getTime()) ? null : date
}

function getCounselSlotStartMs(value){
  const date = parseCounselRequestedAt(value)
  return date ? date.getTime() : NaN
}

function getCounselSlotEndMs(value){
  const startMs = getCounselSlotStartMs(value)
  return Number.isFinite(startMs) ? startMs + (PORTAL_COUNSEL_SLOT_MINUTES * 60 * 1000) : NaN
}

function isCounselRequestOpen(entry){
  const raw = String(entry && entry.status || 'open').trim().toLowerCase()
  return raw !== 'completed' && raw !== 'done' && raw !== 'resolved' && raw !== 'closed' && raw !== 'canceled' && raw !== 'cancelled'
}

function doCounselSlotsOverlap(leftRequestedAt, rightRequestedAt){
  const leftStart = getCounselSlotStartMs(leftRequestedAt)
  const rightStart = getCounselSlotStartMs(rightRequestedAt)
  if(!Number.isFinite(leftStart) || !Number.isFinite(rightStart)) return false
  const leftEnd = leftStart + (PORTAL_COUNSEL_SLOT_MINUTES * 60 * 1000)
  const rightEnd = rightStart + (PORTAL_COUNSEL_SLOT_MINUTES * 60 * 1000)
  return leftStart < rightEnd && rightStart < leftEnd
}

function buildCounselSlotId(requestedAt){
  const date = parseCounselRequestedAt(requestedAt)
  if(!date) return ''
  const localValue = String(requestedAt || '').trim().slice(0, 16)
  return sanitizeId(localValue.replace('T', '-'))
}

function buildCounselSlotRecord(slotId, requestId, payload, status){
  const requestedAt = String(payload && payload.requestedAt || '').trim()
  const startMs = getCounselSlotStartMs(requestedAt)
  const endMs = getCounselSlotEndMs(requestedAt)
  const now = new Date().toISOString()
  return {
    id: slotId,
    requestId: String(requestId || '').trim(),
    userId: String(payload && payload.userId || '').trim(),
    classId: String(payload && payload.classId || '').trim(),
    classIds: Array.isArray(payload && payload.classIds) ? payload.classIds.slice() : [],
    requestedAt: requestedAt,
    startAt: Number.isFinite(startMs) ? new Date(startMs).toISOString() : '',
    endAt: Number.isFinite(endMs) ? new Date(endMs).toISOString() : '',
    status: String(status || 'open').trim() || 'open',
    updatedAt: now
  }
}

function buildCounselSlotReleaseRecord(slotId, requestId, updates, status){
  return Object.assign({}, updates || {}, {
    id: String(slotId || '').trim(),
    requestId: String(requestId || (updates && updates.requestId) || '').trim(),
    status: String(status || 'canceled').trim() || 'canceled',
    updatedAt: new Date().toISOString()
  })
}

function readLocalCounselSlots(){
  try{
    const raw = localStorage.getItem(PORTAL_ENHANCEMENT_KEYS.counselSlots)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  }catch(error){
    console.error(error)
    return []
  }
}

function writeLocalCounselSlots(rows){
  localStorage.setItem(PORTAL_ENHANCEMENT_KEYS.counselSlots, JSON.stringify(Array.isArray(rows) ? rows : []))
}

function findLocalCounselSlotConflict(requestedAt){
  const slotRows = readLocalCounselSlots()
  const slotConflict = slotRows.find(function(entry){
    return isCounselRequestOpen(entry) && doCounselSlotsOverlap(requestedAt, entry && entry.requestedAt)
  })
  if(slotConflict) return slotConflict

  return readLocalCounselRequests().find(function(entry){
    return isCounselRequestOpen(entry) && doCounselSlotsOverlap(requestedAt, entry && entry.requestedAt)
  }) || null
}

function reserveLocalCounselSlot(slotId, requestId, payload){
  const conflict = findLocalCounselSlotConflict(payload && payload.requestedAt)
  if(conflict) return { ok: false, conflict: conflict }
  const rows = readLocalCounselSlots().filter(function(entry){
    return String(entry && entry.id || '').trim() !== slotId
  })
  rows.push(buildCounselSlotRecord(slotId, requestId, payload, 'open'))
  writeLocalCounselSlots(rows)
  return { ok: true }
}

function updateLocalCounselSlot(slotId, updates){
  const targetId = String(slotId || '').trim()
  if(!targetId) return false
  const rows = readLocalCounselSlots()
  let changed = false
  const nextRows = rows.map(function(entry){
    if(String(entry && entry.id || '').trim() !== targetId) return entry
    changed = true
    return Object.assign({}, entry, updates, { id: targetId })
  })
  if(changed) writeLocalCounselSlots(nextRows)
  return changed
}

async function reserveCloudCounselSlot(slotId, requestId, payload){
  if(!portalState.firebaseEnabled || !portalState.db || typeof portalState.db.runTransaction !== 'function') return false
  const slotRef = portalState.db.collection(PORTAL_COUNSEL_SLOT_COLLECTION).doc(slotId)
  const slotRecord = buildCounselSlotRecord(slotId, requestId, payload, 'open')
  await portalState.db.runTransaction(function(transaction){
    return transaction.get(slotRef).then(function(snapshot){
      if(snapshot.exists){
        const existing = snapshot.data() || {}
        if(isCounselRequestOpen(existing) && doCounselSlotsOverlap(payload && payload.requestedAt, existing.requestedAt)){
          throw new Error('counsel-slot-conflict')
        }
      }
      transaction.set(slotRef, slotRecord, { merge: true })
    })
  })
  return true
}

async function reserveCounselSlot(slotId, requestId, payload){
  if(portalState.firebaseEnabled && portalState.db){
    try{
      await reserveCloudCounselSlot(slotId, requestId, payload)
      return { ok: true, cloud: true }
    }catch(error){
      if(String(error && error.message || '').indexOf('counsel-slot-conflict') >= 0){
        return { ok: false, conflict: true }
      }
      console.warn('counselSlots reservation fallback:', error && error.message ? error.message : error)
    }
  }
  return reserveLocalCounselSlot(slotId, requestId, payload)
}

async function markCounselSlotCompleted(slotId, updates){
  const targetId = String(slotId || '').trim()
  if(!targetId) return false
  const payload = Object.assign({}, updates || {}, {
    status: 'completed',
    updatedAt: new Date().toISOString()
  })
  if(portalState.firebaseEnabled && portalState.db){
    try{
      await portalState.db.collection(PORTAL_COUNSEL_SLOT_COLLECTION).doc(targetId).set(payload, { merge: true })
      return true
    }catch(error){
      console.warn('counselSlots update fallback:', error && error.message ? error.message : error)
    }
  }
  return updateLocalCounselSlot(targetId, payload)
}

async function releaseCounselSlot(slotId, requestId, updates, status){
  const targetId = String(slotId || '').trim()
  if(!targetId) return false
  const payload = buildCounselSlotReleaseRecord(targetId, requestId, updates, status || 'canceled')
  if(portalState.firebaseEnabled && portalState.db){
    try{
      await portalState.db.collection(PORTAL_COUNSEL_SLOT_COLLECTION).doc(targetId).set(payload, { merge: true })
      return true
    }catch(error){
      console.warn('counselSlots release fallback:', error && error.message ? error.message : error)
    }
  }
  return updateLocalCounselSlot(targetId, payload)
}

function readLocalCounselRequests(){
  try{
    const raw = localStorage.getItem(PORTAL_ENHANCEMENT_KEYS.counselRequests)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(normalizeCounselRequestRecord).filter(Boolean) : []
  }catch(error){
    console.error(error)
    return []
  }
}

function writeLocalCounselRequests(rows){
  localStorage.setItem(PORTAL_ENHANCEMENT_KEYS.counselRequests, JSON.stringify(Array.isArray(rows) ? rows : []))
}

function normalizeCounselRequestRecord(source){
  if(!source || typeof source !== 'object') return null
  const id = String(source.id || source.docId || '').trim()
  const userId = String(source.userId || '').trim()
  const type = normalizeCounselType(source.type)
  const typeInfo = getCounselTypeInfo(type)
  if(!id || !userId) return null
  return {
    id: id,
    userId: userId,
    loginId: String(source.loginId || '').trim(),
    email: String(source.email || '').trim().toLowerCase(),
    name: String(source.name || '').trim(),
    studentId: String(source.studentId || '').trim(),
    role: String(source.role || 'student').trim() || 'student',
    classId: String(source.classId || '').trim(),
    classIds: Array.isArray(source.classIds) ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean) : [],
    type: type,
    typeTitle: String(source.typeTitle || typeInfo.title || '').trim(),
    typeLabel: String(source.typeLabel || typeInfo.label || '').trim(),
    reasonChoice: String(source.reasonChoice || source.reason || '').trim(),
    reason: String(source.reason || '').trim(),
    currentSubjects: normalizeCounselSubjectList(source.currentSubjects),
    withdrawalSubjects: normalizeCounselSubjectList(source.withdrawalSubjects),
    requestedAt: String(source.requestedAt || '').trim(),
    slotId: String(source.slotId || buildCounselSlotId(source.requestedAt) || '').trim(),
    slotMinutes: Number(source.slotMinutes || PORTAL_COUNSEL_SLOT_MINUTES),
    slotStartAt: String(source.slotStartAt || '').trim(),
    slotEndAt: String(source.slotEndAt || '').trim(),
    content: String(source.content || '').trim(),
    status: String(source.status || 'open').trim() || 'open',
    completedAt: String(source.completedAt || '').trim(),
    completedBy: String(source.completedBy || '').trim(),
    canceledAt: String(source.canceledAt || '').trim(),
    canceledBy: String(source.canceledBy || '').trim(),
    createdAt: String(source.createdAt || '').trim(),
    updatedAt: String(source.updatedAt || '').trim()
  }
}

async function submitCounselRequest(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }

  const submitButton = document.getElementById('counsel-submit-btn')
  const reasonSelect = document.getElementById('counsel-reason-select')
  const reasonOtherInput = document.getElementById('counsel-reason-other-input')
  const dateInput = document.getElementById('counsel-date-input')
  const timeSelect = document.getElementById('counsel-time-select')
  const contentInput = document.getElementById('counsel-content-input')
  const reasonChoice = String(reasonSelect && reasonSelect.value || '').trim()
  const reason = reasonChoice === PORTAL_COUNSEL_OTHER_REASON
    ? String(reasonOtherInput && reasonOtherInput.value || '').trim()
    : reasonChoice
  const requestedAt = getCounselRequestedAtValue()
  const content = String(contentInput && contentInput.value || '').trim()
  const typeInfo = getCounselTypeInfo(portalState.currentCounselType)
  const currentSubjects = typeInfo.key === 'withdrawal'
    ? getCheckedCounselSubjects('counsel-current-subjects')
    : []
  const withdrawalSubjects = typeInfo.key === 'withdrawal'
    ? getCheckedCounselSubjects('counsel-withdrawal-subjects')
    : []

  if(!reasonChoice || !reason || !requestedAt || !content){
    setCounselFormStatus('상담사유, 상담날짜시간, 상담내용을 모두 입력해 주세요.', true)
    showToast('상담 신청 내용을 모두 입력해 주세요.', 'var(--red)')
    return
  }
  if(typeInfo.key === 'withdrawal' && (!currentSubjects.length || !withdrawalSubjects.length)){
    setCounselFormStatus('현재 듣고 있는 강의와 퇴원희망과목을 각각 1개 이상 선택해 주세요.', true)
    showToast('현재 수강 과목과 퇴원희망과목을 선택해 주세요.', 'var(--red)')
    return
  }
  if(!validateCounselDateTimeSelection(false)){
    const message = getCounselDateTimeValidationMessage(requestedAt)
    setCounselFormStatus(message, true)
    showToast(message, 'var(--red)')
    if(dateInput && !dateInput.value) dateInput.focus()
    else if(timeSelect) timeSelect.focus()
    return
  }

  const profile = portalState.currentProfile || {}
  const authUser = portalState.currentUser || {}
  const userId = getCurrentCounselUserId()
  if(!userId){
    setCounselFormStatus('로그인 정보를 확인할 수 없습니다. 다시 로그인해 주세요.', true)
    return
  }

  const classIds = typeof getProfileClassIds === 'function'
    ? getProfileClassIds()
    : (Array.isArray(profile.classIds) ? profile.classIds : [])
  const now = new Date().toISOString()
  const editRecord = portalState.currentCounselEditRecord || null
  const editId = String(portalState.currentCounselEditId || '').trim()
  const isEditMode = !!(editId && editRecord)
  if(isEditMode && (!isCounselRequestOwnedByCurrentUser(editRecord) || !isCounselRequestOpen(editRecord))){
    setCounselFormStatus('수정할 수 없는 상담 신청입니다.', true)
    showToast('수정할 수 없는 상담 신청입니다.', 'var(--red)')
    return
  }
  const docId = isEditMode ? editId : buildCounselRequestDocId(userId)
  const slotId = buildCounselSlotId(requestedAt)
  const slotStartMs = getCounselSlotStartMs(requestedAt)
  const slotEndMs = getCounselSlotEndMs(requestedAt)
  const payload = normalizeCounselRequestRecord(Object.assign({}, isEditMode ? editRecord : {}, {
    id: docId,
    userId: userId,
    loginId: profile.loginId || authUser.loginId || profile.studentId || '',
    email: profile.email || authUser.email || '',
    name: profile.name || '',
    studentId: profile.studentId || profile.loginId || '',
    role: profile.role || 'student',
    classId: classIds[0] || '',
    classIds: classIds,
    type: typeInfo.key,
    typeTitle: typeInfo.title,
    typeLabel: typeInfo.label,
    reasonChoice: reasonChoice === PORTAL_COUNSEL_OTHER_REASON ? '기타(직접입력)' : reasonChoice,
    reason: reason,
    currentSubjects: currentSubjects,
    withdrawalSubjects: withdrawalSubjects,
    requestedAt: requestedAt,
    slotId: slotId,
    slotMinutes: PORTAL_COUNSEL_SLOT_MINUTES,
    slotStartAt: Number.isFinite(slotStartMs) ? new Date(slotStartMs).toISOString() : '',
    slotEndAt: Number.isFinite(slotEndMs) ? new Date(slotEndMs).toISOString() : '',
    content: content,
    status: 'open',
    createdAt: isEditMode ? (editRecord.createdAt || now) : now,
    updatedAt: now
  }))

  if(!payload || !slotId){
    setCounselFormStatus('상담 신청 정보를 만들지 못했습니다.', true)
    return
  }

  try{
    if(submitButton) submitButton.disabled = true
    setCounselFormStatus('상담 시간을 확인하는 중입니다...', false)
    const previousSlotId = isEditMode ? String(editRecord.slotId || buildCounselSlotId(editRecord.requestedAt) || '').trim() : ''
    const shouldReserveSlot = !isEditMode || previousSlotId !== slotId
    let reservation = null
    if(shouldReserveSlot){
      reservation = await reserveCounselSlot(slotId, docId, payload)
      if(!reservation || !reservation.ok){
        const message = '이미 신청된 상담 시간입니다. 다른 시간을 선택해 주세요.'
        setCounselFormStatus(message, true)
        showToast(message, 'var(--red)')
        return
      }
    }

    setCounselFormStatus(isEditMode ? '상담 신청을 수정하는 중입니다...' : '상담 신청을 저장하는 중입니다...', false)
    let savedToCloud = false
    if(portalState.firebaseEnabled && portalState.db){
      try{
        await portalState.db.collection(PORTAL_COUNSEL_REQUEST_COLLECTION).doc(docId).set(payload, { merge: true })
        savedToCloud = true
      }catch(error){
        console.warn('counselRequests write fallback:', error && error.message ? error.message : error)
        if(reservation && reservation.cloud){
          await markCounselSlotCompleted(slotId, {
            requestId: docId,
            releasedAt: new Date().toISOString(),
            releaseReason: 'request-save-failed'
          })
        }
      }
    }
    if(!savedToCloud){
      const rows = readLocalCounselRequests()
      let replacedLocalRow = false
      const nextRows = isEditMode
        ? rows.map(function(entry){
            if(String(entry && entry.id || '').trim() !== docId) return entry
            replacedLocalRow = true
            return payload
          })
        : rows.concat([payload])
      if(isEditMode && !replacedLocalRow) nextRows.push(payload)
      writeLocalCounselRequests(nextRows)
    }
    if(isEditMode && previousSlotId && previousSlotId !== slotId){
      await releaseCounselSlot(previousSlotId, docId, {
        userId: userId,
        releasedAt: new Date().toISOString(),
        releaseReason: 'request-edited'
      }, 'canceled')
    }
    portalState.currentCounselEditId = ''
    portalState.currentCounselEditRecord = null
    showToast(isEditMode ? '상담 신청을 수정했습니다.' : (savedToCloud ? '상담 신청이 관리자에게 전달되었습니다.' : '상담 신청이 이 브라우저에 임시 저장되었습니다.'), 'var(--green)')
    if(isEditMode) openCounselHistoryTab()
    else openCounselPortal()
  }catch(error){
    console.error(error)
    setCounselFormStatus('상담 신청 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.', true)
    showToast('상담 신청 저장에 실패했습니다.', 'var(--red)')
  }finally{
    if(submitButton) submitButton.disabled = false
  }
}

function isCounselRequestOwnedByCurrentUser(entry){
  const userId = getCurrentCounselUserId()
  return !!userId && String(entry && entry.userId || '').trim() === userId
}

async function fetchMyCounselRequests(){
  const userId = getCurrentCounselUserId()
  if(!userId) return []
  let rows = []
  let usedCloud = false
  if(portalState.firebaseEnabled && portalState.db){
    try{
      const snapshot = await portalState.db.collection(PORTAL_COUNSEL_REQUEST_COLLECTION)
        .where('userId', '==', userId)
        .get()
      usedCloud = true
      rows = snapshot.docs.map(function(doc){
        return normalizeCounselRequestRecord(Object.assign({ id: doc.id }, doc.data() || {}))
      }).filter(Boolean)
    }catch(error){
      console.warn('counselRequests my read fallback:', error && error.message ? error.message : error)
    }
  }
  if(!usedCloud){
    rows = readLocalCounselRequests().filter(isCounselRequestOwnedByCurrentUser)
  }
  return rows.sort(function(a, b){
    return String(b.createdAt || b.requestedAt || '').localeCompare(String(a.createdAt || a.requestedAt || ''))
  })
}

function getCounselRequestStatusLabel(entry){
  const status = String(entry && entry.status || 'open').trim().toLowerCase()
  if(status === 'completed' || status === 'done' || status === 'resolved' || status === 'closed') return '상담완료'
  if(status === 'canceled' || status === 'cancelled') return '취소됨'
  return '신청중'
}

function buildMyCounselRequestItem(entry){
  const isOpen = isCounselRequestOpen(entry)
  const slotId = entry.slotId || buildCounselSlotId(entry.requestedAt)
  return '' +
    '<div class="admin-item counsel-history-item">' +
      '<span class="admin-counsel-type">' + escapeHtml(entry.typeLabel || entry.typeTitle || '상담') + '</span>' +
      '<strong class="admin-item-title">' + escapeHtml(formatCounselRequestedAt(entry.requestedAt) || '상담 시간 미지정') + '</strong>' +
      '<span class="admin-item-meta">상태: ' + escapeHtml(getCounselRequestStatusLabel(entry)) + '</span>' +
      '<span class="admin-item-meta">사유: ' + escapeHtml(entry.reason || '') + '</span>' +
      buildCounselWithdrawalMeta(entry) +
      '<span class="admin-item-meta admin-counsel-content">' + escapeHtml(entry.content || '') + '</span>' +
      '<span class="admin-item-muted">' + escapeHtml(formatAdminTime(entry.updatedAt || entry.createdAt)) + '</span>' +
      (isOpen ? (
        '<div class="admin-item-actions counsel-history-actions">' +
          '<button class="btn btn-ghost btn-sm" type="button" onclick="editMyCounselRequest(\'' + escapeJs(entry.id) + '\')">상담 수정</button>' +
          '<button class="btn btn-ghost btn-sm" type="button" onclick="cancelMyCounselRequest(\'' + escapeJs(entry.id) + '\', \'' + escapeJs(slotId) + '\')">상담 취소</button>' +
        '</div>'
      ) : '') +
    '</div>'
}

async function renderMyCounselRequests(){
  const panel = document.getElementById('counsel-history-panel')
  const countNode = document.getElementById('counsel-history-count')
  const listNode = document.getElementById('counsel-history-list')
  if(!panel || !countNode || !listNode) return
  const shouldShow = !!portalState.currentUser && !isPortalAdmin()
  if(!shouldShow){
    countNode.textContent = '0'
    listNode.innerHTML = ''
    return
  }
  listNode.innerHTML = '<div class="empty-box">상담 신청 내역을 불러오는 중입니다...</div>'
  const rows = await fetchMyCounselRequests()
  portalState.myCounselRequests = rows
  countNode.textContent = String(rows.length)
  listNode.innerHTML = rows.length
    ? rows.map(buildMyCounselRequestItem).join('')
    : '<div class="empty-box">아직 신청한 상담이 없습니다.</div>'
}

function syncCounselHistoryTabVisibility(){
  const button = document.getElementById('counsel-history-tab-btn')
  if(!button) return
  button.classList.toggle('hidden', !portalState.currentUser || isPortalAdmin())
}

function renderCounselPortal(){
  portalState.currentCounselEditId = ''
  portalState.currentCounselEditRecord = null
  syncCounselHistoryTabVisibility()
}

function openCounselHistoryTab(){
  if(!portalState.currentUser){
    showAuthScreen('')
    return
  }
  if(isPortalAdmin()){
    showToast('학생 계정에서만 상담 신청 내역을 볼 수 있습니다.', 'var(--red)')
    return
  }
  syncCounselHistoryTabVisibility()
  updatePortalUserCard()
  activatePortalScreen('counsel-history-screen')
  renderMyCounselRequests()
}

async function getMyCounselRequestById(requestId){
  const targetId = String(requestId || '').trim()
  if(!targetId) return null
  const cachedRows = Array.isArray(portalState.myCounselRequests) ? portalState.myCounselRequests : []
  let found = cachedRows.find(function(entry){
    return String(entry && entry.id || '').trim() === targetId
  }) || null
  if(found) return found
  const rows = await fetchMyCounselRequests()
  portalState.myCounselRequests = rows
  return rows.find(function(entry){
    return String(entry && entry.id || '').trim() === targetId
  }) || null
}

window.editMyCounselRequest = function(requestId){
  editMyCounselRequestImpl(requestId)
}

async function editMyCounselRequestImpl(requestId){
  const entry = await getMyCounselRequestById(requestId)
  if(!entry || !isCounselRequestOwnedByCurrentUser(entry)){
    showToast('수정할 상담 신청을 찾지 못했습니다.', 'var(--red)')
    return
  }
  if(!isCounselRequestOpen(entry)){
    showToast('이미 완료되었거나 취소된 상담은 수정할 수 없습니다.', 'var(--red)')
    return
  }
  const typeInfo = getCounselTypeInfo(entry.type)
  portalState.currentCounselType = typeInfo.key
  portalState.currentCounselEditId = entry.id
  portalState.currentCounselEditRecord = entry
  updatePortalUserCard()
  renderCounselForm(typeInfo, entry)
  activatePortalScreen('counsel-form-screen')
}

window.cancelMyCounselRequest = function(requestId, slotId){
  cancelMyCounselRequestImpl(requestId, slotId)
}

async function cancelMyCounselRequestImpl(requestId, slotId){
  const entry = await getMyCounselRequestById(requestId)
  if(!entry || !isCounselRequestOwnedByCurrentUser(entry)){
    showToast('취소할 상담 신청을 찾지 못했습니다.', 'var(--red)')
    return
  }
  if(!isCounselRequestOpen(entry)){
    showToast('이미 완료되었거나 취소된 상담입니다.', 'var(--red)')
    return
  }
  if(typeof window.confirm === 'function' && !window.confirm('이 상담 신청을 취소할까요?')){
    return
  }
  const canceledAt = new Date().toISOString()
  const userId = getCurrentCounselUserId()
  const updates = {
    userId: userId,
    status: 'canceled',
    canceledAt: canceledAt,
    canceledBy: userId,
    updatedAt: canceledAt
  }
  const didSave = await updateCounselRequestRecord(entry.id, updates)
  if(!didSave){
    showToast('상담 취소에 실패했습니다.', 'var(--red)')
    return
  }
  await releaseCounselSlot(slotId || entry.slotId || buildCounselSlotId(entry.requestedAt), entry.id, {
    userId: userId,
    canceledAt: canceledAt,
    releaseReason: 'request-canceled'
  }, 'canceled')
  await renderMyCounselRequests()
  showToast('상담 신청을 취소했습니다.', 'var(--green)')
}

async function fetchAllCounselRequests(){
  let rows = []
  let usedCloud = false
  if(portalState.firebaseEnabled && portalState.db){
    try{
      const snapshot = await portalState.db.collection(PORTAL_COUNSEL_REQUEST_COLLECTION).get()
      usedCloud = true
      rows = snapshot.docs.map(function(doc){
        return normalizeCounselRequestRecord(Object.assign({ id: doc.id }, doc.data() || {}))
      }).filter(Boolean)
    }catch(error){
      console.warn('counselRequests admin read fallback:', error && error.message ? error.message : error)
    }
  }
  if(!usedCloud){
    rows = readLocalCounselRequests()
  }
  return rows
}

function filterAdminCounselRequests(rows){
  return (Array.isArray(rows) ? rows : []).filter(function(entry){
    if(!isCounselRequestOpen(entry)) return false
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
    return true
  }).sort(function(a, b){
    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''))
  })
}

function formatCounselRequestedAt(value){
  const raw = String(value || '').trim()
  if(!raw) return ''
  if(raw.indexOf('T') >= 0 && raw.length <= 16) return raw.replace('T', ' ')
  return formatPortalDateTime(raw) || raw
}

function getCounselRequestClassName(entry){
  const classId = String(entry && (entry.classId || (Array.isArray(entry.classIds) ? entry.classIds[0] : '')) || '').trim()
  const classInfo = getPortalClassInfoById(classId)
  return classInfo && classInfo.name ? classInfo.name : classId
}

function buildCounselWithdrawalMeta(entry){
  if(String(entry && entry.type || '').trim() !== 'withdrawal') return ''
  const currentSubjects = normalizeCounselSubjectList(entry && entry.currentSubjects).join(', ')
  const withdrawalSubjects = normalizeCounselSubjectList(entry && entry.withdrawalSubjects).join(', ')
  return '' +
    '<span class="admin-item-meta">현재 수강: ' + escapeHtml(currentSubjects || '미선택') + '</span>' +
    '<span class="admin-item-meta">퇴원희망: ' + escapeHtml(withdrawalSubjects || '미선택') + '</span>'
}

function buildAdminCounselItem(entry){
  const slotId = entry.slotId || buildCounselSlotId(entry.requestedAt)
  return '' +
    '<div class="admin-item">' +
      '<span class="admin-counsel-type">' + escapeHtml(entry.typeLabel || entry.typeTitle || '상담') + '</span>' +
      '<strong class="admin-item-title">' + escapeHtml(entry.name || '학생') + '</strong>' +
      '<span class="admin-item-meta">' + escapeHtml(getCounselRequestClassName(entry) || '반 정보 없음') + ' · ' + escapeHtml(entry.studentId || entry.loginId || '') + '</span>' +
      '<span class="admin-item-numbers">희망: ' + escapeHtml(formatCounselRequestedAt(entry.requestedAt) || '미지정') + '</span>' +
      '<span class="admin-item-meta">사유: ' + escapeHtml(entry.reason || '') + '</span>' +
      buildCounselWithdrawalMeta(entry) +
      '<span class="admin-item-meta admin-counsel-content">' + escapeHtml(entry.content || '') + '</span>' +
      '<span class="admin-item-muted">' + escapeHtml(formatAdminTime(entry.createdAt)) + '</span>' +
      '<div class="admin-item-actions">' +
        '<button class="btn btn-ghost btn-sm" type="button" onclick="completeAdminCounselRequest(\'' + escapeJs(entry.id) + '\', \'' + escapeJs(slotId) + '\')">상담완료</button>' +
      '</div>' +
    '</div>'
}

async function updateCounselRequestRecord(requestId, updates){
  const targetId = String(requestId || '').trim()
  if(!targetId || !updates || typeof updates !== 'object') return false

  if(portalState.firebaseEnabled && portalState.db){
    try{
      await portalState.db.collection(PORTAL_COUNSEL_REQUEST_COLLECTION).doc(targetId).set(updates, { merge: true })
      return true
    }catch(error){
      console.warn('counselRequests update fallback:', error && error.message ? error.message : error)
    }
  }

  const rows = readLocalCounselRequests()
  let changed = false
  const nextRows = rows.map(function(entry){
    if(String(entry && entry.id || '').trim() !== targetId) return entry
    changed = true
    return normalizeCounselRequestRecord(Object.assign({}, entry, updates, { id: targetId }))
  }).filter(Boolean)
  if(changed) writeLocalCounselRequests(nextRows)
  return changed
}

window.completeAdminCounselRequest = function(requestId, slotId){
  completeAdminCounselRequestImpl(requestId, slotId)
}

async function completeAdminCounselRequestImpl(requestId, slotId){
  if(!isPortalAdmin()){
    showToast('관리자만 상담완료 처리할 수 있습니다.', 'var(--red)')
    return
  }

  const targetId = String(requestId || '').trim()
  if(!targetId) return
  const completedAt = new Date().toISOString()
  const completedBy = portalState.currentProfile && (portalState.currentProfile.name || portalState.currentProfile.loginId)
    ? (portalState.currentProfile.name || portalState.currentProfile.loginId)
    : (portalState.currentUser && portalState.currentUser.email || '')
  const updates = {
    status: 'completed',
    completedAt: completedAt,
    completedBy: completedBy,
    updatedAt: completedAt
  }

  const didSave = await updateCounselRequestRecord(targetId, updates)
  if(!didSave){
    showToast('상담완료 처리에 실패했습니다.', 'var(--red)')
    return
  }

  await markCounselSlotCompleted(slotId, Object.assign({
    requestId: targetId
  }, updates))
  await renderAdminScreen()
  showToast('상담완료 처리했습니다.', 'var(--green)')
}

async function renderAdminCounselRequests(){
  const countNode = document.getElementById('admin-counsel-count')
  const listNode = document.getElementById('admin-counsel-list')
  if(!countNode || !listNode) return
  if(!isPortalAdmin()){
    countNode.textContent = '0'
    listNode.innerHTML = '<div class="empty-box">관리자만 상담 요청을 확인할 수 있습니다.</div>'
    return
  }
  const rows = filterAdminCounselRequests(await fetchAllCounselRequests())
  countNode.textContent = String(rows.length)
  listNode.innerHTML = rows.length
    ? rows.map(buildAdminCounselItem).join('')
    : '<div class="empty-box">아직 접수된 상담 요청이 없습니다.</div>'
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
    { groupId: 'admin-response-group', listId: 'admin-response-list', bodyId: 'admin-response-body' },
    { groupId: 'admin-issue-group', listId: 'admin-issue-list', bodyId: 'admin-issue-body' },
    { groupId: 'admin-counsel-group', listId: 'admin-counsel-list', bodyId: 'admin-counsel-body' }
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
    return String(entry.questionId || '') === String(question.id || '') && normalizeQuestionIssueStatus(entry) === 'open'
  }) || null
  const buttonClass = existing ? 'check-question-issue-btn done' : 'check-question-issue-btn'
  const buttonText = existing ? '질문 접수됨' : '질문 남기기'
  const editConfirmTool = isEditingAnswer
    ? '<button class="check-question-edit-btn save" type="button" onclick="submitSingleCheckAnswerEdit(\'' + escapeJs(question.id) + '\')">수정하기</button>'
    : ''
  const editTool = isEditingAnswer
    ? '<button class="check-question-edit-btn active" type="button" onclick="cancelCheckAnswerEdit(\'' + escapeJs(question.id) + '\')">수정 취소</button>'
    : (canCheckAnswerBeEdited(submittedAnswer)
        ? '<button class="check-question-edit-btn" type="button" onclick="startCheckAnswerEdit(\'' + escapeJs(question.id) + '\')">답 수정</button>'
        : '<span class="check-edit-limit-badge">답 수정 1회 사용 완료</span>')
  const wrongNoteDone = isCheckWrongNoteCompleted(submittedAnswer)
  const wrongNoteTool = submittedAnswer && submittedAnswer.isCorrect === false && !isEditingAnswer
    ? '<button class="check-wrong-note-btn' + (wrongNoteDone ? ' done' : '') + '" type="button" onclick="completeCheckWrongNote(\'' + escapeJs(question.id) + '\')">' +
        (wrongNoteDone ? '오답노트 완료됨' : '오답노트 완료') +
      '</button>'
    : ''
  const issueTool = isEditingAnswer
    ? ''
    : ('<button class="' + buttonClass + '" type="button" onclick="submitCheckQuestionIssue(\'' + escapeJs(question.id) + '\')">' +
        escapeHtml(buttonText) +
      '</button>')

  return '' +
    '<div class="check-result-tools">' +
      editConfirmTool +
      editTool +
      wrongNoteTool +
      issueTool +
    '</div>'
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
  renderCheckForm(checkSet, submission)
  showToast('답 수정 모드가 열렸습니다. 답을 다시 선택한 뒤 수정하기를 눌러 주세요.', 'var(--blue)')
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

window.submitSingleCheckAnswerEdit = function(questionId){
  submitSingleCheckAnswerEditImpl(questionId)
}

async function submitSingleCheckAnswerEditImpl(questionId){
  const checkSet = portalState.currentCheckSet
  const submission = portalState.currentCheckSubmission
  const targetId = String(questionId || '').trim()
  if(portalState.isSubmittingCheck || !checkSet || !submission || !targetId) return
  if(!isCheckAnswerEditing(targetId)){
    showToast('먼저 수정 모드를 열어 주세요.', 'var(--blue)')
    return
  }

  const batchAnswer = collectCheckBatchAnswers(checkSet, submission).find(function(answer){
    return String(answer && answer.questionId || '').trim() === targetId
  }) || null
  if(!batchAnswer){
    if(!getCurrentCheckDraftAnswer(targetId)){
      showToast('답을 다시 고른 뒤 수정해 주세요.', 'var(--blue)')
    }else{
      showToast('바뀐 답이 없습니다.', 'var(--blue)')
    }
    return
  }

  portalState.isSubmittingCheck = true
  try{
    const nextSubmission = mergeCheckSubmission(submission, [batchAnswer])
    await saveCheckSubmission(checkSet, nextSubmission)
    portalState.currentCheckSubmission = nextSubmission
    setCurrentCheckDraftAnswer(targetId, '')
    setCheckAnswerEditing(targetId, false)
    portalState.currentQuestionIssues = await fetchMyQuestionIssues(checkSet)
    renderCheckForm(checkSet, nextSubmission)
    showToast('답 수정이 반영됐습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('답 수정 저장에 실패했습니다.', 'var(--red)')
  }finally{
    portalState.isSubmittingCheck = false
  }
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

  const nextCompleted = !isCheckWrongNoteCompleted(submittedAnswer)
  const completedAt = new Date().toISOString()
  const nextAnswers = sortCheckSubmissionAnswers(answers.map(function(answer){
    if(String(answer && answer.questionId || '') !== targetId) return answer
    return Object.assign({}, answer, {
      wrongNoteCompleted: nextCompleted,
      wrongNoteCompletedAt: nextCompleted ? completedAt : ''
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
    showToast(nextCompleted ? '오답노트를 완료로 표시했습니다.' : '오답노트 표시를 취소했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('오답노트 상태 저장에 실패했습니다.', 'var(--red)')
  }
}

function renderCheckForm(checkSet, submission){
  const form = document.getElementById('check-form')
  if(!form || !checkSet) return

  const answerMap = getSubmittedCheckAnswerMap(submission)
  const submittedCount = getSubmittedCheckCount(submission)
  const pendingCount = countPendingCheckQuestions(checkSet, submission)
  const wrongCount = countWrongCheckQuestions(submission)
  const openEditCount = countOpenCheckEdits()
  const filterMode = resolveCheckFilterMode(checkSet, submission, portalState.currentCheckFilter)
  portalState.currentCheckFilter = filterMode
  const visibleQuestions = getVisibleCheckQuestions(checkSet, submission, filterMode)

  const progressHtml =
    '<section class="group check-progress-card">' +
      '<div class="check-progress-top">' +
        '<div class="check-progress-copy">' +
          '<div class="check-progress-title">제출 현황</div>' +
        '</div>' +
        '<div class="check-progress-stats">' +
          renderCheckProgressFilterChip('all', '전체', checkSet.questions.length, filterMode === 'all') +
          renderCheckProgressFilterChip('submitted', '제출', submittedCount, filterMode === 'submitted') +
          renderCheckProgressFilterChip('pending', '미제출', pendingCount + openEditCount, filterMode === 'pending') +
          renderCheckProgressFilterChip('wrong', '오답', wrongCount, filterMode === 'wrong') +
        '</div>' +
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
    const questionTitle = '문항 ' + displayNumber
    const promptText = String(question.prompt || '').trim()
    const shouldShowPrompt = !!promptText && promptText !== questionTitle
    const resultClass = submittedAnswer ? ('check-result show ' + (submittedAnswer.isCorrect ? 'correct' : 'wrong')) : 'check-result'
    const cardStateClass = submittedAnswer
      ? (' ' + (submittedAnswer.isCorrect ? 'is-correct' : 'is-wrong') + (isEditingAnswer ? ' is-editing' : ''))
      : ' is-pending'
    const resultTitle = isEditingAnswer
      ? '답 수정 중'
      : '정답과 해설'
    const editNote = isEditingAnswer
      ? '<div class="check-edit-note">수정 모드입니다. 1회 수정할 수 있습니다.</div>'
      : ''

    return '' +
      '<section class="group check-form-card' + cardStateClass + '">' +
        '<div class="check-question-row">' +
          '<div class="check-question-copy">' +
            '<div class="check-question-title">' + questionTitle + '</div>' +
            (shouldShowPrompt ? '<div class="check-question-prompt">' + escapeHtml(promptText) + '</div>' : '') +
          '</div>' +
          '<div class="check-answer-box">' +
            renderCheckAnswerField(question, selectedAnswer, !!submittedAnswer && !isEditingAnswer) +
          '</div>' +
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
    portalState.currentCheckFilter = 'submitted'
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
  return ['all', 'submitted', 'pending', 'wrong'].includes(mode) ? mode : 'all'
}

function getVisibleCheckQuestions(checkSet, submission, filterMode){
  const questions = Array.isArray(checkSet && checkSet.questions) ? checkSet.questions : []
  const answerMap = getSubmittedCheckAnswerMap(submission)
  const submittedIds = new Set((submission && Array.isArray(submission.answers) ? submission.answers : []).map(function(answer){
    return String(answer && answer.questionId || '').trim()
  }).filter(Boolean))
  if(filterMode === 'submitted'){
    return questions.filter(function(question){
      return submittedIds.has(String(question && question.id || '').trim())
    })
  }
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
  return questions
}

function renderCheckProgressFilterChip(mode, label, count, isActive){
  return '<button class="check-progress-chip check-progress-filter' + (isActive ? ' active' : '') + '" type="button" data-check-filter="' + escapeHtml(mode) + '">' + escapeHtml(label) + '<span>' + Number(count || 0) + '</span></button>'
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

function buildPortalPrepClassMap(){
  const map = new Map()
  Array.from(arguments).forEach(function(list){
    normalizePortalPrepClassList(list).forEach(function(entry){
      const id = String(entry && entry.id || '').trim()
      if(!id) return
      const existing = map.get(id) || { id: id, name: id, password: '' }
      map.set(id, {
        id: id,
        name: String(entry && entry.name || '').trim() || existing.name || id,
        password: String(entry && entry.password || '').trim() || existing.password || ''
      })
    })
  })
  return map
}

function buildPortalPrepClassEntriesFromIds(classIds, classMap){
  return normalizeCheckAssignmentValues(classIds).map(function(classId){
    const id = String(classId || '').trim()
    if(!id) return null
    const existing = classMap instanceof Map ? classMap.get(id) : null
    return {
      id: id,
      name: String(existing && existing.name || id).trim() || id,
      password: String(existing && existing.password || '').trim()
    }
  }).filter(Boolean)
}

async function loadPortalScopedPrepClassEntries(classMap){
  if(isPortalSuperAdmin()){
    const users = await fetchAllPortalUsersForSuperAdmin()
    const classIds = []
    ;(Array.isArray(users) ? users : []).forEach(function(user){
      normalizeCheckAssignmentValues(user && user.classIds).forEach(function(classId){
        classIds.push(classId)
      })
    })
    return buildPortalPrepClassEntriesFromIds(classIds, classMap)
  }
  return buildPortalPrepClassEntriesFromIds(
    typeof getProfileClassIds === 'function' ? getProfileClassIds() : [],
    classMap
  )
}

function normalizePortalPrepConfig(){
  const next = {
    pageTitle: APP_CONFIG.defaultTitle,
    globalPassword: '',
    generatedAt: '',
    examKey: ''
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
    if(typeof source.examKey === 'string' && source.examKey.trim()){
      next.examKey = source.examKey.trim()
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
      legacyIndex: inventory.length,
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
      isDirectVideo: isPortalDirectPrepVideoPayload(doc.payload),
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
  const catalogClasses = normalizePortalPrepClassList(catalogPayload.classes)
  const legacyClasses = normalizePortalPrepClassList(legacyBundle ? legacyBundle.classes : [])
  const fallbackClasses = mergePortalPrepClasses(legacyClasses, prepClasses)
  const baseClasses = catalogClasses.length ? catalogClasses : fallbackClasses
  const classMap = buildPortalPrepClassMap(
    PORTAL_CLASS_REFERENCE,
    baseClasses,
    portalState.checkData && portalState.checkData.classes ? portalState.checkData.classes : []
  )
  const scopedClasses = await loadPortalScopedPrepClassEntries(classMap)
  const classes = mergePortalPrepClasses(baseClasses, scopedClasses)
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
  const legacySets = legacyData ? legacyData.checkSets.slice().map(function(checkSet){
    return Object.assign({}, checkSet, {
      docId: '',
      isManaged: false,
      updatedAt: '',
      fileName: ''
    })
  }) : []
  const uploadedSets = setDocs.map(function(doc){
    const checkSet = normalizeStoredCheckSet(doc.payload)
    if(!checkSet) return null
    return Object.assign({}, checkSet, {
      docId: doc.docId,
      isManaged: true,
      updatedAt: doc.updatedAt,
      fileName: doc.fileName
    })
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

function isPortalDirectPrepVideoPayload(payload){
  return !!(
    payload &&
    (
      payload.kind === 'prep-video' ||
      payload.source === 'direct-video' ||
      payload.createdByLab === 'code-lab-video' ||
      payload.isDirectVideo === true
    )
  )
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
      showPassageScreen()
      syncPortalAdminSetPanels('passage-screen')
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

function getPortalPrepVideoInputValue(passageIndex){
  const input = document.getElementById('prep-video-url-input-' + String(passageIndex))
  return String(input && input.value || '').trim()
}

function getPortalPrepVideoTitleInputValue(passageIndex){
  const input = document.getElementById('prep-video-title-input-' + String(passageIndex))
  return String(input && input.value || '').trim()
}

function normalizePortalPrepYouTubeUrl(value){
  const rawValue = String(value || '').trim()
  if(!rawValue) return null

  const parsed = typeof parsePassageVideoUrl === 'function' ? parsePassageVideoUrl(rawValue) : null
  if(!parsed || parsed.provider !== 'youtube' || !parsed.id) return null

  const videoId = String(parsed.id || '').trim()
  if(!videoId) return null

  return {
    videoId: videoId,
    url: 'https://www.youtube.com/watch?v=' + videoId,
    embedUrl: 'https://www.youtube.com/embed/' + videoId
  }
}

function getPortalPrepVideoUploadTargetClass(){
  let classInfo = getPortalUploadTargetClass('prep')
  if((!classInfo || !classInfo.id) && typeof ensureScopedAdminPrepSelection === 'function'){
    ensureScopedAdminPrepSelection()
    classInfo = getPortalUploadTargetClass('prep')
  }
  if(!classInfo || !classInfo.id){
    const visibleEntries = typeof window.getVisiblePortalPrepClassEntries === 'function'
      ? window.getVisiblePortalPrepClassEntries()
      : []
    if(visibleEntries[0] && visibleEntries[0].classInfo){
      classInfo = visibleEntries[0].classInfo
    }
  }
  if(!classInfo || !classInfo.id){
    const profileClassIds = typeof getProfileClassIds === 'function' ? getProfileClassIds() : []
    const fallbackId = String(profileClassIds[0] || '').trim()
    if(fallbackId){
      classInfo = { id: fallbackId, name: fallbackId, password: '' }
    }
  }
  return classInfo
}

function buildPortalPrepVideoRecord(title, normalizedUrl, classInfo){
  const now = new Date().toISOString()
  const docId = createPortalManagedSetId('prep-video')
  const videoTitle = String(title || '').trim()
  const passage = {
    id: 'video-1',
    title: videoTitle,
    text: '',
    videoUrl: normalizedUrl.url,
    videoEmbedUrl: normalizedUrl.embedUrl,
    videoTitle: videoTitle,
    videoProvider: 'youtube',
    videoUpdatedAt: now,
    video: {
      url: normalizedUrl.url,
      embedUrl: normalizedUrl.embedUrl,
      title: videoTitle,
      provider: 'youtube',
      updatedAt: now
    }
  }

  return {
    docId: docId,
    title: videoTitle,
    classIds: [classInfo.id],
    fileName: 'direct-video-link',
    sortOrder: Date.now(),
    payload: {
      kind: 'prep-video',
      id: docId,
      title: videoTitle,
      source: 'direct-video',
      sourceName: '직접 영상 업로드',
      createdByLab: 'code-lab-video',
      isDirectVideo: true,
      startDate: '',
      endDate: '',
      savedAt: now,
      questionCounts: {},
      passages: [passage],
      classAssignments: [{
        classId: classInfo.id,
        passageIndexes: [0]
      }]
    }
  }
}

async function createPortalPrepVideoByPrompt(){
  if(!isPortalAdmin()){
    showToast('관리자만 PREP 영상을 업로드할 수 있습니다.', 'var(--red)')
    return
  }

  const classInfo = getPortalPrepVideoUploadTargetClass()
  if(!classInfo || !classInfo.id){
    showToast('먼저 반을 선택해 주세요.', 'var(--red)')
    return
  }
  if(!canManagePortalClass(classInfo)){
    showToast('현재 계정으로 관리할 수 없는 반입니다.', 'var(--red)')
    return
  }

  const titleRaw = typeof window.prompt === 'function'
    ? window.prompt('PREP 영상 제목을 입력해 주세요.')
    : ''
  if(titleRaw == null) return
  const title = String(titleRaw || '').trim()
  if(!title){
    showToast('영상 제목을 입력해 주세요.', 'var(--red)')
    return
  }

  const urlRaw = typeof window.prompt === 'function'
    ? window.prompt('유튜브 링크를 붙여넣어 주세요.', 'https://www.youtube.com/watch?v=')
    : ''
  if(urlRaw == null) return
  const normalizedUrl = normalizePortalPrepYouTubeUrl(urlRaw)
  if(!normalizedUrl){
    showToast('유튜브 링크 형식을 확인해 주세요.', 'var(--red)')
    return
  }

  try{
    const record = buildPortalPrepVideoRecord(title, normalizedUrl, classInfo)
    await savePrepClassCatalog(classInfo)
    await saveCloudSetDoc('prep', record.docId, record)
    await syncPrepContentAfterLogin(true)
    restorePortalPrepClassSelection(classInfo.id)
    showPassageScreen()
    syncPortalAdminSetPanels('passage-screen')
    showToast('PREP 영상을 업로드했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('PREP 영상 업로드 중 오류가 발생했습니다.', 'var(--red)')
  }
}

function sanitizePortalPrepProgressSegment(value){
  return sanitizeId(String(value || '').trim()) || 'unknown'
}

function getPortalPrepProgressSetId(studySet, setIndex){
  return sanitizePortalPrepProgressSegment(
    studySet && studySet.id ||
    (typeof setIndex === 'number' ? ('set-' + setIndex) : 'set')
  )
}

function getPortalPrepProgressPassageId(passage, passageIndex){
  return sanitizePortalPrepProgressSegment(
    passage && (passage.id || passage.title) ||
    (typeof passageIndex === 'number' ? ('passage-' + passageIndex) : 'passage')
  )
}

function buildPortalPrepVideoProgressDocId(userId, setId, passageId, passageIndex){
  return [
    sanitizePortalPrepProgressSegment(userId),
    sanitizePortalPrepProgressSegment(setId),
    sanitizePortalPrepProgressSegment(passageId),
    sanitizePortalPrepProgressSegment(typeof passageIndex === 'number' ? passageIndex : 0)
  ].join('__')
}

function readLocalPortalPrepVideoProgressRows(){
  try{
    const raw = localStorage.getItem(PORTAL_ENHANCEMENT_KEYS.prepVideoProgress)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.map(normalizePortalPrepVideoProgressRecord).filter(Boolean) : []
  }catch(error){
    console.error(error)
    return []
  }
}

function writeLocalPortalPrepVideoProgressRows(rows){
  localStorage.setItem(PORTAL_ENHANCEMENT_KEYS.prepVideoProgress, JSON.stringify(Array.isArray(rows) ? rows : []))
}

function saveLocalPortalPrepVideoProgressRecord(record){
  const rows = readLocalPortalPrepVideoProgressRows().filter(function(entry){
    return String(entry && (entry.id || entry.docId) || '').trim() !== String(record && record.id || '').trim()
  })
  rows.push(record)
  writeLocalPortalPrepVideoProgressRows(rows)
}

function normalizePortalPrepVideoProgressRecord(source){
  if(!source || typeof source !== 'object') return null
  const id = String(source.id || source.docId || '').trim()
  const setId = String(source.setId || '').trim()
  const passageId = String(source.passageId || '').trim()
  const userId = String(source.userId || '').trim()
  if(!setId || !passageId || !userId) return null
  return {
    id: id || buildPortalPrepVideoProgressDocId(userId, setId, passageId, Number(source.passageIndex || 0)),
    userId: userId,
    loginId: String(source.loginId || '').trim(),
    email: String(source.email || '').trim().toLowerCase(),
    name: String(source.name || '').trim(),
    studentId: String(source.studentId || '').trim(),
    classId: String(source.classId || '').trim(),
    classIds: Array.isArray(source.classIds) ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean) : [],
    setId: setId,
    setTitle: String(source.setTitle || '').trim(),
    passageId: passageId,
    passageIndex: Number(source.passageIndex || 0),
    passageTitle: String(source.passageTitle || '').trim(),
    videoTitle: String(source.videoTitle || '').trim(),
    videoUrl: String(source.videoUrl || '').trim(),
    done: !!source.done,
    completedAt: String(source.completedAt || '').trim(),
    clearedAt: String(source.clearedAt || '').trim(),
    updatedAt: String(source.updatedAt || '').trim()
  }
}

async function savePortalPrepVideoProgress(options){
  const settings = options || {}
  const studySet = settings.studySet || null
  const passage = settings.passage || null
  const profile = portalState.currentProfile || {}
  const authUser = portalState.currentUser || {}
  const userId = String(authUser.uid || profile.uid || profile.id || '').trim()
  if(!userId || !studySet || !passage) return false

  const classIds = typeof getProfileClassIds === 'function'
    ? getProfileClassIds()
    : (Array.isArray(profile.classIds) ? profile.classIds : [])
  const currentClass = typeof getCurrentClass === 'function' ? getCurrentClass() : null
  const classId = String(currentClass && currentClass.id || classIds[0] || '').trim()
  const setId = getPortalPrepProgressSetId(studySet, settings.setIndex)
  const passageIndex = Number(settings.passageIndex || 0)
  const passageId = getPortalPrepProgressPassageId(passage, passageIndex)
  const docId = buildPortalPrepVideoProgressDocId(userId, setId, passageId, passageIndex)
  const now = new Date().toISOString()
  const done = !!settings.done
  const record = normalizePortalPrepVideoProgressRecord({
    id: docId,
    userId: userId,
    loginId: profile.loginId || authUser.loginId || '',
    email: profile.email || authUser.email || '',
    name: profile.name || '',
    studentId: profile.studentId || '',
    classId: classId,
    classIds: classIds,
    setId: setId,
    setTitle: studySet.title || '',
    passageId: passageId,
    passageIndex: passageIndex,
    passageTitle: passage.title || '',
    videoTitle: passage.videoTitle || passage.title || '',
    videoUrl: passage.videoUrl || '',
    done: done,
    completedAt: done ? now : '',
    clearedAt: done ? '' : now,
    updatedAt: now
  })
  if(!record) return false

  if(portalState.firebaseEnabled && portalState.db){
    await portalState.db.collection(PORTAL_PREP_VIDEO_PROGRESS_COLLECTION).doc(docId).set(record, { merge: true })
  }else{
    saveLocalPortalPrepVideoProgressRecord(record)
  }
  return true
}

async function fetchPortalPrepVideoProgressRows(filters){
  const settings = filters || {}
  const targetSetId = String(settings.setId || '').trim()
  const targetClassId = String(settings.classId || '').trim()
  let rows = []
  let usedCloud = false

  if(portalState.firebaseEnabled && portalState.db){
    try{
      let query = portalState.db.collection(PORTAL_PREP_VIDEO_PROGRESS_COLLECTION)
      if(targetSetId) query = query.where('setId', '==', targetSetId)
      const snapshot = await query.get()
      usedCloud = true
      rows = snapshot.docs.map(function(doc){
        return normalizePortalPrepVideoProgressRecord(Object.assign({ id: doc.id }, doc.data() || {}))
      }).filter(Boolean)
    }catch(error){
      console.warn('prep video progress read fallback:', error && error.message ? error.message : error)
    }
  }

  if(!usedCloud){
    rows = readLocalPortalPrepVideoProgressRows()
  }

  return rows.filter(function(row){
    if(targetSetId && String(row && row.setId || '').trim() !== targetSetId) return false
    if(targetClassId){
      const rowClassIds = Array.isArray(row && row.classIds) ? row.classIds : []
      if(String(row && row.classId || '').trim() !== targetClassId && rowClassIds.indexOf(targetClassId) < 0) return false
    }
    return true
  })
}

async function fetchAllPortalPrepVideoProgress(){
  return fetchPortalPrepVideoProgressRows({})
}

function getPortalClassInfoById(classId){
  const targetId = String(classId || '').trim()
  return (Array.isArray(prepClasses) ? prepClasses : []).find(function(classInfo){
    return String(classInfo && classInfo.id || '').trim() === targetId
  }) || (targetId ? { id: targetId, name: targetId, password: '' } : null)
}

function getPortalPrepProgressClassId(record, currentDoc){
  const activeClass = typeof getCurrentClass === 'function' ? getCurrentClass() : null
  const classIds = Array.isArray(record && record.classIds) && record.classIds.length
    ? record.classIds
    : (Array.isArray(currentDoc && currentDoc.classIds) ? currentDoc.classIds : [])
  const activeId = String(activeClass && activeClass.id || '').trim()
  if(activeId && (!classIds.length || classIds.indexOf(activeId) >= 0)) return activeId
  return String(classIds[0] || '').trim()
}

function getPortalPrepProgressPassages(currentDoc, classId){
  const passages = buildPortalPrepVideoManagerPassages(currentDoc)
  const assignments = Array.isArray(currentDoc && currentDoc.payload && currentDoc.payload.classAssignments)
    ? currentDoc.payload.classAssignments
    : []
  const assignment = assignments.find(function(entry){
    return String(entry && entry.classId || '').trim() === String(classId || '').trim()
  }) || null
  if(!assignment || !Array.isArray(assignment.passageIndexes) || !assignment.passageIndexes.length) return passages
  const allowed = new Set(assignment.passageIndexes.map(function(index){ return Number(index) }))
  return passages.filter(function(passage){
    return allowed.has(Number(passage && passage.index))
  })
}

function normalizePortalPrepProgressStudents(students, classId){
  const targetClassId = String(classId || '').trim()
  return (Array.isArray(students) ? students : []).filter(function(student){
    if(!student || String(student.role || 'student').trim().toLowerCase() === 'admin') return false
    if(student.loginDisabled) return false
    if(!targetClassId) return true
    return Array.isArray(student.classIds) && student.classIds.indexOf(targetClassId) >= 0
  }).sort(function(left, right){
    const leftName = String(left && (left.name || left.loginId || left.studentId || left.email) || '')
    const rightName = String(right && (right.name || right.loginId || right.studentId || right.email) || '')
    return leftName.localeCompare(rightName, 'ko')
  })
}

function normalizePortalPrepProgressMatchValue(value){
  return String(value || '').trim().toLowerCase()
}

function doesPortalPrepProgressMatchStudent(row, student){
  const rowValues = [
    row && row.userId,
    row && row.studentId,
    row && row.loginId,
    row && row.email
  ].map(normalizePortalPrepProgressMatchValue).filter(Boolean)
  const studentValues = [
    student && student.uid,
    student && student.id,
    student && student.studentId,
    student && student.loginId,
    student && student.email
  ].map(normalizePortalPrepProgressMatchValue).filter(Boolean)
  return studentValues.some(function(value){
    return rowValues.indexOf(value) >= 0
  })
}

function getPortalPrepProgressForStudent(rows, student, passage){
  const passageId = String(passage && passage.id || '').trim()
  const passageIndex = Number(passage && passage.index || 0)
  return (Array.isArray(rows) ? rows : []).filter(function(row){
    if(String(row && row.passageId || '').trim() !== passageId) return false
    if(Number(row && row.passageIndex || 0) !== passageIndex) return false
    return doesPortalPrepProgressMatchStudent(row, student)
  }).sort(function(left, right){
    return String(right && right.updatedAt || '').localeCompare(String(left && left.updatedAt || ''))
  })[0] || null
}

function countPortalPrepProgressDone(students, rows, passage){
  return (Array.isArray(students) ? students : []).reduce(function(sum, student){
    const progressRow = getPortalPrepProgressForStudent(rows, student, passage)
    return sum + (progressRow && progressRow.done ? 1 : 0)
  }, 0)
}

function getPortalPrepArchiveClassIdsForSet(prepSetDoc){
  const payload = prepSetDoc && prepSetDoc.payload && typeof prepSetDoc.payload === 'object'
    ? prepSetDoc.payload
    : {}
  const assignmentClassIds = Array.isArray(payload.classAssignments)
    ? payload.classAssignments.map(function(assignment){
        return String(assignment && assignment.classId || '').trim()
      }).filter(Boolean)
    : []
  const docClassIds = Array.isArray(prepSetDoc && prepSetDoc.classIds)
    ? prepSetDoc.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    : []
  return Array.from(new Set(assignmentClassIds.concat(docClassIds)))
}

function buildPortalPrepVideoProgressArchiveRows(prepSets, users, progressRows, classes){
  const classNameMap = new Map((Array.isArray(classes) ? classes : []).map(function(classInfo){
    return [
      String(classInfo && classInfo.id || '').trim(),
      String(classInfo && classInfo.name || '').trim()
    ]
  }))
  const rows = []

  ;(Array.isArray(prepSets) ? prepSets : []).forEach(function(prepSetDoc){
    const payload = prepSetDoc && prepSetDoc.payload && typeof prepSetDoc.payload === 'object'
      ? prepSetDoc.payload
      : null
    if(!payload) return

    const setId = getPortalPrepProgressSetId(payload, 0)
    const setTitle = String(prepSetDoc && prepSetDoc.title || payload.title || setId).trim()
    const classIds = getPortalPrepArchiveClassIdsForSet(prepSetDoc)
    classIds.forEach(function(classId){
      const classStudents = normalizePortalPrepProgressStudents(users, classId)
      const classProgressRows = (Array.isArray(progressRows) ? progressRows : []).filter(function(row){
        if(String(row && row.setId || '').trim() !== setId) return false
        const rowClassIds = Array.isArray(row && row.classIds) ? row.classIds : []
        return String(row && row.classId || '').trim() === classId || rowClassIds.indexOf(classId) >= 0
      })
      const passages = getPortalPrepProgressPassages(prepSetDoc, classId)
      passages.forEach(function(passage){
        classStudents.forEach(function(student){
          const progressRow = getPortalPrepProgressForStudent(classProgressRows, student, passage)
          const isDone = !!(progressRow && progressRow.done)
          rows.push({
            docId: String(prepSetDoc && prepSetDoc.docId || '').trim(),
            setId: setId,
            setTitle: setTitle,
            classId: classId,
            className: classNameMap.get(classId) || classId,
            passageIndex: Number(passage && passage.index || 0),
            passageId: String(passage && passage.id || '').trim(),
            passageTitle: String(passage && (passage.videoTitle || passage.title) || '').trim(),
            videoUrl: String(passage && passage.videoUrl || '').trim(),
            userId: String(student && (student.uid || student.id) || '').trim(),
            loginId: String(student && student.loginId || '').trim(),
            studentId: String(student && student.studentId || '').trim(),
            name: String(student && (student.name || student.loginId || student.studentId || student.email) || '').trim(),
            email: String(student && student.email || '').trim(),
            done: isDone,
            status: isDone ? 'done' : 'pending',
            completedAt: isDone && progressRow ? String(progressRow.completedAt || '').trim() : '',
            updatedAt: progressRow ? String(progressRow.updatedAt || '').trim() : ''
          })
        })
      })
    })
  })

  return rows
}

function renderPortalPrepProgressStudentRows(students, rows, passage){
  if(!students.length){
    return '<div class="empty-box">이 반에 표시할 학생이 없습니다.</div>'
  }
  return students.map(function(student){
    const progressRow = getPortalPrepProgressForStudent(rows, student, passage)
    const isDone = !!(progressRow && progressRow.done)
    const displayName = String(student && (student.name || student.loginId || student.studentId || student.email) || '학생').trim()
    const meta = [
      student && student.loginId ? ('ID ' + student.loginId) : '',
      student && student.studentId && student.studentId !== student.loginId ? ('학생ID ' + student.studentId) : '',
      isDone && progressRow.completedAt ? ('완료 ' + formatAdminTime(progressRow.completedAt)) : '완료 기록 없음'
    ].filter(Boolean).join(' · ')
    return '' +
      '<div class="admin-content-item">' +
        '<div class="admin-content-item-body">' +
          '<div class="admin-content-item-title">' + escapeHtml(displayName) + '</div>' +
          '<div class="admin-content-item-meta">' + escapeHtml(meta) + '</div>' +
        '</div>' +
        '<div class="admin-content-item-actions">' +
          '<span class="admin-content-chip ' + (isDone ? 'live' : 'legacy') + '">' + escapeHtml(isDone ? '완료' : '미완료') + '</span>' +
        '</div>' +
      '</div>'
  }).join('')
}

function renderPortalPrepVideoProgressModal(){
  const modal = document.getElementById('prep-video-progress-modal')
  const titleNode = document.getElementById('prep-video-progress-title')
  const metaNode = document.getElementById('prep-video-progress-meta')
  const noteNode = document.getElementById('prep-video-progress-note')
  const listNode = document.getElementById('prep-video-progress-list')
  const statusNode = document.getElementById('prep-video-progress-status')
  if(!modal || !titleNode || !metaNode || !listNode || !statusNode) return

  const state = portalState.prepVideoProgressModal || {}
  if(!state.open){
    modal.classList.add('hidden')
    modal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')
    listNode.innerHTML = ''
    statusNode.textContent = ''
    syncPortalPrepProgressHeaderChips(null, null)
    return
  }

  modal.classList.remove('hidden')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
  titleNode.textContent = state.title ? ('시청 현황 · ' + state.title) : 'PREP 영상 시청 현황'
  titleNode.textContent = state.title || 'PREP 영상'
  metaNode.textContent = [state.className || state.classId || '', state.status || ''].filter(Boolean).join(' · ')
  if(noteNode){
    noteNode.textContent = '학생이 영상 완료 버튼을 누른 기록 기준입니다. 유튜브를 실제로 끝까지 봤는지까지 검증하는 기능은 아닙니다.'
  }

  if(state.isLoading){
    syncPortalPrepProgressHeaderChips(null, null)
    listNode.innerHTML = '<div class="empty-box">시청 현황을 불러오는 중입니다...</div>'
    statusNode.textContent = 'Firebase 기록을 확인하고 있습니다.'
    return
  }

  const students = Array.isArray(state.students) ? state.students : []
  const rows = Array.isArray(state.progressRows) ? state.progressRows : []
  const passages = state.currentDoc ? getPortalPrepProgressPassages(state.currentDoc, state.classId) : []
  if(!passages.length){
    syncPortalPrepProgressHeaderChips(null, null)
    listNode.innerHTML = '<div class="empty-box">' + escapeHtml(state.status || '이 PREP 세트에서 확인할 영상을 찾지 못했습니다.') + '</div>'
    statusNode.textContent = state.status || ''
    return
  }

  const totalSlots = students.length * passages.length
  const doneSlots = passages.reduce(function(sum, passage){
    return sum + countPortalPrepProgressDone(students, rows, passage)
  }, 0)
  statusNode.textContent = '전체 ' + totalSlots + '건 중 완료 ' + doneSlots + '건, 미완료 ' + Math.max(totalSlots - doneSlots, 0) + '건'
  syncPortalPrepProgressHeaderChips(doneSlots, Math.max(totalSlots - doneSlots, 0))

  listNode.innerHTML = passages.map(function(passage){
    const doneCount = countPortalPrepProgressDone(students, rows, passage)
    const pendingCount = Math.max(students.length - doneCount, 0)
    return '' +
      '<div class="prep-video-manager-item">' +
        '<div class="prep-video-manager-item-head">' +
          '<div>' +
            '<div class="prep-video-manager-item-title">' + escapeHtml(String(passage.index + 1) + '. ' + (passage.videoTitle || passage.title || 'PREP 영상')) + '</div>' +
            '<div class="prep-video-manager-item-meta">' +
              '<span class="admin-content-chip live">' + escapeHtml('완료 ' + doneCount) + '</span>' +
              '<span class="admin-content-chip legacy">' + escapeHtml('미완료 ' + pendingCount) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="prep-video-manager-item-copy">' +
          '<div class="admin-content-list">' + renderPortalPrepProgressStudentRows(students, rows, passage) + '</div>' +
        '</div>' +
      '</div>'
  }).join('')
}

function syncPortalPrepProgressHeaderChips(doneCount, pendingCount){
  let summaryNode = document.getElementById('prep-video-progress-header-chips')
  if(summaryNode && summaryNode.parentNode) summaryNode.parentNode.removeChild(summaryNode)
}

function closePortalPrepVideoProgressModal(){
  portalState.prepVideoProgressModal = Object.assign({}, portalState.prepVideoProgressModal || {}, {
    open: false,
    isLoading: false
  })
  renderPortalPrepVideoProgressModal()
}

async function openPortalPrepVideoProgressModal(docId){
  if(!isPortalAdmin()){
    showToast('관리자만 PREP 시청 현황을 확인할 수 있습니다.', 'var(--red)')
    return
  }
  const targetDocId = String(docId || '').trim()
  if(!targetDocId) return
  const inventoryRecord = (Array.isArray(portalState.prepSetInventory) ? portalState.prepSetInventory : []).find(function(record){
    return String(record && record.docId || '').trim() === targetDocId
  }) || null

  portalState.prepVideoProgressModal = Object.assign({}, portalState.prepVideoProgressModal || {}, {
    open: true,
    isLoading: true,
    docId: targetDocId,
    title: inventoryRecord && inventoryRecord.title || '',
    classId: '',
    className: '',
    currentDoc: null,
    students: [],
    progressRows: [],
    status: '불러오는 중'
  })
  renderPortalPrepVideoProgressModal()

  try{
    const currentDoc = await getCloudSetDoc('prep', targetDocId)
    if(!currentDoc || !currentDoc.payload) throw new Error('PREP 세트 정보를 찾지 못했습니다.')
    const classId = getPortalPrepProgressClassId(inventoryRecord || currentDoc, currentDoc)
    const classInfo = getPortalClassInfoById(classId)
    if(classInfo && !canManagePortalClass(classInfo)){
      throw new Error('현재 계정으로 확인할 수 없는 반입니다.')
    }
    const setId = getPortalPrepProgressSetId(currentDoc.payload, 0)
    const students = normalizePortalPrepProgressStudents(await fetchAdminStudentProfiles(), classId)
    const progressRows = await fetchPortalPrepVideoProgressRows({ setId: setId, classId: classId })

    portalState.prepVideoProgressModal = Object.assign({}, portalState.prepVideoProgressModal || {}, {
      open: true,
      isLoading: false,
      docId: targetDocId,
      title: currentDoc.title || currentDoc.payload.title || targetDocId,
      classId: classId,
      className: classInfo && classInfo.name || classId,
      currentDoc: currentDoc,
      students: students,
      progressRows: progressRows,
      status: students.length + '명 대상'
    })
    renderPortalPrepVideoProgressModal()
  }catch(error){
    console.error(error)
    portalState.prepVideoProgressModal = Object.assign({}, portalState.prepVideoProgressModal || {}, {
      open: true,
      isLoading: false,
      status: String(error && error.message || '시청 현황을 불러오지 못했습니다.')
    })
    renderPortalPrepVideoProgressModal()
  }
}

function canUsePortalCloudStorage(){
  return !!(portalState.storage && typeof portalState.storage.ref === 'function')
}

function buildPortalPrepVideoManagerPassages(currentDoc){
  const rawPassages = Array.isArray(currentDoc && currentDoc.payload && currentDoc.payload.passages)
    ? currentDoc.payload.passages
    : []

  return rawPassages.map(function(passage, index){
    const normalized = buildPassageState(passage, index)
    const nestedVideo = passage && passage.video && typeof passage.video === 'object' ? passage.video : {}
    return {
      index: index,
      id: String(passage && passage.id || normalized.id || ('passage-' + (index + 1))).trim(),
      title: normalized.title,
      preview: normalized.videoDescription || normalized.textLines[0] || String(normalized.text || '').slice(0, 120),
      hasVideo: !!normalized.hasVideo,
      videoUrl: String(normalized.videoUrl || '').trim(),
      videoEmbedUrl: String(normalized.videoEmbedUrl || '').trim(),
      videoProvider: String(normalized.videoProvider || '').trim(),
      videoTitle: String(normalized.videoTitle || normalized.title || '').trim(),
      videoFileName: String(passage && passage.videoFileName || nestedVideo.fileName || '').trim(),
      videoStoragePath: String(passage && passage.videoStoragePath || nestedVideo.storagePath || '').trim(),
      videoUpdatedAt: String(passage && passage.videoUpdatedAt || nestedVideo.updatedAt || '').trim()
    }
  })
}

function renderPortalPrepVideoManager(){
  const modal = document.getElementById('prep-video-manager-modal')
  const titleNode = document.getElementById('prep-video-manager-title')
  const metaNode = document.getElementById('prep-video-manager-meta')
  const noteNode = document.getElementById('prep-video-manager-note')
  const listNode = document.getElementById('prep-video-manager-list')
  const statusNode = document.getElementById('prep-video-manager-status')
  if(!modal || !titleNode || !metaNode || !listNode || !statusNode) return

  const manager = portalState.prepVideoManager || {}
  manager.isUploading = !!manager.isSaving
  if(!manager.open){
    modal.classList.add('hidden')
    modal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')
    listNode.innerHTML = ''
    if(noteNode) noteNode.textContent = '지문마다 유튜브 링크를 붙여넣어 저장할 수 있습니다. 저장이 끝나면 학생 화면에서 바로 재생됩니다.'
    statusNode.textContent = '유튜브 링크를 입력해 주세요.'
    statusNode.textContent = '업로드할 지문을 선택해 주세요.'
    return
  }

  const passages = buildPortalPrepVideoManagerPassages(manager.currentDoc)
  titleNode.textContent = manager.title || 'PREP 지문 영상 관리'
  metaNode.textContent = String(passages.length) + '개 지문 · 영상 파일을 올리면 학생 화면에 바로 반영됩니다.'
  statusNode.textContent = String(manager.status || '업로드할 지문을 선택해 주세요.')
  titleNode.textContent = manager.title || 'PREP 지문 영상 관리'
  metaNode.textContent = String(passages.length) + '개 지문에 유튜브 영상을 연결할 수 있습니다.'
  if(noteNode) noteNode.textContent = '공개 또는 일부공개 유튜브 링크를 붙여넣어 저장해 주세요. watch, youtu.be, embed 링크를 모두 인식합니다.'
  statusNode.textContent = String(manager.status || '유튜브 링크를 입력해 주세요.')
  listNode.innerHTML = passages.length
    ? passages.map(function(passage){
        const isSaving = !!manager.isSaving && Number(manager.pendingPassageIndex) === Number(passage.index)
        const isUploading = isSaving
        let currentVideoMeta = passage.hasVideo
          ? [
              passage.videoFileName || '업로드된 영상',
              passage.videoUpdatedAt ? ('업데이트 ' + formatAdminTime(passage.videoUpdatedAt)) : ''
            ].filter(Boolean).join(' · ')
          : '등록된 영상이 없습니다.'

        currentVideoMeta = passage.hasVideo
          ? [
              passage.videoProvider === 'youtube' ? '유튜브 연결됨' : '영상 연결됨',
              passage.videoUpdatedAt ? ('업데이트 ' + formatAdminTime(passage.videoUpdatedAt)) : ''
            ].filter(Boolean).join(' · ')
          : '등록된 영상이 없습니다.'

        return '' +
          '<div class="prep-video-manager-item">' +
            '<div class="prep-video-manager-item-head">' +
              '<div>' +
                '<div class="prep-video-manager-item-title">' + escapeHtml(String(passage.index + 1) + '. ' + passage.title) + '</div>' +
                '<div class="prep-video-manager-item-meta">' +
                  '<span class="admin-content-chip ' + (passage.hasVideo ? 'live' : 'legacy') + '">' + escapeHtml(passage.hasVideo ? '영상 있음' : '영상 없음') + '</span>' +
                  (passage.videoUrl ? '<a class="prep-video-manager-link" href="' + escapeHtml(passage.videoUrl) + '" target="_blank" rel="noopener">새 탭 열기</a>' : '') +
                '</div>' +
              '</div>' +
              '<div class="prep-video-manager-item-actions">' +
                '<button class="btn btn-ghost btn-sm" type="button" onclick="window.savePortalPrepPassageVideoUrl(' + passage.index + ')"' + (manager.isUploading ? ' disabled' : '') + '>' + (isUploading ? '저장 중...' : '저장') + '</button>' +
              '</div>' +
            '</div>' +
            '<div class="prep-video-manager-item-copy">' + escapeHtml(passage.preview || '지문 미리보기가 없습니다.') + '</div>' +
            '<div class="prep-video-manager-item-status">' + escapeHtml(currentVideoMeta) + '</div>' +
          '</div>'
      }).join('')
    : '<div class="empty-box">이 PREP 세트에는 지문이 없습니다.</div>'

  if(passages.length){
    Array.from(listNode.querySelectorAll('.prep-video-manager-item')).forEach(function(itemNode, itemIndex){
      const passage = passages[itemIndex]
      if(!passage) return

      const actionButtons = itemNode.querySelectorAll('.prep-video-manager-item-actions .btn')
      const saveButton = actionButtons[0] || null
      const deleteButton = actionButtons[1] || null
      const statusLabel = itemNode.querySelector('.prep-video-manager-item-status')
      const metaChip = itemNode.querySelector('.admin-content-chip')
      const externalLink = itemNode.querySelector('.prep-video-manager-link')
      const copyNode = itemNode.querySelector('.prep-video-manager-item-copy')
      const isSaving = !!manager.isSaving && Number(manager.pendingPassageIndex) === Number(passage.index)
      const normalizedVideoStatus = passage.hasVideo
        ? [
            passage.videoProvider === 'youtube' ? '유튜브 연결됨' : '영상 연결됨',
            passage.videoUpdatedAt ? ('업데이트 ' + formatAdminTime(passage.videoUpdatedAt)) : ''
          ].filter(Boolean).join(' · ')
        : '등록된 영상이 없습니다.'
      let currentVideoMeta = normalizedVideoStatus

      if(metaChip) metaChip.textContent = passage.hasVideo ? '영상 있음' : '영상 없음'
      if(externalLink) externalLink.textContent = '새 탭 열기'
      if(copyNode && !copyNode.textContent.trim()) copyNode.textContent = '지문 미리보기가 없습니다.'
      if(statusLabel) statusLabel.textContent = currentVideoMeta = passage.hasVideo
        ? [
            passage.videoProvider === 'youtube' ? '유튜브 연결됨' : '영상 연결됨',
            passage.videoUpdatedAt ? ('업데이트 ' + formatAdminTime(passage.videoUpdatedAt)) : ''
          ].filter(Boolean).join(' · ')
        : '등록된 영상이 없습니다.'

      if(statusLabel) statusLabel.textContent = normalizedVideoStatus

      if(saveButton){
        saveButton.textContent = isSaving ? '저장 중...' : '저장'
        saveButton.disabled = !!manager.isSaving
        saveButton.setAttribute('onclick', 'window.savePortalPrepPassageVideoUrl(' + passage.index + ')')
      }

      if(deleteButton){
        deleteButton.textContent = '영상 삭제'
        deleteButton.disabled = !passage.hasVideo || !!manager.isSaving
      }

      let titleFieldNode = itemNode.querySelector('.prep-video-manager-title-field')
      if(!titleFieldNode){
        titleFieldNode = document.createElement('label')
        titleFieldNode.className = 'prep-video-manager-field prep-video-manager-title-field'
        titleFieldNode.innerHTML = '' +
          '<span class="prep-video-manager-field-label">영상 이름</span>' +
          '<input class="prep-video-manager-input prep-video-manager-title-input" type="text">' +
          '<span class="prep-video-manager-help">학생 화면에 보이는 영상 제목입니다.</span>'
        const anchorNode = itemNode.querySelector('.prep-video-manager-item-copy')
        if(anchorNode){
          itemNode.insertBefore(titleFieldNode, anchorNode)
        }else{
          itemNode.appendChild(titleFieldNode)
        }
      }

      const titleInputNode = titleFieldNode.querySelector('.prep-video-manager-title-input')
      if(titleInputNode){
        titleInputNode.id = 'prep-video-title-input-' + passage.index
        titleInputNode.setAttribute('data-passage-index', String(passage.index))
        titleInputNode.placeholder = '영상 이름'
        titleInputNode.value = passage.videoTitle || passage.title || ''
        titleInputNode.disabled = !!manager.isSaving
      }

      let fieldNode = itemNode.querySelector('.prep-video-manager-url-field')
      if(!fieldNode){
        fieldNode = document.createElement('label')
        fieldNode.className = 'prep-video-manager-field prep-video-manager-url-field'
        fieldNode.innerHTML = '' +
          '<span class="prep-video-manager-field-label">유튜브 링크</span>' +
          '<input class="prep-video-manager-input" type="url">' +
          '<span class="prep-video-manager-help">watch, youtu.be, embed 링크를 붙여넣으면 학생 화면에서 바로 재생됩니다.</span>'
        const anchorNode = itemNode.querySelector('.prep-video-manager-item-status')
        if(anchorNode){
          itemNode.insertBefore(fieldNode, anchorNode)
        }else{
          itemNode.appendChild(fieldNode)
        }
      }

      const inputNode = fieldNode.querySelector('.prep-video-manager-input')
      if(inputNode){
        inputNode.id = 'prep-video-url-input-' + passage.index
        inputNode.setAttribute('data-passage-index', String(passage.index))
        inputNode.placeholder = 'https://www.youtube.com/watch?v=...'
        inputNode.value = passage.videoUrl || ''
        inputNode.disabled = !!manager.isSaving
      }

      if(externalLink && fieldNode && fieldNode.parentNode){
        externalLink.textContent = '유튜브 열기'
        externalLink.classList.add('prep-video-manager-link-below')
        fieldNode.parentNode.insertBefore(externalLink, fieldNode.nextSibling)
      }
    })
    syncPortalPrepVideoManagerFooterActions()
  }else{
    syncPortalPrepVideoManagerFooterActions()
    const emptyNode = listNode.querySelector('.empty-box')
    if(emptyNode) emptyNode.textContent = '이 PREP 세트에는 지문이 없습니다.'
  }

  modal.classList.remove('hidden')
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
}

function syncPortalPrepVideoManagerFooterActions(){
  const modal = document.getElementById('prep-video-manager-modal')
  const footerActions = modal ? modal.querySelector('.prep-video-manager-foot .prep-video-manager-actions') : null
  const cancelButton = document.getElementById('prep-video-manager-cancel-btn')
  if(!modal || !footerActions || !cancelButton) return

  Array.from(footerActions.querySelectorAll('.prep-video-footer-save-btn')).forEach(function(button){
    button.parentNode.removeChild(button)
  })

  Array.from(modal.querySelectorAll('.prep-video-manager-item-actions .btn')).forEach(function(button){
    const onclickValue = String(button.getAttribute('onclick') || '')
    if(onclickValue.indexOf('savePortalPrepPassageVideoUrl') < 0) return
    button.classList.add('prep-video-footer-save-btn')
    footerActions.insertBefore(button, cancelButton)
  })
}

function closePortalPrepVideoManager(options){
  const settings = options || {}
  const manager = portalState.prepVideoManager || {}
  if(!manager.open) return true
  if(manager.isSaving && !settings.force) return false

  portalState.prepVideoManager = {
    open: false,
    isSaving: false,
    docId: '',
    title: '',
    currentDoc: null,
    status: '업로드할 지문을 선택해 주세요.',
    pendingPassageIndex: -1
  }
  renderPortalPrepVideoManager()
  return true
}

async function openPortalPrepVideoManager(docId){
  if(!isPortalAdmin()){
    showToast('관리자만 PREP 영상을 관리할 수 있습니다.', 'var(--red)')
    return
  }

  if(portalState.prepVideoManager && portalState.prepVideoManager.open){
    const currentId = String(portalState.prepVideoManager.docId || '').trim()
    if(currentId === String(docId || '').trim()) return
    if(!closePortalPrepVideoManager()) return
  }

  try{
    const currentDoc = await getCloudSetDoc('prep', docId)
    if(!currentDoc || !currentDoc.payload){
      showToast('영상 업로드할 PREP 세트를 찾지 못했습니다.', 'var(--red)')
      return
    }
    if(!Array.isArray(currentDoc.payload.passages) || !currentDoc.payload.passages.length){
      showToast('이 PREP 세트에는 지문이 없습니다.', 'var(--red)')
      return
    }
    portalState.prepVideoManager = {
      open: true,
      isSaving: false,
      docId: String(currentDoc.docId || '').trim(),
      title: String(currentDoc.title || currentDoc.payload.title || 'PREP 지문 영상 관리').trim(),
      currentDoc: clonePlainData(currentDoc),
      status: '유튜브 링크를 입력한 뒤 저장해 주세요.',
      pendingPassageIndex: -1
    }
    renderPortalPrepVideoManager()
    return
    if(!canUsePortalCloudStorage()){
      showToast('Firebase Storage 연결이 필요합니다. 클라우드 로그인 상태를 확인해 주세요.', 'var(--red)')
      return
    }

    portalState.prepVideoManager = {
      open: true,
      isUploading: false,
      docId: String(currentDoc.docId || '').trim(),
      title: String(currentDoc.title || currentDoc.payload.title || 'PREP 지문 영상 관리').trim(),
      currentDoc: clonePlainData(currentDoc),
      status: '업로드할 지문을 선택해 주세요.',
      pendingPassageIndex: -1
    }
    renderPortalPrepVideoManager()
  }catch(error){
    console.error(error)
    showToast('PREP 영상 관리 화면을 여는 중 오류가 발생했습니다.', 'var(--red)')
  }
}

function requestPortalPrepVideoUpload(passageIndex){
  const manager = portalState.prepVideoManager || {}
  if(!manager.open || manager.isUploading) return
  manager.pendingPassageIndex = Number(passageIndex)
  const input = document.getElementById('prep-video-upload-input')
  if(input) input.click()
}

async function handlePortalPrepVideoUploadChange(event){
  const file = event && event.target && event.target.files ? event.target.files[0] : null
  if(event && event.target) event.target.value = ''
  if(!file) return

  const manager = portalState.prepVideoManager || {}
  const passageIndex = Number(manager.pendingPassageIndex)
  if(!manager.open || !manager.currentDoc || !Number.isInteger(passageIndex) || passageIndex < 0){
    showToast('영상 업로드 대상을 찾지 못했습니다.', 'var(--red)')
    return
  }
  if(!canUsePortalCloudStorage()){
    showToast('Firebase Storage 연결이 필요합니다.', 'var(--red)')
    return
  }

  const rawPassages = Array.isArray(manager.currentDoc.payload && manager.currentDoc.payload.passages)
    ? manager.currentDoc.payload.passages
    : []
  const rawPassage = rawPassages[passageIndex]
  if(!rawPassage){
    showToast('선택한 지문 정보를 찾지 못했습니다.', 'var(--red)')
    return
  }

  const normalizedPassage = buildPassageState(rawPassage, passageIndex)
  const classId = Array.isArray(manager.currentDoc.classIds) && manager.currentDoc.classIds.length
    ? manager.currentDoc.classIds[0]
    : 'shared'
  const oldStoragePath = String(rawPassage && rawPassage.videoStoragePath || rawPassage && rawPassage.video && rawPassage.video.storagePath || '').trim()
  const fileName = sanitizePortalStoragePathPart(file.name || ('video-' + (passageIndex + 1)))
  const storagePath = [
    'prep-videos',
    sanitizePortalStoragePathPart(classId),
    sanitizePortalStoragePathPart(manager.docId),
    'passage-' + String(passageIndex + 1).padStart(2, '0') + '-' + Date.now() + '-' + fileName
  ].join('/')

  manager.isSaving = true
  manager.status = '"' + (normalizedPassage.title || ('지문 ' + (passageIndex + 1))) + '" 영상 업로드 중...'
  renderPortalPrepVideoManager()

  try{
    const storageRef = portalState.storage.ref().child(storagePath)
    const snapshot = await storageRef.put(file, {
      contentType: file.type || 'video/mp4',
      customMetadata: {
        setId: manager.docId,
        passageId: String(rawPassage && rawPassage.id || normalizedPassage.id || ''),
        classId: classId
      }
    })
    const downloadUrl = await snapshot.ref.getDownloadURL()
    const now = new Date().toISOString()
    const nextDoc = clonePlainData(manager.currentDoc) || {}
    const nextPayload = clonePlainData(nextDoc.payload) || {}
    const nextPassages = Array.isArray(nextPayload.passages) ? nextPayload.passages.slice() : []
    const nextPassage = Object.assign({}, nextPassages[passageIndex] || {})
    const nextVideoTitle = String(nextPassage.videoTitle || nextPassage.title || normalizedPassage.title || ('지문 ' + (passageIndex + 1))).trim()

    nextPassage.videoUrl = downloadUrl
    nextPassage.videoEmbedUrl = ''
    nextPassage.videoTitle = nextVideoTitle
    nextPassage.videoFileName = String(file.name || '').trim()
    nextPassage.videoStoragePath = storagePath
    nextPassage.videoUpdatedAt = now
    nextPassage.video = Object.assign({}, nextPassage.video && typeof nextPassage.video === 'object' ? nextPassage.video : {}, {
      url: downloadUrl,
      embedUrl: '',
      title: nextVideoTitle,
      fileName: String(file.name || '').trim(),
      storagePath: storagePath,
      updatedAt: now
    })
    nextPassages[passageIndex] = nextPassage
    nextPayload.passages = nextPassages

    await saveCloudSetDoc('prep', manager.docId, Object.assign({}, nextDoc, {
      payload: nextPayload
    }))

    if(oldStoragePath && oldStoragePath !== storagePath){
      deletePortalStorageFileByPath(oldStoragePath)
    }

    await syncPrepContentAfterLogin(true)
    const refreshedDoc = await getCloudSetDoc('prep', manager.docId)
    portalState.prepVideoManager.currentDoc = refreshedDoc ? clonePlainData(refreshedDoc) : Object.assign({}, nextDoc, { payload: nextPayload })
    portalState.prepVideoManager.title = String((refreshedDoc && refreshedDoc.title) || manager.title || '').trim()
    portalState.prepVideoManager.isSaving = false
    portalState.prepVideoManager.pendingPassageIndex = -1
    portalState.prepVideoManager.status = '"' + (normalizedPassage.title || ('지문 ' + (passageIndex + 1))) + '" 영상 업로드가 완료되었습니다.'

    const targetClass = getPortalUploadTargetClass('prep')
    if(targetClass && targetClass.id){
      restorePortalPrepClassSelection(targetClass.id)
    }
    syncPortalAdminSetPanels(getCurrentActiveScreenId())
    renderPortalPrepVideoManager()
    showToast('PREP 지문 영상을 업로드했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    portalState.prepVideoManager.isSaving = false
    portalState.prepVideoManager.pendingPassageIndex = -1
    portalState.prepVideoManager.status = '영상 업로드 중 오류가 발생했습니다.'
    renderPortalPrepVideoManager()
    showToast('PREP 영상 업로드 중 오류가 발생했습니다.', 'var(--red)')
  }
}

async function savePortalPrepPassageVideoUrl(passageIndex){
  const manager = portalState.prepVideoManager || {}
  if(!manager.open || manager.isSaving || !manager.currentDoc) return

  const normalizedUrl = normalizePortalPrepYouTubeUrl(getPortalPrepVideoInputValue(passageIndex))
  if(!normalizedUrl){
    showToast('유튜브 링크 형식을 확인해 주세요.', 'var(--red)')
    return
  }

  const rawPassages = Array.isArray(manager.currentDoc.payload && manager.currentDoc.payload.passages)
    ? manager.currentDoc.payload.passages
    : []
  const rawPassage = rawPassages[Number(passageIndex)]
  if(!rawPassage){
    showToast('선택한 지문을 찾지 못했습니다.', 'var(--red)')
    return
  }

  const nextTitle = getPortalPrepVideoTitleInputValue(passageIndex) || String(rawPassage.title || '').trim()
  if(!nextTitle){
    showToast('영상 이름을 입력해 주세요.', 'var(--red)')
    return
  }

  const normalizedPassage = buildPassageState(rawPassage, Number(passageIndex))
  const oldStoragePath = String(rawPassage.videoStoragePath || rawPassage.video && rawPassage.video.storagePath || '').trim()

  manager.isSaving = true
  manager.pendingPassageIndex = Number(passageIndex)
  manager.status = '"' + nextTitle + '" 영상 수정 저장 중...'
  renderPortalPrepVideoManager()

  try{
    const now = new Date().toISOString()
    const nextDoc = clonePlainData(manager.currentDoc) || {}
    const nextPayload = clonePlainData(nextDoc.payload) || {}
    const nextPassages = Array.isArray(nextPayload.passages) ? nextPayload.passages.slice() : []
    const nextPassage = Object.assign({}, nextPassages[Number(passageIndex)] || {})
    const nextVideoTitle = nextTitle

    nextPassage.title = nextTitle
    nextPassage.videoUrl = normalizedUrl.url
    nextPassage.videoEmbedUrl = normalizedUrl.embedUrl
    nextPassage.videoTitle = nextVideoTitle
    nextPassage.videoUpdatedAt = now
    delete nextPassage.videoFileName
    delete nextPassage.videoStoragePath
    nextPassage.video = Object.assign({}, nextPassage.video && typeof nextPassage.video === 'object' ? nextPassage.video : {}, {
      url: normalizedUrl.url,
      embedUrl: normalizedUrl.embedUrl,
      title: nextVideoTitle,
      provider: 'youtube',
      updatedAt: now
    })
    delete nextPassage.video.fileName
    delete nextPassage.video.storagePath
    nextPassages[Number(passageIndex)] = nextPassage
    nextPayload.passages = nextPassages
    if(isPortalDirectPrepVideoPayload(nextPayload)){
      nextPayload.title = nextTitle
      nextDoc.title = nextTitle
    }

    await saveCloudSetDoc('prep', manager.docId, Object.assign({}, nextDoc, {
      payload: nextPayload
    }))
    if(oldStoragePath){
      deletePortalStorageFileByPath(oldStoragePath)
    }

    await syncPrepContentAfterLogin(true)
    const refreshedDoc = await getCloudSetDoc('prep', manager.docId)
    portalState.prepVideoManager.currentDoc = refreshedDoc ? clonePlainData(refreshedDoc) : Object.assign({}, nextDoc, { payload: nextPayload })
    portalState.prepVideoManager.title = String((refreshedDoc && refreshedDoc.title) || (isPortalDirectPrepVideoPayload(nextPayload) ? nextTitle : '') || manager.title || '').trim()
    portalState.prepVideoManager.isSaving = false
    portalState.prepVideoManager.pendingPassageIndex = -1
    portalState.prepVideoManager.status = '"' + nextTitle + '" 영상 수정이 저장되었습니다.'

    const targetClass = getPortalUploadTargetClass('prep')
    if(targetClass && targetClass.id){
      restorePortalPrepClassSelection(targetClass.id)
    }
    syncPortalAdminSetPanels(getCurrentActiveScreenId())
    renderPortalPrepVideoManager()
    showToast('PREP 영상 정보를 저장했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    portalState.prepVideoManager.isSaving = false
    portalState.prepVideoManager.pendingPassageIndex = -1
    portalState.prepVideoManager.status = '영상 수정 저장 중 오류가 발생했습니다.'
    renderPortalPrepVideoManager()
    showToast('PREP 영상 수정 저장 중 오류가 발생했습니다.', 'var(--red)')
  }
}

async function removePortalPrepPassageVideo(passageIndex){
  const manager = portalState.prepVideoManager || {}
  if(!manager.open || manager.isSaving || !manager.currentDoc) return
  if(false && !canUsePortalCloudStorage()){
    showToast('Firebase Storage 연결이 필요합니다.', 'var(--red)')
    return
  }

  const rawPassages = Array.isArray(manager.currentDoc.payload && manager.currentDoc.payload.passages)
    ? manager.currentDoc.payload.passages
    : []
  const rawPassage = rawPassages[Number(passageIndex)]
  if(!rawPassage) return
  const normalizedPassage = buildPassageState(rawPassage, Number(passageIndex))
  if(!normalizedPassage.hasVideo){
    showToast('삭제할 영상이 없습니다.', 'var(--blue)')
    return
  }
  if(typeof window.confirm === 'function' && !window.confirm('이 지문의 영상을 삭제할까요?')) return

  const oldStoragePath = String(rawPassage.videoStoragePath || rawPassage.video && rawPassage.video.storagePath || '').trim()
  manager.isSaving = true
  manager.pendingPassageIndex = Number(passageIndex)
  manager.status = '"' + (normalizedPassage.title || ('지문 ' + (Number(passageIndex) + 1))) + '" 영상 삭제 중...'
  renderPortalPrepVideoManager()

  try{
    const nextDoc = clonePlainData(manager.currentDoc) || {}
    const nextPayload = clonePlainData(nextDoc.payload) || {}
    const nextPassages = Array.isArray(nextPayload.passages) ? nextPayload.passages.slice() : []
    const nextPassage = Object.assign({}, nextPassages[Number(passageIndex)] || {})
    delete nextPassage.videoUrl
    delete nextPassage.videoEmbedUrl
    delete nextPassage.videoPoster
    delete nextPassage.videoFileName
    delete nextPassage.videoStoragePath
    delete nextPassage.videoUpdatedAt
    delete nextPassage.video
    nextPassages[Number(passageIndex)] = nextPassage
    nextPayload.passages = nextPassages

    await saveCloudSetDoc('prep', manager.docId, Object.assign({}, nextDoc, {
      payload: nextPayload
    }))
    if(oldStoragePath){
      deletePortalStorageFileByPath(oldStoragePath)
    }

    await syncPrepContentAfterLogin(true)
    const refreshedDoc = await getCloudSetDoc('prep', manager.docId)
    portalState.prepVideoManager.currentDoc = refreshedDoc ? clonePlainData(refreshedDoc) : Object.assign({}, nextDoc, { payload: nextPayload })
    portalState.prepVideoManager.isSaving = false
    portalState.prepVideoManager.pendingPassageIndex = -1
    portalState.prepVideoManager.status = '"' + (normalizedPassage.title || ('지문 ' + (Number(passageIndex) + 1))) + '" 영상이 삭제되었습니다.'

    const targetClass = getPortalUploadTargetClass('prep')
    if(targetClass && targetClass.id){
      restorePortalPrepClassSelection(targetClass.id)
    }
    syncPortalAdminSetPanels(getCurrentActiveScreenId())
    renderPortalPrepVideoManager()
    showToast('PREP 지문 영상을 삭제했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    portalState.prepVideoManager.isSaving = false
    portalState.prepVideoManager.pendingPassageIndex = -1
    portalState.prepVideoManager.status = '영상 삭제 중 오류가 발생했습니다.'
    renderPortalPrepVideoManager()
    showToast('PREP 영상 삭제 중 오류가 발생했습니다.', 'var(--red)')
  }
}

async function deletePortalStorageFileByPath(storagePath){
  if(!canUsePortalCloudStorage()) return false
  const path = String(storagePath || '').trim()
  if(!path) return false
  try{
    await portalState.storage.ref().child(path).delete()
    return true
  }catch(error){
    console.warn('storage delete skipped:', error && error.message ? error.message : error)
    return false
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

function buildPortalManagedCheckSetEditorSavePayload(editor, targetDoc){
  const sourceDoc = targetDoc || editor && editor.currentDoc || {}
  const nextPayload = clonePlainData(sourceDoc && sourceDoc.payload) || {}
  const draftMap = buildPortalManagedCheckSetEditorDraftMap(editor && editor.questions)
  applyPortalManagedCheckSetEditorDraftsToPayload(nextPayload, draftMap)
  nextPayload.id = String(nextPayload.id || sourceDoc && sourceDoc.docId || editor && editor.docId || '').trim()
  nextPayload.title = String(editor && editor.title || nextPayload.title || 'CHECK 세트').trim()
  nextPayload.availableFrom = String(editor && editor.startDate || '').trim()
  nextPayload.availableTo = String(editor && editor.endDate || '').trim()
  if(!Array.isArray(nextPayload.classIds) || !nextPayload.classIds.length){
    nextPayload.classIds = Array.isArray(sourceDoc && sourceDoc.classIds)
      ? sourceDoc.classIds.slice()
      : (Array.isArray(editor && editor.currentDoc && editor.currentDoc.classIds)
        ? editor.currentDoc.classIds.slice()
        : [])
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
    if(nextPayload[field] != null || !sourceDoc || sourceDoc[field] == null) return
    nextPayload[field] = clonePlainData(sourceDoc[field])
  })
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

function serializePortalManagedCheckSetEditorState(editor){
  const currentEditor = editor || {}
  return JSON.stringify({
    title: String(currentEditor.title || '').trim(),
    startDate: String(currentEditor.startDate || '').trim(),
    endDate: String(currentEditor.endDate || '').trim(),
    questions: (Array.isArray(currentEditor.questions) ? currentEditor.questions : []).map(function(question){
      return serializePortalManagedCheckSetEditorQuestion(question)
    })
  })
}

function hasPortalManagedCheckSetEditorChanges(){
  const editor = portalState.checkSetEditor || {}
  if(!editor.open) return false
  return serializePortalManagedCheckSetEditorState(editor) !== String(editor.initialDigest || '')
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
      '<div class="check-set-editor-grid">' +
        '<label class="check-set-editor-field">' +
          '<span class="check-set-editor-label">' + (isChoice ? '정답 번호' : '정답') + '</span>' +
          answerField +
          '<span class="check-set-editor-help">' + (isChoice ? '복수 정답은 1,3처럼 쉼표로 입력해 주세요.' : '맞음 또는 틀림 중 하나를 선택해 주세요.') + '</span>' +
        '</label>' +
        '<label class="check-set-editor-field">' +
          '<span class="check-set-editor-label">해설</span>' +
          '<textarea data-editor-field="explanation" data-question-id="' + escapeHtml(questionId) + '" placeholder="학생에게 보여줄 해설을 입력해 주세요.">' + escapeHtml(String(question && question.explanation || '')) + '</textarea>' +
        '</label>' +
      '</div>' +
    '</section>'
}

function buildPortalManagedCheckSetInlineEditorHtml(){
  const editor = portalState.checkSetEditor || {}
  const titleValue = String(editor.title || '').trim()
  const startDate = String(editor.startDate || '').trim()
  const endDate = String(editor.endDate || '').trim()
  const questions = Array.isArray(editor.questions) ? editor.questions : []
  return '' +
    '<div class="check-inline-set-editor" id="check-set-editor-inline" onclick="event.stopPropagation()">' +
      '<div class="check-inline-set-editor-section">' +
        '<label class="check-set-editor-field check-inline-name-field">' +
          '<span class="check-set-editor-label">이름</span>' +
          '<input class="check-set-editor-input" type="text" data-editor-field="title" value="' + escapeHtml(titleValue) + '" placeholder="CHECK 세트 이름">' +
        '</label>' +
      '</div>' +
      '<div class="check-inline-set-editor-section">' +
        '<div class="check-inline-section-title">기간</div>' +
        '<div class="check-inline-date-grid">' +
          '<label class="check-set-editor-field">' +
            '<span class="check-set-editor-label">시작일</span>' +
            '<input class="check-set-editor-input" type="date" data-editor-field="startDate" value="' + escapeHtml(startDate) + '">' +
            '<span class="check-set-editor-help">비우면 시작 제한 없이 열립니다.</span>' +
          '</label>' +
          '<label class="check-set-editor-field">' +
            '<span class="check-set-editor-label">종료일</span>' +
            '<input class="check-set-editor-input" type="date" data-editor-field="endDate" value="' + escapeHtml(endDate) + '">' +
            '<span class="check-set-editor-help">비우면 종료 제한 없이 열립니다.</span>' +
          '</label>' +
        '</div>' +
      '</div>' +
      '<div class="check-inline-set-editor-section">' +
        '<div class="check-inline-section-title check-inline-question-title">문항<span class="check-inline-set-editor-count">' + escapeHtml(String(questions.length)) + '문항</span></div>' +
        '<div class="check-inline-question-list">' +
          (questions.length
            ? questions.map(function(question){ return buildPortalManagedCheckSetEditorItemHtml(question) }).join('')
            : '<div class="admin-content-item-empty">수정할 문항이 없습니다.</div>') +
        '</div>' +
      '</div>' +
    '</div>'
}

function handlePortalManagedCheckSetEditorFieldChange(event){
  const target = event && event.target
  if(!target || !target.dataset) return
  const field = String(target.dataset.editorField || '').trim()
  const questionId = String(target.dataset.questionId || '').trim()
  if(!field) return

  const editor = portalState.checkSetEditor || {}
  if(!editor.open || editor.isSaving) return
  if(field === 'title'){
    editor.title = String(target.value || '').trim()
    syncPortalManagedCheckSetEditorControls()
    return
  }
  if(field === 'startDate' || field === 'endDate'){
    editor[field] = String(target.value || '').trim()
    syncPortalManagedCheckSetEditorControls()
    return
  }
  if(!questionId) return
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

async function savePortalManagedCheckSetEditorForSourceGroup(){
  return savePortalManagedCheckSetEditor('group')
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
  const chipLabel = record && record.isManaged
    ? (kind === 'prep' && record.isDirectVideo ? '영상 업로드' : '직접 업로드')
    : '기존 마스터'
  const editButton = kind === 'check' && record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.openPortalManagedCheckSetEditor(\'' + escapeJs(record.docId) + '\')">문항 수정</button>'
    : ''
  const prepVideoButton = kind === 'prep' && record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.openPortalPrepVideoManager(\'' + escapeJs(record.docId) + '\')">' + (record.isDirectVideo ? '링크 수정' : '영상 관리') + '</button>'
    : ''
  const prepProgressButton = kind === 'prep' && record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.openPortalPrepVideoProgressModal(\'' + escapeJs(record.docId) + '\')">시청 현황</button>'
    : ''
  const isRegrading = kind === 'check' && String(portalState.checkSetRegradeDocId || '').trim() === String(record && record.docId || '').trim()
  const regradeButton = kind === 'check' && record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.regradePortalManagedCheckSet(\'' + escapeJs(record.docId) + '\')"' + (isRegrading ? ' disabled' : '') + '>' + (isRegrading ? '재채점 중...' : '재채점') + '</button>'
    : ''
  const renameButton = record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.renamePortalManagedSet(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">이름 변경</button>'
    : ''
  const dateButton = record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.changePortalManagedSetDates(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">기간 변경</button>'
    : ''
  const deleteButton = record && record.isManaged
    ? '<button class="btn btn-ghost btn-sm admin-content-action-danger" type="button" onclick="window.removePortalManagedSet(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">삭제</button>'
    : (kind === 'prep' && record && !record.isManaged && record.legacyIndex != null
      ? '<button class="btn btn-ghost btn-sm admin-content-action-danger" type="button" onclick="window.removePortalLegacyPrepSet(' + Number(record.legacyIndex) + ')">삭제</button>'
      : '')
  return '' +
    '<div class="admin-content-item">' +
      '<div class="admin-content-item-body">' +
        '<div class="admin-content-item-title">' + escapeHtml(record && record.title || '') + '</div>' +
        '<div class="admin-content-item-meta">' + escapeHtml(buildPortalManagedSetMetaText(kind, record)) + '</div>' +
      '</div>' +
      '<div class="admin-content-item-actions">' +
        '<span class="admin-content-chip ' + chipClass + '">' + escapeHtml(chipLabel) + '</span>' +
        editButton +
        prepVideoButton +
        prepProgressButton +
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
    ? (classInfo.name + ' 반에 올린 PREP 영상입니다. 영상 업로드 버튼으로 제목과 유튜브 링크를 바로 추가할 수 있습니다.')
    : '먼저 반을 선택하면 PREP 영상을 올릴 수 있습니다.'

  list.innerHTML = records.length
    ? records.map(function(record){
        return buildPortalManagedSetItemHtml('prep', record)
      }).join('')
    : '<div class="admin-content-item-empty">이 반에 연결된 PREP 영상이 아직 없습니다.</div>'
}

function renderPrepPassageAdminSetPanel(activeScreenId){
  const panel = document.getElementById('prep-passage-admin-set-panel')
  const list = document.getElementById('prep-passage-admin-set-list')
  const countNode = document.getElementById('prep-passage-admin-set-count')
  const hintNode = document.getElementById('prep-passage-admin-set-hint')
  const classButton = document.getElementById('prep-passage-admin-class-btn')
  if(!panel || !list || !countNode || !hintNode) return

  const shouldShow = isPortalAdmin() && activeScreenId === 'passage-screen'
  panel.classList.toggle('hidden', !shouldShow)
  if(!shouldShow) return

  const classInfo = typeof getCurrentClass === 'function' ? getCurrentClass() : null
  const records = getVisiblePortalManagedSetRecords('prep', classInfo && classInfo.id)
  const visibleClassEntries = typeof window.getVisiblePortalPrepClassEntries === 'function'
    ? window.getVisiblePortalPrepClassEntries()
    : []
  if(classButton){
    classButton.classList.toggle('hidden', visibleClassEntries.length < 1)
  }
  countNode.textContent = String(records.length)
  hintNode.textContent = classInfo
    ? (classInfo.name + ' 반에 올린 PREP 영상입니다. 영상 업로드 버튼으로 제목과 유튜브 링크를 바로 추가할 수 있습니다.')
    : '현재 선택된 반이 없습니다. 반을 선택한 뒤 PREP 영상을 업로드해 주세요.'

  list.innerHTML = records.length
    ? records.map(function(record){
        return buildPortalManagedSetItemHtml('prep', record)
      }).join('')
    : '<div class="admin-content-item-empty">아직 연결된 PREP 영상이 없습니다. 영상 업로드 버튼으로 제목과 유튜브 링크를 넣어 주세요.</div>'
}

 function syncPortalAdminSetPanels(screenId){
   renderPrepAdminSetPanel(screenId)
   renderPrepPassageAdminSetPanel(screenId)
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
      if(kind === 'prep' && isPortalDirectPrepVideoPayload(nextPayload)){
        const nextPassages = Array.isArray(nextPayload.passages) ? nextPayload.passages.slice() : []
        if(nextPassages[0]){
          const nextPassage = Object.assign({}, nextPassages[0])
          nextPassage.title = nextTitle
          nextPassage.videoTitle = nextTitle
          if(nextPassage.video && typeof nextPassage.video === 'object'){
            nextPassage.video = Object.assign({}, nextPassage.video, { title: nextTitle })
          }
          nextPassages[0] = nextPassage
          nextPayload.passages = nextPassages
        }
      }
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
      showPassageScreen()
      syncPortalAdminSetPanels('passage-screen')
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
      showPassageScreen()
      syncPortalAdminSetPanels('passage-screen')
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

async function removePortalLegacyPrepSet(legacyIndex){
  if(!isPortalAdmin()){
    showToast('관리자만 PREP 세트를 삭제할 수 있습니다.', 'var(--red)')
    return
  }

  const targetIndex = Number(legacyIndex)
  if(!Number.isInteger(targetIndex) || targetIndex < 0){
    showToast('삭제할 PREP 세트를 찾지 못했습니다.', 'var(--red)')
    return
  }

  try{
    const currentDoc = await loadCloudContentDoc(PORTAL_CLOUD_DOCS.prep)
    const currentPayload = currentDoc && currentDoc.payload
      ? clonePlainData(currentDoc.payload)
      : (bundleData ? clonePlainData(bundleData) : null)
    const studySets = Array.isArray(currentPayload && currentPayload.studySets)
      ? currentPayload.studySets.slice()
      : []
    const targetSet = studySets[targetIndex]
    if(!targetSet){
      showToast('삭제할 PREP 세트를 찾지 못했습니다.', 'var(--red)')
      return
    }

    const title = String(targetSet.title || targetSet.name || ('PREP 세트 ' + (targetIndex + 1))).trim()
    const message = '"' + title + '" 기존 PREP 세트를 삭제할까요?'
    if(typeof window.confirm === 'function' && !window.confirm(message)) return

    const targetClass = getPortalUploadTargetClass('prep')
    studySets.splice(targetIndex, 1)
    const nextPayload = Object.assign({}, currentPayload || {}, {
      studySets: studySets
    })
    await saveCloudContentDoc(
      PORTAL_CLOUD_DOCS.prep,
      nextPayload,
      currentDoc && currentDoc.fileName ? currentDoc.fileName : 'session.json'
    )

    await syncPrepContentAfterLogin(true)
    if(targetClass && targetClass.id){
      restorePortalPrepClassSelection(targetClass.id)
    }
    showPassageScreen()
    syncPortalAdminSetPanels('passage-screen')
    showToast('PREP 세트를 삭제했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('PREP 세트 삭제 중 오류가 발생했습니다.', 'var(--red)')
  }
}

async function removePortalPrepPassageVideoFromSet(docId, passageIndex){
  if(!isPortalAdmin()){
    showToast('관리자만 PREP 영상을 삭제할 수 있습니다.', 'var(--red)')
    return
  }

  const targetDocId = String(docId || '').trim()
  const targetPassageIndex = Number(passageIndex)
  if(!targetDocId || !Number.isInteger(targetPassageIndex) || targetPassageIndex < 0){
    showToast('삭제할 영상을 찾지 못했습니다.', 'var(--red)')
    return
  }

  try{
    const currentDoc = await getCloudSetDoc('prep', targetDocId)
    const rawPassages = Array.isArray(currentDoc && currentDoc.payload && currentDoc.payload.passages)
      ? currentDoc.payload.passages
      : []
    const rawPassage = rawPassages[targetPassageIndex]
    if(!rawPassage){
      showToast('삭제할 영상을 찾지 못했습니다.', 'var(--red)')
      return
    }

    const normalizedPassage = buildPassageState(rawPassage, targetPassageIndex)
    if(!normalizedPassage.hasVideo){
      showToast('삭제할 영상이 없습니다.', 'var(--blue)')
      return
    }

    const message = '"' + (normalizedPassage.title || ('지문 ' + (targetPassageIndex + 1))) + '" 영상을 삭제할까요?'
    if(typeof window.confirm === 'function' && !window.confirm(message)) return

    const oldStoragePath = String(rawPassage.videoStoragePath || rawPassage.video && rawPassage.video.storagePath || '').trim()
    const nextDoc = clonePlainData(currentDoc) || {}
    const nextPayload = clonePlainData(nextDoc.payload) || {}
    const nextPassages = Array.isArray(nextPayload.passages) ? nextPayload.passages.slice() : []
    const nextPassage = Object.assign({}, nextPassages[targetPassageIndex] || {})
    delete nextPassage.videoUrl
    delete nextPassage.videoEmbedUrl
    delete nextPassage.videoPoster
    delete nextPassage.videoFileName
    delete nextPassage.videoStoragePath
    delete nextPassage.videoUpdatedAt
    delete nextPassage.video
    nextPassages[targetPassageIndex] = nextPassage
    nextPayload.passages = nextPassages

    await saveCloudSetDoc('prep', targetDocId, Object.assign({}, nextDoc, {
      payload: nextPayload
    }))
    if(oldStoragePath){
      deletePortalStorageFileByPath(oldStoragePath)
    }

    await syncPrepContentAfterLogin(true)
    const targetClassId = Array.isArray(currentDoc.classIds) && currentDoc.classIds.length
      ? currentDoc.classIds[0]
      : ''
    if(targetClassId){
      restorePortalPrepClassSelection(targetClassId)
    }

    if(portalState.prepVideoManager && portalState.prepVideoManager.open && String(portalState.prepVideoManager.docId || '') === targetDocId){
      const refreshedDoc = await getCloudSetDoc('prep', targetDocId)
      portalState.prepVideoManager.currentDoc = refreshedDoc ? clonePlainData(refreshedDoc) : Object.assign({}, nextDoc, { payload: nextPayload })
      portalState.prepVideoManager.status = '"' + (normalizedPassage.title || ('지문 ' + (targetPassageIndex + 1))) + '" 영상을 삭제했습니다.'
      renderPortalPrepVideoManager()
    }

    showPassageScreen()
    syncPortalAdminSetPanels('passage-screen')
    showToast('PREP 지문 영상을 삭제했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    showToast('PREP 영상 삭제 중 오류가 발생했습니다.', 'var(--red)')
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
      showPassageScreen()
      syncPortalAdminSetPanels('passage-screen')
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
function buildPortalManagedSetItemHtml(kind, record){
  const isManaged = !!(record && record.isManaged)
  const isCheck = kind === 'check'
  const isPrep = kind === 'prep'
  const isRegrading = isCheck && String(portalState.checkSetRegradeDocId || '').trim() === String(record && record.docId || '').trim()
  const editorOpen = isCheck &&
    isManaged &&
    portalState.checkSetEditor &&
    portalState.checkSetEditor.open &&
    String(portalState.checkSetEditor.docId || '').trim() === String(record && record.docId || '').trim()
  const prepChip = isPrep
    ? '<span class="admin-content-chip ' + (isManaged ? 'live' : 'legacy') + '">' + escapeHtml(isManaged ? (record.isDirectVideo ? '영상 업로드' : '직접 업로드') : '기존 마스터') + '</span>'
    : ''
  const checkEditButton = isCheck && isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.openPortalManagedCheckSetEditor(\'' + escapeJs(record.docId) + '\')">' + (editorOpen ? '수정 중' : '세트 수정') + '</button>'
    : ''
  const prepVideoButton = isPrep && isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.openPortalPrepVideoManager(\'' + escapeJs(record.docId) + '\')">' + (record.isDirectVideo ? '링크 수정' : '영상 관리') + '</button>'
    : ''
  const prepProgressButton = isPrep && isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.openPortalPrepVideoProgressModal(\'' + escapeJs(record.docId) + '\')">시청 현황</button>'
    : ''
  const regradeButton = isCheck && isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.regradePortalManagedCheckSet(\'' + escapeJs(record.docId) + '\')"' + (isRegrading ? ' disabled' : '') + '>' + (isRegrading ? '재채점 중...' : '재채점') + '</button>'
    : ''
  const renameButton = isPrep && isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.renamePortalManagedSet(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">이름 변경</button>'
    : ''
  const dateButton = isPrep && isManaged
    ? '<button class="btn btn-ghost btn-sm" type="button" onclick="window.changePortalManagedSetDates(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">기간 변경</button>'
    : ''
  const deleteButton = isManaged
    ? '<button class="btn btn-ghost btn-sm admin-content-action-danger" type="button" onclick="window.removePortalManagedSet(\'' + escapeJs(kind) + '\', \'' + escapeJs(record.docId) + '\')">삭제</button>'
    : (isPrep && record && !record.isManaged && record.legacyIndex != null
      ? '<button class="btn btn-ghost btn-sm admin-content-action-danger" type="button" onclick="window.removePortalLegacyPrepSet(' + Number(record.legacyIndex) + ')">삭제</button>'
      : '')
  const inlineEditor = editorOpen ? buildPortalManagedCheckSetInlineEditorHtml() : ''

  return '' +
    '<div class="admin-content-item' + (editorOpen ? ' is-editing-check-set' : '') + '">' +
      '<div class="admin-content-item-main">' +
        '<div class="admin-content-item-body">' +
          '<div class="admin-content-item-title">' + escapeHtml(record && record.title || '') + '</div>' +
          '<div class="admin-content-item-meta">' + escapeHtml(buildPortalManagedSetMetaText(kind, record)) + '</div>' +
        '</div>' +
        '<div class="admin-content-item-actions">' +
          prepChip +
          checkEditButton +
          prepVideoButton +
          prepProgressButton +
          regradeButton +
          renameButton +
          dateButton +
          deleteButton +
        '</div>' +
      '</div>' +
      inlineEditor +
    '</div>'
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
  const hasTitle = !!String(editor.title || '').trim()
  const startDate = String(editor.startDate || '').trim()
  const endDate = String(editor.endDate || '').trim()
  const hasDateError = !!(startDate && endDate && startDate > endDate)
  const canSave = editor.open && !editor.isSaving && hasQuestions && hasChanges && hasTitle && !hasDateError
  const canSaveSourceGroup = canPortalManagedCheckSetSaveSourceGroup(editor)
  saveButton.disabled = !canSave
  saveGroupButton.disabled = !canSave || !canSaveSourceGroup
  cancelButton.disabled = !!editor.isSaving
  closeButton.disabled = !!editor.isSaving
  saveButton.textContent = editor.isSaving && editor.savingScope !== 'group' ? '저장 중...' : '저장'
  saveGroupButton.textContent = editor.isSaving && editor.savingScope === 'group' ? '같은 원본 저장 중...' : '같은 원본 전체 저장'
  statusNode.textContent = editor.isSaving
    ? '세트 수정 내용을 저장하고 있습니다.'
    : (!hasTitle
        ? '세트 이름을 입력해 주세요.'
        : (hasDateError
            ? '종료일은 시작일보다 빠를 수 없습니다.'
            : (!hasQuestions
                ? '수정할 문항이 없습니다.'
                : (hasChanges
                    ? (canSaveSourceGroup ? '변경 사항이 있습니다. 이 세트만 저장하거나 같은 원본 전체에 반영할 수 있습니다.' : '변경 사항이 있습니다.')
                    : '변경 없음'))))
}

function renderPortalManagedCheckSetEditor(){
  const modal = document.getElementById('check-set-editor-modal')
  const titleNode = document.getElementById('check-set-editor-title')
  const metaNode = document.getElementById('check-set-editor-meta')
  const listNode = document.getElementById('check-set-editor-list')
  const editor = portalState.checkSetEditor || {}
  if(!modal || !titleNode || !metaNode || !listNode){
    if(getCurrentActiveScreenId() === 'check-screen' && typeof renderCheckScreen === 'function') renderCheckScreen()
    return
  }

  if(!editor.open){
    modal.classList.add('hidden')
    modal.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('modal-open')
    listNode.innerHTML = ''
    if(getCurrentActiveScreenId() === 'check-screen' && typeof renderCheckScreen === 'function') renderCheckScreen()
    return
  }

  if(getCurrentActiveScreenId() === 'check-screen' && typeof renderCheckScreen === 'function') renderCheckScreen()
  titleNode.textContent = editor.title || 'CHECK 세트 수정'
  metaNode.textContent = ''
  listNode.innerHTML = buildPortalManagedCheckSetInlineEditorHtml()
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
    startDate: '',
    endDate: '',
    currentDoc: null,
    questions: [],
    initialDigest: ''
  }
  renderPortalManagedCheckSetEditor()
  return true
}

async function openPortalManagedCheckSetEditor(docId){
  if(!isPortalAdmin()){
    showToast('관리자만 CHECK 세트를 수정할 수 있습니다.', 'var(--red)')
    return
  }

  const targetId = String(docId || '').trim()
  if(!targetId) return
  if(portalState.checkSetEditor && portalState.checkSetEditor.open){
    const currentId = String(portalState.checkSetEditor.docId || '').trim()
    if(currentId === targetId) return
    if(!closePortalManagedCheckSetEditor()) return
  }

  try{
    const currentDoc = await getCloudSetDoc('check', targetId)
    if(!currentDoc || !currentDoc.payload){
      showToast('수정할 CHECK 세트를 찾지 못했습니다.', 'var(--red)')
      return
    }

    const questions = buildPortalManagedCheckSetEditorQuestions(currentDoc.payload.questions)
    if(!questions.length){
      showToast('이 세트에는 수정할 문항이 없습니다.', 'var(--red)')
      return
    }

    const nextEditor = {
      open: true,
      isSaving: false,
      savingScope: '',
      docId: String(currentDoc.docId || '').trim(),
      title: String(currentDoc.title || currentDoc.payload.title || 'CHECK 세트').trim(),
      startDate: String(currentDoc.payload.availableFrom || '').trim(),
      endDate: String(currentDoc.payload.availableTo || '').trim(),
      currentDoc: clonePlainData(currentDoc),
      questions: questions,
      initialDigest: ''
    }
    nextEditor.initialDigest = serializePortalManagedCheckSetEditorState(nextEditor)
    portalState.checkSetEditor = nextEditor
    renderPortalManagedCheckSetEditor()
  }catch(error){
    console.error(error)
    showToast('CHECK 세트를 불러오는 중 오류가 발생했습니다.', 'var(--red)')
  }
}

async function savePortalManagedCheckSetEditor(mode){
  const editor = portalState.checkSetEditor || {}
  const saveMode = mode === 'group' ? 'group' : 'single'
  if(!editor.open || editor.isSaving) return
  if(!editor.currentDoc || !editor.docId){
    showToast('저장할 세트 정보를 찾지 못했습니다.', 'var(--red)')
    return
  }

  const title = String(editor.title || '').trim()
  if(!title){
    showToast('세트 이름을 입력해 주세요.', 'var(--red)')
    return
  }
  const startDate = String(editor.startDate || '').trim()
  const endDate = String(editor.endDate || '').trim()
  if(startDate && endDate && startDate > endDate){
    showToast('종료일은 시작일보다 빠를 수 없습니다.', 'var(--red)')
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

  try{
    if(saveMode === 'group'){
      const sourceGroupKey = getPortalManagedCheckSetSourceGroupKey(editor.currentDoc)
      const allDocs = await loadCloudSetDocs('check')
      const matchingDocs = allDocs.filter(function(doc){
        return canManagePortalCheckSetRecord(doc) && getPortalManagedCheckSetSourceGroupKey(doc) === sourceGroupKey
      })
      if(!matchingDocs.some(function(doc){ return String(doc && doc.docId || '').trim() === editor.docId })){
        matchingDocs.unshift(normalizePortalSetDoc('check', editor.currentDoc))
      }

      const saveTargets = matchingDocs.map(function(doc){
        const docId = String(doc && doc.docId || '').trim()
        if(!docId || !doc || !doc.payload) return null
        const nextPayload = buildPortalManagedCheckSetEditorSavePayload(editor, doc)
        return {
          docId: docId,
          record: Object.assign({}, doc, {
            title: title,
            payload: nextPayload
          })
        }
      }).filter(Boolean)

      if(!saveTargets.length){
        throw new Error('같은 원본으로 반영할 세트를 찾지 못했습니다.')
      }

      const savedDocIds = []
      for(let index = 0; index < saveTargets.length; index += 1){
        const target = saveTargets[index]
        await saveCloudSetDoc('check', target.docId, target.record)
        savedDocIds.push(target.docId)
      }

      await ensureCheckData(true)
      const currentSetId = String(portalState.currentCheckSet && portalState.currentCheckSet.id || '').trim()
      if(getCurrentActiveScreenId() === 'check-set-screen' && currentSetId && savedDocIds.indexOf(currentSetId) >= 0){
        await openCheckSetPortal(currentSetId, { preserveHistory: true })
      }else{
        renderCheckScreen()
      }
      editor.isSaving = false
      editor.savingScope = ''
      closePortalManagedCheckSetEditor({ force: true })
      syncPortalAdminSetPanels('check-screen')
      showToast('같은 원본 CHECK 세트 ' + saveTargets.length + '개에 이름, 기간, 문항을 반영했습니다.', 'var(--green)')
      return
    }

    const nextPayload = buildPortalManagedCheckSetEditorSavePayload(editor)
    await saveCloudSetDoc('check', editor.docId, Object.assign({}, editor.currentDoc, {
      title: title,
      payload: nextPayload
    }))

    await ensureCheckData(true)
    const currentSetId = String(portalState.currentCheckSet && portalState.currentCheckSet.id || '').trim()
    if(getCurrentActiveScreenId() === 'check-set-screen' && currentSetId === editor.docId){
      await openCheckSetPortal(editor.docId, { preserveHistory: true })
    }else{
      renderCheckScreen()
    }
    editor.isSaving = false
    editor.savingScope = ''
    closePortalManagedCheckSetEditor({ force: true })
    syncPortalAdminSetPanels('check-screen')
    showToast('CHECK 세트를 저장했습니다.', 'var(--green)')
  }catch(error){
    console.error(error)
    editor.isSaving = false
    editor.savingScope = ''
    syncPortalManagedCheckSetEditorControls()
    showToast(String(error && error.message || 'CHECK 세트 저장 중 오류가 발생했습니다.'), 'var(--red)')
  }
}

function resolvePortalManagedCheckSetRecord(entry){
  if(entry && entry.isManaged && String(entry.docId || '').trim()) return entry
  const title = String(entry && entry.title || '').trim()
  const questionCount = Number(Array.isArray(entry && entry.questions) ? entry.questions.length : entry && entry.questionCount || 0)
  const startDate = String(entry && (entry.availableFrom || entry.startDate) || '').trim()
  const endDate = String(entry && (entry.availableTo || entry.endDate) || '').trim()
  const classIds = Array.isArray(entry && entry.classIds)
    ? entry.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    : []
  return (Array.isArray(portalState.checkSetInventory) ? portalState.checkSetInventory : []).find(function(record){
    if(!record || !record.isManaged || !String(record.docId || '').trim()) return false
    if(title && String(record.title || '').trim() !== title) return false
    if(questionCount && Number(record.questionCount || 0) !== questionCount) return false
    if(startDate !== String(record.startDate || '').trim()) return false
    if(endDate !== String(record.endDate || '').trim()) return false
    if(classIds.length){
      const recordClassIds = Array.isArray(record.classIds)
        ? record.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
        : []
      return classIds.some(function(classId){ return recordClassIds.indexOf(classId) >= 0 })
    }
    return true
  }) || null
}

function buildPortalCheckSetCardActionsHtml(entry){
  if(!isPortalAdmin()) return ''
  const record = resolvePortalManagedCheckSetRecord(entry)
  const docId = String(record && record.docId || '').trim()
  if(!docId) return ''
  const isRegrading = String(portalState.checkSetRegradeDocId || '').trim() === docId
  const editorOpen = portalState.checkSetEditor &&
    portalState.checkSetEditor.open &&
    String(portalState.checkSetEditor.docId || '').trim() === docId
  return [
    '<button class="btn btn-ghost btn-sm" type="button" onclick="window.openPortalManagedCheckSetEditor(\'' + escapeJs(docId) + '\')">' + (editorOpen ? '수정 중' : '세트 수정') + '</button>',
    '<button class="btn btn-ghost btn-sm" type="button" onclick="window.regradePortalManagedCheckSet(\'' + escapeJs(docId) + '\')"' + (isRegrading ? ' disabled' : '') + '>' + (isRegrading ? '재채점 중...' : '재채점') + '</button>',
    '<button class="btn btn-ghost btn-sm admin-content-action-danger" type="button" onclick="window.removePortalManagedSet(\'check\', \'' + escapeJs(docId) + '\')">삭제</button>'
  ].join('')
}

function buildPortalCheckSetInlineEditorHtml(entry){
  return ''
}

window.removePortalManagedSet = removePortalManagedSet
window.removePortalLegacyPrepSet = removePortalLegacyPrepSet
window.removePortalPrepPassageVideoFromSet = removePortalPrepPassageVideoFromSet
window.openPrepClassPicker = openPrepClassPicker
window.createPortalPrepVideoByPrompt = createPortalPrepVideoByPrompt
window.openPortalPrepVideoManager = openPortalPrepVideoManager
window.savePortalPrepPassageVideoUrl = savePortalPrepPassageVideoUrl
window.removePortalPrepPassageVideo = removePortalPrepPassageVideo
window.openPortalPrepVideoProgressModal = openPortalPrepVideoProgressModal
window.closePortalPrepVideoProgressModal = closePortalPrepVideoProgressModal
window.savePortalPrepVideoProgress = savePortalPrepVideoProgress
window.openPortalManagedCheckSetEditor = openPortalManagedCheckSetEditor
window.closePortalManagedCheckSetEditor = closePortalManagedCheckSetEditor
window.savePortalManagedCheckSetEditor = savePortalManagedCheckSetEditor
window.buildPortalCheckSetCardActionsHtml = buildPortalCheckSetCardActionsHtml
window.buildPortalCheckSetInlineEditorHtml = buildPortalCheckSetInlineEditorHtml
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

const PORTAL_EXAM_STATE_DOC = 'exam-state'
const SUPERADMIN_DEFAULT_PASSWORD = 'pass1234'
const SUPERADMIN_CLASS_ADMIN_HEADERS = ['classId', 'className', 'managerUid', 'managerLoginId', 'managerName', 'managerEmail', 'managerScope']
const SUPERADMIN_STUDENT_HEADERS = ['uid', 'status', 'loginId', 'name', 'studentId', 'email', 'classId', 'className']

function normalizeUserProfile(source){
  const classIds = Array.isArray(source && source.classIds)
    ? source.classIds.map(function(classId){ return String(classId || '').trim() }).filter(Boolean)
    : []
  const role = String(source && source.role || 'student').trim() || 'student'
  const passwordResetRequired = typeof (source && source.passwordResetRequired) === 'boolean'
    ? !!source.passwordResetRequired
    : false
  const loginDisabled = typeof (source && source.loginDisabled) === 'boolean'
    ? !!source.loginDisabled
    : false
  return {
    uid: String(source && (source.uid || source.id) || '').trim(),
    loginId: derivePortalLoginId(source),
    email: String(source && source.email || '').trim().toLowerCase(),
    name: String(source && source.name || '').trim(),
    studentId: String(source && source.studentId || '').trim(),
    classIds: classIds,
    role: role,
    adminScope: role === 'admin'
      ? normalizeAdminScopeValue(source && source.adminScope)
      : 'assigned',
    loginDisabled: loginDisabled,
    passwordResetRequired: passwordResetRequired,
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function normalizeUserProfileLocal(source){
  const loginId = derivePortalLoginId(source)
  const password = String(source && source.password || '').trim()
  const role = String(source && source.role || 'student').trim() || 'student'
  const resetRequired = typeof (source && source.passwordResetRequired) === 'boolean'
    ? !!source.passwordResetRequired
    : (password === SUPERADMIN_DEFAULT_PASSWORD)
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
    role: role,
    adminScope: role === 'admin'
      ? normalizeAdminScopeValue(source && source.adminScope || 'all')
      : 'assigned',
    loginDisabled: !!(source && source.loginDisabled),
    passwordResetRequired: resetRequired,
    createdAt: String(source && source.createdAt || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function ensurePortalExamCenterState(){
  if(!portalState.examCenter || typeof portalState.examCenter !== 'object'){
    portalState.examCenter = {}
  }
  return portalState.examCenter
}

function normalizePortalExamState(source){
  return {
    examName: String(source && source.examName || '').trim(),
    examKey: String(source && source.examKey || '').trim(),
    lastArchiveAt: String(source && source.lastArchiveAt || '').trim(),
    lastArchiveExamName: String(source && source.lastArchiveExamName || '').trim(),
    lastArchiveBy: String(source && source.lastArchiveBy || '').trim(),
    lastArchiveByName: String(source && source.lastArchiveByName || '').trim(),
    lastResetAt: String(source && source.lastResetAt || '').trim(),
    lastResetBy: String(source && source.lastResetBy || '').trim(),
    lastResetByName: String(source && source.lastResetByName || '').trim(),
    pdfLabResetToken: String(source && source.pdfLabResetToken || '').trim(),
    previousExamName: String(source && source.previousExamName || '').trim(),
    previousExamKey: String(source && source.previousExamKey || '').trim(),
    updatedAt: String(source && source.updatedAt || '').trim()
  }
}

function applyPortalExamState(state){
  const normalized = normalizePortalExamState(state)
  portalState.examState = normalized
  window.ROTATION_PORTAL_EXAM_KEY = normalized.examKey || ''
  return normalized
}

async function loadPortalExamState(forceReload){
  if(portalState.examState && !forceReload) return portalState.examState
  if(portalState.examStatePromise && !forceReload) return portalState.examStatePromise

  portalState.examStatePromise = loadCloudContentDoc(PORTAL_EXAM_STATE_DOC).then(function(doc){
    const payload = doc && doc.payload && typeof doc.payload === 'object'
      ? doc.payload
      : {}
    return applyPortalExamState(payload)
  }).catch(function(error){
    console.warn('exam-state read failed:', error && error.message ? error.message : error)
    return applyPortalExamState({})
  }).finally(function(){
    portalState.examStatePromise = null
  })

  return portalState.examStatePromise
}

async function savePortalExamState(partial){
  const current = await loadPortalExamState(false)
  const now = new Date().toISOString()
  const nextState = normalizePortalExamState(Object.assign({}, current || {}, partial || {}, {
    updatedAt: now
  }))
  await saveCloudContentDoc(PORTAL_EXAM_STATE_DOC, nextState, 'exam-state.json')
  applyPortalExamState(nextState)
  return nextState
}

function buildPortalExamKey(seedName){
  const seed = sanitizeId(String(seedName || 'exam').trim() || 'exam')
  return 'exam-' + seed + '-' + Date.now()
}

function buildPdfLabResetToken(){
  return 'pdf-lab-reset-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
}

function getPortalDisplayIdentity(){
  return String(
    portalState.currentProfile && (portalState.currentProfile.name || portalState.currentProfile.loginId || portalState.currentProfile.studentId)
      || portalState.currentUser && (portalState.currentUser.loginId || portalState.currentUser.email)
      || ''
  ).trim()
}

function getPortalExamCenterNode(id){
  return document.getElementById(id)
}

function setPortalExamCenterStatus(id, text, kind){
  const node = getPortalExamCenterNode(id)
  if(!node) return
  node.textContent = String(text || '').trim()
  node.classList.remove('is-error', 'is-success', 'is-working')
  if(kind) node.classList.add('is-' + kind)
}

function formatPortalDateTime(value){
  const raw = String(value || '').trim()
  if(!raw) return ''
  const date = new Date(raw)
  if(Number.isNaN(date.getTime())) return raw
  return date.toLocaleString('ko-KR', { hour12: false })
}

function buildPortalCsvCell(value){
  const text = String(value == null ? '' : value)
  return /[",\r\n]/.test(text)
    ? ('"' + text.replace(/"/g, '""') + '"')
    : text
}

function buildPortalCsvText(headers, rows){
  const headerRow = headers.map(buildPortalCsvCell).join(',')
  const dataRows = (Array.isArray(rows) ? rows : []).map(function(row){
    return headers.map(function(header){
      return buildPortalCsvCell(row && row[header] != null ? row[header] : '')
    }).join(',')
  })
  return [headerRow].concat(dataRows).join('\r\n')
}

function normalizePortalCsvHeaderKey(value){
  return String(value || '')
    .replace(/^\ufeff/, '')
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, '')
}

function parsePortalCsvText(text){
  const source = String(text || '').replace(/\r\n/g, '\n')
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for(let index = 0; index < source.length; index += 1){
    const char = source[index]
    const nextChar = source[index + 1]

    if(inQuotes){
      if(char === '"' && nextChar === '"'){
        cell += '"'
        index += 1
        continue
      }
      if(char === '"'){
        inQuotes = false
        continue
      }
      cell += char
      continue
    }

    if(char === '"'){
      inQuotes = true
      continue
    }
    if(char === ','){
      row.push(cell)
      cell = ''
      continue
    }
    if(char === '\n'){
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      continue
    }
    cell += char
  }

  row.push(cell)
  if(row.length > 1 || row[0]){
    rows.push(row)
  }

  if(!rows.length) return []
  const headers = rows[0].map(function(header, index){
    return normalizePortalCsvHeaderKey(header) || ('column' + (index + 1))
  })

  return rows.slice(1).map(function(cells){
    const mapped = {}
    headers.forEach(function(header, index){
      mapped[header] = String(cells[index] || '').trim()
    })
    return mapped
  }).filter(function(entry){
    return Object.keys(entry).some(function(key){
      return String(entry[key] || '').trim()
    })
  })
}

function readPortalTextFileFromBrowser(file){
  return new Promise(function(resolve, reject){
    const reader = new FileReader()
    reader.onload = function(){ resolve(String(reader.result || '')) }
    reader.onerror = function(){ reject(reader.error || new Error('File read failed.')) }
    reader.readAsText(file, 'utf-8')
  })
}

async function fetchAllPortalUsersForSuperAdmin(){
  let rows = []
  if(portalState.firebaseEnabled && portalState.db){
    try{
      const snapshot = await portalState.db.collection('users').get()
      rows = snapshot.docs.map(function(doc){
        return normalizeUserProfile(Object.assign({ uid: doc.id }, doc.data() || {}))
      })
    }catch(error){
      console.warn('users superadmin read failed:', error && error.message ? error.message : error)
    }
  }

  if(!rows.length && typeof readLocalUsers === 'function'){
    rows = readLocalUsers().map(function(entry){
      return normalizeUserProfile(Object.assign({}, entry, {
        uid: entry && (entry.uid || entry.id)
      }))
    })
  }

  return rows
}

function buildPortalUserLookup(users){
  const byUid = new Map()
  const byLoginId = new Map()
  const byEmail = new Map()

  ;(Array.isArray(users) ? users : []).forEach(function(user){
    const uid = String(user && user.uid || user && user.id || '').trim()
    const loginId = derivePortalLoginId(user)
    const email = String(user && user.email || '').trim().toLowerCase()
    if(uid) byUid.set(uid, user)
    if(loginId) byLoginId.set(loginId, user)
    if(email) byEmail.set(email, user)
  })

  return {
    byUid: byUid,
    byLoginId: byLoginId,
    byEmail: byEmail
  }
}

function resolvePortalUserFromLookup(lookup, identifiers){
  const uid = String(identifiers && identifiers.uid || '').trim()
  const loginId = derivePortalLoginId({ loginId: identifiers && identifiers.loginId, email: identifiers && identifiers.email })
  const email = String(identifiers && identifiers.email || '').trim().toLowerCase()
  if(uid && lookup.byUid.has(uid)) return lookup.byUid.get(uid)
  if(loginId && lookup.byLoginId.has(loginId)) return lookup.byLoginId.get(loginId)
  if(email && lookup.byEmail.has(email)) return lookup.byEmail.get(email)
  return null
}

function normalizePortalRosterStatus(value){
  const raw = String(value || 'active').trim().toLowerCase()
  if(raw === 'disabled' || raw === 'disable' || raw === 'withdrawn' || raw === 'inactive' || raw === '탈퇴'){
    return 'disabled'
  }
  return 'active'
}

function summarizePortalCounts(rows, predicate){
  return (Array.isArray(rows) ? rows : []).filter(function(entry){
    return predicate ? predicate(entry) : true
  }).length
}

function buildPortalHtmlTable(headers, rows){
  const thead = '<tr>' + headers.map(function(header){
    return '<th>' + escapeHtml(header) + '</th>'
  }).join('') + '</tr>'
  const tbody = (Array.isArray(rows) && rows.length)
    ? rows.map(function(row){
        return '<tr>' + row.map(function(cell){
          return '<td>' + escapeHtml(cell == null ? '' : cell) + '</td>'
        }).join('') + '</tr>'
      }).join('')
    : '<tr><td colspan="' + headers.length + '">데이터 없음</td></tr>'
  return '<table border="1"><thead>' + thead + '</thead><tbody>' + tbody + '</tbody></table>'
}

function buildPortalExamArchiveFileBaseName(examName){
  const base = sanitizeId(String(examName || '').trim() || 'code-lab-exam')
  const stamp = new Date().toISOString().slice(0, 10)
  return base + '-' + stamp
}

function getPortalCurrentExamName(){
  return String(
    portalState.examState && portalState.examState.examName
      || getPortalExamCenterNode('superadmin-archive-exam-name') && getPortalExamCenterNode('superadmin-archive-exam-name').value
      || ''
  ).trim()
}

async function buildPortalExamArchiveSnapshot(examName){
  const [examState, users, responses, issues, counselRequests, prepProgress, prepSets, checkSets, prepSessionDoc, checkDataDoc, classCatalogDoc] = await Promise.all([
    loadPortalExamState(false),
    fetchAllPortalUsersForSuperAdmin(),
    fetchAllCheckResponses(),
    fetchAllQuestionIssues(),
    fetchAllCounselRequests(),
    fetchAllPortalPrepVideoProgress(),
    loadCloudSetDocs('prep'),
    loadCloudSetDocs('check'),
    loadCloudContentDoc(PORTAL_CLOUD_DOCS.prep),
    loadCloudContentDoc(PORTAL_CLOUD_DOCS.check),
    loadCloudContentDoc(PORTAL_CLASS_CATALOG_DOC)
  ])

  const classList = normalizePortalPrepClassList(
    classCatalogDoc && classCatalogDoc.payload && Array.isArray(classCatalogDoc.payload.classes)
      ? classCatalogDoc.payload.classes
      : prepClasses
  )
  const prepProgressReport = buildPortalPrepVideoProgressArchiveRows(prepSets, users, prepProgress, classList)

  return {
    kind: 'code-lab-exam-archive',
    version: 1,
    exportedAt: new Date().toISOString(),
    exportedBy: portalState.currentUser ? portalState.currentUser.uid : '',
    exportedByName: getPortalDisplayIdentity(),
    examName: String(examName || examState.examName || '').trim(),
    examState: clonePlainData(examState) || {},
    prepClasses: clonePlainData(classList) || [],
    users: clonePlainData(users) || [],
    checkResponses: clonePlainData(responses) || [],
    questionIssues: clonePlainData(issues) || [],
    counselRequests: clonePlainData(counselRequests) || [],
    prepVideoProgress: clonePlainData(prepProgress) || [],
    prepVideoProgressReport: clonePlainData(prepProgressReport) || [],
    portalPrepSets: clonePlainData(prepSets) || [],
    portalCheckSets: clonePlainData(checkSets) || [],
    portalContent: {
      prepSession: clonePlainData(prepSessionDoc) || null,
      checkData: clonePlainData(checkDataDoc) || null,
      prepClasses: clonePlainData(classCatalogDoc) || null
    }
  }
}

function buildPortalExamArchiveExcelHtml(snapshot){
  const users = Array.isArray(snapshot && snapshot.users) ? snapshot.users : []
  const prepSets = Array.isArray(snapshot && snapshot.portalPrepSets) ? snapshot.portalPrepSets : []
  const checkSets = Array.isArray(snapshot && snapshot.portalCheckSets) ? snapshot.portalCheckSets : []
  const responses = Array.isArray(snapshot && snapshot.checkResponses) ? snapshot.checkResponses : []
  const issues = Array.isArray(snapshot && snapshot.questionIssues) ? snapshot.questionIssues : []
  const counselRequests = Array.isArray(snapshot && snapshot.counselRequests) ? snapshot.counselRequests : []
  const prepProgress = Array.isArray(snapshot && snapshot.prepVideoProgress) ? snapshot.prepVideoProgress : []
  const prepProgressReport = Array.isArray(snapshot && snapshot.prepVideoProgressReport) ? snapshot.prepVideoProgressReport : []
  const classes = Array.isArray(snapshot && snapshot.prepClasses) ? snapshot.prepClasses : []

  const summaryRows = [
    ['시험명', snapshot && snapshot.examName || ''],
    ['내보낸 시각', formatPortalDateTime(snapshot && snapshot.exportedAt || '')],
    ['현재 examKey', snapshot && snapshot.examState && snapshot.examState.examKey || ''],
    ['반 수', String(classes.length)],
    ['학생 수', String(summarizePortalCounts(users, function(user){ return String(user && user.role || '').trim() !== 'admin' }))],
    ['비활성 학생 수', String(summarizePortalCounts(users, function(user){ return String(user && user.role || '').trim() !== 'admin' && !!(user && user.loginDisabled) }))],
    ['관리자 수', String(summarizePortalCounts(users, function(user){ return String(user && user.role || '').trim() === 'admin' }))],
    ['CHECK 제출 수', String(responses.length)],
    ['질문 수', String(issues.length)],
    ['상담 요청 수', String(counselRequests.length)],
    ['PREP 영상 완료 기록 수', String(prepProgress.length)],
    ['PREP 영상 관리 행 수', String(prepProgressReport.length)],
    ['PREP 세트 수', String(prepSets.length)],
    ['CHECK 세트 수', String(checkSets.length)]
  ]

  const classRows = classes.map(function(classInfo){
    return [
      String(classInfo && classInfo.id || '').trim(),
      String(classInfo && classInfo.name || '').trim(),
      String(classInfo && classInfo.password ? '설정됨' : '').trim()
    ]
  })

  const userRows = users.map(function(user){
    return [
      String(user && user.role || '').trim(),
      String(user && user.adminScope || '').trim(),
      String(user && user.loginDisabled ? 'disabled' : 'active'),
      String(user && user.loginId || '').trim(),
      String(user && user.name || '').trim(),
      String(user && user.studentId || '').trim(),
      String(user && user.email || '').trim(),
      Array.isArray(user && user.classIds) ? user.classIds.join(', ') : ''
    ]
  })

  const responseRows = responses.map(function(entry){
    return [
      String(entry && entry.checkSetTitle || entry && entry.checkSetId || '').trim(),
      String(entry && entry.name || '').trim(),
      String(entry && entry.studentId || '').trim(),
      Array.isArray(entry && entry.classIds) ? entry.classIds.join(', ') : '',
      String(entry && entry.submittedAt || '').trim(),
      String(entry && entry.summary && entry.summary.total || 0),
      String(entry && entry.summary && entry.summary.correct || 0),
      String(entry && entry.summary && entry.summary.wrong || 0)
    ]
  })

  const issueRows = issues.map(function(entry){
    return [
      String(entry && entry.checkSetTitle || '').trim(),
      String(entry && entry.questionNumber || '').trim(),
      String(entry && entry.problemType || '').trim(),
      String(entry && entry.name || '').trim(),
      String(entry && entry.studentId || '').trim(),
      String(entry && entry.status || '').trim(),
      String(entry && entry.createdAt || '').trim(),
      String(entry && entry.prompt || '').trim(),
      String(entry && entry.userAnswer || '').trim()
    ]
  })

  const counselRows = counselRequests.map(function(entry){
    return [
      String(entry && entry.typeLabel || entry && entry.typeTitle || '').trim(),
      String(entry && entry.name || '').trim(),
      String(entry && entry.studentId || '').trim(),
      Array.isArray(entry && entry.classIds) ? entry.classIds.join(', ') : '',
      String(entry && entry.reasonChoice || '').trim(),
      String(entry && entry.reason || '').trim(),
      Array.isArray(entry && entry.currentSubjects) ? entry.currentSubjects.join(', ') : '',
      Array.isArray(entry && entry.withdrawalSubjects) ? entry.withdrawalSubjects.join(', ') : '',
      String(entry && entry.requestedAt || '').trim(),
      String(entry && entry.content || '').trim(),
      String(entry && entry.status || '').trim(),
      String(entry && entry.completedAt || '').trim(),
      String(entry && entry.createdAt || '').trim()
    ]
  })

  const prepProgressRows = prepProgress.map(function(entry){
    return [
      String(entry && entry.setTitle || entry && entry.setId || '').trim(),
      String(entry && entry.passageTitle || entry && entry.videoTitle || '').trim(),
      String(entry && entry.name || '').trim(),
      String(entry && entry.studentId || '').trim(),
      String(entry && entry.loginId || '').trim(),
      String(entry && entry.classId || '').trim(),
      String(entry && entry.done ? '완료' : '미완료'),
      String(entry && entry.completedAt || '').trim(),
      String(entry && entry.updatedAt || '').trim()
    ]
  })

  const prepProgressReportRows = prepProgressReport.map(function(entry){
    return [
      String(entry && entry.setTitle || entry && entry.setId || '').trim(),
      String(entry && entry.className || entry && entry.classId || '').trim(),
      String(entry && entry.passageTitle || '').trim(),
      String(entry && entry.name || '').trim(),
      String(entry && entry.studentId || '').trim(),
      String(entry && entry.loginId || '').trim(),
      String(entry && entry.done ? '완료' : '미완료'),
      String(entry && entry.completedAt || '').trim(),
      String(entry && entry.updatedAt || '').trim(),
      String(entry && entry.videoUrl || '').trim()
    ]
  })

  const prepSetRows = prepSets.map(function(entry){
    const payload = entry && entry.payload ? entry.payload : {}
    return [
      String(entry && entry.docId || '').trim(),
      String(entry && entry.title || '').trim(),
      Array.isArray(entry && entry.classIds) ? entry.classIds.join(', ') : '',
      String(entry && entry.updatedAt || '').trim(),
      String(Array.isArray(payload && payload.passages) ? payload.passages.length : 0)
    ]
  })

  const checkSetRows = checkSets.map(function(entry){
    const payload = entry && entry.payload ? entry.payload : {}
    return [
      String(entry && entry.docId || '').trim(),
      String(entry && entry.title || '').trim(),
      Array.isArray(entry && entry.classIds) ? entry.classIds.join(', ') : '',
      String(payload && payload.assignmentMode || '').trim(),
      String((Array.isArray(payload && payload.targetStudentNames) ? payload.targetStudentNames.join(', ') : payload && payload.targetStudentName) || '').trim(),
      String(payload && payload.sourceSetId || '').trim(),
      String(payload && payload.sourceRound || '').trim(),
      String(entry && entry.updatedAt || '').trim(),
      String(Array.isArray(payload && payload.questions) ? payload.questions.length : 0)
    ]
  })

  return '' +
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' +
      '<head>' +
        '<meta charset="utf-8">' +
        '<style>body{font-family:Malgun Gothic,sans-serif;padding:24px}h1,h2{margin:18px 0 8px}table{border-collapse:collapse;margin-bottom:18px}th,td{padding:6px 8px;white-space:pre-wrap}th{background:#eef4f1}</style>' +
      '</head>' +
      '<body>' +
        '<h1>' + escapeHtml((snapshot && snapshot.examName || '시험 종료') + ' 아카이브') + '</h1>' +
        '<h2>요약</h2>' + buildPortalHtmlTable(['항목', '값'], summaryRows) +
        '<h2>반 목록</h2>' + buildPortalHtmlTable(['classId', 'className', 'password'], classRows) +
        '<h2>사용자</h2>' + buildPortalHtmlTable(['role', 'adminScope', 'status', 'loginId', 'name', 'studentId', 'email', 'classIds'], userRows) +
        '<h2>CHECK 제출</h2>' + buildPortalHtmlTable(['setTitle', 'name', 'studentId', 'classIds', 'submittedAt', 'total', 'correct', 'wrong'], responseRows) +
        '<h2>질문있어요</h2>' + buildPortalHtmlTable(['setTitle', 'questionNumber', 'problemType', 'name', 'studentId', 'status', 'createdAt', 'prompt', 'userAnswer'], issueRows) +
        '<h2>상담 요청</h2>' + buildPortalHtmlTable(['type', 'name', 'studentId', 'classIds', 'reasonChoice', 'reason', 'currentSubjects', 'withdrawalSubjects', 'requestedAt', 'content', 'status', 'completedAt', 'createdAt'], counselRows) +
        '<h2>PREP 영상 관리</h2>' + buildPortalHtmlTable(['setTitle', 'className', 'videoTitle', 'name', 'studentId', 'loginId', 'status', 'completedAt', 'updatedAt', 'videoUrl'], prepProgressReportRows) +
        '<h2>PREP 영상 시청 원본</h2>' + buildPortalHtmlTable(['setTitle', 'passageTitle', 'name', 'studentId', 'loginId', 'classId', 'status', 'completedAt', 'updatedAt'], prepProgressRows) +
        '<h2>PREP 세트</h2>' + buildPortalHtmlTable(['docId', 'title', 'classIds', 'updatedAt', 'passageCount'], prepSetRows) +
        '<h2>CHECK 세트</h2>' + buildPortalHtmlTable(['docId', 'title', 'classIds', 'assignmentMode', 'targets', 'sourceSetId', 'sourceRound', 'updatedAt', 'questionCount'], checkSetRows) +
      '</body>' +
    '</html>'
}

async function downloadPortalExamArchive(examName, mode){
  if(!isPortalSuperAdmin()){
    showToast('최고 관리자만 시험 종료 백업을 실행할 수 있습니다.', 'var(--red)')
    return null
  }

  const trimmedExamName = String(examName || '').trim() || getPortalCurrentExamName()
  if(!trimmedExamName){
    throw new Error('시험명을 먼저 입력해 주세요.')
  }

  const snapshot = await buildPortalExamArchiveSnapshot(trimmedExamName)
  const baseName = buildPortalExamArchiveFileBaseName(trimmedExamName)

  if(mode === 'excel' || mode === 'all'){
    downloadAdminTextFile(baseName + '.xls', buildPortalExamArchiveExcelHtml(snapshot), 'application/vnd.ms-excel;charset=utf-8')
  }
  if(mode === 'json' || mode === 'all'){
    downloadAdminTextFile(baseName + '.json', JSON.stringify(snapshot, null, 2), 'application/json;charset=utf-8')
  }

  await savePortalExamState({
    examName: trimmedExamName,
    lastArchiveAt: snapshot.exportedAt,
    lastArchiveExamName: trimmedExamName,
    lastArchiveBy: snapshot.exportedBy,
    lastArchiveByName: snapshot.exportedByName
  })

  return snapshot
}

function buildSuperAdminClassAdminTemplateRows(users, classes){
  const adminUsers = (Array.isArray(users) ? users : []).filter(function(user){
    return String(user && user.role || '').trim() === 'admin' && normalizeAdminScopeValue(user && user.adminScope) !== 'all'
  })
  const rows = []

  ;(Array.isArray(classes) ? classes : []).forEach(function(classInfo){
    const matchingAdmins = adminUsers.filter(function(user){
      return Array.isArray(user && user.classIds) && user.classIds.indexOf(String(classInfo && classInfo.id || '').trim()) >= 0
    })

    if(!matchingAdmins.length){
      rows.push({
        classId: String(classInfo && classInfo.id || '').trim(),
        className: String(classInfo && classInfo.name || '').trim(),
        managerUid: '',
        managerLoginId: '',
        managerName: '',
        managerEmail: '',
        managerScope: 'assigned'
      })
      return
    }

    matchingAdmins.forEach(function(admin){
      rows.push({
        classId: String(classInfo && classInfo.id || '').trim(),
        className: String(classInfo && classInfo.name || '').trim(),
        managerUid: String(admin && admin.uid || '').trim(),
        managerLoginId: String(admin && admin.loginId || '').trim(),
        managerName: String(admin && admin.name || '').trim(),
        managerEmail: String(admin && admin.email || '').trim(),
        managerScope: normalizeAdminScopeValue(admin && admin.adminScope)
      })
    })
  })

  return rows
}

function buildSuperAdminStudentTemplateRows(users, classes){
  const classMap = new Map((Array.isArray(classes) ? classes : []).map(function(classInfo){
    return [String(classInfo && classInfo.id || '').trim(), String(classInfo && classInfo.name || '').trim()]
  }))

  return (Array.isArray(users) ? users : []).filter(function(user){
    return String(user && user.role || '').trim() !== 'admin'
  }).map(function(user){
    const classId = Array.isArray(user && user.classIds) && user.classIds.length ? String(user.classIds[0] || '').trim() : ''
    return {
      uid: String(user && user.uid || '').trim(),
      status: user && user.loginDisabled ? 'disabled' : 'active',
      loginId: String(user && user.loginId || '').trim(),
      name: String(user && user.name || '').trim(),
      studentId: String(user && user.studentId || '').trim(),
      email: String(user && user.email || '').trim(),
      classId: classId,
      className: classMap.get(classId) || ''
    }
  }).sort(function(left, right){
    return String(left.classId || '').localeCompare(String(right.classId || ''), 'ko')
      || String(left.name || '').localeCompare(String(right.name || ''), 'ko')
  })
}

async function downloadSuperAdminClassAdminTemplate(){
  const users = await fetchAllPortalUsersForSuperAdmin()
  const classes = normalizePortalPrepClassList(prepClasses)
  const rows = buildSuperAdminClassAdminTemplateRows(users, classes)
  downloadAdminTextFile('class-admin-template.csv', buildPortalCsvText(SUPERADMIN_CLASS_ADMIN_HEADERS, rows), 'text/csv;charset=utf-8')
  setPortalExamCenterStatus('superadmin-class-admin-status', '반/관리자 템플릿 CSV를 내려받았습니다.', 'success')
}

async function downloadSuperAdminStudentTemplate(){
  const users = await fetchAllPortalUsersForSuperAdmin()
  const classes = normalizePortalPrepClassList(prepClasses)
  const rows = buildSuperAdminStudentTemplateRows(users, classes)
  downloadAdminTextFile('student-roster-template.csv', buildPortalCsvText(SUPERADMIN_STUDENT_HEADERS, rows), 'text/csv;charset=utf-8')
  setPortalExamCenterStatus('superadmin-student-status', '학생 변동 템플릿 CSV를 내려받았습니다.', 'success')
}

function normalizeSuperAdminClassAdminRows(rows){
  const classNameById = new Map(normalizePortalPrepClassList(prepClasses).map(function(classInfo){
    return [String(classInfo && classInfo.id || '').trim(), String(classInfo && classInfo.name || '').trim()]
  }))

  return (Array.isArray(rows) ? rows : []).map(function(row){
    const classId = sanitizeId(String(row && row.classid || '').trim() || ('class-' + String(row && row.classname || '').trim()))
    const className = String(row && row.classname || classNameById.get(classId) || '').trim()
    return {
      classId: classId,
      className: className,
      managerUid: String(row && row.manageruid || '').trim(),
      managerLoginId: derivePortalLoginId({ loginId: row && row.managerloginid, email: row && row.manageremail }),
      managerName: String(row && row.managername || '').trim(),
      managerEmail: String(row && row.manageremail || '').trim().toLowerCase(),
      managerScope: normalizeAdminScopeValue(row && row.managerscope)
    }
  }).filter(function(entry){
    return entry.classId || entry.className || entry.managerUid || entry.managerLoginId || entry.managerEmail
  })
}

function normalizeSuperAdminStudentRows(rows){
  const classNameById = new Map(normalizePortalPrepClassList(prepClasses).map(function(classInfo){
    return [String(classInfo && classInfo.id || '').trim(), String(classInfo && classInfo.name || '').trim()]
  }))

  return (Array.isArray(rows) ? rows : []).map(function(row){
    const loginId = derivePortalLoginId({ loginId: row && row.loginid, email: row && row.email })
    const classId = sanitizeId(String(row && row.classid || '').trim())
    return {
      uid: String(row && row.uid || '').trim(),
      status: normalizePortalRosterStatus(row && row.status),
      loginId: loginId,
      name: String(row && row.name || '').trim(),
      studentId: String(row && row.studentid || loginId || '').trim(),
      email: String(row && row.email || toPortalLoginEmail(loginId) || '').trim().toLowerCase(),
      classId: classId,
      className: String(row && row.classname || classNameById.get(classId) || '').trim()
    }
  }).filter(function(entry){
    return entry.uid || entry.loginId || entry.email || entry.name || entry.studentId
  })
}

function savePortalUsersLocally(users){
  writeLocalUsers((Array.isArray(users) ? users : []).map(function(entry){
    return normalizeUserProfileLocal(entry)
  }))
}

async function createPortalStudentProfileByAdmin(record){
  if(!portalState.firebaseEnabled || !window.firebase || !window.ROTATION_FIREBASE_CONFIG){
    const users = readLocalUsers()
    const localId = 'local-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
    users.push(normalizeUserProfileLocal({
      id: localId,
      loginId: record.loginId,
      email: record.email,
      password: SUPERADMIN_DEFAULT_PASSWORD,
      name: record.name,
      studentId: record.studentId,
      classIds: record.classIds,
      role: 'student',
      loginDisabled: !!record.loginDisabled,
      passwordResetRequired: true,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    }))
    savePortalUsersLocally(users)
    return { uid: localId }
  }

  const appName = 'portal-superadmin-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
  const secondaryApp = firebase.initializeApp(window.ROTATION_FIREBASE_CONFIG, appName)
  try{
    const secondaryAuth = secondaryApp.auth()
    const secondaryDb = secondaryApp.firestore()
    const credential = await secondaryAuth.createUserWithEmailAndPassword(record.email, SUPERADMIN_DEFAULT_PASSWORD)
    const user = credential && credential.user ? credential.user : secondaryAuth.currentUser
    if(!user) throw new Error('학생 계정을 생성하지 못했습니다.')
    if(record.name){
      try{
        await user.updateProfile({ displayName: record.name })
      }catch(error){}
    }
    await secondaryDb.collection('users').doc(user.uid).set(Object.assign({}, record, {
      uid: user.uid
    }), { merge: true })
    await secondaryAuth.signOut()
    return { uid: user.uid }
  }finally{
    try{
      await secondaryApp.delete()
    }catch(error){}
  }
}

async function persistPortalUserProfileUpdate(uid, payload){
  if(portalState.firebaseEnabled && portalState.db){
    await saveFirebaseUserProfile(uid, payload)
    return
  }

  const users = readLocalUsers()
  const targetIndex = users.findIndex(function(entry){
    return String(entry && (entry.id || entry.uid) || '').trim() === String(uid || '').trim()
  })
  if(targetIndex < 0) return
  users[targetIndex] = normalizeUserProfileLocal(Object.assign({}, users[targetIndex], payload, {
    id: uid
  }))
  savePortalUsersLocally(users)
}

async function saveSuperAdminClassCatalogList(classes, examState){
  const existingClasses = normalizePortalPrepClassList(prepClasses)
  const existingPasswordMap = new Map(existingClasses.map(function(classInfo){
    return [String(classInfo && classInfo.id || '').trim(), String(classInfo && classInfo.password || '').trim()]
  }))
  const normalizedClasses = normalizePortalPrepClassList((Array.isArray(classes) ? classes : []).map(function(classInfo){
    const classId = String(classInfo && classInfo.id || '').trim()
    return {
      id: classId,
      name: String(classInfo && classInfo.name || '').trim(),
      password: String(classInfo && classInfo.password || existingPasswordMap.get(classId) || '').trim()
    }
  }))
  const now = new Date().toISOString()
  const payload = {
    prepConfig: normalizePortalPrepConfig(bundleData && bundleData.prepConfig, {
      generatedAt: now,
      examKey: examState && examState.examKey || ''
    }),
    classes: normalizedClasses
  }
  await saveCloudContentDoc(PORTAL_CLASS_CATALOG_DOC, payload, 'prep-classes.json')
  return normalizedClasses
}

async function applySuperAdminClassAdminRows(){
  if(!isPortalSuperAdmin()){
    showToast('최고 관리자만 반/관리자 재배정을 할 수 있습니다.', 'var(--red)')
    return
  }

  const state = ensurePortalExamCenterState()
  const uploadedRows = normalizeSuperAdminClassAdminRows(state.classAdminRows)
  if(!uploadedRows.length){
    throw new Error('먼저 반/관리자 CSV를 업로드해 주세요.')
  }
  if(typeof window.confirm === 'function' && !window.confirm('반 목록과 관리자 담당 반을 업로드 내용으로 반영할까요?')) return

  const users = await fetchAllPortalUsersForSuperAdmin()
  const adminUsers = users.filter(function(user){
    return String(user && user.role || '').trim() === 'admin'
  })
  const lookup = buildPortalUserLookup(adminUsers)
  const errors = []
  const classRows = []
  const seenClassIds = new Set()
  const assignmentMap = new Map()

  uploadedRows.forEach(function(row){
    if(!row.classId || !row.className){
      errors.push('반 정보가 비어 있는 행이 있습니다.')
      return
    }
    if(seenClassIds.has(row.classId)){
      const existingRow = classRows.find(function(entry){ return entry.id === row.classId })
      if(existingRow && existingRow.name !== row.className){
        errors.push(row.classId + ' 반의 이름이 여러 값으로 들어 있습니다.')
      }
    }else{
      seenClassIds.add(row.classId)
      classRows.push({ id: row.classId, name: row.className })
    }

    if(!row.managerUid && !row.managerLoginId && !row.managerEmail) return
    const manager = resolvePortalUserFromLookup(lookup, {
      uid: row.managerUid,
      loginId: row.managerLoginId,
      email: row.managerEmail
    })
    if(!manager){
      errors.push((row.className || row.classId) + ' 반 관리자 계정을 찾지 못했습니다: ' + (row.managerLoginId || row.managerEmail || row.managerUid))
      return
    }
    if(isPortalSuperAdmin() && normalizeAdminScopeValue(manager && manager.adminScope) === 'all'){
      return
    }
    const entry = assignmentMap.get(manager.uid) || {
      user: manager,
      classIds: new Set(),
      adminScope: 'assigned'
    }
    entry.classIds.add(row.classId)
    if(row.managerScope === 'all') entry.adminScope = 'all'
    assignmentMap.set(manager.uid, entry)
  })

  if(errors.length){
    throw new Error(errors.slice(0, 5).join('\n'))
  }

  const examState = await loadPortalExamState(false)
  await saveSuperAdminClassCatalogList(classRows, examState)

  for(let index = 0; index < adminUsers.length; index += 1){
    const admin = adminUsers[index]
    if(normalizeAdminScopeValue(admin && admin.adminScope) === 'all') continue
    const assignment = assignmentMap.get(admin.uid)
    const nextClassIds = assignment
      ? Array.from(assignment.classIds)
      : []
    const nextScope = assignment ? assignment.adminScope : 'assigned'
    await persistPortalUserProfileUpdate(admin.uid, {
      classIds: nextScope === 'all'
        ? classRows.map(function(classInfo){ return classInfo.id })
        : nextClassIds,
      adminScope: nextScope,
      updatedAt: new Date().toISOString()
    })
  }

  state.classAdminRows = uploadedRows
  await syncPrepContentAfterLogin(true)
  await ensureCheckData(true)
}

async function applySuperAdminStudentRows(){
  if(!isPortalSuperAdmin()){
    showToast('최고 관리자만 학생 변동 반영을 실행할 수 있습니다.', 'var(--red)')
    return
  }

  const state = ensurePortalExamCenterState()
  const uploadedRows = normalizeSuperAdminStudentRows(state.studentRows)
  if(!uploadedRows.length){
    throw new Error('먼저 학생 변동 CSV를 업로드해 주세요.')
  }
  if(typeof window.confirm === 'function' && !window.confirm('학생 변동 내용을 Firebase에 반영할까요?')) return

  const users = await fetchAllPortalUsersForSuperAdmin()
  const students = users.filter(function(user){
    return String(user && user.role || '').trim() !== 'admin'
  })
  const studentLookup = buildPortalUserLookup(students)
  const validClassIds = new Set(normalizePortalPrepClassList(prepClasses).map(function(classInfo){
    return String(classInfo && classInfo.id || '').trim()
  }))
  const errors = []

  for(let index = 0; index < uploadedRows.length; index += 1){
    const row = uploadedRows[index]
    const existing = resolvePortalUserFromLookup(studentLookup, row)
    if(row.status === 'active' && !row.classId){
      errors.push((row.name || row.loginId || row.uid || ('행 ' + (index + 2))) + ': classId가 필요합니다.')
      continue
    }
    if(row.status === 'active' && row.classId && !validClassIds.has(row.classId)){
      errors.push((row.name || row.loginId || row.uid || ('행 ' + (index + 2))) + ': 존재하지 않는 classId입니다.')
      continue
    }
    if(existing && String(existing && existing.role || '').trim() === 'admin'){
      errors.push((row.loginId || row.email || row.uid) + ': 관리자 계정과 충돌합니다.')
      continue
    }
    if(row.status === 'disabled' && !existing){
      errors.push((row.loginId || row.email || row.uid || ('행 ' + (index + 2))) + ': 비활성 처리할 기존 학생을 찾지 못했습니다.')
      continue
    }
    if(existing){
      const existingLoginId = derivePortalLoginId(existing)
      const nextLoginId = derivePortalLoginId(row)
      const existingEmail = String(existing && existing.email || '').trim().toLowerCase()
      const nextEmail = String(row && row.email || '').trim().toLowerCase()
      if(nextLoginId && existingLoginId && nextLoginId !== existingLoginId){
        errors.push((row.name || existing.name || nextLoginId) + ': 기존 학생의 loginId 변경은 이 화면에서 지원하지 않습니다.')
      }
      if(nextEmail && existingEmail && nextEmail !== existingEmail){
        errors.push((row.name || existing.name || nextLoginId || existingLoginId) + ': 기존 학생의 email 변경은 이 화면에서 지원하지 않습니다.')
      }
    }else if(row.status === 'active'){
      if(!row.loginId || !row.name){
        errors.push('신규 학생은 loginId와 이름이 필요합니다.')
      }
    }
  }

  if(errors.length){
    throw new Error(errors.slice(0, 6).join('\n'))
  }

  let createdCount = 0
  let updatedCount = 0
  let disabledCount = 0

  for(let index = 0; index < uploadedRows.length; index += 1){
    const row = uploadedRows[index]
    const existing = resolvePortalUserFromLookup(studentLookup, row)
    const now = new Date().toISOString()

    if(existing){
      const nextPayload = {
        loginId: existing.loginId,
        email: existing.email,
        name: row.name || existing.name || '',
        studentId: row.studentId || existing.studentId || existing.loginId || '',
        classIds: row.status === 'disabled' ? [] : [row.classId],
        role: 'student',
        loginDisabled: row.status === 'disabled',
        updatedAt: now
      }
      await persistPortalUserProfileUpdate(existing.uid, nextPayload)
      if(row.status === 'disabled'){
        disabledCount += 1
      }else{
        updatedCount += 1
      }
      continue
    }

    const profile = {
      loginId: row.loginId,
      email: row.email || toPortalLoginEmail(row.loginId),
      name: row.name,
      studentId: row.studentId || row.loginId,
      classIds: [row.classId],
      role: 'student',
      loginDisabled: false,
      passwordResetRequired: true,
      createdAt: now,
      updatedAt: now
    }
    await createPortalStudentProfileByAdmin(profile)
    createdCount += 1
  }

  state.studentRows = uploadedRows
  if(portalState.firebaseEnabled && portalState.currentUser){
    const refreshed = await fetchOrCreateUserProfile(portalState.currentUser)
    portalState.currentProfile = refreshed
    updatePortalUserCard()
  }

  return {
    createdCount: createdCount,
    updatedCount: updatedCount,
    disabledCount: disabledCount
  }
}

async function deletePortalCollectionDocuments(collectionName){
  if(portalState.firebaseEnabled && portalState.db){
    const snapshot = await portalState.db.collection(collectionName).get()
    for(let index = 0; index < snapshot.docs.length; index += 1){
      await snapshot.docs[index].ref.delete()
    }
    return snapshot.docs.length
  }

  if(collectionName === 'checkResponses'){
    const count = readLocalResponses().length
    writeLocalResponses([])
    return count
  }
  if(collectionName === 'questionIssues'){
    const count = readLocalQuestionIssues().length
    writeLocalQuestionIssues([])
    return count
  }
  if(collectionName === PORTAL_COUNSEL_REQUEST_COLLECTION){
    const count = readLocalCounselRequests().length
    writeLocalCounselRequests([])
    return count
  }
  if(collectionName === PORTAL_COUNSEL_SLOT_COLLECTION){
    const count = readLocalCounselSlots().length
    writeLocalCounselSlots([])
    return count
  }
  if(collectionName === PORTAL_PREP_VIDEO_PROGRESS_COLLECTION){
    const count = readLocalPortalPrepVideoProgressRows().length
    writeLocalPortalPrepVideoProgressRows([])
    return count
  }
  if(collectionName === 'portalPrepSets' || collectionName === 'portalCheckSets'){
    const kind = collectionName === 'portalPrepSets' ? 'prep' : 'check'
    const count = readLocalPortalSetDocs(kind).length
    writeLocalPortalSetDocs(kind, [])
    return count
  }
  return 0
}

async function resetSuperAdminExamCycle(){
  if(!isPortalSuperAdmin()){
    showToast('최고 관리자만 새 시험 초기화를 실행할 수 있습니다.', 'var(--red)')
    return
  }

  const nextExamNameInput = getPortalExamCenterNode('superadmin-next-exam-name')
  const confirmInput = getPortalExamCenterNode('superadmin-reset-confirm-text')
  const nextExamName = String(nextExamNameInput && nextExamNameInput.value || '').trim()
  const confirmText = String(confirmInput && confirmInput.value || '').trim()

  if(!nextExamName){
    throw new Error('다음 시험명을 입력해 주세요.')
  }
  if(confirmText !== '새 시험 시작'){
    throw new Error('확인 문구로 "새 시험 시작"을 정확히 입력해 주세요.')
  }
  if(typeof window.confirm === 'function' && !window.confirm('현재 시험의 운영 데이터를 초기화하고 새 시험을 시작할까요?')) return

  const currentExamState = await loadPortalExamState(false)
  const nextExamKey = buildPortalExamKey(nextExamName)
  const pdfLabResetToken = buildPdfLabResetToken()
  const now = new Date().toISOString()

  const deletedResponses = await deletePortalCollectionDocuments('checkResponses')
  const deletedIssues = await deletePortalCollectionDocuments('questionIssues')
  const deletedCounselRequests = await deletePortalCollectionDocuments(PORTAL_COUNSEL_REQUEST_COLLECTION)
  const deletedCounselSlots = await deletePortalCollectionDocuments(PORTAL_COUNSEL_SLOT_COLLECTION)
  const deletedPrepProgress = await deletePortalCollectionDocuments(PORTAL_PREP_VIDEO_PROGRESS_COLLECTION)
  const deletedPrepSets = await deletePortalCollectionDocuments('portalPrepSets')
  const deletedCheckSets = await deletePortalCollectionDocuments('portalCheckSets')

  const classCatalogDoc = await loadCloudContentDoc(PORTAL_CLASS_CATALOG_DOC)
  const classCatalogPayload = classCatalogDoc && classCatalogDoc.payload && typeof classCatalogDoc.payload === 'object'
    ? classCatalogDoc.payload
    : { classes: normalizePortalPrepClassList(prepClasses) }

  await saveCloudContentDoc(PORTAL_CLOUD_DOCS.prep, {
    version: 2,
    prepConfig: normalizePortalPrepConfig(classCatalogPayload.prepConfig, {
      pageTitle: APP_CONFIG.defaultTitle,
      generatedAt: now,
      examKey: nextExamKey
    }),
    classes: normalizePortalPrepClassList(classCatalogPayload.classes),
    studySets: []
  }, 'session.json')

  await saveCloudContentDoc(PORTAL_CLOUD_DOCS.check, {
    updatedAt: now,
    classes: normalizePortalCheckClassList(normalizePortalPrepClassList(classCatalogPayload.classes).map(function(classInfo){
      return { id: classInfo.id, name: classInfo.name }
    })),
    checkSets: []
  }, 'check_data.json')

  await saveCloudContentDoc(PORTAL_CLASS_CATALOG_DOC, {
    prepConfig: normalizePortalPrepConfig(classCatalogPayload.prepConfig, {
      generatedAt: now,
      examKey: nextExamKey
    }),
    classes: normalizePortalPrepClassList(classCatalogPayload.classes)
  }, 'prep-classes.json')

  await savePortalExamState({
    examName: nextExamName,
    examKey: nextExamKey,
    previousExamName: currentExamState.examName || currentExamState.lastArchiveExamName || '',
    previousExamKey: currentExamState.examKey || '',
    lastResetAt: now,
    lastResetBy: portalState.currentUser ? portalState.currentUser.uid : '',
    lastResetByName: getPortalDisplayIdentity(),
    pdfLabResetToken: pdfLabResetToken
  })

  portalState.checkData = null
  portalState.currentCheckSet = null
  portalState.currentCheckSubmission = null
  portalState.currentQuestionIssues = []
  portalState.currentCheckDraftAnswers = {}
  portalState.currentCheckEditTargets = {}
  portalState.adminCheckAnalytics = null

  if(PORTAL_ENHANCEMENT_KEYS && PORTAL_ENHANCEMENT_KEYS.issues){
    try{
      localStorage.removeItem(PORTAL_ENHANCEMENT_KEYS.issues)
    }catch(error){}
  }
  if(PORTAL_ENHANCEMENT_KEYS && PORTAL_ENHANCEMENT_KEYS.counselRequests){
    try{
      localStorage.removeItem(PORTAL_ENHANCEMENT_KEYS.counselRequests)
    }catch(error){}
  }
  if(PORTAL_ENHANCEMENT_KEYS && PORTAL_ENHANCEMENT_KEYS.counselSlots){
    try{
      localStorage.removeItem(PORTAL_ENHANCEMENT_KEYS.counselSlots)
    }catch(error){}
  }
  try{
    localStorage.removeItem(getAdminQuestionIssueHiddenStorageKey())
  }catch(error){}

  await syncPrepContentAfterLogin(true)
  await ensureCheckData(true)
  if(getCurrentActiveScreenId() === 'admin-screen'){
    await renderAdminScreen()
  }

  return {
    deletedResponses: deletedResponses,
    deletedIssues: deletedIssues,
    deletedCounselRequests: deletedCounselRequests,
    deletedCounselSlots: deletedCounselSlots,
    deletedPrepProgress: deletedPrepProgress,
    deletedPrepSets: deletedPrepSets,
    deletedCheckSets: deletedCheckSets,
    nextExamKey: nextExamKey,
    pdfLabResetToken: pdfLabResetToken
  }
}

async function handleSuperAdminArchive(mode){
  try{
    const examName = String(getPortalExamCenterNode('superadmin-archive-exam-name') && getPortalExamCenterNode('superadmin-archive-exam-name').value || '').trim()
    setPortalExamCenterStatus('superadmin-archive-status', '시험 종료 백업을 준비하고 있습니다...', 'working')
    const snapshot = await downloadPortalExamArchive(examName, mode)
    const label = mode === 'all' ? '엑셀 + JSON' : (mode === 'excel' ? '엑셀' : 'JSON')
    setPortalExamCenterStatus('superadmin-archive-status', label + ' 백업을 다운로드했습니다. (' + (snapshot && snapshot.examName || '') + ')', 'success')
    await renderSuperAdminExamCenter()
  }catch(error){
    console.error(error)
    setPortalExamCenterStatus('superadmin-archive-status', String(error && error.message || '시험 종료 백업에 실패했습니다.'), 'error')
  }
}

async function handleSuperAdminClassAdminUpload(file){
  try{
    const text = await readPortalTextFileFromBrowser(file)
    const rows = normalizeSuperAdminClassAdminRows(parsePortalCsvText(text))
    ensurePortalExamCenterState().classAdminRows = rows
    setPortalExamCenterStatus('superadmin-class-admin-status', '반/관리자 CSV ' + rows.length + '행을 불러왔습니다. 적용을 누르면 Firebase 반영이 시작됩니다.', 'success')
  }catch(error){
    console.error(error)
    setPortalExamCenterStatus('superadmin-class-admin-status', 'CSV를 읽지 못했습니다.', 'error')
  }
}

async function handleSuperAdminStudentUpload(file){
  try{
    const text = await readPortalTextFileFromBrowser(file)
    const rows = normalizeSuperAdminStudentRows(parsePortalCsvText(text))
    ensurePortalExamCenterState().studentRows = rows
    setPortalExamCenterStatus('superadmin-student-status', '학생 변동 CSV ' + rows.length + '행을 불러왔습니다. 적용을 누르면 Firebase 반영이 시작됩니다.', 'success')
  }catch(error){
    console.error(error)
    setPortalExamCenterStatus('superadmin-student-status', 'CSV를 읽지 못했습니다.', 'error')
  }
}

async function handleSuperAdminApplyClassAdmin(){
  try{
    setPortalExamCenterStatus('superadmin-class-admin-status', '반/관리자 재배정을 반영하고 있습니다...', 'working')
    await applySuperAdminClassAdminRows()
    setPortalExamCenterStatus('superadmin-class-admin-status', '반 목록과 관리자 담당 반을 반영했습니다.', 'success')
    await renderSuperAdminExamCenter()
  }catch(error){
    console.error(error)
    setPortalExamCenterStatus('superadmin-class-admin-status', String(error && error.message || '반/관리자 반영에 실패했습니다.'), 'error')
  }
}

async function handleSuperAdminApplyStudents(){
  try{
    setPortalExamCenterStatus('superadmin-student-status', '학생 변동 내용을 반영하고 있습니다...', 'working')
    const result = await applySuperAdminStudentRows()
    setPortalExamCenterStatus(
      'superadmin-student-status',
      '학생 변동 반영 완료: 신규 ' + result.createdCount + '명, 수정 ' + result.updatedCount + '명, 비활성 ' + result.disabledCount + '명',
      'success'
    )
    await renderSuperAdminExamCenter()
  }catch(error){
    console.error(error)
    setPortalExamCenterStatus('superadmin-student-status', String(error && error.message || '학생 변동 반영에 실패했습니다.'), 'error')
  }
}

async function handleSuperAdminResetCycle(){
  try{
    setPortalExamCenterStatus('superadmin-reset-status', '새 시험 초기화를 진행하고 있습니다...', 'working')
    const result = await resetSuperAdminExamCycle()
    setPortalExamCenterStatus(
      'superadmin-reset-status',
      '초기화 완료: CHECK 제출 ' + result.deletedResponses + '건, 질문 ' + result.deletedIssues + '건, PREP 시청 기록 ' + result.deletedPrepProgress + '건, PREP 세트 ' + result.deletedPrepSets + '건, CHECK 세트 ' + result.deletedCheckSets + '건 삭제',
      'success'
    )
    if(getPortalExamCenterNode('superadmin-reset-confirm-text')) getPortalExamCenterNode('superadmin-reset-confirm-text').value = ''
    await renderSuperAdminExamCenter()
  }catch(error){
    console.error(error)
    setPortalExamCenterStatus('superadmin-reset-status', String(error && error.message || '새 시험 초기화에 실패했습니다.'), 'error')
  }
}

function ensureSuperAdminExamCenterBindings(){
  const section = getPortalExamCenterNode('superadmin-exam-center')
  if(!section || section.dataset.bound === 'true') return
  section.dataset.bound = 'true'

  const bindClick = function(id, handler){
    const node = getPortalExamCenterNode(id)
    if(node) node.addEventListener('click', handler)
  }
  const bindUpload = function(buttonId, inputId, handler){
    const button = getPortalExamCenterNode(buttonId)
    const input = getPortalExamCenterNode(inputId)
    if(button && input){
      button.addEventListener('click', function(){ input.click() })
      input.addEventListener('change', function(event){
        const file = event.target && event.target.files && event.target.files[0]
        if(file) handler(file)
        event.target.value = ''
      })
    }
  }

  bindClick('superadmin-archive-all-btn', function(){ handleSuperAdminArchive('all') })
  bindClick('superadmin-archive-excel-btn', function(){ handleSuperAdminArchive('excel') })
  bindClick('superadmin-archive-json-btn', function(){ handleSuperAdminArchive('json') })
  bindClick('superadmin-download-class-admin-template-btn', downloadSuperAdminClassAdminTemplate)
  bindClick('superadmin-apply-class-admin-btn', handleSuperAdminApplyClassAdmin)
  bindClick('superadmin-download-student-template-btn', downloadSuperAdminStudentTemplate)
  bindClick('superadmin-apply-student-btn', handleSuperAdminApplyStudents)
  bindClick('superadmin-reset-cycle-btn', handleSuperAdminResetCycle)

  bindUpload('superadmin-upload-class-admin-btn', 'superadmin-class-admin-upload-input', handleSuperAdminClassAdminUpload)
  bindUpload('superadmin-upload-student-btn', 'superadmin-student-upload-input', handleSuperAdminStudentUpload)
}

async function renderSuperAdminExamCenter(){
  const section = getPortalExamCenterNode('superadmin-exam-center')
  if(!section) return
  ensureSuperAdminExamCenterBindings()

  if(!isPortalSuperAdmin()){
    section.classList.add('hidden')
    return
  }

  section.classList.remove('hidden')
  const [examState, users, prepSets, checkSets] = await Promise.all([
    loadPortalExamState(false),
    fetchAllPortalUsersForSuperAdmin(),
    loadCloudSetDocs('prep'),
    loadCloudSetDocs('check')
  ])

  const activeStudents = summarizePortalCounts(users, function(user){
    return String(user && user.role || '').trim() !== 'admin' && !(user && user.loginDisabled)
  })
  const disabledStudents = summarizePortalCounts(users, function(user){
    return String(user && user.role || '').trim() !== 'admin' && !!(user && user.loginDisabled)
  })
  const assignedAdmins = summarizePortalCounts(users, function(user){
    return String(user && user.role || '').trim() === 'admin' && normalizeAdminScopeValue(user && user.adminScope) !== 'all'
  })

  const metaNode = getPortalExamCenterNode('superadmin-exam-center-meta')
  const overviewNode = getPortalExamCenterNode('superadmin-exam-overview')
  const archiveNameInput = getPortalExamCenterNode('superadmin-archive-exam-name')
  const nextExamNameInput = getPortalExamCenterNode('superadmin-next-exam-name')
  const resetConfirmInput = getPortalExamCenterNode('superadmin-reset-confirm-text')

  if(metaNode){
    const metaBits = [
      examState.examName ? ('현재 시험: ' + examState.examName) : '현재 시험명 미설정',
      examState.examKey ? ('examKey: ' + examState.examKey) : 'examKey 미설정',
      examState.lastArchiveAt ? ('마지막 백업: ' + formatPortalDateTime(examState.lastArchiveAt)) : '백업 기록 없음',
      examState.lastResetAt ? ('마지막 초기화: ' + formatPortalDateTime(examState.lastResetAt)) : '초기화 기록 없음'
    ]
    metaNode.textContent = metaBits.join(' · ')
  }

  if(overviewNode){
    overviewNode.innerHTML = [
      '<div class="superadmin-exam-overview-card"><strong>반 / 관리자</strong><span>반 ' + prepClasses.length + '개 · 담당 관리자 ' + assignedAdmins + '명</span></div>',
      '<div class="superadmin-exam-overview-card"><strong>학생 현황</strong><span>재원 ' + activeStudents + '명 · 비활성 ' + disabledStudents + '명</span></div>',
      '<div class="superadmin-exam-overview-card"><strong>운영 데이터</strong><span>PREP 세트 ' + prepSets.length + '개 · CHECK 세트 ' + checkSets.length + '개</span></div>'
    ].join('')
  }

  if(archiveNameInput && !archiveNameInput.value.trim()){
    archiveNameInput.value = examState.examName || ''
  }
  if(nextExamNameInput && !nextExamNameInput.value.trim() && examState.examName){
    nextExamNameInput.value = examState.examName
  }
  if(resetConfirmInput){
    resetConfirmInput.placeholder = '확인 문구: 새 시험 시작'
  }
}

const originalLoadPortalPrepBundleFromSourcesForExamCenter = loadPortalPrepBundleFromSources
loadPortalPrepBundleFromSources = async function(){
  const bundle = await originalLoadPortalPrepBundleFromSourcesForExamCenter()
  const examState = await loadPortalExamState(false)
  if(bundle){
    bundle.prepConfig = normalizePortalPrepConfig(bundle.prepConfig, {
      examKey: examState.examKey || ''
    })
  }
  return bundle
}

async function handleResolvedAuthUser(user){
  portalState.authResolved = true
  portalState.currentUser = user
  portalState.currentProfile = user ? await fetchOrCreateUserProfile(user) : null

  if(portalState.currentProfile && portalState.currentProfile.loginDisabled){
    try{
      if(portalState.auth && portalState.auth.currentUser){
        await portalState.auth.signOut()
      }
    }catch(error){}
    portalState.currentUser = null
    portalState.currentProfile = null
    setAuthError('현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.')
  }

  routePortalAfterState()
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
    adminScope: 'assigned',
    loginDisabled: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  await saveFirebaseUserProfile(user.uid, profile)
  return normalizeUserProfile(profile)
}

async function loginPortalUser(loginId, password){
  if(portalState.firebaseEnabled){
    const credential = await portalState.auth.signInWithEmailAndPassword(toPortalLoginEmail(loginId), password)
    const user = credential && credential.user ? credential.user : portalState.auth.currentUser
    portalState.authResolved = true
    portalState.currentUser = user || null
    portalState.currentProfile = user ? await fetchOrCreateUserProfile(user) : null
    if(portalState.currentProfile && portalState.currentProfile.loginDisabled){
      await portalState.auth.signOut()
      portalState.currentUser = null
      portalState.currentProfile = null
      throw new Error('현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.')
    }
    routePortalAfterState()
    return
  }

  const user = findLocalPortalUser(loginId, password)
  if(!user) throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
  if(user.loginDisabled) throw new Error('현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.')

  localStorage.setItem(PORTAL_STORAGE_KEYS.currentUserId, user.id)
  portalState.currentUser = buildLocalAuthUser(user)
  portalState.currentProfile = user
  routePortalAfterState()
}

const originalRoutePortalAfterStateForExamCenter = routePortalAfterState
routePortalAfterState = function(){
  if(portalState.currentProfile && portalState.currentProfile.loginDisabled){
    try{
      if(portalState.firebaseEnabled && portalState.auth && portalState.auth.currentUser){
        portalState.auth.signOut()
      }
    }catch(error){}
    try{
      localStorage.removeItem(PORTAL_STORAGE_KEYS.currentUserId)
    }catch(error){}
    portalState.currentUser = null
    portalState.currentProfile = null
    showAuthScreen('현재 비활성화된 계정입니다. 관리자에게 문의해 주세요.')
    return
  }
  if(!portalState.currentUser){
    resetStudyCafeEmbed({ clearFrame: true })
  }
  return originalRoutePortalAfterStateForExamCenter()
}

const originalLogoutPortalForStudyCafe = logoutPortal
logoutPortal = async function(){
  resetStudyCafeEmbed({ clearFrame: true })
  return originalLogoutPortalForStudyCafe.apply(this, arguments)
}

const originalRenderAdminScreenForExamCenter = renderAdminScreen
renderAdminScreen = async function(){
  await originalRenderAdminScreenForExamCenter()
  await renderSuperAdminExamCenter()
  await renderAdminCounselRequests()
}
