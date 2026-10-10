# Kfoot 98 — Relatório 5: bateria completa na v22 (traits, acréscimos, compras da Série D, técnicos do computador)

Versão testada: v22 (commit "Melhorias #22", branch `claude/melhorias-5-xt6u1f`). Só li o código e simulei; nada foi alterado. Scripts e resultados brutos em `scripts-05/` e `scripts-05/resultados/`. Comparação com o relatório 4 (v21).

Margens de erro: ± é o erro padrão (≈ 2 × para o intervalo de 95%). Pontos por jogo = "ppg" (1 ppg a mais ≈ 38 pontos por temporada).

## 0. Resumo (o que o KK precisa saber)

1. **O campeonato continua equilibrado e nada quebrou.** Gols, mando, empates, correlação força × posição e variedade de campeões praticamente iguais à v21. A Série D agora tem mais gols (2,59 contra 2,42).
2. **Os 14 traits são seguros, mas fracos demais para o jogador sentir.** O conjunto típico (2 a 4 por time) vale **+0,02 ppg** (≈ 0,8 ponto por temporada). O melhor trait sozinho (Matador) vale +0,016 ppg. Há muita margem para aumentar os efeitos sem desbalancear.
3. **Dois traits quase não funcionam:** Salvador da pátria (o computador quase nunca coloca ninguém depois dos 75 minutos: 0,07 substituição por jogo) e Maestro/Líder/Coringa/Highlander/Gelo, que ficam abaixo de 0,01 ppg quando só um jogador os tem.
4. **O sorteio dos traits é torto:** Gelo (19% de todos os traits) e Highlander (13%) dominam; Maestro, Salvador e Desarmador têm 3% cada. **45% dos Highlanders e 17% dos Gelos caem em goleiros**, onde quase não servem.
5. **Acréscimos e prorrogação funcionam:** jogo dura 94,5 min em média (máx. 100 na liga), 6% dos gols saem depois dos 90 min; na Copa, 15% das voltas vão à prorrogação e 8,5% aos pênaltis.
6. **Estrelas:** A 2,9, B 2,1, C 1,6, D 1,2 por time (todas as séries com pelo menos 1).
7. **Compras na Série D:** um craque de ataque sozinho rende menos do que três reforços equilibrados baratos. **Os preços de ataque/meio são de 10 a 20 vezes menores do que os de goleiro/zagueiro/lateral/volante** para um ganho que é só 1,5 a 2 vezes maior (ponto novo, seção 4).
8. **Os 6 pontos da v21 continuam em aberto para o KK decidir** (seção 7), com os números da v22.

## 1. Campeonato no geral (3 mundos × 10 anos, 90.612 jogos de liga)

| Medida | v21 | v22 |
|---|---|---|
| Gols por jogo (A / B / C / D) | 2,67 (2,81 / 2,74 / 2,54 / 2,42) | **2,74** (2,80 / 2,72 / 2,62 / 2,59) |
| Casa / empate / fora | 42,2 / 23,0 / 34,9 | 41,9 / 23,4 / 34,8 |
| 0×0 | 7,1% | 7,2% |
| Goleadas (4+ gols) | — | 3,7% |
| Correlação força inicial × posição final, Série A | 0,77 | 0,76 |
| Campeão da A era o mais forte | 24% | 24% (top 3: 65%) |
| Campeões diferentes da A (54 temporadas) | 10 | 9 (Flamengo 15, Palmeiras 12, Corinthians 9, Vasco 7, Cruzeiro 4, São Paulo 3...) |
| ρ B / C / D | — | 0,81 / 0,67 / 0,91 |
| Pontos do campeão / lanterna (A) | — | 82 / 18 |
| Lotação média A / B / C / D | — | 61% / 46% / 34% / 25% |
| Resultado financeiro por ano (A / B / C / D, R$ mil) | — | +1.948 / +722 / +350 / +113 |

