# Relatório 18 — Finanças: marketing, estádio, ingresso, patrocínio e uso pelo computador

Versão testada: v33. Nada foi alterado no jogo; este relatório só mede e propõe.

## Resumo em cinco linhas

1. **Marketing não compensa em nenhuma divisão.** A campanha de sócios devolve 23% do que custa e o jogo-evento devolve 12%. Nas simulações pareadas, o clube gastou R$ 66 mil na campanha e ganhou R$ 15 mil de bilheteria.
2. **Aumentar o estádio só vale para 5 ou 6 clubes de 80** (Santos, Fortaleza, Portuguesa, Palmeiras, Atlético-PR). Na Série D, em C e na maior parte de B, a obra não traz um torcedor a mais: o estádio nunca lota.
3. **O ingresso fixo está caro demais** em 71 dos 80 clubes. Baixar o preço renderia de 9% (Série A) a 21% (Série D) a mais de bilheteria, porque a demanda cai pouco com o preço (elasticidade −1,3) e o estádio está vazio.
4. **Patrocínio é pouco dinâmico**: o valor depende só do prestígio e da divisão, a lista é fixa, o contrato dura uma temporada e a melhor escolha é sempre pegar os dois maiores valores. Em compensação, vale de 30% (Série D) a 65% (Série A) da receita do clube.
5. **Os técnicos do computador não usam nenhuma ferramenta**: 0 patrocínios, 0 obras, 0 campanhas e 0 mudanças de preço em 3 sementes x 4 temporadas. Só o jogador humano recebe patrocínio, o que dá a ele uma vantagem estrutural.

## Como foi testado

- **Análise por clube (80 clubes, 4.000 jogos em casa simulados por clube):** forma recente média de 0 (desvio 0,4), 6% de clássicos, ruído de ±8% no público. Calculei custo, ganho e retorno de cada campanha, obra e preço, usando as mesmas funções do jogo (`demandaBruta`, `publico`, `custoMkt`, `custoLugar`, `ofertas`).
- **Simulações pareadas (4 sementes, clube humano na Série D, 2 temporadas):** mesmo mundo e mesma semente, mudando só a ferramenta usada pelo humano: controle, campanha sempre ativa, evento antes de todo jogo em casa, campanha + evento, patrocínios, obra e tudo junto.
- **Computador (3 sementes x 4 temporadas, humano sem mexer em nada):** contei patrocínios, capacidade, preço, campanhas, prestígio e caixa dos 76 a 79 clubes do computador.
- Limites: nas simulações pareadas a semente diverge depois que o humano gasta ou negocia (o sorteio do patrocínio consome números aleatórios), então o "Δ resultado" tem ruído de algumas dezenas de mil. Por isso a leitura principal é bilheteria, patrocínio e custo, que são diretos.

## 1. Marketing

Regras atuais (`parts/fin.js`): campanha de sócios = +18% de demanda em 10 jogos em casa, custa 8 vezes a renda esperada de um jogo. Jogo-evento = +35% de demanda em 1 jogo, custa 3 vezes a renda esperada.

Como o ingresso é fixo e a demanda só sobe 18% ou 35%, o ganho máximo é de 1,8 renda (campanha) ou 0,35 renda (evento) contra um custo de 8 e 3.

| Divisão | Custo da campanha | Ganho | Retorno | Custo do evento | Ganho | Retorno |
|---|---|---|---|---|---|---|
| A | R$ 2,27 mi | R$ 0,46 mi | 0,23 | R$ 0,85 mi | R$ 0,08 mi | 0,12 |
| B | R$ 580 mil | R$ 129 mil | 0,23 | R$ 217 mil | R$ 24 mil | 0,12 |
| C | R$ 215 mil | R$ 49 mil | 0,23 | R$ 81 mil | R$ 10 mil | 0,12 |
| D | R$ 88 mil | R$ 20 mil | 0,23 | R$ 33 mil | R$ 4 mil | 0,12 |

Simulação pareada (Série D, média de 4 sementes, temporada 1):

| Ferramenta | Δ bilheteria | Gasto em marketing | Saldo da ferramenta |
|---|---|---|---|
| Campanha sempre ativa | +R$ 15,5 mil | R$ 66 mil | −R$ 51 mil |
| Evento antes de todo jogo em casa | +R$ 30,2 mil | R$ 212 mil | −R$ 181 mil |
| Campanha + evento | +R$ 51,2 mil | R$ 316 mil | −R$ 265 mil |

**Respondendo: cada opção surte efeito** (a bilheteria sobe nas proporções esperadas), **mas nenhuma se paga**. Em nenhum clube, nem no melhor caso, o retorno passa de 0,23.

Problemas encontrados:
- O custo é 8x e 3x a renda, e o ganho teórico é 1,8x e 0,35x; os números foram definidos sem conferir o retorno.
- A campanha gasta um dos 10 jogos em qualquer competição (`publicoDe` não separa liga e Copa). Jogos de Copa em casa consomem a campanha e o jogador pode ter menos que os 10 jogos de liga que esperava.
- O custo é calculado com a promoção já ativa (`projecao` usa `promo`): contratar o evento durante uma campanha custa 18% mais.
- Com o estádio cheio, o custo continua o mesmo e o ganho é zero (o texto da aba já avisa isso).

