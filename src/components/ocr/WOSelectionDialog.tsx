import React, { useState } from 'react'
import { X, Network, Briefcase, FileText } from 'lucide-react'

interface WOSelectionDialogProps {
  isOpen: boolean
  productCode: string
  companyName: string
  workOrders: any[]
  currentWoId: string | null
  onCancel: () => void
  onConfirm: (woId: string | null, jobId?: string | null) => void
}

export function WOSelectionDialog({ isOpen, productCode, companyName, workOrders, currentWoId, onCancel, onConfirm }: WOSelectionDialogProps) {
  const [selectedWo, setSelectedWo] = useState<string | null>(currentWoId)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (!isOpen) return null

  const toggleExpand = (woId: string) => {
    setExpanded(prev => ({ ...prev, [woId]: !prev[woId] }))
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100000, // Higher than modal
        padding: 12
      }}
      onClick={onCancel}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: 600,
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
          borderRadius: 8
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0369a1' }}>
            <Network size={18} />
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>📋 関連するWork Orderの選択</h3>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, maxHeight: '60vh' }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
            {productCode} — {companyName}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {workOrders.map((wo) => {
              const isExpanded = expanded[wo.wo_id] !== false // default expanded
              const jobs = wo.jobs || []
              
              return (
                <div key={wo.wo_id} style={{ border: '1px solid var(--border-default)', borderRadius: 6, overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      padding: '10px 12px', 
                      background: 'var(--bg-surface-2)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      cursor: 'pointer',
                      borderBottom: isExpanded ? '1px solid var(--border-default)' : 'none'
                    }}
                    onClick={() => toggleExpand(wo.wo_id)}
                  >
                    <div style={{ marginRight: 8, color: 'var(--text-muted)' }}>
                      {isExpanded ? '▼' : '▶'}
                    </div>
                    <Briefcase size={16} style={{ marginRight: 8, color: 'var(--text-muted)' }} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{wo.wo_code}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{wo.wo_name}</span>
                      {wo.wo_status === 'COMPLETED' && <span className="badge badge--success" style={{ fontSize: 10 }}>完了</span>}
                      {wo.wo_status === 'PLANNED' && <span className="badge badge--neutral" style={{ fontSize: 10 }}>計画中</span>}
                      {wo.wo_status === 'IN_PROGRESS' && <span className="badge badge--warning" style={{ fontSize: 10 }}>進行中</span>}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div style={{ padding: '8px 12px 12px 32px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {jobs.length === 0 ? (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>ジョブがありません</div>
                      ) : (
                        jobs.map((job: any, index: number) => {
                          const isLast = index === jobs.length - 1
                          return (
                            <div key={job.job_id} style={{ display: 'flex', alignItems: 'center', fontSize: 12, color: 'var(--text-primary)' }}>
                              <span style={{ color: 'var(--border-default)', marginRight: 8 }}>
                                {isLast ? '└─' : '├─'}
                              </span>
                              <FileText size={12} style={{ marginRight: 6, color: 'var(--text-muted)' }} />
                              <span style={{ flex: 1 }}>{job.job_name}</span>
                              {job.job_status === 'COMPLETED' && <span style={{ color: '#16a34a', fontSize: 11 }}>✅ 完了</span>}
                              {(job.job_status === 'PLANNED' || job.job_status === 'IN_PROGRESS') && <span style={{ color: '#d97706', fontSize: 11 }}>🔄 進行中</span>}
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>この工程票の適用先を選択:</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {workOrders.map((wo) => (
                <label key={wo.wo_id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 12px', border: selectedWo === wo.wo_id ? '2px solid var(--accent)' : '1px solid var(--border-default)', borderRadius: 6, background: selectedWo === wo.wo_id ? 'var(--tint-blue-bg)' : 'transparent' }}>
                  <input
                    type="radio"
                    name="targetWo"
                    checked={selectedWo === wo.wo_id}
                    onChange={() => setSelectedWo(wo.wo_id)}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  <span style={{ fontSize: 13, fontWeight: selectedWo === wo.wo_id ? 600 : 400 }}>
                    {wo.wo_code} に既存ジョブを追加・更新する
                  </span>
                </label>
              ))}
              
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 12px', border: selectedWo === null ? '2px solid var(--accent)' : '1px solid var(--border-default)', borderRadius: 6, background: selectedWo === null ? 'var(--tint-blue-bg)' : 'transparent' }}>
                <input
                  type="radio"
                  name="targetWo"
                  checked={selectedWo === null}
                  onChange={() => setSelectedWo(null)}
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span style={{ fontSize: 13, fontWeight: selectedWo === null ? 600 : 400 }}>
                  新規 Work Order を作成する
                </span>
              </label>
            </div>
          </div>
        </div>
        
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={() => {
              if (!selectedWo) {
                onConfirm(null, null)
              } else {
                const targetWoObj = workOrders.find(w => w.wo_id === selectedWo)
                const moldJob = (targetWoObj?.jobs || []).find((j: any) => 
                  !j.job_category || j.job_category.startsWith('MOLD')
                )
                onConfirm(selectedWo, moldJob?.job_id || null)
              }
            }}
            className="btn btn-primary"
          >
            ✅ 適用先を確定
          </button>
        </div>
      </div>
    </div>
  )
}
