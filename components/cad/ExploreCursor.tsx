"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/motion/hooks";
import { cn } from "@/lib/utils";

/**
 * Desktop-only cursor indicator ("Explore") for specific interactive visuals.
 * The native cursor is never hidden; this follows it as a subtle companion.
 */
export function ExploreCursor({ children, label = "Explore", className }: { children: ReactNode; label?: string; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const [inside, setInside] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !finePointer) return;
    let raf = 0;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };

    const onMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pos.tx = e.clientX - rect.left;
      pos.ty = e.clientY - rect.top;
    };
    const loop = () => {
      const k = reduce ? 1 : 0.22;
      pos.x += (pos.tx - pos.x) * k;
      pos.y += (pos.ty - pos.y) * k;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${pos.x + 14}px, ${pos.y + 14}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onEnter = (e: PointerEvent) => {
      onMove(e);
      pos.x = pos.tx;
      pos.y = pos.ty;
      setInside(true);
      raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      setInside(false);
      cancelAnimationFrame(raf);
    };
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [finePointer, reduce]);

  return (
    <div ref={hostRef} className={cn("relative", className)}>
      {children}
      {finePointer ? (
        <div
          ref={dotRef}
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-30 flex items-center gap-2 transition-opacity duration-200",
            inside ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="size-2.5 rounded-full border border-accent-hover bg-accent/30" />
          <span className="rounded-sm bg-bg/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-fg/90 backdrop-blur">
            {label}
          </span>
        </div>
      ) : null}
    </div>
  );
}
