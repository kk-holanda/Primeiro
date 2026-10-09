// Janelas de ação sobre um jogador: Vender, Leiloar, Renovar e Treinar.
(function () {
  const K = window.K, BF = window.BF98, h = K.h, MK = BF.Mercado, E = BF.Economy, PL = BF.Players, GM = BF.Game, G = K.G, reais = K.reais;
  const D = (K.dialogos = {});
  const valor = (el) => Math.max(0, parseInt(String(el.value).replace(/\D/g, ''), 10) || 0);
  const refresh = () => K.render();
  const resumo = (p) => h('div', { class: 'mj' }, K.bandeira(p.nac), h('b', null, p.nome), p.estrela ? K.estrela() : null, h('span', { class: 'muted' }, ' · ' + p.pos + ' · ' + p.idade + ' anos · Média ' + Math.round(PL.overall(p))));
  const campoMoeda = (id, rot, v, dica) => h('label', { class: 'campo', for: id }, h('span', null, rot), h('div', { class: 'moeda' }, h('i', null, 'R$'), h('input', { id, type: 'text', inputmode: 'numeric', value: String(v), autocomplete: 'off' })), dica ? h('small', { class: 'muted' }, dica) : null);

  // leilão animado: o resultado já foi calculado e aplicado; aqui só se mostra a disputa lance a lance
  function animar(m, res, p, aoFim) {
    const lista = h('ol', { class: 'leilao' }), fim = h('div', { class: 'actions' });
    m.corpo.replaceChildren(resumo(p), lista, fim);
    let i = 0;
    const t = setInterval(() => {
      if (!document.body.contains(m.caixa)) { clearInterval(t); return; }
      const r = res.rodadas[i++]; lista.append(h('li', { class: 'l-' + r.tipo }, r.clube ? K.escudo(r.clube) : null, h('span', null, r.texto))); lista.lastChild.scrollIntoView({ block: 'nearest' });
      if (i >= res.rodadas.length) { clearInterval(t); fim.append(h('button', { class: 'btn hot', id: 'fechar-leilao', onclick: m.fechar }, 'Fechar')); }
    }, 650);
  }

  // ---------- VENDER ----------
  D.vender = (c, p) => {
    const v = E.valorMercado(p), tx = MK.multa(G.g, p);
    const err = h('p', { class: 'err', role: 'alert' }), est = h('p', { class: 'estimativa' });
    const campo = campoMoeda('preco', 'Preço pedido', Math.round(v / 1000) * 1000 || v, 'Valor de mercado: ' + reais(v));
    const input = campo.querySelector('input');
    const atualiza = () => { const f = MK.chanceDeProposta(valor(input), v); est.textContent = 'Chance de aparecerem propostas: ' + (f >= 0.8 ? 'alta' : f >= 0.45 ? 'média' : f >= 0.15 ? 'baixa' : f > 0 ? 'muito baixa' : 'nenhuma'); };
    input.addEventListener('input', atualiza); atualiza();
    const m = K.modal('Vender ' + p.nome, [resumo(p),
      h('p', null, 'O jogador fica à venda pelo preço que você definir e sai quando algum clube cobrir o valor. A venda não acontece na hora.'),
      tx ? h('p', { class: 'nota-multa' }, 'Contrato ativo até ' + GM.fimContrato(G.g, p) + ': quem comprar também paga a multa de ', h('b', null, reais(tx)), ', que vai para o seu clube.') : null,
      p.aVenda ? h('p', { class: 'venda' }, 'Já está à venda por ' + reais(p.aVenda.preco) + '.') : null,
      campo, est, err,
      h('div', { class: 'actions' },
        h('button', { class: 'btn', id: 'confvender', onclick: () => { const r = MK.colocarAVenda(G.g, c, p, valor(input)); if (!r.ok) { err.textContent = r.motivo; return; } m.fechar(); refresh(); } }, p.aVenda ? 'Atualizar preço' : 'Colocar à venda'),
        p.aVenda ? h('button', { class: 'btn alt', onclick: () => { MK.retirarVenda(p); m.fechar(); refresh(); } }, 'Retirar da lista') : null,
        h('button', { class: 'btn alt', onclick: () => m.fechar() }, 'Cancelar'))]);
  };

  // ---------- LEILOAR ----------
  D.leiloar = (c, p) => {
    const v = E.valorMercado(p), tx = MK.multa(G.g, p), err = h('p', { class: 'err', role: 'alert' });
    const campo = campoMoeda('inicial', 'Preço inicial do leilão', Math.round(v * 0.5 / 1000) * 1000, 'Valor de mercado: ' + reais(v) + '. Pode ser R$ 0.');
    const m = K.modal('Leiloar ' + p.nome, [resumo(p),
      h('p', null, 'O jogador é colocado em leilão agora. Os clubes dão lances a partir do preço inicial e o maior lance leva o jogador.'),
      tx ? h('p', { class: 'nota-multa' }, 'Contrato ativo até ' + GM.fimContrato(G.g, p) + ': o clube vencedor também paga a multa de ', h('b', null, reais(tx)), ', que vai para o seu clube.') : null,
      campo, err,
      h('div', { class: 'actions' },
        h('button', { class: 'btn', id: 'abrirleilao', onclick: () => { const r = MK.leiloar(G.g, c, p, valor(campo.querySelector('input'))); if (!r.ok) { err.textContent = r.motivo; return; } animar(m, r, p); } }, 'Abrir leilão'),
        h('button', { class: 'btn alt', onclick: () => m.fechar() }, 'Cancelar'))], { aoFechar: refresh });
  };

  // ---------- RENOVAR ----------
  D.renovar = (c, p) => {
    const opcoes = MK.opcoesRenovacao(G.g); let sel = 1, resposta = null; const err = h('p', { class: 'err', role: 'alert' });
    const m = K.modal('Renovar contrato de ' + p.nome, h('div'), { aoFechar: refresh });
    const desenha = () => {
      const salInput = h('input', { id: 'salario', type: 'text', inputmode: 'numeric', value: String(m.salario || E.salario(p)), autocomplete: 'off' });
      salInput.addEventListener('input', () => { m.salario = valor(salInput); });
      const cartoes = h('div', { class: 'opcoes', role: 'radiogroup', 'aria-label': 'Duração' }, opcoes.map((o, i) => h('button', { type: 'button', role: 'radio', 'aria-checked': sel === i ? 'true' : 'false', class: 'opcao' + (sel === i ? ' on' : ''), disabled: !!resposta, onclick: () => { sel = i; desenha(); } },
        h('small', null, o.rotulo), h('b', null, o.meses + ' meses'), h('span', { class: 'muted' }, 'até ' + GM.fimContrato({ data: GM.addMeses(p.contratoAte, o.meses) }, { contratoAte: GM.addMeses(p.contratoAte, o.meses) })))));
      const corpo = [resumo(p),
        h('dl', { class: 'kv' }, h('dt', null, 'Contrato atual até'), h('dd', null, GM.fimContrato(G.g, p)), h('dt', null, 'Salário atual'), h('dd', null, reais(E.salario(p)) + '/mês'), h('dt', null, 'Referência de mercado'), h('dd', null, reais(E.salarioBase(p)) + '/mês'), h('dt', null, 'Moral do jogador'), h('dd', null, Math.round(p.moral) + '%')),
        h('div', { class: 'eyebrow' }, 'Duração da renovação (somada ao fim do contrato atual)'), cartoes];
      if (!resposta) {
        corpo.push(h('label', { class: 'campo', for: 'salario' }, h('span', null, 'Salário oferecido por mês'), h('div', { class: 'moeda' }, h('i', null, 'R$'), salInput)), err,
          h('div', { class: 'actions' },
            h('button', { class: 'btn', id: 'oferecer', onclick: () => {
              const sal = valor(salInput), o = opcoes[sel]; if (sal < 500) { err.textContent = 'Informe um salário de pelo menos R$ 500.'; return; }
              const r = MK.negociar(G.g, p, sal, o.meses);
              if (r.resultado === 'aceita') { MK.aplicarRenovacao(G.g, p, sal, o.meses); m.fechar(); return; }
              resposta = { ...r, meses: o.meses }; desenha();
            } }, 'Oferecer contrato'),
            h('button', { class: 'btn alt', onclick: () => m.fechar() }, 'Cancelar')));
      } else {
        corpo.push(h('div', { class: 'resposta' }, h('p', null, h('b', null, p.nome), resposta.firme ? ' recusou a proposta. Só aceita ' : ' pediu mais: ', h('b', null, reais(resposta.pedido) + ' por mês'), ' por ' + resposta.meses + ' meses.'),
          h('p', { class: 'muted' }, 'Se você não aceitar o salário pedido, ele vai para leilão imediatamente, com preço inicial de R$ 0.')),
          h('div', { class: 'actions' },
            h('button', { class: 'btn', id: 'aceitarpedido', onclick: () => { MK.aplicarRenovacao(G.g, p, resposta.pedido, resposta.meses); m.fechar(); } }, 'Aceitar ' + reais(resposta.pedido)),
            h('button', { class: 'btn alt', id: 'recusarpedido', onclick: () => { const r = MK.leiloar(G.g, c, p, 0); if (!r.ok) { resposta = null; err.textContent = r.motivo; desenha(); return; } animar(m, r, p); } }, 'Recusar e leiloar por R$ 0')));
      }
      m.corpo.replaceChildren(...corpo);
    };
    desenha();
  };

  // ---------- TREINAR ----------
  D.treinar = (c, p) => {
    let tipo = 'corrida', n = 2; const err = h('p', { class: 'err', role: 'alert' }), C = MK.TREINO_CFG;
    const m = K.modal('Treinar ' + p.nome, h('div'));
    const desenha = () => {
      const seg = h('div', { class: 'seg', role: 'group', 'aria-label': 'Jogos de ausência' }, [1, 2, 3].map((k) => h('button', { type: 'button', 'aria-pressed': n === k ? 'true' : 'false', onclick: () => { n = k; desenha(); } }, k + (k === 1 ? ' jogo' : ' jogos'))));
      const cards = h('div', { class: 'treinos' }, Object.entries(MK.TREINOS).map(([k, t]) => {
        const e = MK.ganhoEsperado(p, t.attr, n);
        return h('button', { type: 'button', class: 'treino-card' + (tipo === k ? ' on' : ''), 'aria-pressed': tipo === k ? 'true' : 'false', onclick: () => { tipo = k; desenha(); } },
          h('b', null, t.nome), h('span', { class: 'muted' }, K.ATTR_NOME[t.attr] + ' ' + p.attr[t.attr]), h('span', { class: 'ganho' }, '+' + e.toFixed(1) + ' esperado'));
      }));
      m.corpo.replaceChildren(resumo(p),
        h('p', null, 'O jogador fica fora das próximas partidas para treinar um atributo. Quanto mais jogos fora, maior o ganho, mas maior o custo de moral.'),
        h('div', { class: 'eyebrow' }, 'Quantos jogos fora'), seg, h('div', { class: 'eyebrow' }, 'Tipo de treino'), cards,
        h('ul', { class: 'efeitos' },
          h('li', null, 'Fora dos próximos ', h('b', null, n + (n === 1 ? ' jogo' : ' jogos'))),
          h('li', null, 'Moral: ', h('b', { class: 'bad' }, '−' + C.moralPorJogo * n)), h('li', null, 'Stamina: ', h('b', { class: 'hi' }, '+' + C.staminaPorJogo * n)),
          h('li', { class: 'muted' }, 'O ganho depende da idade, do valor atual do atributo (quanto mais alto, mais difícil) e da moral. Depois de treinar, o jogador descansa ' + C.cooldown + ' jogos antes de poder treinar de novo. Máximo de ' + C.maxSimultaneo + ' jogadores treinando juntos.')),
        err,
        h('div', { class: 'actions' },
          h('button', { class: 'btn', id: 'conftreino', onclick: () => { const r = MK.iniciarTreino(G.g, c, p, tipo, n); if (!r.ok) { err.textContent = r.motivo; return; } m.fechar(); refresh(); } }, 'Começar treino'),
          h('button', { class: 'btn alt', onclick: () => m.fechar() }, 'Cancelar')));
    };
    desenha();
  };
})();
