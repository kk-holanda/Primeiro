# Kfoot 98: estilos de técnico, compras e desempenho na Série C (v54)

Data: 16/10/2026. Pedido do KK: um teste maior dos estilos de técnico e de jogo, ligando o que cada técnico compra ao desempenho no campeonato, com foco nos times da Série C. 40 mundos (sementes 1 a 40), 4 temporadas cada. Nada no jogo foi mudado para este teste.

## Como foi testado
- Em cada mundo, os 20 clubes da Série C receberam um estilo de técnico **sorteado**, quase 3 clubes de cada estilo, e o estilo ficou fixo pelas 4 temporadas. Sortear tira o efeito de "o clube X é forte e por acaso tem um Retranqueiro".
- 17 dos 20 clubes compraram como o computador compra hoje (cada estilo do seu jeito). Os outros 3 foram testes extras, com estilo de técnico também sorteado:
  - **Não compra nada.**
  - **Investidor:** 1 ou 2 jogadores por janela, de clubes da A ou B, pelo menos 8 pontos acima da média do time (os mais caros que o caixa pagar, guardando 1,5 folha).
  - **Base:** só garotos da base com característica ou estrela, com as 3 vagas de treino sempre para eles.
- Os clubes foram acompanhados nas 4 temporadas, subindo ou caindo. No total: 680 clubes normais (cerca de 100 por estilo; o Imprevisível teve 67), 40 de cada teste extra e 121 mil jogos de liga.
- **"Acima do esperado"** compara os pontos de cada jogo com a média de pontos de todos os jogos com a mesma diferença de força (média dos 11 melhores) e o mesmo mando. Ele mede o quanto o estilo rende **com o elenco que tem**. Diferenças menores que 0,02 ponto por jogo são ruído.

## 1. Desempenho por estilo de técnico
| Estilo | Pontos por jogo | Acima do esperado | Gols pró | Gols contra | Média do time: começo → ano 4 | Acessos por clube | Rebaixamentos por clube | Série no fim (A/B/C/D) |
|---|---|---|---|---|---|---|---|---|
| **Camaleão** | **1,44** | **+0,03** | 1,29 | 1,18 | 57,9 → 62,4 | **0,99** | 0,66 | 9/36/41/19 |
| Futebol arte | 1,39 | +0,01 | 1,30 | 1,27 | 57,5 → 60,7 | 0,82 | 0,75 | 8/21/41/30 |
| Domínio de bola | 1,39 | +0,02 | 1,25 | 1,24 | 57,2 → 60,5 | 0,77 | 0,70 | 6/24/40/29 |
| Retranqueiro | 1,38 | −0,01 | 1,17 | **1,13** | 57,2 → 61,0 | 0,78 | 0,75 | 4/25/44/29 |
| Ofensivista | 1,38 | −0,03 | **1,33** | 1,31 | 57,4 → 60,2 | 0,74 | 0,75 | 2/23/52/28 |
| Equilibrado | 1,37 | −0,01 | 1,22 | 1,23 | 57,4 → 60,1 | 0,71 | 0,72 | 7/22/36/37 |
| Imprevisível | 1,33 | −0,04 | 1,17 | 1,23 | 57,3 → 59,3 | 0,76 | 0,82 | 1/16/28/22 |
| Não compra nada | 1,25 | −0,02 | 1,17 | 1,34 | 57,4 → **55,4** | 0,45 | **0,97** | 0/4/11/25 |
| Investidor | **1,52** | +0,02 | 1,43 | 1,23 | 57,3 → **64,0** | **1,05** | 0,45 | 6/15/16/3 |
| Base | 1,39 | +0,02 | 1,27 | 1,24 | 57,0 → 60,5 | 0,88 | 0,78 | 2/7/24/7 |

No 1º ano, todos ainda na Série C: Camaleão termina em 8º em média (30% sobem, 10% caem); Equilibrado, Ofensivista e Retranqueiro ficam em 11º (14% a 17% sobem, 25% a 28% caem).

## 2. O que cada estilo compra (clubes normais)
Todos os estilos fazem de 1,2 a 1,4 reforços por ano, mais uns 0,5 garotos da base. O reforço tem em média 26 anos e média 64 a 66 (o time tem uns 60) e custa R$ 540 mil a R$ 650 mil. Quase metade vem da Série B, um terço da própria C.

