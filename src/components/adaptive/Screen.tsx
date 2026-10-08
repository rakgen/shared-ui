import { Box, Stack } from "@mantine/core";
import { motion, useReducedMotion } from "motion/react";
import { Children, Fragment, isValidElement } from "react";
import { spring, stagger } from "./motion";
import type { ReactNode } from "react";
import { useLayout } from "./useLayout";

// A page body that lays itself out for the screen it is on — write the panels ONCE, in phone order.
//   phone / tablet : a single column (tablet is capped at a readable width and centred)
//   desktop        : two balanced columns that fill top-to-bottom, so the phone reading order is kept
// `header` (title row, period bar…) always spans the full width above the panels. Every child becomes one panel that is
// never split across columns. Never write a separate mobile page: if a screen needs to differ by size, do it here.
const flatten = (nodes: ReactNode): ReactNode[] =>
  Children.toArray(nodes).flatMap((n) => (isValidElement(n) && n.type === Fragment ? flatten((n.props as { children?: ReactNode }).children) : [n]));

export function Screen({ header, children }: { header?: ReactNode; children: ReactNode }) {
  const layout = useLayout();
  const reduce = useReducedMotion();
  const items = flatten(children);
  return (
    <Stack gap={16} style={{ width: "100%", maxWidth: layout === "desktop" ? 1180 : layout === "tablet" ? 680 : undefined, marginInline: layout === "phone" ? undefined : "auto" }}>
      {header}
      <Box style={{ columnCount: layout === "desktop" ? 2 : 1, columnGap: 16 }}>
        {items.map((c, i) => (
          <motion.div key={(isValidElement(c) && c.key) || i} initial={reduce ? false : { opacity: 0, y: 18, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ ...spring.smooth, delay: reduce ? 0 : Math.min(stagger(i), 0.4) }} style={{ breakInside: "avoid", marginBottom: 16 }}>{c}</motion.div>
        ))}
      </Box>
    </Stack>
  );
}
