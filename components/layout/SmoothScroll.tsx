"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";

let instance: Lenis | null = null;

/** Access the active Lenis instance (null when reduced motion is on). */
export function getLenis() {
  return instance;
}

/**
 * Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger
 * scrubs stay perfectly in sync. Disabled for reduced motion and touch.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: true,
      autoRaf: false,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, []);

  // New route: start at the top unless navigating to a hash.
  useEffect(() => {
    if (window.location.hash) return;
    instance?.scrollTo(0, { immediate: true });
    ScrollTrigger.refresh();
  }, [pathname]);

  return null;
}
