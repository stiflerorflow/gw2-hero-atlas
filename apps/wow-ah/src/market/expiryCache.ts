export type CachedValue<T> = { data: T; expires: number };

/** Memory-only provider cache. Expiry removes payloads even when nobody reads again. */
export class ExpiryCache<T> {
  private values = new Map<string, CachedValue<T>>();
  private timers = new Map<string, ReturnType<typeof setTimeout>>();
  constructor(private maximum = 500) {}
  get size() {
    return this.values.size;
  }
  get(key: string): CachedValue<T> | undefined {
    const value = this.values.get(key);
    if (value && value.expires <= Date.now()) {
      this.delete(key);
      return;
    }
    return value;
  }
  set(key: string, value: CachedValue<T>) {
    this.delete(key);
    if (!Number.isFinite(value.expires) || value.expires <= Date.now()) return;
    this.values.set(key, value);
    const timer = setTimeout(
      () => {
        if (this.values.get(key) === value) this.delete(key);
      },
      Math.max(0, value.expires - Date.now()),
    );
    // Node's test runner should not be kept alive by a browser cache deadline.
    if (typeof timer === "object" && "unref" in timer) timer.unref();
    this.timers.set(key, timer);
    while (this.values.size > this.maximum)
      this.delete(this.values.keys().next().value!);
  }
  delete(key: string) {
    const timer = this.timers.get(key);
    if (timer !== undefined) clearTimeout(timer);
    this.timers.delete(key);
    this.values.delete(key);
  }
  clear() {
    for (const key of this.values.keys()) this.delete(key);
  }
}
