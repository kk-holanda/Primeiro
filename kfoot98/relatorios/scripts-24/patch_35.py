# ---- Melhorias #34 (v38): regras do futebol no motor: saída de bola, lados, bola com zona e faixa, faltas com local, goleiro último homem ----

# ===== configuração e estatísticas =====
rep("  const CFG = {\n    escalaMinuto: 0.94,", "  const CFG = {\n    fz: { dir: 0.27, lat: 0.64 }, fzD: { dir: 0.5, lat: 0.5 }, gkUltimo: 0.012, troca: 0.55, escalaMinuto: 0.94,")
rep("const novoStats = () => ({ imp: 0, chutes: 0,", "const novoStats = () => ({ terco: [0, 0, 0], laterais: 0, tirosMeta: 0, imp: 0, chutes: 0,")

# ===== campo: zonas, faixas e a bola =====
rep("  // Cria uma partida \"viva\": avance minuto a minuto com passo(m).", r"""  // ---------- Campo (v38): a bola tem dono, zona e faixa ----------
  // zona (vista por quem tem a bola): 0 própria área, 1 terço defensivo, 2 meio-campo, 3 terço de ataque, 4 grande área adversária
  // faixa: 0 lateral esquerda, 1 meio-espaço esquerdo, 2 corredor central, 3 meio-espaço direito, 4 lateral direita (esquerda e direita vistas por quem ataca)
  const WIDE_E = [1, 0.35, 0, 0, 0], WIDE_D = [0, 0, 0, 0.35, 1], MEIO_E = [0.1, 0.7, 0.5, 0, 0], MEIO_D = [0, 0, 0.5, 0.7, 0.1], CENTRO = [0, 0.2, 1, 0.2, 0];
  // faixas de cada jogador: laterais, alas e pontas no corredor; duplas (zagueiros, volantes, meias) nos meios-espaços; o resto no centro
  function faixasDoLado(s) {
    const cnt = {}, vis = {};
    s.campo.forEach((j) => { cnt[j.slot] = (cnt[j.slot] || 0) + 1; });
    s.campo.forEach((j) => {
      const k = vis[j.slot] = (vis[j.slot] || 0) + 1, n = cnt[j.slot];
      j.fx = j.slot === 'LE' || j.slot === 'PE' ? WIDE_E : j.slot === 'LD' || j.slot === 'PD' ? WIDE_D
        : j.slot === 'ALA' ? (k === 1 ? WIDE_E : WIDE_D)
        : j.slot === 'GOL' ? CENTRO : n === 2 ? (k === 1 ? MEIO_E : MEIO_D) : n === 3 ? (k === 1 ? MEIO_E : k === 2 ? CENTRO : MEIO_D) : CENTRO;
    });
  }
  const pesoFx = (j, L) => 0.45 + 1.1 * (j.fx ? j.fx[L] : 0.2);
  function faixaPesos(s, F) {
    const w = [0.02, 0.02, 0.02, 0.02, 0.02], wide = 0.8 + 0.5 * ((F.t.props && F.t.props.wide) || 0.3);
    s.campo.forEach((j) => { const a = ({ G: 0, D: 0.45, M: 1, A: 1.35 }[GR(j)] || 0) * (j.p.attr.RIT * 0.3 + j.p.attr.DRI * 0.35 + j.p.attr.PAS * 0.35) / 60; for (let L = 0; L < 5; L++) w[L] += a * (j.fx ? j.fx[L] : 0); });
    w[0] *= wide; w[4] *= wide; return w;
  }
  const ZX = [7, 24, 50, 76, 92], FY = [10, 30, 50, 70, 90], WZ = [0.5, 0.9, 3.4, 0.9, 0.5], FZW = [0.5, 0.55, 1.15, 1.1, 1];   // FZW: onde as faltas mais acontecem (vista por quem sofre): pouco no campo de defesa de quem sofre, mais no meio e perto da área   // WZ: tempo que a bola passa em cada zona do caminho (o meio-campo é onde o jogo mais se arrasta)
  function bolaXY(m, pos, z, f) {
    const d = (m.dir || [1, -1])[pos], zx = ZX[z], fy = FY[f];
    return { pos, z, f, x: d > 0 ? zx : 100 - zx, y: d > 0 ? fy : 100 - fy };
  }
  // matriz de transição: a cada minuto a bola avança, recua ou troca de dono. A posse do minuto (pc) é o viés:
  // trocar de dono tem chance troca*(1-posse), então, na média, cada time fica com a bola a fração pc do tempo (como antes)
  function transicao(m, B0, pc) {
    const rng = m.rng;
    let pos = B0.pos, z = B0.z, f = B0.f;
    if (z >= 4) { pos = 1 - pos; z = rng.chance(0.6) ? 0 : 1; f = 4 - f; }   // depois de um lance na área, quem defende sai jogando de trás (tiro de meta ou bola dominada)
    const share = pos === 0 ? pc : 1 - pc;
    if (rng.chance(CFG.troca * (1 - share))) { pos = 1 - pos; z = Math.min(3, 4 - z); f = 4 - f; }   // roubada: quem recupera fica com a bola onde ela estava
    else {
      const pr = m.F[pos].t.props || {}, t = P().clamp((share - 0.5) * 1.6, -0.5, 0.5);
      const w = [0.30 * (1 - t), 0.40 * (1 + 0.3 * (pr.build || 0)), 0.30 * (1 + t) * (1 + 0.4 * (pr.dir || 0))];   // saída curta segura a bola; jogo direto avança mais
      z = P().clamp(z + rng.weighted([-1, 0, 1], (s) => w[s + 1]), 0, 3);
      faixasDoLado(m.S[pos]); const fw = faixaPesos(m.S[pos], m.F[pos]);
      f = rng.weighted([f - 1, f, f + 1].filter((x) => x >= 0 && x <= 4), (x) => fw[x] * (x === f ? 1.6 : 1));
    }
    return bolaXY(m, pos, z, f);
  }
  // caminho da bola no minuto (para a posse por terço e o local das faltas): da zona em que estava até onde chegou
  function caminho(B0, pos, zEnd, f) {
    const z0 = B0.pos === pos ? B0.z : B0.z >= 4 ? 0 : Math.min(3, 4 - B0.z), tr = [], st = zEnd >= z0 ? 1 : -1;
    for (let z = z0; ; z += st) { tr.push({ pos, z, f }); if (z === zEnd) break; }
    return tr;
  }

  // Cria uma partida "viva": avance minuto a minuto com passo(m).""")

