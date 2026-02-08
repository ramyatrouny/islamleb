"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  /** Progress value 0-100 */
  progress: number;
  /** Outer diameter in pixels */
  size?: number;
  /** Ring stroke width */
  strokeWidth?: number;
  /** Progress stroke color */
  color?: string;
  /** Background ring color */
  bgColor?: string;
  /** Animation delay in seconds */
  delay?: number;
  /** Content rendered in the center */
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 192,
  strokeWidth = 12,
  color = "#2d6a4f",
  bgColor = "rgba(255,255,255,0.1)",
  delay = 0.5,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - progress / 100) }}
          transition={{ duration: 1, delay, ease: "easeOut" as const }}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
