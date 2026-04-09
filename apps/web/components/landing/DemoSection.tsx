import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ArrowRight,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function DemoSection() {
  return (
    <section
      id="demo"
      className="py-32 px-4 bg-slate-50 dark:bg-slate-900 relative overflow-hidden"
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

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-all duration-300 text-sm">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-3 h-3" />
              Aperçu
            </div>
          </Badge>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            Votre{" "}
            <span className="text-primary">tableau de bord</span> artisan
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Une vision synthèse : devis en attente, factures à relancer,
            prochains rendez-vous. L’objectif du MVP ReglePro, en un coup d’œil.
          </p>
        </div>

        <div className="bg-slate-100/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-slate-200/50 dark:border-slate-700/50 mb-12">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Synthèse du jour
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Exemple illustratif • Artisan électricité • Mise à jour en temps réel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <div className="text-slate-600 dark:text-slate-400">
                Devis en attente de signature
              </div>
            </div>
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <div className="text-slate-600 dark:text-slate-400">
                Factures en retard
              </div>
            </div>
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-2">5</div>
              <div className="text-slate-600 dark:text-slate-400">
                Rendez-vous cette semaine
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-primary/5 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Activité récente
            </h4>
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 dark:bg-slate-700/70 rounded"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-700/70 rounded w-4/5"></div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              Prochaines actions
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
                    RDV chantier demain 9h
                  </h5>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/70 rounded w-5/6"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Relance facture n°2026-014
                  </h5>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/70 rounded w-4/5"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-white/80  dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl py-12 px-10 sm:p-12 border border-primary/10 dark:border-primary/20 shadow-2xl shadow-primary/5">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
            Rejoignez ReglePro et{" "}
            <span className="text-primary">centralisez votre gestion</span>
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Les écrans métier (clients, devis, factures, agenda) arrivent selon la
            feuille de route ; commencez par créer votre compte et suivre les
            mises à jour produit.
          </p>
          <Button
            size="default"
            asChild
            className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <Link href="/auth/sign-up">
              Créer mon compte
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
