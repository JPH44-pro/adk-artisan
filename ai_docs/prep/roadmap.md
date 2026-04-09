# ReglePro (adk-artisan) Development Roadmap

Roadmap séquentielle pour un **développeur solo**, générée selon `prep_templates/09_adk_generate_build_order.md` et les documents `ai_docs/prep/`.  
**Séquence choisie:** parcours **métier d’abord** (clients, devis, factures, agenda, tableau de bord), puis **assistant ADK** (héritage puis évolution), car la valeur produit ReglePro est la gestion artisan, pas l’analyse concurrentielle.

**Documentation synchronisée (2026-04-09) :** import clients, facture depuis devis, agenda (tuiles, typologies, rappels, dictée), historique chat en français — détail dans les phases 3 à 6 et 9 ci-dessous, et dans `app_pages_and_functionality.md`, `initial_data_schema.md`, `wireframe.md`.

**Note:** Ne pas dupliquer les tâches déjà couvertes par la procédure **`SETUP.md`** à la racine du dépôt (Supabase, Stripe, GCP, variables d’environnement). Le roadmap commence après un setup template supposé réalisé ou en cours.

---

## Analyse de fonctionnalités (étapes 4A à 4D, synthèse)

### Identification des fonctionnalités (4A)

**Depuis `app_pages_and_functionality.md` et documents associés**

- Landing publique `/` (hero, preuves, offres, CTA)
- Pages légales `/privacy`, `/terms`, `/cookies`
- Flux auth existants `/auth/*`
- Tableau de bord `/dashboard` (KPI, activité)
- Clients liste `/clients` et fiche `/clients/[clientId]`
- Devis liste `/devis` et édition `/devis/[quoteId]`
- Factures liste `/factures` et détail `/factures/[invoiceId]`
- Agenda `/agenda`
- Profil et facturation `/profile`
- Assistant héritage `/chat`, `/history` (ADK, à réorienter plus tard)

**Depuis `master_idea.md`**

- Relances, conformité long terme, mobile terrain (priorisation dans les phases)

### Catégorisation (4B)

- **CRUD / métier:** clients, devis, factures, agenda
- **Dashboard:** agrégation sur données métier
- **Agent:** assistant conversationnel (pattern agent, infra déjà présente)
- **Fondation SaaS:** landing, auth, profil, Stripe (largement template)

### Besoins base de données par fonctionnalité (4C)

- **Clients:** nouvelle table `clients` (FK `user_id`)
- **Devis:** tables `quotes` et lignes (FK client, user)
- **Factures:** tables `invoices` et lignes
- **Agenda:** table `agenda_events` (FK client optionnel, user)
- **Dashboard:** pas de table dédiée au départ (requêtes sur tables ci-dessus)
- **Chat:** tables template `session_names`, `user_usage_events` (conservées)

### Dépendances et ordre (4D)

- **Clients** avant devis, factures et rendez-vous liés client
- **Devis** avant conversion facture si le produit lie les deux
- **Agenda** peut suivre clients (besoin client optionnel)
- **Tableau de bord** après au moins une partie des données (devis, factures, agenda)
- **Assistant métier avancé** après API ou données métier si outils agents doivent les lire (phase ultérieure)

---

## Phase 0: Projet et socle (obligatoire en premier)

**Goal:** Aligner l’environnement et la compréhension du dépôt avant tout développement fonctionnel.

**Contexte:** Phase 0 non négociable selon le template ShipKit.

**Statut (2026-04-05):** carnet de bord **`ai_docs/prep/phase0_reglepro_baseline.md`**.

- [x] **Obligatoire:** parcourir **`SETUP.md`** à la racine avec un assistant **Gemini 2.5 Pro** en **mode max** (comme prescrit par le template) pour cartographier prérequis, variables et étapes déjà réalisées ou restantes *(instructions dans `phase0_reglepro_baseline.md` section 1 ; à cocher quand c’est fait)*
- [x] Confirmer les fichiers **`apps/web/.env.local`** et **`apps/competitor-analysis-agent/.env.local`** cohérents avec `SETUP.md` (sans recopier ici les valeurs secrètes) *(clés listées dans le carnet de bord ; vérifier les valeurs dans les dashboards)*
- [x] Confirmer **`npm run install`** ou équivalent monorepo exécuté, **`npm run dev`** ou scripts par app compris *(install exécuté avec succès ; scripts rappelés dans le carnet de bord)*
- [x] Lire **`CLAUDE.md`** et **`ai_docs/prep/system_architecture.md`** pour cadre technique unique *(synthétisé dans le carnet de bord)*
- [x] Noter dans un carnet de bord local les écarts entre template **CompetitorAI** et cible **ReglePro** (nom, routes, copy) *(section 6 de `phase0_reglepro_baseline.md`)*

---

## Phase 1: Landing et marketing public ReglePro

**Goal:** Un visiteur comprend ReglePro (artisan BTP, équité, pas marketplace à leads) et peut cliquer vers l’inscription.

### Contenu et structure

**[Goal: Aligner la page d’accueil sur `master_idea.md`, `app_pages_and_functionality.md`, `wireframe.md`, `app_name.md`.]**

- [x] Relire **`ai_docs/prep/app_pages_and_functionality.md`** (section Landing) et **`ai_docs/prep/wireframe.md`** (bloc Landing)
- [x] Mettre à jour **`apps/web/app/(public)/page.tsx`** et sections associées pour le message ReglePro (hero, bénéfices devis, factures, clients, agenda)
- [x] Intégrer le logo **`apps/web/public/logo.png`** et le thème décrit dans **`ai_docs/prep/ui_theme.md`**
- [x] Ajuster les CTA vers **`/auth/sign-up`** et lien connexion
- [x] Si le dépôt contient un guide du type **`ai_docs/templates/landing_page_generator.md`**, l’utiliser comme checklist de style (sinon s’appuyer sur les composants existants sous `components/`)

### Légal

**[Goal: Cohérence RGPD et mentions avec l’offre ReglePro.]**

- [x] Passer en revue **`apps/web/app/(public)/privacy/page.tsx`**, **`terms/page.tsx`**, **`cookies/page.tsx`** pour remplacer les références génériques ShipKit par **ReglePro** et le contexte données clients ou facturation

---

## Phase 2: Shell applicatif protégé ReglePro

**Goal:** Un utilisateur connecté voit une **coque** ReglePro (navigation, libellés, routes) même avant que les données métier soient pleines.

### Navigation et routes

**[Goal: Exposer les entrées du blueprint (`dashboard`, `clients`, `devis`, `factures`, `agenda`, `profile`, assistant optionnel).]**

- [x] Modifier **`apps/web/components/layout/AppSidebar.tsx`** (et layout protégé associé) pour intitulés ReglePro et liens vers `/dashboard`, `/clients`, `/devis`, `/factures`, `/agenda`, `/profile`, et `/chat` si l’assistant reste visible
- [x] Créer les routes placeholder sous **`apps/web/app/(protected)/`** pour chaque chemin ci-dessus avec page minimale « à venir » ou empty state explicite
- [x] Vérifier **`middleware.ts`** pour que les nouvelles routes protégées soient couvertes

### Profil et marque

**[Goal: Le compte et la facturation restent utilisables avec la nouvelle identité.]**

- [x] Adapter textes de **`apps/web/app/(protected)/profile/`** (ex. **`ProfilePageClient.tsx`**) pour ReglePro sans changer la logique Stripe existante

---

## Phase 3: Dossier clients (fonctionnalité complète)

**Goal:** L’utilisateur peut **créer, lister, filtrer et ouvrir une fiche client**.

### Données

**[Goal: Persistance clients isolée par utilisateur, prête pour RLS Supabase.]**

