# Kfoot 98 — Relatório 2: bateria detalhada de balanceamento

Versão testada: branch `claude/melhorias-5-xt6u1f`, jogo na versão 17 (commit `2defbbd`, já com os prêmios extras: melhor goleiro, revelação, garçom e melhor técnico). Nada foi alterado no código, nada foi enviado ao repositório e o artefato não foi republicado. Este relatório é só diagnóstico e proposta, para decidirmos juntos.

## Como testei

Carreguei o motor real do jogo em Node, sem a tela, e simulei em volume. Usei o mesmo código que roda no navegador, incluindo tática, formação, sinergia, leitura de intervalo, stamina dinâmica, moral, lesões, pênaltis, Copa nivelada, aposentadorias e premiações.

| Bateria | Volume |
|---|---|
| Mundo inteiro (80 clubes, liga e Copa), 12 mundos de 10 temporadas | ~200 mil jogos de liga |
| Goleiro e posições trocadas (atacante no gol etc.) | ~100 mil jogos |
| ±10 de overall por posição e por atributo, atributos com mesmo overall | ~250 mil jogos |
| Stamina inicial, moral, substituições, rodízio, intervalo | ~150 mil jogos |
| Táticas (4×4), formações (6×6) e grade de 24 combinações | ~160 mil jogos |
| 10 estilos de técnico humano, 240 temporadas de clube cada | ~400 mil jogos |
| 5 níveis de habilidade em 10 clubes de todas as séries, 240 temporadas cada, mais campanhas de 3 anos | ~500 mil jogos |
| Copa nivelada, moral ao longo da temporada, mundo de 25 anos | ~100 mil jogos |

Leitura dos números: ppg é pontos por jogo (vitória 3, empate 1). Entre times idênticos o esperado é cerca de 1,35 a 1,40. O erro padrão típico é ±0,02 ppg nas baterias grandes, então diferenças menores que ~0,05 não se distinguem de sorte. GF e GC são gols feitos e sofridos por jogo.

Limitações: testei o motor, não a interface. Os técnicos de teste não negociaram nada no mercado, não treinaram jogadores e escalaram automaticamente os 11 melhores. Isso significa que medi o efeito de formação, tática, intervalo e trocas, e não o efeito de montar elenco, que provavelmente é o principal caminho de evolução do jogador.

---

## Resumo em uma página

1. **O motor já simula cada posição, e as trocas de posição punem de verdade.** Goleiro ruim sofre 23% mais gols. Um centroavante no gol sofre 61% mais gols (2,04 contra 1,27) e converte 48% dos chutes no alvo contra 34%. Quatro atacantes na defesa levam 2,28 gols por jogo e o time vale 0,58 ppg. O efeito existe e aponta na direção certa, mas é mais fraco do que seria no futebol: um jogador de linha no gol "defende" mais do que deveria.
2. **O jogo é equilibrado no que importa, e tem caos suficiente.** 2,74 gols por jogo, mandante 40% / empate 24% / visitante 36%, 24% de jogos decididos por zero gols de diferença, 40% por um, 24% por dois. Um time 6 pontos de overall mais forte joga em casa e vence 59%, perde 19%.
3. **A Série A é previsível demais.** A correlação entre força inicial e posição final é 0,87. O campeão foi o time mais forte em 38% das temporadas e esteve entre os 3 mais fortes em 74%. Em 120 temporadas só 8 clubes foram campeões e o Corinthians ganhou 35%.
4. **Atributos, stamina e moral afetam o jogo, e isso é forte.** Moral de 0 para 100 vale 0,56 ppg. Stamina inicial 80 em vez de 100 custa 0,31 ppg. Cada ponto de overall do time vale ~0,085 ppg. Mas os atributos não são iguais: chute (CHU) e defesa (DEF) pesam muito, enquanto ritmo (RIT), físico (FIS), passe (PAS) e drible (DRI) quase não mudam o resultado, mesmo com overall igual.
5. **As escolhas do técnico humano quase não aparecem no resultado.** Entre os 10 estilos de teste, a diferença do melhor ao pior foi 0,09 ppg (3,5 pontos por temporada). Um técnico que sorteia formação e tática a cada jogo fica no topo do ranking. Entre 5 níveis de habilidade (do aleatório ao expert) a diferença foi de 0,05 a 0,07 ppg. O clube sorteado muda o ppg de 0,65 a 1,80. Ou seja, a dificuldade é decidida pelo sorteio do clube, não pelo que o jogador faz.
6. **A leitura de intervalo foi anulada pelo computador.** Se o computador não reagisse, a resposta tática certa no intervalo valeria +0,13 ppg e a errada −0,10. Como o computador responde à mudança do humano em 60% das vezes (sempre depois dele), a resposta certa do humano vale zero.
7. **A sinergia não é neutra.** Com elencos normais ela já dá +4% a +6% de defesa para quase toda combinação com defesa forte e +5% de controle para 4-2-3-1 e 3-5-2, no limite de 6%. O humano que "monta o time certo" não tem para onde crescer, e quem não monta nada ganha o mesmo bônus.
8. **Pontos já corrigidos desde o relatório 1:** o mundo não envelhece mais (25 anos estáveis, idade média ~25 e overall da Série A perto de 67,5), a Copa nivelada funciona, o público dos clubes pequenos subiu (Série D 25%), e a recuperação de stamina agora cria desgaste real em sequências de jogos.

