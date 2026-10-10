# Kfoot 98: documentação do jogo (versão 27)

Documento vivo: cresce junto com a implementação. Cada rodada de melhorias atualiza as seções que mudaram. Valores vêm do código da branch `claude/melhorias-5-xt6u1f` (pasta `kfoot98`). Quando algo ainda não está documentado, a seção diz "a detalhar".

Arquivos de dados desta pasta:
- `times.csv`: os 80 clubes com divisão, prestígio, estádio, caixa, ingresso e se o jogador pode iniciar com ele.
- `jogadores-exemplo-semente-1998.csv`: os 1.920 jogadores de um jogo de exemplo (semente 1998), com todos os atributos. Os jogadores são gerados por sorteio a cada jogo novo; esta lista é um exemplo, não um cadastro fixo.
- `base-mercado-semente-1998.csv`: os 28 garotos das categorias de base que estão no mercado no início do mesmo jogo de exemplo, com o potencial escondido.

## 1. Visão geral

- Jogo de gerenciamento de futebol brasileiro em 1998, num único arquivo HTML, que roda no navegador (sem servidor), em português.
- 1 a 8 técnicos humanos no mesmo computador (hot-seat). Os demais clubes são do computador.
- 80 clubes em 4 divisões de 20 clubes: Série A, B, C e D. Temporada de 1998 em diante, sem fim.
- Os jogadores humanos só podem iniciar em 10 clubes da Série D (os "iniciáveis"): Bangu, Madureira, Marília, Olaria, Sertãozinho, Rio Branco-ES, Tuna Luso, Colatina, Ceilândia e Guarany de Bagé. A escolha é por sorteio de bolinhas.
- Todo o motor é determinístico a partir de uma semente (gerador mulberry32): a mesma semente e as mesmas decisões dão o mesmo jogo.
- Dificuldade (🔶 v25): a escolha saiu da tela inicial e o jogo fica sempre no Normal. Os multiplicadores continuam no código, todos ×1 (caixa inicial ×1, acerto do técnico do computador no intervalo +0, treino do computador ×1).
- Demissão pela diretoria (🔶 v26): a opção de desligar saiu da tela inicial; a demissão fica sempre ligada. Substituições: 3 por jogo (padrão 1998) ou 5 (moderno).

## 2. Números do jogo

| Item | Valor |
|---|---|
| Clubes | 80 (20 por divisão) |
| Elenco inicial | 24 jogadores por clube (3 goleiros, 4 zagueiros, 2 laterais direitos, 2 esquerdos, 3 volantes, 2 meias centrais, 2 meios ofensivos, 1 ponta direita, 1 esquerda, 3 centroavantes, 1 segundo atacante) |
| Limite de elenco | 30 |
| Jogadores iniciais no mundo | 1.920 (mais 40 jogadores livres gerados a cada ano, e as categorias de base: 28 garotos de 15 a 19 anos no início do jogo e, a cada fim de ano, no mínimo 24 ou 80% do número de aposentados, o que for maior) |
| Subem e descem por divisão | 4 |
| Copa do Brasil | 64 clubes, fase preliminar com 32 clubes, ida e volta, sem gol fora dobrado, pênaltis |
| Posições | GOL, ZAG, LIB, LD, LE, VOL, MC, MEI, ALA, PD, PE, CA, SA |
| Formações (🔶 v25) | 4-4-2, 4-4-2 Losango, 3-5-2, 4-3-3, 4-2-3-1, 4-1-4-1, 3-4-2-1, 4-3-2-1, 3-3-1-3, 4-2-4, 5-4-1, 5-3-2 |
| Estilos de jogo (🔶 v25) | Posição, Gegenpressing, Reativo, Jogo Direto, Relacionismo, Retranca, Linha Alta, Corredores, Vertical, Saída Curta (🔶 v27: só o estilo principal; o secundário foi retirado da escalação) |
| Atributos | Ritmo (RIT), Finalização (CHU), Passe (PAS), Drible (DRI), Defesa (DEF), Físico (FIS) e Bola parada (cobrança) |
| Nacionalidades dos jogadores | BRA (92% na média), ARG, PAR, URU, CHI, COL, PER, BOL, VEN, EQU |
| Técnicos do computador | 80 nos clubes (20 fixos na Série D, com nacionalidade) + os desempregados, com um entre 7 estilos escondidos |

Distribuição de nacionalidade na lista de exemplo: BRA 1.766, ARG 43, PAR 38, URU 31, COL 16, CHI 14, PER 4, BOL 3, EQU 3, VEN 2.

## 3. Divisões, clubes e dinheiro

Por divisão (arquivo `times.csv` tem cada clube):

| Divisão | Caixa base | Ingresso base | Fator de demanda | Cota de TV | Custo fixo anual |
|---|---|---|---|---|---|
| A | R$ 10 mi | R$ 15 | 1,00 | R$ 3,0 mi | R$ 3,5 mi |
| B | R$ 3,3 mi | R$ 9 | 0,70 | R$ 0,8 mi | R$ 0,6 mi |
| C | R$ 1,3 mi | R$ 6 | 0,75 | R$ 0,25 mi | R$ 0,15 mi |
| D | R$ 0,8 mi | R$ 4 | 1,00 | R$ 0,08 mi | R$ 0,03 mi |

- **Prestígio** (5 a 99) é a força e a torcida do clube. Move devagar a cada temporada: campanha na liga (−1,5 a +1,5), título (+2), acesso (+2), descenso (−2), título da Copa (+3), fases finais da Copa (+0,5 a +1).
- **Sorteio de força**: a cada jogo novo, os 10 clubes iniciáveis embaralham o prestígio entre si, e os outros 10 da Série D também; os iniciáveis continuam sendo os 10 mais fracos da D, mas o jogador não sabe qual é o mais forte. Caixa e demanda são recalculados.
- **Público** = demanda × forma recente × rivalidade × elasticidade do preço do ingresso, limitado pela capacidade. Rivalidade sobe 25% em clássico da mesma cidade. Receita de bilheteria = público × ingresso × 0,85 (15% de custos e impostos de jogo). O estádio pode ser ampliado a R$ 400 por lugar (nível máximo 5, +60%).
- **Salários** são pagos proporcionalmente aos dias entre jogos. Custos fixos por jogo = custo fixo anual ÷ 52. Cota de TV por rodada.
- **Prêmios de fim de temporada**: série A paga aos 5 primeiros (4,0 / 2,4 / 1,5 / 0,9 / 0,5 mi); B aos 4 primeiros (1,2 / 0,7 / 0,45 / 0,25); C (0,4 / 0,25 / 0,15 / 0,09); D (0,18 / 0,11 / 0,07 / 0,04); Copa: 3,0 / 1,5 / 0,75 mi; bônus ao clube do artilheiro (A 0,6 mi, B 0,2, C 0,08, D 0,04; 2º recebe 60% e 3º 35%) e outros prêmios (melhor goleiro, revelação, garçom, melhor técnico) que dão pontos de atributo.
- **Caixa negativo (v24, humanos e computador)**: a cada jogo (liga ou Copa) que o clube termina com o caixa abaixo de zero, conta uma "rodada no negativo". Em cada uma delas todos os jogadores do clube perdem 3 de moral e a moral do técnico perde 2. Se o caixa voltar a zero ou mais, a contagem zera.
  - **1ª rodada seguida**: o técnico humano recebe uma carta da diretoria (janela com a imagem "Diretoria") dizendo que o clube está negativo e que se espera uma solução o mais breve possível.
  - **4ª rodada seguida** (e a 9ª, 14ª…): segunda carta (imagem "Jogadores"), avisando que os jogadores estão furiosos com os salários atrasados e que um deles vai a leilão na rodada seguinte.
  - **5ª rodada seguida** (e a 10ª, 15ª…): leilão forçado, valendo para humanos e computador. São escolhidos os 5 jogadores de menor moral (desempate pelo maior salário), um deles é sorteado e vai a leilão imediato com preço inicial R$ 0, com as regras de sempre do leilão (só clubes do computador dão lance; o comprador paga também a multa). Se ninguém der lance, o jogador fica e o próximo candidato sorteado entre os 5 é tentado. Quem está no mínimo de 18 jogadores, ou é um dos 2 últimos goleiros, não pode ser leiloado. Para o humano aparece uma carta contando o resultado.
