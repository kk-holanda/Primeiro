# Kfoot 98: documentação do jogo (versão 22)

Documento vivo: cresce junto com a implementação. Cada rodada de melhorias atualiza as seções que mudaram. Valores vêm do código da branch `claude/melhorias-5-xt6u1f` (pasta `kfoot98`). Quando algo ainda não está documentado, a seção diz "a detalhar".

Arquivos de dados desta pasta:
- `times.csv`: os 80 clubes com divisão, prestígio, estádio, caixa, ingresso e se o jogador pode iniciar com ele.
- `jogadores-exemplo-semente-1998.csv`: os 1.920 jogadores de um jogo de exemplo (semente 1998), com todos os atributos. Os jogadores são gerados por sorteio a cada jogo novo; esta lista é um exemplo, não um cadastro fixo.

## 1. Visão geral

- Jogo de gerenciamento de futebol brasileiro em 1998, num único arquivo HTML, que roda no navegador (sem servidor), em português.
- 1 a 8 técnicos humanos no mesmo computador (hot-seat). Os demais clubes são do computador.
- 80 clubes em 4 divisões de 20 clubes: Série A, B, C e D. Temporada de 1998 em diante, sem fim.
- Os jogadores humanos só podem iniciar em 10 clubes da Série D (os "iniciáveis"): Bangu, Madureira, Marília, Olaria, Sertãozinho, Rio Branco-ES, Tuna Luso, Colatina, Ceilândia e Guarany de Bagé. A escolha é por sorteio de bolinhas.
- Todo o motor é determinístico a partir de uma semente (gerador mulberry32): a mesma semente e as mesmas decisões dão o mesmo jogo.
- Níveis de dificuldade: Fácil, Normal, Difícil (caixa inicial do humano ×1,5 / ×1 / ×0,8; acerto do técnico do computador no intervalo −0,15 / 0 / +0,15; frequência de treino do computador ×0,6 / ×1 / ×1,4).
- Opção de desligar a demissão pela diretoria. Substituições: 3 por jogo (padrão 1998) ou 5 (moderno).

## 2. Números do jogo

| Item | Valor |
|---|---|
| Clubes | 80 (20 por divisão) |
| Elenco inicial | 24 jogadores por clube (3 goleiros, 4 zagueiros, 2 laterais direitos, 2 esquerdos, 3 volantes, 2 meias centrais, 2 meios ofensivos, 1 ponta direita, 1 esquerda, 3 centroavantes, 1 segundo atacante) |
| Limite de elenco | 30 |
| Jogadores iniciais no mundo | 1.920 (mais 40 jogadores livres gerados a cada ano) |
| Subem e descem por divisão | 4 |
| Copa do Brasil | 64 clubes, fase preliminar com 32 clubes, ida e volta, sem gol fora dobrado, pênaltis |
| Posições | GOL, ZAG, LIB, LD, LE, VOL, MC, MEI, ALA, PD, PE, CA, SA |
| Formações | 4-3-3, 4-2-3-1, 4-4-2, 4-5-1, 3-5-2, 3-4-3 |
| Táticas | Ofensivo, Equilibrado, Defensivo, Contra-ataque |
| Atributos | Ritmo (RIT), Finalização (CHU), Passe (PAS), Drible (DRI), Defesa (DEF), Físico (FIS) e Bola parada (cobrança) |
| Nacionalidades dos jogadores | BRA (92% na média), ARG, PAR, URU, CHI, COL, PER, BOL, VEN, EQU |
| Técnicos do computador | 80, com nome sorteado e um entre 6 estilos escondidos |

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
- Posições extras: 46% dos jogadores de linha têm 1 extra e 10% têm 2. Vizinhas permitidas: ZAG (LIB, VOL, LD, LE), LIB (ZAG, VOL), LD (LE, ALA, ZAG, PD), LE (LD, ALA, ZAG, PE), VOL (ZAG, MC, LIB), MC (MEI, VOL, ALA), MEI (MC, SA, PD, PE), ALA (LD, LE, MC, PD, PE), PD (PE, LD, ALA, CA), PE (PD, LE, ALA, CA), CA (SA, PD, PE), SA (CA, MEI, PD, PE).

