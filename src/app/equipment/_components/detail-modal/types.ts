export type EquipmentType =
  | 'MOLD'
  | 'CUTTER_SEPARATE'
  | 'CUTTER_INLINE'
  | 'CUTTER'
  | 'WATER_BASE'
  | 'PRESSURE_BASE'
  | 'FRAME'
  | 'STACKING'
  | 'PLUG'
  | 'PLATE'
  | string

export interface EquipmentDetailData {
  equipment_id: string
  equipment_code: string
  display_name: string
  equipment_type: EquipmentType
  sub_type?: string | null
  physical_stamp?: string | null
  dimensions?: string | null
  actual_length_mm?: string | null
  actual_width_mm?: string | null
  actual_height_mm?: string | null
  actual_weight?: string | null
  material_spec?: string | null
  piece_count?: number | null
  pocket_count?: number | null
  copy_number?: number | null
  device_status?: string | null
  usage_status?: string | null
  on_checklist?: boolean | null
  mold_type?: string | null
  manufacturing_date?: string | null
  entry_date?: string | null
  returned_date?: string | null
  disposed_date?: string | null
  notes?: string | null
  is_teflon?: boolean | null
  cutter_no?: string | null
  cutter_name?: string | null
  cutter_presence?: boolean | null
  company_id?: string | null
  keeper_company_id?: string | null
  current_rack_layer_id?: string | null
  design_revision_id?: string | null
  created_at?: string | null
  legacy_id?: string | null
  legacy_specs?: any
  base_type?: string | null
  blade_height_mm?: number | string | null
  cutline_length?: number | string | null
  cutline_width?: number | string | null
  post_cut_length?: number | string | null
  post_cut_width?: number | string | null
  pp_cushion?: string | null
  corner_r?: string | null
  chamfer_c?: string | null
  related_equipment?: Array<{
    equipment_id: string
    equipment_code: string
    display_name: string
    equipment_type: string
    usage_status?: string | null
  }>
  // FK Expanded
  keeper_company?: { company_name?: string | null; company_code?: string | null } | null
  company?: { company_name?: string | null; company_code?: string | null } | null
  rack_layers?: {
    layer_code?: string | null
    racks?: { rack_code?: string | null } | null
  } | null
  design_revisions?: {
    revision_id?: string
    design_code?: string | null
    design_length?: number | null
    design_width?: number | null
    design_height?: number | null
    design_depth?: number | null
    design_weight?: string | null
    cutline_length?: number | null
    cutline_width?: number | null
    pocket_numbers?: number | null
    cavity_count?: number | null
    cavity_pitch_mm?: number | null
    machine_feed_pitch_mm?: number | null
    plastic_type_designed?: string | null
    corner_r?: string | null
    chamfer_c?: string | null
    tray_info?: string | null
    customer_tray_name?: string | null
    products?: {
      product_code?: string | null
      product_name_internal?: string | null
      product_name?: string | null
    } | null
  } | null
}

export type ActionDialogType =
  | 'CHECKIN_OUT'
  | 'INVENTORY_AUDIT'
  | 'TEFLON_COATING'
  | 'PRINT_LABEL'
  | 'PHOTO_MANAGER'
  | 'QR_VIEW'
  | 'TRANSPORT'
  | 'RACK_MOVE'
  | 'WEIGHT_AUDIT'
  | 'SCRAP_DISPOSAL'
  | null

export interface EquipmentDetailModalProps {
  isOpen: boolean
  onClose: () => void
  equipmentId?: string | null
  initialData?: EquipmentDetailData | null
  onUpdateSuccess?: () => void
  onNavigate?: (id: string) => void
}
