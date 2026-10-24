import React, { useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FolderOpen,
  Layers,
  Smartphone,
  Terminal,
} from 'lucide-react';

const COMPARISON_ROWS = [
  {
    criterion: 'Langage de programmation',
    reactNative: 'TypeScript / JavaScript (typé, universel Web + Mobile + Serveur)',
    flutter: 'Dart (langage dédié à l’écosystème Flutter)',
    winner: 'React Native + Expo',
  },
  {
    criterion: 'Compatibilité iOS & Android',
    reactNative: 'Composants natifs réels UIKit (iOS) & Android Views (60-120 fps)',
    flutter: 'Moteur graphique Impeller/Skia dessinant ses propres pixels sur iOS & Android',
    winner: 'Égalité (100% compatible)',
  },
  {
    criterion: 'Compilation iOS sans posséder de Mac',
    reactNative: 'Native et directe via Expo EAS Build dans le cloud depuis Windows ou Linux',
    flutter: 'Nécessite macOS + Xcode local ou configuration CI/CD tierce (Codemagic)',
    winner: 'React Native + Expo',
  },
  {
    criterion: 'Base de données locale Hors-Ligne (SQLite)',
    reactNative: 'expo-sqlite (JSI synchrone ultra-rapide, transactions ACID hors-ligne)',
    flutter: 'sqflite / drift (très solide, nécessite génération de code build_runner)',
    winner: 'Égalité',
  },
  {
    criterion: 'Imprimantes Bluetooth ESC/POS (58mm / 80mm)',
    reactNative: 'react-native-ble-plx + commandes ESC/POS directes vers RPP02N / Xprinter',
    flutter: 'flutter_blue_plus + esc_pos_utils',
    winner: 'Égalité',
  },
  {
    criterion: 'Fidélité à vos maquettes HTML / Tailwind',
    reactNative: 'Traduction quasi 1:1 des styles, tokens et composants React existants',
    flutter: 'Réécriture complète en arbres de Widgets imbriqués Dart',
    winner: 'React Native + Expo',
  },
  {
    criterion: 'Partage de code avec le Serveur Local Akwa',
    reactNative: '100% des interfaces (Produits, Ventes, Consignes) partagées avec Node.js',
    flutter: 'Modèles à dupliquer entre le backend et le client Dart',
    winner: 'React Native + Expo',
  },
];

export function TechChoiceView({
  onOpenFolderTab,
  onDownloadZip,
}: {
  onOpenFolderTab: () => void;
  onDownloadZip: () => void;
}) {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Recommandation Principale */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <p className="text-xs font-semibold text-[#005CBD]">
          Recommandation Technique · Compatibilité iOS & Android
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0B1C30] tracking-tight text-balance">
          Quel langage choisir ? Optez pour TypeScript avec React Native (Expo SDK 52)
        </h1>
        <p className="text-sm sm:text-base text-[#43474F] leading-relaxed max-w-3xl">
          Vous hésitez entre <strong>React Native</strong> et <strong>Flutter</strong> pour bâtir{' '}
          <strong>DepotManager Mobile</strong> sur iOS et Android. Les deux frameworks sont
          excellents, mais pour votre cahier des charges précis — 15 écrans déjà maquetés en
          Tailwind, caisse hors-ligne SQLite, imprimantes thermiques Bluetooth 58mm/80mm et serveur
          local de dépôt à Douala/Yaoundé — <strong>React Native avec Expo et TypeScript</strong>{' '}
          offre le chemin le plus rapide, le plus maintenable et la compilation iOS même depuis un
          PC Windows.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={onOpenFolderTab}
            className="px-4 py-2.5 rounded-xl bg-[#00254B] hover:bg-[#173B67] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Explorer le dossier depot-manager-mobile/</span>
          </button>
          <button
            type="button"
            onClick={onDownloadZip}
            className="px-4 py-2.5 rounded-xl bg-[#EFF4FF] hover:bg-[#DCE9FF] text-[#00254B] text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#005CBD]" />
            <span>Télécharger le projet complet (.zip)</span>
          </button>
        </div>
      </section>

      {/* Les 3 piliers techniques */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
          <Smartphone className="w-5 h-5 text-[#005CBD]" />
          <h2 className="text-base font-bold text-[#0B1C30]">
            01. Un seul code pour iPhone, iPad & Android
          </h2>
          <p className="text-xs text-[#43474F] leading-relaxed">
            Le gérant consulte ses marges et alertes en temps réel sur son <strong>iPhone</strong>,
            tandis que les caissiers et magasiniers encaissent sur des{' '}
            <strong>tablettes et terminaux Android</strong> au comptoir. Tout provient du même
            dossier TypeScript.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
          <Layers className="w-5 h-5 text-[#005CBD]" />
          <h2 className="text-base font-bold text-[#0B1C30]">
            02. SQLite Local & Synchronisation Hybride
          </h2>
          <p className="text-xs text-[#43474F] leading-relaxed">
            Grâce à <code className="font-mono text-[#00254B]">expo-sqlite</code> en mode WAL,
            chaque vente, caution de casier et dette client est enregistrée en moins de 5 ms sans
            internet, puis synchronisée vers le serveur local Akwa dès le retour du réseau.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
          <Terminal className="w-5 h-5 text-[#005CBD]" />
          <h2 className="text-base font-bold text-[#0B1C30]">
            03. Périphériques Terrain Intégrés
          </h2>
          <p className="text-xs text-[#43474F] leading-relaxed">
            Le dossier configure déjà les permissions iOS (<code className="font-mono">Info.plist</code>)
            et Android (<code className="font-mono">AndroidManifest</code>) pour le Bluetooth BLE
            (imprimantes ESC/POS 58mm/80mm), la caméra (scan EAN-13) et Face ID / Empreinte.
          </p>
        </div>
      </section>

      {/* Tableau comparatif React Native vs Flutter */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#0B1C30]">
            Comparatif Détaillé : React Native (TypeScript) vs Flutter (Dart)
          </h2>
          <p className="text-xs text-[#43474F] mt-0.5">
            Évaluation basée sur les contraintes réelles d’exploitation d’un dépôt de boissons.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F9FF] border-b border-slate-200 text-[#43474F]">
                <th className="py-3 px-5 font-semibold">Critère Métier & Technique</th>
                <th className="py-3 px-5 font-semibold text-[#00254B]">
                  React Native + Expo (Recommandé)
                </th>
                <th className="py-3 px-5 font-semibold">Flutter (Alternative)</th>
                <th className="py-3 px-5 font-semibold">Avantage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.criterion} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-5 font-semibold text-[#0B1C30]">{row.criterion}</td>
                  <td className="py-3.5 px-5 text-[#0B1C30]">{row.reactNative}</td>
                  <td className="py-3.5 px-5 text-[#43474F]">{row.flutter}</td>
                  <td className="py-3.5 px-5 font-semibold text-[#005CBD] whitespace-nowrap">
                    {row.winner}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quand préférer Flutter ? */}
      <section className="bg-[#EFF4FF] rounded-2xl p-6 space-y-2">
        <h3 className="text-sm font-bold text-[#00254B]">
          Dans quel cas choisir plutôt Flutter (Dart) ?
        </h3>
        <p className="text-xs text-[#43474F] leading-relaxed">
          Choisissez <strong>Flutter</strong> uniquement si votre équipe maîtrise déjà Dart ou si
          vous prévoyez des rendus graphiques 2D/3D très lourds sur mesure. Dans tous les autres
          cas — notamment pour connecter votre application mobile à une API Node.js/PostgreSQL,
          réutiliser vos styles Tailwind et compiler sur iPhone depuis Windows —{' '}
          <strong>React Native + Expo (TypeScript)</strong> vous fera gagner plusieurs semaines de
          développement.
        </p>
      </section>
    </div>
  );
}

