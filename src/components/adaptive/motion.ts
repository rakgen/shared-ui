// Shared motion vocabulary for the personal tools — pick from here instead of inventing per-screen timings, so the whole
// app moves with one personality. (Springs, not fixed-duration easings: they respond to gesture velocity like native.)
export const spring = {
  /** default: taps, toggles, list entrances — quick, slightly bouncy */
  snappy: { type: "spring", stiffness: 380, damping: 32, mass: 0.8 },
  /** larger moves: panels, shared-element transitions — calmer */
  smooth: { type: "spring", stiffness: 220, damping: 28, mass: 1 },
  /** playful: celebratory moments (sorted ✓, balance matched) */
  bouncy: { type: "spring", stiffness: 520, damping: 18, mass: 0.7 },
} as const;
/** pressed state for anything tappable */
export const press = { whileTap: { scale: 0.97 }, transition: spring.snappy } as const;
/** delay for staggered list entrances: row i appears 45ms after row i-1 */
export const stagger = (i: number, step = 0.045) => i * step;
