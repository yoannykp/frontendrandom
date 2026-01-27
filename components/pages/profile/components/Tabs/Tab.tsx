import { ReactNode } from "react"

export interface TabProps {
  title: string
  isActive: boolean
  onClick: () => void
  before?: ReactNode
}

export const Tab = ({ title, before, onClick, isActive }: TabProps) => {
  const buttonClassnames = isActive
    ? "flex-1 bg-white/10 rounded-xl p-3 flex items-center justify-between"
    : "flex-1 bg-white/5 hover:bg-white/10 rounded-xl p-3 flex items-center justify-between"

  return (
    <button className={buttonClassnames} onClick={onClick}>
      <p className="text-white font-medium">{title}</p>
      {before && (
        <div className="size-6 flex items-center justify-center">{before}</div>
      )}
    </button>
  )
}