---

## 1. O jogo é rodado posição por posição?

O minuto a minuto funciona assim: define-se quem tem a bola (controle dos meias, ataque e defesa), se há uma finalização (ataque contra a defesa do rival) e, na finalização, quem chuta (atacantes ficam com 64% dos chutes, meias 31%, defensores 5%), quem marca (zagueiro ou volante, pesado pela DEF) e o goleiro (DEF e overall no gol). Também há faltas, cartões, lesões, pênaltis e passes.

### 1.1 Gols, chutes e passes por setor (200 mil jogos)

| Indicador | Atacantes | Meias | Defensores |
|---|---|---|---|
| Gols | 65% | 29% | 6% |
| Chutes | 64% | 31% | 5% |
| Assistências | 13% | 57% | 30% |
| Desarmes | 0% | 31% | 69% |

Gols e chutes estão realistas. **Assistências não:** defensores dão 30% e atacantes só 13%, porque o passador é sorteado entre todos pesado por PAS e os defensores têm muitos passes. Em um jogo real, atacantes e meias dão a maioria das assistências. Os atacantes nunca fazem desarme, o que também é uma simplificação.

### 1.2 Quem está no gol

Teste: mesmo elenco, 4-4-2 equilibrado contra time igual (6 mil jogos por linha). A linha base tem 1,27 gols sofridos por jogo e 34% de conversão dos chutes no alvo.

| Quem joga no gol | GC por jogo | Conversão no alvo | ppg |
|---|---|---|---|
| Goleiro titular normal | 1,27 | 34% | 1,35 |
| Goleiro ruim (todos os atributos −20) | 1,56 | 40% | 1,15 |
| Goleiro ruim só em DEF (−25) | 1,55 | 40% | 1,17 |
| Goleiro elite (+15) | 1,05 | 29% | 1,52 |
| Melhor zagueiro no gol | 1,67 | 39% | 1,09 |
| Melhor volante no gol | 1,66 | 39% | 1,09 |
| Melhor meia (MEI) no gol | 1,96 | 47% | 0,94 |
| Melhor centroavante no gol | 2,04 | 48% | 0,86 |
| Jogador de linha com menor DEF no gol | 2,10 | 51% | 0,86 |

Conclusão: o que você pediu funciona. Um atacante no gol sofre bem mais gols, principalmente se a defesa dele é ruim: +61% contra o goleiro normal e +65% com o menor DEF. A DEF do goleiro sozinha já explica quase todo o efeito (−25 de DEF = 1,55 gols). O ponto fraco é de realismo: no futebol um atacante no gol tomaria bem mais, perto de 3 gols por jogo, e aqui o limite parece ser a faixa de probabilidades do chute (14% a 58% de gol). Também sofre-se mais chutes (10,4 para 11,6 por jogo), o que mostra que a defesa em volta reage à troca.

