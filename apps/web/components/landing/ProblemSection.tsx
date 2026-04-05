import { Badge } from "@/components/ui/badge";
import { Clock, HelpCircle, Target, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: HelpCircle,
    title: "You Don't Know Your Real Competitors",
    description:
      "You think you know who you're competing against, but you're missing indirect competitors, emerging players, and market alternatives that could blindside you.",
    impact: "Launch into a market you don't understand",
  },
  {
    icon: Target,
    title: "Your Positioning is Just Guesswork",
    description:
      "Without deep competitive intelligence, you're guessing at your differentiation strategy and hoping it resonates with customers.",
    impact: "Compete on the wrong battleground",
  },
  {
    icon: Clock,
    title: "Research Takes Forever and Goes Nowhere",
    description:
      "You spend weeks digging through websites, reviews, and reports but end up with fragmented insights that don't form a clear strategy.",
    impact: "Delay launch while competitors move faster",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-32 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" aria-hidden="true" />
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-red-500/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-red-500/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge className="rounded-lg mb-6 bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-400 hover:bg-red-100 dark:hover:bg-red-950/70 transition-all duration-300 text-sm">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" />
              The Competitor Blind Spot Problem
            </div>
          </Badge>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            {"Most entrepreneurs are "}
            <span className="text-red-500">
              {"flying blind"}
            </span>
            {" about competitors"}
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            {
              "Whether you're starting a new business or growing an existing one, operating without comprehensive competitive intelligence means making critical strategic decisions based on incomplete information."
            }
          </p>
        </div>

        {/* Problems List - Different Layout */}
        <div className="space-y-6 sm:space-y-8 mb-20">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 dark:hover:bg-slate-900/70 transition-all duration-300 border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-red-500/10 dark:bg-red-500/20 rounded-2xl flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-red-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4 mb-4">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">
                        {problem.title}
                      </h3>
                      <div className="text-center sm:text-right text-slate-500 dark:text-slate-400 text-sm font-medium">
                        Problem #{index + 1}
                      </div>
                    </div>
                    
                    <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {problem.description}
                    </p>

                    {/* Impact */}
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

        {/* Solution Tease - Simplified */}
        <div className="relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl py-12 px-10 sm:p-12 border border-primary/10 dark:border-primary/20 shadow-2xl shadow-primary/5">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6">
              {"Stop flying blind. "}
              <span className="text-primary">
                {"Start competing smart."}
              </span>
            </h3>

            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              {
                "Get comprehensive competitive intelligence in 10 minutes, not 10 weeks. Know your competitors, understand your market position, and identify the opportunities that will set you apart."
              }
            </p>

            {/* Key Benefits - Mobile Responsive */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-base sm:text-lg">Complete Intel</div>
                  <div className="text-sm sm:text-base opacity-75">All competitors mapped</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-base sm:text-lg">Clear Positioning</div>
                  <div className="text-sm sm:text-base opacity-75">Know how to differentiate</div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="font-bold text-base sm:text-lg">Fast Results</div>
                  <div className="text-sm sm:text-base opacity-75">10 minutes, not weeks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}