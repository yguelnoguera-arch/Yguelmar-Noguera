import React from 'react';
import { Volume2, VolumeX, Lock, Wind, Zap, ChevronLeft } from 'lucide-react';
import { SOSMode } from './SOSModal';

interface HeaderProps {
  onLockApp: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileDeviceFrame: boolean;
  onToggleDeviceFrame: () => void;
  onOpenSOS: (mode: SOSMode) => void;
  // Optional active context
  activeWeekNumber?: number;
  onBackToMenu?: () => void;
  showBackToMenu?: boolean;
  onOpenAuth?: () => void;
  userPhotoUrl?: string | null;
  userName?: string | null;
  isAuthenticated?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onLockApp,
  soundEnabled,
  onToggleSound,
  onOpenSOS,
  activeWeekNumber = 1,
  onBackToMenu,
  showBackToMenu = false,
  onOpenAuth,
  userPhotoUrl,
  userName,
  isAuthenticated = false,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md border-b border-[#EAE3D3] px-3 sm:px-4 py-2.5 flex items-center justify-between shadow-2xs">
      {/* Zona Izquierda: Marca o Botón de Retorno "Semana X - Volver al menú" */}
      <div className="flex items-center gap-1.5 shrink-0">
        {showBackToMenu && onBackToMenu ? (
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-1 text-xs font-semibold text-[#556341] hover:text-[#232720] bg-[#EFE9DD]/80 hover:bg-[#E4DEC3] px-2.5 py-1.5 rounded-xl transition-all cursor-pointer active:scale-95"
            title="Volver al menú de 5 semanas"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="font-serif">Semana {activeWeekNumber} - Volver al menú</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#6B7A54] to-[#8A9A70] flex items-center justify-center text-white text-[11px] font-serif font-bold shadow-2xs">
              C
            </div>
            <span className="text-sm sm:text-base font-serif font-medium tracking-tight text-[#232720] whitespace-nowrap">
              Vuelve a tu Centro
            </span>
          </div>
        )}
      </div>

      {/* Zona Derecha: DOBLE BOTÓN SOS ANCLADO FIJO ("Calma" y "Energía") */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Botón SOS Calma */}
        <button
          onClick={() => onOpenSOS('calma')}
          className="h-8 px-2 sm:px-2.5 rounded-xl bg-[#6B7A54] hover:bg-[#556341] text-[#FDFCF9] flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
          title="SOS Calma (60s): Estrés y ansiedad"
        >
          <Wind className="w-3.5 h-3.5 animate-pulse shrink-0" />
          <span>Calma</span>
        </button>

        {/* Botón SOS Energía */}
        <button
          onClick={() => onOpenSOS('energia')}
          className="h-8 px-2 sm:px-2.5 rounded-xl bg-[#B07234] hover:bg-[#99551D] text-[#FDFCF9] flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
          title="SOS Energía (60s): Agotamiento y bloqueo"
        >
          <Zap className="w-3.5 h-3.5 shrink-0" />
          <span>Energía</span>
        </button>



        {/* Sonido */}
        <button
          onClick={onToggleSound}
          className="w-8 h-8 rounded-xl bg-[#EBE5D8]/80 hover:bg-[#E0D9CB] text-[#556341] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title={soundEnabled ? 'Silenciar campanadas' : 'Activar campanadas'}
          aria-label={soundEnabled ? 'Silenciar campanadas' : 'Activar campanadas'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-[#8C9083]" />}
        </button>

        {/* Bloqueo */}
        <button
          onClick={onLockApp}
          className="w-8 h-8 rounded-xl bg-[#EBE5D8]/80 hover:bg-[#E0D9CB] text-[#556341] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          title="Bloquear pantalla"
          aria-label="Bloquear"
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
