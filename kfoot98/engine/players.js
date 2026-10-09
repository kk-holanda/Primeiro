// Jogadores: atributos, overall por posição, penalidade fora de posição e gerador de elencos.
(function (root) {
  const bf = (root.BF98 = root.BF98 || {});
  const ATTRS = ['RIT', 'CHU', 'PAS', 'DRI', 'DEF', 'FIS'];
  // pesos por posição, na ordem RIT CHU PAS DRI DEF FIS (somam 1)
  const PESOS = {
    GOL: [.05, 0, .10, .15, .55, .15], ZAG: [.05, 0, .08, .07, .55, .25], LIB: [.05, 0, .20, .10, .45, .20],
    LD: [.20, .03, .15, .12, .35, .15], LE: [.20, .03, .15, .12, .35, .15],
    VOL: [.07, .05, .18, .10, .40, .20], MC: [.07, .10, .30, .20, .20, .13], MEI: [.08, .18, .30, .30, .05, .09],
    ALA: [.20, .08, .20, .20, .20, .12], PD: [.28, .17, .15, .30, 0, .10], PE: [.28, .17, .15, .30, 0, .10],
    CA: [.12, .42, .07, .14, 0, .25], SA: [.18, .32, .15, .28, 0, .07],
  };
  const GRUPO = { GOL: 'G', ZAG: 'D', LIB: 'D', LD: 'D', LE: 'D', VOL: 'M', MC: 'M', MEI: 'M', ALA: 'M', PD: 'A', PE: 'A', CA: 'A', SA: 'A' };
  const PARES = { // afinidade especial (simétrica)
    'ZAG-LIB': .97, 'LD-LE': .93, 'LD-ALA': .92, 'LE-ALA': .92, 'VOL-MC': .95, 'MC-MEI': .95, 'VOL-LIB': .9,
    'PD-PE': .93, 'CA-SA': .95, 'MEI-SA': .9, 'PD-ALA': .9, 'PE-ALA': .9, 'MC-ALA': .92, 'ZAG-VOL': .88, 'LD-ZAG': .85, 'LE-ZAG': .85,
  };
  function afinidade(natural, slot) {
    if (natural === slot) return 1;
    const k = PARES[natural + '-' + slot] || PARES[slot + '-' + natural];
    if (k) return k;
    const g1 = GRUPO[natural], g2 = GRUPO[slot];
    if (g1 === 'G') return 0.35;      // goleiro de linha é desastre
    if (g2 === 'G') return 0.25;      // jogador de linha no gol, pior ainda
    if (g1 === g2) return 0.88;
    const ordem = 'DMA';
    return Math.abs(ordem.indexOf(g1) - ordem.indexOf(g2)) === 1 ? 0.78 : 0.65;
  }
  function overallEm(p, pos) {
    const w = PESOS[pos]; let s = 0;
    for (let i = 0; i < 6; i++) s += p.attr[ATTRS[i]] * w[i];
    return s;
  }
  const overall = (p) => overallEm(p, p.pos);
  // ovr efetivo naquele slot (já com penalidade de posição, sem stamina/moral)
  const ovrNoSlot = (p, slot) => overallEm(p, slot) * afinidade(p.pos, slot);

  // deslocamento do atributo por posição (dá "cara" ao jogador)
  const PERFIL = {
    GOL: [-12, -30, -5, 0, 14, 4], ZAG: [-6, -15, -4, -10, 12, 8], LIB: [-5, -12, 4, -4, 10, 4],
    LD: [8, -8, 0, 0, 5, 2], LE: [8, -8, 0, 0, 5, 2], VOL: [-4, -6, 2, -4, 10, 6],
    MC: [0, -2, 8, 3, 0, 0], MEI: [0, 4, 10, 10, -14, -8], ALA: [8, -2, 2, 3, 0, 0],
    PD: [10, 0, 0, 8, -20, -6], PE: [10, 0, 0, 8, -20, -6], CA: [0, 12, -6, 0, -22, 8], SA: [4, 8, 4, 8, -22, -8],
  };
  const DISCIPLINAS = ['Fair player', 'De boa', 'Equilibrado', 'Porradeiro', 'Macetador'];
  // multiplicador de faltas e de cartões por disciplina
  const DISC_FALTA = [0.55, 0.85, 1.0, 1.3, 1.7];
  const DISC_CARTAO = [0.4, 0.8, 1.0, 1.6, 2.4];

  const NOMES = ['Adailton', 'Adílson', 'Adriano', 'Alberto', 'Alex', 'Alexandre', 'Aloísio', 'Altair', 'Amaral', 'André', 'Anderson', 'Antônio', 'Aílton', 'Beto', 'Bruno', 'Caio', 'Carlos', 'Cássio', 'Cláudio', 'Cleber', 'Cleiton', 'Dario', 'Davi', 'Denílson', 'Diego', 'Dida', 'Edmar', 'Edu', 'Edson', 'Eduardo', 'Elias', 'Emerson', 'Fabiano', 'Fábio', 'Felipe', 'Fernando', 'Flávio', 'Francisco', 'Gabriel', 'Geraldo', 'Gilmar', 'Gilson', 'Givanildo', 'Guilherme', 'Gustavo', 'Helton', 'Henrique', 'Hélio', 'Ivan', 'Jair', 'Jefferson', 'João', 'Jonas', 'Jorge', 'José', 'Júlio', 'Juninho', 'Kleber', 'Leandro', 'Leonardo', 'Lúcio', 'Luciano', 'Luís', 'Marcão', 'Marcelo', 'Márcio', 'Marcos', 'Mário', 'Maurício', 'Mauro', 'Nélio', 'Neto', 'Nilton', 'Odair', 'Osvaldo', 'Paulo', 'Pedro', 'Rafael', 'Raimundo', 'Reinaldo', 'Renato', 'Ricardo', 'Roberto', 'Rodrigo', 'Rogério', 'Ronaldo', 'Sandro', 'Sérgio', 'Silvio', 'Tadeu', 'Thiago', 'Valdir', 'Vágner', 'Vander', 'Vítor', 'Wagner', 'Wellington', 'Wilson', 'Zé'];
  const SOBRENOMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Ribeiro', 'Carvalho', 'Gomes', 'Martins', 'Barbosa', 'Rocha', 'Dias', 'Moreira', 'Cardoso', 'Teixeira', 'Mendes', 'Freitas', 'Pinto', 'Batista', 'Moura', 'Campos', 'Cunha', 'Monteiro', 'Nunes', 'Ramos', 'Vieira', 'Lopes', 'Fernandes', 'Machado', 'Correia', 'Azevedo', 'Duarte', 'Farias', 'Guimarães', 'Maciel', 'Miranda', 'Siqueira', 'Pacheco', 'Tavares', 'Xavier', 'Cavalcante', 'Brito', 'Peixoto', 'Medeiros', 'Andrade', 'Franco', 'Leite', 'Bezerra', 'Toledo', 'Furtado', 'Melo', 'Borges', 'Coelho', 'Viana'];
  // registro de nomes já usados: garante que não existam dois jogadores com o mesmo nome no mundo
  let usadosGlobal = new Set();
  const resetNomes = () => { usadosGlobal = new Set(); };
  function nomeUnico(rng, usados) {
    for (let t = 0; t < 40; t++) {
      const n = rng.pick(NOMES) + ' ' + rng.pick(SOBRENOMES);
      if (!usados.has(n)) { usados.add(n); return n; }
    }
    for (;;) { // improvável: acrescenta inicial do meio
      const n = rng.pick(NOMES) + ' ' + String.fromCharCode(65 + rng.int(0, 25)) + '. ' + rng.pick(SOBRENOMES);
      if (!usados.has(n)) { usados.add(n); return n; }
    }
  }

  // composição de um elenco de 24
  const ELENCO = ['GOL', 'GOL', 'GOL', 'ZAG', 'ZAG', 'ZAG', 'ZAG', 'LD', 'LD', 'LE', 'LE', 'VOL', 'VOL', 'VOL', 'MC', 'MC', 'MEI', 'MEI', 'PD', 'PE', 'CA', 'CA', 'CA', 'SA'];

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function gerarJogador(rng, pos, alvo, idade, usados = usadosGlobal) {
    const attr = {};
    ATTRS.forEach((a, i) => { attr[a] = clamp(Math.round(alvo + PERFIL[pos][i] + rng.gauss() * 4.5), 5, 97); });
    const p = {
      id: 'p' + Math.floor(rng.next() * 1e9).toString(36), nome: nomeUnico(rng, usados),
      pos, idade, attr, xp: { RIT: 0, CHU: 0, PAS: 0, DRI: 0, DEF: 0, FIS: 0 },
      disciplina: rng.weighted([0, 1, 2, 3, 4], (d) => [10, 25, 35, 20, 10][d] * ((GRUPO[pos] === 'D' || pos === 'VOL') && d >= 3 ? 1.4 : 1)),
      stamina: rng.int(88, 100), moral: rng.int(48, 72), lesao: 0, contrato: rng.chance(0.65) ? 1 : 2, // temporadas restantes: até Dez do ano atual (65%) ou do próximo (35%)
      suspenso: 0, amarelosAcum: 0,
      gols: 0, jogos: 0,
    };
    // ajusta o nível geral: corrige para que o overall caia perto do alvo
    const diff = alvo - overall(p);
    ATTRS.forEach((a) => { p.attr[a] = clamp(Math.round(p.attr[a] + diff), 5, 97); });
    return p;
  }

  // prestigio -> nível médio do elenco: 36 + 0.36 * prestígio  (97 -> 71 ; 8 -> 39)
  const nivelDoClube = (prestigio) => 36 + prestigio * 0.36;

  function gerarElenco(rng, clube, usados) {
    const base = nivelDoClube(clube.prestigio);
    // elenco "pirâmide": titulares melhores que reservas
    return ELENCO.map((pos, i) => {
      const titular = i < 14 ? 3 + rng.next() * 5 : -(2 + rng.next() * 6);
      const idade = clamp(Math.round(26 + rng.gauss() * 4.2), 17, 37);
      const bonusIdade = idade <= 20 ? -3 : 0; // garotos ainda verdes
      return gerarJogador(rng, pos, base + titular + bonusIdade, idade, usados);
    });
  }

  bf.Players = { ATTRS, PESOS, GRUPO, DISCIPLINAS, DISC_FALTA, DISC_CARTAO, afinidade, overall, overallEm, ovrNoSlot, gerarElenco, gerarJogador, resetNomes, nivelDoClube, clamp };
})(typeof globalThis !== 'undefined' ? globalThis : this);
