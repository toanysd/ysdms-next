'use client'

import { useState } from 'react'
import { Play, Loader2, CheckCircle2 } from 'lucide-react'
import { confirmWorkOrderAction } from '../actions'

export function ConfirmWoButton({ woId, status }: { woId: string, status: string }) {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  if (status !== 'PLANNED') {
    return (
      <button className="btn btn-secondary flex items-center gap-1.5 cursor-not-allowed opacity-50" disabled>
        <CheckCircle2 size={14} />
        <span>Đã Xác Nhận</span>
      </button>
    )
  }

  const handleConfirm = async () => {
    if (!confirm('Xác nhận Lệnh Sản Xuất và tự động sinh các Jobs thiết bị?')) return

    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    const res = await confirmWorkOrderAction(woId)
    if (res.error) {
      setErrorMsg(res.error)
      alert(res.error) // Simple fallback toast
    } else {
      const data = res.data
      const msg = `Tạo thành công ${(data as any)?.jobs_created} jobs.`
      setSuccessMsg(msg)
      alert(msg)
    }
    setLoading(false)
  }

  return (
    <button 
      className="btn btn-primary flex items-center gap-1.5 cursor-pointer"
      onClick={handleConfirm}
      disabled={loading}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
      <span>{loading ? 'Đang Xử Lý...' : 'Xác Nhận & Sinh Jobs'}</span>
    </button>
  )
}
