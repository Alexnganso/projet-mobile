import React, { useEffect, useState } from 'react';
import {
  BatteryCharging,
  Code2,
  FolderOpen,
  LayoutGrid,
  MoreHorizontal,
  Package,
  RotateCcw,
  ShoppingCart,
  Smartphone,
  Users,
  Wifi,
} from 'lucide-react';
import {
  CartEntry,
  ClientAccount,
  MobileScreenId,
  OperatorProfile,
  OperatorRole,
  PaymentChannel,
  PlatformOS,
  ProductItem,
  SaleRecord,
} from '../types/depot';
import {
  INITIAL_CLIENTS_DATA,
  INITIAL_PRODUCTS_DATA,
  INITIAL_SALES_DATA,
  OPERATORS_DATA,
  SCREEN_CATALOG,
} from '../data/initialDepotData';
import {
  LoginView,
  LogoutConfirmView,
  SessionLockView,
  SplashView,
} from './SimulatorScreensAuth';
import { DashboardView } from './SimulatorScreenDashboard';
import { PaymentCheckoutView, PosTerminalView } from './SimulatorScreensPos';
import {
  ClientsDirectoryView,
  SaleAuditDetailView,
  SaleReceiptView,
  SalesJournalView,
} from './SimulatorScreensReceipts';
import {
  DeactivateSheetView,
  ProductDetailView,
  ProductFormView,
  StockCatalogView,
} from './SimulatorScreensStock';

const STORAGE_KEY = 'depot_manager_studio_state_v1';

const SCREENS_WITH_BOTTOM_TABS: MobileScreenId[] = [
  'dashboard',
  'pos',
  'stock-catalog',
  'clients',
  'sales-journal',
];

