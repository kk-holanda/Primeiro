# Relatório 23 — Como o jogo trata moral, disciplina, pressão na saída, zonas e contratos

> **Nota sobre a versão:** as medições abaixo foram feitas na v36, antes das mudanças da Melhorias #33 (v37). Na v37 já mudaram os pontos 1 e 2: a moral após o jogo variou menos (nota × 3 em vez de × 5), a moral do técnico passou a contagiar o elenco de todos os clubes (não só dos humanos) e os reservas passam a perder menos moral quando o técnico está com moral alta e o time está bem colocado. Em simulação, os reservas dos 4 primeiros colocados passaram de cerca de 62 para cerca de 72 de moral. Os pontos 3 a 6 continuam como descritos.

Base: cópia de `/tmp/claude-0/lab/game.html` (leitura do código e medições em Node, sem alterar o jogo). Todas as simulações usaram elencos reais gerados pelo jogo, escalação automática, estilo "Posição" e formação 4-4-2, salvo quando dito o contrário. Os números são médias de centenas ou milhares de partidas.

---

## 1. Influência da moral dos jogadores nas partidas

### Como funciona hoje

A moral (0 a 100) entra no motor de partida (`bf.Match`) em poucos lugares:

| Onde | Função / constante | Efeito |
|---|---|---|
| Força de cada jogador | `mMoral(m) = 0.95 + 0.10 * m/100`, usado em `forca()` | Moral 0 = x0,95; moral 100 = x1,05. Vale para ataque, defesa e controle do time (variação total de 10%). |
| Finalização, cabeçada, marcação, passe final, escanteio, cobrança de falta | `efM(j) = mStam * mMoral` | O mesmo fator de 0,95 a 1,05 multiplica o atributo usado em cada lance. A finalização ainda é ampliada (`ef = 50 + (ef-50)*1.6`), então a diferença de moral pesa mais do que parece. |
| Pênalti | `penNota`, `penaltiResultado` | Moral do batedor: chance de errar muda -0,08 ponto por ponto de moral acima de 60. Moral do goleiro: `0.85 + 0.3*moral/100` na defesa. Ordem de batedores nas disputas usa `penNota` (30% do peso é moral). |
| Mando de campo | `ajusteMando(casa, moralInd, moralTime)` | Em casa: +1,2% x (0,5 + m). Fora: -2% x (1 - 0,8 m). Quanto maior a moral média, menos o time sofre fora e mais ganha em casa. |
| Capitão | `forcas()` (`capK`) | Ataque e defesa x(1,004 + 0,008 x (moral do capitão - 60)/40), de 0,996 a 1,012. `capNota` usa moral para a escolha automática do capitão. |
| Líder nato | `passo()` aos 46' | Se o capitão for "Líder" e o time perde no intervalo, todos ganham +5 de moral. |
| Evolução de atributos | `aplicarPosJogo` | `moralMult = 0.6 + moral/100*0.9`: moral 100 faz o jogador ganhar atributo 1,5x mais rápido; moral 0, 0,6x. Também influencia treino (`ganhoEsperado`, 0,75 a 1,25x) e salário esperado na renovação. |

Não existe efeito da moral sobre faltas, cartões, lesões ou desarmes de forma direta (só via o fator 0,95 a 1,05 nos atributos).

Como a moral muda:
- Titular após o jogo (`aplicarPosJogo`): moral += (nota - 6,3) x 5. Vitória soma +0,4 na nota (= +2 de moral), derrota tira 2. Gol soma 1,1 na nota (= +5,5), amarelo tira 0,5 (= -2,5), expulsão tira 2 (= -10).
- Reserva que entra: ganha +3 e perde só metade se for mal (x2,5 em vez de x5), com piso de 40 (`Math.min(p.moral, 40)`).
- Reserva que não entra: `semJogar`: moral += (50 - moral) x 0,04 - 1, com piso em min(moral, 40). Ou seja, perde cerca de 1 ponto por jogo e é puxado para 50.
- Clima do vestiário (só clube humano): `moralTreinador()` soma (moral do técnico - 50) x 0,02 a TODO o elenco a cada jogo (de -1,0 a +1,0).
- Treino: cada jogo de treino custa de -3 a -5 de moral (`TREINO_CFG.moralJogo`).
- Conversa do técnico (`conversar`): +3 a +9 (motivar), +1 a +3 (elogiar), +6 ou -4 (cobrar), com espera de 4 jogos. "Bicho" (prêmio por vitória): +2 x nível (1 a 3) a todos por vitória, custa nível x R$ 8.000/3.000/1.200/400 (Série A/B/C/D) x 16.
- Caixa negativo: -3 por rodada a todos. Início da temporada (`virarTemporada`): TODOS voltam para 60 + prêmios de acesso/rebaixamento (+12 / -10).
- Clubes do computador: depois de cada jogo, quem está abaixo de 55 sobe 12% da distância + 0,4, com piso 30 (linha "a diretoria e o técnico conversam por ele").

### Impacto medido

Mesmo elenco (cada clube da Série A contra si mesmo, mando alternado, 3.000 jogos por linha). A coluna "Saldo" é o saldo médio de gols por jogo do time A.

| Moral A x B | V / E / D do time A | Saldo de gols/jogo | Pontos/jogo de A |
|---|---|---|---|
| 60 x 60 (controle) | 34,9 / 30,5 / 34,6 | +0,01 | 1,35 |
| 60 x 30 | 44,0 / 28,3 / 27,8 | +0,30 | 1,60 |
| 90 x 60 | 43,2 / 29,6 / 27,2 | +0,30 | 1,59 |
| 90 x 30 | 50,7 / 28,0 / 21,3 | +0,55 | 1,80 |
| 100 x 0 | 61,7 / 23,9 / 14,4 | +0,91 | 2,09 |

Leitura: cada 30 pontos de moral valem cerca de +0,3 gol por jogo e +0,25 ponto por jogo. Um time com moral 90 contra outro idêntico com moral 30 vence 50,7% e perde 21,3%. É um efeito grande para um fator que a tela quase não destaca. Na prática, titulares ficam entre 70 e 92 e reservas entre 40 e 60 (ver seção 2), então o efeito real é um time "forte moralmente" contra outro fraco: a moral média do XI importa mais do que a dos reservas.

### Problemas ou lacunas que encontrei

