import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/rate-limit'

const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { allowed } = rateLimit(`upload:${ip}`, 5, 3600000)
  if (!allowed) return NextResponse.json({ error: 'Too many uploads. Try again later.' }, { status: 429 })

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  const subject = formData.get('subject') as string | null

  if (!file || !subject) return NextResponse.json({ error: 'Missing file or subject' }, { status: 400 })
  if (!['Methods', 'Specialist'].includes(subject)) return NextResponse.json({ error: 'Invalid subject' }, { status: 400 })
  if (file.type !== 'application/pdf') return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 })
  if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 5 MB)' }, { status: 400 })

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80)
  const path = `${Date.now()}-${safeName}`

  const bytes = await file.arrayBuffer()
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('question-uploads')
    .upload(path, bytes, { contentType: 'application/pdf', upsert: false })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }

  const { data: urlData } = supabase.storage
    .from('question-uploads')
    .getPublicUrl(uploadData.path)

  const { error: dbError } = await supabase
    .from('question_submissions')
    .insert({ file_url: urlData.publicUrl, file_name: file.name, subject, status: 'pending' })

  if (dbError) {
    console.error('DB insert error:', dbError)
    return NextResponse.json({ error: 'Could not save submission' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
