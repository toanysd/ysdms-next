'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
// Types 窶・mapped to actual V2/V3 schema columns
// 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏

export interface CreateMoldJobInput {
    job_code: string
    job_name: string
    job_type_id: string               // FK -> job_types.job_type_id (e.g. 'NEW_MOLD', 'REVISION')
    mold_master_id?: string | null    // @deprecated - use product_id instead
    product_id?: string | null        // FK -> products
    physical_mold_id?: string | null  // FK -> physical_molds
    design_revision_id?: string | null // FK -> design_revisions
    company_id?: string | null        // FK -> companies (khách hàng)
    responsible_id?: string | null    // FK -> employees
    mold_deadline?: string | null     // V3: DATE
    ship_date?: string | null         // V3: DATE
    has_plug?: boolean                // V3: default true
    priority?: number                 // INTEGER, default 5
    notes?: string | null
}

export interface JobForGantt {
    job_id: string
    job_code: string
    job_name: string
    job_type_id: string
    job_category?: string | null
    job_status: string
    priority: number
    overall_progress: number
    target_completion_date?: string | null
    mold_deadline: string | null
    ship_date: string | null
    has_plug: boolean
    mold_track_status: string
    plug_track_status: string
    start_date: string | null
    deadline: string | null
    created_at: string
    job_steps: JobStepRow[]
    products: {
        product_id: string
        product_code: string
        product_name_internal: string | null
        product_material_specs: { material_type: string; material_grade: string | null; thickness_mm: string | null; sheet_width_mm: string | null }[]
    } | null
    design_revisions: {
        design_code: string
        revision_number: number | null
        design_length: number | null
        design_width: number | null
        design_height: number | null
        design_depth: number | null
        cutline_length: number | null
        cutline_width: number | null
        cavity_count: number | null
        plastic_type_designed: string | null
    } | null
    physical_molds: {
        physical_mold_id: string
        system_code: string
        display_name: string
        actual_length_mm: string | null
        actual_width_mm: string | null
        actual_height_mm: string | null
    } | null
    companies: {
        company_name: string
        company_code: string | null
    } | null
    work_order_id?: string | null
    equipment_id?: string | null
    work_orders?: {
        wo_id: string
        wo_code: string
        wo_name: string
        wo_status: string
        wo_type: string
        deadline: string | null
    } | null
    equipment?: {
        equipment_id: string
        equipment_code: string
        display_name: string
        equipment_type: string
    } | null
}

export interface WorkLogRow {
    log_id: string
    job_step_id: string
    job_id: string
    employee_id: string
    processing_code_id: number | null
    work_date: string
    hours_spent: number | null
    planned_hours?: number | null
    planned_date?: string | null
    processing_codes?: {
        processing_name: string
    } | null
    employees?: {
        employee_name: string
    } | null
}

export interface JobStepRow {
    step_id: string
    job_id: string
    step_no: number
    step_name: string
    step_status: string
    track: string | null
    planned_start: string | null
    planned_end: string | null
    actual_start?: string | null
    actual_end?: string | null
    planned_hours: number | null
    actual_hours: number | null
    estimated_hours: number | null
    machine_id: string | null
    assigned_to: string | null
    machining_location: string | null
    deadline: string | null
    target_completion_date?: string | null
    notes: string | null
    processing_status_id?: number | null
    processing_statuses?: {
        status_code: string
    } | null
    work_logs?: WorkLogRow[]
}

// 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
// CREATE 窶・Tạo Job + auto-gen job_steps từ standard_process_times
// 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏

