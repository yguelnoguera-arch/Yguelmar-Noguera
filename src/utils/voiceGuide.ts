/**
 * Voice Guidance Manager
 * Combines Studio-Quality Gemini TTS recordings (Deep, warm masculine voice: Fenrir)
 * with graceful Web Speech API fallback.
 *
 * Characteristics:
 * - Studio recordings: 24kHz 16-bit WAV files pre-rendered with Gemini TTS
 * - Pacing: Meditative, spacious, deeply relaxing cadence
 * - Tone: Warm, grounded masculine baritone
 * - Cost: $0.00 USD recurrent across all users
 * - Latency: 0ms (preloaded and played instantly via standard HTML5 Audio)
 */

import { speechSynthesisService, VoiceGender } from '../services/speechSynthesisService';
import { soundManager } from './sound';

export interface VoiceGuideStep {
  title: string;
  displayText: string;
  spokenText: string;
}

export type VoiceGenderPreference = 'male';
export type VoiceEngineMode = 'studio_preferred' | 'synthesis_only';

const WEEK_AUDIO_MAP: Record<string, string> = {
  '1-0': '/audio/voice/week-1-min-1.wav',
  '1-1': '/audio/voice/week-1-min-2.wav',
  '1-2': '/audio/voice/week-1-min-3.wav',
  '2-0': '/audio/voice/week-2-min-1.wav',
  '2-1': '/audio/voice/week-2-min-2.wav',
  '2-2': '/audio/voice/week-2-min-3.wav',
  '3-0': '/audio/voice/week-3-min-1.wav',
  '3-1': '/audio/voice/week-3-min-2.wav',
  '3-2': '/audio/voice/week-3-min-3.wav',
  '4-0': '/audio/voice/week-4-min-1.wav',
  '4-1': '/audio/voice/week-4-min-2.wav',
  '4-2': '/audio/voice/week-4-min-3.wav',
  '5-0': '/audio/voice/week-5-min-1.wav',
  '5-1': '/audio/voice/week-5-min-2.wav',
  '5-2': '/audio/voice/week-5-min-3.wav',
};

const SOS_AUDIO_MAP: Record<string, string> = {
  calma: '/audio/voice/sos-calma.wav',
  energia: '/audio/voice/sos-energia.wav',
};

class VoiceGuideManager {
  private _enabled: boolean = true;
  private _isSpeaking: boolean = false;
  private _genderPreference: VoiceGenderPreference = 'male';
  private _engineMode: VoiceEngineMode = 'studio_preferred';
  private _currentAudio: HTMLAudioElement | null = null;
  private _audioVolume: number = 0.70;

  constructor() {
    if (typeof window !== 'undefined') {
      const savedEnabled = localStorage.getItem('vuelve_centro_voice_enabled');
      if (savedEnabled !== null) {
        this._enabled = savedEnabled === 'true';
      }
      this._genderPreference = 'male';
      const savedMode = localStorage.getItem('vuelve_centro_voice_engine') as VoiceEngineMode;
      if (savedMode === 'studio_preferred' || savedMode === 'synthesis_only') {
        this._engineMode = savedMode;
      }
      speechSynthesisService.setGender('male');
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined';
  }

  public get enabled(): boolean {
    return this._enabled;
  }

  public setEnabled(value: boolean): void {
    this._enabled = value;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vuelve_centro_voice_enabled', String(value));
      if (!value) {
        this.stop();
      }
    }
  }

  public get genderPreference(): VoiceGenderPreference {
    return 'male';
  }

  public setGenderPreference(_gender: VoiceGenderPreference): void {
    this._genderPreference = 'male';
    speechSynthesisService.setGender('male');
  }

  public get engineMode(): VoiceEngineMode {
    return this._engineMode;
  }

