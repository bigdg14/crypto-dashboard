"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, ExternalLink, TrendingUp, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Mock news data - In production, integrate with CryptoPanic API or similar
const mockNews = [
  {
    id: 1,
    title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
    source: "CoinDesk",
    url: "#",
    published: "2 hours ago",
    sentiment: "positive" as const,
    tags: ["Bitcoin", "Institutional", "Market"],
  },
  {
    id: 2,
    title: "Ethereum 2.0 Upgrade Brings Major Improvements to Network",
    source: "CryptoSlate",
    url: "#",
    published: "4 hours ago",
    sentiment: "positive" as const,
    tags: ["Ethereum", "Technology", "Upgrade"],
  },
  {
    id: 3,
    title: "SEC Delays Decision on Multiple Bitcoin ETF Applications",
    source: "Bloomberg Crypto",
    url: "#",
    published: "6 hours ago",
    sentiment: "neutral" as const,
    tags: ["Regulation", "Bitcoin", "ETF"],
  },
  {
    id: 4,
    title: "Major Exchange Reports Record Trading Volumes",
    source: "The Block",
    url: "#",
    published: "8 hours ago",
    sentiment: "positive" as const,
    tags: ["Trading", "Market", "Volume"],
  },
  {
    id: 5,
    title: "DeFi Protocol Suffers Security Breach, Users Warned",
    source: "CoinTelegraph",
    url: "#",
    published: "10 hours ago",
    sentiment: "negative" as const,
    tags: ["DeFi", "Security", "Warning"],
  },
  {
    id: 6,
    title: "Stablecoin Market Cap Reaches $150 Billion Milestone",
    source: "Decrypt",
    url: "#",
    published: "12 hours ago",
    sentiment: "positive" as const,
    tags: ["Stablecoins", "Market", "Milestone"],
  },
  {
    id: 7,
    title: "Central Bank Announces Digital Currency Pilot Program",
    source: "Reuters",
    url: "#",
    published: "14 hours ago",
    sentiment: "neutral" as const,
    tags: ["CBDC", "Regulation", "Banking"],
  },
  {
    id: 8,
    title: "NFT Marketplace Launches New Features for Creators",
    source: "CoinDesk",
    url: "#",
    published: "16 hours ago",
    sentiment: "positive" as const,
    tags: ["NFT", "Technology", "Creators"],
  },
]

export default function NewsPage() {
  const isLoading = false

  return (
    <>
      <Navigation />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
            <Newspaper className="h-10 w-10 text-primary" />
            Crypto News
          </h1>
          <p className="text-muted-foreground">
            Latest cryptocurrency news and market updates
          </p>
        </div>

        {/* News API Integration Notice */}
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              Demo Mode - News API Integration Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="text-muted-foreground">
              To display live crypto news, integrate one of these free APIs:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
              <li>
                <a
                  href="https://cryptopanic.com/developers/api/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  CryptoPanic API
                </a>{" "}
                - Free tier: 50 requests/day
              </li>
              <li>
                <a
                  href="https://newsapi.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  NewsAPI
                </a>{" "}
                - Free tier: 100 requests/day
              </li>
              <li>
                <a
                  href="https://cryptocompare.com/cryptopian/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  CryptoCompare News API
                </a>{" "}
                - Free tier available
              </li>
            </ul>
            <p className="text-sm pt-2">
              Add your API key to <code className="px-2 py-1 bg-muted rounded">.env.local</code> as{" "}
              <code className="px-2 py-1 bg-muted rounded">NEWS_API_KEY</code>
            </p>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (
          <div className="space-y-4">
            {mockNews.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                        </a>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="font-medium">{article.source}</span>
                          <span>•</span>
                          <span>{article.published}</span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          article.sentiment === "positive"
                            ? "default"
                            : article.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                        }
                        className="shrink-0"
                      >
                        {article.sentiment === "positive" && (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        )}
                        {article.sentiment === "negative" && (
                          <AlertCircle className="h-3 w-3 mr-1" />
                        )}
                        {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      Read full article
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* How to integrate real news */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">How to Integrate Real News</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">1. Get a free API key</h4>
              <p className="text-muted-foreground">
                Sign up at CryptoPanic or NewsAPI and get your free API key
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Add to environment variables</h4>
              <pre className="p-3 bg-muted rounded-md overflow-x-auto">
                NEWS_API_KEY="your-api-key-here"
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">3. Create API route</h4>
              <p className="text-muted-foreground mb-2">
                Create <code className="px-1 py-0.5 bg-muted rounded">app/api/news/route.ts</code>:
              </p>
              <pre className="p-3 bg-muted rounded-md overflow-x-auto text-xs">
{`export async function GET() {
  const response = await fetch(
    'https://cryptopanic.com/api/v1/posts/?auth_token=' +
    process.env.NEWS_API_KEY
  )
  const data = await response.json()
  return Response.json(data)
}`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">4. Fetch in component</h4>
              <p className="text-muted-foreground">
                Use React Query to fetch from <code className="px-1 py-0.5 bg-muted rounded">/api/news</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
