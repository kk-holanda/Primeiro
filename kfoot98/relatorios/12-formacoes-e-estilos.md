# Kfoot 98 — Relatório 12: formações e estilos de jogo (Melhorias #24, versão 25)

Medições feitas por simulação de partidas completas com elencos gerados pelo próprio jogo (prestígio 60). Cada célula é uma média de centenas de jogos; o erro típico de uma célula é ±0,03 ponto por jogo e o de uma linha ou coluna ±0,015. Pontos por jogo: 3 vitória, 1 empate. Contra um adversário médio, o resultado esperado é 1,35.

## 1. O que entrou no jogo
- **12 formações** no lugar das 6 antigas: 4-4-2, 4-4-2 Losango, 3-5-2, 4-3-3, 4-2-3-1, 4-1-4-1, 3-4-2-1, 4-3-2-1, 3-3-1-3, 4-2-4, 5-4-1 e 5-3-2. Jogos salvos com 4-5-1 ou 3-4-3 viram 4-1-4-1 e 3-3-1-3.
- **10 estilos de jogo** no lugar dos 4 antigos: Posição (tiki-taka), Gegenpressing, Reativo (contra-ataque), Jogo Direto, Relacionismo, Retranca, Linha Alta, Corredores, Vertical e Saída Curta. Jogos salvos: ofensivo vira Vertical, equilibrado vira Posição, defensivo vira Retranca e contra vira Reativo.
- **Estilo secundário** (opcional): a aba "Estilos x Estilos" da planilha virou a relação entre o principal e o secundário. O secundário entra com força de 25% a 70% conforme a relação (Sinergia forte 70%, Boa sinergia 60%, Compatível com tensão 45%, Situacional 35%, Conflito 25% a 30%) e os conflitos custam até 2% de ataque e de controle.
- **Compatibilidade 1 a 5** (aba Matriz da planilha) aparece em cada botão de estilo para a formação escolhida. Ela escala o que o estilo dá e o que ele custa.
- **Duelo de estilos**: o estilo de cada time rende mais ou menos conforme o estilo e a estrutura do adversário (pressão contra saída curta, linha alta contra bola nas costas, bloco baixo contra posse e cruzamentos etc.). Os humanos e o computador respondem no intervalo com a tabela de melhores respostas da seção 4.
- **Campo desenhado**: cada estilo tem setas, zonas e linhas em cima do campo, e os jogadores sobem ou descem conforme o estilo. Imagens da internet não foram usadas (o desenho é feito no próprio jogo, sem direitos autorais).
- **Dificuldade removida** da tela inicial; o jogo fica sempre no normal.

## 2. Como a planilha virou regra
- **Bônus e penalidade por combinação.** A faixa de % da aba "Correlação detalhada" (ex.: +7 a +10%) define o tamanho do bônus do estilo na formação; a faixa de penalidade define o custo. A nota de compatibilidade multiplica: o bônus vale ×0,4 (nota 1), ×0,7, ×0,9, ×1,0 e ×1,12 (nota 5); o custo vale ×1,35 (nota 1) até ×0,8 (nota 5).
- **Teto de +15%** nas forças de ataque, defesa e controle (regra da planilha) e piso de −18%.
- **Penalidade só quando o risco acontece**: bola nas costas só pesa contra atacante veloz; saída curta só custa contra quem pressiona; cruzamento só perde força contra bloco fechado; impedimento só aparece com linha alta; fadiga de gegenpressing só aparece no cansaço.
- **Fôlego**: estilos de intensidade (Gegenpressing, Linha Alta, Vertical) rendem menos e custam mais com a stamina média do time abaixo de 70.
- **Efeitos novos no motor**: chance de finalizar, qualidade da finalização, cruzamentos, jogo aéreo, impedimentos, gasto de energia, faltas e cartões, e contra-ataque.
- **Encaixe do elenco**: cada estilo tem uma lista de posições e atributos que o fazem funcionar (ex.: Posição pede PAS e DRI nos meias e PAS nos defensores; Gegenpressing pede FIS, DEF e RIT; Linha Alta pede RIT e DEF nos zagueiros). Isso entra na sinergia (teto ±8%) e escala o bônus em até ±60%.

## 3. Equilíbrio medido
Pontos por jogo de cada combinação contra combinações sorteadas (entre parênteses, a compatibilidade da planilha).

