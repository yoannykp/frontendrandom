"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAliens } from "@/store/hooks"

import { addCacheBuster, cn, getBackgroundImageUrl } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import RaidsPage from "@/components/pages/raids"

const Page = () => {
  const pathname = usePathname()
  const { alien } = useAliens()
  const router = useRouter()

  // push to raids pages
  useEffect(() => {
    router.push("/raids")
  }, [])

  return (
    <>
      {/* <div className="fixed inset-0 bg-cover bg-center bg-no-repeat bg-[url('/images/pages/bg.jpg')] lg:hidden"></div> */}

      <div className="absolute top-10 left-24 gap-3 z-20 hidden lg:flex ">
        <Link href="/raids">
          <Button
            className={cn(
              "px-5 !h-14 rounded-xl glass-effect",
              pathname === "/raids" ? "!bg-white/20" : ""
            )}
          >
            Raids
          </Button>
        </Link>
        <Link href="/hunt">
          <Button
            className={cn(
              "px-5 !h-14 rounded-xl glass-effect ",
              pathname === "/hunt" ? "!bg-white/20" : ""
            )}
          >
            Hunt
          </Button>
        </Link>
      </div>

      <div className="justify-end relative flex-1 rounded-2xl overflow-hidden hidden lg:flex">
        {/* <div className="absolute inset-0 bg-[url('/images/characters/character-1-mobile.png')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/bg.jpg')] hidden lg:block "></div> */}

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${getBackgroundImageUrl(alien?.element?.image?.replace(".png", "-bg.png") || "")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <img
          src={addCacheBuster(alien?.image || "")}
          alt={alien?.name || "Alien character"}
          className="absolute bg-cover bg-no-repeat"
          style={{
            backgroundSize: "cover",
            backgroundPosition: "25% center",
            left: "25%",
            transform: "translateX(-50%)",
            width: "50%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "25% center",
          }}
        />

        {/* <div
          className="absolute inset-0 bg-cover bg-no-repeat opacity-50"
          style={{
            backgroundImage: `url(${alien?.image || ""})`,
            backgroundSize: "cover",
            backgroundPosition: "25% center", // Position at 25% from left instead of center
            left: "25%", // Position at 25% from left
            transform: "translateX(-50%)", // Center the image at that 25% point
            width: "50%", // Control the width of the image
          }}
        /> */}

        <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-[105px] hidden lg:flex">
          <RaidsPage isHunt={true} />
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex-1 flex flex-col">
        <RaidsPage isHunt={true} />
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
