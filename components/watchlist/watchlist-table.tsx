"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, TrendingUp, TrendingDown, ArrowRight } from "lucide-react"
import { coinGeckoApi } from "@/lib/api/coingecko"
import { toast } from "sonner"

interface WatchlistCoin {
  id: string
  coinId: string
  coinSymbol: string
  coinName: string
}

export function WatchlistTable() {
  const queryClient = useQueryClient()

  const { data: watchlistCoins, isLoading } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      const response = await fetch("/api/watchlist")
      if (!response.ok) throw new Error("Failed to fetch watchlist")
      return response.json() as Promise<WatchlistCoin[]>
    },
  })

  const { data: coinPrices } = useQuery({
    queryKey: ["watchlist-prices", watchlistCoins],
    queryFn: async () => {
      if (!watchlistCoins || watchlistCoins.length === 0) return {}

      const coinIds = [...new Set(watchlistCoins.map(c => c.coinId))].join(",")
      const response = await coinGeckoApi.getSimplePrice(coinIds, "usd", {
        include_24hr_change: true,
      })
      return response
    },
    enabled: !!watchlistCoins && watchlistCoins.length > 0,
    staleTime: 30 * 1000,
  })

  const { data: coinDetails } = useQuery({
    queryKey: ["watchlist-details", watchlistCoins],
    queryFn: async () => {
      if (!watchlistCoins || watchlistCoins.length === 0) return {}

      const coins = await Promise.all(
        [...new Set(watchlistCoins.map(c => c.coinId))].map(async (coinId) => {
          const coin = await coinGeckoApi.getCoinDetail(coinId)
          return { [coinId]: coin }
        })
      )

      return Object.assign({}, ...coins)
    },
    enabled: !!watchlistCoins && watchlistCoins.length > 0,
    staleTime: 60 * 1000,
  })

  const removeMutation = useMutation({
    mutationFn: async (coinId: string) => {
      const response = await fetch(`/api/watchlist?coinId=${coinId}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to remove from watchlist")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] })
      toast.success("Removed from watchlist")
    },
    onError: () => {
      toast.error("Failed to remove from watchlist")
    },
  })

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-muted rounded"></div>
        <div className="h-96 bg-muted rounded"></div>
      </div>
    )
  }

  if (!watchlistCoins || watchlistCoins.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">
          Your watchlist is empty. Browse cryptocurrencies and add them to your watchlist!
        </p>
        <Button asChild>
          <Link href="/">Browse Coins</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlistCoins.map((coin) => {
            const price = coinPrices?.[coin.coinId]?.usd || 0
            const priceChange = coinPrices?.[coin.coinId]?.usd_24h_change || 0
            const marketCap = coinDetails?.[coin.coinId]?.market_data?.market_cap?.usd || 0
            const coinImage = coinDetails?.[coin.coinId]?.image?.small

            return (
              <TableRow key={coin.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {coinImage && (
                      <Image
                        src={coinImage}
                        alt={coin.coinName || coin.coinSymbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{coin.coinName || coin.coinSymbol}</div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {coin.coinSymbol}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center justify-end gap-1 ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {Math.abs(priceChange).toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/coin/${coin.coinId}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMutation.mutate(coin.coinId)}
                      disabled={removeMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
