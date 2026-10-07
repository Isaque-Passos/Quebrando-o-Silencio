# Revisão técnica do protótipo — capítulo 1

> Histórico da versão original. As correções posteriores estão registradas em `CORRECOES-APROVACAO-2026-10-05.md`.

Data: 02/10/2026. Escopo: implementação em `jogo/`, comparada à especificação, ao guia visual e às artes fornecidas. Revisão independente por leitura de código e execução local no Microsoft Edge 154.0.4258.48, com rede desativada no contexto de teste. O código do jogo não foi modificado.

## Parecer

**Não recomendar o aceite final ainda.** O fluxo principal funciona e o visual está próximo da referência, mas há duas falhas reproduzidas na interação com o reinício. Também há um desvio no feedback de seleção e problemas na validade de parte dos testes do desenvolvedor.

Os cinco achados abaixo são P2: correções necessárias, com prioridade sobre novos recursos. Os dois primeiros bloqueiam o aceite funcional desta versão. Não foram identificados, nesta revisão, perda persistente de dados, exposição de informações ou falha generalizada que justificasse classificar um achado como P0/P1.

## Achados

### R01 — P2 — Reiniciar não cancela transições pendentes

**Local:** `jogo/game.js`, linhas 562–579; callbacks sem cancelamento nas linhas 388–390, 415–417 e 539–542.

**Reprodução:** na primeira fala, completar o texto e escolher uma resposta; durante o intervalo de transição, abrir “Reiniciar” e confirmar “Recomeçar”. Para reproduzir a janela de forma determinística, o teste acionou os mesmos controles com 20 ms e 50 ms de intervalo depois da escolha. Não alterou diretamente o estado do jogo.

**Esperado:** tela inicial estável, nome e opção limpos, nenhuma cena antiga reaparecendo.

**Observado:** após um segundo, a tela estava novamente na segunda fala do quarto, com `currentSceneId = quarto_fala2`, `playerName = ""` e `gender = null`. A partida prosseguiu com os dados apagados.

**Causa:** o reinício cancela somente `typingTimer`. Os `setTimeout` de seleção e mudança de cenário continuam ativos e podem renderizar uma cena da sessão anterior. Além disso, `goToScene` libera `isTransitioning` antes de concluir o fade.

**Correção recomendada:** controlar e cancelar todos os temporizadores de seleção e transição ao reiniciar; invalidar callbacks de sessões anteriores; manter o bloqueio de transição até concluir a atualização. Definir explicitamente como o botão Reiniciar se comporta durante uma transição.

**Aceite da correção:** repetir o reinício durante a confirmação de resposta e durante a troca quarto/escola. Após aguardar mais que a soma dos atrasos, permanecer no início com estado limpo.

**Evidência:** `evidencias.json`, teste `restart-during-choice-delay`; imagem `reinicio-retorna-dialogo.png`.

### R02 — P2 — O término da digitação retira o foco da confirmação aberta

**Local:** `jogo/game.js`, linhas 394–395 e 420; abertura do modal nas linhas 549–553.

**Reprodução:** iniciar uma fala com animação normal; clicar “Reiniciar” enquanto as letras aparecem; aguardar o término da fala; pressionar Escape.

**Esperado:** foco mantido em “Continuar jogando” ou “Recomeçar” enquanto a confirmação estiver aberta. Escape deve fechar a confirmação.

**Observado:** o foco começou em `btn-cancelar-reinicio`, mas foi movido para uma resposta atrás do modal ao terminar a fala. Escape não fechou a confirmação, porque seu manipulador está ligado ao modal e o foco já estava fora dele. A captura mostra o contorno de foco na resposta de fundo.

**Causa:** a digitação continua enquanto o modal está aberto; `renderDialogueInteractive` foca automaticamente a primeira resposta ou “Próximo”, sem verificar a confirmação. O fundo também não está inerte.

**Correção recomendada:** manter estado explícito de modal aberto, impedir foco fora dele e tornar a área de jogo inerte enquanto a confirmação estiver ativa. Pausar e retomar a digitação ou permitir sua conclusão sem roubar o foco. Garantir retorno do foco ao fechar.

**Aceite da correção:** abrir a confirmação durante qualquer fala e transição, aguardar, navegar com Tab/Shift+Tab e fechar com Escape. Nenhum controle atrás do modal deve receber foco ou ser acionado por teclado.

**Evidência:** `evidencias.json`, teste `modal-during-typing`; imagem `modal-foco-fora.png`.

### R03 — P2 — Resposta selecionada recebe aparência de desabilitada

**Local:** `jogo/style.css`, linhas 223–237; aplicação simultânea dos estados em `jogo/game.js`, linhas 381–384.

**Esperado:** durante a confirmação de aproximadamente 150 ms, resposta escolhida azul com texto branco e marca de seleção, conforme o guia visual.

**Observado:** o botão recebe `is-selected` e `disabled` simultaneamente. A regra de desabilitado vem depois e substitui as cores da seleção. A leitura do estilo confirmou texto cinza (`rgb(89, 97, 107)`) e fundo sem o azul definido para seleção. A marca de seleção aparece, mas o estado visual principal fica incorreto.

**Correção recomendada:** dar prioridade visual explícita ao estado selecionado mesmo com o controle bloqueado, preservando o bloqueio funcional contra múltiplos cliques.

**Aceite da correção:** verificar no navegador o intervalo de confirmação, tanto na introdução quanto nas falas. A resposta escolhida deve permanecer azul/branca, e as demais não devem ser acionáveis.

**Evidência:** `evidencias.json`, teste `choice-feedback`; `teclado-e-feedback.json`, amostragem durante a seleção.

### R04 — P2 — QA-09 falha por uma sequência incorreta de teclado no teste

