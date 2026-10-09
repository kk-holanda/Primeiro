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
// ---------------- Jogo completo (calendário, rodadas, Copa por pernas, fim de ano) ----------------
const G = BF.Game;
t('Nomes únicos no mundo e contratos curtos (dez/1998 a jun/1999)', () => {
  const g = G.novo({ seed: 7, humanos: [{ id: 1, nome: 'Teste', clubId: 'bangu' }] });
  const nomes = g.clubes.flatMap((c) => c.elenco.map((p) => p.nome));
  assert.equal(nomes.length, 80 * 24); assert.equal(new Set(nomes).size, nomes.length);
  assert(g.clubes.every((c) => c.elenco.every((p) => p.contratoAte >= '1998-12-31' && p.contratoAte <= '1999-06-30')));
  assert.equal(G.fmtData('1998-02-04'), 'Qua, 04/02/1998');
});
t('Temporada inteira: 38 rodadas por divisão, Copa até o campeão, virada de ano', () => {
  const g = G.novo({ seed: 1998, humanos: [{ id: 1, nome: 'Teste', clubId: 'bangu' }] });
  assert.equal(g.dias.length, 52);
  const primeiro = G.proximoJogo(g, 'bangu');
  assert.equal(primeiro.comp, 'copa'); assert.equal(primeiro.data, '1998-02-04');
  let paradas = 0;
  for (let guard = 0; guard < 80 && !g.fim; guard++) {
    const r = G.avancar(g); if (r.parou) { paradas++; G.simularDia(g); }
  }
  assert(g.fim); assert(g.copa.campeao);
  for (const d of 'ABCD') for (const r of g.ligas[d].tabela.values()) assert.equal(r.j, 38);
  const tot = [...g.hist.values()].reduce((s, a) => s + a.length, 0);
  assert.equal(tot, 2 * (4 * 380 + 158));
  assert.equal(G.ultimosJogos(g, 'bangu').length, 2);
  const antes = G.classificacao(g);
  const r = G.virarTemporada(g);
  assert.equal(g.ano, 1999); assert.equal(g.data, '1999-01-31'); assert.equal(g.idx, 0);
  for (const d of 'ABCD') assert.equal(g.clubes.filter((c) => c.div === d).length, 20);
  antes.A.slice(-4).forEach((id) => assert.equal(g.porId.get(id).div, 'B'));
  for (let i = 0; i < 6; i++) { const a = G.avancar(g); if (a.parou) G.simularDia(g); }
  assert(g.clubes.every((c) => c.elenco.every((p) => p.contratoAte >= g.data)));
  console.log('   humano parou', paradas, 'vezes | campeão A:', g.porId.get(antes.A[0]).nome, '| Copa:', g.porId.get(r.registro.copa).nome);
});
t('Suspensão: vermelho tira o jogador do próximo jogo', () => {
  const g = G.novo({ seed: 5, humanos: [{ id: 1, nome: 'T', clubId: 'bangu' }] });
  const c = g.porId.get('bangu'); const p = c.elenco.find((x) => x.pos === 'ZAG'); p.suspenso = 1;
  const esc = G.escalacaoDe(g, c, g.porId.get('tupi'));
  assert(!esc.titulares.includes(p.id) && !esc.banco.includes(p.id));
});