Propostas:
- **M1 (recomendada):** recalibrar o custo para dar retorno entre 1,3 e 1,6 num estádio com lotação abaixo de 70%. Campanha = 1,1 vez a renda esperada por jogo (retorno 1,6); evento = 0,25 vez (retorno 1,4). Com estádio acima de 90% cheio, perde dinheiro. Assim passa a existir decisão.
- **M2:** mostrar na tela o retorno esperado ("custa R$ X, deve render R$ Y com a lotação atual") e bloquear o botão com um aviso quando a lotação passa de 85%.
- **M3:** campanha de sócios com efeito duradouro: ao final dos 10 jogos, +2% de demanda permanente (ou +1 de prestígio), para valer mesmo com retorno imediato menor.
- **M4:** contar só os jogos em casa da liga, ou avisar que a Copa também consome a campanha.

## 2. Aumentar o estádio

Custo atual: 25 x ingresso da divisão por lugar (D: R$ 100, C: R$ 150, B: R$ 225, A: R$ 375). A aba diz que "um lugar novo se paga em cerca de 1 a 2 temporadas, se o estádio lotar".

Lotação média esperada com o ingresso padrão: **A 61%, B 44%, C 33%, D 25%**. Só 3 clubes passam de 90% (Santos 98%, Fortaleza 98%, Portuguesa 93%); Palmeiras e Atlético-PR ficam em 89%.

| Clube | Lotação | Obra +10% | Custo | Ganho por ano | Retorno |
|---|---|---|---|---|---|
| Santos (A) | 98% | +2.000 lugares | R$ 750 mil | R$ 344 mil | 2,2 anos |
| Fortaleza (B) | 98% | +1.000 | R$ 225 mil | R$ 97 mil | 2,3 anos |
| Portuguesa (A) | 93% | +2.000 | R$ 750 mil | R$ 182 mil | 4,1 anos |
| Palmeiras (A) | 89% | +3.200 | R$ 1,2 mi | R$ 170 mil | 7,1 anos |
| Atlético-PR (A) | 89% | +2.000 | R$ 750 mil | R$ 104 mil | 7,2 anos |
| Corinthians (A) | 81% | +3.700 | R$ 1,39 mi | R$ 63 mil | 22 anos |

Para os outros 74 clubes o ganho médio com qualquer obra é **zero**. Na simulação pareada, o clube humano da Série D gastou R$ 100 mil numa obra de 2.000 lugares e a bilheteria não mudou nem um real nas duas temporadas.

**Respondendo: não vale a pena, exceto para uns poucos clubes grandes que já lotam.** A frase "se paga em 1 a 2 temporadas" só vale para eles. Nenhum clube que o jogador inicia (Série D) chega perto de lotar.

A demanda de cada clube muda uma vez por ano, junto com o prestígio (de 4 a 15 clubes por divisão mudaram a demanda a cada virada nas 3 sementes), então um clube que cresce pode passar a precisar de obra. Não medi quantas temporadas de sucesso isso leva.

Propostas:
- **E1 (recomendada):** manter o custo, mas mostrar na tela "retorno estimado em N anos" e esconder as opções de obra quando o retorno passar de 15 anos. A dica do botão passa a ser honesta.
- **E2:** a obra também sobe a demanda, por exemplo com um estádio moderno atraindo +3% de demanda por nível, ou como melhoria de conforto que aceita ingresso mais caro. Hoje ela só vale quando já tem fila.
- **E3:** permitir obras menores, de 5% (hoje o mínimo é 10%), para clubes que lotam em picos.

## 3. Preço do ingresso (hoje fixo)

A aba diz "Por enquanto o preço do ingresso é fixo". A função `definirPreco` já existe no motor, mas não há botão. Com elasticidade −1,3, a bilheteria cai com o preço em qualquer estádio que não esteja lotado, então o melhor preço é o menor que ainda enche o estádio.

| Divisão | Preço padrão | Melhor preço por clube | Ganho médio de bilheteria líquida |
|---|---|---|---|
| A | R$ 15 | R$ 8 a R$ 19 | +9% |
| B | R$ 9 | R$ 5 a R$ 11 | +13% |
| C | R$ 6 | R$ 3 a R$ 6 | +20% |
| D | R$ 4 | R$ 2 a R$ 3 | +21% |

71 dos 80 clubes ganhariam mais de 2% com o preço ótimo. Em C e D, o ótimo fica no piso (metade do padrão).

Proposta:
- **I1 (recomendada):** liberar o preço no limite atual (0,5x a 3x), mas com elasticidade mais suave (−0,7 em vez de −1,3). Assim o preço ótimo fica perto do preço que enche o estádio e não é sempre "o mais barato". Preço baixo pode também elevar a moral e o prestígio da torcida; preço alto reduz.
- **I2:** sem mexer na elasticidade, liberar o preço e deixar o jogador descobrir. O risco é a solução ser sempre "baixe ao piso".

