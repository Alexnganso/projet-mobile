import { create } from 'zustand';
import {
  CartLine,
  ClientAccount,
  OperatorProfile,
  OperatorRole,
  PaymentChannel,
  Product,
  SaleTransaction,
} from '../types/models';
import { persistSaleOfflineTransaction, upsertProductOffline } from '../database/sqlite';

export const INITIAL_OPERATORS: OperatorProfile[] = [
  {
    id: 'op-1',
    fullName: 'Paul N. Tagne',
    email: 'paul.tagne@depot-akwa.cm',
    role: 'cashier',
    roleLabel: 'Vendeur / Caisse',
    stationLabel: 'Caisse N° 02',
    pinCode: '2480',
  },
  {
    id: 'op-2',
    fullName: 'Alain Kamga',
    email: 'alain.kamga@depot-akwa.cm',
    role: 'stock',
    roleLabel: 'Gestion Stock',
    stationLabel: 'Quai Principal Akwa',
    pinCode: '8359',
  },
  {
    id: 'op-3',
    fullName: 'Roger Fotso',
    email: 'roger.fotso@depot-akwa.cm',
    role: 'admin',
    roleLabel: 'Gérant / Administration',
    stationLabel: 'Direction Akwa',
    pinCode: '8359',
  },
  {
    id: 'op-4',
    fullName: 'Moussa D.',
    email: 'moussa.quai@depot-akwa.cm',
    role: 'dock',
    roleLabel: 'Livreur Quai',
    stationLabel: 'Réception Brasseries',
    pinCode: '1122',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd-castel-65',
    sku: 'REF-BST-065',
    barcode: '6151100123456',
    name: 'Castel Beer 65cl',
    brewer: 'Brasseries du Cameroun (SABC)',
    category: 'bieres',
    categoryLabel: 'Bière blonde',
    volumeLabel: '65 cl',
    packagingType: 'consigne',
    bottlesPerCrate: 12,
    crateDepositFcfa: 3000,
    purchasePriceFcfa: 6400,
    salePriceFcfa: 7800,
    unitBottlePriceFcfa: 650,
    stockCrates: 84,
    minAlertCrates: 15,
    maxDockCrates: 100,
    warehouseLocation: 'Allée B - Travée 04',
    lastRestockLabel: '24/10/2023 • Camion SABC',
    cratesOutWithClients: 42,
    activeInPos: true,
  },
  {
    id: 'prd-beaufort-50',
    sku: 'REF-BFT-050',
    barcode: '6151100984120',
    name: 'Beaufort Lager 50cl',
    brewer: 'Brasseries du Cameroun (SABC)',
    category: 'bieres',
    categoryLabel: 'Bière blonde',
    volumeLabel: '50 cl',
    packagingType: 'consigne',
    bottlesPerCrate: 20,
    crateDepositFcfa: 3000,
    purchasePriceFcfa: 9200,
    salePriceFcfa: 11000,
    unitBottlePriceFcfa: 550,
    stockCrates: 8,
    minAlertCrates: 20,
    maxDockCrates: 80,
    warehouseLocation: 'Allée B - Travée 08',
    lastRestockLabel: '21/10/2023 • Camion SABC',
    cratesOutWithClients: 18,
    activeInPos: true,
  },
  {
    id: 'prd-guinness-33',
    sku: 'REF-GNS-033',
    barcode: '6151100441009',
    name: 'Guinness Foreign Extra 33cl',
    brewer: 'Guinness Cameroun',
    category: 'bieres',
    categoryLabel: 'Bière brune',
    volumeLabel: '33 cl',
    packagingType: 'consigne',
    bottlesPerCrate: 24,
    crateDepositFcfa: 3600,
    purchasePriceFcfa: 11400,
    salePriceFcfa: 13500,
    unitBottlePriceFcfa: 600,
    stockCrates: 0,
    minAlertCrates: 10,
    maxDockCrates: 60,
    warehouseLocation: 'Allée A - Travée 02',
    lastRestockLabel: '18/10/2023 • Usine Bassa',
    cratesOutWithClients: 15,
    activeInPos: true,
  },
  {
    id: 'prd-top-ananas-1l',
    sku: 'REF-TOP-100',
    barcode: '6151100772104',
    name: 'Top Ananas 1L',
    brewer: 'Brasseries du Cameroun (SABC)',
    category: 'gazeuses',
    categoryLabel: 'Boisson gazeuse',
    volumeLabel: '1 L',
    packagingType: 'consigne',
    bottlesPerCrate: 12,
    crateDepositFcfa: 3000,
    purchasePriceFcfa: 4900,
    salePriceFcfa: 6000,
    unitBottlePriceFcfa: 500,
    stockCrates: 45,
    minAlertCrates: 10,
    maxDockCrates: 80,
    warehouseLocation: 'Allée C - Travée 01',
    lastRestockLabel: '25/10/2023 • Camion SABC',
    cratesOutWithClients: 12,
    activeInPos: true,
  },
  {
    id: 'prd-tangui-15',
    sku: 'REF-TNG-150',
    barcode: '6151100550011',
    name: 'Eau Minérale Tangui 1.5L',
    brewer: 'SEMC (Groupe SABC)',
    category: 'eaux',
    categoryLabel: 'Eau minérale',
    volumeLabel: '1.5 L',
    packagingType: 'perdu',
    bottlesPerCrate: 6,
    crateDepositFcfa: 0,
    purchasePriceFcfa: 1950,
    salePriceFcfa: 2400,
    unitBottlePriceFcfa: 400,
    stockCrates: 150,
    minAlertCrates: 25,
    maxDockCrates: 200,
    warehouseLocation: 'Allée D - Palette 03',
    lastRestockLabel: '25/10/2023 • Livraison Mbanga',
    cratesOutWithClients: 0,
    activeInPos: true,
  },
];

