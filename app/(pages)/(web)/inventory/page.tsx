"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import InventoryPage from "@/components/pages/inventory"

const Page = () => {
  const pathname = usePathname()
  const [portal, setPortal] = useState<number>(1)

  return (
    <>
      <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-140px)] max-lg:hidden">
        <div className="absolute inset-0 bg-[url('/images/pages/team-bg.jpg')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/team-bg.jpg')]">
          <div className="absolute inset-0 bg-[#181818CC]"></div>
        </div>

        <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-28 relative flex flex-col items-center justify-center gap-8  mx-auto ">
          <InventoryPage />
        </div>
      </div>

      <div className="flex flex-col rounded-2xl glass-effect z-10 p-2 gap-3 lg:hidden flex-1">
        <InventoryPage />
      </div>

      {/* Background Gradients */}
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
        }}
      ></div>
      {/* <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(48.12% 75.2% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.81) 100%)",
        }}
      ></div> */}
    </>
  )
}

export default Page
