import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Volume1,
  VolumeX,
  CheckCircle2,
  Sparkles,
  Wind,
  Send,
  SlidersHorizontal,
  ChevronDown,
  CloudRain,
  Droplets,
  Trees,
  Waves,
  Radio,
  ArrowRight
} from 'lucide-react';
import { ProgramPractice } from '../data/programWeeksData';
import { ProgramDay } from '../data/programDays';
import { SomaticSession } from '../data/somaticSessions';
import { soundManager, AmbientSoundId, AMBIENT_SOUND_OPTIONS } from '../utils/sound';
import { voiceGuide } from '../utils/voiceGuide';
import { speechSynthesisService } from '../services/speechSynthesisService';
import { useAuth } from '../context/AuthContext';
import { ReflectionEntry } from '../types';
import { saveReflectionToFirestore } from '../lib/firebase';

interface SomaticPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  practice?: ProgramPractice | null;
  day?: ProgramDay | null;
  session?: SomaticSession | null;
  onSaveReflection?: (data: Omit<ReflectionEntry, 'id' | 'createdAt'>) => void;
}

export const SomaticPlayerModal: React.FC<SomaticPlayerModalProps> = ({
  isOpen,
  onClose,
  practice,
  day,
  session,
  onSaveReflection,
}) => {
  const { completePractice, completeDay, currentUser } = useAuth();

  const totalDurationSeconds = 180; // 3 minutes total
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCompletedCelebration, setIsCompletedCelebration] = useState<boolean>(false);

  // Active ambient sound selection & switcher popover
  const [selectedAmbientId, setSelectedAmbientId] = useState<AmbientSoundId>(() => soundManager.getPreferredAmbient());
  const [ambientVolume, setAmbientVolume] = useState<number>(() => soundManager.ambientVolume);
  const [isAmbientMenuOpen, setIsAmbientMenuOpen] = useState<boolean>(false);

  // Measurement states (before / after)
  const hasMeasurement = Boolean(practice?.hasMeasurement);
  const measurementMin = practice?.measurementMin ?? 1;
  const measurementMax = practice?.measurementMax ?? 10;
  const [measurementStep, setMeasurementStep] = useState<'before' | 'practice' | 'after'>(
    hasMeasurement ? 'before' : 'practice'
  );
  const [beforeScore, setBeforeScore] = useState<number>(7);
  const [afterScore, setAfterScore] = useState<number>(3);

  // Reflection form after completion
  const [selectedSensations, setSelectedSensations] = useState<string[]>([]);
  const [whatToRelease, setWhatToRelease] = useState<string>('');
  const [reflectionSaved, setReflectionSaved] = useState<boolean>(false);

  // Resolve steps
  const steps = practice ? practice.steps : day ? day.steps : session ? session.steps : [];
  const currentStepIndex = Math.min(2, Math.floor(elapsedSeconds / 60));
  const activeStep = steps[currentStepIndex] || steps[0];

  const title = practice ? practice.title : day ? day.title : session ? session.title : 'Práctica Somática';
  const subtitle = practice ? practice.subtitle : day ? day.subtitle : session ? session.subtitle : '';
  const emoji = session ? session.emoji : '🌿';

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize on open
  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      soundManager.stopAmbient();
      voiceGuide.stop();
      return;
    }

    const defaultAmbient = soundManager.getPreferredAmbient();
    setSelectedAmbientId(defaultAmbient);
    setAmbientVolume(soundManager.ambientVolume);
    setElapsedSeconds(0);
    setIsMuted(false);
    setIsCompletedCelebration(false);
    setIsAmbientMenuOpen(false);
    setSelectedSensations([]);
    setWhatToRelease('');
    setReflectionSaved(false);

    // Preload audio steps with Gemini TTS Fenrir for zero-latency instant playback
    steps.forEach((s) => {
      if (s.spokenText) {
        speechSynthesisService.preload(s.spokenText);
      }
    });

    if (hasMeasurement) {
      setMeasurementStep('before');
      setIsPlaying(false);
      setBeforeScore(7);
      setAfterScore(3);
    } else {
      setMeasurementStep('practice');
      setIsPlaying(true);
      soundManager.startAmbient(defaultAmbient);
      if (steps[0]?.spokenText) {
        window.setTimeout(() => {
          voiceGuide.speak(steps[0].spokenText);
        }, 600);
      }
    }

    return () => {
      soundManager.stopAmbient();
      voiceGuide.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, practice, day, session]);

  // Handle timer
  useEffect(() => {
    if (!isOpen || !isPlaying || isCompletedCelebration || measurementStep !== 'practice') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        // Chime and guidance on step transitions (60s and 120s)
        if (next === 60 || next === 120) {
          soundManager.playStepTransitionChime();
          const nextIndex = next === 60 ? 1 : 2;
          const nextStep = steps[nextIndex];
          if (nextStep?.spokenText) {
            window.setTimeout(() => {
              voiceGuide.speak(nextStep.spokenText);
            }, 600);
          }
        }

        if (next >= totalDurationSeconds) {
          handleTriggerComplete();
          return totalDurationSeconds;
        }

        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPlaying, isCompletedCelebration, measurementStep, steps]);

  // Start practice after "before" measurement
  const handleStartFromMeasurement = () => {
    soundManager.resumeContext();
    setMeasurementStep('practice');
    setIsPlaying(true);
    soundManager.startAmbient(selectedAmbientId);
    if (steps[0]?.spokenText) {
      window.setTimeout(() => {
        voiceGuide.speak(steps[0].spokenText);
      }, 600);
    }
  };

  const handleTriggerComplete = async () => {
    setIsPlaying(false);
    soundManager.playCompletionChime();
    voiceGuide.stop();

    if (hasMeasurement) {
      setMeasurementStep('after');
    } else {
      finalizeCompletion();
    }
  };

  const finalizeCompletion = async () => {
    setIsCompletedCelebration(true);

    // Complete in AuthContext / Firestore
    if (practice?.id) {
      await completePractice(practice.id);
    } else if (day?.dayNumber) {
      await completeDay(day.dayNumber);
    }
  };

  const handleTogglePlay = () => {
    soundManager.resumeContext();
    if (isPlaying) {
      setIsPlaying(false);
      soundManager.stopAmbient();
      voiceGuide.stop();
    } else {
      setIsPlaying(true);
      soundManager.startAmbient(selectedAmbientId);
      if (activeStep?.spokenText) {
        voiceGuide.speak(activeStep.spokenText);
      }
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      soundManager.stopAmbient();
      voiceGuide.stop();
    } else {
      soundManager.resumeContext();
      soundManager.startAmbient(selectedAmbientId);
    }
  };

  const handleSwitchAmbient = (newSoundId: AmbientSoundId) => {
    soundManager.resumeContext();
    setSelectedAmbientId(newSoundId);
    soundManager.setPreferredAmbient(newSoundId);
    setIsAmbientMenuOpen(false);
    if (!isMuted) {
      soundManager.startAmbient(newSoundId);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setAmbientVolume(newVal);
    soundManager.setAmbientVolume(newVal);
  };

  const handleRestart = () => {
    setElapsedSeconds(0);
    setIsPlaying(true);
    setIsCompletedCelebration(false);
    if (hasMeasurement) {
      setMeasurementStep('practice');
    }
    soundManager.startAmbient(selectedAmbientId);
    if (steps[0]?.spokenText) {
      voiceGuide.speak(steps[0].spokenText);
    }
  };

  const handleSaveReflectionAction = async () => {
    const reflectionData: Omit<ReflectionEntry, 'id' | 'createdAt'> = {
      weekNumber: practice?.weekNumber || day?.weekNumber || 1,
      weekTitle: title,
      dayInWeek: practice?.practiceOrder || day?.dayInWeek || 1,
      sensations: selectedSensations.length > 0 ? selectedSensations : ['En calma'],
      whatToRelease: whatToRelease.trim() || 'Sobrecarga y prisa del día',
      reflectionText: whatToRelease.trim(),
      wellbeingScore: hasMeasurement ? Math.max(1, 10 - afterScore) : 9,
    };

    if (onSaveReflection) {
      onSaveReflection(reflectionData);
    }

    if (currentUser) {
      try {
        await saveReflectionToFirestore(currentUser.uid, {
          ...reflectionData,
          id: `ref-${Date.now()}`,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Could not save reflection to Firestore:', e);
      }
    }

    setReflectionSaved(true);
    window.setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  const remainingSeconds = Math.max(0, totalDurationSeconds - elapsedSeconds);
  const minutesDisplay = Math.floor(remainingSeconds / 60);
  const secondsDisplay = String(remainingSeconds % 60).padStart(2, '0');
  const progressRatio = Math.min(1, elapsedSeconds / totalDurationSeconds);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#232720]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FAF8F4] border border-[#DDD5C0] w-full max-w-md rounded-[36px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] relative">
        {/* Top Header Bar */}
        <div className="px-5 pt-4 pb-2.5 flex items-center justify-between border-b border-[#EAE3D3]">
          <div className="flex items-center gap-2">
            <span className="text-xl select-none">{emoji}</span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7A54]">
                {practice
                  ? `Semana ${practice.weekNumber} · Práctica ${practice.practiceOrder}`
                  : day
                  ? `Programa Día ${day.dayNumber}`
                  : 'Sesión Somática'}
              </span>
              <h3 className="text-sm font-serif font-medium text-[#232720] truncate max-w-[210px]">
                {title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleMute}
              className="w-8 h-8 rounded-full bg-[#EAE3D3] hover:bg-[#DDD5C0] text-[#556341] flex items-center justify-center transition-colors cursor-pointer"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#EAE3D3] hover:bg-[#DDD5C0] text-[#556341] flex items-center justify-center transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col justify-between relative">
          {/* FASE 1: MEDICIÓN PREVIA SI TIENE TERMÓMETRO */}
          {hasMeasurement && measurementStep === 'before' && !isCompletedCelebration ? (
            <div className="space-y-5 py-4 animate-fade-in text-center my-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#EDE7D9] text-[#556341] flex items-center justify-center mx-auto shadow-2xs">
                <SlidersHorizontal className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7A54] bg-[#EDE7D9] px-2.5 py-0.5 rounded-full">
                  Paso 1: Medición Previa
                </span>
                <h3 className="font-serif text-xl font-medium text-[#232720] mt-2">
                  {practice?.measurementLabel || 'Termómetro Emocional'}
                </h3>
                <p className="text-xs text-[#6B7062] mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {practice?.measurementPrompts?.before ||
                    '¿Cuál es tu nivel de sobrecarga antes de comenzar? (1: En calma | 10: Tensión máxima)'}
                </p>
              </div>

              {/* Slider / Number selector */}
              <div className="bg-[#EFE9DD]/80 p-4 rounded-3xl border border-[#DDD5C0]">
                <div className="flex items-center justify-between text-xs text-[#6B7062] mb-2 px-1">
                  <span>Mínimo ({measurementMin})</span>
                  <span className="text-2xl font-serif font-bold text-[#556341]">{beforeScore}</span>
                  <span>Máximo ({measurementMax})</span>
                </div>
                <input
                  type="range"
                  min={measurementMin}
                  max={measurementMax}
                  value={beforeScore}
                  onChange={(e) => setBeforeScore(Number(e.target.value))}
                  className="w-full accent-[#556341] cursor-pointer"
                />
              </div>

              <button
                onClick={handleStartFromMeasurement}
                className="w-full py-3 rounded-2xl bg-[#556341] hover:bg-[#485437] text-[#FDFCF9] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>Continuar a la Práctica (3 min)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : hasMeasurement && measurementStep === 'after' && !isCompletedCelebration ? (
            /* FASE DE MEDICIÓN POSTERIOR */
            <div className="space-y-5 py-4 animate-fade-in text-center my-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7A54] bg-[#EDE7D9] px-2.5 py-0.5 rounded-full">
                  Paso 2: Medición Posterior
                </span>
                <h3 className="font-serif text-xl font-medium text-[#232720] mt-2">
                  ¿Cómo se siente tu cuerpo ahora?
                </h3>
                <p className="text-xs text-[#6B7062] mt-1.5 max-w-xs mx-auto leading-relaxed">
                  {practice?.measurementPrompts?.after ||
                    'Registra tu nivel actual para comprobar el alivio en tu sistema nervioso:'}
                </p>
              </div>

              {/* Slider After */}
              <div className="bg-[#EFE9DD]/80 p-4 rounded-3xl border border-[#DDD5C0]">
                <div className="flex items-center justify-between text-xs text-[#6B7062] mb-2 px-1">
                  <span>Mínimo ({measurementMin})</span>
                  <span className="text-2xl font-serif font-bold text-emerald-800">{afterScore}</span>
                  <span>Máximo ({measurementMax})</span>
                </div>
                <input
                  type="range"
                  min={measurementMin}
                  max={measurementMax}
                  value={afterScore}
                  onChange={(e) => setAfterScore(Number(e.target.value))}
                  className="w-full accent-emerald-700 cursor-pointer"
                />

                {/* Delta comparison badge */}
                <div className="mt-3 pt-2.5 border-t border-[#D5CDBC] text-xs font-medium text-[#4B5539] flex items-center justify-center gap-2">
                  <span>Nivel inicial: <strong>{beforeScore}</strong></span>
                  <span>➔</span>
                  <span>Nivel final: <strong className="text-emerald-800">{afterScore}</strong></span>
                  {beforeScore - afterScore > 0 && (
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                      -{beforeScore - afterScore} pts de tensión
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={finalizeCompletion}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#6B7A54] to-[#556341] hover:from-[#556341] hover:to-[#485437] text-[#FDFCF9] font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
              >
                <span>Finalizar y Guardar Sesión</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              </button>
            </div>
          ) : !isCompletedCelebration ? (
            /* REPRODUCTOR ACTIVO NORMAL */
            <>
              {/* SELECTOR DE AMBIENTE INTERACTIVO RESTAURADO (CAMBIAR AMBIENTE) */}
              <div className="relative mb-2">
                <button
                  type="button"
                  onClick={() => setIsAmbientMenuOpen(!isAmbientMenuOpen)}
                  className="w-full py-1.5 px-3 rounded-2xl bg-[#EFE9DD]/90 hover:bg-[#E5DEC9] border border-[#DDD5C0] text-xs font-medium text-[#4D5638] flex items-center justify-between transition-all cursor-pointer shadow-2xs"
                  title="Cambiar paisaje sonoro en tiempo real"
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

                {/* Dropdown Menu of 5 Ambients */}
                {isAmbientMenuOpen && (
                  <div className="absolute top-10 left-0 right-0 z-30 bg-[#FAF8F4] border border-[#DDD5C0] rounded-2xl shadow-xl p-1.5 space-y-1 animate-fadeIn">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7A7E72] border-b border-[#EAE3D3]">
                      Elige el fondo sonoro (Web Audio en tiempo real)
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

                {/* Subtle Ambient Volume Slider */}
                {selectedAmbientId !== 'silence' && (
                  <div className="flex items-center gap-2 px-2.5 py-1 mt-1.5 bg-[#FAF7F0] border border-[#E8E1D0] rounded-xl text-[11px] text-[#6B7062]">
                    <Volume1 className="w-3.5 h-3.5 text-[#6B7A54] shrink-0" />
                    <span className="shrink-0 text-[10px] font-semibold text-[#556341]">Ambiente:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={ambientVolume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full accent-[#556341] h-1.5 bg-[#E2DAC8] rounded-lg cursor-pointer"
                      title={`Volumen del paisaje ambiental: ${Math.round(ambientVolume * 100)}%`}
                    />
                    <span className="w-8 text-right text-[10px] font-mono font-medium text-[#556341]">
                      {Math.round(ambientVolume * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Central Breathing Orb & Timer */}
              <div className="flex flex-col items-center justify-center my-2 relative">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full bg-[#8A9A70]/15 transition-all duration-1000 ${
                      isPlaying ? 'animate-ping opacity-25' : 'opacity-10'
                    }`}
                  />
                  <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[#E3DAC8] to-[#D5CBAD] border border-[#C5BBA0] shadow-inner flex items-center justify-center" />

                  {/* Circular progress SVG */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="88" cy="88" r="80" stroke="#E5DEC9" strokeWidth="6" fill="none" />
                    <circle
                      cx="88"
                      cy="88"
                      r="80"
                      stroke="#6B7A54"
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 80}
                      strokeDashoffset={2 * Math.PI * 80 * (1 - progressRatio)}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-500 ease-linear"
                    />
                  </svg>

                  {/* Inner Timer & Cue */}
                  <div className="relative z-10 flex flex-col items-center">
                    <span className="text-3xl font-serif font-light text-[#232720] tracking-tight">
                      {minutesDisplay}:{secondsDisplay}
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7A54] mt-1">
                      Minuto {currentStepIndex + 1} de 3
                    </span>
                  </div>
                </div>

                {/* Male voice badge notice */}
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#6B7062] bg-[#EFE9DD] px-3 py-0.5 rounded-full">
                  <span>🎙️ Voz Masculina Natural de Estudio</span>
                </div>
              </div>

              {/* Spoken Guidance Card */}
              <div className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-2xl p-4 shadow-xs my-1 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#556341] bg-[#EDE7D9] px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  {activeStep?.title || `Paso ${currentStepIndex + 1}`}
                </span>
                <p className="text-sm font-serif text-[#232720] leading-relaxed italic">
                  "{activeStep?.displayText || activeStep?.instruction}"
                </p>
                <p className="text-xs text-[#7A7E72] mt-1.5">
                  {activeStep?.cue}
                </p>
              </div>

              {/* 3 Minutes Progress Stepper */}
              <div className="grid grid-cols-3 gap-2 my-2">
                {[0, 1, 2].map((idx) => {
                  const isPast = currentStepIndex > idx;
                  const isCurrent = currentStepIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        isPast
                          ? 'bg-[#556341]'
                          : isCurrent
                          ? 'bg-[#8A9A70] animate-pulse'
                          : 'bg-[#DDD5C0]'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Player Controls */}
              <div className="space-y-2 mt-1">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleRestart}
                    className="w-10 h-10 rounded-2xl bg-[#EDE7D9] hover:bg-[#E2DAC8] text-[#556341] flex items-center justify-center transition-all cursor-pointer"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleTogglePlay}
                    className="h-12 px-6 rounded-2xl bg-[#556341] hover:bg-[#485437] text-[#FDFCF9] font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {isPlaying ? (
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

                <button
                  onClick={handleTriggerComplete}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#6B7A54] to-[#556341] hover:from-[#556341] hover:to-[#485437] text-[#FDFCF9] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Completar práctica de hoy (Desbloquear siguiente)</span>
                </button>
              </div>
            </>
          ) : (
            /* CELEBRATION FEEDBACK SCREEN */
            <div className="space-y-4 py-2 animate-fade-in text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-700" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#556341] bg-[#EDE7D9] px-3 py-1 rounded-full">
                  ¡Práctica Completada!
                </span>
                <h3 className="font-serif text-2xl font-medium text-[#232720] mt-2">
                  {title}
                </h3>
                <p className="text-xs text-[#6B7062] mt-1 max-w-xs mx-auto leading-relaxed">
                  Has sumado esta práctica a tu bitácora y desbloqueado la siguiente etapa. Tu sistema nervioso agradece estos 3 minutos.
                </p>
              </div>

              {/* Quick Somatic Reflection */}
              <div className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-2xl p-4 text-left shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#556341]">
                  Bitácora Somática Rápida
                </span>
                <p className="text-xs font-serif text-[#232720] mt-0.5">
                  ¿Qué sensación o carga sueltas en este momento?
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {['Mandíbula', 'Cuello / Hombros', 'Pecho', 'Prisa mental', 'En calma'].map((sens) => {
                    const isSelected = selectedSensations.includes(sens);
                    return (
                      <button
                        key={sens}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSensations((prev) => prev.filter((s) => s !== sens));
                          } else {
                            setSelectedSensations((prev) => [...prev, sens]);
                          }
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#556341] text-[#FDFCF9] font-medium'
                            : 'bg-[#EDE7D9] text-[#556341] hover:bg-[#E0D8C5]'
                        }`}
                      >
                        {sens}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2.5 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={whatToRelease}
                    onChange={(e) => setWhatToRelease(e.target.value)}
                    placeholder="Ej. La prisa acumulada, el juicio interno..."
                    className="flex-1 text-xs bg-[#FDFCF9] border border-[#DDD5C0] rounded-xl px-3 py-2 text-[#2C2F28] focus:outline-none focus:border-[#6B7A54]"
                  />
                  <button
                    onClick={handleSaveReflectionAction}
                    disabled={reflectionSaved}
                    className="h-8 px-3 rounded-xl bg-[#556341] text-[#FDFCF9] text-xs font-medium flex items-center gap-1 hover:bg-[#485437] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {reflectionSaved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{reflectionSaved ? 'Guardado' : 'Guardar'}</span>
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#EDE7D9] hover:bg-[#E2DAC8] text-[#3F4832] text-xs font-semibold transition-all cursor-pointer"
              >
                Volver a Mi Práctica
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
