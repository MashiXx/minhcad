"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Layers, Ruler, FileStack, Workflow } from "lucide-react";
import { ScreenshotFrame } from "./ScreenshotFrame";
import { ExploreCursor } from "./ExploreCursor";
import { TechnicalLabel } from "@/components/ui/primitives";
import { gsap, useGSAP } from "@/lib/motion/gsap";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/motion/hooks";
import { screenshots } from "@/lib/content/assets";
import { cn } from "@/lib/utils";

type Region = { left: number; top: number; width: number; height: number };

const callouts: { id: string; title: string; body: string; icon: typeof Layers; region: Region }[] = [
  {
    id: "layers",
    title: "Layers & Blocks",
    body: "Separate carriageways, kerbs and markings into layers you can isolate, lock and plot.",
    icon: Layers,
    region: { left: 45, top: 24, width: 23, height: 40 },
  },
  {
    id: "measure",
    title: "Accurate Measurement",
    body: "Associative dimensions in double precision that update with the geometry.",
    icon: Ruler,
    region: { left: 63, top: 60, width: 20, height: 12 },
  },
  {
    id: "formats",
    title: "Multiple Formats",
    body: "Open DWG and DXF side by side, export to PDF, STEP and more.",
    icon: FileStack,
    region: { left: 3, top: 13.2, width: 30, height: 4.4 },
  },
  {
    id: "workflows",
    title: "Professional Workflows",
    body: "Properties, layouts and command line built for production drawing sets.",
    icon: Workflow,
    region: { left: 0, top: 17.5, width: 13.2, height: 76 },
  },
];

/** Zoom focus: the interchange centre, as a fraction of the screenshot. */
const FOCUS = { x: 0.57, y: 0.47 };
const MAX_ZOOM = 0.3;

