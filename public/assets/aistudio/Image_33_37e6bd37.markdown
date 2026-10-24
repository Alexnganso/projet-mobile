---
name: DepotManager Mobile
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf6'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4ff'
  on-surface: '#0b1c30'
  on-surface-variant: '#43474f'
  inverse-surface: '#213146'
  inverse-on-surface: '#eaf1ff'
  outline: '#737780'
  outline-variant: '#c3c6d0'
  surface-tint: '#3f5f8d'
  primary: '#00254b'
  on-primary: '#ffffff'
  primary-container: '#173b67'
  on-primary-container: '#86a6d8'
  inverse-primary: '#a8c8fc'
  secondary: '#005cbd'
  on-secondary: '#ffffff'
  secondary-container: '#488ffd'
  on-secondary-container: '#00285a'
  tertiary: '#002c0e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00451a'
  on-tertiary-container: '#3bbc5f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a8c8fc'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#264774'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#abc7ff'
  on-secondary-fixed: '#001b3f'
  on-secondary-fixed-variant: '#004590'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4ff'
typography:
  display-currency:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

Le design system répond aux exigences opérationnelles d'un gestionnaire de dépôt de boissons au Cameroun, opérant dans des environnements commerciaux denses, rythmés et à forte luminosité (entrepôts, quais de déchargement, comptoirs de vente).

L'identité visuelle combine un professionnalisme sobre avec la rigueur d'un outil de gestion financière et logistique de premier ordre. Le style adopte un fonctionnalisme moderne : surfaces lumineuses, contrastes nets pour une lisibilité instantanée en plein soleil, typographie compacte mais aérée, et hiérarchies visuelles franches. L'interface élimine le superflu décoratif au profit d'une densité d'information maîtrisée, minimisant les erreurs de manipulation lors des encaissements, du décompte des casiers consignés et de l'attribution des crédits clients.

## Colors

La palette chromatique est articulée autour de rôles d'affichage précis garantissant une ergonomie sans ambiguïté :

- **Primaire (`#173B67`) :** Bleu profond utilisé pour les structures d'ancrage, en-têtes d'écrans, boutons d'action majeurs (validation de commande, clôture de caisse) et titres principaux.
- **Secondaire (`#2878E5`) :** Bleu vif réservé aux éléments interactifs actifs (onglets sélectionnés, boutons secondaires, commutateurs d'unités casiers/bouteilles, liens d'action rapide).
- **Surfaces & Fonds :** Arrière-plan global en gris neutre froid (`#F5F7FA`) et conteneurs surélevés en blanc pur (`#FFFFFF`) pour découper nettement les cartes de données.
- **Typographie :** Texte principal à fort contraste (`#172033`) pour les montants financiers et libellés critiques ; texte secondaire (`#5B6B82`) pour les métadonnées, timestamps et unités de mesure.
- **Sémantique Métier :**
  - **Succès (`#16A34A`) :** Factures soldées, paiements complets, stocks suffisants.
  - **Avertissement (`#F59E0B`) :** Alertes de stock proche du seuil critique, encaissements partiels, délais de crédit imminents.
  - **Danger / Alerte (`#DC2626`) :** Ruptures de stock avérées, impayés stricts, arriérés de paiement, casiers non restitués hors délai.
  - **Bordures & Séparateurs (`#E2E8F0`) :** Délimitations structurelles discrètes sans surcharge visuelle.

## Typography

La typographie repose intégralement sur **Inter**, sélectionnée pour sa lisibilité exceptionnelle sur écrans mobiles de toutes gammes et sa clarté tabulaire.

- **Montants & Devise (FCFA) :** Les valeurs financières utilisent toujours `display-currency` ou `headline-md` associées à la variante de chiffres tabulaires (`tnum`) pour garantir un alignement vertical parfait des chiffres dans les tableaux de vente et factures. La mention de devise « FCFA » est systématiquement affichée après le montant avec une espace insécable (ex. `1 450 000 FCFA`).
- **Niveaux de Titres :** `headline-lg` est réservé aux en-têtes majeurs de vue ; `headline-md` et `headline-sm` structurent les cartes KPI et les regroupements de commandes.
- **Labels Métier :** `label-sm` et `label-md` s'appliquent aux pastilles d'état, badges de consigne et onglets de navigation en majuscules discrètes ou semi-bold pour faciliter la lecture rapide en situation de comptoir.

## Layout & Spacing

Le dimensionnement cible en priorité une largeur de base mobile de 390px (iOS et Android modernes) avec adaptation fluide de 360px à 430px :

- **Marge d'écran (`margin: 1rem / 16px`) :** Appliquée sur les côtés gauche et droit pour maintenir une zone de confort avec les bordures physiques de l'appareil.
- **Grille interne :** Grille fluide à 4 colonnes pour le format smartphone, avec un espacement inter-colonnes (`gutter: 0.75rem / 12px`).
- **Rythme vertical :** Pas incrémental de 4px / 8px.
  - `space-xs (4px)` : Décalage entre icônes et micro-labels, paddings internes des puces de statut.
  - `space-sm (8px)` : Espacement entre libellés de champs et inputs, gap entre badges.
  - `space-md (12px)` : Padding interne des cartes compactes et listes d'articles.
  - `space-lg (16px)` : Padding des cartes KPI, marge inférieure entre sections.
  - `space-xl (24px)` : Séparation entre blocs majeurs (ex. indicateurs globaux et liste des dernières transactions).
