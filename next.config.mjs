/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets the dev server serve JS/HMR to devices on the LAN (e.g. testing on
  // an iPhone via this machine's IP) — Next.js blocks cross-origin dev
  // requests by default, which otherwise loads the page but leaves it
  // unhydrated with no working scripts.
  allowedDevOrigins: ["192.168.31.239"],
  // /products?division=<x> was the old way to reach a division's catalogue,
  // before it had its own route (see app/[division]/products). Other query
  // params (q, category, promotion, sort) pass through automatically.
  async redirects() {
    return [
      {
        source: "/products",
        has: [{ type: "query", key: "division", value: "medical" }],
        destination: "/medical/products",
        permanent: true,
      },
      {
        source: "/products",
        has: [{ type: "query", key: "division", value: "chemicals" }],
        destination: "/chemical/products",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
