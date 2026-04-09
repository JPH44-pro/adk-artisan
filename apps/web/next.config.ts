import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Masque l’indicateur de dev (logo / badge) en bas à gauche ; les erreurs s’affichent toujours. */
  devIndicators: false,
  images: {
    remotePatterns: [
      // Supabase Storage - signed URLs (private buckets)
      {
        protocol: "https",
        hostname: "your-project-id.supabase.co",
        port: "",
        pathname: "/storage/v1/object/sign/**",
      },
      // Supabase Storage - authenticated URLs (private buckets)
      {
        protocol: "https",
        hostname: "your-project-id.supabase.co",
        port: "",
        pathname: "/storage/v1/object/authenticated/**",
      },
    ],
  },
};

export default nextConfig;
