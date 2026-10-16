# Kfoot 98: análise geral e ideias para as próximas mudanças (v54)

Data: 16/10/2026. Pedido do KK: olhar o jogo inteiro e propor o que melhorar, para discutirmos antes de mexer. Nada foi mudado no jogo.

**O que usei:**
- um teste longo novo, com 8 mundos de 8 temporadas cada (cerca de 12 mil jogos de liga por temporada somando os mundos);
- os relatórios 25 a 30;
- o documento de futuras features;
- capturas de todas as telas, no computador e no celular (pasta capturas/analise-v54).

## Resumo: as 10 que eu faria primeiro
| # | Área | O que | Por quê | Tamanho |
|---|---|---|---|---|
| 1 | Celular | Nomes dos times quebram no meio no placar do jogo ao vivo ("OPERÁR IO-VG", "COLATIN A") | É o que mais aparece no celular | Pequeno |
| 2 | Telas | "Média do time" no Plantel usa o elenco inteiro (41,7) e no resto do jogo usa os 11 melhores (uns 50) | Confunde a comparação com os adversários | Pequeno |
| 3 | Começo do jogo | O humano começa sem patrocinador (o 1º jogo mostra patrocínio R$ 0), enquanto o computador já tem | Quem não sabe perde dinheiro sem perceber | Pequeno |
| 4 | Copa do Brasil | Em 8 de 8 temporadas, o campeão foi da Série A | Falta a graça da zebra na Copa | Médio |
| 5 | Série D | O fundo da D afunda: o pior time cai de 45 para 40 de média, e o lanterna faz 11 pontos | Clube pequeno fica preso sem saída | Médio |
| 6 | Mercado | Os livres quase não servem: depois do 2º ano só 2 contratações por temporada, com 50 parados | Uma parte do mercado que ninguém usa | Médio |
| 7 | Carreira | Metas da diretoria por temporada (subir, não cair, ir longe na Copa) com prêmio ou cobrança | Dá um objetivo claro a cada ano | Médio |
| 8 | Elencos | O elenco da Série A envelhece (idade média de 26 para 29 anos em 8 anos) | Times velhos e pouca renovação | Médio |
| 9 | Torcida | Torcida dividida 80/20, ônibus de torcedores e impacto da torcida no jogo (já no documento de futuras features) | Mando de campo com mais sentido | Médio |
| 10 | Online | Primeiro teste real pela internet com amigos | O modo online só foi testado aqui dentro | Pequeno (é jogar) |

## 1. O que o teste longo mostrou (8 mundos × 8 temporadas)
| Medida | Temporada 1 | Temporada 4 | Temporada 8 |
|---|---|---|---|
| Gols por jogo (A / B / C / D) | 2,62 / 2,78 / 2,46 / 2,37 | 2,82 / 2,62 / 2,41 / 2,59 | 2,93 / 2,77 / 2,77 / 2,74 |
| Vitórias em casa / empates | 41% / 24% | 41% / 24% | 42% / 23% |
| Jogos com 6 gols ou mais | 4,9% | 5,4% | 6,9% |
| Idade média na Série A | 26,0 (início) | 27,4 | 29,0 |
| Pior time da Série D (média dos 11) | 44,8 (início) | 40,3 | 39,9 |
| Pontos do lanterna da Série D | 20 | 12 | 11 |
| Caixa mediano da Série A | R$ 4,7 mi (início) | R$ 18,7 mi | R$ 22,4 mi |
| Clube mais rico da Série A | R$ 5,5 mi (início) | R$ 69,8 mi | R$ 86,4 mi |
| Clube mais rico da Série D | R$ 0,6 mi (início) | R$ 4,9 mi | R$ 20,7 mi |
| Clubes com caixa negativo | 0 | 0 | 0 |
| Campeão da Copa do Brasil | Série A em 8 de 8 | Série A em 8 de 8 | Série A em 8 de 8 |

**O que está bom:** vitórias em casa e empates estão realistas e estáveis. As séries continuam separadas (A 75, B 67, C 61, D 54 de média), as estrelas e características se mantêm, o computador continua comprando (80 por temporada) e a base é bem usada (45 garotos por temporada).

**O que preocupa:**
1. **Gols sobem devagar** (2,5 para 2,8 em 8 anos). O motivo é a finalização dos jogadores da C e D, que sobe 7 pontos, mais que os outros atributos. Não é urgente, mas vale um freio na evolução de finalização ou um reforço na defesa.
2. **O fundo da Série D afunda.** O pior time piora todo ano e não há como sair dali (a D não tem rebaixamento). Ideias: um clube lanterna da D ganha garotos da base melhores, uma cota de ajuda da federação, ou os garotos da base vão primeiro para os piores.
3. **Envelhecimento na Série A.** O computador renova veteranos e quase não sobe garotos nos clubes grandes. Ideias: aposentadoria um pouco mais cedo para quem cai muito de média, ou clubes da A usarem mais a base para repor veteranos.
4. **Copa do Brasil sem zebra.** Ideias: nas primeiras fases, jogo único na casa do time de série menor; o clube grande poupa titulares quando a liga está apertada; um bônus de "jogo da vida" para o time pequeno.
5. **Série A previsível.** Em alguns mundos o mesmo clube ganha 4 ou 5 dos 8 títulos, e o campeão faz 91 a 94 pontos. Ideia: o clube que ganha muito sofre mais assédio (os outros compram seus melhores jogadores) ou tem mais desgaste.
6. **Dinheiro sem destino** (você pediu para não mexer nas finanças agora, então fica só anotado). Ninguém fica no vermelho em 8 anos, e os clubes ricos acumulam dezenas de milhões sem gastar. Quando voltarmos às finanças, a ideia é dar onde gastar: centro de treinamento, base, estádio, ou o computador rico investir mais em reforços.

