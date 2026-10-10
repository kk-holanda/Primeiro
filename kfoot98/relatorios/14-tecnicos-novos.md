# Kfoot 98 — Relatório 14: os 7 estilos novos de técnicos do computador (Melhorias #26, versão 27)

Método: 32 jogos novos (sementes 1 a 32), uma temporada completa de liga em cada um, com os 80 clubes jogando com o motor completo (escolha de formação e estilo de jogo, treino, compras, leilões, intervalo). Em cada divisão os clubes do computador foram ordenados por prestígio e os 7 estilos de técnico foram distribuídos em rodízio por essa ordem (com um deslocamento diferente a cada semente), então todos os estilos têm o mesmo prestígio médio de elenco. Cada estilo foi testado com ≈ 360 clubes-temporada. O erro típico dos pontos por jogo é ±0,02.

## 1. Resultado em campo
| Estilo do técnico | Pontos por jogo | Gols feitos | Gols sofridos | Ofensividade média da formação* |
|---|---|---|---|---|
| Camaleão | 1,451 | 1,31 | 1,21 | 0,07 |
| Retranqueiro | 1,420 | 1,16 | 1,12 | −0,39 |
| Domínio de bola | 1,389 | 1,27 | 1,25 | 0,15 |
| Futebol arte | 1,380 | 1,28 | 1,27 | 0,38 |
| Equilibrado | 1,351 | 1,22 | 1,24 | 0,10 |
| Ofensivista | 1,331 | 1,27 | 1,32 | 0,58 |
| Imprevisível | 1,326 | 1,21 | 1,26 | 0,12 |

*atacantes na formação − 0,5 × defensores (4-4-2 = 0; 4-3-3 = 1; 5-4-1 = −1,5).

**Leitura.** A média geral é 1,38 e a faixa vai de 1,33 a 1,45. O **Camaleão** é o melhor (+0,07): ele escolhe a formação pelo encaixe do elenco, reage ao estilo do rival e sempre faz uma troca no intervalo, e isso rende. Eu o enfraqueci bem antes de chegar nesses números (avalia só 5 formações × 3 estilos por jogo, lê o rival em 60% dos jogos, acerto 70%, no começo estava em 1,47 a 1,48), mas ele continua na frente. O **Retranqueiro** (+0,04) ganha pontos sofrendo pouco e fechando o jogo quando está à frente. **Ofensivista** e **Imprevisível** ficam um pouco abaixo (−0,05): o primeiro sofre mais gols com formações abertas; o segundo abre mão da compatibilidade entre formação e estilo e do duelo de estilos. Nenhum estilo foge do que se espera dele: nada dominante a ponto de decidir sozinho o campeonato, mas há diferença real. **Proposta, sem implementar:** baixar o Camaleão mais um pouco (por exemplo, trocar no intervalo só quando ganha mais de 2 pontos de força) e subir um pouco o Ofensivista e o Imprevisível. Quer que eu faça?

## 2. Uso dos estilos de jogo (% dos jogos)
| Estilo do técnico | Posição | Gegen. | Reativo | Direto | Relac. | Retranca | Linha alta | Corredores | Vertical | Saída curta |
|---|---|---|---|---|---|---|---|---|---|---|
| Equilibrado | 14 | 10 | 11 | 9 | 12 | 3 | 6 | 9 | 12 | 13 |
| Futebol arte | 13 | 10 | 5 | 8 | 15 | 1 | 9 | 12 | 14 | 14 |
| Domínio de bola | 16 | 11 | 6 | 4 | 14 | 1 | 10 | 7 | 8 | 22 |
| Ofensivista | 6 | 16 | 4 | 15 | 6 | 1 | 14 | 13 | 16 | 9 |
| Retranqueiro | 4 | 3 | 26 | 15 | 4 | 21 | 13 | 5 | 4 | 5 |
| Camaleão | 6 | 10 | 17 | 13 | 6 | 7 | 14 | 8 | 9 | 10 |
| Imprevisível | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 |

Cada estilo usa mais o que prefere, mas todos aparecem de vez em quando (o Retranqueiro joga Posição em 4% dos jogos; o Ofensivista joga Reativo em 4%). O Imprevisível ficou uniforme, como deveria. O Camaleão se espalha porque o estilo dele depende do elenco e do rival: Reativo 17%, Linha Alta 14% e Jogo Direto 13% são as respostas que o duelo de estilos mais premia.

## 3. Treino (% dos treinos por atributo)
| Estilo do técnico | Ritmo | Finalização | Passe | Drible | Defesa | Físico |
|---|---|---|---|---|---|---|
| Equilibrado | 11 | 22 | 17 | 19 | 18 | 13 |
| Futebol arte | 4 | 34 | 25 | 29 | 4 | 3 |
| Domínio de bola | 19 | 34 | 33 | 6 | 5 | 4 |
| Ofensivista | 4 | 33 | 25 | 30 | 4 | 4 |
| Retranqueiro | 23 | 7 | 7 | 5 | 32 | 26 |
| Camaleão | 15 | 21 | 18 | 16 | 17 | 14 |
| Imprevisível | 12 | 20 | 17 | 19 | 17 | 14 |

Os pesos são de sorteio, não regras fixas: o Ofensivista ainda treina defesa e físico em 8% dos treinos, e o Retranqueiro treina finalização em 7%. O Retranqueiro treina defesa, físico e ritmo em 81% dos treinos (a regra pedida era 3 em 4).

## 4. Compras
O Futebol arte tem 0,14 Maestros por clube ao fim da temporada, contra 0,07 a 0,11 dos demais (+75% sobre a média de 0,08): ele compra Maestro (bônus de +8 pontos de média, o que o faz comprar mesmo com ganho de média zero) e escala o Maestro de preferência. Os bônus dos outros estilos (atacante e meia para o Ofensivista; defensor e goleiro para o Retranqueiro; passe alto para o Domínio de bola) são menores (+2 a +3 pontos) e só desempatam entre candidatos.

## 5. Intervalo
- Camaleão: fez pelo menos 1 substituição no intervalo em 247 de 300 jogos testados (nos demais não havia substituição disponível ou reserva melhor que −6 pontos).
- Imprevisível: mudou a formação em 114 de 300 jogos e o estilo em 171 de 300, e nunca colocou jogador de linha no gol nem goleiro na linha (conferido em 900 jogos: as únicas trocas goleiro↔linha foram as repostas de goleiro expulso).
- Retranqueiro: com vantagem no placar, em 85% dos jogos troca para Retranca ou Reativo e para formação de 5 zagueiros, 4-1-4-1 ou 3-5-2.

## 6. Tabela de preferências
As tabelas completas de pesos por formação, estilo de jogo e treino estão no documento 01, seção 7. Resumo: Equilibrado gosta de 4-4-2 e 4-2-3-1; Futebol arte de 4-3-3, 4-2-3-1 e 4-3-2-1; Domínio de bola de 4-4-2 Losango, 4-3-2-1 e 4-2-3-1; Ofensivista de 4-3-3, 3-3-1-3 e 4-2-4; Retranqueiro de 5-4-1 e 5-3-2; Camaleão e Imprevisível não têm tabela.
