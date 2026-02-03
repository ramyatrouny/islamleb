"use client";

import { motion } from "framer-motion";

interface FloatingShapeProps {
  size: number;
  x: string;
  y: string;
  delay: number;
  duration: number;
  rotate: number;
}

export function FloatingShape({ size, x, y, delay, duration, rotate }: FloatingShapeProps) {
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

export const FLOATING_SHAPES_DATA: FloatingShapeProps[] = [
  { size: 10, x: "8%", y: "15%", delay: 0, duration: 8, rotate: 180 },
  { size: 7, x: "85%", y: "12%", delay: 1.2, duration: 10, rotate: -120 },
  { size: 12, x: "18%", y: "70%", delay: 2.5, duration: 9, rotate: 90 },
  { size: 6, x: "75%", y: "65%", delay: 0.8, duration: 11, rotate: -180 },
  { size: 8, x: "50%", y: "20%", delay: 3, duration: 7, rotate: 150 },
  { size: 9, x: "92%", y: "45%", delay: 1.8, duration: 8.5, rotate: -90 },
];

export function FloatingShapesLayer() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {FLOATING_SHAPES_DATA.map((shape, i) => (
        <FloatingShape key={i} {...shape} />
      ))}
    </div>
  );
}
