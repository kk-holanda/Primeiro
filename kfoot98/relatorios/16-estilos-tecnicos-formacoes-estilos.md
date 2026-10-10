# Kfoot 98 — Relatório 16: estilos de técnico, formações e estilos de jogo (versão 29)

Método: 64 jogos novos (sementes 1 a 64), uma temporada completa em cada, com os 80 clubes jogando com o motor completo da versão 29 (memória do adversário, reação ao placar, compras por necessidade e poupar jogadores já ligados). Em cada divisão os clubes do computador recebem os 7 estilos de técnico em rodízio por prestígio. Foram medidos 212.186 jogos (liga e Copa). Para formações e estilos de jogo uso o **desvio de pontos por jogo**: pontos do jogo menos o aproveitamento médio do próprio clube na temporada, o que tira o efeito de o clube ser forte ou fraco. Erro de medida: cerca de ±0,01 nas tabelas gerais, ±0,03 em linhas com 5 mil jogos e ±0,05 a ±0,10 nas células de perfil × estilo ou formação (as células com menos de 150 jogos ficam em branco).

**Cuidado de leitura**: o computador escolhe a formação e o estilo de acordo com a força do adversário (ataca contra rival mais fraco, fecha contra mais forte). Por isso o desvio mistura "a escolha é boa" com "a escolha foi feita em jogo fácil". Diferenças pequenas não devem ser lidas como erro de balanceamento.

## 1. Estilos de técnico (pontos por jogo)
| Estilo do técnico | Jogos | Pontos por jogo | Gols feitos | Gols sofridos |
|---|---|---|---|---|
| Equilibrado | 30141 | 1,376 | 1,28 | 1,28 |
| Futebol arte | 30066 | 1,399 | 1,34 | 1,30 |
| Domínio de bola | 30251 | 1,387 | 1,30 | 1,29 |
| Ofensivista | 30022 | 1,364 | 1,34 | 1,36 |
| Retranqueiro | 30226 | 1,398 | 1,22 | 1,18 |
| Camaleão | 29997 | 1,427 | 1,32 | 1,25 |
| Imprevisível | 30134 | 1,341 | 1,25 | 1,28 |

Média dos 7: 1,385. Camaleão é o único claramente acima (+0,04); Imprevisível é o mais fraco (−0,04) e Ofensivista, o segundo mais fraco (−0,02). Os demais ficam a menos de ±0,015 da média. O espalhamento total (1,341 a 1,427) é pequeno: ao longo de uma temporada de 38 jogos é a diferença de cerca de 3 pontos na tabela.

## 2. Estilos de jogo (todos os técnicos juntos)
| Estilo de jogo | Uso | Desvio de pontos | Gols feitos | Gols sofridos |
|---|---|---|---|---|
| Posição | 10.6% | +0,01 | 1,28 | 1,25 |
| Gegenpressing | 9.9% | −0,01 | 1,32 | 1,34 |
| Reativo | 10.4% | +0,00 | 1,24 | 1,21 |
| Direto | 11.1% | +0,01 | 1,34 | 1,32 |
| Relacionismo | 9.9% | +0,02 | 1,35 | 1,30 |
| Retranca | 5.7% | −0,02 | 1,09 | 1,10 |
| Linha Alta | 10.4% | −0,01 | 1,28 | 1,29 |
| Corredores | 9.2% | +0,02 | 1,32 | 1,29 |
| Vertical | 10.7% | +0,01 | 1,40 | 1,39 |
| Saída Curta | 12.0% | −0,03 | 1,21 | 1,23 |

Nenhum estilo foge de ±0,03 pontos por jogo. Destaques: **Saída Curta** (−0,03) é o mais usado (12%) e o que menos rende; **Retranca** (−0,02) é o menos usado (5,7%) e produz jogos de 1,09 gol para cada lado; **Relacionismo** e **Corredores** (+0,02) são os que mais rendem.

