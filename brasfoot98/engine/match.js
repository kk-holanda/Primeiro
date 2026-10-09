// Motor de partida: 90 minutos simulados minuto a minuto; só o placar/eventos são exibidos ao jogador.
// Cada jogador entra com a nota (0-10) calculada a partir do que fez em campo.
(function (root) {
  const bf = (root.BF98 = root.BF98 || {});
  const P = () => bf.Players;

  // slots de cada formação (11 posições)
  const FORMACOES = {
    '4-4-2': ['GOL', 'LD', 'ZAG', 'ZAG', 'LE', 'VOL', 'MC', 'ALA', 'ALA', 'CA', 'SA'],
    '4-3-3': ['GOL', 'LD', 'ZAG', 'ZAG', 'LE', 'VOL', 'MC', 'MEI', 'PD', 'CA', 'PE'],
    '3-5-2': ['GOL', 'ZAG', 'ZAG', 'LIB', 'ALA', 'VOL', 'VOL', 'MEI', 'ALA', 'CA', 'SA'],
    '4-5-1': ['GOL', 'LD', 'ZAG', 'ZAG', 'LE', 'VOL', 'VOL', 'MC', 'MEI', 'ALA', 'CA'],
  };
  // tática: ofensivo/equilibrado/defensivo
  const TATICA = {
    ofensivo: { atk: 1.06, def: 0.94, tempo: 1.10, faltas: 1.10 },
    equilibrado: { atk: 1.0, def: 1.0, tempo: 1.0, faltas: 1.0 },
    defensivo: { atk: 0.94, def: 1.06, tempo: 0.90, faltas: 1.0 },
  };
  const CFG = {
    ataquesPorMinuto: 0.52, mandante: 1.07, expoControle: 2.2,
    maxSubs: 3,            // 1998: 3 substituições (configurável para 5 no modo "moderno")
    staminaMin: 0.70,      // multiplicador de força com stamina 0 (1.00 com stamina 100)
    faltaBase: 0.125, amareloPorFalta: 0.105, vermelhoDireto: 0.0005, lesaoPorJogadorMin: 0.00012,
  };

  const mStam = (s) => CFG.staminaMin + (1 - CFG.staminaMin) * (s / 100);
  const mMoral = (m) => 0.95 + 0.10 * (m / 100);
  const forca = (j) => j.base * mStam(j.p.stamina) * mMoral(j.p.moral);

  // time = { nome, elenco[], formacao, tatica, titulares[ids em ordem dos slots], banco[ids], mando:boolean }
  function montar(time, rng) {
    const slots = FORMACOES[time.formacao];
    const porId = new Map(time.elenco.map((p) => [p.id, p]));
    const campo = time.titulares.map((id, i) => {
      const p = porId.get(id);
      return novo(p, slots[i]);
    });
    return { time, slots, campo, banco: time.banco.map((id) => porId.get(id)), subs: 0, todos: new Map(campo.map((j) => [j.p.id, j])), gols: 0, rng };
  }
  function novo(p, slot) {
    return { p, slot, base: P().ovrNoSlot(p, slot), nota: 6.0, g: 0, ast: 0, desarmes: 0, passes: 0, defesas: 0, faltas: 0, amarelos: 0, expulso: false, lesionado: false, minutos: 0, entrou: 0, saiu: null };
  }

  function forcas(side, adv) {
    const t = TATICA[side.time.tatica];
    const fd = side.formaDia === undefined ? (side.formaDia = 1 + side.rng.gauss() * 0.03) : side.formaDia; // 'dia inspirado' ±3%
    const por = { G: [], D: [], M: [], A: [] };
    side.campo.forEach((j) => por[P().GRUPO[j.slot]].push(forca(j)));
    const avg = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 30;
    // faltando jogadores (expulsão) diminui a média de forma natural: soma/11 em vez de média
    const n = side.campo.length / 11;
    const ataque = (0.60 * avg(por.A) + 0.30 * avg(por.M) + 0.10 * avg(por.D)) * t.atk * n * fd;
    const defesa = (0.45 * avg(por.D) + 0.25 * avg(por.M) + 0.30 * avg(por.G)) * t.def * n * fd;
    const controle = (0.60 * avg(por.M) + 0.20 * avg(por.A) + 0.20 * avg(por.D)) * n;
    const gk = por.G.length ? por.G[0] : 20;
    return { ataque, defesa, controle: controle * (side.time.mando ? CFG.mandante : 1), gk, t };
  }

  function sorteia(side, rng, grupos, peso) {
    const c = side.campo.filter((j) => grupos.includes(P().GRUPO[j.slot]));
    return rng.weighted(c.length ? c : side.campo, peso);
  }

  function simular(timeCasa, timeFora, rng, opts = {}) {
    const S = [montar(timeCasa, rng), montar(timeFora, rng)];
    S[0].time.mando = true; S[1].time.mando = false;
    const eventos = [];
    let F = [forcas(S[0]), forcas(S[1])];
    const ctrl = () => { const a = Math.pow(F[0].controle, CFG.expoControle), b = Math.pow(F[1].controle, CFG.expoControle); return a / (a + b); };
    const stats = [{ chutes: 0, no_gol: 0, faltas: 0, amarelos: 0, vermelhos: 0, posse: 0 }, { chutes: 0, no_gol: 0, faltas: 0, amarelos: 0, vermelhos: 0, posse: 0 }];
    const ev = (min, tipo, lado, jog, extra) => eventos.push({ min, tipo, lado, jogador: jog && jog.p.nome, ...extra });

    for (let min = 1; min <= 90; min++) {
      // IA/jogador pode intervir no intervalo (min 45) via opts.intervalo(S, eventos)
      if (min === 46 && opts.intervalo) { opts.intervalo(S, stats, eventos); F = [forcas(S[0]), forcas(S[1])]; }
      if (min % 5 === 0) F = [forcas(S[0]), forcas(S[1])];
      // cansaço: perda por minuto depende do atributo FIS (FIS 99 ≈ -13 por jogo; FIS 30 ≈ -26)
      for (const s of S) for (const j of s.campo) {
        j.minutos++;
        const perda = (26 - j.p.attr.FIS * 0.13) / 90 * (s.time.tatica === 'ofensivo' ? 1.1 : s.time.tatica === 'defensivo' ? 0.95 : 1);
        j.p.stamina = Math.max(0, j.p.stamina - perda);
        if (rng.chance(CFG.lesaoPorJogadorMin * (1.4 - j.p.attr.FIS / 200)) && !j.lesionado) {
          j.lesionado = true; j.p.lesao = rng.int(1, 8); j.p.stamina = Math.min(j.p.stamina, 15);
          ev(min, 'lesao', S.indexOf(s), j);
          trocarForcado(s, j, min, rng, ev, S.indexOf(s));
          F = [forcas(S[0]), forcas(S[1])];
        }
      }
      // quem tem a bola neste minuto?
      const pc = ctrl();
      const nAtaques = rng.chance(CFG.ataquesPorMinuto) ? 1 : 0;
      stats[0].posse += pc; stats[1].posse += 1 - pc;
      if (nAtaques) {
        const peso0 = pc * F[0].t.tempo, peso1 = (1 - pc) * F[1].t.tempo;
        const a = rng.chance(peso0 / (peso0 + peso1)) ? 0 : 1, d = 1 - a;
        const A = S[a], D = S[d];
        const pChute = P().clamp(0.48 + (F[a].ataque - F[d].defesa) * 0.0065, 0.22, 0.75);
        // passe/assistência
        const passador = sorteia(A, rng, ['M', 'A', 'D'], (j) => j.p.attr.PAS * (P().GRUPO[j.slot] === 'M' ? 2 : 1));
        passador.passes++;
        if (rng.chance(pChute)) {
          const atk = sorteia(A, rng, ['A', 'M', 'D'], (j) => Math.pow(j.p.attr.CHU, 2) * { A: 4, M: 1.5, D: 0.25 }[P().GRUPO[j.slot]]);
          stats[a].chutes++;
          const eff = atk.p.attr.CHU * mStam(atk.p.stamina) * mMoral(atk.p.moral);
          const gkj = D.campo.find((j) => j.slot === 'GOL');
          const gkEff = gkj ? gkj.p.attr.DEF * 0.6 * mStam(gkj.p.stamina) * mMoral(gkj.p.moral) + gkj.base * 0.4 : 20;
          const noGol = rng.chance(P().clamp(0.38 + (eff - 50) * 0.004, 0.2, 0.62));
          if (noGol) stats[a].no_gol++;
          const pGol = P().clamp(0.36 + (eff - gkEff) * 0.0032, 0.14, 0.58);
          if (noGol && rng.chance(pGol)) {
            A.gols++; atk.g++; atk.p.gols++;
            let ass = null;
            if (passador !== atk && rng.chance(0.65)) { passador.ast++; ass = passador; }
            ev(min, 'gol', a, atk, { assist: ass && ass.p.nome, placar: [S[0].gols, S[1].gols] });
          } else if (noGol && gkj) { gkj.defesas++; }
        } else {
          const des = sorteia(D, rng, ['D', 'M'], (j) => j.p.attr.DEF * (P().GRUPO[j.slot] === 'D' ? 2 : 1));
          des.desarmes++;
        }
      }
      // faltas (cometidas pelo time sem a bola, de preferência)
      if (rng.chance(CFG.faltaBase * 2)) {
        const lado = rng.chance(0.5 + (0.5 - ctrl()) * 0.3) ? 0 : 1; // quem tem menos a bola faz mais falta
        const S1 = S[lado];
        const fj = rng.weighted(S1.campo, (j) => P().DISC_FALTA[j.p.disciplina] * (P().GRUPO[j.slot] === 'A' ? 0.6 : 1) * (1.2 - j.p.attr.DEF / 300));
        fj.faltas++; stats[lado].faltas++;
        const pc = CFG.amareloPorFalta * P().DISC_CARTAO[fj.p.disciplina] * (fj.amarelos ? 0.6 : 1); // quem já tem amarelo pega leve
        if (rng.chance(CFG.vermelhoDireto * P().DISC_CARTAO[fj.p.disciplina])) { expulsar(S1, fj, min, ev, lado, stats, 'vermelho'); F = [forcas(S[0]), forcas(S[1])]; }
        else if (rng.chance(pc)) {
          fj.amarelos++; stats[lado].amarelos++;
          ev(min, 'amarelo', lado, fj);
          if (fj.amarelos >= 2) { expulsar(S1, fj, min, ev, lado, stats, 'vermelho (2º amarelo)'); F = [forcas(S[0]), forcas(S[1])]; }
        }
      }
    }
    // notas
    const placar = [S[0].gols, S[1].gols];
    const jogs = [];
    S.forEach((s, i) => { for (const j of s.todos.values()) { j.nota = calcNota(j, i, placar); jogs.push(j); } });
    return { placar, eventos, stats: stats.map((x) => ({ ...x, posse: Math.round(x.posse / 90 * 100) })), lados: S };
  }

  function expulsar(s, j, min, ev, lado, stats, motivo) {
    j.expulso = true; stats[lado].vermelhos++; ev(min, 'vermelho', lado, j, { motivo });
    s.campo = s.campo.filter((x) => x !== j); j.saiu = min;
  }
  function trocarForcado(s, j, min, rng, ev, lado) {
    const ok = s.subs < CFG.maxSubs ? s.banco.filter((b) => b.lesao === 0 && b.stamina > 50) : [];
    if (ok.length) {
      // escolhe o reserva de maior encaixe no slot
      const novoP = ok.sort((a, b) => P().ovrNoSlot(b, j.slot) - P().ovrNoSlot(a, j.slot))[0];
      s.banco = s.banco.filter((b) => b !== novoP); s.subs++;
      const nj = novo(novoP, j.slot); nj.entrou = min; s.todos.set(novoP.id, nj);
      s.campo[s.campo.indexOf(j)] = nj; j.saiu = min;
      ev(min, 'substituicao', lado, nj, { saiu: j.p.nome, motivo: 'lesão' });
    } else { s.campo = s.campo.filter((x) => x !== j); j.saiu = min; } // joga com 10
  }

  // Nota 0-10 (1 casa). Base 6.0; eventos somam/subtraem. Tempo jogado reduz o peso (quem entra aos 80' tende a 6.0).
  function calcNota(j, lado, placar) {
    const meu = placar[lado], adv = placar[1 - lado];
    const g = P().GRUPO[j.slot];
    let n = 6.0;
    n += 1.1 * j.g + 0.7 * j.ast;
    n += 0.18 * j.desarmes * (g === 'A' ? 1.3 : 1) + 0.035 * j.passes + (j.slot === 'GOL' ? 0.35 * j.defesas : 0);
    n -= 0.12 * j.faltas + 0.5 * (j.amarelos > 0 ? 1 : 0) + (j.expulso ? 2.0 : 0);
    n += meu > adv ? 0.4 : meu < adv ? -0.4 : 0;
    if (adv === 0 && (g === 'D' || g === 'G')) n += 0.5;
    if (adv >= 3 && (g === 'D' || g === 'G')) n -= 0.5 + 0.2 * (adv - 3);
    if (meu === 0 && g === 'A') n -= 0.3;
    const peso = Math.min(1, j.minutos / 70);
    n = 6.0 + (n - 6.0) * (0.35 + 0.65 * peso);
    return Math.round(P().clamp(n, 0, 10) * 10) / 10;
  }

  bf.Match = { FORMACOES, TATICA, CFG, simular, calcNota };
})(typeof globalThis !== 'undefined' ? globalThis : this);
