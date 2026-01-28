import { useEffect } from "react"
import { usePortfolio } from "@/store/hooks"

import {
  Box,
  Card,
  Loader,
  PortfolioItem,
  Price,
  PriceChange,
  Typography,
} from "../../../components"
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

  if (!loading && !data) {
    return "Portfolio data is not found"
  }

  return (
    <Box gap={4} direction="column">
      <Box flex gap={1} direction="column">
        <Typography.Caption>Portfolio</Typography.Caption>

        <Typography.Text size="3xl">
          ${data.zone_balance_usd} ({data.zone_balance} {TOKEN_NAME})
        </Typography.Text>

        <PriceChange
          countUsd={data.zone_balance_usd}
          isPositive={data.balance_diff_positive}
          percentageDiff={data.zone_balance_diff_percentage}
        />
      </Box>

      <Card>
        <Box flex direction="column" gap={3}>
          <Typography.Text size="lg">Wallet</Typography.Text>
          <PortfolioItem
            imageUrl={data.items[0].imageUrl}
            name="Alienzone"
            after={<Price price={data.zone_balance} tokenName={TOKEN_NAME} />}
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
                    percentageDiff={item.price_diff_24h}
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
                count={item.amount}
                after={<Price price={item.price} tokenName={TOKEN_NAME} />}
              />
            ))}
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
