# Relatório 20 — Estádio por áreas, sócios-torcedores e efeito nas finanças (v36)

Versão testada: v36. Mede os estádios novos, o preço automático e os sócios, e mostra como isso mexeu nas finanças e no jogo. Não mexi no equilíbrio geral do caixa: o diagnóstico no fim é para a próxima conversa.

## O que mudou

- **Estádios equilibrados por divisão:** capacidade inicial dentro de uma faixa por série (A 25 a 60 mil, B 15 a 35 mil, C 8 a 20 mil, D 4 a 12 mil), seguindo a demanda do clube, com variação fixa de ±22% por clube. A demanda de cada série foi recalibrada para a lotação média inicial ficar em torno de 64% (A), 62% (B), 58% (C) e 55% (D).
- **Três áreas:** arquibancada, cadeiras e VIP, cada uma com preço próprio e público próprio. Série A começa com 58% / 33% / 9% dos lugares, B com 72% / 25% / 3%, C com 84% / 16% / 0% e D com 88% / 12% / 0%. VIP pode ser construído em qualquer série.
- **Preço automático por jogo:** em cada jogo o preço de cada área varia entre 80% e 140% do preço escolhido, conforme a demanda do jogo (clássico, fase final da Copa, reta final da liga, jogo contra o líder). O modo "Fixo" desliga isso.
- **Obras por área com prazo:** arquibancada (15x o ingresso médio da série por lugar, lotes de 5%, 10% e 20%), cadeiras (40x, lotes de 3%, 6% e 12%) e VIP (150x, lotes de 20, 40 e 80 lugares). A obra é paga na hora e fica pronta em 2 a 8 rodadas da liga; o setor continua aberto. Máximo de 4 obras por área e uma de cada vez.
- **Sócios-torcedores:** cada clube tem um número de sócios (começa em 25% da demanda do clube). Eles vão aos jogos de liga e Copa mesmo com ingresso caro, pagam metade do ingresso e uma mensalidade nas rodadas da liga (Bronze, Prata ou Ouro). Mais sócios aumentam a demanda geral.
- **O que mexe nos sócios:** vitória +0,45% e derrota −0,45% por jogo (dobro em goleada e clássico), 5 vitórias seguidas +2%, 5 jogos sem vencer −2%, estrela que chega +1,5% e que sai −1,5%, cada Popstar sadio +0,06% por rodada (máx. 3), campanha de sócios +3% a +8%, título +10%, acesso +8%, rebaixamento −12%, e a mensalidade (Bronze +0,25% por rodada, Ouro −0,25%).
- **Computador:** começa a temporada escolhendo a mensalidade (Bronze se tem poucos sócios, Ouro se tem muitos), constrói obra na área que lotou (lotação média acima de 90% e caixa de 3 vezes o custo) e usa o preço automático.

## 1. Tamanho dos estádios

| Divisão | Menor (antes → agora) | Mediano | Maior (antes → agora) | Maior ÷ menor (antes → agora) |
|---|---|---|---|---|
| A | 19.000 → 26.100 | 37.000 → 44.100 | 100.000 → 69.200 | 5,3x → 2,7x |
| B | 10.000 → 14.000 | 20.000 → 22.500 | 100.000 → 31.800 | 10x → 2,3x |
| C | 6.000 → 6.500 | 19.000 → 12.300 | 40.000 → 20.300 | 6,7x → 3,1x |
| D | 5.000 → 3.700 | 10.000 → 8.400 | 43.000 → 12.700 | 8,6x → 3,4x |

Lotação esperada de um jogo normal no início (menor, mediana, maior): A 52% / 64% / 79%, B 49% / 62% / 73%, C 42% / 58% / 91%, D 27% / 55% / 87%. Só 1 clube de 80 começa acima de 90%, mas nos picos (clássico, fase final) vários passam disso.

Depois de 4 temporadas (semente 1), a lotação mediana ficou em 66% (A), 59% (B), 52% (C) e 65% (D), e 6 clubes da Série D passaram de 90% (demanda crescendo com o prestígio sem o estádio crescer). Estádio grande que desce de série continua grande: um clube que caiu da A tem 66 mil lugares na B (maior estádio da B no fim).

## 2. Efeito nas finanças (mediana por clube do computador, 1ª temporada, semente 1)

| Divisão | Bilheteria v35 | Bilheteria v36 | Sócios (mensalidades) | Receita total v35 | Receita total v36 |
|---|---|---|---|---|---|
| A | R$ 8,5 mi | R$ 9,8 mi (+16%) | R$ 1,28 mi | R$ 22,6 mi | R$ 25,4 mi (+12%) |
| B | R$ 1,8 mi | R$ 2,1 mi (+15%) | R$ 0,34 mi | R$ 4,5 mi | R$ 5,1 mi (+14%) |
| C | R$ 0,68 mi | R$ 0,57 mi (−16%) | R$ 0,13 mi | R$ 1,28 mi | R$ 1,31 mi (+2%) |
| D | R$ 0,25 mi | R$ 0,29 mi (+18%) | R$ 0,065 mi | R$ 0,40 mi | R$ 0,51 mi (+28%) |

