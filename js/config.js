// Todos os números que controlam a "sensação" do jogo ficam aqui.
// Experimente mudar os valores e recarregar a página!

const GAME_NAME = 'KKart';

const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 800;

const LAPS_TO_WIN = 3;

// Física comum a todos os carros
const PHYSICS = {
  radius: 13,            // usado na colisão entre carros
  brake: 650,            // px/s² ao frear (andando para frente)
  reverseAccel: 220,     // px/s² dando ré
  maxReverse: 140,
  grassSpeedFactor: 0.42, // na grama a velocidade máxima cai para 42%

  // Quanto da velocidade "de lado" é perdida por segundo.
  // Alto = carro gruda no chão. Baixo = carro derrapa (drift).
  gripHandbrake: 1.2,
  gripGrass: 3,

  rollingFriction: 0.55, // fração da velocidade mantida após 1s sem acelerar
  grassFriction: 0.2,
};

// Os 3 carros. As notas vão de 1 (fraco) a 5 (forte).
const CAR_MODELS = [
  {
    id: 'red', name: 'Vermelho',
    color: '#e8232a', dark: '#9e1016', light: '#ff7a6e',
    stats: { acceleration: 4, topSpeed: 5, handling: 3 },
  },
  {
    id: 'yellow', name: 'Amarelo',
    color: '#f7d417', dark: '#b8920a', light: '#fff38a',
    stats: { acceleration: 5, topSpeed: 3, handling: 4 },
  },
  {
    id: 'blue', name: 'Azul',
    color: '#1d4fd8', dark: '#0f2a80', light: '#6f9bff',
    stats: { acceleration: 4, topSpeed: 4, handling: 4 },
  },
];

// Transforma as notas (1 a 5) em números de física.
function carPerformance(stats) {
  return {
    acceleration: 200 + stats.acceleration * 55, // 4 → 420 px/s²   5 → 475 px/s²
    maxSpeed: 300 + stats.topSpeed * 30,         // 3 → 390 px/s    5 → 450 px/s
    turnSpeed: 2.0 + stats.handling * 0.35,      // 3 → 3.05 rad/s  4 → 3.4 rad/s
    grip: 5 + stats.handling * 0.6,              // curva melhor também derrapa menos
  };
}
