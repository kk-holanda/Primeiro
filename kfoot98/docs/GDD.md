# Kfoot 98 — Documento de Design

Jogo de gerenciamento de futebol (estilo Brasfoot/Elifoot) ambientado em **1998**. Você começa como técnico na **Série D**.
Tecnologia sugerida: HTML5 + JavaScript puro (igual ao KKart), motor 100% determinístico por semente para permitir multiplayer.

> **Honestidade sobre os dados.** Pesquisei o contexto histórico (Brasileirão 1998, Libertadores 1998), mas **não existe base pública fácil com caixa, folha salarial e renda de estádio de 1998**. Os valores financeiros e capacidades de estádio são **estimativas de jogo** calibradas por simulação (`tools/simulate.js`), não números oficiais. Os elencos são **gerados** (nomes fictícios) — ver §9 para como encaixar jogadores reais.

---

## 1. Realidade histórica x o jogo

| Item | 1998 real | No jogo |
|---|---|---|
| Série A | 24 clubes, mata-mata final, campeão Corinthians | 20 clubes, pontos corridos ida e volta (38 rodadas) |
| Série B | 24 clubes (campeão Gama; Botafogo-SP também subiu) | 20 clubes, pontos corridos |
| Série C | ~66 clubes (campeão Avaí; São Caetano subiu) | 20 clubes, pontos corridos |
| **Série D** | **não existia** (criada só em 2009) | 20 clubes **ficcionais no formato**, com clubes reais de nível estadual |
| Moeda | Real (R$1 ≈ US$1) | R$ de 1998 |

Os 20 da Série A são clubes reais da Série A de 1998 (os 4 clubes menores foram cortados para chegar a 20). A Série B mistura rebaixados/subidos reais de 1997–98; C e D são sugestões minhas.

## 2. Os 80 clubes (dados completos em `data/clubs.js`)

**Série A:** Corinthians, Flamengo, Palmeiras, São Paulo, Vasco, Cruzeiro, Grêmio, Internacional, Atlético-MG, Santos, Botafogo, Bahia, Vitória, Portuguesa, Coritiba, Atlético-PR, Sport, Guarani, Paraná, Juventude.

**Série B:** Fluminense, Ceará, Fortaleza, Náutico, Santa Cruz, Goiás, Ponte Preta, Remo, Paysandu, Bragantino, Avaí, Criciúma, América-MG, Figueirense, Vila Nova, Sampaio Corrêa, Botafogo-SP, Atlético-GO, XV de Piracicaba, Gama.

**Série C:** Joinville, Londrina, CSA, América-RN, CRB, Mogi Mirim, São Caetano, Caxias, Treze, Volta Redonda, Campinense, Brasil de Pelotas, Juventus-SP, Confiança, Americano, Moto Club, Santo André, Operário-MS, Ituano, Central.

**Série D — 10 melhores (bloqueados no multiplayer):** Tupi, Ypiranga-RS, Villa Nova-MG, Ferroviário, Nacional-AM, Anápolis, Comercial-MS, Rio Branco-AC, Operário-VG, Itabaiana.

**Série D — 10 piores (sorteáveis):** Bangu, Madureira, Marília, Olaria, Sertãozinho, Rio Branco-ES, Tuna Luso, Colatina, Ceilândia, Guarany de Bagé.

Cada clube tem `prestigio` (1–100), que controla: nível do elenco, torcida, caixa inicial e valor de patrocínio. Estádios: nome real e capacidade aproximada.

## 3. Competições

### 3.1 Brasileirão A–D
20 clubes, todos contra todos em **ida e volta** (38 rodadas), 3 pontos por vitória. Critérios: pontos, vitórias, saldo, gols pró, confronto direto.
**Acesso/descenso: 4 sobem e 4 descem** entre divisões adjacentes (igual ao rebaixamento real de 4 na Série A de 1998). Todas as divisões jogam **no mesmo horário**; a tela de rodada mostra todos os placares ao vivo.

### 3.2 Copa do Brasil (mata-mata, ida e volta)
Na Copa real de 1998 jogaram 32 clubes; para incluir as 4 séries proposto:
- **Fase preliminar:** os 32 piores (20 da D + 12 piores da C) → 16 classificados.
- **64 clubes:** 48 que entraram direto (20 A, 20 B, 8 melhores da C) + 16 vindos da preliminar.
- Sorteio livre, ida e volta, 6 fases (64→32→16→8→4→final). Critério: gols totais, gol fora não conta (simples), depois **pênaltis**.
- Prêmio e bilheteria cheia para o clube menor quando enfrenta um grande em casa (o "sonho" do Brasfoot).
- **Campeão ganha vaga na Libertadores** (comprovado: o Palmeiras entrou na Libertadores de 1999 pela Copa do Brasil de 1998).

