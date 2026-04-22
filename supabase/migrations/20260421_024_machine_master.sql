-- ============================================================
-- MIGRATION 024: MACHINE MASTER — 3-layer architecture
-- machine_type → machine_model → machine_instance
-- ============================================================

-- BẢNG 1: MACHINE TYPE 
CREATE TABLE IF NOT EXISTS public.machine_type (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text NOT NULL UNIQUE,   -- 'THERMOFORM' | 'CNC' | 'PRESS' | 'GRINDER'
  name_vi       text NOT NULL,          -- 'Máy định hình nhiệt'
  name_jp       text,                   -- '成形機'
  description   text,
  spec_schema   jsonb,                  -- { "fields": [{key, label_vi, label_jp, unit, type}] }
  is_active     boolean DEFAULT true,
  sort_order    integer DEFAULT 99,
  created_at    timestamptz DEFAULT now()
);

COMMENT ON COLUMN public.machine_type.spec_schema IS
  'Mô tả schema thông số kỹ thuật cho loại máy này. Nhãn song ngữ.';

-- BẢNG 2: MACHINE MODEL 
CREATE TABLE IF NOT EXISTS public.machine_model (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_type_id uuid NOT NULL REFERENCES public.machine_type(id),
  manufacturer    text,                 -- 'ILLIG', 'Fanuc', 'AIDA'
  model_code      text NOT NULL,        -- 'RV74c', 'UA100G', 'NC1-110'
  model_name      text,                 -- tên đầy đủ
  specs           jsonb NOT NULL DEFAULT '{}',
  notes           text,
  is_active       boolean DEFAULT true,
  created_at      timestamptz DEFAULT now(),
  UNIQUE (machine_type_id, model_code)
);

-- BẢNG 3: MACHINE INSTANCE 
CREATE TABLE IF NOT EXISTS public.machine_instance (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_model_id  uuid NOT NULL REFERENCES public.machine_model(id),
  internal_code     text NOT NULL UNIQUE,  -- 'ILLIG-01', 'CNC-03'
  name              text NOT NULL,         -- 'Máy ILLIG số 1'
  location          text,                  -- 'Xưởng A - Line 2'
  serial_number     text,
  year_manufactured integer,
  status            text DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'retired')),
  specs_override    jsonb DEFAULT '{}',
  notes             text,
  created_at        timestamptz DEFAULT now()
);

-- VIEW: Thông số hiệu lực
CREATE OR REPLACE VIEW public.v_machine_effective_specs AS
SELECT
  mi.id               AS instance_id,
  mi.internal_code,
  mi.name             AS machine_name,
  mi.status,
  mi.location,
  mm.model_code,
  mm.manufacturer,
  mt.code             AS type_code,
  mt.name_vi          AS type_name,
  mt.name_jp          AS type_name_jp,
  mt.spec_schema,
  -- Merge: model specs + instance overrides (instance wins)
  mm.specs || COALESCE(mi.specs_override, '{}'::jsonb) AS effective_specs
FROM public.machine_instance mi
JOIN public.machine_model   mm ON mm.id = mi.machine_model_id
JOIN public.machine_type    mt ON mt.id = mm.machine_type_id;

-- BẢNG 4: MACHINE COMPATIBILITY
CREATE TABLE IF NOT EXISTS public.machine_tray_compatibility (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_instance_id uuid NOT NULL REFERENCES public.machine_instance(id),
  product_id          uuid REFERENCES public.product_master(id),
  is_compatible       boolean DEFAULT true,
  compatibility_notes text,    -- 'Chỉ chạy được khi dùng khuôn B-series'
  created_at          timestamptz DEFAULT now()
);

-- INDEXES 
CREATE INDEX IF NOT EXISTS idx_machine_model_type   ON public.machine_model(machine_type_id);
CREATE INDEX IF NOT EXISTS idx_machine_inst_model   ON public.machine_instance(machine_model_id);
CREATE INDEX IF NOT EXISTS idx_machine_compat_inst  ON public.machine_tray_compatibility(machine_instance_id);
CREATE INDEX IF NOT EXISTS idx_machine_compat_prod  ON public.machine_tray_compatibility(product_id);


