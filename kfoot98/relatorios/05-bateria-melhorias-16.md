# Kfoot 98 — Relatório 3: reteste completo da v19 (Melhorias #16), compra de reforços e treino

Versão testada: branch `claude/melhorias-5-xt6u1f`, commit 5652ddf (Melhorias #16). Nada foi alterado no código, nada foi enviado ao repositório e o artefato não foi republicado. Este documento é diagnóstico e proposta, para decidirmos juntos antes de implementar.

Método: o mesmo do relatório 2. Carreguei o motor real do `index.html` em Node (sem a tela), usei elencos clonados, mando trocado, sementes comuns e rodízio de estratégias. Erros padrão aparecem como ±. Scripts e resultados brutos em `scripts-03/`. Medidas da outra thread (`04-medicoes-melhorias-16.md`) foram conferidas por medições próprias, e a coluna "bate?" abaixo diz onde concordo.

---

## Resumo em uma página

1. **As melhorias do relatório 2 funcionam.** Intervalo agora vale (+0,09 ppg para a resposta certa, contra ~0 antes), sinergia ficou neutra (média −0,2% a 0,0%), atacante no gol sofre 2,6 gols por jogo (antes 2,0), Série A menos previsível, assistências realistas, Copa continua nivelada, atributos têm função própria.
2. **Passe, drible e ritmo deixaram de ser decorativos.** +10 em todos os titulares: Finalização +0,32 ppg, Passe +0,30, Defesa +0,30, Drible +0,25, Ritmo +0,25, Físico +0,13 (relatório 2: 0,29 / 0,14 / 0,32 / 0,14 / 0,04 / 0,09). Físico segue o mais fraco.
3. **O que mais muda o resultado do técnico humano é o mercado, e muito.** Um robô humano num dos 10 piores clubes da D que só joga (4-4-2 fixo) faz 0,79 ppg e nunca sai da D em 8 anos. O mesmo clube comprando reforços, contratando livres e treinando jovens faz 1,73 ppg, sobe para a C em 93% das campanhas e para a B em 60%. Os clubes das Séries B e C com o mesmo robô chegam à Série A em 67% das campanhas (contra 3% parado). Hoje o mercado vale mais do que tática, atributo e moral somados.
4. **Os preços são baratos demais para o caixa.** Um centroavante médio da Série B custa R$ 102 mil (mais ~30% de multa) e o caixa de um clube da D tem R$ 440 mil. Um time inteiro da B (10 posições) custa R$ 3,6 mi, mas três reforços da B (R$ 0,9 mi) já dão +0,39 ppg contra a D.
5. **O computador não compra jogadores e nunca treinou/negociou entre si.** Só compra do humano (quando ele põe à venda). Simulei o computador comprando: reduz um pouco a previsibilidade e o ganho é pequeno (ρ da A de 0,83 para 0,77), mas esvazia o caixa da D em 45%.
6. **A Copa tem um furo: pênaltis são sorteio puro (50% para qualquer time)**, sem influência de goleiro, batedor, stamina ou escolha do humano. A escolha de batedor existe só nos pênaltis durante o jogo.
7. **Três desequilíbrios novos:** (a) elenco de ataque técnico (Fin/Drib/Rit) rende +0,5 ppg a mais que o elenco "normal" de mesmo overall, enquanto elenco de defesa/físico rende −0,08: o overall (Média) engana; (b) a formação 3-4-3 é melhor que todas as outras em qualquer tática (1,44 contra 1,31 a 1,40) e 3-5-2/4-2-3-1 ficam atrás; (c) os gols caíram nas divisões baixas (D 1,84, C 1,99, B 2,39 por jogo; antes 2,59 / 2,72 / 2,76) e 0×0 foi de 7% para 11%.
8. **Interface:** passou sem nenhum erro de JavaScript em compra pela tela, treino, escalação e 12 partidas jogadas pelo navegador. **Multiplayer e determinismo:** resultado idêntico entre execuções com 1, 4 e 8 humanos, e idêntico entre o caminho "ao vivo" da tela e a simulação rápida.
9. **O preço do ingresso agora é fixo**, o que fecha a exploração do piso de 3% (nenhum clube chega ao piso).

---

## 1. Reteste do relatório 2

### 1.1 Gols por setor (90 mil jogos de liga em mundos de 6 anos)

| Indicador | Atacantes | Meias | Defensores | Goleiro | Antes (A / M / D) |
|---|---|---|---|---|---|
| Gols | 56% | 30% | 13% | 1% | 65 / 29 / 6 |
| Chutes | 58% | 31% | 11% | 0% | 64 / 31 / 5 |
| Assistências | 47% | 43% | 10% | 0% | 13 / 57 / 30 |
| Desarmes | 0% | 31% | 69% | 0% | 0 / 31 / 69 |

Assistências ficaram realistas (a thread de melhorias reporta meias 55 / atacantes 34; no meu mundo completo saiu 43 / 47, diferença de método, mesma direção). Gols de defensores dobraram (13%), por causa de escanteios e faltas. Bate com a medição da outra thread.

### 1.2 Quem está no gol (1.500 jogos por linha, ppg base 1,32)

| Quem joga no gol | Gols sofridos | Conversão no alvo | ppg |
|---|---|---|---|
| Goleiro titular | 1,17 | 28% | 1,32 |
| Goleiro ruim (todos −20) | 1,49 | 34% | 1,12 |
| Goleiro elite (+15) | 0,94 | 23% | 1,51 |
| Melhor zagueiro no gol | 2,50 | 56% | 0,60 |
| Melhor volante no gol | 2,47 | 57% | 0,60 |
| Melhor meia no gol | 2,60 | 60% | 0,53 |
| Centroavante no gol | 2,63 | 60% | 0,51 |
| Jogador de linha com menor DEF | 2,69 | 61% | 0,49 |

Antes: centroavante no gol sofria 2,04. Agora 2,63 (+29%). Corrigido. A diferença entre um goleiro ruim e um elite é 0,39 ppg, o que dá ao humano um motivo claro para investir no goleiro.

### 1.3 Valor de cada posição (+10 de overall em um jogador, ppg sobre a base)

| Posição | Antes | Agora (ppg ±0,024) |
|---|---|---|
| Goleiro | +0,135 | +0,12 / +0,14 |
| Zagueiro | +0,05 | +0,09 |
| Lateral | +0,04 | +0,10 |
| Volante | +0,12 | +0,17 / +0,12 |
| Meia central | +0,10 | +0,15 / +0,21 |
| Ala | +0,09 | +0,17 a +0,22 |
| Centroavante | +0,16 | +0,24 / +0,25 |
| Segundo atacante | — | +0,24 / +0,27 |
| 4 defensores de uma vez | — | +0,34 / +0,38 |
| 4 meias de uma vez | — | +0,58 / +0,69 |
| 2 atacantes de uma vez | — | +0,35 / +0,50 |

Todas as posições pesam mais do que antes e o meio-campo continua sendo o setor mais valioso (4 meias valem quase o dobro de 4 defensores). Defensor ainda é a posição mais barata de "esquecer", o que já era um ponto fraco do relatório 2 (ver proposta 5).

### 1.4 Jogador fora de posição (ppg base 1,32)

| Situação | ppg |
|---|---|
| Melhor goleiro de centroavante | 1,02 |
| Melhor goleiro de zagueiro | 1,18 |
| Melhor centroavante de zagueiro | 1,14 |
| Melhor zagueiro de centroavante | 1,14 |
| 2 centroavantes de zagueiros | 0,93 |
| 2 zagueiros de atacantes | 0,96 |
| 3 atacantes no meio | 0,77 |
| Lateral esquerdo de zagueiro | 1,29 |

A penalidade por posição errada continua forte e coerente (lateral de zagueiro quase não perde, atacante no meio perde muito).

### 1.5 Atributos

+10 nos 11 titulares (ppg sobre base 1,32, ±0,024): Finalização 1,64 (+0,32), Passe 1,62 (+0,30), Defesa 1,62 (+0,30), Ritmo 1,57 (+0,25), Drible 1,57 (+0,25), Físico 1,45 (+0,13). Todos os atributos −10: Defesa 1,03 e Finalização 1,11 são os que mais doem.

Teste de "atributo além do overall" (mesmo overall, perfil diferente):

| Perfil | ppg | Diferença |
|---|---|---|
| Atacantes com Finalização +12 | 1,51 | +0,19 |
| Atacantes com Finalização −12 | 1,24 | −0,08 |
| Meias/alas/volantes com Passe +12 | 1,54 | +0,22 |
| Meias com Drible +12 | 1,47 | +0,15 |
| Time todo com Ritmo +12 (Físico compensa) | 1,44 | +0,12 |
| Time todo com Físico +12 (Ritmo compensa) | 1,17 | **−0,15** |
| Zagueiros/laterais com Defesa +12 | 1,37 | +0,05 |
| Goleiro com Defesa +12 | 1,38 | +0,06 |

Passe, Drible e Ritmo agora aparecem no resultado. O Físico é o ponto que sobra: um time "forte fisicamente" com o mesmo overall rende menos (−0,15), porque o overall paga pelo Físico mais do que o jogo devolve. Defesa de zagueiro ainda rende pouco por ponto (+0,05).

### 1.6 Stamina e moral (1.500 jogos por linha)

| Condição | ppg (base 1,38) |
|---|---|
| Stamina inicial 90 | 1,13 (−0,24) |
| Stamina inicial 80 | 0,94 (−0,44) |
| Stamina inicial 60 | 0,56 (−0,82) |
| Moral 0 | 0,99 |
| Moral 45 | 1,23 |
| Moral 65 (base) | 1,38 |
| Moral 85 | 1,49 |
| Moral 100 | 1,61 |

Moral de 0 a 100 vale 0,62 ppg (antes 0,56). Stamina inicial 80 custa 0,44 ppg (antes 0,31): o Físico agora reduz o desgaste, então o cansaço pesa mais para quem tem Físico baixo. Rodízio: "sempre o melhor 11" 0,763 ppg contra 0,844 do automático do jogo (+0,08 ±0,017). Trocas por cansaço: nenhuma política muda mais que +0,03 ppg (a melhor foi "três aos 60 minutos", +0,026; resto igual à IA), então a troca como decisão ainda vale pouco.

Moral por tabela (mundo sem humano, 6 rodadas): o terço de baixo da tabela perde moral continuamente (Série A: 62 → 48; moral do técnico 62 → 32; Série D: 62 → 49, técnico 33 → 11) enquanto o terço de cima sobe (65 → 70 / 75). A espiral continua e é o motivo da conversa/prêmio/demissão da v19, que só o humano usa. Sugiro medir em um relatório futuro se o humano consegue sair dela.

### 1.7 Táticas, formações e grade de 24 combinações (4.830 jogos por célula)

| Formação | Ofensivo | Equilibrado | Defensivo | Contra |
|---|---|---|---|---|
| 3-4-3 | 1,432 | **1,477** | 1,457 | 1,385 |
| 4-4-2 | 1,384 | 1,450 | 1,401 | 1,348 |
| 4-3-3 | 1,383 | 1,378 | 1,395 | 1,334 |
| 4-5-1 | 1,336 | 1,364 | 1,393 | 1,350 |
| 4-2-3-1 | 1,301 | 1,328 | 1,344 | 1,295 |
| 3-5-2 | 1,313 | 1,344 | 1,328 | **1,261** |

Amplitude 0,22 ppg (antes 0,16). Por formação: 3-4-3 1,438, 4-4-2 1,396, 4-3-3 1,372, 4-5-1 1,361, 4-2-3-1 1,317, 3-5-2 1,311. Por tática: equilibrado 1,390, defensivo 1,386, ofensivo 1,358, contra 1,329. O 3-4-3 é melhor que qualquer outra formação em todas as táticas: sobrou uma estratégia dominante. Antes o 4-4-2 era a pior; agora o 4-4-2 é a segunda melhor. "Contra" continua a pior tática.

Sinergia (24 combinações, elencos automáticos): média −0,23% (ataque), 0,00% (defesa), +0,02% (controle), p95 do módulo 2,1%, máximo 5,9%. Neutra. Corrigido.

### 1.8 Intervalo (900 jogos por linha, computador reagindo com a personalidade dele)

| Política | ppg | Ajuste médio |
|---|---|---|
| Nada | 1,303 | 0% |
| Resposta tática certa | 1,392 (+0,09) | +3,0% |
| Resposta certa + formação pelo placar | 1,373 (+0,07) | +4,1% |
| Resposta errada | 1,257 (−0,05) | −2,0% |
| Perdendo recua, ganhando ataca | 1,249 (−0,05) | −0,9% |
| Sorteia tática e formação | 1,274 (−0,03) | +0,4% |

Corrigido: a resposta certa vale cerca de +0,09 ppg com o computador reagindo, e errar punir −0,05. O valor é menor que os +0,13 do cenário sem reação do relatório 2, mas existe.

### 1.9 Dez estilos e cinco níveis de habilidade (campanhas de 1 ano, clubes da D)

Estilos: do melhor (aleatório, 1,040) ao pior (contra-ataque, 0,941): amplitude 0,10 ppg (3,8 pontos por temporada; relatório 2: 0,09). Níveis de habilidade: aleatório 1,169, passivo 1,169, intuitivo 1,167, estudioso 1,055, expert 1,184. Ou seja, o nível de habilidade tático ainda não aparece (0,015 ppg do passivo ao expert, dentro do erro). O "estudioso" cai porque usa 4-2-3-1, uma das duas piores formações. Confirmada a conclusão do relatório 2: **escolha tática sozinha não decide a campanha**.

### 1.10 Caos, previsibilidade e economia (90 mil jogos, 18 mundos-ano)

- Gols por jogo: A 2,76, B 2,39, C 1,99, D 1,84 (total 2,28). Antes: 2,80 / 2,76 / 2,72 / 2,59 (2,74). **Os gols caíram bastante nas divisões baixas.** 0×0 foi de 6,8% para 11,3%; 7 gols ou mais de 2,2% para 1,0%; goleadas de 4+ gols 3,0% (igual).
- A queda vem da finalização: equipes iguais de prestígio 15 convertem 8,8% dos chutes em gol, as de prestígio 90 convertem 11,8%, com o mesmo número de chutes (21).
- Mandante 40,2% / empate 25,7% / visitante 34,0% (antes 40 / 24 / 36).
- Chance de vitória por diferença de força: a curva é suave como antes (diferença +8: 73% casa, 19% empate, 8% fora).
- Série A: ρ(força, posição final) 0,77 (antes 0,87), campeão era o mais forte em 41% (antes 38%), top 3 em 67% (antes 74%). **Campeões em 54 temporadas: Corinthians 14, Flamengo 12, Vasco 8, São Paulo 6, Palmeiras 4, Cruzeiro 3, Vitória 3, Grêmio 2, Atlético-MG 1, Internacional 1** (10 clubes; antes 8 em 120 e Corinthians 35%; agora 26%). Melhor, mas Corinthians e Flamengo ainda ganham 48%.
- Séries B / C / D: ρ 0,86 / 0,64 / 0,88; campeão da B é o mais forte em 74% das vezes (muito previsível), na C 46%, na D 39%.
- Lotação média A / B / C / D: 61% / 45% / 34% / 25% (antes 58 / 49 / 36 / 25). Jogos lotados na A: 7%.
- Resultado anual médio (R$ mil): A +3.484, B +1.125, C +474, D +146 (antes +4.490 / +1.406 / +542 / +172). Caixa médio ao fim de 6 anos: A 20 mi, B 6,6 mi, C 2,4 mi, D 0,9 mi. O caixa da A acumula menos que no relatório 2 (20 mi em 6 anos; lá 34 mi em 10 anos, horizontes diferentes, então só indica a direção).
- Mundo de 25 anos sem humano: força dos 14 melhores estável (A 72 a 75, D 47,5 a 50,4), B sobe de 62 para 66 e C de 55 para 61 ao longo dos 25 anos (leve inflação nas divisões do meio). Idade média 25 a 29.

### 1.11 Copa do Brasil (nivelada, 600 confrontos por linha)

| Confronto | Liga: forte vence | Copa: forte vence | Antes (Copa) |
|---|---|---|---|
| 80 × 80 | 36% | 38% | 39% |
| 70 × 40 | 80% | 63% | 57% |
| 90 × 30 | 98% | 81% | 73% |
| 60 × 20 | 87% | 69% | 65% |

A Copa continua mais aberta que a liga, mas menos que antes: o favorito agora vence 81% (era 73%) no 90 × 30. A outra thread relata favorito avançando em 96% nos 85 × 15, coerente.

---

## 2. Testes novos do passo 9

### 2.1 Compra de reforços por clube da D (a pergunta do KK)

Mundos novos (3 a 6), 10 clubes sorteáveis da D como compradores, 4-3-3 equilibrado, adversários de D e de B, 2.520 a 840 jogos por linha, mesmas sementes antes e depois. O reforço é o titular de uma posição de um clube da divisão de origem (um bom titular: terço superior entre os melhores de cada clube).

**Resumo por origem (média das 10 posições):**

| Origem do reforço | Ganho de média do clube | Preço médio pedido | Δ ppg contra D | Δ ppg contra B |
|---|---|---|---|---|
| Série D | +3,7 | R$ 51 mil | +0,04 | +0,03 |
| Série C | +9,7 | R$ 115 mil | +0,08 | +0,03 |
| Série B | +17,2 | R$ 363 mil | +0,15 | +0,05 |
| Série A | +29,3 | R$ 2,26 mi | +0,25 | +0,08 |

Caixa médio dos compradores: R$ 444 mil. Uma só contratação da B quase sempre cabe; do A nunca.

**Por posição (Δ ppg contra a D, reforço da Série B):** Goleiro +0,21, Centroavante +0,27, Meia ofensivo (MEI) +0,21, Meia central +0,18, Ponta direita +0,14, Ponta esquerda +0,12, Lateral esquerdo +0,14, Lateral direito +0,10, Zagueiro +0,09, Volante +0,06. Os mais rentáveis por real são centroavante, ponta e meia (custam R$ 70 a 130 mil na B), e o goleiro é o único defensivo que rende. Zagueiro e volante rendem pouco e custam o dobro ou mais.

**Por característica (reforço da B, Δ ppg contra a D):**

| Posição | Melhor média | Finalização | Ritmo | Físico | Drible | Passe | Defesa |
|---|---|---|---|---|---|---|---|
| Centroavante | +0,23 | +0,26 | +0,15 | +0,20 | +0,25 | +0,20 | — |
| Meia ofensivo | +0,28 | +0,28 | +0,37 | — | +0,23 | +0,38 | — |
| Zagueiro | +0,20 | — | — | +0,18 | — | +0,20 | +0,23 |
| Goleiro | +0,20 | — | — | — | — | +0,27 | **+0,37** |

Escolher pelo atributo certo vale mais que pela média: goleiro com Defesa alta rende +0,37 (contra +0,20 de um goleiro de média parecida), meia com Passe +0,38 e centroavante com Finalização +0,26. Contra adversários da B os ganhos caem para um quarto (D vs B é salto grande).

**Pacotes (Δ ppg contra D / contra B):**

| Pacote | Série C | Série B | Série A | Custo B |
|---|---|---|---|---|
| 1 centroavante | +0,07 / +0,02 | +0,19 / +0,07 | +0,21 / +0,12 | R$ 109 mil |
| 3 (CA, MEI, ZAG) | +0,26 / +0,12 | +0,39 / +0,17 | +0,73 / +0,33 | R$ 908 mil |
| 6 (CA, PD, MEI, VOL, ZAG, GOL) | +0,61 / +0,25 | +0,94 / +0,50 | +1,39 / +0,93 | R$ 2,0 mi |
| 10 (um por posição) | +1,01 / +0,43 | +1,45 / +0,90 | +1,81 / +2,10 | R$ 3,6 mi |

Seis reforços da B dão +0,94 ppg contra os da D: um time que era de meio de tabela passa a campeão. Os ganhos somam quase linearmente.

**Leitura:** um centroavante da B para um clube da D já se paga em pontos, mas não "quebra" o jogo (+0,2 ppg, 8 pontos por temporada). O problema é o conjunto: o preço baixo permite comprar vários, e o ganho soma.

### 2.2 Campanhas de técnico-robô com mercado e treino (8 anos, 10 clubes da D no mesmo mundo, estratégias em rodízio, 30 campanhas por linha)

O robô compra até 3 jogadores por janela (início da temporada e rodada 20) com 60% do caixa, escolhe o maior ganho de média por posição, contrata livres melhores que o titular, renova os 20 melhores, e treina como o técnico do computador (perfil do computador aplicado ao humano). Sempre 4-3-3 equilibrado. Clubes: os 10 piores da D (prestígio 8 a 20).

| Estratégia | Força dos 14 melhores (início → fim) | ppg no 1º ano | Chegou à C / B / A | Caixa final | Compras |
|---|---|---|---|---|---|
| Passivo (não faz nada) | 45,4 → 39,3 | 0,79 | 0% / 0% / 0% | R$ 591 mil | 0 |
| Só treina (Formador) | 45,4 → 43,1 | 0,80 | 3% / 0% / 0% | R$ 545 mil | 0 |
| Só treina (Professor) | 45,4 → 41,2 | 0,87 | 0% / 0% / 0% | R$ 589 mil | 0 |
| Só livres | 45,4 → 46,3 | 1,27 | 40% / 7% / 0% | R$ 830 mil | 9,6 livres |
| Livres + treino Formador | 45,4 → 48,5 | 1,19 | 47% / 3% / 0% | R$ 607 mil | 8,1 |
| Compra (sem livres) | 45,4 → 44,3 | 1,33 | 23% / 7% / 0% | R$ 154 mil | 12,4 |
| Compra + livres | 45,4 → 46,9 | 1,24 | 27% / 10% / 0% | R$ 146 mil | 15,6 |
| Compra + livres + treino Ofensivista | 45,4 → 46,7 | 1,27 | 30% / 3% / 0% | R$ 93 mil | 14,8 |
| Compra + livres + treino Retranqueiro | 45,4 → 48,6 | 1,32 | 53% / 13% / 0% | R$ 169 mil | 15,5 |
| **Compra + livres + treino Formador** | 45,4 → **55,3** | **1,73** | **93% / 60% / 0%** | R$ 361 mil | 19,5 |

Séries B e C (10 clubes do meio da tabela, 6 anos, 30 campanhas por linha): passivo 1,15 ppg, chega à A em **3%**; compra + livres + treino Formador, 1,96 ppg e chega à A em **67%** (à B em 100%), gastando R$ 9,3 mi.

Leituras:

- **O jogador passivo perde força todo ano** (45,4 → 39,3 em 8 anos, −6): sem repor, o elenco envelhece e o mercado de contratos esvazia o time. Mesmo "só treinar" ajuda só um pouco (+4).
- **Livres são quase de graça** (R$ 14 mil de luvas em média) e dão 40% de chance de sair da D. Isso é um achado: os 40 livres do mercado são de nível D a B (36 a 56) e o humano pode contratar quantos quiser.
- A combinação que decide é comprar + treinar jovens. Sozinha, nenhuma das duas alavancas leva à Série B. Juntas levam 60% dos clubes à B e todos os clubes da B à A. Os 3 treinos de personalidade (ofensivista, retranqueiro, formador) não têm o mesmo efeito: o Formador, que treina quem tem até 23 anos e inclui o banco, vale muito mais.
- Nenhuma campanha chegou à Série A saindo da D em 8 anos (0%): o teto da progressão para quem começa na D é a Série B, o que parece saudável (a Libertadores fica distante), mas o caminho C→B→A abre rápido para quem tem dinheiro.
- Resposta à pergunta "isso faz diferença?": faz **muito**. Em termos de ppg, o conjunto do mercado vale +0,9 (D) e +0,8 (B/C), mais do que qualquer escolha tática (0,1), moral (0,6 no extremo) ou atributo isolado.

### 2.3 E se o computador comprasse? (mundo sem humano, 3 mundos × 8 anos por política)

O jogo hoje **não** faz isso (o computador só compra jogadores que o humano coloca à venda ou leiloa; `transferir` é chamado só em venda/leilão/compra do humano). Implementei no teste uma política de compra para todos os clubes do computador (duas janelas por ano, até 35% do caixa livre, 2 compras por janela, ganho mínimo de 5 pontos de média no slot).

| Política | Compras por temporada | ρ força×posição (A / B / C / D) | Campeões da A em 24 temporadas | Força A / B / C / D no ano 8 | Caixa D no ano 8 | Clubes com caixa negativo |
|---|---|---|---|---|---|---|
| Nenhuma (como hoje) | 0 | 0,83 / 0,86 / 0,60 / 0,88 | 6 clubes (Corinthians 8) | 72,2 / 61,9 / 55,8 / 48,6 | R$ 1,04 mi | 0,7 |
| Ambiciosa (qualquer divisão) | 187 | 0,77 / 0,82 / 0,62 / 0,88 | 7 (Corinthians 10) | 72,6 / 64,2 / 57,8 / 49,7 | R$ 0,58 mi | 1,3 |
| Só mesmo nível ou abaixo | 192 | 0,77 / 0,80 / 0,59 / 0,83 | 8 (Corinthians 10) | 72,9 / 63,7 / 56,9 / 48,8 | R$ 1,02 mi | 0,7 |

Fluxo na política ambiciosa: 608 jogadores da A foram para a B, 241 da B para a D, 400 da B para a C, 298 da C para a D, 216 da B para a A. Ou seja, clubes pequenos de fato compram "acima do peso" (a pedido do KK), mas o efeito sobre o equilíbrio é pequeno: a Série A fica um pouco menos previsível, as divisões de baixo sobem 1 a 2 pontos de força, o caixa da D cai 45% (política ambiciosa) e a quantidade de clubes quebrados quase dobra (de 0,7 para 1,3). A política "mesmo nível ou abaixo" dá o mesmo ganho de equilíbrio sem quebrar o caixa. **Recomendo esta.**

### 2.4 Técnicos do computador (6 personalidades, 4 mundos × 8 anos, resíduo de pontos por temporada ajustado por força e divisão)

| Personalidade | Resíduo de pontos | ±EP |
|---|---|---|
| Professor | +1,13 | 0,43 |
| Estrategista | +0,21 | 0,43 |
| Formador | +0,07 | 0,39 |
| Ofensivista | +0,03 | 0,52 |
| Preparador físico | −0,35 | 0,47 |
| Retranqueiro | −1,44 | 0,46 |

Amplitude de 2,6 pontos por temporada: personalidade muda o jeito do clube, não o título. Para comparar com a outra thread (Estrategista +1,7, Retranqueiro +0,1), meus números divergem em ordem de grandeza (as duas amostras têm erro de ~0,4), então vale ver como incerteza. O computador mantém em média 60 jogadores treinando ao mesmo tempo no mundo (0,75 por clube).

### 2.5 Interface (navegador Chromium, 12 partidas jogadas pela tela)

Fluxo completo: tela inicial → configuração → sorteio → "Ver plantel" → mercado (filtros por origem e média, "só o que cabe no caixa") → compra de um zagueiro da Série C pela tela → mercado de livres → escalação (3-5-2 ofensivo chega ao motor) → treino (escolha de jogos e tipo, ganho estimado exibido) → 12 jogos pela tela com pausa, "pular para o fim", resumo e "continuar".

- Erros de JavaScript no console: **zero**.
- Compra pela tela altera elenco (+1) e caixa (−R$ 230 mil neste caso) exatamente como esperado.
- Observações: a aba Finanças diz "o preço do ingresso é fixo" e não permite ajuste; a aba Escalação mostra capitão e batedores (automático por padrão), sinergia e o texto "No jogo: controle do meio −1%"; o mercado lista na primeira linha estrelas da Série A que o clube não tem como pagar (ordem padrão por média, podia ser por "cabe no caixa").
- Em uma execução anterior, a partida não terminou por 5 minutos porque o computador estava sobrecarregado (várias simulações no mesmo núcleo); com carga normal cada jogo leva ~3 s.

### 2.6 Preço do ingresso e lotação

O ingresso agora é fixo (média da divisão), de modo que a exploração do piso de 3% sumiu. Mesmo assim, medi no motor:

| Divisão | Lotação no preço padrão | Preço que maximiza a renda | Renda ótima / padrão | Piso de 3% ativo |
|---|---|---|---|---|
| A | 61% | R$ 10 (padrão 15) | 1,12 | 0 de 20 clubes |
| B | 44% | R$ 5 (padrão 9) | 1,16 | 0 |
| C | 32% | R$ 3 (padrão 6) | 1,21 | 0 |
| D | 25% | R$ 2 (padrão 4) | 1,20 | 0 |

Se o preço voltar a ser ajustável: a elasticidade (−1,3) faz o preço ótimo ser o mínimo até o estádio quase lotar, então a regra é sempre "baixe o preço até encher" e a renda ótima fica 12 a 21% acima do padrão. Fatores de lotação para um clube da B: forma −1 → ×0,65; forma +1 → ×1,35; clássico → ×1,25; preço +25% → ×0,75; preço −25% → ×1,45. A mensagem "ampliar o estádio não traz público novo" aparece em clubes que não lotam.

### 2.7 Sinergia e atributos com elencos montados à mão (10 clubes da D, 3 anos, mesma média, 5 estilos em rodízio, 20 temporadas-clube por estilo no 1º ano)

| Elenco e tática | ppg 1º ano | ppg em 3 anos | Posição média | Fase média da Copa |
|---|---|---|---|---|
| 1 Controle (sem modificar, 4-4-2 equilibrado) | 0,91 | 0,77 | 15,8 | 0,30 |
| **2 Ataque técnico (Fin/Drib/Ritmo +14 em atacantes e meias, 4-3-3 ofensivo)** | **1,42** | **1,05** | **9,0** | **0,50** |
| 3 Muralha (Def/Fís +14 em defesa, goleiro e volantes, 4-5-1 defensivo) | 0,83 | 0,76 | 17,4 | 0,23 |
| 4 Passadores (Passe/Drible +14 em meias, laterais, zagueiros e goleiro, 4-2-3-1) | 1,09 | 0,90 | 13,9 | 0,40 |
| 5 Desencontro (ataque técnico jogando 4-5-1 defensivo) | 1,17 | 0,85 | 13,2 | 0,37 |

Tudo com o mesmo overall. **Montar um time de ataque técnico vale +0,5 ppg (≈ 19 pontos por temporada, 6 posições na tabela). Montar uma muralha vale 0 (−0,08).** O desencontro (ataque técnico com tática defensiva) ainda ganha de controle, ou seja, o atributo pesa mais que a combinação com a tática, o que torna a sinergia (±8%) quase irrelevante frente ao perfil dos jogadores. Isso é bom para quem escolhe jogadores, mas deixa ofensivos muito mais valiosos que defensivos.

### 2.8 Copa do Brasil com humano

- Os confrontos de ida e volta e a "nivelação" funcionam como no relatório 2.
- **Pênaltis na decisão do confronto** (`penaltis(rng)` no motor): 5 cobranças de 76% para cada lado, mais morte súbita, **sem usar jogador nenhum**. Em 20.000 confrontos empatados no agregado, o time "forte" avançou em **50,1%**. Não há influência de goleiro, batedor, stamina, moral ou escolha do técnico. A escolha do batedor que aparece na partida só existe para pênaltis durante o jogo.
- Em um mundo de 8 clubes humanos, a profundidade na Copa acompanhou a força do elenco (tabela 2.7: fase média 0,23 a 0,50).

### 2.9 Multiplayer e determinismo (2 anos, 1, 4 e 8 técnicos humanos, mesmo conjunto de decisões)

| Humanos | ao vivo × ao vivo | ao vivo × passo a passo (como a tela) | ao vivo × simulação rápida | outra semente | Jogos com humano | Entre dois humanos |
|---|---|---|---|---|---|---|
| 1 | idêntico | idêntico | idêntico | diferente | 80 | 0 |
| 4 | idêntico | idêntico | idêntico | diferente | 302 | 24 |
| 8 | idêntico | idêntico | idêntico | diferente | 534 | 116 |

Com 10 humanos na D: 40 jogos entre dois humanos observados, cada um com a formação e a tática escolhidas independentemente. Sem divergência.

### 2.10 Séries B e C com humano

Ver 2.2 (segunda tabela). Os clubes do meio da tabela da B e C começam com ppg ~1,15 passivo e 1,96 com mercado + treino. Resultado: com dinheiro (R$ 2 a 7 mi) as Séries B e C são muito mais fáceis de dominar que a D. Clubes B (Ceará, Goiás, Bragantino, Figueirense, Atlético-GO) e C (Londrina, Mogi Mirim, Volta Redonda, Confiança, Operário-MS) foram os usados.

---

## 3. Conferência das medições da outra thread

| Afirmação (04-medicoes) | Minha medição | Bate? |
|---|---|---|
| Atributos: ganhos de saldo por atributo +12 (Rit +0,25, Fin +0,45, Pas +0,37, Dri +0,32, Def +0,26, Fís +0,21) | +10 nos 11: Fin +0,32, Pas +0,30, Def +0,30, Rit +0,25, Dri +0,25, Fís +0,13 (ppg, não saldo) | Sim, mesma ordem |
| Gols por jogo 2,67 (clubes de prestígio 40 a 90) | 2,28 na liga completa (D 1,84) | Parcial: a média da liga é menor por causa das divisões baixas |
| Centroavante no gol 2,58 | 2,63 | Sim |
| Série A ρ 0,72, 7 campeões em 12 temporadas | ρ 0,77, 10 clubes em 54 temporadas | Sim (amostra diferente) |
| Sinergia entre −0,7% e 0,0% | −0,23% / 0,00% / +0,02% | Sim |
| Lotação 61/45/34/25 | idem | Sim |
| Copa favorito avança 96% (85×15) | forte vence 81% (90×30 em jogo único) | Coerente |
| Inflação de Finalização ≥ 90 maior (33 contra 16) | Não medi atributo por atributo. A força dos 14 melhores em 25 anos ficou estável (A 72 a 75) | Não verificado |
| Efeito de personalidades de técnico (Estrategista +1,7 etc.) | Professor +1,1, Retranqueiro −1,4, resto ~0 (EP ±0,45) | Ordem de grandeza igual, ranking diferente |

---

## 4. Propostas de melhoria (para discutir)

Ordem por impacto percebido pelo jogador.

1. **Calibrar o mercado.** Hoje mercado + livres + treino de jovens valem +0,8 a +0,9 ppg, mais que todo o resto. Opções, em ordem de risco: (a) preço pedido subir com a média (hoje R$ 102 mil por um centroavante de 56 na B, com caixa de R$ 440 mil); (b) limitar compras por janela (por exemplo 2) e janelas fechadas fora de datas; (c) contrato de livres com salário proporcional à média (hoje luvas ≈ R$ 14 mil); (d) limite de gasto proporcional à receita anual. Meta: uma campanha ativa na D sobe uma divisão em ~3 anos, não em 1.
2. **Livres melhores só com custo real.** Os 40 livres são de nível D a B e quase de graça. Ou reduzir o nível, ou exigir salário mensal que pese na folha.
3. **Pênaltis da Copa com jogadores.** Usar finalização do batedor, defesa do goleiro e stamina, e deixar o humano escolher a ordem dos 5 batedores (a tela já tem o componente). Hoje é uma moeda.
4. **Computador comprando e vendendo entre si**, com a política "mesmo nível ou abaixo" (mais equilíbrio na A sem esvaziar o caixa da D). Se quiser também que clubes da D comprem da B (o exemplo do KK), precisa de um teto de gasto por temporada, senão o caixa da D cai 45%.
5. **Recalibrar o overall (Média) contra o efeito real dos atributos.** Físico vale menos no jogo do que no overall (time de Físico +12 rende −0,15) e defesa/físico de defensores rende pouco por ponto. Hoje um elenco de ataque técnico vale +0,5 ppg sobre um de mesmo overall e o de defesa 0. Ajustar PESOS para que os dois caminhos tenham retorno parecido (mais retorno para zagueiros e laterais).
6. **Formação 3-4-3 dominante.** Reduzir seu modificador (FORM_MOD) e elevar 3-5-2 e 4-2-3-1, que ficam 0,12 ppg atrás, para que a escolha de formação tenha custo e benefício reais. Revisar também "contra", a pior tática em todas as formações.
7. **Gols nas divisões baixas.** A D marca 1,84 por jogo e tem 15% de 0×0 em clubes de prestígio 15. Subir a conversão de chutes de times fracos (por exemplo, base de conversão com piso maior) ou diminuir a vantagem do goleiro na D.
8. **A Série B é decidida pela força inicial** (campeão = mais forte em 74%). Aplicar na B a mesma compressão aplicada à A.
9. **Espiral de moral em times de baixo.** A espiral continua no terço de baixo da tabela (moral do técnico 33 → 11 na D). O computador não tem a conversa/prêmio do humano, então a desvantagem é estrutural para o computador; um piso de moral por fase ajudaria a manter clubes de baixo competitivos.
10. **Troca por cansaço ainda vale pouco** (+0,03 ppg no melhor caso). Ampliar o ganho das pernas frescas ou o custo da fadiga acumulada para o humano sentir valor na substituição.
11. **Ordenação do mercado** por padrão: "cabe no caixa" ligado ou ordenar por custo-benefício. Hoje a primeira tela só mostra estrelas inalcançáveis.
12. **Física de Físico**: já que Físico agora reduz lesões e cansaço, mostrar na ficha o efeito (por exemplo, "risco de lesão ×0,7").

## 5. O que ainda não foi testado

- Inflação de atributos individual (Finalização ≥ 90) por 13 anos, como reporta a outra thread.
- Humano reagindo à espiral de moral com conversa e prêmio por vitória (medir a recuperação).
- Efeito da aposta (bicho) e das campanhas de sócios na lotação e na moral.
- Demissão pela diretoria com técnicos humanos jogando normalmente (só foi testado com a opção desligada).
- Leilão de jogadores do humano e propostas de compra do computador a jogadores à venda.
- Teste de interface em tela pequena e com som.

## Apêndice

Scripts em `scripts-03/` (Node; carregam o `index.html` da branch): `w1.js` mundo e caos, `p1.js` posições/goleiro/atributos, `s2.js` rodízio, intervalo e sinergia, `w2.js` estilos e níveis, `cup.js` Copa, `exp3/5/6/7/9.js` stamina, moral, trocas, grade e mundo longo, `t1.js` compra de reforços, `t2.js` campanhas do robô comprador/treinador (DIV=BC para B/C), `t7.js` computador comprando, `t8.js` elencos montados à mão, `t10.js` técnicos do computador, `t6.js` determinismo/multiplayer, `e_preco.js` ingresso e lotação, `pen.js` pênaltis da Copa, `ui*.js` teste de navegador (Playwright). Resultados brutos em `scripts-03/resultados/`.