# ===== passo: saída de bola, lados e troca no segundo tempo =====
rep("    if (min === m.meio + 1) { S.forEach((s, i) => { s.ajusteInt",
"""    // regra 8: o mandante escolhe o lado e o visitante dá a saída; no 2º tempo os lados se invertem e o mandante sai; depois de cada gol, sai quem sofreu.
    // Na saída todos estão no próprio campo e a bola está no centro.
    if (min === 1 || m.pausas.includes(min - 1)) {
      m.per = m.per == null ? 0 : m.per + 1; m.dir = m.per === 0 ? [1, -1] : [-m.dir[0], -m.dir[1]];
      m.saida = { lado: m.per % 2 === 0 ? 1 : 0, min, per: m.per };
      ev(min, 'saida', m.saida.lado, null, { per: m.per, dir: m.dir.slice() });
    } else if (S[0].gols + S[1].gols > (m.gTot || 0)) {
      const ult = eventos.slice().reverse().find((e) => e.tipo === 'gol');
      if (ult) { m.saida = { lado: 1 - ult.lado, min, per: -1 }; ev(min, 'saida', 1 - ult.lado, null, { per: -1, dir: m.dir.slice() }); }
    }
    m.gTot = S[0].gols + S[1].gols;
    if (m.saida && m.saida.min === min) m.bola = bolaXY(m, m.saida.lado, 2, 2);
    if (min === m.meio + 1) { S.forEach((s, i) => { s.ajusteInt""")
