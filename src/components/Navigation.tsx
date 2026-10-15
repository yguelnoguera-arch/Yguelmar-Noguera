import React from 'react';
import { Compass, Wind, Heart, Layers, BarChart3 } from 'lucide-react';
import { SOSMode } from './SOSModal';

export type NavTab = 'home' | 'gratitude' | 'week' | 'sos' | 'history';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeWeekNumber: number;
  reflectionsCount: number;
  onTriggerSOS: (mode: SOSMode) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  activeWeekNumber,
  reflectionsCount,
  onTriggerSOS,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md border-t border-[#EAE3D3] pb-safe">
      <div className="max-w-lg mx-auto grid grid-cols-4 items-center h-16 px-2">
        {/* Tab 1: 5 Semanas Menu */}
        <button
          onClick={() => onSelectTab('home')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-all cursor-pointer relative py-1 rounded-2xl ${
            activeTab === 'home'
              ? 'text-[#485437]'
              : 'text-[#7B7F72] hover:text-[#383C2F]'
          }`}
        >
          <Compass
            className={`w-5 h-5 transition-transform ${
              activeTab === 'home' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
            }`}
          />
          <span
            className={`text-[10px] tracking-tight mt-1 whitespace-nowrap transition-colors ${
              activeTab === 'home' ? 'font-semibold text-[#485437]' : 'font-normal'
            }`}
          >
            5 Semanas
          </span>
          {activeTab === 'home' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A54] mt-0.5" />
          )}
        </button>

        {/* Tab 2: Acceso Directo Diario de Gratitud */}
        <button
          onClick={() => onSelectTab('gratitude')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-all cursor-pointer relative py-1 rounded-2xl ${
            activeTab === 'gratitude'
              ? 'text-[#485437]'
              : 'text-[#7B7F72] hover:text-[#383C2F]'
          }`}
          title="Abrir Diario de Gratitud y Estado de Ánimo"
        >
          <Heart
            className={`w-5 h-5 transition-transform text-[#6B7A54] ${
              activeTab === 'gratitude' ? 'scale-110 fill-[#6B7A54]/30 stroke-[2.2]' : 'stroke-[1.8]'
            }`}
          />
          <span
            className={`text-[10px] tracking-tight mt-1 whitespace-nowrap transition-colors ${
              activeTab === 'gratitude' ? 'font-semibold text-[#485437]' : 'font-medium'
            }`}
          >
            Gratitud
          </span>
          {activeTab === 'gratitude' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A54] mt-0.5" />
          )}
        </button>

        {/* Tab 3: SOS Calma (60s) Trigger */}
        <button
          onClick={() => onTriggerSOS('calma')}
          className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-all cursor-pointer relative py-1 rounded-2xl text-[#556341] hover:text-[#383C2F]"
        >
          <div className="w-6 h-6 rounded-full bg-[#6B7A54]/20 flex items-center justify-center text-[#556341]">
            <Wind className="w-4 h-4 animate-pulse stroke-[2.2]" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 font-bold text-[#556341] whitespace-nowrap">
            SOS (60s)
          </span>
        </button>

        {/* Tab 4: History & Charts */}
        <button
          onClick={() => onSelectTab('history')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-all cursor-pointer relative py-1 rounded-2xl ${
            activeTab === 'history'
              ? 'text-[#485437]'
              : 'text-[#7B7F72] hover:text-[#383C2F]'
          }`}
        >
          <div className="relative">
            <BarChart3
              className={`w-5 h-5 transition-transform ${
                activeTab === 'history' ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
              }`}
            />
            {reflectionsCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#6B7A54] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {reflectionsCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] tracking-tight mt-1 whitespace-nowrap transition-colors ${
              activeTab === 'history' ? 'font-semibold text-[#485437]' : 'font-normal'
            }`}
          >
            Historial
          </span>
          {activeTab === 'history' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A54] mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
