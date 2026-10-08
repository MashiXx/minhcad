"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { ViewerFallback, ViewerLoader } from "./ViewerStatus";
import type { RobotStats } from "./RobotScene";
import type { ViewMode } from "@/lib/three/rig";
import { useFinePointer, useInView, useMediaQuery, usePrefersReducedMotion } from "@/lib/motion/hooks";
import { cn } from "@/lib/utils";

const RobotCanvas = dynamic(() => import("./RobotCanvas"), { ssr: false });

class ViewerErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("[KufCad] 3D viewer failed, showing static fallback.", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type RobotViewerProps = {
  variant: "hero" | "inspector";
  mode?: ViewMode;
  progressRef?: MutableRefObject<number>;
  onStats?: (stats: RobotStats) => void;
  className?: string;
  /** Show the "Drag to rotate" hint (inspector). */
  hint?: boolean;
};

export function RobotViewer({ variant, mode = "solid", progressRef, onStats, className, hint = false }: RobotViewerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  const isTouch = useMediaQuery("(pointer: coarse)");
  const near = useInView(hostRef, { rootMargin: "300px" });
  const visible = useInView(hostRef, { rootMargin: "0px" });

  const [mounted, setMounted] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [interacted, setInteracted] = useState(false);

  // Mount the canvas the first time the viewer approaches the viewport.
  useEffect(() => {
    if (!near || mounted) return;
    const id = window.requestAnimationFrame(() => {
      setWebgl(detectWebGL());
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(id);
  }, [near, mounted]);

  // Pointer parallax (desktop only). Hero listens to the whole window.
  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    const target: HTMLElement | Window = variant === "hero" ? window : hostRef.current ?? window;
    const onMove = (e: Event) => {
      const ev = e as PointerEvent;
      pointerRef.current.x = (ev.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = (ev.clientY / window.innerHeight) * 2 - 1;
    };
    target.addEventListener("pointermove", onMove, { passive: true });
    return () => target.removeEventListener("pointermove", onMove);
  }, [finePointer, reducedMotion, variant]);

  const handleReady = useCallback(() => setReady(true), []);
  const handleInteract = useCallback(() => setInteracted(true), []);

  const fallback = <ViewerFallback priority={variant === "hero"} />;

  return (
    <div ref={hostRef} className={cn("relative", className)}>
      {mounted && webgl === false ? fallback : null}
      {mounted && webgl ? (
        <ViewerErrorBoundary fallback={fallback}>
          <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
            <RobotCanvas
              className="!absolute inset-0"
              variant={variant}
              mode={mode}
              active={visible}
              progressRef={progressRef}
              pointerRef={pointerRef}
              reducedMotion={reducedMotion}
              enableZoom={isTouch}
              onStats={onStats}
              onReady={handleReady}
              onInteract={handleInteract}
            />
          </div>
          <ViewerLoader visible={!ready} />
        </ViewerErrorBoundary>
      ) : null}

      {hint && webgl !== false ? (
        <p
          aria-hidden
          className={cn(
            "pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-line bg-bg/70 px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted backdrop-blur transition-opacity duration-500",
            ready && !interacted ? "opacity-100" : "opacity-0",
          )}
        >
          {isTouch ? "Drag to rotate · Pinch to zoom" : "Drag to rotate"}
        </p>
      ) : null}
    </div>
  );
}
