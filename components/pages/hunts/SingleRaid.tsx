import React from "react"
import Image from "next/image"

import BrandButton from "@/components/ui/brand-button"

const SingleRaid = () => {
  return (
    <div className="bg-white/10 rounded-sm lg:rounded-2xl p-2 lg:p-4">
      <div className="lg:bg-white/10  rounded-xl lg:p-4 mb-4">
        <div className="flex items-center gap-4 flex-col lg:flex-row">
          <div className="lg:bg-white/10  rounded-lg lg:p-4 max-lg:w-full ">
            <Image
              src="/images/raids/raid-1.jpg"
              alt="Raid"
              width={500}
              height={500}
              className="object-cover lg:aspect-auto lg:max-w-[190px] lg:max-h-[190px] rounded-lg max-lg:h-32"
            />
          </div>
          <div>
            <div className="flex items-center gap-4 max-lg:justify-between">
              <div className="flex  gap-4 items-center">
                <h2 className=" lg:text-3xl font-inter  lg:font-volkhov ">
                  Nisshoku Encounter
                </h2>
                <span className="text-xs text-white/50 font-inter">
                  2h <span className="hidden lg:inline">left</span>
                </span>
              </div>
              <div className=" bg-white/10 rounded-full p-px">
                <Image
                  src="/images/raids/raid-1_icon.png"
                  alt="Raid"
                  width={30}
                  height={30}
                  className="object-cover size-4 lg:size-6"
                />
              </div>
            </div>
            <p className="text-white/50 text-sm mt-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              sagittis ipsum sit amet tortor efficitur volutpat. Nullam a quam
              efficitur, sagittis est non, vestibulum ligula. Praesent et dolor
              lorem. Suspendisse sodales varius tempor. Suspendisse ullamcorper
              elit in sapien venenatis fermentum. Phasellus egestas, urna
              sagittis interdum ornare, lectus nunc pharetra nisl, et hendrerit
              ligula urna vitae lacus. Sed ac dui nibh.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 lg:border p-4 rounded-lg max-lg:bg-white/10">
        <h2 className="text-xs lg:text-lg font-inter mb-4">Rewards</h2>
        <div className="grid grid-cols-1 gap-2 lg:gap-4">
          <div className="glass-effect p-2 lg:p-4 rounded-xl flex flex-col items-center relative overflow-hidden  lg:min-h-[150px] justify-center">
            <Image
              src="/images/star.png"
              alt="Star"
              width={500}
              height={500}
              className="object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 lg:size-[400px] opacity-10"
            />
            <div className="relative size-8 lg:size-20 mb-2">
              <Image
                src="/images/star.png"
                alt="Star"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[8px] lg:text-sm">+ 500 STAR</span>
          </div>
        </div>
      </div>

      <BrandButton className=" w-full" blurColor="bg-[#EF98E6]">
        Launch Hunt
      </BrandButton>
    </div>
  )
}

export default SingleRaid
