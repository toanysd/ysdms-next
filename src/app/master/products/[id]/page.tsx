'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertTriangle, Save, ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ProductDetailHeader } from './ProductDetailHeader'
import { ProductTabNavigation, type TabId } from './ProductTabNavigation'
import { OverviewTab } from './tabs/OverviewTab'
import { OrdersTab } from './tabs/OrdersTab'
import { DesignsTab } from './tabs/DesignsTab'

export type ProductDetailData = {
  product_id: string
  product_code: string
  product_name: string
  product_name_en: string | null
  product_name_internal: string | null
  company_id: string
  mold_master_id: string | null
  customer_product_name: string | null
  product_status: 'ACTIVE' | 'MAINTENANCE' | 'DISPOSED'
  pocket_count: number | null
  pieces_per_box: number | null
  box_spec: string | null
  notes: string | null
  created_at: string
  updated_at: string

  companies: {
    company_id: string
    company_name: string
    company_code: string
  } | null

  design_revisions: {
    revision_id: string
    design_code: string
    revision_number: number | null
    status: string | null
    design_date: string | null
    change_summary: string | null
    design_length: number | null
    design_width: number | null
    design_height: number | null
    design_depth: number | null
    cutline_length: number | null
    cutline_width: number | null
    cavity_count: number | null
    pocket_numbers: number | null
    pitch_mm: number | null
    cavity_pitch_mm: number | null
    machine_feed_pitch_mm: number | null
    corner_r: string | null
    chamfer_c: string | null
    draft_angle: string | null
    undercut_spec: string | null
    under_depth: string | null
    orientation: string | null
    setup_type: string | null
    has_plug: boolean | null
    plug_type: string | null
    has_separate_cutter: boolean | null
    plastic_type_designed: string | null
    designer: string | null
    customer_drawing_no: string | null
    plastic_master?: {
      plastic_code: string | null
      thickness_mm: number | null
      color_name_normalized: string | null
    } | null
    physical_molds?: {
      physical_mold_id: string
      system_code: string
      display_name: string
      physical_stamp: string | null
      usage_status: string | null
      piece_count: number | null
    }[] | null
    cutters?: {
      cutter_id: string
      cutter_no: string
      cutter_name: string
      cutter_type: string | null
      usage_status: string | null
    }[] | null
  }[] | null
}

export type DesignRevisionItem = NonNullable<ProductDetailData['design_revisions']>[number]

export type Company = {
  company_id: string
  company_name: string
  company_code: string
  company_type?: string | string[] | null
}

function PlaceholderTab({ name }: { name: string }) {
  const t = useTranslations('Common')
  return (
    <div className="card-flat" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-jp)', marginBottom: 4 }}>{name}</div>
      <div style={{ fontSize: 11 }}>{t('underDevelopment')}</div>
    </div>
  )
}

function TabContent({
  tab, product, isEditing, formData, setFormData, companies, onRefresh
}: {
  tab: TabId; product: ProductDetailData;
  isEditing: boolean;
  formData: Partial<ProductDetailData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<ProductDetailData>>>;
  companies: Company[];
  onRefresh?: () => void;
}) {
  const tTabs = useTranslations('Master.Products.Tabs')
  switch (tab) {
    case 'overview':
      return <OverviewTab product={product} isEditing={isEditing} formData={formData} setFormData={setFormData} companies={companies} onRefresh={onRefresh} />
    case 'orders':
      return <OrdersTab productId={product.product_id} />
    case 'designs':
      return <DesignsTab product={product} onRefresh={onRefresh} />
    default:
      return null
  }
}