### 4.3 Posição e afinidade
Média no slot = média da posição do slot × afinidade. Natural: 1,00; posição extra: 0,985 (ou a afinidade da extra × 0,97). Pares próximos: ZAG-LIB 0,98; LD-LE 0,95; LD/LE-ALA 0,94; VOL-MC 0,96; MC-MEI 0,96; VOL-LIB 0,93; PD-PE 0,95; CA-SA 0,96; MEI-SA 0,94; PD/PE-ALA 0,93; MC-ALA 0,94; ZAG-VOL 0,94; LD/LE-ZAG 0,90; CA-PD/PE 0,90; SA-PD/PE 0,94; MEI-PD/PE 0,92; MC-SA 0,88; LD-PD, LE-PE 0,90; LD/LE-VOL 0,90; LIB-MC 0,90. Mesmo grupo: 0,90; grupos vizinhos: 0,80; distantes: 0,65; goleiro na linha: 0,35; jogador de linha no gol: 0,25 (e rende só 20% no gol).

### 4.4 Estados do jogador
- **Stamina** (0–100): cai no jogo (≈ 33 − 0,22 × FIS por 90 min), recupera com o descanso (taxa 0,085 + 0,001 × FIS ao dia, menor para veteranos).
- **Moral** (0–100): nota boa sobe, nota ruim desce (±5 por ponto de nota diferente de 6,3). Reserva que entra ganha confiança; moral de quem não joga tende a 50. Moral do computador se recupera 12% da distância até 55 por jogo, com piso de 30.
- **Lesão**: risco por minuto 0,000062 × fator (1,85 − FIS/65, entre 0,5 e 1,6).
- **Cartões**: 3 amarelos = suspensão; vermelho = 1 jogo.
- **Evolução**: pelo desempenho em campo (nota), idade e moral; retorno decrescente em atributos altos. Treinos e prêmios de fim de ano somam pontos (nada acima de 87 nos prêmios).
- **Contrato**: salário = valor de mercado × 0,0117 (mínimo R$ 500/mês); renovação nos últimos 3 meses.

### 4.5 Valor de mercado
valor = 17.000 × e^((média − 40) × 0,14) × fator de idade × fator da posição, arredondado a R$ 1.000. Exemplo para o mesmo jogador: média 60 ≈ R$ 294 mil; 70 ≈ R$ 1,2 mi; 80 ≈ R$ 4,8 mi.

### 4.6 Traits (características, v22)
De 2 a 4 jogadores por time têm uma característica (uma por jogador; aparece como etiqueta de 3 letras ao lado do nome). Sorteio por elegibilidade e peso; jogadores gerados depois (mercado, base) têm 4% de chance e, na virada do ano, cada time é completado a 2 e limitado a 4.

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
| Highlander | HIG | qualquer | Lesão ×0,6, perda de stamina ×0,85. |

Efeitos medidos em 1.500 jogos pareados (ver o relatório de medições da v22).

## 5. O jogo (motor de partida)

Cada partida tem 90 minutos simulados minuto a minuto, mais acréscimos (ver 5.4).