### 1.3 Outras posições trocadas

| Troca | GF | GC | ppg |
|---|---|---|---|
| Base | 1,26 | 1,27 | 1,35 |
| Melhor goleiro de centroavante | 0,87 | 1,38 | 0,96 |
| Melhor zagueiro de centroavante | 0,99 | 1,31 | 1,12 |
| Dois melhores zagueiros nos dois ataques | 0,77 | 1,40 | 0,86 |
| Melhor centroavante de zagueiro | 1,19 | 1,49 | 1,14 |
| Dois centroavantes de zagueiros | 1,12 | 1,72 | 0,93 |
| Três atacantes no meio | 0,88 | 1,61 | 0,82 |
| Quatro atacantes na defesa | 1,05 | 2,28 | 0,58 |
| Lateral esquerdo de zagueiro | 1,21 | 1,37 | 1,23 |

O efeito de jogar fora de posição aparece nos gols a favor e contra, nos chutes sofridos e no ppg, e é maior quanto mais distante a posição. Isso é coerente com o que você pediu.

### 1.4 Valor de cada posição (+10 e −10 de overall em um jogador)

| Posição | +10 | −10 |
|---|---|---|
| Goleiro | +0,135 | −0,10 |
| Zagueiro (cada) | +0,05 a +0,06 | −0,02 |
| Lateral (cada) | +0,04 | −0,02 |
| Volante | +0,12 | −0,08 |
| Meia central | +0,10 | −0,06 |
| Ala (cada) | +0,09 a +0,10 | −0,06 |
| Centroavante | +0,16 | −0,12 |
| Segundo atacante | +0,13 | |

Houve melhora desde o relatório 1 (zagueiro de +0,03 para +0,05), mas defensores e laterais ainda valem pelo menos metade de um volante ou ala e cerca de um terço de um centroavante. O mercado cobra o mesmo por overall igual em qualquer posição, então o jogador esperto continua pagando menos por defesa do que o jogo recompensa em ataque.

### 1.5 O que a posição "cobra" do jogador

Os quatro números acima juntos sugerem uma lógica clara: o gol é decidido em três pontos (quem chuta, quem marca, goleiro), e os setores de defesa pesam pela média, não pela soma. Isso é um desenho aceitável, mas explica por que atacantes e goleiros são sempre prioridade de compra.

---

## 2. Atributos

### 2.1 Efeito de cada atributo nos 11 titulares

| Atributo | +10 | −10 | O que muda |
|---|---|---|---|
| CHU (chute) | +0,29 | −0,25 | GF de 1,26 para 1,60 |
| DEF (defesa) | +0,32 | −0,23 | GC de 1,27 para 0,94 |
| PAS (passe) | +0,14 | −0,07 | pouco |
| DRI (drible) | +0,14 | −0,08 | pouco |
| FIS (físico) | +0,09 | −0,08 | stamina |
| RIT (ritmo) | +0,04 | −0,07 | quase nada |
| Todos | +0,84 | −0,80 | |

### 2.2 O atributo importa além do overall?

Teste: manter o overall do jogador e deslocar um atributo para cima (compensando no físico). Se só o overall importasse, o resultado não mudaria.

| Mudança com overall igual | Δ ppg |
|---|---|
| Atacantes: CHU +12 | +0,21 |
| Atacantes: CHU −12 | −0,13 |
| Defensores: DEF +12 | +0,08 |
| Defensores: DEF −12 | −0,07 |
| Goleiro: DEF +12 | +0,06 |
| Goleiro: DEF −12 | −0,05 |
| Meias: PAS +12 | +0,05 |
| Meias: DRI +12 | +0,05 |
| Time todo: FIS +12 | +0,03 |
| Time todo: RIT +12 | −0,015 |

Ou seja, a composição dos atributos importa, principalmente CHU para atacantes. É bom para o jogador sentir a escolha (ele pode preferir um atacante de chute forte). O problema é que RIT, FIS, PAS e DRI são quase decorativos: o jogador não nota diferença quando escolhe um jogador rápido, passador ou driblador. Nenhum deles tem uma função própria visível no jogo.

