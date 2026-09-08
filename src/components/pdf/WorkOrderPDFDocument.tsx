import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer'
import path from 'path'
import type { WOEquipmentSetResult, EquipmentSetMember } from '@/app/production/work-orders/types'

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

export interface WorkOrderPDFProps {
  wo: {
    wo_id: string
    wo_code: string
    wo_name: string
    wo_type: string
    wo_status: string
    start_date: string | null
    deadline: string | null
    company_name: string | null
    product_code: string | null
    product_name: string | null
    responsible_name: string | null
    notes: string | null
  }
  equipmentSet: WOEquipmentSetResult
  qrCodes?: Record<string, string> // Map equipment_id/wo_code to data URL string
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    fontSize: 8.5,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 28,
    backgroundColor: '#ffffff',
    color: '#0F172A',
    lineHeight: 1.3,
  },
  // Top Title Bar
  titleContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#0F172A',
    paddingBottom: 6,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 2,
  },
  titleSub: {
    fontSize: 9,
    color: '#475569',
  },
  companyHeader: {
    textAlign: 'right',
  },
  companyName: {
    fontSize: 10,
    fontWeight: 700,
  },
  companySub: {
    fontSize: 7.5,
    color: '#64748B',
  },

  // Block 1: Header Meta (2 columns)
  metaGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 10,
  },
  metaCol: {
    flex: 1,
    padding: 6,
  },
  metaColDivider: {
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'center',
  },
  metaLabel: {
    width: 65,
    fontSize: 7.5,
    fontWeight: 700,
    color: '#475569',
  },
  metaValue: {
    flex: 1,
    fontSize: 8.5,
    fontWeight: 700,
  },
  woCodeBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0284C7',
  },

  // Block 2: Product Specifications
  sectionHeader: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0284C7',
    marginBottom: 5,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 700,
    color: '#0F172A',
  },
  specTable: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 10,
  },
  specRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  specCellLabel: {
    width: 80,
    backgroundColor: '#F8FAFC',
    padding: 4,
    fontSize: 7.5,
    fontWeight: 700,
    color: '#475569',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  specCellValue: {
    flex: 1,
    padding: 4,
    fontSize: 8,
    fontWeight: 700,
  },

  // Block 3: Equipment SET Table (CORE)
  setTable: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 12,
  },
  setTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  setHeaderCell: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: 700,
    textAlign: 'center',
  },
  setTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 38,
    alignItems: 'center',
  },
  setTableCell: {
    fontSize: 7.5,
    paddingHorizontal: 3,
  },
  rackBadge: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 2,
    paddingVertical: 1,
    paddingHorizontal: 4,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: 700,
    color: '#1D4ED8',
  },
  statusBadgeReady: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
    fontSize: 7,
    fontWeight: 700,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 2,
    textAlign: 'center',
  },
  statusBadgeWait: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    fontSize: 7,
    fontWeight: 700,
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderRadius: 2,
    textAlign: 'center',
  },

  // Block 4: Stamp Boxes (Hanko)
  stampRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  noticeBox: {
    flex: 1,
    marginRight: 16,
    padding: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    borderRadius: 2,
  },
  noticeTitle: {
    fontSize: 7.5,
    fontWeight: 700,
    color: '#334155',
    marginBottom: 2,
  },
  noticeText: {
    fontSize: 6.8,
    color: '#64748B',
    lineHeight: 1.25,
  },
  stampContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#475569',
  },
  stampBox: {
    width: 58,
    height: 52,
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
    alignItems: 'center',
  },
  stampBoxLast: {
    width: 58,
    height: 52,
    alignItems: 'center',
  },
  stampHeader: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    textAlign: 'center',
    fontSize: 7,
    fontWeight: 700,
    color: '#334155',
    paddingVertical: 2,
  },
  stampBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 12,
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 6.5,
    color: '#94A3B8',
  }
})

function getEquipmentTypeLabel(type: string): string {
  switch (type) {
    case 'MOLD': return '成形金型'
    case 'CUTTER_INLINE': return '抜型 (Inline)'
    case 'CUTTER_SEPARATE': return '抜型 (Separate)'
    case 'WATER_BASE': return '水冷ベース'
    case 'PRESSURE_BASE': return '圧空ベース'
    case 'FRAME': return 'クランプフレーム'
    case 'STACKING': return 'スタッキング治具'
    case 'PLUG': return 'プラグアシスト'
    default: return type
  }
}

