# Génération de logo ReglePro (ChatGPT / image)

*Généré le 2026-04-05 selon `prep_templates/04_chatgpt_logo_generation.md`.*

## Contexte extrait des fichiers projet

| Élément | Valeur |
|--------|--------|
| **Nom** | **ReglePro** (reglepro.io) |
| **Fonction cœur** | Aider les artisans et TPE du bâtiment à **chiffrer, facturer, gérer l’agenda et suivre les clients** depuis le terrain (SaaS, pas marketplace à leads). |
| **Personnalité** | **Pro**, fiable, **terrain**, sobre ; crédibilité « outil de métier ». |
| **Couleur primaire (thème Professionnel)** | Bleu institutionnel **#2B6CEE** (équivalent HSL `220 85% 55%`). Accent possible **#638FE9** (primaire mode sombre `220 75% 65%`) pour dégradés légers. |

---

## 10 propositions de prompts (à coller dans ChatGPT ou un générateur d’icônes)

*Les prompts sont en **anglais** (meilleure cohérence avec les modèles d’image). Inclure les hex pour guider la couleur.*

### Décomposé : métaphore fonctionnelle (4)

1. **Devis + mesure**  
   *"Minimal app icon: a stylized metal ruler overlapping the corner of a clean document sheet, subtle fold on the paper; single accent line suggesting a quote total; flat vector style; primary blue (#2B6CEE) with soft gradient to lighter blue (#638FE9); generous white space; no text."*

2. **Agenda chantier**  
   *"App icon: three stacked rounded rectangles like calendar day cards, slightly offset, with a small checkmark cutout on the top card; conveys scheduling and follow-up; geometric and calm; colors blue (#2B6CEE) and cool gray; minimalist; no text."*

3. **Dossier client**  
   *"Simple folder silhouette made of two overlapping translucent panels, front panel slightly brighter blue (#2B6CEE), back panel softer (#638FE9); suggests centralized client file; glass-like subtle transparency; rounded corners; Apple-style simplicity; no text."*

4. **Précision / trait**  
   *"Abstract precision mark: a short horizontal bar with evenly spaced tick marks like a ruler scale, paired with a single soft circle node at the end suggesting 'done'; clean geometry; blue (#2B6CEE) on very light gray-blue background feel; icon fills the square; no text."*

### Monogramme (3)

5. **R stylisée**  
   *"Lettermark app icon: bold letter R with a notch or cut on the right stem inspired by a ruler edge; single color blue (#2B6CEE); geometric sans; high legibility at small size; centered; rounded square canvas feel; no extra words."*

6. **RP compact**  
   *"Monogram combining R and P in one compact shape, shared vertical stroke, professional tech aesthetic like a finance or B2B app; flat; blue (#2B6CEE) with optional subtle inner highlight; no text beyond the letters."*

7. **R dans cadre**  
   *"Letter R inside a rounded square frame with 2px-equivalent inner margin; frame and letter same blue (#2B6CEE); suggests certification and 'rule'; minimal; Swiss-inspired; no subtitle."*

### Motifs type SnapAI (3)

8. **Rectangles superposés**  
   *"Three overlapping semi-transparent rounded rectangles with soft gradients from blue (#2B6CEE) to lighter blue (#638FE9), stacked depth effect, gentle blur at edges; abstract app icon; centered; no text."*

9. **Cercles concentriques**  
   *"Stylized target or measurement rings: three concentric circles, even spacing, center dot; gradient blue (#2B6CEE) to pale blue; crisp vector; suggests accuracy; no text."*

10. **Carte + onde**  
   *"Soft glass-like rounded square with subtle inner glow, a single wave or pulse line across the middle suggesting activity or reminder; blue (#2B6CEE) tones; modern SaaS; no text."*

---

## Recommandations

| Rang | Option | Pourquoi |
|------|--------|----------|
| **Top choix** | **1** (règle + document) | Aligné avec le nom **ReglePro** (*règle* + *pro*), lisible, métier immédiat pour artisans. |
| **Fort second** | **5** (R + encoche) | Très scalable en favicon ; marque reconnaissable seule. |
| **Choix sûr** | **8** (rectangles superposés) | Pattern éprouvé, pro, peu risqué ; moins spécifique métier. |

**Public :** artisans souvent sur mobile : privilégier **formes simples** et **contraste** (options 1, 5, 7).

---

## Commande ChatGPT prête à l’emploi (format SnapAI)

À utiliser après avoir choisi **un** numéro ci-dessus. Exemple avec **l’option 1** :

```
Create a full-bleed 1024x1024 px app icon: Minimal app icon: a stylized metal ruler overlapping the corner of a clean document sheet, subtle fold on the paper; single accent line suggesting a quote total; flat vector style; primary blue (#2B6CEE) with soft gradient to lighter blue (#638FE9); generous white space; no text. Use crisp, minimal design with vibrant colors. Add a subtle inner bevel for gentle depth; no hard shadows or outlines. Center the design with comfortable breathing room from the edges. Solid, light-neutral background. IMPORTANT: Fill the entire canvas edge-to-edge with the design, no padding, no margins. Design elements should be centered with appropriate spacing from edges but the background must cover 100% of the canvas. Clean, minimal, Apple-style design. No borders, frames, or rounded corners.
```

*Pour une autre option, remplacer le paragraphe descriptif par le prompt correspondant (1 à 10).*

**Affiner la couleur :**  
`Use #2B6CEE as the exact primary blue for all main shapes.`

---

## Suite : favicon, UI, fichier statique

Suivre **à la lettre** la partie pratique du template `04_chatgpt_logo_generation.md` :

1. Télécharger l’image depuis ChatGPT.  
2. **realfavicongenerator.net** (preset Next.js) → `favicon.ico` + `apple-icon.png` dans `apps/web/app/`.  
3. Variante **fond transparent** pour `public/logo.png` (message ChatGPT fourni dans le template).  
4. Rafraîchissement forcé du navigateur si le favicon ne bouge pas.

**Chemins dans ce monorepo :** `apps/web/app/` et `apps/web/public/` (adapter si votre app web est bien `apps/web`).

---

## Note sur la couleur

Le hex **#2B6CEE** est dérivé du HSL du thème **Professionnel** (`220 85% 55%`). Si le rendu image diffère, reprendre la commande d’ajustement hex du template.
