"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ArrowUp, ChevronDown, ListTree } from "lucide-react";
import { getLenis } from "@/components/layout/SmoothScroll";
import type { TocItem } from "@/lib/content/blocks";
import { cn } from "@/lib/utils";

const SCROLL_OFFSET = 96;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollToElement(el: HTMLElement) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -SCROLL_OFFSET });
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
  }
}

/** Tracks which heading is currently being read (the last one above the reading line). */
function useActiveHeading(items: TocItem[]) {
  const key = items.map((item) => item.id).join(" ");
  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    const elements = key
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = SCROLL_OFFSET + window.innerHeight * 0.15;
      let current = elements[0].id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const last = elements[elements.length - 1];
      if (atBottom && last.getBoundingClientRect().top < window.innerHeight) current = last.id;
      setActive(current);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return [active, setActive] as const;
}

type TableOfContentsProps = {
  items: TocItem[];
  title?: string;
  /** Show numbered entries (used by legal documents). */
  numbered?: boolean;
  /** Adds a "Back to top" control below the list (desktop sidebar). */
  backToTop?: boolean;
  className?: string;
};

function TocList({
  items,
  active,
  numbered,
  onSelect,
}: {
  items: TocItem[];
  active: string | null;
  numbered: boolean;
  onSelect: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
}) {
  const numbers = items.map((item, index) =>
    item.level === 2 ? items.slice(0, index + 1).filter((entry) => entry.level === 2).length : null,
  );
  return (
    <ol className="relative border-l border-line">
      {items.map((item, index) => {
        const isActive = item.id === active;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => onSelect(event, item.id)}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "-ml-px flex min-h-9 items-start gap-2.5 border-l py-1.5 pr-2 text-[13.5px] leading-snug transition-colors duration-200",
                item.level === 3 ? "pl-7" : "pl-4",
                isActive
                  ? "border-accent text-fg"
                  : "border-transparent text-muted hover:border-line-strong hover:text-fg",
              )}
            >
              {numbered && numbers[index] !== null ? (
                <span
                  className={cn(
                    "w-5 shrink-0 pt-px font-mono text-[11px] tabular-nums",
                    isActive ? "text-accent-hover" : "text-subtle",
                  )}
                >
                  {String(numbers[index]).padStart(2, "0")}
                </span>
              ) : null}
              <span>{item.label}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

/** Sticky "On this page" navigation for wide screens. */
export function TableOfContents({
  items,
  title = "On this page",
  numbered = false,
  backToTop = false,
  className,
}: TableOfContentsProps) {
  const [active, setActive] = useActiveHeading(items);

  const onSelect = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    // Keep Lenis' own anchor handler from scrolling with a different offset.
    event.stopPropagation();
    scrollToElement(el);
    el.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, "", `#${id}`);
    setActive(id);
  };

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <nav aria-label={title} className={className}>
      <p className="mb-4 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-subtle">{title}</p>
      <TocList items={items} active={active} numbered={numbered} onSelect={onSelect} />
      {backToTop ? (
        <button
          type="button"
          onClick={toTop}
          className="mt-6 inline-flex min-h-9 items-center gap-2 rounded-md text-[13px] text-muted transition-colors hover:text-fg"
        >
          <ArrowUp aria-hidden className="size-3.5" />
          Back to top
        </button>
      ) : null}
    </nav>
  );
}

/** Collapsible table of contents for small screens. */
export function CollapsibleTableOfContents({
  items,
  title = "On this page",
  numbered = false,
  className,
}: Omit<TableOfContentsProps, "backToTop">) {
  const [active, setActive] = useActiveHeading(items);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const onSelect = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    event.stopPropagation();
    if (detailsRef.current) detailsRef.current.open = false;
    scrollToElement(el);
    el.focus({ preventScroll: true });
    window.history.replaceState(window.history.state, "", `#${id}`);
    setActive(id);
  };

  if (items.length === 0) return null;
  const activeLabel = items.find((item) => item.id === active)?.label;

  return (
    <nav aria-label={title} className={className}>
      <details ref={detailsRef} className="group rounded-[12px] border border-line bg-surface-1/80">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-2.5 [&::-webkit-details-marker]:hidden">
          <ListTree aria-hidden className="size-4 shrink-0 text-accent-hover" />
          <span className="min-w-0 flex-1">
            <span className="block font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">{title}</span>
            {activeLabel ? <span className="block truncate text-sm text-fg">{activeLabel}</span> : null}
          </span>
          <ChevronDown
            aria-hidden
            className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
          />
        </summary>
        <div className="max-h-[60vh] overflow-y-auto border-t border-line px-4 py-4" data-lenis-prevent>
          <TocList items={items} active={active} numbered={numbered} onSelect={onSelect} />
        </div>
      </details>
    </nav>
  );
}
