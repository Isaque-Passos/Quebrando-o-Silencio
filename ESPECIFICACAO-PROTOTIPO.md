# Protótipo do capítulo 1 — Projeto Integrador

## Objetivo e responsabilidades

Entregar ao desenvolvedor a especificação de um protótipo jogável no navegador para a review do projeto do segundo período. O jogo educativo terá quatro capítulos e abordará tipos de violência para crianças. Somente o capítulo 1 está disponível e entra nesta entrega.

A experiência tem como referência o formato de história interativa de Amor Doce: cenários, personagens, diálogos e escolhas. O visual deve ter identidade própria.

Codex: engenharia, especificação e critérios de qualidade e testes. Implementação: outro desenvolvedor, conforme definido pelo responsável pelo projeto. Este documento não representa uma implementação nem testes já executados. O significado e o alcance específicos de “QO” ainda precisam ser alinhados.

Fonte narrativa: `C:/Users/Isaque/Downloads/Jogo Projeto Integrador.pdf`, com uma página. O PDF define as falas; as decisões de funcionamento abaixo completam as lacunas necessárias para demonstrá-las.

## Escopo aprovado

- HTML, CSS e JavaScript, executados no navegador.
- Protótipo navegável do capítulo 1, com aparência de jogo e escopo enxuto.
- Tela inicial com “Jogar”, nome do jogador e escolha feminino/masculino.
- Abertura do capítulo, quarto e entrada da escola ilustrados.
- Personagem em destaque durante as conversas.
- Caixa de diálogo com identificação de quem fala, revelação gradual do texto e possibilidade de mostrar a fala inteira com um clique.
- Botões de escolha, avanço, transições discretas e reinício.

Não fazem parte desta versão: capítulos 2 a 4, login, servidor, banco de dados, pontuação, inventário, criação de avatar, áudio ou salvamento entre sessões. O capítulo recebido ainda não contém uma situação explícita de violência; o protótipo demonstra a apresentação e a interação, sem alegar validar o aprendizado sobre o tema.

## Direção visual para implementação

**Atualização de 02/10/2026:** o responsável pelo projeto atribuiu a criação das imagens e a definição do design ao Codex. O pacote visual foi entregue em `design/`, com quatro imagens próprias, prévia de 13 telas/estados e CSS de referência. Abrir [a prévia visual](design/PREVIA-VISUAL.html) e seguir [o guia visual](design/GUIA-VISUAL.md). Esses arquivos são a referência principal de aparência e substituem as indicações provisórias desta seção em caso de diferença. O dev implementa o visual fornecido; não fica responsável por inventar o design.

Acabamento definido: ilustração 2D acolhedora, ambiente escolar cotidiano e cores suaves. Usar os cenários e retratos de `design/assets/`, mantendo proporções e transparência. Origem e prompts estão registrados em `design/PROMPTS-E-ORIGEM.md`. Não substituir as imagens por recursos de Amor Doce.

| Cor | Valor | Uso |
| --- | --- | --- |
| Papel | `#FFF8ED` | Caixa de diálogo e superfícies de leitura |
| Tinta | `#25344A` | Textos e contornos |
| Azul escolar | `#345C8C` | Botão principal e nome de quem fala |
| Verde suave | `#D9E8D5` | Superfícies secundárias |
| Amarelo caderno | `#F2C66D` | Pequenos detalhes decorativos |

Usar `"Trebuchet MS", Arial, sans-serif` em falas, nomes e controles. Títulos grandes usam `Georgia, "Times New Roman", serif`, conforme o guia visual. Falas em peso normal, 22 px no computador e 18 px no celular. Amarelo e verde são fundos ou detalhes, sempre com texto escuro.

A assinatura visual será a etiqueta de nome semelhante a uma aba de caderno, presa à caixa de diálogo. Evitar painéis, contadores e elementos decorativos sem função.

### Composição da cena

- Cenário ocupa o palco principal; retrato da mãe ou do pai fica acima da caixa de diálogo, com rosto visível.
- Caixa de diálogo na parte inferior, com fundo opaco para garantir leitura.
- Nome de quem fala em uma pequena etiqueta; texto abaixo; respostas logo depois do texto.
- Reiniciar fica em posição discreta e acessível.
- No celular, a caixa cresce conforme o conteúdo e as escolhas ficam empilhadas. Não cortar texto para manter a proporção do palco; permitir rolagem vertical quando necessário.
- Troca de cenário com fade curto, de aproximadamente 200 ms. Sem movimento contínuo de elementos. Respeitar a preferência por movimento reduzido.

## Fluxo e roteiro

As duas respostas de cada diálogo seguem para a mesma cena seguinte: o PDF não especifica ramificações ou consequências. Não acrescentar reações, pontos ou falas. Mostrar brevemente a escolha selecionada antes de avançar, para que a interação seja perceptível.

