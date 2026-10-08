import { useEffect, useRef, useState } from "react";
import { IconRefresh } from "@tabler/icons-react";

// Pull down at the top of the page to refresh — for installed (home-screen) apps, where iOS has no built-in pull-to-refresh.
// Active only in standalone mode (a normal browser tab already has its own); localStorage "pullToRefresh"="always" forces it on (testing).
// onRefresh may return a promise; the spinner stays until it settles. Default = full reload.
const THRESHOLD = 72, MAX = 120;

const standalone = () => {
  try {
    if (localStorage.getItem("pullToRefresh") === "always") return true;
    return window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone === true;
  } catch { return false; }
};
// don't hijack a pull inside a sheet / dialog / menu
const overlayOpen = () => !!document.querySelector('[role="dialog"], .mantine-Popover-dropdown, .mantine-Menu-dropdown, [data-vaul-drawer]');

export function PullToRefresh({ onRefresh }: { onRefresh?: () => void | Promise<void> }) {
  const [pull, setPull] = useState(0);
  const [busy, setBusy] = useState(false);
  const start = useRef<number | null>(null);
  const pullRef = useRef(0);

  useEffect(() => {
    if (!standalone()) return;
    const set = (v: number) => { pullRef.current = v; setPull(v); };
    const onStart = (e: TouchEvent) => {
      start.current = e.touches.length === 1 && window.scrollY <= 0 && !overlayOpen() ? e.touches[0].clientY : null;
    };
    const onMove = (e: TouchEvent) => {
      if (start.current == null) return;
      const dy = e.touches[0].clientY - start.current;
      if (dy <= 0 || window.scrollY > 0) { if (pullRef.current) set(0); return; }
      set(Math.min(MAX, dy * 0.5)); // resistance
    };
    const onEnd = async () => {
      const done = pullRef.current >= THRESHOLD;
      start.current = null;
      if (!done) { set(0); return; }
      setBusy(true); set(THRESHOLD);
      try { await (onRefresh ? onRefresh() : window.location.reload()); } finally { setBusy(false); set(0); }
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart); window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd); window.removeEventListener("touchcancel", onEnd);
    };
  }, [onRefresh]);

  if (pull <= 0 && !busy) return null;
  const ready = pull >= THRESHOLD;
  return (
    <div aria-hidden style={{ position: "fixed", top: "calc(env(safe-area-inset-top) + 8px)", left: 0, right: 0, zIndex: 400, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
      <div style={{
        width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--mantine-color-default, #fff)", border: "1px solid var(--mantine-color-default-border, #ddd)", boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
        color: ready || busy ? "var(--mantine-primary-color-filled)" : "var(--mantine-color-dimmed)",
        transform: `translateY(${Math.max(0, pull - 28)}px) rotate(${busy ? 0 : pull * 3}deg)`, opacity: Math.min(1, pull / 40 + (busy ? 1 : 0)),
        transition: busy || pull === 0 ? "transform 160ms ease, opacity 160ms ease" : "none",
      }}>
        <IconRefresh size={22} style={busy ? { animation: "ptr-spin 0.8s linear infinite" } : undefined} />
      </div>
    </div>
  );
}
