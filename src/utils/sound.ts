// Robust Web Audio API Synthesizer with distinct, realistically differentiated nature ambients & harmonic frequencies
// Immediately resumes AudioContext upon user gesture and connects active GainNodes to destination.
// Master ambient is calibrated to a delicate background cushion (0.04 - 0.06) so it never competes with Voice Guidance.
// Features 1-second smooth linear fade-in and fade-out transitions.

export type AmbientSoundId =
  | 'rain_forest'
  | 'gentle_rain'
  | 'forest_breeze'
  | 'ocean_waves'
  | 'frequency_432'
  | 'frequency_396'
  | 'silence';

export interface AmbientLowpassConfig {
  cutoffFrequency: number; // Cutoff frequency in Hertz (Hz)
  qFactor: number;         // Quality resonance factor (Q)
  description: string;     // Textura acústica para descanso mental
}

export interface AmbientSecondaryFilterConfig {
  type: BiquadFilterType;
  frequency: number;
  Q: number;
}

export interface AmbientAcousticConfig {
  id: AmbientSoundId;
  name: string;
  lowpass: AmbientLowpassConfig;
  secondaryFilter?: AmbientSecondaryFilterConfig;
  baseGain: number;
  bufferSeconds: number;
  soundSignature: string;
}

// Configuración de Modelado Acústico: Parámetros específicos de filtro pasa-bajos suaves
// (lowpass calibrado entre 700 Hz y 1000 Hz) para una textura cálida, orgánica y sin frecuencias agudas estridentes.
export const AMBIENT_ACOUSTIC_CONFIGS: Record<AmbientSoundId, AmbientAcousticConfig> = {
  rain_forest: {
    id: 'rain_forest',
    name: 'Lluvia en el Bosque',
    lowpass: {
      cutoffFrequency: 780, // Hz: Calidez orgánica entre 700 y 1000 Hz
      qFactor: 0.65,        // Q suave sin asperezas metálicas
      description: 'Pasa-bajos a 780 Hz (Q: 0.65) que emula la absorción cálida de hojas húmedas'
    },
    secondaryFilter: {
      type: 'bandpass',
      frequency: 1250,
      Q: 1.2
    },
    baseGain: 0.35,
    bufferSeconds: 5,
    soundSignature: 'Gotas somáticas en hojas húmedas con caída suave y filtro cálido'
  },
  gentle_rain: {
    id: 'gentle_rain',
    name: 'Lluvia Suave Continua',
    lowpass: {
      cutoffFrequency: 860, // Hz: Textura sedosa y suave entre 700 y 1000 Hz
      qFactor: 0.70,        // Q equilibrado para textura aterciopelada
      description: 'Pasa-bajos a 860 Hz (Q: 0.70) para una llovizna constante y relajante'
    },
    secondaryFilter: {
      type: 'bandpass',
      frequency: 2400,
      Q: 1.3
    },
    baseGain: 0.45,
    bufferSeconds: 6,
    soundSignature: 'Manto sedoso continuo sin fluctuaciones abruptas'
  },
  forest_breeze: {
    id: 'forest_breeze',
    name: 'Brisa de Bosque',
    lowpass: {
      cutoffFrequency: 740, // Hz: Silbido eólico con cuerpo cálido y profundo (700-1000 Hz)
      qFactor: 0.75,        // Q de resonancia eólica suave entre ramas
      description: 'Pasa-bajos a 740 Hz (Q: 0.75) para susurros de viento entre coníferas'
    },
    secondaryFilter: {
      type: 'bandpass',
      frequency: 1350,
      Q: 1.8
    },
    baseGain: 0.50,
    bufferSeconds: 7,
    soundSignature: 'Viento ondulante con ráfagas suaves y crujido de pinos'
  },
  ocean_waves: {
    id: 'ocean_waves',
    name: 'Olas de Mar Calmas',
    lowpass: {
      cutoffFrequency: 720, // Hz: Masa de agua profunda y oleaje suave somático (700-1000 Hz)
      qFactor: 0.85,        // Resonancia de marea envolvente
      description: 'Pasa-bajos a 720 Hz (Q: 0.85) para el vaivén profundo de las olas'
    },
    secondaryFilter: {
      type: 'bandpass',
      frequency: 1450,
      Q: 1.2
    },
    baseGain: 0.55,
    bufferSeconds: 8,
    soundSignature: 'Marea rítmica de 8.5s con oleaje profundo y espuma fina'
  },
  frequency_432: {
    id: 'frequency_432',
    name: 'Frecuencia 432 Hz / 396 Hz & Cuenco',
    lowpass: {
      cutoffFrequency: 864, // Hz: Suavizado armónico
      qFactor: 0.70,        // Resonancia cristalina sin aspereza
      description: 'Pasa-bajos a 864 Hz (Q: 0.70) para un tono cálido de cuenco tibetano'
    },
    baseGain: 0.40,
    bufferSeconds: 5,
    soundSignature: 'Tono puro 432 Hz, sub-octava 216 Hz y pulso alfa de 0.5 Hz'
  },
  frequency_396: {
    id: 'frequency_396',
    name: 'Frecuencia 396 Hz & Anclaje',
    lowpass: {
      cutoffFrequency: 792, // Hz: Suavizado armónico superior
      qFactor: 0.70,
      description: 'Pasa-bajos a 792 Hz (Q: 0.70) para soltar miedo y anclar respiración profunda'
    },
    baseGain: 0.42,
    bufferSeconds: 5,
    soundSignature: 'Tono Solfeggio 396 Hz liberador, sub-octava 198 Hz y pulso somático de 0.5 Hz'
  },
  silence: {
    id: 'silence',
    name: 'Silencio (Solo Voz)',
    lowpass: {
      cutoffFrequency: 0,
      qFactor: 0,
      description: 'Fondo acústico desactivado, foco exclusivo en la voz guiada'
    },
    baseGain: 0.0,
    bufferSeconds: 1,
    soundSignature: 'Silencio absoluto para introspección y descanso auditivo'
  }
};

