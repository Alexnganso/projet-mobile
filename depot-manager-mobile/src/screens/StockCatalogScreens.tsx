import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Radii, Spacing, formatFcfa } from '../theme/tokens';
import { useDepotStore } from '../store/useDepotStore';
import { RootStackParamList } from '../navigation/RootNavigator';

export function StockCatalogScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { products, activeRoleView, setRoleView } = useDepotStore();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Catalogue Produits</Text>
            <Text style={styles.metaText}>{products.length} références actives</Text>
          </View>
          <Pressable
            style={styles.addBtn}
            onPress={() => navigation.navigate('ProductForm', {})}
          >
            <Text style={styles.addBtnText}>+ Nouveau</Text>
          </Pressable>
        </View>

        {/* Commutateur RBAC Admin vs Vendeur */}
        <View style={styles.roleBar}>
          <Pressable
            onPress={() => setRoleView('admin')}
            style={[styles.roleTab, activeRoleView === 'admin' && styles.roleTabActive]}
          >
            <Text
              style={[
                styles.roleTabText,
                activeRoleView === 'admin' && styles.roleTabTextActive,
              ]}
            >
              Vue Gérant (Marges)
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setRoleView('cashier')}
            style={[styles.roleTab, activeRoleView !== 'admin' && styles.roleTabActive]}
          >
            <Text
              style={[
                styles.roleTabText,
                activeRoleView !== 'admin' && styles.roleTabTextActive,
              ]}
            >
              Vue Vendeur
            </Text>
          </Pressable>
        </View>

        {products.map((prod) => {
          const margin = prod.salePriceFcfa - prod.purchasePriceFcfa;
          const marginPct = ((margin / prod.salePriceFcfa) * 100).toFixed(1);
          return (
            <Pressable
              key={prod.id}
              onPress={() =>
                navigation.navigate('ProductDetail', { productId: prod.id })
              }
              style={styles.card}
            >
              <View style={styles.headerRow}>
                <Text style={styles.prodName}>{prod.name}</Text>
                <Text style={styles.prodPrice}>{formatFcfa(prod.salePriceFcfa)}</Text>
              </View>
              <Text style={styles.metaText}>
                {prod.categoryLabel} · {prod.stockCrates} casiers dispo (Seuil{' '}
                {prod.minAlertCrates})
              </Text>
              {activeRoleView === 'admin' ? (
                <Text style={styles.marginLine}>
                  Achat : {formatFcfa(prod.purchasePriceFcfa)} · Marge : +
                  {formatFcfa(margin)} ({marginPct}%)
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

export function ProductDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { products, activeRoleView, toggleProductPosStatus } = useDepotStore();
  const [pin, setPin] = useState('');
  const [showDeactivate, setShowDeactivate] = useState(false);

  const product = products.find((p) => p.id === route.params?.productId) ?? products[0];
  if (!product) return null;

  const margin = product.salePriceFcfa - product.purchasePriceFcfa;

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.metaText}>
            {product.sku} · EAN {product.barcode} · {product.warehouseLocation}
          </Text>
          <Text style={[styles.prodPrice, { marginTop: Spacing.sm }]}>
            Vente : {formatFcfa(product.salePriceFcfa)} · Caution :{' '}
            {formatFcfa(product.crateDepositFcfa)}
          </Text>
          {activeRoleView === 'admin' ? (
            <Text style={styles.marginLine}>
              Achat Usine : {formatFcfa(product.purchasePriceFcfa)} · Marge brute : +
              {formatFcfa(margin)} / casier
            </Text>
          ) : (
            <Text style={styles.metaText}>
              Données de rentabilité verrouillées en mode Vendeur.
            </Text>
          )}
        </View>

        <Pressable
          style={styles.addBtn}
          onPress={() =>
            navigation.navigate('ProductForm', { productId: product.id })
          }
        >
          <Text style={styles.addBtnText}>Modifier la fiche produit</Text>
        </Pressable>

        <Pressable
          style={styles.dangerOutlineBtn}
          onPress={() => setShowDeactivate((prev) => !prev)}
        >
          <Text style={styles.dangerText}>
            {product.activeInPos
              ? 'Désactiver de la vente comptoir (Action Superviseur)'
              : 'Réactiver au catalogue POS'}
          </Text>
        </Pressable>

        {showDeactivate ? (
          <View style={styles.card}>
            <Text style={styles.prodName}>Autorisation Responsable (PIN 4 chiffres)</Text>
            <Text style={styles.metaText}>
              Stock résiduel : {product.stockCrates} casiers · {product.cratesOutWithClients}{' '}
              casiers dehors
            </Text>
            <TextInput
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
              placeholder="PIN Superviseur (ex: 8359)"
              style={styles.input}
            />
            <Pressable
              style={[styles.addBtn, { backgroundColor: Colors.error, marginTop: 8 }]}
              onPress={() => {
                if (pin.length === 4) {
                  toggleProductPosStatus(product.id, !product.activeInPos);
                  navigation.goBack();
                }
              }}
            >
              <Text style={styles.addBtnText}>Confirmer avec PIN</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

export function ProductFormScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductForm'>>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { products, saveProduct } = useDepotStore();

  const existing = products.find((p) => p.id === route.params?.productId);

  const [name, setName] = useState(existing?.name ?? '');
  const [buyPrice, setBuyPrice] = useState(String(existing?.purchasePriceFcfa ?? 6400));
  const [sellPrice, setSellPrice] = useState(String(existing?.salePriceFcfa ?? 7800));
  const [stock, setStock] = useState(String(existing?.stockCrates ?? 50));

  const buyNum = Number(buyPrice) || 0;
  const sellNum = Number(sellPrice) || 0;
  const margin = sellNum - buyNum;

  const handleSave = async () => {
    if (!name.trim() || sellNum <= buyNum) return;
    await saveProduct({
      id: existing?.id ?? `prd-${Date.now()}`,
      sku: existing?.sku ?? `REF-${Math.floor(100 + Math.random() * 900)}`,
      barcode: existing?.barcode ?? '6151100999999',
      name: name.trim(),
      brewer: existing?.brewer ?? 'Brasseries du Cameroun (SABC)',
      category: existing?.category ?? 'bieres',
      categoryLabel: existing?.categoryLabel ?? 'Bière blonde',
      volumeLabel: existing?.volumeLabel ?? '65 cl',
      packagingType: existing?.packagingType ?? 'consigne',
      bottlesPerCrate: existing?.bottlesPerCrate ?? 12,
      crateDepositFcfa: existing?.crateDepositFcfa ?? 3000,
      purchasePriceFcfa: buyNum,
      salePriceFcfa: sellNum,
      unitBottlePriceFcfa: Math.round(sellNum / 12),
      stockCrates: Number(stock) || 0,
      minAlertCrates: existing?.minAlertCrates ?? 15,
      maxDockCrates: existing?.maxDockCrates ?? 100,
      warehouseLocation: existing?.warehouseLocation ?? 'Allée B - Travée 01',
      lastRestockLabel: 'Aujourd’hui · Saisie Dépôt',
      cratesOutWithClients: existing?.cratesOutWithClients ?? 0,
      activeInPos: true,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {existing ? 'Modifier Fiche Produit' : 'Ajouter une Boisson'}
        </Text>
        <View style={styles.card}>
          <Text style={styles.metaText}>Nom commercial du produit *</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />

          <Text style={[styles.metaText, { marginTop: 10 }]}>Prix d'achat usine (FCFA) *</Text>
          <TextInput
            value={buyPrice}
            onChangeText={setBuyPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={[styles.metaText, { marginTop: 10 }]}>Prix de vente casier (FCFA) *</Text>
          <TextInput
            value={sellPrice}
            onChangeText={setSellPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.marginLine}>
            Marge brute calculée : {margin >= 0 ? `+${formatFcfa(margin)}` : formatFcfa(margin)}
          </Text>

          <Text style={[styles.metaText, { marginTop: 10 }]}>Stock initial (casiers) *</Text>
          <TextInput
            value={stock}
            onChangeText={setStock}
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <Pressable style={styles.addBtn} onPress={handleSave}>
          <Text style={styles.addBtnText}>Enregistrer au catalogue SQLite</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  content: { padding: Spacing.margin, gap: Spacing.md, paddingBottom: Spacing.bottomTabSafe },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  metaText: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  roleBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerLow,
    padding: 4,
    borderRadius: Radii.md,
    gap: 4,
  },
  roleTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radii.sm },
  roleTabActive: { backgroundColor: Colors.primary },
  roleTabText: { fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant },
  roleTabTextActive: { color: Colors.onPrimary },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.md,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  prodName: { fontSize: 15, fontWeight: '700', color: Colors.onSurface },
  prodPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    fontVariant: ['tabular-nums'],
  },
  marginLine: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onTertiaryContainer,
    marginTop: 6,
  },
  addBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderRadius: Radii.lg,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
  },
  addBtnText: { color: Colors.onPrimary, fontSize: 13, fontWeight: '700' },
  dangerOutlineBtn: {
    paddingVertical: 12,
    borderRadius: Radii.lg,
    backgroundColor: Colors.errorContainer,
    alignItems: 'center',
  },
  dangerText: { color: Colors.error, fontSize: 13, fontWeight: '700' },
  input: {
    height: 44,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.md,
    marginTop: 4,
    fontSize: 14,
  },
});
