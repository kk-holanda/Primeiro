// Aba Tabela: classificação das 4 divisões, resultados da última rodada e chaveamento da Copa do Brasil.
(function () {
  const K = window.K, BF = window.BF98, h = K.h, S = BF.Season, GM = BF.Game;
  const G = K.G;

  function linhasOrdenadas(g, div) {
    const nome = (id) => g.porId.get(id).nome;
    return S.ordenar(g.ligas[div].tabela).sort((a, b) => b.pts - a.pts || b.v - a.v || (b.gp - b.gc) - (a.gp - a.gc) || b.gp - a.gp || nome(a.id).localeCompare(nome(b.id), 'pt-BR'));
  }
  K.linhasOrdenadas = linhasOrdenadas;

  function classificacao(g, div, meuId) {
    const rows = linhasOrdenadas(g, div), jogou = rows.some((r) => r.j > 0);
    const sobe = div !== 'A', desce = div !== 'D';
    const tr = rows.map((r, i) => {
      const c = g.porId.get(r.id), zona = sobe && i < 4 ? 'z-sobe' : desce && i >= 16 ? 'z-desce' : '';
      const sg = r.gp - r.gc;
      return h('tr', { class: [zona, r.id === meuId ? 'meu' : '', g.humanoIds.has(r.id) ? 'humano' : ''].join(' ') },
        h('td', { class: 'z' }, i + 1), h('td', { class: 'l nm' }, K.comEscudo(c)), h('td', { class: 'ovr' }, r.pts), h('td', null, r.j), h('td', null, r.v), h('td', null, r.e), h('td', null, r.d),
        h('td', null, r.gp), h('td', null, r.gc), h('td', null, (sg > 0 ? '+' : '') + sg), h('td', null, r.j ? Math.round(r.pts / (r.j * 3) * 100) + '%' : '–'));
    });
    return h('div', { class: 'tablewrap' }, h('table', { class: 'liga', 'aria-label': 'Classificação ' + K.DIV_NOME[div] },
      h('thead', null, h('tr', null, ['#', 'Clube', 'P', 'J', 'V', 'E', 'D', 'GP', 'GC', 'SG', '%'].map((t, i) => h('th', { class: i === 1 ? 'l' : '', style: 'cursor:default' }, t)))),
      h('tbody', null, tr)));
  }

  function rodadaBox(g, div, meuId) {
    const L = g.ligas[div], feitas = L.res.length;
    const mostra = (titulo, jogos, placar) => h('div', { class: 'rodada' }, h('h3', null, titulo),
      h('ul', null, jogos.map((x) => {
        const [c, f] = x, gh = placar ? x[2] : null, ga = placar ? x[3] : null, cid = placar ? x[0] : x[0], fid = x[1];
        return h('li', { class: cid === meuId || fid === meuId ? 'meu' : '' }, h('span', { class: 'tc' }, K.comEscudo(cid)), h('b', { class: 'num pl' }, placar ? gh + ' × ' + ga : '×'), h('span', { class: 'tf' }, K.comEscudo(fid)));
      })));
    const out = [];
    if (feitas) out.push(mostra('Rodada ' + feitas + ' · resultados', L.res[feitas - 1], true));
    if (feitas < 38) out.push(mostra('Rodada ' + (feitas + 1) + ' · próxima', L.rodadas[feitas], false));
    return h('div', { class: 'rodadas' }, out);
  }

  function copaView(g, meuId) {
    const nm = (id) => g.porId.get(id).nome;
    const fases = g.copa.fases.slice().reverse();
    const blocos = fases.map((f) => h('section', { class: 'faseCopa' },
      h('h3', null, f.nome + (f.jogada ? '' : ' · em andamento')),
      h('div', { class: 'tablewrap' }, h('table', { class: 'copa' },
        h('thead', null, h('tr', null, ['Clube (1º jogo em casa)', 'Ida', 'Volta', 'Clube', 'Agregado'].map((t, i) => h('th', { class: i === 0 || i === 3 ? 'l' : '', style: 'cursor:default' }, t)))),
        h('tbody', null, f.confrontos.map((c) => {
          const v = c.vencedor, id = (x) => (x === meuId ? 'meu' : '');
          return h('tr', { class: id(c.a) || id(c.b) },
            h('td', { class: 'l nm' + (v === c.a ? ' venc' : '') }, K.comEscudo(c.a)), h('td', null, c.ida ? c.ida[0] + '×' + c.ida[1] : '–'), h('td', null, c.volta ? c.volta[1] + '×' + c.volta[0] : '–'),
            h('td', { class: 'l' + (v === c.b ? ' venc' : '') }, K.comEscudo(c.b)),
            h('td', null, c.agregado ? c.agregado[0] + '×' + c.agregado[1] + (c.penaltis ? ' (pên. ' + c.penaltis[0] + '×' + c.penaltis[1] + ')' : '') : '–'));
        }))))));
    return h('div', { class: 'copaview' },
      g.copa.campeao ? h('p', { class: 'campeao' }, 'Campeão da Copa do Brasil: ', h('b', null, nm(g.copa.campeao))) : null,
      h('p', { class: 'muted' }, 'A volta é disputada na casa do segundo clube. Empate no agregado vai para os pênaltis. Gol fora não vale dobrado.'), blocos);
  }

  K.telas.tabela = function () {
    const g = G.g, c = K.clubeHumano();
    if (!G.tabDiv) G.tabDiv = c.div;
    const abas = ['A', 'B', 'C', 'D'].map((d) => h('button', { class: 'tabbtn' + (G.tabDiv === d ? ' on' : ''), onclick: () => { G.tabDiv = d; K.render(); } }, K.DIV_NOME[d]))
      .concat(h('button', { class: 'tabbtn' + (G.tabDiv === 'copa' ? ' on' : ''), onclick: () => { G.tabDiv = 'copa'; K.render(); } }, 'Copa do Brasil'));
    const corpo = G.tabDiv === 'copa' ? copaView(g, c.id)
      : h('div', { class: 'ligabox' }, classificacao(g, G.tabDiv, c.id),
        h('div', { class: 'ligalado' }, rodadaBox(g, G.tabDiv, c.id),
          h('p', { class: 'legend' }, G.tabDiv !== 'A' ? h('span', null, h('i', { class: 'sw sobe' }), ' acesso (4 primeiros)') : null, G.tabDiv !== 'D' ? h('span', null, h('i', { class: 'sw desce' }), ' rebaixamento (4 últimos)') : null)));
    return h('div', { class: 'tabelawrap' }, h('div', { class: 'subtabs' }, abas), corpo);
  };
})();
