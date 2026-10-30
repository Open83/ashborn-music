import { resolveSiteUrl, siteUrlSource } from "./lib/site-url.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static site: no server, free to host anywhere
  trailingSlash: false,
  poweredByHeader: false,
  images: { unoptimized: true }, // images are pre-optimised by scripts/optimize-images.mjs
};

const siteUrl = resolveSiteUrl();
if (siteUrl) {
  console.log(`[ashborn] Site origin: ${siteUrl} (from ${siteUrlSource()})`);
} else {
  console.warn(
    "\n[ashborn] No site origin is configured. The canonical URL, og:url and the absolute Open Graph / Twitter " +
      "image URLs are left out. Set NEXT_PUBLIC_SITE_URL to the verified production origin (on Vercel, " +
      "VERCEL_PROJECT_PRODUCTION_URL is used automatically) before launch.\n",
  );
}

export default nextConfig;
