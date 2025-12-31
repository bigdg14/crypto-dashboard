import { Navigation } from "@/components/navigation"
import { GlobalStats } from "@/components/crypto/global-stats"
import { CoinsTable } from "@/components/crypto/coins-table"

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Cryptocurrency Market Overview
          </h1>
          <p className="text-muted-foreground">
            Real-time cryptocurrency prices and market data
          </p>
        </div>

        <GlobalStats />

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Top Cryptocurrencies</h2>
          <CoinsTable />
        </div>
      </main>
    </>
  )
}
