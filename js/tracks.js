// Uma pista é definida por alguns "pontos de controle" que formam um circuito
// fechado. Esses pontos são suavizados (curva Catmull-Rom) e depois
// redistribuídos com espaçamento igual. A estrada é essa linha central
// desenhada bem grossa.

const TRACK_SPACING = 8; // distância (px) entre os pontos da linha central

class Track {
  constructor({ name, points, width }) {
    this.name = name;
    this.width = width;
    this.points = Track.resample(Track.smooth(points, 16), TRACK_SPACING);

    // Direção da pista em cada ponto (usada pela IA)
    const n = this.points.length;
    this.headings = this.points.map((p, i) => {
      const q = this.points[(i + 1) % n];
      return Math.atan2(q.y - p.y, q.x - p.x);
    });

    // Checkpoints: o carro precisa passar por todos, em ordem, para contar
    // uma volta. O checkpoint 0 é a linha de chegada.
    this.checkpointCount = 10;
    this.checkpoints = [];
    for (let i = 0; i < this.checkpointCount; i++) {
      this.checkpoints.push(Math.floor((i * n) / this.checkpointCount));
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

  // Redistribui os pontos para ficarem todos à mesma distância.
  static resample(pts, spacing) {
    const out = [{ ...pts[0] }];
    let carry = 0;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % pts.length];
      const len = Math.hypot(b.x - a.x, b.y - a.y);
      let d = spacing - carry;
      while (d <= len) {
        const t = d / len;
        out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
        d += spacing;
      }
      carry = len - (d - spacing);
    }
    // Remove o último ponto se ficou colado no primeiro
    const last = out[out.length - 1];
    if (Math.hypot(last.x - out[0].x, last.y - out[0].y) < spacing / 2) out.pop();
    return out;
  }

  // Índice do ponto que está `distance` px à frente do ponto `index`.
  indexAhead(index, distance) {
    return (index + Math.round(distance / TRACK_SPACING)) % this.points.length;
  }

  // Ponto da linha central mais próximo de (x, y): { index, distance }.
  // Serve para saber se o carro está na pista e em que parte dela.
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
    const n = this.points.length;
    const zone = Math.floor(n / (this.checkpointCount * 2));
    return (sampleIndex - this.checkpoints[cp] + n) % n < zone;
  }

  // Posições do grid de largada (logo antes da linha de chegada).
  startPose(slot) {
    const a = this.points[0];
    const angle = this.headings[0];
    const back = 40 + slot * 42;
    const side = slot % 2 === 0 ? -20 : 20;
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
    ctx.lineCap = 'round';
    ctx.lineWidth = this.width;
    ctx.strokeStyle = '#55575c';
    ctx.stroke();

    // Faixa central tracejada
    ctx.lineCap = 'butt';
    ctx.lineWidth = 2;
    ctx.setLineDash([18, 22]);
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.stroke();
    ctx.setLineDash([]);

    this.drawStartLine(ctx);
  }

  drawStartLine(ctx) {
    const a = this.points[0];
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(this.headings[0]);
    const size = 8;
    const rows = Math.floor(this.width / size);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < 2; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? '#fff' : '#111';
        ctx.fillRect(c * size - size, -(rows * size) / 2 + r * size, size, size);
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
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

// Pontos de controle das pistas (no "mundo" de 1200 x 800).
// O primeiro ponto de cada pista é onde fica a linha de chegada.
// Para criar outra pista, basta adicionar mais uma aqui!
const TRACKS = [
  {
    name: 'KKlaude first',
    width: 90,
    points: [
      [480, 112], [760, 112], [1040, 160], [1090, 360], [900, 420],
      [700, 340], [520, 400], [560, 560], [880, 590], [1060, 660],
      [700, 725], [260, 712], [110, 520], [140, 260], [240, 130],
    ],
  },
  {
    // Desenhada a partir do esboço "TRAÇADO DA PISTA 2"
    name: 'KK first',
    width: 84,
    points: [
      [554, 134], [792, 136], [975, 126], [1052, 136], [1106, 225],
      [1136, 378], [1140, 492], [1098, 594], [1037, 682], [945, 714],
      [883, 644], [853, 517], [822, 403], [746, 333], [684, 378],
      [654, 479], [615, 619], [554, 695], [477, 714], [424, 657],
      [412, 505], [393, 378], [332, 312], [271, 352], [240, 479],
      [209, 581], [148, 651], [102, 619], [71, 467], [60, 289],
      [87, 181], [179, 136], [370, 134],
    ],
  },
  {
    name: 'Anel Veloz',
    width: 96,
    points: [
      [600, 150], [950, 150], [1090, 250], [1090, 550], [950, 660],
      [770, 660], [700, 600], [600, 600], [530, 660], [250, 660],
      [110, 550], [110, 250], [250, 150],
    ],
  },
  {
    name: 'Serpentina',
    width: 78,
    points: [
      [520, 135], [800, 135], [1000, 130], [1100, 220], [1060, 330],
      [900, 330], [780, 410], [880, 490], [1060, 500], [1110, 620],
      [1000, 715], [700, 705], [570, 600], [430, 705], [200, 705],
      [95, 610], [160, 480], [330, 440], [270, 330], [120, 280],
      [150, 165], [320, 135],
    ],
  },
].map((def) => new Track(def));
