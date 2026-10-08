import type { ImageAsset } from "./assets";
import { slugify } from "@/lib/utils";

/**
 * Structured long-form content shared by the blog and legal pages.
 * Text fields accept a small inline syntax: **bold**, `code` and [label](href).
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string; id?: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; code: string; label?: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "note"; title?: string; text: string }
  | {
      type: "figure";
      image: ImageAsset;
      caption: string;
      /** Present a real application screenshot inside a desktop window frame. */
      window?: { title: string; meta?: string };
    };

export type HeadingBlock = Extract<Block, { type: "h2" | "h3" }>;

export type TocItem = { id: string; label: string; level: 2 | 3 };

export function headingId(block: HeadingBlock) {
  return block.id ?? slugify(block.text);
}

/** Collects h2/h3 headings for an "On this page" navigation. */
export function extractToc(blocks: Block[], levels: (2 | 3)[] = [2, 3]): TocItem[] {
  const items: TocItem[] = [];
  for (const block of blocks) {
    if (block.type === "h2" && levels.includes(2)) items.push({ id: headingId(block), label: block.text, level: 2 });
    if (block.type === "h3" && levels.includes(3)) items.push({ id: headingId(block), label: block.text, level: 3 });
  }
  return items;
}

/** Plain text of a block, with inline markup removed (used for word counts). */
export function blockText(block: Block): string {
  const strip = (value: string) => value.replace(/\*\*|`/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  switch (block.type) {
    case "ul":
    case "ol":
      return block.items.map(strip).join(" ");
    case "code":
      return block.code;
    case "figure":
      return block.caption;
    case "note":
      return `${block.title ?? ""} ${strip(block.text)}`;
    default:
      return strip(block.text);
  }
}

export function countWords(blocks: Block[]) {
  return blocks
    .map(blockText)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}
