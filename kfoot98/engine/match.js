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
  // Táticas (pedra-papel-tesoura, calibradas por tools/balance.js):
  //  atk/def  = multiplicador da força de ataque/defesa     tempo    = ritmo: quem tem mais lances (e o total de lances do jogo)
  //  abertura = quanto o time se expõe (+1 ofensivo ... -1 defensivo)
  //  fecha    = reduz a chance de finalização do adversário (retranca)
  //  comp     = compactação: contra quem joga fechado, a vantagem de qualidade do adversário rende menos (ajuda o time mais fraco)
  //  contraK  = bônus nas finalizações do time de contra-ataque, proporcional à abertura do adversário
  const TATICA = {
    ofensivo: { atk: 1.05, def: 0.96, tempo: 1.06, faltas: 1.10, abertura: 1, fecha: 0, comp: 1, contraK: 0 },
    equilibrado: { atk: 1.0, def: 1.0, tempo: 1.0, faltas: 1.0, abertura: 0, fecha: 0, comp: 1, contraK: 0 },
    defensivo: { atk: 0.97, def: 1.03, tempo: 0.94, faltas: 1.0, abertura: -1, fecha: 0.02, comp: 0.8, contraK: 0 },
    contra: { atk: 0.99, def: 1.02, tempo: 0.90, faltas: 1.0, abertura: -0.5, fecha: 0, comp: 0.88, contraK: 0.13 },
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
    return { time, slots, campo, banco: time.banco.map((id) => porId.get(id)), subs: 0, maxSubs: time.maxSubs || CFG.maxSubs, todos: new Map(campo.map((j) => [j.p.id, j])), gols: 0, rng };
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

  const novoStats = () => ({ chutes: 0, no_gol: 0, faltas: 0, amarelos: 0, vermelhos: 0, posse: 0 });
  const recalcular = (m) => { m.F = [forcas(m.S[0]), forcas(m.S[1])]; };
  const placarDe = (m) => [m.S[0].gols, m.S[1].gols];

  // Cria uma partida "viva": avance minuto a minuto com passo(m). Permite pausar, trocar jogadores e mudar a tática.
  function criar(timeCasa, timeFora, rng) {
    const S = [montar(timeCasa, rng), montar(timeFora, rng)];
    S[0].time.mando = true; S[1].time.mando = false;
    return { S, rng, min: 0, eventos: [], stats: [novoStats(), novoStats()], F: [forcas(S[0]), forcas(S[1])], terminou: false };
  }

  function passo(m) {
    const { S, rng, stats, eventos } = m;
    const min = ++m.min;
    const ctrl = () => { const a = Math.pow(m.F[0].controle, CFG.expoControle), b = Math.pow(m.F[1].controle, CFG.expoControle); return a / (a + b); };
    const ev = (min, tipo, lado, jog, extra) => eventos.push({ min, tipo, lado, jogador: jog && jog.p.nome, ...extra });
    if (min % 5 === 0) recalcular(m);
      // cansaço: perda por minuto depende do atributo FIS (FIS 99 ≈ -13 por jogo; FIS 30 ≈ -26)
      for (const s of S) for (const j of s.campo) {
        j.minutos++;
        const perda = (26 - j.p.attr.FIS * 0.13) / 90 * (s.time.tatica === 'ofensivo' ? 1.1 : s.time.tatica === 'defensivo' ? 0.95 : 1);
        j.p.stamina = Math.max(0, j.p.stamina - perda);
        if (rng.chance(CFG.lesaoPorJogadorMin * (1.4 - j.p.attr.FIS / 200)) && !j.lesionado) {
          j.lesionado = true; j.p.lesao = rng.int(1, 8); j.p.stamina = Math.min(j.p.stamina, 15);
          ev(min, 'lesao', S.indexOf(s), j);
          trocarForcado(s, j, min, rng, ev, S.indexOf(s));
          recalcular(m);
        }
      }
      // quem tem a bola neste minuto?
      const pc = ctrl();
      const nAtaques = rng.chance(CFG.ataquesPorMinuto * (m.F[0].t.tempo + m.F[1].t.tempo) / 2) ? 1 : 0;   // dois times fechados = jogo truncado
      stats[0].posse += pc; stats[1].posse += 1 - pc;
      if (nAtaques) {
        const peso0 = pc * m.F[0].t.tempo, peso1 = (1 - pc) * m.F[1].t.tempo;
        const a = rng.chance(peso0 / (peso0 + peso1)) ? 0 : 1, d = 1 - a;
        const A = S[a], D = S[d];
        const bonusContra = m.F[a].t.contraK * (m.F[d].t.abertura > 0 ? m.F[d].t.abertura : m.F[d].t.abertura * 0.4) - m.F[d].t.fecha; // espaço para o contra-ataque e retranca
        const dif = m.F[a].ataque - m.F[d].defesa;
        const pChute = P().clamp(0.48 + (dif > 0 ? dif * m.F[d].t.comp : dif) * 0.0065 + bonusContra, 0.22, 0.75);
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
        if (rng.chance(CFG.vermelhoDireto * P().DISC_CARTAO[fj.p.disciplina])) { expulsar(S1, fj, min, ev, lado, stats, 'vermelho'); recalcular(m); }
        else if (rng.chance(pc)) {
          fj.amarelos++; stats[lado].amarelos++;
          ev(min, 'amarelo', lado, fj);
          if (fj.amarelos >= 2) { expulsar(S1, fj, min, ev, lado, stats, 'vermelho (2º amarelo)'); recalcular(m); }
        }
      }
  }

  function finalizar(m) {
    const placar = placarDe(m);
    m.S.forEach((s, i) => { for (const j of s.todos.values()) j.nota = calcNota(j, i, placar); });
    m.terminou = true;
    return { placar, eventos: m.eventos, stats: m.stats.map((x) => ({ ...x, posse: Math.round(x.posse / Math.max(1, m.min) * 100) })), lados: m.S };
  }

  // Partida inteira de uma vez (simulação rápida). opts.intervalo(S, stats, eventos) é chamado aos 46'; opts.ia liga as trocas automáticas.
  function simular(timeCasa, timeFora, rng, opts = {}) {
    const m = criar(timeCasa, timeFora, rng);
    for (let i = 1; i <= 90; i++) {
      if (i === 46 && opts.intervalo) { opts.intervalo(m.S, m.stats, m.eventos); recalcular(m); }
      if (opts.ia && (i === 60 || i === 70 || i === 80)) m.S.forEach((s) => iaSubstituicoes(m, s));
      passo(m);
    }
    return finalizar(m);
  }

  // Troca automática do computador: tira quem está mais cansado (stamina < 45) e põe o melhor reserva para o slot.
  function iaSubstituicoes(m, s) {
    if (s.subs >= s.maxSubs) return;
    const cand = s.campo.filter((j) => j.slot !== 'GOL').sort((a, b) => a.p.stamina - b.p.stamina)[0];
    if (!cand || cand.p.stamina > 45) return;
    const livres = s.banco.filter((p) => p.lesao === 0 && p.pos !== 'GOL');
    if (!livres.length) return;
    const nota = (p) => P().ovrNoSlot(p, cand.slot) * (0.8 + p.stamina / 500);
    const melhor = livres.sort((a, b) => nota(b) - nota(a))[0];
    substituirM(m, m.S.indexOf(s), cand.p.id, melhor.id, 'tática');
  }

  function expulsar(s, j, min, ev, lado, stats, motivo) {
    j.expulso = true; stats[lado].vermelhos++; ev(min, 'vermelho', lado, j, { motivo });
    s.campo = s.campo.filter((x) => x !== j); j.saiu = min;
  }
  function trocarForcado(s, j, min, rng, ev, lado) {
    const ok = s.subs < s.maxSubs ? s.banco.filter((b) => b.lesao === 0 && b.stamina > 50) : [];
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

  // Substituição manual (intervalo ou pausa). Respeita o limite de trocas do time (3 em 1998; 5 no modo moderno).
  function substituir(side, saiId, entraId, min) {
    if (side.subs >= side.maxSubs) return { ok: false, motivo: 'Limite de ' + side.maxSubs + ' substituições atingido' };
    const sai = side.campo.find((j) => j.p.id === saiId);
    const entra = side.banco.find((p) => p.id === entraId);
    if (!sai) return { ok: false, motivo: 'Jogador não está em campo' };
    if (!entra) return { ok: false, motivo: 'Jogador não está no banco' };
    if (entra.lesao > 0) return { ok: false, motivo: 'Jogador lesionado' };
    const nj = novo(entra, sai.slot); nj.entrou = min;
    side.banco = side.banco.filter((b) => b !== entra); side.subs++;
    side.todos.set(entra.id, nj); side.campo[side.campo.indexOf(sai)] = nj; sai.saiu = min;
    return { ok: true };
  }

  // Substituição manual numa partida viva (registra o evento e recalcula as forças).
  function substituirM(m, lado, saiId, entraId, motivo) {
    const s = m.S[lado], sai = s.campo.find((j) => j.p.id === saiId);
    const r = substituir(s, saiId, entraId, m.min);
    if (r.ok) {
      const nj = s.todos.get(entraId);
      m.eventos.push({ min: m.min, tipo: 'substituicao', lado, jogador: nj.p.nome, saiu: sai.p.nome, motivo: motivo || 'técnico' });
      recalcular(m);
    }
    return r;
  }

  bf.Match = { FORMACOES, TATICA, CFG, criar, passo, finalizar, recalcular, placarDe, simular, calcNota, substituir, substituirM, iaSubstituicoes };
})(typeof globalThis !== 'undefined' ? globalThis : this);
