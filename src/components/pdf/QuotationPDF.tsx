import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import path from 'path'

// Register Japanese Fonts from local OTF
const fontRegular = path.join(process.cwd(), 'public/fonts/NotoSansJP-Regular.otf')
const fontBold = path.join(process.cwd(), 'public/fonts/NotoSansJP-Bold.otf')

Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: fontRegular, fontWeight: 400 },
    { src: fontBold, fontWeight: 700 },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    fontSize: 9,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 36,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    lineHeight: 1.35,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  companyLogoArea: {
    width: '60%',
  },
  companyEnglishName: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0066CC',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  companySubInfo: {
    fontSize: 7.5,
    color: '#475569',
    lineHeight: 1.3,
  },
  quoteNoArea: {
    width: '38%',
    alignItems: 'flex-end',
  },
  quoteNoText: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'NotoSansJP',
  },
  revisionBadge: {
    fontSize: 8.5,
    color: '#64748b',
    marginTop: 2,
  },
  titleContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 6,
    color: '#0f172a',
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a',
    paddingBottom: 3,
    paddingHorizontal: 20,
  },
  metaSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  customerBox: {
    width: '54%',
  },
  customerDate: {
    fontSize: 8.5,
    color: '#334155',
    marginBottom: 4,
  },
  customerNameRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#475569',
    paddingBottom: 3,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0f172a',
  },
  contactName: {
    fontSize: 9.5,
    color: '#334155',
    marginBottom: 4,
  },
  salutation: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.35,
  },
  taxNotice: {
    fontSize: 7.5,
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 3,
  },
  issuerBox: {
    width: '42%',
    alignItems: 'flex-end',
  },
  issuerName: {
    fontSize: 10.5,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 2,
  },
  issuerRep: {
    fontSize: 8.5,
    color: '#334155',
    marginBottom: 6,
  },
  // ── 3-Box Hanko Area (96px total: 32px each) ────────
  hankoSection: {
    width: 96,
    borderWidth: 1,
    borderColor: '#94a3b8',
    backgroundColor: '#ffffff',
  },
  hankoHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    backgroundColor: '#f8fafc',
  },
  hankoHeaderCell: {
    width: 32,
    fontSize: 7,
    fontWeight: 700,
    color: '#475569',
    textAlign: 'center',
    paddingVertical: 2,
    borderRightWidth: 1,
    borderRightColor: '#94a3b8',
  },
  hankoHeaderCellLast: {
    width: 32,
    fontSize: 7,
    fontWeight: 700,
    color: '#475569',
    textAlign: 'center',
    paddingVertical: 2,
  },
  hankoContentRow: {
    flexDirection: 'row',
    height: 34,
    alignItems: 'center',
  },
  hankoContentCell: {
    width: 32,
    height: 34,
    borderRightWidth: 1,
    borderRightColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hankoContentCellLast: {
    width: 32,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stampImage: {
    width: 28,
    height: 28,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 8,
    fontSize: 8,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#94a3b8',
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingVertical: 3.5,
    fontWeight: 700,
    fontSize: 7.5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 3.5,
    minHeight: 18,
    alignItems: 'center',
    fontSize: 7.5,
  },
  colNo: { width: '5%', textAlign: 'center' },
  colModel: { width: '16%', paddingHorizontal: 4 },
  colDesc: { width: '43%', paddingHorizontal: 4 },
  colQty: { width: '11%', textAlign: 'right', paddingRight: 4 },
  colPrice: { width: '12%', textAlign: 'right', paddingRight: 4 },
  colAmount: { width: '13%', textAlign: 'right', paddingRight: 6, fontWeight: 700 },

  // ── 3-Row Financial Summary Table ────────────────────
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  totalTable: {
    width: '46%',
    borderWidth: 1,
    borderColor: '#94a3b8',
    backgroundColor: '#ffffff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4.5,
    backgroundColor: '#f1f5f9',
    borderTopWidth: 1.5,
    borderTopColor: '#0f172a',
  },
  totalLabel: {
    fontSize: 8,
    fontWeight: 700,
    color: '#334155',
  },
  totalValue: {
    fontSize: 8.5,
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
    color: '#0f172a',
  },
  totalLabelFinal: {
    fontSize: 9,
    fontWeight: 700,
    color: '#0f172a',
  },
  totalValueFinal: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: 'NotoSansJP',
    color: '#0D9488',
  },

  termsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
    fontSize: 7.5,
    lineHeight: 1.4,
    color: '#475569',
  },
  closing: {
    textAlign: 'right',
    marginTop: 4,
    fontSize: 7.5,
    fontWeight: 700,
    color: '#334155',
  },
})

