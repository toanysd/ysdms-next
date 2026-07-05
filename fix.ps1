$filePath = "D:/AntiGravity_Workspace/apps/ysdms-nextgen/src/types/database.types.ts"
$content = Get-Content -Path $filePath -Raw
$regex = '(?s)(job_step_dependencies: \{.*?\r?\n\s{6}\}).*?(job_types: \{)'
$newJobSteps = @"
      job_steps: {
        Row: {
          actual_hours: number | null
          assigned_to: string | null
          created_at: string | null
          deadline: string | null
          drawing_receipt_date: string | null
          estimated_hours: number | null
          is_overtime: boolean | null
          job_id: string
          machine_id: string | null
          machining_location: string | null
          notes: string | null
          outsource_company: string | null
          planned_end: string | null
          planned_hours: number | null
          planned_start: string | null
          processing_item_id: number | null
          processing_status_id: number | null
          set_info: string | null
          step_id: string
          step_name: string
          step_no: number
          step_status: string | null
          tehai_info: string | null
          track: string | null
          updated_at: string | null
          progress_percent: number | null
          baseline_start: string | null
          baseline_end: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string | null
          deadline?: string | null
          drawing_receipt_date?: string | null
          estimated_hours?: number | null
          is_overtime?: boolean | null
          job_id: string
          machine_id?: string | null
          machining_location?: string | null
          notes?: string | null
          outsource_company?: string | null
          planned_end?: string | null
          planned_hours?: number | null
          planned_start?: string | null
          processing_item_id?: number | null
          processing_status_id?: number | null
          set_info?: string | null
          step_id?: string
          step_name: string
          step_no: number
          step_status?: string | null
          tehai_info?: string | null
          track?: string | null
          updated_at?: string | null
          progress_percent?: number | null
          baseline_start?: string | null
          baseline_end?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string | null
          created_at?: string | null
          deadline?: string | null
          drawing_receipt_date?: string | null
          estimated_hours?: number | null
          is_overtime?: boolean | null
          job_id?: string
          machine_id?: string | null
          machining_location?: string | null
          notes?: string | null
          outsource_company?: string | null
          planned_end?: string | null
          planned_hours?: number | null
          planned_start?: string | null
          processing_item_id?: number | null
          processing_status_id?: number | null
          set_info?: string | null
          step_id?: string
          step_name?: string
          step_no?: number
          step_status?: string | null
          tehai_info?: string | null
          track?: string | null
          updated_at?: string | null
          progress_percent?: number | null
          baseline_start?: string | null
          baseline_end?: string | null
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
          }
        ]
      }
"@

$newContent = [regex]::Replace($content, $regex, "`${1}`r`n$newJobSteps`r`n      `${2}")
Set-Content -Path $filePath -Value $newContent -NoNewline
