import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import path from 'path';

// Register Japanese Fonts from local OTF
const fontRegular = path.join(process.cwd(), 'public/fonts/NotoSansJP-Regular.otf');
const fontBold = path.join(process.cwd(), 'public/fonts/NotoSansJP-Bold.otf');

Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: fontRegular, fontWeight: 400 },
    { src: fontBold, fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    fontSize: 8.5,
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 28,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    lineHeight: 1.3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#0066CC',
    paddingBottom: 8,
  },
  titleArea: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0066CC',
    letterSpacing: 1,
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 8,
    color: '#64748B',
  },
  companyArea: {
    width: 170,
    alignItems: 'flex-end',
  },
  companyName: {
    fontSize: 10,
    fontWeight: 700,
  },
  metaText: {
    fontSize: 7.5,
    color: '#475569',
    marginTop: 1,
  },
  // Stamp Box for approval
  stampBoxRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  stampBox: {
    width: 48,
    borderWidth: 0.5,
    borderColor: '#94A3B8',
  },
  stampHeader: {
    fontSize: 7,
    backgroundColor: '#F1F5F9',
    textAlign: 'center',
    paddingVertical: 1.5,
    borderBottomWidth: 0.5,
    borderBottomColor: '#94A3B8',
    color: '#475569',
  },
  stampArea: {
    height: 36,
  },
  // Section Headers
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0066CC',
    marginBottom: 6,
    marginTop: 6,
  },
  // KPI Grid
  kpiGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  kpiCard: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
    borderRadius: 3,
    padding: 6,
    backgroundColor: '#FAFAFA',
  },
  kpiLabel: {
    fontSize: 7.5,
    color: '#64748B',
    marginBottom: 2,
  },
  kpiValue: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0F172A',
  },
  // Tables
  table: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#CBD5E1',
    marginBottom: 8,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 0.5,
    borderBottomColor: '#CBD5E1',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E2E8F0',
  },
  th: {
    fontSize: 7.5,
    fontWeight: 700,
    color: '#334155',
    padding: 3.5,
  },
  td: {
    fontSize: 7.5,
    color: '#1E293B',
    padding: 3,
  },
  textRight: {
    textAlign: 'right',
  },
  textCenter: {
    textAlign: 'center',
  },
  alertText: {
    color: '#DC2626',
    fontWeight: 700,
  },
  footer: {
    position: 'absolute',
    bottom: 16,
    left: 28,
    right: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#CBD5E1',
    paddingTop: 4,
    fontSize: 7,
    color: '#94A3B8',
  },
});

export interface MonthlyQCPDFProps {
  month: string; // 'YYYY-MM'
  issuedDate: string;
  kpis: {
    totalOk: number;
    totalNg: number;
    totalOutput: number;
    ngRate: number;
  };
  groups: {
    key: string;
    labelJA: string;
    count: number;
    pctOfNg: number;
    cumulativePct: number;
  }[];
  machines: {
    rank: number;
    machineCode: string;
    machineName: string;
    totalOk: number;
    totalNg: number;
    ngRate: number;
    isAlert: boolean;
  }[];
  products: {
    rank: number;
    productCode: string;
    productName: string;
    totalOk: number;
    totalNg: number;
    ngRate: number;
  }[];
  reconciliation: {
    totalFormingNg: number;
    totalInspectionNg: number;
    totalCombinedNg: number;
    deltaNg: number;
    inspectedLotsCount: number;
  };
}

