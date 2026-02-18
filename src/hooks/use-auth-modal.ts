import { create } from "zustand";

type AuthTab = "login" | "signup";

interface AuthModalStore {
  isOpen: boolean;
  tab: AuthTab;
  open: (tab?: AuthTab) => void;
  close: () => void;
  setTab: (tab: AuthTab) => void;
}

export const useAuthModal = create<AuthModalStore>((set) => ({
  isOpen: false,
  tab: "login",
  open: (tab = "login") => set({ isOpen: true, tab }),
  close: () => set({ isOpen: false }),
  setTab: (tab) => set({ tab }),
}));
