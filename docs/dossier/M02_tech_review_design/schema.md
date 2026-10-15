# 🗄️ M02 — Schema Thẩm Định KT, Sản Phẩm & Bản Vẽ (`M02_tech_review_design/schema.md`)

- **Đối chiếu `information_schema.columns` lúc:** `2026-10-15 01:39:47.755187+00:00`
- **Số bản ghi Production:** `products = 8,489` | `design_revisions = 4,693` | `cav_types = 52` | `technical_reviews = 0`.

## 1. Bảng `public.products` (BASE TABLE — 8,489 dòng)
- `product_id` (uuid*) | `product_code` (text*) | `company_id` (uuid*) | `customer_product_name` (text)
- `product_name` (text) | `product_name_en` (text) | `pocket_count` (integer) | `pieces_per_box` (integer)
- `box_spec` (text) | `mold_master_id` (uuid) | `product_status` (text) | `date_entry` (timestamptz)
- `notes` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz) | `updated_by` (text)
- `product_name_internal` (text) | `legacy_id` (text) | `legacy_specs` (jsonb) | `product_description` (text)
- `product_set_type` (text) | `set_component_names` (jsonb) | `stacking_type` (text) | `stacking_layers` (integer)
- `stacking_height_mm` (numeric) | `external_length_mm` (numeric) | `external_width_mm` (numeric) | `customer_product_specs` (jsonb)
- `end_user_company_id` (uuid) | `first_shipment_date` (date) | `requires_prototype_mold` (boolean) | `product_lifecycle_status` (text*)
- `product_code_normalized` (text) | `product_name_normalized` (text) | `feed_length_mm` (numeric) | `film_width_mm` (numeric)
- `thickness_mm` (numeric)

## 2. Bảng `public.design_revisions` (BASE TABLE — 4,693 dòng, SSOT Thông Số Kỹ Thuật)
- `revision_id` (uuid*) | `design_code` (text*) | `company_id` (uuid) | `cav_type_id` (uuid)
- `design_length` (numeric) | `design_width` (numeric) | `design_height` (numeric) | `design_depth` (numeric)
- `design_weight` (text) | `pocket_numbers` (integer) | `cavity_count` (integer) | `cavity_pitch_mm` (numeric)
- `cutline_length` (numeric) | `cutline_width` (numeric) | `corner_r` (text) | `chamfer_c` (text)
- `orientation` (text) | `setup_type` (text) | `undercut_spec` (text) | `under_depth` (text)
- `draft_angle` (text) | `has_separate_cutter` (boolean) | `plastic_type_designed` (text) | `designer` (text)
- `design_date` (timestamptz) | `cad_folder_path` (text) | `customer_drawing_no` (text) | `customer_equipment_no` (text)
- `customer_tray_name` (text) | `text_content` (text) | `created_at` (timestamptz) | `updated_at` (timestamptz)
- `updated_by` (text) | `revision_number` (integer) | `status` (text) | `designer_id` (uuid)
- `approved_date` (date) | `drawing_pdf_path` (text) | `step_3d_path` (text) | `tray_info` (text)
- `data_input_date` (text) | `legacy_id` (text) | `legacy_specs` (jsonb) | `product_id` (uuid)
- `plug_type` (text) | `shared_plug_from_design_id` (uuid) | `plastic_id` (uuid) | `tolerance_x` (text)
- `tolerance_y` (text) | `tolerance_pitch` (text) | `discard_old_stock_on_remake` (boolean) | `replace_qc_drawing_on_remake` (boolean)
- `water_cooling_plate_spec` (text) | `frame_spec` (text) | `machine_feed_pitch_mm` (numeric) | `alt_plastic_type` (text)
- `alt_plastic_code` (text) | `gas_pressure` (text) | `change_summary` (text) | `parent_design_id` (uuid)
- `design_category` (varchar)

## 3. Bảng `public.technical_reviews` (BASE TABLE — 0 dòng)
- `id` (uuid*) | `case_id` (uuid*) | `requested_by` (uuid) | `reviewed_by` (uuid)
- `review_date` (timestamptz) | `mold_decision_type` (text) | `technical_constraints` (text) | `machine_candidate` (text)
- `mold_size_x` (numeric) | `mold_size_y` (numeric) | `cavity_count` (integer) | `cut_method` (text)
- `plug_required` (boolean) | `die_required` (boolean) | `result_status` (text) | `raw_text_snapshot` (text)
- `extra_json` (jsonb) | `created_at` (timestamptz) | `version` (integer*) | `approval_status` (enum*)
- `approved_by` (uuid) | `approved_at` (timestamptz) | `rejected_reason` (text) | `mold_option` (enum)
- `cutting_die_option` (enum) | `mold_id` (uuid) | `machine_id` (uuid) | `cutting_die_id` (uuid)
- `product_id` (uuid) | `design_revision_id` (uuid) | `pocket_count` (integer) | `lead_time_days` (integer)
- `cycle_time_sec` (numeric) | `material_spec` (text) | `thickness_mm` (numeric) | `special_requirements` (text)
- `updated_at` (timestamptz)

## 4. Quy Tắc Bắt Buộc (`RULE-DATA-01` & `RULE-DATA-02`)
1. **SSOT Thông số kỹ thuật:** Nhựa thiết kế (`plastic_type_designed`), kích thước đường cắt (`cutline_length`, `cutline_width`), `corner_r`, `chamfer_c` **CHỈ lấy từ `public.design_revisions`** (dùng helper `getCutlineSpecs(designRevision)`). Tuyệt đối cấm fallback từ `equipment.actual_length_mm` hay `products.primary_plastic_code`.
2. **Định dạng `legacy_id`:** `products.legacy_id = 'TRAY-' || TrayID`; `design_revisions.legacy_id = 'D-' || MoldDesignID`.
3. **Trạng thái bản vẽ (`design_revisions.status`):** `'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'RELEASED' | 'REJECTED' | 'SUPERSEDED'` (RPC `rpc_confirm_work_order` yêu cầu `'APPROVED'`).