## 3. Formações (todos os técnicos juntos)
| Formação | Uso | Desvio de pontos | Gols feitos | Gols sofridos |
|---|---|---|---|---|
| 4-2-3-1 | 12.2% | +0,01 | 1,31 | 1,28 |
| 4-3-3 | 12.0% | +0,01 | 1,36 | 1,34 |
| 3-4-2-1 | 10.1% | −0,02 | 1,28 | 1,31 |
| 4-1-4-1 | 9.2% | −0,05 | 1,19 | 1,25 |
| 4-4-2 | 8.8% | −0,02 | 1,27 | 1,29 |
| 4-3-2-1 | 8.6% | −0,01 | 1,24 | 1,27 |
| 3-5-2 | 8.5% | +0,05 | 1,31 | 1,23 |
| 4-4-2L | 7.5% | +0,00 | 1,29 | 1,28 |
| 3-3-1-3 | 7.2% | +0,06 | 1,44 | 1,34 |
| 5-3-2 | 6.4% | −0,01 | 1,20 | 1,20 |
| 5-4-1 | 4.8% | −0,02 | 1,14 | 1,15 |
| 4-2-4 | 4.7% | −0,01 | 1,42 | 1,41 |

Dentro do esperado para as ofensivas: **3-3-1-3** (+0,06) e **3-5-2** (+0,05) vão bem; **4-1-4-1** (−0,05) é a que menos rende e é escolhida em 9% dos jogos, o que a torna o ponto mais fraco da tabela. **4-2-4** faz e sofre muitos gols (1,42 e 1,41), mas fica no zero.

## 4. Estilo de técnico × estilo de jogo (uso do técnico / desvio de pontos)
| perfil | Posição | Gegenpressing | Reativo | Direto | Relacionismo | Retranca | Linha Alta | Corredores | Vertical | Saída Curta |
|---|---|---|---|---|---|---|---|---|---|---|
| Equilibrado | 15% / +0,01 | 8% / −0,04 | 11% / −0,01 | 10% / +0,00 | 13% / +0,02 | 2% / +0,01 | 6% / −0,04 | 10% / +0,01 | 12% / +0,02 | 13% / −0,01 |
| Futebol arte | 14% / −0,03 | 10% / −0,04 | 4% / −0,01 | 7% / +0,03 | 16% / +0,04 | 1% / +0,16 | 9% / +0,00 | 12% / +0,01 | 15% / +0,00 | 12% / −0,03 |
| Domínio de bola | 18% / +0,01 | 12% / +0,01 | 3% / +0,01 | 3% / +0,00 | 15% / +0,00 | 1% / +0,02 | 11% / +0,02 | 6% / −0,03 | 6% / +0,02 | 25% / −0,02 |
| Ofensivista | 6% / +0,03 | 17% / −0,01 | 3% / +0,03 | 16% / −0,01 | 6% / +0,00 | - | 14% / −0,02 | 14% / +0,02 | 18% / +0,02 | 7% / −0,05 |
| Retranqueiro | 4% / −0,01 | 3% / −0,01 | 25% / −0,02 | 19% / +0,02 | 4% / +0,04 | 18% / −0,01 | 10% / +0,00 | 6% / +0,06 | 5% / +0,00 | 6% / −0,02 |
| Camaleão | 7% / +0,02 | 9% / +0,02 | 16% / +0,02 | 13% / +0,02 | 6% / +0,03 | 7% / −0,03 | 13% / −0,03 | 8% / −0,01 | 9% / +0,01 | 11% / −0,04 |
| Imprevisível | 10% / +0,05 | 10% / −0,01 | 10% / +0,02 | 10% / −0,02 | 10% / −0,02 | 10% / −0,06 | 10% / −0,00 | 10% / +0,05 | 10% / +0,00 | 10% / −0,02 |

