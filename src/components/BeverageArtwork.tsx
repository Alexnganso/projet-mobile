import React from 'react';
import { ProductItem } from '../types/depot';

const PALETTES: Record<
  ProductItem['artworkKey'],
  { bg: string; crate: string; bottle: string; label: string; cap: string; shortTag: string }
> = {
  castel: {
    bg: '#EFF4FF',
    crate: '#B91C1C',
    bottle: '#78350F',
    label: '#FDE68A',
    cap: '#DC2626',
    shortTag: 'CST',
  },
  beaufort: {
    bg: '#ECFDF5',
    crate: '#FACC15',
    bottle: '#065F46',
    label: '#FFFFFF',
    cap: '#059669',
    shortTag: 'BFT',
  },
  guinness: {
    bg: '#F1F5F9',
    crate: '#1E293B',
    bottle: '#0F172A',
    label: '#F59E0B',
    cap: '#D97706',
    shortTag: 'GNS',
  },
  tangui: {
    bg: '#EFF6FF',
    crate: '#38BDF8',
    bottle: '#BAE6FD',
    label: '#0284C7',
    cap: '#0369A1',
    shortTag: 'TNG',
  },
  top: {
    bg: '#FEFCE8',
    crate: '#2563EB',
    bottle: '#F59E0B',
    label: '#FEF08A',
    cap: '#CA8A04',
    shortTag: 'TOP',
  },
  export33: {
    bg: '#FEF2F2',
    crate: '#DC2626',
    bottle: '#92400E',
    label: '#FFFFFF',
    cap: '#B91C1C',
    shortTag: '33E',
  },
  kadji: {
    bg: '#FFFBEB',
    crate: '#1D4ED8',
    bottle: '#78350F',
    label: '#FBBF24',
    cap: '#D97706',
    shortTag: 'KDJ',
  },
};

export function BeverageThumb({
  artworkKey,
  outOfStock = false,
  size = 'md',
}: {
  artworkKey: ProductItem['artworkKey'];
  outOfStock?: boolean;
  size?: 'sm' | 'md' | 'hero';
}) {
  const palette = PALETTES[artworkKey] ?? PALETTES.castel;

  if (size === 'hero') {
    return (
      <div
        className={`relative w-full h-40 overflow-hidden flex items-center justify-center ${
          outOfStock ? 'grayscale opacity-75' : ''
        }`}
        style={{ backgroundColor: '#173B67' }}
      >
        <svg className="w-full h-full opacity-95" viewBox="0 0 360 160" fill="none">
          <rect width="360" height="160" fill="#0F294A" />
          {/* Warehouse rack grid */}
          <line x1="0" y1="128" x2="360" y2="128" stroke="#264774" strokeWidth="2" />
          <rect x="28" y="68" width="90" height="58" rx="6" fill={palette.crate} opacity="0.85" />
          <rect x="242" y="76" width="90" height="50" rx="6" fill={palette.crate} opacity="0.7" />
          {/* Center hero bottle & crate */}
          <rect x="136" y="88" width="88" height="44" rx="6" fill={palette.crate} />
          <line x1="136" y1="108" x2="224" y2="108" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="2" />
          {/* Bottle silhouette */}
          <rect x="172" y="20" width="16" height="8" rx="2" fill={palette.cap} />
          <path
            d="M173 28 H187 L193 52 V112 C193 116 190 119 186 119 H174 C170 119 167 116 167 112 V52 L173 28 Z"
            fill={palette.bottle}
          />
          <rect x="169" y="64" width="22" height="26" rx="3" fill={palette.label} />
          <text
            x="180"
            y="80"
            textAnchor="middle"
            fill="#0B1C30"
            fontSize="8"
            fontWeight="800"
          >
            {palette.shortTag}
          </text>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-t from-[#00254B]/90 via-[#00254B]/30 to-transparent" />
      </div>
    );
  }

  const dim = size === 'sm' ? 'w-12 h-12' : 'w-14 h-14';

  return (
    <div
      className={`${dim} rounded-lg shrink-0 flex items-center justify-center overflow-hidden border border-slate-200/80 ${
        outOfStock ? 'grayscale opacity-60' : ''
      }`}
      style={{ backgroundColor: palette.bg }}
    >
      <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
        {/* Crate base */}
        <rect x="6" y="25" width="36" height="17" rx="3.5" fill={palette.crate} />
        <line x1="6" y1="33" x2="42" y2="33" stroke="#FFFFFF" strokeOpacity="0.35" strokeWidth="1.5" />
        {/* Two bottles rising from crate */}
        <rect x="15" y="7" width="6" height="3" rx="1" fill={palette.cap} />
        <path d="M15 10 H21 L23 17 V27 H13 V17 L15 10 Z" fill={palette.bottle} />
        <rect x="14.5" y="18" width="7" height="6" rx="1" fill={palette.label} />

        <rect x="27" y="9" width="6" height="3" rx="1" fill={palette.cap} />
        <path d="M27 12 H33 L35 18 V27 H25 V18 L27 12 Z" fill={palette.bottle} />
        <rect x="26.5" y="19" width="7" height="5" rx="1" fill={palette.label} />
      </svg>
    </div>
  );
}