export default function ProductDetailPage() {
  const t = useTranslations('Common')
  const params = useParams()
  const productId = params.id as string
  const supabase = createClient()
  const router = useRouter()

  const [product, setProduct] = useState<ProductDetailData | null>(null)
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<ProductDetailData>>({})
  const [saving, setSaving] = useState(false)

  const fetchProduct = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('products')
      .select(`
        *,
        companies:companies!products_company_id_fkey(company_id, company_name, company_code),
        design_revisions(
          revision_id, design_code, revision_number, status, design_date, change_summary,
          design_length, design_width, design_height, design_depth,
          cutline_length, cutline_width,
          cavity_count, pocket_numbers, cavity_pitch_mm, machine_feed_pitch_mm,
          corner_r, chamfer_c, draft_angle, undercut_spec, under_depth,
          orientation, setup_type, plug_type, has_separate_cutter, plastic_type_designed,
          designer, customer_drawing_no,
          plastic_master(plastic_code, thickness_mm, color_name_normalized)
        )
      `)
      .eq('product_id', productId)
      .single()

    if (err) {
      setError(err.message)
    } else {
      setProduct(data as unknown as ProductDetailData)
      setFormData(data as unknown as ProductDetailData)
    }
    setLoading(false)
  }, [productId, supabase])

  const fetchCompanies = useCallback(async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('company_id, company_name, company_code, company_type')
      .order('company_code', { ascending: true })

    if (!error && data) {
      setCompanies(data as Company[])
    }
  }, [supabase])

  useEffect(() => {
    fetchProduct()
    fetchCompanies()
  }, [fetchProduct, fetchCompanies])

  const handleSave = async () => {
    if (!product) return
    setSaving(true)
    setError(null)
    
    if (!formData.product_code || !formData.company_id) {
        setError('製品コードと得意先は必須です / Mã SP và khách hàng là bắt buộc')
        setSaving(false)
        return
    }

    const fieldsToUpdate = {
      product_code: formData.product_code,
      product_name: formData.product_name,
      company_id: formData.company_id,
      customer_product_name: formData.customer_product_name || null,
      product_status: formData.product_status,
      pocket_count: formData.pocket_count !== undefined ? formData.pocket_count : null,
      pieces_per_box: formData.pieces_per_box !== undefined ? formData.pieces_per_box : null,
      box_spec: formData.box_spec || null,
      notes: formData.notes || null,
      updated_at: new Date().toISOString(),
    }

    const { error: updateErr } = await supabase
      .from('products')
      .update(fieldsToUpdate)
      .eq('product_id', product.product_id)

    setSaving(false)

    if (!updateErr) {
      setIsEditing(false)
      fetchProduct()
    } else {
      console.error(updateErr)
      setError(updateErr.code === '23505' ? t('validation.productCodeExists') : updateErr.message)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300, gap: 8 }}>
        <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('loading')}</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col gap-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => router.back()}
            className="btn btn-secondary"
            style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
            title={t('back')}
          >
            <ArrowLeft size={13} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{t('back')}</span>
          </button>
          <Link
            href="/master/products"
            className="btn btn-secondary"
            style={{
              height: 28, padding: '0 8px', gap: 3, fontSize: 11,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            }}
            title={t('list')}
          >
            <ArrowUpFromLine size={12} />
            <span style={{ fontFamily: 'var(--font-jp)' }}>{t('list')}</span>
          </Link>
        </div>

        <div className="card-flat" style={{ padding: 20, textAlign: 'center' }}>
          <AlertTriangle size={24} style={{ color: 'var(--status-error)', marginBottom: 8 }} />
          <div style={{ fontSize: 13, color: 'var(--status-error)', fontWeight: 600 }}>
            {error || t('productNotFound')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            ID: {productId}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 relative">
      {/* Back / Up Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => router.back()}
          className="btn btn-secondary"
          style={{ height: 28, padding: '0 8px', gap: 3, fontSize: 11 }}
          title={t('back')}
        >
          <ArrowLeft size={13} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>{t('back')}</span>
        </button>
        <Link
          href="/master/products"
          className="btn btn-secondary"
          style={{
            height: 28, padding: '0 8px', gap: 3, fontSize: 11,
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
          }}
          title={t('list')}
        >
          <ArrowUpFromLine size={12} />
          <span style={{ fontFamily: 'var(--font-jp)' }}>{t('list')}</span>
        </Link>
      </div>

      <ProductDetailHeader 
        product={product!} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing}
      />

      <ProductTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {error && (
        <div style={{ padding: '8px 12px', background: 'color-mix(in srgb, var(--status-error) 10%, transparent)', color: 'var(--status-error)', fontSize: 12, borderRadius: 4, marginTop: 8, border: '1px solid color-mix(in srgb, var(--status-error) 20%, transparent)' }}>
            ⚠ {error}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <TabContent 
          tab={activeTab} 
          product={product!} 
          isEditing={isEditing} 
          formData={formData} 
          setFormData={setFormData} 
          companies={companies}
          onRefresh={fetchProduct}
        />
      </div>

      {isEditing && (
        <div className="card-flat sticky bottom-0 z-10 flex justify-end gap-2 p-3 mt-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
          <button className="btn btn-secondary" onClick={() => { setIsEditing(false); setFormData(product!); setError(null) }}>
            {t('cancel')}
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 size={14} className="animate-spin mr-1" />}
            <Save size={16} />
            {t('save')}
          </button>
        </div>
      )}
    </div>
  )
}
