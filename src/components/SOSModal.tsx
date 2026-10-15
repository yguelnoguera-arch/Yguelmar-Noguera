import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Volume1,
  VolumeX,
  Wind,
  Zap,
  CheckCircle2,
  Mic,
  MicOff,
  CloudRain,
  Droplets,
  Trees,
  Waves,
  Radio,
  ChevronDown
} from 'lucide-react';
import { soundManager, AmbientSoundId, AMBIENT_SOUND_OPTIONS } from '../utils/sound';
import { voiceGuide } from '../utils/voiceGuide';

export type SOSMode = 'calma' | 'energia';

interface SOSModalProps {
  isOpen: boolean;
  initialMode: SOSMode;
  onClose: () => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({ isOpen, initialMode, onClose }) => {
  const [mode, setMode] = useState<SOSMode>(initialMode);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(voiceGuide.enabled);
  const [voiceVolume, setVoiceVolume] = useState<number>(0.65);

  // Global ambient selection & volume
  const [selectedAmbientId, setSelectedAmbientId] = useState<AmbientSoundId>(() =>
    soundManager.getPreferredAmbient()
  );
  const [ambientVolume, setAmbientVolume] = useState<number>(() => soundManager.ambientVolume);
  const [isAmbientMenuOpen, setIsAmbientMenuOpen] = useState<boolean>(false);

  // Breath rhythm within 60s:
  // Calma: Inhale 4s, Exhale 6s (10s per cycle -> 6 cycles)
  // Energía: Inhale 2s, Exhale 2s (4s per cycle -> 15 cycles)
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [phaseSeconds, setPhaseSeconds] = useState<number>(initialMode === 'calma' ? 4 : 2);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean stop helper for all audio
  const stopAllAudio = () => {
    voiceGuide.stop();
    soundManager.stopAmbient();
  };

  // Sync mode and audio when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      soundManager.resumeContext();
      setMode(initialMode);
      setSecondsRemaining(60);
      setIsRunning(true);
      setIsCompleted(false);
      setBreathPhase('inhale');
      setPhaseSeconds(initialMode === 'calma' ? 4 : 2);
      soundManager.playBreathCue(true);

      const preferred = soundManager.getPreferredAmbient();
      setSelectedAmbientId(preferred);
      setAmbientVolume(soundManager.ambientVolume);
      setIsAmbientMenuOpen(false);

      // Start preferred ambient sound
      if (preferred !== 'silence') {
        soundManager.startAmbient(preferred);
      }

      // Configure calm, comfortable voice volume (0.65) so it's not blasting
      voiceGuide.setVolume(voiceVolume);

      // Play SOS masculine Fenrir audio guidance if enabled
      if (voiceGuide.enabled) {
        voiceGuide.playSOS(initialMode);
      }
    } else {
      setIsRunning(false);
      stopAllAudio();
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      stopAllAudio();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, initialMode]);

  // Main 60-second countdown and breath phase loop
  useEffect(() => {
    if (!isOpen || !isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      // Countdown total seconds
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsCompleted(true);
          soundManager.playBowl(300, 4);
          stopAllAudio();
          return 0;
        }
        return prev - 1;
      });

      // Manage breath rhythm
      setPhaseSeconds((prevPhaseSec) => {
        if (prevPhaseSec <= 1) {
          if (breathPhase === 'inhale') {
            setBreathPhase('exhale');
            if (soundEnabled) soundManager.playBreathCue(false);
            return mode === 'calma' ? 6 : 2;
          } else {
            setBreathPhase('inhale');
            if (soundEnabled) soundManager.playBreathCue(true);
            return mode === 'calma' ? 4 : 2;
          }
        }
        return prevPhaseSec - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isRunning, breathPhase, mode, soundEnabled]);

  if (!isOpen) return null;

  const handleClose = () => {
    setIsRunning(false);
    stopAllAudio();
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const handleSwitchMode = (newMode: SOSMode) => {
    soundManager.resumeContext();
    voiceGuide.stop();
    setMode(newMode);
    setSecondsRemaining(60);
    setIsRunning(true);
    setIsCompleted(false);
    setBreathPhase('inhale');
    setPhaseSeconds(newMode === 'calma' ? 4 : 2);
    soundManager.playBreathCue(true);

    if (voiceEnabled) {
      voiceGuide.playSOS(newMode);
    }
  };

  const handleReset = () => {
    soundManager.resumeContext();
    stopAllAudio();
    setSecondsRemaining(60);
    setIsRunning(false);
    setIsCompleted(false);
    setBreathPhase('inhale');
    setPhaseSeconds(mode === 'calma' ? 4 : 2);
  };

  // Toggle play and pause with immediate audio control
  const handleTogglePlayPause = () => {
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);

    if (!nextRunning) {
      // User paused: immediately silence voice and background sound
      stopAllAudio();
    } else {
      // User resumed: resume audio context and restart ambient & voice guidance
      soundManager.resumeContext();
      if (selectedAmbientId !== 'silence') {
        soundManager.startAmbient(selectedAmbientId);
      }
      if (voiceEnabled) {
        voiceGuide.playSOS(mode);
      }
    }
  };

  const handleToggleVoice = () => {
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    voiceGuide.setEnabled(nextVal);
    if (!nextVal) {
      voiceGuide.stop();
    } else {
      voiceGuide.playSOS(mode);
    }
  };

  const handleVoiceVolumeChange = (newVal: number) => {
    setVoiceVolume(newVal);
    voiceGuide.setVolume(newVal);
  };

  const handleSwitchAmbient = (id: AmbientSoundId) => {
    setSelectedAmbientId(id);
    soundManager.setPreferredAmbient(id);
    setIsAmbientMenuOpen(false);
    soundManager.startAmbient(id);
  };

  const handleAmbientVolumeChange = (newVal: number) => {
    setAmbientVolume(newVal);
    soundManager.setAmbientVolume(newVal);
  };

  const getAmbientIcon = (id: AmbientSoundId) => {
    switch (id) {
      case 'rain_forest':
        return <CloudRain className="w-3.5 h-3.5" />;
      case 'gentle_rain':
        return <Droplets className="w-3.5 h-3.5" />;
      case 'forest_breeze':
        return <Trees className="w-3.5 h-3.5" />;
      case 'ocean_waves':
        return <Waves className="w-3.5 h-3.5" />;
      case 'silence':
        return <VolumeX className="w-3.5 h-3.5" />;
      default:
        return <Radio className="w-3.5 h-3.5" />;
    }
  };

  const currentAmbientOption =
    AMBIENT_SOUND_OPTIONS.find((opt) => opt.id === selectedAmbientId) || AMBIENT_SOUND_OPTIONS[0];

  const isCalma = mode === 'calma';
  const isExpanding = breathPhase === 'inhale';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#232720]/75 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#FAF8F4] border border-[#E4DEC3] rounded-[36px] shadow-2xl p-6 flex flex-col justify-between text-[#2C2F28] relative">
        {/* Top bar with mode selector */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE6D8]">
          <div className="flex items-center gap-1.5 p-1 bg-[#ECE5D8] rounded-2xl">
            <button
              onClick={() => handleSwitchMode('calma')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isCalma
                  ? 'bg-[#556341] text-[#FDFCF9] shadow-xs'
                  : 'text-[#6C7063] hover:text-[#2C2F28]'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>SOS Calma (60s)</span>
            </button>
            <button
              onClick={() => handleSwitchMode('energia')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                !isCalma
                  ? 'bg-[#B07234] text-[#FDFCF9] shadow-xs'
                  : 'text-[#6C7063] hover:text-[#2C2F28]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SOS Energía (60s)</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleVoice}
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                voiceEnabled ? 'bg-[#556341] text-white' : 'bg-[#EFE9DD] text-stone-500'
              }`}
              title={voiceEnabled ? 'Voz guiada activada (click para silenciar)' : 'Voz guiada desactivada'}
            >
              {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <div
              className="h-8 px-2 rounded-xl text-[10px] font-semibold flex items-center gap-1 bg-[#EFE9DD] text-[#434A38]"
              title="Voz Masculina Natural de Estudio (Fenrir)"
            >
              <span>🎙️ Fenrir</span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-xl bg-[#EFE9DD] hover:bg-[#E0D9CB] text-[#556341] flex items-center justify-center transition-colors cursor-pointer"
              title="Cerrar SOS y detener audio"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient Selector and Volume Bar for SOS */}
        <div className="relative mt-3">
          <button
            type="button"
            onClick={() => setIsAmbientMenuOpen(!isAmbientMenuOpen)}
            className="w-full py-1.5 px-3 rounded-2xl bg-[#EFE9DD]/90 hover:bg-[#E5DEC9] border border-[#DDD5C0] text-xs font-medium text-[#4D5638] flex items-center justify-between transition-all cursor-pointer shadow-2xs"
            title="Cambiar paisaje sonoro ambiental en tiempo real"
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-[#6B7A54]">{getAmbientIcon(selectedAmbientId)}</span>
              <span className="truncate">Ambiente: <strong>{currentAmbientOption.title}</strong></span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#7A7E72] shrink-0">
              <span>Cambiar</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAmbientMenuOpen ? 'rotate-180' : ''}`} />
            </div>
          </button>

          {/* Ambient options menu */}
          {isAmbientMenuOpen && (
            <div className="absolute top-10 left-0 right-0 z-30 bg-[#FAF8F4] border border-[#DDD5C0] rounded-2xl shadow-xl p-1.5 space-y-1 animate-fadeIn">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7A7E72] border-b border-[#EAE3D3]">
                Elige el fondo sonoro (Web Audio)
              </div>
              {AMBIENT_SOUND_OPTIONS.map((opt) => {
                const isSelected = opt.id === selectedAmbientId;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSwitchAmbient(opt.id)}
                    className={`w-full p-2 rounded-xl text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#EAE3D3] text-[#2C2F28] font-medium'
                        : 'hover:bg-[#EFE9DD] text-[#556341]'
                    }`}
                  >
                    <span className="mt-0.5 text-[#6B7A54]">{getAmbientIcon(opt.id)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="truncate">{opt.title}</span>
                        <span className="text-[10px] text-[#7A7E72] bg-[#DFD7C4] px-1.5 py-0.2 rounded-full shrink-0">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#7A7E72] truncate">{opt.soundSignature}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Dual Volume sliders: Ambient & Voice */}
          <div className="space-y-1 mt-1.5">
            {selectedAmbientId !== 'silence' && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-[#FAF7F0] border border-[#E8E1D0] rounded-xl text-[11px] text-[#6B7062]">
                <Volume1 className="w-3.5 h-3.5 text-[#6B7A54] shrink-0" />
                <span className="shrink-0 text-[10px] font-semibold text-[#556341]">Ambiente:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={ambientVolume}
                  onChange={(e) => handleAmbientVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#556341] h-1.5 bg-[#E2DAC8] rounded-lg cursor-pointer"
                  title={`Volumen del paisaje ambiental: ${Math.round(ambientVolume * 100)}%`}
                />
                <span className="w-8 text-right text-[10px] font-mono font-medium text-[#556341]">
                  {Math.round(ambientVolume * 100)}%
                </span>
              </div>
            )}

            {voiceEnabled && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-[#FAF7F0] border border-[#E8E1D0] rounded-xl text-[11px] text-[#6B7062]">
                <Mic className="w-3.5 h-3.5 text-[#556341] shrink-0" />
                <span className="shrink-0 text-[10px] font-semibold text-[#556341]">Voz Fenrir:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => handleVoiceVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-[#556341] h-1.5 bg-[#E2DAC8] rounded-lg cursor-pointer"
                  title={`Volumen de la voz guiada: ${Math.round(voiceVolume * 100)}%`}
                />
                <span className="w-8 text-right text-[10px] font-mono font-medium text-[#556341]">
                  {Math.round(voiceVolume * 100)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Central Stage */}
        <div className="my-3 flex flex-col items-center justify-center py-2">
          {/* Header text */}
          <div className="text-center mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-[#6B7A54]">
              {isCalma ? 'Ansiedad y Sobrecarga' : 'Agotamiento y Bloqueo Mental'}
            </span>
            <h2 className="text-xl font-serif font-medium text-[#232720]">
              {isCalma ? 'Respiración Lenta & Soltar Hombros' : 'Respiración Activa & Estiramiento'}
            </h2>
          </div>

          {/* Interactive Breathing & Stretching Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center my-1">
            {/* Ambient pulse halo */}
            <div
              className={`absolute inset-0 rounded-full transition-transform ease-in-out ${
                isCalma ? 'bg-[#E8E2D2]/80' : 'bg-[#F2DFCE]/80'
              } ${isExpanding && isRunning ? 'scale-115 opacity-80' : 'scale-90 opacity-40'} ${
                isCalma ? 'duration-[4000ms]' : 'duration-[2000ms]'
              }`}
            />
            <div
              className={`absolute inset-4 rounded-full border transition-transform ease-in-out ${
                isCalma ? 'border-[#8A9A70]/40' : 'border-[#B07234]/40'
              } ${isExpanding && isRunning ? 'scale-110' : 'scale-85'} ${
                isCalma ? 'duration-[4000ms]' : 'duration-[2000ms]'
              }`}
            />

            {/* Core Animated Circle */}
            <div
              className={`relative w-36 h-36 rounded-full shadow-lg flex flex-col items-center justify-center text-[#FDFCF9] select-none transition-transform ease-in-out ${
                isCalma
                  ? 'bg-gradient-to-br from-[#8A9A70] to-[#556341] shadow-[#6B7A54]/25'
                  : 'bg-gradient-to-br from-[#D48B47] to-[#99551D] shadow-[#B07234]/25'
              } ${isExpanding && isRunning ? 'scale-115' : 'scale-90'} ${
                isCalma ? 'duration-[4000ms]' : 'duration-[2000ms]'
              }`}
            >
              <span className="text-xs font-semibold tracking-wider uppercase opacity-90 mb-1">
                {!isRunning ? 'En Pausa' : isExpanding ? 'Inhala' : 'Exhala'}
              </span>
              <span className="text-3xl font-light font-serif tracking-tight">{phaseSeconds}s</span>
              <span className="text-[10px] opacity-80 mt-1">
                {!isRunning
                  ? 'Toca continuar'
                  : isCalma
                  ? isExpanding
                    ? 'Por la nariz'
                    : 'Lento y suave'
                  : isExpanding
                  ? 'Abriendo el pecho'
                  : 'Suelto y libero'}
              </span>
            </div>
          </div>

          {/* Time Remaining Bar */}
          <div className="w-full max-w-xs mt-2">
            <div className="flex justify-between items-center text-xs text-[#6B7062] mb-1 font-medium">
              <span>Tiempo restante</span>
              <span className="font-mono text-[#232720] font-semibold">{secondsRemaining}s</span>
            </div>
            <div className="w-full h-2 bg-[#EAE4D5] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 rounded-full ${
                  isCalma ? 'bg-[#556341]' : 'bg-[#B07234]'
                }`}
                style={{ width: `${(secondsRemaining / 60) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Footer Guidance Note */}
        <div className="bg-[#EFE9DD]/80 rounded-2xl p-2.5 border border-[#E4DEC3] text-center mb-3">
          <p className="text-xs text-[#434A38] leading-snug">
            {isCalma
              ? '🌿 Nota cómo al alargar la exhalación, el nervio vago frena tus pulsaciones de inmediato.'
              : '⚡ Inhala amplio para oxigenar tu corteza prefrontal y activar tu claridad cognitiva.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-medium text-[#6B7062] hover:text-[#232720] px-3 py-2 rounded-xl hover:bg-[#EFE9DD] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reiniciar 60s</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePlayPause}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-semibold text-[#FDFCF9] shadow-sm transition-all cursor-pointer active:scale-95 ${
                isCalma
                  ? 'bg-[#556341] hover:bg-[#485437]'
                  : 'bg-[#B07234] hover:bg-[#975E26]'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>Continuar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