Leitura: a diferença de 10 pontos de overall entre os dois times dá 84% de vitória para o mais forte (e 4% para o mais fraco); 0 de diferença dá 41/28/32. A D tem ρ 0,91 (a mais previsível); a C é a mais aberta (0,67). O mundo de 25 anos sem jogadores humanos mantém o nível das séries estável (top14 A 71,7 a 75,6, D 48,1 a 51,8), sem inflação.

## 2. O que muda o resultado: posição, atributos, tática (base 1,368 ppg, ±0,024)

**+10 de overall em um titular (v21 entre parênteses):** CA +0,22 (+0,18), SA +0,19, VOL +0,14 (+0,14), MC +0,14 (+0,13), ALA +0,10 a +0,11 (+0,16), GOL +0,135 (+0,11), LD +0,10, ZAG +0,08 (+0,06), LE +0,06. **+10 nos 4 meias +0,59; nos 4 defensores +0,41; nos 2 atacantes +0,43.** Praticamente igual à v21. O atacante continua sendo o jogador individual que mais vale.

**+10 em um atributo nos 11 titulares:** Finalização +0,31, Defesa +0,30, Passe +0,27, Drible +0,21, Ritmo +0,19, Físico +0,17 (v21: +0,29 / +0,28 / +0,30 / +0,23 / +0,18 / +0,17). Todos os atributos fazem diferença; Físico é o que menos.

**Formato do overall igual:** atacante com CHU +12 e FIS compensando dá +0,18 ppg; defensor DEF +12 só +0,02; meias com PAS +12 +0,09 e com DRI +12 +0,10; time todo com RIT +12 +0,04 e FIS +12 −0,10. Ou seja, o overall esconde diferenças: finalização do atacante e passe/drible do meio rendem mais do que o overall indica; força física pura rende menos.

**Goleiro:** elite (+15) +0,20; ruim (−20) −0,22. Qualquer jogador de linha no gol dá 0,51 a 0,57 ppg (a escalação errada é fortemente punida; a IA do jogo trata isso). Trocas erradas de posição custam muito: 4 atacantes na defesa 0,61; melhor goleiro no centroavante 1,00.

**Formação × tática (24 combinações, 4.830 jogos cada):** amplitude 0,103 ppg (v21: 0,08). O topo é 3-4-3 defensivo 1,441 (destoa das demais; com ±0,02 por linha e 24 linhas, parte pode ser sorte) e o pior 4-3-3 ofensivo 1,338. As outras 22 combinações estão em 1,343 a 1,394. **Não há formação dominante, mas o ataque total (ofensivo) perde um pouco em quase todas (4-3-3, 4-2-3-1, 4-4-2, 4-5-1 ofensivos estão entre os 6 piores).**

**Intervalo (6.000 jogos por linha):** resposta tática certa +0,10; resposta errada −0,03; formação pelo placar +0,15; sortear não muda nada. Igual à v21. Sinergia ≈ 0 (média −0,15%, p95 2,5%).

**Habilidade do técnico-robô (N=40 por célula):** Aleatório 1,07 / Passivo 1,06 / Intuitivo 1,08 / Estudioso 1,10 / Expert 1,19 ppg. **Expert contra passivo: +0,13 ppg** (v21: +0,11). O estilo (10 estilos) tem amplitude 0,143, mas com N=40 isso está dentro do ruído (±0,07 por estilo).

**Cansaço e moral:** stamina 90/80/70 dão 0,79 / 0,41 / 0,19 ppg (v21: 0,84 / 0,40 / 0,19). Inalterado, ver ponto 1 da seção 7. Moral 0 / 100: 0,92 / 1,64 contra 1,34 de base (±0,3 ppg, efeito grande e saudável). "Sempre o melhor 11" 0,31 contra 0,41 do automático.

**Copa:** um time prestígio 90 contra 30 vence 85% (v21: 82%), 80 × 80 vence 38% e perde 36%. A copa dá mais chance de zebra que a liga (98% na liga para 90 × 30).

## 3. Traits (os 14 novos)

### 3.1 Como são distribuídos (20 mundos, 1.600 times)

2 a 4 traits por time em todos os 1.600 times (média 2,97). 4.753 jogadores com trait em 38.400 (12%). Depois de 12 anos o mínimo continua 2, a média cai para 2,6 (aposentadorias).

