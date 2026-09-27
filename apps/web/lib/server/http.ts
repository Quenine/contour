const API_HEADERS = { "cache-control": "no-store, max-age=0", "x-content-type-options": "nosniff" } as const;
export const apiJson = (body: unknown, init: ResponseInit = {}): Response => Response.json(body, { ...init, headers: { ...API_HEADERS, ...init.headers } });

interface RateWindow { count: number; readonly resetsAt: number; }
const rateWindows = new Map<string, RateWindow>();
const MAX_RATE_WINDOWS = 4_096;

/** Best-effort per-instance guard; put coordinated limits at the CDN/edge for high traffic. */
export function limitPublicRequest(request: Request, scope: string, maximum: number, windowMs: number, nowMs = Date.now()): Response | undefined {
  const forwarded = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",").at(-1)?.trim() ?? "unknown";
  const client = /^[0-9a-fA-F:.]{1,64}$/.test(forwarded) ? forwarded : "unknown";
  let key = `${scope}:${client}`;
  if (rateWindows.size >= MAX_RATE_WINDOWS && !rateWindows.has(key)) {
    for (const [entryKey, entry] of rateWindows) if (entry.resetsAt <= nowMs) rateWindows.delete(entryKey);
    if (rateWindows.size >= MAX_RATE_WINDOWS && !rateWindows.has(key)) key = `${scope}:overflow`;
  }
  const current = rateWindows.get(key);
  if (!current || current.resetsAt <= nowMs) { rateWindows.set(key, { count: 1, resetsAt: nowMs + windowMs }); return undefined; }
  if (current.count < maximum) { current.count += 1; return undefined; }
  const retryAfter = Math.max(1, Math.ceil((current.resetsAt - nowMs) / 1000));
  return apiJson({ error: "Too many requests. Please wait before trying again." }, { status: 429, headers: { "retry-after": String(retryAfter) } });
}

export async function readJsonBounded(request: Request, maximumBytes = 16 * 1024): Promise<unknown> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json") throw new Error("content-type must be application/json");
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) throw new Error("request body is too large");
  if (!request.body) throw new Error("request body is required");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) { await reader.cancel(); throw new Error("request body is too large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(concat(chunks, total))) as unknown; }
  catch { throw new Error("request body must be valid JSON"); }
}

function concat(chunks: readonly Uint8Array[], total: number): Uint8Array {
  const result = new Uint8Array(total); let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.byteLength; }
  return result;
}
