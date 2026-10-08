import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { ScreenshotFrame } from "@/components/cad/ScreenshotFrame";
import { CornerMarks } from "@/components/ui/primitives";
import { headingId, type DocBlock } from "@/lib/content/docs";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";
import { InlineText } from "./InlineText";

type ProseBlock = Extract<DocBlock, { type: "p" | "h2" | "h3" | "list" }>;
type Segment = { kind: "prose"; blocks: ProseBlock[] } | { kind: "block"; block: Exclude<DocBlock, ProseBlock> };

function isProse(block: DocBlock): block is ProseBlock {
  return block.type === "p" || block.type === "h2" || block.type === "h3" || block.type === "list";
}

/** Consecutive text blocks share one `.prose-kuf` run; rich blocks render with their own styles. */
function segment(blocks: DocBlock[]): Segment[] {
  const segments: Segment[] = [];
  for (const block of blocks) {
    const last = segments[segments.length - 1];
    if (isProse(block)) {
      if (last?.kind === "prose") last.blocks.push(block);
      else segments.push({ kind: "prose", blocks: [block] });
    } else segments.push({ kind: "block", block });
  }
  return segments;
}

function ProseRun({ blocks }: { blocks: ProseBlock[] }) {
  return (
    <div className="prose-kuf break-words">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i}>
                <InlineText text={block.text} />
              </p>
            );
          case "h2": {
            const id = headingId(block);
            return (
              <h2 key={i} id={id} tabIndex={-1} className="flex items-center gap-3 focus:outline-none">
                {block.step ? (
                  <span
                    aria-hidden
                    className="inline-flex size-7 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-accent-soft font-mono text-xs font-medium text-accent-hover"
                  >
                    {block.step}
                  </span>
                ) : null}
                <span>
                  {block.step ? <span className="sr-only">Step {block.step}: </span> : null}
                  {block.text}
                </span>
              </h2>
            );
          }
          case "h3":
            return (
              <h3 key={i} id={headingId(block)} tabIndex={-1} className="focus:outline-none">
                {block.text}
              </h3>
            );
          case "list": {
            const items = block.items.map((item, j) => (
              <li key={j}>
                <InlineText text={item} />
              </li>
            ));
            return block.ordered ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
          }
        }
      })}
    </div>
  );
}

const calloutTone = {
  note: { icon: Info, className: "border-accent/25 bg-accent-soft/60", iconClass: "text-accent-hover", label: "Note" },
  success: { icon: CircleCheck, className: "border-emerald-500/25 bg-emerald-500/[0.07]", iconClass: "text-emerald-400", label: "Success" },
  warning: { icon: TriangleAlert, className: "border-orange-400/25 bg-orange-400/[0.07]", iconClass: "text-orange-300", label: "Warning" },
} as const;

function RichBlock({ block }: { block: Exclude<DocBlock, ProseBlock> }): ReactNode {
  switch (block.type) {
    case "code":
      return <CodeBlock code={block.code} language={block.language} title={block.title} />;

    case "table": {
      const mono = new Set(block.mono ?? []);
      return (
        <div
          role="region"
          aria-label={block.caption ?? `${block.columns.join(", ")} table`}
          tabIndex={0}
          className="overflow-x-auto rounded-[10px] border border-line bg-surface-1/60 focus-visible:outline-offset-2"
        >
          <table className="w-full border-collapse text-left text-sm" style={{ minWidth: block.columns.length * 132 }}>
            {block.caption ? (
              <caption className="caption-bottom border-t border-line px-4 py-2.5 text-left font-mono text-[11px] tracking-[0.04em] text-subtle">
                {block.caption}
              </caption>
            ) : null}
            <thead className="bg-surface-2/70">
              <tr>
                {block.columns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-4 py-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-t border-line">
                  {row.map((cell, c) => {
                    const cellClass = cn(
                      "px-4 py-3 align-top leading-relaxed",
                      c === 0 ? "font-medium text-fg" : "text-fg/75",
                      mono.has(c) && "font-mono text-[13px]",
                      mono.has(c) && c !== 0 && "text-accent-hover/90",
                    );
                    return c === 0 ? (
                      <th key={c} scope="row" className={cellClass}>
                        {cell}
                      </th>
                    ) : (
                      <td key={c} className={cellClass}>
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "callout": {
      const tone = calloutTone[block.tone];
      const Icon = tone.icon;
      return (
        <aside aria-label={tone.label} className={cn("flex gap-3.5 rounded-[10px] border px-4 py-3.5 sm:px-5 sm:py-4", tone.className)}>
          <Icon aria-hidden className={cn("mt-0.5 size-[18px] shrink-0", tone.iconClass)} strokeWidth={1.8} />
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-fg">{block.title}</p>
            <div className="prose-kuf mt-1 text-[15px]! leading-relaxed! text-fg/75!">
              <p>
                <InlineText text={block.text} />
              </p>
            </div>
          </div>
        </aside>
      );
    }

    case "figure": {
      const { image } = block;
      const isScreenshot = image.src.startsWith("/screenshots/");
      return (
        <figure>
          <ScreenshotFrame title={block.frameTitle} meta={block.frameMeta} bodyClassName={isScreenshot ? undefined : "cad-grid-fine"}>
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 760px, 100vw"
              className={cn("h-auto w-full", !isScreenshot && "mx-auto")}
              style={isScreenshot ? undefined : { maxWidth: image.width }}
            />
            {isScreenshot ? null : <CornerMarks className="m-3" />}
          </ScreenshotFrame>
          <figcaption className="mt-3 text-sm leading-relaxed text-muted">{block.caption}</figcaption>
        </figure>
      );
    }

    case "links":
      return (
        <ul className="grid gap-3 sm:grid-cols-3">
          {block.items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-[12px] border border-line bg-surface-1/80 p-4 transition-[transform,border-color,background-color] duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface-2/80"
              >
                <span className="text-[15px] font-medium leading-snug text-fg">{item.title}</span>
                <span className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.description}</span>
                <span className="mt-auto pt-3">
                  <ArrowRight
                    aria-hidden
                    className="size-4 text-accent-hover transition-transform duration-200 group-hover:translate-x-[3px]"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      );
  }
}

/** Renders a documentation page body from typed content blocks. */
export function DocContent({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div>
      {segment(blocks).map((s, i) => (
        <div key={i} className={cn(i > 0 && (s.kind === "block" ? "mt-7" : "mt-6"))}>
          {s.kind === "prose" ? <ProseRun blocks={s.blocks} /> : <RichBlock block={s.block} />}
        </div>
      ))}
    </div>
  );
}
