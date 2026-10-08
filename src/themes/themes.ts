// THEMES — "mood" palettes for the personal tools. A theme is a compact spec (three vivid colours + two background bases +
// four hero gradients); buildTokens() expands it into the full token set for light or dark, so adding a theme is ~10 lines and
// every screen follows. Semantic colours (success/warning/error/info) are shared across themes so money keeps its meaning.
export type HeroTone = "violet" | "cool" | "hot" | "mint";
export type ThemeSpec = {
  id: string; name: string; emoji: string; blurb: string;
  primary: string; secondary: string; tertiary: string;          // the three vivid colours of the mood
  darkBg: string; lightBg: string;                                // page background bases
  lightAccent?: string;                                           // accent used as text on light surfaces (needs contrast); default = primary darkened
  lightSurface?: string; ink?: [string, string, string];          // warm/cool tint for light surfaces and the 3 light text tones (default white / indigo-ink)
  heroes: Record<HeroTone, string[]>;                             // gradient stops per hero tone (dark enough for white text)
  aurora: [string, string, string];                               // blob colours (hex) behind the page
  flat?: boolean;                                                 // true = no aurora/glass/press effects and the host app's own page background and text colours are left alone
};

export const THEMES: ThemeSpec[] = [
  { id: "neon-pop", name: "Neon Pop", emoji: "🪩", blurb: "Electric violet · hot pink · amber",
    primary: "#7C5CFF", secondary: "#FF4D8D", tertiary: "#FFB020", darkBg: "#090912", lightBg: "#F6F3FF", lightAccent: "#6C4DFF",
    heroes: { violet: ["#6C4DFF", "#B23CFF", "#FF4D8D", "#FF9A3D"], cool: ["#00A8E8", "#4F5BFF", "#9B3DFF"], hot: ["#FF3D8B", "#FF6B4A", "#FFB02E"], mint: ["#00BFA5", "#00A3D9", "#5B6CFF"] },
    aurora: ["#7C5CFF", "#FF4D8D", "#3DF2B0"] },
  { id: "sunset", name: "Sunset Boulevard", emoji: "🌇", blurb: "Coral · magenta · gold hour",
    primary: "#FF6B4A", secondary: "#FF3D8B", tertiary: "#FFC24A", darkBg: "#140A0E", lightBg: "#FFF4EE", lightAccent: "#E0482A",
    heroes: { violet: ["#E8452C", "#E02F7B", "#8E2DE2"], cool: ["#FF7A3D", "#FF4D6D", "#C13BFF"], hot: ["#F2542D", "#E8338A", "#FF9F1C"], mint: ["#F2784B", "#E8486A", "#B13CC8"] },
    aurora: ["#FF6B4A", "#FF3D8B", "#FFC24A"] },
  { id: "lagoon", name: "Lagoon", emoji: "🌊", blurb: "Teal · electric blue · sea-glass",
    primary: "#00C2C7", secondary: "#3D8BFF", tertiary: "#5CF2B3", darkBg: "#05131A", lightBg: "#EAFBFD", lightAccent: "#008A92",
    heroes: { violet: ["#0077B6", "#0096C7", "#00B4A6"], cool: ["#005F99", "#2563EB", "#7C3AED"], hot: ["#0A9396", "#1B7FD6", "#5E60CE"], mint: ["#008F7A", "#0096C7", "#3A86FF"] },
    aurora: ["#00C2C7", "#3D8BFF", "#5CF2B3"] },
  { id: "midnight-gold", name: "Midnight Gold", emoji: "🥂", blurb: "Black tie · gold · wine",
    primary: "#F5C451", secondary: "#FF9F43", tertiary: "#FFE29A", darkBg: "#0A0907", lightBg: "#FBF6E9", lightAccent: "#8A5A00",
    heroes: { violet: ["#A66A12", "#C97A1B", "#8E2F52", "#4A2377"], cool: ["#7A5C14", "#B8791E", "#8E3B3B"], hot: ["#B5541C", "#D1771F", "#9B2F4F"], mint: ["#8A6A12", "#6E7C1B", "#2F7A5A"] },
    aurora: ["#F5C451", "#FF9F43", "#8E2F52"] },
  { id: "matcha", name: "Matcha", emoji: "🍵", blurb: "Calm greens · sage · lime zest",
    primary: "#6BCB77", secondary: "#2BB39A", tertiary: "#D4E157", darkBg: "#07110A", lightBg: "#F0F8EC", lightAccent: "#2E8B45",
    heroes: { violet: ["#1E8449", "#17A589", "#2E86C1"], cool: ["#117A65", "#1F8FA3", "#2874A6"], hot: ["#2E8B3A", "#7CA82B", "#C49A1A"], mint: ["#168F66", "#1AA088", "#238FBF"] },
    aurora: ["#6BCB77", "#2BB39A", "#D4E157"] },
  { id: "bubblegum", name: "Bubblegum", emoji: "🍬", blurb: "Candy pink · baby blue · butter",
    primary: "#FF5CA8", secondary: "#7C9CFF", tertiary: "#FFD166", darkBg: "#130B16", lightBg: "#FFF2F8", lightAccent: "#D6247F",
    heroes: { violet: ["#E83E8C", "#A855F7", "#5B7CFA"], cool: ["#4C7DF0", "#8B5CF6", "#E83E8C"], hot: ["#F0457F", "#F37A5A", "#F2B13E"], mint: ["#18A5A7", "#4C7DF0", "#A855F7"] },
    aurora: ["#FF5CA8", "#7C9CFF", "#FFD166"] },
  { id: "mono-ink", name: "Mono Ink", emoji: "🖤", blurb: "Graphite · one acid-lime spark",
    primary: "#C6F135", secondary: "#9AA0A6", tertiary: "#E8FF8A", darkBg: "#0A0A0A", lightBg: "#F3F3F1", lightAccent: "#4F6B00",
    heroes: { violet: ["#16181A", "#2A2F33", "#3F5200"], cool: ["#0F1214", "#252B30", "#37424A"], hot: ["#1A1A1A", "#3B3B3B", "#5C6B00"], mint: ["#111517", "#26343A", "#46650A"] },
    aurora: ["#C6F135", "#9AA0A6", "#4F6B00"] },
  { id: "sapphire", name: "Sapphire", emoji: "💎", blurb: "Deep indigo · royal blue · ice cyan",
    primary: "#3D7BFF", secondary: "#22D3EE", tertiary: "#A5B4FC", darkBg: "#060B1A", lightBg: "#EEF3FF", lightAccent: "#1F4FD6",
    heroes: { violet: ["#1E3A8A", "#2563EB", "#06A6C9"], cool: ["#0B3C8C", "#1D6FE0", "#6D3FE0"], hot: ["#1D4ED8", "#6D28D9", "#C026A3"], mint: ["#0F6FA8", "#0891B2", "#0F9D8A"] },
    aurora: ["#3D7BFF", "#22D3EE", "#7C3AED"] },
  { id: "paper-ink", name: "Paper & Ink", emoji: "📰", blurb: "Cream paper · ink · vermilion",
    primary: "#F4511E", secondary: "#D9A21B", tertiary: "#7B3F98", darkBg: "#121110", lightBg: "#F7F1E6", lightAccent: "#C23B12", lightSurface: "#FFFCF5", ink: ["#1B1712", "#4A4036", "#6F6455"],
    heroes: { violet: ["#C23B12", "#D9531E", "#A8323E", "#5E2A6B"], cool: ["#9C3D12", "#C2571A", "#7B3F98"], hot: ["#C23B12", "#D9731E", "#A66A00"], mint: ["#4F7A3A", "#8A8F1E", "#B8761A"] },
    aurora: ["#F4511E", "#D9A21B", "#7B3F98"] },
  { id: "cobalt-citrus", name: "Cobalt & Citrus", emoji: "🍊", blurb: "Cobalt blue · citrus orange · lemon",
    primary: "#2F6BFF", secondary: "#FF8A1F", tertiary: "#FFD23F", darkBg: "#08090F", lightBg: "#F2F6FF", lightAccent: "#1F4FD6",
    heroes: { violet: ["#1F4BE0", "#6A3DF0", "#E8650A"], cool: ["#1745D6", "#2F6BFF", "#0E9BC2"], hot: ["#D9570A", "#E8790E", "#B8650A"], mint: ["#0F9D8A", "#1F6FEB", "#6A3DF0"] },
    aurora: ["#2F6BFF", "#FF8A1F", "#FFD23F"] },
  { id: "heritage", name: "Heritage", emoji: "🌿", blurb: "Calm teal · plain surfaces (prime-tools default)", flat: true,
    primary: "#3D7A73", secondary: "#2E6B64", tertiary: "#E0941A", darkBg: "#1C1C1E", lightBg: "#FAFAF9", lightAccent: "#2E6B64",
    heroes: { violet: ["#1F5A54", "#2E6B64", "#3D7A73"], cool: ["#1F4F6B", "#2E6B84", "#3D7A73"], hot: ["#8A5A12", "#A2620E", "#7A4A1A"], mint: ["#1F5A54", "#2E7A60", "#3D7A73"] },
    aurora: ["#3D7A73", "#3D7A73", "#3D7A73"] },
];
// ── Comfort (accessibility) ──────────────────────────────────────────────────────────────────────────────────────────
// Needs: legible reading in every light (full sun to a dark room). So readable text is a hard floor,
// not a nicety: every text-role colour in every theme is lifted until it clears these WCAG contrast ratios on its surfaces.
//   standard : AAA on dark (7:1), AA on light (4.5:1)      high (default): 9:1 dark / 7:1 light      max: 12:1 dark / 10:1 light
export type Contrast = "standard" | "high" | "max";
export type Comfort = { contrast: Contrast; bold: boolean; solid: boolean };   // bold = thicker glyphs; solid = no glass/blur/aurora behind text
export const DEFAULT_COMFORT: Comfort = { contrast: "high", bold: false, solid: false };
export const CONTRAST_FLOOR: Record<Contrast, { dark: number; light: number; white: number; border: number; sub: number }> = {
  standard: { dark: 7, light: 4.5, white: 4.5, border: 1, sub: 0.78 },
  high:     { dark: 9, light: 7,   white: 7,   border: 1.8, sub: 0.92 },
  max:      { dark: 12, light: 10, white: 9,   border: 2.8, sub: 1 },
};

