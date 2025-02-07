"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Pack } from "@/types"
import { Plus } from "lucide-react"

import { createCheckoutSession, getAllPacks } from "@/lib/api"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

const tabs = [
  {
    id: "star",
    label: "STAR",
    active: true,
  },
  {
    id: "zone",
    label: "ZONE",
    active: false,
  },
  {
    id: "swap",
    label: "Swap",
    active: false,
  },
]

const Page = () => {
  const [activeTab, setActiveTab] = useState("star")
  const [packs, setPacks] = useState<Pack[]>([])
  const [balance] = useState({
    zone: "3,621,000 ZONE",
    star: "151,600 STAR",
  })

  useEffect(() => {
    const fetchPacks = async () => {
      const response = await getAllPacks()
      if (response.data) {
        setPacks(response.data)
      }
    }
    fetchPacks()
  }, [])

  const handleBuy = async (pack: Pack) => {
    const response = await createCheckoutSession("PACK", pack.id)
    if (response.data) {
      window.open(response.data.url, "_blank")
    }
  }

  return (
    <>
      <div className="absolute top-10 left-24 flex gap-3 z-20 h-14 items-center max-lg:hidden">
        <h1 className="text-3xl ">Treasure</h1>
      </div>
      <div className="flex justify-end relative flex-1 rounded-xl lg:rounded-2xl overflow-hidden lg:min-h-[calc(100vh-40px)] max-lg:hidden">
        <div className="absolute inset-0 bg-[url('/images/pages/team-bg.jpg')] bg-cover bg-center bg-no-repeat lg:bg-[url('/images/pages/team-bg.jpg')]">
          <div className="absolute inset-0 bg-[#181818CC]"></div>
        </div>

        <div className="w-full z-10 pb-12 pr-8 pl-24 pt-28 relative flex flex-col gap-8 ">
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-lg">
            {/* Navigation Tabs */}
            <div className="flex  items-center gap-3">
              <div className="flex gap-3 flex-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "px-8 h-14 rounded-xl text-xl transition-all duration-300 flex-1 bg-white/10 border border-white/10",
                      activeTab === tab.id ? "bg-white/20" : "hover:bg-white/10"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Balance Display */}
              <div className="flex items-center gap-4 border border-white/10 rounded-xl px-4">
                <div className="flex h-14 items-center gap-2">
                  <Image
                    src="/images/coin-zone.png"
                    alt="ZONE"
                    width={24}
                    height={24}
                  />
                  <span>{balance.zone}</span>
                  <button className="ml-2 rounded-full p-1 border border-white/10">
                    <Plus size={12} />
                  </button>
                </div>
                <div className="flex h-14 items-center gap-2 ">
                  <Image
                    src="/images/stars.png"
                    alt="STAR"
                    width={24}
                    height={24}
                  />
                  <span>{balance.star}</span>
                  <button className="ml-2  rounded-full p-1 border border-white/10">
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Carousel Section */}
            <div className=" mt-4 bg-white/10 rounded px-2 py-4 ">
              <Carousel className="w-full ">
                <CarouselContent>
                  {packs.map((pack, index) => (
                    <CarouselItem
                      key={index}
                      className="  lg:basis-1/2 xl:basis-1/4 "
                    >
                      <div className="bg-white/10 p-4 rounded-lg flex flex-col gap-4  mx-2 border border-white/10 min-h-[500px] h-[calc(100vh-350px)]">
                        <div className="flex justify-between items-center border border-white/10  rounded-xl h-12 px-4">
                          <p>{pack.name}</p>
                          <button className="ml-2 rounded-full p-1 border border-white/10">
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="relative flex-1">
                          <Image
                            src={pack.image}
                            alt={pack.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div
                          className="bg-white/10 h-12 rounded flex items-center justify-between px-4"
                          onClick={() => handleBuy(pack)}
                        >
                          {/* <div className="flex items-center gap-2">
                            <p className="font-volkhov">{pack.price}</p>
                            <div className="flex items-center justify-center p-1 border border-white/10 rounded-full  ">
                              <Image
                                src="/images/stars.png"
                                alt="STAR"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div> */}
                          <div className="flex items-center gap-2 bg-white/10 rounded-lg border border-white/10 px-4 py-1 w-full justify-between">
                            <p className="">Buy for</p>
                            <p className="text-[#5FD7FF]">{pack.price}$</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col rounded-2xl glass-effect z-10 p-2 gap-3 lg:hidden flex-1 max-h-full">
        <div className=" bg-white/10 rounded px-2 py-4 ">
          <Carousel className="w-full ">
            <CarouselContent>
              {packs.map((pack, index) => (
                <CarouselItem
                  key={index}
                  className="  lg:basis-1/2 xl:basis-1/4 "
                >
                  <div className="bg-white/10 p-4 rounded-lg flex flex-col gap-4  mx-2 border border-white/10 min-h-[500px] h-[calc(100vh-250px)]">
                    <div className="flex justify-between items-center border border-white/10  rounded-xl h-12 px-4">
                      <p>{pack.name}</p>
                      <button className="ml-2 rounded-full p-1 border border-white/10">
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="relative flex-1">
                      <Image
                        src={pack.image}
                        alt={pack.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div
                      className="bg-white/10 h-12 rounded flex items-center justify-between px-4"
                      onClick={() => handleBuy(pack)}
                    >
                      {/* <div className="flex items-center gap-2">
                            <p className="font-volkhov">{pack.price}</p>
                            <div className="flex items-center justify-center p-1 border border-white/10 rounded-full  ">
                              <Image
                                src="/images/stars.png"
                                alt="STAR"
                                width={20}
                                height={20}
                              />
                            </div>
                          </div> */}
                      <div className="flex items-center gap-2 bg-white/10 rounded-lg border border-white/10 px-4 py-1 w-full justify-between">
                        <p className="">Buy for</p>
                        <p className="text-[#5FD7FF]">{pack.price}$</p>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Background Gradients */}
      <div
        className="fixed inset-0"
        style={{
          background:
            "radial-gradient(91.36% 91.36% at 31.6% 44.58%, rgba(0, 0, 0, 0) 0%, #000000 100%)",
        }}
      ></div>
    </>
  )
}

export default Page
