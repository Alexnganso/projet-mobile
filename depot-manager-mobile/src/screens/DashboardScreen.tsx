import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Radii, Spacing, formatFcfa } from '../theme/tokens';
import { useDepotStore } from '../store/useDepotStore';
import { RootStackParamList } from '../navigation/RootNavigator';

export function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    currentOperator,
    activeRoleView,
    setRoleView,
    products,
    sales,
    lockSession,
  } = useDepotStore();

  const lowStockProducts = products.filter((p) => p.stockCrates <= p.minAlertCrates);
  const baseRevenue = 3850000;
  const sessionRevenue = sales
    .filter((s) => s.status !== 'cancelled')
    .reduce((acc, s) => acc + s.grandTotalFcfa, baseRevenue);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>
              Bonjour, {currentOperator?.fullName ?? 'Roger Fotso'}
            </Text>
            <Text style={styles.subGreeting}>
              Dépôt Central Akwa · Serveur local synchronisé
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn} onPress={lockSession}>
              <Text style={styles.iconBtnText}>Verrouiller</Text>
            </Pressable>
            <Pressable
              style={styles.iconBtn}
              onPress={() => navigation.navigate('LogoutConfirm')}
            >
              <Text style={styles.iconBtnText}>Sortie</Text>
            </Pressable>
          </View>
        </View>

        {/* Sélecteur d'habilitation */}
        <View style={styles.segmentedBar}>
          {(['admin', 'cashier', 'stock'] as const).map((r) => (
            <Pressable
              key={r}
              onPress={() => setRoleView(r)}
              style={[styles.segmentBtn, activeRoleView === r && styles.segmentBtnActive]}
            >
              <Text
                style={[styles.segmentText, activeRoleView === r && styles.segmentTextActive]}
              >
                {r === 'admin' ? 'Gérant' : r === 'cashier' ? 'Caisse' : 'Stockiste'}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* KPI Chiffre d'Affaires */}
        <View style={styles.kpiHero}>
          <Text style={styles.kpiLabel}>Chiffre d'affaires du jour</Text>
          <Text style={styles.kpiAmount}>{formatFcfa(sessionRevenue)}</Text>
          <Text style={styles.kpiSplit}>
            Comptant 76% (2 920 000 FCFA) · Crédit 24% (930 000 FCFA)
          </Text>
        </View>

        {/* Grille 3 KPIs */}
        <View style={styles.kpiRow}>
          <View style={styles.kpiSmall}>
            <Text style={styles.kpiSmallLabel}>Ventes</Text>
            <Text style={styles.kpiSmallValue}>{48 + sales.length}</Text>
          </View>
          <View style={styles.kpiSmall}>
            <Text style={styles.kpiSmallLabel}>Sous seuil</Text>
            <Text style={[styles.kpiSmallValue, { color: Colors.error }]}>
              {lowStockProducts.length} réf.
            </Text>
          </View>
          <View style={styles.kpiSmall}>
            <Text style={styles.kpiSmallLabel}>Crédits &gt; 48h</Text>
            <Text style={styles.kpiSmallValue}>1,65M</Text>
          </View>
        </View>

        {/* Alertes prioritaires */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionTitle}>
            Points d'attention ({lowStockProducts.length})
          </Text>
          {lowStockProducts.map((prod) => (
            <Pressable
              key={prod.id}
              onPress={() => navigation.navigate('ProductDetail', { productId: prod.id })}
              style={styles.alertRow}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.alertTitle}>{prod.name}</Text>
                <Text style={styles.alertSub}>
                  Stock restant : {prod.stockCrates} casiers (Seuil {prod.minAlertCrates})
                </Text>
              </View>
              <Text style={styles.alertAction}>Voir fiche</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  content: { padding: Spacing.margin, gap: Spacing.md, paddingBottom: Spacing.bottomTabSafe },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  subGreeting: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainer,
  },
  iconBtnText: { fontSize: 11, fontWeight: '600', color: Colors.primary },
  segmentedBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    padding: 4,
    gap: 4,
  },
  segmentBtn: { flex: 1, paddingVertical: 8, borderRadius: Radii.sm, alignItems: 'center' },
  segmentBtnActive: { backgroundColor: Colors.primary },
  segmentText: { fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant },
  segmentTextActive: { color: Colors.onPrimary },
  kpiHero: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.lg,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiLabel: { fontSize: 12, color: Colors.outline, fontWeight: '600' },
  kpiAmount: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.onSurface,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  kpiSplit: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 8 },
  kpiRow: { flexDirection: 'row', gap: Spacing.sm },
  kpiSmall: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiSmallLabel: { fontSize: 11, color: Colors.outline, fontWeight: '600' },
  kpiSmallValue: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.onSurface,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  sectionBox: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.lg,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: Spacing.sm,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  alertTitle: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  alertSub: { fontSize: 12, color: Colors.error, marginTop: 2 },
  alertAction: { fontSize: 12, fontWeight: '600', color: Colors.secondary },
});
