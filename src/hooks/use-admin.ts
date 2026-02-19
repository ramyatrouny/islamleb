"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { getUserRole } from "@/lib/firebase/firestore";

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    getUserRole(user.uid)
      .then((role) => {
        if (!cancelled) {
          setIsAdmin(role === "admin");
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { isAdmin, loading: authLoading || loading };
}
