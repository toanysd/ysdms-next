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
  appendixMeta: {
    marginBottom: 8,
    fontSize: 8,
    color: '#334155',
    lineHeight: 1.35,
  },
  breakdownSummaryBanner: {
    padding: 6,
    backgroundColor: '#f0fdfa',
    borderWidth: 1,
    borderColor: '#0D9488',
    borderRadius: 3,
    marginBottom: 10,
  },
  breakdownSummaryTitle: {
    fontSize: 8.5,
    fontWeight: 700,
    color: '#0f766e',
    marginBottom: 2,
  },
  breakdownSummaryFormula: {
    fontSize: 8,
    color: '#134e4a',
    fontWeight: 700,
  },
  noteBadgeBlock: {
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cbd5e1',
  },
  noteBadgeText: {
    fontSize: 7.5,
    fontWeight: 700,
    color: '#0f766e',
    marginBottom: 1,
  },
  inlineTrayFormulaBlock: {
    marginBottom: 4,
    padding: 3,
    backgroundColor: '#f0fdfa',
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: '#99f6e4',
  },
  inlineTrayFormulaText: {
    fontSize: 7,
    fontWeight: 700,
    color: '#0f766e',
  },
  specGridContainer: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    padding: 6,
    marginBottom: 8,
  },
  specGridTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 2,
  },
  specGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 1.5,
  },
  specItem: {
    width: '49%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  specLabel: {
    width: '44%',
    fontSize: 7.5,
    color: '#64748b',
    fontWeight: 700,
  },
  specValue: {
    width: '56%',
    fontSize: 7.5,
    color: '#0f172a',
    fontWeight: 700,
  },
  breakdownTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#94a3b8',
    marginBottom: 8,
  },
  breakdownTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingVertical: 3.5,
    fontWeight: 700,
    fontSize: 7.5,
    color: '#334155',
  },
  breakdownTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 3.5,
    alignItems: 'center',
    fontSize: 7.5,
  },
  breakdownTableRowHighlight: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#99f6e4',
    paddingVertical: 4.5,
    alignItems: 'center',
    fontSize: 7.5,
    backgroundColor: '#f0fdfa',
  },
  breakdownColNo: { width: '5%', textAlign: 'center' },
  breakdownColItem: { width: '25%', paddingHorizontal: 4, fontWeight: 700, color: '#0f172a' },
  breakdownColBasis: { width: '48%', paddingHorizontal: 4, color: '#475569' },
  breakdownColPrice: { width: '22%', textAlign: 'right', paddingRight: 6, fontWeight: 700, color: '#0f172a' },
  breakdownColPriceHighlight: { width: '22%', textAlign: 'right', paddingRight: 6, fontWeight: 700, color: '#0D9488', fontSize: 8.5 },
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

export interface QuotationExtraJson {
  moldOptions?: {
    constructionType?: 'TOP_FLANGE' | 'SKIRTED'
    applicationType?: 'STANDARD' | 'DEDICATED'
    isExistingCutter?: boolean
    freeSampleTrial?: boolean
    targetLot?: number
  }
  moldCalc?: {
    moldBasePrice?: number
    cutterPrice?: number
    plugPrice?: number
    samplePrice?: number
    lotDiscount?: number
    totalToolingPrice?: number
    isExistingCutter?: boolean
    freeSampleTrial?: boolean
  }
  trayCalc?: {
    sheetWidthMm?: number
    feedPitchMm?: number
    weightPerPcsGrams?: number
    rawMaterialCostPerPcs?: number
    formingProcessCostPerPcs?: number
    packingCostPerPcs?: number
    estimatedUnitPrice?: number
    suggestedSellingPrice?: number
    effectivePackagingQty?: number
  }
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
    quotation_type?: string | null
    extra_json?: QuotationExtraJson | any | null
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

