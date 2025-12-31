"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface AddToWatchlistButtonProps {
  coinId: string
  coinSymbol: string
  coinName: string
}

export function AddToWatchlistButton({ coinId, coinSymbol, coinName }: AddToWatchlistButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: watchlist } = useQuery({
    queryKey: ["watchlist"],
    queryFn: async () => {
      if (!session) return []
      const response = await fetch("/api/watchlist")
      if (!response.ok) return []
      return response.json()
    },
    enabled: !!session,
  })

  const isInWatchlist = watchlist?.some((coin: any) => coin.coinId === coinId)

  const addMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coinId, coinSymbol, coinName }),
      })
      if (!response.ok) throw new Error("Failed to add to watchlist")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["watchlist"] })
      toast.success("Added to watchlist")
    },
    onError: (error: any) => {
      if (error.message.includes("already")) {
        toast.info("Already in watchlist")
      } else {
        toast.error("Failed to add to watchlist")
      }
    },
  })

  const removeMutation = useMutation({
    mutationFn: async () => {
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

  const handleClick = () => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (isInWatchlist) {
      removeMutation.mutate()
    } else {
      addMutation.mutate()
    }
  }

  return (
    <Button
      variant={isInWatchlist ? "default" : "outline"}
      onClick={handleClick}
      disabled={addMutation.isPending || removeMutation.isPending}
    >
      <Star className={`mr-2 h-4 w-4 ${isInWatchlist ? "fill-current" : ""}`} />
      {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
    </Button>
  )
}
