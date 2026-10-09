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
    this.wheelBlur = 0;
    this.braking = false;

    // Gasolina (modo Gabispeed)
    this.fuel = 1;
    this.outOfFuel = false;
    this.wantsPit = false;
    this.refueling = false;
    // Estratégia: com quantas voltas de gasolina restantes decide ir ao box
    // (cada carro um pouco diferente, para não chegarem todos juntos)
    this.pitMargin = 1.35 + Math.random() * 0.6;
  }

  // dt = tempo (em segundos) desde o último quadro
  update(dt, track, canDrive) {
    const near = track.nearest(this.x, this.y);
    this.onRoad = near.distance < track.width / 2;
    this.trackIndex = near.index;

    // Faixa de box (modo Gabispeed): também é asfalto, mas tem limite de velocidade
    this.inPitLane = false;
    if (track.pitLane) {
      const pit = track.pitLane.nearest(this.x, this.y);
      if (pit.distance < PIT.laneWidth / 2) {
        this.onRoad = true;
        this.inPitLane = track.pitLane.center[pit.index].ease > 0.9;
      }
      this.pitLaneIndex = pit.distance < PIT.laneWidth ? pit.index : -1;
    }

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
    if (this.inPitLane && forward > PIT.speedLimit) {
      forward += (PIT.speedLimit - forward) * Math.min(1, 6 * dt); // limitador do box
    }

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

    // Giro dos pneus. No desenho, a velocidade do giro é limitada: se os sulcos
    // andassem rápido demais entre um quadro e outro, pareceriam parados
    // (o mesmo efeito da roda de carro que "gira ao contrário" nos filmes).
    this.wheelSpin += Math.max(-150, Math.min(150, forward)) * 0.2 * dt;
    this.wheelBlur = Math.max(0, Math.min(1, (Math.abs(forward) - 90) / 260));

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
    drawF1(ctx, this.model, this.steer, true, this.wheelSpin, this.wheelBlur);
    ctx.restore();
  }
}

