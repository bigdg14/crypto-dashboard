"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useCoins } from "@/lib/hooks/useCrypto"
import { Search, ArrowRightLeft } from "lucide-react"
import Image from "next/image"

export default function ConverterPage() {
  const [amount, setAmount] = useState("1")
  const [fromCoin, setFromCoin] = useState<any>(null)
  const [toCoin, setToCoin] = useState<any>(null)
  const [fromSearch, setFromSearch] = useState("")
  const [toSearch, setToSearch] = useState("")
  const [showFromResults, setShowFromResults] = useState(false)
  const [showToResults, setShowToResults] = useState(false)

  const { data: coins } = useCoins(1, 100)

  const filteredFromCoins = coins?.filter(coin =>
    coin.name.toLowerCase().includes(fromSearch.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(fromSearch.toLowerCase())
  ).slice(0, 5) || []

  const filteredToCoins = coins?.filter(coin =>
    coin.name.toLowerCase().includes(toSearch.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(toSearch.toLowerCase())
  ).slice(0, 5) || []

  const calculateConversion = () => {
    if (!fromCoin || !toCoin || !amount) return 0
    const amountNum = parseFloat(amount)
    const fromPrice = fromCoin.current_price
    const toPrice = toCoin.current_price
    return (amountNum * fromPrice) / toPrice
  }

  const swap = () => {
    setFromCoin(toCoin)
    setToCoin(fromCoin)
    setFromSearch("")
    setToSearch("")
  }

  const result = calculateConversion()

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Crypto Converter
            </h1>
            <p className="text-muted-foreground">
              Convert between cryptocurrencies at real-time prices
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Currency Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Currency */}
              <div className="space-y-2">
                <Label>From</Label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search coin..."
                        value={fromSearch}
                        onChange={(e) => {
                          setFromSearch(e.target.value)
                          setShowFromResults(true)
                        }}
                        onFocus={() => setShowFromResults(true)}
                        className="pl-9"
                      />
                    </div>

                    {showFromResults && fromSearch && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredFromCoins.map((coin) => (
                          <button
                            key={coin.id}
                            type="button"
                            onClick={() => {
                              setFromCoin(coin)
                              setFromSearch("")
                              setShowFromResults(false)
                            }}
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

                    {fromCoin && !fromSearch && (
                      <div className="mt-2 p-3 border rounded-md bg-muted/50 flex items-center gap-3">
                        <Image
                          src={fromCoin.image}
                          alt={fromCoin.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{fromCoin.name}</div>
                          <div className="text-sm text-muted-foreground uppercase">
                            {fromCoin.symbol}
                          </div>
                        </div>
                        <div className="text-right">
                          ${fromCoin.current_price.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>

                  <Input
                    type="number"
                    step="any"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-32"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swap}
                  disabled={!fromCoin && !toCoin}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
              </div>

              {/* To Currency */}
              <div className="space-y-2">
                <Label>To</Label>
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search coin..."
                      value={toSearch}
                      onChange={(e) => {
                        setToSearch(e.target.value)
                        setShowToResults(true)
                      }}
                      onFocus={() => setShowToResults(true)}
                      className="pl-9"
                    />
                  </div>

                  {showToResults && toSearch && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredToCoins.map((coin) => (
                        <button
                          key={coin.id}
                          type="button"
                          onClick={() => {
                            setToCoin(coin)
                            setToSearch("")
                            setShowToResults(false)
                          }}
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

                  {toCoin && !toSearch && (
                    <div className="mt-2 p-3 border rounded-md bg-muted/50 flex items-center gap-3">
                      <Image
                        src={toCoin.image}
                        alt={toCoin.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{toCoin.name}</div>
                        <div className="text-sm text-muted-foreground uppercase">
                          {toCoin.symbol}
                        </div>
                      </div>
                      <div className="text-right">
                        ${toCoin.current_price.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Result */}
              {fromCoin && toCoin && amount && (
                <div className="pt-4 border-t">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Conversion Result</p>
                    <p className="text-3xl font-bold">
                      {result.toLocaleString(undefined, { maximumFractionDigits: 8 })} {toCoin.symbol.toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {amount} {fromCoin.symbol.toUpperCase()} = {result.toLocaleString(undefined, { maximumFractionDigits: 8 })} {toCoin.symbol.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      1 {fromCoin.symbol.toUpperCase()} = {(fromCoin.current_price / toCoin.current_price).toLocaleString(undefined, { maximumFractionDigits: 8 })} {toCoin.symbol.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
