# ---- Melhorias #33 (v37): treino, moral, evolução dos jogadores, traits, subida/descida, acréscimos, ranking de técnicos, telas ----

# ===== 1. Treino: botão bloqueado com o motivo, menos perda de moral, descanso de 3 jogos =====
rep("const TREINO_CFG = { moralJogo: [3, 5], staminaJogo: [10, 14], cooldown: 4,", "const TREINO_CFG = { moralJogo: [1.5, 3], staminaJogo: [10, 14], cooldown: 3,")
rep("        btn('b-treinar', 'Treinar', () => K.dialogos.treinar(c, p), false, 'Tira o jogador de 1 a 3 jogos para evoluir um atributo.')));",
"""        (() => {
          const T = MK.TREINO_CFG, emTreino = c.elenco.filter((x) => x.treino).length;
          const mot = p.treino ? 'Já está em treino (faltam ' + p.treino.restante + ' jogo(s)).' : p.lesao > 0 ? 'Lesionado não pode treinar.' : p.treinoCd > 0 ? 'Descansando do último treino: mais ' + p.treinoCd + ' jogo(s) para poder treinar de novo.'
            : emTreino >= T.maxSimultaneo ? 'O limite de ' + T.maxSimultaneo + ' jogadores treinando ao mesmo tempo já foi atingido.' : Object.values(MK.TREINOS).every((t) => MK.seguidas(p, t.attr) >= T.maxSeguidas) ? 'Já treinou todas as valências ' + T.maxSeguidas + ' vezes seguidas.' : '';
          return h('span', { class: 'dis-wrap', 'data-tip': mot || false }, btn('b-treinar', 'Treinar', () => K.dialogos.treinar(c, p), !!mot, mot ? false : 'Tira o jogador de 1 a 3 jogos para evoluir um atributo.'));
        })()));""")

# ===== 2. Moral mais suave =====
rep("const sub = j.entrou > 0, dm = sub ? (delta < 0 ? delta * 2.5 : delta * 5) + 3 : delta * 5;\n    p.moral = clamp(p.moral + dm + (p.baseAno ? 3 : 0), sub ? Math.min(p.moral, 40) : 0, 100);",
    "const sub = j.entrou > 0, dm0 = sub ? (delta < 0 ? delta * 1.5 : delta * 3) + 2 : delta * 3, dm = clamp(dm0, -8, 8);\n    p.moral = clamp(p.moral + dm + (p.baseAno ? 3 : 0), sub ? Math.min(p.moral, 40) : 0, 100);")
rep("function semJogar(p) { p.moral = clamp(p.moral + (50 - p.moral) * 0.04 - 1, Math.min(p.moral, 40), 100); }",
    "function semJogar(p, s = 0) { p.moral = clamp(p.moral + (50 + 14 * s - p.moral) * 0.05 - 0.8 * (1 - s), Math.min(p.moral, 40), 100); }   // s: apoio do técnico (moral alta e time bem colocado, 0 a 1)")
rep("const delta = res === 'V' ? 8 + clamp(dif / 8, -4, 6) + Math.min(3, gp - gc - 1) : res === 'D' ? -8 + clamp(dif / 10, -3, 3) : clamp(dif / 10, -3, 3);",
    "const delta = res === 'V' ? 5 + clamp(dif / 10, -3, 4) + Math.min(2, gp - gc - 1) : res === 'D' ? -5 + clamp(dif / 12, -2, 2) : clamp(dif / 12, -2, 2);")
rep("    if (g.humanoIds.has(clubId)) g.porId.get(clubId).elenco.forEach((p) => { p.moral = clamp(p.moral + (mt.v - 50) * 0.02, 0, 100); }); // clima do vestiário",
    "    g.porId.get(clubId).elenco.forEach((p) => { const k = (mt.v - 50) * 0.02; p.moral = clamp(p.moral + (k > 0 ? k * (100 - p.moral) / 50 : k * p.moral / 50), 0, 100); }); // clima do vestiário: a moral do técnico contagia o grupo (menos perto dos extremos)")

