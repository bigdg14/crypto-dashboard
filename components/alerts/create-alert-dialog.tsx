"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchCoins } from "@/lib/hooks/useCrypto"
import { toast } from "sonner"
import { Search } from "lucide-react"
import Image from "next/image"

interface CreateAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAlertDialog({ open, onOpenChange }: CreateAlertDialogProps) {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCoin, setSelectedCoin] = useState<any>(null)
  const [targetPrice, setTargetPrice] = useState("")
  const [condition, setCondition] = useState<"above" | "below">("above")

  const { data: searchResults } = useSearchCoins(searchQuery)

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create alert")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] })
      toast.success("Alert created successfully")
      onOpenChange(false)
      // Reset form
      setSearchQuery("")
      setSelectedCoin(null)
      setTargetPrice("")
      setCondition("above")
    },
    onError: () => {
      toast.error("Failed to create alert")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCoin || !targetPrice || !condition) {
      toast.error("Please fill in all fields")
      return
    }

    createMutation.mutate({
      coinId: selectedCoin.id,
      coinSymbol: selectedCoin.symbol,
      targetPrice: parseFloat(targetPrice),
      condition,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Price Alert</DialogTitle>
          <DialogDescription>
            Get notified when a cryptocurrency reaches your target price
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Search Cryptocurrency</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {searchResults?.coins && searchQuery && (
              <div className="max-h-48 overflow-y-auto border rounded-md">
                {searchResults.coins.slice(0, 5).map((coin: any) => (
                  <button
                    key={coin.id}
                    type="button"
                    onClick={() => {
                      setSelectedCoin(coin)
                      setSearchQuery("")
                    }}
                    className="w-full p-2 hover:bg-muted flex items-center gap-3 text-left"
                  >
                    {coin.large && (
                      <Image
                        src={coin.large}
                        alt={coin.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-medium">{coin.name}</div>
                      <div className="text-sm text-muted-foreground uppercase">
                        {coin.symbol}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedCoin && (
              <div className="p-3 border rounded-md bg-muted/50 flex items-center gap-3">
                {selectedCoin.large && (
                  <Image
                    src={selectedCoin.large}
                    alt={selectedCoin.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">{selectedCoin.name}</div>
                  <div className="text-sm text-muted-foreground uppercase">
                    {selectedCoin.symbol}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={(value: "above" | "below") => setCondition(value)}>
              <SelectTrigger id="condition">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Price goes above</SelectItem>
                <SelectItem value="below">Price goes below</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetPrice">Target Price (USD)</Label>
            <Input
              id="targetPrice"
              type="number"
              step="any"
              placeholder="0.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending} className="flex-1">
              {createMutation.isPending ? "Creating..." : "Create Alert"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
