import { useEffect, useRef, useState } from "react"
import { useAliens, useProfile } from "@/store/hooks"
import { Loader2, Search } from "lucide-react"
import { toast } from "react-hot-toast"

import {
  addFriend,
  getFriendsList,
  getMessages,
  searchFriend,
  sendMessage,
} from "@/lib/api"
import { cn } from "@/lib/utils"
import { ArrowBack } from "@/components/icons"

type Message = {
  id: string
  sender?: string
  senderId: number
  senderWalletAddress: string
  content: string
  timestamp: number // Unix timestamp in milliseconds
}

type MessageGroup = {
  date: string
  messages: Message[]
}

type Friend = {
  id: number
  image: string
  name: string
  level: number
  online: boolean
  lastMessage: string
  newMessageCount: number
  time: string
  messages: Message[]
  element: string
  message: {
    content: string
    timestamp: string
  }
}

// Utility functions for date formatting
const formatMessageTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(new Date(timestamp))
}

const formatMessageDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return "Today"
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday"
  } else {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }
}

// Add the formatRelativeTime helper function
const formatRelativeTime = (timestamp: number): string => {
  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)
  const diffMonth = Math.floor(diffDay / 30)
  const diffYear = Math.floor(diffMonth / 12)

  if (diffSec < 60) return `${diffSec}s`
  if (diffMin < 60) return `${diffMin}m`
  if (diffHour < 24) return `${diffHour}h`
  if (diffDay < 30) return `${diffDay}d`
  if (diffMonth < 12) return `${diffMonth} months`
  return `${diffYear}y`
}