## 4. Patrocínio: está estático?

O que existe: 30 patrocinadores em 12 categorias, cada um com valor-base e prestígio mínimo. Valor = base x fator da divisão (A 1, B 0,25, C 0,08, D 0,025) x (0,3 + prestígio x 0,009). Máximo de 2 por clube, categorias diferentes, contrato de uma temporada, recusa implica esperar 4 rodadas.

Achados:
- **O valor só muda quando o prestígio muda, uma vez por ano.** Dentro da temporada é o mesmo valor, ganhe ou perca. A divisão é um fator fixo.
- **O desempenho só afeta a chance de aceite**, não o valor. Nas simulações o humano fechou 16 de 31 propostas (52%) e terminou todas as temporadas com os 2 contratos, então a decisão não tem tensão.
- **A melhor escolha é sempre a mesma**: os dois maiores valores com categorias diferentes. Não há dilema entre risco, duração, bônus ou categoria.
- **Tudo reinicia a cada temporada** (`novoAno` zera os contratos): o jogador refaz as propostas todo ano.
- **Peso na receita** (dois melhores contratos contra bilheteria + TV + patrocínio): A 65%, B 56%, C 40%, D 30%. No humano da Série D: R$ 59 mil por ano contra R$ 50 a 150 mil de bilheteria.
- **Poucas ofertas na base**: o clube de prestígio 8 vê 12 a 20 patrocinadores com valor.

**Respondendo: sim, são bastante estáticos.** O dinheiro é grande, mas a decisão é trivial.

Propostas:
- **P1 (recomendada):** contratos de 1 a 3 anos (valor 10% maior no longo), renovação oferecida no fim da temporada em vez de recomeçar do zero.
- **P2:** parte fixa + variável: bônus por meta (acesso, título, fugir do rebaixamento, chegar longe na Copa). Dá risco e escolha: contrato seguro x contrato arrojado.
- **P3:** valor reage ao desempenho em vez de só ao prestígio de início de ano: reajuste a cada 10 rodadas, ou o patrocinador que sai por queda e outro que aparece por boa fase, via notícia.
- **P4:** patrocinador master (camisa) e secundário (calção/manga), com valores diferentes.

## 5. Os técnicos do computador usam essas abas?

**Não.** Em 3 sementes x 4 temporadas (76 a 79 clubes do computador por temporada):

| Ferramenta | Clubes do computador que usaram |
|---|---|
| Patrocínio | 0 |
| Aumento de estádio | 0 (capacidade nunca muda) |
| Campanha ou evento | 0 |
| Mudança de preço | 0 (só muda o padrão da divisão quando sobe ou desce) |

Nenhuma função de `bf.Fin` (`marketing`, `ampliar`, `propor`, `definirPreco`) é chamada fora da tela do jogador. Os 80 clubes têm `patrocinadores = []` e preço padrão.

Consequências:
- **Vantagem estrutural do humano.** Um clube humano de Série A com 2 contratos receberia cerca de R$ 16 milhões por temporada a mais que um rival equivalente do computador, perto do dobro da bilheteria mediana da Série A (R$ 8,5 milhões na simulação). Na Série D a vantagem é de R$ 60 mil, proporcionalmente grande (40% da bilheteria).
- **Caixa do computador estável**: nenhum clube ficou negativo em 12 temporadas; a mediana da Série A oscila entre R$ 12 e R$ 19 milhões. O computador sobrevive sem patrocínio, mas à custa de uma economia diferente da do jogador.
- **Estádios travados**: Santos e Fortaleza lotam e seguem para sempre com a mesma capacidade.
- **Preço fixo ineficiente** em 71 dos 80 clubes (item 3).

Propostas:
- **C1 (recomendada):** rotina simples de finanças para o computador no início de cada temporada. (a) Patrocínio: faz propostas na ordem de valor, com a mesma chance de aceite do humano. (b) Obra: só quando a lotação média passar de 90% e o caixa cobrir 3x o custo. (c) Preço: ajusta ao preço ótimo conforme o perfil do técnico (Ofensivista e Dominio de bola mais baratos, Retranqueiro mais caro). (d) Marketing: fica de fora até o item 1 ser recalibrado.
- **C2:** como C1 dobra a receita do computador na Série A, o ideal é conferir depois o efeito nas compras (`iaCompras`), nos salários e no caixa negativo dos robôs, e recalibrar com um relatório novo.

## Ordem sugerida

1. M1 + M2 (marketing com retorno real e aviso de retorno).
2. I1 (ingresso liberado, elasticidade suave).
3. C1 (computador usa patrocínio, obra e preço) e re-teste (C2).
4. P1 + P2 (patrocínio com mais decisão).
5. E1 (retorno estimado da obra) e E2 (demanda sobe com a obra).

Nada foi implementado; aguardo a decisão do KK.

Scripts desta rodada: `f18a.js` (visão geral), `f18b.js` (4 temporadas de controle), `f18c.js` (simulações pareadas) e `f18d.js` (retorno por clube), na pasta de laboratório.
