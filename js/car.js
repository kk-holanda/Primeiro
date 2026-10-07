const NO_INPUT = { throttle: 0, brake: 0, steer: 0, handbrake: false };

class Car {
  constructor(model, controller) {
    this.model = model;
    this.name = model.name;
    this.color = model.color;
    this.perf = carPerformance(model.stats);
    this.controller = controller;
  }

  reset(pose) {
    this.x = pose.x;
    this.y = pose.y;
    this.angle = pose.angle;
    this.vx = 0;
    this.vy = 0;
    this.lateralSpeed = 0;
    this.steer = 0;

    this.lap = 0;
    this.nextCheckpoint = 1;
    this.lapStartTime = 0;
    this.bestLap = null;
    this.finishTime = null;
    this.onRoad = true;
    this.trackIndex = 0;
    this.wheelSpin = 0;
    this.braking = false;

    // Gasolina (modo Gabispeed)
    this.fuel = 1;
    this.outOfFuel = false;
    this.wantsPit = false;
    this.refueling = false;
  }

  // dt = tempo (em segundos) desde o último quadro
  update(dt, track, canDrive) {
    const near = track.nearest(this.x, this.y);
    this.onRoad = near.distance < track.width / 2;
    this.trackIndex = near.index;

    const input = canDrive ? this.controller.getInput(this, track, dt) : NO_INPUT;

    // --- O segredo do drift ---------------------------------------------
    // Dividimos a velocidade em duas partes:
    //   forward: na direção para onde o carro aponta
    //   lateral: de lado (é o "escorregão")
    const fx = Math.cos(this.angle);
    const fy = Math.sin(this.angle);
    const rx = -fy;
    const ry = fx;

    let forward = this.vx * fx + this.vy * fy;
    let lateral = this.vx * rx + this.vy * ry;
    this.braking = input.brake > 0 && forward > 120;

    // Acelerar / frear / ré
    forward += input.throttle * this.perf.acceleration * dt;
    if (input.brake) forward -= input.brake * (forward > 0 ? PHYSICS.brake : PHYSICS.reverseAccel) * dt;

    // Atrito de rolagem (o carro perde velocidade sozinho)
    const friction = this.onRoad ? PHYSICS.rollingFriction : PHYSICS.grassFriction;
    forward *= Math.pow(friction, dt);

    // Limite de velocidade (na grama é bem menor)
    const maxSpeed = this.perf.maxSpeed * (this.onRoad ? 1 : PHYSICS.grassSpeedFactor) *
      (this.outOfFuel ? FUEL.emptySpeedFactor : 1);
    if (forward > maxSpeed) forward += (maxSpeed - forward) * Math.min(1, 4 * dt);
    if (forward < -PHYSICS.maxReverse) forward = -PHYSICS.maxReverse;

    // Aderência: elimina parte da velocidade lateral.
    // Com freio de mão a aderência cai e o carro derrapa!
    let grip = this.onRoad ? this.perf.grip : PHYSICS.gripGrass;
    if (input.handbrake) {
      grip = PHYSICS.gripHandbrake;
      forward *= Math.pow(0.7, dt);
    }
    lateral *= Math.exp(-grip * dt);

    // Remonta a velocidade a partir das duas partes
    this.vx = fx * forward + rx * lateral;
    this.vy = fy * forward + ry * lateral;
    this.lateralSpeed = lateral;
    this.forwardSpeed = forward;

    // Volante: só vira se o carro estiver andando (e inverte na ré)
    this.steer += (input.steer - this.steer) * Math.min(1, 14 * dt); // suaviza o volante
    // Em alta velocidade o volante fica um pouco mais "pesado" (mais estável)
    const highSpeedDamping = 1 - 0.25 * Math.min(1, Math.abs(forward) / this.perf.maxSpeed);
    const speedFactor = Math.max(-1, Math.min(1, forward / 110)) * highSpeedDamping;
    this.angle += this.steer * this.perf.turnSpeed * speedFactor * dt;

    this.wheelSpin += forward * dt; // para desenhar os pneus girando

    // Move
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.bounceOffWorldEdges();
  }

  bounceOffWorldEdges() {
    const r = PHYSICS.radius;
    if (this.x < r) { this.x = r; this.vx = Math.abs(this.vx) * 0.4; }
    if (this.x > WORLD_WIDTH - r) { this.x = WORLD_WIDTH - r; this.vx = -Math.abs(this.vx) * 0.4; }
    if (this.y < r) { this.y = r; this.vy = Math.abs(this.vy) * 0.4; }
    if (this.y > WORLD_HEIGHT - r) { this.y = WORLD_HEIGHT - r; this.vy = -Math.abs(this.vy) * 0.4; }
  }

  // Posições das rodas traseiras (para as marcas de pneu)
  rearWheels() {
    const fx = Math.cos(this.angle);
    const fy = Math.sin(this.angle);
    const bx = this.x - fx * 13;
    const by = this.y - fy * 13;
    const w = 10;
    return [
      { x: bx - fy * w, y: by + fx * w },
      { x: bx + fy * w, y: by - fx * w },
    ];
  }

