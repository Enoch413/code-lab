import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import {collectLatestPublicFiles,validateLatestPublicFiles,release} from './build-latest-public.mjs'
assert.equal(process.argv.length,2,'No arguments accepted')
assert.equal(release.sourceCommit,'5b12f02d23674b1231a1ebac27ec018c4303388f')
assert.deepEqual(release.rulesSha256,{'firestore.rules':'70e28878a4612215222ab506a759ff67f772e298346c422da591b72d708a8ad4','storage.rules':'51d0fc31f1652438660db9b660d1e64f1030ce9fe97ece836a8376437766ff1a'})
const files=collectLatestPublicFiles()
assert.equal(files.size,21)
let checks=1
for(const [name,value] of [['backups/original.zip','private'],['index.html','changed'],['session.json','{"studySets":[{}]}']]){
  const altered=new Map(files);altered.set(name,Buffer.from(value));assert.throws(()=>validateLatestPublicFiles(altered));checks++
}
const missing=new Map(files);missing.delete('rotation_portal.js');assert.throws(()=>validateLatestPublicFiles(missing));checks++
const refused=spawnSync(process.execPath,['tools/build-latest-public.mjs','--source','unreviewed'],{cwd:fileURLToPath(new URL('../',import.meta.url)),encoding:'utf8'})
assert.notEqual(refused.status,0);assert.ok(refused.stderr.includes('No arguments accepted'));checks++
console.log(JSON.stringify({latestReleaseChecks:checks,publicFiles:files.size,sourceCommit:release.sourceCommit,productionAccess:false}))
