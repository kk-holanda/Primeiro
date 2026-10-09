// Aba Escalação: formação, tática, 11 titulares no campo e banco. Qualquer jogador pode ser posto em qualquer posição.
(function () {
  const K = window.K, BF = window.BF98, h = K.h, S = BF.Season, PL = BF.Players, M = BF.Match, GM = BF.Game;
  const G = K.G;
  // coordenadas (x, y em %) de cada slot, goleiro embaixo, ataque em cima
  const POS = {
    '4-4-2': [[50, 90], [85, 70], [62, 73], [38, 73], [15, 70], [38, 52], [62, 52], [88, 46], [12, 46], [36, 20], [64, 20]],
    '4-3-3': [[50, 90], [85, 70], [62, 73], [38, 73], [15, 70], [50, 58], [30, 44], [70, 44], [82, 22], [50, 16], [18, 22]],
    '3-5-2': [[50, 90], [28, 72], [72, 72], [50, 78], [10, 50], [36, 56], [64, 56], [50, 38], [90, 50], [36, 18], [64, 18]],
    '4-5-1': [[50, 90], [85, 70], [62, 73], [38, 73], [15, 70], [38, 56], [62, 56], [28, 42], [50, 36], [80, 42], [50, 16]],
  };
  const TATICAS = [['ofensivo', 'Ofensivo'], ['equilibrado', 'Equilibrado'], ['defensivo', 'Defensivo']];
  const DESC_TATICA = { ofensivo: 'Mais ataque e mais lances, defesa mais exposta e mais cansaço.', equilibrado: 'Equilíbrio entre defesa e ataque.', defensivo: 'Defesa mais forte, menos lances de ataque e menos cansaço.' };

  function cfgDe(c) {
    let cfg = G.g.taticas.get(c.id);
    if (!cfg) { const e = S.escalarAuto(c, '4-4-2', 'equilibrado', G.config.maxSubs); cfg = { formacao: '4-4-2', tatica: 'equilibrado', titulares: e.titulares }; G.g.taticas.set(c.id, cfg); }
    return cfg;
  }
  K.cfgEscalacao = cfgDe;
  const sobrenome = (n) => n.split(' ').slice(-1)[0];

  K.telas.escalacao = function () {
    const c = K.clubeHumano(), cfg = cfgDe(c), msg = G.escMsg || ''; G.escMsg = '';
    const esc = S.escalarAuto(c, cfg.formacao, cfg.tatica, G.config.maxSubs, cfg.titulares);
    cfg.titulares = esc.titulares;                       // preenche vagas inválidas (lesão/suspensão)
    const slots = M.FORMACOES[cfg.formacao], coords = POS[cfg.formacao];
    const porId = new Map(c.elenco.map((p) => [p.id, p]));
    const sel = G.escSlot != null ? G.escSlot : null;
    const noBanco = new Set(esc.banco), slotDe = new Map(cfg.titulares.map((id, i) => [id, i]));
    const salvar = () => { G.g.taticas.set(c.id, cfg); K.render(); };

    const colocar = (p) => {
      if (!S.disponivel(p)) { G.escMsg = p.nome + (p.lesao ? ' está lesionado.' : ' está suspenso.'); K.render(); return; }
      if (sel == null) {
        if (slotDe.has(p.id)) { G.escSlot = slotDe.get(p.id); K.render(); } else { G.escMsg = 'Escolha antes uma posição no campo para colocar ' + p.nome + '.'; K.render(); }
        return;
      }
      const j = slotDe.get(p.id);
      if (j != null) { const t = cfg.titulares.slice(); [t[sel], t[j]] = [t[j], t[sel]]; cfg.titulares = t; } else { const t = cfg.titulares.slice(); t[sel] = p.id; cfg.titulares = t; }
      G.escSlot = null; salvar();
    };

    // campo
    const campo = h('div', { class: 'campo', role: 'group', 'aria-label': 'Campo' },
      h('div', { class: 'linhas', 'aria-hidden': 'true', html: '<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%"><g fill="none" stroke="currentColor" stroke-width=".5" vector-effect="non-scaling-stroke"><rect x="2" y="2" width="96" height="96"/><line x1="2" y1="50" x2="98" y2="50"/><ellipse cx="50" cy="50" rx="9" ry="7"/><rect x="26" y="2" width="48" height="16"/><rect x="26" y="82" width="48" height="16"/><rect x="38" y="2" width="24" height="6"/><rect x="38" y="92" width="24" height="6"/></g></svg>' }),
      slots.map((slot, i) => {
        const p = porId.get(cfg.titulares[i]), v = PL.ovrNoSlot(p, slot), fora = PL.afinidade(p.pos, slot) < 0.9;
        return h('button', { class: 'chip' + (sel === i ? ' sel' : '') + (fora ? ' fora' : ''), style: 'left:' + coords[i][0] + '%;top:' + coords[i][1] + '%', onclick: () => { G.escSlot = sel === i ? null : i; K.render(); }, 'aria-pressed': sel === i ? 'true' : 'false', 'aria-label': slot + ': ' + p.nome },
          h('span', { class: 'cs' }, slot, fora ? h('em', { title: 'Fora de posição (' + p.pos + ')' }, ' ' + p.pos) : null), h('b', null, sobrenome(p.nome)), h('span', { class: 'cv' }, p.num + ' · ' + Math.round(v)), K.barra(p.stamina, 'mini'));
      }));

    // lista
    const lista = c.elenco.slice().sort((a, b) => K.ORDEM_POS.indexOf(a.pos) - K.ORDEM_POS.indexOf(b.pos) || PL.overall(b) - PL.overall(a));
    const slotSel = sel != null ? slots[sel] : null;
    const linhas = lista.map((p) => {
      const st = slotDe.has(p.id) ? 'Titular' : noBanco.has(p.id) ? 'Banco' : '';
      const v = slotSel ? PL.ovrNoSlot(p, slotSel) : PL.overall(p);
      return h('tr', { 'data-id': p.id, tabindex: 0, class: (slotDe.has(p.id) ? 'tit-row ' : '') + (!S.disponivel(p) ? 'indisp' : ''), onclick: () => colocar(p), onkeydown: (e) => { if (e.key === 'Enter') colocar(p); } },
        h('td', null, p.num), h('td', { class: 'l nm' }, p.nome), h('td', { class: 'pos' }, p.pos), h('td', { class: 'ovr' }, Math.round(v)),
        h('td', null, K.barra(p.stamina)), h('td', null, K.barra(p.moral)),
        h('td', { class: p.lesao ? 'bad' : p.suspenso ? 'warn' : '' }, K.situacao(p) || st));
    });
    const media = cfg.titulares.map((id, i) => PL.ovrNoSlot(porId.get(id), slots[i])).reduce((a, b) => a + b, 0) / 11;
    const fora = cfg.titulares.filter((id, i) => PL.afinidade(porId.get(id).pos, slots[i]) < 0.9).length;

    const segF = h('div', { class: 'seg', role: 'group', 'aria-label': 'Formação' }, Object.keys(M.FORMACOES).map((f) => h('button', { type: 'button', 'aria-pressed': cfg.formacao === f ? 'true' : 'false', onclick: () => { cfg.formacao = f; cfg.titulares = []; G.escSlot = null; salvar(); } }, f)));
    const segT = h('div', { class: 'seg', role: 'group', 'aria-label': 'Tática' }, TATICAS.map(([k, t]) => h('button', { type: 'button', 'aria-pressed': cfg.tatica === k ? 'true' : 'false', 'data-tip': DESC_TATICA[k], onclick: () => { cfg.tatica = k; salvar(); } }, t)));
    return h('div', { class: 'escwrap' },
      h('div', { class: 'esccontrols' },
        h('div', null, h('small', { class: 'eyebrow' }, 'Formação'), segF), h('div', null, h('small', { class: 'eyebrow' }, 'Tática'), segT),
        h('div', null, h('small', { class: 'eyebrow' }, 'Substituições'), h('b', null, 'até ' + G.config.maxSubs + ' por jogo')),
        h('button', { class: 'btn alt sm', onclick: () => { cfg.titulares = []; G.escSlot = null; salvar(); } }, 'Escalação automática')),
      h('p', { class: 'escmsg', role: 'status' }, msg || (sel != null ? 'Posição ' + slotSel + ' escolhida. Clique em um jogador da lista para colocá-lo.' : 'Clique em uma posição no campo e depois em um jogador da lista. Qualquer jogador pode jogar em qualquer posição, mas rende menos fora da sua.')),
      h('div', { class: 'escgrid' },
        h('div', { class: 'campocol' }, campo, h('p', { class: 'footnote' }, 'Média do time nesta escalação: ', h('b', null, media.toFixed(1)), fora ? ' · ' + fora + ' jogador(es) fora de posição' : '')),
        h('div', { class: 'tablewrap lista' }, h('table', { 'aria-label': 'Elenco' },
          h('thead', null, h('tr', null, [['Nº'], ['Jogador'], ['Pos'], [sel != null ? 'Méd ' + slotSel : 'Méd', K.TIPS.media], ['Stamina', K.TIPS.stamina], ['Moral', K.TIPS.moral], ['Sit.', K.TIPS.sit]].map(([t, tip], i) => h('th', { class: i === 1 ? 'l' : '', style: 'cursor:default', 'data-tip': tip || false }, t)))),
          h('tbody', null, linhas)))));
  };
})();