---

## 3. Stamina

Regras atuais: perda por jogo (26 − FIS×0,13), +10% se ofensivo, −5% se defensivo, ajustada pela idade. Recuperação por exponencial de ~16% do que falta por dia. Força multiplicada por 0,70 + 0,30 × stamina/100. Quem entra do banco ganha "pernas frescas" (+7% nos primeiros 25 minutos).

| Medida | Resultado |
|---|---|
| Stamina dos titulares no apito inicial, mundo todo | média 88,9; percentil 10 = 81; percentil 90 = 98 |
| Time que joga a cada 3 e 4 dias (30 jogos), escalação automática | média ~77 depois do 1º jogo |
| Mesmo time, sempre o melhor 11 ignorando o cansaço | média ~70 |
| Efeito de começar com stamina menor (todo o time) | 90: −0,16 · 80: −0,31 · 70: −0,44 · 60: −0,58 · 50: −0,70 |
| Rodízio automático contra "sempre o melhor 11" | +0,05 ppg (1,02 contra 0,97; no limite do ruído) |
| 3 trocas por cansaço aos 60' | +0,034 ppg (1,361 contra 1,327; no limite do ruído) |
| Trocas por jogo da IA | 0,16 (quase só lesões) |

Avaliação: **melhorou muito**. A recuperação nova faz a stamina cair de 100 para ~77 numa sequência de jogos, e isso custa ~0,3 ppg de forma real, então o jogador passa a ter motivo para rodar elenco e usar o banco. O que ainda falta é recompensa visível: o ganho de rodar o elenco (+0,05) e de trocar três jogadores (+0,03) é pequeno perto do custo de ignorar o cansaço (−0,3). Em outras palavras, o jogo avisa o problema mas a solução rende pouco. O limiar de troca da IA (stamina < 65) quase nunca dispara.

## 4. Moral

Regras atuais: multiplicador de força de 0,95 (moral 0) a 1,05 (moral 100). A moral muda a cada jogo em (nota − 6,3) × 5; reserva que entra ganha +3 e perde só metade se for mal (piso ~40); reserva parado desce 1 por jogo e para em ~40. A moral do técnico muda ±8 por resultado.

| Moral do time (adversário a 65) | ppg |
|---|---|
| 0 | 1,01 |
| 25 | 1,13 |
| 45 | 1,28 |
| 65 (base) | 1,34 |
| 85 | 1,44 |
| 100 | 1,57 |

Moral vale 0,56 ppg do mínimo ao máximo, mais que stamina e quase tanto quanto +6 de overall. Dinâmica ao longo da temporada (Série A, média dos 14 melhores, da rodada 6 à 36):

| Terço final da tabela | Moral dos jogadores | Moral do técnico |
|---|---|---|
| 1º terço | 65 → 68 | 84 → 89 |
| 2º terço | 61 → 56 | 57 → 56 |
| Último terço | 61 → 42 | 61 → 27 |

Na Série D, o último terço termina com moral de técnico em 13 e de jogadores em 41. Os pisos novos evitaram o poço sem fundo dos reservas (agora a média deles é 46, antes 43), mas o último terço continua afundando 20 pontos de moral em uma temporada, o que equivale a −0,2 ppg: um efeito "bola de neve" que o jogador humano não tem como reverter. A moral do técnico continua só como painel: não há demissão nem efeito direto além de ±1 de moral por jogo no elenco humano.

---

## 5. Táticas, formações e intervalo

### 5.1 Táticas (linha contra coluna, times idênticos, 4-4-2)

| | Ofensivo | Equilibrado | Defensivo | Contra |
|---|---|---|---|---|
| Ofensivo | 1,36 | 1,41 | 1,40 | 1,25 |
| Equilibrado | 1,40 | 1,44 | 1,43 | 1,46 |
| Defensivo | 1,40 | 1,41 | 1,38 | 1,48 |
| Contra | 1,39 | 1,29 | 1,25 | 1,36 |

