import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
  as: Tag = "div",
  size = "default",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "article";
  size?: "default" | "narrow" | "wide";
}) {
  const max = size === "narrow" ? "max-w-[860px]" : size === "wide" ? "max-w-[1440px]" : "max-w-[1240px]";
  return <Tag className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", max, className)}>{children}</Tag>;
}

export function Section({
  children,
  className,
  id,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  "aria-labelledby"?: string;
}) {
  return (
    <section id={id} className={cn("relative py-24 sm:py-28 lg:py-36", className)} {...rest}>
      {children}
    </section>
  );
}

/** Small uppercase label with optional leading tick, used above headings. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent-hover",
        className,
      )}
    >
      <span aria-hidden className="h-px w-4 bg-current opacity-70" />
      {children}
    </p>
  );
}

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "accent" | "success" | "robot";
}) {
  const tones = {
    neutral: "border-line-strong bg-white/[0.03] text-muted",
    accent: "border-accent/30 bg-accent-soft text-accent-hover",
    success: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
    robot: "border-robot/30 bg-robot/10 text-robot",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[11.5px] font-medium tracking-[0.01em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  id,
  as: Tag = "h2",
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-5",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Tag
        id={id}
        className="text-balance text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.035em] text-fg sm:text-5xl lg:text-[3.5rem] xl:text-[4rem]"
      >
        {title}
      </Tag>
      {description ? (
        <p className="text-pretty max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{description}</p>
      ) : null}
    </header>
  );
}

/** Monospaced engineering annotation, e.g. "X 720.00". */
export function TechnicalLabel({
  children,
  className,
  tone = "muted",
}: {
  children: ReactNode;
  className?: string;
  tone?: "muted" | "accent" | "x" | "y" | "z";
}) {
  const tones = {
    muted: "text-muted",
    accent: "text-accent-hover",
    x: "text-axis-x",
    y: "text-axis-y",
    z: "text-axis-z",
  } as const;
  return (
    <span className={cn("font-mono text-[11px] leading-none tracking-[0.06em] tabular-nums", tones[tone], className)}>
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  interactive = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      className={cn(
        "relative rounded-[14px] border border-line bg-surface-1/80",
        interactive &&
          "transition-[transform,border-color,box-shadow,background-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-line-strong hover:bg-surface-2/80 hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.9)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Thin corner ticks used to frame technical visuals. */
export function CornerMarks({ className }: { className?: string }) {
  const tick = "absolute h-2.5 w-2.5 border-white/25";
  return (
    <span aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <span className={cn(tick, "left-0 top-0 border-l border-t")} />
      <span className={cn(tick, "right-0 top-0 border-r border-t")} />
      <span className={cn(tick, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(tick, "bottom-0 right-0 border-b border-r")} />
    </span>
  );
}
