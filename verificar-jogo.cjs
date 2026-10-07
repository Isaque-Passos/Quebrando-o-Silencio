// Executa regressões funcionais e zoom real. Os testes antigos foram preservados em revisao/historico.
const {spawnSync}=require('node:child_process');
const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const dir=path.join(__dirname,'revisao','correcoes-2026-10-05');
if(!process.argv.includes('--report-only')) {
  for(const file of ['testar-correcoes.cjs','testar-zoom-real.cjs']) {
    const child=spawnSync(process.execPath,[path.join(__dirname,'revisao',file)],{stdio:'inherit',timeout:180000});
    if(child.error||child.status!==0) { console.error(child.error||`Falha em ${file}`);process.exit(1); }
  }
}
const regression=JSON.parse(fs.readFileSync(path.join(dir,'regressao.json'),'utf8'));
const zoom=JSON.parse(fs.readFileSync(path.join(dir,'zoom-real.json'),'utf8'));
const ok=!regression.fatal&&regression.tests.length===13&&regression.tests.every(t=>t.status==='passed')&&!regression.consoleErrors.length&&zoom.status==='passed'&&zoom.zoom===2;
const hashes=Object.fromEntries(['index.html','game.js','style.css'].map(file=>[file,crypto.createHash('sha256').update(fs.readFileSync(path.join(__dirname,'jogo',file))).digest('hex')]));
const report={date:'2026-10-05',generatedAt:new Date().toISOString(),browser:regression.browser,scope:'Protótipo do capítulo 1: fluxo, regressões, teclado, visual responsivo e zoom real.',status:ok?'approved-for-demonstration':'needs-correction',regression,realBrowserZoom:zoom,sourceHashes:hashes,manualValidation:{screenReader:{status:'not-executed',note:'Texto completo conferido na árvore de acessibilidade; anúncio auditivo em leitor de tela não validado.'}}};
fs.writeFileSync(path.join(__dirname,'jogo','RELATORIO-QA.json'),JSON.stringify(report,null,2));
console.log(`Protótipo: ${report.status}. Regressões: ${regression.tests.filter(t=>t.status==='passed').length}/13. Zoom real: ${zoom.status}. Leitor de tela: validação auditiva pendente.`);
if(!ok) process.exitCode=1;
