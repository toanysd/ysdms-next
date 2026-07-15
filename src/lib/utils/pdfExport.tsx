import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer'
import type { Quotation } from '@/app/cases/[id]/types'

// Register a Japanese Font from a CDN
Font.register({
  family: 'NotoSansJP',
  src: 'https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Regular.otf',
})

Font.register({
  family: 'NotoSansJP-Bold',
  src: 'https://fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-Bold.otf',
})

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'NotoSansJP',
    fontSize: 10,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'NotoSansJP-Bold',
    letterSpacing: 4,
  },
  companyInfo: {
    alignItems: 'flex-end',
    fontSize: 10,
    lineHeight: 1.5,
  },
  companyName: {
    fontFamily: 'NotoSansJP-Bold',
    fontSize: 12,
  },
  customerInfo: {
    marginBottom: 40,
    borderBottom: '1px solid #000',
    paddingBottom: 4,
    width: 250,
  },
  customerName: {
    fontSize: 16,
    fontFamily: 'NotoSansJP-Bold',
  },
  metaTable: {
    marginBottom: 30,
  },
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    width: 80,
    color: '#666',
  },
  metaValue: {
    flex: 1,
  },
  totalAmountBox: {
    flexDirection: 'row',
    borderBottom: '2px solid #000',
    paddingBottom: 4,
    marginBottom: 30,
    width: 250,
  },
  totalAmountLabel: {
    fontSize: 14,
    width: 80,
  },
  totalAmountValue: {
    fontSize: 16,
    fontFamily: 'NotoSansJP-Bold',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#f5f5f5',
    padding: 6,
    fontFamily: 'NotoSansJP-Bold',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 6,
  },
  notesBox: {
    marginTop: 40,
    padding: 10,
    border: '1px solid #ccc',
  },
})

type Props = {
  quotation: Quotation
  customerName?: string
}

export const QuotationDocument = ({ quotation, customerName }: Props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>御見積書</Text>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>YSD 株式会社</Text>
            <Text>〒123-4567 東京都千代田区...</Text>
            <Text>TEL: 03-1234-5678</Text>
          </View>
        </View>

        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{customerName || '御中'} 様</Text>
        </View>

        <View style={styles.metaTable}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>見積番号:</Text>
            <Text style={styles.metaValue}>{quotation.quotation_no}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>発行日:</Text>
            <Text style={styles.metaValue}>{quotation.issued_date || '---'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>有効期限:</Text>
            <Text style={styles.metaValue}>{quotation.valid_until || '---'}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text>下記の通り御見積申し上げます。</Text>
        </View>

        <View style={styles.totalAmountBox}>
          <Text style={styles.totalAmountLabel}>御見積金額:</Text>
          <Text style={styles.totalAmountValue}>
            {new Intl.NumberFormat('ja-JP').format(quotation.total_amount)} {quotation.currency} (税抜)
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, { width: '50%' }]}><Text>品名 / 項目</Text></View>
            <View style={[styles.tableColHeader, { width: '15%', textAlign: 'center' }]}><Text>数量</Text></View>
            <View style={[styles.tableColHeader, { width: '20%', textAlign: 'right' }]}><Text>単価</Text></View>
            <View style={[styles.tableColHeader, { width: '15%', textAlign: 'right' }]}><Text>金額</Text></View>
          </View>
          {quotation.items_json.map((item, idx) => (
            <View style={styles.tableRow} key={idx}>
              <View style={[styles.tableCol, { width: '50%' }]}><Text>{item.name}</Text></View>
              <View style={[styles.tableCol, { width: '15%', textAlign: 'center' }]}><Text>{item.quantity}</Text></View>
              <View style={[styles.tableCol, { width: '20%', textAlign: 'right' }]}><Text>{new Intl.NumberFormat('ja-JP').format(item.unit_price)}</Text></View>
              <View style={[styles.tableCol, { width: '15%', textAlign: 'right' }]}><Text>{new Intl.NumberFormat('ja-JP').format(item.amount)}</Text></View>
            </View>
          ))}
        </View>

        {quotation.notes && (
          <View style={styles.notesBox}>
            <Text style={{ fontFamily: 'NotoSansJP-Bold', marginBottom: 4 }}>備考:</Text>
            <Text>{quotation.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}

export const generateQuotationPDF = async (quotation: Quotation, customerName?: string) => {
  const blob = await pdf(<QuotationDocument quotation={quotation} customerName={customerName} />).toBlob()
  return blob
}
