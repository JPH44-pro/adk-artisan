import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "ReglePro est-il une marketplace qui prend un pourcentage sur mes chantiers ?",
    answer:
      "Non. ReglePro est un abonnement pour votre gestion quotidienne : devis, factures, dossier clients, agenda. On ne vous revend pas de chantiers et on ne prélève pas de pourcentage sur ce que vos clients vous paient — contrairement à certains sites qui vendent des contacts et prennent une commission sur les travaux.",
  },
  {
    question: "Quelles données sont traitées ?",
    answer:
      "Données de compte, données métier que vous saisissez (clients, devis, factures, agenda) et données techniques nécessaires au service (connexion, facturation Stripe). Voir la politique de confidentialité pour le détail RGPD.",
  },
  {
    question: "Puis-je utiliser ReglePro uniquement depuis le chantier ?",
    answer:
      "L’interface est pensée mobile first : objectif d’usage terrain pour consulter et saisir l’essentiel, avec une expérience complète au bureau.",
  },
  {
    question: "Y a-t-il un assistant IA inclus ?",
    answer:
      "Le dépôt technique inclut un module d’assistant (héritage template) évolutif vers un assistant métier (relances, rédaction). Le cœur produit reste la gestion artisan.",
  },
  {
    question: "Comment fonctionne la facturation ?",
    answer:
      "Les abonnements passent par Stripe (paiement récurrent, portail client). Les montants affichés sur la landing sont indicatifs : alignez-les sur votre grille tarifaire dans le tableau de bord Stripe.",
  },
  {
    question: "Puis-je résilier quand je veux ?",
    answer:
      "Les conditions exactes figurent dans les conditions d’utilisation et au moment du souscription Stripe. En général, vous gérez l’abonnement depuis votre espace ou le portail client Stripe.",
  },
  {
    question: "Le produit est-il conforme Factur-X ou aux obligations françaises ?",
    answer:
      "La roadmap prévoit la montée en conformité (Factur-X, numérotation) selon les priorités. Le MVP se concentre sur la valeur quotidienne avant les options les plus réglementaires.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="py-32 px-4 bg-slate-50 dark:bg-slate-900 relative"
    >
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" aria-hidden="true" />
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            Questions{" "}
            <span className="text-primary">
              fréquentes
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Réponses courtes sur l’offre ReglePro. Pour le détail juridique,
            consultez les pages légales.
          </p>
        </div>

        <div className="space-y-6 mb-20">
          <Accordion type="single" collapsible className="w-full space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-2xl px-6 py-1 hover:border-primary dark:hover:border-primary transition-all duration-300"
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-none"
                >
                  <AccordionTrigger className="text-left group-hover:text-primary text-base md:text-lg font-bold text-slate-800 dark:text-white hover:text-primary transition-colors duration-300 py-4 hover:no-underline items-center">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-300 leading-relaxed text-base pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>

        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Une autre question ?{" "}
            <a
              href="mailto:contact@reglepro.io"
              className="text-primary hover:underline font-medium"
            >
              Écrivez-nous
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
