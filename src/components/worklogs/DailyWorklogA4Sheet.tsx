'use client'

import React from 'react'
import { Edit3, Trash2 } from 'lucide-react'

export type NippoItem = {
  log_id?: string
  work_date?: string
  job_id?: string
  processing_code_id?: number | null
  model_code?: string
  processing_name?: string
  notes?: string
  hours_spent?: number | null
  price_value?: string
}

export interface DailyWorklogA4SheetProps {
  workDate: string
  workerName: string
  totalHours: number
  items: NippoItem[]
  scale?: number
  stampUrl?: string
  hidePriceTableInPreview?: boolean
  onEditItem?: (item: NippoItem) => void
  onDeleteItem?: (logId: string) => void
}

export const PRICE_MAP: Record<string, string> = {}

export function DailyWorklogA4Sheet({
  workDate,
  workerName,
  totalHours,
  items,
  scale = 1.0,
  stampUrl,
  hidePriceTableInPreview = false,
  onEditItem,
  onDeleteItem,
}: DailyWorklogA4SheetProps) {
  const dateObj = new Date(workDate)
  const yearStr = !isNaN(dateObj.getFullYear()) ? String(dateObj.getFullYear()) : ''
  const monthStr = !isNaN(dateObj.getMonth()) ? String(dateObj.getMonth() + 1) : ''
  const dayStr = !isNaN(dateObj.getDate()) ? String(dateObj.getDate()) : ''

  // Exactly 10 table rows to match Nippo7 template
  const TOTAL_DATA_ROWS = 10
  const displayRows: NippoItem[] = [...items]
  while (displayRows.length < TOTAL_DATA_ROWS) {
    displayRows.push({
      log_id: `empty-${displayRows.length}`,
      model_code: '',
      processing_name: '',
      notes: '',
      hours_spent: null,
      price_value: '',
    })
  }

  return (
    <div
      className="nippo-a4-sheet"
      style={{
        width: '277mm',
        minHeight: '190mm',
        background: '#ffffff',
        padding: '22mm 10mm 20mm 10mm',
        boxSizing: 'border-box',
        fontFamily: '"MS PGothic", "Meiryo", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif',
        color: '#000000',
        transform: scale !== 1.0 ? `scale(${scale})` : undefined,
        transformOrigin: 'top left',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '8px',
      }}
    >
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .nippo-row-actions {
            display: none !important;
          }
          .nippo-data-row {
            background-color: transparent !important;
          }
          .nippo-price-table-section {
            display: grid !important;
          }
        }
        .nippo-data-row:hover {
          background-color: rgba(13, 148, 136, 0.06);
        }
        .nippo-data-row:hover .nippo-row-actions {
          opacity: 1 !important;
        }
      `}</style>

      {/* ── 1. TOP HEADER BOX (Two-Tier Structure: Title+Stamp / Divider / Metadata) ── */}
      <div
        style={{
          border: '1.5px solid #000000',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Tier 1: Title + Stamp Box */}
        <div
          style={{
            position: 'relative',
            height: '62px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Form Title Centered */}
          <span
            style={{
              fontSize: '22px',
              fontWeight: 'bold',
              letterSpacing: '4px',
            }}
          >
            日 報 記 録 書 【 設計＆金型部門 】
          </span>

          {/* Stamp Box (Top Right, resting exactly on divider - nearly square) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              width: '68px',
              borderLeft: '1.5px solid #000000',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: '10.5px',
                textAlign: 'center',
                borderBottom: '1px solid #000000',
                padding: '2px 0',
                fontWeight: 'normal',
                lineHeight: '1.2',
              }}
            >
              確認印
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {stampUrl && (
                <img
                  src={stampUrl}
                  alt="確認印"
                  style={{
                    width: '38px',
                    height: '38px',
                    objectFit: 'contain',
                    transform: 'rotate(-4deg)',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Full-width Divider Line */}
        <div style={{ borderTop: '1.5px solid #000000', width: '100%' }}></div>

        {/* Tier 2: Metadata Row (Unobstructed full width below divider) */}
        <div
          style={{
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            padding: '0 16px',
          }}
        >
          {/* Work Date */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 'normal' }}>作業日：</span>
            <span style={{ minWidth: '42px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '13.5px' }}>
              {yearStr}
            </span>
            <span style={{ margin: '0 2px' }}>年</span>
            <span style={{ minWidth: '26px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '13.5px' }}>
              {monthStr}
            </span>
            <span style={{ margin: '0 2px' }}>月</span>
            <span style={{ minWidth: '26px', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', fontSize: '13.5px' }}>
              {dayStr}
            </span>
            <span style={{ marginLeft: '2px' }}>日</span>
          </div>

          {/* Worker Name */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 'normal' }}>作業者：</span>
            <span
              style={{
                display: 'inline-block',
                minWidth: '200px',
                borderBottom: '1.2px solid #000000',
                padding: '0 12px 1px 12px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '14px',
              }}
            >
              {workerName || '　'}
            </span>
          </div>

          {/* Working Hours */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 'normal' }}>労働時間：</span>
            <span
              style={{
                display: 'inline-block',
                minWidth: '70px',
                borderBottom: '1.2px solid #000000',
                padding: '0 6px 1px 6px',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                fontFamily: 'monospace',
              }}
            >
              {totalHours > 0 ? totalHours : '　'}
            </span>
            <span style={{ marginLeft: '4px', fontWeight: 'normal' }}>H</span>
          </div>
        </div>
      </div>

      {/* ── 2. TABLE SECTION 【作業項目】 ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px', paddingLeft: '2px' }}>
          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
            【作業項目】
          </div>
          {onEditItem && (
            <div className="nippo-row-actions" style={{ fontSize: '10.5px', color: '#64748b', fontStyle: 'italic' }}>
              ※ 行をクリックして内容・作業日・工数を直接編集できます
            </div>
          )}
        </div>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '11.5px',
            border: '1.2px solid #000000',
          }}
        >
          <thead>
            <tr style={{ height: '26px' }}>
              <th
                style={{
                  border: '1px solid #000000',
                  width: '16%',
                  fontWeight: 'normal',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '2px 4px',
                }}
              >
                型　番
              </th>
              <th
                style={{
                  border: '1px solid #000000',
                  width: '18%',
                  fontWeight: 'normal',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '2px 4px',
                }}
              >
                作業内容
              </th>
              <th
                style={{
                  border: '1px solid #000000',
                  width: '42%',
                  fontWeight: 'normal',
                  fontSize: '11px',
                  textAlign: 'left',
                  padding: '2px 8px',
                }}
              >
                備考欄(詳細報告がある場合は、記載してください）（ショット数なども）
              </th>
              <th
                style={{
                  border: '1px solid #000000',
                  width: '12%',
                  fontWeight: 'normal',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '2px 4px',
                }}
              >
                作業時間
              </th>
              <th
                style={{
                  border: '1px solid #000000',
                  width: '12%',
                  fontWeight: 'normal',
                  fontSize: '12px',
                  textAlign: 'center',
                  padding: '2px 4px',
                }}
              >
                付加価値(金額)
              </th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, idx) => {
              const hasData = !!row.model_code || !!row.processing_name || !!row.hours_spent
              const isActualLog = hasData && row.log_id && !row.log_id.startsWith('empty-')

              return (
                <tr
                  key={row.log_id || `empty-${idx}`}
                  className={isActualLog ? 'nippo-data-row' : ''}
                  style={{
                    height: '31px',
                    cursor: isActualLog && onEditItem ? 'pointer' : 'default',
                    position: 'relative',
                    transition: 'background-color 0.15s ease',
                  }}
                  onClick={() => {
                    if (isActualLog && onEditItem) {
                      onEditItem(row)
                    }
                  }}
                  title={isActualLog && onEditItem ? 'クリックしてこの行を編集' : undefined}
                >
                  <td
                    style={{
                      border: '1px solid #000000',
                      textAlign: 'center',
                      padding: '2px 4px',
                      fontWeight: hasData ? 'bold' : 'normal',
                      fontSize: '12px',
                      fontFamily: row.model_code && row.model_code !== '社内作業' ? 'monospace' : 'inherit',
                    }}
                  >
                    {row.model_code || ''}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000000',
                      textAlign: 'left',
                      padding: '2px 8px',
                      fontSize: '11.5px',
                    }}
                  >
                    {row.processing_name || ''}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000000',
                      textAlign: 'left',
                      padding: '2px 8px',
                      fontSize: '11px',
                      color: '#000000',
                    }}
                  >
                    {row.notes || ''}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000000',
                      textAlign: 'center',
                      padding: '2px 4px',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {row.hours_spent ? `${row.hours_spent} H` : ''}
                  </td>
                  <td
                    style={{
                      border: '1px solid #000000',
                      textAlign: 'right',
                      padding: '2px 8px',
                      fontSize: '11px',
                      position: 'relative',
                    }}
                  >
                    <span>{row.price_value || ''}</span>

                    {/* Hover Action Buttons in Web View (Hidden in Print) */}
                    {isActualLog && (onEditItem || onDeleteItem) && (
                      <div
                        className="nippo-row-actions"
                        style={{
                          position: 'absolute',
                          right: '4px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          opacity: 0,
                          transition: 'opacity 0.15s ease',
                          background: '#fff',
                          padding: '1px 3px',
                          borderRadius: '3px',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                          border: '1px solid #cbd5e1',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {onEditItem && (
                          <button
                            type="button"
                            onClick={() => onEditItem(row)}
                            title="この行を編集"
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              color: '#0d9488',
                              display: 'flex',
                            }}
                          >
                            <Edit3 size={12} />
                          </button>
                        )}
                        {onDeleteItem && (
                          <button
                            type="button"
                            onClick={() => {
                              if (row.log_id) onDeleteItem(row.log_id)
                            }}
                            title="この行を削除"
                            style={{
                              border: 'none',
                              background: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              color: '#ef4444',
                              display: 'flex',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}

            {/* Total Row */}
            <tr style={{ height: '28px', fontWeight: 'bold' }}>
              <td
                colSpan={3}
                style={{
                  border: '1px solid #000000',
                  textAlign: 'right',
                  padding: '2px 24px',
                  fontSize: '12px',
                  letterSpacing: '14px',
                }}
              >
                合　計
              </td>
              <td
                style={{
                  border: '1px solid #000000',
                  textAlign: 'center',
                  padding: '2px 4px',
                  fontSize: '12.5px',
                  fontFamily: 'monospace',
                }}
              >
                {totalHours > 0 ? `${totalHours} H` : ''}
              </td>
              <td
                style={{
                  border: '1px solid #000000',
                  textAlign: 'center',
                  padding: '2px 4px',
                }}
              ></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── 3. BOTTOM REFERENCE PRICE TABLES (Exact Nippo7 Alignment) ── */}
      <div
        className="nippo-price-table-section"
        style={{
          display: hidePriceTableInPreview ? 'none' : 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '24px',
          marginTop: '6px',
          fontSize: '10px',
          lineHeight: '1.45',
          color: '#000000',
        }}
      >
        {/* Column 1: Design Department Standards */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>設計</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥30,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>プラグ演算＆加工</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥10,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '8px' }}>
            <span>試作プラグ演算＆加工</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥5,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>金型演算＆加工</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥30,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '8px' }}>
            <span>試作金型演算＆加工</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥10,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px' }}>
            <span>配送</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>3～5,000円</span>
            <span style={{ textAlign: 'center' }}>1回</span>
          </div>
        </div>

        {/* Column 2: Mold Department Standards */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', fontWeight: 'bold', marginBottom: '2px' }}>
            <span></span>
            <span style={{ textAlign: 'right', borderBottom: '0.8px solid #000' }}>単価</span>
            <span style={{ textAlign: 'center', borderBottom: '0.8px solid #000' }}>単位</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>本型穴あけ</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥3,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>本型ミガキ</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥3,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '8px' }}>
            <span>試作穴あけ</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥1,500</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>試作ミガキ</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥1,500</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>本型ネル貼り</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥5,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '8px' }}>
            <span>試作ネル貼り</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥2,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px' }}>
            <span>プレス応援</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥10</span>
            <span style={{ textAlign: 'center' }}>ショット</span>
          </div>
        </div>

        {/* Column 3: Handcrafted Plug & Other Operations */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', fontWeight: 'bold', marginBottom: '2px' }}>
            <span></span>
            <span style={{ textAlign: 'right', borderBottom: '0.8px solid #000' }}>単価</span>
            <span style={{ textAlign: 'center', borderBottom: '0.8px solid #000' }}>単位</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>本型手造りプラグ</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥10,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '8px' }}>
            <span>試作手造りプラグ</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥5,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>材料出し</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥4,000</span>
            <span style={{ textAlign: 'center' }}>1回</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>出荷作業</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥4,000</span>
            <span style={{ textAlign: 'center' }}>1回</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>出荷応援</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥2,000</span>
            <span style={{ textAlign: 'center' }}>1回</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px', marginBottom: '2px' }}>
            <span>検査</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥3,000</span>
            <span style={{ textAlign: 'center' }}>1機種</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 35px' }}>
            <span>成形補助</span>
            <span style={{ textAlign: 'right', fontFamily: 'monospace' }}>¥2,000</span>
            <span style={{ textAlign: 'center' }}>1時間</span>
          </div>
        </div>
      </div>
    </div>
  )
}
