/**
 * Shared motion timing. Every animation on the site draws from these values.
 * Durations are in seconds (Motion / GSAP convention).
 */
export const duration = {
  micro: 0.2,
  normal: 0.4,
  large: 0.8,
  cinematic: 1.4,
} as const;

/** cubic-bezier(0.22, 1, 0.36, 1) — fast start, long settle. */
export const ease = {
  out: [0.22, 1, 0.36, 1] as [number, number, number, number],
  inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  gsapOut: "expo.out",
  gsapInOut: "power3.inOut",
} as const;

export const stagger = {
  tight: 0.06,
  normal: 0.08,
  /** Upper bound for any list stagger on the site. */
  max: 0.1,
} as const;

export const spring = {
  /** Premium, low-overshoot spring for UI elements. */
  ui: { type: "spring", stiffness: 260, damping: 30, mass: 0.9 },
  /** Softer spring for larger surfaces such as drawers. */
  surface: { type: "spring", stiffness: 180, damping: 28, mass: 1 },
} as const;

/** Distance values (px) used by entrance animations. */
export const distance = {
  sm: 8,
  md: 20,
  lg: 32,
} as const;
