import React, { useState } from 'react';
import { Lock, CheckCircle2, Play, Sparkles, Clock, Award, Sliders } from 'lucide-react';
import { PROGRAM_WEEKS, ProgramWeek, ProgramPractice } from '../data/programWeeksData';
import { useAuth } from '../context/AuthContext';

interface ProgramWeeksViewProps {
  onSelectPractice: (practice: ProgramPractice) => void;
}

export const ProgramWeeksView: React.FC<ProgramWeeksViewProps> = ({ onSelectPractice }) => {
  const {
    isPracticeUnlocked,
    isPracticeCompleted,
    isWeekUnlocked,
    isWeekCompleted,
    activeWeekNumber,
    currentActivePractice,
  } = useAuth();

  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(() => activeWeekNumber || 1);

  const selectedWeek: ProgramWeek =
    PROGRAM_WEEKS.find((w) => w.weekNumber === selectedWeekNumber) || PROGRAM_WEEKS[0];

  const isCurrentWeekLocked = !isWeekUnlocked(selectedWeekNumber);

  return (
    <div className="space-y-4">
      {/* 5-Week Selector Tabs */}
      <div className="grid grid-cols-5 gap-1.5 bg-[#EFE9DD]/90 p-1.5 rounded-2xl border border-[#DDD5C0]">
        {PROGRAM_WEEKS.map((week) => {
          const unlocked = isWeekUnlocked(week.weekNumber);
          const completed = isWeekCompleted(week.weekNumber);
          const isSelected = selectedWeekNumber === week.weekNumber;
          const practicesCompletedCount = week.practices.filter((p) => isPracticeCompleted(p.id)).length;

          return (
            <button
              key={week.weekNumber}
              onClick={() => setSelectedWeekNumber(week.weekNumber)}
              className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer relative flex flex-col items-center justify-center ${
                isSelected
                  ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs border border-[#DDD5C0] font-bold'
                  : unlocked
                  ? 'text-[#5E6354] hover:text-[#2C2F28] hover:bg-[#FDFCF9]/60 font-medium'
                  : 'text-[#9A9E90] opacity-70 hover:opacity-90 font-normal'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-[11px] sm:text-xs">Sem {week.weekNumber}</span>
                {completed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />
                ) : !unlocked ? (
                  <Lock className="w-2.5 h-2.5 text-[#8C9082] shrink-0" />
                ) : null}
              </div>
              <span className="text-[9px] text-[#7A7E72] mt-0.5">
                {practicesCompletedCount}/{week.practices.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Week Header Context */}
      <div className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#556341] bg-[#EDE7D9] px-2.5 py-0.5 rounded-full">
                {selectedWeek.pillar}
              </span>
              {isWeekCompleted(selectedWeek.weekNumber) && (
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Semana completada
                </span>
              )}
              {isCurrentWeekLocked && (
                <span className="text-[10px] font-semibold text-amber-900 bg-amber-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Bloqueada (Completa la Semana {selectedWeek.weekNumber - 1})
                </span>
              )}
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#232720] mt-1">
              {selectedWeek.name}
            </h3>
            <p className="text-xs text-[#666B5E] mt-1.5 leading-relaxed font-light">
              {selectedWeek.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Practices List with Progressive Unlocking */}
      <div className="space-y-3">
        {selectedWeek.practices.map((practice) => {
          const unlocked = isPracticeUnlocked(practice.id);
          const completed = isPracticeCompleted(practice.id);
          const isCurrentToday = practice.id === currentActivePractice?.id;

          return (
            <div
              key={practice.id}
              onClick={() => {
                if (unlocked) {
                  onSelectPractice(practice);
                }
              }}
              className={`rounded-2xl p-4 sm:p-5 border transition-all duration-200 relative ${
                unlocked
                  ? isCurrentToday
                    ? 'bg-[#FAF8F4] border-[#8A9A70] shadow-sm hover:shadow-md cursor-pointer ring-1 ring-[#8A9A70]/50'
                    : 'bg-[#FAF8F4] border-[#E5DFCF] hover:border-[#9AAB82] shadow-2xs hover:shadow-sm cursor-pointer'
                  : 'bg-[#EAE4D7]/50 border-[#D8D0BE]/70 opacity-60 select-none cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Top Tags */}
                  <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        unlocked
                          ? isCurrentToday
                            ? 'bg-[#556341] text-[#FDFCF9]'
                            : 'bg-[#EAE3D3] text-[#556341]'
                          : 'bg-[#DDD5C3] text-[#7A7E72]'
                      }`}
                    >
                      Práctica {practice.practiceOrder}
                    </span>

                    {practice.hasMeasurement && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#825732] bg-[#F2E5D5] px-2 py-0.5 rounded-full">
                        <Sliders className="w-2.5 h-2.5" />
                        {practice.measurementLabel || 'Medición 1-10'}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#7A7E72] bg-[#EFE9DC] px-2 py-0.5 rounded-full">
                      <Clock className="w-2.5 h-2.5" />
                      ⏱ {practice.durationMinutes} min
                    </span>

                    {completed && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full ml-auto">
                        <CheckCircle2 className="w-3 h-3" />
                        Completada
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h4
                    className={`text-base font-serif font-medium leading-snug ${
                      unlocked ? 'text-[#232720] hover:text-[#434F30]' : 'text-[#7A7E72]'
                    }`}
                  >
                    {practice.title}
                  </h4>
                  <p className="text-xs text-[#6B7062] mt-1 leading-relaxed line-clamp-2">
                    {practice.subtitle}
                  </p>

                  {/* Focus */}
                  <p className="text-[11px] text-[#8A9A70] font-medium mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>{practice.focus}</span>
                  </p>
                </div>

                {/* Right Action / Lock Icon */}
                <div className="shrink-0 pt-1">
                  {completed ? (
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-2xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : unlocked ? (
                    <button
                      className="w-10 h-10 rounded-2xl bg-[#EDE7D9] hover:bg-[#556341] text-[#556341] hover:text-[#FDFCF9] flex items-center justify-center transition-all shadow-2xs hover:scale-105 cursor-pointer"
                      title="Iniciar práctica guiada"
                    >
                      <Play className="w-4 h-4 ml-0.5 fill-current" />
                    </button>
                  ) : (
                    <div
                      className="w-10 h-10 rounded-2xl bg-[#DCD4C2] text-[#8C9082] flex items-center justify-center shadow-2xs"
                      title="Completa la práctica anterior para desbloquear"
                    >
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
