import { createClient } from '@/lib/supabase/client'

export type PhotoType = 'OVERVIEW' | 'DETAIL' | 'DAMAGE' | 'MAINTENANCE' | 'DOCUMENT' | 'OTHER'

export interface EquipmentPhotoRecord {
  photo_id: string
  equipment_id: string
  storage_path: string
  file_name: string | null
  file_size_bytes: number | null
  mime_type: string | null
  photo_type: PhotoType
  caption: string | null
  taken_at: string | null
  taken_by: string | null
  sort_order: number
  created_at: string
  public_url?: string
}

export interface UploadPhotoOptions {
  equipmentId: string
  file: File
  photoType?: PhotoType
  caption?: string
  takenBy?: string
  maxDimension?: number
  quality?: number
}

/**
 * Compresses an image file in-browser using HTML Canvas
 * Default: Max 1920px (W or H), JPEG 85%
 */
export async function compressImageFile(
  file: File,
  maxDimension = 1920,
  quality = 0.85
): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    // If it's not an image, reject
    if (!file.type.startsWith('image/')) {
      return reject(new Error('File is not an image'))
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = (event) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to load image'))
      img.onload = () => {
        let { width, height } = img

        // Scale down while preserving aspect ratio
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return reject(new Error('Failed to create canvas context'))
        }

        // Draw image smoothly
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, width, height })
            } else {
              reject(new Error('Canvas compression failed'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      img.src = event.target?.result as string
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Uploads a photo to Supabase Storage and records metadata in equipment_photos table
 */
export async function uploadEquipmentPhoto({
  equipmentId,
  file,
  photoType = 'OVERVIEW',
  caption = '',
  takenBy,
  maxDimension = 1920,
  quality = 0.85
}: UploadPhotoOptions): Promise<EquipmentPhotoRecord> {
  const supabase = createClient()

  // 1. Compress Image
  const { blob, width, height } = await compressImageFile(file, maxDimension, quality)

  // 2. Generate unique storage path: [equipment_id]/[timestamp]_[cleaned_name].jpg
  const timestamp = Date.now()
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.[^/.]+$/, '')
    .slice(0, 50)
  const storagePath = `${equipmentId}/${timestamp}_${sanitizedName}.jpg`

  // 3. Upload to Supabase Storage Bucket
  const { error: uploadError } = await supabase.storage
    .from('equipment-photos')
    .upload(storagePath, blob, {
      contentType: 'image/jpeg',
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    throw new Error(`Upload storage error: ${uploadError.message}`)
  }

  // 4. Get Public URL
  const { data: urlData } = supabase.storage
    .from('equipment-photos')
    .getPublicUrl(storagePath)

  // 5. Insert Record into equipment_photos Table
  const { data: dbData, error: dbError } = await (supabase
    .from('equipment_photos') as any)
    .insert([
      {
        equipment_id: equipmentId,
        storage_path: storagePath,
        file_name: file.name,
        file_size_bytes: blob.size,
        mime_type: 'image/jpeg',
        photo_type: photoType,
        caption: caption.trim() || null,
        taken_by: takenBy || null,
        taken_at: new Date().toISOString()
      }
    ])
    .select('*')
    .single()

  if (dbError || !dbData) {
    // If DB insert fails, cleanup the uploaded storage file
    await supabase.storage.from('equipment-photos').remove([storagePath])
    throw new Error(`Database record error: ${dbError?.message || 'Insert failed'}`)
  }

  return {
    ...(dbData as EquipmentPhotoRecord),
    public_url: urlData.publicUrl
  }
}

/**
 * Fetches all photos for an equipment record with their public URLs
 */
export async function getEquipmentPhotos(equipmentId: string): Promise<EquipmentPhotoRecord[]> {
  const supabase = createClient()

  const { data, error } = await (supabase
    .from('equipment_photos') as any)
    .select('*')
    .eq('equipment_id', equipmentId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching equipment photos:', error)
    return []
  }

  if (!data) return []

  return data.map((item: any) => {
    const { data: urlData } = supabase.storage
      .from('equipment-photos')
      .getPublicUrl(item.storage_path)

    return {
      ...item,
      public_url: urlData.publicUrl
    }
  })
}

/**
 * Deletes a photo from both Supabase Storage and equipment_photos table
 */
export async function deleteEquipmentPhoto(photoId: string, storagePath: string): Promise<boolean> {
  const supabase = createClient()

  // 1. Delete from storage
  await supabase.storage.from('equipment-photos').remove([storagePath])

  // 2. Delete from DB
  const { error } = await (supabase
    .from('equipment_photos') as any)
    .delete()
    .eq('photo_id', photoId)

  if (error) {
    console.error('Error deleting photo record:', error)
    throw new Error(error.message)
  }

  return true
}

/**
 * Updates caption or photo type
 */
export async function updateEquipmentPhoto(
  photoId: string,
  updates: { caption?: string; photo_type?: PhotoType; sort_order?: number }
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await (supabase
    .from('equipment_photos') as any)
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('photo_id', photoId)

  if (error) {
    console.error('Error updating photo record:', error)
    throw new Error(error.message)
  }

  return true
}
