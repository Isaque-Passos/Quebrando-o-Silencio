Você é o desenvolvedor responsável por implementar o protótipo jogável do capítulo 1 de um projeto integrador do segundo período.

A engenharia, o roteiro, as imagens e a direção visual já foram preparados. Sua tarefa é transformar esse material em um jogo funcional, reproduzindo o design fornecido e seguindo as regras documentadas. Execute a implementação e a verificação; não encerre a tarefa apenas com um plano.

**1. Objetivo e limite da entrega**

O projeto completo será um jogo educativo para crianças sobre tipos de violência, composto por quatro capítulos. Nesta entrega, implemente exclusivamente o capítulo 1, para apresentação em uma review.

O formato é uma história interativa com cenários ilustrados, personagens em destaque, diálogos e escolhas. Amor Doce é a referência de formato; as artes e a interface deste projeto já foram criadas com identidade própria.

O resultado deve ser enxuto, bem acabado e ter aparência de jogo. Não acrescentar capítulos, situações de violência, explicações pedagógicas, avaliações ou consequências que não constem no roteiro recebido. Este capítulo apresenta a história; não afirmar que ele já valida o aprendizado sobre violência.

**2. Leia os materiais antes de programar**

Pasta original do projeto: C:/Users/Isaque/Desktop/projeto integrador. Se receber o ZIP em outro computador, considere a pasta extraída como raiz e mantenha sua organização.

Consulte, nesta ordem:

- C:/Users/Isaque/Desktop/projeto integrador/design/LEIA-PRIMEIRO.md
- C:/Users/Isaque/Desktop/projeto integrador/ESPECIFICACAO-PROTOTIPO.md
- C:/Users/Isaque/Desktop/projeto integrador/design/GUIA-VISUAL.md
- C:/Users/Isaque/Desktop/projeto integrador/design/PREVIA-VISUAL.html
- C:/Users/Isaque/Desktop/projeto integrador/design/interface.css
- C:/Users/Isaque/Desktop/projeto integrador/design/PROMPTS-E-ORIGEM.md

Abra a prévia no navegador e examine todas as opções de “Visualizar tela”. Consulte também as capturas em C:/Users/Isaque/Desktop/projeto integrador/design/previas.

A especificação define narrativa, fluxo e funcionamento. O guia visual, o CSS e a prévia definem a aparência e prevalecem sobre descrições visuais provisórias anteriores.

O roteiro original está em C:/Users/Isaque/Downloads/Jogo Projeto Integrador.pdf. Se esse PDF não estiver no pacote recebido, use a transcrição integral presente na especificação; não invente conteúdo para preencher supostas lacunas.

A prévia não é o jogo pronto. As 13 opções são referências de telas e estados, incluindo erro, texto aparecendo e confirmação de reinício. Não transforme cada opção em uma etapa obrigatória da história.

**3. Tecnologia e organização**

Use HTML semântico, CSS responsivo e JavaScript puro. A entrega precisa funcionar offline, abrindo o arquivo inicial diretamente no navegador, sem instalação ou servidor.

Crie o jogo em C:/Users/Isaque/Desktop/projeto integrador/jogo, ou na pasta equivalente dentro do pacote extraído. Entregue um index.html, os estilos, os scripts e os recursos locais necessários. Preserve a pasta design e os documentos como referência.

Separe os dados das cenas da lógica de apresentação. Cada cena deve identificar cenário, interlocutor, texto, respostas e destino. Mantenha estado explícito para nome, opção feminino/masculino, cena atual, animação do texto e transição em andamento.

Centralize a troca de cenas. Cancele temporizadores anteriores ao avançar ou reiniciar. Evite eventos duplicados e impeça que cliques rápidos saltem falas.

Use caminhos relativos nos arquivos entregues. Não incorporar caminhos absolutos do seu computador ao funcionamento do jogo. Não depender de fetch para ler o roteiro, importações que exijam servidor, bibliotecas remotas, fontes externas ou CDN.

Não adicionar framework, backend, login, banco de dados, pontuação, inventário, avatar, áudio, salvamento ou publicação online.

