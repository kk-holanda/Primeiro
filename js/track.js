// A pista é definida por alguns "pontos de controle" que formam um circuito
// fechado. Esses pontos são suavizados (curva Catmull-Rom) para virar uma
// linha central cheia de pontos. A estrada é essa linha desenhada bem grossa.

class Track {
  constructor(controlPoints, width) {
    this.width = width;
    this.points = Track.smooth(controlPoints, 20);

    // Checkpoints: o carro precisa passar por todos, em ordem, para contar
    // uma volta. O checkpoint 0 é a linha de chegada.
    this.checkpointCount = 8;
    this.checkpoints = [];
    for (let i = 0; i < this.checkpointCount; i++) {
      this.checkpoints.push(Math.floor((i * this.points.length) / this.checkpointCount));
    }
  }

  // Curva Catmull-Rom fechada: passa por todos os pontos de controle.
  static smooth(ctrl, steps) {
    const out = [];
    const n = ctrl.length;
    for (let i = 0; i < n; i++) {
      const p0 = ctrl[(i - 1 + n) % n];
      const p1 = ctrl[i];
      const p2 = ctrl[(i + 1) % n];
      const p3 = ctrl[(i + 2) % n];
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const t2 = t * t;
        const t3 = t2 * t;
        const f = (a, b, c, d) =>
          0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
        out.push({ x: f(p0[0], p1[0], p2[0], p3[0]), y: f(p0[1], p1[1], p2[1], p3[1]) });
      }
    }
    return out;
  }

  // Retorna o ponto da linha central mais próximo de (x, y):
  // { index, distance }. Serve para saber se o carro está na pista
  // e em que parte da pista ele está.
  nearest(x, y) {
    let best = { index: 0, distance: Infinity };
    const pts = this.points;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const d = distanceToSegment(x, y, a.x, a.y, b.x, b.y);
      if (d < best.distance) best = { index: i, distance: d };
    }
    return best;
  }

  // O carro alcançou o checkpoint `cp` se estiver logo depois dele na pista.
  reachedCheckpoint(cp, sampleIndex) {
    const start = this.checkpoints[cp];
    const zone = Math.floor(this.points.length / (this.checkpointCount * 2));
    const n = this.points.length;
    const delta = (sampleIndex - start + n) % n;
    return delta < zone;
  }

  // Posição e ângulo de largada (logo antes da linha de chegada).
  startPose(slot) {
    const a = this.points[0];
    const b = this.points[1];
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    const back = 45;
    const side = slot === 0 ? -22 : 22;
    return {
      x: a.x - Math.cos(angle) * back - Math.sin(angle) * side,
      y: a.y - Math.sin(angle) * back + Math.cos(angle) * side,
      angle,
    };
  }

  tracePath(ctx) {
    ctx.beginPath();
    this.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
  }

  draw(ctx) {
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Zebra (borda vermelha e branca)
    this.tracePath(ctx);
    ctx.lineWidth = this.width + 12;
    ctx.strokeStyle = '#d33';
    ctx.stroke();
    ctx.lineCap = 'butt'; // sem pontas arredondadas, senão os tracejados se juntam
    ctx.setLineDash([14, 14]);
    ctx.strokeStyle = '#eee';
    ctx.stroke();
    ctx.setLineDash([]);

    // Asfalto
    ctx.lineWidth = this.width;
    ctx.strokeStyle = '#555';
    ctx.stroke();

    // Faixa central tracejada
    ctx.lineWidth = 2;
    ctx.setLineDash([18, 22]);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.stroke();
    ctx.setLineDash([]);

    this.drawStartLine(ctx);
  }

  drawStartLine(ctx) {
    const a = this.points[0];
    const b = this.points[1];
    const angle = Math.atan2(b.y - a.y, b.x - a.x);
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(angle);
    const size = 8;
    const rows = Math.floor(this.width / size);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#fff' : '#111';
        ctx.fillRect(c * size - size, -this.width / 2 + r * size, size, size);
      }
    }
    ctx.restore();
  }
}

function distanceToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy;
  let t = lenSq === 0 ? 0 : ((px - ax) * dx + (py - ay) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  const cx = ax + t * dx;
  const cy = ay + t * dy;
  return Math.hypot(px - cx, py - cy);
}

// Pontos de controle da pista (no "mundo" de 1200 x 800).
// Para criar outra pista, basta mudar esta lista!
// O primeiro ponto é onde fica a linha de chegada.
const TRACK_1 = [
  [480, 112], [760, 112], [1040, 160], [1090, 360], [900, 420],
  [700, 340], [520, 400], [560, 560], [880, 590], [1060, 660],
  [700, 725], [260, 712], [110, 520], [140, 260], [240, 130],
];
