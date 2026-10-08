/**
 * KufCad documentation content.
 *
 * Every doc page is a list of typed blocks. Headings (h2/h3) feed the table of
 * contents, the sidebar and the client-side search index, so the same source
 * drives navigation and content. Inline text supports `code`, **bold** and
 * [links](/docs/installation).
 */
import { images, screenshots, type ImageAsset } from "./assets";
import { getPlatform, platforms, release, site } from "@/lib/site";
import { slugify } from "@/lib/utils";

export type DocIcon =
  | "rocket"
  | "download"
  | "drafting"
  | "modeling"
  | "assemblies"
  | "rendering"
  | "formats"
  | "automation"
  | "troubleshooting"
  | "faq";

export type CodeLanguage = "kufcad" | "python" | "bash" | "powershell" | "text";

export type DocBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string; step?: number }
  | { type: "h3"; text: string; id?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; code: string; language: CodeLanguage; title?: string }
  | { type: "table"; columns: string[]; rows: string[][]; caption?: string; /** Column indexes set in monospace. */ mono?: number[] }
  | { type: "callout"; tone: "note" | "success" | "warning"; title: string; text: string }
  | { type: "figure"; image: ImageAsset; caption: string; frameTitle: string; frameMeta?: string }
  | { type: "links"; items: { title: string; description: string; href: string }[] };

export type Doc = {
  slug: string;
  /** Category label shown in the sidebar and breadcrumb. */
  category: string;
  /** Second breadcrumb segment. */
  section: string;
  title: string;
  description: string;
  icon: DocIcon;
  updated: string;
  /** Extra search terms that do not appear in headings. */
  keywords: string[];
  blocks: DocBlock[];
};

export type DocHeading = { id: string; text: string; level: 2 | 3; step?: number };

export type DocSearchEntry = {
  id: string;
  href: string;
  title: string;
  category: string;
  kind: "page" | "section";
  /** Lower-cased text the query is matched against. */
  haystack: string;
};

export type DocNavItem = {
  slug: string;
  label: string;
  icon: DocIcon;
  headings: { id: string; text: string }[];
};

/* ------------------------------------------------------------------
   Shared data derived from lib/site.ts
------------------------------------------------------------------- */

const windows = getPlatform("windows");
const macos = getPlatform("macos");
const ubuntu = getPlatform("ubuntu");

const fileName = (platformFiles: typeof windows.files, index: number) => platformFiles[index]?.fileName ?? "";

const requirementRows: string[][] = windows.requirements.map(({ label }) => [
  label,
  ...platforms.map((p) => p.requirements.find((r) => r.label === label)?.value ?? "—"),
]);

/* ------------------------------------------------------------------
   Pages
------------------------------------------------------------------- */

