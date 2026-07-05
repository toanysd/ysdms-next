import { z } from 'zod';

export const productMasterSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(1, 'Product code is required'),
  name: z.string().min(1, 'Product name is required'),
  customer_id: z.string().nullable().optional(),
  customer_product_name: z.string().nullable().optional(),
  customer_part_number: z.string().nullable().optional(),
  internal_product_name: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  p_length: z.number().nullable().optional(),
  p_width: z.number().nullable().optional(),
  length_val: z.number().nullable().optional(),
  length_tol_upper: z.number().nullable().optional(),
  length_tol_lower: z.number().nullable().optional(),
  width_val: z.number().nullable().optional(),
  width_tol_upper: z.number().nullable().optional(),
  width_tol_lower: z.number().nullable().optional(),
  thickness: z.number().nullable().optional(),
  sheet_width: z.number().nullable().optional(),
  quantity_per_box: z.number().nullable().optional(),
  antistatic: z.boolean().default(false),
  coating: z.boolean().default(false),
  silicone: z.boolean().default(false),
  is_active: z.boolean().default(true),
  remarks: z.string().nullable().optional(),
});

export type ProductMasterFormValues = z.infer<typeof productMasterSchema>;

export const customerSchema = z.object({
  id: z.string().optional(),
  customer_code: z.string().min(1, 'Mã khách hàng là bắt buộc'),
  delivery_name: z.string().min(1, 'Tên khách hàng là bắt buộc'),
  customer_name_jp: z.string().nullable().optional(),
  delivery_address: z.string().nullable().optional(),
  contact_person: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  fax: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  parent_code: z.string().nullable().optional(),
  customer_type: z.enum(['hq', 'branch', 'delivery_site']).default('hq'),
  requester_code: z.string().nullable().optional(),
  requester_name: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

export const moldRevisionSchema = z.object({
  id: z.string().optional(),
  mold_base_id: z.string().min(1, 'Khuôn gốc là bắt buộc'),
  revision_code: z.string().min(1, 'Mã phiên bản (Revision Code) là bắt buộc'),
  version_label: z.string().min(1, 'Nhãn phiên bản (Version Label) là bắt buộc'),
  approved_date: z.string().nullable().optional(),
  version_note: z.string().nullable().optional(),
  product_id: z.string().nullable().optional(),
  
  // Design Dimensions (Optional)
  design_length: z.number().nullable().optional(),
  design_width: z.number().nullable().optional(),
  design_height: z.number().nullable().optional(),
  design_depth: z.number().nullable().optional(),
  design_weight: z.number().nullable().optional(),
  
  // Cutline & Details
  cutline_x: z.number().nullable().optional(),
  cutline_y: z.number().nullable().optional(),
  corner_r: z.string().nullable().optional(),
  chamfer_c: z.string().nullable().optional(),
  draft_angle: z.string().nullable().optional(),
  cavid: z.string().nullable().optional(),
  
  // Other info
  design_for_plastic_type: z.string().nullable().optional(),
  data_input: z.string().nullable().optional(),
  customer_drawing_no: z.string().nullable().optional(),
  customer_equipment_no: z.string().nullable().optional(),
  customer_tray_name: z.string().nullable().optional(),
});

export type MoldRevisionFormValues = z.infer<typeof moldRevisionSchema>;
