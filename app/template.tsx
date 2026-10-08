"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { duration, ease } from "@/lib/motion/tokens";

/** Short, understated route transition: opacity + 8px rise. */
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: duration.normal - 0.05, ease: ease.out }}
    >
      {children}
    </motion.div>
  );
}