| Estilo | Goleiro / defesa / meio / ataque | Perfil dos atributos (comparado com quem foi comprado na mesma posição) | Características mais compradas |
|---|---|---|---|
| Retranqueiro | **21% / 33%** / 35% / 11% | **DEF +1,3, FIS +0,6, RIT +0,5**; PAS −1,0, DRI −0,8 | Menino prodígio, Driblador, Cabeça de gelo |
| Futebol arte | 13% / 20% / 53% / 15% | **DRI +0,9, CHU +0,8**; DEF −0,9 | **Maestro (27)**, Menino prodígio |
| Domínio de bola | 11% / 16% / **63%** / 11% | **PAS +1,3, RIT +1,0**; DEF −0,7, FIS −0,7 | Menino prodígio, Driblador |
| Ofensivista | 9% / 13% / 52% / **27%** | CHU +0,8, DRI +0,3; DEF −0,6 | Driblador, Coringa, Popstar |
| Camaleão | 12% / 24% / 45% / 19% | equilibrado; compra o reforço mais forte (média 65,6) e mais da Série A (13%) | Driblador, Menino prodígio, Líder nato |
| Equilibrado | 16% / 21% / 47% / 16% | equilibrado | Driblador, Cabeça de gelo, Líder nato |
| Imprevisível | 14% / 26% / 44% / 16% | sem padrão; o reforço mais fraco (63,8) e mais barato | variadas |
| Investidor | 13% / 10% / 31% / 46% | reforço de média 71 e 25 anos, 86% da Série A, R$ 1,1 mi | |
| Base | só garotos (2,2 por ano), todos com característica (quase todos Promessa) | | |

**Resposta aos exemplos do KK:**
- **Retranqueiro** compra mais goleiros e zagueiros que todos (54% das compras), com mais defesa e físico. Leva menos gols (1,13 por jogo), mas faz poucos (1,17). No fim fica na média: 0,78 acesso por clube, com 4 dos 102 chegando à Série A.
- **Futebol arte** compra drible e finalização e quase todos os Maestros do mercado. Rende um pouco acima da média (1,39 pontos por jogo), e 8 dos 100 chegaram à Série A.
- **Não compra nada** vê o time piorar (57,4 → 55,4), porque os veteranos caem e ninguém repõe. Termina com 25 dos 40 na Série D. É o estilo com mais dinheiro em caixa, mas o pior no campo.

## 3. Finanças por estilo (média por clube; caixa inicial de R$ 1,03 mi a R$ 1,08 mi)
| Estilo | Caixa no fim do ano 4 | Compras por ano | Vendas por ano | Salários por ano | Anos com prejuízo |
|---|---|---|---|---|---|
| Equilibrado | R$ 3,72 mi | R$ 811 mil | R$ 623 mil | R$ 858 mil | 22% |
| Futebol arte | R$ 3,36 mi | R$ 833 mil | R$ 529 mil | R$ 959 mil | 27% |
| Domínio de bola | R$ 3,89 mi | R$ 876 mil | R$ 701 mil | R$ 899 mil | 22% |
| Ofensivista | R$ 3,69 mi | R$ 855 mil | R$ 652 mil | R$ 858 mil | 24% |
| Retranqueiro | R$ 3,69 mi | R$ 974 mil | R$ 800 mil | R$ 886 mil | 26% |
| Camaleão | R$ 4,25 mi | R$ 1,01 mi | R$ 812 mil | R$ 1,09 mi | 22% |
| Imprevisível | R$ 3,48 mi | R$ 846 mil | R$ 601 mil | R$ 831 mil | 27% |
| Não compra nada | R$ 4,45 mi | R$ 0 | R$ 71 mil | R$ 640 mil | 4% |
| Investidor | R$ 4,12 mi | R$ 2,10 mi | R$ 1,91 mi | R$ 1,28 mi | 31% |
| Base | **R$ 4,97 mi** | R$ 46 mil | R$ 220 mil | R$ 702 mil | 4% |

