# shared-ui

Themes, Comfort (readability) settings, adaptive layout kit, icons and fonts shared by **akfgen-tools** and **prime-tools**.

```
src/themes      theme specs + token builder (themes.ts), prefs store, ThemeSync, useTheme
src/components  Screen, SheetDrawer, Dock (sliding-pill bottom bar), Hero, CountUp, ThemePicker, ComfortPicker, SettingsMenu
src/icons       BrandIcon
src/fonts       font imports
src/styles      base.css (aurora background, press effect, glass popovers, Comfort rules)
scripts         check-contrast.mjs — build gate: every theme × contrast × scheme must pass its WCAG floor
```

## Use
The repo is public (Netlify must be able to install it); keep personal details out of it.
```
npm i git+https://github.com/rakgen/shared-ui.git   # peers: react, @mantine/core, @mantine/hooks, @tabler/icons-react, motion, vaul
```
npm rewrites the lockfile entry to `git+ssh://` — change it back to `git+https://` or CI (Netlify) cannot install. A plain `npm update` does not move a git dependency; `npm uninstall shared-ui` then install again.
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

## Host-app options
- `configureThemes({ defaultId, defaultContrast })` — call once before first render; what a brand-new visitor sees (prime-tools: `heritage`, `standard`).
- `<ThemeSync effects={false} />` — keep a theme's colours but drop aurora, glass and see-through surfaces (prime-tools).
- `Heritage` is a *flat* theme: no effects, and the host app's own page/text colours are left alone at Standard contrast.
- `<Dock items activeKey floating opaque />` — phone bottom bar; `opaque` (default) = solid surface, `opaque={false}` = frosted glass; `floating={false}` = flush to the bottom edge.
