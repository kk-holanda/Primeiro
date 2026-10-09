// Testes das regras: node tools/test.js
const assert = require('assert');
const BF = require('./load');
const { RNG, CLUBS, Players: PL, Match: M, Season: S } = BF;
let ok = 0; const t = (nome, fn) => { fn(); ok++; console.log('✓', nome); };
const rng = RNG.create(1998);
const clubes = CLUBS.map((c) => ({ ...c, estadio: { ...c.estadio }, elenco: PL.gerarElenco(rng, c) }));
const mapa = new Map(clubes.map((c) => [c.id, c]));
const sim = (h, a, maxSubs) => M.simular(S.escalarAuto(mapa.get(h), '4-4-2', 'equilibrado', maxSubs), S.escalarAuto(mapa.get(a), '4-4-2', 'equilibrado', maxSubs), rng).placar;

t('80 clubes, 20 por divisão, 10 sorteáveis só na Série D', () => {
  assert.equal(clubes.length, 80);
  for (const d of 'ABCD') assert.equal(clubes.filter((c) => c.div === d).length, 20);
  const sel = clubes.filter((c) => c.selecionavel);
  assert.equal(sel.length, 10); assert(sel.every((c) => c.div === 'D'));
  const maxSel = Math.max(...sel.map((c) => c.prestigio)), minNao = Math.min(...clubes.filter((c) => c.div === 'D' && !c.selecionavel).map((c) => c.prestigio));
  assert(maxSel < minNao, 'sorteáveis devem ser os 10 piores da D');
});

t('Brasileirão: 38 rodadas, ida e volta, todos contra todos', () => {
  const cal = S.calendarioLiga(clubes.filter((c) => c.div === 'D').map((c) => c.id));
  assert.equal(cal.length, 38);
  const jogos = new Set(cal.flat().map(([a, b]) => a + '>' + b));
  assert.equal(jogos.size, 380);
});

t('Acesso/descenso: 4 sobem e 4 descem entre divisões adjacentes', () => {
  const classificacao = {};
  for (const d of 'ABCD') classificacao[d] = clubes.filter((c) => c.div === d).map((c) => c.id); // ordem = classificação fictícia
  const antesA = classificacao.A.slice(), antesB = classificacao.B.slice(), antesD = classificacao.D.slice();
  const r = S.promoRebaixa(classificacao, mapa);
  assert.deepEqual(r.desceram.A, antesA.slice(-4)); assert.deepEqual(r.subiram.A === undefined, true);
  assert.deepEqual(r.subiram.B, antesB.slice(0, 4).length ? antesB.slice(0, 4) : []);
  assert.deepEqual(r.subiram.D, antesD.slice(0, 4));
  for (const d of 'ABCD') assert.equal(clubes.filter((c) => c.div === d).length, 20, 'divisão ' + d + ' deve continuar com 20');
  antesA.slice(-4).forEach((id) => assert.equal(mapa.get(id).div, 'B'));
  antesD.slice(0, 4).forEach((id) => assert.equal(mapa.get(id).div, 'C'));
  assert.equal(new Set(clubes.map((c) => c.id)).size, 80);
});

t('Copa do Brasil: preliminar com 32 mais fracos e chaveamento de 64', () => {
  const cb = clubes.map((c) => ({ ...c })), cm = new Map(cb.map((c) => [c.id, c]));
  // volta os clubes ao estado original de divisão para o teste
  CLUBS.forEach((o) => { cm.get(o.id).div = o.div; });
  const copa = S.copaCriar(cb, rng);
  const prelim = copa.fases[0];
  assert.equal(prelim.confrontos.length, 16);
  const ids = prelim.confrontos.flatMap((c) => [c.a, c.b]);
  assert.equal(new Set(ids).size, 32);
  const divs = ids.map((id) => cm.get(id).div);
  assert.equal(divs.filter((d) => d === 'D').length, 20); assert.equal(divs.filter((d) => d === 'C').length, 12);
  assert.equal(copa.diretos.length, 48);
  let jogos = 0; const esperado = [16, 32, 16, 8, 4, 2, 1], nomes = [];
  const simula = (h, a) => { jogos++; return sim(h, a); };
  for (let i = 0; i < 7; i++) {
    const f = copa.fases[copa.fases.length - 1];
    assert.equal(f.confrontos.length, esperado[i], f.nome); nomes.push(f.nome);
    S.copaJogarFase(copa, simula, rng);
    f.confrontos.forEach((c) => { assert(c.vencedor); if (c.agregado[0] === c.agregado[1]) assert(c.penaltis); });
  }
  assert(copa.campeao); assert.equal(jogos, 2 * (16 + 32 + 16 + 8 + 4 + 2 + 1));
  assert.equal(copa.fases[1].confrontos.length * 2, 64);
  console.log('   fases:', nomes.join(' > '), '| campeão:', cm.get(copa.campeao).nome, '(' + cm.get(copa.campeao).div + ')');
});

t('Substituições: limite de 3 (1998) e opção de 5', () => {
  for (const [lim, tent] of [[3, 4], [5, 6]]) {
    const a = S.escalarAuto(mapa.get('corinthians'), '4-4-2', 'equilibrado', lim);
    const r = M.simular(a, S.escalarAuto(mapa.get('flamengo')), rng, {
      intervalo(lados) {
        const side = lados[0]; let feitas = 0, recusadas = 0;
        for (let i = 0; i < tent; i++) {
          const res = M.substituir(side, side.campo[1 + i].p.id, side.banco[0].id, 46);
          res.ok ? feitas++ : recusadas++;
        }
        assert.equal(feitas, lim); assert.equal(recusadas, tent - lim);
        assert.equal(side.subs, lim);
      },
    });
    assert(r.placar.length === 2);
  }
});

t('Padrão do jogo: 3 substituições', () => assert.equal(M.CFG.maxSubs, 3));
console.log('\n' + ok + ' testes passaram');