| Trait | Qtd | Parte do total | Observação |
|---|---|---|---|
| Gelo | 885 | 18,6% | 17% em goleiros |
| Highlander | 598 | 12,6% | **45% em goleiros** |
| Líder | 433 | 9,1% | 23% em goleiros |
| Coringa | 430 | 9,0% | |
| Cabeção | 419 | 8,8% | 76% em ZAG/VOL |
| Prodígio | 382 | 8,0% | idade média 19,5, máx. 21 (nenhum com 22+ em 12 anos) |
| Popstar | 283 | 6,0% | |
| Catimbeiro | 256 | 5,4% | |
| Batedor de faltas | 255 | 5,4% | |
| Matador | 216 | 4,5% | 54% em CA |
| Driblador | 166 | 3,5% | |
| Desarmador | 149 | 3,1% | |
| Salvador | 142 | 3,0% | |
| Maestro | 139 | 2,9% | só MC (87) e MEI (52) |

O goleiro absorve o que sobra: quase todos os traits têm peso 0 para o goleiro, então quando o sorteio cai nele só restam Gelo, Highlander, Líder e Prodígio. Resultado: goleiros com traits quase inúteis e atacantes com poucos traits úteis.

### 3.2 Efeito de cada trait

Dois testes, 6.000 jogos pareados (mesmo time, com e sem trait, casa/fora alternado): (a) **um jogador** com o trait, (b) o trait em **todos** os jogadores das posições-alvo (mostra o limite superior).

| Trait | O que mede | Em UM jogador (Δ ppg ±) | Em todos os alvos (Δ ppg ±) |
|---|---|---|---|
| Matador | gols dos atacantes | gols +0,021/jogo; **+0,016 ±0,003** | +0,063 gols; +0,042 ±0,010 |
| Batedor de faltas | gols de falta | +0,006 gols; +0,004 ±0,002 | +0,049 gols; +0,025 ±0,011 |
| Cabeção | gols de cabeça | +0,012; +0,009 ±0,004 | +0,069; +0,057 ±0,015 |
| Driblador | passes dos ofensivos | −0,73 passes; +0,018 ±0,011 | −2,2 passes; +0,051 ±0,036 |
| Catimbeiro | faltas do adversário | +0,03; +0,009 ±0,005 | +0,11; +0,014 ±0,016 |
| Desarmador | desarmes | +0,08; +0,008 ±0,006 | +0,45; +0,021 ±0,021 |
| Gelo | cartões | −0,068; +0,001 ±0,002 | −0,59; +0,010 ±0,009 |
| Maestro | assistências dos meias | ≈ 0; +0,001 ±0,006 | +0,003; +0,027 ±0,016 |
| Highlander | lesões do time | −0,002; −0,006 ±0,011 | −0,023; **+0,117 ±0,041** |
| Líder | gols do time | ≈ 0 | ≈ 0 (−0,010 ±0,013) |
| Coringa | gols do time | ≈ 0 | — (não afeta gols; vale por poder jogar em várias posições) |
| Salvador | gols de quem entra aos 75+ | ≈ 0 | +0,001 |
| Popstar / Prodígio | economia e progressão | não mede em jogo | só código |

**Conjunto realista** (2 a 4 traits sorteados como o jogo faz, 8.000 jogos): **+0,020 ±0,009 ppg**, saldo +0,024 ±0,010. Menos de 1 ponto por temporada.

Leituras:

