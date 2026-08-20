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
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 32,
    backgroundColor: '#ffffff',
    lineHeight: 1.3,
    color: '#1e293b',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 4,
    color: '#0f172a',
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
    paddingBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  customerBox: {
    width: '52%',
    borderBottomWidth: 1,
    borderBottomColor: '#64748b',
    paddingBottom: 4,
  },
  customerName: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 4,
  },
  companyInfoBox: {
    width: '42%',
    fontSize: 8.5,
    lineHeight: 1.35,
    textAlign: 'right',
  },
  companyName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 2,
  },
  sealBoxRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 4,
  },
  sealBox: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  sealLabel: {
    fontSize: 7,
    color: '#64748b',
  },
  grandTotalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 10,
    borderRadius: 2,
  },
  grandTotalLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#334155',
  },
  grandTotalValue: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0f172a',
  },
  table: {
    width: '100%',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#94a3b8',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingVertical: 4,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 4,
    minHeight: 18,
    alignItems: 'center',
  },
  colNo: { width: '6%', textAlign: 'center', fontSize: 8 },
  colType: { width: '12%', textAlign: 'center', fontSize: 8 },
  colDesc: { width: '42%', paddingLeft: 6, fontSize: 8.5 },
  colQty: { width: '10%', textAlign: 'right', paddingRight: 4, fontSize: 8.5 },
  colPrice: { width: '14%', textAlign: 'right', paddingRight: 4, fontSize: 8.5 },
  colAmount: { width: '16%', textAlign: 'right', paddingRight: 6, fontSize: 8.5, fontWeight: 700 },

  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
    marginBottom: 10,
  },
  summaryTable: {
    width: '45%',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  summaryLabel: { fontSize: 8.5, color: '#475569' },
  summaryValue: { fontSize: 9, fontWeight: 700, textAlign: 'right' },

  termsBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 8,
    backgroundColor: '#f8fafc',
    fontSize: 8,
    lineHeight: 1.4,
  },
  termsTitle: {
    fontWeight: 700,
    marginBottom: 3,
    color: '#334155',
  },
})

interface QuotationPDFProps {
  quotation: any
  lines: any[]
}

export function QuotationPDFDocument({ quotation, lines }: QuotationPDFProps) {
  const subtotal = lines.reduce((sum, l) => sum + (Number(l.amount) || (Number(l.quantity) * Number(l.unit_price)) || 0), 0)
  const tax = Math.round(subtotal * 0.10)
  const grandTotal = subtotal + tax

  const company = quotation?.companies || {}
  const customerName = company?.company_name || '得意先'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ── 1. Main Document Title ── */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>御 見 積 書</Text>
        </View>

        {/* ── 2. Header Info: Customer vs YSD Info ── */}
        <View style={styles.headerRow}>
          {/* Left: Customer */}
          <View style={styles.customerBox}>
            <Text style={styles.customerName}>{customerName} 御中</Text>
            <Text style={{ fontSize: 8, color: '#64748b' }}>下記の通り御見積申し上げます。</Text>
            <View style={{ marginTop: 8, fontSize: 8 }}>
              <Text>件名 (Subject): {quotation.notes || '真空成形用金型・トレイ製品製作'}</Text>
              <Text>見積種別: {quotation.quotation_type || 'MOLD / TRAY'}</Text>
              <Text>有効期限: {quotation.valid_until || '発行後 30 日間'}</Text>
            </View>
          </View>

          {/* Right: YSD Company Info & Hanko Boxes */}
          <View style={styles.companyInfoBox}>
            <Text style={{ color: '#64748b' }}>見積番号: {quotation.quotation_no}</Text>
            <Text style={{ color: '#64748b', marginBottom: 4 }}>発行日: {quotation.quote_date}</Text>

            <Text style={styles.companyName}>有限会社 ヤマダ成型 (YSD)</Text>
            <Text>〒370-0000 群馬県高崎市...</Text>
            <Text>TEL: 027-XXX-XXXX / FAX: 027-XXX-XXXX</Text>
            <Text>担当: {quotation.employees?.employee_name || '営業技術部'}</Text>

            {/* Hanko Seal Boxes */}
            <View style={styles.sealBoxRow}>
              <View style={styles.sealBox}>
                <Text style={styles.sealLabel}>承認</Text>
              </View>
              <View style={styles.sealBox}>
                <Text style={styles.sealLabel}>審査</Text>
              </View>
              <View style={styles.sealBox}>
                <Text style={styles.sealLabel}>担当</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── 3. Grand Total Banner ── */}
        <View style={styles.grandTotalBar}>
          <Text style={styles.grandTotalLabel}>御見積金額合計 (税込):</Text>
          <Text style={styles.grandTotalValue}>¥ {grandTotal.toLocaleString()} -</Text>
        </View>

        {/* ── 4. Line Items Table ── */}
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colNo}>No</Text>
            <Text style={styles.colType}>種別</Text>
            <Text style={styles.colDesc}>品名・仕様・規格</Text>
            <Text style={styles.colQty}>数量</Text>
            <Text style={styles.colPrice}>単価 (¥)</Text>
            <Text style={styles.colAmount}>金額 (¥)</Text>
          </View>

          {lines.map((line, idx) => {
            const lineAmount = Number(line.amount) || (Number(line.quantity) * Number(line.unit_price)) || 0
            return (
              <View key={line.line_id || idx} style={styles.tableRow}>
                <Text style={styles.colNo}>{idx + 1}</Text>
                <Text style={styles.colType}>{line.item_type || 'MOLD'}</Text>
                <Text style={styles.colDesc}>{line.description || '—'}</Text>
                <Text style={styles.colQty}>{Number(line.quantity || 1).toLocaleString()}</Text>
                <Text style={styles.colPrice}>{Number(line.unit_price || 0).toLocaleString()}</Text>
                <Text style={styles.colAmount}>{lineAmount.toLocaleString()}</Text>
              </View>
            )
          })}
        </View>

        {/* ── 5. Subtotal, Tax, and Grand Total Breakdown ── */}
        <View style={styles.summarySection}>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>小計 (税抜):</Text>
              <Text style={styles.summaryValue}>¥ {subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>消費税 (10%):</Text>
              <Text style={styles.summaryValue}>¥ {tax.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, { backgroundColor: '#f1f5f9' }]}>
              <Text style={[styles.summaryLabel, { fontWeight: 700, color: '#0f172a' }]}>合計金額 (税込):</Text>
              <Text style={[styles.summaryValue, { color: '#0f172a', fontSize: 10 }]}>¥ {grandTotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* ── 6. Commercial Terms & Conditions ── */}
        <View style={styles.termsBox}>
          <Text style={styles.termsTitle}>【 お取引条件・特記事項 】</Text>
          <Text>1. 納入場所: 御社指定工場または貴社ご指定倉庫車上渡し</Text>
          <Text>2. 支払条件: 貴社規定締め日・翌月末日 銀行振込</Text>
          <Text>3. 金型納期: 図面承認後 約 15 〜 20 営業日 (試作込み)</Text>
          <Text>4. 成形製品: 原料樹脂相場および原材料価格の急激な変動時は再見積りとなる場合がございます。</Text>
        </View>

      </Page>
    </Document>
  )
}
