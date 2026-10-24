import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Radii, Spacing, formatFcfa } from '../theme/tokens';
import { useDepotStore } from '../store/useDepotStore';
import { ProductCategory } from '../types/models';
import { RootStackParamList } from '../navigation/RootNavigator';

export function PosTerminalScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {
    products,
    clients,
    selectedClientId,
    selectClient,
    cart,
    updateCartQuantity,
  } = useDepotStore();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'tous' | ProductCategory>('tous');
  const [clientOpen, setClientOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? clients[0];

  const activeProducts = products.filter((p) => {
    if (!p.activeInPos) return false;
    if (category !== 'tous' && p.category !== category) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const cartSummary = Object.values(cart).reduce(
    (acc, item) => {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p) return acc;
      return {
        qty: acc.qty + item.quantityCrates,
        total: acc.total + item.quantityCrates * p.salePriceFcfa,
      };
    },
    { qty: 0, total: 0 }
  );

  const handleStep = (productId: string, delta: number) => {
    const res = updateCartQuantity(productId, delta);
    if (!res.ok && res.reason) {
      setFeedback(res.reason);
      setTimeout(() => setFeedback(null), 2400);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {feedback ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{feedback}</Text>
        </View>
      ) : null}

      {/* Sélecteur Client Facturé */}
      <View style={styles.clientCard}>
        <View style={styles.clientHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Client facturé</Text>
            <Text style={styles.clientName} numberOfLines={1}>
              {selectedClient.name}
            </Text>
            <Text style={styles.clientMeta}>
              {selectedClient.tierLabel} · {selectedClient.phone}
            </Text>
          </View>
          <Pressable
            style={styles.switchBtn}
            onPress={() => setClientOpen((prev) => !prev)}
          >
            <Text style={styles.switchBtnText}>Changer</Text>
          </Pressable>
        </View>

        {clientOpen ? (
          <View style={styles.clientList}>
            {clients.map((clt) => (
              <Pressable
                key={clt.id}
                onPress={() => {
                  selectClient(clt.id);
                  setClientOpen(false);
                }}
                style={styles.clientOption}
              >
                <Text style={styles.clientOptionTitle}>{clt.name}</Text>
                <Text style={styles.clientMeta}>{clt.district}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      {/* Recherche & Catégories */}
      <View style={styles.searchBarRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Castel, Beaufort, Tangui, code EAN-13..."
          style={styles.searchInput}
        />
      </View>

      <View style={styles.filterRow}>
        {(['tous', 'bieres', 'gazeuses', 'eaux'] as const).map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.filterBtn, category === cat && styles.filterBtnActive]}
          >
            <Text
              style={[styles.filterText, category === cat && styles.filterTextActive]}
            >
              {cat === 'tous'
                ? 'Tous'
                : cat === 'bieres'
                ? 'Bières'
                : cat === 'gazeuses'
                ? 'Gazeuses'
                : 'Eaux'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Catalogue Caisse */}
      <FlatList
        data={activeProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: Spacing.margin, paddingBottom: 140, gap: Spacing.sm }}
        renderItem={({ item }) => {
          const qty = cart[item.id]?.quantityCrates ?? 0;
          const outOfStock = item.stockCrates === 0;
          return (
            <View style={[styles.productCard, outOfStock && { opacity: 0.6 }]}>
              <View style={styles.productTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.clientMeta}>
                    {item.bottlesPerCrate} btles · {item.stockCrates} casiers dispo
                  </Text>
                  <Text style={styles.productPrice}>
                    {formatFcfa(item.salePriceFcfa)} / casier
                  </Text>
                </View>

                {outOfStock ? (
                  <View style={styles.disabledBox}>
                    <Text style={styles.disabledText}>Rupture</Text>
                  </View>
                ) : (
                  <View style={styles.stepper}>
                    <Pressable
                      style={styles.stepBtn}
                      onPress={() => handleStep(item.id, -1)}
                    >
                      <Text style={styles.stepBtnLabel}>−</Text>
                    </Pressable>
                    <Text style={styles.qtyLabel}>{qty}</Text>
                    <Pressable
                      style={styles.stepBtn}
                      onPress={() => handleStep(item.id, 1)}
                    >
                      <Text style={styles.stepBtnLabel}>+</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />

      {/* Barre flottante Panier */}
      <View style={styles.cartFooter}>
        <View>
          <Text style={styles.kicker}>{cartSummary.qty} casier(s) au panier</Text>
          <Text style={styles.cartTotal}>{formatFcfa(cartSummary.total)}</Text>
        </View>
        <Pressable
          disabled={cartSummary.qty === 0}
          onPress={() => navigation.navigate('PaymentCheckout')}
          style={[styles.validateBtn, cartSummary.qty === 0 && { opacity: 0.45 }]}
        >
          <Text style={styles.validateBtnText}>Valider Vente</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  toast: {
    marginHorizontal: Spacing.margin,
    marginTop: Spacing.xs,
    padding: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: Colors.error,
  },
  toastText: { color: Colors.onError, fontSize: 12, fontWeight: '600' },
  clientCard: {
    margin: Spacing.margin,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLow,
  },
  clientHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  kicker: { fontSize: 11, fontWeight: '600', color: Colors.onSurfaceVariant },
  clientName: { fontSize: 15, fontWeight: '700', color: Colors.onSurface, marginTop: 2 },
  clientMeta: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  switchBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  switchBtnText: { fontSize: 12, fontWeight: '600', color: Colors.secondary },
  clientList: { marginTop: Spacing.sm, gap: 6 },
  clientOption: {
    padding: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLowest,
  },
  clientOptionTitle: { fontSize: 13, fontWeight: '600', color: Colors.onSurface },
  searchBarRow: { paddingHorizontal: Spacing.margin },
  searchInput: {
    height: 44,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLowest,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.margin,
    paddingVertical: Spacing.sm,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
  },
  filterBtnActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 12, fontWeight: '600', color: Colors.onSurface },
  filterTextActive: { color: Colors.onPrimary },
  productCard: {
    padding: Spacing.md,
    borderRadius: Radii.xl,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  productTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  productName: { fontSize: 15, fontWeight: '700', color: Colors.onSurface },
  productPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    height: 44,
  },
  stepBtn: { width: 40, height: 44, alignItems: 'center', justifyContent: 'center' },
  stepBtnLabel: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  qtyLabel: {
    width: 32,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    fontVariant: ['tabular-nums'],
  },
  disabledBox: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: Radii.md,
    backgroundColor: Colors.errorContainer,
  },
  disabledText: { fontSize: 11, fontWeight: '700', color: Colors.error },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.margin,
    backgroundColor: Colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartTotal: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    fontVariant: ['tabular-nums'],
  },
  validateBtn: {
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radii.lg,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validateBtnText: { color: Colors.onPrimary, fontSize: 14, fontWeight: '700' },
});
