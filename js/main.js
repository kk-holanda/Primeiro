const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const FONT = "'Russo One', 'Arial Black', sans-serif";
const UI = {
  bg: '#1e2026',
  panel: '#2b2e36',
  panelHover: '#363a45',
  text: '#f4f4f6',
  muted: '#a3a7b3',
  accent: '#ffd23f',
};

// Camada separada para as marcas de pneu: desenhamos nela uma vez
// e elas ficam lá até a próxima corrida.
const skidLayer = document.createElement('canvas');
skidLayer.width = WORLD_WIDTH;
skidLayer.height = WORLD_HEIGHT;
const skidCtx = skidLayer.getContext('2d');

// ---------------------------------------------------------------------------
// Estado do jogo
//   screen: 'difficultySelect' → 'trackSelect' → 'carSelect' → 'race'
const game = {
  screen: 'difficultySelect',
  difficultyChoice: 1,
  trackChoice: 0,
  carChoice: 0,
  track: null,
  cars: [],
  player: null,
  raceState: 'countdown', // 'countdown' | 'racing'
  raceTime: 0,
  countdown: 3,
  finishOrder: [],
};

function startRace() {
  game.track = TRACKS[game.trackChoice];
  const playerModel = CAR_MODELS[game.carChoice];
  game.player = new Car(playerModel, new HumanController());

  // Os carros que o jogador não escolheu ficam com o computador
  const rivals = CAR_MODELS.filter((m) => m !== playerModel);
  const skill = DIFFICULTIES[game.difficultyChoice].skill;
  const aiCars = rivals.map((m, i) => new Car(m, new AIController(skill - i * 0.012, i % 2 === 0 ? -1 : 1)));

  // Rivais na frente, jogador larga em último
  game.cars = [...aiCars, game.player];
  game.cars.forEach((car, slot) => car.reset(game.track.startPose(slot)));

  skidCtx.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  game.raceState = 'countdown';
  game.countdown = 3;
  game.raceTime = 0;
  game.finishOrder = [];
  game.recordFlash = 0;
  particles = [];
  Sound.beep(440);
  game.screen = 'race';
}

// ---------------------------------------------------------------------------
// Ajusta o tamanho do canvas à janela, mantendo a proporção do mundo
let scale = 1;
let dpr = 1;
function resize() {
  dpr = window.devicePixelRatio || 1;
  scale = Math.min(window.innerWidth / WORLD_WIDTH, window.innerHeight / WORLD_HEIGHT);
  canvas.style.width = Math.floor(WORLD_WIDTH * scale) + 'px';
  canvas.style.height = Math.floor(WORLD_HEIGHT * scale) + 'px';
  canvas.width = Math.floor(WORLD_WIDTH * scale * dpr);
  canvas.height = Math.floor(WORLD_HEIGHT * scale * dpr);
}
window.addEventListener('resize', resize);
resize();

// ---------------------------------------------------------------------------
// Menus: áreas clicáveis
const DIFFICULTY_CARDS = [0, 1, 2].map((i) => ({ x: 105 + i * 340, y: 260, w: 310, h: 300 }));
const TRACK_CARDS = TRACKS.map((_, i) => ({ x: 130 + (i % 2) * 480, y: 180 + Math.floor(i / 2) * 285, w: 460, h: 270 }));
const CAR_CARDS = CAR_MODELS.map((_, i) => ({ x: 45 + (i % 3) * 375, y: 180 + Math.floor(i / 3) * 285, w: 360, h: 270 }));

function cardsForScreen() {
  if (game.screen === 'difficultySelect') return DIFFICULTY_CARDS;
  if (game.screen === 'trackSelect') return TRACK_CARDS;
  if (game.screen === 'carSelect') return CAR_CARDS;
  return [];
}

function confirmChoice() {
  if (game.screen === 'difficultySelect') game.screen = 'trackSelect';
  else if (game.screen === 'trackSelect') game.screen = 'carSelect';
  else if (game.screen === 'carSelect') startRace();
}

