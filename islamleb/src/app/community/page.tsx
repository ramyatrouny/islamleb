"use client";

import { motion } from "framer-motion";
import { Users, Shield, Bell, MessageSquare, BookOpen, Heart, Sparkles } from "lucide-react";
import { DecorativeBackground } from "@/components/decorative-background";
import { Card, CardContent } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// Floating geometric shapes for atmosphere
// ---------------------------------------------------------------------------

function FloatingShape({
  size,
  x,
  y,
  delay,
  duration,
  rotate,
}: {
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
  rotate: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.12, 0.06, 0.12, 0],
        scale: [0.8, 1, 0.9, 1, 0.8],
        rotate: [0, rotate, rotate * 2],
        y: [0, -15, 0, 15, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
          fill="#d4a574"
          fillOpacity={0.5}
        />
      </svg>
    </motion.div>
  );
}

const FLOATING_SHAPES = [
  { size: 10, x: "8%", y: "15%", delay: 0, duration: 8, rotate: 180 },
  { size: 7, x: "85%", y: "12%", delay: 1.2, duration: 10, rotate: -120 },
  { size: 12, x: "18%", y: "70%", delay: 2.5, duration: 9, rotate: 90 },
  { size: 6, x: "75%", y: "65%", delay: 0.8, duration: 11, rotate: -180 },
  { size: 8, x: "50%", y: "20%", delay: 3, duration: 7, rotate: 150 },
  { size: 9, x: "92%", y: "45%", delay: 1.8, duration: 8.5, rotate: -90 },
];

// Feature preview cards data
const FEATURES = [
  {
    icon: MessageSquare,
    title: "مشاركة المعرفة",
    description: "شارك آيات، أحاديث، ونصائح إسلامية مع المجتمع",
    color: "#2d6a4f",
  },
  {
    icon: Heart,
    title: "تفاعل مع الآخرين",
    description: "أعجب بالمنشورات وعلّق وتفاعل مع إخوانك في الدين",
    color: "#e07b5d",
  },
  {
    icon: BookOpen,
    title: "تصنيفات متنوعة",
    description: "رمضان، الصيام، القرآن، الحديث، الدعاء والمزيد",
    color: "#c9963e",
  },
  {
    icon: Shield,
    title: "بيئة آمنة ومراقبة",
    description: "محتوى إسلامي حصري تحت إشراف ومراقبة صارمة",
    color: "#7c5cbf",
  },
];

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function CommunityPage() {
  return (
    <div
      className="min-h-screen overflow-x-clip"
      style={{
        backgroundColor: "#0a0a0f",
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(212,165,116,0.06) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(45,106,79,0.05) 0%, transparent 50%)",
      }}
    >
      <DecorativeBackground />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Floating decorative shapes */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {FLOATING_SHAPES.map((shape, i) => (
            <FloatingShape key={i} {...shape} />
          ))}
        </div>

        {/* Central glow */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[#d4a574] blur-[120px] pointer-events-none"
        />

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Glow ring */}
            <motion.div
              animate={{ opacity: [0.15, 0.3, 0.15], scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-[#d4a574]/20 blur-2xl scale-[2]"
            />
            <div
              className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "rgba(212,165,116,0.1)",
                border: "1.5px solid rgba(212,165,116,0.25)",
              }}
            >
              <Users size={36} style={{ color: "#d4a574" }} strokeWidth={1.5} />
            </div>
          </motion.div>
        </motion.div>

        {/* Coming Soon badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium"
            style={{
              backgroundColor: "rgba(45,106,79,0.15)",
              border: "1px solid rgba(45,106,79,0.3)",
              color: "#2d6a4f",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles size={13} />
            </motion.div>
            قريباً
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center text-4xl sm:text-5xl font-bold mb-4 font-(family-name:--font-amiri) leading-normal"
          style={{
            background: "linear-gradient(135deg, #d4a574, #f0d6a8, #c2955a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          مجتمع إسلام لبنان
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="w-24 h-px bg-linear-to-l from-transparent via-[#d4a574]/50 to-transparent mx-auto mb-5"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center text-base sm:text-lg leading-relaxed mb-4 max-w-xl mx-auto"
          style={{ color: "rgba(245,240,235,0.6)" }}
        >
          منصة مجتمعية لمشاركة المعرفة الإسلامية والنصائح والفوائد الشرعية بين إخوانكم وأخواتكم في الدين
        </motion.p>

        {/* Moderation notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center text-sm mb-12 max-w-md mx-auto flex items-center justify-center gap-2"
          style={{ color: "rgba(245,240,235,0.35)" }}
        >
          <Shield size={14} className="flex-shrink-0" />
          منصة مُراقبة بشكل صارم — أي محتوى غير إسلامي أو غير مناسب سيتم حذفه فوراً
        </motion.p>

        {/* Feature preview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
            >
              <Card
                className="border-0 h-full transition-colors duration-300 hover:border-[rgba(212,165,116,0.15)]"
                style={{
                  backgroundColor: "rgba(20,20,37,0.6)",
                  borderColor: "rgba(255,255,255,0.06)",
                  borderWidth: "1px",
                }}
              >
                <CardContent className="p-5 flex items-start gap-3.5">
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: feature.color + "18",
                      border: `1px solid ${feature.color}30`,
                    }}
                  >
                    <feature.icon size={20} style={{ color: feature.color }} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3
                      className="text-sm font-semibold mb-1"
                      style={{ color: "rgba(245,240,235,0.9)" }}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "rgba(245,240,235,0.45)" }}
                    >
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Notification signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center"
        >
          <Card
            className="border-0 overflow-hidden relative"
            style={{
              background:
                "linear-gradient(135deg, rgba(45,106,79,0.12) 0%, rgba(212,165,116,0.08) 50%, rgba(45,106,79,0.12) 100%)",
              borderColor: "rgba(45,106,79,0.25)",
              borderWidth: "1px",
            }}
          >
            {/* Shimmer */}
            <motion.div
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(212,165,116,0.05), transparent)",
                width: "50%",
              }}
            />

            <CardContent className="p-6 sm:p-8 relative">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex justify-center mb-4"
              >
                <Bell size={28} style={{ color: "#d4a574" }} strokeWidth={1.5} />
              </motion.div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "#d4a574" }}
              >
                كن أول من يعلم
              </h3>
              <p
                className="text-sm mb-5 max-w-sm mx-auto leading-relaxed"
                style={{ color: "rgba(245,240,235,0.5)" }}
              >
                نعمل على تجهيز هذه المنصة لتكون مكاناً آمناً ومفيداً لمشاركة العلم الشرعي. ترقبوا الإطلاق قريباً بإذن الله.
              </p>
              <div
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                style={{
                  backgroundColor: "rgba(212,165,116,0.1)",
                  border: "1px solid rgba(212,165,116,0.2)",
                  color: "rgba(212,165,116,0.7)",
                }}
              >
                <Sparkles size={15} />
                سيتم الإعلان عن موعد الإطلاق قريباً
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
