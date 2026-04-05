import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | ADK Agent SaaS",
    default: "ADK Agent SaaS: AI-Powered Competitor Analysis Platform",
  },
  description:
    "AI-powered competitor analysis platform. Transform your market research with intelligent insights and strategic analysis powered by Google's Agent Development Kit.",
  keywords: [
    "AI Competitor Analysis",
    "Market Research",
    "Business Intelligence",
    "Strategic Analysis",
    "ADK Agent",
    "Competitive Intelligence",
    "Market Insights",
    "Agent Development Kit",
    "AI Platform",
    "Business Analysis",
    "Market Strategy",
    "Research Assistant",
  ],
  openGraph: {
    title: "ADK Agent SaaS: AI-Powered Competitor Analysis Platform",
    description:
      "AI-powered competitor analysis platform. Transform your market research with intelligent insights and strategic analysis powered by Google's Agent Development Kit.",
    url: new URL(defaultUrl),
    siteName: "ADK Agent SaaS",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "ADK Agent SaaS - AI-powered competitor analysis platform showing market insights and strategic analysis.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADK Agent SaaS: AI-Powered Competitor Analysis Platform",
    description:
      "AI-powered competitor analysis platform. Transform your market research with intelligent insights and strategic analysis.",
    images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const generateLegalMetadata = (
  title: string,
  description: string
): Metadata => {
  return {
    title: `${title} | ADK Agent SaaS`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | ADK Agent SaaS`,
      description,
      type: "website",
    },
  };
};
