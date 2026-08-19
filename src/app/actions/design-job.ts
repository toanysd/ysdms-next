'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ════════════════════════════════════════════════════════════════
// Design Job — 10 standard steps for design department work logging
// Steps map to processing_codes 1-9, 35
// ════════════════════════════════════════════════════════════════

const DESIGN_JOB_STEPS = [
    { step_no: 1, step_name: 'レイアウト', processing_code_id: 1 },
    { step_no: 2, step_name: '3Dスキャン図面作成', processing_code_id: 2 },
    { step_no: 3, step_name: '3D金型図面作成', processing_code_id: 3 },
    { step_no: 4, step_name: '3Dメンテ図面作成', processing_code_id: 4 },
    { step_no: 5, step_name: '3Dスタッキング図面作成', processing_code_id: 5 },
    { step_no: 6, step_name: '展開図工作成', processing_code_id: 6 },
    { step_no: 7, step_name: '表プログラム作成', processing_code_id: 7 },
    { step_no: 8, step_name: '3D試作金型作成', processing_code_id: 8 },
    { step_no: 9, step_name: '裏穴図面作成', processing_code_id: 9 },
    { step_no: 10, step_name: 'プラグ木型プログラム', processing_code_id: 35 },
]

export interface CreateDesignJobInput {
    product_id: string
    product_code: string           // Used for auto-generating job_code
    company_id?: string | null     // FK → companies
    design_revision_id?: string | null  // FK → design_revisions (initial revision)
    requires_prototype_mold?: boolean   // True = include 試作金型作成 step
    notes?: string | null
    is_post_production?: boolean   // True = post-production modification Design Job
    modification_number?: number   // For post-production: MOD1, MOD2...
}

export interface DesignJobResult {
    success: true
    job_id: string
    job_code: string
    steps_created: number
}

export interface DesignJobError {
    success: false
    error: string
}

/**
 * Creates a Design Job for a product with structured functional steps:
 * - If requires_prototype_mold = true: [1. 試作金型作成, 2. 本型設計]
 * - If requires_prototype_mold = false: [1. 本型設計]
 * 
 * Design Job naming:
 * - Initial: DES-{product_code} (e.g. DES-ADY071)
 * - Post-production: DES-{product_code}-MOD{n} (e.g. DES-ADY071-MOD1)
 * 
 * All steps start as 'NOT_STARTED'.
 * job_category = 'DESIGN' enables auto-filtering of processing codes in WorklogForm.
 */
export async function createDesignJobAction(
    input: CreateDesignJobInput
): Promise<DesignJobResult | DesignJobError> {
    const supabase = await createClient()

    // Validate
    if (!input.product_id?.trim()) {
        return { success: false, error: '製品IDは必須です (product_id required)' }
    }
    if (!input.product_code?.trim()) {
        return { success: false, error: '製品コードは必須です (product_code required)' }
    }

    // Check for duplicate: only 1 initial Design Job per product
    if (!input.is_post_production) {
        const { data: existing } = await supabase
            .from('jobs')
            .select('job_id')
            .eq('product_id', input.product_id)
            .eq('job_category', 'DESIGN')
            .not('notes', 'ilike', '%POST_PRODUCTION%')
            .limit(1)

        if (existing && existing.length > 0) {
            return { success: false, error: 'この製品のDesign Jobはすでに存在します (Design Job already exists for this product)' }
        }
    }

    // Generate job_code
    const codeCompact = input.product_code.replace(/-/g, '')
    const jobCode = input.is_post_production
        ? `DES-${codeCompact}-MOD${input.modification_number || 1}`
        : `DES-${codeCompact}`

    const jobName = input.is_post_production
        ? `${input.product_code} 設計変更 #${input.modification_number || 1}`
        : `${input.product_code} 設計`

    // Job type '9' = 設計 (DESIGN category)
    const JOB_TYPE_DESIGN = '9'

    // Create the Job
    const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
            job_code: jobCode,
            job_name: jobName,
            job_type_id: JOB_TYPE_DESIGN,
            job_category: 'DESIGN',
            product_id: input.product_id,
            design_revision_id: input.design_revision_id || null,
            company_id: input.company_id || null,
            job_status: 'NEW',
            overall_progress: 0,
            priority: 5,
            start_date: new Date().toISOString().split('T')[0],
            notes: input.is_post_production
                ? `POST_PRODUCTION — 設計変更 #${input.modification_number || 1}`
                : '初回設計 (Initial Design)',
        })
        .select('job_id, job_code')
        .single()

    if (jobError || !job) {
        console.error('[API Error] createDesignJobAction:', jobError)
        return { success: false, error: jobError?.message || 'Design Jobの作成に失敗しました' }
    }

    // Determine steps based on prototype mold requirement
    const stepsConfig: { step_no: number; step_name: string }[] = []
    if (input.requires_prototype_mold) {
        stepsConfig.push({ step_no: 1, step_name: '試作金型作成' })
        stepsConfig.push({ step_no: 2, step_name: '本型設計' })
    } else {
        stepsConfig.push({ step_no: 1, step_name: '本型設計' })
    }

    const stepsToInsert = stepsConfig.map(s => ({
        job_id: job.job_id,
        step_no: s.step_no,
        step_name: s.step_name,
        step_status: 'NOT_STARTED',
        track: 'DESIGN',
        notes: s.step_name,
    }))

    const { error: stepsError } = await supabase
        .from('job_steps')
        .insert(stepsToInsert)

    if (stepsError) {
        console.error('[API Error] createDesignJobAction steps:', stepsError)
        // Job was created but steps failed — still return success with warning
        return {
            success: true,
            job_id: job.job_id,
            job_code: job.job_code,
            steps_created: 0,
        }
    }

    revalidatePath('/product-center')
    revalidatePath(`/product-center/${input.product_id}`)
    revalidatePath('/equipment/jobs')

    return {
        success: true,
        job_id: job.job_id,
        job_code: job.job_code,
        steps_created: stepsConfig.length,
    }
}

/**
 * Get the count of existing Design Jobs for a product.
 * Used to determine modification_number for post-production revisions.
 */
export async function getDesignJobCount(productId: string): Promise<number> {
    const supabase = await createClient()
    const { count } = await supabase
        .from('jobs')
        .select('job_id', { count: 'exact', head: true })
        .eq('product_id', productId)
        .eq('job_category', 'DESIGN')

    return count || 0
}