export async function createMoldJobAction(input: CreateMoldJobInput) {
    const supabase = await createClient()

    // 1. Insert job with correct column names
    const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
            job_code: input.job_code,
            job_name: input.job_name,
            job_type_id: input.job_type_id,
            product_id: input.product_id || input.mold_master_id || null, // fallback from deprecated mold_master_id
            physical_mold_id: input.physical_mold_id || null,
            design_revision_id: input.design_revision_id || null,
            company_id: input.company_id || null,
            responsible_id: input.responsible_id || null,
            mold_deadline: input.mold_deadline || null,
            ship_date: input.ship_date || null,
            priority: input.priority ?? 5,
            job_status: 'NEW',
            overall_progress: 0,
            notes: input.notes || null,
        })
        .select('job_id')
        .single()

    if (jobError || !job) {
        console.error('[API Error] createMoldJobAction - jobs:', jobError)
        throw new Error(jobError?.message || 'Failed to create job')
    }

    // 2. Fetch standard process times - filter by track(s)
    //    Only auto-generate steps for Mold Jobs (design_revision_id is present)
    if (input.design_revision_id) {
        // MOLD track always; add FINISH always
        const tracks = ['MOLD', 'FINISH']
        
        let hasPlug = input.has_plug !== false
        // Override with plug_type if available
        const { data: rev } = await supabase.from('design_revisions').select('plug_type').eq('revision_id', input.design_revision_id).single()
        if (rev && rev.plug_type) {
            hasPlug = (rev.plug_type !== 'Không Plug')
        }
        
        if (hasPlug) tracks.push('PLUG')

        const { data: stdTimes, error: stdError } = await supabase
            .from('standard_process_times')
            .select('process_code, process_name_ja, default_hours, track, sort_order, machine_type_required')
            .in('track', tracks)
            .eq('is_active', true)
            .order('sort_order', { ascending: true })

        if (stdError) {
            console.error('[API Error] createMoldJobAction - standard_process_times:', stdError)
        } else if (stdTimes && stdTimes.length > 0) {
            // 3. Generate job_steps with correct column names
            const stepsToInsert = stdTimes.map((t, index) => ({
                job_id: job.job_id,
                step_no: index + 1,
                step_name: t.process_name_ja,
                step_status: 'PENDING',
                track: t.track,
                planned_hours: null, // User wants this empty to start with
                estimated_hours: t.default_hours, // Use as a placeholder hint
                machining_location: t.machine_type_required || null,
            }))

            const { error: stepsError } = await supabase
                .from('job_steps')
                .insert(stepsToInsert)

            if (stepsError) {
                console.error('[API Error] createMoldJobAction - job_steps:', stepsError)
            }
        }
    }

    revalidatePath('/equipment/jobs')
    return { success: true, job_id: job.job_id }
}

// ─────────────────────────────────────────────────────────────────────
// QUICK CREATE — Tạo Job nhanh từ WorklogForm (DEC-008)
// Chỉ cần 3 trường: job_name, job_type_id, responsible_id (optional)
// Không cần physical_mold, design_revision, company
// ─────────────────────────────────────────────────────────────────────

export interface CreateQuickJobInput {
    job_name: string
    job_type_id: string
    responsible_id?: string | null
    is_facility_job?: boolean
}

export async function createQuickJob(input: CreateQuickJobInput): Promise<{
    success: true; job_id: string; job_code: string
} | {
    success: false; error: string
}> {
    const supabase = await createClient()

    // Validate required fields
    if (!input.job_name?.trim()) {
        return { success: false, error: 'ジョブ名は必須です' }
    }
    if (!input.job_type_id?.trim()) {
        return { success: false, error: 'ジョブ種別は必須です' }
    }

    // Auto-generate job_code: QJ-{YYYYMMDD}-{HHMM} (Quick Job)
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
    const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
    const jobCode = `QJ-${dateStr}-${timeStr}`

    const notesValue = input.is_facility_job
        ? '社内作業 (Internal Facility Job)'
        : 'PENDING_MOLD_LINK'

    const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
            job_code: jobCode,
            job_name: input.job_name.trim(),
            job_type_id: input.job_type_id,
            responsible_id: input.responsible_id || null,
            job_status: 'NEW',
            overall_progress: 0,
            priority: 5,
            notes: notesValue,
            start_date: now.toISOString().split('T')[0],
        })
        .select('job_id, job_code')
        .single()

    if (jobError || !job) {
        console.error('[API Error] createQuickJob:', jobError)
        return { success: false, error: jobError?.message || 'ジョブの作成に失敗しました' }
    }

    // Auto-create 1 default step "作業" for worklog attachment
    await supabase.from('job_steps').insert({
        job_id: job.job_id,
        step_no: 1,
        step_name: '作業',
        step_status: 'IN_PROGRESS',
    })

    revalidatePath('/equipment/jobs')
    revalidatePath('/worklogs')
    return { success: true, job_id: job.job_id, job_code: job.job_code }
}