export interface QuotationPDFLine {
  line_no: number
  model_code?: string | null
  description: string | null
  quantity: number | null
  quantity_text?: string | null
  unit_price: number | null
  amount: number | null
  plastic_type_designed?: string | null
  design_code?: string | null
  external_length_mm?: number | null
  external_width_mm?: number | null
}

export interface QuotationPDFProps {
  data: {
    quotation_no: string
    revision_no?: number | null
    quote_date: string
    valid_until?: string | null
    customer_contact_name?: string | null
    delivery_destination?: string | null
    total_amount?: number | null
    notes?: string | null
    prepared_by_name?: string | null
    companies?: { company_name: string } | null
    employees?: { employee_name: string } | null
    quotation_lines?: QuotationPDFLine[]
  }
}

export function QuotationPDF({ data }: QuotationPDFProps) {
  const companyName = data.companies?.company_name || '御中'
  const lines = data.quotation_lines || []
  const stampPath = path.join(process.cwd(), 'public/stamps/stamp_yoshida.png')

  // Dynamic Issuer Representative (No hardcoding)
  const preparedByName = data.employees?.employee_name || data.prepared_by_name || '営業担当'

  const formatJpy = (amount: number | null | undefined) => {
    if (amount == null) return '-'
    return '¥' + new Intl.NumberFormat('ja-JP').format(amount)
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }

  // Calculate 3-row financials
  const subtotal = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0)
  const tax = Math.round(subtotal * 0.1)
  const grandTotal = data.total_amount ? Number(data.total_amount) : (subtotal + tax)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Header: Company Branding & Quotation No */}
        <View style={styles.topHeader}>
          <View style={styles.companyLogoArea}>
            <Text style={styles.companyEnglishName}>YOSHIDA PACKAGE CO.,LTD.</Text>
            <Text style={styles.companySubInfo}>
              5-36-6 MINAMIKASE SAIWAIKU KAWASAKI JAPAN 〒212-0055\nTEL. 044-588-1621   FAX. 044-588-7000   E-mail: info@ysd-pack.co.jp
            </Text>
          </View>
          <View style={styles.quoteNoArea}>
            <Text style={styles.quoteNoText}>No. {data.quotation_no}</Text>
            <Text style={styles.revisionBadge}>
              版数: Rev.{data.revision_no || 1}
            </Text>
          </View>
        </View>

        {/* Document Main Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>御　見　積　書</Text>
        </View>

        {/* Customer & Issuer Info */}
        <View style={styles.metaSection}>
          {/* Left: Customer Info */}
          <View style={styles.customerBox}>
            <Text style={styles.customerDate}>
              発行日: {formatDisplayDate(data.quote_date)}
            </Text>
            <View style={styles.customerNameRow}>
              <Text style={styles.customerName}>{companyName} 御中</Text>
            </View>
            {data.customer_contact_name && (
              <Text style={styles.contactName}>{data.customer_contact_name} 様</Text>
            )}
            <Text style={styles.salutation}>
              毎度格別のお引き立てを賜り厚く御礼申し上げます。\n下記の通り御見積申し上げますので宜しくお願い致します。
            </Text>
            <Text style={styles.taxNotice}>
              ※ この単価に消費税は、含まれておりません。
            </Text>
          </View>

          {/* Right: Issuer (Yoshida Package) & 3-Box Hanko */}
          <View style={styles.issuerBox}>
            <Text style={styles.issuerName}>株式会社 ヨシダパッケージ</Text>
            <Text style={styles.issuerRep}>担当者: {preparedByName}</Text>

            {/* 3-Box Hanko Row */}
            <View style={styles.hankoSection}>
              <View style={styles.hankoHeaderRow}>
                <Text style={styles.hankoHeaderCell}>承認</Text>
                <Text style={styles.hankoHeaderCell}>審査</Text>
                <Text style={styles.hankoHeaderCellLast}>作成</Text>
              </View>
              <View style={styles.hankoContentRow}>
                <View style={styles.hankoContentCell}>
                  <Image src={stampPath} style={styles.stampImage} />
                </View>
                <View style={styles.hankoContentCell}>
                  <Text style={{ fontSize: 6, color: '#cbd5e1' }}></Text>
                </View>
                <View style={styles.hankoContentCellLast}>
                  <Text style={{ fontSize: 6, color: '#cbd5e1' }}></Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery & Validity Info Bar */}
        <View style={styles.infoBar}>
          <Text>
            送り先: {data.delivery_destination || '御社指定場所'}
          </Text>
          <Text>
            見積有効期限: {data.valid_until ? formatDisplayDate(data.valid_until) : '次回価格改定時まで'}
          </Text>
        </View>

        {/* Line Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>#</Text>
            <Text style={styles.colModel}>型番</Text>
            <Text style={styles.colDesc}>品名・仕様</Text>
            <Text style={styles.colQty}>数量</Text>
            <Text style={styles.colPrice}>単価</Text>
            <Text style={styles.colAmount}>金額</Text>
          </View>

          {lines.map((line, idx) => {
            const hasSpec = Boolean(
              line.plastic_type_designed ||
              (line.external_length_mm && line.external_width_mm) ||
              line.design_code
            )

            return (
              <View key={idx} style={styles.tableRow}>
                <Text style={styles.colNo}>{line.line_no || idx + 1}</Text>
                <Text style={styles.colModel}>{line.model_code || '-'}</Text>
                <View style={styles.colDesc}>
                  <Text style={{ fontWeight: 700, color: '#0f172a' }}>
                    {line.description || '-'}
                  </Text>
                  {hasSpec && (
                    <Text style={{ fontSize: 6.8, color: '#475569', marginTop: 1.5 }}>
                      {line.design_code ? `[CAD: ${line.design_code}] ` : ''}
                      {line.plastic_type_designed ? `${line.plastic_type_designed} ` : ''}
                      {line.external_length_mm && line.external_width_mm
                        ? `(外寸: ${line.external_length_mm}×${line.external_width_mm}mm)`
                        : ''}
                    </Text>
                  )}
                </View>
                <Text style={styles.colQty}>
                  {line.quantity_text ? line.quantity_text : (line.quantity != null ? Number(line.quantity).toLocaleString() : '-')}
                </Text>
                <Text style={styles.colPrice}>{formatJpy(line.unit_price)}</Text>
                <Text style={styles.colAmount}>{formatJpy(line.amount)}</Text>
              </View>
            )
          })}
        </View>

        {/* 3-Row Financial Summary Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>小計 (税抜):</Text>
              <Text style={styles.totalValue}>{formatJpy(subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>消費税 (10%):</Text>
              <Text style={styles.totalValue}>{formatJpy(tax)}</Text>
            </View>
            <View style={styles.totalRowFinal}>
              <Text style={styles.totalLabelFinal}>御見積合計 (税込):</Text>
              <Text style={styles.totalValueFinal}>{formatJpy(grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Terms & Notes (Theo phôi thực tế YSD) */}
        <View style={styles.termsSection}>
          <Text style={{ fontWeight: 700, marginBottom: 2 }}>【備考・特記事項】</Text>
          <Text>
            {data.notes
              ? data.notes
              : '・納期はご下命後、通常1週間程度頂いております。\n・サンプルトレイは、標準品となりますがご評価用として無償にて２枚お届け可能です。\n・汎用トレイの為、輸送時の製品破損は、補償いたしかねます。'}
          </Text>
          <Text style={styles.closing}>以上、宜しくお願い申し上げます。</Text>
        </View>
      </Page>
    </Document>
  )
}