Média por tática: equilibrado 1,43, defensivo 1,42, ofensivo 1,35, contra 1,32. Gols por jogo: ofensivo 2,56, equilibrado 2,47, defensivo 2,23, contra 2,22. O "pedra-papel-tesoura" quase sumiu: a única resposta clara é equilibrado ou defensivo contra "contra". A tática ofensiva já não domina, mas a "contra" é a pior em quase todas as formações.

### 5.2 Grade de 24 combinações (todos contra todos, 4.830 jogos cada)

Melhores: 3-4-3 defensivo (1,418), 3-4-3 ofensivo (1,404), 3-4-3 equilibrado (1,402), 4-3-3 equilibrado (1,401). Piores: 4-4-2 contra (1,258), 4-5-1 contra (1,291), 3-5-2 contra (1,297), 4-2-3-1 contra (1,299).

| Formação (média das 4 táticas) | ppg |
|---|---|
| 3-4-3 | 1,398 |
| 4-3-3 | 1,373 |
| 4-2-3-1 | 1,366 |
| 3-5-2 | 1,347 |
| 4-5-1 | 1,327 |
| 4-4-2 | 1,322 |

A amplitude entre a melhor e a pior combinação é 0,16 ppg, ou seja, ~2 pontos de overall. O ranking inverteu em relação ao relatório 1 (agora as formações ofensivas lideram e as defensivas ficam atrás). A diferença é pequena e cada combinação tem um custo, que é o que o desenho pedia. O 4-4-2, que é o padrão do jogo, é a pior formação média.

### 5.3 A sinergia não é neutra

A sinergia mede a especialização do XI. A conta diz que deveria ser neutra, mas com elencos normais ela dá bônus fixos por combinação:

| Combinação | Bônus que o time ganha sem fazer nada |
|---|---|
| Defensivo, 4-5-1 / 3-5-2 / 3-4-3 | defesa +6% (limite) |
| Equilibrado, 4-5-1 / 3-5-2 / 3-4-3 | defesa +5,8% a +6% |
| Equilibrado ou ofensivo, 4-4-2 | defesa +1,7% a +4% |
| 4-2-3-1 e 3-5-2 (qualquer tática) | controle +5% |
| Ofensivo, 3-4-3 | ataque −1,6% |

Os defensores já nascem com DEF alta e o ataque com CHU alto (perfil por posição). Então "defesa acima da média do time" é verdade para quase todo elenco. Como o teto é 6%, quem monta um time especializado de propósito não ganha mais que quem não montou nada. O jogador não recebe nenhum sinal de que a escolha dos jogadores certos para a tática funciona.

### 5.4 Intervalo

Teste: o time humano começa com equilibrado contra uma tática sorteada e muda no intervalo (900 jogos por linha).

| Política no intervalo | Computador não reage | Computador reage (60%) |
|---|---|---|
| Nada | 1,36 | 1,32 |
| Resposta tática certa | 1,49 (+0,13) | 1,28 |
| Resposta certa + formação pelo placar | 1,44 | 1,30 |
| Resposta errada | 1,27 (−0,10) | 1,28 |
| Sorteia tática e formação | 1,34 | 1,31 |

A leitura de intervalo foi desenhada para ser valiosa: +3% para a resposta certa e −2% para a errada. Só que o computador responde depois do humano, vendo a nova tática, e acerta em 60% dos casos. Resultado prático: acertar a leitura não rende mais do que não fazer nada. No jogo o humano vê "a tática X é a resposta certa" e depois o computador a anula, o que passa a sensação de que a escolha não conta.

### 5.5 Copa nivelada

Funciona como desenhado (jogo nivelado em 45% dentro do confronto):

| Confronto (prestígio) | Liga: forte vence | Copa: forte vence |
|---|---|---|
| 80 contra 80 | 39% | 39% |
| 70 contra 40 | 70% | 57% |
| 90 contra 30 | 90% | 73% |
| 60 contra 20 | 80% | 65% |

---

## 6. Técnicos humanos de teste

