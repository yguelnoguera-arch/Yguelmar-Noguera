import React, { useState } from 'react';
import { Wind, Zap, ChevronRight, CheckCircle2, Clock, BookOpen, Sun, Layers, BarChart2, Calendar, Sparkles, Heart } from 'lucide-react';
import { WeekProgram, ReflectionEntry, AssessmentRecord } from '../types';
import { DailyInspirationCard } from './DailyInspirationCard';
import { SOSMode } from './SOSModal';
import { ProgramProgressBanner } from './ProgramProgressBanner';
import { ProgramWeeksView } from './ProgramWeeksView';
import { SomaticSessionsPackView } from './SomaticSessionsPackView';
import { ProgramPractice } from '../data/programWeeksData';
import { SomaticSession } from '../data/somaticSessions';
import { useAuth } from '../context/AuthContext';

type PracticeSubTab = 'program' | 'pack';

interface MainMenuViewProps {
  weeks: WeekProgram[];
  reflections: ReflectionEntry[];
  beforeAssessment: AssessmentRecord | null;
  afterAssessment: AssessmentRecord | null;
  onSelectWeek: (weekNumber: number) => void;
  onSelectPractice: (practice: ProgramPractice) => void;
  onSelectSomaticSession: (session: SomaticSession) => void;
  onOpenSOS: (mode: SOSMode) => void;
  onOpenAssessment: () => void;
  onViewHistory: () => void;
  onOpenAuth: () => void;
  onOpenGratitude?: () => void;
}