1. **Forças de cada time**: ataque = 0,60 × média do ataque + 0,30 × meio + 0,10 × defesa; defesa = 0,76 × defesa + 0,08 × meio + 0,16 × goleiro; controle = 0,60 × meio + 0,20 × ataque + 0,20 × defesa. Cada jogador entra com média no slot × stamina × moral × sinergia. Tudo multiplicado pelos modificadores da formação e da tática, por um fator de forma do dia (±3%) e pelo capitão.
2. **Stamina e moral**: força × (0,55 + 0,45 × (stamina/100)²) e × (0,95 + 0,10 × moral/100). Quem entra do banco tem pernas frescas: +15% decaindo em 40 minutos.
3. **Posse**: (controle A)^2,2 ÷ soma, mais uma "maré" (v22): onda que se arrasta de um minuto para o outro (m = 0,88 × m + ruído de 0,04) e um empurrão de 1,5 ponto percentual por gol de desvantagem (até 4). A posse mostrada na tela é a dos últimos minutos (média móvel de 15%), então varia ao vivo; o resumo mostra o total do jogo. Mandante tem controle ×1,07.
4. **Ataque**: a cada minuto há 0,575 × tempo médio das táticas de chance de um ataque; a posse e o ritmo (tempo) da tática decidem quem ataca. Time com folga de 2+ gols poupa o time.
5. **Drible × marcação**: o driblador enfrenta o marcador; quem perde o duelo faz falta (pênalti se foi na área: atacante 24%, meia 11%, zagueiro 2%; senão falta direta 50%).
6. **Chute**: probabilidade = 0,378 + diferença de ataque×defesa × 0,0065 + diferença de passe × 0,0038 + diferença de ritmo × 0,0022 + bônus de duelo ganho (0,16) + bônus de nível baixo (até +0,04). Passe final vem de quem tem mais passe (meias com peso 1,6; atacantes 4,6; defensores 0,22; goleiro 0,03; laterais ×1,5).
7. **Finalização**: chance de ir no gol = base (0,41 bola, 0,385 cabeça, 0,42 falta) + (finalização − 50) × 0,004 − (marcador − 50) × 0,0042. Chance de gol = base 0,31 + (finalização − goleiro) × 0,0032. A finalização efetiva pesa ×1,6 (Copa: individual comprimido). Goleiro de linha: ×0,2.
8. **Escanteios e cabeceios**: o melhor passador bate; quanto melhor o passe, mais cabeçadas; o melhor de cabeça finaliza.
9. **Faltas e cartões**: 0,125 × 1,7 de chance de falta por minuto; falta direta perto da área em 7,5% delas; amarelo em 10,5% por falta × disciplina.
10. **Pênaltis**: ver seção 6. Gol de pênalti ≈ 76% na média.
11. **Intervalo**: o time do computador responde à tática que o adversário usou no 1º tempo com probabilidade = acerto do técnico (0,50 a 0,80) ± dificuldade.
12. **Cara a cara (v22)**: 11% dos chutes de jogada são cara a cara com o goleiro (×1,9 se quem deu o passe é Maestro, ×1,2 se o finalizador é Matador); nesses, a chance de gol sobe ×1,5, compensada em todos os chutes de jogada (×0,948) para a média de gols não mudar. Chance de gol geral ×1,065 (calibração depois das estrelas extras).
13. **Substituições do computador**: em 60', 70' e 80' troca o mais cansado (stamina < 75) pelo melhor reserva do slot.

Valores típicos por jogo (jogos entre times de prestígio 40 a 90): ≈ 2,8 gols, 24 chutes, 10 no gol, 6,4 escanteios, 21 faltas, 0,12 lesões; mandante vence 44%, empata 23%, perde 33%. Por divisão (liga completa): A ≈ 2,6 gols, B 2,6, C 2,6, D 2,5.

### 5.1 Formações (modificadores de ataque / defesa / controle)
4-3-3: 1,023 / 0,937 / 1,016; 4-2-3-1: 0,965 / 0,995 / 0,986; 4-4-2: 1 / 1 / 0,994; 4-5-1: 0,983 / 1,066 / 0,990; 3-5-2: 0,991 / 1,002 / 0,996; 3-4-3: 1,008 / 0,86 / 1,019. Ajustadas por simulação para que nenhuma domine (amplitude entre formações ≈ 0,04 ponto por jogo).

### 5.2 Táticas
Ofensivo (ataque 1,142, defesa 0,994, ritmo 1,08, faltas +10%, abertura +1); Equilibrado (tudo 1); Defensivo (0,934 / 1,036, ritmo 0,92, retranca −2% nas chances do adversário, compacta); Contra-ataque (1,009 / 1,071, ritmo 0,88, bônus no contra-ataque proporcional à abertura do adversário). Melhor resposta: ofensivo → contra; equilibrado → ofensivo; defensivo → ofensivo; contra → defensivo ou equilibrado.

### 5.3 Sinergia
Mede o quanto os jogadores certos estão nos lugares que a tática e a formação pedem, comparado a um time comum (elencos reais gerados, escalados automaticamente). Teto ±8%. Normalizada: a média de cada combinação fica entre −0,7% e 0%.

### 5.4 Acréscimos e prorrogação (v22)
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