# ===== 3. Evolução dos jogadores (individual + coletivo) =====
region("  function aplicarPosJogo(j, ctx) {", "  // Moral dos reservas que não jogam desce devagar", """  const REF_DIV = { A: 74, B: 65, C: 58, D: 50 };   // média dos melhores jogadores de cada série
  function darXp(p, a, v, mud) {
    p.xp[a] += v;
    while (p.xp[a] >= 1 && p.attr[a] < 99) { p.xp[a] -= 1; p.attr[a]++; mud.push(a + '+1'); }
    while (p.xp[a] <= -1 && p.attr[a] > 1) { p.xp[a] += 1; p.attr[a]--; mud.push(a + '-1'); }
  }
  // Evolução pelo jogo: a nota é o desempenho individual; o ganho cresce contra adversário mais forte, com o técnico e o time bem, e encolhe para quem já está acima do nível da série
  function aplicarPosJogo(j, ctx) {
    const p = j.p, mudancas = []; ctx = ctx || {};
    if (j.minutos === 0) return mudancas;
    const delta = j.nota - 6.3;
    const moralMult = 0.6 + p.moral / 100 * 0.9;
    const peso = Math.min(1, j.minutos / 60);
    const dif = P().overall(p) - (REF_DIV[ctx.div] || 60);                                   // quanto o jogador está acima da série onde joga
    const nivel = clamp(1 - dif / 22, 0.2, 1.7);
    const adv = ctx.advForca != null ? clamp(1 + (ctx.advForca - ctx.proprForca) / 30, 0.6, 1.5) : 1;   // pesa a força do adversário
    const col = 1 + 0.2 * clamp(((ctx.moralTec == null ? 55 : ctx.moralTec) - 50) / 50, -1, 1) + (ctx.topo && ctx.topo() ? 0.15 : 0) + (ctx.venceu ? 0.1 : 0);
    const prod = p.trait === 'prodigio' ? 1.5 * (ctx.venceu ? 1.3 : 1) * (ctx.topo && ctx.topo() ? 1.1 : 1) : 1;
    const base = (delta > 0 ? delta * ganhoIdade(p.idade) * moralMult * nivel * adv * col * prod : delta * 0.6 * clamp(1 + dif / 40, 0.6, 1.5) / adv) * peso * 0.15 * (delta > 0 && p.base ? 1.6 : 1);
    const foco = focoDoJogo(j, ctx), desgaste = dif > 8 ? (dif - 8) * 0.0025 * peso : 0;    // craque em série fraca perde um pouco do nível
    for (const a of P().ATTRS) {
      const rd = base > 0 ? clamp((99 - p.attr[a]) / 50, 0.15, 1.2) : 1;   // retorno decrescente: subir de 80 para 85 é bem mais difícil que de 50 para 55
      darXp(p, a, base * (0.5 + foco[a] * 2) * rd - desgaste, mudancas);
    }
    const sub = j.entrou > 0, dm0 = sub ? (delta < 0 ? delta * 1.5 : delta * 3) + 2 : delta * 3, dm = clamp(dm0, -8, 8);
    p.moral = clamp(p.moral + dm + (p.baseAno ? 3 : 0), sub ? Math.min(p.moral, 40) : 0, 100);
    p.jogos++;
    return mudancas;
  }
  // Convívio com o grupo: quem está abaixo da média do time (principalmente garoto e jogador de base) evolui só de estar no elenco, a cada jogo do clube
  function convivio(p, ref) {
    const gap = ref - P().overall(p); if (gap <= 0) return;
    const f = (p.idade <= 19 ? 1 : p.idade <= 22 ? 0.7 : p.idade <= 25 ? 0.35 : 0) * (p.base ? 1.4 : 1); if (!f) return;
    const mud = []; for (const a of P().ATTRS) darXp(p, a, 0.004 * gap * f * clamp((99 - p.attr[a]) / 50, 0.2, 1.2), mud);
  }
  // Subida ou descida de divisão: v pontos em todos os atributos (arredondamento sorteado)
  function saltoDivisao(p, v, rng) {
    const q = Math.floor(Math.abs(v)), fr = Math.abs(v) - q, sg = v < 0 ? -1 : 1;
    for (const a of P().ATTRS) p.attr[a] = clamp(p.attr[a] + sg * (q + (rng.chance(fr) ? 1 : 0)), 1, 99);
  }
""", True)
rep("  function focoDoJogo(j) {", "  function focoDoJogo(j, ctx) {\n    ctx = ctx || {};")
rep("    f.DEF += 0.08 * j.desarmes + 0.1 * j.defesas;", "    f.DEF += 0.08 * j.desarmes + 0.1 * j.defesas + 0.4 * (j.penDef || 0);   // pênalti defendido pesa mais\n    if (ctx.press > 0.4) { f.RIT += 0.12 * ctx.press; f.FIS += 0.1 * ctx.press; if (j.slot && 'CA SA PD PE MEI'.includes(j.slot)) f.DEF += 0.12 * ctx.press; }   // marcação forte e pressão na saída de bola: corre, briga e rouba")
rep("bf.Progression = { aplicarPosJogo, semJogar,", "bf.Progression = { convivio, saltoDivisao, aplicarPosJogo, semJogar,")
rep("if (r.desfecho === 'defendeu' && gkj) gkj.defesas++;", "if (r.desfecho === 'defendeu' && gkj) { gkj.defesas++; gkj.penDef = (gkj.penDef || 0) + 1; }")
# jogo -> evolução: contexto da partida
rep("        const noJogo = new Set(side.todos.keys());",
"""        const noJogo = new Set(side.todos.keys());
        const mtv = (g.moralTreinador[clube.id] || { v: 55 }).v, ordT = jogo.comp === 'liga' ? S().ordenar(g.ligas[jogo.div].tabela) : null, posT = ordT ? ordT.findIndex((r) => r.id === clube.id) : -1;
        const sup = Math.max(0, Math.min(1, (mtv - 50) / 50 * 0.6 + (posT >= 0 && posT < 4 ? 0.4 : posT >= 0 && posT < 10 ? 0.2 : 0)));
        const fl = (s2) => { const l = [...s2.todos.values()].sort((a, b) => b.minutos - a.minutos).slice(0, 11); return l.reduce((a, x) => a + PL().overall(x.p), 0) / Math.max(1, l.length); };
        const ctxJ = { div: clube.div, venceu: i === 0 ? gh > ga : ga > gh, topo: () => posT >= 0 && posT < 8, moralTec: mtv, proprForca: fl(side), advForca: fl(m.S[1 - i]), press: ((bf.Match.ESTILOS[bf.Match.idEstilo(side.time.tatica)] || {}).props || {}).press || 0 };""")
