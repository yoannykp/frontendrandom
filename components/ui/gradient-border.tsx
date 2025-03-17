interface GradientBorderProps {
  children: React.ReactNode
  className?: string
  isSelected?: boolean
}

export function GradientBorder({
  children,
  className = "",
  isSelected = false,
}: GradientBorderProps) {
  return (
    <div className={`relative rounded-2xl ${className}`}>
      {/* SVG Border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 82 79"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: isSelected ? 1 : 0 }}
      >
        <rect
          x="1"
          y="1"
          width="79.25"
          height="77"
          rx="8"
          stroke="url(#paint0_linear_73_140)"
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient
            id="paint0_linear_73_140"
            x1="40.625"
            y1="79"
            x2="40.625"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#5FFF95" />
            <stop offset="1" stopColor="#5FFF95" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
