import * as THREE from "three";
import { addEdges, computeStats, createEdgeMaterial, type Rig, type RigPart } from "./rig";

/** Target model height in scene units, matching the procedural robot. */
const TARGET_HEIGHT = 2.5;

/**
 * Wraps a loaded GLB scene in the same Rig interface as the procedural robot.
 * Exploded offsets come from `explodeMap` (by node name) or, when absent,
 * along each part's direction from the model centre.
 */
export function rigFromGltf(source: THREE.Object3D, explodeMap: Record<string, [number, number, number]>): Rig {
  const model = source.clone(true);
  const root = new THREE.Group();
  root.name = "robot";
  root.add(model);

  // Normalise scale and sit the model on the ground plane.
  const initialBox = new THREE.Box3().setFromObject(model);
  const initialSize = initialBox.getSize(new THREE.Vector3());
  const scale = initialSize.y > 0 ? TARGET_HEIGHT / initialSize.y : 1;
  model.scale.setScalar(scale);
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.set(-center.x, -box.min.y, -center.z);

  const surfaceMaterials: THREE.MeshStandardMaterial[] = [];
  const cache = new Map<THREE.Material, THREE.MeshStandardMaterial>();
  model.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const convert = (m: THREE.Material) => {
      const cached = cache.get(m);
      if (cached) return cached;
      const next =
        m instanceof THREE.MeshStandardMaterial
          ? m.clone()
          : new THREE.MeshStandardMaterial({
              color: (m as THREE.MeshBasicMaterial).color ?? new THREE.Color("#888"),
              roughness: 0.5,
              metalness: 0.3,
            });
      cache.set(m, next);
      surfaceMaterials.push(next);
      return next;
    };
    mesh.material = Array.isArray(mesh.material) ? mesh.material.map(convert) : convert(mesh.material);
  });

  // Parts: the first level that actually branches.
  let container: THREE.Object3D = model;
  while (container.children.length === 1 && !(container.children[0] as THREE.Mesh).isMesh) {
    container = container.children[0];
  }
  model.updateMatrixWorld(true);
  const modelCenter = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
  const parts: RigPart[] = container.children.map((child) => {
    const mapped = explodeMap[child.name];
    let offset: THREE.Vector3;
    if (mapped) {
      offset = new THREE.Vector3(...mapped);
    } else {
      const partCenter = new THREE.Box3().setFromObject(child).getCenter(new THREE.Vector3());
      const dirWorld = partCenter.sub(modelCenter);
      // Convert the world-space direction into the container's local space.
      const inv = new THREE.Matrix4().copy(container.matrixWorld).invert();
      const dirLocal = dirWorld.clone().applyMatrix4(inv).sub(new THREE.Vector3().applyMatrix4(inv));
      offset = dirLocal.multiplyScalar(0.35);
    }
    return { object: child, base: child.position.clone(), offset };
  });

  const edgeMaterial = createEdgeMaterial();
  const stats = computeStats(model);
  const disposeEdges = addEdges(model, edgeMaterial);

  return {
    root,
    parts,
    surfaceMaterials,
    edgeMaterial,
    labels: [],
    stats,
    dispose: () => {
      disposeEdges();
      surfaceMaterials.forEach((m) => m.dispose());
      edgeMaterial.dispose();
    },
  };
}
