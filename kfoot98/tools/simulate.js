// Simula temporadas completas para medir o balanceamento. Uso: node tools/simulate.js [temporadas] [semente]
const BF = require('./load');
const { RNG, CLUBS, Players: PL, Match: M, Economy: E, Progression: PR } = BF;
const temporadas = +process.argv[2] || 1, seed = +process.argv[3] || 1998;
const rng = RNG.create(seed);

const melhorTime = (c, f, t) => BF.Season.escalarAuto(c, f, t);
const calendario = BF.Season.calendarioLiga;
function jogarDiv(div, cl, acc) {
  const tab = new Map(div.map((c) => [c.id, { c, pts: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 }]));
  for (const rod of calendario(div.map((c) => c.id))) {
    for (const [h, a] of rod) {
      const H = cl.get(h), A = cl.get(a);
      const r = M.simular(melhorTime(H), melhorTime(A), rng);
      const [gh, ga] = r.placar, th = tab.get(h), ta = tab.get(a);
      th.gp += gh; th.gc += ga; ta.gp += ga; ta.gc += gh;
      if (gh > ga) { th.pts += 3; th.v++; ta.d++; acc.casa++; } else if (gh < ga) { ta.pts += 3; ta.v++; th.d++; acc.fora++; } else { th.pts++; ta.pts++; th.e++; ta.e++; acc.emp++; }
      acc.jogos++; acc.gols += gh + ga; acc.faltas += r.stats[0].faltas + r.stats[1].faltas;
      acc.amarelos += r.stats[0].amarelos + r.stats[1].amarelos; acc.vermelhos += r.stats[0].vermelhos + r.stats[1].vermelhos;
      acc.chutes += r.stats[0].chutes + r.stats[1].chutes;
      acc.eventos += r.eventos.filter((e) => e.tipo === 'lesao').length;
      for (const [s, c] of [[r.lados[0], H], [r.lados[1], A]]) {
        for (const j of s.todos.values()) {
          acc.notas.push(j.nota); const m = PR.aplicarPosJogo(j); acc.melhorias += m.length;
        }
        const jogaram = new Set(s.todos.keys());
        c.elenco.forEach((p) => { if (!jogaram.has(p.id)) PR.semJogar(p); });
      }
      // economia do jogo em casa
      H.caixa += E.rendaJogo(H, 0, 1, 1);
    }
    // descanso entre rodadas (semana = 7 dias; em copas seriam 3)
    div.forEach((c) => c.elenco.forEach((p) => PR.descansar(p, 4)));
  }
  return [...tab.values()].sort((a, b) => b.pts - a.pts || (b.gp - b.gc) - (a.gp - a.gc));
}

// ---- monta o mundo ----
const clubes = CLUBS.map((c) => ({ ...c, estadio: { ...c.estadio }, elenco: PL.gerarElenco(rng, c), patrocinadores: [] }));
const cl = new Map(clubes.map((c) => [c.id, c]));
console.log('\n== Força média dos 11 melhores (overall) por divisão ==');
for (const d of 'ABCD') {
  const m = clubes.filter((c) => c.div === d).map((c) => c.elenco.map((p) => PL.overall(p)).sort((a, b) => b - a).slice(0, 11).reduce((s, x) => s + x, 0) / 11);
  console.log(d, 'min', Math.min(...m).toFixed(1), 'média', (m.reduce((a, b) => a + b) / 20).toFixed(1), 'max', Math.max(...m).toFixed(1));
}
console.log('\n== Economia inicial por divisão (por clube, R$) ==');
for (const d of 'ABCD') {
  const cs = clubes.filter((c) => c.div === d);
  const folha = cs.map((c) => E.folhaMensal(c.elenco)), caixa = cs.map((c) => c.caixa);
  const gate = cs.map((c) => E.rendaJogo(c) * 19);
  const spon = cs.map((c) => { const ss = BF.SPONSORS.filter((s) => c.prestigio >= s.minPrestigio).map((s) => E.valorPatrocinio(s, c)).sort((a, b) => b - a); return (ss[0] + (ss[1] || 0)) ; });
  const f = (a) => Math.round(a.reduce((x, y) => x + y) / a.length).toLocaleString('pt-BR');
  console.log(d, '| caixa', f(caixa), '| folha/mês', f(folha), '| folha/ano(13x)', f(folha.map((x) => x * 13)), '| bilheteria/ano', f(gate), '| TV', BF.DIVISOES[d].tv.toLocaleString('pt-BR'), '| custo fixo', E.CUSTO_FIXO[d].toLocaleString('pt-BR'), '| 2 patroc. (teto)', f(spon));
  const bal = cs.map((c) => E.rendaJogo(c) * 19 + BF.DIVISOES[d].tv - E.folhaMensal(c.elenco) * 13 - E.CUSTO_FIXO[d]);
  console.log('   saldo anual SEM patrocínio: min', Math.round(Math.min(...bal)).toLocaleString('pt-BR'), 'max', Math.round(Math.max(...bal)).toLocaleString('pt-BR'));
}