- **Zone de sécurité inférieure (Safe Area) :** Prévoir un espacement fixe minimal de 80px en bas de page pour empêcher la barre de navigation fixe de masquer les boutons d'action ou le dernier élément d'une liste.

## Elevation & Depth

Le système emploie une approche sobre combinant contours à faible contraste et micro-ombres diffuses pour préserver une clarté absolue sous la lumière naturelle :

- **Niveau 0 (Fond général) :** Couleur `#F5F7FA`, surface plane d'arrière-plan de l'application.
- **Niveau 1 (Cartes de contenu & Listes) :** Fond `#FFFFFF`, bordure fine de 1px solide `#E2E8F0`, ombre subtile `0 1px 3px rgba(23, 32, 51, 0.05)`. Assure la séparation nette des cartes KPI et des lignes de commande.
- **Niveau 2 (Barre de navigation inférieure & Feuilles modales) :** Fond `#FFFFFF`, bordure supérieure 1px `#E2E8F0`, ombre portée diffuse `0 -4px 12px rgba(23, 32, 51, 0.06)`. Crée un détachement net par-dessus les flux défilants.
- **Niveau 3 (Popups de confirmation, dialogues de consignation) :** Fond `#FFFFFF`, ombre `0 8px 24px rgba(23, 32, 51, 0.12)`.

## Shapes

Le niveau d'arrondi est fixé à `2` (semi-arrondi moderne et structuré) :

- **Champs de saisie, cartes, sélecteurs et boutons standards :** Rayon de courbure de `0.5rem` (8px). Ce rayon assure une tenue industrielle stricte sans angles vifs agressifs.
- **Conteneurs majeurs & Feuilles de fond (Bottom Sheets) :** Rayon de courbure supérieur de `1rem` (16px) pour adoucir les ouvertures modales.
- **Badges de statut & Sélecteurs de quantité :** Rayon de `0.25rem` (4px) pour les tags compacts ou pill-shaped partiel pour conserver une géométrie lisible et technique.

## Components

### 1. Cartes d'indicateurs KPIs
- **Structure :** Surface blanche, bordure `#E2E8F0`, padding `16px`.
- **Disposition :** Rangées de 2 cartes par ligne (grille 2 colonnes).
- **Contenu :** Micro-label supérieur en `text-secondary` (`12px`, majuscules), montant proéminent en `18px bold` (`#172033`) avec devise « FCFA », et micro-indicateur de tendance ou alerte sous forme d'icône colorée (ex. flèche verte pour encaissement journalier, point d'exclamation rouge pour total des impayés).

### 2. Badges de statut de vente
Conçus avec un fond teinté à 12% d'opacité et un texte contrasté en graisse `600` :
- **Payé :** Fond `#DCFCE7`, texte et bordure fine `#16A34A`.
- **Crédit :** Fond `#FEE2E2`, texte et bordure fine `#DC2626`.
- **Partiel :** Fond `#FEF3C7`, texte et bordure fine `#D97706`.
- **En livraison :** Fond `#DBEAFE`, texte et bordure fine `#2878E5`.

### 3. Badges de consignation de casiers
- **Casiers dus :** Fond rouge pâle (`#FEF2F2`), texte `#DC2626`, préfixe obligatoire avec icône casier et quantité négative (ex. `-14 Casiers`).
- **Casiers retournés / soldés :** Fond vert pâle (`#F0FDF4`), texte `#16A34A` (ex. `0 Casier dû` ou `+6 Retournés`).

### 4. Sélecteurs d'unités et de quantité (Casiers vs Bouteilles)
- **Commutateur d'unité :** Segmented control à 2 options contiguës ("Casiers" / "Bouteilles"). L'option active prend un fond `#173B67` avec texte blanc ; l'option inactive prend un fond `#F5F7FA` avec texte `#5B6B82`.
- **Incrémentateur de quantité :** Bloc compact composé d'un bouton moins (`-`), d'une zone centrale de saisie numérique en `16px semi-bold`, et d'un bouton plus (`+`). Hauteur minimale tactile de `44px` pour un usage rapide à une main.

### 5. Champ de recherche rapide
- Hauteur de `44px`, fond blanc, bordure 1px `#E2E8F0`.
- Icône de loupe à gauche en `#5B6B82`, texte de substitution explicite (« Rechercher client, marque, n° facture... »).
- Bouton de réinitialisation rapide (croix) à droite dès qu'un caractère est saisi.

### 6. Boutons d'action rapide pleine largeur (Terminal de Vente)
- Placés fixement en pied d'écran au-dessus de la barre de navigation ou intégrés aux formulaires d'encaissement.
- Hauteur : `50px` pour garantir une frappe immédiate sans hésitation.
- **Action Primaire (Valider Vente / Encaisser) :** Fond `#173B67`, texte blanc `16px semi-bold`, centré.
- **Action Secondaire (Mettre en attente / Annuler) :** Fond `#F5F7FA`, bordure 1px `#E2E8F0`, texte `#172033`.

### 7. Barre de navigation mobile inférieure (Bottom Bar)
- Hauteur fixe : `64px` hors safe area. Fond blanc (`#FFFFFF`), bordure supérieure 1px `#E2E8F0`.
- **5 Onglets :** `Dashboard`, `Ventes`, `Stock`, `Clients`, `Plus`.
- **État inactif :** Icône trait fin (`22px`) et label en `10px medium` couleur `#5B6B82`.
- **État actif :** Icône remplie et label couleur `#2878E5`, surmontés d'une pastille ou barre indicatrice bleue de `3px` sous l'icône.