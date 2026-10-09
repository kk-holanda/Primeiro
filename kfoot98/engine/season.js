// Estrutura da temporada: calendário do Brasileirão, acesso/descenso (4 sobem, 4 descem) e Copa do Brasil (64 clubes).
(function (root) {
  const bf = (root.BF98 = root.BF98 || {});
  const ORDEM = ['A', 'B', 'C', 'D'];
  const REGRAS = { sobemDesce: 4, copaClubes: 64, copaPreliminar: 32 };

  // ---------- Brasileirão ----------
  function calendarioLiga(ids) { // método do círculo, ida e volta
    const n = ids.length, arr = ids.slice(), rodadas = [];
    for (let r = 0; r < n - 1; r++) {
      const jogos = [];
      for (let i = 0; i < n / 2; i++) { const a = arr[i], b = arr[n - 1 - i]; jogos.push(r % 2 ? [b, a] : [a, b]); }
      rodadas.push(jogos); arr.splice(1, 0, arr.pop());
    }
    return rodadas.concat(rodadas.map((r) => r.map(([a, b]) => [b, a])));
  }
  function novaTabela(clubes) { return new Map(clubes.map((c) => [c.id, { id: c.id, pts: 0, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0 }])); }
  function registrar(tab, h, a, gh, ga) {
    const H = tab.get(h), A = tab.get(a);
    H.j++; A.j++; H.gp += gh; H.gc += ga; A.gp += ga; A.gc += gh;
    if (gh > ga) { H.pts += 3; H.v++; A.d++; } else if (gh < ga) { A.pts += 3; A.v++; H.d++; } else { H.pts++; A.pts++; H.e++; A.e++; }
  }
  // critérios: pontos, vitórias, saldo, gols pró
  const ordenar = (tab) => [...tab.values()].sort((x, y) => y.pts - x.pts || y.v - x.v || (y.gp - y.gc) - (x.gp - x.gc) || y.gp - x.gp);

  // ---------- Acesso e descenso ----------
  function reclassificar(c, div) {
    const D = bf.DIVISOES[div];
    c.div = div; c.precoIngresso = D.ingresso;
    c.demanda = Math.round(25 * Math.pow(c.prestigio, 1.55) * D.demandaK);
  }
  // classificacao = { A:[ids ordenados], B:[...], C:[...], D:[...] } ; clubes = Map id -> clube
  function promoRebaixa(classificacao, clubes, n = REGRAS.sobemDesce) {
    const res = { subiram: {}, desceram: {} };
    for (let i = 0; i < 3; i++) {
      const sup = ORDEM[i], inf = ORDEM[i + 1];
      const caem = classificacao[sup].slice(-n), sobem = classificacao[inf].slice(0, n);
      res.desceram[sup] = caem; res.subiram[inf] = sobem;
    }
    for (const sup of Object.keys(res.desceram)) res.desceram[sup].forEach((id) => (res.__d = res.__d || []).push([id, ORDEM[ORDEM.indexOf(sup) + 1]]));
    for (const inf of Object.keys(res.subiram)) res.subiram[inf].forEach((id) => (res.__s = res.__s || []).push([id, ORDEM[ORDEM.indexOf(inf) - 1]]));
    [...res.__d, ...res.__s].forEach(([id, div]) => reclassificar(clubes.get(id), div));
    delete res.__d; delete res.__s;
    return res;
  }

  // ---------- Copa do Brasil ----------
  function embaralhar(rng, arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rng.int(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pares(ids) { const p = []; for (let i = 0; i < ids.length; i += 2) p.push({ a: ids[i], b: ids[i + 1] }); return p; }
  // força para escolher os 32 mais fracos: divisão (D<C<B<A) e depois prestígio. Pode ser trocada por 'rank' da última temporada.
  function copaCriar(clubes, rng, rank) {
    const f = rank || ((c) => ORDEM.indexOf(c.div) * -1000 + c.prestigio); // D (índice 3) => -3000
    const ord = clubes.slice().sort((x, y) => f(x) - f(y));
    const fracos = ord.slice(0, REGRAS.copaPreliminar).map((c) => c.id);
    const diretos = ord.slice(REGRAS.copaPreliminar).map((c) => c.id);
    return { fase: 0, diretos, campeao: null, fases: [{ nome: 'Fase preliminar', confrontos: pares(embaralhar(rng, fracos)) }] };
  }
  const NOMES_FASE = { 64: '1ª fase (64)', 32: 'Segunda fase (32)', 16: 'Oitavas de final', 8: 'Quartas de final', 4: 'Semifinais', 2: 'Final' };
  // pênaltis: 5 cobranças cada + morte súbita
  function penaltis(rng) {
    let a = 0, b = 0;
    for (let i = 0; i < 5; i++) { if (rng.chance(0.76)) a++; if (rng.chance(0.76)) b++; }
    while (a === b) { if (rng.chance(0.76)) a++; if (rng.chance(0.76)) b++; }
    return [a, b];
  }
  // Cada perna é jogada em um dia. Ida: A em casa. Volta: B em casa.
  const faseAtual = (copa) => copa.fases[copa.fases.length - 1];
  function copaPerna(copa, perna, simula) { // perna: 'ida' | 'volta'
    faseAtual(copa).confrontos.forEach((c) => { c[perna] = perna === 'ida' ? simula(c.a, c.b) : simula(c.b, c.a); });
  }
  // fecha a fase depois da volta: agregado (gol fora NÃO vale dobrado), pênaltis, sorteio da próxima fase
  function copaFechar(copa, rng) {
    const fase = faseAtual(copa);
    fase.confrontos.forEach((c) => {
      const ga = c.ida[0] + c.volta[1], gb = c.ida[1] + c.volta[0];
      c.agregado = [ga, gb];
      if (ga === gb) { c.penaltis = penaltis(rng); c.vencedor = c.penaltis[0] > c.penaltis[1] ? c.a : c.b; }
      else c.vencedor = ga > gb ? c.a : c.b;
    });
    fase.jogada = true;
    const venc = fase.confrontos.map((c) => c.vencedor);
    if (venc.length === 1 && fase.nome === 'Final') { copa.campeao = venc[0]; return copa; }
    const proximos = fase.nome === 'Fase preliminar' ? venc.concat(copa.diretos) : venc;
    const sorteados = embaralhar(rng, proximos);
    copa.fases.push({ nome: NOMES_FASE[sorteados.length], confrontos: pares(sorteados) });
    return copa;
  }
  // joga a fase inteira de uma vez (usado em testes e simulações)
  function copaJogarFase(copa, simula, rng) {
    if (faseAtual(copa).jogada) throw new Error('fase já jogada');
    copaPerna(copa, 'ida', simula); copaPerna(copa, 'volta', simula); return copaFechar(copa, rng);
  }

  // ---------- Escalação automática (IA / sugestão) ----------
  // Disponível = sem lesão, sem suspensão e fora de treino.
  const disponivel = (p) => p.lesao === 0 && !(p.suspenso > 0) && !(p.treino && p.treino.restante > 0);
  // Monta os 11 + banco. 'pref' = ids que o técnico escolheu por slot (os inválidos/indisponíveis são trocados pelo melhor disponível).
  function escalarAuto(clube, formacao = '4-4-2', tatica = 'equilibrado', maxSubs, pref = []) {
    const PL = bf.Players, M = bf.Match;
    const slots = M.FORMACOES[formacao], usados = new Set(), tit = [];
    const porId = new Map(clube.elenco.map((p) => [p.id, p]));
    const nota = (p, slot) => PL.ovrNoSlot(p, slot) * (0.8 + p.stamina / 500);
    slots.forEach((slot, i) => {
      const pp = porId.get(pref[i]);
      if (pp && disponivel(pp) && !usados.has(pp.id)) { usados.add(pp.id); tit[i] = pp.id; }
    });
    slots.forEach((slot, i) => {
      if (tit[i]) return;
      let disp = clube.elenco.filter((p) => !usados.has(p.id) && disponivel(p));
      if (!disp.length) disp = clube.elenco.filter((p) => !usados.has(p.id));
      disp.sort((a, b) => nota(b, slot) - nota(a, slot));
      usados.add(disp[0].id); tit[i] = disp[0].id;
    });
    const resto = clube.elenco.filter((p) => !usados.has(p.id) && disponivel(p)).sort((a, b) => PL.overall(b) - PL.overall(a));
    const banco = [];
    const gk = resto.find((p) => p.pos === 'GOL'); if (gk) banco.push(gk.id);
    for (const p of resto) { if (banco.length >= 7) break; if (!banco.includes(p.id)) banco.push(p.id); }
    return { clubId: clube.id, nome: clube.nome, elenco: clube.elenco, formacao, tatica, titulares: tit, banco, maxSubs };
  }

  bf.Season = { ORDEM, REGRAS, calendarioLiga, novaTabela, registrar, ordenar, promoRebaixa, reclassificar, copaCriar, copaPerna, copaFechar, copaJogarFase, faseAtual, escalarAuto, disponivel, embaralhar };
})(typeof globalThis !== 'undefined' ? globalThis : this);
