import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Radii, Spacing, formatFcfa } from '../theme/tokens';
import { useDepotStore } from '../store/useDepotStore';
import {
  buildEscPosReceiptPayload,
  exportReceiptPdf,
  PaperWidthMm,
  shareSaleOnWhatsApp,
} from '../services/thermalPrinter';
import { RootStackParamList } from '../navigation/RootNavigator';

export function SaleReceiptScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'SaleReceipt'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const sales = useDepotStore((s) => s.sales);
  const [widthMm, setWidthMm] = useState<PaperWidthMm>(58);

  const sale = sales.find((s) => s.id === route.params?.saleId) ?? sales[0];

  if (!sale) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.content}>
          <Text style={styles.title}>Aucun reçu sélectionné</Text>
        </View>
      </SafeAreaView>
    );
  }

  const escPosText = buildEscPosReceiptPayload(sale, widthMm);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.widthBar}>
          {([58, 80] as const).map((w) => (
            <Pressable
              key={w}
              onPress={() => setWidthMm(w)}
              style={[styles.widthBtn, widthMm === w && styles.widthBtnActive]}
            >
              <Text style={[styles.widthText, widthMm === w && styles.widthTextActive]}>
                Rouleau {w}mm
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.paperTicket}>
          <Text style={styles.monoTicket}>{escPosText}</Text>
        </View>

        <Pressable style={styles.primaryBtn} onPress={() => exportReceiptPdf(sale)}>
          <Text style={styles.primaryBtnText}>Imprimer / Exporter PDF</Text>
        </Pressable>

        <Pressable style={styles.whatsappBtn} onPress={() => shareSaleOnWhatsApp(sale)}>
          <Text style={styles.primaryBtnText}>Partager sur WhatsApp ({sale.clientPhone})</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.secondaryBtnText}>Nouvelle Vente (Retour Caisse)</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export function SalesJournalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { sales, clients } = useDepotStore();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Journal des Ventes & Comptes Clients</Text>

        {sales.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => navigation.navigate('SaleAuditDetail', { saleId: s.id })}
            style={styles.card}
          >
            <View style={styles.rowBetween}>
              <Text style={styles.invoiceId}>
                {s.invoiceNumber} · {s.timeLabel}
              </Text>
              <Text
                style={[
                  styles.amountText,
                  s.status === 'credit' && { color: Colors.error },
                ]}
              >
                {formatFcfa(s.grandTotalFcfa)}
              </Text>
            </View>
            <Text style={styles.clientLabel}>
              {s.clientName} · {s.paymentChannelLabel}
            </Text>
          </Pressable>
        ))}

        <Text style={[styles.title, { marginTop: Spacing.sm }]}>
          Débitants & Encours Casiers
        </Text>
        {clients
          .filter((c) => !c.isAnonymousCounter)
          .map((clt) => (
            <View key={clt.id} style={styles.card}>
              <Text style={styles.invoiceId}>{clt.name}</Text>
              <Text style={styles.clientLabel}>
                {clt.district} · Dette : {formatFcfa(clt.creditBalanceFcfa)} ·{' '}
                {clt.cratesOwed} casiers dehors
              </Text>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SaleAuditDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'SaleAuditDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const sales = useDepotStore((s) => s.sales);
  const sale = sales.find((s) => s.id === route.params?.saleId) ?? sales[0];

  if (!sale) return null;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{sale.invoiceNumber}</Text>
          <Text style={styles.clientLabel}>
            {sale.clientName} · Opérateur : {sale.operatorName}
          </Text>
          <Text style={[styles.amountText, { marginTop: 8 }]}>
            Total Facture : {formatFcfa(sale.grandTotalFcfa)}
          </Text>
        </View>
        <Pressable
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('SaleReceipt', { saleId: sale.id })}
        >
          <Text style={styles.primaryBtnText}>Aperçu Ticket Thermique ESC/POS</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  content: { padding: Spacing.margin, gap: Spacing.md, paddingBottom: Spacing.bottomTabSafe },
  title: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  widthBar: { flexDirection: 'row', gap: 8 },
  widthBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
  },
  widthBtnActive: { backgroundColor: Colors.primary },
  widthText: { fontSize: 12, fontWeight: '600', color: Colors.onSurface },
  widthTextActive: { color: Colors.onPrimary },
  paperTicket: {
    backgroundColor: '#FFFFFF',
    padding: Spacing.lg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  monoTicket: { fontFamily: 'Courier', fontSize: 12, lineHeight: 18, color: '#0F172A' },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoiceId: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  amountText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onSurface,
    fontVariant: ['tabular-nums'],
  },
  clientLabel: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 4 },
  primaryBtn: {
    height: 50,
    borderRadius: Radii.lg,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whatsappBtn: {
    height: 48,
    borderRadius: Radii.lg,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryBtn: {
    height: 46,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { color: Colors.onSurface, fontSize: 13, fontWeight: '600' },
});
