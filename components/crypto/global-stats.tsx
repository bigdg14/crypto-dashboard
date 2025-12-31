"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { useGlobalData } from "@/lib/hooks/useCrypto"
import { formatLargeNumber } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

export function GlobalStats() {
  const { data, isLoading, error } = useGlobalData()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
              <Skeleton className="h-4 w-[80px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Failed to load global market data
      </div>
    )
  }

  const marketCapChange = data.data.market_cap_change_percentage_24h_usd
  const isPositiveChange = marketCapChange >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatLargeNumber(data.data.total_market_cap.usd)}
          </div>
          <div
            className={`flex items-center gap-1 text-xs ${
              isPositiveChange ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>
              {isPositiveChange ? "+" : ""}
              {marketCapChange.toFixed(2)}% (24h)
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatLargeNumber(data.data.total_volume.usd)}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {data.data.markets.toLocaleString()} markets
          </p>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.data.market_cap_percentage.btc.toFixed(2)}%
          </div>
          <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all"
              style={{ width: `${data.data.market_cap_percentage.btc}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ETH Dominance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.data.market_cap_percentage.eth.toFixed(2)}%
          </div>
          <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${data.data.market_cap_percentage.eth}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