rep("      const pc = P().clamp(ctrl() + m.mom + P().clamp((S[1].gols - S[0].gols) * 0.015, -0.04, 0.04), 0.15, 0.85);   // quem perde fica um pouco mais com a bola",
    "      let pc = P().clamp(ctrl() + m.mom + P().clamp((S[1].gols - S[0].gols) * 0.015, -0.04, 0.04), 0.15, 0.85);   // quem perde fica um pouco mais com a bola\n      if (m.saida && m.saida.min === min) pc = pc * 0.5 + (m.saida.lado === 0 ? 0.5 : 0);   // no minuto da saída de bola, quem saiu fica mais com ela")

# ===== passo: por onde sai o ataque; quem participa depende da faixa =====
rep("      if (nAtaques) {\n        const folga",
    "      const B0 = m.bola || bolaXY(m, rng.chance(pc) ? 0 : 1, 2, 2); m.bola = null; m.tr = null;\n      if (nAtaques) {\n        const folga")
rep("        const A = S[a], D = S[d];\n        const bonusContra",
"""        const A = S[a], D = S[d];
        faixasDoLado(A); faixasDoLado(D);
        const fw = faixaPesos(A, m.F[a]), L = B0.pos === a && rng.chance(0.5) ? B0.f : rng.weighted([0, 1, 2, 3, 4], (i) => fw[i]);   // por onde sai o ataque (muitas vezes pela faixa onde a bola já estava)
        m.bola = bolaXY(m, a, 3, L); m.tr = caminho(B0, a, 3, L);
        const bonusContra""")
rep("        let passador = sorteia(A, rng, ['G', 'M', 'A', 'D'], pesoPas);",
    "        let passador = sorteia(A, rng, ['G', 'M', 'A', 'D'], (j) => pesoPas(j) * pesoFx(j, L));")
rep("(j.p.trait === 'driblador' ? 1.5 : j.p.trait === 'catimbeiro' ? 1.25 : 1));\n        const mk = sorteia(D, rng, ['D', 'M'], (j) => Math.pow(j.p.attr.DEF, 1.2) * (GR(j) === 'D' ? 3 : 1) * (j.p.trait === 'desarmador' ? 1.25 : 1));",
    "(j.p.trait === 'driblador' ? 1.5 : j.p.trait === 'catimbeiro' ? 1.25 : 1) * pesoFx(j, L));\n        const mk = sorteia(D, rng, ['D', 'M'], (j) => Math.pow(j.p.attr.DEF, 1.2) * (GR(j) === 'D' ? 3 : 1) * (j.p.trait === 'desarmador' ? 1.25 : 1) * pesoFx(j, 4 - L));   // o marcador cobre a faixa espelhada (a esquerda de quem ataca é a direita de quem defende)")
# falta de drible: a zona sai junto. Na grande área é pênalti (e ali o porradeiro pesa mais); perto da área pelo centro, tiro livre direto; pelos lados, falta lateral
rep("""          cometerFalta(m, d, mk, min, ev, dri.p.trait === 'catimbeiro' ? 1.5 : 1); dri.sofreu = (dri.sofreu || 0) + 1;
          if (rng.chance({ A: 0.24, M: 0.11, D: 0.02 }[GR(dri)] * (dri.p.trait === 'driblador' ? 1.3 : 1))) {""",
"""          const ehPen = rng.chance({ A: 0.24, M: 0.11, D: 0.02 }[GR(dri)] * (dri.p.trait === 'driblador' ? 1.3 : 1) * Math.pow(P().DISC_FALTA[mk.p.disciplina], 0.7) * CFG.penDisc), lado4 = L === 0 || L === 4;
          if (ehPen) { m.bola = bolaXY(m, a, 4, L); m.tr.push({ pos: a, z: 4, f: L }); }
          cometerFalta(m, d, mk, min, ev, dri.p.trait === 'catimbeiro' ? 1.5 : 1, { z: ehPen ? 4 : 3, f: L, lat: !ehPen && lado4 }); dri.sofreu = (dri.sofreu || 0) + 1;
          if (ehPen) {""")
