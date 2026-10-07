# Guia visual — capítulo 1

## Comece pela referência pronta

Abra **PREVIA-VISUAL.html** no navegador. O seletor “Visualizar tela” permite consultar 13 telas e estados. Essa barra superior e o rodapé são ferramentas de apresentação do design e não entram no jogo final. Os botões dentro das cenas são ilustrativos; a programação do fluxo continua a cargo do desenvolvedor.

Esta é a referência de aparência para implementação. Usar as imagens entregues e reutilizar `interface.css`; o dev não precisa escolher paleta, fontes, estilos, recortes ou posicionamento. Para aparência, este guia, o CSS e a prévia substituem as orientações visuais provisórias da especificação anterior. O roteiro e as regras de interação continuam em `../ESPECIFICACAO-PROTOTIPO.md`.

O nome “Uma história de escolhas” é provisório. A identidade foi criada com elementos próprios: azul escolar, tons de papel, ambientes brasileiros cotidianos e etiqueta de diálogo com detalhe amarelo. A referência a Amor Doce se limita ao formato de visual novel, com personagens sobre cenários e escolhas de fala. Não foram incorporadas imagens, personagens, logotipo ou elementos de interface extraídos daquele jogo.

## Arquivos de arte

| Arquivo em `assets/` | Dimensões reais | Formato | Aplicação |
| --- | --- | --- | --- |
| `cenario-quarto.png` | 1672 × 941 px | PNG RGB, opaco | Identificação, abertura do capítulo e conversas com a mãe |
| `cenario-escola.png` | 1672 × 941 px | PNG RGB, opaco | Tela inicial, introdução, conversa com o pai e encerramento |
| `personagem-mae.png` | 1024 × 1536 px | PNG RGBA, transparência real | Todas as falas da mãe, mesma expressão acolhedora |
| `personagem-pai.png` | 1024 × 1536 px | PNG RGBA, transparência real | Fala do pai no portão |

As quatro imagens foram geradas com a ferramenta integrada de imagens. Os prompts completos e as referências consultadas estão em `PROMPTS-E-ORIGEM.md`. Não houve edição manual das imagens após a geração. Preservar o canal de transparência dos personagens e a proporção de todos os arquivos. O personagem é uma camada separada: nunca fundi-lo ao cenário ou gravar textos nas imagens. Não usar filtros de cor, contornos externos, espelhamento ou alongamento dos retratos.

### Personagens

- **Mãe:** adulta, pele morena, cabelo castanho ondulado, presilha azul, blusa verde suave e calça azul. A mão aberta acompanha a fala acolhedora.
- **Pai:** adulto, pele morena, cabelo curto, barba, camisa polo azul e mochila. Expressão tranquila durante a despedida.
- O protagonista permanece como ponto de vista do jogador. Não criar avatar ou personagem adicional para este capítulo.

### Cenários

- **Quarto:** luz da manhã, cama à esquerda, mesa de estudos junto à janela, mochila e porta à direita. A mãe ocupa a área direita sem esconder todo o ambiente.
- **Escola:** portão azul aberto, arquitetura escolar brasileira, mural abstrato e árvores. O pai permanece à direita no computador e centralizado no celular.

## Cores e tipografia

| Elemento | Valor obrigatório |
| --- | --- |
| Papel / caixa de diálogo | `#FFF8ED` |
| Texto principal | `#25344A` |
| Botão principal / etiqueta de nome / borda de diálogo | `#345C8C` |
| Botão principal sob o ponteiro | `#24466E` |
| Resposta sob o ponteiro / seleção de formulário | `#D9E8D5` |
| Detalhe da etiqueta e abas | `#F2C66D` |
| Texto de ajuda | `#536174` |
| Erro de formulário | `#9B3535` |
| Corpo / diálogos / controles | `"Trebuchet MS", Arial, sans-serif` |
| Título do jogo e títulos grandes de telas | `Georgia, "Times New Roman", serif` |

