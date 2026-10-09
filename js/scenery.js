// Cenário em volta da pista: árvores, arbustos, arquibancada, pneus, areia.
// Tudo é desenhado UMA vez numa imagem (cache) e reaproveitado a cada quadro.

const SCENERY_RES = 2; // resolução extra para ficar nítido em telas boas
const backgroundCache = new Map();

// lane: faixa de box (só no modo Gabispeed) ou null
function trackBackground(track, lane = null) {
  const key = track.name + (lane ? ':pit' : '');
  if (backgroundCache.has(key)) return backgroundCache.get(key);
  const c = document.createElement('canvas');
  c.width = WORLD_WIDTH * SCENERY_RES;
  c.height = WORLD_HEIGHT * SCENERY_RES;
  const g = c.getContext('2d');
  g.scale(SCENERY_RES, SCENERY_RES);
  paintScenery(g, track, lane);
  backgroundCache.set(key, c);
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

// Temas de cenário: cada pista tem o seu ambiente
const THEMES = {
  campo: {
    label: 'Campo',
    ground: '#3f8f3f',
    specks: ['rgba(20,60,20,0.18)', 'rgba(140,200,90,0.16)'],
    runoff: '#e3c98a',
    objects: [['tree', 0.55], ['bush', 0.25], ['flowers', 0.2]],
    feature: 'pond',
  },
  floresta: {
    label: 'Floresta',
    ground: '#2f7436',
    specks: ['rgba(10,40,15,0.22)', 'rgba(120,170,80,0.14)'],
    runoff: '#cdb88d',
    objects: [['pine', 0.6], ['rock', 0.15], ['tree', 0.12], ['log', 0.13]],
    feature: 'cabin',
  },
  praia: {
    label: 'Praia',
    ground: '#e9d39b',
    specks: ['rgba(150,120,60,0.18)', 'rgba(255,250,230,0.35)'],
    runoff: '#c9c2b2',
    objects: [['palm', 0.5], ['umbrella', 0.3], ['dunegrass', 0.2]],
    feature: 'sea',
  },
  neve: {
    label: 'Neve',
    ground: '#e9f0f6',
    specks: ['rgba(120,150,190,0.16)', 'rgba(255,255,255,0.8)'],
    runoff: '#b8c1cc',
    objects: [['snowpine', 0.7], ['snowrock', 0.18], ['snowman', 0.12]],
    feature: 'ice',
  },
};

function themeOf(track) {
  return THEMES[track.theme] || THEMES.campo;
}

// Informações do cenário usadas nas animações (ex.: posição da arquibancada)
const sceneryInfo = new Map();

function paintScenery(g, track, lane) {
  const rand = seededRandom(track.name.length * 7919 + track.points.length);
  const theme = themeOf(track);
  // Espaço livre até a pista (e até a faixa de box com as garagens, se houver)
  const clearance = (x, y) => {
    const d = track.nearest(x, y).distance - track.width / 2;
    if (!lane) return d;
    return Math.min(d, lane.nearest(x, y).distance - PIT.laneWidth / 2 - 42);
  };
  const blocked = []; // áreas já ocupadas: { x, y, radius }
  const isFree = (x, y, r) => !blocked.some((b) => Math.hypot(x - b.x, y - b.y) < b.radius + r);

  paintGround(g, theme, rand, track.theme);

  // Elemento especial do tema (lago, mar, cabana, lago congelado)
  if (theme.feature === 'sea') {
    paintSea(g, rand);
  } else {
    const spot = findOpenSpot(clearance, theme.feature === 'cabin' ? 40 : 75, rand);
    if (spot) {
      if (theme.feature === 'pond') drawPond(g, spot.x, spot.y, spot.r, rand, false);
      if (theme.feature === 'ice') drawPond(g, spot.x, spot.y, spot.r, rand, true);
      if (theme.feature === 'cabin') drawCabin(g, spot.x, spot.y, rand);
      blocked.push({ x: spot.x, y: spot.y, radius: spot.r + 8 });
    }
  }

  // Áreas de escape (areia ou brita) na parte de fora das curvas fechadas
  const n = track.points.length;
  const turnAt = (i) => angleDifference(track.headings[(i + 6) % n], track.headings[(i - 6 + n) % n]);
  g.fillStyle = theme.runoff;
  const runoffSpots = [];
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
      runoffSpots.push({ x, y });
    }
  }
  // textura de pedrinhas na área de escape
  runoffSpots.forEach((sp) => {
    for (let k = 0; k < 6; k++) {
      g.fillStyle = rand() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.3)';
      g.fillRect(sp.x + (rand() - 0.5) * 26, sp.y + (rand() - 0.5) * 26, 1.5, 1.5);
    }
  });

  track.draw(g);
  paintAsphaltDetails(g, track, rand);
  if (lane) lane.draw(g, track);

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
    if (clearance(x, y) > 25 && inside(x, y, 12) && isFree(x, y, 14)) {
      drawTireStack(g, x, y, h);
      blocked.push({ x, y, radius: 18 });
    }
  }

  const stand = placeGrandstand(g, track, clearance);
  if (stand) blocked.push(stand);
  const boards = placeBillboards(g, track, clearance, turnAt, stand);
  blocked.push(...boards);
  sceneryInfo.set(track.name + (lane ? ':pit' : ''), { stand });

  // Postos de fiscais de pista (com bandeira) em algumas curvas
  let posts = 0;
  for (let i = 5; i < n && posts < 4; i += 23) {
    if (Math.abs(turnAt(i)) < 0.4) continue;
    const p = track.points[i];
    const h = track.headings[i];
    const side = turnAt(i) > 0 ? 1 : -1; // lado de dentro da curva
    const d = track.width / 2 + 26;
    const x = p.x - Math.sin(h) * d * side;
    const y = p.y + Math.cos(h) * d * side;
    if (clearance(x, y) > 14 && inside(x, y, 14) && isFree(x, y, 12)) {
      drawMarshalPost(g, x, y, h, posts);
      blocked.push({ x, y, radius: 14 });
      posts++;
    }
  }

  // Árvores e outros objetos do tema onde houver espaço
  const placed = [];
  const total = theme.objects.reduce((sum, [, w]) => sum + w, 0);
  for (let i = 0; i < 900 && placed.length < 78; i++) {
    const x = 18 + rand() * (WORLD_WIDTH - 36);
    const y = 18 + rand() * (WORLD_HEIGHT - 36);
    let pick = rand() * total;
    const kind = theme.objects.find(([, w]) => (pick -= w) <= 0)[0];
    const r = OBJECT_SIZES[kind][0] + rand() * OBJECT_SIZES[kind][1];
    if (x < 330 && y < 80) continue; // espaço do painel
    if (theme.feature === 'sea' && y > WORLD_HEIGHT - 60 - r) continue;
    if (clearance(x, y) < r + 26) continue;
    if (!isFree(x, y, r)) continue;
    if (placed.some((t) => Math.hypot(t.x - x, t.y - y) < t.r + r + 4)) continue;
    placed.push({ x, y, r, kind });
  }
  placed.sort((a, b) => a.y - b.y);
  placed.forEach((t) => OBJECT_DRAW[t.kind](g, t.x, t.y, t.r, rand));
}

