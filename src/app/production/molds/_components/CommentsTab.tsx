'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addComment } from '../actions'

interface CommentsTabProps {
  moldId: string
  employees: { id: string; name: string; name_ja?: string }[]
}

export function CommentsTab({ moldId, employees }: CommentsTabProps) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  // Form state
  const [content, setContent] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const { data, error } = await supabase
        .from('mold_comments')
        .select(`
          id, content, created_at,
          author:employees!mold_comments_author_id_fkey(name, name_ja)
        `)
        .eq('mold_physical_id', moldId)
        .order('created_at', { ascending: false })

      if (data) {
        setComments(data)
      }
      setLoading(false)
    }
    loadData()
  }, [moldId, refreshTrigger, supabase])

  const handleSubmit = async () => {
    if (!employeeId || !content.trim()) return
    
    setIsSubmitting(true)
    setError(null)
    
    const res = await addComment(moldId, employeeId, content.trim())
    if (res.success) {
      setContent('')
      setRefreshTrigger(prev => prev + 1)
    } else {
      setError(res.error || 'Lỗi không xác định khi lưu ghi chú.')
    }
    
    setIsSubmitting(false)
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      {/* ADD COMMENT FORM */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 font-bold text-xs text-slate-700">
          新規メモ / THÊM GHI CHÚ
        </div>
        <div className="p-3 space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Nội dung ghi chú *</label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Nhập nội dung..."
              rows={3}
              className="w-full p-2 text-sm border border-slate-300 rounded focus:ring-1 focus:ring-mcs-primary outline-none"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] text-slate-500 font-medium">Người ghi chú *</label>
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

          {error && <div className="text-xs text-mcs-error mt-1">{error}</div>}

          <button 
            onClick={handleSubmit}
            disabled={!employeeId || !content.trim() || isSubmitting}
            className="w-full min-h-[40px] bg-mcs-primary text-white text-sm font-bold rounded hover:bg-mcs-primary-hover transition-colors disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Đang lưu...' : 'Lưu ghi chú 保存'}
          </button>
        </div>
      </div>

      {/* COMMENTS LIST */}
      <div>
        <h3 className="font-bold text-xs text-slate-600 border-b border-slate-200 pb-2 mb-4">
          LỊCH SỬ GHI CHÚ / メモ履歴
        </h3>
        
        {loading ? (
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-slate-200 rounded"></div>
            <div className="h-20 bg-slate-200 rounded"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm border border-dashed border-slate-200 rounded">
            Chưa có ghi chú nào.
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="bg-white border border-slate-200 rounded p-3 shadow-sm relative group">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-xs text-mcs-primary">
                    {comment.author?.name || 'Unknown'}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(comment.created_at).toLocaleString('ja-JP')}
                  </div>
                </div>
                <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
