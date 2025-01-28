import { useEffect, useState } from "react"

export const isPwa = () => {
  if (typeof window === "undefined") return false

  // Check if window.matchMedia is available
  if (!window.matchMedia) return false

  // Check if the site is running in standalone mode (iOS and Android)
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes("android-app://")

  // Check if the site was launched from the home screen
  const isPwaFromHomeScreen = window.matchMedia(
    "(display-mode: standalone)"
  ).matches

  return isStandalone || isPwaFromHomeScreen
}

export const usePwa = () => {
  const [isPwaMode, setIsPwaMode] = useState(false)

  useEffect(() => {
    setIsPwaMode(isPwa())

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleChange = (e: MediaQueryListEvent) => {
      setIsPwaMode(isPwa())
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  return isPwaMode
}
