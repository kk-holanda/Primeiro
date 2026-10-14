# Kfoot 98: documentação do jogo (versão 48)

Documento vivo: cresce junto com a implementação. Cada rodada de melhorias atualiza as seções que mudaram. Valores vêm do código da branch `claude/melhorias-5-xt6u1f` (pasta `kfoot98`). Quando algo ainda não está documentado, a seção diz "a detalhar".

Arquivos de dados desta pasta:
- `times.csv`: os 80 clubes com divisão, prestígio, estádio, caixa, ingresso e se o jogador pode iniciar com ele (🔶 v42: prestígio, capacidade, caixa e demanda são sorteados a cada jogo; os valores são os da semente 1998).
- `jogadores-exemplo-semente-1998.csv`: os 1.920 jogadores de um jogo de exemplo (semente 1998), com todos os atributos. Os jogadores são gerados por sorteio a cada jogo novo; esta lista é um exemplo, não um cadastro fixo.
- `base-mercado-semente-1998.csv`: os 30 garotos das categorias de base que estão no mercado no início do mesmo jogo de exemplo, com o potencial escondido.

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
| Elenco inicial | 24 jogadores por clube (🔶 v42: a divisão por posição depende do perfil de elenco do técnico, seção 18; o Equilibrado e o humano: 3 goleiros, 4 zagueiros, 2 laterais direitos, 2 esquerdos, 3 volantes, 2 meias centrais, 2 meios ofensivos, 1 ponta direita, 1 esquerda, 3 centroavantes, 1 segundo atacante) |
| Limite de elenco | 30 |
| Jogadores iniciais no mundo | 1.920 (🔶 v42: no máximo 50 livres e 30 garotos da base por temporada, seção 18; antes: 40 jogadores livres gerados a cada ano, e as categorias de base: 28 garotos de 15 a 19 anos no início do jogo e, a cada fim de ano, no mínimo 24 ou 80% do número de aposentados, o que for maior) |
| Subem e descem por divisão | 4 |
| Copa do Brasil | 64 clubes, fase preliminar com 32 clubes, ida e volta, sem gol fora dobrado, pênaltis |
| Posições | GOL, ZAG, LIB, LD, LE, VOL, MC, MEI, ALA, PD, PE, CA, SA |
| Formações (🔶 v25) | 4-4-2, 4-4-2 Losango, 3-5-2, 4-3-3, 4-2-3-1, 4-1-4-1, 3-4-2-1, 4-3-2-1, 3-4-3, 4-2-4, 5-4-1, 5-3-2 |
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

- 🔶 **v42: prestígio de 10 a 50**, sorteado a cada jogo novo na faixa da série (A 40–50, B 30–40, C 20–30, D 10–20), junto com a média do elenco; caixa inicial A R$ 4,6 mi, B 2,2 mi, C 1,05 mi, D 0,5 mi (×0,8 a ×1,2 pelo prestígio). Detalhes na seção 18. O texto abaixo descreve a escala antiga.
- **Prestígio** (5 a 99) é a força e a torcida do clube. Move devagar a cada temporada: campanha na liga (−1,5 a +1,5), título (+2), acesso (+2), descenso (−2), título da Copa (+3), fases finais da Copa (+0,5 a +1).
- **Sorteio de força**: a cada jogo novo, os 10 clubes iniciáveis embaralham o prestígio entre si, e os outros 10 da Série D também; os iniciáveis continuam sendo os 10 mais fracos da D, mas o jogador não sabe qual é o mais forte. Caixa e demanda são recalculados.
- **Público** = demanda × forma recente × rivalidade × elasticidade do preço do ingresso, limitado pela capacidade. Rivalidade sobe 25% em clássico da mesma cidade. Receita de bilheteria = público × ingresso × 0,85 (15% de custos e impostos de jogo). O estádio pode ser ampliado (custo por lugar = 25 × ingresso padrão da divisão, até 5 obras). Desde a v35 o jogador escolhe o preço do ingresso.
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
- **Lesão** (🔶 v42: o lesionado perde atributos, seção 18): risco por minuto 0,000062 × fator (1,85 − FIS/65, entre 0,5 e 1,6).
- **Cartões**: 3 amarelos = 1 jogo de suspensão. 🔶 v33 **Vermelho**: o 2º amarelo no mesmo jogo rende 1 jogo de suspensão; o vermelho direto rende de 1 a 3 jogos conforme a gravidade da falta (sorteio: 20% 1 jogo, 50% 2 jogos, 30% 3 jogos; jogador de disciplina muito ruim: 10%, 40%, 50%; de disciplina boa: 35%, 50%, 15%). O lance mostra "suspenso por N jogos" e a situação do jogador mostra "SUSP N" (jogos que faltam), valendo para liga e Copa.
- **Evolução** (🔶 v42: mais a evolução dinâmica pelo momento do time, seção 18): pelo desempenho em campo (nota), idade e moral; retorno decrescente em atributos altos. Treinos e prêmios de fim de ano somam pontos (nada acima de 87 nos prêmios).
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
9. **Faltas e cartões**: 0,125 × 1,7 de chance de falta por minuto; cada falta tem zona e faixa (seção 15); perto da área pelo centro 27% viram cobrança direta e pelos lados 64% viram cruzamento (no total, cerca de 7,5% e 5% das faltas, como antes); amarelo em 10,5% por falta × disciplina.
10. **Pênaltis**: ver seção 6. Gol de pênalti ≈ 76% na média.
11. **Intervalo**: o time do computador responde ao estilo que o adversário usou no 1º tempo com probabilidade = acerto do técnico (0,50 a 0,80), trocando para a melhor resposta da tabela 5.4 que combina melhor com a formação.
12. **Cara a cara (v22)**: 11% dos chutes de jogada são cara a cara com o goleiro (×1,9 se quem deu o passe é Maestro, ×1,2 se o finalizador é Matador); nesses, a chance de gol sobe ×1,5, compensada em todos os chutes de jogada (×0,948) para a média de gols não mudar. Chance de gol geral ×1,065 (calibração depois das estrelas extras).
12b. **Expulsão (🔶 v26)**: o jogador expulso sai e o time **segue com um a menos**; a vaga dele não é preenchida. O técnico humano é avisado e pode trocar um dos jogadores que ficaram em campo por alguém do banco (conta como uma das substituições do jogo); a tela mostra a lista dos que estão em campo (sem o expulso) e a do banco. Se o expulso for o goleiro, dá para tirar qualquer jogador de linha e pôr o goleiro reserva no gol (a vaga do jogador que sai deixa de existir). Pode também "seguir com um a menos". O computador só reage à expulsão do goleiro: tira o jogador de linha de menor valor (atacantes primeiro) e põe o goleiro reserva, se houver substituição disponível.
13. **Substituições do computador (🔶 v29)**: em 60', 70' e 80'. **Reação ao placar**: aos 70' perdendo, e aos 80' perdendo, ganhando ou empatando, o técnico pode trocar um defensor ou meia por um atacante ou meia ofensivo (para buscar o gol) ou um atacante ou meia por um defensor ou volante (para segurar), e mudar o estilo de jogo junto. A chance depende do perfil (reagir perdendo / ganhando / empatando): Equilibrado 55/45/20%, Futebol arte 50/25/30%, Domínio 55/40/20%, Ofensivista 90/20/50%, Retranqueiro 30/90/5%, Camaleão 70/60/30%, Imprevisível 50/50/50%; perdendo aos 80' a chance sobe para no mínimo 60%. O reserva precisa ter ao menos 82% da nota do titular que sai. Quando não reage ao placar, troca o mais cansado (stamina < 75) pelo melhor reserva do slot, como antes.
14. **Memória do adversário (🔶 v29)**: antes de escolher o estilo de jogo, o computador olha os últimos 6 jogos do rival (formação e estilo usados; os mais recentes pesam mais), soma as boas respostas da tabela 5.4 a cada estilo que ele usou e sorteia entre elas (a chance de usar a leitura continua a do perfil: acerto × 0,6). O Camaleão usa as 4 melhores respostas dessa memória.
15. **Poupar jogadores (🔶 v29)**: o computador deixa fora do time titular quem está com stamina abaixo de 45, e, contra adversário com 20 ou mais pontos de prestígio a menos, até 2 titulares com stamina abaixo de 72 (70% de chance cada). No máximo 3 poupados por jogo, nunca o goleiro, e só se sobrarem 16 jogadores disponíveis.

