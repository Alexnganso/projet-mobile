import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';
import { Colors, Radii, Spacing, formatFcfa } from '../theme/tokens';
import { INITIAL_OPERATORS, useDepotStore } from '../store/useDepotStore';

export function LoginScreen() {
  const loginOperator = useDepotStore((s) => s.loginOperator);
  const [selectedOp, setSelectedOp] = useState(INITIAL_OPERATORS[0]);
  const [password, setPassword] = useState('Depot2026!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = () => {
    if (password.trim().length < 4) {
      setErrorMsg('Mot de passe invalide. Contactez la gérance du dépôt Akwa.');
      return;
    }
    setErrorMsg(null);
    loginOperator(selectedOp);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.brandTitle}>DepotManager Pro</Text>
          <Text style={styles.subtitle}>
            Système Opérationnel de Caisse & Casiers · Réseau Akwa
          </Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sélectionner le profil de poste</Text>
          <View style={styles.grid}>
            {INITIAL_OPERATORS.map((op) => {
              const active = op.id === selectedOp.id;
              return (
                <Pressable
                  key={op.id}
                  onPress={() => setSelectedOp(op)}
                  style={[styles.roleButton, active && styles.roleButtonActive]}
                >
                  <Text style={[styles.roleTitle, active && styles.roleTextActive]}>
                    {op.roleLabel}
                  </Text>
                  <Text style={[styles.roleSub, active && styles.roleTextActive]}>
                    {op.fullName}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Identifiant professionnel</Text>
          <TextInput
            value={selectedOp.email}
            editable={false}
            style={styles.input}
          />
          <Text style={[styles.label, { marginTop: Spacing.md }]}>
            Mot de passe de session
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Pressable style={styles.primaryCta} onPress={handleLogin}>
          <Text style={styles.primaryCtaText}>Ouvrir la session opérateur</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export function SessionLockScreen() {
  const { currentOperator, unlockSession, logoutOperator, cart, products } = useDepotStore();
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const preservedTotal = Object.values(cart).reduce((sum, line) => {
    const prod = products.find((p) => p.id === line.productId);
    return sum + (prod ? prod.salePriceFcfa * line.quantityCrates : 0);
  }, 0);

  const handleBiometricUnlock = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) return;
    const res = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Déverrouiller la caisse DepotManager',
    });
    if (res.success) {
      unlockSession(currentOperator?.pinCode ?? '0000');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session suspendue pour inactivité</Text>
          <Text style={styles.subtitle}>
            {currentOperator?.fullName} · {currentOperator?.stationLabel}
          </Text>
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              Panier préservé : {formatFcfa(preservedTotal)}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Code PIN à 4 chiffres</Text>
          <TextInput
            value={pin}
            onChangeText={(v) => {
              setPin(v);
              setPinError(false);
            }}
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            placeholder="••••"
            style={styles.input}
          />
          {pinError ? (
            <Text style={styles.errorText}>Code PIN incorrect</Text>
          ) : null}

          <Pressable style={styles.secondaryCta} onPress={handleBiometricUnlock}>
            <Text style={styles.secondaryCtaText}>
              Déverrouillage biométrique (Face ID / Empreinte)
            </Text>
          </Pressable>

          <Pressable
            style={[styles.primaryCta, { marginTop: Spacing.sm }]}
            onPress={() => {
              if (!unlockSession(pin)) setPinError(true);
            }}
          >
            <Text style={styles.primaryCtaText}>Déverrouiller et reprendre la caisse</Text>
          </Pressable>

          <Pressable
            style={[styles.secondaryCta, { marginTop: Spacing.sm }]}
            onPress={logoutOperator}
          >
            <Text style={styles.secondaryCtaText}>Changer d'opérateur</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function LogoutConfirmScreen() {
  const navigation = useNavigation();
  const { currentOperator, logoutOperator, sales } = useDepotStore();
  const [mode, setMode] = useState<'switch' | 'z_report'>('switch');

  const dailyRevenue = sales
    .filter((s) => s.status !== 'cancelled')
    .reduce((sum, s) => sum + s.grandTotalFcfa, 1420000);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.brandTitle}>Confirmer la déconnexion</Text>
          <Text style={styles.subtitle}>
            {currentOperator?.fullName} · CA Journalier : {formatFcfa(dailyRevenue)}
          </Text>
        </View>

        <Pressable
          onPress={() => setMode('switch')}
          style={[styles.card, mode === 'switch' && styles.selectedBorder]}
        >
          <Text style={styles.sectionTitle}>Changement d'opérateur</Text>
          <Text style={styles.subtitle}>
            Garde le tiroir-caisse ouvert et la session active pour la relève rapide.
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode('z_report')}
          style={[styles.card, mode === 'z_report' && styles.selectedBorder]}
        >
          <Text style={styles.sectionTitle}>Clôture de poste & Ticket Z</Text>
          <Text style={styles.subtitle}>
            Édite le Ticket Z de caisse, comptabilise les casiers retournés et verrouille le poste.
          </Text>
        </Pressable>

        <Pressable style={styles.primaryCta} onPress={logoutOperator}>
          <Text style={styles.primaryCtaText}>Confirmer la déconnexion</Text>
        </Pressable>

        <Pressable style={styles.secondaryCta} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryCtaText}>Annuler et continuer ma session</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { padding: Spacing.margin, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectedBorder: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.surfaceContainerLow,
  },
  brandTitle: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: Colors.onSurface, marginBottom: 4 },
  subtitle: { fontSize: 13, color: Colors.onSurfaceVariant, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: Spacing.sm },
  roleButton: {
    width: '48%',
    padding: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
  },
  roleButtonActive: { backgroundColor: Colors.primary },
  roleTitle: { fontSize: 12, fontWeight: '700', color: Colors.onSurface },
  roleSub: { fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2 },
  roleTextActive: { color: Colors.onPrimary },
  label: { fontSize: 12, fontWeight: '600', color: Colors.onSurface, marginBottom: 6 },
  input: {
    height: 46,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    color: Colors.onSurface,
  },
  infoBanner: {
    marginTop: Spacing.md,
    padding: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
  },
  infoBannerText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  errorBox: {
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.errorContainer,
  },
  errorText: { fontSize: 12, fontWeight: '600', color: Colors.error, marginTop: 4 },
  primaryCta: {
    height: 50,
    borderRadius: Radii.lg,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaText: { color: Colors.onPrimary, fontSize: 15, fontWeight: '600' },
  secondaryCta: {
    height: 46,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  secondaryCtaText: { color: Colors.onSurface, fontSize: 13, fontWeight: '600' },
});
