"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useActiveWallet, usePrivy, useWallets } from "@privy-io/react-auth"
import {
  BrowserProvider,
  Eip1193Provider,
  ethers,
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
} from "ethers"

import { getZoneBalance } from "@/lib/utils"

type WalletContextType = {
  isConnected: boolean
  isAuthenticated: boolean
  provider: Provider | null
  signer: JsonRpcSigner | null
  user: {
    address: string
    balance: number
    zoneBalance: number
  } | null
  setIsAuthenticated: (value: boolean) => void
}

export const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  isAuthenticated: false,
  provider: null,
  signer: null,
  user: null,
  setIsAuthenticated: () => {},
})

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<Provider | null>(null)
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
  const [user, setUser] = useState<WalletContextType["user"] | null>(null)
  const { user: privyUser } = usePrivy()
  const { wallets } = useWallets()
  const wallet = wallets[0]
  const [isConnected, setIsConnected] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      if (!wallet) return
      const privyProvider = await wallet.getEthereumProvider()
      if (!privyProvider || !privyUser?.wallet?.address) return

      const ethersProvider = new ethers.BrowserProvider(privyProvider)
      const signer = await ethersProvider.getSigner()
      setProvider(ethersProvider)
      setSigner(signer)

      // Get both ETH and ZONE balances
      const [ethBalance, zoneBalance] = await Promise.all([
        ethersProvider.getBalance(privyUser.wallet.address),
        getZoneBalance(ethersProvider, privyUser.wallet.address),
      ])

      setUser({
        address: privyUser.wallet.address,
        balance: Number(ethers.formatEther(ethBalance)),
        zoneBalance: zoneBalance,
      })

      setIsConnected(true)
    }

    initialize()
  }, [wallet, privyUser?.wallet?.address])

  // Add balance refresh function
  const refreshBalances = async () => {
    if (!provider || !user?.address) return

    const [ethBalance, zoneBalance] = await Promise.all([
      provider.getBalance(user.address),
      getZoneBalance(provider, user.address),
    ])

    setUser((prev) =>
      prev
        ? {
            ...prev,
            balance: Number(ethers.formatEther(ethBalance)),
            zoneBalance: zoneBalance,
          }
        : null
    )
  }

  // Refresh balances every 30 seconds
  useEffect(() => {
    if (!isConnected) return

    const interval = setInterval(refreshBalances, 30000)
    return () => clearInterval(interval)
  }, [isConnected, provider, user?.address])

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        user,
        isConnected,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  return useContext(WalletContext)
}