(Receita total = bilheteria + TV + patrocínio + sócios.) Os estádios por áreas e os sócios aumentaram a receita de 2% a 28%, um pouco mais que o planejado; o ajuste fino do preço das áreas e dos tiers pode baixar isso.

Caixa mediano do computador no fim de cada temporada (semente 1): Série A R$ 30,8 mi → 35,2 mi → 48,3 mi → 56,5 mi; B 6,9 → 8,9 → 11,1 → 12,5 mi; C 2,0 → 2,4 → 3,0 → 3,2 mi; D 0,74 → 0,91 → 0,93 → 1,16 mi. **Nenhum clube do computador ficou no negativo em 4 temporadas.** O estádio por áreas não resolve o problema do caixa alto: a maior fatia da receita continua sendo patrocínio (na Série A, 11,3 de 25,4 mi) e os salários só subiram de 4,6 para 6,3 mi.

## 3. Preço automático por jogo

Comparando 1 temporada com todos os clubes em modo automático e em modo fixo (3 sementes), a bilheteria média ficou praticamente igual: A +0,1%, B 0,0%, C 0,0%, D 0,0%. Por faixa de lotação da arquibancada: abaixo de 50%, 0,0%; 50% a 70%, 0,0%; 70% a 85%, 0,0%; acima de 85%, +0,3%.

**O preço automático quase não faz diferença hoje**, porque só sobe preço quando a demanda passa dos lugares, e a maioria dos clubes não lota. Ele só aparece em jogo decisivo de clube que já está quase cheio. Se o KK quiser que ele pese, as opções são: importância dos jogos maior (+30% a +80%), estádios menores ou demanda maior (mais jogos lotados) ou preços menos sensíveis em jogos decisivos.

## 4. Sócios

Variação do número de sócios em uma temporada, por posição final (média de 3 sementes):

| Divisão | 25% de cima | Meio | 25% de baixo | Menor | Maior |
|---|---|---|---|---|---|
| A | +8,9% | −1,1% | −10,3% | −19,9% | +20,1% |
| B | +7,7% | −2,2% | −13,1% | −22,9% | +15,1% |
| C | +5,2% | −3,4% | −9,4% | −15,4% | +12,7% |
| D | +13,7% | −1,7% | −16,5% | −26,5% | +23,2% |

Bom time ganha sócios e time ruim perde, como esperado. Após 4 temporadas a proporção de sócios sobre a demanda ficou em 24% (A), 21% (B), 22% (C) e 16% (D); na D a perda vem de rebaixamento e de clubes pequenos que não ganham, e a regra de Bronze automático (abaixo de 15%) segura a queda.

O ajuste feito durante a calibração: vitória e derrota passaram a valer o mesmo (±0,45%); antes (+0,4% e −0,5%) o clube médio perdia sócios o ano todo.

## 5. Obras do computador

Clubes com pelo menos uma obra concluída ao fim de cada temporada (semente 1): 1998 nenhum; 1999 B 1, C 1; 2000 A 1, B 4, C 3, D 1; 2001 A 3, B 4, C 2, D 4 (de 20 clubes por série). Obra por área só ocorre quando a lotação média da área passa de 90%.

## 6. Efeito no jogo

- **O público ainda não influencia o resultado das partidas** (não há vantagem de casa por lotação). O estádio mexe só no caixa e na proporção de sócios.
- O jogo continua rodando sem erro nas 24 telas e fluxos da regressão.

## 7. Diagnóstico para a conversa sobre finanças

Dados para pensar no que o KK escreveu (caixa alto demais, ninguém no negativo, escolhas com consequências):
- **Todo clube termina no azul** nas 4 temporadas. A Série A acumula R$ 5 a 12 mi por ano por clube.
- **Receita muito acima da despesa:** a Série A recebe R$ 25 mi e gasta em salários R$ 4,6 a 6,3 mi mais custos fixos de R$ 3,5 mi e custos de jogo de cerca de R$ 1,5 mi. O patrocínio sozinho (R$ 11 mi) cobre todos os salários.
- **Os destinos do dinheiro são pouco exigentes:** compras no máximo 3 por temporada e investimento em CT e base só acima de 2 folhas anuais.
- **Faltam escolhas com risco:** não há luxos que o clube pode escolher e depois pagar (salários acima do que a receita sustenta), nem imprevistos (multa, dívida de obra, queda de patrocínio sem rebaixamento).
- Alavancas possíveis (nenhuma aplicada): reduzir o valor dos patrocinadores para o computador, aumentar salários e custos fixos com o prestígio, juros e obras financiadas, multas por inadimplência com vendas forçadas, e punição de moral mais cedo para o caixa baixo.

Scripts: `f32a.js` (faixas de capacidade), `f32b.js` (4 temporadas), `f32c.js` (automático x fixo e sócios x posição).
