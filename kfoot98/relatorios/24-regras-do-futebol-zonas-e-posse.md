# Relatório 24 — Regras do futebol no motor: saída de bola, zonas, faixas, faltas e posse (v38)

Pedido do KK (Melhorias #34, 2026-10-11): aplicar as regras básicas do futebol e as marcações do campo para um simulador melhor, com saída de bola, lados, zonas e faixas, posições diferentes para laterais e pontas de cada lado, e as soluções propostas no relatório 23 (seções 7 a 11).

## 1. O que foi implementado

| Regra / proposta | Como ficou no jogo |
|---|---|
| Regra 1 (campo) | Campinho na tela da partida com as medidas oficiais (105 × 68: grande área 16,5 × 40,3; pequena área 5,5 × 18,3; marca do pênalti a 11 m; meia-lua e círculo central de 9,15 m; traves de 7,32 m), linhas dos terços e dos cinco corredores (lateral, meio-espaço, central). |
| Regra 3 (jogadores) | Sem mudança: substituições continuam como estão. |
| Regra 7 (duração) | Sem mudança: acréscimos já levam em conta faltas, pênaltis e substituições fora do intervalo. |
| Regra 8 (início e reinício) | O mandante escolhe o lado; o visitante toca a bola no meio-campo. No 2º tempo os lados se invertem e o mandante dá a saída. Na prorrogação alterna de novo. Depois de cada gol, sai quem sofreu. Na saída todos estão no próprio campo (o campinho mostra isso) e avançam nos 3 primeiros minutos. |
| Regra 10 (resultado) | Já era assim: prorrogação e pênaltis só na Copa do Brasil com o agregado empatado; gols da disputa não contam para o time nem para a artilharia. |
| Regra 11 (impedimento) | Já existia; agora o impedimento devolve a bola ao campo de defesa de quem defende. |
| Regra 12 e 14 (faltas e pênalti) | Toda falta tem zona e faixa. Pênalti só acontece em falta dentro da grande área. O relato mostra o local. |
| Regra 13 (tiros livres) | Perto da área pelo centro: cobrança direta. Pelos lados: falta lateral com cruzamento. Longe: tiro livre comum. |
| Regras 15, 16 e 17 | Laterais e tiros de meta contados nas estatísticas; escanteio já existia. |
| Bola 1 a 4 | Estado da bola: dono, zona (5), faixa (5) e lado de ataque de cada time. Saída implementada antes das zonas, pois é o estado inicial delas. |
| Área da bola 1 a 3 | Matriz de transição por minuto, com a posse do minuto como viés (a posse média não muda). Cada lance registra a zona: relato com local, posse por terço, faltas por zona e pênalti na área. |
| Faltas 1 a 3 | Falta de duelo gerada já com a zona; fator extra de disciplina na própria área; goleiro pode ser o infrator no cara a cara (pênalti e vermelho de último homem). |
| Laterais e pontas | LE e PE jogam pela esquerda, LD e PD pela direita, o 1º ALA pela esquerda e o 2º pela direita; duplas centrais nos meios-espaços. O ataque sai por uma faixa e quem participa (passe, drible) é dela; a marcação é da faixa espelhada. |

Sobre as faixas: o relatório 23 falava em 3 faixas, mas a imagem enviada pelo KK tem 5 corredores (lateral, meio-espaço, central, meio-espaço, lateral). Usei as 5; quem quiser ler como 3 é só juntar lateral + meio-espaço de cada lado.

## 2. Como a bola anda

- **Estado da bola:** dono, zona (própria área, campo de defesa, meio-campo, campo de ataque, área adversária, sempre vista por quem tem a bola) e faixa (lateral esquerda, meio-espaço esquerdo, central, meio-espaço direito, lateral direita, vistas por quem ataca). Cada time sabe para que lado ataca.
- **Minuto sem ataque:** a bola troca de dono com chance 0,55 × (1 − posse do minuto). Quem recupera fica com ela onde ela estava. Se não troca, avança, fica ou recua uma zona: quem tem mais posse avança mais, "saída curta" segura mais e "jogo direto" avança mais. Como a troca de dono usa a posse do minuto como viés, cada time continua com a mesma posse média de antes.
- **Minuto com ataque:** o ataque sai por uma faixa (metade das vezes pela faixa onde a bola já estava; senão, sorteada pelo peso de RIT, DRI e PAS de quem joga nela; estilos que abrem o campo pesam mais nas laterais). A bola vai ao campo de ataque; na finalização entra na área. No desarme ou impedimento, quem defende sai com ela do seu campo de defesa. Depois de um lance na área, quem defende recomeça de trás (tiro de meta ou bola dominada).
- **Quem participa:** quem passa e quem dribla é, de preferência, da faixa do ataque; quem marca e quem desarma é da faixa espelhada. Um lateral direito fraco sofre mais quando o ponta-esquerda adversário é bom.
- **Posse por terço:** conta o caminho que a bola fez em cada minuto, com mais peso no meio-campo, que é onde o jogo mais se arrasta.

## 3. Medições: v37 × v38 (1000 jogos por série, mesmas escalações)

| | v37 A | v38 A | v37 B | v38 B | v37 C | v38 C | v37 D | v38 D |
|---|---|---|---|---|---|---|---|---|
| Gols por jogo | 1,99 | 2,07 | 2,16 | 2,04 | 2,08 | 2,05 | 2,21 | 2,14 |
| Vitória do mandante | 38,9% | 38,5% | 41,3% | 38,9% | 41,7% | 42,6% | 40,6% | 41,8% |
| Empates | 30,4% | 33,2% | 28,1% | 30,6% | 27,3% | 26,8% | 29,0% | 29,3% |
| Chutes por jogo | 21,9 | 21,6 | 23,3 | 23,1 | 23,5 | 23,1 | 23,9 | 23,4 |
| Faltas por jogo | 21,5 | 21,2 | 21,3 | 21,5 | 21,3 | 21,2 | 21,4 | 21,4 |
| Pênaltis por jogo | 0,42 | 0,47 | 0,41 | 0,45 | 0,43 | 0,39 | 0,45 | 0,48 |
| Gols de falta direta | 0,09 | 0,09 | 0,09 | 0,07 | 0,07 | 0,07 | 0,07 | 0,05 |
| Vermelhos por jogo | 0,17 | 0,21 | 0,14 | 0,17 | 0,13 | 0,15 | 0,13 | 0,18 |
| Posse do mandante | 54,0% | 54,0% | 53,8% | 53,9% | 53,9% | 53,7% | 54,1% | 54,1% |

Média das 4 séries: gols 2,11 → 2,08; vitória do mandante 40,6% → 40,5%; pênaltis 0,43 → 0,45. As diferenças estão dentro do ruído de 1000 jogos (cerca de ±0,05 gol), menos os vermelhos: subiram cerca de 0,03 por jogo, por causa do goleiro último homem e dos porradeiros mais presentes perto da própria área.

**Novos números da v38**
- Saídas de bola por jogo: 4,0 (início, 2º tempo e uma depois de cada gol).
- Posse por terço (média de todos os times): defesa 34%, meio 29%, ataque 37%.
- Local das faltas (visto por quem sofre): campo de defesa de quem sofre (pressão lá na frente) 32%, meio-campo 32%, perto da área 36% (28% de frente, 8% pelos lados).
- Faltas por faixa (por jogo): lateral esquerda 2,2; meio-espaço esquerdo 3,8; centro 9,1; meio-espaço direito 3,8; lateral direita 2,2.
- Laterais por jogo: 20; tiros de meta: 5.
- Goleiro último homem: 0,02 por jogo (1 caso a cada 40 a 55 jogos).
- Faltas a cada 90 minutos: goleiro 0,07 (era 0,86); líbero 1,25; volante 1,19; meia 1,14; zagueiro 1,13; meio-campista 1,10; laterais 0,95 a 0,98; centroavante 0,84; pontas 0,61 a 0,64.
- Onde cada posição faz falta: zagueiro e lateral 56% a 57% perto da própria área; volante 42%; meias cerca de 33%; centroavante 46% no campo de ataque.
- Pênaltis por infrator (4000 jogos): zagueiro 35%, laterais 22%, volante e meio-campistas 16%, goleiro 6%. Porradeiros e macetadores cometem 51% dos pênaltis (eram 48%).

## 4. O que ficou de fora ou pode melhorar

1. A falta ainda não gera vítima sorteada na falta geral (só na falta de drible); lesão continua independente da falta (relatório 23, seção 3).
2. O lateral e o tiro de meta são só estatística: não mudam quem fica com a bola nem criam lances.
3. A matriz de transição usa o estilo (saída curta, jogo direto) e a posse; ainda não usa diretamente o passe e a marcação de cada jogador na troca de dono.
4. O campinho mostra posições aproximadas (linhas da formação e faixas), não um posicionamento jogador a jogador.
5. Os vermelhos subiram cerca de 0,03 por jogo. Se o KK achar demais, dá para baixar a chance do goleiro último homem (hoje 1,2%) ou o peso dos porradeiros perto da área.
