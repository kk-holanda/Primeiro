# Mini Sliders 🏎️

Um jogo de corrida simples, com visão de cima, inspirado no
[Turbo Sliders](http://ts.turbosliders.com/). Feito do zero com
**HTML5 Canvas + JavaScript puro**: nada para instalar, nada para compilar.

## Como jogar

1. Abra o arquivo `index.html` no navegador (dois cliques nele).
2. Dois jogadores no mesmo teclado:

| Ação           | Vermelho | Azul          |
|----------------|----------|---------------|
| Acelerar       | `W`      | `↑`           |
| Frear / ré     | `S`      | `↓`           |
| Virar          | `A` `D`  | `←` `→`       |
| Freio de mão (drift) | `Espaço` | `Shift direito` |

`R` reinicia a corrida. Vence quem completar 3 voltas primeiro.

## Estrutura do projeto

```
index.html      → página que carrega tudo
style.css       → deixa o jogo centralizado
js/config.js    → números que controlam a física (mexa à vontade!)
js/input.js     → lê o teclado
js/track.js     → pista: desenho, detecção de grama, checkpoints
js/car.js       → carro: física de drift, desenho, colisão
js/main.js      → game loop, regras da corrida, HUD
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

**3. Pista** (`track.js`) — alguns pontos de controle viram uma curva suave
(Catmull-Rom). A estrada é essa linha desenhada bem grossa. Para saber se o
carro está na grama, medimos a distância dele até a linha central.

**4. Voltas** — a pista tem 8 checkpoints. O carro precisa passar por todos,
em ordem, para a volta contar. Assim ninguém trapaceia cortando caminho.

## Passo a passo (roadmap)

- [x] **Passo 1** — Canvas e game loop
- [x] **Passo 2** — Carro controlado pelo teclado com física de drift
- [x] **Passo 3** — Pista, grama que deixa lento, marcas de pneu
- [x] **Passo 4** — Voltas, checkpoints, cronômetro e vencedor
- [x] **Passo 5** — 2 jogadores no mesmo teclado + colisão entre carros
- [ ] **Passo 6** — Paredes/obstáculos sólidos na pista (carro bate e quica)
- [ ] **Passo 7** — Várias pistas e um menu para escolher
- [ ] **Passo 8** — Oponentes controlados pelo computador (IA seguindo a linha central)
- [ ] **Passo 9** — Sons (motor, derrapagem, batida) e partículas
- [ ] **Passo 10** — Editor de pistas (clicar para colocar pontos)
- [ ] **Passo 11** — Multiplayer online (Node.js + WebSocket)

## Exercícios para aprender mexendo

- Em `js/config.js`, troque `grip: 7` por `grip: 2`. O carro vira um sabonete!
- Mude `maxSpeed` e `turnSpeed` até achar a sensação que você gosta.
- Em `js/track.js`, altere os pontos de `TRACK_1` para criar a sua pista.
