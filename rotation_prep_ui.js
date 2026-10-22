function showHome(){
  if(shouldUseDirectPrepPassageFlow()){
    goBackFromSetScreen()
    return
  }
  ensureCurrentSetSelection()
  updateSetProgressContext()
  renderClassSummary()
  renderSetScreen()
  activateScreen('home-screen')
}

function goBackFromSetScreen(){
  currentSetIndex = -1
  currentPassage = -1
  if(typeof window.handlePrepBackToPortal === 'function' && window.handlePrepBackToPortal()) return
  showClassScreen()
}

function showPassageScreen(){
  if(shouldUseDirectPrepPassageFlow()){
    currentStudySectionId = ''
    activateScreen('passage-screen')
    renderClassSummary()
    renderPassageScreen()
    return
  }
  const currentSet = getCurrentStudySet()
  const assignment = currentSet ? getCurrentClassAssignments(currentSet) : null
  if(!currentSet || !assignment){
    goHome()
    return
  }
  currentStudySectionId = ''
  activateScreen('passage-screen')
  renderClassSummary()
  renderPassageScreen()
}

function shouldUseDirectPrepPassageFlow(){
  return typeof portalState !== 'undefined' && !!portalState.currentUser
}

function getAccessiblePrepStudySetEntries(){
  return getStudySetsForCurrentClass().filter(function(entry){
    return entry.isAccessible
  })
}

function getVisiblePrepPassageEntries(){
  const entries = []
  const includeMissingVideo = typeof isPortalAdmin === 'function' && isPortalAdmin()

  getAccessiblePrepStudySetEntries().forEach(function(setEntry){
    setEntry.assignment.passageIndexes.forEach(function(passageIndex){
      const passage = setEntry.studySet.passages[passageIndex]
      if(!passage) return
      if(!includeMissingVideo && !passage.hasVideo) return

      entries.push({
        setIndex: setEntry.index,
        studySet: setEntry.studySet,
        assignment: setEntry.assignment,
        passageIndex: passageIndex,
        passage: passage,
        status: setEntry.status
      })
    })
  })

  return entries
}

function escapePrepInlineJsValue(value){
  if(typeof escapeJs === 'function') return escapeJs(value)
  return String(value == null ? '' : value).replace(/[\\'"<>&\u0000-\u001f\u007f\u2028\u2029]/g, function(character){
    return '\\u' + character.charCodeAt(0).toString(16).padStart(4, '0')
  })
}

function getDirectPrepManagedDocId(studySet){
  const studySetId = String(studySet && studySet.id || '').trim()
  if(!studySetId || typeof portalState === 'undefined') return ''
  const records = Array.isArray(portalState.prepSetInventory) ? portalState.prepSetInventory : []
  const record = records.find(function(entry){
    return !!(entry && entry.isManaged && String(entry.docId || '').trim() === studySetId)
  })
  return record ? String(record.docId || '').trim() : ''
}

function renderDirectPrepAdminPassageActions(entry){
  if(!(typeof isPortalAdmin === 'function' && isPortalAdmin())) return ''
  const docId = getDirectPrepManagedDocId(entry && entry.studySet)
  if(!docId) return ''
  const escapedDocId = escapePrepInlineJsValue(docId)
  return '' +
    '<div class="p-actions" onclick="event.stopPropagation()">' +
      '<button class="btn btn-ghost btn-sm" type="button" onclick="event.preventDefault(); event.stopPropagation(); window.openPortalPrepVideoProgressModal && window.openPortalPrepVideoProgressModal(\'' + escapedDocId + '\')">시청 현황</button>' +
      '<button class="btn btn-ghost btn-sm" type="button" onclick="event.preventDefault(); event.stopPropagation(); window.openPortalPrepVideoManager && window.openPortalPrepVideoManager(\'' + escapedDocId + '\')">영상 수정</button>' +
      '<button class="btn btn-ghost btn-sm admin-content-action-danger" type="button" onclick="event.preventDefault(); event.stopPropagation(); window.removePortalManagedSet && window.removePortalManagedSet(\'prep\', \'' + escapedDocId + '\')">삭제</button>' +
    '</div>'
}

function updatePrepPassageAdminQuickActions(){
  const actions = document.getElementById('prep-passage-admin-actions')
  if(!actions) return
  const shouldShow = typeof isPortalAdmin === 'function' && isPortalAdmin()
  actions.classList.toggle('hidden', !shouldShow)
  actions.setAttribute('aria-hidden', shouldShow ? 'false' : 'true')
}

function renderClassList(){
  const container = document.getElementById('class-list')
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

    return '' +
      '<button type="button" data-ui-icon-skip="true" class="class-item" onclick="requestClassAccess(' + index + ')">' +
        '<div class="class-body">' +
          '<div class="class-title">' + escapeHtml(classInfo.name) + '</div>' +
          '<div class="class-preview">' + studyCount + '개의 학습 세트가 준비되어 있습니다.</div>' +
          '<div class="class-tags">' +
            '<span class="class-tag">세트 ' + studyCount + '</span>' +
            '<span class="class-tag">' + (classInfo.password ? '비밀번호 있음' : '바로 입장') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="p-arrow">&rsaquo;</div>' +
      '</button>'
  }).join('')
}

function renderClassSummary(){
  const currentClass = getCurrentClass()
  const currentSet = getCurrentStudySet()
  const directPassageFlow = shouldUseDirectPrepPassageFlow()
  const visibleSets = getStudySetsForCurrentClass()
  const visibleClassEntries = typeof window.getVisiblePortalPrepClassEntries === 'function'
    ? window.getVisiblePortalPrepClassEntries()
    : prepClasses.map(function(classInfo, index){
      return { classInfo: classInfo, index: index }
    })

  document.getElementById('class-bar').style.display = currentClass ? 'flex' : 'none'
  document.getElementById('change-class-btn').style.display = visibleClassEntries.length > 1 ? 'inline-flex' : 'none'
  if(typeof window.isPortalStudentLockedClass === 'function' && window.isPortalStudentLockedClass()){
    document.getElementById('change-class-btn').style.display = 'none'
  }
  document.getElementById('set-back-btn').style.display = 'inline-flex'

  if(currentClass){
    document.getElementById('current-class-name').textContent = currentClass.name
    document.getElementById('current-class-meta').textContent = ''
  }else{
    document.getElementById('current-class-name').textContent = ''
    document.getElementById('current-class-meta').textContent = ''
  }

  const passageBar = document.getElementById('passage-bar')
  const passageBarLabel = passageBar ? passageBar.querySelector('.class-bar-label') : null
  if(directPassageFlow){
    passageBar.style.display = currentClass ? 'flex' : 'none'
    if(passageBarLabel) passageBarLabel.textContent = '현재 반'
    document.getElementById('current-set-name').textContent = currentClass ? currentClass.name : ''
    document.getElementById('current-set-meta').textContent = ''
  }else if(currentSet){
    passageBar.style.display = 'flex'
    if(passageBarLabel) passageBarLabel.textContent = '현재 학습 세트'
    document.getElementById('current-set-name').textContent = currentSet.title
    document.getElementById('current-set-meta').textContent = getStudySetDateText(currentSet)
  }else{
    passageBar.style.display = 'none'
    if(passageBarLabel) passageBarLabel.textContent = '현재 학습 세트'
    document.getElementById('current-set-name').textContent = ''
    document.getElementById('current-set-meta').textContent = ''
  }
}

