import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Heart } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface BreathingExerciseProps {
  onBack?: () => void;
  isCompact?: boolean;
}

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onBack, isCompact = false }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [breathPattern, setBreathPattern] = useState<'4-4' | 'box'>('4-4'); // 4-4 harmonic or Box 4-4-4-4

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync sound manager
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle breathing phase transitions
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Phase switch logic
        if (breathPattern === '4-4') {
          if (phase === 'inhale') {
            setPhase('exhale');
            if (soundEnabled) soundManager.playBreathCue(false);
            return 4;
          } else {
            setPhase('inhale');
            setCompletedCycles((c) => c + 1);
            if (soundEnabled) soundManager.playBreathCue(true);
            return 4;
          }
        } else {
          // Box breathing
          if (phase === 'inhale') {
            setPhase('hold');
            return 4;
          } else if (phase === 'hold') {
            setPhase('exhale');
            if (soundEnabled) soundManager.playBreathCue(false);
            return 4;
          } else if (phase === 'exhale') {
            setPhase('rest');
            return 4;
          } else {
            setPhase('inhale');
            setCompletedCycles((c) => c + 1);
            if (soundEnabled) soundManager.playBreathCue(true);
            return 4;
          }
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, breathPattern, soundEnabled]);

  const toggleActive = () => {
    if (!isActive) {
      setIsActive(true);
      if (soundEnabled) soundManager.playBreathCue(phase === 'inhale');
    } else {
      setIsActive(false);
    }
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(4);
    setCompletedCycles(0);
  };

  // Guide texts
  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhala profundamente';
      case 'hold':
        return 'Retén con serenidad';
      case 'exhale':
        return 'Exhala despacio y suelta';
      case 'rest':
        return 'Pausa en calma';
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Llena el abdomen y el pecho de aire fresco y limpio.';
      case 'hold':
        return 'Mantén la quietud sin generar tensión.';
      case 'exhale':
        return 'Deja marchar todo el aire y relaja los hombros.';
      case 'rest':
        return 'Espera el siguiente impulso natural de respirar.';
    }
  };

  // Determine scale factor for circle animation
  const isExpanding = phase === 'inhale';
  const isFull = phase === 'hold';
  const isContracting = phase === 'exhale';
  const isResting = phase === 'rest';

  // Smooth css scale
  let circleScale = 'scale-100';
  if (isActive) {
    if (isExpanding) circleScale = 'scale-125 transition-transform duration-[4000ms] ease-in-out';
    else if (isFull) circleScale = 'scale-125';
    else if (isContracting) circleScale = 'scale-90 transition-transform duration-[4000ms] ease-in-out';
    else if (isResting) circleScale = 'scale-90';
  }

  if (isCompact) {
    // Compact widget on main menu
    return (
      <div className="bg-[#FAF8F4] border border-[#E4DEC3]/60 rounded-3xl p-5 shadow-sm text-[#2C2F28]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B7A54]" />
            <h3 className="font-serif text-lg font-medium text-[#2C2F28]">Respiración Consciente</h3>
          </div>
          <span className="text-xs text-[#7A7D70]">Ritmo 4s / 4s</span>
        </div>

        <div className="flex items-center gap-4 py-2">
          {/* Breathing Circle Mini */}
          <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <div
              className={`absolute inset-0 rounded-full bg-[#E5DEC9] transition-transform ${
                isActive && phase === 'inhale' ? 'scale-115 duration-[4000ms]' : 'scale-95 duration-[4000ms]'
              }`}
            />
            <div
              className={`relative w-14 h-14 rounded-full bg-gradient-to-br from-[#8A9A70] to-[#556341] flex flex-col items-center justify-center text-white shadow-sm transition-transform ${
                isActive && phase === 'inhale' ? 'scale-110 duration-[4000ms]' : 'scale-90 duration-[4000ms]'
              }`}
            >
              <span className="text-lg font-mono font-bold leading-none">{isActive ? secondsLeft : '4s'}</span>
            </div>
          </div>

          {/* Quick controls & status */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#383B30] truncate">
              {isActive ? getPhaseText() : 'Pausa para volver a tu centro'}
            </p>
            <p className="text-xs text-[#76796E] line-clamp-2 mt-0.5">
              {isActive ? getPhaseInstruction() : '4 segundos para inhalar y 4 para exhalar.'}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={toggleActive}
                className="h-8 px-3.5 rounded-xl bg-[#556341] hover:bg-[#485437] active:scale-95 text-[#FDFCF9] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isActive ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Iniciar respiración</span>
                  </>
                )}
              </button>
              {isActive && (
                <button
                  onClick={resetExercise}
                  className="h-8 w-8 rounded-xl bg-[#EBE5D8] hover:bg-[#DFD8C8] text-[#556341] flex items-center justify-center transition-colors cursor-pointer"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full Screen / Dedicated View
  return (
    <div className="h-full flex flex-col justify-between py-6 px-5 max-w-md mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#7A7D70] font-medium">Herramienta Somática</span>
          <h2 className="text-2xl font-serif font-medium text-[#2C2F28]">Respiración Consciente</h2>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-10 h-10 rounded-2xl bg-[#EFE9DD] hover:bg-[#E4DEC3] text-[#556341] flex items-center justify-center transition-colors cursor-pointer"
          title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          aria-label={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-[#999C90]" />}
        </button>
      </div>

      {/* Pattern Selector */}
      <div className="flex items-center justify-center gap-1.5 p-1 bg-[#ECE5D8] rounded-2xl mx-auto my-2 text-xs font-medium">
        <button
          onClick={() => {
            setBreathPattern('4-4');
            setPhase('inhale');
            setSecondsLeft(4);
          }}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            breathPattern === '4-4'
              ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
              : 'text-[#6C7063] hover:text-[#2C2F28]'
          }`}
        >
          Armonía 4s - 4s
        </button>
        <button
          onClick={() => {
            setBreathPattern('box');
            setPhase('inhale');
            setSecondsLeft(4);
          }}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            breathPattern === 'box'
              ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
              : 'text-[#6C7063] hover:text-[#2C2F28]'
          }`}
        >
          Caja 4s · 4s · 4s · 4s
        </button>
      </div>

      {/* Main Breathing Circle Stage */}
      <div className="my-auto flex flex-col items-center justify-center py-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Subtle outer ripples */}
          <div
            className={`absolute inset-0 rounded-full border border-[#8A9A70]/30 transition-transform duration-[4000ms] ${
              isActive && (isExpanding || isFull) ? 'scale-110 opacity-70' : 'scale-90 opacity-30'
            }`}
          />
          <div
            className={`absolute inset-4 rounded-full bg-[#EAE2D2]/70 transition-transform duration-[4000ms] ${
              isActive && (isExpanding || isFull) ? 'scale-115' : 'scale-90'
            }`}
          />

          {/* Central breathing bubble */}
          <div
            className={`relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-gradient-to-br from-[#8A9A70] to-[#556341] shadow-lg shadow-[#6B7A54]/25 flex flex-col items-center justify-center text-[#FDFCF9] select-none ${circleScale}`}
          >
            {/* Number counter */}
            <span className="text-5xl sm:text-6xl font-mono font-medium tracking-tight tabular-nums">
              {secondsLeft}
            </span>
            <span className="text-xs uppercase tracking-widest mt-1 text-[#E5ECCF] font-medium">
              Segundos
            </span>
          </div>
        </div>

        {/* Phase Text & Instructions */}
        <div className="text-center mt-6 h-18">
          <h3 className="text-xl font-serif text-[#2C2F28] font-medium transition-all">
            {isActive ? getPhaseText() : 'Toma una postura cómoda'}
          </h3>
          <p className="text-xs text-[#6B7062] max-w-xs mx-auto mt-1 leading-relaxed">
            {isActive ? getPhaseInstruction() : 'Presiona iniciar para sincronizar tu ritmo cardíaco y calmar la mente.'}
          </p>
        </div>

        {/* Completed Cycles Badge */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#556341] bg-[#ECE6D9] px-3 py-1 rounded-full">
          <Heart className="w-3.5 h-3.5 fill-[#8A9A70] text-[#8A9A70]" />
          <span>Ciclos completados: <strong>{completedCycles}</strong></span>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full flex items-center gap-3 pt-4">
        <button
          onClick={resetExercise}
          disabled={!isActive && completedCycles === 0}
          className="h-12 w-12 rounded-2xl bg-[#EBE5D8] hover:bg-[#E0D9CB] disabled:opacity-40 text-[#556341] flex items-center justify-center transition-all cursor-pointer"
          title="Reiniciar"
          aria-label="Reiniciar"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleActive}
          className="flex-1 h-12 rounded-2xl bg-[#556341] hover:bg-[#485437] active:scale-[0.98] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pausar respiración</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{completedCycles > 0 ? 'Continuar práctica' : 'Comenzar ciclo'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