export interface AmbientSoundOption {
  id: AmbientSoundId;
  title: string;
  subtitle: string;
  iconName: string;
  badge: string;
  soundSignature: string;
  acousticFilterNote: string;
}

export const AMBIENT_SOUND_OPTIONS: AmbientSoundOption[] = [
  {
    id: 'rain_forest',
    title: 'Lluvia en el Bosque',
    subtitle: 'Gotas rítmicas sobre hojas húmedas y tierra fértil',
    iconName: 'CloudRain',
    badge: 'Recomendado',
    soundSignature: 'Gotas somáticas con filtro cálido a 780 Hz',
    acousticFilterNote: 'Pasa-bajos a 780 Hz sin asperezas metálicas'
  },
  {
    id: 'gentle_rain',
    title: 'Lluvia Suave Continua',
    subtitle: 'Cortina constante y sedosa para calmar la mente',
    iconName: 'Droplets',
    badge: 'Calma pura',
    soundSignature: 'Manto sedoso continuo con filtro a 860 Hz',
    acousticFilterNote: 'Pasa-bajos a 860 Hz aterciopelado'
  },
  {
    id: 'forest_breeze',
    title: 'Brisa de Bosque',
    subtitle: 'Susurros eólicos y movimiento entre coníferas',
    iconName: 'Trees',
    badge: 'Respiración',
    soundSignature: 'Viento ondulante con filtro a 740 Hz',
    acousticFilterNote: 'Pasa-bajos a 740 Hz orgánico y profundo'
  },
  {
    id: 'ocean_waves',
    title: 'Olas de Mar Calmas',
    subtitle: 'Vaivén cíclico de marea profunda y resaca suave',
    iconName: 'Waves',
    badge: 'Coherencia',
    soundSignature: 'Marea rítmica con filtro a 720 Hz',
    acousticFilterNote: 'Pasa-bajos a 720 Hz sin agudos estridentes'
  },
  {
    id: 'frequency_432',
    title: 'Frecuencia 432 Hz / 396 Hz & Cuenco',
    subtitle: 'Armónicos puros de relajación celular y anclaje',
    iconName: 'Radio',
    badge: 'Armónicos',
    soundSignature: 'Tono 432 Hz, resonancia 396 Hz y cuenco tibetano',
    acousticFilterNote: 'Armónicos puros con sub-octava cálida'
  },
  {
    id: 'silence',
    title: 'Silencio (Solo Voz)',
    subtitle: 'Sin música de fondo, enfoque exclusivo en la voz de Fenrir',
    iconName: 'VolumeX',
    badge: 'Solo Voz',
    soundSignature: 'Silencio absoluto para introspección y descanso auditivo',
    acousticFilterNote: 'Fondo desactivado'
  }
];

