# KufCad website

Marketing site for KufCad, built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Motion, GSAP ScrollTrigger, Lenis and React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Where things live

| What | File |
| --- | --- |
| Product name, nav, versions, download URLs, prices, comparison | `lib/site.ts` |
| Feature content (home + /features) | `lib/content/features.ts` |
| Docs, blog, legal content | `lib/content/docs.ts`, `blog.ts`, `legal.ts` |
| Image catalog (real screenshots + Canva visuals) | `lib/content/assets.ts`, `public/screenshots`, `public/images/canva` |
| Motion tokens and variants | `lib/motion/` |
| 3D robot (placeholder, view modes, scroll choreography) | `lib/three/`, `components/three/` |

## Environment

- `NEXT_PUBLIC_SITE_URL` — canonical origin (default `https://kufcad.com`).
- `NEXT_PUBLIC_DOWNLOAD_BASE_URL` — where installers are hosted (default `https://downloads.kufcad.com`).

## Replacing the procedural robot with the real model

1. Export a Draco-compressed GLB and save it as `public/models/robot.glb`.
2. Set `robotModelUrl = "/models/robot.glb"` in `lib/three/config.ts`.
3. Optionally map node names to exploded-view offsets in `explodeMap`.

The Solid / Wireframe / X-Ray / Exploded modes, hero scroll animation and fallback work unchanged with the GLB.

`design-reference/` holds the Canva exports used as creative direction; it is not served.
