import { forwardRef, useEffect, useRef, useState } from "react"

import { useIsMobile } from "@/hooks/useIsMobile"

interface AlienRendererProps {
  selectedTraits: {
    hair: string
    eyes: string
    mouth: string
    element: string
  }
  element: string
}

// Cache for loaded images
const imageCache: { [key: string]: HTMLImageElement } = {}

// Preload an image and store in cache
const preloadImage = (src: string): Promise<HTMLImageElement> => {
  if (imageCache[src]) {
    return Promise.resolve(imageCache[src])
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      imageCache[src] = img

      console.log(`Successfully loaded image: ${src}`)
      resolve(img)
    }
    img.onerror = (e) => {
      console.error(`Failed to load image: ${src}`, e)
      reject(e)
    }
    img.src = src
  })
}

export const RenderAlien = forwardRef<HTMLCanvasElement, AlienRendererProps>(
  ({ selectedTraits, element }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const localCanvasRef = useRef<HTMLCanvasElement>(null)
    const hiddenCanvasRef = useRef<HTMLCanvasElement>(null)
    const bufferCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isImagesLoaded, setIsImagesLoaded] = useState(false)
    const canvasRef =
      (ref as React.RefObject<HTMLCanvasElement>) || hiddenCanvasRef

    // High resolution output scale
    const OUTPUT_SCALE = 1
    const isMobile = useIsMobile()

    // Get base image dimensions from the first loaded image
    const getBaseDimensions = (): { width: number; height: number } => {
      const bodyImage = imageCache["/images/alien/body/body.png"]
      if (bodyImage) {
        return {
          width: bodyImage.naturalWidth,
          height: bodyImage.naturalHeight,
        }
      }
      return { width: 462, height: 462 } // Fallback dimensions
    }

    // Preload all required images when traits change
    useEffect(() => {
      setIsImagesLoaded(false)
      console.log("Selected traits for loading:", selectedTraits)

      const baseImages = [
        "/images/alien/body/body.png",
        "/images/alien/body/head.png",
        "/images/alien/body/cothes.png",
      ]

      const loadAllImages = async () => {
        try {
          // Create a new array of all image sources
          const allImageSources = [
            ...baseImages,
            ...(selectedTraits.eyes ? [selectedTraits.eyes] : []),
            ...(selectedTraits.hair ? [selectedTraits.hair] : []),
            ...(selectedTraits.mouth ? [selectedTraits.mouth] : []),
            ...(element ? [element] : []),
          ]

          // Filter out empty or invalid URLs
          const validImageSources = allImageSources.filter(
            (src) => src && typeof src === "string" && src.trim() !== ""
          )

          console.log("Attempting to load images:", validImageSources)

          // Load images one by one to better track which ones fail
          for (const src of validImageSources) {
            try {
              await preloadImage(src)
            } catch (err) {
              console.error(`Failed to load image: ${src}`, err)
              // Continue with other images even if one fails
            }
          }

          console.log("Images in cache after loading:", Object.keys(imageCache))
          setIsImagesLoaded(true)
        } catch (error) {
          console.error("Error in loadAllImages:", error)
          // Try to continue with whatever images were loaded
          if (Object.keys(imageCache).length > 0) {
            console.log(
              "Some images were loaded, attempting to render with available images"
            )
            setIsImagesLoaded(true)
          }
        }
      }

      loadAllImages()
    }, [
      selectedTraits.eyes,
      selectedTraits.mouth,
      selectedTraits.hair,
      element,
    ])

    useEffect(() => {
      if (!isImagesLoaded) return

      const displayCanvas = localCanvasRef.current
      const outputCanvas = canvasRef.current
      const bufferCanvas = bufferCanvasRef.current
      if (!displayCanvas || !outputCanvas || !bufferCanvas) {
        console.error("Canvas references not found")
        return
      }

      // Get natural dimensions from base image
      const { width: naturalWidth, height: naturalHeight } = getBaseDimensions()

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
          console.log("Drawing alien with traits:", selectedTraits)
          console.log("Available images in cache:", Object.keys(imageCache))

          // Helper function to draw image maintaining aspect ratio
          const drawImage = (src: string) => {
            if (imageCache[src]) {
              ctx.drawImage(imageCache[src], 0, 0, width, height)
              return true
            } else {
              console.warn(`Image not found in cache during drawing: ${src}`)
              // Try to load the image on-demand if not in cache
              const img = new Image()
              img.crossOrigin = "anonymous"
              img.onload = () => {
                imageCache[src] = img
                ctx.drawImage(img, 0, 0, width, height)
                console.log(`Loaded and drew image on-demand: ${src}`)
              }
              img.onerror = () => {
                console.error(`Failed to load image on-demand: ${src}`)
              }
              img.src = src
              return false
            }
          }

          // Draw base body
          drawImage("/images/alien/body/body.png")

          // Draw head
          drawImage("/images/alien/body/head.png")

          // Draw selected eyes traits
          if (selectedTraits.eyes) {
            drawImage(selectedTraits.eyes)
          }

          // Draw selected hair
          if (selectedTraits.hair) {
            drawImage(selectedTraits.hair)
          }

          // Draw selected mouth traits
          if (selectedTraits.mouth) {
            drawImage(selectedTraits.mouth)
          }

          // Draw clothes
          drawImage("/images/alien/body/cothes.png")
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
    }, [selectedTraits, element, isImagesLoaded])

    // Get dimensions for the container
    const { width: naturalWidth, height: naturalHeight } = getBaseDimensions()

    return (
      <div
        ref={containerRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            element && element.includes(".png")
              ? `url(${element.replace(".png", "-bg.png")})`
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
            }}
            className="max-sm:h-64 max-sm:w-auto max-sm:object-contain"
          />
          {/* Hidden canvases */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          <canvas ref={bufferCanvasRef} style={{ display: "none" }} />
        </div>
      </div>
    )
  }
)

RenderAlien.displayName = "RenderAlien"
