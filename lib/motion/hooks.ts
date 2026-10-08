"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type RefObject } from "react";

function subscribeMedia(query: string) {
  return (callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", callback);
    return () => mql.removeEventListener("change", callback);
  };
}

/** SSR-safe media query. Returns `fallback` on the server. */
export function useMediaQuery(query: string, fallback = false) {
  const subscribe = useMemo(() => subscribeMedia(query), [query]);
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True for devices whose primary pointer is fine and can hover (desktop). */
export function useFinePointer() {
  return useMediaQuery("(hover: hover) and (pointer: fine)");
}

/** Observe whether an element is near the viewport. */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = "200px", once = false }: { rootMargin?: string; once?: boolean } = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}
