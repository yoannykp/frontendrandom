import { Tab, TabProps } from "./Tab"

type TabItemProps = Pick<TabProps, "title" | "before"> & { id: number }

interface TabsProps {
  tabs: TabItemProps[]
  currentTab: number
  onTabChange: (tab: number) => void
}

export const Tabs = ({ tabs, currentTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex gap-2 font-inter">
      {tabs.map(({ id, ...restTabProps }) => (
        <Tab
          key={id}
          isActive={currentTab === id}
          onClick={() => onTabChange(id)}
          {...restTabProps}
        />
      ))}
    </div>
  )
}
