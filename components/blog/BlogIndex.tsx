"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useId, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { blogCategories, type BlogCategory, type BlogPostSummary } from "@/lib/content/blog";
import { duration, ease, spring } from "@/lib/motion/tokens";
import { cn } from "@/lib/utils";
import { FeaturedPostCard, PostCard } from "./PostCard";

type Filter = "All" | BlogCategory;
const filters: Filter[] = ["All", ...blogCategories];

const itemTransition = { duration: duration.normal, ease: ease.out };

function matches(post: BlogPostSummary, query: string) {
  if (!query) return true;
  const haystack = `${post.title} ${post.excerpt} ${post.category}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

export function BlogIndex({ posts, featuredSlug }: { posts: BlogPostSummary[]; featuredSlug: string }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const searchId = useId();
  const indicatorId = useId();

  const trimmed = query.trim();
  const results = useMemo(
    () => posts.filter((post) => (filter === "All" || post.category === filter) && matches(post, trimmed)),
    [posts, filter, trimmed],
  );
  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["All", posts.length]]);
    for (const category of blogCategories) map.set(category, posts.filter((p) => p.category === category).length);
    return map;
  }, [posts]);

  const showFeatured = filter === "All" && !trimmed;
  const featured = showFeatured ? results.find((post) => post.slug === featuredSlug) : undefined;
  const gridPosts = featured ? results.filter((post) => post.slug !== featured.slug) : results;

  const reset = () => {
    setFilter("All");
    setQuery("");
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="group"
          aria-label="Filter articles by category"
          className="-mx-4 flex min-w-0 gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {filters.map((item) => {
            const active = item === filter;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item)}
                className={cn(
                  "relative inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors duration-200 sm:h-10",
                  active ? "text-white" : "text-muted hover:bg-white/[0.04] hover:text-fg",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId={indicatorId}
                    transition={spring.ui}
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-accent shadow-[0_6px_18px_-8px_rgb(47_123_255/0.6)]"
                  />
                ) : null}
                <span className="relative">{item}</span>
                <span
                  className={cn(
                    "relative font-mono text-[11px] tabular-nums",
                    active ? "text-white/75" : "text-subtle",
                  )}
                >
                  {counts.get(item) ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative lg:w-72 lg:shrink-0">
          <label htmlFor={searchId} className="sr-only">
            Search articles
          </label>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles"
            autoComplete="off"
            className="h-11 w-full rounded-[10px] border border-line-strong bg-surface-1/80 pl-10 pr-10 text-base text-fg placeholder:text-subtle transition-colors hover:border-white/20 focus:border-accent/60 sm:h-10 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-1 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:text-fg"
            >
              <X aria-hidden className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
        {results.length === posts.length
          ? `${posts.length} articles`
          : `${results.length} of ${posts.length} articles`}
      </p>

      <AnimatePresence initial={false} mode="popLayout">
        {featured ? (
          <motion.div
            key="featured"
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={itemTransition}
            className="mt-4"
          >
            <FeaturedPostCard post={featured} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {gridPosts.length > 0 ? (
        <motion.ul layout className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {gridPosts.map((post) => (
              <motion.li
                key={post.slug}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={itemTransition}
              >
                <PostCard post={post} headingLevel={featured ? "h3" : "h2"} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : null}

      {results.length === 0 ? (
        <div className="mt-5 flex flex-col items-center rounded-[14px] border border-dashed border-line-strong px-6 py-16 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">No matches</p>
          <p className="mt-3 max-w-md text-base text-fg">
            {trimmed ? `No articles match “${trimmed}”` : "No articles in this category yet"}
            {filter !== "All" ? ` in ${filter}.` : "."}
          </p>
          <Button variant="secondary" className="mt-6" onClick={reset}>
            Show all articles
          </Button>
        </div>
      ) : null}
    </MotionConfig>
  );
}
