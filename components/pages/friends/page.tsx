import { useEffect, useState } from "react"
import { useAliens, useProfile } from "@/store/hooks"
import { Search } from "lucide-react"

import { getFriendsList, getMessages, sendMessage } from "@/lib/api"
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

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [friends, setFriends] = useState<Friend[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const openChat = (friend: Friend) => {
    setSelectedFriend(friend)
  }
  const { alien } = useAliens()
  const { data: profile } = useProfile()

  console.log("alien ===>", alien)
  console.log("profile ===>", profile)

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

    const newMessage = {
      id: `temp_${Date.now()}`,
      senderId: profile.id,
      senderWalletAddress: profile.walletAddress,
      content: messageInput,
      timestamp: Date.now(),
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])

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

  // Friends List Component
  const FriendsList = () => (
    <div className="w-full lg:w-[320px] flex flex-col h-full">
      {/* Top Controls */}
      <div className="flex items-center gap-1 mb-4 shrink-0 p-3 bg-white/5 rounded-lg">
        <button
          onClick={() => setActiveTab("all")}
          className={cn(
            "h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex-1 font-inter",
            activeTab === "all" && "bg-white/20"
          )}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("online")}
          className={cn(
            "h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex items-center gap-2 flex-1 font-inter",
            activeTab === "online" && "bg-white/20"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Online
        </button>
        <button className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex items-center gap-2 flex-1 font-inter">
          <Search className="w-4 h-4" />
          Search
        </button>
        <button className="h-10 px-4 rounded-lg bg-white/5 border border-white/10 text-white text-xs flex items-center gap-2 flex-1 font-inter">
          Add
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none ">
        <div className="flex flex-col gap-2 pb-4">
          {friends.length > 0 ? (
            friends.map((friend, index) => (
              <div
                key={index}
                className="flex h-16 gap-2 cursor-pointer"
                onClick={() => openChat(friend)}
              >
                <div className="relative shrink-0">
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
                    <span className="text-white/50 text-xs">{friend.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p
                      className={cn(
                        "text-xs truncate max-w-[200px] font-inter",
                        friend.newMessageCount > 0 && "text-[#5FFF95]"
                      )}
                    >
                      {friend.lastMessage}
                    </p>
                    {friend.newMessageCount > 0 && (
                      <span className="text-2xs font-inter bg-[#5FFF95] text-black size-4 rounded-full flex items-center justify-center">
                        {friend.newMessageCount}
                      </span>
                    )}
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
                      <div className="flex items-center gap-1">
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
                      </div>
                    </div>
                  </div>
                  <button className="text-xs font-inter border border-white/10 px-3 py-1 rounded bg-white/5">
                    View profile
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none">
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
                            <div className="size-14 rounded bg-white/10 shrink-0 mt-1">
                              <img
                                src={
                                  message.senderWalletAddress ===
                                  profile?.walletAddress
                                    ? selectedFriend.image
                                    : "/images/user.png"
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
                    <div className="flex items-center gap-1">
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
                    </div>
                  </div>
                </div>
                <button className="text-xs font-inter border border-white/10 px-3 py-1 rounded bg-white/5">
                  View profile
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-none">
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
                        <div className="size-10 lg:size-14 rounded bg-white/10 shrink-0 mt-1">
                          <img
                            src={
                              message.senderWalletAddress ===
                              profile?.walletAddress
                                ? selectedFriend.image
                                : "/images/user.png"
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
