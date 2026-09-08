import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Font,
  Image,
} from '@react-pdf/renderer';
import path from 'path';
import { deliveryNoteStyles as styles } from './styles/deliveryNote';

const fontRegular = path.join(process.cwd(), 'public/fonts/NotoSansJP-Regular.otf');
const fontBold = path.join(process.cwd(), 'public/fonts/NotoSansJP-Bold.otf');
const stampSrc = path.join(process.cwd(), 'public/stamps/stamp_yoshida.png');

Font.register({
  family: 'NotoSansJP',
  fonts: [
    { src: fontRegular, fontWeight: 400 },
    { src: fontBold, fontWeight: 700 },
  ],
});

export interface ShipmentPDFDocumentData {
  shipment_id: string;
  delivery_note_no?: string | null;
  ship_date: string;
  delivery_method?: string | null;
  tracking_no?: string | null;
  notes?: string | null;
  shipped_quantity?: number | null;
  // WO-direct
  work_order_id?: string | null;
  wo_code?: string | null;
  wo_name?: string | null;
  product_code?: string | null;
  product_name?: string | null;
  product_name_internal?: string | null;
  plastic_type_designed?: string | null;
  alt_plastic_type?: string | null;
  wo_company_name?: string | null;
  // Order-based
  order_id?: string | null;
  order_no?: string | null;
  customer_order_no?: string | null;
  order_company_name?: string | null;
  order_lines?: Array<{
    line_no?: number;
    quantity?: number;
    unit?: string;
    box_type?: string;
    product_code?: string;
    product_name?: string;
  }>;
  // Delivery Site
  site_name?: string | null;
  site_address?: string | null;
  site_tel?: string | null;
}

export interface ShipmentPDFDocumentProps {
  data: ShipmentPDFDocumentData;
  qrCodeDataUrl?: string;
}

