// 80 clubes: 4 divisões x 20. Temporada 1998.
// ATENÇÃO: a Série D NÃO existiu em 1998 (só foi criada em 2009). As divisões A e B usam
// majoritariamente clubes reais daquele ano (A tem 20 dos 24 reais); C e D são ficcionais no formato,
// preenchidas com clubes reais que disputavam séries inferiores/estaduais.
// Capacidades e "prestígio" são ESTIMATIVAS para jogo, não dados oficiais.
// Colunas: id, nome, cidade, UF, divisão, prestígio(1-100), estádio, capacidade
(function (root) {
  const R = [
    // ---------------- SÉRIE A ----------------
    ['corinthians', 'Corinthians', 'São Paulo', 'SP', 'A', 97, 'Pacaembu', 37000],
    ['flamengo', 'Flamengo', 'Rio de Janeiro', 'RJ', 'A', 96, 'Maracanã', 100000],
    ['palmeiras', 'Palmeiras', 'São Paulo', 'SP', 'A', 95, 'Palestra Itália', 32000],
    ['saopaulo', 'São Paulo', 'São Paulo', 'SP', 'A', 94, 'Morumbi', 80000],
    ['vasco', 'Vasco da Gama', 'Rio de Janeiro', 'RJ', 'A', 93, 'São Januário', 35000],
    ['cruzeiro', 'Cruzeiro', 'Belo Horizonte', 'MG', 'A', 91, 'Mineirão', 75000],
    ['gremio', 'Grêmio', 'Porto Alegre', 'RS', 'A', 89, 'Olímpico', 45000],
    ['internacional', 'Internacional', 'Porto Alegre', 'RS', 'A', 87, 'Beira-Rio', 55000],
    ['atleticomg', 'Atlético-MG', 'Belo Horizonte', 'MG', 'A', 86, 'Mineirão', 75000],
    ['santos', 'Santos', 'Santos', 'SP', 'A', 82, 'Vila Belmiro', 20000],
    ['botafogo', 'Botafogo', 'Rio de Janeiro', 'RJ', 'A', 80, 'Maracanã', 100000],
    ['bahia', 'Bahia', 'Salvador', 'BA', 'A', 78, 'Fonte Nova', 66000],
    ['vitoria', 'Vitória', 'Salvador', 'BA', 'A', 76, 'Barradão', 30000],
    ['portuguesa', 'Portuguesa', 'São Paulo', 'SP', 'A', 74, 'Canindé', 20000],
    ['coritiba', 'Coritiba', 'Curitiba', 'PR', 'A', 72, 'Couto Pereira', 37000],
    ['atleticopr', 'Atlético-PR', 'Curitiba', 'PR', 'A', 70, 'Joaquim Américo', 20000],
    ['sport', 'Sport', 'Recife', 'PE', 'A', 68, 'Ilha do Retiro', 32000],
    ['guarani', 'Guarani', 'Campinas', 'SP', 'A', 66, 'Brinco de Ouro', 29000],
    ['parana', 'Paraná', 'Curitiba', 'PR', 'A', 62, 'Vila Capanema', 20000],
    ['juventude', 'Juventude', 'Caxias do Sul', 'RS', 'A', 60, 'Alfredo Jaconi', 19000],
    // ---------------- SÉRIE B ----------------
    ['fluminense', 'Fluminense', 'Rio de Janeiro', 'RJ', 'B', 75, 'Maracanã', 100000],
    ['ceara', 'Ceará', 'Fortaleza', 'CE', 'B', 66, 'Castelão', 60000],
    ['fortaleza', 'Fortaleza', 'Fortaleza', 'CE', 'B', 65, 'Pici', 10000],
    ['nautico', 'Náutico', 'Recife', 'PE', 'B', 64, 'Aflitos', 22000],
    ['santacruz', 'Santa Cruz', 'Recife', 'PE', 'B', 63, 'Arruda', 60000],
    ['goias', 'Goiás', 'Goiânia', 'GO', 'B', 63, 'Serra Dourada', 41000],
    ['pontepreta', 'Ponte Preta', 'Campinas', 'SP', 'B', 62, 'Moisés Lucarelli', 30000],
    ['remo', 'Remo', 'Belém', 'PA', 'B', 61, 'Baenão', 17000],
    ['paysandu', 'Paysandu', 'Belém', 'PA', 'B', 60, 'Curuzu', 15000],
    ['bragantino', 'Bragantino', 'Bragança Paulista', 'SP', 'B', 58, 'Nabi Abi Chedid', 17000],
    ['avai', 'Avaí', 'Florianópolis', 'SC', 'B', 57, 'Ressacada', 17000],
    ['criciuma', 'Criciúma', 'Criciúma', 'SC', 'B', 56, 'Heriberto Hülse', 19000],
    ['americamg', 'América-MG', 'Belo Horizonte', 'MG', 'B', 55, 'Independência', 23000],
    ['figueirense', 'Figueirense', 'Florianópolis', 'SC', 'B', 54, 'Orlando Scarpelli', 20000],
    ['vilanova', 'Vila Nova', 'Goiânia', 'GO', 'B', 53, 'Onésio Brasileiro Alvarenga', 11000],
    ['sampaio', 'Sampaio Corrêa', 'São Luís', 'MA', 'B', 52, 'Castelão-MA', 40000],
    ['botafogosp', 'Botafogo-SP', 'Ribeirão Preto', 'SP', 'B', 50, 'Santa Cruz', 27000],
    ['atleticogo', 'Atlético-GO', 'Goiânia', 'GO', 'B', 48, 'Antônio Accioly', 12000],
    ['xv', 'XV de Piracicaba', 'Piracicaba', 'SP', 'B', 47, 'Barão de Serra Negra', 18000],
    ['gama', 'Gama', 'Gama', 'DF', 'B', 45, 'Bezerrão', 20000],
    // ---------------- SÉRIE C ----------------
    ['joinville', 'Joinville', 'Joinville', 'SC', 'C', 46, 'Ernestão', 16000],
    ['londrina', 'Londrina', 'Londrina', 'PR', 'C', 44, 'do Café', 32000],
    ['csa', 'CSA', 'Maceió', 'AL', 'C', 43, 'Rei Pelé', 20000],
    ['americarn', 'América-RN', 'Natal', 'RN', 'C', 42, 'Machadão', 40000],
    ['crb', 'CRB', 'Maceió', 'AL', 'C', 42, 'Rei Pelé', 20000],
    ['mogimirim', 'Mogi Mirim', 'Mogi Mirim', 'SP', 'C', 41, 'Vail Chaves', 19000],
    ['saocaetano', 'São Caetano', 'São Caetano do Sul', 'SP', 'C', 40, 'Anacleto Campanella', 15000],
    ['caxias', 'Caxias', 'Caxias do Sul', 'RS', 'C', 40, 'Centenário', 22000],
    ['treze', 'Treze', 'Campina Grande', 'PB', 'C', 39, 'Amigão', 35000],
    ['voltaredonda', 'Volta Redonda', 'Volta Redonda', 'RJ', 'C', 38, 'Raulino de Oliveira', 20000],
    ['campinense', 'Campinense', 'Campina Grande', 'PB', 'C', 38, 'Renatão', 20000],
    ['brasilpel', 'Brasil de Pelotas', 'Pelotas', 'RS', 'C', 38, 'Bento Freitas', 18000],
    ['juventus', 'Juventus-SP', 'São Paulo', 'SP', 'C', 37, 'Rua Javari', 6000],
    ['confianca', 'Confiança', 'Aracaju', 'SE', 'C', 37, 'Batistão', 15000],
    ['americano', 'Americano', 'Campos', 'RJ', 'C', 36, 'Godofredo Cruz', 8000],
    ['motoclub', 'Moto Club', 'São Luís', 'MA', 'C', 36, 'Nhozinho Santos', 15000],
    ['santoandre', 'Santo André', 'Santo André', 'SP', 'C', 36, 'Bruno José Daniel', 16000],
    ['operariosms', 'Operário-MS', 'Campo Grande', 'MS', 'C', 35, 'Morenão', 30000],
    ['ituano', 'Ituano', 'Itu', 'SP', 'C', 35, 'Novelli Júnior', 18000],
    ['central', 'Central', 'Caruaru', 'PE', 'C', 34, 'Lacerdão', 19000],
    // ---------------- SÉRIE D — 10 melhores (NÃO selecionáveis no multiplayer) ----------------
    ['tupi', 'Tupi', 'Juiz de Fora', 'MG', 'D', 30, 'Mário Helênio', 15000],
    ['ypiranga', 'Ypiranga-RS', 'Erechim', 'RS', 'D', 29, 'Colosso da Lagoa', 22000],
    ['villanova', 'Villa Nova-MG', 'Nova Lima', 'MG', 'D', 28, 'Castor Cifuentes', 9000],
    ['ferroviario', 'Ferroviário', 'Fortaleza', 'CE', 'D', 27, 'Elzir Cabral', 12000],
    ['nacionalam', 'Nacional-AM', 'Manaus', 'AM', 'D', 26, 'Vivaldão', 43000],
    ['anapolis', 'Anápolis', 'Anápolis', 'GO', 'D', 26, 'Jonas Duarte', 17000],
    ['comercialms', 'Comercial-MS', 'Campo Grande', 'MS', 'D', 25, 'Jacques da Luz', 8000],
    ['riobrancoac', 'Rio Branco-AC', 'Rio Branco', 'AC', 'D', 24, 'José de Melo', 12000],
    ['operariovg', 'Operário-VG', 'Várzea Grande', 'MT', 'D', 24, 'Louro Veloso', 8000],
    ['itabaiana', 'Itabaiana', 'Itabaiana', 'SE', 'D', 23, 'Mendonção', 12000],
    // ---------------- SÉRIE D — 10 piores (SELECIONÁVEIS: sorteio dos jogadores humanos) ----------------
    ['bangu', 'Bangu', 'Rio de Janeiro', 'RJ', 'D', 20, 'Moça Bonita', 17000],
    ['madureira', 'Madureira', 'Rio de Janeiro', 'RJ', 'D', 17, 'Conselheiro Galvão', 10000],
    ['marilia', 'Marília', 'Marília', 'SP', 'D', 15, 'Bento de Abreu', 19000],
    ['olaria', 'Olaria', 'Rio de Janeiro', 'RJ', 'D', 14, 'Bariri', 8000],
    ['sertaozinho', 'Sertãozinho', 'Sertãozinho', 'SP', 'D', 13, 'Frederico Dalmaso', 8000],
    ['riobrancoes', 'Rio Branco-ES', 'Vitória', 'ES', 'D', 12, 'Engenheiro Araripe', 5000],
    ['tunaluso', 'Tuna Luso', 'Belém', 'PA', 'D', 11, 'Soares de Carvalho', 5000],
    ['colatina', 'Colatina', 'Colatina', 'ES', 'D', 10, 'Justiniano de Melo', 5000],
    ['ceilandia', 'Ceilândia', 'Ceilândia', 'DF', 'D', 9, 'Abadião', 6000],
    ['guaranybage', 'Guarany de Bagé', 'Bagé', 'RS', 'D', 8, 'Carlos Salzano', 10000],
  ];

  // Parâmetros econômicos por divisão (R$ de 1998; R$1 ≈ US$1). ESTIMATIVAS — ver docs/GDD.md §7.
  const DIV = {
    A: { caixaBase: 10_000_000, ingresso: 15, demandaK: 1.0, tv: 3_000_000 },
    B: { caixaBase: 2_500_000, ingresso: 9, demandaK: 0.55, tv: 800_000 },
    C: { caixaBase: 700_000, ingresso: 6, demandaK: 0.45, tv: 250_000 },
    D: { caixaBase: 150_000, ingresso: 4, demandaK: 0.55, tv: 80_000 },
  };

  const clubs = R.map((r, i) => {
    const [id, nome, cidade, uf, div, prestigio, estadio, capacidade] = r;
    const d = DIV[div];
    return {
      id, nome, cidade, uf, div, prestigio,
      estadio: { nome: estadio, capacidade, nivel: 0 },
      // demanda média de público (pessoas/jogo) — cresce com prestígio^1.55
      demanda: Math.round(25 * Math.pow(prestigio, 1.55) * d.demandaK),
      caixa: Math.round(d.caixaBase * (0.4 + prestigio / 100 * 1.2) / 1000) * 1000,
      precoIngresso: d.ingresso,
      // dos 20 clubes da Série D, os 10 últimos da lista são os sorteáveis no multiplayer
      selecionavel: div === 'D' && i >= R.length - 10,
    };
  });

  const bf = (root.BF98 = root.BF98 || {});
  bf.CLUBS = clubs;
  bf.DIVISOES = DIV;
})(typeof globalThis !== 'undefined' ? globalThis : this);
