import { ChartCaretIcon } from "@/components/icons"
import { Typography } from "@/components/pages/profile/components"

import { Box } from "../Box"

interface PriceChangeProps {
  isPositive: boolean
  countUsd: string
  percentageDiff: string
}

export const PriceChange = ({
  isPositive,
  countUsd,
  percentageDiff,
}: PriceChangeProps) => {
  const changeSymbol = isPositive ? "+" : "-"
  const pricesString = `${changeSymbol}$${countUsd} ${changeSymbol}${percentageDiff}%`

  return (
    <Box flex gap={1} align="center">
      <ChartCaretIcon
        rotate={isPositive ? 0 : 180}
        fill={isPositive ? "#5FFF95" : "#FF3F3F"}
      />
      <Typography.Text
        color={isPositive ? "positive" : "negative"}
        font="secondary"
      >
        {pricesString}
      </Typography.Text>
    </Box>
  )
}

type PriceChangeSmallProps = Pick<
  PriceChangeProps,
  "isPositive" | "percentageDiff"
>

export const PriceChangeSmall = ({
  isPositive,
  percentageDiff,
}: PriceChangeSmallProps) => {
  const changeSymbol = isPositive ? "+" : "-"

  return (
    <Typography.Text
      color={isPositive ? "positive" : "negative"}
      font="secondary"
      size="2xs"
    >
      {changeSymbol}
      {percentageDiff}
    </Typography.Text>
  )
}
