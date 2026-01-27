import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/GST-25",
        destination: "/courses/b8739b83-1842-4b8a-980d-88e0215d2e66",
        permanent: true, // SEO friendly (308)
      },
    ];
  },
};

export default nextConfig;