function moveChoice(dir) {
  if (game.screen === 'difficultySelect') {
    game.difficultyChoice = (game.difficultyChoice + dir + DIFFICULTIES.length) % DIFFICULTIES.length;
  } else if (game.screen === 'trackSelect') {
    game.trackChoice = (game.trackChoice + dir + TRACKS.length) % TRACKS.length;
  } else if (game.screen === 'carSelect') {
    game.carChoice = (game.carChoice + dir + CAR_MODELS.length) % CAR_MODELS.length;
  }
}

function setChoice(i) {
  if (game.screen === 'difficultySelect') game.difficultyChoice = i;
  else if (game.screen === 'trackSelect') game.trackChoice = i;
  else if (game.screen === 'carSelect') game.carChoice = i;
}

window.addEventListener('keydown', (e) => {
  Sound.init();
  if (e.repeat) return;
  if (e.code === 'KeyM') Sound.toggleMute();
  if (game.screen === 'race') {
    if (e.code === 'Escape') game.screen = 'difficultySelect';
    if (e.code === 'KeyR' || (e.code === 'Enter' && playerFinished())) startRace();
    return;
  }
  const columns = game.screen === 'carSelect' ? 3 : game.screen === 'trackSelect' ? 2 : 1;
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') moveChoice(-1);
  if (e.code === 'ArrowRight' || e.code === 'KeyD') moveChoice(1);
  if ((e.code === 'ArrowUp' || e.code === 'KeyW') && columns > 1) moveChoice(-columns);
  if ((e.code === 'ArrowDown' || e.code === 'KeyS') && columns > 1) moveChoice(columns);
  if (e.code === 'Enter' || e.code === 'Space') confirmChoice();
  if (e.code === 'Escape' && game.screen === 'carSelect') game.screen = 'trackSelect';
  else if (e.code === 'Escape' && game.screen === 'trackSelect') game.screen = 'difficultySelect';
});

function pointerToWorld(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * WORLD_WIDTH,
    y: ((e.clientY - rect.top) / rect.height) * WORLD_HEIGHT,
  };
}

function cardAt(p) {
  return cardsForScreen().findIndex((c) => p.x >= c.x && p.x <= c.x + c.w && p.y >= c.y && p.y <= c.y + c.h);
}

canvas.addEventListener('mousemove', (e) => {
  const i = cardAt(pointerToWorld(e));
  canvas.style.cursor = i >= 0 ? 'pointer' : 'default';
  if (i >= 0) setChoice(i);
});

canvas.addEventListener('click', (e) => {
  canvas.focus();
  Sound.init();
  const i = cardAt(pointerToWorld(e));
  if (i >= 0) {
    setChoice(i);
    confirmChoice();
  }
});

// ---------------------------------------------------------------------------
// ATUALIZAR: toda a lógica da corrida
function update(dt) {
  if (game.screen !== 'race') {
    Sound.update(null);
    return;
  }
  Sound.update(game.player);
  if (game.recordFlash > 0) game.recordFlash -= dt;

  if (game.raceState === 'countdown') {
    const before = Math.ceil(game.countdown);
    game.countdown -= dt;
    if (Math.ceil(game.countdown) !== before && game.countdown > 0) Sound.beep(440);
    if (game.countdown <= 0) {
      game.raceState = 'racing';
      Sound.beep(880, 0.4);
    }
  } else {
    game.raceTime += dt;
  }

  const canDrive = game.raceState === 'racing';
  game.cars.forEach((car) => {
    car.update(dt, game.track, canDrive);
    if (canDrive) checkLaps(car);
  });

  for (let i = 0; i < game.cars.length; i++) {
    for (let j = i + 1; j < game.cars.length; j++) collideCars(game.cars[i], game.cars[j]);
  }

  // Marcas de pneu, fumaça e poeira
  skidCtx.fillStyle = 'rgba(20,20,20,0.35)';
  game.cars.forEach((car) => {
    const speed = Math.hypot(car.vx, car.vy);
    if (car.isSkidding() && car.onRoad) {
      car.rearWheels().forEach((w) => {
        skidCtx.fillRect(w.x - 1.5, w.y - 1.5, 3, 3);
        if (Math.random() < 0.25) spawnParticle(w.x, w.y, 'rgba(235,235,235,', 6);
      });
    } else if (!car.onRoad && speed > 60 && Math.random() < 0.5) {
      const w = car.rearWheels()[Math.random() < 0.5 ? 0 : 1];
      spawnParticle(w.x, w.y, 'rgba(150,115,60,', 5);
    }
  });

  particles.forEach((pt) => {
    pt.life -= dt;
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.size += 14 * dt;
  });
  particles = particles.filter((pt) => pt.life > 0);
}

