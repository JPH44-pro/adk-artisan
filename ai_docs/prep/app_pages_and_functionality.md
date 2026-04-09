## App Pages & Functionality Blueprint

### App Summary

**End Goal:** Donner aux artisans et TPE du bâtiment en France un **poste de pilotage** pour **devis, facturation, dossier client et agenda**, avec une promesse **d’équité** (abonnement, pas commission cachée sur les chantiers).

**Core Value Proposition:** Gagner du temps sur l’admin, réduire les impayés et les oublis, centraliser l’historique chantier par client, depuis le terrain ou le bureau.

**Target Users:** Artisans indépendants et micro-entreprises (BTP, entretien, espaces verts), clients finaux en accès limité selon les phases produit.

**Template technique du dépôt:** base **adk-agent-saas** (Next.js, Supabase, Stripe). La **vision produit** cible ReglePro (gestion artisan) : certaines routes du template (**chat**, **history**) restent des **héritages** à remplacer ou réorienter quand les écrans métier seront livrés.

---

## Universal SaaS Foundation

### Public Marketing Pages

- **Landing Page** : `/`
  - Hero aligné ReglePro : gestion pro, devis rapides, confiance (pas une marketplace à leads)
  - Fonctions clés : devis et factures, dossier client, relances, agenda (MVP)
  - Offres : rappel des paliers d’abonnement (gratuit, standard, pro) cohérents avec le document maître
  - CTA vers inscription puis **tableau de bord** (ou parcours actuel `/chat` tant que le dashboard métier n’existe pas)

- **Legal Pages** : `/privacy`, `/terms`, `/cookies`
  - Politique de confidentialité, CGU, cookies (RGPD, données clients et facturation)

### Authentication Flow

- **Login** : `/auth/login` (email / mot de passe, OAuth si activé)
- **Sign Up** : `/auth/sign-up`
- **Forgot Password** : `/auth/forgot-password`
- **Sign Up Success** : `/auth/sign-up-success`
- **Update Password** : `/auth/update-password` (si présent dans le template)
- **Auth Error** : `/auth/error`

---

## Core Application Pages (vision ReglePro)

### Tableau de bord

- **Dashboard** : `/dashboard` (à créer)
  - Vue synthèse : devis en attente de signature, factures en retard, prochains rendez-vous (Frontend)
  - Agrégation des compteurs depuis les tables métier et événements d’usage (Backend)
  - Rappels planifiés ou webhooks métier plus tard (Background Job, phase ultérieure)

### Clients et dossiers

- **Liste clients** : `/clients` (à créer)
  - Recherche et filtres par nom, ville, dernier contact (Frontend)
  - Liste paginée issue de la base (Backend)

- **Fiche client** : `/clients/[clientId]` (à créer)
  - Coordonnées, historique des chantiers et documents (Frontend)
  - CRUD client et pièces jointes (Backend)
  - Photos avant ou après stockées côté stockage objet quand prévu (Backend)

### Devis

- **Liste des devis** : `/devis` (à créer)
  - Statuts : brouillon, envoyé, accepté, refusé, expiré (Frontend)
  - Requêtes filtrées par utilisateur / entreprise (Backend)

- **Édition devis** : `/devis/[quoteId]` (à créer)
  - Lignes, TVA, totaux, modèles réutilisables (Frontend)
  - Persistance et versioning minimal (Backend)
  - Signature électronique ou envoi PDF selon intégration (Backend / connecteur externe, phase selon roadmap)

### Factures

- **Liste factures** : `/factures` (à créer)
  - Statuts de paiement, relances (Frontend)
  - Génération numérotation et conformité Factur-X en phase ultérieure si hors MVP (Backend)

- **Détail facture** : `/factures/[invoiceId]` (à créer)
  - Aperçu, téléchargement PDF, lien paiement si activé (Frontend + Backend)

### Agenda

- **Agenda (calendrier)** : `/agenda` (à créer)
  - Vue jour / semaine, rendez-vous liés aux clients et chantiers (Frontend)
  - Synchronisation calendrier externe en phase 2 si besoin (Backend)

### Assistant conversationnel (héritage template)

- **Session assistant** : `/chat` et `/chat/[[...sessionId]]`
  - Aujourd’hui : flux type analyse concurrentielle (ADK). **À réorienter** vers un assistant métier (relances, rédaction, questions chantier) ou retirer du parcours principal quand le produit ReglePro sera centré gestion.