-- ============================================================
-- SEED DATA: CÁC DÒNG MÁY CƠ BẢN
-- ============================================================
INSERT INTO public.machine_type (code, name_vi, name_jp, spec_schema) VALUES
('THERMOFORM', 'Máy định hình nhiệt', '成形機', '{
  "fields": [
    {"key": "max_sheet_width_mm",     "label_vi": "Khổ nhựa tối đa",          "label_jp": "最大シート幅", "unit": "mm",      "type": "number"},
    {"key": "min_sheet_width_mm",     "label_vi": "Khổ nhựa tối thiểu",       "label_jp": "最小シート幅", "unit": "mm",      "type": "number"},
    {"key": "max_sheet_thickness_mm", "label_vi": "Độ dày nhựa tối đa",       "label_jp": "最大シート厚み", "unit": "mm",      "type": "number"},
    {"key": "forming_area_mm",        "label_vi": "Vùng tạo hình (LxW)",      "label_jp": "成形エリア", "unit": "mm",      "type": "text"},
    {"key": "cycles_per_min_max",     "label_vi": "Tốc độ tối đa",            "label_jp": "最大速度", "unit": "cycle/min","type": "number"},
    {"key": "vacuum_forming",         "label_vi": "Hút chân không",           "label_jp": "真空成形", "unit": null,      "type": "boolean"},
    {"key": "pressure_forming",       "label_vi": "Chân không + khí nén",     "label_jp": "圧空成形", "unit": null,      "type": "boolean"},
    {"key": "heater_zones",           "label_vi": "Số vùng gia nhiệt",        "label_jp": "ヒーターゾーン", "unit": "vùng",    "type": "number"},
    {"key": "mold_cooling",           "label_vi": "Làm mát khuôn",            "label_jp": "金型冷却", "unit": null,      "type": "text"},
    {"key": "mold_temp_max_c",        "label_vi": "Nhiệt khuôn tối đa",       "label_jp": "最大金型温度", "unit": "°C",      "type": "number"},
    {"key": "compatible_materials",   "label_vi": "Vật liệu tương thích",     "label_jp": "対応材料", "unit": null,      "type": "array"}
  ]
}'),

('CNC_MILLING', 'Máy phay CNC', 'CNC加工機', '{
  "fields": [
    {"key": "table_size_mm",          "label_vi": "Kích thước bàn (LxW)",     "label_jp": "テーブルサイズ", "unit": "mm",      "type": "text"},
    {"key": "axis_count",             "label_vi": "Số trục",                  "label_jp": "軸数", "unit": "trục",    "type": "number"}
  ]
}'),

('PRESS', 'Máy dập', 'プレス機', '{
  "fields": [
    {"key": "press_force_ton",        "label_vi": "Lực dập tối đa",           "label_jp": "最大プレス力", "unit": "tấn",     "type": "number"},
    {"key": "stroke_mm",              "label_vi": "Hành trình",               "label_jp": "ストローク", "unit": "mm",      "type": "number"}
  ]
}'),

('PLASTIC_GRINDER', 'Máy xay nhựa', 'プラスチック粉砕機', '{
  "fields": [
    {"key": "motor_power_kw",         "label_vi": "Công suất motor",          "label_jp": "モーター出力", "unit": "kW",      "type": "number"},
    {"key": "output_kg_per_hr",       "label_vi": "Năng suất",                "label_jp": "生産能力", "unit": "kg/h",    "type": "number"}
  ]
}');

INSERT INTO public.machine_model (machine_type_id, manufacturer, model_code, model_name, specs)
SELECT mt.id, 'ILLIG', 'RV74c', 'ILLIG RV 74c Thermoforming Machine', '{
    "max_sheet_width_mm":     740,
    "min_sheet_width_mm":     150,
    "max_sheet_thickness_mm": 6,
    "forming_area_mm":        "680 x 450",
    "cycles_per_min_max":     30,
    "vacuum_forming":         true,
    "pressure_forming":       true,
    "heater_zones":           12,
    "mold_cooling":           "water",
    "mold_temp_max_c":        50,
    "compatible_materials":   ["PP", "PS", "PET", "ABS", "PVC", "HIPS"]
  }'
FROM public.machine_type mt WHERE mt.code = 'THERMOFORM';
