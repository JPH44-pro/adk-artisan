import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How accurate is the competitive analysis?",
    answer:
      "Our AI agent uses multiple data sources including public company information, market research databases, and real-time web analysis to provide comprehensive insights. While no analysis is 100% complete, our reports typically identify 90%+ of relevant competitors and provide market-validated data points.",
  },
  {
    question: "How is this different from doing Google research myself?",
    answer:
      "Our AI agent processes hundreds of sources simultaneously, analyzes market data systematically, and presents insights in a structured format. What would take you weeks of manual research, we deliver in minutes with professional-grade analysis and strategic recommendations.",
  },
  {
    question: "What if my idea is really new or unique?",
    answer:
      "Even for innovative ideas, competitive analysis is crucial. We look beyond direct competitors to analyze adjacent markets, substitute solutions, and potential future competitors. This helps you understand the broader competitive landscape and identify opportunities for differentiation.",
  },
  {
    question: "Is my business idea kept confidential?",
    answer:
      "Absolutely. We take privacy seriously. Your business ideas, analysis results, and any data you share are completely confidential and never shared with third parties. We use enterprise-grade security to protect your information.",
  },
  {
    question: "What if I'm not satisfied with the report?",
    answer:
      "We offer a 30-day money-back guarantee. If the analysis doesn't provide valuable insights for your startup idea, we'll refund your subscription fee, no questions asked.",
  },
  {
    question: "How often can I run new analyses?",
    answer:
      "With your subscription, you can analyze as many different ideas as you want. Many founders use it to evaluate multiple concepts before deciding which one to pursue, or to analyze different market segments for the same idea.",
  },
  {
    question: "What format do I receive the analysis in?",
    answer:
      "You'll receive a comprehensive PDF report (typically 15-20 pages) that includes an executive summary, competitor profiles, market analysis, differentiation opportunities, risk assessment, and strategic recommendations. Perfect for sharing with co-founders or investors.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="py-32 px-4 bg-slate-50 dark:bg-slate-900 relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" aria-hidden="true" />
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-800 dark:text-white mb-8">
            {"Frequently "}
            <span className="text-primary">
              {"asked questions"}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {
              "Got questions? We've got answers. Here are the most common questions from startup founders."
            }
          </p>
        </div>

        {/* FAQ Accordion */}
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

        {/* Still have questions CTA */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {"Still have questions? "}
            <a
              href="mailto:support@competitorai.com"
              className="text-primary hover:underline font-medium"
            >
              Contact us
            </a>
            {" - we'll get back to you within 24 hours."}
          </p>
        </div>
      </div>
    </section>
  );
}
