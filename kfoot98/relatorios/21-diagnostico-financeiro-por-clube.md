# Relatório 21 — Diagnóstico financeiro por clube (1 temporada, v36)

Simulação de uma temporada completa (1998, semente 1) na v36, sem nenhuma intervenção do jogador, com os 80 clubes. Valores em R$ de 1998, da primeira rodada ao fim da temporada (liga + Copa do Brasil + prêmios de fim de temporada). O clube do jogador (Série D) fica parado e é tratado como computador. Os números fecham: para cada clube, o caixa final menos o inicial é igual ao resultado (receita menos despesa). A tabela completa, com todas as colunas, está em `21-financas-por-clube.csv`.

Como ler: **Estádio** = bilheteria das três áreas (arquibancada, cadeiras e VIP); **Sócios** = mensalidades dos sócios-torcedores; **Venda** = venda de jogadores mais multas rescisórias recebidas; **Compras** = dinheiro gasto na contratação de jogadores (preço, multa e luvas); **Marketing** = gasto com campanha ou jogo-evento (o computador não usa marketing).

## Série A

### Resumo da série

| Item | Mediana por clube | Menor | Maior | Soma da série |
|---|---|---|---|---|
| Estádio (bilheteria) | 9,80 mi | 5,80 mi | 15,00 mi | 192,68 mi |
|   Arquibancada | 3,10 mi | 1,85 mi | 4,75 mi | 60,99 mi |
|   Cadeiras | 4,34 mi | 2,56 mi | 6,63 mi | 85,29 mi |
|   VIP | 2,37 mi | 1,39 mi | 3,61 mi | 46,40 mi |
| Sócios (mensalidades) | 1,29 mi | 0,76 mi | 1,72 mi | 24,51 mi |
| Cota de TV | 3,00 mi | 3,00 mi | 3,00 mi | 60,00 mi |
| Patrocínio | 11,30 mi | 5,74 mi | 14,05 mi | 219,08 mi |
| Venda de jogadores e multas | 7,45 mi | 0,00 mi | 21,73 mi | 126,84 mi |
| Prêmios de fim de temporada | 0,40 mi | 0,00 mi | 4,36 mi | 17,42 mi |
| **Receita total** | 29,93 mi | 18,09 mi | 53,91 mi | 640,54 mi |
| Salários | 4,55 mi | 2,66 mi | 7,27 mi | 89,32 mi |
| Despesas fixas e custos de jogo | 4,43 mi | 3,56 mi | 5,48 mi | 87,73 mi |
| Compra de jogadores | 7,94 mi | 0,00 mi | 20,28 mi | 134,44 mi |
| Obras no estádio | 0,00 mi | 0,00 mi | 0,00 mi | 0,00 mi |
| Marketing | 0,00 mi | 0,00 mi | 0,00 mi | 0,00 mi |
| **Despesa total** | 16,68 mi | 6,91 mi | 29,92 mi | 311,49 mi |
| **Resultado da temporada** | 16,17 mi | −3,40 mi | 42,20 mi | 329,04 mi |
| Caixa no início | 13,84 mi | 11,20 mi | 15,64 mi | 273,92 mi |
| Caixa no fim | 30,84 mi | 8,76 mi | 57,72 mi | 602,96 mi |

- Resultado negativo na temporada: **1 de 20 clubes** (Sport −3,40 mi). Caixa final negativo: **0**.
- Receita recorrente (estádio + sócios + TV + patrocínio) mediana 25,26 mi, contra custo recorrente (salários + fixas + custos de jogo) de 9,13 mi: o clube mediano sobra 16,73 mi antes de qualquer compra de jogador.
- Peso na receita recorrente: estádio 39%, sócios 5%, TV 12%, patrocínio 44%.
- Lotação média dos jogos em casa: mediana 67%, de 58% a 87%.
- Vendas de jogadores na série: 126,84 mi; compras: 134,44 mi.

### Receitas por clube

