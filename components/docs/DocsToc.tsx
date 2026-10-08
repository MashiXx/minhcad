"use client";

import Link from "next/link";
import { ArrowUp, ChevronDown } from "lucide-react";
import { useEffect, useId, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { getLenis } from "@/components/layout/SmoothScroll";
import type { DocHeading } from "@/lib/content/docs";
import { cn } from "@/lib/utils";
import { scrollToId } from "./scroll";

/** Band below the navbar in which a heading counts as "current". */
const SPY_TOP = 112;

/**
 * Scroll-spy: returns the id of the heading currently at the top of the reading area.
 * Uses IntersectionObserver; falls back to the last heading above the band
 * while scrolling through long sections.
 */
function useActiveHeading(ids: string[]) {
  const key = ids.join("|");
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    const list = key ? key.split("|") : [];
    const elements = list.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const firstVisible = list.find((id) => visible.get(id));
        if (firstVisible) {
          setActive(firstVisible);
          return;
        }
        let above: string | null = null;
        for (const el of elements) if (el.getBoundingClientRect().top < SPY_TOP) above = el.id;
        if (above) setActive(above);
      },
      { rootMargin: `-${SPY_TOP - 40}px 0px -60% 0px`, threshold: [0, 1] },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key]);

  return [active, setActive] as const;
}

function label(h: DocHeading) {
  return h.step ? `${h.step}. ${h.text}` : h.text;
}

type TocListProps = {
  headings: DocHeading[];
  active: string | null;
  onSelect: (e: MouseEvent<HTMLAnchorElement>, id: string) => void;
};

function TocList({ headings, active, onSelect }: TocListProps) {
  return (
    <ul className="flex flex-col border-l border-line">
      {headings.map((h) => {
        const current = h.id === active;
        return (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              aria-current={current ? "location" : undefined}
              onClick={(e) => onSelect(e, h.id)}
              className={cn(
                "-ml-px flex min-h-9 items-center border-l py-1.5 text-[13px] leading-snug transition-colors duration-200",
                h.level === 3 ? "pl-7" : "pl-4",
                current ? "border-accent text-fg" : "border-transparent text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {label(h)}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function createTocSelect(setActive: (id: string) => void, before?: () => void) {
  return (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    // Keep Lenis' own anchor handler from running a second scroll.
    e.stopPropagation();
    if (before) flushSync(before);
    if (scrollToId(id)) setActive(id);
  };
}

/** Sticky right-hand table of contents with scroll-spy (desktop, ≥1280px). */
export function DocsToc({ headings, title = "On this page" }: { headings: DocHeading[]; title?: string }) {
  const [active, setActive] = useActiveHeading(headings.map((h) => h.id));
  const onSelect = createTocSelect(setActive);
  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="On this page"
      data-lenis-prevent
      className="sticky top-[calc(var(--nav-height)+24px)] max-h-[calc(100dvh-var(--nav-height)-48px)] overflow-y-auto overscroll-contain pb-6"
    >
      <p className="pb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{title}</p>
      <TocList headings={headings} active={active} onSelect={onSelect} />
      <div className="mt-6 flex flex-col gap-1 border-t border-line pt-4">
        <button
          type="button"
          onClick={() => {
            const lenis = getLenis();
            if (lenis) lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
          }}
          className="inline-flex min-h-9 items-center gap-2 text-[13px] text-muted transition-colors hover:text-fg"
        >
          <ArrowUp aria-hidden className="size-3.5" />
          Back to top
        </button>
        <Link href="/support#contact" className="inline-flex min-h-9 items-center text-[13px] text-muted transition-colors hover:text-fg">
          Question about this page?
        </Link>
      </div>
    </nav>
  );
}

/** Collapsible table of contents shown above the article below 1280px. */
export function DocsTocMobile({ headings }: { headings: DocHeading[] }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useActiveHeading(headings.map((h) => h.id));
  const onSelect = createTocSelect(setActive, () => setOpen(false));
  const panelId = useId();
  if (headings.length === 0) return null;
  const current = headings.find((h) => h.id === active);

  return (
    <div className="rounded-[10px] border border-line bg-surface-1/60">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center gap-3 px-4 text-left"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">On this page</span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-muted">{current ? label(current) : ""}</span>
        <ChevronDown aria-hidden className={cn("size-4 shrink-0 text-muted transition-transform duration-200", open && "rotate-180")} />
      </button>
      <nav id={panelId} aria-label="On this page" hidden={!open} className="px-4 pb-3">
        <TocList headings={headings} active={active} onSelect={onSelect} />
      </nav>
    </div>
  );
}
