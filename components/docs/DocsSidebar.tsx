"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight, LifeBuoy } from "lucide-react";
import { useId, useState } from "react";
import { flushSync } from "react-dom";
import type { DocNavItem } from "@/lib/content/docs";
import { cn } from "@/lib/utils";
import { DocIcon } from "./DocIcon";
import { scrollToId } from "./scroll";

type NavListProps = {
  nav: DocNavItem[];
  activeSlug: string | null;
  /** Called before navigating, e.g. to close the mobile panel. */
  onNavigate?: () => void;
};

function NavList({ nav, activeSlug, onNavigate }: NavListProps) {
  return (
    <ul className="flex flex-col gap-0.5">
      {nav.map((item) => {
        const active = item.slug === activeSlug;
        return (
          <li key={item.slug}>
            <Link
              href={`/docs/${item.slug}`}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "group relative flex min-h-11 items-center gap-3 rounded-[8px] px-3 text-[14px] transition-colors duration-200 lg:min-h-10",
                active ? "bg-accent-soft text-fg" : "text-muted hover:bg-white/[0.04] hover:text-fg",
              )}
            >
              {active ? <span aria-hidden className="absolute inset-y-2 left-0 w-px bg-accent" /> : null}
              <DocIcon
                name={item.icon}
                className={cn("size-4 shrink-0 transition-colors", active ? "text-accent-hover" : "text-subtle group-hover:text-muted")}
              />
              <span className="flex-1">{item.label}</span>
              <ChevronRight
                aria-hidden
                className={cn(
                  "size-3.5 shrink-0 transition-transform duration-200",
                  active ? "rotate-90 text-accent-hover" : "text-subtle opacity-0 group-hover:opacity-100",
                )}
              />
            </Link>
            {active && item.headings.length > 0 ? (
              <ul aria-label={`${item.label} sections`} className="mb-2 ml-[21px] mt-1 border-l border-line pl-3">
                {item.headings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (onNavigate) flushSync(onNavigate);
                        scrollToId(h.id);
                      }}
                      className="flex min-h-9 items-center py-1 text-[13px] leading-snug text-muted transition-colors duration-200 hover:text-fg"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function HelpCard({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="mt-8 rounded-[12px] border border-line bg-surface-1/70 p-4">
      <LifeBuoy aria-hidden className="size-4 text-accent-hover" strokeWidth={1.8} />
      <p className="mt-3 text-sm font-medium text-fg">Need help?</p>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">Can&apos;t find an answer? Our engineers reply within one business day.</p>
      <Link
        href="/support#contact"
        onClick={onNavigate}
        className="mt-3 inline-flex min-h-9 items-center text-[13px] font-medium text-accent-hover transition-colors hover:text-fg"
      >
        Contact support
      </Link>
    </div>
  );
}

/**
 * Documentation navigation. Sticky left column on desktop; a disclosure
 * panel ("Browse documentation") above the content on smaller screens.
 */
export function DocsSidebar({ nav, activeSlug }: { nav: DocNavItem[]; activeSlug: string | null }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const current = nav.find((n) => n.slug === activeSlug);

  return (
    <aside aria-label="Documentation" className="min-w-0">
      {/* Mobile / tablet disclosure */}
      <div className="lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className="flex min-h-12 w-full items-center gap-3 rounded-[10px] border border-line-strong bg-surface-1/80 px-4 text-left transition-colors hover:border-white/20"
        >
          {current ? <DocIcon name={current.icon} className="size-4 text-accent-hover" /> : null}
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-medium text-fg">Browse documentation</span>
            {current ? <span className="block truncate text-xs text-muted">{current.label}</span> : null}
          </span>
          <ChevronDown aria-hidden className={cn("size-4 text-muted transition-transform duration-200", open && "rotate-180")} />
        </button>
        <nav id={panelId} aria-label="Documentation pages" hidden={!open} className="mt-2 rounded-[12px] border border-line bg-surface-1/90 p-2">
          <NavList nav={nav} activeSlug={activeSlug} onNavigate={() => setOpen(false)} />
        </nav>
      </div>

      {/* Desktop sticky column */}
      <nav
        aria-label="Documentation pages"
        data-lenis-prevent
        className="sticky top-[calc(var(--nav-height)+24px)] hidden max-h-[calc(100dvh-var(--nav-height)-48px)] overflow-y-auto overscroll-contain pb-6 pr-3 lg:block"
      >
        <p className="px-3 pb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Documentation</p>
        <NavList nav={nav} activeSlug={activeSlug} />
        <HelpCard />
      </nav>
    </aside>
  );
}
