"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, ExternalLink, TrendingUp, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"

interface CryptoPanicPost {
  id: number
  slug: string
  title: string
  url: string // CryptoPanic URL
  original_url?: string // Original article URL
  description?: string
  image?: string // Cover image URL
  source?: {
    title: string
    domain: string
    region: string
    type: string
  }
  published_at: string
  created_at: string
  instruments?: Array<{
    code: string
    title: string
    slug: string
    url: string
  }>
  kind: string
  votes?: {
    positive: number
    negative: number
    important: number
  }
  panic_score?: number
  author?: string
}

interface CryptoPanicResponse {
  count: number
  next: string | null
  previous: string | null
  results: CryptoPanicPost[]
}

function getSentiment(votes?: CryptoPanicPost["votes"]): "positive" | "negative" | "neutral" {
  if (!votes) return "neutral"
  const total = votes.positive + votes.negative
  if (total === 0) return "neutral"

  const positiveRatio = votes.positive / total
  if (positiveRatio > 0.6) return "positive"
  if (positiveRatio < 0.4) return "negative"
  return "neutral"
}

export default function NewsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["news"],
    queryFn: async () => {
      const response = await fetch("/api/news")
      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }
      const isDemoMode = response.headers.get("X-Demo-Mode") === "true"
      const jsonData = await response.json()
      return { ...jsonData, isDemoMode } as CryptoPanicResponse & { isDemoMode?: boolean }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: 30 * 60 * 1000, // Refetch every 30 minutes
  })

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

        {data?.isDemoMode && (
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Demo Mode - Using Mock News Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground">
                The CryptoPanic API is currently not available. Displaying demo news data with realistic formatting.
                To integrate live news, verify your API key at{" "}
                <a
                  href="https://cryptopanic.com/developers/api/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  CryptoPanic API
                </a>
              </p>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-500/50 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Failed to Load News
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground">
                Unable to fetch news. Please try again later.
              </p>
            </CardContent>
          </Card>
        )}

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

        {!isLoading && !error && data?.results && (
          <div className="space-y-4">
            {data.results.map((article) => {
              const sentiment = getSentiment(article.votes)
              return (
                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {article.image && (
                        <div className="shrink-0">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <a
                              href={article.original_url || article.url || `https://cryptopanic.com/news/${article.id}/${article.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group"
                            >
                              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                                {article.title}
                              </h3>
                            </a>
                            {article.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {article.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                              {article.source?.title && (
                                <>
                                  <span className="font-medium">{article.source.title}</span>
                                  <span>•</span>
                                </>
                              )}
                              <span>
                                {formatDistanceToNow(new Date(article.published_at), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                          {article.votes && (
                            <Badge
                              variant={
                                sentiment === "positive"
                                  ? "default"
                                  : sentiment === "negative"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className="shrink-0"
                            >
                              {sentiment === "positive" && <TrendingUp className="h-3 w-3 mr-1" />}
                              {sentiment === "negative" && <AlertCircle className="h-3 w-3 mr-1" />}
                              {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                            </Badge>
                          )}
                        </div>

                        {article.instruments && article.instruments.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {article.instruments.slice(0, 5).map((instrument) => (
                              <Badge key={instrument.code} variant="outline" className="text-xs">
                                {instrument.code}
                              </Badge>
                            ))}
                            {article.instruments.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{article.instruments.length - 5} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <a
                            href={article.original_url || article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            Read full article
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          {article.votes && article.votes.important > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {article.votes.important} voted important
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* API Info */}
        {!isLoading && !error && data && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {data.isDemoMode ? "Demo news data" : (
                    <>
                      Powered by{" "}
                      <a
                        href="https://cryptopanic.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        CryptoPanic
                      </a>
                    </>
                  )}
                </span>
                <span>
                  Showing {data.results.length} articles
                  {!data.isDemoMode && " • Updated every 30 minutes"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  )
}