**4. Implemente o design fornecido**

As quatro imagens prontas estão em C:/Users/Isaque/Desktop/projeto integrador/design/assets:

- cenario-quarto.png: fundo do quarto.
- cenario-escola.png: fundo da escola.
- personagem-mae.png: mãe, com transparência.
- personagem-pai.png: pai, com transparência.

Copie os recursos necessários para a entrega do jogo. Preserve proporções e transparência. Não substituir as imagens, buscar outras na internet, aplicar filtros, espelhar personagens ou recriar a interface segundo preferência própria.

Reutilize a aparência e os componentes de interface.css. Reproduza cores, fontes, bordas, espaçamentos, etiqueta de interlocutor, botões e composição da prévia. O guia contém as medidas completas.

Mantenha cenário ao fundo, personagem acima dele e caixa de diálogo opaca à frente. O rosto deve continuar visível. Use Trebuchet MS/Arial nas falas e controles e Georgia nos títulos grandes, conforme os estilos fornecidos.

Remova do jogo o seletor “Visualizar tela”, a barra de referência, o rodapé de revisão e os textos internos destinados ao desenvolvedor. O arquivo previa.js serve apenas para consultar o design; implemente a lógica real separadamente.

No computador, aplique a altura de palco final prevista no guia: min(100svh, 810px), mínimo de 620 px e largura máxima de 1440 px. Até 700 px de largura, use a composição móvel definida no CSS: personagem centralizado, caixa com altura conforme o conteúdo e respostas empilhadas. Permita rolagem vertical quando necessária.

Não encolha a tela inteira como uma imagem para fazê-la caber no celular. Ajustes técnicos para eliminar cortes ou garantir acessibilidade devem preservar a identidade visual e ser registrados.

**5. Fluxo obrigatório do capítulo**

Implemente a sequência:

1. Tela inicial: título provisório “Uma história de escolhas”, indicação do capítulo 1 e botão “Jogar”.
2. Identificação: campo de nome e escolha única entre “Feminino” e “Masculino”.
3. Introdução: texto integral da especificação, com as respostas “Sim!” e “Claro!”.
4. Abertura: “CAPÍTULO 1” e botão “Começar”.
5. Quarto: mãe pergunta “Bom dia! Já está acordado(a)?”, com “Agora estou.” e “Bom dia, mãe.”.
6. Quarto: mãe pergunta “Está preparado(a) para o primeiro dia?”, com “Sim, estou muito animado(a).” e “Um pouco nervoso(a).”.
7. Quarto: mãe diz “Vai dar tudo certo. Vamos? Não é bom chegar atrasado no primeiro dia de aula.”, com botão “Próximo”.
8. Portão da escola: pai diz “Boa aula filho(a). E não se esqueça: se acontecer alguma coisa, você pode contar para a gente.”, com “Pode deixar.” e “Eu sei, pai.”.
9. Encerramento: “Fim do protótipo do capítulo 1”, “Os próximos capítulos estão em desenvolvimento.” e “Jogar novamente”.

Todas as alternativas de uma mesma fala conduzem à mesma próxima cena. Não criar ramificações, respostas certas/erradas, reações adicionais ou pontuação.

Preserve a introdução e as falas documentadas. O pai deve aparecer na escola, mesmo que a cena anterior seja com a mãe. Não preencher essa passagem com cenas inventadas.

**6. Nome e concordância**

O nome deve conter de 1 a 30 caracteres após remover espaços das pontas. Aceite acentos, espaços internos e hífens. Não imponha uma restrição arbitrária de “somente letras”. Nome vazio deve mostrar “Digite seu nome para começar.”.

Nenhuma opção feminino/masculino deve vir selecionada. Se o jogador tentar continuar sem escolher, mostre “Escolha uma opção para continuar.”.

Use o nome informado na identificação do jogador durante a introdução. “Alex” é apenas exemplo da prévia. Insira o nome como texto, usando textContent ou mecanismo equivalente, sem interpretá-lo como HTML.

Aplique corretamente acordada/acordado, preparada/preparado, animada/animado, nervosa/nervoso e filha/filho. Não exiba “(a)” literalmente durante o jogo e não altere o restante do roteiro.