export const docs: Doc[] = [
  {
    slug: "getting-started",
    category: "Getting Started",
    section: "Basics",
    title: "Create your first parametric model",
    description:
      "Build a fully constrained flanged bushing driven by named parameters, then change one value and watch every dependent feature update.",
    icon: "rocket",
    updated: "2026-09-22",
    keywords: ["tutorial", "first part", "parameters", "sketch", "extrude", "fillet", "flange", "bushing", "quick start"],
    blocks: [
      {
        type: "p",
        text: "This tutorial walks through a complete part: a flanged bushing with a bore, four bolt holes and finishing fillets. Every dimension comes from a named parameter, so the model can be resized later by editing a single value. Allow about fifteen minutes.",
      },
      {
        type: "callout",
        tone: "note",
        title: "Before you start",
        text: "Install KufCad 1.0 or later and launch it once so the default templates are created. You can follow along with the mouse, or type each command into the command line at the bottom of the window.",
      },
      {
        type: "figure",
        image: images.flangePart,
        frameTitle: "flanged-bushing.kcd — KufCad",
        frameMeta: "Shaded with Edges",
        caption: "The finished part. Flange, hub, bore and bolt circle all derive from eight parameters.",
      },
      { type: "h2", text: "Start a new part", id: "start-a-new-part", step: 1 },
      {
        type: "p",
        text: "Choose **File → New → Part** and pick the **ISO Metric** template. The template sets millimetres as the document unit, a 0.01 mm display precision and the standard XY, XZ and YZ planes. The equivalent command is:",
      },
      { type: "code", language: "kufcad", title: "Command line", code: "NEW PART TEMPLATE=ISO_METRIC" },
      {
        type: "p",
        text: "Save the document straight away as `flanged-bushing.kcd`. Autosave only protects documents that have a file name.",
      },
      { type: "h2", text: "Define parameters", id: "define-parameters", step: 2 },
      {
        type: "p",
        text: "Open the **Parameters** panel with `Ctrl+Shift+P` (`⌘⇧P` on macOS) and add the user parameters below. Expressions may reference other parameters, so the hub diameter and bolt circle follow the flange automatically.",
      },
      {
        type: "table",
        caption: "User parameters for the flanged bushing",
        mono: [0, 1, 2],
        columns: ["Name", "Expression", "Value", "Purpose"],
        rows: [
          ["flange_dia", "80 mm", "80.00 mm", "Outside diameter of the flange"],
          ["flange_t", "10 mm", "10.00 mm", "Flange thickness"],
          ["hub_dia", "flange_dia * 0.55", "44.00 mm", "Hub diameter"],
          ["height", "40 mm", "40.00 mm", "Overall height"],
          ["bore_dia", "24 mm", "24.00 mm", "Through bore"],
          ["bolt_pcd", "(flange_dia + hub_dia) / 2", "62.00 mm", "Bolt circle diameter"],
          ["bolt_dia", "8 mm", "8.00 mm", "Bolt hole diameter"],
          ["fillet_rad", "2 mm", "2.00 mm", "Hub-to-flange fillet"],
        ],
      },
      {
        type: "p",
        text: "You can also create parameters from the command line. Units are optional when they match the document unit.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: [
          "PARAM ADD NAME=flange_dia VALUE=80mm",
          "PARAM ADD NAME=flange_t VALUE=10mm",
          "PARAM ADD NAME=hub_dia VALUE=flange_dia*0.55",
          "PARAM ADD NAME=height VALUE=40mm",
          "PARAM ADD NAME=bore_dia VALUE=24mm",
          "PARAM ADD NAME=bolt_pcd VALUE=(flange_dia+hub_dia)/2",
          "PARAM ADD NAME=bolt_dia VALUE=8mm",
          "PARAM ADD NAME=fillet_rad VALUE=2mm",
        ].join("\n"),
      },
      { type: "h2", text: "Create the base feature", id: "create-the-base-feature", step: 3 },
      {
        type: "p",
        text: "Start a sketch on the **Top (XY)** plane. Draw two circles centred on the origin and dimension them with parameter names instead of numbers: type `flange_dia` into the dimension field rather than `80`. Both circles turn from blue to white when the sketch is fully constrained.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: [
          "SKETCH PLANE=XY NAME=Sketch1",
          "CIRCLE CENTER=0,0 DIAMETER=flange_dia",
          "CIRCLE CENTER=0,0 DIAMETER=bore_dia",
          "SKETCH FINISH",
          "EXTRUDE PROFILE=Sketch1 DISTANCE=flange_t",
        ].join("\n"),
      },
      {
        type: "p",
        text: "The region between the circles becomes the flange. Because the bore circle is part of the same profile, the hole is cut as part of the extrusion rather than as a separate feature.",
      },
      { type: "h2", text: "Add the hub and bolt holes", id: "add-the-hub-and-bolt-holes", step: 4 },
      {
        type: "p",
        text: "Sketch on the top face of the flange, extrude the hub up to the overall height, then place one bolt hole on the bolt circle and pattern it around the Z axis.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: [
          "SKETCH FACE=Extrude1.Top NAME=Sketch2",
          "CIRCLE CENTER=0,0 DIAMETER=hub_dia",
          "CIRCLE CENTER=0,0 DIAMETER=bore_dia",
          "SKETCH FINISH",
          "EXTRUDE PROFILE=Sketch2 DISTANCE=height-flange_t OPERATION=JOIN",
          "HOLE FACE=Extrude1.Top CENTER=bolt_pcd/2,0 DIAMETER=bolt_dia DEPTH=THROUGH",
          "PATTERN CIRCULAR FEATURE=Hole1 AXIS=Z COUNT=4 ANGLE=360",
        ].join("\n"),
      },
      {
        type: "callout",
        tone: "note",
        title: "Why reference faces by name",
        text: "`Extrude1.Top` is a persistent reference. If the flange thickness changes, the hub sketch moves with the face instead of staying at a fixed height.",
      },
      { type: "h2", text: "Extrude and finish", id: "extrude-and-finish", step: 5 },
      {
        type: "p",
        text: "Add a fillet where the hub meets the flange and a small chamfer on the bore entry. Then test the model: change `flange_dia` to `100 mm` in the Parameters panel. The hub, bolt circle and holes regenerate in place.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: [
          "FILLET EDGES=Extrude2.Base RADIUS=fillet_rad",
          "CHAMFER EDGES=Bore.Top DISTANCE=1mm",
          "PARAM SET NAME=flange_dia VALUE=100mm",
        ].join("\n"),
      },
      {
        type: "callout",
        tone: "success",
        title: "Your model is now fully parametric",
        text: "Edit any parameter to update the geometry. Every feature in the history tree can be reopened and changed without rebuilding the part by hand.",
      },
      { type: "h2", text: "What's next?", id: "whats-next" },
      {
        type: "links",
        items: [
          {
            title: "Create a drawing from the part",
            description: "Place views, add associative dimensions and plot to PDF.",
            href: "/docs/2d-drafting#layouts-and-plotting",
          },
          {
            title: "Use the part in an assembly",
            description: "Mate the bushing to a shaft and check clearances.",
            href: "/docs/assemblies",
          },
          {
            title: "Generate parts with Python",
            description: "Drive the same parameters from a script.",
            href: "/docs/automation#python-example",
          },
        ],
      },
    ],
  },
  {
    slug: "installation",
    category: "Installation",
    section: "Setup",
    title: "Install KufCad",
    description: `System requirements and installation steps for KufCad ${release.version} on Windows, macOS and Ubuntu, including license activation and updates.`,
    icon: "download",
    updated: release.date,
    keywords: ["install", "setup", "requirements", "windows", "macos", "ubuntu", "linux", "deb", "appimage", "dmg", "uninstall", "update", "upgrade"],
    blocks: [
      {
        type: "p",
        text: `KufCad ${release.version} is a native desktop application for Windows, macOS and Ubuntu. Installers are signed, roughly 250 MB, and do not require an account. Download the package for your platform from the [download page](/download).`,
      },
      { type: "h2", text: "System requirements", id: "system-requirements" },
      {
        type: "table",
        caption: "Minimum and recommended hardware",
        columns: ["Component", ...platforms.map((p) => p.name)],
        rows: requirementRows,
      },
      {
        type: "callout",
        tone: "note",
        title: "Graphics drivers",
        text: "Most display problems come from outdated drivers. Install the current driver from your GPU vendor before installing KufCad, especially on workstations that use integrated graphics.",
      },
      { type: "h2", text: "Windows", id: "windows" },
      {
        type: "list",
        ordered: true,
        items: [
          `Download \`${fileName(windows.files, 0)}\` (or the ARM64 installer on Snapdragon devices).`,
          "Run the installer and choose an installation folder. Administrator rights are only needed for a per-machine install.",
          "Launch KufCad from the Start menu. The first launch builds the font and material caches, which takes a few seconds.",
        ],
      },
      {
        type: "p",
        text: "For managed deployments, the installer supports a silent mode. The portable ZIP runs without installation and stores settings next to the executable.",
      },
      {
        type: "code",
        language: "powershell",
        title: "PowerShell (administrator)",
        code: `.\\${fileName(windows.files, 0)} /S /ALLUSERS /D=C:\\Program Files\\KufCad`,
      },
      { type: "h2", text: "macOS", id: "macos" },
      {
        type: "list",
        ordered: true,
        items: [
          `Download \`${fileName(macos.files, 0)}\`. The universal build runs natively on Apple Silicon and Intel Macs.`,
          "Open the disk image and drag KufCad into the Applications folder.",
          "Launch KufCad from Applications. The app is notarized by Apple, so Gatekeeper opens it without extra steps.",
        ],
      },
      { type: "h2", text: "Ubuntu", id: "ubuntu" },
      {
        type: "p",
        text: "Install the Debian package with `apt` so dependencies are resolved automatically. The package adds a desktop entry and registers `.kcd`, `.dwg` and `.step` file associations.",
      },
      {
        type: "code",
        language: "bash",
        title: "Terminal",
        code: [`sudo apt install ./${fileName(ubuntu.files, 0)}`, "kufcad --version"].join("\n"),
      },
      {
        type: "p",
        text: "The AppImage is self-contained and suits machines where you cannot install packages:",
      },
      {
        type: "code",
        language: "bash",
        title: "Terminal",
        code: [`chmod +x ${fileName(ubuntu.files, 1)}`, `./${fileName(ubuntu.files, 1)}`].join("\n"),
      },
      { type: "h2", text: "Activate a license", id: "activate-a-license" },
      {
        type: "p",
        text: "The Personal edition works immediately after installation and needs no license key. To activate a Professional seat, choose **Help → Activate License**, paste the key from your order email and select **Activate**. Activation needs an internet connection once; after that KufCad runs offline.",
      },
      {
        type: "p",
        text: "On machines without internet access, choose **Activate offline** to export a request file, upload it from another computer at the address shown in the dialog, and import the response file.",
      },
      { type: "h2", text: "Update and uninstall", id: "update-and-uninstall" },
      {
        type: "list",
        items: [
          "KufCad checks for updates at launch and installs them on your confirmation. Disable the check in **Preferences → Updates** for managed installs.",
          "**Windows:** remove KufCad from **Settings → Apps**. Your documents and preferences are kept.",
          "**macOS:** drag KufCad from Applications to the Trash. Preferences live in `~/Library/Application Support/KufCad`.",
          "**Ubuntu:** run `sudo apt remove kufcad`, or delete the AppImage file.",
        ],
      },
    ],
  },
  {
    slug: "2d-drafting",
    category: "2D Drafting",
    section: "Drafting",
    title: "2D drafting basics",
    description:
      "Coordinate input, object snaps, layers, blocks, dimensions and plotting — the fundamentals of producing drawings in KufCad.",
    icon: "drafting",
    updated: "2026-08-30",
    keywords: ["drawing", "line", "polyline", "snap", "osnap", "layer", "block", "dimension", "annotation", "plot", "print", "pdf", "layout", "dwg"],
    blocks: [
      {
        type: "p",
        text: "The 2D workspace is built for production drawings: site plans, mechanical details and architectural sheets. Geometry is stored in double precision, so coordinates keep 16 significant digits whether you draw a washer or a highway interchange.",
      },
      {
        type: "figure",
        image: screenshots.cad2d,
        frameTitle: "interchange-site-plan.dwg — KufCad",
        frameMeta: "Model · 1:1000",
        caption: "The 2D workspace: drawing area, layer-coloured geometry and the properties panel.",
      },
      { type: "h2", text: "The workspace", id: "the-workspace" },
      {
        type: "list",
        items: [
          "**Ribbon** — drawing, modify, annotation and layer tools grouped by task.",
          "**Drawing area** — an infinite model space. Scroll to zoom, middle-drag to pan.",
          "**Properties panel** — layer, colour, linetype and geometry of the current selection.",
          "**Command line** — every tool can be typed. Press `Space` or `Enter` to repeat the last command.",
        ],
      },
      { type: "h2", text: "Entering coordinates", id: "entering-coordinates" },
      {
        type: "table",
        columns: ["Format", "Example", "Meaning"],
        mono: [1],
        rows: [
          ["Absolute", "100,50", "Point at X 100, Y 50 from the origin"],
          ["Relative", "@50,0", "50 units right of the last point"],
          ["Polar", "@50<30", "50 units at 30° from the last point"],
          ["Direct distance", "50", "50 units along the current tracking direction"],
        ],
      },
      {
        type: "code",
        language: "kufcad",
        title: "Draw and offset a closed outline",
        code: ["LINE 0,0 @120,0 @0,80 @-120,0 CLOSE", "OFFSET DISTANCE=10 OBJECT=LAST SIDE=INSIDE"].join("\n"),
      },
      { type: "h2", text: "Snaps and tracking", id: "snaps-and-tracking" },
      {
        type: "p",
        text: "Object snaps lock the cursor to exact geometric points: endpoint, midpoint, centre, intersection, perpendicular and tangent. Toggle them with `F3`. Polar tracking (`F10`) shows alignment paths at set angle increments, and ortho mode (`F8`) restricts input to horizontal and vertical.",
      },
      { type: "h2", text: "Layers", id: "layers" },
      {
        type: "p",
        text: "Layers control colour, linetype, lineweight and visibility for groups of objects. Use a consistent naming standard so drawings stay readable when they are shared or referenced.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: ["LAYER NEW NAME=C-ROAD-EDGE COLOR=7 LINETYPE=CONTINUOUS", "LAYER NEW NAME=C-ROAD-CNTR COLOR=3 LINETYPE=CENTER", "LAYER SET NAME=C-ROAD-EDGE"].join("\n"),
      },
      { type: "h2", text: "Blocks", id: "blocks" },
      {
        type: "p",
        text: "A block is a named group of objects that can be inserted many times. Editing the block definition updates every instance. Use blocks for title blocks, symbols and standard details; use attributes to store data such as part numbers.",
      },
      { type: "h2", text: "Dimensions and annotation", id: "dimensions-and-annotation" },
      {
        type: "p",
        text: "Dimensions are associative: when the geometry changes, the dimension follows. Dimension styles define arrowheads, text height and precision; choose an ISO, ANSI or DIN style from the template, or create your own.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: ["DIMLINEAR P1=0,0 P2=120,0 OFFSET=-15", "DIMRADIUS OBJECT=PICK", "MTEXT POSITION=10,95 HEIGHT=3.5 TEXT=\"GENERAL TOLERANCES ISO 2768-m\""].join("\n"),
      },
      { type: "h2", text: "Layouts and plotting", id: "layouts-and-plotting" },
      {
        type: "p",
        text: "Layouts are paper sheets that show the model through scaled viewports. Add a title block, set the viewport scale, then plot to a printer or to PDF. PDF output keeps layers, so reviewers can toggle them in any PDF viewer.",
      },
      {
        type: "table",
        columns: ["Command", "Alias", "Purpose"],
        mono: [0, 1],
        rows: [
          ["LINE", "L", "Draw line segments"],
          ["PLINE", "PL", "Draw a polyline with arcs and widths"],
          ["OFFSET", "O", "Create a parallel copy at a distance"],
          ["TRIM", "TR", "Trim objects to cutting edges"],
          ["DIMLINEAR", "DLI", "Horizontal or vertical dimension"],
          ["PLOT", "Ctrl+P", "Plot the current layout"],
        ],
      },
    ],
  },
  {
    slug: "3d-modeling",
    category: "3D Modeling",
    section: "Modeling",
    title: "3D modeling",
    description:
      "Sketches, constraints, features and Boolean operations — how parametric solids are built and edited in KufCad.",
    icon: "modeling",
    updated: "2026-09-10",
    keywords: ["solid", "sketch", "constraint", "extrude", "revolve", "loft", "sweep", "shell", "boolean", "fillet", "chamfer", "history", "feature tree", "viewport", "wireframe", "x-ray"],
    blocks: [
      {
        type: "p",
        text: "KufCad models are boundary-representation (B-rep) solids built from a history of features. Each feature references sketches, parameters or earlier geometry, so changing an input regenerates everything downstream.",
      },
      {
        type: "figure",
        image: screenshots.cad3d,
        frameTitle: "fanuc-430-arm.dxf — KufCad",
        frameMeta: "Gouraud Shaded · 2 viewports",
        caption: "The 3D workspace with the modelling ribbon and two viewports showing different orientations.",
      },
      { type: "h2", text: "Sketches and constraints", id: "sketches-and-constraints" },
      {
        type: "p",
        text: "Every feature starts from a sketch on a plane or planar face. Add geometric constraints (horizontal, coincident, tangent, equal) and dimensional constraints until the sketch is fully defined. Under-constrained geometry is drawn in blue; fully constrained geometry turns white.",
      },
      { type: "h2", text: "Features", id: "features" },
      {
        type: "table",
        columns: ["Feature", "Input", "Typical use"],
        rows: [
          ["Extrude", "Closed profile + distance", "Plates, bosses, pockets"],
          ["Revolve", "Profile + axis", "Shafts, pulleys, turned parts"],
          ["Sweep", "Profile + path", "Pipes, rails, wire harnesses"],
          ["Loft", "Two or more profiles", "Transitions, ducts, hulls"],
          ["Shell", "Solid + faces to remove", "Housings and enclosures"],
          ["Fillet / Chamfer", "Edges + size", "Edge breaks and stress relief"],
        ],
      },
      { type: "h2", text: "Boolean operations", id: "boolean-operations" },
      {
        type: "p",
        text: "Combine bodies with **Union**, **Subtract** and **Intersect**. Each operation is a feature in the history tree, so tool bodies remain editable after the Boolean.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: ["BOX ORIGIN=0,0,0 SIZE=100,60,20 NAME=Base", "CYLINDER CENTER=50,30,0 RADIUS=12 HEIGHT=20 NAME=Bore", "SUBTRACT TARGET=Base TOOLS=Bore"].join("\n"),
      },
      { type: "h2", text: "The history tree", id: "the-history-tree" },
      {
        type: "p",
        text: "The history tree lists features in the order they were created. Double-click a feature to edit it, drag the rollback bar to insert new features earlier in the history, and right-click to suppress a feature without deleting it.",
      },
      { type: "h2", text: "View modes and viewports", id: "view-modes-and-viewports" },
      {
        type: "list",
        items: [
          "**Shaded** and **Shaded with Edges** for general modelling.",
          "**Wireframe** to see hidden edges and construction geometry.",
          "**X-Ray** to make bodies translucent while keeping selection on internal faces.",
          "Split the window into up to four viewports from **View → Viewports**; each keeps its own orientation and view mode.",
        ],
      },
    ],
  },
  {
    slug: "assemblies",
    category: "Assemblies",
    section: "Modeling",
    title: "Assemblies",
    description: "Insert components, position them with mates, check interference and generate a bill of materials.",
    icon: "assemblies",
    updated: "2026-08-14",
    keywords: ["assembly", "mate", "joint", "constraint", "interference", "clearance", "bom", "bill of materials", "exploded view", "subassembly", "kca"],
    blocks: [
      {
        type: "p",
        text: "An assembly document (`.kca`) references part documents rather than copying them. Edit a part and every assembly that uses it updates the next time it is opened or refreshed.",
      },
      { type: "h2", text: "Insert components", id: "insert-components" },
      {
        type: "p",
        text: "Choose **Assembly → Insert Component** and pick one or more part files. The first component is fixed at the origin; the rest are free to move until you constrain them.",
      },
      { type: "h2", text: "Mates", id: "mates" },
      {
        type: "table",
        columns: ["Mate", "Removes", "Example"],
        rows: [
          ["Coincident", "Up to 3 DOF", "Face of a bracket against a base plate"],
          ["Concentric", "4 DOF", "Shaft in a bushing bore"],
          ["Distance", "1 DOF", "Gap between two faces"],
          ["Angle", "1 DOF", "Hinged cover opened to 35°"],
          ["Parallel", "2 DOF", "Rails aligned along one direction"],
          ["Tangent", "1 DOF", "Cam follower on a cam profile"],
        ],
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: ["INSERT COMPONENT FILE=flanged-bushing.kcd NAME=Bushing", "INSERT COMPONENT FILE=shaft-24.kcd NAME=Shaft", "MATE CONCENTRIC A=Bushing.Bore B=Shaft.Surface", "MATE DISTANCE A=Bushing.Top B=Shaft.Shoulder VALUE=2mm"].join("\n"),
      },
      { type: "h2", text: "Interference and clearance", id: "interference-and-clearance" },
      {
        type: "p",
        text: "Run **Analyze → Interference** to list every pair of components whose volumes overlap, with the overlap volume. Clearance checks report pairs closer than a minimum distance you set, which catches parts that touch on paper but not in reality.",
      },
      { type: "h2", text: "Exploded views", id: "exploded-views" },
      {
        type: "p",
        text: "Create an exploded view to show assembly order. Drag components along their axes or let **Auto Explode** spread them by mate direction. Exploded views can be placed on drawing layouts with balloons linked to the BOM.",
      },
      { type: "h2", text: "Bill of materials", id: "bill-of-materials" },
      {
        type: "p",
        text: "The BOM lists part number, description, material and quantity for every component, and stays in sync with the assembly. Export it to CSV for purchasing or place it as a table on a drawing sheet.",
      },
    ],
  },
  {
    slug: "rendering",
    category: "Rendering",
    section: "Visualization",
    title: "Rendering",
    description: "Materials, lighting, cameras and render settings for producing review images from your models.",
    icon: "rendering",
    updated: "2026-07-28",
    keywords: ["render", "material", "lighting", "hdri", "camera", "depth of field", "turntable", "image", "png", "exr", "visualization"],
    blocks: [
      {
        type: "p",
        text: "The renderer is physically based and runs on the GPU. Materials and lights are stored in the model, so a render can be repeated later with identical results.",
      },
      { type: "h2", text: "Materials", id: "materials" },
      {
        type: "p",
        text: "Drag a material from the library onto a body or face. Library materials cover common metals, plastics, glass and finishes; each exposes base colour, roughness, metalness and an optional texture. Engineering materials assigned for mass properties can map to a render appearance automatically.",
      },
      { type: "h2", text: "Lighting and environment", id: "lighting-and-environment" },
      {
        type: "p",
        text: "Start with an HDRI environment for even studio lighting, then add area or spot lights to highlight features. Ground shadows and reflections can be toggled independently of the environment image.",
      },
      { type: "h2", text: "Cameras", id: "cameras" },
      {
        type: "p",
        text: "Save named cameras to reproduce a view exactly. Each camera stores focal length, position and an optional depth-of-field focus point.",
      },
      { type: "h2", text: "Render settings", id: "render-settings" },
      {
        type: "table",
        columns: ["Preset", "Samples", "Typical use"],
        mono: [1],
        rows: [
          ["Draft", "64", "Checking materials and composition"],
          ["Review", "256", "Design reviews and internal reports"],
          ["Final", "1024 + denoise", "Presentations and documentation"],
        ],
      },
      {
        type: "callout",
        tone: "note",
        title: "Edition differences",
        text: "Output up to 8K, the render queue and turntable animations are part of the Professional license. The Personal edition renders stills with the same materials and lighting.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "Command line",
        code: ["RENDER CAMERA=Front3Q PRESET=REVIEW SIZE=3840x2160 OUT=bushing-review.png"].join("\n"),
      },
    ],
  },
  {
    slug: "file-formats",
    category: "File Formats",
    section: "Data exchange",
    title: "File formats",
    description: "Supported import and export formats, unit handling and batch conversion.",
    icon: "formats",
    updated: "2026-09-02",
    keywords: ["import", "export", "dwg", "dxf", "step", "stp", "iges", "igs", "stl", "obj", "pdf", "svg", "convert", "units", "kcd", "kca"],
    blocks: [
      {
        type: "p",
        text: "KufCad reads and writes the formats engineering teams exchange every day. Native documents use `.kcd` for drawings and parts and `.kca` for assemblies; both keep full feature history.",
      },
      { type: "h2", text: "Supported formats", id: "supported-formats" },
      {
        type: "table",
        columns: ["Format", "Extensions", "Import", "Export", "Notes"],
        mono: [1],
        rows: [
          ["KufCad document", ".kcd, .kca", "Yes", "Yes", "Full history, parameters and layouts"],
          ["DWG", ".dwg", "Yes", "Yes", "R12 to 2018, layers, blocks and layouts"],
          ["DXF", ".dxf", "Yes", "Yes", "ASCII and binary"],
          ["STEP", ".step, .stp", "Yes", "Yes", "AP203 and AP214, with colours"],
          ["IGES", ".iges, .igs", "Yes", "Yes", "Surfaces and wireframe"],
          ["STL", ".stl", "Yes", "Yes", "ASCII and binary, tessellation control"],
          ["OBJ", ".obj", "Yes", "Yes", "Mesh with materials"],
          ["PDF", ".pdf", "Underlay", "Yes", "Vector output with layers"],
          ["SVG", ".svg", "Yes", "Yes", "2D geometry"],
        ],
      },
      { type: "h2", text: "Import and export", id: "import-and-export" },
      {
        type: "p",
        text: "Use **File → Import** for foreign formats. Imported 3D data arrives as solid bodies without feature history; you can still add features on top of it. **File → Export** writes the active document or the current selection.",
      },
      {
        type: "callout",
        tone: "warning",
        title: "Check units on import",
        text: "DXF and STL files do not always store units. If a part arrives 25.4 times too large or too small, re-import it and set the source unit explicitly in the import dialog.",
      },
      { type: "h2", text: "Batch conversion", id: "batch-conversion" },
      {
        type: "p",
        text: "The command-line converter processes whole folders without opening the interface. It is included with the Professional license.",
      },
      {
        type: "code",
        language: "bash",
        title: "Terminal",
        code: ["kufcad convert ./drawings/*.dwg --to pdf --layouts all --out ./issued", "kufcad convert ./parts/*.kcd --to step --schema AP214 --out ./exchange"].join("\n"),
      },
      { type: "h2", text: "Tips for clean exchange", id: "tips-for-clean-exchange" },
      {
        type: "list",
        items: [
          "Prefer STEP over IGES for solids; IGES often arrives as unconnected surfaces.",
          "Export STL with a chordal tolerance that suits the printer, typically 0.01–0.05 mm.",
          "Bind external references before sending DWG files to partners.",
        ],
      },
    ],
  },
  {
    slug: "automation",
    category: "Automation",
    section: "Scripting",
    title: "Automation and scripting",
    description: "Automate repetitive work with command scripts, the macro recorder and the KufCad Python API.",
    icon: "automation",
    updated: "2026-09-18",
    keywords: ["python", "script", "api", "macro", "batch", "headless", "plugin", "command script", "kcs", "automation"],
    blocks: [
      {
        type: "p",
        text: "KufCad offers two levels of automation. Command scripts replay the same commands you type on the command line. The Python API exposes documents, geometry and parameters for anything more involved. Scripting requires a Professional license.",
      },
      { type: "h2", text: "Command scripts and macros", id: "command-scripts-and-macros" },
      {
        type: "p",
        text: "Choose **Tools → Record Macro**, perform the steps, then stop recording. The result is a plain-text `.kcs` file that you can edit, share and run with **Tools → Run Script**.",
      },
      {
        type: "code",
        language: "kufcad",
        title: "title-block.kcs",
        code: ["LAYER SET NAME=G-ANNO-TTLB", "INSERT BLOCK NAME=ISO_A3_TITLE POSITION=0,0 SCALE=1", "ATTRIBUTE SET BLOCK=LAST TAG=DRAWN VALUE=%USER%", "ATTRIBUTE SET BLOCK=LAST TAG=DATE VALUE=%DATE%"].join("\n"),
      },
      { type: "h2", text: "The Python API", id: "python-api" },
      {
        type: "p",
        text: "KufCad bundles Python 3.12. Open **View → Scripting Console** for an interactive session against the running application, or run `.py` files from **Tools → Run Script**. The `kufcad` module is available without installation.",
      },
      { type: "h3", text: "Python example", id: "python-example" },
      {
        type: "p",
        text: "This script creates a parametric mounting plate with four corner holes and saves it. Changing the parameter values at the top produces a new size.",
      },
      {
        type: "code",
        language: "python",
        title: "mounting_plate.py",
        code: [
          "import kufcad",
          "from kufcad.geometry import Point2",
          "",
          "doc = kufcad.documents.new(kind=\"part\", template=\"ISO_METRIC\")",
          "",
          "# Named parameters stay editable in the Parameters panel",
          "p = doc.parameters",
          "p.add(\"plate_w\", \"120 mm\")",
          "p.add(\"plate_h\", \"80 mm\")",
          "p.add(\"plate_t\", \"8 mm\")",
          "p.add(\"hole_dia\", \"6.6 mm\")",
          "p.add(\"edge\", \"10 mm\")",
          "",
          "sketch = doc.sketches.add(plane=\"XY\")",
          "sketch.rectangle(Point2(0, 0), Point2(\"plate_w\", \"plate_h\"))",
          "",
          "for x, y in [(\"edge\", \"edge\"), (\"plate_w-edge\", \"edge\"),",
          "             (\"edge\", \"plate_h-edge\"), (\"plate_w-edge\", \"plate_h-edge\")]:",
          "    sketch.circle(Point2(x, y), diameter=\"hole_dia\")",
          "",
          "doc.features.extrude(sketch, distance=\"plate_t\")",
          "doc.save(\"mounting-plate.kcd\")",
          "print(f\"Saved {doc.name}: {doc.mass_properties().volume:.1f} mm³\")",
        ].join("\n"),
      },
      { type: "h3", text: "Batch export to PDF", id: "batch-export" },
      {
        type: "code",
        language: "python",
        title: "export_pdfs.py",
        code: [
          "from pathlib import Path",
          "import kufcad",
          "",
          "source = Path(\"drawings\")",
          "for path in sorted(source.glob(\"*.dwg\")):",
          "    with kufcad.open(path) as doc:",
          "        doc.export(path.with_suffix(\".pdf\"), layouts=\"all\")",
          "        print(f\"{path.name}: {len(doc.layouts)} sheets\")",
        ].join("\n"),
      },
      { type: "h2", text: "Headless mode", id: "headless-mode" },
      {
        type: "p",
        text: "Run scripts without the interface for build servers and scheduled jobs. Exit codes follow the script: an unhandled exception returns `1`.",
      },
      { type: "code", language: "bash", title: "Terminal", code: "kufcad --headless --run export_pdfs.py" },
      { type: "h2", text: "Plugins", id: "plugins" },
      {
        type: "p",
        text: "Package scripts as a plugin to add commands and ribbon buttons. A plugin is a folder with a `plugin.toml` manifest and a Python package; install it from **Tools → Plugins → Install from folder**.",
      },
    ],
  },
  {
    slug: "troubleshooting",
    category: "Troubleshooting",
    section: "Help",
    title: "Troubleshooting",
    description: "Fixes for installation, startup, licensing, performance and file import problems, and how to collect logs for support.",
    icon: "troubleshooting",
    updated: "2026-09-25",
    keywords: ["error", "crash", "problem", "fix", "license", "activation", "slow", "performance", "gpu", "driver", "log", "import failed", "installation failed"],
    blocks: [
      {
        type: "p",
        text: "Most problems fall into a handful of categories. Work through the relevant section below; if the problem persists, collect the logs described at the end and [contact support](/support#contact).",
      },
      { type: "h2", text: "Installation fails", id: "installation-fails" },
      {
        type: "list",
        items: [
          "**Windows:** if SmartScreen blocks the installer, confirm the publisher is KufCad and choose **More info → Run anyway**. Corporate policies may require an administrator to approve the installer.",
          "**macOS:** if the disk image does not open, download it again; an interrupted download fails the signature check.",
          "**Ubuntu:** if `apt` reports unmet dependencies, run `sudo apt update` and then `sudo apt --fix-broken install`.",
        ],
      },
      { type: "h2", text: "KufCad does not start", id: "does-not-start" },
      {
        type: "p",
        text: "Startup failures are almost always graphics-related. Update the GPU driver first. If KufCad still closes on launch, start it with the safe graphics option, which uses a conservative renderer and resets the viewport settings:",
      },
      { type: "code", language: "bash", title: "Terminal", code: "kufcad --safe-graphics" },
      { type: "h2", text: "License activation", id: "license-activation" },
      {
        type: "list",
        items: [
          "**Invalid key** — copy the key from the order email again; keys contain no spaces and are not case-sensitive.",
          "**Seat already in use** — deactivate the old machine with **Help → Manage License → Deactivate**, or ask support to release the seat if that machine is no longer available.",
          "**No internet connection** — use offline activation as described in [Installation](/docs/installation#activate-a-license).",
          "**Proxy or firewall** — allow HTTPS traffic to `license.kufcad.com`.",
        ],
      },
      { type: "h2", text: "Slow viewport or regeneration", id: "performance" },
      {
        type: "list",
        items: [
          "Confirm KufCad is using the dedicated GPU: **Help → System Information** lists the active renderer.",
          "Switch large assemblies to **Shaded** instead of **Shaded with Edges** while navigating.",
          "Enable **Level of detail** in **Preferences → Display** for models with many small components.",
          "Purge unused blocks, layers and styles with `PURGE ALL` before working on inherited drawings.",
        ],
      },
      { type: "h2", text: "Import problems", id: "import-problems" },
      {
        type: "list",
        items: [
          "Geometry at the wrong scale: set the source unit explicitly in the import dialog.",
          "Missing text or symbols in DWG files: install the referenced fonts, or map them in **Preferences → Fonts**.",
          "Missing external references: place referenced files next to the drawing or bind them before export.",
          "STEP bodies imported as surfaces: run **Repair → Stitch** to rebuild a closed solid.",
        ],
      },
      { type: "h2", text: "Collect logs for support", id: "collect-logs" },
      {
        type: "p",
        text: "Choose **Help → Create Support Bundle** to save logs, system information and settings into one ZIP file. Logs are also available directly:",
      },
      {
        type: "table",
        columns: ["Platform", "Log folder"],
        mono: [1],
        rows: [
          ["Windows", "%LOCALAPPDATA%\\KufCad\\logs"],
          ["macOS", "~/Library/Logs/KufCad"],
          ["Ubuntu", "~/.local/state/kufcad/logs"],
        ],
      },
    ],
  },
  {
    slug: "faq",
    category: "FAQ",
    section: "Help",
    title: "Frequently asked questions",
    description: "Answers to common questions about licensing, platforms, files and support.",
    icon: "faq",
    updated: "2026-09-25",
    keywords: ["question", "license", "commercial", "free", "offline", "seat", "transfer", "linux", "refund", "price", "buy"],
    blocks: [
      { type: "h2", text: "Licensing", id: "licensing" },
      { type: "h3", text: "Is the Personal edition free for commercial work?", id: "personal-commercial" },
      {
        type: "p",
        text: "No. The Personal edition is free for learning, hobby and personal projects. Any work you are paid for, or that is done for a business, requires a [Professional license](/pricing).",
      },
      { type: "h3", text: "How many computers can I use with one seat?", id: "seats" },
      {
        type: "p",
        text: "A Professional seat can be active on one computer at a time. Move it by deactivating the old computer and activating the new one; there is no limit on transfers.",
      },
      { type: "h3", text: "Does KufCad work offline?", id: "offline" },
      {
        type: "p",
        text: "Yes. After activation, KufCad does not need an internet connection. Update checks are skipped when offline.",
      },
      { type: "h2", text: "Platforms", id: "platforms" },
      { type: "h3", text: "Which Linux distributions are supported?", id: "linux-distributions" },
      {
        type: "p",
        text: "Ubuntu 22.04 LTS and 24.04 LTS are tested and supported. The AppImage generally runs on other modern distributions, but support is best-effort.",
      },
      { type: "h3", text: "Can I share files between operating systems?", id: "cross-platform-files" },
      {
        type: "p",
        text: "Yes. Native `.kcd` and `.kca` files are identical on every platform, and a license works on any of the three operating systems.",
      },
      { type: "h2", text: "Files and data", id: "files-and-data" },
      { type: "h3", text: "Can I open DWG files from other CAD applications?", id: "open-dwg" },
      {
        type: "p",
        text: "Yes, DWG versions R12 to 2018 open directly with layers, blocks and layouts intact. See [File formats](/docs/file-formats) for the full list.",
      },
      { type: "h3", text: "Where is autosave stored?", id: "autosave" },
      {
        type: "p",
        text: "Autosave writes a recovery copy every five minutes next to the KufCad settings folder. After a crash, KufCad offers to restore it on the next launch.",
      },
      { type: "h2", text: "Support", id: "support" },
      { type: "h3", text: "How do I report a bug?", id: "report-a-bug" },
      {
        type: "p",
        text: `Create a support bundle with **Help → Create Support Bundle** and send it with a short description of the steps to reproduce to [${site.supportEmail}](mailto:${site.supportEmail}), or use the [contact form](/support#contact).`,
      },
    ],
  },
];