export const DEFAULT_THEME = THEMES[0];
export const themeById = (id: string | null | undefined) => THEMES.find((t) => t.id === id) ?? DEFAULT_THEME;

// ── colour helpers ───────────────────────────────────────────────────────────────────────────────────────────────────
const rgb = (h: string): [number, number, number] => { const n = parseInt(h.replace("#", ""), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const hex = (r: number, g: number, b: number) => "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, t: number) => { const [x, y, z] = rgb(a), [p, q, r] = rgb(b); return hex(x + (p - x) * t, y + (q - y) * t, z + (r - z) * t); };
export const rgba = (h: string, a: number) => { const [r, g, b] = rgb(h); return `rgba(${r},${g},${b},${a})`; };
// WCAG contrast of two opaque hex colours
const lin = (v: number) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const lum = (h: string) => { const [r, g, b] = rgb(h); return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b); };
export const contrast = (a: string, b: string) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/** Lift/darken `fg` (towards white on dark, black on light) until it reads at ≥ `min`:1 on every background given. */
export function legible(fg: string, bgs: string[], dark: boolean, min = dark ? 7 : 4.5) {
  const target = dark ? "#FFFFFF" : "#000000";
  for (let t = 0; t <= 1.0001; t += 0.04) { const c = mix(fg, target, t); if (bgs.every((b) => contrast(c, b) >= min)) return c; }
  return target;
}
/** Darken a gradient stop until white text on it reads at ≥ 4.5:1. */
export const forWhiteText = (c: string, min = 4.5) => { for (let t = 0; t <= 1; t += 0.03) { const m = mix(c, "#000000", t); if (contrast("#FFFFFF", m) >= min) return m; } return "#000000"; };

export const gradient = (stops: string[], deg = 135) => `linear-gradient(${deg}deg, ${stops.map((c, i) => `${c} ${Math.round((i / (stops.length - 1)) * 100)}%`).join(", ")})`;

// Mantine wants a 10-step palette for its primary colour; derive it from the theme accent.
export const shades = (base: string): string[] => [0.92, 0.82, 0.68, 0.5, 0.25].map((t) => mix(base, "#FFFFFF", t)).concat([base], [0.12, 0.28, 0.42, 0.56].map((t) => mix(base, "#000000", t)));

export function buildTokens(spec: ThemeSpec, dark: boolean, comfort: Comfort = DEFAULT_COMFORT) {
  const F = CONTRAST_FLOOR[comfort.contrast];
  const min = dark ? F.dark : F.light;
  const p = spec.primary;
  const surfaceFor = dark ? mix(spec.darkBg, p, 0.1) : spec.lightSurface ?? "#FFFFFF";
  const bgs = [dark ? spec.darkBg : spec.lightBg, surfaceFor];
  const L = (c: string) => legible(c, bgs, dark, min);                      // the comfort floor for this scheme
  const accent = L(dark ? mix(p, "#FFFFFF", 0.25) : spec.lightAccent ?? mix(p, "#000000", 0.12));
  const surface = surfaceFor;
  const sec = L(dark ? mix(spec.secondary, "#FFFFFF", 0.2) : mix(spec.secondary, "#000000", 0.12));
  return {
    accent,
    accentSubtle:  dark ? rgba(accent, 0.16) : mix(spec.lightSurface ?? "#FFFFFF", p, 0.1),
    accentHover:   dark ? mix(accent, "#FFFFFF", 0.2) : mix(accent, "#000000", 0.15),
    bgPage:        dark ? spec.darkBg : spec.lightBg,
    bgSurface:     surface,
    bgSubtle:      dark ? mix(spec.darkBg, p, 0.17) : mix(spec.lightBg, p, 0.08),
    border:        dark ? `rgba(255,255,255,${Math.min(0.5, 0.1 * F.border)})` : rgba(mix(p, "#000000", 0.45), Math.min(0.6, 0.13 * F.border)),
    borderStrong:  dark ? `rgba(255,255,255,${Math.min(0.7, 0.22 * F.border)})` : rgba(mix(p, "#000000", 0.45), Math.min(0.75, 0.28 * F.border)),
    textPrimary:   dark ? "#F7F6FF" : spec.ink?.[0] ?? "#15122E",
    textSecondary: L(dark ? "#CFCDEB" : spec.ink?.[1] ?? "#3A3664"),
    textTertiary:  L(dark ? "#ABA9D3" : spec.ink?.[2] ?? "#5F5B8A"),
    error:         L(dark ? "#FF6B88" : "#E0264D"),
    errorBg:       dark ? "rgba(255,107,136,0.14)" : "#FFEDF1",
    warning:       L(dark ? "#FFC24A" : "#D98A00"),
    warningBg:     dark ? "rgba(255,194,74,0.14)" : "#FFF4DC",
    success:       L(dark ? "#3DF2B0" : "#0FAE7B"),
    successBg:     dark ? "rgba(61,242,176,0.13)" : "#E2FAF1",
    info:          L(dark ? "#52CCFF" : "#1495E0"),
    infoBg:        dark ? "rgba(82,204,255,0.14)" : "#E3F5FF",
    violet:        sec,
    violetBg:      rgba(sec, dark ? 0.14 : 0.1),
    heroBg:        forWhiteText(spec.heroes.violet[0], F.white),
    heroText:      "#FFFFFF",
    heroSubtext:   `rgba(255,255,255,${F.sub})`,
    glass:         comfort.solid ? surface : dark ? rgba(surface, 0.62) : "rgba(255,255,255,0.72)",
    glassBorder:   dark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.9)",
    glow:          dark ? `0 0 0 1px ${rgba(accent, 0.18)}, 0 10px 40px ${rgba(p, 0.22)}` : `0 1px 0 rgba(255,255,255,0.9) inset, 0 10px 34px ${rgba(p, 0.14)}`,
    heroGradient:  gradient(spec.heroes.violet.map((c) => forWhiteText(c, F.white))),
    accentGradient: gradient([p, spec.secondary]),
    accentGlow:    rgba(p, 0.5),
    display:       "'Bricolage Grotesque Variable', 'Bricolage Grotesque', -apple-system, BlinkMacSystemFont, sans-serif",
  };
}
