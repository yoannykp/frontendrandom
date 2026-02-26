import { ReactNode } from "react"

import { Avatar, Typography } from "@/components/pages/profile/components"

import { Box } from "../Box"

interface PortfolioItemProps {
  imageUrl: string
  count?: string
  name: string
  after: ReactNode
}

export const PortfolioItem = ({
  imageUrl,
  count,
  name,
  after,
}: PortfolioItemProps) => (
  <Box flex align="center" justify="between">
    <Box flex align="center" gap={1}>
      <Avatar url={imageUrl} altText={name} size={32} />
      <Box flex direction="column" gap={1}>
        <Typography.Text font="secondary">{name}</Typography.Text>
        {count && (
          <Typography.Text font="secondary" color="caption" size="2xs">
            {count}
          </Typography.Text>
        )}
      </Box>
    </Box>
    {after || <div></div>}
  </Box>
)