rep("          else if (rng.chance(0.5)) cobrarFalta(m, a, ev, min);\n",
    "          else if (!lado4 && rng.chance(CFG.fzD.dir)) cobrarFalta(m, a, ev, min);   // perto da área, de frente: cobrança direta\n          else if (lado4 && rng.chance(CFG.fzD.lat)) { const cand = A.campo.filter((j) => j.slot !== 'GOL'); if (cand.length) bolaAerea(m, a, cand.slice().sort((x, y) => cobrNota(y) - cobrNota(x))[0], ev, min, 'falta'); }   // falta lateral: cruzamento na área\n")
rep("            const marc = mk, mEff =", "            m.bola = bolaXY(m, a, 4, L); m.tr.push({ pos: a, z: 4, f: L });   // finalização: bola na grande área\n            const marc = mk, mEff =")
# cara a cara: o goleiro pode derrubar o atacante (pênalti e vermelho por ser o último homem)
rep("              r = chutar(m, a, atk, passador, (atk.p.attr.CHU * 0.7 + atk.p.attr.RIT * 0.15 + atk.p.attr.DRI * 0.15) * efM(atk) + m.F[a].t.qual + m.F[a].mu.qual * 0.5, mEff, 'bola', ev, min, cara ? { cara: true } : undefined);",
"""              const gkU = cara && !m.penPend && D.campo.find((j) => j.slot === 'GOL');
              if (gkU && rng.chance(CFG.gkUltimo * P().DISC_FALTA[gkU.p.disciplina])) {
                gkU.faltas++; stats[d].faltas++; (m.fzCont = m.fzCont || [0, 0, 0, 0, 0, 0, 0])[4]++;
                ev(min, 'falta', d, gkU, { zona: 4, faixa: L, pos: 'GOL', area: true, ultimo: true });
                expulsar(D, gkU, min, ev, d, stats, 'vermelho (último homem)', rng); recalcular(m);
                if (A.manual) m.penPend = { lado: a, min, faltoso: gkU.p.nome }; else cobrarPenalti(m, a, null, gkU.p.nome);
                r = { gol: true };
              } else r = chutar(m, a, atk, passador, (atk.p.attr.CHU * 0.7 + atk.p.attr.RIT * 0.15 + atk.p.attr.DRI * 0.15) * efM(atk) + m.F[a].t.qual + m.F[a].mu.qual * 0.5, mEff, 'bola', ev, min, cara ? { cara: true } : undefined);""")
rep("            const des = sorteia(D, rng, ['D', 'M'], (j) => (j.p.attr.DEF * 0.8 + j.p.attr.RIT * 0.2) * (GR(j) === 'D' ? 2 : 1) * (j.p.trait === 'desarmador' ? 1.5 : 1));\n            des.desarmes++;\n            if (rng.chance(0.07)) escanteio(m, a, ev, min);",
    "            const des = sorteia(D, rng, ['D', 'M'], (j) => (j.p.attr.DEF * 0.8 + j.p.attr.RIT * 0.2) * (GR(j) === 'D' ? 2 : 1) * (j.p.trait === 'desarmador' ? 1.5 : 1) * pesoFx(j, 4 - L));\n            des.desarmes++; m.bola = bolaXY(m, d, 1, 4 - L); m.tr.push({ pos: d, z: 1, f: 4 - L });   // desarme: quem defende sai com a bola do seu terço\n            if (rng.chance(0.07)) escanteio(m, a, ev, min); else if ((L === 0 || L === 4) && rng.chance(0.16)) stats[rng.chance(0.5) ? a : d].laterais++;")
rep("            if (!r.gol && rng.chance(r.noGol ? 0.40 : 0.18)) escanteio(m, a, ev, min);",
    "            if (!r.gol && rng.chance(r.noGol ? 0.40 : 0.18)) escanteio(m, a, ev, min); else if (!r.gol && !r.noGol && rng.chance(0.5)) stats[d].tirosMeta++;   // chute para fora: tiro de meta")
