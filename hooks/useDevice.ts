import { useEffect, useState } from "react"

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

interface DeviceInfo {
  // Browser detection
  isChrome: boolean
  isExplorer: boolean
  isExplorer_11: boolean
  isFirefox: boolean
  isSafari: boolean
  isOpera: boolean
  isEdgeDesktop: boolean
  isEdgeiOS: boolean
  isEdgeAndroid: boolean

  // Device type
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean

  // PWA state
  isStandalone: boolean
  canInstallPWA: boolean

  // UI helpers
  shareButtonPosition: "top" | "bottom"
  userAgent: string
}

export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    // Browser
    isChrome: false,
    isExplorer: false,
    isExplorer_11: false,
    isFirefox: false,
    isSafari: false,
    isOpera: false,
    isEdgeDesktop: false,
    isEdgeiOS: false,
    isEdgeAndroid: false,

    // Device
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isTablet: false,
    isDesktop: false,

    // PWA
    isStandalone: false,
    canInstallPWA: false,

    // UI
    shareButtonPosition: "bottom",
    userAgent: "",
  })

  // For PWA installation
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)

  const checkDeviceInfo = () => {
    if (typeof window === "undefined") return

    const userAgent = navigator.userAgent.toLowerCase()
    const uaString = userAgent

    // Basic browser detection
    let isChrome = /chrome/.test(uaString)
    const isExplorer = /msie/.test(uaString)
    const isExplorer_11 = /rv:11/.test(uaString)
    const isFirefox = /firefox/.test(uaString)
    let isSafari = /safari/.test(uaString)
    const isOpera = /opr/.test(uaString)
    const isEdgeDesktop = /edge/.test(uaString)
    const isEdgeiOS = /edgios/.test(uaString)
    const isEdgeAndroid = /edga/.test(uaString)

    // Device detection
    const isIOS = /ipad|iphone|ipod/.test(uaString)
    const isAndroid = /android/.test(uaString)
    const isMobile = /mobile/.test(uaString) || isIOS || isAndroid
    const isTablet = /tablet|ipad/.test(uaString) || (isAndroid && !isMobile)
    const isDesktop = !isMobile && !isTablet

    // Adjust browser detection based on combinations
    if (isChrome && isSafari) isSafari = false
    if (isChrome && (isEdgeDesktop || isEdgeiOS || isEdgeAndroid))
      isChrome = false
    if (isSafari && (isEdgeDesktop || isEdgeiOS || isEdgeAndroid))
      isSafari = false
    if (isChrome && isOpera) isChrome = false

    // PWA detection
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://")

    setDeviceInfo({
      // Browser
      isChrome,
      isExplorer,
      isExplorer_11,
      isFirefox,
      isSafari,
      isOpera,
      isEdgeDesktop,
      isEdgeiOS,
      isEdgeAndroid,

      // Device
      isIOS,
      isAndroid,
      isMobile,
      isTablet,
      isDesktop,

      // PWA
      isStandalone,
      canInstallPWA: !isStandalone && (isMobile || isTablet),

      // UI
      shareButtonPosition: /ipad/.test(uaString) ? "top" : "bottom",
      userAgent,
    })
  }

  useEffect(() => {
    checkDeviceInfo()

    // // Handle PWA installation prompt
    // const handleBeforeInstallPrompt = (e: Event) => {
    //   e.preventDefault()
    //   setDeferredPrompt(e as BeforeInstallPromptEvent)
    //   setDeviceInfo((prev) => ({ ...prev, canInstallPWA: true }))
    // }

    // // Handle successful PWA installation
    // const handleAppInstalled = () => {
    //   setDeviceInfo((prev) => ({
    //     ...prev,
    //     canInstallPWA: false,
    //   }))
    //   setDeferredPrompt(null)
    // }

    // // Add event listeners
    // window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    // window.addEventListener("appinstalled", handleAppInstalled)

    // Handle resize for responsive updates
    window.addEventListener("resize", checkDeviceInfo)

    // Cleanup
    return () => {
      // window.removeEventListener(
      //   "beforeinstallprompt",
      //   handleBeforeInstallPrompt
      // )
      // window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("resize", checkDeviceInfo)
    }
  }, [])

  return {
    ...deviceInfo,
  }
}
