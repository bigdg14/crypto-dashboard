"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { coinGeckoApi } from "@/lib/api/coingecko"
import { toast } from "sonner"
import Image from "next/image"

interface PortfolioHolding {
  id: string
  coinId: string
  coinSymbol: string
  coinName: string
  amount: string
  purchasePrice: string
  purchaseDate: string
}

export function PortfolioTable() {
  const queryClient = useQueryClient()

  const { data: holdings, isLoading } = useQuery({
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

  const { data: coinDetails } = useQuery({
    queryKey: ["portfolio-details", holdings],
    queryFn: async () => {
      if (!holdings || holdings.length === 0) return {}

      const coins = await Promise.all(
        [...new Set(holdings.map(h => h.coinId))].map(async (coinId) => {
          const coin = await coinGeckoApi.getCoinDetail(coinId)
          return { [coinId]: coin }
        })
      )

      return Object.assign({}, ...coins)
    },
    enabled: !!holdings && holdings.length > 0,
    staleTime: 60 * 1000,
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/portfolio/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete holding")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast.success("Holding removed from portfolio")
    },
    onError: () => {
      toast.error("Failed to remove holding")
    },
  })

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    )
  }

  if (!holdings || holdings.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p className="text-muted-foreground">No holdings yet. Add your first cryptocurrency!</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Holdings</TableHead>
            <TableHead className="text-right">Avg. Buy Price</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Profit/Loss</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {holdings.map((holding) => {
            const amount = parseFloat(holding.amount)
            const purchasePrice = parseFloat(holding.purchasePrice)
            const currentPrice = currentPrices?.[holding.coinId]?.usd || 0
            const priceChange = currentPrices?.[holding.coinId]?.usd_24h_change || 0

            const invested = amount * purchasePrice
            const currentValue = amount * currentPrice
            const profit = currentValue - invested
            const profitPercentage = invested > 0 ? (profit / invested) * 100 : 0

            const isPositive = profit >= 0
            const coinImage = coinDetails?.[holding.coinId]?.image?.small

            return (
              <TableRow key={holding.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {coinImage && (
                      <Image
                        src={coinImage}
                        alt={holding.coinName || holding.coinSymbol}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{holding.coinName || holding.coinSymbol}</div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {holding.coinSymbol}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  {amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                </TableCell>
                <TableCell className="text-right">
                  ${purchasePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(priceChange).toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell className={`text-right font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  <div>
                    {isPositive ? "+" : ""}${profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs">
                    {isPositive ? "+" : ""}{profitPercentage.toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(holding.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
