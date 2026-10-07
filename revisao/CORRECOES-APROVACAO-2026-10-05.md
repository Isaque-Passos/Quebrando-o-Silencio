# Correções e liberação para demonstração — 05/10/2026

**Pronto para demonstrar o protótipo do capítulo 1.** Os dois bloqueios funcionais reproduzidos nas revisões anteriores foram corrigidos, assim como o feedback de seleção. Este parecer substitui a situação de implementação descrita nos relatórios anteriores, que permanecem como histórico.

## Correções

- Transições e confirmações de resposta usam uma fila de esperas da sessão. Reiniciar cancela a fila e invalida callbacks antigos; o bloqueio permanece ativo até a cena estar pronta.
- Abrir a confirmação pausa as esperas e a digitação, torna o conteúdo de fundo inerte e mantém o foco dentro do painel. Cancelar retoma a partida e devolve o foco a Reiniciar. Confirmar limpa a sessão.
- O estado selecionado tem prioridade sobre o estado desabilitado: azul, texto branco e marca de escolha permanecem visíveis.
- A fala completa está em um elemento textual acessível associado ao diálogo, separada da animação visual. O término da digitação não rouba o foco do jogador.
- O comando de verificação foi atualizado para executar as regressões relevantes e zoom real. O script e o relatório anteriores foram preservados em `historico/`.

## Evidência

Microsoft Edge 154.0.4258.53. A suíte funcional usa arquivos locais com rede desativada no contexto.

**13/13 testes de regressão aprovados**, incluindo quatro percursos completos, feminino/masculino, animação normal/reduzida, reinício durante seleção e durante fade, cancelamento durante transição, confirmação durante digitação, Escape, Tab/Shift+Tab, cliques repetidos, destaque visual, texto acessível, celular e validação de campos. Nenhum erro de JavaScript capturado.

**Zoom real de 200% aprovado.** Foi aplicado pelo próprio navegador usando `chrome.tabs.setZoom` e confirmado por `chrome.tabs.getZoom` em perfil temporário isolado, sem alterar o perfil pessoal do usuário. Métricas observadas: janela 1366 × 768, viewport CSS 683 × 384 e `devicePixelRatio = 2`. O fluxo chegou ao final e foi reiniciado; cinco telas foram verificadas sem rolagem horizontal e com controles dentro da largura disponível. Em zoom alto, a navegação usa rolagem vertical. As capturas mostram a janela real antes e depois de rolar aos controles, sem simular zoom por redimensionamento.

Capturas atuais e dados brutos em `correcoes-2026-10-05/`. Relatório consolidado e hashes da implementação em `../jogo/RELATORIO-QA.json`.

## Limite da aprovação

Aprovação para demonstração do protótipo, não certificação completa de acessibilidade. A estrutura textual foi conferida na árvore de acessibilidade, mas a leitura auditiva com leitor de tela não foi executada; essa verificação permanece indicada como pendente no relatório e no README. Nenhuma declaração de 100% dos requisitos foi mantida.

## Abrir

Abra `../jogo/index.html` no navegador. Para compartilhar, use `../JOGO-CAPITULO-1-CORRIGIDO.zip`, extraia e abra `jogo/index.html`. As artes, estilos e scripts devem permanecer juntos.
