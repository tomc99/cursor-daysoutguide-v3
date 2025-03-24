import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'app-vsam01saas9de87t001.cms.optimizely.com' }],
  },
  /* config options here */
};

export default nextConfig;
