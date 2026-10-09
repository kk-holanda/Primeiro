// Utilidades da interface: criação de elementos, formatação, barras, descrições (tooltip).
(function () {
  const K = (window.K = window.K || {});
  const BF = window.BF98, PR = BF.Progression;
  // estado único da interface (G) e registro de telas, compartilhados por todos os arquivos ui/*.js
  K.G = { tela: 1, aba: 'plantel', config: { maxSubs: 3 }, humanos: [], seed: 0, g: null, nome: '', erro: '', sorteando: false, sel: null, sort: { k: 'pos', dir: 1 } };
  K.telas = {};
  K.h = function h(tag, attrs, ...kids) {
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
  };
  const nf = (K.nf = new Intl.NumberFormat('pt-BR'));
  K.reais = (n) => {
    if (n >= 1e6) return 'R$ ' + (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace('.', ',') + ' mi';
    if (n >= 1e4) return 'R$ ' + Math.round(n / 1000) + ' mil';
    if (n >= 1e3) return 'R$ ' + (n / 1e3).toFixed(1).replace('.', ',') + ' mil';
    return 'R$ ' + nf.format(Math.round(n));
  };
  K.DIV_NOME = BF.Game.DIV_NOME;
  K.ORDEM_POS = ['GOL', 'LD', 'ZAG', 'LIB', 'LE', 'VOL', 'MC', 'MEI', 'ALA', 'PD', 'PE', 'SA', 'CA'];
  K.SETOR = { GOL: 'Goleiros', ZAG: 'Defensores', LIB: 'Defensores', LD: 'Defensores', LE: 'Defensores', VOL: 'Meio-campistas', MC: 'Meio-campistas', MEI: 'Meio-campistas', ALA: 'Meio-campistas', PD: 'Atacantes', PE: 'Atacantes', CA: 'Atacantes', SA: 'Atacantes' };
  K.ATTRS = ['RIT', 'CHU', 'PAS', 'DRI', 'DEF', 'FIS'];
  K.PE_NOME = { D: 'Direito', E: 'Esquerdo', A: 'Ambidestro' };
  K.PE_SIGLA = { D: 'Dir', E: 'Esq', A: 'Amb' };
  K.metros = (cm) => (cm / 100).toFixed(2).replace('.', ',');
  K.ATTR_NOME = { RIT: 'Ritmo', CHU: 'Finalização', PAS: 'Passe', DRI: 'Drible', DEF: 'Defesa', FIS: 'Físico' };
  K.ATTR_SIGLA = { RIT: 'Rit', CHU: 'Fin', PAS: 'Pas', DRI: 'Dri', DEF: 'Def', FIS: 'Fís' };
  // descrições mostradas ao passar o mouse
  K.TIPS = {
    RIT: 'Ritmo: velocidade de deslocamento (aceleração e pique).',
    CHU: 'Finalização: precisão e força do chute, posicionamento de ataque, pênaltis e jogo de cabeça (o cabeceio também depende da impulsão do Físico).',
    PAS: 'Passe: qualidade dos passes curtos e longos, visão de jogo e cruzamentos.',
    DRI: 'Drible: agilidade, equilíbrio, reações, controle de bola e condução.',
    DEF: 'Defesa: marcação, combatividade (carrinho) e precisão no desarme. Para o goleiro, reflexo e defesas.',
    FIS: 'Físico: impulsão (ajuda no cabeceio), fôlego, força e agressividade. Quanto maior, menos o jogador se cansa.',
    media: 'Média: nota geral do jogador na sua posição, calculada a partir dos 6 atributos.',
    disc: 'Disciplina: de Fair player (quase não faz falta) a Macetador (faz muitas faltas e leva muitos cartões).',
    stamina: 'Stamina: condição física. Cai durante o jogo (mais rápido com Físico baixo) e volta com o descanso. Baixa, derruba o rendimento.',
    moral: 'Moral: confiança do jogador. Sobe com boas atuações e, quanto mais alta, mais fácil evoluir os atributos.',
    sit: 'Situação: lesionado (jogos que faltam) ou suspenso.',
    contrato: 'Contrato: o jogador pertence ao clube até o fim deste mês.',
    nac: 'Nacionalidade do jogador.',
    pe: 'Pé preferido: Dir (direito), Esq (esquerdo) ou Amb (ambidestro).',
    altura: 'Altura do jogador, em metros.',
    peso: 'Peso do jogador, em quilos.',
    estrela: 'Estrela: um dos melhores jogadores do campeonato.',
    salario: 'Salário mensal pago pelo clube.',
    valor: 'Valor de mercado do jogador.',
  };
  // barra colorida pela porcentagem: verde (≥90), verde-claro (70-89), amarelo (50-69), laranja (20-49), vermelho (<20)
  K.barra = (v, cls) => K.h('span', { class: 'bar ' + (cls || ''), role: 'img', 'aria-label': Math.round(v) + '%' }, K.h('i', { class: 'c-' + PR.cor(v), style: 'width:' + Math.max(2, Math.round(v)) + '%' }));
  K.barraPct = (v) => K.h('span', { class: 'barpct' }, K.barra(v), K.h('b', { class: 'num' }, Math.round(v) + '%'));
  K.situacao = (p) => (p.lesao > 0 ? 'LES ' + p.lesao : p.suspenso > 0 ? 'SUSP' : '');

  // tooltip único, posicionado perto do elemento com data-tip (mouse e teclado)
  let tip;
  function mostrar(el) {
    if (!tip) { tip = K.h('div', { class: 'tooltip', role: 'tooltip' }); document.body.append(tip); }
    tip.textContent = el.getAttribute('data-tip'); tip.style.display = 'block';
    const r = el.getBoundingClientRect(), tw = tip.offsetWidth;
    let x = Math.min(Math.max(8, r.left + r.width / 2 - tw / 2), window.innerWidth - tw - 8);
    let y = r.bottom + 8; if (y + tip.offsetHeight > window.innerHeight - 8) y = r.top - tip.offsetHeight - 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px';
  }
  const esconder = () => { if (tip) tip.style.display = 'none'; };
  document.addEventListener('mouseover', (e) => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el) mostrar(el); else esconder(); });
  document.addEventListener('focusin', (e) => { const el = e.target.closest && e.target.closest('[data-tip]'); if (el) mostrar(el); });
  document.addEventListener('focusout', esconder);
  document.addEventListener('scroll', esconder, true);
  document.addEventListener('click', esconder);

  // ---------- bandeiras (SVG simples) ----------
  const F = (inner) => '<svg viewBox="0 0 24 16" width="22" height="15" aria-hidden="true">' + inner + '</svg>';
  const H = (cs) => cs.map(([c, y, hgt]) => '<rect x="0" y="' + y + '" width="24" height="' + hgt + '" fill="' + c + '"/>').join('');
  const V = (cs) => cs.map(([c, x, w]) => '<rect y="0" x="' + x + '" width="' + w + '" height="16" fill="' + c + '"/>').join('');
  const FLAGS = {
    BRA: F('<rect width="24" height="16" fill="#009c3b"/><path d="M12 2.2 21.4 8 12 13.8 2.6 8z" fill="#ffdf00"/><circle cx="12" cy="8" r="3.4" fill="#002776"/>'),
    ARG: F(H([['#74acdf', 0, 5.4], ['#fff', 5.4, 5.3], ['#74acdf', 10.7, 5.3]]) + '<circle cx="12" cy="8" r="1.5" fill="#f6b40e"/>'),
    URU: F(H([['#fff', 0, 16]]) + [1, 3, 5].map((i) => '<rect y="' + (i * 1.78 - 0.9) + '" width="24" height="1.8" fill="#0038a8"/>').join('') + [7, 9].map((i) => '<rect y="' + (i * 1.78 - 0.9) + '" width="24" height="1.8" fill="#0038a8"/>').join('') + '<rect width="9" height="8.9" fill="#fff"/><circle cx="4.5" cy="4.4" r="2" fill="#fcd116"/>'),
    PAR: F(H([['#d52b1e', 0, 5.4], ['#fff', 5.4, 5.3], ['#0038a8', 10.7, 5.3]])),
    CHI: F(H([['#fff', 0, 8], ['#d52b1e', 8, 8]]) + '<rect width="8" height="8" fill="#0039a6"/><circle cx="4" cy="4" r="1.4" fill="#fff"/>'),
    COL: F(H([['#fcd116', 0, 8], ['#003893', 8, 4], ['#ce1126', 12, 4]])),
    PER: F(V([['#d91023', 0, 8], ['#fff', 8, 8], ['#d91023', 16, 8]])),
    EQU: F(H([['#ffdd00', 0, 8], ['#034ea2', 8, 4], ['#ed1c24', 12, 4]])),
    BOL: F(H([['#d52b1e', 0, 5.4], ['#f9e300', 5.4, 5.3], ['#007934', 10.7, 5.3]])),
    VEN: F(H([['#ffcc00', 0, 5.4], ['#00247d', 5.4, 5.3], ['#cf142b', 10.7, 5.3]])),
  };
  K.bandeira = (cod) => K.h('span', { class: 'flag', 'data-tip': PLN()[cod] || cod, tabindex: 0, html: FLAGS[cod] || '' });
  const PLN = () => BF.Players.NAC_NOME;
  K.estrela = () => K.h('span', { class: 'star', 'data-tip': K.TIPS.estrela, 'aria-label': 'Estrela', role: 'img' }, '★');
  // ---------- janela modal ----------
  K.modal = function (titulo, corpo, opts = {}) {
    const antes = document.activeElement;
    const fechar = () => { ov.remove(); document.removeEventListener('keydown', tecla); if (antes && antes.focus) antes.focus(); if (opts.aoFechar) opts.aoFechar(); };
    const tecla = (e) => { if (e.key === 'Escape') fechar(); };
    const caixa = K.h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': titulo }, K.h('header', null, K.h('h3', null, titulo), K.h('button', { class: 'x', 'aria-label': 'Fechar', onclick: fechar }, '×')), K.h('div', { class: 'mbody' }, corpo));
    const ov = K.h('div', { class: 'overlay', onclick: (e) => { if (e.target === ov) fechar(); } }, caixa);
    document.body.append(ov); document.addEventListener('keydown', tecla);
    const f = caixa.querySelector('input,button.btn'); if (f) f.focus();
    return { fechar, corpo: caixa.querySelector('.mbody'), caixa };
  };
})();
