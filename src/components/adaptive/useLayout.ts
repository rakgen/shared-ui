import { useMediaQuery } from "@mantine/hooks";

// The one definition of "how wide is this screen" for the whole app, so no page invents its own breakpoint.
//   phone   < 768px          one column, bottom sheets, thumb-zone actions        (iPhone, iPad portrait stays 'tablet')
//   tablet  768 – 1099px     one comfortable column (~680px), side panels         (iPad portrait, small windows)
//   desktop ≥ 1100px         two columns, side panels                             (iPad landscape, Mac)
export type Layout = "phone" | "tablet" | "desktop";
export function useLayout(): Layout {
  const phone = useMediaQuery("(max-width: 47.99em)", false, { getInitialValueInEffect: false });
  const desktop = useMediaQuery("(min-width: 68.75em)", false, { getInitialValueInEffect: false });
  return phone ? "phone" : desktop ? "desktop" : "tablet";
}
