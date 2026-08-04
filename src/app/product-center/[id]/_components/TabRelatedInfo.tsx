'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Building2, ExternalLink, Briefcase, FileText } from 'lucide-react'
import Link from 'next/link'

interface TabRelatedInfoProps {
  productId: string
  companyId: string
  endUserCompanyId?: string | null
}

interface Company {
  company_id: string
  company_code: string
  company_name: string
  tel?: string
  address?: string
}

export function TabRelatedInfo({
  productId,
  companyId,
  endUserCompanyId,
}: TabRelatedInfoProps) {
  const t = useTranslations('ProductCenter')
  const supabase = createClient()

  const [customer, setCustomer] = useState<Company | null>(null)
  const [endUser, setEndUser] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadInfo() {
      setLoading(true)
      try {
        if (companyId) {
          const { data: c } = await supabase.from('companies').select('company_id, company_code, company_name, tel, address').eq('company_id', companyId).single()
          if (c) setCustomer(c as unknown as Company)
        }
        if (endUserCompanyId) {
          const { data: eu } = await supabase.from('companies').select('company_id, company_code, company_name, tel, address').eq('company_id', endUserCompanyId).single()
          if (eu) setEndUser(eu as unknown as Company)
        }
      } catch (err) {
        console.error('Error loading related info:', err)
      } finally {
        setLoading(false)
      }
    }
    loadInfo()
  }, [companyId, endUserCompanyId])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>

      {/* Customer Info Card (Tinted Blue Header) */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-blue-border)' }}>
        <div style={{
          background: 'var(--tint-blue-bg)', borderBottom: '1px solid var(--tint-blue-border)',
          padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--tint-blue-text)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Building2 size={16} style={{ color: 'var(--tint-blue-text)' }} /> {t('mainCustomerInfoTitle')}
          </span>
          {customer && (
            <Link href={`/master/customers/${customer.company_id}`} style={{ fontSize: 11, color: 'var(--accent)', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 3 }}>
              {t('viewDetails')} <ExternalLink size={11} />
            </Link>
          )}
        </div>

        <div style={{ padding: 14 }}>
          {customer ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: 12, fontWeight: 600 }}>{t('companyCodeLabel')}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent)', fontSize: 14 }}>{customer.company_code}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: 12, fontWeight: 600 }}>{t('companyNameLabel')}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{customer.company_name}</span>
              </div>
              {customer.tel && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: 12, fontWeight: 600 }}>{t('phoneLabel')}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{customer.tel}</span>
                </div>
              )}
              {customer.address && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: 12, fontWeight: 600 }}>{t('addressLabel')}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{customer.address}</span>
                </div>
              )}
            </div>
          ) : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('noCustomerFound')}</span>}
        </div>
      </div>

      {/* End User Info Card (Tinted Teal Header) */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-teal-border)' }}>
        <div style={{
          background: 'var(--tint-teal-bg)', borderBottom: '1px solid var(--tint-teal-border)',
          padding: '10px 14px', fontSize: 13, fontWeight: 700, color: 'var(--tint-teal-text)',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <Building2 size={16} style={{ color: 'var(--tint-teal-text)' }} /> {t('endUserInfoTitle')}
        </div>

        <div style={{ padding: 14 }}>
          {endUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: 12, fontWeight: 600 }}>{t('companyCodeLabel')}</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--accent)', fontSize: 14 }}>{endUser.company_code}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: 'var(--text-muted)', minWidth: 80, fontSize: 12, fontWeight: 600 }}>{t('companyNameLabel')}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{endUser.company_name}</span>
              </div>
            </div>
          ) : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t('noEndUserInfo')}</span>}
        </div>
      </div>

      {/* Business Cases & Audit Notes Card (Tinted Orange Header) */}
      <div className="card-flat" style={{ padding: 0, overflow: 'hidden', border: '1px solid var(--tint-orange-border)' }}>
        <div style={{
          background: 'var(--tint-orange-bg)', borderBottom: '1px solid var(--tint-orange-border)',
          padding: '10px 14px', fontSize: 13, fontWeight: 700, color: 'var(--tint-orange-text)',
          display: 'flex', alignItems: 'center', gap: 6
        }}>
          <Briefcase size={16} style={{ color: 'var(--tint-orange-text)' }} /> {t('businessCasesAndAuditTitle')}
        </div>
        <div style={{ padding: 14, fontSize: 12, color: 'var(--text-muted)' }}>
          {t('noRelatedCases')}
        </div>
      </div>

    </div>
  )
}