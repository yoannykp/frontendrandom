"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import IconButton from "@/components/ui/icon-button"
import ChatBox from "@/components/common/chat-box"
import { Loader } from "@/components/common/loader"
import RightSidebar from "@/components/common/right-sidebar"
import TopBar from "@/components/common/top-bar"
import { MenuIcon } from "@/components/icons"
import AlienzoneIcon from "@/components/icons/alienzone"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
  const pathname = usePathname()
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <Loader>
        <div
          className={cn(
            " bg-black max-lg:py-4  max-lg:h-screen relative flex flex-col lg:min-h-screen"
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
                {(pathname === "/raids" || pathname === "/hunt") && (
                  <>
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
                  </>
                )}
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
              <TopBar className="relative  top-auto right-auto lg:hidden items-center opacity-50 pointer-events-none" />
            )}
          </div>
          <div className="relative flex-1  w-full   overflow-hidden flex flex-col ">
            <div className="relative z-10 h-full flex-1   flex flex-col overflow-auto">
              <RightSidebar className="absolute left-8 top-10 max-lg:hidden opacity-50 pointer-events-none" />
              <ChatBox className="absolute left-8 bottom-10 max-lg:hidden" />
              <TopBar className="absolute right-8 top-10 max-lg:hidden opacity-50 pointer-events-none" />

              {children}
            </div>
          </div>
          <div className="z-10 relative mt-3 space-y-2 lg:hidden opacity-50 pointer-events-none">
            <RightSidebar />
          </div>
          <p className="text-center text-sm text-white/50 py-4 max-lg:hidden z-10 ">
            © 2024 Alienzone All rights reserved. Reach out to us at
            team@alienzone.io
          </p>
        </div>
      </Loader>
    </Suspense>
  )
}

export default Layout
