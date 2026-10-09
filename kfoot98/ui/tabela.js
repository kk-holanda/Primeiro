// Aba Tabela: classificação das 4 divisões, artilheiros, rodadas e chaveamento da Copa do Brasil. Clique em um clube para ver o plantel dele.
(function () {
  const K = window.K, BF = window.BF98, h = K.h, S = BF.Season, GM = BF.Game;
  const G = K.G;
  const TIP = {
    '#': 'Posição na tabela. Critérios de desempate: pontos, vitórias, saldo de gols e gols pró.', P: 'Pontos: 3 por vitória e 1 por empate.', J: 'Jogos disputados.', V: 'Vitórias.', E: 'Empates.', D: 'Derrotas.',
    GP: 'Gols pró: gols marcados.', GC: 'Gols contra: gols sofridos.', SG: 'Saldo de gols: gols pró menos gols contra.', '%': 'Aproveitamento: pontos conquistados em relação aos pontos disputados.',
    Gols: 'Gols marcados na competição.', Jogos: 'Jogos em que o jogador entrou em campo.', 'G/J': 'Média de gols por jogo.',
    Ida: 'Placar do 1º jogo, na casa do 1º clube.', Volta: 'Placar do 2º jogo, na casa do 2º clube (mostrado do ponto de vista do 1º clube).', Agregado: 'Soma dos dois jogos. Empate vai para os pênaltis; gol fora não vale dobrado.',
  };
  const cab = (t, i, extra) => h('th', { class: i === 1 ? 'l' : '', style: 'cursor:default', 'data-tip': TIP[t] || false, tabindex: TIP[t] ? 0 : false }, t);

  function linhasOrdenadas(g, div) {
    const nome = (id) => g.porId.get(id).nome;
    return S.ordenar(g.ligas[div].tabela).sort((a, b) => b.pts - a.pts || b.v - a.v || (b.gp - b.gc) - (a.gp - a.gc) || b.gp - a.gp || nome(a.id).localeCompare(nome(b.id), 'pt-BR'));
  }
  K.linhasOrdenadas = linhasOrdenadas;
  const clube = (id) => K.comEscudo(id, null, { link: true });

  function classificacao(g, div, meuId) {
    const rows = linhasOrdenadas(g, div), sobe = div !== 'A', desce = div !== 'D', DN = K.DIV_NOME;
    const idx = ['A', 'B', 'C', 'D'].indexOf(div);
    const tr = rows.map((r, i) => {
      const c = g.porId.get(r.id), zona = sobe && i < 4 ? 'z-sobe' : desce && i >= 16 ? 'z-desce' : '', sg = r.gp - r.gc;
      const dica = zona === 'z-sobe' ? 'Zona de acesso: os 4 primeiros sobem para a ' + DN['ABCD'[idx - 1]] + '.' : zona === 'z-desce' ? 'Zona de rebaixamento: os 4 últimos caem para a ' + DN['ABCD'[idx + 1]] + '.' : false;
      return h('tr', { class: [zona, r.id === meuId ? 'meu' : '', g.humanoIds.has(r.id) ? 'humano' : ''].join(' '), style: K.coresClube(c) },
        h('td', { class: 'z', 'data-tip': dica }, i + 1), h('td', { class: 'l nm' }, clube(r.id)), h('td', { class: 'ovr' }, r.pts), h('td', null, r.j), h('td', null, r.v), h('td', null, r.e), h('td', null, r.d),
        h('td', null, r.gp), h('td', null, r.gc), h('td', null, (sg > 0 ? '+' : '') + sg), h('td', null, r.j ? Math.round(r.pts / (r.j * 3) * 100) + '%' : '–'));
    });
    return h('div', { class: 'tablewrap' }, h('table', { class: 'liga', 'aria-label': 'Classificação ' + DN[div] },
      h('thead', null, h('tr', null, ['#', 'Clube', 'P', 'J', 'V', 'E', 'D', 'GP', 'GC', 'SG', '%'].map(cab))), h('tbody', null, tr)));
  }

  function rodadaBox(g, div, meuId) {
    const L = g.ligas[div], feitas = L.res.length;
    const mostra = (titulo, jogos, placar) => h('div', { class: 'rodada' }, h('h3', null, titulo),
      h('ul', null, jogos.map((x) => {
        const cid = x[0], fid = x[1];
        return h('li', { class: cid === meuId || fid === meuId ? 'meu' : '' }, h('span', { class: 'tc' }, clube(cid)), h('b', { class: 'num pl' }, placar ? x[2] + ' × ' + x[3] : '×'), h('span', { class: 'tf' }, clube(fid)));
      })));
    const out = [];
    if (feitas) out.push(mostra('Rodada ' + feitas + ' · resultados', L.res[feitas - 1], true));
    if (feitas < 38) out.push(mostra('Rodada ' + (feitas + 1) + ' · próxima', L.rodadas[feitas], false));
    return h('div', { class: 'rodadas' }, out);
  }

  // artilheiros do campeonato (div 'A'..'D' ou 'copa')
  function artilheiros(g, chave) {
    const lista = Object.values(g.artilharia[chave]).filter((e) => e.gols > 0).sort((a, b) => b.gols - a.gols || a.jogos - b.jogos || a.nome.localeCompare(b.nome, 'pt-BR')).slice(0, 20);
    const nome = chave === 'copa' ? 'Copa do Brasil' : 'Brasileirão ' + K.DIV_NOME[chave];
    if (!lista.length) return h('p', { class: 'muted vazio' }, 'Ainda não há gols no ' + nome + '. Os artilheiros aparecem depois da primeira rodada.');
    const donos = new Map(); g.clubes.forEach((c) => c.elenco.forEach((p) => donos.set(p.id, p)));
    let rank = 0, ant = null;
    const tr = lista.map((e, i) => {
      if (e.gols !== ant) { rank = i + 1; ant = e.gols; }
      const p = donos.get(e.id), c = g.porId.get(e.clubId);
      return h('tr', { class: g.humanoIds.has(e.clubId) ? 'meu' : '', style: K.coresClube(c) },
        h('td', { class: 'z' }, rank), h('td', { class: 'l nm' }, e.nome, p && p.estrela ? K.estrela() : null), h('td', null, p ? K.bandeira(p.nac) : ''), h('td', { class: 'pos' }, e.pos), h('td', { class: 'l' }, clube(e.clubId)),
        h('td', { class: 'ovr' }, e.gols), h('td', null, e.jogos), h('td', null, (e.gols / e.jogos).toFixed(2).replace('.', ',')));
    });
    return h('div', { class: 'tablewrap' }, h('table', { class: 'liga art', 'aria-label': 'Artilheiros ' + nome },
      h('thead', null, h('tr', null, [['#'], ['Jogador'], ['Nac'], ['Pos'], ['Clube'], ['Gols'], ['Jogos'], ['G/J']].map(([t], i) => h('th', { class: i === 1 || i === 4 ? 'l' : '', style: 'cursor:default', 'data-tip': TIP[t] || (t === 'Nac' ? K.TIPS.nac : false), tabindex: 0 }, t)))), h('tbody', null, tr)));
  }

  function copaView(g, meuId) {
    const fases = g.copa.fases.slice().reverse();
    const blocos = fases.map((f) => h('section', { class: 'faseCopa' },
      h('h3', null, f.nome + (f.jogada ? '' : ' · em andamento')),
      h('div', { class: 'tablewrap' }, h('table', { class: 'copa' },
        h('thead', null, h('tr', null, ['Clube (1º jogo em casa)', 'Ida', 'Volta', 'Clube', 'Agregado'].map((t, i) => h('th', { class: i === 0 || i === 3 ? 'l' : '', style: 'cursor:default', 'data-tip': TIP[t] || (i === 0 ? 'O 1º clube joga a ida em casa e a volta fora.' : false), tabindex: 0 }, t)))),
        h('tbody', null, f.confrontos.map((c) => {
          const v = c.vencedor, id = (x) => (x === meuId ? 'meu' : '');
          return h('tr', { class: id(c.a) || id(c.b) },
            h('td', { class: 'l nm' + (v === c.a ? ' venc' : '') }, clube(c.a)), h('td', null, c.ida ? c.ida[0] + '×' + c.ida[1] : '–'), h('td', null, c.volta ? c.volta[1] + '×' + c.volta[0] : '–'),
            h('td', { class: 'l' + (v === c.b ? ' venc' : '') }, clube(c.b)),
            h('td', null, c.agregado ? c.agregado[0] + '×' + c.agregado[1] + (c.penaltis ? ' (pên. ' + c.penaltis[0] + '×' + c.penaltis[1] + ')' : '') : '–'));
        }))))));
    return h('div', { class: 'copaview' },
      g.copa.campeao ? h('p', { class: 'campeao' }, 'Campeão da Copa do Brasil: ', clube(g.copa.campeao)) : null,
      h('p', { class: 'muted' }, 'A volta é disputada na casa do segundo clube. Empate no agregado vai para os pênaltis. Gol fora não vale dobrado.'), blocos);
  }

  K.telas.tabela = function () {
    if (G.clubeVisto) return K.telas.clubeVisto();
    const g = G.g, c = K.clubeHumano();
    if (!G.tabDiv) G.tabDiv = c.div;
    if (!G.tabVista) G.tabVista = 'class';
    const abas = ['A', 'B', 'C', 'D'].map((d) => h('button', { class: 'tabbtn' + (G.tabDiv === d ? ' on' : ''), onclick: () => { G.tabDiv = d; K.render(); } }, K.DIV_NOME[d]))
      .concat(h('button', { class: 'tabbtn' + (G.tabDiv === 'copa' ? ' on' : ''), onclick: () => { G.tabDiv = 'copa'; K.render(); } }, 'Copa do Brasil'));
    const copa = G.tabDiv === 'copa';
    const vista = h('div', { class: 'seg', role: 'group', 'aria-label': 'Visão' }, [['class', copa ? 'Chave' : 'Classificação'], ['art', 'Artilheiros']].map(([k, t]) => h('button', { type: 'button', 'aria-pressed': G.tabVista === k ? 'true' : 'false', onclick: () => { G.tabVista = k; K.render(); } }, t)));
    let corpo;
    if (G.tabVista === 'art') corpo = artilheiros(g, copa ? 'copa' : G.tabDiv);
    else if (copa) corpo = copaView(g, c.id);
    else corpo = h('div', { class: 'ligabox' }, classificacao(g, G.tabDiv, c.id),
      h('div', { class: 'ligalado' }, rodadaBox(g, G.tabDiv, c.id),
        h('p', { class: 'legend' }, G.tabDiv !== 'A' ? h('span', null, h('i', { class: 'sw sobe' }), ' acesso (4 primeiros)') : null, G.tabDiv !== 'D' ? h('span', null, h('i', { class: 'sw desce' }), ' rebaixamento (4 últimos)') : null)));
    return h('div', { class: 'tabelawrap' }, h('div', { class: 'subtabs' }, abas), h('div', { class: 'subvista' }, vista, h('span', { class: 'muted' }, 'Clique em um clube para ver o plantel e os dados dele.')), corpo);
  };
})();
