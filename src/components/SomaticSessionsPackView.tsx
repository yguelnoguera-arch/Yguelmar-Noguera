import React from 'react';
import { Play, Sparkles, Clock, Volume2 } from 'lucide-react';
import { SomaticSession, SOMATIC_SESSIONS } from '../data/somaticSessions';

interface SomaticSessionsPackViewProps {
  onSelectSession: (session: SomaticSession) => void;
}

export const SomaticSessionsPackView: React.FC<SomaticSessionsPackViewProps> = ({
  onSelectSession,
}) => {
  return (
    <div className="space-y-4">
      {/* Editorial Header */}
      <div className="px-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6B7A54] mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Biblioteca Somática & Autosugestión</span>
        </div>
        <h3 className="font-serif text-2xl font-normal text-[#232720]">
          Pack de {SOMATIC_SESSIONS.length} Sesiones Somáticas
        </h3>
        <p className="text-xs text-[#6B7062] mt-1 leading-relaxed">
          Prácticas guiadas de 3 minutos con voz masculina natural, selector libre de ambiente acústico y 2 nuevas meditaciones de autosugestión positiva en ondas alfa.
        </p>
      </div>

      {/* Grid / Stack of 7 Sessions */}
      <div className="space-y-3">
        {SOMATIC_SESSIONS.map((session) => {
          return (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className="group bg-[#FAF8F4] border border-[#E5DFCF] hover:border-[#8A9A70] rounded-3xl p-4 sm:p-5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md relative overflow-hidden"
            >
              {/* Subtle accent tone bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8A9A70]/40 to-transparent group-hover:via-[#8A9A70] transition-all"
              />

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  {/* Top Badges Row */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-lg select-none">{session.emoji}</span>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4E5A36] bg-[#EDE7D9] px-2.5 py-0.5 rounded-full">
                      {session.ambientFrequencyBadge}
                    </span>

                    <span className="text-xs text-[#A3A69C]">·</span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#5E6354] bg-[#EFE9DC] px-2 py-0.5 rounded-full">
                      <Clock className="w-2.5 h-2.5" />
                      ⏱ {session.durationMinutes} min
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-serif font-medium text-[#232720] group-hover:text-[#434F30] transition-colors leading-snug">
                    {session.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-[#666B5E] mt-1 leading-relaxed line-clamp-2">
                    {session.description}
                  </p>

                  {/* Ambient sound footer pill */}
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-[#6B7A54]">
                    <Volume2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{session.ambientLabel}</span>
                  </div>
                </div>

                {/* Play Action Button */}
                <div className="w-10 h-10 rounded-2xl bg-[#EDE7D9] group-hover:bg-[#556341] text-[#556341] group-hover:text-[#FDFCF9] flex items-center justify-center transition-all shrink-0 mt-1 shadow-2xs group-hover:scale-105">
                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
