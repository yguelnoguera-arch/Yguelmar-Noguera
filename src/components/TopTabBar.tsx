import React from 'react';
import { Compass, ShieldAlert, Sparkles } from 'lucide-react';

export type MainSectionTab = 'practice' | 'somatic';

interface TopTabBarProps {
  activeSection: MainSectionTab;
  onSelectSection: (section: MainSectionTab) => void;
}

export const TopTabBar: React.FC<TopTabBarProps> = ({
  activeSection,
  onSelectSection,
}) => {
  return (
    <div className="px-3 sm:px-4 py-1.5 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#EAE3D3]/80">
      <div className="max-w-md mx-auto grid grid-cols-2 p-1 bg-[#EBE5D8]/80 rounded-2xl gap-1 shadow-2xs">
        {/* Tab 1: Mi Práctica */}
        <button
          onClick={() => onSelectSection('practice')}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
            activeSection === 'practice'
              ? 'bg-[#FDFCF9] text-[#2C2F28] font-semibold shadow-xs'
              : 'text-[#6B7062] hover:text-[#2C2F28]'
          }`}
        >
          <Compass className={`w-3.5 h-3.5 ${activeSection === 'practice' ? 'text-[#556341]' : 'text-[#8C9083]'}`} />
          <span>Mi Práctica</span>
          {activeSection === 'practice' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A54]" />
          )}
        </button>

        {/* Tab 2: Botiquín Somático */}
        <button
          onClick={() => onSelectSection('somatic')}
          className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
            activeSection === 'somatic'
              ? 'bg-[#FDFCF9] text-[#2C2F28] font-semibold shadow-xs'
              : 'text-[#6B7062] hover:text-[#2C2F28]'
          }`}
        >
          <ShieldAlert className={`w-3.5 h-3.5 ${activeSection === 'somatic' ? 'text-[#B07234]' : 'text-[#8C9083]'}`} />
          <span>Botiquín Somático</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
            activeSection === 'somatic'
              ? 'bg-[#B07234]/15 text-[#8A521D]'
              : 'bg-[#DFD8C9] text-[#7A7F70]'
          }`}>
            Rescate
          </span>
        </button>
      </div>
    </div>
  );
};
