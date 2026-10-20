import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

// No project/command arguments are accepted: this runner can only start the loopback demo suite.
assert.equal(process.argv.length,2,'No arguments accepted')
const root=fileURLToPath(new URL('../',import.meta.url))
const config=JSON.parse(readFileSync(new URL('../firebase.local.json',import.meta.url),'utf8'))
assert.equal(config.emulators.firestore.host,'127.0.0.1')
assert.equal(config.emulators.firestore.port,8786)
assert.equal(config.firestore.rules,'firestore.rules')
assert.equal(config.hosting,undefined)
const java=spawnSync('java',['-version'],{encoding:'utf8'})
assert.equal(java.status,0,'Java 21+ must be on PATH; set JAVA_HOME for this terminal only')
const version=(java.stderr + java.stdout).match(/version "(\d+)/)
assert.ok(version && Number(version[1])>=21,'Java 21+ required')
// Avoid user-locale-dependent emulator permission errors on Windows.
const env={...process.env,JAVA_TOOL_OPTIONS:(process.env.JAVA_TOOL_OPTIONS || '')+' -Duser.language=en -Duser.country=US',FIREBASE_CLI_DISABLE_UPDATE_CHECK:'true'}
const windows=process.platform==='win32'
const command=windows?'firebase.cmd':'firebase'
const pinned=spawnSync(command,['--version'],{cwd:root,env,encoding:'utf8',shell:windows})
assert.equal(pinned.status,0,'Install the documented pinned Firebase CLI first')
assert.equal(pinned.stdout.trim(),'15.34.0','Use Firebase CLI 15.34.0 for this suite')
const result=spawnSync(command,['emulators:exec','--config','firebase.local.json','--project','demo-codelab-reaudit','--only','firestore',windows ? '"node tools/test-firestore-scope.mjs"' : 'node tools/test-firestore-scope.mjs'],{cwd:root,env,stdio:'inherit',shell:windows})
if(result.error)throw result.error
process.exit(result.status === null ? 1 : result.status)
