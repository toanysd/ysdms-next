export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          customer_code: string
          delivery_name: string
          delivery_address: string | null
          requester_code: string | null
          requester_name: string | null
          contact_person: string | null
          phone: string | null
          fax: string | null
          parent_code: string | null
          is_active: boolean
          notes: string | null
          created_at: string
          updated_at: string
          id: string
        }
        Insert: {
          customer_code: string
          delivery_name: string
          delivery_address?: string | null
          requester_code?: string | null
          requester_name?: string | null
          contact_person?: string | null
          phone?: string | null
          fax?: string | null
          parent_code?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
          id?: string
        }
        Update: {
          customer_code?: string
          delivery_name?: string
          delivery_address?: string | null
          requester_code?: string | null
          requester_name?: string | null
          contact_person?: string | null
          phone?: string | null
          fax?: string | null
          parent_code?: string | null
          is_active?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
          id?: string
        }
        Relationships: []
      }
      cutter_master: {
        Row: {
          code: string
          created_at: string | null
          id: string
          status: string | null
          updated_at: string | null
          width_rule: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          width_rule?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          width_rule?: string | null
        }
        Relationships: []
      }
      inventory_txn: {
        Row: {
          id: string
          plastic_id: string
          qty_kg: number
          ref_vocher: string | null
          remark: string | null
          roll_id: string | null
          txn_time: string | null
          txn_type: string
        }
        Insert: {
          id?: string
          plastic_id: string
          qty_kg: number
          ref_vocher?: string | null
          remark?: string | null
          roll_id?: string | null
          txn_time?: string | null
          txn_type: string
        }
        Update: {
          id?: string
          plastic_id?: string
          qty_kg?: number
          ref_vocher?: string | null
          remark?: string | null
          roll_id?: string | null
          txn_time?: string | null
          txn_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_txn_plastic_id_fkey"
            columns: ["plastic_id"]
            isOneToOne: false
            referencedRelation: "plastic_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_txn_roll_id_fkey"
            columns: ["roll_id"]
            isOneToOne: false
            referencedRelation: "plastic_roll"
            referencedColumns: ["id"]
          },
        ]
      }
      machine_master: {
        Row: {
          code: string
          created_at: string | null
          id: string
          name: string
          process_type: string | null
          status: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          name: string
          process_type?: string | null
          status?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          name?: string
          process_type?: string | null
          status?: string | null
        }
        Relationships: []
      }
      mold_base: {
        Row: {
          code: string
          created_at: string | null
          customer_code: string | null
          customer_id: string | null
          id: string
          is_active: boolean | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          customer_code?: string | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          customer_code?: string | null
          customer_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_base_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      mold_cutter_config: {
        Row: {
          created_at: string | null
          cutter_id: string
          id: string
          revision_id: string
          setup_notes: string | null
        }
        Insert: {
          created_at?: string | null
          cutter_id: string
          id?: string
          revision_id: string
          setup_notes?: string | null
        }
        Update: {
          created_at?: string | null
          cutter_id?: string
          id?: string
          revision_id?: string
          setup_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_cutter_config_cutter_id_fkey"
            columns: ["cutter_id"]
            isOneToOne: false
            referencedRelation: "cutter_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mold_cutter_config_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "mold_design_revision"
            referencedColumns: ["id"]
          },
        ]
      }
      mold_design_revision: {
        Row: {
          approved_date: string | null
          created_at: string | null
          id: string
          mold_base_id: string
          revision_code: string
          updated_at: string | null
          version_label: string
        }
        Insert: {
          approved_date?: string | null
          created_at?: string | null
          id?: string
          mold_base_id: string
          revision_code: string
          updated_at?: string | null
          version_label: string
        }
        Update: {
          approved_date?: string | null
          created_at?: string | null
          id?: string
          mold_base_id?: string
          revision_code?: string
          updated_at?: string | null
          version_label?: string
        }
        Relationships: [
          {
            foreignKeyName: "mold_design_revision_mold_base_id_fkey"
            columns: ["mold_base_id"]
            isOneToOne: false
            referencedRelation: "mold_base"
            referencedColumns: ["id"]
          },
        ]
      }
      mold_physical: {
        Row: {
          cavity: number
          created_at: string | null
          id: string
          physical_code: string | null
          revision_id: string
          status: string | null
          storage_location: string | null
          updated_at: string | null
        }
        Insert: {
          cavity: number
          created_at?: string | null
          id?: string
          physical_code?: string | null
          revision_id: string
          status?: string | null
          storage_location?: string | null
          updated_at?: string | null
        }
        Update: {
          cavity?: number
          created_at?: string | null
          id?: string
          physical_code?: string | null
          revision_id?: string
          status?: string | null
          storage_location?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_physical_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "mold_design_revision"
            referencedColumns: ["id"]
          },
        ]
      }
      mold_plastic_bom: {
        Row: {
          actual_weight_grams: number
          created_at: string | null
          id: string
          plastic_id: string
          priority: number | null
          revision_id: string
          scrap_ratio: number | null
        }
        Insert: {
          actual_weight_grams: number
          created_at?: string | null
          id?: string
          plastic_id: string
          priority?: number | null
          revision_id: string
          scrap_ratio?: number | null
        }
        Update: {
          actual_weight_grams?: number
          created_at?: string | null
          id?: string
          plastic_id?: string
          priority?: number | null
          revision_id?: string
          scrap_ratio?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_plastic_bom_plastic_id_fkey"
            columns: ["plastic_id"]
            isOneToOne: false
            referencedRelation: "plastic_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mold_plastic_bom_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "mold_design_revision"
            referencedColumns: ["id"]
          },
        ]
      }
      plastic_master: {
        Row: {
          code: string
          color: string | null
          created_at: string | null
          density_g_cm3: number | null
          family: string
          grade: string | null
          id: string
          is_active: boolean | null
          reorder_point_kg: number | null
          thickness_mm: number
          updated_at: string | null
          width_mm: number
        }
        Insert: {
          code: string
          color?: string | null
          created_at?: string | null
          density_g_cm3?: number | null
          family: string
          grade?: string | null
          id?: string
          is_active?: boolean | null
          reorder_point_kg?: number | null
          thickness_mm: number
          updated_at?: string | null
          width_mm: number
        }
        Update: {
          code?: string
          color?: string | null
          created_at?: string | null
          density_g_cm3?: number | null
          family?: string
          grade?: string | null
          id?: string
          is_active?: boolean | null
          reorder_point_kg?: number | null
          thickness_mm?: number
          updated_at?: string | null
          width_mm?: number
        }
        Relationships: []
      }
      plastic_roll: {
        Row: {
          arrived_at: string | null
          gross_weight_kg: number
          id: string
          net_weight_kg: number
          plastic_id: string
          qr_code: string
          status: string | null
          supplier_lot_no: string | null
        }
        Insert: {
          arrived_at?: string | null
          gross_weight_kg: number
          id?: string
          net_weight_kg: number
          plastic_id: string
          qr_code: string
          status?: string | null
          supplier_lot_no?: string | null
        }
        Update: {
          arrived_at?: string | null
          gross_weight_kg?: number
          id?: string
          net_weight_kg?: number
          plastic_id?: string
          qr_code?: string
          status?: string | null
          supplier_lot_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plastic_roll_plastic_id_fkey"
            columns: ["plastic_id"]
            isOneToOne: false
            referencedRelation: "plastic_master"
            referencedColumns: ["id"]
          },
        ]
      }
      product_master: {
        Row: {
          antistatic: boolean
          coating: boolean
          code: string
          created_at: string | null
          customer_code: string | null
          id: string
          is_active: boolean
          length_tol_lower: number | null
          length_tol_upper: number | null
          length_val: number | null
          material: string | null
          name: string
          quantity_per_box: number | null
          remarks: string | null
          sheet_width: number | null
          silicone: boolean
          thickness: number | null
          updated_at: string | null
          width_tol_lower: number | null
          width_tol_upper: number | null
          width_val: number | null
        }
        Insert: {
          antistatic?: boolean
          coating?: boolean
          code: string
          created_at?: string | null
          customer_code?: string | null
          id?: string
          is_active?: boolean
          length_tol_lower?: number | null
          length_tol_upper?: number | null
          length_val?: number | null
          material?: string | null
          name: string
          quantity_per_box?: number | null
          remarks?: string | null
          sheet_width?: number | null
          silicone?: boolean
          thickness?: number | null
          updated_at?: string | null
          width_tol_lower?: number | null
          width_tol_upper?: number | null
          width_val?: number | null
        }
        Update: {
          antistatic?: boolean
          coating?: boolean
          code?: string
          created_at?: string | null
          customer_code?: string | null
          id?: string
          is_active?: boolean
          length_tol_lower?: number | null
          length_tol_upper?: number | null
          length_val?: number | null
          material?: string | null
          name?: string
          quantity_per_box?: number | null
          remarks?: string | null
          sheet_width?: number | null
          silicone?: boolean
          thickness?: number | null
          updated_at?: string | null
          width_tol_lower?: number | null
          width_tol_upper?: number | null
          width_val?: number | null
        }
        Relationships: []
      }
      product_mold_map: {
        Row: {
          created_at: string | null
          id: string
          priority: number | null
          product_id: string
          revision_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          priority?: number | null
          product_id: string
          revision_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          priority?: number | null
          product_id?: string
          revision_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_mold_map_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "product_master"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_mold_map_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "mold_design_revision"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// ─── Helper types ───────────────────────────────────────────────
type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"]

// ─── Convenient named exports ──────────────────────────────────
export type Customer = Tables<"customers">
export type ProductMaster = Tables<"product_master">
export type MoldBase = Tables<"mold_base">
export type MoldDesignRevision = Tables<"mold_design_revision">
export type MoldPhysical = Tables<"mold_physical">
export type PlasticMaster = Tables<"plastic_master">
export type PlasticRoll = Tables<"plastic_roll">
export type CutterMaster = Tables<"cutter_master">
export type MachineMaster = Tables<"machine_master">
export type ProductMoldMap = Tables<"product_mold_map">
export type MoldPlasticBom = Tables<"mold_plastic_bom">
export type MoldCutterConfig = Tables<"mold_cutter_config">
export type InventoryTxn = Tables<"inventory_txn">
