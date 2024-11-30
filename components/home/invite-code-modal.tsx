"use client"

import BrandButton from "../ui/brand-button"
import { Input } from "../ui/input"
import PreviousStepButton from "./previous-step-button"

const InviteCodeModal = ({
  current,
  moveToPreviousStep,
  moveToNextStep,
}: any) => {
  return (
    <div className="w-full md:w-[35rem] space-y-6 z-20">
      <div className="relative w-full flex items-center justify-between">
        <BrandButton className="items-start cursor-auto">
          Your Invite Code
        </BrandButton>
        <PreviousStepButton
          current={current}
          moveToPreviousStep={moveToPreviousStep}
        />
      </div>
      <div className="p-6 rounded-normal border border-gray-light backdrop-blur-[40px] font-inter space-y-8">
        <div className="bg-gray-dark p-4 rounded-lg md:text-[16px]/[20px] text-[12px]/[19px]">
          Alienzone is currently in beta. Get an invite code to start playing!
          The easiest way to get an invite code is to join our{" "}
          <span className="border-b border-white">Telegram</span>.
        </div>

        <div className="space-y-4">
          <Input placeholder="Enter your code" />

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

export default InviteCodeModal
