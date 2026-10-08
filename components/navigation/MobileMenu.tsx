"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { Logo } from "./Logo";
import { LinkButton } from "@/components/ui/Button";
import { WindowsIcon } from "@/components/icons/PlatformIcons";
import { mainNav, resourcesNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { duration, ease, spring } from "@/lib/motion/tokens";
import { getLenis } from "@/components/layout/SmoothScroll";

type Props = { open: boolean; onClose: () => void; pathname: string };

const links = [...mainNav.filter((n) => n.label !== "Resources"), ...resourcesNav, { label: "Download", href: "/download" }];

export function MobileMenu({ open, onClose, pathname }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    const previous = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusables = panelRef.current.querySelectorAll<HTMLElement>("a,button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      lenis?.start();
      previous?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu" id="mobile-menu">
          <motion.button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.normal }}
          />
          <motion.div
            ref={panelRef}
            className="absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col border-l border-line bg-surface-1"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 48, filter: "blur(8px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: 48, filter: "blur(8px)" }}
            transition={reduce ? { duration: duration.micro } : spring.surface}
          >
            <div className="flex h-[var(--nav-height)] items-center justify-between border-b border-line px-4 sm:px-6">
              <Logo />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-fg"
              >
                <X aria-hidden className="size-5" />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-2 py-4 sm:px-4">
              <ul>
                {links.map((item, i) => {
                  const active = pathname === item.href;
                  return (
                    <motion.li
                      key={item.href}
                      initial={reduce ? false : { opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: duration.normal, ease: ease.out, delay: 0.06 + i * 0.03 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center justify-between rounded-lg px-3 text-[17px] tracking-[-0.01em] transition-colors",
                          active ? "bg-white/[0.04] text-fg" : "text-fg/80 hover:bg-white/[0.03] hover:text-fg",
                        )}
                      >
                        {item.label}
                        <ArrowRight aria-hidden className="size-4 text-subtle" />
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-line p-4 sm:p-6">
              <LinkButton
                href="/download"
                onClick={onClose}
                size="lg"
                className="w-full"
                icon={<WindowsIcon size={16} />}
              >
                Download for Windows
              </LinkButton>
              <p className="mt-3 text-center text-xs text-muted">Also available for macOS and Ubuntu</p>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
