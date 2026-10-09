// Gráfico da moral do técnico nos últimos 5 jogos (linha fina, marcadores com anel, grade discreta, dica ao passar o mouse).
(function () {
  const K = window.K, h = K.h, G = K.G, PR = window.BF98.Progression;
  const cor = (v) => 'var(--st-' + { verde: 'verde', 'verde-claro': 'vclaro', amarelo: 'amarelo', laranja: 'laranja', vermelho: 'vermelho' }[PR.cor(v)] + ')';
  const W = 330, H = 150, L = 30, R = 16, T = 14, B = 40;

  K.moralTreinadorBox = function (clubId) {
    const g = G.g, c = clubId ? g.porId.get(clubId) : K.clubeHumano(), mt = g.moralTreinador[c.id];
    const jogos = mt.hist.slice(1).slice(-5), pts = jogos.length ? jogos : mt.hist.slice(0, 1);
    const n = pts.length, x = (i) => (n === 1 ? (L + W - R) / 2 : L + (i * (W - L - R)) / (n - 1)), y = (v) => T + (1 - v / 100) * (H - T - B);
    const grade = [0, 50, 100].map((v) => '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="g"/><text x="' + (L - 6) + '" y="' + (y(v) + 4) + '" text-anchor="end" class="t">' + v + '</text>').join('');
    const linha = n > 1 ? '<polyline points="' + pts.map((p, i) => x(i) + ',' + y(p.v)).join(' ') + '" class="ln"/>' : '';
    const marcas = pts.map((p, i) => {
      const adv = p.adv ? g.porId.get(p.adv).nome : null, dica = p.res ? (p.res === 'V' ? 'Vitória' : p.res === 'D' ? 'Derrota' : 'Empate') + ' contra ' + adv + ' (' + p.gp + ' × ' + p.gc + ') · moral ' + p.v : 'Moral inicial: ' + p.v;
      const rot = p.res ? '<text x="' + x(i) + '" y="' + (H - 20) + '" text-anchor="middle" class="r r' + p.res + '">' + p.res + '</text><text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle" class="t">' + p.gp + '×' + p.gc + '</text>' : '';
      return '<circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="5" style="fill:' + cor(p.v) + '" class="pt"/>' + rot + '<circle cx="' + x(i) + '" cy="' + y(p.v) + '" r="15" class="hit" data-tip="' + dica.replace(/"/g, '&quot;') + '" tabindex="0"/>' + '<text x="' + x(i) + '" y="' + (y(p.v) - 10) + '" text-anchor="middle" class="v">' + p.v + '</text>';
    }).join('');
    const ult = mt.hist[mt.hist.length - 1], pen = mt.hist.length > 1 ? mt.hist[mt.hist.length - 2] : null;
    const delta = pen ? ult.v - pen.v : 0;
    const tabela = h('table', { class: 'sr' }, h('caption', null, 'Moral do técnico nos últimos jogos'), h('tbody', null, pts.map((p) => h('tr', null, h('td', null, p.res ? p.res + ' ' + p.gp + ' × ' + p.gc : 'Início'), h('td', null, p.v)))));
    return h('section', { class: 'moraltec', 'aria-label': 'Moral do técnico' },
      h('div', { class: 'mt-top' }, h('div', null, h('h3', null, 'Moral do técnico'), h('small', { class: 'muted' }, c.tecnico)), h('div', { class: 'mt-val' }, h('b', { class: 'num' }, mt.v), delta ? h('small', { class: delta > 0 ? 'hi' : 'bad' }, (delta > 0 ? '▲ +' : '▼ −') + Math.abs(delta) + ' no último jogo') : h('small', { class: 'muted' }, jogos.length ? 'estável' : 'sem jogos ainda'))),
      h('div', { class: 'mt-chart', html: '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Gráfico da moral do técnico nos últimos 5 jogos">' + grade + linha + marcas + '</svg>' }),
      tabela,
      h('p', { class: 'muted mt-nota' }, 'Vitórias (principalmente contra times maiores) sobem a moral; derrotas descem. A moral do técnico influencia o clima do vestiário.'));
  };
})();