| Clube | Estádio (total) | Arquibancada | Cadeiras | VIP | Sócios | Venda de jogadores e multas | Patrocínio | TV | Prêmios | **Receita total** |
|---|---|---|---|---|---|---|---|---|---|---|
| Flamengo | 14,96 mi | 4,74 mi | 6,62 mi | 3,61 mi | 1,71 mi | 15,82 mi | 14,05 mi | 3,00 mi | 4,36 mi | **53,91 mi** |
| Cruzeiro | 10,20 mi | 3,22 mi | 4,52 mi | 2,47 mi | 1,43 mi | 21,73 mi | 11,45 mi | 3,00 mi | 0,00 mi | **47,81 mi** |
| Corinthians | 15,00 mi | 4,75 mi | 6,63 mi | 3,61 mi | 1,72 mi | 10,66 mi | 13,83 mi | 3,00 mi | 2,25 mi | **46,46 mi** |
| Botafogo | 11,89 mi | 3,79 mi | 5,25 mi | 2,85 mi | 1,26 mi | 11,80 mi | 11,49 mi | 3,00 mi | 3,11 mi | **42,56 mi** |
| São Paulo | 11,75 mi | 3,73 mi | 5,20 mi | 2,83 mi | 1,53 mi | 8,27 mi | 11,94 mi | 3,00 mi | 1,30 mi | **37,79 mi** |
| Palmeiras | 12,31 mi | 3,89 mi | 5,45 mi | 2,97 mi | 1,62 mi | 7,25 mi | 12,51 mi | 3,00 mi | 0,50 mi | **37,19 mi** |
| Santos | 10,01 mi | 3,17 mi | 4,43 mi | 2,41 mi | 1,29 mi | 11,82 mi | 10,89 mi | 3,00 mi | 0,00 mi | **37,02 mi** |
| Grêmio | 9,92 mi | 3,12 mi | 4,40 mi | 2,40 mi | 1,39 mi | 11,23 mi | 10,66 mi | 3,00 mi | 0,60 mi | **36,80 mi** |
| Coritiba | 7,30 mi | 2,32 mi | 3,23 mi | 1,75 mi | 0,99 mi | 8,58 mi | 11,30 mi | 3,00 mi | 0,00 mi | **31,17 mi** |
| Vitória | 6,76 mi | 2,13 mi | 3,00 mi | 1,63 mi | 1,02 mi | 8,27 mi | 10,48 mi | 3,00 mi | 0,40 mi | **29,93 mi** |
| Atlético-MG | 9,75 mi | 3,08 mi | 4,32 mi | 2,35 mi | 1,33 mi | 1,23 mi | 12,40 mi | 3,00 mi | 0,40 mi | **28,11 mi** |
| Vasco da Gama | 9,80 mi | 3,10 mi | 4,34 mi | 2,36 mi | 1,45 mi | 0,00 mi | 13,46 mi | 3,00 mi | 0,00 mi | **27,70 mi** |
| Internacional | 9,80 mi | 3,09 mi | 4,34 mi | 2,37 mi | 1,36 mi | 0,52 mi | 12,35 mi | 3,00 mi | 0,00 mi | **27,02 mi** |
| Bahia | 9,87 mi | 3,13 mi | 4,36 mi | 2,37 mi | 1,17 mi | 0,55 mi | 11,22 mi | 3,00 mi | 0,00 mi | **25,81 mi** |
| Atlético-PR | 9,46 mi | 2,96 mi | 4,22 mi | 2,28 mi | 0,97 mi | 0,54 mi | 10,11 mi | 3,00 mi | 1,50 mi | **25,58 mi** |
| Sport | 6,86 mi | 2,17 mi | 3,03 mi | 1,65 mi | 0,89 mi | 7,45 mi | 5,74 mi | 3,00 mi | 0,00 mi | **23,93 mi** |
| Juventude | 7,15 mi | 2,27 mi | 3,17 mi | 1,72 mi | 0,76 mi | 0,56 mi | 7,67 mi | 3,00 mi | 3,00 mi | **22,14 mi** |
| Guarani | 6,58 mi | 2,10 mi | 2,91 mi | 1,58 mi | 0,86 mi | 0,56 mi | 9,82 mi | 3,00 mi | 0,00 mi | **20,83 mi** |
| Portuguesa | 7,50 mi | 2,37 mi | 3,32 mi | 1,80 mi | 1,00 mi | 0,00 mi | 9,20 mi | 3,00 mi | 0,00 mi | **20,70 mi** |
| Paraná | 5,80 mi | 1,85 mi | 2,56 mi | 1,39 mi | 0,76 mi | 0,00 mi | 8,53 mi | 3,00 mi | 0,00 mi | **18,09 mi** |

### Despesas e resultado por clube

| Clube | Salários | Fixas e custos de jogo | Compra de jogadores | Obras | Marketing | **Despesa total** | **Resultado** | Caixa início → fim |
|---|---|---|---|---|---|---|---|---|
| Flamengo | 6,36 mi | 5,34 mi | 0,00 mi | 0,00 mi | 0,00 mi | **11,70 mi** | **42,20 mi** | 15,52 mi → 57,72 mi |
| Cruzeiro | 4,99 mi | 4,36 mi | 11,80 mi | 0,00 mi | 0,00 mi | **21,15 mi** | **26,65 mi** | 14,92 mi → 41,57 mi |
| Corinthians | 7,27 mi | 5,48 mi | 11,28 mi | 0,00 mi | 0,00 mi | **24,02 mi** | **22,43 mi** | 15,64 mi → 38,07 mi |
| Botafogo | 4,56 mi | 5,01 mi | 9,80 mi | 0,00 mi | 0,00 mi | **19,38 mi** | **23,18 mi** | 13,60 mi → 36,78 mi |
| São Paulo | 5,60 mi | 4,59 mi | 7,25 mi | 0,00 mi | 0,00 mi | **17,44 mi** | **20,35 mi** | 15,28 mi → 35,63 mi |
| Palmeiras | 7,00 mi | 4,81 mi | 18,11 mi | 0,00 mi | 0,00 mi | **29,92 mi** | **7,27 mi** | 15,40 mi → 22,67 mi |
| Santos | 4,08 mi | 4,46 mi | 12,30 mi | 0,00 mi | 0,00 mi | **20,85 mi** | **16,17 mi** | 13,84 mi → 30,01 mi |
| Grêmio | 3,73 mi | 4,31 mi | 0,00 mi | 0,00 mi | 0,00 mi | **8,04 mi** | **28,76 mi** | 14,68 mi → 43,44 mi |
| Coritiba | 3,17 mi | 3,79 mi | 0,00 mi | 0,00 mi | 0,00 mi | **6,96 mi** | **24,21 mi** | 12,64 mi → 36,85 mi |
| Vitória | 3,00 mi | 3,71 mi | 9,97 mi | 0,00 mi | 0,00 mi | **16,68 mi** | **13,24 mi** | 13,12 mi → 26,36 mi |
| Atlético-MG | 4,23 mi | 4,42 mi | 0,00 mi | 0,00 mi | 0,00 mi | **8,65 mi** | **19,46 mi** | 14,32 mi → 33,78 mi |
| Vasco da Gama | 5,65 mi | 4,16 mi | 2,21 mi | 0,00 mi | 0,00 mi | **12,02 mi** | **15,68 mi** | 15,16 mi → 30,84 mi |
| Internacional | 4,70 mi | 4,43 mi | 0,54 mi | 0,00 mi | 0,00 mi | **9,67 mi** | **17,35 mi** | 14,44 mi → 31,79 mi |
| Bahia | 4,68 mi | 4,58 mi | 13,00 mi | 0,00 mi | 0,00 mi | **22,26 mi** | **3,55 mi** | 13,36 mi → 16,91 mi |
| Atlético-PR | 4,55 mi | 4,78 mi | 8,81 mi | 0,00 mi | 0,00 mi | **18,15 mi** | **7,43 mi** | 12,40 mi → 19,83 mi |
| Sport | 3,06 mi | 3,99 mi | 20,28 mi | 0,00 mi | 0,00 mi | **27,33 mi** | **−3,40 mi** | 12,16 mi → 8,76 mi |
| Juventude | 3,43 mi | 4,44 mi | 0,56 mi | 0,00 mi | 0,00 mi | **8,44 mi** | **13,70 mi** | 11,20 mi → 24,90 mi |
| Guarani | 2,66 mi | 3,68 mi | 0,57 mi | 0,00 mi | 0,00 mi | **6,91 mi** | **13,91 mi** | 11,92 mi → 25,83 mi |
| Portuguesa | 3,65 mi | 3,82 mi | 0,00 mi | 0,00 mi | 0,00 mi | **7,46 mi** | **13,24 mi** | 12,88 mi → 26,12 mi |
| Paraná | 2,94 mi | 3,56 mi | 7,94 mi | 0,00 mi | 0,00 mi | **14,45 mi** | **3,65 mi** | 11,44 mi → 15,09 mi |