const friends = [
  {
    image: "/images/user.png",
    name: "Clmjo",
    level: 166,
    online: false,
    lastMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In blandit, dolor eu condimentum fringilla, est arcu aliquet.",
    newMessageCount: 0,
    time: "1m",
    messages: [
      // 5 days ago
      {
        id: "msg_1",
        sender: "Clmjo",
        content: "Hey! How are you doing?",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
      },
      {
        id: "msg_2",
        sender: "You",
        content: "I'm doing great! Thanks for asking.",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 60 * 5, // 5 days ago + 5 minutes
      },
      // 3 days ago
      {
        id: "msg_3",
        sender: "Clmjo",
        content: "Want to join me for some gaming later?",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
      },
      {
        id: "msg_4",
        sender: "You",
        content: "Sure! What time were you thinking?",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 2, // 3 days ago + 2 minutes
      },
      {
        id: "msg_5",
        sender: "Clmjo",
        content: "How about 8 PM?",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 5, // 3 days ago + 5 minutes
      },
      // Yesterday
      {
        id: "msg_6",
        sender: "Clmjo",
        content: "That was a great gaming session yesterday!",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1, // Yesterday
      },
      {
        id: "msg_7",
        sender: "You",
        content: "Yeah, we should do it again sometime!",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 3, // Yesterday + 3 minutes
      },
      // Today's messages
      {
        id: "msg_8",
        sender: "Clmjo",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In blandit, dolor eu condimentum fringilla, est arcu aliquet.",
        timestamp: Date.now() - 1000 * 60 * 8, // 8 minutes ago
      },
      {
        id: "msg_9",
        sender: "Clmjo",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing.",
        timestamp: Date.now() - 1000 * 60 * 6, // 6 minutes ago
      },
      {
        id: "msg_10",
        sender: "You",
        content: "Lorem ipsum !!",
        timestamp: Date.now() - 1000 * 60 * 6, // 6 minutes ago
      },
      {
        id: "msg_11",
        sender: "Clmjo",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In blandit, dolor eu condimentum fringilla, est arcu aliquet urna, non egestas elit tellus. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In blandit, dolor eu condimentum fringilla, est arcu aliquet urna, non egestas elit tellus.",
        timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
      },
      {
        id: "msg_12",
        sender: "You",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        timestamp: Date.now() - 1000 * 60 * 0, // Just now
      },
    ],
  },
  {
    image: "/images/user.png",
    name: "8x3Transmuteur",
    level: 169,
    online: true,
    lastMessage: "Lorem ipsum dolor sit amet consectetur adi",
    newMessageCount: 4,
    time: "3m",
    messages: [
      {
        id: "msg_1",
        sender: "8x3Transmuteur",
        content: "Hey there!",
        timestamp: Date.now() - 1000 * 60 * 60 * 24, // 24 hours ago
      },
      {
        id: "msg_2",
        sender: "8x3Transmuteur",
        content: "Are you available for a quick chat?",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
      },
      {
        id: "msg_3",
        sender: "You",
        content: "I'll be free in about an hour!",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4 + 1000 * 60 * 30, // 4 days ago + 30 minutes
      },
    ],
  },
]

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [friends, setFriends] = useState<Friend[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedSearchResults, setSelectedSearchResults] = useState<number[]>(
    []
  )
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  // Add polling interval references
  const [messagePollingInterval, setMessagePollingInterval] =
    useState<NodeJS.Timeout | null>(null)
  const [friendsPollingInterval, setFriendsPollingInterval] =
    useState<NodeJS.Timeout | null>(null)
  const { alien } = useAliens()
  const { data: profile } = useProfile()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Function to open chat and scroll to bottom
  const openChat = (friend: Friend) => {
    setSelectedFriend(friend)

    // Force scroll after a delay
    const chatContainer = document.getElementById("chat-container")
    const chatContainerMobile = document.getElementById("chat-container-mobile")

    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }

    if (chatContainerMobile) {
      chatContainerMobile.scrollTop = chatContainerMobile.scrollHeight
    }
  }

  // Force scroll when messages change
  useEffect(() => {
    if (selectedFriend) {
      const chatContainer = document.getElementById("chat-container")
      const chatContainerMobile = document.getElementById(
        "chat-container-mobile"
      )

      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight
      }

      if (chatContainerMobile) {
        chatContainerMobile.scrollTop = chatContainerMobile.scrollHeight
      }
    }
  }, [messages, selectedFriend])

  console.log("alien ===>", alien)
  console.log("profile ===>", profile)

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior })
    }
  }

  // Scroll to bottom when messages change or when a friend is selected
  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      scrollToBottom()
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [messages, selectedFriend])

  // Fetch friends list initially and set up polling
  useEffect(() => {
    // Initial fetch
    fetchFriendsList()

    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      fetchFriendsList()
    }, 30000) // 30 seconds

    setFriendsPollingInterval(interval)

    // Clean up interval on component unmount
    return () => {
      if (friendsPollingInterval) {
        clearInterval(friendsPollingInterval)
      }
    }
  }, [])

  // Helper function to fetch friends list
  const fetchFriendsList = async () => {
    try {
      const res = await getFriendsList()
      console.log("getFriendsList response ===>", res)
      if (res.data) {
        setFriends(res.data)
      }
    } catch (error) {
      console.error("Error fetching friends list:", error)
    }
  }

  // Set up message polling when a friend is selected
  useEffect(() => {
    // Clear any existing polling interval
    if (messagePollingInterval) {
      clearInterval(messagePollingInterval)
      setMessagePollingInterval(null)
    }

    if (selectedFriend) {
      // Initial fetch
      fetchMessages()

      // Set up polling every 30 seconds
      const interval = setInterval(() => {
        fetchMessages()
      }, 30000) // 30 seconds

      setMessagePollingInterval(interval)
    }

    // Clean up interval when component unmounts or friend changes
    return () => {
      if (messagePollingInterval) {
        clearInterval(messagePollingInterval)
      }
    }
  }, [selectedFriend])

  // Helper function to fetch messages
  const fetchMessages = async () => {
    if (!selectedFriend) return

    try {
      const res = await getMessages(selectedFriend.id)
      console.log("getMessages response ===>", res)
      if (res.data) {
        setMessages(res.data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  // Clean up all intervals when component unmounts
  useEffect(() => {
    return () => {
      if (messagePollingInterval) clearInterval(messagePollingInterval)
      if (friendsPollingInterval) clearInterval(friendsPollingInterval)
    }
  }, [])

  const handleBack = () => {
    setSelectedFriend(null)
  }

  useEffect(() => {
    getFriendsList().then((res) => {
      console.log("getFriendsList response ===>", res)
      if (res.data) {
        setFriends(res.data)
      }
    })
  }, [])

  useEffect(() => {
    if (selectedFriend) {
      getMessages(selectedFriend.id).then((res) => {
        console.log("getMessages response ===>", res)
        if (res.data) {
          setMessages(res.data)
        }
      })
    }
  }, [selectedFriend])

  const groupMessagesByDate = (messages: Message[]): MessageGroup[] => {
    const groups: { [key: string]: Message[] } = {}

    // Sort messages by timestamp
    const sortedMessages = [...messages].sort(
      (a, b) => a.timestamp - b.timestamp
    )

    sortedMessages.forEach((message) => {
      const dateKey = formatMessageDate(message.timestamp)
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
    })

    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }))
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedFriend || !profile) return

    const timestamp = Date.now()

    const newMessage = {
      id: `temp_${timestamp}`,
      senderId: alien?.userId || profile.id,
      senderWalletAddress: profile.walletAddress,
      content: messageInput,
      timestamp: timestamp,
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])

    // Scroll to bottom after sending a message
    setTimeout(() => scrollToBottom("smooth"), 100)

    // Update the friend's last message in the friends list
    setFriends((prevFriends) =>
      prevFriends.map((friend) => {
        if (friend.id === selectedFriend.id) {
          return {
            ...friend,
            message: {
              content: messageInput,
              timestamp: formatRelativeTime(timestamp),
            },
          }
        }
        return friend
      })
    )

    setMessageInput("")

    await callSendMessage()
  }

  const callSendMessage = async () => {
    if (!selectedFriend || !profile) return
    await sendMessage(selectedFriend.id, messageInput)
  }

  // Handle Enter key press to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSearchClick = () => {
    setIsSearchActive(true)
  }

  const handleSearchClose = () => {
    setIsSearchActive(false)
    setSearchQuery("")
    setSearchResults([])
    setSelectedSearchResults([]) // Clear selected results
  }

  const handleSelectSearchResult = (userId: number) => {
    setSelectedSearchResults((prev) => {
      // If already selected, remove it; otherwise, add it
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId)
      } else {
        return [...prev, userId]
      }
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Don't search for empty queries
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    // Set a new timeout to delay the API call while typing
    const timeout = setTimeout(() => {
      searchFriend(query).then((res) => {
        if (res.data) {
          setSearchResults(res.data)
        }
      })
    }, 500) // 500ms delay

    setSearchTimeout(timeout)
  }

  const handleAddFriend = async () => {
    if (selectedSearchResults.length > 0) {
      try {
        setIsLoading(true)
        // Call the API with an array of all selected user IDs
        // This assumes the API endpoint has been updated to accept an array
        const response = await addFriend(selectedSearchResults)

        if (response.data?.success) {
          toast.success(
            `${selectedSearchResults.length} ${
              selectedSearchResults.length > 1 ? "Friends" : "Friend"
            } added successfully`
          )
          // Refresh friends list
          getFriendsList().then((res) => {
            if (res.data) {
              setFriends(res.data)
            }
          })

          // Reset search
          handleSearchClose()
        } else {
          toast.error("Failed to add friends")
        }
      } catch (error) {
        console.error("Error adding friends:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  console.log("alien =====>", alien)
  console.log("profile =====>", profile)

  // Friends List Component
  const FriendsList = () => (
    <div className="w-full lg:w-[320px] flex flex-col h-full overflow-auto">
      {/* Top Controls */}
      <div className="flex items-center gap-1 mb-4 shrink-0 p-3 bg-white/5 rounded-lg">
        {isSearchActive ? (
          <div className="flex items-center gap-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search friends..."
              className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex-1 font-inter focus:outline-none focus:border-white/20"
              autoFocus
            />
            <button
              onClick={handleSearchClose}
              className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex items-center gap-2 font-inter"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex-1 font-inter",
                activeTab === "all" && "bg-white/20"
              )}
            >
              All
            </button>
            {/* <button
              onClick={() => setActiveTab("online")}
              className={cn(
                "h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex items-center gap-2 flex-1 font-inter",
                activeTab === "online" && "bg-white/20"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Online
            </button> */}
            <button
              onClick={handleSearchClick}
              className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex items-center gap-2 flex-1 font-inter"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
            {/* <button className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex items-center gap-2 flex-1 font-inter">
              Add
            </button> */}
          </>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isSearchActive && searchQuery && (
        <div className="relative z-10">
          <div className="absolute w-full bg-[#1A1A1A] border border-white/10 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
            {searchResults.length > 0 ? (
              <div className="flex flex-col gap-1 p-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className={cn(
                      "flex h-12 gap-2 cursor-pointer p-2 rounded items-center",
                      selectedSearchResults.includes(user.id) && "bg-white/10"
                    )}
                    onClick={() => handleSelectSearchResult(user.id)}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={user.image || "/images/user.png"}
                        alt={user.name}
                        className="size-8 rounded"
                      />
                    </div>
                    <div className="flex-1 flex items-center">
                      <span className="text-white text-sm font-medium">
                        {user.name}
                        {user.level && (
                          <span className="bg-white/5 border border-white/10 text-2xs py-0.5 rounded px-1.5 font-inter ml-1">
                            Lvl. {user.level}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-6">
                      {selectedSearchResults.includes(user.id) && (
                        <div className="w-4 h-4 rounded-full bg-[#5FFF95] flex items-center justify-center">
                          <span className="text-black text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {selectedSearchResults.length > 0 && (
                  <button
                    onClick={handleAddFriend}
                    disabled={isLoading}
                    className="mt-2 h-10 px-4 rounded-lg bg-[#5FFF95] text-black text-xs font-medium font-inter w-full"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : (
                      <>
                        Add{" "}
                        {selectedSearchResults.length > 1
                          ? `${selectedSearchResults.length} Friends`
                          : "Friend"}
                      </>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-white/50 text-sm">No users found</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none">
        <div className="flex flex-col gap-2 pb-4">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={index}
                className="flex h-16 gap-2 cursor-pointer"
                onClick={() => openChat(friend)}
              >
                <div
                  className="relative shrink-0 rounded-sm"
                  style={{
                    backgroundImage: `url(${friend?.element || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="size-16 rounded"
                  />
                  {friend.online && (
                    <div className="absolute top-1/2 -translate-y-1/2 -right-[4px] size-2 rounded-full bg-green-400 border-4 border-[#5FFF954A]" />
                  )}
                </div>
                <div className="flex-1 bg-white/5 rounded p-2 h-16 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium">
                      {friend.name}{" "}
                      <span className="bg-white/5 border border-white/10 text-2xs py-0.5 rounded px-1.5 font-inter">
                        Lvl. {friend.level}
                      </span>
                    </span>
                    <span className="text-white/50 text-xs">
                      {friend?.message?.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-xs truncate max-w-[200px] font-inter"
                        // friend?.message?.content && "text-[#5FFF95]"
                      )}
                    >
                      {friend?.message?.content}
                    </p>
                    {/* {friend.newMessageCount > 0 && (
                      <span className="text-2xs font-inter bg-[#5FFF95] text-black size-4 rounded-full flex items-center justify-center">
                        {friend.newMessageCount}
                      </span>
                    )} */}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-white/50 text-sm">No friends found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Desktop Version */}
      <div className="flex-1 hidden lg:flex h-full bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-xl">
        <div className="flex-1 flex h-full gap-4">
          <FriendsList />

          {/* Chat Window - Desktop */}
          <div className="flex-1 flex flex-col h-full bg-white/5 p-2 rounded">
            {selectedFriend ? (
              <>
                <div className="shrink-0 p-3 bg-white/5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-white font-medium">
                        {selectedFriend.name}
                      </h3>
                      {/* <div className="flex items-center gap-1">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full",
                            selectedFriend.online
                              ? "bg-[#5FFF95]"
                              : "bg-[#FF985F]"
                          )}
                        />
                        <p className="text-white/50 text-xs">
                          {selectedFriend.online
                            ? "Currently online"
                            : "Currently offline"}
                        </p>
                      </div> */}
                    </div>
                  </div>
                  <button className="text-xs font-inter border border-white/10 px-3 py-1 rounded bg-white/5">
                    View profile
                  </button>
                </div>

                {/* Chat Messages */}
                <div
                  className="flex-1 overflow-y-auto min-h-0 scrollbar-none"
                  ref={chatContainerRef}
                  id="chat-container"
                >
                  <div className="flex flex-col gap-4 p-4">
                    {groupMessagesByDate(messages).map((group, groupIndex) => (
                      <div key={groupIndex} className="flex flex-col gap-2">
                        <div className="text-white/50 text-xs text-center bg-white/5 py-1 px-3 rounded font-inter w-fit mx-auto">
                          {group.date}
                        </div>

                        {group.messages.map((message, messageIndex) => (
                          <div
                            key={message.id}
                            className={cn(
                              "flex gap-3 max-w-[80%] items-end",
                              message.senderWalletAddress ===
                                profile?.walletAddress &&
                                "ml-auto flex-row-reverse"
                            )}
                          >
                            {/* <div className="size-14 rounded bg-white/10 shrink-0 mt-1"> */}
                            <div
                              className="size-14 bg-white/10 shrink-0 mt-1 rounded-sm"
                              style={{
                                backgroundImage: `url(${
                                  message.senderWalletAddress ===
                                  profile?.walletAddress
                                    ? alien?.element?.background
                                    : selectedFriend?.element || ""
                                })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              <img
                                src={
                                  message.senderWalletAddress ===
                                  profile?.walletAddress
                                    ? alien?.image
                                    : selectedFriend.image || "/images/user.png"
                                }
                                alt={message.sender}
                                className="size-14 rounded"
                              />
                            </div>
                            <div
                              className={cn(
                                "flex flex-col gap-1",
                                message.senderWalletAddress ===
                                  profile?.walletAddress && "items-end"
                              )}
                            >
                              <div
                                className={cn(
                                  "text-white/90 rounded-xl p-3",
                                  message.senderWalletAddress ===
                                    profile?.walletAddress
                                    ? "bg-[#51A1FF33]"
                                    : "bg-white/5"
                                )}
                              >
                                <span className="text-white font-medium">
                                  {message.senderWalletAddress ===
                                  profile?.walletAddress
                                    ? "You"
                                    : selectedFriend.name}
                                </span>
                                <p className="text-xs">{message.content}</p>
                              </div>
                              <span className="text-white/50 text-xs font-inter">
                                {formatMessageTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Chat Input */}
                <div className="shrink-0 p-3">
                  <div className="flex gap-1">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder={`Send a message to ${selectedFriend.name}`}
                      className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/50 outline-none border border-white/10 focus:border-white/20 font-inter"
                      onKeyPress={handleKeyPress}
                    />
                    <button className="px-4 rounded-xl bg-brand text-white font-medium bg-white/5 border border-white/10 font-inter">
                      👀
                    </button>
                    <button
                      className="px-4 rounded-xl bg-brand text-white font-medium bg-white/5 border border-white/10 font-inter"
                      onClick={handleSendMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-white text-2xl font-medium mb-2">
                  Select friends and chat with them
                </h2>
                {/* <p className="text-white/50 text-sm">
                  Lorem ipsum dolor sit amet, consectetur adi...
                </p> */}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden flex flex-col h-full bg-white/5 border border-white/10 rounded-xl backdrop-blur-lg p-3">
        {!selectedFriend ? (
          <div className="h-full flex flex-col overflow-hidden">
            <FriendsList />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="shrink-0 ">
              <button
                onClick={handleBack}
                className="flex items-center justify-between gap-2 bg-white/5 rounded p-3 mb-3 lg:hidden border border-white/10 w-full"
              >
                <span>Back to Friends list</span>
                <ArrowBack className="w-4 h-4" />
              </button>
              <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="text-white font-medium">
                      {selectedFriend.name}
                    </h3>
                    {/* <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          selectedFriend.online
                            ? "bg-[#5FFF95]"
                            : "bg-[#FF985F]"
                        )}
                      />
                      <p className="text-white/50 text-xs">
                        {selectedFriend.online
                          ? "Currently online"
                          : "Currently offline"}
                      </p>
                    </div> */}
                  </div>
                </div>
                <button className="text-xs font-inter border border-white/10 px-3 py-1 rounded bg-white/5">
                  View profile
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              className="flex-1 overflow-y-auto min-h-0 scrollbar-none"
              ref={chatContainerRef}
              id="chat-container-mobile"
            >
              <div className="flex flex-col gap-4 p-4">
                {groupMessagesByDate(messages).map((group, groupIndex) => (
                  <div key={groupIndex} className="flex flex-col gap-2">
                    <div className="text-white/50 text-xs text-center bg-white/5 py-1 px-3 rounded font-inter w-fit mx-auto">
                      {group.date}
                    </div>

                    {group.messages.map((message, messageIndex) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex gap-3 lg:max-w-[80%] items-end",
                          message.senderWalletAddress ===
                            profile?.walletAddress && "ml-auto flex-row-reverse"
                        )}
                      >
                        <div
                          className="size-10 lg:size-14 rounded bg-white/10 shrink-0 mt-1"
                          style={{
                            backgroundImage: `url(${
                              message.senderWalletAddress ===
                              profile?.walletAddress
                                ? alien?.element?.background
                                : selectedFriend?.element || ""
                            })`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <img
                            src={
                              message.senderWalletAddress ===
                              profile?.walletAddress
                                ? alien?.image
                                : selectedFriend.image || "/images/user.png"
                            }
                            alt={message.sender}
                            className="size-10 lg:size-14 rounded"
                          />
                        </div>
                        <div
                          className={cn(
                            "flex flex-col gap-1",
                            message.senderWalletAddress ===
                              profile?.walletAddress && "items-end"
                          )}
                        >
                          <div
                            className={cn(
                              "text-white/90 rounded-xl p-3",
                              message.senderWalletAddress ===
                                profile?.walletAddress
                                ? "bg-[#51A1FF33]"
                                : "bg-white/5"
                            )}
                          >
                            <span className="text-white font-medium">
                              {message.senderWalletAddress ===
                              profile?.walletAddress
                                ? "You"
                                : selectedFriend.name}
                            </span>
                            <p className="text-xs">{message.content}</p>
                          </div>
                          <span className="text-white/50 text-xs font-inter">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="shrink-0 p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Send a message..."
                  className="flex-1 bg-white/5 rounded-xl px-4 py-3 text-white placeholder:text-white/50 outline-none border border-white/10 focus:border-white/20"
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="px-4 rounded-xl bg-brand text-white font-medium"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FriendsPage
