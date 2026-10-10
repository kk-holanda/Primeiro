# Kfoot 98 — Relatório 4: reteste da v21 (Melhorias #17) contra o relatório 3

Versão testada: branch `claude/melhorias-5-xt6u1f`, commit a4a8612 (v21). Nada foi alterado no código, nada foi enviado ao repositório e o artefato não foi republicado. Mesmo método dos relatórios 2 e 3 (motor real em Node, elencos clonados, sementes comuns, rodízio de estratégias; ± é erro padrão). Scripts e resultados brutos em `scripts-04/` (os demais scripts são os de `scripts-03/`). Medições da outra thread: `06-medicoes-melhorias-17.md`.

## Resumo em uma página

1. **A maior parte do que o relatório 3 apontou foi resolvida.** Pênaltis da Copa usam jogadores; gols nas divisões baixas voltaram (D 2,42, C 2,54, B 2,74; 0×0 em 7,1%); a grade de formações e táticas ficou plana (amplitude 0,08 ppg contra 0,22); a Série B ficou mais aberta; o mercado ficou mais caro e menos explosivo.
2. **O mercado ainda é a alavanca mais forte, mas agora é gradual.** Robô comprando + livres + treinando jovens na D: sobe para a C em 50% das campanhas de 8 anos e para a B em 3% (v19: 93% e 60%). Clubes de B e C chegam à A em 40% (v19: 67%; parados: 3%).
3. **A stamina virou a alavanca mais punitiva do jogo.** A curva ficou quadrática (piso 0,55): começar o jogo com stamina 90 em vez de 100 custa 0,52 ppg e com 80 custa 0,95 ppg (v19: 0,24 e 0,44). O modo "sempre o melhor 11, sem rodízio" caiu para 0,30 ppg numa sequência de jogos (v19: 0,76). Para o técnico, rodar o elenco agora decide mais que quase tudo.
4. **Intervalo continua valendo** (+0,10 ppg para a resposta certa, −0,03 para a errada) e a **sinergia segue neutra**.
5. **Elenco de ataque técnico ainda rende mais que o de defesa**, mas menos desequilibrado: ataque +0,40 ppg (v19 +0,50), muralha +0,07 (v19 −0,08), passadores +0,25.
6. **Habilidade tática do técnico agora aparece um pouco:** expert 1,168 contra passivo 1,054 (+0,11 ppg; v19 +0,015).
7. **Sem regressões técnicas:** interface (12 jogos pelo navegador, compra, treino, escalação, mercado novo) sem erro de JavaScript; resultado idêntico entre execuções com 1, 4 e 8 humanos e entre o caminho da tela e a simulação rápida.

## 1. Comparação com o relatório 3

### 1.1 Mundo e caos (90.612 jogos de liga, 3 mundos × 6 anos)

| Indicador | v19 | v21 |
|---|---|---|
| Gols por jogo (A / B / C / D) | 2,76 / 2,39 / 1,99 / 1,84 | 2,81 / 2,74 / 2,54 / 2,42 |
| Gols por jogo, total | 2,28 | 2,67 |
| 0×0 | 11,3% | 7,1% |
| Jogos com 7+ gols | 1,0% | 1,7% |
| Mandante / empate / visitante | 40,2 / 25,7 / 34,0 | 42,2 / 23,0 / 34,9 |
| Chutes por jogo (no alvo) | 21,7 (8,5) | 24,7 (10,1) |
| Pênaltis (lances) por jogo | 0,34 | 0,44 |
| Série A: ρ força × posição | 0,77 | 0,77 |
| Série A: campeão era o mais forte | 41% | 24% |
| Série A: campeões em 54 temporadas | Corinthians 14, Flamengo 12, Vasco 8… (10 clubes) | Palmeiras 10, Flamengo 10, São Paulo 9, Corinthians 7, Vasco 6… (10 clubes) |
| Série B: ρ / campeão = mais forte | 0,86 / 74% | 0,84 / 52% |
| Série C / D: ρ | 0,64 / 0,88 | 0,67 / 0,89 |
| Lotação A / B / C / D | 61 / 45 / 34 / 25% | 61 / 46 / 34 / 25% |
| Resultado anual A / B / C / D (R$ mil) | 3.484 / 1.125 / 474 / 146 | 3.030 / 997 / 433 / 126 |

Gols de volta a um patamar realista em todas as divisões (jogos entre times iguais, 500 por linha: prestígio 15 → 2,53; 90 → 2,82). O campeão da A deixou de ser o mais forte em 76% das temporadas e nenhum clube domina (máximo 10 de 54). A Série B segue a mais previsível entre as divisões (ρ 0,84), mas bem menos que antes.