export async function linkJobToPhysicalMoldAction(job_id: string, physical_mold_id: string) {
    const supabase = await createClient()

    const { data: mold, error: moldErr } = await supabase
        .from('equipment')
        .select(`
            equipment_id,
            design_revision_id,
            design_revisions(product_id, company_id)
        `)
        .eq('equipment_id', physical_mold_id)
        .single()

    if (moldErr || !mold) {
        return { success: false, error: moldErr?.message || 'Equipment mold not found' }
    }

    const designRevision = mold.design_revisions as any
    const designRevisionId = mold.design_revision_id || null
    const productId = designRevision?.product_id || null
    const companyId = designRevision?.company_id || null

    const updatePayload: any = {
        physical_mold_id,
        updated_at: new Date().toISOString(),
        notes: null
    }

    if (designRevisionId) updatePayload.design_revision_id = designRevisionId
    if (productId) updatePayload.product_id = productId
    if (companyId) updatePayload.company_id = companyId

    const { error: updateErr } = await supabase
        .from('jobs')
        .update(updatePayload)
        .eq('job_id', job_id)

    if (updateErr) {
        return { success: false, error: updateErr.message }
    }

    revalidatePath('/equipment/jobs')
    revalidatePath(`/equipment/jobs/${job_id}`)
    return { success: true }
}

export async function deleteMoldJobAction(jobId: string) {
    const supabase = await createClient()

    // Delete Job (job_steps and work_logs should ideally cascade, but we can do it explicitly if needed)
    // First delete work_logs
    await supabase.from('work_logs').delete().eq('job_id', jobId)
    // Then job_steps
    await supabase.from('job_steps').delete().eq('job_id', jobId)
    // Finally the job itself
    const { error } = await supabase.from('jobs').delete().eq('job_id', jobId)
    
    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/equipment/jobs')
    return { success: true }
}

// 笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€
// READ 窶・Gantt Chart data
// 笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€笏€

