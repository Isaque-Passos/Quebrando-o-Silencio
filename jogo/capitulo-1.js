// Seleção de capítulos e continuação do roteiro fornecido pela equipe.
const CHAPTERS = ['O Preço de Não Pertencer', 'O Silêncio de Casa', 'Um Segredo Difícil de Contar', 'Por Trás da Tela'];
SCENES.capitulos = {
  id: 'capitulos', type: 'panel', background: 'assets/cenario-escola.png', hasRestart: false,
  render(container) {
    container.innerHTML = `<section class="paper-panel chapter-panel"><h1 class="panel-title">Capítulos</h1><div class="chapter-list">${CHAPTERS.map((title, i) => `<button class="chapter-card" type="button" ${i ? 'disabled' : ''}><small>Capítulo ${String(i + 1).padStart(2, '0')}</small><strong>${title}</strong><span>${i ? 'Bloqueado' : 'Jogar'}</span></button>`).join('')}</div></section>`;
    const first = container.querySelector('button');
    first.addEventListener('click', () => goToScene('introducao'));
    first.focus({preventScroll: true});
  }
};
const choice = (text, next) => ({text: typeof text === 'function' ? text : () => text, next});
function addScene(id, location, speaker, speech, next, choices, character) {
  SCENES[id] = {id, type: 'dialogue', location, speaker, hasRestart: true,
    background: location.startsWith('Quarto') ? 'assets/cenario-quarto.png' : 'assets/cenario-escola.png',
    character: character ? `assets/personagem-${character}.png` : null,
    characterAlt: speaker,
    getSpeech: typeof speech === 'function' ? speech : () => speech,
    ...(choices ? {choices} : {actionButton: {text: 'Continuar', next}})};
}
SCENES.escola_fala1.choices.forEach(c => c.next = 'sala_dia1_1');

// Primeiro dia na escola e conversa em casa (roteiro completo do Capítulo 1).
addScene('sala_dia1_1', 'Sala de aula · Primeiro dia', 'Mateus', 'Oii! Finalmente chegou! Acabei de chegar também. Quer sentar na frente ou lá no fundo?', null, [choice('Na frente. Quero prestar atenção na aula.', 'sala_dia1_2'), choice('No fundo! Bem mais tranquilo.', 'sala_dia1_2')]);
addScene('sala_dia1_2', 'Sala de aula · Primeiro dia', 'Mateus', 'Você viu que a turma está fazendo uma camisa personalizada? Todo mundo está comprando!', 'sala_dia1_3');
SCENES.sala_dia1_2.actionButton.text = 'Próximo';
addScene('sala_dia1_3', 'Sala de aula · Primeiro dia', 'Mateus', 'Estão anotando os pedidos hoje e precisamos trazer os 150 reais amanhã.', null, [choice('Vou colocar meu nome na lista!', 'sala_dia1_4'), choice('Antes de colocar meu nome, vou pedir aos meus pais.', 'sala_dia1_4')]);
addScene('sala_dia1_4', 'Sala de aula · Primeiro dia', 'Professora', 'Bom dia, pessoal! Vamos começar a aula?', 'quarto_dia1_noite1');
SCENES.sala_dia1_4.actionButton.text = 'Próximo';

