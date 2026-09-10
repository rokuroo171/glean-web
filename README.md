# glean-web

The landing page for [glean](https://github.com/rokuroo171/glean), a notes app where every note is a star in your sky. One page, no routing, built with Vite, React 18, and TypeScript.

The app itself lives in the [glean repo](https://github.com/rokuroo171/glean). This repo only holds the site.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output lands in `dist/`. Check a production build locally with `npm run preview`.

## Layout

- `src/components`: one component per page section, in page order
- `src/components/SkyCanvas.tsx`: the fixed starfield canvas behind the page
- `src/components/ConstellationPath.tsx`: the line that draws itself through the sections as you scroll
- `src/lib/platform.ts`: platform detection for the hero download button and the download section
- `src/styles`: self-hosted fonts and global styles

Platform marks (Windows, Apple, Tux) come from Bootstrap Icons and Simple Icons because Lucide dropped brand icons. The page ships no other icon set; stars and lines are drawn with canvas, CSS, and inline SVG.
