# Kfoot 98 — Relatório 17: calibração do 3-4-3 (Melhorias #29, versão 32)

O 3-4-3 entrou no lugar do 3-3-1-3. Método da calibração: o mesmo do relatório 12. Em cada partida, dois elencos sorteados de prestígio 60 jogam com todas as combinações de formação e estilo de jogo contra um adversário de formação e estilo sorteados; a média de cada formação é feita só sobre as combinações com nota de compatibilidade 4 ou 5. Cada rodada usa 4 grupos de sementes com 120 a 200 partidas por combinação. Erro de medida: cerca de ±0,03 por formação em cada rodada.

## 1. Calibração (pontos por jogo do 3-4-3 contra a média de todas as formações)
| Modificadores (ataque / defesa) | 3-4-3 | Média geral |
|---|---|---|
| 1,025 / 0,930 (estimativa inicial) | 1,443 | 1,381 |
| 0,987 / 0,895 | 1,367 | 1,381 |
| 0,995 / 0,902 | 1,403 | 1,379 |
| **0,992 / 0,903 (adotado)**, 1ª rodada | 1,370 | 1,370 |
| **0,992 / 0,903 (adotado)**, 2ª rodada | 1,380 | 1,377 |

O 3-4-3 ficou igual à média das formações. A faixa das outras 11 formações nas mesmas rodadas varia de 1,32 a 1,46 por causa do ruído da amostra; a regra do jogo (nenhuma formação domina) vale.

## 2. Conferência em temporadas completas (12 jogos novos, ~42 mil jogos)
Desvio de pontos por jogo (do próprio clube) das formações com o motor completo e as regras de IA da versão 29:

| Formação | Uso | Desvio de pontos | Gols feitos | Gols sofridos |
|---|---|---|---|---|
| 4-2-3-1 | 12,5% | +0,019 | 1,32 | 1,28 |
| 4-3-3 | 11,8% | +0,022 | 1,37 | 1,34 |
| 3-4-2-1 | 9,9% | −0,056 | 1,25 | 1,35 |
| 4-1-4-1 | 9,4% | −0,024 | 1,19 | 1,21 |
| 4-4-2 | 8,8% | −0,013 | 1,27 | 1,28 |
| 3-5-2 | 8,7% | +0,067 | 1,32 | 1,18 |
| 4-3-2-1 | 8,5% | −0,009 | 1,23 | 1,26 |
| 4-4-2L | 7,7% | −0,018 | 1,30 | 1,29 |
| 5-3-2 | 6,8% | +0,036 | 1,19 | 1,14 |
| **3-4-3** | **6,7%** | **+0,003** | **1,34** | **1,33** |
| 5-4-1 | 4,6% | −0,027 | 1,11 | 1,10 |
| 4-2-4 | 4,5% | −0,023 | 1,38 | 1,42 |

O 3-4-3 aparece em 6,7% dos jogos (a preferência dos técnicos foi seguida: Ofensivista 1,80, Futebol arte 1,10), faz 1,34 e sofre 1,33 gol, e fica neutro em pontos (+0,003). Os desvios das outras formações (como 3-5-2 +0,07 e 3-4-2-1 −0,06) não foram alterados e ficam dentro do que o relatório 16 já observava (os desvios misturam escolha de jogo fácil).

## 3. Estilos de técnico com o 3-4-3 (12 jogos novos)
Camaleão 1,418, Futebol arte 1,414, Domínio 1,384, Equilibrado 1,377, Ofensivista 1,376, Retranqueiro 1,357, Imprevisível 1,324. O espalhamento é o mesmo do relatório 16 (1,32 a 1,42; margem de ±0,04 com 12 temporadas).
