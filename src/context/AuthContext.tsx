import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  fetchOrCreateUserProfile,
  updateUserProgressionInFirestore,
  UserProfileData
} from '../lib/firebase';
import { PROGRAM_WEEKS, ProgramPractice } from '../data/programWeeksData';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfileData | null;
  isLoading: boolean;
  isSyncing: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;

  // 5-Week Progression
  completedPracticeIds: string[];
  completePractice: (practiceId: string) => Promise<void>;
  isPracticeCompleted: (practiceId: string) => boolean;
  isPracticeUnlocked: (practiceId: string) => boolean;
  isWeekUnlocked: (weekNumber: number) => boolean;
  isWeekCompleted: (weekNumber: number) => boolean;
  activeWeekNumber: number; // 1 to 5
  currentActivePractice: ProgramPractice;
  completedPracticesCount: number;
  totalPracticesCount: number;
  progressPercentage: number;
  resetProgress: () => Promise<void>;

  // Backward compatibility aliases
  completeDay: (dayNumber: number) => Promise<void>;
  isDayUnlocked: (dayNumber: number) => boolean;
  isDayCompleted: (dayNumber: number) => boolean;
  unlockedDaysCount: number;
  completedDayIds: number[];
  currentActiveDayNumber: number;
}

const LOCAL_PROGRESS_KEY = 'vuelve_centro_program_5_weeks_v2';

interface LocalProgress {
  completedPracticeIds: string[];
  semanaActual: number;
  lastCompletedAt: string | null;
}

const DEFAULT_LOCAL_PROGRESS: LocalProgress = {
  completedPracticeIds: [],
  semanaActual: 1,
  lastCompletedAt: null,
};

