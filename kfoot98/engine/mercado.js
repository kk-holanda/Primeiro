// Mercado do técnico: vender, leiloar, renovar contrato e treinar jogadores. Valores em R$ de 1998.
(function (root) {
  const bf = (root.BF98 = root.BF98 || {});
  const E = () => bf.Economy, PL = () => bf.Players, GM = () => bf.Game;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmt = (n) => (n >= 1e6 ? (n / 1e6).toFixed(2).replace('.', ',') + ' mi' : n >= 1e3 ? Math.round(n / 1e3) + ' mil' : String(Math.round(n)));
  const reais = (n) => 'R$ ' + fmt(n);
  const MIN_ELENCO = 18;

  function noticia(g, texto, tipo) { g.noticias.unshift({ data: g.data, texto, tipo: tipo || 'info' }); if (g.noticias.length > 40) g.noticias.pop(); }

  // ---------- contrato ----------
  const diasRestantes = (g, p) => GM().difDias(g.data, p.contratoAte);
  const mesesRestantes = (g, p) => Math.max(0, diasRestantes(g, p) / 30.4);
  const podeRenovar = (g, p) => diasRestantes(g, p) <= 92;      // últimos 3 meses
  // multa rescisória paga por quem compra o jogador com contrato ativo (vai para o clube vendedor)
  const multa = (g, p) => Math.round(0.4 * E().valorMercado(p) * Math.min(1, Math.max(0, diasRestantes(g, p)) / 365) / 1000) * 1000;

  // ---------- transferência ----------
  function dispensar(g, c) { // clube comprador com elenco cheio libera o pior jogador
    const top = new Set(c.elenco.slice().sort((a, b) => PL().overall(b) - PL().overall(a)).slice(0, 18).map((p) => p.id));
    const gks = c.elenco.filter((p) => p.pos === 'GOL').length;
    const pool = c.elenco.filter((p) => !top.has(p.id) && !(p.pos === 'GOL' && gks <= 2));
    if (!pool.length) return;
    const p = pool.sort((a, b) => E().valorMercado(a) - E().valorMercado(b))[0];
    c.elenco = c.elenco.filter((x) => x !== p); g.livres.push(p);
  }
  function numeroLivre(c) { const u = new Set(c.elenco.map((p) => p.num)); let n = 2; while (u.has(n)) n++; return n; }
  function transferir(g, p, de, para, preco, taxaMulta) {
    de.elenco = de.elenco.filter((x) => x !== p);
    p.aVenda = null; p.treino = null; p.num = numeroLivre(para); para.elenco.push(p);
    de.caixa += preco + taxaMulta; para.caixa -= preco + taxaMulta;
    if (para.elenco.length > 26 && !g.humanoIds.has(para.id)) dispensar(g, para);
  }
  const podeVender = (g, c, p) => (c.elenco.length <= MIN_ELENCO ? 'O elenco precisa ter pelo menos ' + MIN_ELENCO + ' jogadores.' : p.pos === 'GOL' && c.elenco.filter((x) => x.pos === 'GOL').length <= 2 ? 'Você precisa manter pelo menos 2 goleiros.' : null);

  // interesse de um clube em um jogador: quanto ele supera o 12º melhor do elenco do clube
  function interesse(c, p) { const o = c.elenco.map((x) => PL().overall(x)).sort((a, b) => b - a)[11] || 0; return PL().overall(p) - o; }

  // ---------- VENDER: preço fixo; o clube que cobrir o preço (+ multa) leva o jogador em algum jogo futuro ----------
  function colocarAVenda(g, c, p, preco) {
    const erro = podeVender(g, c, p); if (erro) return { ok: false, motivo: erro };
    if (!(preco > 0)) return { ok: false, motivo: 'Informe um preço maior que zero.' };
    p.aVenda = { preco: Math.round(preco), desde: g.data };
    return { ok: true };
  }
  const retirarVenda = (p) => { p.aVenda = null; };
  function chanceDeProposta(preco, valor) { const r = preco / valor; return r <= 0.7 ? 1 : r >= 1.6 ? 0 : r <= 1 ? 1 - (r - 0.7) * 1.5 : 0.55 - (r - 1) * 0.9; }
  function processarVendas(g) {
    for (const hid of g.humanoIds) {
      const c = g.porId.get(hid);
      for (const p of c.elenco.slice()) {
        if (!p.aVenda || podeVender(g, c, p)) continue;
        const f = chanceDeProposta(p.aVenda.preco, E().valorMercado(p));
        if (f <= 0 || !g.rng.chance(0.35 * f)) continue;
        const preco = p.aVenda.preco, tx = multa(g, p), tot = preco + tx;
        const cs = bf.Season.embaralhar(g.rng, g.clubes.filter((x) => !g.humanoIds.has(x.id) && x.caixa >= tot && interesse(x, p) >= -2 && x.prestigio >= c.prestigio - 30));
        if (!cs.length) continue;
        const b = cs[0]; transferir(g, p, c, b, preco, tx);
        noticia(g, p.nome + ' foi vendido ao ' + b.nome + ' por ' + reais(preco) + (tx ? ' + multa de ' + reais(tx) : '') + '.', 'venda');
      }
    }
  }

  // ---------- LEILOAR: leilão imediato; computador (e humanos, no multiplayer) dão lances ----------
  function leiloar(g, c, p, precoInicial) {
    const erro = podeVender(g, c, p); if (erro) return { ok: false, motivo: erro };
    if (!(precoInicial >= 0)) return { ok: false, motivo: 'Preço inicial inválido.' };
    const rng = g.rng, v = E().valorMercado(p), tx = multa(g, p), passo = Math.max(1000, Math.round(v * 0.04 / 1000) * 1000);
    const cands = [];
    for (const x of g.clubes) {
      if (x === c || g.humanoIds.has(x.id)) continue;
      const imp = interesse(x, p); if (imp < -3) continue;
      const teto = Math.min(v * (0.7 + rng.next() * 0.7) * (imp >= 3 ? 1.15 : imp >= 0 ? 1 : 0.8), x.caixa - tx);
      if (teto >= precoInicial + passo) cands.push({ c: x, teto });
    }
    const rodadas = [{ tipo: 'abertura', texto: 'Leilão aberto por ' + reais(precoInicial) + (tx ? ' (o comprador também paga a multa de ' + reais(tx) + ')' : '') + '.' }];
    let atual = precoInicial, lider = null, sem = 0;
    for (let r = 0; r < 16; r++) {
      const pool = bf.Season.embaralhar(rng, cands.filter((x) => x.c !== lider && x.teto >= atual + passo));
      let lances = 0;
      for (const x of pool) {
        if (!rng.chance(0.5)) continue;
        const val = Math.min(x.teto, atual + passo * rng.int(1, 2)); if (val <= atual) continue;
        atual = Math.round(val / 100) * 100; lider = x.c; lances++;
        rodadas.push({ tipo: 'lance', clube: x.c.id, valor: atual, texto: x.c.nome + ' oferece ' + reais(atual) + '.' });
        if (lances >= 2) break;
      }
      if (!lances) { sem++; if (sem >= 2) break; rodadas.push({ tipo: 'espera', texto: 'Ninguém cobre. Dou-lhe uma…' }); } else sem = 0;
    }
    if (!lider) { rodadas.push({ tipo: 'fim', texto: 'Sem ofertas. ' + p.nome + ' continua no clube.' }); return { ok: true, vendido: false, rodadas }; }
    rodadas.push({ tipo: 'fim', texto: 'Dou-lhe três! ' + p.nome + ' vendido ao ' + lider.nome + ' por ' + reais(atual) + (tx ? ' + multa ' + reais(tx) : '') + '.' });
    transferir(g, p, c, lider, atual, tx);
    noticia(g, p.nome + ' foi vendido em leilão ao ' + lider.nome + ' por ' + reais(atual) + (tx ? ' + multa de ' + reais(tx) : '') + '.', 'venda');
    return { ok: true, vendido: true, comprador: lider.id, preco: atual, multa: tx, rodadas };
  }

  // ---------- RENOVAR ----------
  function opcoesRenovacao(g) { const r = g.rng; return [['Curto', r.int(3, 6)], ['Médio', r.int(6, 9)], ['Máximo', r.int(9, 12)]].map(([rotulo, meses]) => ({ rotulo, meses })); }
  function salarioEsperado(p, meses) {
    let s = E().salarioBase(p) * (p.estrela ? 1.15 : 1) * (1.12 - 0.12 * p.moral / 50);
    if (meses >= 9 && p.idade <= 23) s *= 0.97;      // jovem gosta de contrato longo
    if (meses >= 9 && p.idade >= 31) s *= 1.04;      // veterano prefere curto
    return Math.max(500, Math.round(s / 100) * 100);
  }
  // resposta do jogador: 'aceita' | 'pede' (pede mais; o técnico aceita o pedido ou deixa ir a leilão por R$ 0)
  function negociar(g, p, salario, meses) {
    const esp = salarioEsperado(p, meses), r = salario / esp;
    if (r >= 1) return { resultado: 'aceita', esperado: esp };
    const pedido = Math.round(esp * (r >= 0.85 ? 1 + g.rng.next() * 0.04 : 1.05 + g.rng.next() * 0.1) / 100) * 100;
    return { resultado: 'pede', pedido, esperado: esp, firme: r < 0.85 };
  }
  function aplicarRenovacao(g, p, salario, meses) {
    p.contratoAte = GM().addMeses(p.contratoAte, meses); p.salario = Math.round(salario / 100) * 100; p.moral = Math.min(100, p.moral + 3);
    p.avisos = 0; noticia(g, p.nome + ' renovou até ' + GM().fimContrato(g, p) + ' (salário ' + reais(p.salario) + ').', 'contrato');
  }

  // processa contratos vencidos e avisa os do técnico. Computador renova sozinho; humano perde o jogador.
  function processarContratos(g) {
    for (const c of g.clubes) {
      const humano = g.humanoIds.has(c.id);
      for (const p of c.elenco.slice()) {
        const d = diasRestantes(g, p);
        if (d < 0) {
          if (!humano) { p.contratoAte = GM().addMeses(g.data, g.rng.int(9, 15)); p.salario = E().salarioBase(p); }
          else { c.elenco = c.elenco.filter((x) => x !== p); g.livres.push(p); p.aVenda = null; p.treino = null; noticia(g, 'O contrato de ' + p.nome + ' terminou e ele deixou o clube.', 'contrato'); }
        } else if (humano) {
          if (d <= 92 && !(p.avisos >= 1)) { p.avisos = 1; noticia(g, 'O contrato de ' + p.nome + ' vence em ' + GM().fimContrato(g, p) + '. Já é possível renovar.', 'contrato'); }
          else if (d <= 30 && p.avisos < 2) { p.avisos = 2; noticia(g, 'Atenção: o contrato de ' + p.nome + ' vence em menos de 30 dias.', 'alerta'); }
        }
      }
      if (humano && c.elenco.length < 20) gerarJuniores(g, c, 20 - c.elenco.length);
    }
  }
  function gerarJuniores(g, c, n) {
    const have = (pos) => c.elenco.filter((p) => p.pos === pos).length;
    const need = ['GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MC', 'MEI', 'PD', 'PE', 'CA', 'SA'];
    for (let i = 0; i < n; i++) {
      const pos = need.slice().sort((a, b) => have(a) - have(b))[0];
      const p = PL().gerarJogador(g.rng, pos, PL().nivelDoClube(c.prestigio) - 5, g.rng.int(17, 19), undefined, 'BRA');
      p.contratoAte = GM().addMeses(g.data, g.rng.int(12, 18)); p.salario = E().salarioBase(p); p.num = numeroLivre(c); p.stamina = 100;
      c.elenco.push(p);
    }
    noticia(g, n + ' jogador(es) da base subiram para completar o elenco.', 'info');
  }

  // ---------- TREINAR ----------
  const TREINOS = {
    corrida: { attr: 'RIT', nome: 'Treino de corrida' }, finalizacao: { attr: 'CHU', nome: 'Treino de finalização' }, passes: { attr: 'PAS', nome: 'Treino de passes' },
    tecnico: { attr: 'DRI', nome: 'Treino técnico' }, defesa: { attr: 'DEF', nome: 'Treino de defesa' }, forca: { attr: 'FIS', nome: 'Treino de força' },
  };
  const TREINO_CFG = { moralPorJogo: 4, staminaPorJogo: 12, cooldown: 4, maxSimultaneo: 3,
    fatorAttr: { RIT: 0.7, CHU: 0.9, PAS: 0.9, DRI: 0.9, DEF: 0.9, FIS: 0.8 } };
  const baseIdade = (i) => (i <= 20 ? 0.9 : i <= 24 ? 0.75 : i <= 28 ? 0.55 : i <= 31 ? 0.3 : 0.12);
  // pontos esperados: jogos × idade × atributo × retorno decrescente × moral
  function ganhoEsperado(p, attr, n) {
    const rd = clamp((92 - p.attr[attr]) / 50, 0.15, 1.1), m = 0.75 + 0.5 * (p.moral / 100);
    return n * baseIdade(p.idade) * TREINO_CFG.fatorAttr[attr] * rd * m;
  }
  function iniciarTreino(g, c, p, tipo, n) {
    if (!TREINOS[tipo] || !(n >= 1 && n <= 3)) return { ok: false, motivo: 'Escolha o treino e de 1 a 3 jogos.' };
    if (p.treino) return { ok: false, motivo: 'Já está em treino.' };
    if (p.lesao > 0) return { ok: false, motivo: 'Lesionado não pode treinar.' };
    if (p.treinoCd > 0) return { ok: false, motivo: 'Descansando do último treino (mais ' + p.treinoCd + ' jogo(s)).' };
    if (c.elenco.filter((x) => x.treino).length >= TREINO_CFG.maxSimultaneo) return { ok: false, motivo: 'No máximo ' + TREINO_CFG.maxSimultaneo + ' jogadores treinando ao mesmo tempo.' };
    p.treino = { tipo, attr: TREINOS[tipo].attr, restante: n, total: n };
    return { ok: true };
  }
  function concluirTreino(g, c, p) {
    const t = p.treino, e = ganhoEsperado(p, t.attr, t.total), ganho = Math.floor(e) + (g.rng.next() < e - Math.floor(e) ? 1 : 0);
    p.attr[t.attr] = Math.min(99, p.attr[t.attr] + ganho);
    p.moral = Math.max(0, p.moral - TREINO_CFG.moralPorJogo * t.total);
    p.stamina = Math.min(100, p.stamina + TREINO_CFG.staminaPorJogo * t.total);
    p.treinoCd = TREINO_CFG.cooldown; p.treino = null;
    noticia(g, p.nome + ' voltou do ' + TREINOS[t.tipo].nome.toLowerCase() + ': ' + (ganho ? t.attr + ' +' + ganho : 'sem evolução desta vez') + '.', 'treino');
    return ganho;
  }

  bf.Mercado = { reais, noticia, diasRestantes, mesesRestantes, podeRenovar, multa, transferir, podeVender, colocarAVenda, retirarVenda, chanceDeProposta, processarVendas, leiloar, opcoesRenovacao, salarioEsperado, negociar, aplicarRenovacao, processarContratos, gerarJuniores, TREINOS, TREINO_CFG, ganhoEsperado, iniciarTreino, concluirTreino, MIN_ELENCO };
})(typeof globalThis !== 'undefined' ? globalThis : this);