### 3.3 Libertadores 1998 → versão do jogo
Formato real de 1998 (confirmado): **20 clubes na fase de grupos (5 grupos de 4, 2 por país em 10 países — o México participava como convidado), 15 avançam, juntando-se ao campeão defensor num mata-mata de 16** (oitavas, quartas, semi, final ida e volta). Vasco foi o campeão de 1998 sobre o Barcelona-EQU (4–1 no agregado).
Vagas do Brasil: **campeão brasileiro + campeão da Copa do Brasil + campeão defensor**; se repetir, o vice. Os clubes estrangeiros estão em `data/foreign.js` (nota: o 2º clube peruano não foi confirmado, está como Sporting Cristal "?").
No jogo: com 6 jogos de grupo + 8 do mata-mata, os clubes brasileiros A–D que chegarem lá disputam com times de IA estrangeiros.
> Obs.: nas duas primeiras temporadas o Brasil jogará sem clubes da D/C, mas se um time subir de divisão e ganhar a Copa do Brasil pode se classificar — a regra é pela *competição*, não pela série.

### 3.4 Calendário sugerido
Domingo: Brasileirão (38 rodadas). Quarta: Copa do Brasil (preliminar + 6 fases × 2 jogos = 14 jogos) e Libertadores (14 jogos). Intervalos curtos (3 dias) tornam a **stamina** relevante. Estaduais ficam para uma expansão futura.

## 4. Jogadores

### 4.1 Posições
GOL, ZAG, LIB, LD, LE, VOL, MC, MEI, ALA, PD, PE, CA, SA. Elenco inicial de 24 (3 GOL, 4 ZAG, 2 LD, 2 LE, 3 VOL, 2 MC, 2 MEI, PD, PE, 3 CA, 1 SA).

### 4.2 Os 6 atributos (0–99)
`RIT` Ritmo · `CHU` Chute · `PAS` Passe · `DRI` Drible · `DEF` Defesa · `FIS` Físico.

O **overall** do jogador depende da posição (pesos somam 1):

| Pos | RIT | CHU | PAS | DRI | DEF | FIS |
|---|---|---|---|---|---|---|
| GOL | .05 | 0 | .10 | .15 | **.55** | .15 |
| ZAG | .05 | 0 | .08 | .07 | **.55** | .25 |
| LIB | .05 | 0 | .20 | .10 | .45 | .20 |
| LD/LE | **.20** | .03 | .15 | .12 | .35 | .15 |
| VOL | .07 | .05 | .18 | .10 | **.40** | .20 |
| MC | .07 | .10 | **.30** | .20 | .20 | .13 |
| MEI | .08 | .18 | **.30** | **.30** | .05 | .09 |
| ALA | .20 | .08 | .20 | .20 | .20 | .12 |
| PD/PE | **.28** | .17 | .15 | **.30** | 0 | .10 |
| CA | .12 | **.42** | .07 | .14 | 0 | .25 |
| SA | .18 | **.32** | .15 | .28 | 0 | .07 |

Ideia de balanceamento: cada posição "vive" de 2–3 atributos principais, então o jogador consegue ver *por que* um zagueiro de DEF 80 é melhor que um de DEF 60.

### 4.3 Fora de posição
O overall no slot é multiplicado por uma **afinidade**: mesma posição 1,00 · parecidas (ZAG↔LIB .97, LD↔LE .93, VOL↔MC .95, CA↔SA .95…) .85–.97 · mesmo setor .88 · setores vizinhos .78 · defesa↔ataque .65 · linha→goleiro **.25** · goleiro na linha **.35**. Assim o jogador "pode" improvisar um atacante de zagueiro, mas paga o preço.

### 4.4 Disciplina
`Fair player < De boa < Equilibrado < Porradeiro < Macetador`

| Nível | Multiplicador de faltas | Multiplicador de cartões |
|---|---|---|
| Fair player | 0,55 | 0,4 |
| De boa | 0,85 | 0,8 |
| Equilibrado | 1,00 | 1,0 |
| Porradeiro | 1,30 | 1,6 |
| Macetador | 1,70 | 2,4 |

