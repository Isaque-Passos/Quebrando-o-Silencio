# Revalidação do capítulo 1 — 05/10/2026

> Histórico anterior às correções. Para o estado atual, consulte `CORRECOES-APROVACAO-2026-10-05.md`.

**Resultado: ainda não aprovado para aceite final.** O fluxo principal e a apresentação visual funcionam, mas os dois bloqueios funcionais da revisão anterior continuam reproduzíveis. Nenhum arquivo da implementação foi alterado nesta revalidação.

Verificação independente no Microsoft Edge 154.0.4258.53, abrindo o jogo localmente com rede desativada no contexto. Novas evidências estão na pasta `revalidacao-2026-10-05/`; as evidências anteriores foram preservadas.

| Item anterior | Situação atual | Evidência / ação necessária |
| --- | --- | --- |
| R01 — reinício durante transição | **Não corrigido** | Após escolher, abrir Reiniciar e confirmar dentro do intervalo de transição, reaparece `quarto_fala2` com nome vazio e opção nula. Cancelar todos os callbacks da sessão anterior. |
| R02 — foco sai da confirmação | **Não corrigido** | Abrir Reiniciar durante a digitação e aguardar: o foco sai de `btn-cancelar-reinicio` e vai para uma resposta atrás da janela. Escape não fecha a confirmação. Manter o fundo inerte e impedir foco automático fora do modal. |
| R03 — seleção visual | **Não corrigido** | A escolha recebe `is-selected` junto com `disabled`; a regra de desabilitado sobrescreve o destaque azul/branco. Corrigir a prioridade visual sem liberar cliques repetidos. |
| R04 — teste de teclado | **Corrigido no script** | A sequência agora usa um Tab após selecionar o rádio e verifica o foco em Continuar. Não exige mais passar pelo segundo rádio com Tab. |
| R05 — zoom real | **Não corrigido** | `verificar-jogo.cjs` continua chamando uma janela 683 × 384 com escala 1 de `zoom200`. Executar e documentar zoom real; não declarar essa simulação como validação completa. |

## O que passou novamente

- Dois percursos completos: feminino com animações e masculino com movimento reduzido, usando respostas alternadas.
- Diálogos, concordâncias e encerramento nos percursos testados.
- Reinício normal por Jogar novamente com limpeza do estado.
- Nome vazio, somente espaços, opção ausente e nome com marcação tratado como texto.
- Carregamento offline e composição da escola em 1366 × 768 e 390 × 844, também revisadas visualmente.
- Nenhum erro de JavaScript capturado nos testes executados.

Esses resultados não cobrem todas as combinações possíveis nem constituem aprovação integral de acessibilidade.

## Correção necessária no relatório do dev

O README e o relatório declaram 15/15 e 100% aprovado. Essa conclusão não cobre os cenários de R01/R02, que ainda falham, nem demonstra zoom real e leitura assistiva completa.

O teste de QA-15 continua verificando atributos ARIA e texto dos botões; não executa um leitor de tela. A inspeção da árvore de acessibilidade, isoladamente, também não comprova anúncio correto e único. Marcar essa verificação como pendente até obter evidência adequada. Não foi executado leitor de tela nem zoom real nesta revalidação.

## Devolutiva para o desenvolvedor

Corrija R01, R02 e R03 descritos no parecer anterior. Priorize o cancelamento de transições ao reiniciar e a contenção de foco na confirmação. Preserve roteiro, imagens e design.

Adicione testes de regressão para abrir a confirmação durante a digitação, aguardar seu término, navegar com Tab/Escape e reiniciar durante a confirmação de escolha e o fade. A tela inicial precisa permanecer estável mesmo após todos os atrasos pendentes.

Mantenha a correção do teste de teclado. Execute zoom real de 200%, valide leitura com tecnologia assistiva e atualize README/relatório para distinguir aprovado, reprovado e não executado. Não altere apenas o resultado declarado: registre evidências da implementação corrigida.

## Versão examinada

- `jogo/game.js`: SHA-256 `D5883D70931468EC8C6069F7613DAE60F1D1D0CABCF0B64AEF40DCBC51DE1CD1`.
- `jogo/style.css`: SHA-256 `F87911B113E1CC4F4CD2BE405415473E33DEF0B3EEDF58368A83F78A193AAF77`.
- `jogo/index.html`: SHA-256 `874395F74B57DEC4DD5069EC958D5784E307A75C09FEF1B16B195FF0E8297263`.

Referências de correção: `jogo/game.js:565` (reinício), `jogo/game.js:395` e `:420` (foco automático), `jogo/style.css:233` (estado desabilitado), `verificar-jogo.cjs:425` (simulação de zoom).
