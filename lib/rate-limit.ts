// In-memory rate limiter — good enough for Vercel serverless (per instance)
// Prevents simple abuse; for distributed rate limiting, swap Map for Redis (Upstash)

interface Entry {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}
