"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCoins } from "@/lib/hooks/useCrypto"
import { Search, X } from "lucide-react"
import Image from "next/image"

export default function ComparePage() {
  const [selectedCoins, setSelectedCoins] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [showResults, setShowResults] = useState(false)

  const { data: coins } = useCoins(1, 100)

  const filteredCoins = coins?.filter(coin =>
    coin.name.toLowerCase().includes(search.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(search.toLowerCase())
  ).filter(coin => !selectedCoins.some(s => s.id === coin.id)).slice(0, 5) || []

  const addCoin = (coin: any) => {
    if (selectedCoins.length < 4) {
      setSelectedCoins([...selectedCoins, coin])
      setSearch("")
      setShowResults(false)
    }
  }

  const removeCoin = (coinId: string) => {
    setSelectedCoins(selectedCoins.filter(c => c.id !== coinId))
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Compare Cryptocurrencies
            </h1>
            <p className="text-muted-foreground">
              Compare up to 4 cryptocurrencies side by side
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Select Cryptocurrencies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Add Cryptocurrency ({selectedCoins.length}/4)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search coins..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setShowResults(true)
                    }}
                    onFocus={() => setShowResults(true)}
                    className="pl-9"
                    disabled={selectedCoins.length >= 4}
                  />
                </div>

                {showResults && search && (
                  <div className="absolute z-10 w-full max-w-2xl bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredCoins.map((coin) => (
                      <button
                        key={coin.id}
                        type="button"
                        onClick={() => addCoin(coin)}
                        className="w-full p-3 hover:bg-muted flex items-center gap-3 text-left"
                      >
                        <Image
                          src={coin.image}
                          alt={coin.name}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{coin.name}</div>
                          <div className="text-sm text-muted-foreground uppercase">
                            {coin.symbol}
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          ${coin.current_price.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedCoins.map((coin) => (
                  <div key={coin.id} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                    <Image
                      src={coin.image}
                      alt={coin.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="font-medium">{coin.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => removeCoin(coin.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {selectedCoins.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        {selectedCoins.map((coin) => (
                          <TableHead key={coin.id} className="text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Image
                                src={coin.image}
                                alt={coin.name}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                              <div>
                                <div className="font-medium">{coin.name}</div>
                                <div className="text-xs text-muted-foreground uppercase">
                                  {coin.symbol}
                                </div>
                              </div>
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Price</TableCell>
                        {selectedCoins.map((coin) => (
                          <TableCell key={coin.id} className="text-center">
                            ${coin.current_price.toLocaleString()}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Market Cap</TableCell>
                        {selectedCoins.map((coin) => (
                          <TableCell key={coin.id} className="text-center">
                            ${coin.market_cap.toLocaleString()}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">24h Volume</TableCell>
                        {selectedCoins.map((coin) => (
                          <TableCell key={coin.id} className="text-center">
                            ${coin.total_volume.toLocaleString()}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">24h Change</TableCell>
                        {selectedCoins.map((coin) => (
                          <TableCell key={coin.id} className="text-center">
                            <span className={coin.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"}>
                              {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                              {coin.price_change_percentage_24h.toFixed(2)}%
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Market Cap Rank</TableCell>
                        {selectedCoins.map((coin) => (
                          <TableCell key={coin.id} className="text-center">
                            #{coin.market_cap_rank}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Circulating Supply</TableCell>
                        {selectedCoins.map((coin) => (
                          <TableCell key={coin.id} className="text-center">
                            {coin.circulating_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                          </TableCell>
                        ))}
                      </TableRow>
                      {selectedCoins.some(c => c.total_supply) && (
                        <TableRow>
                          <TableCell className="font-medium">Total Supply</TableCell>
                          {selectedCoins.map((coin) => (
                            <TableCell key={coin.id} className="text-center">
                              {coin.total_supply ? coin.total_supply.toLocaleString(undefined, { maximumFractionDigits: 0 }) : "N/A"}
                            </TableCell>
                          ))}
                        </TableRow>
                      )}
                      <TableRow>
                        <TableCell className="font-medium">All-Time High</TableCell>
                        {selectedCoins.map((coin) => (
                          <TableCell key={coin.id} className="text-center">
                            ${coin.ath.toLocaleString()}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </>
  )
}