- **Computador e dinheiro**: clubes do computador investem 20% do caixa que passa de 2 folhas anuais em CT e base (melhora os juniores até +3).
- **Bicho (prêmio por vitória)**, nível 1 a 3, por relacionado (16) por vitória: A R$ 8.000, B 3.000, C 1.200, D 400 por nível; cada nível dá +2 de moral ao elenco.

## 4. Jogadores

### 4.1 Atributos e média (overall)
Todos os atributos vão de 1 a 99. A **média** de um jogador numa posição é a soma de cada atributo vezes o peso da posição (os pesos somam 1):

| Posição | RIT | CHU | PAS | DRI | DEF | FIS |
|---|---|---|---|---|---|---|
| GOL | .05 | 0 | .10 | .15 | .55 | .15 |
| ZAG | .07 | .02 | .16 | .08 | .50 | .17 |
| LIB | .06 | .02 | .24 | .10 | .40 | .18 |
| LD / LE | .20 | .04 | .19 | .12 | .31 | .14 |
| VOL | .08 | .07 | .21 | .10 | .35 | .19 |
| MC | .07 | .15 | .28 | .19 | .19 | .12 |
| MEI | .08 | .20 | .29 | .29 | .06 | .08 |
| ALA | .20 | .11 | .20 | .19 | .19 | .11 |
| PD / PE | .27 | .18 | .15 | .30 | 0 | .10 |
| CA | .12 | .45 | .07 | .14 | 0 | .22 |
| SA | .18 | .33 | .15 | .28 | 0 | .06 |

Grupos: GOL = goleiro; ZAG, LIB, LD, LE = defesa; VOL, MC, MEI, ALA = meio; PD, PE, CA, SA = ataque.

### 4.2 Geração de um jogador
- Nível-alvo do clube = 36 + 0,36 × prestígio. A: comprimido para a média 70,5 (fator 0,35); B: média 58 (fator 0,70). Titulares (14 melhores) +3 a +8; reservas −2 a −8; garotos de até 20 anos −3. Clubes iniciáveis e outros da D recebem um acaso extra.
- Cada atributo = alvo + deslocamento do perfil da posição + ruído normal de desvio 5,5; depois o conjunto é ajustado para a média cair no alvo. 16% têm uma especialidade fora do padrão (+8 a +18 em um atributo) e 6% um ponto fraco (−8 a −16).
- Idade: normal de média 26 e desvio 4,2, entre 17 e 37. Disciplina (Fair player, De boa, Equilibrado, Porradeiro, Macetador), altura, peso, pé (D/E), nacionalidade.
- Bola parada (cobrança de falta e pênalti): ≈ 0,45 finalização + 0,35 passe + 12 + ruído; 10% dos goleiros e 7% dos jogadores de linha têm um bônus grande.
- Estrelas: ganham +8 em todos os atributos, idade entre 24 e 31 e moral +6. Quantidade por clube (v22): Série A 2 a 4 (média 3,0; clubes de prestígio 90+ têm 3 a 4), B 1 a 3 (média ≈ 2,2), C 1 ou 2 (média 1,6), D 1 ou 2 (média 1,3). Todo clube tem pelo menos 1.
- Traits (características, v22): de 2 a 4 jogadores por time têm uma (no máximo uma por jogador); ver a seção 4.6.
- Posições (🔶 v26): todo jogador de linha joga de **2 a 4 posições** no total (a natural + 1 a 3 extras: 50% com 1 extra, 35% com 2, 15% com 3; na prática ≈ 49% têm 2 posições, 34% têm 3 e 16% têm 4). Goleiro só joga no gol. As extras saem das vizinhas, favorecendo onde os atributos do jogador encaixam: ZAG (LIB, VOL, LD, LE), LIB (ZAG, VOL, MC), LD (LE, ALA, ZAG, PD), LE (LD, ALA, ZAG, PE), VOL (ZAG, MC, LIB), MC (MEI, VOL, ALA), MEI (MC, SA, PD, PE), ALA (LD, LE, MC, PD, PE), PD (PE, LD, ALA, CA, SA), PE (PD, LE, ALA, CA, SA), CA (SA, PD, PE, MEI), SA (CA, MEI, PD, PE).

### 4.3 Posição e afinidade
Média no slot = média da posição do slot × afinidade. Natural: 1,00; posição extra: 0,985 (ou a afinidade da extra × 0,97). Pares próximos: ZAG-LIB 0,98; LD-LE 0,95; LD/LE-ALA 0,94; VOL-MC 0,96; MC-MEI 0,96; VOL-LIB 0,93; PD-PE 0,95; CA-SA 0,96; MEI-SA 0,94; PD/PE-ALA 0,93; MC-ALA 0,94; ZAG-VOL 0,94; LD/LE-ZAG 0,90; CA-PD/PE 0,90; SA-PD/PE 0,94; MEI-PD/PE 0,92; MC-SA 0,88; LD-PD, LE-PE 0,90; LD/LE-VOL 0,90; LIB-MC 0,90. Mesmo grupo: 0,90; grupos vizinhos: 0,80; distantes: 0,65; goleiro na linha: 0,35; jogador de linha no gol: 0,25 (e rende só 20% no gol).

### 4.4 Estados do jogador
- **Stamina** (0–100): cai no jogo (≈ 33 − 0,22 × FIS por 90 min), recupera com o descanso (taxa 0,085 + 0,001 × FIS ao dia, menor para veteranos). O efeito na força do jogador é 0,55 + 0,45 × (stamina/100)^1,25 (na v22 o expoente era 2): quem está com 80 de stamina rende ≈ 89% da força, com 70 ≈ 84%.
- **Moral** (0–100): nota boa sobe, nota ruim desce (±5 por ponto de nota diferente de 6,3). Reserva que entra ganha confiança; moral de quem não joga tende a 50. Moral do computador se recupera 12% da distância até 55 por jogo, com piso de 30.
- **Lesão**: risco por minuto 0,000062 × fator (1,85 − FIS/65, entre 0,5 e 1,6).
- **Cartões**: 3 amarelos = suspensão; vermelho = 1 jogo.
- **Evolução**: pelo desempenho em campo (nota), idade e moral; retorno decrescente em atributos altos. Treinos e prêmios de fim de ano somam pontos (nada acima de 87 nos prêmios).
- **Contrato**: salário = valor de mercado × 0,0117 (mínimo R$ 500/mês); renovação nos últimos 3 meses. Garotos das categorias de base ganham R$ 400/mês.

### 4.5 Valor de mercado
**Valor base**: 17.000 × e^((média − 40) × 0,14) × fator de idade × fator da posição, arredondado a R$ 1.000. Exemplo para o mesmo jogador: média 60 ≈ R$ 294 mil; 70 ≈ R$ 1,2 mi; 80 ≈ R$ 4,8 mi. O salário (0,0117 do valor) continua saindo deste valor base.

**Preço de mercado (v24)**: é o que o jogo usa para o preço pedido, a multa, o leilão e as propostas. Preço = valor base ÷ fator de idade em degraus × **curva de idade suave** × **fator de desempenho**.

