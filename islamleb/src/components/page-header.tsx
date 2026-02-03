"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  /** Page title (renders as gold gradient) */
  title: string;
  /** Subtitle text below the title */
  subtitle?: string;
  /** Optional icon displayed alongside the title */
  icon?: LucideIcon;
}

export function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-10 text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-3">
        {Icon && <Icon className="size-8 text-[#d4a574] shrink-0" />}
        <h1 className="gold-gradient-text text-4xl font-bold sm:text-5xl font-(family-name:--font-amiri) leading-normal pb-2">
          {title}
        </h1>
        {Icon && <Icon className="size-8 text-[#d4a574] shrink-0" />}
      </div>
      {subtitle && (
        <p className="text-muted-foreground text-lg sm:text-xl mt-2">
          {subtitle}
        </p>
      )}
      <div className="w-24 h-1 bg-gradient-to-l from-[#d4a574] to-[#2d6a4f] mx-auto mt-4 rounded-full" />
    </motion.header>
  );
}
