// Estado do jogo e fluxo da temporada: datas, rodadas, Copa por pernas, partida do dia, suspensões, fim de ano.
// Headless (sem tela): testável no Node e reaproveitável no servidor do multiplayer futuro.
(function (root) {
  const bf = (root.BF98 = root.BF98 || {});
  const S = () => bf.Season, M = () => bf.Match, PL = () => bf.Players, PR = () => bf.Progression;
  const DIV_NOME = { A: 'Série A', B: 'Série B', C: 'Série C', D: 'Série D' };
  const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  // ---- datas (ISO "AAAA-MM-DD") ----
  const toDate = (iso) => new Date(iso + 'T12:00:00Z');
  const toIso = (d) => d.toISOString().slice(0, 10);
  const addDias = (iso, n) => { const d = toDate(iso); d.setUTCDate(d.getUTCDate() + n); return toIso(d); };
  const fimDoMes = (iso) => { const d = toDate(iso); return toIso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 12))); };
  const addMeses = (iso, n) => { const d = toDate(iso); return fimDoMes(toIso(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + n, 1, 12)))); }; // fim do mês, n meses depois
  const difDias = (a, b) => Math.round((toDate(b) - toDate(a)) / 864e5);
  const fmtData = (iso) => { const d = toDate(iso); return DIAS[d.getUTCDay()] + ', ' + String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0') + '/' + d.getUTCFullYear(); };
  const fmtDataCurta = (iso) => { const d = toDate(iso); return DIAS[d.getUTCDay()] + ' ' + String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0'); };

  // Calendário: quartas = Copa do Brasil (14 pernas); domingos = Brasileirão (38 rodadas). Estreia na 1ª quarta de fevereiro.
  function gerarDias(ano) {
    const d = new Date(Date.UTC(ano, 1, 1, 12)); while (d.getUTCDay() !== 3) d.setUTCDate(d.getUTCDate() + 1);
    const q0 = toIso(d), dias = [];
    for (let k = 0; k < 14; k++) dias.push({ data: addDias(q0, 7 * k), tipo: 'copa', perna: k });
    for (let r = 0; r < 38; r++) dias.push({ data: addDias(q0, 4 + 7 * r), tipo: 'liga', rodada: r });
    return dias.sort((a, b) => (a.data < b.data ? -1 : a.data > b.data ? 1 : 0));
  }

  // camisas: goleiro 1/12/22, zagueiros 3/4/14... (os melhores escolhem primeiro)
  function numerar(elenco) {
    const pref = { GOL: [1, 12, 22], ZAG: [3, 4, 14, 15], LD: [2, 13], LE: [6, 16], VOL: [5, 8, 15], MC: [8, 17], MEI: [10, 20], PD: [7], PE: [11], CA: [9, 19, 18], SA: [21, 18], LIB: [4], ALA: [17] };
    const usados = new Set();
    elenco.slice().sort((a, b) => PL().overall(b) - PL().overall(a)).forEach((p) => {
      let n = (pref[p.pos] || []).find((x) => !usados.has(x));
      if (!n) { n = 2; while (usados.has(n)) n++; }
      usados.add(n); p.num = n;
    });
  }

  function criarLigas(g) {
    g.ligas = {};
    for (const div of S().ORDEM) {
      const clubes = g.clubes.filter((c) => c.div === div);
      const ids = S().embaralhar(g.rng, clubes.map((c) => c.id));
      g.ligas[div] = { ids, rodadas: S().calendarioLiga(ids), tabela: S().novaTabela(clubes), res: [] };
    }
  }
  function novaTemporada(g) {
    g.dias = gerarDias(g.ano); g.idx = 0; g.fim = false; g.live = null;
    criarLigas(g); g.copa = S().copaCriar(g.clubes, g.rng);
  }

  // opts: { seed, humanos:[{id,nome,clubId}], config:{maxSubs} }
  function novo(opts) {
    PL().resetNomes();
    const rng = bf.RNG.create(opts.seed);
    const clubes = bf.CLUBS.map((c) => {
      const cl = { ...c, estadio: { ...c.estadio }, patrocinadores: [], elenco: PL().gerarElenco(rng, c) };
      numerar(cl.elenco); return cl;
    });
    const E = bf.Economy, hoje = '1998-01-31';
    clubes.forEach((c) => c.elenco.forEach((p) => { p.contratoAte = addMeses(hoje, rng.int(11, 17)); p.salario = E.salarioBase(p); p.avisos = 0; }));
    const g = {
      noticias: [], livres: [], moralTreinador: {},
      seed: opts.seed, rng, ano: 1998, data: '1998-01-31', config: { maxSubs: 3, ...(opts.config || {}) },
      humanos: opts.humanos.slice(), humanoIds: new Set(opts.humanos.map((h) => h.clubId)),
      clubes, porId: new Map(clubes.map((c) => [c.id, c])), hist: new Map(), taticas: new Map(), historico: [],
    };
    g.humanos.forEach((hu) => { g.moralTreinador[hu.clubId] = { v: 60, hist: [{ data: g.data, v: 60, res: null, adv: null }] }; });
    novaTemporada(g);
    return g;
  }

  // ---- jogos de cada dia ----
  function jogosDoDia(g, dia) {
    if (!dia) return [];
    if (dia.tipo === 'liga') {
      const out = [];
      for (const div of S().ORDEM) g.ligas[div].rodadas[dia.rodada].forEach(([h, a]) => out.push({ comp: 'liga', div, casa: h, fora: a, rotulo: DIV_NOME[div] + ' · rodada ' + (dia.rodada + 1) }));
      return out;
    }
    const idxFase = dia.perna >> 1, ida = dia.perna % 2 === 0;
    if (g.copa.campeao || g.copa.fases.length - 1 !== idxFase) return [];
    const fase = S().faseAtual(g.copa);
    if (fase.jogada) return [];
    return fase.confrontos.map((c) => ({ comp: 'copa', casa: ida ? c.a : c.b, fora: ida ? c.b : c.a, confronto: c, perna: ida ? 'ida' : 'volta', fase: fase.nome, rotulo: 'Copa do Brasil · ' + fase.nome + (fase.nome === 'Fase preliminar' || true ? (ida ? ' (ida)' : ' (volta)') : '') }));
  }
  const proximoDia = (g) => g.dias[g.idx] || null;
  const envolveHumano = (g, jogos) => jogos.some((j) => g.humanoIds.has(j.casa) || g.humanoIds.has(j.fora));

  // próximo jogo de um clube (só enxerga a fase atual da Copa)
  function proximoJogo(g, clubId) {
    for (let i = g.idx; i < g.dias.length; i++) {
      const j = jogosDoDia(g, g.dias[i]).find((x) => x.casa === clubId || x.fora === clubId);
      if (j) return { ...j, data: g.dias[i].data, emCasa: j.casa === clubId, adversario: j.casa === clubId ? j.fora : j.casa };
    }
    return null;
  }
  const ultimosJogos = (g, clubId, n = 2) => (g.hist.get(clubId) || []).slice(-n).reverse();

  // ---- escalação ----
  function escalacaoDe(g, clube, adversario) {
    const cfg = g.taticas.get(clube.id);
    let formacao = (cfg && cfg.formacao) || '4-4-2', tatica = (cfg && cfg.tatica) || 'equilibrado';
    if (!g.humanoIds.has(clube.id)) { // computador escolhe pelo confronto
      const d = clube.prestigio - adversario.prestigio;
      tatica = d > 15 ? 'ofensivo' : d < -15 ? (g.rng.chance(0.5) ? 'contra' : 'defensivo') : 'equilibrado';
      formacao = d > 15 ? '4-3-3' : d < -15 ? '4-5-1' : '4-4-2';
    }
    return S().escalarAuto(clube, formacao, tatica, g.config.maxSubs, cfg && g.humanoIds.has(clube.id) ? cfg.titulares : []);
  }

  // ---- dia de jogos ao vivo ----
  function iniciarDia(g) {
    const dia = proximoDia(g); g.data = dia.data;
    const partidas = jogosDoDia(g, dia).map((j) => {
      const C = g.porId.get(j.casa), F = g.porId.get(j.fora);
      const m = M().criar(escalacaoDe(g, C, F), escalacaoDe(g, F, C), g.rng);
      return { jogo: j, m, humano: [g.humanoIds.has(j.casa), g.humanoIds.has(j.fora)] };
    });
    g.live = { dia, partidas, min: 0 };
    return g.live;
  }
  function passoDia(g) {
    const L = g.live; L.min++;
    for (const p of L.partidas) {
      if (p.m.min >= 90) continue;
      if (p.m.min === 59 || p.m.min === 69 || p.m.min === 79) p.m.S.forEach((s, i) => { if (!p.humano[i]) M().iaSubstituicoes(p.m, s); });
      M().passo(p.m);
    }
    return L.min;
  }
  // termina as partidas que ainda não acabaram (modo instantâneo)
  function completarDia(g) { while (g.live.partidas.some((p) => p.m.min < 90)) passoDia(g); }

  function finalizarDia(g) {
    const L = g.live, dia = L.dia, resumos = [];
    const prox = g.dias[g.idx + 1], gap = prox ? Math.max(1, difDias(dia.data, prox.data)) : 7;
    const jogaram = new Set();
    for (const part of L.partidas) {
      const { jogo, m } = part, res = M().finalizar(m), [gh, ga] = res.placar;
      if (jogo.comp === 'liga') { const L2 = g.ligas[jogo.div]; S().registrar(L2.tabela, jogo.casa, jogo.fora, gh, ga); (L2.res[dia.rodada] = L2.res[dia.rodada] || []).push([jogo.casa, jogo.fora, gh, ga]); }
      else jogo.confronto[jogo.perna] = [gh, ga];
      const rot = jogo.comp === 'liga' ? 'Brasileirão ' + jogo.div : 'Copa do Brasil';
      [[jogo.casa, jogo.fora, gh, ga, true], [jogo.fora, jogo.casa, ga, gh, false]].forEach(([id, adv, gp, gc, casa]) => {
        const arr = g.hist.get(id) || []; arr.push({ data: dia.data, comp: rot, rotulo: jogo.rotulo, adv, casa, gp, gc }); g.hist.set(id, arr);
      });
      [[jogo.casa, jogo.fora, gh, ga], [jogo.fora, jogo.casa, ga, gh]].forEach(([id, adv, gp, gc]) => { if (g.humanoIds.has(id)) moralTreinador(g, id, adv, gp, gc); });
      const detalhes = [[], []];
      m.S.forEach((side, i) => {
        const clube = g.porId.get(i === 0 ? jogo.casa : jogo.fora); jogaram.add(clube.id);
        const noJogo = new Set(side.todos.keys());
        clube.elenco.forEach((p) => { // cumpriu suspensão / descansou
          if (!noJogo.has(p.id)) { if (p.suspenso > 0) p.suspenso--; PR().semJogar(p); }
        });
        for (const j of side.todos.values()) {
          const p = j.p, moralAntes = p.moral, mud = PR().aplicarPosJogo(j);
          if (p.suspenso > 0) p.suspenso--;
          if (j.expulso) p.suspenso = 1;
          else if (j.amarelos > 0) { p.amarelosAcum++; if (p.amarelosAcum >= 3) { p.suspenso = 1; p.amarelosAcum = 0; } }
          detalhes[i].push({ id: p.id, nome: p.nome, num: p.num, slot: j.slot, pos: p.pos, nota: j.nota, g: j.g, ast: j.ast, defesas: j.defesas, desarmes: j.desarmes, faltas: j.faltas, amarelos: j.amarelos, expulso: j.expulso, minutos: j.minutos, entrou: j.entrou, saiu: j.saiu, lesao: j.lesionado, mudancas: mud, moralAntes, moralDepois: p.moral, stamina: p.stamina });
        }
      });
      resumos.push({ jogo, placar: res.placar, stats: res.stats, eventos: res.eventos, detalhes, humano: part.humano, casaNome: g.porId.get(jogo.casa).nome, foraNome: g.porId.get(jogo.fora).nome });
    }
    for (const id of jogaram) {   // treino e descanso de treino só andam quando o clube joga
      const c = g.porId.get(id);
      c.elenco.forEach((p) => {
        if (p.treinoCd > 0) p.treinoCd--;
        if (p.treino && --p.treino.restante <= 0) bf.Mercado.concluirTreino(g, c, p);
      });
    }
    // clubes sem jogo no dia só descansam; todos recuperam stamina até o próximo compromisso
    g.clubes.forEach((c) => c.elenco.forEach((p) => PR().descansar(p, gap)));
    if (dia.tipo === 'copa' && dia.perna % 2 === 1) {
      S().copaFechar(g.copa, g.rng);
      const fase = g.copa.fases[dia.perna >> 1];
      resumos.forEach((r) => { if (r.jogo.comp === 'copa') r.copa = { agregado: r.jogo.confronto.agregado, penaltis: r.jogo.confronto.penaltis, vencedor: r.jogo.confronto.vencedor, fase: fase.nome }; });
    }
    bf.Mercado.processarVendas(g); bf.Mercado.processarContratos(g);
    g.idx++; g.live = null;
    if (g.idx >= g.dias.length) { g.fim = true; g.data = g.ano + '-12-15'; }   // pós-temporada: dá tempo de renovar contratos
    return resumos;
  }
  function simularDia(g) { iniciarDia(g); completarDia(g); return finalizarDia(g); }

  // simula dias até chegar ao próximo jogo de algum humano. Retorna { parou, fim }.
  function avancar(g) {
    while (!g.fim) {
      const dia = proximoDia(g), jogos = jogosDoDia(g, dia);
      if (envolveHumano(g, jogos)) return { parou: true, dia };
      if (jogos.length) simularDia(g); else { g.idx++; if (g.idx >= g.dias.length) g.fim = true; }
      if (!g.fim) g.data = dia.data;
    }
    return { fim: true };
  }

  // ---- virada de temporada ----
  function classificacao(g) { const c = {}; for (const d of S().ORDEM) c[d] = S().ordenar(g.ligas[d].tabela).map((r) => r.id); return c; }
  function virarTemporada(g) {
    const cl = classificacao(g);
    const reg = { ano: g.ano, campeoes: { A: cl.A[0], B: cl.B[0], C: cl.C[0], D: cl.D[0] }, copa: g.copa.campeao };
    const mov = S().promoRebaixa(cl, g.porId);
    reg.subiram = mov.subiram; reg.desceram = mov.desceram; g.historico.push(reg);
    g.clubes.forEach((c) => c.elenco.forEach((p) => {
      PR().virarAno(p, g.rng);
      p.stamina = 100; p.moral = 60; p.suspenso = 0; p.amarelosAcum = 0; p.treino = null; p.treinoCd = 0; if (p.lesao > 0) p.lesao = 0;
    }));
    g.ano++; g.data = g.ano + '-01-31'; novaTemporada(g);
    bf.Mercado.processarContratos(g);   // quem estava com contrato vencido sai (computador renova)
    return { registro: reg, mov };
  }
  const fimContrato = (g, p) => { const d = toDate(p.contratoAte), m = MESES[d.getUTCMonth()]; return m[0].toUpperCase() + m.slice(1) + '/' + d.getUTCFullYear(); };

  // moral do técnico (0-100): vitória sobe, derrota desce; ganhar de time maior vale mais, perder para time menor dói mais
  function moralTreinador(g, clubId, advId, gp, gc) {
    const mt = g.moralTreinador[clubId]; if (!mt) return;
    const dif = g.porId.get(advId).prestigio - g.porId.get(clubId).prestigio, clamp = (x, a, b) => Math.max(a, Math.min(b, x));
    const res = gp > gc ? 'V' : gp < gc ? 'D' : 'E';
    const delta = res === 'V' ? 8 + clamp(dif / 8, -4, 6) + Math.min(3, gp - gc - 1) : res === 'D' ? -8 + clamp(dif / 10, -3, 3) : clamp(dif / 10, -3, 3);
    mt.v = clamp(Math.round(mt.v + delta), 0, 100);
    mt.hist.push({ data: g.data, v: mt.v, res, adv: advId, gp, gc });
    g.porId.get(clubId).elenco.forEach((p) => { p.moral = clamp(p.moral + (mt.v - 50) * 0.02, 0, 100); }); // clima do vestiário
  }

  bf.Game = { novo, gerarDias, jogosDoDia, proximoDia, proximoJogo, ultimosJogos, escalacaoDe, iniciarDia, passoDia, completarDia, finalizarDia, simularDia, avancar, classificacao, virarTemporada, envolveHumano, fimContrato, fmtData, fmtDataCurta, addDias, addMeses, fimDoMes, difDias, DIV_NOME };
})(typeof globalThis !== 'undefined' ? globalThis : this);
