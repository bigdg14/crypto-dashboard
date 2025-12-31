"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Trash2, TrendingUp, TrendingDown } from "lucide-react"
import { coinGeckoApi } from "@/lib/api/coingecko"
import { toast } from "sonner"

interface Alert {
  id: string
  coinId: string
  coinSymbol: string
  targetPrice: string
  condition: "above" | "below"
  isActive: boolean
  createdAt: string
}

export function AlertsTable() {
  const queryClient = useQueryClient()

  const { data: alertsList, isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const response = await fetch("/api/alerts")
      if (!response.ok) throw new Error("Failed to fetch alerts")
      return response.json() as Promise<Alert[]>
    },
  })

  const { data: currentPrices } = useQuery({
    queryKey: ["alerts-prices", alertsList],
    queryFn: async () => {
      if (!alertsList || alertsList.length === 0) return {}

      const coinIds = [...new Set(alertsList.map(a => a.coinId))].join(",")
      const response = await coinGeckoApi.getSimplePrice(coinIds, "usd", {
        include_24hr_change: true,
      })
      return response
    },
    enabled: !!alertsList && alertsList.length > 0,
    staleTime: 30 * 1000,
  })

  const { data: coinDetails } = useQuery({
    queryKey: ["alerts-details", alertsList],
    queryFn: async () => {
      if (!alertsList || alertsList.length === 0) return {}

      const coins = await Promise.all(
        [...new Set(alertsList.map(a => a.coinId))].map(async (coinId) => {
          const coin = await coinGeckoApi.getCoinDetail(coinId)
          return { [coinId]: coin }
        })
      )

      return Object.assign({}, ...coins)
    },
    enabled: !!alertsList && alertsList.length > 0,
    staleTime: 60 * 1000,
  })

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await fetch(`/api/alerts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      })
      if (!response.ok) throw new Error("Failed to toggle alert")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/alerts/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete alert")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
      toast.success("Alert deleted")
    },
    onError: () => {
      toast.error("Failed to delete alert")
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

  if (!alertsList || alertsList.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">
          No price alerts yet. Create your first alert to get notified!
        </p>
        <p className="text-sm text-muted-foreground">
          Alerts will notify you when a coin reaches your target price.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead className="text-right">Current Price</TableHead>
            <TableHead className="text-right">Target Price</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alertsList.map((alert) => {
            const currentPrice = currentPrices?.[alert.coinId]?.usd || 0
            const targetPrice = parseFloat(alert.targetPrice)
            const priceChange = currentPrices?.[alert.coinId]?.usd_24h_change || 0
            const coinImage = coinDetails?.[alert.coinId]?.image?.small

            const isTriggered = alert.condition === "above"
              ? currentPrice >= targetPrice
              : currentPrice <= targetPrice

            return (
              <TableRow key={alert.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {coinImage && (
                      <Image
                        src={coinImage}
                        alt={alert.coinSymbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium uppercase">{alert.coinSymbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {coinDetails?.[alert.coinId]?.name}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div>
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                  </div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {priceChange >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(priceChange).toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                </TableCell>
                <TableCell>
                  <Badge variant={alert.condition === "above" ? "default" : "secondary"}>
                    {alert.condition === "above" ? "Above" : "Below"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {isTriggered ? (
                    <Badge className="bg-green-600">Triggered</Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Switch
                    checked={alert.isActive}
                    onCheckedChange={(checked) =>
                      toggleMutation.mutate({ id: alert.id, isActive: checked })
                    }
                    disabled={toggleMutation.isPending}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(alert.id)}
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
