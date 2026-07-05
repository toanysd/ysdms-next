import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import fs from 'fs'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename to avoid overwrites
    const ext = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${ext}`

    // Ensure upload dir exists
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const path = join(uploadDir, uniqueFileName)
    await writeFile(path, buffer)

    return NextResponse.json({
      success: true,
      fileName: file.name,
      filePath: `/uploads/${uniqueFileName}`
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}
