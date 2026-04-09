# Rapport d’analyse de thème UI

*Généré le : 2026-04-05 | Application : **ReglePro** (reglepro.io)*

## Synthèse du contexte projet

**Finalité produit :** SaaS pour artisans et TPE du bâtiment en France : devis, facturation, dossier client, agenda et relances, avec une promesse **d’équité** (pas une marketplace à commissions) et une montée en puissance **client final / avis** plus tard.

**Public cible :** Artisans indépendants et micro-entreprises, souvent **mobile first** sur chantier.

**Personnalité de marque :** Fiable, pro, **terrain**, transparent sur les prix ; crédibilité avec institutions (CMA) et conformité (RGPD).

**Secteur :** Logiciels métiers BTP / artisanat (concurrence : Tolteck, Obat, ChantierFlow, ArtisanPro, etc.), dominée par les **bleus** et outils « devis / facture ».

**Positionnement concurrentiel :** Le nom **ReglePro** évoque **règle** (mesure, rigueur) et **pro** : la direction **« acier / atelier »** (bleu acier 205°) renforce cette lecture sans tomber dans l’orange « grand public chantier » en couleur primaire.

---

## Les quatre directions de couleur

### 1. Direction professionnelle (confiance) • Score : 24 / 25

- **Couleur primaire :** Bleu institutionnel (clair : `220 85% 55%`, sombre : `220 75% 65%`).
- **Rationale :** Réassurance sur l’argent, les engagements et la conformité ; codes B2B éprouvés.
- **Exemples de marché :** Linear, Monday, nombreux SaaS pro.
- **Adapté à :** Première vente auprès d’artisans méfiants, image « banque / assurance » du sérieux.
- **Accessibilité :** Primaire sur fond clair et sombre avec neutres **teintés bleu** (mode sombre : fond `220 15% 8%`, muted `220 12% 15%`, bordure `220 10% 18%`).
- **Pour :** Lisibilité immédiate « outil pro ».
- **Contre :** Peu différenciant vs concurrents français déjà très bleus.

### 2. Direction tech & innovation • Score : 20 / 25

- **Couleur primaire :** Violet (clair : `260 90% 58%`, sombre : `260 80% 68%`).
- **Rationale :** Modernité logicielle, « produit qui innove ».
- **Exemples :** Slack, Figma (nuances proches).
- **Adapté à :** Storytelling plateforme et intégrations futures (IA, paiement).
- **Accessibilité :** Neutres **teintés violet** en sombre (`260 18% 7%`, etc.).
- **Pour :** Différenciation visuelle forte.
- **Contre :** Moins « chantier / matériau » ; peut sembler moins « sérieux comptable » pour une partie du public artisan.

### 3. Direction équilibrée (accessible) • Score : 22 / 25

- **Couleur primaire :** Teal (clair : `180 75% 45%`, sombre : `180 65% 58%`).
- **Rationale :** Calme, clarté, moins froid qu’un bleu pur ; bon compromis humain / pro.
- **Exemples :** Outils SaaS grand public orientés productivité.
- **Adapté à :** Onboarding doux, utilisateurs peu habitués au SaaS.
- **Accessibilité :** Neutres **teintés vert-bleu** (`180 12% 9%`, etc.).
- **Pour :** Équilibre large.
- **Contre :** Moins spécifique « BTP France ».

### 4. Direction contextuelle « acier & atelier » (recommandée pour la marque ReglePro) • Score : 24 / 25

- **Couleur primaire :** Bleu acier (clair : `205 70% 46%`, sombre : `205 65% 54%`). Même teinte, ajustement léger de luminosité pour le contraste.
- **Rationale :** Évoque **l’outil**, la **précision**, le métal, le chantier sans l’orange signalisation en primaire ; cohérent avec **ReglePro** (règle, exactitude).
- **Insight secteur :** Différenciation vs bleus « génériques » 220° tout en restant dans les codes **confiance**.
- **Psychologie audience :** Artisans sensibles au **matériau** et au **bon geste** ; le ton reste **pro** et français.
- **Accessibilité :** Fonds sombres **teintés 205°** (`205 18% 8%`, muted `205 14% 14%`, bordures `205 12% 18%`). États : succès `128 72% 42%`, avertissement **ambre chantier** `38 92% 54%`, erreur `4 78% 52%`.
- **Pour :** Alignement nom + image **atelier** ; neutres légèrement teintés pour cohérence marque.
- **Contre :** Nécessite un bon **slogan** pour expliquer la nuance vs « un bleu de plus ».

---

## Tableau comparatif

| Direction | Primaire (aperçu) | Message | Idéal pour |
|-----------|-------------------|---------|------------|
| Professionnel | Bleu 220° | Confiance, sérieux | Vente conservative, conformité |
| Tech | Violet 260° | Innovation | Roadmap IA, intégrations |
| Équilibré | Teal 180° | Accessible | Adoption large, moins technique |
| **Contexte acier** | **Bleu acier 205°** | **Précision, atelier, marque** | **Alignement ReglePro + différenciation** |

---

## Matrice de décision (scores indicatifs sur 5)

