import Link from "next/link";
import type { ReactNode } from "react";
import { Badge, Container } from "@/components/ui/primitives";
import { getDocNav, getSearchIndex } from "@/lib/content/docs";
import { release } from "@/lib/site";
import { DocsSearch } from "./DocsSearch";
import { DocsSidebar } from "./DocsSidebar";

/**
 * Documentation frame: header with search, then a two-column grid
 * (sticky navigation + page content). Pages add their own right-hand TOC.
 */
export function DocsShell({ activeSlug, children }: { activeSlug: string | null; children: ReactNode }) {
  return (
    <div className="relative pb-24 pt-[calc(var(--nav-height)+28px)] sm:pt-[calc(var(--nav-height)+40px)]">
      <div
        aria-hidden
        className="cad-grid pointer-events-none absolute inset-x-0 top-0 h-[360px] opacity-70 [mask-image:linear-gradient(to_bottom,#000,transparent)]"
      />
      <Container size="wide" className="relative">
        <header className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex items-center gap-3">
            <Link href="/docs" className="text-[15px] font-semibold tracking-[-0.01em] text-fg transition-colors hover:text-accent-hover">
              Documentation
            </Link>
            <Badge>v{release.version}</Badge>
          </div>
          <DocsSearch entries={getSearchIndex()} className="w-full sm:max-w-[440px]" />
        </header>
        <div className="mt-5 lg:mt-10 lg:grid lg:grid-cols-[236px_minmax(0,1fr)] lg:gap-10 xl:gap-14">
          <DocsSidebar nav={getDocNav()} activeSlug={activeSlug} />
          <div className="mt-8 min-w-0 lg:mt-0">{children}</div>
        </div>
      </Container>
    </div>
  );
}

/** Center column + right-hand table of contents (≥1280px). */
export function DocsColumns({ children, toc }: { children: ReactNode; toc: ReactNode }) {
  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,760px)_216px] xl:justify-between xl:gap-14">
      <div className="min-w-0">{children}</div>
      <div className="hidden xl:block">{toc}</div>
    </div>
  );
}
