import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2563eb' },
  subtitle: { fontSize: 10, color: '#64748b', marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, color: '#1e293b' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4, marginBottom: 4 },
  tableRow: { flexDirection: 'row', paddingVertical: 4, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  col1: { flex: 3 },
  col2: { flex: 1, textAlign: 'right' },
  col3: { flex: 1, textAlign: 'right' },
  col4: { flex: 1, textAlign: 'right' },
  bold: { fontWeight: 'bold' },
  muted: { color: '#64748b' },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 8, marginTop: 8, borderTopWidth: 2, borderTopColor: '#2563eb' },
  totalLabel: { fontWeight: 'bold', fontSize: 14, marginRight: 20 },
  totalValue: { fontWeight: 'bold', fontSize: 14, color: '#2563eb' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', color: '#94a3b8', fontSize: 8 },
});

interface InvoicePDFProps {
  invoice: any;
  shop: any;
  customer: any;
  vehicle: any;
  partsUsed: any[];
}

export function InvoicePDF({ invoice, shop, customer, vehicle, partsUsed }: InvoicePDFProps) {
  const formatCurrency = (amount: number) => `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{shop.name || 'GarageOS'}</Text>
            <Text style={styles.subtitle}>{shop.address || ''}</Text>
            <Text style={styles.subtitle}>{shop.phone || ''} | {shop.email || ''}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>INVOICE</Text>
            <Text style={styles.subtitle}>#{invoice.invoice_number}</Text>
            <Text style={styles.subtitle}>Date: {new Date(invoice.created_at).toLocaleDateString()}</Text>
            {invoice.due_date && <Text style={styles.subtitle}>Due: {new Date(invoice.due_date).toLocaleDateString()}</Text>}
          </View>
        </View>

        {/* Customer & Vehicle Info */}
        <View style={{ flexDirection: 'row', marginBottom: 20, gap: 20 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text style={styles.bold}>{customer?.name || 'Customer'}</Text>
            <Text style={styles.muted}>{customer?.phone || ''}</Text>
            <Text style={styles.muted}>{customer?.email || ''}</Text>
            <Text style={styles.muted}>{customer?.address || ''}</Text>
          </View>
          {vehicle && (
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionTitle}>Vehicle</Text>
              <Text style={styles.bold}>{vehicle.brand} {vehicle.model} ({vehicle.year})</Text>
              <Text style={styles.muted}>Plate: {vehicle.license_plate}</Text>
              {vehicle.vin && <Text style={styles.muted}>VIN: {vehicle.vin}</Text>}
              {vehicle.mileage && <Text style={styles.muted}>Mileage: {vehicle.mileage?.toLocaleString()} km</Text>}
            </View>
          )}
        </View>

        {/* Parts & Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parts & Services</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.bold]}>Item</Text>
            <Text style={[styles.col2, styles.bold]}>Qty</Text>
            <Text style={[styles.col3, styles.bold]}>Price</Text>
            <Text style={[styles.col4, styles.bold]}>Total</Text>
          </View>
          {partsUsed.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.col1}>{item.part?.name || 'Service'}</Text>
              <Text style={styles.col2}>{item.quantity}</Text>
              <Text style={styles.col3}>{formatCurrency(item.unit_price)}</Text>
              <Text style={styles.col4}>{formatCurrency(item.quantity * item.unit_price)}</Text>
            </View>
          ))}
          {partsUsed.length === 0 && (
            <View style={styles.tableRow}>
              <Text style={[styles.col1, styles.muted]}>Repair service</Text>
              <Text style={styles.col2}>1</Text>
              <Text style={styles.col3}>{formatCurrency(invoice.subtotal)}</Text>
              <Text style={styles.col4}>{formatCurrency(invoice.subtotal)}</Text>
            </View>
          )}
        </View>

        {/* Totals */}
        <View style={{ alignItems: 'flex-end' }}>
          <View style={styles.row}><Text style={styles.muted}>Subtotal</Text><Text style={{ marginLeft: 40 }}>{formatCurrency(invoice.subtotal)}</Text></View>
          {invoice.tax > 0 && <View style={styles.row}><Text style={styles.muted}>Tax (7%)</Text><Text style={{ marginLeft: 40 }}>{formatCurrency(invoice.tax)}</Text></View>}
          {invoice.discount > 0 && <View style={styles.row}><Text style={styles.muted}>Discount</Text><Text style={{ marginLeft: 40 }}>-{formatCurrency(invoice.discount)}</Text></View>}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(invoice.total)}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={[styles.section, { marginTop: 20 }]}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.muted}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Generated by GarageOS | {shop.name} | Thank you for your business</Text>
      </Page>
    </Document>
  );
}
