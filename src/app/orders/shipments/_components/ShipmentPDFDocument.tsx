import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Font,
} from '@react-pdf/renderer'

const isServer = typeof window === 'undefined'
const fontSrcRegular = isServer
  ? (process.cwd() + '/public/fonts/NotoSansJP-Regular.otf')
  : '/fonts/NotoSansJP-Regular.otf'
const fontSrcBold = isServer
  ? (process.cwd() + '/public/fonts/NotoSansJP-Bold.otf')
  : '/fonts/NotoSansJP-Bold.otf'

Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: fontSrcRegular, fontWeight: 400 },
    { src: fontSrcBold, fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    fontSize: 9,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 28,
    backgroundColor: '#ffffff',
    lineHeight: 1.3,
    color: '#1e293b',
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    padding: 12,
    marginBottom: 16,
    borderRadius: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 4,
    color: '#0f172a',
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a',
    paddingBottom: 2,
  },
  customerBox: {
    width: '55%',
    borderBottomWidth: 1,
    borderBottomColor: '#64748b',
    paddingBottom: 4,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 2,
  },
  deliverySiteName: {
    fontSize: 9.5,
    color: '#334155',
    marginBottom: 2,
  },
  companyInfoBox: {
    width: '42%',
    fontSize: 8,
    lineHeight: 1.3,
    textAlign: 'right',
  },
  companyName: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 2,
  },
  sealBoxRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  sealBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  sealLabel: {
    fontSize: 6.5,
    color: '#64748b',
  },
  table: {
    width: '100%',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#94a3b8',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingVertical: 3,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 3,
    minHeight: 16,
    alignItems: 'center',
  },
  colNo: { width: '6%', textAlign: 'center', fontSize: 8 },
  colCode: { width: '18%', paddingLeft: 4, fontSize: 8 },
  colName: { width: '36%', paddingLeft: 4, fontSize: 8.5 },
  colQty: { width: '12%', textAlign: 'right', paddingRight: 4, fontSize: 8.5, fontWeight: 700 },
  colUnit: { width: '8%', textAlign: 'center', fontSize: 8 },
  colBox: { width: '20%', paddingLeft: 4, fontSize: 8 },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    fontSize: 8,
    color: '#475569',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    borderStyle: 'dashed',
    marginVertical: 14,
  },
})

interface ShipmentPDFProps {
  shipment: any
  orderLines: any[]
}

export function ShipmentPDFDocument({ shipment, orderLines }: ShipmentPDFProps) {
  const company = shipment?.orders?.companies || {}
  const customerName = company?.company_name || '得意先'
  const site = shipment?.delivery_sites || {}
  const siteName = site?.site_name ? `納入場所: ${site.site_name}` : ''
  const siteAddress = site?.site_address ? `(${site.site_address})` : ''

  const totalQty = orderLines.reduce((sum, l) => sum + (Number(l.quantity) || 0), 0)

  // Render a single section (can be printed as 納品書 or 納品受領書)
  const renderDocumentSection = (docTitle: string, isReceipt = false) => (
    <View style={styles.sectionBox}>
      {/* Title */}
      <View style={styles.titleBlock}>
        <Text style={styles.mainTitle}>{docTitle}</Text>
      </View>

      {/* Header Info */}
      <View style={styles.headerRow}>
        {/* Left: Customer & Delivery Site */}
        <View style={styles.customerBox}>
          <Text style={styles.customerName}>{customerName} 御中</Text>
          {siteName ? <Text style={styles.deliverySiteName}>{siteName} {siteAddress}</Text> : null}
          <View style={{ marginTop: 4, fontSize: 7.5, color: '#475569' }}>
            <Text>受注番号 (PO): {shipment.orders?.order_no || '—'}</Text>
            <Text>出荷種別: {shipment.shipment_type || 'MASS_PRODUCTION'}</Text>
            <Text>配送方法: {shipment.delivery_method || '自社便・路線便'} {shipment.tracking_no ? `(問合せ: ${shipment.tracking_no})` : ''}</Text>
          </View>
        </View>

        {/* Right: YSD Info & Hanko */}
        <View style={styles.companyInfoBox}>
          <Text style={{ color: '#64748b' }}>納品書番号: {shipment.delivery_note_no || '—'}</Text>
          <Text style={{ color: '#64748b', marginBottom: 2 }}>出荷日: {shipment.ship_date}</Text>

          <Text style={styles.companyName}>有限会社 ヤマダ成型 (YSD)</Text>
          <Text>群馬県高崎市...</Text>
          <Text>TEL: 027-XXX-XXXX</Text>

          {/* 3 Hanko Boxes */}
          <View style={styles.sealBoxRow}>
            <View style={styles.sealBox}>
              <Text style={styles.sealLabel}>承認</Text>
            </View>
            <View style={styles.sealBox}>
              <Text style={styles.sealLabel}>出荷担当</Text>
            </View>
            <View style={[styles.sealBox, isReceipt ? { borderColor: '#0f766e', backgroundColor: '#f0fdfa' } : {}]}>
              <Text style={styles.sealLabel}>{isReceipt ? '受領印' : '照合'}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableHeaderRow}>
          <Text style={styles.colNo}>No</Text>
          <Text style={styles.colCode}>品番・製品コード</Text>
          <Text style={styles.colName}>品名・仕様</Text>
          <Text style={styles.colQty}>出荷数量</Text>
          <Text style={styles.colUnit}>単位</Text>
          <Text style={styles.colBox}>荷姿・梱包</Text>
        </View>

        {orderLines.map((line, idx) => (
          <View key={line.line_id || idx} style={styles.tableRow}>
            <Text style={styles.colNo}>{idx + 1}</Text>
            <Text style={styles.colCode}>{line.products?.product_code || '—'}</Text>
            <Text style={styles.colName}>{line.products?.product_name || line.products?.product_code || 'トレイ製品'}</Text>
            <Text style={styles.colQty}>{Number(line.quantity || 0).toLocaleString()}</Text>
            <Text style={styles.colUnit}>{line.unit || '枚'}</Text>
            <Text style={styles.colBox}>{line.box_type || line.packing_style || 'ダンボール梱包'}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footerRow}>
        <Text>合計数量: {totalQty.toLocaleString()} 点 ({orderLines.length} 品目)</Text>
        {isReceipt ? (
          <Text style={{ fontWeight: 700, color: '#0f172a' }}>上記正に受領いたしました。 年 月 日 (受領サイン: ______________)</Text>
        ) : (
          <Text>現品到着後、内容をご確認の上、万一相違の際は直ちにご連絡ください。</Text>
        )}
      </View>
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Half: 納品書 (Delivery Note) */}
        {renderDocumentSection('納 品 書 (Delivery Note)', false)}

        {/* Dashed Cut Line */}
        <View style={styles.divider} />

        {/* Bottom Half: 納品受領書 (Delivery Receipt Copy) */}
        {renderDocumentSection('納 品 受 領 書 (Receipt Copy)', true)}
      </Page>
    </Document>
  )
}