// Flatten all practices ordered
const ALL_PRACTICES: ProgramPractice[] = PROGRAM_WEEKS.flatMap((w) => w.practices);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Local storage cache for guest / offline mode
  const [localProgress, setLocalProgress] = useState<LocalProgress>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_PROGRESS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LOCAL_PROGRESS;
  });

  // Save local progress on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_PROGRESS_KEY, JSON.stringify(localProgress));
    } catch (e) {
      console.warn('Error saving local progress:', e);
    }
  }, [localProgress]);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsSyncing(true);
        try {
          const profile = await fetchOrCreateUserProfile(user);
          const profilePractices = profile.completedPracticeIds || [];
          const localPractices = localProgress.completedPracticeIds || [];

          // Merge highest progress
          const merged = Array.from(new Set([...profilePractices, ...localPractices]));
          const currentWeekNum = calculateCurrentWeek(merged);

          if (merged.length > profilePractices.length) {
            await updateUserProgressionInFirestore(user.uid, {
              diasCompletados: merged.length,
              semanaActual: currentWeekNum,
              completedDayIds: merged.map((_, i) => i + 1),
              completedPracticeIds: merged,
            });
            setUserProfile({
              ...profile,
              diasCompletados: merged.length,
              semanaActual: currentWeekNum,
              completedPracticeIds: merged,
            });
          } else {
            setUserProfile(profile);
            setLocalProgress({
              completedPracticeIds: profilePractices,
              semanaActual: profile.semanaActual || currentWeekNum,
              lastCompletedAt: profile.lastCompletedAt || null,
            });
          }
        } catch (err) {
          console.warn('Could not sync profile from Firestore, using local state:', err);
        } finally {
          setIsSyncing(false);
        }
      } else {
        setUserProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsSyncing(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // Derive completed practices
  const completedPracticeIds = userProfile?.completedPracticeIds || localProgress.completedPracticeIds || [];

  const isPracticeCompleted = (practiceId: string): boolean => {
    return completedPracticeIds.includes(practiceId);
  };

  // Check if a specific week is unlocked (Week 1 is always unlocked, Week N unlocks when Week N-1 is complete)
  const isWeekUnlocked = (weekNumber: number): boolean => {
    if (weekNumber <= 1) return true;
    const previousWeek = PROGRAM_WEEKS.find((w) => w.weekNumber === weekNumber - 1);
    if (!previousWeek) return false;
    return previousWeek.practices.every((p) => isPracticeCompleted(p.id));
  };

  // Check if all practices of a week are complete
  const isWeekCompleted = (weekNumber: number): boolean => {
    const week = PROGRAM_WEEKS.find((w) => w.weekNumber === weekNumber);
    if (!week) return false;
    return week.practices.every((p) => isPracticeCompleted(p.id));
  };

  // Check if a specific practice is unlocked
  const isPracticeUnlocked = (practiceId: string): boolean => {
    const practice = ALL_PRACTICES.find((p) => p.id === practiceId);
    if (!practice) return false;

    // Week must be unlocked
    if (!isWeekUnlocked(practice.weekNumber)) return false;

    // First practice in the week is unlocked as soon as week is unlocked
    if (practice.practiceOrder === 1) return true;

    // Subsequent practice requires preceding practice in same week to be complete
    const prevPractice = PROGRAM_WEEKS
      .find((w) => w.weekNumber === practice.weekNumber)
      ?.practices.find((p) => p.practiceOrder === practice.practiceOrder - 1);

    if (!prevPractice) return true;
    return isPracticeCompleted(prevPractice.id);
  };

  // Calculate current active week
  function calculateCurrentWeek(completed: string[]): number {
    for (let w = 1; w <= 5; w++) {
      const week = PROGRAM_WEEKS.find((pw) => pw.weekNumber === w);
      if (week && !week.practices.every((p) => completed.includes(p.id))) {
        return w;
      }
    }
    return 5;
  }

  const activeWeekNumber = calculateCurrentWeek(completedPracticeIds);

  // Find the first uncompleted unlocked practice, or last practice if all completed
  const currentActivePractice =
    ALL_PRACTICES.find((p) => isPracticeUnlocked(p.id) && !isPracticeCompleted(p.id)) ||
    ALL_PRACTICES[ALL_PRACTICES.length - 1];

  const totalPracticesCount = ALL_PRACTICES.length; // 16
  const completedPracticesCount = completedPracticeIds.length;
  const progressPercentage = Math.round((completedPracticesCount / totalPracticesCount) * 100);

  /**
   * Complete a practice: marks completed, unlocks next practice/week, saves to Firestore
   */
  const completePractice = async (practiceId: string) => {
    const alreadyDone = completedPracticeIds.includes(practiceId);
    const updatedPractices = alreadyDone
      ? completedPracticeIds
      : [...completedPracticeIds, practiceId];

    const newWeekNumber = calculateCurrentWeek(updatedPractices);
    const nowIso = new Date().toISOString();

    setLocalProgress({
      completedPracticeIds: updatedPractices,
      semanaActual: newWeekNumber,
      lastCompletedAt: nowIso,
    });

    if (currentUser) {
      setIsSyncing(true);
      try {
        await updateUserProgressionInFirestore(currentUser.uid, {
          diasCompletados: updatedPractices.length,
          semanaActual: newWeekNumber,
          completedDayIds: updatedPractices.map((_, i) => i + 1),
          completedPracticeIds: updatedPractices,
          lastCompletedAt: nowIso,
        });

        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                diasCompletados: updatedPractices.length,
                semanaActual: newWeekNumber,
                completedPracticeIds: updatedPractices,
                lastCompletedAt: nowIso,
              }
            : null
        );
      } catch (err) {
        console.error('Error saving practice progress in Firestore:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const resetProgress = async () => {
    setLocalProgress(DEFAULT_LOCAL_PROGRESS);
    if (currentUser) {
      try {
        await updateUserProgressionInFirestore(currentUser.uid, {
          diasCompletados: 0,
          semanaActual: 1,
          completedDayIds: [],
          completedPracticeIds: [],
          lastCompletedAt: null,
        });
        setUserProfile((prev) =>
          prev
            ? {
                ...prev,
                diasCompletados: 0,
                semanaActual: 1,
                completedDayIds: [],
                completedPracticeIds: [],
                lastCompletedAt: null,
              }
            : null
        );
      } catch (e) {
        console.error('Error resetting progress:', e);
      }
    }
  };

  // Compatibility aliases
  const completeDay = async (dayNumber: number) => {
    const targetPractice = ALL_PRACTICES[dayNumber - 1];
    if (targetPractice) {
      await completePractice(targetPractice.id);
    }
  };

  const isDayUnlocked = (dayNumber: number) => {
    const targetPractice = ALL_PRACTICES[dayNumber - 1];
    return targetPractice ? isPracticeUnlocked(targetPractice.id) : false;
  };

  const isDayCompleted = (dayNumber: number) => {
    const targetPractice = ALL_PRACTICES[dayNumber - 1];
    return targetPractice ? isPracticeCompleted(targetPractice.id) : false;
  };

  const unlockedDaysCount = ALL_PRACTICES.filter((p) => isPracticeUnlocked(p.id)).length;
  const currentActiveDayNumber = ALL_PRACTICES.findIndex((p) => p.id === currentActivePractice.id) + 1;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isLoading,
        isSyncing,
        signInWithGoogle,
        logout,
        completedPracticeIds,
        completePractice,
        isPracticeCompleted,
        isPracticeUnlocked,
        isWeekUnlocked,
        isWeekCompleted,
        activeWeekNumber,
        currentActivePractice,
        completedPracticesCount,
        totalPracticesCount,
        progressPercentage,
        resetProgress,
        completeDay,
        isDayUnlocked,
        isDayCompleted,
        unlockedDaysCount,
        completedDayIds: completedPracticeIds.map((_, idx) => idx + 1),
        currentActiveDayNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
