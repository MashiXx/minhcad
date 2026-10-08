"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { robotFallbackImage } from "@/lib/three/config";
import { cn } from "@/lib/utils";

/**
 * Technical loading state. Appears only if loading takes longer than
 * ~300ms, so fast loads never flicker.
 */
export function ViewerLoader({
  visible,
  label = "Initializing viewport",
  progress = null,
}: {
  visible: boolean;
  label?: string;
  /** 0..100 when known (e.g. GLB download); indeterminate otherwise. */
  progress?: number | null;
}) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!visible) return;
    const id = window.setTimeout(() => setShown(true), 300);
    return () => window.clearTimeout(id);
  }, [visible]);

  const pct = progress === null ? null : Math.round(progress);
  const filled = pct === null ? null : Math.round(pct / 10);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300",
        visible && shown ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
        <span>{label}</span>
        {filled === null ? (
          <span className="relative block h-px w-40 overflow-hidden bg-white/10">
            <span className="absolute inset-y-0 left-0 w-full origin-left bg-accent [animation:loader-bar_1.2s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
          </span>
        ) : (
          <span className="tabular-nums tracking-normal text-fg/80">
            {"█".repeat(filled)}
            <span className="text-white/15">{"░".repeat(10 - filled)}</span> {pct}%
          </span>
        )}
      </div>
    </div>
  );
}

/** Shown when WebGL is unavailable or the model fails to load. */
export function ViewerFallback({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div className={cn("absolute inset-0 flex flex-col items-center justify-center", className)}>
      <div className="relative h-[78%] w-full">
        <Image
          src={robotFallbackImage}
          alt="KufCad 3D workspace showing an industrial robot arm model"
          fill
          priority={priority}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain [mask-image:radial-gradient(ellipse_at_center,#000_55%,transparent_80%)]"
        />
      </div>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        Interactive 3D preview unavailable.
      </p>
    </div>
  );
}
