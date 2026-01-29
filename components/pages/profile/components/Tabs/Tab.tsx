import { ReactNode } from "react"

export interface TabProps {
  title: string
  isActive: boolean
  onClick: () => void
  after?: ReactNode
}

export const Tab = ({ title, after, onClick, isActive }: TabProps) => {
  const buttonClassnames = isActive
    ? "flex-1 glass-effect !bg-white/20 rounded-10 p-3 flex items-center justify-between"
    : "flex-1 glass-effect duration-300 hover:bg-white/10 rounded-10 p-3 flex items-center justify-between"

  return (
    <button className={buttonClassnames} onClick={onClick}>
      <p className="text-white font-normal">{title}</p>
      {after && (
        <div className="size-6 flex items-center justify-center">{after}</div>
      )}
    </button>
  )
}
