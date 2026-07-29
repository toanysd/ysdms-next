'use client'

import { useTranslations } from 'next-intl'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Printer, FileDown, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './print.css'
import { YSD_COMPANY_INFO } from '@/lib/company'

// ── Helpers ──
function parseMaterialNotes(notes: string | null) {
  if (!notes) return { material: '', thickness: '', width: '', staticCharge: '無', silicone: '無', coating: '無' }
  const matMatch = notes.match(/(PS|PP|PET|A-PET|PVC)/i)
  const material = matMatch ? matMatch[0] : ''
  const colorMatch = notes.match(/(黒|白|透明|クリア|ナチュラル|乳白)/)
  const color = colorMatch ? colorMatch[0] : ''
  const thickMatch = notes.match(/(\d+(?:\.\d+)?)\s*(?:㎜|mm|t)/i)
  const thickness = thickMatch ? thickMatch[1] : ''
  const widthMatch = notes.match(/(?:【|\[)(\d+)(?:】|\])/) || notes.match(/(\d+)\s*(?:w|巾)/i)
  const width = widthMatch ? widthMatch[1] : ''
  
  const antistatic = (notes.includes('導電') || notes.includes('帯電') || notes.includes('静電')) ? '帯電防止' : '無'
  const silicone = (notes.includes('シリコン') || notes.includes('ｼﾘｺﾝ')) ? '有' : '無'
  const coating = notes.includes('塗布') ? '有' : '無'

  return {
    material: material + (color ? `(${color})` : ''),
    thickness,
    width,
    staticCharge: antistatic,
    silicone,
    coating
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

function addDays(dateStr: string | null, days: number): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function OrderPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  // ── States for all editable fields ──
  const [orderNo, setOrderNo] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const [companyNameHeader, setCompanyNameHeader] = useState('')
  
  const [isSingleCavity, setIsSingleCavity] = useState(false)
  const [hasSeparateCutter, setHasSeparateCutter] = useState(false)
  const [hasBagPacking, setHasBagPacking] = useState(false)

  const [customerOrderNo, setCustomerOrderNo] = useState('')
  const [lines, setLines] = useState<any[]>([])

  const [packingNotes, setPackingNotes] = useState('')
  const [specialNotes, setSpecialNotes] = useState('')

  // Specs
  const [designLength, setDesignLength] = useState(0)
  const [designWidth, setDesignWidth] = useState(0)
  const [cutlineLength, setCutlineLength] = useState('')
  const [cutlineWidth, setCutlineWidth] = useState('')
  const [toleranceX, setToleranceX] = useState('±0.5')
  const [toleranceY, setToleranceY] = useState('±0.5')
  const [tolerancePitch, setTolerancePitch] = useState('±0.3')
  const [designWeight, setDesignWeight] = useState('0.0 g')
  const [cavityCount, setCavityCount] = useState(1)

  // Delivery / Request
  const [siteCode, setSiteCode] = useState('')
  const [siteName, setSiteName] = useState('')
  const [siteContact, setSiteContact] = useState('')
  const [siteAddress, setSiteAddress] = useState('')
  const [siteTel, setSiteTel] = useState('')
  
  const [reqCompanyCode, setReqCompanyCode] = useState('')
  const [reqCompanyName, setReqCompanyName] = useState('')

  // Stamp Box
  const [stampSiteCode, setStampSiteCode] = useState('')
  const [stampDept, setStampDept] = useState('')
  const [stampCompName, setStampCompName] = useState('')

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()
      const { data, error } = await (supabase as any)
        .from('orders')
        .select(`
          *,
          companies ( company_code, company_name, address, tel ),
          order_lines (
            *,
            products ( product_id, product_code, product_name, product_name_internal, pocket_count, pieces_per_box, box_spec, notes ),
            design_revisions (
              *,
              plastic_master ( plastic_code, plastic_family, thickness_mm, width_mm, color_name_normalized )
            )
          )
        `)
        .eq('order_id', id)
        .single()
      
      if (error) {
        console.error('Fetch Error:', error)
        setError(`${error.message} (Code: ${error.code})`)
        setLoading(false)
        return
      }
      
      if (data) {
        setOrder(data)
        setOrderNo(data.order_no || '')
        setOrderDate(formatDate(data.order_date))
        setCompanyNameHeader(data.companies?.company_name || '')
        setCustomerOrderNo(data.customer_order_no || '')

        // Fetch Design Revisions separately, order by created_at DESC to get the latest one
        const linesData = data.order_lines || []
        const productIds = linesData.map((l: any) => l.products?.product_id).filter(Boolean)
        let activeRev: any = null
        
        if (productIds.length > 0) {
          const { data: revs } = await (supabase as any)
            .from('design_revisions')
            .select(`
              product_id, design_code, cutline_length, cutline_width, cavity_count,
              orientation, design_weight, has_separate_cutter, setup_type,
              customer_tray_name, drawing_pdf_path, legacy_specs, plastic_type_designed,
              design_length, design_width, tolerance_x, tolerance_y, tolerance_pitch, created_at
            `)
            .in('product_id', productIds)
            .order('created_at', { ascending: false })

          if (revs && revs.length > 0) {
            activeRev = revs[0] // pick the latest revision
            
            setDesignLength(activeRev.design_length || 0)
            setDesignWidth(activeRev.design_width || 0)
            setCutlineLength(activeRev.cutline_length ? String(activeRev.cutline_length) : '')
            setCutlineWidth(activeRev.cutline_width ? String(activeRev.cutline_width) : '')
            setToleranceX(activeRev.tolerance_x || '±0.5')
            setToleranceY(activeRev.tolerance_y || '±0.5')
            setTolerancePitch(activeRev.tolerance_pitch || '±0.3')
            setDesignWeight(activeRev.design_weight || '0.0 g')
            setCavityCount(activeRev.cavity_count || 1)

            setIsSingleCavity(activeRev.cavity_count === 1)
            setHasSeparateCutter(activeRev.has_separate_cutter === true)
          }
        }

        // Fetch Delivery Sites separately
        const siteIds = linesData.map((l: any) => l.delivery_site_id).filter(Boolean)
        let deliverySite: any = null
        if (siteIds.length > 0) {
          const { data: sites } = await (supabase as any)
            .from('delivery_sites')
            .select('site_id, site_code, site_name, contact_person, site_address, site_tel')
            .in('site_id', siteIds)
          
          if (sites && sites.length > 0) {
            deliverySite = sites[0]
            setSiteCode(deliverySite.site_code || '')
            setSiteName(deliverySite.site_name || '')
            setSiteContact(deliverySite.contact_person ? `${deliverySite.contact_person} 様宛` : '')
            setSiteAddress(deliverySite.site_address || '')
            setSiteTel(deliverySite.site_tel || '')

            setStampSiteCode(deliverySite.site_code || '')
            setStampCompName(deliverySite.site_name || '')
          }
        }

        // Checkboxes from order notes
        const firstLine = linesData[0]
        const orderNotes = data.notes || ''
        if (orderNotes.includes('1面取') || activeRev?.cavity_count === 1) setIsSingleCavity(true)
        if (orderNotes.includes('別抜き') || activeRev?.has_separate_cutter === true) setHasSeparateCutter(true)
        if (orderNotes.includes('袋詰め') || firstLine?.products?.box_spec?.includes('袋')) setHasBagPacking(true)

        // Populate lines
        const populated = linesData.map((l: any, index: number) => {
          // Resolve material spec
          let mat = { material: '', thickness: '', width: '', staticCharge: '無', silicone: '無', coating: '無' }
          const rev = l.design_revisions
          const pm = rev?.plastic_master
          if (pm) {
            const family = pm.plastic_family || ''
            const colorVal = pm.color_name_normalized || ''
            mat = {
              material: family + (colorVal && colorVal !== 'TBA' ? `(${colorVal})` : ''),
              thickness: pm.thickness_mm != null ? String(pm.thickness_mm) : '',
              width: pm.width_mm != null ? String(pm.width_mm) : '',
              staticCharge: family.includes('帯電') || pm.plastic_code?.includes('E') ? '有' : '無',
              silicone: family.includes('シリコン') || pm.plastic_code?.includes('S') ? '有' : '無',
              coating: '無'
            }
          } else {
            // Try parsing notes fallback
            mat = parseMaterialNotes(l.products?.notes)
          }

          // Build P/N string: Name + CustomerName + PocketCount
          const name = l.products?.product_name || ''
          const customerName = l.products?.customer_product_name || ''
          const pockets = l.products?.pocket_count ? `${l.products.pocket_count}P` : ''
          const pn = [name, customerName, pockets].filter(Boolean).join(' ')

          // Calculate ship_date as due_date - 1 day if ship_date is null
          let ship = l.ship_date
          if (!ship && l.due_date) {
            ship = addDays(l.due_date, -1)
          }

          return {
            id: l.line_id,
            pn,
            name: l.products?.product_name || '',
            quantity: String(l.quantity || 0),
            unit: l.unit || 'PCS',
            packing: l.notes || 'LT',
            shipDate: ship ? formatDate(ship) : '',
            dueDate: l.due_date ? formatDate(l.due_date) : '',
            ...mat
          }
        })
        setLines(populated)

        // Packing notes derivation
        let derivedPackNotes = ''
        if (firstLine?.products?.notes && firstLine.products.notes.includes('梱包')) {
          derivedPackNotes += firstLine.products.notes + '\n'
        }
        if (firstLine?.products?.pieces_per_box) {
          derivedPackNotes += `入数：${firstLine.products.pieces_per_box}個/${firstLine.products.box_spec || '箱'}\n`
        }
        if (firstLine?.products?.pocket_count) {
          derivedPackNotes += `ポケット数：${firstLine.products.pocket_count}\n`
        }
        setPackingNotes(derivedPackNotes.trim())

        setSpecialNotes(data.notes || '')
        setReqCompanyCode(data.companies?.company_code || '')
        setReqCompanyName(data.companies?.company_name || '')
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  if (loading) return <div style={{ padding: 20 }}>読み込み中...</div>
  if (error) return <div style={{ padding: 20, color: 'red' }}>エラーが発生しました: {error}</div>
  if (!order) return <div style={{ padding: 20 }}>受注が見つかりません。</div>

  const handleLineChange = (index: number, key: string, value: string) => {
    setLines(prev => {
      const copy = [...prev]
      copy[index] = { ...copy[index], [key]: value }
      return copy
    })
  }

  const handleExportPDF = async () => {
    const element = document.querySelector('.print-page') as HTMLElement
    if (!element || exporting) return
    setExporting(true)
    element.classList.add('pdf-exporting')
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,           // 2x resolution
        useCORS: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        windowWidth: 860,
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfW = 210
      const pdfH = 297
      const imgW = pdfW
      const imgH = (canvas.height * pdfW) / canvas.width
      
      let heightLeft = imgH
      let position = 0

      pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH)
      heightLeft -= pdfH

      while (heightLeft > 0) {
        position = heightLeft - imgH
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgW, imgH)
        heightLeft -= pdfH
      }
      
      pdf.save(`注文書_${orderNo || 'draft'}.pdf`)
    } catch (e) {
      console.error(e)
      alert('PDF出力に失敗しました')
    } finally {
      element.classList.remove('pdf-exporting')
      setExporting(false)
    }
  }

  return (
    <div className="print-container">
      {/* ── Action Buttons (Hidden on Print) ── */}
      <div className="print-action-bar no-print">
        <Link href={`/orders/${order.order_id}`} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>
          <ArrowLeft size={14} /> 受注詳細に戻る
        </Link>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary" onClick={() => window.print()} disabled={exporting} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Printer size={16} /> 印刷
        </button>
        <button className="btn btn-secondary" onClick={handleExportPDF} disabled={exporting} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <FileDown size={16} /> {exporting ? '出力中...' : 'PDF出力'}
        </button>
      </div>

      {/* ── Print Page ── */}
      <div className="print-page">
        <div className="print-title">
          注 文 書 ／ 納 入 指 示 書 ( 成 形 ）
        </div>

        <div className="print-header">
          {/* Left: Checkboxes */}
          <div>
            <div className="print-checkbox-area">
              <div 
                className={`print-checkbox-item ${isSingleCavity ? 'checked' : ''}`}
                onClick={() => setIsSingleCavity(!isSingleCavity)}
              >
                1面取
              </div>
              <div 
                className={`print-checkbox-item ${hasSeparateCutter ? 'checked' : ''}`}
                onClick={() => setHasSeparateCutter(!hasSeparateCutter)}
              >
                別抜き
              </div>
            </div>
            <div className="print-checkbox-area">
              <div 
                className={`print-checkbox-item ${hasBagPacking ? 'checked' : ''}`}
                onClick={() => setHasBagPacking(!hasBagPacking)}
              >
                袋詰め
              </div>
            </div>
          </div>

          {/* Center: YSD Logo */}
          <div className="print-logo-area">
            <div style={{ width: 40, height: 40, border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 16 }}>
              YSD
            </div>
            <div className="print-logo-text">
              <div className="en">{YSD_COMPANY_INFO.nameEn}</div>
              <div className="ja">{YSD_COMPANY_INFO.nameJa}</div>
            </div>
          </div>

          {/* Right: Info box */}
          <div className="print-info-box">
            <div className="addressee">
              <input 
                type="text" 
                className="editable-input" 
                style={{ fontWeight: 'bold', fontSize: 14 }}
                value={companyNameHeader} 
                onChange={e => setCompanyNameHeader(e.target.value)} 
              /> 御中
            </div>
            <table className="print-table" style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <th style={{ width: 100 }}>伝票／LOT No.</th>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={orderNo} 
                      onChange={e => setOrderNo(e.target.value)} 
                    />
                  </td>
                </tr>
                <tr>
                  <th>発注／手配日</th>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={orderDate} 
                      onChange={e => setOrderDate(e.target.value)} 
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="print-greeting">
          下記の通り納入願います。<br />
          尚、納期回答につきましてはREFAXにてお願い致します。
        </div>

        {/* --- LINES --- */}
        {lines.map((l, index) => (
          <div key={l.id || index} className="print-order-block">
            <table className="print-table" style={{ marginBottom: -1 }}>
              <thead>
                <tr>
                  <th style={{ width: 120 }}>要求No.</th>
                  <th>P/N　　　品　名</th>
                  <th style={{ width: 70 }}>数 量</th>
                  <th style={{ width: 80 }}>荷姿</th>
                  <th style={{ width: 100 }}>納期</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    {index === 0 ? (
                      <input 
                        type="text" 
                        className="editable-input" 
                        value={customerOrderNo} 
                        onChange={e => setCustomerOrderNo(e.target.value)} 
                      />
                    ) : (
                      ''
                    )}
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      style={{ fontWeight: 'bold' }}
                      value={l.pn} 
                      onChange={e => handleLineChange(index, 'pn', e.target.value)} 
                    />
                  </td>
                  <td rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        className="editable-input" 
                        style={{ width: '60px', textAlign: 'right' }}
                        value={l.quantity} 
                        onChange={e => handleLineChange(index, 'quantity', e.target.value)} 
                      />
                      <input 
                        type="text" 
                        className="editable-input" 
                        style={{ width: '30px' }}
                        value={l.unit} 
                        onChange={e => handleLineChange(index, 'unit', e.target.value)} 
                      />
                    </div>
                  </td>
                  <td rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.packing} 
                      onChange={e => handleLineChange(index, 'packing', e.target.value)} 
                    />
                  </td>
                  <td rowSpan={2} style={{ textAlign: 'center', verticalAlign: 'middle', fontSize: 10 }}>
                    <input 
                      type="text" 
                      className="editable-input" 
                      style={{ borderBottom: '1px solid #ddd' }}
                      value={l.shipDate} 
                      onChange={e => handleLineChange(index, 'shipDate', e.target.value)} 
                    />
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.dueDate} 
                      onChange={e => handleLineChange(index, 'dueDate', e.target.value)} 
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.name} 
                      onChange={e => handleLineChange(index, 'name', e.target.value)} 
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            
            <table className="print-table">
              <thead>
                <tr>
                  <th>材質</th>
                  <th style={{ width: '12%' }}>厚み</th>
                  <th style={{ width: '12%' }}>巾</th>
                  <th style={{ width: '15%' }}>帯電</th>
                  <th style={{ width: '15%' }}>ｼﾘｺﾝ</th>
                  <th style={{ width: '15%' }}>塗布</th>
                </tr>
              </thead>
              <tbody>
                <tr className="print-material-row">
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.material} 
                      onChange={e => handleLineChange(index, 'material', e.target.value)} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.thickness} 
                      onChange={e => handleLineChange(index, 'thickness', e.target.value)} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.width} 
                      onChange={e => handleLineChange(index, 'width', e.target.value)} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.staticCharge} 
                      onChange={e => handleLineChange(index, 'staticCharge', e.target.value)} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.silicone} 
                      onChange={e => handleLineChange(index, 'silicone', e.target.value)} 
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={l.coating} 
                      onChange={e => handleLineChange(index, 'coating', e.target.value)} 
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}

        {/* --- NOTES --- */}
        <div className="print-notes-section" style={{ border: '1px solid #000' }}>
          <div className="print-notes-label">梱包注意:</div>
          <textarea 
            className="editable-input" 
            style={{ width: '100%', minHeight: '40px', resize: 'vertical' }}
            value={packingNotes} 
            onChange={e => setPackingNotes(e.target.value)} 
          />
        </div>

        {specialNotes && (
          <div className="print-notes-section" style={{ border: '1px solid #000', marginTop: 4 }}>
            <div className="print-notes-label">特記事項:</div>
            <textarea 
              className="editable-input" 
              style={{ width: '100%', minHeight: '30px', resize: 'vertical' }}
              value={specialNotes} 
              onChange={e => setSpecialNotes(e.target.value)} 
            />
          </div>
        )}

        {/* --- SKETCH & specs --- */}
        <div className="print-sketch-area">
          <div className="print-sketch-box">
            {/* Beautiful SVG diagram of the tray with tolerance */}
            <svg width="100%" height="100%" viewBox="0 0 200 130">
              {/* Tray outline */}
              <rect x="30" y="15" width="130" height="90" fill="none" stroke="#000" strokeWidth="1" />
              {/* Pocket grids */}
              <line x1="62" y1="15" x2="62" y2="105" stroke="#ddd" strokeDasharray="2,2" />
              <line x1="95" y1="15" x2="95" y2="105" stroke="#ddd" strokeDasharray="2,2" />
              <line x1="128" y1="15" x2="128" y2="105" stroke="#ddd" strokeDasharray="2,2" />
              <line x1="30" y1="45" x2="160" y2="45" stroke="#ddd" strokeDasharray="2,2" />
              <line x1="30" y1="75" x2="160" y2="75" stroke="#ddd" strokeDasharray="2,2" />

              {/* Length arrows left side */}
              <line x1="15" y1="15" x2="15" y2="105" stroke="#000" strokeWidth="0.8" />
              <polygon points="15,15 12,20 18,20" fill="#000" />
              <polygon points="15,105 12,100 18,100" fill="#000" />
              
              {/* Width arrows bottom side */}
              <line x1="30" y1="118" x2="160" y2="118" stroke="#000" strokeWidth="0.8" />
              <polygon points="30,118 35,115 35,121" fill="#000" />
              <polygon points="160,118 155,115 155,121" fill="#000" />
            </svg>
            <div style={{ position: 'absolute', left: 2, top: '45%', fontSize: 8, transform: 'rotate(-90deg)', transformOrigin: 'left center' }}>
              長手: {designLength} ({toleranceX})
            </div>
            <div style={{ position: 'absolute', bottom: 2, left: '40%', fontSize: 8 }}>
              短手: {designWidth} ({toleranceY})
            </div>
            <div style={{ position: 'absolute', top: 5, right: 5, fontSize: 8 }}>
              P: {tolerancePitch}
            </div>
            <div style={{ position: 'absolute', top: '45%', left: '45%', fontSize: 9, color: '#999' }}>
              包装外方 ↗
            </div>
          </div>

          <div className="print-specs-box">
            <table className="print-table" style={{ width: 280 }}>
              <tbody>
                <tr>
                  <th style={{ width: 90 }}>CUT LINE</th>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={cutlineWidth} 
                      onChange={e => setCutlineWidth(e.target.value)} 
                    />
                  </td>
                  <td style={{ textAlign: 'center', width: 20 }}>×</td>
                  <td style={{ textAlign: 'center' }}>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={cutlineLength} 
                      onChange={e => setCutlineLength(e.target.value)} 
                    />
                  </td>
                </tr>
                <tr>
                  <th>重量</th>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={designWeight} 
                      onChange={e => setDesignWeight(e.target.value)} 
                    />
                  </td>
                </tr>
                <tr>
                  <th>面数</th>
                  <td colSpan={3} style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <input 
                        type="number" 
                        className="editable-input" 
                        style={{ width: '40px', textAlign: 'right' }}
                        value={cavityCount} 
                        onChange={e => setCavityCount(Number(e.target.value))} 
                      />面
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* --- DELIVERY --- */}
        <div className="print-delivery-section">
          <table className="print-table">
            <tbody>
              <tr>
                <td className="label-cell" rowSpan={5}>納品先</td>
                <td className="site-cell" style={{ fontWeight: 'bold' }}>
                  <input 
                    type="text" 
                    className="editable-input" 
                    value={siteCode} 
                    onChange={e => setSiteCode(e.target.value)} 
                  />
                </td>
                <td className="label-cell" rowSpan={5}>依頼元</td>
                <td>
                  <input 
                    type="text" 
                    className="editable-input" 
                    value={reqCompanyCode} 
                    onChange={e => setReqCompanyCode(e.target.value)} 
                  />
                </td>
              </tr>
              <tr>
                <td className="site-cell">
                  <input 
                    type="text" 
                    className="editable-input" 
                    value={siteName} 
                    onChange={e => setSiteName(e.target.value)} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="editable-input" 
                    value={reqCompanyName} 
                    onChange={e => setReqCompanyName(e.target.value)} 
                  />
                </td>
              </tr>
              <tr>
                <td className="site-cell">
                  <input 
                    type="text" 
                    className="editable-input" 
                    value={siteContact} 
                    onChange={e => setSiteContact(e.target.value)} 
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td className="site-cell">
                  <input 
                    type="text" 
                    className="editable-input" 
                    value={siteAddress} 
                    onChange={e => setSiteAddress(e.target.value)} 
                  />
                </td>
                <td></td>
              </tr>
              <tr>
                <td className="site-cell">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    TEL: 
                    <input 
                      type="text" 
                      className="editable-input" 
                      value={siteTel} 
                      onChange={e => setSiteTel(e.target.value)} 
                    />
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* --- STAMP BOX --- */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '6px 0' }}>
          <div className="print-stamp-box">
            <div className="print-stamp-input-area" style={{ width: '150px' }}>
              <input 
                type="text" 
                className="editable-input" 
                style={{ fontSize: 11, textAlign: 'center' }}
                value={stampSiteCode} 
                onChange={e => setStampSiteCode(e.target.value)} 
              />
              <input 
                type="text" 
                className="editable-input" 
                style={{ fontSize: 11, textAlign: 'center', fontWeight: 'normal' }}
                value={stampDept} 
                onChange={e => setStampDept(e.target.value)} 
                placeholder="部門名 / 締日"
              />
              <input 
                type="text" 
                className="editable-input" 
                style={{ fontSize: 11, textAlign: 'center', fontWeight: 'normal' }}
                value={stampCompName} 
                onChange={e => setStampCompName(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="print-footer-note">
          各部門の担当者は処理後、サイン又は捺印し速やかに次の部門へ配布願います。
        </div>
        <table className="print-sign-table">
          <thead>
            <tr>
              <th>総務</th>
              <th>成形</th>
              <th>プレス</th>
              <th>総務</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div style={{ clear: 'both' }} />
      </div>
    </div>
  )
}
