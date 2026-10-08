/**
 * Image catalog. `screenshots` are real KufCad application captures;
 * `canva` images were extracted from the KufCad website design on Canva.
 */
export type ImageAsset = { src: string; alt: string; width: number; height: number };

const img = (src: string, width: number, height: number, alt: string): ImageAsset => ({ src, width, height, alt });

export const screenshots = {
  cad2d: img("/screenshots/cad-2d.webp", 836, 408, "KufCad 2D workspace: road interchange drawing with colour-coded layers and the properties panel"),
  cad3d: img("/screenshots/cad-3d.webp", 840, 414, "KufCad 3D workspace: industrial robot arm model in two viewports with the modelling ribbon"),
} as const;

export const images = {
  robotHero: img("/images/canva/robot-hero.webp", 716, 674, "Yellow six-axis industrial robot arm"),
  robotGripper: img("/images/canva/robot-gripper.webp", 556, 546, "Industrial robot arm with a two-finger gripper"),
  robotTall: img("/images/canva/robot-tall.webp", 618, 898, "Industrial robot arm on a circular base"),
  robotAbout: img("/images/canva/robot-about.webp", 652, 640, "Industrial robot arm in a dark CAD workspace"),
  robotViewport: img("/images/canva/robot-viewport.webp", 782, 514, "Robot arm model open in the KufCad viewport with the model tree"),
  robotDrawing: img("/images/canva/robot-drawing.webp", 424, 418, "Dimensioned line drawing of a robot arm"),
  robotWireframe: img("/images/canva/robot-wireframe.webp", 618, 514, "Wireframe view of a robot arm"),
  robotExport: img("/images/canva/robot-export.webp", 522, 290, "Robot arm with the export format dialog"),
  intersectionBlueprint: img("/images/canva/intersection-blueprint.webp", 1434, 456, "Blueprint of a four-way road intersection"),
  roundabout: img("/images/canva/roundabout.webp", 750, 576, "2D drawing of a roundabout intersection"),
  interchange: img("/images/canva/interchange.webp", 520, 290, "Line drawing of a highway interchange"),
  housingPart: img("/images/canva/housing-part.webp", 522, 290, "3D model of a machined housing"),
  dimensionDrawing: img("/images/canva/dimension-drawing.webp", 520, 290, "Dimensioned 2D part drawing"),
  flangePart: img("/images/canva/flange-part.webp", 490, 386, "3D model of a flanged bushing"),
  flangeDrawing: img("/images/canva/flange-drawing.webp", 556, 416, "2D drawing of a four-hole flange with R25 and Ø100 dimensions"),
  gearDrawing: img("/images/canva/gear-drawing.webp", 294, 256, "Line drawing of a spur gear"),
  assembly: img("/images/canva/assembly.webp", 458, 202, "Exploded mechanical assembly"),
  visualization: img("/images/canva/visualization.webp", 456, 226, "Rendered visualization of a modern building"),
  carWireframe: img("/images/canva/car-wireframe.webp", 424, 192, "Wireframe render of a car"),
  automationScript: img("/images/canva/automation-script.webp", 326, 258, "Automation script listing"),
  workflow: img("/images/canva/workflow.webp", 458, 258, "Structural frame model during review"),
  measurementPhoto: img("/images/canva/measurement-photo.webp", 520, 386, "Dial indicator measuring a machined part"),
  aboutMap: img("/images/canva/about-map.webp", 490, 322, "World map with highlighted user locations"),
} as const;
