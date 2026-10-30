// The approved hero poster, unchanged, in responsive AVIF/WebP/JPEG encodings.
const widths = [640, 960, 1145];
const set = (ext) => widths.map((w) => `/assets/hero/marathon-${w}.${ext} ${w}w`).join(", ");

export default function Picture({ alt = "", sizes, priority = false, className }) {
  return (
    <picture>
      <source type="image/avif" srcSet={set("avif")} sizes={sizes} />
      <source type="image/webp" srcSet={set("webp")} sizes={sizes} />
      <img
        className={className}
        src="/assets/hero/marathon-960.jpg"
        srcSet={set("jpg")}
        sizes={sizes}
        width={1145}
        height={1374}
        alt={alt}
        decoding="async"
        {...(priority ? { fetchPriority: "high" } : { loading: "lazy" })}
      />
    </picture>
  );
}
