import { z } from 'zod';

export const orderItemSchema = z.object({
  id: z.string().optional(),
  line_no: z.number().int().min(1),
  product_id: z.string().nullable().optional(),
  product_pn_raw: z.string().nullable().optional(),
  quantity: z.number().min(0, 'Số lượng không hợp lệ'),
  unit_price: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  delivery_date: z.string().nullable().optional(),
  delivery_date_end: z.string().nullable().optional(),
  mold_id: z.string().nullable().optional(),
  request_no: z.string().nullable().optional(),
  packing_qty: z.number().nullable().optional(),
  packing_boxes: z.number().nullable().optional(),
  process_notes: z.string().nullable().optional(),
  office_qty: z.number().nullable().optional(),
  shots_count: z.number().nullable().optional(),
});

export const orderSchema = z.object({
  id: z.string().optional(),
  slip_no: z.string().nullable().optional(),
  order_date: z.string().min(1, 'Ngày đặt hàng là bắt buộc'),
  customer_id: z.string().nullable().optional(),
  order_type: z.string(),
  status: z.string(),
  approval_status: z.string(),
  delivery_site_code: z.string().nullable().optional(),
  delivery_address: z.string().nullable().optional(),
  requester_code: z.string().nullable().optional(),
  handler_name: z.string().nullable().optional(),
  recipient_name: z.string().nullable().optional(),
  internal_notes: z.string().nullable().optional(),
  items: z.array(orderItemSchema),

});

export type OrderItemFormValues = z.infer<typeof orderItemSchema>;
export type OrderFormValues = z.infer<typeof orderSchema>;