- **Curva de idade suave** (interpolação linear entre os pontos): 15 → 1,45; 18 → 1,40; 20 → 1,35; 22 → 1,25; 24 → 1,12; 26 → 1,00; 28 → 0,88; 30 → 0,72; 32 → 0,52; 34 → 0,38; 36 → 0,28; 38 → 0,20; 40 → 0,14. (Antes eram degraus: até 20 anos 1,35; 21–23: 1,2; 24–27: 1,0; 28–30: 0,8; 31–33: 0,5; 34+: 0,3.)
- **Desempenho na temporada passada**: no fim da temporada o jogo guarda, para quem jogou 8 jogos ou mais, uma nota de desempenho comparada com os jogadores **da mesma posição e da mesma série**. Métrica por posição (por jogo): goleiro = 0,5 × defesas − gols sofridos; zagueiro e líbero = desarmes + 1,5 × gols; lateral = 0,8 × desarmes + 1,2 × assistências + 1,2 × gols; volante = desarmes + 0,8 × assistências + gols; meia central = 1,2 × assistências + 1,2 × gols + 0,4 × desarmes; MEI, ALA, PD e PE = assistências + gols; CA e SA = gols + 0,5 × assistências. O índice é z = 0,65 × (métrica − média do grupo) ÷ desvio + 0,35 × (nota média − média do grupo) ÷ desvio. **Fator de desempenho = 1 + 0,12 × z** (z limitado a −2 … +2,5), entre 0,80 e 1,40. Quem não jogou o mínimo de jogos, ou chegou depois, tem fator 1,0. O retrato aparece na ficha ("Temporada passada").
- Exemplos reais de um jogo de teste (preço antes → agora): goleiro com 158 defesas e nota 7,61 (média 69): R$ 703 mil → R$ 965 mil; zagueiro com 137 desarmes (média 75, série B): R$ 2,78 mi → R$ 3,54 mi; volante com 17 gols e 139 desarmes (média 67, série C): R$ 774 mil → R$ 1,13 mi; centroavante com 19 gols e 9 assistências (média 72, série A): R$ 1,25 mi → R$ 1,63 mi; zagueiro de média 76 com 9 jogos e nota 5,81: R$ 2,77 mi → R$ 2,44 mi; meia de média 68 com 0 gols e 0 assistências em 12 jogos: R$ 724 mil → R$ 637 mil. Para o mesmo meia central de média 66, o preço por idade passa de R$ 963 mil aos 17 anos para R$ 639 mil aos 27, R$ 306 mil aos 33 e R$ 116 mil aos 39.

### 4.6 Traits (características, v22)
De 2 a 4 jogadores por time têm uma característica (uma por jogador; aparece como etiqueta de 3 letras ao lado do nome). A trait Promessa (jogadores de base) não conta nesse limite. Sorteio por elegibilidade e peso; jogadores gerados depois (mercado, base) têm 4% de chance e, na virada do ano, cada time é completado a 2 e limitado a 4.

| Trait | Abrev. | Quem pode | Efeito (valores no motor) |
|---|---|---|---|
| Matador | MAT | CA, SA, PD, PE, MEI | Em cara a cara, a chance de errar cai 30%; aparece 20% mais vezes em cara a cara. |
| Salvador da pátria | SAL | atacantes e MEI | Se entra depois dos 30' do 2º tempo com o time perdendo ou empatando: chance de gol ×1,3 e é escolhido 2× mais para finalizar. A IA o prefere no banco. |
| Líder nato | LID | 25+ anos | Se é capitão e o time perde no intervalo: +5 de moral a todos em campo no 2º tempo; +6 na nota de capitão. |
| Batedor de faltas | FAL | linha, bola parada ≥ 60 | +5 na finalização das faltas e +4 na nota de cobrador (vira o cobrador natural). |
| Desarmador | DES | defensores, VOL, MC com disciplina Fair player ou De boa | Chance de falta ao marcar ×0,6; escolhido 1,25× como marcador e 1,5× como desarmador; +3 na marcação. |
| Catimbeiro | CAT | PD, PE, MEI, SA, MC, laterais, ALA | Quando dribla: falta sofrida ×1,4 e o cartão do infrator ×1,5; é escolhido 1,25× como driblador. |
| Coringa | COR | linha | Afinidade 1,0 em qualquer posição de linha e média no slot nunca menor que a natural. |
| Driblador | DRI | PD, PE, MEI, SA, MC, ALA, laterais com DRI ≥ 55 | +6 no duelo do drible, falta ×1,3, pênalti ×1,3 depois da falta, passes ×0,7. |
| Cabeção | CAB | CA, SA, ZAG, LIB, VOL | +12 no cabeceio (mais chance de ser o cabeceador e de converter). |
| Popstar | POP | linha | Patrocínio aceita +4 pontos percentuais por popstar (máx. +12); público em casa +4% por popstar (máx. +8%). |
| Maestro | MAE | só MC ou MEI | Peso de passe ×1,4 e cara a cara ×1,9 quando dá o passe final. |
| Menino prodígio | PRO | até 21 anos | Ganho de atributos nos jogos ×1,5 (×1,3 se venceu, ×1,1 se o time está entre os 10 primeiros da tabela) e ganho de treino ×1,5. Perde ao completar 22 anos. |
| Cabeça de gelo | GEL | linha | Amarelo ×0,55, vermelho direto ×0,5. |
| Highlander | HIG | só 30+ anos | Lesão ×0,45 (era ×0,6), perda de stamina ×0,85. Quem faz **exatamente 30 anos** sem nenhuma lesão no ano (e com pelo menos 15 jogos), sem trait e em time com menos de 4 traits tem 12% de chance de ganhar (medido: ≈ 7 a 8 ganhos por ano no mundo todo, em 80 clubes). Nunca se perde. |
| Promessa | PRM | só jogadores da base (não sorteada) | Ver 4.7. |

Efeitos medidos em 1.500 jogos pareados (ver o relatório de medições da v22).

### 4.7 Categorias de base e Promessa (v24)
- **Quem são**: garotos de 15 a 19 anos com média de 20 a 30 (parecida com a dos piores jogadores da Série D), nomes, posições e atributos sorteados, salário de R$ 400/mês, contrato de 24 meses, moral e stamina 100 ao serem contratados. Aparecem com a etiqueta **BASE** no plantel e no mercado.
- **Chegada**: no início do jogo (28) e a cada fim de ano entram no mercado como livres: no mínimo 24 ou 80% do número de aposentados do ano, o que for maior. Quem não foi contratado volta para casa no fim do ano seguinte. O mercado tem o filtro **Categorias de base**; a contratação é como a de um livre (luvas de 2 salários = R$ 800).
- **Potencial escondido**: cada garoto tem um potencial (média 59 no mercado; os garotos que um clube do computador revela têm potencial ligado ao prestígio do clube). Ele cresce, só por estar no elenco (jogando ou não), um número de pontos por jogo do clube tal que chega perto do potencial aos 22 anos (6 × (potencial − média) ÷ (anos até os 22 × 38 jogos) pontos de atributo por jogo). Medido: média 33 aos 15 anos, 42 aos 18, 53 aos 20, 58 aos 22.
- **Bônus de base** (enquanto tem menos de 20 anos): ganho de atributos nos jogos ×1,6 e +3 de moral por jogo no primeiro ano; ganho de treino ×1,5 e perde metade da moral dos treinos.
- **Promessa**: cada garoto tem 30% de chance de nascer com a trait Promessa; outras traits aparecem em 10% dos demais. A Promessa dá +20% de ganho nos 3 primeiros treinos. Ao **concluir o 3º treino**: abre uma janela para o técnico humano escolher **3 posições** da área do jogador (defesa: ZAG, LIB, LD, LE; meio: VOL, MC, MEI, ALA; ataque: PD, PE, CA, SA; no computador as 3 de maior média), e o jogador passa a atuar nelas (a de maior média vira a principal). **Goleiro** não escolhe posições: ganha +5 de defesa. Em todos os casos a trait Promessa some e há 40% de chance de ganhar uma nova trait que combine com o perfil do jogador, se o time tiver menos de 4 traits.
- **Computador**: o técnico escolhe sozinho. Os clubes do computador completam o elenco até 24 jogadores com garotos da base criados no clube (contrato de 24 meses).