- O efeito da moral é cumulativo em vários lances e o jogador não vê isso explicado (só o multiplicador de 0,95 a 1,05 aparece no código). Uma moral média alta ou baixa decide jogos parecidos.
- A única forma de a moral cair por resultado é via nota individual do titular. Perder de 0 a 5 com boa nota individual não derruba a moral.
- A moral zera a cada temporada (volta a 60), então o ciclo "ganhando, moral alta" não atravessa o ano.

---

## 2. Influência da moral do técnico sobre o time

### Como funciona hoje

A moral do técnico (`g.moralTreinador[clube].v`, 0 a 100, começa em 60) muda em `moralTreinador()`:
- Vitória: +8 + `clamp(dif_prestígio/8, -4, 6)` + min(3, saldo-1). Derrota: -8 + `clamp(dif/10, -3, 3)`. Empate: `clamp(dif/10, -3, 3)`.
- Fim de ano: "melhor técnico" +`tecMoral`, acesso +15, rebaixamento -12. Caixa negativo: -2 por rodada. Bicho: +nível por vitória.
- Abaixo de 20 por 12 jogos seguidos com o clube na zona de rebaixamento: o humano é demitido (`demitir`).

O que o valor do técnico faz de fato (busquei todas as referências a `moralTreinador`):
1. Clima do vestiário: só para clube humano, soma (v - 50) x 0,02 à moral de todos os jogadores, a cada jogo. Máximo +1,0 por jogo (técnico 100), mínimo -1,0 (técnico 0).
2. Tamanho da conversa do técnico (`conversar`): `k = clamp(0.5 + v/100, 0.5, 1.4)` e a chance de a conversa cair mal depende de v.
3. Demissão (acima).

Não existe nenhum efeito da moral do técnico no motor da partida, nem no treino, nem nos clubes do computador (eles têm o valor, mas ele não faz nada além de aparecer na tela).

Por que reservas ficam com moral baixa mesmo com o time indo bem (fórmulas):
- `semJogar` tira cerca de 1 ponto por jogo de todo reserva que não entra (e puxa para 50). O clima do técnico soma no máximo +1,0 (técnico 100). Contas: moral de equilíbrio de um reserva parado = 25 + 0,5 x (técnico - 50), com piso de `semJogar` em 40. Técnico 100: equilíbrio perto de 50. Técnico 90: perto de 45. Técnico 50 ou menos: cai até o piso de 40 (e, abaixo de 40, o clima negativo ainda empurra para baixo, até chegar perto de 16 com técnico 0 em 40 jogos).
- Quem entra no segundo tempo ganha +3, mas só se de fato jogar. O banco de 7 só renova 3 vagas no máximo; os outros ~6 reservas do elenco de 24 quase nunca entram.
- Para o computador não existe esse problema: ele tem a "conversa automática" que puxa cada um a 55 (piso 30) após cada jogo. Por isso reservas do computador ficam em ~62 a 66, e os do humano em ~40 a 60.
- O pico de moral dos titulares (até 92) vem da nota (gols, vitórias), que o reserva parado não recebe.

### Impacto medido

Clube humano (Flamengo, seed 1 e 2; a escalação é automática e fixa nos testes, então a posição final varia), moral do técnico forçada em valor fixo durante os ~42 jogos. Média de 2 temporadas. "Reservas fim" = média dos jogos 21 a 42.

| Técnico (fixo) | Titulares | Reservas (média) | Reservas fim | Reservas no jogo 40 |
|---|---|---|---|---|
| 0 | 67,3 | 45,0 | 40,6 | 36,9 |
| 25 | 72,9 | 46,1 | 39,9 | 34,2 |
| 50 | 77,6 | 50,3 | 44,6 | 43,5 |
| 75 | 83,7 | 56,9 | 53,2 | 48,0 |
| 100 | 86,9 | 61,5 | 59,0 | 57,2 |

Caso real da hipótese do KK (Flamengo seed 2, ficou em 1º lugar a temporada inteira, técnico médio 90): titulares 92,3, reservas 63,9 (média) e 54,9 no jogo 40. Seed 1 (Flamengo na 6ª posição, técnico ~57): titulares 79,5, reservas 53,1 e 48,5 no fim.

Simulação analítica de um reserva que nunca joga (moral inicial 70, usando `semJogar` e o clima do técnico):

| Técnico | Jogo 5 | Jogo 10 | Jogo 20 | Jogo 40 |
|---|---|---|---|---|
| 0 | 57,3 | 46,9 | 34,0 | 16,3 |
| 50 | 61,7 | 54,9 | 44,9 | 40,0 |
| 90 | 65,2 | 61,4 | 55,6 | 49,2 |
| 100 | 66,1 | 63,0 | 58,3 | 53,1 |
| Computador (sem técnico) | 61,7 | 55,0 | 51,6 | 50,8 |

Clubes do topo (computador, Corinthians e Palmeiras em 3 seeds): top 11 por overall ~76 a 88 de moral; resto do elenco ~62 a 66; o técnico estava em 73 a 84.

Conclusão: o técnico tem efeito, mas pequeno e só para o humano. De 0 a 100 de moral do técnico a moral média dos reservas varia de 45 para 61 (cerca de 16 pontos ao longo de uma temporada), e a dos titulares de 67 para 87, mas boa parte da diferença dos titulares vem de ganhar jogos, não do técnico. A hipótese do KK (técnico alto e time bem não deixa reserva cair) não está implementada: o -1 por jogo do `semJogar` é do mesmo tamanho do máximo que o técnico dá.

### Problemas ou lacunas que encontrei

- O clima do técnico (±1,0 por jogo, só humano) não consegue compensar o -1 de `semJogar`. Com técnico 100, o reserva ainda perde pontos até ~50; com técnico 50 vai a 40.
- Assimetria injusta entre humano e computador: o computador recebe a "conversa automática" (rumo a 55, piso 30); o humano precisa gastar conversas (cooldown de 4 jogos, 1 por vez), bicho (dinheiro) ou escalar o jogador.
- A moral do técnico não tem efeito algum em partidas, treino ou clubes do computador; só é exibida. Em todos os clubes do computador o valor muda mas nunca é usado.
- Piso de 40 do `semJogar` só vale para ele: o clima negativo de técnico baixo, o treino (-3 a -5 por jogo) e o caixa negativo (-3 por rodada) passam por baixo dele.
- A moral reseta para 60 em todas as temporadas, apagando o histórico.

---

## 3. As 5 disciplinas dos jogadores

### Como funciona hoje

