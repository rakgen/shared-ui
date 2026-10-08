import { Box, Text } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "../themes/useTheme";
import { useActiveTheme, useThemePrefs } from "../themes/themeStore";
import { CONTRAST_FLOOR, forWhiteText, gradient, rgba, type HeroTone } from "../themes/themes";

// The big gradient card at the top of a screen — each screen gets its own colour mood so the tools feel distinct
// at a glance. White text on gradient is always readable (the gradients are all mid-to-dark in the text zone).
//   violet = Summary · cool = Cards · hot = Subscriptions · mint = Budgets   (the colours come from the active theme)
export type { HeroTone } from "../themes/themes";
export function Hero({ tone = "violet", children }: { tone?: HeroTone; children: ReactNode }) {
  const { comfort } = useThemePrefs();
  const stops = useActiveTheme().heroes[tone].map((c) => forWhiteText(c, CONTRAST_FLOOR[comfort.contrast].white));
  const t = { gradient: gradient(stops), shadow: `0 24px 64px ${rgba(stops[Math.floor(stops.length / 2)], 0.42)}` };
  return (
    <Box style={{ position: "relative", overflow: "hidden", borderRadius: 30, padding: 22, background: t.gradient, color: "#fff", boxShadow: t.shadow }}>
      <Box aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(120% 85% at 0% 0%, rgba(255,255,255,0.30), transparent 55%), radial-gradient(80% 60% at 100% 100%, rgba(0,0,0,0.18), transparent 60%)" }} />
      <Box style={{ position: "relative" }}>{children}</Box>
    </Box>
  );
}

export const HeroLabel = ({ children }: { children: ReactNode }) => (
  <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.80)", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>{children}</Text>
);

export function HeroValue({ children, size = 56, style }: { children: ReactNode; size?: number; style?: CSSProperties }) {
  const C = useTheme();
  return <Text component="div" style={{ fontFamily: C.display, fontSize: `clamp(${Math.round(size * 0.62)}px, ${(size / 5).toFixed(1)}vw, ${size}px)`, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.045em", color: "#fff", marginTop: 8, textShadow: "0 2px 24px rgba(0,0,0,0.18)", ...style }}>{children}</Text>;
}

export const HeroNote = ({ children, strong }: { children: ReactNode; strong?: boolean }) => (
  <Text style={{ fontSize: 14, color: strong ? "#fff" : "rgba(255,255,255,0.80)", marginTop: 6, fontWeight: strong ? 600 : 400 }}>{children}</Text>
);

export const HeroPill = ({ children, strong }: { children: ReactNode; strong?: boolean }) => (
  <Text style={{ fontSize: 14, fontWeight: 600, padding: "6px 14px", borderRadius: 100, background: strong ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.20)", color: "#fff", display: "inline-block" }}>{children}</Text>
);
