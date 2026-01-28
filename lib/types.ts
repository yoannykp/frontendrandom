export interface GetPortfolioItem {
  name: string
  price: string
  amount: string
  price_diff_24h: string
  price_diff_positive: boolean
  picture_url: string
}

export interface GetPortfolioCharacter {
  name: string
  price: string
  amount: string
  picture_url: string
}

export interface GetPortfolioResponse {
  zone_balance: string
  zone_balance_usd: string
  zone_balance_usd_diff: string
  zone_balance_diff_percentage: string
  balance_diff_positive: boolean
  characters: GetPortfolioCharacter[]
  items: GetPortfolioItem[]
}
