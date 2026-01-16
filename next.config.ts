import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      allowedOrigins: ["*"],
    },
    optimizePackageImports: [
      "lucide-react",
      "date-fns",
      "lodash",
      "recharts",
      "framer-motion", // Just in case it's re-added later
      "@radix-ui/react-icons",
    ],
  },
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
