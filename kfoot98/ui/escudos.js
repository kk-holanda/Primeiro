// Emblemas dos clubes em SVG: forma + padrão + cores do clube (+ sigla nos tamanhos grandes). Escudos reais, se existirem, têm prioridade.
(function () {
  const K = window.K, BF = window.BF98;
  const FORMAS = {
    escudo: 'M12 6H88V54C88 80 68 93 50 99C32 93 12 80 12 54Z',
    redondo: 'M4 50a46 46 0 1 0 92 0a46 46 0 1 0-92 0Z',
    brasao: 'M12 16L50 4L88 16V54C88 80 68 93 50 99C32 93 12 80 12 54Z',
    hexa: 'M26 5H74L96 50L74 95H26L4 50Z',
    losango: 'M50 3L97 50L50 97L3 50Z',
    bandeira: 'M10 6H90V68L50 97L10 68Z',
    oval: 'M50 3C76 3 90 24 90 50C90 76 76 97 50 97C24 97 10 76 10 50C10 24 24 3 50 3Z',
  };
  const r = (x, y, w, h, c) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '"/>';
  const PADROES = {
    solido: (a) => r(0, 0, 100, 100, a),
    vert: (a, b) => [0, 1, 2, 3, 4].map((i) => r(i * 20, 0, 20, 100, i % 2 ? b : a)).join(''),
    horiz: (a, b) => [0, 1, 2, 3, 4].map((i) => r(0, i * 20, 100, 20, i % 2 ? b : a)).join(''),
    meio: (a, b) => r(0, 0, 50, 100, a) + r(50, 0, 50, 100, b),
    diag: (a, b) => r(0, 0, 100, 100, b) + '<polygon points="0,0 100,0 0,100" fill="' + a + '"/>',
    faixa: (a, b) => r(0, 0, 100, 100, a) + '<polygon points="-5,18 18,-5 105,82 82,105" fill="' + b + '"/>',
    quartos: (a, b) => r(0, 0, 100, 100, b) + r(0, 0, 50, 50, a) + r(50, 50, 50, 50, a),
    cruz: (a, b) => r(0, 0, 100, 100, a) + r(40, 0, 20, 100, b) + r(0, 40, 100, 20, b),
    vertT: (a, b, t) => r(0, 0, 34, 100, t[0]) + r(33, 0, 34, 100, t[1]) + r(66, 0, 34, 100, t[2]),
    horizT: (a, b, t) => r(0, 0, 100, 34, t[0]) + r(0, 33, 100, 34, t[1]) + r(0, 66, 100, 34, t[2]),
  };
  let n = 0;
  K.emblemaSvg = function (id, cores, grande) {
    const e = BF.EMBLEMAS[id] || ['', 'escudo', 'meio'], [sigla, forma, padrao, tri] = e, [a, b] = cores, cp = 'cp' + (++n);
    const fundo = (PADROES[padrao] || PADROES.meio)(a, b, tri);
    const placa = grande && sigla ? '<rect x="22" y="41" width="56" height="24" rx="4" fill="#fff" fill-opacity=".93" stroke="#111" stroke-width="2.5"/><text x="50" y="59.5" text-anchor="middle" font-family="Barlow Semi Condensed,Arial Narrow,sans-serif" font-weight="800" font-size="19" fill="#111">' + sigla + '</text>' : '';
    return '<svg viewBox="0 0 100 104" aria-hidden="true"><defs><clipPath id="' + cp + '"><path d="' + FORMAS[forma] + '"/></clipPath></defs><g clip-path="url(#' + cp + ')">' + fundo + '</g><path d="' + FORMAS[forma] + '" fill="none" stroke="#111" stroke-width="5" stroke-linejoin="round"/><path d="' + FORMAS[forma] + '" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.5" transform="translate(50 50) scale(.9) translate(-50 -50)"/>' + placa + '</svg>';
  };
  // aceita o clube ou o id; "grande" mostra a sigla
  K.escudo = (c, grande) => {
    const cl = typeof c === 'string' ? K.G.g.porId.get(c) : c, real = (window.ESCUDOS_REAIS || {})[cl.id];
    return K.h('span', { class: 'escudo' + (grande ? ' grande' : ''), 'aria-hidden': 'true', html: real ? '<img alt="" src="' + real + '">' : K.emblemaSvg(cl.id, cl.cores, grande) });
  };
  K.comEscudo = (c, texto, opts = {}) => {
    const cl = typeof c === 'string' ? K.G.g.porId.get(c) : c;
    const el = K.h('span', { class: 'cn' + (opts.link ? ' link' : '') }, K.escudo(cl), K.h('span', null, texto == null ? cl.nome : texto));
    if (opts.link) { el.setAttribute('role', 'link'); el.tabIndex = 0; el.setAttribute('data-tip', 'Ver ' + cl.nome); el.addEventListener('click', (ev) => { ev.stopPropagation(); K.verClube(cl.id); }); el.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.stopPropagation(); K.verClube(cl.id); } }); }
    return el;
  };
  // cor de destaque do clube legível sobre o fundo: usa a secundária se a principal for quase branca
  const lum = (hex) => { const n = parseInt(hex.slice(1), 16), f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(n >> 16) + 0.7152 * f((n >> 8) & 255) + 0.0722 * f(n & 255); };
  K.coresClube = (c) => { const [a, b] = c.cores, p = lum(a) > 0.75 ? b : a; return '--club1:' + p + ';--club2:' + (p === a ? b : a) + ';--club1ink:' + (lum(p) > 0.35 ? '#111' : '#fff') + ';'; };
})();