export const WorkOrderPDFDocument: React.FC<WorkOrderPDFProps> = ({
  wo,
  equipmentSet,
  qrCodes = {},
}) => {
  // Combine all items in SET
  const allItems: EquipmentSetMember[] = []
  if (equipmentSet.primary_mold) {
    allItems.push(equipmentSet.primary_mold)
  }
  if (equipmentSet.set_members && equipmentSet.set_members.length > 0) {
    allItems.push(...equipmentSet.set_members)
  }

  return (
    <Document title={`工程指示票_${wo.wo_code}`}>
      <Page size="A4" orientation="portrait" style={styles.page}>
        
        {/* ── TOP TITLE BAR ── */}
        <View style={styles.titleContainer}>
          <View>
            <Text style={styles.titleText}>工 程 指 示 票</Text>
            <Text style={styles.titleSub}>真空成形・金型セット指示書 (Thermoforming Work Order)</Text>
          </View>
          <View style={styles.companyHeader}>
            <Text style={styles.companyName}>株式会社 吉田金型工業</Text>
            <Text style={styles.companySub}>YOSHIDA MOLD CO., LTD. — 工場生産管理</Text>
          </View>
        </View>

        {/* ── BLOCK 1: HEADER METADATA ── */}
        <View style={styles.metaGrid}>
          {/* Left Column */}
          <View style={[styles.metaCol, styles.metaColDivider]}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>指示番号:</Text>
              <Text style={[styles.metaValue, styles.woCodeBadge]}>{wo.wo_code}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>取引先名:</Text>
              <Text style={styles.metaValue}>{wo.company_name || '—'}</Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>指示名称:</Text>
              <Text style={styles.metaValue}>{wo.wo_name}</Text>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.metaCol}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>発行日:</Text>
              <Text style={styles.metaValue}>
                {wo.start_date ? wo.start_date.slice(0, 10) : new Date().toISOString().slice(0, 10)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>出荷納期:</Text>
              <Text style={[styles.metaValue, { color: '#DC2626' }]}>
                {wo.deadline ? wo.deadline.slice(0, 10) : '—'}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>発行担当:</Text>
              <Text style={styles.metaValue}>{wo.responsible_name || '生産管理部'}</Text>
            </View>
          </View>
        </View>

        {/* ── BLOCK 2: PRODUCT SPECIFICATIONS ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>1. 製品仕様・材料指示 (Product & Material Specifications)</Text>
        </View>
        <View style={styles.specTable}>
          <View style={styles.specRow}>
            <Text style={styles.specCellLabel}>製品型番</Text>
            <Text style={styles.specCellValue}>
              {equipmentSet.product_code || wo.product_code || '—'} {equipmentSet.product_name ? `(${equipmentSet.product_name})` : ''}
            </Text>
            <Text style={styles.specCellLabel}>設計リビジョン</Text>
            <Text style={styles.specCellValue}>
              {equipmentSet.design_code || '—'} (Rev {equipmentSet.revision_number ?? 0})
            </Text>
          </View>
          <View style={styles.specRow}>
            <Text style={styles.specCellLabel}>指定プラスチック</Text>
            <Text style={[styles.specCellValue, { color: '#0369A1' }]}>
              {equipmentSet.plastic_type_designed || '—'}
            </Text>
            <Text style={styles.specCellLabel}>抜き寸法 (Cutline)</Text>
            <Text style={styles.specCellValue}>
              {equipmentSet.cutline_length && equipmentSet.cutline_width 
                ? `${equipmentSet.cutline_length} × ${equipmentSet.cutline_width} mm` 
                : '—'}
            </Text>
          </View>
          <View style={[styles.specRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.specCellLabel}>備考・特記事項</Text>
            <Text style={styles.specCellValue}>
              {wo.notes || '安全第一・異物混入防止・初回ショット寸法検査必須'}
            </Text>
          </View>
        </View>

        {/* ── BLOCK 3: EQUIPMENT SET TABLE (CORE FOCUS) ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            2. 取付設備・治具セット一覧 (Equipment Tooling SET Checklist — {equipmentSet.summary.ready_items}/{equipmentSet.summary.total_items} READY)
          </Text>
        </View>
        <View style={styles.setTable}>
          {/* Table Header */}
          <View style={styles.setTableHeader}>
            <Text style={[styles.setHeaderCell, { width: 22 }]}>No</Text>
            <Text style={[styles.setHeaderCell, { width: 100 }]}>設備種別</Text>
            <Text style={[styles.setHeaderCell, { width: 95 }]}>管理番号</Text>
            <Text style={[styles.setHeaderCell, { flex: 1 }]}>設備名称</Text>
            <Text style={[styles.setHeaderCell, { width: 85 }]}>保管棚番</Text>
            <Text style={[styles.setHeaderCell, { width: 60 }]}>準備状態</Text>
            <Text style={[styles.setHeaderCell, { width: 44 }]}>QR</Text>
          </View>

          {/* Rows */}
          {allItems.length === 0 ? (
            <View style={[styles.setTableRow, { justifyContent: 'center', padding: 8 }]}>
              <Text style={{ fontSize: 8, color: '#94A3B8' }}>設備SET情報が未登録です</Text>
            </View>
          ) : (
            allItems.map((item, idx) => {
              const qrDataUrl = qrCodes[item.equipment_id] || qrCodes[item.equipment_code]
              const isReady = item.readiness_status === 'READY'
              const locationStr = item.rack_code && item.layer_code ? `${item.rack_code}-${item.layer_code}` : (item.layer_code || '未割当')

              return (
                <View key={item.equipment_id || idx} style={styles.setTableRow}>
                  <Text style={[styles.setTableCell, { width: 22, textAlign: 'center', fontWeight: 700 }]}>
                    {idx + 1}
                  </Text>
                  <Text style={[styles.setTableCell, { width: 110, fontWeight: 700 }]}>
                    {getEquipmentTypeLabel(item.equipment_type)}
                  </Text>
                  <Text style={[styles.setTableCell, { width: 95, fontWeight: 700, color: '#0F172A' }]}>
                    {item.equipment_code}
                  </Text>
                  <Text style={[styles.setTableCell, { flex: 1, color: '#334155' }]}>
                    {item.equipment_name}
                  </Text>
                  <View style={{ width: 85, alignItems: 'center' }}>
                    <Text style={styles.rackBadge}>{locationStr}</Text>
                  </View>
                  <View style={{ width: 55, alignItems: 'center' }}>
                    <Text style={isReady ? styles.statusBadgeReady : styles.statusBadgeWait}>
                      {isReady ? 'READY' : item.readiness_status}
                    </Text>
                  </View>
                  <View style={{ width: 44, alignItems: 'center', justifyContent: 'center', padding: 1 }}>
                    {qrDataUrl ? (
                      <Image src={qrDataUrl} style={{ width: 32, height: 32 }} />
                    ) : (
                      <Text style={{ fontSize: 6, color: '#CBD5E1' }}>No QR</Text>
                    )}
                  </View>
                </View>
              )
            })
          )}
        </View>

        {/* ── BLOCK 4: NOTICE & STAMP BOXES ── */}
        <View style={styles.stampRow}>
          {/* Production Notice */}
          <View style={styles.noticeBox}>
            <Text style={styles.noticeTitle}>【作業確認注意事項】</Text>
            <Text style={styles.noticeText}>
              1. 段取り前に上記SET表の金型・抜型・ベース・フレームの番号と棚番を照合し現品を確認すること。{'\n'}
              2. スマートフォンまたはタブレットで上記QRコードを読み取ることで、AR保管場所案内が起動します。{'\n'}
              3. 抜型刃先、金型キャビティ面、水冷接続口に異常がないことを確認してから機械に取り付けること。{'\n'}
              4. 成形完了後は指定棚番へ返却し、管理システムにて位置更新（棚移動）を登録すること。
            </Text>
          </View>

          {/* 3 Hanko Boxes */}
          <View style={styles.stampContainer}>
            <View style={styles.stampBox}>
              <Text style={styles.stampHeader}>承認 (工場長)</Text>
              <View style={styles.stampBody}>
                <Text style={{ fontSize: 6, color: '#CBD5E1' }}>印</Text>
              </View>
            </View>
            <View style={styles.stampBox}>
              <Text style={styles.stampHeader}>確認 (工務)</Text>
              <View style={styles.stampBody}>
                <Text style={{ fontSize: 6, color: '#CBD5E1' }}>印</Text>
              </View>
            </View>
            <View style={styles.stampBoxLast}>
              <Text style={styles.stampHeader}>作業者 (成形)</Text>
              <View style={styles.stampBody}>
                <Text style={{ fontSize: 6, color: '#CBD5E1' }}>印</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <Text>システム出力日: {new Date().toLocaleDateString('ja-JP')} | YSDMS NextGen Production Control</Text>
          <Text>指示書ID: {wo.wo_id}</Text>
        </View>

      </Page>
    </Document>
  )
}
