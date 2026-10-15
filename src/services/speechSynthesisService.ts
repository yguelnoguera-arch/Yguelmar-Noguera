/**
 * Servicio de Síntesis de Voz Gemini TTS (Fenrir)
 * EXCLUSIVAMENTE impulsado por Gemini TTS con la voz masculina 'Fenrir' de estudio.
 * Totalmente erradicado window.speechSynthesis y voces sintéticas femeninas.
 *
 * Características:
 * - Voz: 'Fenrir' (barítono profundo, cálido, pausado y envolvente)
 * - Caché en memoria y disco para reproducción inmediata (0ms de latencia en repeticiones)
 * - Ducking automático del fondo ambiental
 */

import { soundManager } from '../utils/sound';

export type VoiceGender = 'male';

export interface MeditationVoiceProfile {
  gender: VoiceGender;
  displayName: string;
  description: string;
  voiceName: string;
  volume: number;
  rate: number;
}

export interface SpeakOptions {
  customRate?: number;
  customPitch?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
  onBoundary?: (charIndex: number) => void;
}

export const MEDITATION_VOICE_PROFILES: Record<VoiceGender, MeditationVoiceProfile> = {
  male: {
    gender: 'male',
    displayName: 'Voz Masculina Natural Gemini (Fenrir)',
    description: 'Tono barítono profundo, pausado y cálido pre-renderizado con Gemini TTS',
    voiceName: 'Fenrir',
    volume: 0.95,
    rate: 0.74
  }
};

class GeminiTTSService {
  private _isSpeaking: boolean = false;
  private _currentAudio: HTMLAudioElement | null = null;
  private _audioCache: Map<string, string> = new Map();
  private _preloadedAudio: Map<string, HTMLAudioElement> = new Map();
  private _volume: number = 0.70;

  constructor() {
    // Warm up common audio cache from known static files
    if (typeof window !== 'undefined') {
      this._audioCache.set('calma', '/audio/voice/sos-calma.wav');
      this._audioCache.set('energia', '/audio/voice/sos-energia.wav');
      this._audioCache.set('week-1-min-1', '/audio/voice/week-1-min-1.wav');
      this._audioCache.set('week-1-min-2', '/audio/voice/week-1-min-2.wav');
      this._audioCache.set('week-1-min-3', '/audio/voice/week-1-min-3.wav');
    }
  }

  public get isSpeaking(): boolean {
    return this._isSpeaking;
  }

  public get activeGender(): VoiceGender {
    return 'male';
  }

  public setGender(_gender: VoiceGender): void {
    // Strictly locked to masculine Fenrir
  }

  public getProfile(_gender?: VoiceGender): MeditationVoiceProfile {
    return MEDITATION_VOICE_PROFILES.male;
  }

  public getResolvedVoiceName(): string {
    return 'Voz Masculina Natural Gemini (Fenrir)';
  }

  public testVoice(onComplete?: () => void): void {
    this.speak('Estás en tu propio centro... inhala profundo... y exhala en calma...', {
      onEnd: onComplete,
      onError: onComplete
    });
  }

  /**
   * Preload an audio track by text so it is ready for instant playback
   */
  public async preload(text: string): Promise<string | null> {
    const key = text.trim();
    if (this._audioCache.has(key)) {
      return this._audioCache.get(key)!;
    }

    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: key, voice: 'Fenrir' })
      });

      if (!response.ok) return null;
      const data = await response.json();
      if (data?.audioUrl) {
        this._audioCache.set(key, data.audioUrl);
        // Pre-create Audio element in background to decode metadata
        const audio = new Audio(data.audioUrl);
        audio.preload = 'auto';
        this._preloadedAudio.set(key, audio);
        return data.audioUrl;
      }
    } catch (err) {
      console.warn('[Gemini TTS] Preload skipped:', err);
    }
    return null;
  }

  /**
   * Speak a text using Gemini TTS Fenrir voice with Audio Ducking
   */
  public async speak(text: string, options?: SpeakOptions): Promise<void> {
    const cleanText = text.trim();
    if (!cleanText) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    // Stop any existing playback
    this.stop();

    try {
      let audioUrl = this._audioCache.get(cleanText);

      if (!audioUrl) {
        // Fetch audio from Gemini TTS server endpoint
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, voice: 'Fenrir' })
        });

        if (!response.ok) {
          throw new Error(`TTS server returned status ${response.status}`);
        }

        const data = await response.json();
        if (!data?.audioUrl) {
          throw new Error('TTS server did not return audioUrl');
        }

        audioUrl = data.audioUrl;
        this._audioCache.set(cleanText, audioUrl!);
      }

      // Create and configure audio element
      const audio = new Audio(audioUrl);
      audio.volume = this._volume;
      this._currentAudio = audio;
      this._isSpeaking = true;

      // Apply audio ducking: lower ambient sound while Fenrir speaks
      soundManager.duckAmbient(true);

      if (options?.onStart) {
        options.onStart();
      }

      audio.onended = () => {
        this._isSpeaking = false;
        this._currentAudio = null;
        // Unduck ambient sound: restore ambient gain smoothly
        soundManager.duckAmbient(false);
        if (options?.onEnd) options.onEnd();
      };

      audio.onerror = (e) => {
        console.error('[Gemini TTS] Audio playback error:', e);
        this._isSpeaking = false;
        this._currentAudio = null;
        soundManager.duckAmbient(false);
        if (options?.onError) options.onError(e);
        if (options?.onEnd) options.onEnd();
      };

      await audio.play();
    } catch (err) {
      console.error('[Gemini TTS] Speak error:', err);
      this._isSpeaking = false;
      this._currentAudio = null;
      soundManager.duckAmbient(false);
      if (options?.onError) options.onError(err);
      if (options?.onEnd) options.onEnd();
    }
  }

  /**
   * Stop active speech and restore ambient volume
   */
  public stop(): void {
    if (this._currentAudio) {
      try {
        this._currentAudio.pause();
        this._currentAudio.currentTime = 0;
        this._currentAudio.onended = null;
        this._currentAudio.onerror = null;
        this._currentAudio.src = '';
        this._currentAudio.load();
      } catch {}
      this._currentAudio = null;
    }
    this._isSpeaking = false;
    soundManager.duckAmbient(false);
  }

  public setVolume(vol: number): void {
    this._volume = Math.max(0, Math.min(1, vol));
    if (this._currentAudio) {
      this._currentAudio.volume = this._volume;
    }
  }
}

export const speechSynthesisService = new GeminiTTSService();
