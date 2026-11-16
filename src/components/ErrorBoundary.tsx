import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { fs } from "../tokens";

// A render error must never leave a blank white page. This shows a plain message, the error text and a Reload button.
// Mount one at the app root and one around the routed page (so the sidebar / dock survive a page crash); give the page one
// `resetKey={pathname}` so moving to another page clears the error.
//
// It is deliberately self-contained: the colours come from CSS variables that ThemeSync / Mantine set on <html> (so it follows
// the chosen theme, light and dark), with system colours as the fallback when it renders before or outside the providers.
// No hooks, no Mantine components: the thing that crashed may be the theme itself.
type Props = { children: ReactNode; resetKey?: unknown; title?: string };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: unknown): State {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div role="alert" style={{
        margin: "16px auto", maxWidth: 560, padding: 24, borderRadius: 22, boxSizing: "border-box",
        background: "var(--surface, Canvas)", color: "var(--mantine-color-text, CanvasText)",
        border: "1px solid var(--glass-border, currentColor)", fontFamily: "inherit",
      }}>
        <div style={{ fontSize: fs.xl, fontWeight: 700, lineHeight: 1.2 }}>{this.props.title ?? "Something went wrong"}</div>
        <p style={{ fontSize: fs.md, lineHeight: 1.45, margin: "8px 0 16px" }}>This page could not be shown. Reloading usually fixes it; if it keeps happening, tell whoever looks after this app what you were doing.</p>
        <pre style={{ fontSize: fs.xs, lineHeight: 1.4, margin: "0 0 16px", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid var(--glass-border, currentColor)", color: "inherit", background: "transparent", fontFamily: "ui-monospace, Menlo, monospace" }}>{error.message || String(error)}</pre>
        <button type="button" onClick={() => window.location.reload()}
          style={{ minHeight: 48, padding: "0 24px", borderRadius: 999, fontSize: fs.md, fontWeight: 700, fontFamily: "inherit", cursor: "pointer", color: "inherit", background: "transparent", border: "2px solid currentColor" }}>
          Reload
        </button>
      </div>
    );
  }
}
