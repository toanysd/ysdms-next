export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      aluminum_blanks: {
        Row: {
          blank_type: string | null
          created_at: string | null
          id: string
          length_mm: number
          material_grade: string | null
          mold_id: string | null
          notes: string | null
          ordered_date: string | null
          received_date: string | null
          status: string | null
          supplier_id: string | null
          thickness_mm: number
          updated_at: string | null
          width_mm: number
        }
        Insert: {
          blank_type?: string | null
          created_at?: string | null
          id?: string
          length_mm: number
          material_grade?: string | null
          mold_id?: string | null
          notes?: string | null
          ordered_date?: string | null
          received_date?: string | null
          status?: string | null
          supplier_id?: string | null
          thickness_mm: number
          updated_at?: string | null
          width_mm: number
        }
        Update: {
          blank_type?: string | null
          created_at?: string | null
          id?: string
          length_mm?: number
          material_grade?: string | null
          mold_id?: string | null
          notes?: string | null
          ordered_date?: string | null
          received_date?: string | null
          status?: string | null
          supplier_id?: string | null
          thickness_mm?: number
          updated_at?: string | null
          width_mm?: number
        }
        Relationships: [
          {
            foreignKeyName: "aluminum_blanks_mold_id_fkey"
            columns: ["mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "aluminum_blanks_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      asset_custody_certificates: {
        Row: {
          certificate_file: string | null
          certificate_id: string
          created_at: string | null
          deadline: string | null
          fiscal_year: number | null
          issued_by: string | null
          issued_date: string | null
          mold_owner_id: string | null
          notes: string | null
          requested_date: string | null
          status: string | null
        }
        Insert: {
          certificate_file?: string | null
          certificate_id?: string
          created_at?: string | null
          deadline?: string | null
          fiscal_year?: number | null
          issued_by?: string | null
          issued_date?: string | null
          mold_owner_id?: string | null
          notes?: string | null
          requested_date?: string | null
          status?: string | null
        }
        Update: {
          certificate_file?: string | null
          certificate_id?: string
          created_at?: string | null
          deadline?: string | null
          fiscal_year?: number | null
          issued_by?: string | null
          issued_date?: string | null
          mold_owner_id?: string | null
          notes?: string | null
          requested_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_custody_certificates_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "asset_custody_certificates_mold_owner_id_fkey"
            columns: ["mold_owner_id"]
            isOneToOne: false
            referencedRelation: "mold_owners"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      asset_location_logs: {
        Row: {
          asset_id: string
          asset_type: Database["public"]["Enums"]["asset_type"]
          id: string
          moved_at: string | null
          moved_by: string | null
          new_rack_layer_id: string | null
          notes: string | null
          old_rack_layer_id: string | null
        }
        Insert: {
          asset_id: string
          asset_type: Database["public"]["Enums"]["asset_type"]
          id?: string
          moved_at?: string | null
          moved_by?: string | null
          new_rack_layer_id?: string | null
          notes?: string | null
          old_rack_layer_id?: string | null
        }
        Update: {
          asset_id?: string
          asset_type?: Database["public"]["Enums"]["asset_type"]
          id?: string
          moved_at?: string | null
          moved_by?: string | null
          new_rack_layer_id?: string | null
          notes?: string | null
          old_rack_layer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_location_logs_moved_by_fkey"
            columns: ["moved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "asset_location_logs_new_rack_layer_id_fkey"
            columns: ["new_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_location_logs_old_rack_layer_id_fkey"
            columns: ["old_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          changed_at: string | null
          changed_by: string | null
          log_id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action: string
          changed_at?: string | null
          changed_by?: string | null
          log_id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action?: string
          changed_at?: string | null
          changed_by?: string | null
          log_id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      auxiliary_equipments: {
        Row: {
          cav_type_id: string | null
          compatible_molds: string | null
          created_at: string | null
          current_rack_layer_id: string | null
          device_status: string | null
          disposed_date: string | null
          equipment_code: string
          equipment_id: string
          equipment_name: string | null
          height_mm: number | null
          item_type_id: number
          keeper_company_id: string | null
          legacy_product_id: string | null
          length_mm: number | null
          manufacturing_date: string | null
          notes: string | null
          owner_company_id: string | null
          position: string | null
          qr_uuid: string | null
          system_code: string | null
          updated_at: string | null
          usage_status: string | null
          width_mm: number | null
        }
        Insert: {
          cav_type_id?: string | null
          compatible_molds?: string | null
          created_at?: string | null
          current_rack_layer_id?: string | null
          device_status?: string | null
          disposed_date?: string | null
          equipment_code: string
          equipment_id?: string
          equipment_name?: string | null
          height_mm?: number | null
          item_type_id: number
          keeper_company_id?: string | null
          legacy_product_id?: string | null
          length_mm?: number | null
          manufacturing_date?: string | null
          notes?: string | null
          owner_company_id?: string | null
          position?: string | null
          qr_uuid?: string | null
          system_code?: string | null
          updated_at?: string | null
          usage_status?: string | null
          width_mm?: number | null
        }
        Update: {
          cav_type_id?: string | null
          compatible_molds?: string | null
          created_at?: string | null
          current_rack_layer_id?: string | null
          device_status?: string | null
          disposed_date?: string | null
          equipment_code?: string
          equipment_id?: string
          equipment_name?: string | null
          height_mm?: number | null
          item_type_id?: number
          keeper_company_id?: string | null
          legacy_product_id?: string | null
          length_mm?: number | null
          manufacturing_date?: string | null
          notes?: string | null
          owner_company_id?: string | null
          position?: string | null
          qr_uuid?: string | null
          system_code?: string | null
          updated_at?: string | null
          usage_status?: string | null
          width_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "auxiliary_equipments_cav_type_id_fkey"
            columns: ["cav_type_id"]
            isOneToOne: false
            referencedRelation: "cav_types"
            referencedColumns: ["cav_type_id"]
          },
          {
            foreignKeyName: "auxiliary_equipments_current_rack_layer_id_fkey1"
            columns: ["current_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auxiliary_equipments_item_type_id_fkey1"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["item_type_id"]
          },
          {
            foreignKeyName: "auxiliary_equipments_keeper_company_id_fkey"
            columns: ["keeper_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "auxiliary_equipments_legacy_product_id_fkey"
            columns: ["legacy_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "auxiliary_equipments_owner_company_id_fkey"
            columns: ["owner_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      business_cases: {
        Row: {
          case_code: string
          case_type: string
          contact_person_id: string | null
          created_at: string | null
          customer_id: string | null
          design_owner_id: string | null
          extra_json: Json | null
          id: string
          instruction_notes: string | null
          operations_owner_id: string | null
          parent_case_id: string | null
          raw_text_snapshot: string | null
          requested_due_date: string | null
          sales_owner_id: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          case_code?: string
          case_type: string
          contact_person_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          design_owner_id?: string | null
          extra_json?: Json | null
          id?: string
          instruction_notes?: string | null
          operations_owner_id?: string | null
          parent_case_id?: string | null
          raw_text_snapshot?: string | null
          requested_due_date?: string | null
          sales_owner_id?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          case_code?: string
          case_type?: string
          contact_person_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          design_owner_id?: string | null
          extra_json?: Json | null
          id?: string
          instruction_notes?: string | null
          operations_owner_id?: string | null
          parent_case_id?: string | null
          raw_text_snapshot?: string | null
          requested_due_date?: string | null
          sales_owner_id?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_cases_contact_person_id_fkey"
            columns: ["contact_person_id"]
            isOneToOne: false
            referencedRelation: "company_contacts"
            referencedColumns: ["contact_id"]
          },
          {
            foreignKeyName: "business_cases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "business_cases_design_owner_id_fkey"
            columns: ["design_owner_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "business_cases_operations_owner_id_fkey"
            columns: ["operations_owner_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "business_cases_parent_case_id_fkey"
            columns: ["parent_case_id"]
            isOneToOne: false
            referencedRelation: "business_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_cases_sales_owner_id_fkey"
            columns: ["sales_owner_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      quotations: {
        Row: {
          quotation_id: string
          quotation_no: string
          company_id: string
          quote_date: string
          valid_until: string | null
          total_amount: number | null
          status: string | null
          file_path: string | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
          case_id: string | null
          raw_text_snapshot: string | null
          extra_json: Json | null
          quotation_type: string | null
          prepared_by: string | null
        }
        Insert: {
          quotation_id?: string
          quotation_no: string
          company_id: string
          quote_date: string
          valid_until?: string | null
          total_amount?: number | null
          status?: string | null
          file_path?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
          case_id?: string | null
          raw_text_snapshot?: string | null
          extra_json?: Json | null
          quotation_type?: string | null
          prepared_by?: string | null
        }
        Update: {
          quotation_id?: string
          quotation_no?: string
          company_id?: string
          quote_date?: string
          valid_until?: string | null
          total_amount?: number | null
          status?: string | null
          file_path?: string | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
          case_id?: string | null
          raw_text_snapshot?: string | null
          extra_json?: Json | null
          quotation_type?: string | null
          prepared_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "quotations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "business_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_lines: {
        Row: {
          line_id: string
          quotation_id: string
          line_no: number
          item_type: string
          description: string | null
          quantity: number | null
          unit_price: number | null
          amount: number | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          line_id?: string
          quotation_id: string
          line_no: number
          item_type: string
          description?: string | null
          quantity?: number | null
          unit_price?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          line_id?: string
          quotation_id?: string
          line_no?: number
          item_type?: string
          description?: string | null
          quantity?: number | null
          unit_price?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_lines_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["quotation_id"]
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
      asset_type: "mold" | "cutter" | "auxiliary"
      equipment_status: "active" | "inactive" | "maintenance" | "disposed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
      )
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"]
    )[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (
        DefaultSchema["Tables"] & DefaultSchema["Views"]
      )
    ? (
        DefaultSchema["Tables"] & DefaultSchema["Views"]
      )[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
