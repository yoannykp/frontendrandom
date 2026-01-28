import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
}

export const Card = ({ children }: CardProps) => {
  return <div className="bg-white/5 rounded-xl p-3">{children}</div>
}
