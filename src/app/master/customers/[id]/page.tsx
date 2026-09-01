import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, ArrowUpFromLine, ExternalLink, Package } from 'lucide-react'
import { BackButton } from './BackButton'
import { createClient } from '@/lib/supabase/server'
import { CompanyForm } from '../_components/CustomerForm'
import { notFound } from 'next/navigation'
import { Pagination } from '@/components/ui/Pagination'

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

type TabKey = 'info' | 'orders' | 'products'

// ══════════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════════
export default async function CustomerDetailPage(props: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ tab?: string; page?: string }>
}) {
  const tMaster = await getTranslations('Master')
  const tCust = await getTranslations('Customers')
  const tCommon = await getTranslations('Common')

  const { id } = await props.params
  const sp = await props.searchParams
  const activeTab = (sp?.tab || 'info') as TabKey
  const page = parseInt(sp?.page || '1', 10)
  const PAGE_SIZE = 50
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  // 1. Fetch Company Info
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('company_id', id)
    .single()
  if (error || !company) notFound()

  // 2. Fetch Parent Companies for dropdown
  const { data: parentCandidates } = await supabase
    .from('companies')
    .select('company_id, company_code, company_name')
    .contains('company_type', ['CUSTOMER'])
    .neq('company_id', id)
    .is('parent_company_id', null)
    .order('company_name', { ascending: true })
    .limit(200)

  // 3. Fetch Data per Tab
  let orders = null, orderCount = 0
  let products = null, productCount = 0
  let contacts = null, deliverySites = null

  if (activeTab === 'info') {
    const { data: cData } = await supabase.from('company_contacts').select('*').eq('company_id', id).order('is_primary', { ascending: false })
    contacts = cData
    const { data: dData } = await supabase.from('delivery_sites').select('*').eq('company_id', id).order('site_code', { ascending: true })
    deliverySites = dData
  } else if (activeTab === 'orders') {
    const { data: oData, count: oCount } = await supabase
      .from('orders')
      .select('order_id, order_no, order_date, requested_delivery, order_status', { count: 'exact' })
      .eq('company_id', id)
      .order('order_date', { ascending: false })
      .range(from, to)
    orders = oData
    orderCount = oCount || 0
  } else if (activeTab === 'products') {
    const { data: pData, count: pCount } = await supabase
      .from('products')
      .select('product_id, product_code, product_name, product_status, created_at', { count: 'exact' })
      .eq('company_id', id)
      .order('created_at', { ascending: false })
      .range(from, to)
    products = pData
    productCount = pCount || 0
  }

  const typesArray: string[] = company.company_type || []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* ── PageHeader ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, padding: '4px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton />
          <Link href="/master/customers" style={{ color: 'var(--text-muted)' }} title={tMaster('backToListTitle')}>
            <ArrowUpFromLine size={18} />
          </Link>
          <div style={{ width: 1, height: 24, background: 'var(--border-subtle)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{company.company_name}</h1>
              <span className={`badge ${company.is_active ? 'badge--success' : 'badge--neutral'}`}>
                {company.is_active ? tMaster('activeStatus') : tMaster('inactiveStatus')}
              </span>
              <span className="badge badge--info font-mono">{company.company_code}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FilterBar / TabBar ── */}
      <div className="form-section" style={{ flexShrink: 0, marginBottom: 0 }}>
        <div className="form-section-body">
          <div className="tab-nav" style={{ margin: '-14px -14px -14px', background: 'var(--bg-surface)' }}>
            <Link 
              href={`/master/customers/${id}?tab=info`}
              className={`tab-item ${activeTab === 'info' ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 700 }}>{tCust('customerDetails')}</span>
            </Link>
            <Link 
              href={`/master/customers/${id}?tab=orders`}
              className={`tab-item ${activeTab === 'orders' ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 700 }}>{tMaster('ngayAt')}</span>
            </Link>
            <Link 
              href={`/master/customers/${id}?tab=products`}
              className={`tab-item ${activeTab === 'products' ? 'tab-item--active' : ''}`}
              style={{ flex: 1, padding: '8px 4px', textDecoration: 'none' }}
            >
              <span style={{ fontWeight: 700 }}>{tCommon('product')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="card-flat" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
          
          {/* TAB: INFO */}
          {activeTab === 'info' && (
            <div style={{ display: 'flex', flexDirection: 'column', padding: '16px', gap: '24px' }}>
              <div style={{ height: 'auto' }}>
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

              {/* Read-only Contacts */}
              <div className="form-section">
                <div className="form-section-header" style={{ background: 'var(--tint-teal-bg)' }}>
                  <h3 className="form-section-title">{tCust('contactList')}</h3>
                </div>
                <div className="form-section-body" style={{ padding: 0 }}>
                  {!contacts || contacts.length === 0 ? (
                    <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>{tCommon('noData')}</div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: 80, textAlign: 'center' }}>{tMaster('chinh')}</th>
                          <th>{tCust('contactPerson')}</th>
                          <th>{tMaster('chucVu')}</th>
                          <th>{tCust('tel')}</th>
                          <th>{tMaster('email')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map((c: any) => (
                          <tr key={c.contact_id}>
                            <td style={{ textAlign: 'center' }}>{c.is_primary && <span className="badge badge--success font-bold">Primary</span>}</td>
                            <td style={{ fontWeight: 700 }}>{c.contact_name}</td>
                            <td style={{ color: 'var(--text-secondary)' }}>{c.contact_role}</td>
                            <td className="font-mono text-[13px]">{c.contact_tel}</td>
                            <td className="font-mono text-[13px]">{c.contact_email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ORDERS */}
          {activeTab === 'orders' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {!orders || orders.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>{tCommon('noData')}</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{tMaster('maOn')}</th>
                      <th>{tMaster('ngayAt')}</th>
                      <th>{tMaster('ngayGiao')}</th>
                      <th style={{ textAlign: 'center' }}>{tMaster('trangThai')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o: any) => (
                      <tr key={o.order_id}>
                        <td>
                          <Link href={`/orders/${o.order_id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>
                            {o.order_no}
                          </Link>
                        </td>
                        <td className="font-mono text-[13px]">{formatDate(o.order_date)}</td>
                        <td className="font-mono text-[13px]">{formatDate(o.requested_delivery)}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${o.order_status === 'CONFIRMED' ? 'badge--success' : 'badge--neutral'}`}>
                            {o.order_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB: PRODUCTS */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {!products || products.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)' }}>{tCommon('noData')}</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã SP</th>
                      <th>Tên Sản phẩm</th>
                      <th style={{ textAlign: 'center' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p: any) => (
                      <tr key={p.product_id}>
                        <td>
                          <Link href={`/master/products/${p.product_id}`} style={{ color: 'var(--accent)', fontFamily: 'monospace', fontWeight: 700, fontSize: 13 }}>
                            {p.product_code || '---'}
                          </Link>
                        </td>
                        <td style={{ fontWeight: 700 }}>{p.product_name}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${p.product_status === 'ACTIVE' ? 'badge--success' : 'badge--neutral'}`}>
                            {p.product_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>

        {/* ── Pagination for Orders & Products ── */}
        {(activeTab === 'orders' || activeTab === 'products') && (
          <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}>
            <Pagination
              currentPage={page}
              totalRecords={activeTab === 'orders' ? orderCount : productCount}
              pageSize={PAGE_SIZE}
              baseUrl={`/master/customers/${id}?tab=${activeTab}`}
            />
          </div>
        )}
      </div>
    </div>
  )
}