Sem fontes externas: a entrega funciona offline. Não usar Georgia nas falas ou respostas. O amarelo é um detalhe, não cor de texto sobre fundo claro.

## Composição no computador

Os valores completos estão no CSS. A referência foi capturada em uma janela de 1366 × 850 px, com palco de 1366 × 788 px, pois a barra de revisão ocupa 62 px.

No **jogo final**, remover a barra de revisão e seu rodapé. Ajustar somente a altura do palco para `min(100svh, 810px)`; manter `min-height: 620px`, largura máxima de 1440 px e centralização. Em telas maiores, o espaço exterior usa fundo discreto `#E8E7DF`. Em telas de menor altura, permitir rolagem em vez de cortar controles.

| Camada / componente | Medidas e posição |
| --- | --- |
| Cenário | Preenche todo o palco, `object-fit: cover`, centralizado |
| Identificação de capítulo e local | 32 px da esquerda, 24 px do topo, papel claro com aba amarela |
| Reiniciar | 32 px da direita, 24 px do topo, altura mínima 44 px |
| Personagem | Altura 98% do palco; proporção preservada; direita 10%; base em −7% |
| Caixa de diálogo | 32 px das laterais, 28 px da base, borda azul de 2 px, fundo opaco |
| Cantos da caixa | 4 px no superior esquerdo; 22 px nos outros |
| Espaço interno da caixa | 32 px no topo, 28 px nas laterais, 20 px na base |
| Etiqueta de interlocutor | 26 px da esquerda; 22 px acima da caixa; detalhe amarelo deslocado 4 px |
| Texto de fala | 22 px, entrelinha 1,45; margem inferior de 18 px |
| Respostas | Duas colunas iguais, intervalo 12 px, altura mínima 52 px |
| Texto de resposta | 17 px, entrelinha 1,4, alinhado à esquerda |
| Botão principal | Altura mínima 52 px, raio 12 px, azul com texto branco |
| Painel das telas iniciais | 480 px de largura; esquerda 6%; centro vertical; espaço interno 42 px |
| Título do jogo | 60 px, Georgia, entrelinha 1,04; palavra “escolhas” em itálico azul |

O cenário fica atrás do personagem; ambos ficam atrás do diálogo. Sombras são discretas. Nenhuma decoração deve competir com o rosto ou a leitura.

## Composição no celular

Aplicar as regras do CSS em larguras de até 700 px. A referência de celular foi conferida em 390 × 844 px. Não reduzir a tela inteira como uma imagem.

- Palco com altura automática e mínimo de 720 px; a página pode rolar.
- Etiqueta de local e reiniciar a 16 px das bordas e do topo.
- Personagem com altura de 540 px, centralizado, topo a 70 px.
- Caixa de diálogo no fluxo da página, começando com margem superior de 400 px; laterais de 14 px.
- Caixa cresce conforme o texto; espaço interno de 30 px no topo, 18 px nas laterais e na base.
- Fala em 18 px; respostas em 16 px, uma abaixo da outra, intervalo de 10 px.
- Painéis iniciais usam largura disponível, margens laterais de 20 px e espaço interno de 26 a 30 px.
- A introdução mantém “Sim!” e “Claro!” lado a lado porque os textos são curtos.

Não esconder o rosto do personagem para caber mais cenário. Não impor altura fixa ao diálogo. Manter a ordem de leitura: local, pessoa, fala, respostas.

## Estados e comportamento visual

| Estado | Aparência |
| --- | --- |
| Resposta normal | Fundo quase branco, borda azul, texto escuro, letra A/B em bloco verde |
| Ponteiro sobre resposta | Fundo verde suave; geometria permanece igual |
| Resposta selecionada | Fundo azul, texto branco e marca de seleção no bloco da letra |
| Foco pelo teclado | Contorno azul de 3 px, afastado 4 px |
| Desabilitado | Fundo `#E4E4DF`, texto `#59616B`, cursor indisponível; usar atributo `disabled` |
| Nome inválido | Borda vermelha de 2 px e mensagem “Digite seu nome para começar.” abaixo do campo |
| Texto sendo revelado | Fala parcial e botão “Mostrar texto”; escolhas ainda ausentes |
| Reinício | Fundo escurecido, painel de até 440 px, ações “Continuar jogando” e “Recomeçar” |

