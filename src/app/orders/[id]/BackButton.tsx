import Link from 'next/link'
import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export function OrderBackButton() {
  const router = useRouter()
  const t = useTranslations('Cases')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button 
        onClick={() => router.back()} 
        className="btn btn-secondary" 
        style={{ height: 32, padding: '0 12px' }}
      >
        <ArrowLeft size={14} />
        <span>{t('back')}</span>
      </button>
      
      <Link 
        href="/orders" 
        className="btn btn-secondary" 
        style={{ height: 32, padding: '0 12px', textDecoration: 'none' }}
      >
        <ArrowUpFromLine size={14} />
        <span>{t('list')}</span>
      </Link>
    </div>
  )
}
