# Kfoot 98

Jogo de gerenciamento de futebol (estilo Brasfoot/Elifoot) em 1998. Você é técnico e começa na Série D.
Design completo em [`docs/GDD.md`](docs/GDD.md).

## Como jogar / testar
Abra `index.html` no navegador (ou `dist/kfoot98.html`, que é a versão em arquivo único).

Telas implementadas: 1) boas-vindas · 2) campeonato com as 4 divisões e o ano 1998 · 3) nome do técnico e sorteio do clube
entre os 10 piores da Série D · 4) clubes dos técnicos · 5) plantel (estilo Brasfoot).

## Regras já implementadas no motor (`engine/season.js`, testadas)
- Acesso e descenso: 4 sobem e 4 descem entre divisões.
- Copa do Brasil com 64 clubes: fase preliminar dos 32 mais fracos (20 da D + 12 da C), depois 64 → 32 → 16 → 8 → 4 → final, ida e volta, pênaltis.
- Substituições: limite de 3 (1998) com opção de 5 (`maxSubs`, `Match.substituir`).

## Jogo (implementado)
- Plantel com data, próximo jogo e últimos 2 resultados; tooltips nos atributos; barras de stamina/moral por porcentagem.
- Escalação (4 formações, 3 táticas, qualquer jogador em qualquer posição), Tabela das 4 divisões + Copa do Brasil.
- Jogo ao vivo com todas as divisões ao mesmo tempo, pausa e substituições (3, ou 5 no modo moderno), resumo com notas e evolução.
- Calendário: quartas = Copa do Brasil (14 pernas), domingos = Brasileirão (38 rodadas). Fim de temporada com acesso/descenso e nova temporada.
- Lesões, cartões e suspensões (vermelho ou 3 amarelos). Contratos curtos: até Dez do ano atual ou do próximo.
- Mercado e Finanças: ainda não (abas "em breve").

## Comandos
```
node tools/test.js           # testa as regras acima
node tools/simulate.js 6     # simula 6 temporadas e imprime as métricas de balanceamento
node tools/build.js          # gera dist/kfoot98.html (arquivo único)
```

## Multiplayer (futuro)
O estado do jogo guarda `humanos[]` (hoje 1 técnico), o mundo nasce de uma semente (`seed`) e a tela 3 já reserva 6 lugares.
