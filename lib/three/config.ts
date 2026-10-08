/**
 * 3D asset configuration.
 *
 * The site ships with a procedural robot arm so the experience works today.
 * To use the real product model:
 *   1. Export it as a Draco-compressed GLB (e.g. `gltf-transform optimize in.glb robot.glb --compress draco`).
 *   2. Place it at /public/models/robot.glb.
 *   3. Set `robotModelUrl` below to "/models/robot.glb".
 * Optionally map node names to exploded-view offsets in `explodeMap`.
 */
export const robotModelUrl: string | null = null;

/** Exploded-view offsets for GLB nodes, keyed by node name (local units). */
export const explodeMap: Record<string, [number, number, number]> = {};

/** Static image shown when WebGL is unavailable or the model fails to load. */
export const robotFallbackImage = "/images/canva/robot-hero.webp";

/** Hard cap on renderer pixel ratio. */
export const MAX_DPR = 2;