## Série B

### Resumo da série

| Item | Mediana por clube | Menor | Maior | Soma da série |
|---|---|---|---|---|
| Estádio (bilheteria) | 2,09 mi | 1,33 mi | 3,29 mi | 43,61 mi |
|   Arquibancada | 0,99 mi | 0,63 mi | 1,57 mi | 20,82 mi |
|   Cadeiras | 0,83 mi | 0,53 mi | 1,31 mi | 17,30 mi |
|   VIP | 0,26 mi | 0,17 mi | 0,42 mi | 5,48 mi |
| Sócios (mensalidades) | 0,35 mi | 0,24 mi | 0,58 mi | 7,12 mi |
| Cota de TV | 0,80 mi | 0,80 mi | 0,80 mi | 16,00 mi |
| Patrocínio | 1,90 mi | 1,21 mi | 2,68 mi | 37,94 mi |
| Venda de jogadores e multas | 3,10 mi | 0,00 mi | 8,02 mi | 57,25 mi |
| Prêmios de fim de temporada | 0,00 mi | 0,00 mi | 1,35 mi | 3,64 mi |
| **Receita total** | 7,74 mi | 4,33 mi | 16,72 mi | 165,56 mi |
| Salários | 0,77 mi | 0,39 mi | 1,48 mi | 15,80 mi |
| Despesas fixas e custos de jogo | 0,80 mi | 0,66 mi | 1,02 mi | 16,19 mi |
| Compra de jogadores | 2,36 mi | 0,00 mi | 6,39 mi | 49,64 mi |
| Obras no estádio | 0,00 mi | 0,00 mi | 0,00 mi | 0,00 mi |
| Marketing | 0,00 mi | 0,00 mi | 0,00 mi | 0,00 mi |
| **Despesa total** | 4,23 mi | 1,08 mi | 8,22 mi | 81,63 mi |
| **Resultado da temporada** | 3,25 mi | −1,38 mi | 14,28 mi | 83,92 mi |
| Caixa no início | 3,62 mi | 3,10 mi | 4,29 mi | 72,10 mi |
| Caixa no fim | 6,93 mi | 2,11 mi | 18,57 mi | 156,02 mi |

- Resultado negativo na temporada: **2 de 20 clubes** (América-MG −1,38 mi, Atlético-GO −0,36 mi). Caixa final negativo: **0**.
- Receita recorrente (estádio + sócios + TV + patrocínio) mediana 4,98 mi, contra custo recorrente (salários + fixas + custos de jogo) de 1,62 mi: o clube mediano sobra 3,50 mi antes de qualquer compra de jogador.
- Peso na receita recorrente: estádio 42%, sócios 7%, TV 15%, patrocínio 36%.
- Lotação média dos jogos em casa: mediana 62%, de 48% a 72%.
- Vendas de jogadores na série: 57,25 mi; compras: 49,64 mi.

### Receitas por clube

