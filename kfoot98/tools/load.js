// Carrega os módulos (feitos para o navegador) no Node, para os testes/simulações.
const path = require('path');
const root = path.join(__dirname, '..');
['engine/rng', 'data/clubs', 'data/sponsors', 'data/foreign', 'engine/players', 'engine/match', 'engine/economy', 'engine/progression', 'engine/season', 'engine/game']
  .forEach((f) => require(path.join(root, f + '.js')));
module.exports = globalThis.BF98;
