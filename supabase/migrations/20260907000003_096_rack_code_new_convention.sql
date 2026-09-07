-- Migration 096: Implement ADR-008 Rack Code Convention & Backfill Equipment Rack Layer
-- Date: 2026-09-07
-- Author: AN & PE

-- 1. Thêm cột mới (không xóa cột cũ để đảm bảo tương thích ngược)
ALTER TABLE public.racks 
  ADD COLUMN IF NOT EXISTS rack_code_new TEXT,
  ADD COLUMN IF NOT EXISTS zone_code TEXT;

ALTER TABLE public.rack_layers
  ADD COLUMN IF NOT EXISTS layer_code TEXT;

-- 2. Backfill zone_code theo location_in_factory thực tế
UPDATE public.racks SET zone_code = CASE
  WHEN location_in_factory LIKE '%6号機室%'                          THEN 'MR'
  WHEN location_in_factory LIKE '%8号機隣%' 
    OR location_in_factory LIKE '%7号機%'                            THEN 'M8'
  WHEN location_in_factory LIKE '%台湾機%'                           THEN 'TW'
  WHEN location_in_factory LIKE '%事務所前%'                         THEN 'OF'
  WHEN location_in_factory LIKE '%金型部門%' 
    OR location_in_factory LIKE '%ミガキ%' 
    OR location_in_factory LIKE '%試作金型%' 
    OR location_in_factory LIKE '%新規金型%'                         THEN 'MD'
  WHEN location_in_factory LIKE '%タイムカード%'                     THEN 'TC'
  WHEN location_in_factory LIKE '%出入口%' 
    OR location_in_factory LIKE '%入口%'                             THEN 'GT'
  WHEN location_in_factory LIKE '%プレス%'                           THEN 'PS'
  WHEN location_in_factory LIKE '%材料置場%' 
    AND (location_in_factory NOT LIKE '%2F%')                        THEN 'MT'
  WHEN location_in_factory LIKE '%スクラップ%'                       THEN 'SC'
  WHEN location_in_factory LIKE '%2F%' 
    OR location_in_factory LIKE '%ロフト%'                           THEN '2F'
  WHEN location_in_factory LIKE '%ケース%'                           THEN 'CS'
  ELSE 'SP'
END;

-- 3. Backfill rack_code_new = ZONE-NN (số thứ tự trong zone, 2 chữ số)
WITH ranked AS (
  SELECT id, zone_code,
    ROW_NUMBER() OVER (PARTITION BY zone_code ORDER BY rack_name NULLS LAST, id) AS rn
  FROM public.racks
)
UPDATE public.racks r
SET rack_code_new = ranked.zone_code || '-' || LPAD(ranked.rn::TEXT, 2, '0')
FROM ranked WHERE ranked.id = r.id;

-- 4. Backfill layer_code = {rack_code_new}-L{layer_number}
UPDATE public.rack_layers rl
SET layer_code = r.rack_code_new || '-L' || rl.layer_number
FROM public.racks r
WHERE rl.rack_id = r.id
  AND r.rack_code_new IS NOT NULL;

-- 5. Backfill equipment.current_rack_layer_id từ legacy_specs
UPDATE public.equipment e
SET current_rack_layer_id = rl.id
FROM public.rack_layers rl
WHERE e.legacy_specs->>'RackLayerID' = rl.legacy_id
  AND e.current_rack_layer_id IS NULL;

-- 6. Tạo chỉ mục tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_equipment_current_rack_layer_id
  ON public.equipment(current_rack_layer_id);

CREATE INDEX IF NOT EXISTS idx_rack_layers_layer_code
  ON public.rack_layers(layer_code);

CREATE INDEX IF NOT EXISTS idx_racks_zone_code
  ON public.racks(zone_code);

CREATE INDEX IF NOT EXISTS idx_racks_rack_code_new
  ON public.racks(rack_code_new);