addScene('quarto_dia1_noite1', 'Quarto · Noite', 'Mãe', g => g === 'feminino' ? 'E aí, filha, como foi seu primeiro dia de aula?' : 'E aí, filho, como foi seu primeiro dia de aula?', null, [choice('Foi bom, mãe!', 'quarto_dia1_noite2'), choice('Ah, achei mais ou menos.', 'quarto_dia1_noite2')], 'mae');
addScene('quarto_dia1_noite2', 'Quarto · Noite', 'Mãe', 'Não teve nenhuma novidade?', null, [choice('Teve sim! A turma está fazendo uma camisa personalizada!', 'quarto_dia1_noite3'), choice('Ah, teve uma coisa... O pessoal da sala está comprando uma camisa da turma.', 'quarto_dia1_noite3')], 'mae');
addScene('quarto_dia1_noite3', 'Quarto · Noite', 'Mãe', 'Ah, que legal! E quanto custa?', null, [choice('150 reais.', 'quarto_dia1_noite4')], 'mae');
addScene('quarto_dia1_noite4', 'Quarto · Noite', 'Mãe', g => `Nossa, 150 reais? ${g === 'feminino' ? 'Filha' : 'Filho'}, infelizmente este mês não vamos conseguir comprar.`, null, [choice('Ah, tudo bem. Eu queria, mas não tem problema.', 'quarto_dia1_noite5'), choice('Poxa, mas eu queria muito ter uma.', 'quarto_dia1_noite5')], 'mae');
addScene('quarto_dia1_noite5', 'Quarto · Noite', 'Mãe', g => `Eu entendo, ${g === 'feminino' ? 'filha' : 'filho'}. Mas precisamos priorizar outras despesas agora.`, null, [choice('Tudo bem, eu entendo.', 'quarto_dia1_noite6'), choice('Ah, não! Vocês nunca podem comprar nada que eu quero!', 'quarto_dia1_noite6')], 'mae');
addScene('quarto_dia1_noite6', 'Quarto · Noite', 'Mãe', g => `Sei que você está ${g === 'feminino' ? 'chateada' : 'chateado'}, ${g === 'feminino' ? 'filha' : 'filho'}, mas agora realmente não podemos.`, 'sala_camisa', null, 'mae');
SCENES.quarto_dia1_noite6.actionButton.text = 'Próximo';

addScene('sala_camisa', 'Sala de aula · Dia seguinte', 'Chloé', 'Quem ainda não pagou a camisa? Está faltando um pagamento!', null, [choice('Eu não vou conseguir comprar.', 'sala_provocacao'), choice('Ainda não paguei.', 'sala_provocacao'), choice('Ficar em silêncio', 'sala_provocacao')]);
addScene('sala_provocacao', 'Sala de aula · Dia seguinte', 'Chloé', 'Ah, então é você! Não consegue pagar nem uma camisa?', 'professora_entra');
addScene('professora_entra', 'Sala de aula · Dia seguinte', 'Na sala de aula', 'A professora entra e Chloé interrompe a conversa.', 'corredor');
addScene('corredor', 'Corredor · Intervalo', 'Chloé', g => `Então você é ${g === 'feminino' ? 'a bolsista' : 'o bolsista'} da turma? Que engraçado! Agora entendi por que não tem dinheiro para a camisa.`, null, [choice('Me deixa em paz!', 'corredor_resposta'), choice('Não tenho culpa se meus pais não podem comprar.', 'corredor_resposta')]);
addScene('corredor_resposta', 'Corredor · Intervalo', 'Chloé', 'Nossa, que sensível! Só estou falando a verdade.', 'chloe_sai');
addScene('chloe_sai', 'Corredor · Intervalo', 'No corredor', 'Chloé vai embora.', 'patio');
addScene('patio', 'Pátio · Intervalo', 'Mateus', 'Ei, você está bem? A Chloé está pegando no seu pé de novo?', null, [choice('Sim, ela está me humilhando por ser bolsista.', 'mateus_apoio'), choice('Não é nada, deixa pra lá.', 'mateus_reserva')]);
addScene('mateus_apoio', 'Pátio · Intervalo', 'Mateus', 'Isso não é brincadeira! Você deveria contar para alguém.', 'noite');
addScene('mateus_reserva', 'Pátio · Intervalo', 'Mateus', 'Sei... Mas, se precisar, pode contar comigo.', 'noite');
addScene('noite', 'Quarto · Noite', 'Em casa', g => `Os pais percebem que você está ${g === 'feminino' ? 'quieta' : 'quieto'}.`, 'mae_pergunta');
addScene('mae_pergunta', 'Quarto · Noite', 'Mãe', g => `${g === 'feminino' ? 'Filha' : 'Filho'}, aconteceu alguma coisa na escola?`, null, [choice('A Chloé está me fazendo passar vergonha por causa da minha condição financeira.', 'pai_apoio'), choice(g => `Não aconteceu nada, só estou ${g === 'feminino' ? 'cansada' : 'cansado'}.`, 'mae_apoio')], 'mae');
addScene('pai_apoio', 'Quarto · Noite', 'Pai', 'Isso não está certo. Vamos procurar a escola para resolver.', 'professora_percebe', null, 'pai');
addScene('mae_apoio', 'Quarto · Noite', 'Mãe', 'Tudo bem. Mas lembre-se de que pode contar com a gente.', 'professora_percebe', null, 'mae');
addScene('professora_percebe', 'Sala de aula · Outro dia', 'Na sala de aula', 'A professora percebe que você está diferente.', 'professora_pergunta');
addScene('professora_pergunta', 'Sala de aula · Outro dia', 'Professora', 'Está tudo bem? Quer conversar comigo?', null, [choice('Na verdade, estou sofrendo bullying de uma colega.', 'professora_escuta'), choice('Professora, posso conversar com você em particular?', 'professora_escuta')]);
addScene('professora_escuta', 'Sala de aula · Outro dia', 'Professora', 'Claro! Pode me contar o que está acontecendo.', 'relato');
addScene('relato', 'Sala de aula · Outro dia', 'Na sala de aula', 'Você explica a situação.', 'providencias');
addScene('providencias', 'Sala de aula · Outro dia', 'Professora', 'Você fez bem em me contar. Vou tomar as providências necessárias para que isso pare.', 'encerramento');
addScene('encerramento', 'Sala de aula · Encerramento', 'Depois da conversa', 'A professora conversa com Chloé e toma as medidas necessárias para interromper as provocações.', 'fim');