Campo `p.disciplina` (0 a 4), nomes em `Players.DISCIPLINAS`: Fair player, De boa, Equilibrado, Porradeiro, Macetador. Sorteado na criação (`gerarJogador`): 10%, 25%, 35%, 20%, 10%. Zagueiros e volantes têm 40% mais chance de serem Porradeiro/Macetador. Não muda ao longo da carreira.

Multiplicadores (`DISC_FALTA`, `DISC_CARTAO`):

| Disciplina | Faltas | Cartões |
|---|---|---|
| Fair player | x0,55 | x0,4 |
| De boa | x0,85 | x0,8 |
| Equilibrado | x1,0 | x1,0 |
| Porradeiro | x1,3 | x1,6 |
| Macetador | x1,7 | x2,4 |

Onde entram no motor (`bf.Match`):
- Falta no duelo drible x marcação: `P(falta) = clamp(0.053 + (drible - marcação) x 0.002, 0.01, 0.15) x DISC_FALTA[marcador]` (x0,6 se for Desarmador, etc.). A falta na área vira pênalti (atacante 24%, meia 11%, zagueiro 2% de chance).
- Faltas aleatórias do minuto (`faltaBase 0.125 x 1.7`): o autor é sorteado com peso `DISC_FALTA x (1,2 - DEF/300)` (atacantes x0,6; o goleiro também pode ser sorteado). O NÚMERO total de faltas quase não muda: só quem as comete muda.
- Pênalti sem drible: autor sorteado com o mesmo peso.
- Cartão (`cometerFalta`): `P(amarelo) = 0.105 x k x DISC_CARTAO x (0.6 se já tem amarelo) x calma do capitão (0.85) x (Gelo 0.55)`. Vermelho direto: `0.0005 x DISC_CARTAO`. Segundo amarelo = vermelho.
- Gravidade da suspensão (`jogosSuspensao`): quem tem cartão >= 1,6 (Porradeiro/Macetador) pega 1/2/3 jogos com 10/40/50%; Fair e De boa 35/50/15%; os demais 20/50/30%.
- Característica Desarmador só aparece em Fair player ou De boa.

Lesão do adversário que sofre a falta: NÃO existe. A lesão (`passo()`) é sorteada por jogador a cada minuto, só com `lesaoPorJogadorMin`, FIS, stamina e idade. Falta, cartão e disciplina não entram no cálculo.

### Impacto medido

2.000 partidas por linha: time A (Equilibrado) contra um time B inteiro de uma única disciplina. Números por jogo.

| Disciplina de B | Faltas de B | Amarelos de B | Vermelhos de B | Pênaltis a favor de A | Lesões de A | Lesões de B | Gols de A |
|---|---|---|---|---|---|---|---|
| Fair player | 10,10 | 0,37 | 0,006 | 0,10 | 0,035 | 0,036 | 1,20 |
| De boa | 10,36 | 0,75 | 0,018 | 0,14 | 0,035 | 0,036 | 1,22 |
| Equilibrado | 10,45 | 0,94 | 0,028 | 0,16 | 0,036 | 0,036 | 1,23 |
| Porradeiro | 10,69 | 1,56 | 0,072 | 0,19 | 0,040 | 0,036 | 1,26 |
| Macetador | 11,12 | 2,39 | 0,151 | 0,23 | 0,038 | 0,035 | 1,31 |

Leitura: de Fair player para Macetador as faltas sobem só 10% (10,1 para 11,1), os amarelos 6x (0,37 para 2,39), os vermelhos 25x (0,006 para 0,151) e os pênaltis a favor do rival mais que dobram (0,10 para 0,23). O adversário marca +0,11 gol por jogo (1,20 para 1,31) quando B é todo Macetador, mas o time B também fica com 10 em campo em 15% dos jogos. As lesões do adversário ficam em ~0,036 por jogo para qualquer disciplina (a pequena variação é ruído).

### Problemas ou lacunas que encontrei

- Disciplina não afeta a lesão de quem recebe a falta, nem o tipo de lesão: lesões são aleatórias e independentes. Jogar com "brucutus" nunca machuca o adversário.
- O número de faltas quase não depende da disciplina (só +10%), pois a frequência vem de uma constante global; o que muda de verdade é quem leva cartão.
- Cartão por jogo (Macetador 2,4 por jogo para o time inteiro) indica que um time de Macetadores é punido principalmente por suspensões e expulsões, mas não paga outro preço (moral, lesão provocada).
- Não há faltas "violentas" separadas das comuns: gravidade só via cartão.

---

## 4. Roubada de bola pelos atacantes pressionando a saída de zagueiros e goleiros

### Como funciona hoje

Não existe um evento "roubada na saída de bola" no motor. O que existe é um termo abstrato, em `duelo(Fa, Fd)`, que reduz a chance de chute do time que tenta sair jogando:

`chute -= 0,110 x press_do_defensor x build_do_atacante x (1 + 0,6 x perda_do_atacante)`
`chute += 0,055 x press_do_defensor x dir_do_atacante` (bola longa passa por cima da pressão)

(`MU.pb = 0.110`, `MU.pd = 0.055`; o resultado final do duelo é limitado a ±0,09 sobre uma chance base de chute de cerca de 0,38 por ataque.)

- `press` (quanto o estilo pressiona): Gegenpressing 1,0; Linha Alta 0,6; Posição 0,4; Relacionismo 0,3; Vertical 0,3; Saída Curta 0,2; Direto 0,2; Corredores 0,1; Reativo e Retranca 0. Vem só do estilo (e do estilo secundário, misturado).
- `build` (quanto o estilo sai tocando): Saída Curta 1,0; Posição 0,8; Relacionismo 0,6; Gegenpressing e Linha Alta 0,3; Corredores 0,2; Vertical 0,1; Direto, Reativo e Retranca 0.
- `perda` (só "Saída Curta"): custo de 0,9 que amplia a punição em x1,54.
- `dir` (verticalidade): Vertical 1,0; Direto 0,9; Reativo 0,7; Corredores 0,4.

O atributo DEF (nem qualquer outro) do atacante NÃO é usado para pressionar a saída. Os atributos individuais só entram de forma indireta, via "sinergia" do estilo (`ESTILOS.fit`, máximo de ±8% no ataque/defesa/controle): no Gegenpressing contam FIS e DEF dos meias (bônus de defesa), FIS e RIT dos atacantes (bônus de ataque). No Linha Alta contam RIT/DEF dos zagueiros. O goleiro participa da saída só como passador (peso 0,03 em `pesoPas`; `idxPas` conta o PAS dele com peso 0,5), sem "perder a bola" no pé. O jogador que sofre a pressão não é escolhido: o time inteiro paga o desconto.