export async function getJobsForGantt(searchQuery?: string, fromDate?: string, toDate?: string, page: number = 1, pageSize: number = 50): Promise<{ data: JobForGantt[], count: number }> {
    const supabase = await createClient()

    let req = supabase
        .from('jobs')
        .select(`
            *,
            job_steps(
                step_id, job_id, step_no, step_name, step_status,
                track, planned_start, planned_end, planned_hours,
                actual_hours, estimated_hours, machine_id,
                assigned_to, machining_location, deadline, notes, processing_status_id, item_type_id,
                condition, arrangement,
                processing_statuses!job_steps_processing_status_id_fkey(status_code),
                item_types(item_type_id, item_type_code, item_type_name_ja)
            ),
            products!jobs_product_id_fkey(
                product_id, product_code, product_name_internal,
                product_material_specs(material_type, material_grade, thickness_mm, sheet_width_mm)
            ),
            design_revisions(design_code, revision_number, design_length, design_width, design_height, design_depth, cutline_length, cutline_width, cavity_count, plastic_type_designed),
            physical_molds(physical_mold_id, system_code, display_name, actual_length_mm, actual_width_mm, actual_height_mm),
            equipment!jobs_equipment_id_fkey(equipment_id, equipment_code, display_name, equipment_type),
            work_orders!jobs_work_order_id_fkey(wo_id, wo_code, wo_name, wo_status, wo_type, deadline),
            companies!jobs_company_id_fkey(company_name, company_code),
            job_types(job_type_name_ja, job_type_name_vi)
        `, { count: 'exact' })
        .neq('job_status', 'CANCELLED')
        
    let stepJobIds: string[] = []

    if (searchQuery?.trim()) {
        const cleanQ = searchQuery.trim()
        const [{ data: matchingProducts }, { data: matchingEquip }] = await Promise.all([
            supabase.from('products').select('product_id').or(`product_code.ilike.%${cleanQ}%,product_name_internal.ilike.%${cleanQ}%,product_name.ilike.%${cleanQ}%`).limit(50),
            supabase.from('equipment').select('equipment_id').or(`equipment_code.ilike.%${cleanQ}%,display_name.ilike.%${cleanQ}%`).limit(50)
        ])

        const pIds = matchingProducts?.map(p => p.product_id) || []
        const eIds = matchingEquip?.map(e => e.equipment_id) || []

        const orConditions = [`job_code.ilike.%${cleanQ}%`, `job_name.ilike.%${cleanQ}%`]
        if (pIds.length > 0) orConditions.push(`product_id.in.(${pIds.join(',')})`)
        if (eIds.length > 0) orConditions.push(`equipment_id.in.(${eIds.join(',')})`)

        req = req.or(orConditions.join(','))
    } else if (fromDate && toDate) {
        const toDateEnd = toDate + ' 23:59:59'

        // Pass 1: Find jobs that have job_steps matching date criteria (deadline, planned_start, planned_end)
        const { data: stepHits } = await supabase
            .from('job_steps')
            .select('job_id')
            .or(`and(deadline.gte.${fromDate},deadline.lte.${toDateEnd}),and(planned_start.gte.${fromDate},planned_start.lte.${toDateEnd}),and(planned_end.gte.${fromDate},planned_end.lte.${toDateEnd})`)

        stepJobIds = Array.from(new Set(stepHits?.map(s => s.job_id).filter(Boolean) || []))

        const orConditions = [
            `and(mold_deadline.gte.${fromDate},mold_deadline.lte.${toDateEnd})`,
            `and(deadline.gte.${fromDate},deadline.lte.${toDateEnd})`,
            `and(start_date.gte.${fromDate},start_date.lte.${toDateEnd})`,
            `and(ship_date.gte.${fromDate},ship_date.lte.${toDateEnd})`
        ]
        if (stepJobIds.length > 0) {
            orConditions.push(`job_id.in.(${stepJobIds.join(',')})`)
        }

        req = req.or(orConditions.join(','))
    }

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let { data, count, error } = await req
        .order('mold_deadline', { ascending: false, nullsFirst: false })
        .order('deadline', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .range(from, to)

    // Fallback: If DB migration hasn't been run on Supabase yet, retry query without work_orders join
    if (error && (error.message.includes('work_orders') || error.message.includes('jobs_work_order_id_fkey'))) {
        let fallbackReq = supabase
            .from('jobs')
            .select(`
                *,
                job_steps(
                    step_id, job_id, step_no, step_name, step_status,
                    track, planned_start, planned_end, planned_hours,
                    actual_hours, estimated_hours, machine_id,
                    assigned_to, machining_location, deadline, notes, processing_status_id, item_type_id,
                    condition, arrangement,
                    processing_statuses!job_steps_processing_status_id_fkey(status_code),
                    item_types(item_type_id, item_type_code, item_type_name_ja)
                ),
                products!jobs_product_id_fkey(
                    product_id, product_code, product_name_internal,
                    product_material_specs(material_type, material_grade, thickness_mm, sheet_width_mm)
                ),
                design_revisions(design_code, revision_number, design_length, design_width, design_height, design_depth, cutline_length, cutline_width, cavity_count, plastic_type_designed),
                physical_molds(physical_mold_id, system_code, display_name, actual_length_mm, actual_width_mm, actual_height_mm),
                companies!jobs_company_id_fkey(company_name, company_code),
                job_types(job_type_name_ja, job_type_name_vi)
            `, { count: 'exact' })
            .neq('job_status', 'CANCELLED')

        if (searchQuery?.trim()) {
            const cleanQ = searchQuery.trim()
            const [{ data: matchingProducts }, { data: matchingEquip }] = await Promise.all([
                supabase.from('products').select('product_id').or(`product_code.ilike.%${cleanQ}%,product_name_internal.ilike.%${cleanQ}%,product_name.ilike.%${cleanQ}%`).limit(50),
                supabase.from('equipment').select('equipment_id').or(`equipment_code.ilike.%${cleanQ}%,display_name.ilike.%${cleanQ}%`).limit(50)
            ])

            const pIds = matchingProducts?.map(p => p.product_id) || []
            const eIds = matchingEquip?.map(e => e.equipment_id) || []

            const orConditions = [`job_code.ilike.%${cleanQ}%`, `job_name.ilike.%${cleanQ}%`]
            if (pIds.length > 0) orConditions.push(`product_id.in.(${pIds.join(',')})`)
            if (eIds.length > 0) orConditions.push(`equipment_id.in.(${eIds.join(',')})`)

            fallbackReq = fallbackReq.or(orConditions.join(','))
        } else if (fromDate && toDate) {
            const toDateEnd = toDate + ' 23:59:59'
            const orConditions = [
                `and(mold_deadline.gte.${fromDate},mold_deadline.lte.${toDateEnd})`,
                `and(deadline.gte.${fromDate},deadline.lte.${toDateEnd})`,
                `and(start_date.gte.${fromDate},start_date.lte.${toDateEnd})`,
                `and(ship_date.gte.${fromDate},ship_date.lte.${toDateEnd})`
            ]
            if (stepJobIds.length > 0) {
                orConditions.push(`job_id.in.(${stepJobIds.join(',')})`)
            }
            fallbackReq = fallbackReq.or(orConditions.join(','))
        }

        const res = await fallbackReq
            .order('mold_deadline', { ascending: false, nullsFirst: false })
            .order('deadline', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .range(from, to)

        data = res.data as any
        count = res.count
        error = res.error
    }

    if (error) {
        console.error('[API Error] getJobsForGantt:', error.message, error.details, error.hint)
        return { data: [], count: 0 }
    }
    
    const finalData = data || []
    
    if (finalData.length > 0) {
        const fetchedJobIds = finalData.map(j => j.job_id)
        let allLogs: any[] = []
        const batchSize = 50
        for (let i = 0; i < fetchedJobIds.length; i += batchSize) {
            const batch = fetchedJobIds.slice(i, i + batchSize)
            const logsPromises = batch.map(id => 
                supabase
                    .from('work_logs')
                    .select('log_id, job_step_id, job_id, employee_id, processing_code_id, processing_status_id, work_date, hours_spent, planned_hours, planned_date, is_finished, machine_id, processing_codes(processing_name), employees(employee_name), processing_statuses(status_code)')
                    .eq('job_id', id)
                    .limit(1000)
            )
            const logsResults = await Promise.all(logsPromises)
            logsResults.forEach(res => {
                if (res.data) {
                    allLogs = allLogs.concat(res.data)
                }
            })
        }
            
        if (allLogs.length > 0) {
            const logsByStep: Record<string, { dates: string[], totalHours: number, rawLogs: any[] }> = {}
            allLogs.forEach(l => {
                if (!l.job_step_id) return
                if (!logsByStep[l.job_step_id]) logsByStep[l.job_step_id] = { dates: [], totalHours: 0, rawLogs: [] }
                logsByStep[l.job_step_id].dates.push(l.work_date)
                logsByStep[l.job_step_id].rawLogs.push(l)
                if (l.hours_spent) {
                    logsByStep[l.job_step_id].totalHours += Number(l.hours_spent)
                }
            })
            
            finalData.forEach(job => {
                job.job_steps?.forEach((step: any) => {
                    const stepLogs = logsByStep[step.step_id]
                    if (stepLogs && stepLogs.dates.length > 0) {
                        stepLogs.dates.sort()
                        step.actual_start = stepLogs.dates[0]
                        step.actual_end = stepLogs.dates[stepLogs.dates.length - 1]
                        step.actual_hours = stepLogs.totalHours
                        step.work_logs = stepLogs.rawLogs
                    } else {
                        step.work_logs = []
                    }
                })
            })
        }
    }
    // Sort job_steps by step_no on client side
    const processedJobs = finalData.map(job => ({
        ...job,
        job_steps: (job.job_steps || []).sort((a: any, b: any) => a.step_no - b.step_no)
    }))
    
    return { data: processedJobs as any as JobForGantt[], count: count || 0 }
}


// 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
// UPDATE 窶・Step status + recalculate progress
// 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏

export async function updateJobStepStatus(
    step_id: string,
    new_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
) {
    const supabase = await createClient()

    // 1. Update step_status (not "status")
    const { data: updatedStep, error: updateError } = await supabase
        .from('job_steps')
        .update({ step_status: new_status })
        .eq('step_id', step_id)
        .select('job_id')
        .single()

    if (updateError || !updatedStep) {
        console.error('[API Error] updateJobStepStatus:', updateError)
        throw new Error(updateError?.message || 'Failed to update step')
    }

    // 2. Recalculate overall_progress
    const { data: allSteps } = await supabase
        .from('job_steps')
        .select('step_status')
        .eq('job_id', updatedStep.job_id)

    if (allSteps && allSteps.length > 0) {
        const completed = allSteps.filter(s => s.step_status === 'COMPLETED').length
        const progress = Math.round((completed / allSteps.length) * 100)

        await supabase
            .from('jobs')
            .update({
                overall_progress: progress,
                job_status: progress >= 100 ? 'COMPLETED' : progress > 0 ? 'IN_PROGRESS' : 'NEW',
                updated_at: new Date().toISOString()
            })
            .eq('job_id', updatedStep.job_id)
    }

    revalidatePath('/equipment/jobs')
    return { success: true }
}

export async function updateJobStepDates(
    step_id: string,
    planned_start: string,
    planned_end: string
) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('job_steps')
        .update({
            planned_start,
            planned_end,
            updated_at: new Date().toISOString()
        })
        .eq('step_id', step_id)

    if (error) {
        console.error('[API Error] updateJobStepDates:', error)
        throw new Error(error.message)
    }

    revalidatePath('/equipment/jobs')
    return { success: true }
}

export async function shiftJobDates(
    job_id: string,
    delta_ms: number
) {
    const supabase = await createClient()

    // 1. Fetch all steps for this job
    const { data: steps, error: fetchErr } = await supabase
        .from('job_steps')
        .select('step_id, planned_start, planned_end')
        .eq('job_id', job_id)

    if (fetchErr) {
        console.error('[API Error] shiftJobDates fetch:', fetchErr)
        throw new Error(fetchErr.message)
    }

    if (!steps || steps.length === 0) return { success: true }

    // 2. Update each step
    const updates = steps.map(step => {
        let new_start = null
        let new_end = null

        if (step.planned_start) {
            new_start = new Date(new Date(step.planned_start).getTime() + delta_ms).toISOString()
        }
        if (step.planned_end) {
            new_end = new Date(new Date(step.planned_end).getTime() + delta_ms).toISOString()
        }

        return supabase
            .from('job_steps')
            .update({
                planned_start: new_start,
                planned_end: new_end,
                updated_at: new Date().toISOString()
            })
            .eq('step_id', step.step_id)
    })

    const results = await Promise.all(updates)
    const err = results.find(r => r.error)
    if (err) {
        console.error('[API Error] shiftJobDates update:', err.error)
        throw new Error(err.error?.message)
    }

    revalidatePath('/equipment/schedule')
    revalidatePath('/equipment/jobs')
    return { success: true }
}

export async function updateJobStepDetails(
    step_id: string,
    updates: {
        progress_percent?: number
        step_status?: string
        actual_hours?: number
        planned_hours?: number
        machining_location?: string
    }
) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('job_steps')
        // @ts-ignore
        .update({
            ...updates,
            updated_at: new Date().toISOString()
        })
        .eq('step_id', step_id)

    if (error) {
        console.error('[API Error] updateJobStepDetails:', error)
        throw new Error(error.message)
    }

    revalidatePath('/equipment/jobs')
    return { success: true }
}

