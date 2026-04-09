## App Pages & Functionality Blueprint

### App Summary

**End Goal:** Donner aux artisans et TPE du bâtiment en France un **poste de pilotage** pour **devis, facturation, dossier client et agenda**, avec une promesse **d’équité** (abonnement, pas commission cachée sur les chantiers).

**Core Value Proposition:** Gagner du temps sur l’admin, réduire les impayés et les oublis, centraliser l’historique chantier par client, depuis le terrain ou le bureau.

**Target Users:** Artisans indépendants et micro-entreprises (BTP, entretien, espaces verts), clients finaux en accès limité selon les phases produit.

**Template technique du dépôt:** base **adk-agent-saas** (Next.js, Supabase, Stripe). La **vision produit** cible ReglePro (gestion artisan) : les routes **chat** et **history** restent des **héritages** ADK (historique des sessions **localisé en français** depuis 2026-04) ; réorientation assistant métier toujours prévue.

**État d’implémentation (2026-04-09) :** les pages métier **dashboard, clients, devis, factures, agenda** sont **implémentées** avec persistance Drizzle + RLS Supabase (voir `roadmap.md` phases 3–7). Détails complémentaires ci-dessous.

---

## Universal SaaS Foundation

### Public Marketing Pages

- **Landing Page** : `/`
  - Hero aligné ReglePro : gestion pro, devis rapides, confiance (pas une marketplace à leads)
  - Fonctions clés : devis et factures, dossier client, relances, agenda (MVP)
  - Offres : rappel des paliers d’abonnement cohérents avec le document maître
  - CTA vers inscription puis tableau de bord

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

- **Dashboard** : `/dashboard` **(livré)**
  - Synthèse : devis en attente, factures en retard, prochains rendez-vous
  - Requêtes : `lib/queries/dashboard.ts`

### Clients et dossiers

- **Liste clients** : `/clients` **(livré)**
  - Recherche, pagination
  - **Import fichier** : CSV / Excel (`.csv`, `.xlsx`, `.xls`) via dialogue **Importer** — modèle CSV fourni, mapping d’en-têtes FR/EN (`lib/clients/import-parse.ts`, action `importClientsFromFile`)

- **Fiche client** : `/clients/[clientId]` **(livré)**
  - Coordonnées, édition ; zone d’extension historique documents

### Devis

- **Liste des devis** : `/devis` **(livré)**
  - Filtres par statut ; colonne **Facturer** pour devis **envoyé** ou **accepté** (création facture brouillon liée au devis)

- **Édition devis** : `/devis/[quoteId]` **(livré)**
  - Lignes, TVA, totaux, client, statuts
  - **Créer une facture** : visible dès que le statut permet (envoyé / accepté) ; sinon bouton désactivé avec infobulle explicative
  - Duplication, suppression

### Factures

- **Liste factures** : `/factures` **(livré)**
  - Filtres statut, pagination

- **Détail facture** : `/factures/[invoiceId]` **(livré)**
  - Édition lignes / totaux ; champ **`quote_id`** en base pour traçabilité devis → facture
  - **Création depuis devis** : `createInvoiceFromQuote` — une seule facture « source » par devis (message d’erreur + lien vers facture existante si doublon)

### Agenda

- **Agenda** : `/agenda` **(livré)**
  - **5 semaines** consécutives (lundi → dimanche), fuseau **UTC** affiché
  - **Grille** : ligne d’en-têtes Lun–Dim, puis **5 lignes** de **7 tuiles carrées** ; rendez-vous dans les tuiles
  - **Survol** : infobulle récapitulative ; **clic** : formulaire création / édition / suppression
  - **Nature** : **Rendez-vous** ou **Rappel** (icône calendrier vs cloche, couleur dédiée pour les rappels)
  - **Typologie** (rendez-vous) : visite chantier, devis/commercial, intervention, administratif, autre — **couleurs** par type
  - **Dictée vocale** (navigateurs compatibles, `fr-FR`) sur titre, lieu, notes
  - Données : `agenda_events` avec `event_kind`, `typology` (migration **0006**)

