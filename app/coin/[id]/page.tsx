"use client"

import { use } from "react"
import { useState } from "react"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { useCoinDetail, useCoinMarketChart } from "@/lib/hooks/useCrypto"
import { CoinChart } from "@/components/crypto/coin-chart"
import { PriceChange } from "@/components/crypto/price-change"
import { formatCurrency, formatLargeNumber } from "@/lib/utils"
import { Star, TrendingUp, TrendingDown } from "lucide-react"
import { format } from "date-fns"

export default function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [timeframe, setTimeframe] = useState<number | "max">(7)
  const { data: coin, isLoading: coinLoading } = useCoinDetail(id)
  const { data: chartData, isLoading: chartLoading, error: chartError } = useCoinMarketChart(id, timeframe)

  if (coinLoading) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-96 w-full" />
        </main>
      </>
    )
  }

  if (!coin) {
    return (
      <>
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground">
            Cryptocurrency not found
          </div>
        </main>
      </>
    )
  }

  const priceChange24h = coin.market_data.price_change_percentage_24h

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">{coin.name}</h1>
                <span className="text-2xl text-muted-foreground uppercase">
                  {coin.symbol}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground">
                  Rank #{coin.market_cap_rank}
                </span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="lg">
            <Star className="h-4 w-4 mr-2" />
            Add to Watchlist
          </Button>
        </div>

        {/* Price Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatCurrency(coin.market_data.current_price.usd)}
              </div>
              <PriceChange value={priceChange24h} className="mt-2" />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Market Cap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatLargeNumber(coin.market_data.market_cap.usd)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Rank #{coin.market_cap_rank}
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                24h Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatLargeNumber(coin.market_data.total_volume.usd)}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Circulating Supply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {coin.market_data.circulating_supply.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                <span className="text-sm text-muted-foreground uppercase">
                  {coin.symbol}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Chart */}
        <Card className="glass p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Price Chart</h2>
            <Tabs value={timeframe.toString()} onValueChange={(v) => setTimeframe(v === "max" ? "max" : Number(v))}>
              <TabsList>
                <TabsTrigger value="1">1D</TabsTrigger>
                <TabsTrigger value="7">7D</TabsTrigger>
                <TabsTrigger value="30">30D</TabsTrigger>
                <TabsTrigger value="365">1Y</TabsTrigger>
                <TabsTrigger value="max">MAX</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {chartLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : chartError ? (
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-3">
                <p className="text-lg font-medium">Failed to load chart data</p>
                <p className="text-sm">
                  {(chartError as any)?.response?.status === 429
                    ? "⚠️ Rate limit reached. Please wait 60 seconds and try again."
                    : "Please try a different timeframe or wait a moment and refresh."
                  }
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Refresh Page
                </Button>
              </div>
            </div>
          ) : chartData ? (
            <CoinChart data={chartData} timeframe={timeframe.toString()} />
          ) : (
            <div className="h-96 flex items-center justify-center text-muted-foreground">
              No chart data available
            </div>
          )}
        </Card>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h High</span>
                <span className="font-medium">
                  {formatCurrency(coin.market_data.high_24h.usd)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">24h Low</span>
                <span className="font-medium">
                  {formatCurrency(coin.market_data.low_24h.usd)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">All-Time High</span>
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(coin.market_data.ath.usd)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(coin.market_data.ath_date.usd), "MMM dd, yyyy")}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">All-Time Low</span>
                <div className="text-right">
                  <div className="font-medium">
                    {formatCurrency(coin.market_data.atl.usd)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(coin.market_data.atl_date.usd), "MMM dd, yyyy")}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass p-6">
            <h3 className="text-xl font-bold mb-4">Supply Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Circulating Supply</span>
                <span className="font-medium">
                  {coin.market_data.circulating_supply.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              {coin.market_data.total_supply && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Supply</span>
                  <span className="font-medium">
                    {coin.market_data.total_supply.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              )}
              {coin.market_data.max_supply && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Supply</span>
                  <span className="font-medium">
                    {coin.market_data.max_supply.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fully Diluted Valuation</span>
                <span className="font-medium">
                  {formatLargeNumber(coin.market_data.fully_diluted_valuation.usd)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Price Changes */}
        <Card className="glass p-6">
          <h3 className="text-xl font-bold mb-4">Price Changes</h3>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">24 Hours</p>
              <PriceChange value={coin.market_data.price_change_percentage_24h} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">7 Days</p>
              <PriceChange value={coin.market_data.price_change_percentage_7d} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">30 Days</p>
              <PriceChange value={coin.market_data.price_change_percentage_30d} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">1 Year</p>
              <PriceChange value={coin.market_data.price_change_percentage_1y} />
            </div>
          </div>
        </Card>
      </main>
    </>
  )
}
