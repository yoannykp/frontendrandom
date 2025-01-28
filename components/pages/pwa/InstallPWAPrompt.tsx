"use client"

import { usePwa } from "@/hooks/isPwa"
import { useDevice } from "@/hooks/useDevice"

export function InstallPWAPrompt() {
  const { isIOS, isMobile, isStandalone, canInstallPWA, shareButtonPosition } =
    useDevice()
  const deviceInfo = useDevice()

  const isPwaMode = usePwa()
  if (isPwaMode || !isMobile) return null
  if (!canInstallPWA && !isIOS) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-gray-dark rounded-xl p-6 w-full max-w-sm space-y-6">
        {isPwaMode ? "pwa" : "not pwa"}
        {isStandalone ? "standalone" : "not standalone"}
        {/* <div className="whitespace-pre-wrap">
        {JSON.stringify(deviceInfo, null, 2)}
      </div> */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-center">
              Add To Home Screen
            </h3>
            <p className="text-sm text-gray-300 mt-2 text-center">
              To install the app, you need to add this website to your home
              screen.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {isIOS ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-300">
                In your Safari browser menu:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                <li>
                  Tap the Share button{" "}
                  {shareButtonPosition === "top" ? "(top)" : "(bottom)"}
                </li>
                <li>Scroll down and tap &apos;Add to Home Screen&apos;</li>
                <li>Tap &apos;Add&apos; to confirm</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-300">In your browser menu:</p>
              <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1">
                <li>Tap the menu button (three dots)</li>
                <li>
                  Tap &apos;Install App&apos; or &apos;Add to Home Screen&apos;
                </li>
                <li>Tap &apos;Install&apos; to confirm</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