| Formação | Posição | Gegenpressing | Reativo | Jogo Direto | Relacionismo | Retranca | Linha Alta | Corredores | Vertical | Saída Curta | média |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 4-4-2 | 1,33 (4) | 1,31 (4) | 1,47 (5) | 1,38 (5) | 1,31 (4) | 1,20 (3) | 1,34 (4) | 1,50 (4) | 1,43 (4) | 1,29 (3) | **1,36** |
| 4-4-2L | 1,37 (5) | 1,38 (4) | 1,31 (4) | 1,30 (3) | 1,41 (5) | 1,30 (2) | 1,28 (2) | 1,30 (2) | 1,35 (4) | 1,38 (4) | **1,34** |
| 3-5-2 | 1,32 (4) | 1,35 (4) | 1,43 (5) | 1,33 (5) | 1,43 (4) | 1,37 (5) | 1,34 (4) | 1,37 (4) | 1,42 (4) | 1,34 (4) | **1,37** |
| 4-3-3 | 1,46 (5) | 1,30 (5) | 1,30 (4) | 1,38 (4) | 1,45 (4) | 1,18 (2) | 1,39 (5) | 1,40 (5) | 1,27 (5) | 1,33 (5) | **1,35** |
| 4-2-3-1 | 1,45 (5) | 1,33 (5) | 1,36 (5) | 1,35 (4) | 1,35 (4) | 1,34 (4) | 1,42 (4) | 1,34 (4) | 1,32 (5) | 1,26 (5) | **1,35** |
| 4-1-4-1 | 1,35 (5) | 1,40 (5) | 1,37 (4) | 1,33 (3) | 1,34 (4) | 1,28 (4) | 1,46 (5) | 1,40 (3) | 1,35 (4) | 1,42 (5) | **1,37** |
| 3-4-2-1 | 1,39 (5) | 1,34 (5) | 1,41 (5) | 1,36 (4) | 1,38 (5) | 1,31 (4) | 1,37 (4) | 1,28 (4) | 1,36 (5) | 1,42 (5) | **1,36** |
| 4-3-2-1 | 1,44 (5) | 1,32 (4) | 1,35 (4) | 1,33 (3) | 1,43 (5) | 1,35 (4) | 1,34 (4) | 1,37 (2) | 1,39 (4) | 1,41 (4) | **1,37** |
| 3-3-1-3 | 1,39 (4) | 1,35 (5) | 1,22 (2) | 1,28 (4) | 1,40 (5) | 1,06 (1) | 1,38 (5) | 1,34 (4) | 1,41 (5) | 1,33 (3) | **1,32** |
| 4-2-4 | 1,25 (2) | 1,31 (4) | 1,36 (4) | 1,42 (5) | 1,24 (3) | 1,17 (1) | 1,28 (2) | 1,42 (5) | 1,36 (5) | 1,35 (2) | **1,32** |
| 5-4-1 | 1,39 (2) | 1,22 (2) | 1,37 (5) | 1,34 (4) | 1,28 (2) | 1,37 (5) | 1,31 (2) | 1,37 (3) | 1,31 (3) | 1,29 (2) | **1,33** |
| 5-3-2 | 1,25 (3) | 1,38 (4) | 1,37 (5) | 1,35 (5) | 1,24 (3) | 1,38 (5) | 1,21 (3) | 1,39 (4) | 1,35 (4) | 1,34 (3) | **1,33** |
| **média** | 1,37 | 1,33 | 1,36 | 1,35 | 1,35 | 1,28 | 1,34 | 1,37 | 1,36 | 1,35 | |

- **Formações**: as médias ficam entre 1,32 e 1,37; nenhuma é "a melhor". O melhor estilo de cada formação rende entre 1,39 e 1,50.
- **Estilos**: médias entre 1,33 e 1,37, com a Retranca em 1,28 (ela só vai bem nas formações de nota 5: 3-5-2, 5-4-1, 5-3-2). É o custo previsto pela planilha: quem joga retranca sem encaixe perde mais do que ganha.
- **Compatibilidade funciona**: nota 5 → 1,38 ponto por jogo; nota 4 → 1,36; nota 3 → 1,30; nota 2 → 1,29; nota 1 → 1,12. Combinações de nota 1 (3-3-1-3 e 4-2-4 com Retranca) perdem de verdade.
- As formações e os estilos foram calibrados em 5 rodadas de simulação com ajuste automático dos modificadores de ataque e defesa.

## 4. Estilo contra estilo (quem responde a quem)
Pontos por jogo do estilo da linha contra o da coluna, com elencos iguais e cada lado na formação de nota 4 ou 5 (média dos dois lados do campo).

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

Melhores respostas (usadas pelo intervalo do jogo e pelo computador):

| Adversário joga | Melhores respostas |
|---|---|
| Posição | Gegenpressing, Linha Alta |
| Gegenpressing | Reativo, Vertical, Jogo Direto |
| Reativo | Saída Curta, Retranca |
| Jogo Direto | Saída Curta, Reativo |
| Relacionismo | Jogo Direto, Corredores |
| Retranca | Linha Alta, Relacionismo |
| Linha Alta | Reativo, Jogo Direto, Vertical |
| Corredores | Saída Curta, Posição, Linha Alta |
| Vertical | Reativo, Jogo Direto |
| Saída Curta | Linha Alta, Gegenpressing |

O desenho que aparece é o da planilha: pressão alta vence saída curta e posse, bola longa e vertical passam por cima da pressão, reativo vence quem se expõe, bloco baixo neutraliza posse e cruzamento. A amplitude é de ±0,15 ponto por jogo nos confrontos mais fortes, então a escolha pesa mas não decide sozinha. No intervalo, trocar para uma boa resposta rende +3%, trocar para algo que o adversário anula custa −2% (mesma regra de antes) e o estilo secundário vale metade.

