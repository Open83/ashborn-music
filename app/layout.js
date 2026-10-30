import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/lib/site";
import { platforms } from "@/lib/site";
import "./globals.css";

// Newsreader (SIL Open Font License), latin subset, self-hosted. Only the cuts the design uses:
// the optical-size axis at weight 400 (roman and italic) for display type, and weight 600 for the wordmark.
const display = localFont({
  src: [
    { path: "./fonts/newsreader-opsz-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/newsreader-opsz-400-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--font-display",
});

const wordmark = localFont({
  src: [{ path: "./fonts/newsreader-600.woff2", weight: "600", style: "normal" }],
  display: "swap",
  variable: "--font-wordmark",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const ogImage = "/assets/og/marathon-og-1200x630.jpg";
const ogAlt =
  "ASHBORN — MARATHON, debut single. A young man runs along a broken road beneath a shattered clock at sunset.";

export const metadata = {
  ...(site.url ? { metadataBase: new URL(site.url) } : {}),
  title: site.title,
  description: site.description,
  applicationName: "ASHBORN — MARATHON",
  authors: [{ name: site.artist }],
  creator: site.artist,
  robots: { index: true, follow: true },
  ...(site.url ? { alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website",
    siteName: "ASHBORN",
    title: site.title,
    description: site.description,
    ...(site.url ? { url: "/", images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    ...(site.url ? { images: [{ url: ogImage, alt: ogAlt }] } : {}),
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#10100F",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicRecording",
  name: site.track,
  byArtist: { "@type": "MusicGroup", name: site.artist },
  sameAs: platforms.map((p) => p.url),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${wordmark.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        <script src="/enhance.js" defer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
