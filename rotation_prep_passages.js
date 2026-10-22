function buildPassageState(source, index){
  const text = String(source && source.text || '').trim()
  const textLines = splitLines(text)
  const translationText = buildTranslationText(source, textLines)
  const title = getPassageTitle(source, index)
  const video = normalizePassageVideo(source, title)
  const selectedLines = mapSelectedLines(source, textLines)
  const grammarSelections = normalizeGrammarSelections(source)
  const vocabRows = normalizeVocabRows(source)
  const questionAnswers = normalizeQuestionAnswers(source && source.questionAnswers || {})

  return {
    id: String(source && source.id || ('passage-' + (index + 1))).trim() || ('passage-' + (index + 1)),
    index: index,
    title: title,
    text: text,
    textLines: textLines,
    videoUrl: video.url,
    videoEmbedUrl: video.embedUrl,
    videoPoster: video.poster,
    videoTitle: video.title,
    videoDescription: video.description,
    videoProvider: video.provider,
    videoUpdatedAt: String(source && (source.video && source.video.updatedAt || source.videoUpdatedAt) || ''),
    videoStoragePath: video.storagePath,
    videoRequiresAuth: video.requiresAuth,
    hasVideo: video.hasVideo,
    translationText: translationText,
    translationLines: splitLines(translationText),
    selectedLines: selectedLines,
    grammarSelections: grammarSelections,
    vocabRows: vocabRows,
    questionAnswers: questionAnswers,
    items: buildStudyItems({
      textLines: textLines,
      translationText: translationText,
      selectedLines: selectedLines,
      grammarSelections: grammarSelections,
      vocabRows: vocabRows,
      questionAnswers: questionAnswers
    })
  }
}

function normalizePassageVideo(source, fallbackTitle){
  const rawVideo = source && typeof source.video === 'object' ? source.video : {}
  const rawUrl = String(
    rawVideo.url ||
    rawVideo.src ||
    rawVideo.fileUrl ||
    source && (source.videoUrl || source.videoSrc || source.videoFileUrl || source.videoFile || source.videoLink) ||
    ''
  ).trim()
  const rawEmbedUrl = String(
    rawVideo.embedUrl ||
    rawVideo.iframeUrl ||
    source && (source.videoEmbedUrl || source.videoIframeUrl) ||
    ''
  ).trim()

  const embedUrl = normalizePassageVideoEmbedUrl(rawEmbedUrl || rawUrl)
  const provider = inferPassageVideoProvider(embedUrl || rawUrl)
  let storagePath = String(rawVideo.storagePath || source && source.videoStoragePath || '').trim()
  let requiresAuth = !!storagePath || !!(source && source.videoRequiresAuth === true)
  for(const candidate of [rawUrl, rawEmbedUrl]){
    try{
      const url = new URL(candidate)
      if(['firebasestorage.googleapis.com', 'storage.googleapis.com'].includes(url.hostname) || url.protocol === 'gs:'){
        requiresAuth = true
        const bucket = String((window.ROTATION_FIREBASE_CONFIG || {}).storageBucket || '')
        if(!storagePath && url.hostname === 'firebasestorage.googleapis.com'){
          const match = url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/)
          if(match && decodeURIComponent(match[1]) === bucket) storagePath = decodeURIComponent(match[2])
        }
        if(!storagePath && url.hostname === 'storage.googleapis.com' && url.pathname.startsWith('/' + bucket + '/')) storagePath = decodeURIComponent(url.pathname.slice(bucket.length + 2))
        if(!storagePath && url.protocol === 'gs:' && url.hostname === bucket) storagePath = decodeURIComponent(url.pathname.slice(1))
      }
    }catch(error){}
  }
  if(storagePath && (!storagePath.startsWith('prep-videos/') || storagePath.split('/').some(function(part){ return !part || part === '.' || part === '..' }) || /[\\\x00-\x1f]/.test(storagePath))) storagePath = ''

  return {
    url: requiresAuth ? '' : rawUrl,
    embedUrl: requiresAuth ? '' : embedUrl,
    storagePath: storagePath,
    requiresAuth: requiresAuth,
    poster: String(
      rawVideo.poster ||
      rawVideo.thumbnail ||
      source && (source.videoPoster || source.videoThumbnail || source.thumbnailUrl) ||
      ''
    ).trim(),
    title: String(
      rawVideo.title ||
      source && (source.videoTitle || source.videoName) ||
      fallbackTitle ||
      ''
    ).trim() || String(fallbackTitle || '').trim(),
    description: String(
      rawVideo.description ||
      source && (source.videoDescription || source.description || source.summary) ||
      ''
    ).trim(),
    provider: provider,
    hasVideo: requiresAuth || !!(embedUrl || rawUrl)
  }
}