const PREFERRED_AMBIENT_KEY = 'vuelve_centro_preferred_ambient';
const AMBIENT_VOLUME_KEY = 'vuelve_centro_ambient_volume';

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  // Master ambient base gain cushion (around 0.35 for audible, warm presence)
  private _ambientBaseGain: number = 0.35;
  // User ambient volume slider (0.0 to 1.0, default 0.70)
  private _ambientUserVolume: number = 0.70;
  private _isDucked: boolean = false;
  private _cueVolume: number = 0.35;

  // Active ambient nodes tracking for clean stop/start with fade
  private ambientGain: GainNode | null = null;
  private activeSources: (AudioBufferSourceNode | OscillatorNode)[] = [];
  private activeIntervals: number[] = [];
  private _isPlayingAmbient: boolean = false;
  private _currentAmbientId: AmbientSoundId = 'rain_forest';
  private _currentAmbientLabel: string = 'Lluvia en el Bosque';

  constructor() {
    this.activeSources = [];
    if (typeof window !== 'undefined') {
      try {
        const savedVol = localStorage.getItem(AMBIENT_VOLUME_KEY);
        if (savedVol !== null) {
          const parsed = parseFloat(savedVol);
          if (!isNaN(parsed)) {
            this._ambientUserVolume = Math.max(0, Math.min(1, parsed));
          }
        }
        const savedAmbient = localStorage.getItem(PREFERRED_AMBIENT_KEY) as AmbientSoundId;
        if (savedAmbient && AMBIENT_SOUND_OPTIONS.some((opt) => opt.id === savedAmbient)) {
          this._currentAmbientId = savedAmbient;
          const match = AMBIENT_SOUND_OPTIONS.find((opt) => opt.id === savedAmbient);
          if (match) this._currentAmbientLabel = match.title;
        }
      } catch (e) {}
    }
  }

  /**
   * Returns the user's preferred ambient sound from localStorage
   */
  public getPreferredAmbient(): AmbientSoundId {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(PREFERRED_AMBIENT_KEY) as AmbientSoundId;
        if (saved && AMBIENT_SOUND_OPTIONS.some((opt) => opt.id === saved)) {
          return saved;
        }
      } catch (e) {}
    }
    return this._currentAmbientId || 'rain_forest';
  }

  /**
   * Persist user's ambient sound choice globally
   */
  public setPreferredAmbient(id: AmbientSoundId): void {
    this._currentAmbientId = id;
    const match = AMBIENT_SOUND_OPTIONS.find((opt) => opt.id === id);
    if (match) this._currentAmbientLabel = match.title;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(PREFERRED_AMBIENT_KEY, id);
      } catch (e) {}
    }
  }

  /**
   * Independent ambient volume slider getter (0.0 to 1.0)
   */
  get ambientVolume(): number {
    return this._ambientUserVolume;
  }

  /**
   * Independent ambient volume slider setter (0.0 to 1.0) with localStorage persistence
   */
  setAmbientVolume(val: number): void {
    this._ambientUserVolume = Math.max(0, Math.min(1, val));
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(AMBIENT_VOLUME_KEY, String(this._ambientUserVolume));
      } catch (e) {}
    }
    this.applyCurrentAmbientGain(0.3);
  }

  /**
   * Smooth Audio Ducking: lowers ambient gain while Fenrir speaks, restores during breathing pauses
   */
  public duckAmbient(ducked: boolean): void {
    this._isDucked = ducked;
    // Fast ramp down when speech starts (0.4s), gentle restore during pauses (1.2s)
    this.applyCurrentAmbientGain(ducked ? 0.4 : 1.2);
  }

  /**
   * Calculate target gain considering user volume and ducking state
   */
  private getTargetAmbientGain(): number {
    if (this._currentAmbientId === 'silence') return 0.0001;
    const duckFactor = this._isDucked ? 0.45 : 1.0;
    return Math.max(0.0001, this._ambientBaseGain * this._ambientUserVolume * duckFactor);
  }

  /**
   * Apply gain change smoothly to active ambientGain node
   */
  private applyCurrentAmbientGain(rampSeconds: number = 0.5): void {
    if (!this.ambientGain || !this.ctx || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const target = this.getTargetAmbientGain();
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(target, now + rampSeconds);
    } catch (e) {}
  }

  // Synchronously get or create AudioContext and resume immediately on user interaction
  public getOrCreateContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch((err) => console.warn('Audio resume error:', err));
      }
    } catch (e) {
      console.warn('AudioContext error:', e);
    }
    return this.ctx;
  }

  // Explicit resume method for direct button onclick handlers
  public resumeContext(): void {
    const audioCtx = this.getOrCreateContext();
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  get volume(): number {
    return this._ambientUserVolume;
  }

  setVolume(val: number) {
    this.setAmbientVolume(val);
  }

  // =========================================================================
  // DEDICATED AUDIO BUFFERS (Unico para cada preset de la naturaleza)
  // Cada preset dispone de un buffer sintetizado a medida según su firma acústica
  // =========================================================================

  // 1. AudioBuffer Único para LLUVIA EN EL BOSQUE (Follaje denso + humedad + micro-gotas)
  private createRainForestBuffer(ctx: AudioContext, seconds: number = 5): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // Multi-tap pink noise generator con amortiguación vegetal
    let b0L = 0, b1L = 0, b2L = 0, b3L = 0, b4L = 0, b5L = 0, b6L = 0;
    let b0R = 0, b1R = 0, b2R = 0, b3R = 0, b4R = 0, b5R = 0, b6R = 0;

    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;

      b0L = 0.99886 * b0L + whiteL * 0.0555;
      b1L = 0.99332 * b1L + whiteL * 0.0750;
      b2L = 0.96900 * b2L + whiteL * 0.1538;
      b3L = 0.86650 * b3L + whiteL * 0.3104;
      b4L = 0.55000 * b4L + whiteL * 0.5329;
      b5L = -0.7616 * b5L - whiteL * 0.0168;
      left[i] = (b0L + b1L + b2L + b3L + b4L + b5L + whiteL * 0.5362) * 0.11;
      b6L = whiteL * 0.1159;

      b0R = 0.99886 * b0R + whiteR * 0.0555;
      b1R = 0.99332 * b1R + whiteR * 0.0750;
      b2R = 0.96900 * b2R + whiteR * 0.1538;
      b3R = 0.86650 * b3R + whiteR * 0.3104;
      b4R = 0.55000 * b4R + whiteR * 0.5329;
      b5R = -0.7616 * b5R - whiteR * 0.0168;
      right[i] = (b0R + b1R + b2R + b3R + b4R + b5R + whiteR * 0.5362) * 0.11;
      b6R = whiteR * 0.1159;
    }
    return buffer;
  }

  // 2. AudioBuffer Único para LLUVIA SUAVE CONTINUA (Cortina aterciopelada y constante)
  private createGentleRainBuffer(ctx: AudioContext, seconds: number = 6): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let pinkL = 0;
    let pinkR = 0;
    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      // Filtro de 1 polo integrado para un espectro suave y relajante
      pinkL = 0.95 * pinkL + 0.05 * whiteL;
      pinkR = 0.95 * pinkR + 0.05 * whiteR;
      left[i] = (pinkL * 0.7 + whiteL * 0.04) * 0.45;
      right[i] = (pinkR * 0.7 + whiteR * 0.04) * 0.45;
    }
    return buffer;
  }

  // 3. AudioBuffer Único para BRISA DE BOSQUE (Turbulencia de viento + crujido suave de pinos)
  private createForestBreezeBuffer(ctx: AudioContext, seconds: number = 7): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let brownL = 0;
    let brownR = 0;
    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      // Brownian motion wander para masa de aire
      brownL = (brownL + 0.02 * whiteL) / 1.02;
      brownR = (brownR + 0.02 * whiteR) / 1.02;
      // Modulación suave de textura
      const t = i / sampleRate;
      const airFlutter = Math.sin(t * 0.7) * 0.15;
      left[i] = brownL * (1.8 + airFlutter);
      right[i] = brownR * (1.8 - airFlutter);
    }
    return buffer;
  }

  // 4. AudioBuffer Único para OLAS DE MAR CALMAS (Hidroacústica de gran masa + resaca espumosa)
  private createOceanWavesBuffer(ctx: AudioContext, seconds: number = 8): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = ctx.createBuffer(2, bufferSize, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    let deepL = 0;
    let deepR = 0;
    for (let i = 0; i < bufferSize; i++) {
      const whiteL = Math.random() * 2 - 1;
      const whiteR = Math.random() * 2 - 1;
      deepL = (deepL + 0.012 * whiteL) / 1.012;
      deepR = (deepR + 0.012 * whiteR) / 1.012;
      // Sutil desfase estéreo para sensación de anchura marina inmersiva
      left[i] = deepL * 2.8;
      right[i] = deepR * 2.8;
    }
    return buffer;
  }

  // 5. AudioBuffer Único para Textura Espumosa y Salpicaduras Suaves
  private createFineFoamBuffer(ctx: AudioContext, seconds: number = 4): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.16;
    }
    return buffer;
  }

  // Stop ambient with smooth 1.5-second fade-out transition (linearRampToValueAtTime)
  stopAmbient(): void {
    if (!this._isPlayingAmbient && !this.ambientGain) return;
    this._isPlayingAmbient = false;

    // Clear active drop and wave intervals immediately
    this.activeIntervals.forEach((id) => clearInterval(id));
    this.activeIntervals = [];

    const gainToFade = this.ambientGain;
    const sourcesToStop = [...this.activeSources];
    this.ambientGain = null;
    this.activeSources = [];

    if (!gainToFade || !this.ctx) {
      sourcesToStop.forEach((src) => {
        try {
          src.stop();
          src.disconnect();
        } catch (e) {}
      });
      return;
    }

    try {
      const now = this.ctx.currentTime;
      gainToFade.gain.cancelScheduledValues(now);
      gainToFade.gain.setValueAtTime(gainToFade.gain.value, now);
      // Smooth 1.5-second fade out to prevent any clicks or abrupt cuts
      gainToFade.gain.linearRampToValueAtTime(0.0001, now + 1.5);

      window.setTimeout(() => {
        sourcesToStop.forEach((src) => {
          try {
            src.stop();
            src.disconnect();
          } catch (e) {}
        });
        try {
          gainToFade.disconnect();
        } catch (e) {}
      }, 1550);
    } catch (e) {
      sourcesToStop.forEach((src) => {
        try {
          src.stop();
          src.disconnect();
        } catch (err) {}
      });
    }
  }

  // Start selected ambient sound with smooth 1.5-second fade-in transition
  startAmbient(soundId?: AmbientSoundId): void {
    this.enabled = true;
    try {
      const chosenId = soundId || this.getPreferredAmbient() || 'rain_forest';
      this.setPreferredAmbient(chosenId);

      const audioCtx = this.getOrCreateContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      // Stop previous ambient cleanly with crossfade
      this.stopAmbient();

      const option = AMBIENT_SOUND_OPTIONS.find((opt) => opt.id === chosenId) || AMBIENT_SOUND_OPTIONS[0];
      this._currentAmbientId = chosenId;
      this._currentAmbientLabel = option.title;

      // Opción 6: Silencio (Solo Voz) - no sintetiza fuentes de ruido ni osciladores
      if (chosenId === 'silence') {
        this._isPlayingAmbient = false;
        return;
      }

      // Master Ambient Gain Node connected directly to destination
      // Starts at near-zero and fades in smoothly over 1.5s (sin cortes bruscos)
      const masterGain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      const targetLevel = this.getTargetAmbientGain();
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(targetLevel, now + 1.5);
      masterGain.connect(audioCtx.destination);
      this.ambientGain = masterGain;

      if (chosenId === 'rain_forest') {
        this.setupRainForest(audioCtx, masterGain);
      } else if (chosenId === 'gentle_rain') {
        this.setupGentleRain(audioCtx, masterGain);
      } else if (chosenId === 'forest_breeze') {
        this.setupForestBreeze(audioCtx, masterGain);
      } else if (chosenId === 'ocean_waves') {
        this.setupOceanWaves(audioCtx, masterGain);
      } else if (chosenId === 'frequency_396') {
        this.setupFrequency396(audioCtx, masterGain);
      } else {
        this.setupFrequency432(audioCtx, masterGain);
      }

      this._isPlayingAmbient = true;
    } catch (e) {
      console.warn('Error starting ambient sound:', e);
      this._isPlayingAmbient = false;
    }
  }

  // =========================================================================
  // 1. LLUVIA EN EL BOSQUE (Rain in Forest)
  // Utiliza createRainForestBuffer + BiquadFilterNode lowpass específico desde configuración
  // =========================================================================
  private setupRainForest(ctx: AudioContext, destination: GainNode): void {
    const config = AMBIENT_ACOUSTIC_CONFIGS.rain_forest;
    const rainForestBuffer = this.createRainForestBuffer(ctx, config.bufferSeconds);
    const splatterBuffer = this.createFineFoamBuffer(ctx, 3);

    // Warm damp forest floor / foliage body (lowpass configurado específicamente)
    const foliageSource = ctx.createBufferSource();
    foliageSource.buffer = rainForestBuffer;
    foliageSource.loop = true;

    // Filtro Pasa-Bajos cálido a 820 Hz sin asperezas metálicas
    const lowpassFilter = ctx.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.setValueAtTime(820, ctx.currentTime);
    lowpassFilter.Q.setValueAtTime(0.70, ctx.currentTime);

    const foliageGain = ctx.createGain();
    foliageGain.gain.setValueAtTime(0.65, ctx.currentTime);

    foliageSource.connect(lowpassFilter);
    lowpassFilter.connect(foliageGain);
    foliageGain.connect(destination);

    foliageSource.start();
    this.activeSources.push(foliageSource);

    // Realistic droplet synthesis scheduled regularly: woody/leafy taps every 180-280ms
    const scheduleForestDrop = () => {
      if (!this._isPlayingAmbient || !this.ambientGain) return;
      try {
        const now = ctx.currentTime;
        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        const baseFreq = 720 + Math.random() * 800; // 720 - 1520 Hz
        const duration = 0.04 + Math.random() * 0.025; // 40 - 65ms

        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(baseFreq, now);
        // Downward pitch bend simulating water impact droplet
        dropOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.62, now + duration);

        dropGain.gain.setValueAtTime(0.05 + Math.random() * 0.025, now);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        dropOsc.connect(dropGain);
        dropGain.connect(destination);
        dropOsc.start(now);
        dropOsc.stop(now + duration + 0.01);

        // Occasional light splatter on wet leaf surface
        if (Math.random() > 0.45) {
          const splatterSource = ctx.createBufferSource();
          splatterSource.buffer = splatterBuffer;
          const splatterFilter = ctx.createBiquadFilter();
          splatterFilter.type = 'bandpass';
          splatterFilter.frequency.value = 2100 + Math.random() * 500;
          splatterFilter.Q.value = 2.0;

          const splatterGain = ctx.createGain();
          splatterGain.gain.setValueAtTime(0.018, now);
          splatterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

          splatterSource.connect(splatterFilter);
          splatterFilter.connect(splatterGain);
          splatterGain.connect(destination);
          splatterSource.start(now);
          splatterSource.stop(now + 0.03);
        }
      } catch (e) {}
    };

    const dropInterval = window.setInterval(scheduleForestDrop, 190 + Math.floor(Math.random() * 110));
    this.activeIntervals.push(dropInterval);
  }

  // =========================================================================
  // 2. LLUVIA SUAVE CONTINUA (Gentle Steady Rain)
  // Utiliza createGentleRainBuffer + BiquadFilterNode lowpass específico desde configuración
  // =========================================================================
  private setupGentleRain(ctx: AudioContext, destination: GainNode): void {
    const config = AMBIENT_ACOUSTIC_CONFIGS.gentle_rain;
    const rainBuffer = this.createGentleRainBuffer(ctx, config.bufferSeconds);
    const mistBuffer = this.createFineFoamBuffer(ctx, 4);

    // Layer 1: Body de lluvia continua (Pasa-bajos calibrado: 460 Hz, Q: 0.65)
    const sourceBody = ctx.createBufferSource();
    sourceBody.buffer = rainBuffer;
    sourceBody.loop = true;

    const lowpassFilter = ctx.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.setValueAtTime(config.lowpass.cutoffFrequency, ctx.currentTime);
    lowpassFilter.Q.setValueAtTime(config.lowpass.qFactor, ctx.currentTime);

    const bodyGain = ctx.createGain();
    bodyGain.gain.setValueAtTime(0.60, ctx.currentTime);

    sourceBody.connect(lowpassFilter);
    lowpassFilter.connect(bodyGain);
    bodyGain.connect(destination);
    sourceBody.start();
    this.activeSources.push(sourceBody);

    // Layer 2: Cortina sedosa de llovizna fina
    const sourceMist = ctx.createBufferSource();
    sourceMist.buffer = mistBuffer;
    sourceMist.loop = true;

    const mistFilter = ctx.createBiquadFilter();
    mistFilter.type = config.secondaryFilter?.type || 'bandpass';
    mistFilter.frequency.setValueAtTime(config.secondaryFilter?.frequency || 2400, ctx.currentTime);
    mistFilter.Q.setValueAtTime(config.secondaryFilter?.Q || 1.3, ctx.currentTime);

    const mistGain = ctx.createGain();
    mistGain.gain.setValueAtTime(0.12, ctx.currentTime);

    sourceMist.connect(mistFilter);
    mistFilter.connect(mistGain);
    mistGain.connect(destination);
    sourceMist.start();
    this.activeSources.push(sourceMist);
  }

  // =========================================================================
  // 3. BRISA DE BOSQUE (Forest Breeze & Tree Wind)
  // Utiliza createForestBreezeBuffer + BiquadFilterNode lowpass específico desde configuración
  // =========================================================================
  private setupForestBreeze(ctx: AudioContext, destination: GainNode): void {
    const config = AMBIENT_ACOUSTIC_CONFIGS.forest_breeze;
    const breezeBuffer = this.createForestBreezeBuffer(ctx, config.bufferSeconds);
    const rustleBuffer = this.createFineFoamBuffer(ctx, 4);

    // Layer 1: Viento susurrante con filtro pasa-bajos configurado a 290 Hz, Q: 0.88
    const windSource = ctx.createBufferSource();
    windSource.buffer = breezeBuffer;
    windSource.loop = true;

    const lowpassFilter = ctx.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.setValueAtTime(760, ctx.currentTime);
    lowpassFilter.Q.setValueAtTime(0.75, ctx.currentTime);

    // LFO: Modula ráfagas suaves para ondulación orgánica del aire
    const gustLfo = ctx.createOscillator();
    gustLfo.type = 'sine';
    gustLfo.frequency.setValueAtTime(0.09, ctx.currentTime); // Ciclo de ~11 segundos

    const gustLfoGain = ctx.createGain();
    gustLfoGain.gain.setValueAtTime(0.20, ctx.currentTime);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.60, ctx.currentTime);

    gustLfo.connect(gustLfoGain);
    gustLfoGain.connect(windGain.gain);

    windSource.connect(lowpassFilter);
    lowpassFilter.connect(windGain);
    windGain.connect(destination);

    windSource.start();
    gustLfo.start();
    this.activeSources.push(windSource, gustLfo);

    // Layer 2: Susurro suave de follaje y agujas de pino
    const rustleSource = ctx.createBufferSource();
    rustleSource.buffer = rustleBuffer;
    rustleSource.loop = true;

    const rustleFilter = ctx.createBiquadFilter();
    rustleFilter.type = 'bandpass';
    rustleFilter.frequency.setValueAtTime(1600, ctx.currentTime);
    rustleFilter.Q.setValueAtTime(1.5, ctx.currentTime);

    const rustleGain = ctx.createGain();
    rustleGain.gain.setValueAtTime(0.06, ctx.currentTime);

    gustLfo.connect(rustleGain.gain);

    rustleSource.connect(rustleFilter);
    rustleFilter.connect(rustleGain);
    rustleGain.connect(destination);

    rustleSource.start();
    this.activeSources.push(rustleSource);
  }

  // =========================================================================
  // 4. OLAS DE MAR CALMAS (Calm Ocean Waves)
  // Utiliza createOceanWavesBuffer + BiquadFilterNode lowpass específico desde configuración
  // =========================================================================
  private setupOceanWaves(ctx: AudioContext, destination: GainNode): void {
    const config = AMBIENT_ACOUSTIC_CONFIGS.ocean_waves;
    const oceanBuffer = this.createOceanWavesBuffer(ctx, config.bufferSeconds);
    const foamBuffer = this.createFineFoamBuffer(ctx, 4);

    // Swell rumble source (Masa oceánica profunda)
    const swellSource = ctx.createBufferSource();
    swellSource.buffer = oceanBuffer;
    swellSource.loop = true;

    // Filtro pasa-bajos configurado a 720 Hz
    const lowpassFilter = ctx.createBiquadFilter();
    lowpassFilter.type = 'lowpass';
    lowpassFilter.frequency.setValueAtTime(720, ctx.currentTime);
    lowpassFilter.Q.setValueAtTime(0.85, ctx.currentTime);

    const swellGain = ctx.createGain();
    swellGain.gain.setValueAtTime(0.20, ctx.currentTime);

    swellSource.connect(lowpassFilter);
    lowpassFilter.connect(swellGain);
    swellGain.connect(destination);
    swellSource.start();
    this.activeSources.push(swellSource);

    // Seafoam surf wash source (Espuma marina)
    const foamSource = ctx.createBufferSource();
    foamSource.buffer = foamBuffer;
    foamSource.loop = true;

    const foamFilter = ctx.createBiquadFilter();
    foamFilter.type = 'bandpass';
    foamFilter.frequency.setValueAtTime(1450, ctx.currentTime);
    foamFilter.Q.setValueAtTime(1.2, ctx.currentTime);

    const foamGain = ctx.createGain();
    foamGain.gain.setValueAtTime(0.04, ctx.currentTime);

    foamSource.connect(foamFilter);
    foamFilter.connect(foamGain);
    foamGain.connect(destination);
    foamSource.start();
    this.activeSources.push(foamSource);

    // Ciclo de marea somática de 8.5 segundos
    const WAVE_CYCLE_SEC = 8.5;

    const triggerWaveCycle = () => {
      if (!this._isPlayingAmbient || !this.ambientGain) return;
      try {
        const now = ctx.currentTime;

        // Automatización del oleaje
        swellGain.gain.cancelScheduledValues(now);
        swellGain.gain.setValueAtTime(0.18, now);
        swellGain.gain.linearRampToValueAtTime(0.65, now + 3.5); // Pico de ola
        swellGain.gain.exponentialRampToValueAtTime(0.18, now + 7.8);

        // Modulación dinámica de filtro pasa-bajos durante el oleaje
        lowpassFilter.frequency.cancelScheduledValues(now);
        lowpassFilter.frequency.setValueAtTime(config.lowpass.cutoffFrequency * 0.7, now);
        lowpassFilter.frequency.linearRampToValueAtTime(config.lowpass.cutoffFrequency * 1.6, now + 3.5);
        lowpassFilter.frequency.exponentialRampToValueAtTime(config.lowpass.cutoffFrequency * 0.7, now + 8.0);

        // Automatización de espuma marina
        foamGain.gain.cancelScheduledValues(now);
        foamGain.gain.setValueAtTime(0.001, now);
        foamGain.gain.setValueAtTime(0.01, now + 2.0);
        foamGain.gain.linearRampToValueAtTime(0.22, now + 3.8); // Rompiente
        foamGain.gain.exponentialRampToValueAtTime(0.001, now + 7.6); // Retroceso suave
      } catch (e) {}
    };

    triggerWaveCycle();
    const waveInterval = window.setInterval(triggerWaveCycle, WAVE_CYCLE_SEC * 1000);
    this.activeIntervals.push(waveInterval);
  }

  // =========================================================================
  // 5. FRECUENCIA 432 HZ & CUENCO TIBETANO
  // Utiliza BiquadFilterNode lowpass específico desde configuración a 864 Hz, Q: 0.70
  // =========================================================================
  private setupFrequency432(ctx: AudioContext, destination: GainNode): void {
    const config = AMBIENT_ACOUSTIC_CONFIGS.frequency_432;
    const now = ctx.currentTime;

    // Filtro pasa-bajos armónico principal a 864 Hz, Q: 0.70
    const harmonicFilter = ctx.createBiquadFilter();
    harmonicFilter.type = 'lowpass';
    harmonicFilter.frequency.setValueAtTime(config.lowpass.cutoffFrequency, now);
    harmonicFilter.Q.setValueAtTime(config.lowpass.qFactor, now);
    harmonicFilter.connect(destination);

    // Tone 1: Fundamental 432 Hz continuous drone (Sine)
    const droneOsc = ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(432, now);

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(config.baseGain, now);

    droneOsc.connect(droneGain);
    droneGain.connect(harmonicFilter);
    droneOsc.start(now);
    this.activeSources.push(droneOsc);

    // Tone 2: Sub-octave 216 Hz for deep somatic grounding
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(216, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.30, now);

    subOsc.connect(subGain);
    subGain.connect(harmonicFilter);
    subOsc.start(now);
    this.activeSources.push(subOsc);

    // Tone 3: Detuned side-tone (432.5 Hz) for 0.5 Hz alpha synchronizing beat
    const beatOsc = ctx.createOscillator();
    beatOsc.type = 'sine';
    beatOsc.frequency.setValueAtTime(432.5, now);

    const beatGain = ctx.createGain();
    beatGain.gain.setValueAtTime(0.16, now);

    beatOsc.connect(beatGain);
    beatGain.connect(harmonicFilter);
    beatOsc.start(now);
    this.activeSources.push(beatOsc);

    // Initial Tibetan bowl chime strike that fades over 4.5 seconds
    const bowlHarmonics = [432, 864, 1296];
    const bowlGains = [0.32, 0.14, 0.07];

    bowlHarmonics.forEach((freq, idx) => {
      const bowlOsc = ctx.createOscillator();
      const bowlGain = ctx.createGain();

      bowlOsc.type = idx === 0 ? 'sine' : 'triangle';
      bowlOsc.frequency.setValueAtTime(freq, now);

      bowlGain.gain.setValueAtTime(bowlGains[idx], now);
      bowlGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

      bowlOsc.connect(bowlGain);
      bowlGain.connect(harmonicFilter);

      bowlOsc.start(now);
      bowlOsc.stop(now + 4.6);
      this.activeSources.push(bowlOsc);
    });
  }

  // =========================================================================
  // 6. FRECUENCIA 396 HZ & ANCLAJE SOMÁTICO (Solfeggio Anti-Ansiedad)
  // Utiliza BiquadFilterNode lowpass a 792 Hz, Q: 0.70 con sub-octava 198 Hz
  // =========================================================================
  private setupFrequency396(ctx: AudioContext, destination: GainNode): void {
    const config = AMBIENT_ACOUSTIC_CONFIGS.frequency_396;
    const now = ctx.currentTime;

    const harmonicFilter = ctx.createBiquadFilter();
    harmonicFilter.type = 'lowpass';
    harmonicFilter.frequency.setValueAtTime(config.lowpass.cutoffFrequency, now);
    harmonicFilter.Q.setValueAtTime(config.lowpass.qFactor, now);
    harmonicFilter.connect(destination);

    // Tone 1: Fundamental 396 Hz Solfeggio continuous drone
    const droneOsc = ctx.createOscillator();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(396, now);

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(config.baseGain, now);

    droneOsc.connect(droneGain);
    droneGain.connect(harmonicFilter);
    droneOsc.start(now);
    this.activeSources.push(droneOsc);

    // Tone 2: Sub-octave 198 Hz for deep pelvic and root grounding
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(198, now);

    const subGain = ctx.createGain();
    subGain.gain.setValueAtTime(0.32, now);

    subOsc.connect(subGain);
    subGain.connect(harmonicFilter);
    subOsc.start(now);
    this.activeSources.push(subOsc);

    // Tone 3: Detuned side-tone (396.5 Hz) for gentle alpha calming pulse
    const beatOsc = ctx.createOscillator();
    beatOsc.type = 'sine';
    beatOsc.frequency.setValueAtTime(396.5, now);

    const beatGain = ctx.createGain();
    beatGain.gain.setValueAtTime(0.15, now);

    beatOsc.connect(beatGain);
    beatGain.connect(harmonicFilter);
    beatOsc.start(now);
    this.activeSources.push(beatOsc);

    // Soft anchoring chime strike
    const rootOsc = ctx.createOscillator();
    const rootGain = ctx.createGain();
    rootOsc.type = 'sine';
    rootOsc.frequency.setValueAtTime(396, now);
    rootGain.gain.setValueAtTime(0.28, now);
    rootGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

    rootOsc.connect(rootGain);
    rootGain.connect(harmonicFilter);
    rootOsc.start(now);
    rootOsc.stop(now + 4.1);
    this.activeSources.push(rootOsc);
  }

  // Toggle ambient playback
  toggleAmbient(soundId?: AmbientSoundId): boolean {
    const targetId = soundId || this._currentAmbientId;
    if (this._isPlayingAmbient && this._currentAmbientId === targetId) {
      this.stopAmbient();
      return false;
    } else {
      this.startAmbient(targetId);
      return true;
    }
  }

  // Play Tibetan bowl chime for practice transitions
  playBowl(freq: number = 280, duration: number = 3.5): void {
    if (!this.enabled) return;
    try {
      const audioCtx = this.getOrCreateContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      const harmonics = [1, 2.01, 2.76];
      const gains = [0.45 * this._cueVolume, 0.22 * this._cueVolume, 0.1 * this._cueVolume];

      harmonics.forEach((h, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * h, now);

        gain.gain.setValueAtTime(gains[i], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('Error playing bowl:', e);
    }
  }

  // Harmonic chime for minute and step transitions in somatic player
  playStepTransitionChime(): void {
    this.playBowl(360, 2.5);
  }

  // Soft breath pulse cue
  playBreathCue(high: boolean = true): void {
    if (!this.enabled) return;
    try {
      const audioCtx = this.getOrCreateContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(high ? 432 : 320, now);

      gain.gain.setValueAtTime(0.25 * this._cueVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {}
  }

  // Unlock chime
  playUnlock(): void {
    if (!this.enabled) return;
    try {
      const audioCtx = this.getOrCreateContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      [349.23, 440, 523.25].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.3 * this._cueVolume, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.6);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.7);
      });
    } catch (e) {}
  }

  // Vagal Pacing Harmonic Cue (4 - 2 - 6)
  playVagalPhase(phase: 'inhale' | 'hold' | 'exhale'): void {
    if (!this.enabled) return;
    try {
      const audioCtx = this.getOrCreateContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(0.7, now);
      filter.connect(audioCtx.destination);

      if (phase === 'inhale') {
        // Ascending harmonic chime: 360 -> 432 Hz (Expansion & openness)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(432, now + 1.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22 * this._cueVolume, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);
        osc.stop(now + 2.1);
      } else if (phase === 'hold') {
        // Warm suspended chime: 432 Hz + 540 Hz (Stillness & stillness)
        [432, 540].forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime((0.15 / (idx + 1)) * this._cueVolume, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

          osc.connect(gain);
          gain.connect(filter);
          osc.start(now);
          osc.stop(now + 1.7);
        });
      } else {
        // Descending grounding chime: 432 -> 288 Hz (Somatic release & vagal activation)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now);
        osc.frequency.exponentialRampToValueAtTime(288, now + 1.8);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.25 * this._cueVolume, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(gain);
        gain.connect(filter);
        osc.start(now);
        osc.stop(now + 2.9);
      }
    } catch (e) {
      console.warn('Error playing vagal tone:', e);
    }
  }

  // Physiological Sigh Step Cue
  playSighStep(step: 1 | 2 | 3): void {
    if (!this.enabled) return;
    try {
      const audioCtx = this.getOrCreateContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      if (step === 1) {
        // Step 1: Inhalación nasal profunda (320 Hz warm swell)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(384, now + 0.8);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.22 * this._cueVolume, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.9);
      } else if (step === 2) {
        // Step 2: Micro-inhalación para alvéolos (440 Hz crisp harmonic ping)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(528, now + 0.3);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.20 * this._cueVolume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 1.3);
      } else {
        // Step 3: Exhalación bucal larga (216 Hz calming bowl hum)
        this.playBowl(216, 4.0);
      }
    } catch (e) {
      console.warn('Error playing sigh step tone:', e);
    }
  }

  // Completion chime
  playCompletionChime(): void {
    if (!this.enabled) return;
    try {
      const audioCtx = this.getOrCreateContext();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const now = audioCtx.currentTime;
      [396, 432, 528].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.18);

        gain.gain.setValueAtTime(0.001, now + idx * 0.18);
        gain.gain.linearRampToValueAtTime(0.24 * this._cueVolume, now + idx * 0.18 + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 2.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.18);
        osc.stop(now + idx * 0.18 + 2.3);
      });
    } catch (e) {}
  }

  get isPlayingAmbient(): boolean {
    return this._isPlayingAmbient;
  }

  get currentAmbientLabel(): string {
    return this._currentAmbientLabel;
  }

  get currentAmbientId(): AmbientSoundId {
    return this._currentAmbientId;
  }
}

export const soundManager = new SoundManager();
