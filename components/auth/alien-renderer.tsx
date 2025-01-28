import { forwardRef, useEffect, useRef } from "react"

interface AlienRendererProps {
  selectedTraits: {
    hair: string
    face: string
  }
  element: string
}

export const AlienRenderer = forwardRef<HTMLCanvasElement, AlienRendererProps>(
  ({ selectedTraits, element }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const localCanvasRef = useRef<HTMLCanvasElement>(null)
    const hiddenCanvasRef = useRef<HTMLCanvasElement>(null)
    const canvasRef =
      (ref as React.RefObject<HTMLCanvasElement>) || hiddenCanvasRef

    // Fixed canvas dimensions for display
    const DISPLAY_WIDTH = 462
    const DISPLAY_HEIGHT = 620

    // High resolution output size (3x)
    const OUTPUT_SCALE = 3
    const OUTPUT_WIDTH = DISPLAY_WIDTH * OUTPUT_SCALE
    const OUTPUT_HEIGHT = DISPLAY_HEIGHT * OUTPUT_SCALE

    useEffect(() => {
      const displayCanvas = localCanvasRef.current
      const outputCanvas = canvasRef.current
      if (!displayCanvas || !outputCanvas) return

      // Set up display canvas
      displayCanvas.width = DISPLAY_WIDTH
      displayCanvas.height = DISPLAY_HEIGHT
      const displayCtx = displayCanvas.getContext("2d", { alpha: true })

      // Set up hidden output canvas
      outputCanvas.width = OUTPUT_WIDTH
      outputCanvas.height = OUTPUT_HEIGHT
      const outputCtx = outputCanvas.getContext("2d", { alpha: true })

      if (!displayCtx || !outputCtx) return

      const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => resolve(img)
          img.onerror = (e) => {
            console.error(`Failed to load image: ${src}`, e)
            reject(e)
          }
          img.src = src
        })
      }

      const drawAlien = async (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        showBackground: boolean
      ) => {
        // Clear canvas with transparency
        ctx.clearRect(0, 0, width, height)

        try {
          // Draw element as background if selected (only for display canvas)
          if (showBackground && element) {
            const elementImg = await loadImage(element)
            ctx.globalAlpha = 0.15 // Reduced opacity for subtle background
            ctx.drawImage(elementImg, 0, 0, width, height)
            ctx.globalAlpha = 1
          }

          // Draw base body first
          const bodyImg = await loadImage("/images/alien/body/body.png")
          ctx.drawImage(bodyImg, 0, 0, width, height)

          // Draw head on top of face traits
          const headImg = await loadImage("/images/alien/body/head.png")
          ctx.drawImage(headImg, 0, 0, width, height)

          // Draw selected face traits
          if (selectedTraits.face) {
            const faceImg = await loadImage(selectedTraits.face)
            ctx.drawImage(faceImg, 0, 0, width, height)
          }

          // Draw selected hair on top of head
          if (selectedTraits.hair) {
            const hairImg = await loadImage(selectedTraits.hair)
            ctx.drawImage(hairImg, 0, 0, width, height)
          }

          // Draw clothes last to be on top of everything
          const clothesImg = await loadImage("/images/alien/body/cothes.png")
          ctx.drawImage(clothesImg, 0, 0, width, height)
        } catch (error) {
          console.error("Error drawing alien:", error)
        }
      }

      // Draw on both canvases
      drawAlien(displayCtx, DISPLAY_WIDTH, DISPLAY_HEIGHT, true) // For display, with background
      drawAlien(outputCtx, OUTPUT_WIDTH, OUTPUT_HEIGHT, false) // For high-res output, without background
    }, [selectedTraits, element])

    return (
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center "
      >
        {/* Visible canvas for display */}
        <canvas
          ref={localCanvasRef}
          style={{
            width: `${DISPLAY_WIDTH}px`,
            height: `${DISPLAY_HEIGHT}px`,
            maxWidth: "100%",
            objectFit: "contain",
          }}
          className="max-sm:!h-64"
        />
        {/* Hidden canvas for high-res output */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    )
  }
)

AlienRenderer.displayName = "AlienRenderer"
