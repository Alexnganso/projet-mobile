import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  QrCode,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';
import {
  BeverageCategory,
  CartEntry,
  ClientAccount,
  MobileScreenId,
  PaymentChannel,
  ProductItem,
} from '../types/depot';
import { formatFcfa, formatNumberFr } from '../data/initialDepotData';
import { BeverageThumb } from './BeverageArtwork';

export function PosTerminalView({
  products,
  clients,
  selectedClientId,
  onSelectClient,
  cart,
  onStepCart,
  onNavigate,
}: {
  products: ProductItem[];
  clients: ClientAccount[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  cart: Record<string, CartEntry>;
  onStepCart: (productId: string, delta: number) => { ok: boolean; message?: string };
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'tous' | BeverageCategory>('tous');
  const [clientDrawerOpen, setClientDrawerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [quickModalOpen, setQuickModalOpen] = useState(false);

  const selectedClient = clients.find((c) => c.id === selectedClientId) ?? clients[0];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const visibleProducts = products.filter((p) => {
    if (!p.activeInPos) return false;
    if (catFilter !== 'tous' && p.category !== catFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.categoryLabel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const cartTotals = Object.values(cart).reduce(
    (acc, entry) => {
      const prod = products.find((p) => p.id === entry.productId);
      if (!prod) return acc;
      return {
        crates: acc.crates + entry.quantityCrates,
        amount: acc.amount + entry.quantityCrates * prod.salePriceFcfa,
      };
    },
    { crates: 0, amount: 0 }
  );

  const handleBarcodeScanSim = () => {
    const castel = products.find((p) => p.id === 'prd-castel-65' && p.activeInPos);
    if (castel) {
      const res = onStepCart(castel.id, 1);
      if (res.ok) {
        triggerToast(`EAN ${castel.barcode} scanné : +1 casier ${castel.name}`);
      } else if (res.message) {
        triggerToast(res.message);
      }
    }
  };

  return (
    <div className="p-4 pb-36 space-y-3 relative">
      {toastMsg && (
        <div className="sticky top-2 z-30 bg-[#00254B] text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-md flex items-center justify-between">
          <span>{toastMsg}</span>
          <button type="button" onClick={() => setToastMsg(null)} className="cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Client Facturé */}
      <div className="bg-[#EFF4FF] rounded-xl p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#43474F]">Client Facturé</p>
            <p className="text-sm font-bold text-[#0B1C30] truncate">{selectedClient.name}</p>
            <p className="text-[11px] text-[#43474F] truncate">{selectedClient.tierLabel}</p>
          </div>
          <button
            type="button"
            onClick={() => setClientDrawerOpen((v) => !v)}
            className="h-9 px-3 rounded-lg bg-white text-[#005CBD] text-xs font-semibold flex items-center gap-1 shrink-0 border border-slate-200/80 cursor-pointer"
          >
            <span>Changer</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>

        {clientDrawerOpen && (
          <div className="pt-2 border-t border-slate-200/70 space-y-1.5">
            {clients.map((clt) => {
              const active = clt.id === selectedClient.id;
              return (
                <button
                  key={clt.id}
                  type="button"
                  onClick={() => {
                    onSelectClient(clt.id);
                    setClientDrawerOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between text-xs cursor-pointer ${
                    active ? 'bg-white border border-[#005CBD]' : 'bg-white/70 hover:bg-white'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-[#0B1C30] truncate">{clt.name}</p>
                    <p className="text-[11px] text-[#43474F] truncate">
                      {clt.district} · {clt.phone}
                    </p>
                  </div>
                  {active && <Check className="w-4 h-4 text-[#005CBD] shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Barre Recherche + Scan EAN-13 */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#737780] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Castel, Beaufort, Tangui, EAN..."
            className="w-full h-11 pl-9 pr-8 rounded-xl bg-white border border-slate-200/80 text-xs text-[#0B1C30] focus:outline-none focus:ring-2 focus:ring-[#005CBD]"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 text-[#737780] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={handleBarcodeScanSim}
          title="Simuler un scan code-barres EAN-13"
          className="w-11 h-11 rounded-xl bg-[#173B67] text-white flex items-center justify-center shrink-0 hover:bg-[#00254B] transition-colors cursor-pointer"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      {/* Filtres Catégorie */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {(
          [
            { id: 'tous', label: `Tous (${products.filter((p) => p.activeInPos).length})` },
            { id: 'bieres', label: 'Bières' },
            { id: 'gazeuses', label: 'Gazeuses' },
            { id: 'eaux', label: 'Eaux' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCatFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              catFilter === tab.id
                ? 'bg-[#00254B] text-white'
                : 'bg-[#EFF4FF] text-[#0B1C30] hover:bg-[#E6EEFF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Liste Produits Caisse */}
      <div className="space-y-2.5">
        {visibleProducts.map((prod) => {
          const qty = cart[prod.id]?.quantityCrates ?? 0;
          const outOfStock = prod.stockCrates === 0;
          const lowStock = prod.stockCrates > 0 && prod.stockCrates <= prod.minAlertCrates;

          return (
            <div
              key={prod.id}
              className={`bg-white rounded-xl p-3 border border-slate-200/80 space-y-2.5 ${
                outOfStock ? 'opacity-65' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <BeverageThumb artworkKey={prod.artworkKey} outOfStock={outOfStock} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3
                      className={`text-sm font-bold truncate ${
                        outOfStock ? 'line-through text-[#737780]' : 'text-[#0B1C30]'
                      }`}
                    >
                      {prod.name}
                    </h3>
                    <span
                      className={`text-[11px] font-semibold shrink-0 tabular-nums ${
                        outOfStock || lowStock ? 'text-[#BA1A1A]' : 'text-[#43474F]'
                      }`}
                    >
                      {outOfStock ? 'Rupture' : `${prod.stockCrates} dispo`}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#43474F] truncate">
                    {prod.bottlesPerCrate} btles ·{' '}
                    {prod.packagingType === 'consigne' ? 'Consigné' : 'Sans consigne'}
                  </p>
                  <p className="text-sm font-bold text-[#00254B] tabular-nums mt-1">
                    {formatFcfa(prod.salePriceFcfa)}{' '}
                    <span className="text-[11px] font-normal text-[#737780]">/ casier</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span
                  className={`text-[11px] font-medium ${
                    outOfStock || lowStock ? 'text-[#BA1A1A]' : 'text-[#43474F]'
                  }`}
                >
                  {outOfStock
                    ? '0 casier physique en rayon'
                    : lowStock
                    ? `Stock critique (Seuil ${prod.minAlertCrates})`
                    : 'Disponible au quai'}
                </span>

                {outOfStock ? (
                  <button
                    type="button"
                    disabled
                    className="h-10 px-3 rounded-lg bg-slate-100 text-[#737780] text-xs font-semibold cursor-not-allowed"
                  >
                    Indisponible
                  </button>
                ) : (
                  <div className="flex items-center bg-[#EFF4FF] rounded-lg h-10 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => onStepCart(prod.id, -1)}
                      className="w-10 h-10 flex items-center justify-center text-[#0B1C30] hover:bg-[#DCE9FF] cursor-pointer"
                      aria-label="Retirer un casier"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-[#00254B] tabular-nums">
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const res = onStepCart(prod.id, 1);
                        if (!res.ok && res.message) triggerToast(res.message);
                      }}
                      className="w-10 h-10 flex items-center justify-center text-[#00254B] hover:bg-[#DCE9FF] cursor-pointer"
                      aria-label="Ajouter un casier"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Barre Panier Flottante */}
      <div className="fixed bottom-16 left-0 right-0 z-20 px-3 pointer-events-none">
        <div className="max-w-[366px] mx-auto pointer-events-auto bg-[#00254B] text-white rounded-2xl p-3 shadow-lg flex items-center justify-between gap-2">
          {cartTotals.crates > 0 ? (
            <>
              <div className="min-w-0">
                <p className="text-[11px] text-[#D7E2FF] tabular-nums">
                  {cartTotals.crates} casier{cartTotals.crates > 1 ? 's' : ''} · Total net
                </p>
                <p className="text-lg font-bold tabular-nums leading-tight">
                  {formatFcfa(cartTotals.amount)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setQuickModalOpen(true)}
                  className="h-10 px-2.5 rounded-xl bg-white/10 text-xs font-semibold hover:bg-white/20 cursor-pointer"
                >
                  Aperçu
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('payment')}
                  className="h-10 px-3.5 rounded-xl bg-[#005CBD] hover:bg-[#488FFD] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Encaisser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between py-0.5 text-xs text-[#D7E2FF]">
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Panier vide · Ajoutez un casier
              </span>
              <span className="font-mono">0 FCFA</span>
            </div>
          )}
        </div>
      </div>

      {/* Mini Modal Récapitulatif Rapide */}
      {quickModalOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B1C30]/50 backdrop-blur-xs flex items-end justify-center p-3">
          <div className="w-full max-w-[366px] bg-white rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#0B1C30]">Récapitulatif Panier</h4>
                <p className="text-xs text-[#43474F]">{selectedClient.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#EFF4FF] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-[#EFF4FF] rounded-xl p-3 space-y-1.5 text-xs">
              {Object.values(cart).map((c) => {
                const p = products.find((item) => item.id === c.productId);
                if (!p) return null;
                return (
                  <div key={c.productId} className="flex justify-between tabular-nums">
                    <span className="text-[#0B1C30] font-medium">
                      {c.quantityCrates} × {p.name}
                    </span>
                    <span className="font-bold text-[#00254B]">
                      {formatFcfa(c.quantityCrates * p.salePriceFcfa)}
                    </span>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                setQuickModalOpen(false);
                onNavigate('payment');
              }}
              className="w-full h-11 rounded-xl bg-[#173B67] text-white text-xs font-bold cursor-pointer"
            >
              Choisir le mode de règlement ({formatFcfa(cartTotals.amount)})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PaymentCheckoutView({
  products,
  clients,
  selectedClientId,
  onSelectClient,
  cart,
  onConfirmPayment,
  onNavigate,
}: {
  products: ProductItem[];
  clients: ClientAccount[];
  selectedClientId: string;
  onSelectClient: (id: string) => void;
  cart: Record<string, CartEntry>;
  onConfirmPayment: (params: {
    mode: 'cash' | 'credit';
    channel: PaymentChannel;
    amountReceivedFcfa: number;
    unreturnedCratesTotal: number;
    dueDateLabel?: string;
  }) => void;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [mode, setMode] = useState<'cash' | 'credit'>('cash');
  const [channel, setChannel] = useState<'cash' | 'om' | 'momo'>('cash');
  const [unreturnedCrates, setUnreturnedCrates] = useState(0);
  const [dueDatePreset, setDueDatePreset] = useState('48h (28 Oct)');

  const cartSummary = Object.values(cart).reduce(
    (acc, entry) => {
      const p = products.find((prod) => prod.id === entry.productId);
      if (!p) return acc;
      return {
        crates: acc.crates + entry.quantityCrates,
        consignableCrates:
          acc.consignableCrates + (p.packagingType === 'consigne' ? entry.quantityCrates : 0),
        beveragesTotal: acc.beveragesTotal + entry.quantityCrates * p.salePriceFcfa,
      };
    },
    { crates: 0, consignableCrates: 0, beveragesTotal: 0 }
  );

  const depositExtra = unreturnedCrates * 3000;
  const netDue = (cartSummary.beveragesTotal || 29400) + depositExtra;

  const [cashInput, setCashInput] = useState<string>(
    String(Math.ceil(netDue / 5000) * 5000 || 30000)
  );
  const [momoPhone, setMomoPhone] = useState('699 45 82 10');

  const currentClient = clients.find((c) => c.id === selectedClientId) ?? clients[0];
  const creditClient = currentClient.isAnonymousCounter
    ? clients.find((c) => c.id === 'clt-balafon') ?? clients[1]
    : currentClient;

  const receivedNum = Number(cashInput) || 0;
  const changeDiff = receivedNum - netDue;
  const newCreditTotal = creditClient.creditBalanceFcfa + netDue;
  const creditUsagePct = Math.min(
    100,
    Math.round((newCreditTotal / Math.max(1, creditClient.creditLimitFcfa)) * 100)
  );

  return (
    <div className="p-4 pb-10 space-y-3.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate('pos')}
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0B1C30] cursor-pointer"
          aria-label="Retour au panier"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-bold text-[#0B1C30] truncate">
          Règlement & Mode de Paiement
        </h2>
      </div>

      {/* Récapitulatif Montant Net */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#43474F]">
          <span className="font-semibold">Montant Net à Régler</span>
          <span className="tabular-nums font-semibold text-[#00254B]">
            {cartSummary.crates || 4} casiers pleins
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-bold text-[#0B1C30] tabular-nums">{formatFcfa(netDue)}</p>
          <span className="text-xs text-[#16A34A] font-semibold">
            {unreturnedCrates === 0
              ? 'Échange casiers 1 pour 1'
              : `+${formatFcfa(depositExtra)} caution`}
          </span>
        </div>

        {/* Option Casiers non rendus */}
        {cartSummary.consignableCrates > 0 && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[#43474F]">Casiers vides non rendus :</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUnreturnedCrates((v) => Math.max(0, v - 1))}
                className="w-7 h-7 rounded bg-[#EFF4FF] font-bold text-[#00254B] cursor-pointer"
              >
                -
              </button>
              <span className="font-bold tabular-nums w-5 text-center">{unreturnedCrates}</span>
              <button
                type="button"
                onClick={() =>
                  setUnreturnedCrates((v) => Math.min(cartSummary.consignableCrates, v + 1))
                }
                className="w-7 h-7 rounded bg-[#EFF4FF] font-bold text-[#00254B] cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sélecteur Binaire Comptant vs Crédit */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#E6EEFF] rounded-xl">
        <button
          type="button"
          onClick={() => setMode('cash')}
          className={`py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            mode === 'cash' ? 'bg-[#00254B] text-white shadow-xs' : 'text-[#00254B]'
          }`}
        >
          Comptant (Payé)
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('credit');
            if (currentClient.isAnonymousCounter) {
              onSelectClient(creditClient.id);
            }
          }}
          className={`py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            mode === 'credit' ? 'bg-[#00254B] text-white shadow-xs' : 'text-[#00254B]'
          }`}
        >
          À Crédit (Terme)
        </button>
      </div>

      {mode === 'cash' ? (
        <div className="space-y-3">
          {/* 3 Canaux d'encaissement */}
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'cash', title: 'Espèces', sub: 'Guichet' },
                { id: 'om', title: 'OM', sub: '#150*50#' },
                { id: 'momo', title: 'MoMo', sub: '*126#' },
              ] as const
            ).map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setChannel(ch.id);
                  if (ch.id === 'om') setMomoPhone('699 45 82 10');
                  if (ch.id === 'momo') setMomoPhone('677 34 19 88');
                }}
                className={`p-3 rounded-xl text-center border transition-colors cursor-pointer ${
                  channel === ch.id
                    ? 'bg-[#D7E2FF] border-[#005CBD] text-[#001B3F]'
                    : 'bg-white border-slate-200/80 text-[#0B1C30]'
                }`}
              >
                <p className="text-xs font-bold">{ch.title}</p>
                <p className="text-[11px] opacity-75 font-mono mt-0.5">{ch.sub}</p>
              </button>
            ))}
          </div>

          {channel === 'cash' ? (
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-[#43474F]">Montant Reçu en Caisse</label>
                <span className="font-bold text-[#00254B] tabular-nums">
                  Facture : {formatFcfa(netDue)}
                </span>
              </div>

              <div className="relative flex items-center">
                <input
                  type="number"
                  value={cashInput}
                  onChange={(e) => setCashInput(e.target.value)}
                  className="w-full h-11 px-3.5 pr-14 rounded-lg bg-[#EFF4FF] text-base font-bold text-[#0B1C30] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#005CBD]"
                />
                <span className="absolute right-3 text-xs font-semibold text-[#43474F]">FCFA</span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {[netDue, 30000, 35000, 50000].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCashInput(String(preset))}
                    className="px-2.5 py-1 rounded-md bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[11px] font-semibold text-[#0B1C30] whitespace-nowrap tabular-nums cursor-pointer"
                  >
                    {idx === 0 ? 'Compte exact' : `${formatNumberFr(preset)} F`}
                  </button>
                ))}
              </div>

              <div className="bg-[#DCE9FF]/70 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-[#43474F]">Monnaie à rendre</p>
                  <p
                    className={`text-base font-bold tabular-nums ${
                      changeDiff >= 0 ? 'text-[#0B1C30]' : 'text-[#BA1A1A]'
                    }`}
                  >
                    {changeDiff >= 0
                      ? `+${formatFcfa(changeDiff)}`
                      : `Manque ${formatFcfa(Math.abs(changeDiff))}`}
                  </p>
                </div>
                <span
                  className={`text-[11px] font-bold ${
                    changeDiff >= 0 ? 'text-[#16A34A]' : 'text-[#BA1A1A]'
                  }`}
                >
                  {changeDiff >= 0 ? 'Prêt à solder' : 'Insuffisant'}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2.5">
              <p className="text-sm font-bold text-[#0B1C30]">
                {channel === 'om' ? 'Orange Money Cameroun' : 'MTN Mobile Money Cameroun'}
              </p>
              <label className="text-[11px] font-semibold text-[#43474F] block">
                Numéro payeur (+237)
              </label>
              <input
                type="tel"
                value={momoPhone}
                onChange={(e) => setMomoPhone(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-[#EFF4FF] text-sm font-mono font-semibold text-[#0B1C30]"
              />
              <p className="text-[11px] text-[#43474F]">
                Une notification push USSD sera envoyée au client pour confirmation PIN.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#0B1C30]">{creditClient.name}</h4>
              <p className="text-[11px] text-[#43474F]">
                {creditClient.district} · {creditClient.code}
              </p>
            </div>
            <select
              value={creditClient.id}
              onChange={(e) => onSelectClient(e.target.value)}
              className="text-xs bg-[#EFF4FF] text-[#005CBD] font-semibold rounded-lg px-2 py-1.5 outline-none"
            >
              {clients
                .filter((c) => !c.isAnonymousCounter)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="bg-[#EFF4FF] rounded-xl p-3 space-y-1.5 text-xs tabular-nums">
            <div className="flex justify-between text-[#43474F]">
              <span>Ancien solde débiteur :</span>
              <span className="font-semibold text-[#0B1C30]">
                {formatFcfa(creditClient.creditBalanceFcfa)}
              </span>
            </div>
            <div className="flex justify-between text-[#BA1A1A] font-medium">
              <span>+ Nouvelle commande :</span>
              <span className="font-bold">+{formatFcfa(netDue)}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-[#0B1C30]">Nouveau Total Dû :</span>
              <span className="text-base font-bold text-[#BA1A1A]">
                {formatFcfa(newCreditTotal)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[11px] tabular-nums">
              <span className="text-[#43474F]">
                Plafond ({formatNumberFr(creditClient.creditLimitFcfa)} F)
              </span>
              <span className="font-bold text-[#16A34A]">{creditUsagePct}% utilisé</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E6EEFF] overflow-hidden">
              <div
                className="h-full bg-[#005CBD] rounded-full"
                style={{ width: `${creditUsagePct}%` }}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <p className="text-xs font-semibold text-[#43474F]">Échéance convenue de règlement</p>
            <div className="grid grid-cols-3 gap-1.5">
              {['48h (28 Oct)', '7 Jours', '15 Jours'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDueDatePreset(d)}
                  className={`py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                    dueDatePreset === d
                      ? 'bg-[#00254B] text-white'
                      : 'bg-[#EFF4FF] text-[#0B1C30]'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        disabled={mode === 'cash' && channel === 'cash' && changeDiff < 0}
        onClick={() =>
          onConfirmPayment({
            mode,
            channel: mode === 'credit' ? 'credit' : channel,
            amountReceivedFcfa: mode === 'credit' ? 0 : channel === 'cash' ? receivedNum : netDue,
            unreturnedCratesTotal: unreturnedCrates,
            dueDateLabel: mode === 'credit' ? dueDatePreset : undefined,
          })
        }
        className={`w-full min-h-[50px] rounded-xl text-white font-semibold text-xs px-4 flex items-center justify-center gap-2 shadow-sm transition-opacity cursor-pointer disabled:opacity-45 ${
          mode === 'cash' ? 'bg-[#16A34A] hover:bg-[#15803D]' : 'bg-[#173B67] hover:bg-[#00254B]'
        }`}
      >
        <Check className="w-4 h-4 shrink-0" />
        <span>
          {mode === 'cash'
            ? `Valider le Paiement & Émettre Reçu (${formatFcfa(netDue)})`
            : `Enregistrer la Vente à Crédit (${formatFcfa(newCreditTotal)} dus)`}
        </span>
      </button>

      <div className="bg-[#EFF4FF] rounded-xl p-3 text-[11px] text-[#43474F] leading-relaxed">
        <strong className="text-[#0B1C30]">Sauvegarde locale SQLite active :</strong> En cas de
        coupure réseau, la vente est stockée localement sur le téléphone et synchronisée avec le
        serveur Akwa dès reconnexion.
      </div>
    </div>
  );
}
