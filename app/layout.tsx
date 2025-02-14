import type { Metadata } from "next"

import "./styles/globals.css"

import { RaidTimerProvider } from "@/context/raidTimer"
import { ThemeProvider } from "@/context/ThemeProvider"
import { WalletProvider } from "@/context/wallet"
import { ReduxProvider } from "@/store/provider"
import { Toaster } from "react-hot-toast"

import { cn } from "@/lib/utils"
import { InstallPWAPrompt } from "@/components/pages/pwa/InstallPWAPrompt"
import Providers from "@/components/Providers"

import { inter, volkhov } from "./fonts"

export const metadata: Metadata = {
  title: "Odoroki Kōgeki",
  description: "Odoroki Kōgeki - The Ultimate Gaming Experience",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={cn("antialiased", volkhov.variable, inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Providers>
            <ReduxProvider>
              <WalletProvider>
                <RaidTimerProvider>
                  {children}
                  <Toaster />
                  <InstallPWAPrompt />
                </RaidTimerProvider>
              </WalletProvider>
            </ReduxProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