// ---------------- Mercado: vender, leiloar, renovar, treinar ----------------
const MK = BF.Mercado;
const novoMundo = (seed = 3) => G.novo({ seed, humanos: [{ id: 1, nome: 'T', clubId: 'bangu' }] });
t('Estrelas: poucas, e quase nenhuma nas séries baixas; nacionalidade e salário', () => {
  const g = novoMundo(11), est = (d) => g.clubes.filter((c) => c.div === d).reduce((s, c) => s + c.elenco.filter((p) => p.estrela).length, 0);
  const n = { A: est('A'), B: est('B'), C: est('C'), D: est('D') };
  console.log('   estrelas por divisão:', JSON.stringify(n));
  assert(n.A >= 12 && n.A <= 40 && n.D <= 4 && n.C <= 6);
  assert.equal(g.porId.get('bangu').elenco.filter((p) => p.estrela).length, 0);
  const todos = g.clubes.flatMap((c) => c.elenco);
  assert(todos.every((p) => p.nac && p.salario > 0));
  const bra = todos.filter((p) => p.nac === 'BRA').length / todos.length; assert(bra > 0.85 && bra < 0.97);
});
t('Renovar: só nos últimos 3 meses, e o jogador pode pedir mais', () => {
  const g = novoMundo(), c = g.porId.get('bangu'), p = c.elenco[0];
  assert(!MK.podeRenovar(g, p));
  g.data = G.addDias(p.contratoAte, -60); assert(MK.podeRenovar(g, p));
  for (const o of MK.opcoesRenovacao(g)) assert(o.meses >= 3 && o.meses <= 12);
  const esp = MK.salarioEsperado(p, 6);
  assert.equal(MK.negociar(g, p, esp, 6).resultado, 'aceita');
  const r = MK.negociar(g, p, Math.round(esp * 0.5), 6); assert(r.resultado === 'pede' && r.pedido > esp);
  const antes = p.contratoAte; MK.aplicarRenovacao(g, p, r.pedido, 9);
  assert(p.contratoAte > antes && p.salario === r.pedido);
});
t('Leilão: preço inicial R$ 0, multa paga pelo comprador, jogador troca de clube', () => {
  const g = novoMundo(), c = g.porId.get('bangu'), p = c.elenco.find((x) => x.pos === 'CA'), caixa0 = c.caixa;
  const res = MK.leiloar(g, c, p, 0);
  assert(res.ok && res.rodadas.length >= 2);
  if (res.vendido) {
    const b = g.porId.get(res.comprador);
    assert(b.elenco.includes(p) && !c.elenco.includes(p)); assert.equal(c.caixa, caixa0 + res.preco + res.multa); assert(res.multa > 0);
  }
  // preço astronômico: ninguém compra
  const q = c.elenco.find((x) => x.pos === 'LD'); const r2 = MK.leiloar(g, c, q, 1e9); assert(r2.ok && !r2.vendido && c.elenco.includes(q));
});
t('Venda a preço fixo: sai depois de alguns jogos se o preço for razoável; preço absurdo não vende', () => {
  const g = novoMundo(5), c = g.porId.get('bangu'), E = BF.Economy;
  const p = c.elenco.slice().sort((a, b) => BF.Players.overall(b) - BF.Players.overall(a))[5], q = c.elenco.slice().sort((a, b) => BF.Players.overall(b) - BF.Players.overall(a))[6];
  assert(MK.colocarAVenda(g, c, p, E.valorMercado(p) * 0.9).ok); assert(MK.colocarAVenda(g, c, q, E.valorMercado(q) * 5).ok);
  for (let i = 0; i < 60; i++) MK.processarVendas(g);
  assert(!c.elenco.includes(p), 'vendeu o jogador de preço justo'); assert(c.elenco.includes(q), 'não vendeu o de preço absurdo');
  assert(g.noticias.some((n) => n.tipo === 'venda'));
  c.elenco.length = 18; assert(!MK.colocarAVenda(g, c, c.elenco[0], 1000).ok);
});
t('Treino: fora de 1 a 3 jogos, evolui o atributo, cobra moral e devolve stamina', () => {
  const g = novoMundo(), c = g.porId.get('bangu'), p = c.elenco.find((x) => x.idade <= 24 && x.pos === 'CA') || c.elenco.find((x) => x.idade <= 24);
  p.stamina = 40; p.moral = 70; const fis0 = p.attr.FIS;
  assert(MK.iniciarTreino(g, c, p, 'forca', 3).ok); assert(!BF.Season.disponivel(p));
  assert(!MK.iniciarTreino(g, c, p, 'corrida', 1).ok);
  assert(!S.escalarAuto(c, '4-4-2', 'equilibrado', 3).titulares.includes(p.id));
  for (let i = 0; i < 3; i++) { p.treino.restante--; }
  MK.concluirTreino(g, c, p);
  assert(p.attr.FIS >= fis0 && p.attr.FIS <= fis0 + 4); assert.equal(p.moral, 70 - 12); assert.equal(p.stamina, 76); assert.equal(p.treinoCd, 4);
  assert(!MK.iniciarTreino(g, c, p, 'forca', 1).ok, 'em descanso de treino');
});
t('Contratos vencidos: computador renova, humano perde o jogador e a base completa o elenco', () => {
  const g = novoMundo(), c = g.porId.get('bangu'), v = g.porId.get('tupi');
  c.elenco.slice(0, 5).forEach((p) => { p.contratoAte = '1998-01-15'; }); v.elenco.slice(0, 5).forEach((p) => { p.contratoAte = '1998-01-15'; });
  MK.processarContratos(g);
  assert.equal(v.elenco.length, 24); assert(v.elenco.every((p) => p.contratoAte >= g.data));
  assert(c.elenco.length >= 20 && c.elenco.every((p) => p.contratoAte >= g.data));
  assert(g.noticias.length > 0);
});
t('Moral do técnico: vitória sobe, derrota desce, guarda o histórico', () => {
  const g = novoMundo(), mt = g.moralTreinador.bangu;
  assert.equal(mt.v, 60);
  const sim = G.simularDia(g); // 1º dia: Copa
  assert.equal(mt.hist.length, 2); assert(['V', 'E', 'D'].includes(mt.hist[1].res));
  assert(mt.v >= 0 && mt.v <= 100);
});
t('Tática contra-ataque existe', () => { assert(M.TATICA.contra && M.TATICA.contra.tempo < 1); });

