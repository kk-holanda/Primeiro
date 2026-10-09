# Medições das Melhorias #14 e #15

Medidas feitas com o motor real do jogo em Node, sem a tela, antes e depois de cada mudança. Os scripts ficam no laboratório de simulação do projeto.

## Copa do Brasil: placares entre grandes e pequenos

Cada confronto são duas partidas (ida e volta) entre elencos gerados com o prestígio indicado, 400 confrontos por linha. "Maior agregado" é o maior número de gols de um dos lados somando as duas partidas.

| Confronto (prestígio) | Antes: mediana / p90 / máximo | Depois: mediana / p90 / máximo | Favorito avança (depois) |
|---|---|---|---|
| 85 × 15 | 8 / 11 / 16 | 5 / 7 / 10 | 92% |
| 85 × 30 | 6 / 10 / 14 | 4 / 7 / 9 | 85% |
| 70 × 20 | 6 / 9 / 12 | 4 / 7 / 9 | 81% |
| 60 × 40 | 4 / 6 / 9 | 3 / 5 / 8 | 58% |
| 50 × 50 | 4 / 6 / 9 | 3 / 5 / 8 | 36% (casa) |

O que mudou: nos jogos da Copa as forças de ataque, defesa e controle dos dois times se aproximam da média (fator 0,45), e o time que abre 2 ou mais gols poupa o jogo (menos ataques e chutes). A liga não foi alterada.

## Lesões

| Medida | Antes | Depois |
|---|---|---|
| Lesões por jogo (os dois times) | 0,28 | 0,14 |

A chance agora depende da stamina do jogador: cansado se lesiona até cerca de 2,3 vezes mais que descansado.

## Caixa inicial e o que ele compra

| Série | Caixa mediano antes | Caixa mediano depois |
|---|---|---|
| A | R$ 13,8 mi | R$ 13,8 mi |
| B | R$ 2,7 mi | R$ 3,6 mi |
| C | R$ 600 mil | R$ 1,1 mi |
| D | R$ 100 mil | R$ 540 mil |

Melhor jogador comprável por um clube da Série D, medido pela média do jogador (os titulares da D têm média 54,7):

| Caixa | Série C | Série B | Série A |
|---|---|---|---|
| R$ 100 mil | 58 | 58 | 60 |
| R$ 540 mil | 60 | 67 | 72 |

## Premiações e acesso/rebaixamento (20 temporadas, mundo só com computador)

- Os prêmios somam cerca de R$ 21 mi por ano para os 80 clubes.
- A média de overall por série (14 melhores) ficou estável nos primeiros anos: Série A 71 → 70, B 62 → 61, C 55, D 49 → 48.
- Rodando 20 anos **sem** os bônus de atributo e **com** eles, os números foram praticamente iguais: jogadores com finalização 90 ou mais chegaram a 52 sem bônus e 59 com bônus no ano 20.

### Problemas que já existiam no motor (com ou sem prêmios)

1. Nos anos finais o overall médio dos times da Série A cai de 71 para cerca de 67 e depois se recupera.
2. Jogadores com finalização 90+ vão aumentando ao longo dos anos.
3. Alguns clubes do computador ficam com caixa negativo depois de uns 15 anos.
4. O artilheiro de uma série chegava a 60–70 gols; reduzi a concentração das finalizações e hoje fica em 25–50.

## Pênaltis e gols

2,58 gols por jogo; cerca de 0,34 pênalti por jogo; conversão de 75% a 80%.
