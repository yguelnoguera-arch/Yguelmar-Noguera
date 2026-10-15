/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LockScreen } from './components/LockScreen';
import { Header } from './components/Header';
import { Navigation, NavTab } from './components/Navigation';
import { MainMenuView } from './components/MainMenuView';
import { WeekView } from './components/WeekView';
import { HistoryView } from './components/HistoryView';
import { SOSModal, SOSMode } from './components/SOSModal';
import { StateAssessmentModal } from './components/StateAssessmentModal';
import { NatureBackground } from './components/NatureBackground';
import { WEEKS_DATA } from './data/weeks';
import { ReflectionEntry, AssessmentRecord } from './types';
import { soundManager } from './utils/sound';
import { TopTabBar, MainSectionTab } from './components/TopTabBar';
import { SomaticToolkitView } from './components/somatic/SomaticToolkitView';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SomaticPlayerModal } from './components/SomaticPlayerModal';
import { UserAuthModal } from './components/UserAuthModal';
import { ProgramDay } from './data/programDays';
import { ProgramPractice } from './data/programWeeksData';
import { SomaticSession } from './data/somaticSessions';

const STORAGE_KEY = 'vuelve_centro_reflections_v4';
const UNLOCK_STORAGE_KEY = 'vuelve_centro_is_unlocked';
const ASSESSMENT_BEFORE_KEY = 'vuelve_centro_assessment_before';
const ASSESSMENT_AFTER_KEY = 'vuelve_centro_assessment_after';

