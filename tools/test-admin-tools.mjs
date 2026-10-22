import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import vm from 'node:vm'

const read=name=>readFileSync(new URL('../'+name,import.meta.url),'utf8')
const source=read('rotation_portal_enhancements.js'),html=read('index.html')
const definitions=new Map([...source.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(match=>[match[1],match[0]]))
const cards=html.slice(html.indexOf('id="admin-portal-screen"'),html.indexOf('id="admin-screen"'))
assert.match(cards,/id="admin-portal-merger-btn"/)
assert.match(cards,/>MERGER LAB<\/strong>/)
assert.ok(!/BUILDER LAB|admin-portal-builder-btn/.test(cards))
const nodes=new Map(),toasts=[],opened=[]
const node=id=>{if(!nodes.has(id))nodes.set(id,{classList:{toggle(name,value){this[name]=value}},textContent:''});return nodes.get(id)}
const ctx=vm.createContext({portalState:{currentProfile:{allowedLabs:['builder-lab']}},
  document:{getElementById:node,querySelector:()=>node('count')},
  showToast:message=>toasts.push(message),window:{open:(...args)=>{const popup={opener:'parent',location:{}};opened.push({args,popup});return popup}},
  bindClick:(id,handler)=>{node(id).click=handler},isPortalAdmin:()=>true})
vm.runInContext(source.slice(source.indexOf('const ADMIN_PORTAL_LABS ='),source.indexOf('const PORTAL_COUNSEL_OTHER_REASON')),ctx)
for(const name of ['getAllAdminPortalLabs','filterAdminPortalLabsForCurrentUser','normalizeAdminPortalLabName','normalizeAdminPortalLabList','extractAdminPortalLabList','resolveAdminPortalLabList','applyAdminPortalLabVisibility','isAdminPortalLabAllowed','openLabPlaceholder','openToolsPortal'])vm.runInContext(definitions.get(name),ctx)
const plain=value=>JSON.parse(JSON.stringify(value))
assert.deepEqual(plain(ctx.getAllAdminPortalLabs()).sort(),['MERGER LAB','PDF LAB','PINPOINT LAB','WORD LAB'])
for(const alias of ['merger','mergerlab','merger-lab',' MERGER LAB ','builder','builderlab','builder-lab','BUILDER LAB'])assert.equal(ctx.normalizeAdminPortalLabName(alias),'MERGER LAB')
for(const field of ['allowedLabs','toolLabs','labAccess'])assert.deepEqual(plain(ctx.extractAdminPortalLabList({[field]:['builder-lab','merger-lab','word-lab']})),['MERGER LAB','WORD LAB'])
assert.deepEqual(plain(await ctx.resolveAdminPortalLabList()),['MERGER LAB'])
ctx.portalState.currentProfile={role:'admin',adminScope:'assigned'}
assert.deepEqual(plain(await ctx.resolveAdminPortalLabList()).sort(),plain(ctx.getAllAdminPortalLabs()).sort())
ctx.portalState.currentProfile.allowedLabs=[]
assert.deepEqual(plain(await ctx.resolveAdminPortalLabList()),[])
assert.deepEqual(plain(ctx.normalizeAdminPortalLabList(['all'])).sort(),plain(ctx.getAllAdminPortalLabs()).sort())
assert.deepEqual(plain(ctx.normalizeAdminPortalLabList(['unknown'])),[])
ctx.portalState.adminPortalAllowedLabs=['MERGER LAB'];ctx.applyAdminPortalLabVisibility(['MERGER LAB'])
assert.equal(node('admin-portal-merger-btn').classList.hidden,false)
assert.equal(node('admin-portal-word-btn').classList.hidden,true)
assert.equal(node('count').textContent,'1 LAB')
const binding=source.match(/^  bindClick\('admin-portal-merger-btn'.+$/m);assert.ok(binding)
vm.runInContext(binding[0],ctx);node('admin-portal-merger-btn').click()
assert.equal(opened.length,1);assert.deepEqual(opened[0].args,['','_blank']);assert.equal(opened[0].popup.opener,null)
assert.equal(opened[0].popup.location.href,'https://merger-lab.nimbler413.chatgpt.site/')
ctx.portalState.adminPortalAllowedLabs=[];ctx.applyAdminPortalLabVisibility([]);node('admin-portal-merger-btn').click()
assert.equal(node('admin-portal-merger-btn').classList.hidden,true);assert.equal(opened.length,1);assert.match(toasts.at(-1),/허용되지/)
ctx.portalState.adminPortalAllowedLabs=['MERGER LAB'];ctx.window.open=()=>null;node('admin-portal-merger-btn').click();assert.match(toasts.at(-1),/차단/)
ctx.isPortalAdmin=()=>false;assert.deepEqual(plain(await ctx.resolveAdminPortalLabList()),[]);await ctx.openToolsPortal();assert.match(toasts.at(-1),/관리자 계정/)
assert.ok(!source.includes('https://enoch413.github.io/builder-lab/'))
console.log('ADMIN tools: MERGER card, legacy permission aliases, explicit restrictions, safe click, popup blocking and student denial passed; no production access.')
