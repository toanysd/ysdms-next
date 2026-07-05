import re

with open('src/app/production/molds/_components/TeflonTab.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'(.*?)(?=function NewTeflonForm)', content, re.DOTALL)
if match:
    clean_top = match.group(1)
    
    new_bottom = """function NewTeflonForm({ moldId, employees, onRefresh }: { moldId: string, employees: TeflonTabProps['employees'], onRefresh: () => void }) {
  const [coatingType, setCoatingType] = React.useState('')
  const [sentDate, setSentDate] = React.useState(new Date().toISOString().split('T')[0])
  const [expectedReturnDate, setExpectedReturnDate] = React.useState('')
  const [costJpy, setCostJpy] = React.useState('')
  const [employeeId, setEmployeeId] = React.useState('')
  const [notes, setNotes] = React.useState('')
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async () => {
    if (!employeeId) return
    setIsSubmitting(true)
    setError(null)
    
    const payload = {
      coating_type: coatingType || undefined,
      sent_date: sentDate || undefined,
      expected_return_date: expectedReturnDate || undefined,
      cost_jpy: costJpy ? parseFloat(costJpy) : undefined,
      notes: notes || undefined
    }

    const res = await sendToTeflon(moldId, employeeId, payload)
    if (res.success) {
      onRefresh()
    } else {
      setError(res.error || 'Lỗi không xác định')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border border-mcs-border rounded overflow-hidden shadow-sm bg-white">
      <div className="bg-slate-100 px-3 py-2 border-b border-mcs-border font-bold text-xs text-slate-700 flex items-center gap-2">
        <span className="text-mcs-primary">+</span> Tạo đợt mạ mới / 新規テフロン依頼
      </div>
      
      <div className="p-3 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Loại mạ (Coating Type)</label>
            <input 
              type="text" 
              value={coatingType}
              onChange={e => setCoatingType(e.target.value)}
              className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Chi phí / Cost (¥)</label>
            <input 
              type="number" 
              value={costJpy}
              onChange={e => setCostJpy(e.target.value)}
              className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Ngày gửi (Sent Date)</label>
            <input 
              type="date" 
              value={sentDate}
              onChange={e => setSentDate(e.target.value)}
              className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Hạn trả về (Return Date)</label>
            <input 
              type="date" 
              value={expectedReturnDate}
              onChange={e => setExpectedReturnDate(e.target.value)}
              className="p-2 border border-slate-300 rounded text-sm focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500 font-medium">Nhân viên *</label>
          <select 
            value={employeeId}
            onChange={e => setEmployeeId(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
          >
            <option value="">-- Chọn nhân viên --</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[11px] text-slate-500 font-medium">Ghi chú (Notes)</label>
          <textarea 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
            className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
            disabled={isSubmitting}
          />
        </div>

        {error && <div className="text-xs text-mcs-error mt-1">{error}</div>}

        <button 
          onClick={handleSubmit}
          disabled={!employeeId || isSubmitting}
          className="w-full min-h-[40px] bg-mcs-primary text-white text-sm font-bold rounded hover:bg-mcs-primary-hover transition-colors disabled:opacity-50 mt-2"
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi mạ / テフロンへ送る'}
        </button>
      </div>
    </div>
  )
}

function HistorySection({ logs }: { logs: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xs text-slate-600 border-b border-slate-200 pb-2">
        LỊCH SỬ / 履歴
      </h3>
      
      {logs.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 rounded">
          Chưa có lịch sử.
        </div>
      ) : (
        <div className="space-y-3">
          {logs.map(log => (
            <div key={log.id} className="bg-white border border-slate-200 rounded p-3 text-sm shadow-sm relative">
              <div className="flex justify-between items-start border-b border-slate-100 pb-2 mb-2">
                <div className="font-bold flex items-center gap-2">
                  <span className={
                    log.status === 'COMPLETED' ? 'text-teal-600' :
                    log.status === 'CANCELLED' ? 'text-slate-400' : 'text-slate-700'
                  }>
                    {log.status === 'COMPLETED' ? '✓ ĐÃ NHẬN' : log.status === 'CANCELLED' ? '× ĐÃ HỦY' : log.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date(log.created_at).toLocaleDateString('ja-JP')}
                </div>
              </div>
              
              <div className="grid grid-cols-[100px_1fr] gap-y-1">
                <span className="text-slate-500 text-xs">Loại mạ:</span><span>{log.coating_type || '-'}</span>
                <span className="text-slate-500 text-xs">Gửi ngày:</span><span>{log.sent_date ? new Date(log.sent_date).toLocaleDateString('ja-JP') : '-'}</span>
                
                {log.status === 'COMPLETED' && (
                  <React.Fragment>
                    <span className="text-slate-500 text-xs">Ngày nhận:</span><span>{log.received_date ? new Date(log.received_date).toLocaleDateString('ja-JP') : '-'}</span>
                    <span className="text-slate-500 text-xs">Chất lượng:</span><span>{log.quality_note || '-'}</span>
                  </React.Fragment>
                )}
                
                {log.status === 'CANCELLED' && (
                  <React.Fragment>
                    <span className="text-slate-500 text-xs">Lý do hủy:</span><span className="text-red-500">{log.reason || '-'}</span>
                  </React.Fragment>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
"""
    with open('src/app/production/molds/_components/TeflonTab.tsx', 'w', encoding='utf-8') as f:
        f.write(clean_top + new_bottom)
    print("File rewritten successfully.")
else:
    print("Could not find NewTeflonForm marker.")
