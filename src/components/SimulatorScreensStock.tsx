import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Edit3,
  Heart,
  Lock,
  Plus,
  QrCode,
  Search,
  ShieldAlert,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  BeverageCategory,
  MobileScreenId,
  OperatorRole,
  ProductItem,
} from '../types/depot';
import { formatFcfa, formatNumberFr } from '../data/initialDepotData';
import { BeverageThumb } from './BeverageArtwork';

export function StockCatalogView({
  products,
  roleView,
  onChangeRoleView,
  onOpenProductDetail,
  onOpenNewProduct,
  onSellProduct,
  onRestockProduct,
  onNavigate,
}: {
  products: ProductItem[];
  roleView: OperatorRole;
  onChangeRoleView: (role: OperatorRole) => void;
  onOpenProductDetail: (productId: string) => void;
  onOpenNewProduct: () => void;
  onSellProduct: (productId: string) => void;
  onRestockProduct: (productId: string, crates: number) => void;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<'tous' | BeverageCategory>('tous');
  const [stockFilter, setStockFilter] = useState<'all' | 'available' | 'alerts'>('all');

  const alertCount = products.filter((p) => p.stockCrates <= p.minAlertCrates).length;

  const filtered = products.filter((p) => {
    if (category !== 'tous' && p.category !== category) return false;
    if (stockFilter === 'available' && p.stockCrates === 0) return false;
    if (stockFilter === 'alerts' && p.stockCrates > p.minAlertCrates) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 pb-32 space-y-3.5 relative">
      {/* En-tête & Sélecteur Rôle RBAC */}
      <div className="bg-[#EFF4FF] rounded-xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-[#43474F]">Vue d’accès RBAC</span>
          <div className="inline-flex p-0.5 rounded-lg bg-[#E6EEFF]">
            <button
              type="button"
              onClick={() => onChangeRoleView('admin')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                roleView === 'admin' ? 'bg-[#00254B] text-white' : 'text-[#43474F]'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => onChangeRoleView('cashier')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                roleView !== 'admin' ? 'bg-[#00254B] text-white' : 'text-[#43474F]'
              }`}
            >
              Vendeur
            </button>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#0B1C30]">Catalogue Produits</h2>
            <p className="text-xs text-[#43474F] tabular-nums">
              {products.length} références ·{' '}
              <span className="text-[#BA1A1A] font-semibold">{alertCount} en alerte</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenNewProduct}
            className="px-3 py-2 rounded-lg bg-[#173B67] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau</span>
          </button>
        </div>
      </div>

      {/* Recherche */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-[#737780] absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Bière, casier, code-barres..."
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
          onClick={() => setSearch('6151100')}
          title="Filtrer codes EAN Cameroun"
          className="w-11 h-11 rounded-xl bg-white border border-slate-200/80 text-[#005CBD] flex items-center justify-center shrink-0 cursor-pointer"
        >
          <QrCode className="w-5 h-5" />
        </button>
      </div>

      {/* Catégories */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'tous', label: 'Tous' },
            { id: 'bieres', label: 'Bières' },
            { id: 'gazeuses', label: 'Gazeuses' },
            { id: 'eaux', label: 'Eaux Minérales' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
              category === tab.id
                ? 'bg-[#00254B] text-white'
                : 'bg-white border border-slate-200/80 text-[#43474F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filtre État des Stocks */}
      <div className="flex items-center justify-between text-xs px-0.5">
        <span className="text-[#43474F] font-semibold">État des stocks :</span>
        <div className="flex items-center gap-1">
          {(
            [
              { id: 'all', label: 'Tous' },
              { id: 'available', label: 'Disponibles' },
              { id: 'alerts', label: `Alertes (${alertCount})` },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStockFilter(st.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer ${
                stockFilter === st.id
                  ? 'bg-[#DCE9FF] text-[#0B1C30]'
                  : st.id === 'alerts'
                  ? 'text-[#BA1A1A]'
                  : 'text-[#43474F]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes Produits */}
      <div className="space-y-3">
        {filtered.map((prod) => {
          const outOfStock = prod.stockCrates === 0;
          const critical = prod.stockCrates > 0 && prod.stockCrates <= prod.minAlertCrates;
          const margin = prod.salePriceFcfa - prod.purchasePriceFcfa;
          const marginPct = ((margin / prod.salePriceFcfa) * 100).toFixed(1);

          return (
            <div
              key={prod.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2.5"
            >
              <div className="flex items-start gap-3">
                <BeverageThumb artworkKey={prod.artworkKey} outOfStock={outOfStock} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-[#43474F]">
                    {prod.categoryLabel} ·{' '}
                    <span
                      className={`font-semibold ${
                        !prod.activeInPos
                          ? 'text-[#737780]'
                          : outOfStock || critical
                          ? 'text-[#BA1A1A]'
                          : 'text-[#16A34A]'
                      }`}
                    >
                      {!prod.activeInPos
                        ? 'Désactivé caisse'
                        : outOfStock
                        ? 'Rupture de stock'
                        : critical
                        ? `Stock critique (${prod.stockCrates}/${prod.minAlertCrates})`
                        : 'En stock'}
                    </span>
                  </p>
                  <h3 className="text-sm font-bold text-[#0B1C30] truncate mt-0.5">{prod.name}</h3>
                  <p className="text-[11px] text-[#43474F] truncate">
                    Casier {prod.bottlesPerCrate} btles ·{' '}
                    {prod.packagingType === 'consigne'
                      ? `Consigné (${formatFcfa(prod.crateDepositFcfa)})`
                      : 'Emballage perdu'}
                  </p>
                </div>
              </div>

              {/* Métriques Stock */}
              <div
                className={`grid grid-cols-2 gap-2 rounded-lg p-2.5 text-xs tabular-nums ${
                  outOfStock || critical ? 'bg-[#FFDAD6]/40' : 'bg-[#EFF4FF]/70'
                }`}
              >
                <div>
                  <span className="text-[10px] font-semibold text-[#43474F] block">Disponible</span>
                  <span
                    className={`text-sm font-bold ${
                      outOfStock || critical ? 'text-[#BA1A1A]' : 'text-[#0B1C30]'
                    }`}
                  >
                    {prod.stockCrates} casiers
                  </span>
                  <span className="text-[10px] text-[#43474F] ml-1">
                    ({prod.stockCrates * prod.bottlesPerCrate} btles)
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#43474F] block">
                    Seuil alerte
                  </span>
                  <span className="text-xs font-semibold text-[#0B1C30]">
                    Min. {prod.minAlertCrates} casiers
                  </span>
                </div>
              </div>

              {/* Tarification & Marge RBAC */}
              <div className="space-y-1.5 tabular-nums">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#43474F]">Prix Vente</span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-[#0B1C30]">
                      {formatFcfa(prod.salePriceFcfa)}
                    </span>
                    <span className="text-[11px] text-[#43474F] ml-1.5">
                      ({prod.unitBottlePriceFcfa} F/btle)
                    </span>
                  </div>
                </div>

                {roleView === 'admin' && (
                  <div className="bg-[#EFF4FF] px-2.5 py-1.5 rounded-md flex items-center justify-between text-[11px]">
                    <span className="text-[#43474F]">
                      Achat : <strong className="text-[#0B1C30]">{formatFcfa(prod.purchasePriceFcfa)}</strong>
                    </span>
                    <span className="font-bold text-[#16A34A]">
                      Marge : +{formatNumberFr(margin)} F ({marginPct}%)
                    </span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-0.5">
                {(outOfStock || critical) && (
                  <button
                    type="button"
                    onClick={() => onRestockProduct(prod.id, 20)}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FFDAD6] text-[#93000A] text-xs font-bold cursor-pointer"
                  >
                    +20 Réappro
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenProductDetail(prod.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#EFF4FF] text-[#0B1C30] text-xs font-semibold cursor-pointer"
                >
                  Fiche
                </button>
                <button
                  type="button"
                  disabled={outOfStock || !prod.activeInPos}
                  onClick={() => onSellProduct(prod.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#173B67] text-white text-xs font-bold flex items-center gap-1 disabled:opacity-45 cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Vendre</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bandeau rapide Passer en caisse */}
      <div className="fixed bottom-16 left-0 right-0 z-20 px-3 pointer-events-none">
        <div className="max-w-[366px] mx-auto pointer-events-auto bg-[#00254B] text-white rounded-2xl p-2.5 shadow-lg flex items-center justify-between">
          <span className="text-xs font-semibold pl-2">Terminal de caisse actif</span>
          <button
            type="button"
            onClick={() => onNavigate('pos')}
            className="px-3.5 py-1.5 rounded-xl bg-[#005CBD] text-xs font-bold cursor-pointer"
          >
            Passer en caisse →
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailView({
  product,
  roleView,
  onChangeRoleView,
  onToggleFavorite,
  onRestock,
  onSellProduct,
  onNavigate,
}: {
  product: ProductItem;
  roleView: OperatorRole;
  onChangeRoleView: (role: OperatorRole) => void;
  onToggleFavorite: (productId: string) => void;
  onRestock: (productId: string, delta: number) => void;
  onSellProduct: (productId: string) => void;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const margin = product.salePriceFcfa - product.purchasePriceFcfa;
  const marginPct = ((margin / product.salePriceFcfa) * 100).toFixed(1);
  const stockPct = Math.min(
    100,
    Math.round((product.stockCrates / Math.max(1, product.maxDockCrates)) * 100)
  );

  return (
    <div className="p-4 pb-10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('stock-catalog')}
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0B1C30] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-[#0B1C30]">Détail Produit</h2>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('product-form')}
          className="px-3 py-1.5 rounded-lg bg-[#00254B] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Modifier</span>
        </button>
      </div>

      {/* Hero Visuel */}
      <div className="rounded-xl overflow-hidden bg-white border border-slate-200/80">
        <div className="relative">
          <BeverageThumb
            artworkKey={product.artworkKey}
            size="hero"
            outOfStock={product.stockCrates === 0}
          />
          <button
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 flex items-center justify-center text-[#0B1C30] cursor-pointer"
            aria-label="Favori"
          >
            <Heart
              className={`w-4 h-4 ${
                product.favorite ? 'fill-[#BA1A1A] text-[#BA1A1A]' : 'text-[#0B1C30]'
              }`}
            />
          </button>
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-[11px] text-[#D7E2FF]">
              {product.categoryLabel} · {product.brewer}
            </p>
            <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
          </div>
        </div>
        <div className="p-3 flex items-center justify-between text-xs text-[#43474F] font-mono">
          <span className="font-semibold text-[#0B1C30]">{product.sku}</span>
          <span>EAN {product.barcode}</span>
        </div>
      </div>

      {/* Simulateur Permission Marges */}
      <div className="bg-[#EFF4FF] rounded-xl p-3 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#0B1C30]">Mode d’affichage des marges</span>
          <span className="text-[#43474F]">RBAC</span>
        </div>
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#E6EEFF] rounded-lg">
          <button
            type="button"
            onClick={() => onChangeRoleView('admin')}
            className={`py-1.5 rounded text-xs font-semibold cursor-pointer ${
              roleView === 'admin' ? 'bg-[#00254B] text-white' : 'text-[#43474F]'
            }`}
          >
            Gérant / Admin
          </button>
          <button
            type="button"
            onClick={() => onChangeRoleView('cashier')}
            className={`py-1.5 rounded text-xs font-semibold cursor-pointer ${
              roleView !== 'admin' ? 'bg-[#00254B] text-white' : 'text-[#43474F]'
            }`}
          >
            Vendeur / Caisse
          </button>
        </div>
      </div>

      {/* Tarification */}
      <div className="grid grid-cols-2 gap-2.5 tabular-nums">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80">
          <p className="text-[11px] font-semibold text-[#43474F]">Vente Casier</p>
          <p className="text-lg font-bold text-[#0B1C30] mt-1">
            {formatFcfa(product.salePriceFcfa)}
          </p>
          <p className="text-[11px] text-[#737780]">{product.unitBottlePriceFcfa} FCFA / btle</p>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80">
          <p className="text-[11px] font-semibold text-[#43474F]">Caution Casier</p>
          <p className="text-lg font-bold text-[#0B1C30] mt-1">
            {formatFcfa(product.crateDepositFcfa)}
          </p>
          <p className="text-[11px] text-[#737780]">{product.bottlesPerCrate} alvéoles</p>
        </div>
      </div>

      {/* Rentabilité Dépôt */}
      <div className="bg-[#DCE9FF]/60 rounded-xl p-4 space-y-2.5 tabular-nums">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#00254B] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Données Rentabilité Dépôt
          </span>
          <span className="font-semibold text-[#00254B]">Strict Gérant</span>
        </div>

        {roleView === 'admin' ? (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#43474F]">Prix d’achat usine</span>
              <span className="font-bold text-[#0B1C30]">
                {formatFcfa(product.purchasePriceFcfa)} / casier
              </span>
            </div>
            <div className="bg-white rounded-lg p-2.5 flex justify-between items-center">
              <div>
                <p className="font-bold text-[#0B1C30]">Marge Brute / Casier</p>
                <p className="text-[11px] text-[#16A34A] font-semibold">+{marginPct}% rentabilité</p>
              </div>
              <span className="text-sm font-bold text-[#16A34A]">+{formatFcfa(margin)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474F]">Marge cumulée stock en quai</span>
              <span className="font-bold text-[#00254B]">
                +{formatFcfa(margin * product.stockCrates)}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-3 text-center space-y-1">
            <p className="text-xs font-bold text-[#0B1C30]">Informations Financières Verrouillées</p>
            <p className="text-[11px] text-[#43474F]">
              Le prix d’achat et la marge nette sont masqués pour le personnel de caisse.
            </p>
          </div>
        )}
      </div>

      {/* Stock Physique & Entrepôt */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 tabular-nums">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#43474F]">Disponible immédiat</p>
            <p className="text-2xl font-bold text-[#0B1C30] mt-0.5">
              {product.stockCrates} <span className="text-sm font-medium">casiers</span>
            </p>
            <p className="text-[11px] text-[#737780]">
              Soit {formatNumberFr(product.stockCrates * product.bottlesPerCrate)} bouteilles
            </p>
          </div>
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#E6EEFF"
                strokeWidth="3.5"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={stockPct <= 20 ? '#BA1A1A' : '#16A34A'}
                strokeDasharray={`${stockPct}, 100`}
                strokeLinecap="round"
                strokeWidth="3.5"
              />
            </svg>
            <span className="absolute text-xs font-bold text-[#0B1C30]">{stockPct}%</span>
          </div>
        </div>

        <div className="text-xs space-y-1 pt-2 border-t border-slate-100">
          <p className="text-[#0B1C30] font-medium">{product.warehouseLocation}</p>
          <p className="text-[11px] text-[#43474F]">
            Dernier réappro : {product.lastRestockLabel}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          type="button"
          disabled={product.stockCrates === 0 || !product.activeInPos}
          onClick={() => onSellProduct(product.id)}
          className="w-full min-h-[48px] rounded-xl bg-[#00254B] text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-45 cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Vendre cet article (POS)</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onNavigate('product-form')}
            className="h-10 rounded-lg bg-[#DCE9FF] text-[#0B1C30] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Modifier fiche</span>
          </button>
          <button
            type="button"
            onClick={() => onRestock(product.id, 10)}
            className="h-10 rounded-lg bg-[#DCE9FF] text-[#0B1C30] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>+10 Casiers Quai</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('deactivate-sheet')}
          className="w-full py-2.5 rounded-lg text-[#BA1A1A] hover:bg-[#FFDAD6]/40 text-xs font-bold transition-colors cursor-pointer"
        >
          {product.activeInPos
            ? 'Désactiver ou archiver ce produit'
            : 'Gérer la réactivation de ce produit'}
        </button>
      </div>
    </div>
  );
}

export function ProductFormView({
  existingProduct,
  onSaveProduct,
  onNavigate,
}: {
  existingProduct: ProductItem | null;
  onSaveProduct: (product: ProductItem) => void;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [name, setName] = useState(existingProduct?.name ?? '');
  const [category, setCategory] = useState<BeverageCategory>(
    existingProduct?.category ?? 'bieres'
  );
  const [packagingType, setPackagingType] = useState<'consigne' | 'perdu'>(
    existingProduct?.packagingType ?? 'consigne'
  );
  const [bottlesPerCrate, setBottlesPerCrate] = useState(
    existingProduct?.bottlesPerCrate ?? 12
  );
  const [barcode, setBarcode] = useState(existingProduct?.barcode ?? '6151100123456');
  const [buyPrice, setBuyPrice] = useState(
    String(existingProduct?.purchasePriceFcfa ?? 6400)
  );
  const [sellPrice, setSellPrice] = useState(
    String(existingProduct?.salePriceFcfa ?? 7800)
  );
  const [stockCrates, setStockCrates] = useState(
    String(existingProduct?.stockCrates ?? 50)
  );
  const [minAlert, setMinAlert] = useState(
    String(existingProduct?.minAlertCrates ?? 15)
  );
  const [location, setLocation] = useState(
    existingProduct?.warehouseLocation ?? 'Allée B - Travée 04'
  );

  const buyVal = Number(buyPrice) || 0;
  const sellVal = Number(sellPrice) || 0;
  const margin = sellVal - buyVal;
  const marginPct = sellVal > 0 ? ((margin / sellVal) * 100).toFixed(1) : '0.0';
  const validPricing = name.trim().length > 1 && sellVal > buyVal;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validPricing) return;

    const catLabels: Record<BeverageCategory, string> = {
      bieres: 'Bière blonde',
      gazeuses: 'Boisson gazeuse',
      eaux: 'Eau minérale',
      vins: 'Vins & Alcools',
    };

    onSaveProduct({
      id: existingProduct?.id ?? `prd-${Date.now()}`,
      sku: existingProduct?.sku ?? `REF-NEW-${Math.floor(100 + Math.random() * 899)}`,
      barcode,
      name: name.trim(),
      brewer: existingProduct?.brewer ?? 'Brasseries du Cameroun (SABC)',
      category,
      categoryLabel: catLabels[category],
      volumeLabel: existingProduct?.volumeLabel ?? '65 cl',
      packagingType,
      bottlesPerCrate,
      crateDepositFcfa: packagingType === 'consigne' ? 3000 : 0,
      purchasePriceFcfa: buyVal,
      salePriceFcfa: sellVal,
      unitBottlePriceFcfa: Math.round(sellVal / Math.max(1, bottlesPerCrate)),
      stockCrates: Number(stockCrates) || 0,
      minAlertCrates: Number(minAlert) || 10,
      maxDockCrates: existingProduct?.maxDockCrates ?? 100,
      warehouseLocation: location,
      lastRestockLabel: 'Aujourd’hui · Mise à jour fiche',
      cratesOutWithClients: existingProduct?.cratesOutWithClients ?? 0,
      activeInPos: existingProduct?.activeInPos ?? true,
      artworkKey: existingProduct?.artworkKey ?? 'castel',
    });
  };

  return (
    <form onSubmit={handleSave} className="p-4 pb-10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              onNavigate(existingProduct ? 'product-detail' : 'stock-catalog')
            }
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0B1C30] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-[#0B1C30]">
            {existingProduct ? 'Modifier Boisson' : 'Ajouter Boisson'}
          </h2>
        </div>
        <button
          type="submit"
          disabled={!validPricing}
          className="px-3 py-1.5 rounded-lg bg-[#00254B] text-white text-xs font-semibold flex items-center gap-1 disabled:opacity-45 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Enregistrer</span>
        </button>
      </div>

      {/* 1. Identification & Emballage */}
      <section className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3">
        <h3 className="text-sm font-bold text-[#0B1C30]">1. Identification & Emballage</h3>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#0B1C30] block">
            Nom commercial du produit *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Castel Beer 65cl"
            className="w-full h-10 px-3 rounded-lg bg-[#EFF4FF] text-xs font-medium text-[#0B1C30]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#0B1C30] block">Catégorie *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BeverageCategory)}
            className="w-full h-10 px-3 rounded-lg bg-[#EFF4FF] text-xs font-medium text-[#0B1C30]"
          >
            <option value="bieres">Bières & Cidres</option>
            <option value="gazeuses">Boissons Gazeuses</option>
            <option value="eaux">Eaux Minérales</option>
            <option value="vins">Alcools & Vins</option>
          </select>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#0B1C30] block">
            Type de conditionnement *
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPackagingType('consigne')}
              className={`p-2.5 rounded-lg text-left border text-xs cursor-pointer ${
                packagingType === 'consigne'
                  ? 'bg-[#EFF4FF] border-[#005CBD]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <p className="font-bold text-[#0B1C30]">Casier Consigné</p>
              <p className="text-[10px] text-[#43474F]">Caution 3 000 FCFA</p>
            </button>
            <button
              type="button"
              onClick={() => setPackagingType('perdu')}
              className={`p-2.5 rounded-lg text-left border text-xs cursor-pointer ${
                packagingType === 'perdu'
                  ? 'bg-[#EFF4FF] border-[#005CBD]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <p className="font-bold text-[#0B1C30]">Emballage Perdu</p>
              <p className="text-[10px] text-[#43474F]">Pack PET / Carton</p>
            </button>
          </div>

          <div className="flex items-center justify-between bg-[#EFF4FF]/60 p-2 rounded-lg text-xs">
            <span className="text-[#43474F]">Bouteilles par casier / pack :</span>
            <div className="flex items-center gap-2">
              {[6, 12, 20, 24].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setBottlesPerCrate(n)}
                  className={`px-2 py-1 rounded text-xs font-bold cursor-pointer ${
                    bottlesPerCrate === n
                      ? 'bg-[#00254B] text-white'
                      : 'bg-white text-[#0B1C30]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#0B1C30] block">Code-barres EAN-13</label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-[#EFF4FF] text-xs font-mono text-[#0B1C30]"
          />
        </div>
      </section>

      {/* 2. Tarification & Marges */}
      <section className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 tabular-nums">
        <h3 className="text-sm font-bold text-[#0B1C30]">2. Tarification & Marges (FCFA)</h3>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0B1C30] block">Prix d’achat *</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#EFF4FF] text-sm font-bold text-[#0B1C30]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0B1C30] block">Prix de vente *</label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#EFF4FF] text-sm font-bold text-[#0B1C30]"
            />
          </div>
        </div>

        <div
          className={`p-3 rounded-lg flex items-center justify-between ${
            margin > 0 ? 'bg-[#EFF4FF]' : 'bg-[#FFDAD6]'
          }`}
        >
          <div>
            <p className="text-[11px] font-semibold text-[#43474F]">Marge brute estimée</p>
            <p
              className={`text-base font-bold ${
                margin > 0 ? 'text-[#0B1C30]' : 'text-[#BA1A1A]'
              }`}
            >
              {margin > 0 ? `+${formatFcfa(margin)}` : formatFcfa(margin)}
            </p>
          </div>
          <span
            className={`text-sm font-bold ${
              margin > 0 ? 'text-[#16A34A]' : 'text-[#BA1A1A]'
            }`}
          >
            {margin > 0 ? `+${marginPct}%` : 'Prix vente ≤ achat'}
          </span>
        </div>
      </section>

      {/* 3. Stock & Alertes */}
      <section className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 tabular-nums">
        <h3 className="text-sm font-bold text-[#0B1C30]">3. Stock & Seuil d’Alerte</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0B1C30] block">Stock magasin *</label>
            <input
              type="number"
              value={stockCrates}
              onChange={(e) => setStockCrates(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#EFF4FF] text-sm font-bold text-[#0B1C30]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#0B1C30] block">Seuil alerte *</label>
            <input
              type="number"
              value={minAlert}
              onChange={(e) => setMinAlert(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-[#EFF4FF] text-sm font-bold text-[#BA1A1A]"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#0B1C30] block">Emplacement quai</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-10 px-3 rounded-lg bg-[#EFF4FF] text-xs text-[#0B1C30]"
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={!validPricing}
        className="w-full min-h-[48px] rounded-xl bg-[#00254B] text-white text-sm font-semibold disabled:opacity-45 cursor-pointer"
      >
        Enregistrer les modifications
      </button>
    </form>
  );
}

export function DeactivateSheetView({
  product,
  onConfirmToggleActive,
  onNavigate,
}: {
  product: ProductItem;
  onConfirmToggleActive: (productId: string, nextActive: boolean) => void;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [archivalChoice, setArchivalChoice] = useState<'deactivate' | 'archive'>('deactivate');
  const [pin, setPin] = useState('835');
  const [pinError, setPinError] = useState(false);

  const immobilizedValue = product.stockCrates * product.salePriceFcfa;
  const archiveBlocked = product.stockCrates > 0 || product.cratesOutWithClients > 0;

  return (
    <div className="p-4 pb-10 space-y-4">
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm space-y-3.5">
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto" />

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-[#BA1A1A]">Action Sensible · Superviseur</p>
            <h2 className="text-base font-bold text-[#0B1C30]">
              {product.activeInPos
                ? `Désactiver « ${product.name} » ?`
                : `Réactiver « ${product.name} » ?`}
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#43474F] bg-[#EFF4FF] p-3 rounded-lg leading-relaxed">
          {product.activeInPos
            ? 'La désactivation retirera immédiatement cette boisson du terminal de vente des caissiers.'
            : 'La réactivation rendra à nouveau cet article disponible à la vente au comptoir.'}
        </p>

        {/* Bilan d'impact opérationnel */}
        <div className="space-y-2 tabular-nums">
          <p className="text-xs font-bold text-[#43474F]">Impact Opérationnel Détecté</p>

          <div className="p-3 rounded-xl bg-[#EFF4FF] text-xs space-y-0.5">
            <div className="flex justify-between font-bold">
              <span className="text-[#0B1C30]">Stock résiduel en dépôt</span>
              <span className="text-[#BA1A1A]">{product.stockCrates} casiers</span>
            </div>
            <p className="text-[11px] text-[#43474F]">
              Valeur immobilisée : <strong>{formatFcfa(immobilizedValue)}</strong>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#EFF4FF] text-xs space-y-0.5">
            <div className="flex justify-between font-bold">
              <span className="text-[#0B1C30]">Consignes & Emballages</span>
              <span className="text-[#00254B]">{product.cratesOutWithClients} casiers dehors</span>
            </div>
            <p className="text-[11px] text-[#43474F]">
              Caution en cours :{' '}
              <strong>{formatFcfa(product.cratesOutWithClients * product.crateDepositFcfa)}</strong>
            </p>
          </div>
        </div>

        {/* Niveau d'archivage */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setArchivalChoice('deactivate')}
            className={`w-full p-3 rounded-xl text-left border text-xs cursor-pointer ${
              archivalChoice === 'deactivate'
                ? 'bg-[#EFF4FF] border-[#005CBD]'
                : 'bg-white border-slate-200'
            }`}
          >
            <p className="font-bold text-[#0B1C30]">
              {product.activeInPos
                ? 'Désactiver de la vente comptoir (Recommandé)'
                : 'Réactiver au catalogue de vente'}
            </p>
            <p className="text-[11px] text-[#43474F] mt-0.5">
              Conserve l’inventaire dépôt et le suivi des retours de consignes clients.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setArchivalChoice('archive')}
            className={`w-full p-3 rounded-xl text-left border text-xs cursor-pointer ${
              archivalChoice === 'archive'
                ? 'bg-[#FFDAD6]/40 border-[#BA1A1A]'
                : 'bg-white border-slate-200 opacity-75'
            }`}
          >
            <div className="flex justify-between font-bold">
              <span className="text-[#0B1C30]">Archiver définitivement le produit</span>
              {archiveBlocked && <span className="text-[#BA1A1A]">Bloqué</span>}
            </div>
            <p className="text-[11px] text-[#43474F] mt-0.5">
              Inaccessible tant que du stock ou des consignes externes subsistent.
            </p>
          </button>
        </div>

        {/* Code PIN Responsable */}
        <div className="bg-[#E6EEFF] rounded-xl p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-[#0B1C30]">Autorisation Responsable</span>
            <span className="text-[#43474F] font-mono">PIN 4 chiffres</span>
          </div>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setPinError(false);
            }}
            placeholder="Ex: 8359"
            className="w-full h-11 text-center font-mono text-base tracking-widest rounded-lg bg-white text-[#0B1C30]"
          />
          {pinError && (
            <p className="text-xs font-semibold text-[#BA1A1A]">
              Saisissez les 4 chiffres du code PIN Superviseur (ex: 8359).
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={archivalChoice === 'archive' && archiveBlocked}
          onClick={() => {
            if (pin.length < 4) {
              setPinError(true);
              return;
            }
            onConfirmToggleActive(product.id, !product.activeInPos);
          }}
          className="w-full min-h-[48px] rounded-xl bg-[#BA1A1A] text-white text-xs font-bold disabled:opacity-45 cursor-pointer"
        >
          {archivalChoice === 'archive' && archiveBlocked
            ? 'Archivage bloqué (Stock ou consignes > 0)'
            : product.activeInPos
            ? 'Confirmer la désactivation comptoir'
            : 'Confirmer la réactivation comptoir'}
        </button>

        <button
          type="button"
          onClick={() => onNavigate('product-detail')}
          className="w-full h-10 rounded-xl bg-[#EFF4FF] text-[#0B1C30] text-xs font-semibold cursor-pointer"
        >
          Annuler et revenir à la fiche
        </button>
      </div>
    </div>
  );
}