- **Historique** : `/history`
  - Aujourd’hui : historique de sessions chat. **À remplacer ou fusionner** avec un historique **devis / chantiers / documents** selon priorité produit.

### Compte utilisateur

- **Profil et abonnement** : `/profile`
  - Compte, préférences, usage, lien portail Stripe, paliers Free / Pro (Frontend)
  - Lecture statut d’abonnement via Stripe comme source de vérité (Backend)
  - Webhooks Stripe déjà prévus pour les événements critiques (API existante)

---

## Business Model Pages

### Facturation et abonnement

- **Gestion intégrée au profil** : `/profile` (pas de route séparée obligatoire)
  - Abonnement, méthodes de paiement, usage (messages ou unités métier selon règles business)
  - Lien vers le portail client Stripe pour le détail des factures fournisseur

### Vérification d’accès

- Contrôle du tier avant actions coûteuses ou premium (Server Action ou middleware), aligné Stripe

---

## Admin plateforme (Phase 2)

- Réservé aux **opérateurs** du SaaS (pas aux artisans), si le document maître introduit un rôle admin distinct plus tard.
- Exemples de routes possibles : `/admin/users`, `/admin/support`, `/admin/metrics` (à créer avec garde auth + rôle)
- **Pas prioritaire MVP** pour les utilisateurs finaux artisans

---

## Navigation Structure

### Barre latérale principale (responsive)

- Tableau de bord
- Clients
- Devis
- Factures
- Agenda
- Assistant (optionnel, tant que `/chat` existe)
- Profil (compte, facturation)

### Navigation mobile

- Même ordre, menu repliable, actions terrain en tête (nouveau devis, appel client)

### Accès par rôle

- **Artisan / TPE:** tout le périmètre métier ci-dessus
- **Client final (phase ultérieure):** parcours séparé ou liens magiques depuis emails de devis, hors MVP sauf décision produit
- **Admin plateforme:** section admin dédiée, phase 2

---

## Next.js App Router Structure

### Layout Groups (cible)

```
app/
├── (public)/           # Marketing et légal
├── (auth)/             # Flux auth
├── (protected)/        # App authentifiée (dashboard, clients, devis, factures, agenda, profile, legacy chat)
└── api/                # Webhooks et intégrations externes uniquement si nécessaire
```

### Route Mapping (vision cible ReglePro)

**Public**

- `/` : landing
- `/privacy`, `/terms`, `/cookies` : légal

**Auth**

- `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/sign-up-success`, `/auth/update-password`, `/auth/error`

**Protégé (à développer progressivement)**

- `/dashboard` : tableau de bord
- `/clients`, `/clients/[clientId]` : clients
- `/devis`, `/devis/[quoteId]` : devis
- `/factures`, `/factures/[invoiceId]` : factures
- `/agenda` : agenda (rendez-vous)
- `/profile` : profil et billing
- `/chat`, `/chat/[[...sessionId]]`, `/history` : héritage template, à fusionner avec la vision produit

**API (externe / webhooks)**

- `/api/webhooks/stripe` : déjà prévu pour la facturation
- Autres webhooks (signature, SMS) quand intégrations choisies

### Backend Architecture (principes)

- **Server Actions** : mutations internes (création devis, mise à jour client, enregistrement des rendez-vous agenda)
- **Lib queries** : accès Drizzle / Supabase, règles métier
- **Routes API** : webhooks et appels entrants externes, pas la logique métier courante en JSON API si évitable

**Flux**

- Frontend → Server Actions → lib queries → base de données
- Stripe → webhook → mise à jour abonnement / usage

---

## MVP Functionality Summary

**Phase 1 (lancement aligné document maître):**

- Fondation SaaS : auth, légal, responsive, profil avec Stripe
- **Cœur métier à construire** : clients, devis (liste + édition), factures (liste + détail), agenda minimal, tableau de bord
- Données utilisateur isolées par compte (multi-tenant / RLS selon schéma)

**Phase 2 (document maître, feuille de route):**

- Relances automatiques, demandes d’avis, paiement en ligne, profil public artisan
- Matching actif seulement avec base utilisateurs dense

**Héritage template:**

- Remplacer progressivement le parcours **chat / history** par des écrans **ReglePro** ou réutiliser l’assistant sous une entrée secondaire

---

## Next Step

Ce blueprint sert de base aux **wireframes** (`prep_templates` suivants) et à la planification des sprints. La route canonique pour l’agenda est **`/agenda`**, sans changer la structure globale.
