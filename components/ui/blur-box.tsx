import { cn } from "@/lib/utils"

const BlurBox = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) => {
  return (
    <div
      className={cn(
        "border border-gray-light rounded-md p-2 cursor-pointer backdrop-blur-[40px] flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  )
}

export default BlurBox