**Local:** `verificar-jogo.cjs`, linhas 390–394.

**Observado no relatório do dev:** QA-09 aparece como reprovado. O teste presume que, depois de selecionar “Feminino”, Tab deve passar por “Masculino” antes de chegar a “Continuar”.

**Reprodução independente:** usando apenas teclado, depois de selecionar o primeiro rádio, um único Tab já foca `btn-continuar`. O segundo Tab do teste sai desse botão, e o Enter seguinte é aplicado no lugar errado. Com a sequência correta, foi possível alcançar a introdução e a primeira conversa.

**Correção recomendada:** respeitar a navegação nativa do grupo de rádios; validar o elemento focado em cada etapa e usar as setas para alternar opções dentro do grupo. Não modificar o jogo para satisfazer a expectativa incorreta do teste.

**Aceite da correção:** teste de teclado percorre as telas corretamente e adiciona o cenário real de modal durante digitação descrito em R02. A aprovação deve depender do comportamento, não de pausas fixas ou suposições de tabulação.

**Evidência:** `teclado-e-feedback.json`: após selecionar o rádio e pressionar Tab uma vez, foco em `btn-continuar`; depois, introdução e primeira conversa alcançadas.

### R05 — P2 — QA-10 não executa o zoom real de 200% solicitado

**Local:** `verificar-jogo.cjs`, linhas 421–430.

**Observado:** o cenário chamado `zoom200` usa uma janela de 683 × 384 com `deviceScaleFactor: 1`. O teste não altera o zoom do navegador. Portanto, esse resultado e suas capturas não comprovam a verificação de zoom real de 200% exigida na especificação.

**Correção recomendada:** manter a verificação de janela pequena identificada como tal e executar um teste separado com zoom real do navegador, registrando o nível aplicado e a resolução. Avaliar fala, controles, rolagem e acesso ao personagem, sem confundir elemento presente no DOM com elemento utilizável na janela.

**Aceite da correção:** evidência do nível de zoom e execução do fluxo relevante nessa condição; registrar separadamente limitações e resultados. Não atribuir ao jogo uma falha de zoom com base apenas na simulação de largura reduzida.

## O que funcionou na revisão independente

- Abertura direta por arquivo local, com rede do contexto desativada.
- Dois percursos completos do capítulo, um em feminino com animações e outro em masculino com movimento reduzido; escolhas alternadas entre os percursos.
- Falas e concordâncias dos diálogos verificados nesses percursos.
- Encerramento e reinício normal pelo botão “Jogar novamente”, com limpeza do estado.
- Validação de nome vazio, somente espaços e ausência de seleção.
- Nome contendo marcação exibido como texto, sem inserir imagem ou interpretar HTML.
- Artes do jogo idênticas às quatro artes fornecidas, verificadas por hash.
- Composição da escola revisada visualmente em 1366 × 768 e 390 × 844, sem rolagem horizontal nas verificações realizadas.
- Preferência por movimento reduzido respeitada no percurso testado.
- Nenhum erro de JavaScript capturado nos cenários executados. Os defeitos de estado/foco ocorrem sem necessariamente gerar erros no console.

Esses resultados não equivalem a declarar todos os testes QA-01 a QA-15 aprovados.

## Limites e pendências da evidência de QA

O relatório do desenvolvedor disponível ao final da inspeção registra 13 de 15 itens aprovados, com QA-09 e QA-10 reprovados. R04 e R05 mostram por que os testes precisam ser revistos antes de interpretar essas reprovações como defeitos do jogo.

QA-15 foi marcado como aprovado pelo teste do dev ao conferir atributos ARIA e textos de botões. Isso não demonstra leitura assistiva completa. Nesta revisão, o parágrafo da fala tinha nome na árvore de acessibilidade do Edge, mas nenhum filho textual; o snapshot do Playwright omitiu esse nome. Essa diferença, sozinha, não comprova como um leitor de tela vai anunciar a fala. **A leitura real, sem omissão ou duplicação, continua não verificada nesta revisão e precisa ser testada com tecnologia assistiva.** Não classifiquei a ausência no snapshot, isoladamente, como defeito confirmado.

Não foi executado zoom real de 200% nesta revisão. A evidência existente do dev também não cobre esse requisito. Não foram usados os resultados da prévia visual como prova de funcionamento do jogo.

Durante a inspeção, o arquivo de QA do dev recebeu atualização e o relatório consolidado passou a estar disponível. Os três arquivos de implementação abaixo mantiveram os mesmos hashes entre a leitura inicial e a verificação posterior. O parecer refere-se a essa versão.

| Arquivo | SHA-256 |
| --- | --- |
| `jogo/game.js` | `EF8F16173407AF7B92341665BDD166E1F4F9B887F42DAE7352442BEC8D46F514` |
| `jogo/style.css` | `F87911B113E1CC4F4CD2BE405415473E33DEF0B3EEDF58368A83F78A193AAF77` |
| `jogo/index.html` | `874395F74B57DEC4DD5069EC958D5784E307A75C09FEF1B16B195FF0E8297263` |

## Próxima entrega esperada do dev

Corrigir R01 e R02 primeiro, ajustar o feedback R03 e revisar os testes R04/R05. Reexecutar os cenários afetados, o percurso completo, reinício e teclado; anexar relatório com falhas e limitações reais. Confirmar a leitura assistiva antes de aprovar QA-15. Manter roteiro e design atuais, sem expandir funcionalidades.

Arquivos desta revisão: `evidencias.json`, `teclado-e-feedback.json`, `arvore-acessibilidade.json`, capturas PNG e scripts de reprodução em `revisao/`. Todos foram gerados separadamente; não substituem os testes nem alteram o código entregue pelo dev.
