import Link from 'next/link'
import { ArrowLeft, ArrowUpFromLine } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function OrderBackButton() {
  const router = useRouter()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <button 
        onClick={() => router.back()} 
        className="btn btn-secondary" 
        style={{ height: 32, padding: '0 12px' }}
      >
        <ArrowLeft size={14} />
        <span style={{ fontFamily: 'var(--font-jp)' }}>戻る</span>
      </button>
      
      <Link 
        href="/orders" 
        className="btn btn-secondary" 
        style={{ height: 32, padding: '0 12px', textDecoration: 'none' }}
      >
        <ArrowUpFromLine size={14} />
        <span style={{ fontFamily: 'var(--font-jp)' }}>一覧</span>
      </Link>
    </div>
  )
}