rep("      if (min === m.meio) fimDoTempo(m);\n",
"""      if (!m.bola) { m.bola = m.saida && m.saida.min === min ? B0 : transicao(m, B0, pc); m.tr = caminho(B0, m.bola.pos, m.bola.z, m.bola.f); }   // minuto sem ataque: a bola anda pela matriz de transição
      { const tw = m.tr.reduce((x, e) => x + WZ[e.z], 0); for (const e of m.tr) stats[e.pos].terco[e.z <= 1 ? 0 : e.z === 2 ? 1 : 2] += WZ[e.z] / tw; }   // posse por terço do campo (do ponto de vista de quem tem a bola)
      if (rng.chance(0.2)) stats[rng.chance(0.5) ? 0 : 1].laterais++;   // bola pela linha lateral
      if (min === m.meio) fimDoTempo(m);
""")
# pênalti sem drible (mão na bola, toque): sempre dentro da grande área do faltoso; defensores, volantes e porradeiros pesam mais; o goleiro raramente
rep("        const cj = S[d].campo.filter((j) => j.slot !== 'GOL'), fj = rng.weighted(cj.length ? cj : S[d].campo, (j) => P().DISC_FALTA[j.p.disciplina] * (1.2 - j.p.attr.DEF / 300));\n        cometerFalta(m, d, fj, min, ev, 2.9);",
    "        faixasDoLado(S[a]); faixasDoLado(S[d]); const fwp = faixaPesos(S[a], m.F[a]), Lp = rng.weighted([0, 1, 2, 3, 4], (i) => fwp[i]); m.bola = bolaXY(m, a, 4, Lp);\n        const fj = rng.weighted(S[d].campo, (j) => Math.pow(P().DISC_FALTA[j.p.disciplina], 1.4) * (1.2 - j.p.attr.DEF / 300) * ({ G: 0.12, D: 1.3, M: 1, A: 0.5 }[GR(j)] || 1) * (j.slot === 'VOL' ? 1.15 : 1) * pesoFx(j, 4 - Lp));\n        cometerFalta(m, d, fj, min, ev, 2.9, { z: 4, f: Lp });")
# faltas gerais: o local vem da bola; o goleiro quase não faz falta fora da área; perto da área: de frente, cobrança direta; pelos lados, cruzamento
rep("""        const fj = rng.weighted(S1.campo, (j) => P().DISC_FALTA[j.p.disciplina] * (P().GRUPO[j.slot] === 'A' ? 0.6 : 1) * (1.2 - j.p.attr.DEF / 300));
        cometerFalta(m, lado, fj, min, ev, m.F[lado].t.faltas);
        const z = rng.next();
        if (z < 0.075) cobrarFalta(m, 1 - lado, ev, min);   // perto da área: cobrança direta
        else if (z < 0.125) {""",
"""        const fouled = 1 - lado, B = rng.weighted(m.tr, (e) => WZ[e.z] * FZW[e.pos === fouled ? e.z : 4 - e.z]), zf = P().clamp(B.pos === fouled ? B.z : 4 - B.z, 1, 3), Lf = B.pos === fouled ? B.f : 4 - B.f, lat = Lf === 0 || Lf === 4;   // local da falta, visto por quem a sofre
        faixasDoLado(S1);
        const fj = rng.weighted(S1.campo, (j) => P().DISC_FALTA[j.p.disciplina] * (P().GRUPO[j.slot] === 'A' ? 0.6 : 1) * (1.2 - j.p.attr.DEF / 300) * (j.slot === 'GOL' ? 0.08 : 1) * pesoFx(j, 4 - Lf)
          * (zf === 3 && (GR(j) === 'D' || j.slot === 'VOL') ? 1.4 * Math.pow(P().DISC_FALTA[j.p.disciplina], 0.5) : 1) * (zf === 1 ? ({ D: 0.45, G: 0, M: 1, A: 1.5 }[GR(j)] ?? 1) : 1));   // na pressão lá na frente quem bate é atacante e meia   // perto da própria área, defensor e porradeiro pesam mais
        cometerFalta(m, lado, fj, min, ev, m.F[lado].t.faltas, { z: zf, f: Lf, lat: zf === 3 && lat }); (m.fzG = m.fzG || [0, 0, 0, 0])[zf === 3 ? (lat ? 3 : 2) : zf === 2 ? 1 : 0]++;
        const z = rng.next();
        if (zf < 3) { /* longe da área: tiro livre comum, sem perigo */ }
        else if (!lat) { if (z < CFG.fz.dir) cobrarFalta(m, 1 - lado, ev, min); }   // perto da área, de frente: cobrança direta
        else if (z < CFG.fz.lat) {""")
