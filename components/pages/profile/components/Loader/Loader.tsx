import { Loader2 } from "lucide-react"

interface LoaderProps {
  text: string
}
export const Loader = ({ text }: LoaderProps) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      <span className="text-sm">
        {text}
        <span class="after:animate-dotLoop" />
      </span>
    </div>
  )
}