- **Matador** é o único que se destaca em gols: aumenta em 20% a chance de converter o cara a cara (+0,021 gols por jogo, cerca de +0,8 gol por temporada).
- **Highlander** vale quase nada num jogador (+0,006) mas **+0,117 ppg quando todo o time tem**, porque a stamina cai 15% mais devagar e a curva de stamina da v21 é muito punitiva (ponto 1 da seção 7). Isso é um sinal de que o efeito de stamina é forte; um time de Highlanders seria visivelmente melhor.
- **Salvador da pátria:** o computador só substitui aos 60/70/80. Em 400 jogos, o computador só colocou **0,07 jogadores por jogo depois dos 75 minutos** e 0,03 de ataque. Nos times do computador o trait praticamente nunca dispara. Só tem efeito para humano que substitui tarde, perdendo ou empatando.
- **Líder:** age no moral no intervalo quando o time perde e como capitão (+6 de nota no sorteio); não aparece em gols. É um efeito de moral que não medi diretamente em campo.
- **Maestro:** multiplica por 1,9 a chance do passe que deixa o atacante cara a cara, mas isso virou +0,001 ppg com um maestro: a chance de "cara a cara" é pequena e quase todos os gols dependem de outros fatores.
- **Gelo/Catimbeiro/Desarmador:** mudam estatísticas (cartões, faltas, desarmes), mas não pontos. São de sabor, não de poder.
- **Popstar e Prodígio** são de economia e progressão (patrocínio +4% de aceite por popstar até +12 pp, público +4% até +8%, treino/progressão ×1,5 até 21 anos). Só verifiquei no código e que o Prodígio perde a marca aos 22 (0 com 22+ em 12 anos). Não simulei o efeito financeiro.

### 3.3 Margem para ajustar

O balanceamento aguenta com folga efeitos 3 a 5 vezes maiores. Com um conjunto de 3 traits valendo +0,02 ppg, o time com 3 matadores no ataque ainda teria menos de +0,1 ppg. Sugestões de ajuste para o KK (nenhuma implementada): (a) goleiro não receber traits fora de uma lista própria (ex.: "Pegador de pênaltis", "Paredão"); (b) peso do sorteio mais parecido entre os traits; (c) subir Salvador (por exemplo, também para quem entra de qualquer minuto depois dos 60), Maestro e Líder; (d) o computador usar o banco depois dos 75 quando está perdendo.

## 4. Acréscimos, prorrogação, estrelas e Copa sem humanos

- **Duração:** média 94,5 min na liga (mínimo 92, p95 97, p99 98, máximo 100). 6,1% dos gols saem depois dos 90 min.
- **Copa:** 316 voltas simuladas, 48 (15%) foram à prorrogação, 27 (8,5%) aos pênaltis. Nenhum jogo ficou sem vencedor. Mesmos números que o relatório 08 da outra thread.
- **Estrelas (por time):** A 2,88 (2 a 4), B 2,14 (1 a 3), C 1,64 (1 a 2), D 1,21 (1 a 2).
- **Tela:** relógio com acréscimo (`90+2'`, `90+3'`) e posse de bola aparecem na tela do jogo; a classificação, a tela de resultados da Copa sem humanos ("Nenhum técnico humano joga nesta rodada...", "Pular para os resultados") e o botão CONTINUAR funcionam; o aviso da diretoria (moral do técnico abaixo de 20) aparece e fecha. A tela "Conversar com o grupo" abre com tom (elogiar/motivar/cobrar) e escolha de quem falar. Zero erros no console.
- **Determinismo:** idêntico entre jogo ao vivo, passo a passo e `simularDia`, com 1, 4 e 8 humanos (o teste mostrava "diferente" na primeira execução por um erro do meu script, que parava aos 90 minutos; corrigido e repetido: tudo idêntico).
- Limitação do meu robô de tela: em 12 partidas seguidas ele não passa pelo dia de Copa sem humanos; 8 a 9 partidas de liga pela interface rodaram sem erro e a tela da Copa foi testada separadamente.

## 5. Compras e treino nos times da Série D

### 5.1 Compra de reforços (10 clubes iniciáveis × 3 mundos; Δ ppg do time com o reforço contra o mesmo time sem)

| Posição | D | C | B | A |
|---|---|---|---|---|
| Média das 10 posições, contra clubes da D | +0,07 | +0,12 | +0,27 | +0,32 |
| Média das 10 posições, contra clubes da B | +0,01 | +0,03 | +0,05 | +0,07 |
| Preço médio pedido (R$ mil) | 97 | 255 | 918 | 5.460 |

