import React from 'react';
import { CheckCircle2, Lock, Sparkles, Cloud, CloudOff, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PROGRAM_WEEKS } from '../data/programWeeksData';

interface ProgramProgressBannerProps {
  onOpenAuth: () => void;
  onContinueToday: () => void;
}

export const ProgramProgressBanner: React.FC<ProgramProgressBannerProps> = ({
  onOpenAuth,
  onContinueToday,
}) => {
  const {
    currentUser,
    activeWeekNumber,
    completedPracticesCount,
    totalPracticesCount,
    progressPercentage,
    currentActivePractice,
    isSyncing,
  } = useAuth();

  const isFinished = completedPracticesCount >= totalPracticesCount;
  const currentWeek = PROGRAM_WEEKS.find((w) => w.weekNumber === activeWeekNumber) || PROGRAM_WEEKS[0];

  return (
    <div className="bg-gradient-to-br from-[#FAF8F4] via-[#F4EFE6] to-[#EBE4D5] border border-[#DDD5C0] rounded-3xl p-4 sm:p-5 shadow-xs mb-5 relative overflow-hidden">
      {/* Decorative ambient subtle circle */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#8A9A70]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#556341] bg-[#DFD7C4] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#6B7A54]" />
            Programa 5 Semanas (Semana {activeWeekNumber} de 5)
          </span>
          <span className="hidden sm:inline text-xs font-serif text-[#666B5E]">
            {currentWeek.pillar}
          </span>
        </div>

        {/* Cloud Sync / Auth Status */}
        {currentUser ? (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 text-[11px] font-medium text-[#4B5539] hover:text-[#232720] bg-[#EAE3D3]/80 hover:bg-[#E0D8C5] px-2.5 py-1 rounded-full transition-all cursor-pointer"
            title="Progreso sincronizado en Firestore"
          >
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Usuario'}
                className="w-4 h-4 rounded-full object-cover"
              />
            ) : (
              <Cloud className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-pulse' : ''}`} />
            )}
            <span className="truncate max-w-[85px] sm:max-w-[110px]">
              {currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Sincronizado'}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#556341] hover:text-[#232720] bg-[#DFD7C4]/90 hover:bg-[#D5CBAD] px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-2xs"
            title="Inicia sesión con Google para guardar tu progreso"
          >
            <CloudOff className="w-3.5 h-3.5 text-[#7A7E72]" />
            <span>Guardar en nube</span>
          </button>
        )}
      </div>

      {/* Progress Count & Percentage */}
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#232720] font-normal">
            {completedPracticesCount} de {totalPracticesCount} prácticas completadas
          </h2>
          <p className="text-xs text-[#6B7062] mt-0.5">
            {isFinished
              ? '¡Felicidades! Has completado las 5 semanas de maestría somática.'
              : `Práctica activa: ${currentActivePractice?.title || 'Disponible hoy'}`}
          </p>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-serif font-bold text-[#556341]">
            {progressPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="w-full h-2.5 bg-[#DDD5C0] rounded-full overflow-hidden p-0.5 mb-3.5">
        <div
          className="h-full bg-gradient-to-r from-[#6B7A54] to-[#8A9A70] rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.max(4, progressPercentage)}%` }}
        />
      </div>

      {/* Primary Action Button */}
      {!isFinished && currentActivePractice && (
        <button
          onClick={onContinueToday}
          className="w-full py-2.5 px-4 bg-[#556341] hover:bg-[#434F30] text-[#FDFCF9] font-medium text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-[0.99]"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Continuar práctica: {currentActivePractice.title}</span>
        </button>
      )}

      {isFinished && (
        <div className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-100/90 text-emerald-900 rounded-xl text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>Programa completado con éxito. Tu centro somático está consolidado.</span>
        </div>
      )}
    </div>
  );
};
