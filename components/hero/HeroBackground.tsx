/** Engineering-workspace backdrop: perspective CAD grid, faint drafting grid, blue key glow. */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Flat drafting grid, masked to the centre */}
      <div className="cad-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_40%,#000_20%,transparent_75%)]" />

      {/* Perspective floor grid with an extremely slow drift */}
      <div className="absolute inset-x-[-25%] bottom-[-10%] h-[70%] [perspective:900px]">
        <div className="cad-grid animate-grid-drift h-full w-full origin-bottom [transform:rotateX(64deg)] opacity-90 [mask-image:linear-gradient(to_top,#000_10%,transparent_85%)]" />
      </div>

      {/* Key glow behind the model */}
      <div className="absolute right-[-10%] top-[8%] h-[80%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(47_123_255/0.16),transparent)] blur-2xl" />
      <div className="absolute bottom-0 left-0 h-40 w-full bg-gradient-to-t from-bg to-transparent" />

      {/* A single, slow technical scan line */}
      <div className="animate-scan-line absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
    </div>
  );
}