### Impacto medido

Termo puro de pressão sobre a saída (pontos percentuais de chance de chute por ataque; linha = atacante, coluna = defensor que pressiona):

| Atacante \ Defensor | Gegen | Linha Alta | Posição | Relac. | Vertical | Retranca |
|---|---|---|---|---|---|---|
| Saída Curta | -16,9 | -10,2 | -6,8 | -5,1 | -5,1 | 0,0 |
| Posição | -8,3 | -5,0 | -3,3 | -2,5 | -2,5 | 0,0 |
| Relacionismo | -5,5 | -3,3 | -2,2 | -1,7 | -1,7 | 0,0 |
| Gegenpressing | -1,7 | -1,0 | -0,7 | -0,5 | -0,5 | 0,0 |
| Linha Alta | -2,2 | -1,3 | -0,9 | -0,7 | -0,7 | 0,0 |
| Vertical | +4,4 | +2,6 | +1,8 | +1,3 | +1,3 | 0,0 |
| Direto | +5,0 | +3,0 | +2,0 | +1,5 | +1,5 | 0,0 |

No resultado do duelo, esses valores são somados aos outros termos (bloco baixo, bola nas costas) e limitados a ±9 pontos, por isso o desconto máximo (Saída Curta contra Gegen) fica em -9.

Efeito sobre chutes por jogo (500 jogos por célula, mesmo elenco, 4-4-2, chutes do atacante / gols):

| Atacante \ Defensor | Gegen | Linha Alta | Posição | Retranca |
|---|---|---|---|---|
| Posição | 8,3 / 1,06 | 8,7 / 1,11 | 9,2 / 1,10 | 8,6 / 1,01 |
| Saída Curta | 8,4 / 1,07 | 8,1 / 1,07 | 8,7 / 1,08 | 8,8 / 0,95 |
| Vertical | 12,7 / 1,57 | 12,6 / 1,57 | 11,3 / 1,27 | 8,9 / 1,07 |
| Direto | 12,9 / 1,55 | 12,4 / 1,59 | 11,6 / 1,38 | 9,6 / 1,21 |

Leitura: a pressão alta custa a quem sai tocando uns 10% dos chutes (Posição: 9,2 contra Posição para 8,3 contra Gegen); em compensação ela ajuda muito quem joga direto/vertical (12,7 chutes contra Gegen, +1,4 sobre quem joga contra Posição). Não dá para contar "quantas bolas foram roubadas na saída": esse evento não é gerado nem aparece no texto da partida. Como proxy, o ajuste da tela de tática mostra "Perda perigosa na saída de bola contra quem pressiona" apenas como aviso.

### Problemas ou lacunas que encontrei

- Não existe roubada de bola de atacante em zagueiro/goleiro como lance. É um desconto estatístico no time que sai jogando, sem protagonista, sem narração e sem registro nas estatísticas.
- Os atributos dos atacantes (DEF, FIS, RIT, agressividade) não definem quem pressiona bem, e a qualidade técnica do zagueiro ou do goleiro (PAS) não protege contra a pressão. O que protege é o estilo do próprio time, não o jogador.
- Só 3 estilos têm pressão relevante (Gegen 1,0, Linha Alta 0,6, Posição 0,4): os outros 7 pouco pressionam.
- A pressão só afeta a chance de chute do atacante; não gera gol direto nem contra-ataque (a punição de "Saída Curta" também reduz o tempo de jogo).

---

## 5. Zonas do campo (defesa, meio, ataque) e faixas (esquerda, centro, direita)

### Como funciona hoje

Zonas: cada posição pertence a um de 4 grupos (`Players.GRUPO`): G (GOL), D (ZAG, LIB, LD, LE), M (VOL, MC, MEI, ALA), A (PD, PE, CA, SA). As formações (`FORMACOES`) são 11 posições; a estrutura (D-M-A) vem de contar os grupos:

| Formação | D | M | A | "Laterais" (LD/LE/ALA/PD/PE) |
|---|---|---|---|---|
| 4-4-2 | 4 | 4 | 2 | 4 |
| 4-4-2 Losango | 4 | 4 | 2 | 2 |
| 3-5-2 | 3 | 5 | 2 | 2 |
| 4-3-3 | 4 | 3 | 3 | 4 |
| 4-2-3-1 | 4 | 3 | 3 | 4 |
| 4-1-4-1 | 4 | 5 | 1 | 4 |
| 3-4-2-1 | 3 | 6 | 1 | 2 |
| 4-3-2-1 | 4 | 5 | 1 | 2 |
| 3-4-3 | 3 | 4 | 3 | 4 |
| 4-2-4 | 4 | 2 | 4 | 4 |
| 5-4-1 | 5 | 4 | 1 | 2 |
| 5-3-2 | 5 | 3 | 2 | 2 |

Como o confronto decide as chances (`forcas()` e `passo()`):
1. Cada time tem 3 forças calculadas com médias das zonas: `ataque = 0,60 A + 0,30 M + 0,10 D`, `defesa = 0,76 D + 0,08 M + 0,16 G`, `controle = 0,60 M + 0,20 A + 0,20 D`. Cada uma é multiplicada pelo ajuste da formação (`FORM_MOD`, ex.: 4-2-4 ataque 1,06 e defesa 0,89; 5-4-1 defesa 1,13), pelo estilo e pela sinergia dos jogadores.
2. Controle de A / (A + B), elevado a 2,2, vira a posse (mais "maré do jogo" e o mando de 1,07). Quem tem a bola ataca.
3. Chance de chute por ataque = 0,378 + (ataque do atacante - defesa do rival) x 0,0065 + estilo + duelo de estilos + passe e velocidade do time.
4. O lance escolhe os personagens por sorteio ponderado: passador (M x1,6, A x4,6, D x0,22, G x0,03; laterais x1,5), driblador (A x4, M x2), marcador (D x3, M x1, por DEF), finalizador (A x4, M x1,5, D x0,25).