function renderDash(){
  renderSetScreen()
  if(getCurrentStudySet()) renderPassageScreen()
}

function renderSetScreen(){
  const visibleSets = getStudySetsForCurrentClass()
  const activeCount = visibleSets.filter(function(entry){ return entry.status === 'active' || entry.status === 'always' }).length
  const upcomingCount = visibleSets.filter(function(entry){ return entry.status === 'upcoming' }).length
  const endedCount = visibleSets.filter(function(entry){ return entry.status === 'ended' }).length

  document.getElementById('stats').innerHTML = [
    renderStat(visibleSets.length, '세트'),
    renderStat(activeCount, '진행 중'),
    renderStat(upcomingCount, '예정'),
    renderStat(endedCount, '종료')
  ].join('')

  renderSetList(visibleSets)
}

function renderPassageScreen(){
  const currentSet = getCurrentStudySet()
  const assignment = currentSet ? getCurrentClassAssignments(currentSet) : null
  const container = document.getElementById('p-list')
  updatePrepPassageAdminQuickActions()

  if(shouldUseDirectPrepPassageFlow()){
    renderDirectPrepPassageScreen()
    return
  }

  if(!currentSet || !assignment){
    container.innerHTML = '<div class="empty-box">먼저 학습 세트를 선택해 주세요.</div>'
    document.getElementById('passage-stats').innerHTML = ''
    return
  }

  const totalQuestions = assignment.passageIndexes.filter(function(passageIndex){
    return !!(currentSet.passages[passageIndex] && currentSet.passages[passageIndex].hasVideo)
  }).length
  const doneCount = assignment.passageIndexes.filter(function(passageIndex){
    return getPassageProgress(passageIndex).done
  }).length

  document.getElementById('passage-stats').innerHTML = [
    renderStat(totalQuestions, '영상'),
    renderStat(doneCount, '완료'),
    renderStat(Math.max(assignment.passageIndexes.length - doneCount, 0), '남음')
  ].join('')

  document.getElementById('passage-list-label').textContent = currentSet.title + ' 지문 선택'

  if(!isStudySetAccessible(currentSet)){
    container.innerHTML = '<div class="empty-box">이 학습 세트는 아직 열리지 않았거나 기간이 종료되었습니다.</div>'
    return
  }

  container.innerHTML = assignment.passageIndexes.map(function(passageIndex, visibleIndex){
    const passage = currentSet.passages[passageIndex]
    const state = getPassageProgress(passageIndex)
    const preview = getPrepPassagePreviewText(passage)
    const previewHtml = preview
      ? '<div class="p-preview">' + escapeHtml(preview) + '</div>'
      : ''

    return '' +
      '<div class="p-item ' + (state.done ? 'done' : '') + '" onclick="openPassage(' + passageIndex + ')">' +
        '<div class="p-num">' + (visibleIndex + 1) + '</div>' +
        '<div class="p-body">' +
          '<button type="button" data-ui-icon-skip="true" class="p-title card-open-action">' + escapeHtml(passage.title) + '</button>' +
          previewHtml +
          '<div class="p-meta">' +
            '<span>' + (passage.hasVideo ? '영상 준비' : '영상 없음') + '</span>' +
            '<span>' + escapeHtml(getStudySetDateText(currentSet)) + '</span>' +
          '</div>' +
          '<div class="p-stage">' + renderProgressChip(state.done) + '</div>' +
        '</div>' +
        '<div class="p-arrow">&rsaquo;</div>' +
      '</div>'
  }).join('')
}

function renderDirectPrepPassageScreen(){
  renderClassSummary()
  const container = document.getElementById('p-list')
  updatePrepPassageAdminQuickActions()
  const passageEntries = getVisiblePrepPassageEntries()
  const doneCount = passageEntries.filter(function(entry){
    return getPassageProgress(entry.passageIndex, entry.setIndex).done
  }).length

  if(!passageEntries.length){
    document.getElementById('passage-stats').innerHTML = [
      renderStat(0, '영상'),
      renderStat(0, '완료'),
      renderStat(0, '남음')
    ].join('')
    document.getElementById('passage-list-label').textContent = 'PREP 지문 선택'
    container.innerHTML = typeof isPortalAdmin === 'function' && isPortalAdmin()
      ? '<div class="empty-box">아직 PREP 영상이 없습니다. 위의 영상 업로드 버튼으로 제목과 유튜브 링크를 올려 주세요.</div>'
      : '<div class="empty-box">현재 등록된 PREP 영상이 없습니다.</div>'
    return
  }

  document.getElementById('passage-stats').innerHTML = [
    renderStat(passageEntries.filter(function(entry){ return entry.passage.hasVideo }).length, '영상'),
    renderStat(doneCount, '완료'),
    renderStat(Math.max(passageEntries.length - doneCount, 0), '남음')
  ].join('')

  document.getElementById('passage-list-label').textContent = 'PREP 지문 선택'

  if(!passageEntries.length){
    container.innerHTML = '<div class="empty-box">현재 배정된 PREP 영상 지문이 없습니다.</div>'
    return
  }

  container.innerHTML = passageEntries.map(function(entry, visibleIndex){
    const state = getPassageProgress(entry.passageIndex, entry.setIndex)
    const preview = getPrepPassagePreviewText(entry.passage)
    const previewHtml = preview
      ? '<div class="p-preview">' + escapeHtml(preview) + '</div>'
      : ''

    return '' +
      '<div class="p-item ' + (state.done ? 'done' : '') + '" onclick="openPassageAt(' + entry.passageIndex + ', ' + entry.setIndex + ')">' +
        '<div class="p-num">' + (visibleIndex + 1) + '</div>' +
        '<div class="p-body">' +
          '<button type="button" data-ui-icon-skip="true" class="p-title card-open-action">' + escapeHtml(entry.passage.title) + '</button>' +
          previewHtml +
          '<div class="p-meta">' +
            '<span>' + escapeHtml(entry.studySet.title) + '</span>' +
            '<span>' + escapeHtml(getStudySetDateText(entry.studySet)) + '</span>' +
          '</div>' +
          '<div class="p-stage">' + renderProgressChip(state.done) + '</div>' +
          renderDirectPrepAdminPassageActions(entry) +
        '</div>' +
        '<div class="p-arrow">&rsaquo;</div>' +
      '</div>'
  }).join('')
}