// Chão do tema, com textura
function paintGround(g, theme, rand, themeName) {
  g.fillStyle = theme.ground;
  g.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
  if (themeName === 'campo' || !themeName) {
    // faixas de grama cortada
    g.fillStyle = 'rgba(255,255,255,0.045)';
    for (let x = -WORLD_HEIGHT; x < WORLD_WIDTH; x += 120) {
      g.beginPath();
      g.moveTo(x, 0);
      g.lineTo(x + 60, 0);
      g.lineTo(x + 60 + WORLD_HEIGHT, WORLD_HEIGHT);
      g.lineTo(x + WORLD_HEIGHT, WORLD_HEIGHT);
      g.fill();
    }
  } else {
    // manchas grandes e suaves (sombras da floresta, dunas, montes de neve)
    const blob = { floresta: 'rgba(15,50,20,0.16)', praia: 'rgba(255,245,215,0.35)', neve: 'rgba(150,175,210,0.18)' }[themeName];
    for (let i = 0; i < 26; i++) {
      g.fillStyle = blob;
      g.beginPath();
      g.ellipse(rand() * WORLD_WIDTH, rand() * WORLD_HEIGHT, 40 + rand() * 90, 20 + rand() * 40, rand() * Math.PI, 0, Math.PI * 2);
      g.fill();
    }
    if (themeName === 'praia') {
      // marcas de vento na areia
      g.strokeStyle = 'rgba(160,125,60,0.18)';
      g.lineWidth = 1.2;
      for (let i = 0; i < 60; i++) {
        const x = rand() * WORLD_WIDTH;
        const y = rand() * WORLD_HEIGHT;
        g.beginPath();
        g.moveTo(x, y);
        g.quadraticCurveTo(x + 10, y - 4, x + 20, y);
        g.stroke();
      }
    }
  }
  for (let i = 0; i < 1200; i++) {
    g.fillStyle = rand() < 0.5 ? theme.specks[0] : theme.specks[1];
    g.fillRect(rand() * WORLD_WIDTH, rand() * WORLD_HEIGHT, 2, 3);
  }
}

