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
  return String(value == null ? '' : value)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n')
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
  const passageIndex = Number(entry && entry.passageIndex)
  const deleteButton = entry && entry.passage && entry.passage.hasVideo
    ? '<button class="btn btn-ghost btn-sm admin-content-action-danger" type="button" onclick="event.stopPropagation(); window.removePortalPrepPassageVideoFromSet(\'' + escapedDocId + '\', ' + passageIndex + ')">영상 삭제</button>'
    : ''
  return '' +
    '<div class="p-actions" onclick="event.stopPropagation()">' +
      '<button class="btn btn-ghost btn-sm" type="button" onclick="event.stopPropagation(); window.openPortalPrepVideoManager(\'' + escapedDocId + '\')">영상 관리</button>' +
      deleteButton +
    '</div>'
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
      '<div class="class-item" onclick="requestClassAccess(' + index + ')">' +
        '<div class="class-num">' + (visibleIndex + 1) + '</div>' +
        '<div class="class-body">' +
          '<div class="class-title">' + escapeHtml(classInfo.name) + '</div>' +
          '<div class="class-preview">' + studyCount + '개의 학습 세트가 준비되어 있습니다.</div>' +
          '<div class="class-tags">' +
            '<span class="class-tag">세트 ' + studyCount + '</span>' +
            '<span class="class-tag">' + (classInfo.password ? '비밀번호 있음' : '바로 입장') + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="p-arrow">&rsaquo;</div>' +
      '</div>'
  }).join('')
}

function renderClassSummary(){
  const currentClass = getCurrentClass()
  const currentSet = getCurrentStudySet()
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

  document.getElementById('passage-bar').style.display = shouldUseDirectPrepPassageFlow() ? 'none' : (currentSet ? 'flex' : 'none')
  if(currentSet){
    document.getElementById('current-set-name').textContent = currentSet.title
    document.getElementById('current-set-meta').textContent = getStudySetDateText(currentSet)
  }else{
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
    renderStat(assignment.passageIndexes.length, '지문'),
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
          '<div class="p-title">' + escapeHtml(passage.title) + '</div>' +
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
  const container = document.getElementById('p-list')
  const passageEntries = getVisiblePrepPassageEntries()
  const doneCount = passageEntries.filter(function(entry){
    return getPassageProgress(entry.passageIndex, entry.setIndex).done
  }).length

  if(!passageEntries.length){
    document.getElementById('passage-bar').style.display = 'none'
    document.getElementById('passage-stats').innerHTML = [
      renderStat(0, '지문'),
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

  document.getElementById('passage-bar').style.display = 'none'
  document.getElementById('passage-stats').innerHTML = [
    renderStat(passageEntries.length, '지문'),
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
          '<div class="p-title">' + escapeHtml(entry.passage.title) + '</div>' +
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
          '<div class="set-title">' + escapeHtml(entry.studySet.title) + '</div>' +
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
          '<button class="study-topic-card" type="button" onclick="openStudySection(\'' + escapeHtml(section.id) + '\')">' +
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
      '<div class="video-panel-status">' + renderProgressChip(!!(passageState && passageState.done)) + '</div>' +
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
  if(passage.videoEmbedUrl){
    return '' +
      '<div class="video-player-shell">' +
        '<div class="video-player-ratio">' +
          '<iframe class="video-embed-frame" src="' + escapeHtml(passage.videoEmbedUrl) + '" title="' + escapeHtml(passage.videoTitle || passage.title) + '" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>' +
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

function stopActivePrepVideoPlayback(){
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
  const state = getPassageProgress(currentPassage)
  document.getElementById('stage-actions').innerHTML =
    '<button class="btn ' + (state.done ? 'btn-ghost' : 'btn-green') + '" type="button" onclick="markPassageDone()">' +
      (state.done ? '영상 완료 취소' : '영상 완료') +
    '</button>' +
    '<button class="btn btn-ghost" type="button" onclick="showPassageScreen()">목록으로 돌아가기</button>' +
    ''
}

function syncCurrentPassageProgressUi(isDone){
  const statusNode = document.querySelector('#study-screen .video-panel-status')
  if(statusNode){
    statusNode.innerHTML = renderProgressChip(!!isDone)
  }
  renderStageActions()
}

function markPassageDone(){
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