  // M27-A: Unpack extra_json from M26 Auto-Pricing Engine
  const extra = (data.extra_json || {}) as QuotationExtraJson
  const { moldOptions, moldCalc, trayCalc } = extra
  const isFreeSample = Boolean(moldOptions?.freeSampleTrial || moldCalc?.freeSampleTrial)
  const isExistingCutter = Boolean(moldOptions?.isExistingCutter || moldCalc?.isExistingCutter)
  const lotDiscount = moldCalc?.lotDiscount || 0

  const hasTrayCalc = Boolean(
    trayCalc &&
    (data.quotation_type === 'TRAY' || data.quotation_type === 'SET' || !data.quotation_type)
  )

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

          {/* M27-A: Special Mold & Sample Notes */}
          {(isFreeSample || isExistingCutter || lotDiscount > 0) && (
            <View style={styles.noteBadgeBlock}>
              {isFreeSample && (
                <Text style={styles.noteBadgeText}>※ 試作サンプル無償提供 (2〜10枚)</Text>
              )}
              {isExistingCutter && (
                <Text style={styles.noteBadgeText}>※ 既存抜型使用 (抜型費用 ¥0)</Text>
              )}
              {lotDiscount > 0 && (
                <Text style={styles.noteBadgeText}>
                  ※ 発注ロット特別値引き -¥{lotDiscount.toLocaleString()} 適用済
                </Text>
              )}
            </View>
          )}

          {/* M27-A: Inline 3-Pillar Tray Formula if Tray Calc exists */}
          {hasTrayCalc && trayCalc && (
            <View style={styles.inlineTrayFormulaBlock}>
              <Text style={styles.inlineTrayFormulaText}>
                【単価内訳】材料費 ¥{trayCalc.rawMaterialCostPerPcs != null ? trayCalc.rawMaterialCostPerPcs.toFixed(2) : '-'} + 梱包運賃 ¥{trayCalc.packingCostPerPcs != null ? trayCalc.packingCostPerPcs.toFixed(2) : '-'} + 成形加工費 ¥{trayCalc.formingProcessCostPerPcs != null ? trayCalc.formingProcessCostPerPcs.toFixed(2) : '-'} = ¥{(trayCalc.suggestedSellingPrice || trayCalc.estimatedUnitPrice)?.toLocaleString() || '-'}/枚 (税抜)
              </Text>
            </View>
          )}

          <Text>
            {data.notes
              ? data.notes
              : '・納期はご下命後、通常1週間程度頂いております。\n・サンプルトレイは、標準品となりますがご評価用として無償にて２枚お届け可能です。\n・汎用トレイの為、輸送時の製品破損は、補償いたしかねます。'}
          </Text>
          <Text style={styles.closing}>以上、宜しくお願い申し上げます。</Text>
        </View>
      </Page>

