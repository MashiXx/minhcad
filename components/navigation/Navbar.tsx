"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Download, Menu } from "lucide-react";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { LinkButton } from "@/components/ui/Button";
import { mainNav, resourcesNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { duration, ease } from "@/lib/motion/tokens";

function isActive(pathname: string, href: string) {
  if (href.startsWith("/#")) return false;
  if (href === "/docs") return ["/docs", "/support", "/blog", "/about"].some((p) => pathname.startsWith(p));
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const resourcesRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close popovers on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
    setResourcesOpen(false);
  }

  useEffect(() => {
    if (!resourcesOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!resourcesRef.current?.contains(e.target as Node)) setResourcesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setResourcesOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [resourcesOpen]);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-md bg-accent px-3 py-2 text-sm font-medium text-white transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--nav-height)] border-b transition-[background-color,border-color,backdrop-filter] duration-300 ease-[var(--ease-out-expo)]",
          scrolled || menuOpen
            ? "border-line bg-bg/72 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Main"
          className="mx-auto grid h-full max-w-[1240px] grid-cols-[1fr_auto] items-center px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8"
        >
          <Logo className="justify-self-start" />

          <ul className="hidden items-center gap-1 lg:flex">
            {mainNav.map((item) =>
              item.label === "Resources" ? (
                <li
                  key={item.label}
                  ref={resourcesRef}
                  className="relative"
                  onMouseEnter={() => setResourcesOpen(true)}
                  onMouseLeave={() => setResourcesOpen(false)}
                >
                  <button
                    type="button"
                    aria-expanded={resourcesOpen}
                    aria-controls="resources-menu"
                    onClick={() => setResourcesOpen((v) => !v)}
                    className={cn(
                      "inline-flex h-9 items-center gap-1 rounded-md px-3 text-[13.5px] transition-colors",
                      isActive(pathname, item.href) || resourcesOpen ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    Resources
                    <ChevronDown
                      aria-hidden
                      className={cn("size-3.5 transition-transform duration-200", resourcesOpen && "rotate-180")}
                    />
                  </button>
                  <AnimatePresence>
                    {resourcesOpen ? (
                      <motion.div
                        id="resources-menu"
                        initial={{ opacity: 0, y: -4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.98 }}
                        transition={{ duration: duration.micro, ease: ease.out }}
                        className="absolute left-1/2 top-full w-[300px] -translate-x-1/2 pt-2"
                      >
                        <ul className="rounded-xl border border-line-strong bg-surface-1/95 p-1.5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.9)] backdrop-blur-xl">
                          {resourcesNav.map((r) => (
                            <li key={r.href}>
                              <Link
                                href={r.href}
                                className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/[0.05]"
                              >
                                <span className="text-[13.5px] font-medium text-fg">{r.label}</span>
                                <span className="text-xs text-muted">{r.description}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center rounded-md px-3 text-[13.5px] transition-colors",
                      isActive(pathname, item.href) ? "text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center justify-self-end gap-2">
            <LinkButton
              href="/download"
              size="sm"
              className="hidden sm:inline-flex"
              trailingIcon={<Download aria-hidden className="size-3.5" />}
            >
              Download
            </LinkButton>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-fg lg:hidden"
            >
              <Menu aria-hidden className="size-5" />
            </button>
          </div>
        </nav>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} />
    </>
  );
}
