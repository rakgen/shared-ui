import { Card, Paper } from "@mantine/core";
import { fs } from "../tokens";

// Mantine component defaults shared by both apps (spread into createTheme's `components`). Cards take the theme's corner,
// border and surface (CSS variables set by ThemeSync), so a Paper or Card looks the same in akfgen-tools and prime-tools
// without per-page styling. A named radius (xs..xl, the usual `radius="md"`) becomes the card corner; an explicit number
// (radius={0} on a table, say) is a deliberate shape and is kept.
const NAMED = new Set([undefined, "xs", "sm", "md", "lg", "xl"]);
const corner = (r: unknown) => (NAMED.has(r as string | undefined) ? "var(--sui-card-radius)" : undefined);
export const frameComponents = {
  Paper: Paper.extend({
    vars: (_t, p) => ({ root: { "--paper-radius": corner(p.radius), "--paper-border-color": "var(--mantine-color-default-border)" } }),
    styles: { root: { backgroundColor: "var(--surface)" } },
  }),
  // Card renders a Paper, so it takes the corner and border above; only its surface is set here.
  Card: Card.extend({ styles: { root: { backgroundColor: "var(--surface)" } } }),
};

// Figures (money and counts). Three sizes only: `hero` is the one big number on a Hero card (HeroValue), `big` the main
// figure of a page or panel, `stat` a value in a stat card or row. Tabular digits so columns of numbers line up.
export const figure = {
  big: { fontSize: fs.display, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" },
  stat: { fontSize: fs.lg, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: "tabular-nums" },
} as const;
