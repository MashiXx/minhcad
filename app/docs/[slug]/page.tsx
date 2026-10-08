import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { DocContent } from "@/components/docs/DocContent";
import { DocsColumns, DocsShell } from "@/components/docs/DocsShell";
import { DocsToc, DocsTocMobile } from "@/components/docs/DocsToc";
import { TechnicalLabel } from "@/components/ui/primitives";
import { docs, getAdjacentDocs, getDoc, getHeadings, readingTime, type Doc } from "@/lib/content/docs";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) return { title: "Page not found" };
  return pageMetadata({
    title: `${doc.title} — ${doc.category} Documentation`,
    description: doc.description,
    path: `/docs/${doc.slug}`,
    type: "article",
  });
}

export default function DocPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <DocsShell activeSlug={null}>
          <div className="min-h-[60vh]" />
        </DocsShell>
      }
    >
      <DocView params={params} />
    </Suspense>
  );
}

async function DocView({ params }: Props) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();
  return (
    <DocsShell activeSlug={doc.slug}>
      <DocArticle doc={doc} />
    </DocsShell>
  );
}

function DocArticle({ doc }: { doc: Doc }) {
  const headings = getHeadings(doc);
  const { previous, next } = getAdjacentDocs(doc.slug);
  const minutes = readingTime(doc);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    dateModified: doc.updated,
    articleSection: doc.category,
    url: `${site.url}/docs/${doc.slug}`,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };

  return (
    <DocsColumns toc={<DocsToc headings={headings} />}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structuredData)} />
      <article aria-labelledby="doc-title">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
            <li>
              <Link href="/docs" className="transition-colors hover:text-fg">
                Docs
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-subtle" />
            </li>
            <li>
              <Link href={`/docs/${doc.slug}`} className="text-accent-hover transition-colors hover:text-fg">
                {doc.category}
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-subtle" />
            </li>
            <li aria-current="page">{doc.section}</li>
          </ol>
        </nav>

        <h1
          id="doc-title"
          className="mt-5 text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-fg sm:text-[2.625rem]"
        >
          {doc.title}
        </h1>
        <p className="mt-4 max-w-[640px] text-pretty text-[17px] leading-relaxed text-muted">{doc.description}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <TechnicalLabel>Updated {formatDate(doc.updated)}</TechnicalLabel>
          <TechnicalLabel>{minutes} min read</TechnicalLabel>
          <TechnicalLabel tone="accent">{headings.filter((h) => h.level === 2).length} sections</TechnicalLabel>
        </div>

        <div className="mt-8 xl:hidden">
          <DocsTocMobile headings={headings} />
        </div>

        <div className="mt-10">
          <DocContent blocks={doc.blocks} />
        </div>

        <footer className="mt-16 border-t border-line pt-8">
          <nav aria-label="Previous and next pages" className="grid gap-3 sm:grid-cols-2">
            {previous ? (
              <Link
                href={`/docs/${previous.slug}`}
                className="group flex flex-col gap-1 rounded-[12px] border border-line bg-surface-1/60 p-4 transition-[border-color,background-color] duration-200 hover:border-line-strong hover:bg-surface-2/70"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                  <ArrowLeft aria-hidden className="size-3.5 transition-transform duration-200 group-hover:-translate-x-[3px]" />
                  Previous
                </span>
                <span className="text-[15px] font-medium text-fg">{previous.category}</span>
              </Link>
            ) : (
              <span aria-hidden className="hidden sm:block" />
            )}
            {next ? (
              <Link
                href={`/docs/${next.slug}`}
                className="group flex flex-col items-end gap-1 rounded-[12px] border border-line bg-surface-1/60 p-4 text-right transition-[border-color,background-color] duration-200 hover:border-line-strong hover:bg-surface-2/70"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                  Next
                  <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" />
                </span>
                <span className="text-[15px] font-medium text-fg">{next.category}</span>
              </Link>
            ) : null}
          </nav>
          <p className="mt-8 text-sm text-muted">
            Something unclear or out of date?{" "}
            <Link
              href="/support#contact"
              className="text-accent-hover underline decoration-accent-hover/40 underline-offset-[3px] transition-colors hover:decoration-current"
            >
              Tell the documentation team
            </Link>
            .
          </p>
        </footer>
      </article>
    </DocsColumns>
  );
}
