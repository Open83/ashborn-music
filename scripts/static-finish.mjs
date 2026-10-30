// Runs after `next build` (see the "build" script in package.json).
//
// This page is a single static document with no client-side interactivity that needs React: every link and
// all copy are plain HTML, and the only behaviour (scroll reveals, the "Listen" shortcut) lives in the
// ~2 KB vanilla script /enhance.js. Next still ships its client runtime (~190 KB gzipped) to hydrate the
// page, which delayed first paint by roughly 0.8 s in measurements (see the performance notes in the
// project report). This step removes that runtime from the exported HTML so nothing is hydrated.
//
// If a future change adds a React client component, remove this step (and the "build" script's call to it).
import { readdir, readFile, writeFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const OUT = "out";

const files = (await readdir(OUT)).filter((f) => f.endsWith(".html"));
let removedScripts = 0;
let removedPreloads = 0;
let removedFontPreloads = 0;

for (const file of files) {
  const p = path.join(OUT, file);
  let html = await readFile(p, "utf8");

  // Next's runtime and chunk scripts (including the nomodule polyfill).
  html = html.replace(/<script\b[^>]*\bsrc="\/_next\/[^"]*"[^>]*>\s*<\/script>/g, () => (removedScripts++, ""));
  // Hints that only exist to fetch those scripts.
  html = html.replace(/<link\b[^>]*\brel="preload"[^>]*\bas="script"[^>]*\/?>/g, () => (removedPreloads++, ""));
  // Inline framework payloads (flight data, streaming helpers). Structured data and our own scripts stay.
  html = html.replace(/<script\b(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, () => (removedScripts++, ""));
  // Font preloads: keep only the display roman that sets MARATHON. Preloading every font made them compete
  // with the hero image for bandwidth; the others load as soon as the stylesheet needs them (font-display: swap,
  // with size-matched fallbacks, so nothing shifts). Measured: Speed Index 4.3 s -> 2.9 s, LCP unchanged.
  html = html.replace(/<link\b[^>]*\brel="preload"[^>]*\bas="font"[^>]*\/?>/g, (tag) => {
    if (/newsreader_opsz_400-s/.test(tag)) return tag;
    removedFontPreloads++;
    return "";
  });

  await writeFile(p, html);
}

// Anything left that still points into the framework would be a half-removed runtime: fail the build.
const leftovers = [];
for (const file of files) {
  const html = await readFile(path.join(OUT, file), "utf8");
  if (/<script\b[^>]*src="\/_next\//.test(html) || /self\.__next_f|__next_f\.push/.test(html)) leftovers.push(file);
}
if (leftovers.length) {
  console.error(`[static-finish] Framework scripts remain in: ${leftovers.join(", ")}`);
  process.exit(1);
}

// Unreferenced framework files (client chunks and route payloads).
const chunkDir = path.join(OUT, "_next", "static", "chunks");
let deleted = 0;
try {
  for (const f of await readdir(chunkDir)) {
    if (f.endsWith(".js")) {
      await rm(path.join(chunkDir, f));
      deleted++;
    }
  }
} catch {}
for (const f of await readdir(OUT)) {
  if (f.endsWith(".txt") && f !== "robots.txt") {
    await rm(path.join(OUT, f));
    deleted++;
  }
}

const idx = await stat(path.join(OUT, "index.html"));
console.log(
  `[static-finish] removed ${removedScripts} framework scripts, ${removedPreloads} script preloads and ${removedFontPreloads} font preloads; deleted ${deleted} unused framework files; index.html is ${(idx.size / 1024).toFixed(1)} KB`,
);