| Clube | Estádio (total) | Arquibancada | Cadeiras | VIP | Sócios | Venda de jogadores e multas | Patrocínio | TV | Prêmios | **Receita total** |
|---|---|---|---|---|---|---|---|---|---|---|
| Fluminense | 3,29 mi | 1,57 mi | 1,31 mi | 0,42 mi | 0,58 mi | 8,02 mi | 2,68 mi | 0,80 mi | 1,35 mi | **16,72 mi** |
| Ceará | 3,24 mi | 1,55 mi | 1,29 mi | 0,41 mi | 0,46 mi | 7,54 mi | 2,38 mi | 0,80 mi | 0,60 mi | **15,03 mi** |
| Santa Cruz | 2,54 mi | 1,21 mi | 1,01 mi | 0,32 mi | 0,41 mi | 6,31 mi | 2,24 mi | 0,80 mi | 0,25 mi | **12,56 mi** |
| Fortaleza | 2,65 mi | 1,27 mi | 1,05 mi | 0,33 mi | 0,44 mi | 5,95 mi | 2,35 mi | 0,80 mi | 0,00 mi | **12,19 mi** |
| Remo | 2,60 mi | 1,24 mi | 1,03 mi | 0,33 mi | 0,40 mi | 4,85 mi | 2,31 mi | 0,80 mi | 0,15 mi | **11,11 mi** |
| Náutico | 2,96 mi | 1,42 mi | 1,17 mi | 0,37 mi | 0,43 mi | 3,10 mi | 2,31 mi | 0,80 mi | 0,70 mi | **10,30 mi** |
| Paysandu | 2,67 mi | 1,28 mi | 1,06 mi | 0,34 mi | 0,40 mi | 3,06 mi | 2,36 mi | 0,80 mi | 0,12 mi | **9,41 mi** |
| Botafogo-SP | 1,71 mi | 0,82 mi | 0,68 mi | 0,22 mi | 0,28 mi | 4,47 mi | 1,59 mi | 0,80 mi | 0,00 mi | **8,86 mi** |
| Bragantino | 2,13 mi | 1,02 mi | 0,84 mi | 0,27 mi | 0,35 mi | 3,58 mi | 1,62 mi | 0,80 mi | 0,00 mi | **8,48 mi** |
| Figueirense | 1,72 mi | 0,82 mi | 0,68 mi | 0,22 mi | 0,31 mi | 3,24 mi | 1,67 mi | 0,80 mi | 0,00 mi | **7,74 mi** |
| XV de Piracicaba | 1,33 mi | 0,63 mi | 0,53 mi | 0,17 mi | 0,24 mi | 3,27 mi | 1,21 mi | 0,80 mi | 0,00 mi | **6,85 mi** |
| Vila Nova | 1,73 mi | 0,82 mi | 0,68 mi | 0,22 mi | 0,29 mi | 1,63 mi | 1,54 mi | 0,80 mi | 0,00 mi | **5,98 mi** |
| Goiás | 2,45 mi | 1,17 mi | 0,97 mi | 0,31 mi | 0,42 mi | 0,00 mi | 2,10 mi | 0,80 mi | 0,00 mi | **5,77 mi** |
| Sampaio Corrêa | 1,67 mi | 0,80 mi | 0,66 mi | 0,21 mi | 0,29 mi | 1,59 mi | 1,34 mi | 0,80 mi | 0,00 mi | **5,69 mi** |
| Ponte Preta | 2,09 mi | 0,99 mi | 0,83 mi | 0,26 mi | 0,38 mi | 0,31 mi | 2,00 mi | 0,80 mi | 0,00 mi | **5,58 mi** |
| Criciúma | 1,95 mi | 0,93 mi | 0,77 mi | 0,25 mi | 0,33 mi | 0,32 mi | 1,90 mi | 0,80 mi | 0,00 mi | **5,30 mi** |
| América-MG | 1,75 mi | 0,83 mi | 0,70 mi | 0,22 mi | 0,31 mi | 0,00 mi | 1,82 mi | 0,80 mi | 0,20 mi | **4,89 mi** |
| Atlético-GO | 1,97 mi | 0,94 mi | 0,78 mi | 0,25 mi | 0,26 mi | 0,00 mi | 1,36 mi | 0,80 mi | 0,00 mi | **4,40 mi** |
| Avaí | 1,65 mi | 0,79 mi | 0,66 mi | 0,21 mi | 0,32 mi | 0,00 mi | 1,62 mi | 0,80 mi | 0,00 mi | **4,39 mi** |
| Gama | 1,50 mi | 0,72 mi | 0,59 mi | 0,19 mi | 0,24 mi | 0,00 mi | 1,52 mi | 0,80 mi | 0,27 mi | **4,33 mi** |

### Despesas e resultado por clube

| Clube | Salários | Fixas e custos de jogo | Compra de jogadores | Obras | Marketing | **Despesa total** | **Resultado** | Caixa início → fim |
|---|---|---|---|---|---|---|---|---|
| Fluminense | 1,48 mi | 0,96 mi | 0,00 mi | 0,00 mi | 0,00 mi | **2,44 mi** | **14,28 mi** | 4,29 mi → 18,57 mi |
| Ceará | 0,89 mi | 1,02 mi | 1,92 mi | 0,00 mi | 0,00 mi | **3,82 mi** | **11,20 mi** | 3,93 mi → 15,14 mi |
| Santa Cruz | 0,96 mi | 0,87 mi | 6,39 mi | 0,00 mi | 0,00 mi | **8,22 mi** | **4,34 mi** | 3,81 mi → 8,15 mi |
| Fortaleza | 0,99 mi | 0,88 mi | 2,36 mi | 0,00 mi | 0,00 mi | **4,23 mi** | **7,96 mi** | 3,89 mi → 11,85 mi |
| Remo | 0,75 mi | 0,87 mi | 2,20 mi | 0,00 mi | 0,00 mi | **3,82 mi** | **7,29 mi** | 3,74 mi → 11,02 mi |
| Náutico | 1,17 mi | 0,93 mi | 5,14 mi | 0,00 mi | 0,00 mi | **7,23 mi** | **3,07 mi** | 3,85 mi → 6,93 mi |
| Paysandu | 0,97 mi | 0,91 mi | 5,03 mi | 0,00 mi | 0,00 mi | **6,91 mi** | **2,50 mi** | 3,70 mi → 6,20 mi |
| Botafogo-SP | 0,58 mi | 0,74 mi | 4,64 mi | 0,00 mi | 0,00 mi | **5,96 mi** | **2,90 mi** | 3,30 mi → 6,20 mi |
| Bragantino | 0,59 mi | 0,80 mi | 2,11 mi | 0,00 mi | 0,00 mi | **3,51 mi** | **4,97 mi** | 3,62 mi → 8,59 mi |
| Figueirense | 0,58 mi | 0,72 mi | 3,27 mi | 0,00 mi | 0,00 mi | **4,57 mi** | **3,16 mi** | 3,46 mi → 6,62 mi |
| XV de Piracicaba | 0,46 mi | 0,66 mi | 3,29 mi | 0,00 mi | 0,00 mi | **4,41 mi** | **2,44 mi** | 3,18 mi → 5,62 mi |
| Vila Nova | 0,49 mi | 0,72 mi | 1,66 mi | 0,00 mi | 0,00 mi | **2,87 mi** | **3,11 mi** | 3,42 mi → 6,53 mi |
| Goiás | 1,07 mi | 0,83 mi | 3,24 mi | 0,00 mi | 0,00 mi | **5,14 mi** | **0,63 mi** | 3,81 mi → 4,44 mi |
| Sampaio Corrêa | 0,57 mi | 0,74 mi | 0,00 mi | 0,00 mi | 0,00 mi | **1,31 mi** | **4,38 mi** | 3,38 mi → 7,76 mi |
| Ponte Preta | 0,86 mi | 0,80 mi | 0,31 mi | 0,00 mi | 0,00 mi | **1,97 mi** | **3,61 mi** | 3,77 mi → 7,39 mi |
| Criciúma | 0,72 mi | 0,78 mi | 0,31 mi | 0,00 mi | 0,00 mi | **1,80 mi** | **3,49 mi** | 3,54 mi → 7,03 mi |
| América-MG | 0,92 mi | 0,75 mi | 4,60 mi | 0,00 mi | 0,00 mi | **6,27 mi** | **−1,38 mi** | 3,50 mi → 2,11 mi |
| Atlético-GO | 0,77 mi | 0,83 mi | 3,17 mi | 0,00 mi | 0,00 mi | **4,76 mi** | **−0,36 mi** | 3,22 mi → 2,86 mi |
| Avaí | 0,60 mi | 0,71 mi | 0,00 mi | 0,00 mi | 0,00 mi | **1,30 mi** | **3,09 mi** | 3,58 mi → 6,66 mi |
| Gama | 0,39 mi | 0,69 mi | 0,00 mi | 0,00 mi | 0,00 mi | **1,08 mi** | **3,25 mi** | 3,10 mi → 6,35 mi |

