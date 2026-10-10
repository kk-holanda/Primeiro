# Medições da Melhorias #17: pênaltis, posições, mercado, equilíbrio de formações e táticas

Medidas feitas com o motor real do jogo em Node, sem a tela, antes (versão 20, publicada) e depois (esta versão, 21). "Antes" e "depois" usam as mesmas sementes sempre que possível. Os erros padrão estão ao lado dos números quando importam. Os scripts ficam na pasta `scripts-17` do projeto (`pen16.js`, `shoot16.js`, `alt16.js`, `price16.js`, `div16.js`, `eq16.js`, `eqrep.js`, `f16.js`, `tuneform.js`, `tunetat.js`, `sub16.js`, `moral16.js`, `style16.js`, `w16.js`).

## 1. Pênaltis: batedor, goleiro, moral, cansaço e mando

Os pênaltis do jogo e as disputas da Copa passam pelo mesmo cálculo. Considera, do batedor: finalização e bola parada, stamina e moral; do goleiro: defesa, stamina e moral. O mando entra para os dois lados: o time de casa ganha um empurrão pequeno, o de fora sofre um fator negativo maior. O peso do mando é reduzido quando a moral individual e a do time estão altas (batedor de fora com moral e time em baixa tem a pior penalidade; o goleiro de moral baixa, com time de moral baixa e jogando fora, soma os três fatores contra ele).

Taxa de gol por cobrança (40 mil cobranças por linha; batedor 70 de finalização contra goleiro 70, moral 60, stamina 100, quando não dito o contrário):

| Situação | Gol |
|---|---|
| Referência, sem mando | 76,8% |
| Batedor em casa | 79,4% |
| Batedor fora | 74,7% |
| Batedor fora, moral dele e do time 20 | 71,5% |
| Batedor fora, moral dele e do time 90 | 77,4% |
| Batedor em casa, moral 20 / moral 90 | 76,3% / 81,9% |
| Goleiro fora (batedor em casa), moral dele e do time 20 / 90 | 81,5% / 78,0% |
| Goleiro em casa (batedor fora), moral 20 / 90 | 77,0% / 73,0% |
| Finalização do batedor 40 / 70 / 95 | 72,4% / 79,5% / 84,8% |
| Defesa do goleiro 40 / 70 / 95 | 83,6% / 79,8% / 76,1% |
| Stamina do batedor 100 / 50 / 20 | 79,5% / 77,6% / 76,6% |
| Stamina do goleiro 100 / 50 / 20 | 79,2% / 79,8% / 80,5% |
| Pior cenário (batedor fraco, fora, moral 20, stamina 40 contra goleiro forte em casa) | 60,8% |
| Melhor cenário (batedor forte em casa, moral 90, contra goleiro fraco, fora, moral 20) | 90,6% |

A taxa média nos jogos continua perto de 75% a 77%. Disputa de pênaltis da Copa (3 mil disputas por linha; o time da volta joga em casa, os batedores são os 10 melhores de linha e o melhor goleiro):

| Situação | Vence o mandante |
|---|---|
| Times iguais, moral 65 | 58,4% |
| Visitante com moral 90 e mandante com 30 | 45,2% |
| Visitante com moral 30 e mandante com 90 | 71,0% |
| Visitante bem melhor (80 × 45) | 50,7% |
| Visitante bem pior (45 × 80) | 68,5% |

Antes era uma moeda com 76% fixo por cobrança: sem diferença entre times, moral ou mando.

## 2. Posições secundárias

- 46% dos jogadores de linha nascem com pelo menos uma posição extra, e 10% com duas. Goleiro não tem.
- As posições extras saem das vizinhas: zagueiro (líbero, volante, lateral), líbero (zagueiro, volante), lateral (outro lateral, ala, zagueiro, ponta), volante (zagueiro, meia central, líbero), meia central (meia ofensivo, volante, ala), meia ofensivo (meia central, segundo atacante, pontas), ala (laterais, meia central, pontas), pontas (outro ponta, lateral, ala, centroavante), centroavante (segundo atacante, pontas) e segundo atacante (centroavante, meia ofensivo, pontas). Os atributos do jogador influenciam o sorteio (um meia central com muito chute tende a ter meia ofensivo).
- Na posição extra o rendimento é 98,5% do que os atributos valem lá. Fora das posições extras a penalidade ficou menor entre posições parecidas:

