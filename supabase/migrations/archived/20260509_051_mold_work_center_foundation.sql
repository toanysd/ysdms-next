-- =================================================================================
-- Migration 051: Phase 5 — Mold Work Center Foundation
-- Purpose: Full schema for mold lifecycle management (Check-in, Teflon, Relocate, Ship)
-- Prerequisite: None (self-contained, includes racks table creation)
-- =================================================================================

-- ═══════════════════════════════════════════════════════
-- PHẦN 0: PREREQUISITE PATCHES
-- ═══════════════════════════════════════════════════════

-- 0A. Create racks table (Giá kệ — cha của rack_layers)
CREATE TABLE IF NOT EXISTS public.racks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.racks ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.racks TO authenticated;
CREATE POLICY "auth_full_racks" ON public.racks FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 0B. Patch rack_layers — thêm rack_id FK + metadata
ALTER TABLE public.rack_layers
  ADD COLUMN IF NOT EXISTS rack_id UUID REFERENCES public.racks(id),
  ADD COLUMN IF NOT EXISTS layer_index INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS label TEXT;

-- ═══════════════════════════════════════════════════════
-- PHẦN A: BỔ SUNG CỘT CHO BẢNG ĐÃ CÓ
-- ═══════════════════════════════════════════════════════

-- A1. mold_physical — Identity, Technical, Status Tracking
ALTER TABLE public.mold_physical
  ADD COLUMN IF NOT EXISTS serial_no TEXT,
  ADD COLUMN IF NOT EXISTS material TEXT,
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC,
  ADD COLUMN IF NOT EXISTS maker_company_id UUID REFERENCES public.companies(id),
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id),
  ADD COLUMN IF NOT EXISTS teflon_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_teflon_date DATE,
  ADD COLUMN IF NOT EXISTS checkin_status TEXT DEFAULT 'IN',
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- A2. mold_design_revision — Drawing No
ALTER TABLE public.mold_design_revision
  ADD COLUMN IF NOT EXISTS drawing_no TEXT;

-- ═══════════════════════════════════════════════════════
-- PHẦN B: BẢNG MASTER DATA MỚI
-- ═══════════════════════════════════════════════════════

-- B1. employees — Nhân viên
CREATE TABLE IF NOT EXISTS public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_short TEXT,
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B2. destinations — Điểm đến xuất/nhập kho
CREATE TABLE IF NOT EXISTS public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- PHẦN C: BẢNG TRANSACTION LOG MỚI
-- ═══════════════════════════════════════════════════════

-- C1. mold_status_logs — Nhật ký IN/OUT/AUDIT
CREATE TABLE IF NOT EXISTS public.mold_status_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mold_physical_id UUID NOT NULL REFERENCES public.mold_physical(id),
  status TEXT NOT NULL CHECK (status IN ('IN','OUT','AUDIT')),
  employee_id UUID REFERENCES public.employees(id),
  destination_id UUID REFERENCES public.destinations(id),
  notes TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- C2. mold_teflon_logs — Quy trình mạ Teflon (State Machine 4 pha)
-- Status: PENDING → APPROVED → SENT → RECEIVED → (hoặc CANCELLED)
CREATE TABLE IF NOT EXISTS public.mold_teflon_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mold_physical_id UUID NOT NULL REFERENCES public.mold_physical(id),
  status TEXT NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING','APPROVED','SENT','RECEIVED','CANCELLED')),
  coating_type TEXT,
  reason TEXT,
  supplier_id UUID REFERENCES public.companies(id),
  -- Phase 1: Request
  requested_by UUID REFERENCES public.employees(id),
  requested_date DATE,
  -- Phase 2: Approve  
  approved_by UUID REFERENCES public.employees(id),
  approved_date DATE,
  -- Phase 3: Send
  sent_by UUID REFERENCES public.employees(id),
  sent_date DATE,
  expected_return_date DATE,
  -- Phase 4: Receive
  received_date DATE,
  cost_jpy NUMERIC,
  quality_note TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- C3. mold_location_logs — Nhật ký đổi vị trí Rack
CREATE TABLE IF NOT EXISTS public.mold_location_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mold_physical_id UUID NOT NULL REFERENCES public.mold_physical(id),
  from_rack_layer_id UUID REFERENCES public.rack_layers(id),
  to_rack_layer_id UUID NOT NULL REFERENCES public.rack_layers(id),
  moved_by UUID REFERENCES public.employees(id),
  moved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- C4. mold_ship_logs — Nhật ký xuất khuôn đi khách
CREATE TABLE IF NOT EXISTS public.mold_ship_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mold_physical_id UUID NOT NULL REFERENCES public.mold_physical(id),
  direction TEXT NOT NULL CHECK (direction IN ('SHIP_OUT','RETURN')),
  company_id UUID REFERENCES public.companies(id),
  handler_id UUID REFERENCES public.employees(id),
  ship_date DATE NOT NULL DEFAULT CURRENT_DATE,
  return_date DATE,
  item_type_id UUID REFERENCES public.item_types(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- C5. mold_comments — Ghi chú người dùng
CREATE TABLE IF NOT EXISTS public.mold_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mold_physical_id UUID NOT NULL REFERENCES public.mold_physical(id),
  author_id UUID REFERENCES public.employees(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- PHẦN D: INDEXES (Performance-critical cho timeline queries)
-- ═══════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_mold_status_logs_physical 
  ON public.mold_status_logs(mold_physical_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_mold_teflon_logs_physical 
  ON public.mold_teflon_logs(mold_physical_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mold_location_logs_physical 
  ON public.mold_location_logs(mold_physical_id, moved_at DESC);
CREATE INDEX IF NOT EXISTS idx_mold_ship_logs_physical 
  ON public.mold_ship_logs(mold_physical_id, ship_date DESC);
CREATE INDEX IF NOT EXISTS idx_mold_comments_physical 
  ON public.mold_comments(mold_physical_id, created_at DESC);

-- ═══════════════════════════════════════════════════════
-- PHẦN E: RLS + POLICIES + GRANTS
-- ═══════════════════════════════════════════════════════

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_teflon_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_location_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_ship_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mold_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_full_employees" ON public.employees 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_full_destinations" ON public.destinations 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_full_mold_status_logs" ON public.mold_status_logs 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_full_mold_teflon_logs" ON public.mold_teflon_logs 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_full_mold_location_logs" ON public.mold_location_logs 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_full_mold_ship_logs" ON public.mold_ship_logs 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_full_mold_comments" ON public.mold_comments 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

GRANT ALL ON public.racks TO authenticated;
GRANT ALL ON public.employees TO authenticated;
GRANT ALL ON public.destinations TO authenticated;
GRANT ALL ON public.mold_status_logs TO authenticated;
GRANT ALL ON public.mold_teflon_logs TO authenticated;
GRANT ALL ON public.mold_location_logs TO authenticated;
GRANT ALL ON public.mold_ship_logs TO authenticated;
GRANT ALL ON public.mold_comments TO authenticated;

-- service_role grants for server actions
GRANT ALL ON public.racks TO service_role;
GRANT ALL ON public.employees TO service_role;
GRANT ALL ON public.destinations TO service_role;
GRANT ALL ON public.mold_status_logs TO service_role;
GRANT ALL ON public.mold_teflon_logs TO service_role;
GRANT ALL ON public.mold_location_logs TO service_role;
GRANT ALL ON public.mold_ship_logs TO service_role;
GRANT ALL ON public.mold_comments TO service_role;
