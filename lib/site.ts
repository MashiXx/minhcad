/**
 * Single source of truth for product, navigation, release and licensing data.
 * Update download URLs, version numbers and prices here.
 */

export const site = {
  name: "KufCad",
  tagline: "Professional CAD software for modern engineering.",
  description:
    "KufCad is a professional CAD application for 2D drafting, 3D modeling, assemblies and engineering drawings. Available for Windows, macOS and Ubuntu.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://kufcad.com",
  supportEmail: "support@kufcad.com",
  social: [
    { label: "GitHub", href: "https://github.com/kufcad" },
    { label: "YouTube", href: "https://www.youtube.com/@kufcad" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/kufcad" },
    { label: "X", href: "https://x.com/kufcad" },
  ],
} as const;

export type NavItem = { label: string; href: string; description?: string };

export const mainNav: NavItem[] = [
  { label: "Product", href: "/#product" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/docs" },
];

export const resourcesNav: NavItem[] = [
  { label: "Documentation", href: "/docs", description: "Guides and reference" },
  { label: "Support", href: "/support", description: "Help center and contact" },
  { label: "Blog", href: "/blog", description: "Product and engineering notes" },
  { label: "About", href: "/about", description: "The team behind KufCad" },
];

export const footerNav: { title: string; links: NavItem[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Download", href: "/download" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Support", href: "/support" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/support#contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

/* ------------------------------------------------------------------
   Releases
------------------------------------------------------------------- */

export type PlatformId = "windows" | "macos" | "ubuntu";

export type DownloadFile = {
  label: string;
  fileName: string;
  architecture: string;
  size: string;
  url: string;
};

export type Platform = {
  id: PlatformId;
  name: string;
  shortRequirements: string;
  files: DownloadFile[];
  requirements: { label: string; value: string }[];
};

export const release = {
  version: "1.0.0",
  date: "2026-01-15",
  channel: "Stable",
  notesHref: "/blog/kufcad-1-0-released",
} as const;

const downloadBase =
  process.env.NEXT_PUBLIC_DOWNLOAD_BASE_URL ?? "https://downloads.kufcad.com";

export const platforms: Platform[] = [
  {
    id: "windows",
    name: "Windows",
    shortRequirements: "Windows 10/11 · x64, ARM64",
    files: [
      {
        label: "Installer (x64)",
        fileName: `kufcad-${release.version}-windows-x64.exe`,
        architecture: "x64",
        size: "245 MB",
        url: `${downloadBase}/${release.version}/kufcad-${release.version}-windows-x64.exe`,
      },
      {
        label: "Installer (ARM64)",
        fileName: `kufcad-${release.version}-windows-arm64.exe`,
        architecture: "ARM64",
        size: "238 MB",
        url: `${downloadBase}/${release.version}/kufcad-${release.version}-windows-arm64.exe`,
      },
      {
        label: "Portable (x64)",
        fileName: `kufcad-${release.version}-windows-portable.zip`,
        architecture: "x64",
        size: "312 MB",
        url: `${downloadBase}/${release.version}/kufcad-${release.version}-windows-portable.zip`,
      },
    ],
    requirements: [
      { label: "Operating system", value: "Windows 10 (22H2) or Windows 11, 64-bit" },
      { label: "Processor", value: "x64 or ARM64, 4 cores recommended" },
      { label: "Memory", value: "8 GB RAM (16 GB recommended)" },
      { label: "Graphics", value: "DirectX 12 compatible GPU, 2 GB VRAM" },
      { label: "Storage", value: "2 GB free disk space" },
    ],
  },
  {
    id: "macos",
    name: "macOS",
    shortRequirements: "macOS 13+ · Apple Silicon, Intel",
    files: [
      {
        label: "Universal disk image",
        fileName: `kufcad-${release.version}-macos-universal.dmg`,
        architecture: "Apple Silicon · Intel",
        size: "268 MB",
        url: `${downloadBase}/${release.version}/kufcad-${release.version}-macos-universal.dmg`,
      },
    ],
    requirements: [
      { label: "Operating system", value: "macOS 13 Ventura or later" },
      { label: "Processor", value: "Apple Silicon (M1 or later) or Intel Core i5" },
      { label: "Memory", value: "8 GB unified memory (16 GB recommended)" },
      { label: "Graphics", value: "Metal 3 capable GPU" },
      { label: "Storage", value: "2 GB free disk space" },
    ],
  },
  {
    id: "ubuntu",
    name: "Ubuntu",
    shortRequirements: "Ubuntu 22.04 / 24.04 · x64",
    files: [
      {
        label: "Debian package",
        fileName: `kufcad_${release.version}_amd64.deb`,
        architecture: "x64",
        size: "231 MB",
        url: `${downloadBase}/${release.version}/kufcad_${release.version}_amd64.deb`,
      },
      {
        label: "AppImage",
        fileName: `KufCad-${release.version}-x86_64.AppImage`,
        architecture: "x64",
        size: "254 MB",
        url: `${downloadBase}/${release.version}/KufCad-${release.version}-x86_64.AppImage`,
      },
    ],
    requirements: [
      { label: "Operating system", value: "Ubuntu 22.04 LTS or 24.04 LTS, 64-bit" },
      { label: "Processor", value: "x64, 4 cores recommended" },
      { label: "Memory", value: "8 GB RAM (16 GB recommended)" },
      { label: "Graphics", value: "OpenGL 4.5 / Vulkan 1.2 capable GPU" },
      { label: "Storage", value: "2 GB free disk space" },
    ],
  },
];

export function getPlatform(id: PlatformId) {
  const platform = platforms.find((p) => p.id === id);
  if (!platform) throw new Error(`Unknown platform: ${id}`);
  return platform;
}

/* ------------------------------------------------------------------
   Licensing
------------------------------------------------------------------- */

export type Plan = {
  id: "personal" | "professional";
  name: string;
  audience: string;
  price: string;
  priceNote: string;
  cta: { label: string; href: string };
  highlights: string[];
  featured?: boolean;
};

export const plans: Plan[] = [
  {
    id: "personal",
    name: "Personal",
    audience: "For students, hobbyists and personal projects.",
    price: "Free",
    priceNote: "Non-commercial license",
    cta: { label: "Download for free", href: "/download" },
    highlights: [
      "2D drafting and annotation",
      "3D modeling",
      "Assemblies and rendering",
      "DWG, DXF, STEP, IGES, STL import/export",
      "Community support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    audience: "For engineers, studios and commercial teams.",
    price: "$99",
    priceNote: "per seat · annual license",
    cta: { label: "Buy license", href: "/support#contact" },
    featured: true,
    highlights: [
      "Everything in Personal",
      "Commercial use",
      "Scripting and automation API",
      "Advanced rendering",
      "Priority technical support",
      "All updates during the license term",
    ],
  },
];

export type ComparisonRow = {
  group: string;
  feature: string;
  personal: boolean | string;
  professional: boolean | string;
};

export const comparison: ComparisonRow[] = [
  { group: "Design", feature: "2D drafting", personal: true, professional: true },
  { group: "Design", feature: "3D modeling", personal: true, professional: true },
  { group: "Design", feature: "Assemblies", personal: true, professional: true },
  { group: "Design", feature: "Rendering", personal: "Standard", professional: "Advanced" },
  { group: "Data", feature: "Import/export (DWG, DXF, STEP, IGES, STL)", personal: true, professional: true },
  { group: "Data", feature: "Batch conversion", personal: false, professional: true },
  { group: "Automation", feature: "Scripting & automation API", personal: false, professional: true },
  { group: "Automation", feature: "Custom plugins", personal: false, professional: true },
  { group: "License", feature: "Commercial use", personal: false, professional: true },
  { group: "License", feature: "Seat transfer", personal: false, professional: true },
  { group: "Support", feature: "Community forum", personal: true, professional: true },
  { group: "Support", feature: "Priority support", personal: false, professional: true },
  { group: "Support", feature: "Regular updates", personal: true, professional: true },
];
