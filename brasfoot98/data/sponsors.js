// Patrocinadores FICTÍCIOS. Regras: máx. 2 por clube, nunca 2 da mesma categoria.
// valor = R$ por temporada para um clube de prestígio 100 na Série A; o valor real é
// valor * fatorClube (ver engine/economy.js). minPrestigio = prestígio mínimo do clube para aceitar.
(function (root) {
  const CATEGORIAS = {
    refrigerante: 'Refrigerantes', cerveja: 'Cervejas', banco: 'Bancos', varejo: 'Lojas / Varejo',
    material: 'Material de construção', esporte: 'Material esportivo', telecom: 'Telefonia',
    alimento: 'Alimentos', automovel: 'Automóveis', energia: 'Energia / Combustíveis',
    saude: 'Planos de saúde', comunicacao: 'Rádio / TV / Jornais',
  };
  // [id, nome, categoria, valorBase, minPrestigio]
  const S = [
    ['guaranapampa', 'Guaraná Pampa', 'refrigerante', 6_000_000, 40], ['colinha', 'Cola Colinha', 'refrigerante', 5_000_000, 0],
    ['fizzbr', 'Fizz Brasil', 'refrigerante', 2_000_000, 0],
    ['cervejapilar', 'Cerveja Pilar', 'cerveja', 7_000_000, 55], ['brahmanova', 'Nova Lager', 'cerveja', 4_500_000, 20],
    ['bancosertao', 'Banco do Sertão', 'banco', 8_000_000, 60], ['credimais', 'Credimais', 'banco', 3_000_000, 15],
    ['caixaunida', 'Caixa Unida', 'banco', 1_200_000, 0],
    ['lojasbarateira', 'Lojas Barateira', 'varejo', 4_000_000, 25], ['magazineaurora', 'Magazine Aurora', 'varejo', 5_500_000, 45],
    ['casabahiana', 'Casa Popular', 'varejo', 1_500_000, 0],
    ['cimentoforte', 'Cimento Forte', 'material', 3_500_000, 20], ['tijolaco', 'Tijolaço Materiais', 'material', 1_200_000, 0],
    ['tintasarco', 'Tintas Arco-Íris', 'material', 2_200_000, 10],
    ['atletaplus', 'Atleta Plus', 'esporte', 7_500_000, 65], ['golaco', 'Golaço Sports', 'esporte', 3_000_000, 15],
    ['chuteirabr', 'Chuteira Brasil', 'esporte', 900_000, 0],
    ['telebrasa', 'TeleBrasa', 'telecom', 6_500_000, 50], ['conectacel', 'Conecta Celular', 'telecom', 2_800_000, 15],
    ['macarraomassa', 'Massa Nonna', 'alimento', 2_500_000, 10], ['frangoleve', 'Frango Leve', 'alimento', 1_800_000, 0],
    ['biscoitinho', 'Biscoitos Dona Lia', 'alimento', 800_000, 0],
    ['motorvia', 'Motorvia Veículos', 'automovel', 5_000_000, 45], ['autojet', 'AutoJet Concessionária', 'automovel', 1_400_000, 0],
    ['petrosul', 'PetroSul', 'energia', 6_000_000, 55], ['postoestrela', 'Postos Estrela', 'energia', 1_000_000, 0],
    ['vidasaude', 'Vida Saúde', 'saude', 4_000_000, 35], ['clinicamais', 'Clínica Mais', 'saude', 900_000, 0],
    ['radioalvorada', 'Rádio Alvorada', 'comunicacao', 1_500_000, 0], ['jornaldodia', 'Jornal do Dia', 'comunicacao', 2_000_000, 10],
  ];
  const sponsors = S.map(([id, nome, categoria, valorBase, minPrestigio]) => ({ id, nome, categoria, valorBase, minPrestigio }));
  const bf = (root.BF98 = root.BF98 || {});
  bf.SPONSORS = sponsors;
  bf.SPONSOR_CATEGORIAS = CATEGORIAS;
})(typeof globalThis !== 'undefined' ? globalThis : this);