A prévia mostra esses estados, mas não executa o fluxo do jogo. Na implementação, usar 25 ms por caractere, 150 ms de confirmação de resposta e 200 ms na troca de cenário. Se o usuário preferir movimento reduzido, revelar o texto inteiro e remover as animações. O texto acessível deve ser anunciado por fala, não por letra.

O diálogo de reinício do jogo precisa receber foco ao abrir, conter o foco enquanto estiver aberto, fechar com Escape e devolver o foco ao botão que o abriu. A prévia apresenta somente seu aspecto visual.

## Mapa das telas

1. **Tela inicial:** escola ao fundo, painel à esquerda, título provisório e “Jogar”.
2. **Identificação:** quarto ao fundo, nome, opções feminino/masculino e “Continuar”.
3. **Erro de identificação:** mesmo painel, destacando somente o campo inválido.
4. **Introdução:** texto do PDF no painel de leitura e escolhas “Sim!” / “Claro!”. “Alex” é apenas nome de exemplo da prévia.
5. **Abertura:** painel central com “Capítulo 1” e “Começar”.
6. **Quarto / mãe:** fala inicial e duas respostas.
7. **Texto aparecendo:** exemplo estático do estado de revelação gradual.
8. **Resposta selecionada:** exemplo estático da confirmação de “Bom dia, mãe.”.
9. **Segundo diálogo:** preparação para o primeiro dia e respostas.
10. **Avançar diálogo:** despedida no quarto, com “Próximo”.
11. **Escola / pai:** mudança de cenário e personagem, com duas respostas.
12. **Fim:** painel central indicando encerramento do protótipo e “Jogar novamente”.
13. **Reiniciar:** sobreposição de confirmação sobre a cena em andamento.

As falas de amostra estão no masculino. O jogo deve aplicar a concordância conforme a opção escolhida pelo jogador, como especificado no documento principal.

## Conferência de qualidade desta entrega

- Quatro imagens copiadas para o projeto, com dimensões e transparência inspecionadas.
- Prévia aberta localmente no Microsoft Edge 154.0.4258.48, sem servidor e sem dependências externas.
- 13 telas/estados verificados em duas larguras: 1366 e 390 px, totalizando 26 verificações de layout.
- Nenhuma imagem quebrada, rolagem horizontal, fala ou controle fora dos limites do palco nesses testes.
- Seletor de tela verificado: muda a cena e o interlocutor corretamente.
- Composição do quarto, escola, tela inicial e identificação revisada visualmente por capturas do navegador.
- Nenhum erro de execução ou console detectado durante as verificações.
- Contraste calculado: texto principal/papel 11,93:1; branco/azul 6,87:1; ajuda/papel 5,98:1; erro/papel 6,74:1; texto/verde 9,86:1.

Essas verificações são da referência de design. Os testes de progressão da história, concordância, reinício real, bloqueio de cliques repetidos, leitor de tela e zoom no jogo final continuam pendentes da implementação. A conferência adicional em 683 px foi de largura reduzida, não um teste de zoom a 200%.

## Entrega ao desenvolvedor

1. Abrir `PREVIA-VISUAL.html` e consultar cada opção do seletor.
2. Usar os quatro PNGs de `assets/` sem substituí-los por imagens provisórias.
3. Reaproveitar os componentes e valores de `interface.css`; retirar apenas a barra e o rodapé da revisão e ajustar a altura do palco conforme este guia.
4. Implementar as cenas e regras do documento principal; `previa.js` é somente navegação de referências e não é a lógica do jogo.
5. Comparar o resultado com as capturas de `previas/` e executar o checklist de QA do documento principal.

Alterações de aparência devem ser discutidas com o responsável pelo projeto; não trocar a identidade visual durante a implementação por preferência do desenvolvedor.
