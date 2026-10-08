import { Calendar, Clock } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

/** Date and reading time, rendered with semantic <time>. */
export function PostMeta({
  date,
  readingTime,
  className,
}: {
  date: string;
  readingTime: number;
  className?: string;
}) {
  return (
    <p className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted", className)}>
      <span className="inline-flex items-center gap-1.5">
        <Calendar aria-hidden className="size-3.5 text-subtle" strokeWidth={1.8} />
        <time dateTime={date}>{formatDate(date)}</time>
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock aria-hidden className="size-3.5 text-subtle" strokeWidth={1.8} />
        <span>{readingTime} min read</span>
      </span>
    </p>
  );
}

/** Small uppercase category label. */
export function CategoryLabel({ category, className }: { category: string; className?: string }) {
  return (
    <p className={cn("font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-accent-hover", className)}>
      {category}
    </p>
  );
}