Nenhum clube terminou um ano com caixa negativo. O Investidor gasta R$ 2,1 mi por ano, mas recebe quase o mesmo vendendo: os jogadores fortes que ele compra são procurados pelos outros clubes.

## 4. Formações e estilos de jogo na Série C
Mais usados por cada técnico:
- Equilibrado: Jogo de posição, Saída curta e Jogo vertical; 4-2-3-1 e 4-4-2.
- Futebol arte: Relacionismo, Jogo de posição e Jogo vertical; 4-3-3 e 4-2-3-1.
- Domínio de bola: Saída curta (26%), Jogo de posição e Relacionismo; 4-2-3-1 e 4-3-3.
- Ofensivista: Jogo vertical, Contra-pressão e Jogo direto; 4-3-3 e 3-4-3.
- Retranqueiro: Jogo reativo (25%), Jogo direto e Retranca; 5-3-2 e 5-4-1.
- Camaleão: Jogo reativo e Jogo direto, com formações bem variadas.
- Imprevisível: tudo um pouco (10% cada).

Rendimento acima do esperado (todos os jogos de liga na Série C):

| Estilo de jogo | Acima do esperado | Formação | Acima do esperado |
|---|---|---|---|
| Relacionismo | +0,03 | **4-3-2-1** | **+0,09** |
| Jogo reativo | +0,02 | 4-4-2 losango | +0,04 |
| Jogo de posição | 0,00 | 5-3-2 | +0,03 |
| Jogo direto | 0,00 | 4-3-3 | +0,02 |
| Contra-pressão | −0,01 | 3-4-2-1 | +0,01 |
| Retranca | −0,01 | 5-4-1 | +0,01 |
| Jogo vertical | −0,03 | 3-5-2 | −0,02 |
| Saída curta | −0,03 | 4-4-2 | −0,04 |
| Pelos corredores | −0,03 | 4-2-4 | −0,05 |
| Linha alta | −0,04 | 4-2-3-1 | −0,05 |
| | | 4-1-4-1 | −0,05 |
| | | **3-4-3** | **−0,11** |

Os estilos de jogo estão bem equilibrados (no máximo 0,07 ponto por jogo de diferença). As formações variam mais: o 4-3-2-1 rende 0,2 ponto por jogo a mais que o 3-4-3.

## 5. Ideias extras que testei
1. **Estilo contra estilo:** o Camaleão ganha de quase todos (até +0,10 contra o Imprevisível). O Ofensivista sofre contra Domínio de bola, Retranqueiro e Camaleão (−0,06 a −0,07). O Imprevisível perde de quase todos. Tabela completa nos dados (seção 7 do arquivo de análise).
2. **Elenco montado para o técnico:** desde a v42 o elenco inicial é montado conforme o estilo do técnico. Comparei os clubes cujo estilo sorteado era igual ao original (119) com os que ficaram com outro estilo (561): **não há diferença** no 1º ano (−0,005 contra −0,003 acima do esperado) e quase nenhuma nos acessos (0,85 contra 0,79). Hoje o perfil do elenco quase não ajuda o técnico.
3. **Investidor e base na Série C:** o Investidor sobe mais (6 dos 40 na Série A) e o caixa aguenta, porque revende. A base demora 1 ano a mais que na Série D, mas termina com o time tão bom quanto o dos estilos normais e com o maior caixa.

## 6. Pontos para o KK
1. **Camaleão é o melhor estilo e Imprevisível o pior**, por pouco (1,44 contra 1,33 pontos por jogo). Quer equilibrar?
2. **O 3-4-3 rende menos que todas as outras formações** (−0,11), e o 4-3-2-1 mais (+0,09). Quer que eu olhe essas duas?
3. **O perfil do elenco por estilo de técnico não faz diferença.** Quer que o encaixe pese mais (por exemplo, um bônus de sinergia quando o elenco combina com o estilo do técnico)?
4. **Não comprar ninguém derruba o time**, e o estilo base é o mais saudável no caixa. Os dois parecem bons sinais para o jogo.

Scripts: relatorios-kfoot/scripts-30 (est30.js roda um mundo; an30.py junta os 40). Saída completa em scripts-30/an30.txt.
