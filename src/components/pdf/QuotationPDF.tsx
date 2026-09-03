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
    marginBottom: 10,
  },
  companyLogoArea: {
    width: '60%',
  },
  companyEnglishName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#0066CC',
    letterSpacing: 1,
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
    marginVertical: 10,
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
    marginBottom: 12,
  },
  customerBox: {
    width: '56%',
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
    fontSize: 10,
    color: '#334155',
    marginBottom: 6,
  },
  salutation: {
    fontSize: 8,
    color: '#475569',
    lineHeight: 1.4,
  },
  taxNotice: {
    fontSize: 8,
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 2,
  },
  issuerBox: {
    width: '40%',
    alignItems: 'flex-end',
  },
  issuerName: {
    fontSize: 11,
    fontWeight: 700,
    marginBottom: 2,
  },
  issuerRep: {
    fontSize: 9,
    color: '#334155',
    marginBottom: 4,
  },
  stampWrapper: {
    width: 50,
    height: 50,
    marginTop: 2,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 8.5,
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#94a3b8',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingVertical: 4,
    fontWeight: 700,
    fontSize: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 4,
    minHeight: 18,
    alignItems: 'center',
    fontSize: 8,
  },
  colNo: { width: '5%', textAlign: 'center' },
  colModel: { width: '17%', paddingHorizontal: 4 },
  colDesc: { width: '38%', paddingHorizontal: 4 },
  colQty: { width: '13%', textAlign: 'right', paddingRight: 4 },
  colPrice: { width: '13%', textAlign: 'right', paddingRight: 4 },
  colAmount: { width: '14%', textAlign: 'right', paddingRight: 6, fontWeight: 700 },

  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '45%',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#94a3b8',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#334155',
  },
  totalValue: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0f172a',
  },
  termsSection: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    fontSize: 8,
    lineHeight: 1.45,
    color: '#475569',
  },
  closing: {
    textAlign: 'right',
    marginTop: 6,
    fontSize: 8,
    fontWeight: 700,
    color: '#334155',
  },
})

interface Props {
  data: {
    quotation_no: string
    revision_no?: number | null
    quote_date: string
    valid_until?: string | null
    customer_contact_name?: string | null
    delivery_destination?: string | null
    total_amount?: number | null
    notes?: string | null
    companies?: { company_name: string } | null
    quotation_lines?: Array<{
      line_no: number
      model_code?: string | null
      description: string | null
      quantity: number | null
      quantity_text?: string | null
      unit_price: number | null
      amount: number | null
    }>
  }
}

export function QuotationPDF({ data }: Props) {
  const companyName = data.companies?.company_name || '御中'
  const lines = data.quotation_lines || []
  const stampPath = path.join(process.cwd(), 'public/stamps/stamp_yoshida.png')

  const formatJpy = (amount: number | null | undefined) => {
    if (amount == null) return '-'
    return '¥' + new Intl.NumberFormat('ja-JP').format(amount)
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Top Header: Company Branding & Quotation No */}
        <View style={styles.topHeader}>
          <View style={styles.companyLogoArea}>
            <Text style={styles.companyEnglishName}>YOSHIDA PACKAGE CO.,LTD.</Text>
            <Text style={styles.companySubInfo}>
              5-36-6 MINAMIKASE SAIWAIKU KAWASAKI JAPAN 〒212-0055{'\n'}
              TEL. 044-588-1621   FAX. 044-588-7000   E-mail: info@ysd-pack.co.jp
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
              <Text style={styles.contactName}>{data.customer_contact_name}</Text>
            )}
            <Text style={styles.salutation}>
              毎度格別のお引き立てを賜り厚く御礼申し上げます。{'\n'}
              下記の通り御見積申し上げますので宜しくお願い致します。
            </Text>
            <Text style={styles.taxNotice}>
              ※ この単価に消費税は、含まれておりません。
            </Text>
          </View>

          {/* Right: Issuer (Yoshida Package) */}
          <View style={styles.issuerBox}>
            <Text style={styles.issuerName}>株式会社 ヨシダパッケージ</Text>
            <Text style={styles.issuerRep}>担当者: 小林 一弘</Text>
            <View style={styles.stampWrapper}>
              <Image src={stampPath} />
            </View>
          </View>
        </View>

        {/* Delivery & Validity Info Bar */}
        <View style={styles.infoBar}>
          <Text>
            送り先: {data.delivery_destination || '御社指定先'}
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

          {lines.map((line, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colNo}>{line.line_no || idx + 1}</Text>
              <Text style={styles.colModel}>{line.model_code || '-'}</Text>
              <Text style={styles.colDesc}>{line.description || '-'}</Text>
              <Text style={styles.colQty}>
                {line.quantity_text ? line.quantity_text : line.quantity}
              </Text>
              <Text style={styles.colPrice}>{formatJpy(line.unit_price)}</Text>
              <Text style={styles.colAmount}>{formatJpy(line.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Total Amount Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>合計 (税抜):</Text>
            <Text style={styles.totalValue}>{formatJpy(data.total_amount)}</Text>
          </View>
        </View>

        {/* Terms & Notes */}
        <View style={styles.termsSection}>
          <Text style={{ fontWeight: 700, marginBottom: 2 }}>【備考・特記事項】</Text>
          <Text>
            {data.notes || '・納期はご下命後、通常1週間程度頂いております。\n・サンプルトレイは無償にて2枚お届け可能です。'}
          </Text>
          <Text style={styles.closing}>以上、宜しくお願い申し上げます。</Text>
        </View>
      </Page>
    </Document>
  )
}
