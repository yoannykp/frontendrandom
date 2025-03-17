import { useEffect, useState } from "react"
import Image from "next/image"
import { Leaderboard } from "@/types"

import { getLeaderboard } from "@/lib/api"
import { cn } from "@/lib/utils"
import {
  EnterpriseIcon,
  HeartIcon,
  SearchIcon,
  UserRound,
} from "@/components/icons"

const tabs = [
  {
    label: "Players",
    value: "players",
    icon: UserRound,
  },
  {
    label: "Entreprises",
    value: "entreprises",
    icon: EnterpriseIcon,
  },
  {
    label: "Liked",
    value: "liked",
    icon: HeartIcon,
  },
]

const LEADERBOARD_COLUMNS = [
  {
    id: "rank",
    label: "Rank",
    labelSmall: "Rank",
    showOnSmall: true,
    width: 1,
    align: "left",
  },
  {
    id: "name",
    label: "Name",
    labelSmall: "Name",
    showOnSmall: true,
    width: 2,
    align: "left",
  },
  {
    id: "entreprise",
    label: "Entreprise",
    labelSmall: "Corp",
    showOnSmall: false,
    width: 1,
    align: "left",
  },
  {
    id: "level",
    label: "Level",
    labelSmall: "Lvl",
    showOnSmall: false,
    width: 1,
    align: "left",
  },
  {
    id: "points",
    label: "Reputation Points",
    labelSmall: "RP",
    showOnSmall: true,
    width: 1,
    align: "right",
  },
]