let particles = [];
function spawnParticle(x, y, color, size) {
  if (particles.length > 300) return;
  particles.push({
    x, y, color, size,
    vx: (Math.random() - 0.5) * 30,
    vy: (Math.random() - 0.5) * 30,
    life: 0.7, maxLife: 0.7,
  });
}

function drawParticles() {
  particles.forEach((pt) => {
    ctx.fillStyle = pt.color + (0.45 * pt.life / pt.maxLife).toFixed(3) + ')';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function checkLaps(car) {
  if (car.finishTime !== null) return;
  const track = game.track;
  if (!track.reachedCheckpoint(car.nextCheckpoint, car.trackIndex)) return;

  if (car.nextCheckpoint === 0) {
    // Cruzou a linha de chegada depois de passar por todos os checkpoints
    const lapTime = game.raceTime - car.lapStartTime;
    car.bestLap = car.bestLap === null ? lapTime : Math.min(car.bestLap, lapTime);
    car.lapStartTime = game.raceTime;
    car.lap++;
    if (car === game.player) {
      Sound.beep(660, 0.12);
      if (Records.submit(game.track.name, lapTime)) game.recordFlash = 2.5;
    }
    if (car.lap >= LAPS_TO_WIN) {
      car.finishTime = game.raceTime;
      game.finishOrder.push(car);
      // Depois de cruzar a chegada, o computador dá a volta de desaceleração
      if (car === game.player) car.controller = new AIController(0.55, 0);
    }
  }
  car.nextCheckpoint = (car.nextCheckpoint + 1) % track.checkpointCount;
}

// Quanto da corrida cada carro já percorreu (para saber a posição)
function raceProgress(car) {
  const track = game.track;
  const n = track.points.length;
  const cc = track.checkpointCount;
  const lastCp = (car.nextCheckpoint - 1 + cc) % cc;
  const cpIndex = track.checkpoints[lastCp];
  let delta = (car.trackIndex - cpIndex + n) % n;
  if (delta > n / 2) delta -= n; // ainda atrás do checkpoint (ex.: no grid)
  return car.lap * n + cpIndex + delta;
}

function standings() {
  const running = game.cars
    .filter((c) => c.finishTime === null)
    .sort((a, b) => raceProgress(b) - raceProgress(a));
  return [...game.finishOrder, ...running];
}

function playerFinished() {
  return game.player && game.player.finishTime !== null;
}

// ---------------------------------------------------------------------------
// DESENHAR
function draw() {
  ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
  if (game.screen === 'difficultySelect') drawDifficultySelect();
  else if (game.screen === 'trackSelect') drawTrackSelect();
  else if (game.screen === 'carSelect') drawCarSelect();
  else drawRace();
}

function drawGrass() {
  ctx.fillStyle = '#3f8f3f';
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  // Faixas de grama cortada
  ctx.fillStyle = 'rgba(255,255,255,0.045)';
  for (let x = -WORLD_HEIGHT; x < WORLD_WIDTH; x += 120) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 60, 0);
    ctx.lineTo(x + 60 + WORLD_HEIGHT, WORLD_HEIGHT);
    ctx.lineTo(x + WORLD_HEIGHT, WORLD_HEIGHT);
    ctx.fill();
  }
}

function drawRace() {
  ctx.drawImage(trackBackground(game.track), 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  ctx.drawImage(skidLayer, 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  drawParticles();
  game.cars.forEach((car) => car.draw(ctx));
  drawPlayerMarker();
  drawHud();
}

function drawPlayerMarker() {
  const p = game.player;
  ctx.fillStyle = UI.accent;
  ctx.strokeStyle = '#111';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(p.x, p.y - 22);
  ctx.lineTo(p.x - 6, p.y - 32);
  ctx.lineTo(p.x + 6, p.y - 32);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function formatTime(t) {
  if (t === null) return '--:--.--';
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
}

function ordinal(n) {
  return `${n}º`;
}

function drawHud() {
  const p = game.player;
  const order = standings();
  const position = order.indexOf(p) + 1;
  const lap = Math.min(p.lap + 1, LAPS_TO_WIN);

  // Painel principal (compacto, para não cobrir a pista)
  ctx.fillStyle = 'rgba(15,16,20,0.72)';
  ctx.beginPath();
  ctx.roundRect(10, 8, 330, 54, 10);
  ctx.fill();

  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillStyle = UI.accent;
  ctx.font = `36px ${FONT}`;
  ctx.fillText(ordinal(position), 20, 14);
  ctx.fillStyle = UI.muted;
  ctx.font = `13px ${FONT}`;
  ctx.fillText(`/ ${game.cars.length}`, 76, 38);

  ctx.fillStyle = UI.text;
  ctx.font = `16px ${FONT}`;
  ctx.fillText(`VOLTA ${lap}/${LAPS_TO_WIN}`, 118, 15);
  ctx.fillText(formatTime(game.raceTime), 228, 15);
  ctx.font = `13px ${FONT}`;
  ctx.fillStyle = UI.muted;
  ctx.fillText(`Melhor ${formatTime(p.bestLap)}  ·  Recorde ${formatTime(Records.get(game.track.name))}`, 118, 38);

  // Nome da pista
  ctx.textAlign = 'right';
  ctx.fillStyle = 'rgba(15,16,20,0.72)';
  const label = `${game.track.name} · ${DIFFICULTIES[game.difficultyChoice].name} · M: som ${Sound.muted ? 'off' : 'on'}`;
  ctx.font = `15px ${FONT}`;
  const w = ctx.measureText(label).width + 28;
  ctx.beginPath();
  ctx.roundRect(WORLD_WIDTH - 10 - w, 8, w, 30, 8);
  ctx.fill();
  ctx.fillStyle = UI.text;
  ctx.fillText(label, WORLD_WIDTH - 24, 16);
  ctx.textAlign = 'left';

  if (game.raceState === 'countdown') {
    bigText(String(Math.ceil(game.countdown)));
  } else if (game.raceTime < 1) {
    bigText('VAI!');
  } else if (game.recordFlash > 0 && !playerFinished()) {
    ctx.textAlign = 'center';
    ctx.font = `32px ${FONT}`;
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#111';
    ctx.strokeText('NOVO RECORDE DE VOLTA!', WORLD_WIDTH / 2, 90);
    ctx.fillStyle = UI.accent;
    ctx.fillText('NOVO RECORDE DE VOLTA!', WORLD_WIDTH / 2, 90);
    ctx.textAlign = 'left';
  }

  if (playerFinished()) drawResults(order);
}

function drawResults(order) {
  const x = WORLD_WIDTH / 2 - 230;
  const y = 230;
  ctx.fillStyle = 'rgba(15,16,20,0.88)';
  ctx.beginPath();
  ctx.roundRect(x, y, 460, 300, 16);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = UI.accent;
  ctx.font = `34px ${FONT}`;
  const pos = order.indexOf(game.player) + 1;
  ctx.fillText(pos === 1 ? 'VOCÊ VENCEU!' : `VOCÊ CHEGOU EM ${ordinal(pos)}`, WORLD_WIDTH / 2, y + 24);

  order.forEach((car, i) => {
    const rowY = y + 90 + i * 46;
    ctx.textAlign = 'left';
    ctx.fillStyle = UI.muted;
    ctx.font = `22px ${FONT}`;
    ctx.fillText(ordinal(i + 1), x + 36, rowY);
    ctx.save();
    ctx.translate(x + 105, rowY + 11);
    drawF1(ctx, car.model, 0, false);
    ctx.restore();
    ctx.fillStyle = car === game.player ? UI.accent : UI.text;
    ctx.fillText(car.name + (car === game.player ? ' (você)' : ''), x + 140, rowY);
    ctx.textAlign = 'right';
    ctx.fillStyle = UI.muted;
    ctx.font = `18px ${FONT}`;
    ctx.fillText(car.finishTime !== null ? formatTime(car.finishTime) : 'correndo…', x + 430, rowY + 3);
  });

  ctx.textAlign = 'center';
  ctx.fillStyle = UI.muted;
  ctx.font = `16px ${FONT}`;
  ctx.fillText('Enter: correr de novo   ·   Esc: menu', WORLD_WIDTH / 2, y + 258);
  ctx.textAlign = 'left';
}

function bigText(text) {
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `96px ${FONT}`;
  ctx.lineWidth = 10;
  ctx.strokeStyle = '#111';
  ctx.strokeText(text, WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
  ctx.fillStyle = UI.accent;
  ctx.fillText(text, WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
}

// ---------------------------------------------------------------------------
// Telas de menu
function drawMenuBackground(subtitle) {
  ctx.fillStyle = UI.bg;
  ctx.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

  // Faixa quadriculada no topo
  const size = 14;
  for (let x = 0; x < WORLD_WIDTH; x += size) {
    for (let r = 0; r < 2; r++) {
      ctx.fillStyle = (x / size + r) % 2 === 0 ? '#f4f4f6' : '#111';
      ctx.fillRect(x, r * size, size, size);
    }
  }

  // Logo
  ctx.save();
  ctx.translate(WORLD_WIDTH / 2, 92);
  ctx.transform(1, 0, -0.18, 1, 0, 0); // inclinado, dá sensação de velocidade
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `86px ${FONT}`;
  ctx.lineWidth = 12;
  ctx.strokeStyle = '#111';
  ctx.strokeText(GAME_NAME.toUpperCase(), 0, 0);
  ctx.fillStyle = UI.accent;
  ctx.fillText(GAME_NAME.toUpperCase(), 0, 0);
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle = UI.text;
  ctx.font = `24px ${FONT}`;
  ctx.fillText(subtitle, WORLD_WIDTH / 2, 145);

  ctx.fillStyle = UI.muted;
  ctx.font = `15px ${FONT}`;
  ctx.fillText('Setas ou mouse para escolher   ·   Enter ou clique para confirmar   ·   Esc para voltar', WORLD_WIDTH / 2, 765);
  ctx.textAlign = 'left';
}

function drawCard(card, selected) {
  ctx.fillStyle = selected ? UI.panelHover : UI.panel;
  ctx.beginPath();
  ctx.roundRect(card.x, card.y, card.w, card.h, 16);
  ctx.fill();
  if (selected) {
    ctx.strokeStyle = UI.accent;
    ctx.lineWidth = 4;
    ctx.stroke();
  }
}

function drawTrackSelect() {
  drawMenuBackground('Escolha a pista');
  TRACK_CARDS.forEach((card, i) => {
    const track = TRACKS[i];
    const selected = game.trackChoice === i;
    drawCard(card, selected);

    // Miniatura da pista
    const pad = 20;
    const s = Math.min((card.w - pad * 2) / WORLD_WIDTH, (card.h - 70) / WORLD_HEIGHT);
    const px = card.x + (card.w - WORLD_WIDTH * s) / 2;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(px, card.y + 14, WORLD_WIDTH * s, WORLD_HEIGHT * s, 10);
    ctx.clip();
    ctx.translate(px, card.y + 14);
    ctx.scale(s, s);
    ctx.drawImage(trackBackground(track), 0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.fillStyle = selected ? UI.accent : UI.text;
    ctx.font = `22px ${FONT}`;
    ctx.fillText(track.name, card.x + card.w / 2, card.y + card.h - 44);
    ctx.fillStyle = UI.muted;
    ctx.font = `13px ${FONT}`;
    const record = Records.get(track.name);
    ctx.fillText(`Pista ${i + 1} · ${LAPS_TO_WIN} voltas` + (record ? ` · Recorde ${formatTime(record)}` : ''), card.x + card.w / 2, card.y + card.h - 20);
    ctx.textAlign = 'left';
  });
}

const STAT_LABELS = [
  ['acceleration', 'Aceleração'],
  ['topSpeed', 'Velocidade máx.'],
  ['handling', 'Curva'],
];

function drawCarSelect() {
  drawMenuBackground(`Escolha o seu carro  ·  ${TRACKS[game.trackChoice].name}  ·  ${DIFFICULTIES[game.difficultyChoice].name}`);
  CAR_CARDS.forEach((card, i) => {
    const model = CAR_MODELS[i];
    const selected = game.carChoice === i;
    drawCard(card, selected);

    // Carro grande, apontando para cima
    ctx.save();
    ctx.translate(card.x + 85, card.y + card.h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.scale(4, 4);
    drawF1(ctx, model, 0, false);
    ctx.restore();

    const tx = card.x + 165;
    ctx.textAlign = 'left';
    ctx.fillStyle = selected ? UI.accent : UI.text;
    ctx.font = `26px ${FONT}`;
    ctx.fillText(model.name, tx, card.y + 30);

    // Barras de atributos (1 a 5)
    STAT_LABELS.forEach(([key, label], row) => {
      const y = card.y + 85 + row * 52;
      ctx.fillStyle = UI.muted;
      ctx.font = `13px ${FONT}`;
      ctx.fillText(label, tx, y);
      for (let k = 0; k < 5; k++) {
        ctx.fillStyle = k < model.stats[key] ? model.color : '#454a56';
        ctx.beginPath();
        ctx.roundRect(tx + k * 34, y + 20, 30, 11, 4);
        ctx.fill();
      }
    });
  });
}

function drawDifficultySelect() {
  drawMenuBackground('Escolha a dificuldade');
  DIFFICULTY_CARDS.forEach((card, i) => {
    const d = DIFFICULTIES[i];
    const selected = game.difficultyChoice === i;
    drawCard(card, selected);
    ctx.textAlign = 'center';
    // Velocímetro: quanto mais difícil, mais cheio
    const cx = card.x + card.w / 2;
    const cy = card.y + 125;
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#454a56';
    ctx.beginPath();
    ctx.arc(cx, cy, 62, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();
    ctx.strokeStyle = ['#3ecf6e', UI.accent, '#ff4d4d'][i];
    ctx.beginPath();
    ctx.arc(cx, cy, 62, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * (i + 1) / 3));
    ctx.stroke();
    ctx.fillStyle = selected ? UI.accent : UI.text;
    ctx.font = `30px ${FONT}`;
    ctx.fillText(d.name, cx, card.y + 200);
    ctx.fillStyle = UI.muted;
    ctx.font = `14px ${FONT}`;
    wrapText(d.description, cx, card.y + 245, card.w - 40, 20);
    ctx.textAlign = 'left';
  });
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  let line = '';
  for (const word of text.split(' ')) {
    const test = line ? line + ' ' + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, y);
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

requestAnimationFrame(loop);
