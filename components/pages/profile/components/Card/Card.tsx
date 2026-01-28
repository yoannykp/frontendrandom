import { ReactNode } from "react"

interface CardProps {
  children: ReactNode
}

export const Card = ({ children }: CardProps) => {
  return <div className="bg-white/5 rounded-10 p-4">{children}</div>
}
