import { useMantineColorScheme } from "@mantine/core";
import type { CSSProperties } from "react";
import { useMemo } from "react";
import { useActiveTheme, useThemePrefs } from "./themeStore";
import { buildTokens } from "./themes";

// Single source of truth for all design tokens. All pages import useTheme() — never define local const C objects.
//
// NEON POP (Oct 2026): the personal tools are no longer the sober "heritage" teal/white look. Ink-dark base with electric
// violet, hot pink and amber; glass panels over a drifting aurora; a gradient hero; chunky expressive display type for the
// numbers. Token NAMES are unchanged (accent, bgSurface, border, success…) so every screen follows automatically; the new
// tokens (glass, hero gradients, glow, display font) are additive. Light mode = bright lavender "pop" version of the same.
export function useTheme() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const spec = useActiveTheme();
  const { comfort } = useThemePrefs();
  return useMemo(() => buildTokens(spec, dark, comfort), [spec, dark, comfort]);
}

export type ColorTokens = ReturnType<typeof useTheme>;

// A glass panel: frosted card with a luminous edge. Use for every card-like surface in the personal tools.
export const panelStyle = (C: ColorTokens, padding: number | string = 16): CSSProperties => ({
  background: C.glass, backdropFilter: "blur(16px) saturate(140%)", WebkitBackdropFilter: "blur(16px) saturate(140%)",
  border: `1px solid ${C.glassBorder}`, borderRadius: 22, padding, boxShadow: C.glow,
});

// ── Curated multi-hue identity (see ui-library.md → "Curated Multi-Hue Identity") ──
// Fixed 5-hue set for section/category identity only — one hue per category.
export type Hue = "accent" | "info" | "violet" | "success" | "warning";

export function hueColors(C: ColorTokens, hue: Hue): { fg: string; bg: string } {
  switch (hue) {
    case "info": return { fg: C.info, bg: C.infoBg };
    case "violet": return { fg: C.violet, bg: C.violetBg };
    case "success": return { fg: C.success, bg: C.successBg };
    case "warning": return { fg: C.warning, bg: C.warningBg };
    default: return { fg: C.accent, bg: C.accentSubtle };
  }
}
