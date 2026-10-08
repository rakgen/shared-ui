import { useMantineColorScheme } from "@mantine/core";
import { useState } from "react";
import { useTheme } from "../themes/useTheme";
import { useThemePrefs } from "../themes/themeStore";
import { CONTRAST_FLOOR, legible, mix, rgba } from "../themes/themes";

// One place for brand/merchant marks, so every page (here and, later, prime-tools) draws them the same way.
// Today: a coloured-initials tile whose letters are always readable — the hue is lifted (dark) or deepened (light) until it
// clears WCAG contrast on its own tint. Give it `src` (an SVG/PNG from a shared icon pack) and it shows the logo instead,
// falling back to the tile if the image is missing — no page changes needed when real logos arrive.
const HUES = ["#4361EE", "#F72585", "#06D6A0", "#FF9F1C", "#8F3FD8", "#00B4D8", "#E63946", "#2A9D8F", "#B08968", "#5C6BC0"];
const hueFor = (name: string) => HUES[[...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % HUES.length];
const initials = (name: string) => name.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "•";

export function BrandIcon({ name, src, size = 40 }: { name: string; src?: string | null; size?: number }) {
  const [broken, setBroken] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const C = useTheme();
  const { comfort } = useThemePrefs();
  const hue = hueFor(name);
  const surface = C.bgSurface.startsWith("#") ? C.bgSurface : dark ? "#15162B" : "#FFFFFF";
  const tint = mix(surface, hue, dark ? 0.22 : 0.12);                       // the tile's own fill, as an opaque colour
  const text = legible(hue, [tint], dark, CONTRAST_FLOOR[comfort.contrast][dark ? "dark" : "light"]);
  if (src && !broken) return <img src={src} alt="" width={size} height={size} onError={() => setBroken(true)} style={{ width: size, height: size, borderRadius: 10, objectFit: "contain", flex: "0 0 auto" }} />;
  return (
    <span aria-hidden style={{ width: size, height: size, flex: "0 0 auto", borderRadius: 12, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size >= 40 ? 14 : 12, fontWeight: 700, color: text, background: tint, border: `1px solid ${rgba(hue, 0.5)}` }}>
      {initials(name)}
    </span>
  );
}
