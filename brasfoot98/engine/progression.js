// Evolução pós-jogo: nota + moral + idade => pontos de experiência por atributo; fadiga e recuperação.
(function (root) {
  const bf = (root.BF98 = root.BF98 || {});
  const P = () => bf.Players;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  // Quanto o atributo tende a evoluir, por idade (multiplicador de ganho / chance de queda)
  const ganhoIdade = (i) => i <= 19 ? 1.6 : i <= 22 ? 1.3 : i <= 26 ? 1.0 : i <= 29 ? 0.5 : i <= 32 ? 0.2 : 0.05;
  // atributos que a posição usa mais (recebem a maior parte do xp)
  function focoDoJogo(j) {
    const f = { RIT: 0.1, CHU: 0, PAS: 0, DRI: 0.1, DEF: 0, FIS: 0.1 };
    f.CHU += 0.6 * j.g + (j.slot && 'CA SA PD PE MEI'.includes(j.slot) ? 0.15 : 0);
    f.PAS += 0.15 * j.ast * 3 + 0.02 * j.passes;
    f.DEF += 0.08 * j.desarmes + 0.1 * j.defesas;
    f.DRI += 0.1 * j.g + 0.04 * j.passes;
    return f;
  }
  // Após cada partida (jogador j = objeto de campo de match.js). Retorna lista de melhorias aplicadas.
  function aplicarPosJogo(j) {
    const p = j.p, mudancas = [];
    if (j.minutos === 0) return mudancas;
    const delta = j.nota - 6.3;                 // 6.3 = nota mediana: acima evolui, abaixo regride
    const moralMult = 0.6 + p.moral / 100 * 0.9; // moral 100 => 1.5x ; moral 0 => 0.6x
    const peso = Math.min(1, j.minutos / 60);
    const base = (delta > 0 ? delta * ganhoIdade(p.idade) * moralMult : delta * 0.6) * peso * 0.10;
    const foco = focoDoJogo(j);
    for (const a of P().ATTRS) {
      // retorno decrescente: é muito mais difícil subir de 80 para 85 do que de 50 para 55
      const rd = base > 0 ? clamp((99 - p.attr[a]) / 50, 0.15, 1.2) : 1;
      p.xp[a] += base * (0.5 + foco[a] * 2) * rd; // ≈ base nos 6 atributos, mais nos do foco
      while (p.xp[a] >= 1 && p.attr[a] < 99) { p.xp[a] -= 1; p.attr[a]++; mudancas.push(a + '+1'); }
      while (p.xp[a] <= -1 && p.attr[a] > 1) { p.xp[a] += 1; p.attr[a]--; mudancas.push(a + '-1'); }
    }
    // moral: nota boa sobe, nota ruim desce
    p.moral = clamp(p.moral + delta * 5, 0, 100);
    p.jogos++;
    return mudancas;
  }
  // Moral dos reservas que não jogam desce devagar (e a de todo mundo tende a 50 com tempo)
  function semJogar(p) { p.moral = clamp(p.moral + (50 - p.moral) * 0.04 - 1, 0, 100); }
  // Recuperação entre jogos: dias de descanso. FIS alto recupera melhor. Lesionado só volta quando lesao = 0.
  function descansar(p, dias) {
    const taxa = (6 + p.attr.FIS * 0.08) * dias; // ex.: FIS 50 => ~10/dia ; FIS 90 => ~13/dia
    p.stamina = clamp(p.stamina + taxa * (p.lesao ? 0.3 : 1), 0, 100);
    if (p.lesao > 0 && dias >= 3) p.lesao--;
  }
  // Fim de temporada: envelhece e aplica declínio dos veteranos / tendência de queda se sem jogar
  function virarAno(p, rng) {
    p.idade++; p.contrato--;
    const queda = p.idade >= 31 ? (p.idade - 30) * 0.7 : 0;
    for (const a of P().ATTRS) {
      let d = 0;
      if (queda && rng.chance(Math.min(0.9, queda / 3))) d -= (a === 'RIT' || a === 'FIS') ? 2 : 1;
      if (p.idade <= 21 && rng.chance(0.5)) d += 1;                 // crescimento natural dos garotos
      if (p.jogos < 5 && p.idade > 22) d -= rng.chance(0.4) ? 1 : 0; // ficou parado
      p.attr[a] = clamp(p.attr[a] + d, 1, 99);
    }
    p.jogos = 0; p.gols = 0;
  }
  // cor da barra (stamina / moral)
  function cor(v) { return v >= 90 ? 'verde' : v >= 70 ? 'verde-claro' : v >= 50 ? 'amarelo' : v >= 20 ? 'laranja' : 'vermelho'; }

  bf.Progression = { aplicarPosJogo, semJogar, descansar, virarAno, cor, ganhoIdade };
})(typeof globalThis !== 'undefined' ? globalThis : this);
