import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ─── Security Constants ───────────────────────────────────────────
const ALLOWED_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'pdf', 'step', 'stp', 'dxf', 'csv', 'xlsx'])
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
const UPLOAD_BUCKET = 'uploads'

export async function POST(request: Request) {
  try {
    // ─── 1. Authenticate user ───────────────────────────────────
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }

    // ─── 2. Parse form data ─────────────────────────────────────
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      )
    }

    // ─── 3. Validate file size ──────────────────────────────────
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, message: `File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // ─── 4. Validate file extension ─────────────────────────────
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { success: false, message: `File type ".${ext}" is not allowed. Allowed: ${[...ALLOWED_EXTENSIONS].join(', ')}` },
        { status: 400 }
      )
    }

    // ─── 5. Validate MIME type (basic check) ────────────────────
    const ALLOWED_MIME_PREFIXES = ['image/', 'application/pdf', 'application/vnd', 'text/csv', 'application/octet-stream']
    const mimeOk = ALLOWED_MIME_PREFIXES.some(prefix => file.type.startsWith(prefix))
    if (!mimeOk && file.type !== '') {
      return NextResponse.json(
        { success: false, message: `MIME type "${file.type}" is not allowed` },
        { status: 400 }
      )
    }

    // ─── 6. Upload to Supabase Storage ──────────────────────────
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const uniqueFileName = `${timestamp}_${crypto.randomUUID()}.${ext}`
    const storagePath = `${user.id}/${uniqueFileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(UPLOAD_BUCKET)
      .upload(storagePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError)
      return NextResponse.json(
        { success: false, message: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // ─── 7. Generate signed URL (1 hour expiry) ─────────────────
    const { data: signedUrlData } = await supabase.storage
      .from(UPLOAD_BUCKET)
      .createSignedUrl(storagePath, 3600)

    return NextResponse.json({
      success: true,
      fileName: file.name,
      storagePath: uploadData.path,
      signedUrl: signedUrlData?.signedUrl || null,
    })
  } catch (error: unknown) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
