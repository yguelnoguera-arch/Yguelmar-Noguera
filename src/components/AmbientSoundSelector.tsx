import React, { useState } from 'react';
import {
  CloudRain,
  Droplets,
  Trees,
  Waves,
  Radio,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import {
  soundManager,
  AMBIENT_SOUND_OPTIONS,
  AmbientSoundId,
  AmbientSoundOption
} from '../utils/sound';

interface AmbientSoundSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentSoundId: AmbientSoundId;
  isPlaying: boolean;
  onSelectSound: (id: AmbientSoundId) => void;
  onTogglePlay: () => void;
}

export const AmbientSoundSelector: React.FC<AmbientSoundSelectorProps> = ({
  isOpen,
  onClose,
  currentSoundId,
  isPlaying,
  onSelectSound,
  onTogglePlay
}) => {
  const [volume, setVolume] = useState<number>(soundManager.volume);

  if (!isOpen) return null;

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundManager.setVolume(val);
  };

  const getIcon = (iconName: string, active: boolean) => {
    const className = `w-5 h-5 ${active ? 'text-[#3E4F39]' : 'text-stone-500'}`;
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Trees':
        return <Trees className={className} />;
      case 'Waves':
        return <Waves className={className} />;
      default:
        return <Radio className={className} />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/45 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#FBF9F5] border border-[#E3DECE] sm:rounded-3xl rounded-t-3xl shadow-2xl p-5 sm:p-6 pb-8 sm:pb-6 space-y-5 animate-slideUp max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DA]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E5ECE1] flex items-center justify-center text-[#3E4F39]">
              <CloudRain className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-800 leading-tight">
                Sonidos de la Naturaleza
              </h3>
              <p className="text-xs text-stone-500">
                Selecciona tu atmósfera de calma continua
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
            aria-label="Cerrar selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient options list */}
        <div className="space-y-2">
          {AMBIENT_SOUND_OPTIONS.map((opt: AmbientSoundOption) => {
            const isSelected = currentSoundId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  soundManager.resumeContext();
                  onSelectSound(opt.id);
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-[#EBF1E8] border-[#8EA685] shadow-sm'
                    : 'bg-white border-[#E9E5DB] hover:bg-stone-50 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#3E4F39] text-white shadow-sm'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {getIcon(opt.iconName, isSelected)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-stone-800 truncate">
                        {opt.title}
                      </span>
                      {opt.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#DCE7D6] text-[#33462E] font-medium shrink-0">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 truncate mt-0.5">
                      {opt.subtitle}
                    </p>
                    {opt.soundSignature && (
                      <span className="inline-block mt-1 text-[10px] text-[#4F5D44] bg-[#E3EBDD] px-2 py-0.5 rounded-md font-mono">
                        {opt.soundSignature}
                      </span>
                    )}
                  </div>
                </div>

                <div className="shrink-0 ml-2">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#3E4F39] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-stone-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Volume & Quick Master Controls */}
        <div className="pt-2 space-y-3 bg-[#F4F1EA] p-4 rounded-2xl border border-[#E6E1D3]">
          <div className="flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Volume2 className="w-4 h-4 text-stone-500" />
              Volumen de fondo sutil (Ducking)
            </span>
            <span className="font-mono text-stone-700">
              {Math.round((volume / 0.05) * 50)}%
            </span>
          </div>
          <input
            type="range"
            min="0.02"
            max="0.08"
            step="0.005"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full accent-[#3E4F39] h-2 bg-stone-300 rounded-lg cursor-pointer"
            aria-label="Ajustar volumen"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                soundManager.resumeContext();
                onTogglePlay();
              }}
              className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm ${
                isPlaying
                  ? 'bg-[#3E4F39] text-white hover:bg-[#32402E]'
                  : 'bg-white text-stone-800 border border-stone-300 hover:bg-stone-50'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pausar sonido ambiental
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Reproducir ambiente ahora
                </>
              )}
            </button>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 text-xs text-stone-500 hover:text-stone-700 transition-colors text-center"
        >
          Listo · Mantener sonido en segundo plano
        </button>
      </div>
    </div>
  );
};
