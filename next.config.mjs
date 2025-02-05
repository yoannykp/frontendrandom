/** @type {import('next').NextConfig} */
import withPWA from "next-pwa"

const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
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
  // maximumFileSizeToCacheInBytes: 20000000, // 20mb
  // fallbacks: {
  //   document: "/offline", // if you want to customize offline page
  // },
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
})(nextConfig)
