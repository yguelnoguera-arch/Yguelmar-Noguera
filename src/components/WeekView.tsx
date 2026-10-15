import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Music,
  CheckCircle2,
  BookOpen,
  BarChart2,
  Mic,
  MicOff,
  CloudRain,
  Droplets,
  Trees,
  Waves,
  Radio,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { WeekProgram, ReflectionEntry } from '../types';
import {
  soundManager,
  AMBIENT_SOUND_OPTIONS,
  AmbientSoundId
} from '../utils/sound';
import { voiceGuide } from '../utils/voiceGuide';
import { NatureBackground } from './NatureBackground';
import { AmbientSoundSelector } from './AmbientSoundSelector';

interface WeekViewProps {
  week: WeekProgram;
  allWeeks: WeekProgram[];
  onSelectWeek: (weekNumber: number) => void;
  onSaveReflection: (entry: Omit<ReflectionEntry, 'id' | 'createdAt'>) => void;
  existingReflections: ReflectionEntry[];
  onViewHistory: () => void;
  onBackToMenu: () => void;
  onOpenAssessment: () => void;
}

// 5 fast sensation buttons: [Mandíbula] [Cuello/Hombros] [Pecho] [Espalda] [En calma]
const QUICK_SENSATION_BUTTONS = [
  'Mandíbula',
  'Cuello/Hombros',
  'Pecho',
  'Espalda',
  'En calma',
];

