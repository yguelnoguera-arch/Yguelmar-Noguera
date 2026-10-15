import React, { useState, useEffect } from 'react';
import {
  X,
  Cloud,
  LogOut,
  RotateCcw,
  CheckCircle2,
  User as UserIcon,
  Heart,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  BookMarked
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  GratitudeEntry,
  saveGratitudeEntryToFirestore,
  loadGratitudeEntriesFromFirestore,
  deleteGratitudeEntryFromFirestore
} from '../lib/firebase';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ModalTab;
}

type ModalTab = 'profile' | 'gratitude';

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  bgActive: string;
  borderActive: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { id: 'calma', emoji: '😌', label: 'Calma', bgActive: 'bg-emerald-100/90 text-emerald-900', borderActive: 'border-emerald-600' },
  { id: 'gratitud', emoji: '✨', label: 'Gratitud', bgActive: 'bg-amber-100/90 text-amber-900', borderActive: 'border-amber-600' },
  { id: 'serenidad', emoji: '🌿', label: 'Serenidad', bgActive: 'bg-lime-100/90 text-lime-900', borderActive: 'border-lime-600' },
  { id: 'energia', emoji: '☀️', label: 'Energía', bgActive: 'bg-orange-100/90 text-orange-900', borderActive: 'border-orange-600' },
  { id: 'paz', emoji: '🤍', label: 'Paz', bgActive: 'bg-purple-100/90 text-purple-900', borderActive: 'border-purple-600' },
];

