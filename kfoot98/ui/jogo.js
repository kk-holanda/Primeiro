// Dia de jogos ao vivo (todas as divisões ao mesmo tempo), pausa com substituições, resumo pós-jogo e fim de temporada.
(function () {
  const K = window.K, BF = window.BF98, h = K.h, GM = BF.Game, M = BF.Match, S = BF.Season, PL = BF.Players;
  const G = K.G;
  const VELS = [['Lento', 500], ['Normal', 250], ['Rápido', 70]];

  K.jogoIniciar = () => { G.jg = { vel: (G.jg && G.jg.vel) || 250, pausado: true, painel: false, selOut: null, selIn: null, evtN: 0, aviso: 'Apito inicial' }; G.resumos = null; };
  K.jogoParar = () => { if (G.jg && G.jg.timer) { clearInterval(G.jg.timer); G.jg.timer = null; } };

  const partidaHumana = () => G.g.live.partidas.find((p) => p.humano[0] || p.humano[1]);
  const ladoHumano = (p) => (p.humano[0] ? 0 : 1);
  const nome = (id) => K.nomeClube(id);
  const L = () => G.g.live;

  // ---------- ao vivo ----------
  function pausar(aviso) { K.jogoParar(); G.jg.pausado = true; if (aviso) G.jg.aviso = aviso; K.render(); }
  function retomar() { G.jg.pausado = false; G.jg.aviso = ''; G.jg.painel = false; K.render(); }
  function tick() {
    const live = L(); if (live.min >= 90) { K.jogoParar(); return; }
    GM.passoDia(G.g); atualizar();
    if (live.min === 45) { G.jg.painel = true; pausar('FIM DO PRIMEIRO TEMPO'); }
    else if (live.min >= 90) pausar('Fim de jogo');
  }
  function iniciarTimer() { K.jogoParar(); if (!G.jg.pausado && L().min < 90) G.jg.timer = setInterval(tick, G.jg.vel); }

  const tagEv = (e) => ({ gol: ['GOL', 'gol'], amarelo: ['AMARELO', 'am'], vermelho: ['VERMELHO', 'vm'], lesao: ['LESÃO', 'les'], substituicao: ['SUBST.', 'sub'], formacao: ['FORMAÇÃO', 'sub'] }[e.tipo]);
  function eventoLinha(e, p) {
    const [t, c] = tagEv(e), id = e.lado === 0 ? p.jogo.casa : p.jogo.fora, clube = nome(id), cl = G.g.porId.get(id);
    let txt = e.jogador + ' (' + clube + ')';
    if (e.tipo === 'gol') txt = e.jogador + ' (' + clube + ')' + (e.assist ? ', passe de ' + e.assist : '') + ' · ' + e.placar[0] + ' × ' + e.placar[1];
    if (e.tipo === 'substituicao') txt = 'Entra ' + e.jogador + ', sai ' + e.saiu + ' (' + clube + ')';
    if (e.tipo === 'formacao') txt = clube + ': ' + e.texto;
    return h('li', { class: 'ev ' + c, style: 'border-left:5px solid ' + cl.cores[0] + ';box-shadow:inset 5px 0 0 -2px ' + cl.cores[1] }, h('span', { class: 'mn num' }, e.min + "'"), K.escudo(cl), h('span', { class: 'etag ' + c }, t), h('span', null, txt));
  }
  const fmtPub = (n) => (n >= 10000 ? Math.round(n / 1000) + ' mil' : n >= 1000 ? (n / 1000).toFixed(1).replace('.', ',') + ' mil' : String(n));
  const nf = (n) => K.nf.format(n);
  const REFS = {};
  function pintarStats(P) {
    const st = P.m.stats, n = Math.max(1, P.m.min);
    REFS.stats.forEach(([k, el]) => { el.textContent = k === 'posse' ? Math.round(st[0].posse / n * 100) + '% — ' + Math.round(st[1].posse / n * 100) + '%' : st[0][k] + ' — ' + st[1][k]; });
  }
  function atualizar() {
    const live = L(), P = partidaHumana();
    REFS.clock.textContent = live.min + "'";
    for (const p of live.partidas) {
      const r = REFS.rows.get(p), pl = M.placarDe(p.m), s = pl[0] + ' × ' + pl[1];
      if (r.el.textContent !== s) { r.el.textContent = s; r.li.classList.add('flash'); setTimeout(() => r.li.classList.remove('flash'), 1500); }
    }
    if (P) {
      const pl = M.placarDe(P.m); REFS.pl0.textContent = pl[0]; REFS.pl1.textContent = pl[1];
      pintarStats(P);
      while (G.jg.evtN < P.m.eventos.length) { REFS.feed.prepend(eventoLinha(P.m.eventos[G.jg.evtN], P)); G.jg.evtN++; }
    }
    if (REFS.bar) REFS.bar.style.width = Math.min(100, live.min / 90 * 100) + '%';
  }

  K.telas.jogo = function () {
    const g = G.g, live = L(), P = partidaHumana(), jg = G.jg;
    REFS.rows = new Map(); REFS.stats = [];
    const lado = P ? ladoHumano(P) : 0;
    // coluna dos outros jogos
    const grupos = new Map();
    for (const p of live.partidas) { const k = p.jogo.comp === 'liga' ? K.DIV_NOME[p.jogo.div] : p.jogo.fase + ' · ' + (p.jogo.perna === 'ida' ? 'ida' : 'volta'); if (!grupos.has(k)) grupos.set(k, []); grupos.get(k).push(p); }
    const outros = [...grupos].map(([titulo, ps]) => h('section', { class: 'jdiv' }, h('h3', null, titulo),
      h('ul', null, ps.map((p) => {
        const pl = M.placarDe(p.m), sc = h('b', { class: 'num pl' }, pl[0] + ' × ' + pl[1]);
        const li = h('li', { class: (p.humano[0] || p.humano[1]) ? 'meu' : '' }, h('span', { class: 'tc' }, K.comEscudo(p.jogo.casa)), sc, h('span', { class: 'tf' }, K.comEscudo(p.jogo.fora)), h('small', { class: 'pub num', 'data-tip': 'Público: ' + nf(p.publico) + ' pessoas' }, fmtPub(p.publico)));
        REFS.rows.set(p, { el: sc, li }); return li;
      }))));

    // painel principal (partida do humano)
    const stat = (rot, k) => { const el = h('span', { class: 'num' }); REFS.stats.push([k, el]); return h('div', { class: 'strow' }, el, h('small', null, rot)); };
    const clockEl = h('div', { class: 'clock num', 'aria-live': 'off' }, live.min + "'"); REFS.clock = clockEl;
    REFS.bar = null;
    const pl = P ? M.placarDe(P.m) : [0, 0];
    REFS.pl0 = h('b', { class: 'num' }, pl[0]); REFS.pl1 = h('b', { class: 'num' }, pl[1]);
    REFS.feed = h('ol', { class: 'feed', 'aria-label': 'Lances' });
    if (P) { P.m.eventos.slice().reverse().forEach((e) => REFS.feed.append(eventoLinha(e, P))); jg.evtN = P.m.eventos.length; }

    const fim = live.min >= 90;
    const ctrl = h('div', { class: 'jctrl' },
      fim ? h('button', { class: 'btn hot', id: 'verresumo', onclick: () => { K.jogoParar(); G.resumos = GM.finalizarDia(G.g); K.ir('resumo'); } }, 'Ver resumo do jogo')
        : jg.pausado ? h('button', { class: 'btn', id: 'play', onclick: retomar }, live.min === 0 ? 'Iniciar o jogo' : live.min === 45 ? 'Começar o 2º tempo' : 'Continuar')
          : h('button', { class: 'btn alt', id: 'pause', onclick: () => pausar('Jogo pausado') }, 'Pausar'),
      !fim ? h('div', { class: 'seg', role: 'group', 'aria-label': 'Velocidade' }, VELS.map(([t, v]) => h('button', { type: 'button', 'aria-pressed': jg.vel === v ? 'true' : 'false', onclick: () => { jg.vel = v; if (!jg.pausado) iniciarTimer(); K.render(); } }, t))) : null,
      !fim ? h('button', { class: 'btn alt sm', id: 'pular', onclick: () => { K.jogoParar(); GM.completarDia(G.g); jg.pausado = true; jg.aviso = 'Fim de jogo'; K.render(); } }, 'Pular para o fim') : null,
      !fim && jg.pausado && P && live.min > 0 ? h('button', { class: 'btn alt sm', id: 'subs', onclick: () => { jg.painel = !jg.painel; K.render(); } }, jg.painel ? 'Fechar substituições' : 'Substituições e tática') : null);

    const campo = P ? h('section', { class: 'jmain' },
      h('div', { class: 'placar' }, h('span', { class: 'tn' + (lado === 0 ? ' eu' : '') }, nome(P.jogo.casa), K.escudo(P.jogo.casa, true)), h('span', { class: 'sc' }, REFS.pl0, h('i', null, '×'), REFS.pl1), h('span', { class: 'tn r' + (lado === 1 ? ' eu' : '') }, K.escudo(P.jogo.fora, true), nome(P.jogo.fora))),
      h('div', { class: 'javiso' + (live.min === 45 && jg.pausado ? ' intervalo' : ''), role: 'status' }, jg.aviso || (jg.pausado ? '' : 'Bola rolando'), live.min === 0 ? h('small', { class: 'muted' }, ' Tática e escalação já definidas na aba Escalação. Depois do apito inicial você pode pausar para mexer.') : null, P.jogo.perna === 'volta' ? h('small', { class: 'muted' }, ' Jogo de volta · ida: ' + P.jogo.confronto.ida[0] + ' × ' + P.jogo.confronto.ida[1] + ' (' + nome(P.jogo.confronto.a) + ' em casa)') : null),
      h('div', { class: 'publico', 'data-tip': 'Pessoas no estádio neste jogo.' }, h('b', { class: 'num' }, nf(P.publico)), ' pessoas · ' + nome(P.jogo.casa) + ' · ' + G.g.porId.get(P.jogo.casa).estadio.nome + ' (' + nf(G.g.porId.get(P.jogo.casa).estadio.capacidade) + ' lugares)'),
      h('div', { class: 'stats' }, stat('Posse de bola', 'posse'), stat('Chutes', 'chutes'), stat('No gol', 'no_gol'), stat('Faltas', 'faltas'), stat('Amarelos', 'amarelos'), stat('Vermelhos', 'vermelhos')),
      jg.painel ? painelSubs(P, lado) : null,
      h('h3', null, 'Lances'), REFS.feed) : h('p', null, 'Sem jogo seu neste dia.');

    const el = h('main', { class: 'wrap page jogo' },
      h('div', { class: 'jbar' }, h('div', null, h('span', { class: 'eyebrow' }, GM.fmtData(live.dia.data)), h('div', { class: 'jrot' }, P ? P.jogo.rotulo : '')), clockEl, ctrl),
      h('div', { class: 'jgrid' }, campo, h('div', { class: 'joutros' }, h('h3', { class: 'jtit' }, 'Todos os jogos agora'), outros)));
    if (P) pintarStats(P);
    setTimeout(iniciarTimer, 0);
    return el;
  };

  // ---------- painel de substituições (stamina e moral à vista) ----------
  function painelSubs(P, lado) {
    const jg = G.jg, side = P.m.S[lado], max = side.maxSubs;
    const cab = h('li', { class: 'sublinha cab' }, h('span', null, 'Pos'), h('span', null, 'Jogador'), h('span', { 'data-tip': K.TIPS.media }, 'Méd'), h('span', { 'data-tip': K.TIPS.stamina }, 'Stamina'), h('span', { 'data-tip': K.TIPS.moral }, 'Moral'));
    const linha = (p, tipo, j) => {
      const sel = tipo === 'out' ? jg.selOut === p.id : jg.selIn === p.id, ind = tipo === 'in' && p.lesao > 0;
      const cart = j && j.amarelos ? h('i', { class: 'cartao am', title: 'Amarelo' }) : null;
      return h('li', { class: 'sublinha' + (sel ? ' sel' : '') + (ind ? ' indisp' : ''), tabindex: ind ? -1 : 0, onclick: () => { if (ind) return; if (tipo === 'out') jg.selOut = p.id; else jg.selIn = p.id; K.render(); }, onkeydown: (e) => { if (e.key === 'Enter') e.currentTarget.click(); } },
        h('span', { class: 'pos' }, j ? j.slot : p.pos), h('span', { class: 'sn' }, p.nome, p.estrela ? K.estrela() : null, cart), h('b', { class: 'num' }, Math.round(PL.overall(p))), K.barraPct(p.stamina), K.barraPct(p.moral));
    };
    const ok = jg.selOut && jg.selIn && side.subs < max;
    const msg = side.subs >= max ? 'Limite de substituições atingido.' : (jg.msgSub || '');
    return h('div', { class: 'subpanel' },
      P.m.min === 45 ? h('div', { class: 'subform' }, h('b', null, 'Formação'), h('div', { class: 'seg', role: 'group', 'aria-label': 'Formação' }, Object.keys(M.FORMACOES).map((f) => h('button', { type: 'button', 'aria-pressed': (side.time.formacao || '4-4-2') === f ? 'true' : 'false', onclick: () => { const r = M.mudarFormacao(P.m, lado, f); jg.msgSub = r.ok ? '' : r.motivo; jg.selOut = jg.selIn = null; K.render(); } }, f))), h('small', { class: 'muted' }, 'A formação só pode mudar no intervalo.')) : null,
      h('div', { class: 'subtop' }, h('b', null, 'Substituições: ' + side.subs + ' de ' + max),
        h('div', { class: 'seg', role: 'group', 'aria-label': 'Tática' }, K.TATICAS.map(([k, t]) => h('button', { type: 'button', 'aria-pressed': side.time.tatica === k ? 'true' : 'false', 'data-tip': K.DESC_TATICA[k], onclick: () => { side.time.tatica = k; M.recalcular(P.m); K.render(); } }, t)))),
      h('div', { class: 'subcols' },
        h('div', null, h('h4', null, 'Em campo (sai)'), h('ul', { class: 'sublista' }, cab.cloneNode(true), side.campo.map((j) => linha(j.p, 'out', j)))),
        h('div', null, h('h4', null, 'Banco (entra)'), h('ul', { class: 'sublista' }, cab, side.banco.map((p) => linha(p, 'in'))))),
      h('div', { class: 'actions' }, h('button', { class: 'btn', id: 'confsub', disabled: !ok, onclick: () => { const r = M.substituirM(P.m, lado, jg.selOut, jg.selIn); jg.msgSub = r.ok ? '' : r.motivo; if (r.ok) { jg.selOut = jg.selIn = null; } K.render(); } }, 'Confirmar substituição'), h('span', { class: 'err' }, msg)));
  }

  // ---------- resumo ----------
  const notaCls = (n) => (n >= 8 ? 'n-alta' : n >= 6.6 ? 'n-boa' : n >= 5.5 ? 'n-media' : 'n-baixa');
  const resumoMud = (arr) => { const c = {}; arr.forEach((s) => { const a = s.slice(0, 3), d = s[3] === '+' ? 1 : -1; c[a] = (c[a] || 0) + d; }); return Object.entries(c).filter(([, v]) => v).map(([a, v]) => a + ' ' + (v > 0 ? '+' : '−') + Math.abs(v)).join(' · '); };
  const cartoes = (d) => [d.amarelos && !d.expulso ? h('i', { class: 'cartao am', title: 'Amarelo' }) : null, d.expulso ? h('i', { class: 'cartao vm', title: 'Expulso' }) : null];

  function tabelaNotas(det, titulo, eu) {
    const ord = det.slice().sort((a, b) => b.nota - a.nota);
    return h('div', null, h('h3', null, titulo),
      h('div', { class: 'tablewrap' }, h('table', { class: 'notas' },
        h('thead', null, h('tr', null, ['Nº', 'Jogador', 'Pos', 'Min', 'Nota', 'Gols', 'Ass', 'Des', 'Def', 'Falt', 'Cart', eu ? 'Evolução' : null, eu ? 'Moral' : null].filter(Boolean).map((t, i) => h('th', { class: i === 1 ? 'l' : '', style: 'cursor:default', 'data-tip': t === 'Des' ? 'Desarmes certos' : t === 'Def' ? 'Defesas do goleiro' : t === 'Ass' ? 'Assistências' : t === 'Falt' ? 'Faltas cometidas' : false }, t)))),
        h('tbody', null, ord.map((d) => h('tr', null,
          h('td', null, d.num), h('td', { class: 'l nm' }, d.nome), h('td', { class: 'pos' }, d.slot), h('td', null, d.minutos),
          h('td', null, h('span', { class: 'nota ' + notaCls(d.nota) }, d.nota.toFixed(1))),
          h('td', null, d.g || '·'), h('td', null, d.ast || '·'), h('td', null, d.desarmes || '·'), h('td', null, d.defesas || '·'), h('td', null, d.faltas || '·'), h('td', null, cartoes(d)),
          eu ? h('td', { class: 'evol' }, resumoMud(d.mudancas) || '·') : null,
          eu ? h('td', { class: 'num ' + (Math.round(d.moralDepois - d.moralAntes) > 0 ? 'hi' : Math.round(d.moralDepois - d.moralAntes) < 0 ? 'bad' : 'lo') }, (() => { const dm = Math.round(d.moralDepois - d.moralAntes); return dm > 0 ? '+' + dm : dm < 0 ? '−' + Math.abs(dm) : '0'; })()) : null))))));
  }

  // balanço financeiro do jogo para o clube do técnico
  function balanco(f, casa) {
    const lin = (rot, v, cls, tip) => h('div', { class: 'strow2 fin ' + (cls || ''), 'data-tip': tip || false }, h('span', null, rot), h('b', { class: 'num' }, (v < 0 ? '−' : '') + K.reais(Math.abs(v))));
    return h('div', { class: 'card balanco' }, h('h3', null, 'Balanço financeiro'),
      h('div', { class: 'eyebrow' }, 'Receitas'),
      casa ? lin('Bilheteria (' + nf(f.publico) + ' × R$ ' + f.ingresso + ')', f.bilheteria, 'rec') : lin('Bilheteria (jogo fora de casa)', 0, 'rec', 'A bilheteria fica com o clube mandante.'),
      lin('Cota de TV da rodada', f.tv, 'rec', 'Cota anual de TV dividida pelas 38 rodadas do Brasileirão. Jogos de Copa não pagam cota.'), lin('Patrocínio', f.patrocinio, 'rec', 'Patrocinadores ainda não implementados.'),
      h('div', { class: 'eyebrow' }, 'Despesas'),
      lin('Salários (' + f.dias + ' dias)', -f.salarios, 'des', 'Folha mensal dividida pelos dias desde o último jogo.'), lin('Despesas fixas', -f.fixas, 'des', 'Staff, manutenção, viagens e arbitragem (rateio anual por jogo).'), lin('Custos do jogo (15% da bilheteria)', -f.custosJogo, 'des', 'Segurança, impostos e arrecadação.'),
      lin('Saldo do jogo', f.saldo, f.saldo >= 0 ? 'saldo pos' : 'saldo neg'), lin('Caixa do clube', f.caixa, 'cx'));
  }

  K.telas.resumo = function () {
    const g = G.g, rs = G.resumos, R = rs.find((r) => r.humano[0] || r.humano[1]), lado = R.humano[0] ? 0 : 1;
    const eu = lado, adv = 1 - lado, [gh, ga] = R.placar, meus = lado === 0 ? gh : ga, deles = lado === 0 ? ga : gh;
    const res = meus > deles ? 'Vitória' : meus < deles ? 'Derrota' : 'Empate';
    const melhor = R.detalhes.flat().sort((a, b) => b.nota - a.nota)[0];
    const st = R.stats, linha = (rot, a, b) => h('div', { class: 'strow2' }, h('span', { class: 'num' }, a), h('small', null, rot), h('span', { class: 'num' }, b));
    const feed = h('ol', { class: 'feed estatico' }, R.eventos.filter((e) => ['gol', 'amarelo', 'vermelho', 'lesao', 'substituicao', 'formacao'].includes(e.tipo)).map((e) => eventoLinha(e, R)));
    const grupos = {};
    rs.filter((r) => r !== R).forEach((r) => { const k = r.jogo.comp === 'liga' ? K.DIV_NOME[r.jogo.div] : r.jogo.rotulo; (grupos[k] = grupos[k] || []).push(r); });
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, R.jogo.rotulo + ' · ' + GM.fmtData(g.data)), h('h2', null, res + ' · fim de jogo')),
      h('div', { class: 'placar grande' }, h('span', { class: 'tn' + (lado === 0 ? ' eu' : '') }, R.casaNome, K.escudo(R.jogo.casa, true)), h('span', { class: 'sc' }, h('b', { class: 'num' }, gh), h('i', null, '×'), h('b', { class: 'num' }, ga)), h('span', { class: 'tn r' + (lado === 1 ? ' eu' : '') }, K.escudo(R.jogo.fora, true), R.foraNome)),
      h('p', { class: 'publico', 'data-tip': 'Pessoas no estádio neste jogo.' }, h('b', { class: 'num' }, nf(R.publico)), ' pessoas no ' + g.porId.get(R.jogo.casa).estadio.nome),
      R.copa ? h('p', { class: 'copainfo' }, 'Agregado ' + R.copa.agregado[0] + ' × ' + R.copa.agregado[1] + (R.copa.penaltis ? ' · pênaltis ' + R.copa.penaltis[0] + ' × ' + R.copa.penaltis[1] : '') + ' · Classificado: ', h('b', null, nome(R.copa.vencedor)))
        : R.jogo.comp === 'copa' ? h('p', { class: 'copainfo' }, 'Jogo de ida. A volta será na casa de ' + nome(R.jogo.confronto.b) + '.') : null,
      h('div', { class: 'resgrid' },
        h('div', { class: 'card' }, h('h3', null, 'Estatísticas'), linha('Posse de bola', st[0].posse + '%', st[1].posse + '%'), linha('Chutes', st[0].chutes, st[1].chutes), linha('Chutes no gol', st[0].no_gol, st[1].no_gol), linha('Faltas', st[0].faltas, st[1].faltas), linha('Amarelos', st[0].amarelos, st[1].amarelos), linha('Vermelhos', st[0].vermelhos, st[1].vermelhos),
          h('p', { class: 'muted' }, 'Melhor em campo: ', h('b', null, melhor.nome + ' (' + melhor.nota.toFixed(1) + ')'))),
        h('div', { class: 'card' }, h('h3', null, 'Lances'), feed),
        balanco(R.financas[lado], lado === 0)),
      tabelaNotas(R.detalhes[eu], 'Seu time · notas e evolução', true),
      h('details', { class: 'det' }, h('summary', null, 'Notas do adversário'), tabelaNotas(R.detalhes[adv], nome(adv === 0 ? R.jogo.casa : R.jogo.fora), false)),
      h('details', { class: 'det' }, h('summary', null, 'Outros resultados do dia'),
        Object.entries(grupos).map(([t, arr]) => h('section', { class: 'jdiv' }, h('h3', null, t), h('ul', null, arr.map((r) => h('li', null, h('span', { class: 'tc' }, K.comEscudo(r.jogo.casa)), h('b', { class: 'num pl' }, r.placar[0] + ' × ' + r.placar[1]), h('span', { class: 'tf' }, K.comEscudo(r.jogo.fora)), h('small', { class: 'pub num' }, fmtPub(r.publico)))))))),
      h('div', { class: 'actions' }, h('button', { class: 'btn hot', id: 'continuar', onclick: () => { G.aba = 'plantel'; G.resumos = null; if (g.fim) K.ir('fim'); else K.ir(5); } }, g.fim ? 'Ver fim da temporada' : 'Continuar')));
  };

  // ---------- fim de temporada ----------
  K.telas.fim = function () {
    const g = G.g, cl = GM.classificacao(g), c = K.clubeHumano(), pos = cl[c.div].indexOf(c.id) + 1;
    const nm = (id) => g.porId.get(id).nome, lista = (ids) => ids.map(nm).join(', ');
    const faixa = c.div !== 'A' && pos <= 4 ? 'Seu clube subiu de divisão!' : c.div !== 'D' && pos > 16 ? 'Seu clube foi rebaixado.' : 'Seu clube permanece na ' + K.DIV_NOME[c.div] + '.';
    const mov = [['A', 'B'], ['B', 'C'], ['C', 'D']].map(([s, i]) => h('div', { class: 'rule' }, h('b', null, K.DIV_NOME[s] + ' × ' + K.DIV_NOME[i]), h('span', null, 'Sobem: ' + lista(cl[i].slice(0, 4))), h('span', null, 'Descem: ' + lista(cl[s].slice(-4)))));
    return h('main', { class: 'wrap page' },
      h('div', { class: 'head' }, h('span', { class: 'eyebrow' }, 'Temporada ' + g.ano), h('h2', null, 'Fim da temporada'), h('p', null, faixa + ' ' + c.nome + ' terminou em ' + pos + 'º na ' + K.DIV_NOME[c.div] + '.')),
      h('div', { class: 'rules' }, ['A', 'B', 'C', 'D'].map((d) => h('div', { class: 'rule' }, h('b', null, 'Campeão ' + K.DIV_NOME[d]), h('span', null, nm(cl[d][0])))), h('div', { class: 'rule' }, h('b', null, 'Copa do Brasil'), h('span', null, g.copa.campeao ? nm(g.copa.campeao) : '—'))),
      h('h3', null, 'Acesso e descenso'), h('div', { class: 'rules' }, mov),
      h('div', { class: 'actions' }, h('button', { class: 'btn alt', onclick: () => { G.aba = 'tabela'; G.tabDiv = c.div; K.ir(5); } }, 'Ver a tabela final'),
        h('button', { class: 'btn hot', id: 'nova', onclick: () => { GM.virarTemporada(g); G.tabDiv = null; G.aba = 'plantel'; G.sel = null; K.ir(5); } }, 'Começar a temporada ' + (g.ano + 1))));
  };
})();
