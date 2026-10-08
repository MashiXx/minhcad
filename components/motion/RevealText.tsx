"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { duration, ease } from "@/lib/motion/tokens";

type RevealTextProps = {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  lineClassName?: string;
  /** Seconds between lines. */
  stagger?: number;
  delay?: number;
  /** Play on mount (hero) instead of when scrolled into view. */
  onMount?: boolean;
  id?: string;
};

/**
 * Line-based text reveal: each line rises from a clipped container.
 * Screen readers receive the full text once, not line fragments.
 */
export function RevealText({
  lines,
  as: Tag = "h2",
  className,
  lineClassName,
  stagger = 0.08,
  delay = 0,
  onMount = false,
  id,
}: RevealTextProps) {
  const reduce = useReducedMotion();
  const trigger = onMount
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };

  return (
    <Tag id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={cn("block will-change-transform", lineClassName)}
            initial="hidden"
            {...trigger}
            variants={
              reduce
                ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: duration.normal, delay: delay + i * stagger } } }
                : {
                    hidden: { y: "110%" },
                    visible: {
                      y: "0%",
                      transition: { duration: duration.large + 0.2, ease: ease.out, delay: delay + i * stagger },
                    },
                  }
            }
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