// 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏
// SCHEDULE 窶・Assign machine via machine_schedules table
// 笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏笏

export async function assignMachineToStep(
    step_id: string,
    machine_id: string,
    planned_start: string,
    planned_end: string
) {
    const supabase = await createClient()

    // 1. Check conflicts via the dedicated machine_schedules table
    const { data: conflicts } = await supabase
        .from('machine_schedules')
        .select('id')
        .eq('machine_id', machine_id)
        .neq('job_step_id', step_id)
        .lte('planned_start', planned_end)
        .gte('planned_end', planned_start)

    if (conflicts && conflicts.length > 0) {
        throw new Error('この機械は既にスケジュールされています/ Máy này đã được xếp lịch trong khoảng thời gian này')
    }

    // 2. Update step with machine + timing
    const { error: stepErr } = await supabase
        .from('job_steps')
        .update({
            machine_id,
            planned_start,
            planned_end,
        })
        .eq('step_id', step_id)

    if (stepErr) throw new Error(stepErr.message)

    // 3. Create machine_schedules record
    const { error: schedErr } = await supabase
        .from('machine_schedules')
        .upsert({
            machine_id,
            job_step_id: step_id,
            planned_start,
            planned_end,
            status: 'PLANNED',
        }, { onConflict: 'job_step_id' })

    if (schedErr) {
        console.error('[API Error] assignMachineToStep - machine_schedules:', schedErr)
        // Non-fatal: the step itself was updated
    }

    revalidatePath('/equipment/jobs')
    return { success: true }
}

