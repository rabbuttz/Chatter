import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@ichijiuke/domain",
    "@ichijiuke/inquiry-engine",
    "@ichijiuke/ui",
  ],
  typedRoutes: true,
};

export default nextConfig;
