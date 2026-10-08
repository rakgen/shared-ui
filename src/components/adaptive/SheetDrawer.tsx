import { Drawer } from "vaul";
import type { DrawerProps } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { useTheme } from "../../themes/useTheme";
import { useLayout } from "./useLayout";

// One sheet for every size, with real gesture physics (vaul): on a phone a bottom sheet you can drag down to dismiss, on
// iPad/Mac a right-hand panel. Same API the pages already use (opened / onClose / title / zIndex / children) so swapping the
// implementation touched no page. The old Mantine `position`, `size` and `styles` props are accepted and ignored.
export function SheetDrawer({ opened, onClose, title, zIndex: z, children }: DrawerProps) {
  const zIndex = typeof z === "number" ? z : 300;
  const C = useTheme();
  const layout = useLayout();
  const phone = layout === "phone";
  return (
    <Drawer.Root open={!!opened} onOpenChange={(o) => { if (!o) onClose(); }} direction={phone ? "bottom" : "right"}>
      <Drawer.Portal>
        <Drawer.Overlay style={{ position: "fixed", inset: 0, zIndex, background: "rgba(10,12,16,0.36)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }} />
        <Drawer.Content
          aria-describedby={undefined}
          style={phone
            ? { position: "fixed", left: 0, right: 0, bottom: 0, zIndex: zIndex + 1, display: "flex", flexDirection: "column", maxHeight: "92dvh", background: C.bgSurface, borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: "0 -10px 44px rgba(0,0,0,0.20)", outline: "none", marginInline: "auto" }
            : { position: "fixed", top: 0, right: 0, bottom: 0, zIndex: zIndex + 1, width: 440, maxWidth: "92vw", display: "flex", flexDirection: "column", background: C.bgSurface, borderTopLeftRadius: 24, borderBottomLeftRadius: 24, boxShadow: "-10px 0 44px rgba(0,0,0,0.20)", outline: "none" }}
        >
          {phone && <Drawer.Handle style={{ margin: "10px auto 2px", width: 40, height: 5, borderRadius: 100, background: C.borderStrong, flex: "0 0 auto" }} />}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: phone ? "6px 20px 8px" : "20px 20px 8px", flex: "0 0 auto" }}>
            <Drawer.Title style={{ flex: 1, margin: 0, fontSize: 18, fontWeight: 700, letterSpacing: "-0.01em", color: C.textPrimary, overflowWrap: "anywhere" }}>{title}</Drawer.Title>
            {!phone && <button onClick={onClose} aria-label="Close" style={{ width: 40, height: 40, border: 0, borderRadius: 100, background: C.bgSubtle, color: C.textSecondary, display: "grid", placeItems: "center", cursor: "pointer" }}><IconX size={18} /></button>}
          </div>
          <div data-vaul-no-drag style={{ flex: "1 1 auto", minHeight: 0, overflowY: "auto", overscrollBehavior: "contain", padding: "4px 20px calc(env(safe-area-inset-bottom) + 24px)" }}>{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
