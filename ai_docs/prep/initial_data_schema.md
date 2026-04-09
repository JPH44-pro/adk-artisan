## Strategic Database Planning Document

### App Summary

**End Goal:** Donner aux artisans et TPE du bâtiment en France un poste de pilotage pour devis, facturation, dossier client et agenda, avec abonnement équitable (pas de commission cachée sur les chantiers).

**Template Used:** adk-agent-saas (Next.js, Supabase Auth, Drizzle, Stripe).

**Core Features:** Compte et facturation Stripe, suivi d’usage type chat ADK (sessions, messages), périmètre métier ReglePro à ajouter (clients, devis, factures, agenda, tableau de bord).

---

## Current Database State

### Existing Tables (adk-agent-saas template)

Schéma source : `apps/web/lib/drizzle/schema/`.

- **`users`**  
  - Colonnes : `id` (PK, aligné `auth.users`), `email`, `full_name`, `created_at`, `updated_at`, `stripe_customer_id`, `role` (`member` | `admin`).  
  - Sert : profil applicatif, lien Stripe, garde admin plateforme.  
  - Le palier d’abonnement **free / paid** n’est **pas** stocké en colonne : il est dérivé côté applicatif à partir des données Stripe (voir `lib/usage-tracking.ts`).

- **`session_names`**  
  - Colonnes : `id`, `session_id` (texte ADK), `user_id` → `users`, `title`, `is_ai_generated`, timestamps.  
  - Contrainte unique `(session_id, user_id)`.  
  - Sert : titres de sessions pour l’assistant `/chat` et l’historique `/history`.

- **`user_usage_events`**  
  - Colonnes : `id`, `user_id` → `users`, `event_type` (`message_sent`, `session_created`), `created_at`.  
  - Sert : plafonds d’usage par fenêtre temporelle pour le produit **chat**.

### Template Assessment

**Fit global :** la base actuelle est **bien adaptée** à auth, Stripe customer id, admin, chat ADK et quotas messages / sessions. Elle est **insuffisante seule** pour le cœur métier ReglePro (clients, devis, factures, agenda).

**Points déjà utiles pour ReglePro**

- Isolation par `users.id` comme premier niveau de tenant (artisan solo).  
- `stripe_customer_id` + webhooks pour la monétisation.  
- `role` pour une future section admin opérateurs (hors MVP métier).

**Écarts avec la vision ReglePro**

- Aucune entité **client**, **devis**, **facture**, **rendez-vous**.  
- `user_usage_events` modèle **message / session** : à **étendre** (nouveaux `event_type`) ou à **compléter** avec d’autres mécanismes si les plafonds métier (ex. nombre de devis) diffèrent des règles chat.

**Prêt à construire sans migration immédiate**

- Pages **profil**, **auth**, **webhooks Stripe**, garde **admin** (structure actuelle).

---

## Feature-to-Schema Mapping

### Fonctions déjà couvertes par le schéma actuel

- **Compte utilisateur + email** → `users` + Supabase Auth.  
- **Portail facturation Stripe** → `stripe_customer_id` + intégration Stripe existante.  
- **Assistant conversationnel / historique chat (héritage)** → `session_names`, `user_usage_events`.  
- **Rôle admin plateforme** → `users.role` (usage futur, pas prioritaire MVP métier).

### Fonctions ReglePro nécessitant de nouvelles tables (ou extensions)

- **Liste et fiche clients** → table **`clients`** (minimum : lien `user_id`, identité, coordonnées, métadonnées de recherche).  
- **Devis (liste + édition)** → tables **`quotes`** + **`quote_lines`** (ou JSON lines en MVP si vous acceptez moins de normalisation).  
- **Factures (liste + détail)** → tables **`invoices`** + **`invoice_lines`**, lien optionnel vers devis accepté.  
- **Agenda** → table **`agenda_events`** (ou `appointments`) : horodatage, lien `client_id`, libellé chantier, statut.  
- **Tableau de bord** → requêtes agrégées sur les tables ci-dessus (pas obligatoire d’ajouter une table « dashboard »).  
- **Pièces jointes / photos** → prévoir **clés de stockage** (bucket Supabase) sur client ou chantier ; une table **`attachments`** est recommandée dès que vous versionnez plusieurs fichiers par entité.

### Décisions transverses (à trancher en implémentation)

- **Tenant unique par utilisateur (MVP)** : toutes les FK métier pointent vers `users.id`. Si vous ajoutez des **équipes / sociétés** plus tard, introduire une table **`organizations`** et déplacer les FK de `user_id` vers `organization_id` (migration plus lourde : à anticiper seulement si la roadmap multi-poste est proche).

- **Numérotation devis / factures** : champs dédiés par utilisateur ou par organisation, avec contrainte d’unicité ; souvent une table **`number_sequences`** ou colonnes sur un profil **entreprise** (à ajouter quand vous figez la conformité légale FR).

---

## Recommended Changes

**Bottom Line :** prévoir **au minimum quatre domaines de modélisation** (clients, devis, factures, agenda) en plus du socle existant, avec migrations Drizzle itératives alignées sur les écrans du blueprint.

### Decision #1 : Conserver le socle chat pour la transition

- **Problème :** le produit vise la gestion artisan ; `/chat` reste dans le template.  
- **Action :** ne pas supprimer `session_names` ni `user_usage_events` tant que l’assistant est exposé ; documenter qu’ils sont **héritage ADK**.  
- **Impact :** zéro régression sur l’existant ; le travail métier s’ajoute **à côté**.

