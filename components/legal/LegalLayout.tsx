import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { RichText } from "@/components/content/RichText";
import { CollapsibleTableOfContents, TableOfContents } from "@/components/content/TableOfContents";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { Container, Eyebrow } from "@/components/ui/primitives";
import type { TocItem } from "@/lib/content/blocks";
import type { LegalDocument } from "@/lib/content/legal";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

type LegalLayoutProps = {
  document: LegalDocument;
  /** The companion document linked at the end of the page. */
  related: Pick<LegalDocument, "title" | "path" | "description">;
};

/**
 * Shared layout for legal documents: readable 800px column, numbered
 * sections, sticky contents on desktop and a collapsible list on mobile.
 */
export function LegalLayout({ document: doc, related }: LegalLayoutProps) {
  const toc: TocItem[] = doc.sections.map((section) => ({ id: section.id, label: section.title, level: 2 }));

  return (
    <div className="relative pb-24 pt-[calc(var(--nav-height)+40px)] sm:pb-32 sm:pt-[calc(var(--nav-height)+56px)]">
      <div
        aria-hidden
        className="cad-grid pointer-events-none absolute inset-x-0 top-0 h-[380px] opacity-40 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,#000,transparent)]"
      />
      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,800px)] lg:gap-16 xl:grid-cols-[240px_minmax(0,800px)] xl:gap-24">
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--nav-height)+24px)] max-h-[calc(100dvh-var(--nav-height)-48px)] overflow-y-auto pb-6 pt-1" data-lenis-prevent>
              <TableOfContents items={toc} numbered />
            </div>
          </aside>

          <div className="min-w-0">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: doc.title }]} />

            <MotionReveal as="header" className="mt-8 sm:mt-10">
              <Eyebrow>Legal</Eyebrow>
              <h1 className="mt-5 text-balance text-[2.25rem] leading-[1.06] font-semibold tracking-[-0.035em] text-fg sm:text-5xl">
                {doc.title}
              </h1>
              <p className="mt-4 font-mono text-[12px] uppercase tracking-[0.12em] text-subtle">
                Last updated <time dateTime={doc.updated}>{formatDate(doc.updated)}</time>
              </p>
              <p className="mt-6 text-pretty text-[1.0625rem] leading-relaxed text-muted sm:text-lg sm:leading-relaxed">
                {doc.intro}
              </p>
            </MotionReveal>

            <CollapsibleTableOfContents items={toc} numbered className="mt-8 lg:hidden" />

            <div className="mt-12 border-t border-line">
              {doc.sections.map((section, index) => (
                <section key={section.id} className="border-b border-line py-10 sm:py-12">
                  <h2
                    id={section.id}
                    tabIndex={-1}
                    className="flex scroll-mt-[calc(var(--nav-height)+32px)] items-baseline gap-4 text-xl font-semibold tracking-[-0.015em] text-fg outline-none sm:text-[1.375rem]"
                  >
                    <span aria-hidden className="w-7 shrink-0 font-mono text-[13px] font-medium tabular-nums text-accent-hover">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{section.title}</span>
                  </h2>
                  <RichText blocks={section.blocks} className="mt-5 sm:pl-11 [&>*:first-child]:mt-0!" />
                </section>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              <Link
                href={related.path}
                className="group flex min-h-full flex-col rounded-[14px] border border-line bg-surface-1/70 p-6 transition-[border-color,background-color] duration-300 hover:border-line-strong hover:bg-surface-2/70"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">See also</span>
                <span className="mt-3 inline-flex items-center gap-2 font-medium text-fg">
                  {related.title}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-[3px]"
                  />
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted">{related.description}</span>
              </Link>
              <a
                href={`mailto:${site.supportEmail}`}
                className="group flex min-h-full flex-col rounded-[14px] border border-line bg-surface-1/70 p-6 transition-[border-color,background-color] duration-300 hover:border-line-strong hover:bg-surface-2/70"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Questions</span>
                <span className="mt-3 inline-flex items-center gap-2 font-medium text-fg">
                  <Mail aria-hidden className="size-4 text-accent-hover" />
                  {site.supportEmail}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-muted">
                  We reply to legal and privacy requests within 30 days.
                </span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