export const WeekView: React.FC<WeekViewProps> = ({
  week,
  allWeeks,
  onSelectWeek,
  onSaveReflection,
  existingReflections,
  onViewHistory,
  onBackToMenu,
  onOpenAssessment,
}) => {
  // Timer State (3 minutes = 180 seconds)
  const TOTAL_SECONDS = 180;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(TOTAL_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasCompletedPractice, setHasCompletedPractice] = useState<boolean>(false);

  // Active minute in the dynamic carousel (0, 1, 2)
  const [activeMinuteIndex, setActiveMinuteIndex] = useState<number>(0);

  // Ambient sound state (nature engine: rain in forest, gentle rain, breeze, waves)
  const [isPlayingAmbient, setIsPlayingAmbient] = useState<boolean>(false);
  const [currentAmbientId, setCurrentAmbientId] = useState<AmbientSoundId>('rain_forest');
  const [isSoundSelectorOpen, setIsSoundSelectorOpen] = useState<boolean>(false);

  // Voice Guidance state (synthesized Spanish voice for mindful instructions)
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(voiceGuide.enabled);
  const [isSpeakingVoice, setIsSpeakingVoice] = useState<boolean>(false);

  // Quick Journal state (< 1 min)
  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);
  const [whatToRelease, setWhatToRelease] = useState<string>('');
  const [savedSuccessToast, setSavedSuccessToast] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reflections for this specific week
  const weekReflections = existingReflections.filter((r) => r.weekNumber === week.weekNumber);
  const latestReflection = weekReflections[0];

  // Reset when week changes
  useEffect(() => {
    setIsTimerRunning(false);
    setSecondsRemaining(TOTAL_SECONDS);
    setHasCompletedPractice(false);
    setActiveMinuteIndex(0);
    soundManager.stopAmbient();
    voiceGuide.stop();
    setIsPlayingAmbient(false);
    setIsSpeakingVoice(false);

    if (latestReflection) {
      setSelectedSensations(latestReflection.sensations || []);
      setWhatToRelease(latestReflection.whatToRelease || '');
    } else {
      setSelectedSensations([]);
      setWhatToRelease('');
    }
  }, [week.weekNumber]);

  // Clean up ambient audio and voice on unmount
  useEffect(() => {
    return () => {
      soundManager.stopAmbient();
      voiceGuide.stop();
    };
  }, []);

  // Timer countdown loop
  useEffect(() => {
    if (!isTimerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          setHasCompletedPractice(true);
          soundManager.playBowl(260, 4.5);
          soundManager.stopAmbient();
          voiceGuide.stop();
          setIsPlayingAmbient(false);
          setIsSpeakingVoice(false);
          return 0;
        }

        // Auto-synchronize the carousel active minute if timer progresses naturally
        const newSec = prev - 1;
        const newMinuteIndex = Math.min(
          2,
          Math.max(0, 2 - Math.floor((newSec === 0 ? 0 : newSec - 1) / 60))
        );

        setActiveMinuteIndex((oldIdx) => {
          if (oldIdx !== newMinuteIndex) {
            // Trigger voice guidance for the new minute if enabled
            if (voiceGuide.enabled) {
              setIsSpeakingVoice(true);
              voiceGuide.playWeekMinute(week.weekNumber, newMinuteIndex, () => {
                setIsSpeakingVoice(false);
              });
            }
          }
          return newMinuteIndex;
        });

        return newSec;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, week.weekNumber]);

  // Toggle Timer: starts both ambient sound (rain in forest by default) and voice guidance
  const toggleTimer = () => {
    soundManager.resumeContext();
    if (!isTimerRunning) {
      if (secondsRemaining === 0) {
        setSecondsRemaining(TOTAL_SECONDS);
        setHasCompletedPractice(false);
        setActiveMinuteIndex(0);
      }
      setIsTimerRunning(true);
      soundManager.playBowl(320, 2);

      // 1. Iniciar sonido ambiental de naturaleza si no estaba sonando
      if (!isPlayingAmbient) {
        soundManager.startAmbient(currentAmbientId);
        setIsPlayingAmbient(true);
      }

      // 2. Pronunciar guía de voz para el minuto activo si está activada
      if (voiceEnabled) {
        setIsSpeakingVoice(true);
        voiceGuide.playWeekMinute(week.weekNumber, activeMinuteIndex, () => {
          setIsSpeakingVoice(false);
        });
      }
    } else {
      setIsTimerRunning(false);
      voiceGuide.stop();
      setIsSpeakingVoice(false);
      soundManager.stopAmbient();
      setIsPlayingAmbient(false);
    }
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsRemaining(TOTAL_SECONDS);
    setHasCompletedPractice(false);
    setActiveMinuteIndex(0);
    soundManager.stopAmbient();
    voiceGuide.stop();
    setIsPlayingAmbient(false);
    setIsSpeakingVoice(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Carousel manual controls: Prev / Next minute
  const handlePrevMinute = () => {
    soundManager.resumeContext();
    if (activeMinuteIndex > 0) {
      const newIdx = activeMinuteIndex - 1;
      setActiveMinuteIndex(newIdx);
      if (!isTimerRunning) {
        setSecondsRemaining((3 - newIdx) * 60);
      }
      if (voiceEnabled && isTimerRunning) {
        setIsSpeakingVoice(true);
        voiceGuide.playWeekMinute(week.weekNumber, newIdx, () => {
          setIsSpeakingVoice(false);
        });
      }
    }
  };

  const handleNextMinute = () => {
    soundManager.resumeContext();
    if (activeMinuteIndex < 2) {
      const newIdx = activeMinuteIndex + 1;
      setActiveMinuteIndex(newIdx);
      if (!isTimerRunning) {
        setSecondsRemaining((3 - newIdx) * 60);
      }
      if (voiceEnabled && isTimerRunning) {
        setIsSpeakingVoice(true);
        voiceGuide.playWeekMinute(week.weekNumber, newIdx, () => {
          setIsSpeakingVoice(false);
        });
      }
    }
  };

  // Toggle ambient nature sound
  const toggleAmbientSound = () => {
    soundManager.resumeContext();
    const playing = soundManager.toggleAmbient(currentAmbientId);
    setIsPlayingAmbient(playing);
  };

  // Change ambient sound from selector
  const handleSelectAmbientSound = (soundId: AmbientSoundId) => {
    setCurrentAmbientId(soundId);
    soundManager.startAmbient(soundId);
    setIsPlayingAmbient(true);
  };

  // Toggle Voice Guidance ON/OFF
  const handleToggleVoice = () => {
    soundManager.resumeContext();
    const nextVal = !voiceEnabled;
    setVoiceEnabled(nextVal);
    voiceGuide.setEnabled(nextVal);
    if (!nextVal) {
      voiceGuide.stop();
      setIsSpeakingVoice(false);
      // Auto-detener también el ambiente al apagar la voz
      soundManager.stopAmbient();
      setIsPlayingAmbient(false);
    } else {
      // Auto-iniciar ambiente si estaba apagado
      if (!isPlayingAmbient) {
        soundManager.startAmbient(currentAmbientId);
        setIsPlayingAmbient(true);
      }
      setIsSpeakingVoice(true);
      voiceGuide.playWeekMinute(week.weekNumber, activeMinuteIndex, () => {
        setIsSpeakingVoice(false);
      });
    }
  };

  // Manual trigger to hear current minute's voice guidance
  const handleTriggerVoiceSpeech = () => {
    soundManager.resumeContext();
    if (isSpeakingVoice) {
      voiceGuide.stop();
      setIsSpeakingVoice(false);
      // Al presionar Detener/Pausar en Voz Guiada, detén automáticamente también el ambiente
      soundManager.stopAmbient();
      setIsPlayingAmbient(false);
    } else {
      if (!voiceEnabled) {
        setVoiceEnabled(true);
        voiceGuide.setEnabled(true);
      }
      // Al presionar Iniciar/Hablar en Voz Guiada, si el sonido de Ambiente está apagado, actívalo automáticamente
      if (!isPlayingAmbient) {
        soundManager.startAmbient(currentAmbientId);
        setIsPlayingAmbient(true);
      }
      setIsSpeakingVoice(true);
      voiceGuide.playWeekMinute(week.weekNumber, activeMinuteIndex, () => {
        setIsSpeakingVoice(false);
      });
    }
  };

  // Quick Journal save (< 1 min)
  const handleSaveQuickJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSensations.length === 0 && !whatToRelease.trim()) {
      alert('Por favor selecciona una zona corporal o escribe qué sueltas hoy.');
      return;
    }

    let score = 7;
    if (selectedSensations.includes('En calma')) score = 9;
    else if (selectedSensations.length >= 3) score = 5;

    onSaveReflection({
      weekNumber: week.weekNumber,
      weekTitle: week.title,
      sensations: selectedSensations,
      whatToRelease: whatToRelease.trim(),
      reflectionText: whatToRelease.trim(),
      wellbeingScore: score,
    });

    soundManager.playUnlock();
    setSavedSuccessToast(true);
    setTimeout(() => {
      setSavedSuccessToast(false);
    }, 3500);
  };

  // Sensation button toggle
  const toggleSensation = (tag: string) => {
    setSelectedSensations((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Circular progress calculation
  const progressPercent = ((TOTAL_SECONDS - secondsRemaining) / TOTAL_SECONDS) * 100;
  const strokeDashoffset = 283 - (283 * progressPercent) / 100;

  // Active step details
  const activeStep = week.steps[activeMinuteIndex] || week.steps[0];
  const currentAmbientOption =
    AMBIENT_SOUND_OPTIONS.find((opt) => opt.id === currentAmbientId) || AMBIENT_SOUND_OPTIONS[0];

  const getAmbientIcon = (id: AmbientSoundId) => {
    switch (id) {
      case 'rain_forest':
        return <CloudRain className="w-4 h-4" />;
      case 'gentle_rain':
        return <Droplets className="w-4 h-4" />;
      case 'forest_breeze':
        return <Trees className="w-4 h-4" />;
      case 'ocean_waves':
        return <Waves className="w-4 h-4" />;
      default:
        return <Radio className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-full pb-28 pt-2 px-4 sm:px-6 max-w-lg mx-auto text-[#2C2F28]">
      {/* Sub-selector horizontal de semanas (deslizable) */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <span className="text-xs uppercase font-bold tracking-wider text-[#6B7A54]">
          {week.pillar}
        </span>

        <div className="flex items-center gap-1 bg-[#EAE4D7] p-1 rounded-xl overflow-x-auto">
          {allWeeks.map((w) => (
            <button
              key={w.weekNumber}
              onClick={() => onSelectWeek(w.weekNumber)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all whitespace-nowrap cursor-pointer ${
                w.weekNumber === week.weekNumber
                  ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
                  : 'text-[#6C7063] hover:text-[#2C2F28]'
              }`}
            >
              Semana {w.weekNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Week Title & Subtitle */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-serif text-[#232720] font-normal leading-tight">
            {week.title}
          </h1>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#3F4832] bg-[#EDE7D9] px-2.5 py-1 rounded-full shrink-0 shadow-2xs">
            ⏱ 3 minutos
          </span>
        </div>
        <p className="text-xs text-[#666B5E] mt-1 leading-relaxed font-light">
          {week.subtitle}
        </p>
      </div>

      {/* 1. VENTANA DINÁMICA / CARRUSEL PARA LOS MINUTOS DE PRÁCTICA */}
      <section className="relative overflow-hidden rounded-[32px] border border-[#D8C7B0] bg-[#FAF8F4] p-5 sm:p-6 shadow-md mb-6">
        {/* Fondo sutil de ondas de agua translúcidas */}
        <NatureBackground variant="water-ripples" opacity={0.15} />

        {/* Encabezado del Minuto Activo con Navegación Lateral */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
          <button
            type="button"
            onClick={handlePrevMinute}
            disabled={activeMinuteIndex === 0}
            className="w-9 h-9 rounded-xl bg-[#EFE8DC] hover:bg-[#E2D8C6] disabled:opacity-30 disabled:pointer-events-none text-[#556341] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Minuto anterior"
            aria-label="Minuto anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* TÍTULO DEL MINUTO ACTIVO */}
          <div className="text-center px-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7A54] block">
              Minuto {activeStep.minute} de 3
            </span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-[#232720] uppercase tracking-wide">
              MINUTO {activeStep.minute}: {activeStep.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleNextMinute}
            disabled={activeMinuteIndex === 2}
            className="w-9 h-9 rounded-xl bg-[#EFE8DC] hover:bg-[#E2D8C6] disabled:opacity-30 disabled:pointer-events-none text-[#556341] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
            title="Siguiente minuto"
            aria-label="Siguiente minuto"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Indicadores de paso (Puntos interactivos) */}
        <div className="relative z-10 flex items-center justify-center gap-2 mt-2.5 mb-1">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setActiveMinuteIndex(idx);
                if (!isTimerRunning) setSecondsRemaining((3 - idx) * 60);
                if (voiceEnabled && isTimerRunning) {
                  setIsSpeakingVoice(true);
                  const script = week.steps[idx]?.spokenText || voiceGuide.getWeekMinuteScript(week.weekNumber, idx);
                  voiceGuide.speak(script, () => {
                    setIsSpeakingVoice(false);
                  });
                }
              }}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === activeMinuteIndex
                  ? 'w-6 bg-[#556341]'
                  : 'w-2 bg-[#D9CEBA] hover:bg-[#B5A992]'
              }`}
              title={`Ir al Minuto ${idx + 1}`}
            />
          ))}
        </div>

        {/* Temporizador Circular Centrado de la Práctica */}
        <div className="relative z-10 flex flex-col items-center justify-center py-2">
          <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center my-1">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-[#EBE5D8]"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-[#6B7A54] transition-all duration-500 ease-linear"
                strokeWidth="5"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-mono font-medium text-[#2C2F28] tracking-tight tabular-nums">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[#797D70] font-medium mt-0.5">
                {isTimerRunning ? 'En práctica' : secondsRemaining === 0 ? 'Completado' : 'Práctica ancla'}
              </span>
            </div>
          </div>

          {/* Completed Notice */}
          {hasCompletedPractice && (
            <div className="mt-2 p-2 bg-[#E7ECE0] text-[#3E4A2E] rounded-2xl text-xs text-center flex items-center justify-center gap-1.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-[#556341]" />
              <span>3 minutos de presencia completados. Siente la respiración natural.</span>
            </div>
          )}

          {/* Controls: Reiniciar y Play/Pausa */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={resetTimer}
              className="h-11 w-11 rounded-2xl bg-[#EDE5D5] hover:bg-[#E0D7C3] text-[#556341] flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
              title="Reiniciar 3 minutos"
              aria-label="Reiniciar"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleTimer}
              className="h-11 px-6 rounded-2xl bg-[#556341] hover:bg-[#485437] active:scale-[0.98] text-[#FDFCF9] font-medium text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{secondsRemaining === 0 ? 'Repetir práctica' : 'Iniciar 3 minutos'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. CONTROLES DE VOZ GUIADA Y SONIDO AMBIENTAL DE NATURALEZA */}
        <div className="relative z-10 mt-3 space-y-2.5">
          {/* Fila A: Voz Guiada Sintetizada en Español */}
          <div className="p-3 rounded-2xl bg-[#F0EBE0]/90 border border-[#DDD3BF] flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer ${
                  voiceEnabled
                    ? 'bg-[#556341] text-white'
                    : 'bg-[#DFD6C2] text-stone-500 hover:text-stone-700'
                }`}
                title={voiceEnabled ? 'Desactivar voz guiada' : 'Activar voz guiada'}
              >
                {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#556341]">
                    Voz Guiada
                  </span>
                  <span className="text-[10px] bg-[#E3EBDD] text-[#3D4F35] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                    <span>🎙️ Voz Masculina de Estudio</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSpeakingVoice(true);
                      voiceGuide.testVoice('male', () => setIsSpeakingVoice(false));
                    }}
                    className="text-[10px] bg-[#EADDC7] text-[#4F4632] hover:bg-[#DFCFB5] font-medium px-2 py-0.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                    title="Probar muestra de voz con cadencia humana meditativa"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#8A6729]" />
                    <span>Probar tono</span>
                  </button>
                  {isSpeakingVoice && (
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.2 rounded-full animate-pulse">
                      Hablando...
                    </span>
                  )}
                  {!voiceEnabled && (
                    <span className="text-[10px] text-stone-500 bg-stone-200 px-1.5 py-0.2 rounded-full">
                      Pausa
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-700 font-medium truncate mt-0.5">
                  {'Tono barítono profundo (Rate: 0.74 · Pitch: 0.86) · Minuto ' + activeStep.minute}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTriggerVoiceSpeech}
              className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs active:scale-95 ${
                isSpeakingVoice
                  ? 'bg-amber-600 text-white'
                  : 'bg-[#E3D9C7] text-[#424A37] hover:bg-[#D5CAAD]'
              }`}
              title="Escuchar locución del paso actual"
            >
              {isSpeakingVoice ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Detener</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Escuchar</span>
                </>
              )}
            </button>
          </div>

          {/* Fila B: Selector de Sonido Ambiental de Naturaleza */}
          <div className="p-3 rounded-2xl bg-[#F0EBE0]/90 border border-[#DDD3BF] flex items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={toggleAmbientSound}
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs cursor-pointer ${
                  isPlayingAmbient
                    ? 'bg-[#3E4F39] text-white ring-2 ring-[#3E4F39]/20'
                    : 'bg-[#DFD6C2] text-stone-600 hover:text-stone-800'
                }`}
                title={isPlayingAmbient ? 'Pausar sonido ambiental' : 'Reproducir sonido ambiental'}
              >
                {getAmbientIcon(currentAmbientId)}
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#3E4F39]">
                    Ambiente
                  </span>
                  {isPlayingAmbient && (
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 font-semibold px-2 py-0.2 rounded-full">
                      Sonando
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-stone-800 truncate">
                  {currentAmbientOption.title}
                </p>
                {currentAmbientOption.soundSignature && (
                  <p className="text-[10px] text-[#4F5D44] truncate">
                    {currentAmbientOption.soundSignature}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSoundSelectorOpen(true)}
                className="h-9 px-2.5 rounded-xl text-xs font-medium bg-[#E3D9C7] text-[#424A37] hover:bg-[#D5CAAD] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                title="Cambiar sonido natural"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cambiar</span>
              </button>

              <button
                type="button"
                onClick={toggleAmbientSound}
                className={`h-9 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isPlayingAmbient
                    ? 'bg-[#3E4F39] text-white'
                    : 'bg-[#E3D9C7] text-[#424A37] hover:bg-[#D5CAAD]'
                }`}
              >
                {isPlayingAmbient ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Activar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Guía e Instrucción exclusiva del minuto activo */}
        <div className="relative z-10 mt-3.5 pt-3 border-t border-[#E8DFC9] text-center">
          <p className="text-xs sm:text-sm text-[#444A3A] leading-relaxed font-normal">
            {activeStep.displayText || activeStep.instruction}
          </p>
          <p className="text-xs font-serif italic text-[#6B7A54] mt-1.5">
            "{activeStep.cue}"
          </p>
        </div>
      </section>

      {/* Modal / Selector de Ambientes de la Naturaleza */}
      <AmbientSoundSelector
        isOpen={isSoundSelectorOpen}
        onClose={() => setIsSoundSelectorOpen(false)}
        currentSoundId={currentAmbientId}
        isPlaying={isPlayingAmbient}
        onSelectSound={handleSelectAmbientSound}
        onTogglePlay={toggleAmbientSound}
      />

      {/* 4. BITÁCORA RÁPIDA (MENOS DE 1 MINUTO) */}
      <section className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-3xl p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between border-b border-[#EBE5D8] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#6B7A54]" />
            <div>
              <h2 className="font-serif text-lg font-medium text-[#232720] leading-none">
                Bitácora rápida
              </h2>
              <span className="text-[11px] text-[#7A7E72]">
                Registro somático en menos de 1 minuto
              </span>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-[#556341] bg-[#EDE7DA] px-2.5 py-1 rounded-full">
            &lt; 1 min
          </span>
        </div>

        <form onSubmit={handleSaveQuickJournal} className="space-y-4">
          {/* SELECTOR RÁPIDO CON BOTONES: [Mandíbula] [Cuello/Hombros] [Pecho] [Espalda] [En calma] */}
          <div>
            <label className="text-xs font-semibold text-[#3F4633] block mb-2">
              ¿Dónde sientes la tensión o relajación en este momento?
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_SENSATION_BUTTONS.map((btnLabel) => {
                const isSelected = selectedSensations.includes(btnLabel);
                return (
                  <button
                    type="button"
                    key={btnLabel}
                    onClick={() => toggleSensation(btnLabel)}
                    className={`h-11 px-3.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-[#556341] text-[#FDFCF9] scale-102 ring-2 ring-[#556341]/30'
                        : 'bg-[#EDE7DA] text-[#484E3F] hover:bg-[#E2DBCB]'
                    }`}
                  >
                    {isSelected ? `✓ [${btnLabel}]` : `[${btnLabel}]`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUADRO BREVE: "¿QUÉ SUELTAS HOY?" Y GUARDADO PRIVADO */}
          <div>
            <label
              htmlFor="what-to-release-input"
              className="block text-sm font-serif font-medium text-[#232720] mb-1"
            >
              ¿Qué sueltas hoy?
            </label>
            <input
              id="what-to-release-input"
              type="text"
              value={whatToRelease}
              onChange={(e) => setWhatToRelease(e.target.value)}
              placeholder="Ej. La prisa por responder, la autoexigencia, una preocupación..."
              className="w-full h-12 px-4 rounded-2xl bg-[#FDFCF9] border border-[#D9D3C7] focus:border-[#6B7A54] focus:ring-2 focus:ring-[#6B7A54]/20 text-sm text-[#2C2F28] outline-none placeholder:text-[#9B9E93] shadow-2xs"
            />
            <span className="text-[11px] text-[#7E8274] block mt-1">
              🔒 Guardado privado y seguro en tu dispositivo.
            </span>
          </div>

          {/* Success Toast */}
          {savedSuccessToast && (
            <div className="p-3 bg-[#E4ECE0] text-[#3A452B] rounded-2xl text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#556341]" />
                <span className="font-medium">
                  Reflexión guardada privadamente en tu bitácora local.
                </span>
              </div>
              <button
                type="button"
                onClick={onViewHistory}
                className="underline hover:text-[#232720] font-semibold text-[11px] cursor-pointer"
              >
                Ver historial
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#556341] hover:bg-[#485437] active:scale-[0.98] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Guardar reflexión rápida</span>
          </button>
        </form>

        {weekReflections.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#EBE5D8] flex items-center justify-between text-xs text-[#6B7062]">
            <span>{weekReflections.length} registro{weekReflections.length > 1 ? 's' : ''} en esta semana</span>
            <button
              onClick={onViewHistory}
              className="text-[#556341] font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver en historial</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* 5. BOTÓN ESPECIAL EN SEMANA 5: TEST ANTES VS DESPUÉS */}
      {week.weekNumber === 5 && (
        <section className="bg-gradient-to-br from-[#EDE6D7] to-[#DFD6C2] border border-[#D5CCA8] rounded-3xl p-5 shadow-sm text-[#2C2F28]">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#556341] text-[#FDFCF9] flex items-center justify-center">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#556341]">
                Cierre del Ciclo · Semana 5
              </span>
              <h3 className="font-serif text-lg font-medium text-[#232720] leading-none mt-0.5">
                Evaluación Final: Antes vs. Después
              </h3>
            </div>
          </div>
          <p className="text-xs text-[#5D6352] leading-relaxed mb-4">
            Has completado los 5 pilares somáticos. Repite el test de 7 preguntas para visualizar tu evolución gráfica en el radar de bienestar somático.
          </p>
          <button
            type="button"
            onClick={onOpenAssessment}
            className="w-full h-12 rounded-2xl bg-[#556341] hover:bg-[#485437] active:scale-[0.98] text-[#FDFCF9] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <BarChart2 className="w-4 h-4" />
            <span>Repetir Test y Ver Gráfico Comparativo</span>
          </button>
        </section>
      )}
    </div>
  );
};
