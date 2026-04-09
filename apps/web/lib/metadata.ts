import type { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    template: "%s | ReglePro",
    default: "ReglePro — Gestion pour artisans et TPE du bâtiment",
  },
  description:
    "Devis, factures, dossier clients et agenda : un outil de gestion pour artisans et très petites entreprises du bâtiment, avec un abonnement clair.",
  keywords: [
    "ReglePro",
    "artisan",
    "BTP",
    "devis",
    "factures",
    "gestion",
    "TPE",
    "agenda",
    "clients",
    "SaaS",
  ],
  openGraph: {
    title: "ReglePro — Gestion pour artisans et TPE du bâtiment",
    description:
      "Devis, factures, clients et agenda au même endroit. Pensé pour le terrain et le bureau.",
    url: new URL(defaultUrl),
    siteName: "ReglePro",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "ReglePro — logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReglePro — Gestion pour artisans et TPE du bâtiment",
    description:
      "Devis, factures, clients et agenda au même endroit. Pensé pour le terrain et le bureau.",
    images: ["/logo.png"],
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
    apple: "/apple-touch-icon.png",
  },
};

export const generateLegalMetadata = (
  title: string,
  description: string
): Metadata => {
  return {
    title: `${title} | ReglePro`,
    description,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | ReglePro`,
      description,
      type: "website",
    },
  };
};
