// Keep the fixed P0 release intact; publish only the reviewed latest source and allowlist.
import assert from 'node:assert/strict'
import {execFileSync} from 'node:child_process'
import {createHash} from 'node:crypto'
import {readFileSync,mkdirSync,mkdtempSync,writeFileSync} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {join,resolve} from 'node:path'
import {collectPublicFiles,validatePublicFiles,release as emergency} from './build-public.mjs'

const root=fileURLToPath(new URL('../',import.meta.url))
export const release=JSON.parse(readFileSync(new URL('./latest-public-release.json',import.meta.url),'utf8'))
const hash=data=>createHash('sha256').update(data).digest('hex')
const git=(...args)=>{
  try{return execFileSync('git',['-C',root,...args],{stdio:['ignore','pipe','pipe'],maxBuffer:16*1024*1024})}
  catch{throw new Error('Latest release Git source unavailable; contents withheld')}
}
export function validateLatestPublicFiles(files){
  validatePublicFiles(files)
  assert.deepEqual(Object.fromEntries([...files].map(([name,data])=>[name,hash(data)])),release.fileHashes,'Latest release differs from reviewed hashes; contents withheld')
}
export function collectLatestPublicFiles(){
  assert.match(release.sourceCommit,/^[a-f0-9]{40}$/)
  git('merge-base','--is-ancestor',release.sourceCommit,'HEAD')
  for(const [file,expected] of Object.entries(release.rulesSha256)){
    assert.ok(['firestore.rules','storage.rules'].includes(file))
    assert.equal(hash(Buffer.from(git('show',release.sourceCommit+':'+file).toString('utf8').replace(/\r\n/g,'\n'))),expected,'Reviewed rules source changed')
  }
  const files=collectPublicFiles()
  for(const name of emergency.files){
    assert.ok(git('ls-tree',release.sourceCommit,'--',name).toString().startsWith('100644 blob '),'Only regular Git blobs are publishable')
    files.set(name,git('show',release.sourceCommit+':'+name))
  }
  validateLatestPublicFiles(files)
  return files
}
export function buildLatestPublicRelease(){
  const files=collectLatestPublicFiles()
  mkdirSync(join(root,'.local'),{recursive:true})
  const output=mkdtempSync(join(root,'.local/latest-public-release-')),site=join(output,'site')
  mkdirSync(site)
  for(const [name,data] of files)writeFileSync(join(site,name),data,{flag:'wx'})
  writeFileSync(join(output,'release-report.json'),JSON.stringify({sourceCommit:release.sourceCommit,files:release.fileHashes},null,2)+'\n',{flag:'wx'})
  return {site,sourceCommit:release.sourceCommit,publicFiles:files.size}
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  assert.equal(process.argv.length,2,'No arguments accepted')
  console.log(JSON.stringify(buildLatestPublicRelease()))
}