function AppContent() {
  const { currentUser } = useAuth();

  // Lock screen state
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    try {
      const unlocked = sessionStorage.getItem(UNLOCK_STORAGE_KEY);
      return unlocked !== 'true';
    } catch {
      return true;
    }
  });

  // Top section state ('practice' | 'somatic')
  const [mainSection, setMainSection] = useState<MainSectionTab>('practice');

  // Navigation tab state ('home' | 'week' | 'history')
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Currently viewed week (1, 2, 3, 4, 5)
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number>(1);

  // Selected Program Practice / Day & Somatic Session Player
  const [selectedPractice, setSelectedPractice] = useState<ProgramPractice | null>(null);
  const [selectedProgramDay, setSelectedProgramDay] = useState<ProgramDay | null>(null);
  const [selectedSomaticSession, setSelectedSomaticSession] = useState<SomaticSession | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);

  // User Auth Modal & Gratitude Journal Tab
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'profile' | 'gratitude'>('profile');

  const handleOpenAuth = (initialTab: 'profile' | 'gratitude' = 'profile') => {
    setAuthModalInitialTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const handleOpenGratitude = () => {
    handleOpenAuth('gratitude');
  };

  // SOS Modal state
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [sosMode, setSosMode] = useState<SOSMode>('calma');

  // State Assessment Modal state
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);

  // Assessment Records (Before vs. After)
  const [beforeAssessment, setBeforeAssessment] = useState<AssessmentRecord | null>(() => {
    try {
      const saved = localStorage.getItem(ASSESSMENT_BEFORE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      type: 'before',
      completedAt: new Date(Date.now() - 3600 * 1000 * 24 * 14).toISOString(),
      answers: {
        q1: 2,
        q2: 2,
        q3: 3,
        q4: 2,
        q5: 2,
        q6: 2,
        q7: 3,
      },
      totalScore: 16,
      wellbeingPercentage: 46,
    };
  });

  const [afterAssessment, setAfterAssessment] = useState<AssessmentRecord | null>(() => {
    try {
      const saved = localStorage.getItem(ASSESSMENT_AFTER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Device frame toggle for desktop reviewers
  const [isMobileDeviceFrame, setIsMobileDeviceFrame] = useState<boolean>(true);

  // Local storage reflections seeded with sample entries
  const [reflections, setReflections] = useState<ReflectionEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return [
      {
        id: 'seed-w1',
        weekNumber: 1,
        weekTitle: 'Anclaje y Escaneo Corporal',
        createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 7).toISOString(),
        sensations: ['Mandíbula', 'Cuello/Hombros'],
        whatToRelease: 'La prisa acumulada de la mañana y la tensión en los trapecios.',
        reflectionText: 'La prisa acumulada de la mañana y la tensión en los trapecios.',
        wellbeingScore: 6,
      },
      {
        id: 'seed-w2',
        weekNumber: 2,
        weekTitle: 'Regulación y Respiración Consciente',
        createdAt: new Date(Date.now() - 3600 * 1000 * 24 * 3).toISOString(),
        sensations: ['Pecho', 'En calma'],
        whatToRelease: 'El control excesivo. Respiro hondo y suelto la rigidez del diafragma.',
        reflectionText: 'El control excesivo. Respiro hondo y suelto la rigidez del diafragma.',
        wellbeingScore: 8,
      },
      {
        id: 'seed-w3',
        weekNumber: 3,
        weekTitle: 'Vaciado y Calma Mental',
        createdAt: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
        sensations: ['En calma'],
        whatToRelease: 'Un diálogo mental repetitivo sobre un pendiente de trabajo.',
        reflectionText: 'Un diálogo mental repetitivo sobre un pendiente de trabajo.',
        wellbeingScore: 9,
      },
    ];
  });

  // Persist reflections
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reflections));
    } catch (e) {
      console.warn('Error saving reflections to localStorage:', e);
    }
  }, [reflections]);

  // Persist assessments
  useEffect(() => {
    try {
      if (beforeAssessment) {
        localStorage.setItem(ASSESSMENT_BEFORE_KEY, JSON.stringify(beforeAssessment));
      }
      if (afterAssessment) {
        localStorage.setItem(ASSESSMENT_AFTER_KEY, JSON.stringify(afterAssessment));
      }
    } catch (e) {
      console.warn('Error saving assessments:', e);
    }
  }, [beforeAssessment, afterAssessment]);

  // Sync sound manager
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  const handleUnlock = () => {
    setIsLocked(false);
    try {
      sessionStorage.setItem(UNLOCK_STORAGE_KEY, 'true');
    } catch {}
  };

  const handleLock = () => {
    setIsLocked(true);
    soundManager.stopAmbient();
    try {
      sessionStorage.removeItem(UNLOCK_STORAGE_KEY);
    } catch {}
  };

  const handleOpenSOS = (mode: SOSMode) => {
    setSosMode(mode);
    setIsSOSOpen(true);
  };

  const handleSaveReflection = (
    newReflectionData: Omit<ReflectionEntry, 'id' | 'createdAt'>
  ) => {
    const newEntry: ReflectionEntry = {
      ...newReflectionData,
      id: `reflection-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReflections((prev) => [newEntry, ...prev]);
  };

  const handleDeleteReflection = (id: string) => {
    setReflections((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSelectWeek = (weekNum: number) => {
    setSelectedWeekNumber(weekNum);
    setActiveTab('week');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPractice = (practice: ProgramPractice) => {
    setSelectedPractice(practice);
    setSelectedProgramDay(null);
    setSelectedSomaticSession(null);
    setIsPlayerOpen(true);
  };

  const handleSelectProgramDay = (day: ProgramDay) => {
    setSelectedProgramDay(day);
    setSelectedPractice(null);
    setSelectedSomaticSession(null);
    setIsPlayerOpen(true);
  };

  const handleSelectSomaticSession = (session: SomaticSession) => {
    setSelectedSomaticSession(session);
    setSelectedPractice(null);
    setSelectedProgramDay(null);
    setIsPlayerOpen(true);
  };

  const handleSaveAssessment = (record: AssessmentRecord) => {
    if (!beforeAssessment || record.type === 'before') {
      setBeforeAssessment({ ...record, type: 'before' });
    } else {
      setAfterAssessment({ ...record, type: 'after' });
    }
  };

  const currentWeekData =
    WEEKS_DATA.find((w) => w.weekNumber === selectedWeekNumber) || WEEKS_DATA[0];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <MainMenuView
            weeks={WEEKS_DATA}
            reflections={reflections}
            beforeAssessment={beforeAssessment}
            afterAssessment={afterAssessment}
            onSelectWeek={handleSelectWeek}
            onSelectPractice={handleSelectPractice}
            onSelectSomaticSession={handleSelectSomaticSession}
            onOpenSOS={handleOpenSOS}
            onOpenAssessment={() => setIsAssessmentOpen(true)}
            onViewHistory={() => {
              setActiveTab('history');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuth={() => handleOpenAuth('profile')}
            onOpenGratitude={handleOpenGratitude}
          />
        );
      case 'week':
        return (
          <WeekView
            week={currentWeekData}
            allWeeks={WEEKS_DATA}
            onSelectWeek={(weekNum) => setSelectedWeekNumber(weekNum)}
            onSaveReflection={handleSaveReflection}
            existingReflections={reflections}
            onViewHistory={() => {
              setActiveTab('history');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToMenu={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAssessment={() => setIsAssessmentOpen(true)}
          />
        );
      case 'history':
        return (
          <HistoryView
            reflections={reflections}
            onDeleteReflection={handleDeleteReflection}
            onGoToWeek={handleSelectWeek}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#EAE4D7] text-[#2C2F28] flex flex-col items-center justify-start sm:p-4 relative">
      {/* Container wrapper: on larger screens optionally frames as a sleek mobile device */}
      <div
        className={`w-full transition-all duration-300 relative bg-[#F7F5F0] overflow-hidden ${
          isMobileDeviceFrame
            ? 'sm:max-w-[430px] sm:min-h-[850px] sm:my-4 sm:rounded-[44px] sm:shadow-2xl sm:shadow-[#2B3023]/20 sm:border-[8px] sm:border-[#383C2F]'
            : 'max-w-2xl min-h-screen'
        }`}
      >
        {/* Subtle organic nature background across the device canvas */}
        <NatureBackground variant="ambient-warm" opacity={0.6} />

        {/* Simulated Mobile Status bar on framed mode */}
        {isMobileDeviceFrame && (
          <div className="hidden sm:flex items-center justify-between px-6 pt-2 pb-1 bg-[#F7F5F0]/90 backdrop-blur-sm text-[11px] font-medium text-[#5E6255] select-none border-b border-[#EAE3D3]/50 relative z-40">
            <span>09:41</span>
            <div className="w-20 h-4 bg-[#2C2F28] rounded-full mx-auto" />
            <div className="flex items-center gap-1.5 text-[10px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>
        )}

        {/* Display Lock Screen or Main Application */}
        {isLocked ? (
          <div className="h-[800px] sm:h-[780px] relative z-10">
            <LockScreen onUnlock={handleUnlock} />
          </div>
        ) : (
          <div className="min-h-screen sm:min-h-[790px] flex flex-col justify-between relative z-10">
            {/* CABECERA ANCLADA (STICKY / FIXED) CON NAVEGACIÓN SUPERIOR */}
            <div className="sticky top-0 z-40 bg-[#F7F5F0]/95 backdrop-blur-md">
              <Header
                onLockApp={handleLock}
                soundEnabled={soundEnabled}
                onToggleSound={() => setSoundEnabled(!soundEnabled)}
                isMobileDeviceFrame={isMobileDeviceFrame}
                onToggleDeviceFrame={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
                onOpenSOS={handleOpenSOS}
                showBackToMenu={mainSection === 'practice' && activeTab === 'week'}
                activeWeekNumber={selectedWeekNumber}
                onBackToMenu={() => {
                  setActiveTab('home');
                  soundManager.stopAmbient();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                isAuthenticated={!!currentUser}
                userName={currentUser?.displayName || currentUser?.email || null}
                userPhotoUrl={currentUser?.photoURL || null}
              />
              <TopTabBar
                activeSection={mainSection}
                onSelectSection={(sec) => {
                  setMainSection(sec);
                  if (sec === 'practice') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
              {mainSection === 'somatic' ? (
                <SomaticToolkitView />
              ) : (
                renderActiveScreen()
              )}
            </main>

            {/* NAVEGACIÓN INFERIOR ANCLADA (FIXED BOTTOM) */}
            <Navigation
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setMainSection('practice');
                if (tab === 'gratitude') {
                  handleOpenGratitude();
                  return;
                }
                if (tab === 'sos') {
                  handleOpenSOS('calma');
                  return;
                }
                if (tab !== 'week') {
                  soundManager.stopAmbient();
                }
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              activeWeekNumber={selectedWeekNumber}
              reflectionsCount={reflections.length}
              onTriggerSOS={handleOpenSOS}
            />
          </div>
        )}

        {/* DUAL SOS MODAL: CALMA (60S) / ENERGÍA (60S) */}
        <SOSModal
          isOpen={isSOSOpen}
          initialMode={sosMode}
          onClose={() => setIsSOSOpen(false)}
        />

        {/* STATE ASSESSMENT MODAL: 7 QUESTIONS & ANTES VS DESPUÉS CHART */}
        <StateAssessmentModal
          isOpen={isAssessmentOpen}
          onClose={() => setIsAssessmentOpen(false)}
          beforeRecord={beforeAssessment}
          afterRecord={afterAssessment}
          onSaveAssessment={handleSaveAssessment}
          initialViewMode={afterAssessment ? 'compare' : 'quiz'}
        />

        {/* REPRODUCTOR SOMÁTICO PARA PROGRAMA 5 SEMANAS Y PACK DE 7 SESIONES */}
        <SomaticPlayerModal
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          practice={selectedPractice}
          day={selectedProgramDay}
          session={selectedSomaticSession}
          onSaveReflection={handleSaveReflection}
        />

        {/* DIÁLOGO DE AUTENTICACIÓN GOOGLE, PERFIL Y DIARIO DE GRATITUD */}
        <UserAuthModal
          isOpen={isAuthModalOpen}
          initialTab={authModalInitialTab}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>

      {/* Tester helper note */}
      <div className="hidden sm:flex items-center gap-4 text-xs text-[#7A7E72] mt-1 select-none">
        <span>Código de acceso: <strong className="text-[#485437]">CENTRO2026</strong></span>
        <span>·</span>
        <span>Programa 5 Semanas · 7 Sesiones Somáticas · Diario de Gratitud · Firestore</span>
        <span>·</span>
        <button
          onClick={() => setIsMobileDeviceFrame(!isMobileDeviceFrame)}
          className="text-[#556341] underline hover:text-[#2C2F28] cursor-pointer"
        >
          {isMobileDeviceFrame ? 'Ver expandido' : 'Ver en marco de móvil'}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
