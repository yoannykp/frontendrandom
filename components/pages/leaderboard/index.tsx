import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAliens, useProfile } from "@/store/hooks"
import { Leaderboard, TeamResponse } from "@/types"
import moment from "moment"
import toast from "react-hot-toast"

import {
  addFriend,
  getFriendsList,
  getLeaderboard,
  getTeam,
  likeUser,
} from "@/lib/api"
import { cn } from "@/lib/utils"
import useDebounce from "@/hooks/useDebounce"
import {
  AddUserIcon,
  ArrowBack,
  EnterpriseIcon,
  HeartIcon,
  MessageIcon,
  PlusIcon,
  SearchIcon,
  UserRound,
  XLogo,
} from "@/components/icons"
import countries from "@/app/assets/countries.json"

import { DateFilter } from "./date-filter"

enum LeaderboardTabs {
  PLAYERS = "players",
  ENTERPRISES = "enterprises",
  LIKES = "likes",
}
const tabs: {
  label: string
  value: LeaderboardTabs
  icon: React.ElementType
}[] = [
  {
    label: "Players",
    value: LeaderboardTabs.PLAYERS,
    icon: UserRound,
  },
  {
    label: "Enterprises",
    value: LeaderboardTabs.ENTERPRISES,
    icon: EnterpriseIcon,
  },
  {
    label: "Liked",
    value: LeaderboardTabs.LIKES,
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
    id: "id",
    label: "ID",
    labelSmall: "ID",
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
  {
    id: "",
    label: "",
    labelSmall: "",
    showOnSmall: true,
    width: 1,
    align: "right",
  },
]

const LeaderboardPage = () => {
  const [selectedUser, setSelectedUser] = useState<Leaderboard | null>(null)
  const [selectedUserTeam, setSelectedUserTeam] = useState<TeamResponse | null>(
    null
  )
  const [activeTab, setActiveTab] = useState<LeaderboardTabs>(
    LeaderboardTabs.PLAYERS
  )
  const [leaderboardData, setLeaderboardData] = useState<Leaderboard[]>([])
  const [thisUser, setThisUser] = useState<Leaderboard | null>(null)
  const [search, setSearch] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const debouncedSearch = useDebounce(search, 300)
  const [friends, setFriends] = useState<any[]>([])
  const { data: profile } = useProfile()
  const { alien } = useAliens()
  const router = useRouter()

  useEffect(() => {
    fetchFriendsList()
  }, [])

  useEffect(() => {
    getLeaderboard({
      filter: activeTab === LeaderboardTabs.PLAYERS ? undefined : activeTab,
      search: debouncedSearch,
      date: selectedDate,
    }).then((res) => {
      if (res.data) {
        setLeaderboardData(res.data.users)
        setThisUser(res.data.thisUser || null)
      }
    })
  }, [activeTab, debouncedSearch, selectedDate])

  useEffect(() => {
    if (selectedUser) {
      getTeam(selectedUser.walletAddress).then((res) => {
        setSelectedUserTeam(res.data)
      })
    }
  }, [selectedUser])

  const handleTabChange = (tabValue: LeaderboardTabs) => {
    setActiveTab(tabValue)
    setSelectedUser(null)
  }

  const totalColSpan = LEADERBOARD_COLUMNS.reduce(
    (acc, col) => acc + col.width,
    0
  )

  const handleLikeUser = (userId: number) => {
    likeUser(userId).then((res) => {
      if (res?.data?.liked !== undefined && selectedUser) {
        const liked = res.data.liked
        const updatedLeaderboardData = leaderboardData.map((user) =>
          user.id === userId ? { ...user, isLiked: liked } : user
        )
        setLeaderboardData(updatedLeaderboardData)
        setSelectedUser({ ...selectedUser, isLiked: liked })
      }
    })
  }

  const fetchFriendsList = async () => {
    try {
      const res = await getFriendsList()
      if (res.data) {
        setFriends(res.data)
      }
    } catch (error) {
      console.error("Error fetching friends list:", error)
    }
  }

  const handleAddFriend = async () => {
    if (selectedUser) {
      try {
        // setIsLoading(true)
        // Call the API with an array of all selected user IDs
        // This assumes the API endpoint has been updated to accept an array
        const response = await addFriend([selectedUser.id])
        if (response.data?.success) {
          toast.success("Friend added successfully")
          // Refresh friends list
          fetchFriendsList()
        } else {
          toast.error("Failed to add friend")
        }
      } catch (error) {
        console.error("Error adding friend:", error)
      } finally {
        // setIsLoading(false)
      }
    }
  }

  const handleDateChange = (date: string | null) => {
    setSelectedDate(date)
    setSelectedUser(null)
  }

  console.log("leaderboardData ===>", leaderboardData)
  console.log("Profile ===>", profile)
  console.log("friends ===>", friends)
  console.log("thisUser ===>", alien)

  console.log("selectedUser ===>", selectedUser)

  console.log("selectedUserTeam ===>", selectedUserTeam?.team)

  return (
    <div className="relative w-full h-full">
      <div className="absolute -top-[4.1rem] left-2">
        <DateFilter onDateChange={handleDateChange} />
      </div>
      <div className="relative w-full h-full bg-white/5 border border-white/10 rounded-xl  flex flex-col lg:flex-row gap-3 overflow-hidden backdrop-blur-md">
        <div
          className={cn(
            "w-full h-full  p-3",
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 h-[calc(100vh-295px)] overflow-y-scroll bg-white/5 rounded px-2 py-1">
            {/* Table Header */}
            <div
              className={`grid grid-cols-${totalColSpan} gap-2 px-4 py-2 text-sm text-gray-400`}
              style={{
                gridTemplateColumns: `repeat(${totalColSpan}, minmax(0, 1fr))`,
              }}
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

            {thisUser && (
              <>
                {/* current user rank*/}
                <div className="relative overflow-hidden min-h-max">
                  <div
                    className={cn(
                      `grid grid-cols-${totalColSpan} gap-2 px-4 py-3 rounded-xl items-center`,
                      "hover:bg-white/10 transition-colors duration-200",
                      "bg-white/5"
                    )}
                    style={{
                      gridTemplateColumns: `repeat(${totalColSpan}, minmax(0, 1fr))`,
                    }}
                  >
                    {/* Rank Column */}
                    <div className="flex items-center">
                      <div
                        className={cn(
                          "size-8 bg-white/10 rounded-full text-xs flex items-center justify-center font-inter"
                        )}
                      >
                        {thisUser?.rank}
                      </div>
                    </div>

                    {/* ID Column */}
                    <div
                      className={cn(
                        "truncate",
                        !LEADERBOARD_COLUMNS.find((col) => col.id === "id")
                          ?.showOnSmall && "hidden md:block"
                      )}
                    >
                      {thisUser?.id}
                    </div>

                    {/* Name Column */}
                    <div className="flex items-center gap-2 col-span-2 min-w-0">
                      {thisUser?.aliens.length > 0 &&
                      thisUser?.elements.length > 0 ? (
                        <div className="flex gap-2 w-8 h-8">
                          <div className="flex-1 aspect-square rounded overflow-hidden relative">
                            <Image
                              src={thisUser?.aliens[0]?.image || ""}
                              alt="Character"
                              fill
                              className="object-cover z-10"
                            />
                            <Image
                              src={thisUser?.elements[0].background || ""}
                              alt="User's alien"
                              fill
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                          <img
                            src={thisUser.image}
                            alt={thisUser.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <span className="font-medium truncate">
                        {thisUser.name}
                      </span>
                    </div>

                    {/* Enterprise Column */}
                    <div
                      className={cn(
                        "truncate",
                        !LEADERBOARD_COLUMNS.find(
                          (col) => col.id === "entreprise"
                        )?.showOnSmall && "hidden md:block"
                      )}
                    >
                      {thisUser?.enterprise}
                    </div>

                    {/* Level Column */}
                    <div
                      className={cn(
                        "truncate",
                        !LEADERBOARD_COLUMNS.find((col) => col.id === "level")
                          ?.showOnSmall && "hidden md:block"
                      )}
                    >
                      {thisUser?.level}
                    </div>

                    {/* Points Column */}
                    <div className="flex items-center justify-between">
                      <span>{thisUser?.reputation}</span>
                    </div>

                    <div className="flex items-center justify-center">
                      {
                        countries.find(
                          (country) =>
                            country.name.toLowerCase().split(",")[0].trim() ===
                            thisUser?.country
                              ?.toLowerCase()
                              ?.split(",")[0]
                              .trim()
                        )?.flag
                      }
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
              </>
            )}

            {/* Table Body */}
            {leaderboardData.length > 0 ? (
              leaderboardData.map((item, index) => (
                <div
                  key={index}
                  className={cn(
                    `grid grid-cols-${totalColSpan} gap-2 px-4 py-3 rounded-xl items-center relative overflow-hidden min-h-[3.8rem]`,
                    index % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]",
                    selectedUser?.id === item.id && "bg-white/30"
                  )}
                  style={{
                    gridTemplateColumns: `repeat(${totalColSpan}, minmax(0, 1fr))`,
                  }}
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

                  {/* ID Column */}
                  <div
                    className={cn(
                      "truncate",
                      !LEADERBOARD_COLUMNS.find((col) => col.id === "id")
                        ?.showOnSmall && "hidden md:block"
                    )}
                  >
                    {item.id}
                  </div>

                  {/* Name Column */}
                  <div className="flex items-center gap-2 col-span-2 min-w-0">
                    {item?.aliens.length > 0 && item?.elements.length > 0 ? (
                      <div className="flex gap-2 w-8 h-8">
                        <div className="flex-1 aspect-square rounded overflow-hidden relative">
                          <Image
                            src={item?.aliens[0]?.image || ""}
                            alt="Character"
                            fill
                            className="object-cover z-10"
                          />
                          <Image
                            src={item?.elements[0].background || ""}
                            alt="User's alien"
                            fill
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <span className="font-medium truncate">{item.name}</span>
                  </div>

                  {/* Enterprise Column */}
                  <div
                    className={cn(
                      "truncate",
                      !LEADERBOARD_COLUMNS.find(
                        (col) => col.id === "entreprise"
                      )?.showOnSmall && "hidden md:block"
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
                  {alien && alien?.userId === item.id && (
                    <span
                      className={cn(
                        "absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4/5 h-[30px] blur-[20px] z-[-1] duration-500 transition-all",
                        "bg-[#cf74bd]"
                      )}
                    />
                  )}

                  <div className="flex items-center justify-center">
                    {
                      countries.find(
                        (country) =>
                          country.name.toLowerCase().split(",")[0].trim() ===
                          item?.country?.toLowerCase()?.split(",")[0].trim()
                      )?.flag
                    }
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-white/50">No data</span>
              </div>
            )}
          </div>
        </div>

        {selectedUser && (
          <div
            className={cn(
              "  p-3 overflow-y-auto transition-all duration-300 rounded-r-xl flex flex-col",
              "fixed inset-0 z-50 lg:static lg:z-auto lg:w-full lg:max-w-[550px] lg:inset-auto",
              "lg:opacity-100 lg:translate-y-0"
            )}
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="flex items-center justify-between gap-2 bg-white/5 rounded p-3 mb-3 lg:hidden border border-white/10 w-full"
            >
              <span>Back to Leadeboard list</span>
              <ArrowBack className="w-4 h-4" />
            </button>
            <div className="flex flex-col gap-4 flex-1">
              {/* Main Profile Image with Gallery */}
              <div className="flex gap-2">
                <div className="flex-1 aspect-square rounded overflow-hidden relative">
                  <Image
                    src={selectedUser?.aliens[0]?.image || ""}
                    alt="Character"
                    fill
                    className="object-cover z-10"
                  />
                  <Image
                    src={selectedUser?.elements[0].background || ""}
                    alt="User's alien"
                    fill
                  />
                </div>
                {/* <div className="flex-1 aspect-square rounded overflow-hidden relative">
                  <Image
                    src={selectedUserTeam?.team[0]?.image || ""}
                    alt="Character"
                    fill
                    className="object-cover z-10"
                  />
                  <Image
                    src={selectedUserTeam?.team[0].element?.background || ""}
                    alt="User's alien"
                    fill
                  />
                </div> */}

                {selectedUserTeam?.team &&
                  selectedUserTeam.team.filter(
                    (teamMember) => !teamMember.isSelected
                  ).length > 0 && (
                    <div className="flex flex-col gap-2 w-[100px]">
                      {selectedUserTeam.team
                        .filter((teamMember) => !teamMember.isSelected)
                        .map((teamMember) => (
                          <div
                            key={teamMember.id}
                            className="aspect-square rounded overflow-hidden bg-white/5"
                          >
                            <img
                              src={teamMember.teamImage || ""}
                              alt={teamMember.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              <div className="bg-white/5 rounded p-3 flex-1 flex flex-col">
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
                      {selectedUser?.enterprise || "-"}
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
                    <span className="font-medium">
                      {selectedUser?.stars} (0.02$)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-inter">Account creation</span>
                    <span className="font-medium">
                      {moment(selectedUser?.createdAt).format("DD MMM YYYY")}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-5 gap-2 mt-auto">
                  <button
                    className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12"
                    onClick={() => handleLikeUser(selectedUser.id)}
                  >
                    <HeartIcon
                      className={cn(
                        "w-5 h-5 mx-auto ",
                        selectedUser?.isLiked && "fill-[#FF4141] text-[#FF4141]"
                      )}
                    />
                  </button>
                  <button
                    className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12"
                    onClick={() =>
                      router.push(`/friends?id=${selectedUser.id}`)
                    }
                  >
                    <MessageIcon className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black/5"
                    onClick={handleAddFriend}
                    disabled={
                      selectedUser.id === (alien?.userId || profile?.id) ||
                      friends.some((friend) => friend.id === selectedUser.id)
                    }
                  >
                    <AddUserIcon className="w-5 h-5 mx-auto" />
                  </button>
                  <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12">
                    <PlusIcon className="w-5 h-5 mx-auto" />
                  </button>
                  {selectedUser?.twitterId && (
                    <Link
                      href={`https://x.com/${selectedUser?.twitterId}`}
                      target="_blank"
                      className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12 flex items-center justify-center"
                    >
                      <XLogo className="size-4 mx-auto" />
                    </Link>
                  )}
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
