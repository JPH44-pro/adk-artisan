# Phase 0 : socle projet (terminée)

**Date:** 2026-04-05 (mise à jour pointeur doc : 2026-04-09)  
**Référence:** `ai_docs/prep/roadmap.md` (section Phase 0).  
**Suite du produit documentée** : phases 3–7 et extensions récentes (import clients, facture depuis devis, agenda avancé, `/history` FR) dans **`roadmap.md`** et **`app_pages_and_functionality.md`**.

---

## 1. Lecture SETUP.md avec Gemini 2.5 Pro (mode max)

**Statut:** accompli par analyse de `SETUP.md`.

**Synthèse des phases de `SETUP.md` :**
1. **Prérequis :** Node.js 18+, Python 3.10+, `uv`, `gcloud CLI`, `stripe CLI`.
2. **Supabase :** Projet, URLs, clés (anon/service_role), base de données (mot de passe temporaire à sauvegarder dans `.env.local`), configuration Auth (redirect URL `/auth/confirm`), modèles d'e-mails, exécution des migrations (`npm run db:generate/migrate`) et création du trigger de création d'utilisateur (`auth.users` -> `public.users`).
3. **Application web :** Test de fonctionnement (login/signup).
4. **Google Cloud / Vertex AI :** Projet GCP, facturation, activation APIs Vertex AI, authentification locale (`gcloud auth application-default login`), création clé API Gemini.
5. **Agent ADK :** Test de l'agent en local (connexion cloud, Vertex).
6. **Stripe :** Création compte, produit d'abonnement "Pro Plan" (ex: $9.99/mois), récupération Price ID, clés API (Publishable, Secret), URL portail client, et écoute des webhooks en local (`stripe listen`).
7. **Test End-to-End :** Vérification complète front, auth, chat, facturation, historique de conversation.

**Variables d'environnement attendues** :  
Toutes les variables requises (listées dans la section 3 ci-dessous) correspondent exactement à la configuration requise par les phases de `SETUP.md`. L'utilisateur doit s'assurer de les renseigner manuellement.

*(Pas d'action supplémentaire dans la roadmap, le setup est considéré comme acquis/maîtrisé avant d'attaquer la Phase 1).*

---

## 2. Dépendances npm (`npm run install`)

**Statut:** exécuté avec succès à la racine du monorepo.

- **Commande:** `npm run install` (alias `install:backend` puis `install:frontend`)
- **Backend:** `uv sync --all-extras` dans `apps/competitor-analysis-agent`
- **Frontend:** `npm install` dans `apps/web`
- **Note npm:** avertissements `Unknown env config "devdir"` (environnement local) ; `npm audit` signale des vulnérabilités à traiter plus tard si besoin

---

## 3. Fichiers d’environnement (sans valeurs secrètes)

Les fichiers **`apps/web/.env.local`** et **`apps/competitor-analysis-agent/.env.local`** sont présents.

**Clés détectées dans `apps/web/.env.local`:**  
`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_PAID_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CUSTOMER_PORTAL_URL`, `NEXT_PUBLIC_APP_URL`, `ADK_URL`, `GOOGLE_SERVICE_ACCOUNT_KEY_BASE64`

**Clés détectées dans `apps/competitor-analysis-agent/.env.local`:**  
`DATABASE_URL`, `GOOGLE_GENAI_USE_VERTEXAI`, `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GOOGLE_CLOUD_STAGING_BUCKET`, `AGENT_NAME`, `MODEL`, `MAX_ITERATIONS`

**Alignement avec les exemples:** les jeux de clés recouvrent **`apps/web/.env.local.example`** et **`apps/competitor-analysis-agent/.env.local.example`**. Valider manuellement que les **valeurs** (URLs, secrets) correspondent aux projets Supabase, Stripe et GCP réels.

---

## 4. Scripts et commandes utiles (rappel)

D’après **`package.json`** (racine) et **`CLAUDE.md`:**

- `npm run dev` : front Next.js + API ADK en parallèle
- `npm run dev:frontend` : seulement `apps/web`
- `npm run dev:api` : seulement API Python ADK
- `npm run db:generate` / `npm run db:migrate` : Drizzle (toujours via ces scripts, pas `npx drizzle-kit` direct)

---

## 5. Cadre technique (lecture effectuée)

- **`CLAUDE.md`** : stack Next.js 15, Supabase, Drizzle, Stripe, ADK Python dans `apps/competitor-analysis-agent`
- **`ai_docs/prep/system_architecture.md`** : extensions ReglePro (Server Actions, tables métier), ADK en service séparé, stockage Supabase pour PJ

---

## 6. Écarts template CompetitorAI → cible ReglePro (carnet de bord)

**Produit et marque**

- Positionnement actuel du template : **analyse concurrentielle** et chat orienté recherche
- Cible : **ReglePro** (reglepro.io), SaaS **artisans / BTP** : devis, factures, clients, agenda, équité tarifaire (pas marketplace à leads)

**Routes et navigation**

- À introduire ou renforcer : `/dashboard`, `/clients`, `/clients/[clientId]`, `/devis`, `/devis/[quoteId]`, `/factures`, `/factures/[invoiceId]`, `/agenda`
- Héritage : `/chat`, `/history` (ADK) jusqu’à réorientation ou retrait du parcours principal

**Données**

- Tables actuelles : `users`, `session_names`, `user_usage_events`
- À ajouter : tables métier (clients, devis, factures, agenda) selon `initial_data_schema.md`

**Assistant IA**

- Graphe Python actuel : **competitor analysis** (plan, recherche, rapport)
- Vision long terme : **assistant métier** (relances, rédaction) ou réduction du rôle du chat dans le parcours

**Copie et légal**

- Remplacer progressivement textes **ShipKit / CompetitorAI** par **ReglePro** (landing, terms, privacy, emails si applicable)

---

## 7. Suite

**Phase 1 du roadmap:** landing et marketing public ReglePro (`ai_docs/prep/roadmap.md`).
