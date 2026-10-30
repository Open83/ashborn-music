// Runs after `next build` (see the "build" script in package.json).
//
// WHY: this page is one static document with no client-side interactivity that needs React. Every link and all
// copy are plain HTML, and the only behaviour (scroll reveals, the "Listen" shortcut) lives in the ~3 KB vanilla
// script public/enhance.js. Next still ships its client runtime (~190 KB gzipped) to hydrate the page; in
// measurements that delayed first paint by roughly 0.8 s and cost ~550 ms of main-thread time on mobile.
// This step removes the runtime from the exported HTML so nothing is hydrated.
//
// RESTRICTION: do not add a React client component ('use client', hooks, event handlers in JSX) while this step
// is in the build. It would be exported without any JavaScript and silently do nothing. If you need one, delete
// this step and the call to it in the "build" script, then re-measure. See README.md.
//
// SAFE TO RERUN: every change is idempotent. A second run on an already-finished `out/` changes no file.
// DETERMINISTIC: no timestamps or random values are written; the random build-id folder is removed.
import { readdir, readFile, writeFile, rm, rmdir, stat } from "node:fs/promises";
import path from "node:path";

const OUT = "out";

// Only the display roman that sets MARATHON stays preloaded. Preloading every font made them compete with the hero
// image for bandwidth; the others load as soon as the stylesheet needs them (font-display: swap, size-matched
// fallbacks, so nothing shifts). Measured: Speed Index 4.3 s -> 2.9 s, LCP unchanged.
const KEEP_FONT_PRELOAD = /newsreader_opsz_400-s/;

// Inline scripts that belong to the framework (flight data, streaming helpers). Anything else inline is kept.
const FRAMEWORK_INLINE = /self\.__next_|__next_f|__NEXT_DATA__|\$R[CSV]\s*[(=]|\$RC\s*=|globalThis\["TURBOPACK"\]|self\.webpackChunk/;

const exists = (p) => stat(p).then(() => true, () => false);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

if (!(await exists(path.join(OUT, "index.html")))) {
  console.error("[static-finish] out/index.html not found. Run `next build` first (this step is part of `npm run build`).");
  process.exit(1);
}

const stats = { scripts: 0, inline: 0, scriptPreloads: 0, fontPreloads: 0, files: 0, dirs: 0, keptInline: [] };

// ---- 1. HTML ---------------------------------------------------------------------------------------------------
const htmlFiles = (await walk(OUT)).filter((f) => f.endsWith(".html"));
for (const file of htmlFiles) {
  const before = await readFile(file, "utf8");
  let html = before;

  // Next's runtime and chunk scripts (including the nomodule polyfill).
  html = html.replace(/<script\b[^>]*\bsrc="\/_next\/[^"]*"[^>]*>\s*<\/script>/g, () => (stats.scripts++, ""));
  // Hints that only exist to fetch those scripts.
  html = html.replace(/<link\b[^>]*\brel="preload"[^>]*\bas="script"[^>]*\/?>/g, () => (stats.scriptPreloads++, ""));
  // Inline framework payloads. Structured data and any other inline script are kept.
  html = html.replace(/<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g, (tag, attrs, body) => {
    if (/application\/ld\+json/.test(attrs)) return tag;
    if (FRAMEWORK_INLINE.test(body)) return (stats.inline++, "");
    stats.keptInline.push(`${path.relative(OUT, file)}: ${body.trim().slice(0, 60).replace(/\s+/g, " ")}`);
    return tag;
  });
  // Font preloads (see KEEP_FONT_PRELOAD).
  html = html.replace(/<link\b[^>]*\brel="preload"[^>]*\bas="font"[^>]*\/?>/g, (tag) => {
    if (KEEP_FONT_PRELOAD.test(tag)) return tag;
    stats.fontPreloads++;
    return "";
  });

  if (html !== before) await writeFile(file, html); // untouched files keep their mtime: reruns are no-ops
}

// ---- 2. Verify: a half-removed runtime would be worse than either extreme -----------------------------------------
const problems = [];
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (/<script\b[^>]*src="\/_next\//.test(html) || /self\.__next_|__next_f\.push|globalThis\["TURBOPACK"\]|self\.webpackChunk/.test(html)) {
    problems.push(`${path.relative(OUT, file)} still references the framework runtime`);
  }
}
const index = await readFile(path.join(OUT, "index.html"), "utf8");
for (const [ok, what] of [
  [/<main\b/.test(index), "a <main> element"],
  [/id="listen"/.test(index), "the #listen section"],
  [/<link\b[^>]*rel="stylesheet"/.test(index), "a stylesheet link"],
  [/<script\b[^>]*src="\/enhance\.js"/.test(index), "the /enhance.js script"],
  [/application\/ld\+json/.test(index), "the structured data"],
]) {
  if (!ok) problems.push(`index.html is missing ${what}`);
}
if (problems.length) {
  console.error(`[static-finish] Verification failed:\n  - ${problems.join("\n  - ")}`);
  process.exit(1);
}

// ---- 3. Files that only the removed runtime used -----------------------------------------------------------------
const staticDir = path.join(OUT, "_next", "static");
// Client chunks.
const chunkDir = path.join(staticDir, "chunks");
if (await exists(chunkDir)) {
  for (const f of await readdir(chunkDir)) {
    if (f.endsWith(".js")) (await rm(path.join(chunkDir, f)), stats.files++);
  }
}
// The random build-id folder holds only runtime manifests. It is the one non-deterministic path in the export.
if (await exists(staticDir)) {
  for (const entry of await readdir(staticDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "chunks" || entry.name === "media") continue;
    const dir = path.join(staticDir, entry.name);
    const names = await readdir(dir);
    if (names.every((n) => /^_[A-Za-z]+Manifest\.js$/.test(n))) {
      await rm(dir, { recursive: true });
      stats.files += names.length;
    } else {
      console.warn(`[static-finish] Left ${path.relative(OUT, dir)} alone: it holds files other than runtime manifests.`);
    }
  }
}
// Route payloads used only for client-side navigation. Matched by name so user-added .txt files are never touched.
const FLIGHT_TXT = /^(__next\..*|__PAGE__|index|_not-found)\.txt$/;
for (const file of await walk(OUT)) {
  if (FLIGHT_TXT.test(path.basename(file))) (await rm(file), stats.files++);
}
// Directories the removals emptied.
async function pruneEmpty(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) await pruneEmpty(path.join(dir, entry.name));
  }
  if (dir !== OUT && (await readdir(dir)).length === 0) (await rmdir(dir), stats.dirs++);
}
await pruneEmpty(OUT);

const size = (await stat(path.join(OUT, "index.html"))).size;
console.log(
  `[static-finish] removed ${stats.scripts + stats.inline} framework scripts, ${stats.scriptPreloads} script preloads and ` +
    `${stats.fontPreloads} font preloads; deleted ${stats.files} unused framework files and ${stats.dirs} empty folders; ` +
    `index.html is ${(size / 1024).toFixed(1)} KB`,
);
if (stats.keptInline.length) {
  console.log(`[static-finish] kept ${stats.keptInline.length} non-framework inline script(s): ${stats.keptInline.join(" | ")}`);
}
