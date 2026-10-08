"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type FeatureIndexItem = { id: string; index: string; title: string };

/**
 * In-page feature navigation with scroll-spy.
 * Below xl it is a sticky horizontal strip under the navbar; from xl up it is
 * a sticky vertical index beside the feature sections.
 */
export function FeatureIndex({ items, className }: { items: FeatureIndexItem[]; className?: string }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  const listRef = useRef<HTMLOListElement>(null);

  // Track the section that crosses the upper-middle band of the viewport.
  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const intersecting = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        // First section in document order that sits inside the band.
        const current = items.find((item) => intersecting.has(item.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  // Keep the active chip visible in the horizontal strip without scrolling the page.
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const link = list.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!link) return;
    const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Feature index"
      className={cn(
        "sticky top-[var(--nav-height)] z-20 -mx-4 border-b border-line bg-bg/90 backdrop-blur-md sm:-mx-6 lg:-mx-8 xl:top-[calc(var(--nav-height)+40px)] xl:mx-0 xl:self-start xl:border-0 xl:bg-transparent xl:backdrop-blur-none",
        className,
      )}
    >
      <p className="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-subtle xl:block">Feature index</p>
      <ol
        ref={listRef}
        className="flex gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none] sm:px-6 lg:px-8 xl:mt-5 xl:flex-col xl:gap-0 xl:overflow-visible xl:border-l xl:border-line xl:p-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                data-id={item.id}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActive(item.id)}
                className={cn(
                  "relative flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-md px-3 text-[13px] transition-colors duration-200",
                  "xl:-ml-px xl:min-h-10 xl:rounded-none xl:border-l xl:pl-4",
                  isActive
                    ? "bg-white/[0.06] text-fg xl:border-accent xl:bg-transparent"
                    : "text-muted hover:text-fg xl:border-transparent",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums tracking-[0.06em]",
                    isActive ? "text-accent-hover" : "text-subtle",
                  )}
                >
                  {item.index}
                </span>
                {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
