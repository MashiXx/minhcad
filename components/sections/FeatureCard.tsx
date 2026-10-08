import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Feature } from "@/lib/content/features";
import { cn } from "@/lib/utils";

/** Capability card: product visual, index, title, summary and link. */
export function FeatureCard({ feature, className, href }: { feature: Feature; className?: string; href?: string }) {
  const target = href ?? `/features#${feature.id}`;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-surface-1/80 transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-strong hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.9)]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-[#0b0e12]">
        <Image
          src={feature.image.src}
          alt={feature.image.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 font-mono text-[10.5px] tracking-[0.12em] text-fg/70">{feature.index}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-[17px] font-semibold tracking-[-0.015em] text-fg">
          <Link href={target} className="after:absolute after:inset-0 focus-visible:outline-none">
            {feature.title}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-muted">{feature.summary}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-3 text-[13px] font-medium text-accent-hover">
          Learn more
          <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" />
        </span>
      </div>
      {/* Keyboard focus ring for the stretched link */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[14px] ring-accent ring-offset-2 ring-offset-bg group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
