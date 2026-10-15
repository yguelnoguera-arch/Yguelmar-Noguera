import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Info } from 'lucide-react';
import { soundManager } from '../../utils/sound';

type VagalPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'finished';

type DurationOption = {
  id: 'cycles_3' | 'time_2m' | 'time_3m' | 'time_5m';
  label: string;
  badge?: string;
  totalSeconds: number;
  totalCycles: number;
};

const DURATION_OPTIONS: DurationOption[] = [
  { id: 'cycles_3', label: '3 ciclos (Pausa de 3)', badge: 'Rápido ~36s', totalSeconds: 36, totalCycles: 3 },
  { id: 'time_2m', label: '2 minutos', badge: '10 ciclos', totalSeconds: 120, totalCycles: 10 },
  { id: 'time_3m', label: '3 minutos', badge: '15 ciclos', totalSeconds: 180, totalCycles: 15 },
  { id: 'time_5m', label: '5 minutos', badge: '25 ciclos', totalSeconds: 300, totalCycles: 25 },
];

export const VagalPacer: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(DURATION_OPTIONS[0]);
  const [phase, setPhase] = useState<VagalPhase>('idle');
  const [phaseTimeLeft, setPhaseTimeLeft] = useState<number>(4);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Phase configurations: Inhale (4s), Hold (2s), Exhale (6s) = 12s per cycle
  const PHASE_DURATIONS = {
    inhale: 4,
    hold: 2,
    exhale: 6,
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStart = () => {
    soundManager.resumeContext();
    setPhase('inhale');
    setPhaseTimeLeft(PHASE_DURATIONS.inhale);
    setCurrentCycle(1);
    if (soundActive) {
      soundManager.playVagalPhase('inhale');
    }
  };

  const handlePause = () => {
    stopTimer();
    setPhase('idle');
  };

  const handleReset = () => {
    stopTimer();
    setPhase('idle');
    setPhaseTimeLeft(PHASE_DURATIONS.inhale);
    setCurrentCycle(1);
  };

  // Main tick loop
  useEffect(() => {
    if (phase === 'idle' || phase === 'finished') {
      stopTimer();
      return;
    }

    timerRef.current = window.setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition to next phase
        if (phase === 'inhale') {
          setPhase('hold');
          if (soundActive) soundManager.playVagalPhase('hold');
          return PHASE_DURATIONS.hold;
        } else if (phase === 'hold') {
          setPhase('exhale');
          if (soundActive) soundManager.playVagalPhase('exhale');
          return PHASE_DURATIONS.exhale;
        } else if (phase === 'exhale') {
          // Check if total cycles completed
          if (currentCycle >= selectedDuration.totalCycles) {
            setPhase('finished');
            if (soundActive) soundManager.playCompletionChime();
            return 0;
          } else {
            setCurrentCycle((c) => c + 1);
            setPhase('inhale');
            if (soundActive) soundManager.playVagalPhase('inhale');
            return PHASE_DURATIONS.inhale;
          }
        }
        return 0;
      });
    }, 1000);

    return () => stopTimer();
  }, [phase, currentCycle, selectedDuration, soundActive]);

  // Dynamic visual sizing and styling for the circle
  let circleScale = 'scale-90';
  let circleBg = 'bg-[#EAE4D7] border-[#D5CDC0] text-[#556341]';
  let phaseText = 'Listo para empezar';
  let phaseSub = 'Presiona Iniciar para activar el nervio vago';

  if (phase === 'inhale') {
    circleScale = 'scale-115 sm:scale-120';
    circleBg = 'bg-[#E4ECE1] border-[#7F9972] text-[#34462E] shadow-lg shadow-[#7F9972]/20';
    phaseText = 'Inhala...';
    phaseSub = 'Por la nariz, suave y profundo';
  } else if (phase === 'hold') {
    circleScale = 'scale-110 sm:scale-115';
    circleBg = 'bg-[#EDEFE4] border-[#A2AB8E] text-[#434F33] shadow-md shadow-[#A2AB8E]/20';
    phaseText = 'Sostén...';
    phaseSub = 'Siente la quietud en tu centro';
  } else if (phase === 'exhale') {
    circleScale = 'scale-75 sm:scale-80';
    circleBg = 'bg-[#EFEAE1] border-[#C8BEAB] text-[#595245] shadow-inner';
    phaseText = 'Exhala...';
    phaseSub = 'Lenta y suavemente, vaciando todo';
  } else if (phase === 'finished') {
    circleScale = 'scale-100';
    circleBg = 'bg-[#E6EDE3] border-[#6B7A54] text-[#2C2F28]';
    phaseText = '¡Ciclo completado!';
    phaseSub = 'Tu sistema nervioso ha entrado en calma';
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-[460px] p-4 sm:p-6 bg-[#FAF8F5] rounded-3xl border border-[#EAE3D3] shadow-xs relative">
      {/* Top Header & Selector */}
      <div className="w-full flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#6B7A54]/15 text-[#485437]">
              Pacer Vagal (4 - 2 - 6)
            </span>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="p-1 rounded-full text-[#7B7F72] hover:text-[#383C2F] transition-colors"
              title="Información científica"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setSoundActive(!soundActive)}
            className="flex items-center gap-1.5 text-xs text-[#5E6255] hover:text-[#2C2F28] px-2 py-1 rounded-lg bg-[#EFECE6] transition-colors"
            title={soundActive ? 'Silenciar tonos armónicos' : 'Activar tonos armónicos'}
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 text-[#556341]" /> : <VolumeX className="w-3.5 h-3.5 text-[#9CA193]" />}
            <span className="text-[11px] font-medium">{soundActive ? 'Tonos ON' : 'Tonos OFF'}</span>
          </button>
        </div>

        {/* Duration Selector */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {DURATION_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                if (phase === 'idle' || phase === 'finished') {
                  setSelectedDuration(opt);
                }
              }}
              disabled={phase !== 'idle' && phase !== 'finished'}
              className={`px-2 py-2 rounded-xl text-center text-xs transition-all cursor-pointer ${
                selectedDuration.id === opt.id
                  ? 'bg-[#556341] text-[#FDFCF9] font-medium shadow-xs'
                  : 'bg-[#EFECE6]/80 text-[#6B7062] hover:bg-[#E5E1D8] disabled:opacity-50'
              }`}
            >
              <div className="font-medium truncate">{opt.label}</div>
              <div className={`text-[10px] ${selectedDuration.id === opt.id ? 'text-[#E0E8D7]' : 'text-[#8C9083]'}`}>
                {opt.badge}
              </div>
            </button>
          ))}
        </div>

        {/* Scientific card toggle */}
        {showExplanation && (
          <div className="w-full p-3 bg-[#EBF0E6] rounded-2xl text-xs text-[#38452D] leading-relaxed border border-[#CFDAC4] transition-all animate-fadeIn">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#556341]" />
              ¿Por qué funciona el ritmo 4 - 2 - 6?
            </p>
            Al exhalar durante 6 segundos (más tiempo que la inhalación de 4s), el diafragma asciende y el cerebro activa una señal a través del <strong>nervio vago</strong> que disminuye inmediatamente la frecuencia cardíaca y frena la respuesta de estrés simpático.
          </div>
        )}
      </div>

      {/* Main Animated Circle */}
      <div className="my-6 relative flex items-center justify-center w-64 h-64 sm:w-72 sm:h-72">
        {/* Subtle breathing ripple waves */}
        <div
          className={`absolute rounded-full border border-[#7F9972]/30 transition-transform duration-[1000ms] ease-out pointer-events-none ${
            phase === 'inhale' ? 'w-64 h-64 scale-125 opacity-40' : 'w-48 h-48 scale-90 opacity-0'
          }`}
        />
        <div
          className={`absolute rounded-full border border-[#7F9972]/20 transition-transform duration-[1200ms] ease-out pointer-events-none ${
            phase === 'inhale' ? 'w-64 h-64 scale-140 opacity-20' : 'w-48 h-48 scale-80 opacity-0'
          }`}
        />

        {/* Central interactive Pacing Circle */}
        <div
          className={`w-52 h-52 sm:w-56 sm:h-56 rounded-full border-4 flex flex-col items-center justify-center text-center p-4 transition-all duration-[1000ms] cubic-bezier(0.4, 0, 0.2, 1) ${circleScale} ${circleBg}`}
        >
          {phase === 'idle' ? (
            <div className="flex flex-col items-center gap-1">
              <span className="text-sm font-semibold tracking-wide uppercase text-[#556341]">Pausa de 3</span>
              <p className="text-xl font-serif font-medium text-[#2C2F28]">4 - 2 - 6</p>
              <span className="text-[11px] text-[#787D70] max-w-[130px] mt-1">Inhala 4s · Sostén 2s · Exhala 6s</span>
            </div>
          ) : phase === 'finished' ? (
            <div className="flex flex-col items-center gap-1 animate-fadeIn">
              <span className="text-2xl">🌱</span>
              <p className="text-lg font-serif font-semibold text-[#303E27]">Pausa completada</p>
              <span className="text-xs text-[#5D6B52]">Cuerpo regulado</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center animate-fadeIn">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-75">
                {phase === 'inhale' ? 'Inhalación' : phase === 'hold' ? 'Retención' : 'Exhalación'}
              </span>
              <p className="text-3xl font-serif font-bold my-1 tracking-tight">{phaseText}</p>
              <div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center text-lg font-mono font-bold mt-1 text-[#2C2F28] shadow-2xs">
                {phaseTimeLeft}s
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cycle Indicator & Subtext */}
      <div className="flex flex-col items-center gap-1 mb-4 text-center">
        <p className="text-xs font-medium text-[#5E6255]">{phaseSub}</p>
        {phase !== 'idle' && phase !== 'finished' && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] text-[#7E8376]">
              Ciclo {currentCycle} de {selectedDuration.totalCycles}
            </span>
            <div className="w-20 bg-[#E0D9CB] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#6B7A54] h-full transition-all duration-300"
                style={{ width: `${(currentCycle / selectedDuration.totalCycles) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex items-center justify-center gap-3">
        {phase === 'idle' || phase === 'finished' ? (
          <button
            onClick={handleStart}
            className="w-full sm:w-64 py-3.5 px-6 rounded-2xl bg-[#556341] hover:bg-[#434F33] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{phase === 'finished' ? 'Repetir práctica' : 'Iniciar Respiración Vagal'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePause}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#EBE5D8] hover:bg-[#E0D9CB] text-[#3E4336] font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4" />
              <span>Pausar</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-2xl bg-[#EBE5D8]/70 hover:bg-[#E0D9CB] text-[#696F61] text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Reiniciar pacer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
