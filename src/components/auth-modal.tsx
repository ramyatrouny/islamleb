"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Mail, Lock, User, Loader2, X, Eye, EyeOff } from "lucide-react";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/icons/google";

// ─── Password Toggle Button ─────────────────────────────────────────────────

function PasswordToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute end-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      tabIndex={-1}
      aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

// ─── Login Form ──────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const { signIn, signInGoogle } = useAuth();
  const setTab = useAuthModal((s) => s.setTab);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      onSuccess();
    } catch {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInGoogle();
      onSuccess();
    } catch {
      setError("فشل تسجيل الدخول بحساب Google");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Google Sign-In */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2.5 h-11 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        تسجيل الدخول بحساب Google
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">أو</span>
        </div>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="login-email"
              type="email"
              placeholder="example@email.com"
              dir="ltr"
              className="ps-10 text-left"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="login-password">كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              dir="ltr"
              className="ps-10 pe-10 text-left"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              autoComplete="current-password"
            />
            <PasswordToggle
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-400 text-center rounded-lg bg-red-400/10 py-2 px-3 overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className="w-full h-11 transition-all duration-200 active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "تسجيل الدخول"
          )}
        </Button>
      </form>

      {/* Switch to signup */}
      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{" "}
        <button
          type="button"
          onClick={() => setTab("signup")}
          className="font-medium text-primary transition-colors duration-150 hover:text-primary/80 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
        >
          أنشئ حساباً
        </button>
      </p>
    </div>
  );
}

// ─── Signup Form ─────────────────────────────────────────────────────────────

function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const { signUp, signInGoogle } = useAuth();
  const setTab = useAuthModal((s) => s.setTab);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, displayName);
      onSuccess();
    } catch {
      setError("فشل إنشاء الحساب. قد يكون البريد الإلكتروني مستخدماً بالفعل");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInGoogle();
      onSuccess();
    } catch {
      setError("فشل تسجيل الدخول بحساب Google");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Google Sign-Up */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2.5 h-11 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-foreground transition-all duration-200 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={handleGoogle}
        disabled={googleLoading || loading}
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="h-4 w-4" />
        )}
        التسجيل بحساب Google
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border/60" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-3 text-muted-foreground">أو</span>
        </div>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">الاسم</Label>
          <div className="relative">
            <User className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="signup-name"
              type="text"
              placeholder="أدخل اسمك"
              className="ps-10"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={loading}
              autoComplete="name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-email">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="signup-email"
              type="email"
              placeholder="example@email.com"
              dir="ltr"
              className="ps-10 text-left"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-password">كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="6 أحرف على الأقل"
              dir="ltr"
              className="ps-10 pe-10 text-left"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              autoComplete="new-password"
            />
            <PasswordToggle
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="signup-confirm">تأكيد كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              id="signup-confirm"
              type={showPassword ? "text" : "password"}
              placeholder="أعد إدخال كلمة المرور"
              dir="ltr"
              className="ps-10 pe-10 text-left"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              disabled={loading}
              autoComplete="new-password"
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-sm text-red-400 text-center rounded-lg bg-red-400/10 py-2 px-3 overflow-hidden"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          className="w-full h-11 transition-all duration-200 active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "إنشاء حساب"
          )}
        </Button>
      </form>

      {/* Switch to login */}
      <p className="text-center text-sm text-muted-foreground">
        لديك حساب بالفعل؟{" "}
        <button
          type="button"
          onClick={() => setTab("login")}
          className="font-medium text-primary transition-colors duration-150 hover:text-primary/80 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-sm"
        >
          سجّل الدخول
        </button>
      </p>
    </div>
  );
}

// ─── Auth Modal ──────────────────────────────────────────────────────────────

export function AuthModal() {
  const { isOpen, tab, close } = useAuthModal();

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    },
    [close],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  const handleSuccess = useCallback(() => {
    close();
  }, [close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={tab === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border/60 bg-card shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={close}
              className="absolute end-3 top-3 z-10 rounded-lg p-1.5 text-muted-foreground transition-all duration-150 hover:bg-muted hover:text-foreground active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header with icon */}
            <div className="pt-8 pb-2 px-6 sm:px-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/5">
                <Moon className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {tab === "login" ? "مرحباً بعودتك" : "أهلاً بك"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {tab === "login"
                  ? "سجّل دخولك لحفظ تقدمك عبر الأجهزة"
                  : "أنشئ حسابك لحفظ تقدمك ومزامنته عبر الأجهزة"}
              </p>
            </div>

            {/* Tab selector */}
            <div className="flex mx-6 sm:mx-8 mt-4 rounded-xl bg-muted/50 p-1">
              <button
                onClick={() => useAuthModal.getState().setTab("login")}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                  tab === "login"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => useAuthModal.getState().setTab("signup")}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${
                  tab === "signup"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                إنشاء حساب
              </button>
            </div>

            {/* Form content */}
            <div className="p-6 sm:p-8 pt-5 sm:pt-5">
              {tab === "login" ? (
                <LoginForm onSuccess={handleSuccess} />
              ) : (
                <SignupForm onSuccess={handleSuccess} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
