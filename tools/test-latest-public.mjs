import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'
import {collectLatestPublicFiles,validateLatestPublicFiles,release} from './build-latest-public.mjs'
assert.equal(process.argv.length,2,'No arguments accepted')
assert.equal(release.sourceCommit,'373bbf4c0b9565063ab45ab5c3226b0212527481')
assert.deepEqual(release.rulesSha256,{'firestore.rules':'cb02265dde97ef5ae3003e39961ff9b72cbc488aeea9b72ce32219815a735c82','storage.rules':'2c04962091010dc00e00193af630a26e6a2a9c2bfebc68670352c93f535e2c48'})
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