// Procura o lugar mais aberto do mapa (longe da pista) para o elemento especial
function findOpenSpot(clearance, maxR, rand) {
  let best = null;
  for (let y = 60; y < WORLD_HEIGHT - 60; y += 22) {
    for (let x = 60; x < WORLD_WIDTH - 60; x += 22) {
      if (x < 360 && y < 120) continue;
      const room = Math.min(clearance(x, y) - 20, x - 20, y - 20, WORLD_WIDTH - x - 20, WORLD_HEIGHT - y - 20);
      if (!best || room > best.room) best = { x, y, room };
    }
  }
  if (!best || best.room < 35) return null;
  return { x: best.x, y: best.y, r: Math.min(maxR, best.room - 8) };
}

// Asfalto: textura, remendos e grid de largada pintado
function paintAsphaltDetails(g, track, rand) {
  for (let i = 0; i < 2600; i++) {
    const k = Math.floor(rand() * track.points.length);
    const p = track.points[k];
    const h = track.headings[k];
    const off = (rand() - 0.5) * (track.width - 10);
    const x = p.x - Math.sin(h) * off + (rand() - 0.5) * 8;
    const y = p.y + Math.cos(h) * off + (rand() - 0.5) * 8;
    g.fillStyle = rand() < 0.5 ? 'rgba(0,0,0,0.13)' : 'rgba(255,255,255,0.07)';
    g.fillRect(x, y, 1.5, 1.5);
  }
  // marcas escuras de borracha no traçado ideal das curvas (faixas contínuas)
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.strokeStyle = 'rgba(22,22,26,0.11)';
  g.lineWidth = track.width * 0.22;
  const n = track.points.length;
  let drawing = false;
  let lastSign = 0;
  for (let i = 0; i <= n; i++) {
    const k = i % n;
    const turn = angleDifference(track.headings[(k + 6) % n], track.headings[(k - 6 + n) % n]);
    const sign = Math.sign(turn);
    if (Math.abs(turn) < 0.45 || (drawing && sign !== lastSign)) {
      if (drawing) g.stroke();
      drawing = false;
      if (Math.abs(turn) < 0.45) continue;
    }
    const p = track.points[k];
    const h = track.headings[k];
    const off = sign * track.width * 0.2; // lado de dentro da curva
    const x = p.x - Math.sin(h) * off;
    const y = p.y + Math.cos(h) * off;
    if (!drawing) {
      g.beginPath();
      g.moveTo(x, y);
      drawing = true;
      lastSign = sign;
    } else {
      g.lineTo(x, y);
    }
  }
  if (drawing) g.stroke();
  // grid de largada: vagas pintadas em branco
  for (let slot = 0; slot < CAR_MODELS.length; slot++) {
    const pose = track.startPose(slot);
    g.save();
    g.translate(pose.x, pose.y);
    g.rotate(pose.angle);
    g.strokeStyle = 'rgba(255,255,255,0.75)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(26, -12);
    g.lineTo(28, -12);
    g.lineTo(28, 12);
    g.lineTo(26, 12);
    g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.6)';
    g.font = `8px ${FONT}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.save();
    g.translate(33, 0);
    g.rotate(Math.PI / 2);
    g.fillText(String(slot + 1), 0, 0);
    g.restore();
    g.restore();
  }
}

// ---------------------------------------------------------------------------
// Elementos especiais
function drawPond(g, x, y, r, rand, frozen) {
  const rx = r;
  const ry = r * 0.7;
  g.fillStyle = frozen ? '#d4dde6' : '#c7b27a'; // margem
  g.beginPath();
  g.ellipse(x, y, rx + 7, ry + 7, 0.2, 0, Math.PI * 2);
  g.fill();
  const water = g.createRadialGradient(x - rx * 0.3, y - ry * 0.3, 4, x, y, rx);
  water.addColorStop(0, frozen ? '#e8f6ff' : '#5fb7e6');
  water.addColorStop(1, frozen ? '#9cc7e3' : '#2b7cb8');
  g.fillStyle = water;
  g.beginPath();
  g.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2);
  g.fill();
  if (frozen) {
    // rachaduras e brilho do gelo
    g.strokeStyle = 'rgba(255,255,255,0.8)';
    g.lineWidth = 1;
    for (let k = 0; k < 5; k++) {
      const a = rand() * Math.PI * 2;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * rx * 0.5, y + Math.sin(a) * ry * 0.5);
      g.lineTo(x + Math.cos(a + 0.3) * rx * 0.8, y + Math.sin(a + 0.3) * ry * 0.8);
      g.stroke();
    }
    return;
  }
  // vitórias-régias
  for (let k = 0; k < 6; k++) {
    const a = rand() * Math.PI * 2;
    const d = rand() * 0.7;
    const px = x + Math.cos(a) * rx * d;
    const py = y + Math.sin(a) * ry * d;
    g.fillStyle = '#3f9a45';
    g.beginPath();
    g.arc(px, py, 4, 0.4, Math.PI * 2);
    g.lineTo(px, py);
    g.fill();
    if (k % 3 === 0) {
      g.fillStyle = '#ff9ec7';
      g.beginPath();
      g.arc(px + 1, py - 1, 1.5, 0, Math.PI * 2);
      g.fill();
    }
  }
  // patinhos
  for (let k = 0; k < 3; k++) {
    const px = x - rx * 0.2 + k * 9;
    const py = y + ry * 0.25 + (k % 2) * 4;
    g.fillStyle = '#fff';
    g.beginPath();
    g.ellipse(px, py, 3.5, 2.2, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = '#ffb703';
    g.fillRect(px + 3, py - 0.5, 1.6, 1);
  }
  // reflexo
  g.strokeStyle = 'rgba(255,255,255,0.45)';
  g.lineWidth = 1.5;
  g.beginPath();
  g.ellipse(x - rx * 0.25, y - ry * 0.35, rx * 0.35, ry * 0.12, 0.2, 0, Math.PI);
  g.stroke();
}

function paintSea(g, rand) {
  const top = (x) => WORLD_HEIGHT - 42 + Math.sin(x / 45) * 6;
  // areia molhada
  g.fillStyle = '#d6bd82';
  g.beginPath();
  g.moveTo(0, WORLD_HEIGHT);
  for (let x = 0; x <= WORLD_WIDTH; x += 10) g.lineTo(x, top(x) - 8);
  g.lineTo(WORLD_WIDTH, WORLD_HEIGHT);
  g.fill();
  // água
  const sea = g.createLinearGradient(0, WORLD_HEIGHT - 50, 0, WORLD_HEIGHT);
  sea.addColorStop(0, '#5fd0e0');
  sea.addColorStop(1, '#1e7fb8');
  g.fillStyle = sea;
  g.beginPath();
  g.moveTo(0, WORLD_HEIGHT);
  for (let x = 0; x <= WORLD_WIDTH; x += 10) g.lineTo(x, top(x));
  g.lineTo(WORLD_WIDTH, WORLD_HEIGHT);
  g.fill();
  // espuma
  g.strokeStyle = 'rgba(255,255,255,0.85)';
  g.lineWidth = 2.5;
  g.beginPath();
  for (let x = 0; x <= WORLD_WIDTH; x += 10) (x === 0 ? g.moveTo(x, top(x)) : g.lineTo(x, top(x)));
  g.stroke();
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 1.5;
  for (let i = 0; i < 25; i++) {
    const x = rand() * WORLD_WIDTH;
    const y = top(x) + 10 + rand() * 25;
    g.beginPath();
    g.moveTo(x, y);
    g.quadraticCurveTo(x + 8, y - 3, x + 16, y);
    g.stroke();
  }
}

function drawCabin(g, x, y, rand) {
  g.save();
  g.translate(x, y);
  g.rotate(-0.15);
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.fillRect(-22 + 5, -16 + 5, 44, 32);
  // telhado de duas águas
  g.fillStyle = '#8a4b2a';
  g.fillRect(-22, -16, 44, 16);
  g.fillStyle = '#6e3a1f';
  g.fillRect(-22, 0, 44, 16);
  g.strokeStyle = '#4a2512';
  g.lineWidth = 1;
  for (let k = -18; k < 22; k += 6) {
    g.beginPath();
    g.moveTo(k, -16);
    g.lineTo(k, 16);
    g.stroke();
  }
  g.strokeRect(-22, -16, 44, 32);
  // chaminé com fumaça
  g.fillStyle = '#777';
  g.fillRect(10, -12, 6, 6);
  g.fillStyle = 'rgba(230,230,230,0.6)';
  [0, 1, 2].forEach((k) => {
    g.beginPath();
    g.arc(16 + k * 6, -14 - k * 5, 3 + k, 0, Math.PI * 2);
    g.fill();
  });
  g.restore();
  // lenha empilhada e caminho
  g.fillStyle = '#a0794f';
  for (let k = 0; k < 4; k++) g.fillRect(x - 30, y + 18 + k * 3, 12, 2.5);
}

// ---------------------------------------------------------------------------
// Objetos de cada tema
const OBJECT_SIZES = {
  tree: [11, 13], bush: [6, 6], flowers: [6, 5], pine: [10, 11], rock: [5, 7], log: [8, 5],
  palm: [12, 9], umbrella: [9, 4], dunegrass: [5, 5], snowpine: [10, 11], snowrock: [5, 7], snowman: [8, 3],
};

const OBJECT_DRAW = {
  tree: (g, x, y, r, rand) => drawTree(g, x, y, r, rand),
  bush: (g, x, y, r, rand) => drawBush(g, x, y, r, rand),
  flowers: (g, x, y, r, rand) => {
    const colors = ['#ff5d8f', '#ffd23f', '#ffffff', '#b07bff', '#ff8a1c'];
    for (let k = 0; k < 10; k++) {
      const a = rand() * Math.PI * 2;
      const d = rand() * r;
      g.fillStyle = '#2e7a33';
      g.beginPath();
      g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d, 2.4, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = colors[Math.floor(rand() * colors.length)];
      g.beginPath();
      g.arc(x + Math.cos(a) * d, y + Math.sin(a) * d - 0.5, 1.5, 0, Math.PI * 2);
      g.fill();
    }
  },
  pine: (g, x, y, r) => drawPine(g, x, y, r, false),
  snowpine: (g, x, y, r) => drawPine(g, x, y, r, true),
  rock: (g, x, y, r, rand) => drawRock(g, x, y, r, rand, false),
  snowrock: (g, x, y, r, rand) => drawRock(g, x, y, r, rand, true),
  log: (g, x, y, r, rand) => {
    g.save();
    g.translate(x, y);
    g.rotate(rand() * Math.PI);
    g.fillStyle = 'rgba(0,0,0,0.25)';
    g.fillRect(-r + 2, -2, r * 2, 6);
    g.fillStyle = '#7a4e2a';
    g.beginPath();
    g.roundRect(-r, -3.5, r * 2, 7, 3);
    g.fill();
    g.fillStyle = '#c99a62';
    g.beginPath();
    g.ellipse(r, 0, 1.8, 3.5, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  },
  palm: (g, x, y, r, rand) => {
    g.fillStyle = 'rgba(0,0,0,0.22)';
    g.beginPath();
    g.ellipse(x + r * 0.5, y + r * 0.5, r, r * 0.8, 0, 0, Math.PI * 2);
    g.fill();
    const leaves = 7;
    const start = rand() * Math.PI;
    for (let k = 0; k < leaves; k++) {
      const a = start + (k / leaves) * Math.PI * 2;
      g.save();
      g.translate(x, y);
      g.rotate(a);
      g.fillStyle = k % 2 ? '#2f9e44' : '#3fb653';
      g.beginPath();
      g.moveTo(0, 0);
      g.quadraticCurveTo(r * 0.5, -r * 0.35, r, 0);
      g.quadraticCurveTo(r * 0.5, r * 0.2, 0, 0);
      g.fill();
      g.strokeStyle = 'rgba(20,80,30,0.6)';
      g.lineWidth = 0.8;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(r * 0.95, 0);
      g.stroke();
      g.restore();
    }
    g.fillStyle = '#7a4e2a';
    [[-1.5, -1], [1.5, -1], [0, 1.5]].forEach(([dx, dy]) => {
      g.beginPath();
      g.arc(x + dx, y + dy, 1.8, 0, Math.PI * 2);
      g.fill();
    });
  },
  umbrella: (g, x, y, r, rand) => {
    // toalha
    g.fillStyle = ['#ff5d8f', '#4ea8de', '#ffd23f', '#1fa54a'][Math.floor(rand() * 4)];
    g.save();
    g.translate(x + r * 0.9, y + r * 0.6);
    g.rotate(rand() * 0.6 - 0.3);
    g.fillRect(-4, -8, 8, 16);
    g.fillStyle = 'rgba(255,255,255,0.6)';
    g.fillRect(-4, -2, 8, 2);
    g.restore();
    // guarda-sol
    g.fillStyle = 'rgba(0,0,0,0.2)';
    g.beginPath();
    g.arc(x + 3, y + 3, r, 0, Math.PI * 2);
    g.fill();
    const colors = rand() < 0.5 ? ['#e8232a', '#ffffff'] : ['#1d4fd8', '#ffd23f'];
    for (let k = 0; k < 8; k++) {
      g.fillStyle = colors[k % 2];
      g.beginPath();
      g.moveTo(x, y);
      g.arc(x, y, r, (k / 8) * Math.PI * 2, ((k + 1) / 8) * Math.PI * 2);
      g.fill();
    }
    g.fillStyle = '#555';
    g.beginPath();
    g.arc(x, y, 1.5, 0, Math.PI * 2);
    g.fill();
  },
  dunegrass: (g, x, y, r) => {
    g.strokeStyle = '#8a9a4a';
    g.lineWidth = 1.2;
    for (let k = 0; k < 7; k++) {
      const a = -Math.PI / 2 + (k - 3) * 0.3;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      g.stroke();
    }
  },
  snowman: (g, x, y, r, rand) => {
    g.fillStyle = 'rgba(80,100,140,0.25)';
    g.beginPath();
    g.ellipse(x + 3, y + 4, r + 2, r, 0, 0, Math.PI * 2);
    g.fill();
    // braços de galho
    g.strokeStyle = '#6b4423';
    g.lineWidth = 1.3;
    g.beginPath();
    g.moveTo(x - r * 0.8, y + r * 0.1);
    g.lineTo(x - r * 1.7, y - r * 0.5);
    g.moveTo(x - r * 1.45, y - r * 0.35);
    g.lineTo(x - r * 1.6, y - r * 0.8);
    g.moveTo(x + r * 0.8, y + r * 0.1);
    g.lineTo(x + r * 1.7, y - r * 0.4);
    g.stroke();
    // corpo
    g.fillStyle = '#ffffff';
    g.strokeStyle = '#b9c6d6';
    g.lineWidth = 1;
    g.beginPath();
    g.arc(x, y + r * 0.35, r, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    // botões
    g.fillStyle = '#333';
    [0.1, 0.55, 1].forEach((k) => g.fillRect(x - 0.8, y + r * k - 0.8, 1.6, 1.6));
    // cachecol
    g.fillStyle = '#e8232a';
    g.beginPath();
    g.ellipse(x, y - r * 0.55, r * 0.62, r * 0.25, 0, 0, Math.PI * 2);
    g.fill();
    g.fillRect(x + r * 0.2, y - r * 0.55, 2, r * 0.7);
    // cabeça com gorro
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(x, y - r * 0.85, r * 0.55, 0, Math.PI * 2);
    g.fill();
    g.stroke();
    g.fillStyle = '#1d4fd8';
    g.beginPath();
    g.arc(x, y - r * 1.05, r * 0.42, Math.PI, Math.PI * 2);
    g.fill();
    g.fillStyle = '#ffffff';
    g.beginPath();
    g.arc(x, y - r * 1.45, r * 0.15, 0, Math.PI * 2);
    g.fill();
    // nariz de cenoura
    g.fillStyle = '#ff8a1c';
    g.beginPath();
    g.moveTo(x, y - r * 0.8);
    g.lineTo(x + r * 0.55, y - r * 0.72);
    g.lineTo(x, y - r * 0.65);
    g.fill();
  },
};

function drawPine(g, x, y, r, snowy) {
  g.fillStyle = snowy ? 'rgba(80,100,140,0.25)' : 'rgba(0,0,0,0.28)';
  g.beginPath();
  g.ellipse(x + r * 0.4, y + r * 0.45, r, r * 0.85, 0, 0, Math.PI * 2);
  g.fill();
  const layers = snowy ? ['#1f5a3a', '#2a6e48', '#ffffff'] : ['#1b4d2a', '#256b37', '#33864a'];
  layers.forEach((c, k) => {
    const rr = r * (1 - k * 0.3);
    g.fillStyle = c;
    g.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + k * 0.2;
      const d = i % 2 === 0 ? rr : rr * 0.62;
      const px = x - k * 1.2 + Math.cos(a) * d;
      const py = y - k * 1.2 + Math.sin(a) * d;
      i === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
    }
    g.closePath();
    g.fill();
  });
  if (snowy) {
    g.fillStyle = 'rgba(255,255,255,0.75)';
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      g.beginPath();
      g.arc(x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.75, r * 0.12, 0, Math.PI * 2);
      g.fill();
    }
  }
  g.fillStyle = snowy ? '#ffffff' : '#4a9a5a';
  g.beginPath();
  g.arc(x - 2.4, y - 2.4, r * 0.12, 0, Math.PI * 2);
  g.fill();
}

function drawRock(g, x, y, r, rand, snowy) {
  g.fillStyle = 'rgba(0,0,0,0.25)';
  g.beginPath();
  g.ellipse(x + 2, y + 2, r, r * 0.8, 0, 0, Math.PI * 2);
  g.fill();
  const pts = [];
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const d = r * (0.75 + rand() * 0.25);
    pts.push([x + Math.cos(a) * d, y + Math.sin(a) * d * 0.85]);
  }
  g.fillStyle = '#8b8f97';
  g.beginPath();
  pts.forEach(([px, py], i) => (i === 0 ? g.moveTo(px, py) : g.lineTo(px, py)));
  g.closePath();
  g.fill();
  g.strokeStyle = '#5d6168';
  g.lineWidth = 1;
  g.stroke();
  g.fillStyle = snowy ? '#ffffff' : '#b3b7be';
  g.beginPath();
  g.ellipse(x - r * 0.2, y - r * 0.25, r * 0.5, r * 0.35, -0.3, 0, Math.PI * 2);
  g.fill();
}

// Posto de fiscal de pista: cabine laranja com bandeira
function drawMarshalPost(g, x, y, h, k) {
  g.save();
  g.translate(x, y);
  g.rotate(h);
  g.fillStyle = 'rgba(0,0,0,0.3)';
  g.fillRect(-6 + 2, -5 + 2, 12, 10);
  g.fillStyle = '#ff8a1c';
  g.fillRect(-6, -5, 12, 10);
  g.strokeStyle = '#a3520a';
  g.lineWidth = 1;
  g.strokeRect(-6, -5, 12, 10);
  g.fillStyle = '#ffffff';
  g.fillRect(-4, -3, 8, 2);
  // bandeira (verde, amarela, azul ou branca)
  g.fillStyle = ['#2fbf55', '#ffd23f', '#3b82f6', '#ffffff'][k % 4];
  g.fillRect(6, -9, 7, 5);
  g.strokeStyle = '#333';
  g.beginPath();
  g.moveTo(6, -9);
  g.lineTo(6, 0);
  g.stroke();
  g.restore();
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
    return { x: cx, y: cy, radius: len / 2 + 10, angle: h, len, depth };
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
      if (x - len / 2 < 350 && y < 115) continue; // espaço do painel
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