| Natural → posição | Antes | Depois |
|---|---|---|
| MC → MEI | 0,95 | 0,96 |
| MC → SA | 0,78 | 0,88 |
| VOL → ZAG | 0,88 | 0,94 |
| PD → LD | 0,65 | 0,90 |
| CA → PD / PE | 0,88 | 0,90 |
| ZAG → LD | 0,85 | 0,90 |
| LD → PD | 0,65 | 0,90 |
| MEI → CA | 0,78 | 0,80 |
| ZAG → CA | 0,65 | 0,65 |
| GOL → ZAG | 0,35 | 0,35 |

- Efeito na média do time titular escalado automaticamente (300 elencos): +0,04 ponto com todos disponíveis e +0,01 com os 3 melhores lesionados. As posições extras ajudam mais quem monta o time à mão e quando falta gente numa posição; o jogo não fica mais fácil por causa delas.
- Na tela: a coluna Pos mostra a natural e as extras (por exemplo CA/PD), o mouseover explica, a ficha mostra "Também joga de" com a média em cada uma, o campo da escalação mostra "também joga aqui" e o mercado mostra as posições extras do jogador.

## 3. Preços e salários

Valor de mercado: +13% para o mesmo jogador (de 15 mil para 17 mil na base da curva). Salário mensal: +10% (a taxa sobre o valor foi de 1,20% para 1,17%, e o valor subiu). As luvas de livres seguem o salário. A folha mensal média por clube, com elencos novos: A R$ 405 mil → 462 mil, B 78 → 88 mil, C 28,2 → 30,8 mil, D 14,9 → 16,4 mil.

Efeito no mercado (480 jogadores por divisão): com caixa de R$ 100 mil, os jogadores acessíveis da C caíram de 255 para 240 e os da B de 176 para 151, e nenhum da A cabe (antes 4). Com R$ 540 mil, B acessíveis 417 → 397, A 174 → 159.

Mundo de 8 anos sem humano (mesma semente): caixa médio da A (milhões) 24,0 → 21,7, B 7,6 → 7,9, C 3,1 → 3,0, D 1,2 → 1,0; clubes com caixa negativo no ano 8: 0 → 3 em 80. O sumidouro de caixa investe menos (R$ 415 milhões acumulados contra 499). A média dos 14 melhores segue estável (A 72,7, B 62,8, C 57,4, D 49,2 contra 72,6 / 61,8 / 55,5 / 48,9).

## 4. Tela do Mercado

- Abre com "Só o que cabe no caixa" ligado.
- Nova coluna Δ: média do jogador menos a do titular atual mais fraco da posição dele no seu time (leva em conta quantas vagas a formação tem na posição). Verde positivo, vermelho negativo.
- Ordem padrão: "Melhora para o meu time". Outras: melhor custo-benefício (Δ por peso do preço), maior média, mais barato, mais jovem, maior valor. Também continua valendo clicar nos títulos das colunas (agora inclui os seis atributos).
- Novos filtros: idade máxima e "Só quem melhora meu time".
- A tabela ficou como a do plantel: faixa da cor do clube no alto, cabeçalho e coluna do nome fixos, rolagem própria (altura limitada à tela) e destaque da linha ao passar o mouse.
- Rolagem: ao abrir e fechar uma proposta, ou ordenar, a tabela mantém a posição vertical e horizontal (antes voltava ao topo).

## 5. Gols nas divisões baixas

Simulação de turno e returno completos (6 campeonatos por divisão, elencos gerados, 4-4-2 equilibrado):

| Divisão | Gols por jogo (antes → depois) | 0×0 (antes → depois) |
|---|---|---|
| A | 2,62 → 2,60 | 7,2% → 6,9% |
| B | 2,26 → 2,61 | 8,2% → 7,1% |
| C | 2,05 → 2,57 | 12,1% → 7,4% |
| D | 1,95 → 2,49 | 15,1% → 9,0% |

Como: o nível médio dos 22 em campo, quando fica abaixo de 72, soma chances de finalização, finalizações no gol e conversão (times piores erram mais, nos dois lados). Na A o ajuste é zero. Também subi a base de finalização na jogada (a defesa ficou mais forte, ver seção 7).

## 6. Série B mais nivelada

O elenco inicial da B passou a ser comprimido para a média da divisão (fator 0,70, como a A com 0,35). 14 campeonatos completos de Série B:

| Medida | Antes | Depois |
|---|---|---|
| Desvio da força (média dos 14 melhores) entre os clubes | 2,7 | 2,0 |
| Correlação força × pontos | 0,86 | 0,80 |
| Campeão = o clube mais forte | 12 de 14 (86%) | 7 de 14 (50%) |
| Campeão entre os 3 mais fortes | 14 de 14 | 13 de 14 |
| Gols por jogo | 2,29 | 2,59 |

## 7. Recalibração do overall (Média) e da defesa

- Pesos do overall: menos Físico e Defesa nos zagueiros e laterais, mais Passe; mais Finalização nos meias; menos Físico nos atacantes. Exemplo do zagueiro (RIT, CHU, PAS, DRI, DEF, FIS): de 5/0/8/7/55/25 para 7/2/16/8/50/17.
- No motor: o marcador pesa mais na conversão do chute (de 0,30 para 0,42 por ponto de defesa) e o setor defensivo do confronto de forças usa mais os zagueiros (de 72/10/18 para 76/8/16 entre defensores, meias e goleiro).
- Medição: +12 em um atributo de todos os jogadores de um setor (4-4-2 equilibrado, 3 mil jogos por linha, erro padrão cerca de ±0,034). Saldo de gols por jogo, antes → depois:

| Setor | RIT | CHU | PAS | DRI | DEF | FIS |
|---|---|---|---|---|---|---|
| Defesa (4) | 0,15 → 0,14 | 0,09 → 0,08 | 0,20 → 0,25 | 0,10 → 0,07 | 0,22 → **0,26** | 0,11 → **0,13** |
| Meio (4) | 0,04 → **0,07** | 0,10 → **0,19** | 0,18 → 0,12 | 0,10 → **0,15** | 0,06 → 0,06 | 0,03 → **0,07** |
| Ataque (2) | 0,05 → **0,10** | 0,35 → 0,28 | 0,02 → 0,06 | 0,11 → 0,11 | −0,03 → −0,01 | 0,01 → 0,04 |
| Goleiro (Defesa) | 0,12 → **0,14** | | | | | |

O retorno por ponto de overall ficou mais parecido entre os caminhos: Defesa dos defensores 0,040 → 0,053 gol por ponto de overall, Físico dos defensores 0,046 → 0,072, Físico dos meias 0,015 → 0,045, Finalização dos meias 0,105 → 0,145 e a Finalização dos atacantes, que era o atributo que mais rendia por ponto de overall, caiu de 0,078 para 0,060. Os números têm erro de cerca de ±0,034 por célula, então só as diferenças grandes (meias em Finalização e Físico, defensores em Físico) são confiáveis.

## 8. Formações e táticas

24 combinações (6 formações × 4 táticas) cada uma contra as outras 23, elencos de prestígio 60 sorteados e espelhados, 40 duplas por par (erro padrão cerca de ±0,03 ppg por combinação):

| | Antes | Depois |
|---|---|---|
| 3-4-3 | 1,434 | 1,389 |
| 3-5-2 | 1,316 | 1,370 |
| 4-5-1 | 1,345 | 1,363 |
| 4-2-3-1 | 1,310 | 1,360 |
| 4-4-2 | 1,366 | 1,359 |
| 4-3-3 | 1,349 | 1,348 |
| Amplitude entre formações | 0,124 | 0,041 |
| Equilibrado / Defensivo / Ofensivo / Contra (ppg médios) | 1,381 / 1,363 / 1,338 / 1,330 | 1,362 / 1,385 / 1,355 / 1,358 |
| Amplitude entre táticas | 0,051 | 0,030 |
| Amplitude melhor × pior combinação | 0,219 | 0,104 |

A vantagem do 3-4-3 vinha da estrutura e não só dos modificadores: com ataque e defesa neutros ele ainda ficava +0,12 de saldo de gols por jogo sobre o 4-4-2 (800 jogos). O modificador dele agora é defesa −14% e ataque +0,8% (antes ataque +9%, defesa −6%); 4-3-3 (defesa −6%), 4-5-1 (defesa +6,6%), 4-2-3-1 e 3-5-2 também foram ajustados. Os valores foram ajustados por simulação (varredura automática com 600 a 1.200 duplas por rodada). A tática "contra" deixou de ser a pior (de 1,330 para 1,358) e continua com sua vantagem sobre o ofensivo; ela ainda perde para o defensivo (1,39 ppg na matriz).

