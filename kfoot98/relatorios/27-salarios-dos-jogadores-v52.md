# Kfoot 98 — Relatório 27: salários dos jogadores (v52)

Medido no jogo atual (v52), em 3 mundos de teste (sementes 3, 8 e 21) jogados por 3 temporadas (1998 a 2000). Valores em R$ de 1998. Os números de "ano" usam só 1999 e 2000, porque 1998 começa em 31/01 e fica incompleto. A tabela entre parênteses é a média, e a que não tem é a mediana. Scripts em `scripts-27/`.

## 1. Resumo (o que importa)

1. **A folha de salários é pequena perto do dinheiro que entra.** Os salários pagos no ano são 25% a 32% da receita recorrente (bilheteria, sócios, TV, patrocínio e prêmios) em todas as séries, e só 45% a 51% da despesa total sem as compras. O estádio sozinho paga a folha quase duas vezes (de 1,5 a 1,9 vez).
2. **Dos jogadores que menos ganham, quase todos ganham o mesmo.** O piso é R$ 500 por mês. Na Série D, 65% dos jogadores estão no piso; na C, 34%; entre os livres, 58%. Quem tem média de 30 a 44 ganha todos R$ 500, ou seja, um jogador de média 35 e um de média 44 custam igual.
3. **A base ganha R$ 400 fixos, abaixo do piso da Série D.** O que pesa na contratação da base e dos livres é o valor pago ao empresário (de 7 mil a 70 mil), muito maior que o salário do primeiro ano.
4. **O salário cai demais com a idade.** Com a mesma média de 60 a 70, quem tem 34 anos ou mais ganha 26% do que ganha um jogador de até 22 anos (R$ 1,9 mil contra R$ 7,3 mil por mês).
5. **O jogo cobra menos de 12 meses de salário por ano**: entre 9 e 11 meses de folha (seção 6).

## 2. Quanto cada clube gasta por ano (mediana; entre parênteses, a média), em R$ milhões

| Série | Salários | Despesas fixas | Custos de jogo | Compras de jogadores | Obras, marketing, CT e base | Despesa total | Receita recorrente | Resultado do ano |
|---|---|---|---|---|---|---|---|---|
| A | 5,02 (5,75) | 2,83 (2,38) | 1,33 (1,32) | 3,39 (5,35) | 1,28 (2,27) | 15,00 (17,06) | 17,27 (17,61) | 4,36 (5,41) |
| B | 1,54 (1,89) | 0,48 (0,94) | 0,39 (0,47) | 1,60 (3,04) | 0,85 (1,91) | 6,09 (8,25) | 5,79 (6,98) | 1,52 (2,91) |
| C | 0,52 (0,66) | 0,12 (0,17) | 0,10 (0,14) | 0,87 (1,30) | 0,39 (0,73) | 2,19 (3,00) | 1,97 (2,48) | 0,59 (0,86) |
| D | 0,24 (0,29) | 0,02 (0,06) | 0,05 (0,06) | 0,23 (0,56) | 0,19 (0,33) | 0,81 (1,30) | 1,01 (1,18) | 0,21 (0,29) |

Quanto a folha pesa (mediana dos clubes):

| Série | Salários ÷ receita recorrente | Salários ÷ receita do estádio | Salários ÷ despesa sem compras | Salários do clube mais baixo e do mais alto (mi) |
|---|---|---|---|---|
| A | 32% | 54% | 51% | 0,72 a 16,31 |
| B | 27% | 54% | 46% | 0,21 a 8,67 |
| C | 25% | 57% | 45% | 0,21 a 3,70 |
| D | 26% | 69% | 46% | 0,11 a 1,32 |

Hoje o ano termina no vermelho em 13% dos clubes da A, 18% da B, 22% da C e 27% da D (resultado = receita total menos despesa total, com compras e vendas).

## 3. Salário dos jogadores dos clubes (começo do jogo, 5.760 jogadores)

| Série | Média | Mediana | 10% mais baixos | 10% mais altos | Maior | No piso de R$ 500 | Folha mensal do clube (mediana) | Folha em 12 meses |
|---|---|---|---|---|---|---|---|---|
| A | 21.412 | 12.700 | 3.300 | 52.300 | 184.100 | 0% | 486.100 | 5,8 mi |
| B | 4.714 | 2.800 | 800 | 9.600 | 44.700 | 4% | 108.500 | 1,3 mi |
| C | 1.567 | 1.000 | 500 | 3.100 | 12.000 | 34% | 37.050 | 0,44 mi |
| D | 733 | 500 | 500 | 1.200 | 6.300 | 65% | 16.700 | 0,20 mi |

