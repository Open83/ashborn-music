import { platformIcons } from "@/lib/platform-icons";

export default function PlatformIcon({ id, size = 24 }) {
  const icon = platformIcons[id];
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={icon.hex} aria-hidden="true" focusable="false">
      <path d={icon.path} />
    </svg>
  );
}
