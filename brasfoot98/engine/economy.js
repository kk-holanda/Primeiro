// Economia: valor de mercado, salário, bilheteria, estádio e patrocínio. Valores em R$ de 1998.
(function (root) {
  const bf = (root.BF98 = root.BF98 || {});
  const P = () => bf.Players;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  // valor: ovr 40 -> ~15 mil | 55 -> ~120 mil | 65 -> ~500 mil | 75 -> ~2 mi | 85 -> ~8 mi | 95 -> ~33 mi
  function fatorIdade(i) { return i <= 20 ? 1.35 : i <= 23 ? 1.2 : i <= 27 ? 1.0 : i <= 30 ? 0.8 : i <= 33 ? 0.5 : 0.3; }
  function valorMercado(p) {
    const ovr = P().overall(p);
    const v = 15000 * Math.exp((ovr - 40) * 0.14) * fatorIdade(p.idade);
    return Math.round(v / 1000) * 1000;
  }
  // salário mensal: 1,2% do valor, piso R$ 500 (13 pagamentos/ano)
  function salario(p) { return Math.max(500, Math.round(valorMercado(p) * 0.012 / 100) * 100); }
  // custos fixos anuais (staff, manutenção, viagens, arbitragem): R$/temporada
  const CUSTO_FIXO = { A: 3_500_000, B: 600_000, C: 150_000, D: 30_000 };
  const folhaMensal = (elenco) => elenco.reduce((s, p) => s + salario(p), 0);

  // público: demanda do clube * forma recente * preço; limitado pela capacidade
  // forma: -1..+1 (últimos 5 jogos). rival: 1.0 normal, 1.25 clássico.
  function publico(clube, forma = 0, rival = 1, precoRelativo = 1) {
    const d = clube.demanda * (1 + 0.35 * forma) * rival * Math.pow(precoRelativo, -0.8);
    return Math.round(clamp(d, clube.estadio.capacidade * 0.03, clube.estadio.capacidade));
  }
  const rendaJogo = (clube, ...a) => publico(clube, ...a) * clube.precoIngresso * 0.85; // 15% de custos de jogo/imposto

  // ampliar estádio: +N lugares custa R$ 400 por lugar (obra de 1998), nível máx. 5 (+60%)
  const CUSTO_LUGAR = 400;
  function ampliar(clube, lugares) {
    const custo = lugares * CUSTO_LUGAR;
    if (clube.caixa < custo) return { ok: false, custo };
    clube.caixa -= custo; clube.estadio.capacidade += lugares; clube.estadio.nivel++;
    return { ok: true, custo };
  }

  // patrocínio: valor = valorBase * fator(prestígio, divisão). Série D paga ~1-2% do que paga a A.
  const FATOR_DIV = { A: 1, B: 0.25, C: 0.08, D: 0.025 };
  function valorPatrocinio(spons, clube) {
    if (clube.prestigio < spons.minPrestigio) return 0;
    const f = FATOR_DIV[clube.div] * (0.3 + clube.prestigio / 100 * 0.9);
    return Math.round(spons.valorBase * f / 1000) * 1000;
  }
  // valida contratação: máx. 2 e sem repetir categoria
  function podePatrocinar(clube, spons) {
    const atuais = clube.patrocinadores || [];
    if (atuais.length >= 2) return { ok: false, motivo: 'Clube já tem 2 patrocinadores' };
    if (atuais.some((s) => s.categoria === spons.categoria)) return { ok: false, motivo: 'Já existe patrocinador da categoria ' + spons.categoria };
    if (clube.prestigio < spons.minPrestigio) return { ok: false, motivo: 'Clube pequeno demais para este patrocinador' };
    return { ok: true };
  }
  // chance de aceitar a proposta: cresce com desempenho (posição na tabela 0..1, 1=líder)
  const chanceAceite = (clube, spons, desempenho) => clamp(0.25 + 0.5 * desempenho + (clube.prestigio - spons.minPrestigio) / 200, 0.05, 0.95);

  bf.Economy = { valorMercado, salario, folhaMensal, publico, rendaJogo, ampliar, valorPatrocinio, podePatrocinar, chanceAceite, CUSTO_FIXO, FATOR_DIV, CUSTO_LUGAR };
})(typeof globalThis !== 'undefined' ? globalThis : this);