### 1.2 Posições, atributos e goleiro (1.500 jogos por linha, ppg base 1,385 ±0,024)

| Mudança de +10 de overall em um jogador | v19 | v21 |
|---|---|---|
| Goleiro | +0,12 | +0,11 |
| Lateral | +0,10 | +0,08 a +0,10 |
| Zagueiro | +0,09 | +0,06 |
| Volante | +0,17 | +0,14 |
| Meia central | +0,15 a +0,21 | +0,13 |
| Ala | +0,17 a +0,22 | +0,16 |
| Centroavante / segundo atacante | +0,24 / +0,27 | +0,18 / +0,19 |

| +10 nos 11 titulares | v19 | v21 |
|---|---|---|
| Finalização | +0,32 | +0,29 |
| Passe | +0,30 | +0,30 |
| Defesa | +0,30 | +0,28 |
| Drible | +0,25 | +0,23 |
| Ritmo | +0,25 | +0,18 |
| Físico | +0,13 | +0,17 |

O Físico subiu e o Ritmo caiu um pouco: os seis atributos agora ficam numa faixa estreita (0,17 a 0,30). Perfil com mesmo overall: atacantes com Finalização +12 → +0,09 (v19 +0,19); meias com Passe +12 → +0,12 (v19 +0,22); meias com Físico +12 → −0,05; defensores com Defesa +12 → −0,01 (a Defesa específica de zagueiro e lateral continua sem retorno além do overall). Goleiro: elite (+15) 1,556, ruim (−20) 1,158. Jogador de linha no gol: sofre 2,70 a 2,90 gols (v19 2,5 a 2,6), pior caso 0,51 ppg. Fora de posição: goleiro de centroavante 1,01, goleiro de zagueiro 1,16, centroavante de zagueiro 1,14 (como antes).

### 1.3 Formações e táticas (grade de 24, 4.830 jogos por célula)

| Formação | Ofensivo | Equilibrado | Defensivo | Contra |
|---|---|---|---|---|
| 3-4-3 | 1,367 | 1,386 | 1,390 | 1,366 |
| 4-4-2 | 1,363 | 1,361 | 1,369 | 1,352 |
| 4-3-3 | 1,359 | 1,358 | 1,336 | 1,376 |
| 4-5-1 | 1,332 | 1,360 | 1,354 | 1,362 |
| 3-5-2 | 1,337 | 1,375 | 1,336 | 1,340 |
| 4-2-3-1 | 1,308 | 1,331 | 1,354 | 1,343 |

Amplitude 0,08 ppg (v19 0,22). Por formação: 3-4-3 1,377, 4-4-2 1,361, 4-3-3 1,357, 4-5-1 1,352, 3-5-2 1,347, 4-2-3-1 1,334. Por tática: equilibrado 1,362, defensivo 1,356, contra 1,356, ofensivo 1,344. "Contra" deixou de ser a pior. O 3-4-3 ainda lidera, mas por 0,02 (dentro de ~1 erro padrão). O 4-2-3-1 segue por último.

### 1.4 Intervalo, sinergia, rodízio (900 jogos; rodízio 300 campanhas)

Sinergia: médias −0,03% / −0,04% / +0,03%, p95 2,3%, máximo 6,3% (neutra). Intervalo: nada 1,355; resposta certa 1,458 (+0,10); certa + formação 1,438; errada 1,327 (−0,03); inverso 1,344; sorteio 1,363. Funciona com o computador reagindo.

### 1.5 Stamina, moral (1.500 jogos por linha)

| Condição | v19 | v21 |
|---|---|---|
| Stamina inicial 90 | 1,13 (−0,24) | 0,84 (−0,52) |
| Stamina inicial 80 | 0,94 (−0,44) | 0,40 (−0,95) |
| Stamina inicial 70 | 0,70 | 0,19 |
| "Sempre o melhor 11" numa sequência de jogos | 0,763 | 0,296 |

A causa está na mudança da curva (`staminaMin` 0,70 → 0,55 e expoente 2). Um titular com stamina 80 rende 84% (era 94%). Não é um bug, é uma escolha de design, mas o efeito é grande: perder 10 pontos de stamina vale tanto quanto ~10 pontos de overall. Sugiro conferir se o ritmo de recuperação (~16% da diferença por dia) acompanha, para o humano conseguir jogar de 3 em 3 dias sem punição pesada. Moral: terço de baixo da tabela perde menos (Série A 64 → 60, Série D 61 → 59; v19 62 → 48 e 62 → 49). A moral do técnico no terço de baixo continua em espiral (D: 22 → 7).

