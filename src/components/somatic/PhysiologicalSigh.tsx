import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/sound';

type SighStep = 1 | 2 | 3;
type SighState = 'idle' | 'active' | 'finished';

const STEPS_DATA = [
  {
    step: 1 as SighStep,
    title: '1. Inhalación nasal profunda',
    sub: 'Llena tus pulmones hasta el 70-80% por la nariz',
    duration: 3.5,
    tag: 'Expansión diafragmática',
  },
  {
    step: 2 as SighStep,
    title: '2. Segunda microinhalación nasal',
    sub: 'Un sorbo extra y corto de aire para reabrir alvéolos colapsados',
    duration: 1.5,
    tag: 'Llenado alveolar',
  },
  {
    step: 3 as SighStep,
    title: '3. Exhalación bucal larga y sonora',
    sub: 'Suelta un suspiro completo "ahhh..." por la boca hasta vaciarte',
    duration: 6.0,
    tag: 'Descarga de CO₂',
  },
];

export const PhysiologicalSigh: React.FC = () => {
  const [totalRounds, setTotalRounds] = useState<number>(5); // 3, 4, or 5 rounds (~1 min)
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<SighStep>(1);
  const [stepSecondsLeft, setStepSecondsLeft] = useState<number>(3.5);
  const [state, setState] = useState<SighState>('idle');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const timerRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStart = () => {
    soundManager.resumeContext();
    setState('active');
    setCurrentRound(1);
    setCurrentStep(1);
    setStepSecondsLeft(STEPS_DATA[0].duration);
    if (soundEnabled) {
      soundManager.playSighStep(1);
    }
  };

  const handlePause = () => {
    stopTimer();
    setState('idle');
  };

  const handleReset = () => {
    stopTimer();
    setState('idle');
    setCurrentRound(1);
    setCurrentStep(1);
    setStepSecondsLeft(STEPS_DATA[0].duration);
  };

  // Progression loop
  useEffect(() => {
    if (state !== 'active') {
      stopTimer();
      return;
    }

    timerRef.current = window.setInterval(() => {
      setStepSecondsLeft((prev) => {
        if (prev > 1) {
          return Number((prev - 1).toFixed(1));
        }

        // Advance steps
        if (currentStep === 1) {
          setCurrentStep(2);
          if (soundEnabled) soundManager.playSighStep(2);
          return STEPS_DATA[1].duration;
        } else if (currentStep === 2) {
          setCurrentStep(3);
          if (soundEnabled) soundManager.playSighStep(3);
          return STEPS_DATA[2].duration;
        } else {
          // Finished round
          if (currentRound >= totalRounds) {
            setState('finished');
            if (soundEnabled) soundManager.playCompletionChime();
            return 0;
          } else {
            setCurrentRound((r) => r + 1);
            setCurrentStep(1);
            if (soundEnabled) soundManager.playSighStep(1);
            return STEPS_DATA[0].duration;
          }
        }
      });
    }, 1000);

    return () => stopTimer();
  }, [state, currentStep, currentRound, totalRounds, soundEnabled]);

  // Overall progress percentage
  const totalRoundsDuration = totalRounds * (3.5 + 1.5 + 6.0); // e.g. 55s
  const completedRounds = Math.max(0, currentRound - 1);
  const currentRoundElapsed =
    currentStep === 1
      ? 3.5 - stepSecondsLeft
      : currentStep === 2
      ? 3.5 + (1.5 - stepSecondsLeft)
      : 3.5 + 1.5 + (6.0 - stepSecondsLeft);
  const totalElapsed = state === 'finished' ? totalRoundsDuration : completedRounds * 11 + Math.max(0, currentRoundElapsed);
  const progressPercent = Math.min(100, Math.round((totalElapsed / totalRoundsDuration) * 100));

  // Visual lung scale based on step
  let visualScale = 'scale-90 opacity-60';
  let haloBg = 'bg-[#EAE4D7]';
  if (state === 'active') {
    if (currentStep === 1) {
      visualScale = 'scale-110 opacity-90';
      haloBg = 'bg-[#E2ECE0]';
    } else if (currentStep === 2) {
      visualScale = 'scale-125 opacity-100 ring-4 ring-[#7F9972]/30';
      haloBg = 'bg-[#D6E6D2]';
    } else {
      visualScale = 'scale-80 opacity-70';
      haloBg = 'bg-[#EFE9DF]';
    }
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-[460px] p-4 sm:p-6 bg-[#FAF8F5] rounded-3xl border border-[#EAE3D3] shadow-xs">
      {/* Top Header & Settings */}
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#B07234]/15 text-[#8A521D]">
              Reseteo Agudo (1 min)
            </span>
            <span className="text-xs text-[#7B7F72]">Suspiro Fisiológico</span>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-1.5 text-xs text-[#5E6255] hover:text-[#2C2F28] px-2 py-1 rounded-lg bg-[#EFECE6] transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#556341]" /> : <VolumeX className="w-3.5 h-3.5 text-[#9CA193]" />}
            <span className="text-[11px] font-medium">{soundEnabled ? 'Tonos ON' : 'Tonos OFF'}</span>
          </button>
        </div>

        {/* Round selector */}
        <div className="flex items-center justify-between bg-[#EFECE6]/70 p-2 rounded-2xl">
          <span className="text-xs text-[#5B6052] font-medium pl-1">Duración del reseteo:</span>
          <div className="flex items-center gap-1.5">
            {[3, 4, 5].map((rounds) => (
              <button
                key={rounds}
                onClick={() => {
                  if (state === 'idle' || state === 'finished') {
                    setTotalRounds(rounds);
                  }
                }}
                disabled={state === 'active'}
                className={`px-3 py-1 rounded-xl text-xs transition-all ${
                  totalRounds === rounds
                    ? 'bg-[#556341] text-white font-semibold shadow-2xs'
                    : 'text-[#646A5B] hover:bg-[#E2DDD1] disabled:opacity-50'
                }`}
              >
                {rounds} rondas {rounds === 5 ? '(~1 min)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full space-y-1">
          <div className="flex items-center justify-between text-[11px] text-[#7E8376]">
            <span>
              {state === 'finished'
                ? 'Reseteo completado'
                : state === 'active'
                ? `Ronda ${currentRound} de ${totalRounds}`
                : `${totalRounds} rondas preparadas`}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E5DFD1] rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#6B7A54] to-[#8FA274] h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Visual Core */}
      <div className="my-5 relative flex flex-col items-center justify-center">
        {/* Dynamic Halo for expansion */}
        <div
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full ${haloBg} border-2 border-[#D8CEBC] flex flex-col items-center justify-center p-4 transition-all duration-700 ease-in-out ${visualScale}`}
        >
          {state === 'idle' ? (
            <div className="text-center flex flex-col items-center gap-1">
              <span className="text-3xl">🫁</span>
              <p className="font-serif font-semibold text-base text-[#2C2F28]">Suspiro Fisiológico</p>
              <p className="text-[11px] text-[#717669] max-w-[130px]">
                Inhala hondo, da otro sorbo de aire y suspira largo
              </p>
            </div>
          ) : state === 'finished' ? (
            <div className="text-center flex flex-col items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-10 h-10 text-[#556341]" />
              <p className="font-serif font-semibold text-base text-[#2C2F28] mt-1">Nivel reiniciado</p>
              <p className="text-[11px] text-[#5E6455]">Alvéolos oxigenados</p>
            </div>
          ) : (
            <div className="text-center flex flex-col items-center animate-fadeIn">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#556341]">
                Paso {currentStep} de 3
              </span>
              <p className="text-base sm:text-lg font-serif font-bold text-[#20251B] my-1 leading-tight max-w-[150px]">
                {currentStep === 1
                  ? 'Inhala profundo'
                  : currentStep === 2
                  ? '+ Microinhalación'
                  : 'Exhala en suspiro'}
              </p>
              <div className="w-9 h-9 rounded-full bg-white/75 flex items-center justify-center text-sm font-mono font-bold text-[#2C2F28] mt-1 shadow-2xs">
                {Math.ceil(stepSecondsLeft)}s
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Visual Guide Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 my-2">
        {STEPS_DATA.map((s) => {
          const isCurrent = state === 'active' && currentStep === s.step;
          return (
            <div
              key={s.step}
              className={`p-2.5 rounded-2xl border transition-all text-left ${
                isCurrent
                  ? 'bg-[#EBF1E8] border-[#7F9972] shadow-xs ring-1 ring-[#7F9972]/40'
                  : 'bg-[#F2EFE8]/70 border-[#E4DEC3] opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-[11px] font-bold ${
                    isCurrent ? 'text-[#3E4E33]' : 'text-[#646A5A]'
                  }`}
                >
                  {s.title}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isCurrent ? 'bg-[#7F9972] text-white' : 'bg-[#E0DAD0] text-[#717669]'
                  }`}
                >
                  {s.duration}s
                </span>
              </div>
              <p className="text-[11px] text-[#5C6153] leading-snug">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Scientific note */}
      <div className="w-full text-center text-[11px] text-[#6E7365] my-1 flex items-center justify-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-[#8A521D]" />
        <span>Abre los alvéolos colapsados y descarga el exceso de CO₂ en menos de 60 segundos.</span>
      </div>

      {/* Controls */}
      <div className="w-full flex items-center justify-center gap-3 mt-2">
        {state === 'idle' || state === 'finished' ? (
          <button
            onClick={handleStart}
            className="w-full sm:w-64 py-3.5 px-6 rounded-2xl bg-[#B07234] hover:bg-[#975B22] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{state === 'finished' ? 'Repetir reseteo' : 'Iniciar Suspiro Fisiológico'}</span>
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
              title="Reiniciar"
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
