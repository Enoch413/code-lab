import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

assert.equal(process.argv.length, 2, 'This test is offline only. Use node tools/test-rules-local.mjs for emulator rule checks.')

const portal = readFileSync(new URL('../rotation_portal.js', import.meta.url), 'utf8')
const source = readFileSync(new URL('../rotation_portal_enhancements.js', import.meta.url), 'utf8')
const prep = readFileSync(new URL('../rotation_prep_core.js', import.meta.url), 'utf8')
const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8')
const classId = portal.match(/const PORTAL_GRAMMAR_ONLY_CLASS_ID = '([^']+)'/)[1]
assert.ok(rules.includes("hasAny(['" + classId + "'])"))
assert.ok(portal.includes("name: '초중등'"))

function definition(text, name){
  const offsets = [...text.matchAll(new RegExp('^(?:async )?function ' + name + '\\(', 'gm'))]
  assert.ok(offsets.length, name)
  const start = offsets.at(-1).index
  const next = text.slice(start + 1).search(/\n(?:async )?function |\n(?:const|let) /)
  return text.slice(start, next < 0 ? text.length : start + 1 + next)
}

const nodeIds = ['portal-screen', 'passage-screen', 'check-screen', 'grammar-screen',
  ...['portal-', 'drawer-'].flatMap(prefix => ['prep', 'check', 'counsel', 'study-cafe', 'grammar-lab'].map(module => prefix + module + '-btn'))]
const nodes = Object.fromEntries(nodeIds.map(id => [id, {
  hidden: false, disabled: false, active: false, attributes: {},
  setAttribute(key, value){ this.attributes[key] = value },
  classList: {
    toggle(key, value){ nodes[id][key] = value },
    add(key){ nodes[id][key] = true }, remove(key){ nodes[id][key] = false }
  }
}]))
let redirects = 0, prepRestores = 0, grammarOpened = 0
const state = { currentUser: { uid: 'test-student' }, currentProfile: { role: 'student', classIds: [classId], grammarAccessMode: 'none' } }
const context = vm.createContext({
  portalState: state, PORTAL_GRAMMAR_ONLY_CLASS_ID: classId, PORTAL_STUDY_CAFE_DISABLED: true,
  PORTAL_CLOUD_DOCS: { prep: 'prep-session', check: 'check-data' },
  PREP_SCREEN_IDS: ['class-screen', 'passage-screen', 'study-screen'], SCREEN_IDS: nodeIds,
  isPortalAdmin: () => state.currentProfile?.role === 'admin',
  getProfileClassIds: () => state.currentProfile?.classIds || [],
  canAccessGrammarPortal: () => state.currentProfile?.grammarAccessMode === 'all',
  showToast(){}, showPortalScreen(){ redirects++; nodes['portal-screen'].active = true },
  openGrammarPortal(){ grammarOpened++ },
  stopPrepVideoPlaybackBeforeScreenChange(){}, resetViewportPosition(){}, closeAppDrawer(){},
  window: { restorePrepNavigationState(){ prepRestores++ } },
  document: { getElementById: id => nodes[id], querySelectorAll: () => Object.values(nodes) }
})
vm.runInContext([
  ...['syncGrammarAccessVisibility', 'isGrammarOnlyStudent', 'canAccessPortalScreen', 'ensurePortalScreenAccess',
    'syncRegularPortalAccessVisibility', 'restoreAppRoute', 'activatePortalScreen', 'openPrepPortal',
    'openCheckPortal', 'openCheckSetPortal', 'openCounselFormPortal', 'openCounselHistoryTab',
    'loadCloudContentDoc', 'loadCloudSetDocs', 'syncPrepContentAfterLogin', 'ensureCheckData'].map(name => definition(source, name)),
  definition(portal, 'openCounselPortal'), definition(prep, 'activateScreen')
].join('\n'), context)

assert.equal(context.isGrammarOnlyStudent(), true)
for(const screen of ['portal-screen', 'grammar-screen', 'grammar-player-screen', 'account-screen', 'password-screen']){
  assert.equal(context.canAccessPortalScreen(screen), true, screen)
}
for(const screen of ['class-screen', 'passage-screen', 'study-screen', 'check-screen', 'check-set-screen', 'counsel-screen', 'admin-screen', 'study-cafe-screen']){
  assert.equal(context.canAccessPortalScreen(screen), false, screen)
  context.restoreAppRoute({ screenId: screen })
}
assert.equal(prepRestores, 0, 'History cannot restore a restricted PREP page')
context.restoreAppRoute({ screenId: 'grammar-screen' })
assert.equal(grammarOpened, 1)
context.activatePortalScreen('check-screen')
context.activateScreen('passage-screen')
assert.equal(nodes['check-screen'].active, false)
assert.equal(nodes['passage-screen'].active, false)
context.syncRegularPortalAccessVisibility()
assert.ok(['prep', 'check', 'counsel', 'study-cafe'].every(module => nodes['portal-' + module + '-btn'].hidden && nodes['drawer-' + module + '-btn'].hidden))
context.syncGrammarAccessVisibility()
assert.equal(nodes['portal-grammar-lab-btn'].hidden, false)
assert.equal(nodes['portal-grammar-lab-btn'].attributes['aria-hidden'], 'false')
assert.equal(nodes['portal-grammar-lab-btn'].disabled, true, 'Class membership does not grant every video')
state.currentProfile.grammarAccessMode = 'all'
context.syncGrammarAccessVisibility()
assert.equal(nodes['portal-grammar-lab-btn'].disabled, false)
for(const name of ['openPrepPortal', 'openCheckPortal', 'openCheckSetPortal', 'openCounselPortal', 'openCounselFormPortal', 'openCounselHistoryTab']){
  const before = redirects
  await context[name]()
  assert.equal(redirects, before + 1, name + ' must stop before reading data')
}
assert.equal(await context.syncPrepContentAfterLogin(false), false)
for(const read of [() => context.loadCloudContentDoc('prep-session'), () => context.loadCloudSetDocs('check'), () => context.ensureCheckData(false)]){
  await assert.rejects(read, /only use GRAMMAR/)
}
state.currentProfile.classIds.push('class-2-gangseo-a')
assert.equal(context.isGrammarOnlyStudent(), true, 'A second class cannot bypass the restriction')
state.currentProfile = { role: 'student', classIds: ['class-2-gangseo-a'] }
assert.equal(context.canAccessPortalScreen('check-screen'), true)
context.syncRegularPortalAccessVisibility()
assert.equal(nodes['portal-check-btn'].hidden, false)
assert.equal(nodes['drawer-prep-btn'].disabled, false)
assert.equal(nodes['portal-study-cafe-btn'].disabled, true, 'The existing study-cafe switch is preserved')
state.currentProfile = { role: 'admin', classIds: [classId] }
assert.equal(context.canAccessPortalScreen('admin-screen'), true)
state.currentUser = null
assert.equal(context.isGrammarOnlyStudent(), false)
console.log('GRAMMAR-only class navigation and data guards: OK')
