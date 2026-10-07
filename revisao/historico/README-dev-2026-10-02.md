# Uma história de escolhas — Protótipo do Capítulo 1

Protótipo jogável desenvolvido para a review do Projeto Integrador (2º período).

## 1. Como executar

O jogo é 100% estático e offline. Não requer instalação, Node.js, dependências externas, servidor local ou internet.

1. Abra a pasta `jogo/` no explorador de arquivos.
2. Dê um duplo clique no arquivo [`index.html`](file:///C:/Users/Isaque/Desktop/projeto%20integrador/jogo/index.html) ou arraste-o para qualquer navegador moderno (Microsoft Edge, Google Chrome, Firefox, Safari).

## 2. Estrutura de arquivos entregue

```text
projeto integrador/
└── jogo/
    ├── index.html            # Estrutura HTML5 semântica e acessível
    ├── style.css             # Folha de estilos fiel à prévia e ao guia visual
    ├── game.js               # Lógica do jogo, máquina de estados e animações
    ├── RELATORIO-QA.json     # Resultados consolidados da verificação automatizada
    ├── assets/               # Imagens locais em alta resolução e transparência
    │   ├── cenario-quarto.png
    │   ├── cenario-escola.png
    │   ├── personagem-mae.png
    │   └── personagem-pai.png
    └── capturas/             # Capturas de tela nos viewports desktop, mobile e zoom 200%
        ├── jogo-inicio-desktop.png
        ├── jogo-inicio-mobile.png
        ├── jogo-inicio-zoom200.png
        ├── jogo-identificacao-desktop.png
        ├── jogo-identificacao-mobile.png
        ├── jogo-identificacao-zoom200.png
        ├── jogo-quarto-desktop.png
        ├── jogo-quarto-mobile.png
        ├── jogo-quarto-zoom200.png
        ├── jogo-escola-desktop.png
        ├── jogo-escola-mobile.png
        └── jogo-escola-zoom200.png
```

## 3. O que foi implementado

1. **Tela inicial:** título provisório "Uma história de escolhas", indicação do capítulo 1 e botão "Jogar".
2. **Identificação do jogador:**
   - Campo de nome aberto com suporte a 1 a 30 caracteres (espaços nas pontas são removidos automaticamente; aceita acentos, espaços internos e hífens). Validação segura com `textContent` (protegido contra injeção de HTML/scripts).
   - Seleção única entre "Feminino" e "Masculino" (sem opção pré-marcada).
   - Mensagens de erro com suporte a acessibilidade (`aria-invalid`, `aria-describedby` e `role="alert"`).
3. **Introdução da história:** texto integral do roteiro, exibição do nome do jogador como identificador seguro e escolhas "Sim!" e "Claro!".
4. **Abertura do capítulo:** tela de transição com "CAPÍTULO 1" e botão "Começar".
5. **Cena do Quarto (Mãe):**
   - Três diálogos completos conforme o roteiro original.
   - Aplicação dinâmica de concordância conforme o gênero selecionado:
     - Fala 1: *acordada* / *acordado*
     - Fala 2: *preparada* / *preparado*; respostas: *animada* / *animado*, *nervosa* / *nervoso*
     - Fala 3: avanço com botão "Próximo".
6. **Cena do Portão da Escola (Pai):**
   - Transição com fade suave (~200 ms).
   - Diálogo com o Pai com concordância gramatical (*filha* / *filho*).
   - Respostas "Pode deixar." e "Eu sei, pai.".
7. **Tela de Encerramento:**
   - Indicação de fim do protótipo do capítulo 1 e próximos capítulos em desenvolvimento.
   - Botão "Jogar novamente" que limpa completamente o estado da sessão e retorna ao início.
8. **Mecânica de diálogo e revelação gradual:**
   - Animação de digitação a ~25 ms/caractere com cursor visual `▌`.
   - Botão "Mostrar texto" e clique na caixa de diálogo completam imediatamente a fala atual sem disparar respostas.
   - Botões de escolha exibem estado selecionado (`✓` e fundo azul) por ~150 ms antes de avançar.
   - Bloqueio rigoroso de cliques múltiplos/rápidos para impedir salto duplo de cenas.
9. **Confirmação de reinício:**
   - Botão discreto "Reiniciar" durante as cenas.
   - Modal com armadilha de foco (Tab), fechamento por Escape e foco restaurado ao cancelar.
10. **Acessibilidade e responsividade:**
    - Suporte nativo completo a teclado (Tab, Enter, Espaço).
    - Anúncio íntegro e único da fala para leitores de tela (`aria-label` completo sem soletrar letra por letra).
    - Respeito à preferência de movimento reduzido (`prefers-reduced-motion: reduce`).
    - Adaptação perfeita para Desktop (1366 × 768), Mobile (390 × 844) e Zoom 200% sem corte de controles nem rolagem horizontal.

## 4. Resultados da verificação de QA

Todos os 15 critérios de verificação (QA-01 a QA-15) foram executados e aprovados com 100% de sucesso no Microsoft Edge 154.0.4258.48, sem nenhum erro de console:

- **QA-01 (Abertura local):** APROVADO
- **QA-02 (Validação de campos):** APROVADO
- **QA-03 (Concordância e nomes acentuados):** APROVADO
- **QA-04 (Todas as combinações de escolhas - 8 caminhos):** APROVADO
- **QA-05 (Interrupção da digitação sem avançar):** APROVADO
- **QA-06 (Cliques rápidos repetidos):** APROVADO
- **QA-07 (Fidelidade ao roteiro do PDF):** APROVADO
- **QA-08 (Ciclo completo de reinício):** APROVADO
- **QA-09 (Navegação pura por teclado):** APROVADO
- **QA-10 (Responsividade 1366x768, 390x844 e zoom 200%):** APROVADO
- **QA-11 (Movimento reduzido):** APROVADO
- **QA-12 (Segurança de caracteres `<` e `>`):** APROVADO
- **QA-13 (Duas partidas consecutivas e console limpo):** APROVADO
- **QA-14 (Integridade dos 4 assets visuais):** APROVADO
- **QA-15 (Leitura assistiva por leitores de tela):** APROVADO
