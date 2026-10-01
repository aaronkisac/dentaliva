import { describe, expect, it } from "vitest";

import { createFixedWindowLimiter, type RateLimitEntry } from "../../src/worker/rate-limit";

function newStore(): Map<string, RateLimitEntry> {
  return new Map<string, RateLimitEntry>();
}

describe("createFixedWindowLimiter", () => {
  it("allows the first request and starts a window at count 1", () => {
    const store = newStore();
    const limiter = createFixedWindowLimiter(5, 60_000, store);
    expect(limiter.check("1.2.3.4", 1000)).toBe(true);
    expect(store.get("1.2.3.4")).toEqual({ count: 1, resetAt: 61_000 });
  });

  it("increments on every request in the window and blocks past the limit", () => {
    const limiter = createFixedWindowLimiter(3, 60_000, newStore());
    expect(limiter.check("ip", 1000)).toBe(true);
    expect(limiter.check("ip", 2000)).toBe(true);
    expect(limiter.check("ip", 3000)).toBe(true);
    expect(limiter.check("ip", 4000)).toBe(false);
    expect(limiter.check("ip", 5000)).toBe(false);
  });

  it("tracks keys independently", () => {
    const limiter = createFixedWindowLimiter(1, 60_000, newStore());
    expect(limiter.check("a", 1000)).toBe(true);
    expect(limiter.check("a", 2000)).toBe(false);
    expect(limiter.check("b", 3000)).toBe(true);
  });

  it("resets the count once the window expires", () => {
    const store = newStore();
    const limiter = createFixedWindowLimiter(1, 60_000, store);
    expect(limiter.check("a", 1000)).toBe(true);
    expect(limiter.check("a", 60_999)).toBe(false);
    expect(limiter.check("a", 61_000)).toBe(true);
    expect(store.get("a")).toEqual({ count: 1, resetAt: 121_000 });
  });

  it("keeps the store bounded under key rotation", () => {
    const store = newStore();
    const limiter = createFixedWindowLimiter(5, 60_000, store, 2);
    limiter.check("a", 1000);
    limiter.check("b", 2000);
    limiter.check("c", 3000);
    expect(store.size).toBeLessThanOrEqual(2);
    expect(store.has("c")).toBe(true);
  });

  it("prunes expired windows before resorting to a clear", () => {
    const store = newStore();
    const limiter = createFixedWindowLimiter(5, 60_000, store, 2);
    limiter.check("a", 1000);
    limiter.check("b", 61_500); // a'nın penceresi doldu, b yeni pencere başlattı
    // Üst sınır doldu; c için a'nın bayat penceresi düşer, b'nin canlı penceresi kalır.
    limiter.check("c", 70_000);
    expect(store.has("a")).toBe(false);
    expect(store.has("b")).toBe(true);
    expect(store.has("c")).toBe(true);
  });
});