### 4.8 Aposentadoria (v24)
- **Aos 40 anos o jogador se aposenta automaticamente**, na virada do ano. Antes disso, a chance de aposentar na virada é de 20% × (idade − 35) para o computador e 20% × (idade − 36) para o humano, a partir dos 36 anos.
- Com **39 anos** o jogador ganha a etiqueta **APOS** no plantel e uma linha "Aposentadoria" na ficha: ele se aposenta no fim do ano.
- Aposentados saem do clube; clubes do computador repõem com garotos da base. Medido numa simulação de 12 anos: 18 aposentados no 1º ano e cerca de 175 por ano no ritmo estável; idade média do mundo 27 a 29 anos.

## 5. O jogo (motor de partida)

Cada partida tem 90 minutos simulados minuto a minuto, mais acréscimos (ver 5.4).

1. **Forças de cada time**: ataque = 0,60 × média do ataque + 0,30 × meio + 0,10 × defesa; defesa = 0,76 × defesa + 0,08 × meio + 0,16 × goleiro; controle = 0,60 × meio + 0,20 × ataque + 0,20 × defesa. Cada jogador entra com média no slot × stamina × moral × sinergia. Tudo multiplicado pelos modificadores da formação e do estilo (ver 5.1 a 5.3), por um fator de forma do dia (±3%) e pelo capitão.
2. **Stamina e moral**: força × (0,55 + 0,45 × (stamina/100)^1,25) e × (0,95 + 0,10 × moral/100). Quem entra do banco tem pernas frescas: +15% decaindo em 40 minutos.
3. **Posse**: (controle A)^2,2 ÷ soma, mais uma "maré" (v22): onda que se arrasta de um minuto para o outro (m = 0,88 × m + ruído de 0,04) e um empurrão de 1,5 ponto percentual por gol de desvantagem (até 4). A posse mostrada na tela é a dos últimos minutos (média móvel de 15%), então varia ao vivo; o resumo mostra o total do jogo. Mandante tem controle ×1,07.
4. **Ataque**: a cada minuto há 0,575 × ritmo médio dos estilos de chance de um ataque; a posse e o ritmo (tempo) do estilo decidem quem ataca. Time com folga de 2+ gols poupa o time.
5. **Drible × marcação**: o driblador enfrenta o marcador; quem perde o duelo faz falta (pênalti se foi na área: atacante 24%, meia 11%, zagueiro 2%; senão falta direta 50%).
6. **Chute**: probabilidade = 0,378 + diferença de ataque×defesa × 0,0065 + diferença de passe × 0,0038 + diferença de ritmo × 0,0022 + bônus de duelo ganho (0,16) + bônus de nível baixo (até +0,04). Passe final vem de quem tem mais passe (meias com peso 1,6; atacantes 4,6; defensores 0,22; goleiro 0,03; laterais ×1,5).
7. **Finalização**: chance de ir no gol = base (0,41 bola, 0,385 cabeça, 0,42 falta) + (finalização − 50) × 0,004 − (marcador − 50) × 0,0042. Chance de gol = base 0,31 + (finalização − goleiro) × 0,0032. A finalização efetiva pesa ×1,6 (Copa: individual comprimido). Goleiro de linha: ×0,2.
7b. **Impedimento (🔶 v26)**: gol de bola rolando (jogada ou cruzamento; não vale para pênalti, falta direta nem escanteio) pode ser anulado por impedimento. Chance = (6,5% + 0,8 × impedimento provocado pelo estilo do rival) × peso da posição de quem finaliza (CA 1,4; SA 1,2; pontas 1,1; MEI 0,7; ALA 0,5; MC 0,4; VOL 0,3; demais 0,15) × velocidade relativa (ritmo do atacante contra o da defesa, de 0,6 a 1,4) × 0,85 se for Matador. A conversão dos chutes sobe na mesma medida, então a média de gols não muda (≈ 3% a 4% dos gols marcados são anulados). O lance aparece no feed como "Gol anulado! fulano estava impedido" e entra na estatística Impedimentos. A Linha Alta continua provocando impedimentos antes do chute (item 5.2).
8. **Escanteios e cabeceios**: o melhor passador bate; quanto melhor o passe, mais cabeçadas; o melhor de cabeça finaliza.
9. **Faltas e cartões**: 0,125 × 1,7 de chance de falta por minuto; falta direta perto da área em 7,5% delas; amarelo em 10,5% por falta × disciplina.
10. **Pênaltis**: ver seção 6. Gol de pênalti ≈ 76% na média.
11. **Intervalo**: o time do computador responde ao estilo que o adversário usou no 1º tempo com probabilidade = acerto do técnico (0,50 a 0,80), trocando para a melhor resposta da tabela 5.4 que combina melhor com a formação.
12. **Cara a cara (v22)**: 11% dos chutes de jogada são cara a cara com o goleiro (×1,9 se quem deu o passe é Maestro, ×1,2 se o finalizador é Matador); nesses, a chance de gol sobe ×1,5, compensada em todos os chutes de jogada (×0,948) para a média de gols não mudar. Chance de gol geral ×1,065 (calibração depois das estrelas extras).
12b. **Expulsão (🔶 v26)**: o jogador expulso sai e o time **segue com um a menos**; a vaga dele não é preenchida. O técnico humano é avisado e pode trocar um dos jogadores que ficaram em campo por alguém do banco (conta como uma das substituições do jogo); a tela mostra a lista dos que estão em campo (sem o expulso) e a do banco. Se o expulso for o goleiro, dá para tirar qualquer jogador de linha e pôr o goleiro reserva no gol (a vaga do jogador que sai deixa de existir). Pode também "seguir com um a menos". O computador só reage à expulsão do goleiro: tira o jogador de linha de menor valor (atacantes primeiro) e põe o goleiro reserva, se houver substituição disponível.
13. **Substituições do computador**: em 60', 70' e 80' troca o mais cansado (stamina < 75) pelo melhor reserva do slot.

Valores típicos por jogo (jogos entre times de prestígio 40 a 90): ≈ 2,8 gols, 24 chutes, 10 no gol, 6,4 escanteios, 21 faltas, 0,12 lesões; mandante vence 44%, empata 23%, perde 33%. Por divisão (liga completa): A ≈ 2,6 gols, B 2,6, C 2,6, D 2,5.

### 5.1 Formações (🔶 v25: 12, da planilha "Guia tático")
Modificadores da estrutura (multiplicam ataque, defesa e controle). Foram ajustados por simulação (5 rodadas) para que nenhuma formação domine: a média de cada uma, medida contra combinações sorteadas, fica entre 1,32 e 1,37 ponto por jogo (ver relatório 12).

| Formação | Ataque | Defesa | Controle |
|---|---|---|---|
| 4-4-2 | 0,979 | 0,979 | 0,994 |
| 4-4-2L | 1,017 | 1,002 | 1,020 |
| 3-5-2 | 0,994 | 1,005 | 0,996 |
| 4-3-3 | 0,991 | 0,907 | 1,016 |
| 4-2-3-1 | 0,947 | 0,977 | 0,986 |
| 4-1-4-1 | 0,959 | 1,014 | 1,005 |
| 3-4-2-1 | 1,008 | 0,994 | 1,010 |
| 4-3-2-1 | 1,049 | 1,059 | 1,020 |
| 3-3-1-3 | 0,998 | 0,876 | 1,020 |
| 4-2-4 | 1,060 | 0,888 | 0,970 |
| 5-4-1 | 0,978 | 1,130 | 0,985 |
| 5-3-2 | 0,981 | 1,067 | 0,990 |

