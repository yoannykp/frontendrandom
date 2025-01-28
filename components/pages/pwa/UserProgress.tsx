interface UserProgressProps {
  username: string
  tokenType: string
  stars: number
  level: string
  amount: number
  profit: number
  image?: string
}

export function UserProgress({
  username,
  tokenType,
  stars,
  level,
  amount,
  profit,
  image,
}: UserProgressProps) {
  return (
    <div className="bg-white/10 rounded-2xl p-4">
      <div className="flex justify-between  text-sm">
        <div>
          <div className="text-gray-400">{username}</div>
          <div>TON</div>
        </div>
        <div className="text-right">
          <div className="text-white/80 text-xl">${amount.toFixed(2)} </div>
          <div className="text-green-500">+${profit.toFixed(2)}</div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        {/* Alien Image */}
        <div className="size-20  overflow-hidden">
          <img
            src={image}
            alt="User's alien"
            className="w-full h-full object-contain"
          />
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="mb-2">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
              <div
                className="h-full bg-[#9E96F4]"
                style={{ width: `${Math.min((stars / 100) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span>{stars} stars</span>
            <span className="text-white">{level}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