// ---------------------------------------------------------------------------
// Desenho do carro de Fórmula 1 visto de cima, estilo cartoon.
// O carro aponta para a direita (+x) e tem ~46 px de comprimento.
// detail = true desenha também o número (usado nos menus, onde o carro é grande).
function drawF1(ctx, model, steer = 0, shadow = true, spin = 0, blur = 0, detail = false) {
  const OUTLINE = '#141414';
  const mirror = (fn) => [-1, 1].forEach(fn); // desenha os dois lados do carro
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Sombra (duas camadas: uma larga e suave, outra mais forte embaixo)
  if (shadow) {
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.beginPath();
    ctx.ellipse(3, 4, 25, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath();
    ctx.ellipse(2, 3, 20, 9, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Assoalho: base escura que aparece em volta das laterais
  ctx.fillStyle = '#202226';
  ctx.beginPath();
  ctx.moveTo(-18.5, -4);
  ctx.lineTo(-14, -7.8);
  ctx.lineTo(4, -8.8);
  ctx.quadraticCurveTo(7.5, -8.4, 8, -5.5);
  ctx.lineTo(8, 5.5);
  ctx.quadraticCurveTo(7.5, 8.4, 4, 8.8);
  ctx.lineTo(-14, 7.8);
  ctx.lineTo(-18.5, 4);
  ctx.closePath();
  ctx.fill();

  // Braços da suspensão (dois por roda)
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  mirror((s) => {
    ctx.moveTo(-11.5, 4 * s); ctx.lineTo(-13, 9 * s);
    ctx.moveTo(-15.5, 3.5 * s); ctx.lineTo(-13, 9 * s);
    ctx.moveTo(6, 2.5 * s); ctx.lineTo(11, 8.5 * s);
    ctx.moveTo(10.5, 1.8 * s); ctx.lineTo(11, 8.5 * s);
  });
  ctx.stroke();

  // Pneus (os da frente viram com o volante)
  drawTire(ctx, -13, -10.5, 0, 11, 7.5, spin, blur);
  drawTire(ctx, -13, 10.5, 0, 11, 7.5, spin, blur);
  drawTire(ctx, 11, -10, steer * 0.45, 9, 6.5, spin, blur);
  drawTire(ctx, 11, 10, steer * 0.45, 9, 6.5, spin, blur);

  // Asa traseira: plano principal, flap e placas laterais
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1.2;
  ctx.fillStyle = model.color;
  ctx.beginPath();
  ctx.roundRect(-23.5, -10.5, 6.5, 21, 1.2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = model.dark;
  ctx.fillRect(-21.6, -9, 1.5, 18);
  ctx.fillStyle = model.accent;
  ctx.fillRect(-23.5, -10.5, 6.5, 2);
  ctx.fillRect(-23.5, 8.5, 6.5, 2);
  // luz de chuva
  ctx.fillStyle = '#ff3b3b';
  ctx.fillRect(-24.6, -0.9, 1.2, 1.8);

  // Carroceria (bico fino, laterais largas) com degradê para dar volume
  const body = ctx.createLinearGradient(0, -8, 0, 8);
  body.addColorStop(0, model.light);
  body.addColorStop(0.32, model.color);
  body.addColorStop(1, model.dark);
  ctx.fillStyle = body;
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
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Faixas de decoração na cor de destaque da equipe
  ctx.strokeStyle = model.accent;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  mirror((s) => {
    ctx.moveTo(-14, 4.3 * s);
    ctx.quadraticCurveTo(-5, 7.2 * s, 1.5, 6 * s);
  });
  ctx.stroke();
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(7, 0);
  ctx.lineTo(18.5, 0);
  ctx.stroke();

  // Entradas de ar das laterais
  ctx.fillStyle = '#16171a';
  mirror((s) => {
    ctx.beginPath();
    ctx.ellipse(3.2, 5.5 * s, 1.2, 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Tampa do motor com "barbatana" no meio
  ctx.fillStyle = model.dark;
  ctx.beginPath();
  ctx.ellipse(-10.5, 0, 6.2, 2.1, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(-17.5, 0);
  ctx.lineTo(-5, 0);
  ctx.stroke();

  // Brilho de verniz
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.ellipse(-4, -5.3, 4.2, 0.8, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(11, -1.1, 3.2, 0.45, -0.1, 0, Math.PI * 2);
  ctx.fill();

  // Retrovisores
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 0.7;
  ctx.fillStyle = '#222';
  mirror((s) => {
    ctx.beginPath();
    ctx.moveTo(3.3, 3 * s);
    ctx.lineTo(4, 5.4 * s);
    ctx.stroke();
    ctx.fillRect(3.1, s > 0 ? 5.2 : -6.4, 2.1, 1.2);
  });

  // Entrada de ar sobre o piloto
  ctx.fillStyle = '#16171a';
  ctx.beginPath();
  ctx.ellipse(-4.9, 0, 1.6, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cockpit e capacete (com viseira)
  ctx.fillStyle = '#16171a';
  ctx.beginPath();
  ctx.ellipse(0.6, 0, 4.1, 2.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = model.helmet;
  ctx.beginPath();
  ctx.arc(0, 0, 2.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.6)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  ctx.fillStyle = 'rgba(25,35,55,0.92)';
  ctx.beginPath();
  ctx.ellipse(1.25, 0, 0.75, 1.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Halo (a barra de proteção sobre o piloto), com o pilar central
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-3, -3);
  ctx.quadraticCurveTo(6, -2.6, 5.5, 0);
  ctx.quadraticCurveTo(6, 2.6, -3, 3);
  ctx.moveTo(5.5, 0);
  ctx.lineTo(3.4, 0);
  ctx.stroke();

  // Asa dianteira: dois elementos e placas laterais
  ctx.strokeStyle = OUTLINE;
  ctx.lineWidth = 1.1;
  ctx.fillStyle = model.color;
  ctx.beginPath();
  ctx.roundRect(16.3, -12.6, 3.3, 25.2, 1);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = model.dark;
  ctx.beginPath();
  ctx.roundRect(19.5, -11.8, 1.8, 23.6, 0.8);
  ctx.fill();
  ctx.fillStyle = model.accent;
  ctx.fillRect(16.1, -12.9, 5.3, 2.3);
  ctx.fillRect(16.1, 10.6, 5.3, 2.3);

  // Número do carro (só quando desenhado grande)
  if (detail) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-11.5, 0, 2.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#111';
    ctx.font = `bold 2.8px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(-11.5, 0.1);
    ctx.rotate(Math.PI / 2);
    ctx.fillText(String(model.number), 0, 0);
    ctx.restore();
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
  }
}

function drawTire(ctx, x, y, angle, length, width, spin = 0, blur = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Borracha
  ctx.fillStyle = '#161616';
  ctx.beginPath();
  ctx.roundRect(-length / 2, -width / 2, length, width, 2.4);
  ctx.fill();
  ctx.save();
  ctx.clip();

  // Sulcos em "V" que andam conforme o pneu gira
  const gap = length / 3.2;
  const offset = ((spin % gap) + gap) % gap;
  ctx.strokeStyle = `rgba(95,95,95,${1 - blur * 0.7})`;
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (let k = -2; k < 4; k++) {
    const tx = -length / 2 + offset + k * gap;
    ctx.moveTo(tx - 1.2, -width / 2 + 0.8);
    ctx.lineTo(tx + 1.2, 0);
    ctx.lineTo(tx - 1.2, width / 2 - 0.8);
  }
  ctx.stroke();

  // Em alta velocidade, borrão de movimento
  if (blur > 0) {
    ctx.fillStyle = `rgba(70,70,70,${blur * 0.55})`;
    ctx.fillRect(-length / 2, -width / 2, length, width);
    ctx.fillStyle = `rgba(150,150,150,${blur * 0.35})`;
    ctx.fillRect(-length / 2, -width * 0.2, length, 0.8);
    ctx.fillRect(-length / 2, width * 0.15, length, 0.8);
  }
  ctx.restore();

  // Laterais (paredes do pneu) com brilho
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(-length / 2 + 1.5, -width / 2, length - 3, 1);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(-length / 2 + 1.5, width / 2 - 1, length - 3, 1);
  ctx.restore();
}

// Colisão simples entre dois carros (como dois círculos)
function collideCars(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = PHYSICS.radius * 2;
  if (dist === 0 || dist >= minDist) return null;

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
    // Ponto e força da batida (para faíscas e som)
    return { x: a.x + nx * PHYSICS.radius, y: a.y + ny * PHYSICS.radius, strength: relative };
  }
  return null;
}
