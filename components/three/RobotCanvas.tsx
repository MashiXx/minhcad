"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import * as THREE from "three";
import { RobotScene, type SceneProps } from "./RobotScene";
import { MAX_DPR } from "@/lib/three/config";

type Props = SceneProps & {
  active: boolean;
  className?: string;
};

/**
 * The WebGL canvas. Imported dynamically so three.js never ships on pages
 * without 3D, and only mounted once the host is near the viewport.
 */
export default function RobotCanvas({ active, className, ...scene }: Props) {
  const inspector = scene.variant === "inspector";
  return (
    <Canvas
      className={className}
      frameloop={active ? "always" : "never"}
      dpr={[1, MAX_DPR]}
      shadows={false}
      camera={{
        fov: inspector ? 34 : 32,
        near: 0.1,
        far: 80,
        position: inspector ? [4.4, 3.0, 5.2] : [0.4, 3.5, 9],
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      style={{ touchAction: inspector ? "none" : "pan-y" }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <RobotScene {...scene} />
      </Suspense>
    </Canvas>
  );
}