export function MonthlyQCPDFDocument({
  month,
  issuedDate,
  kpis,
  groups,
  machines,
  products,
  reconciliation,
}: MonthlyQCPDFProps) {
  const fmt = (n: number) => new Intl.NumberFormat('ja-JP').format(n);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.titleArea}>
            <Text style={styles.mainTitle}>月次品質管理報告書 (QC Report)</Text>
            <Text style={styles.subTitle}>
              対象月: {month} (吉田パッケージ株式会社 成形工場品質実績)
            </Text>
          </View>
          <View style={styles.companyArea}>
            <Text style={styles.companyName}>株式会社 吉田パッケージ (YSD)</Text>
            <Text style={styles.metaText}>発行日: {issuedDate}</Text>
            <Text style={styles.metaText}>文書番号: QC-RPT-{month.replace('-', '')}</Text>
          </View>
        </View>

        {/* Approval Stamp Boxes */}
        <View style={styles.stampBoxRow}>
          <View style={styles.stampBox}>
            <Text style={styles.stampHeader}>承認 (工場長)</Text>
            <View style={styles.stampArea} />
          </View>
          <View style={styles.stampBox}>
            <Text style={styles.stampHeader}>審査 (QC責任者)</Text>
            <View style={styles.stampArea} />
          </View>
          <View style={styles.stampBox}>
            <Text style={styles.stampHeader}>作成 (担当)</Text>
            <View style={styles.stampArea} />
          </View>
        </View>

        {/* 1. Executive Summary KPIs */}
        <Text style={styles.sectionTitle}>1. 月間品質実績サマリー (Executive Summary)</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>総生産数 (Total Output)</Text>
            <Text style={styles.kpiValue}>{fmt(kpis.totalOutput)} pcs</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>良品合計 (Total OK)</Text>
            <Text style={[styles.kpiValue, { color: '#0066CC' }]}>{fmt(kpis.totalOk)} pcs</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>総不良数 (Total NG)</Text>
            <Text style={[styles.kpiValue, { color: '#DC2626' }]}>{fmt(kpis.totalNg)} pcs</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>総不良率 (NG Rate %)</Text>
            <Text style={[styles.kpiValue, kpis.ngRate >= 3.0 ? styles.alertText : { color: '#0F172A' }]}>
              {kpis.ngRate.toFixed(2)}%
            </Text>
          </View>
        </View>

        {/* 2. Forming vs Inspection Reconciliation */}
        <Text style={styles.sectionTitle}>2. 成形・KCS検査品質対照 (Forming vs KCS Reconciliation)</Text>
        <View style={styles.kpiGrid}>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>成形機報告NG (Forming)</Text>
            <Text style={styles.kpiValue}>{fmt(reconciliation.totalFormingNg)} pcs</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>KCS追加検出NG (KCS)</Text>
            <Text style={[styles.kpiValue, { color: '#D97706' }]}>+{fmt(reconciliation.totalInspectionNg)} pcs</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>合算不良数 (Combined NG)</Text>
            <Text style={[styles.kpiValue, { color: '#DC2626' }]}>{fmt(reconciliation.totalCombinedNg)} pcs</Text>
          </View>
          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>検査ロット数 (Inspected Lots)</Text>
            <Text style={styles.kpiValue}>{reconciliation.inspectedLotsCount} lots</Text>
          </View>
        </View>

        {/* 3. Defect Group Pareto Analysis */}
        <Text style={styles.sectionTitle}>3. 不良グループ別構成比・パレート分析 (Pareto Defect Breakdown)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, { width: '8%', textAlign: 'center' }]}>区分</Text>
            <Text style={[styles.th, { width: '38%' }]}>不良グループ名称</Text>
            <Text style={[styles.th, { width: '18%', textAlign: 'right' }]}>不良数 (pcs)</Text>
            <Text style={[styles.th, { width: '18%', textAlign: 'right' }]}>構成比 (%)</Text>
            <Text style={[styles.th, { width: '18%', textAlign: 'right' }]}>累積比率 (%)</Text>
          </View>
          {groups.map((g, idx) => (
            <View key={g.key} style={idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
              <Text style={[styles.td, { width: '8%', textAlign: 'center' }]}>#{idx + 1}</Text>
              <Text style={[styles.td, { width: '38%', fontWeight: 700 }]}>{g.labelJA}</Text>
              <Text style={[styles.td, { width: '18%', textAlign: 'right', color: '#DC2626' }]}>
                {fmt(g.count)}
              </Text>
              <Text style={[styles.td, { width: '18%', textAlign: 'right' }]}>{g.pctOfNg}%</Text>
              <Text style={[styles.td, { width: '18%', textAlign: 'right', fontWeight: 700, color: '#0066CC' }]}>
                {g.cumulativePct}%
              </Text>
            </View>
          ))}
        </View>

        {/* 4. Machine Ranking */}
        <Text style={styles.sectionTitle}>4. 成形機別不良率ランキング (Machine NG Ranking)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, { width: '8%', textAlign: 'center' }]}>順位</Text>
            <Text style={[styles.th, { width: '28%' }]}>成形機コード・機名</Text>
            <Text style={[styles.th, { width: '20%', textAlign: 'right' }]}>良品数 (OK)</Text>
            <Text style={[styles.th, { width: '18%', textAlign: 'right' }]}>不良数 (NG)</Text>
            <Text style={[styles.th, { width: '14%', textAlign: 'right' }]}>不良率 (%)</Text>
            <Text style={[styles.th, { width: '12%', textAlign: 'center' }]}>判定</Text>
          </View>
          {machines.slice(0, 7).map((m, idx) => (
            <View key={m.machineCode} style={idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
              <Text style={[styles.td, { width: '8%', textAlign: 'center' }]}>#{m.rank}</Text>
              <Text style={[styles.td, { width: '28%', fontWeight: 700 }]}>
                {m.machineCode} {m.machineName ? `(${m.machineName})` : ''}
              </Text>
              <Text style={[styles.td, { width: '20%', textAlign: 'right' }]}>{fmt(m.totalOk)}</Text>
              <Text style={[styles.td, { width: '18%', textAlign: 'right', color: '#DC2626' }]}>
                {fmt(m.totalNg)}
              </Text>
              <Text
                style={[
                  styles.td,
                  { width: '14%', textAlign: 'right', fontWeight: 700 },
                  m.isAlert ? styles.alertText : {},
                ]}
              >
                {m.ngRate.toFixed(2)}%
              </Text>
              <Text
                style={[
                  styles.td,
                  { width: '12%', textAlign: 'center', fontSize: 7, fontWeight: 700 },
                  m.isAlert ? styles.alertText : { color: '#059669' },
                ]}
              >
                {m.isAlert ? '要改善' : '正常'}
              </Text>
            </View>
          ))}
        </View>

        {/* 5. Top 5 Product Defect Ranking */}
        <Text style={styles.sectionTitle}>5. 不良多発品番 (Top 5 Defect Products)</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.th, { width: '8%', textAlign: 'center' }]}>順位</Text>
            <Text style={[styles.th, { width: '26%' }]}>品番 (Product Code)</Text>
            <Text style={[styles.th, { width: '30%' }]}>品名 (Product Name)</Text>
            <Text style={[styles.th, { width: '14%', textAlign: 'right' }]}>良品数 (OK)</Text>
            <Text style={[styles.th, { width: '12%', textAlign: 'right' }]}>不良数 (NG)</Text>
            <Text style={[styles.th, { width: '10%', textAlign: 'right' }]}>不良率</Text>
          </View>
          {products.slice(0, 5).map((p, idx) => (
            <View key={p.productCode} style={idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}>
              <Text style={[styles.td, { width: '8%', textAlign: 'center' }]}>#{p.rank}</Text>
              <Text style={[styles.td, { width: '26%', fontWeight: 700, color: '#0066CC' }]}>
                {p.productCode}
              </Text>
              <Text style={[styles.td, { width: '30%' }]}>{p.productName}</Text>
              <Text style={[styles.td, { width: '14%', textAlign: 'right' }]}>{fmt(p.totalOk)}</Text>
              <Text style={[styles.td, { width: '12%', textAlign: 'right', color: '#DC2626' }]}>
                {fmt(p.totalNg)}
              </Text>
              <Text style={[styles.td, { width: '10%', textAlign: 'right', fontWeight: 700 }]}>
                {p.ngRate.toFixed(2)}%
              </Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>YSDMS NextGen — Quality Control Division</Text>
          <Text>Page 1 of 1</Text>
        </View>
      </Page>
    </Document>
  );
}