## 2. Mercado e elenco
- **Livres:** chegam ao limite de 50 e quase ninguém contrata depois do 2º ano. Hoje são jogadores fracos sorteados. Ideia: os jogadores que o computador dispensa ou deixa de renovar vão para os livres (veteranos bons e baratos); ou menos livres, porém melhores.
- **Empréstimo de jogadores:** não existe. Seria útil para o garoto da base jogar num clube menor e voltar melhor, e para o clube pequeno ter reforço barato.
- **Jogador insatisfeito:** um titular que não joga, ou uma estrela num time pequeno, pede para sair ou cai de moral. Isso dá decisão ao técnico.
- **Renovação dos garotos da base** (está no documento de futuras features): o contrato de 24 meses acaba e hoje é renovado como o de qualquer jogador.
- **Assistente técnico** (está no documento de futuras features): avisa sobre jogadores à venda que servem ao seu estilo. Combina com o que vimos no relatório 30, em que cada estilo compra um tipo de jogador.

## 3. Partida e tática
- **Torcida:** divisão 80/20, ônibus de torcedores e impacto da torcida no resultado. Já estão no documento de futuras features e dariam mais peso ao mando de campo (hoje 41% de vitórias em casa, que é bom, mas a torcida não aparece no jogo).
- **Bola aérea com altura:** o jogo já usa a altura no cabeceio. Falta a disputa atacante contra zagueiro, como está descrita no documento de futuras features.
- **Lances do jogo ao vivo:** nas capturas, os lances mostrados eram quase só faltas e cartões, e o resumo do jogo só lista gols e cartões. Dá para mostrar mais lances de perigo (chute para fora, defesa do goleiro, bola na trave) para a partida parecer mais viva.
- **Formações:** o 3-4-3 rende menos e o 4-3-2-1 mais (relatório 30). Você decidiu deixar assim; fica só anotado.

## 4. Carreira e objetivos
- **Metas da diretoria por temporada:** no começo do ano a diretoria pede algo do tamanho do clube (subir, ficar no meio, não cair, passar de fase na Copa). Cumprir dá dinheiro e moral; falhar seguido dá aviso. Isso deixa cada temporada com um objetivo claro.
- **Propostas de clubes maiores** (está no documento de futuras features): o técnico humano que vai bem recebe convite de um clube de série acima.
- **Galeria do técnico:** uma tela com a carreira de cada técnico (títulos, acessos, melhor campanha) e os campeões de cada ano. O jogo já guarda o histórico das temporadas; falta mostrar.

## 5. Interface
- **Celular:** os nomes dos times quebram no meio no placar do jogo ao vivo; usar o nome curto ou a sigla ali.
- **Celular:** não existe passar o mouse, então as explicações das formações, estilos e colunas não aparecem. Um botão "i" que abre a explicação resolve.
- **Média do time:** usar sempre a média dos 11 melhores e mostrar a posição do clube na série ("7ª maior média da Série D").
- **Patrocínio no começo:** aviso na tela de boas-vindas para escolher o patrocinador antes do 1º jogo.
- **Aba "Relatórios de testes":** hoje aparece para todo mundo, inclusive para os amigos no modo online. Sugiro esconder atrás de uma opção.
- **Design já aprovado esperando sua liberação** (lista do Design e Interface): escudos novos dos 80 clubes e a tela inicial com a vitrine de clubes.
- **Peso da página:** o jogo tem 2,4 MB, dos quais 1,1 MB são as fotos e 0,37 MB os relatórios. No celular abre um pouco mais devagar. Com o site do GitHub, os relatórios poderiam ficar em arquivos separados.

## 6. Modo online
- Fazer o primeiro teste real com amigos pela internet (até agora só testei aqui dentro).
- Se alguém cair no meio da partida, a volta está coberta pelo "tentando de novo". Falta testar quem está em rede de empresa ou 4G, que é onde a conexão direta mais falha.

## Como sugiro seguir
1. **Rodada rápida de acabamento** (itens 1, 2 e 3 do resumo e o botão "i" no celular): pequena, sem mexer em equilíbrio.
2. **Rodada de equilíbrio de longo prazo:** Copa com zebras, fundo da Série D, envelhecimento na A e gols subindo. Ela seria testada com o mesmo teste longo de 8 temporadas.
3. **Uma feature nova grande**, à sua escolha: metas da diretoria, torcida (80/20, ônibus e impacto) ou empréstimos.

Scripts do teste longo: relatorios-kfoot/scripts-31 (lt31.js e an31.py).
