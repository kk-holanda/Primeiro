# Kfoot 98 — Relatório da rodada de testes de mecânicas e balanceamento

Versão testada: branch `claude/melhorias-5-xt6u1f`, commit `0133c8c` (pasta `kfoot98`).
Nada foi alterado no código, nada foi enviado ao repositório e o artefato não foi republicado. Este documento é só diagnóstico e proposta, para decidirmos juntos antes de implementar.

## Como testei

Carreguei o motor real do jogo (o mesmo código do `index.html`) em Node, sem a tela, e simulei em volume. No total foram cerca de **1,2 milhão de partidas**:

| Bateria | Volume |
|---|---|
| Temporadas completas do mundo inteiro (80 clubes, liga + Copa), 8 anos seguidos, 3 lotes | ~120 mil jogos |
| Matriz de táticas (4×4) e de formações (6×6), times de mesmo nível com elencos clonados | ~200 mil jogos |
| Grade completa de 24 combinações (6 formações × 4 táticas) em todos contra todos | ~100 mil jogos |
| Sensibilidade a atributos, posições, stamina e moral (um fator por vez) | ~250 mil jogos |
| Substituições (6 políticas) | ~18 mil jogos |
| 10 "técnicos humanos" de teste: 240 temporadas completas do mundo (24 mundos × 10 rodízios; cada personalidade jogou 240 temporadas de clube) | ~400 mil jogos |
| Controle: os mesmos 10 clubes sob comando do computador (24 mundos, 240 temporadas de clube) | ~40 mil jogos |
| Mundo de 25 anos sem intervenção, preço de ingresso, finanças | ~100 mil jogos |

Como ler os números: "ppg" é pontos por jogo (vitória 3, empate 1). Num confronto entre times idênticos o valor esperado é cerca de **1,40** (não 1,00, porque há empates). O erro padrão típico é ±0,02 em cada célula, então diferenças menores que ~0,05 ppg não são distinguíveis de sorte.

Limitações: testei o motor, não a interface. As escalações dos técnicos de teste foram automáticas (o jogo escolhe os 11 melhores disponíveis); só formação, tática e ajustes de intervalo variaram entre as personalidades.

---

## Resumo em uma página

1. **O motor em si está saudável.** 2,7 gols/jogo, mandante vence 42%, empate 24%, visitante 34%. Favorito por prestígio ganha mais, mas azarão ainda vence (com +30 de prestígio o mandante vence 65–70%).
2. **A qualidade dos jogadores domina tudo; táticas e formações movem pouco.** Cada ponto de overall do time vale ~0,085 ppg. A melhor combinação tática contra a pior vale ~0,17 ppg, ou seja, ~2 pontos de overall. Entre os 10 técnicos de teste, do melhor ao pior deu 0,09 ppg (cerca de 1,3 posição na tabela por ano). O jogador humano dificilmente "vê" a diferença das suas escolhas na classificação.
3. **Stamina praticamente não existe como mecânica de gestão.** Todo titular chega ao apito inicial com ~100% (recupera tudo em 2 dias), perde ~19 pontos durante o jogo, e as substituições da IA e as manuais valem zero (+0,003 ppg). Só que o efeito de stamina baixa seria enorme (cada −10 de stamina inicial custa −0,13 ppg). O problema é que nunca chega a acontecer.
4. **Moral do jogador pesa bastante, mas vira bola de neve.** Time com moral 0 vs 100 vale 0,47 ppg (~5,5 pontos de overall). O terço de baixo da tabela perde ~23 pontos de moral numa temporada (57 → 34) e o de cima fica estável (~66): quem vai mal piora. Já a **moral do técnico quase não tem consequência** (±1 de moral por jogo no elenco, sem demissão, sem efeito nos clubes do computador).
5. **Lotação**: os fatores são previsíveis e o humano tem alavancas, mas há **um bug de preço** (explicação abaixo) e, nos clubes de Série D que o humano recebe, o estádio fica em 3–13% e ampliar nunca se paga.
6. **Defensores valem 4 vezes menos que atacantes** na prática (+10 de overall num zagueiro dá +0,03 ppg; num centroavante, +0,16). O mercado não percebe isso: compra-se atacante e goleiro, nunca defensor.
7. **O mundo envelhece sozinho.** Clubes do computador nunca renovam elenco: em 20 anos a idade média vai de 26 para 47 e o overall dos times da Série A cai de 71 para 50. Antes disso, o prestígio fixo faz o campeão da Série A sair sempre dos mesmos 8 clubes (Corinthians 29% dos títulos em 72 temporadas) e a Copa do Brasil ir para um time da Série A em 97% das vezes.

