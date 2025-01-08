"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react"
import {
  BrowserProvider,
  Eip1193Provider,
  ethers,
  JsonRpcProvider,
  JsonRpcSigner,
  Provider,
} from "ethers"

type WalletContextType = {
  isConnected: boolean
  isAuthenticated: boolean
  provider: Provider | null
  signer: JsonRpcSigner | null
  user: {
    address: string
    balance: number
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
  const { address } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider("eip155")
  const [isConnected, setIsConnected] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      if (!walletProvider || !address) return
      const provider = new BrowserProvider(walletProvider as Eip1193Provider)
      const signer = await provider.getSigner()
      setProvider(provider)
      setSigner(signer)
      const balance = await provider.getBalance(address)
      setUser({ address, balance: Number(ethers.formatEther(balance)) })
      setIsConnected(true)
    }

    initialize()
  }, [walletProvider, address])

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
