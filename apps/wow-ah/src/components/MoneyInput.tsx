import { useEffect, useState } from "react";
import { money, copper } from "../engine/money";
export function MoneyInput({
  value,
  onChange,
  label,
  allowUnknown = true,
}: {
  value: number | null;
  onChange: (n: number | null) => void;
  label: string;
  allowUnknown?: boolean;
}) {
  const [text, setText] = useState(value === null ? "" : money(value)),
    [error, setError] = useState("");
  useEffect(() => {
    setText(value === null ? "" : money(value));
  }, [value]);
  return (
    <label className="field">
      {label}
      <input
        value={text}
        placeholder={allowUnknown ? "Unknown · e.g. 12s 50c" : "e.g. 2g 50s"}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
        }}
        onBlur={() => {
          const n = copper(text);
          if (n === null && (!allowUnknown || text.trim())) {
            setError("Use copper, or money such as 1g 12s 20c.");
            return;
          }
          onChange(n);
        }}
        aria-invalid={!!error}
      />
      <small className={error ? "error" : ""}>
        {error || "Units: g / s / c. A plain number means copper."}
      </small>
    </label>
  );
}
