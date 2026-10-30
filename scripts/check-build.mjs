// Validates the exported site in ./out. Run after `npm run build`:  npm run check:build
// If NEXT_PUBLIC_SITE_URL was set for the build, also pass it here so the absolute URLs are verified.
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

import { resolveSiteUrl, siteUrlSource } from "../lib/site-url.js";

const OUT = "out";
const SITE = resolveSiteUrl() || "";
const html = await readFile(path.join(OUT, "index.html"), "utf8");

let failed = 0;
const check = (ok, label, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? "  — " + detail : ""}`);
  if (!ok) failed++;
};
const meta = (attr, name) => (html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`)) || [])[1];
const link = (rel) => (html.match(new RegExp(`<link[^>]*rel="${rel}"[^>]*href="([^"]*)"`)) || [])[1];

// Build output
const srcs = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)].map((m) => m[1]);
check(srcs.every((s) => s === "/enhance.js"), "only /enhance.js is loaded as a script (no framework runtime)", srcs.join(", "));
check(!/localhost|127\.0\.0\.1/.test(html), "no localhost address leaked into the HTML");
check(/<title>ASHBORN — MARATHON \| Official Release<\/title>/.test(html), "page title");
check(!!meta("name", "description") && meta("name", "description").length > 40, "meta description", meta("name", "description"));
check(/<html[^>]*lang="en"/.test(html), "html lang");
check((html.match(/<h1\b/g) || []).length === 1, "exactly one h1");

// Streaming destinations, exactly as supplied
const supplied = [
  "https://open.spotify.com/album/3kehhL89TDz0Q4PdQqay7W",
  "https://music.apple.com/in/album/marathon-single/6827332319",
  "https://youtu.be/MlyVV1kXXsE",
];
const INSTAGRAM = "https://www.instagram.com/_sureshbhandari_"; // supplied by the owner, without the ?rpxt tracking parameter
const external = [...new Set([...html.matchAll(/<a\b[^>]*target="_blank"[^>]*href="([^"]+)"|<a\b[^>]*href="([^"]+)"[^>]*target="_blank"/g)].map((m) => m[1] || m[2]))];
const hrefs = external.filter((u) => !/^https:\/\/www\.instagram\.com\//.test(u));
check(hrefs.length === 3 && supplied.every((u) => hrefs.includes(u)), "exactly the three supplied streaming URLs", hrefs.join(" | "));
const social = external.filter((u) => /^https:\/\/www\.instagram\.com\//.test(u));
check(social.length === 1 && social[0] === INSTAGRAM, "exactly one Instagram link, as supplied and without tracking parameters", social.join(" | "));
check(!/rpxt=|utm_|igsh=|fbclid=/.test(html), "no tracking parameters in any link");
check(!/<a\b[^>]*target="_blank"(?![^>]*noopener)/.test(html), "external links carry rel=noopener");

// Social metadata
for (const [attr, name] of [["property", "og:title"], ["property", "og:description"], ["property", "og:type"], ["name", "twitter:card"], ["name", "twitter:title"], ["name", "twitter:description"]]) {
  check(!!meta(attr, name), `${name} present`);
}
check(meta("name", "twitter:card") === "summary_large_image", "twitter:card is summary_large_image");

if (!SITE) {
  console.log("\nNo site origin configured: checking that URL-dependent tags are absent rather than invented.");
  check(!link("canonical"), "no canonical URL");
  check(!meta("property", "og:url"), "no og:url");
  check(!meta("property", "og:image"), "no og:image");
  check(!meta("name", "twitter:image"), "no twitter:image");
} else {
  console.log(`\nSite origin ${SITE} (from ${siteUrlSource()}): checking absolute URLs.`);
  check(link("canonical") === SITE, "canonical equals the site origin", link("canonical"));
  check(meta("property", "og:url") === SITE, "og:url equals the site origin", meta("property", "og:url"));
  const img = meta("property", "og:image");
  check(!!img && img.startsWith(SITE + "/"), "og:image is absolute on the site origin", img);
  check(meta("name", "twitter:image") === img, "twitter:image matches og:image");
  check(meta("property", "og:image:width") === "1200" && meta("property", "og:image:height") === "630", "og:image dimensions declared as 1200 x 630");
  check(!!meta("property", "og:image:alt") && !!meta("name", "twitter:image:alt"), "image alt text declared");
  if (img) {
    const file = path.join(OUT, new URL(img).pathname);
    const ok = await stat(file).then(() => true, () => false);
    check(ok, "og:image file exists in the build", file);
    if (ok) {
      const req = createRequire(path.resolve("package.json"));
      const sharp = (await import(pathToFileURL(req.resolve("sharp")).href)).default;
      const m = await sharp(file).metadata();
      check(m.width === 1200 && m.height === 630, "og:image file is really 1200 x 630", `${m.width}x${m.height} ${m.format}`);
      const size = (await stat(file)).size;
      check(size < 600 * 1024, "og:image under 600 KB", `${Math.round(size / 1024)} KB`);
    }
  }
}

// Assets the page depends on
for (const f of ["enhance.js", "robots.txt", "icon.svg", "assets/hero/marathon-960.avif", "assets/hero/marathon-960.webp", "assets/hero/marathon-960.jpg", "assets/marathon-hero.png"]) {
  check(await stat(path.join(OUT, f)).then(() => true, () => false), `asset present: ${f}`);
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
