import { useMantineColorScheme } from "@mantine/core";
import { Group, Stack, Switch, Text, UnstyledButton } from "@mantine/core";
import { themeActions, useThemePrefs } from "../themes/themeStore";
import type { Contrast } from "../themes/themes";

// "Comfort" — readability controls for every light condition. Contrast sets how hard every text colour is
// pushed away from its background (Standard 7:1 dark / 4.5:1 light → High 9:1 / 7:1 → Max 12:1 / 10:1). Presets flip the
// scheme and the comfort options together: full sun wants light + max + bold + solid; a dim room is fine with dark + high.
const LEVELS: { id: Contrast; label: string }[] = [{ id: "standard", label: "Standard" }, { id: "high", label: "High" }, { id: "max", label: "Max" }];

// One-tap presets, shown on the settings menu's top level.
export function ComfortPresets() {
  const { setColorScheme } = useMantineColorScheme();
  const preset = (text: string, run: () => void) => (
    <UnstyledButton onClick={run} style={{ flex: 1, minHeight: 48, borderRadius: 14, border: "2px solid rgba(128,128,160,0.3)", fontSize: 13, fontWeight: 600, padding: "6px 8px", textAlign: "center", lineHeight: 1.2 }}>{text}</UnstyledButton>
  );
  return (
    <Group gap={6} wrap="nowrap">
      {preset("☀️ Bright light", () => { setColorScheme("light"); themeActions.setComfort({ contrast: "max", bold: true, solid: true }); })}
      {preset("🌙 Dim light", () => { setColorScheme("dark"); themeActions.setComfort({ contrast: "high", bold: false, solid: false }); })}
    </Group>
  );
}

export function ComfortPicker() {
  const { comfort } = useThemePrefs();
  const label = { fontSize: 12, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em" } as const;
  return (
    <Stack gap={10}>
      <Text style={label}>Contrast</Text>
      <Group gap={4} wrap="nowrap" role="group" aria-label="Contrast">
        {LEVELS.map((l) => {
          const on = comfort.contrast === l.id;
          return (
            <UnstyledButton key={l.id} onClick={() => themeActions.setComfort({ contrast: l.id })} aria-pressed={on}
              style={{ flex: 1, minHeight: 44, borderRadius: 12, fontSize: 13, fontWeight: on ? 800 : 500, textAlign: "center", border: `2px solid ${on ? "currentColor" : "rgba(128,128,160,0.3)"}` }}>{l.label}</UnstyledButton>
          );
        })}
      </Group>
      <Switch size="sm" checked={comfort.bold} onChange={(e) => themeActions.setComfort({ bold: e.currentTarget.checked })} label="Bold text" description="Thicker letters, easier in glare" />
      <Switch size="sm" checked={comfort.solid} onChange={(e) => themeActions.setComfort({ solid: e.currentTarget.checked })} label="Solid backgrounds" description="No glass, blur or glow behind text" />
    </Stack>
  );
}
