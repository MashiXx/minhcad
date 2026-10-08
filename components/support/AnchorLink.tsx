"use client";

import type { ComponentPropsWithoutRef } from "react";
import { scrollToId } from "@/components/docs/scroll";

type AnchorLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: `#${string}` };

/** Same-page anchor that scrolls smoothly below the fixed navbar and moves focus to the target. */
export function AnchorLink({ href, onClick, ...rest }: AnchorLinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (scrollToId(href.slice(1))) {
          e.preventDefault();
          // Keep Lenis' global anchor handler from scrolling a second time.
          e.stopPropagation();
        }
      }}
      {...rest}
    />
  );
}
