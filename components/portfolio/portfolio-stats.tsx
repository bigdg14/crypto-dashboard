"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import { coinGeckoApi } from "@/lib/api/coingecko"

interface PortfolioHolding {
  id: string
  coinId: string
  coinSymbol: string
  amount: string
  purchasePrice: string
}

export function PortfolioStats() {
  const { data: holdings } = useQuery({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const response = await fetch("/api/portfolio")
      if (!response.ok) throw new Error("Failed to fetch portfolio")
      return response.json() as Promise<PortfolioHolding[]>
    },
  })

  const { data: currentPrices } = useQuery({
    queryKey: ["portfolio-prices", holdings],
    queryFn: async () => {
      if (!holdings || holdings.length === 0) return {}

      const coinIds = [...new Set(holdings.map(h => h.coinId))].join(",")
      const response = await coinGeckoApi.getSimplePrice(coinIds, "usd", {
        include_24hr_change: true,
      })
      return response
    },
    enabled: !!holdings && holdings.length > 0,
    staleTime: 30 * 1000,
  })

  const stats = holdings?.reduce(
    (acc, holding) => {
      const amount = parseFloat(holding.amount)
      const purchasePrice = parseFloat(holding.purchasePrice)
      const currentPrice = currentPrices?.[holding.coinId]?.usd || 0

      const invested = amount * purchasePrice
      const currentValue = amount * currentPrice
      const profit = currentValue - invested

      return {
        totalInvested: acc.totalInvested + invested,
        totalValue: acc.totalValue + currentValue,
        totalProfit: acc.totalProfit + profit,
      }
    },
    { totalInvested: 0, totalValue: 0, totalProfit: 0 }
  ) || { totalInvested: 0, totalValue: 0, totalProfit: 0 }

  const profitPercentage = stats.totalInvested > 0
    ? ((stats.totalProfit / stats.totalInvested) * 100)
    : 0

  const isPositive = stats.totalProfit >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit/Loss</CardTitle>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}${stats.totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Return</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}{profitPercentage.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
