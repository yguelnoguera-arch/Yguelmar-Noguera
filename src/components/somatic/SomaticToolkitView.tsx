import React, { useState } from 'react';
import { HeartPulse, Wind, Waves, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';
import { VagalPacer } from './VagalPacer';
import { PhysiologicalSigh } from './PhysiologicalSigh';
import { NinetySecondExperiment } from './NinetySecondExperiment';

export type SomaticToolId = 'vagal' | 'sigh' | 'experiment90';

interface ToolMeta {
  id: SomaticToolId;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  durationLabel: string;
  indication: string;
}

const TOOLS: ToolMeta[] = [
  {
    id: 'vagal',
    name: 'Pacer Vagal',
    tagline: '4 - 2 - 6 / Pausa de 3',
    icon: <HeartPulse className="w-4 h-4" />,
    durationLabel: '36s a 5 min',
    indication: 'Ralentiza el corazón y calma la agitación mental',
  },
  {
    id: 'sigh',
    name: 'Suspiro Fisiológico',
    tagline: 'Doble inhalación + exhalación',
    icon: <Wind className="w-4 h-4" />,
    durationLabel: '1 minuto',
    indication: 'Desbloquea el pecho y descarga el estrés agudo',
  },
  {
    id: 'experiment90',
    name: 'Experimento 90s',
    tagline: 'Termómetro + ola biológica',
    icon: <Waves className="w-4 h-4" />,
    durationLabel: '90 segundos',
    indication: 'Acompaña la cresta hormonal sin alimentarla',
  },
];

export const SomaticToolkitView: React.FC = () => {
  const [activeTool, setActiveTool] = useState<SomaticToolId>('vagal');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const currentToolMeta = TOOLS.find((t) => t.id === activeTool) || TOOLS[0];

  return (
    <div className="px-4 py-4 sm:px-6 space-y-4 max-w-2xl mx-auto pb-24">
      {/* Intro Header */}
      <div className="bg-[#FAF8F4] p-4 sm:p-5 rounded-3xl border border-[#EAE3D3] shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6B7A54]/20 text-[#485437] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#232720]">
                Botiquín Somático
              </h2>
              <p className="text-[11px] text-[#6E7364]">
                Regulación fisiológica y rescate del sistema nervioso
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="flex items-center gap-1 text-xs text-[#556341] hover:text-[#232720] px-2.5 py-1.5 rounded-xl bg-[#EFECE5] transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium">{showGuide ? 'Ocultar guía' : 'Cuándo usar'}</span>
          </button>
        </div>

        {/* When to use guide collapsible */}
        {showGuide && (
          <div className="mt-3 pt-3 border-t border-[#EAE3D3] text-xs text-[#4E5445] space-y-2 animate-fadeIn">
            <div className="p-2.5 bg-[#F2EDE2] rounded-xl flex items-start gap-2">
              <span className="font-bold text-[#485437]">🫁 Pacer Vagal (4-2-6):</span>
              <span>Ideal para momentos de sobrepensamiento, ansiedad anticipatoria o para conciliar el sueño.</span>
            </div>
            <div className="p-2.5 bg-[#F2EDE2] rounded-xl flex items-start gap-2">
              <span className="font-bold text-[#8A521D]">🌬️ Suspiro Fisiológico:</span>
              <span>Ideal ante una subida repentina de angustia, sensación de ahogo o tras recibir una mala noticia.</span>
            </div>
            <div className="p-2.5 bg-[#F2EDE2] rounded-xl flex items-start gap-2">
              <span className="font-bold text-[#245369]">🌊 Experimento de 90s:</span>
              <span>Ideal frente a una emoción reactiva intensa (ira, frustración, impulso) antes de responder.</span>
            </div>
          </div>
        )}

        {/* Minimalist 3-Tool Tab Switcher */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 pt-3 border-t border-[#EAE3D3]">
          {TOOLS.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all cursor-pointer text-center relative ${
                  isActive
                    ? 'bg-[#556341] text-[#FDFCF9] shadow-sm'
                    : 'bg-[#EFECE6]/80 text-[#606657] hover:bg-[#E5E0D4]'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`${isActive ? 'text-white' : 'text-[#556341]'}`}>
                    {tool.icon}
                  </span>
                  <span className="text-xs font-semibold truncate">{tool.name}</span>
                </div>
                <span
                  className={`text-[10px] ${
                    isActive ? 'text-[#DEE6D5]' : 'text-[#7F8475]'
                  }`}
                >
                  {tool.durationLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Tool Render */}
      <div className="transition-all duration-300">
        {activeTool === 'vagal' && <VagalPacer />}
        {activeTool === 'sigh' && <PhysiologicalSigh />}
        {activeTool === 'experiment90' && <NinetySecondExperiment />}
      </div>
    </div>
  );
};