### 6.1 Dez estilos (clubes da Série D, 240 temporadas de clube por estilo)

| Estilo | ppg | GF | GC | Posição média |
|---|---|---|---|---|
| G Camaleão (adapta ao prestígio do rival) | 1,111 | 0,99 | 1,33 | 14,4 |
| I Aleatório (sorteia formação e tática todo jogo) | 1,103 | 1,00 | 1,36 | 14,5 |
| F Kamikaze (3-4-3 ofensivo) | 1,097 | 1,12 | 1,51 | 14,7 |
| D Retranca (4-5-1 defensivo) | 1,090 | 0,90 | 1,25 | 14,7 |
| J Mandante ofensivo, visitante retranca | 1,089 | 1,02 | 1,38 | 14,7 |
| H Leitor (4-2-3-1, lê o rival no intervalo) | 1,074 | 0,99 | 1,38 | 15,0 |
| C Equilibrado (4-4-2) | 1,071 | 1,01 | 1,43 | 15,0 |
| A Ofensivo (4-3-3) | 1,059 | 1,10 | 1,54 | 15,1 |
| E Controlador (3-5-2) | 1,056 | 1,00 | 1,41 | 15,1 |
| B Contra-ataque (4-5-1) | 1,019 | 0,88 | 1,32 | 15,6 |

Amplitude: 0,09 ppg (3,5 pontos por temporada, ~1 posição). O estilo se vê nos gols (Kamikaze faz 1,12 e sofre 1,51; Retranca faz 0,90 e sofre 1,25), mas não na classificação, e o sorteio aleatório fica à frente de seis estilos "pensados".

### 6.2 Cinco níveis de habilidade em 10 clubes de todas as séries

Clubes: dois por faixa (Série A topo e base, B, C, D). Cada nível passou por cada clube; 240 temporadas de clube por nível.

| Nível | ppg | Títulos / acessos / rebaixamentos por 100 temporadas |
|---|---|---|
| 1 Aleatório | 1,149 | 1,7 / 5,8 / 24,6 |
| 2 Passivo (4-4-2 equilibrado) | 1,135 | 1,7 / 4,2 / 26,3 |
| 3 Intuitivo (ataca se é maior, fecha se é menor) | 1,163 | 1,3 / 4,2 / 21,3 |
| 4 Estudioso (resposta tática ao adversário) | 1,165 | 2,5 / 4,6 / 27,1 |
| 5 Expert (nível 4 mais intervalo e trocas por cansaço) | 1,203 | 1,3 / 6,7 / 21,7 |

Em campanhas de 3 anos (270 temporadas por nível), o expert fica em 1,06 e o aleatório em 1,00, ou seja, cerca de 0,06 ppg (2,3 pontos por temporada). Já o clube importa muito mais:

| Clube | ppg (média dos 5 níveis) |
|---|---|
| São Paulo (Série A, topo) | 1,77 |
| Comercial-MS (Série D, forte) | 1,49 |
| São Caetano (Série C) | 1,38 |
| Marília (Série D) | 1,17 |
| Coritiba (Série A, base) | 1,03 |
| Ceilândia (Série D, fraco) | 0,91 |
| Paraná (Série A, mais fraco) | 0,69 |

### 6.3 Leitura de dificuldade

- **Piso e teto da habilidade são baixos.** Um técnico que não sabe nada de tática perde só ~0,06 ppg para um expert. Isso evita o jogo ficar impossível para quem erra, mas tira o sentimento de domínio de quem estuda.
- **A dificuldade é o sorteio.** Um clube de Série D fraco rebaixa-se ou luta contra o rebaixamento (~25% de rebaixamento por temporada para qualquer nível), enquanto um forte vive no meio da tabela. O que o jogador faz nas 38 rodadas muda a posição final em cerca de 1 lugar.
- **O jogo só ficará "nem fácil nem difícil" se as alavancas que mudam o time (mercado, treino, base, finanças) valerem mais que as táticas.** Não consegui medir isso porque os técnicos de teste não usaram o mercado. É a próxima bateria (ver seção 9).

---

