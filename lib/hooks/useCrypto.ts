"use client"

import { useQuery } from "@tanstack/react-query"
import { coinGeckoApi, withRetry } from "../api/coingecko"

export function useCoins(page: number = 1, perPage: number = 20) {
  return useQuery({
    queryKey: ["coins", page, perPage],
    queryFn: () =>
      withRetry(() =>
        coinGeckoApi.getCoins({
          page,
          per_page: perPage,
          sparkline: true,
          price_change_percentage: "1h,24h,7d",
        })
      ),
    staleTime: 30 * 1000, // Cache for 30 seconds
  })
}

export function useCoinDetail(coinId: string) {
  return useQuery({
    queryKey: ["coin", coinId],
    queryFn: () => withRetry(() => coinGeckoApi.getCoinDetail(coinId)),
    enabled: !!coinId,
    staleTime: 30 * 1000, // Cache for 30 seconds
  })
}

export function useCoinMarketChart(coinId: string, days: number | "max" = 7) {
  return useQuery({
    queryKey: ["coinChart", coinId, days],
    queryFn: () => withRetry(() => coinGeckoApi.getCoinMarketChart(coinId, days)),
    enabled: !!coinId,
    staleTime: 30 * 1000, // Cache for 30 seconds
    retry: 2, // Retry 2 times before showing error
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  })
}

export function useGlobalData() {
  return useQuery({
    queryKey: ["global"],
    queryFn: () => withRetry(() => coinGeckoApi.getGlobalData()),
    staleTime: 60 * 1000, // Cache for 1 minute
  })
}

export function useTrending() {
  return useQuery({
    queryKey: ["trending"],
    queryFn: () => withRetry(() => coinGeckoApi.getTrending()),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}

export function useSearchCoins(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => withRetry(() => coinGeckoApi.searchCoins(query)),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
  })
}