export function ShipmentPDFDocument({ data, qrCodeDataUrl }: ShipmentPDFDocumentProps) {
  const customerName =
    data.wo_company_name || data.order_company_name || data.site_name || '得意先';
  const siteName = data.site_name ? `納入場所: ${data.site_name}` : '';
  const siteAddress = data.site_address ? `(${data.site_address})` : '';

  // Calculate items list
  const hasOrderLines = data.order_lines && data.order_lines.length > 0;
  const items = hasOrderLines
    ? data.order_lines!
    : [
        {
          line_no: 1,
          product_code: data.product_code || '—',
          product_name:
            data.product_name ||
            data.product_name_internal ||
            data.wo_name ||
            '成型トレイ製品',
          material: data.plastic_type_designed || data.alt_plastic_type || null,
          quantity: Number(data.shipped_quantity || 0),
          unit: '枚',
          box_type: 'ダンボール梱包',
        },
      ];

  const totalQty = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);

  const renderSection = (title: string, isReceipt = false) => (
    <View style={styles.sectionBox}>
      {/* Top Header */}
      <View>
        <View style={styles.titleBlock}>
          <Text style={styles.mainTitle}>{title}</Text>
        </View>

        <View style={styles.headerRow}>
          {/* Left: Customer Info */}
          <View style={styles.customerBox}>
            <Text style={styles.customerName}>{customerName} 御中</Text>
            {siteName ? (
              <Text style={styles.deliverySiteName}>
                {siteName} {siteAddress}
              </Text>
            ) : null}
            <View style={styles.subDetails}>
              {data.wo_code ? (
                <Text>
                  指図番号: {data.wo_code} {data.wo_name ? `(${data.wo_name})` : ''}
                </Text>
              ) : null}
              {data.order_no ? (
                <Text>
                  受注番号: {data.order_no}{' '}
                  {data.customer_order_no ? `(客先注番: ${data.customer_order_no})` : ''}
                </Text>
              ) : null}
              <Text>
                配送方法: {data.delivery_method || '自社便・トラック'}{' '}
                {data.tracking_no ? `(送り状: ${data.tracking_no})` : ''}
              </Text>
            </View>
          </View>

          {/* Right: YSD Info & Stamps */}
          <View style={styles.companyInfoBox}>
            <Text style={{ color: '#64748b', fontSize: 7.5 }}>
              納品番号: {data.delivery_note_no || '—'}
            </Text>
            <Text style={{ color: '#64748b', fontSize: 7.5, marginBottom: 2 }}>
              出荷日: {data.ship_date}
            </Text>

            <Text style={styles.companyLogoText}>YOSHIDA SEIKEI CO., LTD.</Text>
            <Text style={styles.companyName}>株式会社 吉田金型製作所</Text>
            <Text>〒211-0016 神奈川県川崎市中原区市ノ坪 385</Text>
            <Text>TEL: 044-411-4470 / FAX: 044-433-2895</Text>

            <View style={styles.sealAreaRow}>
              <View style={styles.sealBox}>
                <Text style={styles.sealLabel}>承認</Text>
              </View>
              <View style={styles.sealBox}>
                <Text style={styles.sealLabel}>出荷担当</Text>
              </View>
              {isReceipt ? (
                <View style={styles.receiptStampBox}>
                  <Text style={styles.receiptStampLabel}>受領印</Text>
                </View>
              ) : (
                <View style={styles.stampImage}>
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
            <Text style={styles.colName}>品名・仕様 (材料規格)</Text>
            <Text style={styles.colQty}>出荷数量</Text>
            <Text style={styles.colUnit}>単位</Text>
            <Text style={styles.colBox}>荷姿</Text>
          </View>

          {items.map((item, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.colNo}>{item.line_no || idx + 1}</Text>
              <Text style={styles.colCode}>{item.product_code || '—'}</Text>
              <View style={[styles.colName, { paddingRight: 4 }]}>
                <Text>{item.product_name || '—'}</Text>
                {(item as any).material ? (
                  <Text style={{ fontSize: 7, color: '#64748b', marginTop: 1 }}>
                    [材料] {(item as any).material}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.colQty}>{Number(item.quantity || 0).toLocaleString()}</Text>
              <Text style={styles.colUnit}>{item.unit || '枚'}</Text>
              <Text style={styles.colBox}>{item.box_type || 'ダンボール'}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Bottom Notes, QR & Footer */}
      <View>
        <View style={styles.notesAndQrRow}>
          <View style={styles.notesBox}>
            <Text style={{ fontWeight: 700, marginBottom: 1 }}>
              備考: {data.notes ? data.notes : '—'}
            </Text>
            {isReceipt ? (
              <Text style={{ color: '#0f766e', fontWeight: 700, marginTop: 2 }}>
                上記正に受領いたしました。 _____年___月___日 （受領サイン: ___________________）
              </Text>
            ) : (
              <Text style={{ color: '#64748b' }}>
                ※現品到着後、数量・仕様をご確認の上、万一相違の際は直ちにご連絡ください。
              </Text>
            )}
          </View>

          {qrCodeDataUrl ? (
            <View style={styles.qrBox}>
              <Image src={qrCodeDataUrl} style={styles.qrImage} />
            </View>
          ) : null}
        </View>

        <View style={styles.footerRow}>
          <Text style={{ fontWeight: 700 }}>
            合計出荷数量: {totalQty.toLocaleString()} 点 ({items.length} 品目)
          </Text>
          <Text style={{ fontSize: 7, color: '#94a3b8' }}>
            {isReceipt ? '【お客様控・受領書】' : '【吉田金型 納品書】'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Liên 1: 納品書 */}
        {renderSection('納　品　書', false)}

        {/* Cut line */}
        <View style={styles.cutLineContainer}>
          <View style={styles.cutLine} />
          <Text style={styles.cutBadge}>- - - - - - - - - - キ リ ト リ 線 (裁断線) - - - - - - - - - -</Text>
        </View>

        {/* Liên 2: 納品受領書 */}
        {renderSection('納　品　受　領　書', true)}
      </Page>
    </Document>
  );
}
