import type { FieldValue, Timestamp } from "firebase/firestore";

/** Progress data that syncs between Zustand and Firestore */
export interface UserProgress {
  fastingDays: boolean[];
  completedJuz: number[];
  dailyGoals: Record<string, boolean[]>;
  tasbihCount: number;
  selectedCity: string;
}

/** Full Firestore document at /users/{uid} */
export interface UserDocument {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role?: "admin" | "user";
  createdAt: FieldValue | Timestamp;
  progress: UserProgress;
  lastSyncedAt: FieldValue | Timestamp;
}
