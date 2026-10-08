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
const fails = []; let n = 0;
for (const t of THEMES) for (const level of ["standard", "high", "max"]) for (const dark of [true, false]) {
  const T = buildTokens(t, dark, { contrast: level, bold: false, solid: false });
  const floor = CONTRAST_FLOOR[level][dark ? "dark" : "light"];
  for (const k of ["textPrimary", "textSecondary", "textTertiary", "accent", "error", "warning", "success", "info", "violet"]) for (const bg of [T.bgPage, T.bgSurface]) {
    n++; const c = contrast(toHex(T[k]), toHex(bg)); if (c + 0.05 < floor) fails.push(`${t.id} ${level} ${dark ? "dark" : "light"} ${k} on ${bg}: ${c.toFixed(2)} < ${floor}`);
  }
  for (const tone of ["violet", "cool", "hot", "mint"]) for (const stop of t.heroes[tone]) {
    n++; const c = contrast("#FFFFFF", forWhiteText(stop, CONTRAST_FLOOR[level].white)); if (c + 0.05 < CONTRAST_FLOOR[level].white) fails.push(`hero ${t.id} ${level} ${tone} ${stop}: ${c.toFixed(2)}`);
  }
}
if (fails.length) { console.error("Readability floor broken:\n" + fails.join("\n")); process.exit(1); }
console.log(`contrast check: ${n} colour pairs across ${THEMES.length} themes meet their floor`);
