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
      auxiliary_equipments_v1_backup: {
        Row: {
          created_at: string | null
          current_rack_layer_id: string | null
          equipment_code: string
          id: string
          item_type_id: number | null
          name: string
          notes: string | null
          status: Database["public"]["Enums"]["equipment_status"] | null
        }
        Insert: {
          created_at?: string | null
          current_rack_layer_id?: string | null
          equipment_code: string
          id?: string
          item_type_id?: number | null
          name: string
          notes?: string | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
        }
        Update: {
          created_at?: string | null
          current_rack_layer_id?: string | null
          equipment_code?: string
          id?: string
          item_type_id?: number | null
          name?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "auxiliary_equipments_current_rack_layer_id_fkey"
            columns: ["current_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auxiliary_equipments_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["item_type_id"]
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
      cav_types: {
        Row: {
          alias_cav_code: string | null
          cav_code: string
          cav_length_mm: number
          cav_series: string | null
          cav_type_id: string
          cav_width_mm: number
          created_at: string | null
          description: string | null
          is_active: boolean | null
          machine_group: string
          machine_series: string | null
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          alias_cav_code?: string | null
          cav_code: string
          cav_length_mm: number
          cav_series?: string | null
          cav_type_id?: string
          cav_width_mm: number
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          machine_group: string
          machine_series?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          alias_cav_code?: string | null
          cav_code?: string
          cav_length_mm?: number
          cav_series?: string | null
          cav_type_id?: string
          cav_width_mm?: number
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          machine_group?: string
          machine_series?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      certificate_items: {
        Row: {
          asset_code: string | null
          asset_name: string | null
          certificate_id: string
          certificate_type: string
          confirmed_date: string | null
          is_confirmed: boolean | null
          item_id: string
          keeper_company_id: string | null
          notes: string | null
          photo_path: string | null
          physical_mold_id: string | null
          storage_location: string | null
        }
        Insert: {
          asset_code?: string | null
          asset_name?: string | null
          certificate_id: string
          certificate_type: string
          confirmed_date?: string | null
          is_confirmed?: boolean | null
          item_id?: string
          keeper_company_id?: string | null
          notes?: string | null
          photo_path?: string | null
          physical_mold_id?: string | null
          storage_location?: string | null
        }
        Update: {
          asset_code?: string | null
          asset_name?: string | null
          certificate_id?: string
          certificate_type?: string
          confirmed_date?: string | null
          is_confirmed?: boolean | null
          item_id?: string
          keeper_company_id?: string | null
          notes?: string | null
          photo_path?: string | null
          physical_mold_id?: string | null
          storage_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificate_items_keeper_company_id_fkey"
            columns: ["keeper_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "certificate_items_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          cad_folder_path: string | null
          company_code: string
          company_id: string
          company_name: string
          company_name_romaji: string | null
          company_type: string[] | null
          created_at: string | null
          fax: string | null
          is_active: boolean | null
          legacy_id: string | null
          legacy_specs: Json | null
          notes: string | null
          order_folder_path: string | null
          parent_company_id: string | null
          tel: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          cad_folder_path?: string | null
          company_code: string
          company_id?: string
          company_name: string
          company_name_romaji?: string | null
          company_type?: string[] | null
          created_at?: string | null
          fax?: string | null
          is_active?: boolean | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          notes?: string | null
          order_folder_path?: string | null
          parent_company_id?: string | null
          tel?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          cad_folder_path?: string | null
          company_code?: string
          company_id?: string
          company_name?: string
          company_name_romaji?: string | null
          company_type?: string[] | null
          created_at?: string | null
          fax?: string | null
          is_active?: boolean | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          notes?: string | null
          order_folder_path?: string | null
          parent_company_id?: string | null
          tel?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      company_contacts: {
        Row: {
          company_id: string
          contact_email: string | null
          contact_id: string
          contact_name: string
          contact_role: string | null
          contact_tel: string | null
          created_at: string | null
          department: string | null
          is_primary: boolean | null
          project_role: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          contact_email?: string | null
          contact_id?: string
          contact_name: string
          contact_role?: string | null
          contact_tel?: string | null
          created_at?: string | null
          department?: string | null
          is_primary?: boolean | null
          project_role?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          contact_email?: string | null
          contact_id?: string
          contact_name?: string
          contact_role?: string | null
          contact_tel?: string | null
          created_at?: string | null
          department?: string | null
          is_primary?: boolean | null
          project_role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      cutter_orders: {
        Row: {
          actual_delivery: string | null
          aluminum_base: boolean | null
          base_completed: string | null
          base_qty: number | null
          created_at: string | null
          cutter_id: string | null
          delivery_destination: string | null
          design_file: string | null
          designed_by: string | null
          estimated_delivery: string | null
          is_movable: boolean | null
          notes: string | null
          order_id: string
          order_type: string | null
          ordered_by: string | null
          ordered_date: string | null
          product_code: string | null
          reuse_cutter_id: string | null
          status: string | null
          supplier_id: string | null
        }
        Insert: {
          actual_delivery?: string | null
          aluminum_base?: boolean | null
          base_completed?: string | null
          base_qty?: number | null
          created_at?: string | null
          cutter_id?: string | null
          delivery_destination?: string | null
          design_file?: string | null
          designed_by?: string | null
          estimated_delivery?: string | null
          is_movable?: boolean | null
          notes?: string | null
          order_id?: string
          order_type?: string | null
          ordered_by?: string | null
          ordered_date?: string | null
          product_code?: string | null
          reuse_cutter_id?: string | null
          status?: string | null
          supplier_id?: string | null
        }
        Update: {
          actual_delivery?: string | null
          aluminum_base?: boolean | null
          base_completed?: string | null
          base_qty?: number | null
          created_at?: string | null
          cutter_id?: string | null
          delivery_destination?: string | null
          design_file?: string | null
          designed_by?: string | null
          estimated_delivery?: string | null
          is_movable?: boolean | null
          notes?: string | null
          order_id?: string
          order_type?: string | null
          ordered_by?: string | null
          ordered_date?: string | null
          product_code?: string | null
          reuse_cutter_id?: string | null
          status?: string | null
          supplier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cutter_orders_cutter_id_fkey"
            columns: ["cutter_id"]
            isOneToOne: false
            referencedRelation: "cutters"
            referencedColumns: ["cutter_id"]
          },
          {
            foreignKeyName: "cutter_orders_designed_by_fkey"
            columns: ["designed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "cutter_orders_ordered_by_fkey"
            columns: ["ordered_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "cutter_orders_reuse_cutter_id_fkey"
            columns: ["reuse_cutter_id"]
            isOneToOne: false
            referencedRelation: "cutters"
            referencedColumns: ["cutter_id"]
          },
          {
            foreignKeyName: "cutter_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      cutters: {
        Row: {
          base_type: string | null
          cavity_count: string | null
          chamfer_c: string | null
          company_id: string | null
          corner_r: string | null
          created_at: string | null
          current_rack_layer_id: string | null
          cutline_length: number | null
          cutline_width: number | null
          cutter_design_code: string | null
          cutter_height_mm: number | null
          cutter_id: string
          cutter_length_mm: number | null
          cutter_name: string
          cutter_no: string
          cutter_presence: boolean | null
          cutter_type: string | null
          cutter_width_mm: number | null
          date_entry: string | null
          design_revision_id: string | null
          item_type_id: number | null
          keeper_company_id: string | null
          legacy_id: string | null
          legacy_specs: Json | null
          notes: string | null
          pitch_mm: number | null
          plastic_cut_type: string | null
          post_cut_length: number | null
          post_cut_width: number | null
          qr_uuid: string | null
          storage_company_id: string | null
          updated_at: string | null
          updated_by: string | null
          usage_status: string | null
        }
        Insert: {
          base_type?: string | null
          cavity_count?: string | null
          chamfer_c?: string | null
          company_id?: string | null
          corner_r?: string | null
          created_at?: string | null
          current_rack_layer_id?: string | null
          cutline_length?: number | null
          cutline_width?: number | null
          cutter_design_code?: string | null
          cutter_height_mm?: number | null
          cutter_id?: string
          cutter_length_mm?: number | null
          cutter_name: string
          cutter_no: string
          cutter_presence?: boolean | null
          cutter_type?: string | null
          cutter_width_mm?: number | null
          date_entry?: string | null
          design_revision_id?: string | null
          item_type_id?: number | null
          keeper_company_id?: string | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          notes?: string | null
          pitch_mm?: number | null
          plastic_cut_type?: string | null
          post_cut_length?: number | null
          post_cut_width?: number | null
          qr_uuid?: string | null
          storage_company_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usage_status?: string | null
        }
        Update: {
          base_type?: string | null
          cavity_count?: string | null
          chamfer_c?: string | null
          company_id?: string | null
          corner_r?: string | null
          created_at?: string | null
          current_rack_layer_id?: string | null
          cutline_length?: number | null
          cutline_width?: number | null
          cutter_design_code?: string | null
          cutter_height_mm?: number | null
          cutter_id?: string
          cutter_length_mm?: number | null
          cutter_name?: string
          cutter_no?: string
          cutter_presence?: boolean | null
          cutter_type?: string | null
          cutter_width_mm?: number | null
          date_entry?: string | null
          design_revision_id?: string | null
          item_type_id?: number | null
          keeper_company_id?: string | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          notes?: string | null
          pitch_mm?: number | null
          plastic_cut_type?: string | null
          post_cut_length?: number | null
          post_cut_width?: number | null
          qr_uuid?: string | null
          storage_company_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usage_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cutters_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "cutters_current_rack_layer_id_fkey"
            columns: ["current_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cutters_design_revision_id_fkey"
            columns: ["design_revision_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "cutters_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["item_type_id"]
          },
          {
            foreignKeyName: "cutters_keeper_company_id_fkey"
            columns: ["keeper_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "cutters_storage_company_id_fkey"
            columns: ["storage_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      defect_reports: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          company_notified: boolean | null
          company_response: string | null
          corrective_action: string | null
          created_at: string | null
          defect_description: string | null
          defect_type: string | null
          mold_code: string | null
          notes: string | null
          preventive_action: string | null
          product_id: string | null
          report_code: string
          report_file: string | null
          report_id: string
          report_type: string
          reported_by: string | null
          reported_date: string | null
          root_cause: string | null
          root_cause_analysis: string | null
          severity: string | null
          status: string | null
          translated_language: string | null
          translation_confirmed: boolean | null
          translation_confirmed_by: string | null
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          company_notified?: boolean | null
          company_response?: string | null
          corrective_action?: string | null
          created_at?: string | null
          defect_description?: string | null
          defect_type?: string | null
          mold_code?: string | null
          notes?: string | null
          preventive_action?: string | null
          product_id?: string | null
          report_code: string
          report_file?: string | null
          report_id?: string
          report_type: string
          reported_by?: string | null
          reported_date?: string | null
          root_cause?: string | null
          root_cause_analysis?: string | null
          severity?: string | null
          status?: string | null
          translated_language?: string | null
          translation_confirmed?: boolean | null
          translation_confirmed_by?: string | null
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          company_notified?: boolean | null
          company_response?: string | null
          corrective_action?: string | null
          created_at?: string | null
          defect_description?: string | null
          defect_type?: string | null
          mold_code?: string | null
          notes?: string | null
          preventive_action?: string | null
          product_id?: string | null
          report_code?: string
          report_file?: string | null
          report_id?: string
          report_type?: string
          reported_by?: string | null
          reported_date?: string | null
          root_cause?: string | null
          root_cause_analysis?: string | null
          severity?: string | null
          status?: string | null
          translated_language?: string | null
          translation_confirmed?: boolean | null
          translation_confirmed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "defect_reports_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "defect_reports_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "defect_reports_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      delivery_notes: {
        Row: {
          certificate_type: string | null
          company_confirmed: boolean | null
          confirmed_date: string | null
          created_at: string | null
          file_path: string | null
          issued_by: string | null
          issued_date: string | null
          note_id: string
          notes: string | null
          shipment_id: string | null
        }
        Insert: {
          certificate_type?: string | null
          company_confirmed?: boolean | null
          confirmed_date?: string | null
          created_at?: string | null
          file_path?: string | null
          issued_by?: string | null
          issued_date?: string | null
          note_id?: string
          notes?: string | null
          shipment_id?: string | null
        }
        Update: {
          certificate_type?: string | null
          company_confirmed?: boolean | null
          confirmed_date?: string | null
          created_at?: string | null
          file_path?: string | null
          issued_by?: string | null
          issued_date?: string | null
          note_id?: string
          notes?: string | null
          shipment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_notes_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "delivery_notes_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["shipment_id"]
          },
        ]
      }
      delivery_sites: {
        Row: {
          company_id: string
          contact_email: string | null
          contact_person: string | null
          created_at: string | null
          delivery_notes: string | null
          is_active: boolean | null
          is_placeholder: boolean | null
          requester_name: string | null
          site_address: string | null
          site_code: string
          site_fax: string | null
          site_id: string
          site_name: string
          site_tel: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          delivery_notes?: string | null
          is_active?: boolean | null
          is_placeholder?: boolean | null
          requester_name?: string | null
          site_address?: string | null
          site_code: string
          site_fax?: string | null
          site_id?: string
          site_name: string
          site_tel?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string | null
          delivery_notes?: string | null
          is_active?: boolean | null
          is_placeholder?: boolean | null
          requester_name?: string | null
          site_address?: string | null
          site_code?: string
          site_fax?: string | null
          site_id?: string
          site_name?: string
          site_tel?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_sites_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      design_revisions: {
        Row: {
          alt_plastic_code: string | null
          alt_plastic_type: string | null
          approved_date: string | null
          cad_folder_path: string | null
          change_summary: string | null
          cav_type_id: string | null
          cavity_count: number | null
          cavity_pitch_mm: number | null
          chamfer_c: string | null
          company_id: string | null
          corner_r: string | null
          created_at: string | null
          customer_drawing_no: string | null
          customer_equipment_no: string | null
          customer_tray_name: string | null
          cutline_length: number | null
          cutline_width: number | null
          data_input_date: string | null
          design_code: string
          design_date: string | null
          design_depth: number | null
          design_height: number | null
          design_length: number | null
          design_weight: string | null
          design_width: number | null
          designer: string | null
          designer_id: string | null
          discard_old_stock_on_remake: boolean | null
          draft_angle: string | null
          drawing_pdf_path: string | null
          frame_spec: string | null
          gas_pressure: string | null
          has_separate_cutter: boolean | null
          legacy_id: string | null
          legacy_specs: Json | null
          machine_feed_pitch_mm: number | null
          orientation: string | null
          plastic_id: string | null
          parent_design_id: string | null
          design_category: string | null
          plastic_type_designed: string | null
          plug_type: string | null
          pocket_numbers: number | null
          product_id: string | null
          replace_qc_drawing_on_remake: boolean | null
          revision_id: string
          revision_number: number | null
          setup_type: string | null
          shared_plug_from_design_id: string | null
          status: string | null
          step_3d_path: string | null
          text_content: string | null
          tolerance_pitch: string | null
          tolerance_x: string | null
          tolerance_y: string | null
          tray_info: string | null
          under_depth: string | null
          undercut_spec: string | null
          updated_at: string | null
          updated_by: string | null

          water_cooling_plate_spec: string | null
        }
        Insert: {
          alt_plastic_code?: string | null
          alt_plastic_type?: string | null
          approved_date?: string | null
          cad_folder_path?: string | null
          change_summary?: string | null
          cav_type_id?: string | null
          cavity_count?: number | null
          cavity_pitch_mm?: number | null
          chamfer_c?: string | null
          company_id?: string | null
          corner_r?: string | null
          created_at?: string | null
          customer_drawing_no?: string | null
          customer_equipment_no?: string | null
          customer_tray_name?: string | null
          cutline_length?: number | null
          cutline_width?: number | null
          data_input_date?: string | null
          design_code: string
          design_date?: string | null
          design_depth?: number | null
          design_height?: number | null
          design_length?: number | null
          design_weight?: string | null
          design_width?: number | null
          designer?: string | null
          designer_id?: string | null
          discard_old_stock_on_remake?: boolean | null
          draft_angle?: string | null
          drawing_pdf_path?: string | null
          frame_spec?: string | null
          gas_pressure?: string | null
          has_separate_cutter?: boolean | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          machine_feed_pitch_mm?: number | null
          orientation?: string | null
          plastic_id?: string | null
          parent_design_id?: string | null
          design_category?: string | null
          plastic_type_designed?: string | null
          plug_type?: string | null
          pocket_numbers?: number | null
          product_id?: string | null
          replace_qc_drawing_on_remake?: boolean | null
          revision_id?: string
          revision_number?: number | null
          setup_type?: string | null
          shared_plug_from_design_id?: string | null
          status?: string | null
          step_3d_path?: string | null
          text_content?: string | null
          tolerance_pitch?: string | null
          tolerance_x?: string | null
          tolerance_y?: string | null
          tray_info?: string | null
          under_depth?: string | null
          undercut_spec?: string | null
          updated_at?: string | null
          updated_by?: string | null

          water_cooling_plate_spec?: string | null
        }
        Update: {
          alt_plastic_code?: string | null
          alt_plastic_type?: string | null
          approved_date?: string | null
          cad_folder_path?: string | null
          change_summary?: string | null
          cav_type_id?: string | null
          cavity_count?: number | null
          cavity_pitch_mm?: number | null
          chamfer_c?: string | null
          company_id?: string | null
          corner_r?: string | null
          created_at?: string | null
          customer_drawing_no?: string | null
          customer_equipment_no?: string | null
          customer_tray_name?: string | null
          cutline_length?: number | null
          cutline_width?: number | null
          data_input_date?: string | null
          design_code?: string
          design_date?: string | null
          design_depth?: number | null
          design_height?: number | null
          design_length?: number | null
          design_weight?: string | null
          design_width?: number | null
          designer?: string | null
          designer_id?: string | null
          discard_old_stock_on_remake?: boolean | null
          draft_angle?: string | null
          drawing_pdf_path?: string | null
          frame_spec?: string | null
          gas_pressure?: string | null
          has_separate_cutter?: boolean | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          machine_feed_pitch_mm?: number | null
          orientation?: string | null
          plastic_id?: string | null
          parent_design_id?: string | null
          design_category?: string | null
          plastic_type_designed?: string | null
          plug_type?: string | null
          pocket_numbers?: number | null
          product_id?: string | null
          replace_qc_drawing_on_remake?: boolean | null
          revision_id?: string
          revision_number?: number | null
          setup_type?: string | null
          shared_plug_from_design_id?: string | null
          status?: string | null
          step_3d_path?: string | null
          text_content?: string | null
          tolerance_pitch?: string | null
          tolerance_x?: string | null
          tolerance_y?: string | null
          tray_info?: string | null
          under_depth?: string | null
          undercut_spec?: string | null
          updated_at?: string | null
          updated_by?: string | null

          water_cooling_plate_spec?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "design_revisions_designer_id_fkey"
            columns: ["designer_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "design_revisions_plastic_id_fkey"
            columns: ["plastic_id"]
            isOneToOne: false
            referencedRelation: "plastic_master"
            referencedColumns: ["plastic_id"]
          },
          {
            foreignKeyName: "design_revisions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "design_revisions_shared_plug_from_design_id_fkey"
            columns: ["shared_plug_from_design_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "mold_designs_cav_type_id_fkey"
            columns: ["cav_type_id"]
            isOneToOne: false
            referencedRelation: "cav_types"
            referencedColumns: ["cav_type_id"]
          },
          {
            foreignKeyName: "mold_designs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      destinations: {
        Row: {
          destination_id: string
          destination_name: string
          destination_type: string | null
          is_active: boolean | null
        }
        Insert: {
          destination_id?: string
          destination_name: string
          destination_type?: string | null
          is_active?: boolean | null
        }
        Update: {
          destination_id?: string
          destination_name?: string
          destination_type?: string | null
          is_active?: boolean | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          company_id: string | null
          created_at: string | null
          department: string | null
          employee_code: string
          employee_id: string
          employee_name: string
          employee_name_short: string | null
          is_active: boolean | null
          joining_date: string | null
          legacy_id: string | null
          order_code: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          employee_code: string
          employee_id?: string
          employee_name: string
          employee_name_short?: string | null
          is_active?: boolean | null
          joining_date?: string | null
          legacy_id?: string | null
          order_code?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          department?: string | null
          employee_code?: string
          employee_id?: string
          employee_name?: string
          employee_name_short?: string | null
          is_active?: boolean | null
          joining_date?: string | null
          legacy_id?: string | null
          order_code?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      equipment: {
        Row: {
          actual_height_mm: string | null
          actual_length_mm: string | null
          actual_weight: string | null
          actual_width_mm: string | null
          cav_type_id: string | null
          company_id: string | null
          copy_number: number | null
          created_at: string | null
          current_rack_layer_id: string | null
          design_revision_id: string | null
          device_status: string | null
          dimensions: string | null
          display_name: string
          disposed_date: string | null
          entry_date: string | null
          equipment_code: string
          equipment_id: string
          equipment_type: string
          keeper_company_id: string | null
          legacy_cutter_id: string | null
          legacy_id: string | null
          legacy_physical_mold_id: string | null
          legacy_specs: Json | null
          manufacturing_date: string | null
          material_spec: string | null
          mold_master_id: string | null
          mold_revision_id: string | null
          mold_type: string | null
          notes: string | null
          on_checklist: boolean | null
          physical_stamp: string | null
          piece_count: number | null
          qr_uuid: string | null
          returned_date: string | null
          sub_type: string | null
          updated_at: string | null
          updated_by: string | null
          usage_status: string | null
        }
        Insert: {
          actual_height_mm?: string | null
          actual_length_mm?: string | null
          actual_weight?: string | null
          actual_width_mm?: string | null
          cav_type_id?: string | null
          company_id?: string | null
          copy_number?: number | null
          created_at?: string | null
          current_rack_layer_id?: string | null
          design_revision_id?: string | null
          device_status?: string | null
          dimensions?: string | null
          display_name: string
          disposed_date?: string | null
          entry_date?: string | null
          equipment_code: string
          equipment_id?: string
          equipment_type: string
          keeper_company_id?: string | null
          legacy_cutter_id?: string | null
          legacy_id?: string | null
          legacy_physical_mold_id?: string | null
          legacy_specs?: Json | null
          manufacturing_date?: string | null
          material_spec?: string | null
          mold_master_id?: string | null
          mold_revision_id?: string | null
          mold_type?: string | null
          notes?: string | null
          on_checklist?: boolean | null
          physical_stamp?: string | null
          piece_count?: number | null
          qr_uuid?: string | null
          returned_date?: string | null
          sub_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usage_status?: string | null
        }
        Update: {
          actual_height_mm?: string | null
          actual_length_mm?: string | null
          actual_weight?: string | null
          actual_width_mm?: string | null
          cav_type_id?: string | null
          company_id?: string | null
          copy_number?: number | null
          created_at?: string | null
          current_rack_layer_id?: string | null
          design_revision_id?: string | null
          device_status?: string | null
          dimensions?: string | null
          display_name?: string
          disposed_date?: string | null
          entry_date?: string | null
          equipment_code?: string
          equipment_id?: string
          equipment_type?: string
          keeper_company_id?: string | null
          legacy_cutter_id?: string | null
          legacy_id?: string | null
          legacy_physical_mold_id?: string | null
          legacy_specs?: Json | null
          manufacturing_date?: string | null
          material_spec?: string | null
          mold_master_id?: string | null
          mold_revision_id?: string | null
          mold_type?: string | null
          notes?: string | null
          on_checklist?: boolean | null
          physical_stamp?: string | null
          piece_count?: number | null
          qr_uuid?: string | null
          returned_date?: string | null
          sub_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usage_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_cav_type_id_fkey"
            columns: ["cav_type_id"]
            isOneToOne: false
            referencedRelation: "cav_types"
            referencedColumns: ["cav_type_id"]
          },
          {
            foreignKeyName: "equipment_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_current_rack_layer_id_fkey"
            columns: ["current_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_design_revision_id_fkey"
            columns: ["design_revision_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "equipment_keeper_company_id_fkey"
            columns: ["keeper_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_mold_revision_id_fkey"
            columns: ["mold_revision_id"]
            isOneToOne: false
            referencedRelation: "mold_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "equipment_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      equipment_photos: {
        Row: {
          photo_id: string
          equipment_id: string
          storage_path: string
          file_name: string | null
          file_size_bytes: number | null
          mime_type: string | null
          photo_type: string
          caption: string | null
          taken_at: string | null
          taken_by: string | null
          sort_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          photo_id?: string
          equipment_id: string
          storage_path: string
          file_name?: string | null
          file_size_bytes?: number | null
          mime_type?: string | null
          photo_type?: string
          caption?: string | null
          taken_at?: string | null
          taken_by?: string | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          photo_id?: string
          equipment_id?: string
          storage_path?: string
          file_name?: string | null
          file_size_bytes?: number | null
          mime_type?: string | null
          photo_type?: string
          caption?: string | null
          taken_at?: string | null
          taken_by?: string | null
          sort_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_photos_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
          {
            foreignKeyName: "equipment_photos_taken_by_fkey"
            columns: ["taken_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          }
        ]
      }
      equipment_assignments: {
        Row: {
          assignment_id: string
          created_at: string | null
          is_default: boolean | null
          notes: string | null
          primary_equipment_id: string
          related_equipment_id: string
          relationship_type: string
        }
        Insert: {
          assignment_id?: string
          created_at?: string | null
          is_default?: boolean | null
          notes?: string | null
          primary_equipment_id: string
          related_equipment_id: string
          relationship_type?: string
        }
        Update: {
          assignment_id?: string
          created_at?: string | null
          is_default?: boolean | null
          notes?: string | null
          primary_equipment_id?: string
          related_equipment_id?: string
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_assignments_primary_equipment_id_fkey"
            columns: ["primary_equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
          {
            foreignKeyName: "equipment_assignments_related_equipment_id_fkey"
            columns: ["related_equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
        ]
      }
      equipment_history: {
        Row: {
          action_date: string
          action_type: string
          created_at: string | null
          description: string | null
          equipment_id: string
          from_company_id: string | null
          from_location: string | null
          history_id: string
          job_id: string | null
          performed_by: string | null
          to_company_id: string | null
          to_location: string | null
        }
        Insert: {
          action_date?: string
          action_type: string
          created_at?: string | null
          description?: string | null
          equipment_id: string
          from_company_id?: string | null
          from_location?: string | null
          history_id?: string
          job_id?: string | null
          performed_by?: string | null
          to_company_id?: string | null
          to_location?: string | null
        }
        Update: {
          action_date?: string
          action_type?: string
          created_at?: string | null
          description?: string | null
          equipment_id?: string
          from_company_id?: string | null
          from_location?: string | null
          history_id?: string
          job_id?: string | null
          performed_by?: string | null
          to_company_id?: string | null
          to_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_history_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
          {
            foreignKeyName: "equipment_history_from_company_id_fkey"
            columns: ["from_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_history_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "equipment_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "equipment_history_to_company_id_fkey"
            columns: ["to_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      equipment_ship_logs: {
        Row: {
          company_id: string | null
          created_at: string | null
          cutter_id: string | null
          from_company_id: string | null
          item_type_id: number | null
          notes: string | null
          physical_mold_id: string | null
          ship_date: string | null
          ship_id: string
          ship_item_name: string | null
          ship_status: string | null
          to_company_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          cutter_id?: string | null
          from_company_id?: string | null
          item_type_id?: number | null
          notes?: string | null
          physical_mold_id?: string | null
          ship_date?: string | null
          ship_id?: string
          ship_item_name?: string | null
          ship_status?: string | null
          to_company_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          cutter_id?: string | null
          from_company_id?: string | null
          item_type_id?: number | null
          notes?: string | null
          physical_mold_id?: string | null
          ship_date?: string | null
          ship_id?: string
          ship_item_name?: string | null
          ship_status?: string | null
          to_company_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_ship_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_ship_logs_cutter_id_fkey"
            columns: ["cutter_id"]
            isOneToOne: false
            referencedRelation: "cutters"
            referencedColumns: ["cutter_id"]
          },
          {
            foreignKeyName: "equipment_ship_logs_from_company_id_fkey"
            columns: ["from_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_ship_logs_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["item_type_id"]
          },
          {
            foreignKeyName: "equipment_ship_logs_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "equipment_ship_logs_to_company_id_fkey"
            columns: ["to_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      equipment_status_logs: {
        Row: {
          cutter_id: string | null
          destination_id: string | null
          employee_id: string | null
          item_type_id: number | null
          log_id: string
          logged_at: string | null
          notes: string | null
          physical_mold_id: string | null
          session_id: string | null
          session_name: string | null
          status: string | null
        }
        Insert: {
          cutter_id?: string | null
          destination_id?: string | null
          employee_id?: string | null
          item_type_id?: number | null
          log_id?: string
          logged_at?: string | null
          notes?: string | null
          physical_mold_id?: string | null
          session_id?: string | null
          session_name?: string | null
          status?: string | null
        }
        Update: {
          cutter_id?: string | null
          destination_id?: string | null
          employee_id?: string | null
          item_type_id?: number | null
          log_id?: string
          logged_at?: string | null
          notes?: string | null
          physical_mold_id?: string | null
          session_id?: string | null
          session_name?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_status_logs_cutter_id_fkey"
            columns: ["cutter_id"]
            isOneToOne: false
            referencedRelation: "cutters"
            referencedColumns: ["cutter_id"]
          },
          {
            foreignKeyName: "equipment_status_logs_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["destination_id"]
          },
          {
            foreignKeyName: "equipment_status_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "equipment_status_logs_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["item_type_id"]
          },
          {
            foreignKeyName: "equipment_status_logs_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      forming_conditions: {
        Row: {
          cav_type_id: string | null
          condition_id: string
          cooling_base_type: string | null
          created_at: string | null
          cutter_code: string | null
          f2_heater_zones: Json | null
          f3_timing: Json | null
          f4_process: Json | null
          f5_extra: Json | null
          frame_type: string | null
          heater_position: number | null
          is_verified: boolean | null
          last_used_date: string | null
          machine_id: string
          notes: string | null
          plug_used: boolean | null
          product_id: string
          stacking_lower: string | null
          stacking_upper: string | null
          updated_at: string | null
        }
        Insert: {
          cav_type_id?: string | null
          condition_id?: string
          cooling_base_type?: string | null
          created_at?: string | null
          cutter_code?: string | null
          f2_heater_zones?: Json | null
          f3_timing?: Json | null
          f4_process?: Json | null
          f5_extra?: Json | null
          frame_type?: string | null
          heater_position?: number | null
          is_verified?: boolean | null
          last_used_date?: string | null
          machine_id: string
          notes?: string | null
          plug_used?: boolean | null
          product_id: string
          stacking_lower?: string | null
          stacking_upper?: string | null
          updated_at?: string | null
        }
        Update: {
          cav_type_id?: string | null
          condition_id?: string
          cooling_base_type?: string | null
          created_at?: string | null
          cutter_code?: string | null
          f2_heater_zones?: Json | null
          f3_timing?: Json | null
          f4_process?: Json | null
          f5_extra?: Json | null
          frame_type?: string | null
          heater_position?: number | null
          is_verified?: boolean | null
          last_used_date?: string | null
          machine_id?: string
          notes?: string | null
          plug_used?: boolean | null
          product_id?: string
          stacking_lower?: string | null
          stacking_upper?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forming_conditions_cav_type_id_fkey"
            columns: ["cav_type_id"]
            isOneToOne: false
            referencedRelation: "cav_types"
            referencedColumns: ["cav_type_id"]
          },
          {
            foreignKeyName: "forming_conditions_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "forming_conditions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      inspections: {
        Row: {
          created_at: string | null
          file_path: string | null
          good_qty: number | null
          inspected_qty: number | null
          inspection_date: string
          inspection_id: string
          inspection_stage: string | null
          inspector_id: string | null
          lot_id: string | null
          ng_category: string | null
          ng_qty: number | null
          notes: string | null
          po_id: string | null
          production_lot_id: string | null
          result: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_path?: string | null
          good_qty?: number | null
          inspected_qty?: number | null
          inspection_date: string
          inspection_id?: string
          inspection_stage?: string | null
          inspector_id?: string | null
          lot_id?: string | null
          ng_category?: string | null
          ng_qty?: number | null
          notes?: string | null
          po_id?: string | null
          production_lot_id?: string | null
          result?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string | null
          good_qty?: number | null
          inspected_qty?: number | null
          inspection_date?: string
          inspection_id?: string
          inspection_stage?: string | null
          inspector_id?: string | null
          lot_id?: string | null
          ng_category?: string | null
          ng_qty?: number | null
          notes?: string | null
          po_id?: string | null
          production_lot_id?: string | null
          result?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inspections_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["lot_id"]
          },
          {
            foreignKeyName: "inspections_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["po_id"]
          },
          {
            foreignKeyName: "inspections_production_lot_id_fkey"
            columns: ["production_lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["lot_id"]
          },
        ]
      }
      inventory_schedules: {
        Row: {
          assigned_to: string | null
          is_active: boolean | null
          last_completed: string | null
          mold_owner_id: string | null
          month_of_year: number | null
          next_due: string | null
          notes: string | null
          reminder_days: number | null
          schedule_id: string
          schedule_type: string | null
        }
        Insert: {
          assigned_to?: string | null
          is_active?: boolean | null
          last_completed?: string | null
          mold_owner_id?: string | null
          month_of_year?: number | null
          next_due?: string | null
          notes?: string | null
          reminder_days?: number | null
          schedule_id?: string
          schedule_type?: string | null
        }
        Update: {
          assigned_to?: string | null
          is_active?: boolean | null
          last_completed?: string | null
          mold_owner_id?: string | null
          month_of_year?: number | null
          next_due?: string | null
          notes?: string | null
          reminder_days?: number | null
          schedule_id?: string
          schedule_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_schedules_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "inventory_schedules_mold_owner_id_fkey"
            columns: ["mold_owner_id"]
            isOneToOne: false
            referencedRelation: "mold_owners"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      item_types: {
        Row: {
          item_type_code: string
          item_type_id: number
          item_type_name_ja: string
          item_type_name_vi: string | null
        }
        Insert: {
          item_type_code: string
          item_type_id?: number
          item_type_name_ja: string
          item_type_name_vi?: string | null
        }
        Update: {
          item_type_code?: string
          item_type_id?: number
          item_type_name_ja?: string
          item_type_name_vi?: string | null
        }
        Relationships: []
      }
      job_step_dependencies: {
        Row: {
          created_at: string | null
          dependency_id: string
          dependency_type: string
          predecessor_step_id: string
          successor_step_id: string
        }
        Insert: {
          created_at?: string | null
          dependency_id?: string
          dependency_type?: string
          predecessor_step_id: string
          successor_step_id: string
        }
        Update: {
          created_at?: string | null
          dependency_id?: string
          dependency_type?: string
          predecessor_step_id?: string
          successor_step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_step_dependencies_predecessor_step_id_fkey"
            columns: ["predecessor_step_id"]
            isOneToOne: false
            referencedRelation: "job_steps"
            referencedColumns: ["step_id"]
          },
          {
            foreignKeyName: "job_step_dependencies_successor_step_id_fkey"
            columns: ["successor_step_id"]
            isOneToOne: false
            referencedRelation: "job_steps"
            referencedColumns: ["step_id"]
          },
        ]
      }
      job_steps: {
        Row: {
          actual_hours: number | null
          arrangement: string | null
          assigned_to: string | null
          baseline_end: string | null
          baseline_start: string | null
          condition: string | null
          created_at: string | null
          deadline: string | null
          drawing_receipt_date: string | null
          estimated_hours: number | null
          is_overtime: boolean | null
          item_type_id: number | null
          job_id: string
          machine_id: string | null
          machining_location: string | null
          manufacture_location: string | null
          material_spec: string | null
          notes: string | null
          outsource_company: string | null
          planned_end: string | null
          planned_hours: number | null
          planned_start: string | null
          processing_item_id: number | null
          processing_status_id: number | null
          progress_percent: number | null
          quantity: number | null
          set_info: string | null
          step_id: string
          step_name: string
          step_no: number
          step_status: string | null
          tehai_info: string | null
          track: string | null
          type_code: string | null
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          arrangement?: string | null
          assigned_to?: string | null
          baseline_end?: string | null
          baseline_start?: string | null
          condition?: string | null
          created_at?: string | null
          deadline?: string | null
          drawing_receipt_date?: string | null
          estimated_hours?: number | null
          is_overtime?: boolean | null
          item_type_id?: number | null
          job_id: string
          machine_id?: string | null
          machining_location?: string | null
          manufacture_location?: string | null
          material_spec?: string | null
          notes?: string | null
          outsource_company?: string | null
          planned_end?: string | null
          planned_hours?: number | null
          planned_start?: string | null
          processing_item_id?: number | null
          processing_status_id?: number | null
          progress_percent?: number | null
          quantity?: number | null
          set_info?: string | null
          step_id?: string
          step_name: string
          step_no: number
          step_status?: string | null
          tehai_info?: string | null
          track?: string | null
          type_code?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          arrangement?: string | null
          assigned_to?: string | null
          baseline_end?: string | null
          baseline_start?: string | null
          condition?: string | null
          created_at?: string | null
          deadline?: string | null
          drawing_receipt_date?: string | null
          estimated_hours?: number | null
          is_overtime?: boolean | null
          item_type_id?: number | null
          job_id?: string
          machine_id?: string | null
          machining_location?: string | null
          manufacture_location?: string | null
          material_spec?: string | null
          notes?: string | null
          outsource_company?: string | null
          planned_end?: string | null
          planned_hours?: number | null
          planned_start?: string | null
          processing_item_id?: number | null
          processing_status_id?: number | null
          progress_percent?: number | null
          quantity?: number | null
          set_info?: string | null
          step_id?: string
          step_name?: string
          step_no?: number
          step_status?: string | null
          tehai_info?: string | null
          track?: string | null
          type_code?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_steps_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "job_steps_item_type_id_fkey"
            columns: ["item_type_id"]
            isOneToOne: false
            referencedRelation: "item_types"
            referencedColumns: ["item_type_id"]
          },
          {
            foreignKeyName: "job_steps_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "job_steps_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "job_steps_outsource_company_fkey"
            columns: ["outsource_company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_steps_processing_item_id_fkey"
            columns: ["processing_item_id"]
            isOneToOne: false
            referencedRelation: "processing_items"
            referencedColumns: ["processing_item_id"]
          },
          {
            foreignKeyName: "job_steps_processing_status_id_fkey"
            columns: ["processing_status_id"]
            isOneToOne: false
            referencedRelation: "processing_statuses"
            referencedColumns: ["status_id"]
          },
        ]
      }
      job_types: {
        Row: {
          category: string | null
          description: string | null
          job_type_id: string
          job_type_name_ja: string
          job_type_name_vi: string
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          job_type_id: string
          job_type_name_ja: string
          job_type_name_vi: string
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          description?: string | null
          job_type_id?: string
          job_type_name_ja?: string
          job_type_name_vi?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          approved: boolean | null
          auxiliary_equipment_id: string | null
          case_id: string | null
          company_id: string | null
          completed_date: string | null
          created_at: string | null
          deadline: string | null
          design_revision_id: string | null
          drawing_check_on_repro: boolean | null
          equipment_id: string | null
          estimated_hours: number | null
          has_plug: boolean | null
          inventory_check_on_repro: boolean | null
          job_category: string | null
          job_code: string
          job_id: string
          job_name: string
          job_status: string | null
          job_type_id: string | null
          legacy_id: string | null
          mold_deadline: string | null
          mold_track_status: string | null
          mold_work_order_id: string | null
          month_period: number | null
          notes: string | null
          outsource_company: string | null
          overall_progress: number | null
          physical_mold_id: string | null
          plug_track_status: string | null
          price_quote_required: boolean | null
          priority: number | null
          processing_item_id: number | null
          product_id: string | null
          qty_sent_to_office: number | null
          quantity: number | null
          release_type: string | null
          responsible_id: string | null
          separate_cutter: boolean | null
          ship_date: string | null
          start_date: string | null
          unit_price: number | null
          updated_at: string | null
          updated_by: string | null
          work_order_id: string | null
          year_period: number | null
        }
        Insert: {
          approved?: boolean | null
          auxiliary_equipment_id?: string | null
          case_id?: string | null
          company_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          deadline?: string | null
          design_revision_id?: string | null
          drawing_check_on_repro?: boolean | null
          equipment_id?: string | null
          estimated_hours?: number | null
          has_plug?: boolean | null
          inventory_check_on_repro?: boolean | null
          job_category?: string | null
          job_code: string
          job_id?: string
          job_name: string
          job_status?: string | null
          job_type_id?: string | null
          legacy_id?: string | null
          mold_deadline?: string | null
          mold_track_status?: string | null
          mold_work_order_id?: string | null
          month_period?: number | null
          notes?: string | null
          outsource_company?: string | null
          overall_progress?: number | null
          physical_mold_id?: string | null
          plug_track_status?: string | null
          price_quote_required?: boolean | null
          priority?: number | null
          processing_item_id?: number | null
          product_id?: string | null
          qty_sent_to_office?: number | null
          quantity?: number | null
          release_type?: string | null
          responsible_id?: string | null
          separate_cutter?: boolean | null
          ship_date?: string | null
          start_date?: string | null
          unit_price?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_order_id?: string | null
          year_period?: number | null
        }
        Update: {
          approved?: boolean | null
          auxiliary_equipment_id?: string | null
          case_id?: string | null
          company_id?: string | null
          completed_date?: string | null
          created_at?: string | null
          deadline?: string | null
          design_revision_id?: string | null
          drawing_check_on_repro?: boolean | null
          equipment_id?: string | null
          estimated_hours?: number | null
          has_plug?: boolean | null
          inventory_check_on_repro?: boolean | null
          job_category?: string | null
          job_code?: string
          job_id?: string
          job_name?: string
          job_status?: string | null
          job_type_id?: string | null
          legacy_id?: string | null
          mold_deadline?: string | null
          mold_track_status?: string | null
          mold_work_order_id?: string | null
          month_period?: number | null
          notes?: string | null
          outsource_company?: string | null
          overall_progress?: number | null
          physical_mold_id?: string | null
          plug_track_status?: string | null
          price_quote_required?: boolean | null
          priority?: number | null
          processing_item_id?: number | null
          product_id?: string | null
          qty_sent_to_office?: number | null
          quantity?: number | null
          release_type?: string | null
          responsible_id?: string | null
          separate_cutter?: boolean | null
          ship_date?: string | null
          start_date?: string | null
          unit_price?: number | null
          updated_at?: string | null
          updated_by?: string | null
          year_period?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_auxiliary_equipment_id_fkey"
            columns: ["auxiliary_equipment_id"]
            isOneToOne: false
            referencedRelation: "auxiliary_equipments"
            referencedColumns: ["equipment_id"]
          },
          {
            foreignKeyName: "jobs_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "business_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "jobs_design_revision_id_fkey"
            columns: ["design_revision_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "jobs_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
          {
            foreignKeyName: "jobs_job_type_id_fkey"
            columns: ["job_type_id"]
            isOneToOne: false
            referencedRelation: "job_types"
            referencedColumns: ["job_type_id"]
          },
          {
            foreignKeyName: "jobs_mold_work_order_id_fkey"
            columns: ["mold_work_order_id"]
            isOneToOne: false
            referencedRelation: "mold_work_orders"
            referencedColumns: ["mwo_id"]
          },
          {
            foreignKeyName: "jobs_outsource_company_fkey"
            columns: ["outsource_company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "jobs_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "jobs_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["wo_id"]
          },
          {
            foreignKeyName: "jobs_processing_item_id_fkey"
            columns: ["processing_item_id"]
            isOneToOne: false
            referencedRelation: "processing_items"
            referencedColumns: ["processing_item_id"]
          },
          {
            foreignKeyName: "jobs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "jobs_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      machine_cav_compatibility: {
        Row: {
          cav_type_id: string
          compat_id: string
          is_preferred: boolean | null
          machine_id: string
          notes: string | null
        }
        Insert: {
          cav_type_id: string
          compat_id?: string
          is_preferred?: boolean | null
          machine_id: string
          notes?: string | null
        }
        Update: {
          cav_type_id?: string
          compat_id?: string
          is_preferred?: boolean | null
          machine_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machine_cav_compatibility_cav_type_id_fkey"
            columns: ["cav_type_id"]
            isOneToOne: false
            referencedRelation: "cav_types"
            referencedColumns: ["cav_type_id"]
          },
          {
            foreignKeyName: "machine_cav_compatibility_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
        ]
      }
      machine_schedules: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          created_at: string | null
          id: string
          job_step_id: string | null
          machine_id: string
          notes: string | null
          planned_end: string
          planned_start: string
          status: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          id?: string
          job_step_id?: string | null
          machine_id: string
          notes?: string | null
          planned_end: string
          planned_start: string
          status?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          created_at?: string | null
          id?: string
          job_step_id?: string | null
          machine_id?: string
          notes?: string | null
          planned_end?: string
          planned_start?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machine_schedules_job_step_id_fkey"
            columns: ["job_step_id"]
            isOneToOne: false
            referencedRelation: "job_steps"
            referencedColumns: ["step_id"]
          },
          {
            foreignKeyName: "machine_schedules_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
        ]
      }
      machines: {
        Row: {
          created_at: string | null
          feed_length_mm: number | null
          is_active: boolean | null
          location: string | null
          machine_code: string
          machine_group: string | null
          machine_id: string
          machine_name: string
          machine_series: string | null
          machine_type: string
          manufacturer: string | null
          max_mold_length: number | null
          max_mold_width: number | null
          max_sheet_width: number | null
          model: string | null
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          feed_length_mm?: number | null
          is_active?: boolean | null
          location?: string | null
          machine_code: string
          machine_group?: string | null
          machine_id?: string
          machine_name: string
          machine_series?: string | null
          machine_type: string
          manufacturer?: string | null
          max_mold_length?: number | null
          max_mold_width?: number | null
          max_sheet_width?: number | null
          model?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          feed_length_mm?: number | null
          is_active?: boolean | null
          location?: string | null
          machine_code?: string
          machine_group?: string | null
          machine_id?: string
          machine_name?: string
          machine_series?: string | null
          machine_type?: string
          manufacturer?: string | null
          max_mold_length?: number | null
          max_mold_width?: number | null
          max_sheet_width?: number | null
          model?: string | null
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      material_change_logs: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          change_id: string
          created_at: string | null
          new_material_id: string | null
          notes: string | null
          old_material_id: string | null
          product_id: string | null
          reason: string | null
          requires_mold_mod: boolean | null
          requires_new_cutter: boolean | null
          status: string | null
          trial_job_id: string | null
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          change_id?: string
          created_at?: string | null
          new_material_id?: string | null
          notes?: string | null
          old_material_id?: string | null
          product_id?: string | null
          reason?: string | null
          requires_mold_mod?: boolean | null
          requires_new_cutter?: boolean | null
          status?: string | null
          trial_job_id?: string | null
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          change_id?: string
          created_at?: string | null
          new_material_id?: string | null
          notes?: string | null
          old_material_id?: string | null
          product_id?: string | null
          reason?: string | null
          requires_mold_mod?: boolean | null
          requires_new_cutter?: boolean | null
          status?: string | null
          trial_job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_material_change_trial_job"
            columns: ["trial_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "material_change_logs_new_material_id_fkey"
            columns: ["new_material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["material_id"]
          },
          {
            foreignKeyName: "material_change_logs_old_material_id_fkey"
            columns: ["old_material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["material_id"]
          },
          {
            foreignKeyName: "material_change_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      material_consumption_logs: {
        Row: {
          consumed_at: string | null
          consumed_qty: number
          is_packaging: boolean | null
          log_id: string
          machine_id: string | null
          material_id: string
          notes: string | null
          production_lot_id: string
          recorded_by: string | null
          unit: string
        }
        Insert: {
          consumed_at?: string | null
          consumed_qty: number
          is_packaging?: boolean | null
          log_id?: string
          machine_id?: string | null
          material_id: string
          notes?: string | null
          production_lot_id: string
          recorded_by?: string | null
          unit?: string
        }
        Update: {
          consumed_at?: string | null
          consumed_qty?: number
          is_packaging?: boolean | null
          log_id?: string
          machine_id?: string | null
          material_id?: string
          notes?: string | null
          production_lot_id?: string
          recorded_by?: string | null
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_consumption_logs_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "material_consumption_logs_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["material_id"]
          },
          {
            foreignKeyName: "material_consumption_logs_production_lot_id_fkey"
            columns: ["production_lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["lot_id"]
          },
          {
            foreignKeyName: "material_consumption_logs_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      material_inventory: {
        Row: {
          inventory_id: string
          kanban_status: string | null
          last_counted: string | null
          location: string | null
          material_id: string
          min_stock_alert: number | null
          quantity_kg: number | null
          quantity_meters: number | null
          quantity_reserved: number | null
          quantity_rolls: number | null
          updated_at: string | null
        }
        Insert: {
          inventory_id?: string
          kanban_status?: string | null
          last_counted?: string | null
          location?: string | null
          material_id: string
          min_stock_alert?: number | null
          quantity_kg?: number | null
          quantity_meters?: number | null
          quantity_reserved?: number | null
          quantity_rolls?: number | null
          updated_at?: string | null
        }
        Update: {
          inventory_id?: string
          kanban_status?: string | null
          last_counted?: string | null
          location?: string | null
          material_id?: string
          min_stock_alert?: number | null
          quantity_kg?: number | null
          quantity_meters?: number | null
          quantity_reserved?: number | null
          quantity_rolls?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_inventory_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["material_id"]
          },
        ]
      }
      material_stock: {
        Row: {
          created_at: string | null
          current_stock_m: number | null
          factory_site: string
          id: string
          is_antistatic: boolean | null
          is_silicon: boolean | null
          material_spec: string
          reserved_m: number | null
          snapshot_date: string | null
          supplier_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_stock_m?: number | null
          factory_site: string
          id?: string
          is_antistatic?: boolean | null
          is_silicon?: boolean | null
          material_spec: string
          reserved_m?: number | null
          snapshot_date?: string | null
          supplier_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_stock_m?: number | null
          factory_site?: string
          id?: string
          is_antistatic?: boolean | null
          is_silicon?: boolean | null
          material_spec?: string
          reserved_m?: number | null
          snapshot_date?: string | null
          supplier_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      material_transactions: {
        Row: {
          created_at: string | null
          employee_id: string | null
          material_id: string
          notes: string | null
          quantity: number | null
          reference_id: string | null
          reference_type: string | null
          transaction_id: string
          transaction_type: string
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          material_id: string
          notes?: string | null
          quantity?: number | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_id?: string
          transaction_type: string
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          material_id?: string
          notes?: string | null
          quantity?: number | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_id?: string
          transaction_type?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_transactions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "material_transactions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["material_id"]
          },
        ]
      }
      materials: {
        Row: {
          color: string | null
          conductivity_type: string | null
          created_at: string | null
          has_silicone: boolean | null
          is_active: boolean | null
          is_antistatic: boolean | null
          is_conductive: boolean | null
          manufacturer: string | null
          material_code: string
          material_grade: string | null
          material_id: string
          material_type: string
          notes: string | null
          supplier_id: string | null
          thickness_mm: number | null
          unit_price: number | null
          updated_at: string | null
          width_mm: number | null
        }
        Insert: {
          color?: string | null
          conductivity_type?: string | null
          created_at?: string | null
          has_silicone?: boolean | null
          is_active?: boolean | null
          is_antistatic?: boolean | null
          is_conductive?: boolean | null
          manufacturer?: string | null
          material_code: string
          material_grade?: string | null
          material_id?: string
          material_type: string
          notes?: string | null
          supplier_id?: string | null
          thickness_mm?: number | null
          unit_price?: number | null
          updated_at?: string | null
          width_mm?: number | null
        }
        Update: {
          color?: string | null
          conductivity_type?: string | null
          created_at?: string | null
          has_silicone?: boolean | null
          is_active?: boolean | null
          is_antistatic?: boolean | null
          is_conductive?: boolean | null
          manufacturer?: string | null
          material_code?: string
          material_grade?: string | null
          material_id?: string
          material_type?: string
          notes?: string | null
          supplier_id?: string | null
          thickness_mm?: number | null
          unit_price?: number | null
          updated_at?: string | null
          width_mm?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      mold_design_cutters: {
        Row: {
          cutter_id: string
          date_entry: string | null
          equipment_id: string | null
          id: string
          mold_design_id: string
          notes: string | null
        }
        Insert: {
          cutter_id: string
          date_entry?: string | null
          equipment_id?: string | null
          id?: string
          mold_design_id: string
          notes?: string | null
        }
        Update: {
          cutter_id?: string
          date_entry?: string | null
          equipment_id?: string | null
          id?: string
          mold_design_id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_design_cutters_cutter_id_fkey"
            columns: ["cutter_id"]
            isOneToOne: false
            referencedRelation: "cutters"
            referencedColumns: ["cutter_id"]
          },
          {
            foreignKeyName: "mold_design_cutters_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["equipment_id"]
          },
        ]
      }

      mold_disposal_logs: {
        Row: {
          certificate_file: string | null
          certificate_no: string | null
          certificate_sent: boolean | null
          created_at: string | null
          disposal_fee: number | null
          disposal_id: string
          disposal_no: string | null
          disposal_type: string | null
          disposed_by: string | null
          disposed_date: string | null
          mold_code: string | null
          notes: string | null
          permission_by: string | null
          permission_date: string | null
          photo_after: string | null
          photo_before: string | null
          physical_mold_id: string | null
          registered_by: string | null
          registered_date: string | null
          requested_by_company: string | null
          requested_date: string | null
          status: string | null
        }
        Insert: {
          certificate_file?: string | null
          certificate_no?: string | null
          certificate_sent?: boolean | null
          created_at?: string | null
          disposal_fee?: number | null
          disposal_id?: string
          disposal_no?: string | null
          disposal_type?: string | null
          disposed_by?: string | null
          disposed_date?: string | null
          mold_code?: string | null
          notes?: string | null
          permission_by?: string | null
          permission_date?: string | null
          photo_after?: string | null
          photo_before?: string | null
          physical_mold_id?: string | null
          registered_by?: string | null
          registered_date?: string | null
          requested_by_company?: string | null
          requested_date?: string | null
          status?: string | null
        }
        Update: {
          certificate_file?: string | null
          certificate_no?: string | null
          certificate_sent?: boolean | null
          created_at?: string | null
          disposal_fee?: number | null
          disposal_id?: string
          disposal_no?: string | null
          disposal_type?: string | null
          disposed_by?: string | null
          disposed_date?: string | null
          mold_code?: string | null
          notes?: string | null
          permission_by?: string | null
          permission_date?: string | null
          photo_after?: string | null
          photo_before?: string | null
          physical_mold_id?: string | null
          registered_by?: string | null
          registered_date?: string | null
          requested_by_company?: string | null
          requested_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_disposal_logs_disposed_by_fkey"
            columns: ["disposed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_disposal_logs_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "mold_disposal_logs_registered_by_fkey"
            columns: ["registered_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_disposal_logs_requested_by_company_fkey"
            columns: ["requested_by_company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      mold_inventory_checks: {
        Row: {
          check_code: string
          check_id: string
          check_type: string | null
          completed_by: string | null
          completed_date: string | null
          confirmed_count: number | null
          created_at: string | null
          deadline: string | null
          missing_count: number | null
          mold_owner_id: string | null
          notes: string | null
          report_file: string | null
          reported_date: string | null
          requested_by: string | null
          requested_date: string | null
          status: string | null
          total_molds: number | null
        }
        Insert: {
          check_code: string
          check_id?: string
          check_type?: string | null
          completed_by?: string | null
          completed_date?: string | null
          confirmed_count?: number | null
          created_at?: string | null
          deadline?: string | null
          missing_count?: number | null
          mold_owner_id?: string | null
          notes?: string | null
          report_file?: string | null
          reported_date?: string | null
          requested_by?: string | null
          requested_date?: string | null
          status?: string | null
          total_molds?: number | null
        }
        Update: {
          check_code?: string
          check_id?: string
          check_type?: string | null
          completed_by?: string | null
          completed_date?: string | null
          confirmed_count?: number | null
          created_at?: string | null
          deadline?: string | null
          missing_count?: number | null
          mold_owner_id?: string | null
          notes?: string | null
          report_file?: string | null
          reported_date?: string | null
          requested_by?: string | null
          requested_date?: string | null
          status?: string | null
          total_molds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_inventory_checks_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_inventory_checks_mold_owner_id_fkey"
            columns: ["mold_owner_id"]
            isOneToOne: false
            referencedRelation: "mold_owners"
            referencedColumns: ["owner_id"]
          },
        ]
      }
      mold_inventory_items: {
        Row: {
          check_id: string
          confirmed_by: string | null
          confirmed_date: string | null
          is_confirmed: boolean | null
          item_id: string
          keeper_company_id: string | null
          mold_code: string | null
          notes: string | null
          photo_path: string | null
          physical_mold_id: string | null
          storage_location: string | null
        }
        Insert: {
          check_id: string
          confirmed_by?: string | null
          confirmed_date?: string | null
          is_confirmed?: boolean | null
          item_id?: string
          keeper_company_id?: string | null
          mold_code?: string | null
          notes?: string | null
          photo_path?: string | null
          physical_mold_id?: string | null
          storage_location?: string | null
        }
        Update: {
          check_id?: string
          confirmed_by?: string | null
          confirmed_date?: string | null
          is_confirmed?: boolean | null
          item_id?: string
          keeper_company_id?: string | null
          mold_code?: string | null
          notes?: string | null
          photo_path?: string | null
          physical_mold_id?: string | null
          storage_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_inventory_items_check_id_fkey"
            columns: ["check_id"]
            isOneToOne: false
            referencedRelation: "mold_inventory_checks"
            referencedColumns: ["check_id"]
          },
          {
            foreignKeyName: "mold_inventory_items_keeper_company_id_fkey"
            columns: ["keeper_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "mold_inventory_items_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      mold_loan_certificates: {
        Row: {
          certificate_file: string | null
          certificate_id: string
          certificate_no: string | null
          created_at: string | null
          issued_by: string | null
          issued_date: string | null
          mold_owner_id: string | null
          notes: string | null
          prepared_by: string | null
          requested_date: string | null
          status: string | null
        }
        Insert: {
          certificate_file?: string | null
          certificate_id?: string
          certificate_no?: string | null
          created_at?: string | null
          issued_by?: string | null
          issued_date?: string | null
          mold_owner_id?: string | null
          notes?: string | null
          prepared_by?: string | null
          requested_date?: string | null
          status?: string | null
        }
        Update: {
          certificate_file?: string | null
          certificate_id?: string
          certificate_no?: string | null
          created_at?: string | null
          issued_by?: string | null
          issued_date?: string | null
          mold_owner_id?: string | null
          notes?: string | null
          prepared_by?: string | null
          requested_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_loan_certificates_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_loan_certificates_mold_owner_id_fkey"
            columns: ["mold_owner_id"]
            isOneToOne: false
            referencedRelation: "mold_owners"
            referencedColumns: ["owner_id"]
          },
          {
            foreignKeyName: "mold_loan_certificates_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      mold_location_history: {
        Row: {
          location_log_id: string
          moved_at: string | null
          moved_by: string | null
          new_rack_layer_id: string | null
          notes: string | null
          old_rack_layer_id: string | null
          physical_mold_id: string
        }
        Insert: {
          location_log_id?: string
          moved_at?: string | null
          moved_by?: string | null
          new_rack_layer_id?: string | null
          notes?: string | null
          old_rack_layer_id?: string | null
          physical_mold_id: string
        }
        Update: {
          location_log_id?: string
          moved_at?: string | null
          moved_by?: string | null
          new_rack_layer_id?: string | null
          notes?: string | null
          old_rack_layer_id?: string | null
          physical_mold_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mold_location_history_moved_by_fkey"
            columns: ["moved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_location_history_new_rack_layer_id_fkey"
            columns: ["new_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mold_location_history_old_rack_layer_id_fkey"
            columns: ["old_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mold_location_history_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      mold_maintenance: {
        Row: {
          completed_date: string | null
          cost: number | null
          created_at: string | null
          employee_id: string | null
          maintenance_id: string
          maintenance_type: string
          notes: string | null
          physical_mold_id: string
          reason: string | null
          request_date: string | null
          result: string | null
          status: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          employee_id?: string | null
          maintenance_id?: string
          maintenance_type: string
          notes?: string | null
          physical_mold_id: string
          reason?: string | null
          request_date?: string | null
          result?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          employee_id?: string | null
          maintenance_id?: string
          maintenance_type?: string
          notes?: string | null
          physical_mold_id?: string
          reason?: string | null
          request_date?: string | null
          result?: string | null
          status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_maintenance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_maintenance_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "mold_maintenance_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      mold_material_bom: {
        Row: {
          bom_id: string
          component_name: string | null
          created_at: string | null
          material_id: string | null
          mold_master_id: string | null
          notes: string | null
          ppwr_reportable: boolean | null
          quantity_per_shot: number | null
          unit: string | null
        }
        Insert: {
          bom_id?: string
          component_name?: string | null
          created_at?: string | null
          material_id?: string | null
          mold_master_id?: string | null
          notes?: string | null
          ppwr_reportable?: boolean | null
          quantity_per_shot?: number | null
          unit?: string | null
        }
        Update: {
          bom_id?: string
          component_name?: string | null
          created_at?: string | null
          material_id?: string | null
          mold_master_id?: string | null
          notes?: string | null
          ppwr_reportable?: boolean | null
          quantity_per_shot?: number | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_material_bom_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["material_id"]
          },
        ]
      }
      mold_measurements: {
        Row: {
          created_at: string | null
          measured_by: string | null
          measured_date: string | null
          measurement_id: string
          mold_height_mm: number | null
          mold_length_mm: number | null
          mold_weight_kg: number | null
          mold_width_mm: number | null
          notes: string | null
          physical_mold_id: string | null
          purpose: string | null
          requested_by: string | null
        }
        Insert: {
          created_at?: string | null
          measured_by?: string | null
          measured_date?: string | null
          measurement_id?: string
          mold_height_mm?: number | null
          mold_length_mm?: number | null
          mold_weight_kg?: number | null
          mold_width_mm?: number | null
          notes?: string | null
          physical_mold_id?: string | null
          purpose?: string | null
          requested_by?: string | null
        }
        Update: {
          created_at?: string | null
          measured_by?: string | null
          measured_date?: string | null
          measurement_id?: string
          mold_height_mm?: number | null
          mold_length_mm?: number | null
          mold_weight_kg?: number | null
          mold_width_mm?: number | null
          notes?: string | null
          physical_mold_id?: string | null
          purpose?: string | null
          requested_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_measurements_measured_by_fkey"
            columns: ["measured_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_measurements_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      mold_name_history: {
        Row: {
          change_reason: string | null
          changed_at: string | null
          changed_by: string | null
          history_id: string
          new_physical_stamp: string | null
          new_system_code: string
          old_physical_stamp: string | null
          old_system_code: string | null
          physical_mold_id: string
        }
        Insert: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          history_id?: string
          new_physical_stamp?: string | null
          new_system_code: string
          old_physical_stamp?: string | null
          old_system_code?: string | null
          physical_mold_id: string
        }
        Update: {
          change_reason?: string | null
          changed_at?: string | null
          changed_by?: string | null
          history_id?: string
          new_physical_stamp?: string | null
          new_system_code?: string
          old_physical_stamp?: string | null
          old_system_code?: string | null
          physical_mold_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mold_name_history_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      mold_owner_qr_labels: {
        Row: {
          applied_by: string | null
          applied_date: string | null
          created_at: string | null
          is_active: boolean | null
          label_id: string
          label_type: string | null
          mold_owner_id: string | null
          notes: string | null
          photo_path: string | null
          physical_mold_id: string | null
          qr_code: string | null
        }
        Insert: {
          applied_by?: string | null
          applied_date?: string | null
          created_at?: string | null
          is_active?: boolean | null
          label_id?: string
          label_type?: string | null
          mold_owner_id?: string | null
          notes?: string | null
          photo_path?: string | null
          physical_mold_id?: string | null
          qr_code?: string | null
        }
        Update: {
          applied_by?: string | null
          applied_date?: string | null
          created_at?: string | null
          is_active?: boolean | null
          label_id?: string
          label_type?: string | null
          mold_owner_id?: string | null
          notes?: string | null
          photo_path?: string | null
          physical_mold_id?: string | null
          qr_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_owner_qr_labels_applied_by_fkey"
            columns: ["applied_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_owner_qr_labels_mold_owner_id_fkey"
            columns: ["mold_owner_id"]
            isOneToOne: false
            referencedRelation: "mold_owners"
            referencedColumns: ["owner_id"]
          },
          {
            foreignKeyName: "mold_owner_qr_labels_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      mold_owners: {
        Row: {
          company_id: string
          created_at: string | null
          is_active: boolean | null
          notes: string | null
          owner_code: string
          owner_id: string
          owner_name_ja: string
          owner_name_kana: string | null
          owner_name_romaji: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          is_active?: boolean | null
          notes?: string | null
          owner_code: string
          owner_id?: string
          owner_name_ja: string
          owner_name_kana?: string | null
          owner_name_romaji?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          is_active?: boolean | null
          notes?: string | null
          owner_code?: string
          owner_id?: string
          owner_name_ja?: string
          owner_name_kana?: string | null
          owner_name_romaji?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_owners_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      mold_photos: {
        Row: {
          created_at: string | null
          file_path: string
          notes: string | null
          photo_id: string
          photo_type: string | null
          physical_mold_id: string | null
          taken_by: string | null
          taken_date: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          notes?: string | null
          photo_id?: string
          photo_type?: string | null
          physical_mold_id?: string | null
          taken_by?: string | null
          taken_date?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          notes?: string | null
          photo_id?: string
          photo_type?: string | null
          physical_mold_id?: string | null
          taken_by?: string | null
          taken_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_photos_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "mold_photos_taken_by_fkey"
            columns: ["taken_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      mold_return_logs: {
        Row: {
          created_at: string | null
          deadline: string | null
          disposal_request_no: string | null
          drawing_no: string | null
          includes_drawing: boolean | null
          includes_parts: boolean | null
          includes_receipt: boolean | null
          mold_code: string | null
          notes: string | null
          physical_mold_id: string | null
          prepared_by: string | null
          requested_by_company: string | null
          requested_date: string | null
          return_id: string
          shipped_date: string | null
          shipping_cost: number | null
          shipping_slip_no: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          disposal_request_no?: string | null
          drawing_no?: string | null
          includes_drawing?: boolean | null
          includes_parts?: boolean | null
          includes_receipt?: boolean | null
          mold_code?: string | null
          notes?: string | null
          physical_mold_id?: string | null
          prepared_by?: string | null
          requested_by_company?: string | null
          requested_date?: string | null
          return_id?: string
          shipped_date?: string | null
          shipping_cost?: number | null
          shipping_slip_no?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          disposal_request_no?: string | null
          drawing_no?: string | null
          includes_drawing?: boolean | null
          includes_parts?: boolean | null
          includes_receipt?: boolean | null
          mold_code?: string | null
          notes?: string | null
          physical_mold_id?: string | null
          prepared_by?: string | null
          requested_by_company?: string | null
          requested_date?: string | null
          return_id?: string
          shipped_date?: string | null
          shipping_cost?: number | null
          shipping_slip_no?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_return_logs_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "mold_return_logs_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_return_logs_requested_by_company_fkey"
            columns: ["requested_by_company"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      mold_revisions: {
        Row: {
          change_description: string | null
          created_at: string | null
          design_revision_id: string | null
          effective_date: string | null
          inherited_from_mold_id: string | null
          is_active: boolean | null
          legacy_id: string | null
          legacy_specs: Json | null
          product_id: string | null
          revision_code: string | null
          revision_id: string
          revision_name: string
          revision_reason: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          change_description?: string | null
          created_at?: string | null
          design_revision_id?: string | null
          effective_date?: string | null
          inherited_from_mold_id?: string | null
          is_active?: boolean | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          product_id?: string | null
          revision_code?: string | null
          revision_id?: string
          revision_name: string
          revision_reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          change_description?: string | null
          created_at?: string | null
          design_revision_id?: string | null
          effective_date?: string | null
          inherited_from_mold_id?: string | null
          is_active?: boolean | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          product_id?: string | null
          revision_code?: string | null
          revision_id?: string
          revision_name?: string
          revision_reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_revisions_design_revision_id_fkey"
            columns: ["design_revision_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "mold_revisions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      mold_work_orders: {
        Row: {
          approved_by_manager: string | null
          approved_by_mold_shop: string | null
          approved_by_molding_shop: string | null
          approved_by_procurement: string | null
          approved_by_qc: string | null
          approved_mold_shop: boolean
          approved_molding_shop: boolean
          approved_procurement: boolean
          cavities: number | null
          cavities_per_mold: number
          created_at: string
          created_by: string | null
          cut_method: string | null
          cutter_id: string | null
          frame_type: string | null
          instruction_notes: string | null
          machine_id: string | null
          material_type: string | null
          mold_sets_to_make: number
          mold_shop_type: string | null
          mold_size_x_mm: number | null
          mold_size_y_mm: number | null
          molding_shop_type: string | null
          mwo_code: string
          mwo_id: string
          mwo_status: string
          order_line_id: string | null
          physical_mold_id: string | null
          plug_exists: boolean | null
          product_size_x_mm: number | null
          product_size_y_mm: number | null
          req_aluminum_date: string | null
          req_cutter_date: string | null
          req_material_date: string | null
          req_mold_date: string | null
          req_molding_date: string | null
          req_plug_date: string | null
          sample_count: number | null
          sheet_width_mm: number | null
          shipping_date: string | null
          updated_at: string
          water_cooling_type: string | null
        }
        Insert: {
          approved_by_manager?: string | null
          approved_by_mold_shop?: string | null
          approved_by_molding_shop?: string | null
          approved_by_procurement?: string | null
          approved_by_qc?: string | null
          approved_mold_shop?: boolean
          approved_molding_shop?: boolean
          approved_procurement?: boolean
          cavities?: number | null
          cavities_per_mold?: number
          created_at?: string
          created_by?: string | null
          cut_method?: string | null
          cutter_id?: string | null
          frame_type?: string | null
          instruction_notes?: string | null
          machine_id?: string | null
          material_type?: string | null
          mold_sets_to_make?: number
          mold_shop_type?: string | null
          mold_size_x_mm?: number | null
          mold_size_y_mm?: number | null
          molding_shop_type?: string | null
          mwo_code: string
          mwo_id?: string
          mwo_status?: string
          order_line_id?: string | null
          physical_mold_id?: string | null
          plug_exists?: boolean | null
          product_size_x_mm?: number | null
          product_size_y_mm?: number | null
          req_aluminum_date?: string | null
          req_cutter_date?: string | null
          req_material_date?: string | null
          req_mold_date?: string | null
          req_molding_date?: string | null
          req_plug_date?: string | null
          sample_count?: number | null
          sheet_width_mm?: number | null
          shipping_date?: string | null
          updated_at?: string
          water_cooling_type?: string | null
        }
        Update: {
          approved_by_manager?: string | null
          approved_by_mold_shop?: string | null
          approved_by_molding_shop?: string | null
          approved_by_procurement?: string | null
          approved_by_qc?: string | null
          approved_mold_shop?: boolean
          approved_molding_shop?: boolean
          approved_procurement?: boolean
          cavities?: number | null
          cavities_per_mold?: number
          created_at?: string
          created_by?: string | null
          cut_method?: string | null
          cutter_id?: string | null
          frame_type?: string | null
          instruction_notes?: string | null
          machine_id?: string | null
          material_type?: string | null
          mold_sets_to_make?: number
          mold_shop_type?: string | null
          mold_size_x_mm?: number | null
          mold_size_y_mm?: number | null
          molding_shop_type?: string | null
          mwo_code?: string
          mwo_id?: string
          mwo_status?: string
          order_line_id?: string | null
          physical_mold_id?: string | null
          plug_exists?: boolean | null
          product_size_x_mm?: number | null
          product_size_y_mm?: number | null
          req_aluminum_date?: string | null
          req_cutter_date?: string | null
          req_material_date?: string | null
          req_mold_date?: string | null
          req_molding_date?: string | null
          req_plug_date?: string | null
          sample_count?: number | null
          sheet_width_mm?: number | null
          shipping_date?: string | null
          updated_at?: string
          water_cooling_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mold_work_orders_approved_by_manager_fkey"
            columns: ["approved_by_manager"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_work_orders_approved_by_mold_shop_fkey"
            columns: ["approved_by_mold_shop"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_work_orders_approved_by_molding_shop_fkey"
            columns: ["approved_by_molding_shop"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_work_orders_approved_by_procurement_fkey"
            columns: ["approved_by_procurement"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_work_orders_approved_by_qc_fkey"
            columns: ["approved_by_qc"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_work_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "mold_work_orders_cutter_id_fkey"
            columns: ["cutter_id"]
            isOneToOne: false
            referencedRelation: "cutters"
            referencedColumns: ["cutter_id"]
          },
          {
            foreignKeyName: "mold_work_orders_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "mold_work_orders_order_line_id_fkey"
            columns: ["order_line_id"]
            isOneToOne: false
            referencedRelation: "order_lines"
            referencedColumns: ["line_id"]
          },
          {
            foreignKeyName: "mold_work_orders_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      ng_detail_logs: {
        Row: {
          created_at: string | null
          inspection_id: string
          ng_category: string
          ng_description: string | null
          ng_log_id: string
          ng_qty: number
          photo_path: string | null
        }
        Insert: {
          created_at?: string | null
          inspection_id: string
          ng_category: string
          ng_description?: string | null
          ng_log_id?: string
          ng_qty?: number
          photo_path?: string | null
        }
        Update: {
          created_at?: string | null
          inspection_id?: string
          ng_category?: string
          ng_description?: string | null
          ng_log_id?: string
          ng_qty?: number
          photo_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ng_detail_logs_inspection_id_fkey"
            columns: ["inspection_id"]
            isOneToOne: false
            referencedRelation: "inspections"
            referencedColumns: ["inspection_id"]
          },
        ]
      }
      order_lines: {
        Row: {
          bagging_required: boolean | null
          box_type: string | null
          charge_type: string | null
          created_at: string | null
          delivery_site_id: string | null
          design_revision_id: string | null
          due_date: string | null
          is_free_sample: boolean | null
          line_id: string
          line_no: number
          line_status: string | null
          material_spec_id: string | null
          notes: string | null
          order_id: string
          packing_style: string | null
          priority: number | null
          product_id: string
          quantity: number
          sample_type: string | null
          ship_date: string | null
          shipping_notes: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          bagging_required?: boolean | null
          box_type?: string | null
          charge_type?: string | null
          created_at?: string | null
          delivery_site_id?: string | null
          design_revision_id?: string | null
          due_date?: string | null
          is_free_sample?: boolean | null
          line_id?: string
          line_no: number
          line_status?: string | null
          material_spec_id?: string | null
          notes?: string | null
          order_id: string
          packing_style?: string | null
          priority?: number | null
          product_id: string
          quantity: number
          sample_type?: string | null
          ship_date?: string | null
          shipping_notes?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          bagging_required?: boolean | null
          box_type?: string | null
          charge_type?: string | null
          created_at?: string | null
          delivery_site_id?: string | null
          design_revision_id?: string | null
          due_date?: string | null
          is_free_sample?: boolean | null
          line_id?: string
          line_no?: number
          line_status?: string | null
          material_spec_id?: string | null
          notes?: string | null
          order_id?: string
          packing_style?: string | null
          priority?: number | null
          product_id?: string
          quantity?: number
          sample_type?: string | null
          ship_date?: string | null
          shipping_notes?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_lines_delivery_site_id_fkey"
            columns: ["delivery_site_id"]
            isOneToOne: false
            referencedRelation: "delivery_sites"
            referencedColumns: ["site_id"]
          },
          {
            foreignKeyName: "order_lines_design_revision_id_fkey"
            columns: ["design_revision_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "order_lines_material_spec_id_fkey"
            columns: ["material_spec_id"]
            isOneToOne: false
            referencedRelation: "product_material_specs"
            referencedColumns: ["spec_id"]
          },
          {
            foreignKeyName: "order_lines_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_lines_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      orders: {
        Row: {
          company_id: string
          company_po: string | null
          created_at: string | null
          customer_order_no: string | null
          customer_product_code: string | null
          legacy_id: string | null
          lot_no: string | null
          mold_code_ref: string | null
          notes: string | null
          order_date: string
          order_id: string
          order_no: string
          order_source: string | null
          order_status: string | null
          order_type: string | null
          recipient_name: string | null
          requested_delivery: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          company_id: string
          company_po?: string | null
          created_at?: string | null
          customer_order_no?: string | null
          customer_product_code?: string | null
          legacy_id?: string | null
          lot_no?: string | null
          mold_code_ref?: string | null
          notes?: string | null
          order_date: string
          order_id?: string
          order_no: string
          order_source?: string | null
          order_status?: string | null
          order_type?: string | null
          recipient_name?: string | null
          requested_delivery?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          company_id?: string
          company_po?: string | null
          created_at?: string | null
          customer_order_no?: string | null
          customer_product_code?: string | null
          legacy_id?: string | null
          lot_no?: string | null
          mold_code_ref?: string | null
          notes?: string | null
          order_date?: string
          order_id?: string
          order_no?: string
          order_source?: string | null
          order_status?: string | null
          order_type?: string | null
          recipient_name?: string | null
          requested_delivery?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      physical_molds: {
        Row: {
          actual_height_mm: string | null
          actual_length_mm: string | null
          actual_weight: string | null
          actual_width_mm: string | null
          agreement_required_flag: boolean | null
          cav_type_id: string | null
          copy_number: number | null
          created_at: string | null
          current_rack_layer_id: string | null
          device_status: string | null
          display_name: string
          disposed_date: string | null
          inventory_required_flag: boolean | null
          keeper_company_id: string | null
          last_inventory_date: string | null
          latest_agreement_date: string | null
          latest_inventory_date: string | null
          latest_loan_doc_date: string | null
          latest_photo_date: string | null
          legacy_id: string | null
          legacy_specs: Json | null
          loan_required_flag: boolean | null
          manufacturing_date: string | null
          mold_entry_date: string | null
          mold_owner: string | null
          mold_owner_customer_id: string | null
          mold_revision_id: string | null
          mold_type: string | null
          notes: string | null
          on_checklist: boolean | null
          photo_required_flag: boolean | null
          photo_url: string | null
          physical_mold_id: string
          physical_stamp: string | null
          piece_count: number | null
          qr_uuid: string | null
          return_due_date: string | null
          returned_date: string | null
          surface_treatment: string | null
          system_code: string
          updated_at: string | null
          updated_by: string | null
          usage_status: string | null
        }
        Insert: {
          actual_height_mm?: string | null
          actual_length_mm?: string | null
          actual_weight?: string | null
          actual_width_mm?: string | null
          agreement_required_flag?: boolean | null
          cav_type_id?: string | null
          copy_number?: number | null
          created_at?: string | null
          current_rack_layer_id?: string | null
          device_status?: string | null
          display_name: string
          disposed_date?: string | null
          inventory_required_flag?: boolean | null
          keeper_company_id?: string | null
          last_inventory_date?: string | null
          latest_agreement_date?: string | null
          latest_inventory_date?: string | null
          latest_loan_doc_date?: string | null
          latest_photo_date?: string | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          loan_required_flag?: boolean | null
          manufacturing_date?: string | null
          mold_entry_date?: string | null
          mold_owner?: string | null
          mold_owner_customer_id?: string | null
          mold_revision_id?: string | null
          mold_type?: string | null
          notes?: string | null
          on_checklist?: boolean | null
          photo_required_flag?: boolean | null
          photo_url?: string | null
          physical_mold_id?: string
          physical_stamp?: string | null
          piece_count?: number | null
          qr_uuid?: string | null
          return_due_date?: string | null
          returned_date?: string | null
          surface_treatment?: string | null
          system_code: string
          updated_at?: string | null
          updated_by?: string | null
          usage_status?: string | null
        }
        Update: {
          actual_height_mm?: string | null
          actual_length_mm?: string | null
          actual_weight?: string | null
          actual_width_mm?: string | null
          agreement_required_flag?: boolean | null
          cav_type_id?: string | null
          copy_number?: number | null
          created_at?: string | null
          current_rack_layer_id?: string | null
          device_status?: string | null
          display_name?: string
          disposed_date?: string | null
          inventory_required_flag?: boolean | null
          keeper_company_id?: string | null
          last_inventory_date?: string | null
          latest_agreement_date?: string | null
          latest_inventory_date?: string | null
          latest_loan_doc_date?: string | null
          latest_photo_date?: string | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          loan_required_flag?: boolean | null
          manufacturing_date?: string | null
          mold_entry_date?: string | null
          mold_owner?: string | null
          mold_owner_customer_id?: string | null
          mold_revision_id?: string | null
          mold_type?: string | null
          notes?: string | null
          on_checklist?: boolean | null
          photo_required_flag?: boolean | null
          photo_url?: string | null
          physical_mold_id?: string
          physical_stamp?: string | null
          piece_count?: number | null
          qr_uuid?: string | null
          return_due_date?: string | null
          returned_date?: string | null
          surface_treatment?: string | null
          system_code?: string
          updated_at?: string | null
          updated_by?: string | null
          usage_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "physical_molds_cav_type_id_fkey"
            columns: ["cav_type_id"]
            isOneToOne: false
            referencedRelation: "cav_types"
            referencedColumns: ["cav_type_id"]
          },
          {
            foreignKeyName: "physical_molds_current_rack_layer_id_fkey"
            columns: ["current_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_molds_keeper_company_id_fkey"
            columns: ["keeper_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "physical_molds_mold_owner_customer_id_fkey"
            columns: ["mold_owner_customer_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "physical_molds_mold_revision_id_fkey"
            columns: ["mold_revision_id"]
            isOneToOne: false
            referencedRelation: "mold_revisions"
            referencedColumns: ["revision_id"]
          },
        ]
      }
      plastic_adjustment_log: {
        Row: {
          action_type: string
          change_length_m: number
          created_at: string | null
          id: string
          note: string | null
          operator_name: string | null
          roll_id: string
          work_log_id: string | null
        }
        Insert: {
          action_type: string
          change_length_m: number
          created_at?: string | null
          id?: string
          note?: string | null
          operator_name?: string | null
          roll_id: string
          work_log_id?: string | null
        }
        Update: {
          action_type?: string
          change_length_m?: number
          created_at?: string | null
          id?: string
          note?: string | null
          operator_name?: string | null
          roll_id?: string
          work_log_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plastic_adjustment_log_roll_id_fkey"
            columns: ["roll_id"]
            isOneToOne: false
            referencedRelation: "plastic_receipt_roll"
            referencedColumns: ["id"]
          },
        ]
      }
      plastic_manufacturer_map: {
        Row: {
          commercial_grade_code: string
          created_at: string | null
          is_active: boolean | null
          map_id: string
          mapping_status: string | null
          note: string | null
          plastic_id: string | null
          price_jpy_per_kg: number | null
          specific_gravity_kg_m3: number | null
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          commercial_grade_code: string
          created_at?: string | null
          is_active?: boolean | null
          map_id?: string
          mapping_status?: string | null
          note?: string | null
          plastic_id?: string | null
          price_jpy_per_kg?: number | null
          specific_gravity_kg_m3?: number | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          commercial_grade_code?: string
          created_at?: string | null
          is_active?: boolean | null
          map_id?: string
          mapping_status?: string | null
          note?: string | null
          plastic_id?: string | null
          price_jpy_per_kg?: number | null
          specific_gravity_kg_m3?: number | null
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plastic_manufacturer_map_plastic_id_fkey"
            columns: ["plastic_id"]
            isOneToOne: false
            referencedRelation: "plastic_master"
            referencedColumns: ["plastic_id"]
          },
          {
            foreignKeyName: "plastic_manufacturer_map_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["supplier_id"]
          },
        ]
      }
      plastic_master: {
        Row: {
          additive_flags: string | null
          additive_text_raw: string | null
          appearance_text_raw: string | null
          color: string | null
          color_code_raw: string | null
          color_name_normalized: string | null
          created_at: string | null
          electrical_property: string | null
          is_active: boolean | null
          plastic_code: string
          plastic_family: string
          plastic_id: string
          plastic_subtype: string | null
          properties: string | null
          remarks_raw: string | null
          silicone_status_normalized: string | null
          standard_length_m: number | null
          status_review: string | null
          thickness_mm: number
          updated_at: string | null
          width_mm: number
        }
        Insert: {
          additive_flags?: string | null
          additive_text_raw?: string | null
          appearance_text_raw?: string | null
          color?: string | null
          color_code_raw?: string | null
          color_name_normalized?: string | null
          created_at?: string | null
          electrical_property?: string | null
          is_active?: boolean | null
          plastic_code: string
          plastic_family: string
          plastic_id?: string
          plastic_subtype?: string | null
          properties?: string | null
          remarks_raw?: string | null
          silicone_status_normalized?: string | null
          standard_length_m?: number | null
          status_review?: string | null
          thickness_mm: number
          updated_at?: string | null
          width_mm: number
        }
        Update: {
          additive_flags?: string | null
          additive_text_raw?: string | null
          appearance_text_raw?: string | null
          color?: string | null
          color_code_raw?: string | null
          color_name_normalized?: string | null
          created_at?: string | null
          electrical_property?: string | null
          is_active?: boolean | null
          plastic_code?: string
          plastic_family?: string
          plastic_id?: string
          plastic_subtype?: string | null
          properties?: string | null
          remarks_raw?: string | null
          silicone_status_normalized?: string | null
          standard_length_m?: number | null
          status_review?: string | null
          thickness_mm?: number
          updated_at?: string | null
          width_mm?: number
        }
        Relationships: []
      }
      plastic_receipt: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          receipt_date: string
          receipt_no: string
          supplier_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
          receipt_date: string
          receipt_no: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          receipt_date?: string
          receipt_no?: string
          supplier_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      plastic_receipt_roll: {
        Row: {
          branch_id: string | null
          commercial_grade_code: string | null
          created_at: string | null
          current_length_m: number
          id: string
          location: string | null
          lot_no: string | null
          nominal_length_m: number
          notes: string | null
          plastic_id: string | null
          receipt_id: string | null
          received_length_m: number
          roll_barcode: string
          status: string | null
          supplier_name: string | null
          updated_at: string | null
          warehouse_location: string | null
        }
        Insert: {
          branch_id?: string | null
          commercial_grade_code?: string | null
          created_at?: string | null
          current_length_m: number
          id?: string
          location?: string | null
          lot_no?: string | null
          nominal_length_m: number
          notes?: string | null
          plastic_id?: string | null
          receipt_id?: string | null
          received_length_m: number
          roll_barcode: string
          status?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          warehouse_location?: string | null
        }
        Update: {
          branch_id?: string | null
          commercial_grade_code?: string | null
          created_at?: string | null
          current_length_m?: number
          id?: string
          location?: string | null
          lot_no?: string | null
          nominal_length_m?: number
          notes?: string | null
          plastic_id?: string | null
          receipt_id?: string | null
          received_length_m?: number
          roll_barcode?: string
          status?: string | null
          supplier_name?: string | null
          updated_at?: string | null
          warehouse_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plastic_receipt_roll_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "plastic_receipt_roll_plastic_id_fkey"
            columns: ["plastic_id"]
            isOneToOne: false
            referencedRelation: "plastic_master"
            referencedColumns: ["plastic_id"]
          },
          {
            foreignKeyName: "plastic_receipt_roll_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "plastic_receipt"
            referencedColumns: ["id"]
          },
        ]
      }
      processing_codes: {
        Row: {
          category: string | null
          created_at: string | null
          is_active: boolean | null
          processing_code_id: number
          processing_name: string
          sort_note: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          is_active?: boolean | null
          processing_code_id: number
          processing_name: string
          sort_note?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          is_active?: boolean | null
          processing_code_id?: number
          processing_name?: string
          sort_note?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      processing_items: {
        Row: {
          description: string | null
          item_name: string
          notes: string | null
          processing_item_id: number
        }
        Insert: {
          description?: string | null
          item_name: string
          notes?: string | null
          processing_item_id?: number
        }
        Update: {
          description?: string | null
          item_name?: string
          notes?: string | null
          processing_item_id?: number
        }
        Relationships: []
      }
      processing_statuses: {
        Row: {
          status_code: string
          status_id: number
          status_name_vi: string | null
        }
        Insert: {
          status_code: string
          status_id?: number
          status_name_vi?: string | null
        }
        Update: {
          status_code?: string
          status_id?: number
          status_name_vi?: string | null
        }
        Relationships: []
      }
      product_material_specs: {
        Row: {
          coating: string | null
          component_name: string | null
          created_at: string | null
          handling_notes: string | null
          is_default: boolean | null
          material_grade: string | null
          material_type: string
          notes: string | null
          product_id: string
          sheet_width_mm: number | null
          silicone: string | null
          spec_id: string
          static_charge: string | null
          thickness_mm: number | null
          updated_at: string | null
        }
        Insert: {
          coating?: string | null
          component_name?: string | null
          created_at?: string | null
          handling_notes?: string | null
          is_default?: boolean | null
          material_grade?: string | null
          material_type: string
          notes?: string | null
          product_id: string
          sheet_width_mm?: number | null
          silicone?: string | null
          spec_id?: string
          static_charge?: string | null
          thickness_mm?: number | null
          updated_at?: string | null
        }
        Update: {
          coating?: string | null
          component_name?: string | null
          created_at?: string | null
          handling_notes?: string | null
          is_default?: boolean | null
          material_grade?: string | null
          material_type?: string
          notes?: string | null
          product_id?: string
          sheet_width_mm?: number | null
          silicone?: string | null
          spec_id?: string
          static_charge?: string | null
          thickness_mm?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_material_specs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      production_instruction_tags: {
        Row: {
          created_at: string
          custom_label: string | null
          display_order: number
          instruction_id: string
          instruction_tag_id: string
          tag_code: string | null
        }
        Insert: {
          created_at?: string
          custom_label?: string | null
          display_order?: number
          instruction_id: string
          instruction_tag_id?: string
          tag_code?: string | null
        }
        Update: {
          created_at?: string
          custom_label?: string | null
          display_order?: number
          instruction_id?: string
          instruction_tag_id?: string
          tag_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_instruction_tags_instruction_id_fkey"
            columns: ["instruction_id"]
            isOneToOne: false
            referencedRelation: "production_instructions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_instruction_tags_tag_code_fkey"
            columns: ["tag_code"]
            isOneToOne: false
            referencedRelation: "production_tag_master"
            referencedColumns: ["tag_code"]
          },
        ]
      }
      production_instructions: {
        Row: {
          adhesive_sheet: boolean | null
          antistatic: boolean | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          daily_quantity: number | null
          delivery_site_id: string | null
          design_revision_id: string | null
          has_label: boolean | null
          id: string
          instruction_no: string
          instruction_type: string
          is_first_time: boolean | null
          issued_at: string | null
          lot_no: string | null
          material_spec: string | null
          material_stock_qty: number | null
          material_stock_warning: boolean | null
          material_thickness: number | null
          material_width: number | null
          notes: string | null
          order_id: string | null
          packaging_type: string | null
          physical_mold_id: string | null
          plain_case: boolean | null
          plain_label: boolean | null
          product_id: string | null
          production_site: string | null
          quantity_ordered: number
          quantity_per_stack: number | null
          recycled_pct: number | null
          requested_date: string
          silicon: boolean | null
          status: string
          surface_coating: boolean | null
          template_type: string
          updated_at: string | null
          wrap_in_plastic_bag: boolean | null
        }
        Insert: {
          adhesive_sheet?: boolean | null
          antistatic?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          daily_quantity?: number | null
          delivery_site_id?: string | null
          design_revision_id?: string | null
          has_label?: boolean | null
          id?: string
          instruction_no: string
          instruction_type?: string
          is_first_time?: boolean | null
          issued_at?: string | null
          lot_no?: string | null
          material_spec?: string | null
          material_stock_qty?: number | null
          material_stock_warning?: boolean | null
          material_thickness?: number | null
          material_width?: number | null
          notes?: string | null
          order_id?: string | null
          packaging_type?: string | null
          physical_mold_id?: string | null
          plain_case?: boolean | null
          plain_label?: boolean | null
          product_id?: string | null
          production_site?: string | null
          quantity_ordered: number
          quantity_per_stack?: number | null
          recycled_pct?: number | null
          requested_date: string
          silicon?: boolean | null
          status?: string
          surface_coating?: boolean | null
          template_type: string
          updated_at?: string | null
          wrap_in_plastic_bag?: boolean | null
        }
        Update: {
          adhesive_sheet?: boolean | null
          antistatic?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          daily_quantity?: number | null
          delivery_site_id?: string | null
          design_revision_id?: string | null
          has_label?: boolean | null
          id?: string
          instruction_no?: string
          instruction_type?: string
          is_first_time?: boolean | null
          issued_at?: string | null
          lot_no?: string | null
          material_spec?: string | null
          material_stock_qty?: number | null
          material_stock_warning?: boolean | null
          material_thickness?: number | null
          material_width?: number | null
          notes?: string | null
          order_id?: string | null
          packaging_type?: string | null
          physical_mold_id?: string | null
          plain_case?: boolean | null
          plain_label?: boolean | null
          product_id?: string | null
          production_site?: string | null
          quantity_ordered?: number
          quantity_per_stack?: number | null
          recycled_pct?: number | null
          requested_date?: string
          silicon?: boolean | null
          status?: string
          surface_coating?: boolean | null
          template_type?: string
          updated_at?: string | null
          wrap_in_plastic_bag?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "production_instructions_delivery_site_id_fkey"
            columns: ["delivery_site_id"]
            isOneToOne: false
            referencedRelation: "delivery_sites"
            referencedColumns: ["site_id"]
          },
          {
            foreignKeyName: "production_instructions_design_revision_id_fkey"
            columns: ["design_revision_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "production_instructions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "production_instructions_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "production_instructions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      production_log: {
        Row: {
          created_at: string | null
          job_id: string | null
          log_id: string
          meters_consumed: number
          meters_remaining: number
          meters_wasted: number
          roll_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          job_id?: string | null
          log_id?: string
          meters_consumed: number
          meters_remaining: number
          meters_wasted: number
          roll_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          job_id?: string | null
          log_id?: string
          meters_consumed?: number
          meters_remaining?: number
          meters_wasted?: number
          roll_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_log_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "production_log_roll_id_fkey"
            columns: ["roll_id"]
            isOneToOne: false
            referencedRelation: "plastic_receipt_roll"
            referencedColumns: ["id"]
          },
        ]
      }
      production_logs: {
        Row: {
          created_at: string | null
          defect_quantity: number | null
          end_time: string | null
          forming_params_json: Json | null
          log_date: string
          log_id: string
          lot_id: string | null
          machine_id: string | null
          notes: string | null
          operator_id: string | null
          output_quantity: number | null
          po_id: string | null
          start_time: string | null
        }
        Insert: {
          created_at?: string | null
          defect_quantity?: number | null
          end_time?: string | null
          forming_params_json?: Json | null
          log_date: string
          log_id?: string
          lot_id?: string | null
          machine_id?: string | null
          notes?: string | null
          operator_id?: string | null
          output_quantity?: number | null
          po_id?: string | null
          start_time?: string | null
        }
        Update: {
          created_at?: string | null
          defect_quantity?: number | null
          end_time?: string | null
          forming_params_json?: Json | null
          log_date?: string
          log_id?: string
          lot_id?: string | null
          machine_id?: string | null
          notes?: string | null
          operator_id?: string | null
          output_quantity?: number | null
          po_id?: string | null
          start_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_logs_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["lot_id"]
          },
          {
            foreignKeyName: "production_logs_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "production_logs_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "production_logs_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["po_id"]
          },
        ]
      }
      production_lots: {
        Row: {
          created_at: string | null
          defective_qty: number | null
          end_time: string | null
          good_qty: number | null
          good_quantity: number | null
          input_quantity: number | null
          lot_id: string
          lot_no: string
          lot_status: string | null
          machine_id: string | null
          ng_quantity: number | null
          ng_reason: string | null
          notes: string | null
          operator_id: string | null
          package_spec: string | null
          physical_mold_id: string | null
          po_id: string
          scrap_quantity: number | null
          ship_date: string | null
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          defective_qty?: number | null
          end_time?: string | null
          good_qty?: number | null
          good_quantity?: number | null
          input_quantity?: number | null
          lot_id?: string
          lot_no: string
          lot_status?: string | null
          machine_id?: string | null
          ng_quantity?: number | null
          ng_reason?: string | null
          notes?: string | null
          operator_id?: string | null
          package_spec?: string | null
          physical_mold_id?: string | null
          po_id: string
          scrap_quantity?: number | null
          ship_date?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          defective_qty?: number | null
          end_time?: string | null
          good_qty?: number | null
          good_quantity?: number | null
          input_quantity?: number | null
          lot_id?: string
          lot_no?: string
          lot_status?: string | null
          machine_id?: string | null
          ng_quantity?: number | null
          ng_reason?: string | null
          notes?: string | null
          operator_id?: string | null
          package_spec?: string | null
          physical_mold_id?: string | null
          po_id?: string
          scrap_quantity?: number | null
          ship_date?: string | null
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_lots_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "production_lots_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "production_lots_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "production_lots_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["po_id"]
          },
        ]
      }
      production_orders: {
        Row: {
          actual_end: string | null
          actual_quantity: number | null
          actual_start: string | null
          approved_by_manager: string | null
          approved_by_mold_shop: string | null
          approved_by_molding_shop: string | null
          approved_by_procurement: string | null
          approved_by_qc: string | null
          bom_reference_mold_id: string | null
          case_id: string | null
          cavities_per_mold: number | null
          created_at: string | null
          cutter_id: string | null
          delivery_date: string | null
          delivery_destination: string | null
          forming_location: string | null
          lot_no: string | null
          machine_id: string | null
          material_thickness: number | null
          material_type: string | null
          material_width: number | null
          mold_sets_to_make: number | null
          notes: string | null
          order_line_id: string | null
          packaging_style: string | null
          physical_mold_id: string | null
          planned_end: string | null
          planned_quantity: number | null
          planned_start: string | null
          po_code: string
          po_id: string
          po_status: string | null
          po_type: string | null
          priority: number | null
          quantity_free: number | null
          quantity_office: number | null
          req_aluminum_date: string | null
          req_cutter_date: string | null
          req_mold_date: string | null
          req_molding_date: string | null
          req_plug_date: string | null
          requester_code: string | null
          requires_qc: boolean | null
          sample_condition: string | null
          tolerance_long: string | null
          tolerance_short: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_quantity?: number | null
          actual_start?: string | null
          approved_by_manager?: string | null
          approved_by_mold_shop?: string | null
          approved_by_molding_shop?: string | null
          approved_by_procurement?: string | null
          approved_by_qc?: string | null
          bom_reference_mold_id?: string | null
          case_id?: string | null
          cavities_per_mold?: number | null
          created_at?: string | null
          cutter_id?: string | null
          delivery_date?: string | null
          delivery_destination?: string | null
          forming_location?: string | null
          lot_no?: string | null
          machine_id?: string | null
          material_thickness?: number | null
          material_type?: string | null
          material_width?: number | null
          mold_sets_to_make?: number | null
          notes?: string | null
          order_line_id?: string | null
          packaging_style?: string | null
          physical_mold_id?: string | null
          planned_end?: string | null
          planned_quantity?: number | null
          planned_start?: string | null
          po_code: string
          po_id?: string
          po_status?: string | null
          po_type?: string | null
          priority?: number | null
          quantity_free?: number | null
          quantity_office?: number | null
          req_aluminum_date?: string | null
          req_cutter_date?: string | null
          req_mold_date?: string | null
          req_molding_date?: string | null
          req_plug_date?: string | null
          requester_code?: string | null
          requires_qc?: boolean | null
          sample_condition?: string | null
          tolerance_long?: string | null
          tolerance_short?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_quantity?: number | null
          actual_start?: string | null
          approved_by_manager?: string | null
          approved_by_mold_shop?: string | null
          approved_by_molding_shop?: string | null
          approved_by_procurement?: string | null
          approved_by_qc?: string | null
          bom_reference_mold_id?: string | null
          case_id?: string | null
          cavities_per_mold?: number | null
          created_at?: string | null
          cutter_id?: string | null
          delivery_date?: string | null
          delivery_destination?: string | null
          forming_location?: string | null
          lot_no?: string | null
          machine_id?: string | null
          material_thickness?: number | null
          material_type?: string | null
          material_width?: number | null
          mold_sets_to_make?: number | null
          notes?: string | null
          order_line_id?: string | null
          packaging_style?: string | null
          physical_mold_id?: string | null
          planned_end?: string | null
          planned_quantity?: number | null
          planned_start?: string | null
          po_code?: string
          po_id?: string
          po_status?: string | null
          po_type?: string | null
          priority?: number | null
          quantity_free?: number | null
          quantity_office?: number | null
          req_aluminum_date?: string | null
          req_cutter_date?: string | null
          req_mold_date?: string | null
          req_molding_date?: string | null
          req_plug_date?: string | null
          requester_code?: string | null
          requires_qc?: boolean | null
          sample_condition?: string | null
          tolerance_long?: string | null
          tolerance_short?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_orders_approved_by_manager_fkey"
            columns: ["approved_by_manager"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "production_orders_approved_by_mold_shop_fkey"
            columns: ["approved_by_mold_shop"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "production_orders_approved_by_molding_shop_fkey"
            columns: ["approved_by_molding_shop"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "production_orders_approved_by_procurement_fkey"
            columns: ["approved_by_procurement"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "production_orders_approved_by_qc_fkey"
            columns: ["approved_by_qc"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "production_orders_bom_reference_mold_id_fkey"
            columns: ["bom_reference_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "production_orders_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "business_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_cutter_id_fkey"
            columns: ["cutter_id"]
            isOneToOne: false
            referencedRelation: "cutters"
            referencedColumns: ["cutter_id"]
          },
          {
            foreignKeyName: "production_orders_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "production_orders_order_line_id_fkey"
            columns: ["order_line_id"]
            isOneToOne: false
            referencedRelation: "order_lines"
            referencedColumns: ["line_id"]
          },
          {
            foreignKeyName: "production_orders_physical_mold_id_fkey"
            columns: ["physical_mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
        ]
      }
      production_schedules: {
        Row: {
          created_at: string | null
          machine_id: string
          mold_id: string | null
          notes: string | null
          order_line_id: string | null
          planned_quantity: number | null
          product_id: string | null
          schedule_date: string
          schedule_id: string
          shift: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          machine_id: string
          mold_id?: string | null
          notes?: string | null
          order_line_id?: string | null
          planned_quantity?: number | null
          product_id?: string | null
          schedule_date: string
          schedule_id?: string
          shift?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          machine_id?: string
          mold_id?: string | null
          notes?: string | null
          order_line_id?: string | null
          planned_quantity?: number | null
          product_id?: string | null
          schedule_date?: string
          schedule_id?: string
          shift?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "production_schedules_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "production_schedules_mold_id_fkey"
            columns: ["mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "production_schedules_order_line_id_fkey"
            columns: ["order_line_id"]
            isOneToOne: false
            referencedRelation: "order_lines"
            referencedColumns: ["line_id"]
          },
          {
            foreignKeyName: "production_schedules_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      production_tag_master: {
        Row: {
          created_at: string
          is_active: boolean
          label_ja: string
          label_vi: string
          print_style: string
          priority: number
          tag_code: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          label_ja: string
          label_vi: string
          print_style?: string
          priority?: number
          tag_code: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          label_ja?: string
          label_vi?: string
          print_style?: string
          priority?: number
          tag_code?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          box_spec: string | null
          company_id: string
          created_at: string | null
          customer_product_name: string | null
          customer_product_specs: Json | null
          date_entry: string | null
          end_user_company_id: string | null
          external_length_mm: number | null
          external_width_mm: number | null
          legacy_id: string | null
          legacy_specs: Json | null
          mold_master_id: string | null
          notes: string | null
          pieces_per_box: number | null
          pocket_count: number | null
          product_code: string
          product_description: string | null
          product_id: string
          product_name: string | null
          product_name_en: string | null
          product_name_internal: string | null
          product_set_type: string | null
          product_status: string | null
          set_component_names: Json | null
          stacking_height_mm: number | null
          stacking_layers: number | null
          stacking_type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          box_spec?: string | null
          company_id: string
          created_at?: string | null
          customer_product_name?: string | null
          customer_product_specs?: Json | null
          date_entry?: string | null
          end_user_company_id?: string | null
          external_length_mm?: number | null
          external_width_mm?: number | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          mold_master_id?: string | null
          notes?: string | null
          pieces_per_box?: number | null
          pocket_count?: number | null
          product_code: string
          product_description?: string | null
          product_id?: string
          product_name?: string | null
          product_name_en?: string | null
          product_name_internal?: string | null
          product_set_type?: string | null
          product_status?: string | null
          set_component_names?: Json | null
          stacking_height_mm?: number | null
          stacking_layers?: number | null
          stacking_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          box_spec?: string | null
          company_id?: string
          created_at?: string | null
          customer_product_name?: string | null
          customer_product_specs?: Json | null
          date_entry?: string | null
          end_user_company_id?: string | null
          external_length_mm?: number | null
          external_width_mm?: number | null
          legacy_id?: string | null
          legacy_specs?: Json | null
          mold_master_id?: string | null
          notes?: string | null
          pieces_per_box?: number | null
          pocket_count?: number | null
          product_code?: string
          product_description?: string | null
          product_id?: string
          product_name?: string | null
          product_name_en?: string | null
          product_name_internal?: string | null
          product_set_type?: string | null
          product_status?: string | null
          set_component_names?: Json | null
          stacking_height_mm?: number | null
          stacking_layers?: number | null
          stacking_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "products_end_user_company_id_fkey"
            columns: ["end_user_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          role: string
        }
        Insert: {
          id: string
          role?: string
        }
        Update: {
          id?: string
          role?: string
        }
        Relationships: []
      }
      quotation_lines: {
        Row: {
          amount: number | null
          created_at: string | null
          description: string | null
          item_type: string
          line_id: string
          line_no: number
          notes: string | null
          quantity: number | null
          quotation_id: string
          unit_price: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          item_type: string
          line_id?: string
          line_no: number
          notes?: string | null
          quantity?: number | null
          quotation_id: string
          unit_price?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          item_type?: string
          line_id?: string
          line_no?: number
          notes?: string | null
          quantity?: number | null
          quotation_id?: string
          unit_price?: number | null
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
      quotations: {
        Row: {
          case_id: string | null
          company_id: string
          created_at: string | null
          extra_json: Json | null
          file_path: string | null
          notes: string | null
          prepared_by: string | null
          quotation_id: string
          quotation_no: string
          quotation_type: string | null
          quote_date: string
          raw_text_snapshot: string | null
          status: string | null
          total_amount: number | null
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          case_id?: string | null
          company_id: string
          created_at?: string | null
          extra_json?: Json | null
          file_path?: string | null
          notes?: string | null
          prepared_by?: string | null
          quotation_id?: string
          quotation_no: string
          quotation_type?: string | null
          quote_date: string
          raw_text_snapshot?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          case_id?: string | null
          company_id?: string
          created_at?: string | null
          extra_json?: Json | null
          file_path?: string | null
          notes?: string | null
          prepared_by?: string | null
          quotation_id?: string
          quotation_no?: string
          quotation_type?: string | null
          quote_date?: string
          raw_text_snapshot?: string | null
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "business_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "quotations_prepared_by_fkey"
            columns: ["prepared_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      rack_layers: {
        Row: {
          id: string
          layer_code: string
          layer_number: number
          legacy_id: string | null
          notes: string | null
          rack_id: string | null
        }
        Insert: {
          id?: string
          layer_code: string
          layer_number: number
          legacy_id?: string | null
          notes?: string | null
          rack_id?: string | null
        }
        Update: {
          id?: string
          layer_code?: string
          layer_number?: number
          legacy_id?: string | null
          notes?: string | null
          rack_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rack_layers_rack_id_fkey"
            columns: ["rack_id"]
            isOneToOne: false
            referencedRelation: "racks"
            referencedColumns: ["id"]
          },
        ]
      }
      racks: {
        Row: {
          created_at: string | null
          id: string
          legacy_id: string | null
          location_in_factory: string | null
          notes: string | null
          rack_code: string
          rack_name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          legacy_id?: string | null
          location_in_factory?: string | null
          notes?: string | null
          rack_code: string
          rack_name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          legacy_id?: string | null
          location_in_factory?: string | null
          notes?: string | null
          rack_code?: string
          rack_name?: string | null
        }
        Relationships: []
      }
      sample_submissions: {
        Row: {
          bagging_required: boolean | null
          box_type: string | null
          company_result: string | null
          created_at: string | null
          delivery_company: string | null
          feedback_date: string | null
          feedback_notes: string | null
          free_quantity: number | null
          job_id: string | null
          mass_production_hold: boolean | null
          mass_production_released: string | null
          materials_json: Json | null
          mold_owner_id: string | null
          notes: string | null
          office_quantity: number | null
          packaging_instructions: string | null
          product_id: string | null
          sample_quantity: number | null
          sample_type: string | null
          shipped_date: string | null
          submission_id: string
          tracking_no: string | null
        }
        Insert: {
          bagging_required?: boolean | null
          box_type?: string | null
          company_result?: string | null
          created_at?: string | null
          delivery_company?: string | null
          feedback_date?: string | null
          feedback_notes?: string | null
          free_quantity?: number | null
          job_id?: string | null
          mass_production_hold?: boolean | null
          mass_production_released?: string | null
          materials_json?: Json | null
          mold_owner_id?: string | null
          notes?: string | null
          office_quantity?: number | null
          packaging_instructions?: string | null
          product_id?: string | null
          sample_quantity?: number | null
          sample_type?: string | null
          shipped_date?: string | null
          submission_id?: string
          tracking_no?: string | null
        }
        Update: {
          bagging_required?: boolean | null
          box_type?: string | null
          company_result?: string | null
          created_at?: string | null
          delivery_company?: string | null
          feedback_date?: string | null
          feedback_notes?: string | null
          free_quantity?: number | null
          job_id?: string | null
          mass_production_hold?: boolean | null
          mass_production_released?: string | null
          materials_json?: Json | null
          mold_owner_id?: string | null
          notes?: string | null
          office_quantity?: number | null
          packaging_instructions?: string | null
          product_id?: string | null
          sample_quantity?: number | null
          sample_type?: string | null
          shipped_date?: string | null
          submission_id?: string
          tracking_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_sample_submissions_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "sample_submissions_mold_owner_id_fkey"
            columns: ["mold_owner_id"]
            isOneToOne: false
            referencedRelation: "mold_owners"
            referencedColumns: ["owner_id"]
          },
          {
            foreignKeyName: "sample_submissions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      shipment_lots: {
        Row: {
          carton_count: number | null
          created_at: string
          created_by: string | null
          lot_id: string
          notes: string | null
          pallet_no: string | null
          qty_shipped: number
          shipment_id: string
          shipment_lot_id: string
        }
        Insert: {
          carton_count?: number | null
          created_at?: string
          created_by?: string | null
          lot_id: string
          notes?: string | null
          pallet_no?: string | null
          qty_shipped?: number
          shipment_id: string
          shipment_lot_id?: string
        }
        Update: {
          carton_count?: number | null
          created_at?: string
          created_by?: string | null
          lot_id?: string
          notes?: string | null
          pallet_no?: string | null
          qty_shipped?: number
          shipment_id?: string
          shipment_lot_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_lots_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "shipment_lots_lot_id_fkey"
            columns: ["lot_id"]
            isOneToOne: false
            referencedRelation: "production_lots"
            referencedColumns: ["lot_id"]
          },
          {
            foreignKeyName: "shipment_lots_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["shipment_id"]
          },
        ]
      }
      shipment_required_docs: {
        Row: {
          created_at: string | null
          doc_id: string
          doc_label: string | null
          doc_type: string
          file_path: string | null
          is_attached: boolean | null
          required_by: string | null
          shipment_id: string
        }
        Insert: {
          created_at?: string | null
          doc_id?: string
          doc_label?: string | null
          doc_type: string
          file_path?: string | null
          is_attached?: boolean | null
          required_by?: string | null
          shipment_id: string
        }
        Update: {
          created_at?: string | null
          doc_id?: string
          doc_label?: string | null
          doc_type?: string
          file_path?: string | null
          is_attached?: boolean | null
          required_by?: string | null
          shipment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipment_required_docs_required_by_fkey"
            columns: ["required_by"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "shipment_required_docs_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["shipment_id"]
          },
        ]
      }
      shipments: {
        Row: {
          created_at: string | null
          delivery_method: string | null
          delivery_note_no: string | null
          delivery_site_id: string | null
          document_template: string | null
          invoice_no: string | null
          notes: string | null
          order_id: string | null
          service_desc: string | null
          ship_date: string
          shipment_id: string
          shipment_type: string | null
          shipped_by: string | null
          status: string | null
          tracking_no: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_method?: string | null
          delivery_note_no?: string | null
          delivery_site_id?: string | null
          document_template?: string | null
          invoice_no?: string | null
          notes?: string | null
          order_id?: string | null
          service_desc?: string | null
          ship_date: string
          shipment_id?: string
          shipment_type?: string | null
          shipped_by?: string | null
          status?: string | null
          tracking_no?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_method?: string | null
          delivery_note_no?: string | null
          delivery_site_id?: string | null
          document_template?: string | null
          invoice_no?: string | null
          notes?: string | null
          order_id?: string | null
          service_desc?: string | null
          ship_date?: string
          shipment_id?: string
          shipment_type?: string | null
          shipped_by?: string | null
          status?: string | null
          tracking_no?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_delivery_site_id_fkey"
            columns: ["delivery_site_id"]
            isOneToOne: false
            referencedRelation: "delivery_sites"
            referencedColumns: ["site_id"]
          },
          {
            foreignKeyName: "shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "shipments_shipped_by_fkey"
            columns: ["shipped_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      standard_process_times: {
        Row: {
          default_hours: number
          default_hours_trial: number | null
          id: string
          is_active: boolean | null
          machine_type_required: string | null
          notes: string | null
          process_code: string
          process_name_ja: string
          process_name_vi: string | null
          sort_order: number
          track: string
        }
        Insert: {
          default_hours: number
          default_hours_trial?: number | null
          id?: string
          is_active?: boolean | null
          machine_type_required?: string | null
          notes?: string | null
          process_code: string
          process_name_ja: string
          process_name_vi?: string | null
          sort_order?: number
          track?: string
        }
        Update: {
          default_hours?: number
          default_hours_trial?: number | null
          id?: string
          is_active?: boolean | null
          machine_type_required?: string | null
          notes?: string | null
          process_code?: string
          process_name_ja?: string
          process_name_vi?: string | null
          sort_order?: number
          track?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          contact_info: string | null
          created_at: string | null
          is_active: boolean | null
          note: string | null
          short_name: string | null
          supplier_code: string
          supplier_id: string
          supplier_name: string
          updated_at: string | null
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          is_active?: boolean | null
          note?: string | null
          short_name?: string | null
          supplier_code: string
          supplier_id?: string
          supplier_name: string
          updated_at?: string | null
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          is_active?: boolean | null
          note?: string | null
          short_name?: string | null
          supplier_code?: string
          supplier_id?: string
          supplier_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      technical_reviews: {
        Row: {
          approval_status: Database["public"]["Enums"]["technical_review_status"]
          approved_at: string | null
          approved_by: string | null
          case_id: string
          cavity_count: number | null
          created_at: string | null
          cut_method: string | null
          cutting_die_id: string | null
          cutting_die_option:
            | Database["public"]["Enums"]["cutting_die_option_type"]
            | null
          cycle_time_sec: number | null
          design_revision_id: string | null
          die_required: boolean | null
          extra_json: Json | null
          id: string
          lead_time_days: number | null
          machine_candidate: string | null
          machine_id: string | null
          material_spec: string | null
          mold_decision_type: string | null
          mold_id: string | null
          mold_option: Database["public"]["Enums"]["mold_option_type"] | null
          mold_size_x: number | null
          mold_size_y: number | null
          plug_required: boolean | null
          pocket_count: number | null
          product_id: string | null
          raw_text_snapshot: string | null
          rejected_reason: string | null
          requested_by: string | null
          result_status: string | null
          review_date: string | null
          reviewed_by: string | null
          special_requirements: string | null
          technical_constraints: string | null
          thickness_mm: number | null
          updated_at: string | null
          version: number
        }
        Insert: {
          approval_status?: Database["public"]["Enums"]["technical_review_status"]
          approved_at?: string | null
          approved_by?: string | null
          case_id: string
          cavity_count?: number | null
          created_at?: string | null
          cut_method?: string | null
          cutting_die_id?: string | null
          cutting_die_option?:
            | Database["public"]["Enums"]["cutting_die_option_type"]
            | null
          cycle_time_sec?: number | null
          design_revision_id?: string | null
          die_required?: boolean | null
          extra_json?: Json | null
          id?: string
          lead_time_days?: number | null
          machine_candidate?: string | null
          machine_id?: string | null
          material_spec?: string | null
          mold_decision_type?: string | null
          mold_id?: string | null
          mold_option?: Database["public"]["Enums"]["mold_option_type"] | null
          mold_size_x?: number | null
          mold_size_y?: number | null
          plug_required?: boolean | null
          pocket_count?: number | null
          product_id?: string | null
          raw_text_snapshot?: string | null
          rejected_reason?: string | null
          requested_by?: string | null
          result_status?: string | null
          review_date?: string | null
          reviewed_by?: string | null
          special_requirements?: string | null
          technical_constraints?: string | null
          thickness_mm?: number | null
          updated_at?: string | null
          version?: number
        }
        Update: {
          approval_status?: Database["public"]["Enums"]["technical_review_status"]
          approved_at?: string | null
          approved_by?: string | null
          case_id?: string
          cavity_count?: number | null
          created_at?: string | null
          cut_method?: string | null
          cutting_die_id?: string | null
          cutting_die_option?:
            | Database["public"]["Enums"]["cutting_die_option_type"]
            | null
          cycle_time_sec?: number | null
          design_revision_id?: string | null
          die_required?: boolean | null
          extra_json?: Json | null
          id?: string
          lead_time_days?: number | null
          machine_candidate?: string | null
          machine_id?: string | null
          material_spec?: string | null
          mold_decision_type?: string | null
          mold_id?: string | null
          mold_option?: Database["public"]["Enums"]["mold_option_type"] | null
          mold_size_x?: number | null
          mold_size_y?: number | null
          plug_required?: boolean | null
          pocket_count?: number | null
          product_id?: string | null
          raw_text_snapshot?: string | null
          rejected_reason?: string | null
          requested_by?: string | null
          result_status?: string | null
          review_date?: string | null
          reviewed_by?: string | null
          special_requirements?: string | null
          technical_constraints?: string | null
          thickness_mm?: number | null
          updated_at?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "technical_reviews_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "business_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technical_reviews_cutting_die_id_fkey"
            columns: ["cutting_die_id"]
            isOneToOne: false
            referencedRelation: "cutters"
            referencedColumns: ["cutter_id"]
          },
          {
            foreignKeyName: "technical_reviews_design_revision_id_fkey"
            columns: ["design_revision_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "technical_reviews_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "technical_reviews_mold_id_fkey"
            columns: ["mold_id"]
            isOneToOne: false
            referencedRelation: "physical_molds"
            referencedColumns: ["physical_mold_id"]
          },
          {
            foreignKeyName: "technical_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "technical_reviews_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "technical_reviews_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      tray_inspections: {
        Row: {
          certificate_file: string | null
          certificate_no: string | null
          certificate_type: string | null
          company_approved: boolean | null
          company_approved_date: string | null
          created_at: string | null
          inspected_by: string | null
          inspected_date: string | null
          inspection_id: string
          inspection_stage: string | null
          inspection_type: string
          issued_by: string | null
          issued_date: string | null
          job_id: string | null
          measurement_data: Json | null
          notes: string | null
          pass_fail: string | null
          product_id: string | null
          tolerance_data: Json | null
        }
        Insert: {
          certificate_file?: string | null
          certificate_no?: string | null
          certificate_type?: string | null
          company_approved?: boolean | null
          company_approved_date?: string | null
          created_at?: string | null
          inspected_by?: string | null
          inspected_date?: string | null
          inspection_id?: string
          inspection_stage?: string | null
          inspection_type: string
          issued_by?: string | null
          issued_date?: string | null
          job_id?: string | null
          measurement_data?: Json | null
          notes?: string | null
          pass_fail?: string | null
          product_id?: string | null
          tolerance_data?: Json | null
        }
        Update: {
          certificate_file?: string | null
          certificate_no?: string | null
          certificate_type?: string | null
          company_approved?: boolean | null
          company_approved_date?: string | null
          created_at?: string | null
          inspected_by?: string | null
          inspected_date?: string | null
          inspection_id?: string
          inspection_stage?: string | null
          inspection_type?: string
          issued_by?: string | null
          issued_date?: string | null
          job_id?: string | null
          measurement_data?: Json | null
          notes?: string | null
          pass_fail?: string | null
          product_id?: string | null
          tolerance_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tray_inspections_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "tray_inspections_inspected_by_fkey"
            columns: ["inspected_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tray_inspections_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "tray_inspections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
        ]
      }
      tray_samples: {
        Row: {
          created_at: string | null
          current_rack_layer_id: string | null
          id: string
          is_approved: boolean | null
          job_id: string | null
          measured_weight_g: number | null
          measurement_data: Json | null
          product_id: string | null
          taken_by: string | null
        }
        Insert: {
          created_at?: string | null
          current_rack_layer_id?: string | null
          id?: string
          is_approved?: boolean | null
          job_id?: string | null
          measured_weight_g?: number | null
          measurement_data?: Json | null
          product_id?: string | null
          taken_by?: string | null
        }
        Update: {
          created_at?: string | null
          current_rack_layer_id?: string | null
          id?: string
          is_approved?: boolean | null
          job_id?: string | null
          measured_weight_g?: number | null
          measurement_data?: Json | null
          product_id?: string | null
          taken_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_tray_samples_job"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "tray_samples_current_rack_layer_id_fkey"
            columns: ["current_rack_layer_id"]
            isOneToOne: false
            referencedRelation: "rack_layers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tray_samples_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "tray_samples_taken_by_fkey"
            columns: ["taken_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      work_logs: {
        Row: {
          company_id: string | null
          contact_content: string | null
          created_at: string | null
          description: string | null
          employee_id: string
          hours_spent: number | null
          is_finished: boolean | null
          job_id: string
          job_step_id: string | null
          log_id: string
          machine_id: string | null
          notes: string | null
          planned_date: string | null
          planned_hours: number | null
          processing_code_id: number | null
          processing_status_id: number | null
          quantity_done: number | null
          work_date: string
        }
        Insert: {
          company_id?: string | null
          contact_content?: string | null
          created_at?: string | null
          description?: string | null
          employee_id: string
          hours_spent?: number | null
          is_finished?: boolean | null
          job_id: string
          job_step_id?: string | null
          log_id?: string
          machine_id?: string | null
          notes?: string | null
          planned_date?: string | null
          planned_hours?: number | null
          processing_code_id?: number | null
          processing_status_id?: number | null
          quantity_done?: number | null
          work_date: string
        }
        Update: {
          company_id?: string | null
          contact_content?: string | null
          created_at?: string | null
          description?: string | null
          employee_id?: string
          hours_spent?: number | null
          is_finished?: boolean | null
          job_id?: string
          job_step_id?: string | null
          log_id?: string
          machine_id?: string | null
          notes?: string | null
          planned_date?: string | null
          planned_hours?: number | null
          processing_code_id?: number | null
          processing_status_id?: number | null
          quantity_done?: number | null
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "work_logs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "work_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "work_logs_job_step_id_fkey"
            columns: ["job_step_id"]
            isOneToOne: false
            referencedRelation: "job_steps"
            referencedColumns: ["step_id"]
          },
          {
            foreignKeyName: "work_logs_machine_id_fkey"
            columns: ["machine_id"]
            isOneToOne: false
            referencedRelation: "machines"
            referencedColumns: ["machine_id"]
          },
          {
            foreignKeyName: "work_logs_processing_code_id_fkey"
            columns: ["processing_code_id"]
            isOneToOne: false
            referencedRelation: "processing_codes"
            referencedColumns: ["processing_code_id"]
          },
          {
            foreignKeyName: "work_logs_processing_status_id_fkey"
            columns: ["processing_status_id"]
            isOneToOne: false
            referencedRelation: "processing_statuses"
            referencedColumns: ["status_id"]
          },
        ]
      }
      work_orders: {
        Row: {
          case_id: string | null
          company_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          deadline: string | null
          design_revision_id: string | null
          notes: string | null
          order_id: string | null
          priority: number | null
          product_id: string | null
          responsible_id: string | null
          start_date: string | null
          updated_at: string | null
          wo_code: string
          wo_id: string
          wo_name: string
          wo_status: string
          wo_type: string
        }
        Insert: {
          case_id?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          design_revision_id?: string | null
          notes?: string | null
          order_id?: string | null
          priority?: number | null
          product_id?: string | null
          responsible_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          wo_code: string
          wo_id?: string
          wo_name: string
          wo_status?: string
          wo_type?: string
        }
        Update: {
          case_id?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          deadline?: string | null
          design_revision_id?: string | null
          notes?: string | null
          order_id?: string | null
          priority?: number | null
          product_id?: string | null
          responsible_id?: string | null
          start_date?: string | null
          updated_at?: string | null
          wo_code?: string
          wo_id?: string
          wo_name?: string
          wo_status?: string
          wo_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "business_cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "work_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
          {
            foreignKeyName: "work_orders_design_revision_id_fkey"
            columns: ["design_revision_id"]
            isOneToOne: false
            referencedRelation: "design_revisions"
            referencedColumns: ["revision_id"]
          },
          {
            foreignKeyName: "work_orders_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "work_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "work_orders_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
    }

    Views: {
      material_inventory_v2: {
        Row: {
          available_m: number | null
          current_stock_m: number | null
          factory_site: string | null
          is_antistatic: boolean | null
          is_silicon: boolean | null
          material_spec: string | null
          reserved_m: number | null
        }
        Insert: {
          available_m?: never
          current_stock_m?: number | null
          factory_site?: string | null
          is_antistatic?: boolean | null
          is_silicon?: boolean | null
          material_spec?: string | null
          reserved_m?: number | null
        }
        Update: {
          available_m?: never
          current_stock_m?: number | null
          factory_site?: string | null
          is_antistatic?: boolean | null
          is_silicon?: boolean | null
          material_spec?: string | null
          reserved_m?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_plastic_mrp_v2: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          demand_meters: number
          plastic_id: string
          supply_meters: number
          timeline_date: string
        }[]
      }
      generate_case_code: { Args: never; Returns: string }
    }
    Enums: {
      asset_type: "MOLD" | "CUTTER" | "EQUIPMENT" | "TRAY_SAMPLE" | "PLUG"
      cutting_die_option_type: "reuse" | "new" | "none"
      equipment_status: "ACTIVE" | "MAINTENANCE" | "BROKEN" | "DISPOSED"
      mold_option_type: "reuse" | "modify" | "remake" | "new"
      technical_review_status:
        | "draft"
        | "in_review"
        | "approved"
        | "rejected"
        | "superseded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_type: ["MOLD", "CUTTER", "EQUIPMENT", "TRAY_SAMPLE", "PLUG"],
      cutting_die_option_type: ["reuse", "new", "none"],
      equipment_status: ["ACTIVE", "MAINTENANCE", "BROKEN", "DISPOSED"],
      mold_option_type: ["reuse", "modify", "remake", "new"],
      technical_review_status: [
        "draft",
        "in_review",
        "approved",
        "rejected",
        "superseded",
      ],
    },
  },
} as const
