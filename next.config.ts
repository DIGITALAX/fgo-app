import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  telemetry: false,
  reactStrictMode: false,
  experimental: {
    scrollRestoration: true,
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.digitalax.xyz",
        pathname: "/ipfs/**",
      },
    ],
    unoptimized: true,
  },
  trailingSlash: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/core": false,
      "@x402/evm": false,
      "@x402/svm": false,
      "@x402/extensions": false,
      "@x402/express": false,
      "@x402/fetch": false,
    };
    return config;
  },
  async headers() {
    let headersConfig: any = [];

    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "img-src 'self' data: blob: https://cdn.digitalax.xyz",
      "media-src 'self' data: blob: https://cdn.digitalax.xyz",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      process.env.NODE_ENV === "development"
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline'",
      [
        "connect-src 'self'",
        "https://rpc.lens.xyz",
        "https://rpc.testnet.lens.dev",
        "https://cdn.digitalax.xyz",
      ].join(" "),
      "frame-src 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    const allowedOrigins = ["https://cdn.digitalax.xyz", "*"];
    allowedOrigins.forEach((origin) => {
      headersConfig.push({
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Access-Control-Allow-Origin",
            value: origin,
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
        ],
      });
    });

    return headersConfig;
  },
};

export default nextConfig;
