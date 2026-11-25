const {chromium} = require('C:/Users/Isaque/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../jogo');
const server = http.createServer((req,res) => {
  const file = path.resolve(root, '.' + (req.url.split('?')[0] === '/' ? '/index.html' : req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) {res.writeHead(403).end();return;}
  fs.readFile(file, (err, data) => {if(err){res.writeHead(404).end();return;}
    res.setHeader('Content-Type', file.endsWith('.png') ? 'image/png' : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : 'text/html');res.end(data);});
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const errors=[];
  try {
    const page=await browser.newPage({reducedMotion:'reduce'});
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.evaluate(()=>{state.gender='feminino';state.playerName='Teste';goToScene('patio');});
    await page.locator('#scene-char').evaluate(img=>img.decode());
    let release, requested;
    const gate=new Promise(resolve=>release=resolve);
    const requestSeen=new Promise(resolve=>requested=resolve);
    await page.route('**/personagem-mae.png', async route=>{requested();await gate;await route.continue();});
    await page.evaluate(()=>goToScene('quarto_fala1'));
    await requestSeen;
    // O navegador pode conservar os pixels da Júlia enquanto carrega a mãe.
    const visible=await page.locator('#scene-char').evaluate(img=>getComputedStyle(img).visibility);
    release();
    assert.equal(visible,'hidden','Sprite anterior ficou visível enquanto a mãe carregava');
    await page.waitForFunction(()=>document.querySelector('#scene-char').style.visibility==='visible');
    await page.unroute('**/personagem-mae.png');
    // Uma resposta de imagem atrasada não pode reaparecer após reiniciar.
    let releaseOld, oldRequested;
    const oldGate = new Promise(resolve=>releaseOld=resolve);
    const oldSeen = new Promise(resolve=>oldRequested=resolve);
    await page.route('**/personagem-professora.png',async route=>{oldRequested();await oldGate;await route.continue();});
    await page.evaluate(()=>goToScene('professora_entra'));
    await oldSeen;
    await page.getByRole('button',{name:'Reiniciar',exact:true}).click();
    await page.getByRole('button',{name:'Recomeçar',exact:true}).click();
    await page.evaluate(()=>{state.gender='masculino';goToScene('quarto_fala1');});
    releaseOld();
    await page.waitForLoadState('networkidle');
    assert.equal(await page.locator('#scene-char').getAttribute('src'),'assets/personagem-mae.png');
    assert.equal(await page.locator('#scene-char').evaluate(img=>getComputedStyle(img).visibility),'visible');
    await page.unroute('**/personagem-professora.png');
    for(let i=0;i<12;i++) {
      await page.evaluate(()=>{goToScene('patio');resetGame();resetGame();state.gender='feminino';goToScene('quarto_fala1');});
      await page.waitForFunction(()=>!state.isTransitioning && document.querySelector('#scene-char').style.visibility==='visible');
      assert.deepEqual(await page.evaluate(()=>[state.currentSceneId,dom.sceneChar.getAttribute('src'),dom.dialogueSpeaker.textContent]),['quarto_fala1','assets/personagem-mae.png','Mãe']);
    }
    await page.evaluate(()=>resetGame());
    assert.equal(await page.locator('#scene-char').getAttribute('src'),null);
    assert.equal(await page.locator('#player-portrait-img').getAttribute('src'),null);
    assert.deepEqual(errors,[]);
    await page.evaluate(()=>{state.gender='feminino';goToScene('chloe_sai');});
    assert.equal(await page.locator('#scene-char').isVisible(),false);
    console.log('PASS: troca lenta, resposta atrasada após reinício pelo modal, 12 reinícios duplos, limpeza e cena sem personagem.');
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
