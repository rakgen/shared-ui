import { ActionIcon, AppShell, Box, Group, NavLink, ScrollArea, Text, Tooltip } from "@mantine/core";
import { IconChevronsDown, IconChevronsUp, IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useTheme } from "../themes/useTheme";
import { useLayout } from "./adaptive/useLayout";

// The one app frame both apps use (Nov 2026): grouped, collapsible sidebar with the brand on top and the app settings
// at the bottom; a header with the sidebar toggle, the page title and page actions; content capped at 1600px and
// centred; the phone's bottom bar supplied by the app. Routing stays in each app: it passes the nav tree, which key is
// active, and how a row navigates (`linkProps` for router links, or `onSelect`).

export type NavItem = { key: string; label: string; icon: ReactNode; href?: string; external?: boolean };
export type NavGroup = { key: string; label: string; icon: ReactNode; items: NavItem[]; color?: string };
export type NavEntry = NavItem | NavGroup;
const isGroup = (e: NavEntry): e is NavGroup => Array.isArray((e as NavGroup).items);

// Grows with the text size, but never past 280px, so a tablet at a large text size keeps room for the page.
export const SIDEBAR_WIDTH = "clamp(var(--sui-nav-min), 13.5rem, var(--sui-nav-max))";   // bounds are CSS variables: Mantine rewrites px written here into rem
export const HEADER_HEIGHT = 54;
export const CONTENT_MAX = 1600;

type Props = {
  nav: NavEntry[];
  activeKey: string | null;
  /** extra props for a row, e.g. (i) => ({ component: Link, to: i.key }) */
  linkProps?: (item: NavItem) => Record<string, unknown>;
  onSelect?: (item: NavItem) => void;
  brand: ReactNode;
  /** header left, after the sidebar toggle: the page title and anything next to it */
  title?: ReactNode;
  /** header right: page actions */
  headerRight?: ReactNode;
  /** the app settings trigger; drawn at the foot of the sidebar (desktop) or at the right of the header (phone) */
  settings?: (where: "sidebar" | "header") => ReactNode;
  /** false keeps the settings out of the phone header (an app that offers them in its own phone menu) */
  settingsInPhoneHeader?: boolean;
  /** starred pages: a Favorites group on top and a star on each row */
  favorites?: { keys: string[]; toggle: (key: string) => void };
  /** which groups are open the first time: only the current page's group, or all */
  defaultOpen?: "current" | "all";
  /** localStorage key for the open groups (each app keeps its own existing key) */
  groupsKey?: string;
  /** the phone bottom bar and its height (the content keeps clear of it) */
  phoneNav?: ReactNode;
  phoneNavHeight?: number;
  /** fixed-position extras that belong to the frame (pull-to-refresh, fades) */
  overlay?: ReactNode;
  children: ReactNode;
};

function readJson<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}

