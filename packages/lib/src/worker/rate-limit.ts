/**
 * Isolate-local fixed-window rate limiter for environments without the
 * Cloudflare rate-limit binding (local dev, e2e, binding-less deploys).
 * Enforcement normally comes from the RATE_LIMITER binding; this fallback only
 * keeps a binding-less deployment from being fully open — per-isolate by nature.
 */

export interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitStore {
  get(key: string): RateLimitEntry | undefined;
  set(key: string, entry: RateLimitEntry): void;
  delete(key: string): void;
  clear(): void;
  entries(): IterableIterator<[string, RateLimitEntry]>;
  readonly size: number;
}

export interface FixedWindowLimiter {
  /** True when the key is still under the limit for the current window. */
  check(key: string, now?: number): boolean;
}

const DEFAULT_MAX_KEYS = 10_000;

export function createFixedWindowLimiter(
  limit: number,
  windowMs: number,
  store: RateLimitStore = new Map<string, RateLimitEntry>(),
  maxKeys: number = DEFAULT_MAX_KEYS,
): FixedWindowLimiter {
  return {
    check(key, now = Date.now()) {
      const entry = store.get(key);
      if (entry && now < entry.resetAt) {
        const count = entry.count + 1;
        store.set(key, { count, resetAt: entry.resetAt });
        return count <= limit;
      }
      if (store.size >= maxKeys) {
        // Bellek üst sınırı: önce bayat pencereleri boşalt; hâlâ doluysa (IP
        // rotasyonlu flood) sayacı sıfırla — fallback en iyi çabadır, garantisi
        // bellek sınırıdır.
        for (const [existingKey, existing] of store.entries()) {
          if (now >= existing.resetAt) store.delete(existingKey);
        }
        if (store.size >= maxKeys) store.clear();
      }
      store.set(key, { count: 1, resetAt: now + windowMs });
      return true;
    },
  };
}
