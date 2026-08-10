'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft, ArrowUpFromLine, Database, Package,
  Building2, FileText, Wrench, Hammer,
  Loader2, ExternalLink, Info
} from 'lucide-react'

import { TabOverview } from './_components/TabOverview'
import { TabOrders } from './_components/TabOrders'
import { TabDesignsEquipment } from './_components/TabDesignsEquipment'
import { TabJobs } from './_components/TabJobs'
import { TabRelatedInfo } from './_components/TabRelatedInfo'

type ProductData = {
  product_id: string
  product_code: string
  product_name: string | null
  product_name_internal: string | null
  product_name_en: string | null
  customer_product_name: string | null
  product_description: string | null
  first_shipment_date: string | null
  product_status: string
  pocket_count: number | null
  pieces_per_box: number | null
  company_id: string
  end_user_company_id: string | null
  notes: string | null
  companies: {
    company_id: string
    company_name: string
    company_code: string
  } | null
}

type TabType = 'overview' | 'orders' | 'designs_equipment' | 'jobs' | 'related'

export default function ProductDataCenterPage() {
  const tPC = useTranslations('ProductCenter')
  const tProd = useTranslations('Products')
  const tMaster = useTranslations('Master')
  const tCust = useTranslations('Customers')
  const tCommon = useTranslations('Common')

  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const productId = params.id as string

  const [product, setProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('products')
        .select(`
          product_id, product_code, product_name, product_name_internal, product_name_en,
          customer_product_name, product_description, first_shipment_date, product_status, pocket_count, pieces_per_box,
          company_id, end_user_company_id, notes,
          companies:companies!products_company_id_fkey(company_id, company_name, company_code)
        `)
        .eq('product_id', productId)
        .single()

      if (err || !data) {
        setError(err?.message || 'Product not found')
      } else {
        setProduct((data as unknown) as ProductData)
      }
      setLoading(false)
    }
    if (productId) fetchProduct()
  }, [productId, supabase])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8, color: 'var(--text-muted)' }}>
        <Loader2 size={20} className="animate-spin" />
        <span style={{ fontSize: 13 }}>{tCommon('loading')}</span>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--text-muted)' }}>
        <Package size={40} style={{ opacity: 0.3 }} />
        <div style={{ fontSize: 14 }}>{error || 'Product not found'}</div>
        <button className="btn btn-secondary" onClick={() => router.push('/product-center')}>
          {tMaster('listButton')}
        </button>
      </div>
    )
  }

  const statusKey = product.product_status === 'ACTIVE' ? 'activeStatus' : product.product_status === 'MAINTENANCE' ? 'maintenanceStatus' : 'disposedStatus'
  const statusText = tMaster(statusKey)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Ultra-Compact Top Header Bar ── */}
      <div style={{
        flexShrink: 0, padding: '8px 16px',
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap'
      }}>
        {/* Left: Navigation Buttons + Product Code + Status + Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <button onClick={() => router.back()} className="btn btn-secondary"
              style={{ height: 26, padding: '0 8px', fontSize: 11, gap: 4 }}>
              <ArrowLeft size={12} /><span>{tMaster('backButton')}</span>
            </button>
            <Link href="/product-center" className="btn btn-secondary"
              style={{ height: 26, padding: '0 8px', fontSize: 11, gap: 4, textDecoration: 'none' }}>
              <ArrowUpFromLine size={12} /><span>{tMaster('listButton')}</span>
            </Link>
          </div>

          <div style={{ width: 1, height: 16, background: 'var(--border-default)' }} />

          {/* Compact Product Identity Line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <div style={{
              width: 28, height: 28, borderRadius: 6, flexShrink: 0,
              background: 'var(--tint-teal-bg)', border: '1px solid var(--tint-teal-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Package size={16} style={{ color: 'var(--accent)' }} />
            </div>

            <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 16, color: 'var(--accent)', flexShrink: 0 }}>
              {product.product_code}
            </span>

            <span className={`badge ${
              product.product_status === 'ACTIVE' ? 'badge--success font-bold' :
              product.product_status === 'MAINTENANCE' ? 'badge--warning font-bold' :
              'badge--neutral font-bold'
            }`} style={{ fontSize: 9, flexShrink: 0 }}>
              {statusText}
            </span>

            <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.product_description || product.product_name_internal || product.product_name || '—'}
            </span>

            {product.companies && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Building2 size={12} />
                <Link href={`/master/customers/${product.companies.company_id}`} style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}>
                  {product.companies.company_code}
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* Right: Action Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <Link href={`/equipment/jobs/quick-create?product_id=${product.product_id}`} className="btn btn-primary cursor-pointer"
            style={{ height: 26, padding: '0 10px', fontSize: 11, gap: 4, textDecoration: 'none' }}>
            <Hammer size={12} /><span>+ {tCommon('addNew')}</span>
          </Link>
          <Link href={`/master/products/${product.product_id}`} className="btn btn-secondary cursor-pointer"
            style={{ height: 26, padding: '0 8px', fontSize: 11, gap: 4, textDecoration: 'none' }}>
            <ExternalLink size={12} /><span>{tCommon('edit')}</span>
          </Link>
        </div>
      </div>

      {/* 5 Main Application Tabs */}
      <div style={{
        flexShrink: 0,
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
        display: 'flex', gap: 0, overflow: 'auto', paddingLeft: 8,
      }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', border: 'none', cursor: 'pointer',
            background: 'none', fontSize: 12, whiteSpace: 'nowrap',
            color: activeTab === 'overview' ? 'var(--accent)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'overview' ? 700 : 500,
            borderBottom: `2px solid ${activeTab === 'overview' ? 'var(--accent)' : 'transparent'}`,
          }}
        >
          <Info size={13} style={{ color: activeTab === 'overview' ? 'var(--accent)' : 'var(--text-muted)' }} />
          <span>{tPC('tabOverviewLabel')}</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', border: 'none', cursor: 'pointer',
            background: 'none', fontSize: 12, whiteSpace: 'nowrap',
            color: activeTab === 'orders' ? 'var(--tint-purple-text)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'orders' ? 700 : 500,
            borderBottom: `2px solid ${activeTab === 'orders' ? 'var(--tint-purple-text)' : 'transparent'}`,
          }}
        >
          <FileText size={13} style={{ color: activeTab === 'orders' ? 'var(--tint-purple-text)' : 'var(--text-muted)' }} />
          <span>{tPC('tabOrdersLabel')}</span>
        </button>

        <button
          onClick={() => setActiveTab('designs_equipment')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', border: 'none', cursor: 'pointer',
            background: 'none', fontSize: 12, whiteSpace: 'nowrap',
            color: activeTab === 'designs_equipment' ? 'var(--tint-orange-text)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'designs_equipment' ? 700 : 500,
            borderBottom: `2px solid ${activeTab === 'designs_equipment' ? 'var(--tint-orange-text)' : 'transparent'}`,
          }}
        >
          <Wrench size={13} style={{ color: activeTab === 'designs_equipment' ? 'var(--tint-orange-text)' : 'var(--text-muted)' }} />
          <span>{tPC('tabDesignsEquipmentLabel')}</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', border: 'none', cursor: 'pointer',
            background: 'none', fontSize: 12, whiteSpace: 'nowrap',
            color: activeTab === 'jobs' ? 'var(--tint-orange-text)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'jobs' ? 700 : 500,
            borderBottom: `2px solid ${activeTab === 'jobs' ? 'var(--tint-orange-text)' : 'transparent'}`,
          }}
        >
          <Hammer size={13} style={{ color: activeTab === 'jobs' ? 'var(--tint-orange-text)' : 'var(--text-muted)' }} />
          <span>{tPC('tabJobsLabel')}</span>
        </button>

        <button
          onClick={() => setActiveTab('related')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', border: 'none', cursor: 'pointer',
            background: 'none', fontSize: 12, whiteSpace: 'nowrap',
            color: activeTab === 'related' ? 'var(--tint-blue-text)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'related' ? 700 : 500,
            borderBottom: `2px solid ${activeTab === 'related' ? 'var(--tint-blue-text)' : 'transparent'}`,
          }}
        >
          <Building2 size={13} style={{ color: activeTab === 'related' ? 'var(--tint-blue-text)' : 'var(--text-muted)' }} />
          <span>{tPC('tabRelatedInfoLabel')}</span>
        </button>
      </div>

      {/* Active Tab Container */}
      <div style={{ flex: 1, overflow: 'auto', padding: '10px 14px' }}>
        {activeTab === 'overview' && (
          <TabOverview
            productId={product.product_id}
            companyId={product.company_id}
            productCode={product.product_code}
            productName={product.product_name}
            productNameInternal={product.product_name_internal}
            customerProductName={product.customer_product_name}
            productDescription={product.product_description}
            productStatus={product.product_status}
            pocketCount={product.pocket_count}
            piecesPerBox={product.pieces_per_box}
            firstShipmentDate={product.first_shipment_date}
            notes={product.notes}
          />
        )}
        {activeTab === 'orders' && (
          <TabOrders productId={product.product_id} />
        )}
        {activeTab === 'designs_equipment' && (
          <TabDesignsEquipment productId={product.product_id} />
        )}
        {activeTab === 'jobs' && (
          <TabJobs productId={product.product_id} />
        )}
        {activeTab === 'related' && (
          <TabRelatedInfo
            productId={product.product_id}
            companyId={product.company_id}
            endUserCompanyId={product.end_user_company_id}
          />
        )}
      </div>
    </div>
  )
}