/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */

export function getDoc(slug: string) {
  return docs.find((d) => d.slug === slug);
}

export function headingId(block: { text: string; id?: string }) {
  return block.id ?? slugify(block.text);
}

export function getHeadings(doc: Doc): DocHeading[] {
  const headings: DocHeading[] = [];
  for (const block of doc.blocks) {
    if (block.type === "h2") headings.push({ id: headingId(block), text: block.text, level: 2, step: block.step });
    else if (block.type === "h3") headings.push({ id: headingId(block), text: block.text, level: 3 });
  }
  return headings;
}

/** Previous and next pages in sidebar order. */
export function getAdjacentDocs(slug: string) {
  const index = docs.findIndex((d) => d.slug === slug);
  return {
    previous: index > 0 ? docs[index - 1] : undefined,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}

/** Rough reading time in minutes, from all text in the page. */
export function readingTime(doc: Doc) {
  let words = 0;
  for (const block of doc.blocks) {
    const text =
      block.type === "p" || block.type === "h2" || block.type === "h3"
        ? block.text
        : block.type === "list"
          ? block.items.join(" ")
          : block.type === "code"
            ? block.code
            : block.type === "callout"
              ? block.text
              : "";
    words += text.split(/\s+/).filter(Boolean).length;
  }
  return Math.max(1, Math.round(words / 200));
}

export function getDocNav(): DocNavItem[] {
  return docs.map((d) => ({
    slug: d.slug,
    label: d.category,
    icon: d.icon,
    headings: getHeadings(d)
      .filter((h) => h.level === 2)
      .map(({ id, text }) => ({ id, text })),
  }));
}

/** Flat search index: one entry per page and one per heading. */
export function getSearchIndex(): DocSearchEntry[] {
  const entries: DocSearchEntry[] = [];
  for (const doc of docs) {
    entries.push({
      id: doc.slug,
      href: `/docs/${doc.slug}`,
      title: doc.title,
      category: doc.category,
      kind: "page",
      haystack: [doc.title, doc.category, doc.description, ...doc.keywords].join(" ").toLowerCase(),
    });
    for (const heading of getHeadings(doc)) {
      entries.push({
        id: `${doc.slug}#${heading.id}`,
        href: `/docs/${doc.slug}#${heading.id}`,
        title: heading.text,
        category: doc.category,
        kind: "section",
        haystack: [heading.text, doc.category].join(" ").toLowerCase(),
      });
    }
  }
  return entries;
}
