// Balanceamento de táticas e do treino. Uso: node tools/balance.js [jogos por confronto]
const BF = require('./load');
const { RNG, CLUBS, Players: PL, Match: M, Season: S, Mercado: MK } = BF;
const N = +process.argv[2] || 600;
const rng = RNG.create(42);
PL.resetNomes();
const base = { ...CLUBS.find((c) => c.id === 'internacional') }; base.elenco = PL.gerarElenco(rng, base);
const clone = (suf, bonus = 0) => {
  const el = JSON.parse(JSON.stringify(base.elenco)).map((p) => { p.id += suf; if (bonus) Object.keys(p.attr).forEach((k) => { p.attr[k] = Math.min(99, p.attr[k] + bonus); }); return p; });
  return { id: 'x' + suf, nome: 'Time ' + suf, elenco: el };
};
function jogo(A, B, ta, tb) {
  [A, B].forEach((c) => c.elenco.forEach((p) => { p.stamina = 100; p.moral = 60; p.lesao = 0; p.suspenso = 0; }));
  const ea = S.escalarAuto(A, '4-4-2', ta, 3), eb = S.escalarAuto(B, '4-4-2', tb, 3);
  const r = M.simular(ea, eb, rng, { ia: true });
  return r.placar;
}
function duelo(ta, tb, bonusA = 0) {
  let pts = 0, gp = 0, gc = 0;
  for (let i = 0; i < N; i++) {
    const A = clone('a', bonusA), B = clone('b');
    const casa = i % 2 === 0, [x, y] = casa ? jogo(A, B, ta, tb) : jogo(B, A, tb, ta).reverse();
    gp += x; gc += y; pts += x > y ? 3 : x === y ? 1 : 0;
  }
  return { ppj: pts / N, gp: gp / N, gc: gc / N };
}
const TAT = ['ofensivo', 'equilibrado', 'defensivo', 'contra'];
console.log('\n== 1) Times IGUAIS: pontos por jogo da tática da LINHA contra a da COLUNA (1,33 = equilíbrio) ==');
console.log(''.padEnd(13) + TAT.map((t) => t.padStart(12)).join('') + '   média');
const media = {};
for (const a of TAT) {
  const row = TAT.map((b) => duelo(a, b).ppj);
  media[a] = row.reduce((x, y) => x + y) / 4;
  console.log(a.padEnd(13) + row.map((v) => v.toFixed(2).padStart(12)).join('') + '   ' + media[a].toFixed(2));
}
if (process.argv[3] === 'rapido') { console.log('\n== Time FRACO (-4) vs forte, por tática do fraco =='); for (const a of TAT) console.log(a.padEnd(13), duelo(a, 'equilibrado', -4).ppj.toFixed(2)); console.log('\n== Time FORTE (+4) por tática, contra time-base equilibrado =='); for (const a of TAT) console.log(a.padEnd(13), duelo(a, 'equilibrado', 4).ppj.toFixed(2)); process.exit(0); }
console.log('\n== 2) Gols/jogo (marcados - sofridos) por tática contra o equilibrado ==');
for (const a of TAT) { const d = duelo(a, 'equilibrado'); console.log(a.padEnd(13), 'gols pró', d.gp.toFixed(2), '| contra', d.gc.toFixed(2)); }
console.log('\n== 3) Qualidade dos jogadores x tática: time com +N em todos os atributos, jogando EQUILIBRADO, contra time-base equilibrado ==');
for (const b of [0, 2, 4, 6, 8]) { const d = duelo('equilibrado', 'equilibrado', b); console.log('+' + b + ' atributos: ' + d.ppj.toFixed(2) + ' pts/jogo (' + (d.ppj / 3 * 100).toFixed(0) + '% de aproveitamento)'); }
console.log('\n== 4) Time MAIS FRACO (-4 atributos) contra o forte, por tática do fraco (forte joga equilibrado) ==');
for (const a of TAT) { const d = duelo(a, 'equilibrado', -4); console.log(a.padEnd(13), d.ppj.toFixed(2), 'pts/jogo'); }
console.log('\n== 5) Contra-ataque contra cada tática (times iguais) ==');
for (const b of TAT) { const d = duelo('contra', b); console.log('contra x ' + b.padEnd(12), d.ppj.toFixed(2)); }

console.log('\n== TREINO: pontos esperados (jogador de 55 no atributo, moral 60) por idade e nº de jogos ==');
const mk = (idade, v) => ({ idade, moral: 60, attr: { RIT: v, CHU: v, PAS: v, DRI: v, DEF: v, FIS: v } });
console.log('idade   1 jogo   2 jogos  3 jogos   (atributo 55 | 75)');
for (const i of [19, 22, 26, 30, 34]) console.log(String(i).padEnd(7), [1, 2, 3].map((n) => (MK.ganhoEsperado(mk(i, 55), 'DEF', n).toFixed(2) + ' | ' + MK.ganhoEsperado(mk(i, 75), 'DEF', n).toFixed(2)).padEnd(14)).join(''));
