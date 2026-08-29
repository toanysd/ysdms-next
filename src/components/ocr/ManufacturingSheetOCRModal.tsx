'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles, Camera, Upload, X, Check, AlertCircle, Loader2, ArrowRight,
  ExternalLink, FileText, CheckCircle2, RefreshCw, Key, Image as ImageIcon,
  Wrench, ZoomIn, ZoomOut, RotateCcw, Search, CheckSquare, Square, Box, Layers,
  FilePlus2, Calendar
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { compressImageFile } from '@/lib/storage/EquipmentPhotoStore'
import { AsyncSearchableSelect } from '@/components/ui/AsyncSearchableSelect'
import { lookupCavType } from '@/lib/utils/moldNaming'

interface ManufacturingSheetOCRModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (result: any) => void
}

interface PlasticMasterItem {
  plastic_id: string
  plastic_code: string
  plastic_family: string
  plastic_subtype?: string | null
  thickness_mm: number
  width_mm: number
  color?: string | null
  electrical_property?: string | null
}

interface ComponentItem {
  type_code: string
  step_name: string
  material_spec: string | null
  arrangement: string
  condition: string
  manufacture_location: string
  deadline: string | null
  estimated_hours: number | null
  existing_equipment_id?: string
  shared_from_product_code?: string | null
  notes?: string | null
}

