import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import path from 'path';
import type { EquipmentLoanItem, LoanType } from '@/app/equipment/loans/types';

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

export interface MoldLoanPDFProps {
  loan: EquipmentLoanItem;
  equipmentSpecs?: {
    dimensions?: string | null;
    actual_weight?: string | null;
    material_spec?: string | null;
    piece_count?: number | null;
  };
  type?: LoanType;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: 'NotoSansJP',
    fontSize: 9,
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 32,
    backgroundColor: '#ffffff',
    color: '#0F172A',
    lineHeight: 1.35,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  recipientBox: {
    width: 250,
  },
  recipientName: {
    fontSize: 13,
    fontWeight: 700,
    borderBottomWidth: 1.5,
    borderBottomColor: '#0F172A',
    paddingBottom: 4,
    marginBottom: 4,
  },
  recipientSub: {
    fontSize: 8.5,
    color: '#475569',
  },
  issuerBox: {
    width: 200,
    alignItems: 'flex-end',
    textAlign: 'right',
  },
  dateText: {
    fontSize: 8.5,
    color: '#475569',
    marginBottom: 4,
  },
  issuerName: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 2,
  },
  issuerInfo: {
    fontSize: 7.5,
    color: '#475569',
    lineHeight: 1.25,
  },
  sealBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 6,
  },
  sealBox: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  sealLabel: {
    fontSize: 6.5,
    color: '#64748B',
    marginBottom: 2,
  },
  sealStampPlaceholder: {
    fontSize: 7,
    color: '#CBD5E1',
    marginTop: 8,
  },
  titleArea: {
    textAlign: 'center',
    marginVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: '#0F172A',
    paddingBottom: 6,
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 2,
    color: '#0F172A',
  },
  subTitle: {
    fontSize: 8.5,
    color: '#64748B',
    marginTop: 2,
  },
  pledgeText: {
    fontSize: 8.5,
    color: '#334155',
    marginBottom: 14,
    lineHeight: 1.45,
    textAlign: 'justify',
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#0D9488',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    minHeight: 20,
    alignItems: 'center',
  },
  tableHeaderCol: {
    width: '25%',
    backgroundColor: '#F8FAFC',
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 8,
    fontWeight: 700,
    color: '#475569',
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
  },
  tableValueCol: {
    width: '75%',
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 8.5,
    color: '#0F172A',
  },
  twoColValue: {
    width: '25%',
    paddingVertical: 4,
    paddingHorizontal: 6,
    fontSize: 8.5,
    color: '#0F172A',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  // Placard Banner required by Japanese accounting (SHI-HITEC)
  placardContainer: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
    padding: 8,
    marginBottom: 12,
  },
  placardHeader: {
    fontSize: 8,
    fontWeight: 700,
    color: '#0F766E',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 1,
  },
  placardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  placardCell: {
    width: '48%',
    fontSize: 7.5,
    color: '#134E4A',
  },
  placardCellBold: {
    fontWeight: 700,
  },
  // Photos Area
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  photoBox: {
    flex: 1,
    height: 120,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  photoImg: {
    maxHeight: 100,
    maxWidth: '100%',
    objectFit: 'contain',
  },
  photoPlaceholderText: {
    fontSize: 7.5,
    color: '#94A3B8',
    textAlign: 'center',
  },
  photoCaption: {
    fontSize: 7.5,
    fontWeight: 700,
    color: '#475569',
    marginTop: 3,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 7,
    color: '#94A3B8',
  },
  footerBarcode: {
    fontSize: 8,
    fontFamily: 'NotoSansJP',
    fontWeight: 700,
    color: '#64748B',
  },
});

