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
const pages = require('yaml').parse(readFileSync(new URL('../.github/workflows/pages-emergency.yml',import.meta.url),'utf8'))
function assertPagesWorkflow(workflow) {
  assert.deepEqual(workflow.on,{workflow_dispatch:null},'Pages release must remain manual-only')
  assert.deepEqual(workflow.permissions,{contents:'read'})
  assert.deepEqual(Object.keys(workflow.jobs).sort(),['build','deploy'])
  const {build,deploy}=workflow.jobs
  assert.equal(build.if,"github.ref == 'refs/heads/main'")
  assert.equal(build['runs-on'],'ubuntu-latest')
  assert.equal(build['timeout-minutes'],10)
  assert.equal(build.permissions,undefined,'Build must inherit read-only permissions')
  assert.equal(build.steps.length,5)
  assert.deepEqual(build.steps[0],{uses:'actions/checkout@v4',with:{'fetch-depth':0,'persist-credentials':false}})
  assert.deepEqual(build.steps[1],{uses:'actions/setup-node@v4',with:{'node-version':'24'}})
  assert.deepEqual(build.steps[2],{run:'node tools/test-public-release.mjs'})
  assert.equal(build.steps[3].id,'build')
  assert.equal(build.steps[3].run.trim(), 'node tools/build-public.mjs > release-build.json\n'+String.raw`node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync('release-build.json','utf8'));fs.appendFileSync(process.env.GITHUB_OUTPUT,'site='+r.site+'\n')"`)
  assert.deepEqual(build.steps[4],{uses:'actions/upload-pages-artifact@v3',with:{path:'${{ steps.build.outputs.site }}'}})
  assert.equal(deploy.needs,'build')
  assert.equal(deploy['runs-on'],'ubuntu-latest')
  assert.equal(deploy['timeout-minutes'],15)
  assert.deepEqual(deploy.permissions,{pages:'write','id-token':'write'})
  assert.deepEqual(deploy.environment,{name:'github-pages',url:'${{ steps.deployment.outputs.page_url }}'})
  assert.deepEqual(deploy.steps,[{id:'deployment',uses:'actions/deploy-pages@v4'}])
}
assertPagesWorkflow(pages)
const unsafePagesChanges = [
  w=>{w.on.push={branches:['main']}},
  w=>{w.jobs.build.if="github.ref != ''"},
  w=>{w.permissions.contents='write'},
  w=>{w.jobs.build.permissions={contents:'write'}},
  w=>{w.jobs.build.steps[0].with['persist-credentials']=true},
  w=>{w.jobs.build.steps[0].with['fetch-depth']=1},
  w=>{w.jobs.build.steps[4].with.path='.'},
  w=>{w.jobs.build.steps[4].with.path='.local'},
  w=>{w.jobs.build.steps[3].run=w.jobs.build.steps[3].run.replace('r.site',"r.site+'/..'")},
  w=>{w.jobs.build.steps[3].run+='firebase deploy\n'},
  w=>{w.jobs.deploy.environment.name='unprotected'},
  w=>{delete w.jobs.deploy.needs},
  w=>{w.jobs.deploy.steps.push({run:'firebase deploy'})}
]
for (const change of unsafePagesChanges) {
  const altered=structuredClone(pages)
  change(altered)
  assert.throws(()=>assertPagesWorkflow(altered))
}
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
console.log(JSON.stringify({localToolingPassed:true,cli:'15.34.0',npmInvalid:0,uuidBoundsChecked:true,rulesWatcherChecked:true,pagesWorkflowChecks:1+unsafePagesChanges.length,productionAccess:false}))