export function ManufacturingSheetOCRModal({
  isOpen,
  onClose,
  onSuccess
}: ManufacturingSheetOCRModalProps) {
  const t = useTranslations('OCRModal')
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<'UPLOAD' | 'REVIEW' | 'SUCCESS'>('UPLOAD')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [apiKey, setApiKey] = useState<string>('')
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.6-flash')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedResult, setSavedResult] = useState<any | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)

  // Plastic matching state
  const [plasticMatches, setPlasticMatches] = useState<PlasticMasterItem[]>([])
  const [plasticSearchQuery, setPlasticSearchQuery] = useState<string>('')
  const [isSearchingPlastics, setIsSearchingPlastics] = useState(false)

  // Extracted Data Form State
  const [formData, setFormData] = useState<{
    product_code: string
    product_name_internal: string
    customer_code_prefix: string
    product_description: string
    customer_name: string
    company_id: string
    customer_code: string
    ocr_customer_name: string
    ocr_customer_prefix: string
    customer_product_name: string
    designer_name: string
    sheet_date: string
    revision_number: number
    design_length: string
    design_width: string
    design_depth: string
    cutline_length: string
    cutline_width: string
    pieces_per_cycle: string
    pocket_count: string
    plastic_type_designed: string
    plastic_id: string
    plug_type: string
    has_separate_cutter: boolean
    corner_r: string
    chamfer_c: string
    draft_angle: string
    tolerance_info: string
    packaging_info: string
    quotation_attached: string
    cost_amount: string
    price_quote_required: boolean
    shipping_deadline: string
    mold_deadline: string
    components: ComponentItem[]
  }>({
    product_code: '',
    product_name_internal: '',
    customer_code_prefix: '',
    product_description: '',
    customer_name: '',
    customer_code: '',
    ocr_customer_name: '',
    ocr_customer_prefix: '',
    company_id: '',
    customer_product_name: '',
    designer_name: '',
    sheet_date: '',
    revision_number: 0,
    design_length: '',
    design_width: '',
    design_depth: '',
    cutline_length: '',
    cutline_width: '',
    pieces_per_cycle: '',
    pocket_count: '',
    plastic_type_designed: '',
    plastic_id: '',
    plug_type: '',
    has_separate_cutter: false,
    corner_r: '',
    chamfer_c: '',
    draft_angle: '',
    tolerance_info: '',
    packaging_info: '',
    quotation_attached: '',
    cost_amount: '',
    price_quote_required: false,
    shipping_deadline: '',
    mold_deadline: '',
    components: []
  })

  const [moldHandlingMode, setMoldHandlingMode] = useState<'REUSE_EXISTING' | 'CREATE_NEW'>('CREATE_NEW')
  const [existingHandlingMode, setExistingHandlingMode] = useState<'ENRICH_EXISTING' | 'NEW_REVISION'>('ENRICH_EXISTING')
  const [isDryRun, setIsDryRun] = useState(true) // Default to true for safety
  const [existingProductInfo, setExistingProductInfo] = useState<any | null>(null)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Load API Key from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('gemini_api_key') || ''
      setApiKey(storedKey)
    }
  }, [])

  // Reset states on modal open/close
  useEffect(() => {
    if (!isOpen) {
      abortControllerRef.current?.abort()
      setLoading(false)
      setError(null)
    }
  }, [isOpen])

  const handleClose = () => {
    abortControllerRef.current?.abort()
    setLoading(false)
    setError(null)
    onClose()
  }

  const handleSaveApiKey = (key: string) => {
    setApiKey(key)
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', key)
    }
  }

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('画像ファイル (JPEG, PNG, WebP) を選択してください')
      return
    }
    setError(null)
    setSelectedFile(file)
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    setZoomLevel(1)
  }

  const [loadingMessage, setLoadingMessage] = useState('')

  // Trigger Gemini OCR
  const handleExtractOCR = async () => {
    if (!selectedFile) return

    setLoading(true)
    setLoadingMessage(t('optimizingImage'))
    setError(null)

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      // Compress in browser (Max 1600px, 85% JPEG) to reduce upload time by 90%
      const { blob } = await compressImageFile(selectedFile, 1600, 0.85)
      const optimizedFile = new File([blob], 'sheet.jpg', { type: 'image/jpeg' })

      setLoadingMessage(t('analyzingOCR'))

      const bodyFormData = new FormData()
      bodyFormData.append('file', optimizedFile)
      bodyFormData.append('model', selectedModel)
      if (apiKey) {
        bodyFormData.append('apiKey', apiKey)
      }

      const res = await fetch('/api/ocr/extract', {
        method: 'POST',
        body: bodyFormData,
        signal: controller.signal
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'OCR解析に失敗しました')
      }

      const d = json.data
      const initialFormData = {
        product_code: d.product_code || '',
        product_name_internal: d.product_name_internal || '',
        customer_code_prefix: d.customer_code_prefix || '',
        product_description: d.product_description || '',
        customer_name: d.customer_name || '',
        customer_code: '',
        ocr_customer_name: d.customer_name || '',
        ocr_customer_prefix: d.customer_code_prefix || '',
        company_id: '',
        customer_product_name: d.customer_product_name || '',
        designer_name: d.designer_name || '',
        sheet_date: d.sheet_date || '',
        revision_number: d.revision_number != null ? d.revision_number : 0,
        design_length: d.design_length != null ? d.design_length.toString() : '',
        design_width: d.design_width != null ? d.design_width.toString() : '',
        design_depth: d.design_depth != null ? d.design_depth.toString() : '',
        cutline_length: d.cutline_length != null ? d.cutline_length.toString() : '',
        cutline_width: d.cutline_width != null ? d.cutline_width.toString() : '',
        pieces_per_cycle: d.pieces_per_cycle != null ? d.pieces_per_cycle.toString() : '',
        pocket_count: d.pocket_count != null ? d.pocket_count.toString() : '',
        plastic_type_designed: d.plastic_type_designed || '',
        plastic_id: '',
        plug_type: d.plug_type || '',
        has_separate_cutter: Boolean(d.has_separate_cutter),
        corner_r: d.corner_r || '',
        chamfer_c: d.chamfer_c || '',
        draft_angle: d.draft_angle || '',
        tolerance_info: d.tolerance_info || '',
        packaging_info: d.packaging_info || '',
        quotation_attached: d.quotation_attached || (d.price_quote_required ? '有' : '') || '',
        cost_amount: d.cost_amount != null ? d.cost_amount.toString() : '',
        price_quote_required: Boolean(d.price_quote_required),
        shipping_deadline: d.shipping_deadline || '',
        mold_deadline: d.mold_deadline || '',
        components: (d.components || []).map((c: any) => ({
          type_code: c.type_code || 'MOLD',
          step_name: c.step_name || '本型',
          material_spec: c.material_spec || null,
          arrangement: c.arrangement || 'REQUIRED',
          condition: c.condition || 'NEW',
          manufacture_location: c.manufacture_location || 'IN_HOUSE',
          deadline: c.deadline || null,
          estimated_hours: c.estimated_hours || null
        }))
      }

      setFormData(initialFormData)

      // Auto search company by prefix or name
      if (d.customer_code_prefix || d.customer_name) {
        try {
          let compUrl = `/api/companies/search?`
          if (d.customer_code_prefix) {
            compUrl += `code=${encodeURIComponent(d.customer_code_prefix)}`
          } else {
            compUrl += `q=${encodeURIComponent(d.customer_name)}`
          }
          const compRes = await fetch(compUrl)
          const compJson = await compRes.json()
          if (compJson.data && compJson.data.length > 0) {
            setFormData((prev) => ({
              ...prev,
              company_id: compJson.data[0].company_id,
              customer_name: compJson.data[0].company_name,
              customer_code: compJson.data[0].company_code || '',
              ocr_customer_name: d.customer_name || '',
              ocr_customer_prefix: d.customer_code_prefix || ''
            }))
          } else {
            setFormData((prev) => ({
              ...prev,
              ocr_customer_name: d.customer_name || '',
              ocr_customer_prefix: d.customer_code_prefix || ''
            }))
          }
        } catch (e) {
          // ignore auto-lookup error
        }
      }

      // Auto search plastics
      if (d.plastic_type_designed) {
        try {
          const familyMatch = d.plastic_type_designed.match(/^(PET|PP|PS|PVC|ABS|HIPS|OPS|A-PET)/i)
          const thicknessMatch = d.plastic_type_designed.match(/(\d+\.?\d*)\s*mm/i)
          const params = new URLSearchParams()
          if (familyMatch) params.set('family', familyMatch[1].toUpperCase())
          if (thicknessMatch) params.set('thickness', thicknessMatch[1])
          if (params.toString()) {
            const plasRes = await fetch(`/api/plastics/search?${params.toString()}`)
            const plasJson = await plasRes.json()
            if (plasJson.data && plasJson.data.length > 0) {
              setPlasticMatches(plasJson.data)
            }
          }
        } catch (e) {
          // ignore auto-search error
        }
      }

      // Auto check if product already exists in system
      const checkCode = d.product_name_internal || d.product_code
      if (checkCode) {
        try {
          const chkRes = await fetch(`/api/ocr/check-product?code=${encodeURIComponent(checkCode)}`)
          const chkJson = await chkRes.json()
          if (chkJson.exists && chkJson.product) {
            setExistingProductInfo(chkJson.product)
            if (chkJson.product.company_id) {
              setFormData((prev) => ({
                ...prev,
                company_id: chkJson.product.company_id,
                customer_name: chkJson.product.company_name || prev.customer_name
              }))
            }
          } else {
            setExistingProductInfo(null)
          }
        } catch (e) {
          // ignore check error
        }
      }

      setStep('REVIEW')
    } catch (err: any) {
      setError(err.message || 'OCR処理中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  // Check product existence when code changes
  const checkProductExists = async (code: string) => {
    if (!code || !code.trim()) {
      setExistingProductInfo(null)
      return
    }
    try {
      const res = await fetch(`/api/ocr/check-product?code=${encodeURIComponent(code)}`)
      const json = await res.json()
      if (json.exists && json.product) {
        setExistingProductInfo(json.product)
      } else {
        setExistingProductInfo(null)
      }
    } catch {
      setExistingProductInfo(null)
    }
  }

  // Search Plastic Master
  const searchPlastics = async (q: string) => {
    setPlasticSearchQuery(q)
    if (!q.trim()) {
      setPlasticMatches([])
      return
    }
    setIsSearchingPlastics(true)
    try {
      const res = await fetch(`/api/plastics/search?q=${encodeURIComponent(q)}`)
      const json = await res.json()
      setPlasticMatches(json.data || [])
    } catch (err) {
      console.error('Error searching plastics:', err)
    } finally {
      setIsSearchingPlastics(false)
    }
  }

  // Atomic Save to DB
  const handleSaveToDatabase = async () => {
    if (!formData.product_code || !formData.product_name_internal) {
      setError('製品コードと社内製品名は必須です')
      return
    }

    setSaving(true)
    setError(null)

    try {
      const payload = {
        product_code: formData.product_code,
        product_name_internal: formData.product_name_internal,
        product_description: formData.product_description,
        customer_name: formData.customer_name,
        company_id: formData.company_id || undefined,
        customer_product_name: formData.customer_product_name,
        revision_number: (!isNaN(parseInt(String(formData.revision_number), 10)) && parseInt(String(formData.revision_number), 10) >= 0)
          ? parseInt(String(formData.revision_number), 10)
          : 0,
        design_length: formData.design_length ? parseFloat(formData.design_length) : undefined,
        design_width: formData.design_width ? parseFloat(formData.design_width) : undefined,
        design_depth: formData.design_depth ? parseFloat(formData.design_depth) : undefined,
        cutline_length: formData.cutline_length ? parseFloat(formData.cutline_length) : undefined,
        cutline_width: formData.cutline_width ? parseFloat(formData.cutline_width) : undefined,
        pieces_per_cycle: formData.pieces_per_cycle ? parseInt(formData.pieces_per_cycle, 10) : undefined,
        pocket_count: formData.pocket_count ? parseInt(formData.pocket_count, 10) : undefined,
        plastic_type_designed: formData.plastic_type_designed,
        plastic_id: formData.plastic_id || undefined,
        plug_type: formData.plug_type,
        has_separate_cutter: formData.has_separate_cutter,
        corner_r: formData.corner_r,
        chamfer_c: formData.chamfer_c,
        draft_angle: formData.draft_angle,
        tolerance_info: formData.tolerance_info || undefined,
        packaging_info: formData.packaging_info || undefined,
        quotation_attached: formData.quotation_attached || undefined,
        cost_amount: formData.cost_amount ? parseFloat(formData.cost_amount) : undefined,
        price_quote_required: ['有', '要', '✓', 'true', '添付済'].includes(formData.quotation_attached.trim()),
        shipping_deadline: formData.shipping_deadline || undefined,
        mold_deadline: formData.mold_deadline || undefined,
        mold_handling_mode: moldHandlingMode,
        existing_handling_mode: existingHandlingMode,
        components: formData.components,
        dry_run: isDryRun
      }

      const res = await fetch('/api/ocr/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'データの保存に失敗しました')
      }

      setSavedResult(json.data)
      setStep('SUCCESS')
      if (onSuccess) onSuccess(json.data)
    } catch (err: any) {
      setError(err.message || 'データ保存中にエラーが発生しました')
    } finally {
      setSaving(false)
    }
  }

  // Reset form to scan the next sheet
  const handleResetForNextSheet = () => {
    setSelectedFile(null)
    setImagePreview(null)
    setSavedResult(null)
    setError(null)
    setExistingProductInfo(null)
    setZoomLevel(1)
    setFormData({
      product_code: '',
      product_name_internal: '',
      customer_code_prefix: '',
      product_description: '',
      customer_name: '',
      customer_code: '',
      ocr_customer_name: '',
      ocr_customer_prefix: '',
      company_id: '',
      customer_product_name: '',
      designer_name: '',
      sheet_date: '',
      revision_number: 0,
      design_length: '',
      design_width: '',
      design_depth: '',
      cutline_length: '',
      cutline_width: '',
      pieces_per_cycle: '',
      pocket_count: '',
      plastic_type_designed: '',
      plastic_id: '',
      plug_type: '',
      has_separate_cutter: false,
      corner_r: '',
      chamfer_c: '',
      draft_angle: '',
      tolerance_info: '',
      packaging_info: '',
      quotation_attached: '',
      cost_amount: '',
      price_quote_required: false,
      shipping_deadline: '',
      mold_deadline: '',
      components: []
    })
    setStep('UPLOAD')
  }

  const handleComponentChange = (idx: number, field: keyof ComponentItem, val: any) => {
    setFormData((prev) => {
      const newComps = [...prev.components]
      newComps[idx] = { ...newComps[idx], [field]: val }
      return { ...prev, components: newComps }
    })
  }

  // Calculate matching CAV code for preview
  const cavPreview = React.useMemo(() => {
    if (!formData.design_length || !formData.design_width) return null
    return lookupCavType(formData.design_length, formData.design_width)
  }, [formData.design_length, formData.design_width])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: 12
      }}
      onClick={handleClose}
    >
      <div
        className="card-flat"
        style={{
          width: '100%',
          maxWidth: step === 'REVIEW' ? 1360 : 680,
          height: step === 'REVIEW' ? '92vh' : undefined,
          background: 'var(--bg-surface)',
          borderRadius: 10,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transition: 'max-width 0.2s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-default)',
            background: 'var(--tint-teal-bg, var(--bg-surface-2))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {t('title')}
              </h3>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {t('subtitle')}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '10px 16px',
              background: 'var(--tint-error-bg, #fee2e2)',
              color: 'var(--status-error, #b91c1c)',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid var(--border-default)'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: UPLOAD & API KEY */}
        {step === 'UPLOAD' && (
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hidden Inputs */}
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0])
              }}
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/heic"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0])
              }}
            />

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed var(--border-default)',
                borderRadius: 8,
                padding: '36px 20px',
                textAlign: 'center',
                background: 'var(--bg-surface-2)',
                cursor: 'pointer'
              }}
            >
              {imagePreview ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <img
                    src={imagePreview}
                    alt="Uploaded Sheet"
                    style={{ maxHeight: 220, borderRadius: 6, objectFit: 'contain', border: '1px solid var(--border-default)' }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)' }}>
                    ✅ {selectedFile?.name} ({t('uploadDesc')})
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ fontSize: 13, padding: '8px 18px', gap: 6 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        cameraInputRef.current?.click()
                      }}
                    >
                      <Camera size={18} />
                      <span>{t('takePhoto')}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ fontSize: 13, padding: '8px 18px', gap: 6 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                    >
                      <Upload size={18} />
                      <span>{t('selectFile')}</span>
                    </button>
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {t('uploadDesc')}
                  </span>
                </div>
              )}
            </div>

            {/* Config Box */}
            <div className="card-flat" style={{ padding: 14, background: 'var(--bg-surface-2)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                  🤖 {t('modelSelect')}
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="form-input"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  <option value="gemini-3.6-flash">Gemini 3.6 Flash (Recommended)</option>
                  <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (Legacy)</option>
                  <option value="gemini-flash-latest">{t('modelFlashLatest')}</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Key size={14} style={{ color: 'var(--accent)' }} />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>{t('apiKeyLabel')}</span>
                  </div>
                  {apiKey && (
                    <button
                      type="button"
                      onClick={() => handleSaveApiKey('')}
                      style={{ background: 'none', border: 'none', color: 'var(--status-error)', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2, padding: 0 }}
                    >
                      <X size={12} />
                      <span>{t('clearKey')}</span>
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  placeholder={t('apiKeyPlaceholder')}
                  className="form-input"
                  style={{ fontSize: 12, fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <button type="button" onClick={handleClose} className="btn btn-secondary">
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleExtractOCR}
                disabled={!selectedFile || loading}
                className="btn btn-primary"
                style={{ padding: '8px 22px', gap: 6 }}
              >
                {loading ? (
                  <React.Fragment>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{loadingMessage}</span>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Sparkles size={16} />
                    <span>✨ {t('startOCR')}</span>
                  </React.Fragment>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SIDE-BY-SIDE INTERACTIVE REVIEW */}
        {step === 'REVIEW' && (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left: Original Photo Preview with Zoom Controls */}
            <div
              style={{
                width: '42%',
                borderRight: '1px solid var(--border-default)',
                background: '#090d16',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              {/* Zoom Toolbar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  zIndex: 10
                }}
              >
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                  📄 {t('originalSheet')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.2))}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: 11, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
                    title="Zoom Out"
                  >
                    <ZoomOut size={13} />
                  </button>
                  <span style={{ fontSize: 11, color: '#cbd5e1', minWidth: 38, textAlign: 'center', fontFamily: 'monospace' }}>
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(3.0, z + 0.2))}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: 11, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
                    title="Zoom In"
                  >
                    <ZoomIn size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    className="btn btn-secondary"
                    style={{ padding: '4px 8px', fontSize: 11, background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none' }}
                    title="Reset Zoom"
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Scrollable Image Area */}
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12
                }}
              >
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Original Manufacturing Sheet"
                    style={{
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'top center',
                      transition: 'transform 0.15s ease',
                      maxWidth: '100%',
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Right: Extracted Structured Form */}
            <div style={{ width: '58%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                
                {/* SECTION 1: Product Header */}
                <div className="card-flat" style={{ padding: 14, background: 'var(--bg-surface-2)' }}>
                  {existingProductInfo && (
                    <div style={{
                      marginBottom: 14,
                      padding: '12px 14px',
                      backgroundColor: '#fffbeb',
                      border: '1.5px solid #f59e0b',
                      borderRadius: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>⚠️</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#92400e' }}>
                              {t('productExistsAlert', { code: existingProductInfo.product_name_internal || existingProductInfo.product_code })}
                            </div>
                            <div style={{ fontSize: 11, color: '#b45309', marginTop: 1 }}>
                              {existingProductInfo.company_name ? `得意先: ${existingProductInfo.company_code ? `[${existingProductInfo.company_code}] ` : ''}${existingProductInfo.company_name}` : ''}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <a
                            href={`/product-center/${existingProductInfo.product_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ fontSize: 11, padding: '4px 10px', gap: 4, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                          >
                            <ExternalLink size={12} />
                            <span>{t('viewProductDetail')}</span>
                          </a>
                        </div>
                      </div>

                      {/* Current status inspection */}
                      <div style={{ background: '#fef3c7', padding: '8px 12px', borderRadius: 6, fontSize: 11, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div>
                          <span style={{ fontWeight: 600, color: '#78350f' }}>📋 製作指示 (Work Order): </span>
                          {existingProductInfo.hasWorkOrder ? (
                            <span className="badge badge--success" style={{ fontSize: 9.5, padding: '1px 6px', fontWeight: 700 }}>
                              {t('woStatusRegistered')} ({existingProductInfo.workOrders?.[0]?.wo_code || 'WO'})
                            </span>
                          ) : (
                            <span className="badge badge--warning" style={{ fontSize: 9.5, padding: '1px 6px', fontWeight: 700 }}>
                              {t('woStatusUnregistered')}
                            </span>
                          )}
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, color: '#78350f' }}>📐 CAD設計: </span>
                          {existingProductInfo.existingRevs && existingProductInfo.existingRevs.length > 0 ? (
                            <span>{existingProductInfo.existingRevs.map((r: any) => `R${r.revision_number}`).join(', ')}</span>
                          ) : (
                            <span style={{ color: '#92400e' }}>未登録</span>
                          )}
                        </div>
                      </div>

                      {/* Action selector */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 11.5 }}>
                            <input
                              type="radio"
                              name="existingHandling"
                              checked={existingHandlingMode === 'ENRICH_EXISTING'}
                              onChange={() => {
                                setExistingHandlingMode('ENRICH_EXISTING')
                                setMoldHandlingMode('REUSE_EXISTING')
                                setFormData(prev => ({ ...prev, revision_number: 0 }))
                              }}
                              style={{ marginTop: 2 }}
                            />
                            <div>
                              <strong style={{ color: '#92400e' }}>{t('existingActionEnrich')}</strong>
                              <div style={{ color: '#b45309', fontSize: 10.5 }}>{t('existingActionEnrichDesc')}</div>
                            </div>
                          </label>

                          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', fontSize: 11.5 }}>
                            <input
                              type="radio"
                              name="existingHandling"
                              checked={existingHandlingMode === 'NEW_REVISION'}
                              onChange={() => {
                                setExistingHandlingMode('NEW_REVISION')
                                const nextRev = (existingProductInfo.existingRevs?.length || 0)
                                setFormData(prev => ({ ...prev, revision_number: nextRev > 0 ? nextRev : 1 }))
                              }}
                              style={{ marginTop: 2 }}
                            />
                            <div>
                              <strong style={{ color: '#78350f' }}>{t('existingActionNewRev')}</strong>
                              <div style={{ color: '#b45309', fontSize: 10.5 }}>{t('existingActionNewRevDesc')}</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                      {t('sec1Product')}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {t('sec1Sub')}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('internalName')}
                      </label>
                      <input
                        type="text"
                        value={formData.product_name_internal}
                        onChange={(e) => setFormData({ ...formData, product_name_internal: e.target.value })}
                        onBlur={() => checkProductExists(formData.product_name_internal || formData.product_code)}
                        className="form-input"
                        style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('compactCode')}
                      </label>
                      <input
                        type="text"
                        value={formData.product_code}
                        onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                        onBlur={() => checkProductExists(formData.product_code || formData.product_name_internal)}
                        className="form-input"
                        style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('customer')} <span style={{ color: 'var(--status-error)' }}>*</span>
                      </label>
                      <AsyncSearchableSelect
                        fetchOptions={async (q) => {
                          const res = await fetch(`/api/companies/search?q=${encodeURIComponent(q)}`)
                          const json = await res.json()
                          return (json.data || []).map((c: any) => ({
                            value: c.company_id,
                            label: `${c.company_code} — ${c.company_name}`,
                            sublabel: c.company_name_romaji || ''
                          }))
                        }}
                        value={formData.company_id}
                        initialOption={formData.company_id ? {
                          value: formData.company_id,
                          label: formData.customer_code ? `${formData.customer_code} — ${formData.customer_name}` : formData.customer_name
                        } : null}
                        onChange={(val) => setFormData((prev) => ({ ...prev, company_id: val || '' }))}
                        placeholder={t('customerSearch')}
                      />
                      {(formData.ocr_customer_name || formData.ocr_customer_prefix) && (
                        <div style={{ marginTop: 4, fontSize: 10.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontWeight: 600, color: 'var(--accent)' }}>🔍 {t('ocrExtractedLabel')}:</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {formData.ocr_customer_prefix ? `[${formData.ocr_customer_prefix}] ` : ''}{formData.ocr_customer_name || '—'}
                          </span>
                          <span className="badge badge--warning" style={{ fontSize: 9, padding: '0 4px', lineHeight: '14px' }}>
                            {t('needConfirmBadge')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('customerPartNo')}
                      </label>
                      <input
                        type="text"
                        value={formData.customer_product_name}
                        onChange={(e) => setFormData({ ...formData, customer_product_name: e.target.value })}
                        className="form-input"
                        placeholder="—"
                      />
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('productDesc')}
                      </label>
                      <input
                        type="text"
                        value={formData.product_description}
                        onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                        className="form-input"
                        placeholder="—"
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('pocketCount')}
                      </label>
                      <input
                        type="number"
                        value={formData.pocket_count}
                        onChange={(e) => setFormData({ ...formData, pocket_count: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace', fontWeight: 600 }}
                        placeholder="—"
                      />
                    </div>

                    <div>
                      <label
                        className="form-label"
                        style={{ fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <span>{t('revisionNo')}</span>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 'normal' }}>{t('revisionRef')}</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.revision_number}
                        onChange={(e) => setFormData({ ...formData, revision_number: !isNaN(parseInt(e.target.value, 10)) ? parseInt(e.target.value, 10) : 0 })}
                        className="form-input"
                        style={{ fontFamily: 'monospace' }}
                      />
                      <span style={{ fontSize: 9, color: 'var(--text-muted)', display: 'block', marginTop: 2 }}>
                        {t('rev0Hint')}
                      </span>
                    </div>
                  </div>

                  {existingProductInfo && existingHandlingMode === 'NEW_REVISION' && (
                    <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--bg-surface-3)', borderRadius: 6, border: '1px solid var(--border-default)' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6, color: 'var(--accent)' }}>
                        🔧 {t('moldHandling', { rev: formData.revision_number || 1 })}
                      </span>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="mold_handling_mode" 
                            value="REUSE_EXISTING" 
                            checked={moldHandlingMode === 'REUSE_EXISTING'} 
                            onChange={() => setMoldHandlingMode('REUSE_EXISTING')} 
                          />
                          <span>{t('reuseExistingMold')}</span>
                        </label>
                        <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
                          <input 
                            type="radio" 
                            name="mold_handling_mode" 
                            value="CREATE_NEW" 
                            checked={moldHandlingMode === 'CREATE_NEW'} 
                            onChange={() => setMoldHandlingMode('CREATE_NEW')} 
                          />
                          <span>{t('createNewMold')}</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 2: CAD & Technical Specifications (SSOT) */}
                <div className="card-flat" style={{ padding: 14, background: 'var(--bg-surface-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                      {t('sec2CAD')}
                    </span>
                    {cavPreview && (
                      <span className="badge badge--info" style={{ fontSize: 10, fontFamily: 'monospace' }}>
                        {t('cavBadge')} {cavPreview.code} ({cavPreview.length}×{cavPreview.width}mm)
                      </span>
                    )}
                  </div>

                  {/* Primary Dimensions (4 columns) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('cutlineL')}
                      </label>
                      <input
                        type="number"
                        value={formData.cutline_length}
                        onChange={(e) => setFormData({ ...formData, cutline_length: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('cutlineW')}
                      </label>
                      <input
                        type="number"
                        value={formData.cutline_width}
                        onChange={(e) => setFormData({ ...formData, cutline_width: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('piecesPerCycle')}
                      </label>
                      <input
                        type="number"
                        value={formData.pieces_per_cycle}
                        onChange={(e) => setFormData({ ...formData, pieces_per_cycle: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace', fontWeight: 700 }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('depth')}
                      </label>
                      <input
                        type="number"
                        value={formData.design_depth}
                        onChange={(e) => setFormData({ ...formData, design_depth: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>

                  {/* Mold Block Dimensions & Profile (4 columns) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('moldL')}
                      </label>
                      <input
                        type="number"
                        value={formData.design_length}
                        onChange={(e) => setFormData({ ...formData, design_length: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('moldW')}
                      </label>
                      <input
                        type="number"
                        value={formData.design_width}
                        onChange={(e) => setFormData({ ...formData, design_width: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('cornerChamfer')}
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                        <input
                          type="text"
                          placeholder="R5"
                          value={formData.corner_r}
                          onChange={(e) => setFormData({ ...formData, corner_r: e.target.value })}
                          className="form-input"
                          style={{ fontFamily: 'monospace', padding: '4px 6px' }}
                        />
                        <input
                          type="text"
                          placeholder="C2"
                          value={formData.chamfer_c}
                          onChange={(e) => setFormData({ ...formData, chamfer_c: e.target.value })}
                          className="form-input"
                          style={{ fontFamily: 'monospace', padding: '4px 6px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('cutterType')}
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', height: 32 }}>
                        <input
                          type="checkbox"
                          checked={formData.has_separate_cutter}
                          onChange={(e) => setFormData({ ...formData, has_separate_cutter: e.target.checked })}
                        />
                        <span style={{ fontWeight: 600, fontSize: 11 }}>{t('separateCutter')}</span>
                      </label>
                    </div>
                  </div>

                  {/* Tolerances & Packaging */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('tolerance')}
                      </label>
                      <input
                        type="text"
                        value={formData.tolerance_info}
                        onChange={(e) => setFormData({ ...formData, tolerance_info: e.target.value })}
                        className="form-input"
                        placeholder="—"
                      />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('packaging')}
                      </label>
                      <input
                        type="text"
                        value={formData.packaging_info}
                        onChange={(e) => setFormData({ ...formData, packaging_info: e.target.value })}
                        className="form-input"
                        placeholder="—"
                      />
                    </div>
                  </div>

                  {/* Plastic Material Comparison Panel */}
                  <div
                    style={{
                      padding: 12,
                      borderRadius: 6,
                      border: '1px solid var(--border-default)',
                      background: 'color-mix(in srgb, var(--accent) 4%, transparent)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>
                        🧪 {t('plasticSSOT')}
                      </span>
                      {formData.plastic_id ? (
                        <span className="badge badge--success" style={{ fontSize: 10 }}>
                          ✅ {t('linkedMaster')}
                        </span>
                      ) : (
                        <span className="badge badge--neutral" style={{ fontSize: 10 }}>
                          {t('rawTextOnly')}
                        </span>
                      )}
                    </div>

                    {/* Extracted Raw Text */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{t('ocrRawText')}</span>
                      <input
                        type="text"
                        value={formData.plastic_type_designed}
                        onChange={(e) => setFormData({ ...formData, plastic_type_designed: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}
                      />
                    </div>

                    {/* Plastic Master Matcher */}
                    <div style={{ marginTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Search size={13} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {t('linkPlasticMaster')}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <input
                          type="text"
                          placeholder={t('searchPlastics')}
                          value={plasticSearchQuery}
                          onChange={(e) => searchPlastics(e.target.value)}
                          className="form-input"
                          style={{ fontSize: 11, flex: 1 }}
                        />
                        {plasticSearchQuery && (
                          <button
                            type="button"
                            onClick={() => {
                              setPlasticSearchQuery('')
                              setPlasticMatches([])
                            }}
                            className="btn btn-secondary"
                            style={{ fontSize: 11, padding: '4px 8px' }}
                          >
                            {t('clear')}
                          </button>
                        )}
                      </div>

                      {/* Plastic Match Results */}
                      {plasticMatches.length > 0 && (
                        <div
                          style={{
                            maxHeight: 140,
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-default)',
                            borderRadius: 4,
                            padding: 6
                          }}
                        >
                          {plasticMatches.map((p) => (
                            <label
                              key={p.plastic_id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 11,
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: 4,
                                background: formData.plastic_id === p.plastic_id ? 'var(--tint-teal-bg)' : 'transparent',
                                border: formData.plastic_id === p.plastic_id ? '1px solid var(--accent)' : '1px solid transparent'
                              }}
                            >
                              <input
                                type="radio"
                                name="plastic_match_radio"
                                checked={formData.plastic_id === p.plastic_id}
                                onChange={() => setFormData({ ...formData, plastic_id: p.plastic_id })}
                              />
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent)' }}>
                                {p.plastic_code}
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>
                                ({p.plastic_family} {p.thickness_mm}mm W:{p.width_mm}mm {p.color || ''} {p.electrical_property || ''})
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {formData.plastic_id && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, plastic_id: '' })}
                          style={{
                            marginTop: 4,
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: 10,
                            textDecoration: 'underline',
                            cursor: 'pointer'
                          }}
                        >
                          {t('unlinkMaster')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Cost & Deadlines */}
                <div className="card-flat" style={{ padding: 14, background: 'var(--bg-surface-2)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', display: 'block', marginBottom: 10 }}>
                    {t('sec3Cost')}
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('quotation')}
                      </label>
                      <input
                        type="text"
                        value={formData.quotation_attached}
                        onChange={(e) => setFormData({ ...formData, quotation_attached: e.target.value })}
                        className="form-input"
                        placeholder="有 / 無 / 添付済"
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('unitCost')}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.cost_amount}
                        onChange={(e) => setFormData({ ...formData, cost_amount: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace' }}
                        placeholder="—"
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('shipDeadline')}
                      </label>
                      <input
                        type="date"
                        value={formData.shipping_deadline}
                        onChange={(e) => setFormData({ ...formData, shipping_deadline: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>

                    <div>
                      <label className="form-label" style={{ fontSize: 11, fontWeight: 600 }}>
                        {t('moldDeadline')}
                      </label>
                      <input
                        type="date"
                        value={formData.mold_deadline}
                        onChange={(e) => setFormData({ ...formData, mold_deadline: e.target.value })}
                        className="form-input"
                        style={{ fontFamily: 'monospace' }}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Job Components Table */}
                {formData.components && formData.components.length > 0 && (
                  <div className="card-flat" style={{ padding: 14, background: 'var(--bg-surface-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)' }}>
                        {t('sec4Components')} ({formData.components.length})
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {t('compHint')}
                      </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table className="data-table" style={{ width: '100%', fontSize: 11 }}>
                        <thead>
                          <tr>
                            <th style={{ width: 90 }}>{t('compType')}</th>
                            <th style={{ minWidth: 130 }}>{t('compName')}</th>
                            <th style={{ minWidth: 110 }}>{t('compMaterial')}</th>
                            <th style={{ width: 105 }}>{t('compCondition')}</th>
                            <th style={{ minWidth: 120 }}>{t('compSharedFrom')}</th>
                            <th style={{ width: 85 }}>{t('compArrangement')}</th>
                            <th style={{ width: 85 }}>{t('compLocation')}</th>
                            <th style={{ width: 120 }}>{t('compDeadline')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.components.map((comp, idx) => (
                            <tr key={`comp-${comp.type_code}-${idx}`}>
                              <td style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                                <input
                                  type="text"
                                  value={comp.type_code}
                                  onChange={(e) => handleComponentChange(idx, 'type_code', e.target.value)}
                                  className="form-input"
                                  style={{ padding: '4px 6px', fontSize: 11, fontFamily: 'monospace', fontWeight: 700 }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={comp.step_name}
                                  onChange={(e) => handleComponentChange(idx, 'step_name', e.target.value)}
                                  className="form-input"
                                  style={{ padding: '4px 6px', fontSize: 11 }}
                                />
                              </td>
                              <td>
                                <input
                                  type="text"
                                  value={comp.material_spec || ''}
                                  onChange={(e) => handleComponentChange(idx, 'material_spec', e.target.value)}
                                  className="form-input"
                                  style={{ padding: '4px 6px', fontSize: 11 }}
                                  placeholder="—"
                                />
                              </td>
                              <td>
                                <select
                                  value={comp.condition}
                                  onChange={(e) => handleComponentChange(idx, 'condition', e.target.value)}
                                  className="form-input"
                                  style={{ padding: '4px 6px', fontSize: 11, fontWeight: 600 }}
                                >
                                  <option value="NEW">{t('compConditionNew')}</option>
                                  <option value="EXISTING">{t('compConditionExisting')}</option>
                                </select>
                              </td>
                              <td>
                                {comp.condition === 'EXISTING' ? (
                                  <input
                                    type="text"
                                    value={comp.shared_from_product_code || comp.notes || ''}
                                    onChange={(e) => {
                                      handleComponentChange(idx, 'shared_from_product_code', e.target.value)
                                      handleComponentChange(idx, 'notes', e.target.value)
                                    }}
                                    className="form-input"
                                    style={{ padding: '4px 6px', fontSize: 11, fontFamily: 'monospace', fontWeight: 600, color: 'var(--accent)' }}
                                    placeholder={t('compSharedPlaceholder')}
                                  />
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block', textAlign: 'center' }}>—</span>
                                )}
                              </td>
                              <td>
                                <select
                                  value={comp.arrangement}
                                  onChange={(e) => handleComponentChange(idx, 'arrangement', e.target.value)}
                                  className="form-input"
                                  style={{ padding: '4px 6px', fontSize: 11 }}
                                >
                                  <option value="REQUIRED">{t('compArrangementReq')}</option>
                                  <option value="NOT_REQUIRED">{t('compArrangementNotReq')}</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  value={comp.manufacture_location}
                                  onChange={(e) => handleComponentChange(idx, 'manufacture_location', e.target.value)}
                                  className="form-input"
                                  style={{ padding: '4px 6px', fontSize: 11 }}
                                >
                                  <option value="IN_HOUSE">{t('compLocationInHouse')}</option>
                                  <option value="OUTSOURCED">{t('compLocationOutsource')}</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="date"
                                  value={comp.deadline || ''}
                                  onChange={(e) => handleComponentChange(idx, 'deadline', e.target.value)}
                                  className="form-input"
                                  style={{ padding: '4px 6px', fontSize: 11, fontFamily: 'monospace' }}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Review Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderTop: '1px solid var(--border-default)',
                  background: 'var(--bg-surface-2)'
                }}
              >
                <button
                  type="button"
                  onClick={() => setStep('UPLOAD')}
                  disabled={saving}
                  className="btn btn-secondary"
                  style={{ fontSize: 12 }}
                >
                  ← {t('backToUpload')}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {existingProductInfo && (
                    <a
                      href={`/product-center/${existingProductInfo.product_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: 12, padding: '7px 14px', gap: 6, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
                      onClick={handleClose}
                    >
                      <ExternalLink size={13} />
                      <span>{t('btnSkipToProductDetail')}</span>
                    </a>
                  )}
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, cursor: 'pointer', marginRight: 8, padding: '4px 8px', borderRadius: 4, backgroundColor: isDryRun ? 'var(--tint-orange-bg)' : 'transparent' }}>
                    <input 
                      type="checkbox" 
                      checked={isDryRun} 
                      onChange={(e) => setIsDryRun(e.target.checked)} 
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    <span style={{ fontWeight: isDryRun ? 600 : 400, color: isDryRun ? '#B45309' : 'inherit' }}>
                      🧪 プレビューモード (DBに保存しない)
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={handleSaveToDatabase}
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ fontSize: 13, padding: '8px 24px', gap: 6 }}
                  >
                    {saving ? (
                      <React.Fragment>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t('saving')}</span>
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        <CheckCircle2 size={16} />
                        <span>{t('confirmSave')}</span>
                      </React.Fragment>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS VIEW */}
        {step === 'SUCCESS' && savedResult && (
          <div style={{ padding: '36px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: savedResult.dry_run ? 'color-mix(in srgb, #F59E0B 15%, transparent)' : 'color-mix(in srgb, #10B981 15%, transparent)',
                color: savedResult.dry_run ? '#D97706' : '#047857',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Check size={34} />
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              {savedResult.dry_run ? 'プレビュー完了 (DB未保存)' : t('successTitle')}
            </h3>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, maxWidth: 520, lineHeight: 1.6 }}>
              {savedResult.dry_run 
                ? 'プレビューモードで処理が完了しました。実際のデータは保存されていません。' 
                : t('successDesc')}
            </p>

            {savedResult.dry_run && savedResult.dry_run_logs && (
              <div
                style={{
                  width: '100%',
                  maxWidth: 600,
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 8,
                  padding: 16,
                  textAlign: 'left',
                  marginTop: 8,
                  maxHeight: 250,
                  overflowY: 'auto'
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                  シミュレーション結果
                </div>
                {savedResult.dry_run_logs.map((log: string, i: number) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace', padding: '4px 0', borderBottom: i < savedResult.dry_run_logs.length - 1 ? '1px solid var(--border-default)' : 'none' }}>
                    {log}
                  </div>
                ))}
              </div>
            )}

            {!savedResult.dry_run && (
              <div
                className="card-flat"
                style={{
                  background: 'var(--bg-surface-2)',
                  padding: '14px 24px',
                  borderRadius: 8,
                  display: 'flex',
                  gap: 24,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 4,
                  border: '1px solid var(--border-default)'
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('createdProduct')}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', fontFamily: 'monospace' }}>
                    {savedResult.product_name_internal || savedResult.product_code}
                  </div>
                </div>
                <div style={{ width: 1, height: 24, background: 'var(--border-default)' }} />
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t('createdJob')}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {savedResult.jobs?.length ? `${savedResult.jobs.length} Jobs` : '—'}
                  </div>
                </div>
              </div>
            )}

            {/* Action Choice Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 14 }}>
              <button
                type="button"
                onClick={handleResetForNextSheet}
                className="btn btn-primary"
                style={{ fontSize: 13, padding: '9px 20px', gap: 7 }}
              >
                <FilePlus2 size={16} />
                <span>{t('btnContinueNextSheet')}</span>
              </button>

              {!savedResult.dry_run && (
                <>
                  <Link
                    href={`/product-center/${savedResult.product_id}`}
                    className="btn btn-secondary"
                    style={{ fontSize: 13, padding: '9px 18px', gap: 7, textDecoration: 'none' }}
                    onClick={onClose}
                  >
                    <ExternalLink size={15} />
                    <span>{t('btnViewProduct')}</span>
                  </Link>

                  <Link
                    href={`/equipment/schedule`}
                    className="btn btn-secondary"
                    style={{ fontSize: 13, padding: '9px 18px', gap: 7, textDecoration: 'none' }}
                    onClick={onClose}
                  >
                    <Calendar size={15} />
                    <span>{t('btnViewSchedule')}</span>
                  </Link>
                </>
              )}

              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ fontSize: 13, padding: '9px 16px', gap: 6 }}
              >
                <X size={15} />
                <span>{t('btnClose')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
