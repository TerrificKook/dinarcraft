"use strict";
// Real project files; all network requests are intercepted. No production events.
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..');const evidence=path.resolve(root,'../../notes/dinarcraft-restart-20261006/screenshots');
fs.mkdirSync(evidence,{recursive:true});
const fakeTag=`(()=>{const q=window.ym?.a||[];window.__qaMetrika=[];window.ym=(...a)=>window.__qaMetrika.push(a);q.forEach(a=>window.ym(...a));})();`;
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg'};
const routes=['/','/catalog/ezhednevniki-kozha-optom/','/catalog/034-ezhednevnik-kozhanyy-a5/'];
const results=[];let browser;
(async()=>{
browser=await chromium.launch({channel:'chrome',headless:true});
for(const width of [1440,390])for(const [index,urlPath] of routes.entries()){
  const context=await browser.newContext({viewport:{width,height:900},serviceWorkers:'block'});
  const tagRequests=[];const errors=[];const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',route=>{
    const url=new URL(route.request().url());
    if(url.hostname==='mc.yandex.ru'){tagRequests.push(url.href);return route.fulfill({status:200,contentType:'application/javascript',body:fakeTag});}
    if(url.hostname!=='dinarcraft.ru')return route.abort();
    let relative=decodeURIComponent(url.pathname).slice(1);if(!relative||relative.endsWith('/'))relative+='index.html';
    const file=path.resolve(root,relative);if(!file.startsWith(root+path.sep)||!fs.existsSync(file))return route.fulfill({status:404,body:'Not found'});
    return route.fulfill({status:200,contentType:types[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)});
  });
  await page.goto('https://dinarcraft.ru'+urlPath);await page.getByRole('button',{name:'Разрешить аналитику'}).waitFor();
  assert.equal(tagRequests.length,0);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await page.evaluate(()=>document.querySelectorAll('img[loading="lazy"]').forEach(i=>i.loading='eager'));
  await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete));
  const broken=await page.evaluate(()=>Array.from(document.images).filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.getAttribute('src')));assert.deepEqual(broken,[]);
  await page.screenshot({path:path.join(evidence,`page-${index}-${width}-banner.png`)});
  const footerContact=page.locator('footer a[href^="tel:"]').first();
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  const box=await footerContact.boundingBox();const banner=await page.locator('.analytics-choice').boundingBox();
  assert(box&&banner);assert(box.y+box.height<=banner.y||box.y>=banner.y+banner.height,'Consent panel covers contact');
  for(const contact of await page.locator('footer .footer-contacts a').all()){
    const rect=await contact.boundingBox();assert(rect.y+rect.height<=banner.y,'Consent panel covers a footer contact');
  }
  if(width===390&&index===1)await page.screenshot({path:path.join(evidence,'landing-mobile-footer-banner.png')});
  if(width===390){
    await page.getByRole('button',{name:'Открыть меню'}).click();
    assert.equal(await page.locator('#mobile-nav-panel').isVisible(),true);
    await page.waitForFunction(()=>document.querySelector('#mobile-nav-panel').classList.contains('is-open'));
    await page.keyboard.press('Escape');await page.waitForFunction(()=>document.querySelector('#mobile-nav-panel').hidden);
  }
  await page.getByRole('button',{name:'Разрешить аналитику'}).click();await page.waitForFunction(()=>(window.__qaMetrika||[]).some(c=>c[1]==='hit'));
  await page.evaluate(()=>document.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{if(a.href.startsWith('tel:')||a.href.startsWith('mailto:')||/^https:\/\/(t\.me|max\.ru)\//.test(a.href))e.preventDefault();})));
  await footerContact.click();
  const calls=await page.evaluate(()=>window.__qaMetrika);assert.equal(calls.filter(c=>c[1]==='init').length,1);assert.equal(calls.filter(c=>c[1]==='hit').length,1);
  const goals=calls.filter(c=>c[1]==='reachGoal'&&c[2]==='contact_click');assert.equal(goals.length,1);assert.deepEqual(goals[0][3],{channel:'phone',page:urlPath});
  assert.equal(tagRequests.length,1);assert.deepEqual(errors,[]);
  results.push({path:urlPath,width,images:'OK',menu:'OK',noOverflow:true,contactNotCovered:true,init:1,hit:1,contactGoal:1,transport:'MOCKED',errors});
  await context.close();
}
// Actual landing page remains accessible without JavaScript.
const context=await browser.newContext({viewport:{width:390,height:900},javaScriptEnabled:false});const page=await context.newPage();
await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname!=='dinarcraft.ru')return route.abort();let rel=url.pathname.slice(1);if(rel.endsWith('/'))rel+='index.html';const file=path.resolve(root,rel);return fs.existsSync(file)?route.fulfill({status:200,body:fs.readFileSync(file),contentType:types[path.extname(file)]||'application/octet-stream'}):route.abort();});
await page.goto('https://dinarcraft.ru/catalog/ezhednevniki-kozha-optom/');assert.equal(await page.getByRole('link',{name:'Позвонить',exact:true}).isVisible(),true);assert.equal(await page.getByRole('link',{name:'Написать в Telegram',exact:true}).isVisible(),true);await context.close();
await browser.close();fs.writeFileSync(path.join(evidence,'../site-review.json'),JSON.stringify({results,noJavaScript:'PASS',productionEvents:0},null,2));console.log('PASS actual pages: 3 pages x 2 widths, images/menu/contacts/consent; no JS landing PASS; production events 0');
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