export const MoldLoanPDFDocument: React.FC<MoldLoanPDFProps> = ({
  loan,
  equipmentSpecs,
  type = loan.loan_type,
}) => {
  const isCustody = type === 'CUSTOMER_LOAN';
  const isReturn = type === 'RETURN_TO_CUSTOMER';
  const isOutsource = type === 'OUTSOURCE_PROCESSING';

  // Determine Titles and Document Heading
  let titleText = '金型借用書 (兼 預り証)';
  let subTitleText = 'MOLD CUSTODY & LOAN CERTIFICATE';
  let pledgeStatement =
    '貴社所有の下記金型をお預かり（借用）いたしましたことを証します。本金型は貴社向け成形トレー製品の製造目的にのみ使用し、善良なる管理者の注意をもって適切に保管・維持管理いたします。';

  let recipientTitle = `${loan.from_company_name || '客先企業'} 御中`;

  if (isReturn) {
    titleText = '金型返却書 (現品受渡確認票)';
    subTitleText = 'MOLD RETURN & DELIVERY CONFIRMATION SLIP';
    pledgeStatement =
      '貴社所有の下記金型につきまして、成形トレー製造契約の終了（またはお引き取り要請）に伴い、現品を貴社へ返却・引き渡しいたしましたことを証します。内容をご確認のうえ受領印をお願い申し上げます。';
    recipientTitle = `${loan.to_company_name || '客先企業'} 御中`;
  } else if (isOutsource) {
    titleText = '金型外注加工・修理依頼書 (兼 送付状)';
    subTitleText = 'OUTSOURCE MACHINING & REPAIR DISPATCH SLIP';
    pledgeStatement =
      '下記金型の外注加工（再研磨・テフロン加工・修理等）を依頼いたします。作業完了後は所定の検査の上、速やかに当社へご返却いただきますようお願いいたします。';
    recipientTitle = `${loan.to_company_name || '加工委託先企業'} 御中`;
  }

  const dimensions = equipmentSpecs?.dimensions || '—';
  const weight = equipmentSpecs?.actual_weight ? `${equipmentSpecs.actual_weight} kg` : '—';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 1. Header: Recipient & Issuer */}
        <View style={styles.headerRow}>
          <View style={styles.recipientBox}>
            <Text style={styles.recipientName}>{recipientTitle}</Text>
            <Text style={styles.recipientSub}>
              {isCustody && '（金型所有者 / 貸出人）'}
              {isReturn && '（金型所有者 / 返却先）'}
              {isOutsource && '（加工委託先 / 外注先）'}
            </Text>
          </View>

          <View style={styles.issuerBox}>
            <Text style={styles.dateText}>発行日: {loan.loan_date || new Date().toISOString().slice(0, 10)}</Text>
            <Text style={styles.dateText}>管理番号: {loan.loan_code}</Text>
            <Text style={styles.issuerName}>株式会社ヨシダパッケージ</Text>
            <Text style={styles.issuerInfo}>〒212-0055 神奈川県川崎市幸区南加瀬5-36-6</Text>
            <Text style={styles.issuerInfo}>TEL: 044-588-1621 / FAX: 044-588-7000</Text>
            <Text style={styles.issuerInfo}>担当者: {loan.requested_by_name || '金型管理部'}</Text>

            {/* Seal Box */}
            <View style={styles.sealBoxContainer}>
              <View style={styles.sealBox}>
                <Text style={styles.sealLabel}>代表取締役</Text>
                <Text style={styles.sealStampPlaceholder}>〔 社 判 〕</Text>
              </View>
              <View style={styles.sealBox}>
                <Text style={styles.sealLabel}>管理責任者</Text>
                <Text style={styles.sealStampPlaceholder}>〔 印 〕</Text>
              </View>
              {isReturn && (
                <View style={styles.sealBox}>
                  <Text style={styles.sealLabel}>貴社受領印</Text>
                  <Text style={styles.sealStampPlaceholder}>〔 印 〕</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 2. Main Title */}
        <View style={styles.titleArea}>
          <Text style={styles.mainTitle}>{titleText}</Text>
          <Text style={styles.subTitle}>{subTitleText}</Text>
        </View>

        {/* 3. Pledge Statement */}
        <Text style={styles.pledgeText}>{pledgeStatement}</Text>

        {/* 4. Equipment Specifications Table */}
        <Text style={styles.sectionTitle}>1. 対象金型明細 (Tooling Specification)</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCol}>金型管理番号 (型番)</Text>
            <Text style={styles.tableValueCol}>{loan.equipment_code} ({loan.equipment_name || '金型本体'})</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCol}>設備種別 (Type)</Text>
            <Text style={styles.tableValueCol}>{loan.equipment_type}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCol}>外形寸法 (L×W×H)</Text>
            <Text style={styles.twoColValue}>{dimensions}</Text>
            <Text style={styles.tableHeaderCol}>本体重量 (Weight)</Text>
            <Text style={styles.twoColValue}>{weight}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCol}>所有者 (Owner)</Text>
            <Text style={styles.twoColValue}>{isCustody ? loan.from_company_name : loan.to_company_name}</Text>
            <Text style={styles.tableHeaderCol}>保管場所 (Location)</Text>
            <Text style={styles.twoColValue}>ヨシダパッケージ本社工場</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCol}>受託/返却日 (Date)</Text>
            <Text style={styles.twoColValue}>{loan.loan_date}</Text>
            <Text style={styles.tableHeaderCol}>予定期日 (Deadline)</Text>
            <Text style={styles.twoColValue}>{loan.scheduled_return_date || '契約期間中 (随時)'}</Text>
          </View>
          {loan.purpose && (
            <View style={styles.tableRow}>
              <Text style={styles.tableHeaderCol}>目的 / 用途</Text>
              <Text style={styles.tableValueCol}>{loan.purpose}</Text>
            </View>
          )}
          {loan.condition_notes && (
            <View style={styles.tableRow}>
              <Text style={styles.tableHeaderCol}>現品状態・備考</Text>
              <Text style={styles.tableValueCol}>{loan.condition_notes}</Text>
            </View>
          )}
        </View>

        {/* 5. Placard Banner required by Japanese accounting (SHI-HITEC Placard) */}
        {isCustody && (
          <View style={styles.placardContainer}>
            <Text style={styles.placardHeader}>【 撮影用看板 (資産特定プレート規格) 】</Text>
            <View style={styles.placardGrid}>
              <Text style={styles.placardCell}>
                型番: <Text style={styles.placardCellBold}>{loan.equipment_code}</Text>
              </Text>
              <Text style={styles.placardCell}>
                品名: <Text style={styles.placardCellBold}>{loan.equipment_name || 'トレー金型'}</Text>
              </Text>
              <Text style={styles.placardCell}>
                寸法: <Text style={styles.placardCellBold}>{dimensions}</Text>
              </Text>
              <Text style={styles.placardCell}>
                重量: <Text style={styles.placardCellBold}>{weight}</Text>
              </Text>
              <Text style={styles.placardCell}>
                資産所有者: <Text style={styles.placardCellBold}>{loan.from_company_name}</Text>
              </Text>
              <Text style={styles.placardCell}>
                保管者: <Text style={styles.placardCellBold}>株式会社ヨシダパッケージ</Text>
              </Text>
            </View>
          </View>
        )}

        {/* 6. Photo Attachments Area (全体写真 + 銘板写真) */}
        <Text style={styles.sectionTitle}>2. 現品写真添付欄 (固定資産写真 / Photographic Record)</Text>
        <View style={styles.photosContainer}>
          <View style={styles.photoBox}>
            {loan.photo_overall_url ? (
              <Image src={loan.photo_overall_url} style={styles.photoImg} />
            ) : (
              <Text style={styles.photoPlaceholderText}>[ 全体写真添付欄 ]{"\n"}(金型外観・看板を含む全体像)</Text>
            )}
            <Text style={styles.photoCaption}>① 全体写真 (Overall View)</Text>
          </View>
          <View style={styles.photoBox}>
            {loan.photo_nameplate_url ? (
              <Image src={loan.photo_nameplate_url} style={styles.photoImg} />
            ) : (
              <Text style={styles.photoPlaceholderText}>[ 拡大写真添付欄 ]{"\n"}(銘板・型番刻印の拡大)</Text>
            )}
            <Text style={styles.photoCaption}>② 拡大写真・刻印 (Nameplate View)</Text>
          </View>
        </View>

        {/* 7. Footer */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            YSDMS NextGen - 金型資産借用・預託管理システム | {loan.loan_code}
          </Text>
          <Text style={styles.footerBarcode}>* {loan.loan_code} *</Text>
        </View>
      </Page>
    </Document>
  );
};
