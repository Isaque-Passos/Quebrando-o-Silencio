/**
 * Protótipo jogável do Capítulo 1 — Uma história de escolhas
 * Implementação pura em JavaScript sem dependências externas.
 */

// Estado central da sessão
const state = {
  playerName: '',
  gender: null, // 'feminino' | 'masculino' | null
  currentSceneId: 'inicio',
  isTyping: false,
  isTransitioning: false,
  typingTimer: null,
  isModalOpen: false,
  session: 0,
  previousFocusedElement: null
};

// Todas as esperas pertencem à sessão atual e podem ser pausadas ou canceladas.
const pendingTasks = new Set();
function armTask(task) {
  task.started = performance.now();
  task.timer = setTimeout(() => {
    pendingTasks.delete(task);
    if (task.session === state.session) task.run();
  }, task.remaining);
}
function scheduleTask(run, delay) {
  const task = { run, remaining: delay, session: state.session, timer: null };
  pendingTasks.add(task);
  if (!state.isModalOpen) armTask(task);
}
function pauseTasks() {
  pendingTasks.forEach(task => {
    clearTimeout(task.timer);
    task.remaining = Math.max(0, task.remaining - (performance.now() - task.started));
  });
}
function cancelTasks() {
  state.session++;
  pendingTasks.forEach(task => clearTimeout(task.timer));
  pendingTasks.clear();
}
function focusGame(element) {
  if (!state.isModalOpen && element) element.focus({ preventScroll: true });
}
function selectResponse(button, buttons, next) {
  if (state.isTransitioning || state.isModalOpen) return;
  state.isTransitioning = true;
  buttons.forEach(item => { item.disabled = true; });
  button.classList.add('is-selected');
  const letter = button.querySelector('.letter');
  if (letter) letter.textContent = '✓';
  scheduleTask(() => goToScene(next, true), prefersReducedMotion() ? 0 : 150);
}

// Verificação de preferência por movimento reduzido
function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Utilitário para escapar strings em HTML
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Elementos do DOM
const dom = {
  sceneBg: document.getElementById('scene-bg'),
  sceneLocation: document.getElementById('scene-location'),
  btnReiniciar: document.getElementById('btn-reiniciar'),
  sceneChar: document.getElementById('scene-char'),
  dialogueBox: document.getElementById('dialogue-box'),
  dialogueSpeaker: document.getElementById('dialogue-speaker'),
  dialogueSpeech: document.getElementById('dialogue-speech'),
  speechText: document.getElementById('speech-text'),
  speechAccessible: document.getElementById('speech-accessible'),
  speechCaret: document.getElementById('speech-caret'),
  dialogueInteractive: document.getElementById('dialogue-interactive'),
  dialogueHint: document.getElementById('dialogue-hint'),
  panelContainer: document.getElementById('panel-container'),
  restartModal: document.getElementById('restart-modal'),
  btnCancelarReinicio: document.getElementById('btn-cancelar-reinicio'),
  btnConfirmarReinicio: document.getElementById('btn-confirmar-reinicio')
};

