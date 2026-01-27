import { ActivityIcon, PortfolioIcon } from "@/components/icons"

import {
  ActivityContent,
  InventoryContent,
  PortfolioContent,
} from "./components"
import { ProfilePageTab } from "./types"

export const PORTFOLIO_TABS = [
  {
    id: ProfilePageTab.INVENTORY,
    title: "Inventory",
  },
  {
    id: ProfilePageTab.ACTIVITY,
    title: "Activity",
    before: <ActivityIcon />,
  },
  {
    id: ProfilePageTab.PORTFOLIO,
    title: "Portfolio",
    before: <PortfolioIcon />,
  },
]

export const PORTFOLIO_CONTENT = [
  { id: ProfilePageTab.INVENTORY, content: <InventoryContent /> },
  { id: ProfilePageTab.ACTIVITY, content: <ActivityContent /> },
  { id: ProfilePageTab.PORTFOLIO, content: <PortfolioContent /> },
]
