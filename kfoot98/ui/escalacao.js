// Aba Escalação: formação, tática (com setas e deslocamento no campo), 11 titulares e banco. Qualquer jogador pode ser posto em qualquer posição.
(function () {
  const K = window.K, BF = window.BF98, h = K.h, S = BF.Season, PL = BF.Players, M = BF.Match;
  const G = K.G;
  // coordenadas (x, y em %) de cada slot, goleiro embaixo, ataque em cima
  const POS = {
    '4-4-2': [[50, 88], [85, 68], [62, 71], [38, 71], [15, 68], [38, 52], [62, 52], [88, 46], [12, 46], [36, 20], [64, 20]],
    '4-3-3': [[50, 88], [85, 68], [62, 71], [38, 71], [15, 68], [50, 56], [30, 43], [70, 44], [82, 22], [50, 16], [18, 22]],
    '3-5-2': [[50, 88], [28, 72], [72, 72], [50, 78], [10, 50], [36, 56], [64, 56], [50, 38], [90, 50], [36, 18], [64, 18]],
    '4-5-1': [[50, 88], [85, 68], [62, 71], [38, 71], [15, 68], [38, 56], [62, 56], [28, 42], [50, 36], [80, 42], [50, 16]],
  };
  const TATICAS = [['ofensivo', 'Ofensivo'], ['equilibrado', 'Equilibrado'], ['defensivo', 'Defensivo'], ['contra', 'Contra-ataque']];
  K.TATICAS = TATICAS;
  const DESC_TATICA = K.DESC_TATICA = {
    ofensivo: 'Linhas adiantadas: mais lances de ataque, mais cansaço e mais faltas, defesa exposta. Forte contra Defensivo, fraco contra Contra-ataque.',
    equilibrado: 'Equilíbrio entre defesa e ataque. Sem pontos fortes nem fracos contra nenhuma tática.',
    defensivo: 'Linhas recuadas: poucos lances dos dois lados e o adversário finaliza menos. Forte contra Contra-ataque, fraco contra Ofensivo.',
    contra: 'Defesa recuada e atacantes avançados esperando o espaço: poucos lances, mas perigosos contra quem se expõe. Forte contra Ofensivo, fraco contra Defensivo.',
  };
  // deslocamento vertical (em % do campo) de cada setor por tática: negativo = avança, positivo = recua
  const DESL = { ofensivo: { D: -4, M: -7, A: -5 }, equilibrado: { D: 0, M: 0, A: 0 }, defensivo: { D: 4, M: 7, A: 9 }, contra: { D: 5, M: 4, A: -3 } };
  const NOME_POS = { GOL: 'Goleiro', ZAG: 'Zagueiro', LIB: 'Líbero', LD: 'Lateral direito', LE: 'Lateral esquerdo', VOL: 'Volante', MC: 'Meia central', MEI: 'Meia ofensivo', ALA: 'Ala', PD: 'Ponta direita', PE: 'Ponta esquerda', CA: 'Centroavante', SA: 'Segundo atacante' };

  function cfgDe(c) {
    let cfg = G.g.taticas.get(c.id);
    if (!cfg) { const e = S.escalarAuto(c, '4-4-2', 'equilibrado', G.config.maxSubs); cfg = { formacao: '4-4-2', tatica: 'equilibrado', titulares: e.titulares }; G.g.taticas.set(c.id, cfg); }
    return cfg;
  }
  K.cfgEscalacao = cfgDe;

  K.telas.escalacao = function () {
    const c = K.clubeHumano(), cfg = cfgDe(c), msg = G.escMsg || ''; G.escMsg = '';
    const esc = S.escalarAuto(c, cfg.formacao, cfg.tatica, G.config.maxSubs, cfg.titulares);
    cfg.titulares = esc.titulares;                       // preenche vagas inválidas (lesão, suspensão, treino)
    const slots = M.FORMACOES[cfg.formacao], coords = POS[cfg.formacao];
    const porId = new Map(c.elenco.map((p) => [p.id, p]));
    const sel = G.escSlot != null ? G.escSlot : null;
    const noBanco = new Set(esc.banco), slotDe = new Map(cfg.titulares.map((id, i) => [id, i]));
    const salvar = () => { G.g.taticas.set(c.id, cfg); K.render(); };

    const colocar = (p) => {
      if (!S.disponivel(p)) { G.escMsg = p.nome + (p.lesao ? ' está lesionado.' : p.treino ? ' está em treino.' : ' está suspenso.'); K.render(); return; }
      if (sel == null) {
        if (slotDe.has(p.id)) { G.escSlot = slotDe.get(p.id); K.render(); } else { G.escMsg = 'Escolha antes uma posição no campo para colocar ' + p.nome + '.'; K.render(); }
        return;
      }
      const j = slotDe.get(p.id), t = cfg.titulares.slice();
      if (j != null) [t[sel], t[j]] = [t[j], t[sel]]; else t[sel] = p.id;
      cfg.titulares = t; G.escSlot = null; salvar();
    };

    // campo: cada jogador num cartão com posição em que joga, nome completo, média NESSA posição e barras de stamina (E) e moral (M)
    const dl = DESL[cfg.tatica] || DESL.equilibrado;
    const campo = h('div', { class: 'campo', role: 'group', 'aria-label': 'Campo' },
      h('div', { class: 'linhas', 'aria-hidden': 'true', html: '<svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%"><g fill="none" stroke="currentColor" stroke-width=".5" vector-effect="non-scaling-stroke"><rect x="2" y="2" width="96" height="96"/><line x1="2" y1="50" x2="98" y2="50"/><ellipse cx="50" cy="50" rx="9" ry="7"/><rect x="26" y="2" width="48" height="16"/><rect x="26" y="82" width="48" height="16"/><rect x="38" y="2" width="24" height="6"/><rect x="38" y="92" width="24" height="6"/></g></svg>' }),
      h('span', { class: 'sentido', 'aria-hidden': 'true' }, 'sentido do ataque ▲'),
      slots.map((slot, i) => {
        const p = porId.get(cfg.titulares[i]), v = PL.ovrNoSlot(p, slot), fora = PL.afinidade(p.pos, slot) < 0.9;
        const off = slot === 'GOL' ? 0 : dl[PL.GRUPO[slot]], top = Math.max(8, Math.min(92, coords[i][1] + off));
        return h('div', { class: 'cartao-jog', style: 'left:' + coords[i][0] + '%;top:' + top + '%' },
          off ? h('span', { class: 'seta ' + (off < 0 ? 'up' : 'down'), 'aria-hidden': 'true', title: off < 0 ? 'Avança nesta tática' : 'Recua nesta tática' }, off < 0 ? '▲' : '▼') : null,
          h('button', { class: 'chip' + (sel === i ? ' sel' : '') + (fora ? ' fora' : ''), onclick: () => { G.escSlot = sel === i ? null : i; K.render(); }, 'aria-pressed': sel === i ? 'true' : 'false', 'aria-label': NOME_POS[slot] + ': ' + p.nome + ', média ' + Math.round(v) + ' nesta posição' },
            h('span', { class: 'cs' }, h('b', null, slot), h('i', null, '#' + p.num)),
            h('span', { class: 'cnome' }, p.nome, p.estrela ? K.estrela() : null),
            h('span', { class: 'cmed', 'data-tip': 'Média do jogador na posição em que está jogando' + (fora ? ' (a posição natural dele é ' + p.pos + ', por isso rende menos aqui)' : '') + '.' }, h('small', null, 'Média aqui'), h('b', { class: 'num' }, Math.round(v))),
            fora ? h('span', { class: 'cnat' }, 'natural: ' + p.pos) : null,
            h('span', { class: 'cbar' }, h('small', null, 'E'), K.barra(p.stamina, 'mini')),
            h('span', { class: 'cbar' }, h('small', null, 'M'), K.barra(p.moral, 'mini'))));
      }));

    // lista do elenco
    const lista = c.elenco.slice().sort((a, b) => K.ORDEM_POS.indexOf(a.pos) - K.ORDEM_POS.indexOf(b.pos) || PL.overall(b) - PL.overall(a));
    const slotSel = sel != null ? slots[sel] : null;
    const linhas = lista.map((p) => {
      const st = slotDe.has(p.id) ? 'Titular' : noBanco.has(p.id) ? 'Banco' : '';
      const v = slotSel ? PL.ovrNoSlot(p, slotSel) : PL.overall(p);
      const sit = p.lesao ? 'LES ' + p.lesao : p.suspenso ? 'SUSP' : p.treino ? 'TREINO' : '';
      return h('tr', { 'data-id': p.id, tabindex: 0, class: (slotDe.has(p.id) ? 'tit-row ' : '') + (!S.disponivel(p) ? 'indisp' : ''), onclick: () => colocar(p), onkeydown: (e) => { if (e.key === 'Enter') colocar(p); } },
        h('td', null, p.num), h('td', { class: 'l nm' }, p.nome, p.estrela ? K.estrela() : null), h('td', { class: 'pos' }, p.pos), h('td', { class: 'ovr' }, Math.round(v)),
        h('td', null, K.barra(p.stamina)), h('td', null, K.barra(p.moral)), h('td', { class: p.lesao ? 'bad' : p.suspenso ? 'warn' : '' }, sit || st));
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
      h('p', { class: 'tacdesc' }, h('b', null, TATICAS.find((x) => x[0] === cfg.tatica)[1] + ': '), DESC_TATICA[cfg.tatica]),
      h('p', { class: 'escmsg', role: 'status' }, msg || (sel != null ? 'Posição ' + slotSel + ' escolhida. Clique em um jogador da lista para colocá-lo.' : 'Clique em uma posição no campo e depois em um jogador da lista. Qualquer jogador pode jogar em qualquer posição, mas rende menos fora da sua.')),
      h('div', { class: 'escgrid' },
        h('div', { class: 'campocol' }, campo,
          h('p', { class: 'footnote' }, 'Média do time nesta escalação: ', h('b', null, media.toFixed(1)), fora ? ' · ' + fora + ' jogador(es) fora de posição' : ''),
          h('p', { class: 'footnote legenda' }, h('b', null, 'Como ler: '), 'a faixa de cima é a posição em que o jogador joga e o número da camisa. "Média aqui" é a nota dele nessa posição (cai se jogar fora da natural). E = stamina e M = moral. ▲ ▼ mostram se a tática avança ou recua o jogador.')),
        h('div', { class: 'tablewrap lista' }, h('table', { 'aria-label': 'Elenco' },
          h('thead', null, h('tr', null, [['Nº'], ['Jogador'], ['Pos'], [sel != null ? 'Méd ' + slotSel : 'Méd', K.TIPS.media], ['Stamina', K.TIPS.stamina], ['Moral', K.TIPS.moral], ['Sit.', K.TIPS.sit]].map(([t, tip], i) => h('th', { class: i === 1 ? 'l' : '', style: 'cursor:default', 'data-tip': tip || false }, t)))),
          h('tbody', null, linhas)))));
  };
})();