## 7. Caos, previsibilidade e economia

### 7.1 Chance de vitória por diferença de força do XI (casa menos fora, em pontos de overall efetivo)

| Diferença | Casa vence | Empate | Visitante vence | Saldo médio |
|---|---|---|---|---|
| −12 | 11% | 19% | 70% | −1,27 |
| −8 | 18% | 23% | 59% | −0,83 |
| −4 | 28% | 26% | 46% | −0,35 |
| 0 | 39% | 26% | 35% | +0,09 |
| +4 | 52% | 24% | 24% | +0,56 |
| +8 | 66% | 20% | 14% | +1,07 |
| +12 | 75% | 16% | 8% | +1,53 |
| +16 | 85% | 11% | 4% | +2,02 |

A curva é suave: mesmo um time muito superior perde ou empata 15% a 25% das vezes. O mando de campo vale cerca de 1 ponto de overall (a 0 de diferença o mandante vence 39% e o visitante 35%). Isso é um bom nível de caos para um jogo de gestão, perto do futebol real.

### 7.2 Temporada de liga

| Série | Correlação força × posição final | Campeão era o mais forte | Campeão no top 3 | Pontos campeão / lanterna |
|---|---|---|---|---|
| A | 0,87 | 38% | 74% | 85 / 21 |
| B | 0,69 | 38% | 71% | 79 / 26 |
| C | 0,58 | 35% | 61% | 77 / 29 |
| D | 0,84 | 28% | 60% | 83 / 21 |

A Série A e a D são previsíveis. Os rebaixados na A são, em média, o 17º mais forte de 20. Isso se deve ao tamanho da diferença de força entre clubes (a A vai de 99 a 59 de prestígio). Em 120 temporadas de Série A, os campeões foram: Corinthians 42, Vasco 23, Flamengo 19, Palmeiras 17, São Paulo 12, Cruzeiro 3, Internacional 3, Botafogo 1.

### 7.3 Outros números do motor

| Indicador | Valor |
|---|---|
| Gols por jogo (A / B / C / D) | 2,80 / 2,76 / 2,72 / 2,59 |
| Margem de vitória: 0 / 1 / 2 / 3 / 4+ gols | 24% / 40% / 24% / 9% / 3% |
| 0×0 | 6,8% |
| Jogos com 7 gols ou mais | 2,2% |
| Chutes por jogo (total / no alvo) | 21,4 / 8,0 |
| Amarelos / vermelhos por jogo | 3,08 / 0,19 |
| Lesões por jogo | 0,14 (antes 0,27) |
| Pênaltis (lances) por jogo | 0,30 |
| Lotação média (A / B / C / D) | 58% / 49% / 36% / 25% |
| Jogos lotados (A) | 7% |

### 7.4 Economia e mundo longo

- Resultado anual médio sem intervenção (milhares de R$): A +4.490, B +1.406, C +542, D +172. Caixa após 10 anos: A 34 milhões, D 1,6 milhão. O dinheiro só acumula, porque os clubes do computador não gastam: não há despesa que freie essa inflação.
- Prêmios entram como 0,85 milhão por clube na A e 45 mil na D por ano, perto de 20% do resultado em D.
- Mundo de 25 anos: estável. Overall dos 14 melhores da A oscila em 67 a 68, idade média cai para ~25 após as aposentadorias e reposições. Há uma deflação suave inicial (de 71 para ~67 nos primeiros 8 anos) e depois estabiliza.
- Prestígio dinâmico funciona: foi de 5 a 99 em 10 anos, sem explosão.

---

## 8. Propostas de melhoria (para discutir)

Cada item diz o porquê, a proposta e o risco. Estão ordenados por impacto no "o jogador sente que a escolha dele conta".