| Etapa | Conteúdo | Ação e destino |
| --- | --- | --- |
| Início | Título provisório “Uma história de escolhas” e subtítulo “Capítulo 1”. O título é sugestão, não nome definitivo aprovado. | “Jogar” abre a identificação. |
| Identificação | “Nome”, campo de resposta aberta; opções “Feminino” e “Masculino”. | “Continuar” abre a introdução após preencher nome e selecionar uma opção. |
| Introdução | Texto integral abaixo, sem personagem falando. | “Sim!” ou “Claro!” abre a apresentação do capítulo. |
| Abertura | “CAPÍTULO 1” sobre o cenário do quarto. | “Começar” abre a primeira conversa. |
| Quarto — fala 1 | Mãe: “Bom dia! Já está acordado(a)?” | “Agora estou.” ou “Bom dia, mãe.” → fala 2. |
| Quarto — fala 2 | Mãe: “Está preparado(a) para o primeiro dia?” | “Sim, estou muito animado(a).” ou “Um pouco nervoso(a).” → fala 3. |
| Quarto — fala 3 | Mãe: “Vai dar tudo certo. Vamos? Não é bom chegar atrasado no primeiro dia de aula.” | “Próximo” → portão da escola. |
| Portão da escola | Pai: “Boa aula filho(a). E não se esqueça: se acontecer alguma coisa, você pode contar para a gente.” | “Pode deixar.” ou “Eu sei, pai.” → encerramento da demonstração. |
| Encerramento | “Fim do protótipo do capítulo 1” e “Os próximos capítulos estão em desenvolvimento.” | “Jogar novamente” volta à tela inicial e limpa a sessão. |

Texto da introdução, conforme o PDF:

> Esta é uma história interativa.
>
> Durante o jogo, você vai acompanhar a rotina de um estudante, conhecer pessoas, explorar diferentes lugares e passar por situações do dia a dia.
>
> Mas você não vai apenas assistir à história.
>
> Você vai decidir o que fazer.
>
> Vamos começar?

A tela inicial, os botões de ligação entre telas e o encerramento são complementos de interface para a demonstração; não são conteúdo adicional do roteiro. O cenário do portão mantém o pai como interlocutor, conforme o documento, mesmo que a fala anterior seja da mãe.

## Regras de interação

1. O nome deve ter entre 1 e 30 caracteres após remover espaços das pontas. Aceitar acentos, espaços e hífens. Nome vazio mostra “Digite seu nome para começar.” Não usar o nome para inventar novas falas; exibi-lo como identificação do jogador na introdução.
2. Feminino e masculino são opções de seleção única, sem opção marcada inicialmente. Se faltar uma seleção, mostrar “Escolha uma opção para continuar.”
3. Adaptar os termos com “(a)” à opção escolhida: acordada/acordado, preparada/preparado, animada/animado, nervosa/nervoso e filha/filho. Não mostrar “(a)” literalmente na partida.
4. Revelar o texto gradualmente, em ritmo curto de aproximadamente 25 ms por caractere. Um clique na área do diálogo ou no botão “Mostrar texto” completa a fala atual, sem pular para a próxima.
5. Exibir escolhas e “Próximo” quando a fala estiver completa. Cada escolha ou avanço funciona uma única vez por cena, inclusive sob cliques rápidos.
6. Mostrar a seleção de resposta por aproximadamente 150 ms antes de seguir. Com movimento reduzido, apresentar as falas completas e trocar cenas sem fade ou espera decorativa.
7. “Reiniciar” durante a partida pede confirmação breve (“Recomeçar o capítulo?”). Cancelar preserva a cena; confirmar apaga nome, seleção e progresso e retorna ao início. No encerramento, “Jogar novamente” reinicia diretamente.
8. Recarregar a página retorna ao início. Não há promessa de salvar progresso neste protótipo.
9. Todos os controles funcionam por teclado, com foco visível, rótulos claros e botões de pelo menos 44 px de altura. Após trocar de tela, posicionar o foco no título ou diálogo novo.
10. A animação de texto não deve fazer leitores de tela anunciarem letra por letra: disponibilizar a fala completa como texto acessível, sem duplicar sua leitura.

## Orientação técnica ao desenvolvedor

Usar HTML semântico, CSS responsivo e JavaScript puro, sem framework ou etapa obrigatória de compilação. Organizar inicialmente em `index.html`, `styles.css`, `script.js` e uma pasta `assets` com dois cenários e dois retratos de personagens. Reutilizar as artes e as regras de aparência fornecidas em `design/`; o JavaScript da prévia é apenas um seletor de telas de referência, não a implementação do jogo.

