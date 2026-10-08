"use client";

import { useCallback, useState } from "react";
import { LayoutGroup, motion } from "motion/react";
import { Box, Boxes, Grid3x3, ScanEye } from "lucide-react";
import { RobotViewer } from "./RobotViewer";
import type { RobotStats } from "./RobotScene";
import { ExploreCursor } from "@/components/cad/ExploreCursor";
import { TechnicalLabel } from "@/components/ui/primitives";
import { viewModes, type ViewMode } from "@/lib/three/rig";
import { spring } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";

const modeIcons: Record<ViewMode, typeof Box> = {
  solid: Box,
  wireframe: Grid3x3,
  xray: ScanEye,
  exploded: Boxes,
};

const modeNotes: Record<ViewMode, string> = {
  solid: "Shaded with physically based materials.",
  wireframe: "Feature edges only, for reading topology.",
  xray: "Translucent surfaces reveal internal parts.",
  exploded: "Components separate along their assembly axes.",
};

/** Interactive model inspector: four view states driven by React state + three.js. */
export function ModelInspector() {
  const [mode, setMode] = useState<ViewMode>("solid");
  const [stats, setStats] = useState<RobotStats | null>(null);
  const handleStats = useCallback((s: RobotStats) => setStats(s), []);

  return (
    <div className="overflow-hidden rounded-[18px] border border-line-strong bg-surface-1 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.9)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface-2/80 px-3 py-2.5 sm:px-4">
        <LayoutGroup id="view-mode">
          <div role="radiogroup" aria-label="View mode" className="flex rounded-lg border border-line bg-bg/60 p-1">
            {viewModes.map(({ id, label }) => {
              const Icon = modeIcons[id];
              const selected = mode === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setMode(id)}
                  className={cn(
                    "relative inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-[12.5px] font-medium transition-colors duration-200 sm:h-8 sm:px-3",
                    selected ? "text-white" : "text-muted hover:text-fg",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded-md bg-accent shadow-[0_4px_14px_-4px_rgb(47_123_255/0.7)]"
                      transition={spring.ui}
                    />
                  ) : null}
                  <Icon aria-hidden className="relative hidden size-3.5 sm:block" strokeWidth={1.8} />
                  <span className="relative">{label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
        <TechnicalLabel className="hidden uppercase tracking-[0.14em] md:block">fanuc-430-arm.dxf · Perspective</TechnicalLabel>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_260px]">
        <ExploreCursor label="Orbit">
          <RobotViewer
            variant="inspector"
            mode={mode}
            onStats={handleStats}
            hint
            className="h-[380px] w-full bg-[radial-gradient(ellipse_at_50%_40%,rgb(47_123_255/0.08),transparent_65%)] sm:h-[480px] lg:h-[560px]"
          />
        </ExploreCursor>

        {/* Model info panel */}
        <aside className="border-t border-line bg-surface-2/40 p-5 lg:border-l lg:border-t-0" aria-label="Model information">
          <TechnicalLabel className="uppercase tracking-[0.16em] text-subtle">Model info</TechnicalLabel>
          <p className="mt-2 text-[15px] font-medium text-fg">Robot Arm · 6-axis</p>
          <dl className="mt-4 flex flex-col gap-2.5 font-mono text-[11.5px]">
            {[
              ["Triangles", stats ? stats.triangles.toLocaleString("en-US") : "—"],
              ["Width", stats ? `${Math.round(stats.size.x * 1000).toLocaleString("en-US")} mm` : "—"],
              ["Height", stats ? `${Math.round(stats.size.y * 1000).toLocaleString("en-US")} mm` : "—"],
              ["Depth", stats ? `${Math.round(stats.size.z * 1000).toLocaleString("en-US")} mm` : "—"],
              ["Export", "STEP · IGES · STL"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4 border-b border-line pb-2.5 last:border-0">
                <dt className="text-subtle">{k}</dt>
                <dd className="tabular-nums text-fg/85">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-lg border border-line bg-bg/50 p-3.5">
            <TechnicalLabel tone="accent" className="uppercase tracking-[0.16em]">
              {viewModes.find((m) => m.id === mode)?.label}
            </TechnicalLabel>
            <p aria-live="polite" className="mt-2 text-[13px] leading-relaxed text-muted">
              {modeNotes[mode]}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