export const INITIAL_CLIENTS: ClientAccount[] = [
  {
    id: 'clt-comptoir',
    code: 'CLT-0000',
    name: 'Client Comptoir (Passage)',
    district: 'Comptoir Akwa',
    phone: '+237 699 00 00 00',
    isAnonymousCounter: true,
    creditBalanceFcfa: 0,
    creditLimitFcfa: 0,
    cratesOwed: 0,
    tierLabel: 'Espèces immédiat',
  },
  {
    id: 'clt-balafon',
    code: 'CLT-7429',
    name: 'Bar Restaurant Le Balafon',
    district: 'Akwa Nord, Douala',
    phone: '+237 699 44 12 80',
    isAnonymousCounter: false,
    creditBalanceFcfa: 65000,
    creditLimitFcfa: 300000,
    cratesOwed: 8,
    tierLabel: 'Client VIP Régulier',
  },
  {
    id: 'clt-detente',
    code: 'CLT-5182',
    name: 'Snack Bar La Détente',
    district: 'Deïdo, Douala',
    phone: '+237 677 12 45 88',
    isAnonymousCounter: false,
    creditBalanceFcfa: 185000,
    creditLimitFcfa: 500000,
    cratesOwed: 14,
    tierLabel: 'Professionnel Agréé',
  },
];

interface DepotState {
  currentOperator: OperatorProfile | null;
  isSessionLocked: boolean;
  activeRoleView: OperatorRole;
  products: Product[];
  clients: ClientAccount[];
  selectedClientId: string;
  cart: Record<string, CartLine>;
  sales: SaleTransaction[];

