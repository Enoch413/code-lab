import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

assert.equal(process.argv.length, 2)
const toolRoot = fileURLToPath(new URL('./firebase-cli/', import.meta.url))
const manifest = JSON.parse(readFileSync(join(toolRoot,'package.json'),'utf8'))
const lock = JSON.parse(readFileSync(join(toolRoot,'package-lock.json'),'utf8'))
assert.equal(manifest.dependencies['firebase-tools'], '15.34.0')
assert.deepEqual(manifest.overrides, {chokidar:'4.0.3',uuid:'11.1.1','@google-cloud/pubsub':'6.3.0'})
for (const [name, data] of Object.entries(lock.packages)) {
  assert.ok(!name.endsWith('/braces'), 'The vulnerable braces path must remain absent')
  if (name.endsWith('/uuid')) assert.equal(data.version, '11.1.1')
  if (name.endsWith('/@opentelemetry/core')) assert.ok(Number(data.version.split('.')[0]) >= 2)
}
const require = createRequire(join(toolRoot,'package.json'))
assert.equal(require('firebase-tools/package.json').version, '15.34.0')
const uuid = require('uuid')
assert.ok(uuid.validate(uuid.v4()))
assert.throws(()=>uuid.v5('synthetic',uuid.v5.DNS,new Uint8Array(1)),RangeError)
assert.equal(typeof require('@google-cloud/pubsub').PubSub.prototype.topic, 'function')
const npm = process.platform === 'win32'
  ? spawnSync('cmd.exe',['/d','/c','npm.cmd ls --all --json'],{cwd:toolRoot,encoding:'utf8'})
  : spawnSync('npm',['ls','--all','--json'],{cwd:toolRoot,encoding:'utf8'})
assert.equal(npm.status, 0, 'The isolated dependency tree must contain no npm invalid entries')
assert.equal(JSON.parse(npm.stdout).problems, undefined)
for (const script of ['test-rules-local.mjs','test-auth-integration-local.mjs']) {
  const refused = spawnSync(process.execPath,[fileURLToPath(new URL(script,import.meta.url)),'--project','forbidden'],{encoding:'utf8'})
  assert.notEqual(refused.status, 0)
  assert.ok(refused.stderr.includes('No arguments accepted'))
}
const dir = await mkdtemp(join(tmpdir(),'codelab-cli-watch-'))
assert.ok(resolve(dir).startsWith(resolve(tmpdir())))
const file = join(dir,'synthetic.rules')
let watcher
try {
  await writeFile(file,'before')
  watcher = require('chokidar').watch(file,{ignoreInitial:true})
  async function event(name) {
    let timer
    try { await Promise.race([new Promise((done,fail)=>{watcher.once(name,done);watcher.once('error',fail)}),new Promise((_,fail)=>{timer=setTimeout(()=>fail(Error('Watcher deadline: '+name)),5000)})]) }
    finally { clearTimeout(timer) }
  }
  await event('ready')
  const changed=event('change')
  await writeFile(file,'after')
  await changed
} finally {
  if(watcher)await watcher.close()
  await unlink(file)
  await rmdir(dir)
}
console.log(JSON.stringify({localToolingPassed:true,cli:'15.34.0',npmInvalid:0,uuidBoundsChecked:true,rulesWatcherChecked:true,productionAccess:false}))
