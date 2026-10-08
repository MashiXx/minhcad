import type { Transition, Variants } from "motion/react";
import { distance, duration, ease, stagger } from "./tokens";

const base = (d: number = duration.normal, delay = 0): Transition => ({
  duration: d,
  ease: ease.out,
  delay,
});

export function fadeIn(delay = 0, d: number = duration.normal): Variants {
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: base(d, delay) },
  };
}

export function fadeUp(delay = 0, y: number = distance.md, d: number = duration.large): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: { opacity: 1, y: 0, transition: base(d, delay) },
  };
}

export function fadeSide(
  from: "left" | "right",
  delay = 0,
  x: number = distance.lg,
): Variants {
  return {
    hidden: { opacity: 0, x: from === "left" ? -x : x },
    visible: { opacity: 1, x: 0, transition: base(duration.large, delay) },
  };
}

export function scaleIn(delay = 0, from = 0.96): Variants {
  return {
    hidden: { opacity: 0, scale: from },
    visible: { opacity: 1, scale: 1, transition: base(duration.large, delay) },
  };
}

export function staggerChildren(each: number = stagger.normal, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: Math.min(each, stagger.max), delayChildren },
    },
  };
}

/** Masked image reveal: clip-path wipes left → right. */
export function revealImage(delay = 0): Variants {
  return {
    hidden: { clipPath: "inset(0 100% 0 0)" },
    visible: {
      clipPath: "inset(0 0% 0 0)",
      transition: { duration: 1.1, ease: ease.out, delay },
    },
  };
}

/** Line reveal: each line rises out of a clipped container. */
export function revealText(delay = 0): Variants {
  return {
    hidden: { y: "105%" },
    visible: { y: "0%", transition: { duration: duration.large, ease: ease.out, delay } },
  };
}

/** Reduced-motion substitute: simple opacity fade, no transforms. */
export const reducedFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.normal } },
};
