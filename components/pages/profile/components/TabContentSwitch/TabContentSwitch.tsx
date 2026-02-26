import { ReactNode } from "react"

type TabContentProps = { id: number; content: ReactNode }

interface TabContentSwitchProps {
  tabsContent: TabContentProps[]
  currentTab: number
}

export const TabContentSwitch = ({
  tabsContent,
  currentTab,
}: TabContentSwitchProps) => {
  const currentTabItem = tabsContent.find((item) => item.id === currentTab)

  if (!currentTabItem) {
    return null
  }

  if (!currentTabItem.content) {
    return "Ooops... you forgot the content!"
  }

  return currentTabItem.content
}
