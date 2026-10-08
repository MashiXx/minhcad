"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import {
  fadeIn,
  fadeSide,
  fadeUp,
  reducedFade,
  revealImage,
  scaleIn,
  staggerChildren,
} from "@/lib/motion/variants";
import { stagger as staggerTokens } from "@/lib/motion/tokens";

export type RevealPreset = "fadeUp" | "fadeIn" | "scaleIn" | "left" | "right" | "image";

const presets: Record<RevealPreset, (delay: number) => Variants> = {
  fadeUp: (d) => fadeUp(d),
  fadeIn: (d) => fadeIn(d),
  scaleIn: (d) => scaleIn(d),
  left: (d) => fadeSide("left", d),
  right: (d) => fadeSide("right", d),
  image: (d) => revealImage(d),
};

const tags = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  article: motion.article,
  header: motion.header,
  figure: motion.figure,
  span: motion.span,
  p: motion.p,
} as const;

type Tag = keyof typeof tags;

type MotionRevealProps = {
  children: ReactNode;
  preset?: RevealPreset;
  delay?: number;
  className?: string;
  as?: Tag;
  /** Portion of the element that must be visible before revealing. */
  amount?: number;
  id?: string;
};

/** Reveals content once when it scrolls into view. */
export function MotionReveal({
  children,
  preset = "fadeUp",
  delay = 0,
  className,
  as = "div",
  amount = 0.25,
  id,
}: MotionRevealProps) {
  const reduce = useReducedMotion();
  const Component = tags[as];

  // A fully clipped element never registers as intersecting, so the
  // clip-path lives on an inner layer while the outer one is observed.
  if (preset === "image") {
    return (
      <Component
        id={id}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount }}
        variants={{ hidden: {}, visible: {} }}
      >
        <motion.div variants={reduce ? reducedFade : presets.image(delay)}>{children}</motion.div>
      </Component>
    );
  }

  return (
    <Component
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={reduce ? reducedFade : presets[preset](delay)}
    >
      {children}
    </Component>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
  delay?: number;
  amount?: number;
};

/** Parent that staggers its RevealItem children (max 100ms apart). */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = staggerTokens.normal,
  delay = 0,
  amount = 0.2,
}: RevealGroupProps) {
  const Component = tags[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerChildren(stagger, delay)}
    >
      {children}
    </Component>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  as?: Tag;
  preset?: RevealPreset;
};

export function RevealItem({ children, className, as = "div", preset = "fadeUp" }: RevealItemProps) {
  const reduce = useReducedMotion();
  const Component = tags[as];
  return (
    <Component className={className} variants={reduce ? reducedFade : presets[preset](0)}>
      {children}
    </Component>
  );
}