## Série C

### Resumo da série

| Item | Mediana por clube | Menor | Maior | Soma da série |
|---|---|---|---|---|
| Estádio (bilheteria) | 573 mil | 418 mil | 843 mil | 11,72 mi |
|   Arquibancada | 415 mil | 303 mil | 610 mil | 8,48 mi |
|   Cadeiras | 158 mil | 116 mil | 233 mil | 3,25 mi |
|   VIP | 0 | 0 | 0 | 0 |
| Sócios (mensalidades) | 128 mil | 104 mil | 181 mil | 2,63 mi |
| Cota de TV | 250 mil | 250 mil | 250 mil | 5,00 mi |
| Patrocínio | 358 mil | 257 mil | 467 mil | 7,09 mi |
| Venda de jogadores e multas | 201 mil | 0 | 1,60 mi | 7,65 mi |
| Prêmios de fim de temporada | 0 | 0 | 1,17 mi | 2,31 mi |
| **Receita total** | 1,84 mi | 1,05 mi | 3,00 mi | 36,40 mi |
| Salários | 285 mil | 204 mil | 394 mil | 5,78 mi |
| Despesas fixas e custos de jogo | 207 mil | 178 mil | 253 mil | 4,15 mi |
| Compra de jogadores | 141 mil | 0 | 2,18 mi | 9,32 mi |
| Obras no estádio | 0 | 0 | 0 | 0 |
| Marketing | 0 | 0 | 0 | 0 |
| **Despesa total** | 683 mil | 431 mil | 2,66 mi | 19,25 mi |
| **Resultado da temporada** | 820 mil | −531 mil | 2,42 mi | 17,16 mi |
| Caixa no início | 1,11 mi | 1,05 mi | 1,24 mi | 22,52 mi |
| Caixa no fim | 1,96 mi | 613 mil | 3,52 mi | 39,68 mi |

- Resultado negativo na temporada: **4 de 20 clubes** (São Caetano −531 mil, Brasil de Pelotas −429 mil, Santo André −25 mil, Central −271 mil). Caixa final negativo: **0**.
- Receita recorrente (estádio + sócios + TV + patrocínio) mediana 1,32 mi, contra custo recorrente (salários + fixas + custos de jogo) de 477 mil: o clube mediano sobra 831 mil antes de qualquer compra de jogador.
- Peso na receita recorrente: estádio 44%, sócios 10%, TV 19%, patrocínio 27%.
- Lotação média dos jogos em casa: mediana 60%, de 42% a 87%.
- Vendas de jogadores na série: 7,65 mi; compras: 9,32 mi.

### Receitas por clube

| Clube | Estádio (total) | Arquibancada | Cadeiras | VIP | Sócios | Venda de jogadores e multas | Patrocínio | TV | Prêmios | **Receita total** |
|---|---|---|---|---|---|---|---|---|---|---|
| Juventus-SP | 604 mil | 437 mil | 167 mil | 0 | 125 mil | 1,60 mi | 338 mil | 250 mil | 80 mil | **3,00 mi** |
| Joinville | 842 mil | 610 mil | 233 mil | 0 | 181 mil | 815 mil | 444 mil | 250 mil | 400 mil | **2,93 mi** |
| Treze | 634 mil | 459 mil | 175 mil | 0 | 133 mil | 0 | 334 mil | 250 mil | 1,17 mi | **2,52 mi** |
| CSA | 843 mil | 610 mil | 233 mil | 0 | 166 mil | 215 mil | 467 mil | 250 mil | 298 mil | **2,24 mi** |
| América-RN | 744 mil | 538 mil | 206 mil | 0 | 151 mil | 735 mil | 358 mil | 250 mil | 0 | **2,24 mi** |
| São Caetano | 533 mil | 385 mil | 147 mil | 0 | 136 mil | 814 mil | 401 mil | 250 mil | 0 | **2,13 mi** |
| Confiança | 576 mil | 417 mil | 159 mil | 0 | 122 mil | 755 mil | 362 mil | 250 mil | 0 | **2,07 mi** |
| Londrina | 622 mil | 450 mil | 172 mil | 0 | 157 mil | 542 mil | 439 mil | 250 mil | 0 | **2,01 mi** |
| Moto Club | 492 mil | 356 mil | 136 mil | 0 | 119 mil | 665 mil | 334 mil | 250 mil | 0 | **1,86 mi** |
| Santo André | 446 mil | 323 mil | 123 mil | 0 | 111 mil | 761 mil | 269 mil | 250 mil | 0 | **1,84 mi** |
| Mogi Mirim | 713 mil | 514 mil | 199 mil | 0 | 148 mil | 130 mil | 381 mil | 250 mil | 210 mil | **1,83 mi** |
| CRB | 611 mil | 442 mil | 169 mil | 0 | 142 mil | 141 mil | 369 mil | 250 mil | 0 | **1,51 mi** |
| Caxias | 572 mil | 413 mil | 158 mil | 0 | 133 mil | 0 | 445 mil | 250 mil | 88 mil | **1,49 mi** |
| Campinense | 510 mil | 369 mil | 141 mil | 0 | 119 mil | 201 mil | 328 mil | 250 mil | 0 | **1,41 mi** |
| Ituano | 491 mil | 353 mil | 138 mil | 0 | 114 mil | 129 mil | 337 mil | 250 mil | 0 | **1,32 mi** |
| Volta Redonda | 549 mil | 397 mil | 152 mil | 0 | 127 mil | 0 | 363 mil | 250 mil | 0 | **1,29 mi** |
| Brasil de Pelotas | 573 mil | 415 mil | 158 mil | 0 | 128 mil | 0 | 277 mil | 250 mil | 60 mil | **1,29 mi** |
| Central | 461 mil | 330 mil | 130 mil | 0 | 104 mil | 142 mil | 257 mil | 250 mil | 0 | **1,21 mi** |
| Americano | 491 mil | 356 mil | 136 mil | 0 | 113 mil | 0 | 311 mil | 250 mil | 0 | **1,17 mi** |
| Operário-MS | 418 mil | 303 mil | 116 mil | 0 | 106 mil | 0 | 275 mil | 250 mil | 0 | **1,05 mi** |