export function MobileSimulatorWorkspace({
  onInspectMobileFile,
  onDownloadZip,
}: {
  onInspectMobileFile: (relativePath: string) => void;
  onDownloadZip: () => void;
}) {
  const [platform, setPlatform] = useState<PlatformOS>('ios');
  const [activeScreen, setActiveScreen] = useState<MobileScreenId>('dashboard');
  const [operator, setOperator] = useState<OperatorProfile>(OPERATORS_DATA[2]);
  const [roleView, setRoleView] = useState<OperatorRole>('admin');

  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.products)) return parsed.products;
      }
    } catch {
      // ignore storage errors
    }
    return INITIAL_PRODUCTS_DATA;
  });

  const [clients, setClients] = useState<ClientAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.clients)) return parsed.clients;
      }
    } catch {
      // ignore
    }
    return INITIAL_CLIENTS_DATA;
  });

  const [sales, setSales] = useState<SaleRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.sales)) return parsed.sales;
      }
    } catch {
      // ignore
    }
    return INITIAL_SALES_DATA;
  });

  const [selectedClientId, setSelectedClientId] = useState<string>('clt-comptoir');
  const [cart, setCart] = useState<Record<string, CartEntry>>({
    'prd-castel-65': { productId: 'prd-castel-65', quantityCrates: 3, returnedCrates: 3 },
    'prd-top-ananas-1l': { productId: 'prd-top-ananas-1l', quantityCrates: 1, returnedCrates: 1 },
  });

  const [selectedProductId, setSelectedProductId] = useState<string>('prd-castel-65');
  const [editingNewProduct, setEditingNewProduct] = useState<boolean>(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string>('sale-0940');
  const [plusSheetOpen, setPlusSheetOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ products, clients, sales })
      );
    } catch {
      // ignore quota errors
    }
  }, [products, clients, sales]);

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts(INITIAL_PRODUCTS_DATA);
    setClients(INITIAL_CLIENTS_DATA);
    setSales(INITIAL_SALES_DATA);
    setCart({
      'prd-castel-65': { productId: 'prd-castel-65', quantityCrates: 3, returnedCrates: 3 },
      'prd-top-ananas-1l': { productId: 'prd-top-ananas-1l', quantityCrates: 1, returnedCrates: 1 },
    });
    setActiveScreen('dashboard');
  };

  const handleStepCart = (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return { ok: false, message: 'Produit introuvable' };

    const currentQty = cart[productId]?.quantityCrates ?? 0;
    const nextQty = currentQty + delta;

    if (nextQty < 0) return { ok: false };
    if (nextQty > product.stockCrates) {
      return {
        ok: false,
        message: `Stock insuffisant : max ${product.stockCrates} casier(s) dispo`,
      };
    }

    setCart((prev) => {
      const copy = { ...prev };
      if (nextQty === 0) {
        delete copy[productId];
      } else {
        copy[productId] = {
          productId,
          quantityCrates: nextQty,
          returnedCrates: nextQty,
        };
      }
      return copy;
    });
    return { ok: true };
  };

  const handleConfirmPayment = ({
    mode,
    channel,
    amountReceivedFcfa,
    unreturnedCratesTotal,
    dueDateLabel,
  }: {
    mode: 'cash' | 'credit';
    channel: PaymentChannel;
    amountReceivedFcfa: number;
    unreturnedCratesTotal: number;
    dueDateLabel?: string;
  }) => {
    const client = clients.find((c) => c.id === selectedClientId) ?? clients[0];

    let remainingUnreturned = unreturnedCratesTotal;
    const items = Object.values(cart)
      .map((entry) => {
        const prod = products.find((p) => p.id === entry.productId);
        if (!prod || entry.quantityCrates <= 0) return null;
        const unretForLine =
          prod.packagingType === 'consigne'
            ? Math.min(entry.quantityCrates, remainingUnreturned)
            : 0;
        remainingUnreturned = Math.max(0, remainingUnreturned - unretForLine);
        const deposit = unretForLine * prod.crateDepositFcfa;
        return {
          productId: prod.id,
          productName: prod.name,
          bottlesPerCrate: prod.bottlesPerCrate,
          quantityCrates: entry.quantityCrates,
          unitCratePriceFcfa: prod.salePriceFcfa,
          returnedCrates: entry.quantityCrates - unretForLine,
          unreturnedCrates: unretForLine,
          depositChargedFcfa: deposit,
          lineSubtotalFcfa: entry.quantityCrates * prod.salePriceFcfa,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (items.length === 0) return;

    const beveragesSubtotalFcfa = items.reduce((s, i) => s + i.lineSubtotalFcfa, 0);
    const depositTotalFcfa = items.reduce((s, i) => s + i.depositChargedFcfa, 0);
    const grandTotalFcfa = beveragesSubtotalFcfa + depositTotalFcfa;

    const labels: Record<PaymentChannel, string> = {
      cash: 'Espèces (Cash)',
      om: 'Orange Money',
      momo: 'MTN MoMo',
      credit: 'Vente Crédit Terme',
    };

    const now = new Date();
    const shortTime = now.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const newSale: SaleRecord = {
      id: `sale-${Date.now()}`,
      invoiceNumber: `#VF-2026-0${944 + sales.length}`,
      dateTimeLabel: `Aujourd’hui à ${shortTime}`,
      shortTime,
      periodTag: 'today',
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientDistrict: client.district,
      operatorName: operator.fullName,
      stationName: operator.stationLabel,
      supervisorName: 'Roger Fotso (Gérant Dépôt)',
      status: mode === 'credit' ? 'credit' : 'paid',
      paymentChannel: mode === 'credit' ? 'credit' : channel,
      paymentChannelLabel: labels[mode === 'credit' ? 'credit' : channel],
      items,
      beveragesSubtotalFcfa,
      depositTotalFcfa,
      grandTotalFcfa,
      amountReceivedFcfa: mode === 'credit' ? 0 : amountReceivedFcfa,
      changeReturnedFcfa:
        mode === 'credit' ? 0 : Math.max(0, amountReceivedFcfa - grandTotalFcfa),
      balanceDueFcfa: mode === 'credit' ? grandTotalFcfa : 0,
      dueDateLabel,
    };

    // Décrémente les stocks produits
    setProducts((prev) =>
      prev.map((p) => {
        const sold = cart[p.id]?.quantityCrates ?? 0;
        if (sold === 0) return p;
        return {
          ...p,
          stockCrates: Math.max(0, p.stockCrates - sold),
        };
      })
    );

    // Met à jour le compte client si crédit ou consignes non rendues
    if (mode === 'credit' || unreturnedCratesTotal > 0) {
      setClients((prev) =>
        prev.map((c) =>
          c.id === client.id
            ? {
                ...c,
                creditBalanceFcfa:
                  c.creditBalanceFcfa + (mode === 'credit' ? grandTotalFcfa : 0),
                cratesOwed: c.cratesOwed + unreturnedCratesTotal,
              }
            : c
        )
      );
    }

    setSales((prev) => [newSale, ...prev]);
    setCart({});
    setSelectedSaleId(newSale.id);
    setActiveScreen('receipt');
  };

  const handleCancelSale = (saleId: string, pin: string): boolean => {
    if (pin.trim().length < 4) return false;
    const target = sales.find((s) => s.id === saleId);
    if (!target || target.status === 'cancelled') return false;

    // Réintègre les casiers en stock
    setProducts((prev) =>
      prev.map((p) => {
        const line = target.items.find((i) => i.productId === p.id);
        return line ? { ...p, stockCrates: p.stockCrates + line.quantityCrates } : p;
      })
    );

    if (target.status === 'credit') {
      setClients((prev) =>
        prev.map((c) =>
          c.id === target.clientId
            ? {
                ...c,
                creditBalanceFcfa: Math.max(
                  0,
                  c.creditBalanceFcfa - target.balanceDueFcfa
                ),
              }
            : c
        )
      );
    }

    setSales((prev) =>
      prev.map((s) =>
        s.id === saleId
          ? {
              ...s,
              status: 'cancelled',
              paymentChannelLabel: 'Annulé',
              balanceDueFcfa: 0,
              cancelReason: 'Annulation validée par code Superviseur (Stock restitué)',
              cancelledBy: 'Roger Fotso (Gérant)',
            }
          : s
      )
    );
    return true;
  };

  const currentProduct =
    products.find((p) => p.id === selectedProductId) ?? products[0];
  const currentSale = sales.find((s) => s.id === selectedSaleId) ?? sales[0];
  const currentScreenMeta =
    SCREEN_CATALOG.find((m) => m.id === activeScreen) ?? SCREEN_CATALOG[4];

  const showBottomTabs = SCREENS_WITH_BOTTOM_TABS.includes(activeScreen);

  const groupedScreens = SCREEN_CATALOG.reduce<Record<string, typeof SCREEN_CATALOG>>(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLONNE GAUCHE : Simulateur Interactif iOS / Android */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center">
          {/* Barre de contrôle OS au-dessus du téléphone */}
          <div className="w-full max-w-[398px] mb-3 flex items-center justify-between gap-2">
            <div className="inline-flex p-1 bg-white border border-slate-200 rounded-xl">
              <button
                type="button"
                onClick={() => setPlatform('ios')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  platform === 'ios'
                    ? 'bg-[#00254B] text-white'
                    : 'text-[#43474F] hover:text-[#0B1C30]'
                }`}
              >
                iOS (iPhone)
              </button>
              <button
                type="button"
                onClick={() => setPlatform('android')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  platform === 'android'
                    ? 'bg-[#00254B] text-white'
                    : 'text-[#43474F] hover:text-[#0B1C30]'
                }`}
              >
                Android (Terminal)
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              title="Réinitialiser les données SQLite de démo"
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#43474F] hover:text-[#0B1C30] flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          </div>

          {/* Châssis Mobile réaliste iOS / Android */}
          <div
            className={`w-full max-w-[398px] h-[790px] bg-[#F8F9FF] border-[7px] border-[#0B1C30] shadow-xl flex flex-col overflow-hidden relative ${
              platform === 'ios' ? 'rounded-[44px]' : 'rounded-[28px]'
            }`}
          >
            {/* Barre de statut iOS Dynamic Island vs Android */}
            <div
              className={`h-9 px-5 flex items-center justify-between text-[11px] font-semibold shrink-0 select-none ${
                activeScreen === 'splash'
                  ? 'bg-[#173B67] text-white'
                  : 'bg-white border-b border-slate-100 text-[#0B1C30]'
              }`}
            >
              <span className="tabular-nums">09:42</span>
              {platform === 'ios' ? (
                <div className="w-20 h-4 rounded-full bg-[#0B1C30]" />
              ) : (
                <span className="text-[10px] font-mono opacity-75">4G+ · AKWA</span>
              )}
              <div className="flex items-center gap-1.5 tabular-nums">
                <Wifi className="w-3.5 h-3.5" />
                <span>92%</span>
                <BatteryCharging className="w-4 h-4" />
              </div>
            </div>

            {/* Zone d'écran scrollable */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              {activeScreen === 'splash' && <SplashView onNavigate={setActiveScreen} />}

              {activeScreen === 'login' && (
                <LoginView
                  currentOperator={operator}
                  onSelectOperator={(op) => {
                    setOperator(op);
                    setRoleView(op.role);
                  }}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'session-lock' && (
                <SessionLockView
                  operator={operator}
                  platform={platform}
                  cart={cart}
                  products={products}
                  clientName={
                    clients.find((c) => c.id === selectedClientId)?.name ??
                    'Bar Le Balafon'
                  }
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'logout-confirm' && (
                <LogoutConfirmView
                  operator={operator}
                  sales={sales}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'dashboard' && (
                <DashboardView
                  operator={operator}
                  roleView={roleView}
                  onChangeRoleView={setRoleView}
                  products={products}
                  clients={clients}
                  sales={sales}
                  onNavigate={setActiveScreen}
                  onOpenProduct={(id) => {
                    setSelectedProductId(id);
                    setActiveScreen('product-detail');
                  }}
                  onOpenSale={(id) => {
                    setSelectedSaleId(id);
                    setActiveScreen('sale-detail');
                  }}
                />
              )}

              {activeScreen === 'pos' && (
                <PosTerminalView
                  products={products}
                  clients={clients}
                  selectedClientId={selectedClientId}
                  onSelectClient={setSelectedClientId}
                  cart={cart}
                  onStepCart={handleStepCart}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'payment' && (
                <PaymentCheckoutView
                  products={products}
                  clients={clients}
                  selectedClientId={selectedClientId}
                  onSelectClient={setSelectedClientId}
                  cart={cart}
                  onConfirmPayment={handleConfirmPayment}
                  onNavigate={setActiveScreen}
                />
              )}

              {(activeScreen === 'receipt' || activeScreen === 'thermal-preview') && (
                <SaleReceiptView
                  sale={currentSale}
                  initialThermalMode={activeScreen === 'thermal-preview'}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'sales-journal' && (
                <SalesJournalView
                  sales={sales}
                  onOpenSaleDetail={(id) => {
                    setSelectedSaleId(id);
                    setActiveScreen('sale-detail');
                  }}
                  onOpenReceipt={(id) => {
                    setSelectedSaleId(id);
                    setActiveScreen('thermal-preview');
                  }}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'sale-detail' && (
                <SaleAuditDetailView
                  sale={currentSale}
                  sales={sales}
                  onSelectSale={setSelectedSaleId}
                  onCancelSale={handleCancelSale}
                  onOpenReceipt={(id) => {
                    setSelectedSaleId(id);
                    setActiveScreen('thermal-preview');
                  }}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'stock-catalog' && (
                <StockCatalogView
                  products={products}
                  roleView={roleView}
                  onChangeRoleView={setRoleView}
                  onOpenProductDetail={(id) => {
                    setSelectedProductId(id);
                    setActiveScreen('product-detail');
                  }}
                  onOpenNewProduct={() => {
                    setEditingNewProduct(true);
                    setActiveScreen('product-form');
                  }}
                  onSellProduct={(id) => {
                    handleStepCart(id, 1);
                    setActiveScreen('pos');
                  }}
                  onRestockProduct={(id, crates) => {
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === id ? { ...p, stockCrates: p.stockCrates + crates } : p
                      )
                    );
                  }}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'product-detail' && (
                <ProductDetailView
                  product={currentProduct}
                  roleView={roleView}
                  onChangeRoleView={setRoleView}
                  onToggleFavorite={(id) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === id ? { ...p, favorite: !p.favorite } : p
                      )
                    )
                  }
                  onRestock={(id, delta) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === id
                          ? { ...p, stockCrates: p.stockCrates + delta }
                          : p
                      )
                    )
                  }
                  onSellProduct={(id) => {
                    handleStepCart(id, 1);
                    setActiveScreen('pos');
                  }}
                  onNavigate={(scr) => {
                    if (scr === 'product-form') setEditingNewProduct(false);
                    setActiveScreen(scr);
                  }}
                />
              )}

              {activeScreen === 'product-form' && (
                <ProductFormView
                  existingProduct={editingNewProduct ? null : currentProduct}
                  onSaveProduct={(saved) => {
                    setProducts((prev) => {
                      const exists = prev.some((p) => p.id === saved.id);
                      return exists
                        ? prev.map((p) => (p.id === saved.id ? saved : p))
                        : [saved, ...prev];
                    });
                    setSelectedProductId(saved.id);
                    setActiveScreen('product-detail');
                  }}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'deactivate-sheet' && (
                <DeactivateSheetView
                  product={currentProduct}
                  onConfirmToggleActive={(id, nextActive) => {
                    setProducts((prev) =>
                      prev.map((p) =>
                        p.id === id ? { ...p, activeInPos: nextActive } : p
                      )
                    );
                    setActiveScreen('product-detail');
                  }}
                  onNavigate={setActiveScreen}
                />
              )}

              {activeScreen === 'clients' && (
                <ClientsDirectoryView
                  clients={clients}
                  onSettleClientDebt={(id, amount) =>
                    setClients((prev) =>
                      prev.map((c) =>
                        c.id === id
                          ? {
                              ...c,
                              creditBalanceFcfa: Math.max(0, c.creditBalanceFcfa - amount),
                            }
                          : c
                      )
                    )
                  }
                  onReturnClientCrates={(id, count) =>
                    setClients((prev) =>
                      prev.map((c) =>
                        c.id === id
                          ? { ...c, cratesOwed: Math.max(0, c.cratesOwed - count) }
                          : c
                      )
                    )
                  }
                  onSelectClientForPos={(id) => {
                    setSelectedClientId(id);
                    setActiveScreen('pos');
                  }}
                />
              )}
            </div>

            {/* Menu Plus rapide */}
            {plusSheetOpen && (
              <div className="absolute inset-0 z-30 bg-[#0B1C30]/45 backdrop-blur-xs flex items-end">
                <div className="w-full bg-white rounded-t-2xl p-4 space-y-2 shadow-xl">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold text-[#00254B]">
                      Opérations & Session Dépôt
                    </span>
                    <button
                      type="button"
                      onClick={() => setPlusSheetOpen(false)}
                      className="text-xs font-semibold text-[#43474F] cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                  {(
                    [
                      { id: 'sales-journal', label: 'Journal & Historique des Ventes' },
                      { id: 'thermal-preview', label: 'Test Imprimante Bluetooth ESC/POS' },
                      { id: 'session-lock', label: 'Verrouiller la Caisse (Pause 15 min)' },
                      { id: 'logout-confirm', label: 'Clôture de Poste & Ticket Z' },
                      { id: 'splash', label: 'Relancer Écran Splash & Diagnostic' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setPlusSheetOpen(false);
                        setActiveScreen(item.id);
                      }}
                      className="w-full p-2.5 rounded-xl bg-[#EFF4FF] hover:bg-[#DCE9FF] text-left text-xs font-semibold text-[#0B1C30] cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Barre de navigation inférieure (5 onglets officiels) */}
            {showBottomTabs && (
              <nav className="h-16 bg-white border-t border-slate-200 grid grid-cols-5 items-center px-1 shrink-0 z-20">
                {(
                  [
                    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
                    { id: 'pos', label: 'Ventes', icon: ShoppingCart },
                    { id: 'stock-catalog', label: 'Stock', icon: Package },
                    { id: 'clients', label: 'Clients', icon: Users },
                  ] as const
                ).map((tab) => {
                  const Icon = tab.icon;
                  const active =
                    activeScreen === tab.id ||
                    (tab.id === 'pos' && activeScreen === 'sales-journal');
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setPlusSheetOpen(false);
                        setActiveScreen(tab.id);
                      }}
                      className={`flex flex-col items-center justify-center h-full gap-0.5 relative cursor-pointer ${
                        active ? 'text-[#005CBD] font-bold' : 'text-[#5B6B82]'
                      }`}
                    >
                      {active && (
                        <span className="absolute top-0 w-7 h-[3px] bg-[#005CBD] rounded-b-full" />
                      )}
                      <Icon className="w-5 h-5" />
                      <span className="text-[10px]">{tab.label}</span>
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setPlusSheetOpen((v) => !v)}
                  className={`flex flex-col items-center justify-center h-full gap-0.5 cursor-pointer ${
                    plusSheetOpen ? 'text-[#005CBD] font-bold' : 'text-[#5B6B82]'
                  }`}
                >
                  <MoreHorizontal className="w-5 h-5" />
                  <span className="text-[10px]">Plus</span>
                </button>
              </nav>
            )}

            {/* Indicateur d'accueil iOS */}
            {platform === 'ios' && (
              <div className="h-4 bg-white flex items-center justify-center shrink-0">
                <div className="w-28 h-1 rounded-full bg-slate-300" />
              </div>
            )}
          </div>
        </div>

        {/* COLONNE DROITE : Architecture iOS/Android & Navigateur des 16 Écrans */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-6">
          {/* Synthèse Architecture Recommandée */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[#005CBD]">
                Architecture Mobile Générée · iOS & Android
              </p>
              <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight text-balance">
                Projet structuré en React Native + Expo SDK 52 (TypeScript)
              </h1>
              <p className="text-sm text-[#43474F] leading-relaxed">
                Pour rendre <strong>DepotManager Mobile</strong> compatible nativement sur{' '}
                <strong>iOS (iPhone / iPad)</strong> et <strong>Android (Smartphones & Tablettes de caisse)</strong>{' '}
                avec mode hors-ligne SQLite, impression thermique Bluetooth ESC/POS et scan EAN-13,
                le dossier complet <code className="font-mono text-xs bg-[#EFF4FF] px-1.5 py-0.5 rounded text-[#00254B]">/depot-manager-mobile/</code>{' '}
                a été construit et prêt à compiler.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onInspectMobileFile(currentScreenMeta.mobileFile)}
                className="px-4 py-2.5 rounded-xl bg-[#00254B] hover:bg-[#173B67] text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>Inspecter {currentScreenMeta.mobileFile}</span>
              </button>
              <button
                type="button"
                onClick={onDownloadZip}
                className="px-4 py-2.5 rounded-xl bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#00254B] text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <FolderOpen className="w-4 h-4 text-[#005CBD]" />
                <span>Télécharger depot-manager-mobile.zip</span>
              </button>
            </div>
          </section>

          {/* Fiche Technique de l'Écran Actif */}
          <section className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[#43474F]">{currentScreenMeta.group}</p>
                <h2 className="text-base font-bold text-[#0B1C30] mt-0.5">
                  Écran actif : {currentScreenMeta.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onInspectMobileFile(currentScreenMeta.mobileFile)}
                className="text-xs font-mono font-semibold text-[#005CBD] hover:underline shrink-0 cursor-pointer"
              >
                {currentScreenMeta.mobileFile} →
              </button>
            </div>
            <p className="text-xs text-[#43474F] leading-relaxed">
              {currentScreenMeta.summary}
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-[#43474F]">
              <span className="font-semibold text-[#0B1C30]">Modules natifs iOS/Android : </span>
              <span>{currentScreenMeta.nativeModules.join(' · ')}</span>
            </div>
          </section>

          {/* Grille de navigation directe vers les 16 écrans */}
          <section className="bg-white rounded-2xl p-5 border border-slate-200 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0B1C30]">
                  Parcourir tous les écrans du projet (16 vues)
                </h2>
                <p className="text-xs text-[#43474F]">
                  Cliquez sur n’importe quel écran pour le tester en direct dans le simulateur iOS/Android.
                </p>
              </div>
              <Smartphone className="w-5 h-5 text-[#005CBD] shrink-0" />
            </div>

            <div className="space-y-4">
              {Object.entries(groupedScreens).map(([groupName, screens]) => (
                <div key={groupName} className="space-y-2">
                  <h3 className="text-xs font-bold text-[#43474F]">{groupName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {screens.map((scr) => {
                      const isCurrent = scr.id === activeScreen;
                      return (
                        <button
                          key={scr.id}
                          type="button"
                          onClick={() => {
                            if (scr.id === 'product-form') setEditingNewProduct(false);
                            setActiveScreen(scr.id);
                          }}
                          className={`p-3 rounded-xl text-left border transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-[#00254B] border-[#00254B] text-white'
                              : 'bg-[#F8F9FF] border-slate-200/80 hover:bg-[#EFF4FF] text-[#0B1C30]'
                          }`}
                        >
                          <p className="text-xs font-bold truncate">{scr.title}</p>
                          <p
                            className={`text-[11px] font-mono truncate mt-0.5 ${
                              isCurrent ? 'text-[#D7E2FF]' : 'text-[#737780]'
                            }`}
                          >
                            {scr.mobileFile}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
