# shared-ui

Themes, Comfort (readability) settings, adaptive layout kit, icons and fonts shared by **akfgen-tools** and **prime-tools**.

```
src/themes      theme specs + token builder (themes.ts), prefs store, ThemeSync, useTheme
src/components  Screen, SheetDrawer, Hero, CountUp, ThemePicker, ComfortPicker, SettingsMenu
src/icons       BrandIcon
src/fonts       font imports
src/styles      base.css (aurora background, press effect, glass popovers, Comfort rules)
scripts         check-contrast.mjs — build gate: every theme × contrast × scheme must pass its WCAG floor
```

## Use
```
npm i github:rakgen/shared-ui        # peers: react, @mantine/core, @mantine/hooks, @tabler/icons-react, motion, vaul
```
```ts
import "shared-ui/styles.css";
import { ThemeSync, SettingsMenu, useTheme } from "shared-ui";
```
Render `<ThemeSync />` once inside `MantineProvider`; put `<SettingsMenu />` in the header.
Add `node node_modules/shared-ui/scripts/check-contrast.mjs` to the app's build.

## Rules
- A new theme must pass `check:contrast`. Readability is a hard floor: text must stay legible in every light, at every contrast level.
- Source is shipped as TypeScript; the consuming app's Vite compiles it.
- Changing a theme here changes both apps — bump and re-install deliberately.
