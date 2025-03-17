"use client"

import { useState } from "react"
import Link from "next/link"
import { useAliens } from "@/store/hooks"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import IconButton from "@/components/ui/icon-button"
import ChatBox from "@/components/common/chat-box"
import { Loader } from "@/components/common/loader"
import RightSidebar from "@/components/common/right-sidebar"
import TopBar from "@/components/common/top-bar"
import { MenuIcon } from "@/components/icons"
import AlienzoneIcon from "@/components/icons/alienzone"
import ForgePage from "@/components/pages/forge"

export enum ForgeTabs {
  ENHANCEMENT = "enhancement",
  PROMOTION = "promotion",
  FORGE = "forge",
}

const TABS = [
  {
    value: ForgeTabs.ENHANCEMENT,
    label: "Enhancement",
  },
  {
    value: ForgeTabs.PROMOTION,
    label: "Promotion",
  },
  {
    value: ForgeTabs.FORGE,
    label: "Forge",
  },
]

const Page = () => {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
  const { alien } = useAliens()
  const [activeTab, setActiveTab] = useState<ForgeTabs>(ForgeTabs.ENHANCEMENT)
  return (
    <Loader>
      <div className="absolute top-10 left-24 flex gap-3 z-20 h-14 items-center max-lg:hidden">
        {TABS.map((tab) => (
          <Button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              " px-5 !h-14 rounded-xl",
              activeTab === tab.value ? "glass-effect" : "opacity-70"
            )}
          >
            {tab.label}
          </Button>
        ))}
      </div>
      <div
        className={cn(
          " bg-black max-lg:py-4   relative flex flex-col h-screen"
        )}
      >
        <div className=" relative z-20 pb-2 lg:hidden">
          <div className=" flex justify-between items-center  ">
            <div className="flex gap-2">
              <Link
                href="/"
                className="border border-gray-light rounded-normal cursor-pointer backdrop-blur-[40px] flex justify-center items-center size-14 "
              >
                <AlienzoneIcon className="size-6" />
              </Link>
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

            <div className=" flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-140px)] max-lg:hidden">
              <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-[url('/images/pages/forge.jpeg')]">
                <div
                  className="absolute inset-0 "
                  style={{
                    background:
                      "radial-gradient(74.8% 74.8% at 50% 35%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.54) 100%),radial-gradient(94.72% 94.72% at 50% 31.6%, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.81) 100%)",
                  }}
                ></div>
              </div>

              <div className=" w-full z-10 pb-12 pr-8 pl-24 pt-28 relative flex flex-col items-center justify-center gap-8  mx-auto ">
                <ForgePage activeTab={activeTab} />
              </div>
            </div>

            <div className="flex flex-col rounded-2xl  z-10  gap-3 lg:hidden flex-1">
              <ForgePage activeTab={activeTab} />
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
    </Loader>
  )
}

export default Page
