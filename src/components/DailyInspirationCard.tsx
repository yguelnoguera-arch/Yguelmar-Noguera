import React, { useState } from 'react';
import { Quote, Dices, Maximize2, Minimize2, X, Sparkles, Volume2, Wind } from 'lucide-react';
import { soundManager } from '../utils/sound';
import { NatureBackground } from './NatureBackground';

export const INSPIRATIONAL_QUOTES: string[] = [
  "No tienes que ganar todas las batallas en un solo día; basta con no rendirte en esta jornada.",
  "La resiliencia no es no sentir dolor, es la decisión silenciosa de seguir adelante a pesar de él.",
  "Has superado el 100% de los días difíciles que creías que no ibas a poder sobrellevar.",
  "Lo que hoy te exige esfuerzo mañana será parte del terreno que ya conquistaste.",
  "Acepta el ritmo lento cuando sea necesario. Detenerse a tomar aire también es parte del camino.",
  "Tu valor no se mide por lo productivo que fuiste hoy, sino por tu entereza para mantenerte en pie.",
  "Las tormentas no duran para siempre, pero la templanza que construyes al atravesarlas se queda contigo.",
  "Confía en tu capacidad de adaptarte: eres más fuerte y flexible de lo que tus dudas te hacen creer.",
  "Un tropiezo no cancela tu avance. Respira, limpia el polvo del camino y da el siguiente paso.",
  "Incluso en los días grises, cada decisión de cuidarte y perseverar cuenta como una victoria.",
];

export const DailyInspirationCard: React.FC = () => {
  const getInitialIndex = () => {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return dayOfYear % INSPIRATIONAL_QUOTES.length;
  };

  const [currentIndex, setCurrentIndex] = useState<number>(getInitialIndex);
  const [isChanging, setIsChanging] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleNextRandomQuote = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsChanging(true);
    soundManager.playBreathCue(true);

    setTimeout(() => {
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length);
      } while (nextIndex === currentIndex && INSPIRATIONAL_QUOTES.length > 1);

      setCurrentIndex(nextIndex);
      setIsChanging(false);
    }, 150);
  };

  const currentQuote = INSPIRATIONAL_QUOTES[currentIndex];

  return (
    <>
      {/* TARJETA DESTACADA COMPACTA CON FONDO NATURAL */}
      <section
        onClick={() => setIsExpanded(true)}
        className="mb-6 relative overflow-hidden rounded-[28px] border border-[#D8C7B0] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer group"
      >
        {/* Fondo fotográfico natural suave de ondas de agua */}
        <NatureBackground variant="water-ripples" opacity={0.35} />

        {/* Capa translúcida cálida */}
        <div className="absolute inset-0 bg-[#FAF7F0]/85 backdrop-blur-[2px]" />

        {/* Contenido flotante */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5A6844] tracking-wide">
              <span className="text-sm">☀️</span>
              <span className="font-serif text-sm font-medium text-[#2E3524]">Inspiración del día</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-[#7A7E70] bg-[#EFE8DC]/80 px-2 py-0.5 rounded-full">
              <span>Tocar para expandir</span>
              <Maximize2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Quote text */}
          <div className="py-1">
            <div className="flex items-start gap-2.5">
              <Quote className="w-4 h-4 text-[#8A9A70] shrink-0 mt-0.5 opacity-80" />
              <p
                className={`text-sm sm:text-[15px] font-serif italic text-[#24291F] leading-relaxed transition-opacity duration-150 ${
                  isChanging ? 'opacity-20' : 'opacity-100'
                }`}
              >
                "{currentQuote}"
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-3 pt-2.5 border-t border-[#DFD7C5]/70 flex items-center justify-between">
            <span className="text-[11px] text-[#757A6C] font-medium">
              Fortaleza y resiliencia
            </span>

            <button
              type="button"
              onClick={handleNextRandomQuote}
              disabled={isChanging}
              className="inline-flex items-center gap-1.5 text-xs text-[#4F593A] hover:text-[#2E3621] bg-[#ECE4D4] hover:bg-[#E2D8C5] active:scale-95 px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer shadow-2xs"
              title="Ver otra frase inspiradora"
            >
              <Dices className={`w-3.5 h-3.5 ${isChanging ? 'animate-spin' : ''}`} />
              <span>Cambiar mensaje 🎲</span>
            </button>
          </div>
        </div>
      </section>

      {/* MODAL / EFECTO EXPANSIVO SOBRE FONDO FOTOGRÁFICO NATURAL */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1C16]/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-[36px] overflow-hidden border border-[#ECD7BE]/50 shadow-2xl text-[#2C2F28] p-6 sm:p-8 flex flex-col justify-between min-h-[440px]">
            {/* Fondo natural fotográfico inmersivo de atardecer / agua */}
            <NatureBackground variant="water-ripples" opacity={0.65} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/90 via-[#FDF7EE]/85 to-[#F5ECE0]/95 backdrop-blur-[3px]" />

            {/* Header del modal */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#E6DAC8]">
              <div className="flex items-center gap-2">
                <span className="text-lg">☀️</span>
                <span className="text-xs uppercase tracking-widest font-bold text-[#556341]">
                  Pausa Contemplativa
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="w-9 h-9 rounded-2xl bg-[#EBE3D3] hover:bg-[#DDD2BE] text-[#3F4734] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Cerrar vista expansiva"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Frase en tipografía grande y elegante */}
            <div className="relative z-10 my-auto py-8 text-center px-2">
              <Quote className="w-8 h-8 text-[#8A9A70]/60 mx-auto mb-4" />
              <blockquote
                className={`text-2xl sm:text-3xl font-serif italic text-[#22271E] leading-relaxed transition-opacity duration-200 ${
                  isChanging ? 'opacity-20' : 'opacity-100'
                }`}
              >
                "{currentQuote}"
              </blockquote>
              <p className="text-xs uppercase tracking-widest text-[#7E8373] mt-6 font-medium">
                Vuelve a tu Centro · Reflexión Diaria
              </p>
            </div>

            {/* Controles al pie */}
            <div className="relative z-10 pt-4 border-t border-[#E6DAC8] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleNextRandomQuote}
                className="flex-1 h-12 rounded-2xl bg-[#556341] hover:bg-[#475436] active:scale-95 text-[#FDFCF9] font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Dices className={`w-4 h-4 ${isChanging ? 'animate-spin' : ''}`} />
                <span>Cambiar mensaje 🎲</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="h-12 px-5 rounded-2xl bg-[#EBE3D3] hover:bg-[#DFD5C2] text-[#383F30] font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
