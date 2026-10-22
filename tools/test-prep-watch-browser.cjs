const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require('./browser-tests/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const read=name=>readFileSync(path.join(root,name),'utf8');
const definitions=text=>new Map([...text.matchAll(/^(?:async )?function (\w+)\([^]*?^}\r?$/gm)].map(m=>[m[1],m[0]]));
const functions=new Map([...definitions(read('rotation_prep_passages.js')),...definitions(read('rotation_portal_enhancements.js'))]);
const {hash,videoDescriptor}=require('../functions/prep-watch.cjs');
exports.runBrowserChecks=async({alice,material,seed})=>{
  const server=http.createServer((request,response)=>{response.setHeader('Content-Type','text/html');response.end('<!doctype html><html lang="ko"><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body></body></html>')});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const origin='http://127.0.0.1:'+server.address().port;
  const browser=await chromium.launch({headless:true,...(process.platform==='win32'?{channel:'msedge'}:{})});
  let groups=0;
  try{
    for(const [width,provider,navigation,scenario] of [[390,'youtube',false],[1280,'youtube',false],[390,'storage',false],[1280,'youtube',true],[390,'youtube',false,'delayed-rate'],[390,'storage',false,'buffer']]){
      const materialId='browser-watch-'+provider+'-'+width+(navigation?'-nav':'')+(scenario?'-'+scenario:'');
      const nativePath='prep-videos/a/'+materialId+'/video.mp4';
      const rawPassage=provider==='storage'?{id:'video-1',video:{storagePath:nativePath,durationSeconds:6}}:material.payload.passages[0];
      await seed('portalPrepSets/'+materialId,{...material,payload:{...material.payload,id:materialId,passages:[rawPassage]}});
      if(provider==='youtube'){
        const video=videoDescriptor(rawPassage);
        await seed('prepWatchVideoMetadata/'+hash(video.videoKey),{videoKey:video.videoKey,duration:6});
      }
      const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
      const page=await context.newPage();
      const errors=[],diagnostics=[];page.on('pageerror',error=>errors.push(error.message));
      page.on('requestfailed',request=>{if(new URL(request.url()).port==='5001') diagnostics.push('Loopback request: '+request.failure()?.errorText)});
      const wait=async(label,condition)=>{
        try { await page.waitForFunction(condition,undefined,{timeout:10000}); }
        catch { const state=await page.evaluate(()=>({sequence:prepWatchTracker?.sequence,message:prepWatchTracker?.message,error:prepWatchTracker?.error,busy:prepWatchTracker?.busy}));throw Error(label+': '+JSON.stringify({state,errors,diagnostics})); }
      };
      let failNext=false,holdNext=false,requests=[];
      const held=Promise.withResolvers(),release=Promise.withResolvers();
      await context.route('**/*',async route=>{
        const url=new URL(route.request().url());
        if(url.hostname==='127.0.0.1' && url.port==='5001'){
          if(route.request().method()==='POST'){
            const data=JSON.parse(route.request().postData()).data;requests.push(data);
            if((navigation && data.state==='ended') || holdNext){
              holdNext=false;
              const response=await route.fetch();held.resolve();await release.promise;return route.fulfill({response});
            }
          }
          if(failNext && route.request().method()==='POST'){failNext=false;return route.abort();}
          return route.continue();
        }
        if(url.origin===origin)return route.continue();
        if(url.hostname==='www.youtube.com')return route.fulfill({status:200,contentType:'text/html',body:'<!doctype html><title>Synthetic video</title>'});
        return route.abort();
      });
      await page.goto(origin);
      await page.addStyleTag({content:read('rotation_prep.css')});
      await page.setContent('<main id="study-screen" class="screen active"><h1>PREP 영상</h1><div id="s-title"></div><div id="s-cnt"></div><div id="study-meta"></div><div id="p-box"><span class="lbl"></span><div id="p-txt"></div><button id="p-toggle">본문</button></div><div id="stage-panel"></div><div id="stage-content"></div><div id="stage-actions"></div></main>');
      await page.evaluate(({uid,token,materialId,provider,nativePath})=>{
        window.ROTATION_FIREBASE_CONFIG={projectId:'demo-codelab-reaudit'};
        window.ROTATION_PREP_WATCH_EMULATOR='http://127.0.0.1:5001';
        window.portalState={currentUser:{uid,getIdToken:async()=>token},userSession:1,firebaseEnabled:true,currentPrepVideoProgressRows:[],currentPrepVideoProgressLoadedUserId:uid};
        window.progress={done:{}};window.currentSetIndex=0;window.currentPassage=0;
        window.fixtureSet={id:materialId,materialId,title:'Synthetic PREP',passages:[{id:'video-1',title:'Synthetic video',videoTitle:'Synthetic video',videoProvider:'youtube',videoEmbedUrl:'https://www.youtube.com/embed/abcdefghijk',videoUpdatedAt:'',hasVideo:true}]};
        fixtureSet.classAssignments=[{classId:'a',passageIndexes:[0]}];window.studySets=[fixtureSet];window.progressKey='synthetic-progress';
        window.getCurrentClass=()=>({id:'a'});window.sanitizeId=value=>String(value||'').replace(/[^a-zA-Z0-9_-]/g,'-');
        window.fixtureScreen='study-screen';window.listRenders=0;window.getCurrentActiveScreenId=()=>fixtureScreen;
        if(provider==='storage')Object.assign(fixtureSet.passages[0],{videoProvider:'',videoEmbedUrl:'',videoStoragePath:nativePath,videoRequiresAuth:true});
        window.fetchPortalStorageBlob=async()=>new Blob(['synthetic'],{type:'video/mp4'});
        window.getCurrentStudySet=()=>fixtureSet;
        window.getPassageProgressStorageKey=()=>materialId+':0';
        window.getStudySetDateText=()=>'';window.saveProgress=()=>{};
        window.showPassageScreen=()=>{};window.isPortalAdmin=()=>false;
        window.escapeHtml=value=>{const node=document.createElement('div');node.textContent=String(value??'');return node.innerHTML};
        window.fakePlayback={position:0,rate:1,state:2,updatedAt:performance.now()};
        window.fakePosition=()=>Math.min(6,fakePlayback.position+(fakePlayback.state===1?(performance.now()-fakePlayback.updatedAt)/1000*fakePlayback.rate:0));
        window.YT={Player:function(frame,options){
          const player=this;window.fakePlayer=player;player.options=options;
          player.getCurrentTime=()=>fakePosition();player.getPlaybackRate=()=>fakePlayback.rate;player.getPlayerState=()=>fakePlayback.state;
          player.destroy=()=>frame.remove();queueMicrotask(()=>options.events.onReady());
        }};
        window.emitPlayback=(state,eventName)=>{
          fakePlayback.position=fakePosition();fakePlayback.updatedAt=performance.now();
          fakePlayback.state=state;
          if(provider==='youtube')fakePlayer.options.events.onStateChange({data:state});
          else document.querySelector('video').dispatchEvent(new Event(eventName || (state===0?'ended':state===1?'play':state===3?'waiting':'pause')));
        };
        window.emitRate=rate=>{
          fakePlayback.position=fakePosition();fakePlayback.updatedAt=performance.now();window.rateBoundary=fakePlayback.position;
          fakePlayback.rate=rate;
          if(provider==='youtube')fakePlayer.options.events.onPlaybackRateChange();
          else document.querySelector('video').dispatchEvent(new Event('ratechange'));
        };
        window.prepareNativePlayer=()=>{
          if(provider!=='storage')return;
          const player=document.querySelector('video');
          Object.defineProperties(player,{currentTime:{get:()=>fakePosition()},playbackRate:{get:()=>fakePlayback.rate},paused:{get:()=>fakePlayback.state===0||fakePlayback.state===2},ended:{get:()=>fakePlayback.state===0}});
        };
      },{uid:alice.uid,token:alice.token,materialId,provider,nativePath});
      for(const name of ['parsePassageVideoUrl','sanitizePortalPrepProgressSegment','getPortalPrepProgressSetId','getPortalPrepProgressPassageId','normalizePortalPrepProgressIndex','buildPortalPrepVideoProgressDocId','normalizePortalPrepVideoProgressRecord','getPortalPrepVideoProgressUserId','mergePortalPrepVideoProgressCache','getPortalPrepVideoProgressRowTime','findPortalPrepVideoProgressRow','applyPortalPrepVideoProgressRowsToCurrentPrepClass'])await page.addScriptTag({content:functions.get(name)});
      await page.addScriptTag({content:read('rotation_prep_ui.js')});
      await page.evaluate(()=>{window.renderPassageScreen=()=>listRenders++;window.renderClassSummary=()=>{};renderStudy();prepareNativePlayer()});
      await wait('Initial server connection',()=>prepWatchTracker?.sessionId && !prepWatchTracker.busy && prepWatchTracker.sequence>=1);
      assert.equal(await page.locator('button[onclick="markPassageDone()"]').count(),0);
      assert.equal(await page.locator('#prep-watch-status').getAttribute('role'),'status');
      assert.equal(await page.evaluate(()=>prepWatchTracker.progress.done),false);
      holdNext=scenario==='delayed-rate';
      await page.evaluate(()=>emitPlayback(1));
      if(holdNext || scenario==='delayed-rate')await Promise.race([held.promise,new Promise((resolve,reject)=>{setTimeout(()=>reject(Error('Playback response was not held')),10000).unref()})]);
      else await wait('Playback baseline',()=>!prepWatchTracker.busy && prepWatchTracker.sequence>=2);
      await new Promise(resolve=>setTimeout(resolve,1100));
      if(scenario==='buffer'){
        await page.evaluate(()=>emitPlayback(3));
        await wait('Buffer pause boundary',()=>!prepWatchTracker.busy && prepWatchTracker.lastState==='paused');
        await new Promise(resolve=>setTimeout(resolve,1600));
        await page.evaluate(()=>emitPlayback(1,'playing'));
        await wait('Buffer resume boundary',()=>!prepWatchTracker.busy && prepWatchTracker.lastState==='playing');
      }
      await page.evaluate(()=>emitRate(2));
      if(scenario==='delayed-rate'){
        await new Promise(resolve=>setTimeout(resolve,2600));release.resolve();
      }
      await wait('Rate transition acknowledgement',()=>!prepWatchTracker.busy && prepWatchTracker.progress.watchedSeconds>=0.95 && prepWatchTracker.lastState==='playing');
      if(scenario!=='delayed-rate')await new Promise(resolve=>setTimeout(resolve,2600));
      if(navigation){
        const key=await page.evaluate(()=>prepWatchTracker.pendingKey);
        await page.evaluate(()=>{fakePlayback.position=6;emitPlayback(0)});
        await Promise.race([held.promise,new Promise((resolve,reject)=>{setTimeout(()=>reject(Error('Completion response was not held')),10000).unref()})]);
        await page.evaluate(()=>{fixtureScreen='passage-screen';stopActivePrepVideoPlayback()});
        release.resolve();
        await wait('Late completion hydrates list',()=>portalState.currentPrepVideoProgressRows.some(row=>row.done) && listRenders>0);
        assert.equal(await page.evaluate(()=>prepWatchTracker),null);
        assert.equal(await page.evaluate(()=>Object.values(progress.done).includes(true)),true);
        assert.equal(await page.evaluate(key=>localStorage.getItem(key),key),null);
        assert.deepEqual(errors,[]);await context.close();groups++;continue;
      }
      failNext=true;
      await page.evaluate(()=>{fakePlayback.position=6;emitPlayback(0)});
      await wait('Failed acknowledgement',()=>prepWatchTracker.error && !prepWatchTracker.busy);
      assert.equal(await page.locator('#prep-watch-retry').isVisible(),true);
      assert.equal(await page.evaluate(()=>prepWatchTracker.progress.done),false,'No speculative completion on failed acknowledgement');
      const failed=requests.at(-1);
      await page.locator('#prep-watch-retry').click();
      await page.evaluate(()=>prepareNativePlayer());
      await wait('Completion retry',()=>prepWatchTracker?.progress?.done && !prepWatchTracker.busy);
      const retried=requests.filter(request=>request.requestId===failed.requestId);
      assert.ok(retried.length>=2,'Reopening must retry the unacknowledged request');
      for(const request of retried)assert.deepEqual(request,failed,'Retry must submit exactly the same request');
      assert.match(await page.locator('#prep-watch-summary').innerText(),/자동 완료/);
      assert.ok(await page.evaluate(()=>prepWatchTracker.progress.watchedSeconds>=5.9 && prepWatchTracker.progress.watchedSeconds<=6));
      assert.ok(await page.evaluate(()=>Math.abs(prepWatchTracker.progress.playSeconds-(rateBoundary+(6-rateBoundary)/2))<0.1));
      assert.equal(await page.evaluate(()=>localStorage.getItem(prepWatchTracker.pendingKey)),null);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'No horizontal overflow');
      if(provider==='youtube'){
        await page.evaluate(()=>fakePlayer.options.events.onError());
        await wait('Runtime player failure',()=>prepWatchTracker.error && prepWatchTracker.blocked && !prepWatchTracker.busy);
        assert.match(await page.locator('#prep-watch-status').innerText(),/재생할 수 없습니다/);
      }
      await page.evaluate(()=>{portalState.userSession++;portalState.currentUser=null;stopActivePrepVideoPlayback()});
      assert.equal(await page.evaluate(()=>prepWatchTracker),null);
      assert.deepEqual(errors,[]);
      await context.close();groups++;
    }
    return groups;
  }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
};
