# Firebase Implementation — islamleb.com

## Overview

Firebase powers two core features for islamleb.com:

1. **Authentication** — Email/Password and Google sign-in
2. **Cloud Sync** — Firestore persists user progress across devices

The app remains fully functional without Firebase (offline/anonymous mode). All data is stored locally in `localStorage` via Zustand. Firebase adds cloud backup and cross-device sync for authenticated users.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│  Root Layout (src/app/layout.tsx)                        │
│  └── AuthProvider                                        │
│       ├── FirestoreSyncInitializer (invisible)           │
│       ├── Header → UserMenu                              │
│       └── Pages                                          │
│            ├── /login                                    │
│            └── /signup                                   │
└──────────────────────────────────────────────────────────┘

Data Flow:
  Zustand Store ←→ useFirestoreSync ←→ Firestore /users/{uid}
       ↕                                       ↕
  localStorage                          Cloud (cross-device)
```

---

## Files

### Firebase Core (`src/lib/firebase/`)

| File | Purpose |
|------|---------|
| `config.ts` | Lazy singleton Firebase app/auth/db initialization |
| `auth.ts` | Auth helper functions (sign in, sign up, sign out, Google) |
| `firestore.ts` | Firestore CRUD operations + real-time subscription |
| `merge.ts` | Pure merge logic for local ↔ cloud data reconciliation |
| `types.ts` | TypeScript interfaces (`UserProgress`, `UserDocument`) |

### Auth Layer

| File | Purpose |
|------|---------|
| `src/providers/auth-provider.tsx` | React context — listens to `onAuthStateChanged` |
| `src/hooks/use-auth.ts` | Consumer hook — exposes `user`, `loading`, auth methods |

### Sync Layer

| File | Purpose |
|------|---------|
| `src/hooks/use-firestore-sync.ts` | Orchestrates bidirectional Zustand ↔ Firestore sync |
| `src/components/firestore-sync-initializer.tsx` | Invisible root component that activates sync |

### UI

| File | Purpose |
|------|---------|
| `src/app/(auth)/layout.tsx` | Shared centered layout for auth pages |
| `src/app/(auth)/login/page.tsx` | Login form (email/password + Google) |
| `src/app/(auth)/signup/page.tsx` | Signup form (name + email/password + Google) |
| `src/components/user-menu.tsx` | Avatar dropdown in header (login link / profile / logout) |
| `src/components/icons/google.tsx` | Google SVG icon component |

### Modified Files

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Wrapped with `<AuthProvider>`, added `<FirestoreSyncInitializer />` |
| `src/lib/store.ts` | Added `lastSyncedAt` field and `setSyncData()` bulk setter |
| `src/components/header.tsx` | Added `<UserMenu />` in desktop nav and mobile drawer |
| `.env.example` | Added `NEXT_PUBLIC_FIREBASE_*` variable templates |

### Tests

| File | Tests |
|------|-------|
| `src/__tests__/lib/firebase/firestore.test.ts` | 9 tests — merge logic (OR-merge, union, max, edge cases) |
| `src/__tests__/hooks/use-auth.test.ts` | 5 tests — context provider behavior |

---

## Authentication

### Supported Methods

- **Email/Password** — `signInWithEmailAndPassword` / `createUserWithEmailAndPassword`
- **Google** — `signInWithPopup` + `GoogleAuthProvider`

### Auth Functions (`src/lib/firebase/auth.ts`)

```typescript
signInWithEmail(email, password)    // Existing user login
signUpWithEmail(email, password, displayName)  // New user + set display name
signInWithGoogle()                  // Google popup flow
signOut()                           // Sign out
```

### Auth Context (`src/providers/auth-provider.tsx`)

The `AuthProvider` wraps the entire app and provides:

```typescript
interface AuthContextValue {
  user: User | null;      // Firebase User object or null
  loading: boolean;       // True until onAuthStateChanged fires
  signIn: (email, password) => Promise<void>;
  signUp: (email, password, displayName) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
```

Graceful degradation: if Firebase config is missing, the `try/catch` around `onAuthStateChanged` silently sets `loading = false` and the app works without auth.

---

## Firestore Data Model

### Collection: `/users/{uid}`

```typescript
interface UserDocument {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  lastSyncedAt: Timestamp;
  progress: {
    fastingDays: boolean[];              // 30 booleans, one per Ramadan day
    completedJuz: number[];              // Array of juz numbers (1-30)
    dailyGoals: Record<string, boolean[]>; // Day index → goal completion
    tasbihCount: number;                 // Digital tasbih counter
    selectedCity: string;                // Prayer times city
  };
}
```

### CRUD Operations (`src/lib/firebase/firestore.ts`)

```typescript
getUserProgress(uid)                    // Fetch progress (returns null if no doc)
setUserProgress(uid, progress)          // Update progress (merge: true)
createUserDocument(user, progress)      // Create full doc on first auth (merge: true)
subscribeToUserProgress(uid, callback)  // Real-time onSnapshot listener
```

### Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Sync Strategy

### Merge Logic (`src/lib/firebase/merge.ts`)

The "prefer most progress" merge ensures no user data is ever lost:

| Field | Strategy |
|-------|----------|
| `fastingDays` | OR per index — `local[i] \|\| cloud[i]` |
| `completedJuz` | Union of both sets, sorted ascending |
| `dailyGoals` | OR per day per goal index |
| `tasbihCount` | `Math.max(local, cloud)` |
| `selectedCity` | Prefer local (current device) |

### Sync Lifecycle (`src/hooks/use-firestore-sync.ts`)

Three independent `useEffect` hooks:

1. **Initial merge (on login)**
   - Fetch cloud data
   - Merge with local data using `mergeProgress()`
   - Write merged result to both Zustand and Firestore

2. **Push (local → cloud)**
   - Subscribe to Zustand store changes
   - Debounce 2 seconds to batch rapid updates (e.g., tasbih counter)
   - Write to Firestore via `setUserProgress()`
   - Silently fails on network errors (data safe in localStorage)

3. **Pull (cloud → local)**
   - `onSnapshot` listener for real-time cross-device updates
   - Updates Zustand store with `setSyncData()` (atomic bulk setter)
   - Error handler logs snapshot failures

### Echo Guard

Prevents infinite push-pull loops:

- `isSyncingRef` — boolean ref, set to `true` during cloud→local writes, wrapped in `try/finally`
- Push effect skips when `isSyncingRef.current === true`
- Push effect also skips when `lastSyncedAt` changed (indicates a sync-originated update)

### dailyGoals Key Conversion

Zustand uses numeric keys (`Record<number, boolean[]>`), but Firestore requires string keys. Two utility functions handle conversion:

- `toFirestoreGoals()` — numeric → string keys (for push)
- `fromFirestoreGoals()` — string → numeric keys (for pull)

---

## Lazy Initialization Pattern

Firebase SDK is **not** initialized at module import time. This prevents:

- Build failures during Next.js SSR/static generation (no env vars at build time)
- Test failures (no Firebase config in test environment)

```typescript
// src/lib/firebase/config.ts
let _auth: Auth | null = null;

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}
```

All consumers call `getFirebaseAuth()` / `getFirebaseDb()` instead of importing direct instances.

---

## Environment Variables

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

All prefixed with `NEXT_PUBLIC_` — safely exposed client-side. Security is enforced by Firestore rules and Firebase Auth domain restrictions.

---

## Auth UI Pages

### Login (`/login`)

- Email + password form with validation
- Google sign-in button
- Error display for invalid credentials
- Link to signup page
- Redirects to `/` on success

### Signup (`/signup`)

- Display name + email + password + confirm password
- Client-side validation: password match, minimum 6 characters
- Google sign-in button
- Error display for duplicate emails
- Link to login page
- Redirects to `/` on success

### User Menu (Header)

Three states:

| State | Display |
|-------|---------|
| Loading | Spinner |
| Not authenticated | "تسجيل الدخول" link → `/login` |
| Authenticated | Avatar button → dropdown (name, email, logout) |

Google profile photos use `referrerPolicy="no-referrer"` to prevent loading issues.

---

## Test Coverage

### Merge Logic Tests (9 tests)

- OR-merges fastingDays (never loses a fasted day)
- Unions completedJuz and sorts them
- OR-merges dailyGoals per day per goal
- Takes the higher tasbihCount
- Prefers local selectedCity
- Handles empty cloud data (first sync)
- Handles empty local data (fresh device)
- Handles different-length fastingDays arrays
- Handles dailyGoals with different-length goal arrays

### Auth Hook Tests (5 tests)

- Throws when used outside AuthProvider
- Returns null user initially
- Returns loading state
- Returns authenticated user
- Exposes auth methods

### Testing Strategy

- Merge logic is extracted to `merge.ts` (pure functions, no Firebase SDK dependency) — tests run without any Firebase mocking
- Auth tests mock `@/lib/firebase/config` and `firebase/auth` to avoid Firebase initialization
- Header tests mock `@/components/user-menu` entirely to isolate from Firebase

---

## Best Practices Applied

1. **Lazy initialization** — Firebase SDK initialized on first use, not at import time
2. **Graceful degradation** — App works fully without Firebase config
3. **Echo guard with try/finally** — `isSyncingRef` always reset even if `setSyncData` throws
4. **Debounced writes** — 2-second debounce prevents excessive Firestore writes
5. **Merge: true on all setDoc calls** — Prevents accidental data overwrites
6. **onSnapshot error handler** — Logs Firestore listener errors
7. **referrerPolicy on avatar** — Prevents Google profile photo loading issues
8. **Atomic bulk setter** — `setSyncData()` updates all fields in a single `set()` call
9. **Cancellation token** — Initial sync checks `cancelled` flag after async operations
10. **Pure merge functions** — Separated from Firebase SDK for testability