function getPrepPassagePreviewText(passage){
  if(!passage) return ''
  return passage.videoDescription ||
    passage.textLines[0] ||
    String(passage.text || '').slice(0, 120)
}

function renderSetList(visibleSets){
  const container = document.getElementById('set-list')
  if(!visibleSets.length){
    container.innerHTML = '<div class="empty-box">이 반에 배정된 학습 세트가 없습니다.</div>'
    return
  }

  container.innerHTML = visibleSets.map(function(entry, visibleIndex){
    const classNames = ['set-item']
    if(entry.index === currentSetIndex) classNames.push('active')
    if(!entry.isAccessible) classNames.push('disabled')

    return '' +
      '<div class="' + classNames.join(' ') + '"' + (entry.isAccessible ? ' onclick="openStudySet(' + entry.index + ')"' : '') + '>' +
        '<div class="set-num">' + (visibleIndex + 1) + '</div>' +
        '<div class="set-body">' +
          '<button type="button" data-ui-icon-skip="true" class="set-title card-open-action"' + (entry.isAccessible ? '' : ' disabled') + '>' + escapeHtml(entry.studySet.title) + '</button>' +
          '<div class="set-preview">' + escapeHtml(getStudySetDateText(entry.studySet)) + '</div>' +
          '<div class="set-meta">' +
            '<span class="set-badge ' + entry.status + '">' + escapeHtml(getStudySetStatusLabel(entry.status)) + '</span>' +
            '<span class="set-badge">' + entry.assignment.passageIndexes.length + '개 지문</span>' +
            '<span class="set-badge">' + entry.assignment.passageIndexes.reduce(function(sum, passageIndex){
              return sum + (entry.studySet.passages[passageIndex] && entry.studySet.passages[passageIndex].hasVideo ? 1 : 0)
            }, 0) + '개 영상</span>' +
          '</div>' +
        '</div>' +
        '<div class="p-arrow">' + (entry.isAccessible ? '&rsaquo;' : '예정') + '</div>' +
      '</div>'
  }).join('')
}

function openStudySet(index){
  const studySet = studySets[index]
  if(!studySet || !isStudySetAccessible(studySet)) return
  currentSetIndex = index
  currentPassage = -1
  currentStudySectionId = ''
  updateSetProgressContext()
  renderClassSummary()
  renderPassageScreen()
  activateScreen('passage-screen')
}

function openPassage(index){
  return openPassageAt(index, currentSetIndex)
}

function openPassageAt(index, setIndex){
  const targetSetIndex = typeof setIndex === 'number' ? setIndex : currentSetIndex
  const studySet = studySets[targetSetIndex]
  if(!studySet || !studySet.passages[index]) return
  currentSetIndex = targetSetIndex
  currentPassage = index
  currentStudySectionId = ''
  updateSetProgressContext()
  renderClassSummary()
  renderStudy()
  activateScreen('study-screen')
}

function showStudyMenuScreen(){
  showPassageScreen()
}

function goHome(){
  if(shouldUseDirectPrepPassageFlow()){
    goBackFromSetScreen()
    return
  }
  currentPassage = -1
  currentStudySectionId = ''
  renderClassSummary()
  renderSetScreen()
  activateScreen('home-screen')
}

function renderStudyMenu(){
  const studySet = getCurrentStudySet()
  const passage = studySet && studySet.passages[currentPassage]
  const container = document.getElementById('study-menu-list')
  if(!studySet || !passage){
    showPassageScreen()
    return
  }

  const sections = groupItems(passage.items)
  document.getElementById('study-menu-title').textContent = passage.title
  document.getElementById('study-menu-count').textContent = sections.length + '유형'
  document.getElementById('study-menu-meta').textContent = studySet.title + ' · ' + getStudySetDateText(studySet)
  const previewNode = document.getElementById('study-menu-preview')
  if(previewNode){
    previewNode.textContent = passage.textLines[0] || passage.text.slice(0, 100) || '본문 미리보기가 없습니다.'
  }

  container.innerHTML = sections.length
    ? sections.map(function(section, index){
        const sectionState = getSectionProgress(currentPassage, section.id)
        return '' +
          '<button class="study-topic-card" type="button" onclick="openStudySection(\'' + escapePrepInlineJsValue(section.id) + '\')">' +
            '<div class="study-topic-num">' + (index + 1) + '</div>' +
            '<div class="study-topic-body">' +
              '<div class="study-topic-title">' + escapeHtml(section.title) + '</div>' +
              '<div class="study-topic-preview">' + section.items.length + '개의 학습 카드 · ' + (sectionState.done ? '완료' : '진행 중') + '</div>' +
            '</div>' +
            '<div class="study-topic-arrow">&rsaquo;</div>' +
          '</button>'
      }).join('')
    : '<div class="empty-box">이 지문에는 학습할 질문이 없습니다.</div>'
}

function openStudySection(sectionId){
  currentStudySectionId = sectionId
  renderStudy()
  activateScreen('study-screen')
}

function togglePassage(){
  const box = document.getElementById('p-box')
  box.classList.toggle('expanded')
  updatePassageToggleState()
}

function updatePassageToggleState(){
  const box = document.getElementById('p-box')
  const text = document.getElementById('p-txt')
  const toggle = document.getElementById('p-toggle')
  if(!box || !text || !toggle) return

  const restoreExpanded = box.classList.contains('expanded')
  if(restoreExpanded) box.classList.remove('expanded')

  requestAnimationFrame(function(){
    const shouldToggle = text.scrollHeight > (text.clientHeight + 8)

    if(!shouldToggle){
      box.classList.add('expanded')
      box.classList.add('no-toggle')
      toggle.style.display = 'none'
      toggle.textContent = '본문 더보기'
      return
    }

    box.classList.remove('no-toggle')
    toggle.style.display = 'flex'
    if(restoreExpanded) box.classList.add('expanded')
    toggle.textContent = box.classList.contains('expanded') ? '본문 접기' : '본문 더보기'
  })
}

