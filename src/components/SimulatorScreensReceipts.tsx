import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Copy,
  Download,
  Printer,
  RotateCcw,
  Search,
  Share2,
  ShoppingCart,
  X,
} from 'lucide-react';
import {
  ClientAccount,
  MobileScreenId,
  SaleRecord,
  SaleStatus,
} from '../types/depot';
import { formatFcfa, formatNumberFr } from '../data/initialDepotData';

function QrGatePassSvg() {
  return (
    <svg className="w-24 h-24 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
      <rect x="5" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
      <rect x="11" y="11" width="14" height="14" rx="1" />
      <rect x="69" y="5" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
      <rect x="75" y="11" width="14" height="14" rx="1" />
      <rect x="5" y="69" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="5" />
      <rect x="11" y="75" width="14" height="14" rx="1" />
      <rect x="38" y="8" width="6" height="6" />
      <rect x="50" y="8" width="6" height="12" />
      <rect x="38" y="22" width="16" height="6" />
      <rect x="8" y="42" width="6" height="14" />
      <rect x="20" y="46" width="10" height="6" />
      <rect x="38" y="38" width="8" height="8" />
      <rect x="52" y="38" width="12" height="6" />
      <rect x="70" y="42" width="6" height="16" />
      <rect x="82" y="48" width="10" height="6" />
      <rect x="42" y="52" width="8" height="14" />
      <rect x="56" y="52" width="6" height="22" />
      <rect x="42" y="74" width="10" height="12" />
      <rect x="70" y="70" width="8" height="8" />
      <rect x="68" y="84" width="24" height="6" />
    </svg>
  );
}

