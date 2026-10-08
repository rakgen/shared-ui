import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";
import type { CSSProperties } from "react";

// A number that counts up to its value with a soft ease — the "alive" feel on hero figures. Respects reduced-motion.
// Pass `format` so it renders exactly like the static figure would (₹ grouping, paise…).
export function CountUp({ to, format, style }: { to: number; format: (n: number) => string; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(reduce ? to : 0);
  const text = useTransform(mv, (v) => format(v));
  useEffect(() => {
    if (reduce) { mv.set(to); return; }
    const c = animate(mv, to, { duration: 0.95, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [to, reduce, mv]);
  return <motion.span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{text}</motion.span>;
}