### 1.6 Copa e pênaltis

| Confronto | Liga: forte vence | Copa: forte vence |
|---|---|---|
| 80 × 80 | 35% | 38% |
| 70 × 40 | 82% | 63% |
| 90 × 30 | 99% | 82% |
| 60 × 20 | 94% | 71% |

Disputa de pênaltis (3.000 por linha, 10 melhores de linha e melhor goleiro): visitante vence 40,1% com times iguais (vantagem do mando), 54,3% quando o visitante é muito mais forte (85 × 25) e 27,8% quando é muito mais fraco. A escolha do batedor pelo humano é respeitada (o `batedor` configurado passa para o início da fila). A moral tem efeito pequeno (41,3% e 38,5% com 90 × 30 e 30 × 90). Corrigido: não é mais moeda.

## 2. Mercado, treino e base (o ponto central)

### 2.1 Compra de reforços por clubes da D (Δ ppg, média das 10 posições, jogos contra D / contra B)

| Origem | v19 | v21 |
|---|---|---|
| Série D | +0,04 / +0,03 | +0,03 / +0,02 |
| Série C | +0,08 / +0,03 | +0,10 / +0,02 |
| Série B | +0,15 / +0,05 | +0,18 / +0,03 |
| Série A | +0,25 / +0,08 | +0,27 / +0,06 |

O ganho em campo é igual (era esperado, o motor de partida não mudou nesse ponto). Preço médio pedido: C R$ 111 mil, B R$ 393 mil, A R$ 2,17 mi (v19: 115 / 363 / 2.258). Ou seja, o encarecimento (+13% em valor, +10% em salário) foi pequeno. Na tela, jogadores veteranos da A (33 a 37 anos, média 63 a 68) aparecem no topo de "Melhora para o meu time" por R$ 210 a 295 mil, com Δ de +28 a +31 para um clube da D; o desconto por idade é o que torna o mercado barato.

### 2.2 Campanhas do técnico-robô (30 campanhas por linha; mesmos mundos e estratégias do relatório 3)

D, 8 anos, 10 piores clubes:

| Estratégia | Força (início → fim) | ppg 1º ano | Chegou à C / B | Caixa final | v19 (C / B) |
|---|---|---|---|---|---|
| Passivo | 45,9 → 40,2 | 0,87 | 0% / 0% | R$ 243 mil | 0% / 0% |
| Só treina (Formador) | 45,9 → 43,7 | 0,95 | 3% / 0% | R$ 160 mil | 3% / 0% |
| Só livres | 45,9 → 45,9 | 1,10 | 20% / 0% | R$ 415 mil | 40% / 7% |
| Compra | 45,9 → 42,7 | 1,11 | 7% / 0% | −R$ 47 mil | 23% / 7% |
| Compra + livres | 45,9 → 45,2 | 1,18 | 10% / 0% | −R$ 79 mil | 27% / 10% |
| Compra + treina (Formador) | 45,9 → 51,9 | 1,63 | 50% / 3% | −R$ 26 mil | 93% / 60% |
| Compra + livres + treino Ofensivista / Retranqueiro | → 45,5 / 45,5 | 1,22 / 1,17 | 20% / 13% | | 30% / 53% |

B e C, 6 anos: passivo 1,19 ppg e chega à A em 3%; compra + livres + treino 1,61 ppg, chega à B em 100% e à A em **40%** (v19: 67%), caixa final R$ 1,95 mi (v19: 2,7 mi).

Leituras: (a) o mercado perdeu cerca de metade do efeito, o desejado: sair da D leva muitos anos e quem só joga continua preso; (b) livres perderam o efeito quase de graça (20% contra 40% para a C); (c) o treino de jovens continua sendo o multiplicador (50% contra 7% a 10% sem ele); (d) os robôs compradores terminam com caixa negativo (−R$ 26 a −79 mil), ou seja, o robô (que gasta 60% do caixa sem ver a folha) quebra o clube. Não verifiquei o que o jogo faz com caixa negativo do humano (demissão? bloqueio de compra?), o que merece um teste próprio.

### 2.3 O computador comprando (política "mesmo nível ou abaixo", 3 mundos × 8 anos)

| Política | Compras/temporada | ρ força×posição (A / B / C / D) | Campeões da A em 24 temporadas | Caixa D no ano 8 |
|---|---|---|---|---|
| Nenhuma (como o jogo faz hoje) | 0 | 0,81 / 0,85 / 0,71 / 0,90 | 6 clubes | R$ 883 mil |
| Subida | 142 | 0,76 / 0,80 / 0,62 / 0,88 | 7 clubes | R$ 967 mil |

