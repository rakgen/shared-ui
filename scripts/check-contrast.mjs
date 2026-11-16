#!/usr/bin/env node
// Build gate — readability floor. For every theme × comfort level × scheme, every text-role and semantic colour must clear its
// WCAG contrast floor on the page and surface backgrounds, and white hero text must clear it on every gradient stop.
// Readability is a hard floor (every light, every contrast level): a new theme that can't be read does not ship. (Floors: src/themes/themes.ts)
import { build } from "esbuild";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const out = join(mkdtempSync(join(tmpdir(), "contrast-")), "themes.mjs");
await build({ entryPoints: [new URL("../src/themes/themes.ts", import.meta.url).pathname], bundle: true, format: "esm", outfile: out, logLevel: "error" });
const { THEMES, buildTokens, contrast, forWhiteText, CONTRAST_FLOOR } = await import(pathToFileURL(out).href);

const toHex = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return c; const [r, g, b] = m[1].split(",").map(Number); return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join(""); };
const fails = []; let n = 0; const worst = new Map();
for (const t of THEMES) for (const level of ["standard", "high", "max"]) for (const dark of [true, false]) {
  const T = buildTokens(t, dark, { contrast: level, bold: false, solid: false });
  const floor = CONTRAST_FLOOR[level][dark ? "dark" : "light"];
  for (const k of ["textPrimary", "textSecondary", "textTertiary", "accent", "error", "warning", "success", "info", "violet"]) for (const bg of [T.bgPage, T.bgSurface]) {
    n++; const c = contrast(toHex(T[k]), toHex(bg)); if (c + 0.05 < floor) fails.push(`${t.id} ${level} ${dark ? "dark" : "light"} ${k} on ${bg}: ${c.toFixed(2)} < ${floor}`);
  }
  // filled controls: text on a filled primary/danger button (ink vs fill, resting and hover), and white on every stop of the accent gradient and the active tab/dock pill
  const fillFloor = floor;
  for (const [what, ink, bgk] of [["button", "onFill", "fill"], ["button hover", "onFill", "fillHover"], ["danger button", "onErrorFill", "errorFill"], ["danger button hover", "onErrorFill", "errorFillHover"]]) {
    n++; const c = contrast(toHex(T[ink]), toHex(T[bgk])); worst.set(what, Math.min(worst.get(what) ?? 99, c / fillFloor)); if (c + 0.05 < fillFloor) fails.push(`${t.id} ${level} ${dark ? "dark" : "light"} ${what}: ${T[ink]} on ${T[bgk]} ${c.toFixed(2)} < ${fillFloor}`);
  }
  if (!t.calm) for (const [what, g, ink] of [["accent gradient", T.accentGradient, "#FFFFFF"], ["tab pill", T.pillBg, T.pillInk]]) for (const stop of g.match(/#[0-9a-f]{6}/gi)) {
    n++; const c = contrast(toHex(ink), stop), need = CONTRAST_FLOOR[level].white; worst.set(what, Math.min(worst.get(what) ?? 99, c / need)); if (c + 0.05 < need) fails.push(`${t.id} ${level} ${dark ? "dark" : "light"} ${what} stop ${stop}: ${c.toFixed(2)} < ${need}`);
  }
  if (t.calm) { // calm pill: accent ink on a translucent/tinted pill laid over the card surface
    const over = (c, base) => { const m = c.match(/rgba\(([^)]+)\)/); if (!m) return c; const [r, g, b, a] = m[1].split(",").map(Number), [R, G, B] = [1, 3, 5].map((i) => parseInt(base.slice(i, i + 2), 16)); return toHex(`rgb(${r * a + R * (1 - a)},${g * a + G * (1 - a)},${b * a + B * (1 - a)})`); };
    n++; const c = contrast(toHex(T.pillInk), over(T.pillBg, toHex(T.bgSurface))); worst.set("calm tab pill", Math.min(worst.get("calm tab pill") ?? 99, c / floor)); if (c + 0.05 < floor) fails.push(`${t.id} ${level} ${dark ? "dark" : "light"} calm tab pill: ${c.toFixed(2)} < ${floor}`);
  }
  for (const tone of ["violet", "cool", "hot", "mint"]) for (const stop of t.heroes[tone]) {
    n++; const c = contrast("#FFFFFF", forWhiteText(stop, CONTRAST_FLOOR[level].white)); if (c + 0.05 < CONTRAST_FLOOR[level].white) fails.push(`hero ${t.id} ${level} ${tone} ${stop}: ${c.toFixed(2)}`);
  }
}
if (fails.length) { console.error("Readability floor broken:\n" + fails.join("\n")); process.exit(1); }
if (process.env.VERBOSE) for (const [k, v] of worst) console.log(`  tightest ${k}: ${v.toFixed(3)}x its floor`);
console.log(`contrast check: ${n} colour pairs across ${THEMES.length} themes meet their floor`);
