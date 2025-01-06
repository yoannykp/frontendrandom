"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ReduxProvider } from "@/lib/store/provider"
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
    <ReduxProvider>
      <Loader>
        <div
          className={cn(
            " bg-[#2B3C25] p-4 lg:px-20 max-lg:h-screen relative flex flex-col"
          )}
        >
          <div className=" relative z-20 pb-2">
            <div className=" flex justify-between items-center  lg:hidden">
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
              <TopBar className="relative  top-auto right-auto lg:hidden items-center" />
            )}
          </div>
          <div className="relative max-lg:flex-1  w-full   overflow-hidden ">
            <div className="relative z-10 h-full lg:min-h-[calc(100vh-160px)]  flex flex-col overflow-auto">
              <RightSidebar className="absolute left-8 top-10 max-lg:hidden" />
              <ChatBox className="absolute left-8 bottom-10 max-lg:hidden" />
              <TopBar className="absolute right-8 top-10 max-lg:hidden" />

              {children}
            </div>
          </div>
          <div className="z-10 relative mt-3 space-y-2 lg:hidden">
            <RightSidebar />
          </div>
        </div>
      </Loader>
    </ReduxProvider>
  )
}

export default Layout
