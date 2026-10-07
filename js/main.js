const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Camada separada para as marcas de pneu: desenhamos nela uma vez
// e elas ficam lá para sempre (até reiniciar).
const skidLayer = document.createElement('canvas');
skidLayer.width = WORLD_WIDTH;
skidLayer.height = WORLD_HEIGHT;
const skidCtx = skidLayer.getContext('2d');

const track = new Track(TRACK_1, 90);

const cars = [
  new Car('Vermelho', '#e63946', { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', handbrake: 'Space' }),
  new Car('Azul', '#4ea8de', { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', handbrake: 'ShiftRight' }),
];

let state;      // 'countdown' | 'racing' | 'finished'
let raceTime;   // segundos desde a largada
let countdown;
let winner;

function resetRace() {
  cars.forEach((car, i) => car.reset(track.startPose(i)));
  skidCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  state = 'countdown';
  countdown = 3;
  raceTime = 0;
  winner = null;
}

// ---------------------------------------------------------------------------
// Ajusta o tamanho do canvas à janela, mantendo a proporção do mundo
let scale = 1;
function resize() {
  scale = Math.min(window.innerWidth / WORLD_WIDTH, window.innerHeight / WORLD_HEIGHT);
  canvas.width = Math.floor(WORLD_WIDTH * scale);
  canvas.height = Math.floor(WORLD_HEIGHT * scale);
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('keydown', (e) => {
  if (e.code === 'KeyR') resetRace();
});

// ---------------------------------------------------------------------------
// ATUALIZAR: toda a lógica do jogo
function update(dt) {
  if (state === 'countdown') {
    countdown -= dt;
    if (countdown <= 0) state = 'racing';
  } else if (state === 'racing') {
    raceTime += dt;
  }

  const canDrive = state !== 'countdown';
  cars.forEach((car) => {
    car.update(dt, track, canDrive && car.finishTime === null);
    if (state === 'racing') checkLaps(car);
  });

  collideCars(cars[0], cars[1]);

  // Marcas de pneu
  skidCtx.fillStyle = 'rgba(20,20,20,0.35)';
  cars.forEach((car) => {
    if (car.isSkidding()) {
      car.rearWheels().forEach((w) => skidCtx.fillRect(w.x - 1.5, w.y - 1.5, 3, 3));
    }
  });
}

function checkLaps(car) {
  if (car.finishTime !== null) return;
  if (!track.reachedCheckpoint(car.nextCheckpoint, car.trackIndex)) return;

  if (car.nextCheckpoint === 0) {
    // Cruzou a linha de chegada depois de passar por todos os checkpoints
    const lapTime = raceTime - car.lapStartTime;
    car.bestLap = car.bestLap === null ? lapTime : Math.min(car.bestLap, lapTime);
    car.lapStartTime = raceTime;
    car.lap++;
    if (car.lap >= LAPS_TO_WIN) {
      car.finishTime = raceTime;
      if (!winner) winner = car;
      if (cars.every((c) => c.finishTime !== null)) state = 'finished';
    }
  }
  car.nextCheckpoint = (car.nextCheckpoint + 1) % track.checkpointCount;
}

// ---------------------------------------------------------------------------
// DESENHAR: só desenha, não muda nada do jogo
function draw() {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  // Grama
  ctx.fillStyle = '#3f8f3f';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  track.draw(ctx);
  ctx.drawImage(skidLayer, 0, 0);
  cars.forEach((car) => car.draw(ctx));

  drawHud();
}

function formatTime(t) {
  if (t === null) return '--';
  return t.toFixed(2) + 's';
}

function drawHud() {
  ctx.font = 'bold 18px sans-serif';
  ctx.textBaseline = 'top';

  cars.forEach((car, i) => {
    const x = 16;
    const y = 12 + i * 26;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(x - 6, y - 4, 400, 24);
    ctx.fillStyle = car.color;
    const lap = Math.min(car.lap + 1, LAPS_TO_WIN);
    const status = car.finishTime !== null ? `CHEGOU ${formatTime(car.finishTime)}` : `Volta ${lap}/${LAPS_TO_WIN}`;
    ctx.fillText(`${car.name}: ${status}   melhor: ${formatTime(car.bestLap)}`, x, y);
  });

  ctx.fillStyle = '#fff';
  ctx.textAlign = 'right';
  ctx.fillText(`Tempo: ${raceTime.toFixed(2)}s`, WORLD_WIDTH - 16, 12);
  ctx.textAlign = 'left';

  if (state === 'countdown') {
    bigText(String(Math.ceil(countdown)));
  } else if (raceTime < 1) {
    bigText('VAI!');
  } else if (winner) {
    bigText(`${winner.name} venceu!`, 'Pressione R para correr de novo');
  }
}

function bigText(text, sub) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 72px sans-serif';
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#000';
  ctx.strokeText(text, WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
  ctx.fillStyle = '#ffd60a';
  ctx.fillText(text, WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
  if (sub) {
    ctx.font = 'bold 24px sans-serif';
    ctx.lineWidth = 4;
    ctx.strokeText(sub, WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 60);
    ctx.fillStyle = '#fff';
    ctx.fillText(sub, WORLD_WIDTH / 2, WORLD_HEIGHT / 2 + 60);
  }
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
}

// ---------------------------------------------------------------------------
// GAME LOOP: o coração de todo jogo. ~60 vezes por segundo:
//   1. calcula quanto tempo passou (dt)
//   2. atualiza o mundo
//   3. desenha o mundo
let lastTime = performance.now();
function loop(now) {
  const dt = Math.min((now - lastTime) / 1000, 1 / 30); // evita saltos grandes
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

resetRace();
requestAnimationFrame(loop);
