import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAliens, useProfile } from "@/store/hooks"
import { usePrivy } from "@privy-io/react-auth"
import { Grid2X2, Loader2 } from "lucide-react"
import moment from "moment"
import { toast } from "react-hot-toast"

import {
  addFriend,
  getFriendsList,
  getProfile,
  getStoreInventory,
  getTeam,
  likeUser,
} from "@/lib/api"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  AddUserIcon,
  HeartIcon,
  MessageIcon,
  PlusIcon,
  XLogo,
} from "@/components/icons"

import { ProfileContentWidget } from "./widgets"

const ProfilePage = () => {
  const searchParams = useSearchParams()
  const walletAddress = searchParams.get("walletAddress")
  const { data: profile, fetchUserProfile } = useProfile()
  const { alien } = useAliens()
  const [userData, setUserData] = useState<any>(null)
  const [userTeam, setUserTeam] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [friends, setFriends] = useState<any[]>([])
  const [liked, setLiked] = useState(false)
  const router = useRouter()
  const [storeInventoryItems, setStoreInventoryItems] = useState<any[]>([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const { user } = usePrivy()

  useEffect(() => {
    const fetchStoreInventory = async () => {
      setItemsLoading(true)
      try {
        const targetWalletAddress = walletAddress || profile?.walletAddress
        const response = await getStoreInventory(targetWalletAddress)
        if (response?.data && response?.data?.length > 0) {
          setStoreInventoryItems(response.data)
        } else {
          setStoreInventoryItems([])
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setItemsLoading(false)
      }
    }

    fetchStoreInventory()
  }, [walletAddress, profile?.walletAddress])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!walletAddress) {
        // If no walletAddress in query params, use current user's data
        setUserData(profile)
        return
      }

      try {
        setLoading(true)
        const response = await getProfile(walletAddress, user?.id || "")
        setUserData(response.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [walletAddress, profile, user])

  useEffect(() => {
    setLiked(!!profile?.likedUserIds?.includes(userData?.id || 0))
  }, [profile, userData])

  useEffect(() => {
    const fetchTeamData = async () => {
      if (!userData) return

      try {
        // For other users, use their wallet address from query params
        // For current user, use the wallet address from profile
        const targetWalletAddress = walletAddress || profile?.walletAddress
        if (targetWalletAddress) {
          const response = await getTeam(targetWalletAddress)
          setUserTeam(response.data)
        }
      } catch (error) {
        console.error("Error fetching team data:", error)
      }
    }

    fetchTeamData()
    fetchFriendsList(walletAddress || "")
  }, [userData, walletAddress, profile?.walletAddress])

  const fetchFriendsList = async (walletAddress?: string) => {
    try {
      const res = await getFriendsList(walletAddress)
      if (res.data) {
        setFriends(res.data)
      }
    } catch (error) {
      console.error("Error fetching friends list:", error)
    }
  }

  const handleAddFriend = async () => {
    if (userData) {
      try {
        // setIsLoading(true)
        const response = await addFriend([userData.id])
        if (response.data?.success) {
          toast.success("Friend added successfully")
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

  const handleLikeUser = (userId: number) => {
    likeUser(userId).then((res) => {
      if (res?.data?.liked !== undefined && userData) {
        const liked = res.data.liked
        setLiked(liked)
      }
    })
  }

  const isOwnProfile =
    !walletAddress || walletAddress === profile?.walletAddress

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    )
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        User not found
      </div>
    )
  }

  const renderActionButtons = () => (
    <div
      className={cn(
        "grid gap-2 mt-auto",
        isOwnProfile ? "grid-cols-4" : "grid-cols-5"
      )}
    >
      {!isOwnProfile && (
        <>
          <button
            className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl  transition-colors h-12"
            onClick={() => handleLikeUser(userData.id)}
          >
            <HeartIcon
              className={cn(
                "w-5 h-5 mx-auto ",
                liked && "fill-[#FF4141] text-[#FF4141]"
              )}
            />
          </button>

          <Link
            href="/friends"
            className={cn(
              "bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12 flex items-center justify-center"
            )}
          >
            <MessageIcon className="w-5 h-5 mx-auto" />
          </Link>
          <button
            className={cn(
              "bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12",
              friends.some(
                (friend) =>
                  friend.id === alien?.userId ||
                  friend.id === profile?.id ||
                  friend.id === userData.id
              )
                ? "bg-white/10"
                : ""
            )}
            onClick={handleAddFriend}
            disabled={
              userData.id === (alien?.userId || profile?.id) ||
              friends.some(
                (friend) =>
                  friend.id === alien?.userId ||
                  friend.id === profile?.id ||
                  friend.id === userData.id
              )
            }
          >
            <AddUserIcon className="w-5 h-5 mx-auto" />
          </button>
          <button className="bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12">
            <PlusIcon className="w-5 h-5 mx-auto" />
          </button>
          {userData?.twitterId && (
            <Link
              href={`https://x.com/${userData.twitterId}`}
              target="_blank"
              className={cn(
                "bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12 flex items-center justify-center"
              )}
            >
              <XLogo className="size-4 mx-auto" />
            </Link>
          )}
        </>
      )}
      {isOwnProfile && (
        <>
          <Link
            href="/friends"
            className={cn(
              "bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12 flex items-center justify-center col-span-2"
            )}
          >
            <MessageIcon className="w-5 h-5 mx-auto" />
          </Link>

          {userData?.twitterId && (
            <Link
              href={`https://x.com/${userData.twitterId}`}
              target="_blank"
              className={cn(
                "bg-black/5 border border-white/10 hover:bg-white/10 rounded-xl transition-colors h-12 flex items-center justify-center col-span-2"
              )}
            >
              <XLogo className="size-4 mx-auto" />
            </Link>
          )}
        </>
      )}
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Desktop Version */}
      <div className="flex-1 hidden lg:flex h-full bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xl">
        <div className="flex-1 flex h-full gap-4">
          {/* sidebar */}
          <div
            className={cn(
              "transition-all duration-300 rounded-r-xl flex flex-col",
              "fixed inset-0 z-50 lg:static lg:z-auto lg:w-full lg:max-w-[400px] lg:inset-auto",
              "lg:opacity-100 lg:translate-y-0"
            )}
          >
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-4 p-0.5">
                {/* Main Profile Image with Gallery */}
                <div className="flex gap-2">
                  <div className="flex-1 aspect-square rounded overflow-hidden relative">
                    <Image
                      src={userData?.aliens[0]?.image || ""}
                      alt="Character"
                      fill
                      className="object-cover z-10"
                    />
                    {userData?.elements[0]?.background && (
                      <Image
                        src={userData.elements[0].background}
                        alt="User's alien background"
                        fill
                      />
                    )}
                  </div>
                </div>

                <div className="bg-white/5 rounded p-3 flex-1 flex flex-col">
                  {/* Profile Info */}
                  <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{userData?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-white/10 rounded text-xs font-inter border border-white/10 flex">
                        <div className="border-r border-white/10 text-white/50 px-1 bg-white/5">
                          Level{" "}
                        </div>
                        <div className="font-volkhov px-2">
                          {userData?.level}
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
                      <span className="font-inter">Entreprise</span>
                      <span className="font-medium">
                        {userData?.enterprise || "-"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-inter">Reputations Points</span>
                      <span className="font-medium">
                        {userData?.reputation}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-inter">Time passed in Raids</span>
                      <span className="font-medium">246h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-inter">STAR earned</span>
                      <span className="font-medium">
                        {userData?.stars} (0.02$)
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-inter">Account creation</span>
                      <span className="font-medium">
                        {moment(userData?.createdAt).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {renderActionButtons()}
                </div>
              </div>
            </ScrollArea>
          </div>
          {/* main content */}
          <ProfileContentWidget />
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex flex-col h-full bg-white/5 border border-white/10 rounded-xl backdrop-blur-lg overflow-hidden">
        <Accordion
          type="single"
          defaultValue="main-info"
          className="flex flex-col h-full"
        >
          <div className="flex flex-col gap-2 p-3 shrink-0">
            <AccordionItem
              value="main-info"
              className="border-none [&[data-state=open]>h3>button]:hidden flex flex-col"
            >
              <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>div]:bg-white/10 [&>svg]:hidden">
                <div className="w-full bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10 transition-colors">
                  <span className="text-white font-medium">Main Infos</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden flex-1 data-[state=open]:flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="flex flex-col gap-4 pr-4 pb-4">
                    {/* Main Profile Image with Gallery */}
                    <div className="flex gap-2">
                      <div className="flex-1 aspect-square rounded overflow-hidden relative">
                        <Image
                          src={userData?.aliens[0]?.image || "/images/user.png"}
                          alt="Character"
                          fill
                          className="object-cover z-10"
                        />
                        {userData?.elements[0]?.background && (
                          <Image
                            src={userData.elements[0].background}
                            alt="User's alien background"
                            fill
                          />
                        )}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded p-3 flex-1 flex flex-col">
                      {/* Profile Info */}
                      <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{userData?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-white/10 rounded text-xs font-inter border border-white/10 flex">
                            <div className="border-r border-white/10 text-white/50 px-1 bg-white/5">
                              Level
                            </div>
                            <div className="font-volkhov px-2">
                              {userData?.level}
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
                          <span className="font-inter">Entreprise</span>
                          <span className="font-medium">
                            {userData?.enterprise || "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-inter">Reputations Points</span>
                          <span className="font-medium">
                            {userData?.reputation}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-inter">
                            Time passed in Raids
                          </span>
                          <span className="font-medium">246h</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-inter">STAR earned</span>
                          <span className="font-medium">
                            {userData?.stars} (0.02$)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-inter">Account creation</span>
                          <span className="font-medium">
                            {moment(userData?.createdAt).format("DD MMM YYYY")}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {renderActionButtons()}
                    </div>
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="inventory"
              className="border-none [&[data-state=open]>h3>button]:hidden flex flex-col"
            >
              <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>div]:bg-white/10 [&>svg]:hidden">
                <div className="w-full bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10 transition-colors">
                  <span className="text-white font-medium">Inventory</span>
                  {/* <div className="flex items-center gap-2">
                    <span className="text-white/50">Total worth</span>
                    <div className="flex items-center gap-1">
                      <span className="text-white">4.567</span>
                      <Image
                        src="/images/logos/eth.png"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                    </div>
                  </div> */}
                </div>
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden flex-1 data-[state=open]:flex flex-col">
                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-2 gap-3 pr-4 pb-4">
                    {storeInventoryItems.length > 0 && !itemsLoading ? (
                      storeInventoryItems?.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white/5 rounded-xl p-3 flex flex-col"
                        >
                          <div className="aspect-square rounded-lg bg-white/5 mb-3 relative">
                            <Image
                              src={item?.image || ""}
                              alt={item?.name || ""}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">
                                {item.name}
                              </span>
                              <Badge variant={item?.type?.toLowerCase()}>
                                {item?.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <span className="text-white/50">Price</span>
                              <div className="flex items-center gap-1">
                                <span>{item.price || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-white/50">Quantity</span>
                              <div className="flex items-center gap-1">
                                <span>{item.quantity || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-10 text-white/60">
                        {itemsLoading ? (
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            <span className="text-sm">Loading Items...</span>
                          </div>
                        ) : (
                          "No items found"
                        )}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="activity"
              className="border-none [&[data-state=open]>h3>button]:hidden flex flex-col"
            >
              <AccordionTrigger className="p-0 hover:no-underline [&[data-state=open]>div]:bg-white/10 [&>svg]:hidden">
                <div className="w-full bg-white/5 rounded-xl p-3 flex items-center justify-between border border-white/10 transition-colors">
                  <span className="text-white font-medium">Activity</span>
                  <button className="size-6 flex items-center justify-center bg-white/5 rounded border border-white/10">
                    <Grid2X2 className="size-4" />
                  </button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="overflow-hidden flex-1 data-[state=open]:flex flex-col">
                <div className="flex-1 flex items-center justify-center text-white/50">
                  Activity content coming soon...
                </div>
              </AccordionContent>
            </AccordionItem>
          </div>
        </Accordion>
      </div>
    </div>
  )
}

export default ProfilePage
