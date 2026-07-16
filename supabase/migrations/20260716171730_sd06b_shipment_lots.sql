-- ============================================================
-- SD-06b: Junction shipment ↔ production_lot (D-03)
-- File: 20260716171730_sd06b_shipment_lots.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS public.shipment_lots (
  shipment_lot_id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id       UUID NOT NULL
    REFERENCES public.shipments(shipment_id) ON DELETE CASCADE,
  lot_id            UUID NOT NULL
    REFERENCES public.production_lots(lot_id) ON DELETE RESTRICT,
  qty_shipped       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  carton_count      INTEGER NULL,
  pallet_no         TEXT NULL,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        UUID REFERENCES public.employees(employee_id),
  UNIQUE (shipment_id, lot_id)
);

CREATE INDEX IF NOT EXISTS idx_shipment_lots_shipment
  ON public.shipment_lots(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_lots_lot
  ON public.shipment_lots(lot_id);

COMMENT ON TABLE public.shipment_lots IS
  'SD-06b / D-03: Gán lô sản xuất vào phiếu giao hàng (M:N + qty_shipped)';
