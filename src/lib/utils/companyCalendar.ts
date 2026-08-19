/**
 * companyCalendar.ts — Tiện ích tính toán Lịch Công Ty & Ngày làm việc (稼働日)
 */

export interface CalendarDay {
  calendar_date: string;
  day_type: 'WORKDAY' | 'HOLIDAY' | 'PUBLIC_HOLIDAY' | 'SPECIAL_WORKDAY' | 'COMPANY_OFF';
  is_working_day: boolean;
  working_hours: number;
  notes?: string | null;
}

/**
 * Lùi N ngày làm việc thực tế từ baseDate dựa trên lịch công ty.
 * Nếu baseDate là ngày nghỉ, sẽ tính từ ngày làm việc trước đó.
 */
export function subtractWorkingDays(
  baseDateStr: string,
  daysToSubtract: number,
  calendarMap?: Map<string, boolean>
): string {
  if (!baseDateStr || daysToSubtract <= 0) return baseDateStr;

  const [y, m, d] = baseDateStr.slice(0, 10).split('-').map(Number);
  let curr = new Date(Date.UTC(y, m - 1, d));

  let remaining = daysToSubtract;

  // Lùi từng ngày và kiểm tra ngày làm việc
  while (remaining > 0) {
    curr.setUTCDate(curr.getUTCDate() - 1);
    const dateStr = curr.toISOString().slice(0, 10);
    const dayOfWeek = curr.getUTCDay();

    // Check against calendarMap if provided, otherwise fallback to weekend check
    const isWorkday = calendarMap
      ? (calendarMap.has(dateStr) ? calendarMap.get(dateStr)! : (dayOfWeek !== 0 && dayOfWeek !== 6))
      : (dayOfWeek !== 0 && dayOfWeek !== 6);

    if (isWorkday) {
      remaining--;
    }
  }

  return curr.toISOString().slice(0, 10);
}

/**
 * Tiến N ngày làm việc thực tế từ baseDate dựa trên lịch công ty.
 */
export function addWorkingDays(
  baseDateStr: string,
  daysToAdd: number,
  calendarMap?: Map<string, boolean>
): string {
  if (!baseDateStr || daysToAdd <= 0) return baseDateStr;

  const [y, m, d] = baseDateStr.slice(0, 10).split('-').map(Number);
  let curr = new Date(Date.UTC(y, m - 1, d));

  let remaining = daysToAdd;

  while (remaining > 0) {
    curr.setUTCDate(curr.getUTCDate() + 1);
    const dateStr = curr.toISOString().slice(0, 10);
    const dayOfWeek = curr.getUTCDay();

    const isWorkday = calendarMap
      ? (calendarMap.has(dateStr) ? calendarMap.get(dateStr)! : (dayOfWeek !== 0 && dayOfWeek !== 6))
      : (dayOfWeek !== 0 && dayOfWeek !== 6);

    if (isWorkday) {
      remaining--;
    }
  }

  return curr.toISOString().slice(0, 10);
}

/**
 * Tính toán Kỳ hạn Mục tiêu Hoàn thành (target_completion_date / 完成目標日):
 * 1. Nếu có manualOverride: Dùng manualOverride.
 * 2. Nếu có shipDate: Mục tiêu an toàn = Lùi 3 ngày làm việc từ shipDate (出荷納期の3稼働日前).
 * 3. Nếu có moldDeadline: Mục tiêu chỉ thị = Lùi 1 ngày làm việc từ moldDeadline (指示納期の1稼働日前).
 * 4. Nếu có cả 2: Lấy ngày sớm hơn (minDate) để đảm bảo an toàn tuyệt đối.
 */
export function calculateTargetCompletionDate(
  shipDate?: string | null,
  moldDeadline?: string | null,
  manualOverride?: string | null,
  calendarMap?: Map<string, boolean>
): string | null {
  if (manualOverride) return manualOverride.slice(0, 10);

  const cleanShip = shipDate ? shipDate.slice(0, 10) : null;
  const cleanMold = moldDeadline ? moldDeadline.slice(0, 10) : null;

  let targetFromShip: string | null = null;
  let targetFromMold: string | null = null;

  if (cleanShip) {
    targetFromShip = subtractWorkingDays(cleanShip, 3, calendarMap);
  }

  if (cleanMold) {
    targetFromMold = subtractWorkingDays(cleanMold, 1, calendarMap);
  }

  if (targetFromShip && targetFromMold) {
    return targetFromShip < targetFromMold ? targetFromShip : targetFromMold;
  }

  return targetFromShip || targetFromMold || null;
}