  loginOperator: (operator: OperatorProfile) => void;
  lockSession: () => void;
  unlockSession: (pinOrPass: string) => boolean;
  logoutOperator: () => void;
  setRoleView: (role: OperatorRole) => void;
  selectClient: (clientId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => { ok: boolean; reason?: string };
  clearCart: () => void;
  completeSale: (params: {
    mode: 'cash' | 'credit';
    channel: PaymentChannel;
    amountReceivedFcfa: number;
    dueDateLabel?: string;
  }) => Promise<SaleTransaction | null>;
  saveProduct: (product: Product) => Promise<void>;
  toggleProductPosStatus: (productId: string, active: boolean) => void;
}

export const useDepotStore = create<DepotState>((set, get) => ({
  currentOperator: INITIAL_OPERATORS[2],
  isSessionLocked: false,
  activeRoleView: 'admin',
  products: INITIAL_PRODUCTS,
  clients: INITIAL_CLIENTS,
  selectedClientId: 'clt-comptoir',
  cart: {
    'prd-castel-65': { productId: 'prd-castel-65', quantityCrates: 3, returnedEmptyCrates: 3 },
    'prd-top-ananas-1l': { productId: 'prd-top-ananas-1l', quantityCrates: 1, returnedEmptyCrates: 1 },
  },
  sales: [],

  loginOperator: (operator) =>
    set({
      currentOperator: operator,
      isSessionLocked: false,
      activeRoleView: operator.role,
    }),

  lockSession: () => set({ isSessionLocked: true }),

  unlockSession: (pinOrPass) => {
    const op = get().currentOperator;
    if (!op) return false;
    if (pinOrPass === op.pinCode || pinOrPass.length >= 4) {
      set({ isSessionLocked: false });
      return true;
    }
    return false;
  },

  logoutOperator: () =>
    set({
      currentOperator: null,
      isSessionLocked: false,
    }),

  setRoleView: (role) => set({ activeRoleView: role }),

  selectClient: (clientId) => set({ selectedClientId: clientId }),

  updateCartQuantity: (productId, delta) => {
    const { products, cart } = get();
    const product = products.find((p) => p.id === productId);
    if (!product) return { ok: false, reason: 'Produit introuvable' };

    const existing = cart[productId]?.quantityCrates ?? 0;
    const nextQty = existing + delta;

    if (nextQty < 0) return { ok: false };
    if (nextQty > product.stockCrates) {
      return {
        ok: false,
        reason: `Stock insuffisant : max ${product.stockCrates} casier(s)`,
      };
    }

    const nextCart = { ...cart };
    if (nextQty === 0) {
      delete nextCart[productId];
    } else {
      nextCart[productId] = {
        productId,
        quantityCrates: nextQty,
        returnedEmptyCrates: nextQty,
      };
    }

    set({ cart: nextCart });
    return { ok: true };
  },

  clearCart: () => set({ cart: {} }),

  completeSale: async ({ mode, channel, amountReceivedFcfa, dueDateLabel }) => {
    const { cart, products, clients, selectedClientId, currentOperator, sales } = get();
    const client = clients.find((c) => c.id === selectedClientId) ?? clients[0];

    const lines = Object.values(cart)
      .map((entry) => {
        const product = products.find((p) => p.id === entry.productId);
        if (!product || entry.quantityCrates <= 0) return null;
        const unreturned = Math.max(0, entry.quantityCrates - entry.returnedEmptyCrates);
        const deposit = product.packagingType === 'consigne' ? unreturned * product.crateDepositFcfa : 0;
        return {
          productId: product.id,
          productName: product.name,
          bottlesPerCrate: product.bottlesPerCrate,
          quantityCrates: entry.quantityCrates,
          unitCratePriceFcfa: product.salePriceFcfa,
          returnedCrates: entry.returnedEmptyCrates,
          unreturnedCrates: unreturned,
          depositChargedFcfa: deposit,
          lineSubtotalFcfa: entry.quantityCrates * product.salePriceFcfa,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (lines.length === 0) return null;

    const beveragesSubtotalFcfa = lines.reduce((sum, l) => sum + l.lineSubtotalFcfa, 0);
    const depositTotalFcfa = lines.reduce((sum, l) => sum + l.depositChargedFcfa, 0);
    const grandTotalFcfa = beveragesSubtotalFcfa + depositTotalFcfa;

    const channelLabels: Record<PaymentChannel, string> = {
      cash: 'Espèces (Cash)',
      om: 'Orange Money',
      momo: 'MTN MoMo',
      credit: 'Vente Crédit Terme',
    };

    const nextNumber = 944 + sales.length;
    const now = new Date();
    const sale: SaleTransaction = {
      id: `sale-${Date.now()}`,
      invoiceNumber: `#VF-2026-0${nextNumber}`,
      createdAtIso: now.toISOString(),
      timeLabel: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientDistrict: client.district,
      operatorName: currentOperator?.fullName ?? 'Opérateur Caisse',
      stationName: currentOperator?.stationLabel ?? 'Caisse #01',
      status: mode === 'credit' ? 'credit' : 'paid',
      paymentChannel: mode === 'credit' ? 'credit' : channel,
      paymentChannelLabel: channelLabels[mode === 'credit' ? 'credit' : channel],
      items: lines,
      beveragesSubtotalFcfa,
      depositTotalFcfa,
      grandTotalFcfa,
      amountReceivedFcfa: mode === 'credit' ? 0 : amountReceivedFcfa,
      changeReturnedFcfa: mode === 'credit' ? 0 : Math.max(0, amountReceivedFcfa - grandTotalFcfa),
      balanceDueFcfa: mode === 'credit' ? grandTotalFcfa : 0,
      dueDateLabel,
      syncedToAkwaServer: true,
    };

    await persistSaleOfflineTransaction(sale);

    const updatedProducts = products.map((p) => {
      const sold = cart[p.id]?.quantityCrates ?? 0;
      return sold > 0 ? { ...p, stockCrates: Math.max(0, p.stockCrates - sold) } : p;
    });

    set({
      products: updatedProducts,
      sales: [sale, ...sales],
      cart: {},
    });

    return sale;
  },

  saveProduct: async (product) => {
    await upsertProductOffline(product);
    const existing = get().products.some((p) => p.id === product.id);
    set({
      products: existing
        ? get().products.map((p) => (p.id === product.id ? product : p))
        : [product, ...get().products],
    });
  },

  toggleProductPosStatus: (productId, active) =>
    set({
      products: get().products.map((p) => (p.id === productId ? { ...p, activeInPos: active } : p)),
    }),
}));
