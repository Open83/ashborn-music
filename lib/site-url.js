// Resolves the public origin used for the canonical URL, og:url and absolute social-image URLs.
//
// 1. NEXT_PUBLIC_SITE_URL, when set, always wins. Use it for a custom domain.
// 2. On Vercel, VERCEL_PROJECT_PRODUCTION_URL is the project's real production domain (the shortest custom
//    domain, otherwise the free *.vercel.app domain), provided at build time without the protocol. It is set
//    even in preview deployments, so previews point their canonical at production.
// 3. Otherwise null: nothing URL-dependent is emitted and no domain is invented.
//
// Imported by lib/site.js, next.config.mjs and scripts/check-build.mjs so all three agree.
export function resolveSiteUrl(env = process.env) {
  const explicit = (env.NEXT_PUBLIC_SITE_URL || "").trim();
  const vercel = (env.VERCEL_PROJECT_PRODUCTION_URL || "").trim();
  const raw = explicit || (vercel ? `https://${vercel}` : "");
  if (!raw) return null;

  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`Site URL "${raw}" is not a valid absolute URL. Use an origin such as https://example.com`);
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(`Site URL "${raw}" must start with https:// (or http:// for local testing).`);
  }
  return url.origin; // origin only: no path, query or trailing slash
}

export function siteUrlSource(env = process.env) {
  if ((env.NEXT_PUBLIC_SITE_URL || "").trim()) return "NEXT_PUBLIC_SITE_URL";
  if ((env.VERCEL_PROJECT_PRODUCTION_URL || "").trim()) return "VERCEL_PROJECT_PRODUCTION_URL";
  return null;
}
