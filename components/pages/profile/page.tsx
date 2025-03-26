import Image from "next/image"
import Link from "next/link"
import { Grid2X2 } from "lucide-react"
import moment from "moment"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AddUserIcon,
  HeartIcon,
  MessageIcon,
  PlusIcon,
  XLogo,
} from "@/components/icons"

const ProfilePage = () => {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Desktop Version */}
      <div className="flex-1 hidden lg:flex h-full bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xl">
        <div className="flex-1 flex h-full gap-4">
          {/* sidebar */}
          <div
            className={cn(
              "transition-all duration-300 rounded-r-xl flex flex-col",
              "fixed inset-0 z-50 lg:static lg:z-auto lg:w-full lg:max-w-[400px] lg:inset-auto",
              "lg:opacity-100 lg:translate-y-0"
            )}
          >
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-0.5">
                {/* Main Profile Image with Gallery */}
                <div className="flex gap-2">
                  <div className="flex-1 aspect-square rounded overflow-hidden relative">
                    <Image
                      src={"/images/user.png"}
                      alt="Character"
                      fill
                      className="object-cover z-10"
                    />
                    {/* <Image
                      src={selectedUserTeam?.team[0].element?.background || ""}
                    alt="User's alien"
                    fill
                  /> */}
                  </div>
                </div>

                <div className="bg-white/5 rounded p-3 flex-1 flex flex-col">
                  {/* Profile Info */}
                  <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">John Doe</span>
                      {/* <span className="text-xl">{selectedUser?.country}</span> */}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-white/10   rounded text-xs font-inter border border-white/10 flex">
                        <div className="border-r border-white/10 text-white/50 px-1 bg-white/5 ">
                          Level{" "}
                        </div>
                        <div className="font-volkhov  px-2">12</div>
                      </div>
                      <div className="w-10 h-6 border border-white/10 rounded bg-white/10 flex items-center justify-center relative">
                        <Image
                          src="/images/badge.png"
                          alt="Badge"
                          width={26}
                          height={26}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stats List */}
                  <div className="flex flex-col gap-2 text-sm my-3">
                    <div className="flex justify-between items-center">
                      <span className=" font-inter">Entreprise</span>
                      <span className="font-medium">{"-"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-inter">Reputations Points</span>
                      <span className="font-medium">345</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-inter">Time passed in Raids</span>
                      <span className="font-medium">246h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-inter">STAR earned</span>
                      <span className="font-medium">5 (0.02$)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-inter">Account creation</span>
                      <span className="font-medium">
                        {moment(new Date()).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-5 gap-2 mt-auto">
                    <button
                      className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12"
                      // onClick={() => handleLikeUser(selectedUser.id)}
                    >
                      <HeartIcon
                        className={cn(
                          "w-5 h-5 mx-auto ",
                          true && "fill-[#FF4141] text-[#FF4141]"
                        )}
                      />
                    </button>
                    <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12">
                      <MessageIcon className="w-5 h-5 mx-auto" />
                    </button>
                    <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12">
                      <AddUserIcon className="w-5 h-5 mx-auto" />
                    </button>
                    <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12">
                      <PlusIcon className="w-5 h-5 mx-auto" />
                    </button>
                    <Link
                      href={`https://x.com`}
                      target="_blank"
                      className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12 flex items-center justify-center"
                    >
                      <XLogo className="size-4 mx-auto" />
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
          {/* main content */}
          <div className="flex-1 flex flex-col gap-3">
            {/* Top Tabs */}
            <div className="flex gap-2 font-inter">
              <div className="flex-1 bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <span className="text-white font-medium">Inventory</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className=" ">Total worth</span>
                  <div className="flex items-center gap-1">
                    <span className="text-white">4.567</span>
                    <Image
                      src="/images/logos/eth.png"
                      alt="Star"
                      width={16}
                      height={16}
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 bg-white/5 rounded-xl p-3 flex items-center justify-between">
                <span className="text-white font-medium">Activity</span>
                <button className="size-6 flex items-center justify-center bg-white/5 rounded border border-white/10">
                  <Grid2X2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Grid Area */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-3 p-0.5">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-3 flex flex-col"
                  >
                    <div className="h-[250px] rounded-lg bg-white/5 mb-3 relative">
                      <Image
                        src="/images/user.png"
                        alt="Item"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="text-white font-medium">
                          Item Name
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-lg  bg-[#FF41D6] text-white font-inter">
                          Legendary
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center flex-col text-sm">
                      <div className="flex items-center gap-1 justify-between w-full">
                        <span className="text-white/50">Item Price</span>
                        <div className="flex items-center gap-1">
                          <span>250</span>
                          <Image
                            src="/images/coin-zone.png"
                            alt="Star"
                            width={12}
                            height={12}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 justify-between w-full">
                        <span className="text-white/50">Info result</span>
                        <div className="size-2 rounded-full bg-white/50" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex flex-col h-full bg-white/5 border border-white/10 rounded-xl backdrop-blur-lg overflow-hidden">
        <Accordion
          type="single"
          defaultValue="main-info"
          className="flex flex-col h-full"
        >
          <div className="flex flex-col gap-2 p-3 shrink-0">
            <AccordionItem
              value="main-info"
              className="border-none [&[data-state=open]>h3>button]:hidden flex flex-col"
            >
              <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>div]:bg-white/10 [&>svg]:hidden">
                <div className="w-full bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10 transition-colors">
                  <span className="text-white font-medium">Main Infos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden flex-1 data-[state=open]:flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="flex flex-col gap-4 pr-4 pb-4">
                    {/* Main Profile Image with Gallery */}
                    <div className="flex gap-2">
                      <div className="flex-1 aspect-square rounded overflow-hidden relative">
                        <Image
                          src={"/images/user.png"}
                          alt="Character"
                          fill
                          className="object-cover z-10"
                        />
                      </div>
                    </div>

                    <div className="bg-white/5 rounded p-3 flex-1 flex flex-col">
                      {/* Profile Info */}
                      <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">John Doe</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-white/10 rounded text-xs font-inter border border-white/10 flex">
                            <div className="border-r border-white/10 text-white/50 px-1 bg-white/5">
                              Level
                            </div>
                            <div className="font-volkhov px-2">12</div>
                          </div>
                          <div className="w-10 h-6 border border-white/10 rounded bg-white/10 flex items-center justify-center relative">
                            <Image
                              src="/images/badge.png"
                              alt="Badge"
                              width={26}
                              height={26}
                              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Stats List */}
                      <div className="flex flex-col gap-2 text-sm my-3">
                        <div className="flex justify-between items-center">
                          <span className="font-inter">Entreprise</span>
                          <span className="font-medium">{"-"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-inter">Reputations Points</span>
                          <span className="font-medium">345</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-inter">
                            Time passed in Raids
                          </span>
                          <span className="font-medium">246h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-inter">STAR earned</span>
                          <span className="font-medium">5 (0.02$)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-inter">Account creation</span>
                          <span className="font-medium">
                            {moment(new Date()).format("DD MMM YYYY")}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-5 gap-2 mt-auto">
                        <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12">
                          <HeartIcon
                            className={cn(
                              "w-5 h-5 mx-auto",
                              true && "fill-[#FF4141] text-[#FF4141]"
                            )}
                          />
                        </button>
                        <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12">
                          <MessageIcon className="w-5 h-5 mx-auto" />
                        </button>
                        <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12">
                          <AddUserIcon className="w-5 h-5 mx-auto" />
                        </button>
                        <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12">
                          <PlusIcon className="w-5 h-5 mx-auto" />
                        </button>
                        <Link
                          href={`https://x.com`}
                          target="_blank"
                          className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12 flex items-center justify-center"
                        >
                          <XLogo className="size-4 mx-auto" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="inventory"
              className="border-none [&[data-state=open]>h3>button]:hidden flex flex-col"
            >
              <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>div]:bg-white/10 [&>svg]:hidden">
                <div className="w-full bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10 transition-colors">
                  <span className="text-white font-medium">Inventory</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/50">Total worth</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white">4.567</span>
                      <Image
                        src="/images/logos/eth.png"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden flex-1 data-[state=open]:flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-2 gap-3 pr-4 pb-4">
                    {[1, 2, 3, 4, 5, 6].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white/5 rounded-xl p-3 flex flex-col"
                      >
                        <div className="aspect-square rounded-lg bg-white/5 mb-3 relative">
                          <Image
                            src="/images/user.png"
                            alt="Item"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                              Item Name
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded bg-[#FF41D6] text-white">
                              Legendary
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-white/50">Item Price</span>
                            <div className="flex items-center gap-1">
                              <span>250</span>
                              <Image
                                src="/images/star.png"
                                alt="Star"
                                width={12}
                                height={12}
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-white/50">Info result</span>
                            <div className="size-2 rounded-full bg-white/50" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="activity"
              className="border-none [&[data-state=open]>h3>button]:hidden flex flex-col"
            >
              <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>div]:bg-white/10 [&>svg]:hidden">
                <div className="w-full bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10 transition-colors">
                  <span className="text-white font-medium">Activity</span>
                  <button className="size-6 flex items-center justify-center bg-white/5 rounded border border-white/10">
                    <Grid2X2 className="size-4" />
                  </button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden flex-1 data-[state=open]:flex flex-col">
                <div className="flex-1 flex items-center justify-center text-white/50">
                  Activity content coming soon...
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        </Accordion>
      </div>
    </div>
  )
}

export default ProfilePage
