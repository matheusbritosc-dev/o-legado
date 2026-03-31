import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/_api/:path*',
        destination: 'https://colin-defense-lamp-represents.trycloudflare.com/:path*' // Túnel Cloudflare invencível
      }
    ]
  }
};

export default nextConfig;
