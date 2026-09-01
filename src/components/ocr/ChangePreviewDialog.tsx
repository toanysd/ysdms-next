import React from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface ChangePreviewDialogProps {
  isOpen: boolean
  previewLogs: string[]
  saving: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function ChangePreviewDialog({ isOpen, previewLogs, saving, onCancel, onConfirm }: ChangePreviewDialogProps) {
  if (!isOpen) return null

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
          maxWidth: 520,
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
            <CheckCircle2 size={18} />
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>変更内容を確認 (プレビュー)</h3>
          </div>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: 20, maxHeight: '60vh' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 0, marginBottom: 16 }}>
            以下の内容でデータベースが更新されます。まだ保存されていません。
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {previewLogs.map((log: string, idx: number) => {
              let badgeColor = 'var(--bg-surface-2)'
              let textColor = 'var(--text-primary)'
              
              if (log.startsWith('🆕')) {
                badgeColor = '#dcfce7'
                textColor = '#166534'
              } else if (log.startsWith('✅') || log.startsWith('🔄')) {
                badgeColor = '#e0f2fe'
                textColor = '#0369a1'
              } else if (log.startsWith('⏭')) {
                badgeColor = '#f3f4f6'
                textColor = '#4b5563'
              } else if (log.startsWith('🔗')) {
                badgeColor = '#f3e8ff'
                textColor = '#6b21a8'
              }
              
              return (
                <div 
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    background: badgeColor,
                    color: textColor,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 500,
                    lineHeight: 1.5,
                    wordBreak: 'break-all'
                  }}
                >
                  {log}
                </div>
              )
            })}
          </div>
        </div>
        
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface-2)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={saving}
          >
            ✕ キャンセル
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? '保存中...' : '✅ 確定して保存'}
          </button>
        </div>
      </div>
    </div>
  )
}
