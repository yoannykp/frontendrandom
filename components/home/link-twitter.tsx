"use client"

import { FaXTwitter } from "react-icons/fa6"

import BrandButton from "../ui/brand-button"
import { Input } from "../ui/input"
import PreviousStepButton from "./previous-step-button"

const LinkTwitter = ({ current, moveToPreviousStep, moveToNextStep }: any) => {
  return (
    <div className="w-full md:w-[35rem] space-y-6 z-20">
      <div className="relative w-full flex items-center justify-between">
        <BrandButton className="items-start cursor-auto">
          Link Your Twitter
        </BrandButton>
        <PreviousStepButton
          current={current}
          moveToPreviousStep={moveToPreviousStep}
        />
      </div>
      <div className="p-6 rounded-normal border border-gray-light backdrop-blur-[40px] font-inter space-y-8">
        <div className="bg-gray-dark p-4 rounded-lg md:text-[16px]/[20px] text-[12px]/[19px]">
          By connecting your X account, you agree to{" "}
          <span className="border-b border-white">Terms of Service</span> and
          acknowledge that you have read and understand the{" "}
          <span className="border-b border-white">Protocol Disclaimer</span>.
        </div>

        <div className="space-y-4">
          <Input placeholder="Enter your @" />

          <BrandButton
            className="items-center hover:-translate-y-1 duration-500 transition-transform w-full"
            blurColor="bg-[#96DFF4]"
            onClick={() => moveToNextStep(current + 1)}
          >
            Link my <FaXTwitter className="w-4 h-4" /> account
          </BrandButton>
        </div>
      </div>
    </div>
  )
}

export default LinkTwitter
