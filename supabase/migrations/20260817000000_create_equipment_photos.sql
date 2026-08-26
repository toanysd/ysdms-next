-- Migration: 20260817000000_create_equipment_photos.sql
-- Description: Create equipment_photos table and equipment-photos storage bucket for Unified Equipment

-- 1. Create table equipment_photos
CREATE TABLE IF NOT EXISTS equipment_photos (
    photo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID REFERENCES equipment(equipment_id) ON DELETE CASCADE NOT NULL,
    storage_path TEXT NOT NULL,
    file_name TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT DEFAULT 'image/jpeg',
    photo_type TEXT DEFAULT 'OVERVIEW', -- 'OVERVIEW', 'DETAIL', 'DAMAGE', 'MAINTENANCE', 'DOCUMENT', 'OTHER'
    caption TEXT,
    taken_at TIMESTAMPTZ DEFAULT now(),
    taken_by UUID REFERENCES employees(employee_id),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Indices for performance
CREATE INDEX IF NOT EXISTS idx_equipment_photos_equipment_id ON equipment_photos(equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipment_photos_photo_type ON equipment_photos(photo_type);
CREATE INDEX IF NOT EXISTS idx_equipment_photos_created_at ON equipment_photos(created_at DESC);

-- 3. Enable RLS
ALTER TABLE equipment_photos ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
DROP POLICY IF EXISTS "equipment_photos_select" ON equipment_photos;
CREATE POLICY "equipment_photos_select" ON equipment_photos FOR SELECT USING (true);

DROP POLICY IF EXISTS "equipment_photos_insert" ON equipment_photos;
CREATE POLICY "equipment_photos_insert" ON equipment_photos FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "equipment_photos_update" ON equipment_photos;
CREATE POLICY "equipment_photos_update" ON equipment_photos FOR UPDATE USING (true);

DROP POLICY IF EXISTS "equipment_photos_delete" ON equipment_photos;
CREATE POLICY "equipment_photos_delete" ON equipment_photos FOR DELETE USING (true);

-- 5. Storage bucket setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'equipment-photos',
    'equipment-photos',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/jpg'];

-- 6. Storage Object Policies
DROP POLICY IF EXISTS "equipment_photos_storage_select" ON storage.objects;
CREATE POLICY "equipment_photos_storage_select" ON storage.objects
    FOR SELECT USING (bucket_id = 'equipment-photos');

DROP POLICY IF EXISTS "equipment_photos_storage_insert" ON storage.objects;
CREATE POLICY "equipment_photos_storage_insert" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'equipment-photos');

DROP POLICY IF EXISTS "equipment_photos_storage_update" ON storage.objects;
CREATE POLICY "equipment_photos_storage_update" ON storage.objects
    FOR UPDATE USING (bucket_id = 'equipment-photos');

DROP POLICY IF EXISTS "equipment_photos_storage_delete" ON storage.objects;
CREATE POLICY "equipment_photos_storage_delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'equipment-photos');