Valores típicos por jogo (jogos entre times de prestígio 40 a 90): ≈ 2,8 gols, 24 chutes, 10 no gol, 6,4 escanteios, 21 faltas, 0,12 lesões; mandante vence 44%, empata 23%, perde 33%. Por divisão (liga completa): A ≈ 2,6 gols, B 2,6, C 2,6, D 2,5.

### 5.1 Formações (🔶 v25: 12, da planilha "Guia tático"; 🔶 v30: o 3-4-3 entrou no lugar do 3-3-1-3)
**3-4-3 (🔶 v30)**: três zagueiros, dois alas, dois meias centrais e três atacantes (dois pontas e um centroavante); a formação mais larga do jogo. Forte: largura, três atacantes que fixam a defesa rival, superioridade pelos lados, pressão alta, cruzamentos. Fraco: só dois meias centrais (perde o meio para linhas de três), alas dependem de fôlego, espaços nas costas dos alas em contra-ataque, três zagueiros exigem cobertura. Sinergia: pontas e centroavante com finalização, ritmo e drible; alas com físico e ritmo; zagueiros e líbero com defesa. Jogos antigos com 3-3-1-3 passam a usar 3-4-3. Modificadores calibrados por simulação (relatório 17): a primeira estimativa (1,025 / 0,930) deixava o 3-4-3 em 1,44 ponto por jogo, acima da faixa; com 0,992 / 0,903 ele ficou em 1,37 e 1,38, igual à média das formações.

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
| 3-4-3 (🔶 v30, no lugar do 3-3-1-3) | 0,992 | 0,903 | 1,000 |
| 4-2-4 | 1,060 | 0,888 | 0,970 |
| 5-4-1 | 0,978 | 1,130 | 0,985 |
| 5-3-2 | 0,981 | 1,067 | 0,990 |

Posições de cada formação (11 slots): 4-4-2 GOL LD ZAG ZAG LE VOL MC ALA ALA CA SA; 4-4-2 Losango GOL LD ZAG ZAG LE VOL MC MC MEI CA SA; 3-5-2 GOL ZAG ZAG LIB ALA VOL VOL MEI ALA CA SA; 4-3-3 GOL LD ZAG ZAG LE VOL MC MEI PD CA PE; 4-2-3-1 GOL LD ZAG ZAG LE VOL VOL MEI PD PE CA; 4-1-4-1 GOL LD ZAG ZAG LE VOL ALA MC MC ALA CA; 3-4-2-1 GOL ZAG LIB ZAG ALA MC MC ALA MEI MEI CA; 4-3-2-1 GOL LD ZAG ZAG LE VOL MC MC MEI MEI CA; 3-4-3 GOL ZAG LIB ZAG ALA MC MC ALA PD CA PE; 4-2-4 GOL LD ZAG ZAG LE VOL MC PD CA SA PE; 5-4-1 GOL LD ZAG LIB ZAG LE VOL VOL MC MEI CA; 5-3-2 GOL LD ZAG LIB ZAG LE VOL MC MC CA SA. Descrição, pontos fortes e fracos e "elenco ideal" de cada uma (texto da planilha) aparecem na tela. Jogos salvos com 4-5-1 ou 3-4-3 viram 4-1-4-1 e 3-3-1-3.

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
| 3-4-3 (🔶 v30) | 4 | 5 | 3 | 4 | 3 | 2 | 4 | 5 | 5 | 3 |
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
- O relógio corre sem parar; a tela mostra 45+2', 90+4'. Acréscimo do 1º tempo = 0,4 + 0,5 por gol + 1 por lesão + 0,3 por cartão + 0,9 por pênalti + 0,3 por substituição feita fora do intervalo + 0,07 por falta do período + ruído normal (0,6), arredondado, de 1 a 8; no 2º tempo a base é 1,0 (🔶 v37: cada jogo tem o seu acréscimo, que cresce com faltas, pênaltis e trocas fora do intervalo). Média medida: ≈ 5 minutos no jogo todo (antes ≈ 4,3).
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
| 3-4-3 (🔶 v30) | 0,30 | 1,10 | 0,70 | 1,80 | 0,10 | — | — |
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
- **Treino**: 1 a 3 jogos por jogador, no máximo 3 jogadores ao mesmo tempo, descanso de 3 jogos (🔶 v37), no máximo 3 treinos seguidos da mesma valência; ganho esperado = jogos × fator de idade (0,9 até 20 anos … 0,12 acima de 31) × fator do atributo × retorno decrescente × moral.

## 8. Mercado

🔶 v42: sem preço pedido nem contraproposta. Comprar custa o valor do jogador + a multa; livres, metade do valor ao empresário; base, R$ 10 a 25 mil sem multa. Compras do computador novas. Ver seção 18.