const LOCAL_GRATITUDE_KEY = 'vuelve_centro_gratitude_entries_v1';

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile'
}) => {
  const {
    currentUser,
    signInWithGoogle,
    logout,
    resetProgress,
    activeWeekNumber,
    completedPracticesCount,
    totalPracticesCount,
    progressPercentage,
    isSyncing
  } = useAuth();

  const [activeTab, setActiveTab] = useState<ModalTab>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Gratitude Form State
  const [selectedMood, setSelectedMood] = useState<string>('calma');
  const [gratitudeNote, setGratitudeNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_GRATITUDE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'seed-gratitude-1',
        userId: 'guest',
        mood: 'calma',
        note: 'Agradezco el peso seguro de mis pies sobre la tierra y la pausa que pude regalarme hoy.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
      },
      {
        id: 'seed-gratitude-2',
        userId: 'guest',
        mood: 'paz',
        note: 'Gracias a mi respiración por traerme de vuelta a mi centro cuando la mente se aceleraba.',
        createdAt: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
      }
    ];
  });

  // Load gratitude entries from Firestore when user changes or modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (currentUser) {
      loadGratitudeEntriesFromFirestore(currentUser.uid)
        .then((entries) => {
          if (entries && entries.length > 0) {
            setGratitudeEntries(entries);
            try {
              localStorage.setItem(LOCAL_GRATITUDE_KEY, JSON.stringify(entries));
            } catch {}
          }
        })
        .catch((err) => {
          console.warn('Could not load gratitude entries from Firestore:', err);
        });
    }
  }, [isOpen, currentUser]);

  // Persist local entries
  const saveLocalEntries = (entries: GratitudeEntry[]) => {
    setGratitudeEntries(entries);
    try {
      localStorage.setItem(LOCAL_GRATITUDE_KEY, JSON.stringify(entries));
    } catch {}
  };

  const handleAddGratitude = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitudeNote.trim()) return;

    setIsSubmitting(true);
    const newId = `grat-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newEntry: GratitudeEntry = {
      id: newId,
      userId: currentUser?.uid || 'guest',
      mood: selectedMood,
      note: gratitudeNote.trim(),
      createdAt: nowIso,
    };

    // Optimistic local update
    const updated = [newEntry, ...gratitudeEntries];
    saveLocalEntries(updated);
    setGratitudeNote('');

    // Sync to Firestore if authenticated
    if (currentUser) {
      try {
        await saveGratitudeEntryToFirestore(currentUser.uid, {
          id: newId,
          mood: selectedMood,
          note: newEntry.note,
        });
      } catch (err) {
        console.warn('Error saving gratitude entry to Firestore:', err);
      }
    }

    setIsSubmitting(false);
  };

  const handleDeleteGratitude = async (entryId: string) => {
    const updated = gratitudeEntries.filter((g) => g.id !== entryId);
    saveLocalEntries(updated);

    if (currentUser) {
      try {
        await deleteGratitudeEntryFromFirestore(currentUser.uid, entryId);
      } catch (err) {
        console.warn('Error deleting gratitude from Firestore:', err);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#232720]/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F4] border border-[#DDD5C0] w-full max-w-md max-h-[92vh] flex flex-col rounded-[32px] shadow-2xl overflow-hidden relative text-[#2C2F28]">
        {/* Top Header Row with Tabs and Close Button */}
        <div className="p-4 sm:p-5 pb-3 border-b border-[#E5DFCF] bg-[#F7F4EC]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#8A9A70] text-[#FDFCF9] flex items-center justify-center text-sm font-serif font-bold shadow-2xs">
                {currentUser?.displayName ? currentUser.displayName[0] : '🌱'}
              </div>
              <div>
                <h3 className="font-serif text-base font-medium text-[#232720] leading-tight">
                  {currentUser ? (currentUser.displayName || 'Practicante de Centro') : 'Mi Espacio Somático'}
                </h3>
                <p className="text-[11px] text-[#7A7E72] truncate max-w-[210px]">
                  {currentUser?.email || 'Modo local sin conexión'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#EAE3D3] hover:bg-[#DDD5C0] text-[#556341] flex items-center justify-center transition-colors cursor-pointer"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dedicated Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#EAE4D7] rounded-xl border border-[#DDD5C0]">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
                  : 'text-[#6B7062] hover:text-[#2C2F28]'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 text-[#6B7A54]" />
              <span>Mi Perfil & Progreso</span>
            </button>

            <button
              onClick={() => setActiveTab('gratitude')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'gratitude'
                  ? 'bg-[#FDFCF9] text-[#2C2F28] shadow-xs'
                  : 'text-[#6B7062] hover:text-[#2C2F28]'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-[#B07234]" />
              <span>Diario de Gratitud</span>
              {gratitudeEntries.length > 0 && (
                <span className="text-[10px] bg-[#E5DFCF] text-[#556341] px-1.5 py-0.2 rounded-full ml-0.5">
                  {gratitudeEntries.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'profile' ? (
            /* TAB 1: USER PROFILE & 5-WEEK PROGRESSION */
            <div className="space-y-4">
              {currentUser ? (
                /* Authenticated State */
                <>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full">
                    <Cloud className={`w-3.5 h-3.5 text-emerald-700 ${isSyncing ? 'animate-pulse' : ''}`} />
                    <span>Progreso sincronizado en Firestore</span>
                  </div>

                  {/* Progress Metrics Box for 5-Week Program */}
                  <div className="bg-[#EFE9DD]/80 border border-[#DDD5C0] rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7062]">Programa Somático</span>
                      <span className="font-semibold text-[#2C2F28]">Programa 5 Semanas</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7062]">Semana en curso</span>
                      <span className="font-semibold text-[#556341]">Semana {activeWeekNumber} de 5</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B7062]">Prácticas clave completadas</span>
                      <span className="font-semibold text-[#2C2F28]">
                        {completedPracticesCount} de {totalPracticesCount} ({progressPercentage}%)
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[#DDD5C0] rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-[#6B7A54] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={async () => {
                        await logout();
                      }}
                      className="w-full py-2.5 rounded-xl border border-[#DDD5C0] hover:bg-[#EAE3D3] text-xs font-semibold text-[#556341] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar sesión</span>
                    </button>

                    <button
                      onClick={async () => {
                        if (confirm('¿Deseas reiniciar tu progreso al inicio del Programa de 5 Semanas para volver a practicar?')) {
                          await resetProgress();
                        }
                      }}
                      className="w-full py-2 rounded-xl text-[11px] text-[#8C9082] hover:text-[#556341] flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reiniciar progreso de prueba</span>
                    </button>
                  </div>
                </>
              ) : (
                /* Guest State */
                <div className="space-y-4 pt-1">
                  <div className="text-center">
                    <h4 className="font-serif text-lg font-medium text-[#232720]">
                      Guarda tu Progreso en la Nube
                    </h4>
                    <p className="text-xs text-[#6B7062] mt-1.5 leading-relaxed">
                      Inicia sesión con Google para sincronizar tus 5 semanas, tus días desbloqueados y tu Diario de Gratitud en Firestore.
                    </p>
                  </div>

                  {/* Perks list */}
                  <div className="bg-[#EFE9DD]/70 border border-[#DDD5C0] rounded-2xl p-3.5 space-y-2 text-xs text-[#5D6253]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Desbloqueo de las 5 semanas seguro en cualquier dispositivo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>Sincronización de tu Diario de Gratitud en la nube</span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    onClick={async () => {
                      try {
                        await signInWithGoogle();
                      } catch (err) {
                        console.error('Error signing in:', err);
                      }
                    }}
                    className="w-full py-3 px-4 rounded-2xl bg-[#556341] hover:bg-[#434F30] text-[#FDFCF9] text-xs font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continuar con Google</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: DIARIO DE GRATITUD */
            <div className="space-y-4">
              {/* Gratitude Form */}
              <form onSubmit={handleAddGratitude} className="bg-[#FAF8F4] border border-[#DDD5C0] rounded-2xl p-3.5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#556341] uppercase tracking-wider mb-1.5">
                    ¿Cómo se siente tu cuerpo ahora?
                  </label>
                  {/* Mood Selector Grid */}
                  <div className="grid grid-cols-5 gap-1.5">
                    {MOOD_OPTIONS.map((mood) => {
                      const isSelected = selectedMood === mood.id;
                      return (
                        <button
                          key={mood.id}
                          type="button"
                          onClick={() => setSelectedMood(mood.id)}
                          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                            isSelected
                              ? `${mood.bgActive} ${mood.borderActive} font-bold shadow-xs scale-102`
                              : 'bg-[#F2ECE0]/70 border-[#DDD5C0] hover:bg-[#EBE4D5] text-[#6B7062]'
                          }`}
                        >
                          <span className="text-xl select-none leading-none mb-1">{mood.emoji}</span>
                          <span className="text-[10px] leading-tight">{mood.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#556341] uppercase tracking-wider mb-1">
                    ¿Qué agradece tu cuerpo o tu vida hoy?
                  </label>
                  <textarea
                    value={gratitudeNote}
                    onChange={(e) => setGratitudeNote(e.target.value)}
                    placeholder="Escribe una frase corta de gratitud, un alivio somático o un momento del día..."
                    rows={3}
                    maxLength={500}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#DDD5C0] bg-[#FDFCF9] focus:outline-none focus:border-[#8A9A70] text-[#2C2F28] placeholder-[#9A9E90] resize-none"
                  />
                  <div className="text-right text-[10px] text-[#9A9E90] mt-0.5">
                    {gratitudeNote.length}/500
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!gratitudeNote.trim() || isSubmitting}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#556341] hover:bg-[#434F30] disabled:bg-[#DDD5C0] disabled:text-[#9A9E90] text-[#FDFCF9] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Guardando...' : 'Guardar en mi Diario'}</span>
                </button>
              </form>

              {/* Gratitude Entries List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B7A54] flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>Entradas Anteriores ({gratitudeEntries.length})</span>
                  </h4>
                  {currentUser && (
                    <span className="text-[10px] text-emerald-800 font-medium">
                      ☁️ Sincronizado en Firestore
                    </span>
                  )}
                </div>

                {gratitudeEntries.length === 0 ? (
                  <div className="text-center py-6 px-4 bg-[#EFE9DD]/50 rounded-2xl border border-dashed border-[#DDD5C0]">
                    <Heart className="w-6 h-6 text-[#A3A69C] mx-auto mb-1.5" />
                    <p className="text-xs text-[#7A7E72]">
                      Aún no has agregado ninguna nota de gratitud.
                    </p>
                    <p className="text-[11px] text-[#9A9E90] mt-0.5">
                      Empieza anotando un pequeño detalle que tu cuerpo aprecie hoy.
                    </p>
                  </div>
                ) : (
                  gratitudeEntries.map((entry) => {
                    const moodObj = MOOD_OPTIONS.find((m) => m.id === entry.mood) || MOOD_OPTIONS[0];
                    const dateFormatted = new Date(entry.createdAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={entry.id}
                        className="bg-[#FAF8F4] border border-[#E5DFCF] rounded-2xl p-3 shadow-2xs relative group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base select-none">{moodObj.emoji}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#556341] bg-[#EDE7D9] px-2 py-0.5 rounded-full">
                              {moodObj.label}
                            </span>
                            <span className="text-[10px] text-[#8C9082] ml-1">
                              {dateFormatted}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteGratitude(entry.id)}
                            className="opacity-0 group-hover:opacity-100 text-[#A3A69C] hover:text-red-700 p-1 transition-opacity cursor-pointer"
                            title="Eliminar entrada"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-xs text-[#2C2F28] mt-2 leading-relaxed whitespace-pre-wrap font-serif">
                          "{entry.note}"
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
