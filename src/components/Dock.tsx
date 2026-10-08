import { Box, Text, UnstyledButton } from "@mantine/core";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useTheme } from "../themes/useTheme";
import { spring } from "./adaptive/motion";

// The phone bottom dock: a rounded bar with a gradient pill that slides to the active item (shared-element spring).
// `opaque` (default) paints a solid surface — use it wherever text behind the bar must never show through; the personal
// tools can pass opaque={false} for the frosted-glass look. `floating` insets it from the edges; false docks it flush.
export type DockItem = {
  key: string; label: string; icon: ReactNode;
  badge?: number; ariaLabel?: string;
  onClick?: () => void;
  /** extra props for the button, e.g. { component: Link, to: "/x" } */
  buttonProps?: Record<string, unknown>;
};

export function Dock({ items, activeKey, ariaLabel = "Navigation", floating = true, opaque = true, maxWidth = 520, zIndex = 99 }: {
  items: DockItem[]; activeKey?: string | null; ariaLabel?: string; floating?: boolean; opaque?: boolean; maxWidth?: number; zIndex?: number;
}) {
  const C = useTheme();
  const surface = opaque
    ? { background: C.bgSurface, border: `1px solid ${C.border}`, boxShadow: "0 8px 28px rgba(0,0,0,0.22)" }
    : { background: C.glass, backdropFilter: "blur(22px) saturate(160%)", WebkitBackdropFilter: "blur(22px) saturate(160%)", border: `1px solid ${C.glassBorder}`, boxShadow: C.glow };
  const frame = floating
    ? { left: 12, right: 12, bottom: "calc(env(safe-area-inset-bottom) + 10px)", maxWidth, marginInline: "auto", height: 64, borderRadius: 28, padding: 6 }
    : { left: 0, right: 0, bottom: 0, height: "calc(68px + env(safe-area-inset-bottom))", paddingTop: 6, paddingInline: 6, paddingBottom: "calc(6px + env(safe-area-inset-bottom))", borderRadius: 0, borderInline: "none", borderBottom: "none" };
  return (
    <Box component="nav" aria-label={ariaLabel} style={{ position: "fixed", zIndex, display: "flex", ...surface, ...frame }}>
      {items.map((t) => {
        const active = t.key === activeKey;
        const count = t.badge && t.badge > 0 ? t.badge : 0;
        return (
          <UnstyledButton key={t.key} onClick={t.onClick} aria-current={active ? "page" : undefined}
            aria-label={t.ariaLabel ?? (count ? `${t.label}, ${count}` : t.label)} {...t.buttonProps}
            style={{ position: "relative", flex: 1, minWidth: 0, minHeight: 52, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, borderRadius: 22, color: active ? "#fff" : C.textSecondary }}>
            {active && <motion.span layoutId={`dock-pill-${ariaLabel}`} transition={spring.snappy} style={{ position: "absolute", inset: 0, borderRadius: 22, background: C.accentGradient, boxShadow: `0 6px 18px ${C.accentGlow}`, zIndex: 0 }} />}
            <Box style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center", height: 24 }}>
              {t.icon}
              {count > 0 && (
                <Text aria-hidden style={{ position: "absolute", top: -8, right: -14, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 100, fontSize: 12, fontWeight: 700, lineHeight: "18px", textAlign: "center", background: C.warning, color: "#1b1200" }}>
                  {count > 99 ? "99+" : count}
                </Text>
              )}
            </Box>
            <Text style={{ position: "relative", zIndex: 1, fontSize: "clamp(11px, 0.75rem, 14px)", letterSpacing: "-0.01em", lineHeight: 1.1, maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: active ? 700 : 600, color: "inherit" }}>{t.label}</Text>
          </UnstyledButton>
        );
      })}
    </Box>
  );
}
