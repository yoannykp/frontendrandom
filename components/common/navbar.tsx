"use client"

import { useEffect, useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "../ui/button"
import { ThemeToggleButton } from "./theme-toggle-button"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-background text-foreground shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <span className="font-bold text-xl">Logo</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="hover:text-primary">
              Home
            </a>
            <a href="#" className="hover:text-primary">
              About
            </a>
            <a href="#" className="hover:text-primary">
              Services
            </a>
            <a href="#" className="hover:text-primary">
              Contact
            </a>
            <ThemeToggleButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <ThemeToggleButton />
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <a href="#" className="block py-2 px-4 text-sm hover:bg-accent">
              Home
            </a>
            <a href="#" className="block py-2 px-4 text-sm hover:bg-accent">
              About
            </a>
            <a href="#" className="block py-2 px-4 text-sm hover:bg-accent">
              Services
            </a>
            <a href="#" className="block py-2 px-4 text-sm hover:bg-accent">
              Contact
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
