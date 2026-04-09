import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const freePlanFeatures = [
  "Entrée de gamme pour tester la valeur",
  "Volume limité de devis ou de clients (selon paliers)",
  "Accès aux fonctions cœur en découverte",
  "Support par ressources en ligne",
];

const paidPlanFeatures = [
  "Tout le périmètre gratuit",
  "Flux métier étendu (devis, factures, clients, agenda)",
  "Sessions et messages assistant selon offre",
  "Facturation Stripe et portail client",
  "Évolutions produit prioritaires",
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-32 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            Tarifs{" "}
            <span className="text-primary">simples et lisibles</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Un abonnement SaaS, pas de commission sur vos chantiers. Les paliers
            gratuits, standard et pro évoluent avec la roadmap (voir document
            produit).
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-14 items-stretch">
          <div className="w-full max-w-sm mb-16 flex">
            <Card className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 border hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-3xl overflow-hidden flex flex-col w-full">
              <div className="absolute inset-0 bg-slate-50/30 dark:bg-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="text-center pb-6 relative z-10 pt-8">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-6xl font-bold text-slate-700 dark:text-slate-300">
                      0 €
                    </span>
                    <span className="text-lg text-slate-500 dark:text-slate-400">
                      / mois
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Pour démarrer et valider l’usage
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-10 pb-8 relative z-10 flex flex-col flex-grow">
                <div className="space-y-3 mb-6 flex-grow">
                  {freePlanFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    variant="outline"
                    size="default"
                    asChild
                    className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 text-base font-semibold rounded-xl transition-all duration-300"
                  >
                    <Link href="/auth/sign-up">
                      Commencer gratuitement
                      <ArrowRight strokeWidth={2} className="w-4 h-4" />
                    </Link>
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                      <span>✨</span>
                      Sans carte bancaire pour l’essai
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full max-w-sm mb-16 flex relative group">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300 group-hover:-translate-y-1">
              <Badge className="bg-primary text-white text-xs px-3 py-1">
                Le plus choisi
              </Badge>
            </div>
            <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-primary/20 border-2 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group-hover:-translate-y-1 rounded-3xl overflow-hidden flex flex-col w-full">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="text-center pb-6 relative z-10 pt-8">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-6xl font-bold text-primary">
                      9,99 €
                    </span>
                    <span className="text-lg text-slate-500 dark:text-slate-400">
                      / mois
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Formule Pro (exemple Stripe, ajuster selon votre catalogue)
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-10 pb-8 relative z-10 flex flex-col flex-grow">
                <div className="space-y-3 mb-6 flex-grow">
                  {paidPlanFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-300 text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  <Button
                    size="default"
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  >
                    <Link href="/auth/sign-up">
                      Passer à Pro
                      <ArrowRight strokeWidth={3} />
                    </Link>
                  </Button>

                  <div className="text-center mt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                      <span>🛡️</span>
                      Satisfait ou remboursé selon conditions affichées au checkout
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-8">
            Pourquoi pas une marketplace à leads ?
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                Tableur / courrier
              </h4>
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                Gratuit*
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                *Des heures perdues et des oublis
              </p>
            </div>

            <div className="bg-primary/10 dark:bg-primary/20 backdrop-blur-sm rounded-xl p-6 border-2 border-primary/20 dark:border-primary/30 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white shadow-lg text-xs px-3 py-1">
                  Bon compromis
                </Badge>
              </div>
              <h4 className="text-lg font-bold text-primary mb-3">
                ReglePro
              </h4>
              <div className="text-2xl font-bold text-primary mb-2">
                Abonnement
              </div>
              <p className="text-sm text-primary font-medium">Pas de % sur le chantier</p>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                Places à leads
              </h4>
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                Commission
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Souvent opaque sur la marge
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
