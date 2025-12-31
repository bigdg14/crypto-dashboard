"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { AlertsTable } from "@/components/alerts/alerts-table"
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AlertsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
              Price Alerts
            </h1>
            <p className="text-muted-foreground">
              Get notified when cryptocurrencies reach your target prices
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>

        <AlertsTable />

        <CreateAlertDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
        />
      </main>
    </>
  )
}
