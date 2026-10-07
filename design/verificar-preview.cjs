const { chromium } = require('C:/Users/Isaque/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1366, height: 850 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const dir = path.join(__dirname, 'previas');
  fs.mkdirSync(dir, { recursive: true });
  const base = pathToFileURL(path.join(__dirname, 'PREVIA-VISUAL.html')).href;
  const checks = [];
  for (const width of [1366, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 850 });
    for (const screen of ['inicio','identificacao','erro','introducao','abertura','quarto','revelando','escolha','quarto2','quarto3','escola','fim','reiniciar']) {
      await page.goto(base + '?tela=' + screen);
      await page.locator('.stage img').first().waitFor();
      await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(img => img.decode())); });
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src),
        stageHeight: document.querySelector('.stage').offsetHeight,
        clippedControls: [...document.querySelectorAll('.stage button, .stage input, .stage .speech')].filter(el => {
          const r = el.getBoundingClientRect(); const s = document.querySelector('.stage').getBoundingClientRect();
          return r.left < s.left - 1 || r.right > s.right + 1 || r.bottom > s.bottom + 1 || r.top < s.top - 1;
        }).map(el => el.textContent || el.id)
      }));
      checks.push({width, screen, ...result});
      if (['inicio','identificacao','quarto','escola'].includes(screen)) await page.locator('.stage').screenshot({path:path.join(dir, `${screen}-${width}.png`)});
    }
  }
  await page.goto(base + '?tela=quarto');
  await page.getByLabel('Visualizar tela').selectOption('escola');
  const navigationWorks = await page.locator('.speaker').textContent() === 'Pai';
  await page.setViewportSize({width:683,height:768});
  await page.goto(base+'?tela=introducao');
  const narrowLayout = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth);
  const report = { browser: await browser.version(), checks, navigationWorks, narrowLayout, errors };
  fs.writeFileSync(path.join(dir,'verificacao.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify(report));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
