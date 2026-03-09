"use client"

import { Suspense, useState } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import IconButton from "@/components/ui/icon-button"
import ChatBox from "@/components/common/chat-box"
import { Loader } from "@/components/common/loader"
import RightSidebar from "@/components/common/right-sidebar"
import TopBar from "@/components/common/top-bar"
import { MenuIcon } from "@/components/icons"
import AlienzoneIcon from "@/components/icons/alienzone"
import DojoPage from "@/components/pages/dojo/page"

const Page = () => {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)

  return (
    <Loader isDojoPage>
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

              <DojoPage />

              <div className="flex flex-col rounded-2xl  z-10  gap-3 lg:hidden flex-1">
                <DojoPage />
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
            © {new Date().getFullYear()} Alienzone All rights reserved. Reach
            out to us at team@alienzone.io
          </p>
        </div>
      </Suspense>
    </Loader>
  )
}

export default Page