Posições de cada formação (11 slots): 4-4-2 GOL LD ZAG ZAG LE VOL MC ALA ALA CA SA; 4-4-2 Losango GOL LD ZAG ZAG LE VOL MC MC MEI CA SA; 3-5-2 GOL ZAG ZAG LIB ALA VOL VOL MEI ALA CA SA; 4-3-3 GOL LD ZAG ZAG LE VOL MC MEI PD CA PE; 4-2-3-1 GOL LD ZAG ZAG LE VOL VOL MEI PD PE CA; 4-1-4-1 GOL LD ZAG ZAG LE VOL ALA MC MC ALA CA; 3-4-2-1 GOL ZAG LIB ZAG ALA MC MC ALA MEI MEI CA; 4-3-2-1 GOL LD ZAG ZAG LE VOL MC MC MEI MEI CA; 3-3-1-3 GOL ZAG LIB ZAG VOL ALA ALA MEI PD CA PE; 4-2-4 GOL LD ZAG ZAG LE VOL MC PD CA SA PE; 5-4-1 GOL LD ZAG LIB ZAG LE VOL VOL MC MEI CA; 5-3-2 GOL LD ZAG LIB ZAG LE VOL MC MC CA SA. Descrição, pontos fortes e fracos e "elenco ideal" de cada uma (texto da planilha) aparecem na tela. Jogos salvos com 4-5-1 ou 3-4-3 viram 4-1-4-1 e 3-3-1-3.

### 5.2 Estilos de jogo (🔶 v25: 10, no lugar das 4 táticas)
Cada estilo tem um **bônus** (o que ele dá), um **custo** (o que ele pede em troca) e um efeito **fixo** de calibração (soma ou subtrai ataque e defesa para equilibrar). Valores nominais, antes de aplicar a compatibilidade e o encaixe do elenco (fração = ×(1 + valor); "pts" = pontos de probabilidade ou de nota de finalização):

| Estilo | Bônus nominal | Custo nominal | Fixo (calibração) |
|---|---|---|---|
| Posição | ctl +0,05, chute +0,01, qual +1 | tempo -0,07, atk -0,015 | abertura +0,1, atk -0,024, def -0,024 |
| Gegenpressing | ctl +0,025, fecha +0,025, atk +0,015 | fad +0,5, def -0,03, costas +0,7, faltas +0,18 | abertura +0,5, atk +0,059, def +0,059 |
| Reativo | contraK +0,18, def +0,02, fecha +0,01 | ctl -0,05, tempo -0,1, atk -0,02 | abertura -0,5, atk -0,039, def -0,039 |
| Jogo Direto | aereo +3, tempo +0,04, chute +0,012, atk +0,01 | ctl -0,05, qual -1 | abertura +0,2, atk -0,019, def -0,019 |
| Relacionismo | ctl +0,03, qual +1,5, atk +0,01 | def -0,03, costas +0,3 | abertura +0,2, atk -0,012, def -0,012 |
| Retranca | def +0,05, fecha +0,04, comp -0,18 | atk -0,1, tempo -0,1, ctl -0,04 | abertura -1, atk +0,026, def +0,026 |
| Linha Alta | ctl +0,02, fecha +0,015, offs +0,06, def +0,01 | costas +1, fad +0,15 | abertura +0,4, atk +0,011, def +0,011 |
| Corredores | cruz +0,8, aereo +1,5, atk +0,012 | ctl -0,02, qual -0,8 | abertura +0,3, atk +0,019, def +0,019 |
| Vertical | tempo +0,06, atk +0,025, chute +0,012 | ctl -0,035, qual -0,8 | abertura +0,5, atk -0,034, def -0,034 |
| Saída Curta | ctl +0,025, def +0,01 | tempo -0,03, perda +0,8 | abertura 0, atk +0,032, def +0,032 |

Significado: ctl = controle do meio; atk/def = ataque e defesa; tempo = ritmo (quantos lances saem); chute = chance de um ataque virar finalização (pontos de probabilidade); qual = qualidade da finalização (pontos na nota do finalizador); fecha = reduz as finalizações do adversário (pontos de probabilidade); contraK = bônus de contra-ataque, proporcional à abertura do adversário; comp = compactação (a vantagem de qualidade do adversário rende menos); aereo = pontos na nota de cabeceio; cruz = probabilidade de cruzar; offs = impedimentos provocados (fração dos ataques rivais, ajustada pela velocidade dos atacantes); fad = gasto extra de stamina; costas = risco de bola nas costas (só pesa contra atacante veloz); faltas = faltas e cartões; perda = risco de perda perigosa na saída de bola; abertura = o quanto o time se expõe.

**Compatibilidade formação × estilo** (nota 1 a 5 da aba Matriz da planilha; 120 combinações com bônus e penalidade em % em cada uma):

| Formação | Posição | Gegen | Reativo | Direto | Relac. | Retranca | L. Alta | Corredores | Vertical | Saída |
|---|---|---|---|---|---|---|---|---|---|---|
| 4-4-2 | 4 | 4 | 5 | 5 | 4 | 3 | 4 | 4 | 4 | 3 |
| 4-4-2 Losango | 5 | 4 | 4 | 3 | 5 | 2 | 2 | 2 | 4 | 4 |
| 3-5-2 | 4 | 4 | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 4 |
| 4-3-3 | 5 | 5 | 4 | 4 | 4 | 2 | 5 | 5 | 5 | 5 |
| 4-2-3-1 | 5 | 5 | 5 | 4 | 4 | 4 | 4 | 4 | 5 | 5 |
| 4-1-4-1 | 5 | 5 | 4 | 3 | 4 | 4 | 5 | 3 | 4 | 5 |
| 3-4-2-1 | 5 | 5 | 5 | 4 | 5 | 4 | 4 | 4 | 5 | 5 |
| 4-3-2-1 | 5 | 4 | 4 | 3 | 5 | 4 | 4 | 2 | 4 | 4 |
| 3-3-1-3 | 4 | 5 | 2 | 4 | 5 | 1 | 5 | 4 | 5 | 3 |
| 4-2-4 | 2 | 4 | 4 | 5 | 3 | 1 | 2 | 5 | 5 | 2 |
| 5-4-1 | 2 | 2 | 5 | 4 | 2 | 5 | 2 | 3 | 3 | 2 |
| 5-3-2 | 3 | 4 | 5 | 5 | 3 | 5 | 3 | 4 | 4 | 3 |

Como a combinação vira número: o bônus do estilo é multiplicado por (meio da faixa de bônus da planilha ÷ 7,5) × k_bônus da nota (1: 0,4; 2: 0,7; 3: 0,9; 4: 1,0; 5: 1,12). Quando a planilha diz "sem bônus automático", usa 0,35. O custo é multiplicado por (meio da faixa de penalidade ÷ 8) × k_custo da nota (1: 1,35; 2: 1,15; 3: 1,0; 4: 0,9; 5: 0,8). Resultado medido: nota 5 rende 1,38 ponto por jogo, nota 4 1,36, nota 3 1,30, nota 2 1,29 e nota 1 1,12.

**Teto**: ataque, defesa e controle ficam entre ×0,82 e ×1,15 (teto de +15% da planilha), ritmo entre ×0,80 e ×1,15.