rep("if (p.suspenso > 0) p.suspenso--; PR().semJogar(p); }", "if (p.suspenso > 0) p.suspenso--; PR().semJogar(p, sup); }")
rep("mud = PR().aplicarPosJogo(j, { venceu: i === 0 ? gh > ga : ga > gh, topo: () => { if (jogo.comp !== 'liga') return false; const ord = S().ordenar(g.ligas[jogo.div].tabela); return ord.findIndex((r) => r.id === clube.id) < 10; } });", "mud = PR().aplicarPosJogo(j, ctxJ);")
rep("      const c = g.porId.get(id);\n      c.elenco.forEach((p) => {\n        if (p.treinoCd > 0) p.treinoCd--;",
    "      const c = g.porId.get(id), refT = c.elenco.map((q) => PL().overall(q)).sort((a, b) => b - a).slice(0, 11).reduce((a, x, _, l) => a + x / l.length, 0);\n      c.elenco.forEach((p) => {\n        PR().convivio(p, refT);\n        if (p.treinoCd > 0) p.treinoCd--;")

# ===== 4. Subida e descida de divisão: todos os atributos sobem ou descem, mais para quem sobe em 1º ou cai em último =====
rep("    snapshotTemporada(g);\n    g.clubes.forEach((c) => c.elenco.forEach((p) => {",
"""    const salto = {};
    Object.values(mov.subiram).forEach((l) => l.forEach((id, i) => { salto[id] = [2.0, 1.7, 1.4, 1.1][i] || 1.1; }));
    Object.values(mov.desceram).forEach((l) => l.forEach((id, i) => { salto[id] = -[1.1, 1.4, 1.7, 2.0][i] || -1.1; }));
    Object.keys(salto).forEach((id) => { if (g.humanoIds.has(id)) { const c = g.porId.get(id); bf.Mercado.noticia(g, 'O ' + c.nome + (salto[id] > 0 ? ' subiu de divisão e o elenco ganhou confiança: todos os atributos sobem cerca de ' : ' caiu de divisão e o elenco perdeu o rendimento: todos os atributos caem cerca de ') + Math.abs(salto[id]).toFixed(1).replace('.', ',') + ' ponto(s).', 'info'); } });
    snapshotTemporada(g);
    g.clubes.forEach((c) => c.elenco.forEach((p) => {""")