Salário por média (overall) do jogador, todas as séries juntas, por mês:

| Média | Jogadores | Salário médio | Menor | Maior |
|---|---|---|---|---|
| 30 a 40 | 449 | 500 | 500 | 500 |
| 40 a 45 | 578 | 504 | 500 | 700 |
| 45 a 50 | 837 | 633 | 500 | 1.400 |
| 50 a 55 | 934 | 1.187 | 500 | 2.700 |
| 55 a 60 | 791 | 2.326 | 500 | 5.400 |
| 60 a 65 | 870 | 4.766 | 900 | 11.400 |
| 65 a 70 | 460 | 9.077 | 1.800 | 23.200 |
| 70 a 75 | 493 | 19.089 | 3.500 | 40.700 |
| 75 a 80 | 176 | 31.135 | 7.400 | 70.500 |
| 80 a 90 | 169 | 81.220 | 27.600 | 184.100 |

A curva sobe 4 vezes a cada 10 pontos de média. Entre a Série D e a A o salário médio sobe 29 vezes, e a receita recorrente do clube sobe 17 vezes.

Por idade (mesma média de 60 a 70): até 22 anos, R$ 7.300; 23 a 27, R$ 6.150; 28 a 30, R$ 4.900; 31 a 33, R$ 2.900; 34 ou mais, R$ 1.900. Por posição (fórmula do valor): zagueiro e líbero valem 1,3 e 1,25 vez, lateral 1,2, atacante de centro 0,88 e segundo atacante 0,9.

## 4. Livres e base (jogadores disponíveis no mercado nas 3 temporadas)

Livres (450 jogadores, média 45,7, salário pedido para 12 meses):

| Média | Jogadores | Salário pedido | Valor pago ao empresário | Valor do jogador |
|---|---|---|---|---|
| 30 a 40 | 105 | 500 | 6.724 | 13.076 |
| 40 a 45 | 92 | 501 | 12.402 | 24.380 |
| 45 a 50 | 134 | 632 | 26.351 | 52.261 |
| 50 a 55 | 100 | 1.168 | 52.160 | 103.940 |
| 55 a 60 | 18 | 1.644 | 71.667 | 142.778 |

58% dos livres pedem o piso de R$ 500. Para um livre de média 50 a 55, o empresário recebe R$ 52 mil de uma vez e o salário do ano é R$ 14 mil: o custo de entrar pesa 3,7 vezes o salário anual.

Base (270 jogadores, média 25,0, idade 16,9): todos pedem R$ 400 por mês por 24 meses e custam R$ 17 mil ao empresário em média. O salário da base (R$ 400) é 20% menor que o piso da Série D (R$ 500) e não muda com o potencial do garoto.

## 5. O que isso quer dizer

- **Folha leve demais para a ideia de finanças difíceis.** Com a folha em 25% a 32% da receita recorrente e a bilheteria sozinha pagando o salário em 1,5 a 1,9 vez, não há aperto. A meta que combina com o que você pediu (consequência nas escolhas, um ou outro clube em dívida) é uma folha em torno de 40% da receita recorrente.
- **As séries estão parecidas entre si:** a folha pesa quase igual em A, B, C e D (32%, 27%, 25%, 26%). Então o salto de salário entre séries acompanha o salto da receita; o que você sente como salto grande C→B e B→A está mais na receita (relatório 26) do que no salário.
- **Na base da pirâmide o salário vira "tudo igual".** Piso fixo achata a Série D e os livres: não há como ver, pelo salário, quem é melhor entre os fracos.
- **Veteranos baratos demais, garotos caros demais para o que rendem.** O salário segue o valor de mercado, que paga muito pela juventude (1,35 vez até 20 anos) e muito pouco pelo veterano (0,3 vez a partir de 34).

## 6. Um achado: o jogo cobra de 9 a 11 meses de folha por ano

