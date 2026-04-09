## Wireframe Reference Doc

### ASCII / Markdown Mock-ups

```text
Landing ReglePro  `/`  (layout public)
+----------------------------------------------------------+
|  [Navbar : logo ReglePro + Connexion / Essai / S'inscrire] |
+----------------------------------------------------------+
|  [Hero : promesse poste de pilotage artisan, pas marketplace] |
|  [CTA principal vers inscription]                        |
|----------------------------------------------------------|
|  [Blocs : devis, factures, dossier client, agenda]     |
|  [Rappel paliers abonnement : gratuit, standard, pro]    |
|  [Preuve sociale ou témoignages si prévu]                |
+----------------------------------------------------------+
|  [Footer : liens légal + contact]                        |
+----------------------------------------------------------+

Pages légales  `/privacy`  `/terms`  `/cookies`
+----------------------------------------------------------+
|  [Navbar : logo + retour accueil]                        |
+----------------------------------------------------------+
|  [Titre page]                                            |
|  [Corps texte RGPD / CGU / cookies, dernière mise à jour] |
+----------------------------------------------------------+
|  [Footer]                                                |
+----------------------------------------------------------+

Auth  (sans sidebar, centré)  `/auth/login`  `/auth/sign-up`  etc.
+---------------------------------------------+
|  [Logo ReglePro]                           |
|  [Formulaire : email, mot de passe]         |
|  [OAuth si activé]                         |
|  [Liens : mot de passe oublié, créer compte] |
|  [Messages erreur / succès selon route]     |
+---------------------------------------------+

Layout app protégée ReglePro  (shell commun)
+----------------------------------------------------------+
| [Sidebar]              | [En-tête mobile si breakpoint]   |
| +------------------+   | +------------------------------+ |
| | Logo ReglePro    |   | | Zone contenu principale       | |
| |                  |   | | (défilement vertical)         | |
| | Nav :            |   | |                               | |
| | • Tableau de bord|   | |                               | |
| | • Clients        |   | |                               | |
| | • Devis          |   | |                               | |
| | • Factures       |   | |                               | |
| | • Agenda         |   | |                               | |
| | • Assistant (opt)|   | |                               | |
| | • Profil         |   | |                               | |
| +------------------+   | +------------------------------+ |
| | Bas : thème      |   |                                  |
| |     déconnexion  |   |                                  |
| | [Usage abonnement|   |                                  |
| |  si pertinent]   |   |                                  |
| +------------------+   |                                  |
+----------------------------------------------------------+

Dashboard  `/dashboard`
+----------------------------------------------------------+
| [Sidebar]              | [Titre : Tableau de bord]        |
|                        |                                  |
|                        | [Rangée tuiles KPI]              |
|                        |  • Devis en attente signature    |
|                        |  • Factures en retard            |
|                        |  • Prochains RDV (aperçu)        |
|                        |                                  |
|                        | [Liste ou flux : activité récente] |
|                        |                                  |
|                        | [Raccourcis : nouveau devis,    |
|                        |  nouveau client]                 |
+----------------------------------------------------------+

Liste clients  `/clients`
+----------------------------------------------------------+
| [Sidebar]              | [Titre + Nouveau client + Importer|
|                        |  CSV/Excel]                      |
|                        | [Barre recherche + pagination]   |
|                        | [Table : nom, ville, …]          |
+----------------------------------------------------------+

Fiche client  `/clients/[clientId]`
+----------------------------------------------------------+
| [Sidebar]              | [Fil d'Ariane + nom client]      |
|                        | [Onglets ou sections :]          |
|                        |  • Coordonnées + édition         |
|                        |  • Historique chantiers / devis  |
|                        |  • Documents / PJ (placeholder)  |
|                        | [Actions : nouveau devis,        |
|                        |  appel rapide si prévu]          |
+----------------------------------------------------------+

Liste devis  `/devis`
+----------------------------------------------------------+
| [Sidebar]              | [Titre + Nouveau devis]          |
|                        | [Filtres statut]                 |
|                        | [Table + colonne Facturer si     |
|                        |  envoyé/accepté → facture]       |
|                        | [Pagination]                     |
+----------------------------------------------------------+

Édition devis  `/devis/[quoteId]`
+----------------------------------------------------------+
| [Sidebar]              | [En-tête : titre, statut,        |
|                        |  Créer une facture si OK statut, |
|                        |  dupliquer, supprimer]           |
|                        | [Bloc client lié]                |
|                        | [Tableau lignes, totaux, notes]  |
+----------------------------------------------------------+

Liste factures  `/factures`
+----------------------------------------------------------+
| [Sidebar]              | [Titre + émission si prévu]     |
|                        | [Filtres : payé, en retard, etc.]|
|                        | [Liste avec montants et statuts] |
|                        | [Pagination]                     |
+----------------------------------------------------------+

Détail facture  `/factures/[invoiceId]`
+----------------------------------------------------------+
| [Sidebar]              | [Récap facture + statut paiement] |
|                        | [Aperçu type facture]            |
|                        | [Boutons : PDF, lien paiement    |
|                        |  si Stripe activé]               |
|                        | [Relances : lien ou état]        |
+----------------------------------------------------------+

Agenda  `/agenda`
+----------------------------------------------------------+
| [Sidebar]              | [Titre + Nouvel événement]       |
|                        | [Nav semaine + plage 5 semaines] |
|                        | [Légende : RDV / rappel / types] |
|                        | [Lun…Dim en-tête]                |
|                        | [5 × 7 tuiles carrées : jour +   |
|                        |  pastilles colorées ; survol =   |
|                        |  infobulle ; clic = édition]     |
|                        | [Formulaire : rappel vs RDV,     |
|                        |  typologie, micro dictée]        |
+----------------------------------------------------------+

Profil et facturation  `/profile`
+----------------------------------------------------------+
| [Sidebar]              | [Sections :]                     |
|                        |  • Compte et préférences         |
|                        |  • Abonnement et palier          |
|                        |  • Portail Stripe (lien externe) |
|                        |  • Usage / quotas si affichés    |
+----------------------------------------------------------+

Héritage template  `/chat`  et  `/chat/[[...sessionId]]`
+----------------------------------------------------------+
| [Sidebar adaptée]      | [Zone conversation]              |
|                        | [Messages + saisie + envoi]      |
|                        | (À réorienter assistant métier   |
|                        |  ou retirer du parcours principal)|
+----------------------------------------------------------+

Historique template  `/history`
+----------------------------------------------------------+
| [Sidebar]              | [Historique — titres FR]         |
|                        | [Groupes : Aujourd’hui, Hier,    |
|                        |  Cette semaine, Plus anciennes]  |
|                        | [Renommer / supprimer session]   |
|                        | (Fusion historique métier plus   |
|                        |  tard selon produit)             |
+----------------------------------------------------------+
```

### Navigation Flow Map

```
Public
/ → /privacy  ||  /terms  ||  /cookies

Auth
/auth/sign-up → /auth/sign-up-success → /dashboard  (cible)
              → (ou /chat tant que dashboard métier absent)

/auth/login → /dashboard  (cible)
            → (ou /chat en transition)

/auth/forgot-password → retour login
/auth/update-password → /dashboard ou /login selon flux
/auth/error → /auth/login ou retry

Protégé (vision ReglePro)
/dashboard → /clients → /clients/[clientId]
          → /devis → /devis/[quoteId]
          → /factures → /factures/[invoiceId]
          → /agenda
          → /profile  (abonnement, Stripe)
          → /chat  (optionnel, héritage)
          → /history (optionnel, héritage)

Détail métier
/clients/[clientId] → /devis/[quoteId]  (nouveau devis lié)
                    → /agenda  (RDV liés)

/devis/[quoteId] → /factures/[invoiceId]  (conversion facture, phase produit)

Admin plateforme  (phase 2, hors MVP)
/ → /admin/...  (garde rôle opérateur)
```