1. **Intervalo que conta.** Hoje o computador anula a resposta do humano. Proposta: o computador reage antes do humano (com base na tática do 1º tempo, sem ver a mudança do humano), ou reage no máximo a cada 3 jogos, ou só 25% das vezes. Efeito esperado: resposta certa volta a valer cerca de +0,10 ppg. Risco baixo.
2. **Dar uma função própria a RIT, FIS, PAS e DRI.** Hoje só entram nos pesos do overall. Ideias: RIT decide contra-ataques e atacantes que vencem corrida; PAS aumenta a chance de a jogada virar chute (e assistência de verdade); DRI dribla o marcador e gera pênalti e falta; FIS decide disputas e resistência à lesão. Efeito: o jogador vê diferença quando escolhe o jogador rápido, passador ou driblador.
3. **Fazer a sinergia premiar a escolha.** Subtrair o bônus médio dos elencos normais (ou normalizar pelo clube) e aumentar o teto, para que só quem especializa o time de propósito ganhe bônus. Hoje todos ganham +4% de defesa de graça.
4. **Reforçar o goleiro e o jogador de linha no gol.** Aplicar uma penalidade explícita de defesa para quem não é goleiro (por exemplo, defesa x0,4), de modo que um atacante no gol sofra perto de 3 gols por jogo. Hoje a conversão sobe de 34% para 48%, o que vale menos que o desejado.
5. **Tornar a escalação mais visível.** Mostrar na tela de escalação o impacto de cada troca em ataque, defesa e controle (já existe parte na média do campo); mostrar o efeito de cada atributo no jogo.
6. **Assistências realistas.** Peso do passador por setor (meias 55%, atacantes 35%, defensores 10%).
7. **Tornar o expert mais recompensado e o iniciante menos punido.** O intervalo e as trocas são as alavancas diretas; ampliar o ganho de pernas frescas (de +7% para +10% e por 30 minutos) e fazer a IA trocar com limiar maior (stamina < 75).
8. **Reduzir a bola de neve da moral.** Dar ao humano uma ação de moral (prêmio por vitória, conversa, folga) e usar mais a moral do técnico: abaixo de 20 por 8 jogos a diretoria avisa; abaixo de 10, demite.
9. **Previsibilidade da Série A.** Aproximar o piso de força dos grandes e dos pequenos (hoje o campeão é o mais forte em 38% das vezes) ou aumentar a variância de forma do dia (hoje ±3%).
10. **Economia com sumidouro.** Os clubes do computador devem gastar (compra de jogadores, obras) ou ter custo fixo proporcional ao caixa; senão o dinheiro só cresce.
11. **Novas posições e papéis.** Atacantes participando de desarmes, laterais com perfil ofensivo ou defensivo, capitão e batedor de falta e pênalti, que dão mais identidade aos jogadores.
12. **Ranking de dificuldade.** Mostrar no sorteio a previsão de dificuldade do clube (por exemplo, "mais fraco que 80% da série") e oferecer níveis de dificuldade que alterem o fator de dia inspirado, a reação do computador e o caixa inicial.

## 9. Onde ainda devemos testar

1. **Mercado, treino e base com um técnico bot.** Falta medir se comprar, vender, renovar e treinar bem muda o ppg de um clube ao longo de 5 a 10 anos. É onde o jogador mais deve sentir evolução, e aqui eu não medi.
2. **Interface.** Se a tela mostra as informações que dão as escolhas (efeito de atributo, leitura de intervalo, sinergia) e se o jogador entende. Posso rodar um teste automatizado no navegador.
3. **Preço do ingresso e lotação depois das mudanças.** Reteste do piso de 3% (a exploração do relatório 1) e do efeito do preço em cada série.
4. **Sinergia e atributos com elencos montados à mão** (mesmo overall, perfis diferentes) em campanhas de 5 anos.
5. **Copa do Brasil com humano**, incluindo pênaltis com escolha de batedor.
6. **Multiplayer e determinismo** com vários humanos ao mesmo tempo.

## Apêndice

Scripts em `scripts-02/` (Node; carregam o `index.html` da branch e rodam o motor real): `w1.js` mundo e caos, `p1.js` posições, goleiro e atributos, `s2.js` rodízio, intervalo e sinergia, `w2.js` estilos e níveis de técnico, `cup.js` Copa, `exp3/5/6/7/9.js` stamina, moral, trocas, grade e mundo longo.