# a falta passa a ter local (zona e faixa) e vira lance do relato
rep("  function cometerFalta(m, lado, fj, min, ev, k) {\n    const { S, rng, stats } = m, S1 = S[lado];\n    fj.faltas++; stats[lado].faltas++;",
"""  function cometerFalta(m, lado, fj, min, ev, k, loc) {
    const { S, rng, stats } = m, S1 = S[lado];
    fj.faltas++; stats[lado].faltas++;
    if (loc) { const c = m.fzCont = m.fzCont || [0, 0, 0, 0, 0, 0, 0]; c[loc.z]++; if (loc.z === 3) c[loc.lat ? 6 : 5]++; if (CFG.logFaltas || S[0].manual || S[1].manual) ev(min, 'falta', lado, fj, { zona: loc.z, faixa: loc.f, pos: fj.slot, area: loc.z === 4 }); }""")
rep("fz: { dir: 0.27, lat: 0.64 },", "fz: { dir: 0.30, lat: 0.20 }, penDisc: 0.87,")
rep("          if (imped) { stats[a].imp = (stats[a].imp || 0) + 1; }", "          if (imped) { stats[a].imp = (stats[a].imp || 0) + 1; m.bola = bolaXY(m, d, 1, 4 - L); m.tr.push({ pos: d, z: 1, f: 4 - L }); }   // impedimento: tiro livre indireto para quem defende")

# ===================== interface =====================
rep("  const tagEv = (e) => ({ gol: ['GOL', 'gol'],", r"""  // local da falta contado por quem a cometeu: zona (vista por quem sofreu) e faixa espelhada
  const FX_TXT = ['pela lateral esquerda', 'pelo meio-espaço esquerdo', 'pelo meio', 'pelo meio-espaço direito', 'pela lateral direita'];
  const localFalta = (e) => (e.zona === 4 ? 'dentro da própria grande área: pênalti' + (e.ultimo ? ' e vermelho (último homem)' : '') : e.zona === 3 ? 'perto da própria área' : e.zona === 2 ? 'no meio-campo' : 'no campo de ataque') + ', ' + FX_TXT[4 - e.faixa];
  const tagEv = (e) => ({ saida: ['SAÍDA', 'sub'], falta: ['FALTA', 'fal'], gol: ['GOL', 'gol'],""")
rep("    if (e.tipo === 'impedimento') txt = 'Gol anulado! '",
"""    if (e.tipo === 'saida') txt = e.per === 0 ? 'Começa o jogo! ' + nome(p.jogo.casa) + ' escolheu o lado e ' + clube + ' toca a bola no meio-campo' : e.per === 1 ? 'Começa o 2º tempo: os times trocam de lado e ' + clube + ' dá a saída' : e.per === 2 ? 'Começa a prorrogação: ' + clube + ' dá a saída' : e.per === 3 ? 'Começa o 2º tempo da prorrogação: ' + clube + ' dá a saída' : clube + ' recomeça do meio-campo depois do gol';
    if (e.tipo === 'falta') txt = 'Falta de ' + e.jogador + ' (' + e.pos + ', ' + clube + ') ' + localFalta(e);
    if (e.tipo === 'impedimento') txt = 'Gol anulado! '""")

