/**
 * Design System officiel — DepotManager Mobile (Cameroun)
 * Tokens partagés iOS & Android garantissant une lisibilité maximale en entrepôt.
 */

export const Colors = {
  surface: '#F8F9FF',
  surfaceDim: '#CBDBF6',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#EFF4FF',
  surfaceContainer: '#E6EEFF',
  surfaceContainerHigh: '#DCE9FF',
  surfaceContainerHighest: '#D3E4FF',

  onSurface: '#0B1C30',
  onSurfaceVariant: '#43474F',
  outline: '#737780',
  outlineVariant: '#C3C6D0',

  primary: '#00254B',
  onPrimary: '#FFFFFF',
  primaryContainer: '#173B67',
  onPrimaryContainer: '#86A6D8',
  primaryFixed: '#D5E3FF',

  secondary: '#005CBD',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#488FFD',
  onSecondaryContainer: '#00285A',
  secondaryFixed: '#D7E2FF',

  tertiary: '#002C0E',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#00451A',
  onTertiaryContainer: '#16A34A',
  tertiaryFixed: '#7FFC97',

  warning: '#D97706',
  warningContainer: '#FEF3C7',

  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorContainer: '#FFDAD6',
  onErrorContainer: '#93000A',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  gutter: 12,
  margin: 16,
  bottomTabSafe: 80,
} as const;

export const Radii = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  sheet: 24,
  full: 9999,
} as const;

export const Typography = {
  displayCurrency: { fontSize: 28, lineHeight: 34, fontWeight: '700' as const, fontVariant: ['tabular-nums' as const] },
  headlineLg: { fontSize: 22, lineHeight: 28, fontWeight: '700' as const },
  headlineMd: { fontSize: 18, lineHeight: 24, fontWeight: '600' as const },
  headlineSm: { fontSize: 16, lineHeight: 22, fontWeight: '600' as const },
  bodyLg: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodyMd: { fontSize: 14, lineHeight: 20, fontWeight: '400' as const },
  bodySm: { fontSize: 12, lineHeight: 16, fontWeight: '400' as const },
  labelLg: { fontSize: 14, lineHeight: 18, fontWeight: '600' as const },
  labelMd: { fontSize: 12, lineHeight: 16, fontWeight: '600' as const },
  labelSm: { fontSize: 10, lineHeight: 14, fontWeight: '700' as const },
};

export function formatFcfa(amount: number): string {
  return `${Math.round(amount).toLocaleString('fr-FR')}\u00A0FCFA`;
}
