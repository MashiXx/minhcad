import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, House } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Container, CornerMarks, TechnicalLabel } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you requested does not exist or has moved.",
  robots: { index: false, follow: true },
};

const shortcuts = [
  { label: "Features", href: "/features", note: "Drafting, modeling, assemblies" },
  { label: "Download", href: "/download", note: "Windows, macOS and Ubuntu" },
  { label: "Support", href: "/support", note: "Help center and contact" },
  { label: "Blog", href: "/blog", note: "Updates and tutorials" },
];

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="relative flex min-h-[calc(100dvh-var(--nav-height))] items-center overflow-hidden pb-20 pt-[calc(var(--nav-height)+48px)]"
    >
      <div
        aria-hidden
        className="cad-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_45%,#000,transparent)]"
      />
      {/* Crosshair through the empty point */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-accent/25 to-transparent" />
        <span className="absolute inset-x-0 top-[45%] h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      </div>

      <Container size="narrow" className="relative">
        <div className="relative mx-auto max-w-2xl px-2 py-10 text-center sm:px-10 sm:py-14">
          <CornerMarks />
          <p className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-bg/80 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-hover">
            <span aria-hidden className="size-1.5 rounded-full bg-axis-x" />
            ERR 404 · Entity not found
          </p>
          <h1
            id="not-found-title"
            className="mt-7 text-balance text-[2.5rem] leading-[1.04] font-semibold tracking-[-0.035em] text-fg sm:text-6xl"
          >
            Nothing at these coordinates.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted sm:text-lg">
            The page you requested does not exist or has moved. Check the address, or continue from one of the
            starting points below.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <LinkButton href="/" size="lg" icon={<House aria-hidden className="size-4" />}>
              Back to home
            </LinkButton>
            <LinkButton href="/docs" size="lg" variant="secondary" icon={<BookOpen aria-hidden className="size-4" />}>
              Documentation
            </LinkButton>
          </div>
          <div aria-hidden className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <TechnicalLabel tone="x">X —</TechnicalLabel>
            <TechnicalLabel tone="y">Y —</TechnicalLabel>
            <TechnicalLabel tone="z">Z —</TechnicalLabel>
            <TechnicalLabel className="text-subtle">SELECTION 0 ENTITIES</TechnicalLabel>
          </div>
        </div>

        <nav aria-label="Popular pages" className="mx-auto mt-10 max-w-2xl">
          <ul className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-2">
            {shortcuts.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex h-full items-center justify-between gap-4 bg-bg px-5 py-4 transition-colors hover:bg-surface-1"
                >
                  <span>
                    <span className="block text-sm font-medium text-fg">{item.label}</span>
                    <span className="block text-[13px] text-muted">{item.note}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="size-4 shrink-0 text-subtle transition-[transform,color] duration-300 ease-[var(--ease-out-expo)] group-hover:translate-x-[3px] group-hover:text-fg"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
