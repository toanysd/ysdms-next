'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { TechnicalReviewStatus } from './types';

// ─────────────────────────────────────────
// Helper: get current user + role
// ─────────────────────────────────────────
async function getCurrentUserAndRole() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Unauthorized');

  const { data: profile } = await (supabase as any)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return { user, role: (profile?.role ?? 'sales') as string };
}

// ─────────────────────────────────────────
// Save draft (create or update)
// ─────────────────────────────────────────
export async function saveTechnicalReviewDraft(formData: FormData) {
  try {
    const { user, role } = await getCurrentUserAndRole();
    if (!['engineering', 'manager', 'admin'].includes(role)) {
      return { error: 'Không có quyền tạo/sửa Technical Review.' };
    }

    const supabase = await createClient();
    const reviewId = formData.get('review_id') as string | null;
    const caseId   = formData.get('case_id') as string;

    const payload = {
      case_id:            caseId,
      product_id:         formData.get('product_id') || null,
      design_revision_id: formData.get('design_revision_id') || null,
      material_spec:      formData.get('material_spec') || null,
      thickness_mm:       formData.get('thickness_mm') ? Number(formData.get('thickness_mm')) : null,
      special_requirements: formData.get('special_requirements') || null,
      mold_option:        formData.get('mold_option') || null,
      mold_id:            formData.get('mold_id') || null,
      pocket_count:       formData.get('pocket_count') ? Number(formData.get('pocket_count')) : null,
      mold_size_x:        formData.get('mold_size_x') ? Number(formData.get('mold_size_x')) : null,
      mold_size_y:        formData.get('mold_size_y') ? Number(formData.get('mold_size_y')) : null,
      cutting_die_option: formData.get('cutting_die_option') || null,
      cutting_die_id:     formData.get('cutting_die_id') || null,
      machine_id:         formData.get('machine_id') || null,
      lead_time_days:     formData.get('lead_time_days') ? Number(formData.get('lead_time_days')) : null,
      cycle_time_sec:     formData.get('cycle_time_sec') ? Number(formData.get('cycle_time_sec')) : null,
      technical_constraints: formData.get('technical_constraints') || null,
      approval_status:    'draft' as TechnicalReviewStatus,
      requested_by:       user.id,
    };

    if (reviewId) {
      // Update: only if still draft
      const { data: existing } = await (supabase as any)
        .from('technical_reviews')
        .select('approval_status')
        .eq('id', reviewId)
        .single();

      if (existing && existing.approval_status !== 'draft') {
        return { error: 'Không thể sửa review đã được gửi duyệt hoặc đã duyệt.' };
      }

      const { error } = await (supabase as any)
        .from('technical_reviews')
        .update(payload)
        .eq('id', reviewId);

      if (error) return { error: error.message };
    } else {
      // Create: get next version number
      const { data: existing } = await (supabase as any)
        .from('technical_reviews')
        .select('version')
        .eq('case_id', caseId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      const nextVersion = (existing?.version ?? 0) + 1;

      const { error } = await (supabase as any)
        .from('technical_reviews')
        .insert({ ...payload, version: nextVersion });

      if (error) return { error: error.message };
    }

    revalidatePath(`/cases/${caseId}`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// ─────────────────────────────────────────
// Submit for review (draft -> in_review)
// ─────────────────────────────────────────
export async function submitTechnicalReview(reviewId: string) {
  try {
    const { role } = await getCurrentUserAndRole();
    if (!['engineering', 'manager', 'admin'].includes(role)) {
      return { error: 'Không có quyền gửi duyệt.' };
    }

    const supabase = await createClient();
    const { data: review } = await (supabase as any)
      .from('technical_reviews')
      .select('approval_status, case_id')
      .eq('id', reviewId)
      .single();

    if (!review) return { error: 'Review không tồn tại.' };
    if (review.approval_status !== 'draft') {
      return { error: 'Chỉ có thể gửi duyệt review ở trạng thái Draft.' };
    }

    const { error } = await (supabase as any)
      .from('technical_reviews')
      .update({ approval_status: 'in_review' })
      .eq('id', reviewId);

    if (error) return { error: error.message };

    revalidatePath(`/cases/${review.case_id}`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// ─────────────────────────────────────────
// Approve or Reject (in_review -> approved/rejected)
// ─────────────────────────────────────────
export async function approveTechnicalReview(
  reviewId: string,
  decision: 'approved' | 'rejected',
  rejectReason: string
) {
  try {
    const { user, role } = await getCurrentUserAndRole();
    if (role !== 'manager' && role !== 'admin') {
      return { error: 'Chỉ Manager mới có quyền duyệt / từ chối.' };
    }

    const supabase = await createClient();
    const { data: review } = await (supabase as any)
      .from('technical_reviews')
      .select('approval_status, case_id')
      .eq('id', reviewId)
      .single();

    if (!review) return { error: 'Review không tồn tại.' };
    if (review.approval_status !== 'in_review') {
      return { error: 'Chỉ có thể duyệt review ở trạng thái In Review.' };
    }

    const updatePayload: Record<string, unknown> = {
      approval_status: decision,
      approved_by: user.id,
      approved_at: new Date().toISOString(),
    };

    if (decision === 'rejected') {
      updatePayload.rejected_reason = rejectReason;
    }

    const { error } = await (supabase as any)
      .from('technical_reviews')
      .update(updatePayload)
      .eq('id', reviewId);

    if (error) return { error: error.message };

    // Update business_case status if approved
    if (decision === 'approved') {
      await (supabase as any)
        .from('business_cases')
        .update({ status: 'quotation_ready' })
        .eq('case_id', review.case_id);
    }

    revalidatePath(`/cases/${review.case_id}`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// ─────────────────────────────────────────
// Create new revision (supersede approved -> new draft)
// ─────────────────────────────────────────
export async function createTechnicalReviewRevision(caseId: string) {
  try {
    const { role } = await getCurrentUserAndRole();
    if (!['engineering', 'manager', 'admin'].includes(role)) {
      return { error: 'Không có quyền tạo revision mới.' };
    }

    const supabase = await createClient();

    // Mark current approved as superseded
    const { error: supersedeError } = await (supabase as any)
      .from('technical_reviews')
      .update({ approval_status: 'superseded' })
      .eq('case_id', caseId)
      .eq('approval_status', 'approved');

    if (supersedeError) return { error: supersedeError.message };

    revalidatePath(`/cases/${caseId}`);
    return { success: true };
  } catch (e: unknown) {
    return { error: e instanceof Error ? e.message : 'Unknown error' };
  }
}
