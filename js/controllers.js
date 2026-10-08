// Um "controlador" decide o que o carro faz a cada quadro:
// acelerar, frear, virar... Pode ser uma pessoa (teclado) ou o computador.

// Jogador humano: WASD ou setas, Espaço = freio de mão
class HumanController {
  getInput() {
    const up = keys.KeyW || keys.ArrowUp;
    const down = keys.KeyS || keys.ArrowDown;
    const left = keys.KeyA || keys.ArrowLeft;
    const right = keys.KeyD || keys.ArrowRight;
    return {
      throttle: up ? 1 : 0,
      brake: down ? 1 : 0,
      steer: (right ? 1 : 0) - (left ? 1 : 0),
      handbrake: !!keys.Space,
    };
  }
}

// Computador: segue a linha central da pista.
//   skill: 0.0 a 1.0 — quão perto do limite ele pilota
//   lane:  -1 a 1   — de que lado da pista prefere andar
class AIController {
  constructor(skill, lane) {
    this.skill = skill;
    this.lane = lane;
    this.stuckTime = 0;
    this.reverseTime = 0;
    this.reverseSteer = 0;
    this.pitPhase = null; // null ou 'lane' (dentro da faixa de box)
  }

  getInput(car, track, dt) {
    const speed = Math.hypot(car.vx, car.vy);

    // Se ficou preso (batido, parado), dá ré por um instante
    if (this.reverseTime > 0) {
      this.reverseTime -= dt;
      return { throttle: 0, brake: 1, steer: this.reverseSteer, handbrake: false };
    }

    // Modo Gabispeed: com pouca gasolina, entra na faixa de box e para no box
    const pitInput = this.pitStopInput(car, track);
    if (pitInput && this.boxed) {
      this.stuckTime = 0; // parado de propósito, abastecendo
      return pitInput;
    }
    if (pitInput) {
      if (this.checkStuck(speed, dt, pitInput.steer)) return NO_INPUT;
      return pitInput;
    }

    // Mira num ponto um pouco à frente na pista (mais longe quanto mais rápido)
    const aimIndex = track.indexAhead(car.trackIndex, 40 + speed * 0.3);
    const aim = track.points[aimIndex];
    const h = track.headings[aimIndex];
    const offset = this.lane * track.width * 0.18;
    const tx = aim.x - Math.sin(h) * offset;
    const ty = aim.y + Math.cos(h) * offset;
    const toTarget = angleDifference(Math.atan2(ty - car.y, tx - car.x), car.angle);

    if (this.checkStuck(speed, dt, toTarget)) return NO_INPUT;

    // Olha a curva que vem pela frente: quanto mais fechada, mais devagar
    const lookFar = 60 + speed * 0.6;
    let sharpest = 0;
    for (let d = 0; d <= lookFar; d += TRACK_SPACING * 2) {
      const i = track.indexAhead(car.trackIndex, d);
      sharpest = Math.max(sharpest, Math.abs(angleDifference(track.headings[i], track.headings[car.trackIndex])));
    }
    const corner = Math.min(1, sharpest / 2.2);
    const handlingBonus = car.perf.turnSpeed / 3.4;
    const targetSpeed = car.perf.maxSpeed * this.skill * (1 - corner * 0.62 / handlingBonus);

    const forward = car.forwardSpeed || 0;
    return {
      throttle: forward < targetSpeed ? 1 : 0,
      brake: forward > targetSpeed + 35 ? 1 : 0,
      steer: Math.max(-1, Math.min(1, toTarget * 3)),
      handbrake: false,
    };
  }
}

// Modo Gabispeed: entra na faixa de box, para no box da equipe e sai
// Parado há mais de 1,2 s sem querer? Começa a dar ré (no próximo quadro)
AIController.prototype.checkStuck = function (speed, dt, steerDirection) {
  this.stuckTime = speed < 25 ? this.stuckTime + dt : 0;
  if (this.stuckTime < 1.2) return false;
  this.stuckTime = 0;
  this.reverseTime = 0.8;
  this.reverseSteer = steerDirection > 0 ? -1 : 1; // de ré, o volante "inverte"
  return true;
};

AIController.prototype.pitStopInput = function (car, track) {
  const lane = track.pitLane;
  if (!lane) {
    this.pitPhase = null;
    return null;
  }

  if (!this.pitPhase) {
    if (!car.wantsPit) return null;
    const n = track.points.length;
    const along = ((lane.entryIndex - car.trackIndex + n) % n) * TRACK_SPACING;
    if (along > 260) return null;
    if (along > 10) {
      // Chegando na entrada: tira o pé e encosta do lado do box
      const i = track.indexAhead(car.trackIndex, 50);
      const p = track.points[i];
      const h = track.headings[i];
      const side = lane.side * track.width * 0.25;
      return driveTo(car, p.x - Math.sin(h) * side, p.y + Math.cos(h) * side, PIT.speedLimit + along * 1.1);
    }
    this.pitPhase = 'lane';
  }

  // Dentro da faixa de box
  const near = lane.nearest(car.x, car.y);
  const k = near.index;
  if (k >= lane.center.length - 3 || near.distance > PIT.laneWidth * 1.5) {
    this.pitPhase = null; // saiu da faixa: volta a correr normalmente
    return null;
  }

  const box = lane.boxFor(car);
  const dist = Math.hypot(box.x - car.x, box.y - car.y);
  if (!car.wantsPit || dist > 25) this.boxed = false;
  if (car.wantsPit) {
    // Já está na vaga: fica parado até encher o tanque
    if (this.boxed || (dist < 16 && k <= box.k + 3)) {
      this.boxed = true;
      const forward = car.forwardSpeed || 0;
      return { throttle: 0, brake: forward > 3 ? 1 : 0, steer: 0, handbrake: false };
    }
    // Bem perto: vira para dentro da vaga (sem cruzar a vaga do vizinho)
    // (em baixa velocidade o volante vira pouco, então não pode estar devagar demais)
    if (k >= box.k - 7 && k <= box.k + 3) {
      return driveTo(car, box.x, box.y, Math.min(PIT.speedLimit, 35 + dist * 0.8));
    }
    // Chegando: reduz pela passagem
    if (k >= box.k - 16 && k < box.k - 7) {
      const target = lane.drive[Math.min(lane.drive.length - 1, k + 4)];
      return driveTo(car, target.x, target.y, 60);
    }
  }

  // Segue pela passagem até a saída
  const target = lane.drive[Math.min(lane.drive.length - 1, k + 5)];
  const leaving = k > lane.center.length / 2 && lane.center[k].ease < 0.9;
  return driveTo(car, target.x, target.y, leaving ? car.perf.maxSpeed : PIT.speedLimit - 5);
};

function driveTo(car, x, y, targetSpeed) {
  const forward = car.forwardSpeed || 0;
  const toTarget = angleDifference(Math.atan2(y - car.y, x - car.x), car.angle);
  return {
    throttle: forward < targetSpeed - 5 ? 1 : 0,
    brake: forward > targetSpeed + 15 ? 1 : 0,
    steer: Math.max(-1, Math.min(1, toTarget * 3)),
    handbrake: false,
  };
}

// Diferença entre dois ângulos, sempre entre -π e π
function angleDifference(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}
