import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  LogOut,
  Phone,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  X,
} from 'lucide-react';
import {
  CartEntry,
  MobileScreenId,
  OperatorProfile,
  PlatformOS,
  ProductItem,
  SaleRecord,
} from '../types/depot';
import { OPERATORS_DATA, formatFcfa } from '../data/initialDepotData';

export function SplashView({
  onNavigate,
}: {
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const steps = [
    { pct: 38, text: 'Vérification de la licence du dépôt...' },
    { pct: 74, text: 'Synchronisation SQLite des grilles tarifaires...' },
    { pct: 92, text: 'Contrôle des consignes casiers et soldes clients...' },
    { pct: 100, text: 'Prêt pour la prise de poste !' },
  ];
  const [stepIdx, setStepIdx] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1100);
    return () => clearInterval(timer);
  }, [steps.length]);

  const current = steps[stepIdx];

  return (
    <div className="min-h-full bg-[#173B67] text-white p-5 flex flex-col justify-between relative overflow-hidden">
      <svg
        className="absolute -right-10 -top-10 w-64 h-64 opacity-5 pointer-events-none"
        viewBox="0 0 160 160"
        fill="none"
      >
        <rect x="10" y="10" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
        <rect x="60" y="10" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
        <rect x="110" y="10" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
        <rect x="10" y="60" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
        <rect x="60" y="60" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
        <rect x="110" y="60" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2" />
      </svg>

      <div className="my-auto py-8 flex flex-col items-center text-center z-10">
        <div className="relative mb-5">
          <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/15">
            <svg className="w-14 h-14" viewBox="0 0 64 64" fill="none">
              <rect
                x="6"
                y="14"
                width="52"
                height="42"
                rx="6"
                fill="#00254B"
                stroke="#86A6D8"
                strokeWidth="2.5"
              />
              <line x1="23" y1="14" x2="23" y2="56" stroke="#86A6D8" strokeDasharray="2 2" strokeWidth="1.8" />
              <line x1="41" y1="14" x2="41" y2="56" stroke="#86A6D8" strokeDasharray="2 2" strokeWidth="1.8" />
              <line x1="6" y1="35" x2="58" y2="35" stroke="#86A6D8" strokeWidth="1.8" />
              <circle cx="15" cy="24" r="4" fill="#ABC7FF" />
              <circle cx="32" cy="24" r="4" fill="#ABC7FF" />
              <circle cx="49" cy="24" r="4" fill="#ABC7FF" />
              <circle cx="15" cy="45" r="4" fill="#ABC7FF" />
              <circle cx="32" cy="45" r="4" fill="#ABC7FF" />
              <circle cx="49" cy="45" r="4" fill="#ABC7FF" />
            </svg>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight">
          DepotManager <span className="text-[#D7E2FF]">Mobile</span>
        </h2>
        <p className="text-xs text-[#86A6D8] max-w-[260px] mt-1.5 leading-relaxed">
          Système de Gestion Commerciale & Dépôts de Boissons au Cameroun
        </p>

        <div className="mt-5 text-[11px] text-[#D7E2FF] space-y-1">
          <p>Édition Débitants & Grossistes · Douala / Yaoundé</p>
          <p className="text-[#86A6D8]">Mode Hybride SQLite · En ligne & Hors-ligne prêt</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 z-10">
        <div className="space-y-1.5">
          <div className="w-full h-1.5 bg-[#00254B] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D7E2FF] rounded-full transition-all duration-300"
              style={{ width: `${current.pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[#86A6D8] tabular-nums">
            <span className="truncate pr-2">{current.text}</span>
            <span className="font-bold text-white">{current.pct}%</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full min-h-[48px] rounded-xl bg-[#005CBD] hover:bg-[#004EA1] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Démarrer la session</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="w-full py-1.5 text-xs text-[#D7E2FF] hover:text-white transition-colors cursor-pointer"
        >
          Accès direct au Dashboard Gérant
        </button>
      </div>
    </div>
  );
}

export function LoginView({
  currentOperator,
  onSelectOperator,
  onNavigate,
}: {
  currentOperator: OperatorProfile;
  onSelectOperator: (op: OperatorProfile) => void;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [selected, setSelected] = useState<OperatorProfile>(currentOperator);
  const [password, setPassword] = useState('DepotAkwa2026!');
  const [showPwd, setShowPwd] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim().length < 4) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSelectOperator(selected);
    onNavigate('dashboard');
  };

  return (
    <div className="p-4 pb-8 space-y-3.5 relative">
      <div className="text-[11px] font-medium text-[#43474F] flex items-center justify-between">
        <span>Réseau Dépôts Cameroun · Akwa Principal</span>
        <span className="font-mono">LAN Dépôt</span>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#00254B] text-white flex items-center justify-center font-bold text-sm shrink-0">
            DM
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#0B1C30]">DepotManager Pro</h2>
            <p className="text-xs text-[#43474F] truncate">
              Système Opérationnel de Caisse & Casiers
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-[#00254B]">Connexion Opérateur</h3>
          <p className="text-xs text-[#43474F] mt-0.5 leading-relaxed">
            Accédez à votre poste de travail (Caisse, Stock, Administration, Quai).
          </p>
        </div>
      </div>

      {showError && (
        <div className="bg-[#FFDAD6] text-[#93000A] p-3.5 rounded-xl flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#BA1A1A] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-[#BA1A1A]">Échec de vérification du profil</p>
            <p className="mt-0.5">
              Identifiants non reconnus sur le terminal Akwa. 2 tentatives restantes avant verrouillage.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowError(false)}
            className="p-1 text-[#93000A] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#0B1C30]">Sélectionner le profil de poste</span>
            <span className="text-[#43474F] font-mono">Terminal 04</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {OPERATORS_DATA.map((op) => {
              const active = op.id === selected.id;
              return (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setSelected(op)}
                  className={`p-2.5 rounded-lg text-left transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#00254B] text-white'
                      : 'bg-[#EFF4FF] text-[#0B1C30] hover:bg-[#E6EEFF]'
                  }`}
                >
                  <p className="text-xs font-bold truncate">{op.roleLabel}</p>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      active ? 'text-[#D7E2FF]' : 'text-[#43474F]'
                    }`}
                  >
                    {op.fullName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2">
          <label className="text-xs font-semibold text-[#0B1C30] block">
            Identifiant ou Email professionnel
          </label>
          <input
            type="email"
            readOnly
            value={selected.email}
            className="w-full h-11 px-3 rounded-lg bg-[#EFF4FF] text-xs font-medium text-[#0B1C30] focus:outline-none"
          />
          <p className="text-[11px] text-[#43474F]">
            Domaine vérifié : @depot-akwa.cm · {selected.stationLabel}
          </p>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-slate-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-[#0B1C30]">Mot de passe de session</label>
            <span className="text-[11px] text-[#43474F]">AES-256</span>
          </div>
          <div className="relative flex items-center">
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-3 pr-10 rounded-lg bg-[#EFF4FF] text-sm text-[#0B1C30] focus:outline-none focus:ring-2 focus:ring-[#005CBD]"
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 w-8 h-8 flex items-center justify-center text-[#43474F] cursor-pointer"
              aria-label="Afficher le mot de passe"
            >
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="pt-1 flex items-center justify-between text-[11px]">
            <span className="text-[#16A34A] font-medium">Conformité caisse validée</span>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="text-[#005CBD] font-semibold hover:underline cursor-pointer"
            >
              Contacter gérance
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full min-h-[48px] rounded-xl bg-[#173B67] hover:bg-[#00254B] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>Ouvrir la session opérateur</span>
        </button>

        <button
          type="button"
          onClick={() => setShowError((v) => !v)}
          className="w-full py-2 rounded-lg bg-[#E6EEFF] text-[#0B1C30] text-xs font-medium hover:bg-[#DCE9FF] transition-colors cursor-pointer"
        >
          {showError ? 'Masquer alerte rejet' : 'Tester un rejet d’authentification'}
        </button>
      </form>

      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-[#00254B]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 w-full max-w-xs space-y-3 shadow-xl">
            <h4 className="text-sm font-bold text-[#0B1C30]">Permanence Gérance Akwa</h4>
            <p className="text-xs text-[#43474F] leading-relaxed">
              Seul le Chef de Dépôt peut réinitialiser une clé de caisse ou débloquer un terminal.
            </p>
            <div className="bg-[#EFF4FF] rounded-lg p-2.5 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#43474F]">Poste interne gérant</span>
                <span className="font-bold text-[#005CBD]">Ext. 102</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#43474F]">Urgence Caisse</span>
                <span className="font-bold text-[#005CBD] font-mono">+237 699 00 12 34</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(false)}
              className="w-full h-10 rounded-lg bg-[#00254B] text-white text-xs font-semibold cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function SessionLockView({
  operator,
  platform,
  cart,
  products,
  clientName,
  onNavigate,
}: {
  operator: OperatorProfile;
  platform: PlatformOS;
  cart: Record<string, CartEntry>;
  products: ProductItem[];
  clientName: string;
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const preservedSummary = Object.values(cart).reduce(
    (acc, entry) => {
      const p = products.find((item) => item.id === entry.productId);
      if (!p) return acc;
      return {
        crates: acc.crates + entry.quantityCrates,
        total: acc.total + entry.quantityCrates * p.salePriceFcfa,
      };
    },
    { crates: 0, total: 0 }
  );

  const handleUnlock = () => {
    if (pin.length >= 4) {
      setError(false);
      onNavigate('pos');
    } else {
      setError(true);
    }
  };

  return (
    <div className="p-4 pb-8 space-y-4">
      <div className="bg-[#DCE9FF] rounded-xl p-3.5 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[#0B1C30]">Session suspendue pour inactivité</p>
          <p className="text-[11px] text-[#43474F]">Verrouillage automatique (15 min) · {operator.stationLabel}</p>
        </div>
        <Lock className="w-4 h-4 text-[#005CBD] shrink-0" />
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#00254B] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {operator.initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#0B1C30] truncate">{operator.fullName}</h3>
            <p className="text-xs text-[#43474F]">
              {operator.roleLabel} · {operator.stationLabel}
            </p>
            <p className="text-[11px] text-[#737780] truncate">Dépôt Central Akwa</p>
          </div>
        </div>

        <div className="bg-[#EFF4FF] rounded-lg p-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#00254B]">Panier en cours préservé</span>
            <span className="font-bold text-[#00254B] tabular-nums">
              {formatFcfa(preservedSummary.total || 45600)}
            </span>
          </div>
          <p className="text-[11px] text-[#43474F] truncate">
            {preservedSummary.crates || 6} casiers consignés · Client : {clientName}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3">
        <div>
          <h4 className="text-sm font-bold text-[#0B1C30]">Déverrouillage rapide</h4>
          <p className="text-xs text-[#43474F] mt-0.5 leading-relaxed">
            Saisissez votre code PIN à 4 chiffres (ex. <span className="font-mono font-semibold">{operator.pinCode}</span>) pour reprendre la caisse.
          </p>
        </div>

        <input
          type="password"
          inputMode="numeric"
          maxLength={4}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError(false);
          }}
          placeholder="Code PIN à 4 chiffres..."
          className="w-full h-11 px-3.5 rounded-lg bg-[#EFF4FF] text-sm font-mono tracking-widest text-[#0B1C30] focus:outline-none focus:ring-2 focus:ring-[#005CBD]"
        />
        {error && (
          <p className="text-xs font-semibold text-[#BA1A1A]">
            Veuillez saisir 4 chiffres ou utiliser la biométrie.
          </p>
        )}

        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2 text-xs text-[#0B1C30]">
            <Fingerprint className="w-4 h-4 text-[#005CBD]" />
            <span>{platform === 'ios' ? 'Face ID iOS' : 'Empreinte Biométrique'}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setPin(operator.pinCode);
              setTimeout(() => onNavigate('pos'), 180);
            }}
            className="h-9 px-3 rounded-lg bg-[#E6EEFF] text-[#005CBD] text-xs font-semibold hover:bg-[#DCE9FF] transition-colors cursor-pointer"
          >
            Déverrouiller
          </button>
        </div>

        <button
          type="button"
          onClick={handleUnlock}
          className="w-full min-h-[48px] rounded-xl bg-[#173B67] hover:bg-[#00254B] text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          Reprendre la caisse
        </button>

        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full h-11 rounded-xl bg-[#EFF4FF] text-[#43474F] text-xs font-semibold hover:bg-[#E6EEFF] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Changer d’utilisateur / Déconnexion</span>
        </button>
      </div>
    </div>
  );
}

export function LogoutConfirmView({
  operator,
  sales,
  onNavigate,
}: {
  operator: OperatorProfile;
  sales: SaleRecord[];
  onNavigate: (screen: MobileScreenId) => void;
}) {
  const [logoutMode, setLogoutMode] = useState<'switch' | 'z_close'>('switch');

  const activeSalesTotal = sales
    .filter((s) => s.status !== 'cancelled')
    .reduce((sum, s) => sum + s.grandTotalFcfa, 1100000);

  return (
    <div className="p-4 pb-8 space-y-3.5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#0B1C30] cursor-pointer"
          aria-label="Retour"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h2 className="text-base font-bold text-[#0B1C30]">Confirmation Déconnexion</h2>
      </div>

      <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3">
        <div>
          <p className="text-[11px] font-semibold text-[#43474F]">Fin de session active</p>
          <h3 className="text-lg font-bold text-[#0B1C30]">Confirmer la déconnexion</h3>
          <p className="text-xs text-[#43474F] mt-1">
            Sécurisez vos encaissements et validez l’état de la caisse avant de libérer le terminal.
          </p>
        </div>

        <div className="bg-[#EFF4FF] rounded-lg p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-[#0B1C30]">{operator.fullName}</p>
              <p className="text-[11px] text-[#43474F]">
                {operator.roleLabel} · {operator.stationLabel}
              </p>
            </div>
            <span className="text-[#16A34A] font-semibold">En poste</span>
          </div>
          <div className="pt-2 border-t border-slate-200/60 flex justify-between text-[11px] text-[#43474F]">
            <span>Prise de poste : {operator.shiftStart}</span>
            <span className="font-semibold text-[#0B1C30]">4h 32min écoulées</span>
          </div>
        </div>

        <div className="bg-[#E6EEFF] rounded-lg p-3">
          <p className="text-[11px] font-semibold text-[#43474F]">CA Journalier Encaissé</p>
          <p className="text-2xl font-bold text-[#0B1C30] tabular-nums mt-0.5">
            {formatFcfa(activeSalesTotal)}
          </p>
          <p className="text-[11px] text-[#43474F] mt-0.5">
            Espèces · MTN MoMo · Orange Money
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-3 border border-slate-200/80 flex items-center justify-between text-xs">
        <div>
          <p className="font-semibold text-[#0B1C30]">Base locale SQLite synchronisée</p>
          <p className="text-[11px] text-[#43474F]">Toutes les écritures sont à jour sur le serveur Akwa.</p>
        </div>
        <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#43474F]">Mode de déconnexion requis</p>

        <button
          type="button"
          onClick={() => setLogoutMode('switch')}
          className={`w-full p-3.5 rounded-xl text-left border transition-colors cursor-pointer ${
            logoutMode === 'switch'
              ? 'bg-[#EFF4FF] border-[#005CBD]'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <p className="text-sm font-bold text-[#0B1C30]">Changement d’opérateur</p>
          <p className="text-xs text-[#43474F] mt-0.5">
            Garde le tiroir-caisse ouvert et la session active pour la relève rapide d’un collègue.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setLogoutMode('z_close')}
          className={`w-full p-3.5 rounded-xl text-left border transition-colors cursor-pointer ${
            logoutMode === 'z_close'
              ? 'bg-[#EFF4FF] border-[#005CBD]'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <p className="text-sm font-bold text-[#0B1C30]">Clôture de poste & Sortie définitive</p>
          <p className="text-xs text-[#43474F] mt-0.5">
            Édite le Ticket Z de caisse, comptabilise les casiers retournés et verrouille le poste.
          </p>
        </button>
      </div>

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="w-full min-h-[48px] rounded-xl bg-[#173B67] hover:bg-[#00254B] text-white text-sm font-semibold transition-colors cursor-pointer"
        >
          {logoutMode === 'z_close'
            ? 'Éditer le Ticket Z & Fermer le poste'
            : 'Confirmer le changement d’opérateur'}
        </button>
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="w-full h-11 rounded-xl bg-[#EFF4FF] text-[#0B1C30] text-xs font-semibold hover:bg-[#E6EEFF] transition-colors cursor-pointer"
        >
          Annuler et continuer ma session
        </button>
      </div>
    </div>
  );
}
