# Kfoot 98 — Relatório 13: medições da Melhorias #25 (versão 26)

Simulações de partidas completas com elencos gerados pelo próprio jogo. O erro típico de uma célula da matriz é ±0,03 pontos por jogo.

## 1. Posições por jogador
Em 1.920 jogadores de um jogo de exemplo: 830 têm 2 posições, 575 têm 3, 275 têm 4 e 240 são goleiros (só jogam no gol). Ninguém de linha tem menos de 2 nem mais de 4.

## 2. Escalação automática por média na posição
A montagem agora ordena todos os pares jogador × vaga pela média do jogador naquele slot e preenche do maior para o menor (antes era vaga a vaga, com o cansaço pesando até −20%). O cansaço só desempata, com no máximo −2 pontos. Em 480 escalações automáticas (40 elencos × 12 formações) o goleiro ficou no gol em 100% e só 3,6% dos titulares ficaram fora das posições em que jogam bem.

## 3. Impedimento
Gols de bola rolando (jogada ou cruzamento) podem ser anulados. Em 400 jogos: 0,09 gols anulados por jogo (≈ 3,4% dos gols marcados, ou seja, cerca de 1 gol anulado a cada 11 jogos). A conversão dos chutes sobe na mesma medida, e a média ficou em 2,5 gols por jogo, igual à de antes.

## 4. Balanceamento depois das mudanças
Matriz formação × estilo (640 jogos por combinação, contra o campo): pontos por jogo médios entre 1,30 e 1,40 nas formações e entre 1,29 e 1,39 nos estilos, na mesma faixa do relatório 12. Retranca continua sendo o estilo de menor média (1,29) e Vertical o de maior (1,39), dentro do ruído.

## 5. Técnicos
Séries A, B e C: o mesmo técnico em todo jogo novo (conferido com duas sementes). Série D: 20 técnicos do computador, sorteados entre os clubes que os humanos não escolheram (19 clubes com um humano, 18 com dois, e assim por diante); todos os 80 clubes têm técnico.
