"use client";

import { motion, useMotionValue } from "motion/react";
import { useEffect } from "react";

/** Thin progress line under the navbar that tracks reading through one element. */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const progress = useMotionValue(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const value = total <= 0 ? 1 : (window.innerHeight * 0.4 - rect.top) / total;
      progress.set(Math.min(1, Math.max(0, value)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetId, progress]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[var(--nav-height)] z-40 h-px">
      <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-accent" />
    </div>
  );
}
