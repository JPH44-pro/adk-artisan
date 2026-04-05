import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Target,
  TrendingUp,
  Shield,
  Clock,
  Lightbulb,
  Users,
  ArrowRight,
  Zap,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Map Your Competitive Landscape",
    description:
      "Discover direct and indirect competitors you never knew existed. Get detailed profiles of their strengths, weaknesses, and market positioning.",
    outcome: "Complete competitive visibility",
    badge: "Discovery",
  },
  {
    icon: Target,
    title: "Find Your Unique Position",
    description:
      "Analyze exactly how your offering differs from competitors and identify the specific angles where you can win in the market.",
    outcome: "Clear differentiation strategy",
    badge: "Positioning",
  },
  {
    icon: Lightbulb,
    title: "Spot Market Gaps",
    description:
      "Identify underserved customer segments and opportunities your competitors are missing or ignoring completely.",
    outcome: "Untapped market opportunities",
    badge: "Opportunity",
  },
  {
    icon: TrendingUp,
    title: "Track Competitive Trends",
    description:
      "Understand market momentum, pricing strategies, and feature evolution across your competitive landscape.",
    outcome: "Strategic market insights",
    badge: "Intelligence",
  },
  {
    icon: Shield,
    title: "Assess Competitive Threats",
    description:
      "Understand which competitors pose the biggest threat to your business and how to defend your market position.",
    outcome: "Defensive strategy clarity",
    badge: "Risk Analysis",
  },
  {
    icon: Clock,
    title: "Get Intelligence Fast",
    description:
      "Professional-grade competitive analysis delivered in 10 minutes, not weeks of manual research and guesswork.",
    outcome: "Immediate strategic clarity",
    badge: "Speed",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-32 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" aria-hidden="true" />
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            {"Turn competitive intelligence "}
            <span className="text-primary">
              {"into strategic advantage"}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
            {
              "Whether you're validating a new business idea or optimizing an existing one, get the competitive insights you need to win in your market."
            }
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={index}
                className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/50 hover:border-primary/30 dark:hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 rounded-2xl overflow-hidden h-full flex flex-col"
              >
                {/* Card Subtle Background */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <CardHeader className="pb-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <Badge className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/20 text-sm font-medium">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 relative z-10 flex-1 flex flex-col">
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-lg flex-1">
                    {feature.description}
                  </p>

                  {/* Outcome Section */}
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10 dark:border-primary/20 mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">💡</span>
                      </div>
                      <p className="text-sm font-semibold text-primary">
                        {feature.outcome}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="relative group">
            {/* Background Subtle Glow */}
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

            <div className="relative bg-white/80  dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl py-12 px-10 sm:p-12 border border-primary/10 dark:border-primary/20 shadow-2xl shadow-primary/5">

              <h3 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-6">
                {"Ready to uncover your "}
                <span className="text-primary">
                  {"competitive blind spots?"}
                </span>
              </h3>

              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {
                  "Join hundreds of founders and business owners who have gained strategic clarity with professional competitive intelligence."
                }
              </p>

              {/* Feature Highlights */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-24 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">10-minute</div>
                    <div className="text-sm opacity-75">analysis</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Strategic</div>
                    <div className="text-sm opacity-75">insights</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-700 dark:text-slate-300">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Competitive</div>
                    <div className="text-sm opacity-75">intelligence</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-8">
                <Button
                  size="default"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold rounded-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
                >
                  <Link href="/auth/sign-up">
                    Start Your Analysis
                    <ArrowRight className="!h-4 !w-4 sm:!h-5 sm:!w-5" strokeWidth={2.5} />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}