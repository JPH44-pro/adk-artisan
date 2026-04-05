import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  ArrowRight,
  FileText,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function DemoSection() {
  return (
    <section className="py-32 px-4 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
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
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15 transition-all duration-300 text-sm">
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              Sample Report
            </div>
          </Badge>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            {"See what "}
            <span className="text-primary">{"competitive intelligence"}</span>
            {" looks like"}
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {
              "Professional competitor analysis delivered in 10 minutes. Here's what a real competitive intelligence report contains."
            }
          </p>
        </div>

        {/* Report Preview - Simple Layout */}
        <div className="bg-slate-100/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-slate-200/50 dark:border-slate-700/50 mb-12">
          {/* Report Header */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Competitive Intelligence Report
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Generated in 8 minutes • ProjectFlow SaaS • 14 competitors
              analyzed
            </p>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-2">14</div>
              <div className="text-slate-600 dark:text-slate-400">
                Competitors Mapped
              </div>
            </div>
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-2">$340M</div>
              <div className="text-slate-600 dark:text-slate-400">
                Untapped Market
              </div>
            </div>
            <div className="text-center p-6 bg-white/90 dark:bg-slate-800 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-2">31%</div>
              <div className="text-slate-600 dark:text-slate-400">
                Competitor Churn Rate
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-white dark:bg-primary/5 rounded-2xl p-6 mb-8">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Competitive Landscape Summary
            </h4>
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 dark:bg-slate-700/70 rounded"></div>
              <div className="h-4 bg-slate-100 dark:bg-slate-700/70 rounded w-4/5"></div>
            </div>
          </div>

          {/* Key Insights */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-800 dark:text-white">
              Strategic Insights
            </h4>

            <div className="space-y-3">
              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Market Gap Identified
                  </h5>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/70 rounded w-5/6"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Competitive Weakness Spotted
                  </h5>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/70 rounded w-4/5"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-800 dark:text-white mb-2">
                    Pricing Strategy Insight
                  </h5>
                  <div className="space-y-1">
                    <div className="h-3 bg-slate-100 dark:bg-slate-700/70 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white/80  dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl py-12 px-10 sm:p-12 border border-primary/10 dark:border-primary/20 shadow-2xl shadow-primary/5">
          <h3 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
            {"Get your competitive intelligence report in "}
            <span className="text-primary">10 minutes</span>
          </h3>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            {
              "This is just a preview. Your full report includes detailed competitor profiles, pricing analysis, feature comparison, positioning recommendations, and strategic go-to-market insights."
            }
          </p>
          <Button
            size="default"
            asChild
            className="bg-primary hover:bg-primary/90 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
          >
            <Link href="/auth/sign-up">
              Analyze My Competition
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
