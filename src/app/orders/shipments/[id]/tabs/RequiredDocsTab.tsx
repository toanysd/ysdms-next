'use client'

import { useTranslations } from 'next-intl'

export function RequiredDocsTab({ shipment, onRefresh }: { shipment: any, onRefresh: () => void }) {
  const t = useTranslations()
  return (
    <div className="card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-jp)', marginBottom: 4 }}>
        {t('Shipments.tabDocs')}
      </div>
      <div style={{ fontSize: 11 }}>
        {t('Common.underDevelopment')}
      </div>
    </div>
  )
}
