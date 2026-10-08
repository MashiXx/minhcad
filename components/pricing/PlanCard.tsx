import { ArrowDownToLine, ArrowRight, Check } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/primitives";
import type { Plan } from "@/lib/site";
import { cn } from "@/lib/utils";

export type LicenseTerm = { label: string; value: string };

type PlanCardProps = {
  plan: Plan;
  /** License-style facts (type, seats, term, activation) shown as a spec block. */
  terms: LicenseTerm[];
  /** Short qualifier shown as a badge beside the plan name. */
  licenseType: string;
  className?: string;
};

/**
 * A license, presented like one: name, price, terms, entitlements.
 * Hover lifts 5px with a brighter border and a slightly deeper shadow.
 */
export function PlanCard({ plan, terms, licenseType, className }: PlanCardProps) {
  const featured = plan.featured === true;
  const titleId = `plan-${plan.id}-title`;
  const isDownload = plan.cta.href.startsWith("/download");

  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        "relative flex h-full flex-col rounded-[16px] border bg-surface-1/90 p-6 sm:p-8",
        "transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-[5px]",
        "shadow-[0_20px_44px_-34px_rgb(0_0_0/0.9)] hover:shadow-[0_32px_64px_-34px_rgb(0_0_0/0.95)]",
        featured ? "border-accent/35 hover:border-accent/60" : "border-line-strong hover:border-white/20",
        className,
      )}
    >
      {featured ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
        />
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <h2 id={titleId} className="text-lg font-semibold tracking-[-0.015em] text-fg">
          {plan.name}
        </h2>
        <Badge tone={featured ? "accent" : "neutral"}>{licenseType}</Badge>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">{plan.audience}</p>

      <p className="mt-8 flex items-baseline gap-3">
        <span className="text-5xl font-semibold tracking-[-0.045em] text-fg sm:text-[56px]">{plan.price}</span>
        <span className="font-mono text-[11.5px] uppercase tracking-[0.1em] text-muted">{plan.priceNote}</span>
      </p>

      <LinkButton
        href={plan.cta.href}
        variant={featured ? "primary" : "secondary"}
        size="lg"
        className="mt-8 w-full"
        trailingIcon={
          isDownload ? <ArrowDownToLine aria-hidden className="size-4" /> : <ArrowRight aria-hidden className="size-4" />
        }
      >
        {plan.cta.label}
      </LinkButton>

      <dl className="mt-8 divide-y divide-line rounded-[10px] border border-line bg-bg/50">
        {terms.map((term) => (
          <div key={term.label} className="grid grid-cols-[minmax(0,6.5rem)_minmax(0,1fr)] items-baseline gap-3 px-4 py-2.5">
            <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">{term.label}</dt>
            <dd className="text-[13px] text-fg/90">{term.value}</dd>
          </div>
        ))}
      </dl>

      <h3 className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Included</h3>
      <ul className="mt-4 flex flex-col gap-2.5 text-sm text-fg/85">
        {plan.highlights.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent-hover" strokeWidth={2} />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
