import * as THREE from "three";
import type { ModeTargets, Rig } from "./rig";

/**
 * Imperative per-frame updates for the robot viewer. Kept outside React
 * components: three.js objects are mutable by design and are updated
 * inside useFrame without triggering React renders.
 */

export type BlendState = ModeTargets & { explodeVelocity: number; transparent: boolean | null };

export const createBlendState = (): BlendState => ({
  solid: 1,
  edges: 0,
  explode: 0,
  explodeVelocity: 0,
  transparent: null,
});

/** Damps surface/edge blends (~600ms) and springs the explode factor. */
export function stepBlend(s: BlendState, t: ModeTargets, dt: number, instant: boolean) {
  if (instant) {
    s.solid = t.solid;
    s.edges = t.edges;
    s.explode = t.explode;
    s.explodeVelocity = 0;
    return;
  }
  s.solid = THREE.MathUtils.damp(s.solid, t.solid, 7, dt);
  s.edges = THREE.MathUtils.damp(s.edges, t.edges, 7, dt);
  // Near-critically damped spring: settles without a hard stop.
  const k = 38;
  const c = 11.5;
  s.explodeVelocity += (t.explode - s.explode) * k * dt;
  s.explodeVelocity *= Math.exp(-c * dt);
  s.explode += s.explodeVelocity * dt;
}

/** Writes the blend state into materials, part positions and label elements. */
export function applyBlend(rig: Rig, s: BlendState, labels: (HTMLElement | null)[], showLabels: boolean) {
  const transparent = s.solid < 0.995;
  for (const m of rig.surfaceMaterials) {
    m.opacity = s.solid;
    m.depthWrite = s.solid > 0.6;
    m.visible = s.solid > 0.005;
    if (s.transparent !== transparent) {
      m.transparent = transparent;
      m.needsUpdate = true;
    }
  }
  s.transparent = transparent;

  rig.edgeMaterial.opacity = s.edges;
  rig.edgeMaterial.visible = s.edges > 0.005;

  for (const p of rig.parts) {
    p.object.position.copy(p.base).addScaledVector(p.offset, s.explode);
  }

  const labelOpacity = showLabels ? THREE.MathUtils.clamp((s.explode - 0.6) / 0.4, 0, 1) : 0;
  for (const el of labels) {
    if (!el) continue;
    el.style.opacity = String(labelOpacity);
    el.style.transform = `translate3d(0, ${(1 - labelOpacity) * 6}px, 0)`;
  }
}

export const smoothstep = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export type MotionState = { px: number; py: number };

type RobotFrameInput = {
  variant: "hero" | "inspector";
  rig: Rig;
  yaw: THREE.Object3D | null;
  camera: THREE.Camera;
  motion: MotionState;
  pointer: { x: number; y: number };
  progress: number;
  time: number;
  dt: number;
  reducedMotion: boolean;
  exploded: boolean;
  toolBaseZ: number;
};

const HERO_TARGET = new THREE.Vector3(0.2, 1.2, 0);
export const BASE_YAW = -0.48;

/** Pointer follow, scroll choreography, idle motion and camera breathing. */
export function stepRobotFrame(i: RobotFrameInput) {
  const { motion, dt } = i;
  const pointer = i.reducedMotion ? { x: 0, y: 0 } : i.pointer;
  motion.px = THREE.MathUtils.damp(motion.px, pointer.x, 3.2, dt);
  motion.py = THREE.MathUtils.damp(motion.py, pointer.y, 3.2, dt);

  const p = i.variant === "hero" && !i.reducedMotion ? i.progress : 0;
  const turn = smoothstep(0.22, 0.5, p);

  // ~6.5° maximum pointer yaw; the scroll turn adds a deliberate rotation.
  if (i.yaw) i.yaw.rotation.y = BASE_YAW + motion.px * 0.115 + turn * 0.9;

  if (!i.reducedMotion) {
    const wrist = i.rig.root.getObjectByName("wrist");
    const tool = i.rig.root.getObjectByName("tool");
    if (wrist) wrist.rotation.x = Math.sin(i.time * 0.45) * 0.06;
    if (tool) tool.rotation.z = i.toolBaseZ + Math.sin(i.time * 0.32 + 1.2) * 0.035;
  }

  const cam = i.camera as THREE.PerspectiveCamera;
  if (i.variant === "hero") {
    const dolly = smoothstep(0.04, 0.24, p);
    const breathe = i.reducedMotion ? 0 : Math.sin(i.time * 0.38) * 0.06;
    const distance = 9.0 * (1 - 0.14 * dolly) + breathe;
    const elevation = 0.26 - motion.py * 0.035;
    cam.position.set(
      HERO_TARGET.x + Math.sin(0.08) * distance * Math.cos(elevation),
      HERO_TARGET.y + Math.sin(elevation) * distance,
      Math.cos(0.08) * distance * Math.cos(elevation),
    );
    cam.lookAt(HERO_TARGET);
  } else {
    // Inspector: OrbitControls own the camera; ease the zoom per mode.
    const zoomTarget = i.exploded ? 0.74 : 1;
    const z = THREE.MathUtils.damp(cam.zoom, zoomTarget, 4, dt);
    if (Math.abs(z - cam.zoom) > 0.0005) {
      cam.zoom = z;
      cam.updateProjectionMatrix();
    }
  }
}

/** Hero blend: the solid model turns into a wireframe between 50–70% scroll. */
export function heroTargets(out: ModeTargets, progress: number) {
  const wire = smoothstep(0.5, 0.7, progress);
  out.solid = 1 - 0.72 * wire;
  out.edges = 0.9 * wire;
  out.explode = 0;
  return out;
}
