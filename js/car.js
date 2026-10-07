class Car {
  constructor(name, color, controls) {
    this.name = name;
    this.color = color;
    this.controls = controls;
  }

  reset(pose) {
    this.x = pose.x;
    this.y = pose.y;
    this.angle = pose.angle;
    this.vx = 0;
    this.vy = 0;
    this.lateralSpeed = 0;

    this.lap = 0;
    this.nextCheckpoint = 1;
    this.lapStartTime = 0;
    this.bestLap = null;
    this.finishTime = null;
    this.onRoad = true;
  }

  // dt = tempo (em segundos) desde o último quadro
  update(dt, track, canDrive) {
    const c = this.controls;
    const up = canDrive && keys[c.up];
    const down = canDrive && keys[c.down];
    const left = canDrive && keys[c.left];
    const right = canDrive && keys[c.right];
    const handbrake = canDrive && keys[c.handbrake];

    const near = track.nearest(this.x, this.y);
    this.onRoad = near.distance < track.width / 2;
    this.trackIndex = near.index;

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

    // Acelerar / frear / ré
    if (up) forward += CAR.acceleration * dt;
    if (down) forward -= (forward > 0 ? CAR.brake : CAR.reverseAccel) * dt;

    // Atrito de rolagem (o carro perde velocidade sozinho)
    const friction = this.onRoad ? CAR.rollingFriction : CAR.grassFriction;
    forward *= Math.pow(friction, dt);

    // Limite de velocidade (na grama é bem menor)
    const maxSpeed = this.onRoad ? CAR.maxSpeed : CAR.maxSpeedGrass;
    if (forward > maxSpeed) forward += (maxSpeed - forward) * Math.min(1, 4 * dt);
    if (forward < -CAR.maxReverse) forward = -CAR.maxReverse;

    // Aderência: elimina parte da velocidade lateral.
    // Com freio de mão a aderência cai e o carro derrapa!
    let grip = this.onRoad ? CAR.grip : CAR.gripGrass;
    if (handbrake) {
      grip = CAR.gripHandbrake;
      forward *= Math.pow(0.7, dt);
    }
    lateral *= Math.exp(-grip * dt);

    // Remonta a velocidade a partir das duas partes
    this.vx = fx * forward + rx * lateral;
    this.vy = fy * forward + ry * lateral;
    this.lateralSpeed = lateral;

    // Volante: só vira se o carro estiver andando (e inverte na ré)
    const steer = (right ? 1 : 0) - (left ? 1 : 0);
    const speedFactor = Math.max(-1, Math.min(1, forward / 120));
    this.angle += steer * CAR.turnSpeed * speedFactor * dt;

    // Move
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.bounceOffWorldEdges();
  }

  bounceOffWorldEdges() {
    const r = CAR.radius;
    if (this.x < r) { this.x = r; this.vx = Math.abs(this.vx) * 0.4; }
    if (this.x > WORLD_WIDTH - r) { this.x = WORLD_WIDTH - r; this.vx = -Math.abs(this.vx) * 0.4; }
    if (this.y < r) { this.y = r; this.vy = Math.abs(this.vy) * 0.4; }
    if (this.y > WORLD_HEIGHT - r) { this.y = WORLD_HEIGHT - r; this.vy = -Math.abs(this.vy) * 0.4; }
  }

  // Posições das rodas traseiras (para as marcas de pneu)
  rearWheels() {
    const fx = Math.cos(this.angle);
    const fy = Math.sin(this.angle);
    const bx = this.x - fx * CAR.length * 0.35;
    const by = this.y - fy * CAR.length * 0.35;
    const w = CAR.width * 0.4;
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

    const L = CAR.length;
    const W = CAR.width;

    // Sombra
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(-L / 2 + 3, -W / 2 + 3, L, W);

    // Rodas
    ctx.fillStyle = '#111';
    ctx.fillRect(-L / 2 + 2, -W / 2 - 2, 8, 4);
    ctx.fillRect(-L / 2 + 2, W / 2 - 2, 8, 4);
    ctx.fillRect(L / 2 - 10, -W / 2 - 2, 8, 4);
    ctx.fillRect(L / 2 - 10, W / 2 - 2, 8, 4);

    // Carroceria
    ctx.fillStyle = this.color;
    ctx.fillRect(-L / 2, -W / 2, L, W);

    // Para-brisa (indica a frente do carro)
    ctx.fillStyle = 'rgba(20,30,50,0.85)';
    ctx.fillRect(L / 2 - 13, -W / 2 + 3, 6, W - 6);

    ctx.restore();
  }
}

// Colisão simples entre dois carros (como dois círculos)
function collideCars(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = CAR.radius * 2;
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