export async function applyAutoScheduleUpdates(updates: any[]) {
    if (!updates || updates.length === 0) return { success: true }
    
    const supabase = await createClient()

    // 1. Process job steps updates
    const stepUpdates = updates.filter(u => u.type === 'step')
    for (const update of stepUpdates) {
        const payload: any = {}
        if (update.planned_start) payload.planned_start = update.planned_start
        if (update.planned_end) payload.planned_end = update.planned_end
        if (update.planned_hours !== undefined) payload.planned_hours = update.planned_hours
        if (update.machine_id !== undefined) payload.machine_id = update.machine_id

        if (Object.keys(payload).length > 0) {
            const { error } = await supabase
                .from('job_steps')
                .update(payload)
                .eq('step_id', update.id)
            if (error) console.error('[API Error] applyAutoScheduleUpdates - job_steps:', error)
        }
    }

    // 2. Process worklogs updates
    const logUpdates = updates.filter(u => u.type === 'worklog')
    for (const update of logUpdates) {
        const payload: any = {}
        if (update.planned_date) payload.planned_date = update.planned_date
        if (update.planned_hours !== undefined) payload.planned_hours = update.planned_hours
        if (update.machine_id !== undefined) payload.machine_id = update.machine_id

        if (Object.keys(payload).length > 0) {
            const { error } = await supabase
                .from('work_logs')
                .update(payload)
                .eq('log_id', update.id)
            if (error) console.error('[API Error] applyAutoScheduleUpdates - work_logs:', error)
        }
    }

    revalidatePath('/equipment/jobs')
    revalidatePath('/equipment/schedule')
    return { success: true }
}
