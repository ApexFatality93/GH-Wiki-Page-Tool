# GH Wiki Page Tool

Galactic Hub Wiki Page Creator.

## Environment

- Node.js `25.8.1`
- npm `11.11.0`

If you use `nvm`, run `nvm use` in the repo root.

## Overview

This project is a static-site tool for generating wiki markup for Galactic Hub pages.

Current supported page types include:

- Base
- Business
- Fauna
- Flora
- Mineral
- Moon
- Multi-Tool
- Planet
- Sandworm
- Starship
- System

The site is served as plain HTML/CSS/JS. Browser logic is authored in TypeScript and compiled into the runtime files used by the pages.

## Project Layout

- `src/ts/`: authored TypeScript source for browser logic
- `static/`: compiled browser JavaScript emitted by TypeScript
- `src/`: live non-JavaScript source assets used by the site, currently mostly CSS plus reference notes
- `assets/`: fonts, bitmaps, vectors, favicon files, and other static assets
- `archive/legacy-js-reference/`: archived pre-separation JavaScript snapshot for reference only

Important distinction:

- Edit browser logic in `src/ts/`
- Edit styles in `src/css/`
- Do not hand-edit compiled files in `static/`

## Workflow

1. Edit TypeScript in `src/ts/`
2. Run `npm run build` or `npm run dev`
3. The website loads compiled scripts from `static/`
4. Run `npm run verify` before pushing changes

For local development, run `npm run dev` and open `http://127.0.0.1:8000/`.

If you only changed HTML or CSS, a browser refresh is enough.
If you changed TypeScript in `src/ts/`, rebuild `static/` or use `npm run dev`.

## Scripts

- `npm run typecheck`: run TypeScript without emitting files
- `npm run build`: rebuild `static/` from `src/ts/`
- `npm run watch`: rebuild `static/` automatically while you edit TypeScript
- `npm run serve`: run a local static server on `127.0.0.1:8000`
- `npm run dev`: run the static server and TypeScript watch mode together
- `npm run rebuild`: clear compiled JavaScript and rebuild `static/`
- `npm run check:html`: verify that HTML script tags point at real local files
- `npm run verify`: typecheck, rebuild, and validate HTML script paths

## Notes

- The HTML pages load CSS from `src/css/` and runtime JavaScript from `static/`
- `archive/legacy-js-reference/` is kept only as migration/reference material
- The old light/dark mode toggle and deprecated album-output blocks have been removed from the current site
