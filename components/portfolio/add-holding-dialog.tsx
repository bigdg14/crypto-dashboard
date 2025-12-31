"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchCoins } from "@/lib/hooks/useCrypto"
import { toast } from "sonner"
import { Search } from "lucide-react"
import Image from "next/image"

interface AddHoldingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddHoldingDialog({ open, onOpenChange }: AddHoldingDialogProps) {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCoin, setSelectedCoin] = useState<any>(null)
  const [amount, setAmount] = useState("")
  const [purchasePrice, setPurchasePrice] = useState("")
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const { data: searchResults } = useSearchCoins(searchQuery)

  const addMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to add holding")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] })
      toast.success("Holding added to portfolio")
      onOpenChange(false)
      // Reset form
      setSearchQuery("")
      setSelectedCoin(null)
      setAmount("")
      setPurchasePrice("")
      setPurchaseDate(new Date().toISOString().split("T")[0])
    },
    onError: () => {
      toast.error("Failed to add holding")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCoin || !amount || !purchasePrice || !purchaseDate) {
      toast.error("Please fill in all fields")
      return
    }

    addMutation.mutate({
      coinId: selectedCoin.id,
      coinSymbol: selectedCoin.symbol,
      coinName: selectedCoin.name,
      amount: parseFloat(amount),
      purchasePrice: parseFloat(purchasePrice),
      purchaseDate,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Holding</DialogTitle>
          <DialogDescription>
            Add a cryptocurrency to your portfolio
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
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePrice">Purchase Price (USD)</Label>
            <Input
              id="purchasePrice"
              type="number"
              step="any"
              placeholder="0.00"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
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
            <Button type="submit" disabled={addMutation.isPending} className="flex-1">
              {addMutation.isPending ? "Adding..." : "Add Holding"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
