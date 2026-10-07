# Uma história de escolhas — capítulo 1

## Abrir o jogo

Extraia o pacote e abra `index.html` no navegador. Mantenha os arquivos e a pasta `assets` juntos. O jogo funciona offline, sem instalação ou servidor. O nome do jogo é provisório.

## Jogar

Clique em Jogar, informe um nome, escolha Feminino ou Masculino e avance. Durante as falas, clique na caixa ou em Mostrar texto para revelar o restante; depois escolha sua resposta. Reiniciar abre uma confirmação. Jogar novamente, no final, começa uma nova sessão. Recarregar a página também volta ao início.

## Correções de 05/10/2026

- Reiniciar cancela esperas pendentes e invalida callbacks da partida anterior.
- A confirmação pausa a digitação e as transições, mantém o fundo inerte e contém o foco do teclado. Cancelar retoma a cena; Escape fecha a confirmação.
- Respostas escolhidas permanecem azuis com texto branco durante o bloqueio de cliques.
- A fala completa possui texto acessível separado da animação visual e é associada ao diálogo; o término automático da digitação não desvia mais o foco.
- Os testes agora distinguem resultados automatizados de verificações manuais ainda não executadas.

## Verificação

13 testes de regressão aprovados no Microsoft Edge 154.0.4258.53: quatro percursos completos nas duas opções, reinício durante seleção e fade, confirmação durante digitação, cancelamento, teclado, cliques repetidos, feedback visual, estrutura acessível, celular e validações. Nenhum erro de JavaScript capturado nesses cenários.

Zoom real de 200% aplicado e confirmado pelo navegador em perfil temporário isolado, com resolução física de 1366 × 768, área CSS de 683 × 384 e escala de pixels 2. Fluxo concluído; início, identificação, introdução, quarto e escola verificados sem rolagem horizontal. Em janelas baixas e com zoom, use rolagem vertical para acessar os controles.

**Pronto para demonstrar o protótipo do capítulo 1.** Isso não é uma certificação completa de acessibilidade: a leitura auditiva com leitor de tela ainda não foi executada. O texto completo foi conferido na árvore de acessibilidade do navegador.

Resultados detalhados em `RELATORIO-QA.json`. O relatório atual substitui a declaração anterior de 15/15 e 100% aprovado. Evidências e relatório anteriores foram preservados na pasta de revisão do projeto.

As capturas antigas com nomes contendo `zoom200` vieram da simulação anterior de janela pequena e não devem ser usadas como prova de zoom real. As evidências atuais usam o prefixo `corrigido-`.

## Conteúdo e artes

Roteiro do capítulo 1 fornecido pela equipe. Direção visual e quatro imagens geradas com a ferramenta integrada de imagens pelo Codex: quarto, entrada da escola, mãe e pai. Origem e prompts completos estão no pacote de design. Os capítulos 2 a 4 estão fora desta demonstração.