---

## 1. Stamina

**Como funciona hoje:** perda por jogo = (26 − FIS×0,13)/90 por minuto, ×1,1 se ofensivo, ×0,95 se defensivo, ×fator de idade. Recuperação = (6 + FIS×0,08) por dia de descanso × fator de idade. A força do jogador é multiplicada por 0,70 + 0,30 × stamina/100.

**O que medi:**

| Medida | Resultado |
|---|---|
| Stamina dos titulares no apito inicial (milhares de amostras) | média 99,9; percentil 10 = 100; mínimo 26–36 (só após lesão) |
| Stamina dos titulares no fim do jogo | média ~81 |
| Titulares com 32+ anos no apito inicial | média 99,9 |
| Efeito de começar com stamina menor (todo o time, adversário a 100) | 90 → −0,13 ppg · 80 → −0,29 · 70 → −0,42 · 60 → −0,57 · 50 → −0,72 |
| Substituições (trocar os 3 mais cansados aos 60', ao intervalo, escalonado, política da IA, nenhuma) | todas entre 1,363 e 1,366 ppg, ou seja, **zero diferença** |
| Trocas por jogo | IA: 0,13 (quase só lesões); manual agressivo: 0,9 |

**Conclusão:** a fórmula de efeito é forte, mas o descanso entre jogos (3–4 dias × 10–13 de recuperação por dia) é folgado demais e apaga todo o desgaste. Resultado: o jogador humano nunca precisa rodar o elenco, e as 3 substituições de 1998 não servem para nada além de lesão. O reserva é pior que o titular e o ganho de fôlego (~5% de força no fim) não compensa.

**Propostas (da mais simples à mais ambiciosa):**
- **A (recomendo):** reduzir a recuperação para ~3–4 por dia (e deixar o FIS e a idade pesarem mais). Titulares que jogam toda semana ficariam em 80–90 no apito inicial, e rodar o elenco passa a valer a pena.
- **B:** a IA do computador também trocar por stamina < 65 (hoje < 45), para os adversários não parecerem "robôs de 90 minutos".
- **C:** dar valor às substituições: o jogador que entra ganha um pequeno bônus de "pernas frescas" nos primeiros 20 minutos, ou o ganho de stamina entra na equação da substituição.
- Qualquer uma exige reavaliar o impacto: cada −10 de stamina inicial custa 0,13 ppg, então uma recuperação muito curta deixaria o jogo punitivo.

## 2. Moral do jogador e do técnico

**Como funciona hoje:** o multiplicador de força vai de 0,95 (moral 0) a 1,05 (moral 100). A moral muda a cada jogo em `(nota − 6,3) × 5`; quem não joga puxa para 50 com −1 por jogo (equilíbrio em ~25). A moral do técnico muda ±8 por resultado (mais contra time maior) e repassa `(moral do técnico − 50) × 0,02` para o elenco, só dos clubes humanos.

**O que medi:**

| Medida | Resultado |
|---|---|
| Efeito da moral do time (adversário a 65) | 0 → 1,05 ppg · 25 → 1,18 · 45 → 1,27 · 65 → 1,36 · 85 → 1,45 · 100 → 1,52 |
| Moral média dos 14 melhores, ao longo das rodadas 6 → 36 (Série A) | 1º terço: 66 → 66 · 2º terço: 62 → 55 · último terço: 57 → 34 |
| Série D, mesma conta | 1º terço: 63 → 65 · 2º: 58 → 53 · último: 55 → 39 |
| Moral dos titulares (todas as divisões) | média 60, percentil 10 = 32, percentil 90 = 97 |
| Moral dos reservas (fora dos 14 melhores) | média 43 |
| Moral do técnico ao fim da temporada | 1º terço: 83 · 2º: 57 · último: 27 |
| Técnico com moral ≥ 95 durante o ano | 22% do tempo no 1º terço |

**Conclusões:**
- A moral é uma alavanca **forte** (a faixa típica de 35 a 95 já mexe ~0,3 ppg, o mesmo que +3,5 de overall), mas ela é **autorreforçada**: ganhar sobe a moral, que ajuda a ganhar. Um time que entra em má fase tem pouco como reagir, porque o humano não tem nenhuma ação de moral (conversa, prêmio, folga). O que sobra é jogar melhor.
- A **moral do técnico não tem consequência real**: não há demissão, nem pressão da diretoria, e o repasse ao elenco é ±1 por jogo no máximo, só no clube humano. Hoje ela é um painel bonito.
- Reservas ficam em ~25–45 de moral, então quando alguém precisa jogar (lesão) entra deprimido.

**Propostas:**
- **A (recomendo):** dar ao humano pelo menos uma ação de moral (prêmio por vitória, folga extra, conversa no vestiário) com custo em dinheiro ou stamina, e um freio na espiral (ex.: moral de quem perde tende a parar em ~40, em vez de cair sem fim).
- **B:** dar consequência à moral do técnico: abaixo de ~20 por N jogos a diretoria avisa e depois demite (game over no single player, ou perda de pontos de patrocínio); acima de 80, bônus em negociação/patrocínio.
- **C:** estreitar a faixa do multiplicador (0,97–1,03) se acharmos a espiral forte demais. É decisão de design: hoje ela recompensa boas campanhas, mas também pune demais as ruins.
- **D:** deixar reservas que entram em campo recuperarem moral mais rápido (ou não caírem abaixo de ~40).

## 3. Lotação dos estádios

**Fórmula atual:** `público = demanda_do_clube × (1 + 0,35 × forma) × rival × (preço/preço_padrão)^−1,3 × ruído(±8%)`, com teto na capacidade e piso de 3% da capacidade. `demanda = 25 × prestígio^1,55 × k_divisão`.

**Fatores que influenciam (e os que não influenciam):**

| Fator | Efeito | Observação |
|---|---|---|
| Prestígio do mandante | base da demanda (~87× entre o maior e o menor clube) | fixo para sempre, nunca muda com campanhas |
| Forma (últimos 5 jogos, qualquer competição) | ×0,65 (5 derrotas) a ×1,35 (5 vitórias) | conta só V/E/D: perder 0×5 ou 0×1 é igual; goleada a favor não ajuda |
| Adversário | ×(1 + (prest. visitante − prest. mandante)/200), limitado a 0,90–1,30 | jogar contra time grande rende no máximo +30% |
| Clássico (mesma cidade) | ×1,25 | só Rio, São Paulo, Belém etc.; vale para clubes pequenos também |
| Preço do ingresso | (preço/padrão)^−1,3, de ×0,5 a ×3 | elasticidade fixa |
| Ruído | ±8% por jogo | |
| **Não influenciam** | posição na tabela, decisão/final, fase da Copa, dia da semana, nível/conforto do estádio, gols vistos, ano a ano | |

**Resultados medidos (liga, 72 temporadas):**

| Divisão | Lotação média | Jogos lotados | Menor / maior clube |
|---|---|---|---|
| A | 54% | 6% | 20% / 93% |
| B | 38% | 2% | 14% / 93% |
| C | 21% | 0% | 10% / 58% |
| D | 12% | 0% | 3% / 26% |

Grandes estádios dão lotação baixa (Flamengo 32%, Botafogo 20%, São Paulo 39%) e os pequenos de sucesso lotam (Palmeiras 91%, Santos 93%). É coerente com o Brasil da época, mas tem efeito de jogo:
- **Ampliar o estádio quase nunca se paga**: das 30 equipes que analisei, só Santos (retorno 1,5 ano), Portuguesa (1,5), Palmeiras (4,4) e Atlético-PR (4,8) têm demanda acima da capacidade. Nos 10 clubes que o humano pode receber (Série D), nunca (demanda = 3–12% da capacidade).
- **O humano recebe clubes com 3–12% de lotação** (Bangu 8%, Guarany de Bagé 3,5%). Mesmo com preço ×0,5, forma +1, clássico e rival grande, o teto teórico é 19–70%.

### Bug confirmado: o piso de 3% permite explorar o preço

O piso (3% da capacidade) é aplicado depois do efeito do preço. Quando a demanda cai abaixo do piso, o público trava no piso e subir o preço deixa de afastar torcida. Medi no jogo real (média de 3 temporadas, bilheteria anual em R$ mil / público médio):

| Clube | Preço padrão (R$4) | ×0,5 (R$2) | ×3 (R$12) |
|---|---|---|---|
| Marília | 79 mil / 926 | 97 mil / 2.279 | **146 mil / 570** |
| Guarany de Bagé | 27 mil / 331 | 31 mil / 783 | **72 mil / 298** |
| Bangu | 124 mil / 1.522 | 152 mil / 3.747 | 125 mil / 514 |

Em clubes muito pequenos o preço máximo rende 2 a 2,7× mais que o padrão sem perder público, e o preço mínimo (que seria o "ótimo" teórico, receita ∝ preço^−0,3) também rende mais que o padrão. A curva de receita fica em "U", com dois ótimos, um deles absurdo.

### Economia dos clubes que o humano recebe (Série D)

Sem mexer em nada, 1 temporada: receita R$106–204 mil (TV fixa de R$80 mil é a maior parte), despesa R$115–149 mil, saldo de −R$9 mil a +R$56 mil, caixa inicial R$74–96 mil. O patrocínio melhor (Cola Colinha, R$47–60 mil/ano, aceita com 54–60%) praticamente dobra o saldo. É apertado, mas jogável, e o patrocínio é a decisão com mais peso.

**Propostas:**
- **A (corrigir já):** aplicar o piso antes do efeito do preço, ou fazer o piso valer só até o preço padrão, para eliminar a exploração.
- **B:** incluir no cálculo a posição na tabela e o saldo de gols na forma (hoje só V/E/D), para o humano sentir recompensa por goleadas e por briga de título.
- **C:** fazer o prestígio mudar com os resultados (título +, rebaixamento −, campanha de Copa +), mesmo que lento. Hoje só a troca de divisão altera a demanda.
- **D:** dar ao humano de clube pequeno ferramentas além do preço: campanha de sócios/promoção de ingresso (custo fixo, efeito de demanda por N jogos), jogo-evento, ou sócio-torcedor.
- **E:** se quisermos que ampliar estádio seja decisão real, a demanda dos clubes médios precisa chegar perto da capacidade; ou então tirar as obras da tela para os clubes onde nunca fazem sentido.

## 4. Atributos, posições, táticas e formações

### 4.1 Atributos (+10 em um atributo nos 11 titulares, adversário igual)

| Atributo | ppg | Δ vs base (1,356) |
|---|---|---|
| CHU (chute) | 1,629 | **+0,27** |
| DEF (defesa) | 1,568 | **+0,21** |
| FIS (físico) | 1,458 | +0,10 |
| DRI (drible) | 1,452 | +0,10 |
| PAS (passe) | 1,449 | +0,09 |
| RIT (ritmo) | 1,435 | +0,08 |
| Todos +5 | 1,798 | +0,44 |
| Todos +10 | 2,186 | +0,83 |
| Todos −5 | 0,951 | −0,40 |

Cada ponto de overall no time inteiro vale ~**0,085 ppg** (≈3,2 pontos num campeonato de 38 jogos). Chute e defesa são ~3× mais valiosos que ritmo/passe. Isso é intencional (o peso por posição define), mas não fica claro ao jogador, que vê seis barras do mesmo tamanho.

### 4.2 Valor de cada posição (+10 de overall em um único jogador, 4-4-2)

| Posição | Δ ppg |
|---|---|
| Centroavante (CA) | **+0,16** |
| Segundo atacante (SA) | +0,15 |
| Goleiro | +0,13 |
| Volante / Meia central | +0,09 |
| Ala | +0,08 |
| Zagueiro / Lateral | **+0,03 a +0,04** |
| 4 defensores juntos | +0,145 |
| 4 meias juntos | +0,36 |
| 2 atacantes juntos | +0,30 |

Um zagueiro bom vale 4× menos que um centroavante bom, mas o mercado (`valorMercado`) cobra o mesmo por overall igual em qualquer posição. Para o humano que perceber isso, a estratégia dominante é comprar atacantes, meias e goleiro e nunca gastar com defensores (a defesa pesa pouco porque a força defensiva usa a média dos defensores, não a soma, e o goleiro absorve 30%).

### 4.3 Táticas (pontos por jogo da linha contra a coluna, times idênticos, 4-4-2)

| | Ofensivo | Equilibrado | Defensivo | Contra |
|---|---|---|---|---|
| **Ofensivo** | 1,38 | 1,45 | 1,44 | **1,28** |
| **Equilibrado** | 1,36 | 1,40 | 1,40 | 1,47 |
| **Defensivo** | 1,35 | 1,41 | 1,39 | **1,56** |
| **Contra** | **1,50** | 1,31 | **1,19** | 1,37 |
| média | 1,39 | 1,40 | 1,42 | 1,34 |

Gols por jogo: ofensivo 2,86, equilibrado 2,59, contra 2,44, defensivo 2,34. O ciclo "pedra-papel-tesoura" existe (contra bate ofensivo; ofensivo bate defensivo e equilibrado; defensivo e equilibrado batem contra) e muda o estilo do jogo, mas **contra só vence o ofensivo e perde de todo o resto** (média 1,34, a pior). A diferença máxima de uma célula (1,19 a 1,56) é ±0,18 ppg, e nenhuma tática é dominante em média.

### 4.4 Formações (tática equilibrada, linha contra coluna)

| | 4-3-3 | 4-2-3-1 | 4-4-2 | 4-5-1 | 3-5-2 | 3-4-3 | média |
|---|---|---|---|---|---|---|---|
| 4-3-3 | 1,40 | 1,31 | 1,37 | 1,31 | 1,33 | 1,37 | 1,35 |
| 4-2-3-1 | 1,49 | 1,42 | 1,46 | 1,40 | 1,41 | 1,49 | **1,45** |
| 4-4-2 | 1,43 | 1,33 | 1,40 | 1,33 | 1,34 | 1,41 | 1,37 |
| 4-5-1 | 1,49 | 1,40 | 1,46 | 1,39 | 1,39 | 1,47 | 1,43 |
| 3-5-2 | 1,50 | 1,41 | 1,47 | 1,40 | 1,41 | 1,49 | **1,45** |
| 3-4-3 | 1,42 | 1,33 | 1,39 | 1,32 | 1,34 | 1,37 | 1,36 |

Há três formações melhores (4-2-3-1, 3-5-2, 4-5-1: +0,06 a +0,10 ppg) e três piores (4-3-3, 3-4-3, 4-4-2). O motivo é o bônus de **controle de bola** (`ctl` +3% a +4%) nas três primeiras, que pesa mais que os bônus de ataque do 4-3-3 e do 3-4-3. Na prática o "time ofensivo clássico" (4-3-3 ofensivo) é o 21º de 24 combos.

### 4.5 Ranking das 24 combinações (todos contra todos, ~4.100 jogos cada, ±0,02)

Melhores: 4-2-3-1 defensivo (1,451) · 3-5-2 defensivo (1,451) · 4-2-3-1 equilibrado (1,450) · 3-5-2 ofensivo (1,436).
Piores: 4-3-3 contra (1,276) · 4-4-2 contra (1,282) · 3-4-3 contra (1,295) · 4-3-3 ofensivo (1,306).
Amplitude total: 0,175 ppg ≈ 2 pontos de overall.

A IA usa 4-3-3 ofensivo quando é bem mais forte e 4-5-1 (contra ou defensivo) quando é bem mais fraca. Ou seja, **os times grandes do computador jogam com uma das piores combinações**, o que ajuda um pouco o humano.

## 5. Teste com 10 técnicos humanos (personalidades)

**Desenho:** 10 clubes de Série D (os que o humano pode receber). Cada personalidade jogou 240 temporadas de clube (24 mundos × 10 rodízios, passando por todos os clubes e elencos). Escalação automática dos melhores 11; só formação/tática/ajuste de intervalo variaram. Controle: os mesmos clubes sob a IA.

| Personalidade | ppg | Gols pró | Gols contra | Posição média (de 20) |
|---|---|---|---|---|
| G Camaleão (adapta ao rival: ofensivo se mais forte, contra se mais fraco) | **1,179** | 0,97 | 1,22 | 13,7 |
| D Retranca (4-5-1 defensivo) | **1,174** | 0,90 | 1,15 | 13,5 |
| H Otimizado (4-2-3-1 defensivo) | 1,149 | 0,87 | 1,15 | 14,1 |
| B Contra-ataque (4-5-1 contra) | 1,146 | 0,93 | 1,22 | 14,1 |
| E Controlador (3-5-2 equilibrado) | 1,145 | 0,96 | 1,28 | 14,3 |
| F Kamikaze (3-4-3 ofensivo) | 1,140 | 1,01 | 1,36 | 14,3 |
| I Reativo (4-4-2; muda no intervalo) | 1,108 | 0,92 | 1,31 | 14,6 |
| J Mandante ofensivo / visitante retranca | 1,102 | 0,93 | 1,27 | 14,7 |
| A Ofensivo (4-3-3 ofensivo) | 1,085 | 0,97 | 1,40 | 14,7 |
| C Equilibrado (4-4-2 equilibrado) | 1,085 | 0,92 | 1,31 | 15,0 |
| *Controle: IA nos mesmos clubes* | *1,104* | *0,93* | *1,28* | *14,8* |

(Erro padrão ≈ ±0,02 ppg por personalidade.)

**Leitura:**
- As escolhas **fazem diferença estatística**, mas pequena: o melhor técnico de teste ganha ~0,075 ppg a mais que a IA (~2,8 pontos por temporada, ~1 posição). O ofensivo e o equilibrado ficam no nível da IA (ou abaixo).
- As diferenças mais visíveis são **no estilo**, não no resultado: o Kamikaze marca 1,01 gol/jogo e sofre 1,36; a Retranca marca 0,90 e sofre 1,15. Isso o jogador sente nos jogos, mas a classificação praticamente não registra.
- A personalidade que mais ganha (Camaleão) é a que **lê o adversário**. Isso é bom: premia quem estuda o jogo. Mas o jogador só percebe se a interface mostrar o que o adversário vai fazer.
- Mudança de tática no intervalo (Reativo) não ajudou (1,108 vs 1,085 do equilibrado puro; dentro do ruído).
- A lotação média foi idêntica entre personalidades (8,5% a 8,7%), porque a diferença de resultados é pequena demais para a "forma" mexer no público.

## 6. Estrutura do campeonato e do mundo (bônus: achados fora do pedido)

- **Prestígio é fixo.** Em 72 temporadas, todos os campeões da Série A saíram de 8 clubes: Corinthians 21 (29%), Flamengo 14, São Paulo 13, Palmeiras 9, Grêmio 6, Vasco 4, Cruzeiro 3, Internacional 2. A correlação prestígio × pontos é 0,75–0,80 na Série A. A Copa do Brasil foi vencida por um time da Série A em 70 de 72 edições.
- **O mundo envelhece sem reposição.** Só clubes humanos recebem juniores e só humanos perdem contrato (o computador renova sozinho). Simulei 25 anos sem humanos: idade média 25,8 → 47,8; overall dos 14 melhores de Série A 70,9 → 49,7 (D: 48,4 → 27,6). Os primeiros 5 anos são estáveis; depois cai ~1,5 ponto por ano. Não aparece em partidas curtas de teste, mas em campanhas de 10+ anos o jogo degrada.
- **Disciplina:** 3,0 amarelos e 0,19 vermelhos por jogo, 0,27 lesões por jogo (~0,45 lesionados por clube em qualquer momento). Valores plausíveis.
- **Gols por divisão:** A 3,1 · B 2,8 · C 2,7 · D 2,4. A Série A tem mais gols que as demais (efeito da média de qualidade mais alta); não é problema.

## 7. Propostas priorizadas

| # | Mudança | Impacto | Esforço | Recomendação |
|---|---|---|---|---|
| 1 | Corrigir o piso de 3% do público (exploração de preço) | Evita estratégia absurda em clubes humanos | Baixo | **Fazer** |
| 2 | Reposição e aposentadoria de jogadores para o computador (juniores, retirada ~36–38) | Torna campanhas longas viáveis | Médio | **Fazer** |
| 3 | Dar valor à stamina (recuperação mais lenta + IA troca em stamina < 65) | Faz rodízio e substituição terem sentido | Baixo, mas exige ajuste fino | **Fazer, testando** |
| 4 | Reequilibrar peso dos defensores e/ou preço de mercado por posição | Fecha a estratégia dominante de "só atacante" | Baixo/médio | **Fazer** |
| 5 | Ajustar formações para que 4-3-3 e 3-4-3 não sejam inferiores (bônus de ataque ou penalidade menor no `ctl` das três melhores) | Mais variedade real de escolha | Baixo | **Fazer** |
| 6 | Dar ações e consequências à moral (prêmio, conversa, demissão do técnico) | Tira a moral de "painel" e dá agência | Médio | **Discutir** |
| 7 | Mostrar ao jogador o que o adversário vai fazer e o efeito de cada escolha (relatório tático pré e pós-jogo) | Faz a diferença de 0,1 ppg ser perceptível | Médio | **Discutir** |
| 8 | Prestígio dinâmico (título, rebaixamento, Copa) | Mais variedade de campeões e demanda | Médio | **Discutir** |
| 9 | Ferramentas de público para clube pequeno (campanha de sócios, jogo-evento) | Dá o que fazer com a bilheteria da Série D | Médio | **Discutir** |
| 10 | Incluir saldo de gols/posição na forma que afeta o público | Realismo e recompensa de goleadas | Baixo | Opcional |
| 11 | Alargar o efeito de táticas/formações (ex.: dobrar os modificadores) | Escolhas valem ~2 pontos de overall em vez de ~1 | Baixo | **Decisão de design** |

## 8. Onde mais devemos testar

1. **Mercado, contratos e treinamento**: compra/venda/leilão, renovação, salário vs valor, treino de atributos (`concluirTreino`), juniores. Não toquei nisso e há bastante dinheiro e progressão em jogo.
2. **Campanhas longas com humano** (10+ anos): evolução de atributos, envelhecimento do próprio elenco, fluxo de caixa com compras, dificuldade de manter o clube.
3. **Progressão de atributos** (`aplicarPosJogo`, `virarAno`): ritmo de crescimento de jovens, queda de veteranos, retorno decrescente.
4. **Escalação manual** (fora de posição, `afinidade`): testei só a escalação automática; falta medir quanto custa colocar um jogador fora da posição e se compensa.
5. **Copa do Brasil**: sorteio, mata-mata de 64 clubes, impacto de pênaltis (76% de acerto fixo), calendário apertado.
6. **Jogo pela interface** (clique a clique): ergonomia das telas de tática, moral, finanças e se o jogador entende os efeitos. Meus testes foram no motor.
7. **Multiplayer e determinismo**: confirmar que servidor e clientes chegam aos mesmos resultados com mesma semente, com os 10 técnicos humanos ao mesmo tempo.
8. **Séries B e C** com humano: só testei Série D (é onde o humano começa), mas promoção/rebaixamento muda demanda e custos.

## Apêndice — Scripts

Os scripts que usei estão em `scripts/` (Node; carregam o `index.html` da branch e simulam o motor real): `exp1` baseline e finanças, `exp2` matrizes de tática/formação, `exp3` atributos, posições, stamina e moral, `exp4` lotação (fórmulas), `exp5` substituições, `exp6` grade 24×24, `exp7` dinâmica de moral, `exp8` técnicos humanos, `exp9` mundo em 25 anos, `exp10` preço de ingresso, `exp11` economia da Série D.
