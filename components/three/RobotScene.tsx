"use client";

import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Grid, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { RigController } from "./RigController";
import { buildProceduralRobot } from "@/lib/three/proceduralRobot";
import { rigFromGltf } from "@/lib/three/gltfRig";
import { explodeMap, robotModelUrl } from "@/lib/three/config";
import { modeTargets, type ModeTargets, type Rig, type ViewMode } from "@/lib/three/rig";
import { BASE_YAW, heroTargets, stepRobotFrame, type MotionState } from "@/lib/three/animate";

export type RobotStats = { triangles: number; size: { x: number; y: number; z: number } };

export type SceneProps = {
  variant: "hero" | "inspector";
  mode: ViewMode;
  /** Hero only: scroll progress 0..1 written by GSAP ScrollTrigger. */
  progressRef?: MutableRefObject<number>;
  /** Normalised pointer position (-1..1), written by the host element. */
  pointerRef: MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
  enableZoom: boolean;
  onStats?: (stats: RobotStats) => void;
  onInteract?: () => void;
  onReady: () => void;
};

const TARGET = new THREE.Vector3(0, 1.15, 0);

function useProceduralRig() {
  const rig = useMemo(() => buildProceduralRobot(), []);
  useEffect(() => () => rig.dispose(), [rig]);
  return rig;
}

function useGltfRig(url: string) {
  const { scene } = useGLTF(url, true);
  const rig = useMemo(() => rigFromGltf(scene, explodeMap), [scene]);
  useEffect(() => () => rig.dispose(), [rig]);
  return rig;
}

function ProceduralRobot(props: RobotProps) {
  return <RobotRoot rig={useProceduralRig()} {...props} />;
}

function GltfRobot({ url, ...props }: RobotProps & { url: string }) {
  return <RobotRoot rig={useGltfRig(url)} {...props} />;
}

type RobotProps = Omit<SceneProps, "enableZoom" | "onInteract">;

function RobotRoot({ rig, variant, mode, progressRef, pointerRef, reducedMotion, onStats, onReady }: RobotProps & { rig: Rig }) {
  const yawRef = useRef<THREE.Group>(null);
  const motionState = useRef<MotionState>({ px: 0, py: 0 });
  const readyFired = useRef(false);
  const heroBlend = useRef<ModeTargets>({ solid: 1, edges: 0, explode: 0 });
  const toolBaseZ = useMemo(() => rig.root.getObjectByName("tool")?.rotation.z ?? 0, [rig]);

  useEffect(() => {
    onStats?.({
      triangles: rig.stats.triangles,
      size: { x: rig.stats.size.x, y: rig.stats.size.y, z: rig.stats.size.z },
    });
  }, [rig, onStats]);

  const getTargets = useMemo(() => {
    if (variant === "inspector") return () => modeTargets[mode];
    return () => heroTargets(heroBlend.current, reducedMotion ? 0 : progressRef?.current ?? 0);
  }, [variant, mode, progressRef, reducedMotion]);

  useFrame((state, rawDelta) => {
    if (!readyFired.current) {
      readyFired.current = true;
      onReady();
    }
    stepRobotFrame({
      variant,
      rig,
      yaw: yawRef.current,
      camera: state.camera,
      motion: motionState.current,
      pointer: pointerRef.current,
      progress: progressRef?.current ?? 0,
      time: state.clock.elapsedTime,
      dt: Math.min(rawDelta, 1 / 30),
      reducedMotion,
      exploded: mode === "exploded",
      toolBaseZ,
    });
  });

  return (
    <>
      <group ref={yawRef} rotation-y={BASE_YAW}>
        <primitive object={rig.root} />
      </group>
      <RigController rig={rig} getTargets={getTargets} showLabels={variant === "inspector"} />
    </>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 8, 4]} intensity={1.7} color="#ffffff" />
      <directionalLight position={[-6, 3.5, -5]} intensity={1.4} color="#5b9bff" />
      <directionalLight position={[0, 2, 6]} intensity={0.35} color="#dfe8ff" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 6, -2]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={1.2} position={[-6, 2, 1]} rotation-y={Math.PI / 2} scale={[6, 1.2, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#7aa8ff" position={[6, 1.5, -2]} rotation-y={-Math.PI / 2} scale={[6, 0.6, 1]} />
        <Lightformer form="ring" intensity={0.6} position={[0, 3, 6]} scale={3} />
      </Environment>
    </>
  );
}

export function RobotScene({ enableZoom, onInteract, variant, ...props }: SceneProps) {
  return (
    <>
      <Lighting />
      <Grid
        position={[0, 0.001, 0]}
        args={[30, 30]}
        cellSize={0.25}
        cellThickness={0.6}
        cellColor="#18212d"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#1f3d66"
        fadeDistance={variant === "hero" ? 16 : 13}
        fadeStrength={1.6}
        infiniteGrid
      />
      <ContactShadows position={[0, 0.002, 0]} opacity={0.6} scale={7} blur={2.4} far={3} resolution={512} color="#000000" />
      {robotModelUrl ? (
        <GltfRobot url={robotModelUrl} variant={variant} {...props} />
      ) : (
        <ProceduralRobot variant={variant} {...props} />
      )}
      {variant === "inspector" ? (
        <OrbitControls
          makeDefault
          target={TARGET}
          enablePan={false}
          enableZoom={enableZoom}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.6}
          minDistance={4.2}
          maxDistance={13}
          minPolarAngle={0.35}
          maxPolarAngle={Math.PI / 2 - 0.05}
          onStart={onInteract}
        />
      ) : null}
    </>
  );
}
