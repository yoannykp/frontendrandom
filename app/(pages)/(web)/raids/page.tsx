"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import RaidsPage from "@/components/pages/raids"

const Page = () => {
  const pathname = usePathname()

  return (
    <>
      <div className="fixed inset-0  bg-cover bg-center bg-no-repeat bg-[url('/images/pages/bg.jpg')]  lg:hidden "></div>

      <div className="absolute top-10 left-24  gap-3 z-20 hidden lg:flex ">
        <Link href="/raids">
          <Button
            className={cn(
              " px-5 !h-14 rounded-xl",
              pathname === "/raids" ? "glass-effect" : "opacity-70"
            )}
          >
            Raids
          </Button>
        </Link>
        <Link href="/hunt">
          <Button
            className={cn(
              " px-5 !h-14 rounded-xl",
              pathname === "/hunt" ? "glass-effect" : "opacity-70"
            )}
          >
            Hunt
          </Button>
        </Link>
      </div>

      <div className="justify-end  relative flex-1 rounded-2xl overflow-hidden    hidden lg:flex ">
        <div className="absolute inset-0 bg-[url('/images/characters/character-1-mobile.png')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/bg.jpg')] hidden lg:block "></div>

        <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-[105px] hidden lg:flex">
          <RaidsPage />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex-1 flex flex-col">
        <RaidsPage />
      </div>

      {/* Background Gradients */}
      <div
        className="fixed inset-0 "
        style={{
          background:
            "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
        }}
      ></div>
      <div
        className="fixed w-32 h-96 bg-black/40 left-0 top-20 "
        style={{
          filter: "blur(50px)",
        }}
      ></div>
    </>
  )
}

export default Page
