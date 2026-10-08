import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Download } from "lucide-react";
import { PostCard } from "@/components/blog/PostCard";
import { CategoryLabel, PostMeta } from "@/components/blog/PostMeta";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ScreenshotFrame } from "@/components/cad/ScreenshotFrame";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { FigureStage } from "@/components/content/FigureStage";
import { RichText } from "@/components/content/RichText";
import { CollapsibleTableOfContents, TableOfContents } from "@/components/content/TableOfContents";
import { MotionReveal, RevealGroup, RevealItem } from "@/components/motion/MotionReveal";
import { LinkButton } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { getPost, getRelatedPosts, posts, toSummary, type BlogPost } from "@/lib/content/blog";
import { countWords, extractToc } from "@/lib/content/blocks";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found", robots: { index: false } };
  return {
    ...pageMetadata({
      title: post.title,
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    }),
    authors: [{ name: post.author.name }],
    category: post.category,
  };
}

function structuredData(post: BlogPost) {
  const url = `${site.url}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        image: `${site.url}${post.image.src}`,
        datePublished: post.date,
        dateModified: post.date,
        articleSection: post.category,
        wordCount: countWords(post.body),
        author: { "@type": "Organization", name: post.author.name, url: site.url },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
        mainEntityOfPage: url,
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };
}

function HeroVisual({ post }: { post: BlogPost }) {
  if (post.imageKind === "screenshot") {
    return (
      <ScreenshotFrame title={post.imageWindowTitle ?? `${post.title} — ${site.name}`}>
        <Image
          src={post.image.src}
          alt={post.image.alt}
          width={post.image.width}
          height={post.image.height}
          preload
          sizes="(min-width: 1024px) 760px, 100vw"
          className="h-auto w-full"
        />
      </ScreenshotFrame>
    );
  }
  return <FigureStage image={post.image} label={post.category} maxHeight={440} preload />;
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const toc = extractToc(post.body);
  const related = getRelatedPosts(post).map(toSummary);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData(post))} />
      <ReadingProgress targetId="article-content" />

      <article className="relative pb-20 pt-[calc(var(--nav-height)+40px)] sm:pb-28 sm:pt-[calc(var(--nav-height)+56px)]">
        <div
          aria-hidden
          className="cad-grid pointer-events-none absolute inset-x-0 top-0 h-[460px] opacity-50 [mask-image:radial-gradient(ellipse_70%_80%_at_30%_0%,#000,transparent)]"
        />
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_248px] xl:gap-20">
            <div className="min-w-0 max-w-[760px]">
              <Breadcrumbs
                items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
              />

              <MotionReveal as="header" className="mt-8 sm:mt-10">
                <CategoryLabel category={post.category} />
                <h1 className="mt-4 text-balance text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-fg sm:text-5xl lg:text-[3.375rem]">
                  {post.title}
                </h1>
                <p className="mt-5 text-pretty text-lg leading-relaxed text-muted sm:text-xl sm:leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-8 flex flex-col gap-4 border-y border-line py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-[9px] border border-line-strong bg-surface-2 font-mono text-[12px] font-medium text-accent-hover"
                    >
                      KC
                    </span>
                    <p className="text-sm leading-tight">
                      <span className="block font-medium text-fg">{post.author.name}</span>
                      <span className="block text-[13px] text-muted">{post.author.role}</span>
                    </p>
                  </div>
                  <PostMeta date={post.date} readingTime={post.readingTime} />
                </div>
              </MotionReveal>

              <MotionReveal preset="fadeIn" delay={0.1} className="mt-10">
                <HeroVisual post={post} />
              </MotionReveal>

              <CollapsibleTableOfContents items={toc} className="mt-10 lg:hidden" />

              <div id="article-content" className="mt-10 sm:mt-12">
                <RichText blocks={post.body} />
              </div>

              <footer className="mt-16 flex flex-col gap-6 rounded-[14px] border border-line bg-surface-1/70 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Written by</p>
                  <p className="mt-2 font-medium text-fg">{post.author.name}</p>
                  <p className="text-sm text-muted">{post.author.role}</p>
                </div>
                <LinkButton
                  href="/blog"
                  variant="secondary"
                  icon={<ArrowLeft aria-hidden className="size-4" />}
                  className="self-start sm:self-auto"
                >
                  All articles
                </LinkButton>
              </footer>
            </div>

            <aside className="hidden pt-14 lg:block">
              <div
                data-lenis-prevent
                className="sticky top-[calc(var(--nav-height)+24px)] max-h-[calc(100dvh-var(--nav-height)-48px)] overflow-y-auto pb-6"
              >
                <TableOfContents items={toc} backToTop />
              </div>
            </aside>
          </div>
        </Container>
      </article>

      {related.length > 0 ? (
        <section aria-labelledby="related-title" className="border-t border-line bg-surface-1/30 py-20 sm:py-24">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <Eyebrow>Keep reading</Eyebrow>
                <h2 id="related-title" className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-4xl">
                  Related articles
                </h2>
              </div>
              <Link
                href="/blog"
                className="group inline-flex min-h-11 items-center gap-2 self-start rounded-md text-sm font-medium text-muted transition-colors hover:text-fg sm:self-auto"
              >
                View all articles
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-[3px]"
                />
              </Link>
            </div>
            <RevealGroup as="ul" className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <RevealItem as="li" key={item.slug} className={index === 2 ? "sm:hidden lg:block" : undefined}>
                  <PostCard post={item} />
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </section>
      ) : null}

      <section aria-labelledby="article-cta-title" className="border-t border-line py-16 sm:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-[18px] border border-line bg-surface-1/80 px-6 py-10 sm:px-10 sm:py-12">
            <div
              aria-hidden
              className="cad-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_left,#000,transparent_70%)]"
            />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <h2 id="article-cta-title" className="text-2xl font-semibold tracking-[-0.025em] text-fg sm:text-[28px]">
                  Try it in {site.name}.
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  Free for personal use on Windows, macOS and Ubuntu. The documentation covers every command mentioned here.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <LinkButton href="/download" icon={<Download aria-hidden className="size-4" />}>
                  Download {site.name}
                </LinkButton>
                <LinkButton href="/docs" variant="secondary" icon={<BookOpen aria-hidden className="size-4" />}>
                  Documentation
                </LinkButton>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
