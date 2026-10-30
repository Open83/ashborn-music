// Creates responsive AVIF/WebP encodings of the approved hero poster.
// The original PNG is never modified and the image is never cropped or resized beyond its own width.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "public/assets/marathon-hero.png";
const OUT = "public/assets/hero";
const WIDTHS = [640, 960, 1145];

await mkdir(OUT, { recursive: true });
const meta = await sharp(SRC).metadata();
console.log(`source ${meta.width}x${meta.height}`);

for (const w of WIDTHS) {
  const width = Math.min(w, meta.width);
  const base = sharp(SRC).resize({ width, withoutEnlargement: true });
  const avif = await base.clone().avif({ quality: 55, effort: 6 }).toFile(`${OUT}/marathon-${w}.avif`);
  const webp = await base.clone().webp({ quality: 78, effort: 6 }).toFile(`${OUT}/marathon-${w}.webp`);
  const jpg = await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}/marathon-${w}.jpg`);
  console.log(`${w}w  avif ${(avif.size / 1024).toFixed(0)} KB  webp ${(webp.size / 1024).toFixed(0)} KB  jpg ${(jpg.size / 1024).toFixed(0)} KB  -> ${avif.width}x${avif.height}`);
}
