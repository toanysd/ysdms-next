/**
 * Utility to resolve dynamic Inkan/Hanko stamp image for employees
 */
export function getEmployeeStampUrl(employee?: {
  employee_id?: string | null
  employee_code?: string | null
  employee_name_short?: string | null
  employee_name?: string | null
} | null): string {
  if (!employee) return '/stamps/stamp_toan.png'

  const code = (employee.employee_code || '').trim().toLowerCase()
  const shortName = (employee.employee_name_short || employee.employee_name || '').trim()

  // 1. Explicit matches for President Yoshida and Toan
  if (code === 'm01' || shortName.includes('吉田')) {
    return '/stamps/stamp_yoshida.png'
  }
  if (code === 'm09' || shortName.includes('トアン') || shortName.toLowerCase().includes('toan')) {
    return '/stamps/stamp_toan.png'
  }

  // 2. Dynamic employee code matching (M02..M14, L01..L09)
  if (code) {
    return `/stamps/stamp_${code}.png`
  }

  return '/stamps/stamp_toan.png'
}
