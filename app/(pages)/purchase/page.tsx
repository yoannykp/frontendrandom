"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, CircleX } from "lucide-react"

import BrandButton from "@/components/ui/brand-button"

type PurchaseStatus = "success" | "cancel" | null

function PurchaseContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<PurchaseStatus>(null)

  useEffect(() => {
    // Get and store the status
    const sessionId = searchParams.get("session_id")
    const purchaseStatus = searchParams.get("status") as PurchaseStatus

    if (!sessionId || !purchaseStatus) {
      router.push("/")
      return
    }

    setStatus(purchaseStatus)

    // Clean up URL - remove search params
    const newUrl = window.location.pathname
    window.history.replaceState({}, "", newUrl)
  }, [searchParams, router])

  const content = {
    success: {
      icon: <CheckCircle2 className="w-10 h-10 text-green-500" />,
      title: "Purchase Successful!",
      message:
        "Your purchase has been completed successfully. You can now close this tab and return to the game.",
    },
    cancel: {
      icon: <CircleX className="w-10 h-10 text-red-500" />,
      title: "Purchase Cancelled",
      message:
        "Your purchase was cancelled. You can try again or return to the game.",
    },
  }

  if (!status) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-lg max-w-md w-full flex flex-col items-center gap-6 text-center">
        <div className="relative size-20 flex items-center justify-center">
          {content[status].icon}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{content[status].title}</h1>
          <p className="text-white/70">{content[status].message}</p>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <BrandButton
            className="w-full"
            blurColor="bg-[#96DFF4]"
            onClick={() => router.push("/")}
          >
            Back to Home
          </BrandButton>

          <button
            onClick={() => window.close()}
            className="text-white/50 hover:text-white transition-colors"
          >
            Close Tab
          </button>
        </div>
      </div>

      {/* Background Gradients */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
        }}
      />
    </div>
  )
}

export default function PurchasePage() {
  return (
    <Suspense>
      <PurchaseContent />
    </Suspense>
  )
}
