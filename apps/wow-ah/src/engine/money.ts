export function money(c: number | null | undefined): string {
  if (c == null || !Number.isFinite(c)) return "Unknown";
  const n = Math.round(Math.abs(c)),
    g = Math.floor(n / 10000),
    s = Math.floor((n % 10000) / 100),
    p = n % 100;
  return (
    (c < 0 ? "−" : "") +
    [g ? g + "g" : "", g || s ? s + "s" : "", p || (!g && !s) ? p + "c" : ""]
      .filter(Boolean)
      .join(" ")
  );
}
export function copper(value: string): number | null {
  const s = value.trim().toLowerCase();
  if (!s) return null;
  if (/^\d+$/.test(s)) return Number.isSafeInteger(+s) ? +s : null;
  const re = /(\d+(?:\.\d+)?)\s*([gsc])/g;
  let total = 0,
    last = 0,
    m: RegExpExecArray | null,
    seen = new Set<string>();
  while ((m = re.exec(s))) {
    if (s.slice(last, m.index).trim() || seen.has(m[2])) return null;
    seen.add(m[2]);
    total += +m[1] * { g: 10000, s: 100, c: 1 }[m[2]]!;
    last = re.lastIndex;
  }
  return seen.size &&
    !s.slice(last).trim() &&
    Number.isSafeInteger(Math.round(total))
    ? Math.round(total)
    : null;
}
export const net = (gross: number, cut = 0.05) => gross * (1 - cut);
export const isCopper = (x: unknown): x is number =>
  typeof x === "number" &&
  Number.isSafeInteger(x) &&
  x >= 0 &&
  x <= 1_000_000_000;
