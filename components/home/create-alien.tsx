"use client"

import Image from "next/image"
import element1 from "@/public/elements/element-1.png"
import element2 from "@/public/elements/element-2.png"
import element3 from "@/public/elements/element-3.png"
import element4 from "@/public/elements/element-4.png"
import element5 from "@/public/elements/element-5.png"
import element6 from "@/public/elements/element-6.png"
import element7 from "@/public/elements/element-7.png"
import element8 from "@/public/elements/element-8.png"
import boyImage from "@/public/images/boy.png"

import PreviousStepButton from "../home/previous-step-button"
import BrandButton from "../ui/brand-button"

const elements = [
  { image: element1, isActive: false },
  { image: element2, isActive: false },
  { image: element3, isActive: false },
  { image: element4, isActive: true },
  { image: element5, isActive: false },
  { image: element6, isActive: false },
  { image: element7, isActive: false },
  { image: element8, isActive: false },
]

const CreateAlien = ({ current, moveToPreviousStep, moveToNextStep }: any) => {
  return (
    <div className="w-full space-y-6 z-20">
      <div className="relative w-full flex items-center justify-between">
        <BrandButton className="items-start cursor-auto">
          Create your Alien
        </BrandButton>

        <PreviousStepButton
          current={current}
          moveToPreviousStep={moveToPreviousStep}
        />
      </div>
      <div className="p-6 rounded-normal border border-gray-light backdrop-blur-[40px] flex flex-col lg:flex-row gap-4 overflow-hidden">
        <Image
          src={boyImage}
          alt="image"
          placeholder="blur"
          className="w-full lg:w-[462px] lg:h-[620px] h-auto object-cover rounded-normal"
        />

        <div className="w-full flex flex-col gap-8 overflow-hidden px-2">
          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-2xl">Choose your Element</h3>
              <p className="text-white text-[12px] font-inter">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
              {elements.map((element, index) => (
                <div
                  key={index}
                  className="w-20 h-20 p-0.5 rounded-lg shrink-0"
                  style={{
                    background: element.isActive
                      ? "linear-gradient(360deg, #5FFF95 0%, rgba(95, 255, 149, 0) 100%)"
                      : "unset",
                  }}
                >
                  <div className="w-full h-full bg-gray-dark rounded-lg flex items-center justify-center">
                    <Image
                      src={element.image}
                      alt="element image"
                      className="w-16 h-16"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-2xl">Choose your Hair</h3>
              <p className="text-off-white text-[12px] font-inter">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
              {elements.map((element, index) => (
                <div
                  key={index}
                  className="min-w-20 h-20 p-0.5 rounded-lg"
                  style={{
                    background: element.isActive
                      ? "linear-gradient(360deg, #5FFF95 0%, rgba(95, 255, 149, 0) 100%)"
                      : "unset",
                  }}
                >
                  <div className="w-full h-full bg-gray-dark rounded-lg flex items-center justify-center"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-2xl">Choose your Face</h3>
              <p className="text-white text-[12px] font-inter">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap max-w-full no-scrollbar">
              {elements.map((element, index) => (
                <div
                  key={index}
                  className="min-w-20 h-20 p-0.5 rounded-lg"
                  style={{
                    background: element.isActive
                      ? "linear-gradient(360deg, #5FFF95 0%, rgba(95, 255, 149, 0) 100%)"
                      : "unset",
                  }}
                >
                  <div className="w-full h-full bg-gray-dark rounded-lg flex items-center justify-center"></div>
                </div>
              ))}
            </div>
          </div>

          <BrandButton
            className="items-start hover:-translate-y-1 duration-500 transition-transform w-full"
            blurColor="bg-[#96DFF4]"
            onClick={() => moveToNextStep(current + 1)}
          >
            Continue
          </BrandButton>
        </div>
      </div>
    </div>
  )
}

export default CreateAlien
