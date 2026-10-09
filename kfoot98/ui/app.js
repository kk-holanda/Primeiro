// Kfoot 98 — interface principal: boas-vindas, campeonato, técnico/sorteio, clubes, e a "casa" do jogo (plantel).
// Outras telas em tabela.js, escalacao.js e jogo.js. Multiplayer: G.humanos é uma lista (hoje com 1 técnico).
(function () {
  const K = window.K, BF = window.BF98, h = K.h, PL = BF.Players, E = BF.Economy, GM = BF.Game, S = BF.Season, nf = K.nf, reais = K.reais;
  const MAX_HUMANOS = 6;
  const G = K.G;
  const app = document.getElementById('app');

  const clubeHumano = () => G.g.porId.get(G.humanos[0].clubId);
  K.clubeHumano = clubeHumano;
  K.nomeClube = (id) => G.g.porId.get(id).nome;

  // ---------- esqueleto ----------
  const PASSOS = ['Início', 'Campeonato', 'Técnico', 'Clubes', 'Plantel'];
  function topo() {
    const emJogo = typeof G.tela === 'string';
    return h('header', { class: 'top' }, h('div', { class: 'wrap' },
      h('div', { class: 'brand' }, 'Kfoot', h('b', null, '98')),
      emJogo ? h('span', { class: 'muted' }, GM.fmtData(G.g.data) + ' · ' + clubeHumano().nome)
        : h('ol', { class: 'steps', 'aria-label': 'Etapas' }, PASSOS.map((p, i) => h('li', { class: i + 1 === G.tela ? 'on' : i + 1 < G.tela ? 'ok' : '', 'aria-current': i + 1 === G.tela ? 'step' : false }, (i + 1) + ' · ' + p)))));
  }
  function ir(t) { G.tela = t; G.erro = ''; render(); window.scrollTo(0, 0); }
  function render() {
    if (K.jogoParar) K.jogoParar();
    const f = { 1: tela1, 2: tela2, 3: tela3, 4: tela4, 5: casa, jogo: () => K.telas.jogo(), resumo: () => K.telas.resumo(), fim: () => K.telas.fim() }[G.tela];
    app.replaceChildren(topo(), f());
  }
  K.render = render; K.ir = ir;

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
        h('span', null, h('b', null, '4'), 'divisões do Brasileirão'), h('span', null, h('b', null, '64'), 'clubes na Copa do Brasil'),
        h('span', null, h('b', null, '4'), 'sobem e 4 descem por ano'), h('span', null, h('b', null, '3'), 'substituições, como em 1998'))));
  }

  // ---------- tela 2 ----------
  function tela2() {
    const col = (d) => {
      const cs = BF.CLUBS.filter((c) => c.div === d);
      return h('section', { class: 'div' },
        h('header', null, h('h3', null, K.DIV_NOME[d]), h('span', { class: 'muted num' }, '20 clubes')),
        h('ol', null, cs.map((c) => h('li', { class: c.selecionavel ? 'sorteavel' : d === 'D' ? 'bloq' : '' },
          h('span', { class: 'n' }, c.nome), c.selecionavel ? h('span', { class: 'tag hot' }, 'sorteável') : h('span', { class: 'uf' }, c.uf)))));
    };
    const seg = (v) => h('button', { type: 'button', 'aria-pressed': G.config.maxSubs === v ? 'true' : 'false', onclick: () => { G.config.maxSubs = v; render(); } }, v + (v === 3 ? ' · 1998' : ' · moderno'));
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Temporada inicial · 1998'), h('h2', null, 'Campeonato Brasileiro 1998'),
        h('p', null, 'São quatro divisões de 20 clubes, todos contra todos em ida e volta. Os 4 últimos de cada divisão caem e os 4 primeiros da inferior sobem. Seu clube sai da lista dos 10 piores da Série D.')),
      h('div', { class: 'rules' },
        h('div', { class: 'rule' }, h('b', null, 'Brasileirão A–D'), h('span', null, '38 rodadas por divisão, jogos ao mesmo tempo aos domingos. 4 sobem e 4 descem.')),
        h('div', { class: 'rule' }, h('b', null, 'Copa do Brasil'), h('span', null, '64 clubes, ida e volta, às quartas. Os 32 mais fracos (20 da D e 12 da C) disputam antes uma fase preliminar.')),
        h('div', { class: 'rule' }, h('b', null, 'Libertadores'), h('span', null, 'Vaga para o campeão brasileiro e o da Copa do Brasil (em breve).')),
        h('div', { class: 'rule' }, h('b', null, 'Substituições por jogo'), h('div', { class: 'seg', role: 'group', 'aria-label': 'Limite de substituições' }, seg(3), seg(5)))),
      h('div', { class: 'divs' }, ['A', 'B', 'C', 'D'].map(col)),
      h('div', { class: 'legend' }, h('span', null, h('span', { class: 'tag hot' }, 'sorteável'), ' os 10 piores da Série D, um deles será seu'), h('span', null, 'Os 10 melhores da Série D ficam bloqueados para os técnicos.')),
      h('div', { class: 'actions' }, h('button', { class: 'btn alt', onclick: () => ir(1) }, 'Voltar'), h('button', { class: 'btn', id: 'seguir2', onclick: () => ir(3) }, 'Continuar')));
  }

  // ---------- tela 3 ----------
  function tela3() {
    const eu = h('div', { class: 'slot me' }, h('label', { for: 'nome' }, 'Técnico 1'),
      h('input', { id: 'nome', maxlength: 24, placeholder: 'Seu nome', autocomplete: 'off', value: G.nome, disabled: G.sorteando, oninput: (e) => { G.nome = e.target.value; }, onkeydown: (e) => { if (e.key === 'Enter') sortear(); } }));
    const outros = [];
    for (let i = 2; i <= MAX_HUMANOS; i++) outros.push(h('div', { class: 'slot', 'aria-disabled': 'true' }, h('label', null, 'Técnico ' + i), h('span', null, 'Multiplayer em breve')));
    const sel = BF.CLUBS.filter((c) => c.selecionavel);
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Quem é você?'), h('h2', null, 'Seu nome, seu clube'),
        h('p', null, 'Você começa treinando um dos 10 piores clubes da Série D. O clube é sorteado entre eles: ' + sel.map((c) => c.nome).join(', ') + '.')),
      h('div', { class: 'card' }, h('div', { class: 'slots' }, eu, ...outros), h('p', { class: 'err', id: 'erro', role: 'alert' }, G.erro)),
      h('div', { class: 'draw', 'aria-live': 'polite' }, h('span', { class: 'eyebrow', style: 'color:#b9ccb9' }, 'Sorteio'), h('div', { class: 'big', id: 'sorteio' }, G.humanos.length ? BF.CLUBS.find((c) => c.id === G.humanos[0].clubId).nome : '— — —')),
      h('div', { class: 'actions' }, h('button', { class: 'btn alt', disabled: G.sorteando, onclick: () => ir(2) }, 'Voltar'),
        G.humanos.length && !G.sorteando ? h('button', { class: 'btn hot', id: 'seguir3', onclick: () => ir(4) }, 'Continuar')
          : h('button', { class: 'btn', id: 'sortear', disabled: G.sorteando, onclick: sortear }, G.sorteando ? 'Sorteando…' : 'Sortear meu clube')));
  }
  function sortear() {
    const nome = G.nome.trim().replace(/\s+/g, ' ');
    if (nome.length < 2) { G.erro = 'Digite seu nome (pelo menos 2 letras).'; document.getElementById('erro').textContent = G.erro; document.getElementById('nome').focus(); return; }
    G.nome = nome; G.erro = ''; G.sorteando = true;
    G.seed = (Math.random() * 2 ** 31) >>> 0;          // semente única do mundo: base do multiplayer determinístico
    const rng = BF.RNG.create(G.seed ^ 0x5eed);
    const pool = BF.CLUBS.filter((c) => c.selecionavel);
    const escolhido = S.embaralhar(rng, pool).slice(0, 1)[0];   // com N humanos: slice(0, N), sem repetir clube
    const botao = document.getElementById('sortear'); if (botao) { botao.disabled = true; botao.textContent = 'Sorteando…'; }
    document.getElementById('nome').disabled = true;
    const el = document.getElementById('sorteio'); el.classList.add('rolling');
    const reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const passos = reduz ? 1 : 22; let i = 0;
    (function tick() {
      i++;
      if (i >= passos) {
        el.classList.remove('rolling'); el.textContent = escolhido.nome;
        G.humanos = [{ id: 1, nome, clubId: escolhido.id }];
        G.g = GM.novo({ seed: G.seed, humanos: G.humanos, config: G.config });
        G.sorteando = false; render(); return;
      }
      el.textContent = pool[Math.floor(Math.random() * pool.length)].nome;
      setTimeout(tick, 60 + i * 9);
    })();
  }

  // ---------- tela 4 ----------
  function tela4() {
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Temporada 1998'), h('h2', null, G.humanos.length > 1 ? 'Os técnicos e seus clubes' : 'Seu clube'),
        h('p', null, 'Estes são os técnicos humanos e os clubes que vão treinar. Todos os outros 79 clubes são comandados pelo computador.')),
      h('div', { class: 'assign' }, G.humanos.map((hu) => {
        const c = G.g.porId.get(hu.clubId), folha = E.folhaMensal(c.elenco), pj = GM.proximoJogo(G.g, c.id);
        return h('article', { class: 'club' },
          h('span', { class: 'who' }, 'Técnico · ' + hu.nome), h('div', { class: 'nm' }, c.nome),
          h('dl', { class: 'kv' },
            h('dt', null, 'Cidade'), h('dd', null, c.cidade + ' / ' + c.uf), h('dt', null, 'Divisão'), h('dd', null, K.DIV_NOME[c.div]),
            h('dt', null, 'Estádio'), h('dd', null, c.estadio.nome + ' · ' + nf.format(c.estadio.capacidade)),
            h('dt', null, 'Caixa'), h('dd', null, reais(c.caixa)), h('dt', null, 'Folha mensal'), h('dd', null, reais(folha)),
            h('dt', null, 'Elenco'), h('dd', null, c.elenco.length + ' jogadores'),
            pj ? [h('dt', null, 'Estreia'), h('dd', null, GM.fmtDataCurta(pj.data) + ' · ' + K.nomeClube(pj.adversario))] : null),
          h('p', { class: 'muted' }, 'Meta: fugir da lanterna e subir para a Série C.'));
      })),
      h('div', { class: 'actions' }, h('button', { class: 'btn hot', id: 'verplantel', onclick: () => { G.aba = 'plantel'; ir(5); } }, 'Ver o plantel')));
  }

  // ---------- "casa" do jogo: cabeçalho com data/próximo jogo/últimos jogos + abas ----------
  const resultado = (r) => (r.gp > r.gc ? 'V' : r.gp < r.gc ? 'D' : 'E');
  const placarTxt = (id, r) => { const n = K.nomeClube(id), a = K.nomeClube(r.adv); return r.casa ? n + ' ' + r.gp + ' × ' + r.gc + ' ' + a : a + ' ' + r.gc + ' × ' + r.gp + ' ' + n; };
  function statusBox(c) {
    const g = G.g, pj = GM.proximoJogo(g, c.id), ult = GM.ultimosJogos(g, c.id, 2);
    const prox = g.fim ? h('span', null, 'Temporada encerrada')
      : pj ? h('span', null, h('span', null, h('b', null, GM.fmtDataCurta(pj.data)), ' · ' + (pj.emCasa ? c.nome + ' × ' + K.nomeClube(pj.adversario) : K.nomeClube(pj.adversario) + ' × ' + c.nome)), h('small', { class: 'muted' }, pj.rotulo + (pj.emCasa ? ' · em casa' : ' · fora')))
        : h('span', null, 'Sem jogo marcado');
    return h('aside', { class: 'status', 'aria-label': 'Calendário' },
      h('div', { class: 'srow' }, h('small', null, 'Hoje'), h('b', null, GM.fmtData(g.data))),
      h('div', { class: 'srow' }, h('small', null, 'Próximo jogo'), prox),
      h('div', { class: 'srow' }, h('small', null, 'Últimos jogos'),
        ult.length ? h('div', { class: 'ult' }, ult.map((r) => h('span', { class: 'rl' }, h('i', { class: 'res r' + resultado(r) }, resultado(r)), placarTxt(c.id, r), h('small', { class: 'muted' }, r.comp))))
          : h('span', { class: 'muted' }, 'Nenhum jogo disputado ainda')),
      g.fim ? h('button', { class: 'btn hot', id: 'jogar', onclick: () => ir('fim') }, 'Fim da temporada')
        : h('button', { class: 'btn hot', id: 'jogar', onclick: jogarProximo }, 'Jogar próximo jogo'));
  }
  function jogarProximo() {
    const r = GM.avancar(G.g);
    if (r.fim) { ir('fim'); return; }
    GM.iniciarDia(G.g); K.jogoIniciar(); ir('jogo');
  }
  const ABAS = [['plantel', 'Plantel'], ['escalacao', 'Escalação'], ['tabela', 'Tabela'], ['mercado', 'Mercado'], ['financas', 'Finanças']];
  function casa() {
    const c = clubeHumano(), hu = G.humanos[0];
    const conteudo = G.aba === 'escalacao' ? K.telas.escalacao() : G.aba === 'tabela' ? K.telas.tabela() : plantel(c);
    return h('main', { class: 'wrap page' },
      h('div', { class: 'gamehead' },
        h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Técnico ' + hu.nome + ' · ' + K.DIV_NOME[c.div] + ' · ' + G.g.ano), h('h2', null, c.nome)),
        statusBox(c)),
      h('div', { class: 'tabs', role: 'tablist' }, ABAS.map(([k, t]) => k === 'mercado' || k === 'financas'
        ? h('span', { class: 'soon', role: 'tab', 'aria-disabled': 'true' }, t)
        : h('button', { class: 'tabbtn' + (G.aba === k ? ' on' : ''), role: 'tab', 'aria-selected': G.aba === k ? 'true' : 'false', onclick: () => { G.aba = k; render(); } }, t))),
      conteudo);
  }
  K.telas.casa = casa;

  // ---------- aba Plantel ----------
  const A = (a) => (p) => p.attr[a];
  const COLS = [
    ['num', 'Nº', (p) => p.num, null], ['nome', 'Jogador', (p) => p.nome, null], ['pos', 'Pos', (p) => K.ORDEM_POS.indexOf(p.pos), null], ['idade', 'Id', (p) => p.idade, null], ['media', 'Méd', (p) => PL.overall(p), 'media'],
    ['RIT', 'Rit', A('RIT'), 'RIT'], ['CHU', 'Chu', A('CHU'), 'CHU'], ['PAS', 'Pas', A('PAS'), 'PAS'], ['DRI', 'Dri', A('DRI'), 'DRI'], ['DEF', 'Def', A('DEF'), 'DEF'], ['FIS', 'Fís', A('FIS'), 'FIS'],
    ['disc', 'Disciplina', (p) => p.disciplina, 'disc'], ['stamina', 'Stamina', (p) => p.stamina, 'stamina'], ['moral', 'Moral', (p) => p.moral, 'moral'], ['sit', 'Sit.', (p) => p.lesao * 10 + (p.suspenso ? 1 : 0), 'sit'],
    ['contrato', 'Contrato', (p) => p.contrato, 'contrato'], ['salario', 'Salário/mês', (p) => E.salario(p), 'salario'], ['valor', 'Valor', (p) => E.valorMercado(p), 'valor'],
  ];
  function plantel(c) {
    const esc = GM.escalacaoDe(G.g, c, c), tits = new Set(esc.titulares);
    const dir = G.sort.dir, col = COLS.find((x) => x[0] === G.sort.k) || COLS[2];
    const lista = c.elenco.slice();
    if (G.sort.k === 'pos') lista.sort((a, b) => K.ORDEM_POS.indexOf(a.pos) - K.ORDEM_POS.indexOf(b.pos) || PL.overall(b) - PL.overall(a));
    else lista.sort((a, b) => { const x = col[2](a), y = col[2](b); return (typeof x === 'string' ? x.localeCompare(y, 'pt-BR') : x - y) * dir; });
    if (!G.sel || !c.elenco.some((p) => p.id === G.sel)) G.sel = lista[0].id;
    const media = esc.titulares.map((id) => PL.overall(c.elenco.find((p) => p.id === id))).reduce((a, b) => a + b, 0) / 11;
    const ordenar = (k) => { G.sort = G.sort.k === k ? { k, dir: -G.sort.dir } : { k, dir: ['nome', 'pos', 'num', 'contrato', 'disc'].includes(k) ? 1 : -1 }; render(); };
    const ths = COLS.map(([k, t, , tip]) => h('th', { class: (k === 'nome' ? 'l ' : '') + (G.sort.k === k ? 'sorted' : ''), scope: 'col', tabindex: 0, 'data-tip': tip ? K.TIPS[tip] : false, 'aria-sort': G.sort.k === k ? (dir > 0 ? 'ascending' : 'descending') : 'none', onclick: () => ordenar(k), onkeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ordenar(k); } } }, t));
    const linhas = []; let setor = null;
    lista.forEach((p) => {
      if (G.sort.k === 'pos' && K.SETOR[p.pos] !== setor) { setor = K.SETOR[p.pos]; linhas.push(h('tr', { class: 'sep' }, h('td', { colspan: COLS.length }, setor))); }
      const lim = (v) => (v >= 70 ? 'hi' : v < 35 ? 'lo' : '');
      linhas.push(h('tr', { 'data-id': p.id, class: p.id === G.sel ? 'sel' : '', tabindex: 0, onclick: () => selecionar(p.id), onkeydown: (e) => { if (e.key === 'Enter') selecionar(p.id); } },
        h('td', null, p.num), h('td', { class: 'l nm' }, tits.has(p.id) ? h('span', { class: 'tit', title: 'Titular na escalação atual' }) : null, p.nome),
        h('td', { class: 'pos' }, p.pos), h('td', null, p.idade), h('td', { class: 'ovr' }, Math.round(PL.overall(p))),
        ...K.ATTRS.map((a) => h('td', { class: lim(p.attr[a]) }, p.attr[a])),
        h('td', null, PL.DISCIPLINAS[p.disciplina]), h('td', null, K.barra(p.stamina)), h('td', null, K.barra(p.moral)),
        h('td', { class: p.lesao ? 'bad' : p.suspenso ? 'warn' : '' }, K.situacao(p)),
        h('td', null, GM.fimContrato(G.g, p)), h('td', null, reais(E.salario(p))), h('td', null, reais(E.valorMercado(p)))));
    });
    return h('div', { class: 'plantelwrap' },
      h('div', { class: 'strip' },
        info('Divisão', K.DIV_NOME[c.div]), info('Estádio', c.estadio.nome + ' · ' + nf.format(c.estadio.capacidade)), info('Caixa', reais(c.caixa)),
        info('Folha mensal', reais(E.folhaMensal(c.elenco))), info('Média do time titular', media.toFixed(1)), info('Substituições', G.config.maxSubs + ' por jogo')),
      h('div', { class: 'plantel' },
        h('div', { class: 'tablewrap' }, h('table', { 'aria-label': 'Plantel de ' + c.nome }, h('thead', null, h('tr', null, ths)), h('tbody', null, linhas))),
        painel(c.elenco.find((p) => p.id === G.sel))),
      h('p', { class: 'footnote' }, h('span', { class: 'tit' }), 'Titular na escalação atual. Clique em um jogador para ver os detalhes e no título de uma coluna para ordenar. Passe o mouse nos títulos para ver o que cada atributo significa.'));
  }
  const info = (t, v) => h('div', null, h('small', null, t), h('b', null, v));
  function selecionar(id) { G.sel = id; const x = document.querySelector('.tablewrap').scrollLeft, y = window.scrollY; render(); document.querySelector('.tablewrap').scrollLeft = x; window.scrollTo(0, y); }
  function painel(p) {
    const encaixes = K.ORDEM_POS.map((pos) => [pos, Math.round(PL.ovrNoSlot(p, pos))]).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return h('aside', { class: 'panel', 'aria-label': 'Detalhes do jogador' },
      h('div', null, h('span', { class: 'eyebrow' }, '#' + p.num + ' · ' + p.pos + ' · ' + p.idade + ' anos'), h('div', { class: 'pn' }, p.nome)),
      h('div', { class: 'media' }, h('span', { 'data-tip': K.TIPS.media, tabindex: 0 }, 'Média'), h('b', { class: 'num' }, Math.round(PL.overall(p)))),
      h('div', { class: 'attrs' }, K.ATTRS.map((a) => h('div', { class: 'attrn' }, h('span', { 'data-tip': K.TIPS[a], tabindex: 0 }, a), h('b', { class: 'num' }, p.attr[a])))),
      h('div', { class: 'meters' },
        h('div', null, h('span', { 'data-tip': K.TIPS.stamina, tabindex: 0 }, 'Stamina'), K.barraPct(p.stamina)),
        h('div', null, h('span', { 'data-tip': K.TIPS.moral, tabindex: 0 }, 'Moral'), K.barraPct(p.moral))),
      h('dl', { class: 'kv' },
        h('dt', null, 'Disciplina'), h('dd', null, PL.DISCIPLINAS[p.disciplina]),
        p.lesao ? [h('dt', null, 'Lesão'), h('dd', { class: 'bad' }, p.lesao + ' jogo(s) fora')] : null,
        p.suspenso ? [h('dt', null, 'Suspensão'), h('dd', { class: 'warn' }, 'cumpre no próximo jogo')] : null,
        h('dt', null, 'Contrato até'), h('dd', null, GM.fimContrato(G.g, p)),
        h('dt', null, 'Salário'), h('dd', null, reais(E.salario(p)) + '/mês'), h('dt', null, 'Valor'), h('dd', null, reais(E.valorMercado(p)))),
      h('div', null, h('div', { class: 'eyebrow' }, 'Melhores posições'), h('div', { class: 'fit' }, encaixes.map(([pos, v]) => h('span', null, pos, h('b', null, v))))));
  }

  render();
})();
