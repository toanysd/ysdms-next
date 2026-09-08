-- Migration 103: Create private storage bucket delivery-docs & RPC fn_get_shipment_delivery_note
-- Applied in Milestone 21 Sprint B (M21-B)

-- 1. Insert bucket into storage.buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'delivery-docs',
  'delivery-docs', 
  false,                    -- Private bucket
  10485760,                 -- 10MB max per file
  ARRAY['application/pdf']  -- Chỉ cho phép PDF
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf'];

-- 2. Storage Object Policies for delivery-docs
DROP POLICY IF EXISTS "delivery_docs_storage_select" ON storage.objects;
CREATE POLICY "delivery_docs_storage_select" ON storage.objects
  FOR SELECT TO authenticated, service_role
  USING (bucket_id = 'delivery-docs');

DROP POLICY IF EXISTS "delivery_docs_storage_insert" ON storage.objects;
CREATE POLICY "delivery_docs_storage_insert" ON storage.objects
  FOR INSERT TO authenticated, service_role
  WITH CHECK (bucket_id = 'delivery-docs');

DROP POLICY IF EXISTS "delivery_docs_storage_update" ON storage.objects;
CREATE POLICY "delivery_docs_storage_update" ON storage.objects
  FOR UPDATE TO authenticated, service_role
  USING (bucket_id = 'delivery-docs');

DROP POLICY IF EXISTS "delivery_docs_storage_delete" ON storage.objects;
CREATE POLICY "delivery_docs_storage_delete" ON storage.objects
  FOR DELETE TO authenticated, service_role
  USING (bucket_id = 'delivery-docs');

-- 3. RPC Function: fn_get_shipment_delivery_note
CREATE OR REPLACE FUNCTION fn_get_shipment_delivery_note(p_shipment_id UUID)
RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT to_jsonb(t) FROM (
    SELECT 
      s.*,
      -- WO-direct path
      wo.wo_code,
      wo.wo_name,
      wo.wo_status,
      p.product_name,
      p.product_name_internal,
      p.product_code,
      dr.plastic_type_designed,
      dr.alt_plastic_type,
      dr.revision_number,
      c_wo.company_name  AS wo_company_name,
      -- Order-based path  
      o.order_no,
      o.customer_order_no,
      c_ord.company_name AS order_company_name,
      -- Delivery site
      ds.site_name,
      ds.site_address,
      ds.site_tel,
      -- Order lines (if order-based)
      (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
          'line_id', ol.line_id,
          'line_no', ol.line_no,
          'quantity', ol.quantity,
          'unit', ol.unit,
          'box_type', ol.box_type,
          'product_code', lp.product_code,
          'product_name', lp.product_name
        ) ORDER BY ol.line_no), '[]'::jsonb)
        FROM public.order_lines ol
        LEFT JOIN public.products lp ON ol.product_id = lp.product_id
        WHERE ol.order_id = s.order_id
      ) AS order_lines
    FROM public.shipments s
    LEFT JOIN public.work_orders wo ON s.work_order_id = wo.wo_id
    LEFT JOIN public.products p     ON wo.product_id = p.product_id
    LEFT JOIN LATERAL (
      SELECT plastic_type_designed, alt_plastic_type, revision_number
      FROM public.design_revisions dr
      WHERE (wo.design_revision_id IS NOT NULL AND dr.revision_id = wo.design_revision_id)
         OR (wo.design_revision_id IS NULL AND dr.product_id = p.product_id)
      ORDER BY dr.revision_number DESC
      LIMIT 1
    ) dr ON true
    LEFT JOIN public.companies c_wo  ON wo.company_id = c_wo.company_id
    LEFT JOIN public.orders o        ON s.order_id = o.order_id
    LEFT JOIN public.companies c_ord ON o.company_id = c_ord.company_id
    LEFT JOIN public.delivery_sites ds ON s.delivery_site_id = ds.site_id
    WHERE s.shipment_id = p_shipment_id
  ) t;
$$;