export const MainMenuView: React.FC<MainMenuViewProps> = ({
  weeks,
  reflections,
  beforeAssessment,
  afterAssessment,
  onSelectWeek,
  onSelectPractice,
  onSelectSomaticSession,
  onOpenSOS,
  onOpenAssessment,
  onViewHistory,
  onOpenAuth,
  onOpenGratitude,
}) => {
  const { currentActivePractice } = useAuth();
  const [subTab, setSubTab] = useState<PracticeSubTab>('program');

  const handleContinueToday = () => {
    if (currentActivePractice) {
      onSelectPractice(currentActivePractice);
    }
  };

  return (
    <div className="min-h-full pb-24 pt-2 px-4 sm:px-6 max-w-lg mx-auto text-[#2C2F28]">
      {/* Editorial Mindful Welcome */}
      <section className="mb-4 pt-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7A54] uppercase tracking-wider mb-1.5">
          <Sun className="w-3.5 h-3.5" />
          <span>Santuario Somático · Academia del Sistema Nervioso</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#232720] font-normal leading-tight">
          Vuelve a tu Centro
        </h1>
        <p className="text-sm text-[#666B5E] mt-1 leading-relaxed font-light">
          Programa estructurado de 5 semanas con desbloqueo progresivo y biblioteca de 7 sesiones somáticas guiadas.
        </p>
      </section>

      {/* TARJETA DE PROGRESO GAMIFICADO & SINCRONIZACIÓN FIRESTORE */}
      <ProgramProgressBanner
        onOpenAuth={onOpenAuth}
        onContinueToday={handleContinueToday}
      />

      {/* BANNER HORIZONTAL SUTIL Y CÁLIDO: DIARIO SOMÁTICO Y DE GRATITUD */}
      {onOpenGratitude && (
        <button
          onClick={onOpenGratitude}
          className="w-full mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#FAF6ED] via-[#F4EDE0] to-[#ECE3D0] hover:from-[#F4EFE3] hover:to-[#E5DCC9] border border-[#DDD3BC] text-left transition-all shadow-2xs hover:shadow-xs cursor-pointer group flex items-center justify-between gap-3 active:scale-[0.99]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#556341]/12 text-[#485437] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
              <Heart className="w-5 h-5 text-[#556341] fill-[#556341]/25" />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-serif font-bold text-[#232720] truncate">
                ✨ Diario Somático y de Gratitud
              </h3>
              <p className="text-[11px] sm:text-xs text-[#63685A] mt-0.5 truncate font-normal">
                ¿Cómo se siente tu cuerpo hoy?
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[#556341] bg-[#FAF8F4] px-2.5 py-1 rounded-xl border border-[#DDD5C0] shadow-2xs group-hover:bg-[#556341] group-hover:text-white transition-colors">
            <span>Escribir</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
      )}

      {/* SELECTOR DE MODO: PROGRAMA 5 SEMANAS vs PACK 7 SESIONES SOMÁTICAS */}
      <section className="mb-5">
        <div className="grid grid-cols-2 p-1 bg-[#EAE4D7] rounded-2xl border border-[#DDD5C0]">
          <button
            onClick={() => setSubTab('program')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subTab === 'program'
                ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
                : 'text-[#6B7062] hover:text-[#2C2F28]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#6B7A54]" />
            <span>Programa 5 Semanas</span>
          </button>

          <button
            onClick={() => setSubTab('pack')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              subTab === 'pack'
                ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
                : 'text-[#6B7062] hover:text-[#2C2F28]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6B7A54]" />
            <span>Pack 7 Sesiones</span>
          </button>
        </div>
      </section>

      {/* VISTA SEGÚN SUBTAB ACTIVO */}
      {subTab === 'program' ? (
        <section className="mb-6">
          <ProgramWeeksView onSelectPractice={onSelectPractice} />
        </section>
      ) : (
        <section className="mb-6">
          <SomaticSessionsPackView onSelectSession={onSelectSomaticSession} />
        </section>
      )}

      {/* TARJETA DE INSPIRACIÓN DEL DÍA (RESILIENCIA & BOTÓN 🎲) */}
      <DailyInspirationCard />

      {/* DOBLE SOS HERO STRIP */}
      <section className="mb-6 grid grid-cols-2 gap-3">
        {/* SOS Calma (60s) */}
        <div
          onClick={() => onOpenSOS('calma')}
          className="bg-gradient-to-br from-[#EFEAE0] to-[#E5DFC9] border border-[#DDD5C0] rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#556341] text-[#FDFCF9] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Wind className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#556341] bg-[#DFD7C4] px-2 py-0.5 rounded-full">
              60s
            </span>
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-[#232720]">
              SOS Calma
            </h3>
            <p className="text-[11px] text-[#63685A] mt-0.5 leading-snug">
              Exhalación larga y soltar hombros
            </p>
          </div>
        </div>

        {/* SOS Energía (60s) */}
        <div
          onClick={() => onOpenSOS('energia')}
          className="bg-gradient-to-br from-[#F5ECE0] to-[#EBDCCE] border border-[#DFCFC0] rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-xl bg-[#B07234] text-[#FDFCF9] flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#99551D] bg-[#E7D5C5] px-2 py-0.5 rounded-full">
              60s
            </span>
          </div>
          <div>
            <h3 className="text-sm font-serif font-bold text-[#232720]">
              SOS Energía
            </h3>
            <p className="text-[11px] text-[#63685A] mt-0.5 leading-snug">
              Inhalación profunda y postura erguida
            </p>
          </div>
        </div>
      </section>

      {/* AUTOEVALUACIÓN SOMÁTICA ANTES vs DESPUÉS */}
      <section className="mb-6">
        <div
          onClick={onOpenAssessment}
          className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-2xl p-4 flex items-center justify-between shadow-xs hover:shadow-sm hover:border-[#8A9A70] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] text-[#556341] flex items-center justify-center shrink-0 group-hover:bg-[#556341] group-hover:text-[#FDFCF9] transition-colors">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-serif font-medium text-[#232720]">
                  Termómetro Somático (Antes vs. Después)
                </h3>
              </div>
              <p className="text-xs text-[#6B7062] mt-0.5">
                {afterAssessment
                  ? `Bienestar: ${beforeAssessment?.wellbeingPercentage ?? 46}% → ${afterAssessment.wellbeingPercentage}% (+${(afterAssessment.wellbeingPercentage || 0) - (beforeAssessment?.wellbeingPercentage || 46)}%)`
                  : 'Mide tu escala de bienestar antes y después de practicar'}
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8C9082] group-hover:translate-x-0.5 transition-transform" />
        </div>
      </section>

      {/* ACCESO RÁPIDO A BITÁCORA / HISTORIAL */}
      <section>
        <button
          onClick={onViewHistory}
          className="w-full py-3 px-4 rounded-2xl bg-[#EFE9DD]/70 hover:bg-[#EAE3D3] border border-[#DDD5C0] text-xs font-semibold text-[#556341] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>Ver Bitácora Somática ({reflections.length} reflexiones)</span>
        </button>
      </section>
    </div>
  );
};
