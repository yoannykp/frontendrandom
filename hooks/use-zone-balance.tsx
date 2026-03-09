"use client"

import { useEffect, useState } from "react"
import { ethers } from "ethers"

import ZONE_TOKEN_ABI from "@/app/assets/zoneTokenContractAbi.json"

export const useZoneBalance = (signer: ethers.Signer | null) => {
  const [zoneBalance, setZoneBalance] = useState<string>("0")

  useEffect(() => {
    const fetchZoneBalance = async () => {
      if (!signer) return

      try {
        const contractAddress =
          process.env.NEXT_PUBLIC_ZONE_TOKEN_CONTRACT_ADDRESS

        if (!contractAddress || !ethers.isAddress(contractAddress)) {
          console.error("Invalid zone token contract configuration")
          return
        }

        const contract = new ethers.Contract(
          contractAddress,
          ZONE_TOKEN_ABI,
          signer
        )
        const address = await signer.getAddress()
        const balance = await contract.balanceOf(address)

        const formatted = ethers.formatUnits(balance, 18)
        setZoneBalance(formatted)
      } catch (err) {
        console.error("Failed to fetch zone balance:", err)
      }
    }

    fetchZoneBalance()
  }, [signer])

  return zoneBalance
}
