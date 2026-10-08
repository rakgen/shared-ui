import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";
import { useActiveTheme, useThemePrefs } from "./themeStore";
import { buildTokens, rgba } from "./themes";

// Pushes the active theme into the CSS variables the global stylesheet reads (page background, aurora blobs, text colours),
// so the whole page — not just components — changes mood. Render once, inside the MantineProvider.
/** effects={false}: keep the theme's colours but drop aurora, glass and transparent surfaces — for apps where reading comes first (prime-tools). */
export function ThemeSync({ effects = true }: { effects?: boolean } = {}) {
  const spec = useActiveTheme();
  const { comfort } = useThemePrefs();
  const { colorScheme } = useMantineColorScheme();
  useEffect(() => {
    const dark = colorScheme === "dark", r = document.documentElement.style;
    const hostText = !spec.flat || comfort.contrast !== "standard"; // flat themes at Standard contrast leave the host's own text colours alone
    document.documentElement.dataset.flat = spec.flat || !effects ? "1" : "0";
    r.setProperty("--page-bg", dark ? spec.darkBg : spec.lightBg);
    const al = dark ? [0.34, 0.2, 0.1] : [0.32, 0.22, 0.14];
    r.setProperty("--aurora-a", rgba(spec.aurora[0], al[0]));
    r.setProperty("--aurora-b", rgba(spec.aurora[1], al[1]));
    r.setProperty("--aurora-c", rgba(spec.aurora[2], al[2]));
    if (hostText) r.setProperty("--mantine-color-text", dark ? "#F7F6FF" : spec.ink?.[0] ?? "#15122E"); else r.removeProperty("--mantine-color-text");
    const t = buildTokens(spec, dark, comfort);
    const h = document.documentElement;
    h.dataset.solid = comfort.solid ? "1" : "0"; h.dataset.bold = comfort.bold ? "1" : "0"; h.dataset.contrast = comfort.contrast;
    if (hostText) r.setProperty("--mantine-color-dimmed", t.textTertiary); else r.removeProperty("--mantine-color-dimmed");
    r.setProperty("--glass", t.glass); r.setProperty("--glass-border", t.glassBorder); r.setProperty("--glass-glow", t.glow); r.setProperty("--surface", t.bgSurface);
    // effects off: opaque page/surface colour from the theme (Mantine paints body and Paper with this var)
    if (!effects && !spec.flat) r.setProperty("--mantine-color-body", t.bgPage); else if (!effects) r.removeProperty("--mantine-color-body");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? spec.darkBg : spec.lightBg);
  }, [spec, colorScheme, comfort, effects]);
  return null;
}
