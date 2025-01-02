import type { Metadata } from "next"

import "./styles/globals.css"

import { AppKit } from "@/context/appkit"
import { WalletProvider } from "@/context/wallet"
import { ThemeProvider } from "@/contexts/ThemeProvider"

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
          <AppKit>
            <WalletProvider>{children}</WalletProvider>
          </AppKit>
        </ThemeProvider>
      </body>
    </html>
  )
}
