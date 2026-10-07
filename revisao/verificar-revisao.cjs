const {chromium} = require('C:/Users/Isaque/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const root = path.resolve(__dirname,'..');
const url = pathToFileURL(path.join(root,'jogo','index.html')).href;
const result = {checks:[],errors:[]};
let browser;
const snap = page => page.evaluate(() => ({state:{scene:state.currentSceneId,name:state.playerName,gender:state.gender,typing:state.isTyping,transition:state.isTransitioning}, focus:document.activeElement.id || document.activeElement.className,modal:getComputedStyle(document.querySelector('#restart-modal')).display,location:document.querySelector('#scene-location').textContent,speech:document.querySelector('#speech-text').textContent,panel:document.querySelector('#panel-container').innerText,scrollY,overflow:document.documentElement.scrollWidth>innerWidth}));
async function makePage(options={}) {
 const page=await browser.newPage({viewport:{width:1366,height:768},...options});
 page.setDefaultTimeout(8000);
 page.on('pageerror',e=>result.errors.push(e.message));
 await page.context().setOffline(true);
 await page.goto(url);
 return page;
}
async function begin(page, gender='feminino', name='Ana <teste>') {
 await page.getByRole('button',{name:'Jogar',exact:true}).click();
 await page.getByLabel('Nome',{exact:true}).fill(name);
 await page.getByRole('radio',{name:gender==='feminino'?'Feminino':'Masculino',exact:true}).check();
 await page.getByRole('button',{name:'Continuar',exact:true}).click();
 await page.getByRole('button',{name:'Sim!',exact:true}).click();
 await page.getByRole('button',{name:'Começar',exact:true}).click();
 await page.locator('#dialogue-box').waitFor({state:'visible'});
}
async function completeSpeech(page) {
 const skip=page.getByRole('button',{name:'Mostrar texto',exact:true});
 if(await skip.isVisible()) await skip.click();
 await page.waitForFunction(()=>!state.isTyping && document.querySelector('#dialogue-interactive button'));
}
async function nextChoice(page, next, index=0) {
 await completeSpeech(page);
 await page.locator('#dialogue-interactive .choice').nth(index).click();
 await page.waitForFunction(id=>state.currentSceneId===id && !state.isTransitioning, next);
}
(async()=>{
 browser=await chromium.launch({headless:true,channel:'msedge'});
 result.browser=await browser.version();
 for(const gender of ['feminino','masculino']) {
  const p=await makePage({reducedMotion:gender==='masculino'?'reduce':'no-preference'});
  await begin(p,gender);
  await completeSpeech(p);
  const first=await snap(p);
  await nextChoice(p,'quarto_fala2',gender==='feminino'?0:1);
  await completeSpeech(p);
  const second=await snap(p);
  await nextChoice(p,'quarto_fala3',gender==='feminino'?1:0);
  await completeSpeech(p);
  await p.getByRole('button',{name:'Próximo',exact:true}).click();
  await p.waitForFunction(()=>document.querySelector('#dialogue-speaker').textContent==='Pai');
  await completeSpeech(p);
  const school=await snap(p);
  await p.screenshot({path:path.join(__dirname,`escola-${gender}.png`)});
  await nextChoice(p,'fim',gender==='feminino'?0:1);
  await p.getByRole('button',{name:'Jogar novamente',exact:true}).click();
  await p.getByRole('button',{name:'Jogar',exact:true}).waitFor();
  result.checks.push({test:'complete-flow',gender,first,second,school,reset:await snap(p)});
  await p.close();
 }
 // Modal aberto durante a digitação natural, sem alteração do estado da aplicação.
 {
  const p=await makePage(); await begin(p);
  await p.getByRole('button',{name:'Reiniciar',exact:true}).click();
  const before=await snap(p);
  await p.waitForFunction(()=>!state.isTyping);
  const after=await snap(p);
  await p.keyboard.press('Escape');
  const escape=await snap(p);
  await p.screenshot({path:path.join(__dirname,'modal-foco-fora.png')});
  result.checks.push({test:'modal-during-typing',before,after,escape});
  await p.close();
 }
 // Sequência de cliques sobre controles reais para reproduzir a janela de transição.
 {
  const p=await makePage(); await begin(p); await completeSpeech(p);
  await p.evaluate(()=>{
   document.querySelector('#dialogue-interactive .choice').click();
   setTimeout(()=>document.querySelector('#btn-reiniciar').click(),20);
   setTimeout(()=>document.querySelector('#btn-confirmar-reinicio').click(),50);
  });
  await p.waitForTimeout(1000);
  result.checks.push({test:'restart-during-choice-delay',snapshot:await snap(p)});
  await p.screenshot({path:path.join(__dirname,'reinicio-retorna-dialogo.png')});
  await p.close();
 }
 // DOM e árvore de acessibilidade das falas.
 {
  const p=await makePage({reducedMotion:'reduce'}); await begin(p);
  const cdp=await p.context().newCDPSession(p);
  const tree=await cdp.send('Accessibility.getFullAXTree');
  fs.writeFileSync(path.join(__dirname,'arvore-acessibilidade.json'),JSON.stringify(tree,null,2));
  result.checks.push({test:'speech-accessibility',snapshot:await p.locator('#dialogue-box').ariaSnapshot(),focus:(await snap(p)).focus});
  // Feedback de escolha com o tempo parado para inspecionar o estado real antes do avanço.
  await p.emulateMedia({reducedMotion:'no-preference'});
  await p.clock.install(); await p.clock.pauseAt(new Date());
  await p.locator('#dialogue-interactive .choice').first().evaluate(el=>el.click());
  result.checks.push({test:'choice-feedback',style:await p.locator('#dialogue-interactive .choice').first().evaluate(el=>({disabled:el.disabled,selected:el.classList.contains('is-selected'),background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}))});
  await p.close();
 }
 {
  const p=await makePage({viewport:{width:390,height:844},reducedMotion:'reduce'}); await begin(p);
  await nextChoice(p,'quarto_fala2'); await nextChoice(p,'quarto_fala3');
  await p.getByRole('button',{name:'Próximo',exact:true}).click();
  await p.waitForFunction(()=>document.querySelector('#dialogue-speaker').textContent==='Pai');
  result.checks.push({test:'mobile-school',snapshot:await snap(p)});
  await p.screenshot({path:path.join(__dirname,'escola-mobile.png'),fullPage:true});
  await p.close();
 }
 {
  const p=await makePage({reducedMotion:'reduce'});
  await p.getByRole('button',{name:'Jogar',exact:true}).click();
  await p.getByRole('button',{name:'Continuar',exact:true}).click();
  const empty=await p.locator('#ident-error').innerText();
  await p.getByLabel('Nome',{exact:true}).fill('  ');
  await p.getByRole('button',{name:'Continuar',exact:true}).click();
  const spaces=await p.locator('#ident-error').innerText();
  await p.getByLabel('Nome',{exact:true}).fill('<img src=x onerror=alert(1)>');
  await p.getByRole('button',{name:'Continuar',exact:true}).click();
  const missingGender=await p.locator('#ident-error').innerText();
  await p.getByRole('radio',{name:'Feminino',exact:true}).check();
  await p.getByRole('button',{name:'Continuar',exact:true}).click();
  result.checks.push({test:'validation',empty,spaces,missingGender,tag:await p.locator('#intro-player-tag').innerText(),injectedImages:await p.locator('#intro-player-tag img').count()});
  await p.close();
 }
})().catch(e=>{result.fatal=String(e.stack||e)}).finally(async()=>{
 fs.writeFileSync(path.join(__dirname,'evidencias.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify(result));
 if(browser)await browser.close();
});
