'use client'

import React, { useState } from 'react'
import { Printer, FileDown, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import '../print.css'
import { YSD_COMPANY_INFO } from '@/lib/company'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

export default function ShipmentPrintClient({ initialData }: { initialData: any }) {
  const [exporting, setExporting] = useState(false)

  // Editable fields
  const [deliveryNoteNo, setDeliveryNoteNo] = useState(initialData.delivery_note_no || '')
  const [shipDate, setShipDate] = useState(formatDate(initialData.ship_date))
  const [companyName, setCompanyName] = useState(
    initialData.delivery_sites?.site_name ||
    initialData.orders?.companies?.company_name ||
    initialData.work_orders?.companies?.company_name ||
    ''
  )
  const [orderNo, setOrderNo] = useState(
    initialData.orders?.order_no ||
    initialData.work_orders?.wo_code ||
    ''
  )

  // Extract lines from shipment_lots or work_orders
  const rawLots = initialData.shipment_lots || []
  let defaultLines: any[] = []

  if (rawLots.length > 0) {
    defaultLines = rawLots.map((lot: any) => {
      const po = lot.production_lots?.production_orders
      const ol = po?.order_lines
      const prd = ol?.products
      const productName = prd?.customer_product_name || prd?.product_name || ''
      
      return {
        id: lot.shipment_lot_id,
        productName: productName,
        quantity: String(lot.qty_shipped || 0),
        unit: ol?.unit || 'PCS',
        notes: (lot.production_lots?.lot_no ? `Lot No: ${lot.production_lots.lot_no}` : '') + (lot.carton_count ? ` (${lot.carton_count}箱)` : '')
      }
    })
  } else if (initialData.work_orders) {
    const wo = initialData.work_orders
    const prd = wo.products
    const productName = prd?.product_name || prd?.product_code || wo.wo_name || '成形品'
    defaultLines = [
      {
        id: `wo-${wo.wo_id}`,
        productName: productName,
        quantity: String(initialData.shipped_quantity || 0),
        unit: 'PCS',
        notes: `指示書: ${wo.wo_code}`
      }
    ]
  }

  // Ensure we always have at least 10 rows for the table layout
  const tableRows = [...defaultLines]
  while (tableRows.length < 10) {
    tableRows.push({ id: `empty-${tableRows.length}`, productName: '', quantity: '', unit: '', notes: '' })
  }

  const [lines, setLines] = useState<any[]>(tableRows)

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
        scale: 2,
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
      
      pdf.save(`納品書_${deliveryNoteNo || 'draft'}.pdf`)
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
      {/* ── Action Bar (Hidden on Print) ── */}
      <div className="print-action-bar no-print">
        <Link href="/shipments" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent)', fontSize: 13, textDecoration: 'none' }}>
          <ArrowLeft size={14} /> 出荷一覧に戻る
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
        
        {/* Document Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ width: '40%' }}>
            <div style={{ fontSize: 24, fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: 4, marginBottom: 10, display: 'flex', alignItems: 'baseline' }}>
              <input 
                type="text" 
                className="editable-input" 
                style={{ fontSize: 20, fontWeight: 'bold', width: '85%' }}
                value={companyName} 
                onChange={e => setCompanyName(e.target.value)} 
              /> <span style={{ fontSize: 16 }}>御中</span>
            </div>
            <div style={{ fontSize: 12, marginTop: 10 }}>
              毎度格別のお引き立てを賜り厚く御礼申し上げます。<br/>
              下記の通り納品申し上げますので、ご査収の程よろしくお願い申し上げます。
            </div>
          </div>
          
          <div style={{ width: '45%', textAlign: 'right' }}>
            <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 4, marginBottom: 8 }}>納 品 書</div>
            <div style={{ fontSize: 11, marginBottom: 2 }}>
              伝票番号: <input type="text" className="editable-input font-mono" style={{ width: 140, textAlign: 'right' }} value={deliveryNoteNo} onChange={e => setDeliveryNoteNo(e.target.value)} />
            </div>
            <div style={{ fontSize: 11, marginBottom: 6 }}>
              納品日: <input type="text" className="editable-input" style={{ width: 140, textAlign: 'right' }} value={shipDate} onChange={e => setShipDate(e.target.value)} />
            </div>
            
            {/* Issuer Info */}
            <div style={{ fontSize: 11, lineHeight: 1.4, marginTop: 8 }}>
              <div style={{ fontWeight: 'bold', fontSize: 13 }}>{YSD_COMPANY_INFO.nameJa}</div>
              <div>{YSD_COMPANY_INFO.headOffice.postalCode} {YSD_COMPANY_INFO.headOffice.address}</div>
              <div>TEL: {YSD_COMPANY_INFO.headOffice.tel} / FAX: {YSD_COMPANY_INFO.headOffice.fax}</div>
            </div>
          </div>
        </div>

        {/* Sub Info & Stamps */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
          <div style={{ fontSize: 12 }}>
            <div style={{ marginBottom: 4 }}>
              注文番号: <input type="text" className="editable-input font-mono" style={{ width: 150, fontWeight: 'bold' }} value={orderNo} onChange={e => setOrderNo(e.target.value)} />
            </div>
            <div>
              受渡場所: <input type="text" className="editable-input" style={{ width: 250 }} defaultValue={initialData.delivery_sites?.site_address || '貴社指定場所'} />
            </div>
          </div>

          {/* Stamp Blocks */}
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 50, height: 50, border: '1px solid #000', display: 'flex', flexDirection: 'column' }}>
              <div style={{ borderBottom: '1px solid #000', textAlign: 'center', fontSize: 10, padding: 2 }}>承認</div>
              <div style={{ flex: 1 }}></div>
            </div>
            <div style={{ width: 50, height: 50, border: '1px solid #000', display: 'flex', flexDirection: 'column' }}>
              <div style={{ borderBottom: '1px solid #000', textAlign: 'center', fontSize: 10, padding: 2 }}>担当</div>
              <div style={{ flex: 1 }}></div>
            </div>
            <div style={{ width: 50, height: 50, border: '1px solid #000', display: 'flex', flexDirection: 'column' }}>
              <div style={{ borderBottom: '1px solid #000', textAlign: 'center', fontSize: 10, padding: 2 }}>検印</div>
              <div style={{ flex: 1 }}></div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="print-table" style={{ width: '100%', minHeight: '400px' }}>
          <thead>
            <tr>
              <th style={{ width: 40, textAlign: 'center', backgroundColor: '#f5f5f5' }}>No.</th>
              <th style={{ backgroundColor: '#f5f5f5' }}>品名</th>
              <th style={{ width: 80, textAlign: 'center', backgroundColor: '#f5f5f5' }}>数量</th>
              <th style={{ width: 60, textAlign: 'center', backgroundColor: '#f5f5f5' }}>単位</th>
              <th style={{ width: 200, backgroundColor: '#f5f5f5' }}>備考</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, index) => (
              <tr key={l.id || index} style={{ height: 35 }}>
                <td style={{ textAlign: 'center' }}>{index + 1}</td>
                <td>
                  <input 
                    type="text" 
                    className="editable-input" 
                    value={l.productName} 
                    onChange={e => handleLineChange(index, 'productName', e.target.value)} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="editable-input" 
                    style={{ textAlign: 'right' }}
                    value={l.quantity} 
                    onChange={e => handleLineChange(index, 'quantity', e.target.value)} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="editable-input" 
                    style={{ textAlign: 'center' }}
                    value={l.unit} 
                    onChange={e => handleLineChange(index, 'unit', e.target.value)} 
                  />
                </td>
                <td>
                  <input 
                    type="text" 
                    className="editable-input" 
                    value={l.notes} 
                    onChange={e => handleLineChange(index, 'notes', e.target.value)} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Notes */}
        <div style={{ marginTop: 20, borderTop: '1px solid #000', paddingTop: 8, fontSize: 11 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>【備考・特記事項】</div>
          <div style={{ color: '#444' }}>
            <input 
              type="text" 
              className="editable-input" 
              defaultValue={initialData.notes || '受領印を頂戴できますようお願い申し上げます。'} 
            />
          </div>
        </div>

      </div>
    </div>
  )
}