- [x] Ajouter le schéma Drizzle **`apps/web/lib/drizzle/schema/clients.ts`** (champs: identité, coordonnées, ville, métadonnées de recherche, `user_id` FK vers `users`)
- [x] Exporter le schéma dans **`apps/web/lib/drizzle/schema/index.ts`**
- [x] Lancer **`npm run db:generate`** puis **`npm run db:migrate`** depuis la racine du repo web (scripts package.json, pas `npx drizzle-kit` direct)
- [x] Définir les politiques RLS Supabase pour la table `clients` dans le tableau de bord Supabase ou fichiers SQL du projet (lecture et écriture par `auth.uid()`)

### Interface et actions

**[Goal: Parcours liste et fiche alignés wireframe.]**

- [x] Implémenter **`apps/web/app/(protected)/clients/page.tsx`** (recherche, liste paginée)
- [x] Implémenter **`apps/web/app/(protected)/clients/[clientId]/page.tsx`** (coordonnées, zone pour historique documents plus tard)
- [x] Créer **`apps/web/app/actions/clients.ts`** (ou équivalent) pour création, mise à jour, suppression avec validation Zod
- [x] Ajouter composants sous **`apps/web/components/clients/`** pour formulaires et lignes de liste
- [x] **Import CSV / Excel** : action serveur **`importClientsFromFile`** (`apps/web/app/actions/clients.ts`), parsing **`lib/clients/import-parse.ts`** (en-têtes FR/EN), limite taille / lignes ; dialogue **`ImportClientsDialog`** + modèle CSV sur la liste clients

---

## Phase 4: Devis (fonctionnalité complète)

**Goal:** L’utilisateur peut **gérer des devis** (statuts, lignes, totaux) pour un client.

### Données

**[Goal: Modèle devis et lignes lié client et utilisateur.]**

- [x] Ajouter schémas Drizzle **`quotes`** et **`quote_lines`** (ou nommage équivalent) avec statuts (brouillon, envoyé, accepté, refusé, expiré), montants, TVA selon règles MVP
- [x] Migrations via **`npm run db:generate`** et **`npm run db:migrate`**
- [x] RLS sur les nouvelles tables

### Interface et actions

**[Goal: Liste et éditeur utilisables sur desktop et utilisable au minimum sur mobile.]**

- [x] **`apps/web/app/(protected)/devis/page.tsx`** avec filtres par statut
- [x] **`apps/web/app/(protected)/devis/[quoteId]/page.tsx`** avec édition des lignes, totaux, lien client
- [x] Server actions **`apps/web/app/actions/devis.ts`** (création, duplication, changement de statut, enregistrement lignes)
- [x] **Facturation depuis devis** : action **`createInvoiceFromQuote`** dans **`apps/web/app/actions/factures.ts`** (devis **envoyé** ou **accepté**, pas de doublon facture pour le même `quote_id`) ; bouton **Créer une facture** / **Facturer** sur fiche devis et liste devis (**`CreateInvoiceFromQuoteButton`**, **`DevisTable`**)

---

## Phase 5: Factures (fonctionnalité complète)

**Goal:** L’utilisateur peut **émettre et suivre des factures** (statuts de paiement, aperçu, PDF ou lien plus tard).

### Données

**[Goal: Factures et lignes, lien optionnel vers devis accepté.]**

- [x] Ajouter schémas Drizzle **`invoices`** et **`invoice_lines`**
- [x] Migrations et RLS comme pour les devis *(SQL Supabase : `apps/web/supabase/policies/invoices_rls.sql` — à appliquer dans l’éditeur SQL comme pour clients/devis)*

### Interface et actions

**[Goal: Liste et détail conformes au wireframe.]**