### Despesas e resultado por clube

| Clube | Salários | Fixas e custos de jogo | Compra de jogadores | Obras | Marketing | **Despesa total** | **Resultado** | Caixa início → fim |
|---|---|---|---|---|---|---|---|---|
| Juventus-SP | 265 mil | 212 mil | 105 mil | 0 | 0 | **582 mil** | **2,42 mi** | 1,10 mi → 3,52 mi |
| Joinville | 384 mil | 248 mil | 814 mil | 0 | 0 | **1,45 mi** | **1,49 mi** | 1,24 mi → 2,73 mi |
| Treze | 315 mil | 216 mil | 0 | 0 | 0 | **531 mil** | **1,99 mi** | 1,13 mi → 3,12 mi |
| CSA | 394 mil | 253 mil | 0 | 0 | 0 | **648 mil** | **1,59 mi** | 1,19 mi → 2,78 mi |
| América-RN | 329 mil | 239 mil | 0 | 0 | 0 | **568 mil** | **1,67 mi** | 1,18 mi → 2,84 mi |
| São Caetano | 293 mil | 195 mil | 2,18 mi | 0 | 0 | **2,66 mi** | **−531 mil** | 1,14 mi → 613 mil |
| Confiança | 261 mil | 208 mil | 108 mil | 0 | 0 | **577 mil** | **1,49 mi** | 1,10 mi → 2,59 mi |
| Londrina | 367 mil | 209 mil | 108 mil | 0 | 0 | **683 mil** | **1,33 mi** | 1,21 mi → 2,53 mi |
| Moto Club | 223 mil | 189 mil | 850 mil | 0 | 0 | **1,26 mi** | **598 mil** | 1,08 mi → 1,68 mi |
| Santo André | 204 mil | 182 mil | 1,48 mi | 0 | 0 | **1,86 mi** | **−25 mil** | 1,08 mi → 1,06 mi |
| Mogi Mirim | 328 mil | 222 mil | 141 mil | 0 | 0 | **692 mil** | **1,14 mi** | 1,16 mi → 2,30 mi |
| CRB | 338 mil | 213 mil | 142 mil | 0 | 0 | **693 mil** | **820 mil** | 1,18 mi → 2,00 mi |
| Caxias | 272 mil | 201 mil | 865 mil | 0 | 0 | **1,34 mi** | **149 mil** | 1,14 mi → 1,29 mi |
| Campinense | 227 mil | 198 mil | 206 mil | 0 | 0 | **631 mil** | **777 mil** | 1,11 mi → 1,89 mi |
| Ituano | 236 mil | 195 mil | 129 mil | 0 | 0 | **559 mil** | **761 mil** | 1,07 mi → 1,83 mi |
| Volta Redonda | 243 mil | 198 mil | 0 | 0 | 0 | **441 mil** | **847 mil** | 1,11 mi → 1,96 mi |
| Brasil de Pelotas | 322 mil | 207 mil | 1,19 mi | 0 | 0 | **1,72 mi** | **−429 mil** | 1,11 mi → 684 mil |
| Central | 285 mil | 190 mil | 1,01 mi | 0 | 0 | **1,49 mi** | **−271 mil** | 1,05 mi → 779 mil |
| Americano | 242 mil | 195 mil | 0 | 0 | 0 | **437 mil** | **729 mil** | 1,08 mi → 1,81 mi |
| Operário-MS | 252 mil | 178 mil | 0 | 0 | 0 | **431 mil** | **619 mil** | 1,07 mi → 1,68 mi |

## Série D

### Resumo da série

