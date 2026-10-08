import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { ScreenshotFrame } from "@/components/cad/ScreenshotFrame";
import { FigureStage } from "@/components/content/FigureStage";
import { headingId, type Block } from "@/lib/content/blocks";
import { cn } from "@/lib/utils";

const INLINE_PATTERN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

function InlineLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
  if (href.startsWith("mailto:")) return <a href={href}>{children}</a>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

/** Renders the inline subset used in content: **bold**, `code` and [label](href). */
export function Inline({ text }: { text: string }) {
  const parts = text.split(INLINE_PATTERN);
  return (
    <>
      {parts.map((part, index) => {
        if (!part) return null;
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
        if (link) {
          return (
            <InlineLink key={index} href={link[2]}>
              {link[1]}
            </InlineLink>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

function BlockView({ block, figureIndex }: { block: Block; figureIndex: number }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <Inline text={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2 id={headingId(block)} tabIndex={-1} className="outline-none">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 id={headingId(block)} tabIndex={-1} className="outline-none">
          {block.text}
        </h3>
      );
    case "ul":
    case "ol": {
      const List = block.type;
      return (
        <List>
          {block.items.map((item) => (
            <li key={item}>
              <Inline text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "code":
      return (
        <div className="overflow-hidden rounded-[10px] border border-line bg-surface-1">
          {block.label ? (
            <div className="flex h-9 items-center border-b border-line bg-surface-2/70 px-4 font-mono text-[11px] tracking-[0.04em] text-subtle">
              {block.label}
            </div>
          ) : null}
          <pre className="rounded-none! border-0!">
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case "quote":
      return (
        <blockquote className="my-10! py-1 text-[1.1875rem] leading-relaxed not-italic! text-fg">
          <p>“{block.text}”</p>
          {block.cite ? <footer className="mt-2 text-sm text-muted not-italic">— {block.cite}</footer> : null}
        </blockquote>
      );
    case "note":
      return (
        <aside className="rounded-[12px] border border-accent/25 bg-accent-soft/60 px-5 py-4 text-[0.97rem] leading-relaxed">
          {block.title ? (
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-accent-hover">{block.title}</p>
          ) : null}
          <p className={cn("text-fg/85", block.title && "mt-1.5")}>
            <Inline text={block.text} />
          </p>
        </aside>
      );
    case "figure": {
      const label = `Fig. ${String(figureIndex).padStart(2, "0")}`;
      return (
        <figure className="my-10!">
          {block.window ? (
            <ScreenshotFrame title={block.window.title} meta={block.window.meta}>
              <Image
                src={block.image.src}
                alt={block.image.alt}
                width={block.image.width}
                height={block.image.height}
                sizes="(min-width: 1024px) 760px, 100vw"
                className="h-auto w-full"
              />
            </ScreenshotFrame>
          ) : (
            <FigureStage image={block.image} label={label} />
          )}
          <figcaption className="mt-3 flex gap-3 text-sm leading-relaxed text-muted">
            <span className="shrink-0 pt-px font-mono text-[11px] uppercase tracking-[0.1em] text-subtle">{label}</span>
            <span>{block.caption}</span>
          </figcaption>
        </figure>
      );
    }
  }
}

/** Renders structured content blocks inside `.prose-kuf`. */
export function RichText({ blocks, className }: { blocks: Block[]; className?: string }) {
  const figureNumbers = blocks.map(
    (_, index) => blocks.slice(0, index + 1).filter((block) => block.type === "figure").length,
  );
  return (
    <div className={cn("prose-kuf", className)}>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} figureIndex={figureNumbers[index]} />
      ))}
    </div>
  );
}