### Decision #2 : Modèle métier normalisé (recommandé pour la TVA et les relances)

- **Problème :** lignes de devis / facture avec TVA et statuts (brouillon, envoyé, payé, en retard).  
- **Action :** tables **quotes / quote_lines** et **invoices / invoice_lines** avec montants en centimes ou décimaux selon convention projet, références client, statuts énumérés côté schéma ou texte contrôlé par l’app.  
- **Impact :** requêtes dashboard et conformité ultérieure (Factur-X) plus simples qu’un seul blob JSON.

### Decision #3 : Agenda comme entité première classe

- **Problème :** rendez-vous liés clients et chantiers (wireframe, blueprint).  
- **Action :** table dédiée avec `user_id`, `client_id` nullable, plage horaire, titre, notes ; index sur `(user_id, start_at)`.  
- **Impact :** synchro calendrier externe (phase 2) sans refondre le modèle.

### Decision #4 : Usage et paliers ReglePro vs chat

- **Problème :** les `event_type` actuels ciblent le chat.  
- **Option A :** étendre `user_usage_events` avec de nouveaux types (ex. `quote_created`, `invoice_sent`) pour les plafonds par tier.  
- **Option B :** métriques métier uniquement en base métier (comptages) et règles de quota dans les Server Actions.  
- **Recommandation :** **Option A** si les paliers Stripe doivent limiter des actions métier de la même manière que les messages ; **Option B** si les quotas restent centrés chat jusqu’à un rebranding complet des offres.

### Implementation Priority

1. **Phase 1 (MVP métier) :** `clients` ; `quotes` + lignes ; `invoices` + lignes ; `agenda_events` ; RLS Supabase par `user_id` sur toutes les nouvelles tables.  
2. **Phase 2 (croissance) :** pièces jointes structurées ; séquences de numérotation ; champs entreprise (SIRET, TVA intracom) ; lien facture ↔ paiement en ligne ; événements d’usage métier si besoin facturation à l’usage.

---

## Strategic Advantage

Le template **adk-agent-saas** vous donne déjà **identité, Stripe et gouvernance admin**, ce qui correspond à la couche SaaS du document maître. La dette utile est **centrée sur le domaine métier** : c’est prévisible pour un passage de **CompetitorAI** à **ReglePro**, et le schéma peut grandir **sans casser** les tables chat tant que l’assistant reste optionnel.

Points forts à exploiter :

- **Un utilisateur = un propriétaire de données métier** en MVP (simple à sécuriser en RLS).  
- **Stripe déjà branché** pour monétiser avant d’optimiser chaque rapport métier.  
- **Drizzle** : migrations versionnées pour ajouter les tables métier fichier par fichier (`npm run db:generate` après changement de schéma).

**Next Steps :** pièces jointes structurées, numérotation légale, Factur-X, événements d’usage métier si besoin.

> **Development Approach :** traiter `initial_data_schema.md` comme contrat évolutif : chaque sprint ajoute ou affine des tables en restant aligné avec `app_pages_and_functionality.md` et `wireframe.md`. Éviter les colonnes inutiles avant que l’écran correspondant existe.

---

## État implémenté ReglePro (synthèse 2026-04-09)

Les tables métier suivantes existent dans **`apps/web/lib/drizzle/schema/`** avec migrations Drizzle sous **`apps/web/drizzle/migrations/`** et politiques RLS documentées sous **`apps/web/supabase/policies/`** (à appliquer dans Supabase selon les instructions du projet).

### `clients`

- Lien **`user_id`** → `users`, champs identité / coordonnées / adresse (ville, CP, pays, etc.).
- **Import en masse** : pas de table dédiée ; parsing côté application (**`lib/clients/import-parse.ts`**) puis insert par lots via Server Action.

### `quotes` / `quote_lines`

- Devis par utilisateur, **`client_id`** optionnel, statuts (brouillon, envoyé, accepté, refusé, expiré), montants HT/TVA/TTC en centimes, lignes normalisées.

### `invoices` / `invoice_lines`

- Factures par utilisateur, **`client_id`**, **`quote_id`** optionnel (lien devis source), statuts (brouillon, envoyé, payé, en retard, annulé), montants comme les devis.
- Contrainte métier applicative : **au plus une facture** créée « depuis ce devis » pour un même `quote_id` (vérification dans **`createInvoiceFromQuote`**).

### `agenda_events`

- **`user_id`**, **`client_id`** optionnel, **`title`**, **`notes`**, **`location`**, **`start_at`**, **`end_at`**, timestamps.
- **Extension migration `0006_tan_cloak` :**
  - **`event_kind`** : `appointment` | `reminder` (défaut `appointment`).
  - **`typology`** : `site_visit` | `quote` | `work` | `admin` | `other` (défaut `other`) — utilisé pour le **style couleur** des rendez-vous ; les **rappels** ont un rendu UI distinct (icône / couleur) même si `typology` peut rester `other` côté persistance.

### Tableau de bord

- Aucune table dédiée : agrégations dans **`lib/queries/dashboard.ts`**.

---

## Mise à jour du document

Ce bloc **État implémenté** reflète le code au **2026-04-09**. En cas de nouvelle migration, mettre à jour cette section et **`roadmap.md`**.