Para a previsibilidade: a sinergia (jogadores certos nas posições que a tática pede) continua dependendo dos jogadores escalados, o intervalo continua respondendo à tática do adversário e os técnicos do computador têm formações preferidas por personalidade (ofensivista 4-3-3, 3-4-3 e 4-2-3-1; retranqueiro 4-5-1, 3-5-2 e 4-4-2; professor 4-2-3-1, 4-4-2 e 4-3-3), em 45% dos jogos, sem virar regra.

## 9. Moral dos clubes do computador

Clubes do computador agora recuperam moral após cada jogo (12% da distância até 55 e mais 0,4) e têm piso de 30. Moral média dos 14 principais jogadores no terço de baixo da tabela, em 30 rodadas:

| Divisão | Antes | Depois |
|---|---|---|
| A | 57 | 64 |
| B | 56 | 66 |
| C | 61 | 63 |
| D | 54 | 62 |

Pior moral individual de um clube da D na rodada 30: 34 → 54. A moral do técnico no fundo da tabela da D continua baixa porque ela mede resultados, não elenco.

## 10. Pernas frescas e cansaço

Bônus de quem entra: 10% por 30 minutos → 15% por 40 minutos. A perda de força com a stamina ficou quadrática (piso de 0,55 em vez de 0,70, com curva que pune mais quem está abaixo de 70). As 3 trocas automáticas de um time (stamina entre 70 e 100 no início, 3000 jogos): 0,03 ± 0,02 → **0,09 ± 0,02** pontos por jogo. A produção de gols caiu um pouco com mais cansaço e foi compensada subindo os ataques por minuto de 0,52 para 0,56.

## 11. Técnicos do computador: nome, estilo escondido e dicas

- Todo clube mostra o nome do técnico (tabela, ficha do clube e plantel). O estilo não aparece mais em lugar nenhum.
- Cada técnico é observado jogo a jogo (tática e formação, jovens no time, mudança no intervalo e treinos), inclusive os humanos. A memória decai 3% por jogo.
- Depois de 8 jogos aparece uma dica no mouseover; entre 8 e 19 jogos é só "talvez ele seja do tipo que...", entre 20 e 39 vem "parece ser do tipo que..." mais uma segunda dica, e a partir de 40 jogos "provavelmente é do tipo que...". Nunca afirma. Cada técnico tem um ruído fixo que diminui com os jogos, então a impressão inicial pode errar.
- Acerto da primeira dica contra o estilo real (80 clubes, 1998): 8 jogos 59%, 12 jogos 65%, 20 jogos 75%, 30 jogos 79%; o estilo real aparece entre as duas dicas em 81%, 86%, 90% e 96% dos casos. Em 1999 e 2000, com a memória do ano anterior, 70% a 80%.
- O estilo do técnico do computador muda com o tempo: no fim de cada temporada ele troca com chance de 10% (mais 22 pontos para rebaixados, mais 8 para o terço de baixo; menos 5 para campeões e promovidos); 10 a 12 clubes em 80 mudam por ano.
- O estilo do humano é lido do que ele faz e muda com o jeito de jogar: aparece em "Seu estilo" no plantel, também com mouseover. Ele ainda não dá efeito nenhum (os traits ficam para uma próxima rodada). Na demissão o histórico do humano o acompanha ao novo clube.

## 12. Estatísticas gerais por jogo (prestígio sorteado de 40 a 90)

| Medida | v20 | v21 |
|---|---|---|
| Gols | 2,67 | 2,82 |
| Chutes | 22,0 | 24,1 |
| Chutes no gol | 9,2 | 10,0 |
| Escanteios | 5,95 | 6,39 |
| Gols de cabeça | 0,37 | 0,42 |
| Gols de falta | 0,21 | 0,22 |
| Pênaltis convertidos | 0,27 | 0,24 |
| Vitória casa / empate / fora | 44% / 19% / 37% | 44% / 23% / 33% |
| Faltas | 21,1 | 21,4 |

## 13. Fora desta rodada

Foram deixados de fora, como o KK pediu: o computador comprando e vendendo entre si (proposta 4), mostrar o efeito do Físico na ficha (proposta 12) e os traits de técnicos e jogadores, que ficam para depois.