// Definição dos dados das cenas do Capítulo 1
const SCENES = {
  inicio: {
    id: 'inicio',
    type: 'panel',
    background: 'assets/cenario-escola.png',
    location: 'Uma história interativa',
    hasRestart: false,
    render(container) {
      container.innerHTML = `
        <section class="paper-panel" tabindex="-1">
          <p class="eyebrow">Uma história interativa</p>
          <h1 class="game-title">Uma história<br>de <em>escolhas.</em></h1>
          <p class="lead">Conheça pessoas, descubra lugares<br>e decida o que fazer.</p>
          <button type="button" class="primary" id="btn-jogar">Jogar<span aria-hidden="true">→</span></button>
          <p class="chapter-note">CAPÍTULO 1</p>
        </section>
      `;
      const btnJogar = container.querySelector('#btn-jogar');
      btnJogar.addEventListener('click', () => {
        goToScene('identificacao');
      });
      const panel = container.querySelector('.paper-panel');
      panel.focus({ preventScroll: true });
    }
  },

  identificacao: {
    id: 'identificacao',
    type: 'panel',
    background: 'assets/cenario-quarto.png',
    location: 'Uma história interativa',
    hasRestart: false,
    render(container) {
      container.innerHTML = `
        <section class="paper-panel" tabindex="-1">
          <p class="eyebrow">Uma história de escolhas</p>
          <h1 class="panel-title" id="ident-title">Antes de começar...</h1>
          <label class="field-label" for="player-name">Nome</label>
          <input class="name-field" id="player-name" type="text" maxlength="30" placeholder="Como você se chama?" autocomplete="off">
          <p class="error-message" id="ident-error" role="alert" style="display: none;"></p>
          <fieldset>
            <legend>Escolha uma opção</legend>
            <div class="radios">
              <label class="radio-choice">
                <input type="radio" name="gender" value="feminino">Feminino
              </label>
              <label class="radio-choice">
                <input type="radio" name="gender" value="masculino">Masculino
              </label>
            </div>
          </fieldset>
          <button type="button" class="primary" id="btn-continuar">Continuar<span aria-hidden="true">→</span></button>
        </section>
      `;

      const nameInput = container.querySelector('#player-name');
      const errorMsg = container.querySelector('#ident-error');
      const btnContinuar = container.querySelector('#btn-continuar');
      const radios = container.querySelectorAll('input[name="gender"]');

      if (state.playerName) {
        nameInput.value = state.playerName;
      }
      if (state.gender) {
        radios.forEach(r => {
          if (r.value === state.gender) r.checked = true;
        });
      }

      function validateAndSubmit() {
        const trimmed = nameInput.value.trim();
        if (trimmed.length === 0) {
          nameInput.setAttribute('aria-invalid', 'true');
          nameInput.setAttribute('aria-describedby', 'ident-error');
          errorMsg.textContent = 'Digite seu nome para começar.';
          errorMsg.style.display = 'block';
          nameInput.focus();
          return;
        }

        const selectedRadio = container.querySelector('input[name="gender"]:checked');
        if (!selectedRadio) {
          nameInput.removeAttribute('aria-invalid');
          nameInput.removeAttribute('aria-describedby');
          errorMsg.textContent = 'Escolha uma opção para continuar.';
          errorMsg.style.display = 'block';
          radios[0].focus();
          return;
        }

        errorMsg.style.display = 'none';
        nameInput.removeAttribute('aria-invalid');
        nameInput.removeAttribute('aria-describedby');

        state.playerName = trimmed;
        state.gender = selectedRadio.value;
        goToScene('introducao');
      }

      btnContinuar.addEventListener('click', validateAndSubmit);
      nameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          validateAndSubmit();
        }
      });

      nameInput.focus({ preventScroll: true });
    }
  },

  introducao: {
    id: 'introducao',
    type: 'panel',
    background: 'assets/cenario-escola.png',
    location: 'Uma história interativa',
    hasRestart: false,
    render(container) {
      container.innerHTML = `
        <section class="paper-panel narration" tabindex="-1">
          <p class="eyebrow" id="intro-player-tag"></p>
          <h1 class="panel-title">Esta é uma história interativa.</h1>
          <p class="lead">Durante o jogo, você vai acompanhar a rotina de um estudante, conhecer pessoas, explorar diferentes lugares e passar por situações do dia a dia.</p>
          <p class="lead">Mas você não vai apenas assistir à história.<br><strong>Você vai decidir o que fazer.</strong></p>
          <p class="lead">Vamos começar?</p>
          <div class="choices">
            <button type="button" class="choice" data-next="abertura"><span class="letter" aria-hidden="true">A</span>Sim!</button>
            <button type="button" class="choice" data-next="abertura"><span class="letter" aria-hidden="true">B</span>Claro!</button>
          </div>
        </section>
      `;

      // Inserção estrita de texto seguro sem interpretar HTML
      const playerTag = container.querySelector('#intro-player-tag');
      playerTag.textContent = `Jogador: ${state.playerName}`;

      const choiceBtns = container.querySelectorAll('.choice');
      choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          selectResponse(btn, choiceBtns, 'abertura');
        });
      });

      const firstChoice = container.querySelector('.choice');
      if (firstChoice) firstChoice.focus({ preventScroll: true });
    }
  },

  abertura: {
    id: 'abertura',
    type: 'panel',
    background: 'assets/cenario-quarto.png',
    location: 'Quarto',
    hasRestart: false,
    render(container) {
      container.innerHTML = `
        <section class="paper-panel center-panel" tabindex="-1">
          <h1 class="eyebrow">Capítulo</h1>
          <p class="chapter-number">1</p>
          <button type="button" class="primary" id="btn-comecar">Começar<span aria-hidden="true">→</span></button>
        </section>
      `;
      const btnComecar = container.querySelector('#btn-comecar');
      btnComecar.addEventListener('click', () => {
        goToScene('quarto_fala1');
      });
      btnComecar.focus({ preventScroll: true });
    }
  },

  quarto_fala1: {
    id: 'quarto_fala1',
    type: 'dialogue',
    background: 'assets/cenario-quarto.png',
    location: 'Quarto',
    hasRestart: true,
    character: 'assets/personagem-mae.png',
    characterAlt: 'Mãe de blusa verde com expressão acolhedora.',
    speaker: 'Mãe',
    getSpeech(gender) {
      return gender === 'feminino'
        ? 'Bom dia! Já está acordada?'
        : 'Bom dia! Já está acordado?';
    },
    choices: [
      { text: () => 'Agora estou.', next: 'quarto_fala2' },
      { text: () => 'Bom dia, mãe.', next: 'quarto_fala2' }
    ]
  },

  quarto_fala2: {
    id: 'quarto_fala2',
    type: 'dialogue',
    background: 'assets/cenario-quarto.png',
    location: 'Quarto',
    hasRestart: true,
    character: 'assets/personagem-mae.png',
    characterAlt: 'Mãe de blusa verde com expressão acolhedora.',
    speaker: 'Mãe',
    getSpeech(gender) {
      return gender === 'feminino'
        ? 'Está preparada para o primeiro dia?'
        : 'Está preparado para o primeiro dia?';
    },
    choices: [
      {
        text: (gender) => gender === 'feminino' ? 'Sim, estou muito animada.' : 'Sim, estou muito animado.',
        next: 'quarto_fala3'
      },
      {
        text: (gender) => gender === 'feminino' ? 'Um pouco nervosa.' : 'Um pouco nervoso.',
        next: 'quarto_fala3'
      }
    ]
  },

  quarto_fala3: {
    id: 'quarto_fala3',
    type: 'dialogue',
    background: 'assets/cenario-quarto.png',
    location: 'Quarto',
    hasRestart: true,
    character: 'assets/personagem-mae.png',
    characterAlt: 'Mãe de blusa verde com expressão acolhedora.',
    speaker: 'Mãe',
    getSpeech() {
      return 'Vai dar tudo certo. Vamos? Não é bom chegar atrasado no primeiro dia de aula.';
    },
    actionButton: {
      text: 'Próximo',
      next: 'escola_fala1'
    }
  },

  escola_fala1: {
    id: 'escola_fala1',
    type: 'dialogue',
    background: 'assets/cenario-escola.png',
    location: 'Portão da escola',
    hasRestart: true,
    character: 'assets/personagem-pai.png',
    characterAlt: 'Pai de polo azul com expressão acolhedora.',
    speaker: 'Pai',
    getSpeech(gender) {
      return gender === 'feminino'
        ? 'Boa aula filha. E não se esqueça: se acontecer alguma coisa, você pode contar para a gente.'
        : 'Boa aula filho. E não se esqueça: se acontecer alguma coisa, você pode contar para a gente.';
    },
    choices: [
      { text: () => 'Pode deixar.', next: 'fim' },
      { text: () => 'Eu sei, pai.', next: 'fim' }
    ]
  },

  fim: {
    id: 'fim',
    type: 'panel',
    background: 'assets/cenario-escola.png',
    location: 'Portão da escola',
    hasRestart: false,
    render(container) {
      container.innerHTML = `
        <section class="paper-panel center-panel" tabindex="-1">
          <p class="eyebrow">Capítulo 1</p>
          <h1 class="panel-title">Fim do protótipo<br>do capítulo 1</h1>
          <p class="lead">Os próximos capítulos estão em desenvolvimento.</p>
          <button type="button" class="primary" id="btn-jogar-novamente">Jogar novamente<span aria-hidden="true">→</span></button>
        </section>
      `;
      const btnJogarNovamente = container.querySelector('#btn-jogar-novamente');
      btnJogarNovamente.addEventListener('click', () => {
        resetGame();
      });
      btnJogarNovamente.focus({ preventScroll: true });
    }
  }
};

