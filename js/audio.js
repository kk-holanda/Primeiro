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
    this.engine = c.createOscillator();
    this.engine.type = 'sawtooth';
    this.engine.frequency.value = 55;
    const lowpass = c.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 650;
    this.engineGain = c.createGain();
    this.engineGain.gain.value = 0;
    this.engine.connect(lowpass).connect(this.engineGain).connect(this.master);
    this.engine.start();

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
    this.engine.frequency.setTargetAtTime(50 + gear * 10 + inGear * 65, t, 0.04);
    this.engineGain.gain.setTargetAtTime(0.06 + 0.07 * ratio, t, 0.1);
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
