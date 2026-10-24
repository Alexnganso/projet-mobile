import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radii, Spacing } from '../theme/tokens';

const BOOT_STEPS = [
  { pct: 38, label: 'Vérification de la licence du dépôt...' },
  { pct: 74, label: 'Synchronisation SQLite des grilles tarifaires...' },
  { pct: 92, label: 'Contrôle des consignes casiers et soldes clients...' },
  { pct: 100, label: 'Prêt pour la prise de poste !' },
];

export function SplashScreen() {
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIdx((prev) => (prev < BOOT_STEPS.length - 1 ? prev + 1 : prev));
    }, 850);
    return () => clearInterval(timer);
  }, []);

  const current = BOOT_STEPS[stepIdx];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerBlock}>
        <View style={styles.logoCard}>
          <Text style={styles.logoIcon}>▣</Text>
        </View>
        <Text style={styles.title}>
          DepotManager <Text style={styles.titleAccent}>Mobile</Text>
        </Text>
        <Text style={styles.subtitle}>
          Système de Gestion Commerciale & Dépôts de Boissons au Cameroun
        </Text>
        <Text style={styles.metaLine}>
          Édition Débitants & Grossistes · Douala / Yaoundé · Mode Hybride SQLite
        </Text>
      </View>

      <View style={styles.footerBlock}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${current.pct}%` }]} />
        </View>
        <View style={styles.statusRow}>
          <ActivityIndicator size="small" color={Colors.secondaryFixed} />
          <Text style={styles.statusLabel} numberOfLines={1}>
            {current.label}
          </Text>
          <Text style={styles.pctLabel}>{current.pct}%</Text>
        </View>
        <Text style={styles.nodeInfo}>
          v2.4.1 CMR · Serveur Local Akwa (Douala-1)
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryContainer,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  logoCard: {
    width: 88,
    height: 88,
    borderRadius: Radii.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  logoIcon: {
    fontSize: 40,
    color: Colors.secondaryFixed,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.onPrimary,
  },
  titleAccent: {
    color: Colors.secondaryFixed,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: 13,
    color: Colors.onPrimaryContainer,
    textAlign: 'center',
    maxWidth: 290,
  },
  metaLine: {
    marginTop: Spacing.md,
    fontSize: 11,
    color: Colors.secondaryFixed,
    textAlign: 'center',
  },
  footerBlock: {
    gap: Spacing.sm,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.secondaryFixed,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusLabel: {
    flex: 1,
    color: Colors.onPrimaryContainer,
    fontSize: 12,
  },
  pctLabel: {
    color: Colors.onPrimary,
    fontWeight: '700',
    fontSize: 12,
  },
  nodeInfo: {
    textAlign: 'center',
    color: Colors.onPrimaryContainer,
    fontSize: 11,
    marginTop: Spacing.xs,
  },
});