// Completa a revelação do texto imediatamente
function finishTyping() {
  if (!state.isTyping || state.isModalOpen) return;
  if (state.typingTimer) {
    clearInterval(state.typingTimer);
    state.typingTimer = null;
  }
  state.isTyping = false;

  const scene = SCENES[state.currentSceneId];
  if (!scene || scene.type !== 'dialogue') return;

  const fullSpeech = scene.getSpeech(state.gender);
  dom.speechText.textContent = fullSpeech;
  dom.speechCaret.style.display = 'none';

  renderDialogueInteractive(scene);
}

// Renderiza os botões interativos (escolhas ou "Próximo") após fala completa
function renderDialogueInteractive(scene) {
  const restoreChoiceFocus = document.activeElement.id === 'btn-mostrar-texto';
  if (scene.choices) {
    dom.dialogueHint.textContent = 'Sua vez de escolher.';
    dom.dialogueInteractive.innerHTML = `
      <div class="choices">
        ${scene.choices.map((c, i) => `
          <button type="button" class="choice" data-next="${c.next}">
            <span class="letter" aria-hidden="true">${i === 0 ? 'A' : 'B'}</span>${escapeHtml(c.text(state.gender))}
          </button>
        `).join('')}
      </div>
    `;

    const choiceBtns = dom.dialogueInteractive.querySelectorAll('.choice');
    choiceBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectResponse(btn, choiceBtns, btn.dataset.next);
      });
    });

    const firstChoice = dom.dialogueInteractive.querySelector('.choice');
    if (restoreChoiceFocus) focusGame(firstChoice);
  } else if (scene.actionButton) {
    dom.dialogueHint.textContent = 'Continue a história.';
    dom.dialogueInteractive.innerHTML = `
      <div class="actions">
        <button type="button" class="primary" id="btn-proximo" data-next="${scene.actionButton.next}">
          ${escapeHtml(scene.actionButton.text)}<span aria-hidden="true">→</span>
        </button>
      </div>
    `;

    const btnProximo = dom.dialogueInteractive.querySelector('#btn-proximo');
    btnProximo.addEventListener('click', (e) => {
      e.stopPropagation();
      selectResponse(btnProximo, [btnProximo], btnProximo.dataset.next);
    });

    if (restoreChoiceFocus) focusGame(btnProximo);
  }
}

