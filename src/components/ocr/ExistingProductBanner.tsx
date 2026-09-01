import React from 'react'
import { ExternalLink, AlertCircle } from 'lucide-react'

export interface ExistingProductInfo {
  product_id: string
  product_code: string
  product_name: string
  product_name_internal: string
  customer_product_name: string
  product_description: string
  revision_number: number
  hasJobs: boolean
  hasEquipments: boolean
  company_name?: string
  company_code?: string
  workOrders?: any[]
  revisions: any[]
  jobs: any[]
  equipments: any[]
}

interface ExistingProductBannerProps {
  productInfo: ExistingProductInfo
  saveMode: any
  setSaveMode: (mode: any) => void
  t: (key: string, values?: any) => string
}

export function ExistingProductBanner({
  productInfo,
  saveMode,
  setSaveMode,
  t
}: ExistingProductBannerProps) {
  return (
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
          <AlertCircle size={20} color="#b45309" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#92400e' }}>
              {t('productExistsAlert', { code: productInfo.product_name_internal || productInfo.product_code })}
            </div>
            <div style={{ fontSize: 11, color: '#b45309', marginTop: 1 }}>
              {productInfo.company_name ? `得意先: ${productInfo.company_code ? `[${productInfo.company_code}] ` : ''}${productInfo.company_name}` : ''}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <a
            href={`/product-center/${productInfo.product_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ fontSize: 11, padding: '4px 8px', gap: 4, display: 'inline-flex', alignItems: 'center', textDecoration: 'none', background: '#fff' }}
          >
            <ExternalLink size={12} />
            <span>{t('btnSkipToProductDetail')}</span>
          </a>
        </div>
      </div>

      <div style={{ padding: '10px 12px', background: '#fff', borderRadius: 6, border: '1px solid #fde68a' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#92400e', marginBottom: 8 }}>
          {t('conflictResolutionLabel')}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="conflict_res"
              checked={saveMode.type === 'ENRICH_EXISTING'}
              onChange={() => setSaveMode({ type: 'ENRICH_EXISTING', productId: productInfo.product_id })}
              style={{ accentColor: '#d97706', marginTop: 2 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                {t('actionEnrichExisting')}
              </span>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                {t('actionEnrichExistingDesc', { rev: productInfo.revision_number })}
              </span>
            </div>
          </label>

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
            <input
              type="radio"
              name="conflict_res"
              checked={saveMode.type === 'NEW_REVISION'}
              onChange={() => setSaveMode({ type: 'NEW_REVISION', productId: productInfo.product_id, moldMode: 'REUSE' })}
              style={{ accentColor: '#d97706', marginTop: 2 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                {t('actionCreateNewRevision')}
              </span>
              <span style={{ fontSize: 11, color: '#64748b' }}>
                {t('actionCreateNewRevisionDesc', { rev: productInfo.revision_number + 1 })}
              </span>
            </div>
          </label>

        </div>
      </div>
    </div>
  )
}
