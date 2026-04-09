# Vertex AI — configuration non prioritaire

**Date :** 2026-04-05

## Décision

Vertex AI (GCP) n’est **pas requis immédiatement** pour avancer. On validera **après** le démarrage des éléments préparatoires du projet si une configuration Vertex / `GOOGLE_CLOUD_*` complète est nécessaire.

## À revérifier plus tard

- [ ] Besoin réel de Vertex AI vs exécution locale / autre fournisseur pour l’agent.
- [ ] `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, `GOOGLE_CLOUD_STAGING_BUCKET` dans `apps/competitor-analysis-agent/.env.local`.
- [ ] APIs Vertex activées sur le projet GCP si on s’y engage.
- [ ] `gcloud auth application-default login` et alignement quota projet (`gcloud auth application-default set-quota-project`).
- [ ] `GEMINI_API_KEY` dans `apps/web/.env.local` (titres de session côté web, distinct de l’agent).

## Référence

Guide initial du template : `SETUP.md` — Phase 4 (Google Cloud Platform & Vertex AI).