  isSkidding() {
    return Math.abs(this.lateralSpeed) > 70;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    drawF1(ctx, this.model, this.steer, true, this.wheelSpin);
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Desenho do carro de Fórmula 1 visto de cima, estilo cartoon.
// O carro aponta para a direita (+x) e tem ~42 px de comprimento.
function drawF1(ctx, model, steer = 0, shadow = true, spin = 0) {
  const OUTLINE = '#141414';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Sombra
  if (shadow) {
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(2, 3, 21, 11, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Braços da suspensão
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(-13, -4); ctx.lineTo(-13, -9);
  ctx.moveTo(-13, 4); ctx.lineTo(-13, 9);
  ctx.moveTo(8, -3); ctx.lineTo(11, -8.5);
  ctx.moveTo(8, 3); ctx.lineTo(11, 8.5);
  ctx.stroke();

  // Pneus (os da frente viram com o volante)
  drawTire(ctx, -13, -10.5, 0, 11, 7.5, spin);
  drawTire(ctx, -13, 10.5, 0, 11, 7.5, spin);
  drawTire(ctx, 11, -10, steer * 0.45, 9, 6.5, spin);
  drawTire(ctx, 11, 10, steer * 0.45, 9, 6.5, spin);

  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1.3;

  // Asa traseira
  ctx.fillStyle = model.color;
  ctx.beginPath();
  ctx.roundRect(-22, -9.5, 5.5, 19, 1.5);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = model.dark;
  ctx.fillRect(-20.5, -8, 1.4, 16);

  // Carroceria (bico fino, laterais largas)
  ctx.fillStyle = model.color;
  ctx.beginPath();
  ctx.moveTo(-18, -2.8);
  ctx.lineTo(-12, -5.5);
  ctx.quadraticCurveTo(-6, -8.2, 1, -7);
  ctx.quadraticCurveTo(4, -6.4, 5, -4);
  ctx.lineTo(14, -2);
  ctx.quadraticCurveTo(20, -1.4, 20.5, 0);
  ctx.quadraticCurveTo(20, 1.4, 14, 2);
  ctx.lineTo(5, 4);
  ctx.quadraticCurveTo(4, 6.4, 1, 7);
  ctx.quadraticCurveTo(-6, 8.2, -12, 5.5);
  ctx.lineTo(-18, 2.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Sombreado e brilho (dá o volume de desenho animado)
  ctx.fillStyle = model.dark;
  ctx.beginPath();
  ctx.ellipse(-4, 5.2, 6, 1.6, 0, 0, Math.PI * 2);
  ctx.ellipse(-4, -5.2, 6, 1.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = model.light;
  ctx.beginPath();
  ctx.ellipse(-3, -4.4, 4.5, 1.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(6, -0.6); ctx.lineTo(17, -0.4); ctx.lineTo(17, 0.4); ctx.lineTo(6, 0.6);
  ctx.fill();

  // Tampa do motor / entrada de ar
  ctx.fillStyle = model.dark;
  ctx.beginPath();
  ctx.ellipse(-10, 0, 5, 2.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(-5.5, 0, 1.8, 1.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cockpit e capacete
  ctx.fillStyle = '#1a1a1a';
  ctx.beginPath();
  ctx.ellipse(0.5, 0, 4.2, 2.9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fafafa';
  ctx.beginPath();
  ctx.arc(0, 0, 2.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = model.dark;
  ctx.fillRect(0.6, -1.4, 1.2, 2.8);

  // Halo (a barra de proteção sobre o piloto)
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-3, -3);
  ctx.quadraticCurveTo(6, -2.6, 5.5, 0);
  ctx.quadraticCurveTo(6, 2.6, -3, 3);
  ctx.stroke();

  // Asa dianteira
  ctx.strokeStyle = OUTLINE;
  ctx.fillStyle = model.color;
  ctx.beginPath();
  ctx.roundRect(16.5, -12, 4, 24, 1.2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = model.dark;
  ctx.fillRect(17, -12, 3, 2.5);
  ctx.fillRect(17, 9.5, 3, 2.5);
}

function drawTire(ctx, x, y, angle, length, width, spin = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = '#151515';
  ctx.beginPath();
  ctx.roundRect(-length / 2, -width / 2, length, width, 2.2);
  ctx.fill();
  ctx.clip();
  // Sulcos do pneu: andam conforme o carro anda, parecendo girar
  ctx.fillStyle = '#3c3c3c';
  const gap = length / 3;
  const offset = ((spin * 0.6) % gap + gap) % gap;
  for (let k = -1; k < 3; k++) {
    ctx.fillRect(-length / 2 + offset + k * gap, -width / 2, 1.3, width);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.fillRect(-length / 2, -width / 2, length, 1.2);
  ctx.restore();
}

// Colisão simples entre dois carros (como dois círculos)
function collideCars(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = PHYSICS.radius * 2;
  if (dist === 0 || dist >= minDist) return;

  const nx = dx / dist;
  const ny = dy / dist;

  // Separa os carros
  const overlap = (minDist - dist) / 2;
  a.x -= nx * overlap;
  a.y -= ny * overlap;
  b.x += nx * overlap;
  b.y += ny * overlap;

  // Troca a velocidade na direção do impacto (batida "elástica")
  const relative = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
  if (relative > 0) {
    const impulse = relative * 0.9;
    a.vx -= impulse * nx;
    a.vy -= impulse * ny;
    b.vx += impulse * nx;
    b.vy += impulse * ny;
  }
}
