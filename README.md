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

## Deploy

Static output, no server config needed. Vercel picks up `dist/404.html` automatically, and the same file works by convention on GitHub Pages, Netlify, and nginx (`error_page 404 /404.html;`).

After each deploy, confirm the live og image is the 1200x630 banner and not an older icon:

```bash
curl -s https://glean-note.vercel.app/og-image.png | file -
```

That should print `PNG image data, 1200 x 630`. If a share preview ever shows stale title or image text, run the URL once through the Facebook sharing debugger; WhatsApp follows Facebook's cache and ignores updates until forced to re-scrape.

## Layout

- `src/components`: one component per page section, in page order
- `src/components/SkyCanvas.tsx`: the fixed starfield canvas behind the page
- `src/components/ConstellationPath.tsx`: the line that draws itself through the sections as you scroll
- `src/lib/platform.ts`: platform detection for the hero download button and the download section
- `src/styles`: self-hosted fonts and global styles

Platform marks (Windows, Apple, Tux) come from Bootstrap Icons and Simple Icons because Lucide dropped brand icons. The page ships no other icon set; stars and lines are drawn with canvas, CSS, and inline SVG.
