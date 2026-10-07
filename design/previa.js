// Navegação entre pranchas de design; não implementa a lógica do jogo.
const stage = document.querySelector('#stage');
const screen = document.querySelector('#screen');
const primary = (text) => `<button type="button" class="primary">${text}<span aria-hidden="true">→</span></button>`;
const choice = (letter, text, selected = false) => `<button type="button" class="choice${selected ? ' is-selected' : ''}"><span class="letter" aria-hidden="true">${selected ? '✓' : letter}</span>${text}</button>`;
const panel = (body, extra = '') => `<section class="paper-panel ${extra}">${body}</section>`;
const eyebrow = '<p class="eyebrow">Uma história de escolhas</p>';
const scenes = {
  quarto: { who: 'Mãe', text: 'Bom dia! Já está acordado?', choices: ['Agora estou.', 'Bom dia, mãe.'] },
  quarto2: { who: 'Mãe', text: 'Está preparado para o primeiro dia?', choices: ['Sim, estou muito animado.', 'Um pouco nervoso.'] },
  quarto3: { who: 'Mãe', text: 'Vai dar tudo certo. Vamos? Não é bom chegar atrasado no primeiro dia de aula.' },
  escola: { who: 'Pai', text: 'Boa aula filho. E não se esqueça: se acontecer alguma coisa, você pode contar para a gente.', choices: ['Pode deixar.', 'Eu sei, pai.'] }
};
function dialogue(key, variant) {
  const scene = scenes[key];
  const isFather = scene.who === 'Pai';
  let actions = scene.choices ? `<div class="choices">${scene.choices.map((text, i) => choice(i ? 'B' : 'A', text, variant === 'escolha' && i === 1)).join('')}</div>` : `<div class="actions">${primary('Próximo')}</div>`;
  let speech = scene.text;
  if (variant === 'revelando') {
    speech = 'Bom dia! Já está <span class="reveal-caret" aria-hidden="true">▌</span>';
    actions = '<div class="actions"><button type="button" class="quiet">Mostrar texto</button></div>';
  }
  return `<img class="character" src="assets/personagem-${isFather ? 'pai' : 'mae'}.png" alt="${isFather ? 'Pai de polo azul com expressão acolhedora.' : 'Mãe de blusa verde com expressão acolhedora.'}"><section class="dialogue" aria-label="Diálogo"><h2 class="speaker">${scene.who}</h2><p class="speech">${speech}</p>${actions}<p class="hint">${variant === 'revelando' ? 'Clique para mostrar a fala inteira.' : scene.choices ? 'Sua vez de escolher.' : 'Continue a história.'}</p></section>`;
}
function render(key) {
  const known = [...screen.options].some(option => option.value === key);
  if (!known) key = 'quarto';
  screen.value = key;
  const school = ['inicio', 'introducao', 'escola', 'fim'].includes(key);
  const dialogueScene = ['quarto', 'quarto2', 'quarto3', 'escola', 'escolha', 'revelando', 'reiniciar'].includes(key);
  let content = `<img class="background" src="assets/cenario-${school ? 'escola' : 'quarto'}.png" alt=""><div class="scene-bar"><div class="scene-label"><small>CAPÍTULO 1</small><strong>${dialogueScene ? school ? 'Portão da escola' : 'Quarto' : 'Uma história interativa'}</strong></div>${dialogueScene ? '<button type="button" class="quiet">Reiniciar</button>' : ''}</div>`;
  if (dialogueScene) content += dialogue(scenes[key] ? key : 'quarto', key);
  if (key === 'inicio') content += panel('<p class="eyebrow">Uma história interativa</p><h1 class="game-title">Uma história<br>de <em>escolhas.</em></h1><p class="lead">Conheça pessoas, descubra lugares<br>e decida o que fazer.</p>' + primary('Jogar') + '<p class="chapter-note">CAPÍTULO 1</p>');
  if (key === 'identificacao' || key === 'erro') content += panel(eyebrow + '<h1 class="panel-title">Antes de começar...</h1><label class="field-label" for="name">Nome</label><input class="name-field" id="name" type="text" maxlength="30" placeholder="Como você se chama?" ' + (key === 'erro' ? 'aria-invalid="true" aria-describedby="name-error"' : '') + '>' + (key === 'erro' ? '<p class="error-message" id="name-error">Digite seu nome para começar.</p>' : '') + '<fieldset><legend>Escolha uma opção</legend><div class="radios"><label class="radio-choice"><input type="radio" name="gender" value="feminino">Feminino</label><label class="radio-choice"><input type="radio" name="gender" value="masculino">Masculino</label></div></fieldset>' + primary('Continuar'));
  if (key === 'introducao') content += panel('<p class="eyebrow">Jogador: Alex</p><h1 class="panel-title">Esta é uma história interativa.</h1><p class="lead">Durante o jogo, você vai acompanhar a rotina de um estudante, conhecer pessoas, explorar diferentes lugares e passar por situações do dia a dia.</p><p class="lead">Mas você não vai apenas assistir à história.<br><strong>Você vai decidir o que fazer.</strong></p><p class="lead">Vamos começar?</p><div class="choices">' + choice('A', 'Sim!') + choice('B', 'Claro!') + '</div>', 'narration');
  if (key === 'abertura') content += panel('<h1 class="eyebrow">Capítulo</h1><p class="chapter-number">1</p>' + primary('Começar'), 'center-panel');
  if (key === 'fim') content += panel('<p class="eyebrow">Capítulo 1</p><h1 class="panel-title">Fim do protótipo<br>do capítulo 1</h1><p class="lead">Os próximos capítulos estão em desenvolvimento.</p>' + primary('Jogar novamente'), 'center-panel');
  if (key === 'reiniciar') content += '<div class="overlay"><section class="confirmation" role="dialog" aria-modal="true" aria-labelledby="restart-title"><h1 class="panel-title" id="restart-title">Recomeçar o capítulo?</h1><p class="lead">Você vai voltar ao início.</p><div class="actions"><button class="quiet" type="button">Continuar jogando</button><button class="primary" type="button">Recomeçar</button></div></section></div>';
  stage.innerHTML = content;
  stage.dataset.screen = key;
}
screen.addEventListener('change', () => {
  const url = new URL(location.href);
  url.searchParams.set('tela', screen.value);
  history.replaceState(null, '', url);
  render(screen.value);
});
render(new URL(location.href).searchParams.get('tela') || 'quarto');