rep("      PR().virarAno(p, g.rng);\n", "      PR().virarAno(p, g.rng); if (salto[c.id]) PR().saltoDivisao(p, salto[c.id], g.rng);\n")

# ===== 5. Acréscimos: faltas, pênaltis e substituições fora do intervalo =====
rep("const ACR_BASE = [0.6, 1.4];", "const ACR_BASE = [0.4, 1.0];")
rep("    for (const e of m.eventos) if (e.min > desde && e.min <= ate) x += e.tipo === 'gol' ? 0.55 : e.tipo === 'lesao' ? 1 : e.tipo === 'amarelo' || e.tipo === 'vermelho' ? 0.35 : e.tipo === 'penalti' ? 0.4 : e.tipo === 'substituicao' ? 0.2 : 0;",
    "    for (const e of m.eventos) if (e.min > desde && e.min <= ate) x += e.tipo === 'gol' ? 0.5 : e.tipo === 'lesao' ? 1 : e.tipo === 'amarelo' || e.tipo === 'vermelho' ? 0.3 : e.tipo === 'penalti' ? 0.9 : e.tipo === 'substituicao' ? (e.min < 45 || e.min > m.meio + 1 ? 0.3 : 0) : 0;\n    const ft = m.stats[0].faltas + m.stats[1].faltas; x += 0.07 * (ft - (m.faltasAnt || 0)); m.faltasAnt = ft;   // cada jogo tem o seu acréscimo: faltas, pênaltis e trocas fora do intervalo alongam")

# ===== 6. Traits =====
rep("desc: 'Maior chance de fazer gol quando entra depois dos 30 do segundo tempo com o time perdendo ou empatando.',", "desc: 'Maior chance de fazer gol quando entra depois dos 30 do segundo tempo com o time perdendo ou empatando, e mais 10% de chance de gol nos acréscimos. O computador o deixa no banco e o coloca em campo depois dos 70 minutos.',")
rep("    if (atk.p.trait === 'salvador' && atk.entrou >= m.meio + 30 && A.gols <= D.gols) pg *= 1.3;",
    "    if (atk.p.trait === 'salvador' && atk.entrou >= m.meio + 30 && A.gols <= D.gols) pg *= 1.3;\n    if (atk.p.trait === 'salvador' && ((m.acr[0] != null && m.min > 45 && m.min <= m.meio) || (m.acr[1] != null && m.min >= 90 + (m.acr[0] || 0)))) pg *= 1.1;   // acréscimos")
rep("  function iaSubstituicoes(m, s) {\n    if (s.subs >= s.maxSubs) return;",
"""  function iaSubstituicoes(m, s) {
    if (s.subs >= s.maxSubs) return;
    const sv = s.banco.find((p) => p.trait === 'salvador' && p.lesao === 0 && p.pos !== 'GOL'), opp = m.S[1 - m.S.indexOf(s)];
    if (sv && m.min >= m.meio + 24 && s.gols <= opp.gols + 1) {   // salvador da pátria: entra depois dos 70 minutos
      const out = s.campo.filter((j) => j.slot !== 'GOL').map((j) => ({ j, v: P().ovrNoSlot(sv, j.slot) - P().ovrNoSlot(j.p, j.slot) + (100 - j.p.stamina) * 0.15 })).sort((a, b) => b.v - a.v)[0];
      if (out) { substituirM(m, m.S.indexOf(s), out.j.p.id, sv.id, 'tática'); return; }
    }""")