function normalizePassageVideoEmbedUrl(rawUrl){
  const text = String(rawUrl || '').trim()
  if(!text) return ''
  if(/\/embed\//i.test(text)) return text

  const parsed = parsePassageVideoUrl(text)
  if(!parsed) return ''

  if(parsed.provider === 'youtube' && parsed.id){
    return 'https://www.youtube.com/embed/' + parsed.id
  }

  if(parsed.provider === 'vimeo' && parsed.id){
    return 'https://player.vimeo.com/video/' + parsed.id
  }

  return ''
}

function parsePassageVideoUrl(rawUrl){
  const text = String(rawUrl || '').trim()
  if(!text) return null

  try{
    const url = new URL(text)
    const host = String(url.hostname || '').toLowerCase()

    if(host.indexOf('youtu.be') >= 0){
      const id = url.pathname.replace(/\//g, '').trim()
      return id ? { provider: 'youtube', id: id } : null
    }

    if(host.indexOf('youtube.com') >= 0){
      const shortsMatch = url.pathname.match(/\/shorts\/([^/?#]+)/i)
      if(shortsMatch && shortsMatch[1]) return { provider: 'youtube', id: shortsMatch[1] }

      const embedMatch = url.pathname.match(/\/embed\/([^/?#]+)/i)
      if(embedMatch && embedMatch[1]) return { provider: 'youtube', id: embedMatch[1] }

      const watchId = url.searchParams.get('v')
      if(watchId) return { provider: 'youtube', id: watchId }
    }

    if(host.indexOf('vimeo.com') >= 0){
      const match = url.pathname.match(/\/(\d+)/)
      if(match && match[1]) return { provider: 'vimeo', id: match[1] }
    }
  }catch(error){
    return null
  }

  return null
}

function inferPassageVideoProvider(rawUrl){
  const text = String(rawUrl || '').trim()
  if(!text) return ''
  const parsed = parsePassageVideoUrl(text)
  if(parsed && parsed.provider) return parsed.provider
  return 'file'
}

function splitLines(text){
  return String(text || '')
    .replace(/\r/g, '')
    .split('\n')
    .map(function(line){ return line.trim() })
    .filter(Boolean)
}

function escapeHtml(text){
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function escapeRegExp(text){
  return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightTextHtml(text, needle){
  const source = String(text || '')
  const target = String(needle || '').trim()
  if(!source) return ''
  if(!target) return escapeHtml(source)

  const pattern = new RegExp(escapeRegExp(target), 'g')
  let lastIndex = 0
  let matched = false
  let output = ''

  source.replace(pattern, function(match, offset){
    matched = true
    output += escapeHtml(source.slice(lastIndex, offset))
    output += '<span class="grammar-highlight">' + escapeHtml(match) + '</span>'
    lastIndex = offset + match.length
    return match
  })

  output += escapeHtml(source.slice(lastIndex))
  return matched ? output : escapeHtml(source)
}

function getGrammarSentence(passage, row){
  const lineIndex = Number(row && row.lineIndex)
  if(Number.isInteger(lineIndex) && lineIndex >= 0 && lineIndex < (passage.textLines || []).length){
    const line = passage.textLines[lineIndex] || ''
    if(line) return line
  }
  return String(row && row.context || '').trim() || String(row && row.text || '').trim()
}

function normalizeNumberList(list, max){
  const result = []
  const seen = new Set()
  ;(Array.isArray(list) ? list : []).forEach(function(value){
    const number = Number(value)
    if(Number.isInteger(number) && number >= 0 && number < max && !seen.has(number)){
      seen.add(number)
      result.push(number)
    }
  })
  return result.sort(function(a, b){ return a - b })
}

function getPassageTitle(passage, index){
  const raw = String(passage && (passage.title || passage.name) || '').trim()
  return raw || ('지문 ' + (index + 1))
}

function mapSelectedLines(passage, textLines){
  if(Array.isArray(passage && passage.selectedLines)){
    return normalizeNumberList(passage.selectedLines, textLines.length)
  }

  const selectedSents = Array.isArray(passage && passage.selectedSents) ? passage.selectedSents : []
  const usedIndexes = new Set()

  return selectedSents.map(function(sentence){
    const target = String(sentence || '').trim()
    if(!target) return -1

    let lineIndex = textLines.findIndex(function(line, idx){
      return !usedIndexes.has(idx) && line.trim() === target
    })

    if(lineIndex < 0){
      lineIndex = textLines.findIndex(function(line, idx){
        return !usedIndexes.has(idx) && line.indexOf(target) >= 0
      })
    }

    if(lineIndex >= 0) usedIndexes.add(lineIndex)
    return lineIndex
  }).filter(function(lineIndex){
    return lineIndex >= 0
  })
}

function buildTranslationText(passage, textLines){
  if(passage && typeof passage.translationText === 'string' && passage.translationText.trim()){
    return passage.translationText.trim()
  }

  const legacyAnswers = passage && passage.translationAnswers && typeof passage.translationAnswers === 'object'
    ? passage.translationAnswers
    : {}

  return textLines.map(function(line){
    return String(legacyAnswers[line] || '').trim()
  }).join('\n').trim()
}

function normalizeGrammarSelections(passage){
  const source = Array.isArray(passage && passage.grammarSelections)
    ? passage.grammarSelections
    : (Array.isArray(passage && passage.grammarRows) ? passage.grammarRows : [])

  return source.map(function(row){
    return {
      text: String(row && (row.text || row.point) || '').trim(),
      answer: String(row && row.answer || '').trim(),
      lineIndex: Number.isInteger(row && row.lineIndex) ? row.lineIndex : -1,
      context: String(row && row.context || '').trim()
    }
  }).filter(function(row){
    return row.text
  })
}

function normalizeVocabRows(passage){
  return (Array.isArray(passage && passage.vocabRows) ? passage.vocabRows : []).map(function(row){
    return {
      word: String(row && (row.word || row.lemma) || '').trim(),
      meaning: String(row && row.meaning || '').trim(),
      syn: String(row && row.syn || '').trim(),
      ant: String(row && row.ant || '').trim(),
      antMeaning: String(row && row.antMeaning || '').trim()
    }
  }).filter(function(row){
    return row.word
  })
}

function normalizeQuestionAnswers(source){
  return {
    topic: String(source && source.topic || '').trim()
  }
}

function buildStudyItems(passage){
  const items = []
  const translationLines = splitLines(passage && passage.translationText)

  ;(passage.selectedLines || []).forEach(function(lineIndex, idx){
    items.push({
      key: 'translate-' + idx,
      section: '문장 해석',
      type: 'translate',
      label: '해석 ' + (idx + 1),
      prompt: passage.textLines[lineIndex] || '',
      answer: translationLines[lineIndex] || '',
      context: ''
    })
  })

  ;(passage.grammarSelections || []).forEach(function(row, idx){
    const sentence = getGrammarSentence(passage, row)
    items.push({
      key: 'grammar-' + idx,
      section: '어법',
      type: 'grammar',
      label: '어법 포인트 ' + (idx + 1),
      prompt: '',
      promptHtml: highlightTextHtml(sentence, row.text),
      answer: row.answer,
      context: ''
    })
  })

  ;(passage.vocabRows || []).forEach(function(row, idx){
    items.push({
      key: 'vocab-' + idx,
      section: '동의어 / 반의어',
      type: 'vocab',
      label: '단어 ' + (idx + 1),
      prompt: row.word,
      answer: '',
      context: '원형을 보고 뜻, 동의어, 반의어, 반의어 뜻을 모두 말해 보세요.',
      vocab: row
    })
  })

  appendQaItem(items, 'topic', passage.questionAnswers)

  return items
}

function appendQaItem(items, field, questionAnswers){
  const answer = String(questionAnswers && questionAnswers[field] || '').trim()
  if(!answer) return

  const metaMap = {
    topic: {
      section: '대의 파악',
      label: '주제',
      prompt: ''
    }
  }

  const meta = metaMap[field]
  if(!meta) return

  items.push({
    key: 'qa-' + field,
    section: meta.section,
    type: 'qa',
    label: meta.label,
    prompt: meta.prompt,
    answer: answer,
    context: ''
  })
}
