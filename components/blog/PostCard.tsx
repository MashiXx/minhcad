import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CornerMarks, TechnicalLabel } from "@/components/ui/primitives";
import type { BlogPostSummary } from "@/lib/content/blog";
import { cn } from "@/lib/utils";
import { CategoryLabel, PostMeta } from "./PostMeta";

const cardSurface =
  "group relative isolate flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-surface-1/70 transition-[border-color,background-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:border-line-strong hover:bg-surface-2/70 hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.9)]";

const imageHover =
  "object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

function ScreenshotTag() {
  return (
    <span className="absolute bottom-3 left-3 rounded-md border border-line bg-bg/75 px-2 py-1 backdrop-blur">
      <TechnicalLabel tone="accent">IN-APP</TechnicalLabel>
    </span>
  );
}

/**
 * Article card. The title link is stretched over the whole card so the card is
 * a single, real link; only the image scales on hover.
 */
export function PostCard({
  post,
  headingLevel: Heading = "h3",
  showExcerpt = true,
  className,
}: {
  post: BlogPostSummary;
  headingLevel?: "h2" | "h3";
  showExcerpt?: boolean;
  className?: string;
}) {
  return (
    <article className={cn(cardSurface, className)}>
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-[#0b0e12]">
        <Image
          src={post.image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className={imageHover}
        />
        {post.imageKind === "screenshot" ? <ScreenshotTag /> : null}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <CategoryLabel category={post.category} />
        <Heading className="mt-3 text-[1.1875rem] leading-snug font-semibold tracking-[-0.015em] text-fg text-balance">
          <Link href={`/blog/${post.slug}`} className="rounded-sm after:absolute after:inset-0 after:z-10 after:content-['']">
            {post.title}
          </Link>
        </Heading>
        {showExcerpt ? (
          <p className="mt-3 line-clamp-3 text-[14.5px] leading-relaxed text-muted">{post.excerpt}</p>
        ) : null}
        <PostMeta date={post.date} readingTime={post.readingTime} className="mt-auto pt-5" />
      </div>
    </article>
  );
}

/** Large, horizontal card for the featured article. */
export function FeaturedPostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className={cn(cardSurface, "lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]")}>
      <div className="order-2 flex flex-col p-6 sm:p-8 lg:order-1 lg:p-10">
        <div className="flex items-center gap-3">
          <span className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-accent-hover">
            Featured
          </span>
          <CategoryLabel category={post.category} className="text-muted" />
        </div>
        <h2 className="mt-5 text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.03em] text-fg text-balance sm:text-[2.25rem]">
          <Link href={`/blog/${post.slug}`} className="rounded-sm after:absolute after:inset-0 after:z-10 after:content-['']">
            {post.title}
          </Link>
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">{post.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
          <PostMeta date={post.date} readingTime={post.readingTime} />
          <span
            aria-hidden
            className="inline-flex items-center gap-2 text-sm font-medium text-fg transition-colors group-hover:text-accent-hover"
          >
            Read article
            <ArrowRight className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-[3px]" />
          </span>
        </div>
      </div>
      <div className="relative order-1 aspect-[16/9] overflow-hidden border-b border-line bg-[#0b0e12] lg:order-2 lg:aspect-auto lg:min-h-[400px] lg:border-b-0 lg:border-l">
        <Image
          src={post.image.src}
          alt=""
          fill
          preload
          sizes="(min-width: 1024px) 720px, 100vw"
          className={imageHover}
        />
        <div aria-hidden className="cad-grid pointer-events-none absolute inset-0 opacity-40 mix-blend-screen" />
        <CornerMarks className="m-4" />
        {post.imageKind === "screenshot" ? <ScreenshotTag /> : null}
      </div>
    </article>
  );
}
