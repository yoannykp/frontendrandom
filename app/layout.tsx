import type { Metadata } from "next"

import "./styles/globals.css"

import { AppKit } from "@/context/appkit"
import { RaidTimerProvider } from "@/context/raidTimer"
import { ThemeProvider } from "@/context/ThemeProvider"
import { WalletProvider } from "@/context/wallet"
import { ReduxProvider } from "@/store/provider"
import { Toaster } from "react-hot-toast"

import { cn } from "@/lib/utils"

import { inter, volkhov } from "./fonts"

export const metadata: Metadata = {
  title: "Alienzone",
  description: "",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", volkhov.variable, inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <ReduxProvider>
            <AppKit>
              <WalletProvider>
                <RaidTimerProvider>
                  {children}
                  <Toaster />
                </RaidTimerProvider>
              </WalletProvider>
            </AppKit>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
