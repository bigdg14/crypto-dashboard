import axios from "axios"
import type { Coin, CoinDetail, CoinMarketChart, GlobalData, TrendingCoin } from "../types/crypto"

const BASE_URL = "https://api.coingecko.com/api/v3"

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
})

// CoinGecko API key handling
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY

// Add request interceptor to append API key as query parameter
if (API_KEY) {
  api.interceptors.request.use((config) => {
    // Add API key as query parameter
    config.params = {
      ...config.params,
      x_cg_demo_api_key: API_KEY,
    }
    return config
  })
}

export const coinGeckoApi = {
  // Get list of coins with market data
  getCoins: async (params: {
    vs_currency?: string
    order?: string
    per_page?: number
    page?: number
    sparkline?: boolean
    price_change_percentage?: string
  } = {}) => {
    const defaultParams = {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 20,
      page: 1,
      sparkline: true,
      price_change_percentage: "1h,24h,7d",
    }

    const response = await api.get<Coin[]>("/coins/markets", {
      params: { ...defaultParams, ...params },
    })
    return response.data
  },

  // Get detailed data for a specific coin
  getCoinDetail: async (id: string) => {
    const response = await api.get<CoinDetail>(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
    })
    return response.data
  },

  // Get historical market data for a coin
  getCoinMarketChart: async (
    id: string,
    days: number | "max" = 7,
    vs_currency: string = "usd"
  ) => {
    // Demo API tier is limited to 365 days of historical data
    // "max" is not supported in Demo tier, use 365 days instead
    const daysParam = days === "max" ? 365 : days

    const response = await api.get<CoinMarketChart>(`/coins/${id}/market_chart`, {
      params: {
        vs_currency,
        days: daysParam,
      },
    })
    return response.data
  },

  // Get global market data
  getGlobalData: async () => {
    const response = await api.get<GlobalData>("/global")
    return response.data
  },

  // Get trending coins
  getTrending: async () => {
    const response = await api.get<{ coins: TrendingCoin[] }>("/search/trending")
    return response.data.coins
  },

  // Search for coins
  searchCoins: async (query: string) => {
    const response = await api.get("/search", {
      params: { query },
    })
    return response.data
  },

  // Get simple price for multiple coins
  getSimplePrice: async (ids: string, vs_currencies: string, options?: { include_24hr_change?: boolean }) => {
    const response = await api.get("/simple/price", {
      params: {
        ids,
        vs_currencies,
        ...options,
      },
    })
    return response.data
  },
}

// Helper function to handle rate limiting
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error

    if (axios.isAxiosError(error) && error.response?.status === 429) {
      // Rate limited, wait and retry
      await new Promise(resolve => setTimeout(resolve, delay))
      return withRetry(fn, retries - 1, delay * 2)
    }

    throw error
  }
}
