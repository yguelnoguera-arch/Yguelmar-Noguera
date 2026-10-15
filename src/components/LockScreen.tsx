import React, { useState } from 'react';
import { Lock, Sparkles, KeyRound, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface LockScreenProps {
  onUnlock: () => void;
}

const REQUIRED_CODE = 'CENTRO2026';

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim().toUpperCase();

    if (cleanCode === REQUIRED_CODE) {
      setError(false);
      setIsSuccess(true);
      soundManager.playUnlock();
      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      setError(true);
      setErrorMessage(
        cleanCode.length === 0
          ? 'Por favor, introduce el código de acceso.'
          : 'Código incorrecto. Recuerda usar: CENTRO2026'
      );
      // Soft vibration on mobile if available
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }
    }
  };

  const handleFillDemoCode = () => {
    setCode(REQUIRED_CODE);
    setError(false);
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-between px-6 py-10 bg-gradient-to-b from-[#F7F5F0] via-[#F2EDE4] to-[#EBE4D8] text-[#2C2F28] select-none">
      {/* Top calm header */}
      <div className="w-full max-w-sm flex items-center justify-between pt-2">
        <span className="text-xs tracking-widest uppercase font-medium text-[#7A7D70]">
          Santuario Personal
        </span>
        <div className="flex items-center gap-1.5 text-xs text-[#6B7A54] font-medium bg-[#E8E4DA] px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Acceso Privado</span>
        </div>
      </div>

      {/* Main emblem and title */}
      <div className="w-full max-w-sm flex flex-col items-center text-center my-auto py-6">
        {/* Concentric zen rings */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute w-32 h-32 rounded-full border border-[#8A9A70]/30 animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full border border-[#6B7A54]/25" />
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8A9A70] to-[#556341] flex items-center justify-center shadow-md shadow-[#6B7A54]/20 text-[#FAF8F5]">
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-wide text-[#232720] mb-2">
          Vuelve a tu Centro
        </h1>
        <p className="text-sm text-[#666A5D] max-w-xs font-light leading-relaxed mb-6">
          Un espacio diario para pausar el piloto automático, respirar y escuchar las sensaciones de tu cuerpo.
        </p>

        {/* Access Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              type="text"
              autoFocus
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (error) setError(false);
              }}
              placeholder="Código de acceso"
              aria-label="Código de acceso"
              className={`w-full h-13 px-4 text-center tracking-widest text-lg font-mono font-medium rounded-2xl bg-[#FDFCF9] border transition-all duration-200 outline-none placeholder:text-[#A7A99F] placeholder:font-sans placeholder:tracking-normal placeholder:text-sm text-[#2C2F28] ${
                error
                  ? 'border-amber-600/80 ring-2 ring-amber-600/20 bg-amber-50/40 animate-[shake_0.4s_ease-in-out]'
                  : isSuccess
                  ? 'border-[#6B7A54] ring-2 ring-[#6B7A54]/30'
                  : 'border-[#D9D3C7] focus:border-[#6B7A54] focus:ring-2 focus:ring-[#6B7A54]/20'
              }`}
            />
          </div>

          {error && (
            <p className="text-xs text-amber-800 font-medium bg-amber-100/60 py-1.5 px-3 rounded-lg text-center animate-fadeIn">
              {errorMessage}
            </p>
          )}

          {isSuccess && (
            <p className="text-xs text-[#556341] font-medium bg-[#E6ECE0] py-1.5 px-3 rounded-lg text-center">
              Acceso verificado. Bienvenido a tu espacio.
            </p>
          )}

          <button
            type="submit"
            disabled={isSuccess}
            className="w-full h-12 rounded-2xl bg-[#556341] hover:bg-[#485437] active:scale-[0.98] text-[#FDFCF9] font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-150 cursor-pointer"
          >
            <span>{isSuccess ? 'Abriendo espacio...' : 'Entrar a la Práctica'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo fast-fill shortcut button */}
        <div className="mt-5 w-full pt-4 border-t border-[#DFD8CC]">
          <button
            type="button"
            onClick={handleFillDemoCode}
            className="inline-flex items-center gap-1.5 text-xs text-[#556341] hover:text-[#3B452D] bg-[#E8E2D5] hover:bg-[#DFD8C9] px-3 py-1.5 rounded-full transition-colors font-medium cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Código de muestra: <strong>CENTRO2026</strong> (Tocar para aplicar)</span>
          </button>
        </div>
      </div>

      {/* Footer subtle tip */}
      <div className="w-full max-w-sm text-center pt-4">
        <p className="text-[11px] text-[#868A7E] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#6B7A54]" />
          <span>Diseñado para momentos de pausa y calma consciente</span>
        </p>
      </div>
    </div>
  );
};
