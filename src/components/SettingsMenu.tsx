import { ActionIcon, Divider, Group, Popover, Stack, Switch, Text, UnstyledButton, useMantineColorScheme } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconSettings } from "@tabler/icons-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { ComfortPicker, ComfortPresets } from "./ComfortPicker";
import { ThemePicker } from "./ThemePicker";
import { useThemePrefs } from "../themes/themeStore";
import { themeById } from "../themes/themes";
import { SCALE_LABELS, getScaleIndex, setScale } from "../scale";

// The settings gear: a two-level menu (Theme / Comfort / Text size) with one-tap Bright / Dim presets on top.
// Text size: see ../scale.ts (steps, default, storage, apply-before-mount).

// `as="row"` draws the trigger as a full-width "Settings" row (the foot of the sidebar); the default is the 48px gear.
// `extra` adds app-specific rows at the bottom of the menu.
export function SettingsMenu({ as = "icon", extra }: { as?: "icon" | "row"; extra?: ReactNode } = {}) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  const [idx, setIdx] = useState(getScaleIndex);
  const apply = (next: number) => { setIdx(next); setScale(next); };

  const [view, setView] = useState<"menu" | "theme" | "comfort" | "text">("menu");
  const prefs = useThemePrefs();
  const themeName = prefs.mode === "weekday" ? "Colour of the day" : themeById(prefs.id).name;
  const TITLES = { theme: "Theme", comfort: "Comfort", text: "Text size" } as const;
  const row = (key: "theme" | "comfort" | "text", label: string, value: string) => (
    <UnstyledButton key={key} onClick={() => setView(key)} style={{ minHeight: 52, padding: "0 4px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, borderRadius: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: 600 }}>{label}</Text>
      <Group gap={6} wrap="nowrap"><Text style={{ fontSize: 14, opacity: 0.75 }}>{value}</Text><IconChevronRight size={16} /></Group>
    </UnstyledButton>
  );

  return (
    <Popover position={as === "row" ? "right-end" : "bottom-end"} width={290} withinPortal shadow="0 4px 16px rgba(0,0,0,0.10)" middlewares={{ flip: false, shift: { padding: 12 } }}
      onChange={(o) => { if (!o) setView("menu"); }}>
      <Popover.Target>
        {as === "row" ? (
          <UnstyledButton aria-label="Settings" style={{ width: "100%", minHeight: 48, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
            <IconSettings size={18} />Settings
          </UnstyledButton>
        ) : (
          <ActionIcon variant="subtle" aria-label="Settings" style={{ width: 48, height: 48 }}>
            <IconSettings size={18} />
          </ActionIcon>
        )}
      </Popover.Target>
      <Popover.Dropdown style={{ width: "min(320px, calc(100vw - 24px))", maxHeight: "calc(100dvh - 88px)", overflowY: "auto", overscrollBehavior: "contain" }}>
        {view === "menu" ? (
          <Stack gap={4} p="xs">
            <Switch checked={dark} onChange={toggleColorScheme} label={dark ? "Dark mode" : "Light mode"} size="md" style={{ minHeight: 48, display: "flex", alignItems: "center" }} />
            <ComfortPresets />
            <Divider my={6} />
            {row("theme", "Theme", themeName)}
            {row("comfort", "Comfort", `${prefs.comfort.contrast} contrast`)}
            {row("text", "Text size", SCALE_LABELS[idx])}
            {extra}
          </Stack>
        ) : (
          <Stack gap="sm" p="xs">
            <UnstyledButton onClick={() => setView("menu")} aria-label="Back to settings" style={{ minHeight: 48, display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 700 }}>
              <IconChevronLeft size={18} />{TITLES[view]}
            </UnstyledButton>
            {view === "theme" && <ThemePicker />}
            {view === "comfort" && <ComfortPicker />}
            {view === "text" && (
              <Group gap={6} justify="space-between" wrap="nowrap">
                {SCALE_LABELS.map((label, i) => (
                  <UnstyledButton key={label} onClick={() => apply(i)} aria-pressed={idx === i} aria-label={`Text size ${label}`}
                    style={{ flex: 1, minHeight: 48, borderRadius: 12, textAlign: "center", fontSize: 13, padding: 0, fontWeight: idx === i ? 800 : 500, border: `2px solid ${idx === i ? "currentColor" : "rgba(128,128,160,0.3)"}` }}>{label}</UnstyledButton>
                ))}
              </Group>
            )}
          </Stack>
        )}
      </Popover.Dropdown>
    </Popover>
  );
}
