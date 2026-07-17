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
  page: { fontFamily: 'NotoSansJP', fontSize: 9, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 14, fontFamily: 'NotoSansJP', fontWeight: 700, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 8, textAlign: 'center', color: '#666', marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 2 },
  label: { width: 100, color: '#555' },
  value: { flex: 1, fontFamily: 'NotoSansJP', fontWeight: 700 },
  section: { marginBottom: 8, padding: 6, border: '1pt solid #ddd', borderRadius: 3 },
  sectionTitle: { fontSize: 8, fontFamily: 'NotoSansJP', fontWeight: 700, color: '#444', marginBottom: 4, textTransform: 'uppercase' },
  grid2: { flexDirection: 'row', gap: 8 },
  col: { flex: 1 },
  warningBadge: { backgroundColor: '#FFF3CD', border: '1pt solid #FFC107', padding: '3pt 6pt', borderRadius: 3, marginBottom: 8, fontSize: 8, color: '#856404' },
  signatureRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  signatureBox: { flex: 1, border: '1pt solid #999', height: 40, padding: 4 },
  signatureLabel: { fontSize: 7, color: '#666', marginBottom: 2 },
  footer: { position: 'absolute', bottom: 12, left: 20, right: 20, textAlign: 'right', fontSize: 7, color: '#999' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, alignItems: 'flex-start' },
  logoArea: { width: 80, height: 24, backgroundColor: '#1a56db', borderRadius: 3, padding: 4 },
  logoText: { color: '#fff', fontSize: 11, fontFamily: 'NotoSansJP', fontWeight: 700 },
  instrNoBox: { border: '1.5pt solid #333', padding: '4pt 10pt', borderRadius: 3 },
  instrNoLabel: { fontSize: 7, color: '#555' },
  instrNo: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Courier' },
})

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ProductionInstructionPDF({ pi }: { pi: any }) {
  const features = [
    pi.antistatic && '帯電防止',
    pi.silicon && 'シリコン',
    pi.surface_coating && '塗布',
  ].filter(Boolean).join(' / ')

  const today = new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })

  // Template-specific title
  const templateTitles: Record<string, string> = {
    HAE: '生産指示書 (HAE様式)',
    NLC: '生産指示書 (NLC様式)',
    SMK: '製造指示書 (SMK様式)',
    YAE: '生産指示書 (YAE様式)',
    GENERAL: '生産指示書',
  }
  const docTitle = templateTitles[pi.template_type] ?? '生産指示書'

  return (
    <Document title={pi.instruction_no} author="YSD">
      <Page size="A4" style={styles.page}>

        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoArea}>
            <Text style={styles.logoText}>YSD</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.title}>{docTitle}</Text>
            <Text style={styles.subtitle}>発行日: {today}</Text>
          </View>
          <View style={styles.instrNoBox}>
            <Text style={styles.instrNoLabel}>伝票No.</Text>
            <Text style={styles.instrNo}>{pi.instruction_no}</Text>
          </View>
        </View>

        {/* Material stock warning banner */}
        {pi.material_stock_warning && (
          <View style={styles.warningBadge}>
            <Text>⚠ 発行時点で材料在庫が不足していました (在庫: {pi.material_stock_qty ?? '?'} 枚)</Text>
          </View>
        )}

        {/* Customer & delivery info */}
        <View style={[styles.section, { backgroundColor: '#F8FAFC' }]}>
          <Text style={styles.sectionTitle}>客先・納入先</Text>
          <View style={styles.grid2}>
            <View style={styles.col}>
              <Row label="客先" value={pi.orders?.companies?.company_name ?? ''} />
              <Row label="受注No." value={pi.orders?.order_no ?? ''} />
            </View>
            <View style={styles.col}>
              <Row label="納入先" value={pi.delivery_sites?.site_name ?? ''} />
              <Row label="住所" value={pi.delivery_sites?.site_address ?? ''} />
            </View>
          </View>
        </View>

        {/* Product info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>製品情報</Text>
          <View style={styles.grid2}>
            <View style={styles.col}>
              <Row label="品番" value={pi.products?.product_code ?? ''} />
              <Row label="品名" value={pi.products?.product_name ?? ''} />
            </View>
            <View style={styles.col}>
              <Row label="図番" value={pi.products?.drawing_no ?? ''} />
              <Row label="テンプレート" value={pi.template_type} />
            </View>
          </View>
        </View>

        {/* Production info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>生産情報</Text>
          <View style={styles.grid2}>
            <View style={styles.col}>
              <Row label="生産拠点" value={pi.production_site ?? ''} />
              <Row label="数量" value={`${(pi.quantity_ordered ?? 0).toLocaleString()} 枚`} />
              <Row label="入数" value={pi.quantity_per_stack ? `${pi.quantity_per_stack} 枚/段` : ''} />
            </View>
            <View style={styles.col}>
              <Row label="納期" value={pi.requested_date ?? ''} />
              <Row label="LOT No." value={pi.lot_no ?? ''} />
              <Row label="初回" value={pi.is_first_time ? '✓ 初回' : ''} />
              <Row label="ラベル" value={pi.has_label ? '✓ 要ラベル' : ''} />
            </View>
          </View>
        </View>

        {/* Material info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>材料</Text>
          <View style={styles.grid2}>
            <View style={styles.col}>
              <Row label="材料" value={pi.material_spec ?? ''} />
              <Row label="厚み" value={pi.material_thickness ? `${pi.material_thickness}t` : ''} />
            </View>
            <View style={styles.col}>
              <Row label="シート巾" value={pi.material_width ? `${pi.material_width}mm` : ''} />
              <Row label="特殊" value={features} />
              <Row label="粉砕材" value={pi.recycled_pct > 0 ? `${pi.recycled_pct}%` : 'なし'} />
            </View>
          </View>
        </View>

        {/* Notes */}
        {pi.notes && (
          <View style={[styles.section, { backgroundColor: '#FFFBEB' }]}>
            <Text style={styles.sectionTitle}>備考</Text>
            <Text style={{ fontSize: 9 }}>{pi.notes}</Text>
          </View>
        )}

        {/* Signature boxes */}
        <View style={styles.signatureRow}>
          {['担当', '確認', '承認'].map(label => (
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
