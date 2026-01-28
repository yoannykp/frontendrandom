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
    after: <ActivityIcon />,
  },
  {
    id: ProfilePageTab.PORTFOLIO,
    title: "Portfolio",
    after: <PortfolioIcon />,
  },
]

export const PORTFOLIO_CONTENT = [
  { id: ProfilePageTab.INVENTORY, content: <InventoryContent /> },
  { id: ProfilePageTab.ACTIVITY, content: <ActivityContent /> },
  { id: ProfilePageTab.PORTFOLIO, content: <PortfolioContent /> },
]

export const TOKEN_NAME = "ZONE"