# campinho: as duas formações, a bola, o lado de cada time e a posse por terço
rep("  function posseBar(P) {", r"""  const ZX_C = [7, 24, 50, 76, 92], XG = { GOL: 4, LIB: 13, ZAG: 17, LD: 21, LE: 21, VOL: 32, MC: 40, ALA: 44, MEI: 51, PD: 60, PE: 60, SA: 61, CA: 66 };
  const ZONA_TXT = ['na própria área', 'no campo de defesa', 'no meio-campo', 'no campo de ataque', 'na área adversária'];
  const escH = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function svgCampo(P) {
    const m = P.m, A = G.g.porId.get(P.jogo.casa), B = G.g.porId.get(P.jogo.fora), cor = [A.cores[0], B.cores[0] === A.cores[0] ? B.cores[1] : B.cores[0]];
    const dir = m.dir || [1, -1], bola = m.bola, sd = m.saida, kick = sd && sd.per >= 0 && m.min - sd.min < 3 ? (m.min - sd.min) / 3 : 1;   // na saída todos estão no próprio campo; avançam nos primeiros minutos
    let s = '<svg viewBox="-3 -1 111 70" role="img" aria-label="Campo: posição dos times e da bola"><rect x="-3" y="-1" width="111" height="70" fill="#2e7d3c"/>';
    s += '<g fill="none" stroke="#fff" stroke-opacity=".75" stroke-width=".35"><rect x="0" y="0" width="105" height="68"/><line x1="52.5" y1="0" x2="52.5" y2="68"/><circle cx="52.5" cy="34" r="9.15"/>'
      + '<rect x="0" y="13.84" width="16.5" height="40.32"/><rect x="88.5" y="13.84" width="16.5" height="40.32"/><rect x="0" y="24.84" width="5.5" height="18.32"/><rect x="99.5" y="24.84" width="5.5" height="18.32"/>'
      + '<path d="M16.5,26.69 A9.15,9.15 0 0 1 16.5,41.31"/><path d="M88.5,26.69 A9.15,9.15 0 0 0 88.5,41.31"/><rect x="-2" y="30.34" width="2" height="7.32"/><rect x="105" y="30.34" width="2" height="7.32"/></g>'
      + '<g stroke="#fff" stroke-opacity=".18" stroke-width=".3" stroke-dasharray="1.5 1.5"><line x1="35" y1="0" x2="35" y2="68"/><line x1="70" y1="0" x2="70" y2="68"/><line x1="0" y1="13.6" x2="105" y2="13.6"/><line x1="0" y1="27.2" x2="105" y2="27.2"/><line x1="0" y1="40.8" x2="105" y2="40.8"/><line x1="0" y1="54.4" x2="105" y2="54.4"/></g>'
      + '<g fill="#fff" fill-opacity=".8"><circle cx="52.5" cy="34" r=".5"/><circle cx="11" cy="34" r=".5"/><circle cx="94" cy="34" r=".5"/></g>';
    m.S.forEach((side, i) => {
      const meu = bola && bola.pos === i, zt = bola ? (meu ? bola.z : 4 - bola.z) : 2, bx = ZX_C[zt] * 1.05;
      const ab = side.time.tatica === 'ofensivo' ? 3 : side.time.tatica === 'defensivo' ? -3 : 0;
      const shift = (bx - 52) * 0.45 + (meu ? 6 : -3) + ab;
      side.campo.forEach((j) => {
        const xb = XG[j.slot] || 40, xn = j.slot === 'GOL' ? xb : Math.max(2, Math.min(100, xb + shift)), xk = Math.min(xb, 48), x = xk + (xn - xk) * kick;
        const fx = j.fx || [0, 0.2, 1, 0.2, 0], sw = fx.reduce((a, b) => a + b, 0) || 1, e = fx.reduce((a, b, k) => a + b * k, 0) / sw, y = 6 + e * 14;
        const X = dir[i] > 0 ? x : 105 - x, Y = dir[i] > 0 ? y : 68 - y;
        s += '<circle cx="' + X.toFixed(1) + '" cy="' + Y.toFixed(1) + '" r="1.7" fill="' + cor[i] + '" stroke="#fff" stroke-width=".35"><title>' + escH(j.p.nome + ' (' + j.slot + ')') + '</title></circle>';
      });
    });
    if (bola) s += '<circle cx="' + (bola.x * 1.05).toFixed(1) + '" cy="' + (bola.y * 0.68).toFixed(1) + '" r="1.1" fill="#fff" stroke="#111" stroke-width=".35"><title>Bola</title></circle>';
    return s + '</svg>';
  }
  function legendaCampo(P) {
    const m = P.m, dir = m.dir || [1, -1], st = m.stats, ter = (i) => { const t = st[i].terco || [0, 0, 0], n = t[0] + t[1] + t[2] || 1; return t.map((v) => Math.round(v / n * 100)).join(' / '); };
    const quem = m.bola ? nome(m.bola.pos === 0 ? P.jogo.casa : P.jogo.fora) + ' com a bola ' + ZONA_TXT[m.bola.z] + ', ' + FX_TXT[m.bola.f] : 'Bola no centro do campo';
    return [quem + '.', nome(P.jogo.casa) + ' ataca para a ' + (dir[0] > 0 ? 'direita →' : '← esquerda') + '; ' + nome(P.jogo.fora) + ' para a ' + (dir[1] > 0 ? 'direita →' : '← esquerda') + '.',
      'Posse por terço (defesa / meio / ataque): ' + nome(P.jogo.casa) + ' ' + ter(0) + ' · ' + nome(P.jogo.fora) + ' ' + ter(1) + '.'];
  }
  function campinho(P) {
    const box = h('div', { class: 'campinho' }), svg = h('div', { class: 'csvg' }), l1 = h('small', null), l2 = h('small', null), l3 = h('small', null);
    box.append(svg, l1, l2, l3);
    REFS.campoFn = (P) => { svg.innerHTML = svgCampo(P); const [a, b, c] = legendaCampo(P); l1.textContent = a; l2.textContent = b; l3.textContent = c; };
    REFS.campoFn(P);
    return box;
  }
  function posseBar(P) {""")