**Fôlego**: estilos com dependência de energia (Gegenpressing 1,0; Linha Alta 0,7; Vertical 0,5; Corredores 0,3) perdem até 40% do bônus com a stamina média do XI abaixo de 70 (bônus × stamina/70, mínimo 0,6) e o custo cresce (1 + dependência × (70 − stamina)/100). O gasto de energia por minuto é multiplicado por 1 + fad (Gegenpressing ≈ ×1,45; Linha Alta ≈ ×1,14; ver 2).

**Estilo secundário (🔶 v27: retirado da tela de escalação e do computador; a regra fica no motor, sem uso, e a descrição abaixo vale só como histórico da v25)**: entra com peso conforme a relação da aba "Estilos x Estilos": Sinergia forte 0,70; Boa sinergia 0,60; Boa sinergia com risco 0,55; Compatível com tensão 0,45; Situacional 0,35; Conflito de progressão 0,30; Conflito frequente 0,25. Os conflitos tiram ainda ataque e controle (Conflito frequente −2%; Conflito de progressão −1,5%; tensão e risco −0,6%). O comportamento (propriedades usadas no duelo) é uma média ponderada dos dois estilos.

### 5.3 Sinergia e encaixe do elenco
Mede o quanto os jogadores certos estão nos lugares que o estilo e a formação pedem, comparado a um time comum (elencos reais gerados, escalados automaticamente). Teto ±8% em ataque, defesa e controle. 🔶 v25: cada estilo tem uma lista "grupo, atributos, o que melhora, peso" (por exemplo, Posição: meias com PAS e DRI → controle, defensores com PAS → controle; Gegenpressing: meias com FIS e DEF → defesa, atacantes com FIS e RIT → ataque; Linha Alta: zagueiros com RIT e DEF → defesa; Corredores: jogadores de lado com DRI e RIT → ataque, atacantes com CHU e FIS → ataque). A média do encaixe, normalizada por elencos comuns, vira o **encaixe** (−100% a +100%) que escala o bônus do estilo em até ±60% (bônus ×(1 + 0,6 × encaixe); custo ×(1 − 0,6 × encaixe)). Cada formação também tem seus papéis (ex.: 4-3-3: pontas com RIT e DRI; 4-2-4: pontas e centroavantes com CHU e RIT; 5-4-1: zagueiros com DEF e FIS; losango: armador com PAS e DRI).

### 5.4 Duelo de estilos (🔶 v25)
O estilo de cada time rende mais ou menos conforme o estilo e a estrutura do adversário. Só conta quando a condição acontece. O desconto vale para a chance do ataque virar finalização (pontos de probabilidade; teto ±9) e para a nota de finalização (±2,5):
- Pressão do adversário × saída de bola do atacante (posse, saída curta, relacionismo): −0,110 × pressão × construção × (1 + perda).
- Bola longa e vertical passam por cima da pressão: +0,055 × pressão × verticalidade.
- Bola nas costas: +0,085 × risco de costas do adversário × verticalidade × (0,7 + 0,02 × diferença de RIT).
- Bloco baixo do adversário: −0,075 × bloco × construção (circular sem criar), −0,055 × bloco × contra-ataque, −0,028 × bloco × verticalidade e −2 pts de qualidade × bloco × uso das laterais (cruzamento contra defesa fechada). O bloco também depende da formação (+0,07 por defensor acima de 4, −0,04 por atacante acima de 2).
- Impedimento da Linha Alta: 6% dos ataques rivais, × (0,6 + 0,8 × verticalidade do atacante) × velocidade relativa; conta na estatística "Impedimentos".

Melhores respostas medidas (relatório 12). Pontos por jogo do estilo da linha contra o da coluna (elencos iguais):

| Estilo (linha) contra → | Posição | Gegenpressing | Reativo | Jogo Direto | Relacionismo | Retranca | Linha Alta | Corredores | Vertical | Saída Curta |
|---|---|---|---|---|---|---|---|---|---|---|
| Posição | — | 1,26 | 1,39 | 1,34 | 1,33 | 1,34 | 1,35 | 1,44 | 1,36 | 1,38 |
| Gegenpressing | 1,47 | — | 1,18 | 1,29 | 1,37 | 1,40 | 1,39 | 1,29 | 1,22 | 1,45 |
| Reativo | 1,32 | 1,56 | — | 1,39 | 1,39 | 1,22 | 1,47 | 1,33 | 1,49 | 1,19 |
| Jogo Direto | 1,38 | 1,46 | 1,35 | — | 1,41 | 1,32 | 1,45 | 1,38 | 1,39 | 1,30 |
| Relacionismo | 1,39 | 1,34 | 1,35 | 1,34 | — | 1,40 | 1,38 | 1,34 | 1,36 | 1,40 |
| Retranca | 1,35 | 1,28 | 1,46 | 1,36 | 1,28 | — | 1,29 | 1,39 | 1,34 | 1,33 |
| Linha Alta | 1,39 | 1,34 | 1,26 | 1,30 | 1,34 | 1,41 | — | 1,43 | 1,31 | 1,49 |
| Corredores | 1,27 | 1,45 | 1,38 | 1,38 | 1,41 | 1,31 | 1,29 | — | 1,39 | 1,27 |
| Vertical | 1,37 | 1,52 | 1,25 | 1,34 | 1,39 | 1,36 | 1,43 | 1,37 | — | 1,41 |
| Saída Curta | 1,32 | 1,25 | 1,52 | 1,42 | 1,30 | 1,34 | 1,22 | 1,47 | 1,32 | — |

Tabela de respostas (usada no intervalo pelo humano e pelo computador): Posição → Gegenpressing, Linha Alta; Gegenpressing → Reativo, Vertical, Jogo Direto; Reativo → Saída Curta, Retranca; Jogo Direto → Saída Curta, Reativo; Relacionismo → Jogo Direto, Corredores; Retranca → Linha Alta, Relacionismo; Linha Alta → Reativo, Jogo Direto, Vertical; Corredores → Saída Curta, Posição, Linha Alta; Vertical → Reativo, Jogo Direto; Saída Curta → Linha Alta, Gegenpressing. Intervalo: trocar o estilo principal para uma boa resposta +3%, para algo que o adversário anula −2%, trocar só o secundário para uma boa resposta +1,5%; mudança de formação como antes (+2% / −1,5%); total entre −3% e +5%.

### 5.5 Acréscimos e prorrogação (v22)
- O relógio corre sem parar; a tela mostra 45+2', 90+4'. Acréscimo do 1º tempo = 0,6 + 0,55 por gol + 1 por lesão + 0,35 por cartão + 0,4 por pênalti perdido + 0,2 por substituição + ruído normal (0,6), arredondado, de 1 a 8; no 2º tempo a base é 1,4. Médias medidas: 1,8' e 3,6'.
- Como o jogo dura ≈ 5,4 minutos a mais, todo o que é por minuto (ataques, faltas, pênaltis sem drible, lesões, cansaço) é multiplicado por 0,94: gols, faltas e lesões por jogo ficam iguais.
- **Copa do Brasil**: se a volta termina empatada no agregado, há prorrogação de 2 tempos de 15 minutos, cada um com acréscimos (base 0,3 no 1º e 0,4 no 2º), com pausas para o técnico humano. Pênaltis só se continuar empatado depois da prorrogação. ≈ 15% das voltas vão à prorrogação e ≈ 8% aos pênaltis.
- Sem técnico humano na rodada da Copa: o jogo passa ao vivo com o botão "Pular para os resultados" e termina numa tela de resultados (placares, agregado, classificados); clicar num jogo abre o resumo dele.

