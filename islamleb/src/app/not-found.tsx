"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/*  Animated star with twinkle + drift                                 */
/* ------------------------------------------------------------------ */
function Star({
  size,
  x,
  y,
  delay,
}: {
  size: number;
  x: string;
  y: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: 0 }}
      animate={{
        opacity: [0, 1, 0.4, 1, 0],
        scale: [0, 1.2, 0.8, 1.1, 0],
        rotate: [0, 90, 180, 270, 360],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2 + 1,
      }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z"
          fill="#d4a574"
          fillOpacity={0.7}
        />
      </svg>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rising particle with horizontal sway                               */
/* ------------------------------------------------------------------ */
function Particle({ x, delay }: { x: string; delay: number }) {
  const sway = Math.random() > 0.5 ? 15 : -15;
  return (
    <motion.div
      initial={{ opacity: 0, y: 80, x: 0 }}
      animate={{ opacity: [0, 0.6, 0.3, 0], y: -250, x: [0, sway, -sway, 0] }}
      transition={{
        duration: 7,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      className="absolute w-1 h-1 rounded-full bg-[#d4a574]/40 pointer-events-none"
      style={{ left: x, bottom: "5%" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Animated arch path (draws itself)                                  */
/* ------------------------------------------------------------------ */
function AnimatedPath({
  d,
  gradientId,
  strokeWidth,
  delay,
  opacity,
}: {
  d: string;
  gradientId: string;
  strokeWidth: number;
  delay: number;
  opacity?: number;
}) {
  return (
    <motion.path
      d={d}
      stroke={`url(#${gradientId})`}
      strokeWidth={strokeWidth}
      fill="none"
      opacity={opacity}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: opacity ?? 1 }}
      transition={{ duration: 2.5, delay, ease: "easeInOut" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const STARS = [
  { size: 10, x: "10%", y: "15%", delay: 0 },
  { size: 7, x: "20%", y: "8%", delay: 0.8 },
  { size: 12, x: "75%", y: "12%", delay: 0.3 },
  { size: 8, x: "85%", y: "20%", delay: 1.2 },
  { size: 6, x: "60%", y: "6%", delay: 1.8 },
  { size: 9, x: "35%", y: "18%", delay: 0.5 },
  { size: 5, x: "90%", y: "35%", delay: 2.1 },
  { size: 11, x: "5%", y: "30%", delay: 1.5 },
  { size: 6, x: "50%", y: "10%", delay: 2.5 },
  { size: 8, x: "15%", y: "40%", delay: 0.9 },
  { size: 7, x: "70%", y: "30%", delay: 1.1 },
  { size: 5, x: "45%", y: "22%", delay: 3.0 },
];

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  x: `${5 + i * 6.5}%`,
  delay: i * 0.4,
}));

/* Decorative dots on the arch with their staggered delays */
const ARCH_DOTS = [
  { cx: 140, cy: 42, r: 3, opacity: 0.3, delay: 2.8 },
  { cx: 80, cy: 72, r: 2.5, opacity: 0.25, delay: 3.0 },
  { cx: 200, cy: 72, r: 2.5, opacity: 0.25, delay: 3.0 },
  { cx: 52, cy: 120, r: 2, opacity: 0.2, delay: 3.2 },
  { cx: 228, cy: 120, r: 2, opacity: 0.2, delay: 3.2 },
];

/* ------------------------------------------------------------------ */
/*  404 Page                                                           */
/* ------------------------------------------------------------------ */
export default function NotFound() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
      {/* Animated radial glows — breathing pulse */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#d4a574] pointer-events-none blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.09, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#2d6a4f] pointer-events-none blur-[80px]"
      />

      {/* Stars */}
      {STARS.map((star, i) => (
        <Star key={i} {...star} />
      ))}

      {/* Rising particles */}
      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}

      {/* Main content — gentle floating */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Islamic arch frame */}
          <div className="relative">
            <motion.svg
              width="280"
              height="340"
              viewBox="0 0 280 340"
              fill="none"
              className="sm:w-[320px] sm:h-[390px]"
            >
              {/* Outer arch — draws itself */}
              <AnimatedPath
                d="M20 340 L20 140 Q20 20 140 20 Q260 20 260 140 L260 340"
                gradientId="archGrad"
                strokeWidth={2}
                delay={0.3}
              />
              {/* Inner arch — draws itself (delayed) */}
              <AnimatedPath
                d="M45 340 L45 155 Q45 50 140 50 Q235 50 235 155 L235 340"
                gradientId="archGradInner"
                strokeWidth={1.5}
                delay={0.8}
                opacity={0.5}
              />
              {/* Keystone diamond — fades in */}
              <motion.path
                d="M140 8 L148 20 L140 32 L132 20 Z"
                fill="#d4a574"
                fillOpacity="0.6"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.6, duration: 0.5, ease: "backOut" }}
                style={{ transformOrigin: "140px 20px" }}
              />
              {/* Decorative dots — pop in staggered */}
              {ARCH_DOTS.map((dot, i) => (
                <motion.circle
                  key={i}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.r}
                  fill="#d4a574"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, dot.opacity, dot.opacity * 0.5, dot.opacity],
                    scale: [0, 1.3, 1],
                  }}
                  transition={{
                    delay: dot.delay,
                    duration: 0.6,
                    opacity: {
                      delay: dot.delay,
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                  style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
                />
              ))}
              <defs>
                <linearGradient
                  id="archGrad"
                  x1="140"
                  y1="20"
                  x2="140"
                  y2="340"
                >
                  <stop offset="0%" stopColor="#d4a574" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#d4a574" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d4a574" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient
                  id="archGradInner"
                  x1="140"
                  y1="50"
                  x2="140"
                  y2="340"
                >
                  <stop offset="0%" stopColor="#2d6a4f" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#2d6a4f" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Content inside the arch */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-8 pt-6">
              {/* Crescent moon — rocking + pulsing glow */}
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-4 relative"
              >
                {/* Moon glow */}
                <motion.div
                  animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.4, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-[#d4a574]/20 blur-xl"
                />
                <motion.svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  initial={{ opacity: 0, scale: 0, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1.8, duration: 0.8, ease: "backOut" }}
                >
                  <defs>
                    <linearGradient
                      id="moonGrad"
                      x1="10"
                      y1="5"
                      x2="50"
                      y2="55"
                    >
                      <stop offset="0%" stopColor="#d4a574" />
                      <stop offset="100%" stopColor="#b8956a" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M35 5 A25 25 0 1 0 35 55 A20 20 0 1 1 35 5Z"
                    fill="url(#moonGrad)"
                    fillOpacity="0.85"
                  />
                </motion.svg>
              </motion.div>

              {/* Message */}
              <motion.h1
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 2.4, duration: 0.9 }}
                className="text-2xl sm:text-3xl font-bold font-(family-name:--font-amiri) gold-gradient-text mb-2 leading-relaxed"
              >
                الصفحة غير موجودة
              </motion.h1>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 3.0, duration: 0.6 }}
                className="w-16 h-px bg-linear-to-l from-transparent via-[#d4a574]/60 to-transparent mb-3"
              />

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.3, duration: 0.6 }}
                className="text-sm sm:text-base text-muted-foreground font-(family-name:--font-amiri) mb-1"
              >
                يبدو أنّك وصلت إلى مكان غير موجود
              </motion.p>

              {/* Quranic verse — shimmer effect */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.8, duration: 0.8 }}
                className="text-center mt-3 relative"
              >
                <motion.div
                  animate={{ opacity: [0, 0.15, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 5,
                  }}
                  className="absolute -inset-3 rounded-lg bg-[#d4a574] blur-md pointer-events-none"
                />
                <p className="relative text-sm sm:text-base text-[#d4a574]/80 font-(family-name:--font-amiri) leading-relaxed max-w-[220px]">
                  ﴿ وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ﴾
                </p>
                <p className="relative text-[11px] text-muted-foreground/50 mt-1">
                  سورة الطلاق - ٣
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Return home button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.2, duration: 0.6 }}
          className="mt-8"
        >
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
          >
            <Button
              asChild
              size="lg"
              className="gap-2 bg-[#d4a574]/15 text-[#d4a574] border border-[#d4a574]/30 hover:bg-[#d4a574]/25 hover:border-[#d4a574]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,165,116,0.2)]"
            >
              <Link href="/">
                <Home className="w-4 h-4" />
                العودة للرئيسية
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Bismillah */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.8, duration: 1 }}
          className="mt-6 text-xs text-muted-foreground/30 font-(family-name:--font-amiri)"
        >
          بسم الله الرحمن الرحيم
        </motion.p>
      </motion.div>
    </div>
  );
}
