"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaTelegram } from "react-icons/fa6"

import { cn } from "@/lib/utils"
import IconButton from "@/components/ui/icon-button"
import { Loader } from "@/components/common/loader"
import RightSidebar from "@/components/common/right-sidebar"
import TopBar from "@/components/common/top-bar"
import { MenuIcon, TwitterX } from "@/components/icons"
import AlienzoneIcon from "@/components/icons/alienzone"

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false)
  const pathname = usePathname()

  const isRootPage = pathname === "/"

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
            " bg-black max-lg:py-4 relative flex flex-col h-screen px-4"
          )}
        >
          <div className=" relative z-20 pb-2 lg:hidden">
            <div className=" flex justify-between items-center  ">
              <div className="flex gap-2">
                <Link
                  href="/"
                  className={cn(
                    "border border-gray-light rounded-normal cursor-pointer backdrop-blur-[40px] flex justify-center items-center size-14 ",
                    isRootPage ? "bg-white/20" : ""
                  )}
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
              <TopBar className="relative top-auto right-auto lg:hidden items-center" />
            )}
          </div>
          <div className={cn("relative flex-1 w-full flex flex-col")}>
            <div className="relative z-10 h-full flex-1 flex flex-col overflow-auto">
              <RightSidebar className="absolute left-8 top-10 max-lg:hidden " />

              {children}
            </div>
          </div>
          <div className="z-10 relative mt-3 space-y-2 lg:hidden ">
            <RightSidebar />
          </div>

          <div className="py-4 z-20 relative flex flex-col items-center justify-center max-lg:hidden text-white/50 gap-4">
            <div className="flex gap-4">
              <Link
                href="https://taap.it/alienzone2"
                target="_blank"
                className="hover:text-white"
              >
                <TwitterX size={24} />
              </Link>
              <Link
                href="https://taap.it/alienzone"
                target="_blank"
                className="hover:text-white"
              >
                <FaTelegram size={24} />
              </Link>
            </div>
            <p className="text-center text-sm      ">
              © {new Date().getFullYear()} Alienzone All rights reserved. Reach
              out to us at{" "}
              <a href="mailto:team@alienzone.io" className="underline">
                team@alienzone.io
              </a>
            </p>
          </div>
        </div>
      </Loader>
    </Suspense>
  )
}

export default Layout