Faixas (esquerda/centro/direita): NÃO existem. O motor não tem posição lateral por jogador: LD e LE, PD e PE são tratados de forma idêntica e o sorteio do marcador ignora o lado. A única noção de "lado" é `WIDE` = LD, LE, ALA, PD, PE:
- Probabilidade de cruzamento no chute: lateral/ala (LD, LE, ALA) 32% x `cruz` do estilo; ponta (PD, PE) 20% x `cruz` (Corredores multiplica por ~1,8). Cruzamento vira cabeçada (`cabDe`: finalização, altura, impulsão).
- A quantidade de jogadores "de lado" altera `pr.wide` (+0,06 por jogador acima de 3), que só serve para o duelo de estilos (cruzar contra defesa fechada, `MU.bw`).
- A quantidade de defensores/atacantes altera `bloco` (+0,07 por zagueiro acima de 4, -0,04 por atacante acima de 2): quem tem 5 defensores fecha mais; com 4 atacantes, menos.
- A sinergia (`sinergiaBruta`) dá bônus específicos por formação (4-3-3: pontas rápidos e dribladores; 3-5-2: alas com FIS/RIT; 4-4-2: laterais com DEF/FIS, etc.).

Esquema simples:

```
            ESQUERDA      CENTRO       DIREITA
ATAQUE      PE            CA / SA      PD           (grupo A)
MEIO        ALA(E)        VOL/MC/MEI   ALA(D)       (grupo M)
DEFESA      LE            ZAG/LIB      LD           (grupo D)
                          GOL                       (grupo G)
Só a LINHA conta no confronto (A x D, M x M); a faixa só define quem cruza.
```

### Impacto medido

Gols por grupo de posição (500 jogos por formação, os dois times com a mesma formação, estilo Posição). Os gols por slot são somados para os dois times.

| Formação | Gols/jogo | % gols de D / M / A | % chutes de D / M / A | % gols de cabeça | % gols de cruzamento |
|---|---|---|---|---|---|
| 4-4-2 | 2,16 | 13 / 42 / 46 | 13 / 39 / 48 | 16 | 6 |
| 4-3-3 | 2,70 | 14 / 31 / 55 | 12 / 27 / 60 | 15 | 7 |
| 3-5-2 | 2,28 | 11 / 49 / 40 | 10 / 45 / 45 | 16 | 4 |
| 4-2-4 | 2,69 | 12 / 23 / 65 | 10 / 17 / 72 | 16 | 7 |
| 5-4-1 | 1,91 | 19 / 48 / 33 | 18 / 50 / 31 | 13 | 1 |

Leitura: o número de atacantes e meias na formação decide quem finaliza. Em 4-4-2 os alas (grupo M) marcam tanto quanto os atacantes. O 4-3-3 e o 4-2-4 produzem mais gols para os dois lados (2,7 contra 2,16 do 4-4-2) porque o `FORM_MOD` deixa a defesa pior. Cruzamentos geram só 1 a 7% dos gols.

### Problemas ou lacunas que encontrei

- Não há faixas: ponta direita contra lateral esquerdo não é um duelo específico; qualquer marcador defensivo pode ser sorteado para qualquer atacante. Trocar PD por PE, ou LD por LE, não muda nada (apenas o encaixe de posição).
- O pé do jogador (`p.pe`) existe na ficha, mas só é exibido na interface: não é usado no motor (nenhuma relação com o lado).
- Meias abertos em 4-4-2 (`ALA`) contam como meio (M), não como ataque, então "ataque" da formação 4-4-2 só olha os dois atacantes; os alas entram no peso de 30% do meio.
- Zonas só entram como médias ponderadas; um buraco numa zona (um zagueiro fraco) é diluído pela média. A zona do adversário que enfrenta não é considerada (não há "meu ataque contra o lado onde a defesa deles é fraca").

---

## 6. Contratos dos jogadores e multas (rescisória)

### Como funciona hoje

Duração e vencimento (campo `p.contratoAte`, data):
- Jogo novo: cada jogador recebe contrato de 11 a 17 meses a partir de 31/01 (medido: 334 a 515 dias, mediana 424). O calendário de liga e copa termina em 25/10, então nenhum contrato vence durante a temporada de estreia (0% dos contratos vence até o fim do calendário).
- Contratos vencem de fato em `processarContratos(g)` (chamada a cada dia de jogo e na virada de temporada).
- Aviso ao técnico humano: 92 dias antes ("Já é possível renovar", `podeRenovar`) e 30 dias antes ("Atenção").
- Jovens da base sobem com contrato de 12 a 18 meses (24 meses quando contratados como "base"); livres e jogadores comprados recebem 12 meses (comprados com contrato ativo: o maior entre 12 meses e o restante).
- `p.contrato--` em `virarAno` é um campo antigo sem uso (o jogo usa só `contratoAte`).

Renovação (`opcoesRenovacao`, `salarioEsperado`, `negociar`, `aplicarRenovacao`):
- Só nos últimos 92 dias. A renovação SOMA 3 a 6 (Curto), 6 a 9 (Médio) ou 9 a 12 meses (Máximo) ao fim do contrato atual; as faixas são sorteadas a cada abertura.
- Salário esperado = `salarioBase(p)` x (1,12 - 0,12 x moral/50) x 1,15 se estrela, x0,97 para jovem (<=23) em contrato longo, x1,04 para veterano (>=31). `salarioBase = 1,17% do valor de mercado, mínimo R$ 500` por mês. A moral só influencia isso: moral 0 = +12%; moral 50 = 100%; moral 100 = -12% (no piso de R$ 500 do exemplo medido não aparece).
- Se o salário oferecido for >= esperado, aceita. Entre 85% e 100%, pede entre 0% e +4% acima do esperado. Abaixo de 85%, pede 5% a 15% mais ("firme"). O técnico aceita o pedido ou vende o jogador em leilão por R$ 0.
- Renovar dá +3 de moral. Jogadores nunca recusam renovar nem pedem para sair; moral baixa só encarece o salário.

Vencimento sem renovar:
- Clube humano: o jogador sai para a lista de livres (`g.livres`) e o clube é completado com juniores se ficar abaixo de 20.
- Clube do computador: renova sozinho por 9 a 15 meses com o salário voltando a `salarioBase` (renova sempre).
- Medido na primeira virada de temporada: Bangu (humano) tinha 3 de 24 contratos vencendo e perdeu os 3. No computador, 268 de 1.918 contratos venceram e todos foram renovados.