### 4.5 Stamina (barra)
Cores: verde ≥90 · verde-claro 70–89 · amarelo 50–69 · laranja 20–49 · vermelho <20.
- **Gasto por jogo** = `26 − FIS × 0,13` pontos (FIS 99 ≈ −13; FIS 30 ≈ −22), ×1,10 se tática ofensiva, ×0,95 se defensiva.
- **Efeito no desempenho:** força × `0,70 + 0,30 × stamina/100` (stamina 0 = −30%, stamina 50 = −15%).
- **Recuperação:** `(6 + FIS × 0,08)` por dia de descanso (FIS 50 ≈ +10/dia → 3 dias entre jogos recuperam ~30). Lesionado recupera a 30% e só volta com `lesao = 0`.
- **Lesão:** no momento da lesão a stamina cai para ≤15. Probabilidade/minuto 0,00012 × (1,4 − FIS/200) → ~0,25 lesões por jogo; dura 1–8 jogos.

### 4.6 Moral (barra, mesmas cores)
Após cada jogo: `moral += (nota − 6,3) × 5`. Reserva que não joga perde ~1 ponto/jogo (tende a 50). Efeito: força × `0,95 + 0,10 × moral/100` (±5%) **e** multiplicador de evolução `0,6 + 0,9 × moral/100` (moral 100 = 1,5× mais fácil subir atributo; moral 0 = 0,6×). Três gols num jogo (nota ~9) → moral dispara.

### 4.7 Evolução e declínio de atributos
Após cada partida, cada jogador que atuou recebe XP: `Δ = nota − 6,3`.
- `Δ > 0`: `ganho = Δ × idade(1,6 até 19 anos … 0,05 após 33) × moral × 0,10`, com **retorno decrescente** (`(99 − atributo)/50`, mínimo 0,15 — subir de 85 para 86 é bem mais difícil que de 50 para 51).
- `Δ < 0`: `perda = Δ × 0,6 × 0,10` (cair é mais lento que subir, mas acontece com sequências ruins).
- O XP vai para os 6 atributos, **com bônus para o que o jogador fez**: gol → CHU/DRI, assistência/passes → PAS, desarmes/defesas → DEF. Cada 1,0 de XP vira **+1** no atributo.
- Então: time perdeu 0–2, mas o zagueiro fez muitos desarmes → nota alta → ele evolui, e **vê isso na tela de resumo**.
- **Fim de temporada:** jovens (≤21) ganham +1 aleatório; veteranos ≥31 perdem RIT/FIS mais rápido; quem jogou <5 jogos perde ritmo de jogo.

### 4.8 Nota da partida (0–10, 1 casa)
Base 6,0 + gol +1,1 · assistência +0,7 · desarme +0,18 · passe +0,035 · defesa do goleiro +0,35 · falta −0,12 · amarelo −0,5 · vermelho −2,0 · vitória +0,4 / derrota −0,4 · sem tomar gol (def/gol) +0,5 · tomar ≥3 gols −0,5. Quem jogou pouco tem a nota "puxada" para 6,0. Resultado da calibração (≈30 mil notas): p10 = 5,3 · mediana = **6,3** · p90 = 7,5.

## 5. Partida