// ---------------- Rodada 4: perfil físico, público, finanças, artilharia, formação no intervalo ----------------
t('Pé, altura e peso coerentes; todos os clubes têm técnico', () => {
  const g = novoMundo(21), todos = g.clubes.flatMap((c) => c.elenco);
  assert(todos.every((p) => ['D', 'E', 'A'].includes(p.pe) && p.altura >= 160 && p.altura <= 203 && p.peso >= 55 && p.peso <= 110));
  const med = (pos) => { const a = todos.filter((p) => p.pos === pos); return a.reduce((s, p) => s + p.altura, 0) / a.length; };
  assert(med('GOL') > med('MEI') + 8 && med('ZAG') > med('LD'));
  const le = todos.filter((p) => p.pos === 'LE'), ld = todos.filter((p) => p.pos === 'LD');
  assert(le.filter((p) => p.pe === 'E').length / le.length > 0.7 && ld.filter((p) => p.pe === 'D').length / ld.length > 0.8);
  assert(g.clubes.every((c) => c.tecnico) && g.porId.get('bangu').tecnico === 'T');
});
t('Dia de jogos: público limitado pela capacidade, balanço financeiro e artilharia', () => {
  const g = novoMundo(22), c = g.porId.get('bangu'), caixa0 = c.caixa;
  while (!G.jogosDoDia(g, G.proximoDia(g)).some((j) => j.casa === 'bangu' || j.fora === 'bangu')) G.simularDia(g);
  const caixaAntes = c.caixa; G.iniciarDia(g); G.completarDia(g); const rs = G.finalizarDia(g);
  const r = rs.find((x) => x.jogo.casa === 'bangu' || x.jogo.fora === 'bangu'), casa = r.jogo.casa === 'bangu', f = r.financas[casa ? 0 : 1];
  assert(r.publico > 0 && r.publico <= g.porId.get(r.jogo.casa).estadio.capacidade);
  assert.equal(f.saldo, f.receita - f.despesa); assert.equal(c.caixa, caixaAntes + f.saldo); assert(f.salarios > 0);
  if (casa) assert(f.bilheteria > 0 && f.custosJogo === Math.round(f.bilheteria * 0.15)); else assert.equal(f.bilheteria, 0);
  for (const d of 'ABCD') { const art = Object.values(g.artilharia[d]); if (art.length) assert(art.every((e) => e.jogos >= 1 && e.gols >= 0)); }
  const total = Object.values(g.artilharia.copa).reduce((s, e) => s + e.gols, 0), gols = rs.reduce((s, x) => s + x.placar[0] + x.placar[1], 0);
  assert.equal(total, gols);
  assert(g.moralTreinador.tupi.hist.length >= 1);
});
t('Formação no intervalo: 11 em campo, goleiro mantido, evento registrado', () => {
  const g = novoMundo(23), A = g.porId.get('internacional'), B = g.porId.get('gremio');
  const m = M.criar(S.escalarAuto(A, '4-4-2', 'equilibrado', 3), S.escalarAuto(B, '4-4-2', 'equilibrado', 3), g.rng);
  for (let i = 0; i < 45; i++) M.passo(m);
  assert(M.mudarFormacao(m, 0, '3-5-2').ok);
  const camp = m.S[0].campo; assert.equal(camp.length, 11); assert.equal(camp.filter((j) => j.slot === 'GOL').length, 1);
  assert.deepEqual(camp.map((j) => j.slot).sort(), M.FORMACOES['3-5-2'].slice().sort());
  assert(m.eventos.some((e) => e.tipo === 'formacao') && !M.mudarFormacao(m, 0, '9-9-9').ok);
  for (let i = 0; i < 45; i++) M.passo(m); assert(M.finalizar(m).placar.length === 2);
});
t('Emblemas: um por clube, todos diferentes (sigla e desenho)', () => {
  const E = BF.EMBLEMAS; assert.equal(Object.keys(E).length, 80);
  const sig = new Set(), des = new Set();
  for (const c of CLUBS) { const e = E[c.id]; assert(e, c.id); sig.add(e[0]); des.add([e[1], e[2], c.cores[0], c.cores[1], (e[3] || []).join('')].join('|')); }
  assert.equal(sig.size, 80, 'siglas únicas');
  const rep = CLUBS.length - des.size; assert.equal(rep, 0, 'desenhos repetidos: ' + rep);
});
console.log('\n' + ok + ' testes passaram');