for (let t = 1; t <= temporadas; t++) {
  const acc = { jogos: 0, casa: 0, fora: 0, emp: 0, gols: 0, faltas: 0, amarelos: 0, vermelhos: 0, chutes: 0, eventos: 0, notas: [], melhorias: 0 };
  const res = {};
  for (const d of 'ABCD') res[d] = jogarDiv(clubes.filter((c) => c.div === d), cl, acc);
  console.log(`\n=== Temporada ${t} ===`);
  console.log(`jogos ${acc.jogos} | gols/jogo ${(acc.gols / acc.jogos).toFixed(2)} | vit. mandante ${(acc.casa / acc.jogos * 100).toFixed(0)}% empate ${(acc.emp / acc.jogos * 100).toFixed(0)}% visitante ${(acc.fora / acc.jogos * 100).toFixed(0)}%`);
  console.log(`chutes/jogo ${(acc.chutes / acc.jogos).toFixed(1)} | faltas/jogo ${(acc.faltas / acc.jogos).toFixed(1)} | amarelos/jogo ${(acc.amarelos / acc.jogos).toFixed(2)} | vermelhos/jogo ${(acc.vermelhos / acc.jogos).toFixed(3)} | lesões/jogo ${(acc.eventos / acc.jogos).toFixed(2)}`);
  const n = acc.notas.sort((a, b) => a - b);
  console.log(`notas: min ${n[0]} p10 ${n[Math.floor(n.length * .1)]} mediana ${n[Math.floor(n.length / 2)]} p90 ${n[Math.floor(n.length * .9)]} max ${n[n.length - 1]} | melhorias de atributo/jogo ${(acc.melhorias / acc.jogos).toFixed(2)}`);
  for (const d of 'ABCD') {
    const tb = res[d], ovr = (c) => c.elenco.map((p) => PL.overall(p)).sort((a, b) => b - a).slice(0, 11).reduce((s, x) => s + x, 0) / 11;
    const ranking = tb.map((r, i) => [i, ovr(r.c)]);
    const ordF = [...ranking].sort((a, b) => b[1] - a[1]);
    // correlação de Spearman simplificada: posição final vs posição por força
    const pos = new Map(ordF.map(([i], k) => [i, k]));
    const rho = 1 - 6 * ranking.reduce((s, [i]) => s + Math.pow(i - pos.get(i), 2), 0) / (20 * (400 - 1));
    console.log(`Série ${d}: campeão ${tb[0].c.nome} (${tb[0].pts} pts), último ${tb[19].c.nome} (${tb[19].pts}) | correlação força x posição ρ=${rho.toFixed(2)}`);
  }
  const med = (f) => clubes.filter(f).map((c) => c.elenco.map((p) => PL.overall(p)).sort((a, b) => b - a).slice(0, 11).reduce((x, y) => x + y, 0) / 11);
  const mean = (a) => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1);
  console.log('força média (11 melhores) após a temporada:', 'A', mean(med((c) => c.div === 'A')), 'B', mean(med((c) => c.div === 'B')), 'C', mean(med((c) => c.div === 'C')), 'D', mean(med((c) => c.div === 'D')));
  const jov = clubes.flatMap((c) => c.elenco).filter((p) => p.idade <= 21), vet = clubes.flatMap((c) => c.elenco).filter((p) => p.idade >= 32);
  console.log('ovr médio: jovens(<=21)', mean(jov.map(PL.overall)), '| veteranos(>=32)', mean(vet.map(PL.overall)));
  // fim de temporada
  clubes.forEach((c) => c.elenco.forEach((p) => { PR.virarAno(p, rng); p.stamina = 100; p.moral = 60; }));
}
const ex = clubes.find((c) => c.id === 'guaranybage').elenco.slice().sort((a, b) => PL.overall(b) - PL.overall(a))[0];
console.log('\nExemplo de jogador (Guarany de Bagé):', ex.nome, ex.pos, 'idade', ex.idade, 'ovr', PL.overall(ex).toFixed(0), JSON.stringify(ex.attr), PL.DISCIPLINAS[ex.disciplina], 'valor R$', E.valorMercado(ex), 'salário R$', E.salario(ex));