- Compra de jogadores de outros clubes: preço pedido = **preço de mercado (4.5)** × (1 + 10% se titular + 25% se estrela). Aceita se cobrir o pedido; até 12% abaixo, contraproposta. Quem tem contrato exige também a multa rescisória.
- **Compras do computador (v24)**: a cada rodada de liga, cada clube do computador tem 4% de chance de tentar uma contratação. Procura, nas posições em que um reforço melhora o time em 3 pontos ou mais sobre o titular atual da posição (quantidade de vagas por posição: 2 ZAG, 2 MC e 1 nas outras), entre os jogadores de clubes **do mesmo nível ou de série abaixo** (nunca de série acima) e entre os livres que não são da base. O preço é o pedido normal mais a multa (livres: luvas), e o clube só compra se o custo for no máximo 60% do caixa e deixar pelo menos uma folha mensal em caixa. Escolhe o melhor (melhora no time menos 4 × custo/caixa). Computador nunca compra de jogadores de técnicos humanos (esses só vão por proposta aos que estão à venda). Medido: 94 a 121 compras por temporada (a maioria dentro da mesma série; poucas passam da D para a C, da C para a B e da B para a A).
- Jogadores livres: 40 novos por ano. 🔶 v39: sem luvas; o empresário recebe metade do valor de mercado (garotos da base: R$ 10 mil a R$ 25 mil) e o técnico escolhe o contrato (6 meses, 1 ano, 1 ano e meio ou 2 anos).
- Venda e leilão de jogadores do próprio elenco; propostas do computador a jogadores à venda (chance de proposta 100% até 70% do valor, caindo a 0 em 160%).
- Tela do mercado (🔶 v26: "Jogadores livres" não mostra mais os garotos da base, que aparecem só em "Categorias de base"): filtros de posição, origem, média, idade, "cabe no caixa" (padrão ligado), "só quem melhora meu time"; coluna Δ = média do jogador − média do titular atual mais fraco na posição; ordem padrão "melhora para o meu time".

## 9. Copa do Brasil

64 clubes (preliminar com os 32 mais fracos), mata-mata em ida e volta, sem gol fora dobrado, prorrogação se empatar no agregado e pênaltis só se persistir o empate. Jogos da Copa são nivelados (a diferença de força entre os times vale 55% e a diferença individual de atributos é comprimida) para os pequenos terem chance real.

## 10. A detalhar nas próximas versões

Calendário completo (datas, rodadas, dias de Copa); fórmula de evolução por idade (progressão anual); tabela completa de prêmios individuais; regras de desempate; som e interface.

## 11. Sons da torcida (v24)
Todos gerados no próprio navegador (nada de gravações). Quando o técnico humano tem um jogador expulso, ou há pênalti contra o time dele, a torcida grita com raiva uma das duas frases sorteadas: "Fela da puta!" ou "Juiz ladrão!" (voz do navegador, sobre o ruído de arquibancada em fúria usado no gol sofrido). No pênalti, o grito vem logo depois do apito do juiz.

## 12. Estilos dos técnicos do computador
🔶 v27: os 7 estilos novos (Equilibrado, Futebol arte, Domínio de bola, Ofensivista, Retranqueiro, Camaleão, Imprevisível) e as tabelas de preferência estão na seção 7. O resultado das simulações misturando estilos de técnico, formações e estilos de jogo está no relatório 14. Os documentos `03-estilos-dos-tecnicos-do-computador.md` e a planilha pertencem à thread Regras e Características e ainda descrevem os 6 estilos antigos.

## 13. Finanças (v35 e v36)
- **Estádio por áreas (v36)**: arquibancada, cadeiras e VIP, cada uma com preço, público e obras próprios. Os estádios foram equilibrados por série (🔶 v39: A 25 a 50 mil lugares, B 15 a 30 mil, C 8 a 16 mil e D 5 a 10 mil, sorteados entre os clubes; antes: A 25 a 60 mil, B 15 a 35 mil, C 8 a 20 mil, D 4 a 12 mil). Série D começa sem VIP, mas qualquer clube pode construir.
- **Ingresso**: você escolhe o preço de cada área (de 50% a 300% da média). Abaixo da média a demanda sobe pouco; acima, cai rápido. Por padrão o preço é automático por jogo (sobe em jogo decisivo quando a demanda passa dos lugares); dá para deixar fixo.
- **Obras**: cada área tem lotes de ampliação com prazo de algumas rodadas (o setor continua aberto) e retorno estimado em anos.
- **Sócios-torcedores (v36)**: cada clube tem um número de sócios que enche o estádio mesmo com ingresso caro, paga mensalidade (Bronze, Prata ou Ouro) e varia com vitórias, derrotas, estrelas, Popstars, campanhas, título, acesso e rebaixamento.
- **Marketing**: campanha de sócios (+18% de demanda em 10 jogos em casa) e jogo-evento (+35% em um jogo). Agora custam bem menos e a tela mostra quanto devem render. Só valem com o estádio abaixo de 85% de lotação.
- **Patrocínio**: master (camisa) e secundário (calção e mangas, 40% do valor), contratos de 1 a 3 anos, bônus por meta (livrar do rebaixamento, top 4 ou título), reajuste de 5% a cada 10 rodadas pela posição na tabela e convites quando o clube vai muito bem. Quem está na lanterna pode perder um contrato.
- **Computador**: os outros clubes também fecham patrocínio, ajustam o preço e ampliam o estádio quando lota.
- Detalhes e fórmulas: documento 02, seção 4.3 e seção 19.

## 14. Melhorias #33 (v37)
**Treino.** O botão "Treinar" da ficha do jogador fica desabilitado quando o jogador está em treino, lesionado, descansando, quando já há 3 jogadores treinando ou quando ele já treinou todas as valências 3 vezes seguidas; passar o mouse mostra o motivo. O descanso entre treinos caiu de 4 para 3 jogos e a perda de moral por jogo de treino caiu para −1,5 a −3.

**Moral mais suave.** Depois do jogo a variação é (nota − 6,3) × 3 (era × 5; limitada a ±8); reserva que entra recebe +2 e perde 1,5 × a nota abaixo da média. Moral do técnico: vitória +5 (mais um fator da força do rival, −3 a +4, e até +2 por saldo), derrota −5, empate de −2 a +2 (antes ±8). A moral do técnico agora contagia o elenco de todos os clubes (não só dos humanos): a cada jogo a moral dos jogadores se move (moral do técnico − 50) × 0,02, com efeito menor perto de 0 ou 100. Reserva que não joga tende a 50 + 14 × apoio (apoio = moral do técnico acima de 50 e time no topo da tabela, de 0 a 1) e perde menos por jogo (−0,8 × (1 − apoio)). Em simulação, nos 4 primeiros colocados, reservas passaram de ≈ 62 para ≈ 72 de moral e titulares ficaram em ≈ 88–90.

