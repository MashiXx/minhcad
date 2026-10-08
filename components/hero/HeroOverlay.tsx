import { TechnicalLabel } from "@/components/ui/primitives";
import type { RobotStats } from "@/components/three/RobotScene";

const mm = (units: number) =>
  (units * 1000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Axis triad drawn in the CAD convention (X red, Y green, Z blue). */
export function AxisGizmo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <line x1="16" y1="48" x2="52" y2="48" stroke="var(--color-axis-x)" strokeWidth="1.5" />
      <path d="M52 45v6l5-3z" fill="var(--color-axis-x)" />
      <line x1="16" y1="48" x2="34" y2="34" stroke="var(--color-axis-y)" strokeWidth="1.5" />
      <path d="m33.2 31.3 4 1.4-3.7 3.4z" fill="var(--color-axis-y)" />
      <line x1="16" y1="48" x2="16" y2="10" stroke="var(--color-axis-z)" strokeWidth="1.5" />
      <path d="M13 10h6l-3-5z" fill="var(--color-axis-z)" />
      <circle cx="16" cy="48" r="2" fill="#f5f7fa" />
      <text x="58" y="51" fontSize="7" fill="var(--color-axis-x)" fontFamily="var(--font-mono)">X</text>
      <text x="38" y="31" fontSize="7" fill="var(--color-axis-y)" fontFamily="var(--font-mono)">Y</text>
      <text x="20" y="9" fontSize="7" fill="var(--color-axis-z)" fontFamily="var(--font-mono)">Z</text>
    </svg>
  );
}

/**
 * Decorative engineering overlay for the hero viewport. Dimension values
 * come from the rendered model's bounding box, so they are real.
 * Each group is revealed by the hero ScrollTrigger timeline via data-attributes.
 */
export function HeroOverlay({ stats }: { stats: RobotStats | null }) {
  const sx = stats ? mm(stats.size.x) : "—";
  const sy = stats ? mm(stats.size.y) : "—";
  const sz = stats ? mm(stats.size.z) : "—";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* Mode chip: appears as the model turns into wireframe */}
      <div data-hero="wire" className="absolute left-[8%] top-[20%] flex items-center gap-2 opacity-0">
        <span className="size-1.5 rounded-full bg-accent-hover shadow-[0_0_10px_2px_rgb(74_140_255/0.6)]" />
        <TechnicalLabel tone="accent" className="uppercase tracking-[0.18em]">
          Wireframe · Inspection
        </TechnicalLabel>
      </div>

      {/* Dimensions: appear late in the scroll */}
      <div data-hero="dims" className="absolute inset-0 opacity-0">
        {/* Horizontal (X) */}
        <div className="absolute bottom-[13%] left-[18%] right-[16%] flex items-center">
          <span className="h-3 w-px bg-axis-x/80" />
          <span className="h-px flex-1 bg-axis-x/50" />
          <span className="mx-2 rounded-sm bg-bg/70 px-1.5 py-0.5">
            <TechnicalLabel tone="x">X {sx}</TechnicalLabel>
          </span>
          <span className="h-px flex-1 bg-axis-x/50" />
          <span className="h-3 w-px bg-axis-x/80" />
        </div>
        {/* Vertical (Z, up) */}
        <div className="absolute bottom-[18%] right-[9%] top-[14%] flex flex-col items-center">
          <span className="h-px w-3 bg-axis-z/80" />
          <span className="w-px flex-1 bg-axis-z/50" />
          <span className="my-2 rounded-sm bg-bg/70 px-1.5 py-0.5 [writing-mode:vertical-rl]">
            <TechnicalLabel tone="z">Z {sy}</TechnicalLabel>
          </span>
          <span className="w-px flex-1 bg-axis-z/50" />
          <span className="h-px w-3 bg-axis-z/80" />
        </div>
        {/* Depth (Y) readout */}
        <div className="absolute bottom-[19%] left-[18%] rounded-sm bg-bg/70 px-1.5 py-0.5">
          <TechnicalLabel tone="y">Y {sz}</TechnicalLabel>
        </div>
        <AxisGizmo className="absolute bottom-[6%] left-[6%] size-14" />
      </div>
    </div>
  );
}
