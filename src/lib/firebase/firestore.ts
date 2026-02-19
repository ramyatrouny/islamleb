import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
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

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

/** Fetch the role field from a user document. Returns undefined if no doc/role. */
export async function getUserRole(
  uid: string,
): Promise<UserDocument["role"] | undefined> {
  const snap = await getDoc(doc(getFirebaseDb(), "users", uid));
  if (!snap.exists()) return undefined;
  return (snap.data() as UserDocument).role;
}

/** Fetch all user documents ordered by creation date (newest first). */
export async function getAllUsers(): Promise<UserDocument[]> {
  const q = query(
    collection(getFirebaseDb(), "users"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserDocument);
}

/** Fetch all contact messages ordered by creation date (newest first). */
export async function getAllMessages(): Promise<
  (ContactMessage & { id: string })[]
> {
  const q = query(
    collection(getFirebaseDb(), "messages"),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as ContactMessage),
  }));
}

/** Compute aggregate admin stats from users and messages collections. */
export async function getAdminStats() {
  const [users, messages] = await Promise.all([
    getAllUsers(),
    getAllMessages(),
  ]);

  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  const recentSignups = users.filter((u) => {
    if (!u.createdAt || typeof (u.createdAt as { toMillis?: unknown }).toMillis !== "function") return false;
    return (u.createdAt as { toMillis(): number }).toMillis() > sevenDaysAgo;
  }).length;

  const messagesByCategory = messages.reduce<Record<string, number>>(
    (acc, m) => {
      acc[m.category] = (acc[m.category] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return {
    totalUsers: users.length,
    totalMessages: messages.length,
    recentSignups,
    messagesByCategory,
  };
}
