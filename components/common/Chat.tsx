import { useEffect, useRef, useState } from "react"
import { useAliens, useProfile } from "@/store/hooks"

import { getMessages, sendMessage } from "@/lib/api"
import { cn } from "@/lib/utils"
import IconButton from "@/components/ui/icon-button"
import { ChatIcon } from "@/components/icons"

function formatTimestamp(): string {
  const now = new Date()
  // midnight today
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const timePart = now
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toLowerCase() // “2:39 pm”

  return `Today at ${timePart}`
}

const Chat = ({
  className,
  btnClassName,
}: {
  className?: string
  btnClassName?: string
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [messageInput, setMessageInput] = useState("")
  const { alien } = useAliens()
  const { data: profile } = useProfile()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [messagePollingInterval, setMessagePollingInterval] =
    useState<NodeJS.Timeout | null>(null)

  // Update polling when chat open/close state changes
  useEffect(() => {
    if (isChatOpen) {
      // Initial fetch when chat opens
      fetchMessages()

      // Set up polling every 30 seconds
      const interval = setInterval(() => {
        fetchMessages()
      }, 30000) // 30 seconds

      setMessagePollingInterval(interval)
    } else {
      // Clear interval when chat closes
      if (messagePollingInterval) {
        clearInterval(messagePollingInterval)
        setMessagePollingInterval(null)
      }
    }

    // Clean up interval on component unmount or when effect re-runs
    return () => {
      if (messagePollingInterval) {
        clearInterval(messagePollingInterval)
      }
    }
  }, [isChatOpen]) // Dependency on isChatOpen

  // Helper function to fetch messages
  const fetchMessages = async () => {
    try {
      const res = await getMessages()
      if (res.data) {
        setMessages(res.data)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  // Handle Enter key press to send message
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return

    const timestamp = Date.now()

    const newMessage = {
      id: `temp_${timestamp}`,
      senderImage: alien?.image,
      senderName: profile?.name,
      elementImage: alien?.element?.image,
      content: messageInput,
      formattedDate: formatTimestamp(),
    }

    setMessages((prevMessages) => [...prevMessages, newMessage])

    // Scroll to bottom after sending a message
    setTimeout(() => scrollToBottom("smooth"), 100)

    setMessageInput("")

    await callSendMessage()
  }

  const callSendMessage = async () => {
    if (!profile) return
    await sendMessage("", messageInput)
  }

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
  }, [messages])

  const handleChatOpen = () => {
    setIsChatOpen(true)
    fetchMessages()
    // Force scroll after a delay
    const chatContainer = document.getElementById("chat-container")

    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }

  return (
    <>
      <div
        className={cn(
          "chat-container z-[55555]",
          isChatOpen && "h-[350px] w-[320px] relative",
          className
        )}
      >
        {isChatOpen && (
          <div className="glass-effect rounded-2xl w-full h-full p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 items-center gap-6 bg-white/10 rounded-lg py-1 px-2">
                <p className="font-volkhov text-sm text-white">General Chat</p>
              </div>
              <button
                className="shrink-0 px-2 py-0.5 rounded-xl bg-brand text-white font-medium bg-white/5 border border-white/10 font-inter"
                onClick={() => setIsChatOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x-icon lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div
              className="flex-1 overflow-y-auto min-h-0 scrollbar-none"
              ref={chatContainerRef}
              id="chat-container"
            >
              <div className="flex flex-col gap-2">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 p-2 rounded-lg relative transition-all duration-300 bg-white/10"
                      )}
                    >
                      <div
                        className="size-14 rounded bg-white/10 shrink-0 mt-1"
                        style={{
                          backgroundImage: `url(${message.elementImage.replace(".png", "-bg.png") || ""})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        <img
                          src={message.senderImage}
                          alt={message.senderName}
                          className="size-14 rounded"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-0">
                          <p className="text-white font-medium pr-1">
                            {message.senderName}
                          </p>
                          <p className="text-white/50 text-xs">
                            {message.formattedDate}
                          </p>
                        </div>
                        <p className="text-white text-xs text-wrap">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-white text-center">No messages yet</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {/* This is not fitting. it is overflowing from the right side of the container */}
            <div className="flex gap-1 w-full items-center">
              <input
                type="text"
                placeholder="Text to begin chatting..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 bg-white/5 rounded-xl px-2 py-2 text-white placeholder:text-white/50 outline-none border border-white/10 focus:border-white/20 font-inter"
              />
              {/* <button className="shrink-0 px-3 py-2 rounded-xl bg-brand text-white font-medium bg-white/5 border border-white/10 font-inter">
            👀
          </button> */}
              <button
                className="shrink-0 px-3 py-2 rounded-xl bg-brand text-white font-medium bg-white/5 border border-white/10 font-inter"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        className={cn(
          "flex justify-center rounded-normal flex-row z-[55] lg:flex-col items-center gap-1.5 lg:gap-2.5 max-lg:h-14 lg:w-14 p-2 max-lg:backdrop-blur-0 max-lg:border-none",
          btnClassName
        )}
        onClick={handleChatOpen}
      >
        <IconButton
          className="size-[55px] lg:size-14 rounded-xl"
          showBase
          onClick={() => setIsChatOpen(false)}
        >
          <ChatIcon className="size-6" />
        </IconButton>
      </div>
    </>
  )
}

export default Chat
