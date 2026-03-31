import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/_api/:path*',
        destination: 'http://187.127.5.199:8000/:path*' // Proxy para a sua VPS
      }
    ]
  }
};

export default nextConfig;
