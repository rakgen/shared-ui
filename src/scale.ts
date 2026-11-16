// The text-size control, in ONE place. Steps, default, storage key and "apply before first paint" live here so no app keeps
// its own copy. The scale sets the root font-size (a percentage), so it moves everything written in rem (see tokens.ts `fs`).
// Saved choice: localStorage key `uiScale` (kept from the old per-app copies so nobody loses their setting).
export const SCALES = [0.875, 1, 1.125, 1.25, 1.5, 1.75, 2] as const;
export const SCALE_LABELS = ["XS", "S", "M", "L", "XL", "2XL", "3XL"] as const;
const KEY = "uiScale";

let defaultScale = 1.25;

/** Call once, before applyStoredScale(): the scale a brand-new visitor gets (akfgen-tools 1.25, prime-tools 1.125). */
export function configureScale(opts: { default?: number }) {
  if (opts.default != null && opts.default > 0) defaultScale = opts.default;
}

const nearest = (v: number) => SCALES.reduce((best, s, i) => (Math.abs(s - v) < Math.abs(SCALES[best] - v) ? i : best), 0);

/** Index into SCALES of the saved (or default) scale. */
export function getScaleIndex(): number {
  try {
    const stored = parseFloat(localStorage.getItem(KEY) ?? "");
    if (!isNaN(stored) && stored > 0) return nearest(stored);
  } catch { /* storage blocked: use the default */ }
  return nearest(defaultScale);
}

/** Put the saved scale on <html>. Synchronous and safe before React mounts (prevents a flash of the wrong size). */
export function applyStoredScale() {
  try {
    const stored = parseFloat(localStorage.getItem(KEY) ?? "");
    const v = !isNaN(stored) && stored > 0 ? stored : defaultScale;
    document.documentElement.style.fontSize = `${v * 100}%`;
  } catch { /* ignore */ }
}

/** Choose step `i` of SCALES: applies it now and saves it. */
export function setScale(i: number) {
  const v = SCALES[Math.max(0, Math.min(SCALES.length - 1, i))];
  document.documentElement.style.fontSize = `${v * 100}%`;
  try { localStorage.setItem(KEY, String(v)); } catch { /* ignore */ }
}
