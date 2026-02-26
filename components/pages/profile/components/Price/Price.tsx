import {
  PriceChangeSmall,
  Typography,
} from "@/components/pages/profile/components"

import { Box } from "../Box"

interface PriceProps {
  price: string
  tokenName: string
  isPositive?: boolean
  percentageDiff?: string
}

export const Price = ({
  price,
  tokenName,
  isPositive,
  percentageDiff,
}: PriceProps) => {
  return (
    <Box flex direction="column" align="end" gap={1}>
      <Typography.Text font="secondary">
        {price} {tokenName}
      </Typography.Text>
      {isPositive && percentageDiff && (
        <PriceChangeSmall
          isPositive={isPositive}
          percentageDiff={percentageDiff}
        />
      )}
    </Box>
  )
}
