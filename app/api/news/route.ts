import { NextResponse } from "next/server"

// Mock news data as fallback
const mockNews = {
  count: 8,
  next: null,
  previous: null,
  results: [
    {
      id: 1,
      title: "Bitcoin Reaches New All-Time High Amid Institutional Adoption",
      url: "https://cryptopanic.com",
      source: { title: "CoinDesk", domain: "coindesk.com" },
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      currencies: [{ code: "BTC", title: "Bitcoin" }],
      kind: "news",
      votes: { positive: 45, negative: 2, important: 12 },
    },
    {
      id: 2,
      title: "Ethereum 2.0 Upgrade Brings Major Improvements to Network",
      url: "https://cryptopanic.com",
      source: { title: "CryptoSlate", domain: "cryptoslate.com" },
      published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      currencies: [{ code: "ETH", title: "Ethereum" }],
      kind: "news",
      votes: { positive: 38, negative: 5, important: 8 },
    },
    {
      id: 3,
      title: "SEC Delays Decision on Multiple Bitcoin ETF Applications",
      url: "https://cryptopanic.com",
      source: { title: "Bloomberg Crypto", domain: "bloomberg.com" },
      published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      currencies: [{ code: "BTC", title: "Bitcoin" }],
      kind: "news",
      votes: { positive: 15, negative: 18, important: 22 },
    },
    {
      id: 4,
      title: "Major Exchange Reports Record Trading Volumes",
      url: "https://cryptopanic.com",
      source: { title: "The Block", domain: "theblock.co" },
      published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      currencies: [{ code: "BTC", title: "Bitcoin" }, { code: "ETH", title: "Ethereum" }],
      kind: "news",
      votes: { positive: 32, negative: 3, important: 5 },
    },
    {
      id: 5,
      title: "DeFi Protocol Suffers Security Breach, Users Warned",
      url: "https://cryptopanic.com",
      source: { title: "CoinTelegraph", domain: "cointelegraph.com" },
      published_at: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
      currencies: [{ code: "ETH", title: "Ethereum" }],
      kind: "news",
      votes: { positive: 5, negative: 42, important: 35 },
    },
    {
      id: 6,
      title: "Stablecoin Market Cap Reaches $150 Billion Milestone",
      url: "https://cryptopanic.com",
      source: { title: "Decrypt", domain: "decrypt.co" },
      published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      currencies: [{ code: "USDT", title: "Tether" }, { code: "USDC", title: "USD Coin" }],
      kind: "news",
      votes: { positive: 28, negative: 8, important: 6 },
    },
    {
      id: 7,
      title: "Central Bank Announces Digital Currency Pilot Program",
      url: "https://cryptopanic.com",
      source: { title: "Reuters", domain: "reuters.com" },
      published_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
      currencies: [],
      kind: "news",
      votes: { positive: 20, negative: 15, important: 18 },
    },
    {
      id: 8,
      title: "NFT Marketplace Launches New Features for Creators",
      url: "https://cryptopanic.com",
      source: { title: "CoinDesk", domain: "coindesk.com" },
      published_at: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
      currencies: [{ code: "ETH", title: "Ethereum" }],
      kind: "news",
      votes: { positive: 35, negative: 4, important: 7 },
    },
  ],
}

export async function GET() {
  try {
    const apiKey = process.env.NEWS_API_KEY

    if (!apiKey) {
      // Return mock data if no API key configured
      return NextResponse.json(mockNews, {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
          "X-Demo-Mode": "true",
        },
      })
    }

    // Fetch from CryptoPanic API (Developer v2 endpoint)
    // public=true: only show news from public sources
    // kind=news: filter to news articles only
    const response = await fetch(
      `https://cryptopanic.com/api/developer/v2/posts/?auth_token=${apiKey}&public=true&kind=news`,
      {
        headers: {
          "Accept": "application/json",
        },
        next: {
          revalidate: 1800, // Cache for 30 minutes (1800 seconds)
        },
      }
    )

    if (!response.ok) {
      console.warn(`CryptoPanic API error: ${response.status}, falling back to mock data`)
      // Fall back to mock data on error
      return NextResponse.json(mockNews, {
        headers: {
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
          "X-Demo-Mode": "true",
        },
      })
    }

    const data = await response.json()

    // Return with cache headers
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    })
  } catch (error) {
    console.error("Error fetching news:", error)
    // Fall back to mock data on error
    return NextResponse.json(mockNews, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
        "X-Demo-Mode": "true",
      },
    })
  }
}