- [x] **`apps/web/app/(protected)/factures/page.tsx`** et **`[invoiceId]/page.tsx`**
- [x] Actions serveur facturation dans **`apps/web/app/actions/factures.ts`**
- [x] Prévoir emplacement pour **PDF** (génération synchrone ou job ultérieur) sans bloquer la sauvegarde en base *(champ `pdf_storage_key`, UI placeholder dans l’éditeur)*

---

## Phase 6: Agenda (fonctionnalité complète)

**Goal:** L’utilisateur peut **poser et lister des rendez-vous** liés aux clients ou chantiers.

### Données

**[Goal: Événements agenda par utilisateur.]**

- [x] Table **`agenda_events`** (début, fin, titre, notes, lieu optionnel, `client_id` optionnel, `user_id`)
- [x] Migrations et RLS *(SQL Supabase : `apps/web/supabase/policies/agenda_events_rls.sql` — à appliquer dans l’éditeur SQL après migration **0005**)*

### Interface

**[Goal: Vue multi-semaines, tuiles, typologies et rappels.]**

- [x] **`apps/web/app/(protected)/agenda/page.tsx`** avec création et édition d’événements
- [x] **Grille calendrier** : **5 semaines** visibles (constante **`AGENDA_VISIBLE_WEEK_COUNT`** dans **`lib/agenda/week.ts`**), plage chargée en une requête ; navigation **`?week=`** par pas d’une semaine ; affichage **UTC** explicite
- [x] **Tuiles carrées** : une ligne d’en-têtes Lun–Dim, puis **une ligne par semaine** de **7 tuiles** (`aspect-square`), événements empilés dans la tuile avec défilement interne
- [x] **Survol** : infobulle (détail synthétique) ; **clic** sur un événement : dialogue d’édition / suppression
- [x] **Typologies** (`typology`) : visite chantier, devis/commercial, intervention, administratif, autre — **couleurs** distinctes (**`lib/agenda/event-meta.ts`**)
- [x] **Rappels** vs **rendez-vous** : colonne **`event_kind`** (`appointment` | `reminder`) — rappels : **icône cloche**, style **rose**, fin proposée à **+15 min** à la sélection « Rappel »
- [x] **Dictée** : Web Speech API (**`fr-FR`**), boutons micro sur titre, lieu et notes (**`lib/agenda/speech.ts`**) si le navigateur le permet
- [x] Migration Drizzle **`0006_tan_cloak`** : colonnes **`event_kind`**, **`typology`** sur **`agenda_events`**
- [x] Actions **`apps/web/app/actions/agenda.ts`**

---

## Phase 7: Tableau de bord synthèse

**Goal:** L’utilisateur voit **devis en attente, factures en retard, prochains rendez-vous** en un écran.

### Agrégation

**[Goal: Requêtes serveur sur tables existantes, pas de nouvelle entité obligatoire.]**

- [x] Implémenter **`apps/web/app/(protected)/dashboard/page.tsx`** avec cartes KPI et listes courtes alimentées par requêtes Drizzle (filtres par `user_id`, dates) *(agrégation dans **`lib/queries/dashboard.ts`** : devis `draft`/`sent`, factures en retard = statut `overdue` ou échéance passée pour `sent`/`draft`, RDV sur 30 jours + liste des 5 prochains)*

---

## Phase 8: Assistant ADK (héritage et préparation métier)

**Goal:** Le **service Python ADK** existant reste opérationnel pour `/chat` ; la base est posée pour un **assistant métier** (relances, rédaction) branché sur vos données quand vous le choisirez.

**Placement:** Après les entités métier pour permettre des **outils** agents qui lisent clients ou devis sans bloquer le MVP chat actuel.

### Conception et documentation

**[Goal: Traduire la vision produit en architecture d’agents sans casser l’existant.]**

- [ ] Lire **`ai_docs/dev_templates/agent_orchestrator.md`** et produire un document **`ai_docs/prep/reglepro_agent_workflow.md`** décrivant soit le maintien du graphe actuel, soit une cible **séquentielle** orientée métier (sans copier le template dans ce fichier roadmap)
- [ ] Noter les prérequis **API** si les agents doivent appeler le backend Next (secret partagé, routes dédiées) selon **`system_architecture.md`**

