export interface GetPortfolioItem {
  name: string
  price: string
  amount: string
  price_diff_percentage?: string
  price_diff_positive?: boolean
  picture_url: string
}

export interface GetPortfolioCharacter {
  name: string
  price: string
  picture_url: string
}

export interface GetPortfolioResponse {
  balance_summary: string
  balance_usd: string
  usd_balance_diff?: string
  usd_diff_percentage?: string
  usd_balance_diff_positive?: boolean
  wallet_zone_balance: string
  characters: GetPortfolioCharacter[]
  items: GetPortfolioItem[]
}
