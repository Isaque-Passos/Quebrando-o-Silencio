const {chromium}=require('C:/Users/Isaque/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {pathToFileURL}=require('node:url');const path=require('node:path');const fs=require('node:fs');
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const p=await b.newPage({viewport:{width:1366,height:768}});const out=[];const f=async(label)=>out.push({label,focus:await p.evaluate(()=>document.activeElement.id||document.activeElement.className)});
try {
await p.goto(pathToFileURL(path.resolve(__dirname,'../jogo/index.html')).href);
await p.keyboard.press('Tab');await f('inicio');await p.keyboard.press('Enter');
await p.locator('#player-name').waitFor();await p.keyboard.type('Teclado');await p.keyboard.press('Tab');await f('primeiro-radio');await p.keyboard.press('Space');await p.keyboard.press('Tab');await f('um-tab-depois-radio');await p.keyboard.press('Enter');
await p.locator('#intro-player-tag').waitFor();await f('introducao');await p.keyboard.press('Enter');await p.locator('#btn-comecar').waitFor();await p.keyboard.press('Enter');await p.locator('#dialogue-box').waitFor({state:'visible'});
await p.waitForFunction(()=>!state.isTyping);await f('quarto-completo');
await p.clock.install();await p.clock.pauseAt(new Date());await p.locator('#dialogue-interactive .choice').first().evaluate(el=>el.click());await p.clock.runFor(140);
out.push({label:'selecao-140ms',style:await p.locator('#dialogue-interactive .choice').first().evaluate(el=>({class:el.className,disabled:el.disabled,bg:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}))});
}catch(e){out.push({error:String(e)})}finally{fs.writeFileSync(path.join(__dirname,'teclado-e-feedback.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out));await b.close();}})();
