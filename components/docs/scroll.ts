import { getLenis } from "@/components/layout/SmoothScroll";

/** Distance kept between the fixed navbar and a scrolled-to heading. */
const ANCHOR_OFFSET = 96;

/**
 * Smoothly scrolls to an in-page anchor, accounting for the fixed navbar.
 * Uses Lenis when active, otherwise native scrolling (instant for reduced motion).
 * Returns false when the target does not exist on the current page.
 */
export function scrollToId(id: string, { updateHash = true }: { updateHash?: boolean } = {}) {
  const target = document.getElementById(id);
  if (!target) return false;

  // Lenis and scrollIntoView both honour CSS scroll-margin-top; only add an offset when none is set.
  const margin = Number.parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { offset: margin > 0 ? 0 : -ANCHOR_OFFSET });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = target.getBoundingClientRect().top + window.scrollY - (margin > 0 ? margin : ANCHOR_OFFSET);
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  }

  if (updateHash) window.history.replaceState(null, "", `#${id}`);
  // Move keyboard focus with the scroll so the next Tab continues from the section.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  return true;
}