(v21: +0,03 / +0,10 / +0,18 / +0,27 contra D; +0,02 / +0,02 / +0,03 / +0,06 contra B. O ganho contra a D subiu, mais na B (+0,18 para +0,27). Não investiguei a causa: o motor de partida mudou (acréscimos, traits, estrelas) e a amostra é outra; a leitura qualitativa é a mesma.)

**Preço por posição (origem B, R$ mil):** GOL 1.866, ZAG 2.500, LD 1.022, LE 1.105, VOL 2.069, MC 114, MEI 153, PD 106, PE 127, CA 123. Origem A: GOL 8.474, ZAG 11.721, LD 8.988, LE 11.760, VOL 11.235, MC 470, MEI 596, PD 447, PE 435, CA 479. O ganho (Δ ppg contra D) de origem B: GOL +0,40, ZAG +0,27, LD +0,30, VOL +0,32 contra MC +0,19, MEI +0,28, PD +0,18, PE +0,23, CA +0,19.

**Ponto novo:** um zagueiro da B custa 20 vezes um centroavante da B, para um ganho só 1,4 vez maior. Um clube da D com R$ 450 mil só consegue comprar ataque/meio. É por isso que "só atacantes" é a estratégia de compra mais eficiente (próxima seção). Não olhei a fórmula de preço; o que vejo é que os jogadores de ataque e meio saem muito mais baratos para a mesma divisão de origem.

### 5.2 Cenários de compra (30 compras por cenário × 3 mundos; Δ ppg contra D / contra B; custo médio)

| Compra | Δ ppg vs D | Δ ppg vs B | Custo (R$ mil) |
|---|---|---|---|
| 1 craque CA da A (o melhor) | +0,36 ±0,04 | +0,03 ±0,01 | 679 |
| 1 CA bom da A (10º) | +0,38 ±0,04 | +0,04 ±0,01 | 534 |
| **1 CA da B (5º)** | +0,23 ±0,04 | +0,02 ±0,01 | **114** |
| 1 GOL da A (o melhor) | +0,41 ±0,04 | +0,15 ±0,02 | 10.995 |
| 3 equilibrados da B (ZAG, MC, CA) | +0,66 ±0,04 | +0,13 ±0,02 | 2.796 |
| **3 de ataque da B (CA, PD, PE)** | **+0,71** ±0,04 | +0,10 ±0,02 | **344** |
| 3 de defesa da B (GOL, ZAG, ZAG) | +0,84 ±0,04 | +0,25 ±0,02 | 7.176 |
| 3 de meio da B (MC, MEI, VOL) | +0,73 ±0,04 | +0,16 ±0,02 | 2.504 |
| **6 da C (uma por posição-chave)** | **+0,94** ±0,04 | +0,22 ±0,02 | 2.152 |
| 2 craques da A (CA + MEI) | +0,56 ±0,04 | +0,09 ±0,02 | 1.448 |
| **1 CA da A + 5 baratos da D** | **+0,93** ±0,04 | +0,22 ±0,02 | 2.261 |

Resposta às perguntas do KK:

- **Comprar só um CA muito forte?** Ajuda (+0,36 contra a D), mas **menos que um CA da B barato (+0,23 por R$ 114 mil) em custo-benefício**, e perde para qualquer pacote de 3 ou mais reforços (+0,66 a +0,94). Um craque sozinho tem retorno decrescente (o 10º CA da A rende igual ao melhor).
- **Comprar mais jogadores em posições diferentes, mais equilibrados?** É o que mais rende: 6 reforços da C (+0,94) ou 1 craque + 5 baratos (+0,93) superam 2 craques (+0,56). Contra a Série B o ganho dos pacotes é +0,22 ppg, que é o suficiente para brigar com ela mas não para dominá-la.
- **Só defesa?** O melhor ganho absoluto (+0,84) é de defesa, mas custa R$ 7 milhões, fora do alcance da D (caixa médio R$ 444 mil). Dentro do orçamento da D, o melhor é ataque + meio.

### 5.3 Campanhas do técnico-robô (30 por linha, 8 anos, 10 piores clubes da D)

