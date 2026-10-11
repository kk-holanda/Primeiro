# Relatório 19 — Finanças v35: marketing, ingresso, patrocínio e computador

Versão testada: v35. Este relatório mede o que a Melhorias #31 mudou e confere o efeito no caixa do computador (item C2 do relatório 18).

## O que mudou (resumo)

- **Marketing:** campanha custa 1,1 × a renda de um jogo e o evento 0,25 × (antes 8 e 3). A tela mostra o retorno esperado e bloqueia a compra acima de 85% de lotação.
- **Ingresso:** o jogador escolhe o preço. Elasticidade em dois trechos: −0,7 abaixo do padrão da divisão e −1,8 acima.
- **Patrocínio:** posições master (valor cheio) e secundário (40%); contratos de 1 a 3 anos (+5% e +10% por ano); bônus por meta (livrar, top 4, título); revisão a cada 10 rodadas da liga (±5%, rompimento na lanterna, convite para quem vai bem).
- **Computador:** no começo de cada temporada fecha patrocínios, escolhe o melhor preço e amplia o estádio em 10% se a lotação média passou de 90% e o caixa cobre 3 vezes a obra.

## 1. Marketing (Série D, 4 sementes, 1 temporada, pareado com controle)

| Ferramenta | Δ bilheteria | Gasto em marketing | Retorno |
|---|---|---|---|
| Campanha sempre ativa | +R$ 16,5 mil | R$ 9,5 mil | 1,7x |
| Evento antes de todo jogo em casa | +R$ 32,1 mil | R$ 18,5 mil | 1,7x |
| Campanha + evento | +R$ 54,4 mil | R$ 28,0 mil | 1,9x |

Antes (relatório 18): 0,2x, 0,1x e 0,2x. O retorno esperado que a tela mostra (1,6x e 1,4x com o estádio vazio) bate com o medido (1,7x). Com o estádio acima de 85% o botão fica bloqueado, então não há como queimar dinheiro em casa cheia.

Observação: nos clubes de Série D a lotação é de 6% a 16%, então o ganho é o máximo possível. Em clubes com 60% a 80% de lotação o retorno cai porque parte da demanda extra passa da capacidade.

## 2. Ingresso

Com a elasticidade nova, o preço padrão da divisão passa a ser o melhor preço para praticamente todos os clubes (ganho de bilheteria de 0,0% na mediana em A, B, C e D; no máximo 0,6% num clube da Série A). Só os clubes que lotam sobem um pouco: Santos passa de R$ 15 para R$ 16.

Ou seja, a escolha livre do preço existe, mas hoje quase não há o que ganhar mudando. O preço só vira decisão forte com a proposta de preço por jogo e por área do estádio (documento de proposta do estádio).

## 3. Patrocínio

Jogador (Série D, 4 sementes): com master + secundário de 1 ano (sem bônus), o clube fechou 2 patrocínios em todas as temporadas, em média R$ 40 mil de receita extra (antes, com 2 contratos iguais, R$ 58 mil). A diferença vem do secundário valer 40%.

Computador, 3 sementes x 4 temporadas:

| Divisão | Clubes com 2 patrocínios | Patrocínio mediano por temporada |
|---|---|---|
| A | 19 ou 20 de 20 | R$ 10,8 a 12,4 mi |
| B | 20 de 20 | R$ 1,8 a 2,0 mi |
| C | 20 de 20 | R$ 0,34 a 0,39 mi |
| D | 19 de 19 | R$ 68 a 89 mil |

Antes disso, o computador tinha 0 contratos. Para o clube humano de Série A, a vantagem sobre um rival do computador cai de cerca de R$ 16 mi para cerca de R$ 11 mi (valor do master + secundário), e agora o rival também recebe.

## 4. Caixa do computador (C2)

Mediana do caixa por divisão no fim de cada temporada (3 sementes, média das medianas):

| Divisão | Antes (2001) | Agora (2001) |
|---|---|---|
| A | R$ 11,9 a 18,6 mi | R$ 46 a 52 mi |
| B | R$ 4,9 a 6,2 mi | R$ 8,8 a 12,1 mi |
| C | R$ 1,7 a 2,7 mi | R$ 2,7 a 3,2 mi |
| D | R$ 0,7 a 1,2 mi | R$ 1,0 a 1,5 mi |

- Nenhum clube do computador ficou com caixa negativo em 12 temporadas.
- Os clubes da Série A acumulam caixa: sem destino para o dinheiro, a mediana quase triplica em 4 anos. O único destino automático é o investimento em CT e base (20% do que passa de 2 folhas anuais): R$ 11 a 12,5 mi por clube acumulado em 4 anos, contra R$ 2 a 2,6 mi antes.
- Mesmo assim, a força dos elencos não mudou: nota média dos 14 melhores jogadores por divisão em 2001, A 74,0 a 74,4 (antes 74,1 a 74,2), B 64,9 a 65,7 (antes 65,3 a 65,8), C 57,6 a 58,4 (antes 57,1 a 58,1), D 49,6 a 50,3 (antes 49,8 a 50,5). A diferença está dentro do ruído.
- Uso das obras e do preço: 2 a 4 clubes da Série A e 1 a 3 da B ampliam o estádio por temporada, quase nenhum de C e D; de 1 a 9 clubes por divisão mudam o preço, principalmente os que sobem ou descem.

Conclusão: a economia do computador ficou mais folgada sem mexer na força dos times; o dinheiro só se acumula. Se o KK quiser, uma proposta simples é reduzir o valor do patrocínio dos clubes do computador (por exemplo, 60% do valor) ou dar um destino ao excesso de caixa (mais compras, salários maiores). Não alterei nada.

## 5. Observações

- Nas simulações pareadas, o técnico humano que não faz nada acaba demitido (já era assim), e o clube passa a ser controlado pelo computador. Por isso os valores absolutos de patrocínio do clube "humano" nos controles não são zero, e a comparação usa sempre a mesma semente.
- Nas simulações só observei o reajuste de ±5% (a notícia aparece). O rompimento de contrato na lanterna e o convite por bom momento estão no código, mas não foram exercitados em teste.
- Próximo passo sugerido pelo KK: a proposta de estádio por áreas e sócios-torcedores (documento de proposta do estádio).
