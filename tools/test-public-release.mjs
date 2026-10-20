import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { collectPublicFiles, validatePublicFiles, release } from './build-public.mjs'
import { assertPublicCsv } from './public-csv-policy.mjs'

assert.equal(process.argv.length,2,'No arguments accepted')
const root = fileURLToPath(new URL('../',import.meta.url))
const files = collectPublicFiles()
assert.equal(release.sourceCommit,'ac4689d8bf8fa1d30b574c2e323bdccc085fca1c')
assert.equal(release.rulesBaseline,'0631677a7315f6b2b56549f3bc4d84eb535ae322')
assert.equal(files.size,21)
const emptyStaticText = name => JSON.stringify(JSON.parse(files.get(name)),null,2)+'\n'
for (const name of ['session.json','check_data.json']) assert.ok(readFileSync(new URL('../'+name,import.meta.url),'utf8').replace(/\r\n/g,'\n')===emptyStaticText(name),'Tracked static data must also remain empty; contents withheld')
const historyGit = (...args) => {
  try {
    return execFileSync('git',['-C',root,...args],{encoding:'utf8',stdio:['ignore','pipe','pipe']})
  } catch {
    throw new Error('Public history verification failed; contents withheld')
  }
}
historyGit('merge-base','--is-ancestor',release.rulesBaseline,'HEAD')
historyGit('merge-base','--is-ancestor',release.sourceCommit,'HEAD')
const historicalCommits=historyGit('rev-list',release.rulesBaseline+'..HEAD').trim().split('\n').filter(Boolean)
assert.ok(historicalCommits.includes(release.sourceCommit),'Fixed P0 source must belong to the reviewed outgoing history; contents withheld')
let historicalStaticChecks=0
for (const commit of historicalCommits) {
  assert.match(commit,/^[a-f0-9]{40}$/)
  for (const name of ['session.json','check_data.json']) {
    let historicalData
    try {
      historicalData=historyGit('show',commit+':'+name)
    } catch {
      throw new Error('Historical static data unreadable; contents withheld')
    }
    assert.ok(historicalData===emptyStaticText(name),'Legacy static data must be empty throughout outgoing history; contents withheld')
    historicalStaticChecks++
  }
}

let checks=1
for (const name of ['tools/students_import.csv','backups/original.zip','.env.local','.git/config','RESTORE_README.txt','CODEX_HANDOFF_2026-07-21.md','firestore.rules','storage.rules','firebase.local.json','README.md','../private.txt']) {
  const altered = new Map(files)
  altered.set(name,Buffer.from('synthetic-private-content'))
  assert.throws(()=>validatePublicFiles(altered),/Unexpected or missing public file/)
  checks++
}
for (const secret of ['initialPassword: "synthetic-secret"','globalPassword = "synthetic-secret"','client_secret: "synthetic-secret"','-----BEGIN PRIVATE KEY-----','github_pat_'+'x'.repeat(45)]) {
  const altered = new Map(files)
  altered.set('rotation_portal.js',Buffer.from(secret))
  assert.throws(()=>validatePublicFiles(altered),/contents withheld/)
  checks++
}
for (const [name,content] of [['session.json','{"classes":[{"password":"synthetic-secret"}]}'],['check_data.json','{"classes":[{"id":"synthetic-class"}]}']]) {
  const altered = new Map(files)
  altered.set(name,Buffer.from(content))
  assert.throws(()=>validatePublicFiles(altered),/contents withheld/)
  checks++
}
for (const [name,content] of [['index.html','<script src="missing.js"></script>'],['rotation_prep.css','body{background:url("missing.png")}']]) {
  const altered = new Map(files)
  altered.set(name,Buffer.from(content))
  assert.throws(()=>validatePublicFiles(altered),/Missing local release dependency/)
  checks++
}
const refused=spawnSync(process.execPath,['tools/build-public.mjs','--project','forbidden'],{cwd:root,encoding:'utf8'})
assert.notEqual(refused.status,0)
assert.ok(refused.stderr.includes('No arguments accepted'))
checks++
const tracked=execFileSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'}).split('\0').filter(Boolean)
const templatePath='tools/firebase_bulk_users_template.csv'
const template=readFileSync(new URL('./firebase_bulk_users_template.csv',import.meta.url),'utf8')
const ordinaryPaths=['index.html',templatePath]
let csvChecks=0
for (const allowedTemplate of [template,'\uFEFF'+template.trim()+'\r\n']) {
  assertPublicCsv(ordinaryPaths,allowedTemplate)
  csvChecks++
}
for (const name of ['tools/student_roster_export.csv','students.csv','assets/nested/roster.csv','nested/STUDENTS.CSV','tools/FIREBASE_BULK_USERS_TEMPLATE.CSV','other/firebase_bulk_users_template.csv','tools/roster.CsV']) {
  assert.throws(()=>assertPublicCsv([...ordinaryPaths,name],template),/Tracked CSV is not allowed/)
  csvChecks++
}
for (const paths of [[],['index.html']]) {
  assert.throws(()=>assertPublicCsv(paths,template),/Required CSV template missing/)
  csvChecks++
}
const row='"synthetic-id","SYNTHETIC-CSV-MARKER"'
for (const invalidTemplate of ['',row,template.trim()+'\n'+row,'"loginId","name"',template.trim()+',"unexpected"']) {
  assert.throws(()=>assertPublicCsv(ordinaryPaths,invalidTemplate),error=>{
    assert.match(error.message,/expected CSV header; contents withheld/)
    assert.ok(!error.message.includes('SYNTHETIC-CSV-MARKER'))
    return true
  })
  csvChecks++
}
assertPublicCsv(tracked,template)
csvChecks++
assert.ok(tracked.every(name=>!/(^|\/)(?:backups|private|secrets|\.local|node_modules)\/|\.(?:zip|7z|rar|bak)$|(^|\/)\.env(?:\.|$)|(^|\/)(?:students_import\.csv|BACKUP_MANIFEST\.json|RESTORE[^/]*|CODEX_HANDOFF[^/]*|[^/]*service[_-]account[^/]*\.json)$/i.test(name)),'Private tracked path; contents withheld')
console.log(JSON.stringify({historicalStaticChecks,publicReleaseChecks:checks+csvChecks,trackedCsvChecks:csvChecks,publicFiles:files.size,unexpectedPrivateFiles:0,rulesUnchanged:true,productionAccess:false}))
