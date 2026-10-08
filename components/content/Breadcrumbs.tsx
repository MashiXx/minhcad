import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

/** Breadcrumb trail. The last item is the current page. */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-[13px]", className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-muted">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {item.href && !last ? (
                <Link href={item.href} className="-my-3 inline-block rounded-sm py-3 transition-colors hover:text-fg">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(last && "max-w-[24ch] truncate text-fg/80 sm:max-w-[48ch]")}
                >
                  {item.label}
                </span>
              )}
              {!last ? <ChevronRight aria-hidden className="size-3.5 text-subtle" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
