# Kfoot 98: salários e valores com auge de 25 a 30 anos (v53)

Data: 16/10/2026. Pedido do KK sobre o relatório 27: aplicar P2, P3, P4 e P5 (sem o P1), colocar o auge de 25 a 30 anos no salário e no valor, e usar o desempenho da temporada (gols, assistências, notas) no preço.

## O que mudou
- **P2, folha de 12 meses:** todo clube paga salário todos os dias do ano, jogando ou não (antes só pagava quem jogava no dia).
- **P3, piso por série:** D R$ 700; C, B e A R$ 900, com subida suave perto do piso.
- **P4, base:** 70% do piso da série do clube (D R$ 490, demais R$ 630).
- **P5, idade:** valor e salário no máximo de 25 a 30 anos. O garoto vale menos (0,82 aos 20 anos) e o veterano cai aos poucos (0,72 aos 34). O salário cai ainda mais devagar (0,88 aos 34).
- **Desempenho no preço:** gols e assistências por jogo da temporada passada (até +25%) e assistências da temporada atual (até +15%). Isso soma com a nota, os gols, a estrela (+15%), a característica (+8% a +10%) e as artilharias.

## Como foi testado
Mesma bateria do relatório 27: 3 mundos (sementes 3, 8 e 21), 3 temporadas cada, 80 clubes, o computador comprando, vendendo e renovando sozinho. A versão v52 (antes) e a v53 (agora) rodaram com as mesmas sementes.

## 1. Folha e caixa
| Série | Salários pagos por ano (mediana) antes → agora | Salários / receita recorrente | Anos com prejuízo | Caixa no fim do 3º ano (mediana) |
|---|---|---|---|---|
| A | R$ 4,35 mi → R$ 5,96 mi (+37%) | 27% → 33% | 11% → 11% | R$ 24,6 mi → R$ 25,1 mi |
| B | R$ 1,26 mi → R$ 1,47 mi (+16%) | 23% → 29% | 12% → 17% | R$ 8,6 mi → R$ 7,6 mi |
| C | R$ 455 mil → R$ 578 mil (+27%) | 22% → 28% | 16% → 18% | R$ 3,3 mi → R$ 3,7 mi |
| D | R$ 207 mil → R$ 301 mil (+46%) | 23% → 33% | 20% → 28% | R$ 1,53 mi → R$ 1,24 mi |

- A maior parte da subida vem do P2 (os meses que não eram cobrados). Na D também pesa o piso de R$ 700.
- Os jogadores no piso caíram de 65% para 52% na D e de 34% para 30% na C, porque a subida suave paga mais a quem vale um pouco mais.
- **Nenhum clube terminou um ano no vermelho**, antes e agora. A folha ainda é só um terço da receita. Se o KK quiser clubes endividados, o próximo passo é o P1 (taxa de 1,17% para 1,4% a 1,5%).

## 2. Valor e salário por idade (jogadores de clube com média 55 a 70)
| Idade | Valor antes | Valor agora | Salário antes | Salário agora |
|---|---|---|---|---|
| 15 a 20 | R$ 468 mil | R$ 266 mil | R$ 2.900 | R$ 1.650 |
| 21 a 24 | R$ 486 mil | R$ 385 mil | R$ 4.300 | R$ 3.450 |
| 25 a 30 | R$ 395 mil | **R$ 431 mil** | R$ 4.100 | **R$ 4.600** |
| 31 a 33 | R$ 221 mil | R$ 352 mil | R$ 2.500 | R$ 4.450 |
| 34 a 36 | R$ 142 mil | R$ 291 mil | R$ 1.500 | R$ 4.150 |
| 37+ | R$ 89 mil | R$ 211 mil | R$ 1.150 | R$ 3.900 |

Agora a faixa de 25 a 30 é a mais cara, nos dois casos. Antes o garoto de 20 anos valia 3,3 vezes o veterano de 34 com a mesma média; agora vale 0,9 vez. O salário do veterano ficou perto do salário do auge, porque a curva do salário é mais suave (como pedido no P5).

## 3. Como o computador está comprando e vendendo
| | Antes | Agora |
|---|---|---|
| Compras entre clubes por temporada | 102 | 94 |
| Livres por temporada | 3 | 4 |
| Garotos da base por temporada | 32 | 34 |
| Idade média de quem foi comprado | 29,0 | 26,3 |
| Média (overall) de quem foi comprado | 68,8 | 67,6 |
| Preço mediano (valor + multa) | R$ 944 mil | R$ 981 mil |

Preço mediano pago, por idade, nas compras entre clubes:

| Idade | Antes (compras) | Agora (compras) |
|---|---|---|
| 15 a 20 | R$ 918 mil (14) | R$ 605 mil (118) |
| 21 a 24 | R$ 2,42 mi (105) | R$ 1,11 mi (203) |
| 25 a 30 | R$ 1,23 mi (435) | R$ 1,22 mi (339) |
| 31 a 33 | R$ 669 mil (246) | R$ 1,23 mi (141) |
| 34+ | R$ 372 mil (114) | R$ 651 mil (47) |

- O computador continua ativo e com a mesma lógica: compra por necessidade de posição e pelo custo-benefício. Como o garoto ficou mais barato e o veterano mais caro, ele passou a comprar mais jovens (14 para 118 garotos até 20 anos) e menos veteranos (114 para 47). A idade média das compras caiu de 29 para 26 anos.
- O fluxo entre séries continua igual: os clubes de cima vendem o excedente para a série de baixo (A→B, B→C, C→D) e quase ninguém de baixo vende para cima.
- Os livres continuam pouco contratados (3 a 4 por temporada). O salário pedido por eles subiu de R$ 739 para R$ 867 em média, com o mínimo de R$ 700.

## 4. Pontos para o KK
1. Ninguém ainda fica no vermelho. Quer fazer o P1 agora (taxa maior), já com o P2 aplicado?
2. O computador agora prefere garotos. Isso é realista, mas os veteranos bons de 31 a 33 anos ficam mais tempo no clube. Acha bom assim?
3. O salário do veterano ficou perto do auge (0,88 aos 34). Se achar alto, dá para deixar a curva do salário igual à do valor.

Scripts: relatorios-kfoot/scripts-28 (sal28.js e an28.py).
