"use client"

import { Dispatch, SetStateAction } from "react"
import { useWallet } from "@/context/wallet"
import { AuthUserData } from "@/types"
import toast from "react-hot-toast"

import { authenticate } from "@/lib/api"
import { sanitizeInput } from "@/lib/utils"
import BrandButton from "@/components/ui/brand-button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import PreviousStepButton from "@/components/auth/previous-step-button"
// import countries from /assets/counties.json
import countries from "@/app/assets/countries.json"

interface InfoModalProps {
  current: number
  moveToPreviousStep: () => void
  moveToNextStep: () => void
  setUserData: Dispatch<SetStateAction<AuthUserData>>
  userData: AuthUserData
  isTwitterLinked: boolean
}

const InfoModal = ({
  current,
  moveToPreviousStep,
  moveToNextStep,
  setUserData,
  userData,
  isTwitterLinked,
}: InfoModalProps) => {
  const { signer, setIsAuthenticated } = useWallet()

  const handleMoveToNextStep = async () => {
    if (!userData.name || !userData.country) {
      toast.error("Please fill all fields")
      return
    }

    if (!userData.email) {
      toast.error("Email is not linked to your wallet")
      return
    }

    if (!signer) {
      toast.error("Please connect your wallet")
      return
    }

    try {
      const signature = await signer.signMessage(
        process.env.NEXT_PUBLIC_SIGN_MESSAGE!
      )
      if (!signature) {
        toast.error("Failed to sign message")
        return
      }

      const res = await authenticate({
        signature,
        signedMessage: process.env.NEXT_PUBLIC_SIGN_MESSAGE!,
        register: userData,
      })

      if (res.error) {
        toast.error(res.error.message || "Authentication failed")
        return
      }

      if (userData.refferalCode) {
        localStorage.removeItem("refferalCode")
      }
      setIsAuthenticated(true)
      moveToNextStep()
    } catch (error) {
      toast.error("Authentication failed. Please try again.")
    }
  }

  return (
    <div className="w-full space-y-6 z-20 max-w-[562px]">
      <div className="relative w-full flex items-center justify-between">
        <BrandButton className="items-start cursor-auto bg-gray-200/5">
          Your Informations
        </BrandButton>

        <PreviousStepButton
          current={current}
          moveToPreviousStep={moveToPreviousStep}
        />
      </div>
      <div className="p-6 rounded-normal border border-gray-light backdrop-blur-[80px] flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* <Image
          src={character}
          alt="image"
          placeholder="blur"
          className="w-full lg:w-[462px] lg:h-[620px] object-cover rounded-normal"
        /> */}

        <div className="w-full flex flex-col overflow-hidden justify-between px-2">
          <div className="gap-8 flex flex-col">
            <div className="space-y-3">
              <div className="flex w-full justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl">Choose your Name</h3>
                  <p className="text-white text-[12px] font-inter">
                    Choose it wisely you cannot modify your name later.
                  </p>
                </div>

                {isTwitterLinked && (
                  <div className="p-1.5 px-2 text-[12px] rounded-full bg-blue-400 h-max flex gap-1 items-center">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15 7.5C14.9856 6.98435 14.8284 6.48228 14.545 6.05045C14.2625 5.61941 13.8649 5.27458 13.3972 5.05587C13.5752 4.57136 13.6127 4.04693 13.5089 3.54167C13.4044 3.0356 13.1601 2.56944 12.8049 2.19508C12.4298 1.83988 11.9644 1.59642 11.4583 1.49106C10.9531 1.38729 10.4286 1.42481 9.94413 1.60281C9.72621 1.13426 9.38218 0.735951 8.95035 0.453384C8.51852 0.170817 8.01644 0.0127714 7.5 0C6.98435 0.0135696 6.48388 0.170019 6.05284 0.453384C5.62181 0.73675 5.27937 1.13506 5.06306 1.60281C4.57775 1.42481 4.05172 1.3857 3.54486 1.49106C3.03799 1.59483 2.57104 1.83908 2.19588 2.19508C1.84068 2.57024 1.59802 3.0372 1.49505 3.54246C1.39128 4.04773 1.43119 4.57216 1.60999 5.05587C1.14144 5.27458 0.742337 5.61861 0.458174 6.04965C0.17401 6.48068 0.015166 6.98356 0 7.5C0.0159642 8.01644 0.17401 8.51852 0.458174 8.95035C0.742337 9.38139 1.14144 9.72621 1.60999 9.94413C1.43119 10.4278 1.39128 10.9523 1.49505 11.4575C1.59882 11.9636 1.84068 12.4298 2.19508 12.8049C2.57024 13.1585 3.0364 13.4012 3.54167 13.5057C4.04693 13.6111 4.57136 13.5728 5.05587 13.3972C5.27458 13.8649 5.61861 14.2625 6.05045 14.5458C6.48148 14.8284 6.98435 14.9856 7.5 15C8.01644 14.9872 8.51852 14.83 8.95035 14.5474C9.38218 14.2648 9.72621 13.8657 9.94413 13.398C10.4262 13.5888 10.9547 13.6343 11.4631 13.5289C11.9708 13.4235 12.4369 13.1721 12.8041 12.8049C13.1713 12.4377 13.4235 11.9716 13.5289 11.4631C13.6343 10.9547 13.5888 10.4262 13.3972 9.94413C13.8649 9.72542 14.2625 9.38139 14.5458 8.94955C14.8284 8.51852 14.9856 8.01565 15 7.5ZM6.43199 10.5731L3.69492 7.83685L4.72701 6.79757L6.38091 8.45147L9.89304 4.62484L10.9682 5.61941L6.43199 10.5731Z"
                        fill="#F7F9F9"
                      />
                    </svg>
                    <p className="font-inter">Twitter Linked</p>
                  </div>
                )}
              </div>

              <Input
                placeholder="Enter your name"
                value={userData?.name}
                onChange={(e) =>
                  setUserData({ ...userData, name: sanitizeInput(e) })
                }
              />
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <h3 className="text-2xl">Choose your Country</h3>
                <p className="text-white text-[12px] font-inter">
                  Choose your country to get the best experience.
                </p>
              </div>
              <Select
                defaultValue={userData?.country}
                onValueChange={(value) =>
                  setUserData({ ...userData, country: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      value={country.name.toLowerCase()}
                      key={country.name}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <BrandButton
            className="items-start hover:-translate-y-1 duration-500 transition-transform w-full mt-10"
            blurColor="bg-[#96DFF4]"
            onClick={handleMoveToNextStep}
          >
            Continue
          </BrandButton>
        </div>
      </div>
    </div>
  )
}

export default InfoModal