function downloadTextBlob(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function SaleReceiptView({
  sale,
  initialThermalMode = false,
  onNavigate,
}: {
  sale: SaleRecord;
  initialThermalMode?: boolean;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [thermalMono, setThermalMono] = useState(initialThermalMode);
  const [paperSize, setPaperSize] = useState<'58' | '80'>('58');
  const [toast, setToast] = useState<string | null>(null);
  const [whatsappSheet, setWhatsappSheet] = useState(false);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const totalCrates = sale.items.reduce((acc, i) => acc + i.quantityCrates, 0);

  const whatsappMessage = [
    `*DÉPÔT CENTRAL AKWA - REÇU ${sale.invoiceNumber}*`,
    `Client : ${sale.clientName}`,
    `Date : ${sale.dateTimeLabel}`,
    '',
    ...sale.items.map(
      (i) => `• ${i.quantityCrates}c ${i.productName} : ${formatFcfa(i.lineSubtotalFcfa)}`
    ),
    sale.depositTotalFcfa > 0 ? `• Caution casiers : +${formatFcfa(sale.depositTotalFcfa)}` : '',
    '---------------------------',
    `*TOTAL : ${formatFcfa(sale.grandTotalFcfa)}*`,
    sale.status === 'credit'
      ? `*RESTE DÛ (CRÉDIT) : ${formatFcfa(sale.balanceDueFcfa)}*`
      : `*STATUT : PAYÉ (${sale.paymentChannelLabel})*`,
    'Pass sortie quai valide.',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="p-4 pb-10 space-y-3.5 relative">
      {toast && (
        <div className="sticky top-2 z-30 bg-[#0B1C30] text-white text-xs font-medium px-3.5 py-2.5 rounded-xl shadow-md">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigate('sales-journal')}
            className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0B1C30] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold text-[#0B1C30]">
            {thermalMono ? 'Aperçu Impression ESC/POS' : 'Reçu de Vente'}
          </h2>
        </div>
      </div>

      {/* Commutateur Électronique vs ESC/POS */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#DCE9FF] rounded-xl">
        <button
          type="button"
          onClick={() => setThermalMono(false)}
          className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            !thermalMono ? 'bg-white text-[#00254B] shadow-xs' : 'text-[#43474F]'
          }`}
        >
          Format Électronique
        </button>
        <button
          type="button"
          onClick={() => setThermalMono(true)}
          className={`py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            thermalMono ? 'bg-white text-[#00254B] shadow-xs' : 'text-[#43474F]'
          }`}
        >
          Ticket ESC/POS
        </button>
      </div>

      {/* Imprimante Bluetooth POS-58BT */}
      <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#EFF4FF] text-[#005CBD] flex items-center justify-center shrink-0">
            <Printer className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#0B1C30] truncate">Imprimante POS-58BT</p>
            <p className="text-[11px] text-[#43474F]">85% · Prête (Bluetooth BLE)</p>
          </div>
        </div>
        <div className="flex items-center bg-[#EFF4FF] rounded-lg p-0.5 shrink-0">
          {(['58', '80'] as const).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setPaperSize(sz)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                paperSize === sz ? 'bg-[#00254B] text-white' : 'text-[#43474F]'
              }`}
            >
              {sz}mm
            </button>
          ))}
        </div>
      </div>

      {!thermalMono && (
        <div className="bg-[#EFF4FF] rounded-xl p-3 flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
          <div className="min-w-0 text-xs">
            <p className="font-bold text-[#0B1C30]">Transaction {sale.invoiceNumber} confirmée</p>
            <p className="text-[11px] text-[#43474F] truncate">
              -{totalCrates} casiers décrémentés · Base locale SQLite synchronisée
            </p>
          </div>
        </div>
      )}

      {/* Ticket Papier */}
      <div
        className={`mx-auto transition-all bg-white rounded-t-xl border border-slate-200 shadow-sm overflow-hidden ${
          paperSize === '58' ? 'max-w-[310px]' : 'max-w-full'
        } ${thermalMono ? 'grayscale contrast-125 font-mono' : ''}`}
      >
        <div className="p-4 space-y-3 text-xs">
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h3 className="text-sm font-bold text-[#00254B] tracking-wide">
              DÉPÔT CENTRAL AKWA
            </h3>
            <p className="text-[10px] text-[#43474F]">
              DOUALA - CAMEROUN · RC/DLA/2018/B/452
            </p>
            <p className="text-[10px] text-[#737780] mt-0.5">
              {sale.stationName} · Opérateur : {sale.operatorName}
            </p>
          </div>

          <div className="space-y-1 text-[11px] pb-2.5 border-b border-slate-100">
            <div className="flex justify-between">
              <span className="text-[#43474F]">Facture :</span>
              <span className="font-bold text-[#0B1C30] font-mono">{sale.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474F]">Client :</span>
              <span className="font-bold text-[#0B1C30] truncate max-w-[180px]">
                {sale.clientName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474F]">Date :</span>
              <span className="font-medium text-[#0B1C30] tabular-nums">{sale.dateTimeLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#43474F]">Règlement :</span>
              <span className="font-semibold text-[#00254B]">{sale.paymentChannelLabel}</span>
            </div>
          </div>

          {/* Articles */}
          <div className="space-y-2 pb-3 border-b border-dashed border-slate-300 tabular-nums">
            {sale.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-[#0B1C30] truncate">{item.productName}</p>
                  <p className="text-[10px] text-[#43474F]">
                    {item.quantityCrates} casier(s) × {formatNumberFr(item.unitCratePriceFcfa)} F
                  </p>
                </div>
                <span className="font-bold text-[#0B1C30] shrink-0">
                  {formatFcfa(item.lineSubtotalFcfa)}
                </span>
              </div>
            ))}

            {sale.depositTotalFcfa > 0 ? (
              <div className="flex justify-between text-[#BA1A1A] font-semibold pt-1">
                <span>Caution casiers non rendus</span>
                <span>+{formatFcfa(sale.depositTotalFcfa)}</span>
              </div>
            ) : (
              <div className="text-[10px] text-[#16A34A] font-semibold pt-1">
                {totalCrates} casiers vides échangés · 0 casier dû
              </div>
            )}
          </div>

          {/* Total */}
          <div className="space-y-1 tabular-nums">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#0B1C30]">
                {sale.status === 'credit' ? 'TOTAL À PAYER' : 'TOTAL PAYÉ'}
              </span>
              <span className="text-lg font-bold text-[#00254B]">
                {formatFcfa(sale.grandTotalFcfa)}
              </span>
            </div>

            {sale.status === 'credit' ? (
              <div className="bg-[#FFDAD6] text-[#93000A] rounded-lg p-2.5 mt-2 space-y-0.5">
                <div className="flex justify-between font-bold text-[11px]">
                  <span>VENTE À CRÉDIT (IMPAYÉ)</span>
                  <span>{formatFcfa(sale.balanceDueFcfa)}</span>
                </div>
                <p className="text-[10px]">
                  Échéance convenue : {sale.dueDateLabel ?? '48h'}
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between text-[11px] text-[#43474F]">
                  <span>Montant reçu :</span>
                  <span className="font-semibold text-[#0B1C30]">
                    {formatFcfa(sale.amountReceivedFcfa)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#43474F]">
                  <span>Monnaie rendue :</span>
                  <span className="font-bold text-[#16A34A]">
                    {formatFcfa(sale.changeReturnedFcfa)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* QR Code Quai */}
          <div className="pt-3 border-t border-slate-100 flex flex-col items-center text-center">
            <div className="p-2 bg-white border border-slate-200 rounded-lg">
              <QrGatePassSvg />
            </div>
            <p className="text-[10px] font-bold text-[#0B1C30] mt-2">
              PASS SORTIE QUAI DE CHARGEMENT
            </p>
            <p className="text-[10px] text-[#737780]">
              Présentez ce code aux magasiniers pour retrait des casiers.
            </p>
          </div>
        </div>

        {/* Dentelure papier */}
        <svg className="w-full h-2.5 text-[#F8F9FF] fill-current" viewBox="0 0 200 10" preserveAspectRatio="none">
          <polygon points="0,10 5,0 10,10 15,0 20,10 25,0 30,10 35,0 40,10 45,0 50,10 55,0 60,10 65,0 70,10 75,0 80,10 85,0 90,10 95,0 100,10 105,0 110,10 115,0 120,10 125,0 130,10 135,0 140,10 145,0 150,10 155,0 160,10 165,0 170,10 175,0 180,10 185,0 190,10 195,0 200,10" />
        </svg>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => notify(`Impression ESC/POS (${paperSize}mm) envoyée à POS-58BT`)}
          className="w-full min-h-[48px] rounded-xl bg-[#00254B] hover:bg-[#173B67] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimer Ticket Thermique ({paperSize}mm ESC/POS)</span>
        </button>

        <button
          type="button"
          onClick={() => setWhatsappSheet(true)}
          className="w-full h-11 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Envoyer sur WhatsApp ({sale.clientPhone})</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              downloadTextBlob(`Recu_${sale.invoiceNumber.replace('#', '')}.txt`, whatsappMessage);
              notify('Reçu téléchargé sur votre poste');
            }}
            className="h-10 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#0B1C30] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#005CBD]" />
            <span>Télécharger Reçu</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('pos')}
            className="h-10 rounded-xl bg-[#DCE9FF] text-xs font-bold text-[#00254B] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Nouvelle Vente</span>
          </button>
        </div>
      </div>

      {whatsappSheet && (
        <div className="fixed inset-0 z-40 bg-[#0B1C30]/50 backdrop-blur-xs flex items-end justify-center p-3">
          <div className="w-full max-w-[366px] bg-white rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0B1C30]">Aperçu Message WhatsApp</h4>
              <button
                type="button"
                onClick={() => setWhatsappSheet(false)}
                className="w-8 h-8 rounded-full bg-[#EFF4FF] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <pre className="bg-[#EFF4FF] rounded-xl p-3 text-[11px] font-mono whitespace-pre-wrap text-[#0B1C30]">
              {whatsappMessage}
            </pre>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(whatsappMessage);
                setWhatsappSheet(false);
                notify('Message WhatsApp copié dans le presse-papiers');
              }}
              className="w-full h-11 rounded-xl bg-[#16A34A] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copier le reçu formaté WhatsApp</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SalesJournalView({
  sales,
  onOpenSaleDetail,
  onOpenReceipt,
  onNavigate,
}: {
  sales: SaleRecord[];
  onOpenSaleDetail: (saleId: string) => void;
  onOpenReceipt: (saleId: string) => void;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SaleStatus>('all');
  const [period, setPeriod] = useState<'today' | 'week'>('today');

  const filtered = sales.filter((s) => {
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        s.invoiceNumber.toLowerCase().includes(q) ||
        s.clientName.toLowerCase().includes(q) ||
        s.clientPhone.includes(q)
      );
    }
    return true;
  });

  const paidTotal = sales
    .filter((s) => s.status === 'paid')
    .reduce((sum, s) => sum + s.grandTotalFcfa, 0);
  const creditTotal = sales
    .filter((s) => s.status === 'credit')
    .reduce((sum, s) => sum + s.grandTotalFcfa, 0);

  const handleExportCsv = () => {
    const header = 'Facture,Date,Client,Statut,Canal,Montant_FCFA\n';
    const rows = sales
      .map(
        (s) =>
          `${s.invoiceNumber},"${s.dateTimeLabel}","${s.clientName}",${s.status},"${s.paymentChannelLabel}",${s.grandTotalFcfa}`
      )
      .join('\n');
    downloadTextBlob('Journal_Ventes_Depot_Akwa.csv', header + rows, 'text/csv;charset=utf-8');
  };

  return (
    <div className="p-4 pb-24 space-y-3.5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-[#00254B]">Journal des Ventes</h2>
          <p className="text-xs text-[#43474F] tabular-nums">
            {sales.length} transactions · Dépôt Central Akwa
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('pos')}
          className="px-3 py-2 rounded-xl bg-[#173B67] text-white text-xs font-bold cursor-pointer"
        >
          + Vente
        </button>
      </div>

      {/* Recherche */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-[#737780] absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="N° reçu (#VF-2026...), client, tél..."
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

      {/* Période & Statuts */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setPeriod('today')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            period === 'today' ? 'bg-[#00254B] text-white' : 'bg-white text-[#43474F]'
          }`}
        >
          Aujourd’hui
        </button>
        <button
          type="button"
          onClick={() => setPeriod('week')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
            period === 'week' ? 'bg-[#00254B] text-white' : 'bg-white text-[#43474F]'
          }`}
        >
          7 derniers jours
        </button>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {(
          [
            { id: 'all', label: `Tous (${sales.length})` },
            { id: 'paid', label: 'Comptant' },
            { id: 'credit', label: 'À Crédit' },
            { id: 'cancelled', label: 'Annulé' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-[#005CBD] text-white'
                : 'bg-white border border-slate-200/80 text-[#43474F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Synthèse Volume Actif */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2.5 tabular-nums">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#737780]">Volume Actif Journal</span>
          <span className="font-bold text-[#00254B] text-sm">
            {formatFcfa(paidTotal + creditTotal)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#EFF4FF] rounded-lg p-2.5">
            <p className="text-[11px] font-bold text-[#16A34A]">Comptant</p>
            <p className="text-sm font-bold text-[#0B1C30] mt-0.5">{formatFcfa(paidTotal)}</p>
          </div>
          <div className="bg-[#FFDAD6]/50 rounded-lg p-2.5">
            <p className="text-[11px] font-bold text-[#BA1A1A]">En Crédit</p>
            <p className="text-sm font-bold text-[#BA1A1A] mt-0.5">{formatFcfa(creditTotal)}</p>
          </div>
        </div>
      </div>

      {/* Liste des transactions */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 text-center space-y-2">
          <p className="text-sm font-bold text-[#0B1C30]">Aucune transaction trouvée</p>
          <p className="text-xs text-[#737780]">
            Aucun reçu ne correspond à ce filtre. Réinitialisez la recherche.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatusFilter('all');
            }}
            className="px-4 py-2 rounded-lg bg-[#00254B] text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Effacer les filtres</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((sale) => (
            <div
              key={sale.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p
                    className={`text-xs font-bold font-mono ${
                      sale.status === 'cancelled'
                        ? 'line-through text-[#737780]'
                        : 'text-[#00254B]'
                    }`}
                  >
                    {sale.invoiceNumber} · {sale.shortTime}
                  </p>
                  <h3
                    className={`text-sm font-bold truncate mt-0.5 ${
                      sale.status === 'cancelled'
                        ? 'line-through text-[#737780]'
                        : 'text-[#0B1C30]'
                    }`}
                  >
                    {sale.clientName}
                  </h3>
                  <p className="text-[11px] text-[#43474F]">{sale.paymentChannelLabel}</p>
                </div>
                <div className="text-right shrink-0 tabular-nums">
                  <p
                    className={`text-sm font-bold ${
                      sale.status === 'credit'
                        ? 'text-[#BA1A1A]'
                        : sale.status === 'cancelled'
                        ? 'line-through text-[#737780]'
                        : 'text-[#00254B]'
                    }`}
                  >
                    {formatFcfa(sale.grandTotalFcfa)}
                  </p>
                  <p
                    className={`text-[10px] font-bold mt-0.5 ${
                      sale.status === 'credit'
                        ? 'text-[#BA1A1A]'
                        : sale.status === 'cancelled'
                        ? 'text-[#737780]'
                        : 'text-[#16A34A]'
                    }`}
                  >
                    {sale.status === 'credit'
                      ? `Échéance ${sale.dueDateLabel ?? '48h'}`
                      : sale.status === 'cancelled'
                      ? 'Annulé'
                      : 'Soldé'}
                  </p>
                </div>
              </div>

              <div className="bg-[#EFF4FF] rounded-lg px-2.5 py-2 text-[11px] text-[#0B1C30] flex items-center justify-between">
                <span className="truncate">
                  {sale.items.reduce((s, i) => s + i.quantityCrates, 0)} casiers ({sale.items.map((i) => i.productName.split(' ')[0]).join(', ')})
                </span>
                <span className="text-[#43474F] shrink-0 ml-2">{sale.operatorName}</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => onOpenReceipt(sale.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#EFF4FF] text-[#005CBD] text-xs font-semibold cursor-pointer"
                >
                  Ticket ESC/POS
                </button>
                <button
                  type="button"
                  onClick={() => onOpenSaleDetail(sale.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#00254B] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Audit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Clôture Export CSV */}
      <div className="bg-[#EFF4FF] rounded-xl p-3.5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-[#0B1C30]">Clôture du Journal du Jour</p>
          <p className="text-[11px] text-[#43474F]">Exporter le rapport comptable CSV</p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#005CBD] flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>
  );
}

export function SaleAuditDetailView({
  sale,
  sales,
  onSelectSale,
  onCancelSale,
  onOpenReceipt,
  onNavigate,
}: {
  sale: SaleRecord;
  sales: SaleRecord[];
  onSelectSale: (saleId: string) => void;
  onCancelSale: (saleId: string, pin: string) => boolean;
  onOpenReceipt: (saleId: string) => void;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [cancelModal, setCancelModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const creditDemoSale = sales.find((s) => s.status === 'credit') ?? sale;
  const paidDemoSale = sales.find((s) => s.status === 'paid') ?? sale;

  const totalCrates = sale.items.reduce((acc, i) => acc + i.quantityCrates, 0);

  return (
    <div className="p-4 pb-10 space-y-3.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate('sales-journal')}
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0B1C30] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-bold text-[#0B1C30] truncate">
          Détail d’une Vente & Audit
        </h2>
      </div>

      {/* Switch rapide Scénario Audit */}
      <div className="bg-[#EFF4FF] rounded-xl p-2 flex items-center justify-between gap-2 text-xs">
        <span className="font-semibold text-[#43474F] pl-1">Scénario :</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onSelectSale(creditDemoSale.id)}
            className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
              sale.id === creditDemoSale.id
                ? 'bg-[#00254B] text-white'
                : 'bg-white text-[#43474F]'
            }`}
          >
            Crédit
          </button>
          <button
            type="button"
            onClick={() => onSelectSale(paidDemoSale.id)}
            className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
              sale.id === paidDemoSale.id
                ? 'bg-[#00254B] text-white'
                : 'bg-white text-[#43474F]'
            }`}
          >
            Comptant
          </button>
        </div>
      </div>

      {/* En-tête Facture */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#00254B] font-mono">{sale.invoiceNumber}</h3>
            <p className="text-xs text-[#43474F]">{sale.dateTimeLabel}</p>
          </div>
          <span
            className={`text-xs font-bold ${
              sale.status === 'credit'
                ? 'text-[#BA1A1A]'
                : sale.status === 'cancelled'
                ? 'text-[#737780]'
                : 'text-[#16A34A]'
            }`}
          >
            {sale.status === 'credit'
              ? 'À CRÉDIT (EN ATTENTE)'
              : sale.status === 'cancelled'
              ? 'ANNULÉE'
              : 'PAYÉ COMPTANT'}
          </span>
        </div>
        <div className="bg-[#EFF4FF] rounded-lg px-3 py-2 text-[11px] flex justify-between text-[#0B1C30]">
          <span>Base locale OK · Serveur Akwa synchronisé</span>
          <span className="font-mono text-[#737780]">SYNC-AKW</span>
        </div>
      </div>

      {/* Infos Client */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2">
        <h4 className="text-sm font-bold text-[#0B1C30]">{sale.clientName}</h4>
        <p className="text-xs text-[#43474F]">
          {sale.clientDistrict} · {sale.clientPhone}
        </p>
        {sale.dueDateLabel && (
          <p className="text-xs font-semibold text-[#BA1A1A]">
            Échéance convenue : {sale.dueDateLabel}
          </p>
        )}
      </div>

      {/* Lignes d'articles & Emballages */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <h4 className="font-bold text-[#0B1C30]">Articles & Emballages</h4>
          <span className="text-[#43474F] tabular-nums">
            {sale.items.length} réf. · {totalCrates} casiers
          </span>
        </div>

        <div className="space-y-2 tabular-nums">
          {sale.items.map((item, i) => (
            <div key={i} className="bg-[#EFF4FF] rounded-lg p-2.5 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-[#0B1C30]">{item.productName}</span>
                <span className="font-bold text-[#0B1C30]">
                  {formatFcfa(item.lineSubtotalFcfa)}
                </span>
              </div>
              <p className="text-[11px] text-[#43474F]">
                {item.quantityCrates} × {formatFcfa(item.unitCratePriceFcfa)} ({item.bottlesPerCrate}{' '}
                btles/casier)
              </p>
              <p
                className={`text-[11px] font-semibold ${
                  item.unreturnedCrates > 0 ? 'text-[#BA1A1A]' : 'text-[#16A34A]'
                }`}
              >
                {item.unreturnedCrates > 0
                  ? `Consigne : ${item.unreturnedCrates} casiers non rendus (+${formatFcfa(
                      item.depositChargedFcfa
                    )})`
                  : `Consigne : ${item.returnedCrates} casiers restitués (0 FCFA)`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Décompte Financier */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2 text-xs tabular-nums">
        <div className="flex justify-between text-[#43474F]">
          <span>Sous-total boissons ({totalCrates} casiers)</span>
          <span className="font-semibold text-[#0B1C30]">
            {formatFcfa(sale.beveragesSubtotalFcfa)}
          </span>
        </div>
        <div className="flex justify-between text-[#43474F]">
          <span>Caution emballages consignés</span>
          <span className="font-semibold text-[#005CBD]">
            +{formatFcfa(sale.depositTotalFcfa)}
          </span>
        </div>
        <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
          <span className="text-sm font-bold text-[#0B1C30]">TOTAL FACTURE</span>
          <span className="text-xl font-bold text-[#00254B]">
            {formatFcfa(sale.grandTotalFcfa)}
          </span>
        </div>

        <div
          className={`mt-2 p-3 rounded-xl flex justify-between items-center ${
            sale.balanceDueFcfa > 0 ? 'bg-[#FFDAD6] text-[#93000A]' : 'bg-[#EFF4FF] text-[#0B1C30]'
          }`}
        >
          <span className="font-semibold">Reste dû par le client</span>
          <span className="text-base font-bold">{formatFcfa(sale.balanceDueFcfa)}</span>
        </div>
      </div>

      {/* Traçabilité */}
      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-1.5 text-xs">
        <p className="font-bold text-[#0B1C30] mb-1">Audit & Traçabilité Dépôt</p>
        <div className="flex justify-between">
          <span className="text-[#43474F]">Terminal & Caisse</span>
          <span className="font-semibold text-[#0B1C30]">{sale.stationName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#43474F]">Opérateur</span>
          <span className="font-semibold text-[#0B1C30]">{sale.operatorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#43474F]">Supervision</span>
          <span className="font-semibold text-[#0B1C30]">{sale.supervisorName}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => onOpenReceipt(sale.id)}
          className="w-full min-h-[46px] rounded-xl bg-[#00254B] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Ouvrir Reçu & Impression ESC/POS</span>
        </button>

        {sale.status !== 'cancelled' && (
          <button
            type="button"
            onClick={() => setCancelModal(true)}
            className="w-full py-2.5 rounded-xl bg-[#FFDAD6]/60 text-[#BA1A1A] text-xs font-bold hover:bg-[#FFDAD6] transition-colors cursor-pointer"
          >
            Annuler cette vente (Action Superviseur)
          </button>
        )}
      </div>

      {cancelModal && (
        <div className="fixed inset-0 z-40 bg-[#00254B]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-xs space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-[#0B1C30]">Annuler {sale.invoiceNumber} ?</h4>
            <p className="text-xs text-[#43474F]">
              Les {totalCrates} casiers seront réintégrés en stock et l’encours sera annulé. Code PIN
              Superviseur requis (ex: <span className="font-mono font-bold">8359</span>).
            </p>
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full h-11 text-center font-mono text-base tracking-widest rounded-lg bg-[#EFF4FF]"
            />
            {pinError && (
              <p className="text-xs font-semibold text-[#BA1A1A]">Code PIN Superviseur requis (4 chiffres)</p>
            )}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCancelModal(false)}
                className="h-10 rounded-lg bg-[#EFF4FF] text-xs font-semibold text-[#0B1C30] cursor-pointer"
              >
                Fermer
              </button>
              <button
                type="button"
                onClick={() => {
                  const ok = onCancelSale(sale.id, pin);
                  if (ok) {
                    setCancelModal(false);
                  } else {
                    setPinError(true);
                  }
                }}
                className="h-10 rounded-lg bg-[#BA1A1A] text-white text-xs font-bold cursor-pointer"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ClientsDirectoryView({
  clients,
  onSettleClientDebt,
  onReturnClientCrates,
  onSelectClientForPos,
}: {
  clients: ClientAccount[];
  onSettleClientDebt: (clientId: string, amountFcfa: number) => void;
  onReturnClientCrates: (clientId: string, count: number) => void;
  onSelectClientForPos: (clientId: string) => void;
}) {
  const proClients = clients.filter((c) => !c.isAnonymousCounter);
  const totalDebt = proClients.reduce((s, c) => s + c.creditBalanceFcfa, 0);
  const totalCrates = proClients.reduce((s, c) => s + c.cratesOwed, 0);

  return (
    <div className="p-4 pb-24 space-y-3.5">
      <div>
        <h2 className="text-base font-bold text-[#00254B]">Clients, Crédits & Consignes</h2>
        <p className="text-xs text-[#43474F]">
          Suivi des débitants agréés, plafonds d’encours et retours d’emballages
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 tabular-nums">
        <div className="bg-white rounded-xl p-3 border border-slate-200/80">
          <p className="text-[11px] font-semibold text-[#737780]">Encours Crédit Total</p>
          <p className="text-base font-bold text-[#BA1A1A] mt-0.5">{formatFcfa(totalDebt)}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-slate-200/80">
          <p className="text-[11px] font-semibold text-[#737780]">Casiers Dehors</p>
          <p className="text-base font-bold text-[#00254B] mt-0.5">{totalCrates} casiers</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {proClients.map((clt) => {
          const pct = Math.min(
            100,
            Math.round((clt.creditBalanceFcfa / Math.max(1, clt.creditLimitFcfa)) * 100)
          );
          return (
            <div
              key={clt.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#0B1C30] truncate">{clt.name}</h3>
                  <p className="text-[11px] text-[#43474F]">
                    {clt.district} · {clt.phone}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#737780] shrink-0">{clt.code}</span>
              </div>

              <div className="space-y-1 tabular-nums text-xs">
                <div className="flex justify-between">
                  <span className="text-[#43474F]">Dette active :</span>
                  <span
                    className={`font-bold ${
                      clt.creditBalanceFcfa > 0 ? 'text-[#BA1A1A]' : 'text-[#16A34A]'
                    }`}
                  >
                    {formatFcfa(clt.creditBalanceFcfa)} / {formatNumberFr(clt.creditLimitFcfa)} F
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#E6EEFF] overflow-hidden">
                  <div className="h-full bg-[#005CBD]" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-[11px] text-[#43474F] pt-0.5">
                  Emballages consignés dus :{' '}
                  <strong className="text-[#0B1C30]">{clt.cratesOwed} casiers</strong>
                </p>
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                {clt.creditBalanceFcfa > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      onSettleClientDebt(clt.id, Math.min(25000, clt.creditBalanceFcfa))
                    }
                    className="flex-1 py-2 rounded-lg bg-[#EFF4FF] text-[#005CBD] text-[11px] font-bold cursor-pointer"
                  >
                    Encaisser 25k F
                  </button>
                )}
                {clt.cratesOwed > 0 && (
                  <button
                    type="button"
                    onClick={() => onReturnClientCrates(clt.id, Math.min(2, clt.cratesOwed))}
                    className="flex-1 py-2 rounded-lg bg-[#EFF4FF] text-[#0B1C30] text-[11px] font-bold cursor-pointer"
                  >
                    Retour 2 casiers
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onSelectClientForPos(clt.id)}
                  className="px-3 py-2 rounded-lg bg-[#00254B] text-white text-[11px] font-bold cursor-pointer"
                >
                  Facturer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