| Item | Mediana por clube | Menor | Maior | Soma da série |
|---|---|---|---|---|
| Estádio (bilheteria) | 290 mil | 55 mil | 498 mil | 5,02 mi |
|   Arquibancada | 234 mil | 45 mil | 402 mil | 4,04 mi |
|   Cadeiras | 56 mil | 11 mil | 97 mil | 980 mil |
|   VIP | 0 | 0 | 0 | 0 |
| Sócios (mensalidades) | 66 mil | 13 mil | 108 mil | 1,13 mi |
| Cota de TV | 80 mil | 80 mil | 80 mil | 1,60 mi |
| Patrocínio | 73 mil | 6 mil | 103 mil | 1,35 mi |
| Venda de jogadores e multas | 235 mil | 0 | 1,11 mi | 5,63 mi |
| Prêmios de fim de temporada | 0 | 0 | 194 mil | 608 mil |
| **Receita total** | 711 mil | 155 mil | 1,90 mi | 15,33 mi |
| Salários | 140 mil | 95 mil | 198 mil | 2,71 mi |
| Despesas fixas e custos de jogo | 67 mil | 33 mil | 98 mil | 1,23 mi |
| Compra de jogadores | 170 mil | 0 | 906 mil | 3,97 mi |
| Obras no estádio | 0 | 0 | 0 | 0 |
| Marketing | 0 | 0 | 0 | 0 |
| **Despesa total** | 340 mil | 128 mil | 1,13 mi | 7,91 mi |
| **Resultado da temporada** | 208 mil | −59 mil | 1,50 mi | 7,42 mi |
| Caixa no início | 541 mil | 397 mil | 608 mil | 10,15 mi |
| Caixa no fim | 745 mil | 367 mil | 2,07 mi | 17,58 mi |

- Resultado negativo na temporada: **1 de 20 clubes** (Guarany de Bagé −59 mil). Caixa final negativo: **0**.
- Receita recorrente (estádio + sócios + TV + patrocínio) mediana 509 mil, contra custo recorrente (salários + fixas + custos de jogo) de 192 mil: o clube mediano sobra 301 mil antes de qualquer compra de jogador.
- Peso na receita recorrente: estádio 55%, sócios 12%, TV 18%, patrocínio 15%.
- Lotação média dos jogos em casa: mediana 56%, de 26% a 89%.
- Vendas de jogadores na série: 5,63 mi; compras: 3,97 mi.

### Receitas por clube

| Clube | Estádio (total) | Arquibancada | Cadeiras | VIP | Sócios | Venda de jogadores e multas | Patrocínio | TV | Prêmios | **Receita total** |
|---|---|---|---|---|---|---|---|---|---|---|
| Comercial-MS | 498 mil | 402 mil | 97 mil | 0 | 108 mil | 1,11 mi | 103 mil | 80 mil | 0 | **1,90 mi** |
| Operário-VG | 441 mil | 355 mil | 86 mil | 0 | 91 mil | 879 mil | 101 mil | 80 mil | 194 mil | **1,79 mi** |
| Anápolis | 361 mil | 292 mil | 70 mil | 0 | 89 mil | 635 mil | 89 mil | 80 mil | 30 mil | **1,28 mi** |
| Villa Nova-MG | 382 mil | 305 mil | 77 mil | 0 | 76 mil | 371 mil | 68 mil | 80 mil | 40 mil | **1,02 mi** |
| Rio Branco-AC | 395 mil | 313 mil | 81 mil | 0 | 93 mil | 84 mil | 98 mil | 80 mil | 180 mil | **929 mil** |
| Nacional-AM | 456 mil | 368 mil | 88 mil | 0 | 103 mil | 85 mil | 87 mil | 80 mil | 84 mil | **895 mil** |
| Ypiranga-RS | 319 mil | 257 mil | 62 mil | 0 | 69 mil | 228 mil | 88 mil | 80 mil | 0 | **784 mil** |
| Rio Branco-ES | 90 mil | 73 mil | 17 mil | 0 | 22 mil | 540 mil | 41 mil | 80 mil | 0 | **773 mil** |
| Itabaiana | 290 mil | 234 mil | 56 mil | 0 | 66 mil | 250 mil | 73 mil | 80 mil | 0 | **759 mil** |
| Ceilândia | 228 mil | 184 mil | 44 mil | 0 | 54 mil | 235 mil | 74 mil | 80 mil | 40 mil | **711 mil** |
| Tupi | 376 mil | 304 mil | 73 mil | 0 | 82 mil | 56 mil | 92 mil | 80 mil | 0 | **686 mil** |
| Ferroviário | 333 mil | 269 mil | 64 mil | 0 | 77 mil | 0 | 92 mil | 80 mil | 0 | **582 mil** |
| Colatina | 114 mil | 92 mil | 22 mil | 0 | 26 mil | 271 mil | 58 mil | 80 mil | 0 | **549 mil** |
| Guarany de Bagé | 93 mil | 75 mil | 18 mil | 0 | 21 mil | 305 mil | 42 mil | 80 mil | 0 | **541 mil** |
| Marília | 119 mil | 96 mil | 23 mil | 0 | 29 mil | 250 mil | 31 mil | 80 mil | 0 | **509 mil** |
| Olaria | 146 mil | 118 mil | 28 mil | 0 | 33 mil | 172 mil | 62 mil | 80 mil | 0 | **493 mil** |
| Sertãozinho | 193 mil | 155 mil | 37 mil | 0 | 44 mil | 83 mil | 57 mil | 80 mil | 0 | **457 mil** |
| Bangu | 72 mil | 58 mil | 14 mil | 0 | 17 mil | 82 mil | 58 mil | 80 mil | 0 | **309 mil** |
| Tuna Luso | 60 mil | 48 mil | 12 mil | 0 | 13 mil | 0 | 27 mil | 80 mil | 40 mil | **220 mil** |
| Madureira (jogador) | 55 mil | 45 mil | 11 mil | 0 | 14 mil | 0 | 6 mil | 80 mil | 0 | **155 mil** |

### Despesas e resultado por clube

