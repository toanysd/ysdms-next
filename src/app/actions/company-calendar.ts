'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CalendarDayRecord {
  calendar_date: string
  day_type: 'WORKDAY' | 'HOLIDAY' | 'PUBLIC_HOLIDAY' | 'SPECIAL_WORKDAY' | 'COMPANY_OFF'
  is_working_day: boolean
  working_hours: number
  notes: string | null
  created_at?: string
  updated_at?: string
}

/**
 * Lấy danh sách ngày trong lịch công ty theo năm và tháng (hoặc khoảng ngày)
 */
export async function getCompanyCalendar(year: number, month?: number): Promise<{ success: boolean; data?: CalendarDayRecord[]; error?: string }> {
  try {
    const supabase = await createClient()

    let start = `${year}-01-01`
    let end = `${year}-12-31`

    if (month && month >= 1 && month <= 12) {
      const mStr = String(month).padStart(2, '0')
      const lastDay = new Date(year, month, 0).getDate()
      start = `${year}-${mStr}-01`
      end = `${year}-${mStr}-${String(lastDay).padStart(2, '0')}`
    }

    const { data, error } = await supabase
      .from('company_calendar')
      .select('*')
      .gte('calendar_date', start)
      .lte('calendar_date', end)
      .order('calendar_date', { ascending: true })

    if (error) throw error

    return { success: true, data: (data as CalendarDayRecord[]) || [] }
  } catch (err: any) {
    console.error('getCompanyCalendar error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Cập nhật thông tin 1 ngày trong lịch công ty
 */
export async function updateCalendarDay(
  dateStr: string,
  payload: Partial<CalendarDayRecord>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    const updateData: any = {
      ...payload,
      updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('company_calendar')
      .upsert({
        calendar_date: dateStr,
        ...updateData
      }, { onConflict: 'calendar_date' })

    if (error) throw error

    revalidatePath('/master/calendar')
    revalidatePath('/equipment/schedule')
    return { success: true }
  } catch (err: any) {
    console.error('updateCalendarDay error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Chuyển đổi nhanh 1-chạm (Toggle): Ngày làm việc ↔ Ngày nghỉ
 */
export async function toggleWorkingDay(dateStr: string): Promise<{ success: boolean; is_working_day?: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // 1. Fetch current status
    const { data: current } = await supabase
      .from('company_calendar')
      .select('is_working_day, day_type')
      .eq('calendar_date', dateStr)
      .single()

    const currentIsWorking = current?.is_working_day ?? true
    const nextIsWorking = !currentIsWorking

    const dayOfWeek = new Date(dateStr + 'T00:00:00Z').getUTCDay()
    let nextDayType: string = nextIsWorking ? 'WORKDAY' : 'HOLIDAY'
    if (nextIsWorking && dayOfWeek === 6) {
      nextDayType = 'SPECIAL_WORKDAY' // Thứ 7 đi làm
    } else if (!nextIsWorking && (dayOfWeek === 0 || dayOfWeek === 6)) {
      nextDayType = 'HOLIDAY'
    } else if (!nextIsWorking) {
      nextDayType = 'COMPANY_OFF'
    }

    const { error } = await supabase
      .from('company_calendar')
      .upsert({
        calendar_date: dateStr,
        is_working_day: nextIsWorking,
        day_type: nextDayType,
        working_hours: nextIsWorking ? 8.0 : 0.0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'calendar_date' })

    if (error) throw error

    revalidatePath('/master/calendar')
    revalidatePath('/equipment/schedule')
    return { success: true, is_working_day: nextIsWorking }
  } catch (err: any) {
    console.error('toggleWorkingDay error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Cập nhật hàng loạt (ví dụ: gán chuỗi ngày nghỉ Obon, nghỉ Tết)
 */
export async function batchUpdateCalendarDays(
  dates: string[],
  payload: Partial<CalendarDayRecord>
): Promise<{ success: boolean; count?: number; error?: string }> {
  try {
    const supabase = await createClient()

    const records = dates.map(d => ({
      calendar_date: d,
      ...payload,
      updated_at: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('company_calendar')
      .upsert(records, { onConflict: 'calendar_date' })

    if (error) throw error

    revalidatePath('/master/calendar')
    revalidatePath('/equipment/schedule')
    return { success: true, count: dates.length }
  } catch (err: any) {
    console.error('batchUpdateCalendarDays error:', err)
    return { success: false, error: err.message }
  }
}
