"use client";

import {
  createContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/config";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
} from "@/lib/firebase/auth";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        getFirebaseAuth(),
        (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        },
      );
      return unsubscribe;
    } catch {
      // Firebase not configured — app works without auth
      setLoading(false);
    }
  }, []);

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      await signInWithEmail(email, password);
    },
    [],
  );

  const handleSignUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      await signUpWithEmail(email, password, displayName);
    },
    [],
  );

  const handleSignInGoogle = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signInGoogle: handleSignInGoogle,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
