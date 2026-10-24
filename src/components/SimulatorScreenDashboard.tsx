import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  CloudOff,
  Lock,
  LogOut,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  ClientAccount,
  MobileScreenId,
  OperatorProfile,
  OperatorRole,
  ProductItem,
  SaleRecord,
} from '../types/depot';
import { formatFcfa, formatNumberFr } from '../data/initialDepotData';

const WEEK_BARS = [
  { day: 'Ven', totalLabel: '2,9M', cashH: 48, creditH: 12 },
  { day: 'Sam', totalLabel: '4,9M', cashH: 82, creditH: 20, peak: true },
  { day: 'Dim', totalLabel: '3,4M', cashH: 56, creditH: 14 },
  { day: 'Lun', totalLabel: '2,1M', cashH: 36, creditH: 10 },
  { day: 'Mar', totalLabel: '3,1M', cashH: 52, creditH: 12 },
  { day: 'Mer', totalLabel: '3,2M', cashH: 54, creditH: 14 },
  { day: 'Auj', totalLabel: '3,8M', cashH: 66, creditH: 18, today: true },
];

export function DashboardView({
  operator,
  roleView,
  onChangeRoleView,
  products,
  clients,
  sales,
  onNavigate,
  onOpenProduct,
  onOpenSale,
}: {
  operator: OperatorProfile;
  roleView: OperatorRole;
  onChangeRoleView: (r: OperatorRole) => void;
  products: ProductItem[];
  clients: ClientAccount[];
  sales: SaleRecord[];
  onNavigate: (screen: MobileScreenId) => void;
  onOpenProduct: (productId: string) => void;
  onOpenSale: (saleId: string) => void;
}) {
  const [simState, setSimState] = useState<'normal' | 'empty' | 'offline'>('normal');

  const activeSales = sales.filter((s) => s.status !== 'cancelled');
  const baseCash = 2600000;
  const baseCredit = 780000;
  const cashSum =
    simState === 'empty'
      ? 0
      : activeSales
          .filter((s) => s.status === 'paid')
          .reduce((acc, s) => acc + s.grandTotalFcfa, baseCash);
  const creditSum =
    simState === 'empty'
      ? 0
      : activeSales
          .filter((s) => s.status === 'credit')
          .reduce((acc, s) => acc + s.grandTotalFcfa, baseCredit);
  const totalRevenue = cashSum + creditSum;
  const cashPct = totalRevenue > 0 ? Math.round((cashSum / totalRevenue) * 100) : 76;
  const creditPct = totalRevenue > 0 ? 100 - cashPct : 24;

  const lowStockList = products.filter((p) => p.stockCrates <= p.minAlertCrates);
  const totalCratesOut = products.reduce((acc, p) => acc + p.cratesOutWithClients, 0);
  const totalCreditClients = clients.filter((c) => c.creditBalanceFcfa > 0);
  const totalDebtFcfa = totalCreditClients.reduce((acc, c) => acc + c.creditBalanceFcfa, 0);

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Salutation & Contexte */}
      <section className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#00254B] truncate">
              Bonjour, {operator.fullName}
            </h2>
            <p className="text-xs text-[#43474F] mt-0.5">
              Dépôt Central Akwa · {operator.roleLabel}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('session-lock')}
              className="w-8 h-8 rounded-lg bg-[#EFF4FF] text-[#00254B] flex items-center justify-center hover:bg-[#DCE9FF] cursor-pointer"
              title="Suspendre la session"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('logout-confirm')}
              className="w-8 h-8 rounded-lg bg-[#EFF4FF] text-[#00254B] flex items-center justify-center hover:bg-[#DCE9FF] cursor-pointer"
              title="Déconnexion / Ticket Z"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sélecteur d'habilitation interactif */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#EFF4FF] rounded-lg">
          {(
            [
              { id: 'admin', label: 'Gérant' },
              { id: 'cashier', label: 'Caisse' },
              { id: 'stock', label: 'Stockiste' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeRoleView(tab.id)}
              className={`py-1.5 px-2 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                roleView === tab.id
                  ? 'bg-[#00254B] text-white shadow-xs'
                  : 'text-[#43474F] hover:text-[#0B1C30]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Simulateur d'état d'exploitation */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-[#43474F]">État d’exploitation :</span>
          <div className="flex items-center gap-1">
            {(
              [
                { id: 'normal', label: 'Midi' },
                { id: 'empty', label: '0 Vente' },
                { id: 'offline', label: 'Hors-ligne' },
              ] as const
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSimState(st.id)}
                className={`px-2 py-1 rounded text-[11px] font-semibold cursor-pointer ${
                  simState === st.id
                    ? 'bg-[#D7E2FF] text-[#001B3F]'
                    : 'bg-slate-100 text-[#43474F]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {simState === 'offline' && (
        <div className="bg-[#FFDAD6] text-[#93000A] rounded-xl p-3 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <CloudOff className="w-4 h-4 text-[#BA1A1A] shrink-0" />
            <span className="truncate font-medium">
              Réseau coupé · Enregistrement SQLite local actif
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSimState('normal')}
            className="font-bold underline shrink-0 cursor-pointer"
          >
            Reconnecter
          </button>
        </div>
      )}

      {/* KPI Chiffre d'affaires */}
      <section className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-[#737780]">Chiffre d’Affaires du Jour</p>
            <p className="text-2xl font-bold text-[#0B1C30] tabular-nums mt-0.5">
              {formatFcfa(totalRevenue)}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#16A34A] tabular-nums">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18,4%</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-2 w-full bg-[#E6EEFF] rounded-full overflow-hidden flex">
            <div className="bg-[#005CBD] h-full" style={{ width: `${cashPct}%` }} />
            <div className="bg-[#488FFD] h-full" style={{ width: `${creditPct}%` }} />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#43474F] tabular-nums">
            <span>
              Comptant : <strong className="text-[#0B1C30]">{formatNumberFr(cashSum)} F</strong> ({cashPct}%)
            </span>
            <span>
              Crédit : <strong className="text-[#0B1C30]">{formatNumberFr(creditSum)} F</strong> ({creditPct}%)
            </span>
          </div>
        </div>
      </section>

      {/* Grille 3 KPIs compacts */}
      <section className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onNavigate('sales-journal')}
          className="bg-white rounded-xl p-3 border border-slate-200/80 text-left hover:bg-[#EFF4FF]/50 transition-colors cursor-pointer"
        >
          <p className="text-[11px] font-semibold text-[#737780]">Ventes</p>
          <p className="text-lg font-bold text-[#0B1C30] tabular-nums mt-0.5">
            {simState === 'empty' ? 0 : 44 + activeSales.length}
          </p>
          <p className="text-[11px] text-[#16A34A] font-medium mt-0.5 truncate">Journal actif</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('stock-catalog')}
          className="bg-white rounded-xl p-3 border border-slate-200/80 text-left hover:bg-[#EFF4FF]/50 transition-colors cursor-pointer"
        >
          <p className="text-[11px] font-semibold text-[#737780]">Sous Seuil</p>
          <p className="text-lg font-bold text-[#BA1A1A] tabular-nums mt-0.5">
            {lowStockList.length} réf.
          </p>
          <p className="text-[11px] text-[#BA1A1A] font-medium mt-0.5 truncate">Urgence stock</p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('clients')}
          className="bg-white rounded-xl p-3 border border-slate-200/80 text-left hover:bg-[#EFF4FF]/50 transition-colors cursor-pointer"
        >
          <p className="text-[11px] font-semibold text-[#737780]">Crédits dus</p>
          <p className="text-lg font-bold text-[#0B1C30] tabular-nums mt-0.5">
            {formatNumberFr(Math.round(totalDebtFcfa / 1000))}k
          </p>
          <p className="text-[11px] text-[#43474F] font-medium mt-0.5 truncate">
            {totalCreditClients.length} débiteurs
          </p>
        </button>
      </section>

      {/* Histogramme 7 jours (visible en mode Gérant) */}
      {roleView === 'admin' && (
        <section className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#00254B]">Activité sur 7 Jours</h3>
              <p className="text-[11px] text-[#737780] tabular-nums">
                Semaine 43 · Total : 24,8M FCFA
              </p>
            </div>
            <span className="text-xs font-semibold text-[#005CBD]">Hebdomadaire</span>
          </div>

          <div className="flex items-end justify-between h-32 pt-3 gap-2">
            {WEEK_BARS.map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                <span
                  className={`text-[10px] tabular-nums ${
                    bar.today || bar.peak ? 'font-bold text-[#00254B]' : 'text-[#737780]'
                  }`}
                >
                  {bar.totalLabel}
                </span>
                <div className="w-full max-w-[24px] rounded-t overflow-hidden bg-[#EFF4FF] flex flex-col justify-end">
                  <div className="bg-[#488FFD] w-full" style={{ height: `${bar.creditH}px` }} />
                  <div
                    className={`${bar.today ? 'bg-[#00254B]' : 'bg-[#173B67]'} w-full`}
                    style={{ height: `${bar.cashH}px` }}
                  />
                </div>
                <span
                  className={`text-[11px] ${
                    bar.today ? 'font-bold text-[#00254B]' : 'text-[#43474F]'
                  }`}
                >
                  {bar.day}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-[#43474F]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#00254B]" />
              Comptant (Cash/MoMo)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#488FFD]" />
              À Crédit
            </span>
          </div>
        </section>
      )}

      {/* Points d'attention opérationnels */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#00254B]">
            Points d’Attention ({lowStockList.length + 1})
          </h3>
          <span className="text-xs font-semibold text-[#BA1A1A]">Priorité Haute</span>
        </div>

        {lowStockList.slice(0, 2).map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#FFDAD6] text-[#BA1A1A] flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0B1C30] truncate">{item.name}</p>
                <p className="text-[11px] text-[#43474F] tabular-nums">
                  {item.stockCrates} casiers restants · Seuil {item.minAlertCrates}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenProduct(item.id)}
              className="px-2.5 py-1.5 rounded-lg bg-[#00254B] text-white text-xs font-semibold shrink-0 cursor-pointer"
            >
              Gérer
            </button>
          </div>
        ))}

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#0B1C30]">
              {totalCratesOut} Casiers Consignés Dehors
            </p>
            <p className="text-[11px] text-[#43474F] tabular-nums">
              Valeur caution estimée : {formatFcfa(totalCratesOut * 3000)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('clients')}
            className="text-xs font-semibold text-[#005CBD] flex items-center gap-0.5 shrink-0 cursor-pointer"
          >
            <span>Dépositaires</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Accès Rapides */}
      <section className="space-y-2">
        <h3 className="text-sm font-bold text-[#00254B]">Accès Rapides</h3>
        <button
          type="button"
          onClick={() => onNavigate('pos')}
          className="w-full min-h-[48px] rounded-xl bg-[#173B67] hover:bg-[#00254B] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Nouvelle Vente / Encaissement</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onNavigate('stock-catalog')}
            className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-left hover:bg-[#EFF4FF] transition-colors cursor-pointer"
          >
            <Package className="w-4 h-4 text-[#005CBD] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0B1C30] truncate">Catalogue</p>
              <p className="text-[11px] text-[#737780] truncate">Prix & Stock</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('clients')}
            className="p-3 bg-white rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-left hover:bg-[#EFF4FF] transition-colors cursor-pointer"
          >
            <Users className="w-4 h-4 text-[#005CBD] shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0B1C30] truncate">Clients & Dettes</p>
              <p className="text-[11px] text-[#737780] truncate">Crédits & Casiers</p>
            </div>
          </button>
        </div>
      </section>

      {/* Dernières Ventes */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#00254B]">Dernières Ventes</h3>
          <button
            type="button"
            onClick={() => onNavigate('sales-journal')}
            className="text-xs font-semibold text-[#005CBD] flex items-center gap-1 cursor-pointer"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {simState === 'empty' ? (
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 text-center space-y-2">
            <p className="text-sm font-bold text-[#0B1C30]">Aucune vente sur cette vacation</p>
            <p className="text-xs text-[#737780]">
              Ouvrez le terminal POS pour enregistrer votre premier encaissement.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('pos')}
              className="mt-1 px-4 py-2 rounded-lg bg-[#00254B] text-white text-xs font-semibold cursor-pointer"
            >
              Initier un ticket
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {sales.slice(0, 4).map((sale) => (
              <button
                key={sale.id}
                type="button"
                onClick={() => onOpenSale(sale.id)}
                className="w-full p-3 bg-white rounded-xl border border-slate-200/80 text-left hover:bg-[#EFF4FF]/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] text-[#737780]">
                  <span className="font-semibold text-[#00254B]">{sale.invoiceNumber}</span>
                  <span className="tabular-nums">{sale.shortTime}</span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        sale.status === 'cancelled'
                          ? 'line-through text-[#737780]'
                          : 'text-[#0B1C30]'
                      }`}
                    >
                      {sale.clientName}
                    </p>
                    <p className="text-[11px] text-[#43474F] truncate">
                      {sale.items.reduce((s, i) => s + i.quantityCrates, 0)} casiers ·{' '}
                      {sale.paymentChannelLabel}
                    </p>
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <p
                      className={`text-sm font-bold ${
                        sale.status === 'credit'
                          ? 'text-[#BA1A1A]'
                          : sale.status === 'cancelled'
                          ? 'line-through text-[#737780]'
                          : 'text-[#0B1C30]'
                      }`}
                    >
                      {formatFcfa(sale.grandTotalFcfa)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
