"use client"

import { PrivyProvider } from "@privy-io/react-auth"

import { getChain } from "@/lib/utils"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          logo: "/images/logo.png",
          landingHeader: "Alienzone",
          loginMessage: "Login to continue",
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        defaultChain: getChain(
          parseInt(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID!)
        ),
      }}
    >
      {children}
    </PrivyProvider>
  )
}