function renderStudy(){
  const studySet = getCurrentStudySet()
  const passage = studySet && studySet.passages[currentPassage]
  if(!studySet || !passage){
    showPassageScreen()
    return
  }
  stopActivePrepVideoPlayback()

  const passageState = getPassageProgress(currentPassage)
  const referenceBox = document.getElementById('p-box')
  const referenceLabel = referenceBox ? referenceBox.querySelector('.lbl') : null
  const referenceText = document.getElementById('p-txt')
  const referenceContent = String(passage.text || '').trim()

  document.getElementById('s-title').textContent = passage.videoTitle || passage.title
  document.getElementById('s-cnt').textContent = passage.hasVideo ? 'VIDEO' : 'READY'
  document.getElementById('study-meta').textContent = studySet.title + ' · ' + getStudySetDateText(studySet)
  document.getElementById('stage-panel').innerHTML = renderPassageVideoPanel(passage, passageState)
  document.getElementById('stage-content').innerHTML = renderPassageVideoBody(passage)
  if(passage.videoRequiresAuth) loadPrepStorageVideo(passage)
  beginPrepWatchTracking(studySet, passage, currentPassage)

  if(referenceBox && referenceText && referenceLabel){
    if(referenceContent){
      referenceBox.style.display = 'block'
      referenceBox.classList.remove('expanded', 'no-toggle')
      referenceLabel.textContent = '지문'
      referenceText.textContent = referenceContent
      document.getElementById('p-toggle').style.display = 'flex'
      document.getElementById('p-toggle').textContent = '본문 더보기'
      updatePassageToggleState()
    }else{
      referenceBox.style.display = 'none'
    }
  }

  renderStageActions()
}

function renderStagePanel(section, sectionState){
  return '' +
    '<div class="study-current-section">' +
      '<div class="study-current-kicker">현재 학습 유형</div>' +
      '<div class="study-current-title">' + escapeHtml(section.title) + '</div>' +
      '<div class="study-current-sub">' + section.items.length + '개의 카드가 준비되어 있습니다. · ' + (sectionState && sectionState.done ? '완료' : '진행 중') + '</div>' +
    '</div>'
}

function renderPassageVideoPanel(passage, passageState){
  return '' +
    '<div class="study-current-section">' +
      '<div class="study-current-kicker">PREP VIDEO</div>' +
      '<div class="study-current-title">' + escapeHtml(passage.videoTitle || passage.title) + '</div>' +
      '<div class="study-current-sub">' + escapeHtml(passage.videoDescription || '지문을 선택하면 바로 영상을 볼 수 있습니다.') + '</div>' +
      '<div class="video-panel-status">' + (passageState && passageState.done ? '기록된 완료 · 자동 검증 여부는 아래 시청 기록 참조' : '자동 시청 기록') + '</div>' +
    '</div>'
}

function renderPassageVideoBody(passage){
  const playerHtml = renderPassageVideoPlayer(passage)
  const infoHtml = passage.videoDescription
    ? '<div class="video-stage-note">' + escapeHtml(passage.videoDescription).replace(/\n/g, '<br>') + '</div>'
    : ''

  return '' +
    '<section class="group video-stage">' +
      '<div class="group-title">' +
        '<h3>영상 보기</h3>' +
        '<span class="group-count">' + escapeHtml(passage.hasVideo ? 'LIVE' : 'EMPTY') + '</span>' +
      '</div>' +
      playerHtml +
      infoHtml +
    '</section>'
}

function renderPassageVideoPlayer(passage){
  if(passage.videoRequiresAuth){
    return '<div class="video-player-shell">' +
      '<video class="video-inline-player" controls playsinline preload="metadata" aria-label="' + escapeHtml(passage.videoTitle || passage.title || 'PREP 학습 영상') + '" aria-describedby="prep-video-load-status"></video></div>' +
      '<p class="video-stage-note" id="prep-video-load-status" role="status" aria-live="polite">영상을 불러오는 중입니다.</p>' +
      '<button class="btn btn-blue" id="prep-video-retry-btn" type="button" hidden>영상 다시 불러오기</button>'
  }
  if(passage.videoEmbedUrl){
    let embedUrl = passage.videoEmbedUrl
    if(passage.videoProvider === 'youtube'){
      const url = new URL(embedUrl)
      url.searchParams.set('enablejsapi', '1')
      url.searchParams.set('origin', window.location.origin)
      url.searchParams.set('playsinline', '1')
      embedUrl = url.href
    }
    return '' +
      '<div class="video-player-shell">' +
        '<div class="video-player-ratio">' +
          '<iframe class="video-embed-frame" src="' + escapeHtml(embedUrl) + '" title="' + escapeHtml(passage.videoTitle || passage.title) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
        '</div>' +
      '</div>'
  }

  if(passage.videoUrl){
    return '' +
      '<div class="video-player-shell">' +
        '<video class="video-inline-player" controls playsinline preload="metadata"' + (passage.videoPoster ? ' poster="' + escapeHtml(passage.videoPoster) + '"' : '') + '>' +
          '<source src="' + escapeHtml(passage.videoUrl) + '">' +
        '</video>' +
      '</div>'
  }

  return '<div class="empty-box video-empty-box">등록된 영상이 없습니다.</div>'
}

let prepStoragePlayback = null

async function loadPrepStorageVideo(passage){
  if(prepStoragePlayback){
    prepStoragePlayback.controller.abort()
    if(prepStoragePlayback.objectUrl) URL.revokeObjectURL(prepStoragePlayback.objectUrl)
  }
  const playback = {controller: new AbortController(), objectUrl: ''}
  prepStoragePlayback = playback
  const player = document.querySelector('#stage-content .video-inline-player')
  const status = document.getElementById('prep-video-load-status')
  const retry = document.getElementById('prep-video-retry-btn')
  if(!player || !status || !retry) return
  player.pause()
  player.removeAttribute('src')
  player.load()
  retry.hidden = true
  retry.onclick = function(){ loadPrepStorageVideo(passage) }
  status.textContent = '영상을 불러오는 중입니다.'
  try{
    if(!passage.videoStoragePath) throw new Error('영상 경로 점검이 필요합니다.')
    const blob = await fetchPortalStorageBlob(passage.videoStoragePath, 'video/mp4', playback.controller.signal)
    if(prepStoragePlayback !== playback || playback.controller.signal.aborted) return
    playback.objectUrl = URL.createObjectURL(blob)
    player.src = playback.objectUrl
    player.load()
    status.textContent = '재생 준비가 완료되었습니다.'
  }catch(error){
    if(prepStoragePlayback !== playback || playback.controller.signal.aborted) return
    status.textContent = '영상을 불러오지 못했습니다. 배정 권한과 연결 상태를 확인한 뒤 다시 시도해 주세요.'
    retry.hidden = false
  }
}

function stopActivePrepVideoPlayback(){
  stopPrepWatchTracking()
  if(prepStoragePlayback){
    prepStoragePlayback.controller.abort()
    if(prepStoragePlayback.objectUrl) URL.revokeObjectURL(prepStoragePlayback.objectUrl)
    prepStoragePlayback = null
  }
  const studyScreen = document.getElementById('study-screen')
  if(!studyScreen) return

  Array.from(studyScreen.querySelectorAll('video')).forEach(function(video){
    try{
      video.pause()
      video.removeAttribute('src')
      Array.from(video.querySelectorAll('source')).forEach(function(source){
        source.removeAttribute('src')
      })
      video.load()
    }catch(error){
      console.warn('video stop skipped:', error && error.message ? error.message : error)
    }
  })

  Array.from(studyScreen.querySelectorAll('iframe.video-embed-frame')).forEach(function(frame){
    try{
      frame.setAttribute('src', 'about:blank')
    }catch(error){
      console.warn('iframe stop skipped:', error && error.message ? error.message : error)
    }
  })
}

