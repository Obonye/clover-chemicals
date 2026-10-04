/**
 * Sliding-window rate limit: at most `limit` hits per key within any
 * `windowMs` span, tracked as a log of timestamps.
 *
 * v1 limitation: the log lives in this server process's memory. It resets on
 * every deploy/restart and isn't shared between serverless instances, so on
 * Vercel the effective limit is "per warm instance". That's enough to blunt a
 * casual flood; move it to Upstash / Vercel KV if real abuse shows up.
 */
const hits = new Map<string, number[]>();

export const RFQ_RATE_LIMIT = 5;
export const RFQ_RATE_WINDOW_MS = 60 * 60 * 1000;

export type RateLimitResult = { ok: true } | { ok: false; retryAfterMs: number };

export function checkRateLimit(
  key: string,
  { limit = RFQ_RATE_LIMIT, windowMs = RFQ_RATE_WINDOW_MS, now = Date.now() } = {},
): RateLimitResult {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);

    return { ok: false, retryAfterMs: windowMs - (now - recent[0]) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Keep the map from growing forever on a long-lived instance.
  if (hits.size > 5_000) {
    for (const [k, times] of Array.from(hits)) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }

  return { ok: true };
}
