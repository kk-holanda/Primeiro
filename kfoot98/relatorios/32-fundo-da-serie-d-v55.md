# Relatório 32: o fundo da Série D afunda mesmo?

Versão: v55 (motor igual ao da v54). 8 mundos × 8 temporadas, todos os clubes do computador.
Scripts: `scripts-32/fd32.js` (segue cada clube da D temporada a temporada) e `scripts-32/an32h.py`.

## 1. Correção do relatório 31

O relatório 31 disse que o pior time da D caía de 45 para 40 de média e que o lanterna fazia 11 pontos.
**A maior parte disso era efeito do próprio teste.** O técnico de teste (um "humano" no piloto automático) começa na Série A,
é demitido, vai para clubes menores e acaba na D. Como ele não renova contratos, o clube dele perde 10 a 15 jogadores
no ano e completa o elenco com garotos de média 34. Era esse clube que virava o "pior time".

Tirando os clubes que passaram pelas mãos do técnico de teste:

| Temporada | Pior média (fim) | Pontos do lanterna | Melhor média | Média da D |
|---|---|---|---|---|
| 1 | 45,3 | 19,6 | 57,7 | 51,8 |
| 2 | 43,8 | 14,0 | 58,6 | 52,5 |
| 4 | 43,2 | 17,5 | 60,4 | 53,8 |
| 6 | 45,0 | 15,5 | 61,0 | 54,5 |
| 8 | 45,3 | 21,6 | 61,8 | 55,3 |

O pior time **não afunda**: fica em torno de 45. O lanterna faz 14 a 22 pontos.

## 2. O problema real: o fundo fica parado enquanto o resto sobe

A média da D sobe de 51,8 para 55,3 e o melhor de 57,7 para 61,8, mas o pior fica em 45. A distância aumenta.

| Posição na D | Média no início → fim | Evolução no ano (jovens / auge / veteranos) | Caixa | Prestígio | Contratações (média delas) |
|---|---|---|---|---|---|
| 1º a 4º | 56,0 → 58,6 | +4,8 / +1,8 / +1,2 | R$ 2,7 mi | 18,5 | 1,8 por ano (63) |
| 5º a 10º | 54,3 → 55,8 | +4,0 / +0,7 / +0,2 | R$ 2,6 mi | 18,3 | 1,7 (63) |
| 11º a 16º | 51,3 → 51,9 | +2,6 / −0,3 / −0,6 | R$ 1,9 mi | 16,7 | 1,8 (62) |
| 17º a 20º | 46,8 → 46,6 | +1,6 / −0,9 / −0,9 | R$ 0,9 mi | 12,7 | 1,7 (58) |

- Quem termina entre os 3 últimos fica entre os 4 últimos no ano seguinte em **69%** dos casos. Só 3% pulam para a metade de cima. 17% sobem para a C em até 4 anos.
- **Causa 1, o momento do time (v42):** cada derrota tira atributos, mesmo quando perder era o esperado. No fundo, o jogador no auge perde quase 1 ponto por ano; no topo, ganha quase 2. Os garotos do fundo evoluem 3 vezes menos que os do topo.
- **Causa 2, dinheiro e prestígio:** o fundo tem um terço do caixa do topo e prestígio menor, então contrata jogadores 5 pontos piores.
- **Causa 3, a base:** os garotos que completam o elenco no fim do ano saem do nível da série e do prestígio, então o clube pequeno recebe os piores.

## 3. Propostas para discutir

1. **Derrota esperada não tira atributo.** O momento do time passa a contar só a surpresa (ganhar de quem é mais forte, perder para quem é mais fraco) e a posição na tabela. Num teste rápido (ainda com o efeito do técnico de teste), a perda dos 4 últimos caiu de −0,6 para −0,1 ponto por temporada; preciso medir de novo sem esse efeito.
2. **Garotos do fundo jogando evoluem mais.** Bônus de evolução para jovens que jogam muitos minutos num time do fundo ("o clube pequeno revela"). Dá um caminho de reconstrução pela base.
3. **Prioridade no mercado para os últimos.** Os 4 últimos da D escolhem primeiro entre os livres e os garotos da base no começo da temporada (parecido com um draft).
4. **Ajuda em dinheiro da federação para os 4 últimos da D** (ex.: R$ 500 a 800 mil no começo do ano). Mexe nas finanças; fica para quando você liberar.
5. **Técnico novo no lanterna.** O computador troca o técnico do clube que está muito mal, com um "efeito técnico novo" na moral. Depende da demissão de técnicos, que você tinha adiado.

Minha sugestão: 1 e 2 juntas (mexem só na evolução, sem dinheiro), e depois medir de novo com 8 mundos × 8 anos.

## 4. Medição da v56 (piso de perda, pedido do KK em 2026-10-17)

Regra: só na Série D, depois da 3ª rodada; 4 últimos sem perda por resultado, 5º ao 8º de baixo com metade da perda; ganho e idade iguais.
Teste curto: mundos 1 a 4, 4 temporadas, mesmos mundos da v54, sem os clubes do técnico de teste (`scripts-32/cmp56.py`).

| | v54 | v56 |
|---|---|---|
| Pior média da D no fim do 4º ano | 43,2 | 49,5 |
| Pontos do lanterna (4º ano) | 20,8 | 23,5 |
| Média dos 4 últimos no ano | −0,65 | +1,01 |
| Jogadores no auge / veteranos dos 4 últimos | −0,8 / −1,3 | +0,5 / −0,1 |
| 3 últimos que seguem entre os 4 últimos no ano seguinte | 46% | 32% |
| Média da D no fim do 4º ano | 54,2 | 55,0 |
| Média da Série A | 75,5 | 75,6 |

O fundo deixa de afundar e passa a se recuperar devagar. O topo da D não muda. A média da D sobe 0,8, sem efeito nas outras séries.