// Inicia o processo de revelação gradual da fala
function startDialogueTyping(scene) {
  const fullSpeech = scene.getSpeech(state.gender);

  // Acessibilidade: disponibiliza a fala completa para leitores de tela
  dom.speechAccessible.textContent = fullSpeech;

  if (prefersReducedMotion()) {
    state.isTyping = false;
    dom.speechText.textContent = fullSpeech;
    dom.speechCaret.style.display = 'none';
    renderDialogueInteractive(scene);
    return;
  }

  state.isTyping = true;
  dom.speechText.textContent = '';
  dom.speechCaret.style.display = 'inline-block';
  dom.dialogueHint.textContent = 'Clique para mostrar a fala inteira.';

  dom.dialogueInteractive.innerHTML = `
    <div class="actions">
      <button type="button" class="quiet" id="btn-mostrar-texto">Mostrar texto</button>
    </div>
  `;

  const btnMostrarTexto = dom.dialogueInteractive.querySelector('#btn-mostrar-texto');
  btnMostrarTexto.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    finishTyping();
  });

  let charIndex = 0;
  const totalChars = fullSpeech.length;
  const SPEED_MS = 25;

  state.typingTimer = setInterval(() => {
    if (state.isModalOpen) return;
    charIndex++;
    if (charIndex >= totalChars) {
      dom.speechText.textContent = fullSpeech;
      finishTyping();
    } else {
      dom.speechText.textContent = fullSpeech.slice(0, charIndex);
    }
  }, SPEED_MS);
}

// Clique na caixa de diálogo completa fala se estiver digitando
dom.dialogueBox.addEventListener('click', (e) => {
  if (state.isTyping) {
    e.preventDefault();
    e.stopPropagation();
    finishTyping();
  }
});