// Artes originais para os novos interlocutores e ambientes.
for (const scene of Object.values(SCENES)) {
 const portraits = {'Chloé':'chloe','Mateus':'mateus','Professora':'professora'};
 if (portraits[scene.speaker]) {scene.character = 'assets/personagem-' + portraits[scene.speaker] + '.png';scene.characterAlt = scene.speaker;}
 const locations = {'Sala de aula':'sala','Corredor':'corredor','Pátio':'patio'};
 for (const [prefix,asset] of Object.entries(locations)) if ((scene.location || '').startsWith(prefix)) scene.background = 'assets/cenario-' + asset + '.png';
}

// Reações ligadas aos acontecimentos, sem alterar o roteiro.
function getPlayerPortrait(scene) {
 const female = state.gender === 'feminino';
 const mood = scene.playerEmotion;
 if (!mood && female) return 'assets/personagem-protagonista-feminina.png';
 const suffix = mood === 'tristeza' ? 'triste' : (female ? 'aliviada' : 'aliviado');
 return 'assets/personagem-protagonista-' + (female ? 'feminina' : 'masculino') + '-' + suffix + '.png';
}
for (const id of ['sala_provocacao','corredor','corredor_resposta']) SCENES[id].character = 'assets/personagem-chloe-provocando.png';
SCENES.professora_entra.character = 'assets/personagem-professora.png';
SCENES.professora_entra.characterAlt = 'Professora entrando na sala de aula';
SCENES.professora_pergunta.character = 'assets/personagem-professora-preocupada.png';
SCENES.providencias.character = 'assets/personagem-professora-firme.png';
SCENES.encerramento.character = 'assets/personagem-chloe-seria.png';
SCENES.encerramento.characterAlt = 'Chloé com expressão séria e desconfortável';
for (const id of ['quarto_dia1_noite4','quarto_dia1_noite5','quarto_dia1_noite6','sala_provocacao','corredor','corredor_resposta','chloe_sai','patio','mateus_reserva','noite','mae_pergunta','mae_apoio','professora_percebe','professora_pergunta','relato']) SCENES[id].playerEmotion = 'tristeza';
for (const id of ['mateus_apoio','pai_apoio','providencias','encerramento']) SCENES[id].playerEmotion = 'alívio';

// A menina é a amiga que oferece apoio, não uma representação do jogador.
for (const id of ['patio', 'mateus_apoio', 'mateus_reserva']) {
 SCENES[id].speaker = 'Júlia';
 SCENES[id].character = 'assets/personagem-julia-carismatica.png';
 SCENES[id].characterAlt = 'Júlia, com sorriso acolhedor e postura confiante';
}