| Estratégia | Força 14 melhores | ppg 1º ano | Chegou à C / B / A | Caixa final (R$ mil) | Compras |
|---|---|---|---|---|---|
| Passivo | 46,6 → 40,0 | 0,78 | 0% / 0% / 0% | 224 | 0 |
| Só treina (Formador) | 46,6 → 43,3 | 0,87 | 0% | 185 | 0 |
| Só treina (Professor) | 46,6 → 41,6 | 0,83 | 0% | 330 | 0 |
| Só compra | 46,6 → 42,4 | 1,15 | 0% | −75 | 6,8 |
| **Compra + treina (Formador)** | 46,6 → **51,7** | **1,46** | **37% / 3% / 0%** | **−486** | 9,0 |
| Só livres | 46,6 → 46,3 | 1,03 | 17% / 0% / 0% | 39 | 6,1 |
| Compra + livres | → 44,2 | 1,08 | 10% | −242 | 8,2 |
| Treina + livres | → 49,4 | 1,08 | 20% / 3% | 10 | 5,7 |
| Compra + treina (Ofensivista) | → 44,2 | 1,17 | 7% | −203 | 7,9 |
| Compra + treina (Retranqueiro) | → 45,1 | 1,19 | 13% | −270 | 7,9 |

(v21: compra + treina Formador 50% C / 3% B, caixa −26; só livres 20% C.) Em campanhas de clubes da C (10 clubes por linha): compra + livres + treina chega à B em 97% e à A em 23% dos casos (passivo: 57% e 7%), com caixa final de R$ 1,7 mi contra R$ 6,0 mi do passivo.

**O caixa negativo dos robôs é maior que na v21 (−486 contra −26 mil em 8 anos).** O meu robô comprou até ficar com caixa negativo; não verifiquei qual regra do jogo permite isso. É o ponto 2 da seção 7.

### 5.4 Elencos montados à mão (20 campanhas por linha)

| Elenco | ppg ano 1 | ppg ano 2 | Posição média anos 3+ |
|---|---|---|---|
| 1 Controle (4-4-2 equilibrado) | 0,81 | 0,76 | 16,9 |
| 2 Ataque técnico (Fin/Drib/Ritmo, 4-3-3 ofensivo) | **1,20** | 0,83 | 13,9 |
| 3 Muralha (Def/Fís, 4-5-1 defensivo) | 0,85 | 0,69 | 15,9 |
| 4 Passadores (Passe/Drible, 4-2-3-1) | 0,98 | 0,83 | 14,4 |
| 5 Desencontro (ataque técnico em 4-5-1 defensivo) | 1,03 | 0,72 | 16,3 |

Igual à v21 (0,77 / 1,17 / 0,84 / 1,02 / 1,07). O elenco de ataque técnico continua sendo o mais forte (+0,39 sobre o controle) e a muralha só +0,04 (ponto 6).

## 6. Técnicos do computador e compra pelo computador

### 6.1 Perfis de técnico (resíduo de pontos por temporada contra o esperado pela força; 328 a 552 temporadas por perfil)

| Perfil | Resíduo (pts/temporada) | ± |
|---|---|---|
| Professor | **+0,98** | 0,39 |
| Formador | **+0,95** | 0,48 |
| Ofensivista | −0,25 | 0,44 |
| Estrategista | −0,25 | 0,51 |
| Preparador | −0,77 | 0,50 |
| Retranqueiro | −0,92 | 0,42 |

v21: Formador +1,65, Ofensivista +0,06, Preparador −0,26, Estrategista −0,35, Retranqueiro −0,97, Professor −0,97. **O ranking mudou:** Professor foi de −0,97 para +0,98 (o erro é grande: ± 0,4 de cada lado, então a diferença entre Professor, Formador e o resto pode ser em parte ruído). A amplitude entre o melhor e o pior perfil é ≈ 1,9 ponto por temporada, **pequena** (5% da pontuação de um campeão). Os perfis ligados a treino (Professor, Formador) são os melhores, os defensivos (Retranqueiro, Preparador) os piores. Nenhum perfil é dominante.

