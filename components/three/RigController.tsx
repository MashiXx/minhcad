"use client";

import { createPortal, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Fragment, useRef } from "react";
import { applyBlend, createBlendState, stepBlend } from "@/lib/three/animate";
import type { ModeTargets, Rig } from "@/lib/three/rig";

type Props = {
  rig: Rig;
  /** Returns the blend targets for the current frame. */
  getTargets: () => ModeTargets;
  showLabels?: boolean;
  instant?: boolean;
};

/**
 * Damps material opacity, edge overlay and exploded offsets toward the
 * requested targets, and fades part labels in once parts have separated.
 */
export function RigController({ rig, getTargets, showLabels = false, instant = false }: Props) {
  const blend = useRef(createBlendState());
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 1 / 30);
    stepBlend(blend.current, getTargets(), dt, instant);
    applyBlend(rig, blend.current, labelEls.current, showLabels);
  });

  if (!showLabels) return null;

  return (
    <>
      {rig.labels.map((label, i) => (
        <Fragment key={label.id}>
          {createPortal(
            <Html zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
              <div
                ref={(el) => {
                  labelEls.current[i] = el;
                }}
                className="flex -translate-y-1/2 items-start gap-2 whitespace-nowrap opacity-0"
              >
                <span className="mt-[11px] block h-px w-6 bg-accent-hover/70" aria-hidden />
                <span className="flex flex-col gap-0.5 rounded-[4px] bg-bg/75 px-1.5 py-1 backdrop-blur-sm">
                  <span className="font-mono text-[10.5px] font-medium uppercase tracking-[0.12em] text-fg">
                    {label.title}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.04em] text-muted">{label.detail}</span>
                </span>
              </div>
            </Html>,
            label.anchor,
          )}
        </Fragment>
      ))}
    </>
  );
}