## 6. Pênaltis (jogo e Copa)
- Chance de errar o chute = 0,125 − (finalização do batedor − 55) × 0,0018 − (moral − 60) × 0,0008 + (100 − stamina) × 0,0004 − ajuste de mando, limitada a 3%–26%. Finalização do batedor = 65% finalização + 35% bola parada.
- Se chuta no gol, escolhe o canto (cantos 20%, ângulos 12%, meio 10%, em cima 7%), e a chance de defesa depende do canto, da defesa do goleiro, da stamina e da moral dele e do mando.
- **Mando**: ajuste = em casa +0,012 × (0,5 + m); fora −0,02 × (1 − 0,8 × m), com m = (moral individual + moral do time) ÷ 200. Para o goleiro vale o mesmo, aplicado ao time dele.
- **Disputa da Copa**: 5 cobranças por time e depois morte súbita; os batedores são os 10 melhores de linha disponíveis (o batedor escolhido pelo humano vai primeiro) e o melhor goleiro; o time da volta joga em casa.

## 7. Técnicos

- **Escalação automática (🔶 v26)**: ao escolher uma formação (ou clicar em Escalação automática), o jogo monta o time pela **média na posição**: ordena todos os pares jogador × vaga pela média do jogador naquele slot (já com a afinidade das posições extras) e vai preenchendo do maior para o menor, de modo que os de maior média na posição jogam. O cansaço só desempata (no máximo −2 pontos, para quem está com stamina baixa). Vale também para o computador.
- **Humano**: escolhe formação e estilo de jogo (🔶 v27: o estilo secundário saiu da escalação), titulares, capitão, batedores (falta e pênalti; escanteios), treinos, conversa com o elenco e bicho. **Conversa (v22)**: escolhe o tom (Elogiar: +3, sem risco; Motivar: (3+3k) × 1,3 para moral < 50 ou × 0,8, 20% − (moral do técnico − 50)/500 de cair mal (−2); Cobrar: +6 para moral < 60, −2 para moral > 75, risco 55% − moral do técnico/160 (entre 10% e 50%) de cair mal (−4)) e com quem falar (grupo, só os desanimados com moral < 50, ou um jogador, com efeito ×1,5 nos tons Elogiar e Motivar). Espera: 4 jogos para conversa com grupo, 3 jogos por jogador. A moral do técnico sobe com vitórias (principalmente contra times maiores) e desce com derrotas; abaixo de 20 gera aviso e, por 12 jogos seguidos abaixo de 20 com o clube na zona de rebaixamento, a diretoria o demite (desligável) e ele assume um clube pior.
- **Técnicos do computador (🔶 v26)**: todo clube, da Série A à D, tem um técnico. **Séries A, B e C** começam sempre com o mesmo técnico (nome e estilo fixos por clube, os mesmos em todo jogo novo). **Série D (🔶 v28)**: existe um grupo fixo de **20 técnicos**, sempre os mesmos em todo jogo novo, cada um com nome, **nacionalidade** e estilo que nunca mudam: 17 brasileiros, 1 português, 1 argentino e 1 uruguaio, com 7 estilos distribuídos de modo que cada estilo tem pelo menos 2 técnicos (3 de cada, exceto Ofensivista com 2). Depois que os humanos escolhem os clubes, os técnicos são sorteados entre **todos os clubes da Série D que sobraram** (os 10 não iniciáveis mais os iniciáveis que ninguém escolheu); o clube de cada técnico muda a cada jogo novo. Os técnicos que não recebem clube (1 com um jogador humano) ficam **desempregados**, guardados para as futuras demissões. O jogo mostra a bandeira ao lado do nome do técnico. A opção de demissão pela diretoria saiu da tela inicial (a demissão continua ligada, como antes).
- **Computador (🔶 v27: 7 estilos de técnico, no lugar dos 6 antigos)**: cada clube tem um técnico com nome e um estilo escondido. Sorteio por peso: Equilibrado 20, Ofensivista 16, Retranqueiro 16, Domínio de bola 14, Futebol arte 12, Camaleão 12, Imprevisível 10 (as Séries A, B e C já saem com o estilo fixo de cada técnico). O estilo decide (1) a formação e o estilo de jogo do dia, (2) quem e o que treina, (3) quem prefere comprar e (4) o que faz no intervalo.

| Estilo | Como pensa | Intervalo | Acerto na leitura |
|---|---|---|---|
| Equilibrado | Evita os extremos (ataque total, retranca, estilos radicais). Treina todos os atributos, atrás dos mais fracos e importantes de cada posição | só lê o adversário | 60% |
| Futebol arte | Ataque e criação de chances; drible, passe e finalização. Treina menos físico e ritmo. Escala o Maestro de preferência (+4 na nota) e compra Maestro (+8 pontos de média) quando vê à venda ou em leilão | só lê o adversário | 50% |
| Domínio de bola | Posse: não gosta de perder a bola e cria chances. Treina passe, ritmo e finalização; não valoriza drible em excesso | só lê o adversário | 60% |
| Ofensivista | Formações e estilos agressivos; treina finalização, passe e drible, principalmente de atacantes e meias; prioriza comprar atacantes (+3) e meias (+2) fortes | só lê o adversário | 45% |
| Retranqueiro | Formações e estilos defensivos e de contra-ataque; treina defesa, físico e ritmo (27% cada contra 6% a 7% dos outros); ganhando no 1º tempo (35%), fecha o time no 2º com Retranca/Reativo e formação de 5 zagueiros ou 4-1-4-1; na Copa, se ganhou o jogo de ida em casa, joga a volta ainda mais fechado (peso ×3 para estilos e formações defensivos desde o início, e fecha também no 2º tempo se não estiver perdendo) | fecha o jogo | 55% |
| Camaleão | Monta o time pelos pontos fortes do elenco do momento (testa 4 formações × 3 estilos, com bastante sorteio no resultado, e escolhe a de melhor encaixe e sinergia) e reage ao último estilo do adversário; treina os atributos que o estilo que usa pede (peso-base 0,7 em todos, para não ficar tão focado) | **sempre faz pelo menos 1 substituição** (a que mais melhora o time contra o estilo do rival) | 50% |
| Imprevisível | Sorteia pesos novos para todos os estilos e formações a cada jogo, sem olhar a força do rival; treina atributos e posições sorteados (1 a 3 jogadores, 1 a 3 jogos) | 55% de chance de trocar o estilo, 40% de mudar a formação, 50% de 1 a 2 substituições ousadas (nunca jogador de linha no gol nem goleiro na linha) | variável (15% a 75%) |

**Tabelas de preferência (🔶 v27).** Os números são pesos de sorteio: 1,00 = neutro; 2,00 = o dobro da chance; 0,10 = um décimo. **Nenhum peso é zero**: preferência não é exclusividade, todo técnico ainda joga e treina fora do perfil de vez em quando. O sorteio do dia multiplica ainda a compatibilidade da formação com o estilo (1 a 5, ao quadrado), +30% para estilos ofensivos se o time é bem mais forte (15+ de prestígio) ou para estilos defensivos se é bem mais fraco, e a leitura do último estilo do adversário (probabilidade = acerto × 0,6, escolhendo entre as boas respostas da tabela 5.4 ponderadas pelo perfil). Camaleão e Imprevisível não usam tabela (ver acima).

| Formação | Equilibrado | Futebol arte | Domínio de bola | Ofensivista | Retranqueiro | Camaleão | Imprevisível |
|---|---|---|---|---|---|---|---|
| 4-4-2 | 2,00 | 0,80 | 0,80 | 1,10 | 1,00 | — | — |
| 4-4-2◇ | 1,20 | 1,60 | 2,00 | 0,80 | 0,60 | — | — |
| 3-5-2 | 0,90 | 0,80 | 1,10 | 0,80 | 1,20 | — | — |
| 4-3-3 | 1,20 | 2,00 | 1,50 | 2,00 | 0,25 | — | — |
| 4-2-3-1 | 1,80 | 1,80 | 1,70 | 1,40 | 0,70 | — | — |
| 4-1-4-1 | 1,40 | 0,70 | 1,30 | 0,50 | 1,50 | — | — |
| 3-4-2-1 | 0,70 | 1,60 | 1,30 | 1,30 | 0,40 | — | — |
| 4-3-2-1 | 1,00 | 1,80 | 1,80 | 1,10 | 0,50 | — | — |
| 3-3-1-3 | 0,20 | 1,30 | 0,90 | 1,70 | 0,10 | — | — |
| 4-2-4 | 0,15 | 1,20 | 0,50 | 1,30 | 0,05 | — | — |
| 5-4-1 | 0,30 | 0,10 | 0,20 | 0,05 | 2,20 | — | — |
| 5-3-2 | 0,70 | 0,20 | 0,30 | 0,10 | 2,00 | — | — |

