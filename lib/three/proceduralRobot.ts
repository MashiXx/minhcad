import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { addEdges, computeStats, createEdgeMaterial, type Rig, type RigLabel, type RigPart } from "./rig";

/**
 * Builds a six-axis industrial robot arm from primitives.
 * This is an isolated placeholder for the real GLB (see lib/three/config.ts);
 * it exposes the same Rig interface so view modes work identically.
 */
export function buildProceduralRobot(): Rig {
  const geometries: THREE.BufferGeometry[] = [];

  const paint = new THREE.MeshPhysicalMaterial({
    name: "paint",
    color: new THREE.Color("#f0b000"),
    roughness: 0.36,
    metalness: 0.12,
    clearcoat: 0.7,
    clearcoatRoughness: 0.22,
  });
  const dark = new THREE.MeshStandardMaterial({
    name: "dark",
    color: new THREE.Color("#1c1f24"),
    roughness: 0.5,
    metalness: 0.65,
  });
  const rubber = new THREE.MeshStandardMaterial({
    name: "rubber",
    color: new THREE.Color("#0d0e10"),
    roughness: 0.85,
    metalness: 0.05,
  });
  const steel = new THREE.MeshStandardMaterial({
    name: "steel",
    color: new THREE.Color("#a7b0ba"),
    roughness: 0.28,
    metalness: 0.95,
  });
  const plateMat = new THREE.MeshStandardMaterial({
    name: "plate",
    color: new THREE.Color("#262a31"),
    roughness: 0.62,
    metalness: 0.55,
  });
  const surfaceMaterials = [paint, dark, rubber, steel, plateMat];
  const edgeMaterial = createEdgeMaterial();

  const track = <T extends THREE.BufferGeometry>(g: T) => {
    geometries.push(g);
    return g;
  };

  const mesh = (geometry: THREE.BufferGeometry, material: THREE.Material, name: string, pos: [number, number, number] = [0, 0, 0]) => {
    const m = new THREE.Mesh(track(geometry), material);
    m.name = name;
    if (geometry instanceof RoundedBoxGeometry) m.userData.edgeThreshold = 10;
    m.position.set(...pos);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };

  const cyl = (rTop: number, rBottom: number, h: number, axis: "x" | "y" | "z" = "y", segments = 40) => {
    const g = new THREE.CylinderGeometry(rTop, rBottom, h, segments, 1);
    if (axis === "x") g.rotateZ(Math.PI / 2);
    if (axis === "z") g.rotateX(Math.PI / 2);
    return g;
  };

  const rbox = (w: number, h: number, d: number, r: number) => new RoundedBoxGeometry(w, h, d, 3, r);

  const group = (name: string, pos: [number, number, number] = [0, 0, 0]) => {
    const g = new THREE.Group();
    g.name = name;
    g.position.set(...pos);
    return g;
  };

  const parts: RigPart[] = [];
  const part = (object: THREE.Object3D, offset: [number, number, number]) => {
    parts.push({ object, base: object.position.clone(), offset: new THREE.Vector3(...offset) });
  };

  const labels: RigLabel[] = [];
  const label = (parent: THREE.Object3D, id: string, title: string, detail: string, pos: [number, number, number]) => {
    const anchor = new THREE.Object3D();
    anchor.position.set(...pos);
    parent.add(anchor);
    labels.push({ id, title, detail, anchor });
  };

  const root = new THREE.Group();
  root.name = "robot";
  const model = group("model");
  root.add(model);

  /* Base ---------------------------------------------------------- */
  const base = group("base");
  base.add(mesh(rbox(1.5, 0.1, 1.5, 0.03), plateMat, "base-plate", [0, 0.05, 0]));
  for (const [x, z] of [
    [0.6, 0.6],
    [-0.6, 0.6],
    [0.6, -0.6],
    [-0.6, -0.6],
  ]) {
    base.add(mesh(cyl(0.05, 0.05, 0.05, "y", 6), steel, "bolt", [x, 0.12, z]));
  }
  model.add(base);
  part(base, [0, -0.3, 0]);
  label(base, "base", "Base Assembly", "Material: Al 6061-T6", [0.7, 0.1, 0.4]);

  model.add(mesh(cyl(0.46, 0.56, 0.3), dark, "pedestal", [0, 0.25, 0]));

  /* J1 turret ----------------------------------------------------- */
  const turret = group("turret", [0, 0.4, 0]);
  turret.add(mesh(cyl(0.52, 0.52, 0.04), dark, "turret-seam", [0, 0.02, 0]));
  turret.add(mesh(cyl(0.5, 0.5, 0.2), paint, "turret-drum", [0, 0.13, 0]));
  turret.add(mesh(rbox(0.72, 0.6, 0.62, 0.08), paint, "shoulder-housing", [0.02, 0.5, 0]));
  const j1Motor = group("j1-motor", [-0.38, 0.44, 0.2]);
  j1Motor.add(mesh(cyl(0.13, 0.13, 0.38), dark, "j1-motor-body"));
  j1Motor.add(mesh(cyl(0.1, 0.1, 0.05), steel, "j1-motor-cap", [0, 0.21, 0]));
  turret.add(j1Motor);
  part(j1Motor, [-0.35, 0, 0.1]);
  model.add(turret);
  part(turret, [0, 0.2, 0]);
  label(turret, "j1", "J1 Turret", "Rotation ±185°", [-0.5, 0.15, 0.4]);

  /* J2 shoulder + upper arm --------------------------------------- */
  const shoulder = group("shoulder", [0.04, 0.68, 0]);
  shoulder.rotation.z = -0.32;
  shoulder.add(mesh(cyl(0.27, 0.27, 0.7, "z"), paint, "shoulder-hub"));
  shoulder.add(mesh(cyl(0.19, 0.19, 0.78, "z"), dark, "shoulder-caps"));
  const j2Motor = group("j2-motor", [0, 0, 0.5]);
  j2Motor.add(mesh(cyl(0.16, 0.16, 0.3, "z"), dark, "j2-motor-body"));
  j2Motor.add(mesh(cyl(0.12, 0.12, 0.05, "z"), steel, "j2-motor-cap", [0, 0, 0.17]));
  shoulder.add(j2Motor);
  part(j2Motor, [0, 0, 0.4]);
  shoulder.add(mesh(rbox(0.3, 1.24, 0.34, 0.07), paint, "upper-arm", [0, 0.68, 0]));

  const cablePath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, -0.2, -0.16),
    new THREE.Vector3(-0.26, 0.35, -0.2),
    new THREE.Vector3(-0.23, 0.95, -0.2),
    new THREE.Vector3(-0.12, 1.42, -0.17),
    new THREE.Vector3(0.18, 1.56, -0.14),
  ]);
  const cable = mesh(new THREE.TubeGeometry(cablePath, 48, 0.032, 10, false), rubber, "cable");
  shoulder.add(cable);
  part(cable, [0, 0, -0.25]);

  turret.add(shoulder);
  part(shoulder, [0, 0.16, 0]);
  label(shoulder, "j2", "J2 Upper Arm Housing", "Reach 1,240 mm", [0.2, 0.8, 0.2]);

  /* J3 elbow + forearm -------------------------------------------- */
  const elbow = group("elbow", [0, 1.36, 0]);
  elbow.rotation.z = 0.22;
  elbow.add(mesh(cyl(0.22, 0.22, 0.5, "z"), paint, "elbow-hub"));
  elbow.add(mesh(cyl(0.15, 0.15, 0.58, "z"), dark, "elbow-caps"));
  elbow.add(mesh(rbox(0.52, 0.4, 0.42, 0.07), paint, "forearm-housing", [0.02, 0.02, 0]));
  const j3Motor = group("j3-motor", [-0.42, 0.04, 0]);
  j3Motor.add(mesh(cyl(0.15, 0.15, 0.34, "x"), dark, "j3-motor-body"));
  j3Motor.add(mesh(cyl(0.11, 0.11, 0.05, "x"), steel, "j3-motor-cap", [-0.19, 0, 0]));
  elbow.add(j3Motor);
  part(j3Motor, [-0.38, 0, 0]);
  const forearm = group("forearm");
  forearm.add(mesh(rbox(1.0, 0.24, 0.27, 0.06), paint, "forearm-tube", [0.72, 0.03, 0]));
  elbow.add(forearm);
  part(forearm, [0.22, 0, 0]);
  shoulder.add(elbow);
  part(elbow, [0.12, 0.2, 0]);
  label(forearm, "j3", "J3 Forearm", "Payload 24 kg", [0.55, -0.32, 0.2]);

  /* Wrist + tool -------------------------------------------------- */
  const wrist = group("wrist", [1.26, 0.03, 0]);
  wrist.add(mesh(cyl(0.135, 0.135, 0.14, "x"), dark, "wrist-collar"));
  wrist.add(mesh(rbox(0.24, 0.26, 0.3, 0.05), paint, "wrist-yoke", [0.17, 0, 0]));
  const tool = group("tool", [0.3, 0, 0]);
  tool.rotation.z = -0.55;
  tool.add(mesh(cyl(0.11, 0.11, 0.05, "x"), steel, "tool-flange", [0.03, 0, 0]));
  tool.add(mesh(rbox(0.14, 0.22, 0.2, 0.03), dark, "gripper-body", [0.12, 0, 0]));
  const fingerA = mesh(rbox(0.24, 0.045, 0.07, 0.015), steel, "finger-a", [0.3, 0.075, 0]);
  const fingerB = mesh(rbox(0.24, 0.045, 0.07, 0.015), steel, "finger-b", [0.3, -0.075, 0]);
  tool.add(fingerA, fingerB);
  part(fingerA, [0, 0.08, 0]);
  part(fingerB, [0, -0.08, 0]);
  wrist.add(tool);
  part(tool, [0.32, 0, 0]);
  elbow.add(wrist);
  part(wrist, [0.3, 0, 0]);
  label(wrist, "j5", "J5 Wrist Assembly", "Repeatability ±0.03 mm", [0.2, 0.42, 0.1]);
  label(tool, "tool", "Tool Flange", "ISO 9409-1-A125", [0.42, -0.12, 0]);

  /* Centre the arm horizontally so it frames well. ---------------- */
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, 0, -center.z);

  const stats = computeStats(model);
  const disposeEdges = addEdges(model, edgeMaterial);

  return {
    root,
    parts,
    surfaceMaterials,
    edgeMaterial,
    labels,
    stats,
    dispose: () => {
      disposeEdges();
      geometries.forEach((g) => g.dispose());
      surfaceMaterials.forEach((m) => m.dispose());
      edgeMaterial.dispose();
    },
  };
}
