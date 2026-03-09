/** @type {import('next').NextConfig} */
import withPWA from "next-pwa"

const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  images: {
    // Image optimization is now ENABLED (removed unoptimized: true)
    // This enables automatic WebP/AVIF conversion, resizing, and lazy loading
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Cache optimized images for 60 days
    minimumCacheTTL: 5184000,
    // Limit generated image sizes to reduce build/cache size
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  // Enable experimental optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "ethers",
      "embla-carousel-react",
    ],
  },
  webpack: (config) => {
    config.externals["@solana/web3.js"] = "commonjs @solana/web3.js"
    return config
  },
}

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  runtimeCaching: [
    {
      // Cache images aggressively
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      // Cache API responses with network-first strategy
      urlPattern: /\/api\//i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
})(nextConfig)
