export const dynamic = 'force-dynamic'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import { addPlasticAction } from '@/app/actions/plastic'

export default function NewPlasticPage() {
  const t = useTranslations()
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-default)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-sm)',
      maxWidth: 800,
      margin: '0 auto',
      width: '100%'
    }}>
      {/* ── Header ── */}
      <div style={{
        height: 48,
        background: 'var(--bg-surface-3)',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/master/plastics" style={{ color: 'var(--text-muted)', display: 'flex' }}>
            <ArrowLeft size={17} />
          </Link>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: 'var(--font-jp)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              新規プラ材料登録
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>
              Đăng ký Cuộn Nhựa mới
            </span>
          </div>
        </div>
      </div>

      {/* ── Form Content ── */}
      <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        <form action={addPlasticAction} style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="form-section">
            <div className="form-section-title">Thông số cơ bản / 基本仕様</div>
            <div className="form-section-body">
              <div className="form-grid-4">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">
                    {t('Master.maNhuaVdPetfr02')}
                  </label>
                  <input type="text" name="code" required className="form-input" placeholder="VD: PET-FR-02" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">
                    {t('Master.familyPsPetPp')}
                  </label>
                  <select name="family" required className="form-input">
                    <option value="">Chọn Family</option>
                    <option value="PS">PS</option>
                    <option value="PET">PET</option>
                    <option value="PP">PP</option>
                    <option value="PVC">PVC</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">
                    {t('Master.oDayVd05')}
                  </label>
                  <input type="number" step="0.01" min="0" name="thickness_mm" required className="form-input" placeholder="0.00" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">
                    {t('Master.khoNgangVd680')}
                  </label>
                  <input type="number" step="1" min="0" name="width_mm" required className="form-input" placeholder="0" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">
                    {t('Master.mauSacVdTBk')}
                  </label>
                  <input type="text" name="color" className="form-input" placeholder="VD: T (Trong suốt)" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">
                    {t('Master.acTinhChongTinhIen')}
                  </label>
                  <input type="text" name="grade" className="form-input" placeholder="VD: AS" />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <label className="form-label">
                    {t('Master.tonKhoToiThieu')}
                  </label>
                  <input type="number" step="0.1" min="0" name="reorder_point_kg" className="form-input" placeholder="VD: 50.0" defaultValue="0" />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
            <Link href="/master/plastics" className="btn" style={{ height: 36 }}>
              {t('Master.tempKey')}
            </Link>
            <button type="submit" className="btn btn-primary" style={{ height: 36 }}>
              <Save size={16} />
              {t('Master.luu')}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
