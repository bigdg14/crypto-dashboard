"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { PortfolioTable } from "@/components/portfolio/portfolio-table"
import { PortfolioStats } from "@/components/portfolio/portfolio-stats"
import { AddHoldingDialog } from "@/components/portfolio/add-holding-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function PortfolioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </>
    )
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              My Portfolio
            </h1>
            <p className="text-muted-foreground">
              Track your cryptocurrency investments
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Holding
          </Button>
        </div>

        <PortfolioStats />
        <PortfolioTable />

        <AddHoldingDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </main>
    </>
  )
}