Multa rescisória (`Mercado.multa`):
`multa = 0,40 x valorAjustado x min(1, dias_restantes/365)`, arredondada a R$ 1.000. Quem compra o jogador paga o preço de venda MAIS a multa, e a multa vai para o clube vendedor (receita "Multas rescisórias" em `transferir`). Vale em compra direta (`proporCompra`), leilão (`leiloar`), venda a preço fixo (`processarVendas`) e compras do computador (`iaCompras`). A multa não existe para jogador livre, e o salário e a data de fim não mudam na transferência (só se o restante for menor que 12 meses, o contrato vira 12). O comprador humano precisa ter caixa para preço + multa. O jogador não paga multa, e nenhum clube paga para rescindir o próprio jogador: dispensar um jogador com contrato é feito só por leilão (inclusive o leilão forçado por salário atrasado com caixa negativo, a cada 5 rodadas).

Livres (`gerarLivres`, `contratarLivre`):
- O mercado de livres é repovoado até 40 jogadores (veteranos e jogadores de nível de Série D a B, mais jogadores da base no fim do ano); acima de 36 anos, saem.
- Contratar livre: salário esperado para 12 meses + luvas de 2 salários (`propostaLivre`), sem multa. A moral sobe para pelo menos 65 (100 se for da base).
- O computador também contrata livres quando há necessidade (`iaCompras`, 4% por rodada, até 3 contratações por temporada).

Exemplo medido (jogador de 76 de overall, 25 anos, valor ajustado R$ 3,08 mi, salário R$ 34 mil/mês):

| Tempo de contrato restante | Multa | % do valor |
|---|---|---|
| 365 dias ou mais | R$ 1,23 mi | 40% |
| 270 dias | R$ 911 mil | 30% |
| 180 dias | R$ 607 mil | 20% |
| 92 dias | R$ 310 mil | 10% |
| 30 dias | R$ 101 mil | 3% |
| 1 dia | R$ 3 mil | 0% |

Folha mensal medida: Bangu R$ 13 mil, Palmeiras R$ 724 mil. Quando o computador renova, o salário volta ao `salarioBase` atual do jogador (1,17% do valor de mercado).

### Impacto medido

- Todos os jogadores de um clube humano com contrato vencendo na virada saem sem aviso de negociação obrigatória (só as notícias de 92 e 30 dias). Em Bangu, 3 de 24 jogadores (12,5%) venciam na primeira virada.
- Como a renovação soma só 3 a 12 meses, mesmo a renovação máxima mantém o jogador por menos de 15 meses, então o humano precisa renovar quase todos os anos; o computador renova automaticamente.
- A multa só chega a 40% do valor com contrato de 12 meses ou mais; como a duração máxima é ~17 meses (e cai a cada dia), multas altas existem só no começo do contrato, e entre 92 e 0 dias ela é pequena (de 10% a 0%).

### Problemas ou lacunas que encontrei

- Jogadores nunca se recusam a renovar nem ficam insatisfeitos por baixa moral; a moral só muda o salário pedido em ±12%.
- Contrato máximo bem curto (3 a 12 meses por renovação) e sem bônus de assinatura: o humano precisa renegociar com todo o elenco todos os anos, enquanto o computador renova de graça e ainda reseta o salário para o valor base.
- A multa é paga só pelo comprador e é pequena perto do fim do contrato; não existe multa paga pelo clube que rescinde, nem cláusula de rescisão em favor do jogador.
- Jogador livre custa só luvas de 2 salários e vem com moral pelo menos 65: é uma forma barata de refazer o elenco.
- Quem não renova (humano) vai para a lista de livres e pode ser contratado de volta pelo próprio humano pagando luvas (e novo salário esperado), o que contorna a multa.
- Salário não acompanha evolução do jogador no contrato (só na renovação); jogador que melhora muito continua barato até vencer.

---

## 7. Faltas: como são geradas e se registram a área do campo

### Como funciona hoje

- Existem três origens de falta, todas dentro do `passo` (minuto a minuto): (a) o duelo de drible de cada ataque (driblador contra marcador) pode terminar em falta; (b) um sorteio de falta geral por minuto, com base `faltaBase` 0,125 × 1,7 × fator do jogo, em que o lado com menos bola faz mais faltas; (c) o pênalti aleatório `PEN_P` 0,0008 por minuto.
- O infrator da falta geral é sorteado entre todos os jogadores de linha e o goleiro, com peso `DISC_FALTA × (0,6 se atacante) × (1,2 − DEF/300)`. A disciplina pesa 0,55 (Fair player), 0,85, 1,0, 1,3 e 1,7 (Macetador).
- Depois de uma falta geral, 7,5% viram tiro livre direto e 5% viram falta lateral que cruza na área. As faltas de duelo têm sua própria cobrança.
- A falta não é um evento: só o cartão (amarelo ou vermelho) aparece no relato. Não há registro de local, de quem sofreu a falta (na falta geral) nem de quantas faltas cada jogador fez, a não ser a contagem interna.

### Impacto medido (1000 jogos simulados)

- 21,5 faltas por jogo, 3,5 bolas paradas perigosas por jogo (2,5 tiros livres diretos e 1,0 faltas laterais).
- Faltas a cada 90 minutos por posição: LIB 1,12; LD 1,09; ZAG 1,06; VOL 1,01; MC 0,94; **GOL 0,86**; atacantes entre 0,56 e 0,71. A diferença entre defensor e atacante é de apenas cerca de 1,7 vez.
- Por disciplina (faltas/90): Fair player 0,54; De boa 0,71; Equilibrado 0,89; Porradeiro 1,12; Macetador 1,45. Amarelos/90 vão de 0,023 a 0,287.

### Lacunas ou problemas

- **A falta não tem área do campo.** O jogo não diz onde aconteceu (área própria, terço defensivo, meio, ataque, faixa esquerda, centro ou direita) e o relato não mostra a falta, só o cartão.
- O goleiro faz falta geral quase como um meia (0,86 por 90 min). Na prática um goleiro só faz falta dentro da própria área ou ao sair da área; fora disso, o número é irreal.
- Quem sofre a falta geral não é sorteado: não há vítima, então não dá para ligar lesão, moral ou cartão à vítima.
- A falta não é limitada pela posição em que o jogador joga: um ponta-direita faz falta no próprio campo de defesa com a mesma lógica de qualquer outra.

### Possíveis soluções

