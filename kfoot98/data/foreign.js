// Clubes sul-americanos da Libertadores 1998 (20 na fase de grupos: 2 por país x 10 países,
// o México era convidado). Fonte: Wikipédia/RSSSF (ver docs/GDD.md). "ovr" = força média do time (0-99), estimada.
// O 2º clube peruano não foi confirmado na pesquisa (marcado ?). Aqui entra como Sporting Cristal.
(function (root) {
  const F = [
    ['river', 'River Plate', 'ARG', 80], ['colon', 'Colón', 'ARG', 62], ['boca', 'Boca Juniors', 'ARG', 80],
    ['bolivar', 'Bolívar', 'BOL', 52], ['oriente', 'Oriente Petrolero', 'BOL', 48],
    ['colocolo', 'Colo-Colo', 'CHI', 66], ['ucatolica', 'Universidad Católica', 'CHI', 62],
    ['americacali', 'América de Cali', 'COL', 66], ['bucaramanga', 'Atlético Bucaramanga', 'COL', 56],
    ['barcelonaecu', 'Barcelona de Guayaquil', 'EQU', 62], ['dquito', 'Deportivo Quito', 'EQU', 54],
    ['olimpia', 'Olimpia', 'PAR', 64], ['cerro', 'Cerro Porteño', 'PAR', 62],
    ['alianza', 'Alianza Lima', 'PER', 56], ['cristal', 'Sporting Cristal (?)', 'PER', 56],
    ['penarol', 'Peñarol', 'URU', 68], ['nacionaluru', 'Nacional', 'URU', 68],
    ['guadalajara', 'Guadalajara', 'MEX', 64], ['americamex', 'América (MEX)', 'MEX', 64],
  ];
  (root.BF98 = root.BF98 || {}).FOREIGN = F.map(([id, nome, pais, ovr]) => ({ id, nome, pais, ovr }));
})(typeof globalThis !== 'undefined' ? globalThis : this);