window.stopActivePrepVideoPlayback = stopActivePrepVideoPlayback

let prepWatchTracker = null
let prepYouTubeApiPromise = null
let prepWatchPendingRequest = null

function getPrepWatchVideoKey(passage){
  const version = String(passage.videoUpdatedAt || '')
  if(passage.videoStoragePath) return 'storage:' + passage.videoStoragePath + ':' + version
  const parsed = parsePassageVideoUrl(passage.videoEmbedUrl || passage.videoUrl)
  return parsed && parsed.provider === 'youtube' ? ('youtube:' + parsed.id + ':' + version) : ''
}

function formatPrepWatchProgress(row){
  const minutes = function(value){ return (Math.max(0, Number(value) || 0) / 60).toFixed(1) }
  const ratio = row && row.duration > 0 ? Math.min(100, Math.floor(row.watchedSeconds / row.duration * 100)) : 0
  return '재생 ' + minutes(row && row.playSeconds) + '분 · 시청 구간 ' + minutes(row && row.watchedSeconds) + '/' + minutes(row && row.duration) + '분 (' + ratio + '%) · ' + (row && row.done ? '자동 완료' : '미완료')
}

function isCurrentPrepWatch(tracker){
  return prepWatchTracker === tracker && portalState.currentUser && portalState.currentUser.uid === tracker.uid && portalState.userSession === tracker.userSession
}

function syncPrepWatchStatus(){
  const status = document.getElementById('prep-watch-status')
  const summary = document.getElementById('prep-watch-summary')
  const retry = document.getElementById('prep-watch-retry')
  const tracker = prepWatchTracker
  if(status) status.textContent = tracker ? tracker.message : '자동 기록은 로그인한 학생이 CODE LAB 안에서 재생할 때 적용됩니다.'
  if(summary) summary.textContent = tracker && tracker.progress ? (formatPrepWatchProgress(tracker.progress) + (tracker.legacyDone ? ' · 기존 수동 완료 기록 보존' : '')) : '기존 수동 완료 기록은 보존되며 자동 시청 시간으로 환산되지 않습니다.'
  if(retry) retry.hidden = !tracker || !tracker.error
}

function loadPrepYouTubeApi(){
  if(window.YT && window.YT.Player) return Promise.resolve()
  if(prepYouTubeApiPromise) return prepYouTubeApiPromise
  prepYouTubeApiPromise = new Promise(function(resolve, reject){
    const previous = window.onYouTubeIframeAPIReady
    const script = document.createElement('script')
    const timer = setTimeout(function(){ script.remove(); reject(new Error('YouTube 재생 기록 연결 시간이 초과되었습니다.')) }, 15000)
    window.onYouTubeIframeAPIReady = function(){ clearTimeout(timer); resolve(); if(typeof previous === 'function') previous() }
    script.src = 'https://www.youtube.com/iframe_api'
    script.onerror = function(){ clearTimeout(timer); script.remove(); reject(new Error('YouTube 재생 기록을 연결하지 못했습니다.')) }
    document.head.appendChild(script)
  }).catch(function(error){ prepYouTubeApiPromise = null; throw error })
  return prepYouTubeApiPromise
}

