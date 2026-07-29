'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Plus, Trash2, Building, MapPin, Users, Loader2, History } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/Input'

type TabType = 'GENERAL' | 'ADDRESSES' | 'CONTACTS'

interface CompanyFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSaved: (companyId: string) => void
  initialCompanyId?: string | null
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({ isOpen, onClose, onSaved, initialCompanyId }) => {
  const supabase = createClient()
  const t = useTranslations('CompanyForm')
  const tCommon = useTranslations('Common')

  const [activeTab, setActiveTab] = useState<TabType>('GENERAL')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form State - General
  const [companyId, setCompanyId] = useState<string | null>(initialCompanyId || null)
  const [companyCode, setCompanyCode] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyNameRomaji, setCompanyNameRomaji] = useState('')
  const [companyType, setCompanyType] = useState<string[]>([])
  const [parentCompanyId, setParentCompanyId] = useState<string>('')
  const [address, setAddress] = useState('')
  const [tel, setTel] = useState('')
  const [fax, setFax] = useState('')
  const [notes, setNotes] = useState('')
  
  // Contacts
  const [contacts, setContacts] = useState<any[]>([])
  // Delivery Sites
  const [sites, setSites] = useState<any[]>([])
  
  // Audit History
  const [historySiteId, setHistorySiteId] = useState<string | null>(null)
  const [siteHistory, setSiteHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  
  // Options
  const [parentCompanies, setParentCompanies] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      fetchParentCompanies()
      if (initialCompanyId) {
        loadCompany(initialCompanyId)
      } else {
        resetForm()
      }
    }
  }, [isOpen, initialCompanyId])

  const fetchParentCompanies = async () => {
    let allData: any[] = []
    let hasMore = true
    let page = 0

    while (hasMore) {
      const { data, error } = await supabase
        .from('companies')
        .select('company_id, company_code, company_name')
        .order('company_code')
        .range(page * 1000, (page + 1) * 1000 - 1)

      if (error) break
      if (data) {
        allData = [...allData, ...data]
        if (data.length < 1000) {
          hasMore = false
        } else {
          page++
        }
      } else {
        hasMore = false
      }
    }
    
    setParentCompanies(allData)
  }

  const loadCompany = async (id: string) => {
    setLoading(true)
    const { data } = await supabase.from('companies').select('*').eq('company_id', id).single()
    if (data) {
      setCompanyId(data.company_id)
      setCompanyCode(data.company_code)
      setCompanyName(data.company_name)
      setCompanyNameRomaji(data.company_name_romaji || '')
      setCompanyType(data.company_type || [])
      setParentCompanyId(data.parent_company_id || '')
      setAddress(data.address || '')
      setTel(data.tel || '')
      setFax(data.fax || '')
      setNotes(data.notes || '')
    }
    
    // Load contacts & sites
    const [cRes, sRes] = await Promise.all([
      supabase.from('company_contacts').select('*').eq('company_id', id),
      supabase.from('delivery_sites').select('*').eq('company_id', id)
    ])
    if (cRes.data) setContacts(cRes.data)
    if (sRes.data) setSites(sRes.data)
    setLoading(false)
  }

  const resetForm = () => {
    setCompanyId(null)
    setCompanyCode('')
    setCompanyName('')
    setCompanyNameRomaji('')
    setCompanyType(['CUSTOMER'])
    setParentCompanyId('')
    setAddress('')
    setTel('')
    setFax('')
    setNotes('')
    setContacts([])
    setSites([])
    setActiveTab('GENERAL')
  }

  const toggleType = (type: string) => {
    setCompanyType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyCode || !companyName) return
    setSaving(true)

    try {
      const payload = {
        company_code: companyCode,
        company_name: companyName,
        company_name_romaji: companyNameRomaji || null,
        company_type: companyType,
        parent_company_id: parentCompanyId || null,
        address: address || null,
        tel: tel || null,
        fax: fax || null,
        notes: notes || null
      }

      let savedId = companyId

      if (savedId) {
        const { error } = await supabase.from('companies').update(payload).eq('company_id', savedId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('companies').insert([payload]).select().single()
        if (error) throw error
        if (data) savedId = data.company_id
      }

      // Process Contacts
      for (const c of contacts) {
        const payload = {
          company_id: savedId as string,
          contact_name: c.contact_name,
          contact_role: c.contact_role,
          contact_email: c.contact_email,
          contact_tel: c.contact_tel
        }
        if (c.contact_id && c.contact_id.startsWith('temp-')) {
          const { error } = await supabase.from('company_contacts').insert([payload])
          if (error) throw error
        } else {
          const { error } = await supabase.from('company_contacts').update(payload).eq('contact_id', c.contact_id)
          if (error) throw error
        }
      }

      // Process Sites
      for (const s of sites) {
        const payload = {
          company_id: savedId as string,
          site_code: s.site_code,
          site_name: s.site_name,
          site_address: s.site_address,
          site_tel: s.site_tel,
          contact_person: s.contact_person,
          contact_email: s.contact_email
        }
        if (s.site_id && s.site_id.startsWith('temp-')) {
          const { error } = await supabase.from('delivery_sites').insert([payload])
          if (error) throw error
        } else {
          const { error } = await supabase.from('delivery_sites').update(payload).eq('site_id', s.site_id)
          if (error) throw error
        }
      }

      setSaving(false)
      if (savedId) onSaved(savedId)
    } catch (err: any) {
      console.error(err)
      setSaving(false)
      if (err.code === '23505') {
        alert(t('warningDuplicate'))
      } else {
        alert(t('errorSaving') + err.message)
      }
    }
  }

  const loadHistory = async (siteId: string) => {
    setHistorySiteId(siteId)
    setLoadingHistory(true)
    const { data } = await supabase
      .from('audit_logs')
      .select('*, employees!audit_logs_changed_by_fkey(employee_name)')
      .eq('table_name', 'delivery_sites')
      .eq('record_id', siteId)
      .order('created_at', { ascending: false })
    if (data) setSiteHistory(data)
    setLoadingHistory(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg-surface)] w-[800px] max-w-full rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <Building className="text-[var(--accent)]" size={20} />
            <h2 className="text-[16px] font-bold text-[var(--text-primary)]">
              {companyId ? t('editTitle') : t('newTitle')}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] rounded"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-[var(--accent)]" /></div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex px-4 border-b border-[var(--border-default)] bg-[var(--bg-surface-2)] shrink-0 gap-2">
              <button type="button" onClick={() => setActiveTab('GENERAL')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'GENERAL' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'}`}>{t('tabGeneral')}</button>
              <button type="button" onClick={() => setActiveTab('ADDRESSES')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-1 ${activeTab === 'ADDRESSES' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'}`}><MapPin size={14}/> {t('tabAddresses')}</button>
              <button type="button" onClick={() => setActiveTab('CONTACTS')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-1 ${activeTab === 'CONTACTS' ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-transparent text-[var(--text-secondary)]'}`}><Users size={14}/> {t('tabContacts')}</button>
            </div>

            {/* Content */}
            <form id="company-form" onSubmit={handleSave} className="flex-1 overflow-auto p-4 custom-scrollbar">
              
              <div className={activeTab === 'GENERAL' ? 'block' : 'hidden'}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold">{t('companyCode')}</label>
                    <input type="text" required value={companyCode} onChange={e => setCompanyCode(e.target.value.toUpperCase())} className="h-[32px] px-2 rounded border border-[var(--border-default)] bg-transparent w-full" placeholder="VD: YSD" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold">{t('companyName')}</label>
                    <input type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)} className="h-[32px] px-2 rounded border border-[var(--border-default)] bg-transparent w-full" placeholder="VD: Yoshida Package" />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs font-bold">{t('companyNameRomaji')}</label>
                    <input type="text" value={companyNameRomaji} onChange={e => setCompanyNameRomaji(e.target.value)} className="h-[32px] px-2 rounded border border-[var(--border-default)] bg-transparent w-full" placeholder="VD: Yoshida Package Co., Ltd" />
                  </div>
                  
                  <div className="flex flex-col gap-2 col-span-2 mt-2">
                    <label className="text-xs font-bold">{t('companyType')}</label>
                    <div className="flex flex-wrap gap-4 bg-[var(--bg-surface-2)] p-3 rounded border border-[var(--border-default)]">
                      {(['CUSTOMER', 'SUPPLIER', 'OUTSOURCE', 'SUBCONTRACTOR', 'MOLD_OWNER'] as const).map(typeKey => (
                        <label key={typeKey} className="flex items-center gap-2 cursor-pointer text-sm">
                          <input type="checkbox" checked={companyType.includes(typeKey)} onChange={() => toggleType(typeKey)} className="rounded border-gray-300" />
                          <span className="font-bold">{t('types.' + typeKey)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs font-bold">{t('parentCompany')}</label>
                    <select value={parentCompanyId} onChange={e => setParentCompanyId(e.target.value)} className="h-[32px] px-2 rounded border border-[var(--border-default)] bg-transparent w-full text-sm">
                      <option value="">{t('noParentCompany')}</option>
                      {parentCompanies.map(p => (
                        <option key={p.company_id} value={p.company_id}>{p.company_code} - {p.company_name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 col-span-2 mt-2">
                    <label className="text-xs font-bold">{t('mainAddress')}</label>
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="h-[32px] px-2 rounded border border-[var(--border-default)] bg-transparent w-full" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold">{t('tel')}</label>
                    <input type="text" value={tel} onChange={e => setTel(e.target.value)} className="h-[32px] px-2 rounded border border-[var(--border-default)] bg-transparent w-full" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold">{t('fax')}</label>
                    <input type="text" value={fax} onChange={e => setFax(e.target.value)} className="h-[32px] px-2 rounded border border-[var(--border-default)] bg-transparent w-full" />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2">
                    <label className="text-xs font-bold">{t('notes')}</label>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="px-2 py-1 rounded border border-[var(--border-default)] bg-transparent w-full" />
                  </div>
                </div>
              </div>

              {/* ADDRESSES TAB */}
              <div className={activeTab === 'ADDRESSES' ? 'block' : 'hidden'}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm">{t('deliverySitesTitle')}</h3>
                  <button type="button" onClick={() => setSites([...sites, { site_id: 'temp-'+Date.now(), site_code: '', site_name: '', site_address: '', site_tel: '', contact_person: '', contact_email: '' }])} className="btn-secondary h-[28px] text-xs px-2 flex items-center gap-1">
                    <Plus size={14} /> {t('addSite')}
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {sites.length === 0 && <div className="text-center p-4 text-[var(--text-muted)] text-sm border border-dashed rounded">{t('noSites')}</div>}
                  {sites.map((site, i) => (
                    <div key={site.site_id} className="bg-[var(--bg-surface-2)] p-3 rounded border border-[var(--border-default)] flex flex-col gap-2 relative">
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        {!site.site_id.startsWith('temp-') && (
                          <button type="button" onClick={() => loadHistory(site.site_id)} className="text-[var(--text-muted)] p-1 hover:bg-[var(--bg-surface-hover)] hover:text-[var(--accent)] rounded" title={t('historyTitle')}><History size={14}/></button>
                        )}
                        <button type="button" onClick={() => setSites(sites.filter(s => s.site_id !== site.site_id))} className="text-[var(--status-error)] p-1 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pr-12">
                        <Input label={t('siteCode')} required value={site.site_code} onChange={e => { const n = [...sites]; n[i].site_code = e.target.value; setSites(n); }} />
                        <Input label={t('siteName')} required value={site.site_name} onChange={e => { const n = [...sites]; n[i].site_name = e.target.value; setSites(n); }} />
                        <Input label={t('siteContact')} value={site.contact_person || ''} onChange={e => { const n = [...sites]; n[i].contact_person = e.target.value; setSites(n); }} />
                        <Input label={t('siteEmail')} value={site.contact_email || ''} onChange={e => { const n = [...sites]; n[i].contact_email = e.target.value; setSites(n); }} />
                        <div className="col-span-2"><Input label={t('siteAddress')} value={site.site_address} onChange={e => { const n = [...sites]; n[i].site_address = e.target.value; setSites(n); }} /></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CONTACTS TAB */}
              <div className={activeTab === 'CONTACTS' ? 'block' : 'hidden'}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm">{t('contactsTitle')}</h3>
                  <button type="button" onClick={() => setContacts([...contacts, { contact_id: 'temp-'+Date.now(), contact_name: '', contact_role: '', contact_email: '', contact_tel: '' }])} className="btn-secondary h-[28px] text-xs px-2 flex items-center gap-1">
                    <Plus size={14} /> {t('addContact')}
                  </button>
                </div>
                <div className="flex flex-col gap-3">
                  {contacts.length === 0 && <div className="text-center p-4 text-[var(--text-muted)] text-sm border border-dashed rounded">{t('noContacts')}</div>}
                  {contacts.map((contact, i) => (
                    <div key={contact.contact_id} className="bg-[var(--bg-surface-2)] p-3 rounded border border-[var(--border-default)] flex flex-col gap-2 relative">
                      {contact.contact_id.startsWith('temp-') && (
                        <button type="button" onClick={() => setContacts(contacts.filter(c => c.contact_id !== contact.contact_id))} className="absolute top-2 right-2 text-[var(--status-error)] p-1 hover:bg-red-50 rounded"><Trash2 size={14}/></button>
                      )}
                      <div className="grid grid-cols-2 gap-2 pr-6">
                        <Input label={t('contactName')} required value={contact.contact_name} onChange={e => { const n = [...contacts]; n[i].contact_name = e.target.value; setContacts(n); }} />
                        <Input label={t('contactRole')} value={contact.contact_role} onChange={e => { const n = [...contacts]; n[i].contact_role = e.target.value; setContacts(n); }} />
                        <Input label={t('contactEmail')} value={contact.contact_email} onChange={e => { const n = [...contacts]; n[i].contact_email = e.target.value; setContacts(n); }} />
                        <Input label={t('contactTel')} value={contact.contact_tel} onChange={e => { const n = [...contacts]; n[i].contact_tel = e.target.value; setContacts(n); }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </form>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-default)] flex justify-end gap-2 bg-[var(--bg-surface-2)] shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-[var(--border-default)] text-sm font-bold text-[var(--text-secondary)]">{tCommon('cancel')}</button>
          <button type="submit" form="company-form" disabled={saving} className="px-4 py-2 rounded bg-[var(--accent)] text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? t('saving') : t('save')}
          </button>
        </div>
      </div>

      {/* History Modal (Nested) */}
      {historySiteId && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-surface)] w-[600px] max-w-full rounded shadow-xl flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between p-3 border-b border-[var(--border-default)] bg-[var(--bg-surface-2)]">
              <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-sm">
                <History size={16} className="text-[var(--accent)]" /> {t('historyTitle')}
              </div>
              <button onClick={() => setHistorySiteId(null)} className="text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] p-1 rounded"><X size={16}/></button>
            </div>
            <div className="p-4 overflow-auto custom-scrollbar flex-1">
              {loadingHistory ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[var(--accent)]"/></div>
              ) : siteHistory.length === 0 ? (
                <div className="text-center p-4 text-[var(--text-muted)] text-sm">{t('noHistory')}</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {siteHistory.map(log => (
                    <div key={log.log_id} className="border border-[var(--border-subtle)] rounded p-3 text-xs bg-[var(--bg-surface-2)]">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-[var(--accent)]">{log.action}</span>
                        <span className="text-[var(--text-muted)]">{new Date(log.created_at).toLocaleString()}</span>
                      </div>
                      <div className="text-[var(--text-secondary)]">
                        <strong>{t('performedBy')} </strong> {log.employees?.employee_name || t('system')}
                      </div>
                      {log.old_data && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-100 rounded">
                          <strong className="text-red-700">{t('oldData')}</strong>
                          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-[10px]">{JSON.stringify(log.old_data, null, 2)}</pre>
                        </div>
                      )}
                      {log.new_data && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded">
                          <strong className="text-green-700">{t('newData')}</strong>
                          <pre className="mt-1 overflow-x-auto whitespace-pre-wrap text-[10px]">{JSON.stringify(log.new_data, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
