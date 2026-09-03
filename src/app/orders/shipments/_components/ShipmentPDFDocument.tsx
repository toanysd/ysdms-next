import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Font, Image,
} from '@react-pdf/renderer'
import path from 'path'

const isServer = typeof window === 'undefined'
const fontSrcRegular = isServer
  ? path.join(process.cwd(), 'public/fonts/NotoSansJP-Regular.otf')
  : '/fonts/NotoSansJP-Regular.otf'
const fontSrcBold = isServer
  ? path.join(process.cwd(), 'public/fonts/NotoSansJP-Bold.otf')
  : '/fonts/NotoSansJP-Bold.otf'
const stampSrc = isServer
  ? path.join(process.cwd(), 'public/stamps/stamp_yoshida.png')
  : '/stamps/stamp_yoshida.png'

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
    fontSize: 8.5,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 28,
    backgroundColor: '#ffffff',
    lineHeight: 1.3,
    color: '#0f172a',
  },
  sectionBox: {
    borderWidth: 1,
    borderColor: '#94a3b8',
    padding: 10,
    marginBottom: 10,
    borderRadius: 2,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleBlock: {
    alignItems: 'center',
    marginBottom: 8,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 6,
    color: '#0f172a',
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a',
    paddingBottom: 2,
  },
  customerBox: {
    width: '54%',
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
    fontSize: 9,
    color: '#334155',
    marginBottom: 2,
  },
  subDetails: {
    marginTop: 3,
    fontSize: 7.5,
    color: '#475569',
  },
  companyInfoBox: {
    width: '44%',
    fontSize: 8,
    lineHeight: 1.3,
    textAlign: 'right',
    alignItems: 'flex-end',
  },
  companyLogoText: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0066CC',
    letterSpacing: 0.5,
  },
  companyName: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 1,
  },
  sealAreaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  sealBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  sealLabel: {
    fontSize: 6,
    color: '#64748b',
  },
  stampImage: {
    width: 38,
    height: 38,
  },
  table: {
    width: '100%',
    marginVertical: 4,
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
  colNo: { width: '6%', textAlign: 'center', fontSize: 7.5 },
  colCode: { width: '20%', paddingLeft: 4, fontSize: 8, fontFamily: 'NotoSansJP' },
  colName: { width: '34%', paddingLeft: 4, fontSize: 8 },
  colQty: { width: '14%', textAlign: 'right', paddingRight: 6, fontSize: 8.5, fontWeight: 700 },
  colUnit: { width: '8%', textAlign: 'center', fontSize: 8 },
  colBox: { width: '18%', paddingLeft: 4, fontSize: 7.5 },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    fontSize: 7.5,
    color: '#475569',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    borderStyle: 'dashed',
    marginVertical: 8,
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

  // Render a single section (Top: 納品書, Bottom: 納品受領書)
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
          <View style={styles.subDetails}>
            <Text>受注番号: {shipment.orders?.order_no || '—'}</Text>
            <Text>配送方法: {shipment.delivery_method || '自社便・トラック'} {shipment.tracking_no ? `(送り状: ${shipment.tracking_no})` : ''}</Text>
            {shipment.notes && <Text>出荷備考: {shipment.notes}</Text>}
          </View>
        </View>

        {/* Right: YSD Info & Stamp */}
        <View style={styles.companyInfoBox}>
          <Text style={{ color: '#64748b', fontSize: 7.5 }}>納品番号: {shipment.delivery_note_no || '—'}</Text>
          <Text style={{ color: '#64748b', fontSize: 7.5, marginBottom: 2 }}>出荷日: {shipment.ship_date}</Text>

          <Text style={styles.companyLogoText}>YOSHIDA SEIKEI CO., LTD.</Text>
          <Text style={styles.companyName}>株式会社 吉田金型製作所</Text>
          <Text>〒211-0016 神奈川県川崎市中原区市ノ坪 385</Text>
          <Text>TEL: 044-411-4470 / FAX: 044-433-2895</Text>

          {/* Seals & Hanko */}
          <View style={styles.sealAreaRow}>
            <View style={styles.sealBox}>
              <Text style={styles.sealLabel}>承認</Text>
            </View>
            <View style={styles.sealBox}>
              <Text style={styles.sealLabel}>出荷担当</Text>
            </View>
            {isReceipt ? (
              <View style={[styles.sealBox, { borderColor: '#0f766e', backgroundColor: '#f0fdfa' }]}>
                <Text style={[styles.sealLabel, { color: '#0f766e', fontWeight: 700 }]}>受領印</Text>
              </View>
            ) : (
              <View style={styles.stampImage}>
                {/* Genuine Yoshida Stamp */}
                <Image src={stampSrc} style={{ width: '100%', height: '100%' }} />
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Items Table */}
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
            <Text style={styles.colName}>{line.products?.product_name || line.products?.product_code || '成型トレイ製品'}</Text>
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
          <Text style={{ fontWeight: 700, color: '#0f172a' }}>上記正に受領いたしました。 _____年___月___日  (受領サイン: _______________)</Text>
        ) : (
          <Text>現品到着後、内容をご確認の上、万一相違の際は直ちにご連絡ください。</Text>
        )}
      </View>
    </View>
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Section: 納 品 書 (Delivery Note) */}
        {renderDocumentSection('納　品　書', false)}

        {/* Dashed Cut Line */}
        <View style={styles.divider} />

        {/* Bottom Section: 納 品 受 領 書 (Receipt Copy) */}
        {renderDocumentSection('納　品　受　領　書', true)}
      </Page>
    </Document>
  )
}
