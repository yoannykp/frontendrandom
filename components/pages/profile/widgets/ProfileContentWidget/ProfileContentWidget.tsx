import { useState } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

import { TabContentSwitch, Tabs } from "../../components"
import { PORTFOLIO_CONTENT, PORTFOLIO_TABS } from "./constants"
import { ProfilePageTab } from "./types"

export const ProfileContentWidget = () => {
  const [currentTab, setCurrentTab] = useState<ProfilePageTab>(
    ProfilePageTab.INVENTORY
  )

  return (
    <div className="flex-1 flex flex-col gap-3">
      {/* Top Tabs */}
      <Tabs
        tabs={PORTFOLIO_TABS}
        currentTab={currentTab}
        onTabChange={(tab: ProfilePageTab) => setCurrentTab(tab)}
      />

      {/* Scrollable Grid Area */}
      <ScrollArea className="flex-1">
        <TabContentSwitch
          tabsContent={PORTFOLIO_CONTENT}
          currentTab={currentTab}
        />
      </ScrollArea>
    </div>
  )
}