## 5. Efeitos específicos medidos (formação de nota 4 ou 5, contra adversários variados)
```
estilo       ppg   gols  sofr  chutes posse  esc  stamFim  amar  imped.provocados(adv)
posicao      1.24   1.27  1.27    10.0    53   2.9     80.8   1.00     0.00
gegen        1.23   1.13  1.36    11.0    51   3.1     73.2   1.30     0.00
reativo      1.32   1.27  1.17    10.6    48   2.8     80.9   1.25     0.00
direto       1.56   1.52  1.26    12.0    48   3.1     80.9   1.23     0.00
relac        1.31   1.38  1.48    10.6    52   3.0     80.9   1.15     0.00
retranca     1.40   0.92  0.94     8.1    47   2.5     81.0   1.22     0.00
linhaalta    1.34   1.27  1.24    10.7    51   3.0     78.0   1.26     1.13
corredores   1.52   1.36  1.21    11.2    50   3.3     80.9   1.02     0.00
vertical     1.36   1.37  1.36    12.0    49   3.4     80.7   1.17     0.00
saida        1.32   1.20  1.11    10.2    52   3.0     80.8   1.17     0.00
```
- **Gegenpressing** gasta ≈1,4× mais energia (stamina média final 73 contra 81 dos outros) e rende menos no segundo tempo. A planilha sugeria testar 1,5× a 2×; ficou em 1,5× no custo nominal.
- **Linha Alta** provoca ≈1,1 impedimento por jogo no adversário e gasta ≈15% mais energia.
- **Retranca** reduz os gols dos dois lados (0,92 a favor e 0,94 contra por jogo, contra ≈1,25 dos demais).
- **Jogo Direto** e **Vertical** dão mais finalizações (12 por jogo contra 10 a 10,7 dos outros); **Corredores** e **Vertical** dão mais escanteios (3,3 e 3,4 contra 2,9 a 3,1).
- O número de gols por jogo continua em 2,5 (1,24 para cada lado).

## 6. Sugestões
**Aplicar melhor bônus e penalidades**
1. **Familiaridade 0 a 100** (já prevista na planilha, ainda não implementada): cada combinação de formação e estilo começa em 50 e sobe com jogos e treinos táticos; baixa familiaridade aumenta o custo do estilo e reduz o bônus (até −40%). Trocar muito de estilo derruba a familiaridade e o técnico Estrategista troca com menos custo.
2. **Treino tático** como opção no treino: o time inteiro treina uma combinação por alguns jogos e ganha familiaridade em vez de atributos.
3. **Instruções por jogador** (liberdade para avançar, marcação, cruzar ou driblar) usando os mesmos atributos que já medem o encaixe.
4. **Penalidade de transição**: trocar de formação no intervalo custar alguns minutos de organização, como na planilha ("não penalizar permanentemente").
5. **Mostrar depois do jogo** o que o estilo rendeu (impedimentos provocados, perdas na saída, escanteios), para o técnico entender o que funcionou.

**Jogador certo no lugar certo**
1. Hoje o encaixe do elenco usa posição e atributos (PAS, DRI, FIS, RIT, DEF, CHU). Uma próxima etapa é **papel por posição** (ex.: "volante construtor" x "volante destruidor", "ala ofensivo" x "ala fechado"), escolhido na tela e com atributo principal diferente.
2. **Traits ligadas a estilos**: Maestro e Driblador ajudam Posição e Relacionismo; Cabeção e Matador ajudam Jogo Direto e Corredores; Desarmador e Highlander ajudam Gegenpressing e Retranca.
3. **Altura e cabeceio** entrarem no encaixe de Jogo Direto e Corredores (hoje entram só pelo cabeceio dos finalizadores).

**Adaptação entre humanos e computador**
1. O computador já lê o último estilo do adversário (na escalação e no intervalo) com a mesma probabilidade de acerto do estilo do técnico. Uma melhoria é registrar para o humano **o que o adversário jogou nos últimos 3 jogos** na tela do próximo jogo.
2. **Técnico com estilo** (próxima rodada): ligar cada estilo de técnico a famílias de estilos de jogo (Ofensivista: Vertical, Corredores, Gegenpressing, Direto; Retranqueiro: Retranca, Reativo, Linha Alta; Professor: Posição, Relacionismo, Saída Curta), o que já está feito de forma provisória na escolha do computador.
3. Nova trait de técnico possível: "Adaptável" (acerta mais o intervalo) e "Teimoso" (nunca muda de estilo).

## 7. Decisões que tomei sozinho
- O estilo secundário é opcional; sem ele o jogo funciona como um estilo só.
- Os estilos antigos viraram os mais parecidos nos jogos salvos (seção 1).
- A tabela de melhores respostas vem da simulação, não da planilha.
- Estilos de técnicos e traits de técnicos ficaram para a próxima rodada, como combinado.
