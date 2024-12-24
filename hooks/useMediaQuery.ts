import { useEffect, useState } from "react"

// Tailwind CSS default breakpoints
const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

type BreakpointKey = keyof typeof breakpoints

export const useMediaQuery = (breakpoint: BreakpointKey) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const query = `(min-width: ${breakpoints[breakpoint]})`
    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add event listener
    mediaQuery.addEventListener("change", handler)

    // Cleanup
    return () => mediaQuery.removeEventListener("change", handler)
  }, [breakpoint])

  return matches
}

export default useMediaQuery