// Renderização central de cenas
function renderScene(scene) {
  // Limpa estados de digitação anteriores
  if (state.typingTimer) {
    clearInterval(state.typingTimer);
    state.typingTimer = null;
  }
  state.isTyping = false;

  // Garante que o scroll inicia no topo da cena
  window.scrollTo(0, 0);

  // Atualiza identificação de local e controle de reinício
  dom.sceneLocation.textContent = scene.location;
  dom.btnReiniciar.style.display = scene.hasRestart ? 'inline-block' : 'none';

  // Atualiza fundo
  if (dom.sceneBg.getAttribute('src') !== scene.background) {
    dom.sceneBg.src = scene.background;
  }

  if (scene.type === 'panel') {
    dom.sceneChar.style.display = 'none';
    dom.dialogueBox.style.display = 'none';
    dom.dialogueInteractive.innerHTML = '';
    dom.speechText.textContent = '';
    dom.speechAccessible.textContent = '';
    dom.panelContainer.style.display = 'block';
    scene.render(dom.panelContainer);
  } else if (scene.type === 'dialogue') {
    dom.panelContainer.style.display = 'none';
    dom.panelContainer.innerHTML = '';

    // Atualiza personagem
    dom.sceneChar.src = scene.character;
    dom.sceneChar.alt = scene.characterAlt;
    dom.sceneChar.style.display = 'block';

    // Configura e exibe caixa de diálogo
    dom.dialogueSpeaker.textContent = scene.speaker;
    dom.dialogueBox.style.display = 'block';
    startDialogueTyping(scene);
    focusGame(dom.dialogueBox);
  }
}

// Controle central de transição de cenas com suporte a fade discreto
function goToScene(nextSceneId, continuing = false) {
  if (state.isModalOpen || (state.isTransitioning && !continuing)) return;
  const currentScene = SCENES[state.currentSceneId];
  const nextScene = SCENES[nextSceneId];
  if (!nextScene) return;

  state.isTransitioning = true;
  const commit = () => {
    state.currentSceneId = nextSceneId;
    state.isTransitioning = false;
    renderScene(nextScene);
    dom.sceneBg.style.opacity = '1';
  };

  const bgChanged = currentScene && currentScene.background !== nextScene.background;
  const shouldFade = bgChanged && !prefersReducedMotion();

  if (shouldFade) {
    dom.sceneBg.style.opacity = '0';
    scheduleTask(commit, 200);
  } else {
    commit();
  }
}

// Modal de confirmação de reinício
function openRestartModal() {
  if (state.isModalOpen) return;
  state.previousFocusedElement = dom.btnReiniciar;
  state.isModalOpen = true;
  pauseTasks();
  dom.restartModal.style.display = 'grid';
  dom.btnCancelarReinicio.focus();
  Array.from(document.getElementById('stage').children).forEach(element => {
    if (element !== dom.restartModal) element.inert = true;
  });
}

function closeRestartModal(resume = true) {
  state.isModalOpen = false;
  Array.from(document.getElementById('stage').children).forEach(element => {
    if (element !== dom.restartModal) element.inert = false;
  });
  dom.restartModal.style.display = 'none';
  if (resume) {
    pendingTasks.forEach(armTask);
    focusGame(state.previousFocusedElement);
  }
  state.previousFocusedElement = null;
}

function resetGame() {
  cancelTasks();
  if (state.typingTimer) {
    clearInterval(state.typingTimer);
    state.typingTimer = null;
  }
  state.playerName = '';
  state.gender = null;
  state.isTyping = false;
  state.isTransitioning = false;

  dom.dialogueInteractive.innerHTML = '';
  dom.speechText.textContent = '';
  dom.speechAccessible.textContent = '';
  dom.dialogueBox.style.display = 'none';
  dom.sceneChar.style.display = 'none';

  closeRestartModal(false);
  dom.sceneBg.style.opacity = '1';
  goToScene('inicio');
}

dom.btnReiniciar.addEventListener('click', () => {
  openRestartModal();
});

dom.btnCancelarReinicio.addEventListener('click', () => {
  closeRestartModal();
});

dom.btnConfirmarReinicio.addEventListener('click', () => {
  resetGame();
});

// Acessibilidade modal: armadilha de foco e tecla Escape
dom.restartModal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    closeRestartModal();
    return;
  }

  if (e.key === 'Tab') {
    const focusable = [dom.btnCancelarReinicio, dom.btnConfirmarReinicio];
    const currentIndex = focusable.indexOf(document.activeElement);

    if (e.shiftKey) {
      if (currentIndex <= 0) {
        e.preventDefault();
        focusable[focusable.length - 1].focus();
      }
    } else {
      if (currentIndex >= focusable.length - 1) {
        e.preventDefault();
        focusable[0].focus();
      }
    }
  }
});

// Inicialização da partida
document.addEventListener('DOMContentLoaded', () => {
  renderScene(SCENES.inicio);
});