Simulação minuto a minuto (90'). Só o placar e os eventos são mostrados (como Brasfoot/Elifoot), com velocidade ajustável.

- **Tática:** Ofensivo (ataque ×1,06, defesa ×0,94, mais lances) · Equilibrado · Defensivo (ataque ×0,94, defesa ×1,06, menos lances).
- **Formações:** 4-4-2, 4-3-3, 3-5-2, 4-5-1 — o humano pode colocar qualquer jogador em qualquer slot.
- **Mando:** controle do jogo +7% para o mandante (visita ganha ~34%, empate ~23%, casa ~43%).
- **"Forma do dia":** cada time sorteia ±3% de força por jogo, para dar zebra sem destruir a lógica.
- **Fluxo de um lance:** quem tem a bola ~ `controle^2,2` → chance de finalização = `0,48 + (ataque − defesa) × 0,0065` → chute no gol depende do CHU do finalizador → gol depende de `CHU` vs. goleiro (`DEF`) → defesa creditada ao goleiro; senão desarme creditado a um defensor/volante.
- **Substituições:** limite de **3** (regra de 1998) + opção "moderno" de 5; no intervalo ou pausando. Troca por lesão é automática se houver reserva e substituição disponível.
- **Intervalo:** placar, faltas, chutes, posse, cartões; moral/stamina/atributos de cada jogador.
- **Vermelho:** time joga com 10 (a força cai proporcionalmente, 10/11).

## 6. Calibração (resultado de `node tools/simulate.js 6`)

Parâmetros ajustados até a simulação de 1.520 jogos/temporada (4 séries) ficar assim:

| Métrica | Meta realista | Obtido |
|---|---|---|
| Gols/jogo | 2,4–2,9 | **2,5 – 2,9** |
| Mandante / empate / visitante | ~45 / 25 / 30 | **42 / 24 / 34** |
| Faltas/jogo | ~22 | **22,5** |
| Amarelos/jogo | ~3 | **3,0** |
| Vermelhos/jogo | ~0,1–0,2 | **0,19** |
| Lesões/jogo | ~0,2–0,3 | **0,25** |
| Força x posição final (ρ de Spearman) | 0,7–0,9 | **0,72 (C) – 0,95 (A)** |
| Overall médio das 4 divisões em 6 temporadas | estável | A 71→70, B 62, C 56, D 49→50 ✔ (sem inflação) |

Na versão inicial o projeto tinha 1,5 gol/jogo, 0,9 vermelhos/jogo e atributos subindo ~2 pontos por temporada para todo mundo; esses desvios foram corrigidos (§4.7 retorno decrescente e centragem da nota em 6,3).
**Atenção:** tudo isso é com técnico "automático". O humano que escala bem e gerencia stamina deve superar a IA — recomenda-se 3 níveis de dificuldade da IA (Fácil/Normal/Difícil: ±2 de overall nos adversários).

Nível médio do titular por divisão (11 melhores): **A ≈ 71 (64–77), B ≈ 62 (57–68), C ≈ 56 (53–59), D ≈ 49 (44–54)**.

## 7. Economia (valores em R$ de 1998 — estimativas)

### 7.1 Caixa inicial, torcida e TV por divisão
| Divisão | Caixa inicial médio | TV/federação (temporada) | Ingresso | Folha mensal média | Bilheteria anual média (19 jogos) |
|---|---|---|---|---|---|
| A | R$ 13,7 mi (11,2–15,6 mi) | 3,0 mi | R$ 15 | 229 mil | 5,5 mi |
| B | R$ 2,7 mi | 800 mil | R$ 9 | 63 mil | 1,1 mi |
| C | R$ 600 mil | 250 mil | R$ 6 | 26 mil | 320 mil |
| D | R$ 95 mil (74–114 mil) | 80 mil | R$ 4 | 14 mil | 95 mil |

`caixa = base_divisão × (0,4 + 1,2 × prestígio/100)`. Corinthians ≈ R$ 15,6 mi; Guarany de Bagé ≈ R$ 74 mil.

### 7.2 Público e bilheteria
`público = min(capacidade, demanda × (1 + 0,35×forma) × clássico × preço^−0,8)` e `renda = público × ingresso × 0,85`.
`demanda = 25 × prestígio^1,55 × fator_divisão` (Corinthians ≈ 30 mil, Bangu ≈ 1,4 mil, Guarany ≈ 350). Forma = últimos 5 jogos (−1..+1). Clássico ×1,25. Subir o ingresso 20% reduz o público ~15%.

### 7.3 Salários e transferências
- **Valor de mercado** = `15.000 × e^(0,14 × (ovr − 40)) × fator_idade` → ovr 40 ≈ 15 mil · 55 ≈ 120 mil · 65 ≈ 500 mil · 75 ≈ 2 mi · 85 ≈ 8 mi · 95 ≈ 33 mi.
- Fator idade: ≤20 ×1,35 · ≤23 ×1,20 · ≤27 ×1,00 · ≤30 ×0,80 · ≤33 ×0,50 · 34+ ×0,30.
- **Salário mensal** = 1,2% do valor (piso R$ 500), 13 pagamentos/ano. Contratos em temporadas.
- **Custos fixos anuais** (staff, manutenção, viagens): A 3,5 mi · B 600 mil · C 150 mil · D 30 mil.

### 7.4 Estádio
Ampliar custa **R$ 400 por lugar** (nível máx. 5, +60% da capacidade original). Só adianta se a demanda justificar — a capacidade só limita o público, não cria torcida. Séries D têm gargalo de demanda, não de lugar.

### 7.5 Dificuldade financeira da Série D (intencionalmente apertada)
Sem patrocínio, o clube médio de D tem saldo anual de **−R$ 5 mil a −84 mil**: o jogo obriga a **ir atrás de patrocinadores**, vender jogadores ou subir de divisão. Com 2 patrocinadores o saldo vira positivo. Na Série A todos têm saldo positivo (+0,9 a +2,6 mi sem patrocínio), mas gastam em jogadores caros.

## 8. Patrocinadores (`data/sponsors.js`)
30 patrocinadores fictícios em 12 categorias: refrigerantes, cervejas, bancos, varejo, material de construção, material esportivo, telefonia, alimentos, automóveis, energia/combustíveis, planos de saúde, rádio/TV/jornais (ex.: Guaraná Pampa, Cola Colinha, Banco do Sertão, Cimento Forte, Atleta Plus, TeleBrasa, PetroSul…).

- **Máx. 2 por clube; nunca duas empresas da mesma categoria.** (`podePatrocinar()` valida.)
- Cada um tem `minPrestigio` — os grandes só aceitam clubes maiores.
- **Valor anual** = `valorBase × fator_divisão(A 1 · B 0,25 · C 0,08 · D 0,025) × (0,3 + 0,9 × prestígio/100)`. Ex.: um patrocinador de R$ 6 mi paga ~R$ 5,5 mi ao Corinthians, ~R$ 190 mil ao Tupi (D) e uns R$ 20 mil a um sorteável da D.
- **Negociação:** o jogador envia propostas; chance de aceite = `0,25 + 0,5 × desempenho + (prestígio − mínimo)/200` (entre 5% e 95%). Bom desempenho na tabela aumenta as chances; contratos duram 1–2 temporadas.

## 9. Transferências e contratos
- Mercado de compra/venda estilo Brasfoot: lista de jogadores, filtros por posição/idade/overall, preço pedido = valor de mercado × (0,9–1,3 conforme interesse).
- Cada jogador tem **contrato (temporadas restantes) e salário** visíveis.
- Quem está com contrato terminando (último ano) **pode receber propostas de outros clubes** e pode ser negociado entre as partidas (como pedido). Sem contrato = agente livre, contratável sem taxa.
- A IA dos clubes grandes compra jogadores acima do nível do elenco, dentro do orçamento (caixa × 30%).
- **Jogadores reais de 1998:** o gerador cria nomes fictícios; para ter Rivaldo, Romário, Edmundo, Marcelinho Carioca etc., a abordagem recomendada é um arquivo `data/real-players.js` com ~10–15 craques por clube grande (atributos escritos à mão com base no overall esperado). Não tenho como validar elencos reais de 80 clubes sem fonte; deixei esse passo explícito.

## 10. Multiplayer (até 6 jogadores)
- Sorteio entre os **10 piores da Série D** (`selecionavel: true`); os 10 melhores da D ficam fora. Sem repetição de clube.
- **Autoritativo no servidor** (Node + WebSocket): o servidor tem a semente e roda a simulação; os clientes só enviam decisões (escalação, tática, substituições, ofertas).
- **Rodada síncrona:** a rodada só começa quando todos os humanos marcam "pronto" (ou estouram o tempo). As 4 divisões rodam no mesmo "relógio" (todas na mesma tela, placar ao vivo). Pausa de um humano congela a rodada para todos por até 30 s.
- Mercado compartilhado e leilão simultâneo para jogadores contestados.
- O motor já é determinístico: `RNG.create(seed)` garante reprodutibilidade.

## 11. Estrutura do projeto (já no repositório)
```
kfoot98/
  docs/GDD.md               este documento
  data/clubs.js             80 clubes (A–D), estádios, caixa, demanda
  data/sponsors.js          30 patrocinadores fictícios em 12 categorias
  data/foreign.js           19 clubes da Libertadores 1998
  engine/rng.js             aleatório com semente
  engine/players.js         atributos, overall por posição, afinidade, gerador de elencos
  engine/match.js           simulação da partida, notas, cartões, lesões, substituições
  engine/progression.js     evolução/declínio, moral, stamina
  engine/economy.js         valor, salário, bilheteria, estádio, patrocínio
  tools/simulate.js         simula temporadas inteiras e mede o balanceamento
```
Rodar a simulação: `node kfoot98/tools/simulate.js 6` (6 temporadas, semente opcional).

## 12. Roadmap sugerido
1. **Interface mínima:** tela de escolha de clube, escalação, rodada ao vivo (4 divisões), resumo pós-jogo com notas.
2. Calendário completo + promoção/rebaixamento + Copa do Brasil.
3. Mercado + contratos + patrocinadores + estádio.
4. Libertadores.
5. Jogadores reais de 1998 (`real-players.js`).
6. Multiplayer (servidor Node).
7. Expansões: estaduais, seleções/Copa do Mundo 98 (convite para treinar uma seleção).

## 13. Pendências / decisões em aberto
- Aceitar a Série D fictícia e a escolha dos clubes de C/D (sugestão minha).
- Confirmar o 2º clube peruano da Libertadores 1998 e as vagas exatas de Argentina/México.
- Regra de desempate e premiações em dinheiro (Copa/Libertadores) ainda não calibradas.
- Dificuldade da IA e agressividade do mercado.
