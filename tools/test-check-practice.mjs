import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8')
const definitions=text=>new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]))
const portal=definitions(read('rotation_portal.js')),enh=definitions(read('rotation_portal_enhancements.js')),core=definitions(read('rotation_prep_core.js'))
const load=(ctx,names)=>names.forEach(name=>{const source=enh.get(name)||portal.get(name)||core.get(name);assert.ok(source,name);vm.runInContext(source,ctx)})
const questions=[1,2,3,4].map(number=>({id:'q'+number,number,type:number<3?'객관식':'주관식',answer:number===1?'1':'2',prompt:'Synthetic '+number,problemType:'synthetic'}))
const set={id:'set',title:'Synthetic set',classIds:['a'],questions}
let drafts={q1:'1',q2:'1',q3:'맞음',q4:'틀림'},editing=new Set()
const student={id:'alice',label:'Synthetic student',studentId:'synthetic',classIds:['a']}
const state={adminCheckSetFilter:'all'}
const ctx=vm.createContext({portalState:state,Date,Map,Set,
  document:{createElement:()=>({set textContent(value){this.innerHTML=String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')}})},
  getCurrentCheckDraftAnswer:id=>drafts[id]||'',isCheckAnswerEditing:id=>editing.has(id),
  getAdminAnalysisTargetSets:()=>[set],buildAdminAnalysisStudents:()=>[student],
  getAdminCheckSetKey:s=>s.id,getAdminResponseSetKey:r=>r.checkSetId,getAdminResponseStudentKey:r=>r.userId,
  getAdminResponseStudentLabel:r=>r.name||'Synthetic student',hasAnyAdminClass:(a,b)=>a.some(id=>b.includes(id)),
  formatAdminTime:()=> 'synthetic time'
})
vm.runInContext(read('rotation_portal.js').match(/const CHOICE_TOKEN_MAP = \{[^]*?^}/m)[0],ctx)
load(ctx,['normalizeCheckQuestionType','normalizeCheckQuestionNumber','normalizeCheckProblemType','getChoiceAnswerValues','normalizeChoiceAnswer','isAnswerAccepted',
  'getSubmittedCheckAnswerMap','getCheckAnswerEditCount','canCheckAnswerBeEdited','collectCheckBatchAnswers','sortCheckSubmissionAnswers','buildCheckSubmissionSummary',
  'mergeCheckSubmission','mapResponseToSubmission','resolveSubmittedQuestionNumber','buildRankItems','buildAdminQuestionItem','getAdminQuestionKey','buildAdminAnalysisQuestions',
  'buildAdminLatestResponseMap','findAdminSubmittedAnswer','isCheckWrongNoteCompleted','isAdminStudentExpectedForQuestion','getAdminAnswerStatus','getAdminQuestionDisplayLabel',
  'buildAdminCheckAnalytics','extractWrongAnswers','buildStudentSetWrongItems','escapeHtml','buildAdminExcelCell','buildAdminExcelHeader','buildAdminAnalyticsExcelHtml'])
const answers=ctx.collectCheckBatchAnswers(set,null)
assert.deepEqual(Array.from(answers,a=>a.isCorrect),[true,false,true,false],'Objective and self-marked subjective answers keep their existing grading semantics')
const first=ctx.mergeCheckSubmission(null,answers)
assert.equal(first.summary.correct,2);assert.equal(first.summary.wrong,2)
const response=submission=>({...submission,userId:'alice',name:'Synthetic student',checkSetId:'set',checkSetTitle:set.title,classIds:['a']})
let stats=ctx.buildAdminCheckAnalytics([response(first)],[student],[response(first)])
assert.equal(stats.studentRows[0].wrongCount,2)
assert.deepEqual(Array.from(stats.studentRows[0].wrongLabels),['2번','4번'].map(n=>set.title+' · '+n))
assert.equal(ctx.buildStudentSetWrongItems([response(first)],'alice')[0].wrongNumberText,'2, 4')
// An answer correction changes the next wrong-question input without losing the other wrong question.
drafts={q2:'2'};editing=new Set(['q2'])
const edits=ctx.collectCheckBatchAnswers(set,first),second=ctx.mergeCheckSubmission(first,edits)
first.submittedAt='2026-10-20T00:00:00.000Z';second.submittedAt='2026-10-20T00:00:01.000Z'
assert.equal(edits.length,1);assert.equal(second.summary.correct,3)
assert.equal(ctx.buildStudentSetWrongItems([response(first),response(second)],'alice')[0].wrongNumberText,'4')
const unknown={...response(second),answers:[{questionId:'q1',number:1,userAnswer:'1'}]}
stats=ctx.buildAdminCheckAnalytics([unknown],[student],[unknown])
assert.equal(stats.questionRanks.find(q=>q.number===1).correctCount,0,'Ungraded answers must not become correct in question statistics')
assert.equal(stats.studentRows[0].correctCount,0)
assert.equal(ctx.extractWrongAnswers([unknown]).length,0,'Ungraded answers must not enter wrong-question generation')
assert.equal(ctx.buildStudentSetWrongItems([unknown],'alice').length,0)
const corrupted={...response(second),summary:{total:999,correct:999,wrong:0},latestBatch:{...second.latestBatch,summary:{total:999,correct:999,wrong:0}}}
const mapped=ctx.mapResponseToSubmission(corrupted)
assert.equal(mapped.summary.total,4);assert.equal(mapped.summary.wrong,1,'Displayed totals are derived from answers, not inconsistent stored summaries')
assert.equal(mapped.latestBatch.summary.total,1)
const html=read('index.html')
assert.match(html,/id="check-practice-notice"[^>]*>[^<]*2차 오답[^<]*공식 성적/)
assert.match(html,/id="admin-check-practice-notice"[^>]*>[^<]*공식 성적/)
const exported=ctx.buildAdminAnalyticsExcelHtml(ctx.buildAdminCheckAnalytics([response(second)],[student],[response(second)]))
assert.match(exported,/2차 오답[^<]*공식 성적/,'The exported report must carry the same purpose notice')
console.log('CHECK practice: grading, corrected wrong-question input, unknown grading, derived summaries and purpose labels: OK')
