/**
 * Product capabilities. Shared by the homepage capability grid and /features.
 * Images are product visuals extracted from the KufCad Canva design.
 */
export type Feature = {
  id: string;
  index: string;
  title: string;
  headline: string;
  summary: string;
  description: string;
  image: { src: string; alt: string; width: number; height: number };
  /** Short technical facts rendered as metadata rows. */
  meta: { label: string; value: string }[];
  points: string[];
};

export const features: Feature[] = [
  {
    id: "2d-drafting",
    index: "01",
    title: "2D Drafting",
    headline: "Drafting that holds up to review.",
    summary: "Layers, blocks, dimensions and annotation for production drawings.",
    description:
      "Draw with object snaps, constraints and polar tracking. Organise complex drawings with layers and blocks, then annotate with associative dimensions that update when geometry changes.",
    image: { src: "/images/canva/roundabout.webp", alt: "2D drawing of a roundabout intersection with lane markings", width: 750, height: 576 },
    meta: [
      { label: "Precision", value: "Double, 16 significant digits" },
      { label: "Annotation", value: "Associative dimensions" },
      { label: "Organisation", value: "Layers · Blocks · Xrefs" },
    ],
    points: ["Object snaps and polar tracking", "Layer states and filters", "Dynamic blocks", "Plot styles and layouts"],
  },
  {
    id: "3d-modeling",
    index: "02",
    title: "3D Modeling",
    headline: "Solids, surfaces and meshes in one model.",
    summary: "Parametric solids with full feature history.",
    description:
      "Extrude, revolve, sweep and loft from constrained sketches. Combine Boolean operations with fillets and chamfers, and edit any feature in the history tree without rebuilding by hand.",
    image: { src: "/images/canva/housing-part.webp", alt: "3D solid model of a machined housing in the KufCad viewport", width: 522, height: 290 },
    meta: [
      { label: "Kernel", value: "B-rep solids and surfaces" },
      { label: "History", value: "Editable feature tree" },
      { label: "Operations", value: "Extrude · Revolve · Loft · Sweep" },
    ],
    points: ["Parametric sketches", "Boolean union, subtract, intersect", "Fillet and chamfer", "Shell and draft"],
  },
  {
    id: "assemblies",
    index: "03",
    title: "Assemblies",
    headline: "Large assemblies, kept in order.",
    summary: "Mates, interference checks and bills of materials.",
    description:
      "Position components with mates and joints, check interference and clearance before manufacture, and generate bills of materials that stay in sync with the model.",
    image: { src: "/images/canva/assembly.webp", alt: "Exploded mechanical assembly with colour-coded components", width: 458, height: 202 },
    meta: [
      { label: "Constraints", value: "Mates · Joints · Limits" },
      { label: "Checks", value: "Interference · Clearance" },
      { label: "Output", value: "BOM · Exploded views" },
    ],
    points: ["Exploded views", "Interference detection", "BOM generation", "Subassembly management"],
  },
  {
    id: "visualization",
    index: "04",
    title: "Visualization",
    headline: "Show the design as it will be built.",
    summary: "Physically based rendering for reviews and presentations.",
    description:
      "Switch between shaded, wireframe and X-ray views while you work, then produce physically based renders with materials, lighting and depth of field for design reviews.",
    image: { src: "/images/canva/visualization.webp", alt: "Rendered architectural visualization of a modern building", width: 456, height: 226 },
    meta: [
      { label: "Viewport", value: "Shaded · Wireframe · X-Ray" },
      { label: "Renderer", value: "Physically based, GPU" },
      { label: "Output", value: "Up to 8K stills" },
    ],
    points: ["Material library", "HDRI lighting", "Section views", "Turntable animation"],
  },
  {
    id: "file-formats",
    index: "05",
    title: "File Formats",
    headline: "Open the files your partners send.",
    summary: "Import and export industry-standard formats.",
    description:
      "Exchange data with suppliers and other CAD systems without conversion services. KufCad reads and writes the formats engineering teams rely on.",
    image: { src: "/images/canva/robot-export.webp", alt: "Export dialog listing STEP, IGES, STL, OBJ, DWG and PDF formats", width: 522, height: 290 },
    meta: [
      { label: "2D", value: "DWG · DXF · PDF · SVG" },
      { label: "3D", value: "STEP · IGES · STL · OBJ" },
      { label: "Batch", value: "Command-line conversion" },
    ],
    points: ["DWG R12–2018", "STEP AP203/AP214", "STL for additive manufacturing", "PDF with layers"],
  },
  {
    id: "performance",
    index: "06",
    title: "Performance",
    headline: "Responsive with real project sizes.",
    summary: "Multi-core regeneration and a GPU viewport.",
    description:
      "Drawings with hundreds of thousands of entities stay responsive. Regeneration runs across all cores and the viewport renders on the GPU, so pan and orbit stay fluid.",
    image: { src: "/images/canva/car-wireframe.webp", alt: "Wireframe render of a car body showing dense geometry", width: 424, height: 192 },
    meta: [
      { label: "Viewport", value: "60 FPS target" },
      { label: "Regeneration", value: "Multi-threaded" },
      { label: "Files", value: "Streaming load" },
    ],
    points: ["GPU-accelerated display", "Level-of-detail for large models", "Background autosave", "Partial loading"],
  },
  {
    id: "automation",
    index: "07",
    title: "Automation",
    headline: "Script the work you repeat.",
    summary: "Python and command scripting with a documented API.",
    description:
      "Record command macros or write Python against the KufCad API to generate geometry, batch-process drawings and connect KufCad to the rest of your toolchain.",
    image: { src: "/images/canva/automation-script.webp", alt: "Automation script creating walls and columns", width: 326, height: 258 },
    meta: [
      { label: "Languages", value: "Python 3 · Command scripts" },
      { label: "API", value: "Documents · Geometry · UI" },
      { label: "Runs", value: "In-app or headless" },
    ],
    points: ["Macro recorder", "Headless batch mode", "Custom commands", "Plugin packaging"],
  },
  {
    id: "workflows",
    index: "08",
    title: "Professional Workflows",
    headline: "From first sketch to issued drawing.",
    summary: "Templates, standards and review built in.",
    description:
      "Start from company templates, apply drafting standards consistently, review with markups and issue drawing sets with revision tracking.",
    image: { src: "/images/canva/workflow.webp", alt: "Structural frame model with highlighted members during review", width: 458, height: 258 },
    meta: [
      { label: "Standards", value: "ISO · ANSI · DIN" },
      { label: "Review", value: "Markups · Revisions" },
      { label: "Output", value: "Sheet sets · PDF" },
    ],
    points: ["Drawing templates", "Title blocks", "Revision clouds", "Sheet set publishing"],
  },
];

export function getFeature(id: string) {
  return features.find((f) => f.id === id);
}