| Estilo de jogo | Equilibrado | Futebol arte | Domínio de bola | Ofensivista | Retranqueiro | Camaleão | Imprevisível |
|---|---|---|---|---|---|---|---|
| Posição | 1,80 | 1,70 | 2,20 | 0,80 | 0,40 | — | — |
| Gegenpressing | 0,70 | 0,90 | 1,00 | 1,90 | 0,20 | — | — |
| Reativo | 0,80 | 0,30 | 0,20 | 0,30 | 1,60 | — | — |
| Jogo Direto | 0,70 | 0,50 | 0,15 | 1,40 | 1,20 | — | — |
| Relacionismo | 1,60 | 2,00 | 1,90 | 0,80 | 0,40 | — | — |
| Retranca | 0,25 | 0,10 | 0,15 | 0,05 | 1,60 | — | — |
| Linha Alta | 0,40 | 0,70 | 0,80 | 1,30 | 0,60 | — | — |
| Corredores | 1,10 | 1,40 | 0,60 | 1,80 | 0,50 | — | — |
| Vertical | 1,20 | 1,40 | 0,50 | 2,00 | 0,40 | — | — |
| Saída Curta | 1,00 | 1,00 | 2,00 | 0,60 | 0,40 | — | — |

| Treino (peso por atributo) | Equilibrado | Futebol arte | Domínio de bola | Ofensivista | Retranqueiro | Camaleão | Imprevisível |
|---|---|---|---|---|---|---|---|
| RIT | igual | 7% | 25% | 7% | 27% | estilo | sorteio |
| CHU | igual | 27% | 25% | 27% | 6% | estilo | sorteio |
| PAS | igual | 27% | 32% | 27% | 7% | estilo | sorteio |
| DRI | igual | 27% | 6% | 27% | 6% | estilo | sorteio |
| DEF | igual | 6% | 6% | 6% | 27% | estilo | sorteio |
| FIS | igual | 6% | 6% | 6% | 27% | estilo | sorteio |

Treino: o atributo é sorteado com peso (preferência do técnico) × (fraqueza do jogador no atributo × importância na posição)^1,5, então um Ofensivista ainda treina defesa de vez em quando, só com menos frequência. Quem treina: reservas fora dos 11 e do banco; a frequência é de 40% por jogo do clube (Camaleão 35%), com peso por grupo (ex.: Ofensivista: atacantes ×1,6, meias ×1,4, defensores ×0,4).

- **Dicas de estilo**: o jogo observa cada técnico (estilos de jogo e formações usados, ofensividade média da formação, variedade de estilos, mudanças no intervalo, treinos), com memória que decai 3% por jogo. Com 8+ jogos, o mouseover no nome dá uma dica com linguagem incerta (talvez / parece / provavelmente), com ruído que diminui até 40 jogos. A primeira dica acerta 59% com 8 jogos e 79% com 30.
- **Evolução**: ao fim de cada temporada, cada técnico do computador troca de estilo com chance de 10% (+22 pontos se rebaixado, +8 se terminou no terço de baixo, −5 se campeão ou promovido). Depois de rebaixado tende a virar Retranqueiro ou Equilibrado (×1,8); promovido, Ofensivista ou Futebol arte (×1,5).
- **Atributo de gestão do clube e do grupo**: fica para uma versão futura.
- **Treino**: 1 a 3 jogos por jogador, no máximo 3 jogadores ao mesmo tempo, descanso de 4 jogos, no máximo 3 treinos seguidos da mesma valência; ganho esperado = jogos × fator de idade (0,9 até 20 anos … 0,12 acima de 31) × fator do atributo × retorno decrescente × moral.

## 8. Mercado

- Compra de jogadores de outros clubes: preço pedido = **preço de mercado (4.5)** × (1 + 10% se titular + 25% se estrela). Aceita se cobrir o pedido; até 12% abaixo, contraproposta. Quem tem contrato exige também a multa rescisória.
- **Compras do computador (v24)**: a cada rodada de liga, cada clube do computador tem 4% de chance de tentar uma contratação. Procura, nas posições em que um reforço melhora o time em 3 pontos ou mais sobre o titular atual da posição (quantidade de vagas por posição: 2 ZAG, 2 MC e 1 nas outras), entre os jogadores de clubes **do mesmo nível ou de série abaixo** (nunca de série acima) e entre os livres que não são da base. O preço é o pedido normal mais a multa (livres: luvas), e o clube só compra se o custo for no máximo 60% do caixa e deixar pelo menos uma folha mensal em caixa. Escolhe o melhor (melhora no time menos 4 × custo/caixa). Computador nunca compra de jogadores de técnicos humanos (esses só vão por proposta aos que estão à venda). Medido: 94 a 121 compras por temporada (a maioria dentro da mesma série; poucas passam da D para a C, da C para a B e da B para a A).
- Jogadores livres: 40 novos por ano, contrato de 12 meses, salário esperado e luvas (2 salários).
- Venda e leilão de jogadores do próprio elenco; propostas do computador a jogadores à venda (chance de proposta 100% até 70% do valor, caindo a 0 em 160%).
- Tela do mercado (🔶 v26: "Jogadores livres" não mostra mais os garotos da base, que aparecem só em "Categorias de base"): filtros de posição, origem, média, idade, "cabe no caixa" (padrão ligado), "só quem melhora meu time"; coluna Δ = média do jogador − média do titular atual mais fraco na posição; ordem padrão "melhora para o meu time".

## 9. Copa do Brasil

64 clubes (preliminar com os 32 mais fracos), mata-mata em ida e volta, sem gol fora dobrado, prorrogação se empatar no agregado e pênaltis só se persistir o empate. Jogos da Copa são nivelados (a diferença de força entre os times vale 55% e a diferença individual de atributos é comprimida) para os pequenos terem chance real.

## 10. A detalhar nas próximas versões

Calendário completo (datas, rodadas, dias de Copa); fórmula exata do público e da elasticidade do ingresso; patrocínios; campanhas de sócios; fórmula de evolução por idade (progressão anual); tabela completa de prêmios individuais; regras de desempate; som e interface.

## 11. Sons da torcida (v24)
Todos gerados no próprio navegador (nada de gravações). Quando o técnico humano tem um jogador expulso, ou há pênalti contra o time dele, a torcida grita com raiva uma das duas frases sorteadas: "Fela da puta!" ou "Juiz ladrão!" (voz do navegador, sobre o ruído de arquibancada em fúria usado no gol sofrido). No pênalti, o grito vem logo depois do apito do juiz.

## 12. Estilos dos técnicos do computador
🔶 v27: os 7 estilos novos (Equilibrado, Futebol arte, Domínio de bola, Ofensivista, Retranqueiro, Camaleão, Imprevisível) e as tabelas de preferência estão na seção 7. O resultado das simulações misturando estilos de técnico, formações e estilos de jogo está no relatório 14. Os documentos `03-estilos-dos-tecnicos-do-computador.md` e a planilha pertencem à thread Regras e Características e ainda descrevem os 6 estilos antigos.
