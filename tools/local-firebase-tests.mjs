import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'node:fs'

export function runLocalFirebaseTests(suite) {
  assert.equal(process.argv.length, 2, 'No arguments accepted')
  const plans = { rules: ['firestore,storage', 'tools/test-rules-suites.mjs'], auth: ['firestore,auth', 'tools/test-auth-sdk-integration.cjs'], crossApp: ['firestore,auth,storage', 'tools/test-cross-app-browser.cjs'], prepWatch:['firestore,auth,functions','tools/test-prep-watch-integration.cjs'] }
  assert.ok(Object.hasOwn(plans, suite))
  const root = fileURLToPath(new URL('../', import.meta.url))
  const config = JSON.parse(readFileSync(new URL('../firebase.local.json', import.meta.url), 'utf8'))
  for (const [service, port] of [['firestore',8786],['storage',9298],['auth',9098]]) {
    assert.equal(config.emulators[service].host, '127.0.0.1')
    assert.equal(config.emulators[service].port, port)
  }
  assert.equal(config.firestore.rules, 'firestore.rules')
  assert.equal(config.storage.rules, 'storage.rules')
  assert.equal(config.hosting, undefined)
  const java = spawnSync('java', ['-version'], { encoding:'utf8' })
  const version = (java.stderr + java.stdout).match(/version "(\d+)/)
  assert.ok(java.status === 0 && version && Number(version[1]) >= 21, 'Java 21+ required on PATH')
  const cli = fileURLToPath(new URL('./firebase-cli/node_modules/firebase-tools/lib/bin/firebase.js', import.meta.url))
  assert.ok(existsSync(cli), 'Run npm ci --prefix tools/firebase-cli --ignore-scripts first')
  const env = {...process.env, JAVA_TOOL_OPTIONS:(process.env.JAVA_TOOL_OPTIONS || '')+' -Duser.language=en -Duser.country=US', FIREBASE_CLI_DISABLE_UPDATE_CHECK:'true'}
  const pinned = spawnSync(process.execPath, [cli,'--version'], {cwd:root,env,encoding:'utf8'})
  assert.equal(pinned.status, 0)
  assert.equal(pinned.stdout.trim(), '15.34.0')
  const [only, script] = plans[suite]
  const secret = new URL('../functions/.secret.local', import.meta.url)
  if(suite === 'prepWatch'){
    assert.equal(config.emulators.functions.host,'127.0.0.1')
    assert.equal(config.emulators.functions.port,5001)
    assert.deepEqual(config.functions,[{source:'functions',codebase:'prep-watch'}])
    assert.ok(!existsSync(secret),'Refuse to overwrite an existing functions local secret file')
    assert.ok(existsSync(new URL('../functions/node_modules/firebase-functions/package.json',import.meta.url)),'Run npm ci --prefix functions --ignore-scripts')
    writeFileSync(secret,'YOUTUBE_DATA_API_KEY=emulator-only-not-a-key\n',{flag:'wx'})
  }
  let result
  try { result = spawnSync(process.execPath, [cli,'emulators:exec','--config','firebase.local.json','--project','demo-codelab-reaudit','--only',only,`node ${script}`], {cwd:root,env,stdio:'inherit'}) }
  finally { if(suite === 'prepWatch') unlinkSync(secret) }
  if (result.error) throw result.error
  process.exit(result.status === null ? 1 : result.status)
}