**Evolução dos jogadores.** O ganho por jogo agora pesa: (a) o nível do jogador contra a série (referência: A 74, B 65, C 58, D 50; quem está acima ganha menos, até 0,2x, e perde um pouco a cada jogo se estiver muito acima, o que faz craque de série forte jogar numa série fraca regredir devagar), (b) a força do adversário contra a do próprio time (0,6x a 1,5x), (c) o clima do clube (moral do técnico alta, time entre os 8 primeiros, vitória: até +45%), (d) a função cumprida (desarmes, defesas, pênalti defendido; em estilos de pressão alta o jogador ganha mais RIT, FIS e DEF). Constante geral 0,15 (era 0,10). Além disso, **convívio com o grupo**: a cada jogo do clube, jogador abaixo da média dos 11 melhores do time evolui um pouco só por estar no elenco (até 19 anos 1,0x; até 22 anos 0,7x; até 25 anos 0,35x; base ×1,4). Medido em 1 temporada: até 21 anos +1,7 (A) a +3,3 (C) de média (antes +0,5 a +1,1); 22–25 anos +1,0 a +2,5 (antes +0,25 a +0,9).

**Subida e descida de divisão.** Quem sobe ganha pontos em todos os atributos de todos os jogadores: 1º colocado +2,0; 2º +1,7; 3º +1,4; 4º +1,1. Quem desce perde: 20º −2,0; 19º −1,7; 18º −1,4; 17º −1,1 (arredondamento sorteado por atributo; aplicado na virada da temporada).

**Traits.** Salvador da pátria: +10% de chance de gol nos acréscimos (além do +30% depois dos 30 minutos do 2º tempo); o computador o mantém no banco (nota −30 na escalação) e o coloca em campo a partir dos 70 minutos quando o time não está ganhando por mais de um gol. Promessa: ao concluir o 3º treino os atributos principais da posição sobem (no máximo +15 em cada um) até a média igualar a do titular mais fraco da posição, mais 0 a 2 pontos.

**Outras mudanças.** O estilo "Posição" passou a se chamar "Jogo de posição". Sócios: vitória +0,9% (era +0,45%, ×1,4 contra rival de prestígio maior), derrota −0,5%; a cada rodada o clube entre os 4 primeiros ganha +0,3%, entre os 8 primeiros +0,05% e entre os 4 últimos perde 0,2%; clube com artilheiro entre os 3 primeiros da série ganha +0,1%. A posição na tabela entra na forma do clube para o público (até ±40% da forma). No botão do cabeçalho, quando o clube do jogador já está fora da Copa do Brasil e o próximo dia é de Copa, o botão vira "Ver jogos da Copa do Brasil". Na substituição, passar o mouse sobre o jogador mostra todos os atributos. Nova aba **Técnicos** com o ranking geral contínuo de todos os técnicos (V-E-D, gols, saldo, médias por jogo, artilheiros, acessos, rebaixamentos, títulos, melhor campanha na Copa, demissões e pontos do ranking).

## 15. Melhorias #34 (v38): regras do futebol, zonas e posse

