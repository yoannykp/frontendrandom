import React from "react"

import { cn } from "@/lib/utils"

import { ChatIcon } from "../icons"
import IconButton from "../ui/icon-button"

const ChatBox = ({ className }: { className?: string }) => {
  return (
    <div className={cn("", className)}>
      <IconButton className="size-[55px] lg:size-14 rounded-xl" showBase>
        <ChatIcon className="size-6" />
      </IconButton>
    </div>
  )
}

export default ChatBox
