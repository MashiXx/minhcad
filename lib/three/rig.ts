import * as THREE from "three";

export type ViewMode = "solid" | "wireframe" | "xray" | "exploded";

export const viewModes: { id: ViewMode; label: string }[] = [
  { id: "solid", label: "Solid" },
  { id: "wireframe", label: "Wireframe" },
  { id: "xray", label: "X-Ray" },
  { id: "exploded", label: "Exploded" },
];

/** Blend targets the controller damps toward. All values 0..1. */
export type ModeTargets = {
  /** Opacity of the shaded surfaces. */
  solid: number;
  /** Opacity of the edge (wireframe) overlay. */
  edges: number;
  /** Exploded-view separation factor. */
  explode: number;
};

export const modeTargets: Record<ViewMode, ModeTargets> = {
  solid: { solid: 1, edges: 0, explode: 0 },
  wireframe: { solid: 0, edges: 0.95, explode: 0 },
  xray: { solid: 0.14, edges: 0.55, explode: 0 },
  exploded: { solid: 1, edges: 0.12, explode: 1 },
};

export type RigPart = {
  object: THREE.Object3D;
  base: THREE.Vector3;
  /** Separation direction × distance, in the parent's local space. */
  offset: THREE.Vector3;
};

export type RigLabel = {
  id: string;
  title: string;
  detail: string;
  anchor: THREE.Object3D;
};

/** Everything the view-mode controller needs to drive a model. */
export type Rig = {
  root: THREE.Group;
  parts: RigPart[];
  surfaceMaterials: THREE.MeshStandardMaterial[];
  edgeMaterial: THREE.LineBasicMaterial;
  labels: RigLabel[];
  stats: { triangles: number; size: THREE.Vector3 };
  dispose: () => void;
};

export function computeStats(root: THREE.Object3D) {
  let triangles = 0;
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const g = mesh.geometry;
    triangles += g.index ? g.index.count / 3 : g.attributes.position.count / 3;
  });
  const size = new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  return { triangles: Math.round(triangles), size };
}

/** Adds a crisp CAD edge overlay to every mesh under `root`. */
export function addEdges(root: THREE.Object3D, material: THREE.LineBasicMaterial, thresholdAngle = 24) {
  const created: THREE.BufferGeometry[] = [];
  const meshes: THREE.Mesh[] = [];
  root.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });
  for (const mesh of meshes) {
    // Filleted geometry has shallow facet angles; it can request a lower threshold.
    const threshold = typeof mesh.userData.edgeThreshold === "number" ? mesh.userData.edgeThreshold : thresholdAngle;
    const edges = new THREE.EdgesGeometry(mesh.geometry, threshold);
    created.push(edges);
    const lines = new THREE.LineSegments(edges, material);
    lines.name = `${mesh.name}-edges`;
    lines.raycast = () => {};
    lines.renderOrder = 2;
    mesh.add(lines);
  }
  return () => created.forEach((g) => g.dispose());
}

export function createEdgeMaterial() {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color("#5b9bff"),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false,
  });
}
