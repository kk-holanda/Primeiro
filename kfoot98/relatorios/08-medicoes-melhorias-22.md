# Kfoot 98 — Medições da Melhorias #22 (v22)

Método: motor real em Node, 4 temporadas completas (6.712 jogos) por medição, sementes comuns; efeitos de cada trait em 1.500 a 3.000 jogos pareados (mesmo jogo com e sem o trait, mesmas sementes). ± é erro padrão.

## Resumo
- **Posse ao vivo**: a posse mostrada agora é a dos últimos minutos e oscila bastante (num jogo de teste foi de 28% a 54%, 19 valores diferentes em 90 minutos); o total do jogo continua no resumo.
- **Acréscimos**: 1º tempo 1,8' em média (1 a 6), 2º tempo 3,6' (1 a 8). Como o jogo dura ≈ 5,4' a mais, os eventos por minuto foram multiplicados por 0,94: gols/jogo 2,618 (v21) → 2,638; faltas 21,25 → 21,06; lesões 0,111 → 0,108.
- **Prorrogação na Copa**: de 316 voltas, 47 (15%) foram à prorrogação e 25 (8%) aos pênaltis (na v21 eram 45 pares empatados, 14%, direto aos pênaltis). A prorrogação resolveu 22 dos 47 empates.
- **Estrelas por time** (média / mín–máx): A 3,05 (2–4) · B 2,15 (1–3) · C 1,65 (1–2) · D 1,40 (1–2). Média do melhor 11: A 75,0 → 76,5, B 63,1 → 64,5, C 55,9 → 57,0, D 48,8 → 50,2. Efeito colateral: as estrelas extras derrubavam os gols em ≈ 10% (A 2,66 → 2,38); calibrado com ataques por minuto 0,56 → 0,575 e chance de gol ×1,065. Gols/jogo depois: A 2,53, B 2,48, C 2,62, D 2,70 (v21: 2,66, 2,60, 2,59, 2,57), média da liga 2,59.
- **Traits**: 2 a 4 por time (média 2,9; 1.920 jogadores, 231 com trait).

## Efeito de cada trait (por jogo, jogador com × sem)
| Trait | Medida | Sem → com |
|---|---|---|
| Matador | gols do jogador / gols do time em cara a cara | 0,269 → 0,293 / 0,152 → 0,175 |
| Salvador da pátria | gols do reserva que entra aos 76' | 0,034 → 0,058; chutes 0,40 → 0,55 |
| Líder nato | gols do time (efeito pequeno de propósito) | 1,33 → 1,32 (só +5 de moral no 2º tempo quando perde no intervalo) |
| Batedor de faltas | gols de falta / gols | 0,021 → 0,054 / 0,289 → 0,325 |
| Desarmador | desarmes / faltas cometidas | 1,26 → 1,79 / 1,11 → 1,08 |
| Catimbeiro | faltas sofridas | 0,070 → 0,138 |
| Driblador | passes tentados / faltas sofridas | 83,3 → 61,2 / 0,070 → 0,227 |
| Cabeção | gols de cabeça | 0,013 → 0,023 |
| Maestro | assistências / gols de cara a cara do time | 0,088 → 0,113 / 0,152 → 0,159 |
| Cabeça de gelo | amarelos / vermelhos | 0,163 → 0,092 / 0,007 → 0,002 |
| Highlander | stamina ao fim do jogo | 85,4 → 87,6 (lesões são raras demais para medir em 1.500 jogos) |
| Coringa | média no slot | 100% da média natural em qualquer posição de linha |
| Popstar, Menino prodígio | economia e progressão (não entram no motor da partida) | patrocínio +4 pp e público +4% por popstar; progressão ×1,5 nos jogos e treinos |

Ajustes feitos nas medições: batedor de faltas estava triplicando os gols de falta (+0,09 por jogo) e foi reduzido pela metade; o desarmador fazia 83% mais desarmes e foi reduzido para +42%.

## Verificações
Regressão em navegador (t13 a t29) sem erros de console, mais testes novos: acréscimos no relógio (45+1', 90+3'), pausa do intervalo, tela de resultados da Copa sem humano, conversa com tom e alvo, etiquetas de trait e legenda.
