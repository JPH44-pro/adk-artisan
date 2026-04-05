import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const freePlanFeatures = [
  "1 AI chat session",
  "20 smart messages included",
  "Quick market insights",
  "Community support & resources",
];

const paidPlanFeatures = [
  "Everything in Free",
  "Unlimited chat sessions",
  "Unlimited messages",
  "Complete competitor analysis",
  "15+ page detailed report",
  "Generated in 10 minutes",
  "Priority support",
];

export default function PricingSection() {
  return (
    <section className="py-32 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
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

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            {"Simple, "}
            <span className="text-primary">{"transparent pricing"}</span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {
              "Professional competitive intelligence at a fraction of consultant costs. No hidden fees."
            }
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-14 items-stretch">
          <div className="w-full max-w-sm mb-16 flex">
            <Card className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700 border hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 rounded-3xl overflow-hidden flex flex-col w-full">
              {/* Card Background */}
              <div className="absolute inset-0 bg-slate-50/30 dark:bg-slate-700/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="text-center pb-6 relative z-10 pt-8">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-6xl font-bold text-slate-700 dark:text-slate-300">
                      {"$0"}
                    </span>
                    <span className="text-lg text-slate-500 dark:text-slate-400">
                      {"/month"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {"Perfect for getting started"}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-10 pb-8 relative z-10 flex flex-col flex-grow">
                {/* Free Plan Features List */}
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

                {/* CTA Button */}
                <div className="mt-auto">
                  <Button
                    variant="outline"
                    size="default"
                    asChild
                    className="w-full border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 py-3 text-base font-semibold rounded-xl transition-all duration-300"
                  >
                    <Link href="/profile">
                      Get Started Free
                      <ArrowRight strokeWidth={2} className="w-4 h-4" />
                    </Link>
                  </Button>

                  {/* Free Plan Note */}
                  <div className="text-center mt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                      <span>✨</span>
                      {"No credit card required"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full max-w-sm mb-16 flex relative group">
            {/* Most Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300 group-hover:-translate-y-1">
              <Badge className="bg-primary text-white text-xs px-3 py-1">
                {"Most Popular"}
              </Badge>
            </div>
            <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-primary/20 border-2 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 group-hover:-translate-y-1 rounded-3xl overflow-hidden flex flex-col w-full">
              {/* Card Background */}
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="text-center pb-6 relative z-10 pt-8">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <span className="text-6xl font-bold text-primary">
                      {"$9.99"}
                    </span>
                    <span className="text-lg text-slate-500 dark:text-slate-400">
                      {"/month"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {"Everything you need to succeed"}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="px-10 pb-8 relative z-10 flex flex-col flex-grow">
                {/* Paid Plan Features List */}
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

                {/* CTA Button */}
                <div className="mt-auto">
                  <Button
                    size="default"
                    asChild
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  >
                    <Link href="/profile">
                      Start Analysis
                      <ArrowRight strokeWidth={3} />
                    </Link>
                  </Button>

                  {/* Money Back Guarantee */}
                  <div className="text-center mt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
                      <span>🛡️</span>
                      {"30-day money-back guarantee"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Value Comparison */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-8">
            {"Compare the alternatives"}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                {"Consultants"}
              </h4>
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                {"$5,000+"}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {"6-12 weeks"}
              </p>
            </div>

            <div className="bg-primary/10 dark:bg-primary/20 backdrop-blur-sm rounded-xl p-6 border-2 border-primary/20 dark:border-primary/30 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white shadow-lg text-xs px-3 py-1">
                  {"Best Value"}
                </Badge>
              </div>
              <h4 className="text-lg font-bold text-primary mb-3">
                {"Our AI Agent"}
              </h4>
              <div className="text-2xl font-bold text-primary mb-2">
                {"$9.99"}
              </div>
              <p className="text-sm text-primary font-medium">{"10 minutes"}</p>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-600/50">
              <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                {"DIY Research"}
              </h4>
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                {"Free*"}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {"*100+ hours of your time"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
