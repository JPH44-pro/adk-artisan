## Document maître (Master Idea)

**Contexte :** Ce document suit `prep_templates/01_generate_master_idea.md` et reprend l’analyse métier de `Doctolib de l'artisan.pdf` (mars 2026). Il définit la vision produit d’une plateforme pour **les métiers de l’artisanat et du bâtiment en France**. L’implémentation technique pourra réutiliser ou adapter la stack existante (Next.js, Supabase, agents IA optionnels) dans les étapes de préparation ultérieures.

**Point de situation technique (2026-04-09) :** le dépôt **adk-artisan** (marque **ReglePro**) implémente déjà le cœur **MVP gestion** : clients (dont **import CSV/Excel**), devis, factures (dont **émission depuis devis**), **agenda** multi-semaines (tuiles, **rappels**, **typologies** colorées, **dictée** navigateur), tableau de bord. L’écran **Historique** des sessions chat est **en français**. Détail des fichiers, migrations et routes : **`roadmap.md`**, **`app_pages_and_functionality.md`**, **`initial_data_schema.md`**, **`system_architecture.md`**, **`page_navigation_routes.md`**.

### Objectif final

Le produit aide **les artisans et travailleurs indépendants français** (électriciens, plombiers, jardiniers, plaquistes, et métiers assimilés) à obtenir **une planification fiable, une gestion de la relation client et des devis / factures plus rapides** grâce à une **plateforme d’exploitation centrée SaaS** (sur le modèle de ce qui a fait le succès de Doctolib : **agenda, rappels et flux métier**, et non « un intermédiaire de leads de plus »). La **prise de rendez-vous côté client** et les **avis vérifiés** sont **secondaires** : ils interviennent **après** que l’artisan tire chaque jour une valeur concrète des outils de gestion.

### Problème spécifique

Les artisans et les très petites entreprises du secteur sont bloqués parce que **le marché est saturé de places de marché à leads et d’outils superficiels**, alors que **leurs vraies douleurs** ne sont pas traitées de bout en bout : **charge administrative lourde** (devis, factures, relances), **retards de paiement et tension de trésorerie**, **planification et déplacements chaotiques**, **réputation en ligne fragile**, **contraintes réglementaires** (labels type RGE, assurances, déclarations), et **recouvrement** des sommes dues. Cela se traduit par **du temps perdu sur les chantiers**, **des milliers d’euros** de chiffre d’affaires impayé ou retardé, et **une défiance** envers les plateformes qui prélevent **des commissions élevées** (parfois 20 à 30 % sur les chantiers obtenus via leur canal).

### Types d’utilisateurs

#### Utilisateurs principaux : artisans indépendants et micro-entreprises

- **Qui :** Travailleurs seuls ou très petites structures dans le bâtiment et services associés (construction, entretien, espaces verts), en général moins de 10 salariés, souvent **mobile first**.
- **Frustrations :**
  - Administration et paperasse à la main ou éclatées entre plusieurs outils
  - Factures impayées et recouvrement difficile
  - Agenda ingérable, rendez-vous non honorés ou changements de dernière minute sans suivi structuré
  - Difficulté à collecter et afficher des **avis clients vérifiés**
  - Méfiance envers « une plateforme de leads de plus » avec des frais opaques ou abusifs
- **Objectifs urgents :**
  - Produire devis et factures **vite** (objectif : quelques minutes, pas des heures)
  - Centraliser **l’historique client et chantier** pour ancrer l’usage (sur le principe d’un dossier centralisé, comme chez Doctolib côté soins)
  - Réduire les absences et l’impayé grâce aux **rappels** et à des étapes de paiement claires
  - Afficher une marque **crédible et équitable** : prix transparents, pas de prélèvement caché sur leur marge

#### Utilisateurs secondaires : clients finaux (particuliers, petites entreprises)

- **Qui :** Personnes qui réservent ou demandent des travaux à des artisans.
- **Frustrations :** Disponibilité peu claire, prix peu lisibles, aucun endroit unique pour confirmer un rendez-vous ou payer un acompte.
- **Objectifs urgents :** Réservation simple, communication claire, paiement sécurisé optionnel (acompte ou solde).

#### Administrateurs système / opérateurs de plateforme

- **Qui :** Équipe produit et opérations qui pilote le SaaS.
- **Frustrations :** Besoin de visibilité sur l’usage, la facturation, les abus et le support sans exposer les données des artisans.
- **Objectifs urgents :** Configurer les offres et plafonds, suivre la santé du service, maîtriser les coûts, rester alignés avec le **RGPD** et les attentes françaises en matière d’hébergement des données et de confiance.

### Modèle économique et stratégie de revenus

- **Type de modèle :** **Abonnement SaaS** au cœur du modèle (vertueux, récurrent), **pas** un positionnement « marketplace d’abord commission ».

