// Visão de outro clube (a partir da Tabela): técnico, moral do técnico, estádio, próximo jogo, últimos 3 jogos e o plantel com os atributos de cada jogador.
(function () {
  const K = window.K, BF = window.BF98, h = K.h, GM = BF.Game, G = K.G, nf = K.nf;
  K.verClube = (id) => { G.clubeVisto = id; G.aba = 'tabela'; if (G.tela !== 5) G.tela = 5; K.render(); window.scrollTo(0, 0); };

  K.telas.clubeVisto = function () {
    const g = G.g, c = g.porId.get(G.clubeVisto), meu = c.id === K.clubeHumano().id;
    const L = g.ligas[c.div], tab = K.linhasOrdenadas(g, c.div), pos = tab.findIndex((r) => r.id === c.id) + 1, linha = tab[pos - 1];
    const pj = GM.proximoJogo(g, c.id), ult = GM.ultimosJogos(g, c.id, 3);
    const res = (r) => (r.gp > r.gc ? 'V' : r.gp < r.gc ? 'D' : 'E');
    const placar = (r) => { const a = g.porId.get(r.adv); const pl = h('b', { class: 'num' }, (r.casa ? r.gp + ' × ' + r.gc : r.gc + ' × ' + r.gp)); return r.casa ? [K.comEscudo(c), pl, K.comEscudo(a, null, { link: true })] : [K.comEscudo(a, null, { link: true }), pl, K.comEscudo(c)]; };
    const info = (rot, v) => h('div', null, h('small', null, rot), h('b', null, v));
    const fav = c.demanda;
    return h('div', { class: 'clubevisto', style: K.coresClube(c) },
      h('button', { class: 'btn alt sm', id: 'voltar-tabela', onclick: () => { G.clubeVisto = null; K.render(); } }, '← Voltar à tabela'),
      h('div', { class: 'cv-head' }, K.escudo(c, true), h('div', null, h('h2', null, c.nome), h('span', { class: 'muted' }, c.cidade + '/' + c.uf + ' · ' + K.DIV_NOME[c.div] + (linha && linha.j ? ' · ' + pos + 'º lugar (' + linha.pts + ' pts)' : ''))), meu ? h('span', { class: 'tag hot' }, 'seu clube') : null),
      h('span', { class: 'faixa', style: 'background:linear-gradient(90deg,' + c.cores[0] + ' 50%,' + c.cores[1] + ' 50%)' }),
      h('div', { class: 'cv-grid' },
        h('section', { class: 'card' }, h('h3', null, 'Clube'),
          h('div', { class: 'strip solto' }, info('Técnico', c.tecnico), info('Estádio', c.estadio.nome), info('Capacidade', nf.format(c.estadio.capacidade) + ' lugares'), info('Torcida média', '~' + nf.format(fav) + ' por jogo'), info('Ingresso', 'R$ ' + c.precoIngresso))),
        h('section', { class: 'card' }, h('h3', null, 'Jogos'),
          h('div', { class: 'srow' }, h('small', null, 'Próximo'), pj ? h('span', null, h('span', { class: 'confronto' }, h('b', null, GM.fmtDataCurta(pj.data)), pj.emCasa ? [K.comEscudo(c), '×', K.comEscudo(pj.adversario, null, { link: true })] : [K.comEscudo(pj.adversario, null, { link: true }), '×', K.comEscudo(c)]), h('small', { class: 'muted' }, pj.rotulo + (pj.emCasa ? ' · em casa' : ' · fora'))) : h('span', { class: 'muted' }, g.fim ? 'Temporada encerrada' : 'Sem jogo marcado')),
          h('div', { class: 'srow' }, h('small', null, 'Últimos 3'), ult.length ? h('div', { class: 'ult' }, ult.map((r) => h('span', { class: 'rl' }, h('i', { class: 'res r' + res(r) }, res(r)), placar(r), h('small', { class: 'muted' }, r.comp)))) : h('span', { class: 'muted' }, 'Nenhum jogo disputado ainda'))),
        K.moralTreinadorBox(c.id)),
      h('h3', { class: 'cv-tit' }, 'Plantel'),
      K.plantelGenerico(c, { readonly: true }));
  };
})();
