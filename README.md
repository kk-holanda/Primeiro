# KKart 🏎️

Um jogo de corrida com visão de cima e carros de Fórmula 1 em estilo cartoon,
inspirado no [Turbo Sliders](http://ts.turbosliders.com/). Feito do zero com
**HTML5 Canvas + JavaScript puro**: nada para instalar, nada para compilar.

## Como jogar

1. Abra o arquivo `index.html` no navegador (dois cliques nele).
2. Escolha o modo: **KKlassic** (3 voltas) ou **Gabispeed** (10 voltas, com gasolina e pit stop).
3. Escolha a dificuldade (**Fácil**, **Normal** ou **Difícil**).
4. Escolha a pista: **KKlaude first**, **KK first**, **Anel Veloz** ou **Serpentina**.
5. Escolha o seu carro. Os outros cinco são pilotados pelo computador.

| Ação                 | Teclas            |
|----------------------|-------------------|
| Acelerar             | `W` ou `↑`        |
| Frear / ré           | `S` ou `↓`        |
| Virar                | `A` `D` ou `←` `→` |
| Freio de mão (drift) | `Espaço`          |
| Reiniciar corrida    | `R`               |
| Voltar ao menu       | `Esc`             |
| Ligar/desligar som   | `M`               |

No celular ou tablet, toque na tela: aparecem botões de virar, frear e acelerar.

Vence quem completar as voltas primeiro. Você larga em último!

**Modo Gabispeed:** a gasolina acaba (um tanque dura ~3,6 voltas). Quando avisar
"POUCA GASOLINA", entre na **faixa de box** pela entrada lateral (**PIT IN**) antes da
linha de chegada, respeite o limite de 90 km/h e pare no box com a **cor do seu
carro**. A equipe abastece e você sai pelo **PIT OUT**. Sem gasolina, o carro se arrasta.
A faixa de box só existe no modo Gabispeed.

## Os carros

| Carro    | Aceleração | Velocidade máx. | Curva |
|----------|:----------:|:---------------:|:-----:|
| Vermelho | 4 | 5 | 3 |
| Amarelo  | 5 | 3 | 4 |
| Azul     | 4 | 4 | 4 |
| Verde    | 3 | 4 | 5 |
| Laranja  | 5 | 4 | 3 |
| Roxo     | 3 | 5 | 4 |

As notas ficam em `CAR_MODELS` (`js/config.js`) e viram números de física na
função `carPerformance`.

## Estrutura do projeto

```
index.html          → página que carrega tudo
style.css           → deixa o jogo centralizado
js/config.js        → física, carros e seus atributos (mexa à vontade!)
js/input.js         → lê o teclado
js/tracks.js        → pistas: desenho, detecção de grama, checkpoints
js/car.js           → carro: física de drift, desenho do F1, colisão
js/controllers.js   → quem pilota: jogador (teclado) ou computador (IA)
js/scenery.js       → cenário: árvores, arquibancada, pneus, areia
js/pitlane.js       → faixa de box do modo Gabispeed (boxes, garagens, placas)
js/audio.js         → sons (motor, pneus, bipes) e recordes de volta
js/main.js          → menus, game loop, regras da corrida, HUD
```
## Os conceitos principais

**1. Game loop** (`main.js`) — todo jogo é um laço que roda ~60x por segundo:
calcula o tempo que passou (`dt`), **atualiza** o mundo e **desenha** o mundo.
Usar `dt` faz o jogo rodar na mesma velocidade em qualquer computador.

**2. Física de drift** (`car.js`) — é o que dá a "cara" de Turbo Sliders.
A velocidade do carro é dividida em duas partes:
- **para frente** (na direção do nariz do carro);
- **de lado** (o escorregão).

A cada quadro, uma parte da velocidade lateral é removida (`grip`). Muita
aderência = o carro gruda na pista. Pouca aderência (freio de mão) = drift.

**3. Pista** (`tracks.js`) — alguns pontos de controle viram uma curva suave
(Catmull-Rom). A estrada é essa linha desenhada bem grossa. Para saber se o
carro está na grama, medimos a distância dele até a linha central.

**4. Voltas** — a pista tem 10 checkpoints. O carro precisa passar por todos,
em ordem, para a volta contar. Assim ninguém trapaceia cortando caminho.

**5. Inteligência artificial** (`controllers.js`) — o computador mira num ponto
um pouco à frente na linha central e vira o volante na direção dele. Ele também
olha a curva que vem pela frente: quanto mais fechada, mais ele freia.

## Passo a passo (roadmap)

- [x] **Passo 1** — Canvas e game loop
- [x] **Passo 2** — Carro controlado pelo teclado com física de drift
- [x] **Passo 3** — Pista, grama que deixa lento, marcas de pneu
- [x] **Passo 4** — Voltas, checkpoints, cronômetro e vencedor
- [x] **Passo 5** — Colisão entre carros
- [x] **Passo 6** — Carros de F1 cartoon com atributos diferentes
- [x] **Passo 7** — Duas pistas e menus para escolher pista e carro
- [x] **Passo 8** — Oponentes controlados pelo computador
- [x] **Passo 8b** — 6 carros, 4 pistas, 3 níveis de dificuldade, cenário, fumaça e poeira
- [ ] **Passo 9** — Paredes/obstáculos sólidos na pista (carro bate e quica)
- [x] **Passo 10** — Sons, partículas e recordes de volta
- [x] **Passo 10b** — Pneus girando, semáforo de largada, faíscas nas batidas, velocímetro e placas
- [ ] **Passo 11** — Editor de pistas (clicar para colocar pontos)
- [ ] **Passo 12** — Multiplayer online (Node.js + WebSocket)

## Exercícios para aprender mexendo

- Em `js/config.js`, mude as notas de um carro (1 a 5) e veja a diferença.
- Em `js/config.js`, diminua `gripHandbrake` para drifts mais longos.
- Em `js/tracks.js`, adicione uma terceira pista na lista `TRACKS`.
- Em `js/main.js`, mude o `skill` do `AIController` para deixar o computador mais fácil ou difícil.