| Clube | Salários | Fixas e custos de jogo | Compra de jogadores | Obras | Marketing | **Despesa total** | **Resultado** | Caixa início → fim |
|---|---|---|---|---|---|---|---|---|
| Comercial-MS | 187 mil | 98 mil | 253 mil | 0 | 0 | **538 mil** | **1,36 mi** | 608 mil → 1,97 mi |
| Operário-VG | 191 mil | 90 mil | 1 mil | 0 | 0 | **283 mil** | **1,50 mi** | 570 mil → 2,07 mi |
| Anápolis | 144 mil | 77 mil | 906 mil | 0 | 0 | **1,13 mi** | **156 mil** | 589 mil → 745 mil |
| Villa Nova-MG | 148 mil | 81 mil | 0 | 0 | 0 | **229 mil** | **788 mil** | 550 mil → 1,34 mi |
| Rio Branco-AC | 155 mil | 82 mil | 84 mil | 0 | 0 | **321 mil** | **608 mil** | 579 mil → 1,19 mi |
| Nacional-AM | 186 mil | 92 mil | 81 mil | 0 | 0 | **359 mil** | **537 mil** | 598 mil → 1,13 mi |
| Ypiranga-RS | 109 mil | 71 mil | 0 | 0 | 0 | **180 mil** | **604 mil** | 550 mil → 1,15 mi |
| Rio Branco-ES | 104 mil | 38 mil | 544 mil | 0 | 0 | **686 mil** | **87 mil** | 435 mil → 522 mil |
| Itabaiana | 141 mil | 67 mil | 251 mil | 0 | 0 | **459 mil** | **300 mil** | 541 mil → 841 mil |
| Ceilândia | 107 mil | 57 mil | 454 mil | 0 | 0 | **618 mil** | **93 mil** | 512 mil → 605 mil |
| Tupi | 153 mil | 81 mil | 0 | 0 | 0 | **234 mil** | **452 mil** | 570 mil → 1,02 mi |
| Ferroviário | 198 mil | 73 mil | 0 | 0 | 0 | **271 mil** | **311 mil** | 560 mil → 871 mil |
| Colatina | 129 mil | 41 mil | 170 mil | 0 | 0 | **340 mil** | **208 mil** | 445 mil → 653 mil |
| Guarany de Bagé | 102 mil | 37 mil | 462 mil | 0 | 0 | **600 mil** | **−59 mil** | 426 mil → 367 mil |
| Marília | 102 mil | 41 mil | 246 mil | 0 | 0 | **389 mil** | **120 mil** | 454 mil → 574 mil |
| Olaria | 105 mil | 46 mil | 178 mil | 0 | 0 | **330 mil** | **163 mil** | 464 mil → 627 mil |
| Sertãozinho | 140 mil | 52 mil | 260 mil | 0 | 0 | **452 mil** | **5 mil** | 483 mil → 488 mil |
| Bangu | 95 mil | 34 mil | 83 mil | 0 | 0 | **212 mil** | **97 mil** | 416 mil → 513 mil |
| Tuna Luso | 120 mil | 34 mil | 0 | 0 | 0 | **154 mil** | **65 mil** | 397 mil → 462 mil |
| Madureira (jogador) | 96 mil | 33 mil | 0 | 0 | 0 | **128 mil** | **27 mil** | 406 mil → 433 mil |


## Principais achados

1. **Receita muito acima da despesa em todas as séries.** Mediana por clube: A recebe 29,9 mi e gasta 16,7 mi (sobra 16,2 mi); B recebe 7,7 e gasta 4,2 (sobra 3,3); C recebe 1,8 e gasta 0,7 (sobra 0,8); D recebe 0,71 e gasta 0,34 (sobra 0,21). Só 1 clube da A, 2 da B, 4 da C e 1 da D tiveram resultado negativo no ano, e nenhum terminou com caixa negativo.
2. **Patrocínio é a maior fonte da Série A (44% da receita recorrente), seguido do estádio (39%).** Sócios pesam só 5% e a TV 12% (cota fixa igual para todos). O patrocínio sozinho (11,3 mi) paga quase 2,5 vezes a folha salarial (4,55 mi).
3. **Salários são leves:** 18% da receita recorrente na A, 15% na B, 22% na C e 30% na D. Custos fixos e de jogo ficam entre 4 e 5 mi na A.
4. **Dentro do estádio, o VIP e as cadeiras dominam a Série A:** VIP 24%, cadeiras 44% e arquibancada 32% da bilheteria. Na B 13/40/48, na C 0/28/72 e na D 0/20/80.
5. **Compras e vendas de jogadores se cancelam dentro de cada série** (A: vendas 126,8 mi contra compras 134,4 mi), então o mercado só redistribui dinheiro entre clubes. Os maiores compradores líquidos da A: Sport (−12,8 mi), Bahia (−12,5) e Palmeiras (−10,9). Os maiores vendedores: Flamengo (+15,8), Grêmio (+11,2) e Cruzeiro (+9,9). Cerca de 5 clubes da A, 4 da B e 6 da C e da D não compraram ninguém.
6. **Marketing é gasto, não receita, e o computador não usa:** nenhum clube do computador gastou com marketing. O retorno do marketing só existe para o jogador (aumenta a bilheteria do jogo).
7. **Obras:** nenhum clube do computador fez obra na 1ª temporada, pois nenhuma área passou de 90% de lotação média (lotação mediana de jogos em casa na A: 67%).
8. **O único clube no vermelho da Série A, o Sport,** perdeu dinheiro por comprar demais (20,3 mi em jogadores, contra 12,2 mi de caixa inicial), o que mostra que a compra por necessidade é o único mecanismo hoje capaz de gerar prejuízo.

## O que isso diz para o próximo passo

- Hoje o prejuízo só aparece quando o computador compra muito. As fontes de receita (patrocínio e estádio) cobrem com folga os custos fixos e os salários.
- As alavancas já listadas no relatório 20 continuam valendo: reduzir patrocínio do computador, custos e salários subindo com o prestígio, obras financiadas e dívida, multa e venda forçada quando o caixa fica negativo. Nada foi alterado.
- Limitações: uma semente e uma temporada. O clube do jogador ficou parado e foi tratado como computador. Scripts: `f33.js` e `g33.js`.
