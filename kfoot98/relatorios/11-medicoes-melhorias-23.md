# Kfoot 98 — Medições da Melhorias #23 (v24)

Medições feitas com o próprio motor do jogo (simulações sem técnico humano e confrontos pareados). A lista de estilos de técnicos não está aqui: ela foi entregue pela thread Regras e Características.

## 1. Stamina mais suave

Expoente da curva de stamina: de 2 (v22) para 1,25. Força do jogador = 0,55 + 0,45 × (stamina/100)^expoente. Pontos por jogo de um time inteiro que começa o jogo com a stamina indicada, contra um time descansado de mesma força (1.200 pares, 2.400 jogos por linha):

| Stamina | v22 (expoente 2) | 1,5 | **v24 (1,25)** | Linear (1,0) |
|---|---|---|---|---|
| 100 | 1,34 | 1,34 | 1,33 | 1,36 |
| 90 | 0,79 | 0,93 | **0,95** | 1,01 |
| 80 | 0,41 | 0,48 | **0,60** | 0,70 |
| 70 | 0,19 | 0,26 | **0,35** | 0,42 |
| 60 | 0,10 | 0,14 | **0,17** | 0,23 |

Continua punitivo (time todo com 80 de stamina perde 55% dos pontos), mas bem menos extremo que antes. Se você ainda achar duro, o próximo passo seria a curva linear (80 → 0,70). O cansaço durante o jogo também conta, por isso as perdas são maiores do que a força isolada sugere.

## 2. Highlander

- Lesão: fator ×0,6 → **×0,45** (25% menos lesões que o Highlander da v22). Em 12.000 jogos pareados, as lesões por jogo do jogador foram de 0,4% sem a trait para 0,2% (v22) e 0,1% (v24); a diferença é pequena demais para medir com precisão nessa escala. A stamina cai ×0,85 como antes (stamina no fim do jogo 85,3 → 87,6).
- Só nasce em jogadores de 30 anos ou mais.
- **Ganho aos 30 anos**: 12% de chance para quem faz exatamente 30, jogou 15 jogos ou mais, não teve nenhuma lesão no ano, não tem outra trait e está em time com menos de 4 traits. Em 12 anos de simulação, **65 ganhos no total (3 a 8 por ano, em 80 clubes)**. Highlanders no mundo todo ficam entre 33 e 41, de cerca de 270 jogadores com trait (12% a 15%). Nada de excesso.

## 3. Caixa negativo

**Experimento forçado**: 80 clubes-temporada (10 jogos novos × 8 clubes de séries C e D), com o caixa preso em −R$ 30 mi o ano inteiro, com a penalidade e sem a penalidade (mesma semente):

| | Com penalidade | Sem penalidade |
|---|---|---|
| Pontos por temporada | **42,9** | 51,4 |
| Posição final média | 13,7º | 10,9º |
| Moral média no fim | **37** | 67 |
| Tamanho do elenco no fim | **18** | 23,8 |
| Média dos 14 melhores | 50,1 | 52,9 |

Um clube preso no negativo o ano todo perde **8,5 pontos por temporada** e cai quase 3 posições. A moral dos clubes do computador se estabiliza em torno de 37 (a recuperação automática de 12% rumo a 55 compensa parte dos −3 por jogo). Os leilões forçados vendem em média 6 jogadores no ano e o elenco desce até o mínimo de 18, onde para.

**Frequência natural** (simulação de 12 anos sem técnico humano, tabela da seção 5): o negativo é raro: de 0 a 4 clubes por ano (a partir do 5º ano, quando os custos crescem), de 0 a 76 jogos no negativo por ano e de 0 a 15 leilões forçados, quase todos vendidos (com R$ 0 de preço inicial, quase sempre aparece comprador).

**Humano** (teste no navegador): 1ª rodada negativa abre a carta da diretoria com a imagem; 4ª abre a carta dos jogadores furiosos; 5ª leiloa um dos 5 de menor moral e mostra o resultado numa carta; caixa positivo zera a contagem; moral média do elenco caiu de 70 para 67 na primeira rodada.

## 4. Preço de mercado (idade e desempenho)

**Idade**: o mesmo meia central de média 66, sem dados de temporada:

| Idade | 17 | 21 | 25 | 29 | 33 | 37 | 39 |
|---|---|---|---|---|---|---|---|
| Preço antes (degraus) | 918 mil | 816 mil | 680 mil | 544 mil | 340 mil | 204 mil | 204 mil |
| **Preço agora (curva suave)** | 963 mil | 884 mil | 721 mil | 544 mil | 306 mil | 163 mil | **116 mil** |

**Desempenho** (jogo de teste, jogadores de 24 a 28 anos; fator = 1 + 0,12 × z):

| Posição | Caso | Números na temporada | z | Preço antes → agora |
|---|---|---|---|---|
| Goleiro | melhor | 158 defesas, nota 7,61 (média 69) | +2,07 | 703 mil → **965 mil** |
| Goleiro | pior | 50 defesas, nota 6,66 (média 56) | −2,07 | 154 mil → 138 mil |
| Zagueiro | melhor | 137 desarmes, 2 gols (média 75) | +2,28 | 2,78 mi → **3,54 mi** |
| Zagueiro | pior | 9 jogos, nota 5,81 (média 76) | −1,78 | 2,77 mi → 2,44 mi |
| Lateral | melhor | 113 desarmes, 2 gols (média 63) | +2,31 | 477 mil → **682 mil** |
| Volante | melhor | 17 gols, 139 desarmes (média 67) | +3,16 | 774 mil → **1,13 mi** |
| Meia central | pior | 12 jogos, 0 gols, 0 assist. (média 68) | −1,75 | 724 mil → 637 mil |
| Meia (MEI) | pior | 13 jogos, 0 gols (média 63) | −1,50 | 350 mil → 316 mil |
| Ponta direita | melhor | 9 gols, 7 assist. (média 54) | +1,56 | 108 mil → 121 mil |
| Centroavante | melhor | 19 gols, 9 assist. (média 72) | +2,86 | 1,25 mi → **1,63 mi** |
| Centroavante | pior | 14 jogos, 0 gols (média 34) | −1,37 | 6 mil → 5 mil |

O fator vai de 0,80 a 1,40, então o preço sobe no máximo 40% por um ano excelente e cai no máximo 20% por um ano ruim. A comparação é dentro da mesma posição e série, para um artilheiro da D não ser tratado como um da A.

## 5. Compras do computador, base e aposentadoria (12 anos, 80 clubes, sem técnico humano)

| Ano | Clubes no negativo | Jogos no negativo | Leilões forçados (vendidos) | Compras do computador | Gasto (R$ mi) | Aposentados | Base ao mercado | Idade média | 36+ anos | Média dos 14 melhores A / B / C / D |
|---|---|---|---|---|---|---|---|---|---|---|
| 1998 | 0 | 0 | 0 (0) | 98 | 174.1 | 15 | 24 | 25.9 | 16 | 75.5 / 63.8 / 56.6 / 50.0 |
| 1999 | 0 | 0 | 0 (0) | 111 | 169.1 | 15 | 24 | 26.7 | 18 | 74.2 / 65.1 / 57.3 / 51.0 |
| 2000 | 0 | 0 | 0 (0) | 129 | 346.1 | 20 | 24 | 27.4 | 21 | 75.4 / 64.2 / 58.0 / 51.1 |
| 2001 | 0 | 0 | 0 (0) | 108 | 253.2 | 25 | 24 | 28.2 | 43 | 73.9 / 65.8 / 57.8 / 51.7 |
| 2002 | 1 | 7 | 1 (1) | 108 | 276.9 | 51 | 41 | 28.9 | 83 | 74.9 / 64.6 / 58.2 / 51.4 |
| 2003 | 2 | 16 | 3 (3) | 98 | 184.1 | 78 | 62 | 29.3 | 123 | 74.0 / 65.4 / 57.8 / 51.5 |
| 2004 | 4 | 73 | 14 (14) | 105 | 365.1 | 107 | 86 | 29.5 | 158 | 74.4 / 64.6 / 57.9 / 50.5 |
| 2005 | 3 | 76 | 15 (14) | 99 | 278.0 | 117 | 94 | 29.3 | 179 | 73.6 / 64.6 / 57.8 / 50.4 |
| 2006 | 3 | 49 | 10 (8) | 106 | 283.0 | 150 | 120 | 29.0 | 206 | 73.4 / 64.3 / 57.2 / 50.1 |
| 2007 | 3 | 9 | 2 (2) | 110 | 430.9 | 145 | 116 | 28.5 | 236 | 72.8 / 64.3 / 57.9 / 49.4 |
| 2008 | 3 | 12 | 2 (2) | 115 | 314.1 | 171 | 137 | 27.9 | 248 | 72.3 / 64.7 / 57.9 / 49.6 |
| 2009 | 3 | 25 | 5 (5) | 99 | 243.0 | 165 | 132 | 27.1 | 251 | 72.3 / 64.5 / 58.4 / 49.7 |

