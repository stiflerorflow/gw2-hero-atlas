// Guided UI and build-to-hero-point handoff, including saved-data preservation.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{});
 const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.goto(process.env.ATLAS_URL||'http://127.0.0.1:8765/');await p.waitForFunction(()=>window.guideReady);
 assert.equal(await p.locator('.calm-nav > a:visible').count(),4);
 assert.equal(await p.locator('#hubguide').isVisible(),false);
 assert.equal(await p.locator('#accountworkspace').getAttribute('open'),null);
 assert(!/Steve|Matt|Weaver/.test(await p.locator('#homeview').innerText()));
 assert.deepEqual(await p.evaluate(()=>[profile().name,profile().target,profile().starting]),['My character',250,0]);assert.deepEqual(await p.evaluate(()=>[state.specKit.source,state.specKit.target,Object.values(state.specKit.own).some(Boolean)]),['unknown','',false]);assert.equal(await p.evaluate(()=>validate({...state,specKit:{source:'berserker'}}).specKit.source),'berserker');
 await p.locator('[data-hubguide]').first().tap();assert(await p.locator('#hubguide').isVisible());assert.equal(await p.locator('[data-guidepanel="1"]').isVisible(),true);
 await p.locator('[data-guidestep="2"]').first().tap();assert(await p.locator('[data-guidepanel="2"]').isVisible());
 await p.locator('nav [data-tab="home"]').tap();await p.locator('[data-startbuild]').tap();
 assert(await p.locator('#spquizform').isVisible());assert.equal(await p.locator('#buildtools').getAttribute('open'),'');
 await p.locator('#spquizform [type=submit]').tap();assert.equal(await p.locator('.sp-result').count(),3);
 // Reset into a stable revealed spec while seeding independent progress.
 await p.evaluate(()=>{profile().status['1-2']='earned';profile().status['1-3']='prior';profile().notes['1-2']='keep this note';const other=blank('Other character');other.starting=77;state.profiles.push(other);save();showSpec('48')});
 const f=p.locator('[data-spcard="48"] form[data-trainingbuild]').first();await f.locator('..').locator('summary').tap();
 await f.locator('[name=trained]').fill('50');await f.locator('[name=bank]').fill('80');assert((await f.locator('[data-trainingremaining]').innerText()).includes('120 HP remaining · up to 12'));
 const before=await p.evaluate(()=>JSON.stringify(state.profiles));await f.locator('[type=submit]').tap();await p.locator('#modalcancel').tap();assert.equal(await p.evaluate(()=>JSON.stringify(state.profiles)),before);
 await f.locator('[name=bank]').fill('199');assert((await f.locator('[data-trainingremaining]').innerText()).includes('1 HP remaining · up to 1'));
 await f.locator('[name=bank]').fill('80');await f.locator('[type=submit]').tap();await p.locator('#modalok').tap();
 assert.deepEqual(await p.evaluate(()=>({tab,target:profile().target,starting:profile().starting,spec:profile().trainingSpec,status:profile().status['1-2'],prior:profile().status['1-3'],note:profile().notes['1-2'],other:state.profiles[1].starting})),{tab:'atlas',target:250,starting:130,spec:'Tempest',status:'prior',prior:'prior',note:'keep this note',other:77});
 assert.equal(await p.locator('#personaljourney').getAttribute('open'),null);assert((await p.locator('#goaltext').textContent()).includes('Tempest'));
 await p.reload();assert.equal(await p.evaluate(()=>profile().trainingSpec),'Tempest');assert.equal(await p.evaluate(()=>validate(JSON.parse(JSON.stringify(state))).profiles[0].trainingSpec),'Tempest');
 // Optional routes remain reachable through a visible menu, with no persistent overlay.
 for(const tab of ['duo','sources','help','route']){await p.locator('#moretools > summary').tap();await p.locator(`.more-links [data-tab="${tab}"]`).tap();assert.equal(await p.evaluate(()=>tab),tab);assert.equal(await p.locator('#moretools').getAttribute('open'),null);}
 // All revealed and expanded surfaces under small viewports and automated WCAG checks.
 for(const width of [320,390,768]){await p.setViewportSize({width,height:844});for(const tab of ['home','specs','atlas','mastery','duo','sources','help','route']){await p.evaluate(t=>changeTab(t),tab);await p.evaluate(()=>document.querySelectorAll('main details').forEach(d=>{if(!d.hidden&&d.getClientRects().length)d.open=true}));assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${tab} overflow ${width}`);if(process.env.AXE_PATH){await p.addScriptTag({path:process.env.AXE_PATH});const failures=await p.evaluate(async()=>(await axe.run(document,{runOnly:['wcag2a','wcag2aa','wcag21aa']})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})));assert.deepEqual(failures,[],`${tab} axe ${width}`);}const css=await p.addStyleTag({content:'*{letter-spacing:.12em!important;word-spacing:.16em!important;line-height:1.5!important}p{margin-bottom:2em!important}'});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${tab} text spacing ${width}`);await css.evaluate(e=>e.remove());}console.log('PASS calm eight-tab reflow/accessibility at '+width);}
 assert.deepEqual(errors,[]);await b.close();console.log('PASS neutral defaults, guided entry, optional navigation and non-destructive build hero-point planning');
})().catch(e=>{console.error(e);process.exit(1)});
