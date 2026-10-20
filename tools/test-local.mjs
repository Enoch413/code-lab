import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const checks = [
  ['--check', 'rotation_portal.js'],
  ['--check', 'rotation_portal_enhancements.js'],
  ['--check', 'rotation_prep_core.js'],
  ['--check', 'rotation_prep_ui.js'],
  ...['check-entry-loading','grammar-only-class','security-boundaries','student-creation-recovery','accessibility','p1-regressions','session-recovery','grammar-recovery','check-practice','critical-definitions','single-set-read','prep-entry'].map(name=>['tools/test-' + name + '.mjs'])
]
for(const args of checks){
  const result=spawnSync(process.execPath,args,{cwd:root,stdio:'inherit'})
  if(result.error)throw result.error
  if(result.status!==0)process.exit(result.status || 1)
}
console.log('Local syntax and regression checks passed; no Firebase connection used.')
