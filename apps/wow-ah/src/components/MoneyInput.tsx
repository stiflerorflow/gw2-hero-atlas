import { useEffect, useRef, useState, useId } from "react";
import { money, copper, isCopper } from "../engine/money";
export function MoneyInput({
  value,
  onChange,
  label,
  allowUnknown = true,
  disabled = false,
}: {
  value: number | null;
  onChange: (n: number | null) => void;
  label: string;
  allowUnknown?: boolean;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null),
    id = useId();
  const [text, setText] = useState(value === null ? "" : money(value));
  const [error, setError] = useState("");
  useEffect(() => {
    if (document.activeElement !== input.current || copper(text) !== value) {
      setText(value === null ? "" : money(value));
      setError("");
      input.current?.setCustomValidity("");
    }
  }, [value]);
  const validate = (text: string) => {
    const n = copper(text);
    return n === null
      ? !allowUnknown || text.trim()
        ? "Use copper, or money such as 1g 12s 20c."
        : ""
      : !isCopper(n)
        ? "Enter no more than 100,000g (1,000,000,000 copper)."
        : "";
  };
  return (
    <label className="field">
      <span id={id + "-label"}>{label}</span>
      <input
        ref={input}
        disabled={disabled}
        value={text}
        placeholder={allowUnknown ? "Unknown · e.g. 12s 50c" : "e.g. 1g 20s"}
        onChange={(e) => {
          const next = e.target.value,
            invalid = validate(next);
          setText(next);
          setError(invalid);
          e.target.setCustomValidity(invalid);
          // Commit valid edits before Enter submits the surrounding form. Preserve the
          // typed representation while focused, rather than reformatting each key.
          if (!invalid) onChange(copper(next));
        }}
        onBlur={(e) => {
          const invalid = validate(text);
          setError(invalid);
          e.target.setCustomValidity(invalid);
          if (!invalid) {
            const n = copper(text);
            onChange(n);
            setText(n === null ? "" : money(n));
          }
        }}
        aria-invalid={!!error}
        aria-labelledby={id + "-label"}
        aria-describedby={id + "-help"}
      />
      <small
        id={id + "-help"}
        role={error ? "alert" : undefined}
        className={error ? "error" : ""}
      >
        {error || "Units: g / s / c. A plain number means copper."}
      </small>
    </label>
  );
}
