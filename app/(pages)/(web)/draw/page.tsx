"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import DrawPage from "@/components/pages/draw"

const Page = () => {
  const pathname = usePathname()
  const [portal, setPortal] = useState<number>(1)

  return (
    <>
      <div className=" fixed lg:absolute top-4  lg:top-10 left-16 lg:left-24 flex gap-3 z-50 h-14 items-center ">
        <Button
          className={cn(
            " px-5 !h-14 rounded-xl text-lg",
            portal === 1 ? "bg-white/10 backdrop-blur-lg" : "opacity-70"
          )}
          onClick={() => setPortal(1)}
        >
          <span className="hidden lg:block">Portal</span> 01
        </Button>

        <Button
          className={cn(
            " px-5 !h-14 rounded-xl text-lg",
            portal === 2 ? "bg-white/10 backdrop-blur-lg" : "opacity-70"
          )}
          onClick={() => setPortal(2)}
        >
          <span className="hidden lg:block">Portal</span> 02
        </Button>
      </div>

      <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-140px)] max-lg:hidden">
        <div className="absolute inset-0 bg-[url('/images/pages/team-bg.jpg')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/team-bg.jpg')]">
          <div className="absolute inset-0 bg-[#181818CC]"></div>
        </div>

        <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-28 relative flex flex-col items-center justify-center gap-8  mx-auto ">
          <DrawPage portal={portal} />
        </div>
      </div>

      <div className="flex flex-col rounded-2xl glass-effect z-10 p-2 gap-3 lg:hidden flex-1">
        <DrawPage portal={portal} />
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
