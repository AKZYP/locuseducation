import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'
import { removeEmailSubscriber } from '@/lib/supabase-store'

const schema = z.object({
  email: z.string().email('Invalid email address').max(254),
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const { allowed } = rateLimit(`unsubscribe:${ip}`, 5, 60_000) // 5 requests per minute per IP

  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input.' }, { status: 400 })
  }

  const { email } = parsed.data
  const result = await removeEmailSubscriber(email)

  if (!result.success && !result.notFound) {
    return NextResponse.json({ error: 'Failed to unsubscribe. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true, notFound: result.notFound })
}
