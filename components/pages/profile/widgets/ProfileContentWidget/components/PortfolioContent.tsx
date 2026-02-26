import { useEffect } from "react"
import { usePortfolio } from "@/store/hooks"

import { ALIENZONE_TOKEN_ICON_URL } from "@/lib/constants"
import {
  Box,
  Card,
  Loader,
  PortfolioItem,
  Price,
  PriceChange,
  Typography,
} from "@/components/pages/profile/components"

import { TOKEN_NAME } from "../constants"

export const PortfolioContent = () => {
  const { fetchPortfolio, loading, data } = usePortfolio()

  useEffect(() => {
    if (!data) {
      void fetchPortfolio()
    }
  }, [data, fetchPortfolio])

  if (loading) {
    return <Loader text={"Portfolio loading"} />
  }

  if (!loading || !data) {
    return "Portfolio data is not found"
  }

  const shouldShowPortfolioPriceChange = Boolean(
    data.usd_balance_diff &&
      data.usd_balance_diff_positive &&
      data.usd_diff_percentage
  )

  return (
    <Box gap={4} direction="column">
      <Box flex gap={1} direction="column">
        <Typography.Caption>Portfolio</Typography.Caption>

        <Typography.Text size="3xl">
          ${data.balance_usd} ({data.balance_summary} {TOKEN_NAME})
        </Typography.Text>

        {shouldShowPortfolioPriceChange && (
          <PriceChange
            countUsd={data.usd_balance_diff as string}
            isPositive={data.usd_balance_diff_positive as boolean}
            percentageDiff={data.usd_diff_percentage as string}
          />
        )}
      </Box>

      <Card>
        <Box flex direction="column" gap={3}>
          <Typography.Text size="lg">Wallet</Typography.Text>
          <PortfolioItem
            imageUrl={ALIENZONE_TOKEN_ICON_URL}
            name="Alienzone"
            after={
              <Price price={data.wallet_zone_balance} tokenName={TOKEN_NAME} />
            }
          ></PortfolioItem>
        </Box>
      </Card>

      <Card>
        <Box flex direction="column" gap={3}>
          <Typography.Text size="lg">Dojo Items</Typography.Text>
          <Box flex direction="column" gap={2}>
            {data.items.map((item) => (
              <PortfolioItem
                key={item.name}
                imageUrl={item.picture_url}
                name={item.name}
                count={item.amount}
                after={
                  <Price
                    price={item.price}
                    tokenName={TOKEN_NAME}
                    isPositive={item.price_diff_positive}
                    percentageDiff={item.price_diff_percentage}
                  />
                }
              />
            ))}
          </Box>
        </Box>
      </Card>

      <Card>
        <Box flex direction="column" gap={3}>
          <Typography.Text size="lg">Characters</Typography.Text>
          <Box flex direction="column" gap={2}>
            {data.characters.map((item) => (
              <PortfolioItem
                key={item.name}
                imageUrl={item.picture_url}
                name={item.name}
                after={<Price price={item.price} tokenName={TOKEN_NAME} />}
              />
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
