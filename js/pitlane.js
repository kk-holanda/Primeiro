// Faixa de box (pit lane) do modo Gabispeed.
//
// É uma pista paralela à reta de chegada, do lado de dentro do circuito:
//   entrada em diagonal → faixa com 6 boxes (um por equipe) → saída em diagonal
// Ela é calculada a partir da linha central da pista, deslocada para o lado.

const PIT = {
  laneWidth: 60,     // largura da faixa de box
  gap: 16,           // faixa de grama + muro entre a pista e a faixa de box
  ramp: 18,          // comprimento (em pontos da pista) da entrada/saída em diagonal
  entryBefore: 40,   // a entrada começa 40 pontos (320 px) antes da linha de chegada
  exitAfter: 58,     // a saída termina 58 pontos (464 px) depois da linha de chegada
  boxSpacing: 48,    // distância entre os boxes (px)
  boxOffset: 14,     // os boxes ficam na metade de fora; os carros passam na de dentro
  speedLimit: 120,   // limite de velocidade na faixa (px/s ≈ 90 km/h)
};

// Uma faixa de box por pista, criada só quando é usada
const pitLaneCache = new Map();
function pitLaneFor(track) {
  if (!pitLaneCache.has(track)) pitLaneCache.set(track, new PitLane(track));
  return pitLaneCache.get(track);
}

class PitLane {
  constructor(track) {
    const n = track.points.length;
    const p0 = track.points[0];
    const h0 = track.headings[0];

    // Lado de dentro do circuito (voltado para o centro da tela)
    const towardCenter = -Math.sin(h0) * (WORLD_WIDTH / 2 - p0.x) + Math.cos(h0) * (WORLD_HEIGHT / 2 - p0.y);
    this.side = towardCenter > 0 ? 1 : -1;
    this.offset = track.width / 2 + PIT.gap + PIT.laneWidth / 2;
    this.entryIndex = (n - PIT.entryBefore) % n;
    this.exitIndex = PIT.exitAfter % n;

    const count = PIT.entryBefore + PIT.exitAfter;
    this.center = []; // linha central da faixa (para desenhar e saber se o carro está nela)
    this.drive = [];  // linha por onde os carros passam (metade de dentro)
    for (let k = 0; k <= count; k++) {
      const i = (this.entryIndex + k) % n;
      const t = Math.max(0, Math.min(1, k / PIT.ramp, (count - k) / PIT.ramp));
      const ease = t * t * (3 - 2 * t); // curva suave na entrada e na saída
      const p = track.points[i];
      const h = track.headings[i];
      const ox = -Math.sin(h) * this.side;
      const oy = Math.cos(h) * this.side;
      const c = this.offset * ease;
      const d = (this.offset - PIT.boxOffset) * ease;
      this.center.push({ x: p.x + ox * c, y: p.y + oy * c, h, ease, ox, oy });
      this.drive.push({ x: p.x + ox * d, y: p.y + oy * d });
    }

    // Boxes: um por equipe, no meio do trecho reto da faixa
    const step = Math.round(PIT.boxSpacing / TRACK_SPACING);
    const span = step * (CAR_MODELS.length - 1);
    const first = Math.round(count / 2 - span / 2);
    this.boxes = CAR_MODELS.map((model, j) => {
      const k = first + j * step;
      const c = this.center[k];
      return {
        k,
        model,
        angle: c.h,
        x: c.x + c.ox * PIT.boxOffset,
        y: c.y + c.oy * PIT.boxOffset,
      };
    });
  }

  boxFor(car) {
    return this.boxes[CAR_MODELS.indexOf(car.model)];
  }

  // Ponto da linha central da faixa mais próximo: { index, distance }
  nearest(x, y) {
    let best = { index: 0, distance: Infinity };
    for (let k = 0; k < this.center.length - 1; k++) {
      const a = this.center[k];
      const b = this.center[k + 1];
      const d = distanceToSegment(x, y, a.x, a.y, b.x, b.y);
      if (d < best.distance) best = { index: k, distance: d };
    }
    return best;
  }