1. Sortear uma zona abstrata para cada falta (área própria, terço defensivo, meio, terço de ataque, área adversária) × faixa (esquerda, centro, direita), com peso pelo estilo de jogo e pela formação, e registrar no relato ("Falta de X em Y, lado esquerdo, a 25 metros do gol").
2. Sortear antes a vítima (atacante com mais drible ou RIT tem mais chance) e o infrator condicionado à zona.
3. Tirar o goleiro do sorteio geral e dar a ele só faltas na própria área, com peso muito menor.
4. Ligar lesão (hoje independente) à gravidade da falta e à disciplina do infrator.

## 8. Pênaltis: são faltas na grande área?

### Como funciona hoje

- Pênalti nasce de dois caminhos independentes:
  1. **Duelo de drible** (341 de 418 pênaltis medidos, 82%). Se o duelo termina em falta, a chance de ser pênalti é `{atacante 0,24; meia 0,11; defensor 0,02} × 1,3 se for driblador`. A posição de quem sofreu decide a chance, não o lugar onde o lance aconteceu.
  2. **Pênalti aleatório** `PEN_P` 0,0008 por minuto (77 de 418). O infrator é sorteado entre os jogadores de linha (goleiro fora), com k 2,9.
- Não existe um teste "a falta ocorreu dentro da grande área?". Falta geral nunca vira pênalti, e falta de duelo vira pênalti conforme o sorteio acima, mesmo que o lance fosse no meio-campo.

### Impacto medido

- 0,42 pênalti por jogo (418 em 1000 jogos), realista (o futebol real fica entre 0,25 e 0,35).
- Posição do infrator: ZAG 137, LD 53, LE 45, MC 42, VOL 39, LIB 30, ALA 30, MEI 28, só 3 de PD e 8 de CA. Ou seja, 66% por defensor e meio-campista, e a concentração é natural.
- Disciplina do infrator: Fair player 28, De boa 52, Equilibrado 136, Porradeiro 105, Macetador 97. Os porradeiros e macetadores somam 48%, enquanto representam cerca de 30% do elenco.
- Quem sofre o pênalti de drible: CA 64, SA 56, PE 46, PD 40, MC 37, VOL 36, ALA 32, MEI 29 (a distribuição é razoável).

### Lacunas ou problemas

- O pênalti é decidido sem lugar; ele só *parece* uma falta na área porque o resultado final é um pênalti.
- Sem o conceito de lance na área, não dá para existir "pênalti perdoado por estar fora da área" nem "falta na linha da área": toda falta de duelo é ou pênalti, ou tiro livre.
- O pênalti aleatório não exclui o goleiro. Isso é intencional, mas o goleiro nunca é infrator de pênalti em saída de bola.

### Possíveis soluções

1. Gerar a falta de duelo já com a zona do lance. Se a zona for "área adversária", é pênalti; se for "perto da área", tiro livre direto; senão, tiro livre comum ou lateral.
2. Quando a falta é na área própria do infrator, aplicar fator extra de disciplina (ver seção 9).
3. Permitir que o goleiro seja o infrator em lances de saída e de 1 contra 1 (pênalti + cartão vermelho de "último homem").

## 9. Goleiros, zagueiros e volantes porradeiros: mais faltas e pênaltis na própria área?

### Como funciona hoje

- Não. A chance de falta e de pênalti **não depende** de a bola estar na área do infrator, porque a bola não tem posição.
- O que existe é a disciplina (`DISC_FALTA` 0,55 a 1,7 sobre o peso de infrator) e o peso `(1,2 − DEF/300)`: defensores e volantes com DEF alto fazem menos falta, o que é um viés oposto ao de "defensor que bate".
- No pênalti de duelo, o infrator é o marcador sorteado dentro da defesa do time, e a disciplina entra no peso. No pênalti aleatório o goleiro é excluído.

### Impacto medido

- Porradeiro faz 1,12 falta por 90 min e Macetador 1,45, contra 0,89 do Equilibrado: efeito de +26% e +63%.
- Para pênaltis, os dois níveis mais duros respondem por 48% dos casos, e o zagueiro por 33% (137 de 418). Então o efeito desejado pelo KK **já existe indiretamente**, mas por distribuição de peso, não por localização.
- O goleiro é infrator de 0,86 falta por 90 min fora da área e nunca de pênalti.

### Lacunas ou problemas

- Faltas do goleiro ficam sem sentido (ver seção 7); um goleiro Macetador faz mais faltas gerais do que um atacante Equilibrado.
- Um defensor porradeiro faz tanta falta no meio-campo adversário quanto na própria área. O correto seria: a chance é maior quando ele está sob pressão (bola na própria área ou em zona de perigo).
- Não há diferença entre "falta tática" (cortar contra-ataque) e "falta de desespero" (último homem).

### Possíveis soluções

1. Com a zona de cada falta (seção 7), multiplicar o peso do infrator por um fator de pressão defensiva: ×1,0 nas zonas neutras, ×1,3 na própria área.
2. Em zonas perigosas, usar peso extra para Porradeiro (×1,4) e Macetador (×1,8) em ZAG, VOL e GOL, e atrelar o cartão vermelho de "último homem".
3. Goleiro: só participa quando a zona é a área própria, com peso baixo e cartão amarelo mais provável.

## 10. Início do jogo, bola do meio, lados do campo e segundo tempo

### Como funciona hoje

- **Não há saída de bola do meio-campo.** O jogo começa no minuto 1 já com a posse sorteada por `pc` (posse da casa = `ctrl() + m.mom + ajuste do placar`, limitado a 15% a 85%).
- O mandante tem apenas a vantagem implícita do bônus de casa em `ctrl`. A posse no 1º minuto é 0,54 da casa, em média.
- Não existe lado de campo, nem troca de lados no intervalo, nem reinício com a bola do meio depois do gol, nem o "outro time sai no 2º tempo".
- O intervalo é só uma pausa (substituições, ajuste do técnico, +X acréscimos). O 2º tempo continua o mesmo cálculo.

### Impacto medido

- Posse média da casa 54,0% com desvio de 6,2 pontos; mínimo 36%, máximo 74%.
- Quanto maior a posse, maior a vitória da casa: 23% (posse até 40%), 27% (40 a 47%), 33% (47 a 53%), 44% (53 a 60%) e 49% (acima de 60%).

### Lacunas ou problemas

