// Todos os números que controlam a "sensação" do jogo ficam aqui.
// Experimente mudar os valores e recarregar a página!

const WORLD_WIDTH = 1200;
const WORLD_HEIGHT = 800;

const LAPS_TO_WIN = 3;

const CAR = {
  length: 30,
  width: 16,
  radius: 14,          // usado na colisão entre carros

  acceleration: 380,   // px/s² ao acelerar
  brake: 650,          // px/s² ao frear (andando para frente)
  reverseAccel: 220,   // px/s² dando ré
  maxSpeed: 430,       // px/s no asfalto
  maxSpeedGrass: 170,  // px/s na grama
  maxReverse: 140,

  turnSpeed: 3.2,      // rad/s no volante todo virado

  // Quanto da velocidade "de lado" é perdida por segundo.
  // Alto = carro gruda no chão. Baixo = carro derrapa (drift).
  grip: 7,
  gripHandbrake: 1.2,
  gripGrass: 3,

  rollingFriction: 0.55, // fração da velocidade mantida após 1s sem acelerar
  grassFriction: 0.2,
};
