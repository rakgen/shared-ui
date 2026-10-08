import { useState } from "react";
import { Box, Group, Stack, Switch, Text, UnstyledButton } from "@mantine/core";
import { themeActions, useThemePrefs } from "../themes/themeStore";
import { THEMES, gradient, themeById } from "../themes/themes";

// Theme chooser for the settings popover: pick a mood, or switch on "colour of the day" and give each weekday its own.
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const swatch = (id: string) => gradient(themeById(id).heroes.violet);

export function ThemePicker() {
  const prefs = useThemePrefs();
  const today = themeActions.todayIndex();
  const [day, setDay] = useState(today);                      // which weekday is being edited in weekday mode
  const weekday = prefs.mode === "weekday";
  const current = weekday ? prefs.week[day] : prefs.id;
  const choose = (id: string) => (weekday ? themeActions.setDay(day, id) : themeActions.setFixed(id));

  return (
    <Stack gap={10}>
      <Switch size="sm" checked={weekday} onChange={(e) => themeActions.setMode(e.currentTarget.checked ? "weekday" : "fixed")} label="Colour of the day" description="A different mood each weekday" />
      {weekday && (
        <Group gap={4} wrap="nowrap" justify="space-between">
          {DAYS.map((d, i) => (
            <UnstyledButton key={i} onClick={() => setDay(i)} aria-pressed={day === i} aria-label={`Edit theme for day ${i + 1}`}
              style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0", borderRadius: 12, outline: day === i ? "2px solid currentColor" : "none" }}>
              <Box style={{ width: 24, height: 24, borderRadius: 100, background: swatch(prefs.week[i]) }} />
              <Text style={{ fontSize: 11, fontWeight: i === today ? 800 : 500 }}>{d}</Text>
            </UnstyledButton>
          ))}
        </Group>
      )}
      <Group gap={8} justify="space-between">
        <Text style={{ fontSize: 12, fontWeight: 600, opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.05em" }}>{weekday ? `Theme for ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day]}` : "Theme"}</Text>
        {weekday && <UnstyledButton onClick={() => themeActions.shuffleWeek()} style={{ fontSize: 12, fontWeight: 600, minHeight: 32 }}>🎲 Shuffle week</UnstyledButton>}
      </Group>
      <Box style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
        {THEMES.map((t) => {
          const on = t.id === current;
          return (
            <UnstyledButton key={t.id} onClick={() => choose(t.id)} aria-pressed={on} aria-label={`${t.name} theme`}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: 8, borderRadius: 16, minHeight: 48, border: `2px solid ${on ? "currentColor" : "rgba(128,128,160,0.25)"}` }}>
              <Box style={{ width: 28, height: 28, borderRadius: 100, background: swatch(t.id), flex: "0 0 auto", boxShadow: on ? `0 0 14px ${t.primary}` : "none" }} />
              <Text style={{ fontSize: 13, fontWeight: on ? 700 : 500, lineHeight: 1.15 }}>{t.emoji} {t.name}</Text>
            </UnstyledButton>
          );
        })}
      </Box>
    </Stack>
  );
}