rep("    if (REFS.escFn) REFS.escFn(P);", "    if (REFS.escFn) REFS.escFn(P);\n    if (REFS.campoFn) REFS.campoFn(P);")
rep("    REFS.rows = new Map(); REFS.stats = []; REFS.escFn = null; REFS.posseFn = null;", "    REFS.rows = new Map(); REFS.stats = []; REFS.escFn = null; REFS.posseFn = null; REFS.campoFn = null;")
rep("      posseBar(P), h('div', { class: 'stats' }, stat('Chutes', 'chutes'), stat('No gol', 'no_gol'), stat('Escanteios', 'escanteios'), stat('Impedimentos', 'imp'), stat('Faltas', 'faltas'),",
    "      posseBar(P), campinho(P), h('div', { class: 'stats' }, stat('Chutes', 'chutes'), stat('No gol', 'no_gol'), stat('Escanteios', 'escanteios'), stat('Impedimentos', 'imp'), stat('Faltas', 'faltas'), stat('Laterais', 'laterais'), stat('Tiros de meta', 'tirosMeta'),")
rep("linha('Impedimentos', st[0].imp || 0, st[1].imp || 0),",
    "linha('Impedimentos', st[0].imp || 0, st[1].imp || 0), linha('Laterais', st[0].laterais || 0, st[1].laterais || 0), linha('Tiros de meta', st[0].tirosMeta || 0, st[1].tirosMeta || 0), linha('Posse no campo de ataque', ((t) => t ? Math.round(t[2] / (t[0] + t[1] + t[2] || 1) * 100) + '%' : '—')(st[0].terco), ((t) => t ? Math.round(t[2] / (t[0] + t[1] + t[2] || 1) * 100) + '%' : '—')(st[1].terco)),")
