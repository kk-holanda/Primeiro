// Cenário em volta da pista: árvores, arbustos, arquibancada, pneus, areia.
// Tudo é desenhado UMA vez numa imagem (cache) e reaproveitado a cada quadro.

const SCENERY_RES = 2; // resolução extra para ficar nítido em telas boas
const backgroundCache = new Map();

function trackBackground(track) {
  if (backgroundCache.has(track)) return backgroundCache.get(track);
  const c = document.createElement('canvas');
  c.width = WORLD_WIDTH * SCENERY_RES;
  c.height = WORLD_HEIGHT * SCENERY_RES;
  const g = c.getContext('2d');
  g.scale(SCENERY_RES, SCENERY_RES);
  paintScenery(g, track);
  backgroundCache.set(track, c);
  return c;
}

// Gerador de números aleatórios com "semente": a mesma pista sempre
// gera o mesmo cenário.
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function paintScenery(g, track) {
  const rand = seededRandom(track.name.length * 7919 + track.points.length);
  const clearance = (x, y) => track.nearest(x, y).distance - track.width / 2;

  // Grama com faixas de corte e manchas
  g.fillStyle = '#3f8f3f';
  g.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  g.fillStyle = 'rgba(255,255,255,0.045)';
  for (let x = -WORLD_HEIGHT; x < WORLD_WIDTH; x += 120) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x + 60, 0);
    g.lineTo(x + 60 + WORLD_HEIGHT, WORLD_HEIGHT);
    g.lineTo(x + WORLD_HEIGHT, WORLD_HEIGHT);
    g.fill();
  }
  for (let i = 0; i < 900; i++) {
    g.fillStyle = rand() < 0.5 ? 'rgba(20,60,20,0.18)' : 'rgba(140,200,90,0.16)';
    g.fillRect(rand() * WORLD_WIDTH, rand() * WORLD_HEIGHT, 2, 3);
  }

  // Áreas de escape de areia na parte de fora das curvas fechadas
  const n = track.points.length;
  const turnAt = (i) => angleDifference(track.headings[(i + 6) % n], track.headings[(i - 6 + n) % n]);
  g.fillStyle = '#e3c98a';
  for (let i = 0; i < n; i += 2) {
    const turn = turnAt(i);
    if (Math.abs(turn) < 0.55) continue;
    const p = track.points[i];
    const h = track.headings[i];
    const side = turn > 0 ? -1 : 1; // lado de fora da curva
    const d = track.width / 2 + 16;
    const x = p.x - Math.sin(h) * d * side;
    const y = p.y + Math.cos(h) * d * side;
    if (clearance(x, y) > 6) {
      g.beginPath();
      g.arc(x, y, 18, 0, Math.PI * 2);
      g.fill();
    }
  }

  track.draw(g);

  // Pilhas de pneus nas curvas mais fechadas
  for (let i = 0; i < n; i += 9) {
    const turn = turnAt(i);
    if (Math.abs(turn) < 0.75) continue;
    const p = track.points[i];
    const h = track.headings[i];
    const side = turn > 0 ? -1 : 1;
    const d = track.width / 2 + 40;
    const x = p.x - Math.sin(h) * d * side;
    const y = p.y + Math.cos(h) * d * side;
    if (clearance(x, y) > 25 && inside(x, y, 12)) drawTireStack(g, x, y, h);
  }

  const stand = placeGrandstand(g, track, clearance);
  const boards = placeBillboards(g, track, clearance, turnAt, stand);

  // Árvores e arbustos onde houver espaço
  const placed = [];
  for (let i = 0; i < 700 && placed.length < 70; i++) {
    const x = 20 + rand() * (WORLD_WIDTH - 40);
    const y = 20 + rand() * (WORLD_HEIGHT - 40);
    const r = 11 + rand() * 13;
    if (x < 330 && y < 80) continue; // espaço do painel
    if (clearance(x, y) < r + 30) continue;
    if (stand && Math.hypot(x - stand.x, y - stand.y) < stand.radius + r) continue;
    if (boards.some((b) => Math.hypot(x - b.x, y - b.y) < b.radius + r)) continue;
    if (placed.some((t) => Math.hypot(t.x - x, t.y - y) < t.r + r + 4)) continue;
    placed.push({ x, y, r });
  }
  placed.sort((a, b) => a.y - b.y);
  placed.forEach((t, i) => (i % 4 === 3 ? drawBush(g, t.x, t.y, t.r * 0.6, rand) : drawTree(g, t.x, t.y, t.r, rand)));
}

