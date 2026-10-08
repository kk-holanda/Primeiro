// Sons gerados pelo próprio navegador (Web Audio), sem arquivos de áudio.
// O navegador só libera o som depois que o jogador aperta uma tecla ou clica.
const Sound = {
  ctx: null,
  muted: false,

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      return;
    }
    const c = this.ctx;
    this.master = c.createGain();
    this.master.gain.value = 0.5;
    this.master.connect(c.destination);

    // Motor: onda "serrote" abafada por um filtro
    // Duas ondas levemente desafinadas + uma oitava abaixo = ronco mais encorpado
    this.engineGain = c.createGain();
    this.engineGain.gain.value = 0;
    this.engineFilter = c.createBiquadFilter();
    this.engineFilter.type = 'lowpass';
    this.engineFilter.frequency.value = 500;
    this.engineFilter.Q.value = 4;
    this.engineFilter.connect(this.engineGain).connect(this.master);
    this.engine = c.createOscillator();
    this.engine.type = 'sawtooth';
    this.engine2 = c.createOscillator();
    this.engine2.type = 'sawtooth';
    this.engineSub = c.createOscillator();
    this.engineSub.type = 'square';
    const subGain = c.createGain();
    subGain.gain.value = 0.5;
    this.engine.connect(this.engineFilter);
    this.engine2.connect(this.engineFilter);
    this.engineSub.connect(subGain).connect(this.engineFilter);
    [this.engine, this.engine2, this.engineSub].forEach((o) => {
      o.frequency.value = 55;
      o.start();
    });

    // Pneu cantando: ruído filtrado
    const buffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const bandpass = c.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1700;
    bandpass.Q.value = 1.3;
    this.skidGain = c.createGain();
    this.skidGain.gain.value = 0;
    noise.connect(bandpass).connect(this.skidGain).connect(this.master);
    noise.start();
  },

  // Chamado a cada quadro com o carro do jogador (ou null nos menus)
  update(car) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    if (!car) {
      this.engineGain.gain.setTargetAtTime(0, t, 0.08);
      this.skidGain.gain.setTargetAtTime(0, t, 0.05);
      return;
    }
    const ratio = Math.min(1.1, Math.abs(car.forwardSpeed || 0) / car.perf.maxSpeed);
    // "Marchas": o tom sobe dentro de cada marcha e cai na troca
    const gear = Math.min(4, Math.floor(ratio * 5));
    const inGear = ratio * 5 - gear;
    const freq = 48 + gear * 10 + inGear * 70;
    this.engine.frequency.setTargetAtTime(freq, t, 0.04);
    this.engine2.frequency.setTargetAtTime(freq * 1.012, t, 0.04);
    this.engineSub.frequency.setTargetAtTime(freq / 2, t, 0.04);
    this.engineFilter.frequency.setTargetAtTime(350 + ratio * 1600, t, 0.06);
    this.engineGain.gain.setTargetAtTime(0.05 + 0.06 * ratio, t, 0.1);
    const skidding = car.onRoad && car.isSkidding();
    this.skidGain.gain.setTargetAtTime(skidding ? 0.1 : 0, t, 0.05);
  },

  beep(freq, duration = 0.15, volume = 0.2) {
    if (!this.ctx) return;
    const c = this.ctx;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(c.currentTime + duration);
  },

  // Plateia aplaudindo: centenas de "palminhas" de ruído espalhadas no tempo
  applause() {
    if (!this.ctx) return;
    const c = this.ctx;
    const seconds = 3;
    const buffer = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
    const data = buffer.getChannelData(0);
    const clapLength = Math.floor(c.sampleRate * 0.012);
    for (let k = 0; k < 1400; k++) {
      const t = Math.random() * seconds;
      const envelope = t < 0.3 ? t / 0.3 : Math.max(0, 1 - (t - 0.3) / (seconds - 0.3));
      if (Math.random() > envelope) continue;
      const start = Math.floor(t * c.sampleRate);
      const loud = 0.3 + Math.random() * 0.7;
      for (let i = 0; i < clapLength && start + i < data.length; i++) {
        data[start + i] += (Math.random() * 2 - 1) * loud * (1 - i / clapLength);
      }
    }
    const source = c.createBufferSource();
    source.buffer = buffer;
    const highpass = c.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 700;
    const gain = c.createGain();
    gain.gain.value = 0.35;
    source.connect(highpass).connect(gain).connect(this.master);
    source.start();
  },

  // Batida entre carros: um "tum" grave (com limite para não repetir demais)
  impact(strength) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - (this.lastImpact || 0) < 0.15) return;
    this.lastImpact = now;
    const c = this.ctx;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
    gain.gain.setValueAtTime(Math.min(0.5, strength / 500), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain).connect(this.master);
    osc.start();
    osc.stop(now + 0.2);
  },

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.5;
  },
};

// ---------------------------------------------------------------------------
// Recordes de volta, guardados no navegador (por pista)
const Records = {
  key: 'kkart-records',
  load() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || {};
    } catch (e) {
      return {};
    }
  },
  get(trackName) {
    const t = this.load()[trackName];
    return typeof t === 'number' ? t : null;
  },
  // Retorna true se for um novo recorde
  submit(trackName, time) {
    const all = this.load();
    if (typeof all[trackName] === 'number' && all[trackName] <= time) return false;
    all[trackName] = time;
    try {
      localStorage.setItem(this.key, JSON.stringify(all));
    } catch (e) {
      // sem armazenamento disponível: o recorde vale só nesta sessão
    }
    this.memory = all;
    return true;
  },
};
