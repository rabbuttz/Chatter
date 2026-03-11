import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ichijiuke/db",
    "@ichijiuke/domain",
    "@ichijiuke/inquiry-engine",
    "@ichijiuke/ui",
  ],
  typedRoutes: true,
};

export default nextConfig;