rep("    const nota = (p, slot) => PL.ovrNoSlot(p, slot) - Math.max(0, 100 - p.stamina) * 0.02 + (clube.tecPerfil === 'futebolarte' && p.trait === 'maestro' ? 4 : 0);",
    "    const nota = (p, slot) => PL.ovrNoSlot(p, slot) - Math.max(0, 100 - p.stamina) * 0.02 + (clube.tecPerfil === 'futebolarte' && p.trait === 'maestro' ? 4 : 0) - (clube.tecPerfil && p.trait === 'salvador' ? 30 : 0);   // computador guarda o salvador da pátria no banco")
rep("const resto = clube.elenco.filter((p) => !usados.has(p.id) && disponivel(p)).sort((a, b) => PL.overall(b) - PL.overall(a));", "const resto = clube.elenco.filter((p) => !usados.has(p.id) && disponivel(p)).sort((a, b) => PL.overall(b) - PL.overall(a) + (clube.tecPerfil ? ((b.trait === 'salvador') - (a.trait === 'salvador')) * 100 : 0));")
rep("desc: 'Jogador da categoria de base: 20% de bônus nos 3 primeiros treinos. Ao concluir o 3º, deixa de ser promessa: ganha 3 posições de atuação (o goleiro ganha defesa) e 40% de chance de uma nova característica.',", "desc: 'Jogador da categoria de base: 20% de bônus nos 3 primeiros treinos. Ao concluir o 3º, deixa de ser promessa: ganha 3 posições de atuação (o goleiro ganha defesa), um salto nos atributos que o deixa igual ou mais forte que os titulares da posição e 40% de chance de uma nova característica.',")
rep("    p.trait = null; p.promPend = false; p.promTr = 3;\n    let novo = null;",
"""    {   // salto da promessa: os atributos principais da posição sobem até a média alcançar a dos titulares (no máximo +15 em cada um)
      const pos = p.pos, N = { ZAG: 2, MC: 2, CA: 2 }[pos] || 1, ref = c.elenco.filter((q) => q !== p).map((q) => PL().overallEm(q, pos)).sort((a, b) => b - a)[N - 1];
      if (ref != null) {
        const antes = Math.round(PL().overallEm(p, pos)), alvo = ref + g.rng.int(0, 2), ord = PL().ATTRS.map((a, i) => [a, PL().PESOS[pos][i]]).sort((a, b) => b[1] - a[1]).map((x) => x[0]), ganho = {};
        for (let it = 0; it < 80 && PL().overallEm(p, pos) < alvo; it++) { const a = ord[it % 4]; if ((ganho[a] || 0) < 15 && p.attr[a] < 99) { p.attr[a]++; ganho[a] = (ganho[a] || 0) + 1; } }
        const depois = Math.round(PL().overallEm(p, pos));
        if (g.humanoIds.has(c.id) && depois > antes) noticia(g, p.nome + ' deu um salto de qualidade depois do 3º treino: a média na posição foi de ' + antes + ' para ' + depois + '.', 'info');
      }
    }
    p.trait = null; p.promPend = false; p.promTr = 3;
    let novo = null;""")

# ===== 7. Nome do estilo =====
rep("posicao: mkE('Jogo de Posição / Tiki-Taka', 'Posição',", "posicao: mkE('Jogo de Posição / Tiki-Taka', 'Jogo de posição',")

