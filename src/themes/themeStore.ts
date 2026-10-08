import { useSyncExternalStore } from "react";
import { DEFAULT_COMFORT, THEMES, themeById, type Comfort, type ThemeSpec } from "./themes";

// Which theme is active — a tiny localStorage-backed store (no React context needed, so any hook can read it).
//   fixed   : one theme until changed
//   weekday : a different theme per day of the week (Mon…Sun), switching at midnight — "mood of the day"
// Pure client state, no imports from the app: lifts straight into a shared library.
export type ThemeMode = "fixed" | "weekday";
export type ThemePrefs = { mode: ThemeMode; id: string; week: string[]; comfort: Comfort }; // week[0] = Monday … week[6] = Sunday
const KEY = "themePrefs";
// Host apps call configureThemes() once, before first render, to choose what a brand-new visitor sees.
let defaults: { id?: string; contrast?: Comfort["contrast"] } = {};
export function configureThemes(d: { defaultId?: string; defaultContrast?: Comfort["contrast"] }) { defaults = { id: d.defaultId, contrast: d.defaultContrast }; prefs = load(); }
export const DEFAULT_WEEK = ["sapphire", "neon-pop", "matcha", "cobalt-citrus", "bubblegum", "midnight-gold", "paper-ink"];

function defaultComfort(): Comfort {
  // honour the OS accessibility settings the first time (no stored choice yet)
  try {
    const more = window.matchMedia("(prefers-contrast: more)").matches, solid = window.matchMedia("(prefers-reduced-transparency: reduce)").matches;
    return { ...DEFAULT_COMFORT, contrast: more ? "max" : defaults.contrast ?? DEFAULT_COMFORT.contrast, solid };
  } catch { return { ...DEFAULT_COMFORT, contrast: defaults.contrast ?? DEFAULT_COMFORT.contrast }; }
}
function load(): ThemePrefs {
  try {
    const p = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<ThemePrefs> | null;
    if (p) return { mode: p.mode === "weekday" ? "weekday" : "fixed", id: themeById(p.id).id, week: DEFAULT_WEEK.map((d, i) => themeById(p.week?.[i] ?? d).id), comfort: { ...defaultComfort(), ...p.comfort } };
  } catch { /* fall through */ }
  return { mode: "fixed", id: themeById(defaults.id ?? THEMES[0].id).id, week: [...DEFAULT_WEEK], comfort: defaultComfort() };
}

let prefs: ThemePrefs = load();
const listeners = new Set<() => void>();
const weekdayIndex = () => (new Date().getDay() + 6) % 7; // Monday = 0
const activeIdOf = (p: ThemePrefs) => (p.mode === "fixed" ? p.id : p.week[weekdayIndex()]);
const emit = () => listeners.forEach((l) => l());
const update = (next: ThemePrefs) => { prefs = next; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } emit(); };

let lastActive = activeIdOf(prefs);
const recheck = () => { const a = activeIdOf(prefs); if (a !== lastActive) { lastActive = a; emit(); } };
if (typeof window !== "undefined") {
  setInterval(recheck, 60_000);                                   // the day rolls over while the app is open
  window.addEventListener("focus", recheck); document.addEventListener("visibilitychange", recheck);
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

/** the theme in effect right now */
export function useActiveTheme(): ThemeSpec { return themeById(useSyncExternalStore(subscribe, () => activeIdOf(prefs))); }
/** current preferences (for the picker) */
export function useThemePrefs(): ThemePrefs { return useSyncExternalStore(subscribe, () => prefs); }

export const themeActions = {
  setFixed: (id: string) => update({ ...prefs, mode: "fixed", id }),
  setMode: (mode: ThemeMode) => update({ ...prefs, mode }),
  setDay: (day: number, id: string) => update({ ...prefs, week: prefs.week.map((w, i) => (i === day ? id : w)) }),
  shuffleWeek: () => { const ids = THEMES.map((t) => t.id); update({ ...prefs, mode: "weekday", week: Array.from({ length: 7 }, (_, i) => ids[(i * 3 + Math.floor(Math.random() * ids.length)) % ids.length]) }); },
  setComfort: (c: Partial<Comfort>) => update({ ...prefs, comfort: { ...prefs.comfort, ...c } }),
  todayIndex: weekdayIndex,
};