Reforça a conclusão do relatório 3: o computador comprando entre si traz um pouco mais de equilíbrio, sem esvaziar o caixa da D. O jogo continua sem implementar isso.

### 2.4 Técnicos do computador (6 personalidades, 4 mundos × 8 anos, resíduo de pontos por temporada ±~0,45)

Formador +1,65, Ofensivista +0,06, Preparador −0,26, Estrategista −0,35, Retranqueiro −0,97, Professor −0,97. Amplitude 2,6 pontos por temporada, como na v19, mas a ordem mudou (no relatório 3: Professor +1,1, Retranqueiro −1,4). Sinal estável: personalidade muda ~1 a 2 pontos por temporada, o Formador é o mais forte nas duas medições mais recentes (v19: +0,07 e v21: +1,65) e o Retranqueiro o mais fraco nas duas.

### 2.5 Elencos montados à mão (mesmo overall, 5 estilos, 3 anos, 20 temporadas-clube por linha no 1º ano)

| Elenco | ppg 1º ano | v19 |
|---|---|---|
| Controle | 0,77 | 0,91 |
| Ataque técnico (4-3-3 ofensivo) | 1,17 | 1,42 |
| Muralha (4-5-1 defensivo) | 0,84 | 0,83 |
| Passadores (4-2-3-1) | 1,02 | 1,09 |
| Desencontro (ataque técnico em 4-5-1 defensivo) | 1,07 | 1,17 |

Diferenças para o controle: ataque +0,40 (v19 +0,51), passadores +0,25 (+0,18), muralha +0,07 (−0,08), desencontro +0,30 (+0,26). Erro padrão de ~0,07 a 0,10 por linha. A hierarquia (ataque > passe > defesa) continua, mas a distância caiu.

### 2.6 Estilos e habilidade do técnico (campanhas de 1 ano)

Dez estilos: amplitude 0,114 ppg (4,4 pontos por temporada; v19 0,099): Leitor 1,036 no topo, Equilibrado 4-4-2 0,921 por último. Habilidade: aleatório 1,137, passivo 1,054, intuitivo 1,075, estudioso 1,047, expert 1,168. O expert fica +0,11 do passivo (antes 0,015); o aleatório fica competitivo (ruído).

## 3. Interface e multiplayer

- 12 partidas pelo navegador, compra de jogador da C pela tela (caixa R$ 426 mil → 42 mil, elenco +1), treino iniciado, escalação 3-5-2 ofensiva aplicada ao motor, tabs e finanças: **sem erros de JavaScript**.
- Mercado novo na tela: abre com "Só o que cabe no caixa" ligado, colunas MÉD e Δ, filtros de idade e "Só quem melhora meu time", ordenação por custo-benefício; posições extras aparecem (por exemplo "SA/CA", "MC/ALA").
- Ingresso fixo (sem mudança); lotação A 61 / B 46 / C 34 / D 25%, nenhum clube chega ao piso de 3%.
- Determinismo (2 anos): 1, 4 e 8 humanos idênticos entre ao vivo × ao vivo, ao vivo × passo a passo e ao vivo × simulação rápida; 10 humanos na D com táticas independentes.

## 4. Pendências e propostas para discutir

1. **Stamina:** confirmar se a nova curva quadrática é a intenção. Efeito atual: 10 pontos de stamina = ~0,5 ppg. Se for demais, alternativas: expoente 1,5 ou piso de 0,60.
2. **Caixa negativo do humano:** testar o que acontece e avisar antes de comprar (a tela já bloqueia compra acima do caixa, mas não considera a folha mensal e as luvas dos livres).
3. **Veteranos baratos da Série A** dominam a lista "Melhora para o meu time" (R$ 210 a 295 mil por jogadores de 33 a 37 anos). Pode valer um desconto por idade menos agressivo ou contratos com salário que não cai com a idade.
4. **Treino de jovens (Formador) segue como multiplicador** do mercado. Se quiser reduzir ainda mais a diferença entre estratégias, limitar o ganho acumulado por temporada.
5. **O computador comprando e vendendo** continua não implementado; a política "mesmo nível ou abaixo" é a que recomendo.
6. **Defesa de zagueiro e lateral (atributo DEF)** segue sem retorno acima do overall (−0,01 a +0,05).
7. **Série B** ainda tem campeão = mais forte em 52% (Série A 24%), ainda acima do nível de C (37%) e D (35%).
8. **Moral do técnico no terço de baixo** continua em espiral (D: 22 → 7).
