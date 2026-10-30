/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // static site: no server, free to host anywhere
  trailingSlash: false,
  poweredByHeader: false,
  images: { unoptimized: true }, // images are pre-optimised by scripts/optimize-images.mjs
};

if (!process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn(
    "\n[ashborn] NEXT_PUBLIC_SITE_URL is not set. The canonical URL, og:url and the absolute " +
      "Open Graph / Twitter image URLs are left out. Set it to the verified production origin " +
      "(for example https://your-domain) before launch.\n",
  );
}

export default nextConfig;
