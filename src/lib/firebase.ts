import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  getDocFromServer,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ReflectionEntry } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with explicit database ID (mandated by SKILL.md)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// =========================================================================
// Error Handling: Conforming to FirestoreErrorInfo specification
// =========================================================================
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// =========================================================================
// Connection Validation (Test Connection on Startup)
// =========================================================================
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline, using local cached store.');
    } else {
      console.warn('Firebase test connection message:', error);
    }
    return false;
  }
}

// Run connection validation on module initialization
testConnection();

// =========================================================================
// User Profile & 5-Week Gamified Progression Data Types & Helpers
// =========================================================================
export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  diasCompletados: number;          // Total practices completed across all 5 weeks
  semanaActual: number;             // Current active week (1 to 5)
  semanasCompletadas?: number;      // Total weeks fully completed (0 to 5)
  completedDayIds: number[];        // Compatibility array of completed numbers
  completedPracticeIds?: string[];  // e.g. ['w1-p1', 'w1-p2', 'w1-p3']
  lastCompletedAt?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface GratitudeEntry {
  id: string;
  userId: string;
  mood: string;       // e.g. 'calma' | 'gratitud' | 'serenidad' | 'energia' | 'paz'
  note: string;       // Text note
  createdAt: string;  // ISO date string
}

const DEFAULT_PROFILE: Omit<UserProfileData, 'uid' | 'email' | 'displayName'> = {
  diasCompletados: 0,
  semanaActual: 1,
  semanasCompletadas: 0,
  completedDayIds: [],
  completedPracticeIds: [],
  lastCompletedAt: null,
};

/**
 * Fetch or initialize the user's progress profile in Firestore
 */
export async function fetchOrCreateUserProfile(user: User): Promise<UserProfileData> {
  const userDocRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userDocRef);
    if (snap.exists()) {
      const data = snap.data() as UserProfileData;
      return {
        ...DEFAULT_PROFILE,
        ...data,
        uid: user.uid,
        email: user.email || data.email,
        displayName: user.displayName || data.displayName,
        photoURL: user.photoURL || data.photoURL,
        completedPracticeIds: data.completedPracticeIds || [],
        semanasCompletadas: data.semanasCompletadas || 0,
      };
    }

    // Initialize new profile document
    const newProfile: UserProfileData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      diasCompletados: 0,
      semanaActual: 1,
      semanasCompletadas: 0,
      completedDayIds: [],
      completedPracticeIds: [],
      lastCompletedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userDocRef, newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
  }
}

/**
 * Update user progression (diasCompletados, semanaActual, completedPracticeIds, etc.)
 */
export async function updateUserProgressionInFirestore(
  uid: string,
  progress: {
    diasCompletados: number;
    semanaActual: number;
    semanasCompletadas?: number;
    completedDayIds: number[];
    completedPracticeIds?: string[];
    lastCompletedAt?: string | null;
  }
): Promise<void> {
  const userDocRef = doc(db, 'users', uid);
  try {
    const updatePayload: Record<string, unknown> = {
      diasCompletados: progress.diasCompletados,
      semanaActual: progress.semanaActual,
      completedDayIds: progress.completedDayIds,
      lastCompletedAt: progress.lastCompletedAt || new Date().toISOString(),
      updatedAt: serverTimestamp(),
    };

    if (progress.semanasCompletadas !== undefined) {
      updatePayload.semanasCompletadas = progress.semanasCompletadas;
    }
    if (progress.completedPracticeIds) {
      updatePayload.completedPracticeIds = progress.completedPracticeIds;
    }

    await updateDoc(userDocRef, updatePayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
  }
}

/**
 * Save somatic reflection to Firestore
 */
export async function saveReflectionToFirestore(
  uid: string,
  reflection: ReflectionEntry
): Promise<void> {
  const refId = reflection.id.startsWith('ref-') ? reflection.id : `ref-${Date.now()}`;
  const refDoc = doc(db, 'users', uid, 'reflections', refId);
  try {
    await setDoc(refDoc, {
      id: refId,
      userId: uid,
      weekNumber: reflection.weekNumber,
      dayNumber: reflection.dayInWeek || 1,
      practiceTitle: reflection.weekTitle,
      sensations: reflection.sensations || [],
      whatToRelease: reflection.whatToRelease || '',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}/reflections/${refId}`);
  }
}

/**
 * Load user reflections from Firestore
 */
export async function loadUserReflectionsFromFirestore(uid: string): Promise<ReflectionEntry[]> {
  try {
    const q = collection(db, 'users', uid, 'reflections');
    const querySnapshot = await getDocs(q);
    const results: ReflectionEntry[] = [];
    querySnapshot.forEach((d) => {
      const data = d.data();
      results.push({
        id: data.id || d.id,
        weekNumber: data.weekNumber || 1,
        weekTitle: data.practiceTitle || `Semana ${data.weekNumber}`,
        dayInWeek: data.dayNumber,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        sensations: data.sensations || [],
        whatToRelease: data.whatToRelease || '',
      });
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${uid}/reflections`);
  }
}

// =========================================================================
// Gratitude Journal (Diario de Gratitud) Firestore Helpers
// =========================================================================

/**
 * Save gratitude journal entry to Firestore under /users/{userId}/gratitude/{gratitudeId}
 */
export async function saveGratitudeEntryToFirestore(
  uid: string,
  entry: Omit<GratitudeEntry, 'id' | 'userId' | 'createdAt'> & { id?: string }
): Promise<GratitudeEntry> {
  const gratitudeId = entry.id || `grat-${Date.now()}`;
  const gratitudeDocRef = doc(db, 'users', uid, 'gratitude', gratitudeId);
  const nowIso = new Date().toISOString();

  try {
    await setDoc(gratitudeDocRef, {
      id: gratitudeId,
      userId: uid,
      mood: entry.mood,
      note: entry.note,
      createdAt: serverTimestamp(),
    });

    return {
      id: gratitudeId,
      userId: uid,
      mood: entry.mood,
      note: entry.note,
      createdAt: nowIso,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}/gratitude/${gratitudeId}`);
  }
}

/**
 * Load gratitude journal entries for user
 */
export async function loadGratitudeEntriesFromFirestore(uid: string): Promise<GratitudeEntry[]> {
  try {
    const gratitudeCol = collection(db, 'users', uid, 'gratitude');
    const querySnapshot = await getDocs(gratitudeCol);
    const entries: GratitudeEntry[] = [];

    querySnapshot.forEach((d) => {
      const data = d.data();
      entries.push({
        id: data.id || d.id,
        userId: uid,
        mood: data.mood || 'calma',
        note: data.note || '',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      });
    });

    // Sort descending by date
    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return entries;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `users/${uid}/gratitude`);
  }
}

/**
 * Delete gratitude journal entry
 */
export async function deleteGratitudeEntryFromFirestore(uid: string, gratitudeId: string): Promise<void> {
  try {
    const gratitudeDocRef = doc(db, 'users', uid, 'gratitude', gratitudeId);
    await deleteDoc(gratitudeDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `users/${uid}/gratitude/${gratitudeId}`);
  }
}

export { signInWithPopup, signOut, onAuthStateChanged };
