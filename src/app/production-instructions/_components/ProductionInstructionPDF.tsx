import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Font, Image,
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
    padding: 20, 
    backgroundColor: '#fff',
    lineHeight: 1.3
  },
  // Main title
  titleArea: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingTop: 4,
  },
  title: { 
    fontSize: 14, 
    fontFamily: 'NotoSansJP', 
    fontWeight: 700, 
    textAlign: 'center',
    lineHeight: 1.2,
  },
  companyName: {
    fontSize: 8,
    color: '#333',
    marginTop: 3,
    lineHeight: 1.2,
  },
  
  // Header block
  headerRow: { 
    flexDirection: 'row', 
    marginBottom: 8, 
    alignItems: 'flex-start',
    gap: 8,
    position: 'relative',
  },
  
  // Packaging checkbox top-left
  bagBox: {
    border: '1.5pt solid #000',
    padding: '6pt 10pt',
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagText: {
    fontSize: 12,
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
  },
  
  // Lot No and Date top-right
  metaInfoBox: {
    border: '1.5pt solid #000',
    width: 140,
  },
  metaInfoRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  metaInfoRowLast: {
    flexDirection: 'row',
  },
  metaInfoLabel: {
    width: 60,
    backgroundColor: '#f5f5f5',
    padding: '3pt 4pt',
    fontSize: 7,
    borderRight: '1pt solid #000',
    fontWeight: 700,
  },
  metaInfoValue: {
    flex: 1,
    padding: '3pt 4pt',
    fontSize: 8,
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
  },

  // Prototype tag (P試作) - Make absolute to avoid squishing the centered title
  prototypeBadge: {
    position: 'absolute',
    top: 4,
    right: 155,
    color: '#dc2626',
    border: '2pt solid #dc2626',
    padding: '2pt 6pt',
    fontSize: 11,
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
    transform: 'rotate(-5deg)',
    zIndex: 10,
  },

  // Checkboxes section
  checkboxSection: {
    flexDirection: 'row',
    border: '1.5pt solid #000',
    padding: '4pt 8pt',
    marginBottom: 8,
    gap: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  checkboxSquare: {
    width: 8,
    height: 8,
    border: '1pt solid #000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCheck: {
    fontSize: 7,
    fontWeight: 700,
    marginTop: -2,
  },
  checkboxLabel: {
    fontSize: 8,
    fontWeight: 700,
  },

  // Grid Table structure
  gridTable: {
    border: '1.5pt solid #000',
    marginBottom: 8,
  },
  gridRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
  },
  gridRowLast: {
    flexDirection: 'row',
  },
  gridColHeader: {
    backgroundColor: '#f5f5f5',
    padding: '4pt 5pt',
    fontSize: 7,
    fontWeight: 700,
    borderRight: '1pt solid #000',
    justifyContent: 'center',
  },
  gridColValue: {
    padding: '4pt 5pt',
    fontSize: 8,
    borderRight: '1pt solid #000',
    justifyContent: 'center',
  },
  gridColValueLast: {
    padding: '4pt 5pt',
    fontSize: 8,
    justifyContent: 'center',
  },

  // Products and specs
  boldText: {
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
  },

  // Drawing section
  drawingSection: {
    flexDirection: 'row',
    border: '1.5pt solid #000',
    height: 180,
    marginBottom: 8,
  },
  drawingTitleColumn: {
    width: 30,
    backgroundColor: '#f5f5f5',
    borderRight: '1pt solid #000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  drawingTitleText: {
    fontSize: 8,
    fontWeight: 700,
    textAlign: 'center',
  },
  drawingContent: {
    flex: 1,
    padding: 8,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawingPlaceholderText: {
    color: '#999',
    fontSize: 10,
    fontFamily: 'NotoSansJP',
  },
  drawingSpecsOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'column',
    gap: 4,
  },
  drawingSpecRow: {
    flexDirection: 'row',
    gap: 4,
  },
  drawingSpecLabel: {
    fontSize: 8,
    color: '#666',
  },
  drawingSpecValue: {
    fontSize: 8,
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
  },

  // Delivery and Mold Bottom section
  bottomGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  deliveryBox: {
    flex: 3,
    border: '1.5pt solid #000',
    padding: 6,
  },
  deliveryTitle: {
    fontSize: 8,
    fontWeight: 700,
    backgroundColor: '#f5f5f5',
    padding: '2pt 4pt',
    marginBottom: 4,
    borderBottom: '1pt solid #000',
  },
  deliveryRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  deliveryLabel: {
    width: 60,
    fontSize: 8,
    color: '#555',
  },
  deliveryValue: {
    flex: 1,
    fontSize: 8,
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
  },
  
  // Mold status card
  moldBox: {
    flex: 2,
    border: '1.5pt solid #000',
    padding: 6,
  },
  moldTitle: {
    fontSize: 8,
    fontWeight: 700,
    backgroundColor: '#f5f5f5',
    padding: '2pt 4pt',
    marginBottom: 4,
    borderBottom: '1pt solid #000',
  },

  // SHOT section
  shotSection: {
    border: '1.5pt solid #000',
    marginBottom: 8,
    padding: 6,
  },
  shotTitle: {
    fontSize: 8,
    fontWeight: 700,
    backgroundColor: '#f5f5f5',
    padding: '2pt 4pt',
    marginBottom: 4,
    borderBottom: '1pt solid #000',
  },
  shotGrid: {
    flexDirection: 'row',
    border: '1pt solid #000',
  },
  shotHeaderCol: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: '3pt 4pt',
    borderRight: '1pt solid #000',
    fontSize: 7,
    fontWeight: 700,
    textAlign: 'center',
  },
  shotValueCol: {
    flex: 1,
    padding: '3pt 4pt',
    borderRight: '1pt solid #000',
    fontSize: 8,
    textAlign: 'center',
  },
  shotColLast: {
    borderRight: '0pt',
  },

  // Signature Block
  signatureRow: { 
    flexDirection: 'row', 
    gap: 8, 
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  signatureBox: { 
    width: 65, 
    border: '1.5pt solid #000', 
    height: 45, 
    padding: 2,
    alignItems: 'center',
  },
  signatureLabel: { 
    fontSize: 7, 
    color: '#000', 
    fontWeight: 700,
    marginBottom: 2,
    textAlign: 'center',
    borderRight: '1pt solid #000',
    borderBottom: '0.5pt solid #ddd',
  },
  
  // Footer
  footer: { 
    position: 'absolute', 
    bottom: 12, 
    left: 20, 
    right: 20, 
    textAlign: 'right', 
    fontSize: 7, 
    color: '#999' 
  },
  // Tags Section
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 6,
    padding: '2pt 0pt',
  },
  tagBadge: {
    padding: '2pt 6pt',
    fontSize: 7.5,
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
    borderRadius: 2,
    border: '1pt solid #000',
  },
  tagRed: {
    color: '#dc2626',
    borderColor: '#dc2626',
    backgroundColor: '#fff5f5',
  },
  tagBlack: {
    color: '#000',
    borderColor: '#000',
    backgroundColor: '#ffffff',
  },
})

