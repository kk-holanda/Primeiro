# Kfoot 98 — Relatório 15: ajuste do Camaleão e do Retranqueiro e os 20 técnicos fixos da Série D (Melhorias #27, versão 28)

Método: o mesmo do relatório 14. 32 jogos novos (sementes 1 a 32), uma temporada completa em cada, com os 80 clubes jogando com o motor completo; em cada divisão os clubes do computador recebem os 7 estilos em rodízio por prestígio. Cerca de 360 clubes por estilo; margem de erro de cerca de ±0,02 pontos por jogo.

## 1. Resultado em campo (antes e depois)
| Estilo do técnico | Antes (relatório 14) | Depois |
|---|---|---|
| Camaleão | 1,451 | 1,406 |
| Retranqueiro | 1,420 | 1,404 |
| Domínio de bola | 1,389 | 1,382 |
| Futebol arte | 1,380 | 1,356 |
| Equilibrado | 1,351 | 1,375 |
| Ofensivista | 1,331 | 1,378 |
| Imprevisível | 1,326 | 1,337 |

Ofensivista e Imprevisível não foram mexidos (a variação deles é só ruído de sorteio, de ±0,02).

## 2. O que foi mexido
- **Camaleão**: acerto na leitura 0,70 → 0,50; lê o adversário em 45% dos jogos (antes 60%); testa 4 formações (antes 5) e a nota tem mais sorteio (0,9 em vez de 0,35, depois testado até 4); peso-base de treino 0,7 (antes 0,3), o que espalha mais o treino; bônus de compra de jogador versátil +1 (antes +2). O que mais pesou foi o sorteio na nota; a leitura do adversário e a substituição no intervalo tinham pouco efeito. A substituição no intervalo continua obrigatória.
- **Retranqueiro**: acerto 0,55 → 0,50; fecha o jogo ganhando em 35% dos jogos (antes 85%); peso de Retranca e Reativo 2,4/2,2 → 1,6. O Retranqueiro continua o segundo mais pontuador porque sofre muito menos gols (1,15 contra 1,25 dos demais), e ainda faz poucos (1,19); reduzir mais exigiria tirar a defesa dele, o que mudaria o jeito de jogar.

## 3. Técnicos fixos da Série D (conferido em jogos novos de sementes 1, 2 e 3)
- 20 técnicos: 17 brasileiros, 1 português, 1 argentino, 1 uruguaio.
- Estilos: Equilibrado 3, Futebol arte 3, Domínio de bola 3, Retranqueiro 3, Camaleão 3, Imprevisível 3, Ofensivista 2 (todos com ao menos 2).
- Com 1 jogador humano há 19 clubes D livres, todos recebem um dos 20 técnicos, sem repetir; sobra 1 técnico desempregado, guardado para futuras demissões. Os mesmos 20 técnicos aparecem em todos os jogos; só o clube muda.