**7. Diálogos, escolhas e reinício**

Revele as falas gradualmente, aproximadamente a cada 25 ms por caractere.

Durante a revelação, um clique na área do diálogo ou no botão “Mostrar texto” deve completar somente a fala atual. Esse mesmo evento não pode também escolher uma resposta ou avançar de cena.

Exiba as respostas ou “Próximo” após a fala completa. Ao escolher, mostre o estado visual selecionado por cerca de 150 ms e avance uma única vez. Bloqueie novas ativações enquanto a transição estiver em andamento.

Use fade discreto de aproximadamente 200 ms na mudança de cenário. Não adicione efeitos contínuos ou animações decorativas extras.

“Reiniciar” abre a confirmação visual fornecida. “Continuar jogando” cancela e preserva a partida. “Recomeçar” limpa nome, seleção, progresso e temporizadores, retornando à tela inicial.

No encerramento, “Jogar novamente” faz a limpeza e retorna ao início diretamente. Recarregar a página também inicia uma sessão nova.

**8. Acessibilidade e robustez**

Use controles nativos, rótulos associados aos campos, foco visível e áreas de toque de pelo menos 44 px. Garanta navegação por Tab, Enter e Espaço.

Após cada troca de tela, direcione o foco para o novo título ou diálogo. Na confirmação de reinício, mova o foco para o painel, mantenha-o dentro dele, permita fechar com Escape e devolva o foco ao botão de origem ao cancelar.

A fala completa deve estar disponível para leitores de tela, sem anúncio letra por letra nem leitura duplicada.

Respeite prefers-reduced-motion: texto inteiro imediatamente, transições sem animação e sem espera decorativa.

Mantenha textos legíveis, sem sobreposição ou rolagem horizontal. Uma falha de imagem não deve bloquear a progressão: mantenha o conteúdo legível sobre um fundo de segurança. Na entrega normal, as quatro imagens precisam carregar corretamente.

**9. Verificação antes da entrega**

Execute os itens QA-01 a QA-15 da especificação sobre o jogo implementado. Os testes anteriores da prévia não comprovam o funcionamento do jogo.

Confira especialmente:

- Abertura local e funcionamento sem internet.
- Capítulo completo com ambas as opções feminino/masculino.
- Todas as alternativas de resposta e concordâncias.
- Nome vazio, apenas espaços, acentuado e contendo sinais como < e >.
- Completar texto sem pular fala e clicar rapidamente sem avançar duas cenas.
- Reinício confirmado, cancelado e acionado no encerramento.
- Duas partidas consecutivas sem estado ou temporizadores antigos.
- Navegação por teclado, foco do diálogo de confirmação e leitura assistiva.
- Computador em 1366 × 768, celular em 390 × 844 e zoom real de 200%.
- Preferência por movimento reduzido.
- Imagens carregadas, fidelidade à referência e ausência de erros no console.

Registre navegador e versão, testes executados, resultados e limitações. Reduzir a largura da janela não substitui testar zoom real. Não marque como aprovado um teste que não conseguiu executar.

Corrija falhas encontradas dentro do escopo antes de encerrar. Não entregue com progressão quebrada, texto ilegível ou controles inacessíveis.

**10. Entrega esperada**

Entregue o protótipo completo, as imagens locais, instruções curtas de abertura e um relatório de QA com resultados reais. Inclua capturas do jogo implementado no computador e no celular para comparação com a referência.

Na resposta final, informe onde está o arquivo inicial, como abrir, o que foi implementado, o que foi testado e qualquer pendência concreta.

Prossiga com as decisões já documentadas. Resolva detalhes internos de implementação sem ampliar o escopo. Se existir um bloqueio real ou uma incompatibilidade que impeça atender aos requisitos, explique o ponto específico em vez de redesenhar o projeto ou inventar conteúdo.

A entrega está pronta quando for possível abrir o jogo, concluir o capítulo, fazer as escolhas e reiniciar, com o roteiro preservado e o visual correspondente ao material fornecido.
