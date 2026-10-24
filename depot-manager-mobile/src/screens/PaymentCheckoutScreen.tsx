import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, Radii, Spacing, formatFcfa } from '../theme/tokens';
import { useDepotStore } from '../store/useDepotStore';
import { PaymentChannel } from '../types/models';
import { RootStackParamList } from '../navigation/RootNavigator';

export function PaymentCheckoutScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { cart, products, clients, selectedClientId, selectClient, completeSale } =
    useDepotStore();

  const [mode, setMode] = useState<'cash' | 'credit'>('cash');
  const [channel, setChannel] = useState<PaymentChannel>('cash');
  const [dueDate, setDueDate] = useState('48h (Échéance convenue)');

  const netDue = Object.values(cart).reduce((sum, item) => {
    const p = products.find((prod) => prod.id === item.productId);
    return sum + (p ? p.salePriceFcfa * item.quantityCrates : 0);
  }, 0);

  const [receivedText, setReceivedText] = useState(String(Math.ceil(netDue / 5000) * 5000));
  const receivedVal = Number(receivedText) || 0;
  const changeAmount = receivedVal - netDue;

  const client = clients.find((c) => c.id === selectedClientId) ?? clients[0];

  const handleConfirm = async () => {
    if (mode === 'credit' && client.isAnonymousCounter) {
      // Bascule automatiquement sur un client professionnel identifié
      selectClient('clt-balafon');
    }
    const sale = await completeSale({
      mode,
      channel: mode === 'credit' ? 'credit' : channel,
      amountReceivedFcfa: mode === 'credit' ? 0 : Math.max(netDue, receivedVal),
      dueDateLabel: mode === 'credit' ? dueDate : undefined,
    });
    if (sale) {
      navigation.replace('SaleReceipt', { saleId: sale.id });
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.kicker}>Montant net à régler</Text>
          <Text style={styles.amountHero}>{formatFcfa(netDue)}</Text>
        </View>

        {/* Commutateur Comptant vs Crédit */}
        <View style={styles.tabBar}>
          <Pressable
            onPress={() => setMode('cash')}
            style={[styles.tabBtn, mode === 'cash' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, mode === 'cash' && styles.tabTextActive]}>
              Comptant (Payé)
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setMode('credit');
              if (client.isAnonymousCounter) selectClient('clt-balafon');
            }}
            style={[styles.tabBtn, mode === 'credit' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, mode === 'credit' && styles.tabTextActive]}>
              À Crédit (Terme)
            </Text>
          </Pressable>
        </View>

        {mode === 'cash' ? (
          <>
            <View style={styles.channelRow}>
              {(['cash', 'om', 'momo'] as const).map((ch) => (
                <Pressable
                  key={ch}
                  onPress={() => setChannel(ch)}
                  style={[styles.channelCard, channel === ch && styles.channelCardActive]}
                >
                  <Text style={styles.channelTitle}>
                    {ch === 'cash' ? 'Espèces' : ch === 'om' ? 'OM' : 'MoMo'}
                  </Text>
                  <Text style={styles.channelSub}>
                    {ch === 'cash' ? 'Guichet' : ch === 'om' ? '#150*50#' : '*126#'}
                  </Text>
                </Pressable>
              ))}
            </View>

            {channel === 'cash' ? (
              <View style={styles.card}>
                <Text style={styles.kicker}>Montant reçu en caisse (FCFA)</Text>
                <TextInput
                  value={receivedText}
                  onChangeText={setReceivedText}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Text
                  style={[
                    styles.changeText,
                    changeAmount < 0 && { color: Colors.error },
                  ]}
                >
                  {changeAmount >= 0
                    ? `Monnaie à rendre : +${formatFcfa(changeAmount)}`
                    : `Manque : ${formatFcfa(Math.abs(changeAmount))}`}
                </Text>
              </View>
            ) : (
              <View style={styles.card}>
                <Text style={styles.channelTitle}>
                  Paiement Mobile Money ({channel.toUpperCase()})
                </Text>
                <Text style={styles.channelSub}>
                  Notification USSD envoyée au {client.phone}
                </Text>
              </View>
            )}
          </>
        ) : (
          <View style={styles.card}>
            <Text style={styles.channelTitle}>{client.name}</Text>
            <Text style={styles.channelSub}>
              Ancien solde : {formatFcfa(client.creditBalanceFcfa)} · Plafond :{' '}
              {formatFcfa(client.creditLimitFcfa)}
            </Text>
            <Text style={[styles.amountHero, { fontSize: 20, color: Colors.error, marginTop: 8 }]}>
              Nouveau total dû : {formatFcfa(client.creditBalanceFcfa + netDue)}
            </Text>
            <View style={[styles.channelRow, { marginTop: Spacing.md }]}>
              {['48h', '7 Jours', '15 Jours'].map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setDueDate(d)}
                  style={[styles.channelCard, dueDate.startsWith(d) && styles.channelCardActive]}
                >
                  <Text style={styles.channelTitle}>{d}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <Pressable
          onPress={handleConfirm}
          style={[
            styles.submitBtn,
            { backgroundColor: mode === 'cash' ? Colors.onTertiaryContainer : Colors.primaryContainer },
          ]}
        >
          <Text style={styles.submitBtnText}>
            {mode === 'cash'
              ? `Valider Paiement & Émettre Reçu (${formatFcfa(netDue)})`
              : `Enregistrer Vente à Crédit (${formatFcfa(netDue)})`}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  content: { padding: Spacing.margin, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    padding: Spacing.lg,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kicker: { fontSize: 12, fontWeight: '600', color: Colors.onSurfaceVariant },
  amountHero: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.onSurface,
    marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainer,
    padding: 4,
    borderRadius: Radii.lg,
    gap: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 12, borderRadius: Radii.md, alignItems: 'center' },
  tabBtnActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  tabTextActive: { color: Colors.onPrimary },
  channelRow: { flexDirection: 'row', gap: Spacing.sm },
  channelCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  channelCardActive: {
    backgroundColor: Colors.secondaryFixed,
    borderColor: Colors.secondary,
  },
  channelTitle: { fontSize: 14, fontWeight: '700', color: Colors.onSurface },
  channelSub: { fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2 },
  input: {
    height: 48,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.md,
    fontSize: 18,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  changeText: {
    marginTop: Spacing.sm,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.onTertiaryContainer,
    fontVariant: ['tabular-nums'],
  },
  submitBtn: {
    height: 54,
    borderRadius: Radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  submitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', textAlign: 'center' },
});