function CommandBlock({
  step,
  title,
  description,
  command,
}: {
  step: string;
  title: string;
  description: string;
  command: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyCmd = () => {
    navigator.clipboard?.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#005CBD]">{step}</p>
          <h3 className="text-base font-bold text-[#0B1C30] mt-0.5">{title}</h3>
          <p className="text-xs text-[#43474F] mt-1 leading-relaxed">{description}</p>
        </div>
        <button
          type="button"
          onClick={copyCmd}
          className="px-3 py-1.5 rounded-lg bg-[#EFF4FF] hover:bg-[#DCE9FF] text-xs font-semibold text-[#00254B] flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copié' : 'Copier'}</span>
        </button>
      </div>
      <pre className="bg-[#0B1C30] text-slate-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
        <code>{command}</code>
      </pre>
    </div>
  );
}

export function DeploymentGuideView({ onDownloadZip }: { onDownloadZip: () => void }) {
  return (
    <div className="max-w-[1040px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#005CBD]">
            Mise en Route & Compilation Binaire iOS / Android
          </p>
          <h1 className="text-2xl font-bold text-[#0B1C30] tracking-tight">
            Guide d’exécution du dossier <span className="font-mono">depot-manager-mobile/</span>
          </h1>
          <p className="text-sm text-[#43474F]">
            Téléchargez l’archive ZIP générée, décompressez-la sur votre machine et suivez ces 4
            étapes.
          </p>
        </div>

        <button
          type="button"
          onClick={onDownloadZip}
          className="px-4 py-2.5 rounded-xl bg-[#00254B] hover:bg-[#173B67] text-white text-xs font-semibold flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Télécharger depot-manager-mobile.zip</span>
        </button>
      </div>

      <div className="space-y-4">
        <CommandBlock
          step="Étape 01 · Installation locale"
          title="Installer les dépendances du dossier mobile"
          description="Ouvrez un terminal dans le dossier décompressé depot-manager-mobile/ (Node.js 20+ requis) pour installer Expo SDK 52, SQLite, React Navigation et Zustand."
          command={`cd depot-manager-mobile\nnpm install`}
        />

        <CommandBlock
          step="Étape 02 · Test instantané sur iPhone & Android"
          title="Lancer le serveur Expo et scanner avec votre téléphone"
          description="Démarrez le bundler Metro. Scannez le QR code avec l’appareil photo sur iOS ou avec l’application Expo Go sur Android pour tester l’application en conditions réelles."
          command={`npx expo start`}
        />

        <CommandBlock
          step="Étape 03 · Tablettes & Smartphones Android du Dépôt"
          title="Générer un installateur APK Android autonome"
          description="Le fichier eas.json inclus configure déjà le profil 'preview' en APK direct pour installer DepotManager sur les tablettes de caisse sans passer par le Play Store."
          command={`npm install -g eas-cli\neas login\neas build --platform android --profile preview`}
        />

        <CommandBlock
          step="Étape 04 · Déploiement iOS (iPhone / iPad Gérant)"
          title="Compiler la version iOS dans le cloud (même depuis Windows)"
          description="EAS Build compile le binaire natif iOS (.ipa) sur les serveurs macOS d’Expo et le publie sur TestFlight ou l’App Store."
          command={`eas build --platform ios --profile production\neas submit --platform ios`}
        />
      </div>
    </div>
  );
}
