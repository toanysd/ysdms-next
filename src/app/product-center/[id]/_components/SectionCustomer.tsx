'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Building2, ExternalLink } from 'lucide-react'
import { SectionShell } from './SectionShell'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface SectionCustomerProps {
  productId: string
  companyId: string
  endUserCompanyId?: string | null
}

interface Company {
  company_id: string
  company_code: string
  company_name: string
  phone?: string
  address?: string
}

export function SectionCustomer({
  productId,
  companyId,
  endUserCompanyId,
}: SectionCustomerProps) {
  const t = useTranslations('ProductCenter')
  const [customer, setCustomer] = useState<Company | null>(null)
  const [endUser, setEndUser] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const { data: customerData } = await supabase
          .from('companies')
          .select('*')
          .eq('company_id', companyId)
          .single()

        if (customerData) {
          setCustomer(customerData as Company)
        }

        if (endUserCompanyId) {
          const { data: endUserData } = await supabase
            .from('companies')
            .select('*')
            .eq('company_id', endUserCompanyId)
            .single()

          if (endUserData) {
            setEndUser(endUserData as Company)
          }
        }
      } catch (error) {
        console.error('Error fetching customer data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (companyId) fetchData()
  }, [companyId, endUserCompanyId])

  const customerActions = (
    <Link
      href={`/master/customers/${companyId}`}
      className="btn btn-secondary"
      style={{ height: 24, padding: '0 8px', fontSize: 10, gap: 4, textDecoration: 'none' }}
    >
      <ExternalLink size={12} />
      <span>{t('viewCustomer')}</span>
    </Link>
  )

  return (
    <SectionShell
      icon={Building2}
      titleKey="section1Title"
      accentColor="var(--tint-blue-text)"
      isLoading={isLoading}
      actions={customerActions}
    >
      {/* Customer block */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 5 }}>
          {t('customer')}
        </div>
        {customer ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 56, flexShrink: 0 }}>{t('companyCode')}</span>
              <Link href={`/master/customers/${customer.company_id}`} style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>
                {customer.company_code}
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 56, flexShrink: 0 }}>{t('companyName')}</span>
              <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{customer.company_name}</span>
            </div>
            {customer.phone && customer.phone !== '—' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 56, flexShrink: 0 }}>{t('phone')}</span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{customer.phone}</span>
              </div>
            )}
            {customer.address && customer.address !== '—' && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 56, flexShrink: 0 }}>{t('address')}</span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{customer.address}</span>
              </div>
            )}
          </div>
        ) : (
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>「―」</span>
        )}
      </div>

      {/* End User block */}
      {endUserCompanyId && (
        <div style={{ paddingTop: 8, marginTop: 8, borderTop: '1px dashed var(--border-default)' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 5 }}>
            {t('endUser')}
          </div>
          {endUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 56, flexShrink: 0 }}>{t('companyCode')}</span>
                <Link href={`/master/customers/${endUser.company_id}`} style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>
                  {endUser.company_code}
                </Link>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 3 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 56, flexShrink: 0 }}>{t('companyName')}</span>
                <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{endUser.company_name}</span>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{t('loading')}</div>
          )}
        </div>
      )}
    </SectionShell>
  )
}
