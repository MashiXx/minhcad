import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DocIcon } from "@/components/docs/DocIcon";
import { DocsHashRedirect } from "@/components/docs/DocsHashRedirect";
import { DocsColumns, DocsShell } from "@/components/docs/DocsShell";
import { DocsToc, DocsTocMobile } from "@/components/docs/DocsToc";
import { CornerMarks, Eyebrow, TechnicalLabel } from "@/components/ui/primitives";
import { images } from "@/lib/content/assets";
import { docs, getDoc, getHeadings, readingTime, type DocHeading } from "@/lib/content/docs";
import { pageMetadata } from "@/lib/seo";
import { release } from "@/lib/site";

const title = "KufCad Documentation — Guides for 2D Drafting, 3D Modeling and Automation";

export const metadata: Metadata = {
  ...pageMetadata({
    title,
    description:
      "Installation, tutorials and reference for KufCad: parametric modeling, 2D drafting, assemblies, rendering, file formats, Python automation and troubleshooting.",
    path: "/docs",
  }),
  title: { absolute: title },
};

const sections: DocHeading[] = [
  { id: "start-here", text: "Start here", level: 2 },
  { id: "browse-by-topic", text: "Browse by topic", level: 2 },
  { id: "common-tasks", text: "Common tasks", level: 2 },
];

const commonTasks = [
  { label: "Check system requirements", href: "/docs/installation#system-requirements" },
  { label: "Activate a Professional license", href: "/docs/installation#activate-a-license" },
  { label: "Plot a layout to PDF", href: "/docs/2d-drafting#layouts-and-plotting" },
  { label: "Import STEP and DWG files", href: "/docs/file-formats#import-and-export" },
  { label: "Run a Python script", href: "/docs/automation#python-example" },
  { label: "Fix a slow viewport", href: "/docs/troubleshooting#performance" },
  { label: "Collect logs for support", href: "/docs/troubleshooting#collect-logs" },
  { label: "Convert files in batch", href: "/docs/file-formats#batch-conversion" },
];

/** Hash targets for legacy /docs#topic links: page slugs, aliases and every heading id. */
function hashTargets() {
  const targets: Record<string, string> = {
    requirements: "/docs/installation#system-requirements",
    license: "/docs/troubleshooting#license-activation",
    "import-export": "/docs/file-formats#import-and-export",
    scripting: "/docs/automation",
    python: "/docs/automation#python-api",
  };
  for (const doc of docs) {
    for (const h of getHeadings(doc)) targets[h.id] ??= `/docs/${doc.slug}#${h.id}`;
  }
  for (const doc of docs) targets[doc.slug] = `/docs/${doc.slug}`;
  return targets;
}

const headingClass = "scroll-mt-[calc(var(--nav-height)+32px)] text-xl font-semibold tracking-[-0.015em] text-fg focus:outline-none sm:text-2xl";

export default function DocsHomePage() {
  const starter = getDoc("getting-started");
  return (
    <DocsShell activeSlug={null}>
      <DocsHashRedirect targets={hashTargets()} />
      <DocsColumns toc={<DocsToc headings={sections} />}>
        <div>
          <Eyebrow>KufCad {release.version} documentation</Eyebrow>
          <h1 className="mt-5 text-balance text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.035em] text-fg sm:text-5xl">
            Guides for every stage of the work.
          </h1>
          <p className="mt-5 max-w-[620px] text-pretty text-[17px] leading-relaxed text-muted">
            Install KufCad, build your first parametric part and learn the drafting, modeling and automation tools in
            depth. Every page is written by the engineers who build the product.
          </p>

          <div className="mt-8 xl:hidden">
            <DocsTocMobile headings={sections} />
          </div>

          {/* Start here */}
          <section aria-labelledby="start-here" className="mt-14">
            <h2 id="start-here" tabIndex={-1} className={headingClass}>
              Start here
            </h2>
            {starter ? (
              <Link
                href={`/docs/${starter.slug}`}
                className="group mt-5 grid overflow-hidden rounded-[14px] border border-line bg-surface-1/80 transition-[transform,border-color,box-shadow] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-line-strong hover:shadow-[0_24px_48px_-28px_rgb(0_0_0/0.9)] sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
              >
                <div className="cad-grid-fine relative flex items-center justify-center border-b border-line bg-[#0b0e12] p-6 sm:border-b-0 sm:border-r">
                  <Image
                    src={images.flangePart.src}
                    alt={images.flangePart.alt}
                    width={images.flangePart.width}
                    height={images.flangePart.height}
                    sizes="(min-width: 640px) 360px, 100vw"
                    className="h-auto w-full max-w-[320px] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                  <CornerMarks className="m-3" />
                  <TechnicalLabel className="absolute bottom-3 left-3 text-subtle">Ø80.00 · H40.00</TechnicalLabel>
                </div>
                <div className="flex flex-col p-6 sm:p-7">
                  <TechnicalLabel tone="accent" className="uppercase tracking-[0.14em]">
                    {starter.category} · {readingTime(starter)} min
                  </TechnicalLabel>
                  <p className="mt-3 text-xl font-semibold tracking-[-0.015em] text-fg sm:text-[22px]">{starter.title}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">{starter.description}</p>
                  <ol className="mt-5 flex flex-col gap-1.5 text-[13px] text-fg/80">
                    {getHeadings(starter)
                      .filter((h) => h.step)
                      .map((h) => (
                        <li key={h.id} className="flex items-center gap-2.5">
                          <span className="inline-flex size-5 items-center justify-center rounded-full border border-line-strong font-mono text-[10px] text-muted">
                            {h.step}
                          </span>
                          {h.text}
                        </li>
                      ))}
                  </ol>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent-hover">
                    Start the tutorial
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
                  </span>
                </div>
              </Link>
            ) : null}
          </section>

          {/* Categories */}
          <section aria-labelledby="browse-by-topic" className="mt-16">
            <h2 id="browse-by-topic" tabIndex={-1} className={headingClass}>
              Browse by topic
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {docs.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/docs/${doc.slug}`}
                    className="group flex h-full gap-4 rounded-[12px] border border-line bg-surface-1/60 p-4 transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2/70 sm:p-5"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] border border-line-strong bg-white/[0.03] text-muted transition-colors group-hover:text-accent-hover">
                      <DocIcon name={doc.icon} className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[15px] font-medium text-fg">
                        {doc.category}
                        <ArrowRight
                          aria-hidden
                          className="size-3.5 text-accent-hover opacity-0 transition-[opacity,transform] duration-200 group-hover:translate-x-[2px] group-hover:opacity-100"
                        />
                      </span>
                      <span className="mt-1 block text-[13px] leading-relaxed text-muted">{doc.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Common tasks */}
          <section aria-labelledby="common-tasks" className="mt-16">
            <h2 id="common-tasks" tabIndex={-1} className={headingClass}>
              Common tasks
            </h2>
            <ul className="mt-5 grid gap-px overflow-hidden rounded-[12px] border border-line bg-line sm:grid-cols-2">
              {commonTasks.map((task) => (
                <li key={task.href} className="bg-bg">
                  <Link
                    href={task.href}
                    className="group flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-[14px] text-fg/85 transition-colors duration-200 hover:bg-surface-1 hover:text-fg"
                  >
                    {task.label}
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 text-subtle transition-[color,transform] duration-200 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-accent-hover"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </DocsColumns>
    </DocsShell>
  );
}