### 6.2 Compra simulada pelo computador (o jogo ainda não faz; simulei a política "subida": clube só compra mesmo nível ou abaixo, 24 temporadas, 80 clubes)

| Medida | Sem compras | Com compras ("subida") |
|---|---|---|
| Compras por temporada | 0 | 112 |
| Fluxo (24 anos): mesma divisão | — | D>D 613, C>C 689, B>B 765, A>A 476 |
| Subindo de divisão | — | D>C 46, C>B 43, B>A 44, D>B 6, C>A 1 |
| ρ força × posição A / B / C / D | 0,80 / 0,84 / 0,63 / 0,92 | 0,77 / 0,82 / 0,65 / 0,88 |
| Campeões diferentes (24 anos) | 6 | 6 |
| Força média ao fim (A / B / C / D) | 73,2 / 63,7 / 57,1 / 49,4 | 73,9 / 64,3 / 57,8 / 49,4 |
| Caixa ao fim, A / B / C / D (R$ mil) | 20.618 / 7.310 / 2.658 / 957 | 20.265 / 6.743 / 2.940 / 1.101 |
| Clubes com caixa negativo por ano | 0,5 | 0,5 |

Com a política "mesmo nível ou abaixo": o campeonato fica ligeiramente mais aberto (ρ cai de 0,03 a 0,04), os clubes ficam um pouco mais fortes, o caixa não é afetado e a Série D não ganha força (clubes da D só compram outros da D). É a política que o relatório 4 recomendou (ponto 5), e continua sendo segura.

## 7. Os 6 pontos da v21 (continuam em aberto para o KK decidir)

1. **Cansaço punitivo.** Inalterado na v22: stamina 80 custa 0,93 ppg (0,41 contra 1,34); 70 custa 1,15; "sempre o melhor 11" 0,31 contra 0,41. O Highlander na v22 mostra a força disso (+0,117 ppg com o time inteiro). A escolha é do KK: manter, suavizar a curva (ex.: expoente 1,5) ou tornar o Highlander mais forte.
2. **Caixa negativo dos robôs.** Pior que na v21 (−486 mil contra −26 mil em 8 anos para Compra + treina). O que o jogo faz com um clube de caixa negativo continua sem teste (limite de dívida, venda forçada, nada?). Precisa de decisão: bloquear compra acima do caixa, ou permitir com consequência.
3. **Veteranos baratos da A dominam o mercado.** Inalterado: a lista "Melhora para o meu time" na tela continua mostrando goleiros de 32 a 37 anos da B por R$ 109 a 270 mil (Δ +20 a +24). É o desconto por idade.
4. **Treino de jovens (Formador) como multiplicador.** Sob a lupa: Formador e Professor ficaram com resíduo parecido (+0,95 e +0,98 pts/temporada), ou seja, o Formador deixou de ser o outlier da v21 (+1,65). Mas "compra + treina Formador" ainda é a única campanha que chega à C com frequência (37%).
5. **Computador não compra jogadores.** Continua sem comprar; a política "mesmo nível ou abaixo" foi simulada acima (seção 6.2) e é recomendada.
6. **Elenco de ataque rende mais que o de defesa.** Inalterado (+0,39 contra +0,04 ppg no ano 1 dos elencos montados; +0,22 de um CA contra +0,08 de um ZAG com +10 de overall). Com o preço novo (5.1), a diferença de preço entre ataque e defesa aumenta o efeito na compra.

**Ponto novo (7):** diferença de preço entre posições (seção 5.1) e **ponto novo (8):** o sorteio dos traits (seção 3.1), com 45% dos Highlanders em goleiros.

## 8. Arquivos

- `scripts-05/` (todos os scripts da v22, incluindo `t13.js`/`t13b.js` por trait, `t14.js` estrelas e acréscimos, `t15.js` cenários de compra, `t16.js` conjunto de traits, `t17.js` distribuição de traits) e `scripts-05/resultados/`.
- Comparar com `relatorio-testes-04-v21.md` e `08-medicoes-melhorias-22.md` (medições da própria thread de código).
