import { GetPortfolioResponse } from "@/lib/types"

export const portfolioMock: GetPortfolioResponse = {
  balance_diff_positive: true,
  characters: [
    {
      name: "Alien#270",
      price: "10,000",
      amount: "1.6",
      picture_url:
        "https://alienzone-v2.s3.dualstack.us-west-1.amazonaws.com/traits/elements/fire.png",
    },
    {
      name: "Black Flames",
      price: "100,000",
      amount: "2.4",
      picture_url:
        "https://alienzone-v2.s3.dualstack.us-west-1.amazonaws.com/traits/elements/fire.png",
    },
    {
      name: "Mizugame",
      price: "987",
      amount: "14",
      picture_url:
        "https://alienzone-v2.s3.dualstack.us-west-1.amazonaws.com/traits/elements/fire.png",
    },
  ],
  items: [
    {
      name: "King Curse",
      price: "351",
      amount: "1",
      price_diff_24h: "9%",
      price_diff_positive: true,
      picture_url:
        "https://alienzone-v2.s3.dualstack.us-west-1.amazonaws.com/traits/elements/fire.png",
    },
    {
      name: "Black Flames",
      price: "556",
      amount: "2.4",
      price_diff_24h: "45.7%",
      price_diff_positive: true,
      picture_url:
        "https://alienzone-v2.s3.dualstack.us-west-1.amazonaws.com/traits/elements/fire.png",
    },
    {
      name: "Peaceful Torii",
      price: "1,100",
      amount: "2.6",
      price_diff_24h: "3%",
      price_diff_positive: false,
      picture_url:
        "https://alienzone-v2.s3.dualstack.us-west-1.amazonaws.com/traits/elements/fire.png",
    },
  ],
  zone_balance: "10.000",
  zone_balance_diff_percentage: "34.6",
  zone_balance_usd: "9,998,19",
  zone_balance_usd_diff: "1,179.31",
}
