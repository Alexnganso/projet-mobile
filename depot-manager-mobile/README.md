# DepotManager Mobile (iOS & Android)

Application mobile cross-platform (**iOS & Android**) conçue avec **React Native, Expo SDK 52 et TypeScript** pour la gestion commerciale, les encaissements comptoir (Cash, Orange Money, MTN MoMo), le suivi des casiers consignés et les comptes clients à crédit des dépôts de boissons au Cameroun (Douala, Yaoundé, Bafoussam).

---

## Pourquoi React Native + Expo (TypeScript) ?

1. **Compatibilité 100 % native iOS & Android** : Un seul code source compile en application native iOS (`.ipa` pour iPhone/iPad des gérants) et Android (`.apk` / `.aab` pour tablettes de caisse et terminaux de quai).
2. **Mode Hybride Offline-First (`expo-sqlite`)** : Base de données SQLite locale embarquée avec synchronisation automatique vers le serveur local du dépôt (LAN Akwa) dès le retour de la connexion.
3. **Matériel de terrain supporté nativement** :
   - Impression thermique Bluetooth BLE ESC/POS (`58mm` et `80mm`) avec QR Code Pass Sortie Quai.
   - Scan code-barres caméra (`EAN-13` bouteilles et casiers) via `expo-camera`.
   - Déverrouillage rapide de caisse par biométrie (`Face ID` sur iOS / Empreinte sur Android) ou code PIN à 4 chiffres via `expo-local-authentication`.
   - Génération de reçus PDF certifiés et envoi direct WhatsApp (`+237...`) via `expo-print` et `expo-sharing`.

---

## Structure du dossier `depot-manager-mobile/`

```text
depot-manager-mobile/
├── App.tsx                                # Point d'entrée (SQLite init + Navigation)
├── app.json                               # Configuration iOS (Bundle ID) & Android (Package + Permissions)
├── babel.config.js                        # Configuration compilateur Babel
├── package.json                           # Dépendances React Native & Expo SDK 52
├── tsconfig.json                          # Typage strict TypeScript
└── src/
    ├── theme/
    │   └── tokens.ts                      # Design System officiel (Couleurs, Typo, Espacements)
    ├── types/
    │   └── models.ts                      # Modèles métier (Produits, Consignes, Ventes, Crédits, Rôles)
    ├── database/
    │   └── sqlite.ts                      # Base locale SQLite & transactions atomiques hors-ligne
    ├── services/
    │   ├── thermalPrinter.ts              # Impression Bluetooth ESC/POS (58mm/80mm) & WhatsApp/PDF
    │   └── syncEngine.ts                  # Synchronisation LAN/Cloud avec le Serveur Local Akwa
    ├── store/
    │   └── useDepotStore.ts               # État global Zustand (Session, Panier POS, Rôles, Stocks)
    ├── navigation/
    │   └── RootNavigator.tsx              # Stack d'authentification + 5 Onglets principaux + Modales
    └── screens/
        ├── SplashScreen.tsx               # Démarrage & diagnostic licence/SQLite
        ├── AuthScreens.tsx                # Connexion Opérateur, Verrouillage 15 min & Déconnexion Z
        ├── DashboardScreen.tsx            # KPIs CA Jour, Histogramme 7j & Points d'attention
        ├── PosTerminalScreen.tsx          # Terminal Caisse, Scan EAN-13 & Panier flottant
        ├── PaymentCheckoutScreen.tsx      # Règlement Comptant (Cash/OM/MoMo) & Crédit Terme
        ├── ReceiptAndJournalScreens.tsx   # Reçu Thermique QR Quai, Journal & Audit Superviseur
        └── StockCatalogScreens.tsx        # Catalogue RBAC (Marges Gérant), Fiche & Désactivation PIN
```

---

## Démarrage rapide (Développement iOS & Android)

### 1. Prérequis
- **Node.js 20+** installé sur votre ordinateur (Windows, macOS ou Linux)
- Application **Expo Go** installée sur votre iPhone (App Store) ou smartphone Android (Google Play)

### 2. Installation et lancement
```bash
cd depot-manager-mobile
npm install
npx expo start
```
- Scannez le QR Code affiché dans le terminal avec l'appareil photo (iOS) ou l'application Expo Go (Android).
- Appuyez sur `a` pour ouvrir l'émulateur Android Studio, ou `i` pour le simulateur iOS (sur Mac).

### 3. Générer les installateurs finaux (APK Android & IPA iOS)
Grâce à **EAS Build**, vous pouvez compiler la version **iOS** même depuis un PC Windows ou Linux :
```bash
npm install -g eas-cli
eas login
eas build:configure

# Générer un fichier APK Android installable directement sur les tablettes du dépôt :
eas build --platform android --profile preview

# Générer l'application iOS pour iPhone / iPad :
eas build --platform ios --profile production
```
