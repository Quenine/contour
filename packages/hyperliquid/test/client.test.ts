import { describe, expect, it, vi } from "vitest";
import { HyperliquidReader, RateLimited } from "../src/index.js";

describe("read-only Info client resilience", () => {
  it("retries a transient rate-limit once and keeps book/info requests uncached", async () => {
    const fetchImplementation = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("busy", { status: 429 }))
      .mockResolvedValueOnce(Response.json({ outcomes: [] }));
    const reader = new HyperliquidReader({ fetchImplementation, timeoutMs: 2_000, metadataCacheMs: 0 });
    await expect(reader.outcomeMarkets()).resolves.toEqual([]);
    expect(fetchImplementation).toHaveBeenCalledTimes(2);
    expect(fetchImplementation.mock.calls[0]?.[1]).toMatchObject({ cache: "no-store", method: "POST" });
  });

  it("does not retry deterministic client errors", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(new Response("invalid", { status: 400 }));
    const reader = new HyperliquidReader({ fetchImplementation });
    await expect(reader.outcomeMarkets()).rejects.toThrow("HTTP 400");
    expect(fetchImplementation).toHaveBeenCalledTimes(1);
  });

  it("coalesces and briefly caches only successful outcome metadata reads", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ outcomes: [] }));
    const reader = new HyperliquidReader({ fetchImplementation, metadataCacheMs: 10_000 });
    await Promise.all([reader.outcomeMarkets(), reader.outcomeMarkets()]);
    await reader.outcomeMarkets();
    expect(fetchImplementation).toHaveBeenCalledTimes(1);
  });

  it("expires metadata at its short TTL and never caches order-book snapshots", async () => {
    vi.useFakeTimers();
    try {
      const fetchImplementation = vi.fn<typeof fetch>()
        .mockResolvedValueOnce(Response.json({ outcomes: [] }))
        .mockResolvedValueOnce(Response.json({ outcomes: [] }))
        .mockResolvedValueOnce(Response.json({ levels: [[], []] }))
        .mockResolvedValueOnce(Response.json({ levels: [[], []] }));
      const reader = new HyperliquidReader({ fetchImplementation, metadataCacheMs: 1_000 });
      await reader.outcomeMarkets();
      vi.advanceTimersByTime(1_001);
      await reader.outcomeMarkets();
      await reader.outcomeOrderBook("17");
      await reader.outcomeOrderBook("17");
      expect(fetchImplementation).toHaveBeenCalledTimes(4);
    } finally { vi.useRealTimers(); }
  });

  it("aborts a hung provider read and surfaces a typed timeout after one retry", async () => {
    vi.useFakeTimers();
    try {
      const fetchImplementation = vi.fn<typeof fetch>((_input, init) => new Promise((_resolve, reject) => {
        init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")), { once: true });
      }));
      const reader = new HyperliquidReader({ fetchImplementation, timeoutMs: 250 });
      const result = expect(reader.outcomeMarkets()).rejects.toThrow("exceeded 250ms");
      await vi.runAllTimersAsync();
      await result;
      expect(fetchImplementation).toHaveBeenCalledTimes(2);
    } finally { vi.useRealTimers(); }
  });

  it("surfaces a typed rate-limit after the single bounded retry", async () => {
    const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(new Response("busy", { status: 429 }));
    const reader = new HyperliquidReader({ fetchImplementation, timeoutMs: 2_000 });
    await expect(reader.outcomeMarkets()).rejects.toBeInstanceOf(RateLimited);
    expect(fetchImplementation).toHaveBeenCalledTimes(2);
  });
});