# ===== 8. Sócios e público respondem melhor ao desempenho =====
rep("const rival = g.porId.get(adv); let d = gp > gc ? 0.0045 : gp < gc ? -0.0045 : 0;\n    if (Math.abs(gp - gc) >= 3) d *= 2;", "const rival = g.porId.get(adv); let d = gp > gc ? 0.009 : gp < gc ? -0.005 : 0;\n    if (rival && gp > gc && rival.prestigio > c.prestigio + 5) d *= 1.4;\n    if (Math.abs(gp - gc) >= 3) d *= 2;")
rep("    const m = MENSAL[c.mensal || 'prata'].mov; if (m) mudarSocios(g, c, m, 'mensalidade');\n",
"""    const m = MENSAL[c.mensal || 'prata'].mov; if (m) mudarSocios(g, c, m, 'mensalidade');
    { const lg = g.ligas[c.div], ord = bf.Season.ordenar(lg.tabela), pos = ord.findIndex((r) => r.id === c.id), n = ord.length;   // campanha na tabela e artilheiro do clube
      if (pos >= 0 && lg.res.length >= 3) mudarSocios(g, c, pos < 4 ? 0.003 : pos < 8 ? 0.0005 : pos >= n - 4 ? -0.002 : 0, 'tabela');
      const art = Object.values((g.artilharia && g.artilharia[c.div]) || {}).filter((e) => e.gols > 0).sort((a, b) => b.gols - a.gols).slice(0, 3); if (art.some((e) => e.clubId === c.id)) mudarSocios(g, c, 0.001, 'artilheiro'); }
""")

# público: a posição na tabela entra na forma recente do clube
rep("forma: formaRecente(g, C.id), rival,", "forma: Math.max(-1.2, Math.min(1.2, formaRecente(g, C.id) + (jogo.comp === 'liga' ? 0.4 * (0.5 - S().ordenar(g.ligas[jogo.div].tabela).findIndex((r) => r.id === C.id) / 19) * 2 : 0))), rival,")

# ===== 9. Ranking geral de técnicos =====
rep("  function demitir(g, hu, motivo) {\n",
"""  // ---------- ranking contínuo de técnicos (humanos e computador) ----------
  const PESO_SERIE = { A: 1, B: 0.8, C: 0.6, D: 0.45, copa: 0.8 };
  function tecDe(g, clubId) {
    const c = g.porId.get(clubId), nome = c.tecnico; g.tecStats = g.tecStats || {};
    return g.tecStats[nome] || (g.tecStats[nome] = { nome, humano: g.humanoIds.has(clubId), clube: clubId, serie: c.div, j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0, bonus: 0, acessos: 0, rebaix: 0, titulos: 0, artilheiros: 0, copa: 0, copaNome: '', demissoes: 0, temporadas: 0 });
  }
  function regTec(g, clubId, gp, gc, jogo) {
    const t = tecDe(g, clubId), c = g.porId.get(clubId); t.clube = clubId; t.serie = c.div; if (g.humanoIds.has(clubId)) t.humano = true;
    t.j++; t.gp += gp; t.gc += gc; if (gp > gc) t.v++; else if (gp === gc) t.e++; else t.d++;
    t.pts += (gp > gc ? 3 : gp === gc ? 1 : 0) * (PESO_SERIE[jogo.comp === 'liga' ? jogo.div : 'copa'] || 0.5);
  }
  function regTecFim(g, cl, mov) {
    S().ORDEM.forEach((d) => {
      if (cl[d][0]) { tecDe(g, cl[d][0]).titulos++; tecDe(g, cl[d][0]).bonus += 20 * PESO_SERIE[d]; }
      const top = Object.values((g.artilharia && g.artilharia[d]) || {}).filter((e) => e.gols > 0).sort((a, b) => b.gols - a.gols || a.jogos - b.jogos)[0];
      if (top && g.porId.get(top.clubId)) { const t = tecDe(g, top.clubId); t.artilheiros++; t.bonus += 5; }
    });
    Object.values(mov.subiram).forEach((l) => l.forEach((id) => { const t = tecDe(g, id); t.acessos++; t.bonus += 10; }));
    Object.values(mov.desceram).forEach((l) => l.forEach((id) => { const t = tecDe(g, id); t.rebaix++; t.bonus -= 5; }));
    const fases = (g.copa && g.copa.fases) || [];
    g.clubes.forEach((c) => {
      const t = tecDe(g, c.id); t.temporadas++;
      let alc = 0, nome = ''; fases.forEach((f, i) => { if (f.confrontos.some((x) => x.a === c.id || x.b === c.id)) { alc = i + 1; nome = f.nome; } });
      if (g.copa.campeao === c.id) { alc = fases.length + 1; nome = 'Campeão'; }
      if (alc > t.copa) { t.copa = alc; t.copaNome = nome; }
    });
  }
  function rankingTecnicos(g) {
    return Object.values(g.tecStats || {}).filter((t) => t.j > 0).map((t) => ({ ...t, aprov: t.j ? (3 * t.v + t.e) / (3 * t.j) : 0, sg: t.gp - t.gc, gpj: t.j ? t.gp / t.j : 0, gcj: t.j ? t.gc / t.j : 0, pontos: t.pts + t.bonus }));
  }
  function demitir(g, hu, motivo) {
    { const tt = tecDe(g, hu.clubId); tt.demissoes++; tt.bonus -= 8; }
""")
rep("bf.Game = { caixaNegativo,", "bf.Game = { regTec, rankingTecnicos, caixaNegativo,")
rep("[[jogo.casa, jogo.fora, gh, ga], [jogo.fora, jogo.casa, ga, gh]].forEach(([id, adv, gp, gc]) => { moralTreinador(g, id, adv, gp, gc);", "[[jogo.casa, jogo.fora, gh, ga], [jogo.fora, jogo.casa, ga, gh]].forEach(([id, adv, gp, gc]) => { regTec(g, id, gp, gc, jogo); moralTreinador(g, id, adv, gp, gc);")
rep("g.historico.push(reg); bf.Fin.fimTemporada(g, cl, mov);", "g.historico.push(reg); regTecFim(g, cl, mov); bf.Fin.fimTemporada(g, cl, mov);")
rep("['financas', 'Finanças'], ['relatorios', 'Relatórios de testes']];", "['financas', 'Finanças'], ['tecnicos', 'Técnicos'], ['relatorios', 'Relatórios de testes']];")
rep("G.aba === 'relatorios' ? K.telas.relatorios() : plantel(c);", "G.aba === 'relatorios' ? K.telas.relatorios() : G.aba === 'tecnicos' ? K.telas.tecnicos() : plantel(c);")
marker = "// Kfoot 98 — interface principal:"
rep(marker, rd('tecnicos.js') + ";\n" + marker)

