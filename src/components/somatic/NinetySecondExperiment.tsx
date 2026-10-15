import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, Waves, ArrowRight, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/sound';

type ExperimentPhase = 'before' | 'wave' | 'after' | 'summary';

interface EmotionalLevel {
  level: number;
  label: string;
  color: string;
}

const EMOTIONAL_LEVELS: EmotionalLevel[] = [
  { level: 1, label: 'Paz y reposo total', color: '#688258' },
  { level: 2, label: 'Muy sereno / En calma', color: '#6F8C5E' },
  { level: 3, label: 'Leve tensión imperceptible', color: '#7E996C' },
  { level: 4, label: 'Inquietud o prisa suave', color: '#97A86A' },
  { level: 5, label: 'Tensión moderada / Preocupación', color: '#B39E5B' },
  { level: 6, label: 'Agitación notable en el cuerpo', color: '#C4944D' },
  { level: 7, label: 'Estrés alto / Molestia evidente', color: '#C87E3E' },
  { level: 8, label: 'Ansiedad o irritación fuerte', color: '#C26338' },
  { level: 9, label: 'Tensión aguda / Al borde', color: '#B84534' },
  { level: 10, label: 'Desborde o malestar extremo', color: '#A32929' },
];

export const NinetySecondExperiment: React.FC = () => {
  const [phase, setPhase] = useState<ExperimentPhase>('before');
  const [beforeLevel, setBeforeLevel] = useState<number>(7);
  const [afterLevel, setAfterLevel] = useState<number>(4);
  const [timeLeft, setTimeLeft] = useState<number>(90);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleStartWave = () => {
    soundManager.resumeContext();
    setPhase('wave');
    setTimeLeft(90);

    // Start soothing ocean sound if enabled
    if (soundEnabled) {
      soundManager.startAmbient('ocean_waves');
      setIsAudioPlaying(true);
    }
  };

  const handleCancelWave = () => {
    stopTimer();
    soundManager.stopAmbient();
    setIsAudioPlaying(false);
    setPhase('before');
    setTimeLeft(90);
  };

  const handleFinishWave = () => {
    stopTimer();
    soundManager.stopAmbient();
    setIsAudioPlaying(false);
    soundManager.playCompletionChime();
    // Default afterLevel to slightly lower than before
    setAfterLevel(Math.max(1, beforeLevel - 3));
    setPhase('after');
  };

  const handleConfirmAfter = () => {
    setPhase('summary');
  };

  const handleResetAll = () => {
    stopTimer();
    soundManager.stopAmbient();
    setIsAudioPlaying(false);
    setPhase('before');
    setTimeLeft(90);
  };

  // Timer tick for 90 seconds
  useEffect(() => {
    if (phase !== 'wave') {
      stopTimer();
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleFinishWave();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [phase, beforeLevel]);

  // Dynamic emotional prompt according to the wave curve (Dr. Jill Bolte Taylor 90-second rule)
  const getWavePrompt = (seconds: number) => {
    const elapsed = 90 - seconds;
    if (elapsed <= 25) {
      return {
        stage: 'Fase 1: Ascenso de la Ola (0-25s)',
        text: 'La química se activa. Observa las sensaciones físicas en tu pecho o estómago sin intentar cambiarlas.',
        hint: 'Permite que la ola suba libremente.',
      };
    } else if (elapsed <= 55) {
      return {
        stage: 'Fase 2: Cresta Somática (25-55s)',
        text: 'Es el pico máximo de los neuropéptidos en sangre. No alimentes la ola con pensamientos en bucle.',
        hint: 'Solo respira y sé testigo de la energía en movimiento.',
      };
    } else if (elapsed <= 75) {
      return {
        stage: 'Fase 3: Disipación Bioquímica (55-75s)',
        text: 'La oleada hormonal está siendo reabsorbida por tu organismo de forma natural.',
        hint: 'Siente cómo la intensidad empieza a ceder.',
      };
    } else {
      return {
        stage: 'Fase 4: Retorno a la Orilla (75-90s)',
        text: 'La química de la emoción ha cumplido su ciclo biológico en tu cuerpo.',
        hint: 'Respira hondo y aterriza en este nuevo espacio.',
      };
    }
  };

  const currentPrompt = getWavePrompt(timeLeft);
  const currentBeforeObj = EMOTIONAL_LEVELS.find((l) => l.level === beforeLevel) || EMOTIONAL_LEVELS[6];
  const currentAfterObj = EMOTIONAL_LEVELS.find((l) => l.level === afterLevel) || EMOTIONAL_LEVELS[3];

  return (
    <div className="flex flex-col items-center justify-between min-h-[480px] p-4 sm:p-6 bg-[#FAF8F5] rounded-3xl border border-[#EAE3D3] shadow-xs relative">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#3D6B82]/15 text-[#245369]">
            El Experimento de 90 Segundos
          </span>
          <span className="text-[11px] text-[#717669]">Termómetro Emocional</span>
        </div>

        <button
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            if (!next && isAudioPlaying) {
              soundManager.stopAmbient();
              setIsAudioPlaying(false);
            } else if (next && phase === 'wave') {
              soundManager.startAmbient('ocean_waves');
              setIsAudioPlaying(true);
            }
          }}
          className="flex items-center gap-1.5 text-xs text-[#5E6255] hover:text-[#2C2F28] px-2 py-1 rounded-lg bg-[#EFECE6] transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#245369]" /> : <VolumeX className="w-3.5 h-3.5 text-[#9CA193]" />}
          <span className="text-[11px] font-medium">{soundEnabled ? 'Mar ON' : 'Mar OFF'}</span>
        </button>
      </div>

      {/* PHASE 1: ANTES (Termómetro inicial) */}
      {phase === 'before' && (
        <div className="w-full flex-1 flex flex-col justify-between py-2">
          <div className="text-center my-2">
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#20251B]">
              Paso 1: ¿Cuál es tu nivel de tensión o malestar ahora?
            </h3>
            <p className="text-xs text-[#646A5B] mt-1">
              Mueve el deslizador o pulsa un número del 1 al 10 para registrar cómo se siente tu cuerpo.
            </p>
          </div>

          {/* Visual Thermometer Card */}
          <div className="my-4 p-5 bg-[#F2ECE1] rounded-2xl border border-[#E3DACB] flex flex-col items-center">
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl sm:text-5xl font-mono font-bold transition-colors"
                style={{ color: currentBeforeObj.color }}
              >
                {beforeLevel}
              </span>
              <span className="text-sm font-semibold text-[#5B6052]">/ 10</span>
            </div>

            <p className="text-sm font-medium mt-1 text-[#2C2F28]">{currentBeforeObj.label}</p>

            {/* Slider */}
            <div className="w-full max-w-sm mt-4 px-2">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={beforeLevel}
                onChange={(e) => setBeforeLevel(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-[#D9CFBE] rounded-lg appearance-none cursor-pointer accent-[#245369]"
              />
              <div className="flex justify-between text-[10px] text-[#787D70] font-mono mt-1 px-1">
                <span>1 (Calma)</span>
                <span>5 (Medio)</span>
                <span>10 (Desborde)</span>
              </div>
            </div>

            {/* Quick selector buttons 1-10 */}
            <div className="grid grid-cols-10 gap-1 w-full max-w-sm mt-4">
              {EMOTIONAL_LEVELS.map((item) => (
                <button
                  key={item.level}
                  onClick={() => setBeforeLevel(item.level)}
                  className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                    beforeLevel === item.level
                      ? 'bg-[#245369] text-white shadow-2xs scale-105'
                      : 'bg-[#E5DDD0] text-[#555A4C] hover:bg-[#DCD3C4]'
                  }`}
                >
                  {item.level}
                </button>
              ))}
            </div>
          </div>

          {/* Neurobiological context quote */}
          <div className="p-3 bg-[#EAF2F5] rounded-2xl border border-[#C6DCE4] text-xs text-[#1F4354] leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#245369] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Principio biológico de los 90 segundos:</strong>
              Una oleada emocional (adrenalina, cortisol) tarda exactamente 90 segundos en recorrer y ser drenada de tu torrente sanguíneo, a menos que la reactives con pensamientos ruminativos.
            </div>
          </div>

          <button
            onClick={handleStartWave}
            className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-[#245369] hover:bg-[#1A3D4E] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar la Ola de 90 Segundos</span>
          </button>
        </div>
      )}

      {/* PHASE 2: LA OLA DE 90 SEGUNDOS (Temporizador con animación de marea y audio) */}
      {phase === 'wave' && (
        <div className="w-full flex-1 flex flex-col justify-between py-2 text-center animate-fadeIn">
          {/* Main Affirmation Quote */}
          <div className="p-4 bg-[#EDF4F7] rounded-2xl border border-[#CADEE6] text-[#1E4355] shadow-xs">
            <p className="font-serif italic text-sm sm:text-base font-medium leading-relaxed">
              &ldquo;La química de la emoción dura 90 segundos en el cuerpo. Solo acompaña la sensación sin luchar contra ella.&rdquo;
            </p>
          </div>

          {/* Ocean Tide Animation & Countdown */}
          <div className="my-4 relative flex flex-col items-center justify-center">
            {/* Animated SVG Wave Rings */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full border-2 border-[#3D6B82]/30 animate-ping"
                style={{ animationDuration: '4s' }}
              />
              <div
                className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-[#DDECF2] to-[#EEF5F8] border-2 border-[#8EB3C4] flex flex-col items-center justify-center shadow-inner"
              >
                <Waves className="w-6 h-6 text-[#245369] animate-bounce" style={{ animationDuration: '3s' }} />
                <span className="text-4xl sm:text-5xl font-mono font-bold text-[#1A3D4E] my-1">
                  {timeLeft}s
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#3C6477]">
                  Tiempo restante
                </span>
              </div>
            </div>

            {/* Dynamic Stage Banner */}
            <div className="mt-4 max-w-sm px-4 py-2.5 rounded-xl bg-[#F0EBE0] border border-[#DDD4C5]">
              <span className="text-[11px] font-bold text-[#245369] block">
                {currentPrompt.stage}
              </span>
              <p className="text-xs text-[#3E4336] mt-0.5 leading-snug">
                {currentPrompt.text}
              </p>
            </div>
          </div>

          {/* Abort/Reset Control */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleCancelWave}
              className="px-5 py-2.5 rounded-xl bg-[#EBE5D8] hover:bg-[#E0D9CB] text-[#555B4D] text-xs font-medium transition-colors cursor-pointer"
            >
              Interrumpir ola
            </button>
            <button
              onClick={handleFinishWave}
              className="px-5 py-2.5 rounded-xl bg-[#245369]/10 hover:bg-[#245369]/20 text-[#245369] text-xs font-semibold transition-colors cursor-pointer"
            >
              Finalizar ahora
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: DESPUÉS (Termómetro final) */}
      {phase === 'after' && (
        <div className="w-full flex-1 flex flex-col justify-between py-2 animate-fadeIn">
          <div className="text-center my-2">
            <span className="text-2xl">🌊</span>
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#20251B] mt-1">
              Paso 3: ¿Cuál es tu nivel de tensión o malestar ahora?
            </h3>
            <p className="text-xs text-[#646A5B] mt-1">
              Tras pasar los 90 segundos con la marea, evalúa cómo se siente tu cuerpo ahora.
            </p>
          </div>

          {/* Visual Thermometer Card for After */}
          <div className="my-4 p-5 bg-[#F2ECE1] rounded-2xl border border-[#E3DACB] flex flex-col items-center">
            <div className="flex items-baseline gap-2">
              <span
                className="text-4xl sm:text-5xl font-mono font-bold transition-colors"
                style={{ color: currentAfterObj.color }}
              >
                {afterLevel}
              </span>
              <span className="text-sm font-semibold text-[#5B6052]">/ 10</span>
            </div>

            <p className="text-sm font-medium mt-1 text-[#2C2F28]">{currentAfterObj.label}</p>

            {/* Slider */}
            <div className="w-full max-w-sm mt-4 px-2">
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={afterLevel}
                onChange={(e) => setAfterLevel(parseInt(e.target.value, 10))}
                className="w-full h-3 bg-[#D9CFBE] rounded-lg appearance-none cursor-pointer accent-[#556341]"
              />
              <div className="flex justify-between text-[10px] text-[#787D70] font-mono mt-1 px-1">
                <span>1 (Calma)</span>
                <span>5 (Medio)</span>
                <span>10 (Desborde)</span>
              </div>
            </div>

            {/* Quick buttons */}
            <div className="grid grid-cols-10 gap-1 w-full max-w-sm mt-4">
              {EMOTIONAL_LEVELS.map((item) => (
                <button
                  key={item.level}
                  onClick={() => setAfterLevel(item.level)}
                  className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                    afterLevel === item.level
                      ? 'bg-[#556341] text-white shadow-2xs scale-105'
                      : 'bg-[#E5DDD0] text-[#555A4C] hover:bg-[#DCD3C4]'
                  }`}
                >
                  {item.level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#E8E2D5] text-xs text-[#5E6454]">
            <span>Nivel registrado antes de la ola:</span>
            <span className="font-mono font-bold text-[#20251B]">{beforeLevel} / 10</span>
          </div>

          <button
            onClick={handleConfirmAfter}
            className="w-full mt-4 py-3.5 px-6 rounded-2xl bg-[#556341] hover:bg-[#434F33] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            <span>Ver resultado del cambio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PHASE 4: SUMMARY COMPARISON RESULT */}
      {phase === 'summary' && (
        <div className="w-full flex-1 flex flex-col justify-between py-2 animate-fadeIn text-center">
          <div className="my-2">
            <div className="w-12 h-12 rounded-full bg-[#E5ECE0] text-[#485437] flex items-center justify-center mx-auto mb-2 shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#20251B]">
              Resultado del Experimento
            </h3>
            <p className="text-xs text-[#6B7161] mt-0.5">
              Tu sistema nervioso acaba de demostrar su capacidad de autorregulación.
            </p>
          </div>

          {/* Comparative Metrics Card */}
          <div className="my-3 p-5 bg-[#F2ECE1] rounded-3xl border border-[#E0D7C7] flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 items-center">
              {/* Before */}
              <div className="p-3 bg-white/70 rounded-2xl border border-[#E5DDD0]">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#8C5D34]">
                  Nivel Inicial
                </span>
                <p className="text-3xl font-mono font-bold text-[#8C5D34] my-0.5">
                  {beforeLevel}
                  <span className="text-xs text-[#8C9083]">/10</span>
                </p>
                <span className="text-[11px] text-[#696F61] line-clamp-1">
                  {currentBeforeObj.label}
                </span>
              </div>

              {/* After */}
              <div className="p-3 bg-white/70 rounded-2xl border border-[#E5DDD0]">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#556341]">
                  Nivel Actual
                </span>
                <p className="text-3xl font-mono font-bold text-[#556341] my-0.5">
                  {afterLevel}
                  <span className="text-xs text-[#8C9083]">/10</span>
                </p>
                <span className="text-[11px] text-[#696F61] line-clamp-1">
                  {currentAfterObj.label}
                </span>
              </div>
            </div>

            {/* Delta badge */}
            <div className="py-2.5 px-4 rounded-2xl bg-[#E6EDE2] border border-[#CCD8C6] flex items-center justify-center gap-2 text-xs font-semibold text-[#3D4C33]">
              {beforeLevel > afterLevel ? (
                <>
                  <span className="text-base">📉</span>
                  <span>Reducción de {beforeLevel - afterLevel} puntos en la escala de tensión</span>
                </>
              ) : beforeLevel === afterLevel ? (
                <>
                  <span className="text-base">⚖️</span>
                  <span>Estabilidad emocional sostenida durante la marea</span>
                </>
              ) : (
                <>
                  <span className="text-base">🔍</span>
                  <span>Mayor conciencia corporal de la sensación sentida</span>
                </>
              )}
            </div>

            {/* Reinforcing message */}
            <div className="text-xs text-[#525749] leading-relaxed text-left bg-white/50 p-3 rounded-xl border border-[#E3DC CE]">
              <strong className="block text-[#2C3026] mb-1 font-semibold">
                Autorregulación verificada:
              </strong>
              Cuando dejas de pelear contra la emoción y te mantienes presente durante 90 segundos, el sistema nervioso simpático agota su descarga hormonal y el parasimpático retoma el equilibrio.
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleResetAll}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#556341] hover:bg-[#434F33] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Realizar otro experimento de 90s</span>
          </button>
        </div>
      )}
    </div>
  );
};
