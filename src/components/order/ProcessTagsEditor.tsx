'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Plus, Loader2, X, Edit3 } from 'lucide-react'
import { getProcessTagsAction, addCustomTagAction, ProcessTag } from '@/app/actions/tags'

interface ProcessTagsEditorProps {
    value: string
    onChange: (newValue: string) => void
}

const FALLBACK_TAGS: ProcessTag[] = [
    { id: '1', label: '【台湾機】', display_text: '台湾機', category: 'process' },
    { id: '2', label: '【別抜き】', display_text: '別抜き', category: 'process' },
    { id: '3', label: '【袋詰め】', display_text: '袋詰め', category: 'packaging' },
    { id: '4', label: '【面取り】', display_text: '面取り', category: 'process' },
    { id: '5', label: '【全数検査】', display_text: '全数検査', category: 'process' },
    { id: '6', label: '【無地ケース】', display_text: '無地ケース', category: 'packaging' },
    { id: '7', label: '【無地ラベル】', display_text: '無地ラベル', category: 'packaging' },
    { id: '8', label: '【導電シート】', display_text: '導電シート', category: 'packaging' },
    { id: '9', label: '【YSUIOI箱使用】', display_text: 'YSUIOI箱使用', category: 'packaging' }
]

export function ProcessTagsEditor({ value, onChange }: ProcessTagsEditorProps) {
    const [systemTags, setSystemTags] = useState<ProcessTag[]>([])
    const [customTagsList, setCustomTagsList] = useState<ProcessTag[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [customText, setCustomText] = useState('')
    const [isSavingCustom, setIsSavingCustom] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const tagsData = await getProcessTagsAction()
                if (tagsData.system.length > 0 || tagsData.custom.length > 0) {
                    setSystemTags(tagsData.system)
                    setCustomTagsList(tagsData.custom)
                } else {
                    setSystemTags(FALLBACK_TAGS)
                    setCustomTagsList([])
                }
            } catch (err) {
                setSystemTags(FALLBACK_TAGS)
                setCustomTagsList([])
            } finally {
                setIsLoading(false)
            }
        }
        fetchTags()
    }, [])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsExpanded(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Bóc tách text tự do và các tags (Regex parse)
    const { selectedLabels, freeText } = useMemo(() => {
        const val = value || ''
        const tagRegex = /【.*?】/g
        const matched: string[] = val.match(tagRegex) || []

        let leftover = val
        matched.forEach(t => {
            leftover = leftover.replace(t, '')
        })

        return {
            selectedLabels: matched,
            freeText: leftover.trim()
        }
    }, [value])

    const handleToggleTag = (label: string) => {
        let newTags = [...selectedLabels]
        if (newTags.includes(label)) {
            newTags = newTags.filter(t => t !== label)
        } else {
            newTags.push(label)
        }

        const finalString = newTags.join('') + (freeText ? ' ' + freeText : '')
        onChange(finalString)
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const finalString = selectedLabels.join('') + (e.target.value ? ' ' + e.target.value : '')
        onChange(finalString)
    }

    const handleAddCustom = async () => {
        const t = customText.trim()
        if (!t) return
        const labelText = `【${t}】`

        try {
            setIsSavingCustom(true)
            // Gửi Server
            const newDbTag = await addCustomTagAction(labelText, t)
            setCustomTagsList(prev => [newDbTag, ...prev])
            setCustomText('')
            // Auto Select
            const finalString = [...selectedLabels, labelText].join('') + (freeText ? ' ' + freeText : '')
            onChange(finalString)
        } catch (err) {
            alert('Không thể lưu Custom Tag (Lưu ý: tag có thể đã bị trùng). Áp dụng thủ công.')
            const finalString = [...selectedLabels, labelText].join('') + (freeText ? ' ' + freeText : '')
            onChange(finalString)
            setCustomText('')
        } finally {
            setIsSavingCustom(false)
        }
    }

    if (isLoading) return <div className="h-[34px] w-full animate-pulse bg-gray-100 rounded" />

    if (!isExpanded) {
        return (
            <div
                className="w-full min-h-[34px] px-2 py-1 cursor-text hover:bg-gray-50 flex flex-col justify-center gap-1 transition-colors"
                onClick={() => setIsExpanded(true)}
            >
                {selectedLabels.length === 0 && !freeText && (
                    <div className="flex items-center gap-1 text-gray-400 text-[11px] italic">
                        <Edit3 size={12} /> メモを追加...
                    </div>
                )}

                {selectedLabels.length > 0 && (
                    <div className="flex flex-wrap gap-0.5">
                        {selectedLabels.map(l => (
                            <span key={l} className="text-[10px] px-1 bg-amber-100 text-amber-800 rounded border border-amber-200">
                                {l}
                            </span>
                        ))}
                    </div>
                )}
                {freeText && (
                    <span className="text-[11px] text-gray-600 truncate">{freeText}</span>
                )}
            </div>
        )
    }

    return (
        <div className="relative w-full">
            <div ref={containerRef} className="flex flex-col gap-1.5 p-2 w-[320px] bg-white border-2 border-teal-500 rounded shadow-lg absolute z-[60] right-0 top-0 origin-top-right">
                <div className="flex justify-between items-center mb-0.5 pb-1 border-b border-gray-100">
                    <span className="text-[10px] font-bold text-teal-700">📋 タグ・メモ編集</span>
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                <div className="flex flex-col gap-1.5">
                    {/* System Tags */}
                    <div className="flex flex-wrap gap-1">
                        {systemTags.map(tag => {
                            const isSelected = selectedLabels.includes(tag.label)
                            return (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => handleToggleTag(tag.label)}
                                    className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors shadow-sm font-bold truncate ${isSelected
                                        ? 'bg-amber-600 text-white border-amber-700'
                                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {tag.display_text}
                                </button>
                            )
                        })}
                    </div>
                    {/* Custom Tags */}
                    {customTagsList.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5 pt-1 border-t border-emerald-100/50">
                            {customTagsList.map(tag => {
                                const isSelected = selectedLabels.includes(tag.label)
                                return (
                                    <button
                                        key={tag.id}
                                        type="button"
                                        onClick={() => handleToggleTag(tag.label)}
                                        className={`px-1.5 py-0.5 text-[10px] rounded border transition-colors shadow-sm font-bold truncate ${isSelected
                                            ? 'bg-blue-600 text-white border-blue-700'
                                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                                            }`}
                                        title="Tag cá nhân (Custom)"
                                    >
                                        {tag.display_text}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                <div className="flex gap-1 items-center mt-1">
                    <input
                        type="text"
                        value={customText}
                        onChange={e => setCustomText(e.target.value)}
                        placeholder="Tạo mộc mới..."
                        className="flex-1 h-[24px] text-[10px] border border-gray-200 rounded px-1.5"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                handleAddCustom()
                            }
                        }}
                    />
                    <button
                        type="button"
                        onClick={handleAddCustom}
                        disabled={isSavingCustom || !customText.trim()}
                        className="h-[24px] px-2 bg-gray-200 text-gray-700 text-[10px] rounded font-bold hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center whitespace-nowrap"
                    >
                        {isSavingCustom ? <Loader2 size={12} className="animate-spin" /> : '+ 追加'}
                    </button>
                </div>

                <textarea
                    value={freeText}
                    onChange={handleTextChange}
                    className="w-full min-h-[40px] text-[11px] p-1.5 border border-teal-200 focus:border-teal-500 rounded mt-1 resize-y bg-yellow-50"
                    placeholder="テキストを自由に入力..."
                />
            </div>
        </div>
    )
}