### Exploitation du code existant

**[Goal: Développement local et alignement des environnements.]**

- [ ] Suivre **`SETUP.md`** section agent pour **`apps/competitor-analysis-agent/`** (déjà prévu hors duplication ici)
- [ ] Démarrer l’agent en local avec la commande documentée dans **`CLAUDE.md`** ou **`SETUP.md`** pour valider le flux vers l’API **`apps/web/app/api/`** existante (`run`, `sessions`, etc.)

### Évolution (optionnelle selon priorité)

**[Goal: Première étape vers un assistant utile aux artisans.]**

- [ ] Pour une itération suivante, utiliser **`ai_docs/dev_templates/adk_task_template.md`** et **`adk_bottleneck_analysis.md`** pour découper les changements Python (nouveaux sous-agents, prompts français métier)

---

## Phase 9: Finitions et couverture des prep documents

**Goal:** Aucun oubli mineur des documents `ai_docs/prep/` (accessibilité copy, cohérence nom **ReglePro**, liens footer).

- [x] **Historique chat `/history`** : interface entièrement en **français** (titres, listes par période, dialogues renommer / supprimer, messages d’erreur côté actions et lib session-names pour les chemins utilisateur)
- [ ] Repasser **`ai_docs/prep/app_pages_and_functionality.md`** ligne par ligne et cocher les écarts résiduels (ex. `/history` vs futur historique métier)
- [ ] Mettre à jour chaînes utilisateur restantes dans **`components/billing/`** si elles mentionnent encore l’ancien positionnement produit
- [ ] Aligner **`apps/web/app/(public)/terms/page.tsx`** et **`privacy/page.tsx`** avec **`app_name.md`** si des mentions légales de marque sont requises

---

## Auto-critique du roadmap (obligatoire)

### Points forts

- Phases nommées par **résultat utilisateur** (clients, devis, factures, agenda, tableau de bord), pas par couche technique isolée
- Schéma et migrations **embarqués** dans la phase de la fonctionnalité concernée
- **Phase 0** et référence explicite à **`SETUP.md`** sans recopier les étapes Supabase ou Stripe
- Tâches formulées en **implémentation** (créer, modifier, ajouter) plutôt qu’en validation vague
- Phase **ADK** située **après** le métier pour coller à ReglePro tout en respectant l’idée de prérequis pour des futurs outils agents

### Points de vigilance

- **Phase 0** exige un outil externe (Gemini 2.5 Pro max) : c’est une contrainte du template, pas une tâche exécutable dans le seul repo ; à faire manuellement par le développeur
- **Agent:** le graphe **analyse concurrentielle** actuel n’est pas remplacé par cette roadmap ; la **Phase 8** est surtout documentation et préparation. Une refonte agent complète mériterait une roadmap dédiée une fois les API métier stables
- **Taille des phases:** devis et factures peuvent être longues pour une seule personne ; si besoin, découper en **sous-livraisons** internes (liste devis avant éditeur complet) tout en gardant une phase unique « Devis »
- **Chemins de templates:** `ai_docs/templates/landing_page_generator.md` n’existe pas dans ce dépôt ; la tâche pointe une alternative (composants existants)

### Recommandations de suivi

- Après chaque phase, **commit** avec message décrivant la fonctionnalité utilisateur débloquée
- Avant migration, toujours **`npm run db:generate`** via scripts du **`package.json`** racine ou `apps/web` selon convention du monorepo
- Revoir **`roadmap.md`** après le premier usage terrain pour ajuster priorités (relances auto, PDF, Factur-X)

---

*Document généré pour exécuter `prep_templates/09_adk_generate_build_order.md`. Prochaine étape logique: implémenter la Phase 0 puis enchaîner Phase 1.*
