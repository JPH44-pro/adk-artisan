## Page Navigation & Routes — ReglePro (adk-artisan)

Document de référence **aligné sur l’app actuelle** (`apps/web`, App Router).  
*Ancienne version du fichier (inbox, plateformes, etc.) : template générique obsolète ; remplacée le 2026-04-09.*

Pour la vision fonctionnelle détaillée, voir aussi **`app_pages_and_functionality.md`** et **`wireframe.md`**.

---

### Routes publiques (non authentifié)

| Chemin | Rôle |
|--------|------|
| `/` | Landing ReglePro |
| `/privacy` | Politique de confidentialité |
| `/terms` | CGU |
| `/cookies` | Cookies |

---

### Auth (groupe `(auth)`)

| Chemin | Rôle |
|--------|------|
| `/auth/login` | Connexion |
| `/auth/sign-up` | Inscription |
| `/auth/forgot-password` | Mot de passe oublié |
| `/auth/sign-up-success` | Confirmation inscription |
| `/auth/update-password` | Mise à jour mot de passe |
| `/auth/error` | Erreur auth |

---

### Application protégée (`(protected)`)

Barre latérale : tableau de bord, clients, devis, factures, agenda, assistant (chat), profil.

| Chemin | Rôle |
|--------|------|
| `/dashboard` | Synthèse KPI (devis, factures, RDV) |
| `/clients` | Liste, recherche, pagination, **import CSV/Excel** |
| `/clients/[clientId]` | Fiche client |
| `/devis` | Liste, filtres, **Facturer** (devis envoyé/accepté) |
| `/devis/[quoteId]` | Édition devis, statuts, **créer facture**, dupliquer |
| `/factures` | Liste, filtres |
| `/factures/[invoiceId]` | Édition facture (lien `quote_id` si issu d’un devis) |
| `/agenda` | Grille **5 semaines**, tuiles 7×5, typologies, rappels, dictée ; `?week=YYYY-MM-DD` |
| `/profile` | Compte, abonnement Stripe, usage |
| `/chat`, `/chat/[[...sessionId]]` | Assistant ADK (héritage) |
| `/history` | Historique des sessions chat (**interface française**) |

---

### API (exemples)

| Chemin | Rôle |
|--------|------|
| `/api/webhooks/stripe` | Webhooks facturation |
| Autres routes | Selon template (agent, run, sessions) — voir `app/api/` |

---

### Middleware

Les routes sous `(protected)` exigent une session Supabase valide (voir `middleware.ts` / client Supabase du projet).

---

### Paramètres d’URL notables

- **`/agenda?week=YYYY-MM-DD`** : ancre la **première semaine visible** (lundi UTC de la semaine contenant la date), sur **5 semaines** glissantes.

---

*Mise à jour : 2026-04-09.*