**Regras do futebol no motor (Melhorias #34, v38).** A partida continua sendo simulada minuto a minuto e a força dos times decide as chances como antes, mas agora a bola tem lugar no campo.

- **Saída de bola e lados (regra 8).** O mandante escolhe o lado e ataca para a direita no 1º tempo; o visitante dá a saída no meio-campo. No 2º tempo os times trocam de lado e o mandante dá a saída; na prorrogação a saída volta a alternar. Depois de cada gol, o time que sofreu recomeça do centro. No minuto da saída quem toca a bola fica com ela na maior parte do minuto (posse do minuto = metade da normal + 50% para quem saiu). O relato mostra "Começa o jogo! X escolheu o lado e Y toca a bola no meio-campo", "Começa o 2º tempo: os times trocam de lado e X dá a saída" e "X recomeça do meio-campo depois do gol".
- **Bola com dono, zona e faixa.** Zonas (vistas por quem tem a bola): própria área, campo de defesa, meio-campo, campo de ataque e área adversária. Faixas (como na imagem do KK): lateral esquerda, meio-espaço esquerdo, corredor central, meio-espaço direito e lateral direita, sempre vistas por quem ataca. A cada minuto sem ataque a bola segue uma matriz de transição: troca de dono com chance 0,55 × (1 − posse do minuto) e, se não troca, avança, fica ou recua uma zona (o time com mais posse avança mais; "saída curta" segura a bola, "jogo direto" avança mais). Como a troca de dono usa a posse do minuto como viés, a posse média de cada time continua a mesma de antes. Quando há ataque, a bola vai ao campo de ataque pela faixa escolhida; na finalização entra na grande área; no desarme ou impedimento quem defende sai com ela do seu campo de defesa; depois de um lance na área quem defende recomeça de trás.
- **Posição de cada jogador.** Laterais, alas e pontas jogam no corredor do seu lado (LE e PE pela esquerda; LD e PD pela direita; o primeiro ALA da formação pela esquerda, o segundo pela direita). Duplas na mesma função (zagueiros, volantes, meias centrais, meias ofensivos) ocupam os meios-espaços; os demais jogam pelo centro. Cada ataque sai por uma faixa sorteada pelo peso de quem joga nela (RIT, DRI e PAS; estilos que abrem o campo pesam mais nas laterais) e, metade das vezes, pela faixa onde a bola já estava. Quem passa e quem dribla são, de preferência, jogadores daquela faixa; o marcador e quem desarma são de preferência os da faixa espelhada (a esquerda de quem ataca é a direita de quem defende). Assim um LD fraco sofre mais com o PE adversário.
- **Faltas com local.** Toda falta tem zona e faixa, e o relato da partida do humano mostra "Falta de X (ZAG, Clube) perto da própria área, pela lateral direita". Falta de drible: na grande área é pênalti; perto da área pelo centro vira tiro livre direto (50%); pelos lados vira falta lateral com cruzamento (50%). Falta geral: o local sai do caminho da bola naquele minuto; perto da área pelo centro, 27% viram cobrança direta; pelos lados, 64% viram cruzamento na área; no meio-campo ou mais longe é tiro livre comum. Esses valores mantêm a quantidade de bolas paradas perigosas da v37 (cerca de 3,5 por jogo).
- **Quem faz a falta.** O goleiro quase não faz falta fora da área (peso 0,08). Perto da própria área, zagueiros, líberos, laterais e volantes pesam 1,4 × √(peso de disciplina), então porradeiros e macetadores aparecem mais. No campo de ataque (pressão lá na frente) quem faz a falta tende a ser atacante e meia. Na grande área, a chance de a falta de drible virar pênalti cresce com a disciplina do marcador (peso de falta^0,7, calibrado para manter a média de pênaltis). No pênalti sem drible (mão, toque), defensores pesam 1,3, volantes 1,15 e o goleiro 0,12, com disciplina^1,4.
- **Goleiro último homem.** No cara a cara, o goleiro pode derrubar o atacante: chance de 1,2% × peso de falta da disciplina dele. É pênalti e vermelho por ser o último homem. Média medida: 1 caso a cada 40 a 50 jogos.
- **Laterais e tiros de meta.** Contados nas estatísticas (cerca de 20 laterais e 5 tiros de meta por jogo); não mudam o resultado.
- **Tela da partida.** Um campinho desenhado com as marcações oficiais (área, pequena área, marca do pênalti, meia-lua, círculo central, linhas dos terços e dos cinco corredores) mostra os 22 jogadores, a bola e para que lado cada time ataca. Na saída de bola todos estão no próprio campo e avançam nos 3 primeiros minutos; depois cada time sobe quando tem a bola e recua quando defende (mais no ofensivo, menos no defensivo). Abaixo do campo: quem está com a bola e onde, e a posse por terço (defesa / meio / ataque) de cada time. O resumo do jogo mostra laterais, tiros de meta e a posse no campo de ataque.
- **O que não mudou.** Força dos times, chance de chute, de gol, de impedimento, número de faltas e cartões. Desempate da Copa: prorrogação e pênaltis só no empate do agregado, e os gols da disputa não contam para o time nem para a artilharia (já era assim).

## 16. Melhorias #35 (v39)

- **Campinho da partida.** Cada jogador é uma bolinha com o número da camisa, nas posições da formação e do estilo (as mesmas do campo da escalação). Antes do apito, no intervalo e depois de cada gol os dois times aparecem no próprio campo, cada um do lado certo, e quem dá a saída fica na bola. Durante o jogo as bolinhas deslizam de um minuto para o outro: o bloco sobe quando a bola está no ataque e recua quando está na defesa, o time que defende fecha para o lado da bola e o jogador mais perto vai nela. O goleiro tem a cor secundária do clube.
- **Mercado.** Nova coluna Salário (o atual, para quem tem clube; o pedido num contrato de 1 ano, para livres e base). A coluna de luvas saiu: livres e garotos da base vêm por um empresário fictício, que recebe a comissão. Filtro "Só quem tem característica". Ao comprar ou contratar, o técnico escolhe a duração do contrato: 6 meses, 1 ano, 1 ano e meio ou 2 anos.
- **Preços.** Valor de mercado = média e posição × idade × desempenho da temporada passada × nota média da temporada atual (±15 a 20%) × gols da temporada (atacantes e meias, até +25%) × estrela (+15%) × característica (+8%, promessa +10%) × artilharias já conquistadas (+8% cada, até +24%). Jogador de clube vale no mínimo R$ 25 mil. Garoto da base: R$ 10 mil a R$ 25 mil (mais caro com característica, média melhor e idade menor). Livre: metade do valor de mercado. O computador paga o mesmo preço pelos livres.
- **Goleiros.** Perdem 55% menos energia por jogo e ganham só 40% da moral positiva do fim do jogo. Como goleiro descansado defende mais, a eficiência do goleiro foi recalibrada (×0,935) para manter os gols da v38.
- **Craque do jogo.** A maior nota da partida ganha +10 de moral; o resumo mostra "Craque do jogo".
- **Moral do técnico.** Vitória +4 (±3 pela força do rival, +1 a +2 por goleada); empate −1 (±2); derrota −6 (±2, até −2 por goleada). A cada jogo a moral também anda 15% em direção a um alvo: 20 com 0 ponto nos últimos 5 jogos até 90 com 15 pontos; caixa negativo tira 15 a 25 do alvo, caixa menor que uma folha tira 5 e caixa acima de 6 folhas soma 4. Média medida numa temporada: 49 (era 63); quem acaba no topo da tabela fica perto de 70 a 95 e quem está no Z4 perto de 10 a 30.
- **Pênaltis narrados.** O relato diz quem fez a falta em quem e como: falta, rasteira, empurrão, puxão de camisa, carrinho, "a bola bateu na mão de X dentro da área" e "o goleiro X derrubou o atacante Y". O resumo do jogo também mostra o lance do pênalti.
- **Tela da partida.** A série do humano aparece primeiro na coluna dos outros jogos; o botão do adversário mostra o nome do técnico; no painel de substituições os reservas vêm em ordem de posição.
- **Escalação.** Ao passar o mouse num estilo de jogo, a dica mostra um mini campo com a formação e as setas e marcações daquele estilo.
- **Resultados da Copa.** Na rodada de volta sem humanos, cada confronto fica numa linha só: placar, "Agregado X × Y" na ordem dos times da linha, pênaltis se houve, e o classificado.
- **Estádios.** Capacidades sorteadas entre os 20 clubes de cada série, espaçadas por igual nas faixas A 25 a 50 mil, B 15 a 30 mil, C 8 a 16 mil e D 5 a 10 mil, mantendo os nomes e a proporção das áreas. Os 10 clubes que o humano pode receber no sorteio ficam com os 10 menores estádios da D.
- **Celebridades na cidade (marketing).** De 2 a 4 vezes por temporada, em jogos em casa (liga ou Copa), uma celebridade quer ir ao jogo: Paula Oliver, rainha de bateria do bloco "Unidos da Galera", ou Mique Jordão, lenda do basquete mundial. O humano recebe uma carta na tela do clube com a foto, a proposta e as contas (público e renda sem e com a visita, cachê, ingresso VIP e resultado estimado). Custo: 20% da renda do jogo com o estádio cheio + 1 ingresso VIP (cadeira, se o estádio não tem VIP). Aceitando, todos os setores lotam naquele jogo. Recusando, ela volta com a carta "Último dia na cidade" no jogo em casa seguinte. O computador aceita quando a conta dá lucro (90% das vezes). Medido: cerca de 2,2 visitas por clube por temporada; compensa para quem costuma ter até ~75% de lotação.

## 17. Celebridades e bônus secretos (v40 e v41)

- **8 celebridades.** Paula Oliver (rainha de bateria do bloco "Unidos da Galera"), Mique Jordão (lenda do basquete), Senhor Lunga (figura do folclore cearense, rabugento e resmungão), Senhor Santos (comunicador), Melé (ex-melhor jogador do mundo), Muzão (comediante nordestino), Marcia (melhor jogadora do mundo) e a dupla sertaneja Zandy e Xunior. Fotos novas enviadas pelo KK, com as logomarcas cobertas.
- **Quantas vezes aparecem.** Cada clube recebe de 2 a 4 propostas por temporada (a recusa gera a carta "Último dia na cidade", que conta como a mesma aparição). Cada celebridade aparece no máximo 1 vez por ano em cada clube. Os 4 últimos da tabela têm mais chance de receber a visita e os 4 primeiros têm menos.
- **Bônus secreto.** A carta-convite só diz que "toda visita dessas deixa uma surpresa". Na rodada seguinte à visita chega a carta "Presente de ..." revelando o bônus, que vale no jogo seguinte do clube (Santos e Muzão: no jogo em casa seguinte):
  - Paula Oliver: todos com moral 100 e, só naquela rodada, 3 treinos instantâneos com o tempo máximo (3 jogos), além dos treinos normais e sem o descanso depois. O técnico escolhe jogador e treino na própria carta.
  - Mique Jordão: todos com energia 100.
  - Senhor Lunga: a torcida xinga o juiz aos 5 minutos e depois de 10 em 10 ("JUIZ FÉLA DA PUTA", "JUIZ CORNO", "VAI SE LASCAR JUIZ SAFADO"), com coro cantado e voz no relato. O juiz pressionado favorece o time: 10% mais pênaltis e faltas a favor, 10% menos faltas contra e 10% menos chance de cartão ou expulsão.
  - Senhor Santos: renda do estádio +50%.
  - Melé: +10 no melhor atributo de cada jogador.
  - Muzão: procura por ingressos +75% (até lotar).
  - Marcia: +5 em drible, finalização e passe para todos.
  - Zandy e Xunior: 50% de desconto na próxima compra de jogador (de outro clube ou livre); o vendedor recebe o valor cheio.
- **Cartas.** A carta do bônus tem uma imagem própria de cada celebridade com o presente (enviadas pelo KK, logomarcas cobertas).
- **Computador.** Vale igual: o clube do computador que aceitar a visita recebe o mesmo bônus; os 3 treinos da Paula vão para os jogadores com maior ganho esperado.

## 18. Melhorias #36 (v42): evolução dinâmica, prestígio, mercado e perfil de elenco

Testes e números no relatório 26 (`relatorios-kfoot/26-v42-evolucao-dinamica-prestigio-mercado.md`).

- **Prestígio de 10 a 50.** A cada jogo novo o prestígio de cada clube é sorteado na faixa da série: A 40 a 50, B 30 a 40, C 20 a 30, D 10 a 20 (na D, os 10 clubes que o humano pode receber ficam entre 10 e 15,5 e os outros entre 14,5 e 20). A média do elenco é sorteada junto: nível da série conforme a posição do clube na faixa (A 66 a 70,7; B 54 a 61,5; C 48,2 a 52,6; D 38,9 a 46,8) mais um acaso (desvio 1,2). No fim da temporada o prestígio anda 45% do que andava antes e fica sempre dentro da faixa da série. Público: mesma procura média por série de antes. Patrocínio = valor base × fator da série (A 0,32; B 0,192; C 0,129; D 0,086: cerca de 2x a cada série; médias no início A R$ 3,0 mi, B 1,5 mi, C 0,76 mi, D 0,37 mi por ano) × 0,8 a 1,2 conforme a posição na faixa. Caixa inicial: A R$ 4,6 mi, B 2,2 mi, C 1,05 mi, D 0,5 mi, × 0,8 a 1,2. Rivalidade, tática do computador, moral do técnico, propostas, juniores e potencial da base usam a escala nova.
- **Perfil de elenco por técnico.** Cada estilo de técnico do computador gera um elenco com posições e "jeito" próprios (24 jogadores, 14 titulares, os titulares melhores em cada posição): Equilibrado (3 GOL, 8 defensores, 7 meio, 6 ataque); Futebol-arte (mais meias e pontas; drible +3, passe +2, finalização +2, defesa −3, físico −2); Domínio (10 de meio; passe +3, ritmo +2); Ofensivista (8 atacantes; finalização +3, drible +2, defesa −3); Retranqueiro (9 defensores com líbero, 4 volantes; defesa +3, físico +2, drible e finalização −2); Camaleão (alas e 2 segundos atacantes, mais jogadores com posição extra); Imprevisível (Equilibrado com 4 reservas de posição sorteada e jeito sorteado). O jeito não muda a média. O humano começa com o elenco Equilibrado. Correção: antes, os 14 "titulares" de cada elenco eram os 14 primeiros da lista (goleiros e defensores) e os atacantes nasciam ~12 pontos piores; o motor foi recalibrado para manter os gols.
- **Evolução dinâmica.** Depois de cada jogo, o elenco ganha ou perde pontos de atributo pelo momento do time. Liga: 40% resultado, 40% surpresa (resultado contra o esperado pela força dos dois times e pelo mando) e 20% posição na tabela (a partir da 6ª rodada). Copa: a surpresa pesa mais e a zebra ganha um extra (o pequeno que vence ou empata com o grande sobe bem mais; o grande cai). A moral do técnico aumenta o ganho e diminui a perda. Quem jogou sente de 40% a 100% (pelos minutos); quem não jogou, 30%. O ganho vai mais para os atributos importantes da posição. Teto por série (o ganho some perto de A 88, B 77, C 68, D 60) e piso (a perda some perto de A 62, B 52, C 45, D 36). Retorno decrescente relativo ao nível da série, igual para ganho e perda. Medido: o líder da D termina com 56 a 59 de média, igual ou acima dos 4 últimos da C.
- **Zebra na Copa e moral.** Quando a surpresa é grande, os jogadores ganham ou perdem até 14 de moral (metade para quem não jogou) e o técnico até 18. Medido: time 2 séries abaixo que vence ganha +0,45 na média dos 11 no jogo; o grande que perde, −0,66.
- **Lesão.** O jogador lesionado perde 0,6 + 0,3 × jogos parados pontos em cada atributo (ritmo e físico ×1,5, os outros ×0,75). Média medida: −1,2 de média por lesão.
- **Ver a evolução.** Coluna "Evol." no elenco (variação da média na temporada); cartão "Evolução do time" com o gráfico da média dos 11 melhores jogo a jogo e linhas da média da série e dos 4 últimos da série de cima; no painel do jogador, a variação, um mini gráfico e as últimas mudanças com o motivo; no resumo do jogo, coluna "Média" antes → depois.
- **Salário na renovação.** O computador renova pelo valor atual do jogador (1,17% do valor de mercado ao mês, mínimo R$ 500). Propostas a livres e renovações do humano usam o mesmo cálculo.
- **Obras do computador.** Só numa área que lotou (98% ou mais) pelo menos 1 vez (3 vezes na Série A) desde a última obra nela e que fica, em média, com 90% ou mais nos últimos 25 jogos em casa.
- **Mercado.** Saiu a coluna Pedido. Comprar de outro clube = valor do jogador + multa (40% do valor × tempo que falta de contrato, até 1 ano); se o humano colocou à venda, vale o menor entre o valor e o preço dele. Livre: metade do valor ao empresário. Garoto da base: R$ 10 mil a R$ 25 mil ao empresário, sem multa. A janela de compra mostra "valor + multa = total" e o botão "Comprar por R$ X". Colunas: Valor, Multa, Total, Salário, Contrato.
- **Livres e base.** No máximo 50 livres; quando passa disso, os mais velhos e piores deixam o futebol. A cada temporada nascem livres até completar 50, e 30 garotos da base.
- **Compras do computador.** A cada rodada da liga, 4,5% de chance por clube. Orçamento = caixa − 2 folhas mensais. Procura na própria série, na de baixo e na de cima (nunca de técnicos humanos). Prefere as posições que faltam no perfil de elenco do técnico e jogadores com o jeito que ele gosta. Um jogador custa no máximo 45% do orçamento; até 2 compras na mesma janela (até 60% do orçamento) e 4 por temporada. Base: com 3 ou mais jogadores de 33 anos ou mais, compra um garoto da posição do jogador mais velho; senão, chance de 35% (Futebol-arte, Domínio, Equilibrado) ou 20% (outros) de comprar uma promessa ou prodígio. Medido: ~135 compras por temporada, ~50 da série de cima.
- **Estilos.** Saída curta perde a bola com metade da chance (e menos ainda no campo de defesa). Retranca: defesa +1,5%, +1,2% por defensor acima de 4 e um bônus quando os defensores são melhores em defesa e físico que o resto do time. Gegenpressing: controle e defesa +2,5% e um bônus de controle, defesa e ataque quando o time tem ritmo, marcação e físico acima da própria média.
- **Tela do jogo.** O campinho animado saiu. Os lances ficam abaixo da barra de posse, numa caixa de 5 linhas com rolagem. As estatísticas continuam.
- **Bônus da Paula Oliver (correção).** Os 3 treinos instantâneos são escolhidos uma única vez: depois de "Treinar agora" as escolhas travam, o botão some e o bônus não volta na mesma temporada.

## 19. Boas-vindas do técnico humano (v43)

- Depois do sorteio, ao apertar **Continuar**, aparece a tela de boas-vindas: "Seja bem-vindo, [nome]! O [clube] está muito feliz por ter você como técnico e quer conhecer você melhor."
- **1. Estilo de técnico:** os 7 estilos dos técnicos do computador (Equilibrado, Futebol arte, Domínio de bola, Ofensivista, Retranqueiro, Camaleão, Imprevisível) e "Não sei, ainda quero desenvolver meu estilo de técnico" (neutro, igual ao Equilibrado).
- **2. Estilo de jogo:** os 10 estilos de jogo, cada um com um campinho (formação típica, setas e marcações do estilo) e a explicação, e "Não sei, ainda quero desenvolver meu estilo de jogo" (neutro).
- Em cada grupo, de 1 a 2 opções; o "Não sei" não pode ser marcado junto com as outras (marcá-lo desmarca as demais; marcar outra desmarca o "Não sei"). Uma 3ª escolha mostra o aviso para desmarcar uma. O botão só libera com pelo menos 1 escolha em cada grupo. Com 2 ou mais técnicos humanos, a tela aparece para cada um, em sequência.
- **Elenco do humano:** montado como os do computador, pelo perfil escolhido (seção 18). Posições: média dos perfis dos estilos de técnico escolhidos, arredondada para 24 jogadores e 14 titulares. Jeito dos jogadores: o dos estilos de técnico somado aos atributos que os estilos de jogo pedem (até ±4 por atributo), sem mudar a média. O nível do elenco não muda (média dos 11 ~47 em qualquer escolha). O mundo é gerado de novo com a mesma semente na confirmação.
- A tela do clube (antes de ver o plantel) mostra "Seu estilo".

## 20. Nomes variados (v44)

Só Série D, livres e base (brasileiros). 28% dos jogadores recebem um nome da lista curada (as listas do KK mais sugestões, com posição, jeito e característica; ver `nomes-serie-d-livres-base.md`); os outros vêm de apelidos, nome + cidade, nome só ou sobrenome de imigrante, ou ficam com nome + sobrenome. Séries A, B e C não mudaram. O sorteio dos nomes usa uma sequência à parte, então o resto do mundo gerado é igual ao da v43. Nova nacionalidade: Moçambique (Chiquinho Conde).

## 21. Salvar e carregar jogo (v45)

- **Onde fica:** botão **Salvar / carregar** no topo da tela do clube (entre uma rodada e outra, e na tela de fim de temporada). Na tela inicial aparecem **Continuar (clube)**, que abre o jogo salvo mais recente, e **Carregar jogo**.
- **Espaços no navegador:** 5 espaços manuais (Jogo 1 a 5) e 1 **Automático**, que grava sozinho toda vez que o técnico volta para a tela do clube depois de uma rodada (e no fim da temporada). Cada espaço mostra clube, técnico, série, posição, temporada, data no jogo e quando foi salvo. Substituir, carregar por cima de um jogo aberto e apagar pedem um segundo clique de confirmação. Começar um jogo novo substitui só o Automático.
- **Arquivo:** **Baixar arquivo do jogo** gera um `.json` (ex.: `kfoot98-colatina-1998-02-18.json`, cerca de 0,5 a 2 MB) e **Abrir arquivo salvo** abre esse arquivo em qualquer navegador ou aparelho. Dentro do Claude o download passa pela confirmação do próprio Claude.
- **Onde os dados ficam:** no armazenamento do navegador (IndexedDB; se não houver, localStorage), comprimidos. Não são cookies. Somem se os dados do site forem apagados ou numa aba anônima, por isso o arquivo é o backup.
- **O que é salvo:** o mundo inteiro (clubes, jogadores, tabelas, Copa, finanças, estádios, mercado, histórico, VIPs, notícias), os técnicos humanos (hot seat incluído, com quem já marcou "pronto") e o ponto exato do sorteio. Um jogo carregado continua exatamente como continuaria sem salvar: as mesmas decisões dão os mesmos resultados.
- **Não dá para salvar** no meio de uma partida; salva-se antes ou depois dela.
- **Versões:** o arquivo guarda a versão do jogo. Um save de versão anterior abre com um aviso de que regras novas só valem dali em diante.

## 22. Pacote de melhorias (v46)

- **Bug corrigido (v45.1):** começar a temporada seguinte travava quando o clube do humano tinha ganho o prêmio de melhor técnico ou subido/caído (a moral do técnico lia um ponto de fim de ano sem adversário). Cada clique pulava mais um ano. Agora o botão vira a temporada uma vez só.
- **Mercado:** botão **Negociações do ano** abre a lista de todos os jogadores negociados (compras entre clubes, leilões, livres e base), com data, jogador, posição, idade, média, clube de origem e de destino, preço (com a multa) e salário. Tem seletor de temporada (anos anteriores), busca e filtro "Só o meu clube". Jogos salvos antes da v46 começam o registro a partir de quando forem abertos.
- **Depois do jogo:** o resumo não mostra mais a tabela das divisões. Ao apertar Continuar abre a tela de **Classificação** (Séries A a D e Copa) com o botão **Ver a artilharia** e o botão **Ir ao clube**. Avisos da diretoria, evolução de jogadores (promessas, base), cartas e bônus dos VIPs só aparecem depois que a tela do clube abre.
- **Moral do técnico:** derrota tira 4 (era 6), goleada no máximo 1 a mais, e na metade de cima da tabela a perda é um terço menor. A posição na liga entra em 30% do alvo da moral (1º = 78, último = 30) a partir da 4ª rodada. Medido numa temporada: quem está entre 5º e 8º fica com moral média 68 (era 59) e quase nunca abaixo de 58.
- **Stamina na Copa:** num dia de Copa do Brasil, quem já foi eliminado recupera só metade da stamina até o próximo jogo.
- **Substituições:** abrem numa janela com o campinho (formação, número, posição, média na posição, posições secundárias e stamina de cada um), a tabela de quem está em campo e dos reservas (com as posições secundárias), formação e estilo. Um jogador em campo + um reserva = substituição. Dois jogadores em campo = **trocar posições**, que não conta como substituição (útil depois de expulsão ou lesão).
- **Notícias:** o painel mostra as 5 mais recentes. O botão com caderninho e relógio ao lado do título abre todas as notícias guardadas (até 400), com filtro das do seu clube e barra de rolagem.
- **Fim de temporada:** tela nova com a campanha do seu clube em destaque (posição, situação, pontos, V-E-D, gols, Copa, artilheiro do time, evolução, moral do técnico, caixa), campeões com escudos, acesso e descenso com escudos e posições, e as premiações.

## 23. Ajustes da substituição e da tela do jogo (v47)
- **Formação em qualquer pausa:** a formação pode mudar sempre que o jogo estiver pausado, não só no intervalo. Os jogadores em campo são reorganizados nas novas posições sem gastar substituição. O efeito de "boa resposta" ao adversário (+2% / −1,5%) continua valendo só para a troca feita no intervalo.
- **Janela de substituições:** a posição principal de cada jogador aparece em negrito (no campinho e nas tabelas), e os botões "Fechar e continuar o jogo" e "Fechar (jogo pausado)" ficam na linha de cima, junto do resumo de substituições, formação e estilo. Logo abaixo dos estilos, as formações ficam à esquerda (em 2 linhas no PC, 3 no celular) com a explicação embaixo, e à direita ficam os botões menores "Confirmar substituição", "Trocar posições" e "Limpar seleção", com a dica do que vai acontecer.
- **Barra do jogo ao vivo:** relógio e botões ficam sempre no mesmo lugar ao pausar e continuar. Os botões são menores e discretos; o de pausar/continuar tem largura fixa e o de substituições aparece sempre, apagado enquanto a bola rola.
- **Placar na janela (v48):** a janela de substituições mostra no topo o placar do jogo (escudos, nomes, gols e minuto), porque o placar da tela de trás fica escondido.

## 24. Nova tela de escalação (v48)
A parte de cima da aba Escalação foi refeita. O campo e a tabela de jogadores ficam como antes, lado a lado, logo abaixo. A versão antiga da tela (v48 antes desta mudança) está guardada em `design/backup-interface-atual/kfoot98-index-escalacao-antiga-v48-33287f1.html` e no commit 33287f1.
- **1 Formação e 2 Estilo de jogo em cartões.** Cada formação tem um desenhinho, a compatibilidade com o estilo escolhido (5 bolinhas) e um selo colorido com o **encaixe do elenco** (Ótimo ≥ +10%, Bom ≥ +3%, Neutro, Fraco, Ruim ≤ −10%). Cada estilo mostra a compatibilidade com a formação escolhida e o mesmo selo. Uma estrela marca a formação ou o estilo de melhor encaixe (só entre os de compatibilidade 3 ou mais). O encaixe dos cartões que não estão em uso é calculado com a escalação automática naquela combinação; o da combinação em uso é o da escalação que você montou.
- **Mouseover** em cada cartão, com os textos de antes: formação (nome e estrutura, elenco ideal, Forte, Fraco, efeito da estrutura) e estilo (nomes alternativos, descrição, Bônus, Risco, Condição, efeitos no jogo, compatibilidade e o campinho com as setas do estilo). No celular não há mouseover (o toque escolhe a formação ou o estilo); os textos completos continuam disponíveis no PC.
- **Resumo da combinação**, com a compatibilidade, uma frase sobre o encaixe e os 3 estilos que mais combinam com o elenco na formação atual.
- **Linha de baixo:** Encaixe do elenco (número, nível e barras de ataque, defesa e controle), Pontos de atenção (até 3 titulares que perdem 3 pontos ou mais jogando fora da posição natural, e se algum reserva rende mais ali) e Papéis (capitão, faltas e pênaltis, escanteios, substituições, escalação automática, saída de bola e ritmo).
- **Nomes:** "Gegenpressing" passou a se chamar **Contra-pressão** (também chamado Gegenpressing) e "Construção desde Trás" passou a se chamar **Saída Curta** (também chamado Construção desde Trás).
