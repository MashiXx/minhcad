"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CornerDownLeft, FileText, Hash, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import type { DocSearchEntry } from "@/lib/content/docs";
import { cn } from "@/lib/utils";
import { scrollToId } from "./scroll";

const MAX_RESULTS = 8;

function rank(entries: DocSearchEntry[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  const scored: { entry: DocSearchEntry; score: number }[] = [];
  for (const entry of entries) {
    if (!terms.every((t) => entry.haystack.includes(t))) continue;
    const title = entry.title.toLowerCase();
    let score = entry.kind === "page" ? 4 : 0;
    if (title === q) score += 100;
    else if (title.startsWith(q)) score += 50;
    else if (title.includes(q)) score += 30;
    for (const t of terms) if (title.includes(t)) score += 8;
    if (entry.category.toLowerCase().includes(q)) score += 6;
    scored.push({ entry, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map((s) => s.entry);
}

function highlight(text: string, query: string): ReactNode {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  const term = [query.trim().toLowerCase(), ...terms].find((t) => t && lower.includes(t));
  if (!term) return text;
  const start = lower.indexOf(term);
  return (
    <>
      {text.slice(0, start)}
      <mark className="bg-transparent text-accent-hover">{text.slice(start, start + term.length)}</mark>
      {text.slice(start + term.length)}
    </>
  );
}

const subscribeNoop = () => () => {};

/** "⌘K" on Apple platforms, "Ctrl K" elsewhere. Server renders the neutral form. */
function useShortcutLabel() {
  return useSyncExternalStore(
    subscribeNoop,
    () => (/Mac|iPhone|iPad/i.test(navigator.userAgent) ? "⌘K" : "Ctrl K"),
    () => "Ctrl K",
  );
}

type DocsSearchProps = {
  entries: DocSearchEntry[];
  /** Entries shown when the field is focused but empty. */
  suggestions?: DocSearchEntry[];
  placeholder?: string;
  size?: "md" | "lg";
  className?: string;
  label?: string;
};

/**
 * Client-side documentation search, implemented as an ARIA 1.2 combobox
 * with a listbox popup. ⌘K / Ctrl K focuses the field from anywhere on the page.
 */
export function DocsSearch({
  entries,
  suggestions,
  placeholder = "Search documentation",
  size = "md",
  className,
  label = "Search documentation",
}: DocsSearchProps) {
  const router = useRouter();
  const shortcut = useShortcutLabel();
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const fallback = useMemo(() => suggestions ?? entries.filter((e) => e.kind === "page").slice(0, 6), [entries, suggestions]);
  const results = useMemo(() => rank(entries, query), [entries, query]);
  const hasQuery = query.trim().length > 0;
  const options = hasQuery ? results : fallback;
  const expanded = open && (options.length > 0 || hasQuery);
  const activeIndex = Math.min(active, Math.max(options.length - 1, 0));
  const optionId = (i: number) => `${baseId}-option-${i}`;

  // Global shortcut: ⌘K / Ctrl K focuses the search field.
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function go(entry: DocSearchEntry) {
    setOpen(false);
    setQuery("");
    setActive(0);
    inputRef.current?.blur();
    const [path, hash] = entry.href.split("#");
    if (hash && path === window.location.pathname && scrollToId(hash)) return;
    router.push(entry.href);
  }

  function move(next: number) {
    setOpen(true);
    setActive(next);
    requestAnimationFrame(() => document.getElementById(optionId(next))?.scrollIntoView({ block: "nearest" }));
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    const count = options.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (count) move(open ? (activeIndex + 1) % count : 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        if (count) move(open ? (activeIndex - 1 + count) % count : count - 1);
        break;
      case "Home":
        if (open && count) {
          e.preventDefault();
          move(0);
        }
        break;
      case "End":
        if (open && count) {
          e.preventDefault();
          move(count - 1);
        }
        break;
      case "Enter":
        if (open && options[activeIndex]) {
          e.preventDefault();
          go(options[activeIndex]);
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        } else if (query) {
          e.preventDefault();
          setQuery("");
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  const lg = size === "lg";

  return (
    <div role="search" className={cn("relative", className)}>
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div
        className={cn(
          "group/search relative flex items-center rounded-[10px] border border-line-strong bg-surface-1/90 transition-[border-color,box-shadow,background-color] duration-200 focus-within:border-accent/60 focus-within:bg-surface-1 focus-within:shadow-[0_0_0_3px_rgb(47_123_255/0.18)] hover:border-white/20",
          lg ? "h-14" : "h-11",
        )}
      >
        <Search aria-hidden className={cn("pointer-events-none absolute text-muted", lg ? "left-4 size-5" : "left-3.5 size-4")} />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="go"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={expanded && options[activeIndex] ? optionId(activeIndex) : undefined}
          aria-keyshortcuts="Meta+K Control+K"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className={cn(
            "h-full w-full min-w-0 rounded-[10px] bg-transparent text-fg placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden",
            lg ? "pl-12 pr-24 text-base" : "pl-10 pr-20 text-[14px]",
          )}
        />
        <div className={cn("absolute flex items-center gap-1", lg ? "right-3" : "right-2")}>
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-white/[0.06] hover:text-fg"
            >
              <X aria-hidden className="size-4" />
            </button>
          ) : null}
          <kbd
            aria-hidden
            className="hidden h-6 items-center rounded-[5px] border border-line-strong bg-white/[0.03] px-1.5 font-mono text-[11px] text-muted sm:inline-flex"
          >
            {shortcut}
          </kbd>
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-[12px] border border-line-strong bg-surface-2/[0.98] shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl",
          !expanded && "hidden",
        )}
      >
        <p className="border-b border-line px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">
          {hasQuery ? "Results" : "Browse documentation"}
        </p>
        <ul
          id={listId}
          role="listbox"
          aria-label={hasQuery ? `Results for ${query}` : "Documentation pages"}
          data-lenis-prevent
          className="max-h-[min(420px,55vh)] overflow-y-auto overscroll-contain p-1.5"
        >
          {options.map((entry, i) => {
            const selected = i === activeIndex;
            const Icon = entry.kind === "page" ? FileText : Hash;
            return (
              <li
                key={entry.id}
                id={optionId(i)}
                role="option"
                aria-selected={selected}
                onMouseDown={(e) => e.preventDefault()}
                onMouseMove={() => !selected && setActive(i)}
                onClick={() => go(entry)}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2 text-left transition-colors duration-150",
                  selected ? "bg-accent-soft text-fg" : "text-fg/85",
                )}
              >
                <Icon aria-hidden className={cn("size-4 shrink-0", selected ? "text-accent-hover" : "text-subtle")} strokeWidth={1.8} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px]">{hasQuery ? highlight(entry.title, query) : entry.title}</span>
                  <span className="block truncate text-xs text-muted">
                    {entry.category}
                    {entry.kind === "section" ? " · Section" : ""}
                  </span>
                </span>
                <CornerDownLeft aria-hidden className={cn("size-3.5 shrink-0 text-muted", selected ? "opacity-100" : "opacity-0")} />
              </li>
            );
          })}
        </ul>
        {hasQuery && results.length === 0 ? (
          <p className="px-4 pb-4 pt-1 text-sm text-muted">
            No matches for “{query.trim()}”. Try a command name such as <span className="font-mono text-fg/80">EXTRUDE</span>, or{" "}
            <Link
              href="/support#contact"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setOpen(false)}
              className="text-accent-hover underline decoration-accent-hover/40 underline-offset-[3px] hover:decoration-current"
            >
              contact support
            </Link>
            .
          </p>
        ) : null}
      </div>

      <p role="status" className="sr-only">
        {open && hasQuery ? `${results.length} ${results.length === 1 ? "result" : "results"} available` : ""}
      </p>
    </div>
  );
}