export function AppFrame({ nav, activeKey, linkProps, onSelect, brand, title, headerRight, settings, settingsInPhoneHeader = true,
  favorites, defaultOpen = "current", groupsKey = "navGroupsOpen", phoneNav, phoneNavHeight = 86, overlay, children }: Props) {
  const C = useTheme();
  const phone = useLayout() === "phone";

  // Sidebar shown or hidden on desktop (one key in both apps).
  const [open, setOpenState] = useState(() => { try { return localStorage.getItem("navbarOpened") !== "false"; } catch { return true; } });
  const toggleSidebar = () => setOpenState((o) => { try { localStorage.setItem("navbarOpened", String(!o)); } catch { /* ignore */ } return !o; });

  // Which groups are open: remembered; going to a page always opens its group.
  const groups = nav.filter(isGroup);
  const current = groups.find((g) => g.items.some((i) => i.key === activeKey))?.key ?? null;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean> | null>(() => readJson(groupsKey, null));
  const isOpen = (key: string) => openGroups?.[key] ?? (defaultOpen === "all" || key === current);
  const save = (next: Record<string, boolean>) => { setOpenGroups(next); try { localStorage.setItem(groupsKey, JSON.stringify(next)); } catch { /* ignore */ } };
  const setOpen = (key: string, v: boolean) => save({ ...Object.fromEntries(groups.map((g) => [g.key, isOpen(g.key)])), [key]: v });
  const allOpen = groups.every((g) => isOpen(g.key));
  useEffect(() => {
    if (current && !isOpen(current)) setOpen(current, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const tint = (icon: ReactNode, color?: string) => <Box style={{ color: color ?? C.textTertiary, display: "flex" }}>{icon}</Box>;
  const rowStyles = { root: { borderRadius: 8, minHeight: 40, paddingBlock: 6 }, label: { lineHeight: 1.25 } };   // long labels wrap rather than being cut off
  const groupStyles = { root: { borderRadius: 8, minHeight: 36, paddingBlock: 4 }, label: { fontWeight: 600, fontSize: 12, textTransform: "uppercase" as const, letterSpacing: "0.04em", color: C.textTertiary } };

  const star = (key: string) => {
    if (!favorites) return undefined;
    const on = favorites.keys.includes(key);
    return (
      <ActionIcon size="sm" variant="subtle" className="sui-fav-star" data-starred={on ? "true" : undefined} color={on ? "yellow" : "gray"}
        aria-label={on ? "Remove from favorites" : "Add to favorites"} onClick={(e) => { e.preventDefault(); e.stopPropagation(); favorites.toggle(key); }}>
        {on ? <IconStarFilled size={14} /> : <IconStar size={14} />}
      </ActionIcon>
    );
  };
  const row = (item: NavItem, color?: string) => item.external ? (
    <NavLink key={item.key} component="a" href={item.href} target="_blank" rel="noopener noreferrer" label={item.label}
      leftSection={tint(item.icon, color)} styles={rowStyles} />
  ) : (
    <NavLink key={item.key} {...(linkProps?.(item) ?? {})} label={item.label} leftSection={tint(item.icon, color)} active={item.key === activeKey}
      onClick={() => onSelect?.(item)} className="sui-nav-row" rightSection={star(item.key)} styles={rowStyles} />
  );
  const allItems = nav.flatMap((e) => (isGroup(e) ? e.items : [e]));
  const favItems = favorites ? favorites.keys.map((k) => allItems.find((i) => i.key === k)).filter((i): i is NavItem => !!i) : [];

  const expandAll = groups.length > 1 && (
    <Tooltip label={allOpen ? "Collapse all groups" : "Expand all groups"} position="right" withArrow>
      <ActionIcon variant="subtle" color="gray" onClick={() => save(Object.fromEntries(groups.map((g) => [g.key, !allOpen])))} aria-label={allOpen ? "Collapse all groups" : "Expand all groups"} style={{ width: 40, height: 40, flexShrink: 0 }}>
        {allOpen ? <IconChevronsUp size={18} /> : <IconChevronsDown size={18} />}
      </ActionIcon>
    </Tooltip>
  );

  const sidebar = (
    <Box p="sm">
      {favItems.length > 0 && (
        <NavLink label="Favorites" leftSection={tint(<IconStarFilled size={16} />, "var(--mantine-color-yellow-6)")}
          opened={isOpen("__favorites__")} onChange={(v) => setOpen("__favorites__", v)} styles={groupStyles}>
          {favItems.map((i) => row(i))}
        </NavLink>
      )}
      {nav.map((e) => isGroup(e) ? (
        <NavLink key={e.key} label={e.label} leftSection={tint(e.icon, e.color)} opened={isOpen(e.key)} onChange={(v) => setOpen(e.key, v)} styles={groupStyles}>
          {e.items.length ? e.items.map((i) => row(i, e.color)) : <Text px="sm" py={4} style={{ fontSize: 14, color: C.textTertiary }}>Nothing here yet</Text>}
        </NavLink>
      ) : row(e))}
    </Box>
  );

  const barSpace = `calc(${phoneNavHeight}px + env(safe-area-inset-bottom))`;
  return (
    <AppShell layout="alt" header={{ height: HEADER_HEIGHT }} navbar={{ width: SIDEBAR_WIDTH, breakpoint: "sm", collapsed: { mobile: true, desktop: !open } }}>
      <AppShell.Header withBorder={false}>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap" gap={8}>
          <Group gap={8} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            <ActionIcon variant="subtle" onClick={toggleSidebar} visibleFrom="sm" aria-label={open ? "Hide sidebar" : "Show sidebar"} style={{ width: 48, height: 48, flexShrink: 0 }}>
              {open ? <IconLayoutSidebarLeftCollapse size={18} /> : <IconLayoutSidebarLeftExpand size={18} />}
            </ActionIcon>
            {title}
          </Group>
          <Group gap={8} wrap="nowrap">
            {headerRight}
            {phone && settingsInPhoneHeader && settings?.("header")}
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <AppShell.Section>
          <Group h={HEADER_HEIGHT} pl="md" pr={6} align="center" justify="space-between" wrap="nowrap" gap={8} style={{ borderBottom: `1px solid ${C.border}` }}>
            <Box style={{ minWidth: 0, display: "flex", alignItems: "center" }}>{brand}</Box>{expandAll}
          </Group>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} scrollbarSize={6}>{sidebar}</AppShell.Section>
        {settings && <AppShell.Section style={{ borderTop: `1px solid ${C.border}` }} p={4}>{settings("sidebar")}</AppShell.Section>}
      </AppShell.Navbar>
      <AppShell.Main>
        {/* --tabbar-h lets pages keep their own sticky bottom bars clear of the phone bar */}
        <Box p="md" pb={phone && phoneNav ? `calc(${barSpace} + 16px)` : "md"}
          style={{ width: "100%", maxWidth: CONTENT_MAX, marginInline: "auto", "--tabbar-h": phone && phoneNav ? barSpace : "0px" } as CSSProperties}>
          {children}
        </Box>
      </AppShell.Main>
      {overlay}
      {phone && phoneNav}
    </AppShell>
  );
}
