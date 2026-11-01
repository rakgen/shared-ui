import { forwardRef, useCallback, useRef, type ReactNode, type Ref } from "react";
import { Autocomplete as MantineAutocomplete, Textarea as MantineTextarea, TextInput as MantineTextInput } from "@mantine/core";
import type { AutocompleteProps, TextareaProps, TextInputProps } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

// House rule (all repos): every text input has a clear (✕) button once it has text. These wrap Mantine's inputs with the same props, so a
// page changes only its import. Clearing goes through the input's own change event, so every existing onChange handler keeps working.
// A page that passes its own rightSection keeps it. Read-only and disabled inputs get no button. Uncontrolled inputs (no `value`) get none.

function clearInput(el: HTMLInputElement | HTMLTextAreaElement | null) {
  if (!el) return;
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, "");
  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.focus();
}

function ClearButton({ onClear }: { onClear: () => void }): ReactNode {
  return (
    <button
      type="button" aria-label="Clear" onClick={onClear}
      onMouseDown={(e) => e.preventDefault()} // keep focus (and the keyboard) in the field
      style={{ width: 44, height: 44, border: 0, background: "transparent", color: "var(--text-tertiary, currentColor)", display: "grid", placeItems: "center", cursor: "pointer", borderRadius: 100 }}
    >
      <IconX size={18} aria-hidden />
    </button>
  );
}

const hasText = (v: unknown) => typeof v === "string" ? v !== "" : typeof v === "number";
const editable = (p: { disabled?: boolean; readOnly?: boolean }) => !p.disabled && !p.readOnly;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(props, ref) {
  const el = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback((node: HTMLInputElement | null) => { el.current = node; if (typeof ref === "function") ref(node); else if (ref) (ref as { current: HTMLInputElement | null }).current = node; }, [ref]);
  const show = props.rightSection === undefined && hasText(props.value) && editable(props);
  return <MantineTextInput {...props} ref={setRef} {...(show ? { rightSection: <ClearButton onClear={() => clearInput(el.current)} />, rightSectionPointerEvents: "all" as const, rightSectionWidth: 48 } : {})} />;
});

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(function Autocomplete(props, ref) {
  const el = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback((node: HTMLInputElement | null) => { el.current = node; if (typeof ref === "function") ref(node); else if (ref) (ref as { current: HTMLInputElement | null }).current = node; }, [ref]);
  const show = props.rightSection === undefined && hasText(props.value) && editable(props);
  return <MantineAutocomplete {...props} ref={setRef} {...(show ? { rightSection: <ClearButton onClear={() => clearInput(el.current)} />, rightSectionPointerEvents: "all" as const, rightSectionWidth: 48 } : {})} />;
});

// Multi-line: the button sits at the top-right corner, where it never covers the text being typed.
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(props, ref: Ref<HTMLTextAreaElement>) {
  const el = useRef<HTMLTextAreaElement | null>(null);
  const setRef = useCallback((node: HTMLTextAreaElement | null) => { el.current = node; if (typeof ref === "function") ref(node); else if (ref) (ref as { current: HTMLTextAreaElement | null }).current = node; }, [ref]);
  const show = props.rightSection === undefined && hasText(props.value) && editable(props);
  return (
    <MantineTextarea
      {...props} ref={setRef}
      {...(show ? { rightSection: <ClearButton onClear={() => clearInput(el.current)} />, rightSectionPointerEvents: "all" as const, rightSectionWidth: 48, styles: { ...(props.styles as object), section: { alignItems: "flex-start" } } } : {})}
    />
  );
});