# ===== 10. Botão da Copa quando o clube já está fora =====
rep("      : !multi ? h('button', { class: 'btn hot', id: 'jogar', onclick: jogarProximo }, 'Jogar próximo jogo')",
    "      : !multi ? h('button', { class: 'btn hot', id: 'jogar', onclick: jogarProximo }, (() => { const dia = GM.proximoDia(g), js = dia ? GM.jogosDoDia(g, dia) : []; return dia && dia.tipo === 'copa' && js.length && !js.some((x) => G.humanos.some((hu) => x.casa === hu.clubId || x.fora === hu.clubId)) ? 'Ver jogos da Copa do Brasil' : 'Jogar próximo jogo'; })())")

# ===== 11. Substituições: passar o mouse mostra os atributos =====
rep("return h('li', { class: 'sublinha' + (sel ? ' sel' : '') + (ind ? ' indisp' : ''), tabindex: ind ? -1 : 0,", "return h('li', { class: 'sublinha' + (sel ? ' sel' : '') + (ind ? ' indisp' : ''), 'data-tip': K.attrTip(p), tabindex: ind ? -1 : 0,")
rep("const linhas = side.banco.map((p) => h('tr', { class: jg.selIn === p.id ? 'sel' : '', tabindex: 0,", "const linhas = side.banco.map((p) => h('tr', { class: jg.selIn === p.id ? 'sel' : '', 'data-tip': K.attrTip(p), tabindex: 0,")
rep('</style>\n<div id="app"></div>', '.sublinha[data-tip], tr[data-tip] { text-decoration: none; }\n.dis-wrap { display: inline-flex; }\n.dis-wrap .btn:disabled { pointer-events: none; }\n.meutec td { background: color-mix(in srgb, var(--accent) 12%, transparent); }\n</style>\n<div id="app"></div>')
