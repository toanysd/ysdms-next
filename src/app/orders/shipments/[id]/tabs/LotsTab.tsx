'use client'

export function LotsTab({ shipment, onRefresh }: { shipment: any, onRefresh: () => void }) {
  return (
    <div className="card-flat" style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-jp)', marginBottom: 4 }}>
        ロット
      </div>
      <div style={{ fontSize: 11 }}>
        開発中 / Đang phát triển (Lots)...
      </div>
    </div>
  )
}
