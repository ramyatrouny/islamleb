"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Bug,
  GitPullRequest,
  Code,
  Palette,
  Languages,
  TestTube,
  Send,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import {
  sectionReveal,
  staggerContainer,
  fadeUpItem,
  scaleUpItem,
} from "@/lib/animations";

// --- Subject options for contact form ---
const SUBJECT_OPTIONS = [
  { value: "", label: "اختر الموضوع..." },
  { value: "general", label: "استفسار عام" },
  { value: "suggestion", label: "اقتراح" },
  { value: "other", label: "أخرى" },
];

// --- Page options for bug report ---
const PAGE_OPTIONS = [
  { value: "", label: "اختر الصفحة..." },
  { value: "home", label: "الرئيسية" },
  { value: "prayer-times", label: "مواقيت الصلاة" },
  { value: "quran", label: "القرآن الكريم" },
  { value: "adhkar", label: "الأذكار" },
  { value: "tracker", label: "المتتبع" },
  { value: "zakat", label: "حاسبة الزكاة" },
  { value: "calendar", label: "التقويم" },
];

// --- Contribution types ---
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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <PageHeader
          title="تواصل معنا"
          subtitle="نسعد بتواصلكم واقتراحاتكم لتطوير المشروع"
          icon={MessageCircle}
        />

        {/* Section 1: Contact the Developer */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <Card className="border-2 border-[#d4a574]/30 bg-gradient-to-br from-[#d4a574]/5 to-background">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#d4a574]/15 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    تواصل مع المطوّر
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    أرسل رسالتك وسنرد عليك في أقرب وقت
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم</Label>
                    <Input
                      id="name"
                      placeholder="أدخل اسمك"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      dir="ltr"
                      className="text-left"
                      disabled
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">الموضوع</Label>
                  <div className="relative">
                    <select
                      id="subject"
                      disabled
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs appearance-none disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30"
                    >
                      {SUBJECT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">الرسالة</Label>
                  <Textarea
                    id="message"
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    disabled
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button disabled className="gap-2">
                    <Send className="w-4 h-4" />
                    إرسال
                  </Button>
                  <Badge className="bg-[#d4a574]/15 text-[#d4a574] border border-[#d4a574]/30">
                    قريباً
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 2: Report a Bug */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-500/5 to-background">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
                  <Bug className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    الإبلاغ عن مشكلة
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    ساعدنا في تحسين التطبيق بالإبلاغ عن أي خلل تجده
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="bug-page">الصفحة المعنية</Label>
                  <div className="relative">
                    <select
                      id="bug-page"
                      disabled
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs appearance-none disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30"
                    >
                      {PAGE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bug-description">وصف المشكلة</Label>
                  <Textarea
                    id="bug-description"
                    placeholder="صف المشكلة التي واجهتها بالتفصيل..."
                    rows={4}
                    disabled
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button disabled variant="destructive" className="gap-2">
                    <Bug className="w-4 h-4" />
                    إرسال البلاغ
                  </Button>
                  <Badge className="bg-[#d4a574]/15 text-[#d4a574] border border-[#d4a574]/30">
                    قريباً
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Section 3: Contribute */}
        <motion.section
          variants={sectionReveal}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-[#2d6a4f]/30 bg-gradient-to-br from-[#2d6a4f]/5 to-background">
            <CardContent className="p-6 sm:p-8">
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
                نسعى لبناء منصة رمضانية شاملة تخدم المسلمين في لبنان والعالم
                العربي. إذا كنت ترغب في المساهمة، اختر المجال الذي يناسبك:
              </p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {CONTRIBUTION_TYPES.map((type) => {
                  const IconComp = type.icon;
                  return (
                    <motion.div key={type.title} variants={scaleUpItem}>
                      <Card
                        className={`border ${type.border} ${type.bg} h-full transition-all duration-200 hover:scale-[1.02]`}
                      >
                        <CardContent className="p-5 flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-lg ${type.bg} flex items-center justify-center shrink-0`}
                          >
                            <IconComp className={`w-5 h-5 ${type.color}`} />
                          </div>
                          <div>
                            <h3 className={`font-bold mb-1 ${type.color}`}>
                              {type.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
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
                  للمساهمة، تواصل معنا عبر نموذج التواصل أعلاه أو عبر صفحة
                  المشروع على GitHub
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
