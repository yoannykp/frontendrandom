import { forwardRef, useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

import { useIsMobile } from "@/hooks/useIsMobile"

interface AlienRendererProps {
  selectedTraits: {
    hair: string
    eyes: string
    mouth: string
    element: string
    body: string
    marks: string
    powers: string
    accessories: string
    background: string
  }
  element: string
}

// Cache for loaded images with a timestamp to help with cache busting
const imageCache: {
  [key: string]: { img: HTMLImageElement; timestamp: number }
} = {}

// Background image cache to prevent flickering
const backgroundCache: { [key: string]: string } = {}

// Base images that don't change
const BASE_IMAGES = [
  "/images/alien/body/body.png",
  "/images/alien/body/head.png",
  "/images/alien/body/cothes.png",
]

// Helper function to get proxied URL for trait images
const getProxiedUrl = (src: string): string => {
  // Don't proxy local images (base images)
  if (src.startsWith("/")) {
    return src
  }
  // Use image proxy for external images (traits)
  return `/api/image-proxy?url=${encodeURIComponent(src)}`
}

// Preload an image and store in cache
const preloadImage = (
  src: string,
  forceFresh = false
): Promise<HTMLImageElement> => {
  // Skip empty or invalid URLs
  if (!src || typeof src !== "string" || src.trim() === "") {
    return Promise.reject(new Error(`Invalid image source: ${src}`))
  }
  // Get proxied URL for trait images
  const proxiedSrc = getProxiedUrl(src)

  // Add cache busting parameter to avoid browser cache issues
  const cacheBustedSrc = forceFresh
    ? `${proxiedSrc}?cb=${Date.now()}`
    : proxiedSrc

  // Return cached image if available and not forcing a fresh load
  if (imageCache[src] && !forceFresh) {
    // If cached version is older than 5 minutes, refresh in background but still return cached
    const CACHE_TTL = 5 * 60 * 1000 // 5 minutes
    if (Date.now() - imageCache[src].timestamp > CACHE_TTL) {
      // Refresh the cache in the background
      refreshCachedImage(src)
    }
    return Promise.resolve(imageCache[src].img)
  }

  return new Promise((resolve, reject) => {
    const img = new Image()

    // Add proper error handling
    img.onerror = () => {
      console.error(`Failed to load image: ${cacheBustedSrc}`)
      // Try one more time with cache busting if not already forcing fresh
      if (!forceFresh) {
        console.log(`Retrying with cache busting for: ${src}`)
        preloadImage(src, true).then(resolve).catch(reject)
      } else {
        reject(new Error(`Failed to load image: ${src}`))
      }
    }

    img.onload = () => {
      imageCache[src] = {
        img: img,
        timestamp: Date.now(),
      }
      resolve(img)
    }

    // Set crossOrigin to anonymous for all images
    img.crossOrigin = "anonymous"
    img.src = cacheBustedSrc
  })
}

// Helper function to refresh cached images in the background
const refreshCachedImage = (src: string) => {
  const freshImg = new Image()
  freshImg.crossOrigin = "anonymous"
  freshImg.onload = () => {
    imageCache[src] = {
      img: freshImg,
      timestamp: Date.now(),
    }
    console.log(`Refreshed cached image: ${src}`)
  }
  freshImg.src = `${getProxiedUrl(src)}?cb=${Date.now()}` // Add cache busting
}

// Clear all items from the cache that are older than the specified time
const clearStaleCache = (maxAge = 10 * 60 * 1000) => {
  // Default 10 minutes
  const now = Date.now()
  Object.keys(imageCache).forEach((key) => {
    // Don't clear base images from cache
    if (BASE_IMAGES.includes(key)) return

    if (now - imageCache[key].timestamp > maxAge) {
      delete imageCache[key]
    }
  })
}

// Helper function to get or create a cached background URL
const getCachedBackgroundUrl = (elementUrl: string): string => {
  if (!elementUrl || !elementUrl.includes(".png")) {
    return ""
  }

  const bgUrl = elementUrl.replace(".png", "-bg.png")

  // If we already have this background URL cached, return it
  if (backgroundCache[elementUrl]) {
    return backgroundCache[elementUrl]
  }

  // Otherwise, create a new cached URL with a cache-busting parameter
  // that will remain consistent for this session
  const cachedUrl = `${bgUrl}?cb=${Date.now()}`
  backgroundCache[elementUrl] = cachedUrl
  return cachedUrl
}

// Preload base images once at the start
const preloadBaseImages = async () => {
  try {
    await Promise.all(BASE_IMAGES.map((src) => preloadImage(src)))
    console.log("Base images preloaded successfully")
  } catch (error) {
    console.error("Failed to preload base images:", error)
  }
}

// Initialize base image preloading
preloadBaseImages()

export const RenderAlien = forwardRef<HTMLCanvasElement, AlienRendererProps>(
  ({ selectedTraits, element }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const localCanvasRef = useRef<HTMLCanvasElement>(null)
    const hiddenCanvasRef = useRef<HTMLCanvasElement>(null)
    const bufferCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isImagesLoaded, setIsImagesLoaded] = useState(false)
    const [loadingAttempted, setLoadingAttempted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [baseImagesLoaded, setBaseImagesLoaded] = useState(false)
    const [isTraitsChanging, setIsTraitsChanging] = useState(false)
    const previousTraitsRef = useRef({
      hair: "",
      eyes: "",
      mouth: "",
      element: "",
      body: "",
      marks: "",
      powers: "",
      accessories: "",
      background: "",
    })
    const [pendingTraits, setPendingTraits] = useState({
      hair: "",
      eyes: "",
      mouth: "",
      element: "",
      body: "",
      marks: "",
      powers: "",
      accessories: "",
      background: "",
    })

    const canvasRef =
      (ref as React.RefObject<HTMLCanvasElement>) || hiddenCanvasRef

    // High resolution output scale
    const OUTPUT_SCALE = 1
    const isMobile = useIsMobile()

    // Load base images on initial component mount only
    useEffect(() => {
      const loadBaseImages = async () => {
        try {
          await Promise.all(BASE_IMAGES.map((src) => preloadImage(src)))
          setBaseImagesLoaded(true)
        } catch (error) {
          console.error("Failed to load base images:", error)
          // Still mark as loaded to continue
          setBaseImagesLoaded(true)
        }
      }

      if (!baseImagesLoaded) {
        loadBaseImages()
      }
    }, [baseImagesLoaded])

    // Get base image dimensions from the first loaded image
    const getBaseDimensions = (): { width: number; height: number } => {
      if (imageCache["/images/alien/body/body.png"]) {
        const bodyImage = imageCache["/images/alien/body/body.png"].img
        return {
          width: bodyImage.naturalWidth,
          height: bodyImage.naturalHeight,
        }
      }
      return { width: 462, height: 462 } // Fallback dimensions
    }

    // Check if only trait images have changed (not base images)
    const haveTraitsChanged = () => {
      const prev = previousTraitsRef.current
      return (
        prev.hair !== selectedTraits.hair ||
        prev.eyes !== selectedTraits.eyes ||
        prev.mouth !== selectedTraits.mouth ||
        prev.element !== element ||
        prev.body !== selectedTraits.body ||
        prev.marks !== selectedTraits.marks ||
        prev.powers !== selectedTraits.powers ||
        prev.accessories !== selectedTraits.accessories ||
        prev.background !== selectedTraits.background
      )
    }

    // Check if only user-selected traits have changed (not element or base)
    const haveUserTraitsChanged = () => {
      const prev = previousTraitsRef.current
      return (
        prev.hair !== selectedTraits.hair ||
        prev.eyes !== selectedTraits.eyes ||
        prev.mouth !== selectedTraits.mouth ||
        prev.body !== selectedTraits.body ||
        prev.marks !== selectedTraits.marks ||
        prev.powers !== selectedTraits.powers ||
        prev.accessories !== selectedTraits.accessories ||
        prev.background !== selectedTraits.background
      )
    }

    // Preload trait images when traits change
    useEffect(() => {
      // Only trigger full reload if traits have actually changed
      if (!haveTraitsChanged() && loadingAttempted && !isLoading) {
        return
      }

      // Store the new traits as pending
      setPendingTraits({
        hair: selectedTraits.hair,
        eyes: selectedTraits.eyes,
        mouth: selectedTraits.mouth,
        element: element,
        body: selectedTraits.body,
        marks: selectedTraits.marks,
        powers: selectedTraits.powers,
        accessories: selectedTraits.accessories,
        background: selectedTraits.background,
      })

      // Determine if only user traits changed
      const onlyUserTraitsChanged =
        haveUserTraitsChanged() && previousTraitsRef.current.element === element

      // Set transition state
      setIsTraitsChanging(onlyUserTraitsChanged)

      // Clear stale cache entries periodically
      clearStaleCache()

      setLoadingAttempted(true)

      // Only show loading indicator for initial load
      if (!loadingAttempted) {
        setIsLoading(true)
      }

      const loadTraitImages = async () => {
        try {
          // Create an array of new trait image sources
          const traitImageSources = [
            ...(selectedTraits.eyes ? [selectedTraits.eyes] : []),
            ...(selectedTraits.hair ? [selectedTraits.hair] : []),
            ...(selectedTraits.mouth ? [selectedTraits.mouth] : []),
            ...(selectedTraits.body ? [selectedTraits.body] : []),
            ...(selectedTraits.marks ? [selectedTraits.marks] : []),
            ...(selectedTraits.powers ? [selectedTraits.powers] : []),
            ...(selectedTraits.accessories ? [selectedTraits.accessories] : []),
            ...(selectedTraits.background ? [selectedTraits.background] : []),
            ...(element ? [element] : []),
          ]

          // Filter out empty or invalid URLs
          const validImageSources = traitImageSources.filter(
            (src) => src && typeof src === "string" && src.trim() !== ""
          )

          // Load all new images first
          await Promise.all(
            validImageSources.map((src) =>
              preloadImage(src).catch((err) => {
                console.error(`Failed to load image: ${src}`, err)
                return null
              })
            )
          )

          // Only update the reference to current traits after all images are loaded
          previousTraitsRef.current = {
            hair: selectedTraits.hair,
            eyes: selectedTraits.eyes,
            mouth: selectedTraits.mouth,
            element: element,
            body: selectedTraits.body,
            marks: selectedTraits.marks,
            powers: selectedTraits.powers,
            accessories: selectedTraits.accessories,
            background: selectedTraits.background,
          }

          setIsImagesLoaded(true)

          // Set loading states to false after ensuring images are loaded
          setTimeout(
            () => {
              setIsLoading(false)
              setIsTraitsChanging(false)
            },
            onlyUserTraitsChanged ? 100 : 300
          )
        } catch (error) {
          console.error("Error in loadAllImages:", error)
          if (Object.keys(imageCache).length > 0) {
            console.log(
              "Some images were loaded, attempting to render with available images"
            )
            setIsImagesLoaded(true)
            setTimeout(
              () => {
                setIsLoading(false)
                setIsTraitsChanging(false)
              },
              onlyUserTraitsChanged ? 100 : 300
            )
          }
        }
      }

      loadTraitImages()
    }, [
      selectedTraits.eyes,
      selectedTraits.mouth,
      selectedTraits.hair,
      selectedTraits.body,
      selectedTraits.marks,
      selectedTraits.powers,
      selectedTraits.accessories,
      selectedTraits.background,
      element,
    ])

    // Trigger rendering whenever traits change or images load
    useEffect(() => {
      // Attempt to render even if not all images are loaded
      // This ensures we show whatever we have available
      if (!loadingAttempted || !baseImagesLoaded) return

      const renderAlien = () => {
        const displayCanvas = localCanvasRef.current
        const outputCanvas = canvasRef.current
        const bufferCanvas = bufferCanvasRef.current
        if (!displayCanvas || !outputCanvas || !bufferCanvas) {
          console.error("Canvas references not found")
          return
        }

        // Get natural dimensions from base image
        const { width: naturalWidth, height: naturalHeight } =
          getBaseDimensions()

        // Set up all canvases with correct dimensions
        const setupCanvas = (canvas: HTMLCanvasElement, scale: number = 1) => {
          canvas.width = naturalWidth * scale
          canvas.height = naturalHeight * scale
        }

        setupCanvas(displayCanvas)
        setupCanvas(bufferCanvas)
        setupCanvas(outputCanvas, OUTPUT_SCALE)

        const displayCtx = displayCanvas.getContext("2d", {
          alpha: true,
          willReadFrequently: true,
          preserveDrawingBuffer: true,
        }) as CanvasRenderingContext2D
        const outputCtx = outputCanvas.getContext("2d", {
          alpha: true,
        }) as CanvasRenderingContext2D
        const bufferCtx = bufferCanvas.getContext("2d", {
          alpha: true,
        }) as CanvasRenderingContext2D

        if (!displayCtx || !outputCtx || !bufferCtx) {
          console.error("Failed to get canvas contexts")
          return
        }

        const drawAlien = async (
          ctx: CanvasRenderingContext2D,
          scale: number = 1,
          showBackground: boolean
        ) => {
          const width = naturalWidth * scale
          const height = naturalHeight * scale

          // Clear canvas with transparency
          ctx.clearRect(0, 0, width, height)

          try {
            // Set initial opacity
            if (isLoading && !loadingAttempted) {
              ctx.globalAlpha = 0.6 // Reduced opacity only during initial load
            } else {
              ctx.globalAlpha = 1.0 // Full opacity for all other states
            }

            // Helper function to draw image maintaining aspect ratio
            const drawImage = (src: string, isBasePart = false) => {
              if (!src || typeof src !== "string" || src.trim() === "") {
                return false
              }

              if (imageCache[src]) {
                // Special handling for accessories - move them up by adjusting y position
                if (
                  src === selectedTraits.accessories ||
                  src === previousTraitsRef.current.accessories
                ) {
                  // Move accessories up by 20 pixels (adjust this value as needed)
                  ctx.drawImage(
                    imageCache[src].img,
                    0,
                    -20 * scale,
                    width,
                    height
                  )
                } else {
                  ctx.drawImage(imageCache[src].img, 0, 0, width, height)
                }
                return true
              } else if (!isBasePart) {
                // For non-base parts (traits), try to use the previous trait if available
                const prevSrc =
                  previousTraitsRef.current[
                    src === pendingTraits.hair
                      ? "hair"
                      : src === pendingTraits.eyes
                        ? "eyes"
                        : src === pendingTraits.mouth
                          ? "mouth"
                          : src === pendingTraits.body
                            ? "body"
                            : src === pendingTraits.marks
                              ? "marks"
                              : src === pendingTraits.powers
                                ? "powers"
                                : src === pendingTraits.accessories
                                  ? "accessories"
                                  : src === pendingTraits.background
                                    ? "background"
                                    : "element"
                  ]
                if (prevSrc && imageCache[prevSrc]) {
                  ctx.drawImage(imageCache[prevSrc].img, 0, 0, width, height)
                  return true
                }
              }

              // Try to load the image if not in cache
              const img = new Image()
              img.crossOrigin = "anonymous"
              img.onload = () => {
                imageCache[src] = { img, timestamp: Date.now() }
                ctx.drawImage(img, 0, 0, width, height)
                drawAlien(ctx, scale, showBackground)
              }
              img.onerror = () => {
                console.error(`Failed to load image on-demand: ${src}`)
                const retryImg = new Image()
                retryImg.crossOrigin = "anonymous"
                retryImg.onload = () => {
                  imageCache[src] = { img: retryImg, timestamp: Date.now() }
                  ctx.drawImage(retryImg, 0, 0, width, height)
                  drawAlien(ctx, scale, showBackground)
                }
                const proxiedSrc = getProxiedUrl(src)
                retryImg.src = `${proxiedSrc}?cb=${Date.now()}`
              }
              const proxiedSrc = getProxiedUrl(src)
              img.src = proxiedSrc
              return false
            }

            // Only draw default body if no custom body is selected
            const bodySrc = imageCache[selectedTraits.body]
              ? selectedTraits.body
              : previousTraitsRef.current.body
            if (!bodySrc || bodySrc === "/images/alien/body/body.png") {
              drawImage("/images/alien/body/body.png", true)
              drawImage("/images/alien/body/cothes.png", true)
            } else {
              drawImage(bodySrc)
            }

            // Draw head
            drawImage("/images/alien/body/head.png", true)

            // Draw traits - use new trait if loaded, otherwise keep previous
            const eyesSrc = imageCache[selectedTraits.eyes]
              ? selectedTraits.eyes
              : previousTraitsRef.current.eyes
            if (eyesSrc) drawImage(eyesSrc)

            const mouthSrc = imageCache[selectedTraits.mouth]
              ? selectedTraits.mouth
              : previousTraitsRef.current.mouth
            if (mouthSrc) drawImage(mouthSrc)

            const accessoriesSrc = imageCache[selectedTraits.accessories]
              ? selectedTraits.accessories
              : previousTraitsRef.current.accessories
            if (accessoriesSrc) drawImage(accessoriesSrc)

            // Draw hair last to ensure it's on top
            const hairSrc = imageCache[selectedTraits.hair]
              ? selectedTraits.hair
              : previousTraitsRef.current.hair
            if (hairSrc) drawImage(hairSrc)

            // Reset global alpha
            ctx.globalAlpha = 1.0
          } catch (error) {
            console.error("Error drawing alien:", error)
          }
        }

        // Draw to buffer first
        drawAlien(bufferCtx, 1, true).then(() => {
          // Copy from buffer to display canvas
          displayCtx.clearRect(0, 0, displayCanvas.width, displayCanvas.height)
          displayCtx.drawImage(bufferCanvas, 0, 0)
        })

        // Draw high-res output separately
        drawAlien(outputCtx, OUTPUT_SCALE, false)
      }

      renderAlien()

      // Render again after a short delay to handle potential timing issues
      const timeoutId = setTimeout(() => {
        renderAlien()
      }, 200)

      return () => clearTimeout(timeoutId)
    }, [
      selectedTraits,
      element,
      isImagesLoaded,
      loadingAttempted,
      isLoading,
      isTraitsChanging,
      baseImagesLoaded,
    ])

    // Get dimensions for the container
    const { width: naturalWidth, height: naturalHeight } = getBaseDimensions()

    // Get cached background URL (calculated once)
    const backgroundImageUrl = selectedTraits.background
      ? getCachedBackgroundUrl(selectedTraits.background)
      : element
        ? getCachedBackgroundUrl(element)
        : undefined

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImageUrl
            ? `url(${backgroundImageUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative w-fit h-fit max-w-full max-h-full flex items-center justify-center">
          {/* Visible canvas for display */}
          <canvas
            ref={localCanvasRef}
            style={{
              width: isMobile ? "100%" : "45%",
              height: "100%",
              display: "block",
              objectFit: "contain",
              opacity: isLoading ? 0.7 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
            className="max-sm:h-64 max-sm:w-auto max-sm:object-contain"
          />
          {/* Loading overlay - show during initial load or trait changes */}
          {(isLoading || isTraitsChanging) && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-black/30 backdrop-blur-sm p-4 rounded-full">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              </div>
            </div>
          )}
          {/* Hidden canvases */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <canvas ref={bufferCanvasRef} style={{ display: "none" }} />
        </div>
      </div>
    )
  }
)

RenderAlien.displayName = "RenderAlien"
