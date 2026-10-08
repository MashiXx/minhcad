import { images, screenshots, type ImageAsset } from "./assets";
import { countWords, type Block } from "./blocks";

export const blogCategories = ["Product", "Tutorials", "Engineering", "Updates"] as const;
export type BlogCategory = (typeof blogCategories)[number];

export type BlogAuthor = { name: string; role: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Estimated reading time in minutes, derived from the body. */
  readingTime: number;
  image: ImageAsset;
  /** "screenshot" images are real application captures and get a window frame. */
  imageKind: "screenshot" | "visual";
  /** Title shown in the window frame when imageKind is "screenshot". */
  imageWindowTitle?: string;
  author: BlogAuthor;
  featured?: boolean;
  body: Block[];
};

/** Everything a card needs; safe to pass to client components. */
export type BlogPostSummary = Omit<BlogPost, "body">;

const authors = {
  product: { name: "KufCad Product Team", role: "Release management and product design" },
  engineering: { name: "KufCad Engineering", role: "Geometry kernel and viewport" },
  docs: { name: "KufCad Documentation", role: "Guides, tutorials and reference" },
} satisfies Record<string, BlogAuthor>;

type PostSource = Omit<BlogPost, "readingTime">;

const WORDS_PER_MINUTE = 200;

const sources: PostSource[] = [
  /* ---------------------------------------------------------------- */
  {
    slug: "kufcad-1-0-released",
    title: "KufCad 1.0 released",
    excerpt:
      "The first stable release is available for Windows, macOS and Ubuntu: 2D drafting, solid modeling, assemblies and a complete DWG, DXF, STEP, IGES and STL toolchain in one native application.",
    category: "Updates",
    date: "2026-01-15",
    image: screenshots.cad3d,
    imageKind: "screenshot",
    imageWindowTitle: "fanuc-430-arm.dxf — KufCad 1.0",
    author: authors.product,
    body: [
      {
        type: "p",
        text: "KufCad 1.0 is available today. It is the first release we consider stable enough for production drawings and models, and it ships with the same feature set on Windows, macOS and Ubuntu. If you have used the preview builds, your files open without conversion.",
      },
      {
        type: "p",
        text: "This post summarises what is in the release, what we tested it against and the limitations we already know about.",
      },
      { type: "h2", text: "What is in 1.0" },
      {
        type: "ul",
        items: [
          "**2D drafting** with layers, blocks, hatches, text styles and associative dimensions.",
          "**3D modeling** with extrude, revolve, loft, sweep and press-pull, Boolean union, subtract and intersect, fillets and chamfers.",
          "**Assemblies** with component instancing, mates and exploded views.",
          "**Visualization** with shaded, wireframe and X-ray display modes and a standard renderer.",
          "**Interoperability** with DWG, DXF, STEP, IGES and STL import and export.",
          "**Multiple viewports**, a view cube and user coordinate systems.",
        ],
      },
      { type: "h2", text: "Drafting" },
      {
        type: "p",
        text: "The drafting tools are designed around the conventions most teams already follow. Layers carry colour, linetype and lineweight; blocks can be nested and redefined; dimensions stay attached to the geometry they measure and update when it moves. Object snaps, polar tracking and a command line are available throughout, so experienced drafters can work entirely from the keyboard.",
      },
      {
        type: "figure",
        image: screenshots.cad2d,
        window: { title: "interchange-phase-2.dwg — KufCad", meta: "Model · 1:1000" },
        caption: "A road interchange drawing with colour-coded layers and the properties panel.",
      },
      { type: "h2", text: "Modeling and assemblies" },
      {
        type: "p",
        text: "Solids are built from sketches and features, and every feature remains editable. Assemblies reference part files rather than copying them, so a change to a part propagates to every assembly that uses it. Exploded views are stored with the assembly and can be placed on drawing sheets.",
      },
      { type: "h2", text: "File compatibility" },
      {
        type: "p",
        text: "We tested import and export against a corpus of more than 4,000 customer-supplied and public files, covering DWG and DXF releases from 2000 to 2018, STEP AP203, AP214 and AP242, IGES 5.3 and binary and ASCII STL. Round-tripping a file through KufCad preserves layers, blocks, dimension styles and, for STEP, assembly structure and colours.",
      },
      {
        type: "note",
        title: "Unsupported entities",
        text: "Proxy objects created by third-party plug-ins in DWG files are preserved on save but are not displayed. KufCad lists them in the import report so nothing is lost silently.",
      },
      { type: "h2", text: "Platforms and requirements" },
      {
        type: "p",
        text: "1.0 runs on Windows 10 (22H2) and Windows 11 on x64 and ARM64, on macOS 13 or later as a universal binary for Apple Silicon and Intel, and on Ubuntu 22.04 and 24.04 as a Debian package or AppImage. We recommend 16 GB of memory for large assemblies. Full requirements and installers are on the [download page](/download).",
      },
      { type: "h2", text: "Licensing" },
      {
        type: "p",
        text: "The Personal license is free for non-commercial work and includes every modeling and drafting tool. The Professional license adds commercial use, the scripting and automation API, advanced rendering and priority support. See [pricing](/pricing) for details.",
      },
      { type: "h2", text: "Known issues" },
      {
        type: "ul",
        items: [
          "Tessellation of very large STEP files (over 1 GB) runs on a single thread. Import completes, but slower than we would like.",
          "On Ubuntu sessions using Wayland with mixed-DPI monitors, moving the window between displays may require a restart to pick up the new scale factor.",
          "Hatch patterns imported from custom `.pat` files must be placed in the support folder before the drawing is opened.",
        ],
      },
      { type: "h2", text: "What comes next" },
      {
        type: "p",
        text: "Our next milestones are multithreaded import, annotation scaling across viewports and a set of additional modeling features. We will publish progress on this blog. If you find a problem, the [support page](/support) explains how to send us a report with the information we need to reproduce it.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "one-application-three-platforms",
    title: "One application, three platforms",
    excerpt:
      "KufCad ships native builds for Windows, macOS and Ubuntu from a single codebase. How we keep geometry, files and behaviour identical while still respecting each platform.",
    category: "Product",
    date: "2026-02-19",
    image: images.robotViewport,
    imageKind: "visual",
    author: authors.engineering,
    body: [
      {
        type: "p",
        text: "Engineering teams rarely standardise on one operating system. A design office may run Windows, the industrial designers use macOS, and the simulation group works on Linux. A CAD tool that behaves differently on each of those machines creates friction at every hand-off. From the start, we decided KufCad would be one application that happens to run on three platforms, not three applications that share a name.",
      },
      { type: "h2", text: "One geometry kernel" },
      {
        type: "p",
        text: "Everything that determines the shape of a model — sketch solving, feature evaluation, Booleans, fillets, tessellation — lives in a platform-independent core. The same source, the same compiler settings for floating-point behaviour, and the same test suite run on all three operating systems. A model rebuilt on macOS produces the same faces and edges as the same model rebuilt on Windows.",
      },
      {
        type: "p",
        text: "We verify this continuously. Every change runs a regression suite of several thousand parts and drawings on each platform, and the results are compared geometrically: volume, surface area, bounding box and face count must match within tolerance. A difference on one platform fails the build for all of them.",
      },
      { type: "h2", text: "Native rendering on each system" },
      {
        type: "p",
        text: "Display is the one place where we deliberately diverge. The viewport talks to the graphics API each platform does best: Direct3D 12 on Windows, Metal on macOS, and Vulkan with an OpenGL 4.5 fallback on Ubuntu. A thin abstraction keeps the rendering logic shared, while the backends use each driver efficiently.",
      },
      {
        type: "quote",
        text: "Portability should be invisible in the file and obvious in the frame rate.",
      },
      { type: "h2", text: "Identical files" },
      {
        type: "p",
        text: "KufCad files do not contain anything platform-specific. Paths to referenced parts are stored relative to the assembly, line endings and text encodings are normalised, and fonts used in annotations are embedded or substituted with a recorded mapping. A project folder can move between machines through a network share, a Git repository or a USB drive and open unchanged.",
      },
      { type: "h2", text: "Respecting platform conventions" },
      {
        type: "p",
        text: "Identical behaviour does not mean identical chrome. On macOS, KufCad uses the system menu bar and Command-based shortcuts; on Windows and Ubuntu, Control-based shortcuts and an in-window menu. File dialogs, high-DPI scaling, dark mode and trackpad gestures follow each system. The ribbon, panels and command names are the same everywhere, so documentation and training apply to every seat.",
      },
      { type: "h2", text: "Licenses that move with you" },
      {
        type: "p",
        text: "A license is tied to a person, not an operating system. Professional seats can be released from one machine and activated on another, regardless of platform, which matters when an engineer moves from a desktop workstation to a laptop on site.",
      },
      { type: "h2", text: "Packaging" },
      {
        type: "ul",
        items: [
          "**Windows**: a signed installer for x64 and ARM64, plus a portable archive for locked-down machines.",
          "**macOS**: a notarised universal disk image for Apple Silicon and Intel.",
          "**Ubuntu**: a Debian package for 22.04 and 24.04 LTS and an AppImage for other distributions.",
        ],
      },
      {
        type: "p",
        text: "Installers and checksums for each build are listed on the [download page](/download).",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "ten-tips-for-faster-3d-modeling",
    title: "10 tips for faster 3D modeling",
    excerpt:
      "Small habits that compound: how to structure sketches, features and views so models are quicker to build, easier to change and lighter to rebuild.",
    category: "Tutorials",
    date: "2026-03-24",
    image: images.robotWireframe,
    imageKind: "visual",
    author: authors.docs,
    body: [
      {
        type: "p",
        text: "Speed in 3D modeling rarely comes from clicking faster. It comes from building models that need fewer corrections and survive change without falling apart. These ten habits apply to most parametric work in KufCad, from brackets to multi-part assemblies.",
      },
      { type: "h2", text: "Sketches" },
      { type: "h3", text: "1. Fully constrain before you extrude" },
      {
        type: "p",
        text: "An under-constrained sketch will move when you edit something nearby, and the features built on it will follow. Add dimensions and geometric constraints until the sketch turns fully defined. It takes a minute now and saves an hour of repair later.",
      },
      {
        type: "figure",
        image: images.dimensionDrawing,
        caption: "A fully defined profile: every edge is located from a datum, so nothing moves unless a dimension changes.",
      },
      { type: "h3", text: "2. Keep sketches simple" },
      {
        type: "p",
        text: "One profile per sketch is easier to read and edit than a single sketch that drives five features. Leave fillets and chamfers out of the sketch; they belong in the feature tree, where they can be suppressed or changed independently.",
      },
      { type: "h3", text: "3. Sketch on reference planes, not on faces" },
      {
        type: "p",
        text: "Sketches attached to model faces break when those faces are removed or split. Where you can, sketch on the origin planes or on offset construction planes. The model becomes far more tolerant of upstream edits.",
      },
      { type: "h2", text: "Features" },
      { type: "h3", text: "4. Model in the order of manufacture" },
      {
        type: "p",
        text: "Start from the stock or the primary form, then remove material the way a machinist would: pockets, holes, then edge breaks. A feature tree that follows the manufacturing sequence is easier for others to understand and to review.",
      },
      {
        type: "figure",
        image: images.housingPart,
        caption: "A machined housing built stock-first: the base block, then the bores, then the mounting holes.",
      },
      { type: "h3", text: "5. Pattern and mirror instead of repeating" },
      {
        type: "p",
        text: "If a feature appears more than once, model it once and use a linear, circular or mirror pattern. Changing the seed feature updates every instance, and the rebuild is cheaper than evaluating copies.",
      },
      { type: "h3", text: "6. Add fillets and chamfers last" },
      {
        type: "p",
        text: "Edge treatments create many small faces. Applied early, they multiply the work of every later feature and are the most common cause of failed rebuilds. Group them at the end of the tree so they can be suppressed while you iterate.",
      },
      { type: "h3", text: "7. Name the features that matter" },
      {
        type: "p",
        text: "`Extrude14` tells a colleague nothing. `Mounting boss` or `Bearing bore Ø42` does. Name the features someone is likely to edit, and the tree becomes documentation.",
      },
      { type: "h2", text: "Views and selection" },
      { type: "h3", text: "8. Use split viewports" },
      {
        type: "p",
        text: "Keep a front or top orthographic view beside the perspective view. You see alignment problems immediately instead of orbiting back and forth.",
      },
      { type: "h3", text: "9. Switch display mode to select hidden geometry" },
      {
        type: "p",
        text: "X-ray and wireframe modes let you pick edges and faces on the far side of a part without rotating the view. Switch back to shaded once the selection is made.",
      },
      { type: "h3", text: "10. Learn the command names" },
      {
        type: "p",
        text: "Every ribbon command can be typed at the command line, and the command line completes as you type. For the dozen commands you use every day, the keyboard is consistently faster than the mouse. The [documentation](/docs) lists each command with its options.",
      },
      {
        type: "note",
        title: "Rule of thumb",
        text: "If an edit makes you rebuild more than you changed, the model structure is the problem, not the edit.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "from-sketch-to-system-designing-with-intent",
    title: "From sketch to system: designing with intent",
    excerpt:
      "Good models begin with a clear idea of what must not change. How to capture constraints early, turn geometry into intent and keep a design legible as it grows.",
    category: "Engineering",
    date: "2026-05-12",
    image: images.intersectionBlueprint,
    imageKind: "visual",
    author: authors.engineering,
    featured: true,
    body: [
      {
        type: "p",
        text: "Every model answers two questions: what shape is it, and why is it that shape? Most CAD tools record the first answer well. Recording the second — the design intent — is what separates a model that can be changed safely from one that must be rebuilt every time requirements shift.",
      },
      { type: "h2", text: "Start with the constraint" },
      {
        type: "p",
        text: "Before drawing anything, write down what cannot move. A bolt pattern fixed by a mating part. A clearance envelope around a moving arm. A lane width set by a design standard. These constraints define how the part behaves, fits and performs, and they narrow the solution space to the designs that can actually work.",
      },
      {
        type: "quote",
        text: "Constraints are not limitations. They are the parts of the design you have already decided.",
      },
      {
        type: "p",
        text: "In KufCad, those fixed values belong in named parameters or in the first sketch of the model, dimensioned from the origin. Everything else should be derived from them.",
      },
      { type: "h2", text: "Turn geometry into intent" },
      {
        type: "p",
        text: "Geometry without intent is just shape. A hole that is 40 mm from an edge could be there because of a clearance, a standard or coincidence, and the model cannot tell you which. Dimension it from the feature it depends on, constrain it to the centreline it shares with its mate, and the model explains itself.",
      },
      {
        type: "ul",
        items: [
          "Dimension from datums and functional features, not from whichever edge was convenient.",
          "Use equal, symmetric and concentric constraints where the design requires them, not where they happen to be true.",
          "Drive repeated values from a single parameter so they cannot drift apart.",
        ],
      },
      {
        type: "figure",
        image: images.flangeDrawing,
        caption: "A flange profile dimensioned from the bore centre. If the Ø100 bore moves, the R25 lobes and the hole pattern move with it.",
      },
      { type: "h2", text: "Inspect before you commit" },
      {
        type: "p",
        text: "Validate early, while change is cheap. Flex the key parameters to their limits and watch what breaks. Run an interference check on the assembly. Section the model through the tight spots. Confidence should come from evidence, not assumption.",
      },
      {
        type: "quote",
        text: "Find the conflict on screen, not on the shop floor.",
      },
      {
        type: "p",
        text: "A useful test is to change the most important dimension by 20 percent. If the model rebuilds into something sensible, the intent is captured. If features fail or geometry flips, the dependencies need work.",
      },
      { type: "h2", text: "A workflow that stays legible" },
      {
        type: "p",
        text: "Structure files, name features, and record the reasons behind non-obvious decisions in the model itself. A legible model lets the next engineer — or you, six months from now — make changes without reverse-engineering the original thinking.",
      },
      {
        type: "ol",
        items: [
          "One part per file, one purpose per sketch.",
          "Parameters at the top of the tree, named by function.",
          "Reference geometry grouped and labelled.",
          "Edge treatments last, so they can be suppressed during review.",
        ],
      },
      {
        type: "p",
        text: "None of this is specific to one industry. The same discipline applies to a road interchange, a machined housing or a robot cell. What changes is the vocabulary of constraints, not the method.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "working-with-large-assemblies",
    title: "Working with large assemblies",
    excerpt:
      "Where the time goes when an assembly slows down, and how structure, representations and scoped checks keep thousands of components responsive.",
    category: "Engineering",
    date: "2026-06-18",
    image: images.robotAbout,
    imageKind: "visual",
    author: authors.engineering,
    body: [
      {
        type: "p",
        text: "An assembly with a few dozen parts behaves like a single model. One with several thousand behaves like a database. The techniques that keep it fast are mostly about structure, and most of them pay off long before performance becomes a problem.",
      },
      { type: "h2", text: "Know where the time goes" },
      {
        type: "p",
        text: "Slow assemblies are usually slow for one of three reasons, and each has a different remedy:",
      },
      {
        type: "ul",
        items: [
          "**Display**: too many triangles on screen. Lighter representations and hiding help.",
          "**Regeneration**: mates and in-context features re-solving after every edit. Structure helps.",
          "**File I/O**: opening and resolving many referenced files. Organisation and local caching help.",
        ],
      },
      {
        type: "p",
        text: "The status bar shows rebuild and frame times. Check them before changing anything, so you fix the actual bottleneck.",
      },
      { type: "h2", text: "Mirror the product structure" },
      {
        type: "p",
        text: "Group components into subassemblies that match how the product is built and purchased: a drive unit, a gripper, a base. Mates are solved within a subassembly first, so an edit inside the gripper does not re-solve the base. The structure also maps directly to the bill of materials.",
      },
      { type: "h2", text: "Use lighter representations" },
      {
        type: "p",
        text: "Purchased parts and fasteners rarely need full detail while you work on something else. Load them as display-only meshes, or replace them with simplified envelopes that preserve mounting interfaces and clearance. Switch back to full detail for drawings and final checks.",
      },
      { type: "h2", text: "Hide, isolate and section" },
      {
        type: "p",
        text: "Isolating the subassembly you are editing removes everything else from display and selection. Section views let you work inside an enclosure without hiding its walls. Both are faster than orbiting around a crowded scene, and both reduce the chance of selecting the wrong component.",
      },
      {
        type: "figure",
        image: images.workflow,
        caption: "A structural frame in review: the member being edited is highlighted while the rest of the model stays visible as wireframe context.",
      },
      { type: "h2", text: "Scope your checks" },
      {
        type: "p",
        text: "A full interference check compares every component with every other one. On large assemblies, scope it to the components that changed and their neighbours. Run the complete check before release, not after every edit.",
      },
      {
        type: "note",
        title: "Reference numbers",
        text: "On a 16 GB workstation, KufCad keeps assemblies of around 5,000 components and drawings of 250,000 entities interactive. Beyond that, lighter representations make the largest difference.",
      },
      { type: "h2", text: "Keep references healthy" },
      {
        type: "p",
        text: "Store assemblies and their parts in a predictable folder structure and keep references relative, so the project opens on any machine. Avoid in-context references across subassemblies unless they are essential; each one ties two branches of the tree together and makes both slower to rebuild.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "previewing-kufcad-1-1",
    title: "Previewing KufCad 1.1: what is in the beta",
    excerpt:
      "Annotation scaling, layer filters, shell and draft features, and multithreaded STEP import. A look at the changes in the 1.1 beta and how to try them.",
    category: "Updates",
    date: "2026-08-27",
    image: screenshots.cad2d,
    imageKind: "screenshot",
    imageWindowTitle: "interchange-phase-2.dwg — KufCad 1.1 beta",
    author: authors.product,
    body: [
      {
        type: "p",
        text: "The first public beta of KufCad 1.1 is available to all license holders. It focuses on the requests we heard most often after 1.0: better annotation workflows for large drawing sets, two modeling features that were missing, and faster import of large files. The stable release remains 1.0, and the beta installs alongside it.",
      },
      { type: "h2", text: "Drafting" },
      { type: "h3", text: "Annotation scaling" },
      {
        type: "p",
        text: "Text, dimensions and leaders can now be marked as annotative. They keep a consistent printed size in every viewport, regardless of the viewport scale, which removes the need to maintain duplicate annotation layers for each scale.",
      },
      { type: "h3", text: "Layer filters and states" },
      {
        type: "p",
        text: "The layer panel gains property and group filters, and layer states can be saved and restored by name. Civil drawings with hundreds of layers become manageable: one click switches between a design view, a review view and a plotting view.",
      },
      {
        type: "figure",
        image: images.roundabout,
        caption: "Civil drawings with hundreds of layers benefit most: saved layer states switch a roundabout plan between design, review and plotting views.",
      },
      { type: "h2", text: "Modeling" },
      {
        type: "ul",
        items: [
          "**Shell**: hollow a solid to a uniform or per-face wall thickness, with selected faces removed.",
          "**Draft**: apply draft angles to faces relative to a neutral plane, for cast and moulded parts.",
          "**Variable-radius fillet**: specify radii at points along an edge.",
        ],
      },
      { type: "h2", text: "Performance" },
      {
        type: "p",
        text: "STEP and IGES tessellation now runs across all available cores. On our reference set, a 1.4 GB STEP assembly that took just over four minutes to open in 1.0 opens in 70 seconds on an eight-core machine. This resolves the most significant known issue from the 1.0 release.",
      },
      { type: "h2", text: "How to join the beta" },
      {
        type: "ol",
        items: [
          "Open **Preferences → Updates** in KufCad 1.0.",
          "Select the **Beta** channel and check for updates.",
          "The beta installs as a separate application, so you can keep using 1.0 for production work.",
        ],
      },
      {
        type: "note",
        title: "Before you start",
        text: "Files saved in 1.1 open in 1.0, but annotative objects are shown at their model-space size. Keep copies of production drawings until 1.1 is stable.",
      },
      { type: "h2", text: "Feedback and timeline" },
      {
        type: "p",
        text: "We plan one further beta before the stable release. Reports from beta users go directly to the engineers working on each area; the [support page](/support) explains how to submit them with a sample file.",
      },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    slug: "choosing-the-right-export-format",
    title: "Choosing the right export format",
    excerpt:
      "STEP or IGES, DWG or DXF, STL or OBJ. A practical guide to matching the export format to the person or machine receiving the file.",
    category: "Tutorials",
    date: "2026-09-10",
    image: images.robotExport,
    imageKind: "visual",
    author: authors.docs,
    body: [
      {
        type: "p",
        text: "The export dialog in KufCad offers a dozen formats. Picking the right one is less about the format and more about the receiver: what software they use, what they need to do with the file, and how much of your model they should see.",
      },
      { type: "h2", text: "Start from the receiver" },
      {
        type: "p",
        text: "Ask three questions before exporting: will they edit the geometry or only view it, do they need exact surfaces or is a mesh enough, and do they need the assembly structure? The answers narrow the choice to one or two formats.",
      },
      { type: "h2", text: "Drawings: DWG, DXF and PDF" },
      {
        type: "ul",
        items: [
          "**DWG** for anyone working in a DWG-based CAD tool. It preserves layers, blocks, dimension styles and layouts.",
          "**DXF** for CNC, laser and waterjet software, and for older or less common tools. Export only the layers the machine needs.",
          "**PDF** for review, approval and archiving. Vector output keeps lines sharp at any zoom, and layers can be preserved.",
        ],
      },
      { type: "h2", text: "Solid models: STEP and IGES" },
      {
        type: "p",
        text: "**STEP** is the default for exchanging exact 3D geometry. Use AP242 where the receiver supports it; it carries assembly structure, colours and product manufacturing information. Fall back to AP214 for older systems.",
      },
      {
        type: "p",
        text: "**IGES** predates solid modeling and transfers surfaces rather than solids. Use it only when the receiver explicitly asks for it, and expect them to stitch surfaces back into solids.",
      },
      { type: "h2", text: "Meshes: STL and OBJ" },
      {
        type: "p",
        text: "**STL** is the common input for 3D printing. Set the chordal tolerance and angle so curved surfaces are smooth at the printed size; a finer mesh is not always better, because slicers slow down on very large files. **OBJ** suits visualization and rendering tools, since it can carry materials and texture coordinates.",
      },
      {
        type: "note",
        title: "Meshes are one-way",
        text: "A mesh cannot be turned back into an accurate solid. Send STL or OBJ for printing and visualization, never as the master geometry.",
      },
      { type: "h2", text: "Units and tolerances" },
      {
        type: "p",
        text: "Most failed exchanges come down to units. STEP records units in the file, but STL and DXF do not, so state them in the file name or the transmittal. Match the export tolerance to the receiver's modeling tolerance to avoid gaps between surfaces.",
      },
      { type: "h2", text: "Name files for the receiver" },
      {
        type: "p",
        text: "A consistent naming scheme makes it obvious which file is current and what it contains. One scheme that works well:",
      },
      {
        type: "code",
        label: "project_part_revision.format",
        code: "PRJ-0420_gripper-bracket_rev-C.step\nPRJ-0420_gripper-bracket_rev-C_mm.stl\nPRJ-0420_gripper-bracket_rev-C_sheet-1.pdf\nPRJ-0420_gripper-bracket_rev-C_profile.dxf",
      },
      { type: "h2", text: "Quick reference" },
      {
        type: "ul",
        items: [
          "Machining or further design: **STEP AP242**.",
          "Drawing set for another CAD user: **DWG**.",
          "Cutting profile for CNC or laser: **DXF**, single layer, in millimetres.",
          "Review and sign-off: **PDF**.",
          "3D printing: **STL** with a tolerance suited to the printer.",
          "Rendering and visualization: **OBJ**.",
        ],
      },
    ],
  },
];

export const posts: BlogPost[] = sources
  .map((post) => ({
    ...post,
    readingTime: Math.max(1, Math.ceil(countWords(post.body) / WORDS_PER_MINUTE)),
  }))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function toSummary({ body: _body, ...summary }: BlogPost): BlogPostSummary {
  void _body;
  return summary;
}

export function getFeaturedPost() {
  return posts.find((post) => post.featured) ?? posts[0];
}

/** Related articles: same category first, then the most recent others. */
export function getRelatedPosts(post: BlogPost, limit = 3) {
  const others = posts.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, limit);
}
