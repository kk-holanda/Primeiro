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
  // descrições mostradas ao passar o mouse
  K.TIPS = {
    RIT: 'Ritmo: velocidade de deslocamento (aceleração e pique).',
    CHU: 'Chute: precisão e força de finalização, posicionamento de ataque e pênaltis.',
    PAS: 'Passe: qualidade dos passes curtos e longos, visão de jogo e cruzamentos.',
    DRI: 'Drible: agilidade, equilíbrio, reações, controle de bola e condução.',
    DEF: 'Defesa: marcação, combatividade (carrinho) e precisão no desarme. Para o goleiro, reflexo e defesas.',
    FIS: 'Físico: impulsão, fôlego, força e agressividade. Quanto maior, menos o jogador se cansa.',
    media: 'Média: nota geral do jogador na sua posição, calculada a partir dos 6 atributos.',
    disc: 'Disciplina: de Fair player (quase não faz falta) a Macetador (faz muitas faltas e leva muitos cartões).',
    stamina: 'Stamina: condição física. Cai durante o jogo (mais rápido com Físico baixo) e volta com o descanso. Baixa, derruba o rendimento.',
    moral: 'Moral: confiança do jogador. Sobe com boas atuações e, quanto mais alta, mais fácil evoluir os atributos.',
    sit: 'Situação: lesionado (jogos que faltam) ou suspenso.',
    contrato: 'Contrato: o jogador pertence ao clube até o fim deste mês.',
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
})();
