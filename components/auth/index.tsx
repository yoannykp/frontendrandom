"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useWallet } from "@/context/wallet"
import { AuthUserData } from "@/types"
import { AnimatePresence, motion } from "framer-motion"
import toast from "react-hot-toast"
import { FaXTwitter } from "react-icons/fa6"

import { authenticate } from "@/lib/api"
import BrandButton from "@/components/ui/brand-button"
import BackgroundCover from "@/components/common/background-cover"
import Footer from "@/components/common/footer"
import Header from "@/components/common/header"

import ConnectModal from "./connect-modal"
import CreateAlien from "./create-alien"
import InfoModal from "./info-modal"
import InviteCodeModal from "./invite-code-modal"
import LinkTwitter from "./link-twitter"
import Sliders from "./sliders"

const Home = () => {
  const [currentStep, setCurrentStep] = useState(0)

  const [userData, setUserData] = useState<AuthUserData>({
    name: "",
    code: "",
    country: "",
    twitterId: "",
    image: "",
    element: "0",
    strengthPoints: 0,
    hair: "0",
    face: "0",
  })

  const [isTwitterLinked, setIsTwitterLinked] = useState(false)

  const { isConnected, signer, isAuthenticated, setIsAuthenticated } =
    useWallet()
  const router = useRouter()

  const moveToPreviousStep = () => {
    if (currentStep === 0) return
    setCurrentStep((previous) => previous - 1)
  }

  const moveToNextStep = async () => {
    if (currentStep === 3) {
      handleAuthenticate()
      return
    }

    if (currentStep < 5) {
      setCurrentStep((previous) => previous + 1)
    } else {
      setCurrentStep(0)
    }
  }

  const moveToStep = (step: number) => {
    if (step > 0 && step < 5) {
      setCurrentStep(step)
    } else {
      setCurrentStep(0)
    }
  }

  const handleAuthenticate = async () => {
    if (!signer) {
      toast.error("Please connect your wallet")
      return
    }
    const signature = await signer.signMessage(
      process.env.NEXT_PUBLIC_SIGN_MESSAGE!
    )
    if (!signature) return
    setIsAuthenticated(true)
    const res = await authenticate({
      signature,
      signedMessage: process.env.NEXT_PUBLIC_SIGN_MESSAGE!,
      register: userData,
    })
    if (res.data) {
      router.push("/")
    }
  }

  return (
    <main className="w-full h-screen relative">
      <BackgroundCover url="/images/auth/bg.png" />
      {currentStep > 0 ? (
        <div className="fixed w-[100vw] h-[100vh] backdrop-blur-[10px] z-10"></div>
      ) : null}

      <div className="w-full h-screen relative max-w-7xl mx-auto py-10 px-6 flex flex-col justify-between items-center ">
        <Header />
        <AnimatePresence mode="wait">
          {currentStep > 0 && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="z-50 "
            >
              {currentStep == 1 ? (
                <ConnectModal
                  current={currentStep}
                  moveToPreviousStep={moveToPreviousStep}
                  moveToStep={moveToStep}
                />
              ) : currentStep == 20 ? (
                <InviteCodeModal
                  current={currentStep}
                  moveToPreviousStep={moveToPreviousStep}
                  moveToNextStep={moveToNextStep}
                />
              ) : currentStep == 2 ? (
                <CreateAlien
                  current={currentStep}
                  moveToPreviousStep={moveToPreviousStep}
                  moveToNextStep={moveToNextStep}
                  setUserData={setUserData}
                  userData={userData}
                />
              ) : currentStep == 3 ? (
                <InfoModal
                  current={currentStep}
                  moveToPreviousStep={moveToPreviousStep}
                  moveToNextStep={moveToNextStep}
                  setUserData={setUserData}
                  userData={userData}
                  isTwitterLinked={isTwitterLinked}
                />
              ) : currentStep == 50 ? (
                <LinkTwitter
                  current={currentStep}
                  moveToPreviousStep={moveToPreviousStep}
                  moveToNextStep={moveToNextStep}
                />
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-10 relative w-full flex flex-col items-center justify-center">
          <BrandButton
            className="items-center hover:scale-105 duration-500 transition-transform active:scale-95"
            blurColor="bg-[#9E96F4]"
            onClick={() => {
              setCurrentStep((previous) => previous + 1)
            }}
          >
            Log In with <FaXTwitter className="w-5 h-5" />
          </BrandButton>
          {currentStep > 0 ? (
            <Sliders current={currentStep} moveToNextStep={moveToNextStep} />
          ) : null}
          <Footer />
        </div>
      </div>
    </main>
  )
}

export default Home
