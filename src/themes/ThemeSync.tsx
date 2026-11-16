import { useMantineColorScheme, useMantineTheme } from "@mantine/core";
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
  const primary = useMantineTheme().primaryColor;
  useEffect(() => {
    const dark = colorScheme === "dark", r = document.documentElement.style;
    const hostText = !spec.flat || comfort.contrast !== "standard"; // flat themes at Standard contrast leave the host's own text colours alone
    document.documentElement.dataset.flat = spec.flat || !effects ? "1" : "0";
    document.documentElement.dataset.calm = spec.calm ? "1" : "0";
    r.setProperty("--page-bg", dark ? spec.darkBg : spec.lightBg);
    const al = dark ? [0.34, 0.2, 0.1] : [0.32, 0.22, 0.14];
    r.setProperty("--aurora-a", rgba(spec.aurora[0], al[0]));
    r.setProperty("--aurora-b", rgba(spec.aurora[1], al[1]));
    r.setProperty("--aurora-c", rgba(spec.aurora[2], al[2]));
    if (hostText) r.setProperty("--mantine-color-text", dark ? "#F7F6FF" : spec.ink?.[0] ?? "#15122E"); else r.removeProperty("--mantine-color-text");
    const t = buildTokens(spec, dark, comfort);
    const h = document.documentElement;
    h.dataset.solid = comfort.solid ? "1" : "0"; h.dataset.bold = comfort.bold ? "1" : "0"; h.dataset.contrast = comfort.contrast;
    // Mantine's own greys for dimmed text, placeholders and disabled fields fall below the Comfort floor (measured Nov 17 2026 on prime-tools, which
    // leaves host text colours alone: dimmed 2.9:1, placeholder 2.5:1, disabled 1.7:1 on a dark page; placeholder ~2:1 in light). They always come
    // from the theme's own tertiary text token, which the contrast gate checks, so this holds in flat/host-text mode too.
    for (const k of ["--mantine-color-dimmed", "--mantine-color-placeholder"]) r.setProperty(k, t.textTertiary);
    r.setProperty("--mantine-color-disabled-color", t.textSecondary); // a disabled field sits on a lighter fill than the page, so it needs the stronger grey
    r.setProperty("--accent-text", t.accent); // the accent as TEXT on the page (lifted pale in dark mode); fixed shades like --mantine-primary-color-5 are 3:1 on a dark page
    r.setProperty("--error-ink", t.onErrorFill);
    r.setProperty("--mantine-color-error", t.error); // required-field asterisks and error text: the dark-mode default red is 3.4:1
    r.setProperty("--glass", t.glass); r.setProperty("--glass-border", t.glassBorder); r.setProperty("--glass-glow", t.glow); r.setProperty("--surface", t.bgSurface);
    // effects off: opaque page/surface colour from the theme (Mantine paints body and Paper with this var)
    if (!effects && !spec.flat) r.setProperty("--mantine-color-body", t.bgPage); else if (!effects) r.removeProperty("--mantine-color-body");
    // Filled buttons/badges/etc: Mantine paints them with a fixed palette shade and white ink, which is pale-on-white in dark mode. Point the
    // primary and red "filled" colours at fills that clear the Comfort floor against --filled-ink (base.css applies the ink).
    const fills: [string, string][] = [
      [`--mantine-color-${primary}-filled`, t.fill], [`--mantine-color-${primary}-filled-hover`, t.fillHover],
      ["--mantine-primary-color-filled", t.fill], ["--mantine-primary-color-filled-hover", t.fillHover],
      ["--mantine-color-red-filled", t.errorFill], ["--mantine-color-red-filled-hover", t.errorFillHover],
      ["--filled-ink", t.onFill],
    ];
    // Light mode: Mantine's semantic text colours (green/blue/orange... as text, light badges, outline) are 1.7-4:1 on white (measured Nov 17 2026:
    // "+₹168" 1.75:1, "paid" badge 3.8:1). Take them from the theme's text-grade tokens, which the contrast gate checks. Dark mode already passes.
    // Fills of yellow/orange are left alone (apps put dark ink on them); the others get the deep token as fill too, which white ink suits.
    const semantic: [string, string, boolean][] = [["green", t.success, true], ["teal", t.accent, true], ["blue", t.info, true], ["cyan", t.info, true], ["grape", t.violet, true], ["violet", t.violet, true], ["yellow", t.warning, false], ["orange", t.warning, false]];
    if (!dark) for (const [c, v, fill] of semantic) {
      fills.push([`--mantine-color-${c}-light-color`, v], [`--mantine-color-${c}-outline`, v]);
      if (fill) fills.push([`--mantine-color-${c}-filled`, v]);
    }
    for (const [k, v] of fills) r.setProperty(k, v);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? spec.darkBg : spec.lightBg);
    return () => {
      for (const [k] of fills) r.removeProperty(k);
      for (const k of ["--mantine-color-dimmed", "--mantine-color-placeholder", "--mantine-color-disabled-color", "--mantine-color-error", "--accent-text", "--error-ink"]) r.removeProperty(k);
    };
  }, [spec, colorScheme, comfort, effects, primary]);
  return null;
}