Compras do computador: **98 a 129 por temporada** (a simulação do relatório 5 previa 112), quase todas dentro da mesma série; poucas descem a série (D→C, C→B, B→A, ou seja, o jogador sobe de série ao ser comprado de um clube de nível abaixo). Gasto de R$ 170 a 430 mi por ano no total (R$ 2,5 mi por compra). Poucos livres (0 a 9 por ano): os clubes preferem comprar de outros clubes.

**Comparação com o jogo sem as novidades (v23), no 12º ano:** média dos 14 melhores A / B / C / D de 72,4 / 63,8 / 58,6 / 49,2 e idade média de 26,4, contra 72,3 / 64,5 / 58,4 / 49,7 e 27,1 na v24. **A força das séries não se deteriorou**; a idade média é 0,7 ano maior porque os veteranos só saem aos 40 (e, antes, pela chance reduzida), e os jovens da base são fracos nos primeiros anos.

**Aposentadoria**: aos 40 é automático; antes disso (a partir dos 36) a chance é de 20% por ano de idade acima de 35 (computador) ou de 36 (humano). Chegam a 165 a 170 por ano no ritmo estável. Os garotos da base que vão ao mercado são 80% disso (mínimo de 24): 132 no 12º ano.

## 6. Categorias de base

Garotos que chegam ao mercado (24 no primeiro ano de simulação): média 25 (de 20 a 30), idades 15 a 19, salário R$ 400, 8 de 24 com Promessa (30%), potencial médio 59 (90% abaixo de 70).

Evolução dos garotos em clubes (média de todos os que vivem em clubes, no fim da temporada):

| Idade | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 |
|---|---|---|---|---|---|---|---|---|---|
| Média | 32 | 35 | 38 | 42 | 45 | 53 | 58 | 59 | 61 |
| Potencial médio | 60 | 58 | 59 | 60 | 60 | 60 | 60 | 60 | 61 |

Chegam perto do potencial por volta dos 22 anos. Para comparação, a mediana da Série D é 42 e os 10% piores têm média 28 ou menos: um garoto da base vira titular de time da D por volta dos 18 anos. Para virar titular da Série A (média 70+), é preciso um potencial de 75 ou mais, que é raro (menos de 5% no mercado, bem mais comum nos garotos criados por clubes grandes).

## 7. Testes automáticos

Regressão de interface (t13 a t33): todos passam. Os testes t14, t27 e t29 falharam na primeira rodada por tempo (CPU ocupada com as simulações) e porque os pop-ups da diretoria agora abrem 60 ms depois; ajustei a espera nos testes e passam. Novo teste t33: cartas do caixa negativo (imagem, 1ª, 4ª e 5ª rodada, zerar), leilão forçado, popup da Promessa (3 posições, botão só habilita com 3), promessa de goleiro, tags BASE e APOS, filtro "Categorias de base" no mercado e os dois sons de raiva sem erro.

## 8. Pontos para discutir

1. **Stamina**: 1,25 ficou bom para você ou prefere linear?
2. **Aposentadoria antes dos 40**: mantive a chance de aposentar mais cedo (a partir dos 36). Se preferir só aos 40, o mundo envelhece demais (testei: no 12º ano há 660 jogadores de 36+ anos contra ≈ 250, e a média dos 14 melhores da Série A cai de 75,5 para 70,7).
3. **Compras do computador** estão em 4% por clube e rodada (≈ 105 por ano). Dá para variar.
4. **Moral do computador no negativo** fica em ~37 e o time perde 8,5 pontos por temporada; é bastante, mas só acontece em clubes realmente quebrados.
