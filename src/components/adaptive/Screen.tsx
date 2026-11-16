import { Box, Stack } from "@mantine/core";
import { motion, useReducedMotion } from "motion/react";
import { Children, Fragment, isValidElement, useLayoutEffect, useRef, useState } from "react";
import { spring, stagger } from "./motion";
import type { ReactNode } from "react";
import { useLayout } from "./useLayout";

// A page body that lays itself out for the screen it is on — write the panels ONCE, in phone order.
//   phone / tablet : a single column (tablet is capped at a readable width and centred)
//   desktop        : two balanced columns that fill top-to-bottom, so the phone reading order is kept
// `header` (title row, period bar…) always spans the full width above the panels. Every child becomes one panel that is
// never split across columns. Never write a separate mobile page: if a screen needs to differ by size, do it here.
//
// The two desktop columns are real columns (a 2-column grid of two stacks) and the split point is measured, NOT CSS
// `column-count`: Safari/WebKit fails to paint animated (transformed) children inside CSS multi-column layouts — a whole
// column of panels simply showed up blank (a card section went missing from the Cards page on a Mac).
// Each flattened panel gets a key that is unique across the WHOLE list: the key path through any fragments it sat in.
// (Children.toArray numbers children per level, so a panel inside a fragment and a top-level panel both got ".0" and the
// duplicate keys left stale copies behind when the column split changed.)
type Panel = { node: ReactNode; key: string };
const flatten = (nodes: ReactNode, prefix = ""): Panel[] =>
  Children.toArray(nodes).flatMap((n, i): Panel[] => {
    const key = prefix + ((isValidElement(n) && n.key != null ? String(n.key) : String(i)) + "/");
    return isValidElement(n) && n.type === Fragment ? flatten((n.props as { children?: ReactNode }).children, key) : [{ node: n, key }];
  });

const GAP = 16;
/** Widest the two-column desktop layout grows. Was 1180, which left ~160px of empty margin each side on a 2000px screen (Nov 17 2026). */
const SCREEN_MAX_WIDTH = 1600;

export function Screen({ header, children }: { header?: ReactNode; children: ReactNode }) {
  const layout = useLayout();
  const reduce = useReducedMotion();
  const items = flatten(children);
  if ((import.meta as { env?: { DEV?: boolean } }).env?.DEV && new Set(items.map((p) => p.key)).size !== items.length) console.warn("Screen: two panels share a key", items.map((p) => p.key));
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [split, setSplit] = useState(items.length); // panels [0, split) go left, the rest right
  const desktop = layout === "desktop";
  const count = items.length;

  // Pick the split that makes the two columns' heights closest. Panel heights don't depend on which column they are in
  // (both columns are the same width), so measuring them where they currently sit is enough.
  useLayoutEffect(() => {
    if (!desktop) return;
    const measure = () => {
      const hs = refs.current.slice(0, count).map((e) => e?.offsetHeight ?? 0);
      const column = (from: number, to: number) => hs.slice(from, to).reduce((t, h) => t + h, 0) + GAP * Math.max(0, to - from - 1);
      let best = Math.max(1, count), bestDiff = Infinity;
      for (let k = 1; k <= count; k++) { // k = panels in the left column; the left column always keeps the first panel
        const diff = Math.abs(column(0, k) - column(k, count));
        if (diff < bestDiff) { bestDiff = diff; best = k; }
      }
      setSplit((s) => (s === best ? s : best));
    };
    measure();
    const ro = new ResizeObserver(measure);
    refs.current.slice(0, count).forEach((e) => e && ro.observe(e));
    return () => ro.disconnect();
  }, [desktop, count, children]);

  const panel = (c: Panel, i: number) => (
    <motion.div key={c.key} ref={(e: HTMLDivElement | null) => { refs.current[i] = e; }} initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring.smooth, delay: reduce ? 0 : Math.min(stagger(i), 0.4) }}>{c.node}</motion.div>
  );
  const cut = desktop ? Math.min(split, count) : count;

  return (
    <Stack gap={16} style={{ width: "100%", maxWidth: desktop ? SCREEN_MAX_WIDTH : layout === "tablet" ? 680 : undefined, marginInline: layout === "phone" ? undefined : "auto" }}>
      {header}
      {desktop ? (
        <Box style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", columnGap: GAP, alignItems: "start" }}>
          <Stack gap={GAP}>{items.slice(0, cut).map((c, i) => panel(c, i))}</Stack>
          <Stack gap={GAP}>{items.slice(cut).map((c, i) => panel(c, cut + i))}</Stack>
        </Box>
      ) : (
        <Stack gap={GAP}>{items.map((c, i) => panel(c, i))}</Stack>
      )}
    </Stack>
  );
}
