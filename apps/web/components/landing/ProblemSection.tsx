import { Badge } from "@/components/ui/badge";
import { Clock, FileWarning, Wallet, AlertTriangle, Hammer } from "lucide-react";

const problems = [
  {
    icon: FileWarning,
    title: "Papier et fichiers dans tous les sens",
    description:
      "Devis dans un tableur, factures ailleurs, relances « de tête » : entre le camion et le bureau, l’info se perd et vous repassez deux fois la même chose.",
    impact: "Erreurs, doublons et soirées à rattraper l’admin",
  },
  {
    icon: Wallet,
    title: "La trésorerie, sans tableau clair",
    description:
      "Sans vue d’ensemble sur les factures et les relances, les retards de paiement s’empilent — et vous ne voyez pas tout de suite ce qui coince.",
    impact: "Encaissements qui traînent, stress en fin de mois",
  },
  {
    icon: Clock,
    title: "Rendez-vous et déplacements mal cadrés",
    description:
      "Imprévus, oublis, trajets mal enchaînés : quand l’agenda n’est pas au même endroit que le reste, ça vous coûte du temps et des kilomètres.",
    impact: "Créneaux perdus et journées plus longues qu’il ne faudrait",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-32 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" aria-hidden="true" />
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-red-500/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-red-500/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <Badge className="rounded-lg mb-6 bg-primary/10 dark:bg-primary/20 text-primary border-primary/25 dark:border-primary/40 hover:bg-primary/15 dark:hover:bg-primary/25 transition-all duration-300 text-sm">
            <div className="flex items-center gap-2">
              <Hammer className="w-3 h-3" />
              Ce que ReglePro vous apporte
            </div>
          </Badge>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            Un seul outil pour{" "}
            <span className="text-primary">
              vos devis, factures, clients et rendez-vous
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            ReglePro sert à faire tourner votre activité au quotidien : rédiger et
            suivre vos devis, émettre vos factures, tenir le dossier client et
            noter vos déplacements. Tarif en abonnement lisible.
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8 mb-20">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 dark:hover:bg-slate-900/70 transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-500/10 dark:bg-red-500/20 rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-red-500" />
                    </div>
                  </div>

                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                        {problem.title}
                      </h3>
                      <div className="text-center sm:text-right text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Frein #{index + 1}
                      </div>
                    </div>

                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {problem.description}
                    </p>

                    <div className="inline-flex items-center gap-3 bg-red-50 dark:bg-red-950/30 rounded-xl px-4 py-2 border border-red-200/50 dark:border-red-800/50">
                      <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                        {problem.impact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl py-12 px-10 sm:p-12 border border-primary/10 dark:border-primary/20 shadow-2xl shadow-primary/5">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6">
              Moins de dispersion,{" "}
              <span className="text-primary">plus de temps sur le métier</span>
            </h3>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Vous gardez la main sur vos prix et vos chantiers : ReglePro ne vous
              vend pas de « contacts » et ne prend pas sa part sur vos factures.
              L’objectif, c’est un carnet de gestion propre, du premier devis à la
              dernière relance.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <FileWarning className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-base sm:text-lg">Tout au même endroit</div>
                  <div className="text-sm sm:text-base opacity-75">devis, factures, clients</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-base sm:text-lg">Prix carré</div>
                  <div className="text-sm sm:text-base opacity-75">abonnement, pas de % sur vos chantiers</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-base sm:text-lg">Sur le terrain</div>
                  <div className="text-sm sm:text-base opacity-75">utilisable au chantier comme au bureau</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
