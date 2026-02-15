"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { fadeUpItem, staggerContainer } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Ayat al-Kursi — Quran 2:255                                       */
/* ------------------------------------------------------------------ */

const AYAT_AL_KURSI =
  "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ";

const VIRTUES = [
  "أعظم آية في كتاب الله عزّ وجلّ",
  "من قرأها في ليلة لم يزل عليه من الله حافظ ولا يقربه شيطان حتى يصبح",
  "من قرأها دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت",
];

const FACTS = [
  {
    title: "أسماء الله الحسنى",
    text: "تتضمّن آية الكرسي خمسة من أسماء الله الحسنى: الله، الحيّ، القيّوم، العليّ، العظيم",
  },
  {
    title: "سيّدة آي القرآن",
    text: "سمّاها النبي ﷺ سيّدة آي القرآن الكريم لعظم ما تحمله من معاني التوحيد والتنزيه",
  },
  {
    title: "حفظ من الشيطان",
    text: "أقرّ الشيطان نفسه بأنّ من قرأ آية الكرسي عند النوم لا يقربه شيطان حتى يصبح، وصدّقه النبي ﷺ",
  },
  {
    title: "سبب للدخول في حفظ الله",
    text: "من قرأها صباحاً كان في حفظ الله حتى يمسي، ومن قرأها مساءً كان في حفظ الله حتى يصبح",
  },
];

const WHEN_TO_READ = [
  "بعد كل صلاة مكتوبة",
  "قبل النوم",
  "في أذكار الصباح والمساء",
  "عند الخوف أو القلق",
  "عند دخول المنزل والخروج منه",
  "لحفظ الأهل والأولاد",
];

export default function AyatAlKursiPage() {
  return (
    <div className="min-h-screen bg-background">
      <motion.div
        className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Page header */}
        <motion.div variants={fadeUpItem}>
          <PageHeader
            title="آية الكرسي"
            subtitle="سورة البقرة — الآية ٢٥٥"
            icon={ShieldCheck}
          />
        </motion.div>

        {/* Bismillah */}
        <motion.div variants={fadeUpItem} className="mb-8 text-center">
          <p className="font-(family-name:--font-amiri) text-2xl text-[#d4a574] sm:text-3xl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </motion.div>

        {/* Main verse card */}
        <motion.div variants={fadeUpItem}>
          <div className="relative overflow-visible rounded-2xl border border-[#d4a574]/20 bg-card">
            {/* Top decorative bar */}
            <div className="h-1.5 rounded-t-2xl bg-gradient-to-l from-[#d4a574] via-[#c9963e] to-[#2d6a4f]" />

            <div className="px-6 pt-12 pb-14 sm:px-10 sm:pt-16 sm:pb-18">
              {/* Decorative divider top */}
              <div className="mb-10 flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gradient-to-l from-[#d4a574]/50 to-transparent" />
                <span className="text-xl text-[#d4a574]/50">✦</span>
                <div className="h-px w-16 bg-gradient-to-r from-[#d4a574]/50 to-transparent" />
              </div>

              {/* The verse */}
              <p
                className="font-(family-name:--font-amiri) text-center text-[1.65rem] leading-[3] text-foreground sm:text-[2rem] sm:leading-[3] md:text-[2.3rem] md:leading-[3]"
              >
                {AYAT_AL_KURSI}
              </p>

              {/* Decorative divider bottom */}
              <div className="mt-10 flex items-center justify-center gap-3">
                <div className="h-px w-16 bg-gradient-to-l from-[#d4a574]/50 to-transparent" />
                <span className="text-xl text-[#d4a574]/50">✦</span>
                <div className="h-px w-16 bg-gradient-to-r from-[#d4a574]/50 to-transparent" />
              </div>
            </div>

            {/* Bottom decorative bar */}
            <div className="h-1.5 rounded-b-2xl bg-gradient-to-l from-[#2d6a4f] via-[#c9963e] to-[#d4a574]" />
          </div>
        </motion.div>

        {/* Surah & Ayah reference */}
        <motion.div variants={fadeUpItem} className="mt-6 text-center">
          <span className="inline-block rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 px-5 py-2 text-sm text-[#d4a574]">
            سورة البقرة — الآية ٢٥٥
          </span>
        </motion.div>

        {/* Virtues / Fadl section */}
        <motion.div variants={fadeUpItem} className="mt-10">
          <h2 className="mb-5 text-center text-xl font-bold text-foreground font-(family-name:--font-amiri)">
            فضل آية الكرسي
          </h2>
          <div className="space-y-3">
            {VIRTUES.map((virtue, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border border-[#d4a574]/10 bg-card p-4"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d4a574]/10 text-sm font-bold text-[#d4a574]">
                  {["١", "٢", "٣"][i]}
                </span>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {virtue}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Facts section */}
        <motion.div variants={fadeUpItem} className="mt-10">
          <h2 className="mb-5 text-center text-xl font-bold text-foreground font-(family-name:--font-amiri)">
            حقائق وفوائد
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {FACTS.map((fact, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#d4a574]/10 bg-card p-5"
              >
                <h3 className="mb-2 text-[15px] font-bold text-[#d4a574]">
                  {fact.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {fact.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* When to read section */}
        <motion.div variants={fadeUpItem} className="mt-10 mb-4">
          <h2 className="mb-5 text-center text-xl font-bold text-foreground font-(family-name:--font-amiri)">
            متى تُقرأ آية الكرسي؟
          </h2>
          <div className="rounded-xl border border-[#d4a574]/10 bg-card p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {WHEN_TO_READ.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2d6a4f]/15 text-xs text-[#2d6a4f]">
                    ✓
                  </span>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
