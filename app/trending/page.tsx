"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTrending } from "@/lib/hooks/useCrypto"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import Link from "next/link"
import { TrendingUp, Star } from "lucide-react"
import { WatchlistIconButton } from "@/components/watchlist/watchlist-icon-button"

export default function TrendingPage() {
  const { data: trending, isLoading, error } = useTrending()

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <TrendingUp className="h-10 w-10 text-primary" />
            Trending Cryptocurrencies
          </h1>
          <p className="text-muted-foreground">
            Top trending coins on CoinGecko in the last 24 hours
          </p>
        </div>

        {isLoading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(9)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {error && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Failed to load trending coins. Please try again later.
            </CardContent>
          </Card>
        )}

        {trending && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trending.map((item, index) => {
              const coin = item.item
              return (
                <Card key={coin.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={coin.large}
                            alt={coin.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                            #{index + 1}
                          </div>
                        </div>
                        <div>
                          <Link href={`/coin/${coin.id}`} className="hover:underline">
                            <h3 className="font-bold text-lg">{coin.name}</h3>
                          </Link>
                          <p className="text-sm text-muted-foreground uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <WatchlistIconButton
                          coinId={coin.id}
                          coinSymbol={coin.symbol}
                          coinName={coin.name}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Market Cap Rank</span>
                      <span className="font-medium">#{coin.market_cap_rank}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Price (BTC)</span>
                      <span className="font-medium font-mono">
                        {coin.price_btc.toFixed(8)} BTC
                      </span>
                    </div>

                    {coin.score !== undefined && (
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Trending Score</span>
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-blue-600"
                                style={{ width: `${(coin.score / 10) * 100}%` }}
                              />
                            </div>
                            <span className="font-medium">{coin.score}/10</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Link href={`/coin/${coin.id}`}>
                      <button className="w-full mt-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors text-sm font-medium">
                        View Details
                      </button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {trending && trending.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No trending coins at the moment.
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
