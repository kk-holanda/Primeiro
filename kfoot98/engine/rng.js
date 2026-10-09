// Gerador pseudo-aleatório com semente (mulberry32): mesma semente = mesmo campeonato.
// Essencial para o multiplayer: servidor e clientes chegam aos mesmos resultados.
(function (root) {
  function create(seed) {
    let a = seed >>> 0;
    const next = () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      next,
      int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
      gauss: () => { let s = 0; for (let i = 0; i < 6; i++) s += next(); return (s - 3) / 0.7071; },
      pick: (arr) => arr[Math.floor(next() * arr.length)],
      chance: (p) => next() < p,
      weighted(items, weightFn) {
        let total = 0; const w = items.map((it) => { const x = Math.max(0, weightFn(it)); total += x; return x; });
        if (total <= 0) return items[Math.floor(next() * items.length)];
        let r = next() * total;
        for (let i = 0; i < items.length; i++) { r -= w[i]; if (r <= 0) return items[i]; }
        return items[items.length - 1];
      },
    };
  }
  (root.BF98 = root.BF98 || {}).RNG = { create };
})(typeof globalThis !== 'undefined' ? globalThis : this);
