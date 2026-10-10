# Medições da Melhorias #16: atributos, Série A, sorteio de força e técnicos do computador

Medidas feitas com o motor real do jogo em Node, sem a tela, antes (versão 18, publicada) e depois (esta versão). "Antes" e "depois" usam as mesmas sementes. O erro padrão de cada saldo de gols abaixo é de cerca de ±0,05.

## 1. O que cada atributo faz agora

Teste: o mesmo time joga contra o mesmo adversário duas vezes, uma normal e outra com **+12 em um atributo de todos os jogadores de linha**. A tabela mostra o ganho no saldo de gols por jogo, 1500 jogos por linha.

| Atributo | Ganho antes | Ganho depois | Chutes a mais por jogo (antes → depois) | Faltas sofridas pelo adversário a mais (antes → depois) |
|---|---|---|---|---|
| Ritmo | +0,04 | **+0,25** | +0,38 → +0,93 | −0,03 → +0,16 |
| Finalização (antes "Chute") | +0,44 | **+0,45** | +0,92 → +0,94 | +0,07 → +0,36 |
| Passe | +0,21 | **+0,37** | +0,54 → **+1,93** | +0,13 → +0,33 |
| Drible | +0,21 | **+0,32** | +0,76 → +1,39 | +0,13 → **+0,90** |
| Defesa | +0,28 | +0,26 | (defesa pesa igual) | (igual) |
| Físico | +0,12 | **+0,21** | +0,60 → +0,54 | +0,13 → +0,21 |

Como cada um passou a funcionar:

- **Finalização** (renomeado de Chute, vale também para o cabeceio): é o principal atributo do chute (70%, com 15% de ritmo e 15% de drible), converte bem mais com o bom finalizador, e o cabeceio usa finalização, altura e físico.
- **Passe**: o índice de passe do time (goleiro, zagueiros, laterais e meias) aumenta os lances que chegam ao ataque (+1,9 finalizações por jogo com +12 de passe) e também o controle de bola. O melhor passador bate os escanteios, e quanto melhor o passe, mais cabeçadas.
- **Drible**: em cada ataque o driblador enfrenta o marcador. Quem leva a pior faz falta (macetador faz mais), e a falta vira pênalti se for na área (atacante 24%, meia 11%, zagueiro 2%) ou cobrança direta perto da área. Quem ganha o duelo cria finalização melhor.
- **Ritmo**: entra na qualidade do chute em jogada (15%), faz o marcador chegar antes no desarme e pesa nos contra-ataques (diferença de ritmo entre os times aumenta as finalizações).
- **Físico**: cansa menos (perda de stamina por jogo vai de 26 com Físico 30 para 11 com Físico 99), recupera mais rápido entre os jogos e se lesiona bem menos (risco entre 0,5× e 1,6×), e ajuda no cabeceio.

## 2. Estatísticas por jogo (jogos entre times de prestígio sorteado de 40 a 90)

| Medida | Antes | Depois |
|---|---|---|
| Gols por jogo | 2,58 | 2,67 |
| Finalizações (chutes) por jogo | 20,6 | 22,0 |
| Chutes no gol | 7,5 | 9,2 |
| Escanteios por jogo | não existia | **5,95** |
| Gols de cabeça por jogo | não existia | **0,37** |
| Gols de falta direta por jogo | não existia | **0,21** |
| Pênaltis convertidos por jogo | 0,20 | 0,27 |
| Faltas por jogo | 22,7 | 21,1 |
| Lesões por jogo (2 times) | 0,127 | 0,103 |
| Vitória casa / empate / vitória fora | 39% / 23% / 38% | 44% / 19% / 37% |
| Assistências por gol | 0,55 | 0,64 |

Quem dá o passe do gol: **meias 55%, atacantes 34%, defensores 11%, goleiro ~0%** (antes os meias concentravam a grande maioria). Os gols saem 52% dos atacantes, 34% dos meias e 14% dos defensores.

## 3. Atributos fora do padrão da posição e goleiro batedor

- Cada jogador nasce com mais variação nos atributos, e 16% têm uma especialidade fora do padrão (+8 a +18 em um atributo qualquer, por exemplo zagueiro driblador ou atacante que desarma) e 6% um ponto fraco.
- Cada jogador tem um atributo novo, **Bola parada** (visível na ficha), que acompanha finalização e passe mas com bastante acaso. 10% dos goleiros nascem batedores de falta (estilo Rogério Ceni) e 7% dos jogadores de linha são especialistas.
- Teste do goleiro batedor: time com goleiro de bola parada 90 (os demais limitados a 60) faz **0,075 gol de falta por jogo** contra **0,036** com um goleiro comum, o dobro.
- O técnico escolhe o capitão e os batedores na Escalação (automático por padrão), e a tela mostra a sinergia da escalação e o índice de saída de bola.

## 4. Jogador de linha no gol

Gols sofridos por jogo: goleiro de verdade 1,04 e **centroavante no gol 2,58** (antes: 1,27 e 2,12). O jogador de linha no gol agora é bem pior do que antes, mas não é absurdo.

## 5. Série A mais nivelada

12 temporadas de Série A completas (20 clubes, ida e volta), correlação entre a força do elenco (média dos 14 melhores) e os pontos:

| Medida | Antes | Depois |
|---|---|---|
| Correlação força × pontos | 0,88 | **0,72** |
| Pontos do último ao primeiro (uma temporada) | 17 a 88 | 32 a 76 |
| Média de pontos do campeão | 81,8 | 73,5 |
| Campeões diferentes em 12 temporadas | 4 clubes (Corinthians 5, São Paulo 4) | **7 clubes** (São Paulo 4, Palmeiras 2, Vasco 2 e mais quatro) |

