import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/_api/:path*',
        destination: 'http://187.127.5.199/:path*' // Furar bloqueio de Firewall Hostinger via porta 80
      }
    ]
  }
};

export default nextConfig;
