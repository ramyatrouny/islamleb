"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Bug,
  Lightbulb,
  GitPullRequest,
  Send,
  ChevronDown,
  CheckCircle2,
  Code,
  Palette,
  Languages,
  TestTube,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { sectionReveal, staggerContainer, scaleUpItem } from "@/lib/animations";
import { useAuth } from "@/hooks/use-auth";
import { submitContactMessage } from "@/lib/firebase/firestore";

// ─── Config ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    value: "general",
    label: "تواصل عام",
    icon: MessageCircle,
    color: "text-[#d4a574]",
    description: "أرسل رسالتك أو استفسارك",
  },
  {
    value: "bug",
    label: "الإبلاغ عن مشكلة",
    icon: Bug,
    color: "text-red-400",
    description: "ساعدنا في تحسين التطبيق",
  },
  {
    value: "suggestion",
    label: "اقتراح",
    icon: Lightbulb,
    color: "text-amber-400",
    description: "شاركنا أفكارك لتحسين الموقع",
  },
  {
    value: "contribute",
    label: "المساهمة في المشروع",
    icon: GitPullRequest,
    color: "text-emerald-400",
    description: "انضم إلى فريق التطوير",
  },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

const PAGE_OPTIONS = [
  { value: "home", label: "الرئيسية" },
  { value: "prayer-times", label: "مواقيت الصلاة" },
  { value: "quran", label: "القرآن الكريم" },
  { value: "adhkar", label: "الأذكار" },
  { value: "tracker", label: "المتتبع" },
  { value: "zakat", label: "حاسبة الزكاة" },
  { value: "calendar", label: "التقويم" },
  { value: "other", label: "أخرى" },
];

const SUBJECT_OPTIONS = [
  { value: "question", label: "استفسار" },
  { value: "feedback", label: "ملاحظة" },
  { value: "other", label: "أخرى" },
];

const CONTRIBUTION_TYPES = [
  {
    icon: Code,
    title: "تطوير",
    description: "المساهمة في كتابة الكود وتطوير ميزات جديدة",
    color: "text-sky-400",
    bg: "bg-sky-500/15",
    border: "border-sky-500/30",
  },
  {
    icon: Palette,
    title: "تصميم",
    description: "تحسين واجهة المستخدم وتجربة الاستخدام",
    color: "text-[#d4a574]",
    bg: "bg-[#d4a574]/15",
    border: "border-[#d4a574]/30",
  },
  {
    icon: Languages,
    title: "محتوى وترجمة",
    description: "إضافة محتوى إسلامي أو ترجمة إلى لغات أخرى",
    color: "text-emerald-400",
    bg: "bg-[#2d6a4f]/20",
    border: "border-[#2d6a4f]/40",
  },
  {
    icon: TestTube,
    title: "اختبار",
    description: "اختبار التطبيق والإبلاغ عن الأخطاء والمشاكل",
    color: "text-purple-400",
    bg: "bg-purple-500/15",
    border: "border-purple-500/30",
  },
];