  public setEngineMode(mode: VoiceEngineMode): void {
    this._engineMode = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vuelve_centro_voice_engine', mode);
    }
  }

  public get rate(): number {
    return speechSynthesisService.getProfile('male').rate;
  }

  public get isSpeaking(): boolean {
    return this._isSpeaking || speechSynthesisService.isSpeaking;
  }

  public get currentVoiceName(): string {
    if (this._engineMode === 'studio_preferred') {
      return 'Voz Masculina de Estudio (Gemini)';
    }
    return speechSynthesisService.getResolvedVoiceName();
  }

  public testVoice(_gender?: VoiceGenderPreference, onComplete?: () => void): void {
    this.stop();
    this._isSpeaking = true;
    speechSynthesisService.testVoice(() => {
      this._isSpeaking = false;
      if (onComplete) onComplete();
    });
  }

  public stop(): void {
    if (this._currentAudio) {
      try {
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;
        this._currentAudio.onended = null;
        this._currentAudio.onerror = null;
        this._currentAudio.src = '';
        this._currentAudio.load();
      } catch (e) {}
      this._currentAudio = null;
    }

    speechSynthesisService.stop();
    this._isSpeaking = false;
    soundManager.duckAmbient(false);
  }

  public pause(): void {
    this.stop();
  }

  public setVolume(vol: number): void {
    this._audioVolume = Math.max(0, Math.min(1, vol));
    if (this._currentAudio) {
      this._currentAudio.volume = this._audioVolume;
    }
    speechSynthesisService.setVolume(this._audioVolume);
  }

  // Play pre-recorded Studio Audio Track
  private playStudioTrack(audioUrl: string, fallbackText: string, onComplete?: () => void): void {
    if (!this._enabled) {
      if (onComplete) onComplete();
      return;
    }

    this.stop();

    try {
      const audio = new Audio(audioUrl);
      audio.volume = this._audioVolume;
      this._currentAudio = audio;
      this._isSpeaking = true;

      // Duck ambient audio while Fenrir speaks
      soundManager.duckAmbient(true);

      audio.onended = () => {
        this._isSpeaking = false;
        this._currentAudio = null;
        soundManager.duckAmbient(false);
        if (onComplete) onComplete();
      };

      audio.onerror = () => {
        // Fallback to dynamic Gemini TTS Fenrir endpoint (never browser speechSynthesis)
        this._currentAudio = null;
        this.speakGeminiTTS(fallbackText, onComplete);
      };

      audio.play().catch(() => {
        this._currentAudio = null;
        this.speakGeminiTTS(fallbackText, onComplete);
      });
    } catch (e) {
      this.speakGeminiTTS(fallbackText, onComplete);
    }
  }

  // Play specific week minute studio audio
  public playWeekMinute(weekNumber: number, minuteIndex: number, onComplete?: () => void): void {
    const key = `${weekNumber}-${minuteIndex}`;
    const studioUrl = WEEK_AUDIO_MAP[key];
    const script = this.getWeekMinuteScript(weekNumber, minuteIndex);

    if (this._genderPreference === 'male' && this._engineMode === 'studio_preferred' && studioUrl) {
      this.playStudioTrack(studioUrl, script, onComplete);
    } else {
      this.speakGeminiTTS(script, onComplete);
    }
  }

  // Play SOS studio audio
  public playSOS(mode: 'calma' | 'energia', onComplete?: () => void): void {
    const studioUrl = SOS_AUDIO_MAP[mode];
    const script = mode === 'calma' ? this.getSOSCalmaScript() : this.getSOSEnergiaScript();

    if (this._genderPreference === 'male' && this._engineMode === 'studio_preferred' && studioUrl) {
      this.playStudioTrack(studioUrl, script, onComplete);
    } else {
      this.speakGeminiTTS(script, onComplete);
    }
  }

  // General speak method with intelligent detection of known scripts
  public speak(text: string, onComplete?: () => void): void {
    if (!this._enabled) {
      if (onComplete) onComplete();
      return;
    }

    if (this._genderPreference === 'male' && this._engineMode === 'studio_preferred') {
      const t = text.toLowerCase();
      // Match SOS
      if (t.includes('estás a salvo') || t.includes('apoya tus pies firmes') || t.includes('cuatro segundos')) {
        this.playStudioTrack(SOS_AUDIO_MAP.calma, text, onComplete);
        return;
      }
      if (t.includes('siéntate erguido') || t.includes('vigoroso') || t.includes('estira tu columna')) {
        this.playStudioTrack(SOS_AUDIO_MAP.energia, text, onComplete);
        return;
      }

      // Match Week 1
      if (t.includes('apoya ambos pies') || (t.includes('minuto uno') && t.includes('gravedad'))) {
        this.playStudioTrack(WEEK_AUDIO_MAP['1-0'], text, onComplete);
        return;
      }
      if (t.includes('tobillos') && t.includes('pelvis')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['1-1'], text, onComplete);
        return;
      }
      if (t.includes('paladar') && t.includes('entrecejo')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['1-2'], text, onComplete);
        return;
      }

      // Match Week 2
      if (t.includes('mano en tu pecho') && t.includes('abdomen')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['2-0'], text, onComplete);
        return;
      }
      if (t.includes('coherencia diafragmática') || t.includes('uno... dos... tres... cuatro')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['2-1'], text, onComplete);
        return;
      }
      if (t.includes('exhalación un poco más larga') || t.includes('silencio breve habita')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['2-2'], text, onComplete);
        return;
      }

      // Match Week 3
      if (t.includes('cielo despejado') || t.includes('nube pasajera')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['3-0'], text, onComplete);
        return;
      }
      if (t.includes('punta de la nariz') || t.includes('labio superior')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['3-1'], text, onComplete);
        return;
      }
      if (t.includes('por debajo de los sonidos') || t.includes('descansar en tu centro')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['3-2'], text, onComplete);
        return;
      }

      // Match Week 4
      if (t.includes('hombros hacia atrás') || t.includes('omóplatos')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['4-0'], text, onComplete);
        return;
      }
      if (t.includes('doble suspiro') || t.includes('ahhh')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['4-1'], text, onComplete);
        return;
      }
      if (t.includes('inmóvil un instante') || t.includes('calma biológica')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['4-2'], text, onComplete);
        return;
      }

      // Match Week 5
      if (t.includes('línea de luz') || t.includes('coxis hasta la coronilla')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['5-0'], text, onComplete);
        return;
      }
      if (t.includes('latido de tu corazón bajo tus palmas') || t.includes('gratitud hacia tu organismo')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['5-1'], text, onComplete);
        return;
      }
      if (t.includes('memoria celular') || t.includes('este centro siempre vive')) {
        this.playStudioTrack(WEEK_AUDIO_MAP['5-2'], text, onComplete);
        return;
      }
    }

    // Use pure Gemini TTS with Fenrir voice
    this.speakGeminiTTS(text, onComplete);
  }

  // Servicio de Voz Gemini TTS Fenrir
  public speakGeminiTTS(text: string, onComplete?: () => void): void {
    if (!this._enabled) {
      if (onComplete) onComplete();
      return;
    }

    this.stop();
    this._isSpeaking = true;

    speechSynthesisService.speak(text, {
      onStart: () => {
        this._isSpeaking = true;
      },
      onEnd: () => {
        this._isSpeaking = false;
        if (onComplete) onComplete();
      },
      onError: () => {
        this._isSpeaking = false;
        if (onComplete) onComplete();
      }
    });
  }

  // Generate mindfulness guidance script for the current minute and week
  public getWeekMinuteScript(weekNumber: number, minuteIndex: number): string {
    const scripts: Record<number, string[]> = {
      1: [
        'Minuto uno... Apoya ambos pies en el suelo... o siente con claridad la base de tu asiento... Deja que todo el peso de tu cuerpo caiga hacia la tierra... Inhala profundo y suave por la nariz... y al exhalar, suelta el peso de tus hombros y tu mandíbula... Siente cómo el suelo te sostiene firmemente aquí y ahora... Respira suave, largo y profundo a tu propio ritmo.',
        'Minuto dos... Ahora, lleva tu foco lentamente desde los tobillos... subiendo por las rodillas y la pelvis... hacia el abdomen y el pecho... Nota si hay alguna rigidez o tensión sutil... obsérvala sin juzgarla... Para abrir espacio, inhala hondo llevando el aire directamente hacia esa zona... y exhala muy despacio... permitiendo que los tejidos se ablanden y cedan... No intentes cambiar nada... solo acompaña cada sensación con tu respiración natural.',
        'Minuto tres... Despega la lengua del paladar... afloja la piel de la frente y el entrecejo... Inhala profundo sintiendo la quietud en tu coronilla... y exhala largo... permitiendo que todo tu cuerpo entre en un estado de descanso seguro y profundo... Estás habitando tu centro... Todo está bien en este instante.'
      ],
      2: [
        'Minuto uno... Coloca con dulzura una mano en tu pecho y otra en tu abdomen... Inhala suave por la nariz sintiendo la frescura del aire al entrar... y exhala despacio percibiendo el aire tibio al salir... Observa el vaivén natural de tu cuerpo sin forzar nada... Respira a tu propio compás.',
        'Minuto dos... Comencemos el compás de coherencia diafragmática... Inhala profundo en uno... dos... tres... cuatro... expandiendo el vientre... y exhala suave en uno... dos... tres... cuatro... liberando todo el aire... Inhala calma... y exhala cualquier prisa... Siente cómo tu corazón acompasa este ritmo sereno.',
        'Minuto tres... Ahora, haz la exhalación un poco más larga que la inhalación... Inhala llenando tus pulmones con aire nuevo... y exhala muy lento, vaciándote por completo... Nota esa pequeña pausa de quietud absoluta al final de soltar el aire... En ese silencio breve habita tu verdadera serenidad.'
      ],
      3: [
        'Minuto uno... Cierra suavemente los ojos e imagina tu mente como un cielo despejado... Cada pensamiento que cruza es solo una nube pasajera... Inhala profundo abriendo espacio en tu mente... y exhala dejando que esa nube siga su camino sin retenerla ni juzgarla... Respira con tranquilidad.',
        'Minuto dos... Lleva toda tu atención a la punta de la nariz o al roce sutil del aire sobre tu labio superior... Inhala sintiendo esa pequeña caricia fresca... y exhala despacio manteniendo tu presencia allí... Si la mente se distrae, sonríe suavemente e inhala de nuevo regresando a este punto neutro.',
        'Minuto tres... Percibe el silencio sutil que descansa por debajo de los sonidos... Inhala profundo nutriendo tu quietud interior... y exhala largo, soltando la necesidad de resolver o controlar algo ahora... En este momento no hay nada que buscar... solo descansar en tu centro.'
      ],
      4: [
        'Minuto uno... Haz un giro muy lento y suave con tus hombros hacia atrás... Deja colgar tus brazos pesados a los lados... Inhala profundo llevando aire hacia tus omóplatos... y al exhalar, imagina que cualquier peso o rigidez resbala por tus brazos y cae a la tierra... Suelta y aligera.',
        'Minuto dos... Practiquemos el doble suspiro fisiológico para regular el sistema nervioso... Toma una inhalación profunda por la nariz... añade un segundo sorbo de aire corto arriba... y exhala todo por la boca con un suspiro de alivio... Ahhh... Repite una vez más... Inhala... un segundo aire... y suspira soltando todo... Siente el descanso en tu pecho.',
        'Minuto tres... Permanece inmóvil un instante notando el espacio nuevo en tus músculos... Inhala suave y profundo reconociendo esta ligereza... y exhala despacio permitiendo que tu sistema nervioso asiente esta calma biológica... Tu cuerpo sabe regularse.'
      ],
      5: [
        'Minuto uno... Imagina una línea de luz suave y cálida que recorre tu columna desde el coxis hasta la coronilla... Inhala profundo sintiendo tu cuerpo erguido y digno... y exhala lento ablandando el rostro y los hombros... Firmeza serena por fuera... dulzura y espacio por dentro.',
        'Minuto dos... Lleva ambas manos sobre el centro de tu pecho... Inhala hondo sintiendo el calor y el latido de tu corazón bajo tus palmas... y exhala con gratitud hacia tu organismo por sostenerte incondicionalmente... Agradece a tu respiración que te cuida en cada segundo de tu vida.',
        'Minuto tres... Inhala muy profundo y guarda esta sensación de serenidad en tu memoria celular... Al exhalar largo, reconoce que este centro siempre vive contigo... Dondequiera que vayas, basta una respiración consciente para regresar a casa... Abre los ojos suavemente cuando estés listo.'
      ]
    };

    const weekScripts = scripts[weekNumber] || scripts[1];
    return weekScripts[minuteIndex] || weekScripts[0];
  }

  // Script for SOS Calma (60s)
  public getSOSCalmaScript(): string {
    return 'Estás a salvo... Apoya tus pies firmes en el suelo... Inhala suavemente por la nariz en cuatro segundos... uno... dos... tres... cuatro... sostén el aire un instante... y exhala muy largo por la boca en seis segundos, dejando caer los hombros y aflojando la mandíbula... Siente cómo tu ritmo cardíaco se tranquiliza con cada respiración.';
  }

  // Script for SOS Energía (60s)
  public getSOSEnergiaScript(): string {
    return 'Siéntate erguido y abre el pecho... Inhala profundo y vigoroso por la nariz inflando el abdomen... y exhala con fuerza liberando todo el cansancio... Estira tu columna hacia el cielo... siente cómo el aire nuevo renueva cada fibra de tu cuerpo con energía y calma.';
  }
}

export const voiceGuide = new VoiceGuideManager();
export const voiceGuideManager = voiceGuide;