| Critère | Pro | Tech | Équilibré | Acier |
|---------|-----|------|-----------|-------|
| Adéquation secteur | 5 | 3 | 4 | 5 |
| Appel audience | 5 | 4 | 5 | 4 |
| Avantage différenciant | 3 | 5 | 4 | 5 |
| Cohérence ReglePro | 4 | 3 | 4 | 5 |
| Scalabilité long terme | 5 | 5 | 5 | 5 |
| **Total** | **22** | **20** | **22** | **24** |

**Recommandation de travail :** ouvrir **`ai_docs/prep/theme.html`** dans le navigateur, tester les **quatre** cartes et le **basculement clair / sombre**. En l’absence d’avis contraire, la direction **« Contexte artisan (acier) »** (schéma 4) est le meilleur compromis **score + nom + différenciation**. La direction **Professionnel** reste le **choix de repli** si vous privilégiez le classique « bleu outil » maximal.

---

## Implémentation CSS (à appliquer après choix confirmé)

**Important :** aucune modification n’a été faite dans `apps/web/app/globals.css` ni dans `tailwind.config.ts` tant que vous n’avez pas **validé** une direction (phase 5 du template). Une fois le choix arrêté, recopier les variables **:root** et **.dark** du schéma retenu depuis `theme.html` vers `globals.css` et vérifier les mappings Tailwind.

### Exemple : variables pour la direction « acier » (schéma 4)

```css
/* Mode clair */
:root {
  --primary: 205 70% 46%;
  --primary-foreground: 0 0% 98%;
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --muted: 205 12% 96%;
  --muted-foreground: 240 3.8% 46.1%;
  --border: 205 10% 90%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --secondary: 205 10% 96%;
  --secondary-foreground: 240 5.9% 10%;
  --destructive: 4 78% 52%;
  --destructive-foreground: 0 0% 98%;
  /* Ajouter success / warning si utilisés côté app */
}

.dark {
  --primary: 205 65% 54%;
  --primary-foreground: 0 0% 96%;
  --background: 205 18% 8%;
  --foreground: 0 0% 96%;
  --muted: 205 14% 14%;
  --muted-foreground: 205 10% 64%;
  --border: 205 12% 18%;
  --card: 205 18% 8%;
  --card-foreground: 0 0% 96%;
  --secondary: 205 14% 14%;
  --secondary-foreground: 0 0% 96%;
  --destructive: 4 72% 56%;
  --destructive-foreground: 0 0% 98%;
}
```

*(Compléter avec les jetons shadcn existants du projet : `ring`, `input`, `accent`, etc., pour rester aligné sur la stack actuelle.)*

---

## Psychologie et message

**Impact émotionnel (direction acier) :** sérieux, calme, contrôle ; le bleu acier évite la froideur d’un bleu corporate trop « open-space ».

**Message de marque :** « On cadre le métier » (devis, relances, dossier) sans afficher une couleur agressive.

**Différenciation :** Moins « startup violet », moins « générique 220° », tout en restant dans les codes lisibles pour un **outil de facturation**.

---

## Validation d’implémentation (checklist)

- [ ] Combinaisons texte / fond vérifiées (objectif **WCAG AA** minimum, **AAA** si possible sur corps de texte).
- [ ] Cohérence **clair / sombre** : la primaire doit être **reconnue comme la même teinte** (même teinte H, saturation proche).
- [ ] Cohérence **marque** avec ReglePro et supports imprimés futurs.
- [ ] **Secteur** : crédible pour un artisan qui compare avec Tolteck / Obat.
- [ ] **Évolutivité** : déclinaisons marketing, icônes, illustrations.

---

## Système de fonds

- **Fond principal (`--background`) :** aires de contenu, shell applicatif.
- **Fond secondaire (`--muted`) :** bandeaux, lignes alternées, zones de liste.
- **Stratégie :** deux niveaux de fond pour hiérarchiser devis, timeline chantier et navigation sans surcharger.

---

## Décision finale et implémentation

**Choix validé :** direction **Professionnel** (schéma 1), bleu institutionnel `220 85% 55%` (clair) / `220 75% 65%` (sombre), neutres mode sombre teintés bleu.

**Fichier mis à jour :** `apps/web/app/globals.css` (variables `:root` et `.dark`, sidebar, chat, graphiques, `::selection`). Les classes Tailwind existantes (`bg-primary`, etc.) continuent de pointer sur `hsl(var(--primary))` : **aucun changement requis** dans `tailwind.config.ts`.

**Date d’application :** 2026-04-05

---

## Étapes suivantes

1. **Logo / marketing** : reprendre la primaire **220 85% 55%** pour la cohérence visuelle.
2. **Suite prep** : modèle `04_chatgpt_logo_generation.md` ou équivalent si vous enchaînez le branding.

---

## Fichiers livrés par cette étape

| Fichier | Rôle |
|---------|------|
| `ai_docs/prep/theme.html` | Comparaison interactive des 4 schémas (texte d’interface en français) |
| `ai_docs/prep/ui_theme.md` | Ce rapport, synthèse et recommandation |
| `apps/web/app/globals.css` | Thème **Professionnel** appliqué en production dev |