O salário é descontado a cada jogo do clube, proporcional aos dias até o próximo dia de jogo do calendário (todos os clubes juntos). Quando há dias de Copa em que um clube não joga, o salário desses dias não é cobrado de ninguém. Somando a entressafra (26/10 a 31/01), o ano paga entre 9 e 11 meses de folha em vez de 12 (A, 9,1 a 9,2; B, 9,4 a 10,5; C, 10,4 a 11,2; D, 9,9 a 10,7, medido em um mundo). Essa explicação vem da leitura do código (a cobrança é feita só nos clubes que jogam no dia); a medida em si é do jogo. O comentário no código fala em 13 pagamentos por ano. Cobrar os 12 meses certinhos aumenta a folha paga em cerca de 15% a 30%, sozinho.

## 7. Propostas (nenhuma aplicada, aguardando a sua decisão)

**P1. Subir o salário para ficar perto de 40% da receita recorrente.** Hoje o salário é 1,17% do valor do jogador por mês. Se a taxa subir, sem mexer no resto, fica assim (mediana de 1999 e 2000):

| Taxa mensal | Fator | Folha ÷ receita (A / B / C / D) | Clubes no vermelho (A / B / C / D) | Resultado mediano do ano, mi (A / B / C / D) |
|---|---|---|---|---|
| 1,17% (hoje) | 1,0 | 32 / 27 / 25 / 26% | 13 / 18 / 22 / 27% | 4,36 / 1,52 / 0,59 / 0,21 |
| 1,5% | 1,3 | 42 / 35 / 33 / 34% | 28 / 24 / 26 / 33% | 3,07 / 1,01 / 0,48 / 0,14 |
| 1,9% | 1,6 | 51 / 43 / 41 / 42% | 34 / 33 / 33 / 41% | 1,63 / 0,55 / 0,36 / 0,07 |
| 2,3% | 2,0 | 64 / 54 / 51 / 52% | 56 / 48 / 42 / 54% | −0,49 / 0,04 / 0,19 / −0,02 |

Recomendo **1,5% a 1,6%** (fator 1,3 a 1,4): a folha chega a cerca de 40% da receita e uns 25% a 33% dos clubes têm um ano no vermelho, o que dá a consequência que você quer sem quebrar a Série A. A versão de testes das finanças (relatório 22) usava 1,9%, junto com patrocínio menor; o fator 1,6 aqui é isso sem mexer no patrocínio. Atenção: o mesmo aumento vale para a renovação, para o pedido dos livres e para as compras do computador.

**P2. Cobrar os 12 meses completos** (seção 6): um ajuste de calendário que deixa a folha certa. Se fizer P1 e P2 juntos, reduza P1 (a folha paga já sobe cerca de 15% a 30% sozinha com o P2).

**P3. Piso por série e curva suave embaixo.** O piso de R$ 500 só pega a Série D e a C. Subir o piso, sem mexer no resto, aumenta a folha assim:

| Piso | Série D | Série C | Série B e A |
|---|---|---|---|
| R$ 600 | +9% | +2% | 0% |
| R$ 700 | +19% | +5% | 0% |
| R$ 800 | +29% | +7% | 0% |
| R$ 1.000 | +52% | +13% | +1% (B) |

Sugestão: piso de R$ 700 na D e R$ 900 na C, com uma subida suave entre média 30 e 50, para o jogador de média 44 ganhar mais que o de média 35.

**P4. Salário da base ligado ao piso.** Em vez de R$ 400 fixos, a base ganharia uns 70% do piso da série do clube que contrata (D com piso de 700: R$ 490), e o contrato de 24 meses continua. Assim nunca fica abaixo do piso.

**P5. Suavizar a idade no salário** (o valor de mercado continua como está): até 30 anos fator 1; de 31 a 33, 0,85; a partir de 34, 0,7; garoto até 23 anos sem o bônus de juventude. A folha sobe 9% na A, 6% na B, 4% na C e 3% na D (só pelos veteranos), e o garoto fica mais barato.

**Ordem que eu seguiria:** P2 (calendário) → P1 (1,5%, já considerando o P2) → P3 (piso) → P4 → P5. Depois uma bateria rápida para conferir caixa e compras do computador.

## 8. Como foi medido

Mundo novo com 80 clubes, 1 técnico humano, jogando as temporadas inteiras sem ações do humano; o computador compra, vende e renova como no jogo. Receita e despesa saem do razão de cada clube (`g.finAnos`). Livres e base: proposta de 12 meses (livres) e 24 meses (base) no começo de cada ano. Os efeitos das propostas P1, P3 e P5 são contas feitas sobre esses dados, sem mudar o jogo (o comportamento do computador ao receber mais despesa, como comprar menos, não está incluído).