- **Humano**: escolhe formação, tática, titulares, capitão, batedores (falta e pênalti; escanteios), treinos, conversa com o elenco e bicho. **Conversa (v22)**: escolhe o tom (Elogiar: +3, sem risco; Motivar: (3+3k) × 1,3 para moral < 50 ou × 0,8, 20% − (moral do técnico − 50)/500 de cair mal (−2); Cobrar: +6 para moral < 60, −2 para moral > 75, risco 55% − moral do técnico/160 (entre 10% e 50%) de cair mal (−4)) e com quem falar (grupo, só os desanimados com moral < 50, ou um jogador, com efeito ×1,5 nos tons Elogiar e Motivar). Espera: 4 jogos para conversa com grupo, 3 jogos por jogador. A moral do técnico sobe com vitórias (principalmente contra times maiores) e desce com derrotas; abaixo de 20 gera aviso e, por 12 jogos seguidos abaixo de 20 com o clube na zona de rebaixamento, a diretoria o demite (desligável) e ele assume um clube pior.
- **Computador**: cada clube tem um técnico com nome e um estilo escondido entre 6:

| Estilo | Peso | Treina | Tática preferida | Formações preferidas | Acerto no intervalo |
|---|---|---|---|---|---|
| Formador | 20 | jovens até 23 anos | equilibrada | — | 55% |
| Ofensivista | 17 | CHU, DRI, RIT de atacantes e meias | ofensiva (40%) | 4-3-3, 3-4-3, 4-2-3-1 | 50% |
| Retranqueiro | 17 | DEF, FIS de defensores, volantes e goleiros | defensiva/contra (40%) | 4-5-1, 3-5-2, 4-4-2 | 55% |
| Preparador físico | 14 | FIS, RIT | — | — | 55% |
| Professor | 17 | PAS, DRI | equilibrada (30%) | 4-2-3-1, 4-4-2, 4-3-3 | 70% |
| Estrategista | 15 | quase não treina | — | — | 80% |

- **Dicas de estilo**: o jogo observa cada técnico (tática e formação usadas, jovens no time, mudanças no intervalo, treinos), com memória que decai 3% por jogo. Com 8+ jogos, o mouseover no nome dá uma dica com linguagem incerta (talvez / parece / provavelmente), com ruído que diminui até 40 jogos. A primeira dica acerta 59% com 8 jogos e 79% com 30.
- **Evolução**: ao fim de cada temporada, cada técnico do computador troca de estilo com chance de 10% (+22 pontos se rebaixado, +8 se terminou no terço de baixo, −5 se campeão ou promovido).
- **Treino**: 1 a 3 jogos por jogador, no máximo 3 jogadores ao mesmo tempo, descanso de 4 jogos, no máximo 3 treinos seguidos da mesma valência; ganho esperado = jogos × fator de idade (0,9 até 20 anos … 0,12 acima de 31) × fator do atributo × retorno decrescente × moral.

## 8. Mercado

- Compra de jogadores de outros clubes: preço pedido = valor de mercado × (1 + 10% se titular + 25% se estrela). Aceita se cobrir o pedido; até 12% abaixo, contraproposta. Quem tem contrato exige também a multa rescisória.
- Jogadores livres: 40 novos por ano, contrato de 12 meses, salário esperado e luvas (2 salários).
- Venda e leilão de jogadores do próprio elenco; propostas do computador a jogadores à venda (chance de proposta 100% até 70% do valor, caindo a 0 em 160%).
- Tela do mercado: filtros de posição, origem, média, idade, "cabe no caixa" (padrão ligado), "só quem melhora meu time"; coluna Δ = média do jogador − média do titular atual mais fraco na posição; ordem padrão "melhora para o meu time".

## 9. Copa do Brasil

64 clubes (preliminar com os 32 mais fracos), mata-mata em ida e volta, sem gol fora dobrado, prorrogação se empatar no agregado e pênaltis só se persistir o empate. Jogos da Copa são nivelados (a diferença de força entre os times vale 55% e a diferença individual de atributos é comprimida) para os pequenos terem chance real.

## 10. A detalhar nas próximas versões

Calendário completo (datas, rodadas, dias de Copa); fórmula exata do público e da elasticidade do ingresso; patrocínios; campanhas de sócios; leilão; fórmula de evolução por idade (progressão anual); aposentadoria; tabela completa de prêmios individuais; regras de desempate; som e interface.
