import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { JobPrintSheet, JobPrintData } from './_components/JobPrintSheet'

export const metadata = {
  title: 'YSDMS | 金型製作・改修指示書 A4印刷',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function JobPrintPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch Job with direct relations
  const { data: job, error: jobErr } = await supabase
    .from('jobs')
    .select(`
      job_id,
      job_code,
      job_name,
      job_status,
      mold_deadline,
      ship_date,
      created_at,
      equipment_id,
      companies:companies!jobs_company_id_fkey(
        company_id,
        company_name,
        company_code
      ),
      products(
        product_id,
        product_code,
        product_name,
        product_name_internal
      ),
      design_revisions(
        revision_id,
        design_code,
        cutline_length,
        cutline_width,
        corner_r,
        chamfer_c,
        cavity_count,
        plastic_type_designed
      ),
      equipment(
        equipment_id,
        equipment_code,
        display_name,
        equipment_type,
        current_rack_layer_id,
        rack_layers(
          id,
          layer_code,
          racks(
            rack_code,
            rack_name,
            location_in_factory,
            zone_code
          )
        )
      )
    `)
    .eq('job_id', id)
    .single()

  if (jobErr || !job) {
    console.error('[JobPrintPage] Job not found:', id, jobErr)
    notFound()
  }

  // 2. Fetch Job Steps with assigned employees
  const { data: steps = [] } = await supabase
    .from('job_steps')
    .select(`
      step_id,
      step_no,
      step_name,
      step_status,
      planned_hours,
      actual_hours,
      notes,
      assigned_to,
      employees:assigned_to(
        employee_id,
        employee_name
      )
    `)
    .eq('job_id', id)
    .order('step_no', { ascending: true })

  // 3. Fetch Cutters / Set Members attached to the mold (if mold exists)
  let cutters: JobPrintData['cutters'] = []
  if (job.equipment_id) {
    const { data: assignments } = await supabase
      .from('equipment_assignments')
      .select(`
        assignment_id,
        relationship_type,
        is_default,
        related_equipment:related_equipment_id(
          equipment_id,
          equipment_code,
          display_name,
          equipment_type,
          current_rack_layer_id,
          rack_layers(
            layer_code,
            racks(
              rack_code,
              rack_name,
              location_in_factory
            )
          )
        )
      `)
      .eq('primary_equipment_id', job.equipment_id)

    if (assignments && assignments.length > 0) {
      cutters = assignments
        .filter((a: any) => a.related_equipment)
        .map((a: any) => {
          const rel = a.related_equipment
          const layer = rel.rack_layers
          const rack = layer?.racks
          return {
            equipment_id: rel.equipment_id,
            equipment_code: rel.equipment_code,
            display_name: rel.display_name,
            rack_code: rack?.rack_code || null,
            layer_code: layer?.layer_code || null,
            relationship_type: a.relationship_type,
          }
        })
    }
  }

  // 4. Transform into clean ViewModel
  const moldData = job.equipment ? {
    equipment_id: job.equipment.equipment_id,
    equipment_code: job.equipment.equipment_code,
    display_name: job.equipment.display_name,
    rack_code: (job.equipment.rack_layers as any)?.racks?.rack_code || null,
    layer_code: (job.equipment.rack_layers as any)?.layer_code || null,
    location_in_factory: (job.equipment.rack_layers as any)?.racks?.location_in_factory || null,
    zone_code: (job.equipment.rack_layers as any)?.racks?.zone_code || null,
  } : null

  const formattedSteps = (steps || []).map((s: any) => ({
    step_id: s.step_id,
    step_no: s.step_no,
    step_name: s.step_name,
    step_status: s.step_status,
    employee_name: s.employees?.employee_name || null,
    planned_hours: s.planned_hours,
    actual_hours: s.actual_hours,
    notes: s.notes,
  }))

  const printData: JobPrintData = {
    job: {
      job_id: job.job_id,
      job_code: job.job_code,
      job_name: job.job_name,
      job_status: job.job_status,
      mold_deadline: job.mold_deadline,
      ship_date: job.ship_date,
      created_at: job.created_at,
    },
    company: job.companies ? {
      company_id: (job.companies as any).company_id,
      company_name: (job.companies as any).company_name,
      company_code: (job.companies as any).company_code,
    } : null,
    product: job.products ? {
      product_id: (job.products as any).product_id,
      product_code: (job.products as any).product_code,
      product_name: (job.products as any).product_name,
      product_name_internal: (job.products as any).product_name_internal,
    } : null,
    design: job.design_revisions ? {
      revision_id: (job.design_revisions as any).revision_id,
      design_code: (job.design_revisions as any).design_code,
      cutline_length: (job.design_revisions as any).cutline_length,
      cutline_width: (job.design_revisions as any).cutline_width,
      corner_r: (job.design_revisions as any).corner_r,
      chamfer_c: (job.design_revisions as any).chamfer_c,
      cavity_count: (job.design_revisions as any).cavity_count,
      plastic_type_designed: (job.design_revisions as any).plastic_type_designed,
    } : null,
    mold: moldData,
    cutters,
    steps: formattedSteps,
  }

  return <JobPrintSheet data={printData} />
}