export function CadViewport2D() {
  const rootRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const reduce = usePrefersReducedMotion();
  const finePointer = useFinePointer();
  // Shared animation state combined into one transform each frame.
  const state = useRef({ scroll: 0, hover: 0, px: 0, py: 0, tx: 0, ty: 0 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(rootRef);
        gsap.set(q("[data-overlay]"), { opacity: 0, y: 6 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            end: "center 45%",
            scrub: 0.8,
            onUpdate: (self) => {
              state.current.scroll = self.progress;
            },
          },
          defaults: { ease: "none" },
        });
        tl.to(q("[data-overlay='layer']"), { opacity: 1, y: 0, duration: 0.12 }, 0.3)
          .to(q("[data-overlay='measure']"), { opacity: 1, y: 0, duration: 0.12 }, 0.5)
          .to(q("[data-overlay='note']"), { opacity: 1, y: 0, duration: 0.12 }, 0.66)
          .to(q("[data-overlay='coords']"), { opacity: 1, y: 0, duration: 0.12 }, 0.8)
          .set({}, {}, 1);

        const render = () => {
          const s = state.current;
          s.px += (s.tx - s.px) * 0.08;
          s.py += (s.ty - s.py) * 0.08;
          const zoom = 1 + MAX_ZOOM * s.scroll * (1 - s.hover);
          if (zoomRef.current) {
            zoomRef.current.style.transform = `translate3d(${s.px}px, ${s.py}px, 0) scale(${zoom})`;
          }
        };
        gsap.ticker.add(render);
        return () => gsap.ticker.remove(render);
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // Hovering a callout eases the view back to full frame so its region is visible.
  useEffect(() => {
    if (reduce) return;
    const tween = gsap.to(state.current, { hover: active ? 1 : 0, duration: 0.7, ease: "expo.out" });
    return () => {
      tween.kill();
    };
  }, [active, reduce]);

  // Extremely subtle parallax: max ±5px, never distorts the image.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !finePointer || reduce) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      state.current.tx = ((e.clientX - r.left) / r.width - 0.5) * -10;
      state.current.ty = ((e.clientY - r.top) / r.height - 0.5) * -6;
    };
    const onLeave = () => {
      state.current.tx = 0;
      state.current.ty = 0;
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [finePointer, reduce]);

  return (
    <div ref={rootRef} className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.3fr)] lg:gap-12">
      {/* Feature callouts */}
      <ul className="order-2 flex flex-col gap-1 lg:order-1 lg:justify-center" aria-label="2D drafting capabilities">
        {callouts.map(({ id, title, body, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => setActive(id)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((v) => (v === id ? null : id))}
                className={cn(
                  "flex w-full gap-4 rounded-xl border p-4 text-left transition-[background-color,border-color] duration-300",
                  isActive ? "border-accent/35 bg-accent-soft" : "border-transparent hover:bg-white/[0.02]",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                    isActive ? "border-accent/40 text-accent-hover" : "border-line-strong text-muted",
                  )}
                >
                  <Icon aria-hidden className="size-4" strokeWidth={1.7} />
                </span>
                <span>
                  <span className="block text-[15px] font-medium text-fg">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{body}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Viewport */}
      <ExploreCursor className="order-1 min-w-0 lg:order-2">
        <ScreenshotFrame
          title="KSR-DIH-K12-GOZ-DRW-PLN-UP-001.dwg — KufCad"
          meta="Model · 1:1000"
          status={
            <>
              <span className="text-accent-hover">MODEL</span>
              <span className="hidden sm:inline">SNAP · GRID · ORTHO</span>
              <span className="ml-auto">Layers 42 · Entities 186,402</span>
            </>
          }
        >
          <div className="relative aspect-[836/408] w-full overflow-hidden">
            <div
              ref={zoomRef}
              className="absolute inset-0 will-change-transform"
              style={{ transformOrigin: `${FOCUS.x * 100}% ${FOCUS.y * 100}%` }}
            >
              <Image
                src={screenshots.cad2d.src}
                alt={screenshots.cad2d.alt}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                className="object-cover"
              />
              {/* Highlight regions live inside the zoom layer so they track the drawing */}
              {callouts.map(({ id, region }) => (
                <span
                  key={id}
                  aria-hidden
                  className={cn(
                    "absolute rounded-[3px] border transition-[opacity,box-shadow] duration-500",
                    active === id
                      ? "border-accent-hover opacity-100 shadow-[0_0_0_9999px_rgb(8_10_13/0.55),0_0_24px_rgb(47_123_255/0.45)]"
                      : "border-transparent opacity-0",
                  )}
                  style={{
                    left: `${region.left}%`,
                    top: `${region.top}%`,
                    width: `${region.width}%`,
                    height: `${region.height}%`,
                  }}
                />
              ))}
            </div>

            {/* Progressive technical overlays (frame space, always crisp) */}
            <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
              <div
                data-overlay="layer"
                className="absolute right-3 top-3 w-[168px] rounded-md border border-line-strong bg-bg/80 p-2.5 backdrop-blur"
              >
                <TechnicalLabel className="uppercase tracking-[0.16em] text-subtle">Layers</TechnicalLabel>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {[
                    ["C-ROAD-MARK", "#e639c4"],
                    ["C-LANDSCAPE", "#46a758"],
                    ["C-KERB", "#2f7bff"],
                    ["C-PARCEL", "#e5484d"],
                  ].map(([name, color]) => (
                    <li key={name} className="flex items-center gap-2">
                      <span className="size-2 rounded-[2px]" style={{ background: color }} />
                      <TechnicalLabel className="text-fg/80">{name}</TechnicalLabel>
                    </li>
                  ))}
                </ul>
              </div>

              <div data-overlay="measure" className="absolute left-[60%] top-[71%] flex w-[22%] items-center">
                <span className="h-2.5 w-px bg-accent-hover" />
                <span className="h-px flex-1 bg-accent-hover/70" />
                <span className="mx-1.5 rounded-sm bg-bg/80 px-1 py-0.5">
                  <TechnicalLabel tone="accent">24.60 m</TechnicalLabel>
                </span>
                <span className="h-px flex-1 bg-accent-hover/70" />
                <span className="h-2.5 w-px bg-accent-hover" />
              </div>

              <div data-overlay="note" className="absolute left-[38%] top-[14%] flex items-end gap-1.5">
                <span className="rounded-sm border border-line-strong bg-bg/80 px-1.5 py-1">
                  <TechnicalLabel className="text-fg/85">INT-01 · Signalised junction</TechnicalLabel>
                </span>
                <span className="mb-[-14px] h-5 w-px origin-top -rotate-[28deg] bg-fg/50" />
              </div>

              <div data-overlay="coords" className="absolute bottom-3 left-3 flex gap-3 rounded-md border border-line bg-bg/80 px-2.5 py-1.5 backdrop-blur">
                <TechnicalLabel tone="x">X 4182.36</TechnicalLabel>
                <TechnicalLabel tone="y">Y 1906.12</TechnicalLabel>
                <TechnicalLabel tone="z">Z 0.00</TechnicalLabel>
              </div>
            </div>
          </div>
        </ScreenshotFrame>
      </ExploreCursor>
    </div>
  );
}
