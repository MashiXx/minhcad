import Link from "next/link";
import { ArrowDownToLine, ArrowRight, ShieldCheck } from "lucide-react";
import { PlatformIcon } from "@/components/icons/PlatformIcons";
import { MotionReveal } from "@/components/motion/MotionReveal";
import { SectionHeader, TechnicalLabel } from "@/components/ui/primitives";
import { platforms, release, type PlatformId } from "@/lib/site";
import { formatDate } from "@/lib/utils";

const verifyCommand: Record<PlatformId, { shell: string; command: (file: string) => string }> = {
  windows: { shell: "PowerShell", command: (f) => `Get-FileHash .\\${f} -Algorithm SHA256` },
  macos: { shell: "Terminal", command: (f) => `shasum -a 256 ${f}` },
  ubuntu: { shell: "Terminal", command: (f) => `sha256sum ${f}` },
};

const fileLink =
  "group inline-flex min-h-11 items-center gap-2 font-mono text-[12.5px] break-all text-fg/90 transition-colors hover:text-accent-hover";

/** Every file in the current release, plus checksum verification. */
export function ReleaseManifest() {
  const rows = platforms.flatMap((p) => p.files.map((file) => ({ platform: p, file })));

  return (
    <section id="verify" aria-labelledby="manifest-title" className="scroll-mt-[var(--nav-height)] border-t border-line py-24 sm:py-28">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <MotionReveal>
            <SectionHeader
              id="manifest-title"
              eyebrow={`Release ${release.version}`}
              title="Every file in this release."
              description={`Published ${formatDate(release.date)} on the ${release.channel.toLowerCase()} channel. Choose a portable or alternative package here.`}
            />
          </MotionReveal>

          <MotionReveal delay={0.08} amount={0.1} className="mt-12">
            {/* Desktop / tablet: table */}
            <div className="hidden overflow-hidden rounded-[14px] border border-line md:block">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Downloadable files for {release.version}</caption>
                <thead className="bg-surface-1">
                  <tr className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">
                    <th scope="col" className="px-5 py-3 font-medium">Platform</th>
                    <th scope="col" className="px-5 py-3 font-medium">File</th>
                    <th scope="col" className="px-5 py-3 font-medium">Architecture</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rows.map(({ platform, file }) => (
                    <tr key={file.fileName} className="transition-colors hover:bg-white/[0.02]">
                      <th scope="row" className="px-5 py-2 font-normal text-muted">
                        <span className="inline-flex items-center gap-2">
                          <PlatformIcon id={platform.id} size={14} />
                          {platform.name}
                        </span>
                      </th>
                      <td className="px-5 py-2">
                        <a href={file.url} download={file.fileName} className={fileLink}>
                          {file.fileName}
                          <ArrowDownToLine
                            aria-hidden
                            className="size-3.5 shrink-0 text-subtle transition-[transform,color] duration-200 group-hover:translate-y-[2px] group-hover:text-accent-hover"
                          />
                        </a>
                      </td>
                      <td className="px-5 py-2 text-muted">{file.architecture}</td>
                      <td className="px-5 py-2 text-right font-mono text-[12px] tabular-nums text-muted">{file.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: stacked list */}
            <ul className="divide-y divide-line overflow-hidden rounded-[14px] border border-line md:hidden">
              {rows.map(({ platform, file }) => (
                <li key={file.fileName} className="px-4 py-3">
                  <p className="flex items-center gap-2 text-xs text-muted">
                    <PlatformIcon id={platform.id} size={13} />
                    {platform.name} · {file.architecture} · {file.size}
                  </p>
                  <a href={file.url} download={file.fileName} className={fileLink}>
                    {file.fileName}
                    <ArrowDownToLine aria-hidden className="size-3.5 shrink-0 text-subtle" />
                  </a>
                </li>
              ))}
            </ul>
          </MotionReveal>
        </div>

        <MotionReveal delay={0.12} amount={0.15} className="lg:pt-2">
          <div className="rounded-[14px] border border-line bg-surface-1/80 p-5 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-[9px] border border-line bg-surface-2">
                <ShieldCheck aria-hidden className="size-4 text-accent-hover" strokeWidth={1.8} />
              </span>
              <h3 className="text-base font-semibold tracking-[-0.01em] text-fg">Verify your download</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Each file is published with a SHA-256 checksum in the release notes. Compute the hash locally and compare
              it before installing. If the values differ, delete the file and download it again.
            </p>
            <ul className="mt-6 space-y-4">
              {platforms.map((p) => {
                const { shell, command } = verifyCommand[p.id];
                return (
                  <li key={p.id}>
                    <p className="flex items-center gap-2 text-xs text-muted">
                      <PlatformIcon id={p.id} size={13} />
                      {p.name} <span className="text-subtle">· {shell}</span>
                    </p>
                    <pre className="mt-2 overflow-x-auto rounded-[9px] border border-line bg-bg px-3.5 py-2.5 font-mono text-[12px] leading-relaxed text-fg/85">
                      <code>{command(p.files[0].fileName)}</code>
                    </pre>
                  </li>
                );
              })}
            </ul>
            <Link
              href={release.notesHref}
              className="group mt-5 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent-hover"
            >
              Checksums in the {release.version} release notes
              <ArrowRight aria-hidden className="size-3.5 transition-transform duration-200 group-hover:translate-x-[3px]" />
            </Link>
          </div>
          <TechnicalLabel className="mt-4 block leading-relaxed text-subtle">
            Windows installers are code-signed. The macOS disk image is signed and notarized.
          </TechnicalLabel>
        </MotionReveal>
      </div>
    </section>
  );
}
