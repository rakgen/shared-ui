// Size tokens. ONE ramp for text, space, radius, touch targets and motion, so no page invents its own numbers.
//
// TEXT is in rem, so it follows the text-size control (scale.ts sets the root font-size). Only text scales: space, radius
// and touch targets stay px on purpose (zooming those too would leave a 390px phone room for half the content).
// The ramp is written as "pixels at the default scale (L = 1.25, root 20px)": fs.sm is 14px for a visitor on the default
// and grows or shrinks from there. Use the SAME token on every page; do not write numeric `fontSize` in pages.
const ROOT_AT_DEFAULT = 20; // px: 16px browser default x 1.25 (akfgen-tools default text size); other apps set --fs-ref via configureScale
// --fs-ref is the app's root size at its default text size (set by configureScale); 20 when unset.
const rem = (px: number) => `calc(${px}rem / var(--fs-ref, ${ROOT_AT_DEFAULT}))`;

export const fs = {
  xs: rem(12),      // captions, chips, eyebrow labels
  sm: rem(14),      // secondary text, buttons, rows' sub lines
  md: rem(16),      // body, inputs
  lg: rem(20),      // small headings, stat values
  xl: rem(24),      // section / sheet titles
  display: rem(34), // page titles, big figures
  hero: `min(${rem(56)}, 14.4vw)`, // the one big numeral on a Hero card: 56px at the default, grows with the control on wide screens, never wider than a phone card
} as const;
/** rem string for a size that is derived at runtime (for example HeroValue's responsive clamp): px at the default scale. */
export const fsOf = rem;

// Space and radius: px on purpose, layout does not grow with text.
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32 } as const;
export const radius = { control: 8, card: 14, panel: 22, pill: 999 } as const;

/** Touch target: fixed px, never shrinks. */
export const TAP = 48;

export const motionMs = { fast: 150, base: 200 } as const;
