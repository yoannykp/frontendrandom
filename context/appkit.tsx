"use client"

import { EthersAdapter } from "@reown/appkit-adapter-ethers"
import { sepolia } from "@reown/appkit/networks"
import { createAppKit } from "@reown/appkit/react"

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not set")
}

// 2. Create a metadata object
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
}

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks: [sepolia],
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
})

export function AppKit({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