### Assistant conversationnel (héritage template)

- **Session assistant** : `/chat` et `/chat/[[...sessionId]]`
  - Flux ADK hérité. **À réorienter** vers un assistant métier selon roadmap phase 8.

- **Historique** : `/history` **(livré, UI française)**
  - Liste des sessions chat groupées (aujourd’hui, hier, semaine, plus anciennes) ; renommer / supprimer ; messages d’erreur en français
  - **À terme** : fusion possible avec un historique métier (devis / chantiers) selon priorité produit

### Compte utilisateur

- **Profil et abonnement** : `/profile` **(livré, cohérence ReglePro)**
  - Compte, usage, Stripe, paliers

---

## Business Model Pages

### Facturation et abonnement

- **Gestion intégrée au profil** : `/profile`
  - Abonnement, méthodes de paiement, usage
  - Portail client Stripe

### Vérification d’accès

- Contrôle du tier avant actions coûteuses ou premium (Server Action ou middleware), aligné Stripe

---

## Admin plateforme (Phase 2)

- Réservé aux **opérateurs** du SaaS (pas aux artisans), si le document maître introduit un rôle admin distinct plus tard.
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

### Layout Groups (réel)

```
app/
├── (public)/           # Marketing et légal
├── (auth)/             # Flux auth
├── (protected)/        # Dashboard, clients, devis, factures, agenda, profile, chat, history
└── api/                # Webhooks et intégrations (ex. Stripe, ADK)
```

### Route Mapping ReglePro (implémenté sauf mention)

**Public**

- `/` : landing
- `/privacy`, `/terms`, `/cookies` : légal

**Auth**

- `/auth/login`, `/auth/sign-up`, `/auth/forgot-password`, `/auth/sign-up-success`, `/auth/update-password`, `/auth/error`

**Protégé**

- `/dashboard` : tableau de bord
- `/clients`, `/clients/[clientId]` : clients (+ import CSV/Excel sur la liste)
- `/devis`, `/devis/[quoteId]` : devis (+ conversion facture)
- `/factures`, `/factures/[invoiceId]` : factures
- `/agenda` : agenda multi-semaines, tuiles, typologies, rappels, dictée
- `/profile` : profil et billing
- `/chat`, `/chat/[[...sessionId]]`, `/history` : héritage ADK (history en FR)

**API**

- `/api/webhooks/stripe` : facturation
- Routes agent / run selon template

### Backend Architecture (principes)

- **Server Actions** : mutations métier (clients, import, devis, factures, agenda)
- **Lib queries** : accès Drizzle, `user_id` systématique
- **Routes API** : webhooks et appels externes

**Flux**

- Frontend → Server Actions → lib queries → base de données
- Stripe → webhook → mise à jour abonnement / usage

---

## MVP Functionality Summary

**Livré (aligné document maître, 2026-04) :**

- Fondation SaaS : auth, légal, responsive, profil Stripe
- **Cœur métier** : clients (dont **import fichier**), devis, factures (dont **émission depuis devis**), **agenda avancé** (grille tuiles, typologies, rappels, dictée), tableau de bord
- Données isolées par compte (RLS Supabase sur tables métier)

**Phase 2 (document maître) :**

- Relances automatiques, demandes d’avis, paiement en ligne, profil public artisan
- Matching actif seulement avec base utilisateurs dense

**Héritage template :**

- Remplacer progressivement le parcours **chat / history** par des écrans **ReglePro** ou réutiliser l’assistant sous une entrée secondaire

---

## Next Step

Ce blueprint sert de base aux **wireframes** et à la planification des sprints. La route canonique pour l’agenda est **`/agenda`**. Pour le détail technique des migrations et fichiers, croiser avec **`roadmap.md`** et **`initial_data_schema.md`**.
