import Link from 'next/link'
import { ArrowLeft, ArrowUpFromLine, Plus, ExternalLink } from 'lucide-react'
import { BackButton } from './BackButton'
import { createClient } from '@/lib/supabase/server'
import { CompanyForm } from '../_components/CustomerForm'
import { ContactList } from '../_components/ContactList'
import { DeliverySiteList } from '../_components/DeliverySiteList'
import { notFound } from 'next/navigation'

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

type TabKey = 'info' | 'contacts' | 'delivery' | 'orders'

// ══════════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════════
export default async function CustomerDetailPage(props: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ tab?: string }>
}) {
  const { id } = await props.params
  const sp = await props.searchParams
  const activeTab = (sp?.tab || 'info') as TabKey

  const supabase = await createClient()

  // Main company
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('company_id', id)
    .single()
  if (error || !company) notFound()

  // Parent company name
  let parentName: string | null = null
  if (company.parent_company_id) {
    const { data: p } = await supabase
      .from('companies')
      .select('company_name, company_code')
      .eq('company_id', company.parent_company_id)
      .single()
    if (p) parentName = `[${p.company_code}] ${p.company_name}`
  }

  // Children companies
  const { data: children } = await supabase
    .from('companies')
    .select('company_id, company_code, company_name, company_type')
    .eq('parent_company_id', id)
    .order('company_name', { ascending: true })

  // Parent candidates for dropdown (CUSTOMER type, no parent)
  const { data: parentCandidates } = await supabase
    .from('companies')
    .select('company_id, company_code, company_name')
    .contains('company_type', ['CUSTOMER'])
    .neq('company_id', id)
    .is('parent_company_id', null)
    .order('company_name', { ascending: true })
    .limit(200)

  // Orders for this company (tab: orders)
  const { data: orders, count: orderCount } = await supabase
    .from('orders')
    .select('order_id, order_no, order_date, requested_delivery, order_status', { count: 'exact' })
    .eq('company_id', id)
    .order('order_date', { ascending: false })
    .limit(50)

  // Contacts
  const { data: contacts } = await supabase
    .from('company_contacts')
    .select('*')
    .eq('company_id', id)
    .order('is_primary', { ascending: false })
    .order('contact_name', { ascending: true })

  // Delivery sites
  const { data: deliverySites } = await supabase
    .from('delivery_sites')
    .select('*')
    .eq('company_id', id)
    .order('site_code', { ascending: true })

  const typesArray: string[] = company.company_type || []

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
    }}>

      {/* ══ Header bar ══ */}
      <div style={{
        height: 48,
        background: 'var(--bg-surface-3)',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-default)',
        flexShrink: 0,
        gap: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <BackButton />
            <Link
              href="/master/customers"
              style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', fontSize: 11, textDecoration: 'none', padding: '2px 4px' }}
              title="顧客一覧へ / Về danh sách khách hàng"
            >
              <ArrowUpFromLine size={14} />
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontFamily: 'var(--font-jp)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
              顧客詳細 / 編集
            </span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              Chi tiết &amp; Sửa thông tin Khách hàng
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span className={`badge ${company.is_active ? 'badge--success' : 'badge--neutral'}`}>
            {company.is_active ? '取引中' : '停止'}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-surface-2)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
            {company.company_code}
          </span>
        </div>
      </div>

      {/* ══ Body: Left panel + Right panel ══ */}
      <div className="detail-layout" style={{ flex: 1, minHeight: 0 }}>

        {/* ── Left Panel: Hierarchy ── */}
        <div className="detail-panel-left custom-scrollbar" style={{ overflowY: 'auto' }}>

          {/* Company name header */}
          <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-default)' }}>
            <p style={{ fontFamily: 'var(--font-jp)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {company.company_name}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
              {typesArray.map(t => (
                <span key={t} className="badge badge--info" style={{ fontSize: 9 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Parent company link */}
          {company.parent_company_id && parentName && (
            <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
                親会社 / Công ty mẹ
              </p>
              <Link href={`/master/customers/${company.parent_company_id}`} style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                <ExternalLink size={10} />
                {parentName}
              </Link>
            </div>
          )}

          {/* Children companies */}
          {children && children.length > 0 && (
            <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <p style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  子会社 / Chi nhánh ({children.length})
                </p>
                <Link href={`/master/customers/new?parent=${id}`} style={{ fontSize: 10, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Plus size={10} />追加
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {children.map(c => (
                  <Link
                    key={c.company_id}
                    href={`/master/customers/${c.company_id}`}
                    style={{
                      fontSize: 11, padding: '5px 8px', borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface)',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      transition: 'border-color var(--transition-fast)',
                    }}
                    title={c.company_name}
                  >
                    {c.company_name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick info: TEL / FAX / Address */}
          <div style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
            {company.tel && (
              <div>
                <p style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>TEL</p>
                <a href={`tel:${company.tel}`} style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>{company.tel}</a>
              </div>
            )}
            {company.fax && (
              <div>
                <p style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>FAX</p>
                <span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{company.fax}</span>
              </div>
            )}
            {company.address && (
              <div>
                <p style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 2 }}>住所 / Địa chỉ</p>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block' }}>{company.address}</span>
              </div>
            )}
          </div>

          {/* Updated at */}
          {company.updated_at && (
            <div style={{ marginTop: 'auto', padding: '8px 14px', borderTop: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: 9, color: 'var(--text-muted)' }}>
                更新: {formatDate(company.updated_at)}
              </p>
            </div>
          )}
        </div>

        {/* ── Right Panel: Tabs + Content ── */}
        <div className="detail-panel-right" style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>

          {/* Tab nav */}
          <div className="tab-nav">
            <Link
              href={`/master/customers/${id}?tab=info`}
              className={`tab-item${activeTab === 'info' ? ' tab-item--active' : ''}`}
            >
              <span className="tab-ja">基本情報</span>
              <span className="tab-vi">Thông tin</span>
            </Link>
            <Link
              href={`/master/customers/${id}?tab=contacts`}
              className={`tab-item${activeTab === 'contacts' ? ' tab-item--active' : ''}`}
            >
              <span className="tab-ja">担当者 {contacts?.length ? `(${contacts.length})` : ''}</span>
              <span className="tab-vi">Người liên hệ</span>
            </Link>
            <Link
              href={`/master/customers/${id}?tab=delivery`}
              className={`tab-item${activeTab === 'delivery' ? ' tab-item--active' : ''}`}
            >
              <span className="tab-ja">納品先 {deliverySites?.length ? `(${deliverySites.length})` : ''}</span>
              <span className="tab-vi">Địa điểm</span>
            </Link>
            <Link
              href={`/master/customers/${id}?tab=orders`}
              className={`tab-item${activeTab === 'orders' ? ' tab-item--active' : ''}`}
            >
              <span className="tab-ja">受注履歴 {orderCount ? `(${orderCount})` : ''}</span>
              <span className="tab-vi">Đơn hàng</span>
            </Link>
          </div>

          {/* Tab: 基本情報 */}
          {activeTab === 'info' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px' }} className="custom-scrollbar">
              <CompanyForm
                initialData={{
                  company_id:          company.company_id,
                  company_code:        company.company_code ?? '',
                  company_name:        company.company_name ?? '',
                  company_name_romaji: company.company_name_romaji ?? '',
                  company_type:        typesArray,
                  tel:                 company.tel ?? '',
                  fax:                 company.fax ?? '',
                  address:             company.address ?? '',
                  order_folder_path:   company.order_folder_path ?? '',
                  cad_folder_path:     company.cad_folder_path ?? '',
                  parent_company_id:   company.parent_company_id ?? '',
                  is_active:           company.is_active ?? true,
                  notes:               company.notes ?? '',
                  legacy_id:           company.legacy_id ?? '',
                }}
                parentCompanies={parentCandidates ?? []}
                mode="view"
              />
            </div>
          )}

          {/* Tab: 担当者 */}
          {activeTab === 'contacts' && (
            <ContactList companyId={id} contacts={contacts || []} />
          )}

          {/* Tab: 納品先 */}
          {activeTab === 'delivery' && (
            <DeliverySiteList companyId={id} sites={deliverySites || []} />
          )}

          {/* Tab: 受注履歴 */}
          {activeTab === 'orders' && (
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }} className="custom-scrollbar">
              {/* Header */}
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                  {orderCount ?? 0} 件の受注 / {orderCount ?? 0} đơn hàng
                </span>
                <Link
                  href={`/orders?company=${id}`}
                  style={{ fontSize: 11, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <ExternalLink size={11} />全て表示 / Xem tất cả
                </Link>
              </div>

              {/* Orders table */}
              {!orders || orders.length === 0 ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  <span style={{ fontFamily: 'var(--font-jp)' }}>受注データなし</span>
                  <span style={{ marginLeft: 8, fontSize: 11 }}>/ Chưa có đơn hàng</span>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: 130 }}>
                        <span className="ja">受注番号</span>
                        <span className="vi">Mã đơn</span>
                      </th>
                      <th style={{ width: 100 }}>
                        <span className="ja">受注日</span>
                        <span className="vi">Ngày đặt</span>
                      </th>
                      <th style={{ width: 100 }}>
                        <span className="ja">納期</span>
                        <span className="vi">Ngày giao</span>
                      </th>
                      <th style={{ width: 100, textAlign: 'center' }}>
                        <span className="ja">状態</span>
                        <span className="vi">Trạng thái</span>
                      </th>
                      <th style={{ width: 60, textAlign: 'center' }}>
                        <span className="ja">操作</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.order_id}>
                        <td>
                          <Link href={`/orders?highlight=${o.order_id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 700, fontSize: 12 }}>
                            {o.order_no}
                          </Link>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                            {formatDate(o.order_date)}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>
                            {formatDate(o.requested_delivery)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${
                            o.order_status === 'SHIPPED' ? 'badge--neutral' :
                            o.order_status === 'CANCELLED' ? 'badge--error' :
                            o.order_status === 'IN_PRODUCTION' ? 'badge--success' :
                            o.order_status === 'QUOTED' ? 'badge--warning' : 'badge--info'
                          }`}>
                            {o.order_status || '—'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Link href={`/orders?highlight=${o.order_id}`} style={{ color: 'var(--text-muted)', display: 'inline-flex' }}>
                            <ExternalLink size={13} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
