import { Check } from "lucide-react";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { TechnicalLabel } from "@/components/ui/primitives";
import type { Feature } from "@/lib/content/features";
import { cn } from "@/lib/utils";
import { FeatureVisual } from "./FeatureVisual";

/** Offset between the text and the visual entering, in seconds (spec: 100–150ms). */
const VISUAL_DELAY = 0.12;

/**
 * One capability on /features. Layout alternates: `reverse` places the visual
 * first on wide screens. Text and visual enter from opposite sides, offset in time.
 */
export function FeatureSection({ feature, reverse = false }: { feature: Feature; reverse?: boolean }) {
  const titleId = `${feature.id}-title`;
  return (
    <section
      id={feature.id}
      aria-labelledby={titleId}
      className="scroll-mt-[calc(var(--nav-height)+60px)] border-t border-line py-20 first:border-t-0 sm:py-24 lg:py-28 xl:scroll-mt-[var(--nav-height)]"
    >
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 xl:gap-14">
        <MotionReveal preset={reverse ? "right" : "left"} className={cn(reverse && "md:order-2")}>
          <p aria-hidden className="flex items-center gap-3">
            <TechnicalLabel tone="accent">{feature.index}</TechnicalLabel>
            <span className="h-px w-8 bg-line-strong" />
            <TechnicalLabel className="uppercase tracking-[0.16em]">{feature.title}</TechnicalLabel>
          </p>
          <h2
            id={titleId}
            className="mt-5 text-balance text-[1.875rem] leading-[1.08] font-semibold tracking-[-0.03em] text-fg sm:text-4xl xl:text-[2.75rem]"
          >
            <span className="sr-only">{feature.title}: </span>
            {feature.headline}
          </h2>
          <p className="text-pretty mt-5 text-base leading-relaxed text-muted sm:text-[17px]">{feature.description}</p>

          <dl className="mt-8 divide-y divide-line border-y border-line">
            {feature.meta.map((row) => (
              <div key={row.label} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-baseline gap-4 py-3">
                <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">{row.label}</dt>
                <dd className="text-sm text-fg/90">{row.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 grid gap-x-6 gap-y-2.5 text-sm text-fg/85 sm:grid-cols-2">
            {feature.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-accent-hover" />
                {point}
              </li>
            ))}
          </ul>
        </MotionReveal>

        <MotionReveal
          preset={reverse ? "left" : "right"}
          delay={VISUAL_DELAY}
          amount={0.2}
          className={cn(reverse && "md:order-1")}
        >
          <FeatureVisual feature={feature} />
        </MotionReveal>
      </div>
    </section>
  );
}