Como: o elenco inicial dos clubes da A é comprimido para a média (fator 0,35), há menos estrelas na A e a sinergia foi normalizada.

## 6. Sinergia normalizada e leitura do intervalo

- A sinergia de cada combinação tática × formação agora é medida contra elencos reais escalados pela escalação automática. Em 60 elencos aleatórios, a média de cada uma das 24 combinações ficou entre −0,7% e 0,0% (antes cada combinação tinha um viés próprio). O teto passou de ±6% para ±8%.
- No intervalo, a leitura compara a nova tática com a que o adversário **jogou no 1º tempo**. O computador não "desfaz" mais a resposta certa do humano. O acerto do técnico do computador no intervalo depende da personalidade dele e da dificuldade (veja abaixo).

## 7. Sorteio de força dos clubes de entrada

Em 40 jogos novos: os 10 sorteáveis seguem sendo os mais fracos da D (overlap pequeno com os outros 10), mas quem é o mais forte e o mais fraco muda a cada jogo. **Cada um dos 10 foi o mais forte pelo menos 1 vez, e cada um foi o mais fraco pelo menos 1 vez.** Média dos 14 melhores: sorteáveis de 41,8 a 52,8 e os outros 10 da D de 46,4 a 54,5.

## 8. Técnicos do computador

Cada clube nasce com um técnico de uma de 6 personalidades, que define quem ele manda para o treino, qual tática prefere e o quanto lê o jogo no intervalo:

| Personalidade | Treina | Tática preferida | Leitura no intervalo |
|---|---|---|---|
| Formador | jovens até 23 anos, no ponto fraco | equilibrada | 55% |
| Ofensivista | finalização, drible e ritmo de atacantes e meias | ofensiva (40% dos jogos) | 50% |
| Retranqueiro | defesa e físico de defensores, volantes e goleiros | defensiva/contra (40%) | 55% |
| Preparador físico | físico e ritmo de qualquer posição | sem preferência | 55% |
| Professor | passe e drible de meias, atacantes e laterais | equilibrada (30%) | 70% |
| Estrategista | quase não treina | sem preferência | 80% |

O computador só coloca no treino quem **não** está entre os 11 do próximo jogo (os que o perfil permite do banco: Formador e Professor). Respeita as regras do humano (até 3 treinando, cooldown, 3 treinos seguidos). O técnico humano vê o perfil do técnico adversário na ficha do clube.

Efeito em 16 temporadas de mundos sem humano (2 mundos × 8 anos):

| Personalidade | Resíduo de pontos por temporada (ajustado pela força no início) | Ganho médio de atributo por temporada |
|---|---|---|
| Estrategista | **+1,7** | +0,19 |
| Ofensivista | +0,5 | +0,23 |
| Retranqueiro | +0,1 | +0,15 |
| Formador | −0,2 | +0,30 |
| Professor | −0,3 | +0,29 |
| Preparador físico | −0,8 | +0,20 |

As diferenças são pequenas (cerca de um ponto por temporada), o que é o desejado: personalidade muda o jeito do clube, não decide campeonato. Esta medição foi feita numa versão um pouco anterior à calibragem final do treino do computador.

## 9. Outras checagens

- **Copa do Brasil** (400 confrontos por linha, 85 × 15): maior agregado mediana 5, p90 9, máximo 12 (antes desta rodada 5 / 7 / 10); favorito avança 96%. As diferenças individuais de atributo também são comprimidas nos jogos da Copa (as de força de equipe já eram).
- **Mundo de 14 anos** (80 clubes, sem humano): média dos 14 melhores estável por divisão (A ≈ 72–74, B ≈ 62–63, C ≈ 55–57, D ≈ 48–49). O caixa médio da A sobe devagar (de 18 para 26 milhões em 13 anos), e o sumidouro de caixa do computador investe perto de R$ 85 milhões por ano em CT e base (20% do caixa acima de 2 folhas anuais). Poucos clubes (2 a 4 em 80) ficam com caixa negativo depois de 12 anos, como já acontecia.
- **Inflação de atributos**: continua existindo e ficou maior que na versão 18. Jogadores com Finalização ≥ 90 depois de 13 anos: **33 contra 16 antes**, efeito da variação maior nos atributos e das premiações. Para segurar, a premiação passou a dar menos pontos a quem já tem atributo alto (nada acima de 87 e menos chance acima de 72) e o computador não treina atributo acima de 80. Se continuar subindo, a próxima ação é limitar a evolução por idade.
- **Diretoria**: a moral do técnico abaixo de 20 gera aviso; 12 jogos seguidos abaixo de 20 com o clube na zona de rebaixamento demite o técnico (opção desligável no início do jogo), que assume um clube pior. Com 6 técnicos passivos (sem mexer na escalação) por 1 temporada, 2 a 3 foram demitidos, e quem joga de verdade deve ficar bem abaixo disso.

## 10. Status das propostas do Relatório 2

1. Leitura do intervalo contra a tática do 1º tempo: feito.
2. Efeito real de ritmo, físico, passe e drible: feito (seção 1).
3. Sinergia normalizada: feito.
4. Jogador de linha no gol: feito.
5. Escalação mostra a sinergia e os papéis: feito.
6. Assistências realistas: feito.
7. Pernas frescas (+10% por 30 min) e substituição automática antes (stamina < 75): feito.
8. Moral: conversa com o elenco, prêmio por vitória, aviso e demissão da diretoria: feito.
9. Série A mais nivelada: feito.
10. Sumidouro de caixa dos clubes do computador: feito.
11. Capitão e batedores de falta, pênalti e escanteio: feito.
12. Dificuldade (Fácil, Normal, Difícil) e força dos clubes sorteáveis escondida: feito.