async function callPrepWatchServer(data){
  const user = portalState.currentUser
  if(!user || typeof user.getIdToken !== 'function') throw new Error('학생 로그인이 필요합니다.')
  const token = await user.getIdToken()
  const projectId = window.ROTATION_FIREBASE_CONFIG && window.ROTATION_FIREBASE_CONFIG.projectId
  if(!/^[a-z0-9-]+$/.test(projectId || '')) throw new Error('검증 서버 설정을 확인해 주세요.')
  const emulator = window.ROTATION_PREP_WATCH_EMULATOR
  if(emulator && (!['127.0.0.1','localhost'].includes(window.location.hostname) || !projectId.startsWith('demo-') || emulator !== 'http://127.0.0.1:5001')) throw new Error('로컬 검증 서버 설정이 잘못되었습니다.')
  const url = emulator ? emulator + '/' + projectId + '/asia-northeast3/recordPrepWatch' : 'https://asia-northeast3-' + projectId + '.cloudfunctions.net/recordPrepWatch'
  let response, body
  try{
    response = await fetch(url, {method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer ' + token}, body:JSON.stringify({data:data}), signal:AbortSignal.timeout(12000)})
    body = await response.json()
  }catch(error){ throw new Error('시청 기록 서버에 연결하지 못했습니다. 다시 연결해 주세요. 저장되지 않은 시간은 완료에 포함되지 않습니다.') }
  if(!response.ok || body.error){
    const error = new Error('시청 기록 서버 연결에 실패했습니다. 저장되지 않은 시간은 완료에 포함되지 않습니다.')
    error.code = body.error && body.error.status
    throw error
  }
  if(!body.result || !body.result.progress || body.result.progress.trackingVersion !== 1) throw new Error('서버 시청 기록을 확인하지 못했습니다.')
  return body.result
}

function capturePrepWatchSample(tracker, state){
  if(!tracker.read) return null
  const value = tracker.read()
  if(!Number.isFinite(value.position) || !Number.isFinite(value.rate)) return null
  return {position:Math.max(0, value.position), rate:value.rate, state:document.hidden ? 'paused' : (state || value.state), at:performance.now()}
}

function prepWatchSample(tracker, state){
  const value = state && typeof state === 'object' ? state : capturePrepWatchSample(tracker, state)
  if(!value) return null
  tracker.pendingAt = value.at
  return {action:'sample', materialId:tracker.materialId, passageIndex:tracker.passageIndex,
    videoKey:tracker.videoKey,
    requestId:crypto.randomUUID(), sessionId:tracker.sessionId, sequence:tracker.sequence + 1,
    position:value.position, rate:value.rate, state:value.state,
    elapsedSeconds:Math.min(15, Math.max(0, (value.at - (tracker.lastSampleAt === undefined ? value.at : tracker.lastSampleAt)) / 1000))}
}

function applyPrepWatchServerProgress(tracker, record){
  if(!portalState.currentUser || portalState.currentUser.uid !== tracker.uid || portalState.userSession !== tracker.userSession || !record || record.userId !== tracker.uid || record.trackingVersion !== 1) return false
  mergePortalPrepVideoProgressCache(record)
  const changed = applyPortalPrepVideoProgressRowsToCurrentPrepClass()
  if(changed && getCurrentActiveScreenId() === 'passage-screen'){
    renderClassSummary()
    renderPassageScreen()
  }
  return true
}

async function sendPrepWatchSample(tracker, state){
  if(!isCurrentPrepWatch(tracker) || tracker.busy || tracker.blocked) return
  if(!tracker.pending && !tracker.sessionId) return
  tracker.busy = true
  try{
    const request = tracker.pending || prepWatchSample(tracker, state)
    if(!request) return
    tracker.pending = request
    // Keep only the one in-flight request; offline elapsed time cannot be backfilled as trusted playback.
    const serialized = JSON.stringify(request)
    localStorage.setItem(tracker.pendingKey, serialized)
    tracker.requestPromise = callPrepWatchServer(request)
    prepWatchPendingRequest = tracker.requestPromise
    const result = await tracker.requestPromise
    if(localStorage.getItem(tracker.pendingKey) === serialized) localStorage.removeItem(tracker.pendingKey)
    tracker.pending = null
    if(!applyPrepWatchServerProgress(tracker, result.progress)) return
    if(!isCurrentPrepWatch(tracker)) return
    tracker.sessionId = result.sessionId
    tracker.sequence = result.sequence
    tracker.lastSampleAt = request.action === 'start' ? performance.now() : tracker.pendingAt
    if(request.action === 'sample') tracker.lastState = request.state
    tracker.progress = result.progress
    if(!tracker.blocked){
      tracker.error = false
      tracker.message = result.progress.done ? '서버가 자동 완료를 확인했습니다.' : '서버 저장 완료 · 95% 이상 시청 후 끝에 도달하면 자동 완료됩니다. 연결이 끊긴 시간은 인정되지 않습니다.'
    }
    if((request.state === 'seeking' || request.state === 'ratechange') && !(tracker.queuedSamples && tracker.queuedSamples.length)){
      tracker.queuedSamples = [capturePrepWatchSample(tracker)]
    }
    const panelStatus = document.querySelector('#study-screen .video-panel-status')
    if(panelStatus) panelStatus.textContent = result.progress.done ? '자동 시청 완료' : '자동 시청 기록 · 진행 중'
  }catch(error){
    if(!isCurrentPrepWatch(tracker)) return
    tracker.error = true
    tracker.message = error.message || '시청 기록 저장 실패 · 다시 연결해 주세요.'
    if(['FAILED_PRECONDITION','PERMISSION_DENIED','UNAUTHENTICATED','INVALID_ARGUMENT','RESOURCE_EXHAUSTED'].includes(error.code)) tracker.blocked = true
  }finally{
    if(prepWatchPendingRequest === tracker.requestPromise) prepWatchPendingRequest = null
    tracker.busy = false
    if(isCurrentPrepWatch(tracker)){
      syncPrepWatchStatus()
      if(!tracker.error && tracker.queuedSamples && tracker.queuedSamples.length) void sendPrepWatchSample(tracker, tracker.queuedSamples.shift())
    }
  }
}

function queuePrepWatchSample(tracker, state){
  if(!isCurrentPrepWatch(tracker)) return
  if(!tracker.sessionId) return
  if(state === 'ratechange') tracker.resetPoll = true
  const sample = capturePrepWatchSample(tracker, state)
  if(!sample) return
  tracker.queuedSamples = tracker.queuedSamples || []
  if(tracker.queuedSamples.length >= 32){
    // Discard overloaded intervals without certifying them; resume from a fresh seek baseline.
    sample.state = 'seeking'
    tracker.queuedSamples = []
  }
  tracker.queuedSamples.push(sample)
  if(!tracker.busy) void sendPrepWatchSample(tracker, tracker.pending ? undefined : tracker.queuedSamples.shift())
}

async function beginPrepWatchTracking(studySet, passage, passageIndex){
  if(typeof portalState === 'undefined' || !portalState.currentUser || isPortalAdmin() || !portalState.firebaseEnabled) return
  const tracker = {uid:portalState.currentUser.uid, userSession:portalState.userSession, materialId:studySet.materialId,
    videoKey:getPrepWatchVideoKey(passage),
    setIndex:currentSetIndex, passageIndex:passageIndex, sequence:0, sessionId:'', message:'자동 시청 기록을 연결하고 있습니다.', cleanup:[], error:false}
  prepWatchTracker = tracker
  tracker.legacyDone = (portalState.currentPrepVideoProgressRows || []).some(function(row){
    return row.trackingVersion !== 1 && row.userId === tracker.uid && row.setId === getPortalPrepProgressSetId(studySet, currentSetIndex) && row.passageId === getPortalPrepProgressPassageId(passage, passageIndex) && row.passageIndex === passageIndex && row.done
  })
  syncPrepWatchStatus()
  try{
    if(!tracker.materialId || !getPrepWatchVideoKey(passage)) throw new Error('이 자료는 자동 기록 설정 확인이 필요합니다. 기존 수동 기록은 보존됩니다.')
    let tabId = sessionStorage.getItem('prep-watch-tab')
    if(!tabId){ tabId = crypto.randomUUID(); sessionStorage.setItem('prep-watch-tab',tabId) }
    tracker.pendingKey = 'rotation_prep_watch_pending_v1:' + tracker.uid + ':' + tabId
    if(prepWatchPendingRequest){ try{ await prepWatchPendingRequest }catch(error){} }
    if(!isCurrentPrepWatch(tracker)) return
    const pending = localStorage.getItem(tracker.pendingKey)
    if(pending){
      const recovered = JSON.parse(pending)
      // Recovery uses the current Auth token; the server validates ownership and assignment again.
      const recoveredResult = await callPrepWatchServer(recovered)
      applyPrepWatchServerProgress(tracker, recoveredResult.progress)
      if(localStorage.getItem(tracker.pendingKey) === pending) localStorage.removeItem(tracker.pendingKey)
    }
    if(!isCurrentPrepWatch(tracker)) return
    if(passage.videoProvider === 'youtube'){
      await loadPrepYouTubeApi()
      if(!isCurrentPrepWatch(tracker)) return
      const frame = document.querySelector('#stage-content .video-embed-frame')
      await new Promise(function(resolve,reject){
        const timer = setTimeout(function(){ reject(new Error('영상 재생 기록 준비 시간이 초과되었습니다.')) },15000)
        tracker.cleanup.push(function(){ clearTimeout(timer) })
        tracker.player = new window.YT.Player(frame, {events:{
          onReady:function(){ clearTimeout(timer); resolve() },
          onStateChange:function(event){
            if(!tracker.sessionId && event.data === 1 && !tracker.error){ tracker.player.pauseVideo(); return }
            if(tracker.sessionId) queuePrepWatchSample(tracker, event.data === 0 ? 'ended' : event.data === 1 ? 'playing' : 'paused')
          },
          onPlaybackRateChange:function(){ queuePrepWatchSample(tracker,'ratechange') },
          onError:function(){
            clearTimeout(timer)
            if(isCurrentPrepWatch(tracker)){
              if(tracker.sessionId) queuePrepWatchSample(tracker,'paused')
              tracker.error = true; tracker.blocked = true; tracker.message = 'YouTube 영상을 재생할 수 없습니다. 영상과 연결 상태를 확인해 주세요.'
              syncPrepWatchStatus()
            }
            reject(new Error('YouTube 영상을 재생할 수 없습니다.'))
          }
        }})
      })
      tracker.read = function(){ return {position:tracker.player.getCurrentTime(), rate:tracker.player.getPlaybackRate(), state:tracker.player.getPlayerState() === 1 ? 'playing' : tracker.player.getPlayerState() === 0 ? 'ended' : 'paused'} }
    }else{
      const player = document.querySelector('#stage-content video')
      if(!player) throw new Error('영상 플레이어를 찾지 못했습니다.')
      tracker.read = function(){ return {position:player.currentTime, rate:player.playbackRate, state:player.ended ? 'ended' : player.paused || tracker.buffering ? 'paused' : 'playing'} }
      ;[['play','playing'],['playing','playing'],['pause','paused'],['ended','ended'],['seeking','seeking'],['seeked','seeking'],['ratechange','ratechange'],['waiting','paused']].forEach(function(entry){
        const listener = function(){
          if(entry[0] === 'play' && !tracker.sessionId && !tracker.error){ player.pause(); return }
          if(entry[0] === 'waiting') tracker.buffering = true
          if(entry[0] === 'playing') tracker.buffering = false
          queuePrepWatchSample(tracker,entry[1])
        }
        player.addEventListener(entry[0],listener)
        tracker.cleanup.push(function(){ player.removeEventListener(entry[0],listener) })
      })
    }
    if(!isCurrentPrepWatch(tracker)) return
    tracker.pending = {action:'start',materialId:tracker.materialId,passageIndex:passageIndex,videoKey:tracker.videoKey,requestId:crypto.randomUUID()}
    await sendPrepWatchSample(tracker)
    if(!isCurrentPrepWatch(tracker)) return
    queuePrepWatchSample(tracker, tracker.read().state)
    const visibility = function(){ queuePrepWatchSample(tracker,'seeking') }
    document.addEventListener('visibilitychange', visibility)
    tracker.cleanup.push(function(){ document.removeEventListener('visibilitychange',visibility) })
    let last = null, ticks = 0
    tracker.timer = setInterval(function(){
      if(!isCurrentPrepWatch(tracker)) return
      const value = tracker.read(), now = performance.now()
      const jumped = !tracker.resetPoll && last && Math.abs(value.position-last.position-(now-last.at)/1000*last.rate) > 1 && last.state === 'playing'
      tracker.resetPoll = false
      last = {...value,at:now}
      if(jumped) queuePrepWatchSample(tracker,'seeking')
      else if(++ticks % 5 === 0){
        const state = document.hidden ? 'paused' : value.state
        if(tracker.pending || state === 'playing' || state !== tracker.lastState) queuePrepWatchSample(tracker, state)
      }
    },1000)
  }catch(error){
    if(!isCurrentPrepWatch(tracker)) return
    tracker.error = true; tracker.blocked = true; tracker.message = error.message || '자동 기록을 연결하지 못했습니다.'
    syncPrepWatchStatus()
  }
}

function stopPrepWatchTracking(){
  const tracker = prepWatchTracker
  if(!tracker) return
  // A final request is best effort. Unacknowledged data stays pending; no speculative completion is shown.
  if(!tracker.pending && !tracker.busy) queuePrepWatchSample(tracker, 'paused')
  clearInterval(tracker.timer)
  tracker.cleanup.forEach(function(cleanup){ cleanup() })
  if(tracker.player) tracker.player.destroy()
  prepWatchTracker = null
}

function retryPrepWatchTracking(){
  const tracker = prepWatchTracker
  if(tracker && tracker.blocked && tracker.pendingKey) localStorage.removeItem(tracker.pendingKey)
  renderStudy()
}

function groupItems(items){
  const configs = [
    { id: 'big-picture', title: '주제' },
    { id: 'translation', title: '문장 해석' },
    { id: 'vocab', title: '동의어 / 반의어' },
    { id: 'grammar', title: '어법' }
  ]

  const buckets = new Map()
  configs.forEach(function(config){
    buckets.set(config.id, [])
  })

  ;(Array.isArray(items) ? items : []).forEach(function(item, index){
    const groupId = getStudyItemGroupId(item)
    if(!buckets.has(groupId)) return
    buckets.get(groupId).push({ item: item, originalIndex: index })
  })

  return configs.map(function(config){
    const wrappedItems = buckets.get(config.id) || []
    wrappedItems.sort(function(a, b){
      const orderDiff = getStudyItemSortOrder(a.item) - getStudyItemSortOrder(b.item)
      return orderDiff || (a.originalIndex - b.originalIndex)
    })
    return {
      id: config.id,
      title: config.title,
      items: wrappedItems.map(function(entry){ return entry.item })
    }
  }).filter(function(group){
    return group.items.length > 0
  })
}

function getStudyItemGroupId(item){
  if(item && item.group) return item.group
  if(item && item.type === 'translate') return 'translation'
  if(item && item.type === 'vocab') return 'vocab'
  if(item && item.type === 'grammar') return 'grammar'
  return 'big-picture'
}

function getStudyItemSortOrder(item){
  const key = String(item && item.key || '')
  if(key.indexOf('qa-topic') === 0) return 1
  return 20
}

function renderSection(section){
  return '' +
    '<section class="group">' +
      '<div class="group-title">' +
        '<h3>' + escapeHtml(section.title) + '</h3>' +
        '<span class="group-count">' + section.items.length + '</span>' +
      '</div>' +
      '<div class="item-list">' +
        section.items.map(function(item){
          return item.type === 'vocab' ? renderStudyVocab(item) : renderStudyItem(item)
        }).join('') +
      '</div>' +
    '</section>'
}

function renderStudyItem(item){
  const promptHtml = item && item.promptHtml
    ? '<div class="item-prompt">' + item.promptHtml + '</div>'
    : (item && item.prompt ? '<div class="item-prompt">' + escapeHtml(item.prompt) + '</div>' : '')
  const contextHtml = item && item.contextHtml
    ? '<div class="item-context">' + item.contextHtml + '</div>'
    : (item && item.context ? '<div class="item-context">' + escapeHtml(item.context) + '</div>' : '')
  return '' +
    '<div class="item-card">' +
      '<div class="item-label">' + escapeHtml(item.label) + '</div>' +
      promptHtml +
      contextHtml +
      renderAnswerSheet(item.answer) +
    '</div>'
}

function renderStudyVocab(item){
  const vocab = item.vocab || {}
  const displayWord = String(vocab.word || '').trim().toLowerCase()
  return '' +
    '<div class="item-card">' +
      '<div class="item-label">' + escapeHtml(item.label) + '</div>' +
      '<div class="vocab-word">' + escapeHtml(displayWord) + '</div>' +
      '<div class="answer-sheet vocab-answer-sheet">' +
        '<div class="answer-title">단어 정리</div>' +
        renderVocabAnswerGrid(vocab) +
      '</div>' +
    '</div>'
}

function renderAnswerSheet(answerText, customInnerHtml){
  return '' +
    '<div class="answer-sheet">' +
      '<div class="answer-title">정답 확인</div>' +
      (typeof customInnerHtml === 'string'
        ? customInnerHtml
        : '<div class="answer-text">' + renderAnswerText(answerText, '등록된 정답이 없습니다.') + '</div>') +
    '</div>'
}

function renderAnswerText(text, emptyMessage){
  const trimmed = String(text || '').trim()
  return trimmed
    ? escapeHtml(trimmed).replace(/\n/g, '<br>')
    : ('<span class="missing">' + escapeHtml(emptyMessage) + '</span>')
}

function renderVocabAnswerGrid(vocab){
  return '' +
    '<div class="answer-grid answer-grid-vocab">' +
      renderAnswerChip('뜻', vocab.meaning, '없음') +
      renderAnswerChip('유의', vocab.syn, '없음') +
      renderAnswerChip('반의', vocab.ant, '없음') +
      renderAnswerChip('반의뜻', vocab.antMeaning, '없음') +
    '</div>'
}

function renderAnswerChip(label, value, emptyMessage){
  return '' +
    '<div class="answer-chip">' +
      '<div class="answer-chip-label">' + escapeHtml(label) + '</div>' +
      '<div class="answer-chip-text">' + renderAnswerText(value, emptyMessage) + '</div>' +
    '</div>'
}

function getStudySectionProgressKey(passageIndex, sectionId){
  const baseKey = getPassageProgressStorageKey(currentSetIndex, passageIndex)
  return sectionId ? (baseKey + ':' + String(sectionId || '').trim()) : baseKey
}

function getPassageSections(passageIndex){
  const studySet = getCurrentStudySet()
  const passage = studySet && studySet.passages[passageIndex]
  return passage ? groupItems(passage.items) : []
}

function migrateLegacyPassageProgress(passageIndex){
  if(!progress.done || typeof progress.done !== 'object') return false
  const legacyKey = String(passageIndex)
  if(!progress.done[legacyKey]) return false
  const sections = getPassageSections(passageIndex)
  sections.forEach(function(section){
    progress.done[getStudySectionProgressKey(passageIndex, section.id)] = true
  })
  delete progress.done[legacyKey]
  saveProgress()
  return true
}

function getSectionProgress(passageIndex, sectionId){
  return getPassageProgress(passageIndex)
}

function getPassageProgress(passageIndex, setIndex){
  const storageKey = getPassageProgressStorageKey(
    typeof setIndex === 'number' ? setIndex : currentSetIndex,
    passageIndex
  )
  return {
    done: !!(progress.done && progress.done[storageKey]),
    completedCount: 0,
    totalCount: 1
  }
}

function renderStageActions(){
  document.getElementById('stage-actions').innerHTML =
    '<p class="video-stage-note" id="prep-watch-summary"></p>' +
    '<p class="video-stage-note" id="prep-watch-status" role="status" aria-live="polite" aria-atomic="true">자동 시청 기록을 준비하고 있습니다.</p>' +
    '<button class="btn btn-ghost" id="prep-watch-retry" type="button" onclick="retryPrepWatchTracking()" hidden>시청 기록 다시 연결</button>' +
    '<button class="btn btn-ghost" type="button" onclick="showPassageScreen()">목록으로 돌아가기</button>' +
    ''
  syncPrepWatchStatus()
}

function syncCurrentPassageProgressUi(isDone){
  const statusNode = document.querySelector('#study-screen .video-panel-status')
  if(statusNode){
    statusNode.innerHTML = renderProgressChip(!!isDone)
  }
  renderStageActions()
}

function markPassageDone(){
  if(typeof portalState !== 'undefined' && portalState.firebaseEnabled) return
  if(currentPassage < 0) return
  if(!progress.done || typeof progress.done !== 'object') progress.done = {}
  const studySet = getCurrentStudySet()
  const passage = studySet && studySet.passages ? studySet.passages[currentPassage] : null
  const storageKey = getPassageProgressStorageKey(currentSetIndex, currentPassage)
  const nextDone = !progress.done[storageKey]
  progress.done[storageKey] = nextDone
  saveProgress()
  syncCurrentPassageProgressUi(nextDone)
  if(typeof window.savePortalPrepVideoProgress === 'function' && studySet && passage){
    window.savePortalPrepVideoProgress({
      studySet: studySet,
      setIndex: currentSetIndex,
      passage: passage,
      passageIndex: currentPassage,
      done: nextDone
    }).catch(function(error){
      console.warn('prep video progress save failed:', error && error.message ? error.message : error)
      showToast('시청 기록 Firebase 저장에 실패했습니다. 로컬 완료 표시는 유지됩니다.', 'var(--red)')
    })
  }
  showToast(nextDone ? '영상을 완료로 표시했습니다.' : '영상 완료 표시를 취소했습니다.', 'var(--green)')
}

function renderStat(value, label){
  return '' +
    '<div class="stat">' +
      '<div class="stat-n">' + escapeHtml(String(value)) + '</div>' +
      '<div class="stat-l">' + escapeHtml(label) + '</div>' +
    '</div>'
}

function renderStatusBadge(done){
  return '<span class="stage-chip ' + (done ? 'done' : '') + '">' + (done ? '학습 완료' : '학습 중') + '</span>'
}

function renderProgressChip(done){
  return '<span class="stage-chip ' + (done ? 'done' : '') + '">' + (done ? '완료' : '진행 중') + '</span>'
}

function resetProgress(){
  const currentClass = getCurrentClass()
  const currentSet = getCurrentStudySet()
  const prefix = currentClass ? '[' + currentClass.name + '] ' : ''
  const setTitle = shouldUseDirectPrepPassageFlow()
    ? 'PREP 전체 영상'
    : (currentSet ? currentSet.title : '현재 세트')

  if(!window.confirm(prefix + setTitle + '의 학습 기록을 초기화할까요?')) return

  progress = { done: {} }
  saveProgress()
  renderPassageScreen()
  if(document.getElementById('study-screen').classList.contains('active')) renderStudy()
  showToast('학습 기록을 초기화했습니다.', 'var(--green)')
}
