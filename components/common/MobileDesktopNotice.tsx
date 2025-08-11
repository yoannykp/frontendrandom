"use client"

import { useEffect, useState } from "react"

import { useIsMobile } from "@/hooks/useIsMobile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog"

export default function MobileDesktopNotice() {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isMobile) {
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }, [isMobile])

  if (!isMobile) return null

  return (
    <Dialog open={isOpen}>
      <DialogOverlay className="bg-black/60" />

      <DialogContent
        hideClose
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
        className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-md"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            Use on Desktop
          </DialogTitle>
          <DialogDescription>
            For the best experience, please use this application on a desktop
            device.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
