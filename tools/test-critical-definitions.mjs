import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const files=['rotation_portal.js','rotation_portal_enhancements.js']
const auth=['routePortalAfterState','showAuthScreen','loginPortalUser','handleResolvedAuthUser','fetchOrCreateUserProfile','submitAuthForm','submitPasswordChange']
const persistence=['saveCheckSubmission','mergeCheckSubmission','mapResponseToSubmission']
for(const name of [...auth,...persistence]){
  const owners=files.flatMap(file=>[...readFileSync(new URL('../'+file,import.meta.url),'utf8').matchAll(/^(?:async )?function (\w+)\(/gm)].filter(match=>match[1]===name).map(()=>file))
  assert.deepEqual(owners,[auth.includes(name)?files[0]:files[1]],name+': keep one authoritative implementation')
}
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8')
assert.ok(html.indexOf('src="./rotation_portal.js?')<html.indexOf('src="./rotation_portal_enhancements.js?'),'Preserve script initialization order')
console.log('Critical definitions: seven auth and three persistence functions have one authoritative implementation: OK')
