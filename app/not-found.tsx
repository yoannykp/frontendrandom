import { FlagIcon } from "lucide-react"

import BlurBox from "@/components/ui/blur-box"
import BrandButton from "@/components/ui/brand-button"
import {
  ChatIcon,
  DoubleArrowIcon,
  HomeIcon,
  InfoIcon,
  MailIcon,
  PeopleIcon,
  SettingsIcon,
  Shop2Icon,
  ShopIcon,
  StackIcon,
  VolumeIcon,
} from "@/components/icons"
import AlienzoneIcon from "@/components/icons/alienzone"

const sidebarItems = [
  { label: "", href: "", icon: <HomeIcon className="size-4" /> },
  { label: "", href: "", icon: <DoubleArrowIcon className="size-4" /> },
  { label: "", href: "", icon: <PeopleIcon className="size-4" /> },
  { label: "", href: "", icon: <FlagIcon className="size-4" /> },
  { label: "", href: "", icon: <StackIcon className="size-4" /> },
  { label: "", href: "", icon: <InfoIcon className="size-4" /> },
]

const topbarItems = [
  { label: "", href: "", icon: <MailIcon className="size-4" /> },
  { label: "", href: "", icon: <ShopIcon className="size-4" /> },
  { label: "", href: "", icon: <Shop2Icon className="size-4" /> },
  { label: "", href: "", icon: <VolumeIcon className="size-4" /> },
  { label: "", href: "", icon: <SettingsIcon className="size-4" /> },
]

const NotFound = () => {
  return (
    <main className="w-full h-screen relative p-20">
      {/* Image Section */}
      <div className="fixed inset-0 p-20 pointer-events-none">
        <div
          className="bg-cover bg-center w-full h-full bg-no-repeat rounded-md"
          // style={{ backgroundImage: "url(/images/404.jpeg)" }}
          // style={{
          //   backgroundImage: `
          //     radial-gradient(
          //       91.36% 91.36% at 31.6% 44.58%,
          //       rgba(0, 0, 0, 0) 0%,
          //       #000000 100%
          //     ),
          //     url(/images/404.jpeg)
          //   `,
          // }}
          style={{
            backgroundImage: `
              linear-gradient(rgba(24, 24, 24, 0.8), rgba(24, 24, 24, 0.8)), 
              url(/images/404.jpeg)
            `,
          }}
        ></div>

        {/* <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(91.36% 91.36% at 80% 50%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
            pointerEvents: "none",
          }}
        ></div> */}

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(93.36% 90.36% at 29% 50%, rgba(0, 0, 0, 0) 46%, #000000 78%)",
            pointerEvents: "none",
          }}
        ></div>
      </div>

      {/* Centered Text Section */}
      <div className="absolute inset-0 flex items-center justify-center z-50">
        <div className="max-w-2xl text-center flex justify-center items-center flex-col gap-6">
          <h2 className="text-6xl">Ooups, Page not found</h2>
          <p className="text-gray-400 max-w-md">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In blandit,
            dolor eu condimentum fringilla, est arcu aliquet urna.
          </p>
          <BrandButton
            className="items-start w-max hover:scale-105 duration-500 transition-transform active:scale-95 px-[25px]"
            blurColor="bg-purple-300"
            isLink
            href="/"
          >
            Back to homepage
          </BrandButton>
        </div>
      </div>

      <div className="absolute left-28 top-28 z-20 flex flex-col gap-2">
        <div className="border border-gray-light rounded-normal cursor-pointer backdrop-blur-[40px] flex justify-center items-center size-14">
          <AlienzoneIcon className="size-6" />
        </div>

        <BlurBox className="rounded-normal flex-col items-center gap-2.5 w-14 p-2">
          {sidebarItems.map((item, index) => (
            <BlurBox key={index}> {item.icon}</BlurBox>
          ))}
        </BlurBox>
      </div>
      <div className="absolute left-28 bottom-28">
        <BlurBox className="rounded-normal flex-col items-center gap-2.5 w-14 p-2">
          <BlurBox>
            <ChatIcon className="size-4" />
          </BlurBox>
        </BlurBox>
      </div>

      <div className="absolute right-28 top-28 z-20 flex flex-col gap-2">
        <BlurBox className="rounded-normal items-center gap-2.5 p-2">
          {topbarItems.map((item, index) => (
            <BlurBox key={index}> {item.icon}</BlurBox>
          ))}
        </BlurBox>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4">
        <div className="font-inter text-[12px] font-normal text-off-white flex gap-1 md:gap-0 flex-col md:flex-row w-full justify-center items-center">
          <span>
            © {new Date().getFullYear()} Alienzone All rights reserved.
          </span>
          <span>
            &nbsp; Reach out to us at &nbsp;
            <span className="border-b border-off-white">team@alienzone.io</span>
          </span>
        </div>
      </div>
    </main>
  )
}

export default NotFound