      {/* Page 2: Appendix - Technical Cost Breakdown (when trayCalc exists) */}
      {hasTrayCalc && trayCalc && (
        <Page size="A4" style={styles.page}>
          {/* Top Header: Company Branding & Quotation No */}
          <View style={styles.topHeader}>
            <View style={styles.companyLogoArea}>
              <Text style={styles.companyEnglishName}>YOSHIDA PACKAGE CO.,LTD.</Text>
              <Text style={styles.companySubInfo}>
                5-36-6 MINAMIKASE SAIWAIKU KAWASAKI JAPAN 〒212-0055\nTEL. 044-588-1621   FAX. 044-588-7000
              </Text>
            </View>
            <View style={styles.quoteNoArea}>
              <Text style={styles.quoteNoText}>No. {data.quotation_no}</Text>
              <Text style={styles.revisionBadge}>
                別紙付録: 技術積算明細書 (Rev.{data.revision_no || 1})
              </Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>御見積内訳書（技術積算明細）</Text>
          </View>

          {/* Appendix Meta */}
          <View style={styles.appendixMeta}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
              <Text style={{ fontWeight: 700, fontSize: 10 }}>宛先: {companyName} 御中</Text>
              <Text>発行日: {formatDisplayDate(data.quote_date)}</Text>
            </View>
            <Text style={{ fontSize: 7.5, color: '#64748b' }}>
              ※ 本書は、成形トレイ単価の技術積算基準（材料費・梱包運賃・成形加工費）に基づく詳細内訳明細です。
            </Text>
          </View>

          {/* 3-Pillar Formula Banner */}
          <View style={styles.breakdownSummaryBanner}>
            <Text style={styles.breakdownSummaryTitle}>【成形トレイ単価積算 3本柱内訳サマリー】</Text>
            <Text style={styles.breakdownSummaryFormula}>
              材料費 ¥{trayCalc.rawMaterialCostPerPcs != null ? trayCalc.rawMaterialCostPerPcs.toFixed(2) : '-'} + 梱包運賃 ¥{trayCalc.packingCostPerPcs != null ? trayCalc.packingCostPerPcs.toFixed(2) : '-'} + 成形加工費 ¥{trayCalc.formingProcessCostPerPcs != null ? trayCalc.formingProcessCostPerPcs.toFixed(2) : '-'} = ¥{(trayCalc.suggestedSellingPrice || trayCalc.estimatedUnitPrice)?.toLocaleString() || '-'}/枚 (税抜)
            </Text>
          </View>

          {/* Technical Specifications Grid */}
          <View style={styles.specGridContainer}>
            <Text style={styles.specGridTitle}>1. 設計・技術諸元 (Technical Specifications)</Text>
            <View style={styles.specGridRow}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>対象製品/型番:</Text>
                <Text style={styles.specValue}>{lines[0]?.model_code || lines[0]?.description || '-'}</Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>使用材料/規格:</Text>
                <Text style={styles.specValue}>{lines[0]?.plastic_type_designed || '-'}</Text>
              </View>
            </View>
            <View style={styles.specGridRow}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>原反シート幅:</Text>
                <Text style={styles.specValue}>
                  {trayCalc.sheetWidthMm != null ? `${trayCalc.sheetWidthMm} mm` : '-'}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>送りピッチ (L+15):</Text>
                <Text style={styles.specValue}>
                  {trayCalc.feedPitchMm != null ? `${trayCalc.feedPitchMm} mm` : '-'}
                </Text>
              </View>
            </View>
            <View style={styles.specGridRow}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>1枚当り重量:</Text>
                <Text style={styles.specValue}>
                  {trayCalc.weightPerPcsGrams != null ? `${trayCalc.weightPerPcsGrams.toFixed(2)} g` : '-'}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>基準梱包入数:</Text>
                <Text style={styles.specValue}>
                  {trayCalc.effectivePackagingQty != null ? `${trayCalc.effectivePackagingQty.toLocaleString()} 枚/箱` : '-'}
                </Text>
              </View>
            </View>
            <View style={styles.specGridRow}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>見積対象ロット:</Text>
                <Text style={styles.specValue}>
                  {moldOptions?.targetLot != null ? `${Number(moldOptions.targetLot).toLocaleString()} 枚` : '-'}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>製品外寸 (L×W):</Text>
                <Text style={styles.specValue}>
                  {lines[0]?.external_length_mm && lines[0]?.external_width_mm
                    ? `${lines[0].external_length_mm} × ${lines[0].external_width_mm} mm`
                    : '-'}
                </Text>
              </View>
            </View>
          </View>

          {/* 3-Pillar Cost Breakdown Table */}
          <View style={styles.breakdownTable}>
            <View style={styles.breakdownTableHeader}>
              <Text style={styles.breakdownColNo}>#</Text>
              <Text style={styles.breakdownColItem}>原価構成項目 (Cost Element)</Text>
              <Text style={styles.breakdownColBasis}>算出基準・仕様 (Basis / Calculation)</Text>
              <Text style={styles.breakdownColPrice}>単価 (¥/枚・税抜)</Text>
            </View>

            <View style={styles.breakdownTableRow}>
              <Text style={styles.breakdownColNo}>1</Text>
              <Text style={styles.breakdownColItem}>材料費 (Material Cost)</Text>
              <Text style={styles.breakdownColBasis}>
                原反重量 ({trayCalc.weightPerPcsGrams != null ? trayCalc.weightPerPcsGrams.toFixed(2) : '-'}g) × 原反単価 × 材料変動比率(1.2)
              </Text>
              <Text style={styles.breakdownColPrice}>
                {trayCalc.rawMaterialCostPerPcs != null ? `¥${trayCalc.rawMaterialCostPerPcs.toFixed(2)}` : '-'}
              </Text>
            </View>

            <View style={styles.breakdownTableRow}>
              <Text style={styles.breakdownColNo}>2</Text>
              <Text style={styles.breakdownColItem}>梱包・運送費 (Packaging & Freight)</Text>
              <Text style={styles.breakdownColBasis}>
                基準ダンボール・内装PE袋・納品運賃 ({trayCalc.effectivePackagingQty || '-'}枚/箱換算)
              </Text>
              <Text style={styles.breakdownColPrice}>
                {trayCalc.packingCostPerPcs != null ? `¥${trayCalc.packingCostPerPcs.toFixed(2)}` : '-'}
              </Text>
            </View>

            <View style={styles.breakdownTableRow}>
              <Text style={styles.breakdownColNo}>3</Text>
              <Text style={styles.breakdownColItem}>成形加工費 (Forming Process)</Text>
              <Text style={styles.breakdownColBasis}>
                成形機段取・成形サイクルタイム・電力・直接労務費 (基準能率)
              </Text>
              <Text style={styles.breakdownColPrice}>
                {trayCalc.formingProcessCostPerPcs != null ? `¥${trayCalc.formingProcessCostPerPcs.toFixed(2)}` : '-'}
              </Text>
            </View>

            <View style={styles.breakdownTableRow}>
              <Text style={styles.breakdownColNo}></Text>
              <Text style={styles.breakdownColItem}>積算原価小計 (Estimated Cost)</Text>
              <Text style={styles.breakdownColBasis}>上記 1〜3 構成要素の合計積算額</Text>
              <Text style={styles.breakdownColPrice}>
                {trayCalc.estimatedUnitPrice != null ? `¥${trayCalc.estimatedUnitPrice.toFixed(2)}` : '-'}
              </Text>
            </View>

            <View style={styles.breakdownTableRowHighlight}>
              <Text style={styles.breakdownColNo}></Text>
              <Text style={styles.breakdownColItem}>御見積単価 (Suggested Price)</Text>
              <Text style={styles.breakdownColBasis}>端数切り上げ処理 (Math.ceil) 適用後の正式提出単価</Text>
              <Text style={styles.breakdownColPriceHighlight}>
                {trayCalc.suggestedSellingPrice != null
                  ? `¥${trayCalc.suggestedSellingPrice.toLocaleString()}`
                  : (trayCalc.estimatedUnitPrice != null ? `¥${Math.ceil(trayCalc.estimatedUnitPrice).toLocaleString()}` : '-')}
              </Text>
            </View>
          </View>

          {/* Appendix Terms & Notes */}
          <View style={styles.termsSection}>
            <Text style={{ fontWeight: 700, marginBottom: 2 }}>【積算に関する特記事項】</Text>
            <Text>
              ・本積算明細書は、最新の原反シート規格および標準成形条件に基づいて算出したものです。\n
              ・発注ロット数や梱包形態（小分け包装等）に変更がある場合、単価が変動することがあります。\n
              ・原材料（プラスチック樹脂）の急激な市況変動が生じた場合、事前に協議の上、価格改定をお願いすることがございます。
            </Text>
            <Text style={styles.closing}>株式会社 ヨシダパッケージ</Text>
          </View>
        </Page>
      )}
    </Document>
  )
}
