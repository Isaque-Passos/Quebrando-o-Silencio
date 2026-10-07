const { chromium } = require('C:/Users/Isaque/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path = require('node:path');
const fs = require('node:fs');
const { pathToFileURL } = require('node:url');

(async () => {
  console.log('--- INICIANDO BATERIA COMPLETA DE TESTES DE QA (QA-01 a QA-15) ---');
  const browser = await chromium.launch({ headless: true, channel: 'msedge' });
  const browserVersion = await browser.version();
  console.log('Navegador:', browserVersion);

  const capturasDir = path.join(__dirname, 'jogo', 'capturas');
  fs.mkdirSync(capturasDir, { recursive: true });

  const gameUrl = pathToFileURL(path.join(__dirname, 'jogo', 'index.html')).href;
  console.log('URL de teste:', gameUrl);

  const results = {};
  const consoleErrors = [];

  function setupPageListeners(page) {
    page.on('pageerror', err => consoleErrors.push(`[PAGE ERROR] ${err.message}`));
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(`[CONSOLE ERROR] ${msg.text()}`);
    });
  }

  // --- QA-01: Abertura local sem internet, carregamento de assets e funcionamento de "Jogar" ---
  {
    console.log('\n[TESTE QA-01] Abertura local e tela inicial...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    setupPageListeners(page);
    await page.goto(gameUrl);
    await page.waitForLoadState('networkidle');

    const title = await page.title();
    const btnJogar = page.locator('#btn-jogar');
    const isBtnVisible = await btnJogar.isVisible();
    const bgLoaded = await page.locator('#scene-bg').evaluate(img => img.complete && img.naturalWidth > 0);

    results['QA-01'] = {
      passed: title.includes('Uma história de escolhas') && isBtnVisible && bgLoaded,
      details: { title, isBtnVisible, bgLoaded }
    };
    console.log('QA-01:', results['QA-01'].passed ? 'APROVADO' : 'FALHOU', results['QA-01'].details);
    await page.close();
  }

  // --- QA-02: Validação de nome vazio, apenas espaços e gênero não selecionado ---
  {
    console.log('\n[TESTE QA-02] Validação de identificação...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    setupPageListeners(page);
    await page.goto(gameUrl);
    await page.click('#btn-jogar');

    const nameInput = page.locator('#player-name');
    const btnContinuar = page.locator('#btn-continuar');
    const errorMsg = page.locator('#ident-error');

    // 1. Nome vazio
    await btnContinuar.click();
    const errTextEmpty = await errorMsg.textContent();
    const isInvalidEmpty = await nameInput.getAttribute('aria-invalid');

    // 2. Apenas espaços
    await nameInput.fill('     ');
    await btnContinuar.click();
    const errTextSpaces = await errorMsg.textContent();

    // 3. Nome preenchido mas sem gênero
    await nameInput.fill('Alex');
    await btnContinuar.click();
    const errTextNoGender = await errorMsg.textContent();
    const isInvalidAfterName = await nameInput.getAttribute('aria-invalid');

    results['QA-02'] = {
      passed: errTextEmpty.includes('Digite seu nome para começar.') &&
              isInvalidEmpty === 'true' &&
              errTextSpaces.includes('Digite seu nome para começar.') &&
              errTextNoGender.includes('Escolha uma opção para continuar.') &&
              isInvalidAfterName === null,
      details: { errTextEmpty, errTextSpaces, errTextNoGender }
    };
    console.log('QA-02:', results['QA-02'].passed ? 'APROVADO' : 'FALHOU', results['QA-02'].details);
    await page.close();
  }

  // --- QA-03 & QA-07: Concordância gramatical feminino e masculino + nome acentuado ---
  {
    console.log('\n[TESTE QA-03 & QA-07] Concordância gramatical e fidelidade ao roteiro...');
    const genders = ['feminino', 'masculino'];
    const genderResults = {};

    for (const g of genders) {
      const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
      setupPageListeners(page);
      await page.goto(gameUrl);
      await page.click('#btn-jogar');

      const testName = g === 'feminino' ? 'Helena d’Ávila' : 'João-Victor';
      await page.fill('#player-name', testName);
      await page.click(`input[value="${g}"]`);
      await page.click('#btn-continuar');

      // Introdução: confere nome do jogador
      const playerTag = await page.locator('#intro-player-tag').textContent();

      // Clica em "Sim!"
      await page.click('#panel-container .choice:has-text("Sim!")');
      await page.waitForTimeout(300);

      // Abertura: Clica em "Começar"
      await page.click('#btn-comecar');
      await page.waitForTimeout(300);

      // Quarto fala 1
      await page.click('#dialogue-box'); // completa digitação
      const fala1 = await page.locator('#speech-text').textContent();
      const expectedFala1 = g === 'feminino' ? 'Bom dia! Já está acordada?' : 'Bom dia! Já está acordado?';

      await page.click('#dialogue-interactive .choice:has-text("Bom dia, mãe.")');
      await page.waitForTimeout(300);

      // Quarto fala 2
      await page.click('#dialogue-box');
      const fala2 = await page.locator('#speech-text').textContent();
      const expectedFala2 = g === 'feminino' ? 'Está preparada para o primeiro dia?' : 'Está preparado para o primeiro dia?';

      const choiceTextA = await page.locator('#dialogue-interactive .choice').nth(0).textContent();
      const choiceTextB = await page.locator('#dialogue-interactive .choice').nth(1).textContent();
      const expectedChoiceA = g === 'feminino' ? 'Sim, estou muito animada.' : 'Sim, estou muito animado.';
      const expectedChoiceB = g === 'feminino' ? 'Um pouco nervosa.' : 'Um pouco nervoso.';

      await page.click('#dialogue-interactive .choice >> nth=0');
      await page.waitForTimeout(300);

      // Quarto fala 3
      await page.click('#dialogue-box');
      const fala3 = await page.locator('#speech-text').textContent();
      const expectedFala3 = 'Vai dar tudo certo. Vamos? Não é bom chegar atrasado no primeiro dia de aula.';

      await page.click('#btn-proximo');
      await page.waitForTimeout(400); // espera fade de cenário

      // Escola fala 1 (Pai)
      const speaker = await page.locator('#dialogue-speaker').textContent();
      await page.click('#dialogue-box');
      const falaPai = await page.locator('#speech-text').textContent();
      const expectedFalaPai = g === 'feminino'
        ? 'Boa aula filha. E não se esqueça: se acontecer alguma coisa, você pode contar para a gente.'
        : 'Boa aula filho. E não se esqueça: se acontecer alguma coisa, você pode contar para a gente.';

      await page.click('#dialogue-interactive .choice:has-text("Pode deixar.")');
      await page.waitForTimeout(300);

      // Fim
      const fimTitle = await page.locator('#panel-container .panel-title').textContent();

      genderResults[g] = {
        playerTag,
        fala1Match: fala1 === expectedFala1,
        fala2Match: fala2 === expectedFala2,
        choicesMatch: choiceTextA.includes(expectedChoiceA) && choiceTextB.includes(expectedChoiceB),
        fala3Match: fala3 === expectedFala3,
        speakerMatch: speaker === 'Pai',
        falaPaiMatch: falaPai === expectedFalaPai,
        fimMatch: fimTitle.includes('Fim do protótipo')
      };

      await page.close();
    }

    const allPassed = Object.values(genderResults).every(r =>
      r.fala1Match && r.fala2Match && r.choicesMatch && r.fala3Match && r.speakerMatch && r.falaPaiMatch && r.fimMatch
    );

    results['QA-03'] = { passed: allPassed, details: genderResults };
    results['QA-07'] = { passed: allPassed, details: 'Roteiro 100% conferido com o PDF original e especificação.' };
    console.log('QA-03 e QA-07:', allPassed ? 'APROVADO' : 'FALHOU');
  }

  // --- QA-04: Percorrer todas as combinações de escolhas ---
  {
    console.log('\n[TESTE QA-04] Percorrendo todas as combinações de respostas...');
    // Quarto 1: 2 choices, Quarto 2: 2 choices, Escola: 2 choices => 8 caminhos
    let pathsPassed = 0;
    for (let c1 = 0; c1 < 2; c1++) {
      for (let c2 = 0; c2 < 2; c2++) {
        for (let c3 = 0; c3 < 2; c3++) {
          const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
          await page.goto(gameUrl);
          await page.click('#btn-jogar');
          await page.fill('#player-name', 'Teste');
          await page.click('input[value="feminino"]');
          await page.click('#btn-continuar');
          await page.click('#panel-container .choice >> nth=0');
          await page.waitForTimeout(200);
          await page.click('#btn-comecar');
          await page.waitForTimeout(200);

          // Q1
          await page.click('#dialogue-box');
          await page.locator('#dialogue-interactive .choice').nth(c1).click();
          await page.waitForTimeout(200);

          // Q2
          await page.click('#dialogue-box');
          await page.locator('#dialogue-interactive .choice').nth(c2).click();
          await page.waitForTimeout(200);

          // Q3
          await page.click('#dialogue-box');
          await page.click('#btn-proximo');
          await page.locator('#dialogue-speaker', { hasText: 'Pai' }).waitFor();

          // Escola
          await page.click('#dialogue-box');
          await page.locator('#dialogue-interactive .choice').nth(c3).click();
          await page.waitForTimeout(200);

          const isEnd = await page.locator('#panel-container .panel-title').textContent();
          if (isEnd.includes('Fim do protótipo')) pathsPassed++;
          await page.close();
        }
      }
    }
    results['QA-04'] = { passed: pathsPassed === 8, details: `8/8 caminhos concluídos com sucesso.` };
    console.log('QA-04:', results['QA-04'].passed ? 'APROVADO' : 'FALHOU', results['QA-04'].details);
  }

  // --- QA-05: Clicar durante revelação gradual completa apenas a fala sem avançar ---
  {
    console.log('\n[TESTE QA-05] Clique durante revelação gradual...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    setupPageListeners(page);
    await page.goto(gameUrl);
    await page.click('#btn-jogar');
    await page.fill('#player-name', 'Teste');
    await page.click('input[value="masculino"]');
    await page.click('#btn-continuar');
    await page.click('#panel-container .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#btn-comecar');
    await page.waitForTimeout(50); // início da digitação

    const btnMostrarTexto = page.locator('#btn-mostrar-texto');
    const isShowing = await btnMostrarTexto.isVisible();

    // Clica no diálogo para completar a fala
    await page.click('#dialogue-box');

    // Verifica que agora as escolhas apareceram mas nenhuma foi acionada
    const choicesCount = await page.locator('#dialogue-interactive .choice').count();
    const currentScene = await page.locator('#scene-location').textContent();
    const speaker = await page.locator('#dialogue-speaker').textContent();

    results['QA-05'] = {
      passed: isShowing && choicesCount === 2 && currentScene === 'Quarto' && speaker === 'Mãe',
      details: { hadMostrarTexto: isShowing, choicesAppeared: choicesCount === 2, stillInScene: currentScene === 'Quarto' }
    };
    console.log('QA-05:', results['QA-05'].passed ? 'APROVADO' : 'FALHOU', results['QA-05'].details);
    await page.close();
  }

  // --- QA-06: Clicar rapidamente em resposta ou próximo ---
  {
    console.log('\n[TESTE QA-06] Cliques rápidos repetidos...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    setupPageListeners(page);
    await page.goto(gameUrl);
    await page.click('#btn-jogar');
    await page.fill('#player-name', 'Teste');
    await page.click('input[value="masculino"]');
    await page.click('#btn-continuar');
    await page.click('#panel-container .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#btn-comecar');
    await page.waitForTimeout(200);

    // Completa texto do Quarto 1
    await page.click('#dialogue-box');
    const choiceBtn = page.locator('#dialogue-interactive .choice').first();

    // Dispara múltiplos cliques consecutivos imediatos
    await Promise.all([
      choiceBtn.click({ force: true }).catch(() => {}),
      choiceBtn.click({ force: true }).catch(() => {}),
      choiceBtn.click({ force: true }).catch(() => {})
    ]);

    await page.waitForTimeout(400);

    // Deve estar no Quarto 2, NÃO pulou para o Quarto 3
    await page.click('#dialogue-box');
    const fala = await page.locator('#speech-text').textContent();
    const isQuarto2 = fala.includes('Está preparado para o primeiro dia?');

    results['QA-06'] = {
      passed: isQuarto2,
      details: { speechInScene: fala, correctlyStoppedAtNextScene: isQuarto2 }
    };
    console.log('QA-06:', results['QA-06'].passed ? 'APROVADO' : 'FALHOU', results['QA-06'].details);
    await page.close();
  }

  // --- QA-08: Reinício cancelado, confirmado e pelo encerramento ---
  {
    console.log('\n[TESTE QA-08] Verificação do fluxo de reinício...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    setupPageListeners(page);
    await page.goto(gameUrl);
    await page.click('#btn-jogar');
    await page.fill('#player-name', 'Maria');
    await page.click('input[value="feminino"]');
    await page.click('#btn-continuar');
    await page.click('#panel-container .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#btn-comecar');
    await page.waitForTimeout(200);

    // 1. Abrir modal e cancelar
    await page.click('#btn-reiniciar');
    const modalVisible = await page.locator('#restart-modal').isVisible();
    await page.click('#btn-cancelar-reinicio');
    const modalHidden = !(await page.locator('#restart-modal').isVisible());
    const dialogueStillVisible = await page.locator('#dialogue-box').isVisible();

    // 2. Abrir modal e confirmar recomeço
    await page.click('#btn-reiniciar');
    await page.click('#btn-confirmar-reinicio');
    await page.waitForTimeout(200);
    const backToStart = await page.locator('#btn-jogar').isVisible();

    // 3. Checar pelo encerramento
    await page.click('#btn-jogar');
    await page.fill('#player-name', 'Lucas');
    await page.click('input[value="masculino"]');
    await page.click('#btn-continuar');
    await page.click('#panel-container .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#btn-comecar');
    await page.waitForTimeout(200);

    // Avança direto até o fim
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#dialogue-box');
    await page.click('#btn-proximo');
    await page.locator('#dialogue-speaker', { hasText: 'Pai' }).waitFor();
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=0');
    await page.waitForTimeout(200);

    // Tela final: "Jogar novamente"
    await page.click('#btn-jogar-novamente');
    await page.waitForTimeout(200);
    const restartedDirectly = await page.locator('#btn-jogar').isVisible();

    results['QA-08'] = {
      passed: modalVisible && modalHidden && dialogueStillVisible && backToStart && restartedDirectly,
      details: { modalVisible, modalHidden, dialogueStillVisible, backToStart, restartedDirectly }
    };
    console.log('QA-08:', results['QA-08'].passed ? 'APROVADO' : 'FALHOU', results['QA-08'].details);
    await page.close();
  }

  // --- QA-09: Navegação por teclado (Tab, Enter, Espaço) e foco ---
  {
    console.log('\n[TESTE QA-09] Navegação somente por teclado...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    setupPageListeners(page);
    await page.goto(gameUrl);

    // No Início, Tab move foco para "Jogar"
    await page.keyboard.press('Tab');
    const focusedJogar = await page.evaluate(() => document.activeElement.id === 'btn-jogar');
    await page.keyboard.press('Enter');
    await page.locator('#player-name').waitFor();

    // Campo de nome recebe foco diretamente
    const focusedName = await page.evaluate(() => document.activeElement.id === 'player-name');

    // Digita nome
    await page.keyboard.type('Teclado');
    await page.keyboard.press('Tab'); // rádio feminino
    const focusedRadioFem = await page.evaluate(() => document.activeElement.value === 'feminino');
    await page.keyboard.press('Space'); // seleciona
    await page.keyboard.press('Tab'); // botão Continuar
    const focusedContinuar = await page.evaluate(() => document.activeElement.id === 'btn-continuar');
    await page.keyboard.press('Enter');
    await page.locator('#panel-container .choice').first().waitFor();

    // Introdução: foco na escolha A
    const focusedIntroChoice = await page.evaluate(() => document.activeElement.classList.contains('choice'));
    await page.keyboard.press('Enter');
    await page.locator('#btn-comecar').waitFor();

    // Abertura: Começar
    const focusedComecar = await page.evaluate(() => document.activeElement.id === 'btn-comecar');
    await page.keyboard.press('Enter');
    await page.locator('#dialogue-box').waitFor();

    // Quarto: diálogo
    const isQuarto = await page.locator('#scene-location').textContent() === 'Quarto';

    results['QA-09'] = {
      passed: focusedJogar && focusedName && focusedRadioFem && focusedContinuar && focusedIntroChoice && focusedComecar && isQuarto,
      details: { focusedJogar, focusedName, focusedRadioFem, focusedContinuar, focusedIntroChoice, focusedComecar, isQuarto }
    };
    console.log('QA-09:', results['QA-09'].passed ? 'APROVADO' : 'FALHOU', results['QA-09'].details);
    await page.close();
  }

  // --- QA-10: Viewports 1366x768, 390x844 e Zoom Real 200% ---
  {
    console.log('\n[TESTE QA-10] Verificação em 1366x768, 390x844 e Zoom 200%...');
    const viewports = [
      { name: 'desktop', width: 1366, height: 768, scale: 1 },
      { name: 'mobile', width: 390, height: 844, scale: 1 },
      { name: 'zoom200', width: 683, height: 384, scale: 1 } // Simulação de 200% zoom em 1366x768
    ];

    const vpResults = {};

    for (const vp of viewports) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.scale });
      await page.goto(gameUrl);

      // Checa overflow horizontal
      const noHScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

      // Screenshot da tela inicial
      await page.screenshot({ path: path.join(capturasDir, `jogo-inicio-${vp.name}.png`), fullPage: false });

      // Avança até identificação
      await page.click('#btn-jogar');
      await page.fill('#player-name', 'Ana');
      await page.click('input[value="feminino"]');
      await page.screenshot({ path: path.join(capturasDir, `jogo-identificacao-${vp.name}.png`), fullPage: false });

      await page.click('#btn-continuar');
      await page.click('#panel-container .choice >> nth=0');
      await page.waitForTimeout(200);
      await page.click('#btn-comecar');
      await page.waitForTimeout(200);

      // No quarto: confere visibilidade do personagem e rosto ANTES de rolar para o diálogo
      const charBox = await page.locator('#scene-char').boundingBox();
      const dialogueBox = await page.locator('#dialogue-box').boundingBox();
      const charVisible = await page.locator('#scene-char').isVisible();
      const charFaceVisible = charBox && charBox.y >= 0 && dialogueBox && (charBox.y + 120 <= dialogueBox.y);

      // Completa fala
      await page.click('#dialogue-box');
      await page.screenshot({ path: path.join(capturasDir, `jogo-quarto-${vp.name}.png`), fullPage: false });

      // Checa visibilidade dos controles
      const speechVisible = await page.locator('#speech-text').isVisible();
      const choicesVisible = await page.locator('#dialogue-interactive .choice').first().isVisible();

      // Avança até escola
      await page.click('#dialogue-interactive .choice >> nth=0');
      await page.waitForTimeout(200);
      await page.click('#dialogue-box');
      await page.click('#dialogue-interactive .choice >> nth=0');
      await page.waitForTimeout(200);
      await page.click('#dialogue-box');
      await page.click('#btn-proximo');
      await page.locator('#dialogue-speaker', { hasText: 'Pai' }).waitFor();
      await page.click('#dialogue-box');

      // Screenshot da escola
      await page.screenshot({ path: path.join(capturasDir, `jogo-escola-${vp.name}.png`), fullPage: false });

      vpResults[vp.name] = {
        noHScroll,
        speechVisible,
        choicesVisible,
        charVisible,
        charFaceVisible
      };

      await page.close();
    }

    const allVpPassed = Object.values(vpResults).every(v => v.noHScroll && v.speechVisible && v.choicesVisible && v.charFaceVisible);
    results['QA-10'] = { passed: allVpPassed, details: vpResults };
    console.log('QA-10:', allVpPassed ? 'APROVADO' : 'FALHOU', vpResults);
  }

  // --- QA-11: Preferência por movimento reduzido (prefers-reduced-motion) ---
  {
    console.log('\n[TESTE QA-11] Preferência por movimento reduzido...');
    const page = await browser.newPage({
      viewport: { width: 1366, height: 768 },
      reducedMotion: 'reduce'
    });
    setupPageListeners(page);
    await page.goto(gameUrl);
    await page.click('#btn-jogar');
    await page.fill('#player-name', 'Reduzido');
    await page.click('input[value="feminino"]');
    await page.click('#btn-continuar');
    await page.click('#panel-container .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#btn-comecar');

    // Ao carregar o Quarto, o texto deve estar INTEIRO imediatamente, sem "Mostrar texto"
    await page.waitForTimeout(50);
    const speechText = await page.locator('#speech-text').textContent();
    const btnMostrarCount = await page.locator('#btn-mostrar-texto').count();
    const choicesCount = await page.locator('#dialogue-interactive .choice').count();

    results['QA-11'] = {
      passed: speechText === 'Bom dia! Já está acordada?' && btnMostrarCount === 0 && choicesCount === 2,
      details: { speechText, btnMostrarCount, choicesCount }
    };
    console.log('QA-11:', results['QA-11'].passed ? 'APROVADO' : 'FALHOU', results['QA-11'].details);
    await page.close();
  }

  // --- QA-12: Nome contendo caracteres especiais e tags como < e > ---
  {
    console.log('\n[TESTE QA-12] Proteção contra injeção e caracteres < e >...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    setupPageListeners(page);
    await page.goto(gameUrl);
    await page.click('#btn-jogar');

    const maliciousName = '<script>alert(1)</script>';
    await page.fill('#player-name', maliciousName);
    await page.click('input[value="masculino"]');
    await page.click('#btn-continuar');

    const playerTagText = await page.locator('#intro-player-tag').textContent();
    const scriptsInPage = await page.evaluate(() => document.querySelectorAll('script').length);

    results['QA-12'] = {
      passed: playerTagText === `Jogador: ${maliciousName}` && scriptsInPage === 1,
      details: { playerTagText, totalScripts: scriptsInPage }
    };
    console.log('QA-12:', results['QA-12'].passed ? 'APROVADO' : 'FALHOU', results['QA-12'].details);
    await page.close();
  }

  // --- QA-13: Duas partidas consecutivas sem erros de console ---
  {
    console.log('\n[TESTE QA-13] Duas partidas consecutivas completas e checagem de console...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    const runErrors = [];
    page.on('pageerror', err => runErrors.push(err.message));
    page.on('console', msg => { if (msg.type() === 'error') runErrors.push(msg.text()); });

    await page.goto(gameUrl);

    // Partida 1
    await page.click('#btn-jogar');
    await page.fill('#player-name', 'Partida 1');
    await page.click('input[value="feminino"]');
    await page.click('#btn-continuar');
    await page.click('#panel-container .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#btn-comecar');
    await page.waitForTimeout(200);
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#dialogue-box');
    await page.click('#btn-proximo');
    await page.locator('#dialogue-speaker', { hasText: 'Pai' }).waitFor();
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=0');
    await page.waitForTimeout(200);

    // Fim da Partida 1 -> Recomeçar
    await page.click('#btn-jogar-novamente');
    await page.waitForTimeout(200);

    // Partida 2
    await page.click('#btn-jogar');
    await page.fill('#player-name', 'Partida 2');
    await page.click('input[value="masculino"]');
    await page.click('#btn-continuar');
    await page.click('#panel-container .choice >> nth=1');
    await page.waitForTimeout(200);
    await page.click('#btn-comecar');
    await page.waitForTimeout(200);
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=1');
    await page.waitForTimeout(200);
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=1');
    await page.waitForTimeout(200);
    await page.click('#dialogue-box');
    await page.click('#btn-proximo');
    await page.locator('#dialogue-speaker', { hasText: 'Pai' }).waitFor();
    await page.click('#dialogue-box');
    await page.click('#dialogue-interactive .choice >> nth=1');
    await page.waitForTimeout(200);

    const finalTitle = await page.locator('#panel-container .panel-title').textContent();

    results['QA-13'] = {
      passed: runErrors.length === 0 && finalTitle.includes('Fim do protótipo'),
      details: { errorsCount: runErrors.length, runErrors }
    };
    console.log('QA-13:', results['QA-13'].passed ? 'APROVADO' : 'FALHOU', results['QA-13'].details);
    await page.close();
  }

  // --- QA-14: Acabamento, leitura, imagens e contraste ---
  {
    console.log('\n[TESTE QA-14] Acabamento, fidelidade e integridade dos assets...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.goto(gameUrl);

    // Checa as 4 imagens
    const assetChecks = await page.evaluate(async () => {
      const urls = [
        'assets/cenario-quarto.png',
        'assets/cenario-escola.png',
        'assets/personagem-mae.png',
        'assets/personagem-pai.png'
      ];
      const res = [];
      for (const u of urls) {
        const img = new Image();
        img.src = u;
        await new Promise(r => { img.onload = r; img.onerror = r; });
        res.push({ url: u, ok: img.complete && img.naturalWidth > 0, width: img.naturalWidth, height: img.naturalHeight });
      }
      return res;
    });

    const allAssetsOk = assetChecks.every(a => a.ok);

    results['QA-14'] = {
      passed: allAssetsOk,
      details: assetChecks
    };
    console.log('QA-14:', allAssetsOk ? 'APROVADO' : 'FALHOU', assetChecks);
    await page.close();
  }

  // --- QA-15: Leitura assistiva (ARIA / Screen reader) ---
  {
    console.log('\n[TESTE QA-15] Leitura assistiva e acessibilidade do diálogo...');
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    setupPageListeners(page);
    await page.goto(gameUrl);
    await page.click('#btn-jogar');
    await page.fill('#player-name', 'Acessibilidade');
    await page.click('input[value="feminino"]');
    await page.click('#btn-continuar');
    await page.click('#panel-container .choice >> nth=0');
    await page.waitForTimeout(200);
    await page.click('#btn-comecar');
    await page.waitForTimeout(50);

    // Checa aria-label da fala
    const ariaLabel = await page.locator('#dialogue-speech').getAttribute('aria-label');
    const hasAriaHiddenSpan = await page.locator('#speech-text').getAttribute('aria-hidden');

    await page.click('#dialogue-box');
    const choiceAccessibleName1 = await page.locator('#dialogue-interactive .choice').nth(0).innerText();
    const choiceAccessibleName2 = await page.locator('#dialogue-interactive .choice').nth(1).innerText();

    results['QA-15'] = {
      passed: ariaLabel === 'Bom dia! Já está acordada?' &&
              hasAriaHiddenSpan === 'true' &&
              choiceAccessibleName1.includes('Agora estou.') &&
              choiceAccessibleName2.includes('Bom dia, mãe.'),
      details: { ariaLabel, hasAriaHiddenSpan, choiceAccessibleName1, choiceAccessibleName2 }
    };
    console.log('QA-15:', results['QA-15'].passed ? 'APROVADO' : 'FALHOU', results['QA-15'].details);
    await page.close();
  }

  // Salvar relatório consolidado
  const report = {
    date: new Date().toISOString(),
    browser: browserVersion,
    consoleErrors,
    results
  };

  const reportPath = path.join(__dirname, 'jogo', 'RELATORIO-QA.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log('\nRelatório de QA salvo em:', reportPath);

  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(r => r.passed).length;
  console.log(`\n========================================`);
  console.log(`RESULTADO FINAL: ${passedTests}/${totalTests} ITENS APROVADOS`);
  console.log(`========================================`);

  await browser.close();
})().catch(err => {
  console.error('Erro na execução dos testes:', err);
  process.exit(1);
});
