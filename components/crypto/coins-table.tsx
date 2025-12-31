"use client"

import Image from "next/image"
import Link from "next/link"
import { Card } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import { useCoins } from "@/lib/hooks/useCrypto"
import { formatCurrency, formatLargeNumber } from "@/lib/utils"
import { PriceChange } from "./price-change"
import { SparklineChart } from "./sparkline-chart"
import { Star } from "lucide-react"
import { Button } from "../ui/button"

export function CoinsTable() {
  const { data: coins, isLoading, error } = useCoins(1, 20)

  if (isLoading) {
    return (
      <Card className="glass">
        <div className="p-6 space-y-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (error || !coins) {
    return (
      <Card className="glass">
        <div className="p-6 text-center text-muted-foreground">
          Failed to load cryptocurrency data
        </div>
      </Card>
    )
  }

  return (
    <Card className="glass animate-slide-up">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Coin</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">1h</TableHead>
              <TableHead className="text-right">24h</TableHead>
              <TableHead className="text-right">7d</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Supply</TableHead>
              <TableHead className="text-right w-[120px]">Last 7 Days</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coins.map((coin) => (
              <TableRow
                key={coin.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <TableCell className="font-medium">{coin.market_cap_rank}</TableCell>
                <TableCell>
                  <Link
                    href={`/coin/${coin.id}`}
                    className="flex items-center gap-3 hover:text-primary transition-colors"
                  >
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </Link>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(coin.current_price)}
                </TableCell>
                <TableCell className="text-right">
                  {coin.price_change_percentage_1h_in_currency !== undefined && (
                    <PriceChange
                      value={coin.price_change_percentage_1h_in_currency}
                      showIcon={false}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <PriceChange
                    value={coin.price_change_percentage_24h}
                    showIcon={false}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {coin.price_change_percentage_7d_in_currency !== undefined && (
                    <PriceChange
                      value={coin.price_change_percentage_7d_in_currency}
                      showIcon={false}
                    />
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {formatLargeNumber(coin.market_cap)}
                </TableCell>
                <TableCell className="text-right">
                  {formatLargeNumber(coin.total_volume)}
                </TableCell>
                <TableCell className="text-right">
                  {coin.circulating_supply.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}{" "}
                  <span className="text-muted-foreground uppercase text-xs">
                    {coin.symbol}
                  </span>
                </TableCell>
                <TableCell>
                  {coin.sparkline_in_7d && (
                    <SparklineChart data={coin.sparkline_in_7d.price} />
                  )}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" title="Add to watchlist">
                    <Star className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
