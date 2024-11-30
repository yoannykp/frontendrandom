"use client"

import { FaXTwitter } from "react-icons/fa6"

import BrandButton from "../ui/brand-button"
import PreviousStepButton from "./previous-step-button"

const ConnectModal = ({ current, moveToPreviousStep, moveToNextStep }: any) => {
  const options = [
    { label: "Twitter", icon: <FaXTwitter className="w-5 h-5" /> },
    {
      label: "Continue with a wallet",
      icon: (
        <svg
          width="33"
          height="26"
          viewBox="0 0 33 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <path
            d="M32 7.75H1M1 13.75H6.49735C7.33465 13.75 7.75329 13.75 8.1581 13.8199C8.51742 13.8819 8.86796 13.9844 9.20246 14.1259C9.57931 14.285 9.92764 14.5098 10.6243 14.9593L11.5257 15.5407C12.2224 15.9902 12.5707 16.215 12.9475 16.3741C13.282 16.5156 13.6325 16.6181 13.9919 16.6801C14.3966 16.75 14.8153 16.75 15.6526 16.75H17.3474C18.1847 16.75 18.6033 16.75 19.0081 16.6801C19.3675 16.6181 19.718 16.5156 20.0524 16.3741C20.4292 16.215 20.7777 15.9902 21.4743 15.5407L22.3757 14.9593C23.0723 14.5098 23.4207 14.285 23.7976 14.1259C24.132 13.9844 24.4825 13.8819 24.8419 13.8199C25.2467 13.75 25.6653 13.75 26.5026 13.75H32M1 5.8V20.2C1 21.8801 1 22.7203 1.33788 23.362C1.63508 23.9265 2.10932 24.3854 2.69263 24.673C3.35575 25 4.22383 25 5.96 25H27.04C28.7762 25 29.6443 25 30.3074 24.673C30.8907 24.3854 31.365 23.9265 31.6621 23.362C32 22.7203 32 21.8801 32 20.2V5.8C32 4.11985 32 3.27976 31.6621 2.63803C31.365 2.07355 30.8907 1.61461 30.3074 1.32698C29.6443 1 28.7762 1 27.04 1H5.96C4.22384 1 3.35575 1 2.69263 1.32698C2.10934 1.61459 1.63508 2.07354 1.33788 2.63803C1 3.27976 1 4.11983 1 5.8Z"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  ]

  return (
    <div className="w-full md:w-[35rem] space-y-6 z-20">
      <div className="relative w-full flex items-center justify-between">
        <BrandButton className="items-start cursor-auto">
          Log In or Sign Up
        </BrandButton>

        <PreviousStepButton
          current={current}
          moveToPreviousStep={moveToPreviousStep}
        />
      </div>
      <div className="p-6 rounded-normal border border-gray-light backdrop-blur-[40px] font-inter space-y-8">
        <div className="bg-gray-dark p-4 rounded-lg text-off-white text-[12px]/[19px]">
          By connecting a wallet, you agree to{" "}
          <span className="white">Terms of Service</span> and acknowledge that
          you have read and understand the{" "}
          <span className="white">Protocol Disclaimer</span>.
        </div>

        <div className="w-full space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-5 flex items-center rounded-lg border border-gray-light gap-5 hover:bg-gray-light/10 transition duration-500 cursor-pointer"
              onClick={() => moveToNextStep(current + 1)}
            >
              {option.icon}
              <span>{option.label}</span>
            </div>
          ))}
        </div>
        <p className="text-off-white text-[12px]">© Protected by Privy</p>
      </div>
    </div>
  )
}

export default ConnectModal
