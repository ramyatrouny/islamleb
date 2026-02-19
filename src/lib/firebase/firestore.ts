import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirebaseDb } from "./config";
import type { UserProgress, UserDocument } from "./types";

export { mergeProgress } from "./merge";

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/** Fetch the user's progress from Firestore. Returns null if no doc exists. */
export async function getUserProgress(
  uid: string,
): Promise<UserProgress | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data() as UserDocument;
  return data.progress;
}

/** Write/overwrite the user's progress in Firestore. */
export async function setUserProgress(
  uid: string,
  progress: UserProgress,
): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), "users", uid),
    {
      progress,
      lastSyncedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

/** Create the full user document on first signup/login. Uses merge to avoid overwriting existing data. */
export async function createUserDocument(
  user: User,
  progress: UserProgress,
): Promise<void> {
  await setDoc(
    doc(getFirebaseDb(), "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      createdAt: serverTimestamp(),
      progress,
      lastSyncedAt: serverTimestamp(),
    } satisfies Omit<UserDocument, "createdAt" | "lastSyncedAt"> & {
      createdAt: ReturnType<typeof serverTimestamp>;
      lastSyncedAt: ReturnType<typeof serverTimestamp>;
    },
    { merge: true },
  );
}

// ---------------------------------------------------------------------------
// Contact Messages
// ---------------------------------------------------------------------------

export interface ContactMessage {
  category: string;
  name: string;
  email: string;
  subject?: string;
  page?: string;
  message: string;
  uid?: string;
  createdAt: ReturnType<typeof serverTimestamp>;
}

/** Submit a contact form message to the messages collection. */
export async function submitContactMessage(
  data: Omit<ContactMessage, "createdAt">,
): Promise<void> {
  await addDoc(collection(getFirebaseDb(), "messages"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ---------------------------------------------------------------------------
// Real-time Sync
// ---------------------------------------------------------------------------

/** Subscribe to real-time changes on the user's progress (cross-device sync). */
export function subscribeToUserProgress(
  uid: string,
  callback: (progress: UserProgress) => void,
): Unsubscribe {
  return onSnapshot(
    doc(getFirebaseDb(), "users", uid),
    (snap) => {
      if (!snap.exists()) return;
      const data = snap.data() as UserDocument;
      callback(data.progress);
    },
    (error) => {
      console.error("[Firestore] onSnapshot error:", error);
    },
  );
}
