import Link from "next/link";
import { Logo } from "@/components/navigation/Logo";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { Container } from "@/components/ui/primitives";
import { footerNav, platforms, release, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-bg">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Professional CAD software for drafting, modeling and engineering documentation.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Supported platforms">
              {platforms.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/download?platform=${p.id}`}
                    className="inline-flex h-8 items-center gap-2 rounded-md border border-line px-2.5 text-xs text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <PlatformIcon id={p.id} size={13} />
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{group.title}</h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-muted transition-colors hover:text-fg">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date(`${release.date}T00:00:00Z`).getUTCFullYear()} {site.name}. All rights reserved.
            <span className="ml-3 font-mono">v{release.version}</span>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="transition-colors hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