const LeaderboardPage = () => {
  const [selectedUser, setSelectedUser] = useState<Leaderboard | null>(null)
  const [activeTab, setActiveTab] = useState<string>("players")
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard[]>([])

  useEffect(() => {
    getLeaderboard().then((res) => {
      if (res.data) {
        setLeaderboardData(res.data)
      }
    })
  }, [])

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue)
    setSelectedUser(null)
  }

  const totalColSpan = LEADERBOARD_COLUMNS.reduce(
    (acc, col) => acc + col.width,
    0
  )

  return (
    <div className="relative w-full h-full">
      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl  flex flex-col lg:flex-row gap-3 overflow-hidden">
        <div
          className={cn(
            "w-full h-full backdrop-blur-md p-3",
            selectedUser ? "hidden lg:block" : "block"
          )}
        >
          <div className="flex gap-2 max-lg:flex-wrap pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                className={cn(
                  "px-3 sm:px-4 h-12 lg:w-full rounded-xl border border-white/10 whitespace-nowrap flex items-center gap-2 justify-between text-xs sm:text-sm transition-all duration-300 font-inter",
                  activeTab === tab.value ? "bg-white/20" : "bg-white/5"
                )}
              >
                <span>{tab.label}</span>
                <tab.icon className="w-4 h-4 hidden sm:block" />
              </button>
            ))}
            <div
              className={cn(
                "px-3 sm:px-4 h-12 lg:w-full rounded-xl border border-white/10 whitespace-nowrap flex items-center gap-3 justify-between text-xs sm:text-sm transition-all duration-300 font-inter"
              )}
            >
              <SearchIcon className="w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent outline-none w-full h-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 h-[calc(100vh-295px)] overflow-y-auto">
            {/* Table Header */}
            <div
              className={`grid grid-cols-${totalColSpan} gap-2 px-4 py-2 text-sm text-gray-400`}
            >
              {LEADERBOARD_COLUMNS.map((column) => (
                <div
                  key={column.id}
                  className={cn(
                    "font-inter",
                    column.width > 1 && `col-span-${column.width}`,
                    `text-${column.align}`,
                    !column.showOnSmall && "hidden md:block"
                  )}
                >
                  <span className="hidden md:inline">{column.label}</span>
                  <span className="md:hidden">{column.labelSmall}</span>
                </div>
              ))}
            </div>

            {/* current user rank*/}
            <div className="relative overflow-hidden min-h-max">
              <div
                className={cn(
                  `grid grid-cols-${totalColSpan} gap-2 px-4 py-3 rounded-xl items-center`,
                  "hover:bg-white/10 transition-colors duration-200",
                  "bg-white/5"
                )}
              >
                {/* Rank Column */}
                <div className="flex items-center">
                  <div
                    className={cn(
                      "size-8 bg-white/10 rounded-full text-xs flex items-center justify-center font-inter"
                    )}
                  >
                    {1}
                  </div>
                </div>

                {/* Name Column */}
                <div className="flex items-center gap-2 col-span-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                    <img
                      src="/images/user.png"
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium truncate">John Doe</span>
                </div>

                {/* Enterprise Column */}
                <div
                  className={cn(
                    "truncate",
                    !LEADERBOARD_COLUMNS.find((col) => col.id === "entreprise")
                      ?.showOnSmall && "hidden md:block"
                  )}
                >
                  Appodial
                </div>

                {/* Level Column */}
                <div
                  className={cn(
                    "truncate",
                    !LEADERBOARD_COLUMNS.find((col) => col.id === "level")
                      ?.showOnSmall && "hidden md:block"
                  )}
                >
                  167
                </div>

                {/* Points Column */}
                <div className="flex items-center justify-between">
                  <span>2679</span>
                </div>
              </div>
              <span
                className={cn(
                  "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] duration-500 transition-all",
                  "bg-[#5FFF95]"
                )}
              />
            </div>

            {/* separator */}
            <div className="w-full min-h-[1px] bg-white/10 my-2" />

            {/* Table Body */}

            {leaderboardData.map((item, index) => (
              <div
                key={index}
                className={cn(
                  `grid grid-cols-${totalColSpan} gap-2 px-4 py-3 rounded-xl items-center`,
                  index % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]",
                  selectedUser?.name === item.name && "bg-white/30"
                )}
                onClick={() => setSelectedUser(item)}
              >
                {/* Rank Column */}
                <div className="flex items-center">
                  {index + 1 <= 3 ? (
                    <Image
                      src={`/images/rank-${index + 1}.png`}
                      alt="Rank"
                      width={28}
                      height={28}
                    />
                  ) : (
                    <span className=" size-8 bg-white/10 rounded-full text-xs flex items-center justify-center font-inter">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Name Column */}
                <div className="flex items-center gap-2 col-span-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-medium truncate">{item.name}</span>
                </div>

                {/* Enterprise Column */}
                <div
                  className={cn(
                    "truncate",
                    !LEADERBOARD_COLUMNS.find((col) => col.id === "entreprise")
                      ?.showOnSmall && "hidden md:block"
                  )}
                >
                  {item.enterprise.length > 0 ? item.enterprise : "-"}
                </div>

                {/* Level Column */}
                <div
                  className={cn(
                    "truncate",
                    !LEADERBOARD_COLUMNS.find((col) => col.id === "level")
                      ?.showOnSmall && "hidden md:block"
                  )}
                >
                  {item.level}
                </div>

                {/* Points Column */}
                <div className="flex items-center justify-between">
                  <span>{item.reputation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedUser && (
          <div
            className={cn(
              "  p-3 overflow-y-auto transition-all duration-300 rounded-r-xl",
              "fixed inset-0 z-50 lg:static lg:z-auto lg:w-full lg:max-w-[550px] lg:inset-auto",
              "lg:opacity-100 lg:translate-y-0"
            )}
          >
            <div className="flex flex-col gap-4 h-full">
              {/* Main Profile Image with Gallery */}
              <div className="flex gap-2">
                <div className="flex-1 aspect-square rounded overflow-hidden">
                  <img
                    src={selectedUser?.image}
                    alt={selectedUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 w-[100px]">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded overflow-hidden bg-white/5"
                    >
                      <img
                        src="/images/user.png"
                        alt="Gallery"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 rounded p-3">
                {/* Profile Info */}
                <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedUser?.name}</span>
                    {/* <span className="text-xl">{selectedUser?.country}</span> */}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/10   rounded text-xs font-inter border border-white/10 flex">
                      <div className="border-r border-white/10 text-white/50 px-1 bg-white/5 ">
                        Level{" "}
                      </div>
                      <div className="font-volkhov  px-2">
                        {selectedUser?.level}
                      </div>
                    </div>
                    <div className="w-10 h-6 border border-white/10 rounded bg-white/10 flex items-center justify-center relative">
                      <Image
                        src="/images/badge.png"
                        alt="Badge"
                        width={26}
                        height={26}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats List */}
                <div className="flex flex-col gap-2 text-sm my-3">
                  <div className="flex justify-between items-center">
                    <span className=" font-inter">Entreprise</span>
                    <span className="font-medium">
                      {selectedUser?.enterprise}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-inter">Reputations Points</span>
                    <span className="font-medium">
                      {selectedUser?.reputation}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-inter">Time passed in Raids</span>
                    <span className="font-medium">246h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-inter">STAR earned</span>
                    <span className="font-medium">1401 (1753.02$)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-inter">Account creation</span>
                    <span className="font-medium">14 April 2024</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-5 gap-2 mt-auto">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <button
                      key={index}
                      className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12"
                    >
                      <HeartIcon className="w-5 h-5 mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderboardPage
