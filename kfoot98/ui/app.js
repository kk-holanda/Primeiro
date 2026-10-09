// Kfoot 98 — interface. 5 telas: boas-vindas, clubes, nome+sorteio, clubes dos técnicos, plantel.
// Multiplayer: G.humanos é uma lista (hoje com 1 técnico). A tela 3 já mostra os 6 lugares; falta só o servidor.
(function () {
  const BF = window.BF98, PL = BF.Players, E = BF.Economy, PR = BF.Progression, S = BF.Season;
  const MAX_HUMANOS = 6;
  const G = { tela: 1, ano: 1998, config: { maxSubs: 3 }, humanos: [], seed: 0, mundo: null, nome: '', erro: '', sorteando: false, sel: null, sort: { k: 'pos', dir: 1 } };

  // ---------- util ----------
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === false || v == null) continue;
      if (k === 'class') el.className = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'html') el.innerHTML = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    kids.flat(Infinity).forEach((c) => { if (c == null || c === false) return; el.append(c.nodeType ? c : document.createTextNode(String(c))); });
    return el;
  }
  const nf = new Intl.NumberFormat('pt-BR');
  function reais(n) {
    if (n >= 1e6) return 'R$ ' + (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace('.', ',') + ' mi';
    if (n >= 1e4) return 'R$ ' + Math.round(n / 1000) + ' mil';
    if (n >= 1e3) return 'R$ ' + (n / 1e3).toFixed(1).replace('.', ',') + ' mil';
    return 'R$ ' + nf.format(Math.round(n));
  }
  const DIV_NOME = { A: 'Série A', B: 'Série B', C: 'Série C', D: 'Série D' };
  const ORDEM_POS = ['GOL', 'LD', 'ZAG', 'LIB', 'LE', 'VOL', 'MC', 'MEI', 'ALA', 'PD', 'PE', 'SA', 'CA'];
  const SETOR = { GOL: 'Goleiros', ZAG: 'Defensores', LIB: 'Defensores', LD: 'Defensores', LE: 'Defensores', VOL: 'Meio-campistas', MC: 'Meio-campistas', MEI: 'Meio-campistas', ALA: 'Meio-campistas', PD: 'Atacantes', PE: 'Atacantes', CA: 'Atacantes', SA: 'Atacantes' };
  const NOME_ATTR = { RIT: 'Ritmo', CHU: 'Chute', PAS: 'Passe', DRI: 'Drible', DEF: 'Defesa', FIS: 'Físico' };

  function criarMundo(seed) {
    const rng = BF.RNG.create(seed);
    const clubes = BF.CLUBS.map((c) => {
      const cl = { ...c, estadio: { ...c.estadio }, patrocinadores: [], elenco: PL.gerarElenco(rng, c) };
      numerar(cl.elenco); return cl;
    });
    return { rng, clubes, porId: new Map(clubes.map((c) => [c.id, c])) };
  }
  // camisas: goleiro 1/12/22, zagueiros 3/4/13..., etc.
  function numerar(elenco) {
    const pref = { GOL: [1, 12, 22], ZAG: [3, 4, 14, 15], LD: [2, 13], LE: [6, 16], VOL: [5, 8, 15], MC: [8, 17], MEI: [10, 20], PD: [7], PE: [11], CA: [9, 19, 18], SA: [21, 18], LIB: [4], ALA: [17] };
    const usados = new Set();
    elenco.slice().sort((a, b) => PL.overall(b) - PL.overall(a)).forEach((p) => {
      let n = (pref[p.pos] || []).find((x) => !usados.has(x));
      if (!n) { n = 2; while (usados.has(n)) n++; }
      usados.add(n); p.num = n;
    });
  }

  // ---------- esqueleto ----------
  const app = document.getElementById('app');
  const PASSOS = ['Início', 'Campeonato', 'Técnico', 'Clubes', 'Plantel'];
  function topo() {
    return h('header', { class: 'top' }, h('div', { class: 'wrap' },
      h('div', { class: 'brand' }, 'Kfoot', h('b', null, '98')),
      h('ol', { class: 'steps', 'aria-label': 'Etapas' }, PASSOS.map((p, i) => h('li', { class: i + 1 === G.tela ? 'on' : i + 1 < G.tela ? 'ok' : '', 'aria-current': i + 1 === G.tela ? 'step' : false }, (i + 1) + ' · ' + p)))));
  }
  function ir(t) { G.tela = t; G.erro = ''; render(); window.scrollTo(0, 0); }
  function render() {
    app.replaceChildren(topo(), [tela1, tela2, tela3, tela4, tela5][G.tela - 1]());
  }

  // ---------- tela 1 ----------
  function tela1() {
    const pitch = h('div', { html: '<svg class="pitch" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g fill="none" stroke="#eef6ea" stroke-width="4"><rect x="40" y="40" width="1120" height="520"/><line x1="600" y1="40" x2="600" y2="560"/><circle cx="600" cy="300" r="90"/><rect x="40" y="170" width="170" height="260"/><rect x="990" y="170" width="170" height="260"/><rect x="40" y="235" width="60" height="130"/><rect x="1100" y="235" width="60" height="130"/></g></svg>' });
    return h('main', null,
      h('section', { class: 'hero' }, pitch.firstChild, h('div', { class: 'wrap' },
        h('div', { class: 'logo', 'aria-label': 'Kfoot 98' }, h('span', { class: 'k' }, 'Kfoot'), h('span', { class: 'y' }, '98')),
        h('p', { class: 'lead' }, 'Brasil, 1998. Você assume um time na lanterna da Série D e tenta chegar à Libertadores.'),
        h('div', { class: 'actions' }, h('button', { class: 'btn', id: 'novo', onclick: () => ir(2) }, 'Novo jogo')),
        h('small', null, 'Gerenciamento de futebol · 4 divisões · 80 clubes'))),
      h('div', { class: 'ticker' }, h('div', { class: 'wrap' },
        h('span', null, h('b', null, '4'), 'divisões do Brasileirão'),
        h('span', null, h('b', null, '64'), 'clubes na Copa do Brasil'),
        h('span', null, h('b', null, '4'), 'sobem e 4 descem por ano'),
        h('span', null, h('b', null, '3'), 'substituições, como em 1998'))));
  }

  // ---------- tela 2 ----------
  function tela2() {
    const col = (d) => {
      const cs = BF.CLUBS.filter((c) => c.div === d);
      return h('section', { class: 'div' },
        h('header', null, h('h3', null, DIV_NOME[d]), h('span', { class: 'muted num' }, '20 clubes')),
        h('ol', null, cs.map((c) => h('li', { class: c.selecionavel ? 'sorteavel' : d === 'D' ? 'bloq' : '' },
          h('span', { class: 'n' }, c.nome), c.selecionavel ? h('span', { class: 'tag hot' }, 'sorteável') : h('span', { class: 'uf' }, c.uf)))));
    };
    const seg = (v) => h('button', { type: 'button', 'aria-pressed': G.config.maxSubs === v ? 'true' : 'false', onclick: () => { G.config.maxSubs = v; render(); } }, v + (v === 3 ? ' · 1998' : ' · moderno'));
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Temporada inicial · ' + G.ano), h('h2', null, 'Campeonato Brasileiro ' + G.ano),
        h('p', null, 'São quatro divisões de 20 clubes, todos contra todos em ida e volta. Os 4 últimos de cada divisão caem e os 4 primeiros da inferior sobem. Seu clube sai da lista dos 10 piores da Série D.')),
      h('div', { class: 'rules' },
        h('div', { class: 'rule' }, h('b', null, 'Brasileirão A–D'), h('span', null, '38 rodadas por divisão, jogos ao mesmo tempo. 4 sobem e 4 descem.')),
        h('div', { class: 'rule' }, h('b', null, 'Copa do Brasil'), h('span', null, '64 clubes, ida e volta. Os 32 mais fracos (20 da D e 12 da C) disputam antes uma fase preliminar.')),
        h('div', { class: 'rule' }, h('b', null, 'Libertadores'), h('span', null, 'Vaga para o campeão brasileiro e o da Copa do Brasil.')),
        h('div', { class: 'rule' }, h('b', null, 'Substituições por jogo'), h('div', { class: 'seg', role: 'group', 'aria-label': 'Limite de substituições' }, seg(3), seg(5)))),
      h('div', { class: 'divs' }, ['A', 'B', 'C', 'D'].map(col)),
      h('div', { class: 'legend' }, h('span', null, h('span', { class: 'tag hot' }, 'sorteável'), ' os 10 piores da Série D, um deles será seu'), h('span', null, 'Os 10 melhores da Série D ficam bloqueados para os técnicos.')),
      h('div', { class: 'actions' }, h('button', { class: 'btn alt', onclick: () => ir(1) }, 'Voltar'), h('button', { class: 'btn', id: 'seguir2', onclick: () => ir(3) }, 'Continuar')));
  }

  // ---------- tela 3 ----------
  function tela3() {
    const eu = h('div', { class: 'slot me' }, h('label', { for: 'nome' }, 'Técnico 1'),
      h('input', { id: 'nome', maxlength: 24, placeholder: 'Seu nome', autocomplete: 'off', value: G.nome, disabled: G.sorteando, oninput: (e) => { G.nome = e.target.value; } , onkeydown: (e) => { if (e.key === 'Enter') sortear(); } }));
    const outros = [];
    for (let i = 2; i <= MAX_HUMANOS; i++) outros.push(h('div', { class: 'slot', 'aria-disabled': 'true' }, h('label', null, 'Técnico ' + i), h('span', null, 'Multiplayer em breve')));
    const sel = BF.CLUBS.filter((c) => c.selecionavel);
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Quem é você?'), h('h2', null, 'Seu nome, seu clube'),
        h('p', null, 'Você começa treinando um dos 10 piores clubes da Série D. O clube é sorteado entre eles: ' + sel.map((c) => c.nome).join(', ') + '.')),
      h('div', { class: 'card' }, h('div', { class: 'slots' }, eu, ...outros),
        h('p', { class: 'err', id: 'erro', role: 'alert' }, G.erro)),
      h('div', { class: 'draw', 'aria-live': 'polite' }, h('span', { class: 'eyebrow', style: 'color:#b9ccb9' }, 'Sorteio'), h('div', { class: 'big', id: 'sorteio' }, G.humanos.length ? BF.CLUBS.find((c) => c.id === G.humanos[0].clubId).nome : '— — —')),
      h('div', { class: 'actions' }, h('button', { class: 'btn alt', disabled: G.sorteando, onclick: () => ir(2) }, 'Voltar'),
        G.humanos.length && !G.sorteando
          ? h('button', { class: 'btn hot', id: 'seguir3', onclick: () => ir(4) }, 'Continuar')
          : h('button', { class: 'btn', id: 'sortear', disabled: G.sorteando, onclick: sortear }, G.sorteando ? 'Sorteando…' : 'Sortear meu clube')));
  }
  function sortear() {
    const nome = G.nome.trim().replace(/\s+/g, ' ');
    if (nome.length < 2) { G.erro = 'Digite seu nome (pelo menos 2 letras).'; document.getElementById('erro').textContent = G.erro; document.getElementById('nome').focus(); return; }
    G.nome = nome; G.erro = ''; G.sorteando = true;
    G.seed = (Math.random() * 2 ** 31) >>> 0;          // semente única do mundo: base do multiplayer determinístico
    G.mundo = criarMundo(G.seed);
    const rng = BF.RNG.create(G.seed ^ 0x5eed);
    const pool = BF.CLUBS.filter((c) => c.selecionavel);
    const escolhido = S.embaralhar(rng, pool).slice(0, 1)[0];   // com N humanos: slice(0, N) — sem repetir clube
    const botao = document.getElementById('sortear'); if (botao) { botao.disabled = true; botao.textContent = 'Sorteando…'; }
    document.getElementById('nome').disabled = true;
    const el = document.getElementById('sorteio'); el.classList.add('rolling');
    const reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const passos = reduz ? 1 : 22; let i = 0;
    (function tick() {
      i++;
      if (i >= passos) {
        el.classList.remove('rolling'); el.textContent = escolhido.nome;
        G.humanos = [{ id: 1, nome, clubId: escolhido.id }]; G.sorteando = false; render(); return;
      }
      el.textContent = pool[Math.floor(Math.random() * pool.length)].nome;
      setTimeout(tick, 60 + i * 9);
    })();
  }

  // ---------- tela 4 ----------
  function tela4() {
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Temporada ' + G.ano), h('h2', null, G.humanos.length > 1 ? 'Os técnicos e seus clubes' : 'Seu clube'),
        h('p', null, 'Estes são os técnicos humanos e os clubes que vão treinar. Todos os outros 79 clubes são comandados pelo computador.')),
      h('div', { class: 'assign' }, G.humanos.map((hu) => {
        const c = G.mundo.porId.get(hu.clubId), folha = E.folhaMensal(c.elenco);
        return h('article', { class: 'club' },
          h('span', { class: 'who' }, 'Técnico · ' + hu.nome), h('div', { class: 'nm' }, c.nome),
          h('dl', { class: 'kv' },
            h('dt', null, 'Cidade'), h('dd', null, c.cidade + ' / ' + c.uf),
            h('dt', null, 'Divisão'), h('dd', null, DIV_NOME[c.div]),
            h('dt', null, 'Estádio'), h('dd', null, c.estadio.nome + ' · ' + nf.format(c.estadio.capacidade)),
            h('dt', null, 'Caixa'), h('dd', null, reais(c.caixa)),
            h('dt', null, 'Folha mensal'), h('dd', null, reais(folha)),
            h('dt', null, 'Elenco'), h('dd', null, c.elenco.length + ' jogadores')),
          h('p', { class: 'muted' }, 'Meta: fugir da lanterna e subir para a Série C.'));
      })),
      h('div', { class: 'actions' }, h('button', { class: 'btn hot', id: 'verplantel', onclick: () => ir(5) }, 'Ver o plantel')));
  }

  // ---------- tela 5 ----------
  const COLS = [
    ['num', 'Nº', (p) => p.num], ['nome', 'Jogador', (p) => p.nome], ['pos', 'Pos', (p) => ORDEM_POS.indexOf(p.pos)], ['idade', 'Id', (p) => p.idade], ['ovr', 'Ovr', (p) => PL.overall(p)],
    ['RIT', 'Rit', (p) => p.attr.RIT], ['CHU', 'Chu', (p) => p.attr.CHU], ['PAS', 'Pas', (p) => p.attr.PAS], ['DRI', 'Dri', (p) => p.attr.DRI], ['DEF', 'Def', (p) => p.attr.DEF], ['FIS', 'Fís', (p) => p.attr.FIS],
    ['disc', 'Disciplina', (p) => p.disciplina], ['stamina', 'Stamina', (p) => p.stamina], ['moral', 'Moral', (p) => p.moral], ['contrato', 'Contrato', (p) => p.contrato], ['salario', 'Salário/mês', (p) => E.salario(p)], ['valor', 'Valor', (p) => E.valorMercado(p)],
  ];
  const barra = (v) => h('span', { class: 'bar', title: Math.round(v) + '%' }, h('i', { class: 'c-' + PR.cor(v), style: 'width:' + Math.round(v) + '%' }));
  function tela5() {
    const hu = G.humanos[0], c = G.mundo.porId.get(hu.clubId);
    if (!c.__titulares) { const esc = S.escalarAuto(c, '4-4-2', 'equilibrado'); c.__titulares = new Set(esc.titulares); }
    const tits = c.__titulares;
    const sort = COLS.find((x) => x[0] === G.sort.k) || COLS[2], dir = G.sort.dir;
    let lista = c.elenco.slice();
    if (G.sort.k === 'pos') lista.sort((a, b) => ORDEM_POS.indexOf(a.pos) - ORDEM_POS.indexOf(b.pos) || PL.overall(b) - PL.overall(a));
    else lista.sort((a, b) => { const x = sort[2](a), y = sort[2](b); return (typeof x === 'string' ? x.localeCompare(y, 'pt-BR') : x - y) * dir; });
    if (!G.sel || !c.elenco.some((p) => p.id === G.sel)) G.sel = lista[0].id;
    const media = [...tits].map((id) => PL.overall(c.elenco.find((p) => p.id === id))).reduce((a, b) => a + b, 0) / 11;
    const ths = COLS.map(([k, t]) => h('th', { class: (k === 'nome' ? 'l ' : '') + (G.sort.k === k ? 'sorted' : ''), scope: 'col', tabindex: 0, 'aria-sort': G.sort.k === k ? (dir > 0 ? 'ascending' : 'descending') : 'none', onclick: () => ordenar(k), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ordenar(k); } } }, t));
    const linhas = []; let setorAtual = null;
    lista.forEach((p) => {
      if (G.sort.k === 'pos' && SETOR[p.pos] !== setorAtual) { setorAtual = SETOR[p.pos]; linhas.push(h('tr', { class: 'sep' }, h('td', { colspan: COLS.length }, setorAtual))); }
      const lim = (v) => v >= 70 ? 'hi' : v < 35 ? 'lo' : '';
      linhas.push(h('tr', { 'data-id': p.id, class: p.id === G.sel ? 'sel' : '', tabindex: 0, onclick: () => selecionar(p.id), onkeydown: (e) => { if (e.key === 'Enter') selecionar(p.id); } },
        h('td', null, p.num), h('td', { class: 'l nm' }, tits.has(p.id) ? h('span', { class: 'tit', title: 'Titular no 4-4-2 sugerido' }) : null, p.nome),
        h('td', { class: 'pos' }, p.pos), h('td', null, p.idade), h('td', { class: 'ovr' }, Math.round(PL.overall(p))),
        ...['RIT', 'CHU', 'PAS', 'DRI', 'DEF', 'FIS'].map((a) => h('td', { class: lim(p.attr[a]) }, p.attr[a])),
        h('td', null, PL.DISCIPLINAS[p.disciplina]), h('td', null, barra(p.stamina)), h('td', null, barra(p.moral)),
        h('td', null, 'Dez/' + (1997 + p.contrato)), h('td', null, reais(E.salario(p))), h('td', null, reais(E.valorMercado(p)))));
    });
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Técnico ' + hu.nome + ' · ' + G.ano), h('h2', null, c.nome)),
      h('div', { class: 'strip' },
        info('Divisão', DIV_NOME[c.div]), info('Estádio', c.estadio.nome + ' · ' + nf.format(c.estadio.capacidade)), info('Caixa', reais(c.caixa)),
        info('Folha mensal', reais(E.folhaMensal(c.elenco))), info('Time-base (4-4-2)', media.toFixed(1) + ' ovr'), info('Substituições', G.config.maxSubs + ' por jogo')),
      h('div', { class: 'tabs', role: 'tablist' }, h('span', { class: 'on', role: 'tab', 'aria-selected': 'true' }, 'Plantel'), ['Escalação', 'Tabela', 'Mercado', 'Finanças'].map((t) => h('span', { class: 'soon', role: 'tab', 'aria-disabled': 'true' }, t))),
      h('div', { class: 'plantel' },
        h('div', { class: 'tablewrap' }, h('table', { 'aria-label': 'Plantel de ' + c.nome }, h('thead', null, h('tr', null, ths)), h('tbody', null, linhas))),
        painel(c.elenco.find((p) => p.id === G.sel))),
      h('p', { class: 'footnote' }, h('span', { class: 'tit' }), 'Titular no time-base sugerido. Clique em um jogador para ver os detalhes e no título de uma coluna para ordenar. Stamina e moral: verde cheio, amarelo médio, vermelho baixo.'),
      h('div', { class: 'actions' }, h('button', { class: 'btn alt', onclick: () => ir(4) }, 'Voltar')));
  }
  const info = (t, v) => h('div', null, h('small', null, t), h('b', null, v));
  function ordenar(k) { G.sort = G.sort.k === k ? { k, dir: -G.sort.dir } : { k, dir: ['nome', 'pos', 'num', 'contrato'].includes(k) ? 1 : -1 }; render(); }
  function selecionar(id) { G.sel = id; const y = window.scrollY, x = document.querySelector('.tablewrap').scrollLeft; render(); document.querySelector('.tablewrap').scrollLeft = x; window.scrollTo(0, y); }
  function painel(p) {
    const encaixes = ORDEM_POS.map((pos) => [pos, Math.round(PL.ovrNoSlot(p, pos))]).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return h('aside', { class: 'panel', 'aria-label': 'Detalhes do jogador' },
      h('div', null, h('span', { class: 'eyebrow' }, '#' + p.num + ' · ' + p.pos + ' · ' + p.idade + ' anos'), h('div', { class: 'pn' }, p.nome)),
      h('div', { class: 'attr' }, h('span', { class: 'muted' }, 'Ovr'), barraW(PL.overall(p)), h('b', null, Math.round(PL.overall(p)))),
      ['RIT', 'CHU', 'PAS', 'DRI', 'DEF', 'FIS'].map((a) => h('div', { class: 'attr' }, h('span', { class: 'muted' }, a), barraW(p.attr[a]), h('b', null, p.attr[a]))),
      h('dl', { class: 'kv' },
        h('dt', null, 'Disciplina'), h('dd', null, PL.DISCIPLINAS[p.disciplina]),
        h('dt', null, 'Stamina'), h('dd', null, Math.round(p.stamina) + '% · ' + PR.cor(p.stamina).replace('-', ' ')),
        h('dt', null, 'Moral'), h('dd', null, Math.round(p.moral) + '% · ' + PR.cor(p.moral).replace('-', ' ')),
        h('dt', null, 'Contrato até'), h('dd', null, 'Dez/' + (1997 + p.contrato)),
        h('dt', null, 'Salário'), h('dd', null, reais(E.salario(p)) + '/mês'),
        h('dt', null, 'Valor'), h('dd', null, reais(E.valorMercado(p)))),
      h('div', null, h('div', { class: 'eyebrow' }, 'Melhores posições'), h('div', { class: 'fit' }, encaixes.map(([pos, v]) => h('span', null, pos, h('b', null, v))))));
  }
  const barraW = (v) => h('span', { class: 'bar' }, h('i', { style: 'width:' + Math.round(v) + '%' }));

  render();
})();
