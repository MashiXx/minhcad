import type { Metadata } from "next";
import { BlogIndex } from "@/components/blog/BlogIndex";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { getFeaturedPost, posts, toSummary } from "@/lib/content/blog";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

const description =
  "Release notes, modeling techniques and engineering notes from the team that builds KufCad, the professional CAD application for Windows, macOS and Ubuntu.";

export const metadata: Metadata = pageMetadata({
  title: "Blog — Product Updates, Tutorials and Engineering Notes",
  description,
  path: "/blog",
  image: "/opengraph-image",
});

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `${site.name} Blog`,
  description,
  url: `${site.url}/blog`,
  publisher: { "@type": "Organization", name: site.name, url: site.url },
  blogPost: posts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    url: `${site.url}/blog/${post.slug}`,
  })),
};

export default function BlogPage() {
  const summaries = posts.map(toSummary);
  return (
    <div className="relative pb-24 pt-[calc(var(--nav-height)+40px)] sm:pb-32 sm:pt-[calc(var(--nav-height)+56px)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <div
        aria-hidden
        className="cad-grid pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-60 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,#000,transparent)]"
      />
      <Container className="relative">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog" }]} />
        <MotionReveal as="header" className="mt-8 flex max-w-3xl flex-col gap-5 sm:mt-10">
          <Eyebrow>Blog</Eyebrow>
          <h1 className="text-balance text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.035em] text-fg sm:text-6xl lg:text-[4.25rem]">
            Notes from the drawing board.
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
            Release notes, modeling technique and the engineering decisions behind {site.name} — written by the people who
            build it.
          </p>
        </MotionReveal>
        <MotionReveal delay={0.08} amount={0.05} className="mt-12 sm:mt-14">
          <BlogIndex posts={summaries} featuredSlug={getFeaturedPost().slug} />
        </MotionReveal>
      </Container>
    </div>
  );
}
