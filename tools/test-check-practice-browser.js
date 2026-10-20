async page => {
  const check=(value,message)=>{if(!value)throw Error(message)};
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Network.setBypassServiceWorker',{bypass:true});
  await page.addInitScript(()=>{if(navigator.serviceWorker)navigator.serviceWorker.register=async()=>({})});
  await page.context().route('**/*',route=>{
    const host=new URL(route.request().url()).hostname;
    return host==='127.0.0.1'||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(host)?route.continue():route.abort('blockedbyclient');
  });
  await page.goto('http://127.0.0.1:8000/',{waitUntil:'networkidle'});
  const results=[];
  const contrast=async locator=>locator.evaluate(node=>{
    const rgba=value=>{const a=value.match(/[\d.]+/g)||[];return a.slice(0,3).map(Number).concat(a.length>3?Number(a[3]):1)};
    const blend=(fg,bg)=>fg.slice(0,3).map((v,i)=>v*fg[3]+bg[i]*(1-fg[3])).concat(1);
    const background=element=>{
      if(!element)return [255,255,255,1];
      const color=rgba(getComputedStyle(element).backgroundColor);
      return color[3]===1?color:blend(color,background(element.parentElement));
    };
    const css=getComputedStyle(node),base=background(node);
    const stops=(css.backgroundImage.match(/rgba?\([^)]*\)/g)||[]).map(rgba);
    const backgrounds=stops.length?stops.map(stop=>blend(stop,base)):[base];
    const lum=color=>color.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
    const ratio=bg=>{const a=lum(blend(rgba(css.color),bg)),b=lum(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
    return {color:css.color,background:css.backgroundColor,image:css.backgroundImage,minContrast:Math.min(...backgrounds.map(ratio))};
  });
  for(const width of [390,1280]){
    await page.setViewportSize({width,height:900});
    await page.evaluate(()=>{
      portalState.firebaseEnabled=false;portalState.authResolved=true;portalState.currentUser={uid:'synthetic-practice'};
      portalState.currentProfile={uid:'synthetic-practice',role:'student',classIds:['a']};
      portalState.currentCheckSet={id:'synthetic-set',title:'Synthetic practice',classIds:['a'],questions:[{id:'q1',number:1,type:'객관식',answer:'1',prompt:'Synthetic question'}]};
      portalState.currentCheckSubmission=null;portalState.currentCheckDraftAnswers={q1:'1'};
      renderCurrentCheckSet();activatePortalScreen('check-set-screen');
    });
    check(await page.locator('#check-set-practice-notice').isVisible(),'Practice notice is visible beside the CHECK task');
    const notice=await contrast(page.locator('#check-set-practice-notice'));
    check(notice.minContrast>=4.5,'Practice notice contrast: '+JSON.stringify(notice));
    const choice=page.locator('#check-set-screen .check-choice-btn.active').first();
    await choice.hover();const hovered=await contrast(choice);
    check(hovered.minContrast>=4.5,'Active choice hover contrast: '+JSON.stringify(hovered));
    const chip=page.locator('#check-set-screen .check-progress-chip.active').first();
    await chip.hover();const chipText=await contrast(chip),chipCount=await contrast(chip.locator('span:not(.ui-action-icon)').last());
    check(chipText.minContrast>=4.5&&chipCount.minContrast>=4.5,'Active progress hover contrast');
    const exported=await page.evaluate(()=>{
      const analytics={selectedSetTitle:'Synthetic',generatedAt:'2026-10-20',questionRanks:[],typeRanks:[],questions:[],studentRows:[]};
      return buildAdminAnalyticsExcelHtml(analytics);
    });
    check(exported.includes('2차 오답 생성용 참고 기록이며 공식 성적이 아닙니다.'),'Export retains practice purpose');
    const otherNotices=[];
    for(const [screen,id] of [['check-screen','check-practice-notice'],['admin-screen','admin-check-practice-notice']]){
      await page.evaluate(screen=>{portalState.currentProfile.role='admin';portalState.currentProfile.adminScope='all';activatePortalScreen(screen)},screen);
      const node=page.locator('#'+id);check(await node.isVisible(),id+' is visible');
      const metric=await contrast(node);check(metric.minContrast>=4.5,id+' contrast: '+JSON.stringify(metric));
      check(await node.evaluate(el=>el.scrollWidth<=el.clientWidth+1),id+' must wrap without clipping');
      otherNotices.push({id,...metric});
    }
    results.push({width,notice,hovered,chipText,chipCount,otherNotices,exportPurpose:true});
  }
  return {results,productionWrites:0,mode:'real app renderer, active/hover CSS and Excel builder; synthetic local state'};
}