  // Desenha a faixa, o muro, os boxes, as garagens e as placas (no cenário)
  draw(g, track) {
    const L = PIT.laneWidth;
    const pts = this.center;
    // só desenha onde a faixa já saiu de cima da pista
    const minOffset = track.width / 2 - L / 2 + 4;
    const visible = pts.filter((p) => p.ease * this.offset >= minOffset);

    const path = (list) => {
      g.beginPath();
      list.forEach((p, i) => (i === 0 ? g.moveTo(p.x, p.y) : g.lineTo(p.x, p.y)));
    };

    // Garagens atrás dos boxes
    this.boxes.forEach((box) => {
      const c = pts[box.k];
      const d = L / 2 + 20;
      g.save();
      g.translate(c.x + c.ox * d, c.y + c.oy * d);
      g.rotate(box.angle);
      g.fillStyle = 'rgba(0,0,0,0.3)';
      g.fillRect(-20, -12, 44, 30);
      g.fillStyle = '#c9ced8';
      g.fillRect(-22, -14, 44, 28);
      // porta da garagem virada para a faixa de box
      g.fillStyle = '#2a2d35';
      g.fillRect(-17, this.side > 0 ? -14 : 6, 34, 8);
      g.fillStyle = box.model.color;
      g.fillRect(-22, this.side > 0 ? 8 : -14, 44, 6);
      g.strokeStyle = '#7d8390';
      g.lineWidth = 1;
      g.strokeRect(-22, -14, 44, 28);
      g.restore();
    });

    // Asfalto da faixa de box
    g.lineJoin = 'round';
    g.lineCap = 'butt';
    path(visible);
    g.lineWidth = L + 6;
    g.strokeStyle = '#f4f4f6';
    g.stroke();
    g.lineWidth = L;
    g.strokeStyle = '#5d6066';
    g.stroke();

    // Linha tracejada separando a passagem dos boxes
    const boxSide = visible.filter((p) => p.ease > 0.98).map((p) => ({ x: p.x + p.ox * 1, y: p.y + p.oy * 1 }));
    path(boxSide);
    g.setLineDash([10, 8]);
    g.lineWidth = 2;
    g.strokeStyle = 'rgba(255,255,255,0.55)';
    g.stroke();
    g.setLineDash([]);

    // Muro entre a pista e a faixa de box (só no trecho reto)
    const wall = pts
      .filter((p) => p.ease > 0.98)
      .map((p) => {
        const back = L / 2 + PIT.gap / 2;
        return { x: p.x - p.ox * back, y: p.y - p.oy * back };
      });
    path(wall);
    g.lineCap = 'round';
    g.lineWidth = 6;
    g.strokeStyle = '#8c929e';
    g.stroke();
    g.lineWidth = 3;
    g.strokeStyle = '#dfe3ea';
    g.stroke();

    // Vagas dos boxes, com a cor de cada equipe
    this.boxes.forEach((box) => {
      g.save();
      g.translate(box.x, box.y);
      g.rotate(box.angle);
      g.fillStyle = 'rgba(255,255,255,0.08)';
      g.fillRect(-20, -13, 40, 26);
      g.strokeStyle = box.model.color;
      g.lineWidth = 2.5;
      g.strokeRect(-20, -13, 40, 26);
      g.fillStyle = box.model.color;
      g.fillRect(14, -13, 6, 26);
      g.restore();
    });

    // Placas: PIT IN na entrada, limite de velocidade e PIT OUT na saída
    const inPt = visible[0];
    const outPt = visible[visible.length - 1];
    const fullStart = pts.find((p) => p.ease > 0.98);
    if (inPt) drawPitText(g, inPt, 'PIT IN', this.side);
    if (outPt) drawPitText(g, outPt, 'PIT OUT', this.side);
    if (fullStart) drawSpeedSign(g, fullStart, this, L);
  }
}

function drawPitText(g, p, text, side) {
  g.save();
  g.translate(p.x, p.y);
  let a = p.h;
  if (Math.cos(a) < 0) a += Math.PI;
  g.rotate(a);
  g.fillStyle = 'rgba(255,255,255,0.85)';
  g.font = `11px ${FONT}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, 0, 0);
  g.restore();
}

function drawSpeedSign(g, p, lane, L) {
  const d = L / 2 + 12;
  const x = p.x + p.ox * d;
  const y = p.y + p.oy * d;
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.beginPath();
  g.arc(x + 2, y + 2, 11, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.arc(x, y, 11, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = '#e8232a';
  g.lineWidth = 3;
  g.stroke();
  g.fillStyle = '#111';
  g.font = `10px ${FONT}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(String(Math.round(PIT.speedLimit * 0.75)), x, y + 0.5);
}