Manter as cenas e respostas em uma estrutura de dados separada da função que atualiza a interface. Cada cena precisa de identificador, cenário, interlocutor, fala, respostas e destino. O estado da sessão contém nome, opção feminino/masculino, cena atual e estado da animação do texto.

Uma função central deve controlar a mudança de cena e cancelar a animação anterior. Usar inserção de texto segura (`textContent`) para o nome informado, sem interpretá-lo como HTML. Os recursos visuais devem usar caminhos relativos e estar incluídos na entrega.

Para facilitar a apresentação, o protótipo deve funcionar ao abrir `index.html` no navegador, sem instalação. Evitar carregamento de roteiro por `fetch`, importações por módulos ou dependências externas que exijam servidor. Também poderá ser hospedado como site estático depois.

Entregar os arquivos completos, créditos dos recursos visuais e instruções curtas de abertura. Uma imagem ausente não pode impedir o avanço da história; o conteúdo deve continuar legível sobre uma cor de fundo.

## Checklist de QA para a review

Status inicial de todos os itens: **não executado — aguardando implementação**.

| ID | Verificação | Resultado esperado |
| --- | --- | --- |
| QA-01 | Abrir o arquivo inicial no navegador, sem internet. | Tela inicial e recursos locais carregam; “Jogar” funciona. |
| QA-02 | Tentar continuar com nome vazio ou apenas espaços; depois sem selecionar feminino/masculino. | Explicação clara; jogador permanece na identificação até preencher os campos. |
| QA-03 | Jogar com nome acentuado e com cada opção feminino/masculino. | Nome aparece corretamente e todos os termos variáveis concordam com a opção. |
| QA-04 | Percorrer todas as escolhas ao longo de partidas repetidas. | Todas as respostas chegam à cena indicada; não aparecem falas inventadas ou becos sem saída. |
| QA-05 | Clicar durante a revelação gradual. | Completa somente a fala atual; outro clique em resposta ou avanço é necessário para seguir. |
| QA-06 | Clicar rapidamente e várias vezes em uma resposta ou em “Próximo”. | Avança somente uma cena; não mistura texto, retrato ou cenário. |
| QA-07 | Conferir o roteiro com o PDF. | Introdução e falas preservadas, mãe no quarto e pai no portão; ajustes limitados à concordância e normalização de espaços. |
| QA-08 | Cancelar e confirmar o reinício durante a partida; repetir pelo encerramento. | Cancelar preserva a partida; reiniciar limpa a sessão e permite jogar novamente. |
| QA-09 | Navegar somente com Tab, Enter e Espaço. | Todos os controles são acessíveis, foco é visível e a ordem faz sentido. |
| QA-10 | Verificar em 1366 × 768 e 390 × 844, além de zoom de 200%. | Texto e botões continuam acessíveis, sem sobreposição nem rolagem horizontal; rosto do personagem é visível. |
| QA-11 | Ativar preferência por movimento reduzido. | Texto aparece inteiro e transições não são animadas. |
| QA-12 | Informar um nome contendo caracteres como `<` e `>`. | Nome é exibido como texto, sem gerar elementos na página. |
| QA-13 | Completar duas partidas consecutivas e inspecionar o console. | Sem erros que afetem o jogo, recursos quebrados ou animações antigas sobre a cena atual. |
| QA-14 | Conferir acabamento e leitura. | Cenários e retratos coerentes, contraste adequado, nenhuma imagem de referência copiada ou marca d’água. |
| QA-15 | Verificar a leitura assistiva da caixa de diálogo. | A fala é lida por inteiro, uma vez, e escolhas têm nomes acessíveis. |

Testar ao menos no navegador que será usado na apresentação e registrar nome e versão. Se ele ainda não foi escolhido, usar o Chrome disponível como alvo inicial e conferir o fluxo principal no Edge disponível.

Critério de pronto para review: concluir o capítulo sem travamentos ou saltos de cenas, preservar o roteiro, garantir leitura e escolhas acessíveis, carregar os quatro recursos visuais e permitir reinício. Problemas de fluxo, texto ilegível ou controles inacessíveis precisam ser corrigidos antes da apresentação. Registrar quais verificações foram executadas e qualquer limitação pendente; não considerar este checklist automaticamente aprovado.

## Roteiro curto da apresentação

1. Apresentar a proposta: história interativa educativa com quatro capítulos planejados; esta entrega demonstra o primeiro.
2. Iniciar, preencher o nome e selecionar uma opção.
3. Mostrar uma fala aparecendo aos poucos, completar o texto e escolher uma resposta.
4. Avançar até a escola para mostrar a mudança de cenário e de personagem.
5. Encerrar a demonstração e mostrar que é possível jogar novamente.
6. Explicar que as escolhas neste capítulo seguem o roteiro linear recebido e que as situações educativas dos próximos capítulos ainda estão em desenvolvimento.