## 5. Estilo de técnico × formação (uso do técnico / desvio de pontos)
| perfil | 4-2-3-1 | 4-3-3 | 3-4-2-1 | 4-1-4-1 | 4-4-2 | 4-3-2-1 | 3-5-2 | 4-4-2L | 3-3-1-3 | 5-3-2 | 5-4-1 | 4-2-4 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Equilibrado | 18% / +0,04 | 12% / +0,03 | 7% / −0,02 | 12% / −0,07 | 16% / +0,00 | 8% / −0,06 | 8% / +0,04 | 9% / +0,00 | 2% / +0,11 | 5% / +0,00 | 1% / −0,08 | 1% / +0,03 |
| Futebol arte | 15% / +0,02 | 18% / +0,02 | 14% / −0,04 | 5% / −0,05 | 5% / −0,06 | 12% / −0,02 | 5% / +0,04 | 10% / −0,04 | 10% / +0,09 | 1% / −0,05 | - | 6% / +0,01 |
| Domínio de bola | 15% / +0,01 | 14% / −0,00 | 12% / −0,01 | 11% / −0,04 | 5% / −0,06 | 13% / −0,01 | 8% / +0,02 | 13% / +0,01 | 6% / +0,07 | 2% / −0,07 | - | 2% / +0,06 |
| Ofensivista | 12% / −0,02 | 20% / +0,01 | 12% / −0,03 | 4% / −0,10 | 9% / +0,01 | 7% / −0,01 | 6% / +0,06 | 4% / −0,01 | 15% / +0,04 | 1% / −0,07 | - | 9% / −0,03 |
| Retranqueiro | 7% / +0,04 | 3% / +0,06 | 5% / −0,00 | 14% / −0,04 | 10% / −0,00 | 4% / +0,03 | 14% / +0,06 | 4% / −0,00 | 1% / +0,13 | 21% / −0,01 | 18% / −0,04 | - |
| Camaleão | 9% / −0,01 | 8% / −0,05 | 11% / +0,00 | 8% / −0,05 | 8% / −0,02 | 8% / +0,01 | 9% / +0,05 | 7% / +0,00 | 8% / +0,04 | 8% / +0,02 | 8% / +0,01 | 7% / +0,00 |
| Imprevisível | 9% / −0,04 | 10% / −0,01 | 10% / −0,01 | 9% / −0,00 | 9% / −0,03 | 8% / −0,01 | 9% / +0,07 | 7% / +0,05 | 8% / +0,03 | 8% / −0,01 | 6% / −0,02 | 7% / −0,03 |

## 6. O que a tabela mostra
- **As preferências estão sendo seguidas**: Retranqueiro joga Reativo (25%), Direto (19%) e Retranca (18%) e as formações 5-3-2, 5-4-1, 4-1-4-1 e 3-5-2; Ofensivista joga Vertical (18%), Gegenpressing (17%), Direto (16%) e 4-3-3, 3-3-1-3 e 3-4-2-1; Domínio de bola prefere Saída Curta (25%) e Posição (18%); Futebol arte, Relacionismo (16%), Vertical (15%) e 4-3-3, 4-2-3-1 e 3-4-2-1. Imprevisível usa todos os 10 estilos em 10% e as 12 formações de 6% a 10%, como projetado.
- **Quase nenhuma combinação é muito ruim ou muito boa.** Entre as células com amostra grande, o maior desvio negativo é Ofensivista com **4-1-4-1** (−0,10, 4% dos jogos) e Equilibrado com 4-1-4-1 (−0,07, 12% dos jogos). Entre as combinações com mais de 5% dos jogos do técnico, a maior positiva é Retranqueiro com 3-5-2 (+0,06) e Futebol arte com 3-3-1-3 (+0,09).
- **Duas combinações custam pontos ao Equilibrado e ao Domínio**: 4-1-4-1 (Equilibrado 12% dos jogos, −0,07) e 4-3-2-1 (Equilibrado −0,06), 4-4-2 (Domínio −0,06, Futebol arte −0,06). São formações que esses estilos usam bastante por preferência.
- **Imprevisível rende menos** (1,341) porque escolhe ao acaso, sem olhar a força do rival: usa Retranca (−0,06) com a mesma frequência de Posição (+0,05).
- **Camaleão segue o mais forte** (1,427), mesmo depois dos ajustes da versão 28 (era 1,451). Ele não tem formação ruim: todas ficam entre −0,05 e +0,05, e usa os 10 estilos com mais peso para Reativo (16%), Linha Alta (13%) e Direto (13%).

## 7. Propostas (para discutir; nada foi alterado)
1. **Camaleão**: baixar mais 0,02 a 0,03 reduzindo a leitura do rival dele para 35% e o bônus de compra. Hoje é o único fora da faixa.
2. **4-1-4-1**: é a formação que menos rende e a mais escolhida por Equilibrado (12%). Reduzir o peso dela no Equilibrado e no Ofensivista (onde rende −0,10).
3. **Saída Curta**: o estilo mais usado e que menos rende. Reduzir o peso dela no Domínio de bola (25% dos jogos) ou aumentar o ganho dela na tabela de sinergia.
4. **Imprevisível**: para ficar perto da média, dar a ele um viés fraco pela força do rival (como os outros), sem tirar a imprevisibilidade.
5. **Ofensivista**: continua 0,02 abaixo da média (1,364), dentro da margem de erro das outras medições; sem ação, só observar.