- O visitante não "abre" o jogo com a bola, como o KK descreveu; nada marca quem sai jogando.
- Sem lados do campo não dá para dizer que "o time A ataca para a direita no 1º tempo" nem que "as formações se reposicionam" a partir de uma saída de bola.
- Sem reinício após gol, o time que sofreu o gol não "bate o meio" no jogo; é o mesmo cálculo de posse.
- O fim do 1º tempo e o início do 2º não mostram nenhuma troca (relato ou animação).

### Possíveis soluções

1. Criar um estado `bola` no jogo: `{ zona, faixa, posse, lado }`. O mandante escolhe o lado no 1º tempo; o visitante *abre* o jogo (posse inicial do visitante, como o KK pediu). Segundo tempo: troca-se os lados e quem abre é o mandante. Depois de gol, quem sofreu reinicia no centro.
2. Mostrar no relato "Começa o jogo: o visitante toca a bola no meio-campo" e "Começa o 2º tempo: o mandante dá a saída".
3. Usar a saída para impor a posição inicial das formações (todos no próprio campo) e deixá-los avançar conforme tática e estilo nos primeiros minutos.
4. Implementar tudo isso antes das zonas e faixas (seção 5), pois a saída é o estado inicial delas.

## 11. Em que área a bola está e como a bola em jogo e a posse são gerenciadas

### Como funciona hoje

- **A bola não tem posição.** O minuto é a unidade: o jogo calcula `ctrl()` (força relativa do meio-campo com tática, estilo, moral e placar), soma o momento `m.mom` e o ajuste do placar, e aplica o limite 0,15 a 0,85. Esse é `pc`, a probabilidade de a casa ficar com a bola naquele minuto.
- `m.rec` é uma média suavizada dessa posse, usada só para mostrar a estatística de posse.
- A cada minuto sorteia-se quem ataca (pela posse e pelo tempo do estilo) e quantos ataques ocorrem. Cada ataque passa por finalização, drible, bola aérea e bola parada.
- O jogo não tem "bola em jogo/bola fora", escanteio ou lateral por saída de campo; o escanteio vem de um sorteio dentro do ataque, e o tiro de meta/lateral não existe como lance.
- A zona de cada lance não é guardada. O texto do relato escolhe jogador e lado por sorteio ao montar a frase.

### Impacto medido

- A posse varia pouco (desvio de 6,2 pontos), por isso times muito desiguais raramente passam de 70% (máximo medido 74%).
- Saldo médio de gols casa x visitante por faixa de posse: de −0,15 (posse 40 a 47%) a +0,54 (posse acima de 60%), o que mostra que a posse é um bom resumo da força do meio-campo, mas não cria efeito de campo.

### Lacunas ou problemas

- Falta uma noção real de "posse com bola": o time com mais posse não é necessariamente quem trabalha a bola na zona de ataque.
- Escanteios, laterais e tiros de meta não são lances contados (hoje só escanteio, de forma indireta).
- Não há como mostrar "bola recuperada no terço de ataque", "troca de passes até a área" ou "bola longa para a lateral".

### Possíveis soluções

1. Camada leve de zonas: a cada minuto a bola está em uma de cinco zonas (área própria, defesa, meio, ataque, área adversária) e três faixas (esquerda, centro, direita), com matriz de transição que depende de estilo, formação, qualidade de passe e marcação.
2. Manter o `pc` atual como "viés" dessa matriz, assim o equilíbrio dos relatórios de 11 a 22 não muda.
3. Registrar cada lance com sua zona para produzir: relato com local, estatística de posse por terço, faltas por zona e pênalti na área.
4. Implementação em etapas: (1) saída de bola e lados, (2) zona e faixa, (3) falta com zona, (4) pênalti como falta na área, (5) ajuste fino do Porradeiro/Macetador por zona.

---

## Resumo dos problemas encontrados

- Moral dos jogadores (seção 1): efeito grande nas partidas (30 pontos de moral valem cerca de +0,3 gol e +0,25 ponto por jogo) e nada explica isso na interface; resetada a 60 todo ano.
- Moral do técnico (seção 2): só afeta jogadores do clube humano, no máximo ±1 por jogo, enquanto `semJogar` tira ~1 por jogo do reserva parado. Por isso reservas do humano ficam entre 40 e 60 mesmo com o time ganhando; a hipótese do KK não está implementada. No computador o valor do técnico não faz nada.
- Humano e computador seguem regras diferentes: o computador tem recuperação automática a 55 (piso 30), o humano não.
- O piso de 40 do `semJogar` não protege contra o clima negativo, o treino (-3 a -5 por jogo) nem o caixa negativo (-3 por rodada).
- Disciplina (seção 3): muda cartões (até 6x amarelos, 25x vermelhos) e pênaltis, mas quase não muda o número de faltas (+10%), e NÃO influencia a lesão do jogador faltoso nem de quem recebe a falta. Lesão é totalmente independente.
- Pressão na saída (seção 4): não existe como lance nem estatística; é um desconto na chance de chute que depende só do estilo, nunca de DEF/FIS/RIT dos atacantes nem da qualidade do zagueiro ou do goleiro.
- Zonas e faixas (seção 5): o motor trabalha só com 3 linhas (D, M, A) por média; não existem faixas esquerda/centro/direita, LD = LE e PD = PE, o pé do jogador não é usado, e o marcador é sorteado sem relação com o atacante.
- Contratos (seção 6): renovação máxima de 3 a 12 meses, computador renova sempre e reseta o salário, humano perde quem não renovar; jogadores nunca recusam; a multa só existe na compra e cai a zero perto do vencimento; livres são baratos (luvas de 2 salários) e podem ser recontratados.
- Faltas (seção 7): não têm área do campo nem vítima, não aparecem no relato (só cartões) e o goleiro faz 0,86 falta por 90 min, quase como um meia.
- Pênaltis (seção 8): 0,42 por jogo (realista), mas decididos sem localização; falta de duelo vira pênalti pela posição de quem sofreu, não porque ocorreu na grande área.
- Porradeiros na própria área (seção 9): o efeito existe só por peso de disciplina (48% dos pênaltis vêm de Porradeiro/Macetador), não por a bola estar na área do infrator.
- Início do jogo (seção 10): não há bola do meio, lados do campo, saída do visitante, troca de lados nem reinício após gol; a posse do 1º minuto é 54% da casa.
- Bola e posse (seção 11): a bola não tem posição; a posse é um sorteio por minuto limitado a 15%-85%. Proposta de camada leve de zonas e faixas, mantendo o `pc` como viés, em 5 etapas.

Nenhuma dessas propostas foi implementada; aguardam a decisão do KK.
