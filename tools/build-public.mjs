import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
export const release = JSON.parse(readFileSync(new URL('./public-release.json', import.meta.url), 'utf8'))
const generated = {
  'session.json': JSON.stringify({version:2,bundleVersion:2,prepConfig:{pageTitle:'CODE LAB PREP',globalPassword:''},classes:[],studySets:[]})+'\n',
  'check_data.json': JSON.stringify({classes:[],checkSets:[]})+'\n',
  '.nojekyll': ''
}
const allowed = [...release.files, ...Object.keys(generated)]
const git = (...args) => {
  try { return execFileSync('git',['-C',root,...args],{stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024}) }
  catch { throw new Error('Git release source unavailable; contents withheld') }
}

export function validatePublicFiles(files) {
  assert.deepEqual([...files.keys()].sort(), [...allowed].sort(), 'Unexpected or missing public file')
  for (const [name, data] of files) {
    assert.ok(!name.includes('/') && !name.includes('\\') && !name.includes('..'), 'Unsafe release path')
    const content = data.toString('utf8')
    assert.ok(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|ya29\.[A-Za-z0-9_-]{20,}/.test(content), 'Secret marker in public file; contents withheld')
    assert.ok(!/\b(?:initialPassword|globalPassword|private_key|client_secret)["']?\s*[:=]\s*["'][^"'\r\n]+["']/i.test(content), 'Nonempty credential literal in public file; contents withheld')
  }
  for (const name of Object.keys(generated)) assert.ok(files.get(name).toString() === generated[name], 'Legacy public data must be empty; contents withheld')
  const checkReference = value => {
    if (!value || /^(?:[a-z]+:|\/\/|#)/i.test(value)) return
    const url = new URL(value,'https://release.invalid/code-lab/')
    assert.ok(url.pathname.startsWith('/code-lab/'), 'Reference escapes site base')
    assert.ok(files.has(decodeURIComponent(url.pathname.slice('/code-lab/'.length))), 'Missing local release dependency')
  }
  for (const [name, data] of files) {
    if (name.endsWith('.html')) for (const ref of data.toString().matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) checkReference(ref[1])
    if (name.endsWith('.css')) for (const ref of data.toString().matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^"'\s)]*))\s*\)/gi)) checkReference(ref[1] ?? ref[2] ?? ref[3])
  }
  const manifest = JSON.parse(files.get('manifest.webmanifest'))
  checkReference(manifest.start_url)
  for (const icon of manifest.icons) checkReference(icon.src)
}

export function collectPublicFiles() {
  assert.match(release.sourceCommit,/^[a-f0-9]{40}$/)
  assert.match(release.rulesBaseline,/^[a-f0-9]{40}$/)
  assert.equal(git('diff',release.rulesBaseline,release.sourceCommit,'--','firestore.rules').length,0,'Emergency release must preserve the deployed rules contract')
  assert.equal(new Set(release.files).size,release.files.length)
  const files = new Map(release.files.map(name => {
    assert.match(name,/^[A-Za-z0-9_-]+\.(?:html|css|js|webmanifest|png|ico|svg)$/)
    assert.ok(git('ls-tree',release.sourceCommit,'--',name).toString().startsWith('100644 blob '),'Only regular Git blobs are publishable')
    return [name,git('show',release.sourceCommit+':'+name)]
  }))
  for (const [name, content] of Object.entries(generated)) files.set(name,Buffer.from(content))
  validatePublicFiles(files)
  return files
}

export function buildPublicRelease() {
  const files = collectPublicFiles()
  mkdirSync(join(root,'.local'),{recursive:true})
  const output = mkdtempSync(join(root,'.local/public-release-'))
  const site = join(output,'site')
  mkdirSync(site)
  for (const [name,data] of files) writeFileSync(join(site,name),data,{flag:'wx'})
  const report = {sourceCommit:release.sourceCommit,rulesBaseline:release.rulesBaseline,site,files:Object.fromEntries([...files].map(([name,data])=>[name,createHash('sha256').update(data).digest('hex')]))}
  writeFileSync(join(output,'release-report.json'),JSON.stringify(report,null,2)+'\n',{flag:'wx'})
  return report
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assert.equal(process.argv.length,2,'No arguments accepted')
  const report = buildPublicRelease()
  console.log(JSON.stringify({site:report.site,sourceCommit:report.sourceCommit,publicFiles:Object.keys(report.files).length,productionAccess:false}))
}