function inside(x, y, m) {
  return x > m && y > m && x < WORLD_WIDTH - m && y < WORLD_HEIGHT - m;
}

function drawTree(g, x, y, r, rand) {
  g.fillStyle = 'rgba(0,0,0,0.25)';
  g.beginPath();
  g.ellipse(x + r * 0.35, y + r * 0.4, r, r * 0.85, 0, 0, Math.PI * 2);
  g.fill();
  const shades = ['#1f5f2a', '#2a7a34', '#3a9442'];
  shades.forEach((c, k) => {
    g.fillStyle = c;
    g.beginPath();
    g.arc(x - k * r * 0.18, y - k * r * 0.18, r * (1 - k * 0.28), 0, Math.PI * 2);
    g.fill();
  });
  g.fillStyle = 'rgba(190,240,140,0.35)';
  g.beginPath();
  g.arc(x - r * 0.4, y - r * 0.45, r * 0.22, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = 'rgba(10,40,15,0.6)';
  g.lineWidth = 1.2;
  g.beginPath();
  g.arc(x, y, r, 0, Math.PI * 2);
  g.stroke();
}

function drawBush(g, x, y, r, rand) {
  for (let k = 0; k < 3; k++) {
    const a = rand() * Math.PI * 2;
    g.fillStyle = k === 2 ? '#4aa64a' : '#2f7d34';
    g.beginPath();
    g.arc(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * 0.7, 0, Math.PI * 2);
    g.fill();
  }
  // florzinhas
  g.fillStyle = '#ffe066';
  g.fillRect(x - 2, y - 1, 2, 2);
  g.fillStyle = '#ff7eb6';
  g.fillRect(x + 3, y + 2, 2, 2);
}

function drawTireStack(g, x, y, h) {
  for (let k = -1; k <= 1; k++) {
    const tx = x + Math.cos(h) * k * 11;
    const ty = y + Math.sin(h) * k * 11;
    g.fillStyle = '#151515';
    g.beginPath();
    g.arc(tx, ty, 6, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = k === 0 ? '#e33' : '#ddd';
    g.lineWidth = 2;
    g.beginPath();
    g.arc(tx, ty, 3.5, 0, Math.PI * 2);
    g.stroke();
  }
}

// Arquibancada ao lado da reta de largada, com torcida colorida
function placeGrandstand(g, track, clearance) {
  const p = track.points[Math.floor(track.points.length * 0.02)];
  const h = track.headings[0];
  const len = 230;
  const depth = 46;
  for (const side of [-1, 1]) {
    const d = track.width / 2 + 22 + depth / 2;
    const cx = p.x - Math.sin(h) * d * side;
    const cy = p.y + Math.cos(h) * d * side;
    const corners = [-1, 1].flatMap((a) => [-1, 1].map((b) => ({
      x: cx + Math.cos(h) * (len / 2) * a - Math.sin(h) * (depth / 2) * b,
      y: cy + Math.sin(h) * (len / 2) * a + Math.cos(h) * (depth / 2) * b,
    })));
    if (!corners.every((c) => inside(c.x, c.y, 4) && clearance(c.x, c.y) > 6)) continue;

    g.save();
    g.translate(cx, cy);
    g.rotate(h);
    g.fillStyle = 'rgba(0,0,0,0.3)';
    g.fillRect(-len / 2 + 4, -depth / 2 + 4, len, depth);
    g.fillStyle = '#8d96a6';
    g.fillRect(-len / 2, -depth / 2, len, depth);
    // degraus
    g.fillStyle = '#6f7888';
    for (let r = 0; r < 4; r++) g.fillRect(-len / 2, -depth / 2 + r * 11.5, len, 2);
    // torcida
    const colors = ['#e8232a', '#f7d417', '#1d4fd8', '#fff', '#1fa54a', '#ff8a1c', '#8b3fd9', '#f2b38a'];
    let k = 0;
    for (let r = 0; r < 4; r++) {
      for (let x = -len / 2 + 6; x < len / 2 - 4; x += 7) {
        g.fillStyle = colors[(k++ * 7 + r * 3) % colors.length];
        g.beginPath();
        g.arc(x + (r % 2) * 3, -depth / 2 + 6 + r * 11.5, 2.4, 0, Math.PI * 2);
        g.fill();
      }
    }
    // cobertura listrada na parte de trás
    const back = side === 1 ? depth / 2 : -depth / 2 - 8;
    for (let x = -len / 2; x < len / 2; x += 20) {
      g.fillStyle = (x / 20) % 2 === 0 ? '#e8232a' : '#f4f4f6';
      g.fillRect(x, back, 20, 8);
    }
    g.restore();
    return { x: cx, y: cy, radius: len / 2 + 10 };
  }
  return null;
}

// Placas de patrocínio ao lado das retas
const BILLBOARDS = [
  { text: 'KKART', bg: '#ffd23f', fg: '#16171b' },
  { text: 'GABISPEED', bg: '#e8232a', fg: '#ffffff' },
  { text: 'KK MOTORS', bg: '#1d4fd8', fg: '#ffffff' },
  { text: 'TURBO KK', bg: '#16171b', fg: '#ffd23f' },
];

function placeBillboards(g, track, clearance, turnAt, stand) {
  const n = track.points.length;
  const placed = [];
  const len = 110;
  for (let i = 0; i < n && placed.length < 4; i += 6) {
    // só em trechos retos
    let straight = true;
    for (let k = -8; k <= 8; k += 4) {
      if (Math.abs(turnAt((i + k + n) % n)) > 0.12) straight = false;
    }
    if (!straight) continue;
    const p = track.points[i];
    const h = track.headings[i];
    for (const side of [1, -1]) {
      const d = track.width / 2 + 30;
      const x = p.x - Math.sin(h) * d * side;
      const y = p.y + Math.cos(h) * d * side;
      const ends = [-1, 1].map((e) => ({ x: x + Math.cos(h) * (len / 2) * e, y: y + Math.sin(h) * (len / 2) * e }));
      if (!ends.every((e) => inside(e.x, e.y, 10) && clearance(e.x, e.y) > 18)) continue;
      if (clearance(x, y) < 18) continue;
      if (stand && Math.hypot(x - stand.x, y - stand.y) < stand.radius + len / 2) continue;
      if (placed.some((b) => Math.hypot(x - b.x, y - b.y) < 260)) continue;
      if (x < 360 && y < 110) continue; // espaço do painel
      drawBillboard(g, x, y, h, len, BILLBOARDS[placed.length % BILLBOARDS.length]);
      placed.push({ x, y, radius: len / 2 + 6 });
      break;
    }
  }
  return placed;
}

function drawBillboard(g, x, y, angle, len, style) {
  g.save();
  g.translate(x, y);
  // texto sempre de pé para quem olha a tela
  let a = angle;
  if (Math.cos(a) < 0) a += Math.PI;
  g.rotate(a);
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.fillRect(-len / 2 + 3, -8 + 4, len, 18);
  g.fillStyle = '#7a7f8a';
  g.fillRect(-len / 2 + 8, 8, 3, 5);
  g.fillRect(len / 2 - 11, 8, 3, 5);
  g.fillStyle = style.bg;
  g.fillRect(-len / 2, -9, len, 18);
  g.strokeStyle = '#111';
  g.lineWidth = 1.2;
  g.strokeRect(-len / 2, -9, len, 18);
  g.fillStyle = style.fg;
  g.font = `12px ${FONT}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(style.text, 0, 1);
  g.restore();
}