// Checkbox helper component
function Checkbox({ label, checked }: { label: string; checked: boolean }) {
  return (
    <View style={styles.checkboxItem}>
      <View style={styles.checkboxSquare}>
        {checked && <Text style={styles.checkboxCheck}>✓</Text>}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </View>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductionInstructionPDF({ pi, revision, locale = 'ja' }: { pi: any; revision: any; locale?: string }) {
  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })

  // Document Title based on template
  const templateTitles: Record<string, string> = {
    HAE: '注文書 / 納入指示書（成形）',
    NLC: '生産指示書 (NLC様式)',
    SMK: '製造指示書 (SMK様式)',
    YAE: '生産指示書 (YAE様式)',
    GENERAL: '生産指示書',
  }
  const docTitle = templateTitles[pi.template_type] ?? '生産指示書'

  // Features check
  const hasAntistatic = pi.antistatic || false
  const hasSilicon = pi.silicon || false
  const hasSurfaceCoating = pi.surface_coating || false
  
  // Checkboxes resolution
  const isBag = pi.wrap_in_plastic_bag || pi.packaging_type === 'BAG'
  const isChamfer = !!revision?.chamfer_c
  const isSeparateCutter = !!revision?.has_separate_cutter

  // Process Tags
  const rawTags = pi.production_instruction_tags || []
  const TAG_PRIORITY_ORDER = ['URGENT', 'PROTOTYPE', 'FIRST_RUN', 'QUALITY_HOLD']
  const sortedTags = [...rawTags].sort((a: any, b: any) => {
    const aCode = a.tag_code
    const bCode = b.tag_code
    const aIndex = aCode ? TAG_PRIORITY_ORDER.indexOf(aCode) : -1
    const bIndex = bCode ? TAG_PRIORITY_ORDER.indexOf(bCode) : -1
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
    if (aIndex !== -1 && bIndex === -1) return -1
    if (bIndex !== -1 && aIndex === -1) return 1
    if (aCode && !bCode) return -1
    if (bCode && !aCode) return 1
    const aPriority = a.production_tag_master?.priority ?? 999
    const bPriority = b.production_tag_master?.priority ?? 999
    return aPriority - bPriority
  })

  const maxHeaderTags = 8
  const headerTags = sortedTags.length > maxHeaderTags 
    ? sortedTags.slice(0, 7) 
    : sortedTags
  const hasOverflow = sortedTags.length > maxHeaderTags
  const overflowCount = sortedTags.length - 7
  const overflowTags = sortedTags.length > maxHeaderTags 
    ? sortedTags.slice(7) 
    : []

  const overflowText = overflowTags.map((t: any) => {
    return t.tag_code ? (t.production_tag_master?.label_ja || t.tag_code) : t.custom_label
  }).join(', ')

  const tText = (text: string) => text
  const additionalTagHeader = tText(locale === 'vi' ? '【Chỉ thị bổ sung】' : '【追加タグ】')
  const notesText = [
    hasOverflow ? `${additionalTagHeader}: ${overflowText}` : null,
    pi.notes
  ].filter(Boolean).join('\n')

  return (
    <Document title={pi.instruction_no} author="YSD">
      <Page size="A4" style={styles.page}>

        {/* Top Header Row */}
        <View style={styles.headerRow}>
          {/* Packaging Box */}
          <View style={styles.bagBox}>
            <Text style={styles.bagText}>{isBag ? '袋詰め' : '箱詰め'}</Text>
          </View>

          {/* Title Area */}
          <View style={styles.titleArea}>
            <Text style={styles.title}>{docTitle}</Text>
            <Text style={styles.companyName}>株式会社 ヨシダパッケージ</Text>
          </View>

          {/* Prototype Stamp */}
          {pi.is_first_time && (
            <View style={styles.prototypeBadge}>
              <Text>P試作</Text>
            </View>
          )}

          {/* Meta Info Box */}
          <View style={styles.metaInfoBox}>
            <View style={styles.metaInfoRow}>
              <Text style={styles.metaInfoLabel}>伝票/LOT No.</Text>
              <Text style={styles.metaInfoValue}>{pi.lot_no || pi.instruction_no}</Text>
            </View>
            <View style={styles.metaInfoRowLast}>
              <Text style={styles.metaInfoLabel}>製造/予定日</Text>
              <Text style={styles.metaInfoValue}>{pi.requested_date}</Text>
            </View>
          </View>
        </View>

        {/* Indication Tags Area */}
        {sortedTags.length > 0 && (
          <View style={styles.tagContainer}>
            {headerTags.map((tag: any, idx: number) => {
              const label = tag.tag_code ? (tag.production_tag_master?.label_ja || tag.tag_code) : tag.custom_label
              const printStyle = tag.production_tag_master?.print_style || 'default'
              const isRed = printStyle === 'red' || printStyle === 'red_bold'
              return (
                <View key={idx} style={[styles.tagBadge, isRed ? styles.tagRed : styles.tagBlack]}>
                  <Text>{label}</Text>
                </View>
              )
            })}
            {hasOverflow && (
              <View style={[styles.tagBadge, styles.tagRed, { borderStyle: 'dashed' }]}>
                <Text>+{overflowCount}</Text>
              </View>
            )}
          </View>
        )}

        {/* Checkbox Controls section */}
        <View style={styles.checkboxSection}>
          <Checkbox label="袋詰め" checked={isBag} />
          <Checkbox label="無地ケース" checked={pi.plain_case || false} />
          <Checkbox label="無地ラベル" checked={pi.plain_label || false} />
          <Checkbox label="接着印刷シート" checked={pi.adhesive_sheet || false} />
          <Checkbox label="面取り" checked={isChamfer} />
          <Checkbox label="別抜き" checked={isSeparateCutter} />
          <Checkbox label="P" checked={false} />
          <Checkbox label="N" checked={false} />
        </View>

        {/* Products and Material Details Grid Table */}
        <View style={styles.gridTable}>
          {/* Header Row */}
          <View style={styles.gridRow}>
            <View style={[styles.gridColHeader, { width: '25%' }]}><Text>品番</Text></View>
            <View style={[styles.gridColHeader, { width: '8%' }]}><Text>日々</Text></View>
            <View style={[styles.gridColHeader, { width: '8%' }]}><Text>ガス圧</Text></View>
            <View style={[styles.gridColHeader, { width: '12%' }]}><Text>型</Text></View>
            <View style={[styles.gridColHeader, { width: '8%' }]}><Text>巾</Text></View>
            <View style={[styles.gridColHeader, { width: '12%' }]}><Text>ショリケイ</Text></View>
            <View style={[styles.gridColHeader, { width: '7%' }]}><Text>列数</Text></View>
            <View style={[styles.gridColHeader, { width: '10%' }]}><Text>納期</Text></View>
            <View style={[styles.gridColHeader, { width: '10%', borderRightWidth: 0 }]}><Text>数量</Text></View>
          </View>

          {/* Data Row */}
          <View style={styles.gridRow}>
            <View style={[styles.gridColValue, { width: '25%' }]}><Text style={styles.boldText}>{pi.products?.product_code || ''}</Text></View>
            <View style={[styles.gridColValue, { width: '8%' }]}><Text>{pi.daily_quantity ? `${pi.daily_quantity.toLocaleString()}枚` : ''}</Text></View>
            <View style={[styles.gridColValue, { width: '8%' }]}><Text>{revision?.gas_pressure || ''}</Text></View>
            <View style={[styles.gridColValue, { width: '12%' }]}><Text style={styles.boldText}>{pi.physical_molds?.system_code || revision?.customer_equipment_no || ''}</Text></View>
            <View style={[styles.gridColValue, { width: '8%' }]}><Text>{pi.material_width ? `${pi.material_width}mm` : ''}</Text></View>
            <View style={[styles.gridColValue, { width: '12%' }]}><Text>{revision?.setup_type || ''}</Text></View>
            <View style={[styles.gridColValue, { width: '7%' }]}><Text>{revision?.cavity_count || ''}</Text></View>
            <View style={[styles.gridColValue, { width: '10%' }]}><Text>{pi.requested_date || ''}</Text></View>
            <View style={[styles.gridColValueLast, { width: '10%', alignItems: 'flex-end' }]}><Text style={styles.boldText}>{(pi.quantity_ordered ?? 0).toLocaleString()} 枚</Text></View>
          </View>

          {/* Material row (Headers) */}
          <View style={styles.gridRow}>
            <View style={[styles.gridColHeader, { width: '20%' }]}><Text>材料仕様</Text></View>
            <View style={[styles.gridColHeader, { width: '8%' }]}><Text>厚み</Text></View>
            <View style={[styles.gridColHeader, { width: '8%' }]}><Text>シート巾</Text></View>
            <View style={[styles.gridColHeader, { width: '10%' }]}><Text>粉砕材</Text></View>
            <View style={[styles.gridColHeader, { width: '24%' }]}><Text>特殊 (帯電/シリコン/塗布)</Text></View>
            <View style={[styles.gridColHeader, { width: '30%', borderRightWidth: 0 }]}><Text>品名 (YSD)</Text></View>
          </View>

          {/* Material row (Values) */}
          <View style={styles.gridRowLast}>
            <View style={[styles.gridColValue, { width: '20%' }]}><Text>{pi.material_spec || pi.products?.primary_plastic_spec || ''}</Text></View>
            <View style={[styles.gridColValue, { width: '8%' }]}><Text>{pi.material_thickness ? `${pi.material_thickness}t` : ''}</Text></View>
            <View style={[styles.gridColValue, { width: '8%' }]}><Text>{pi.material_width ? `${pi.material_width}mm` : ''}</Text></View>
            <View style={[styles.gridColValue, { width: '10%' }]}><Text>{pi.recycled_pct > 0 ? `${pi.recycled_pct}%` : 'なし'}</Text></View>
            <View style={[styles.gridColValue, { width: '24%' }]}>
              <Text>
                {[
                  hasAntistatic && '帯電防止',
                  hasSilicon && 'シリコン',
                  hasSurfaceCoating && '塗布'
                ].filter(Boolean).join(' / ') || 'なし'}
              </Text>
            </View>
            <View style={[styles.gridColValueLast, { width: '30%' }]}><Text style={{ fontSize: 7.5 }}>{pi.products?.product_name || ''}</Text></View>
          </View>
        </View>

        {/* Products drawing & Cutline block */}
        <View style={styles.drawingSection}>
          <View style={styles.drawingTitleColumn}>
            <Text style={styles.drawingTitleText}>製</Text>
            <Text style={styles.drawingTitleText}>品</Text>
            <Text style={styles.drawingTitleText}>図</Text>
            <Text style={styles.drawingTitleText}>/</Text>
            <Text style={styles.drawingTitleText}>C</Text>
            <Text style={styles.drawingTitleText}>U</Text>
            <Text style={styles.drawingTitleText}>T</Text>
            <Text style={styles.drawingTitleText}> </Text>
            <Text style={styles.drawingTitleText}>L</Text>
            <Text style={styles.drawingTitleText}>I</Text>
            <Text style={styles.drawingTitleText}>N</Text>
            <Text style={styles.drawingTitleText}>E</Text>
          </View>
          <View style={styles.drawingContent}>
            {/* Specs Overlay */}
            <View style={styles.drawingSpecsOverlay}>
              <View style={styles.drawingSpecRow}>
                <Text style={styles.drawingSpecLabel}>CUT LINE:</Text>
                <Text style={styles.drawingSpecValue}>
                  {revision?.cutline_length && revision?.cutline_width 
                    ? `${revision.cutline_length} × ${revision.cutline_width}` 
                    : ''}
                </Text>
              </View>
              <View style={styles.drawingSpecRow}>
                <Text style={styles.drawingSpecLabel}>完寸公差:</Text>
                <Text style={styles.drawingSpecValue}>{revision?.tolerance_pitch || ''}</Text>
              </View>
            </View>

            {/* If design revision has drawing image, render it, else show blank */}
            {revision?.drawing_pdf_path ? (
              <Image src={revision.drawing_pdf_path} style={{ maxHeight: '90%', maxWidth: '90%' }} />
            ) : (
              <Text style={styles.drawingPlaceholderText}>[ 製品図・CUT LINE 図面エリア ]</Text>
            )}
          </View>
        </View>

        {/* Delivery Address and Mold Status Bottom Area */}
        <View style={styles.bottomGrid}>
          {/* Delivery Site details */}
          <View style={styles.deliveryBox}>
            <Text style={styles.deliveryTitle}>納入先情報</Text>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryLabel}>納入先名</Text>
              <Text style={styles.deliveryValue}>{pi.delivery_sites?.site_name || ''}</Text>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryLabel}>住所</Text>
              <Text style={styles.deliveryValue}>{pi.delivery_sites?.site_address || ''}</Text>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryLabel}>連絡先</Text>
              <Text style={styles.deliveryValue}>
                {pi.delivery_sites?.contact_person 
                  ? `${pi.delivery_sites.contact_person}  TEL: ${pi.delivery_sites?.site_tel || ''}` 
                  : ''}
              </Text>
            </View>
          </View>

          {/* Physical Mold Reference details */}
          <View style={styles.moldBox}>
            <Text style={styles.moldTitle}>使用金型情報</Text>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryLabel}>金型No.</Text>
              <Text style={styles.deliveryValue}>{pi.physical_molds?.system_code || ''}</Text>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryLabel}>金型名称</Text>
              <Text style={styles.deliveryValue}>{pi.physical_molds?.display_name || ''}</Text>
            </View>
            <View style={styles.deliveryRow}>
              <Text style={styles.deliveryLabel}>備考</Text>
              <Text style={styles.deliveryValue}>{pi.physical_molds?.notes || ''}</Text>
            </View>
          </View>
        </View>

        {/* SHOT count confirmation and logistics area */}
        <View style={styles.shotSection}>
          <Text style={styles.shotTitle}>SHOT 内訳確認引取り</Text>
          <View style={styles.shotGrid}>
            <Text style={styles.shotHeaderCol}>累計SHOT</Text>
            <Text style={styles.shotHeaderCol}>ショット数</Text>
            <Text style={styles.shotHeaderCol}>良品数</Text>
            <Text style={styles.shotHeaderCol}>不良数</Text>
            <Text style={[styles.shotHeaderCol, styles.shotColLast]}>引取確認者</Text>
          </View>
          <View style={[styles.shotGrid, { borderTopWidth: 0 }]}>
            <Text style={styles.shotValueCol}></Text>
            <Text style={styles.shotValueCol}></Text>
            <Text style={styles.shotValueCol}></Text>
            <Text style={styles.shotValueCol}></Text>
            <Text style={[styles.shotValueCol, styles.shotColLast]}></Text>
          </View>
        </View>

        {/* Notes (備考) */}
        {notesText ? (
          <View style={[styles.gridTable, { backgroundColor: '#fffbeb', padding: 6, marginBottom: 8 }]}>
            <Text style={{ fontSize: 7, fontWeight: 700, marginBottom: 2 }}>備考</Text>
            <Text style={{ fontSize: 8 }}>{notesText}</Text>
          </View>
        ) : null}

        {/* Signature Box (社長 / 品課 / プレス / 包装) */}
        <View style={styles.signatureRow}>
          {['社長', '品課', 'プレス', '包装'].map(label => (
            <View key={label} style={styles.signatureBox}>
              <Text style={styles.signatureLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          YSD Management System — {pi.instruction_no} — {today}
        </Text>

      </Page>
    </Document>
  )
}
