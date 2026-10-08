import Link from "next/link";
import type { ReactNode } from "react";

const TOKEN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

/**
 * Renders the small inline markup used in docs content:
 * `code`, **bold** and [label](href). Internal links use next/link.
 */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(TOKEN).filter(Boolean);
  return (
    <>
      {parts.map((part, i): ReactNode => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
          return <code key={i}>{part.slice(1, -1)}</code>;
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        const link = LINK.exec(part);
        if (link) {
          const [, label, href] = link;
          return href.startsWith("/") ? (
            <Link key={i} href={href}>
              {label}
            </Link>
          ) : (
            <a key={i} href={href}>
              {label}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}