// ─── Select Component ────────────────────────────────────────────────────────

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs appearance-none transition-colors focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function ContactPage() {
  const { user } = useAuth();

  const [category, setCategory] = useState<Category | "">("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [page, setPage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-fill from auth
  useEffect(() => {
    if (user) {
      setName(user.displayName ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const activeCat = CATEGORIES.find((c) => c.value === category);

  const messagePlaceholder: Record<Category, string> = {
    general: "اكتب رسالتك هنا...",
    bug: "صف المشكلة التي واجهتها بالتفصيل... (ما الذي حدث؟ ما المتوقع؟)",
    suggestion: "شاركنا اقتراحك لتحسين الموقع...",
    contribute: "أخبرنا عن خبراتك وكيف تريد المساهمة...",
  };

  function resetForm() {
    setCategory("");
    setSubject("");
    setPage("");
    setMessage("");
    setError(null);
    if (!user) {
      setName("");
      setEmail("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) return;

    setError(null);
    setLoading(true);

    try {
      await submitContactMessage({
        category,
        name,
        email,
        ...(category === "general" && subject ? { subject } : {}),
        ...(category === "bug" && page ? { page } : {}),
        message,
        ...(user ? { uid: user.uid } : {}),
      });
      setSent(true);
    } catch {
      setError("حدث خطأ أثناء الإرسال. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PageHeader
          title="تواصل معنا"
          subtitle="نسعد بتواصلكم واقتراحاتكم لتطوير المشروع"
          icon={MessageCircle}
        />

        {/* ── Main Form Card ─────────────────────────────────────── */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <Card className="border-2 border-border/60">
            <CardContent className="p-5 sm:p-8">
              <AnimatePresence mode="wait">
                {sent ? (
                  /* ── Success State ────────────────────────────── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-4 ring-emerald-500/5">
                      <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      تم الإرسال بنجاح
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      شكراً لتواصلك معنا. سنرد عليك في أقرب وقت إن شاء الله.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSent(false);
                        resetForm();
                      }}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      إرسال رسالة أخرى
                    </Button>
                  </motion.div>
                ) : (
                  /* ── Form ─────────────────────────────────────── */
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Category Picker */}
                    <div className="space-y-3">
                      <Label>نوع الرسالة</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          const active = category === cat.value;
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setCategory(cat.value)}
                              className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 sm:p-4 text-center transition-all duration-200 active:scale-[0.97] ${
                                active
                                  ? "border-primary/50 bg-primary/10 shadow-sm"
                                  : "border-border/60 bg-transparent hover:border-border hover:bg-muted/30"
                              }`}
                            >
                              <Icon
                                className={`h-5 w-5 ${active ? cat.color : "text-muted-foreground"}`}
                              />
                              <span
                                className={`text-xs font-medium leading-tight ${
                                  active ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {cat.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dynamic description */}
                    <AnimatePresence>
                      {activeCat && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-sm text-muted-foreground overflow-hidden"
                        >
                          {activeCat.description}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">الاسم</Label>
                        <Input
                          id="contact-name"
                          placeholder="أدخل اسمك"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          disabled={loading}
                          autoComplete="name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">البريد الإلكتروني</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          placeholder="example@email.com"
                          dir="ltr"
                          className="text-left"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={loading}
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    {/* Conditional: Subject (general) */}
                    <AnimatePresence>
                      {category === "general" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Label htmlFor="contact-subject">الموضوع</Label>
                          <Select
                            id="contact-subject"
                            value={subject}
                            onChange={setSubject}
                            options={SUBJECT_OPTIONS}
                            placeholder="اختر الموضوع..."
                            disabled={loading}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Conditional: Page (bug) */}
                    <AnimatePresence>
                      {category === "bug" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Label htmlFor="contact-page">الصفحة المعنية</Label>
                          <Select
                            id="contact-page"
                            value={page}
                            onChange={setPage}
                            options={PAGE_OPTIONS}
                            placeholder="اختر الصفحة..."
                            disabled={loading}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">الرسالة</Label>
                      <Textarea
                        id="contact-message"
                        placeholder={
                          category ? messagePlaceholder[category] : "اكتب رسالتك هنا..."
                        }
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    {/* Error */}
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

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full sm:w-auto h-11 gap-2 transition-all duration-200 active:scale-[0.98]"
                      disabled={loading || !category}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      إرسال الرسالة
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.section>

        {/* ── Contribute Section ──────────────────────────────── */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Card className="border-2 border-[#2d6a4f]/30 bg-gradient-to-br from-[#2d6a4f]/5 to-background">
            <CardContent className="p-5 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[#2d6a4f]/20 flex items-center justify-center">
                  <GitPullRequest className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    ساهم في المشروع
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    المشروع مفتوح المصدر ونرحّب بمساهماتكم
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                نسعى لبناء منصة إسلامية شاملة تخدم المسلمين في لبنان والعالم
                العربي. إذا كنت ترغب في المساهمة، اختر المجال الذي يناسبك:
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {CONTRIBUTION_TYPES.map((type) => {
                  const IconComp = type.icon;
                  return (
                    <motion.div key={type.title} variants={scaleUpItem}>
                      <Card
                        className={`border ${type.border} ${type.bg} h-full transition-all duration-200 hover:scale-[1.02]`}
                      >
                        <CardContent className="p-4 flex items-start gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg ${type.bg} flex items-center justify-center shrink-0`}
                          >
                            <IconComp className={`w-4 h-4 ${type.color}`} />
                          </div>
                          <div>
                            <h3 className={`font-bold text-sm mb-0.5 ${type.color}`}>
                              {type.title}
                            </h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {type.description}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </motion.div>

              <div className="mt-6 p-4 rounded-lg bg-background/60 border border-[#2d6a4f]/20 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  للمساهمة، تواصل معنا عبر النموذج أعلاه أو عبر صفحة المشروع
                  على GitHub
                </p>
                <a
                  href="https://islamleb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#2d6a4f]/20 px-4 py-2 text-sm font-medium text-emerald-300 border border-[#2d6a4f]/40 transition-colors hover:bg-[#2d6a4f]/30"
                >
                  <Code className="w-4 h-4" />
                  زيارة المشروع على GitHub
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
