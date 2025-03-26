"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useAliens } from "@/store/hooks"

import { canSpin, getWheelItems } from "@/lib/api"
import { cn } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"
import IconButton from "@/components/ui/icon-button"
import ChatBox from "@/components/common/chat-box"
import { Loader } from "@/components/common/loader"
import RightSidebar from "@/components/common/right-sidebar"
import TopBar from "@/components/common/top-bar"
import { MenuIcon } from "@/components/icons"
import AlienzoneIcon from "@/components/icons/alienzone"
import WheelPage from "@/components/pages/wheel/page"
import Wheel from "@/components/pages/wheel/Wheel"

const Page = () => {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelItems, setWheelItems] = useState<
    {
      name: string
      color: string
    }[]
  >([])
  const [userCanSpin, setUserCanSpin] = useState(false)

  const colors = [
    "#FF8A00",
    "#FFD600",
    "#FF69B4",
    "#FF99CC",
    "#FF4444",
    "#7FFF00",
    "#00BFFF",
    "#4169E1",
    "#FF0000",
    "#9400D3",
    "#00FF7F",
    "#FF1493",
    "#1E90FF",
    "#FFB6C1",
    "#32CD32",
    "#FF6347",
    "#8A2BE2",
    "#20B2AA",
  ]
  const [winningItem, setWinningItem] = useState<{
    color: string
    name: string
  } | null>(null)
  const { alien } = useAliens()

  useEffect(() => {
    const fetchCanSpin = async () => {
      const response = await canSpin()
      // setUserCanSpin(response.data?.canSpin || false)
      setUserCanSpin(true)
    }
    fetchCanSpin()
  }, [])

  useEffect(() => {
    getWheelItems().then((res) => {
      const items = res.data?.map((item, index) => ({
        ...item,
        color: colors[index % colors.length],
      }))
      setWheelItems(items || [])
    })
  }, [])

  const handleSpinComplete = (item: { color: string; name: string }) => {
    setWinningItem(item)
    setIsSpinning(false)
  }

  const handleSpin = async () => {
    if (!userCanSpin || isSpinning) return
    setIsSpinning(true)
  }

  return (
    <Loader>
      <Suspense
        fallback={
          <div className="flex justify-center items-center h-screen">
            Loading...
          </div>
        }
      >
        <div
          className={cn(
            " bg-black max-lg:py-4   relative flex flex-col h-screen"
          )}
        >
          <div className=" relative z-20 pb-2 lg:hidden">
            <div className=" flex justify-between items-center  ">
              <div className="flex gap-2 items-center">
                <Link
                  href="/"
                  className="border border-gray-light rounded-normal cursor-pointer backdrop-blur-[40px] flex justify-center items-center size-14 "
                >
                  <AlienzoneIcon className="size-6" />
                </Link>
                <h1 className="text-white text-3xl ">Wheel</h1>
              </div>
              <IconButton
                onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)}
                showBase
                className="size-14"
              >
                <MenuIcon className="size-full" />
              </IconButton>
            </div>
            {isOpenMobileMenu && (
              <TopBar className="relative  top-auto right-auto lg:hidden items-center" />
            )}
          </div>
          <div className="relative flex-1  w-full   overflow-hidden flex flex-col ">
            <div className="relative z-10 h-full flex-1   flex flex-col overflow-auto">
              <RightSidebar className="absolute left-8 top-10 max-lg:hidden " />
              <ChatBox className="absolute left-8 bottom-10 max-lg:hidden" />
              <TopBar className="absolute right-8 top-10 max-lg:hidden " />
              <div className="absolute top-10 left-24  gap-3 z-20 hidden lg:flex h-14 items-center">
                <h1 className="text-white text-3xl ">Wheel</h1>
              </div>
              <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-140px)] max-lg:hidden">
                <div className="absolute inset-0 bg-cover bg-bottom bg-no-repeat bg-[url('/images/wheel/wheel-bg.png')]">
                  <div
                    className="absolute inset-0 "
                    style={{
                      background:
                        "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
                    }}
                  ></div>

                  <Wheel
                    isSpinning={isSpinning}
                    onSpinComplete={handleSpinComplete}
                    items={wheelItems}
                  />
                </div>

                <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-28 relative flex flex-col items-center justify-center gap-8  mx-auto ">
                  <WheelPage
                    wheelItems={wheelItems}
                    userCanSpin={userCanSpin}
                  />
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 max-lg:hidden">
                    <BrandButton
                      blurColor="bg-[#F49696]"
                      className="px-14"
                      onClick={handleSpin}
                      disabled={!userCanSpin || isSpinning}
                    >
                      {isSpinning ? "Spinning..." : "Spin"}
                    </BrandButton>
                  </div>
                </div>
              </div>

              <div className="flex flex-col rounded-2xl  z-10  gap-3 lg:hidden flex-1">
                <WheelPage wheelItems={wheelItems} userCanSpin={userCanSpin} />
              </div>

              {/* Background Gradients */}
              <div
                className="fixed inset-0 "
                style={{
                  background:
                    "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
                }}
              ></div>
            </div>
          </div>
          <div className="z-10 relative mt-3 space-y-2 lg:hidden ">
            <RightSidebar />
          </div>
          <p className="text-center text-sm text-white/50 py-4 max-lg:hidden z-10 ">
            © 2024 Alienzone All rights reserved. Reach out to us at
            team@alienzone.io
          </p>
        </div>
      </Suspense>
    </Loader>
  )
}

export default Page