- **Structure tarifaire (indicative, alignée sur l’analyse du PDF) :**
  - **Gratuit ou entrée de gamme :** Projets ou utilisateurs limités, suffisant pour prouver la valeur et embarquer (ex. nombre de devis ou de clients plafonné par mois).
  - **Standard (ordre de grandeur 30 à 40 €/mois) :** Flux métier complet pour un artisan ou une petite équipe.
  - **Pro (autour de 49 €/mois dans le benchmark du PDF) :** **Réservation en ligne**, **paiement**, **réputation** (avis vérifiés), plafonds plus élevés.
  - **Optionnel plus tard :** **Frais de paiement** modiques sur les encaissements (ex. 0,5 à 1 %) en cohérence avec la valeur créée ; **leads payants optionnels** (opt-in, à l’unité) seulement une fois le SaaS « collant » ; **visibilité fournisseurs B2B** ou **produits financiers en affiliation** dans les années suivantes (comme esquissé dans le PDF).

- **Logique de revenus :** Le récurrent correspond au besoin quotidien d’administration et de **gestion d’agenda** ; évite le récit des **commissions prédatrices** qui détruisent la confiance ; s’aligne sur la logique « **logiciel d’abord, distribution ensuite** » à la Doctolib.

### Fonctionnalités cœur par rôle (MVP)

Aligné sur **la phase 1 (mois 1 à 6)** du PDF : un **outil indispensable** que l’artisan ne peut plus lâcher après quelques semaines.

- **Artisan (principal)**
  - Créer et envoyer **devis** et **factures** rapidement, avec lignes, TVA et statuts cohérents
  - **Dossier client central** : contact, historique des chantiers, pièces, photos avant/après
  - **Signature électronique** sur les devis lorsque pertinent (différenciant vs impression)
  - **Expérience mobile** (PWA acceptable en MVP) : utilisable sur chantier, avec parcours **tolérants hors-ligne** dans la mesure du possible pour la lecture et la saisie minimale
  - Vue simple **chantier / agenda** reliée aux clients et aux devis

- **Client final (MVP léger)**
  - Recevoir et ouvrir les devis, signer si besoin, voir les modalités de paiement (la réservation 100 % autonome peut rester en phase 2)

- **Admin plateforme**
  - Gestion des abonnements et offres, analyses de base, outils de support

### Principales user stories

#### Artisan

1. **Devis en quelques minutes**  
   *En tant qu’*artisan,  
   *je souhaite* construire et envoyer un devis à partir de modèles et de chantiers passés,  
   *afin de* passer moins de soirées sur l’admin et conclure plus vite.

2. **Historique client unique**  
   *En tant qu’*artisan,  
   *je souhaite* un seul endroit pour les chantiers, messages et documents de chaque client,  
   *afin de* ne jamais perdre le fil entre deux passages.

3. **Relances sans y penser**  
   *En tant qu’*artisan,  
   *je souhaite* des rappels pour les interventions à venir et les devis non signés,  
   *afin de* réduire les lapins et les relances oubliées.

#### Client final

1. **Prochaine étape claire**  
   *En tant que* client,  
   *je souhaite* voir le devis et comment l’accepter ou payer un acompte,  
   *afin que* les travaux démarrent sans enchaîner les appels manqués.

#### Système / arrière-plan

1. **Conservation et conformité des données**  
   *Lorsque* des factures et données personnelles sont stockées,  
   *le système* applique des contrôles d’accès et une durée de conservation alignés sur le RGPD et les attentes des artisans.

2. **Valeur d’usage durable**  
   *Lorsque* l’artisan utilise le produit quotidiennement,  
   *le système* enregistre un historique structuré (clients, devis, chantiers) pour augmenter le coût de changement de manière légitime.

### Fonctions à valeur ajoutée (avancé, feuille de route du PDF)

- **Phase 2 (mois 6 à 12) :** **Rappels** automatiques avant chantier, **relances** devis non signés, **demandes d’avis** après intervention, **paiements en ligne** intégrés (acomptes et soldes), réduction plus forte de l’impayé.
- **Phase 3 (mois 12 à 18) :** **Profil public** avec avis **vérifiés**, **agenda en ligne** visible par les clients, **mise en relation active** seulement lorsque suffisamment d’artisans tournent déjà sur le logiciel (contenu réel plutôt qu’annuaire vide).
- **Différenciation :** Message du type **pas de commission prédatrice sur la valeur des chantiers** (contraste avec les marketplaces à forte commission) ; **confiance** via les **CMA**, les organisations professionnelles et les réseaux locaux ; **souveraineté numérique** et **labels** (ex. numérique responsable, RSE) comme atouts de confiance à long terme pour les institutions et les acheteurs publics.
- **Go-to-market (hors périmètre code MVP, contexte produit) :** Lancer sur **une région** ou une ville d’abord ; démos **terrain** ; partenariats type **CMA** et **programme national d’accompagnement au numérique** ; **contenu communautaire** avant publicité payante massive.

### Contrôle d’alignement

- L’objectif final, le problème et le périmètre MVP sont **alignés** avec le PDF : **opérations SaaS d’abord**, **économie équitable**, **contexte artisanat français**, **fonctions marketplace plus riches ensuite**.
- Les livrables de préparation ultérieurs (wireframes, modèle de données, architecture) devront s’appuyer sur ce document et **mapper explicitement** les fonctionnalités du template (ex. chat ou agents) vers les **flux métiers artisans** lorsque le produit l’exige.
