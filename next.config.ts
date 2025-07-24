import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'https',
              hostname: 'caution-tape-inventory.s3.ca-central-1.amazonaws.com',
              pathname: '**',
          },
      ],
  }
};

export default nextConfig;
