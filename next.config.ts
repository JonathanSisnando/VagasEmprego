import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.manaus.am.gov.br",
      },
      {
        protocol: "https",
        hostname: "www.portaldotrabalhador.am.gov.br",
      },
    ],
  },
};

export default nextConfig;
